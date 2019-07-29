import Vue from 'vue'

export default Vue.extend({
  name: 'PlusEditor',
  template: `<div>1</div>`,
  props: {
    features: { type: Array, default: () => [] },
  },
  data() {
    return {}
  },
})
