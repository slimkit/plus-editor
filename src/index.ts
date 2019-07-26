declare global {
  interface Window {
    quill: Quill
    /** Android 端注入 webview 中的对象 */
    launcher: any
    /** IOS 端注入 webview 中的对象 */
    webkit: any
    /** 接收图片预览地址的钩子 */
    imagePreviewReceiver: (src: string) => void
    /** 接收图片实际地址的钩子 */
    imageUrlReceiver: (src: string) => void
    /** 接收提交请求的钩子, 会触发各端对应的提交事件 */
    editorSubmitReceiver: (src: string) => void
  }
}

import Quill from 'quill'
import 'quill/assets/snow.styl'
import './index.styl'

// import blots
import './blots/divider'
import { callMethod } from './caller'

const quill = new Quill('#editor', {
  // debug: 'info',
  theme: 'snow',
  placeholder: '请输入内容',
  modules: {
    toolbar: {
      container: '#toolbar',
      handlers: {
        divider(this: { quill: Quill }) {
          const range = this.quill.getSelection(true)
          this.quill.insertText(range.index, '\n', 'user')
          this.quill.insertEmbed(range.index + 1, 'divider', true, 'user')
          this.quill.setSelection(range.index + 2, 0, 'silent')
        },
        image(this: { quill: Quill }) {
          let inWebview = false
          try {
            inWebview = callMethod('chooseImage')
          } catch (error) {
            this.quill.insertText(0, '通信失败' + error)
          }
          if (!inWebview) {
            alert('不在webview中')
          }
        },
      },
    },
  },
})

/** 上传的图片 */
interface UploadImage {
  /** 图片标识 */
  id: number
  /** 图片地址 */
  src?: string
  /** 图片 base64 */
  base64?: string
}

/** 上传的图片列表 */
const images: UploadImage[] = []

window.imagePreviewReceiver = str => {
  const range = quill.getSelection()
  const srcList = JSON.parse(str)
  for (const item of srcList) {
    images.push({ id: item.id })
    const index = (range && range.index) || 0
    quill.insertEmbed(index, 'image', { id: item.id, src: item.base64 }, 'user')
  }
}

window.imageUrlReceiver = str => {
  const urlList = JSON.parse(str).url
  for (const item of urlList) {
    const index = images.findIndex(image => image.id === item.id)
    if (index >= 0) images[index].src = item.url
    // quill.insertEmbed(quill.getLength() - 1, 'image', item.url, 'user')
  }
}

window.editorSubmitReceiver = () => {
  const html = quill.root.innerHTML

  // TODO: 替换上传完毕的图片

  /** 未上传完毕的图片 */
  const pendingImages = images.filter(image => !image.src)

  try {
    callMethod('sendContentHTML', { html, pendingImages })
  } catch (error) {
    quill.insertText(0, '通信失败' + error)
  }
}

window.quill = quill

export default quill
