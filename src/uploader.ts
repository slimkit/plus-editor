import axios from 'axios'
import Spark from 'spark-md5'

let userToken: string = ''
let apiV2BaseUrl: string = ''
let storage = { channel: 'public' }

try {
  const sp = new URL(window.location.href).searchParams

  userToken = sp.get('user_token') || ''
  apiV2BaseUrl = sp.get('api_v2_base_url') || ''
  const uploadStorage = sp.get('upload_storage')
  if (uploadStorage) {
    storage = JSON.parse(uploadStorage)
  }
} catch (err) {
  //
}

window.setUploaderOptions = options => {
  if (typeof options === 'string') {
    options = JSON.parse(options)
  }

  userToken = options.userToken || ''
  apiV2BaseUrl = options.apiV2BaseUrl || ''

  if (options.storage) {
    storage = options.storage
  }
}

const uploadFuncNames = [
  'chooseImage',
  'removeImage',
  'reinsertImage',
  'reuploadImage',
  'insertRemoteImage',
  'chooseVideo',
  'removeVideo',
  'reinsertVideo',
  'reuploadVideo',
]

export function tryHijackUploadCall(funcName: string, params: any): boolean {
  if (!uploadFuncNames.includes(funcName)) {
    return false
  }

  if (funcName.startsWith('choose')) {
    chooseAndUpload(funcName.substr(6).toLowerCase())
  } else if (funcName.startsWith('remove')) {
    handleRemove(funcName.substr(6).toLowerCase(), params)
  } else if (funcName.startsWith('reinsert')) {
    handleReinsert(funcName.substr(8).toLowerCase(), params)
  } else if (funcName.startsWith('reupload')) {
    handleReupload(funcName.substr(8).toLowerCase(), params)
  } else if (funcName === 'insertRemoteImage') {
    uploadRemoteImage(params)
  }

  return true
}

interface MediaFileInfo {
  file: File
  buff: ArrayBuffer
  hash: string
  url: string
  width: number
  height: number
}

interface MediaFile {
  image: MediaFileInfo
  video?: MediaFileInfo
}

interface UploadFile extends MediaFile {
  id: string
  useCounter: number
  status?: string
  cancelUpload?: () => void
  error?: string
}

const uploadFiles: Map<string, UploadFile> = new Map()

let fileCounter = 1

function chooseAndUpload(type: string) {
  const input = document.createElement('input')

  input.setAttribute('type', 'file')

  if (type === 'image') {
    input.setAttribute('multiple', '')
    input.setAttribute('accept', 'image/*')
  } else if (type === 'video') {
    input.setAttribute('accept', 'video/mp4')
  }

  input.addEventListener('change', () => {
    const length = input.files!.length

    if (!length) {
      return
    }

    const promises: Promise<UploadFile>[] = []
    for (let i = 0; i < length; i++) {
      const file = input.files!.item(i)

      if (
        !file ||
        (type === 'image' && !file.type.startsWith('image/')) ||
        (type === 'video' && file.type !== 'video/mp4')
      ) {
        continue
      }

      const id = `${fileCounter++}`
      promises.push(
        getMediaInfo(file).then(mf => {
          return { ...mf, id, useCounter: 1 }
        }),
      )
    }

    Promise.all(promises)
      .then(list => {
        const params: any[] = list
          .sort((a, b) => Number(a.id) - Number(b.id))
          .map(uf => {
            const param: any = {
              id: uf.id,
              url: uf.image.url,
              width: uf.image.width,
              height: uf.image.height,
            }
            if (type === 'video') {
              param.url = uf.video!.url
              param.poster = uf.image.url
            }

            return param
          })

        window.postMessage(
          {
            funcName: `${type}PreviewReceiver`,
            params: type === 'image' ? params : params[0],
          },
          '*',
        )

        list.forEach(uf => {
          uploadFiles.set(uf.id, uf)
          handleUpload(type, uf.id)
        })
      })
      .catch(console.log)
  })

  input.click()
}

