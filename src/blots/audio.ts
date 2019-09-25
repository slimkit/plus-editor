import Quill from 'quill'
const BlockEmbed = Quill.import('blots/block/embed')
const Link = Quill.import('formats/link')

class AudioBlot extends BlockEmbed {
  ATTRIBUTES = ['height', 'width']
  static create(value: { id: number; url: string; duration: number }) {
    const node = super.create(value)
    node.setAttribute('id', `quill-audio-${value.id}`)
    node.setAttribute('class', 'quill-audio')
    node.setAttribute('controls', 'controls')
    node.setAttribute('src', this.sanitize(value.url))
    return node
  }

  static sanitize(url: string) {
    return Link.sanitize(url)
  }

  static value(domNode: any) {
    return domNode.getAttribute('src')
  }

  //获取属性列表
  static formats(domNode: any) {
    return this.ATTRIBUTES.reduce(function(formats: any, attribute: string) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute)
      }
      return formats
    }, {})
  }

  //设置属性
  format(name: string, value: string) {
    if (this.ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value)
      } else {
        this.domNode.removeAttribute(name)
      }
    } else {
      super.format(name, value)
    }
  }
}
AudioBlot.blotName = 'audio'
AudioBlot.tagName = 'audio'

Quill.register(AudioBlot)
