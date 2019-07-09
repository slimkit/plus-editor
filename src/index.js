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

window.imagePreviewReceiver = str => {
  const range = quill.getSelection()
  const srcList = JSON.parse(str)
  for (const item of srcList) {
    quill.insertEmbed(range.index, 'image', item.base64, Quill.sources.USER)
  }
}
window.imageUrlReceiver = str => {
  const urlList = JSON.parse(str).url
  quill.insertText(quill.getLength() - 1, '上传完毕:')
  for (const item of urlList) {
    quill.insertEmbed(quill.getLength() - 1, 'image', item.url, Quill.sources.USER)
  }
}
window.editorSubmitReceiver = () => {
  const html = quill.root.innerHTML
  try {
    callMethod('sendContentHTML', html)
  } catch (error) {
    quill.insertText('通信失败' + error)
  }
}

window.quill = quill

export default quill
