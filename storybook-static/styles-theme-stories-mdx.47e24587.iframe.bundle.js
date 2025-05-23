"use strict";(self.webpackChunkai_workout_generator_homepage=self.webpackChunkai_workout_generator_homepage||[]).push([[587],{40419:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{__namedExportsOrder:()=>__namedExportsOrder,__page:()=>__page,default:()=>theme_stories}),__webpack_require__(96540);var mdx_react_shim=__webpack_require__(13979),dist=__webpack_require__(70844),themeColorMap={default:{primary:"#a3e635",secondary:"#22c55e",accent:"#84cc16"},gym:{primary:"#a855f7",secondary:"#8b5cf6",accent:"#c084fc"},sports:{primary:"#06b6d4",secondary:"#0ea5e9",accent:"#22d3ee"},wellness:{primary:"#14b8a6",secondary:"#10b981",accent:"#2dd4bf"},nutrition:{primary:"#f59e0b",secondary:"#d97706",accent:"#fbbf24"}},jsx_runtime=__webpack_require__(74848);function _createMdxContent(props){let _components=Object.assign({h1:"h1",p:"p",h2:"h2",ul:"ul",li:"li",strong:"strong",ol:"ol",code:"code",pre:"pre"},(0,mdx_react_shim.useMDXComponents)(),props.components);return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(dist.W8,{title:"Design System/Theme"}),`
`,(0,jsx_runtime.jsx)(_components.h1,{id:"fitcopilot-theme-system",children:"FitCopilot Theme System"}),`
`,(0,jsx_runtime.jsx)(_components.p,{children:"FitCopilot uses a comprehensive theme system powered by CSS variables and React context. This approach allows for consistent styling across components while supporting multiple theme variants."}),`
`,(0,jsx_runtime.jsx)(_components.h2,{id:"theme-variants",children:"Theme Variants"}),`
`,(0,jsx_runtime.jsx)(_components.p,{children:"FitCopilot supports the following theme variants:"}),`
`,(0,jsx_runtime.jsxs)(_components.ul,{children:[`
`,(0,jsx_runtime.jsxs)(_components.li,{children:[(0,jsx_runtime.jsx)(_components.strong,{children:"Default"}),": The base theme for the application"]}),`
`,(0,jsx_runtime.jsxs)(_components.li,{children:[(0,jsx_runtime.jsx)(_components.strong,{children:"Gym"}),": Theme optimized for gym and fitness center applications"]}),`
`,(0,jsx_runtime.jsxs)(_components.li,{children:[(0,jsx_runtime.jsx)(_components.strong,{children:"Sports"}),": Theme for sports and athletic activities"]}),`
`,(0,jsx_runtime.jsxs)(_components.li,{children:[(0,jsx_runtime.jsx)(_components.strong,{children:"Wellness"}),": Theme for wellness and health content"]}),`
`,(0,jsx_runtime.jsxs)(_components.li,{children:[(0,jsx_runtime.jsx)(_components.strong,{children:"Nutrition"}),": Theme for nutrition and diet-related features"]}),`
`]}),`
`,(0,jsx_runtime.jsx)(_components.h2,{id:"how-theming-works",children:"How Theming Works"}),`
`,(0,jsx_runtime.jsx)(_components.p,{children:"The theme system operates on multiple levels:"}),`
`,(0,jsx_runtime.jsxs)(_components.ol,{children:[`
`,(0,jsx_runtime.jsxs)(_components.li,{children:[(0,jsx_runtime.jsx)(_components.strong,{children:"CSS Variables"}),": Root CSS variables define colors, spacing, typography, etc."]}),`
`,(0,jsx_runtime.jsxs)(_components.li,{children:[(0,jsx_runtime.jsx)(_components.strong,{children:"Theme Variants"}),": Each theme overrides specific variables via ",(0,jsx_runtime.jsx)(_components.code,{children:"data-theme"})," attributes"]}),`
`,(0,jsx_runtime.jsxs)(_components.li,{children:[(0,jsx_runtime.jsx)(_components.strong,{children:"React Context"}),": The ",(0,jsx_runtime.jsx)(_components.code,{children:"ThemeProvider"})," component manages theme state and applies attributes"]}),`
`,(0,jsx_runtime.jsxs)(_components.li,{children:[(0,jsx_runtime.jsx)(_components.strong,{children:"Component Integration"}),": Components consume theme variables for consistent styling"]}),`
`]}),`
`,(0,jsx_runtime.jsx)(_components.h2,{id:"using-themes-in-components",children:"Using Themes in Components"}),`
`,(0,jsx_runtime.jsx)(_components.p,{children:"Components can access theme values in two ways:"}),`
`,(0,jsx_runtime.jsxs)(_components.ol,{children:[`
`,(0,jsx_runtime.jsxs)(_components.li,{children:[(0,jsx_runtime.jsx)(_components.strong,{children:"CSS Variables"}),": Component styles use ",(0,jsx_runtime.jsx)(_components.code,{children:"var(--color-primary)"})," to access theme colors"]}),`
`,(0,jsx_runtime.jsxs)(_components.li,{children:[(0,jsx_runtime.jsx)(_components.strong,{children:"Context API"}),": The ",(0,jsx_runtime.jsx)(_components.code,{children:"useTheme()"})," hook provides direct access to theme state in components"]}),`
`]}),`
`,(0,jsx_runtime.jsx)(_components.p,{children:"Example:"}),`
`,(0,jsx_runtime.jsx)(_components.pre,{children:(0,jsx_runtime.jsx)(_components.code,{className:"language-tsx",children:`import { useTheme } from '../../context/ThemeContext';

const MyComponent = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="my-component">
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('sports')}>Switch to Sports</button>
    </div>
  );
};
`})}),`
`,(0,jsx_runtime.jsx)(_components.h2,{id:"theme-color-palette",children:"Theme Color Palette"}),`
`,(0,jsx_runtime.jsxs)(dist.rE,{children:[(0,jsx_runtime.jsx)(dist.Jl,{title:"Default Theme",subtitle:"Base colors",colors:{primary:themeColorMap.default.primary,secondary:themeColorMap.default.secondary,accent:themeColorMap.default.accent}}),(0,jsx_runtime.jsx)(dist.Jl,{title:"Gym Theme",subtitle:"Fitness center focused",colors:{primary:themeColorMap.gym.primary,secondary:themeColorMap.gym.secondary,accent:themeColorMap.gym.accent}}),(0,jsx_runtime.jsx)(dist.Jl,{title:"Sports Theme",subtitle:"Athletic activities",colors:{primary:themeColorMap.sports.primary,secondary:themeColorMap.sports.secondary,accent:themeColorMap.sports.accent}}),(0,jsx_runtime.jsx)(dist.Jl,{title:"Wellness Theme",subtitle:"Health and wellness",colors:{primary:themeColorMap.wellness.primary,secondary:themeColorMap.wellness.secondary,accent:themeColorMap.wellness.accent}}),(0,jsx_runtime.jsx)(dist.Jl,{title:"Nutrition Theme",subtitle:"Diet and nutrition",colors:{primary:themeColorMap.nutrition.primary,secondary:themeColorMap.nutrition.secondary,accent:themeColorMap.nutrition.accent}})]}),`
`,(0,jsx_runtime.jsx)(_components.h2,{id:"testing-components-with-different-themes",children:"Testing Components with Different Themes"}),`
`,(0,jsx_runtime.jsx)(_components.p,{children:"When testing components in Storybook:"}),`
`,(0,jsx_runtime.jsxs)(_components.ol,{children:[`
`,(0,jsx_runtime.jsx)(_components.li,{children:"Use the theme selector in the toolbar to preview components in different themes"}),`
`,(0,jsx_runtime.jsx)(_components.li,{children:'Create a "ThemeShowcase" story that displays a component in all available themes'}),`
`,(0,jsx_runtime.jsxs)(_components.li,{children:["Test theme-specific features by using the ",(0,jsx_runtime.jsx)(_components.code,{children:"ThemeProvider"})," in your story"]}),`
`]}),`
`,(0,jsx_runtime.jsx)(_components.h2,{id:"best-practices",children:"Best Practices"}),`
`,(0,jsx_runtime.jsxs)(_components.ul,{children:[`
`,(0,jsx_runtime.jsx)(_components.li,{children:"Always use CSS variables for themeable properties"}),`
`,(0,jsx_runtime.jsx)(_components.li,{children:"Test components in all theme variants"}),`
`,(0,jsx_runtime.jsxs)(_components.li,{children:["Use semantic color names in your components (e.g., ",(0,jsx_runtime.jsx)(_components.code,{children:"--color-primary"})," not ",(0,jsx_runtime.jsx)(_components.code,{children:"--purple-500"}),")"]}),`
`,(0,jsx_runtime.jsx)(_components.li,{children:"Keep theme-specific overrides in the theme files, not in component styles"}),`
`]})]})}function MDXContent(props={}){let{wrapper:MDXLayout}=Object.assign({},(0,mdx_react_shim.useMDXComponents)(),props.components);return MDXLayout?(0,jsx_runtime.jsx)(MDXLayout,{...props,children:(0,jsx_runtime.jsx)(_createMdxContent,{...props})}):_createMdxContent(props)}let __page=()=>{throw Error("Docs-only story")};__page.parameters={docsOnly:!0};let componentMeta={title:"Design System/Theme",tags:["stories-mdx"],includeStories:["__page"]};componentMeta.parameters=componentMeta.parameters||{},componentMeta.parameters.docs={...componentMeta.parameters.docs||{},page:MDXContent};let theme_stories=componentMeta,__namedExportsOrder=["__page"]}}]);
//# sourceMappingURL=styles-theme-stories-mdx.47e24587.iframe.bundle.js.map