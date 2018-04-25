/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

import HTMLHint from "../../src";

let ruldId = "inline-style-disabled",
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe(`Rules: ${ruldId}`, () => {
    test("Inline style should result in an error", () => {
        let code = '<body><div style="color:red;"></div></body>';
        let messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(11);
        expect(messages[0].type).toBe("warning");

        code = '<body><div STYLE="color:red;"></div></body>';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
    });
});
