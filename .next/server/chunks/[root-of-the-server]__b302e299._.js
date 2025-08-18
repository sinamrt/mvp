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
"[externals]/next-auth/providers/github [external] (next-auth/providers/github, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next-auth/providers/github", () => require("next-auth/providers/github"));

module.exports = mod;
}}),
"[externals]/next-auth/providers/credentials [external] (next-auth/providers/credentials, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next-auth/providers/credentials", () => require("next-auth/providers/credentials"));

module.exports = mod;
}}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}}),
"[externals]/bcryptjs [external] (bcryptjs, esm_import)": ((__turbopack_context__) => {
"use strict";

var { a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("bcryptjs");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/pages/api/auth/[...nextauth].ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "authOptions": ()=>authOptions,
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth__$5b$external$5d$__$28$next$2d$auth$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next-auth [external] (next-auth, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$providers$2f$google__$5b$external$5d$__$28$next$2d$auth$2f$providers$2f$google$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next-auth/providers/google [external] (next-auth/providers/google, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$providers$2f$github__$5b$external$5d$__$28$next$2d$auth$2f$providers$2f$github$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next-auth/providers/github [external] (next-auth/providers/github, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$providers$2f$credentials__$5b$external$5d$__$28$next$2d$auth$2f$providers$2f$credentials$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next-auth/providers/credentials [external] (next-auth/providers/credentials, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/bcryptjs [external] (bcryptjs, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
const prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
const authOptions = {
    providers: [
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$providers$2f$google__$5b$external$5d$__$28$next$2d$auth$2f$providers$2f$google$2c$__cjs$29$__["default"])({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$providers$2f$github__$5b$external$5d$__$28$next$2d$auth$2f$providers$2f$github$2c$__cjs$29$__["default"])({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$providers$2f$credentials__$5b$external$5d$__$28$next$2d$auth$2f$providers$2f$credentials$2c$__cjs$29$__["default"])({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                },
                name: {
                    label: "Name",
                    type: "text"
                }
            },
            async authorize (credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("RequiredFields");
                }
                try {
                    // Check if user exists
                    const existingUser = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    });
                    if (existingUser) {
                        // User exists, verify password
                        if (!existingUser.passwordHash) {
                            console.error("User exists but no password hash found");
                            throw new Error("InvalidLoginMethod");
                        }
                        const isValidPassword = await __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$29$__["default"].compare(credentials.password, existingUser.passwordHash);
                        if (!isValidPassword) {
                            console.error("Invalid password for user:", credentials.email);
                            throw new Error("InvalidCredentials");
                        }
                        return {
                            id: existingUser.id,
                            email: existingUser.email,
                            name: existingUser.name || "",
                            role: existingUser.role
                        };
                    } else {
                        // New user registration
                        if (!credentials.name) {
                            throw new Error("RequiredFields");
                        }
                        // Validate password strength
                        if (credentials.password.length < 8) {
                            throw new Error("WeakPassword");
                        }
                        const hasUpperCase = /[A-Z]/.test(credentials.password);
                        const hasLowerCase = /[a-z]/.test(credentials.password);
                        const hasNumbers = /\d/.test(credentials.password);
                        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(credentials.password);
                        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
                            throw new Error("WeakPassword");
                        }
                        const hashedPassword = await __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$29$__["default"].hash(credentials.password, 12);
                        try {
                            const newUser = await prisma.user.create({
                                data: {
                                    email: credentials.email,
                                    name: credentials.name,
                                    passwordHash: hashedPassword,
                                    role: "USER"
                                }
                            });
                            console.log("New user created:", newUser.email);
                            return {
                                id: newUser.id,
                                email: newUser.email,
                                name: newUser.name || "",
                                role: newUser.role
                            };
                        } catch (error) {
                            if (error instanceof __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["Prisma"].PrismaClientKnownRequestError && error.code === 'P2002') {
                                throw new Error("EmailExists");
                            }
                            throw error;
                        }
                    }
                } catch (error) {
                    console.error("Auth error:", error);
                    if (error instanceof Error) {
                        throw error;
                    }
                    throw new Error("AuthenticationFailed");
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    callbacks: {
        async signIn ({ user, account }) {
            console.log("Sign in attempt:", {
                user: user.email,
                provider: account?.provider
            });
            return true;
        },
        async session ({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
                session.user.role = token.role || "USER";
            }
            return session;
        },
        async jwt ({ token, user }) {
            if (user) {
                token.role = user.role;
                token.sub = user.id;
            }
            return token;
        }
    },
    pages: {
        signIn: "/login",
        error: "/auth/error"
    },
    debug: ("TURBOPACK compile-time value", "development") === "development"
};
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth__$5b$external$5d$__$28$next$2d$auth$2c$__cjs$29$__["default"])(authOptions);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__b302e299._.js.map