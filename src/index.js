import Quill from 'quill'
import 'quill/assets/snow.styl'
import './index.styl'

// import blots
import './blots/divider'
import { callMethod } from './caller'

const quill = new Quill('#editor', {
  debug: 'info',
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
            alert('通信失败, 对应的 chooseImage() 方法不存在')
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
  const src = JSON.parse(str).image
  quill.insertEmbed(range.index, 'image', src, Quill.sources.USER)
  console.log('preview', str)
}
window.imageUrlReceiver = str => {
  const url = JSON.parse(str).url
  quill.insertText(quill.getLength() - 1, '上传完毕:')
  quill.insertEmbed(quill.getLength() - 1, 'image', url, Quill.sources.USER)
  console.log('url', str)
}
window.editorSubmitReceiver = () => {
  alert('收到提交请求')
  const html = quill.root.innerHTML()
  try {
    callMethod('sendContentHTML', html)
  } catch (error) {
    alert('通信失败, 对应的 sendContentHTML() 方法不存在')
  }
}

window.quill = quill

export default quill
