"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
describe('Database Initialization Tests', function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Ensure database connection
                return [4 /*yield*/, prisma.$connect()];
                case 1:
                    // Ensure database connection
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.$disconnect()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('TC-DB-001: Database connection successful', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT 1 as test"], ["SELECT 1 as test"])))];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual([{ test: 1 }]);
                    return [2 /*return*/];
            }
        });
    }); });
    test('TC-DB-002: All required tables exist', function () { return __awaiter(void 0, void 0, void 0, function () {
        var tables, _i, tables_1, table, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tables = [
                        'users',
                        'diet_preferences',
                        'food_exclusions',
                        'diet_exclusions',
                        'nutrition_goals',
                        'macro_ranges',
                        'meal_preferences',
                        'nutrition_limits',
                        'user_progress',
                        'diet_forms'
                    ];
                    _i = 0, tables_1 = tables;
                    _a.label = 1;
                case 1:
                    if (!(_i < tables_1.length)) return [3 /*break*/, 4];
                    table = tables_1[_i];
                    return [4 /*yield*/, prisma.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        SELECT EXISTS (\n          SELECT FROM information_schema.tables \n          WHERE table_name = ", "\n        ) as exists\n      "], ["\n        SELECT EXISTS (\n          SELECT FROM information_schema.tables \n          WHERE table_name = ", "\n        ) as exists\n      "])), table)];
                case 2:
                    result = _a.sent();
                    expect(result[0].exists).toBe(true);
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    test('TC-DB-003: Admin user exists', function () { return __awaiter(void 0, void 0, void 0, function () {
        var adminUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.user.findUnique({
                        where: { email: 'admin@dietapp.com' }
                    })];
                case 1:
                    adminUser = _a.sent();
                    expect(adminUser).toBeDefined();
                    expect(adminUser === null || adminUser === void 0 ? void 0 : adminUser.role).toBe('ADMIN');
                    return [2 /*return*/];
            }
        });
    }); });
    test('TC-DB-004: Diet exclusions seeded', function () { return __awaiter(void 0, void 0, void 0, function () {
        var exclusions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.dietExclusion.findMany()];
                case 1:
                    exclusions = _a.sent();
                    expect(exclusions.length).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
    test('TC-DB-005: Foreign key relationships work', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.user.findFirst({
                        include: {
                            dietPreferences: true,
                            nutritionGoals: true,
                            macroRanges: true
                        }
                    })];
                case 1:
                    user = _a.sent();
                    expect(user).toBeDefined();
                    expect(user === null || user === void 0 ? void 0 : user.dietPreferences).toBeDefined();
                    expect(user === null || user === void 0 ? void 0 : user.nutritionGoals).toBeDefined();
                    expect(user === null || user === void 0 ? void 0 : user.macroRanges).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
var templateObject_1, templateObject_2;
