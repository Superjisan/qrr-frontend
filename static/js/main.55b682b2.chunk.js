(this["webpackJsonpfullstack-apollo-react-boilerplate-project"]=this["webpackJsonpfullstack-apollo-react-boilerplate-project"]||[]).push([[0],{126:function(e,t,a){"use strict";a.r(t);var n=a(30),r=a(0),l=a.n(r),o=a(13),s=a.n(o),c=a(17),i=a(61),m=a(9),u=a(84),p=a(79),h=a(180),d=a(83),g=a(178),E=a(184),f=a(177),b=a(170),v=a(174),w=a(171),y=a(172),S=a(173),k=a(181);var x=a(80),C=a.n(x)()({basename:"/qrr-frontend"});const j=e=>{localStorage.removeItem("token"),e.resetStore(),C.push("/signin")};var O=()=>l.a.createElement(c.ApolloConsumer,null,e=>l.a.createElement(k.a,{color:"inherit",type:"button",onClick:()=>j(e)},"Sign Out"));const $=Object(b.a)(e=>({root:{flexGrow:1},menuButton:{marginRight:e.spacing(2)},title:{flexGrow:1}})),I=({session:e})=>{const t=$();return l.a.createElement("div",{className:t},l.a.createElement(w.a,null,l.a.createElement(y.a,null,l.a.createElement(S.a,{variant:"h6",className:t.title},"QR^2"),l.a.createElement(O,null))),l.a.createElement(y.a,null))},q=()=>{const e=$();return l.a.createElement("div",{className:e},l.a.createElement(w.a,null,l.a.createElement(y.a,null,l.a.createElement(S.a,{variant:"h6",className:e.title},"QR^2"),l.a.createElement(S.a,null,l.a.createElement(v.a,{to:"/signin"},l.a.createElement(k.a,{color:"primary"},"Sign In"))))),l.a.createElement(y.a,null))};var N=({session:e})=>l.a.createElement("div",null,e&&e.me?l.a.createElement(I,{session:e}):l.a.createElement(q,null)),U=a(22),A=a(23),T=a.n(A);function P(){const e=Object(U.a)(["\n  {\n    me {\n      id\n      username\n      email\n      role\n    }\n  }\n"]);return P=function(){return e},e}const Q=T()(P());var D=e=>t=>l.a.createElement(c.Query,{query:Q},({data:a,refetch:n})=>l.a.createElement(e,Object.assign({},t,{session:a,refetch:n})));function M(){const e=Object(U.a)(["\n  query {\n    recipes {\n        id\n        name\n        author{\n          username\n        }\n        ingredients {\n          qty\n          item {\n            name\n          }\n        }\n        instructions {\n          text\n          ingredients {\n            item {\n              name\n            }\n          }\n        }\n      }\n  }\n"]);return M=function(){return e},e}const R=T()(M()),F=e=>l.a.createElement(c.Query,{query:R},e=>{const t=e.data;return console.log({data:t,props:e}),l.a.createElement("div",null,"Recipes",t.recipes&&t.recipes.map(e=>l.a.createElement("li",{key:e.id},e.name)))});var G=D(({session:e})=>l.a.createElement("div",null,l.a.createElement("h2",null,"Landing Page"),l.a.createElement(F,null))),L=a(38),B=a.n(L),J=a(51),H=a(183);var W=({error:e})=>l.a.createElement("div",null,l.a.createElement("small",null,e.message));function z(){const e=Object(U.a)(["\n  mutation($username: String!, $email: String!, $password: String!) {\n    signUp(username: $username, email: $email, password: $password) {\n      token\n    }\n  }\n"]);return z=function(){return e},e}const K=T()(z()),V={username:"",email:"",password:"",passwordConfirmation:""};class X extends r.Component{constructor(...e){var t;super(...e),t=this,this.state=Object(n.a)({},V),this.onChange=e=>{const t=e.target,a=t.name,n=t.value;this.setState({[a]:n})},this.onSubmit=(e,a)=>{a().then(function(){var e=Object(J.a)(B.a.mark((function e({data:a}){return B.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.setState(Object(n.a)({},V)),localStorage.setItem("token",a.signUp.token),e.next=4,t.props.refetch();case 4:t.props.history.push("/");case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),e.preventDefault()}}render(){const e=this.state,t=e.username,a=e.email,n=e.password,r=e.passwordConfirmation,o=n!==r||""===n||""===a||""===t;return l.a.createElement(c.Mutation,{mutation:K,variables:{username:t,email:a,password:n}},(e,{data:s,loading:c,error:i})=>l.a.createElement("form",{onSubmit:t=>this.onSubmit(t,e)},l.a.createElement("input",{name:"username",value:t,onChange:this.onChange,type:"text",placeholder:"Full Name"}),l.a.createElement("input",{name:"email",value:a,onChange:this.onChange,type:"text",placeholder:"Email Address"}),l.a.createElement("input",{name:"password",value:n,onChange:this.onChange,type:"password",placeholder:"Password"}),l.a.createElement("input",{name:"passwordConfirmation",value:r,onChange:this.onChange,type:"password",placeholder:"Confirm Password"}),l.a.createElement("button",{disabled:o||c,type:"submit"},"Sign Up"),i&&l.a.createElement(W,{error:i})))}}const Y=()=>l.a.createElement("p",null,"Don't have an account? ",l.a.createElement(v.a,{to:"/signup"},"Sign Up"));var Z=Object(H.a)(({history:e,refetch:t})=>l.a.createElement("div",null,l.a.createElement("h1",null,"SignUp"),l.a.createElement(X,{history:e,refetch:t}))),_=a(175),ee=a(176),te=a(5),ae=a(179);function ne(){const e=Object(U.a)(["\n  mutation($login: String!, $password: String!) {\n    signIn(login: $login, password: $password) {\n      token\n    }\n  }\n"]);return ne=function(){return e},e}const re=T()(ne()),le={login:"",password:""};class oe extends r.Component{constructor(...e){var t;super(...e),t=this,this.state=Object(n.a)({},le),this.onChange=e=>{const t=e.target,a=t.name,n=t.value;this.setState({[a]:n})},this.onSubmit=(e,a)=>{a().then(function(){var e=Object(J.a)(B.a.mark((function e({data:a}){return B.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.setState(Object(n.a)({},le)),localStorage.setItem("token",a.signIn.token),e.next=4,t.props.refetch();case 4:t.props.history.push("/");case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),e.preventDefault()}}render(){const e=this.state,t=e.login,a=e.password,n=this.props.classes,r=""===a||""===t;return l.a.createElement(c.Mutation,{mutation:re,variables:{login:t,password:a}},(e,{data:o,loading:s,error:c})=>l.a.createElement("form",{className:n.root,onSubmit:t=>this.onSubmit(t,e)},l.a.createElement("div",null,l.a.createElement(ae.a,{required:!0,id:"login-filled-required",label:"Email Or Username",variant:"outlined",value:t,onChange:this.onChange,placeholder:"Email or Username",name:"login"}),l.a.createElement(ae.a,{variant:"outlined",required:!0,id:"pw-filled-required",name:"password",value:a,onChange:this.onChange,type:"password",placeholder:"Password"})),l.a.createElement(k.a,{disabled:r||s,type:"submit"},"Sign In"),c&&l.a.createElement(W,{error:c})))}}var se=Object(te.a)(e=>({root:{"& .MuiTextField-root":{margin:e.spacing(1),width:"100%"}}}),{withTheme:!0})(oe);function ce(){const e=Object(U.a)(["\n  mutation($login: String!, $password: String!) {\n    signIn(login: $login, password: $password) {\n      token\n    }\n  }\n"]);return ce=function(){return e},e}T()(ce());var ie=Object(H.a)(({history:e,refetch:t})=>l.a.createElement(l.a.Fragment,null,l.a.createElement(_.a,null),l.a.createElement(ee.a,{maxWidth:"sm"},l.a.createElement("h1",null,"SignIn"),l.a.createElement(se,{history:e,refetch:t}),l.a.createElement(Y,null)))),me=a(182);var ue=e=>t=>a=>l.a.createElement(c.Query,{query:Q},({data:n,networkStatus:r})=>r<7?null:e(n)?l.a.createElement(t,a):l.a.createElement(me.a,{to:"/signin"}));var pe=ue(e=>e&&e.me)(()=>l.a.createElement("div",null,l.a.createElement("h1",null,"Account Page")));var he=ue(e=>e&&e.me&&"ADMIN"===e.me.role)(()=>l.a.createElement("div",null,l.a.createElement("h1",null,"Admin Page")));var de=D(({session:e,refetch:t})=>l.a.createElement(E.a,{history:C,basename:"/qrr-frontend"},l.a.createElement("div",null,l.a.createElement(N,{session:e}),l.a.createElement(f.a,{exact:!0,path:"/",component:()=>l.a.createElement(G,null)}),l.a.createElement(f.a,{exact:!0,path:"/signup",component:()=>l.a.createElement(Z,{refetch:t})}),l.a.createElement(f.a,{exact:!0,path:"/signin",component:()=>l.a.createElement(ie,{refetch:t})}),l.a.createElement(f.a,{exact:!0,path:"/account",component:()=>l.a.createElement(pe,null)}),l.a.createElement(f.a,{exact:!0,path:"/admin",component:()=>l.a.createElement(he,null)}))));const ge=new u.a({uri:"http://localhost:8000/graphql"}),Ee=new m.a((e,t)=>(e.setContext(({headers:e={}})=>{const t=localStorage.getItem("token");return t&&(e=Object(n.a)({},e,{"x-token":t})),{headers:e}}),t(e))),fe=Object(p.a)(({graphQLErrors:e,networkError:t})=>{e&&e.forEach(({message:e,locations:t,path:a})=>{console.log("GraphQL error",e),"UNAUTHENTICATED"===e&&j(we)}),t&&(console.log("Network error",t),401===t.statusCode&&j(we))}),be=m.a.from([Ee,fe,ge]),ve=new h.a,we=new i.a({link:be,cache:ve}),ye=Object(d.a)({palette:{common:{black:"#000",white:"#fff"},background:{paper:"#fff",default:"#fafafa"},primary:{light:"rgba(116, 195, 30, 1)",main:"rgba(87, 161, 3, 1)",dark:"rgba(65, 117, 5, 1)",contrastText:"#fff"},secondary:{light:"rgba(74, 144, 226, 1)",main:"rgba(9, 96, 198, 1)",dark:"rgba(5, 61, 128, 1)",contrastText:"#fff"},error:{light:"#e57373",main:"#f44336",dark:"#d32f2f",contrastText:"#fff"},text:{primary:"rgba(0, 0, 0, 0.87)",secondary:"rgba(0, 0, 0, 0.54)",disabled:"rgba(0, 0, 0, 0.38)",hint:"rgba(0, 0, 0, 0.38)"}}});s.a.render(l.a.createElement(c.ApolloProvider,{client:we},l.a.createElement(g.a,{theme:ye},l.a.createElement(de,null))),document.getElementById("root"))},92:function(e,t,a){e.exports=a(126)}},[[92,1,2]]]);
//# sourceMappingURL=main.55b682b2.chunk.js.map