export function getViewElement() {
  return document.querySelector<HTMLDivElement>('div.ql-editor')
}

export function getViewWidth() {
  const view = getViewElement()

  if (view) {
    let width = view.clientWidth
    const style = getComputedStyle(view)

    if (style.paddingLeft) {
      width -= parseFloat(style.paddingLeft)
    }

    if (style.paddingRight) {
      width -= parseFloat(style.paddingRight)
    }

    if (width > 0) {
      return width
    }
  }

  return 0
}

export function fixImageSize() {
  getViewElement()!
    .querySelectorAll('img')
    .forEach(img => {
      const viewWidth = getViewWidth()
      let width = Number(img.dataset.width)
      let height = Number(img.dataset.height)

      if (!viewWidth || !width || !height) return

      if (width > viewWidth) {
        height = (viewWidth / width) * height
        width = viewWidth
      }

      img.style.width = `${width}px`
      img.style.height = `${height}px`
    })
}

function onPalyVideo(e: Event) {
  getViewElement()!
    .querySelectorAll<HTMLMediaElement>('video,audio')
    .forEach(media => {
      if (media !== e.target) {
        media.pause()
      }
    })
}

export function fixVideoSize() {
  getViewElement()!
    .querySelectorAll('video')
    .forEach(video => {
      video.setAttribute('controls', '')
      video.setAttribute('preload', 'auto')
      video.setAttribute('webkit-playsinline', '')
      video.setAttribute('playsinline', '')
      video.setAttribute('x5-playsinline', '')
      video.setAttribute('controlsList', 'nodownload')
      video.removeAttribute('autopaly')
      video.removeAttribute('loop')

      video.removeEventListener('playing', onPalyVideo)
      video.addEventListener('playing', onPalyVideo)

      console.log(video.shadowRoot)

      const viewWidth = getViewWidth()
      if (!viewWidth) return

      let width = Number(video.dataset.width)
      let height = Number(video.dataset.height)

      if (!width || !height || width < height) {
        width = viewWidth
        height = viewWidth
      } else {
        height = (viewWidth / width) * height
        width = viewWidth
      }

      video.style.width = `${width}px`
      video.style.height = `${height}px`
    })
}

window.pageHiddenReceiver = (data?: string) => {
  document.querySelectorAll<HTMLMediaElement>('video,audio').forEach(media => {
    media.pause()
  })
}

export function fixSize() {
  fixImageSize()
  fixVideoSize()
}
