(()=>{var e={};e.id=301,e.ids=[301],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1017:e=>{"use strict";e.exports=require("path")},7310:e=>{"use strict";e.exports=require("url")},7149:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>n.a,__next_app__:()=>x,originalPathname:()=>u,pages:()=>c,routeModule:()=>h,tree:()=>d}),r(2358),r(4004),r(5866);var s=r(3191),a=r(8716),l=r(7922),n=r.n(l),i=r(5231),o={};for(let e in i)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>i[e]);r.d(t,o);let d=["",{children:["about",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,2358)),"C:\\Users\\Malki\\OneDrive\\שולחן העבודה\\פרויקטים\\פרויקט מאגר דירות\\Apartments\\app\\about\\page.tsx"]}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,7481))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,4004)),"C:\\Users\\Malki\\OneDrive\\שולחן העבודה\\פרויקטים\\פרויקט מאגר דירות\\Apartments\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,5866,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,7481))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],c=["C:\\Users\\Malki\\OneDrive\\שולחן העבודה\\פרויקטים\\פרויקט מאגר דירות\\Apartments\\app\\about\\page.tsx"],u="/about/page",x={require:r,loadChunk:()=>Promise.resolve()},h=new s.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/about/page",pathname:"/about",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},7565:(e,t,r)=>{Promise.resolve().then(r.bind(r,6361)),Promise.resolve().then(r.bind(r,9717))},4149:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,2994,23)),Promise.resolve().then(r.t.bind(r,6114,23)),Promise.resolve().then(r.t.bind(r,9727,23)),Promise.resolve().then(r.t.bind(r,9671,23)),Promise.resolve().then(r.t.bind(r,1868,23)),Promise.resolve().then(r.t.bind(r,4759,23))},5303:()=>{},6361:(e,t,r)=>{"use strict";r.d(t,{default:()=>o});var s=r(326),a=r(434),l=r(6226),n=r(5047),i=r(7577);let o=()=>{let e=(0,n.usePathname)(),[t,r]=(0,i.useState)(null),[o,d]=(0,i.useState)(!1);return(0,i.useEffect)(()=>{r(localStorage.getItem("userRole"))},[]),s.jsx("nav",{className:"bg-luxury-gold text-white p-4",children:(0,s.jsxs)("div",{className:"container mx-auto flex justify-between items-center",children:[s.jsx(a.default,{href:"/",className:`text-xl font-bold ${"/"===e?"font-bold":""}`,children:s.jsx(l.default,{src:"/logo.png",alt:"Logo",width:120,height:50,priority:!0})}),s.jsx("button",{className:"block lg:hidden text-2xl",onClick:()=>d(!o),children:o?"✖":"☰"}),(0,s.jsxs)("div",{className:`flex flex-col lg:flex-row lg:items-center ${o?"block":"hidden"} lg:flex lg:space-x-6`,children:[s.jsx(a.default,{href:"/",className:`hover:text-zinc-950 ${"/"===e?"font-bold":""}`,children:"דף הבית"}),s.jsx(a.default,{href:"/login",className:`hover:text-zinc-950 ${"/login"===e?"font-bold":""}`,children:"התחברות"}),s.jsx(a.default,{href:"/about",className:`hover:text-zinc-950 ${"/about"===e?"font-bold":""}`,children:"אודות"}),s.jsx(a.default,{href:"/postProperty",className:`
              bg-black text-luxury-gold 
              border-2 border-white rounded-lg px-6 py-3 
              font-bold shadow-lg transition duration-300
              ${"/postProperty"===e?"bg-white text-black":"hover:bg-gray-800 hover:text-yellow-400"}
            `,children:"פרסום דירה"}),"admin"===t&&(0,s.jsxs)(s.Fragment,{children:[s.jsx(a.default,{href:"/admin/dashboard",className:`hover:text-zinc-950 ${"/admin/dashboard"===e?"font-bold":""}`,children:"לוח בקרה למנהל"}),s.jsx(a.default,{href:"/admin/users",className:`hover:text-zinc-950 ${"/admin/users"===e?"font-bold":""}`,children:"ניהול משתמשים"})]})]})]})})}},9717:(e,t,r)=>{"use strict";r.d(t,{default:()=>u});var s=r(326),a=r(7577),l=r(9875),n=r(925),i=r(5870),o=r(9156),d=r(9427);let c=e=>{let t=(0,a.useRef)(null),[r]=(0,a.useState)(()=>d.Qm(new Float32Array(5001),{radius:.9}));return(0,l.F)((e,r)=>{t.current&&(t.current.rotation.x-=r/10,t.current.rotation.y-=r/15)}),s.jsx("group",{rotation:[0,0,Math.PI/4],children:s.jsx(i.wo,{ref:t,positions:r,stride:3,frustumCulled:!0,...e,children:s.jsx(o.C,{transparent:!0,color:"#fff",size:.002,sizeAttenuation:!0,depthWrite:!1})})})},u=function(){return s.jsx("div",{className:"w-full h-auto fixed inset-0 z-[0] bg-gradient-to-b from-black via-gray-900 to-luxury-gold",children:s.jsx(n.Xz,{camera:{position:[0,0,1]},children:s.jsx(a.Suspense,{fallback:null,children:s.jsx(c,{})})})})}},2358:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});var s=r(9510);r(1159);let a=()=>(0,s.jsxs)("div",{className:"bg-black text-gold p-6 max-w-3xl mx-auto rounded-lg shadow-lg",children:[s.jsx("h2",{className:"text-2xl font-bold text-center mb-4",children:"לקוח יקר,"}),s.jsx("p",{className:"mb-4",children:'באתר שלנו תמצא את כל הדירות הזמינות בשוק, והייחודיות שלנו היא החיבור הישיר עם בעלי הדירות עצמם, ללא תיווך מיותר. לעיתים קרובות, מתווכים מעלים את מחירי הדירות וגובים עמלות של עד 2%, תוך כדי עיכוב והסתרת פרטים. באתר שלנו, אתה מקבל גישה ישירה לבעל הדירה, בלי "טלפון שבור", ומחויב רק ל-10,000 ש"ח עבור דמי תיווך – סכום אחיד וברור.'}),s.jsx("p",{className:"mb-4",children:"תהליך הרכישה כאן מהיר ויעיל יותר: אתה פונה ישירות לבעלי הדירות, מה שמאפשר משא ומתן קל יותר. שלח פניות לדירות המתאימות לך, ובעלי הדירות יחזרו אליך אם ההצעה רלוונטית."}),s.jsx("p",{className:"mb-4",children:'שים לב: דמי התיווך עבור כל עסקה באתר הם 10,000 ש"ח, במידה ורכשת את הדירה דרך האתר. אם לא תשולם העמלה, תחויב בתשלום של 2% ותידרש להסדיר זאת דרך בית המשפט.'}),s.jsx("h2",{className:"text-2xl font-bold text-center mb-4",children:"בעלי דירות יקרים,"}),s.jsx("p",{className:"mb-4",children:'אם ברצונכם למכור את הדירה בלי להיות מוטרדים ממתווכים, האתר שלנו הוא הפתרון המושלם. מספר הטלפון שלכם נשאר חסוי, ורק רוכשים פוטנציאליים ייצרו איתכם קשר דרך האתר. במידה ותתבצע עסקה דרך הפניות שקיבלתם מאיתנו, תחויבו לשלם 10,000 ש"ח דמי תיווך בלבד. אם לא תשולם העמלה, תדרשו לשלם עמלה בגובה 1% מהעסקה ותידרשו לדון בכך בבית המשפט.'}),s.jsx("p",{children:"החוזה באתר אינו מהווה התחייבות בלעדיות למכירת הדירה, אלא רק במידה והעסקה התבצעה דרכנו."})]})},4004:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>o});var s=r(9510),a=r(8570);let l=(0,a.createProxy)(String.raw`C:\Users\Malki\OneDrive\שולחן העבודה\פרויקטים\פרויקט מאגר דירות\Apartments\components\Navbar.tsx#default`);r(1159);let n=({className:e})=>s.jsx("footer",{className:`bg-luxury-gold text-white py-4 mt-auto ${e}`,children:(0,s.jsxs)("div",{className:"container mx-auto text-center",children:[(0,s.jsxs)("p",{children:["\xa9 ",new Date().getFullYear()," Malki Anshin Digital"]}),s.jsx("div",{className:"space-x-4",children:s.jsx("a",{href:"https://twitter.com",target:"_blank",rel:"noopener noreferrer",className:"hover:text-zinc-950",children:"❤️ בניית אתרים במגע אישי ומקצועי"})})]})});r(7272);let i=(0,a.createProxy)(String.raw`C:\Users\Malki\OneDrive\שולחן העבודה\פרויקטים\פרויקט מאגר דירות\Apartments\components\StarsBackground.tsx#default`),o=({children:e})=>s.jsx("html",{lang:"en",children:(0,s.jsxs)("body",{className:"flex flex-col min-h-screen relative",children:[s.jsx("div",{className:"absolute inset-0 z-[-1] pointer-events-none",children:s.jsx(i,{})}),s.jsx(l,{}),s.jsx("main",{className:"flex-grow relative z-10",children:e}),s.jsx(n,{className:"relative z-10"})]})})},7481:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});var s=r(6621);let a=e=>[{type:"image/x-icon",sizes:"16x16",url:(0,s.fillMetadataSegment)(".",e.params,"favicon.ico")+""}]},7272:()=>{}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[948,562,621],()=>r(7149));module.exports=s})();