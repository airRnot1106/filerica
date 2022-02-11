# Filerica

[日本語](https://github.com/airRnot1106/filerica/blob/main/doc/README_ja.md)

<div align="center">
    <img src="https://user-images.githubusercontent.com/62370527/153430059-6ecadf2f-046f-4507-acf2-26cb99efcc5b.png" alt="logo" width="80%" height="80%">
</div>

---

[![npm](https://img.shields.io/badge/-Npm-CB3837.svg?logo=npm&style=popout)](https://www.npmjs.com/package/filerica) ![node.js](https://img.shields.io/badge/-Node.js-333333.svg?logo=node.js&style=popout) ![npm](https://img.shields.io/npm/dt/filerica) [![GitHub issues](https://img.shields.io/github/issues/airRnot1106/filerica)](https://github.com/airRnot1106/filerica/issues) [![GitHub forks](https://img.shields.io/github/forks/airRnot1106/filerica)](https://github.com/airRnot1106/filerica/network) [![GitHub stars](https://img.shields.io/github/stars/airRnot1106/filerica)](https://github.com/airRnot1106/filerica/stargazers) [![GitHub license](https://img.shields.io/github/license/airRnot1106/filerica)](https://github.com/airRnot1106/filerica/blob/main/LICENSE) [![Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2FairRnot1106%2Ffilerica%2Ftree%2Fmain)](https://twitter.com/intent/tweet?text=CLI_for_easy_file_classification:&url=https%3A%2F%2Fgithub.com%2FairRnot1106%2Ffilerica%2Ftree%2Fdevelop)

**_Isn't it time to organize your cluttered files?_**

## Highlight

-   CLI for easy file classification

-   Execute with a single command

-   Especially recommended for students

## Install

```sh
npm install -g filerica
```

## Usage

1. `npx filerica i [inputPath]`

    If you are launching Filerica for the first time, please set input-path. Filerica will classify the files in the directory specified in input-path.

2. `npx filerica b [boardName, boardPath] --s`

    Next, create a board. A board is a directory for classification. `--s` option allows you to select the board as you create it.

3. `npx filerica e`

    Now, let me describe the rules for classification. The name of the file to be classified is "class_name number file_name", such as "Math week8 doc.pdf". When you run the classification, a directory named "8" will be made inside the directory "Math" in board, and the files will be moved there. However, you need to make a "Math" directory in board beforehand.

## Commands

-   `execute`(alias: `e`)

    Execute classification. The input-path and board must be specified.

-   `input [inputPath]`(alias: `i`)

    Change input-path.

-   `board [name, path]`(alias: `b`)

    Register a board.

    ##### Options

    -   `--s`: Select as well as create
    -   `-sp [separator]`: Specify the separator
    -   `--rm`: Remove a board
    -   `--l`: Display boards list

-   `select`(alias: `s`)

    Select a board.

    ##### Options

    -   `-n [name]`: Specifies the name of the board directly

-   `separator [separator]`(alias: `sp`)

    Change the separator for the currently selected board. The default is blank space. For example, if you specify "\_", the file name rule will be "Math_week8_doc.pdf".

    ##### Options

    -   `--rs`: Resets the separator to the default blank space

-   `language`(alias: `l`)

    Change language. 日本のユーザは、まずは日本語に変更することをお勧めします。:jp:

## Issues

If you find a bug or problem, please open an issue!:bug:

## Author

-   Github: [airRnot1106](https://github.com/airRnot1106)
-   NPM: [airrnot1106](https://www.npmjs.com/~airrnot1106)
-   Twitter: [@airRnot1106](https://twitter.com/airRnot1106)

## LICENSE

This project is licensed under the MIT License - see the [LICENSE](https://github.com/airRnot1106/filerica/blob/main/LICENSE) file for details.
