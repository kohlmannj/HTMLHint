/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */

import HTMLParser from "../src/htmlparser";

function eqlEvent(event, attr) {
    let equal = true;

    Object.keys(attr).forEach(name => {
        if (name !== "attrs" && event[name] !== attr[name]) {
            equal = false;
        }
    });

    return equal;
}

function getAllEvents(parser, arrEvents, callback) {
    parser.addListener("all", e => {
        arrEvents.push(e);
        if (e.type === "end") {
            callback();
        }
    });
}

expect.extend({
    toEqualEvent: (obj, type, attr) => {
        if (attr !== undefined) {
            attr.type = type;
        } else {
            if (typeof attr === "string") {
                attr = { type };
            } else {
                attr = type;
            }
        }
        if (eqlEvent(obj, attr)) {
            return {
                message: () =>
                    `expected "${JSON.stringify(obj)}" to event "${JSON.stringify(attr)}"`,
                pass: true,
            };
        }

        return {
            message: () =>
                `expected "${JSON.stringify(obj)}" not to event "${JSON.stringify(attr)}"`,
            pass: false,
        };
    },
});

describe("HTMLParser: Base parse", () => {
    test("should parse html code1", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        const targetEvents = [
            { pos: 0, line: 1, col: 1, type: "start" },
            {
                content: "DOCTYPE HTML",
                long: false,
                raw: "<!DOCTYPE HTML>",
                pos: 0,
                line: 1,
                col: 1,
                type: "comment",
            },
            {
                tagName: "html",
                attrs: [],
                close: "",
                raw: "<html>",
                pos: 15,
                line: 1,
                col: 16,
                type: "tagstart",
            },
            {
                tagName: "head",
                attrs: [],
                close: "",
                raw: "<head>",
                pos: 21,
                line: 1,
                col: 22,
                type: "tagstart",
            },
            {
                tagName: "meta",
                attrs: [
                    {
                        name: "charset",
                        value: "UTF-8",
                        quote: '"',
                        index: 0,
                        raw: ' charset="UTF-8"',
                    },
                ],
                close: "",
                raw: '<meta charset="UTF-8">',
                pos: 27,
                line: 1,
                col: 28,
                type: "tagstart",
            },
            {
                tagName: "title",
                attrs: [],
                close: "",
                raw: "<title>",
                pos: 49,
                line: 1,
                col: 50,
                type: "tagstart",
            },
            { raw: "testtitle", pos: 56, line: 1, col: 57, type: "text" },
            { tagName: "title", raw: "</title>", pos: 65, line: 1, col: 66, type: "tagend" },
            { tagName: "head", raw: "</head>", pos: 73, line: 1, col: 74, type: "tagend" },
            {
                tagName: "body",
                attrs: [],
                close: "",
                raw: "<body>",
                pos: 80,
                line: 1,
                col: 81,
                type: "tagstart",
            },
            {
                tagName: "p",
                attrs: [],
                close: "",
                raw: "<p>",
                pos: 86,
                line: 1,
                col: 87,
                type: "tagstart",
            },
            {
                tagName: "a",
                attrs: [
                    {
                        name: "href",
                        value: "testhref",
                        quote: '"',
                        index: 0,
                        raw: ' href="testhref"',
                    },
                    {
                        name: "title",
                        value: "atitle",
                        quote: '"',
                        index: 16,
                        raw: ' title="atitle"',
                    },
                ],
                close: "",
                raw: '<a href="testhref" title="atitle">',
                pos: 89,
                line: 1,
                col: 90,
                type: "tagstart",
            },
            { raw: "aaa", pos: 123, line: 1, col: 124, type: "text" },
            {
                tagName: "span",
                attrs: [],
                close: "",
                raw: "<span>",
                pos: 126,
                line: 1,
                col: 127,
                type: "tagstart",
            },
            { raw: "bbb", pos: 132, line: 1, col: 133, type: "text" },
            { tagName: "span", raw: "</span>", pos: 135, line: 1, col: 136, type: "tagend" },
            { raw: "ccc", pos: 142, line: 1, col: 143, type: "text" },
            { tagName: "a", raw: "</a>", pos: 145, line: 1, col: 146, type: "tagend" },
            { tagName: "p", raw: "</p>", pos: 149, line: 1, col: 150, type: "tagend" },
            { tagName: "body", raw: "</body>", pos: 153, line: 1, col: 154, type: "tagend" },
            { tagName: "html", raw: "</html>", pos: 160, line: 1, col: 161, type: "tagend" },
            { pos: 167, line: 1, col: 168, type: "end" },
        ];
        getAllEvents(parser, arrEvents, () => {
            arrEvents.forEach((event, i) => {
                expect(event).toEqualEvent(targetEvents[i]);
            });
            done();
        });
        parser.parse(
            '<!DOCTYPE HTML><html><head><meta charset="UTF-8"><title>testtitle</title></head><body><p><a href="testhref" title="atitle">aaa<span>bbb</span>ccc</a></p></body></html>'
        );
    });
});

