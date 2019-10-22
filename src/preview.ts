import 'quill/assets/snow.styl'
import './preview.styl'
import { callMethod } from './caller'
import { getViewElement, fixSize } from './common'

window.addEventListener('resize', fixSize)

const onReady = () => {
  fixSize()

  const images: object[] = []
  getViewElement()!
    .querySelectorAll('img')
    .forEach((img, index) => {
      images.push({
        src: img.src,
        width: Number(img.dataset.width) || 0,
        height: Number(img.dataset.height) || 0,
      })

      img.addEventListener('click', () => {
        callMethod('clickImage', { src: img.src, arr: images, index })
      })
    })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onReady)
} else {
  onReady()
}
