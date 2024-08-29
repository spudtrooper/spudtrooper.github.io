/*! For license information please see main.03aafe76.js.LICENSE.txt */
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`)),ir=(0,qn.i7)(Zn||(Zn=nr`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`)),or=(0,qn.i7)(er||(er=nr`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`)),sr=(0,En.Ay)("span",{name:"MuiTouchRipple",slot:"Root"})({overflow:"hidden",pointerEvents:"none",position:"absolute",zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:"inherit"}),ar=(0,En.Ay)(Yn,{name:"MuiTouchRipple",slot:"Ripple"})(tr||(tr=nr`
  opacity: 0;
  position: absolute;

  &.${0} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  &.${0} {
    animation-duration: ${0}ms;
  }

  & .${0} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${0} {
    opacity: 0;
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  & .${0} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${0};
    animation-duration: 2500ms;
    animation-timing-function: ${0};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
  position: relative;
  flex-grow: 1;

  input {
    opacity: 0 !important;
  }

  & > span {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
    display: flex;
    align-items: center;
  }

  span.MuiFileInput-placeholder {
    color: gray;
  }
`,Filename:(0,En.Ay)("div")`
  display: flex;
  width: 100%;

  & > span {
    display: block;
  }

  & > span:first-of-type {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  & > span:last-of-type {
    flex-shrink: 0;
    display: block;
  }
`},gL=t.forwardRef(((e,t)=>{const{text:n,isPlaceholder:r,placeholder:i,...o}=e;return(0,h.jsxs)(mL.Label,{children:[(0,h.jsx)("input",{...o,ref:t}),n?(0,h.jsx)("span",{"aria-placeholder":i,className:r?"MuiFileInput-placeholder":"",children:"string"==typeof n?n:(0,h.jsxs)(mL.Filename,{children:[(0,h.jsx)("span",{children:n.filename}),(0,h.jsxs)("span",{children:[".",n.extension]})]})}):null]})}));function vL(e){return typeof window<"u"&&e instanceof File}const AL=typeof window<"u"?t.useLayoutEffect:t.useEffect,bL=t.forwardRef(((e,n)=>{const{value:r,onChange:i,disabled:o,getInputText:s,getSizeText:a,placeholder:l,hideSizeText:c,inputProps:u,InputProps:d,multiple:f,className:p,clearIconButtonProps:m={},...g}=e,{className:v="",...A}=m,b=t.useRef(null),{startAdornment:y,...x}=d||{},C=f||u?.multiple||d?.inputProps?.multiple||!1,w=()=>{b.current&&(b.current.value="")},k=Array.isArray(r)?function(e){return e.length>0}(r):vL(r);AL((()=>{const e=b.current;e&&!k&&(e.value="")}),[k]);return(0,h.jsx)(lC,{ref:n,type:"file",disabled:o,onChange:e=>{const t=e.target.files,n=t?function(e){return Array.from(e)}(t):[];f?(i?.(n),0===n.length&&w()):(i?.(n[0]||null),n[0]||w())},className:`MuiFileInput-TextField ${p||""}`,InputProps:{startAdornment:(0,h.jsx)(mC,{position:"start",children:y}),endAdornment:(0,h.jsxs)(mC,{position:"end",style:{visibility:k?"visible":"hidden"},children:[c?null:(0,h.jsx)(Xr,{variant:"caption",mr:"2px",lineHeight:1,className:"MuiFileInput-Typography-size-text",children:(()=>{if("function"==typeof a&&void 0!==r)return a(r);if(k){if(Array.isArray(r)){const e=function(e){return e.reduce(((e,t)=>e+t.size),0)}(r);return pL(e)}if(vL(r))return pL(r.size)}return""})()}),(0,h.jsx)(Sg,{"aria-label":"Clear",title:"Clear",size:"small",disabled:o,className:`${v} MuiFileInput-ClearIconButton`,onClick:e=>{e.preventDefault(),!o&&i?.(f?[]:null)},...A})]}),...x,inputProps:{text:null===r||Array.isArray(r)&&0===r.length?l||"":"function"==typeof s&&void 0!==r?s(r):r&&k?Array.isArray(r)&&r.length>1?`${r.length} files`:function(e){const t=(vL(e)?e.name:e[0]?.name||"").split("."),n=t.pop();return{filename:t.join("."),extension:n}}(r):"",multiple:C,ref:b,isPlaceholder:!k,placeholder:l,...u,...d?.inputProps},inputComponent:gL},...g})}));var yL=n(1988),xL=n(3079),CL=n(399),wL={};wL.styleTagTransform=ux(),wL.setAttributes=sx(),wL.insert=ix().bind(null,"head"),wL.domAPI=nx(),wL.insertStyleElement=lx();ex()(CL.A,wL);CL.A&&CL.A.locals&&CL.A.locals;const kL=function(){const[e,n]=t.useState(null),[r,i]=t.useState(null),{two:o,divElm:s}=_p(),a=(0,t.useRef)(),l=(0,t.useRef)(),c=Dt(),{showError:u}=Dl();(0,t.useEffect)((()=>{if(!e)return;(async()=>{const t=new Blob([e]),n=Wp(t),r=await n.read(),{midi:i,animationConfigs:o}=r;return{audioSrc:URL.createObjectURL(t),midi:i.val,animationConfigs:o.map((e=>e.val))}})().then((e=>i(e))).catch((e=>u(e)))}),[e,i]);const d=(0,t.useCallback)((e=>{console.log(e),e&&["audio/mp3","audio/mpeg"].includes(null===e||void 0===e?void 0:e.type)?n(e):n(null)}),[n]),f=()=>(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(Xr,{variant:"h5",children:"you got mp3?"}),(0,h.jsx)(wn,{sx:{mt:2},children:(0,h.jsx)(bL,{disabled:!!r,value:e,onChange:d,placeholder:"mp3 here",datatype:"audio/mp3",clearIconButtonProps:{children:(0,h.jsx)(xL.A,{fontSize:"small"})},InputProps:{startAdornment:(0,h.jsx)(yL.A,{})}})})]});(0,t.useEffect)((()=>{if(!r)return;const e=r.animationConfigs[0];l.current=e.animations.map((e=>Pc(e)));const t=r.midi;a.current={getNotes:e=>{const{startMillis:n,durationMillis:r,criteria:i}=e;return Au(t,{startMillis:n,durationMillis:r,criteria:i})},source:t}}),[r]),(0,t.useEffect)((()=>{o.current.clear(),o.current.update()}),[o]);const p=e=>{const[r,u]=t.useState(!1),[d,f]=t.useState(!1),p=(0,t.useCallback)((e=>{var t;f(!0),(e=>{if(!a.current)return;if(!l.current)return;if(!s.current)return;const{currentTimeMillis:t}=e,{width:n,height:r}=s.current.getBoundingClientRect();o.current.clear();for(const i of l.current){const e=a.current.getNotes({startMillis:t,durationMillis:aL,criteria:i.criteria});e.length&&i.draw(e,{width:n,height:r,canvas:null,canvasElement:null,two:o.current,zoomFactor:1,offset:{x:0,y:-200}})}o.current.update()})({currentTimeMillis:1e3*(null===g||void 0===g||null===(t=g.current)||void 0===t?void 0:t.currentTime)})}),[f]),m={tick:(0,t.useCallback)((e=>{p("tick"),u((()=>{var e,t,n;return(null===(e=g.current)||void 0===e?void 0:e.currentTime)>0&&!(null!==(t=g.current)&&void 0!==t&&t.paused)&&(null===(n=g.current)||void 0===n?void 0:n.duration)>0})())}),[p]),onPlayStopped:p,onPlayStarted:p},g=(0,t.useRef)(),v=(0,t.useRef)(),A=(0,t.useCallback)((()=>(0,h.jsx)(ws,{sx:{color:"#fff"},onClick:()=>{if(console.log("PlayButton","isPlaying",r),r)return console.log("pause"),void g.current.pause();console.log("play"),g.current.play(),v.current||(v.current=new lL(g.current,{ignoreCreateErrors:!1}),v.current.setCallback(m),v.current.start())},children:r?(0,h.jsx)(vk.A,{fontSize:"large"}):(0,h.jsx)(Ak.A,{fontSize:"large"})})),[r,d]),b=()=>(0,h.jsx)(ws,{sx:{color:"#fff"},onClick:()=>{i(null),n(null),f(!1),u(!1),v.current.stop(),v.current=null,g.current.pause(),g.current=null,c("/home?play")},children:(0,h.jsx)(fk.A,{fontSize:"large"})});return e.src?(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("audio",{ref:e=>{e&&(g.current||(g.current=e))},style:{width:"100%",margin:"auto"},children:(0,h.jsx)("source",{src:e.src,type:"audio/mp3"})}),(0,h.jsxs)(wn,{children:[d&&(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(b,{}),(0,h.jsx)(A,{})]}),!d&&(0,h.jsxs)(h.Fragment,{children:["Click \u2192",(0,h.jsx)(A,{})]})]})]}):void 0},m=(0,t.useCallback)((()=>{if(null!==r&&void 0!==r&&r.audioSrc)return(0,h.jsx)(p,{src:r.audioSrc})}),[null===r||void 0===r?void 0:r.audioSrc]);return(0,h.jsx)(h.Fragment,{children:(0,h.jsxs)(rs,{sx:{p:1},children:[(0,h.jsx)(f,{}),(0,h.jsx)(m,{}),(0,h.jsx)("div",{style:{backgroundColor:Xy,borderRadius:0,height:"100%",width:"100%",overflow:"hidden"},children:(0,h.jsx)("div",{id:"divElm",ref:s,style:{overflow:"auto"}})})]})})},EL={name:"midiz",version:4,objectStoresMeta:[{store:"file",storeConfig:{keyPath:"id",autoIncrement:!0},storeSchema:[{name:"name",keypath:"name",options:{unique:!1}},{name:"type",keypath:"type",options:{unique:!1}},{name:"size",keypath:"size",options:{unique:!1}},{name:"blob",keypath:"blob",options:{unique:!1}},{name:"checksum",keypath:"checksum",options:{unique:!1}},{name:"created",keypath:"created",options:{unique:!1}},{name:"updated",keypath:"updated",options:{unique:!1}}]},{store:"workspace",storeConfig:{keyPath:"id",autoIncrement:!0},storeSchema:[{name:"key",keypath:"key",options:{unique:!1}},{name:"name",keypath:"name",options:{unique:!1}},{name:"audio_file_id",keypath:"audio_file_id",options:{unique:!1}},{name:"midi_file_id",keypath:"midi_file_id",options:{unique:!1}},{name:"midiz_file_id",keypath:"midiz_file_id",options:{unique:!1}},{name:"creation_template",keypath:"creation_template",options:{unique:!1}},{name:"created",keypath:"created",options:{unique:!1}},{name:"updated",keypath:"updated",options:{unique:!1}}]}]};var SL=n(9493),_L=n.n(SL);const FL=e=>{const{children:t}=e;return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(wn,{sx:{flexGrow:1,mb:3},children:(0,h.jsx)(VM,{position:"static",sx:{backgroundColor:"rgba(10,10,10,.7)"},children:(0,h.jsx)(YM,{variant:"dense",children:(0,h.jsx)(wn,{sx:{display:"flex"},children:(0,h.jsx)(ws,{href:"/",variant:"text",color:"inherit",children:"Home"})})})})}),(0,h.jsx)(rs,{children:t})]})},jL=()=>(0,h.jsxs)(FL,{children:[(0,h.jsx)(Xr,{variant:"h6",children:"Privacy notice"}),(0,h.jsxs)(Xr,{variant:"body1",children:["Nothing is stored on a server. All files you upload and/or save are stored in your browser using an IndexedDB named ",(0,h.jsx)("code",{children:"midiz"})," with the following schema:"]}),(0,h.jsxs)(Bj,{children:[(0,h.jsx)(Ij,{expandIcon:(0,h.jsx)(Qj.A,{}),children:"IndexedDB schema"}),(0,h.jsx)(Vj,{children:(0,h.jsx)(_L(),{data:EL})})]})]}),TL=()=>(0,h.jsx)(h.Fragment,{children:"asdfasdf"}),BL=()=>{const[e,n]=(0,t.useState)([500,"auto"]),[r,i]=(0,t.useState)([120,"auto"]),[o,s]=(0,t.useState)([800,"auto"]),a={height:"100%",display:"flex",alignItems:"center",justifyContent:"center"};return(0,h.jsx)(h.Fragment,{children:(0,h.jsx)("div",{style:{height:"100%"},children:(0,h.jsxs)(DM,{sashRender:e=>(0,h.jsx)("div",{}),split:"vertical",sizes:e,onChange:n,children:[(0,h.jsx)(pM,{minSize:300,children:(0,h.jsx)("div",{style:{...a,background:"#afafca"},children:(0,h.jsxs)(DM,{sashRender:e=>(0,h.jsx)("div",{}),split:"horizontal",sizes:r,onChange:i,children:[(0,h.jsx)(pM,{minSize:120,maxSize:300,children:(0,h.jsx)("div",{style:{...a,background:"#bbccbb"},children:"controls"})}),(0,h.jsx)(pM,{minSize:600,children:(0,h.jsx)("div",{style:{...a,background:"#aabbcc"},children:"track list"})})]})})}),(0,h.jsx)(pM,{minSize:600,children:(0,h.jsx)("div",{style:{...a,background:"#ddd"},children:(0,h.jsxs)(DM,{sashRender:e=>(0,h.jsx)("div",{}),split:"horizontal",sizes:r,onChange:i,children:[(0,h.jsx)(pM,{minSize:120,maxSize:300,children:(0,h.jsx)("div",{style:{...a,background:"#ccaabb"},children:"wavesurfer"})}),(0,h.jsx)(pM,{minSize:600,children:(0,h.jsx)("div",{style:{...a,background:"#ffaabb"},children:(0,h.jsxs)(DM,{sashRender:e=>(0,h.jsx)("div",{}),split:"vertical",sizes:o,onChange:s,children:[(0,h.jsx)(pM,{minSize:800,children:(0,h.jsx)("div",{style:{...a,background:"#bbccbb"},children:"canvas"})}),(0,h.jsx)(pM,{minSize:150,children:(0,h.jsx)("div",{style:{...a,background:"#ffaabb"},children:"settings/editor"})})]})})})]})})})]})})})},RL=(ML=[{index:!0,element:(0,h.jsx)(ui,{})},{path:"edit",element:(0,h.jsx)(ui,{})},{path:"mobileedit",element:(0,h.jsx)(hM,{})},{path:"mobile/edit",element:(0,h.jsx)(hM,{})},{path:"desktopedit",element:(0,h.jsx)(QM,{})},{path:"desktop/edit",element:(0,h.jsx)(QM,{})},{path:"components",element:(0,h.jsx)(BL,{})},{path:"host",element:(0,h.jsx)(dO,{})},{path:"guest",element:(0,h.jsx)(sL,{})},{path:"home",element:(0,h.jsx)(ci,{})},{path:"play",element:(0,h.jsx)(kL,{})},{path:"privacy",element:(0,h.jsx)(jL,{})},{path:"help",element:(0,h.jsx)(TL,{})}],Oe({basename:null==DL?void 0:DL.basename,future:Yt({},null==DL?void 0:DL.future,{v7_prependBasename:!0}),history:N({window:null==DL?void 0:DL.window}),hydrationData:(null==DL?void 0:DL.hydrationData)||Xt(),routes:ML,mapRouteProperties:Kt,unstable_dataStrategy:null==DL?void 0:DL.unstable_dataStrategy,unstable_patchRoutesOnNavigation:null==DL?void 0:DL.unstable_patchRoutesOnNavigation,window:null==DL?void 0:DL.window}).initialize());var ML,DL,OL=n(7676),LL={};LL.styleTagTransform=ux(),LL.setAttributes=sx(),LL.insert=ix().bind(null,"head"),LL.domAPI=nx(),LL.insertStyleElement=lx();ex()(OL.A,LL);OL.A&&OL.A.locals&&OL.A.locals;const $L=()=>{const{theme:e}=Vm();return e?(0,h.jsx)(h.Fragment,{children:(0,h.jsxs)(D,{theme:e,children:[(0,h.jsx)(b,{}),(0,h.jsx)("main",{children:(0,h.jsx)(t.Suspense,{children:(0,h.jsx)(sn,{router:RL})})})]})}):(0,h.jsx)(h.Fragment,{children:"loading..."})};var PL=n(8761),IL={};IL.styleTagTransform=ux(),IL.setAttributes=sx(),IL.insert=ix().bind(null,"head"),IL.domAPI=nx(),IL.insertStyleElement=lx();ex()(PL.A,IL);PL.A&&PL.A.locals&&PL.A.locals;var NL=n(8534),zL={};zL.styleTagTransform=ux(),zL.setAttributes=sx(),zL.insert=ix().bind(null,"head"),zL.domAPI=nx(),zL.insertStyleElement=lx();ex()(NL.A,zL);NL.A&&NL.A.locals&&NL.A.locals;var UL=n(7427),WL={};WL.styleTagTransform=ux(),WL.setAttributes=sx(),WL.insert=ix().bind(null,"head"),WL.domAPI=nx(),WL.insertStyleElement=lx();ex()(UL.A,WL);UL.A&&UL.A.locals&&UL.A.locals;var VL=n(173),HL={};HL.styleTagTransform=ux(),HL.setAttributes=sx(),HL.insert=ix().bind(null,"head"),HL.domAPI=nx(),HL.insertStyleElement=lx();ex()(VL.A,HL);VL.A&&VL.A.locals&&VL.A.locals;gR.addDefaultLocale({locale:"en",long:{year:{previous:"last year",current:"this year",next:"next year",past:{one:"{0} year ago",other:"{0} years ago"},future:{one:"in {0} year",other:"in {0} years"}},quarter:{previous:"last quarter",current:"this quarter",next:"next quarter",past:{one:"{0} quarter ago",other:"{0} quarters ago"},future:{one:"in {0} quarter",other:"in {0} quarters"}},month:{previous:"last month",current:"this month",next:"next month",past:{one:"{0} month ago",other:"{0} months ago"},future:{one:"in {0} month",other:"in {0} months"}},week:{previous:"last week",current:"this week",next:"next week",past:{one:"{0} week ago",other:"{0} weeks ago"},future:{one:"in {0} week",other:"in {0} weeks"}},day:{previous:"yesterday",current:"today",next:"tomorrow",past:{one:"{0} day ago",other:"{0} days ago"},future:{one:"in {0} day",other:"in {0} days"}},hour:{current:"this hour",past:{one:"{0} hour ago",other:"{0} hours ago"},future:{one:"in {0} hour",other:"in {0} hours"}},minute:{current:"this minute",past:{one:"{0} minute ago",other:"{0} minutes ago"},future:{one:"in {0} minute",other:"in {0} minutes"}},second:{current:"now",past:{one:"{0} second ago",other:"{0} seconds ago"},future:{one:"in {0} second",other:"in {0} seconds"}}},short:{year:{previous:"last yr.",current:"this yr.",next:"next yr.",past:"{0} yr. ago",future:"in {0} yr."},quarter:{previous:"last qtr.",current:"this qtr.",next:"next qtr.",past:{one:"{0} qtr. ago",other:"{0} qtrs. ago"},future:{one:"in {0} qtr.",other:"in {0} qtrs."}},month:{previous:"last mo.",current:"this mo.",next:"next mo.",past:"{0} mo. ago",future:"in {0} mo."},week:{previous:"last wk.",current:"this wk.",next:"next wk.",past:"{0} wk. ago",future:"in {0} wk."},day:{previous:"yesterday",current:"today",next:"tomorrow",past:{one:"{0} day ago",other:"{0} days ago"},future:{one:"in {0} day",other:"in {0} days"}},hour:{current:"this hour",past:"{0} hr. ago",future:"in {0} hr."},minute:{current:"this minute",past:"{0} min. ago",future:"in {0} min."},second:{current:"now",past:"{0} sec. ago",future:"in {0} sec."}},narrow:{year:{previous:"last yr.",current:"this yr.",next:"next yr.",past:"{0}y ago",future:"in {0}y"},quarter:{previous:"last qtr.",current:"this qtr.",next:"next qtr.",past:"{0}q ago",future:"in {0}q"},month:{previous:"last mo.",current:"this mo.",next:"next mo.",past:"{0}mo ago",future:"in {0}mo"},week:{previous:"last wk.",current:"this wk.",next:"next wk.",past:"{0}w ago",future:"in {0}w"},day:{previous:"yesterday",current:"today",next:"tomorrow",past:"{0}d ago",future:"in {0}d"},hour:{current:"this hour",past:"{0}h ago",future:"in {0}h"},minute:{current:"this minute",past:"{0}m ago",future:"in {0}m"},second:{current:"now",past:"{0}s ago",future:"in {0}s"}},now:{now:{current:"now",future:"in a moment",past:"just now"}},mini:{year:"{0}yr",month:"{0}mo",week:"{0}wk",day:"{0}d",hour:"{0}h",minute:"{0}m",second:"{0}s",now:"now"},"short-time":{year:"{0} yr.",month:"{0} mo.",week:"{0} wk.",day:{one:"{0} day",other:"{0} days"},hour:"{0} hr.",minute:"{0} min.",second:"{0} sec."},"long-time":{year:{one:"{0} year",other:"{0} years"},month:{one:"{0} month",other:"{0} months"},week:{one:"{0} week",other:"{0} weeks"},day:{one:"{0} day",other:"{0} days"},hour:{one:"{0} hour",other:"{0} hours"},minute:{one:"{0} minute",other:"{0} minutes"},second:{one:"{0} second",other:"{0} seconds"}}}),(0,Fu.initDB)(EL);const GL=document.getElementById("root");(0,e.H)(GL).render((0,h.jsx)(t.StrictMode,{children:(0,h.jsx)(Ml,{autoHideDuration:1e3,children:(0,h.jsx)($L,{})})}))})()})();
//# sourceMappingURL=main.03aafe76.js.map