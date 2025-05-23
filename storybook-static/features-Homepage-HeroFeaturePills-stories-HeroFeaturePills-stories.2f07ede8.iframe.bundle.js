"use strict";(self.webpackChunkai_workout_generator_homepage=self.webpackChunkai_workout_generator_homepage||[]).push([[125],{5944:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Accent:()=>Accent,Default:()=>Default,ExactHeroMatch:()=>ExactHeroMatch,Large:()=>Large,ResponsiveVariants:()=>ResponsiveVariants,Secondary:()=>Secondary,Small:()=>Small,ThemeShowcase:()=>ThemeShowcase,WithIcons:()=>WithIcons,WithoutBlur:()=>WithoutBlur,WithoutIcons:()=>WithoutIcons,__namedExportsOrder:()=>__namedExportsOrder,default:()=>HeroFeaturePills_stories});var react=__webpack_require__(96540),THEME_OPTIONS=["default","dark","high-contrast","light"];function ComponentWithThemes(Component,args){return react.createElement("div",{className:"theme-showcase"},react.createElement("style",null,`
          .theme-showcase {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            width: 100%;
            max-width: 1200px;
          }
          
          .theme-variant {
            display: flex;
            flex-direction: column;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
          }
          
          .theme-header {
            padding: 8px 16px;
            background-color: #f5f5f5;
            border-bottom: 1px solid #e0e0e0;
            font-weight: bold;
            font-size: 14px;
          }
          
          .theme-content {
            padding: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 150px;
          }
          
          /* Ensure dark theme has appropriate background */
          .theme-dark .theme-content {
            background-color: #333;
          }
          
          /* Ensure high contrast theme has appropriate background */
          .theme-high-contrast .theme-content {
            background-color: #000;
          }
        `),THEME_OPTIONS.map(function(themeOption){return react.createElement("div",{key:themeOption,className:"theme-variant theme-".concat(themeOption)},react.createElement("div",{className:"theme-header"},themeOption),react.createElement("div",{className:"theme-content","data-theme":themeOption},react.createElement(Component,args)))}))}function ComponentWithResponsiveVariants(Component,args){var breakpoints=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[320,768,1024,1440];return React.createElement("div",{className:"responsive-showcase"},React.createElement("style",null,`
          .responsive-showcase {
            display: flex;
            flex-direction: column;
            gap: 24px;
            width: 100%;
          }
          
          .responsive-variant {
            display: flex;
            flex-direction: column;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
          }
          
          .responsive-header {
            padding: 8px 16px;
            background-color: #f5f5f5;
            border-bottom: 1px solid #e0e0e0;
            font-weight: bold;
            font-size: 14px;
          }
          
          .responsive-content {
            padding: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `),breakpoints.map(function(width){return React.createElement("div",{key:width,className:"responsive-variant"},React.createElement("div",{className:"responsive-header"},width,"px"),React.createElement("div",{className:"responsive-content",style:{width:"".concat(width,"px")}},React.createElement(Component,args)))}))}try{ComponentWithThemes.displayName="ComponentWithThemes",ComponentWithThemes.__docgenInfo={description:`Renders a component with all theme variants for Storybook visualization.

This helper renders the component multiple times, once for each theme,
with clear labels to show how the component appears in different themes.`,displayName:"ComponentWithThemes",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/utils/storybook-helpers.tsx#ComponentWithThemes"]={docgenInfo:ComponentWithThemes.__docgenInfo,name:"ComponentWithThemes",path:"src/utils/storybook-helpers.tsx#ComponentWithThemes"})}catch(__react_docgen_typescript_loader_error){}try{ComponentWithResponsiveVariants.displayName="ComponentWithResponsiveVariants",ComponentWithResponsiveVariants.__docgenInfo={description:"Renders a component with responsive variants for Storybook visualization.",displayName:"ComponentWithResponsiveVariants",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/utils/storybook-helpers.tsx#ComponentWithResponsiveVariants"]={docgenInfo:ComponentWithResponsiveVariants.__docgenInfo,name:"ComponentWithResponsiveVariants",path:"src/utils/storybook-helpers.tsx#ComponentWithResponsiveVariants"})}catch(__react_docgen_typescript_loader_error){}try{THEME_OPTIONS.displayName="THEME_OPTIONS",THEME_OPTIONS.__docgenInfo={description:`Available theme options for FitCopilot.
These should match the available themes in your application.`,displayName:"THEME_OPTIONS",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/utils/storybook-helpers.tsx#THEME_OPTIONS"]={docgenInfo:THEME_OPTIONS.__docgenInfo,name:"THEME_OPTIONS",path:"src/utils/storybook-helpers.tsx#THEME_OPTIONS"})}catch(__react_docgen_typescript_loader_error){}var dumbbell=__webpack_require__(76947),flame=__webpack_require__(9453),heart=__webpack_require__(51120),injectStylesIntoStyleTag=__webpack_require__(85072),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__(97825),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__(77659),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__(55056),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__(10540),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__(41113),styleTagTransform_default=__webpack_require__.n(styleTagTransform),HeroFeaturePills=__webpack_require__(20329),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default(),injectStylesIntoStyleTag_default()(HeroFeaturePills.A,options),HeroFeaturePills.A&&HeroFeaturePills.A.locals&&HeroFeaturePills.A.locals;var iconMap={dumbbell:dumbbell.A,flame:flame.A,heart:heart.A},HeroFeaturePills_HeroFeaturePills_HeroFeaturePills=function(param){var features=param.features,_param_variant=param.variant,_param_size=param.size,_param_className=param.className,_param_backgroundStyle=param.backgroundStyle,getIconComponent=function(iconName){if(!iconName)return null;var IconComponent=iconMap[iconName.toLowerCase()];return IconComponent?react.createElement("span",{className:"hero-feature-pills__icon"},react.createElement(IconComponent,{size:14})):null};return react.createElement("div",{className:"hero-feature-pills hero-feature-pills--".concat(void 0===_param_variant?"primary":_param_variant," hero-feature-pills--").concat(void 0===_param_size?"medium":_param_size," ").concat("blur"===(void 0===_param_backgroundStyle?"blur":_param_backgroundStyle)?"hero-feature-pills--blur":""," ").concat(void 0===_param_className?"":_param_className)},react.createElement("div",{className:"hero-feature-pills__list"},features.map(function(feature){return react.createElement("div",{key:feature.id,className:"hero-feature-pills__item"},getIconComponent(feature.icon),react.createElement("span",{className:"hero-feature-pills__label"},feature.label))})))};try{HeroFeaturePills_HeroFeaturePills_HeroFeaturePills.displayName="HeroFeaturePills",HeroFeaturePills_HeroFeaturePills_HeroFeaturePills.__docgenInfo={description:`HeroFeaturePills component displays a collection of feature highlights
in pill format within the hero section of the homepage.`,displayName:"HeroFeaturePills",props:{features:{defaultValue:null,description:"Array of feature items to display in pills",name:"features",required:!0,type:{name:"FeatureItem[]"}},variant:{defaultValue:{value:"primary"},description:"Visual style variant for the pills",name:"variant",required:!1,type:{name:"enum",value:[{value:'"primary"'},{value:'"secondary"'},{value:'"accent"'}]}},size:{defaultValue:{value:"medium"},description:"Size of the feature pills",name:"size",required:!1,type:{name:"enum",value:[{value:'"medium"'},{value:'"small"'},{value:'"large"'}]}},className:{defaultValue:{value:""},description:"Additional CSS class for styling",name:"className",required:!1,type:{name:"string"}},backgroundStyle:{defaultValue:{value:"blur"},description:"Background style - default or blur",name:"backgroundStyle",required:!1,type:{name:"enum",value:[{value:'"default"'},{value:'"blur"'}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/features/Homepage/HeroFeaturePills/HeroFeaturePills.tsx#HeroFeaturePills"]={docgenInfo:HeroFeaturePills_HeroFeaturePills_HeroFeaturePills.__docgenInfo,name:"HeroFeaturePills",path:"src/features/Homepage/HeroFeaturePills/HeroFeaturePills.tsx#HeroFeaturePills"})}catch(__react_docgen_typescript_loader_error){}let HeroFeaturePills_stories={title:"Features/Homepage/HeroFeaturePills",component:HeroFeaturePills_HeroFeaturePills_HeroFeaturePills,parameters:{layout:"centered",backgrounds:{default:"dark"},docs:{description:{component:"Feature pills displayed in the hero section that highlight key product features in a compact, visually appealing format with a blurred backdrop effect."}}},tags:["autodocs"],argTypes:{features:{control:"object",description:"Array of feature items to display in pills"},variant:{control:"select",options:["primary","secondary","accent"],description:"Visual style variant for the pills"},size:{control:"select",options:["small","medium","large"],description:"Size of the feature pills"},backgroundStyle:{control:"select",options:["default","blur"],description:"Background style - default or blur backdrop effect (blur is default)"},className:{control:"text",description:"Additional CSS class for styling"}},decorators:[function(Story){return react.createElement("div",{style:{padding:"24px",background:"#111827",borderRadius:"8px",maxWidth:"800px"}},react.createElement(Story,null))}]};var defaultFeatures=[{id:"1",label:"Personalized Workouts",icon:"dumbbell"},{id:"2",label:"AI-Optimized Routines",icon:"flame"},{id:"3",label:"Expert Guidance",icon:"heart"}],Default={args:{features:defaultFeatures,variant:"primary",size:"medium",backgroundStyle:"blur"}},ExactHeroMatch={parameters:{backgrounds:{default:"dark"},docs:{description:{story:"Exact match to the pills found in the Hero component"}}},render:function(args){return react.createElement("div",{style:{padding:"24px",background:"#111827",borderRadius:"8px",maxWidth:"800px"}},react.createElement("div",{className:"flex flex-wrap justify-center gap-3 mt-8"},react.createElement(HeroFeaturePills_HeroFeaturePills_HeroFeaturePills,args)))},args:{features:[{id:"1",label:"Personalized Workouts",icon:"dumbbell"},{id:"2",label:"AI-Optimized Routines",icon:"flame"},{id:"3",label:"Expert Guidance",icon:"heart"}],variant:"primary",size:"medium",backgroundStyle:"blur"}},WithoutBlur={args:{features:defaultFeatures,variant:"primary",size:"medium",backgroundStyle:"default"}},WithIcons={args:{features:defaultFeatures,variant:"primary",size:"medium"}},WithoutIcons={args:{features:[{id:"1",label:"Personalized Workouts"},{id:"2",label:"AI-Optimized Routines"},{id:"3",label:"Expert Guidance"}],variant:"primary",size:"medium"}},Secondary={args:{features:defaultFeatures,variant:"secondary",size:"medium"}},Accent={args:{features:defaultFeatures,variant:"accent",size:"medium"}},Small={args:{features:defaultFeatures,variant:"primary",size:"small"}},Large={args:{features:defaultFeatures,variant:"primary",size:"large"}},ThemeShowcase={render:function(args){return ComponentWithThemes(HeroFeaturePills_HeroFeaturePills_HeroFeaturePills,args)},args:{features:defaultFeatures,variant:"primary",size:"medium"}},ResponsiveVariants={parameters:{viewport:{defaultViewport:"responsive"},docs:{description:{story:"Shows how the feature pills adapt to different viewport sizes."}}},render:function(args){return react.createElement("div",{className:"responsive-demo",style:{maxWidth:"100%"}},react.createElement(HeroFeaturePills_HeroFeaturePills_HeroFeaturePills,args))},args:{features:[{id:"1",label:"Personalized",icon:"dumbbell"},{id:"2",label:"AI-Powered",icon:"flame"},{id:"3",label:"Adaptable",icon:"heart"},{id:"4",label:"Goal-Oriented",icon:"dumbbell"},{id:"5",label:"Progressive",icon:"flame"}],variant:"primary",size:"medium"}};Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:`{
  args: {
    features: defaultFeatures,
    variant: 'primary',
    size: 'medium',
    backgroundStyle: 'blur'
  }
}`,...Default.parameters?.docs?.source}}},ExactHeroMatch.parameters={...ExactHeroMatch.parameters,docs:{...ExactHeroMatch.parameters?.docs,source:{originalSource:`{
  parameters: {
    backgrounds: {
      default: 'dark'
    },
    docs: {
      description: {
        story: 'Exact match to the pills found in the Hero component'
      }
    }
  },
  render: (args: React.ComponentProps<typeof HeroFeaturePills>) => <div style={{
    padding: '24px',
    background: '#111827',
    // bg-gray-900 (same as Hero)
    borderRadius: '8px',
    maxWidth: '800px'
  }}>
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <HeroFeaturePills {...args} />
      </div>
    </div>,
  args: {
    features: heroFeatures,
    variant: 'primary',
    size: 'medium',
    backgroundStyle: 'blur'
  }
}`,...ExactHeroMatch.parameters?.docs?.source}}},WithoutBlur.parameters={...WithoutBlur.parameters,docs:{...WithoutBlur.parameters?.docs,source:{originalSource:`{
  args: {
    features: defaultFeatures,
    variant: 'primary',
    size: 'medium',
    backgroundStyle: 'default'
  }
}`,...WithoutBlur.parameters?.docs?.source}}},WithIcons.parameters={...WithIcons.parameters,docs:{...WithIcons.parameters?.docs,source:{originalSource:`{
  args: {
    features: defaultFeatures,
    variant: 'primary',
    size: 'medium'
  }
}`,...WithIcons.parameters?.docs?.source}}},WithoutIcons.parameters={...WithoutIcons.parameters,docs:{...WithoutIcons.parameters?.docs,source:{originalSource:`{
  args: {
    features: [{
      id: '1',
      label: 'Personalized Workouts'
    }, {
      id: '2',
      label: 'AI-Optimized Routines'
    }, {
      id: '3',
      label: 'Expert Guidance'
    }],
    variant: 'primary',
    size: 'medium'
  }
}`,...WithoutIcons.parameters?.docs?.source}}},Secondary.parameters={...Secondary.parameters,docs:{...Secondary.parameters?.docs,source:{originalSource:`{
  args: {
    features: defaultFeatures,
    variant: 'secondary',
    size: 'medium'
  }
}`,...Secondary.parameters?.docs?.source}}},Accent.parameters={...Accent.parameters,docs:{...Accent.parameters?.docs,source:{originalSource:`{
  args: {
    features: defaultFeatures,
    variant: 'accent',
    size: 'medium'
  }
}`,...Accent.parameters?.docs?.source}}},Small.parameters={...Small.parameters,docs:{...Small.parameters?.docs,source:{originalSource:`{
  args: {
    features: defaultFeatures,
    variant: 'primary',
    size: 'small'
  }
}`,...Small.parameters?.docs?.source}}},Large.parameters={...Large.parameters,docs:{...Large.parameters?.docs,source:{originalSource:`{
  args: {
    features: defaultFeatures,
    variant: 'primary',
    size: 'large'
  }
}`,...Large.parameters?.docs?.source}}},ThemeShowcase.parameters={...ThemeShowcase.parameters,docs:{...ThemeShowcase.parameters?.docs,source:{originalSource:`{
  render: (args: React.ComponentProps<typeof HeroFeaturePills>) => ComponentWithThemes(HeroFeaturePills, args),
  args: {
    features: defaultFeatures,
    variant: 'primary',
    size: 'medium'
  }
}`,...ThemeShowcase.parameters?.docs?.source}}},ResponsiveVariants.parameters={...ResponsiveVariants.parameters,docs:{...ResponsiveVariants.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: 'responsive'
    },
    docs: {
      description: {
        story: 'Shows how the feature pills adapt to different viewport sizes.'
      }
    }
  },
  render: (args: React.ComponentProps<typeof HeroFeaturePills>) => <div className="responsive-demo" style={{
    maxWidth: '100%'
  }}>
      <HeroFeaturePills {...args} />
    </div>,
  args: {
    features: [{
      id: '1',
      label: 'Personalized',
      icon: 'dumbbell'
    }, {
      id: '2',
      label: 'AI-Powered',
      icon: 'flame'
    }, {
      id: '3',
      label: 'Adaptable',
      icon: 'heart'
    }, {
      id: '4',
      label: 'Goal-Oriented',
      icon: 'dumbbell'
    }, {
      id: '5',
      label: 'Progressive',
      icon: 'flame'
    }],
    variant: 'primary',
    size: 'medium'
  }
}`,...ResponsiveVariants.parameters?.docs?.source}}};let __namedExportsOrder=["Default","ExactHeroMatch","WithoutBlur","WithIcons","WithoutIcons","Secondary","Accent","Small","Large","ThemeShowcase","ResponsiveVariants"]},20329:(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(71354),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(76314),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,":root{--button-gradient-primary: linear-gradient(to right, var(--color-lime-300, #a3e635), var(--color-emerald-400, #34d399));--button-gradient-primary-hover: linear-gradient(to right, var(--color-lime-400, #84cc16), var(--color-emerald-500, #10b981));--button-gradient-secondary: linear-gradient(to right, var(--color-gray-700, #374151), var(--color-gray-800, #1f2937))}:root{--button-gradient-primary: linear-gradient(to right, var(--color-lime-300, #a3e635), var(--color-emerald-400, #34d399));--button-gradient-primary-hover: linear-gradient(to right, var(--color-lime-400, #84cc16), var(--color-emerald-500, #10b981));--button-gradient-secondary: linear-gradient(to right, var(--color-gray-700, #374151), var(--color-gray-800, #1f2937))}.hero-feature-pills{--pill-bg-color: var(--color-primary-light, #e6f7ff);--pill-text-color: var(--color-primary, #0066cc);--pill-icon-color: var(--color-accent, #a3e635);--pill-border-color: var(--color-primary-dark, #0055aa);--pill-gap: 12px;--pill-font-size: 14px;--pill-padding: 8px 16px;--pill-border-radius: 9999px;width:100%;margin:1.5rem 0}.hero-feature-pills__list{display:flex;flex-wrap:wrap;justify-content:center;gap:var(--pill-gap);padding:0;margin:0}.hero-feature-pills__item{display:inline-flex;align-items:center;background-color:var(--pill-bg-color);color:var(--pill-text-color);border:1px solid var(--pill-border-color);border-radius:var(--pill-border-radius);padding:var(--pill-padding);font-size:var(--pill-font-size);font-weight:500;transition:all .2s ease;margin:0}.hero-feature-pills__item:hover{transform:translateY(-2px);box-shadow:0 2px 4px rgba(0,0,0,.1)}.hero-feature-pills__icon{display:flex;align-items:center;justify-content:center;color:var(--pill-icon-color);margin-right:8px}.hero-feature-pills__label{line-height:1}.hero-feature-pills--blur{--pill-bg-color: rgba(31, 41, 55, 0.5);--pill-text-color: #d1d5db;--pill-border-color: rgba(55, 65, 81, 0.5)}.hero-feature-pills--blur .hero-feature-pills__item{backdrop-filter:blur(4px)}.hero-feature-pills--blur .hero-feature-pills__icon{color:#a3e635}.hero-feature-pills--primary{--pill-bg-color: var(--color-primary-light, #e6f7ff);--pill-text-color: var(--color-primary, #0066cc);--pill-border-color: var(--color-primary-dark, #0055aa)}.hero-feature-pills--primary.hero-feature-pills--blur{--pill-bg-color: rgba(31, 41, 55, 0.5);--pill-text-color: #d1d5db;--pill-border-color: rgba(55, 65, 81, 0.5)}.hero-feature-pills--secondary{--pill-bg-color: var(--color-secondary-light, #f0f0f0);--pill-text-color: var(--color-secondary, #444444);--pill-border-color: var(--color-secondary-dark, #333333)}.hero-feature-pills--accent{--pill-bg-color: var(--color-accent-light, #fff1e6);--pill-text-color: var(--color-accent, #ff6600);--pill-border-color: var(--color-accent-dark, #dd5500)}.hero-feature-pills--small{--pill-font-size: 12px;--pill-padding: 4px 12px;--pill-gap: 8px}.hero-feature-pills--medium{--pill-font-size: 14px;--pill-padding: 8px 16px;--pill-gap: 12px}.hero-feature-pills--large{--pill-font-size: 16px;--pill-padding: 10px 20px;--pill-gap: 16px}@media(max-width: 768px){.hero-feature-pills__list{justify-content:center}.hero-feature-pills--medium,.hero-feature-pills--large{--pill-font-size: 14px;--pill-padding: 6px 14px}}@media(max-width: 480px){.hero-feature-pills__list{flex-direction:column;align-items:center}}","",{version:3,sources:["webpack://./src/styles/design-system.scss","webpack://./src/features/Homepage/HeroFeaturePills/HeroFeaturePills.scss"],names:[],mappings:"AAuCA,MAEE,uHAAA,CACA,6HAAA,CACA,sHAAA,CAwCF,MAEE,uHAAA,CACA,6HAAA,CACA,sHAAA,CCpFF,oBACE,oDAAA,CACA,gDAAA,CACA,+CAAA,CACA,uDAAA,CACA,gBAAA,CACA,sBAAA,CACA,wBAAA,CACA,4BAAA,CAEA,UAAA,CACA,eAAA,CAEA,0BACE,YAAA,CACA,cAAA,CACA,sBAAA,CACA,mBAAA,CACA,SAAA,CACA,QAAA,CAGF,0BACE,mBAAA,CACA,kBAAA,CACA,qCAAA,CACA,4BAAA,CACA,yCAAA,CACA,uCAAA,CACA,2BAAA,CACA,+BAAA,CACA,eAAA,CACA,uBAAA,CACA,QAAA,CAEA,gCACE,0BAAA,CACA,mCAAA,CAIJ,0BACE,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,4BAAA,CACA,gBAAA,CAGF,2BACE,aAAA,CAIF,0BACE,sCAAA,CACA,0BAAA,CACA,0CAAA,CAEA,oDACE,yBAAA,CAGF,oDACE,aAAA,CAKJ,6BACE,oDAAA,CACA,gDAAA,CACA,uDAAA,CAEA,sDACE,sCAAA,CACA,0BAAA,CACA,0CAAA,CAIJ,+BACE,sDAAA,CACA,kDAAA,CACA,yDAAA,CAGF,4BACE,mDAAA,CACA,+CAAA,CACA,sDAAA,CAIF,2BACE,sBAAA,CACA,wBAAA,CACA,eAAA,CAGF,4BACE,sBAAA,CACA,wBAAA,CACA,gBAAA,CAGF,2BACE,sBAAA,CACA,yBAAA,CACA,gBAAA,CAIF,yBACE,0BACE,sBAAA,CAGF,uDACE,sBAAA,CACA,wBAAA,CAAA,CAIJ,yBACE,0BACE,qBAAA,CACA,kBAAA,CAAA",sourcesContent:[`// Design system variables and mixins

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

.hero-feature-pills {
  --pill-bg-color: var(--color-primary-light, #e6f7ff);
  --pill-text-color: var(--color-primary, #0066cc);
  --pill-icon-color: var(--color-accent, #a3e635);
  --pill-border-color: var(--color-primary-dark, #0055aa);
  --pill-gap: 12px;
  --pill-font-size: 14px;
  --pill-padding: 8px 16px;
  --pill-border-radius: 9999px; // Full rounded (rounded-full)
  
  width: 100%;
  margin: 1.5rem 0;
  
  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--pill-gap);
    padding: 0;
    margin: 0;
  }
  
  &__item {
    display: inline-flex;
    align-items: center;
    background-color: var(--pill-bg-color);
    color: var(--pill-text-color);
    border: 1px solid var(--pill-border-color);
    border-radius: var(--pill-border-radius);
    padding: var(--pill-padding);
    font-size: var(--pill-font-size);
    font-weight: 500;
    transition: all 0.2s ease;
    margin: 0;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
  
  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pill-icon-color);
    margin-right: 8px;
  }
  
  &__label {
    line-height: 1;
  }
  
  // Blur variant (matching the Hero component)
  &--blur {
    --pill-bg-color: rgba(31, 41, 55, 0.5); // bg-gray-800/50
    --pill-text-color: #d1d5db; // text-gray-300
    --pill-border-color: rgba(55, 65, 81, 0.5); // border-gray-700/50
    
    .hero-feature-pills__item {
      backdrop-filter: blur(4px);
    }
    
    .hero-feature-pills__icon {
      color: #a3e635; // text-lime-300
    }
  }
  
  // Variant modifiers
  &--primary {
    --pill-bg-color: var(--color-primary-light, #e6f7ff);
    --pill-text-color: var(--color-primary, #0066cc);
    --pill-border-color: var(--color-primary-dark, #0055aa);
    
    &.hero-feature-pills--blur {
      --pill-bg-color: rgba(31, 41, 55, 0.5);
      --pill-text-color: #d1d5db;
      --pill-border-color: rgba(55, 65, 81, 0.5);
    }
  }
  
  &--secondary {
    --pill-bg-color: var(--color-secondary-light, #f0f0f0);
    --pill-text-color: var(--color-secondary, #444444);
    --pill-border-color: var(--color-secondary-dark, #333333);
  }
  
  &--accent {
    --pill-bg-color: var(--color-accent-light, #fff1e6);
    --pill-text-color: var(--color-accent, #ff6600);
    --pill-border-color: var(--color-accent-dark, #dd5500);
  }
  
  // Size modifiers
  &--small {
    --pill-font-size: 12px;
    --pill-padding: 4px 12px;
    --pill-gap: 8px;
  }
  
  &--medium {
    --pill-font-size: 14px;
    --pill-padding: 8px 16px;
    --pill-gap: 12px;
  }
  
  &--large {
    --pill-font-size: 16px;
    --pill-padding: 10px 20px;
    --pill-gap: 16px;
  }
  
  // Responsive styles
  @media (max-width: 768px) {
    &__list {
      justify-content: center;
    }
    
    &--medium, &--large {
      --pill-font-size: 14px;
      --pill-padding: 6px 14px;
    }
  }
  
  @media (max-width: 480px) {
    &__list {
      flex-direction: column;
      align-items: center;
    }
  }
} `],sourceRoot:""}]);let __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);
//# sourceMappingURL=features-Homepage-HeroFeaturePills-stories-HeroFeaturePills-stories.2f07ede8.iframe.bundle.js.map