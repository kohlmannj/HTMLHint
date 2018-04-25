/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

import HTMLHint from "../../src";

let ruldId = "spec-char-escape",
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe(`Rules: ${ruldId}`, () => {
    test("Special characters: <> should result in an error", () => {
        const code = "<p>aaa>bbb< ccc</p>ddd\r\neee<";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(3);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(7);
        expect(messages[1].rule.id).toBe(ruldId);
        expect(messages[1].line).toBe(1);
        expect(messages[1].col).toBe(11);
        expect(messages[2].rule.id).toBe(ruldId);
        expect(messages[2].line).toBe(2);
        expect(messages[2].col).toBe(4);
    });

    test("Normal text should not result in an error", () => {
        const code = "<p>abc</p>";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });
});
