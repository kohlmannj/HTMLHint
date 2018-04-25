/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

export default {
    id: "src-not-empty",
    description: "The src attribute of an img(script,link) must have a value.",
    init(parser, reporter) {
        parser.addListener("tagstart", event => {
            const tagName = event.tagName,
                attrs = event.attrs,
                col = event.col + tagName.length + 1;
            let attr;
            for (let i = 0, l = attrs.length; i < l; i += 1) {
                attr = attrs[i];
                if (
                    ((/^(img|script|embed|bgsound|iframe)$/.test(tagName) === true &&
                        attr.name === "src") ||
                        (tagName === "link" && attr.name === "href") ||
                        (tagName === "object" && attr.name === "data")) &&
                    attr.value === ""
                ) {
                    reporter.error(
                        `The attribute [ ${
                            attr.name
                        } ] of the tag [ ${tagName} ] must have a value.`,
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
