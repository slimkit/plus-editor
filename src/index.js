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
        divider() {
          const range = this.quill.getSelection(true)
          this.quill.insertText(range.index, '\n', Quill.sources.USER)
          this.quill.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER)
          this.quill.setSelection(range.index + 2, Quill.sources.SILENT)
        },
        image() {
          let inWebview = false
          try {
            inWebview = callMethod('chooseImage')
          } catch (error) {
            this.quill.insertText('通信失败' + error)
          }
          if (!inWebview) {
            alert('不在webview中')
          }
        },
      },
    },
  },
})

/** 上传的图片列表 */
const images = []

window.imagePreviewReceiver = str => {
  const range = quill.getSelection()
  const srcList = JSON.parse(str)
  for (const item of srcList) {
    images.push({ id: item.id })
    quill.insertEmbed(range.index, 'image', item.base64, Quill.sources.USER)
  }
}

window.imageUrlReceiver = str => {
  const urlList = JSON.parse(str).url
  for (const item of urlList) {
    const index = images.findIndex(image => image.id === item.id)
    if (index >= 0) images[index].src = item.url
    // quill.insertEmbed(quill.getLength() - 1, 'image', item.url, Quill.sources.USER)
  }
}

window.editorSubmitReceiver = () => {
  let html = quill.root.innerHTML

  // TODO: 替换上传完毕的图片

  /** 未上传完毕的图片 */
  const pendingImages = images.filter(image => !image.src)

  try {
    callMethod('sendContentHTML', { html, pendingImages })
  } catch (error) {
    quill.insertText('通信失败' + error)
  }
}

window.quill = quill

export default quill
