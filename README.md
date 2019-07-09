# Plus rich-text editor

## webview / iframe 通信

支持pc嵌入iframe、安卓/IOS端嵌入webview

- PC iframe 地址 `http://test-plus.zhibocloud.cn/plus-editor/dist/desktop.html`

- 移动端 webview 地址 `http://test-plus.zhibocloud.cn/plus-editor/dist/index.html`

----

- 安卓端注入 `window.launcher` 对象
- IOS 端注入 `window.webkit` 对象
- PC iframe 使用 `window.top.postMessage` 进行通信 **注意自行设置接受 postMessage 消息的安全域名, 详见 https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage#Security_concerns **

### 图片选择

1. 点击富文本编辑器中的图片按钮后, 向宿主端发起图片选择的通知

  ```js
  // 安卓端
  window.launcher.chooseImage()

  // IOS端
  window.webkit.messageHandlers.MobilePhoneCall.postMessage({ funcName: 'chooseImage' })

  // PC端(iframe)
  window.top.postMessage({funcName: 'chooseImage'})
  ```
  
  注: PC

2. 宿主端收到图片选择的通知后, 调起图片选择功能,   
   图片选择完成后, 后台静默上传图片, 同时生成一张base64格式缩略图(压缩质量), 加上图片唯一标示(id)连同 base64 字符串一同发送给 webview
   
   ```js
   // 包装在数组中以便后续支持多图 以下面的实例格式进行json序列化
   // [
   //   { id: 0, base64: 'data:image/jpeg;base64,/9j/2wCEAAgwcJCQ...' },
   // ]
   // 调用 webview 的以下方法
   window.imagePreviewReceiver("[{\"id\":0,\"base64\":\"data:image/jpeg;base64,/9j/2wCEAAgwcJCQ...\"}]")
   
   // PC 调用以下方法 (假设iframe的id为 iframeId)
   const iframe = document.querySelector('#iframeId').contentWindow
   iframe.postMessage({
     funcName: 'imagePreviewReceiver',
     params: { id: 0, base64: 'data:image/jpeg;base64,/9j/2wCEAAgwcJCQ...' },
  })
   ```

   待图片上传完毕后, 将图片网络地址连同刚才的唯一标识(id)再次发送给 webview
   
   ```js
   // 包装在数组中以便后续支持多图 以下面的实例格式进行json序列化
   // [
   //   { id: 0, url: 'https://tsplus.zhibocloud.cn/storage/public:MjAxOC8xMi8yNC9FNnJUUGNUWWsyNTBwYkxQcXE3LmpwZWc=' },
   // ]
   // 调用 webview 的以下方法
   window.imageUrlReceiver("[{\"id\":0,\"url\":\"https://tsplus.zhibocloud.cn/storage/public:MjAxOC8xMi8yNC9FNnJUUGNUWWsyNTBwYkxQcXE3LmpwZWc=\"}]")
   ```

### 完成编辑

1. 移动端点击下一步或提交时, 向 webview 发送一条通知, 用于获取富文本内容
   
   ```js
   // 调用 webview 以下方法
   window.editorSubmitReceiver()
   ```

2. webview 收到通知后, 会将富文本内的内容发送宿主端

   ```js
   // 安卓端
   window.launcher.sendContentHTML('<h1>我是html字符串</h1><p><img src="https://xxx.png"></p>')
   
   // IOS端
   window.webkit.messageHandlers.MobilePhoneCall.postMessage({ funcName: 'sendContentHTML', data: '<h1>我是html字符串</h1><p><img src="https://xxx.png"></p>' })
   
   // PC端 (iframe)
   window.top.postMessage({funcName: 'sendContentHTML', params: {}})
   ```
