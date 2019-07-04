import Quill from 'quill'
import 'quill/assets/snow.styl'
import './index.styl'

let BlockEmbed = Quill.import('blots/block/embed')

class DividerBlot extends BlockEmbed {}
DividerBlot.blotName = 'divider'
DividerBlot.tagName = 'hr'
Quill.register(DividerBlot)

new Quill('#editor', {
  debug: 'info',
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'strike'],
      [{ header: 1 }, { header: 2 }, { header: 3 }],
      [{ align: '' }, { align: 'center' }, { align: 'right' }],
      ['blockquote', 'image', 'link', 'divider'],
      ['clean'],
    ],
  },
})
