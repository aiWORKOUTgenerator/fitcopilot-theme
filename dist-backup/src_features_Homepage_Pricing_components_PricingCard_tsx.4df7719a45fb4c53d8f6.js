"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkai_workout_generator_homepage"] = self["webpackChunkai_workout_generator_homepage"] || []).push([["src_features_Homepage_Pricing_components_PricingCard_tsx"],{

/***/ "./node_modules/lucide-react/dist/esm/icons/check.mjs":
/*!************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/check.mjs ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Check)\n/* harmony export */ });\n/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ \"./node_modules/lucide-react/dist/esm/createLucideIcon.mjs\");\n/**\n * lucide-react v0.0.1 - ISC\n */\n\n\n\nconst Check = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"Check\", [\n  [\"polyline\", { points: \"20 6 9 17 4 12\", key: \"10jjfj\" }]\n]);\n\n\n//# sourceMappingURL=check.mjs.map\n\n\n//# sourceURL=webpack://ai-workout-generator-homepage/./node_modules/lucide-react/dist/esm/icons/check.mjs?");

/***/ }),

/***/ "./src/features/Homepage/Pricing/components/PricingCard.scss":
/*!*******************************************************************!*\
  !*** ./src/features/Homepage/Pricing/components/PricingCard.scss ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://ai-workout-generator-homepage/./src/features/Homepage/Pricing/components/PricingCard.scss?");

/***/ }),

/***/ "./src/features/Homepage/Pricing/components/PricingCard.tsx":
/*!******************************************************************!*\
  !*** ./src/features/Homepage/Pricing/components/PricingCard.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   PricingCard: () => (/* binding */ PricingCard)\n/* harmony export */ });\n/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ \"./node_modules/lucide-react/dist/esm/icons/check.mjs\");\n/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ \"./node_modules/lucide-react/dist/esm/icons/x.mjs\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _PricingCard_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PricingCard.scss */ \"./src/features/Homepage/Pricing/components/PricingCard.scss\");\n\n\n\n/**\n * Renders an individual pricing card\n */\nvar PricingCard = function PricingCard(_ref) {\n  var name = _ref.name,\n    description = _ref.description,\n    price = _ref.price,\n    period = _ref.period,\n    features = _ref.features,\n    ctaText = _ref.ctaText,\n    ctaLink = _ref.ctaLink,\n    _ref$popular = _ref.popular,\n    popular = _ref$popular === void 0 ? false : _ref$popular;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"pricing-card relative h-full flex flex-col rounded-2xl border \".concat(popular ? 'border-lime-400 popular' : 'border-gray-800', \" overflow-hidden\")\n  }, popular && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"absolute top-0 right-0\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"popular-badge bg-lime-400 text-dark text-xs px-4 py-1 font-medium transform rotate-45 translate-x-7 translate-y-4\"\n  }, \"Popular\")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"p-8 flex-grow\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"h3\", {\n    className: \"plan-name text-white mb-2\"\n  }, name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"p\", {\n    className: \"text-gray-400 mb-6\"\n  }, description), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"mb-8\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"flex items-end\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"span\", {\n    className: \"price text-white\"\n  }, price === '0' ? 'Free' : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, \"$\", price)), period !== 'forever' && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"span\", {\n    className: \"text-gray-400 ml-2 pb-1\"\n  }, \"/\", period))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"ul\", {\n    className: \"space-y-4 mb-8\"\n  }, features.map(function (feature) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"li\", {\n      key: feature.id,\n      className: \"flex items-start\"\n    }, feature.included ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(lucide_react__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n      className: \"feature-icon shrink-0 h-5 w-5 text-lime-400 mr-3 mt-0.5\"\n    }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(lucide_react__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n      className: \"shrink-0 h-5 w-5 text-gray-500 mr-3 mt-0.5\"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"span\", {\n      className: \"feature-text \".concat(feature.included ? 'text-gray-300' : 'text-gray-500', \" \").concat(feature.isHighlighted ? 'highlighted' : '')\n    }, feature.text));\n  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"px-8 pb-8\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"a\", {\n    href: ctaLink,\n    className: \"block text-center py-3 px-6 rounded-lg font-medium \".concat(popular ? 'bg-lime-400 text-dark hover:bg-lime-300' : 'bg-dark text-white border border-gray-700 hover:border-lime-400')\n  }, ctaText)));\n};\n\n//# sourceURL=webpack://ai-workout-generator-homepage/./src/features/Homepage/Pricing/components/PricingCard.tsx?");

/***/ })

}]);