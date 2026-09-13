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
exports.id = "pages/api/auth/register";
exports.ids = ["pages/api/auth/register"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "@prisma/adapter-pg":
/*!*************************************!*\
  !*** external "@prisma/adapter-pg" ***!
  \*************************************/
/***/ ((module) => {

module.exports = import("@prisma/adapter-pg");;

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

module.exports = import("bcryptjs");;

/***/ }),

/***/ "(api)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"prisma\": () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_adapter_pg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/adapter-pg */ \"@prisma/adapter-pg\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_prisma_adapter_pg__WEBPACK_IMPORTED_MODULE_0__]);\n_prisma_adapter_pg__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n// eslint-disable-next-line @typescript-eslint/no-var-requires\nconst { PrismaClient  } = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\nconst connectionString = process.env.DATABASE_URL;\nconst prismaClientSingleton = ()=>{\n    const adapter = new _prisma_adapter_pg__WEBPACK_IMPORTED_MODULE_0__.PrismaPg(connectionString ?? \"\");\n    return new PrismaClient({\n        adapter\n    });\n};\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? prismaClientSingleton();\nif (true) globalForPrisma.prisma = prisma;\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9saWIvcHJpc21hLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQThDO0FBQzlDLDhEQUE4RDtBQUM5RCxNQUFNLEVBQUVDLGFBQVksRUFBRSxHQUFHQyxtQkFBT0EsQ0FBQyxzQ0FBZ0I7QUFFakQsTUFBTUMsbUJBQW1CQyxRQUFRQyxHQUFHLENBQUNDLFlBQVk7QUFFakQsTUFBTUMsd0JBQXdCLElBQU07SUFDbEMsTUFBTUMsVUFBVSxJQUFJUix3REFBUUEsQ0FBQ0csb0JBQW9CO0lBQ2pELE9BQU8sSUFBSUYsYUFBYTtRQUFFTztJQUFRO0FBQ3BDO0FBSUEsTUFBTUMsa0JBQWtCQztBQUlqQixNQUFNQyxTQUFTRixnQkFBZ0JFLE1BQU0sSUFBSUosd0JBQXdCO0FBRXhFLElBQUlILElBQXFDLEVBQUVLLGdCQUFnQkUsTUFBTSxHQUFHQSIsInNvdXJjZXMiOlsid2VicGFjazovL2F1dG9zaG9wLWZyb250ZW5kLy4vbGliL3ByaXNtYS50cz85ODIyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYVBnIH0gZnJvbSBcIkBwcmlzbWEvYWRhcHRlci1wZ1wiO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby12YXItcmVxdWlyZXNcbmNvbnN0IHsgUHJpc21hQ2xpZW50IH0gPSByZXF1aXJlKFwiQHByaXNtYS9jbGllbnRcIik7XG5cbmNvbnN0IGNvbm5lY3Rpb25TdHJpbmcgPSBwcm9jZXNzLmVudi5EQVRBQkFTRV9VUkw7XG5cbmNvbnN0IHByaXNtYUNsaWVudFNpbmdsZXRvbiA9ICgpID0+IHtcbiAgY29uc3QgYWRhcHRlciA9IG5ldyBQcmlzbWFQZyhjb25uZWN0aW9uU3RyaW5nID8/IFwiXCIpO1xuICByZXR1cm4gbmV3IFByaXNtYUNsaWVudCh7IGFkYXB0ZXIgfSk7XG59O1xuXG50eXBlIFByaXNtYUNsaWVudFNpbmdsZXRvbiA9IFJldHVyblR5cGU8dHlwZW9mIHByaXNtYUNsaWVudFNpbmdsZXRvbj47XG5cbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbFRoaXMgYXMgdW5rbm93biBhcyB7XG4gIHByaXNtYTogUHJpc21hQ2xpZW50U2luZ2xldG9uIHwgdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IGNvbnN0IHByaXNtYSA9IGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPz8gcHJpc21hQ2xpZW50U2luZ2xldG9uKCk7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWE7XG4iXSwibmFtZXMiOlsiUHJpc21hUGciLCJQcmlzbWFDbGllbnQiLCJyZXF1aXJlIiwiY29ubmVjdGlvblN0cmluZyIsInByb2Nlc3MiLCJlbnYiLCJEQVRBQkFTRV9VUkwiLCJwcmlzbWFDbGllbnRTaW5nbGV0b24iLCJhZGFwdGVyIiwiZ2xvYmFsRm9yUHJpc21hIiwiZ2xvYmFsVGhpcyIsInByaXNtYSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./lib/prisma.ts\n");

