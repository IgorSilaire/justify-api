import request from "supertest";
import app from "../src/index";
import { describe } from "node:test";
import {expect, jest, test} from "@jest/globals";

describe ("api test", () =>{
    let token:string;

    test("POST /api/token with invaild email : 400", async() => {
        const res = await request(app)
            .post("/api/token")
            .send({wrong : "value"});
        expect(res.status).toBe(400);
    });

    test("POST /api/token returns a token", async() => {
        const res = await request(app)
            .post("/api/token")
            .send({email : "test@test.com"});

        expect(res.status).toBe(201);
        expect(res.body.token).toBeDefined();

        token = res.body.token;
    });

    test("POST /api/justify without token : 401", async() => {
        const res = await request(app)
            .post("/api/justify")
            .set("Content-Type", "text/plain")
            .send("this is a test");

        expect(res.status).toBe(401);
    });

    test("POST /api/justify with an avalid token : 401", async() => {
        const res = await request(app)
            .post("/api/justify")
            .set("Authorization", "Bearer invalid")
            .set("Content-Type", "text/plain")
            .send("this is a test");

        expect(res.status).toBe(401);
    });

    test("POST /api/justify with an empty text: 200", async() => {
        const res = await request(app)
            .post("/api/justify")
            .set("Authorization", "Bearer ${token}")
            .set("Content-Type", "text/plain")
            .send("");

        expect(res.status).toBe(200);
    });

    test("POST /api/justify but the quota is exceeded : 402", async() => {
        
        const long_text = "a ".repeat(90000);

        const res = await request(app)
            .post("/api/justify")
            .set("Authorization", "Bearer ${token}")
            .set("Content-Type", "text/plain")
            .send(long_text);

        expect(res.status).toBe(402);
    });
})