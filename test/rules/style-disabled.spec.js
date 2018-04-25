/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

import HTMLHint from "../../src";

const ruldId = "style-disabled",
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe(`Rules: ${ruldId}`, () => {
    test("Style tag should result in an error", () => {
        const code = "<body><style>body{}</style></body>";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(7);
        expect(messages[0].type).toBe("warning");
    });

    test("Stylesheet link should not result in an error", () => {
        const code = '<body><link rel="stylesheet" href="test.css" /></body>';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });
});
