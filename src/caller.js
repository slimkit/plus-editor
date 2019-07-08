export function callMethod(fnName, params) {
  if (window.launcher) {
    // in Android
    window.launcher[fnName](params)
  } else if (window.webkit) {
    // in IOS
    window.webkit.messageHandlers.MobilePhoneCall.postMessage({ funcName: fnName, value: params })
  } else {
    // not in webview
    return false
  }
  return true
}
