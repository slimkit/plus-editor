import Quill from 'quill'
import 'quill/assets/snow.styl'
import './index.styl'

// import blots
import './blots/divider'
import './blots/image'
import { callMethod } from './caller'

const quill = new Quill('#editor', {
  // debug: 'info',
  theme: 'snow',
  placeholder: '请输入内容',
  modules: {
    toolbar: {
      container: '#toolbar',
      handlers: {
        divider(this: { quill: Quill }) {
          const range = this.quill.getSelection(true)
          this.quill.insertText(range.index, '\n', 'user')
          this.quill.insertEmbed(range.index + 1, 'divider', true, 'user')
          this.quill.setSelection(range.index + 2, 0, 'silent')
        },
        image(this: { quill: Quill }) {
          let inWebview = false
          try {
            inWebview = callMethod('chooseImage')
          } catch (error) {
            this.quill.insertText(0, '通信失败' + error)
          }
          if (!inWebview) {
            alert('不在webview中')
          }
        },
      },
    },
  },
})

/** 上传的图片 */
interface UploadImage {
  /** 图片标识 */
  id: number
  /** 图片地址 */
  src?: string
  /** 图片 base64 */
  base64?: string
}

/** 上传的图片列表 */
const images: UploadImage[] = []

window.imagePreviewReceiver = str => {
  const range = quill.getSelection()
  const srcList = JSON.parse(str)
  for (const item of srcList) {
    images.push({ id: +item.id, base64: item.base64 })
    const index = (range && range.index) || 0
    quill.insertText(index, '\n', 'user')
    quill.insertEmbed(index + 1, 'image', { id: +item.id, url: item.base64 }, 'user')
    quill.setSelection(index + 2, 0, 'silent')
  }
}

window.imageUrlReceiver = str => {
  const urlList = JSON.parse(str) || []
  for (const item of urlList) {
    const index = images.findIndex(image => image.id === +item.id)
    if (index >= 0) images[index].src = item.url
  }
}

window.imageFailedReceiver = imageId => {
  const el = document.querySelector(`#quill-image-${imageId}`)
  const index = images.findIndex(image => +image.id === +imageId)
  if (index <= -1 || !el) {
    if (window.debug) console.log(`image ${imageId} not exist!`) // eslint-disable-line no-console
    return
  }

  el.setAttribute(
    'src',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAAAAACIM/FCAAAE1UlEQVR42u3a7aq0LBQG4Of8z+YGEUKCECGEkBCk03l/2IeaOc1MAy+b238zY9aly5W697/lj5R/hBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghfx4yO+ecf9GAmdNPQRszzndubI0xxr/1rEYbN38CUQBg2o3PgOjd/nECgOHOUykAcG9BJACEH0FGAJj2jxoA7GXt3rjwGmJVUeIweADofzUiKu8lBQC+MXz7eDUgBkWJ1Wyzk76EBABQx2cAkO3hGz+F9K3I+hZik0dblsUBgL6s3SXjpQBgfgMSmpH1LaSPj+ZwWVwRWV3a+HIJMVsZtjbakfUlZJt/9yA6Hb4XkGyQ3d5n2iTFPQcZ1166BQkCALo1EwkAyJOTbkH8uWnzHEQCEMtNiMWLonKIMcYeEPNLSDm3dTOvyDch8ZsNIn4JKSvIZDLXE9zHEFuGZaeUfQrii37xzfoyn6wSgDRZsQ2ITHND7RX0EnIqx+9DARmvXw3rjypvXDWzVgqxKCHzcxC/R6qLJb6sy+KTlJV0o3gHEq/eLne1zP0FZNghzcg3Rx5IHxzvQHRsajqW2PI5iMM7EKuKcHgHMuZpytQufQmR5Zq6ZN6DLItTulxt6psQkac1VcspH2ctmzxoFAKAUKdyJMlQvoLMTYgEMKzv3nV62acgQWw9ZdIloW5smrMyAsBw+jpUIZOACHKLzbm65/kUMgOASSvofK94Y7ZdLWjOk93ALsO24hyre56PQwuAXNIK8hj7xyGhj8/fbcvg4TmIAlwK8a1jh28h+w38miam5yAGekkhYzXFrecGn0BCAVlkvNlYX5l+DJm6JYOY1ip+rs51wDYmuzv2bG6/g4ye4cEdovdvQE5FVxbiRfp16/Jnb8QDgLUXrX63sfoUsq6dIMI1ZCwhiwIg5cU5zWOQU34WACB8+5ykv4boOKddsVi8OoL4FcRGx3z9EhKXp5IR0sW5kEC2nNEtv4So3p0WMFcOAQBDjC/b3LV14bS1vgjXpyAWQGdzR+dbQRdiIr2SrHkt64v5ekCegqyzV5qQOOrHEJPY9xYxVHTzqELYogeAPvwO4raVttB+7cy6I/Sx3pDwO3e1M85y9LwfpNSafiq0gjlu03CMInEkfTzXwk+tm9AhHcnYXa4J8cVrtqsvtd3+N448a9n04Kq26gp7jf3XefsmP9uZtx1+lKiwhPUVatcNtg4NiHlrRVRJv5NqdJnXovIeCMclwxQyh05OapzcrxxOc+d5yLLMw1ZHjmmf+bHbr+7marStXb9PuDU2DQDVp92jtztMP4RkHd/7IpcCgBhPETfkARkfVIbTCeXWA9s3v4Uk8/5I+GEbD2FqOcCvFBn2usn7ww1l1o0zS93OWq/LRVoLRhaHgTHR5uGWUYzcu3gWZc5T+d/F1iTufw+Jay1drC76qdnWNAx7MBW524tyYi2TGJYHIY3/KAhF77twv9mTeDpl2yX4JyH/o0IIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEPI3yn/oqrbBqSfstwAAAABJRU5ErkJggg==',
  )

  const imageReuploadeHandler = () => {
    callMethod('reuploadImage', imageId)
    el.setAttribute('src', images[index].base64!)
  }
  el.addEventListener('click', imageReuploadeHandler, { once: true })
}

window.editorSubmitReceiver = () => {
  let html = quill.root.innerHTML

  /** 未上传完毕的图片 */
  const pendingImages: number[] = []
  images.forEach(image => {
    if (!image.src) return pendingImages.push(image.id)
    const regex = new RegExp(`<img id="quill-image-${image.id}" class="quill-image" src="\\S+" ?>`)
    html = html.replace(
      regex,
      `<img id="quill-image-${image.id}" class="quill-image" src="${image.src}">`,
    )
  })

  try {
    callMethod('sendContentHTML', { html, pendingImages })
  } catch (error) {
    quill.insertText(0, '通信失败' + error)
  }
}

window.quill = quill

export default quill
