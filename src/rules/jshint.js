/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
import { JSHINT } from "jshint";

export default {
    id: "jshint",
    description: "Scan script with jshint.",
    init(parser, reporter, options) {
        const self = this;
        parser.addListener("cdata", event => {
            if (event.tagName.toLowerCase() === "script") {
                const mapAttrs = parser.getMapAttrs(event.attrs),
                    type = mapAttrs.type;

                // Only scan internal javascript
                if (
                    mapAttrs.src !== undefined ||
                    (type && /^(text\/javascript)$/i.test(type) === false)
                ) {
                    return;
                }

                if (options !== undefined) {
                    const styleLine = event.line - 1,
                        styleCol = event.col - 1;
                    const code = event.raw.replace(/\t/g, " ");
                    try {
                        const status = JSHINT(code, options);
                        if (status === false) {
                            JSHINT.errors.forEach(error => {
                                const line = error.line;
                                reporter.warn(
                                    error.reason,
                                    styleLine + line,
                                    (line === 1 ? styleCol : 0) + error.character,
                                    self,
                                    error.evidence
                                );
                            });
                        }
                    } catch (e) {} // eslint-disable-line no-empty
                }
            }
        });
    },
};
