import 'quill/assets/snow.styl'
import './preview.styl'
import { callMethod } from './caller'
function computer() {
  const imgArr = Array.from(document.querySelectorAll('img[data-width]'))
  imgArr.forEach(element => {
    const width = +element.getAttribute('data-width')!
    const height = +element.getAttribute('data-height')!
    let newWidth: number = 0
    let newHeight: number = 0
    const el = document.querySelector('.ql-editor')!
    if (width > el.clientWidth) {
      newWidth = el.clientWidth
      newHeight = height * (el.clientWidth / width)
    } else {
      newWidth = width
      newHeight = height
    }
    window.alert(newWidth)
    element.setAttribute('style', `width:${newWidth}px;height:${newHeight}px`)
  })
}
function videoComputer() {
  const videoArr = Array.from(document.querySelectorAll('.quill-video'))
  videoArr.forEach(element => {
    const width = +element.getAttribute('data-width')!
    const height = +element.getAttribute('data-height')!
    let newWidth: number = 0
    let newHeight: number = 0
    const el = document.querySelector('.ql-editor')!
    // 视频宽度大于预览区域宽度
    // if (width > el.clientWidth) {
    newWidth = el.clientWidth
    newHeight = newWidth < height ? newWidth : height
    // } else {
    //   newWidth = width
    //   newHeight = height
    // }
    element.setAttribute('width', `${newWidth}px`)
    element.setAttribute('height', `${newHeight}px`)
  })
}

;(function() {
  const imgList = document.querySelectorAll('img')
  const arr: Array<object> = []
  Array.prototype.map.call(imgList, (item, index) => {
    arr.push({
      src: item.src,
      width: item.dataset.width ? item.dataset.width : 0,
      height: item.dataset.height ? item.dataset.height : 0,
    })
    item.onclick = () => {
      callMethod('clickImage', { src: item.src, arr: arr, index: index })
    }
  })
})()
computer()
alert('init')
videoComputer()
window.addEventListener('resize', () => {
  computer()
  videoComputer()
})
