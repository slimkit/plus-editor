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
    if (params) window.launcher[fnName](JSON.stringify(params))
    else window.launcher[fnName]()
  } else if (window.messageHandlers) {
    // in IOS
    if (params) window.messageHandlers[fnName](JSON.stringify(params))
    else window.messageHandlers[fnName]()
  } else if (window.top) {
    // in iframe
    window.top.postMessage({ funcName: fnName, params }, '*')
  } else {
    // not in webview
    return false
  }
  return true
}
