/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

import HTMLHint from "../../src";

let ruldId = "jshint",
    ruleOptions = {};

ruleOptions[ruldId] = {
    undef: true,
    unused: true,
};

describe(`Rules: ${ruldId}`, () => {
    test("should result in an error", () => {
        const code = "a<script>\r\nvar b;\r\n		debugger;\r\na=1</script>b";
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(4);
        expect(messages[0].rule.id).toBe(ruldId);
        expect(messages[0].line).toBe(3);
        expect(messages[0].col).toBe(3);
        expect(messages[0].type).toBe("warning");
        expect(messages[1].rule.id).toBe(ruldId);
        expect(messages[1].line).toBe(4);
        expect(messages[1].col).toBe(4);
        expect(messages[1].type).toBe("warning");
        expect(messages[2].rule.id).toBe(ruldId);
        expect(messages[2].line).toBe(4);
        expect(messages[2].col).toBe(1);
        expect(messages[2].type).toBe("warning");
        expect(messages[3].rule.id).toBe(ruldId);
        expect(messages[3].line).toBe(2);
        expect(messages[3].col).toBe(5);
        expect(messages[3].type).toBe("warning");
    });

    test("type of script be not text/javascript should not result in an error", () => {
        const code = 'a<script type="text/html">\r\nvar b;\r\n     debugger;\r\na=1</script>b';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });

    test("type of script be text/javascript should result in an error", () => {
        const code =
            'a<script type="text/javascript">\r\nvar b;\r\n     debugger;\r\na=1</script>b';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).not.toBe(0);
    });

    test("type of script be text/javascript but have src should not result in an error", () => {
        const code =
            'a<script type="text/javascript" src="test.js">\r\nvar b;\r\n     debugger;\r\na=1</script>b';
        const messages = HTMLHint.verify(code, ruleOptions);
        expect(messages).toHaveLength(0);
    });
});
