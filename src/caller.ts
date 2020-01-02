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
      let id: string | null = null
      try {
        id = new URL(window.location.href).searchParams.get('id')
      } catch (err) {
        //
      }
      window.parent.postMessage({ funcName: fnName, params, id }, '*')
    }
  } else {
    // not in webview
    // tryHijackUploadCall(fnName, params)
    return false
  }

  return true
}

type FuncName =
  | 'setUploaderOptions'
  | 'setContentReceiver'
  | 'imagePreviewReceiver'
  | 'imageProgressReceiver'
  | 'imageUrlReceiver'
  | 'imageFailedReceiver'
  | 'videoPreviewReceiver'
  | 'videoProgressReceiver'
  | 'videoUrlReceiver'
  | 'videoFailedReceiver'
  | 'editorSubmitReceiver'
  | 'changePlaceholder'
  | 'changePlaceholder'
  | 'pageHiddenReceiver'

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
    let params = (e.data || {}).params
    if (!['changePlaceholder', 'setContentReceiver'].includes(funcName)) {
      params = params && JSON.stringify(params)
    }
    window[funcName](params)
  }
})
