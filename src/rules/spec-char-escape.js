/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

export default {
    id: "spec-char-escape",
    description: "Special characters must be escaped.",
    init(parser, reporter) {
        parser.addListener("text", event => {
            const raw = event.raw,
                reSpecChar = /[<>]/g;
            let match;
            while ((match = reSpecChar.exec(raw))) {
                const fixedPos = parser.fixPos(event, match.index);
                reporter.error(
                    `Special characters must be escaped : [ ${match[0]} ].`,
                    fixedPos.line,
                    fixedPos.col,
                    this,
                    event.raw
                );
            }
        });
    },
};
