import express from "express";
import crypto from "crypto"
import { justifyText } from "./justify";
import { validQuota } from "./rateLimit";

const app = express();
const PORT: number = 3000;

app.use(express.json());

const tokens = new Map<string, string>();

function getEmailFromToken(token : string): string | undefined {
    for (const [email, storedToken] of tokens.entries()) {
        if (storedToken === token) return email;
    }
    return undefined;
}

function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({error : "miss auth header"});
    }

    const [scheme,token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({error: "invalid format"});
    }

    const email = getEmailFromToken(token);

    if (!email) {
        return res.status(401).json({error: "invalid token (email does not exist)"});
    }

    // @ts-ignore
    req.email = email;
    next();
}

app.get("/", (_req, res) => {
    res.send("Justify API running!");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

app.post("/api/token", (req, res) => {
    const { email } = req.body;

    if (!email || typeof(email) !== "string") {
        return res.status(400).json({error : "email required"})
    }

    const token = crypto.randomBytes(24).toString("hex");
    tokens.set(email, token);

    return res.status(201).json({token});
});

app.post("/api/justify", authMiddleware, express.text({type: "text/plain"}), (req, res) => {
    
    const text = req.body;

    if (typeof(text) !== "string") {
        return res.status(400).send("invalid text");
    }

    const justified = justifyText(text);

    res.type("text/plain").send(justified);

})
