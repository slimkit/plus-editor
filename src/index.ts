import Quill, { RangeStatic } from 'quill'
import Delta from 'quill-delta'
import 'quill/assets/snow.styl'
import './index.styl'
import './preview.styl'

// import blots
import './blots/divider'
import { ImageBlot } from './blots/image'
import { VideoBlot } from './blots/video'
import { callMethod } from './caller'
import { fixImageSize, fixVideoSize, fixSize } from './common'

const Header = Quill.import('formats/header')
Header.tagName = ['H1']

let quillSelection: RangeStatic
const quill = new Quill('#editor', {
  debug: false,
  theme: 'snow',
  placeholder: '',
  formats: ['bold', 'header', 'blockquote', 'link', 'image', 'video'],
  modules: {
    toolbar: {
      container: '#toolbar',
      handlers: {
        // 分隔符
        divider(this: { quill: Quill }) {
          const range = this.quill.getSelection(true)
          this.quill.insertText(range.index, '\n', 'user')
          this.quill.insertEmbed(range.index + 1, 'divider', true, 'user')
          this.quill.setSelection(range.index + 2, 0, 'silent')
        },

        // 插入图片
        image(this: { quill: Quill }) {
          quillSelection = quill.getSelection(true)

          quill.blur()

          if (!callMethod('chooseImage')) {
            console.log('chooseImage')
          }
        },

        video(this: { quill: Quill }) {
          quillSelection = quill.getSelection(true)

          quill.blur()

          if (!callMethod('chooseVideo')) {
            console.log('chooseVideo')
          }
        },

        undo(this: { quill: Quill }) {
          // @ts-ignore
          quill.history!.undo()
        },

        redo(this: { quill: Quill }) {
          // @ts-ignore
          quill.history!.redo()
        },
      },
    },
    clipboard: {
      matchers: [
        [
          'IMG',
          (node: HTMLImageElement, delta: Delta): Delta => {
            return new Delta().insert({
              image: ImageBlot.value(node),
            })
          },
        ],

        [
          'VIDEO',
          (node: HTMLVideoElement, delta: Delta): Delta => {
            return new Delta().insert({
              video: VideoBlot.value(node),
            })
          },
        ],

        // 粘贴时提取纯文本
        [
          Node.TEXT_NODE,
          (node: Element, delta: Delta): Delta => {
            const ops: Delta['ops'] = []
            delta.ops!.forEach(op => {
              if (op.insert && typeof op.insert === 'string') {
                ops.push({ insert: op.insert })
              }
            })
            delta.ops = ops
            return delta
          },
        ],
      ],
    },
  },
})

/** 设置编辑器内容 */
window.setContentReceiver = data => {
  quill.clipboard.dangerouslyPasteHTML(data, 'silent')

  setTimeout(fixSize, 0)
}

