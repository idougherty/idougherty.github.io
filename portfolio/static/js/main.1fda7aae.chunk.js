(this.webpackJsonpportfolio=this.webpackJsonpportfolio||[]).push([[0],[,,,,,,,,,,,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){"use strict";a.r(t);var r=a(6),n=a(2),i=a(3),s=a(5),o=a(4),c=a(1),d=a(8),l=a.n(d),h=a(0),m=function(e){Object(s.a)(a,e);var t=Object(o.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(i.a)(a,[{key:"render",value:function(){return Object(h.jsx)("div",{className:"splash-container",children:Object(h.jsxs)("div",{className:"splash-text-container",children:[Object(h.jsxs)("h1",{children:["Ian's ",Object(h.jsx)("br",{}),"Portfolio"]}),Object(h.jsx)("h2",{children:"here's a few thing's i've made"})]})})}}]),a}(c.Component),u=function(e){Object(s.a)(a,e);var t=Object(o.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(i.a)(a,[{key:"render",value:function(){var e="javascript:void(0);"===this.props.project.link?"":"_blank",t=this.props.project.size+" card";return Object(h.jsx)("div",{className:t,style:{backgroundImage:"url(".concat(this.props.project.img,")")},children:Object(h.jsx)("a",{href:this.props.project.link,target:e,children:Object(h.jsx)("div",{children:Object(h.jsx)("div",{className:"card-transparency",children:Object(h.jsx)("h2",{className:"card-header text-header scale-text-body",children:this.props.project.header})})})})})}}]),a}(c.Component),p=(a(14),a(15),a(16),a(17),[{size:"lg",featured:!0,year:2021,img:"assets/physics.png",header:"Physics Engine",link:"https://idougherty.github.io/physx",text:"<i>A 2D rigidbody physics simulator.</i></br></br>\n                This was built using a variety of techniques I found on various \n                physics engine forums. Sweep and prune for the broadphase, GJK and EPA for the \n                narrow phase, and an iterative impulse resolution system."},{size:"sm",featured:!0,year:2020,img:"assets/cave3d.png",header:"3D Cave",link:"https://idougherty.github.io/3d/cave",text:"<i>An explorable cave built with tools from other projects.</i></br></br>\n                This mesh is generated from the cave generator, and rendered \n                with the self built 3d engine. Eventually, I would like to make \n                this into a procedural doom style game, but for now it can just be \n                explored from room to room."},{size:"sm",featured:!0,year:2020,img:"assets/3dteapot.png",header:"3D Engine",link:"https://idougherty.github.io/3d/",text:"<i>A browser based 3d engine written in javascript.</i></br></br>\n                The model in the picture is my high polygon render of the Utah Teapot.\n                In the actual demo the resolution is lessened to run in real time.\n                Hold down the mouse to look around and use WASD to move."},{size:"sm",featured:!0,year:2018,img:"assets/sqyrm.png",header:"Sqyrm",link:"https://idougherty.github.io/sqyrm/",text:"<i>A small collection of javascript/canvas animations.</i></br></br>\n                These were made as some experiments to test a pseudo 3D effect I made.\n                I also added a burning transition between the animations with perlin noise\n                and interpolation between pixels."},{size:"sm",featured:!1,year:2021,img:"assets/attractor.png",header:"Portfolio",link:"https://idougherty.github.io/strange%20attractors",text:"<i></i></br></br>\n                "},{size:"sm",featured:!1,year:2021,img:"assets/cavegen.png",header:"Cave Generator",link:"https://idougherty.github.io/cavegen",text:"<i>A procedural cellular automota cave generator.</i></br></br>\n                It uses binary space partitioning to create rooms, iterative\n                cellular automata to add features, and minimum \n                spanning trees to create paths."},{size:"md",featured:!1,year:2020,img:"assets/bjorn.png",header:"Bjorn",link:"https://idougherty.github.io/bjorn",text:"<i>A spore type game set in a forest, grow large enough to defeat the bear.</i></br></br>\n                Point and click to move, eat animals to grow, but watch out for larger animals \n                that can still damage you. This was made from scratch in a week for a small game jam\n                with friends."},{size:"md",featured:!1,year:2016,img:"assets/basketball.png",header:"NBA 3K",link:"javascript:void(0);",text:"<i>A simple Node.js basketball game where you can shoot, steal, and dunk.</i></br></br>\n                Use WASD to move and hold shift to charge a shot, the ball will shoot on release.\n                This project is not available to play anywhere, but will be seeing updates and\n                permanent hosting soon!"},{size:"sm",featured:!1,year:2021,img:"assets/trackgen.png",header:"Track Generator",link:"https://idougherty.github.io/f1-minigames/trackgen",text:"<i>A procedural racing track generator using perlin noise.</i></br></br>\n                A procedural track generator for an f1 racing simulator. It is formed from\n                random points on a circle distorted with perlin noise, smoothed out with \n                separation forces, and fitting curves between them."},{size:"sm",featured:!1,year:2020,img:"assets/f1games.png",header:"F1 Minigames",link:"https://idougherty.github.io/f1-minigames/",text:"<i>A mix of minigames from the f1 racing project.</i></br></br>\n                These minigames are a part of a weekly event that plays similar to Mario Party.\n                There is a special race where the speed of your car is dependent on your minigame\n                performance."},{size:"sm",featured:!1,year:2021,img:"assets/checkers.png",header:"Checkers Bot",link:"https://idougherty.github.io/checkers.py",text:"<i>A minimax checkers bot written in python.</i></br></br>\n                It uses a minimax algorithm to find the optimal move to a certain depth. \n                The program was written in python so the link will download the file."}]),b=function(e){Object(s.a)(a,e);var t=Object(o.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(i.a)(a,[{key:"componentDidMount",value:function(){var e=document.createElement("script");e.async=!0,e.src="Vec3D.js",document.body.appendChild(e);var t=document.createElement("script");t.async=!0,t.src="anim.js",document.body.appendChild(t)}},{key:"render",value:function(){return Object(h.jsx)("div",{children:Object(h.jsxs)("div",{className:"content-container",children:[Object(h.jsx)("canvas",{id:"bg-anim"}),Object(h.jsx)(m,{}),Object(h.jsxs)("h2",{className:"section-header",children:["Projects:",Object(h.jsx)("div",{className:"header-underline"})]}),Object(h.jsx)("div",{className:"card-deck",id:"gallery",children:p.map((function(e){return Object(h.jsx)(u,{project:e},e.header)}))}),Object(h.jsxs)("div",{className:"footer-wrapper",children:[Object(h.jsxs)("h2",{className:"section-header",children:["Contact Me:",Object(h.jsx)("div",{className:"header-underline"})]}),Object(h.jsxs)("p",{className:"footer-content text-body scale-text-body",children:["Email: \u2003\u2003ianedougherty01@gmail.com",Object(h.jsx)("br",{}),"Resume: \u2002\xa0",Object(h.jsx)("a",{className:"resume-link",href:"https://idougherty.github.io/portfolio/ian's_resume.pdf",target:"_blank",children:"Click to download"}),Object(h.jsx)("br",{})]})]})]})})}}]),a}(c.Component);l.a.render(Object(h.jsx)(b,{}),document.getElementById("root"));var g,j={"sm card":2,"md card":3,"lg card":4},f=document.getElementById("gallery"),y=1,v=1,x=[],k=0,w=0,O=0,N=Object(r.a)(f.children);try{for(N.s();!(g=N.n()).done;){var A=g.value;x.push(A);var C=j[A.className];if(O+=C*C,w+=C,k=Math.max(C,k),w>=6&&6*k==O){var z,E=y,I=v,T=Object(r.a)(x);try{for(T.s();!(z=T.n()).done;){var D=z.value,P=j[D.className];D.style.gridColumnStart=E,D.style.gridRowStart=I,D.style.gridColumnEnd=E+P,D.style.gridRowEnd=I+P,(I+=P)+P>v+k&&(E+=P,I=v)}}catch(R){T.e(R)}finally{T.f()}y=1,v+=k,x=[],w=0,k=0,O=0}}}catch(R){N.e(R)}finally{N.f()}var B,S=document.getElementsByClassName("card-transparency"),M=0,q=Object(r.a)(S);try{for(q.s();!(B=q.n()).done;){var G=B.value,J=M+360/S.length;G.style.background="linear-gradient(hsla(".concat(M,", 40%, 50%, .3), hsla(").concat(J,", 40%, 50%, .7))"),M=J}}catch(R){q.e(R)}finally{q.f()}}],[[18,1,2]]]);
//# sourceMappingURL=main.1fda7aae.chunk.js.map