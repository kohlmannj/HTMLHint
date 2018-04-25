/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

import HTMLHint from "../../src";

let ruldId = "attr-value-double-quotes",
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe(`Rules: ${ruldId}`, () => {
    test("Attribute value closed by single quotes should result in an error", () => {
        const code = "<a href='abc' title=abc style=''>";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(3);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(3);
        expect(messages[1].rule.id).toBe(ruldId);
        expect(messages[1].line).toBe(1);
        expect(messages[1].col).toBe(14);
        expect(messages[2].rule.id).toBe(ruldId);
        expect(messages[2].line).toBe(1);
        expect(messages[2].col).toBe(24);
    });

    test("Attribute value no closed should not result in an error", () => {
        const code = '<input type="button" disabled style="">';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });
});
