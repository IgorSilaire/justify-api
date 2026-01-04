"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const justify_1 = require("../src/justify");
const globals_1 = require("@jest/globals");
function randomWords(count) {
    return Array.from({ length: count })
        .map(() => "word")
        .join(" ");
}
(0, globals_1.test)("text lines justified must be 80 characters long", () => {
    const text = randomWords(650);
    const out = (0, justify_1.justifyText)(text);
    const lines = out.split("\n");
    for (let i = 0; i < lines.length - 1; i++) {
        (0, globals_1.expect)(lines[i]?.length).toBe(80);
    }
});
//# sourceMappingURL=justify.test.js.map