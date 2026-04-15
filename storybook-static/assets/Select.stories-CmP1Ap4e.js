import{r as o}from"./index-Bc2G9s8g.js";import{S as c}from"./Select-V8LGd5VE.js";import"./clsx-B-dksMZM.js";const b=[{label:"A법인",value:"corp-1"},{label:"B법인",value:"corp-2"},{label:"C법인",value:"corp-3"},{label:"D법인",value:"corp-4"}],f=[{label:"제품A",value:"P001",description:"품목코드 P001"},{label:"제품B",value:"P002",description:"품목코드 P002"},{label:"제품C",value:"P003",description:"품목코드 P003"}],z={component:c,title:"Common/SingleSelect",tags:["autodocs"],argTypes:{placeholder:{control:"text"},enableSearch:{control:"boolean"},size:{control:"select",options:["default","large"]}}},a={render:e=>{const[t,r]=o.useState(null);return React.createElement("div",{style:{width:280}},React.createElement(c,{...e,options:b,selected:t,onChange:n=>r(n)}))},args:{placeholder:"법인 선택",enableSearch:!1,size:"default"}},s={render:e=>{const[t,r]=o.useState(null);return React.createElement("div",{style:{width:280}},React.createElement(c,{...e,options:f,selected:t,onChange:n=>r(n)}))},args:{placeholder:"품목 선택",enableSearch:!0,size:"default"}},l={render:e=>{const[t,r]=o.useState("corp-2");return React.createElement("div",{style:{width:320}},React.createElement(c,{...e,options:b,selected:t,onChange:n=>r(n)}))},args:{placeholder:"옵션 선택",size:"large"}};var d,i,u;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: args => {
    const [selected, setSelected] = useState<string | number | null>(null);
    return <div style={{
      width: 280
    }}>\r
        <SingleSelect {...args} options={options} selected={selected} onChange={v => setSelected(v)} />\r
      </div>;
  },
  args: {
    placeholder: '법인 선택',
    enableSearch: false,
    size: 'default'
  }
}`,...(u=(i=a.parameters)==null?void 0:i.docs)==null?void 0:u.source}}};var p,g,S;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: args => {
    const [selected, setSelected] = useState<string | number | null>(null);
    return <div style={{
      width: 280
    }}>\r
        <SingleSelect {...args} options={optionsWithDescription} selected={selected} onChange={v => setSelected(v)} />\r
      </div>;
  },
  args: {
    placeholder: '품목 선택',
    enableSearch: true,
    size: 'default'
  }
}`,...(S=(g=s.parameters)==null?void 0:g.docs)==null?void 0:S.source}}};var m,h,v;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: args => {
    const [selected, setSelected] = useState<string | number | null>('corp-2');
    return <div style={{
      width: 320
    }}>\r
        <SingleSelect {...args} options={options} selected={selected} onChange={v => setSelected(v)} />\r
      </div>;
  },
  args: {
    placeholder: '옵션 선택',
    size: 'large'
  }
}`,...(v=(h=l.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};const w=["Default","WithSearch","Large"];export{a as Default,l as Large,s as WithSearch,w as __namedExportsOrder,z as default};
