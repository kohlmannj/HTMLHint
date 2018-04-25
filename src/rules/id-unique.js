/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

export default {
    id: "id-unique",
    description: "The value of id attributes must be unique.",
    init(parser, reporter) {
        const mapIdCount = {};
        parser.addListener("tagstart", event => {
            const attrs = event.attrs,
                col = event.col + event.tagName.length + 1;
            let attr, id;
            for (let i = 0, l = attrs.length; i < l; i += 1) {
                attr = attrs[i];
                if (attr.name.toLowerCase() === "id") {
                    id = attr.value;
                    if (id) {
                        if (mapIdCount[id] === undefined) {
                            mapIdCount[id] = 1;
                        } else {
                            mapIdCount[id] += 1;
                        }
                        if (mapIdCount[id] > 1) {
                            reporter.error(
                                `The id value [ ${id} ] must be unique.`,
                                event.line,
                                col + attr.index,
                                this,
                                attr.raw
                            );
                        }
                    }
                    break;
                }
            }
        });
    },
};
