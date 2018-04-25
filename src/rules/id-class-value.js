/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

export default {
    id: "id-class-value",
    description: "The id and class attribute values must meet the specified rules.",
    init(parser, reporter, options) {
        const self = this;
        const arrRules = {
            underline: {
                regId: /^[a-z\d]+(_[a-z\d]+)*$/,
                message:
                    "The id and class attribute values must be in lowercase and split by an underscore.",
            },
            dash: {
                regId: /^[a-z\d]+(-[a-z\d]+)*$/,
                message:
                    "The id and class attribute values must be in lowercase and split by a dash.",
            },
            hump: {
                regId: /^[a-z][a-zA-Z\d]*([A-Z][a-zA-Z\d]*)*$/,
                message: "The id and class attribute values must meet the camelCase style.",
            },
        };
        let rule;
        if (typeof options === "string") {
            rule = arrRules[options];
        } else {
            rule = options;
        }
        if (rule && rule.regId) {
            const regId = rule.regId,
                message = rule.message;
            parser.addListener("tagstart", event => {
                const attrs = event.attrs,
                    col = event.col + event.tagName.length + 1;
                let attr;
                for (let i = 0, l1 = attrs.length; i < l1; i += 1) {
                    attr = attrs[i];
                    if (attr.name.toLowerCase() === "id") {
                        if (regId.test(attr.value) === false) {
                            reporter.warn(message, event.line, col + attr.index, self, attr.raw);
                        }
                    }
                    if (attr.name.toLowerCase() === "class") {
                        const arrClass = attr.value.split(/\s+/g);
                        let classValue;
                        for (let j = 0, l2 = arrClass.length; j < l2; j += 1) {
                            classValue = arrClass[j];
                            if (classValue && regId.test(classValue) === false) {
                                reporter.warn(
                                    message,
                                    event.line,
                                    col + attr.index,
                                    self,
                                    classValue
                                );
                            }
                        }
                    }
                }
            });
        }
    },
};