async function getMediaInfo(file: File) {
  const mf: MediaFile = {
    image: {
      file: file,
      buff: new ArrayBuffer(0),
      hash: '',
      url: '',
      width: 0,
      height: 0,
    },
  }

  const promises = []

  if (file.type.startsWith('video/')) {
    mf.video = {
      file: file,
      buff: new ArrayBuffer(0),
      hash: '',
      url: URL.createObjectURL(file),
      width: 0,
      height: 0,
    }

    const imageFileType = `image/png`
    const imageFilename = `${file.name}.png`

    await new Promise((resolve, reject) => {
      const video = document.createElement('video')

      video.addEventListener('loadeddata', () => {
        video.pause()
        video.currentTime = 0

        mf.video!.width = mf.image.width = video.videoWidth
        mf.video!.height = mf.image.height = video.videoHeight

        const canvas = document.createElement('canvas')
        canvas.setAttribute('width', `${mf.image.width}`)
        canvas.setAttribute('height', `${mf.image.height}`)

        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('无法提取到视频封面'))
        } else {
          ctx.drawImage(video, 0, 0, mf.image.width, mf.image.height)

          canvas.toBlob(blob => {
            if (!blob || blob.size <= 0) {
              reject(new Error('无法提取到视频封面'))
            } else {
              const file = new File([blob], imageFilename, { type: blob.type })
              mf.image.url = URL.createObjectURL(file)
              mf.image.file = file
              resolve()
            }
          }, imageFileType)
        }
      })
      video.autoplay = true
      video.muted = true
      video.src = mf.video!.url
    })
  } else {
    mf.image.url = URL.createObjectURL(mf.image.file)
    promises.push(
      new Promise((resolve, reject) => {
        const img = document.createElement('img')

        img.addEventListener('load', () => {
          mf.image.width = img.naturalWidth
          mf.image.height = img.naturalHeight

          resolve()
        })

        img.addEventListener('error', () => {
          reject(new Error('图片加载异常'))
        })

        img.src = mf.image.url
      }),
    )
  }

  const setBuffAndHash = (info: MediaFileInfo) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.addEventListener('load', () => {
        const spark = new Spark.ArrayBuffer()
        info.buff = reader.result as ArrayBuffer
        info.hash = spark.append(info.buff).end()
        resolve()
      })

      reader.addEventListener('error', () => {
        reject(new Error('读取文件异常'))
      })

      reader.readAsArrayBuffer(info.file)
    })
  }

  promises.push(setBuffAndHash(mf.image))

  if (mf.video) {
    promises.push(setBuffAndHash(mf.video))
  }

  await Promise.all(promises)

  return mf
}

async function uploadRemoteImage(params: {
  src: string
  remoteId: string
  width: number
  height: number
}) {
  const id = `${fileCounter++}`

  window.postMessage(
    {
      funcName: `uploadRemoteImage`,
      params: { id, remoteId: params.remoteId },
    },
    '*',
  )

  try {
    const url = params.src.replace(/^https?:/i, '')
    const { headers, data } = await axios.get(params.src, { responseType: 'arraybuffer' })

    const contentType = (headers['content-type'] || '').toLowerCase().trim()
    if (!data || data.byteLength <= 0 || !contentType || !contentType.startsWith('image/')) {
      throw new Error()
    }

    const spark = new Spark.ArrayBuffer()
    const hash = spark.append(data).end()
    const filename = `${Date.now()}.${contentType.substr(6)}`
    const file = new File([data], filename, {
      type: contentType,
    })

    uploadFiles.set(id, {
      id,
      useCounter: 1,
      image: {
        file,
        buff: data,
        hash,
        url: params.src,
        width: params.width,
        height: params.height,
      },
    })
  } catch (error) {
    const buff = new ArrayBuffer(0)
    uploadFiles.set(id, {
      id,
      useCounter: 1,
      image: {
        file: new File([buff], 'empty'),
        buff: buff,
        hash: '',
        url: params.src,
        width: params.width,
        height: params.height,
      },
      error: '无法下载远程图片，请手动上传',
    })
  }

  handleUpload('image', id)
}

