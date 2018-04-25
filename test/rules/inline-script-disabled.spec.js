/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

import HTMLHint from "../../src";

let ruldId = "inline-script-disabled",
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe(`Rules: ${ruldId}`, () => {
    test("Inline on event should result in an error", () => {
        const code =
            '<body><img src="test.gif" onclick="alert(1);"><img src="test.gif" onMouseDown="alert(1);"></body>';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(2);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(26);
        expect(messages[0].type).toBe("warning");
        expect(messages[1].col).toBe(66);
    });

    test("onttt should not result in an error", () => {
        const code = '<body><img src="test.gif" onttt="alert(1);"></body>';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });

    test("Javascript protocol [ javascript: ] should result in an error", () => {
        let code = '<body><img src="javascript:alert(1)"><img src=" JAVASCRIPT:alert(1)"></body>';
        let messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(2);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(11);
        expect(messages[0].type).toBe("warning");
        expect(messages[1].col).toBe(42);

        code =
            '<body><a href="javascript:alert(1)">test1</a><a href=" JAVASCRIPT:alert(2)">test2</a></body>';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(2);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(9);
        expect(messages[0].type).toBe("warning");
        expect(messages[1].col).toBe(48);
    });
});
