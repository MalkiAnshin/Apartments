(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[505],{9262:function(e,t,s){Promise.resolve().then(s.bind(s,5773))},5773:function(e,t,s){"use strict";s.r(t);var l=s(7437),a=s(2265),n=s(6463);t.default=()=>{let[e,t]=(0,a.useState)(!0),[s,c]=(0,a.useState)(null),[u,r]=(0,a.useState)(null),i=(0,n.useRouter)();return((0,a.useEffect)(()=>{(async()=>{try{let e=await fetch("/api/check-auth");if(!(await e.json()).isAuthenticated){i.push("/login");return}r(!0);let t=await fetch("/api/check-listings"),s=await t.json();c(s.canPost)}catch(e){console.error("שגיאה בבדיקת סטטוס המשתמש:",e)}finally{t(!1)}})()},[i]),e)?(0,l.jsx)("p",{children:"טוען..."}):u?s?(0,l.jsxs)("div",{className:"bg-black text-gold p-6 max-w-xl mx-auto",children:[(0,l.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"פרסם דירה"}),(0,l.jsxs)("form",{method:"POST",action:"/api/postProperty",children:[(0,l.jsxs)("div",{className:"mb-4",children:[(0,l.jsx)("label",{className:"block text-lg",children:"שם הדירה"}),(0,l.jsx)("input",{type:"text",name:"name",className:"w-full p-2 rounded-lg bg-gray-800 text-gold",required:!0})]}),(0,l.jsxs)("div",{className:"mb-4",children:[(0,l.jsx)("label",{className:"block text-lg",children:"עיר"}),(0,l.jsx)("input",{type:"text",name:"city",className:"w-full p-2 rounded-lg bg-gray-800 text-gold",required:!0})]}),(0,l.jsx)("button",{type:"submit",className:"bg-gold text-black px-4 py-2 rounded-lg",children:"שלח"})]})]}):(0,l.jsxs)("div",{className:"bg-black text-gold p-6 max-w-xl mx-auto",children:[(0,l.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"לא ניתן לפרסם דירה נוספת"}),(0,l.jsx)("p",{children:"כבר פרסמת דירה אחת בחינם. ליצירת קשר עם המנהל לאישור פרסום נוסף, אנא פנה אלינו באמצעות פרטי יצירת הקשר באתר."})]}):null}},6463:function(e,t,s){"use strict";var l=s(1169);s.o(l,"usePathname")&&s.d(t,{usePathname:function(){return l.usePathname}}),s.o(l,"useRouter")&&s.d(t,{useRouter:function(){return l.useRouter}})}},function(e){e.O(0,[971,23,744],function(){return e(e.s=9262)}),_N_E=e.O()}]);