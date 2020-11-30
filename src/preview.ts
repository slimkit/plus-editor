import 'quill/assets/snow.styl'
import './preview.styl'
import { callMethod } from './caller'
import { getViewElement, fixSize } from './common'

interface DocSize {
  width: number
  height: number
}

const docSize: DocSize = { width: 0, height: 0 }

function setDocSize() {
  const width = document.body.offsetWidth
  const height = document.body.offsetHeight

  if (docSize.width !== width || docSize.height !== height) {
    docSize.width = width
    docSize.height = height

    if (window.innerWidth && window.innerHeight) {
      callMethod('setDocSize', docSize)
    }
  }
}

window.addEventListener('resize', () => {
  fixSize()
  setDocSize()
})

const onReady = () => {
  fixSize()
  setDocSize()

  const view = getViewElement()

  if (!view) {
    return
  }

  const images: object[] = []

  view.querySelectorAll('img').forEach((img, index) => {
    images.push({
      src: img.src,
      width: Number(img.dataset.width) || 0,
      height: Number(img.dataset.height) || 0,
    })

    const imgWidth = Number(img.dataset.width) || 0
    const imgHeight = Number(img.dataset.height) || 0

    if (imgWidth && imgHeight) {
      if (imgWidth > document.body.offsetWidth) {
        img.style.width = `${document.body.offsetWidth}px`
        img.style.height = `${imgHeight * (document.body.offsetWidth / imgWidth)}px`
      }
    }

    img.addEventListener('click', () => {
      callMethod('clickImage', { src: img.src, arr: images, index })
    })
  })

  view.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', (e: Event) => {
      if (!/^https?:\/\//.test(a.href)) {
        e.preventDefault()
      }
    })
  })

  callMethod('docReady', {
    docWidth: docSize.width,
    docHeight: docSize.height,
  })
}

if (document.readyState !== 'complete') {
  document.addEventListener('DOMContentLoaded', onReady)
} else {
  onReady()
}
