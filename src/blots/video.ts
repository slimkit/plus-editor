import Quill from 'quill'
import EventEmitter from 'eventemitter3'

const BlockEmbed = Quill.import('blots/block/embed')

interface VideoBlotValue {
  id?: string
  src: string
  srcNode?: string
  poster: string
  posterNode?: string
  width?: number
  height?: number
}

export class VideoBlot extends BlockEmbed {
  static tagName = 'div'
  static blotName = 'video'
  static className = 'video-container'

  static quill: Quill
  static eventEmitter = new EventEmitter()
  static uploadStatus: { [key: string]: any } = {}

  constructor(node: HTMLDivElement) {
    super(node)

    node.addEventListener('click', (e: Event) => {
      if (VideoBlot.quill.hasFocus()) {
        VideoBlot.quill.blur()
      }
    })

    const {
      video,
      value: { id, src, width, height },
    } = VideoBlot.getVideoAndValue(node)

    if (id) {
      node.classList.add(`video-${id}`)

      const status = VideoBlot.uploadStatus[id]
      if (status) {
        VideoBlot.eventEmitter.emit('reinsert', {
          id,
          status: status.status || 'UPLOADING',
        })
      } else {
        VideoBlot.uploadStatus[id] = {}
      }
    }

    if (video && src) {
      if (id && !node.querySelector('.progress-bar')) {
        const div = VideoBlot.createDiv('progress-bar')
        div.appendChild(VideoBlot.createDiv('progress'))
        node.appendChild(div)
      }

      if (id && !node.querySelector('.error')) {
        const div = VideoBlot.createDiv('error')
        div.addEventListener('click', () => {
          VideoBlot.uploadStatus[id] = {}
          this.domNode.classList.remove('fail')
          VideoBlot.eventEmitter.emit('reupload', { id })
        })
        node.appendChild(div)
      }

      if (!node.querySelector('.remove')) {
        const div = VideoBlot.createDiv('remove')
        div.addEventListener('click', () => {
          this.remove()
        })
        node.appendChild(div)
      }

      if (id) VideoBlot.refreshUpload(id)
    }
  }

  static refreshUpload(id: string) {
    setTimeout(() => {
      const { status, progress, error, src, srcNode, poster, posterNode } =
        VideoBlot.uploadStatus[id] || {}

      if (status === 'UPLOADING') {
        VideoBlot.updateUploadProgress(id, progress)
      } else if (status === 'SUCCESS') {
        VideoBlot.setUploadSuccess(id, { src, srcNode, poster, posterNode })
      } else if (status === 'ERROR') {
        VideoBlot.setUploadError(id, error)
      }
    }, 0)
  }

  static updateUploadProgress(id: string, progress: number) {
    if ((VideoBlot.uploadStatus[id] || {}).status === 'SUCCESS') return

    VideoBlot.uploadStatus[id] = { status: 'UPLOADING', progress: Math.round(progress) }

    document.querySelectorAll<HTMLDivElement>(`div.video-${id}`).forEach(node => {
      node.classList.remove('fail')

      node.querySelector<HTMLDivElement>('div.progress')!.style.width = `${Math.round(progress)}%`
    })
  }

  static setUploadError(id: string, error?: string) {
    if ((VideoBlot.uploadStatus[id] || {}).status === 'SUCCESS') return

    VideoBlot.uploadStatus[id] = { status: 'ERROR', error }

    document.querySelectorAll<HTMLDivElement>(`div.video-${id}`).forEach(node => {
      if (!node.classList.contains('fail')) node.classList.add('fail')

      const div = node.querySelector<HTMLDivElement>('div.error')

      if (div) {
        let html = '<span>上传失败，点击重试</span>'
        if (error) {
          html += `<span>${error}</span>`
        }

        div.innerHTML = html
      }
    })
  }

