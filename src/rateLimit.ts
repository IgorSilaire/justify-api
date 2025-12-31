export const DAILY_LIMIT = 80000;

type Usage = {
    date: string;
    words: number;
}

const usageByToken = new Map<string, Usage>();

function todayDate():string {
    return new Date().toISOString().slice(0, 10);
}

export function countWords(text: string): number {
    
    const trimmed = text.trim();

    if (!trimmed) return 0;
    
    return trimmed.split(/\s+/).length;
}

export function validQuota(token: string, text: string): boolean {

    const words = countWords(text);
    const currDate = todayDate();
    let usage = usageByToken.get(token);

    if (!usage || usage.date !== currDate) {
        usage = {date: currDate, words: 0};
    }

    if (usage.words + words > DAILY_LIMIT) {
        return false;
    }

    usage.words += words;
    usageByToken.set(token, usage);

    return true;
}