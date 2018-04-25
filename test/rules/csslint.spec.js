/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

import HTMLHint from "../../src";

const ruldId = "csslint",
    ruleOptions = {};

ruleOptions[ruldId] = {
    "display-property-grouping": true,
    "known-properties": true,
};

describe(`Rules: ${ruldId}`, () => {
    test("should result in an error", () => {
        const code = "a<style> \r\n body{color:red1;\r\ndisplay:inline;height:100px;}</style>b";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(2);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(2);
        expect(messages[0].col).toBe(7);
        expect(messages[0].type).toBe("warning");
        expect(messages[1].rule.id).toBe(ruldId);
        expect(messages[1].line).toBe(3);
        expect(messages[1].col).toBe(16);
        expect(messages[1].type).toBe("warning");
    });
});
