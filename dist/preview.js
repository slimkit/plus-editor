!function(e){var n=window.webpackHotUpdate;window.webpackHotUpdate=function(e,t){!function(e,n){if(!y[e]||!_[e])return;for(var t in _[e]=!1,n)Object.prototype.hasOwnProperty.call(n,t)&&(h[t]=n[t]);0==--f&&0===B&&G()}(e,t),n&&n(e,t)};var t,r=!0,i="d9d67440b8d1dca884d5",d=1e4,o={},a=[],c=[];function l(e){var n=C[e];if(!n)return Z;var r=function(r){return n.hot.active?(C[r]?-1===C[r].parents.indexOf(e)&&C[r].parents.push(e):(a=[e],t=r),-1===n.children.indexOf(r)&&n.children.push(r)):(console.warn("[HMR] unexpected require("+r+") from disposed module "+e),a=[]),Z(r)},i=function(e){return{configurable:!0,enumerable:!0,get:function(){return Z[e]},set:function(n){Z[e]=n}}};for(var d in Z)Object.prototype.hasOwnProperty.call(Z,d)&&"e"!==d&&"t"!==d&&Object.defineProperty(r,d,i(d));return r.e=function(e){return"ready"===s&&g("prepare"),B++,Z.e(e).then(n,(function(e){throw n(),e}));function n(){B--,"prepare"===s&&(m[e]||w(e),0===B&&0===f&&G())}},r.t=function(e,n){return 1&n&&(e=r(e)),Z.t(e,-2&n)},r}function u(e){var n={_acceptedDependencies:{},_declinedDependencies:{},_selfAccepted:!1,_selfDeclined:!1,_disposeHandlers:[],_main:t!==e,active:!0,accept:function(e,t){if(void 0===e)n._selfAccepted=!0;else if("function"==typeof e)n._selfAccepted=e;else if("object"==typeof e)for(var r=0;r<e.length;r++)n._acceptedDependencies[e[r]]=t||function(){};else n._acceptedDependencies[e]=t||function(){}},decline:function(e){if(void 0===e)n._selfDeclined=!0;else if("object"==typeof e)for(var t=0;t<e.length;t++)n._declinedDependencies[e[t]]=!0;else n._declinedDependencies[e]=!0},dispose:function(e){n._disposeHandlers.push(e)},addDisposeHandler:function(e){n._disposeHandlers.push(e)},removeDisposeHandler:function(e){var t=n._disposeHandlers.indexOf(e);t>=0&&n._disposeHandlers.splice(t,1)},check:Q,apply:v,status:function(e){if(!e)return s;p.push(e)},addStatusHandler:function(e){p.push(e)},removeStatusHandler:function(e){var n=p.indexOf(e);n>=0&&p.splice(n,1)},data:o[e]};return t=void 0,n}var p=[],s="idle";function g(e){s=e;for(var n=0;n<p.length;n++)p[n].call(null,e)}var b,h,I,f=0,B=0,m={},_={},y={};function W(e){return+e+""===e?+e:e}function Q(e){if("idle"!==s)throw new Error("check() is only allowed in idle status");return r=e,g("check"),(n=d,n=n||1e4,new Promise((function(e,t){if("undefined"==typeof XMLHttpRequest)return t(new Error("No browser support"));try{var r=new XMLHttpRequest,d=Z.p+""+i+".hot-update.json";r.open("GET",d,!0),r.timeout=n,r.send(null)}catch(e){return t(e)}r.onreadystatechange=function(){if(4===r.readyState)if(0===r.status)t(new Error("Manifest request to "+d+" timed out."));else if(404===r.status)e();else if(200!==r.status&&304!==r.status)t(new Error("Manifest request to "+d+" failed."));else{try{var n=JSON.parse(r.responseText)}catch(e){return void t(e)}e(n)}}}))).then((function(e){if(!e)return g("idle"),null;_={},m={},y=e.c,I=e.h,g("prepare");var n=new Promise((function(e,n){b={resolve:e,reject:n}}));h={};return w(1),"prepare"===s&&0===B&&0===f&&G(),n}));var n}function w(e){y[e]?(_[e]=!0,f++,function(e){var n=document.createElement("script");n.charset="utf-8",n.src=Z.p+""+e+"."+i+".hot-update.js",document.head.appendChild(n)}(e)):m[e]=!0}function G(){g("ready");var e=b;if(b=null,e)if(r)Promise.resolve().then((function(){return v(r)})).then((function(n){e.resolve(n)}),(function(n){e.reject(n)}));else{var n=[];for(var t in h)Object.prototype.hasOwnProperty.call(h,t)&&n.push(W(t));e.resolve(n)}}function v(n){if("ready"!==s)throw new Error("apply() is only allowed in ready status");var t,r,d,c,l;function u(e){for(var n=[e],t={},r=n.map((function(e){return{chain:[e],id:e}}));r.length>0;){var i=r.pop(),d=i.id,o=i.chain;if((c=C[d])&&!c.hot._selfAccepted){if(c.hot._selfDeclined)return{type:"self-declined",chain:o,moduleId:d};if(c.hot._main)return{type:"unaccepted",chain:o,moduleId:d};for(var a=0;a<c.parents.length;a++){var l=c.parents[a],u=C[l];if(u){if(u.hot._declinedDependencies[d])return{type:"declined",chain:o.concat([l]),moduleId:d,parentId:l};-1===n.indexOf(l)&&(u.hot._acceptedDependencies[d]?(t[l]||(t[l]=[]),p(t[l],[d])):(delete t[l],n.push(l),r.push({chain:o.concat([l]),id:l})))}}}}return{type:"accepted",moduleId:e,outdatedModules:n,outdatedDependencies:t}}function p(e,n){for(var t=0;t<n.length;t++){var r=n[t];-1===e.indexOf(r)&&e.push(r)}}n=n||{};var b={},f=[],B={},m=function(){console.warn("[HMR] unexpected require("+Q.moduleId+") to disposed module")};for(var _ in h)if(Object.prototype.hasOwnProperty.call(h,_)){var Q;l=W(_);var w=!1,G=!1,v=!1,A="";switch((Q=h[_]?u(l):{type:"disposed",moduleId:_}).chain&&(A="\nUpdate propagation: "+Q.chain.join(" -> ")),Q.type){case"self-declined":n.onDeclined&&n.onDeclined(Q),n.ignoreDeclined||(w=new Error("Aborted because of self decline: "+Q.moduleId+A));break;case"declined":n.onDeclined&&n.onDeclined(Q),n.ignoreDeclined||(w=new Error("Aborted because of declined dependency: "+Q.moduleId+" in "+Q.parentId+A));break;case"unaccepted":n.onUnaccepted&&n.onUnaccepted(Q),n.ignoreUnaccepted||(w=new Error("Aborted because "+l+" is not accepted"+A));break;case"accepted":n.onAccepted&&n.onAccepted(Q),G=!0;break;case"disposed":n.onDisposed&&n.onDisposed(Q),v=!0;break;default:throw new Error("Unexception type "+Q.type)}if(w)return g("abort"),Promise.reject(w);if(G)for(l in B[l]=h[l],p(f,Q.outdatedModules),Q.outdatedDependencies)Object.prototype.hasOwnProperty.call(Q.outdatedDependencies,l)&&(b[l]||(b[l]=[]),p(b[l],Q.outdatedDependencies[l]));v&&(p(f,[Q.moduleId]),B[l]=m)}var V,F=[];for(r=0;r<f.length;r++)l=f[r],C[l]&&C[l].hot._selfAccepted&&B[l]!==m&&F.push({module:l,errorHandler:C[l].hot._selfAccepted});g("dispose"),Object.keys(y).forEach((function(e){!1===y[e]&&function(e){delete installedChunks[e]}(e)}));for(var U,X,O=f.slice();O.length>0;)if(l=O.pop(),c=C[l]){var x={},H=c.hot._disposeHandlers;for(d=0;d<H.length;d++)(t=H[d])(x);for(o[l]=x,c.hot.active=!1,delete C[l],delete b[l],d=0;d<c.children.length;d++){var R=C[c.children[d]];R&&((V=R.parents.indexOf(l))>=0&&R.parents.splice(V,1))}}for(l in b)if(Object.prototype.hasOwnProperty.call(b,l)&&(c=C[l]))for(X=b[l],d=0;d<X.length;d++)U=X[d],(V=c.children.indexOf(U))>=0&&c.children.splice(V,1);for(l in g("apply"),i=I,B)Object.prototype.hasOwnProperty.call(B,l)&&(e[l]=B[l]);var D=null;for(l in b)if(Object.prototype.hasOwnProperty.call(b,l)&&(c=C[l])){X=b[l];var k=[];for(r=0;r<X.length;r++)if(U=X[r],t=c.hot._acceptedDependencies[U]){if(-1!==k.indexOf(t))continue;k.push(t)}for(r=0;r<k.length;r++){t=k[r];try{t(X)}catch(e){n.onErrored&&n.onErrored({type:"accept-errored",moduleId:l,dependencyId:X[r],error:e}),n.ignoreErrored||D||(D=e)}}}for(r=0;r<F.length;r++){var E=F[r];l=E.module,a=[l];try{Z(l)}catch(e){if("function"==typeof E.errorHandler)try{E.errorHandler(e)}catch(t){n.onErrored&&n.onErrored({type:"self-accept-error-handler-errored",moduleId:l,error:t,originalError:e}),n.ignoreErrored||D||(D=t),D||(D=e)}else n.onErrored&&n.onErrored({type:"self-accept-errored",moduleId:l,error:e}),n.ignoreErrored||D||(D=e)}}return D?(g("fail"),Promise.reject(D)):(g("idle"),new Promise((function(e){e(f)})))}var C={};function Z(n){if(C[n])return C[n].exports;var t=C[n]={i:n,l:!1,exports:{},hot:u(n),parents:(c=a,a=[],c),children:[]};return e[n].call(t.exports,t,t.exports,l(n)),t.l=!0,t.exports}Z.m=e,Z.c=C,Z.d=function(e,n,t){Z.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},Z.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},Z.t=function(e,n){if(1&n&&(e=Z(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(Z.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)Z.d(t,r,function(n){return e[n]}.bind(null,r));return t},Z.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return Z.d(n,"a",n),n},Z.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},Z.p="",Z.h=function(){return i},l(10)(Z.s=10)}([,function(module,__webpack_exports__,__webpack_require__){"use strict";eval("/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return callMethod; });\n/**\n * 调用客户端函数的方法\n *\n * @param fnName 调用的方法名\n * @param params 调用方法传参\n */\nfunction callMethod(fnName, params) {\n    if (params === void 0) { params = undefined; }\n    if (window.debug) {\n        console.log('debug callMethod', fnName, params); // eslint-disable-line no-console\n    }\n    if (window.launcher) {\n        // in Android\n        if (params)\n            window.launcher[fnName](JSON.stringify(params));\n        else\n            window.launcher[fnName]();\n    }\n    else if (window.webkit) {\n        // in IOS\n        if (params)\n            JSON.stringify(params);\n        window.webkit.messageHandlers.MobilePhoneCall.postMessage({ funcName: fnName, params: params });\n    }\n    else if (window.top) {\n        // in iframe\n        window.top.postMessage({ funcName: fnName, params: params }, '*');\n    }\n    else {\n        // not in webview\n        return false;\n    }\n    return true;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jYWxsZXIudHM/ZDU2ZCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIOiwg+eUqOWuouaIt+err+WHveaVsOeahOaWueazlVxuICpcbiAqIEBwYXJhbSBmbk5hbWUg6LCD55So55qE5pa55rOV5ZCNXG4gKiBAcGFyYW0gcGFyYW1zIOiwg+eUqOaWueazleS8oOWPglxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FsbE1ldGhvZChmbk5hbWU6IHN0cmluZywgcGFyYW1zOiBhbnkgPSB1bmRlZmluZWQpIHtcbiAgaWYgKHdpbmRvdy5kZWJ1Zykge1xuICAgIGNvbnNvbGUubG9nKCdkZWJ1ZyBjYWxsTWV0aG9kJywgZm5OYW1lLCBwYXJhbXMpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICB9XG4gIGlmICh3aW5kb3cubGF1bmNoZXIpIHtcbiAgICAvLyBpbiBBbmRyb2lkXG4gICAgaWYgKHBhcmFtcykgd2luZG93LmxhdW5jaGVyW2ZuTmFtZV0oSlNPTi5zdHJpbmdpZnkocGFyYW1zKSlcbiAgICBlbHNlIHdpbmRvdy5sYXVuY2hlcltmbk5hbWVdKClcbiAgfSBlbHNlIGlmICh3aW5kb3cud2Via2l0KSB7XG4gICAgLy8gaW4gSU9TXG4gICAgaWYgKHBhcmFtcykgSlNPTi5zdHJpbmdpZnkocGFyYW1zKVxuICAgIHdpbmRvdy53ZWJraXQubWVzc2FnZUhhbmRsZXJzLk1vYmlsZVBob25lQ2FsbC5wb3N0TWVzc2FnZSh7IGZ1bmNOYW1lOiBmbk5hbWUsIHBhcmFtcyB9KVxuICB9IGVsc2UgaWYgKHdpbmRvdy50b3ApIHtcbiAgICAvLyBpbiBpZnJhbWVcbiAgICB3aW5kb3cudG9wLnBvc3RNZXNzYWdlKHsgZnVuY05hbWU6IGZuTmFtZSwgcGFyYW1zIH0sICcqJylcbiAgfSBlbHNlIHtcbiAgICAvLyBub3QgaW4gd2Vidmlld1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiB0cnVlXG59XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7Ozs7O0FBS0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7O0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///1\n")},function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9xdWlsbC9hc3NldHMvc25vdy5zdHlsPzQ2MTkiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIl0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///2\n")},function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9wcmV2aWV3LnN0eWw/MWQxMyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///3\n")},,,,,,,function(module,__webpack_exports__,__webpack_require__){"use strict";eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var quill_assets_snow_styl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);\n/* harmony import */ var quill_assets_snow_styl__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(quill_assets_snow_styl__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _preview_styl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);\n/* harmony import */ var _preview_styl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_preview_styl__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _caller__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1);\n\n\n\nfunction computer() {\n    var imgArr = Array.from(document.querySelectorAll('img[data-width]'));\n    imgArr.forEach(function (element) {\n        var width = +element.getAttribute('data-width');\n        var height = +element.getAttribute('data-height');\n        var newWidth = 0;\n        var newHeight = 0;\n        var el = document.querySelector('.ql-editor');\n        if (width > el.clientWidth) {\n            newWidth = el.clientWidth;\n            newHeight = height * (el.clientWidth / width);\n        }\n        else {\n            newWidth = width;\n            newHeight = height;\n        }\n        window.alert(newWidth);\n        element.setAttribute('style', \"width:\" + newWidth + \"px;height:\" + newHeight + \"px\");\n    });\n}\nfunction videoComputer() {\n    var videoArr = Array.from(document.querySelectorAll('.quill-video'));\n    videoArr.forEach(function (element) {\n        var width = +element.getAttribute('data-width');\n        var height = +element.getAttribute('data-height');\n        var newWidth = 0;\n        var newHeight = 0;\n        var el = document.querySelector('.ql-editor');\n        // 视频宽度大于预览区域宽度\n        // if (width > el.clientWidth) {\n        newWidth = el.clientWidth;\n        newHeight = newWidth < height ? newWidth : height;\n        // } else {\n        //   newWidth = width\n        //   newHeight = height\n        // }\n        element.setAttribute('width', newWidth + \"px\");\n        element.setAttribute('height', newHeight + \"px\");\n    });\n}\n;\n(function () {\n    var imgList = document.querySelectorAll('img');\n    var arr = [];\n    Array.prototype.map.call(imgList, function (item, index) {\n        arr.push({\n            src: item.src,\n            width: item.dataset.width ? item.dataset.width : 0,\n            height: item.dataset.height ? item.dataset.height : 0,\n        });\n        item.onclick = function () {\n            Object(_caller__WEBPACK_IMPORTED_MODULE_2__[/* callMethod */ \"a\"])('clickImage', { src: item.src, arr: arr, index: index });\n        };\n    });\n})();\ncomputer();\nalert('init');\nvideoComputer();\nwindow.addEventListener('resize', function () {\n    computer();\n    videoComputer();\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTAuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvcHJldmlldy50cz9lMDQ0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAncXVpbGwvYXNzZXRzL3Nub3cuc3R5bCdcbmltcG9ydCAnLi9wcmV2aWV3LnN0eWwnXG5pbXBvcnQgeyBjYWxsTWV0aG9kIH0gZnJvbSAnLi9jYWxsZXInXG5mdW5jdGlvbiBjb21wdXRlcigpIHtcbiAgY29uc3QgaW1nQXJyID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWdbZGF0YS13aWR0aF0nKSlcbiAgaW1nQXJyLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgY29uc3Qgd2lkdGggPSArZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtd2lkdGgnKSFcbiAgICBjb25zdCBoZWlnaHQgPSArZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaGVpZ2h0JykhXG4gICAgbGV0IG5ld1dpZHRoOiBudW1iZXIgPSAwXG4gICAgbGV0IG5ld0hlaWdodDogbnVtYmVyID0gMFxuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnFsLWVkaXRvcicpIVxuICAgIGlmICh3aWR0aCA+IGVsLmNsaWVudFdpZHRoKSB7XG4gICAgICBuZXdXaWR0aCA9IGVsLmNsaWVudFdpZHRoXG4gICAgICBuZXdIZWlnaHQgPSBoZWlnaHQgKiAoZWwuY2xpZW50V2lkdGggLyB3aWR0aClcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3V2lkdGggPSB3aWR0aFxuICAgICAgbmV3SGVpZ2h0ID0gaGVpZ2h0XG4gICAgfVxuICAgIHdpbmRvdy5hbGVydChuZXdXaWR0aClcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgd2lkdGg6JHtuZXdXaWR0aH1weDtoZWlnaHQ6JHtuZXdIZWlnaHR9cHhgKVxuICB9KVxufVxuZnVuY3Rpb24gdmlkZW9Db21wdXRlcigpIHtcbiAgY29uc3QgdmlkZW9BcnIgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5xdWlsbC12aWRlbycpKVxuICB2aWRlb0Fyci5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHdpZHRoID0gK2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXdpZHRoJykhXG4gICAgY29uc3QgaGVpZ2h0ID0gK2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWhlaWdodCcpIVxuICAgIGxldCBuZXdXaWR0aDogbnVtYmVyID0gMFxuICAgIGxldCBuZXdIZWlnaHQ6IG51bWJlciA9IDBcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5xbC1lZGl0b3InKSFcbiAgICAvLyDop4bpopHlrr3luqblpKfkuo7pooTop4jljLrln5/lrr3luqZcbiAgICAvLyBpZiAod2lkdGggPiBlbC5jbGllbnRXaWR0aCkge1xuICAgIG5ld1dpZHRoID0gZWwuY2xpZW50V2lkdGhcbiAgICBuZXdIZWlnaHQgPSBuZXdXaWR0aCA8IGhlaWdodCA/IG5ld1dpZHRoIDogaGVpZ2h0XG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgIG5ld1dpZHRoID0gd2lkdGhcbiAgICAvLyAgIG5ld0hlaWdodCA9IGhlaWdodFxuICAgIC8vIH1cbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBgJHtuZXdXaWR0aH1weGApXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGAke25ld0hlaWdodH1weGApXG4gIH0pXG59XG5cbjsoZnVuY3Rpb24oKSB7XG4gIGNvbnN0IGltZ0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWcnKVxuICBjb25zdCBhcnI6IEFycmF5PG9iamVjdD4gPSBbXVxuICBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoaW1nTGlzdCwgKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgYXJyLnB1c2goe1xuICAgICAgc3JjOiBpdGVtLnNyYyxcbiAgICAgIHdpZHRoOiBpdGVtLmRhdGFzZXQud2lkdGggPyBpdGVtLmRhdGFzZXQud2lkdGggOiAwLFxuICAgICAgaGVpZ2h0OiBpdGVtLmRhdGFzZXQuaGVpZ2h0ID8gaXRlbS5kYXRhc2V0LmhlaWdodCA6IDAsXG4gICAgfSlcbiAgICBpdGVtLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBjYWxsTWV0aG9kKCdjbGlja0ltYWdlJywgeyBzcmM6IGl0ZW0uc3JjLCBhcnI6IGFyciwgaW5kZXg6IGluZGV4IH0pXG4gICAgfVxuICB9KVxufSkoKVxuY29tcHV0ZXIoKVxuYWxlcnQoJ2luaXQnKVxudmlkZW9Db21wdXRlcigpXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICBjb21wdXRlcigpXG4gIHZpZGVvQ29tcHV0ZXIoKVxufSlcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///10\n")}]);