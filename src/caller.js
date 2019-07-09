export function callMethod(fnName, params) {
  if (window.launcher) {
    // in Android
    if (params) window.launcher[fnName](params)
    else window.launcher[fnName]()
  } else if (window.webkit) {
    // in IOS
    window.webkit.messageHandlers.MobilePhoneCall.postMessage({ funcName: fnName, value: params })
  } else {
    // not in webview
    return false
  }
  return true
}
