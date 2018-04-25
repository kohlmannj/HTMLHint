/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
export default class Reporter {
    constructor(html, ruleset) {
        this.html = html;
        this.lines = html.split(/\r?\n/);
        const match = html.match(/\r?\n/);
        this.brLen = match !== null ? match[0].length : 0;
        this.ruleset = ruleset;
        this.messages = [];
    }

    // error message
    error(message, line, col, rule, raw) {
        this.report("error", message, line, col, rule, raw);
    }

    // warning message
    warn(message, line, col, rule, raw) {
        this.report("warning", message, line, col, rule, raw);
    }

    // info message
    info(message, line, col, rule, raw) {
        this.report("info", message, line, col, rule, raw);
    }

    // save report
    report(type, message, line, col, rule, raw) {
        const self = this;
        const lines = self.lines;
        const brLen = self.brLen;
        let evidence, evidenceLen;
        for (let i = line - 1, lineCount = lines.length; i < lineCount; i += 1) {
            evidence = lines[i];
            evidenceLen = evidence.length;
            if (col > evidenceLen && line < lineCount) {
                line += 1;
                col -= evidenceLen;
                if (col !== 1) {
                    col -= brLen;
                }
            } else {
                break;
            }
        }
        self.messages.push({
            type,
            message,
            raw,
            evidence,
            line,
            col,
            rule: {
                id: rule.id,
                description: rule.description,
                link: `https://github.com/yaniswang/HTMLHint/wiki/${rule.id}`,
            },
        });
    }
}
