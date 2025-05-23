"use strict";(self.webpackChunkai_workout_generator_homepage=self.webpackChunkai_workout_generator_homepage||[]).push([[459],{78448:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{AsLink:()=>AsLink,Disabled:()=>Disabled,FullWidth:()=>FullWidth,Large:()=>Large,Primary:()=>Primary,PrimaryGradientShowcase:()=>PrimaryGradientShowcase,Secondary:()=>Secondary,Small:()=>Small,ThemeShowcase:()=>ThemeShowcase,WithLeftIcon:()=>WithLeftIcon,WithRightIcon:()=>WithRightIcon,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(96540),___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(82812);function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable}))),ownKeys.forEach(function(key){_define_property(target,key,source[key])})}return target}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable})),keys.push.apply(keys,symbols)}return keys}function _object_spread_props(target,source){return source=null!=source?source:{},Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}),target}let __WEBPACK_DEFAULT_EXPORT__={title:"Features/Homepage/Hero/HeroButton",component:___WEBPACK_IMPORTED_MODULE_1__.j,parameters:{layout:"centered",docs:{description:{component:`
          A specialized button for the homepage hero section with theme support and icon handling.
          
          The HeroButton component extends the base Button component with Hero-specific styling,
          including gradient backgrounds, specific size constraints, and theme support for the gym, 
          sports, and wellness themes. It's designed for high-visibility CTAs in the hero section.
          
          This component uses CSS variables for theming through the data-theme attribute, with 
          consistent styling across all supported themes. It handles both primary (gradient) and 
          secondary (outline) variants.
        `}}},tags:["autodocs"],argTypes:{variant:{control:"radio",options:["primary","secondary"],description:"Visual style variant of the button. Primary uses gradient background, Secondary uses outline style.",table:{type:{summary:"'primary' | 'secondary'"},defaultValue:{summary:"primary"}}},size:{control:"radio",options:["small","medium","large"],description:"Size variant that controls font size, padding, and min-width. Responsive at different breakpoints.",table:{type:{summary:"'small' | 'medium' | 'large'"},defaultValue:{summary:"medium"}}},disabled:{control:"boolean",description:"Disables the button, preventing user interaction and applying a disabled visual style.",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},fullWidth:{control:"boolean",description:"When true, the button expands to take the full width of its container.",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},leftIcon:{control:"text",description:"Icon to display on the left side of the button. Can be text or a React element.",table:{type:{summary:"React.ReactNode"},defaultValue:{summary:"undefined"}}},rightIcon:{control:"text",description:"Icon to display on the right side of the button. Can be text or a React element.",table:{type:{summary:"React.ReactNode"},defaultValue:{summary:"undefined"}}},href:{control:"text",description:"URL to navigate to. When provided, the button renders as an anchor <a> element.",table:{type:{summary:"string"},defaultValue:{summary:"undefined"}}},onClick:{action:"clicked",description:"Function called when the button is clicked. Receives the click event as parameter.",table:{type:{summary:"(event: React.MouseEvent<HTMLButtonElement>) => void"},defaultValue:{summary:"undefined"}}},children:{control:"text",description:"Button content/label. Can be text or React elements.",table:{type:{summary:"React.ReactNode"},defaultValue:{summary:"undefined"}}},className:{control:"text",description:"Additional CSS class names to apply to the button.",table:{type:{summary:"string"},defaultValue:{summary:'""'}}},"aria-label":{control:"text",description:"Accessible label for the button, important when the button only contains an icon.",table:{type:{summary:"string"},defaultValue:{summary:"undefined"}}},"aria-controls":{control:"text",description:"ID of the element the button controls, used for accessibility.",table:{type:{summary:"string"},defaultValue:{summary:"undefined"}}},"aria-expanded":{control:"boolean",description:"Indicates if the controlled element is expanded, used for accessibility.",table:{type:{summary:"boolean"},defaultValue:{summary:"undefined"}}},"aria-pressed":{control:"boolean",description:"Indicates if the button is pressed, used for toggle buttons.",table:{type:{summary:"boolean"},defaultValue:{summary:"undefined"}}},"data-testid":{control:"text",description:"Test ID for automated testing.",table:{type:{summary:"string"},defaultValue:{summary:"undefined"}}}}};var Primary={args:{variant:"primary",children:"Start Your Fitness Journey",size:"medium"},parameters:{docs:{description:{story:"Primary button with consistent lime-to-emerald gradient across all themes. Hover state transitions to a darker gradient while maintaining the same color family."}},backgrounds:{default:"dark"}}},PrimaryGradientShowcase={render:function(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"gradient-showcase"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("style",null,`
        .gradient-showcase { 
          display: flex; 
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
          background-color: #1f2937;
          border-radius: 8px;
          color: white;
        }
        .showcase-section {
          margin-bottom: 1.5rem;
        }
        .gradient-info { 
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .color-stop {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .showcase-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: white;
        }
        .color-code {
          font-family: monospace;
          font-size: 0.875rem;
          color: #d1d5db;
        }
        .theme-note {
          margin-top: 1.5rem;
          padding: 0.75rem;
          background-color: rgba(163, 230, 53, 0.1);
          border-left: 3px solid #a3e635;
          border-radius: 4px;
          font-size: 0.875rem;
        }
        .default-gradient { background: linear-gradient(to right, #a3e635, #34d399); }
        .hover-gradient { background: linear-gradient(to right, #84cc16, #10b981); }
        
        /* Custom hover simulation */
        .hover-simulation {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
        }
        .hover-simulation:after {
          content: '← Hover simulation (mouse over)';
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.75rem;
          color: rgba(255,255,255,0.7);
          pointer-events: none;
          opacity: 0.5;
          transition: opacity 0.2s ease;
        }
        .hover-simulation:hover:after {
          opacity: 0;
        }
        .hover-button {
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }
        .hover-button:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to right, #84cc16, #10b981);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
          border-radius: inherit;
        }
        .hover-button:hover:before {
          opacity: 1;
        }
        .hover-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }
      `),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"showcase-section"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"showcase-title"},"Default State"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"gradient-info"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"color-stop",style:{background:"#a3e635"}}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{className:"color-code"},"lime-300 (#a3e635)"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,"→"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"color-stop",style:{background:"#34d399"}}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{className:"color-code"},"emerald-400 (#34d399)")),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"default-gradient",style:{padding:"1px",borderRadius:"4px"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_1__.j,{variant:"primary"},"Default State"))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"showcase-section"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"showcase-title"},"Hover State"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"gradient-info"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"color-stop",style:{background:"#84cc16"}}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{className:"color-code"},"lime-400 (#84cc16)"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,"→"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"color-stop",style:{background:"#10b981"}}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{className:"color-code"},"emerald-500 (#10b981)")),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"hover-simulation"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"hover-gradient",style:{padding:"1px",borderRadius:"4px"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_1__.j,{variant:"primary",className:"hover-button"},"Interactive Hover Demo")))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"theme-note"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong",null,"Theme Consistency:")," The primary button gradient remains consistent across all themes (default, gym, sports, wellness). This is an intentional design decision to maintain brand recognition in the hero section."))},parameters:{layout:"padded",docs:{description:{story:"This showcase demonstrates the exact gradient implementation of the primary HeroButton in both default and hover states. The primary button intentionally maintains the same gradient across all themes. Mouse over the Interactive Hover Demo to see the hover effect."}}}},Secondary={args:{variant:"secondary",children:"Learn More",size:"medium"}},WithLeftIcon={args:{variant:"primary",children:"Get Started",leftIcon:"→",size:"medium"}},WithRightIcon={args:{variant:"primary",children:"Next Steps",rightIcon:"→",size:"medium"}},Large={args:{variant:"primary",children:"Join Now",size:"large"}},Small={args:{variant:"primary",children:"Sign Up",size:"small"}},Disabled={args:{variant:"primary",children:"Coming Soon",disabled:!0,size:"medium"}},AsLink={args:{variant:"primary",children:"Visit Our Blog",href:"#",size:"medium"}},FullWidth={args:{variant:"primary",children:"Sign Up For Free",fullWidth:!0,size:"medium"},parameters:{layout:"padded"}},ThemeShowcase={render:function(args){return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"theme-showcase"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("style",null,`
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
            flex-direction: column;
            gap: 16px;
          }
          
          .variant-row {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
          
          .variant-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
          }

          .theme-note {
            margin-top: 16px;
            padding: 12px;
            background-color: #f9fafb;
            border-radius: 4px;
            border-left: 3px solid #a3e635;
            font-size: 12px;
            color: #333;
          }
        `),["default","gym","sports","wellness"].map(function(theme){return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{key:theme,className:"theme-variant"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"theme-header"},theme.charAt(0).toUpperCase()+theme.slice(1)," Theme"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"theme-content","data-theme":theme},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"variant-label"},"Primary"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"variant-row"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_1__.j,_object_spread_props(_object_spread({},args),{variant:"primary"}),"Primary"))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"variant-label"},"Secondary"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"variant-row"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_1__.j,_object_spread_props(_object_spread({},args),{variant:"secondary"}),"Secondary"))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"theme-note"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong",null,"Note:")," Primary buttons maintain the same lime-to-emerald gradient across all themes. Secondary buttons have theme-specific hover states.")))}))},args:{children:"Theme Showcase",size:"medium"},parameters:{layout:"padded",docs:{description:{story:`
          This showcase demonstrates the HeroButton across all supported themes (default, gym, sports, wellness).
          
          **Important Implementation Details:**
          - Primary buttons maintain a consistent lime-to-emerald gradient across all themes for brand recognition
          - Secondary buttons have theme-specific hover background colors while maintaining consistent lime border
          - The gradient for primary buttons transitions to a darker version on hover
        `}}}};Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Start Your Fitness Journey',
    size: 'medium'
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary button with consistent lime-to-emerald gradient across all themes. Hover state transitions to a darker gradient while maintaining the same color family.'
      }
    },
    backgrounds: {
      default: 'dark'
    }
  }
}`,...Primary.parameters?.docs?.source}}},PrimaryGradientShowcase.parameters={...PrimaryGradientShowcase.parameters,docs:{...PrimaryGradientShowcase.parameters?.docs,source:{originalSource:`{
  render: () => <div className="gradient-showcase">
      <style>{\`
        .gradient-showcase { 
          display: flex; 
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
          background-color: #1f2937;
          border-radius: 8px;
          color: white;
        }
        .showcase-section {
          margin-bottom: 1.5rem;
        }
        .gradient-info { 
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .color-stop {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .showcase-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: white;
        }
        .color-code {
          font-family: monospace;
          font-size: 0.875rem;
          color: #d1d5db;
        }
        .theme-note {
          margin-top: 1.5rem;
          padding: 0.75rem;
          background-color: rgba(163, 230, 53, 0.1);
          border-left: 3px solid #a3e635;
          border-radius: 4px;
          font-size: 0.875rem;
        }
        .default-gradient { background: linear-gradient(to right, #a3e635, #34d399); }
        .hover-gradient { background: linear-gradient(to right, #84cc16, #10b981); }
        
        /* Custom hover simulation */
        .hover-simulation {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
        }
        .hover-simulation:after {
          content: '← Hover simulation (mouse over)';
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.75rem;
          color: rgba(255,255,255,0.7);
          pointer-events: none;
          opacity: 0.5;
          transition: opacity 0.2s ease;
        }
        .hover-simulation:hover:after {
          opacity: 0;
        }
        .hover-button {
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }
        .hover-button:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to right, #84cc16, #10b981);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
          border-radius: inherit;
        }
        .hover-button:hover:before {
          opacity: 1;
        }
        .hover-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }
      \`}</style>
      <div className="showcase-section">
        <div className="showcase-title">Default State</div>
        <div className="gradient-info">
          <div className="color-stop" style={{
          background: '#a3e635'
        }}></div>
          <span className="color-code">lime-300 (#a3e635)</span>
          <span>→</span>
          <div className="color-stop" style={{
          background: '#34d399'
        }}></div>
          <span className="color-code">emerald-400 (#34d399)</span>
        </div>
        <div className="default-gradient" style={{
        padding: '1px',
        borderRadius: '4px'
      }}>
          <HeroButton variant="primary">Default State</HeroButton>
        </div>
      </div>
      <div className="showcase-section">
        <div className="showcase-title">Hover State</div>
        <div className="gradient-info">
          <div className="color-stop" style={{
          background: '#84cc16'
        }}></div>
          <span className="color-code">lime-400 (#84cc16)</span>
          <span>→</span>
          <div className="color-stop" style={{
          background: '#10b981'
        }}></div>
          <span className="color-code">emerald-500 (#10b981)</span>
        </div>
        <div className="hover-simulation">
          <div className="hover-gradient" style={{
          padding: '1px',
          borderRadius: '4px'
        }}>
            <HeroButton variant="primary" className="hover-button">Interactive Hover Demo</HeroButton>
          </div>
        </div>
      </div>
      <div className="theme-note">
        <strong>Theme Consistency:</strong> The primary button gradient remains consistent across all themes (default, gym, sports, wellness). This is an intentional design decision to maintain brand recognition in the hero section.
      </div>
    </div>,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'This showcase demonstrates the exact gradient implementation of the primary HeroButton in both default and hover states. The primary button intentionally maintains the same gradient across all themes. Mouse over the Interactive Hover Demo to see the hover effect.'
      }
    }
  }
}`,...PrimaryGradientShowcase.parameters?.docs?.source}}},Secondary.parameters={...Secondary.parameters,docs:{...Secondary.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Learn More',
    size: 'medium'
  }
}`,...Secondary.parameters?.docs?.source}}},WithLeftIcon.parameters={...WithLeftIcon.parameters,docs:{...WithLeftIcon.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Get Started',
    leftIcon: '→',
    size: 'medium'
  }
}`,...WithLeftIcon.parameters?.docs?.source}}},WithRightIcon.parameters={...WithRightIcon.parameters,docs:{...WithRightIcon.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Next Steps',
    rightIcon: '→',
    size: 'medium'
  }
}`,...WithRightIcon.parameters?.docs?.source}}},Large.parameters={...Large.parameters,docs:{...Large.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Join Now',
    size: 'large'
  }
}`,...Large.parameters?.docs?.source}}},Small.parameters={...Small.parameters,docs:{...Small.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Sign Up',
    size: 'small'
  }
}`,...Small.parameters?.docs?.source}}},Disabled.parameters={...Disabled.parameters,docs:{...Disabled.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Coming Soon',
    disabled: true,
    size: 'medium'
  }
}`,...Disabled.parameters?.docs?.source}}},AsLink.parameters={...AsLink.parameters,docs:{...AsLink.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Visit Our Blog',
    href: '#',
    size: 'medium'
  }
}`,...AsLink.parameters?.docs?.source}}},FullWidth.parameters={...FullWidth.parameters,docs:{...FullWidth.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Sign Up For Free',
    fullWidth: true,
    size: 'medium'
  },
  parameters: {
    layout: 'padded'
  }
}`,...FullWidth.parameters?.docs?.source}}},ThemeShowcase.parameters={...ThemeShowcase.parameters,docs:{...ThemeShowcase.parameters?.docs,source:{originalSource:`{
  render: args => HeroButtonWithThemes(args),
  args: {
    children: 'Theme Showcase',
    size: 'medium'
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: \`
          This showcase demonstrates the HeroButton across all supported themes (default, gym, sports, wellness).
          
          **Important Implementation Details:**
          - Primary buttons maintain a consistent lime-to-emerald gradient across all themes for brand recognition
          - Secondary buttons have theme-specific hover background colors while maintaining consistent lime border
          - The gradient for primary buttons transitions to a darker version on hover
        \`
      }
    }
  }
}`,...ThemeShowcase.parameters?.docs?.source}}};let __namedExportsOrder=["Primary","PrimaryGradientShowcase","Secondary","WithLeftIcon","WithRightIcon","Large","Small","Disabled","AsLink","FullWidth","ThemeShowcase"]}}]);
//# sourceMappingURL=features-Homepage-Hero-components-HeroButton-stories-HeroButton-stories.1dd4447e.iframe.bundle.js.map