describe("HTMLParser: Object parse", () => {
    test("should parse doctype: HTML Strict DTD", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("comment", {
                content:
                    'DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"',
                long: false,
            });
            done();
        });
        parser.parse(
            '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">'
        );
    });

    test("should parse doctype: HTML Transitional DTD", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("comment", {
                content:
                    'DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"',
                long: false,
            });
            done();
        });
        parser.parse(
            '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'
        );
    });

    test("should parse doctype: HTML Frameset DTD", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("comment", {
                content:
                    'DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd"',
                long: false,
            });
            done();
        });
        parser.parse(
            '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">'
        );
    });

    test("should parse doctype: XHTML 1.0 Strict", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("comment", {
                content:
                    'DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"',
                long: false,
            });
            done();
        });
        parser.parse(
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'
        );
    });

    test("should parse doctype: XHTML 1.0 Transitional", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("comment", {
                content:
                    'DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"',
                long: false,
            });
            done();
        });
        parser.parse(
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
        );
    });

    test("should parse doctype: XHTML 1.0 Frameset", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("comment", {
                content:
                    'DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd"',
                long: false,
            });
            done();
        });
        parser.parse(
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">'
        );
    });

    test("should parse doctype: XHTML 1.1", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("comment", {
                content:
                    'DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"',
                long: false,
            });
            done();
        });
        parser.parse(
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">'
        );
    });

    test("should parse doctype: html5", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("comment", {
                content: "DOCTYPE HTML",
                long: false,
            });
            done();
        });
        parser.parse("<!DOCTYPE HTML>");
    });

    test("should parse start tag: <p>", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("tagstart", {
                tagName: "p",
            });
            done();
        });
        parser.parse("<p>");
    });

    test('should not parse start tag: <div class"foo">', done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("text", {
                raw: '<div class"foo">',
            });
            done();
        });
        parser.parse('<div class"foo">');
    });

    test('should not parse start tag: <div class="foo>', done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("text", {
                raw: '<div class="foo>',
            });
            done();
        });
        parser.parse('<div class="foo>');
    });

    test('should not parse start tag: <div class=foo">', done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("text", {
                raw: '<div class=foo">',
            });
            done();
        });
        parser.parse('<div class=foo">');
    });

    test('should not parse start tag: <div class="foo"">', done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("text", {
                raw: '<div class="foo"">',
            });
            done();
        });
        parser.parse('<div class="foo"">');
    });

    test('should not parse start tag: <div class="foo""><span">', done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("text", {
                raw: '<div class="foo""><span">',
            });
            done();
        });
        parser.parse('<div class="foo""><span">');
    });

    test('should not parse start tag: <div class="foo""><a><span">', done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("text", {
                raw: '<div class="foo"">',
            });
            done();
        });
        parser.parse('<div class="foo""><a><span">');
    });

    test("should parse tag attrs", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("tagstart", {
                tagName: "img",
            });
            const attrWidth = arrEvents[1].attrs[0];
            expect(attrWidth.name).toBe("width");
            expect(attrWidth.value).toBe("200");
            expect(attrWidth.quote).toBe('"');
            const attrHeight = arrEvents[1].attrs[1];
            expect(attrHeight.name).toBe("height");
            expect(attrHeight.value).toBe("300");
            expect(attrHeight.quote).toBe("'");
            const attrAlt = arrEvents[1].attrs[2];
            expect(attrAlt.name).toBe("alt");
            expect(attrAlt.value).toBe("abc");
            expect(attrAlt.quote).toBe("");
            const attrAB = arrEvents[1].attrs[3];
            expect(attrAB.name).toBe("a.b");
            expect(attrAB.value).toBe("ccc");
            expect(attrAB.quote).toBe("");
            const attrCD = arrEvents[1].attrs[4];
            expect(attrCD.name).toBe("c*d");
            expect(attrCD.value).toBe("ddd");
            expect(attrCD.quote).toBe("");
            done();
        });
        parser.parse("<img width=\"200\" height='300' alt=abc a.b=ccc c*d=ddd>");
    });

    test("should parse end tag", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("tagend", {
                tagName: "p",
            });
            done();
        });
        parser.parse("</p>");
    });

    test("should parse selfclose tag", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("tagstart", {
                tagName: "br",
                close: "/",
            });
            done();
        });
        parser.parse("<br />");
    });

    test("should parse text", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[2]).toEqualEvent("text", {
                raw: "abc",
            });
            done();
        });
        parser.parse("<span>abc</span>");
    });

    test("should parse text in last", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[2]).toEqualEvent("text", {
                raw: "bbb",
            });
            done();
        });
        parser.parse("<p>bbb");
    });

    test("should parse comment", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("comment", {
                content: "comment\r\ntest",
                long: true,
            });
            done();
        });
        parser.parse("<!--comment\r\ntest-->");
    });

    test("should parse cdata: script", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            let mapAttrs;
            expect(arrEvents[1]).toEqualEvent("tagstart", {
                tagName: "script",
            });
            mapAttrs = parser.getMapAttrs(arrEvents[1].attrs);
            expect(mapAttrs.type).toBe("text/javascript");
            expect(arrEvents[2]).toEqualEvent("cdata", {
                tagName: "script",
                raw: 'alert(1);\r\nalert("</html>");',
            });
            mapAttrs = parser.getMapAttrs(arrEvents[2].attrs);
            expect(mapAttrs.type).toBe("text/javascript");
            expect(arrEvents[3]).toEqualEvent("tagend", {
                tagName: "script",
            });
            done();
        });
        parser.parse('<script type="text/javascript">alert(1);\r\nalert("</html>");</script>');
    });

    test("should parse cdata: style", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("tagstart", {
                tagName: "style",
                type: "text/css",
            });
            expect(arrEvents[2]).toEqualEvent("cdata", {
                tagName: "style",
                raw: "body{font-size:12px;\r\nbackground-color:green;}",
            });
            expect(arrEvents[3]).toEqualEvent("tagend", {
                tagName: "style",
            });
            done();
        });
        parser.parse(
            '<style type="text/css">body{font-size:12px;\r\nbackground-color:green;}</style>'
        );
    });
});

describe("HTMLParser: Case parse", () => {
    test("should parse special end tag", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("tagend", {
                tagName: "p",
            });
            done();
        });
        parser.parse("</p >");
    });

    test("should parse special no quotes tags", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("tagstart", {
                tagName: "link",
            });
            expect(arrEvents[2]).toEqualEvent("tagstart", {
                tagName: "link",
            });
            done();
        });
        parser.parse("<link rel=icon /><link rel=icon />");
    });

    test("should parse special empty attr", done => {
        const parser = new HTMLParser();
        const arrEvents = [];
        getAllEvents(parser, arrEvents, () => {
            expect(arrEvents[1]).toEqualEvent("tagstart", {
                tagName: "img",
                close: "",
            });
            const attrs = arrEvents[1].attrs;
            expect(attrs).toHaveLength(2);
            expect(attrs[1].name).toBe("alt");
            expect(attrs[1].value).toBe("/");
            done();
        });
        parser.parse('<img src="aaa" alt= />');
    });
});
