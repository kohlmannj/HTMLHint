/**
 * Copyright (c) 2014, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

import HTMLHint from "../../src";

let ruldId = "id-class-ad-disabled",
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe(`Rules: ${ruldId}`, () => {
    test("Id use ad keyword should result in an error", () => {
        let code = '<div id="ad">test</div>';
        let messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].type).toBe("warning");
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(5);

        code = '<div id="ad-222">test</div>';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(5);

        code = '<div id="ad_222">test</div>';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(5);

        code = '<div id="111-ad">test</div>';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(5);

        code = '<div id="111_ad">test</div>';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(5);

        code = '<div id="111-ad-222">test</div>';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(5);

        code = '<div id="111_ad_222">test</div>';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(5);
    });

    test("Class use ad keyword should result in an error", () => {
        let code = '<div class="ad">test</div>';
        let messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(5);

        code = '<div class="ad-222">test</div>';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(5);

        code = '<div class="ad_222">test</div>';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(5);

        code = '<div class="111-ad">test</div>';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(5);

        code = '<div class="111_ad">test</div>';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(5);

        code = '<div class="111-ad-222">test</div>';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(5);

        code = '<div class="111_ad_222">test</div>';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(5);
    });

    test("Id and class no ad keyword used should not result in an error", () => {
        let code = '<div id="ad1" class="ad2">test</div>';
        let messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);

        code = '<div id="ad1-222" class="ad2-222">test</div>';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);

        code = '<div id="111-ad1" class="111-ad2">test</div>';
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });
});
