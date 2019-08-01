import Quill from 'quill'

const BlockEmbed = Quill.import('blots/block/embed')

class ImageBlot extends BlockEmbed {
  static create(value: { id: string; url: string }) {
    const node = super.create()
    node.setAttribute('id', `quill-image-${value.id}`)
    node.setAttribute('src', value.url)
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
