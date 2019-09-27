import Quill from 'quill'

const BlockEmbed = Quill.import('blots/block/embed')

class VideoBlot extends BlockEmbed {
  static create(value: {
    id: number
    src: string
    width: number
    height: number
    localPath?: string
    poster?: string
  }) {
    const node = super.create()
    node.setAttribute('id', `quill-video-${value.id}`)
    node.setAttribute('class', 'quill-video')
    node.setAttribute('src', value.src)
    node.setAttribute('poster', value.poster)
    //在实际插入图片标签之前计算图片的等比宽高
    node.setAttribute('data-width', `${value.width}`)
    node.setAttribute('data-height', `${value.height}`)
    return node
  }

  static value(node: Element) {
    return {
      id: node.getAttribute('alt'),
      url: node.getAttribute('src'),
    }
  }
}

VideoBlot.blotName = 'image'
VideoBlot.tagName = 'img'

Quill.register(VideoBlot)
