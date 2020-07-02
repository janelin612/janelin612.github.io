---
layout: post
title: 關於我寫的乃木坂部落格備份站
image: /n46-crawler/assets/ogimg.jpg
---
![](https://janelin612.github.io/n46-crawler/assets/ogimg.jpg)

一直都有想寫這一篇，但因為具體上不知道要寫到多細所以遲遲沒有動筆。

<!-- more -->

## 緣起
小弟2017年中因為接觸16單入坑，當時自然是已經沒有橋本的部落格可以看了，所以當年年底伊藤万理華畢業的時候就想說不然來把部落格文章通通拉一份下來好了，以後說不定忽然會想看。

那時候草草規劃了幾個決定：

+ 用Node.js寫：  
上班寫Android，下班Side-project換個語言。在Github上找到了這個：[ bda-research /
node-crawler ](https://github.com/bda-research/node-crawler){: target='_blank'}，爬蟲主要是依賴這個套件完成的。
+ 資料存成JSON格式：  
原因主要還是懶，資料庫管理一直都是我的弱項，直覺就是逃避。加上我希望架成靜態網站，JSON方便直接在前端處理
+ 圖片要全部下載：  
雖然專案容量因此暴增，但是是值得的
+ 不保存底下的留言：  
~~其他人講了什麼我才不在乎~~
+ 採用成員宣布畢業才一口氣下載的設計：  
其實比較好的做法應該是架一台伺服器，每次有人發文就下載一篇，這樣才能存到原始的大圖(部落格發表後一陣子圖片會被壓縮，鳥設計)，但這樣很多架構都要改掉，還是一個字：懶

## 爬蟲流程

1. 指定某個成員之後爬取年月的列表
2. 進入每個月份爬取該月總分頁數
3. 於每個分頁爬取標題清單
4. 下載清單的所有文章

之所以設計這樣流程，原因是因為我發現如果邏輯改成打開最新一篇之後一直爬上一篇，有機會掛掉，掛掉的原因分成兩種
1. 網站設計的問題：  
好像上一頁不能無限的按回到第一篇文章(分頁數疑似有上限)
2. 文章內文會有問題：  
部落格本質上是UGC(用戶原創內容)，如果成員把文章的html編輯壞了雖然在網站上可以顯示，但爬蟲會掛掉XD  為了避免任何一篇文章出錯就把整個爬蟲弄停真的是煞費苦心...

所以雖然這樣爬起來不是很快，但應該是堪用了，我也怕速度再提升爬蟲會被網站擋下來。

附上[程式碼](https://github.com/janelin612/n46-crawler/blob/master/src/n46-crawler.js){: target='_blank'}，如果你真的有興趣的話。

## 設計靜態網站
這本來只是個後端爬蟲專案，沒想到隨手寫個簡單的閱讀器竟然花了我一大堆的時間...  
[乃木坂46卒業メンバーのブログ](https://janelin612.github.io/n46-crawler/){: target='_blank'}

最原始的概念很簡單，就是一個html檔，打開可以看同目錄下的JSON，就這樣。

![](/public/res/2020-07-02_222459.jpg)
> 其實第一版的畫面跟現在沒有太多改變

畫面是用Vue.js兜出來的，由於前述原因所以也沒有用`vue-cli`開專案，直接引入js檔隨隨便便就開工了。  
但寫一寫發現了一些問題...

### Chrome的`file-access-from-files`
這問題一開始是Chrome獨有的，我一直都是firefox的使用者，很後來才注意到我最初的構想用一個單純的html文件當閱讀器是行不通的，因為chrome不允許在檔案內存取另一個檔案(現在Firefox也不支援了)，為此我後來還特別寫了一篇文章：
> [處理Chrome無法讀取本地端文件問題](/2019/06/19/chrome-file-access-from-files.html)

這問題的解法就是要架站，那既然要架站乾脆就直接丟上github page的服務吧。

### 要認真經營嗎？
這東西毫無疑問的有著作權問題，所以我起初設了幾個規則

+ 不放廣告
+ 不上搜尋引擎
+ 不塞GA

但後來基於個人的好奇心~~以及虛榮心~~，除了第一點之外剩下的都做了...

#### 搜尋引擎優化
去Google註冊一個網站很簡單，但要被真的搜尋到可不容易。  
對前端框架跟SEO有點概念的人可能會猜到問題點，沒有錯，我需要做SSR(Server side rendering)

> 不知道SSR是什麼的同學可以閱讀一下這篇的第一段：  
> [SSR — Nuxt.js 超入門](https://medium.com/@jackercleaninglab/ssr-nuxt-js-%E8%B6%85%E5%85%A5%E9%96%80-84a0823b45ed){: target='_blank'}

但我只引入單檔，沒辦法使用[Nuxt.js](https://nuxtjs.org/){: target='_blank'}幫我做好，所以這部份後來算是用手刻的方法硬著頭皮把它完成的。  
有賴於Google的搜尋引擎爬蟲可以執行JS，所以我用了Babel把程式轉成Google Bot可以執行的版本加上預先填入部分資訊到html檔內完成87%像的SSR，至少搜尋引擎可以辨識他們是不同的網頁，而不是大量重複內容然後降我排名。

後來寫了一隻程式專門做這件事情，把資料預填好然後複製html到對應的資料夾內，並產生Sitemap.xml，現在要手動的部分越來越少了。

#### 成果
這應該是可以分享的吧？
![](/public/res/2020-07-02_231233.jpg)

然後第一名的搜尋關鍵字是[西野七瀬 ブログ](https://www.google.com/search?q=%E8%A5%BF%E9%87%8E%E4%B8%83%E7%80%AC+%E3%83%96%E3%83%AD%E3%82%B0){: target='_blank'}，用個字去查排名比七瀨的官網還要前面，~~希望官方不要宰了我~~


### RWD
掛了GA之後發現大部分的使用者都是使用手機，所以開始著手處理RWD  
為了精簡要做的事情，我選擇把左手邊兩塊（成員資料、文章列表）做成浮動的，需要的時候滑出來，要看文章的時候會向左收闔，完全使用CSS達成，最後的成果我還蠻喜歡的。

## 未來方向
爬蟲本身沒啥好改的了，只要乃木坂的官網沒有大改版我應該就不會再去改它。之前有額外寫一個櫸坂46的版本，可以運作，但我沒有實際在用，寫好玩的。

但網站本身倒是蠻多事情可以做的

+ 買一個域名：  
目前使用github pages給的預設名稱，變成會跟我現在這個部落格互相干擾SEO，GA資料也都混在一起，更重要的是網址直接就是我的github帳號名稱實在是有點赤裸，未來看要幫我的部落格換一個域名，還是幫這個站換域名。
+ 用Nuxt.js完全改寫：  
前面提到克難的SSR，終極解法還是整個網站全部改寫一遍，目前有在嘗試了，只是遇到各種問題呈現一個半放棄的狀態，再給我一點時間吧。
+ 建資料庫：  
現在存成json最大的問題是要一口氣下載全部的文章才能顯示，浪費很多時間跟流量，還是要有一個後端才行。但這個真的很麻煩我覺得應該只是提一下，永遠不會去做XD
+ 往前追加成員：  
現存最早的資料是橋本的，看能不能至少補個深川麻衣的。但這等於要去爬別人爬的第二手資料，爬蟲要全部重寫，也不是一件容易的事情。

## 後記
這篇本來寫了三分之一就擺著，是昨天就這麼剛好在推特看到睽違了三年的橋本的消息才想到該來把它完成。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">奈々未ちゃんが<br>CELENAスタート初日にお花を持って来てくれた😭✨<br><br>あれからずーっとずーっと<br>綺麗で可愛いよ😌✨<br><br>選んでくれたお花の色も<br>センスが良すぎる🥺💕<br><br>本当にありがとう😭<br>これからもよろしくお願いします🙏<a href="https://twitter.com/hashtag/%E6%A9%8B%E6%9C%AC%E5%A5%88%E3%80%85%E6%9C%AA?src=hash&amp;ref_src=twsrc%5Etfw">#橋本奈々未</a>　<a href="https://twitter.com/hashtag/%E7%BE%8E%E5%AE%B9%E5%AE%A4?src=hash&amp;ref_src=twsrc%5Etfw">#美容室</a> <a href="https://twitter.com/hashtag/%E7%BE%8E%E5%AE%B9%E5%B8%AB?src=hash&amp;ref_src=twsrc%5Etfw">#美容師</a> <a href="https://twitter.com/hashtag/%E9%9D%92%E5%B1%B1?src=hash&amp;ref_src=twsrc%5Etfw">#青山</a> <a href="https://twitter.com/hashtag/%E8%A1%A8%E5%8F%82%E9%81%93?src=hash&amp;ref_src=twsrc%5Etfw">#表参道</a> <a href="https://twitter.com/hashtag/%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%A1%E3%83%B3%E3%83%88?src=hash&amp;ref_src=twsrc%5Etfw">#トリートメント</a> <a href="https://t.co/mOWg93bF5U">pic.twitter.com/mOWg93bF5U</a></p>&mdash; kanami (@kanami_k_820) <a href="https://twitter.com/kanami_k_820/status/1278308851977031681?ref_src=twsrc%5Etfw">July 1, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 