setTimeout(() => {
  window.setContentReceiver(
    '<p>截至到2017年12月，我国的网民规模已经达到了7.72亿，而手机网民规模也达7.53亿，2017年网络社交娱乐类应用用户规模均保持了高速增长，同时电子商务、网络游戏、网络广告收入水平增速均在20%以上，发展势头良好。</p><p>如此高速的发展，这意味着，移动+社交的时代已经开启。社交软件已经成为了人们生活中密不可分的必需品，社交网站平台不仅仅是沟通、互动、娱乐，甚至能帮助商务交易。</p><img data-width="550" data-height="245" src="https://thinksns.zhibocloud.cn/storage/public:MjAxOS8xMS8xNC9sOHRGYUdPOHZGYkhPc044dGt3Nld4QTNUMW5IYzFFSFVJdE1XNlVIRGpMT3h1V2VYZ0pWWHVOMFZrdWZiSlgyLmpwZWc=" data-src-node="public:2019/11/14/l8tFaGO8vFbHOsN8tkw6WxA3T1nHc1EHUItMW6UHDjLOxuWeXgJVXuN0VkufbJX2.jpeg"><p>如何快速搭建一个社交网站平台？也成为企业增加用户粘性、提高商务交易至关重要的一步。而ThinkSNS作为社交软件定制开发服务供应商先驱，将以自身携带的优势，引领这一社交时代的发展。社交系统ThinkSNS拥有动态、圈子、资讯、直播、商城、IM即时聊天、频道、音乐、活动、问答、投票、打赏等50余项功能，可根据需求组合，提供源码，能够快速定制属于自己的社交网站平台。同时社交系统ThinkSNS拥有PC端、手机H5端、Android 端、iOS端等多种平台，全新底层架构，稳定性能，保障软件快速上线和运营。</p><img data-width="1405" data-height="597" src="https://thinksns.zhibocloud.cn/storage/public:MjAxOS8xMS8xNC8zeDFLWjJBTEJaOUhaSGFDbmlwWjlTYkdBNHZzWVBKdnU0YUg1YXEyQTlYZFhUZENvYUc5YUtLenJjRldJTU5HLnBuZw==" data-src-node="public:2019/11/14/3x1KZ2ALBZ9HZHaCnipZ9SbGA4vsYPJvu4aH5aq2A9XdXTdCoaG9aKKzrcFWIMNG.png"><p>社交系统ThinkSNS可以用于哪些行业？应该用在什么场景呢？ThinkSNS并不仅仅限制于社交；众多的功能扩展让你的社交网站平台如虎添翼。接下来列举一下可以用于哪些行业，我觉得你可以根据自己的行业和面向的用户，来考虑怎么组合。</p><p>【教育行业】 教育o2o 根据知名教育机构的业务需求退推出的微教务、微班级、微网盘、微课堂、等模式，形成线下面授+线上服务的闭环。 社区化 依靠活动，问答，消息通知等社区模式更好的服务客户，成为老师家长学生的沟通纽带。 移动化 学生和家长通过手机随时收到课程，作业提醒等教育信息，还可以手机观看微博，移动时代更便捷。 云端化 支持阿里云SAE等云端部署，同时支持将站内视频，图片，附储存到云端，数据更安全，系统运行更高效。</p><p>【新媒体行业】 新闻模块 简单易用的CMS功能，支持多种格式文章编辑及文章推送 专题模块 相同优质内容聚合形成专题，持续深入聚焦专类信息投稿 用户能迅速、快捷的发表自己的观点、想法 社区 信息快速传递发酵的平台，也是用户持续跟踪新闻线索的工具</p><p>【医疗行业】 品牌服务 基于微信公众帐号开发的品牌系统，具有微活动、微学院、微客服、微会员等模块，通过线上的品牌社区提升用户对品牌的认知 患者社区 基于微信公众帐号开发的患者社区系统，具有用户交流、患者FM、专家答疑、自助查询等模块，提升了用户的黏度和归属感医生社区 基于微信公众号开发的医生社区系统，具有医学资讯、名医电台、在线学习、病历分析等模块，医生可在线上自主学习医疗会议 基于微信帐号开发的医疗会议系统，具有签到、大屏幕、问卷调查、投票等功能，通过数据可以看到参会者参与的效果</p><p>【粉丝营销社区】社交·分享 发烧用户聚集一起互动、分享，共同的兴趣形成更多的话题、圈子，增大品牌效应和附加值 互动·参与 粉丝通过线下活动、线上帖子讨论表达自己的观点，让更多的用户参与进来，打造品牌热度 荣誉·认证 品牌利用勋章、认证等机制奖励活跃用户，让用户与品牌紧密联系在一起 积分·换礼 积分、换礼等实质奖励，带动用户积极性吸引用户参与进来，最终达到品牌效应</p><p>更多行业案例，请参见：http://www.thinksns.com/case.html</p><p>目前，ThinkSNS作为华为、联想、奔驰，远景能源，中国大学生在线，蓝鲸传媒等著名企业软件技术指定合作方，深得业界口碑拥趸。</p><p>社交软件开发供应商ThinkSNS官网：http://www.thinksns.com/</p>',
  )
}, 3000)

ImageBlot.quill = quill

ImageBlot.eventEmitter.on('remove', data => {
  if (!callMethod('removeImage', data)) {
    console.log('removeImage', data)
  }
})

ImageBlot.eventEmitter.on('reinsert', data => {
  if (!callMethod('reinsertImage', data)) {
    console.log('reinsertImage', data)
  }
})

ImageBlot.eventEmitter.on('reupload', data => {
  if (!callMethod('reuploadImage', data)) {
    console.log('reuploadImage', data)
  }
})

ImageBlot.eventEmitter.on('insertRemoteImage', data => {
  if (!callMethod('insertRemoteImage', data)) {
    console.log('insertRemoteImage', data)
  }
})

/** 收到图片后预览 */
window.imagePreviewReceiver = data => {
  const srcList = JSON.parse(data)
  let { index } = quillSelection

  for (const item of srcList) {
    quill.insertEmbed(
      index++,
      'image',
      {
        id: `${item.id || ''}`,
        src: `${item.url}`,
        width: +item.width,
        height: +item.height,
      },
      'user',
    )
  }

  setTimeout(fixImageSize, 0)
}

