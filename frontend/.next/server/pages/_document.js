"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_document";
exports.ids = ["pages/_document"];
exports.modules = {

/***/ "./pages/_document.tsx":
/*!*****************************!*\
  !*** ./pages/_document.tsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Document)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/document */ \"./node_modules/next/document.js\");\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_document__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst themeScript = `\n  (() => {\n    try {\n      const stored = localStorage.getItem(\"theme\");\n      const prefersDark = window.matchMedia(\"(prefers-color-scheme: dark)\").matches;\n      document.documentElement.classList.toggle(\"dark\", stored ? stored === \"dark\" : prefersDark);\n    } catch (_) {}\n  })();\n`;\nfunction Document() {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.Html, {\n        lang: \"en\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.Head, {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"script\", {\n                        dangerouslySetInnerHTML: {\n                            __html: themeScript\n                        }\n                    }, void 0, false, {\n                        fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n                        lineNumber: 18,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"manifest\",\n                        href: \"/manifest.json\"\n                    }, void 0, false, {\n                        fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n                        lineNumber: 21,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"application-name\",\n                        content: \"AutoFix Kenya\"\n                    }, void 0, false, {\n                        fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n                        lineNumber: 22,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"apple-mobile-web-app-capable\",\n                        content: \"yes\"\n                    }, void 0, false, {\n                        fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n                        lineNumber: 23,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"apple-mobile-web-app-status-bar-style\",\n                        content: \"default\"\n                    }, void 0, false, {\n                        fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n                        lineNumber: 24,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"apple-mobile-web-app-title\",\n                        content: \"AutoFix Kenya\"\n                    }, void 0, false, {\n                        fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n                        lineNumber: 25,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"mobile-web-app-capable\",\n                        content: \"yes\"\n                    }, void 0, false, {\n                        fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n                        lineNumber: 26,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"theme-color\",\n                        content: \"#0F2A4A\"\n                    }, void 0, false, {\n                        fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n                        lineNumber: 27,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"icon\",\n                        href: \"/logo.png\"\n                    }, void 0, false, {\n                        fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n                        lineNumber: 30,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"apple-touch-icon\",\n                        sizes: \"180x180\",\n                        href: \"/logo.png\"\n                    }, void 0, false, {\n                        fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n                        lineNumber: 31,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"preconnect\",\n                        href: \"https://fonts.googleapis.com\"\n                    }, void 0, false, {\n                        fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n                        lineNumber: 34,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"preconnect\",\n                        href: \"https://fonts.gstatic.com\",\n                        crossOrigin: \"anonymous\"\n                    }, void 0, false, {\n                        fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n                        lineNumber: 35,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n                lineNumber: 16,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"body\", {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.Main, {}, void 0, false, {\n                        fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n                        lineNumber: 38,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.NextScript, {}, void 0, false, {\n                        fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n                        lineNumber: 39,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n                lineNumber: 37,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/home/phil/projects/autoshop/frontend/pages/_document.tsx\",\n        lineNumber: 15,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fZG9jdW1lbnQudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUE2RDtBQUU3RCxNQUFNSSxjQUFjLENBQUM7Ozs7Ozs7O0FBUXJCLENBQUM7QUFFYyxTQUFTQztJQUN0QixxQkFDRSw4REFBQ0wsK0NBQUlBO1FBQUNNLE1BQUs7OzBCQUNULDhEQUFDTCwrQ0FBSUE7O2tDQUVILDhEQUFDTTt3QkFBT0MseUJBQXlCOzRCQUFFQyxRQUFRTDt3QkFBWTs7Ozs7O2tDQUd2RCw4REFBQ007d0JBQUtDLEtBQUk7d0JBQVdDLE1BQUs7Ozs7OztrQ0FDMUIsOERBQUNDO3dCQUFLQyxNQUFLO3dCQUFtQkMsU0FBUTs7Ozs7O2tDQUN0Qyw4REFBQ0Y7d0JBQUtDLE1BQUs7d0JBQStCQyxTQUFROzs7Ozs7a0NBQ2xELDhEQUFDRjt3QkFBS0MsTUFBSzt3QkFBd0NDLFNBQVE7Ozs7OztrQ0FDM0QsOERBQUNGO3dCQUFLQyxNQUFLO3dCQUE2QkMsU0FBUTs7Ozs7O2tDQUNoRCw4REFBQ0Y7d0JBQUtDLE1BQUs7d0JBQXlCQyxTQUFROzs7Ozs7a0NBQzVDLDhEQUFDRjt3QkFBS0MsTUFBSzt3QkFBY0MsU0FBUTs7Ozs7O2tDQUdqQyw4REFBQ0w7d0JBQUtDLEtBQUk7d0JBQU9DLE1BQUs7Ozs7OztrQ0FDdEIsOERBQUNGO3dCQUFLQyxLQUFJO3dCQUFtQkssT0FBTTt3QkFBVUosTUFBSzs7Ozs7O2tDQUdsRCw4REFBQ0Y7d0JBQUtDLEtBQUk7d0JBQWFDLE1BQUs7Ozs7OztrQ0FDNUIsOERBQUNGO3dCQUFLQyxLQUFJO3dCQUFhQyxNQUFLO3dCQUE0QkssYUFBWTs7Ozs7Ozs7Ozs7OzBCQUV0RSw4REFBQ0M7O2tDQUNDLDhEQUFDaEIsK0NBQUlBOzs7OztrQ0FDTCw4REFBQ0MscURBQVVBOzs7Ozs7Ozs7Ozs7Ozs7OztBQUluQiIsInNvdXJjZXMiOlsid2VicGFjazovL2F1dG9zaG9wLWZyb250ZW5kLy4vcGFnZXMvX2RvY3VtZW50LnRzeD9kMzdkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0bWwsIEhlYWQsIE1haW4sIE5leHRTY3JpcHQgfSBmcm9tIFwibmV4dC9kb2N1bWVudFwiO1xuXG5jb25zdCB0aGVtZVNjcmlwdCA9IGBcbiAgKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3RvcmVkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0aGVtZVwiKTtcbiAgICAgIGNvbnN0IHByZWZlcnNEYXJrID0gd2luZG93Lm1hdGNoTWVkaWEoXCIocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspXCIpLm1hdGNoZXM7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImRhcmtcIiwgc3RvcmVkID8gc3RvcmVkID09PSBcImRhcmtcIiA6IHByZWZlcnNEYXJrKTtcbiAgICB9IGNhdGNoIChfKSB7fVxuICB9KSgpO1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRG9jdW1lbnQoKSB7XG4gIHJldHVybiAoXG4gICAgPEh0bWwgbGFuZz1cImVuXCI+XG4gICAgICA8SGVhZD5cbiAgICAgICAgey8qIElubGluZSB0aGVtZSBzY3JpcHQgcnVucyBiZWZvcmUgcGFpbnQgdG8gcHJldmVudCBmbGFzaCAqL31cbiAgICAgICAgPHNjcmlwdCBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IHRoZW1lU2NyaXB0IH19IC8+XG5cbiAgICAgICAgey8qIFBXQSAqL31cbiAgICAgICAgPGxpbmsgcmVsPVwibWFuaWZlc3RcIiBocmVmPVwiL21hbmlmZXN0Lmpzb25cIiAvPlxuICAgICAgICA8bWV0YSBuYW1lPVwiYXBwbGljYXRpb24tbmFtZVwiIGNvbnRlbnQ9XCJBdXRvRml4IEtlbnlhXCIgLz5cbiAgICAgICAgPG1ldGEgbmFtZT1cImFwcGxlLW1vYmlsZS13ZWItYXBwLWNhcGFibGVcIiBjb250ZW50PVwieWVzXCIgLz5cbiAgICAgICAgPG1ldGEgbmFtZT1cImFwcGxlLW1vYmlsZS13ZWItYXBwLXN0YXR1cy1iYXItc3R5bGVcIiBjb250ZW50PVwiZGVmYXVsdFwiIC8+XG4gICAgICAgIDxtZXRhIG5hbWU9XCJhcHBsZS1tb2JpbGUtd2ViLWFwcC10aXRsZVwiIGNvbnRlbnQ9XCJBdXRvRml4IEtlbnlhXCIgLz5cbiAgICAgICAgPG1ldGEgbmFtZT1cIm1vYmlsZS13ZWItYXBwLWNhcGFibGVcIiBjb250ZW50PVwieWVzXCIgLz5cbiAgICAgICAgPG1ldGEgbmFtZT1cInRoZW1lLWNvbG9yXCIgY29udGVudD1cIiMwRjJBNEFcIiAvPlxuXG4gICAgICAgIHsvKiBJY29ucyAqL31cbiAgICAgICAgPGxpbmsgcmVsPVwiaWNvblwiIGhyZWY9XCIvbG9nby5wbmdcIiAvPlxuICAgICAgICA8bGluayByZWw9XCJhcHBsZS10b3VjaC1pY29uXCIgc2l6ZXM9XCIxODB4MTgwXCIgaHJlZj1cIi9sb2dvLnBuZ1wiIC8+XG5cbiAgICAgICAgey8qIFByZWNvbm5lY3QgdG8gR29vZ2xlIEZvbnRzIGlmIHVzZWQgKi99XG4gICAgICAgIDxsaW5rIHJlbD1cInByZWNvbm5lY3RcIiBocmVmPVwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbVwiIC8+XG4gICAgICAgIDxsaW5rIHJlbD1cInByZWNvbm5lY3RcIiBocmVmPVwiaHR0cHM6Ly9mb250cy5nc3RhdGljLmNvbVwiIGNyb3NzT3JpZ2luPVwiYW5vbnltb3VzXCIgLz5cbiAgICAgIDwvSGVhZD5cbiAgICAgIDxib2R5PlxuICAgICAgICA8TWFpbiAvPlxuICAgICAgICA8TmV4dFNjcmlwdCAvPlxuICAgICAgPC9ib2R5PlxuICAgIDwvSHRtbD5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJIdG1sIiwiSGVhZCIsIk1haW4iLCJOZXh0U2NyaXB0IiwidGhlbWVTY3JpcHQiLCJEb2N1bWVudCIsImxhbmciLCJzY3JpcHQiLCJkYW5nZXJvdXNseVNldElubmVySFRNTCIsIl9faHRtbCIsImxpbmsiLCJyZWwiLCJocmVmIiwibWV0YSIsIm5hbWUiLCJjb250ZW50Iiwic2l6ZXMiLCJjcm9zc09yaWdpbiIsImJvZHkiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_document.tsx\n");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("./pages/_document.tsx")));
module.exports = __webpack_exports__;

})();