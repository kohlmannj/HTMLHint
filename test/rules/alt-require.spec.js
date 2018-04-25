/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2014, Takeshi Kurosawa <taken.spc@gmail.com>
 * MIT Licensed
 */

import HTMLHint from "../../src";

let ruldId = "alt-require",
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe(`Rules: ${ruldId}`, () => {
    test("Img tag have empty alt attribute should not result in an error", () => {
        const code = '<img width="200" height="300" alt="">';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });

    test("Img tag have non empty alt attribute should not result in an error", () => {
        const code = '<img width="200" height="300" alt="test">';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });

    test("Img tag have not alt attribute should result in an error", () => {
        const code = '<img width="200" height="300">';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(5);
        expect(messages[0].type).toBe("warning");
    });

    /* A tag can have shape and coords attributes and not have alt attribute */
    test("A tag have not alt attribute should not result in an error", () => {
        const code = "<a>";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });

    test("Area tag have not href and alt attributes should not result in an error", () => {
        const code = "<area>";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });

    test("Area[href] tag have not alt attribute should result in an error", () => {
        const code = '<area href="#test">';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(6);
        expect(messages[0].type).toBe("warning");
    });

    test("Area[href] tag have empty alt attribute should result in an error", () => {
        const code = '<area href="#test" alt="">';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(6);
        expect(messages[0].type).toBe("warning");
    });

    test("Area[href] tag have non emtpy alt attribute should not result in an error", () => {
        const code = '<area href="#test" alt="test">';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });

    test("Input tag have not type and alt attributes should not result in an error", () => {
        const code = "<input>";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });

    test('Input[type="text"] tag have not alt attribute should not result in an error', () => {
        const code = '<input type="text">';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });

    test('Input[type="image"] tag have not alt attribute should result in an error', () => {
        const code = '<input type="image">';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(7);
        expect(messages[0].type).toBe("warning");
    });

    test('Input[type="image"] tag have empty alt attribute should result in an error', () => {
        const code = '<input type="image" alt="">';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(7);
        expect(messages[0].type).toBe("warning");
    });

    test('Input[type="image"] tag have non emtpy alt attribute should not result in an error', () => {
        const code = '<input type="image" alt="test">';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });
});
