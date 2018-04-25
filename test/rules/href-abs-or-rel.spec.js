/**
 * Copyright (c) 2014, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

import HTMLHint from "../../src";

const ruldId = "href-abs-or-rel";
const ruleOptions = {};

describe(`Rules: ${ruldId}`, () => {
    test("Href value is not absolute with abs mode should result in an error", () => {
        const code =
            '<a href="a.html">aaa</a><a href="../b.html">bbb</a><a href="tel:12345678">ccc</a><a href="javascript:void()">ddd</a>';
        ruleOptions[ruldId] = "abs";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(2);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(3);
        expect(messages[1].rule.id).toBe(ruldId);
        expect(messages[1].line).toBe(1);
        expect(messages[1].col).toBe(27);
    });

    test("Href value is absolute with abs mode should not result in an error", () => {
        const code =
            '<a href="http://www.alibaba.com/">aaa</a><a href="https://www.alibaba.com/">bbb</a><a href="tel:12345678">ccc</a><a href="javascript:void()">ddd</a>';
        ruleOptions[ruldId] = "abs";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });

    test("Href value is not relative with rel mode should result in an error", () => {
        const code =
            '<a href="http://www.alibaba.com/">aaa</a><a href="https://www.alibaba.com/">bbb</a><a href="tel:12345678">ccc</a><a href="javascript:void()">ddd</a>';
        ruleOptions[ruldId] = "rel";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(2);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(3);
        expect(messages[1].rule.id).toBe(ruldId);
        expect(messages[1].line).toBe(1);
        expect(messages[1].col).toBe(44);
    });

    test("Href value is relative with rel mode should not result in an error", () => {
        const code =
            '<a href="a.html">aaa</a><a href="../b.html">bbb</a><a href="tel:12345678">ccc</a><a href="javascript:void()">ddd</a>';
        ruleOptions[ruldId] = "rel";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });
});
