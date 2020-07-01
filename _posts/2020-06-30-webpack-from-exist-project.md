---
layout: post
title: 將Webpack套用至現存的專案
image: /public/res/2020-06-30_184850.jpg
---
![](/public/res/2020-06-30_184850.jpg)

網路上有不少手把手一步一步把[Webpack](https://webpack.js.org/){: target='_blank'}專案建構起來的教學，但如果你是想要把手邊亂七八糟的專案導入Webpack呢？

<!-- more -->

## 0. 前言

webpack有不少雷來自於版本的差異，如果你上網估狗做法之後剪剪貼貼，很有可能會因為版本更新了而無法使用。所以這件事情寫在最前面，以下分享的內容基於`webpack 4.43.0` ，並預設您已裝好`node.js`以及`npm`，且具備基礎知識。

### 為什麼我要導入Webpack

簡單提一下我的原始專案，他是一隻單一一個html檔的專案，不過他有好幾隻的js檔，為了對應不同的業務需求有時候要載入`a.js`、`b.js`，有時候卻載入`a.js`跟`c.js`，每次版本切換就要把某幾行註解掉，另外幾行取消註解，html檔本身也有幾行要修改，久了就覺得我應該要用工具做掉這件事情，於是找上了Webpack。

如果你是為了類似的需求才找到這篇文章，那應該會有點幫助。


## 1. 開新專案

先開個新資料夾再慢慢把檔案搬進來吧。  
開好之後cd進去，然後開始初始化

```cmd
$ npm init
$ npm i -D webpack webpack-cli 
```

然後在根目錄新增幾個資料夾，以下這些資料夾&檔案命名都隨便，但有些命名習慣可以遵守，不吃虧。

```
./src/           //放程式碼
./static/        //放靜態資源，例如不想被打包的library，或者圖片檔之類的
./dist/          //放建置完成的結果(可以拿去部署)
```

接著新增兩個檔案

```
./index.js          //程式的進入點
./webpack.conf.js   //webpack的設定檔
```

然後將建置用的指令放到`package.json`裡

```json
"scripts": {
    "build": "webpack --config webpack.conf.js",
  }
```
這樣，只要執行`npm run build`就會建置了 (但你現在執行會報錯就是，畢竟設定檔是空的)  
所以來編輯一下`webpack.conf.js`吧

```javascript
const path = require('path');
module.exports = {
  entry: './index.js',
  output: {
    filename: 'output.js',
    path: path.resolve(__dirname, 'dist'),
  }
}
```
這時候再建置一次，你的dist資料夾內就應該有個`output.js`檔，這樣就算是會動了。

## 2. 撰寫`index.js`

整理一堆js檔成為一個樹狀結構是這邊主要要做的事情。  
由於有點複雜，我們先講結論：

1. 梳理樹狀結構，找到相依樹的根當成`index.js`
2. 其他被依賴的`js`檔模組(`module`)化
3. 掛載會直接被html呼叫的程式到全域變數

### 梳理結構

原始的html可能長這樣:

```html
<head>
  <script src="a.js"></script>
  <script src="b.js"></script>
  <script src="c.js"></script>
</head>
```
你要自行梳理出例如`a`才是主程式，並依賴於`b`跟`c`這樣的關係  
這樣的例子中，你就可以把`a.js`的內容移植到`index.js`內

於是現在變成這樣:

```
./index.js //原本的a.js

./src/b.js
./src/c.js
```
### 模組化

原本的`b.js`檔可能是扁平的
```javascript
const A=0;

function getA(){
    return A;
}
```
反正這樣掛載到html上可以直接呼叫`getA()`使用，但透過webpack注入的話其他模組是無法呼叫到這些方法與變數的，所以要使用關鍵字`export`對外部公開
```javascript
//依然無法被外部存取
const A=0; 

//可以被外部存取
export function getA(){
    return A;
}
```
這時候可以在`index.js`透過以下方法使用
```javascript
import { getA } from './src/b.js'

console.log(getA()); //0
```

### 掛載全域變數
上述是模組的部分，但如果你的程式碼是會直接被html使用的呢？例如這樣
```html
<form onsubmit="start(); return false">
</form>
```
```javascript
function start(){
    // do something...
}
```
這時候你可以把方法掛載到全域變數解決問題
```javascript
window.start = function(){
    // do something...
}
```

## 3. 設定插件

搞定javascript的部分，那其他的檔案呢？

### 使用`HtmlWebpackPlugin`導入html
首先要有一個概念是webpack是以打包js檔為主的工具，所以你要引入任何不是js檔的東西都要額外裝插件，這跟我們單純在寫網頁，是把各種東西引入到html檔內的思維不太一樣。

安裝
```
$ npm i -D html-webpack-plugin
```

然後在`webpack.conf.js`啟用插件
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'output.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
   new HtmlWebpackPlugin({
     filename: 'index.html',
     template: './src/template/index.html',
     inject: true
   })
  ],
}
```
其中`filename`是輸出時的檔案名稱，而`template`則是你的原始html檔。   
別忘了把你的html檔要被動態載入的資源清乾淨，包括`js`跟`css`，所有動態載入的東西最後會被自動放到`body`末端，像這樣:

```html
<html>
<head></head>
<body>
    ...
    <!-- 這行不用自己寫 -->
    <script src="output.js"></script> 
