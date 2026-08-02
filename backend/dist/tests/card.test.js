"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('💳 Credit Cards API Protection', () => {
    it('GET /api/v1/cards - should return 401 Unauthorized when no Bearer token is provided', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/v1/cards');
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });
    it('PATCH /api/v1/cards/invalid-id/status - should reject unauthenticated card status updates', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .patch('/api/v1/cards/invalid-id/status')
            .send({ status: 'FROZEN' });
        expect(res.status).toBe(401);
    });
});