window.uploadRemoteImage = (data: string) => {
  const { id, remoteId } = JSON.parse(data) || {}
  if (remoteId && `${id || ''}`) {
    ImageBlot.uploadRemoteImage(remoteId, `${id}`)
  }
}

/** 更新图片上传进度 */
window.imageProgressReceiver = (data: string) => {
  const { id, progress } = JSON.parse(data) || {}
  ImageBlot.updateUploadProgress(`${id}`, Number(progress))
}

/** 设置图片上传成功 */
window.imageUrlReceiver = (data: string) => {
  const { id, url, node } = JSON.parse(data) || {}

  ImageBlot.setUploadSuccess(`${id}`, `${url}`, `${node || ''}`)
}

/** 设置图片上传失败 */
window.imageFailedReceiver = (data: string) => {
  const { id, error } = JSON.parse(data) || {}

  ImageBlot.setUploadError(`${id}`, `${error || ''}`)
}

VideoBlot.quill = quill

VideoBlot.eventEmitter.on('remove', data => {
  if (!callMethod('removeVideo', data)) {
    console.log('removeVideo', data)
  }
})

VideoBlot.eventEmitter.on('reinsert', data => {
  if (!callMethod('reinsertVideo', data)) {
    console.log('reinsertVideo', data)
  }
})

VideoBlot.eventEmitter.on('reupload', data => {
  if (!callMethod('reuploadVideo', data)) {
    console.log('reuploadVideo', data)
  }
})

/** 收到视频后预览 */
window.videoPreviewReceiver = data => {
  const item = JSON.parse(data)
  let { index } = quillSelection

  quill.insertEmbed(
    index++,
    'video',
    {
      id: `${item.id || ''}`,
      src: `${item.url}`,
      poster: `${item.poster}`,
      width: +item.width,
      height: +item.height,
    },
    'user',
  )

  setTimeout(fixVideoSize, 0)
}

/** 更新视频上传进度 */
window.videoProgressReceiver = (data: string) => {
  const { id, progress } = JSON.parse(data) || {}
  VideoBlot.updateUploadProgress(`${id}`, Number(progress))
}

/** 设置视频上传成功 */
window.videoUrlReceiver = (data: string) => {
  const { id, url, urlNode, poster, posterNode } = JSON.parse(data) || {}

  VideoBlot.setUploadSuccess(`${id}`, {
    src: `${url}`,
    srcNode: `${urlNode || ''}`,
    poster: `${poster}`,
    posterNode: `${posterNode || ''}`,
  })
}

/** 设置视频上传失败 */
window.videoFailedReceiver = (data: string) => {
  const { id, error } = JSON.parse(data) || {}

  VideoBlot.setUploadError(`${id}`, `${error || ''}`)
}

window.changePlaceholder = text => {
  const el = document.querySelector(`.ql-editor,.ql-blank`)
  if (el) {
    el.setAttribute('data-placeholder', text)
  }
}

window.editorSubmitReceiver = () => {
  let html = quill.root.innerHTML
  let div: HTMLDivElement | null
  div = document.createElement('div')
  div.innerHTML = html

  div = VideoBlot.buildHtml(ImageBlot.buildHtml(div))

  const isEmpty = !(quill.getText() || div!.querySelector('video,img'))
  const pendingImages = ImageBlot.pendingImages()
  const pendingVideos = VideoBlot.pendingVideos()

  const medias: { image: string; video?: string }[] = []

  div!.querySelectorAll('img, video').forEach((el: any) => {
    const tagName = el.tagName.toUpperCase()
    const { srcNode, posterNode } = el.dataset

    if (tagName === 'IMG' && srcNode) {
      medias.push({ image: srcNode })
    } else if (tagName === 'VIDEO' && srcNode && posterNode) {
      medias.push({ image: posterNode, video: srcNode })
    }
  })

  html = div!.innerHTML
  div = null

  if (!callMethod('sendContentHTML', { html, medias, pendingImages, pendingVideos, isEmpty })) {
    console.log('sendContentHTML', { html, medias, pendingImages, pendingVideos, isEmpty })
  }
}

window.quill = quill

window.addEventListener('resize', () => {
  const range = quill.getSelection()

  if (range && quill.hasFocus()) {
    quill.setSelection(range)
  }

  fixSize()
})

export default quill
