# Plus rich-text editor

## webview / iframe 通信

### 页面地址

支持pc嵌入iframe、安卓/IOS端嵌入webview

- PC iframe 地址 `http://test-plus.zhibocloud.cn/plus-editor/dist/desktop.html`

- 移动端 webview 地址 `http://test-plus.zhibocloud.cn/plus-editor/dist/index.html`

### webview -> 客户端 通信

- 安卓端注入 `window.launcher` 对象
- IOS 端注入 `window.messageHandlers` 对象
- PC iframe 使用 `window.top.postMessage` 进行通信 **注意自行设置接受 postMessage 消息的安全域名, 详见 https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage#Security_concerns **

调用时只需使用 `src/caller.ts` 中的 `callMethod` 方法通知各客户端

### 客户端 -> webview 通信

在各环境中直接调用 webview 中提供的 javascript 方法即可

## 事件

### 向富文本编辑器置入内容

1. 客户端向编辑器插入内容调用 webview 以下内容

   ``` js
   window.quill.root.innerHTML = "<p>我是html字符串</p>"
   ```

### 图片

1. 点击富文本编辑器中的图片按钮后, 向各端发起图片选择的方法 `chooseImage()`

2. 宿主端收到图片选择的通知后, 调起图片选择功能,   
   图片选择完成后, 开始静默上传图片, 同时生成一张base64格式缩略图(压缩质量), 加上图片唯一标示(id)连同 base64 字符串一同发送给 webview
   
   调用 webview 的以下方法传递预览图
   ```js
   window.imagePreviewReceiver('[{ "id": 0, "base64": "data:image/jpeg;base64,/9j/2wCEAAgwcJCQ..." }]')
   ```

3. 待图片上传完毕后, 将图片网络地址连同刚才的唯一标识(id)再次发送给 webview
   
   调用 webview 的以下方法传递上传后的图片, 编辑器会在提交时进行替换
   ```js
   window.imageUrlReceiver('[{ "id": 0, "url": "https://tsplus.zhibocloud.cn/storage/public:MjAxOC8xMi8yNC9FNnJUUGNUWWsyNTBwYkxQcXE3LmpwZWc=" }]')
   ```

4. 图片上传失败后, 各端调用 webview 的以下方法通知 webview 在 id 为1的图片上显示上传失败的提示

   ``` js
   window.imageFailedReceiver("1")
   ```

5. 用户点击上传失败的图片时, 会调用各端的 `reuploadImage("1")` 方法通知重传,  
   重传失败时重复第 4 步, 重传成功重复第 3 步.
   

### 提交

1. 移动端点击下一步或提交时, 向 webview 发送一条通知, 用于获取富文本内容

   ```js
   window.editorSubmitReceiver()
   ```

2. webview 收到通知后, 会调用客户端的 `sendContentHTML()` 方法传递 html 和其他所需字段, 内容结构如下

   ``` json
   {
     "html": "<h1>我是html字符串</h1><p><img src=\"https://xxx.png\"></p>",
     "pendingImages": [1, 2, 3] // 正在上传或上传失败的图片id数组
   }
   ```
