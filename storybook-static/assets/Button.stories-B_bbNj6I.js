import{c as k}from"./clsx-B-dksMZM.js";var F="_1johgne0",H={primary:"_1johgne1",secondary:"_1johgne2",ghost:"_1johgne3",danger:"_1johgne4",menu:"_1johgne5"},J={default:"_1johgne6",small:"_1johgne7",icon:"_1johgne8",menu:"_1johgne9"};function E({variant:c="primary",size:G="default",active:N,children:P,className:C,type:I="button",...O}){const R=c==="menu";return React.createElement("button",{type:I,className:k(F,H[c],J[G],C),"data-active":R?N:void 0,...O},P)}E.__docgenInfo={description:"",methods:[],displayName:"Button",props:{variant:{required:!1,tsType:{name:"union",raw:"'primary' | 'secondary' | 'ghost' | 'danger' | 'menu'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'ghost'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'menu'"}]},description:"",defaultValue:{value:"'primary'",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'default' | 'small' | 'icon' | 'menu'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'small'"},{name:"literal",value:"'icon'"},{name:"literal",value:"'menu'"}]},description:"",defaultValue:{value:"'default'",computed:!1}},active:{required:!1,tsType:{name:"boolean"},description:'메뉴/리스트 선택 시 활성 표시 (variant="menu" 일 때)'},type:{defaultValue:{value:"'button'",computed:!1},required:!1}}};const L={component:E,title:"Common/Button",tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","ghost","danger","menu"]},size:{control:"select",options:["default","small","icon","menu"]},disabled:{control:"boolean"},active:{control:"boolean"}}},e={args:{variant:"primary",children:"저장"}},a={args:{variant:"secondary",children:"취소"}},r={args:{variant:"ghost",children:"더보기"}},n={args:{variant:"danger",children:"삭제"}},s={args:{variant:"primary",size:"small",children:"작은 버튼"}},t={args:{variant:"primary",children:"비활성",disabled:!0}},o={args:{variant:"menu",children:"메뉴 항목",active:!1}},i={args:{variant:"menu",children:"선택된 메뉴",active:!0}};var l,m,d;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: '저장'
  }
}`,...(d=(m=e.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};var u,p,g;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: '취소'
  }
}`,...(g=(p=a.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var v,h,y;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    variant: 'ghost',
    children: '더보기'
  }
}`,...(y=(h=r.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var f,S,_;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: '삭제'
  }
}`,...(_=(S=n.parameters)==null?void 0:S.docs)==null?void 0:_.source}}};var b,j,z;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'small',
    children: '작은 버튼'
  }
}`,...(z=(j=s.parameters)==null?void 0:j.docs)==null?void 0:z.source}}};var M,q,D;t.parameters={...t.parameters,docs:{...(M=t.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: '비활성',
    disabled: true
  }
}`,...(D=(q=t.parameters)==null?void 0:q.docs)==null?void 0:D.source}}};var T,x,B;o.parameters={...o.parameters,docs:{...(T=o.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    variant: 'menu',
    children: '메뉴 항목',
    active: false
  }
}`,...(B=(x=o.parameters)==null?void 0:x.docs)==null?void 0:B.source}}};var V,w,A;i.parameters={...i.parameters,docs:{...(V=i.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    variant: 'menu',
    children: '선택된 메뉴',
    active: true
  }
}`,...(A=(w=i.parameters)==null?void 0:w.docs)==null?void 0:A.source}}};const Q=["Primary","Secondary","Ghost","Danger","Small","Disabled","Menu","MenuActive"];export{n as Danger,t as Disabled,r as Ghost,o as Menu,i as MenuActive,e as Primary,a as Secondary,s as Small,Q as __namedExportsOrder,L as default};
