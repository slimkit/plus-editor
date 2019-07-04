import Quill from 'quill'
import 'normalize.css'
import 'quill/assets/snow.styl'
import './index.styl'

new Quill('#editor', {
  debug: 'info',
  theme: 'snow',
  modules: {
    toolbar: true,
  },
})
