import Quill from 'quill'
import 'quill/assets/snow.styl'
import './index.styl'

// import blots
import './blots/divider'

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
          if (window.launcher) {
            try {
              window.launcher.chooseImage()
            } catch (error) {
              alert('通信失败, launcher.chooseImage() 方法不存在')
            }
          } else {
            // not in webview 调用原生上传
            alert('不在webview内')
          }
        },
      },
    },
  },
})

window.imagePreviewReceiver = str => {
  alert('收到图片预览')
  console.log('preview', str)
}
window.imageUrlReceiver = str => {
  alert('收到图片上传完毕的地址')
  console.log('url', str)
}
window.editorSubmitReceiver = () => {
  alert('收到提交请求')
  const html = quill.getContents()
  try {
    window.launcher.sendContentHTML(html)
  } catch (error) {
    alert('通信失败, launcher.sendContentHTML() 方法不存在')
  }
}

window.quill = quill

export default quill
