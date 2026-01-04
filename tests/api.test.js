"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../src/index"));
const node_test_1 = require("node:test");
const globals_1 = require("@jest/globals");
(0, node_test_1.describe)("api test", () => {
    let token;
    (0, globals_1.beforeEach)(async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post("/api/token")
            .send({ email: "test@test.com" });
        token = res.body.token;
    });
    (0, globals_1.test)("POST /api/token with invaild email : 400", async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post("/api/token")
            .send({ wrong: "value" });
        (0, globals_1.expect)(res.status).toBe(400);
    });
    (0, globals_1.test)("POST /api/token returns a token", async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post("/api/token")
            .send({ email: "test@test.com" });
        (0, globals_1.expect)(res.status).toBe(201);
        (0, globals_1.expect)(res.body.token).toBeDefined();
        token = res.body.token;
    });
    (0, globals_1.test)("POST /api/justify without token : 401", async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post("/api/justify")
            .set("Content-Type", "text/plain")
            .send("this is a test");
        (0, globals_1.expect)(res.status).toBe(401);
    });
    (0, globals_1.test)("POST /api/justify with an avalid token : 401", async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post("/api/justify")
            .set("Authorization", "Bearer invalid")
            .set("Content-Type", "text/plain")
            .send("this is a test");
        (0, globals_1.expect)(res.status).toBe(401);
    });
    (0, globals_1.test)("POST /api/justify with an empty text: 200", async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post("/api/justify")
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "text/plain")
            .send("");
        (0, globals_1.expect)(res.status).toBe(200);
    });
    (0, globals_1.test)("POST /api/justify but the quota is exceeded : 402", async () => {
        const long_text = "a ".repeat(80001);
        const res = await (0, supertest_1.default)(index_1.default)
            .post("/api/justify")
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "text/plain")
            .send(long_text);
        (0, globals_1.expect)(res.status).toBe(402);
    });
});
//# sourceMappingURL=api.test.js.map