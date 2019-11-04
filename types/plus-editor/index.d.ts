import Quill from 'quill'

declare global {
  interface Window {
    /** 是否为 debug 模式 */
    debug: boolean

    /** quill 对象 */
    quill: Quill

    /** Android 端注入 webview 中的对象 */
    launcher: any

    /** IOS 端注入 webview 中的对象 */
    webkit: any

    /** * 设置上传选项 */
    setUploaderOptions: (options: any) => void

    /** * 设置HTML内容 */
    setContentReceiver: (data: string) => void

    /** 接收图片预览地址的钩子 */
    imagePreviewReceiver: (data: string) => void
    /** 接收图片实际上传进度的钩子 */
    imageProgressReceiver: (data: string) => void
    /** 接收图片实际地址的钩子 */
    imageUrlReceiver: (data: string) => void
    /** 接收图片上传失败的钩子 */
    imageFailedReceiver: (data: string) => void

    videoPreviewReceiver: (data: string) => void
    videoProgressReceiver: (data: string) => void
    videoUrlReceiver: (data: string) => void
    videoFailedReceiver: (data: string) => void

    /** 接收提交请求的钩子, 会触发各端对应的提交事件 */
    editorSubmitReceiver: (data: string) => void
    /** 接受placeholder文字提示 */
    changePlaceholder: (data: string) => void

    pageHiddenReceiver: (data?: string) => void
  }
}
