import Quill from 'quill'
import EventEmitter from 'eventemitter3'

const BlockEmbed = Quill.import('blots/block/embed')

interface ImageBlotValue {
  id?: string
  src: string
  width?: number
  height?: number
}

export class ImageBlot extends BlockEmbed {
  static tagName = 'div'
  static blotName = 'image'
  static className = 'image-container'

  static quill: Quill
  static eventEmitter = new EventEmitter()
  static uploadStatus: { [key: string]: any } = {}

  constructor(node: HTMLDivElement) {
    super(node)

    node.addEventListener('click', (e: Event) => {
      if (ImageBlot.quill.hasFocus()) {
        ImageBlot.quill.blur()
      }
    })

    const {
      img,
      value: { id, src, width = 0, height = 0 },
    } = ImageBlot.getImgAndValue(node)

    if (id) {
      node.classList.add(`image-${id}`)

      const status = ImageBlot.uploadStatus[id]
      if (status) {
        ImageBlot.eventEmitter.emit('reinsert', {
          id,
          status: status.status || 'UPLOADING',
        })
      } else {
        ImageBlot.uploadStatus[id] = {}
      }
    }

    if (img && src) {
      const appendEls = (width: number, height: number) => {
        const wrap = node.querySelector('.image-wrap')

        if (!wrap) return

        if (id && !node.querySelector('.progress-bar')) {
          const div = ImageBlot.createDiv('progress-bar')
          div.appendChild(ImageBlot.createDiv('progress'))
          wrap.appendChild(div)
        }

        if (id && !node.querySelector('.error')) {
          const div = ImageBlot.createDiv('error')
          div.addEventListener('click', () => {
            ImageBlot.uploadStatus[id] = {}
            this.domNode.classList.remove('fail')
            ImageBlot.eventEmitter.emit('reupload', { id })
          })
          wrap.appendChild(div)
        }

        if (width >= 100 && height >= 100) {
          if (!node.querySelector('.remove')) {
            const div = ImageBlot.createDiv('remove')
            div.addEventListener('click', () => {
              this.remove()
            })
            wrap.appendChild(div)
          }
        }

        if (id) ImageBlot.refreshUpload(id)
      }

      if (width && height) {
        appendEls(width, height)
      } else {
        img.addEventListener('load', (e: Event) => {
          if (img.naturalWidth && img.naturalHeight) {
            img.dataset.width = `${img.naturalWidth}`
            img.dataset.height = `${img.naturalHeight}`
          }

          appendEls(img.naturalWidth, img.naturalHeight)
        })
      }
    }
  }

  static refreshUpload(id: string) {
    const { status, progress, error, src } = ImageBlot.uploadStatus[id] || {}

    if (status === 'UPLOADING') {
      ImageBlot.updateUploadProgress(id, progress)
    } else if (status === 'SUCCESS') {
      ImageBlot.setUploadSuccess(id, src)
    } else if (status === 'ERROR') {
      ImageBlot.setUploadError(id, error)
    }
  }

  static updateUploadProgress(id: string, progress: number) {
    if ((ImageBlot.uploadStatus[id] || {}).status === 'SUCCESS') return

    ImageBlot.uploadStatus[id] = { status: 'UPLOADING', progress: Math.round(progress) }

    document.querySelectorAll<HTMLDivElement>(`div.image-${id}`).forEach(node => {
      node.classList.remove('fail')

      node.querySelector<HTMLDivElement>('div.progress')!.style.width = `${Math.round(progress)}%`
    })
  }

  static setUploadError(id: string, error?: string) {
    if ((ImageBlot.uploadStatus[id] || {}).status === 'SUCCESS') return

    ImageBlot.uploadStatus[id] = { status: 'ERROR', error }

    document.querySelectorAll<HTMLDivElement>(`div.image-${id}`).forEach(node => {
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

  static setUploadSuccess(id: string, src: string) {
    ImageBlot.uploadStatus[id] = { status: 'SUCCESS', src }

    document.querySelectorAll<HTMLDivElement>(`div.image-${id}`).forEach(node => {
      node.querySelector<HTMLDivElement>('div.progress-bar')!.remove()
      node.querySelector<HTMLDivElement>('div.error')!.remove()

      const img = node.querySelector<HTMLImageElement>('img.image')

      if (img) {
        // img.setAttribute('src', src) 将导致图片闪动
        img.dataset.src = src
      }

      node.classList.remove(`image-${id}`)
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

  static create(value: string | ImageBlotValue) {
    if (typeof value === 'string') {
      value = { src: value }
    }

    const node = super.create()
    node.setAttribute('contenteditable', 'false')

    const wrap = ImageBlot.createDiv('image-wrap')
    node.appendChild(wrap)

    const img = document.createElement('img')
    img.classList.add('image')

    if (value.id) {
      img.dataset.id = value.id
    }

    if (value.width && value.height) {
      img.dataset.width = `${value.width}`
      img.dataset.height = `${value.height}`
    }

    img.setAttribute('src', value.src)

    wrap.appendChild(img)

    return node
  }

  static getImgAndValue(node: HTMLDivElement | HTMLImageElement) {
    const img =
      node.tagName.toUpperCase() === 'IMG'
        ? (node as HTMLImageElement)
        : node.querySelector<HTMLImageElement>('img.image')

    const value: ImageBlotValue = {
      src: (img && img.getAttribute('src')) || '',
    }

    if (img) {
      if (img.dataset.id) {
        value.id = img.dataset.id
      }

      const width = Number(img.dataset.width)
      const height = Number(img.dataset.height)

      if (width && height) {
        value.width = width
        value.height = height
      }
    }

    return { img, value }
  }

  static value(node: HTMLDivElement | HTMLImageElement) {
    return ImageBlot.getImgAndValue(node).value
  }

  remove() {
    const { id } = ImageBlot.value(this.domNode)

    if (id) {
      const status = ImageBlot.uploadStatus[id]

      ImageBlot.eventEmitter.emit('remove', {
        id,
        status: status.status || 'UPLOADING',
      })
    }

    super.remove()
  }

  static pendingImages() {
    return Object.keys(ImageBlot.uploadStatus).filter(id => {
      return ImageBlot.uploadStatus[id]!.status !== 'SUCCESS'
    })
  }

  static buildHtml(node: HTMLDivElement) {
    node.querySelectorAll('div.image-container').forEach(el => {
      const img = el.querySelector<HTMLImageElement>('img.image')
      if (img && (!img.dataset.id || img.dataset.src)) {
        if (img.dataset.src) {
          img.setAttribute('src', img.dataset.src)
          delete img.dataset.src
        }

        delete img.dataset.id
        img.removeAttribute('class')
        img.removeAttribute('style')

        el.parentNode!.insertBefore(img, el.nextSibling)
      }

      el.remove()
    })

    return node
  }
}

Quill.register(ImageBlot)
