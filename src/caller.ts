import { tryHijackUploadCall } from './uploader'

/**
 * 调用客户端函数的方法
 *
 * @param fnName 调用的方法名
 * @param params 调用方法传参
 */
export function callMethod(fnName: string, params: any = undefined) {
  if (window.debug) {
    console.log('debug callMethod', fnName, params) // eslint-disable-line no-console
  }

  if (window.launcher) {
    // in Android
    if (typeof window.launcher[fnName] === 'function') {
      if (params) {
        window.launcher[fnName](JSON.stringify(params))
      } else {
        window.launcher[fnName]()
      }
    }
  } else if (window.webkit && window.webkit.messageHandlers) {
    // in IOS
    window.webkit.messageHandlers.MobilePhoneCall.postMessage({ funcName: fnName, params })
  } else if (window.self != window.parent) {
    // in iframe
    if (!tryHijackUploadCall(fnName, params)) {
      window.parent.postMessage({ funcName: fnName, params }, '*')
    }
  } else {
    tryHijackUploadCall(fnName, params)
    // not in webview
    return false
  }
  return true
}

enum FuncName {
  setUploaderOptions = 'setUploaderOptions',
  setContentReceiver = 'setContentReceiver',
  imagePreviewReceiver = 'imagePreviewReceiver',
  imageProgressReceiver = 'imageProgressReceiver',
  imageUrlReceiver = 'imageUrlReceiver',
  imageFailedReceiver = 'imageFailedReceiver',
  videoPreviewReceiver = 'videoPreviewReceiver',
  videoProgressReceiver = 'videoProgressReceiver',
  videoUrlReceiver = 'videoUrlReceiver',
  videoFailedReceiver = 'videoFailedReceiver',
  editorSubmitReceiver = 'editorSubmitReceiver',
  changePlaceholder = 'changePlaceholder',
  pageHiddenReceiver = 'pageHiddenReceiver',
}

const postMessage = window.postMessage
window.postMessage = function(
  message: any,
  targetOrigin: string = '*',
  transfer?: Transferable[],
): void {
  postMessage(message, targetOrigin, transfer)
}

window.addEventListener('message', (e: MessageEvent) => {
  const funcName: FuncName = (e.data || {}).funcName

  if (funcName && typeof window[funcName] === 'function') {
    const params = (e.data || {}).params || undefined
    window[funcName](params && JSON.stringify(params))
  }
})
