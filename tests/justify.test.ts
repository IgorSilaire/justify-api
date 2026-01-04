import { justifyText } from "../src/justify";
import {expect, jest, test} from "@jest/globals";

function randomWords(count: number): string {
    return Array.from({length: count})
        .map(() => "word")
        .join(" ");
}

test("text lines justified must be 80 characters long", () => {
    
    const text = randomWords(650);

    const out = justifyText(text);

    const lines = out.split("\n");

    for (let i = 0; i < lines.length - 1; i++) {
        expect(lines[i]?.length).toBe(80)
    }

})
