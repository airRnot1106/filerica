# Filerica

[English](https://github.com/airRnot1106/filerica/blob/main/README.md)

<div align="center">
    <img src="https://user-images.githubusercontent.com/62370527/153430059-6ecadf2f-046f-4507-acf2-26cb99efcc5b.png" alt="logo" width="80%" height="80%">
</div>

---

[![npm](https://img.shields.io/badge/-Npm-CB3837.svg?logo=npm&style=popout)](https://www.npmjs.com/package/filerica) ![node.js](https://img.shields.io/badge/-Node.js-333333.svg?logo=node.js&style=popout) ![npm](https://img.shields.io/npm/dt/filerica) [![GitHub issues](https://img.shields.io/github/issues/airRnot1106/filerica)](https://github.com/airRnot1106/filerica/issues) [![GitHub forks](https://img.shields.io/github/forks/airRnot1106/filerica)](https://github.com/airRnot1106/filerica/network) [![GitHub stars](https://img.shields.io/github/stars/airRnot1106/filerica)](https://github.com/airRnot1106/filerica/stargazers) [![GitHub license](https://img.shields.io/github/license/airRnot1106/filerica)](https://github.com/airRnot1106/filerica/blob/main/LICENSE) [![Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2FairRnot1106%2Ffilerica%2Ftree%2Fmain)](https://twitter.com/intent/tweet?text=CLI%E3%81%AE%E7%B0%A1%E5%8D%98%E3%81%AA%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E5%88%86%E9%A1%9E%E3%83%84%E3%83%BC%E3%83%AB:&url=https%3A%2F%2Fgithub.com%2FairRnot1106%2Ffilerica%2Ftree%2Fdevelop)

**_そろそろ散らかったファイルたちを整理しようか_**

## Highlight

-   CLI で簡単にファイル分類

-   コマンドひとつで実行可能

-   特に学生におすすめです

## Requirement

**バージョン 16.x 以上の Node が必要です。**

## Install

```sh
npm install -g filerica
```

## Usage

1. `npx filerica i [inputPath]`

    初めて Filerica を起動する場合は、input-path を設定してください。Filerica は input-path で指定されたディレクトリにあるファイルを分類します。

2. `npx filerica b [boardName, boardPath] --s`

    次に、ボードを作成します。ボードとは分類先のディレクトリのことです。`--s` オプションで、作成と同時にボードを選択することができます。

3. `npx filerica e`

    さて、分類のルールを説明しましょう。分類するファイル名は「class 名 何回目 資料名」とし、例えば"数学 第 8 回 講義資料.pdf"のようにします。分類を実行すると、board の"Math"というディレクトリの中に"8"というディレクトリが作られ、そこにファイルが移動されます。ただし、あらかじめ board に「Math」ディレクトリを作成しておく必要があります。

## Commands

-   `execute`(alias: `e`)

    分類を実行します。input-path とボードが指定されている必要があります。

-   `input [inputPath]`(alias: `i`)

    input-path を変更します。

-   `board [name, path]`(alias: `b`)

    ボードを作成します。

    ##### Options

    -   `--s`: 作成と同時に選択します
    -   `-sp [separator]`: セパレータを指定します
    -   `--rm`: ボードを削除します
    -   `--l`: ボードの一覧を表示します

-   `select`(alias: `s`)

    ボードを選択します。

    ##### Options

    -   `-n [name]`: ボードの名前から直接選択します

-   `separator [separator]`(alias: `sp`)

    現在選択されているボードのセパレータを変更します。デフォルトは半角スペースです。例えば、"\_"を指定した場合、ファイル名のルールは "Math_week8_doc.pdf "の様になります。

    ##### Options

    -   `--rs`: セパレータをデフォルトの半角スペースにリセットします

-   `language`(alias: `l`)

    言語を変更します。

## Issues

バグや要望は issue か Twitter にてお願いします:bug:

## Author

-   Github: [airRnot1106](https://github.com/airRnot1106)
-   NPM: [airrnot1106](https://www.npmjs.com/~airrnot1106)
-   Twitter: [@airRnot1106](https://twitter.com/airRnot1106)

## LICENSE

This project is licensed under the MIT License - see the [LICENSE](https://github.com/airRnot1106/filerica/blob/main/LICENSE) file for details.
