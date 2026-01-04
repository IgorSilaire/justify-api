"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAILY_LIMIT = void 0;
exports.countWords = countWords;
exports.validQuota = validQuota;
exports.DAILY_LIMIT = 80000;
const usageByToken = new Map();
function todayDate() {
    return new Date().toISOString().slice(0, 10);
}
function countWords(text) {
    const trimmed = text.trim();
    if (!trimmed)
        return 0;
    return trimmed.split(/\s+/).length;
}
function validQuota(token, text) {
    const words = countWords(text);
    const currDate = todayDate();
    let usage = usageByToken.get(token);
    if (!usage || usage.date !== currDate) {
        usage = { date: currDate, words: 0 };
    }
    if (usage.words + words > exports.DAILY_LIMIT) {
        return false;
    }
    usage.words += words;
    usageByToken.set(token, usage);
    return true;
}
//# sourceMappingURL=rateLimit.js.map