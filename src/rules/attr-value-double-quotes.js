export default {
    id: "attr-value-double-quotes",
    description: "Attribute values must be in double quotes.",
    init(parser, reporter) {
        parser.addListener("tagstart", event => {
            const attrs = event.attrs,
                col = event.col + event.tagName.length + 1;
            let attr;
            for (let i = 0, l = attrs.length; i < l; i += 1) {
                attr = attrs[i];
                if (
                    (attr.value !== "" && attr.quote !== '"') ||
                    (attr.value === "" && attr.quote === "'")
                ) {
                    reporter.error(
                        `The value of attribute [ ${attr.name} ] must be in double quotes.`,
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
