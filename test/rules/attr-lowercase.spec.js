/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

import HTMLHint from "../../src";

const ruldId = "attr-lowercase";
const ruleOptions = {};

ruleOptions[ruldId] = true;

describe(`Rules: ${ruldId}`, () => {
    test("Not all lowercase attr should result in an error", () => {
        let code = '<p TEST="abc">';
        let messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(3);

        code = '<p id=""\r\n TEST1="abc" TEST2="abc">';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(2);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(2);
        expect(messages[0].col).toBe(1);
        expect(messages[1].rule.id).toBe(ruldId);
        expect(messages[1].line).toBe(2);
        expect(messages[1].col).toBe(13);
    });

    test("Lowercase attr should not result in an error", () => {
        const code = '<p test="abc">';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });

    test("Set is false should not result in an error", () => {
        const code = '<p TEST="abc">';
        ruleOptions[ruldId] = false;
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });

    test("Set to array list should not result in an error", () => {
        const code = '<p testBox="abc" tttAAA="ccc">';
        ruleOptions[ruldId] = ["testBox", "tttAAA"];
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });
});
