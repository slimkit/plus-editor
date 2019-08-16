import Quill from 'quill'

const BlockEmbed = Quill.import('blots/block/embed')

class ImageBlot extends BlockEmbed {
  static create(value: { id: number; url: string; width: number; height: number }) {
    const node = super.create()
    node.setAttribute('id', `quill-image-${value.id}`)
    node.setAttribute('class', 'quill-image')
    node.setAttribute('src', value.url)
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

ImageBlot.blotName = 'image'
ImageBlot.tagName = 'img'

Quill.register(ImageBlot)
