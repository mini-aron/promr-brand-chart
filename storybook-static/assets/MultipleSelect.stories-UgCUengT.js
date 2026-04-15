import{r as c}from"./index-Bc2G9s8g.js";import{M as a}from"./Select-V8LGd5VE.js";import"./clsx-B-dksMZM.js";const d=[{label:"A법인",value:"corp-1"},{label:"B법인",value:"corp-2"},{label:"C법인",value:"corp-3"},{label:"D법인",value:"corp-4"}],m={component:a,title:"Common/MultipleSelect",tags:["autodocs"],argTypes:{placeholder:{control:"text"},enableSearch:{control:"boolean"},size:{control:"select",options:["default","large"]}}},e={render:o=>{const[s,n]=c.useState([]);return React.createElement("div",{style:{width:280}},React.createElement(a,{...o,options:d,selectedItems:s,onChange:n}))},args:{placeholder:"법인 다중 선택",enableSearch:!1}};var t,r,l;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: args => {
    const [selected, setSelected] = useState<(string | number)[]>([]);
    return <div style={{
      width: 280
    }}>\r
        <MultipleSelect {...args} options={options} selectedItems={selected} onChange={setSelected} />\r
      </div>;
  },
  args: {
    placeholder: '법인 다중 선택',
    enableSearch: false
  }
}`,...(l=(r=e.parameters)==null?void 0:r.docs)==null?void 0:l.source}}};const S=["Default"];export{e as Default,S as __namedExportsOrder,m as default};
