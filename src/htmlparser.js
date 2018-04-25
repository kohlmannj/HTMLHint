/* jshint -W079 */
/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

export default class HTMLParser {
    constructor() {
        this._listeners = {};
        this._mapCdataTags = this.makeMap("script,style");
        this._arrBlocks = [];
        this.lastEvent = null;
    }

    makeMap(str) {
        const obj = {},
            items = str.split(",");
        for (let i = 0; i < items.length; i += 1) {
            obj[items[i]] = true;
        }
        return obj;
    }

    // parse html code
    parse(html) {
        const mapCdataTags = this._mapCdataTags;

        const regTag = /<(?:\/([^\s>]+)\s*|!--([\s\S]*?)--|!([^>]*?)|([\w\-:]+)((?:\s+[^\s"'>/=\x00-\x0F\x7F\x80-\x9F]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]*))?)*?)\s*(\/?))>/g,
            regAttr = /\s*([^\s"'>/=\x00-\x0F\x7F\x80-\x9F]+)(?:\s*=\s*(?:(")([^"]*)"|(')([^']*)'|([^\s"'>]*)))?/g,
            regLine = /\r?\n/g;

        let match,
            matchIndex,
            lastIndex = 0,
            tagName,
            arrAttrs,
            tagCDATA,
            attrsCDATA,
            arrCDATA,
            lastCDATAIndex = 0,
            text;
        let lastLineIndex = 0,
            line = 1;
        const arrBlocks = this._arrBlocks;

        this.fire("start", {
            pos: 0,
            line: 1,
            col: 1,
        });

        while ((match = regTag.exec(html))) {
            matchIndex = match.index;
            if (matchIndex > lastIndex) {
                // 保存前面的文本或者CDATA
                text = html.substring(lastIndex, matchIndex);
                if (tagCDATA) {
                    arrCDATA.push(text);
                } else {
                    // 文本
                    saveBlock("text", text, lastIndex);
                }
            }
            lastIndex = regTag.lastIndex;

            if ((tagName = match[1])) {
                if (tagCDATA && tagName === tagCDATA) {
                    // 结束标签前输出CDATA
                    text = arrCDATA.join("");
                    saveBlock("cdata", text, lastCDATAIndex, {
                        tagName: tagCDATA,
                        attrs: attrsCDATA,
                    });
                    tagCDATA = null;
                    attrsCDATA = null;
                    arrCDATA = null;
                }
                if (!tagCDATA) {
                    // 标签结束
                    saveBlock("tagend", match[0], matchIndex, {
                        tagName,
                    });
                    continue;
                }
            }

            if (tagCDATA) {
                arrCDATA.push(match[0]);
            } else {
                if ((tagName = match[4])) {
                    // 标签开始
                    arrAttrs = [];
                    const attrs = match[5];
                    let attrMatch,
                        attrMatchCount = 0;
                    while ((attrMatch = regAttr.exec(attrs))) {
                        const name = attrMatch[1],
                            quote = attrMatch[2] ? attrMatch[2] : attrMatch[4] ? attrMatch[4] : "",
                            value = attrMatch[3]
                                ? attrMatch[3]
                                : attrMatch[5]
                                    ? attrMatch[5]
                                    : attrMatch[6]
                                        ? attrMatch[6]
                                        : "";
                        arrAttrs.push({
                            name,
                            value,
                            quote,
                            index: attrMatch.index,
                            raw: attrMatch[0],
                        });
                        attrMatchCount += attrMatch[0].length;
                    }
                    if (attrMatchCount === attrs.length) {
                        saveBlock("tagstart", match[0], matchIndex, {
                            tagName,
                            attrs: arrAttrs,
                            close: match[6],
                        });
                        if (mapCdataTags[tagName]) {
                            tagCDATA = tagName;
                            attrsCDATA = arrAttrs.concat();
                            arrCDATA = [];
                            lastCDATAIndex = lastIndex;
                        }
                    } else {
                        // 如果出现漏匹配，则把当前内容匹配为text
                        saveBlock("text", match[0], matchIndex);
                    }
                } else if (match[2] || match[3]) {
                    // 注释标签
                    saveBlock("comment", match[0], matchIndex, {
                        content: match[2] || match[3],
                        long: !!match[2],
                    });
                }
            }
        }

        if (html.length > lastIndex) {
            // 结尾文本
            text = html.substring(lastIndex, html.length);
            saveBlock("text", text, lastIndex);
        }

        this.fire("end", {
            pos: lastIndex,
            line,
            col: html.length - lastLineIndex + 1,
        });

        // 存储区块
        function saveBlock(type, raw, pos, data) {
            const col = pos - lastLineIndex + 1;
            if (data === undefined) {
                data = {};
            }
            data.raw = raw;
            data.pos = pos;
            data.line = line;
            data.col = col;
            arrBlocks.push(data);
            this.fire(type, data);

            while (regLine.exec(raw)) {
                line += 1;
                lastLineIndex = pos + regLine.lastIndex;
            }
        }
    }

    // add event
    addListener(types, listener) {
        const _listeners = this._listeners;
        const arrTypes = types.split(/[,\s]/);
        let type;
        for (let i = 0, l = arrTypes.length; i < l; i += 1) {
            type = arrTypes[i];
            if (_listeners[type] === undefined) {
                _listeners[type] = [];
            }
            _listeners[type].push(listener);
        }
    }

    // fire event
    fire(type, data) {
        if (data === undefined) {
            data = {};
        }
        data.type = type;
        let listeners = [];
        const listenersType = this._listeners[type],
            listenersAll = this._listeners.all;
        if (listenersType !== undefined) {
            listeners = listeners.concat(listenersType);
        }
        if (listenersAll !== undefined) {
            listeners = listeners.concat(listenersAll);
        }
        const lastEvent = this.lastEvent;
        if (lastEvent !== null) {
            delete lastEvent.lastEvent;
            data.lastEvent = lastEvent;
        }
        this.lastEvent = data;
        for (let i = 0, l = listeners.length; i < l; i += 1) {
            listeners[i].call(this, data);
        }
    }

    // remove event
    removeListener(type, listener) {
        const listenersType = this._listeners[type];
        if (listenersType !== undefined) {
            for (let i = 0, l = listenersType.length; i < l; i += 1) {
                if (listenersType[i] === listener) {
                    listenersType.splice(i, 1);
                    break;
                }
            }
        }
    }

    // fix pos if event.raw have \n
    fixPos(event, index) {
        const text = event.raw.substr(0, index),
            arrLines = text.split(/\r?\n/),
            lineCount = arrLines.length - 1;
        let line = event.line,
            col;
        if (lineCount > 0) {
            line += lineCount;
            col = arrLines[lineCount].length + 1;
        } else {
            col = event.col + index;
        }
        return {
            line,
            col,
        };
    }

    // covert array type of attrs to map
    getMapAttrs(arrAttrs) {
        const mapAttrs = {};
        let attr;
        for (let i = 0, l = arrAttrs.length; i < l; i += 1) {
            attr = arrAttrs[i];
            mapAttrs[attr.name] = attr.value;
        }
        return mapAttrs;
    }
}
