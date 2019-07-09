export function callMethod(fnName, params) {
  if (window.launcher) {
    // in Android
    if (params) window.launcher[fnName](JSON.stringify(params))
    else window.launcher[fnName]()
  } else if (window.webkit) {
    // in IOS
    window.webkit.messageHandlers.MobilePhoneCall.postMessage({ funcName: fnName, params })
  } else if (window.top) {
    // in iframe
    window.top.postMessage({ funcName: fnName, params })
  } else {
    // not in webview
    return false
  }
  return true
}
