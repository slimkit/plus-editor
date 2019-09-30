import Quill from 'quill'
import Delta from 'quill-delta'
import 'quill/assets/snow.styl'
import './index.styl'
import './preview.styl'

// import blots
import './blots/divider'
import './blots/image'
import './blots/audio'
import './blots/video'
import { callMethod } from './caller'
import { generateImageWithText } from './utils'

const quill = new Quill('#editor', {
  debug: false,
  theme: 'snow',
  placeholder: '',
  modules: {
    toolbar: {
      container: '#toolbar',
      handlers: {
        // 分隔符
        divider(this: { quill: Quill }) {
          const range = this.quill.getSelection(true)
          this.quill.insertText(range.index, '\n', 'user')
          this.quill.insertEmbed(range.index + 1, 'divider', true, 'user')
          this.quill.setSelection(range.index + 2, 0, 'silent')
        },

        // 插入图片
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
        video(this: { quill: Quill }) {
          let inWebview = false
          try {
            inWebview = callMethod('chooseVideo')
          } catch (error) {
            this.quill.insertText(0, '通信失败' + error)
          }
          if (!inWebview) {
            alert('不在webview中')
          }
        },
        // 选择音频
        audio(this: { quill: Quill }) {
          let inWebview = false
          try {
            inWebview = callMethod('chooseAudio')
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
      // 粘贴时提取纯文本
      matchers: [
        [
          Node.TEXT_NODE,
          (node: Element, delta: Delta): Delta => {
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
  /** 图片的宽度 */
  width: number
  /** 图片的高度 */
  height: number
}

interface UploadVideo {
  id: number
  src?: string
  width: number
  height: number
  poster?: string
}

/** 上传的图片列表 */
const images: UploadImage[] = []
const videos: UploadVideo[] = []
/** 收到图片后预览 */
window.imagePreviewReceiver = str => {
  const range = quill.getSelection()
  const srcList = JSON.parse(str)
  for (const item of srcList) {
    images.push({
      id: +item.id,
      base64: item.base64,
      width: item.width || 200,
      height: item.height || 200,
    })
    const index = (range && range.index) || 0
    // quill.insertText(index, '\n', 'user')
    quill.insertEmbed(
      index,
      'image',
      { id: +item.id, url: item.base64, width: item.width || 200, height: item.height || 200 },
      'user',
    )
    quill.setSelection(index + 1, 0, 'silent')
  }
}

window.videoPreviewReceiver = (data: string) => {
  const params = JSON.parse(data)
  const range = quill.getSelection()
  videos.push({
    id: +params.id,
    src: params.src,
    poster: params.poster || '',
    width: params.width || 200,
    height: params.height || 200,
  })
  const index = (range && range.index) || 0
  quill.insertEmbed(
    index,
    'video',
    {
      id: +params.id,
      src: params.src,
      height: params.height,
      width: params.width,
      poster: params.poster,
    },
    'user',
  )
  quill.setSelection(index + 1, 0, 'silent')
}

window.videoUrlReceiver = (str: string) => {
  const params: UploadVideo = JSON.parse(str)
  const index = videos.findIndex(v => v.id === +params.id)
  if (index >= 0) {
    videos[index].src = params.src
    const container = document.querySelector(`#video-notice-${params.id}`)
    if (container) {
      container.setAttribute('class', 'hidden uploadFail')
    }
  }
}

window.imageUrlReceiver = str => {
  const urlList = JSON.parse(str) || []
  for (const item of urlList) {
    const index = images.findIndex(image => image.id === +item.id)
    if (index >= 0) images[index].src = item.url
  }
}

window.changePlaceholder = text => {
  const el = document.querySelector(`.ql-editor,.ql-blank`)
  if (el) {
    el.setAttribute('data-placeholder', text)
  }
}
window.videoFailedReceiver = videoId => {
  const container = document.querySelector(`#video-notice-${videoId}`)
  const index = videos.findIndex(v => v.id === +videoId)
  if (index === -1 || !container) {
    if (window.debug) console.log(`video ${videoId} not exists!`)
    return
  }
  if (container) {
    container.setAttribute('class', 'show uploadFail')
  }
  const videoReuploadHandler = (e: any) => {
    callMethod('reuploadVideo', +videoId)
    e.stopPropagation()
  }
  container.addEventListener('click', videoReuploadHandler, { once: true })
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

  /** 重新上传图片 */
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
    const regex = new RegExp(
      `<img id="quill-image-${image.id}" class="quill-image" src="\\S+"([^>]*)>`,
    )
    html = html.replace(regex, `<img class="quill-image" src="${image.src}"$1>`)
  })

  const hasImage = html.match(/<img/)
  const isEmpty = !hasImage && !quill.getText().trim()

  try {
    callMethod('sendContentHTML', {
      html,
      pendingImages,
      isEmpty,
    })
  } catch (error) {
    quill.insertText(0, '通信失败' + error)
  }
}

window.addEventListener('resize', () => {
  // const el = document.querySelector('.ql-editor')!
  // quill.root.scrollTop = quill.root.scrollHeight - el.clientHeight
  // console.log('window+++++++', window.quill)
  // console.log('quill+++++++', quill)
  // console.log('滑动的顶部+++++++', quill.root.scrollTop)
  // console.log('滑动的高度+++++++', quill.root.scrollHeight)
})

window.quill = quill

export default quill
