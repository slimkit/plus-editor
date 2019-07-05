# Plus rich-text editor

## 移动端 webview 通信

移动端注入 window.launcher 对象, 通过调用此对象上的方法来与移动端(android、ios)通信.

### 图片选择

1. 点击富文本编辑器中的图片后, 向移动端发起图片选择的通知通知

	```js
	window.launcher.chooseImage()
	```

2. 移动端收到图片选择的通知后, 调起图片选择功能,   
   图片选择完成后, 后台静默上传图片, 同时生成一张base64格式缩略图(压缩质量), 加上图片唯一标示(id)连同 base64 字符串一同发送给 webview
	 
	 ```js
	 // 包装在数组中以便后续支持多图 以下面的实例格式进行json序列化
	 // [
	 //	  { id: 0, base64: 'data:image/jpeg;base64,/9j/2wCEAAgwcJCQ...' },
	 // ]
	 // 调用 webview 的以下方法
	 window.imagePreviewReceiver("[{\"id\":0,\"base64\":\"data:image/jpeg;base64,/9j/2wCEAAgwcJCQ...\"}]")
	 ```

	 待图片上传完毕后, 将图片网络地址连同刚才的唯一标识(id)再次发送给 webview
	 
	 ```js
	 // 包装在数组中以便后续支持多图 以下面的实例格式进行json序列化
	 // [
	 //	  { id: 0, url: 'https://tsplus.zhibocloud.cn/storage/public:MjAxOC8xMi8yNC9FNnJUUGNUWWsyNTBwYkxQcXE3LmpwZWc=' },
	 // ]
	 // 调用 webview 的以下方法
	 window.imageUrlReceiver("[{\"id\":0,\"url\":\"https://tsplus.zhibocloud.cn/storage/public:MjAxOC8xMi8yNC9FNnJUUGNUWWsyNTBwYkxQcXE3LmpwZWc=\"}]")
	 ```
