import Quill from 'quill'

const BlockEmbed = Quill.import('blots/block/embed')

class VideoBlot extends BlockEmbed {
  static create(value: { id: number; src: string; width: number; height: number; poster: string }) {
    const node = super.create()
    node.setAttribute('class', 'video-container')
    node.setAttribute('id', `video-container-${value.id}`)
    const videoNode = document.createElement('video')
    const uploadFail = document.createElement('span')
    uploadFail.setAttribute('id', `video-notice-${value.id}`)
    uploadFail.innerText = '上传失败,点此重传'
    uploadFail.setAttribute('class', 'uploadFail hidden')
    videoNode.setAttribute('id', `quill-video-${value.id}`)
    videoNode.setAttribute('class', 'quill-video')
    videoNode.setAttribute('src', value.src)
    videoNode.setAttribute('poster', value.poster)
    videoNode.addEventListener(
      'click',
      (e: any) => {
        e.target.paused ? e.target.play() : e.target.pause()
        e.stopPropagation()
        e.preventDefault()
      },
      false,
    )
    // node.setAttribute('controls', 'controls')
    //在实际插入标签之前计算图片的等比宽高
    videoNode.setAttribute('data-width', `${value.width}`)
    videoNode.setAttribute('data-height', `${value.height}`)
    node.appendChild(videoNode)
    node.appendChild(uploadFail)
    return node
  }

  static value(node: Element) {
    return node.getAttribute('src')
  }
}

VideoBlot.blotName = 'video'
VideoBlot.tagName = 'section'

Quill.register(VideoBlot)
