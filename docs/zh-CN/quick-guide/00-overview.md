# LiteRT/HTTP.js 概述

> [返回目录](../index.md)

## 概述

LiteRT/HTTP.js 是一个基于 Node.js HTTP(S) API 实现的轻量级框架，有以下特点：

- 使用 TypeScript 编写。
- 使用了 ES2017 的 async/await 语法，更优雅的异步控制。
- 提供中间件（Middleware）支持
- 提供 HTTPS 支持
- 智能路由，实现 API 更方便。
- 提供 HTTP/2 支持（实验版本）

## 使用要求

| 依赖部件      | 最低版本          |
|--------------|-------------------|
| Node.js      | v8.0.0            |
| TypeScript   | v2.6.1            |

## 安装

请使用 NPM 安装：

```sh
npm i @litert/http --save
```

如果想体验最新的开发版本（非稳定版本），请使用：

```sh
npm i @litert/http@dev --save
```

> [下一节：快速上手](./01-quick-start.md) | [返回目录](../index.md)
