/* eslint-disable import/no-extraneous-dependencies */
const { default: presetEnv } = require("babel-preset-env");
const presetStage1 = require("babel-preset-stage-1");
const { default: transformDefine } = require("babel-plugin-transform-define");
const { default: pluginBanner } = require("@comandeer/babel-plugin-banner");
const pkg = require("./package.json");

function dateFormat(date, format) {
    if (format === undefined) {
        format = date;
        date = new Date();
    }
    const map = {
        M: date.getMonth() + 1, // 月份
        d: date.getDate(), // 日
        h: date.getHours(), // 小时
        m: date.getMinutes(), // 分
        s: date.getSeconds(), // 秒
        q: Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(), // 毫秒
    };
    format = format.replace(/([yMdhmsqS])(\1)*/g, (all, t) => {
        let v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = `0${v}`;
                v = v.substr(v.length - 2);
            }
            return v;
        } else if (t === "y") {
            return `${date.getFullYear()}`.substr(4 - all.length);
        }
        return all;
    });
    return format;
}

module.exports = {
    moduleId: "HTMLHint",
    presets: [
        [
            presetEnv,
            {
                modules: "umd",
                targets: {
                    browsers: ["last 2 versions"],
                },
            },
        ],
        presetStage1,
    ],
    plugins: [
        [
            transformDefine,
            {
                VERSION: JSON.stringify(pkg.version),
                RELEASE: JSON.stringify(dateFormat("yyyyMMdd")),
            },
        ],
        [
            pluginBanner,
            {
                banner: `/*!\r\n * HTMLHint v${
                    pkg.version
                }\r\n * https://github.com/kohlmannj/HTMLHint\r\n *\r\n * (c) 2014-${new Date().getFullYear()} Yanis Wang <yanis.wang@gmail.com>.\r\n * (c) 2014 Takeshi Kurosawa <taken.spc@gmail.com>.\r\n * MIT Licensed\r\n */`,
            },
        ],
    ],
    env: {
        test: {
            presets: [
                [
                    presetEnv,
                    {
                        targets: {
                            node: "8",
                        },
                    },
                ],
                presetStage1,
            ],
            plugins: [
                [
                    transformDefine,
                    {
                        VERSION: JSON.stringify(pkg.version),
                        RELEASE: JSON.stringify(dateFormat("yyyyMMdd")),
                    },
                ],
            ],
        },
    },
};
