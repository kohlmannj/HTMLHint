/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

import HTMLHint from "../../src";

describe("Rules: default", () => {
    test("should result 3 errors", () => {
        const code = '<p TEST="abc">';
        const messages = HTMLHint.verify(code);
        expect(messages).toHaveLength(3);
    });
});
