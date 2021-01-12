---
layout: post
title: 在Windows上對ios的Safari進行偵錯
---

之前處理過在[電腦上偵錯 Android APP 內的 WebView]({% post_url 2018-09-05-android-webview-debug %})，現在類似的問題又來了，只是這次變成偵錯的是 iPhone 裡面的 Safari。

<!-- more -->

不得不說在 IE 被淘汰的差不多，連微軟自己都改推 Edge 之後，Safari 就變成了當年的 IE...一堆奇奇怪怪的問題

## 作法

TL;TR 就安裝這個套件，照著裡面的 README 去走，就可以用了  
[RemoteDebug/remotedebug-ios-webkit-adapter](https://github.com/RemoteDebug/remotedebug-ios-webkit-adapter){: target="_blank"}

### 安裝

1. 開啟 Powershell 然後執行:
```shell
scoop bucket add extras
scoop install ios-webkit-debug-proxy
```
2. NPM Install
```shell
npm install remotedebug-ios-webkit-adapter -g
```
3. 在 iPhone 的 Safari 設定裡面允許遠端偵錯

### 執行
1. 在 CMD 把背景服務 run 起來
```shell
remotedebug_ios_webkit_adapter --port=9000
```
2. 在 Chrome 開啟 inspect 分頁 `chrome://inspect/#devices`
3. 開工