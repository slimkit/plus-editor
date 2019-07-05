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
            window.launcher.callAndroid('onChooseImage')
          } else {
            alert('launcher 没有注入')
          }
        },
      },
    },
  },
})

window.androidWebviewReceiver = str => {
  console.log(str)
  quill.insertText(str)
}

export default quill
