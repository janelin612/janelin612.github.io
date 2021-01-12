---
layout: post
title: 在Windows上對ios的Safari進行偵錯
---

之前處理過在[電腦上偵錯Android APP內的WebView]({% post_url 2018-09-05-android-webview-debug %})，現在類似的問題又來了，只是這次變成偵錯的是iPhone裡面的Safari。

<!-- more -->

不得不說在IE被淘汰的差不多，連微軟自己都改推Edge之後，Safari就變成了當年的IE...一堆奇奇怪怪的問題

## 作法

TL;TR 就安裝這個套件，照著裡面的README去走，就可以用了  
[RemoteDebug/remotedebug-ios-webkit-adapter](https://github.com/RemoteDebug/remotedebug-ios-webkit-adapter){: target="_blank"}

### 安裝

1. 開啟Powershell然後執行:
```shell
scoop bucket add extras
scoop install ios-webkit-debug-proxy
```
2. NPM Install
```shell
npm install remotedebug-ios-webkit-adapter -g
```
3. 在iPhone的Safari設定裡面允許遠端偵錯

### 執行
1. 在CMD把背景服務run起來
```shell
remotedebug_ios_webkit_adapter --port=9000
```
2. 在Chrome開啟inspect分頁 `chrome://inspect/#devices`
3. 開工