#!/usr/bin/env bash
# Single-env audit: auto-loads .env.local and runs end-to-end checks safely.

set -u

BOLD="$(tput bold 2>/dev/null || true)"; RESET="$(tput sgr0 2>/dev/null || true)"
GREEN="$(tput setaf 2 2>/dev/null || true)"; RED="$(tput setaf 1 2>/dev/null || true)"
YELLOW="$(tput setaf 3 2>/dev/null || true)"; BLUE="$(tput setaf 4 2>/devnull || true)"

ok()   { echo "${GREEN}✅${RESET} ${BOLD}$*${RESET}"; }
warn() { echo "${YELLOW}⚠️ ${RESET}${BOLD}$*${RESET}"; }
err()  { echo "${RED}❌${RESET} ${BOLD}$*${RESET}"; }
run() { local s="$1"; shift; local msg="$1"; shift; echo "${BLUE}▶${RESET} $msg"; if "$@"; then ok "$msg"; else [ "$s" = fatal ] && { err "$msg (FAILED)"; exit 1; } || warn "$msg (FAILED)"; fi; }

require_cmd() { command -v "$1" >/dev/null 2>&1 || { err "Missing command: $1"; exit 1; }; }

USER_ID="${1:-u_demo}"   # allow passing user id as first arg, default u_demo
LIMIT="${2:-200}"

# --- tooling
require_cmd psql; require_cmd npx; require_cmd node
command -v jq >/dev/null 2>&1 || warn "jq not found; JSON previews will be basic."

# --- auto-source .env.local
if [ ! -f ".env.local" ]; then err "Missing .env.local in project root"; exit 1; fi
set -a; source .env.local; set +a
[ -n "${DATABASE_URL:-}" ] || { err "DATABASE_URL missing in .env.local"; exit 1; }

# --- helpers
psql_cmd() { psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "$1"; }
priority_dt() {
  local s="${1:-public}"
  local tbls="users meals meal_preferences food_exclusions macro_ranges nutrition_limits user_progress recommendations"
  local q="\\dt $(printf '%s.' "$s")$(echo "$tbls" | sed "s/ / ${s}./g")"
  psql "$DATABASE_URL" -c "$q"
}
count_recs() { local s="${1:-public}"; psql_cmd "select count(*) from ${s}.recommendations where user_id='${USER_ID}';" \
  | awk 'NR==3{print $1}'; }

# --- 1) DB push + basic checks
run fatal "Prisma db push (LOCAL)" npx prisma db push
run fatal "Prisma validate" npx prisma validate
run soft  "Show search_path" psql_cmd "show search_path;"
run soft  "Show current db/user/schema" psql_cmd "select current_database(), current_user, current_schema();"

# --- 2) List priority tables (assume public unless you’ve configured app in DB URL)
SCHEMA="public"
run soft "List priority tables (${SCHEMA})" priority_dt "$SCHEMA"

# --- 3) Optional seed
if grep -q '"seed"' package.json 2>/dev/null; then
  run soft "Run seed (idempotent expected)" npm run -s seed
else
  warn "No seed script found; skipping."
fi

# --- 4) Generate Prisma client
run fatal "Prisma generate" npx prisma generate

# --- 5) Determinism check (two identical json outputs expected)
TMP1="$(mktemp -t recs1.XXXXXX.json)"; TMP2="$(mktemp -t recs2.XXXXXX.json)"
RECOMPUTE_CMD=()

if [ -f "scripts/recomputeRecs.js" ]; then
  RECOMPUTE_CMD=(node scripts/recomputeRecs.js --user "$USER_ID" --limit "$LIMIT")
elif grep -q '"recomputeRecs"' package.json 2>/dev/null; then
  RECOMPUTE_CMD=(npm run -s recomputeRecs -- --user "$USER_ID" --limit "$LIMIT")
else
  warn "No recomputeRecs script found (scripts/recomputeRecs.js or npm script). Skipping run checks."
fi

if [ "${#RECOMPUTE_CMD[@]}" -gt 0 ]; then
  run fatal "Recompute #1 (determinism probe)" bash -c "${RECOMPUTE_CMD[*]} > '$TMP1'"
  run fatal "Recompute #2 (determinism probe)" bash -c "${RECOMPUTE_CMD[*]} > '$TMP2'"
  if diff -q "$TMP1" "$TMP2" >/dev/null 2>&1; then
    ok "Determinism: PASS (identical outputs)"
  else
    err "Determinism: FAIL (outputs differ)"
    command -v jq >/dev/null 2>&1 && { echo "--- Run #1 head ---"; jq '.[0:5]' "$TMP1" 2>/dev/null || head -n 50 "$TMP1"; echo "--- Run #2 head ---"; jq '.[0:5]' "$TMP2" 2>/dev/null || head -n 50 "$TMP2"; } || true
  fi
fi

# --- 6) Idempotency check (rows must not grow between 2nd and 3rd counts)
if [ "${#RECOMPUTE_CMD[@]}" -gt 0 ]; then
  C1="$(count_recs "$SCHEMA" || echo 0)"
  run soft "Recompute (idempotency #1)" bash -c "${RECOMPUTE_CMD[*]} > /dev/null"
  C2="$(count_recs "$SCHEMA" || echo 0)"
  run soft "Recompute (idempotency #2)" bash -c "${RECOMPUTE_CMD[*]} > /dev/null"
  C3="$(count_recs "$SCHEMA" || echo 0)"
  echo "Recommendation rows for '${USER_ID}': before=${C1} → after1=${C2} → after2=${C3}"
  if [ "$C2" = "$C3" ]; then ok "Idempotency: PASS"; else err "Idempotency: FAIL (${C2} → ${C3}). Ensure @@unique([userId, mealId]) + upsert."; fi
fi

# --- 7) Final table list
run soft "Final priority tables (${SCHEMA})" priority_dt "$SCHEMA"

rm -f "$TMP1" "$TMP2" 2>/dev/null || true
ok "Local audit completed."
