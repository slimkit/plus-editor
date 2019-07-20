import Quill from 'quill'

let BlockEmbed = Quill.import('blots/block/embed')

class ImageBlot extends BlockEmbed {
  static create(value: { id: number; url: string }) {
    let node = super.create()
    node.setAttribute('id', `quill-image-${value.id}`)
    node.setAttribute('src', value.url)
    return node
  }
}

ImageBlot.blotName = 'image'
ImageBlot.tagName = 'img'

Quill.register(ImageBlot)