</body>
</html>
```

> 也就是說，不希望動態載入的東西請留在html內

### 使用`CopyWebpackPlugin`複製靜態資源

前面提到不希望動態載入的東西要維持原狀，這些東西可以借助這個套件在建置的時候自動複製到`/dist`資料夾內

安裝
```
$ npm i -D copy-webpack-plugin
```

啟用
```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin');

//上半省略
plugins: [
   new HtmlWebpackPlugin({
     filename: 'index.html',
     template: './src/template/index.html',
     inject: true
   }),
   new CopyWebpackPlugin({
      patterns: [
        { from: './static', to: path.resolve(__dirname, 'dist') }
      ],
    })
  ],
```
參數應該很好懂，從`./static`複製到`./dist`


### 使用`SCSS`

這年頭應該沒有人直接寫css檔吧？~~地圖砲~~ 

安裝相依
```
$ npm i -D node-sass sass-loader style-loader
```

啟用
```javascript
module.exports = {
  //前面同上省略
  module: {
    rules: [
      {
        test: /\.css$/, use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: { modules: true }
          },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ]
  }
}
```

就這樣，然後就可以直接在`index.js`引入你的`scss`檔了
```javascript
import './src/style.scss'
```

## 4. 其他可以考慮設定的東西

### 路徑別名
可以隨便指定一個符號當成根目錄，這樣可以解決惱人的相對路徑問題

```js
module.exports = {
  resolve: {
      extensions: ['.js', '.json'],
      alias: {
        '@':path.join(__dirname, '/src'),
      }
    }
}
```

### 程式碼壓縮
網路上可能會查到`UglifyJsPlugin`之類的工具，但這東西已經被webpack棄用了，要改用以下方法：

安裝
```
$  npm i -D  terser-webpack-plugin
```

設定
```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  }
}
```
> 詳細設定: [TerserWebpackPlugin](https://webpack.js.org/plugins/terser-webpack-plugin/){: target='_blank'}

### 開發用伺服器`dev-server`
如果你不想改一行就要build一次，你會需要這東西

安裝
```
$  npm i -D  webpack-dev-server
```

然後將的指令放到`package.json`裡

```json
"scripts": {
    "build": "webpack --config webpack.conf.js",
    "dev": "webpack-dev-server --inline --progress --config webpack.conf.js",
  }
```

這樣就可以透過`npm run dev`開啟一個開發用伺服器預覽效果，並支援hot reload


## 後記
上面做了一大堆，其實我的原始需求: 根據業務需求自動載入我需要的某幾隻程式都還沒做XD  
這我最後是透過分別寫兩個`webpack.conf.js`檔並分開建置完成的

```
$ webpack --config webpack.a.conf.js
$ webpack --config webpack.b.conf.js
```

過去寫過好幾個用`vue-cli`建立起來的專案，雖然知道其是建立在webpack的基礎上完成，但實際從頭開一個webpack的專案才知道原來這麼多東西要設定...

因為我自己也還在一邊寫一邊學，以上內容如果有錯歡迎告知一下，謝謝:D