async function handleUpload(type: string, id: string) {
  const uf = uploadFiles.get(id)

  if (!uf || (uf.status && ['UPLOADING', 'SUCCESS'].includes(uf.status))) {
    return
  }

  try {
    if (uf.error) {
      throw new Error(uf.error)
    }

    const upload = async (info: MediaFileInfo) => {
      let source = axios.CancelToken.source()
      uf.cancelUpload = source.cancel.bind(source)

      const {
        data: { uri, method, headers, form, file_key: fileKey },
      } = await axios.post(
        'storage',
        {
          hash: info.hash,
          storage,
          size: info.file.size,
          filename: info.file.name,
          mime_type: info.file.type,
        },
        {
          headers: {
            Authorization: userToken,
          },
          baseURL: apiV2BaseUrl,
          validateStatus: s => s === 200 || s === 201,
          cancelToken: source.token,
        },
      )

      let data: ArrayBuffer | FormData = info.buff
      if (form || fileKey) {
        data = new FormData()
        data.append(fileKey, info.file)

        const keys = Object.keys(form || {})

        if (keys.length) {
          keys.forEach(key => (data as FormData).append(key, form[key]))
        }
      }

      source = axios.CancelToken.source()
      uf.cancelUpload = source.cancel.bind(source)

      const {
        data: { node, uri: url },
      } = await axios.request({
        url: uri,
        method,
        headers,
        data,
        onUploadProgress: (pe: ProgressEvent) => {
          if (pe.lengthComputable) {
            if (type === 'image' || info.file.type.startsWith('video/')) {
              window.postMessage(
                {
                  funcName: `${type}ProgressReceiver`,
                  params: { id, progress: (pe.loaded * 100) / pe.total },
                },
                '*',
              )
            }
          }
        },
        validateStatus: s => s === 200 || s === 201,
        cancelToken: source.token,
      })

      return { node, url, fileType: info.file.type }
    }

    uf.status = 'UPLOADING'
    const params: any = { id }
    if (type === 'image') {
      const { node, url } = await upload(uf.image)
      params.url = url
      params.node = node
    } else if (type === 'video') {
      const results = await Promise.all([upload(uf.image), upload(uf.video!)])
      let video, poster
      if (results[0].fileType.startsWith('video/')) {
        video = results[0]
        poster = results[1]
      } else {
        video = results[1]
        poster = results[0]
      }

      params.url = video.url
      params.urlNode = video.node
      params.poster = poster.url
      params.posterNode = poster.node
    }

    window.postMessage({ funcName: `${type}UrlReceiver`, params }, '*')
  } catch (e) {
    /* eslint require-atomic-updates: */
    if (axios.isCancel(e)) {
      uf.status = 'CANCEL'
    } else {
      uf.status = 'ERROR'

      let message = e.message || '网络异常导致上传失败'
      if (e.response && e.response.data) {
        message = e.response.data.message
        if (Array.isArray(message)) {
          message = message[0]
        }

        message = message || '服务异常导致上传失败'
      }

      window.postMessage(
        {
          funcName: `${type}FailedReceiver`,
          params: { id, error: message },
        },
        '*',
      )
    }
  }
}

function handleRemove(type: string, params: any) {
  const status: string = params.status
  if (status !== 'UPLOADING') {
    return
  }

  const uf = uploadFiles.get(params.id)
  if (uf && uf.useCounter > 0) {
    uf.useCounter -= 1
    if (uf.useCounter === 0 && uf.status === 'UPLOADING') {
      uf.cancelUpload!()
    }
  }
}

function handleReinsert(type: string, params: any) {
  const status: string = params.status
  if (status !== 'UPLOADING') {
    return
  }

  const uf = uploadFiles.get(params.id)
  if (uf) {
    uf.useCounter += 1
    if (uf.useCounter === 1 && uf.status === 'CANCEL') {
      handleUpload(type, params.id)
    }
  }
}

function handleReupload(type: string, params: any) {
  handleUpload(type, params.id)
}
