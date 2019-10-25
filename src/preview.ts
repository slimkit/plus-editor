import 'quill/assets/snow.styl'
import './preview.styl'
import { callMethod } from './caller'
import { getViewElement, fixSize } from './common'

window.addEventListener('resize', fixSize)

const onReady = () => {
  fixSize()

  callMethod('docReady', {
    docHeight: document.body.offsetHeight,
  })

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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onReady)
} else {
  onReady()
}
