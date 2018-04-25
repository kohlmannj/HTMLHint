/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

export default {
    id: "attr-value-not-empty",
    description: "All attributes must have values.",
    init(parser, reporter) {
        parser.addListener("tagstart", event => {
            const attrs = event.attrs,
                col = event.col + event.tagName.length + 1;
            let attr;
            for (let i = 0, l = attrs.length; i < l; i++) {
                attr = attrs[i];
                if (attr.quote === "" && attr.value === "") {
                    reporter.warn(
                        `The attribute [ ${attr.name} ] must have a value.`,
                        event.line,
                        col + attr.index,
                        this,
                        attr.raw
                    );
                }
            }
        });
    },
};
