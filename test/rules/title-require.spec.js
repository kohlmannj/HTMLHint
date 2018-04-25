/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

import HTMLHint from "../../src";

const ruldId = "title-require",
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe(`Rules: ${ruldId}`, () => {
    test("<title> be present in <head> tag should not result in an error", () => {
        const code = "<html><head><title>test</title></head><body></body></html>";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });

    test("<title> not be present in <head> tag should result in an error", () => {
        let code = "<html><head></head><body></body></html>";
        let messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);

        code = "<html><head></head><body><title>test</title></body></html>";
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);

        code = "<html><title>test</title><head></head><body></body></html>";
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
    });

    test("No head should not result in an error", () => {
        const code = "<html><body></body></html>";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });

    test("<title></title> is empty should result in an error", () => {
        let code = "<html><head><title></title></head><body></body></html>";
        let messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);

        code = "<html><head><title>  \t   </title></head><body></body></html>";
        messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(1);
    });
});
