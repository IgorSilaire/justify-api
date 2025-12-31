const LINE_WIDTH = 80;

export function justifyText(text: string): string {
    const words = text.trim().split(/\s+/);

    const lines: string[] = [];
    let currentWords: string[] = [];
    let currentLen = 0;

    for (const word of words) {

        if (currentWords.length === 0) {
            currentWords.push(word);
            currentLen = word.length;
            continue;
        }

        if (currentLen + 1 + word.length <= LINE_WIDTH) {
            currentWords.push(word);
            currentLen += 1 + word.length;
        } else {
            lines.push(justifyLine(currentWords));
            currentWords = [word];
            currentLen = word.length;
        }
    }

    if (currentWords.length > 0) {
        lines.push(justifyLine(currentWords, true));
    }

    return lines.join("\n");
}

function justifyLine(words: string[], last: boolean = false): string {
    if (last || words.length === 1) {
        const line = words.join(" ");
        return line.padEnd(LINE_WIDTH, " ");
    }

    const totalWordsLength = words.reduce((s, w) => s + w.length, 0);
    const spaces = LINE_WIDTH - totalWordsLength;
    const gaps = words.length - 1;

    const base = Math.floor(spaces / gaps);
    const extra = spaces % gaps;

    let line = "";

    for (let i = 0; i < words.length; i++) {
        line += words[i];

        if (i < gaps) {
            const count = base + (i < extra ? 1 : 0);
            line += " ".repeat(count);
        }
    } 

    return line;
}