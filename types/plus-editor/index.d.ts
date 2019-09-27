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

    /** 接收图片预览地址的钩子 */
    imagePreviewReceiver: (src: string) => void
    /** 接收图片实际地址的钩子 */
    imageUrlReceiver: (src: string) => void
    /** 接收图片上传失败的钩子 */
    imageFailedReceiver: (imageId: number) => void
    /** 接收提交请求的钩子, 会触发各端对应的提交事件 */
    editorSubmitReceiver: (src: string) => void
    /** 接受placeholder文字提示 */
    changePlaceholder: (text: string) => void

    videoPreviewReceiver: (src: any) => void
    videoUrlReceiver: (params: any) => void
  }
}
