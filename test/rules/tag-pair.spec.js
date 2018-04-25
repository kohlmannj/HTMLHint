/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

import HTMLHint from "../../src";

const ruldId = "tag-pair",
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe(`Rules: ${ruldId}`, () => {
    test("No end tag should result in an error", () => {
        let code = "<ul><li></ul><span>";
        let messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(2);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(9);
        expect(messages[1].rule.id).toBe(ruldId);
        expect(messages[1].line).toBe(1);
        expect(messages[1].col).toBe(20);

        code = "<div></div>\r\n<div>aaa";
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(2);
        expect(messages[0].col).toBe(9);
    });

    test("No start tag should result in an error", () => {
        const code = "</div>";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(1);
    });

    test("Tag be paired should not result in an error", () => {
        const code = "<p>aaa</p>";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });
});
