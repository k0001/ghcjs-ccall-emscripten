var h$ffi_emscripten=function(n){var t={};function r(e){if(t[e])return t[e].exports;var o=t[e]={i:e,l:!1,exports:{}};return n[e].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=n,r.c=t,r.d=function(n,t,e){r.o(n,t)||Object.defineProperty(n,t,{enumerable:!0,get:e})},r.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},r.t=function(n,t){if(1&t&&(n=r(n)),8&t)return n;if(4&t&&"object"==typeof n&&n&&n.__esModule)return n;var e=Object.create(null);if(r.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:n}),2&t&&"string"!=typeof n)for(var o in n)r.d(e,o,function(t){return n[t]}.bind(null,o));return e},r.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return r.d(t,"a",t),t},r.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},r.p="",r(r.s=0)}([function(n,t,r){"use strict";r.r(t),function(n){r.d(t,"Ret",(function(){return o})),r.d(t,"Arg",(function(){return i})),r.d(t,"wrap",(function(){return f})),r.d(t,"setGlobal",(function(){return u}));const e=r(2),{Ret:o,Arg:i,wrap:f}=e;function u(t,r){n[t]=r}}.call(this,r(1))},function(n,t){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(n){"object"==typeof window&&(r=window)}n.exports=r},function(n,t,r){"use strict";var e,o;function i(n,t){if(void 0===n.u8)throw"Undefined buf";if(0!==t)throw"Unexpected off";return{buf:n,off:t}}function f(n){for(;;){var t=n.pre.shift();if(void 0===t)break;t()}}function u(n){for(;;){var t=n.post.shift();if(void 0===t)break;t()}}function c(n,t){n.clean.unshift(t)}function a(n){for(;;)try{var t=n.clean.shift();if(void 0===t)break;t()}catch(n){}}function d(n,t,r){for(var o=[],f=function(f){var u=t.args[f];if(u&e.VAL)o.push(r.shift());else if(u&e.I64){var a=r.shift(),d=r.shift();o.push(d),o.push(a)}else{if(!(u&(e.BUFR|e.BUFW|e.BUFZ)))throw"Unhandled Arg";var s=r.shift(),l=r.shift(),h=(i(s,l),s.u8.byteLength),p=t.mod._malloc(h);c(n,(function(){t.mod._free(p)})),u&e.BUFR&&function(n,t){n.pre.push(t)}(n,(function(){new Uint8Array(t.mod.HEAPU8.buffer,p,h).set(s.u8)})),u&e.BUFW&&function(n,t){n.post.push(t)}(n,(function(){var n=new Uint8Array(t.mod.HEAPU8.buffer,p,h);s.u8.set(n)})),u&e.BUFZ&&c(n,(function(){t.mod.HEAPU8.fill(0,p,p+h)})),o.push(p)}},u=0;u<t.args.length;u++)f(u);if(0!==r.length)throw"Unhandled args remain";return o}t.__esModule=!0,t.wrap=t.mkGhcjsPtr=t.Ret=t.Arg=void 0,function(n){n[n.VAL=1]="VAL",n[n.I64=2]="I64",n[n.BUFR=4]="BUFR",n[n.BUFW=8]="BUFW",n[n.BUFZ=16]="BUFZ"}(e=t.Arg||(t.Arg={})),function(n){n[n.VOID=1]="VOID",n[n.VAL=2]="VAL",n[n.I64=4]="I64",n[n.STR=8]="STR"}(o=t.Ret||(t.Ret={})),t.mkGhcjsPtr=i,t.wrap=function(n){!function(n){if(void 0===n.fun)throw"Undefined fun";if(void 0===n.ret)throw"Undefined ret";if(void 0===n.mod)throw"Undefined mod";if(void 0===n.args)throw"Undefined args"}(n);var t=function(n){switch(n.ret){case o.VOID:return function(n,t){};case o.VAL:return function(n,t){return t};case o.I64:return function(t,r){var e=n.mod.getTempRet0();return h$ret1=r,e};case o.STR:return function(t,r){var e=new Uint8Array(n.mod.HEAPU8.buffer,r).indexOf(0);if(e<0)throw"C string is not NUL terminated!";var o=e+1,i=new Uint8Array(n.mod.HEAPU8.buffer,r,o),f=h$newByteArray(o);return f.u8.set(i),h$ret1=0,f};default:throw"Unhandled Ret"}}(n);return function(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];var o,i={pre:[],post:[],clean:[]},c=d(i,n,r);try{f(i);var s=n.fun.apply(null,c);o=t(i,s)}catch(n){throw a(i),n}try{u(i)}finally{a(i)}return o}}}]);