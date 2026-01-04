"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const justify_1 = require("./justify");
const rateLimit_1 = require("./rateLimit");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
const tokens = new Map();
function getEmailFromToken(token) {
    for (const [email, storedToken] of tokens.entries()) {
        if (storedToken === token)
            return email;
    }
    return undefined;
}
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "miss auth header" });
    }
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "invalid format" });
    }
    const email = getEmailFromToken(token);
    if (!email) {
        return res.status(401).json({ error: "invalid token" });
    }
    // @ts-ignore
    req.email = email;
    // @ts-ignore
    req.token = token;
    next();
}
app.get("/", (_req, res) => {
    res.send("Justify API running!");
});
exports.default = app;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}
app.post("/api/token", (req, res) => {
    const { email } = req.body;
    if (!email || typeof (email) !== "string") {
        return res.status(400).json({ error: "email required" });
    }
    const token = crypto_1.default.randomBytes(24).toString("hex");
    tokens.set(email, token);
    return res.status(201).json({ token });
});
app.post("/api/justify", authMiddleware, express_1.default.text({ type: "text/plain", limit: "1mb" }), (req, res) => {
    const text = req.body;
    if (text == null) {
        return res.status(400).send("invalid text");
    }
    // @ts-ignore
    const token = req.token;
    if (!(0, rateLimit_1.validQuota)(token, text)) {
        return res
            .status(402)
            .json({ error: "Daily limit exceeded" });
    }
    const justified = (0, justify_1.justifyText)(text);
    res.type("text/plain").send(justified);
});
//# sourceMappingURL=index.js.map