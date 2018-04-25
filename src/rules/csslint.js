import { CSSLint } from "csslint";

export default {
    id: "csslint",
    description: "Scan css with csslint.",
    init(parser, reporter, options) {
        parser.addListener("cdata", event => {
            if (event.tagName.toLowerCase() === "style") {
                if (options !== undefined) {
                    const styleLine = event.line - 1,
                        styleCol = event.col - 1;
                    try {
                        const messages = CSSLint.verify(event.raw, options).messages;
                        messages.forEach(error => {
                            const line = error.line;
                            reporter[error.type === "warning" ? "warn" : "error"](
                                `[${error.rule.id}] ${error.message}`,
                                styleLine + line,
                                (line === 1 ? styleCol : 0) + error.col,
                                this,
                                error.evidence
                            );
                        });
                    } catch (e) {} // eslint-disable-line no-empty
                }
            }
        });
    },
};