/***/ }),

/***/ "(api)/./pages/api/auth/register.ts":
/*!************************************!*\
  !*** ./pages/api/auth/register.ts ***!
  \************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/prisma */ \"(api)/./lib/prisma.ts\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"bcryptjs\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_prisma__WEBPACK_IMPORTED_MODULE_0__, bcryptjs__WEBPACK_IMPORTED_MODULE_1__]);\n([_lib_prisma__WEBPACK_IMPORTED_MODULE_0__, bcryptjs__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\nasync function handler(req, res) {\n    if (req.method !== \"POST\") {\n        return res.status(405).json({\n            message: \"Method not allowed\"\n        });\n    }\n    const { email , password , name  } = req.body;\n    if (!email || !password || !name) {\n        return res.status(400).json({\n            message: \"Missing required fields\"\n        });\n    }\n    try {\n        // Check if user already exists\n        const existingUser = await _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.user.findUnique({\n            where: {\n                email\n            }\n        });\n        if (existingUser) {\n            return res.status(409).json({\n                message: \"User already exists\"\n            });\n        }\n        // Hash password\n        const hashedPassword = await bcryptjs__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hash(password, 10);\n        // Create user\n        const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.user.create({\n            data: {\n                email,\n                name,\n                password: hashedPassword\n            }\n        });\n        return res.status(201).json({\n            message: \"User created successfully\",\n            user: {\n                id: user.id,\n                email: user.email,\n                name: user.name\n            }\n        });\n    } catch (error) {\n        console.error(\"Registration error:\", error);\n        return res.status(500).json({\n            message: \"Internal server error\"\n        });\n    }\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvYXV0aC9yZWdpc3Rlci50cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBc0M7QUFDUjtBQUdmLGVBQWVFLFFBQzVCQyxHQUFtQixFQUNuQkMsR0FBb0IsRUFDcEI7SUFDQSxJQUFJRCxJQUFJRSxNQUFNLEtBQUssUUFBUTtRQUN6QixPQUFPRCxJQUFJRSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO1lBQUVDLFNBQVM7UUFBcUI7SUFDOUQsQ0FBQztJQUVELE1BQU0sRUFBRUMsTUFBSyxFQUFFQyxTQUFRLEVBQUVDLEtBQUksRUFBRSxHQUFHUixJQUFJUyxJQUFJO0lBRTFDLElBQUksQ0FBQ0gsU0FBUyxDQUFDQyxZQUFZLENBQUNDLE1BQU07UUFDaEMsT0FBT1AsSUFBSUUsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFQyxTQUFTO1FBQTBCO0lBQ25FLENBQUM7SUFFRCxJQUFJO1FBQ0YsK0JBQStCO1FBQy9CLE1BQU1LLGVBQWUsTUFBTWIsK0RBQXNCLENBQUM7WUFDaERnQixPQUFPO2dCQUFFUDtZQUFNO1FBQ2pCO1FBRUEsSUFBSUksY0FBYztZQUNoQixPQUFPVCxJQUFJRSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO2dCQUFFQyxTQUFTO1lBQXNCO1FBQy9ELENBQUM7UUFFRCxnQkFBZ0I7UUFDaEIsTUFBTVMsaUJBQWlCLE1BQU1oQixxREFBVyxDQUFDUyxVQUFVO1FBRW5ELGNBQWM7UUFDZCxNQUFNSSxPQUFPLE1BQU1kLDJEQUFrQixDQUFDO1lBQ3BDb0IsTUFBTTtnQkFDSlg7Z0JBQ0FFO2dCQUNBRCxVQUFVTztZQUNaO1FBQ0Y7UUFFQSxPQUFPYixJQUFJRSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO1lBQzFCQyxTQUFTO1lBQ1RNLE1BQU07Z0JBQUVPLElBQUlQLEtBQUtPLEVBQUU7Z0JBQUVaLE9BQU9LLEtBQUtMLEtBQUs7Z0JBQUVFLE1BQU1HLEtBQUtILElBQUk7WUFBQztRQUMxRDtJQUNGLEVBQUUsT0FBT1csT0FBTztRQUNkQyxRQUFRRCxLQUFLLENBQUMsdUJBQXVCQTtRQUNyQyxPQUFPbEIsSUFBSUUsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFQyxTQUFTO1FBQXdCO0lBQ2pFO0FBQ0YsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2F1dG9zaG9wLWZyb250ZW5kLy4vcGFnZXMvYXBpL2F1dGgvcmVnaXN0ZXIudHM/MTNjMCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwcmlzbWEgfSBmcm9tIFwiQC9saWIvcHJpc21hXCI7XG5pbXBvcnQgYmNyeXB0IGZyb20gXCJiY3J5cHRqc1wiO1xuaW1wb3J0IHR5cGUgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSBcIm5leHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihcbiAgcmVxOiBOZXh0QXBpUmVxdWVzdCxcbiAgcmVzOiBOZXh0QXBpUmVzcG9uc2UsXG4pIHtcbiAgaWYgKHJlcS5tZXRob2QgIT09IFwiUE9TVFwiKSB7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA1KS5qc29uKHsgbWVzc2FnZTogXCJNZXRob2Qgbm90IGFsbG93ZWRcIiB9KTtcbiAgfVxuXG4gIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkLCBuYW1lIH0gPSByZXEuYm9keTtcblxuICBpZiAoIWVtYWlsIHx8ICFwYXNzd29yZCB8fCAhbmFtZSkge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IFwiTWlzc2luZyByZXF1aXJlZCBmaWVsZHNcIiB9KTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gQ2hlY2sgaWYgdXNlciBhbHJlYWR5IGV4aXN0c1xuICAgIGNvbnN0IGV4aXN0aW5nVXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoe1xuICAgICAgd2hlcmU6IHsgZW1haWwgfSxcbiAgICB9KTtcblxuICAgIGlmIChleGlzdGluZ1VzZXIpIHtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwOSkuanNvbih7IG1lc3NhZ2U6IFwiVXNlciBhbHJlYWR5IGV4aXN0c1wiIH0pO1xuICAgIH1cblxuICAgIC8vIEhhc2ggcGFzc3dvcmRcbiAgICBjb25zdCBoYXNoZWRQYXNzd29yZCA9IGF3YWl0IGJjcnlwdC5oYXNoKHBhc3N3b3JkLCAxMCk7XG5cbiAgICAvLyBDcmVhdGUgdXNlclxuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICBlbWFpbCxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgcGFzc3dvcmQ6IGhhc2hlZFBhc3N3b3JkLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMSkuanNvbih7XG4gICAgICBtZXNzYWdlOiBcIlVzZXIgY3JlYXRlZCBzdWNjZXNzZnVsbHlcIixcbiAgICAgIHVzZXI6IHsgaWQ6IHVzZXIuaWQsIGVtYWlsOiB1c2VyLmVtYWlsLCBuYW1lOiB1c2VyLm5hbWUgfSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiUmVnaXN0cmF0aW9uIGVycm9yOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogXCJJbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIiB9KTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbInByaXNtYSIsImJjcnlwdCIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJzdGF0dXMiLCJqc29uIiwibWVzc2FnZSIsImVtYWlsIiwicGFzc3dvcmQiLCJuYW1lIiwiYm9keSIsImV4aXN0aW5nVXNlciIsInVzZXIiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJoYXNoZWRQYXNzd29yZCIsImhhc2giLCJjcmVhdGUiLCJkYXRhIiwiaWQiLCJlcnJvciIsImNvbnNvbGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./pages/api/auth/register.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/auth/register.ts"));
module.exports = __webpack_exports__;

})();