"use strict";(self.webpackChunkai_workout_generator_homepage=self.webpackChunkai_workout_generator_homepage||[]).push([[76],{30717:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$:()=>Button_Button,A:()=>components_Button});var react=__webpack_require__(96540),LogLevel=function(LogLevel){return LogLevel[LogLevel.DEBUG=0]="DEBUG",LogLevel[LogLevel.INFO=1]="INFO",LogLevel[LogLevel.WARN=2]="WARN",LogLevel[LogLevel.ERROR=3]="ERROR",LogLevel}({}),LOG_LEVEL_VALUES={DEBUG:0,INFO:1,WARN:2,ERROR:3};function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _array_without_holes(arr){if(Array.isArray(arr))return _array_like_to_array(arr)}function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _instanceof(left,right){return null!=right&&"undefined"!=typeof Symbol&&right[Symbol.hasInstance]?!!right[Symbol.hasInstance](left):left instanceof right}function _iterable_to_array(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}function _non_iterable_spread(){throw TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable}))),ownKeys.forEach(function(key){_define_property(target,key,source[key])})}return target}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable})),keys.push.apply(keys,symbols)}return keys}function _object_spread_props(target,source){return source=null!=source?source:{},Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}),target}function _to_consumable_array(arr){return _array_without_holes(arr)||_iterable_to_array(arr)||_unsupported_iterable_to_array(arr)||_non_iterable_spread()}function _unsupported_iterable_to_array(o,minLen){if(o){if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);if("Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}}var safeLogLevel=function(level){try{return LogLevel[level]}catch(_e){return LOG_LEVEL_VALUES[level]}},DEFAULT_CONFIGS={production:{minLevel:safeLogLevel("WARN"),enableConsole:!0,enableRemoteLogging:!0,enableGrouping:!1,enableTimers:!1},development:{minLevel:safeLogLevel("DEBUG"),enableConsole:!0,enableRemoteLogging:!1,enableGrouping:!0,enableTimers:!0},test:{minLevel:safeLogLevel("ERROR"),enableConsole:!1,enableRemoteLogging:!1,enableGrouping:!1,enableTimers:!1}},getDefaultConfig=function(){return DEFAULT_CONFIGS.production},activeConfig=getDefaultConfig(),timers={},timerCounter=0,safeConsole={log:function(){for(var _console,_len=arguments.length,args=Array(_len),_key=0;_key<_len;_key++)args[_key]=arguments[_key];try{(_console=console).log.apply(_console,_to_consumable_array(args))}catch(_e){}},info:function(){for(var _console,_len=arguments.length,args=Array(_len),_key=0;_key<_len;_key++)args[_key]=arguments[_key];try{(_console=console).info.apply(_console,_to_consumable_array(args))}catch(_e){}},warn:function(){for(var _console,_len=arguments.length,args=Array(_len),_key=0;_key<_len;_key++)args[_key]=arguments[_key];try{(_console=console).warn.apply(_console,_to_consumable_array(args))}catch(_e){}},error:function(){for(var _console,_len=arguments.length,args=Array(_len),_key=0;_key<_len;_key++)args[_key]=arguments[_key];try{(_console=console).error.apply(_console,_to_consumable_array(args))}catch(_e){}},group:function(label){try{console.group(label)}catch(_e){}},groupEnd:function(){try{console.groupEnd()}catch(_e){}},time:function(label){try{console.time(label)}catch(_e){}},timeEnd:function(label){try{console.timeEnd(label)}catch(_e){}}},logMessage=function(level,message){for(var _len=arguments.length,data=Array(_len>2?_len-2:0),_key=2;_key<_len;_key++)data[_key-2]=arguments[_key];if(!(level<activeConfig.minLevel)){var timestamp=new Date().toISOString(),formattedMessage="[".concat(timestamp,"] ").concat(message);if(activeConfig.enableConsole){try{switch(level){case safeLogLevel("DEBUG"):safeConsole.log.apply(safeConsole,[formattedMessage].concat(_to_consumable_array(data)));break;case safeLogLevel("INFO"):safeConsole.info.apply(safeConsole,[formattedMessage].concat(_to_consumable_array(data)));break;case safeLogLevel("WARN"):safeConsole.warn.apply(safeConsole,[formattedMessage].concat(_to_consumable_array(data)));break;case safeLogLevel("ERROR"):safeConsole.error.apply(safeConsole,[formattedMessage].concat(_to_consumable_array(data)))}}catch(_e){}activeConfig.enableRemoteLogging}}},logger={debug:function(message){for(var _len=arguments.length,data=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++)data[_key-1]=arguments[_key];logMessage.apply(void 0,[safeLogLevel("DEBUG"),message].concat(_to_consumable_array(data)))},info:function(message){for(var _len=arguments.length,data=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++)data[_key-1]=arguments[_key];logMessage.apply(void 0,[safeLogLevel("INFO"),message].concat(_to_consumable_array(data)))},warn:function(message){for(var _len=arguments.length,data=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++)data[_key-1]=arguments[_key];logMessage.apply(void 0,[safeLogLevel("WARN"),message].concat(_to_consumable_array(data)))},error:function(message){for(var _len=arguments.length,data=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++)data[_key-1]=arguments[_key];logMessage.apply(void 0,[safeLogLevel("ERROR"),message].concat(_to_consumable_array(data)))},captureError:function(err){var context=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},errorMessage=_instanceof(err,Error)?err.message:"string"==typeof err?err:"Unknown error",component=context.component?"[".concat(String(context.component),"] "):"",contextMessage="".concat(component).concat(errorMessage);logger.error(contextMessage,_object_spread_props(_object_spread({},context),{error:err}))},group:function(label,callback){if(!activeConfig.enableGrouping)return void callback();safeConsole.group(label);try{callback()}finally{safeConsole.groupEnd()}},time:function(label){if(!activeConfig.enableTimers)return"";var timerId="timer_".concat(timerCounter++);return timers[timerId]=Date.now(),safeConsole.time(label),timerId},timeEnd:function(timerId){if(activeConfig.enableTimers){var startTime=timers[timerId];if(startTime){var duration=Date.now()-startTime;logger.debug("Timer ".concat(timerId," completed in ").concat(duration,"ms")),delete timers[timerId]}}},addContext:function(component){var contextLogger={debug:function(message){for(var _len=arguments.length,data=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++)data[_key-1]=arguments[_key];logMessage.apply(void 0,[safeLogLevel("DEBUG"),"[".concat(component,"] ").concat(message)].concat(_to_consumable_array(data)))},info:function(message){for(var _len=arguments.length,data=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++)data[_key-1]=arguments[_key];logMessage.apply(void 0,[safeLogLevel("INFO"),"[".concat(component,"] ").concat(message)].concat(_to_consumable_array(data)))},warn:function(message){for(var _len=arguments.length,data=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++)data[_key-1]=arguments[_key];logMessage.apply(void 0,[safeLogLevel("WARN"),"[".concat(component,"] ").concat(message)].concat(_to_consumable_array(data)))},error:function(message){for(var _len=arguments.length,data=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++)data[_key-1]=arguments[_key];logMessage.apply(void 0,[safeLogLevel("ERROR"),"[".concat(component,"] ").concat(message)].concat(_to_consumable_array(data)))},captureError:function(err){var context=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};logger.captureError(err,_object_spread_props(_object_spread({},context),{component:component}))},group:function(label,callback){logger.group("[".concat(component,"] ").concat(label),callback)},time:function(label){return logger.time("[".concat(component,"] ").concat(label))},timeEnd:function(timerId){logger.timeEnd(timerId)},addContext:function(newContext){return contextLogger.addContext("".concat(component,".").concat(newContext))},setLogLevel:function(level){logger.setLogLevel(level)},logComponentEvent:function(componentName,eventName,event){logger.logComponentEvent("".concat(component,".").concat(componentName),eventName,event)},createLoggedEventHandler:function(componentName,eventName,handler){return logger.createLoggedEventHandler("".concat(component,".").concat(componentName),eventName,handler)},configure:function(config){logger.configure(config)}};return contextLogger},setLogLevel:function(level){activeConfig.minLevel=level},logComponentEvent:function(componentName,eventName,event){logger.debug("[".concat(componentName,"] ").concat(eventName),{type:event.type,target:event.target,currentTarget:event.currentTarget})},createLoggedEventHandler:function(componentName,eventName,handler){return function(event){logger.logComponentEvent(componentName,eventName,event),handler&&handler(event)}},configure:function(config){activeConfig=_object_spread({},activeConfig,config)}};logger.configure(getDefaultConfig());var injectStylesIntoStyleTag=__webpack_require__(85072),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__(97825),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__(77659),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__(55056),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__(10540),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__(41113),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Button=__webpack_require__(39877),options={};function Button_define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function Button_object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable}))),ownKeys.forEach(function(key){Button_define_property(target,key,source[key])})}return target}function _object_without_properties(source,excluded){if(null==source)return{};var key,i,target=_object_without_properties_loose(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],!(excluded.indexOf(key)>=0)&&Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}function _object_without_properties_loose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default(),injectStylesIntoStyleTag_default()(Button.A,options),Button.A&&Button.A.locals&&Button.A.locals;var Button_Button=function(props){if(!props)return logger.warn("Button component received undefined props"),null;var _props_variant=props.variant,_props_className=props.className,size=props.size,children=props.children,leftIcon=props.leftIcon,rightIcon=props.rightIcon,_props_disabled=props.disabled,onClick=props.onClick,_props_type=props.type,_props_fullWidth=props.fullWidth,href=props.href,target=props.target,rel=props.rel,style=props.style,rest=_object_without_properties(props,["variant","className","size","children","leftIcon","rightIcon","disabled","onClick","type","fullWidth","href","target","rel","style"]),buttonClassName="btn btn-".concat(void 0===_props_variant?"primary":_props_variant," ").concat(size?"btn-".concat(size):""," ").concat(void 0!==_props_fullWidth&&_props_fullWidth?"btn-full-width":""," ").concat(void 0===_props_className?"":_props_className).trim(),content=react.createElement(react.Fragment,null,leftIcon&&react.createElement("span",{className:"btn__icon btn__icon--left"},leftIcon),react.createElement("span",{className:"btn__text"},children),rightIcon&&react.createElement("span",{className:"btn__icon btn__icon--right"},rightIcon));return href?react.createElement("a",Button_object_spread({href:href,className:buttonClassName,target:target,rel:rel,style:style},rest),content):react.createElement("button",Button_object_spread({type:void 0===_props_type?"button":_props_type,className:buttonClassName,disabled:void 0!==_props_disabled&&_props_disabled,onClick:onClick,style:style},rest),content)};let components_Button=Button_Button;try{Button_Button.displayName="Button",Button_Button.__docgenInfo={description:`Button component that can render as either a button element or a link
based on the props provided.`,displayName:"Button",props:{children:{defaultValue:null,description:"Button content (text or elements)",name:"children",required:!0,type:{name:"ReactNode"}},variant:{defaultValue:null,description:"Visual style variant",name:"variant",required:!1,type:{name:"enum",value:[{value:'"primary"'},{value:'"secondary"'},{value:'"text"'},{value:'"icon"'},{value:'"link"'}]}},size:{defaultValue:null,description:"Size variant",name:"size",required:!1,type:{name:"enum",value:[{value:'"small"'},{value:'"medium"'},{value:'"large"'}]}},disabled:{defaultValue:null,description:"Whether the button is disabled",name:"disabled",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"Additional CSS class names",name:"className",required:!1,type:{name:"string"}},onClick:{defaultValue:null,description:"Click handler",name:"onClick",required:!1,type:{name:"ButtonClickHandler"}},type:{defaultValue:null,description:"Button type attribute",name:"type",required:!1,type:{name:"enum",value:[{value:'"button"'},{value:'"submit"'},{value:'"reset"'}]}},leftIcon:{defaultValue:null,description:"Left icon",name:"leftIcon",required:!1,type:{name:"ReactNode"}},rightIcon:{defaultValue:null,description:"Right icon",name:"rightIcon",required:!1,type:{name:"ReactNode"}},fullWidth:{defaultValue:null,description:"Whether the button should take full width",name:"fullWidth",required:!1,type:{name:"boolean"}},href:{defaultValue:null,description:"URL (renders as anchor)",name:"href",required:!1,type:{name:"string"}},target:{defaultValue:null,description:"Target for href",name:"target",required:!1,type:{name:"string"}},rel:{defaultValue:null,description:"Rel attribute for href",name:"rel",required:!1,type:{name:"string"}},style:{defaultValue:null,description:"Inline styles",name:"style",required:!1,type:{name:"CSSProperties"}},"aria-label":{defaultValue:null,description:"ARIA attributes",name:"aria-label",required:!1,type:{name:"string"}},"aria-controls":{defaultValue:null,description:"",name:"aria-controls",required:!1,type:{name:"string"}},"aria-expanded":{defaultValue:null,description:"",name:"aria-expanded",required:!1,type:{name:"boolean"}},"aria-pressed":{defaultValue:null,description:"",name:"aria-pressed",required:!1,type:{name:"boolean"}},"data-testid":{defaultValue:null,description:"Testing attribute",name:"data-testid",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/features/shared/Button/components/Button.tsx#Button"]={docgenInfo:Button_Button.__docgenInfo,name:"Button",path:"src/features/shared/Button/components/Button.tsx#Button"})}catch(__react_docgen_typescript_loader_error){}},39877:(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(71354),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(76314),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,':root{--color-primary-50: #ebf8ff;--color-primary-100: #bee3f8;--color-primary-200: #90cdf4;--color-primary-300: #63b3ed;--color-primary-400: #4299e1;--color-primary-500: #3498db;--color-primary-600: #2980b9;--color-primary-700: #2c5282;--color-primary-800: #2a4365;--color-primary-900: #1a365d;--color-accent-50: #faffed;--color-accent-100: #f3ffcc;--color-accent-200: #ebff99;--color-accent-300: #e2ff66;--color-accent-400: #ddff0e;--color-accent-500: #b3cc0b;--color-accent-600: #849909;--color-accent-700: #566606;--color-accent-800: #293303;--color-accent-900: #141a01;--color-gray-50: #f9fafb;--color-gray-100: #f3f4f6;--color-gray-200: #e5e7eb;--color-gray-300: #d1d5db;--color-gray-400: #9ca3af;--color-gray-500: #6b7280;--color-gray-600: #4b5563;--color-gray-700: #374151;--color-gray-800: #1f2937;--color-gray-900: #111827;--color-brand-primary: var(--color-primary-500);--color-brand-accent: var(--color-accent-400);--color-ui-background: var(--color-gray-900);--color-ui-surface: var(--color-gray-800);--color-ui-surface-alt: rgba(31, 41, 55, 0.8);--color-ui-border: var(--color-gray-700);--color-text-primary: var(--color-gray-50);--color-text-secondary: var(--color-gray-300);--color-text-accent: var(--color-accent-400);--color-text-muted: var(--color-gray-400);--color-text-inverse: var(--color-gray-900);--color-hero-heading: var(--color-text-primary);--color-hero-paragraph: var(--color-text-secondary);--color-hero-highlight: var(--color-text-accent);--color-hero-button-primary: var(--color-brand-accent);--color-hero-button-primary-hover: var(--color-accent-500);--color-hero-button-secondary-bg: var(--color-ui-surface-alt);--color-hero-tooltip-bg: var(--color-ui-surface);--color-accent-400-rgb: 221, 255, 14;--color-primary-500-rgb: 52, 152, 219;--color-gray-900-rgb: 17, 24, 39;--color-accent-400-alpha-10: rgba(var(--color-accent-400-rgb), 0.1);--color-accent-400-alpha-30: rgba(var(--color-accent-400-rgb), 0.3);--color-accent-400-alpha-50: rgba(var(--color-accent-400-rgb), 0.5);--color-accent-400-alpha-70: rgba(var(--color-accent-400-rgb), 0.7)}[data-theme=gym]{--color-accent-50: #f5f3ff;--color-accent-100: #ede9fe;--color-accent-200: #ddd6fe;--color-accent-300: #c4b5fd;--color-accent-400: #8b5cf6;--color-accent-500: #7c3aed;--color-accent-600: #6d28d9;--color-accent-700: #5b21b6;--color-accent-800: #4c1d95;--color-accent-900: #2e1065;--color-accent-400-rgb: 139, 92, 246}[data-theme=sports]{--color-accent-50: #eff6ff;--color-accent-100: #dbeafe;--color-accent-200: #bfdbfe;--color-accent-300: #93c5fd;--color-accent-400: #38bdf8;--color-accent-500: #0ea5e9;--color-accent-600: #0284c7;--color-accent-700: #0369a1;--color-accent-800: #075985;--color-accent-900: #0c4a6e;--color-accent-400-rgb: 56, 189, 248}[data-theme=wellness]{--color-accent-50: #f0fdfa;--color-accent-100: #ccfbf1;--color-accent-200: #99f6e4;--color-accent-300: #5eead4;--color-accent-400: #2dd4bf;--color-accent-500: #14b8a6;--color-accent-600: #0d9488;--color-accent-700: #0f766e;--color-accent-800: #115e59;--color-accent-900: #134e4a;--color-accent-400-rgb: 45, 212, 191}:root{--font-family-sans: Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;--font-family-display: Poppins, Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;--font-family-mono: Roboto Mono, SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;--font-size-xs: 0.75rem;--font-size-sm: 0.875rem;--font-size-base: 1rem;--font-size-md: 1.125rem;--font-size-lg: 1.25rem;--font-size-xl: 1.5rem;--font-size-2xl: 1.875rem;--font-size-3xl: 2.25rem;--font-size-4xl: 3rem;--font-size-5xl: 3.75rem;--font-size-6xl: 4.5rem;--font-weight-thin: 100;--font-weight-extralight: 200;--font-weight-light: 300;--font-weight-normal: 400;--font-weight-medium: 500;--font-weight-semibold: 600;--font-weight-bold: 700;--font-weight-extrabold: 800;--font-weight-black: 900;--line-height-none: 1;--line-height-tight: 1.25;--line-height-snug: 1.375;--line-height-normal: 1.5;--line-height-relaxed: 1.625;--line-height-loose: 2;--letter-spacing-tighter: -0.05em;--letter-spacing-tight: -0.025em;--letter-spacing-normal: 0;--letter-spacing-wide: 0.025em;--letter-spacing-wider: 0.05em;--letter-spacing-widest: 0.1em}:root{--spacing-unit: 0.25rem;--spacing-0: 0;--spacing-1: 0.25rem;--spacing-2: 0.5rem;--spacing-3: 0.75rem;--spacing-4: 1rem;--spacing-5: 1.25rem;--spacing-6: 1.5rem;--spacing-8: 2rem;--spacing-10: 2.5rem;--spacing-12: 3rem;--spacing-16: 4rem;--spacing-20: 5rem;--spacing-24: 6rem;--spacing-32: 8rem;--spacing-40: 10rem;--spacing-48: 12rem;--spacing-56: 14rem;--spacing-64: 16rem;--container-sm: 640px;--container-md: 768px;--container-lg: 1024px;--container-xl: 1280px;--container-2xl: 1536px;--section-spacing-y: 4rem;--section-spacing-y-mobile: 2rem;--component-spacing: 1.5rem;--component-spacing-sm: 0.75rem;--component-spacing-lg: 2rem}:root{--radius-none: 0;--radius-sm: 0.125rem;--radius-md: 0.375rem;--radius-lg: 0.5rem;--radius-xl: 0.75rem;--radius-2xl: 1rem;--radius-full: 9999px}:root{--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);--shadow-lg: 0 10px 25px -5px rgba(0, 0, 0, 0.3);--shadow-xl: 0 15px 35px rgba(0, 0, 0, 0.2);--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);--shadow-focus-ring: 0 0 0 2px #fff, 0 0 0 4px var(--color-primary);--shadow-button: 0 6px 15px rgba(0, 0, 0, 0.15);--shadow-button-hover: 0 8px 20px rgba(0, 0, 0, 0.2);--shadow-button-active: 0 4px 8px rgba(0, 0, 0, 0.1);--shadow-button-primary: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);--shadow-button-primary-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)}:root{--transition-duration-fast: 150ms;--transition-duration-normal: 250ms;--transition-duration-slow: 350ms;--transition-duration-slower: 500ms;--transition-ease: ease;--transition-ease-in: ease-in;--transition-ease-out: ease-out;--transition-ease-in-out: ease-in-out;--transition-linear: linear;--transition-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);--transition-emphasis: cubic-bezier(0.2, 0.9, 0.4, 1);--transition-smooth: cubic-bezier(0.4, 0, 0.2, 1);--animation-duration-short: 300ms;--animation-duration-normal: 500ms;--animation-duration-long: 800ms;--transition-color: color 250ms ease;--transition-opacity: opacity 250ms ease;--transition-transform: transform 250ms ease;--transition-shadow: box-shadow 250ms ease;--transition-all: all 250ms ease}:root{--bg-page: var(--color-background);--bg-surface: var(--color-surface)}:root{--breakpoint-sm: 576px;--breakpoint-md: 768px;--breakpoint-lg: 992px;--breakpoint-xl: 1200px;--breakpoint-2xl: 1400px}:root{--size-tooltip-arrow: 12px;--button-padding-x: var(--spacing-4, 1rem);--button-padding-y: var(--spacing-2, 0.5rem);--button-border-radius: var(--radius-md, 0.5rem);--button-transition: var(--transition-normal, 0.3s ease);--button-size-sm: 36px;--button-size-md: 44px;--button-size-lg: 52px;--button-font-weight: 600;--button-shadow: var(--shadow-sm);--button-shadow-hover: var(--shadow-md);--hero-button-padding-x: var(--spacing-6, 1.5rem);--hero-button-padding-y: var(--spacing-3, 0.75rem);--hero-button-radius: var(--radius-full, 9999px);--hero-button-min-width: 200px;--hero-button-font-weight: 700;--hero-button-size-sm-padding-x: 1.5rem;--hero-button-size-sm-padding-y: 0.625rem;--hero-button-size-sm-min-width: 180px;--hero-button-size-sm-font-size: 0.875rem;--hero-button-size-md-padding-x: 2rem;--hero-button-size-md-padding-y: 0.75rem;--hero-button-size-md-min-width: 200px;--hero-button-size-md-font-size: 1rem;--hero-button-size-lg-padding-x: 2rem;--hero-button-size-lg-padding-y: 1rem;--hero-button-size-lg-min-width: 240px;--hero-button-size-lg-font-size: 1.125rem;--hero-button-border-width-primary: 2px;--hero-button-border-width-secondary: 2px;--hero-button-transition: 0.3s ease;--hero-button-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -4px rgba(0, 0, 0, 0.1);--hero-button-shadow-hover: 0 15px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1);--hero-button-transform-up: -4px;--hero-button-transform-down: 1px;--hero-button-icon-spacing: 0.5rem;--hero-button-primary-bg: rgba(15, 23, 42, 0.8);--hero-button-primary-border: transparent;--hero-button-primary-border-hover: transparent;--hero-button-gradient-angle: 90deg;--hero-button-gradient-from: #a3e635 !important;--hero-button-gradient-to: #34d399 !important;--hero-button-gradient-from-hover: #84cc16 !important;--hero-button-gradient-to-hover: #10b981 !important;--hero-button-secondary-bg: var(--color-gray-800);--hero-button-secondary-bg-hover: rgba(163, 230, 53, 0.1);--hero-button-secondary-border: rgba(163, 230, 53, 0.3);--hero-button-secondary-border-hover: rgba(163, 230, 53, 0.4);--hero-button-secondary-text: var(--color-white);--hero-button-focus-ring-color: rgba(59, 130, 246, 0.5);--hero-button-focus-ring-width: 4px;--size-hero-min-height: 80vh;--size-hero-content-width: 50%;--size-content-max-sm: 600px;--size-hero-image-width: 45%;--size-hero-image-max-width: 700px;--size-hero-image-max-width-mobile: 500px;--size-hero-grid-pattern: 20px;--size-hero-tooltip-width: 260px;--size-hero-floating-icon-translate: -10px;--size-hero-tooltip-margin-right: 8px;--size-hero-tooltip-margin-top: 2px;--size-hero-gap-buttons: 1.5rem;--size-hero-margin-buttons: 2rem;--size-hero-margin-feature-pills: 2.5rem;--size-hero-button-padding: 1rem 2rem;--size-hero-tooltip-transform-y: 10px;--size-hero-breakpoint-mobile: 992px;--size-hero-backdrop-blur: 10px;--size-hero-image-center-translate: -50%;--pos-hero-bg-x: center;--pos-hero-bg-y: center;--size-hero-gradient-x: 200%;--size-hero-gradient-y: 200%;--size-hero-clamp-middle: 2vw;--pos-hero-before-left-start: -100%;--pos-hero-before-left-end: 100%;--opacity-hero-white-shine: 0.2;--pos-hero-gradient-0: 0%;--pos-hero-gradient-50: 50%;--pos-hero-gradient-100: 100%;--color-hero-transparent: transparent;--cursor-hero-pointer: pointer;--white-space-hero-nowrap: nowrap;--text-decoration-hero-none: none;--border-hero-none: none;--transform-hero-none: none;--width-hero-full: 100%;--height-hero-full: 100%;--max-width-hero-full: 100%;--transition-hero-none: none;--cursor-hero-not-allowed: not-allowed;--margin-hero-auto: 0 auto;--pos-hero-auto: auto;--height-hero-auto: auto;--color-hero-current: currentColor;--hero-font-size-heading-base: 2.25rem;--hero-font-size-heading-md: 3rem;--hero-font-size-heading-lg: 3.75rem;--hero-line-height-heading: 1.2;--hero-margin-heading: 1rem;--hero-font-size-description-base: 1rem;--hero-font-size-description-md: 1.25rem;--hero-line-height-description: 1.5;--hero-margin-description: 2.5rem;--hero-description-max-width: 36rem;--hero-font-size-subtitle-base: 0.9375rem;--hero-font-size-subtitle-md: 1.125rem;--hero-line-height-subtitle: 1.5;--hero-margin-subtitle: 2rem;--hero-subtitle-max-width: 34rem;--hero-font-size-feature-pill: 0.875rem;--hero-icon-size-sm: 0.875rem;--hero-icon-size-md: 1.25rem;--hero-icon-margin-right: 0.5rem;--hero-padding-y: 5rem;--hero-padding-x: 1rem;--hero-content-max-width: 56rem;--hero-card-padding: 2rem;--hero-card-margin-bottom: 1.5rem;--hero-card-border-radius: 1.5rem;--hero-logo-margin-bottom: 2rem;--hero-gap-feature-pills: 0.75rem;--hero-margin-top-feature-pills: 2rem;--hero-feature-pill-padding-x: 1rem;--hero-feature-pill-padding-y: 0.5rem;--hero-feature-pill-border-radius: 9999px;--hero-divider-width: 6rem;--hero-divider-height: 0.25rem;--hero-divider-margin: 1.5rem;--pos-hero-element-relative: relative;--pos-hero-element-absolute: absolute;--pos-hero-top-0: 0;--pos-hero-left-0: 0;--pos-hero-right-0: 0;--pos-hero-bottom-0: 0;--pos-hero-bottom-100: 100%;--pos-hero-element-center: 50%;--z-hero-behind: 0;--z-hero-base: 1;--z-hero-content: 2;--z-hero-floating: 3;--z-hero-hover: 10;--z-hero-tooltip: 50;--display-hero-flex: flex;--display-hero-inline-flex: inline-flex;--display-hero-none: none;--flex-hero-row: row;--flex-hero-column: column;--flex-hero-center: center;--flex-hero-shrink-0: 0;--flex-hero-grow-1: 1;--align-hero-center: center;--align-hero-flex-start: flex-start;--justify-hero-center: center;--overflow-hero-hidden: hidden;--pointer-hero-none: none;--visibility-hero-visible: visible;--visibility-hero-hidden: hidden;--content-hero-empty: "";--text-align-hero-center: center;--weight-hero-heading: 800;--duration-hero-float-base: 6s;--duration-hero-float-odd: 8s;--duration-hero-float-even: 10s;--duration-hero-gradient: 8s;--duration-hero-button-transition: 0.3s;--duration-hero-pulse: 3s;--duration-hero-animation-delay: 1s;--ease-hero-gradient: ease;--scale-hero-icon-hover: 1.1;--scale-hero-button-hover-y: -4px;--angle-hero-gradient: 90deg;--angle-hero-float-rotate: 5deg;--pos-hero-gradient-start: 0% 50%;--pos-hero-gradient-mid: 100% 50%;--pos-hero-gradient-end: 0% 50%;--animation-hero-none: none;--color-hero-button-primary-text: var(--color-text-primary);--color-hero-signin-text: var(--color-text-primary);--color-hero-feature-pill-bg: rgba(15, 23, 42, 0.5);--color-hero-feature-pill-border: rgba(31, 41, 55, 0.5);--color-hero-tooltip-title: #a3e635;--color-hero-button-secondary-bg: rgba(15, 23, 42, 0.8);--color-hero-button-secondary-border: rgba(163, 230, 53, 0.3);--color-hero-button-secondary-hover-bg: rgba(163, 230, 53, 0.1);--color-hero-card-bg: rgba(31, 41, 55, 0.3);--color-hero-card-border: rgba(55, 65, 81, 1);--color-hero-text-primary: #ffffff;--color-hero-text-secondary: #d1d5db;--color-hero-gradient-from: #a3e635;--color-hero-gradient-to: #34d399;--opacity-hero-floating-icon: 0.5;--opacity-hero-tooltip-border: 0.3;--opacity-hero-lime-border: 0.3;--type-hero-tooltip-title: 14px;--type-hero-signin: 0.875rem;--weight-hero-button: 700;--weight-hero-tooltip-title: 500;--weight-hero-citron-text: 600;--shadow-hero-button-hover: 0 10px 25px -5px rgba(0, 0, 0, 0.3);--shadow-hero-secondary-button-hover: 0 10px 25px -5px rgba(0, 0, 0, 0.2);--shadow-hero-optimized: 0 10px 15px -5px rgba(0, 0, 0, 0.3);--shadow-hero-optimized-hover: 0 20px 30px -10px rgba(0, 0, 0, 0.4);--shadow-hero-citron-text: 0 0 6px rgba(163, 230, 53, 0.4);--shadow-hero-no-shadow: 0 0 0 rgba(var(--color-lime-rgb), 0);--shadow-hero-card: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);--opacity-disabled: 0.6;--opacity-hero-icon: 0.6;--opacity-hero-citron-pulse-min: 0.8;--opacity-hero-tooltip-hidden: 0;--opacity-hero-tooltip-visible: 1;--opacity-hero-icon-hover: 1;--size-hero-btn-gap: 0.5rem;--size-hero-btn-padding-x-sm: 1.25rem;--size-hero-btn-padding-x-md: 1.75rem;--size-hero-btn-padding-x-lg: 2rem;--size-hero-btn-padding-y-sm: 0.5rem;--size-hero-btn-padding-y-md: 0.75rem;--size-hero-btn-padding-y-lg: 1rem;--size-hero-btn-icon-margin: 8px;--pr-spacing-section: 3rem;--pr-spacing-card-gap: 1.5rem;--pr-color-bg: var(--color-background-light);--pr-color-heading: var(--color-text-primary);--pr-color-text: var(--color-text-muted);--pr-font-size-title: var(--font-size-large);--pr-font-weight-title: var(--font-weight-semibold);--pr-radius-card: var(--radius-md);--pr-shadow-card: var(--shadow-md);--pr-transition-hover: var(--transition-standard);--pr-transform-hover: translateY(-5px);--pr-transform-none: none;--pr-font-size-plan-name: 1.75rem;--pr-font-weight-plan-name: 700;--pr-line-height-plan-name: 1.2;--pr-font-size-price: 2.5rem;--pr-font-weight-price: 700;--pr-line-height-price: 1;--pr-shadow-blue: 0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -5px rgba(59, 130, 246, 0.04);--pr-shadow-lime: 0 10px 25px -5px rgba(132, 204, 22, 0.1), 0 8px 10px -5px rgba(132, 204, 22, 0.04);--pr-shadow-purple: 0 10px 25px -5px rgba(139, 92, 246, 0.1), 0 8px 10px -5px rgba(139, 92, 246, 0.04);--pr-animation-shake: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;--pr-animation-flash: flash 0.5s ease-out both;--pr-animation-fade-out: fadeOut 0.5s ease both;--pr-animation-fade-in: fadeIn 0.5s ease 0.3s both;--pr-animation-zoom-in: zoomIn 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s both;--pr-animation-float: float 15s infinite ease-in-out;--pr-animation-explode: explode 1s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards;--pr-transition-feature-icon: transform 0.2s ease;--pr-transform-feature-icon-hover: scale(1.1);--pr-display-badge: inline-flex;--pr-align-badge: center;--pr-font-weight-badge: 600;--pr-gap-badge: 0.25rem;--pr-scale-popular: 1.05;--pr-transform-popular-hover: scale(1.05) translateY(-5px);--pr-position-relative: relative;--pr-position-absolute: absolute;--pr-overflow-hidden: hidden;--pr-content-empty: "";--pr-top-0: 0;--pr-left-0: 0;--pr-width-full: 100%;--pr-height-full: 100%;--pr-opacity-bg-pattern: 0.5;--pr-z-index-bg: 0;--pr-background-size-full: 100%;--pr-bg-clip-text: text;--pr-webkit-bg-clip-text: text;--pr-moz-bg-clip-text: text;--pr-webkit-text-fill-transparent: transparent;--pr-moz-text-fill-transparent: transparent;--pr-border-radius-particle: 50%;--pr-opacity-particle: 0.4;--pr-pointer-events-none: none;--pr-right-0: 0;--pr-bottom-0: 0;--pr-transform-translatex-neg-2: translateX(-2px);--pr-transform-translatex-2: translateX(2px);--pr-opacity-full: 1;--pr-opacity-half: 0.5;--pr-opacity-zero: 0;--pr-transform-scale-small: scale(0.8);--pr-transform-scale-full: scale(1);--pr-transform-translate-y0-x0: translateY(0) translateX(0);--pr-transform-translate-y30-x15: translateY(30px) translateX(15px);--pr-transform-translate-neg-50: translate(-50%, -50%);--pr-bg-gradient-lime-teal: linear-gradient(135deg, rgba(132, 204, 22, 0.3), rgba(5, 150, 105, 0.2));--pr-bg-gradient-highlight: linear-gradient(to right, #84cc16, #059669);--pt-button-primary-bg: linear-gradient(to right, var(--color-violet-300, #a78bfa), var(--color-indigo-400, #818cf8));--pt-button-primary-color: var(--color-text-dark, #111827);--pt-button-primary-hover-y: -5px;--pt-button-primary-shadow: 0 10px 15px -3px rgba(167, 139, 250, 0.3);--color-violet-300: #a78bfa;--color-indigo-400: #818cf8;--vp-border-radius: 0.75rem;--vp-box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);--vp-container-padding-bottom: 1.75rem;--vp-color-bg: var(--color-gray-800);--vp-color-streaming-bg: var(--color-gray-900);--vp-color-overlay-bg: var(--color-ui-surface-alt, rgba(31, 41, 55, 0.8));--vp-color-loading-bg: var(--color-ui-surface, var(--color-gray-800));--vp-color-error-bg: var(--color-ui-surface, var(--color-gray-800));--vp-color-progress-bg: var(--color-gray-700);--vp-color-error-icon: var(--color-red-500);--vp-color-error-text: var(--color-text-secondary, var(--color-gray-300));--vp-color-time-text: var(--color-text-muted, var(--color-gray-400));--vp-control-button-size: 3rem;--vp-control-button-mobile-size: 2.5rem;--vp-control-button-bg: var(--pt-button-primary-bg);--vp-control-button-color: var(--color-text-primary, var(--color-white));--vp-control-button-shadow: var(--pt-button-primary-shadow, 0 2px 8px rgba(0, 0, 0, 0.3));--vp-control-button-hover-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);--vp-control-button-focus-outline: 2px solid var(--color-accent-400, var(--color-violet-300));--vp-control-button-focus-offset: 2px;--vp-progress-height: 4px;--vp-progress-radius: 0.5rem;--vp-progress-bar-bg: var(--pt-button-primary-bg);--vp-gym-accent-gradient: linear-gradient(to right, var(--color-accent-300), var(--color-accent-500));--vp-sports-accent-gradient: linear-gradient(to right, var(--color-accent-300), var(--color-accent-500));--vp-wellness-accent-gradient: linear-gradient(to right, var(--color-accent-300), var(--color-accent-500));--vp-transition-standard: 0.3s ease;--vp-transition-fast: 0.1s linear;--vp-animation-spin-duration: 1s;--journey-bg-color: var(--color-slate-900);--journey-card-bg: var(--color-slate-800);--journey-card-border: var(--color-slate-700);--journey-btn-radius: var(--radii-xl);--journey-btn-padding-x: 1.5rem;--journey-btn-padding-x-large: 2.5rem;--journey-btn-padding-y: 0.875rem;--journey-btn-transition: var(--transition-standard);--journey-feature-card-radius: var(--radii-lg);--journey-feature-card-border-width: 1px;--journey-feature-icon-size: 1.5rem;--journey-step-card-radius: var(--radii-xl);--journey-step-card-border-width: 1px;--journey-step-icon-size: 2.5rem;--journey-step-number-size: 1.75rem;--journey-step-number-radius: var(--radii-full);--card-bg-color: var(--color-surface);--card-shadow: var(--shadow-md);--card-border-width: 1px;--card-border-color: var(--color-border);--input-height: 2.5rem;--input-padding-x: var(--spacing-3);--input-padding-y: var(--spacing-2);--input-border-radius: var(--radius-md);--input-border-width: 1px;--input-focus-ring-width: 2px;--input-focus-ring-color: var(--color-primary-light);--nav-height: 4rem;--nav-padding-x: var(--spacing-6);--nav-item-gap: var(--spacing-8);--nav-font-weight: var(--font-weight-medium);--modal-border-radius: var(--radius-lg);--modal-padding: var(--spacing-6);--modal-shadow: var(--shadow-lg);--modal-backdrop-opacity: 0.5;--modal-max-width: 500px;--modal-transition: var(--transition-all);--tooltip-bg-color: var(--color-gray-800);--tooltip-text-color: var(--color-white);--tooltip-border-radius: var(--radius-sm);--tooltip-padding-x: var(--spacing-2);--tooltip-padding-y: var(--spacing-1);--tooltip-arrow-size: 5px;--tooltip-font-size: var(--font-size-xs);--tooltip-max-width: 200px;--badge-padding-x: var(--spacing-2);--badge-padding-y: var(--spacing-1);--badge-border-radius: var(--radius-full);--badge-font-size: var(--font-size-xs);--badge-font-weight: var(--font-weight-medium)}[data-theme=gym]{--journey-bg-color: var(--color-slate-900);--journey-card-bg: var(--color-slate-800);--journey-card-border: var(--color-violet-700)}[data-theme=sports]{--journey-bg-color: var(--color-slate-900);--journey-card-bg: var(--color-slate-800);--journey-card-border: var(--color-cyan-700)}[data-theme=wellness]{--journey-bg-color: var(--color-slate-900);--journey-card-bg: var(--color-slate-800);--journey-card-border: var(--color-teal-700)}[data-theme=modern]{--journey-bg-color: var(--color-slate-900);--journey-card-bg: var(--color-slate-800);--journey-card-border: var(--color-amber-700)}.btn{display:inline-flex;align-items:center;justify-content:center;padding:var(--button-padding-y, var(--spacing-2)) var(--button-padding-x, var(--spacing-4));border-radius:var(--button-border-radius, var(--radius-md));font-weight:var(--button-font-weight, var(--font-weight-semibold));transition:var(--button-transition, var(--transition-standard));border:none;cursor:pointer}.btn:disabled{opacity:var(--opacity-disabled, 0.65);cursor:not-allowed}.btn-primary{background-color:var(--color-primary);color:var(--color-text-inverse)}.btn-primary:hover:not(:disabled){background-color:var(--color-primary-dark)}.btn-primary:active:not(:disabled){background-color:var(--color-primary-dark);box-shadow:var(--shadow-inner)}.btn-primary:focus-visible{outline:none;box-shadow:0 0 0 2px var(--color-primary-light)}[data-theme=gym] .btn-primary{background-color:var(--color-gym-primary, var(--color-primary))}[data-theme=sports] .btn-primary{background-color:var(--color-sports-primary, var(--color-primary))}[data-theme=wellness] .btn-primary{background-color:var(--color-wellness-primary, var(--color-primary))}.btn-secondary{background-color:var(--color-secondary);color:var(--color-text-inverse)}.btn-secondary:hover:not(:disabled){background-color:var(--color-secondary-dark)}.btn-secondary:active:not(:disabled){background-color:var(--color-secondary-dark);box-shadow:var(--shadow-inner)}.btn-secondary:focus-visible{outline:none;box-shadow:0 0 0 2px var(--color-secondary-light)}[data-theme=gym] .btn-secondary{background-color:var(--color-gym-secondary, var(--color-secondary))}[data-theme=sports] .btn-secondary{background-color:var(--color-sports-secondary, var(--color-secondary))}[data-theme=wellness] .btn-secondary{background-color:var(--color-wellness-secondary, var(--color-secondary))}.btn-sm{height:var(--size-btn-sm, 36px);padding:0 var(--spacing-3);font-size:var(--type-small)}.btn-md{height:var(--size-btn-md, 44px);padding:0 var(--spacing-4);font-size:var(--type-base)}.btn-lg{height:var(--size-btn-lg, 52px);padding:0 var(--spacing-6);font-size:var(--type-lg)}',"",{version:3,sources:["webpack://./src/styles/design-system/colors-next.scss","webpack://./src/styles/design-system/typography.scss","webpack://./src/styles/design-system/spacing.scss","webpack://./src/styles/design-system/radii.scss","webpack://./src/styles/design-system/shadows.scss","webpack://./src/styles/design-system/transitions.scss","webpack://./src/styles/design-system/backgrounds.scss","webpack://./src/styles/design-system/breakpoints.scss","webpack://./src/styles/design-system/component-tokens.scss","webpack://./src/features/shared/Button/styles/Button.scss"],names:[],mappings:"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",sourcesContent:[`:root {
    // Primary color (blue) scale
    --color-primary-50: #ebf8ff;
    --color-primary-100: #bee3f8;
    --color-primary-200: #90cdf4;
    --color-primary-300: #63b3ed;
    --color-primary-400: #4299e1;
    --color-primary-500: #3498db;
    --color-primary-600: #2980b9;
    --color-primary-700: #2c5282;
    --color-primary-800: #2a4365;
    --color-primary-900: #1a365d;

    // Accent color (lime) scale - based on #ddff0e
    --color-accent-50: #faffed;
    --color-accent-100: #f3ffcc;
    --color-accent-200: #ebff99;
    --color-accent-300: #e2ff66;
    --color-accent-400: #ddff0e;
    --color-accent-500: #b3cc0b;
    --color-accent-600: #849909;
    --color-accent-700: #566606;
    --color-accent-800: #293303;
    --color-accent-900: #141a01;

    // Gray scale
    --color-gray-50: #f9fafb;
    --color-gray-100: #f3f4f6;
    --color-gray-200: #e5e7eb;
    --color-gray-300: #d1d5db;
    --color-gray-400: #9ca3af;
    --color-gray-500: #6b7280;
    --color-gray-600: #4b5563;
    --color-gray-700: #374151;
    --color-gray-800: #1f2937;
    --color-gray-900: #111827;

    // Semantic color mapping
    --color-brand-primary: var(--color-primary-500);
    --color-brand-accent: var(--color-accent-400);

    // UI state colors
    --color-ui-background: var(--color-gray-900);
    --color-ui-surface: var(--color-gray-800);
    --color-ui-surface-alt: rgba(31, 41, 55, 0.8);
    --color-ui-border: var(--color-gray-700);

    // Text colors
    --color-text-primary: var(--color-gray-50);
    --color-text-secondary: var(--color-gray-300);
    --color-text-accent: var(--color-accent-400);
    --color-text-muted: var(--color-gray-400);
    --color-text-inverse: var(--color-gray-900);

    // Component colors
    --color-hero-heading: var(--color-text-primary);
    --color-hero-paragraph: var(--color-text-secondary);
    --color-hero-highlight: var(--color-text-accent);
    --color-hero-button-primary: var(--color-brand-accent);
    --color-hero-button-primary-hover: var(--color-accent-500);
    --color-hero-button-secondary-bg: var(--color-ui-surface-alt);
    --color-hero-tooltip-bg: var(--color-ui-surface);

    // RGB variants for opacity operations
    --color-accent-400-rgb: 221, 255, 14;
    --color-primary-500-rgb: 52, 152, 219;
    --color-gray-900-rgb: 17, 24, 39;

    // Alpha variants
    --color-accent-400-alpha-10: rgba(var(--color-accent-400-rgb), 0.1);
    --color-accent-400-alpha-30: rgba(var(--color-accent-400-rgb), 0.3);
    --color-accent-400-alpha-50: rgba(var(--color-accent-400-rgb), 0.5);
    --color-accent-400-alpha-70: rgba(var(--color-accent-400-rgb), 0.7);
}

/**
 * Theme Variants
 * 
 * Each theme overrides specific color tokens while inheriting the rest
 * from the default theme (root scope).
 */

/* Gym Theme - Uses violet/purple palette */
[data-theme="gym"] {
    // Accent color (violet) scale
    --color-accent-50: #f5f3ff;
    --color-accent-100: #ede9fe;
    --color-accent-200: #ddd6fe;
    --color-accent-300: #c4b5fd;
    --color-accent-400: #8b5cf6;
    --color-accent-500: #7c3aed;
    --color-accent-600: #6d28d9;
    --color-accent-700: #5b21b6;
    --color-accent-800: #4c1d95;
    --color-accent-900: #2e1065;

    // RGB variants for opacity operations (overrides)
    --color-accent-400-rgb: 139, 92, 246;

    // Alpha variants are automatically inherited since they use the RGB variable
}

/* Sports Theme - Uses blue/cyan palette */
[data-theme="sports"] {
    // Accent color (blue) scale
    --color-accent-50: #eff6ff;
    --color-accent-100: #dbeafe;
    --color-accent-200: #bfdbfe;
    --color-accent-300: #93c5fd;
    --color-accent-400: #38bdf8;
    --color-accent-500: #0ea5e9;
    --color-accent-600: #0284c7;
    --color-accent-700: #0369a1;
    --color-accent-800: #075985;
    --color-accent-900: #0c4a6e;

    // RGB variants for opacity operations (overrides)
    --color-accent-400-rgb: 56, 189, 248;
}

/* Wellness Theme - Uses teal/green palette */
[data-theme="wellness"] {
    // Accent color (teal) scale
    --color-accent-50: #f0fdfa;
    --color-accent-100: #ccfbf1;
    --color-accent-200: #99f6e4;
    --color-accent-300: #5eead4;
    --color-accent-400: #2dd4bf;
    --color-accent-500: #14b8a6;
    --color-accent-600: #0d9488;
    --color-accent-700: #0f766e;
    --color-accent-800: #115e59;
    --color-accent-900: #134e4a;

    // RGB variants for opacity operations (overrides)
    --color-accent-400-rgb: 45, 212, 191;
}`,`// Typography system
// Font families, sizes, weights, and line heights

// Font families
$font-family-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
$font-family-display: 'Poppins', $font-family-sans;
$font-family-mono: 'Roboto Mono', SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;

// Font sizes (in rem)
$font-size-xs: 0.75rem; // 12px
$font-size-sm: 0.875rem; // 14px
$font-size-base: 1rem; // 16px
$font-size-md: 1.125rem; // 18px
$font-size-lg: 1.25rem; // 20px
$font-size-xl: 1.5rem; // 24px
$font-size-2xl: 1.875rem; // 30px
$font-size-3xl: 2.25rem; // 36px
$font-size-4xl: 3rem; // 48px
$font-size-5xl: 3.75rem; // 60px
$font-size-6xl: 4.5rem; // 72px

// Font weights
$font-weight-thin: 100;
$font-weight-extralight: 200;
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
$font-weight-extrabold: 800;
$font-weight-black: 900;

// Line heights
$line-height-none: 1;
$line-height-tight: 1.25;
$line-height-snug: 1.375;
$line-height-normal: 1.5;
$line-height-relaxed: 1.625;
$line-height-loose: 2;

// Letter spacing
$letter-spacing-tighter: -0.05em;
$letter-spacing-tight: -0.025em;
$letter-spacing-normal: 0;
$letter-spacing-wide: 0.025em;
$letter-spacing-wider: 0.05em;
$letter-spacing-widest: 0.1em;

// CSS Variables
:root {
    // Font families
    --font-family-sans: #{$font-family-sans};
    --font-family-display: #{$font-family-display};
    --font-family-mono: #{$font-family-mono};

    // Font sizes
    --font-size-xs: #{$font-size-xs};
    --font-size-sm: #{$font-size-sm};
    --font-size-base: #{$font-size-base};
    --font-size-md: #{$font-size-md};
    --font-size-lg: #{$font-size-lg};
    --font-size-xl: #{$font-size-xl};
    --font-size-2xl: #{$font-size-2xl};
    --font-size-3xl: #{$font-size-3xl};
    --font-size-4xl: #{$font-size-4xl};
    --font-size-5xl: #{$font-size-5xl};
    --font-size-6xl: #{$font-size-6xl};

    // Font weights
    --font-weight-thin: #{$font-weight-thin};
    --font-weight-extralight: #{$font-weight-extralight};
    --font-weight-light: #{$font-weight-light};
    --font-weight-normal: #{$font-weight-normal};
    --font-weight-medium: #{$font-weight-medium};
    --font-weight-semibold: #{$font-weight-semibold};
    --font-weight-bold: #{$font-weight-bold};
    --font-weight-extrabold: #{$font-weight-extrabold};
    --font-weight-black: #{$font-weight-black};

    // Line heights
    --line-height-none: #{$line-height-none};
    --line-height-tight: #{$line-height-tight};
    --line-height-snug: #{$line-height-snug};
    --line-height-normal: #{$line-height-normal};
    --line-height-relaxed: #{$line-height-relaxed};
    --line-height-loose: #{$line-height-loose};

    // Letter spacing
    --letter-spacing-tighter: #{$letter-spacing-tighter};
    --letter-spacing-tight: #{$letter-spacing-tight};
    --letter-spacing-normal: #{$letter-spacing-normal};
    --letter-spacing-wide: #{$letter-spacing-wide};
    --letter-spacing-wider: #{$letter-spacing-wider};
    --letter-spacing-widest: #{$letter-spacing-widest};
}`,`// Spacing system
// Consistent spacing values for margins, paddings, and gaps

// Base spacing unit (in rem)
$spacing-unit: 0.25rem; // 4px

// Spacing scale
$spacing-0: 0;
$spacing-1: $spacing-unit; // 4px
$spacing-2: $spacing-unit * 2; // 8px
$spacing-3: $spacing-unit * 3; // 12px
$spacing-4: $spacing-unit * 4; // 16px
$spacing-5: $spacing-unit * 5; // 20px
$spacing-6: $spacing-unit * 6; // 24px
$spacing-8: $spacing-unit * 8; // 32px
$spacing-10: $spacing-unit * 10; // 40px
$spacing-12: $spacing-unit * 12; // 48px
$spacing-16: $spacing-unit * 16; // 64px
$spacing-20: $spacing-unit * 20; // 80px
$spacing-24: $spacing-unit * 24; // 96px
$spacing-32: $spacing-unit * 32; // 128px
$spacing-40: $spacing-unit * 40; // 160px
$spacing-48: $spacing-unit * 48; // 192px
$spacing-56: $spacing-unit * 56; // 224px
$spacing-64: $spacing-unit * 64; // 256px

// Container widths
$container-sm: 640px;
$container-md: 768px;
$container-lg: 1024px;
$container-xl: 1280px;
$container-2xl: 1536px;

// Section spacing
$section-spacing-y: $spacing-16;
$section-spacing-y-mobile: $spacing-8;

// Component spacing
$component-spacing: $spacing-6;
$component-spacing-sm: $spacing-3;
$component-spacing-lg: $spacing-8;

// CSS Variables
:root {
    // Base spacing
    --spacing-unit: #{$spacing-unit};

    // Spacing scale
    --spacing-0: #{$spacing-0};
    --spacing-1: #{$spacing-1};
    --spacing-2: #{$spacing-2};
    --spacing-3: #{$spacing-3};
    --spacing-4: #{$spacing-4};
    --spacing-5: #{$spacing-5};
    --spacing-6: #{$spacing-6};
    --spacing-8: #{$spacing-8};
    --spacing-10: #{$spacing-10};
    --spacing-12: #{$spacing-12};
    --spacing-16: #{$spacing-16};
    --spacing-20: #{$spacing-20};
    --spacing-24: #{$spacing-24};
    --spacing-32: #{$spacing-32};
    --spacing-40: #{$spacing-40};
    --spacing-48: #{$spacing-48};
    --spacing-56: #{$spacing-56};
    --spacing-64: #{$spacing-64};

    // Container widths
    --container-sm: #{$container-sm};
    --container-md: #{$container-md};
    --container-lg: #{$container-lg};
    --container-xl: #{$container-xl};
    --container-2xl: #{$container-2xl};

    // Section spacing
    --section-spacing-y: #{$section-spacing-y};
    --section-spacing-y-mobile: #{$section-spacing-y-mobile};

    // Component spacing
    --component-spacing: #{$component-spacing};
    --component-spacing-sm: #{$component-spacing-sm};
    --component-spacing-lg: #{$component-spacing-lg};
}`,`:root {
    --radius-none: 0;
    --radius-sm: 0.125rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-full: 9999px;
}`,`:root {
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    --shadow-xl: 0 15px 35px rgba(0, 0, 0, 0.2);
    --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    --shadow-focus-ring: 0 0 0 2px #fff, 0 0 0 4px var(--color-primary);

    /* Button-specific shadows */
    --shadow-button: 0 6px 15px rgba(0, 0, 0, 0.15);
    --shadow-button-hover: 0 8px 20px rgba(0, 0, 0, 0.2);
    --shadow-button-active: 0 4px 8px rgba(0, 0, 0, 0.1);
    --shadow-button-primary: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-button-primary-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}`,`// Transitions and Animations
// Consistent timings and easing functions for transitions and animations

// Transition durations (in ms)
$transition-duration-fast: 150ms;
$transition-duration-normal: 250ms;
$transition-duration-slow: 350ms;
$transition-duration-slower: 500ms;

// Easing functions
$transition-ease: ease;
$transition-ease-in: ease-in;
$transition-ease-out: ease-out;
$transition-ease-in-out: ease-in-out;
$transition-linear: linear;

// Cubic bezier curves for more precise control
$transition-bounce: cubic-bezier(0.34, 1.56, 0.64, 1); // Slight "bounce" effect
$transition-emphasis: cubic-bezier(0.2, 0.9, 0.4, 1.0); // Emphasis on exit
$transition-smooth: cubic-bezier(0.4, 0.0, 0.2, 1.0); // Google's standard curve

// Animation durations (in ms)
$animation-duration-short: 300ms;
$animation-duration-normal: 500ms;
$animation-duration-long: 800ms;

// Common transitions
$transition-color: color $transition-duration-normal $transition-ease;
$transition-opacity: opacity $transition-duration-normal $transition-ease;
$transition-transform: transform $transition-duration-normal $transition-ease;
$transition-shadow: box-shadow $transition-duration-normal $transition-ease;
$transition-all: all $transition-duration-normal $transition-ease;

// CSS Variables
:root {
    // Transition durations
    --transition-duration-fast: #{$transition-duration-fast};
    --transition-duration-normal: #{$transition-duration-normal};
    --transition-duration-slow: #{$transition-duration-slow};
    --transition-duration-slower: #{$transition-duration-slower};

    // Easing functions
    --transition-ease: #{$transition-ease};
    --transition-ease-in: #{$transition-ease-in};
    --transition-ease-out: #{$transition-ease-out};
    --transition-ease-in-out: #{$transition-ease-in-out};
    --transition-linear: #{$transition-linear};

    // Cubic bezier curves
    --transition-bounce: #{$transition-bounce};
    --transition-emphasis: #{$transition-emphasis};
    --transition-smooth: #{$transition-smooth};

    // Animation durations
    --animation-duration-short: #{$animation-duration-short};
    --animation-duration-normal: #{$animation-duration-normal};
    --animation-duration-long: #{$animation-duration-long};

    // Common transitions
    --transition-color: #{$transition-color};
    --transition-opacity: #{$transition-opacity};
    --transition-transform: #{$transition-transform};
    --transition-shadow: #{$transition-shadow};
    --transition-all: #{$transition-all};
}`,`:root {
    --bg-page: var(--color-background);
    --bg-surface: var(--color-surface);
}`,`/**
 * Breakpoint tokens
 * Standard breakpoints for responsive design
 */

:root {
    /* Breakpoints */
    --breakpoint-sm: 576px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 992px;
    --breakpoint-xl: 1200px;
    --breakpoint-2xl: 1400px;
} `,`/**
 * Component-specific tokens
 * Organized by component type
 */

:root {
    /* Tooltip */
    --size-tooltip-arrow: 12px;

    /* Button Base Tokens */
    --button-padding-x: var(--spacing-4, 1rem);
    --button-padding-y: var(--spacing-2, 0.5rem);
    --button-border-radius: var(--radius-md, 0.5rem);
    --button-transition: var(--transition-normal, 0.3s ease);
    --button-size-sm: 36px;
    --button-size-md: 44px;
    --button-size-lg: 52px;
    --button-font-weight: 600;
    --button-shadow: var(--shadow-sm);
    --button-shadow-hover: var(--shadow-md);
    
    /* Hero Button Direct Tokens - Simplified Inheritance */
    /* Base Dimensions */
    --hero-button-padding-x: var(--spacing-6, 1.5rem);
    --hero-button-padding-y: var(--spacing-3, 0.75rem);
    --hero-button-radius: var(--radius-full, 9999px);
    --hero-button-min-width: 200px;
    --hero-button-font-weight: 700;
    
    /* Size Variants */
    --hero-button-size-sm-padding-x: 1.5rem;
    --hero-button-size-sm-padding-y: 0.625rem;
    --hero-button-size-sm-min-width: 180px;
    --hero-button-size-sm-font-size: 0.875rem;
    
    --hero-button-size-md-padding-x: 2rem;
    --hero-button-size-md-padding-y: 0.75rem;
    --hero-button-size-md-min-width: 200px;
    --hero-button-size-md-font-size: 1rem;
    
    --hero-button-size-lg-padding-x: 2rem;
    --hero-button-size-lg-padding-y: 1rem;
    --hero-button-size-lg-min-width: 240px;
    --hero-button-size-lg-font-size: 1.125rem;
    
    /* Border and Structure */
    --hero-button-border-width-primary: 2px;
    --hero-button-border-width-secondary: 2px;
    
    /* Effects and Transitions */
    --hero-button-transition: 0.3s ease;
    --hero-button-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    --hero-button-shadow-hover: 0 15px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    --hero-button-transform-up: -4px;
    --hero-button-transform-down: 1px;
    
    /* Icon Layout */
    --hero-button-icon-spacing: 0.5rem;
    
    /* Default Theme Colors (will be overridden by theme variants) */
    --hero-button-primary-bg: rgba(15, 23, 42, 0.8);
    --hero-button-primary-border: transparent;
    --hero-button-primary-border-hover: transparent;
    --hero-button-gradient-angle: 90deg;
    --hero-button-gradient-from: #a3e635 !important;
    --hero-button-gradient-to: #34d399 !important;
    --hero-button-gradient-from-hover: #84cc16 !important;
    --hero-button-gradient-to-hover: #10b981 !important;
    
    --hero-button-secondary-bg: var(--color-gray-800);
    --hero-button-secondary-bg-hover: rgba(163, 230, 53, 0.1);
    --hero-button-secondary-border: rgba(163, 230, 53, 0.3);
    --hero-button-secondary-border-hover: rgba(163, 230, 53, 0.4);
    --hero-button-secondary-text: var(--color-white);
    
    /* Focus State */
    --hero-button-focus-ring-color: rgba(59, 130, 246, 0.5);
    --hero-button-focus-ring-width: 4px;
    
    /* Hero */
    --size-hero-min-height: 80vh;
    --size-hero-content-width: 50%;
    --size-content-max-sm: 600px;
    --size-hero-image-width: 45%;
    --size-hero-image-max-width: 700px;
    --size-hero-image-max-width-mobile: 500px;
    --size-hero-grid-pattern: 20px;
    --size-hero-tooltip-width: 260px;
    --size-hero-floating-icon-translate: -10px;
    --size-hero-tooltip-margin-right: 8px;
    --size-hero-tooltip-margin-top: 2px;
    --size-hero-gap-buttons: 1.5rem;
    --size-hero-margin-buttons: 2rem;
    --size-hero-margin-feature-pills: 2.5rem;
    --size-hero-button-padding: 1rem 2rem;
    --size-hero-tooltip-transform-y: 10px;
    --size-hero-breakpoint-mobile: 992px;
    --size-hero-backdrop-blur: 10px;
    --size-hero-image-center-translate: -50%;
    --pos-hero-bg-x: center;
    --pos-hero-bg-y: center;
    --size-hero-gradient-x: 200%;
    --size-hero-gradient-y: 200%;
    --size-hero-clamp-middle: 2vw;
    --pos-hero-before-left-start: -100%;
    --pos-hero-before-left-end: 100%;
    --opacity-hero-white-shine: 0.2;
    --pos-hero-gradient-0: 0%;
    --pos-hero-gradient-50: 50%;
    --pos-hero-gradient-100: 100%;
    --color-hero-transparent: transparent;
    --cursor-hero-pointer: pointer;
    --white-space-hero-nowrap: nowrap;
    --text-decoration-hero-none: none;
    --border-hero-none: none;
    --transform-hero-none: none;
    --width-hero-full: 100%;
    --height-hero-full: 100%;
    --max-width-hero-full: 100%;
    --transition-hero-none: none;
    --cursor-hero-not-allowed: not-allowed;
    --margin-hero-auto: 0 auto;
    --pos-hero-auto: auto;
    --height-hero-auto: auto;
    --color-hero-current: currentColor;

    /* Hero Typography Additions */
    --hero-font-size-heading-base: 2.25rem;
    /* text-4xl */
    --hero-font-size-heading-md: 3rem;
    /* md:text-5xl */
    --hero-font-size-heading-lg: 3.75rem;
    /* lg:text-6xl */
    --hero-line-height-heading: 1.2;
    --hero-margin-heading: 1rem;
    --hero-font-size-description-base: 1rem;
    /* text-base */
    --hero-font-size-description-md: 1.25rem;
    /* md:text-xl */
    --hero-line-height-description: 1.5;
    --hero-margin-description: 2.5rem;
    /* mb-10 */
    --hero-description-max-width: 36rem;
    /* max-w-2xl */

    /* Hero Subtitle Tokens */
    --hero-font-size-subtitle-base: 0.9375rem;
    /* Slightly smaller than description */
    --hero-font-size-subtitle-md: 1.125rem;
    /* md:text-lg */
    --hero-line-height-subtitle: 1.5;
    --hero-margin-subtitle: 2rem;
    /* mb-8 */
    --hero-subtitle-max-width: 34rem;
    /* max-w-xl */

    --hero-font-size-feature-pill: 0.875rem;
    /* text-sm */
    --hero-icon-size-sm: 0.875rem;
    /* w-3.5 h-3.5 */
    --hero-icon-size-md: 1.25rem;
    /* w-5 h-5 */
    --hero-icon-margin-right: 0.5rem;
    /* mr-2 */

    /* Hero Layout Additions */
    --hero-padding-y: 5rem;
    /* py-20 */
    --hero-padding-x: 1rem;
    /* px-4 */
    --hero-content-max-width: 56rem;
    /* max-w-4xl */
    --hero-card-padding: 2rem;
    /* p-8 */
    --hero-card-margin-bottom: 1.5rem;
    /* mb-6 */
    --hero-card-border-radius: 1.5rem;
    /* rounded-3xl */
    --hero-logo-margin-bottom: 2rem;
    /* mb-8 */
    --hero-gap-feature-pills: 0.75rem;
    /* gap-3 */
    --hero-margin-top-feature-pills: 2rem;
    /* mt-8 */
    --hero-feature-pill-padding-x: 1rem;
    /* px-4 */
    --hero-feature-pill-padding-y: 0.5rem;
    /* py-2 */
    --hero-feature-pill-border-radius: 9999px;
    /* rounded-full */
    --hero-divider-width: 6rem;
    /* w-24 */
    --hero-divider-height: 0.25rem;
    /* h-1 */
    --hero-divider-margin: 1.5rem;
    /* mb-6 */

    /* Hero Positions and Layout */
    --pos-hero-element-relative: relative;
    --pos-hero-element-absolute: absolute;
    --pos-hero-top-0: 0;
    --pos-hero-left-0: 0;
    --pos-hero-right-0: 0;
    --pos-hero-bottom-0: 0;
    --pos-hero-bottom-100: 100%;
    --pos-hero-element-center: 50%;
    --z-hero-behind: 0;
    --z-hero-base: 1;
    --z-hero-content: 2;
    --z-hero-floating: 3;
    --z-hero-hover: 10;
    --z-hero-tooltip: 50;

    /* Hero Display and Flex properties */
    --display-hero-flex: flex;
    --display-hero-inline-flex: inline-flex;
    --display-hero-none: none;
    --flex-hero-row: row;
    --flex-hero-column: column;
    --flex-hero-center: center;
    --flex-hero-shrink-0: 0;
    --flex-hero-grow-1: 1;
    --align-hero-center: center;
    --align-hero-flex-start: flex-start;
    --justify-hero-center: center;

    /* Hero Visual Properties */
    --overflow-hero-hidden: hidden;
    --pointer-hero-none: none;
    --visibility-hero-visible: visible;
    --visibility-hero-hidden: hidden;
    --content-hero-empty: '';
    --text-align-hero-center: center;
    --weight-hero-heading: 800;

    /* Hero Animations */
    --duration-hero-float-base: 6s;
    --duration-hero-float-odd: 8s;
    --duration-hero-float-even: 10s;
    --duration-hero-gradient: 8s;
    --duration-hero-button-transition: 0.3s;
    --duration-hero-pulse: 3s;
    --duration-hero-animation-delay: 1s;
    --ease-hero-gradient: ease;
    --scale-hero-icon-hover: 1.1;
    --scale-hero-button-hover-y: -4px;
    --angle-hero-gradient: 90deg;
    --angle-hero-float-rotate: 5deg;
    --pos-hero-gradient-start: 0% 50%;
    --pos-hero-gradient-mid: 100% 50%;
    --pos-hero-gradient-end: 0% 50%;
    --animation-hero-none: none;

    /* Hero Colors */
    --color-hero-button-primary-text: var(--color-text-primary);
    --color-hero-signin-text: var(--color-text-primary);
    --color-hero-feature-pill-bg: rgba(15, 23, 42, 0.5);
    --color-hero-feature-pill-border: rgba(31, 41, 55, 0.5);
    --color-hero-tooltip-title: #a3e635;
    --color-hero-button-secondary-bg: rgba(15, 23, 42, 0.8);
    --color-hero-button-secondary-border: rgba(163, 230, 53, 0.3);
    --color-hero-button-secondary-hover-bg: rgba(163, 230, 53, 0.1);
    --color-hero-card-bg: rgba(31, 41, 55, 0.3);
    /* bg-gray-800/30 */
    --color-hero-card-border: rgba(55, 65, 81, 1);
    /* border-gray-700 */
    --color-hero-text-primary: #ffffff;
    /* text-white */
    --color-hero-text-secondary: #d1d5db;
    /* text-gray-300 */
    --color-hero-gradient-from: #a3e635;
    /* from-lime-300 */
    --color-hero-gradient-to: #34d399;
    /* to-emerald-400 */
    --opacity-hero-floating-icon: 0.5;
    --opacity-hero-tooltip-border: 0.3;
    --opacity-hero-lime-border: 0.3;

    /* Hero Text */
    --type-hero-tooltip-title: 14px;
    --type-hero-signin: 0.875rem;
    --weight-hero-button: 700;
    --weight-hero-tooltip-title: 500;
    --weight-hero-citron-text: 600;

    /* Hero Shadows */
    --shadow-hero-button-hover: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    --shadow-hero-secondary-button-hover: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
    --shadow-hero-optimized: 0 10px 15px -5px rgba(0, 0, 0, 0.3);
    --shadow-hero-optimized-hover: 0 20px 30px -10px rgba(0, 0, 0, 0.4);
    --shadow-hero-citron-text: 0 0 6px rgba(163, 230, 53, 0.4);
    --shadow-hero-no-shadow: 0 0 0 rgba(var(--color-lime-rgb), 0);
    --shadow-hero-card: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    /* shadow-xl */

    /* Hero Opacity */
    --opacity-disabled: 0.6;
    --opacity-hero-icon: 0.6;
    --opacity-hero-citron-pulse-min: 0.8;
    --opacity-hero-tooltip-hidden: 0;
    --opacity-hero-tooltip-visible: 1;
    --opacity-hero-icon-hover: 1;

    /* HeroButton */
    --size-hero-btn-gap: 0.5rem;
    --size-hero-btn-padding-x-sm: 1.25rem;
    --size-hero-btn-padding-x-md: 1.75rem;
    --size-hero-btn-padding-x-lg: 2rem;
    --size-hero-btn-padding-y-sm: 0.5rem;
    --size-hero-btn-padding-y-md: 0.75rem;
    --size-hero-btn-padding-y-lg: 1rem;
    --size-hero-btn-icon-margin: 8px;

    /* Pricing (pr) */
    --pr-spacing-section: 3rem;
    --pr-spacing-card-gap: 1.5rem;
    --pr-color-bg: var(--color-background-light);
    --pr-color-heading: var(--color-text-primary);
    --pr-color-text: var(--color-text-muted);
    --pr-font-size-title: var(--font-size-large);
    --pr-font-weight-title: var(--font-weight-semibold);
    --pr-radius-card: var(--radius-md);
    --pr-shadow-card: var(--shadow-md);
    --pr-transition-hover: var(--transition-standard);
    --pr-transform-hover: translateY(-5px);
    --pr-transform-none: none;
    --pr-font-size-plan-name: 1.75rem;
    --pr-font-weight-plan-name: 700;
    --pr-line-height-plan-name: 1.2;
    --pr-font-size-price: 2.5rem;
    --pr-font-weight-price: 700;
    --pr-line-height-price: 1;
    --pr-shadow-blue: 0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -5px rgba(59, 130, 246, 0.04);
    --pr-shadow-lime: 0 10px 25px -5px rgba(132, 204, 22, 0.1), 0 8px 10px -5px rgba(132, 204, 22, 0.04);
    --pr-shadow-purple: 0 10px 25px -5px rgba(139, 92, 246, 0.1), 0 8px 10px -5px rgba(139, 92, 246, 0.04);
    --pr-animation-shake: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    --pr-animation-flash: flash 0.5s ease-out both;
    --pr-animation-fade-out: fadeOut 0.5s ease both;
    --pr-animation-fade-in: fadeIn 0.5s ease 0.3s both;
    --pr-animation-zoom-in: zoomIn 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s both;
    --pr-animation-float: float 15s infinite ease-in-out;
    --pr-animation-explode: explode 1s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards;
    --pr-transition-feature-icon: transform 0.2s ease;
    --pr-transform-feature-icon-hover: scale(1.1);
    --pr-display-badge: inline-flex;
    --pr-align-badge: center;
    --pr-font-weight-badge: 600;
    --pr-gap-badge: 0.25rem;
    --pr-scale-popular: 1.05;
    --pr-transform-popular-hover: scale(1.05) translateY(-5px);
    --pr-position-relative: relative;
    --pr-position-absolute: absolute;
    --pr-overflow-hidden: hidden;
    --pr-content-empty: '';
    --pr-top-0: 0;
    --pr-left-0: 0;
    --pr-width-full: 100%;
    --pr-height-full: 100%;
    --pr-opacity-bg-pattern: 0.5;
    --pr-z-index-bg: 0;
    --pr-background-size-full: 100%;
    --pr-bg-clip-text: text;
    --pr-webkit-bg-clip-text: text;
    --pr-moz-bg-clip-text: text;
    --pr-webkit-text-fill-transparent: transparent;
    --pr-moz-text-fill-transparent: transparent;
    --pr-border-radius-particle: 50%;
    --pr-opacity-particle: 0.4;
    --pr-pointer-events-none: none;
    --pr-right-0: 0;
    --pr-bottom-0: 0;
    --pr-transform-translatex-neg-2: translateX(-2px);
    --pr-transform-translatex-2: translateX(2px);
    --pr-opacity-full: 1;
    --pr-opacity-half: 0.5;
    --pr-opacity-zero: 0;
    --pr-transform-scale-small: scale(0.8);
    --pr-transform-scale-full: scale(1);
    --pr-transform-translate-y0-x0: translateY(0) translateX(0);
    --pr-transform-translate-y30-x15: translateY(30px) translateX(15px);
    --pr-transform-translate-neg-50: translate(-50%, -50%);
    --pr-bg-gradient-lime-teal: linear-gradient(135deg, rgba(132, 204, 22, 0.3), rgba(5, 150, 105, 0.2));
    --pr-bg-gradient-highlight: linear-gradient(to right, #84cc16, #059669);

    /* PersonalTraining */
    --pt-button-primary-bg: linear-gradient(to right, var(--color-violet-300, #a78bfa), var(--color-indigo-400, #818cf8));
    --pt-button-primary-color: var(--color-text-dark, #111827);
    --pt-button-primary-hover-y: -5px;
    --pt-button-primary-shadow: 0 10px 15px -3px rgba(167, 139, 250, 0.3);
    --color-violet-300: #a78bfa;
    --color-indigo-400: #818cf8;

    /* VideoPlayer (vp) Component Tokens */
    --vp-border-radius: 0.75rem;
    --vp-box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    --vp-container-padding-bottom: 1.75rem;

    /* Color Tokens */
    --vp-color-bg: var(--color-gray-800);
    --vp-color-streaming-bg: var(--color-gray-900);
    --vp-color-overlay-bg: var(--color-ui-surface-alt, rgba(31, 41, 55, 0.8));
    --vp-color-loading-bg: var(--color-ui-surface, var(--color-gray-800));
    --vp-color-error-bg: var(--color-ui-surface, var(--color-gray-800));
    --vp-color-progress-bg: var(--color-gray-700);
    --vp-color-error-icon: var(--color-red-500);
    --vp-color-error-text: var(--color-text-secondary, var(--color-gray-300));
    --vp-color-time-text: var(--color-text-muted, var(--color-gray-400));

    /* Control Button Tokens */
    --vp-control-button-size: 3rem;
    --vp-control-button-mobile-size: 2.5rem;
    --vp-control-button-bg: var(--pt-button-primary-bg);
    --vp-control-button-color: var(--color-text-primary, var(--color-white));
    --vp-control-button-shadow: var(--pt-button-primary-shadow, 0 2px 8px rgba(0, 0, 0, 0.3));
    --vp-control-button-hover-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    --vp-control-button-focus-outline: 2px solid var(--color-accent-400, var(--color-violet-300));
    --vp-control-button-focus-offset: 2px;

    /* Progress Bar Tokens */
    --vp-progress-height: 4px;
    --vp-progress-radius: 0.5rem;
    --vp-progress-bar-bg: var(--pt-button-primary-bg);

    /* Theme-Specific Tokens */
    --vp-gym-accent-gradient: linear-gradient(to right, var(--color-accent-300), var(--color-accent-500));
    --vp-sports-accent-gradient: linear-gradient(to right, var(--color-accent-300), var(--color-accent-500));
    --vp-wellness-accent-gradient: linear-gradient(to right, var(--color-accent-300), var(--color-accent-500));

    /* Animation Tokens */
    --vp-transition-standard: 0.3s ease;
    --vp-transition-fast: 0.1s linear;
    --vp-animation-spin-duration: 1s;

    /* Journey Component Tokens */
    --journey-bg-color: var(--color-slate-900);
    --journey-card-bg: var(--color-slate-800);
    --journey-card-border: var(--color-slate-700);

    /* Journey Button Tokens */
    --journey-btn-radius: var(--radii-xl);
    --journey-btn-padding-x: 1.5rem;
    --journey-btn-padding-x-large: 2.5rem;
    --journey-btn-padding-y: 0.875rem;
    --journey-btn-transition: var(--transition-standard);

    /* Journey Feature Card Tokens */
    --journey-feature-card-radius: var(--radii-lg);
    --journey-feature-card-border-width: 1px;
    --journey-feature-icon-size: 1.5rem;

    /* Journey Step Card Tokens */
    --journey-step-card-radius: var(--radii-xl);
    --journey-step-card-border-width: 1px;
    --journey-step-icon-size: 2.5rem;
    --journey-step-number-size: 1.75rem;
    --journey-step-number-radius: var(--radii-full);

    /* Card tokens */
    --card-bg-color: var(--color-surface);
    --card-shadow: var(--shadow-md);
    --card-border-width: 1px;
    --card-border-color: var(--color-border);

    /* Form tokens */
    --input-height: 2.5rem;
    --input-padding-x: var(--spacing-3);
    --input-padding-y: var(--spacing-2);
    --input-border-radius: var(--radius-md);
    --input-border-width: 1px;
    --input-focus-ring-width: 2px;
    --input-focus-ring-color: var(--color-primary-light);

    /* Navigation tokens */
    --nav-height: 4rem;
    --nav-padding-x: var(--spacing-6);
    --nav-item-gap: var(--spacing-8);
    --nav-font-weight: var(--font-weight-medium);

    /* Modal tokens */
    --modal-border-radius: var(--radius-lg);
    --modal-padding: var(--spacing-6);
    --modal-shadow: var(--shadow-lg);
    --modal-backdrop-opacity: 0.5;
    --modal-max-width: 500px;
    --modal-transition: var(--transition-all);

    /* Tooltip tokens */
    --tooltip-bg-color: var(--color-gray-800);
    --tooltip-text-color: var(--color-white);
    --tooltip-border-radius: var(--radius-sm);
    --tooltip-padding-x: var(--spacing-2);
    --tooltip-padding-y: var(--spacing-1);
    --tooltip-arrow-size: 5px;
    --tooltip-font-size: var(--font-size-xs);
    --tooltip-max-width: 200px;

    /* Badge tokens */
    --badge-padding-x: var(--spacing-2);
    --badge-padding-y: var(--spacing-1);
    --badge-border-radius: var(--radius-full);
    --badge-font-size: var(--font-size-xs);
    --badge-font-weight: var(--font-weight-medium);
}

/* Variant Overrides */
[data-theme="gym"] {
    --journey-bg-color: var(--color-slate-900);
    --journey-card-bg: var(--color-slate-800);
    --journey-card-border: var(--color-violet-700);
}

[data-theme="sports"] {
    --journey-bg-color: var(--color-slate-900);
    --journey-card-bg: var(--color-slate-800);
    --journey-card-border: var(--color-cyan-700);
}

[data-theme="wellness"] {
    --journey-bg-color: var(--color-slate-900);
    --journey-card-bg: var(--color-slate-800);
    --journey-card-border: var(--color-teal-700);
}

[data-theme="modern"] {
    --journey-bg-color: var(--color-slate-900);
    --journey-card-bg: var(--color-slate-800);
    --journey-card-border: var(--color-amber-700);
}`,`// Canonical design system import - MUST BE FIRST
@use '../../../../styles/design-system' as ds;

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--button-padding-y, var(--spacing-2)) var(--button-padding-x, var(--spacing-4));
  border-radius: var(--button-border-radius, var(--radius-md));
  font-weight: var(--button-font-weight, var(--font-weight-semibold));
  transition: var(--button-transition, var(--transition-standard));
  border: none;
  cursor: pointer;
  
  &:disabled {
    opacity: var(--opacity-disabled, 0.65);
    cursor: not-allowed;
  }

  // Primary button
  &-primary {
    background-color: var(--color-primary);
    color: var(--color-text-inverse);

    &:hover:not(:disabled) {
      background-color: var(--color-primary-dark);
    }

    &:active:not(:disabled) {
      background-color: var(--color-primary-dark);
      box-shadow: var(--shadow-inner);
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px var(--color-primary-light);
    }
    
    // Theme variants
    [data-theme="gym"] & {
      background-color: var(--color-gym-primary, var(--color-primary));
    }
    
    [data-theme="sports"] & {
      background-color: var(--color-sports-primary, var(--color-primary));
    }
    
    [data-theme="wellness"] & {
      background-color: var(--color-wellness-primary, var(--color-primary));
    }
  }

  // Secondary button
  &-secondary {
    background-color: var(--color-secondary);
    color: var(--color-text-inverse);

    &:hover:not(:disabled) {
      background-color: var(--color-secondary-dark);
    }

    &:active:not(:disabled) {
      background-color: var(--color-secondary-dark);
      box-shadow: var(--shadow-inner);
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px var(--color-secondary-light);
    }
    
    // Theme variants
    [data-theme="gym"] & {
      background-color: var(--color-gym-secondary, var(--color-secondary));
    }
    
    [data-theme="sports"] & {
      background-color: var(--color-sports-secondary, var(--color-secondary));
    }
    
    [data-theme="wellness"] & {
      background-color: var(--color-wellness-secondary, var(--color-secondary));
    }
  }

  // Size variants
  &-sm {
    height: var(--size-btn-sm, 36px);
    padding: 0 var(--spacing-3);
    font-size: var(--type-small);
  }
  
  &-md {
    height: var(--size-btn-md, 44px);
    padding: 0 var(--spacing-4);
    font-size: var(--type-base);
  }
  
  &-lg {
    height: var(--size-btn-lg, 52px);
    padding: 0 var(--spacing-6);
    font-size: var(--type-lg);
  }
} `],sourceRoot:""}]);let __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);
//# sourceMappingURL=common.52c25533.iframe.bundle.js.map