const path = require("path");
const webpack = require("webpack");
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
    entry: "./src/index.js",
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "lib"),
        filename: "htmlhint.js",
        library: "HTMLHint",
        libraryTarget: "umd",
    },
    externals: {
        csslint: {
            commonjs: "csslint",
            commonjs2: "csslint",
            amd: "csslint",
            root: "CSSLint",
        },
        jshint: {
            commonjs: "jshint",
            commonjs2: "jshint",
            amd: "jshint",
            root: "JSHINT",
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        extends: path.join(__dirname, ".babelrc"),
                    },
                },
            },
        ],
    },
    plugins: [
        new webpack.BannerPlugin(
            `/*!\r\n * HTMLHint v${
                pkg.version
            }\r\n * https://github.com/kohlmannj/HTMLHint\r\n *\r\n * (c) 2014-${new Date().getFullYear()} Yanis Wang <yanis.wang@gmail.com>.\r\n * MIT Licensed\r\n */\n`
        ),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(pkg.version),
            RELEASE: JSON.stringify(dateFormat("yyyyMMdd")),
        }),
    ],
};
