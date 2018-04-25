import { CSSLint } from "csslint";

export default {
    id: "csslint",
    description: "Scan css with csslint.",
    init(parser, reporter, options) {
        parser.addListener("cdata", event => {
            if (event.tagName.toLowerCase() === "style") {
                if (typeof options === "object" && options !== null) {
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

        parser.addListener("tagstart", event => {
            const attrs = event.attrs,
                tagCol = event.col + event.tagName.length + 1,
                attr = attrs.find(a => a.name.toLowerCase() === "style");
            const value = attr ? attr.value : undefined;
            if (typeof value === "string" && typeof options === "object" && options !== null) {
                try {
                    const fakeSelectorStart = ".style {",
                        fakeSelectorEnd = "}";
                    const messages = CSSLint.verify(
                        `${fakeSelectorStart}${value}${fakeSelectorEnd}`,
                        options
                    ).messages;
                    messages.forEach(error => {
                        const line = error.line;
                        reporter[error.type === "warning" ? "warn" : "error"](
                            `[${error.rule.id}] ${error.message}`,
                            event.line + line - (line === 1 ? 2 : 1),
                            (line === 1 ? tagCol - fakeSelectorStart.length : 0) + error.col,
                            this,
                            error.evidence
                        );
                    });
                } catch (e) {} // eslint-disable-line no-empty
            }
        });
    },
};
