var h$ffi_emscripten=function(t){var n={};function r(e){if(n[e])return n[e].exports;var o=n[e]={i:e,l:!1,exports:{}};return t[e].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=n,r.d=function(t,n,e){r.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:e})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,n){if(1&n&&(t=r(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(r.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)r.d(e,o,function(n){return t[n]}.bind(null,o));return e},r.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(n,"a",n),n},r.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},r.p="",r(r.s=0)}([function(t,n,r){"use strict";r.r(n),function(t){r.d(n,"Ret",(function(){return o})),r.d(n,"Arg",(function(){return i})),r.d(n,"wrap",(function(){return f})),r.d(n,"setGlobal",(function(){return u}));const e=r(2),{Ret:o,Arg:i,wrap:f}=e;function u(n,r){t[n]=r}}.call(this,r(1))},function(t,n){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(t){"object"==typeof window&&(r=window)}t.exports=r},function(t,n,r){"use strict";var e,o;function i(t,n){if(void 0===t.u8)throw"Undefined buf";if(0!==n)throw"Unexpected off";return{buf:t,off:n}}function f(t){for(;;){var n=t.pre.shift();if(void 0===n)break;n()}}function u(t){for(;;){var n=t.post.shift();if(void 0===n)break;n()}}function c(t,n){t.clean.unshift(n)}function a(t){for(;;)try{var n=t.clean.shift();if(void 0===n)break;n()}catch(t){}}function s(t,n,r){for(var o=[],f=function(f){var u=n.args[f];if(u&e.VAL)o.push(r.shift());else if(u&e.I64){var a=r.shift(),s=r.shift();o.push(s),o.push(a)}else if(u&e.PNUL){if(null!==r.shift())throw"null pointer was expected";r.shift();o.push(0)}else{if(!(u&(e.BUFR|e.BUFW|e.BUFZ)))throw"Unhandled Arg";var d=r.shift(),l=r.shift();if(null===d)o.push(0);else{i(d,l);var h=d.u8.byteLength,p=n.mod._malloc(h);c(t,(function(){n.mod._free(p)})),u&e.BUFR&&function(t,n){t.pre.push(n)}(t,(function(){new Uint8Array(n.mod.HEAPU8.buffer,p,h).set(d.u8)})),u&e.BUFW&&function(t,n){t.post.push(n)}(t,(function(){var t=new Uint8Array(n.mod.HEAPU8.buffer,p,h);d.u8.set(t)})),u&e.BUFZ&&c(t,(function(){n.mod.HEAPU8.fill(0,p,p+h)})),o.push(p)}}},u=0;u<n.args.length;u++)f(u);if(0!==r.length)throw"Unhandled args remain";return o}n.__esModule=!0,n.wrap=n.mkGhcjsPtr=n.Ret=n.Arg=void 0,function(t){t[t.VAL=1]="VAL",t[t.I64=2]="I64",t[t.BUFR=4]="BUFR",t[t.BUFW=8]="BUFW",t[t.BUFZ=16]="BUFZ",t[t.PNUL=32]="PNUL"}(e=n.Arg||(n.Arg={})),function(t){t[t.VOID=1]="VOID",t[t.VAL=2]="VAL",t[t.I64=4]="I64",t[t.STR=8]="STR"}(o=n.Ret||(n.Ret={})),n.mkGhcjsPtr=i,n.wrap=function(t){!function(t){if(void 0===t.fun)throw"Undefined fun";if(void 0===t.ret)throw"Undefined ret";if(void 0===t.mod)throw"Undefined mod";if(void 0===t.args)throw"Undefined args"}(t);var n=function(t){switch(t.ret){case o.VOID:return function(t,n){};case o.VAL:return function(t,n){return n};case o.I64:return function(n,r){var e=t.mod.getTempRet0();return h$ret1=r,e};case o.STR:return function(n,r){var e=new Uint8Array(t.mod.HEAPU8.buffer,r).indexOf(0);if(e<0)throw"C string is not NUL terminated!";var o=e+1,i=new Uint8Array(t.mod.HEAPU8.buffer,r,o),f=h$newByteArray(o);return f.u8.set(i),h$ret1=0,f};default:throw"Unhandled Ret"}}(t);return function(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];var o,i={pre:[],post:[],clean:[]},c=s(i,t,r);try{f(i);var d=t.fun.apply(null,c);o=n(i,d)}catch(t){throw a(i),t}try{u(i)}finally{a(i)}return o}}}]);