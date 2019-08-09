import Quill, { Delta } from 'quill'
import 'quill/assets/snow.styl'
import './index.styl'
import './preview.styl'

// import blots
import './blots/divider'
import './blots/image'
import { callMethod } from './caller'
import { generateImageWithText } from './utils'

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
    clipboard: {
      matchers: [
        [
          Node.TEXT_NODE,
          (node: unknown, delta: Delta) => {
            const ops: Delta['ops'] = []
            delta.ops!.forEach(op => {
              if (op.insert && typeof op.insert === 'string') {
                ops.push({
                  insert: op.insert,
                })
              }
            })
            delta.ops = ops
            return delta
          },
        ],
      ],
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
    images.push({ id: +item.id, base64: item.base64 })
    const index = (range && range.index) || 0
    quill.insertText(index, '\n', 'user')
    quill.insertEmbed(index + 1, 'image', { id: +item.id, url: item.base64 }, 'user')
    quill.setSelection(index + 2, 0, 'silent')
  }
}

window.imageUrlReceiver = str => {
  const urlList = JSON.parse(str) || []
  for (const item of urlList) {
    const index = images.findIndex(image => image.id === +item.id)
    if (index >= 0) images[index].src = item.url
  }
}

window.imageFailedReceiver = async imageId => {
  const el = document.querySelector(`#quill-image-${imageId}`)
  const index = images.findIndex(image => +image.id === +imageId)
  if (index <= -1 || !el) {
    if (window.debug) console.log(`image ${imageId} not exist!`) // eslint-disable-line no-console
    return
  }
  const image = images[index]

  const failedBase64 = await generateImageWithText(image.base64!, '上传失败')

  el.setAttribute('src', failedBase64)

  const imageReuploadeHandler = () => {
    callMethod('reuploadImage', +imageId)
    el.setAttribute('src', images[index].base64!)
  }
  el.addEventListener('click', imageReuploadeHandler, { once: true })
}

window.editorSubmitReceiver = () => {
  let html = quill.root.innerHTML

  /** 未上传完毕的图片 */
  const pendingImages: number[] = []
  images.forEach(image => {
    if (!image.src) return pendingImages.push(image.id)
    const regex = new RegExp(`<img id="quill-image-${image.id}" class="quill-image" src="\\S+" ?>`)
    html = html.replace(
      regex,
      `<img id="quill-image-${image.id}" class="quill-image" src="${image.src}">`,
    )
  })

  try {
    callMethod('sendContentHTML', { html, pendingImages })
  } catch (error) {
    quill.insertText(0, '通信失败' + error)
  }
}

window.addEventListener('resize', () => {
  quill.root.scrollTop = quill.root.scrollHeight
})

window.quill = quill

export default quill
