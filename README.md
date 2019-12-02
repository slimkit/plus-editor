# Plus rich-text editor

![Travis (.org)](https://img.shields.io/travis/slimkit/plus-editor?style=flat-square)

## webview / iframe 通信

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

   ```js
   window.setContentReceiver('<p>我是html字符串</p>')
   ```

### 视频

1. 点击富文本编辑器中的视频按钮后, 向各端发起视频选择的方法 `chooseVideo()`

2. 宿主端收到视频选择的通知后, 调起视频选择功能,  
   视频选择完成后, 开始静默上传视频, 同时将视频预览地址, 加上视频唯一标示(id)一同发送给 webview

   调用 webview 的以下方法传递预览图

   ```js
   window.videoPreviewReceiver(
     '[{ "id": "unique-id", "url": "local-file-path", "poster": "local-file-path", width:100, height:100 }]',
   )
   ```

3. 上传视频过程中，设置视频上传进度

   ```js
   window.videoProgressReceiver('{ "id": "unique-id", "progress": 15 }')
   ```

4. 待视频上传完毕后, 将视频网络地址连同刚才的唯一标识(id)再次发送给 webview

   调用 webview 的以下方法传递上传后的视频, 编辑器会在提交时进行替换, node 为可选

   ```js
   window.videoUrlReceiver(
     '{ "id": "unique-id", "url": "newwork-file-url", "urlNode": "xxx", "poster": "newwork-file-url", "posterNode": "xxx" }',
   )
   ```

5. 视频上传失败后, 各端调用 webview 的以下方法通知 webview 在指定 id 的视频上显示上传失败的提示，其中 error 参数不是必填的

   ```js
   window.videoFailedReceiver('{"id":"unique-id", "error":"错误原因"}')
   ```

6. 用户点击上传失败的视频时，会调用各端的 `reuploadVideo('{"id":"unique-id"}')` 方法通知重传，重传失败时重复第 5 步，重传成功重复第 4 步.

7. 用户删除视频时，调用各端`removeVideo('{"id":"unique-id", "status":"UPLOADING"}')`，其中 status 的值有 UPLOADING|ERROR|SUCCESS 分别表示 上传中|上传失败|上传成功，通常上传失败和成功不需要处理

8. 当编辑器插入 id 重复的视频时（例如删除后撤销删除），将调用各端`reinsertVideo('{"id":"unique-id", "status":"UPLOADING"}')`，其中 status 的值有 UPLOADING|ERROR|SUCCESS 分别表示 上传中|上传失败|上传成功，通常上传失败和成功不需要处理

### 图片

1. 点击富文本编辑器中的图片按钮后, 向各端发起图片选择的方法 `chooseImage()`

2. 宿主端收到图片选择的通知后, 调起图片选择功能,  
   图片选择完成后, 开始静默上传图片, 同时将图片预览地址, 加上图片唯一标示(id)一同发送给 webview

   调用 webview 的以下方法传递预览图

   ```js
   window.imagePreviewReceiver(
     '[{ "id": "unique-id", "url": "local-file-path", width:100, height:100 }]',
   )
   ```

3. 上传图片过程中，设置图片上传进度

   ```js
   window.imageProgressReceiver('{ "id": "unique-id", "progress": 15 }')
   ```

4. 待图片上传完毕后, 将图片网络地址连同刚才的唯一标识(id)再次发送给 webview

   调用 webview 的以下方法传递上传后的图片, 编辑器会在提交时进行替换，node 参数是可选的

   ```js
   window.imageUrlReceiver('{ "id": "unique-id", "url": "newwork-file-url", "node": "xxx" }')
   ```

5. 图片上传失败后, 各端调用 webview 的以下方法通知 webview 在指定 id 的图片上显示上传失败的提示，其中 error 参数不是必填的

   ```js
   window.imageFailedReceiver('{"id":"unique-id", "error":"错误原因"}')
   ```

6. 用户点击上传失败的图片时，会调用各端的 `reuploadImage('{"id":"unique-id"}')` 方法通知重传，重传失败时重复第 5 步，重传成功重复第 4 步.

7. 用户删除图片时，调用各端`removeImage('{"id":"unique-id", "status":"UPLOADING"}')`，其中 status 的值有 UPLOADING|ERROR|SUCCESS 分别表示 上传中|上传失败|上传成功，通常上传失败和成功不需要处理

8. 当编辑器插入 id 重复的图片时（例如删除后撤销删除），将调用各端`reinsertImage('{"id":"unique-id", "status":"UPLOADING"}')`，其中 status 的值有 UPLOADING|ERROR|SUCCESS 分别表示 上传中|上传失败|上传成功，通常上传失败和成功不需要处理

### 编辑器上传文件

当在 iframe 中时，编辑器会自行上传文件，iframe 上层需设置基础 api url 和用户 token

```js
window.setUploaderOptions(
  '{"apiV2BaseUrl": "https://domain/api/v2", "userToken": "token", "storage": {"channel": "public"}}',
)
```

### 提交

1. 移动端点击下一步或提交时, 向 webview 发送一条通知, 用于获取富文本内容

   ```js
   window.editorSubmitReceiver()
   ```

2. webview 收到通知后, 会调用客户端的 `sendContentHTML()` 方法传递 html 和其他所需字段, 内容结构如下

   ```json
   {
     "html": "<h1>我是html字符串</h1><img src=\"https://xxx.png\">",
     "pendingImages": ["1", "2", "3"], // 正在上传或上传失败的图片id数组
     "pendingVideos": ["1", "2", "3"] // 正在上传或上传失败的视频id数组
   }
   ```

### 设置页面尺寸

webview 文档就绪和窗口大小发生变化时，将调用 `setDocSize('{"width":123.0,"height":789.0}')` 通知客户端 webview 新的宽高

### 点击图片预览

webview 中图片被点击后，将调用 `clickImage('{"src":"点击的图片URL","index":0,"images":[{"src":"图片地址","width":100,"height":100}]}')` 通知客户端，客户端实现图片预览功能

### 文档加载完毕

webview 文档就绪时，将调用 `docReady({"docWidth":123.0,"docHeight":789.0})` 通知客户端，文档就绪时，图片点击才会通知客户端

### 页面隐藏通知

webview 被隐藏时，客户端应该通知 webview，webview 将暂停页面播放的媒体

```js
window.pageHiddenReceiver()
```

### 打印日志

webview 将调用 `showLog("日志内容")` 通知客户端打印日志，客户端将日志打印在自己的控制台

# 开发

## 技术选型

- `webpack` 多入口打包
- `stylus` 因为 quill 的样式基于 stylus, 为了保证良好的兼容性, 故也选择了 stylus, 需要配合 vscode 推荐插件达到自动格式化的目的.
