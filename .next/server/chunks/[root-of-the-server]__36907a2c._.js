module.exports = {

"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next-auth [external] (next-auth, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next-auth", () => require("next-auth"));

module.exports = mod;
}}),
"[externals]/next-auth/providers/google [external] (next-auth/providers/google, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next-auth/providers/google", () => require("next-auth/providers/google"));

module.exports = mod;
}}),
"[externals]/@next-auth/prisma-adapter [external] (@next-auth/prisma-adapter, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@next-auth/prisma-adapter", () => require("@next-auth/prisma-adapter"));

module.exports = mod;
}}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}}),
"[project]/lib/prisma.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// lib/prisma.ts
__turbopack_context__.s({
    "prisma": ()=>prisma
});
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const g = globalThis;
const prisma = g.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) g.prisma = prisma;
}),
"[project]/pages/api/auth/[...nextauth].ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "authOptions": ()=>authOptions,
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth__$5b$external$5d$__$28$next$2d$auth$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next-auth [external] (next-auth, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$providers$2f$google__$5b$external$5d$__$28$next$2d$auth$2f$providers$2f$google$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next-auth/providers/google [external] (next-auth/providers/google, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$next$2d$auth$2f$prisma$2d$adapter__$5b$external$5d$__$2840$next$2d$auth$2f$prisma$2d$adapter$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@next-auth/prisma-adapter [external] (@next-auth/prisma-adapter, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [api] (ecmascript)");
;
;
;
;
const authOptions = {
    adapter: (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$next$2d$auth$2f$prisma$2d$adapter__$5b$external$5d$__$2840$next$2d$auth$2f$prisma$2d$adapter$2c$__cjs$29$__["PrismaAdapter"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"]),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    providers: [
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$providers$2f$google__$5b$external$5d$__$28$next$2d$auth$2f$providers$2f$google$2c$__cjs$29$__["default"])({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt ({ token, user, account }) {
            // Debug logging (remove after debugging)
            console.log('JWT callback - token:', JSON.stringify(token, null, 2));
            console.log('JWT callback - user:', user ? JSON.stringify(user, null, 2) : 'null');
            // Persist the user ID and role to the token right after signin
            if (user) {
                token.userId = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session ({ session, token }) {
            // Debug logging (remove after debugging)
            console.log('Session callback - token:', JSON.stringify(token, null, 2));
            console.log('Session callback - session before:', JSON.stringify(session, null, 2));
            console.log("[NextAuth] NEXTAUTH_SECRET present?", !!process.env.NEXTAUTH_SECRET);
            try {
                // Add userId and role to session - now with proper typing
                if (token?.userId) {
                    session.userId = token.userId;
                } else if (token?.sub) {
                    session.userId = token.sub;
                }
                if (token?.role && session.user) {
                    session.user.role = token.role;
                }
                console.log('Session callback - session after:', JSON.stringify(session, null, 2));
            } catch (error) {
                console.log('NEXTAUTH_URL =', process.env.NEXTAUTH_URL);
                console.log('Google redirect URI =', `${process.env.NEXTAUTH_URL}/api/auth/callback/google`);
                console.error('Session callback error:', error);
            }
            return session;
        }
    },
    // Enable debug messages in development
    debug: ("TURBOPACK compile-time value", "development") === 'development'
};
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth__$5b$external$5d$__$28$next$2d$auth$2c$__cjs$29$__["default"])(authOptions);
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__36907a2c._.js.map