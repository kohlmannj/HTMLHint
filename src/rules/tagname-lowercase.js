/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

export default {
    id: "tagname-lowercase",
    description: "All html element names must be in lowercase.",
    init(parser, reporter) {
        const self = this;
        parser.addListener("tagstart,tagend", event => {
            const tagName = event.tagName;
            if (tagName !== tagName.toLowerCase()) {
                reporter.error(
                    `The html element name of [ ${tagName} ] must be in lowercase.`,
                    event.line,
                    event.col,
                    self,
                    event.raw
                );
            }
        });
    },
};
