import Quill, { RangeStatic } from 'quill'
import Delta from 'quill-delta'
import 'quill/assets/snow.styl'
import './index.styl'
import './preview.styl'

// import blots
import './blots/divider'
import { ImageBlot } from './blots/image'
import { VideoBlot } from './blots/video'
import { callMethod } from './caller'
import { fixImageSize, fixVideoSize, fixSize } from './common'

const Header = Quill.import('formats/header')
Header.tagName = ['H1']

let quillSelection: RangeStatic
const quill = new Quill('#editor', {
  debug: false,
  theme: 'snow',
  placeholder: '',
  formats: ['bold', 'header', 'blockquote', 'link', 'image', 'video'],
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
          quillSelection = quill.getSelection(true)

          quill.blur()

          if (!callMethod('chooseImage')) {
            console.log('chooseImage')
          }
        },

        video(this: { quill: Quill }) {
          quillSelection = quill.getSelection(true)

          quill.blur()

          if (!callMethod('chooseVideo')) {
            console.log('chooseVideo')
          }
        },

        undo(this: { quill: Quill }) {
          // @ts-ignore
          quill.history!.undo()
        },

        redo(this: { quill: Quill }) {
          // @ts-ignore
          quill.history!.redo()
        },
      },
    },
    clipboard: {
      matchers: [
        [
          'IMG',
          (node: HTMLImageElement, delta: Delta): Delta => {
            return new Delta().insert({
              image: ImageBlot.value(node),
            })
          },
        ],

        [
          'VIDEO',
          (node: HTMLVideoElement, delta: Delta): Delta => {
            return new Delta().insert({
              video: VideoBlot.value(node),
            })
          },
        ],

        // 粘贴时提取纯文本
        [
          Node.TEXT_NODE,
          (node: Element, delta: Delta): Delta => {
            const ops: Delta['ops'] = []
            delta.ops!.forEach(op => {
              if (op.insert && typeof op.insert === 'string') {
                ops.push({ insert: op.insert })
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

/** 设置编辑器内容 */
window.setContentReceiver = data => {
  quill.clipboard.dangerouslyPasteHTML(data, 'silent')

  setTimeout(fixSize, 0)
}

ImageBlot.quill = quill

ImageBlot.eventEmitter.on('remove', data => {
  if (!callMethod('removeImage', data)) {
    console.log('removeImage', data)
  }
})

ImageBlot.eventEmitter.on('reinsert', data => {
  if (!callMethod('reinsertImage', data)) {
    console.log('reinsertImage', data)
  }
})

ImageBlot.eventEmitter.on('reupload', data => {
  if (!callMethod('reuploadImage', data)) {
    console.log('reuploadImage', data)
  }
})

ImageBlot.eventEmitter.on('insertRemoteImage', data => {
  if (!callMethod('insertRemoteImage', data)) {
    console.log('insertRemoteImage', data)
  }
})

/** 收到图片后预览 */
window.imagePreviewReceiver = data => {
  const srcList = JSON.parse(data)
  let { index } = quillSelection

  for (const item of srcList) {
    quill.insertEmbed(
      index++,
      'image',
      {
        id: `${item.id || ''}`,
        src: `${item.url}`,
        width: +item.width,
        height: +item.height,
      },
      'user',
    )
  }

  setTimeout(fixImageSize, 0)
}

window.uploadRemoteImage = (data: string) => {
  const { id, remoteId } = JSON.parse(data) || {}
  if (remoteId && `${id || ''}`) {
    ImageBlot.uploadRemoteImage(remoteId, `${id}`)
  }
}

/** 更新图片上传进度 */
window.imageProgressReceiver = (data: string) => {
  const { id, progress } = JSON.parse(data) || {}
  ImageBlot.updateUploadProgress(`${id}`, Number(progress))
}

/** 设置图片上传成功 */
window.imageUrlReceiver = (data: string) => {
  const { id, url, node } = JSON.parse(data) || {}

  ImageBlot.setUploadSuccess(`${id}`, `${url}`, `${node || ''}`)
}

/** 设置图片上传失败 */
window.imageFailedReceiver = (data: string) => {
  const { id, error } = JSON.parse(data) || {}

  ImageBlot.setUploadError(`${id}`, `${error || ''}`)
}

VideoBlot.quill = quill

VideoBlot.eventEmitter.on('remove', data => {
  if (!callMethod('removeVideo', data)) {
    console.log('removeVideo', data)
  }
})

VideoBlot.eventEmitter.on('reinsert', data => {
  if (!callMethod('reinsertVideo', data)) {
    console.log('reinsertVideo', data)
  }
})

VideoBlot.eventEmitter.on('reupload', data => {
  if (!callMethod('reuploadVideo', data)) {
    console.log('reuploadVideo', data)
  }
})

/** 收到视频后预览 */
window.videoPreviewReceiver = data => {
  const item = JSON.parse(data)
  let { index } = quillSelection

  quill.insertEmbed(
    index++,
    'video',
    {
      id: `${item.id || ''}`,
      src: `${item.url}`,
      poster: `${item.poster}`,
      width: +item.width,
      height: +item.height,
    },
    'user',
  )

  setTimeout(fixVideoSize, 0)
}

/** 更新视频上传进度 */
window.videoProgressReceiver = (data: string) => {
  const { id, progress } = JSON.parse(data) || {}
  VideoBlot.updateUploadProgress(`${id}`, Number(progress))
}

/** 设置视频上传成功 */
window.videoUrlReceiver = (data: string) => {
  const { id, url, urlNode, poster, posterNode } = JSON.parse(data) || {}

  VideoBlot.setUploadSuccess(`${id}`, {
    src: `${url}`,
    srcNode: `${urlNode || ''}`,
    poster: `${poster}`,
    posterNode: `${posterNode || ''}`,
  })
}

/** 设置视频上传失败 */
window.videoFailedReceiver = (data: string) => {
  const { id, error } = JSON.parse(data) || {}

  VideoBlot.setUploadError(`${id}`, `${error || ''}`)
}

window.changePlaceholder = text => {
  const el = document.querySelector(`.ql-editor,.ql-blank`)
  if (el) {
    el.setAttribute('data-placeholder', text)
  }
}

window.editorSubmitReceiver = () => {
  let html = quill.root.innerHTML
  let div: HTMLDivElement | null
  div = document.createElement('div')
  div.innerHTML = html

  div = VideoBlot.buildHtml(ImageBlot.buildHtml(div))

  const isEmpty = !(quill.getText() || div!.querySelector('video,img'))
  const pendingImages = ImageBlot.pendingImages()
  const pendingVideos = VideoBlot.pendingVideos()

  const medias: { image: string; video?: string }[] = []

  div!.querySelectorAll('img, video').forEach((el: any) => {
    const tagName = el.tagName.toUpperCase()
    const { srcNode, posterNode } = el.dataset

    if (tagName === 'IMG' && srcNode) {
      medias.push({ image: srcNode })
    } else if (tagName === 'VIDEO' && srcNode && posterNode) {
      medias.push({ image: posterNode, video: srcNode })
    }
  })

  html = div!.innerHTML
  div = null

  if (!callMethod('sendContentHTML', { html, medias, pendingImages, pendingVideos, isEmpty })) {
    console.log('sendContentHTML', { html, medias, pendingImages, pendingVideos, isEmpty })
  }
}

window.quill = quill

window.addEventListener('resize', () => {
  const range = quill.getSelection()

  if (range && quill.hasFocus()) {
    quill.setSelection(range)
  }

  fixSize()
})

export default quill
