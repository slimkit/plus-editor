import Quill from 'quill'

const BlockEmbed = Quill.import('blots/block/embed')

class VideoBlot extends BlockEmbed {
  static create(value: {
    id: number
    src: string
    width: number
    height: number
    poster?: string
  }) {
    const node = super.create()
    node.setAttribute('id', `quill-video-${value.id}`)
    node.setAttribute('class', 'quill-video')
    node.setAttribute('src', value.src)
    node.setAttribute('poster', value.poster)
    node.addEventListener(
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
    node.setAttribute('data-width', `${value.width}`)
    node.setAttribute('data-height', `${value.height}`)
    return node
  }

  static value(node: Element) {
    return {
      url: node.getAttribute('src'),
    }
  }
}

VideoBlot.blotName = 'video'
VideoBlot.tagName = 'video'

Quill.register(VideoBlot)
