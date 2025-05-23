"use strict";(self.webpackChunkai_workout_generator_homepage=self.webpackChunkai_workout_generator_homepage||[]).push([[332],{2934:(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(71354),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(76314),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,":root{--button-gradient-primary: linear-gradient(to right, var(--color-lime-300, #a3e635), var(--color-emerald-400, #34d399));--button-gradient-primary-hover: linear-gradient(to right, var(--color-lime-400, #84cc16), var(--color-emerald-500, #10b981));--button-gradient-secondary: linear-gradient(to right, var(--color-gray-700, #374151), var(--color-gray-800, #1f2937))}:root{--button-gradient-primary: linear-gradient(to right, var(--color-lime-300, #a3e635), var(--color-emerald-400, #34d399));--button-gradient-primary-hover: linear-gradient(to right, var(--color-lime-400, #84cc16), var(--color-emerald-500, #10b981));--button-gradient-secondary: linear-gradient(to right, var(--color-gray-700, #374151), var(--color-gray-800, #1f2937))}.modal-backdrop{position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0, 0, 0, var(--modal-backdrop-opacity, 0.5));display:flex;align-items:center;justify-content:center;z-index:var(--z-index-modal, 1000);animation:fadeIn .2s ease-in-out}.modal{background-color:var(--modal-bg-color, var(--color-surface, #fff));border-radius:var(--modal-border-radius, 0.5rem);box-shadow:var(--modal-shadow, 0 10px 25px -5px rgba(0, 0, 0, 0.2));width:100%;max-width:var(--modal-max-width, 500px);max-height:calc(100vh - 2rem);overflow:hidden;display:flex;flex-direction:column;animation:slideIn .3s ease-in-out;outline:none}.modal--small{--modal-max-width: 400px}.modal--medium{--modal-max-width: 600px}.modal--large{--modal-max-width: 800px}.modal--full{--modal-max-width: 95vw;height:95vh}.modal .modal-header{display:flex;align-items:center;justify-content:space-between;padding:var(--modal-padding, 1rem);border-bottom:1px solid var(--color-border, #e2e8f0)}.modal .modal-title{margin:0;font-size:var(--font-size-xl, 1.25rem);font-weight:var(--font-weight-bold, 700);color:var(--color-text, #1a202c)}.modal .modal-close-button{background:rgba(0,0,0,0);border:none;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--color-text-muted, #718096);border-radius:var(--radius-md, 0.375rem)}.modal .modal-close-button:hover,.modal .modal-close-button:focus{background-color:var(--color-gray-100, #f7fafc);color:var(--color-text, #1a202c)}.modal .modal-close-button:focus{outline:2px solid var(--color-primary, #4299e1);outline-offset:2px}.modal .modal-close-button span{font-size:1.5rem;line-height:1}.modal .modal-body{padding:var(--modal-padding, 1rem);overflow-y:auto;flex:1}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideIn{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}","",{version:3,sources:["webpack://./src/styles/design-system.scss","webpack://./src/features/shared/Modal/modal.scss"],names:[],mappings:"AAuCA,MAEE,uHAAA,CACA,6HAAA,CACA,sHAAA,CAwCF,MAEE,uHAAA,CACA,6HAAA,CACA,sHAAA,CChFF,gBACI,cAAA,CACA,KAAA,CACA,MAAA,CACA,OAAA,CACA,QAAA,CACA,kEAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,kCAAA,CACA,gCAAA,CAGJ,OACI,kEAAA,CACA,gDAAA,CACA,mEAAA,CACA,UAAA,CACA,uCAAA,CACA,6BAAA,CACA,eAAA,CACA,YAAA,CACA,qBAAA,CACA,iCAAA,CACA,YAAA,CAEA,cACI,wBAAA,CAGJ,eACI,wBAAA,CAGJ,cACI,wBAAA,CAGJ,aACI,uBAAA,CACA,WAAA,CAGJ,qBACI,YAAA,CACA,kBAAA,CACA,6BAAA,CACA,kCAAA,CACA,oDAAA,CAGJ,oBACI,QAAA,CACA,sCAAA,CACA,wCAAA,CACA,gCAAA,CAGJ,2BACI,wBAAA,CACA,WAAA,CACA,UAAA,CACA,WAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,cAAA,CACA,sCAAA,CACA,wCAAA,CAEA,kEAEI,+CAAA,CACA,gCAAA,CAGJ,iCACI,+CAAA,CACA,kBAAA,CAGJ,gCACI,gBAAA,CACA,aAAA,CAIR,mBACI,kCAAA,CACA,eAAA,CACA,MAAA,CAKR,kBACI,KACI,SAAA,CAGJ,GACI,SAAA,CAAA,CAIR,mBACI,KACI,2BAAA,CACA,SAAA,CAGJ,GACI,uBAAA,CACA,SAAA,CAAA",sourcesContent:[`// Design system variables and mixins

// Breakpoint mixins
@mixin sm {
  @media (min-width: 640px) { @content; }
}

@mixin md {
  @media (min-width: 768px) { @content; }
}

@mixin lg {
  @media (min-width: 1024px) { @content; }
}

@mixin xl {
  @media (min-width: 1280px) { @content; }
}

@mixin xxl {
  @media (min-width: 1536px) { @content; }
}

// Typography scales
$font-size-xs: 0.75rem;   // 12px
$font-size-sm: 0.875rem;  // 14px
$font-size-base: 1rem;    // 16px
$font-size-lg: 1.125rem;  // 18px
$font-size-xl: 1.25rem;   // 20px
$font-size-2xl: 1.5rem;   // 24px
$font-size-3xl: 1.875rem; // 30px
$font-size-4xl: 2.25rem;  // 36px
$font-size-5xl: 3rem;     // 48px 

// Button gradients
$button-gradient-primary: linear-gradient(to right, var(--color-lime-300, #a3e635), var(--color-emerald-400, #34d399));
$button-gradient-primary-hover: linear-gradient(to right, var(--color-lime-400, #84cc16), var(--color-emerald-500, #10b981));
$button-gradient-secondary: linear-gradient(to right, var(--color-gray-700, #374151), var(--color-gray-800, #1f2937));

:root {
  // Button gradients
  --button-gradient-primary: #{$button-gradient-primary};
  --button-gradient-primary-hover: #{$button-gradient-primary-hover};
  --button-gradient-secondary: #{$button-gradient-secondary};
} 

// Breakpoint mixins
@mixin sm {
  @media (min-width: 640px) { @content; }
}

@mixin md {
  @media (min-width: 768px) { @content; }
}

@mixin lg {
  @media (min-width: 1024px) { @content; }
}

@mixin xl {
  @media (min-width: 1280px) { @content; }
}

@mixin xxl {
  @media (min-width: 1536px) { @content; }
}

// Typography scales
$font-size-xs: 0.75rem;   // 12px
$font-size-sm: 0.875rem;  // 14px
$font-size-base: 1rem;    // 16px
$font-size-lg: 1.125rem;  // 18px
$font-size-xl: 1.25rem;   // 20px
$font-size-2xl: 1.5rem;   // 24px
$font-size-3xl: 1.875rem; // 30px
$font-size-4xl: 2.25rem;  // 36px
$font-size-5xl: 3rem;     // 48px 

// Button gradients
$button-gradient-primary: linear-gradient(to right, var(--color-lime-300, #a3e635), var(--color-emerald-400, #34d399));
$button-gradient-primary-hover: linear-gradient(to right, var(--color-lime-400, #84cc16), var(--color-emerald-500, #10b981));
$button-gradient-secondary: linear-gradient(to right, var(--color-gray-700, #374151), var(--color-gray-800, #1f2937));

:root {
  // Button gradients
  --button-gradient-primary: #{$button-gradient-primary};
  --button-gradient-primary-hover: #{$button-gradient-primary-hover};
  --button-gradient-secondary: #{$button-gradient-secondary};
} `,`// Canonical design system import - MUST BE FIRST
@use '../../../styles/design-system' as ds;

/**
 * Modal Component Styles
 */

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, var(--modal-backdrop-opacity, 0.5));
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-index-modal, 1000);
    animation: fadeIn 0.2s ease-in-out;
}

.modal {
    background-color: var(--modal-bg-color, var(--color-surface, #fff));
    border-radius: var(--modal-border-radius, 0.5rem);
    box-shadow: var(--modal-shadow, 0 10px 25px -5px rgba(0, 0, 0, 0.2));
    width: 100%;
    max-width: var(--modal-max-width, 500px);
    max-height: calc(100vh - 2rem);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s ease-in-out;
    outline: none;

    &--small {
        --modal-max-width: 400px;
    }

    &--medium {
        --modal-max-width: 600px;
    }

    &--large {
        --modal-max-width: 800px;
    }

    &--full {
        --modal-max-width: 95vw;
        height: 95vh;
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--modal-padding, 1rem);
        border-bottom: 1px solid var(--color-border, #e2e8f0);
    }

    .modal-title {
        margin: 0;
        font-size: var(--font-size-xl, 1.25rem);
        font-weight: var(--font-weight-bold, 700);
        color: var(--color-text, #1a202c);
    }

    .modal-close-button {
        background: transparent;
        border: none;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--color-text-muted, #718096);
        border-radius: var(--radius-md, 0.375rem);

        &:hover,
        &:focus {
            background-color: var(--color-gray-100, #f7fafc);
            color: var(--color-text, #1a202c);
        }

        &:focus {
            outline: 2px solid var(--color-primary, #4299e1);
            outline-offset: 2px;
        }

        span {
            font-size: 1.5rem;
            line-height: 1;
        }
    }

    .modal-body {
        padding: var(--modal-padding, 1rem);
        overflow-y: auto;
        flex: 1;
    }
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}`],sourceRoot:""}]);let __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},56757:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Basic:()=>Basic,Large:()=>Large,ThemeVariants:()=>ThemeVariants,WithForm:()=>WithForm,__namedExportsOrder:()=>__namedExportsOrder,default:()=>Modal_stories});var react=__webpack_require__(96540),react_dom=__webpack_require__(40961),injectStylesIntoStyleTag=__webpack_require__(85072),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__(97825),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__(77659),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__(55056),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__(10540),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__(41113),styleTagTransform_default=__webpack_require__.n(styleTagTransform),modal=__webpack_require__(2934),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default(),injectStylesIntoStyleTag_default()(modal.A,options),modal.A&&modal.A.locals&&modal.A.locals;var Modal=function(param){var isOpen=param.isOpen,onClose=param.onClose,title=param.title,children=param.children,_param_className=param.className,_param_size=param.size,_param_closeOnEsc=param.closeOnEsc,closeOnEsc=void 0===_param_closeOnEsc||_param_closeOnEsc,_param_closeOnBackdropClick=param.closeOnBackdropClick,closeOnBackdropClick=void 0===_param_closeOnBackdropClick||_param_closeOnBackdropClick,_param_showCloseButton=param.showCloseButton,ariaLabelledBy=param["aria-labelledby"],ariaDescribedBy=param["aria-describedby"],initialFocusRef=param.initialFocusRef,returnFocusRef=param.returnFocusRef,dataTestId=param["data-testid"],previousActiveElement=(0,react.useRef)(null),modalRef=(0,react.useRef)(null),closeButtonRef=(0,react.useRef)(null),titleId=ariaLabelledBy||"modal-title";if((0,react.useEffect)(function(){isOpen?(previousActiveElement.current=document.activeElement,(null==initialFocusRef?void 0:initialFocusRef.current)?initialFocusRef.current.focus():closeButtonRef.current?closeButtonRef.current.focus():modalRef.current&&modalRef.current.focus()):previousActiveElement.current&&((null==returnFocusRef?void 0:returnFocusRef.current)?returnFocusRef.current.focus():previousActiveElement.current.focus())},[isOpen,initialFocusRef,returnFocusRef]),!isOpen)return null;var modalClasses=["modal","modal--".concat(void 0===_param_size?"medium":_param_size),void 0===_param_className?"":_param_className].filter(Boolean).join(" ");return(0,react_dom.createPortal)(react.createElement("div",{className:"modal-backdrop",onClick:function(e){closeOnBackdropClick&&e.target===e.currentTarget&&onClose&&onClose()},"data-testid":dataTestId?"".concat(dataTestId,"-backdrop"):"modal-backdrop"},react.createElement("div",{className:modalClasses,role:"dialog","aria-modal":"true","aria-labelledby":title?titleId:void 0,"aria-describedby":ariaDescribedBy,ref:modalRef,tabIndex:-1,onKeyDown:function(e){if(closeOnEsc&&"Escape"===e.key&&onClose&&onClose(),"Tab"===e.key){var _modalRef_current,focusableElements=null==(_modalRef_current=modalRef.current)?void 0:_modalRef_current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');if(focusableElements&&focusableElements.length>0){var firstElement=focusableElements[0],lastElement=focusableElements[focusableElements.length-1];e.shiftKey?document.activeElement===firstElement&&(lastElement.focus(),e.preventDefault()):document.activeElement===lastElement&&(firstElement.focus(),e.preventDefault())}}},"data-testid":dataTestId},react.createElement("div",{className:"modal-header"},title&&react.createElement("h2",{id:titleId,className:"modal-title"},title),(void 0===_param_showCloseButton||_param_showCloseButton)&&react.createElement("button",{className:"modal-close-button",onClick:onClose,"aria-label":"Close modal",ref:closeButtonRef,"data-testid":dataTestId?"".concat(dataTestId,"-close-button"):"modal-close-button"},react.createElement("span",{"aria-hidden":"true"},"×"))),react.createElement("div",{className:"modal-body"},children))),document.body)};try{Modal.displayName="Modal",Modal.__docgenInfo={description:"Modal component that renders a dialog with focus trapping and accessibility features",displayName:"Modal",props:{isOpen:{defaultValue:null,description:"Whether the modal is open",name:"isOpen",required:!0,type:{name:"boolean"}},onClose:{defaultValue:null,description:"Callback for when the modal is closed",name:"onClose",required:!0,type:{name:"() => void"}},title:{defaultValue:null,description:"Modal title",name:"title",required:!1,type:{name:"string"}},children:{defaultValue:null,description:"Modal content",name:"children",required:!0,type:{name:"ReactNode"}},className:{defaultValue:{value:""},description:"Additional CSS classes",name:"className",required:!1,type:{name:"string"}},size:{defaultValue:{value:"medium"},description:"Modal size",name:"size",required:!1,type:{name:"enum",value:[{value:'"medium"'},{value:'"small"'},{value:'"large"'},{value:'"full"'}]}},closeOnEsc:{defaultValue:{value:"true"},description:"Whether to close the modal when Escape key is pressed",name:"closeOnEsc",required:!1,type:{name:"boolean"}},closeOnBackdropClick:{defaultValue:{value:"true"},description:"Whether to close the modal when the backdrop is clicked",name:"closeOnBackdropClick",required:!1,type:{name:"boolean"}},showCloseButton:{defaultValue:{value:"true"},description:"Whether to show the close button in the modal header",name:"showCloseButton",required:!1,type:{name:"boolean"}},"aria-labelledby":{defaultValue:null,description:"ID of the element that labels the modal dialog",name:"aria-labelledby",required:!1,type:{name:"string"}},"aria-describedby":{defaultValue:null,description:"ID of the element that describes the modal dialog",name:"aria-describedby",required:!1,type:{name:"string"}},initialFocusRef:{defaultValue:null,description:"Ref to the element that should receive focus when the modal opens",name:"initialFocusRef",required:!1,type:{name:"RefObject<HTMLElement>"}},returnFocusRef:{defaultValue:null,description:"Ref to the element that should receive focus when the modal closes",name:"returnFocusRef",required:!1,type:{name:"RefObject<HTMLElement>"}},"data-testid":{defaultValue:null,description:"Data test ID for testing",name:"data-testid",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/features/shared/Modal/Modal.tsx#Modal"]={docgenInfo:Modal.__docgenInfo,name:"Modal",path:"src/features/shared/Modal/Modal.tsx#Modal"})}catch(__react_docgen_typescript_loader_error){}function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _array_with_holes(arr){if(Array.isArray(arr))return arr}function _iterable_to_array_limit(arr,i){var _s,_e,_i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}function _non_iterable_rest(){throw TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _sliced_to_array(arr,i){return _array_with_holes(arr)||_iterable_to_array_limit(arr,i)||_unsupported_iterable_to_array(arr,i)||_non_iterable_rest()}function _unsupported_iterable_to_array(o,minLen){if(o){if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);if("Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}}let Modal_stories={title:"Features/Shared/Modal",component:Modal,parameters:{layout:"centered",docs:{description:{component:"A modal dialog component for displaying content that requires user attention or interaction."}}},tags:["autodocs"],argTypes:{isOpen:{control:"boolean",description:"Controls whether the modal is visible"},onClose:{action:"closed",description:"Function called when the modal is closed"},title:{control:"text",description:"Modal title"},size:{control:"select",options:["small","medium","large","full"],description:"Size of the modal"},children:{control:"text",description:"Modal content"}}};var ModalExample=function(param){var title=param.title,content=param.content,_param_size=param.size,_useState=_sliced_to_array((0,react.useState)(!1),2),isOpen=_useState[0],setIsOpen=_useState[1];return react.createElement(react.Fragment,null,react.createElement("button",{onClick:function(){return setIsOpen(!0)}},"Open Modal"),react.createElement(Modal,{isOpen:isOpen,onClose:function(){return setIsOpen(!1)},title:title,size:void 0===_param_size?"medium":_param_size},content))},Basic={render:function(){return react.createElement(ModalExample,{title:"Basic Modal",content:react.createElement("p",null,"This is a basic modal with simple content."),size:"medium"})}},Large={render:function(){return react.createElement(ModalExample,{title:"Large Modal",content:react.createElement("div",null,react.createElement("p",null,"This is a larger modal with more content."),react.createElement("p",null,"It can fit more information and potentially more interactive elements."),react.createElement("button",null,"Example Action")),size:"large"})}},WithForm={render:function(){return react.createElement(ModalExample,{title:"Form Modal",content:react.createElement("form",{style:{display:"flex",flexDirection:"column",gap:"16px"}},react.createElement("div",null,react.createElement("label",{htmlFor:"name"},"Name"),react.createElement("input",{id:"name",type:"text",placeholder:"Enter your name"})),react.createElement("div",null,react.createElement("label",{htmlFor:"email"},"Email"),react.createElement("input",{id:"email",type:"email",placeholder:"Enter your email"})),react.createElement("button",{type:"submit"},"Submit")),size:"medium"})}},ThemeVariants={render:function(){return react.createElement("div",{style:{display:"flex",gap:"20px"}},react.createElement("div",{"data-theme":"personal-training"},react.createElement(ModalExample,{title:"Personal Training",content:react.createElement("p",null,"Modal with Personal Training theme"),size:"medium"})),react.createElement("div",{"data-theme":"group-fitness"},react.createElement(ModalExample,{title:"Group Fitness",content:react.createElement("p",null,"Modal with Group Fitness theme"),size:"medium"})))}};Basic.parameters={...Basic.parameters,docs:{...Basic.parameters?.docs,source:{originalSource:`{
  render: () => <ModalExample title="Basic Modal" content={<p>This is a basic modal with simple content.</p>} size="medium" />
}`,...Basic.parameters?.docs?.source}}},Large.parameters={...Large.parameters,docs:{...Large.parameters?.docs,source:{originalSource:`{
  render: () => <ModalExample title="Large Modal" content={<div>
          <p>This is a larger modal with more content.</p>
          <p>It can fit more information and potentially more interactive elements.</p>
          <button>Example Action</button>
        </div>} size="large" />
}`,...Large.parameters?.docs?.source}}},WithForm.parameters={...WithForm.parameters,docs:{...WithForm.parameters?.docs,source:{originalSource:`{
  render: () => <ModalExample title="Form Modal" content={<form style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }}>
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" placeholder="Enter your name" />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="Enter your email" />
          </div>
          <button type="submit">Submit</button>
        </form>} size="medium" />
}`,...WithForm.parameters?.docs?.source}}},ThemeVariants.parameters={...ThemeVariants.parameters,docs:{...ThemeVariants.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '20px'
  }}>
      <div data-theme="personal-training">
        <ModalExample title="Personal Training" content={<p>Modal with Personal Training theme</p>} size="medium" />
      </div>
      <div data-theme="group-fitness">
        <ModalExample title="Group Fitness" content={<p>Modal with Group Fitness theme</p>} size="medium" />
      </div>
    </div>
}`,...ThemeVariants.parameters?.docs?.source}}};let __namedExportsOrder=["Basic","Large","WithForm","ThemeVariants"]}}]);
//# sourceMappingURL=features-shared-Modal-stories-Modal-stories.d643e72b.iframe.bundle.js.map