  static setUploadSuccess(id: string, options: VideoBlotValue) {
    const { src, srcNode, poster, posterNode } = options
    VideoBlot.uploadStatus[id] = { status: 'SUCCESS', src, poster }

    if (srcNode) {
      VideoBlot.uploadStatus[id].srcNode = srcNode
    }

    if (posterNode) {
      VideoBlot.uploadStatus[id].posterNode = posterNode
    }

    document.querySelectorAll<HTMLDivElement>(`div.video-${id}`).forEach(node => {
      node.querySelector<HTMLDivElement>('div.progress-bar')!.remove()
      node.querySelector<HTMLDivElement>('div.error')!.remove()

      const video = node.querySelector<HTMLVideoElement>('video')

      if (video) {
        video.dataset.src = src
        video.dataset.poster = poster

        if (srcNode) {
          video.dataset.srcNode = srcNode
        }

        if (posterNode) {
          video.dataset.posterNode = posterNode
        }
      }

      node.classList.remove(`video-${id}`)
    })
  }

  static createDiv(...classNames: string[]) {
    const div = document.createElement('div')

    div.setAttribute('contenteditable', 'false')

    if (classNames.length > 0) {
      div.classList.add(...classNames)
    }

    return div
  }

  static create(value: VideoBlotValue) {
    const node = super.create()
    node.setAttribute('contenteditable', 'false')

    const video = document.createElement('video')

    if (value.id) {
      video.dataset.id = value.id
    }

    if (value.width && value.height) {
      video.dataset.width = `${value.width}`
      video.dataset.height = `${value.height}`
    } else {
      video.dataset.width = '0'
      video.dataset.height = '0'
    }

    if (value.srcNode) {
      video.dataset.srcNode = value.srcNode
    }

    if (value.posterNode) {
      video.dataset.posterNode = value.posterNode
    }

    video.setAttribute('src', value.src)
    video.setAttribute('poster', value.poster)

    node.appendChild(video)

    return node
  }

  static getVideoAndValue(node: HTMLDivElement | HTMLVideoElement) {
    const video =
      node.tagName.toUpperCase() === 'VIDEO'
        ? (node as HTMLVideoElement)
        : node.querySelector<HTMLVideoElement>('video')

    const value: VideoBlotValue = {
      src: (video && video.getAttribute('src')) || '',
      poster: (video && video.getAttribute('poster')) || '',
    }

    if (video) {
      if (video.dataset.id) {
        value.id = video.dataset.id
      }

      const width = Number(video.dataset.width)
      const height = Number(video.dataset.height)

      if (width && height) {
        value.width = width
        value.height = height
      }

      if (video.dataset.srcNode) {
        value.srcNode = video.dataset.srcNode
      }

      if (video.dataset.posterNode) {
        value.posterNode = video.dataset.posterNode
      }
    }

    return { video, value }
  }

  static value(node: HTMLDivElement | HTMLVideoElement) {
    return VideoBlot.getVideoAndValue(node).value
  }

  remove() {
    const { id } = VideoBlot.value(this.domNode)

    if (id) {
      const status = VideoBlot.uploadStatus[id]

      VideoBlot.eventEmitter.emit('remove', {
        id,
        status: status.status || 'UPLOADING',
      })
    }

    super.remove()
  }

  static pendingVideos() {
    return Object.keys(VideoBlot.uploadStatus).filter(id => {
      return VideoBlot.uploadStatus[id]!.status !== 'SUCCESS'
    })
  }

  static buildHtml(node: HTMLDivElement) {
    node.querySelectorAll('div.video-container').forEach(el => {
      const video = el.querySelector<HTMLImageElement>('video')
      if (video && (!video.dataset.id || video.dataset.src)) {
        if (video.dataset.src) {
          video.setAttribute('src', video.dataset.src)
          delete video.dataset.src
        }

        if (video.dataset.poster) {
          video.setAttribute('poster', video.dataset.poster)
          delete video.dataset.poster
        }

        delete video.dataset.id
        video.removeAttribute('class')
        video.removeAttribute('style')

        el.parentNode!.insertBefore(video, el.nextSibling)
      }

      el.remove()
    })

    return node
  }
}

Quill.register(VideoBlot, true)
