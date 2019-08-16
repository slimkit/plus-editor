import 'quill/assets/snow.styl'
import './preview.styl'
const imgArr = Array.from(document.querySelectorAll('img[data-width]'))
console.log('这个是图片列表', imgArr)
imgArr.forEach(element => {
  const width = +element.getAttribute('data-width')!
  const height = +element.getAttribute('data-height')!
  console.log('这里是图片原始宽高', width, height)
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
  console.log(newWidth, newHeight)
  element.setAttribute('style', `width:${newWidth}px;height:${newHeight}px`)
})
