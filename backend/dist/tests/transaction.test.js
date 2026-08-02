"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('🧾 Transactions Ledger API Protection', () => {
    it('GET /api/v1/transactions - should return 401 Unauthorized without JWT token', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/v1/transactions');
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });
    it('GET /api/v1/transactions/analytics - should protect spending analytics endpoint', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/v1/transactions/analytics');
        expect(res.status).toBe(401);
    });
});
