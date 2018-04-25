export default {
    id: "attr-lowercase",
    description: "All attribute names must be in lowercase.",
    init(parser, reporter, options) {
        const exceptions = Array.isArray(options) ? options : [];
        parser.addListener("tagstart", event => {
            const attrs = event.attrs,
                col = event.col + event.tagName.length + 1;
            let attr;
            for (let i = 0, l = attrs.length; i < l; i += 1) {
                attr = attrs[i];
                const attrName = attr.name;
                if (exceptions.indexOf(attrName) === -1 && attrName !== attrName.toLowerCase()) {
                    reporter.error(
                        `The attribute name of [ ${attrName} ] must be in lowercase.`,
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
