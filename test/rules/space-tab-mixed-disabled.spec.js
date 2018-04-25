/**
 * Copyright (c) 2014-2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

import HTMLHint from "../../src";

const ruldId = "space-tab-mixed-disabled";
const ruleMixOptions = {};
const ruleSpaceOptions = {};
const ruleSpace4Options = {};
const ruleSpace5Options = {};
const ruleTabOptions = {};

ruleMixOptions[ruldId] = true;
ruleSpaceOptions[ruldId] = "space";
ruleSpace4Options[ruldId] = "space4";
ruleSpace5Options[ruldId] = "space5";
ruleTabOptions[ruldId] = "tab";

describe(`Rules: ${ruldId}`, () => {
    test("Spaces and tabs mixed in front of line should result in an error", () => {
        // space before tab
        let code = '    	<a href="a">      bbb</a>';
        let messages = HTMLHint.verify(code, ruleMixOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(1);
        // tab before space
        code = '		 <a href="a">      bbb</a>';
        messages = HTMLHint.verify(code, ruleMixOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(1);
        expect(messages[0].col).toBe(1);
        // multi line
        code = '<div>\r\n	 <a href="a">      bbb</a>';
        messages = HTMLHint.verify(code, ruleMixOptions);
        expect(messages).toHaveLength(1);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(2);
        expect(messages[0].col).toBe(1);
    });

    test("Only spaces in front of line should not result in an error", () => {
        let code = '     <a href="a">      bbb</a>';
        let messages = HTMLHint.verify(code, ruleMixOptions);
        expect(messages).toHaveLength(0);

        code = '<div>\r\n     <a href="a">      bbb</a>';
        messages = HTMLHint.verify(code, ruleMixOptions);
        expect(messages).toHaveLength(0);
    });

    test("Only tabs in front of line should not result in an error", () => {
        const code = '			<a href="a">      bbb</a>';
        const messages = HTMLHint.verify(code, ruleMixOptions);
        expect(messages).toHaveLength(0);
    });

    test("Not only space in front of line should result in an error", () => {
        // mixed 1
        let code = '    	<a href="a">      bbb</a>';
        let messages = HTMLHint.verify(code, ruleSpaceOptions);
        expect(messages).toHaveLength(1);

        // mixed 2
        code = '	    <a href="a">      bbb</a>';
        messages = HTMLHint.verify(code, ruleSpaceOptions);
        expect(messages).toHaveLength(1);

        // only tab
        code = '		<a href="a">      bbb</a>';
        messages = HTMLHint.verify(code, ruleSpaceOptions);
        expect(messages).toHaveLength(1);
    });

    test("Not only space and 4 length in front of line should result in an error", () => {
        const code = '     <a href="a">      bbb</a>';
        const messages = HTMLHint.verify(code, ruleSpace4Options);
        expect(messages).toHaveLength(1);
        expect(messages[0].message).toBe("Please use space for indentation and keep 4 length.");
    });

    test("Only space and 4 length in front of line should not result in an error", () => {
        const code = '        <a href="a">      bbb</a>';
        const messages = HTMLHint.verify(code, ruleSpace4Options);
        expect(messages).toHaveLength(0);
    });

    test("Not only space and 5 length in front of line should result in an error", () => {
        const code = '      <a href="a">      bbb</a>';
        const messages = HTMLHint.verify(code, ruleSpace5Options);
        expect(messages).toHaveLength(1);
        expect(messages[0].message).toBe("Please use space for indentation and keep 5 length.");
    });

    test("Only space and 5 length in front of line should not result in an error", () => {
        const code = '          <a href="a">      bbb</a>';
        const messages = HTMLHint.verify(code, ruleSpace5Options);
        expect(messages).toHaveLength(0);
    });

    test("Only space in front of line should not result in an error", () => {
        const code = '            <a href="a">      bbb</a>';
        const messages = HTMLHint.verify(code, ruleSpaceOptions);
        expect(messages).toHaveLength(0);
    });

    test("Not only tab in front of line should result in an error", () => {
        // mixed 1
        let code = '	    <a href="a">      bbb</a>';
        let messages = HTMLHint.verify(code, ruleTabOptions);
        expect(messages).toHaveLength(1);

        // mixed 2
        code = '    	<a href="a">      bbb</a>';
        messages = HTMLHint.verify(code, ruleTabOptions);
        expect(messages).toHaveLength(1);

        // only space
        code = '       <a href="a">      bbb</a>';
        messages = HTMLHint.verify(code, ruleTabOptions);
        expect(messages).toHaveLength(1);
    });

    test("Only tab in front of line should not result in an error", () => {
        // only tab
        const code = '		<a href="a">      bbb</a>';
        const messages = HTMLHint.verify(code, ruleTabOptions);
        expect(messages).toHaveLength(0);
    });
});
