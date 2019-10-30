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
  if (window.innerWidth && window.innerHeight) {
    const width = document.body.offsetWidth
    const height = document.body.offsetHeight

    if (docSize.width !== width || docSize.height !== height) {
      docSize.width = width
      docSize.height = height

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

  // 文档加载完毕
  callMethod('docReady')
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onReady)
} else {
  onReady()
}
