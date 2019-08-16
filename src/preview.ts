import 'quill/assets/snow.styl'
import './preview.styl'
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
    element.setAttribute('style', `width:${newWidth}px;height:${newHeight}px`)
  })
}
computer()
window.addEventListener('resize', () => {
  computer()
})
