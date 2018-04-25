/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

import HTMLHint from "../../src";

let ruldId = "tag-self-close",
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe(`Rules: ${ruldId}`, () => {
    test("The empty tag no closed should result in an error", () => {
        const code = '<br><img src="test.jpg">';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(2);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(1);
        expect(messages[0].type).toBe("warning");
        expect(messages[1].rule.id).toBe(ruldId);
        expect(messages[1].line).toBe(1);
        expect(messages[1].col).toBe(5);
        expect(messages[1].type).toBe("warning");
    });

    test("Closed empty tag should not result in an error", () => {
        const code = '<br /><img src="a.jpg"/>';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });
});
