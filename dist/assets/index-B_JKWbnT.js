(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=e(n);fetch(n.href,r)}})();/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ia="187",_h=0,xo=1,xh=2,Vs=1,Ml=2,Qn=3,Zi=0,We=1,Se=2,on=0,ln=1,oe=2,vo=3,Mo=4,vh=5,Pn=100,Mh=101,Sh=102,yh=103,bh=104,Eh=200,wh=201,Th=202,Ah=203,Sl=204,yl=205,Rh=206,Ch=207,Ph=208,Lh=209,Dh=210,Ih=211,Nh=212,Uh=213,Fh=214,Wr=0,Xr=1,qr=2,es=3,Yr=4,Kr=5,Zr=6,$r=7,bl=0,Oh=1,Bh=2,Di=0,Na=1,Ua=2,Fa=3,or=4,Oa=5,Ba=6,za=7,El=300,In=301,is=302,Ws=303,pr=304,ns=1e3,Pi=1001,Jr=1002,Ue=1003,zh=1004,ps=1005,Ye=1006,mr=1007,Wi=1008,je=1009,wl=1010,Tl=1011,ss=1012,ka=1013,yi=1014,Mi=1015,Ze=1016,Ga=1017,Ha=1018,Nn=1020,Al=35902,Rl=35899,Cl=1021,Pl=1022,Si=1023,$i=1026,Xi=1027,Ll=1028,Va=1029,hn=1030,Wa=1031,Xa=1033,Xs=33776,qs=33777,Ys=33778,Ks=33779,Qr=35840,jr=35841,ta=35842,ea=35843,ia=36196,na=37492,sa=37496,ra=37488,aa=37489,Qs=37490,oa=37491,la=37808,ha=37809,ca=37810,ua=37811,da=37812,fa=37813,pa=37814,ma=37815,ga=37816,_a=37817,xa=37818,va=37819,Ma=37820,Sa=37821,ya=36492,ba=36494,Ea=36495,wa=36283,Ta=36284,js=36285,Aa=36286,kh=3200,Ra=0,Gh=1,Vi="",Me="srgb",tr="srgb-linear",er="linear",ee="srgb",gr=7680,Hh=519,Vh=512,Wh=513,Xh=514,Dl=515,qh=516,Yh=517,Il=518,Nl=519,Ul=35044,So="300 es",fi=2e3,rs=2001;function Kh(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function ir(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Zh(){const s=ir("canvas");return s.style.display="block",s}const yo={};function nr(...s){const t="THREE."+s.shift();console.log(t,...s)}function Fl(s){const t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function It(...s){s=Fl(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function jt(...s){s=Fl(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function Zs(...s){const t=s.join(" ");t in yo||(yo[t]=!0,It(...s))}function $h(s,t,e){return new Promise(function(i,n){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:n();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}const Jh={[Wr]:Wr,[qr]:Zr,[Yr]:Yr,[es]:Kr,[Xr]:Xr,[Zr]:qr,[$r]:$r,[Kr]:es};class cn{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const n=i[t];if(n!==void 0){const r=n.indexOf(e);r!==-1&&n.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const n=i.slice(0);for(let r=0,a=n.length;r<a;r++)n[r].call(this,t);t.target=null}}}const Be=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],_r=Math.PI/180,Ca=180/Math.PI;function un(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Be[s&255]+Be[s>>8&255]+Be[s>>16&255]+Be[s>>24&255]+"-"+Be[t&255]+Be[t>>8&255]+"-"+Be[t>>16&15|64]+Be[t>>24&255]+"-"+Be[e&63|128]+Be[e>>8&255]+"-"+Be[e>>16&255]+Be[e>>24&255]+Be[i&255]+Be[i>>8&255]+Be[i>>16&255]+Be[i>>24&255]).toLowerCase()}function Zt(s,t,e){return Math.max(t,Math.min(e,s))}function Qh(s,t){return(s%t+t)%t}function xr(s,t,e){return(1-e)*s+e*t}function jh(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function lr(s){switch(s.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Ol(s,t){if(t.constructor===Float32Array)return s;const e=lr(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(s/e,-1)}function Bl(s,t){if(t.constructor===Float32Array)return s;const e=lr(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(s*e)}const io=class io{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,n=t.elements;return this.x=n[0]*e+n[3]*i+n[6],this.y=n[1]*e+n[4]*i+n[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Zt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Zt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),n=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*n+t.x,this.y=r*n+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};io.prototype.isVector2=!0;let Tt=io;class Bn{constructor(t=0,e=0,i=0,n=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=n}static slerpFlat(t,e,i,n,r,a,o){let l=i[n+0],h=i[n+1],c=i[n+2],u=i[n+3],d=r[a+0],p=r[a+1],_=r[a+2],S=r[a+3];if(u!==S||l!==d||h!==p||c!==_){let m=l*d+h*p+c*_+u*S;m<0&&(d=-d,p=-p,_=-_,S=-S,m=-m);let f=1-o;if(m<.9995){const v=Math.acos(m),T=Math.sin(v);f=Math.sin(f*v)/T,o=Math.sin(o*v)/T,l=l*f+d*o,h=h*f+p*o,c=c*f+_*o,u=u*f+S*o}else{l=l*f+d*o,h=h*f+p*o,c=c*f+_*o,u=u*f+S*o;const v=1/Math.sqrt(l*l+h*h+c*c+u*u);l*=v,h*=v,c*=v,u*=v}}t[e]=l,t[e+1]=h,t[e+2]=c,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,n,r,a){const o=i[n],l=i[n+1],h=i[n+2],c=i[n+3],u=r[a],d=r[a+1],p=r[a+2],_=r[a+3];return t[e]=o*_+c*u+l*p-h*d,t[e+1]=l*_+c*d+h*u-o*p,t[e+2]=h*_+c*p+o*d-l*u,t[e+3]=c*_-o*u-l*d-h*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,n){return this._x=t,this._y=e,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,n=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,h=o(i/2),c=o(n/2),u=o(r/2),d=l(i/2),p=l(n/2),_=l(r/2);switch(a){case"XYZ":this._x=d*c*u+h*p*_,this._y=h*p*u-d*c*_,this._z=h*c*_+d*p*u,this._w=h*c*u-d*p*_;break;case"YXZ":this._x=d*c*u+h*p*_,this._y=h*p*u-d*c*_,this._z=h*c*_-d*p*u,this._w=h*c*u+d*p*_;break;case"ZXY":this._x=d*c*u-h*p*_,this._y=h*p*u+d*c*_,this._z=h*c*_+d*p*u,this._w=h*c*u-d*p*_;break;case"ZYX":this._x=d*c*u-h*p*_,this._y=h*p*u+d*c*_,this._z=h*c*_-d*p*u,this._w=h*c*u+d*p*_;break;case"YZX":this._x=d*c*u+h*p*_,this._y=h*p*u+d*c*_,this._z=h*c*_-d*p*u,this._w=h*c*u-d*p*_;break;case"XZY":this._x=d*c*u-h*p*_,this._y=h*p*u-d*c*_,this._z=h*c*_+d*p*u,this._w=h*c*u+d*p*_;break;default:It("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,n=Math.sin(i);return this._x=t.x*n,this._y=t.y*n,this._z=t.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],n=e[4],r=e[8],a=e[1],o=e[5],l=e[9],h=e[2],c=e[6],u=e[10],d=i+o+u;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(c-l)*p,this._y=(r-h)*p,this._z=(a-n)*p}else if(i>o&&i>u){const p=2*Math.sqrt(1+i-o-u);this._w=(c-l)/p,this._x=.25*p,this._y=(n+a)/p,this._z=(r+h)/p}else if(o>u){const p=2*Math.sqrt(1+o-i-u);this._w=(r-h)/p,this._x=(n+a)/p,this._y=.25*p,this._z=(l+c)/p}else{const p=2*Math.sqrt(1+u-i-o);this._w=(a-n)/p,this._x=(r+h)/p,this._y=(l+c)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Zt(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const n=Math.min(1,e/i);return this.slerp(t,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,n=t._y,r=t._z,a=t._w,o=e._x,l=e._y,h=e._z,c=e._w;return this._x=i*c+a*o+n*h-r*l,this._y=n*c+a*l+r*o-i*h,this._z=r*c+a*h+i*l-n*o,this._w=a*c-i*o-n*l-r*h,this._onChangeCallback(),this}slerp(t,e){let i=t._x,n=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(i=-i,n=-n,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){const h=Math.acos(o),c=Math.sin(h);l=Math.sin(l*h)/c,e=Math.sin(e*h)/c,this._x=this._x*l+i*e,this._y=this._y*l+n*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+i*e,this._y=this._y*l+n*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(n*Math.sin(t),n*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const no=class no{constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(bo.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(bo.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,n=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*n,this.y=r[1]*e+r[4]*i+r[7]*n,this.z=r[2]*e+r[5]*i+r[8]*n,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*n+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*n+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*n+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*n+r[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,n=this.z,r=t.x,a=t.y,o=t.z,l=t.w,h=2*(a*n-o*i),c=2*(o*e-r*n),u=2*(r*i-a*e);return this.x=e+l*h+a*u-o*c,this.y=i+l*c+o*h-r*u,this.z=n+l*u+r*c-a*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,n=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*n,this.y=r[1]*e+r[5]*i+r[9]*n,this.z=r[2]*e+r[6]*i+r[10]*n,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this.z=Zt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this.z=Zt(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Zt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,n=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=n*l-r*o,this.y=r*a-i*l,this.z=i*o-n*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return vr.copy(this).projectOnVector(t),this.sub(vr)}reflect(t){return this.sub(vr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Zt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,n=this.z-t.z;return e*e+i*i+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const n=Math.sin(e)*t;return this.x=n*Math.sin(i),this.y=Math.cos(e)*t,this.z=n*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),n=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=n,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};no.prototype.isVector3=!0;let C=no;const vr=new C,bo=new Bn,so=class so{constructor(t,e,i,n,r,a,o,l,h){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,n,r,a,o,l,h)}set(t,e,i,n,r,a,o,l,h){const c=this.elements;return c[0]=t,c[1]=n,c[2]=o,c[3]=e,c[4]=r,c[5]=l,c[6]=i,c[7]=a,c[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,r=this.elements,a=i[0],o=i[3],l=i[6],h=i[1],c=i[4],u=i[7],d=i[2],p=i[5],_=i[8],S=n[0],m=n[3],f=n[6],v=n[1],T=n[4],b=n[7],A=n[2],w=n[5],g=n[8];return r[0]=a*S+o*v+l*A,r[3]=a*m+o*T+l*w,r[6]=a*f+o*b+l*g,r[1]=h*S+c*v+u*A,r[4]=h*m+c*T+u*w,r[7]=h*f+c*b+u*g,r[2]=d*S+p*v+_*A,r[5]=d*m+p*T+_*w,r[8]=d*f+p*b+_*g,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],n=t[2],r=t[3],a=t[4],o=t[5],l=t[6],h=t[7],c=t[8];return e*a*c-e*o*h-i*r*c+i*o*l+n*r*h-n*a*l}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],r=t[3],a=t[4],o=t[5],l=t[6],h=t[7],c=t[8],u=c*a-o*h,d=o*l-c*r,p=h*r-a*l,_=e*u+i*d+n*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/_;return t[0]=u*S,t[1]=(n*h-c*i)*S,t[2]=(o*i-n*a)*S,t[3]=d*S,t[4]=(c*e-n*l)*S,t[5]=(n*r-o*e)*S,t[6]=p*S,t[7]=(i*l-h*e)*S,t[8]=(a*e-i*r)*S,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,n,r,a,o){const l=Math.cos(r),h=Math.sin(r);return this.set(i*l,i*h,-i*(l*a+h*o)+a+t,-n*h,n*l,-n*(-h*a+l*o)+o+e,0,0,1),this}scale(t,e){return Zs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Mr.makeScale(t,e)),this}rotate(t){return Zs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Mr.makeRotation(-t)),this}translate(t,e){return Zs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Mr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<9;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}};so.prototype.isMatrix3=!0;let Ut=so;const Mr=new Ut,Eo=new Ut().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),wo=new Ut().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function tc(){const s={enabled:!0,workingColorSpace:tr,spaces:{},convert:function(n,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ee&&(n.r=Ii(n.r),n.g=Ii(n.g),n.b=Ii(n.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(n.applyMatrix3(this.spaces[r].toXYZ),n.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ee&&(n.r=Ln(n.r),n.g=Ln(n.g),n.b=Ln(n.b))),n},workingToColorSpace:function(n,r){return this.convert(n,this.workingColorSpace,r)},colorSpaceToWorking:function(n,r){return this.convert(n,r,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Vi?er:this.spaces[n].transfer},getToneMappingMode:function(n){return this.spaces[n].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(n,r=this.workingColorSpace){return n.fromArray(this.spaces[r].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,r,a){return n.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return s.define({[tr]:{primaries:t,whitePoint:i,transfer:er,toXYZ:Eo,fromXYZ:wo,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Me},outputColorSpaceConfig:{drawingBufferColorSpace:Me}},[Me]:{primaries:t,whitePoint:i,transfer:ee,toXYZ:Eo,fromXYZ:wo,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Me}}}),s}const Kt=tc();function Ii(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ln(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let pn;class ec{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{pn===void 0&&(pn=ir("canvas")),pn.width=t.width,pn.height=t.height;const n=pn.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),i=pn}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ir("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const n=i.getImageData(0,0,t.width,t.height),r=n.data;for(let a=0;a<r.length;a++)r[a]=Ii(r[a]/255)*255;return i.putImageData(n,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Ii(e[i]/255)*255):e[i]=Ii(e[i]);return{data:e,width:t.width,height:t.height}}else return It("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let ic=0;class qa{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:ic++}),this.uuid=un(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width||0,e.height||0,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let r;if(Array.isArray(n)){r=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?r.push(Sr(n[a].image)):r.push(Sr(n[a]))}else r=Sr(n);i.url=r}return e||(t.images[this.uuid]=i),i}}function Sr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?ec.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(It("Texture: Unable to serialize Texture."),{})}let nc=0;const yr=new C;class ke extends cn{constructor(t=ke.DEFAULT_IMAGE,e=ke.DEFAULT_MAPPING,i=Pi,n=Pi,r=Ye,a=Wi,o=Si,l=je,h=ke.DEFAULT_ANISOTROPY,c=Vi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:nc++}),this.uuid=un(),this.name="",this.source=new qa(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Tt(0,0),this.repeat=new Tt(1,1),this.center=new Tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ut,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(yr).x}get height(){return this.source.getSize(yr).y}get depth(){return this.source.getSize(yr).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.mipmapsAutoUpdate=t.mipmapsAutoUpdate,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isPMREMTexture=t.isPMREMTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){It(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const n=this[e];if(n===void 0){It(`Texture.setValues(): property '${e}' does not exist.`);continue}n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==El)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ns:t.x=t.x-Math.floor(t.x);break;case Pi:t.x=t.x<0?0:1;break;case Jr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ns:t.y=t.y-Math.floor(t.y);break;case Pi:t.y=t.y<0?0:1;break;case Jr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}ke.DEFAULT_IMAGE=null;ke.DEFAULT_MAPPING=El;ke.DEFAULT_ANISOTROPY=1;const ro=class ro{constructor(t=0,e=0,i=0,n=1){this.x=t,this.y=e,this.z=i,this.w=n}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,n){return this.x=t,this.y=e,this.z=i,this.w=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*n+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*n+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*n+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*n+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,n,r;const l=t.elements,h=l[0],c=l[4],u=l[8],d=l[1],p=l[5],_=l[9],S=l[2],m=l[6],f=l[10];if(Math.abs(c-d)<.01&&Math.abs(u-S)<.01&&Math.abs(_-m)<.01){if(Math.abs(c+d)<.1&&Math.abs(u+S)<.1&&Math.abs(_+m)<.1&&Math.abs(h+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const T=(h+1)/2,b=(p+1)/2,A=(f+1)/2,w=(c+d)/4,g=(u+S)/4,y=(_+m)/4;return T>b&&T>A?T<.01?(i=0,n=.707106781,r=.707106781):(i=Math.sqrt(T),n=w/i,r=g/i):b>A?b<.01?(i=.707106781,n=0,r=.707106781):(n=Math.sqrt(b),i=w/n,r=y/n):A<.01?(i=.707106781,n=.707106781,r=0):(r=Math.sqrt(A),i=g/r,n=y/r),this.set(i,n,r,e),this}let v=Math.sqrt((m-_)*(m-_)+(u-S)*(u-S)+(d-c)*(d-c));return Math.abs(v)<.001&&(v=1),this.x=(m-_)/v,this.y=(u-S)/v,this.z=(d-c)/v,this.w=Math.acos((h+p+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this.z=Zt(this.z,t.z,e.z),this.w=Zt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this.z=Zt(this.z,t,e),this.w=Zt(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Zt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};ro.prototype.isVector4=!0;let me=ro;class sc extends cn{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ye,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new me(0,0,t,e),this.scissorTest=!1,this.viewport=new me(0,0,t,e),this.textures=[];const n=i.count;for(let r=0;r<n;r++)this.textures[r]=new ke({width:t,height:e,depth:i.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:Ye,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.mipmapsAutoUpdate!==void 0&&(e.mipmapsAutoUpdate=t.mipmapsAutoUpdate),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let n=0,r=this.textures.length;n<r;n++)this.textures[n].image.width=t,this.textures[n].image.height=e,this.textures[n].image.depth=i,this.textures[n].isData3DTexture!==!0&&(this.textures[n].isArrayTexture=this.textures[n].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const n=Object.assign({},t.textures[e].image);this.textures[e].source=new qa(n)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){const e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;else this.depthTexture=null;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class $e extends sc{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class zl extends ke{constructor(t=null,e=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=Ue,this.minFilter=Ue,this.wrapR=Pi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class rc extends ke{constructor(t=null,e=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=Ue,this.minFilter=Ue,this.wrapR=Pi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}}const ar=class ar{constructor(t,e,i,n,r,a,o,l,h,c,u,d,p,_,S,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,n,r,a,o,l,h,c,u,d,p,_,S,m)}set(t,e,i,n,r,a,o,l,h,c,u,d,p,_,S,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=i,f[12]=n,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=h,f[6]=c,f[10]=u,f[14]=d,f[3]=p,f[7]=_,f[11]=S,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ar().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,i=t.elements,n=1/mn.setFromMatrixColumn(t,0).length(),r=1/mn.setFromMatrixColumn(t,1).length(),a=1/mn.setFromMatrixColumn(t,2).length();return e[0]=i[0]*n,e[1]=i[1]*n,e[2]=i[2]*n,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,n=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),h=Math.sin(n),c=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=a*c,p=a*u,_=o*c,S=o*u;e[0]=l*c,e[4]=-l*u,e[8]=h,e[1]=p+_*h,e[5]=d-S*h,e[9]=-o*l,e[2]=S-d*h,e[6]=_+p*h,e[10]=a*l}else if(t.order==="YXZ"){const d=l*c,p=l*u,_=h*c,S=h*u;e[0]=d+S*o,e[4]=_*o-p,e[8]=a*h,e[1]=a*u,e[5]=a*c,e[9]=-o,e[2]=p*o-_,e[6]=S+d*o,e[10]=a*l}else if(t.order==="ZXY"){const d=l*c,p=l*u,_=h*c,S=h*u;e[0]=d-S*o,e[4]=-a*u,e[8]=_+p*o,e[1]=p+_*o,e[5]=a*c,e[9]=S-d*o,e[2]=-a*h,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const d=a*c,p=a*u,_=o*c,S=o*u;e[0]=l*c,e[4]=_*h-p,e[8]=d*h+S,e[1]=l*u,e[5]=S*h+d,e[9]=p*h-_,e[2]=-h,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const d=a*l,p=a*h,_=o*l,S=o*h;e[0]=l*c,e[4]=S-d*u,e[8]=_*u+p,e[1]=u,e[5]=a*c,e[9]=-o*c,e[2]=-h*c,e[6]=p*u+_,e[10]=d-S*u}else if(t.order==="XZY"){const d=a*l,p=a*h,_=o*l,S=o*h;e[0]=l*c,e[4]=-u,e[8]=h*c,e[1]=d*u+S,e[5]=a*c,e[9]=p*u-_,e[2]=_*u-p,e[6]=o*c,e[10]=S*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ac,t,oc)}lookAt(t,e,i){const n=this.elements;return Je.subVectors(t,e),Je.lengthSq()===0&&(Je.z=1),Je.normalize(),Oi.crossVectors(i,Je),Oi.lengthSq()===0&&(Math.abs(i.z)===1?Je.x+=1e-4:Je.z+=1e-4,Je.normalize(),Oi.crossVectors(i,Je)),Oi.normalize(),ms.crossVectors(Je,Oi),n[0]=Oi.x,n[4]=ms.x,n[8]=Je.x,n[1]=Oi.y,n[5]=ms.y,n[9]=Je.y,n[2]=Oi.z,n[6]=ms.z,n[10]=Je.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,r=this.elements,a=i[0],o=i[4],l=i[8],h=i[12],c=i[1],u=i[5],d=i[9],p=i[13],_=i[2],S=i[6],m=i[10],f=i[14],v=i[3],T=i[7],b=i[11],A=i[15],w=n[0],g=n[4],y=n[8],L=n[12],R=n[1],N=n[5],F=n[9],H=n[13],I=n[2],V=n[6],$=n[10],k=n[14],et=n[3],X=n[7],Q=n[11],j=n[15];return r[0]=a*w+o*R+l*I+h*et,r[4]=a*g+o*N+l*V+h*X,r[8]=a*y+o*F+l*$+h*Q,r[12]=a*L+o*H+l*k+h*j,r[1]=c*w+u*R+d*I+p*et,r[5]=c*g+u*N+d*V+p*X,r[9]=c*y+u*F+d*$+p*Q,r[13]=c*L+u*H+d*k+p*j,r[2]=_*w+S*R+m*I+f*et,r[6]=_*g+S*N+m*V+f*X,r[10]=_*y+S*F+m*$+f*Q,r[14]=_*L+S*H+m*k+f*j,r[3]=v*w+T*R+b*I+A*et,r[7]=v*g+T*N+b*V+A*X,r[11]=v*y+T*F+b*$+A*Q,r[15]=v*L+T*H+b*k+A*j,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],n=t[8],r=t[12],a=t[1],o=t[5],l=t[9],h=t[13],c=t[2],u=t[6],d=t[10],p=t[14],_=t[3],S=t[7],m=t[11],f=t[15],v=l*p-h*d,T=o*p-h*u,b=o*d-l*u,A=a*p-h*c,w=a*d-l*c,g=a*u-o*c;return e*(S*v-m*T+f*b)-i*(_*v-m*A+f*w)+n*(_*T-S*A+f*g)-r*(_*b-S*w+m*g)}determinantAffine(){const t=this.elements,e=t[0],i=t[4],n=t[8],r=t[1],a=t[5],o=t[9],l=t[2],h=t[6],c=t[10];return e*(a*c-o*h)-i*(r*c-o*l)+n*(r*h-a*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const n=this.elements;return t.isVector3?(n[12]=t.x,n[13]=t.y,n[14]=t.z):(n[12]=t,n[13]=e,n[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],r=t[3],a=t[4],o=t[5],l=t[6],h=t[7],c=t[8],u=t[9],d=t[10],p=t[11],_=t[12],S=t[13],m=t[14],f=t[15],v=e*o-i*a,T=e*l-n*a,b=e*h-r*a,A=i*l-n*o,w=i*h-r*o,g=n*h-r*l,y=c*S-u*_,L=c*m-d*_,R=c*f-p*_,N=u*m-d*S,F=u*f-p*S,H=d*f-p*m,I=v*H-T*F+b*N+A*R-w*L+g*y;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const V=1/I;return t[0]=(o*H-l*F+h*N)*V,t[1]=(n*F-i*H-r*N)*V,t[2]=(S*g-m*w+f*A)*V,t[3]=(d*w-u*g-p*A)*V,t[4]=(l*R-a*H-h*L)*V,t[5]=(e*H-n*R+r*L)*V,t[6]=(m*b-_*g-f*T)*V,t[7]=(c*g-d*b+p*T)*V,t[8]=(a*F-o*R+h*y)*V,t[9]=(i*R-e*F-r*y)*V,t[10]=(_*w-S*b+f*v)*V,t[11]=(u*b-c*w-p*v)*V,t[12]=(o*L-a*N-l*y)*V,t[13]=(e*N-i*L+n*y)*V,t[14]=(S*T-_*A-m*v)*V,t[15]=(c*A-u*T+d*v)*V,this}scale(t){const e=this.elements,i=t.x,n=t.y,r=t.z;return e[0]*=i,e[4]*=n,e[8]*=r,e[1]*=i,e[5]*=n,e[9]*=r,e[2]*=i,e[6]*=n,e[10]*=r,e[3]*=i,e[7]*=n,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],n=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,n))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),n=Math.sin(e),r=1-i,a=t.x,o=t.y,l=t.z,h=r*a,c=r*o;return this.set(h*a+i,h*o-n*l,h*l+n*o,0,h*o+n*l,c*o+i,c*l-n*a,0,h*l-n*o,c*l+n*a,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,n,r,a){return this.set(1,i,r,0,t,1,a,0,e,n,1,0,0,0,0,1),this}compose(t,e,i){const n=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,h=r+r,c=a+a,u=o+o,d=r*h,p=r*c,_=r*u,S=a*c,m=a*u,f=o*u,v=l*h,T=l*c,b=l*u,A=i.x,w=i.y,g=i.z;return n[0]=(1-(S+f))*A,n[1]=(p+b)*A,n[2]=(_-T)*A,n[3]=0,n[4]=(p-b)*w,n[5]=(1-(d+f))*w,n[6]=(m+v)*w,n[7]=0,n[8]=(_+T)*g,n[9]=(m-v)*g,n[10]=(1-(d+S))*g,n[11]=0,n[12]=t.x,n[13]=t.y,n[14]=t.z,n[15]=1,this}decompose(t,e,i){const n=this.elements;t.x=n[12],t.y=n[13],t.z=n[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),e.identity(),this;let a=mn.set(n[0],n[1],n[2]).length();const o=mn.set(n[4],n[5],n[6]).length(),l=mn.set(n[8],n[9],n[10]).length();r<0&&(a=-a),hi.copy(this);const h=1/a,c=1/o,u=1/l;return hi.elements[0]*=h,hi.elements[1]*=h,hi.elements[2]*=h,hi.elements[4]*=c,hi.elements[5]*=c,hi.elements[6]*=c,hi.elements[8]*=u,hi.elements[9]*=u,hi.elements[10]*=u,e.setFromRotationMatrix(hi),i.x=a,i.y=o,i.z=l,this}makePerspective(t,e,i,n,r,a,o=fi,l=!1){const h=this.elements,c=2*r/(e-t),u=2*r/(i-n),d=(e+t)/(e-t),p=(i+n)/(i-n);let _,S;if(l)_=r/(a-r),S=a*r/(a-r);else if(o===fi)_=-(a+r)/(a-r),S=-2*a*r/(a-r);else if(o===rs)_=-a/(a-r),S=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return h[0]=c,h[4]=0,h[8]=d,h[12]=0,h[1]=0,h[5]=u,h[9]=p,h[13]=0,h[2]=0,h[6]=0,h[10]=_,h[14]=S,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(t,e,i,n,r,a,o=fi,l=!1){const h=this.elements,c=2/(e-t),u=2/(i-n),d=-(e+t)/(e-t),p=-(i+n)/(i-n);let _,S;if(l)_=1/(a-r),S=a/(a-r);else if(o===fi)_=-2/(a-r),S=-(a+r)/(a-r);else if(o===rs)_=-1/(a-r),S=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return h[0]=c,h[4]=0,h[8]=0,h[12]=d,h[1]=0,h[5]=u,h[9]=0,h[13]=p,h[2]=0,h[6]=0,h[10]=_,h[14]=S,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<16;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}};ar.prototype.isMatrix4=!0;let he=ar;const mn=new C,hi=new he,ac=new C(0,0,0),oc=new C(1,1,1),Oi=new C,ms=new C,Je=new C,To=new he,Ao=new Bn;class Ji{constructor(t=0,e=0,i=0,n=Ji.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=n}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,n=this._order){return this._x=t,this._y=e,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const n=t.elements,r=n[0],a=n[4],o=n[8],l=n[1],h=n[5],c=n[9],u=n[2],d=n[6],p=n[10];switch(e){case"XYZ":this._y=Math.asin(Zt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-c,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Zt(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Zt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Zt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(Zt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-c,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Zt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-c,p),this._y=0);break;default:It("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return To.makeRotationFromQuaternion(t),this.setFromRotationMatrix(To,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ao.setFromEuler(this),this.setFromQuaternion(Ao,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ji.DEFAULT_ORDER="XYZ";class kl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let lc=0;const Ro=new C,gn=new Bn,Ei=new he,gs=new C,Vn=new C,hc=new C,cc=new Bn,Co=new C(1,0,0),Po=new C(0,1,0),Lo=new C(0,0,1),Do={type:"added"},uc={type:"removed"},_n={type:"childadded",child:null},br={type:"childremoved",child:null};class Ee extends cn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lc++}),this.uuid=un(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ee.DEFAULT_UP.clone();const t=new C,e=new Ji,i=new Bn,n=new C(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new he},normalMatrix:{value:new Ut}}),this.matrix=new he,this.matrixWorld=new he,this.matrixAutoUpdate=Ee.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ee.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new kl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return gn.setFromAxisAngle(t,e),this.quaternion.multiply(gn),this}rotateOnWorldAxis(t,e){return gn.setFromAxisAngle(t,e),this.quaternion.premultiply(gn),this}rotateX(t){return this.rotateOnAxis(Co,t)}rotateY(t){return this.rotateOnAxis(Po,t)}rotateZ(t){return this.rotateOnAxis(Lo,t)}translateOnAxis(t,e){return Ro.copy(t).applyQuaternion(this.quaternion),this.position.add(Ro.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Co,t)}translateY(t){return this.translateOnAxis(Po,t)}translateZ(t){return this.translateOnAxis(Lo,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ei.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?gs.copy(t):gs.set(t,e,i);const n=this.parent;this.updateWorldMatrix(!0,!1),Vn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ei.lookAt(Vn,gs,this.up):Ei.lookAt(gs,Vn,this.up),this.quaternion.setFromRotationMatrix(Ei),n&&(Ei.extractRotation(n.matrixWorld),gn.setFromRotationMatrix(Ei),this.quaternion.premultiply(gn.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(jt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Do),_n.child=t,this.dispatchEvent(_n),_n.child=null):jt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(uc),br.child=t,this.dispatchEvent(br),br.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ei.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ei.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ei),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Do),_n.child=t,this.dispatchEvent(_n),_n.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,n=this.children.length;i<n;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vn,t,hc),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vn,cc,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(t){t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,i=t.y,n=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*i-r[8]*n,r[13]+=i-r[1]*e-r[5]*i-r[9]*n,r[14]+=n-r[2]*e-r[6]*i-r[10]*n}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e,i=!1){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,n.name=this.name,n.castShadow=this.castShadow,n.receiveShadow=this.receiveShadow,n.visible=this.visible,n.frustumCulled=this.frustumCulled,n.renderOrder=this.renderOrder,n.static=this.static,n.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.pivot!==null&&(n.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(n.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(n.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(t),n.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let h=0,c=l.length;h<c;h++){const u=l[h];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,h=this.material.length;l<h;l++)o.push(r(t.materials,this.material[l]));n.material=o}else n.material=r(t.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];n.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),h=a(t.textures),c=a(t.images),u=a(t.shapes),d=a(t.skeletons),p=a(t.animations),_=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),h.length>0&&(i.textures=h),c.length>0&&(i.images=c),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),_.length>0&&(i.nodes=_)}return i.object=n,i;function a(o){const l=[];for(const h in o){const c=o[h];delete c.metadata,l.push(c)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const n=t.children[i];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Ee.DEFAULT_UP=new C(0,1,0);Ee.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ee.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Wt extends Ee{constructor(){super(),this.isGroup=!0,this.type="Group"}}const dc={type:"move"};class Er{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Wt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Wt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Wt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let n=null,r=null,a=null;const o=this._targetRay,l=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){a=!0;for(const S of t.hand.values()){const m=e.getJointPose(S,i),f=this._getHandJoint(h,S);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.quaternion,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const c=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],d=c.position.distanceTo(u.position),p=.02,_=.005;h.inputState.pinching&&d>p+_?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&d<=p-_&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(n=e.getPose(t.targetRaySpace,i),n===null&&r!==null&&(n=r),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(dc)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Wt;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const Gl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bi={h:0,s:0,l:0},_s={h:0,s:0,l:0};function wr(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Ft{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const n=t;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Me){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Kt.colorSpaceToWorking(this,e),this}setRGB(t,e,i,n=Kt.workingColorSpace){return this.r=t,this.g=e,this.b=i,Kt.colorSpaceToWorking(this,n),this}setHSL(t,e,i,n=Kt.workingColorSpace){if(t=Qh(t,1),e=Zt(e,0,1),i=Zt(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=wr(a,r,t+1/3),this.g=wr(a,r,t),this.b=wr(a,r,t-1/3)}return Kt.colorSpaceToWorking(this,n),this}setStyle(t,e=Me){function i(r){r!==void 0&&parseFloat(r)<1&&It("Color: Alpha component of "+t+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,e);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:It("Color: Unknown color model "+t)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=n[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);It("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Me){const i=Gl[t.toLowerCase()];return i!==void 0?this.setHex(i,e):It("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ii(t.r),this.g=Ii(t.g),this.b=Ii(t.b),this}copyLinearToSRGB(t){return this.r=Ln(t.r),this.g=Ln(t.g),this.b=Ln(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Me){return Kt.workingToColorSpace(ze.copy(this),t),Math.round(Zt(ze.r*255,0,255))*65536+Math.round(Zt(ze.g*255,0,255))*256+Math.round(Zt(ze.b*255,0,255))}getHexString(t=Me){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Kt.workingColorSpace){Kt.workingToColorSpace(ze.copy(this),e);const i=ze.r,n=ze.g,r=ze.b,a=Math.max(i,n,r),o=Math.min(i,n,r);let l,h;const c=(o+a)/2;if(o===a)l=0,h=0;else{const u=a-o;switch(h=c<=.5?u/(a+o):u/(2-a-o),a){case i:l=(n-r)/u+(n<r?6:0);break;case n:l=(r-i)/u+2;break;case r:l=(i-n)/u+4;break}l/=6}return t.h=l,t.s=h,t.l=c,t}getRGB(t,e=Kt.workingColorSpace){return Kt.workingToColorSpace(ze.copy(this),e),t.r=ze.r,t.g=ze.g,t.b=ze.b,t}getStyle(t=Me){Kt.workingToColorSpace(ze.copy(this),t);const e=ze.r,i=ze.g,n=ze.b;return t!==Me?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(t,e,i){return this.getHSL(Bi),this.setHSL(Bi.h+t,Bi.s+e,Bi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Bi),t.getHSL(_s);const i=xr(Bi.h,_s.h,e),n=xr(Bi.s,_s.s,e),r=xr(Bi.l,_s.l,e);return this.setHSL(i,n,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,n=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*n,this.g=r[1]*e+r[4]*i+r[7]*n,this.b=r[2]*e+r[5]*i+r[8]*n,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ze=new Ft;Ft.NAMES=Gl;class Ya{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ft(t),this.density=e}clone(){return new Ya(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class fc extends Ee{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ji,this.environmentIntensity=1,this.environmentRotation=new Ji,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),this.background=t.background!==null?t.background.clone():null,this.environment=t.environment!==null?t.environment.clone():null,this.fog=t.fog!==null?t.fog.clone():null,this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),this.overrideMaterial=t.overrideMaterial!==null?t.overrideMaterial.clone():null,this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}}const ci=new C,wi=new C,Tr=new C,Ti=new C,xn=new C,vn=new C,Io=new C,Ar=new C,Rr=new C,Cr=new C,Pr=new me,Lr=new me,Dr=new me;class oi{constructor(t=new C,e=new C,i=new C){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,n){n.subVectors(i,e),ci.subVectors(t,e),n.cross(ci);const r=n.lengthSq();return r>0?n.multiplyScalar(1/Math.sqrt(r)):n.set(0,0,0)}static getBarycoord(t,e,i,n,r){ci.subVectors(n,e),wi.subVectors(i,e),Tr.subVectors(t,e);const a=ci.dot(ci),o=ci.dot(wi),l=ci.dot(Tr),h=wi.dot(wi),c=wi.dot(Tr),u=a*h-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,p=(h*l-o*c)*d,_=(a*c-o*l)*d;return r.set(1-p-_,_,p)}static containsPoint(t,e,i,n){return this.getBarycoord(t,e,i,n,Ti)===null?!1:Ti.x>=0&&Ti.y>=0&&Ti.x+Ti.y<=1}static getInterpolation(t,e,i,n,r,a,o,l){return this.getBarycoord(t,e,i,n,Ti)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ti.x),l.addScaledVector(a,Ti.y),l.addScaledVector(o,Ti.z),l)}static getInterpolatedAttribute(t,e,i,n,r,a){return Pr.setScalar(0),Lr.setScalar(0),Dr.setScalar(0),Pr.fromBufferAttribute(t,e),Lr.fromBufferAttribute(t,i),Dr.fromBufferAttribute(t,n),a.setScalar(0),a.addScaledVector(Pr,r.x),a.addScaledVector(Lr,r.y),a.addScaledVector(Dr,r.z),a}static isFrontFacing(t,e,i,n){return ci.subVectors(i,e),wi.subVectors(t,e),ci.cross(wi).dot(n)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,n){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[n]),this}setFromAttributeAndIndices(t,e,i,n){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ci.subVectors(this.c,this.b),wi.subVectors(this.a,this.b),ci.cross(wi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return oi.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return oi.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,n,r){return oi.getInterpolation(t,this.a,this.b,this.c,e,i,n,r)}containsPoint(t){return oi.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return oi.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,n=this.b,r=this.c;let a,o;xn.subVectors(n,i),vn.subVectors(r,i),Ar.subVectors(t,i);const l=xn.dot(Ar),h=vn.dot(Ar);if(l<=0&&h<=0)return e.copy(i);Rr.subVectors(t,n);const c=xn.dot(Rr),u=vn.dot(Rr);if(c>=0&&u<=c)return e.copy(n);const d=l*u-c*h;if(d<=0&&l>=0&&c<=0&&l-c>0)return a=l/(l-c),e.copy(i).addScaledVector(xn,a);Cr.subVectors(t,r);const p=xn.dot(Cr),_=vn.dot(Cr);if(_>=0&&p<=_)return e.copy(r);const S=p*h-l*_;if(S<=0&&h>=0&&_<=0)return o=h/(h-_),e.copy(i).addScaledVector(vn,o);const m=c*_-p*u;if(m<=0&&u-c>=0&&p-_>=0)return Io.subVectors(r,n),o=(u-c)/(u-c+(p-_)),e.copy(n).addScaledVector(Io,o);const f=1/(m+S+d);return a=S*f,o=d*f,e.copy(i).addScaledVector(xn,a).addScaledVector(vn,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class hs{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ui.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ui.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ui.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0&&t.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,ui):ui.fromBufferAttribute(r,a),ui.applyMatrix4(t.matrixWorld),this.expandByPoint(ui);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),xs.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),xs.copy(i.boundingBox)),xs.applyMatrix4(t.matrixWorld),this.union(xs)}const n=t.children;for(let r=0,a=n.length;r<a;r++)this.expandByObject(n[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ui),ui.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wn),vs.subVectors(this.max,Wn),Mn.subVectors(t.a,Wn),Sn.subVectors(t.b,Wn),yn.subVectors(t.c,Wn),zi.subVectors(Sn,Mn),ki.subVectors(yn,Sn),en.subVectors(Mn,yn);let e=[0,-zi.z,zi.y,0,-ki.z,ki.y,0,-en.z,en.y,zi.z,0,-zi.x,ki.z,0,-ki.x,en.z,0,-en.x,-zi.y,zi.x,0,-ki.y,ki.x,0,-en.y,en.x,0];return!Ir(e,Mn,Sn,yn,vs)||(e=[1,0,0,0,1,0,0,0,1],!Ir(e,Mn,Sn,yn,vs))?!1:(Ms.crossVectors(zi,ki),e=[Ms.x,Ms.y,Ms.z],Ir(e,Mn,Sn,yn,vs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ui).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ui).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ai[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ai[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ai[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ai[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ai[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ai[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ai[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ai[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ai),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Ai=[new C,new C,new C,new C,new C,new C,new C,new C],ui=new C,xs=new hs,Mn=new C,Sn=new C,yn=new C,zi=new C,ki=new C,en=new C,Wn=new C,vs=new C,Ms=new C,nn=new C;function Ir(s,t,e,i,n){for(let r=0,a=s.length-3;r<=a;r+=3){nn.fromArray(s,r);const o=n.x*Math.abs(nn.x)+n.y*Math.abs(nn.y)+n.z*Math.abs(nn.z),l=t.dot(nn),h=e.dot(nn),c=i.dot(nn);if(Math.max(-Math.max(l,h,c),Math.min(l,h,c))>o)return!1}return!0}const ve=new C,Ss=new Tt;let pc=0;class ti extends cn{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:pc++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Ul,this.updateRanges=[],this.gpuType=Mi,this.version=0,this._normalizationScale=t!==void 0?lr(t):void 0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this._normalizationScale=t._normalizationScale,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let n=0,r=this.itemSize;n<r;n++)this.array[t+n]=e.array[i+n];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Ss.fromBufferAttribute(this,e),Ss.applyMatrix3(t),this.setXY(e,Ss.x,Ss.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)ve.fromBufferAttribute(this,e),ve.applyMatrix3(t),this.setXYZ(e,ve.x,ve.y,ve.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)ve.fromBufferAttribute(this,e),ve.applyMatrix4(t),this.setXYZ(e,ve.x,ve.y,ve.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)ve.fromBufferAttribute(this,e),ve.applyNormalMatrix(t),this.setXYZ(e,ve.x,ve.y,ve.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)ve.fromBufferAttribute(this,e),ve.transformDirection(t),this.setXYZ(e,ve.x,ve.y,ve.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=this._denormalize(i)),i}setComponent(t,e,i){return this.normalized&&(i=this._normalize(i)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=this._denormalize(e)),e}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=this._denormalize(e)),e}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=this._denormalize(e)),e}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=this._denormalize(e)),e}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),i=this._normalize(i)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,n){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),i=this._normalize(i),n=this._normalize(n)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this}setXYZW(t,e,i,n,r){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),i=this._normalize(i),n=this._normalize(n),r=this._normalize(r)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(t){const e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):Ol(t,this.array)}_normalize(t){const e=this._normalizationScale;return e!==void 0?Math.round(t*e):Bl(t,this.array)}}class Hl extends ti{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Vl extends ti{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Qt extends ti{constructor(t,e,i){super(new Float32Array(t),e,i)}}const mc=new hs,Xn=new C,Nr=new C;class hr{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):mc.setFromPoints(t).getCenter(i);let n=0;for(let r=0,a=t.length;r<a;r++)n=Math.max(n,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(n),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xn.subVectors(t,this.center);const e=Xn.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),n=(i-this.radius)*.5;this.center.addScaledVector(Xn,n/i),this.radius+=n}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Nr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xn.copy(t.center).add(Nr)),this.expandByPoint(Xn.copy(t.center).sub(Nr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let gc=0;const ri=new he,Ur=new Ee,bn=new C,Qe=new hs,qn=new hs,Pe=new C;class ge extends cn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:gc++}),this.uuid=un(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Kh(t)?Vl:Hl)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Ut().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(t),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return ri.makeRotationFromQuaternion(t),this.applyMatrix4(ri),this}rotateX(t){return ri.makeRotationX(t),this.applyMatrix4(ri),this}rotateY(t){return ri.makeRotationY(t),this.applyMatrix4(ri),this}rotateZ(t){return ri.makeRotationZ(t),this.applyMatrix4(ri),this}translate(t,e,i){return ri.makeTranslation(t,e,i),this.applyMatrix4(ri),this}scale(t,e,i){return ri.makeScale(t,e,i),this.applyMatrix4(ri),this}lookAt(t){return Ur.lookAt(t),Ur.updateMatrix(),this.applyMatrix4(Ur.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bn).negate(),this.translate(bn.x,bn.y,bn.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let n=0,r=t.length;n<r;n++){const a=t[n];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Qt(i,3))}else{const i=Math.min(t.length,e.count);for(let n=0;n<i;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&It("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new hs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){jt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,n=e.length;i<n;i++){const r=e[i];Qe.setFromBufferAttribute(r),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,Qe.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,Qe.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(Qe.min),this.boundingBox.expandByPoint(Qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&jt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new hr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){jt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const i=this.boundingSphere.center;if(Qe.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];qn.setFromBufferAttribute(o),this.morphTargetsRelative?(Pe.addVectors(Qe.min,qn.min),Qe.expandByPoint(Pe),Pe.addVectors(Qe.max,qn.max),Qe.expandByPoint(Pe)):(Qe.expandByPoint(qn.min),Qe.expandByPoint(qn.max))}Qe.getCenter(i);let n=0;for(let r=0,a=t.count;r<a;r++)Pe.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(Pe));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let h=0,c=o.count;h<c;h++)Pe.fromBufferAttribute(o,h),l&&(bn.fromBufferAttribute(t,h),Pe.add(bn)),n=Math.max(n,i.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&jt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){jt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,n=e.normal,r=e.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new ti(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[],h=new Uint8Array(i.count);for(let L=0;L<i.count;L++)o[L]=new C,l[L]=new C;const c=new C,u=new C,d=new C,p=new Tt,_=new Tt,S=new Tt,m=new C,f=new C;function v(L,R,N){h[L]=h[R]=h[N]=1,c.fromBufferAttribute(i,L),u.fromBufferAttribute(i,R),d.fromBufferAttribute(i,N),p.fromBufferAttribute(r,L),_.fromBufferAttribute(r,R),S.fromBufferAttribute(r,N),u.sub(c),d.sub(c),_.sub(p),S.sub(p);const F=1/(_.x*S.y-S.x*_.y);isFinite(F)&&(m.copy(u).multiplyScalar(S.y).addScaledVector(d,-_.y).multiplyScalar(F),f.copy(d).multiplyScalar(_.x).addScaledVector(u,-S.x).multiplyScalar(F),o[L].add(m),o[R].add(m),o[N].add(m),l[L].add(f),l[R].add(f),l[N].add(f))}let T=this.groups;T.length===0&&(T=[{start:0,count:t.count}]);for(let L=0,R=T.length;L<R;++L){const N=T[L],F=N.start,H=N.count;for(let I=F,V=F+H;I<V;I+=3)v(t.getX(I+0),t.getX(I+1),t.getX(I+2))}const b=new C,A=new C,w=new C,g=new C;function y(L){w.fromBufferAttribute(n,L),g.copy(w);const R=o[L];b.copy(R),b.sub(w.multiplyScalar(w.dot(R))).normalize(),A.crossVectors(g,R);const F=A.dot(l[L])<0?-1:1;a.setXYZW(L,b.x,b.y,b.z,F)}for(let L=0,R=i.count;L<R;++L)h[L]&&y(L);this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new ti(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);const n=new C,r=new C,a=new C,o=new C,l=new C,h=new C,c=new C,u=new C;if(t)for(let d=0,p=t.count;d<p;d+=3){const _=t.getX(d+0),S=t.getX(d+1),m=t.getX(d+2);n.fromBufferAttribute(e,_),r.fromBufferAttribute(e,S),a.fromBufferAttribute(e,m),c.subVectors(a,r),u.subVectors(n,r),c.cross(u),o.fromBufferAttribute(i,_),l.fromBufferAttribute(i,S),h.fromBufferAttribute(i,m),o.add(c),l.add(c),h.add(c),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(S,l.x,l.y,l.z),i.setXYZ(m,h.x,h.y,h.z)}else for(let d=0,p=e.count;d<p;d+=3)n.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),c.subVectors(a,r),u.subVectors(n,r),c.cross(u),i.setXYZ(d+0,c.x,c.y,c.z),i.setXYZ(d+1,c.x,c.y,c.z),i.setXYZ(d+2,c.x,c.y,c.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Pe.fromBufferAttribute(t,e),Pe.normalize(),t.setXYZ(e,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(o,l){const h=o.array,c=o.itemSize,u=o.normalized,d=new h.constructor(l.length*c);let p=0,_=0;for(let S=0,m=l.length;S<m;S++){o.isInterleavedBufferAttribute?p=l[S]*o.data.stride+o.offset:p=l[S]*c;for(let f=0;f<c;f++)d[_++]=h[p++]}return new ti(d,c,u)}if(this.index===null)return It("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ge,i=this.index.array,n=this.attributes;for(const o in n){const l=n[o],h=t(l,i);e.setAttribute(o,h)}const r=this.morphAttributes;for(const o in r){const l=[],h=r[o];for(let c=0,u=h.length;c<u;c++){const d=h[c],p=t(d,i);l.push(p)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const h=a[o];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const h in l)l[h]!==void 0&&(t[h]=l[h]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const h=i[l];t.data.attributes[l]=h.toJSON(t.data)}const n={};let r=!1;for(const l in this.morphAttributes){const h=this.morphAttributes[l],c=[];for(let u=0,d=h.length;u<d;u++){const p=h[u];c.push(p.toJSON(t.data))}c.length>0&&(n[l]=c,r=!0)}r&&(t.data.morphAttributes=n,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const n=t.attributes;for(const h in n){const c=n[h];this.setAttribute(h,c.clone(e))}const r=t.morphAttributes;for(const h in r){const c=[],u=r[h];for(let d=0,p=u.length;d<p;d++)c.push(u[d].clone(e));this.morphAttributes[h]=c}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let h=0,c=a.length;h<c;h++){const u=a[h];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class _c{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Ul,this.updateRanges=[],this.version=0,this.uuid=un()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let n=0,r=this.stride;n<r;n++)this.array[t+n]=e.array[i+n];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={});const e=No(this.array);t.arrayBuffers[e]===void 0&&(t.arrayBuffers[e]=this.array.slice(0).buffer);const i=new this.array.constructor(t.arrayBuffers[e]),n=new this.constructor(i,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={});const e=No(this.array);t.arrayBuffers[e]===void 0&&(t.arrayBuffers[e]=Array.from(new Uint32Array(this.array.slice(0).buffer)));const i={uuid:this.uuid,buffer:e,type:this.array.constructor.name,stride:this.stride};return i.usage=this.usage,i}}function No(s){return s.buffer._uuid===void 0&&(s.buffer._uuid=un()),s.byteOffset===0&&s.byteLength===s.buffer.byteLength?s.buffer._uuid:s.buffer._uuid+":"+s.byteOffset+":"+s.byteLength}const He=new C;class sr{constructor(t,e,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=n,this._normalizationScale=t!==void 0?lr(t.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)He.fromBufferAttribute(this,e),He.applyMatrix4(t),this.setXYZ(e,He.x,He.y,He.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.applyNormalMatrix(t),this.setXYZ(e,He.x,He.y,He.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.transformDirection(t),this.setXYZ(e,He.x,He.y,He.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=this._denormalize(i)),i}setComponent(t,e,i){return this.normalized&&(i=this._normalize(i)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=this._denormalize(e)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=this._denormalize(e)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=this._denormalize(e)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=this._denormalize(e)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),i=this._normalize(i)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),i=this._normalize(i),n=this._normalize(n)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this}setXYZW(t,e,i,n,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),i=this._normalize(i),n=this._normalize(n),r=this._normalize(r)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this.data.array[t+3]=r,this}clone(t){if(t===void 0){nr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[n+r])}return new ti(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new sr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){nr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[n+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(t){const e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):Ol(t,this.data.array)}_normalize(t){const e=this._normalizationScale;return e!==void 0?Math.round(t*e):Bl(t,this.data.array)}}const Fr=new C,xc=new C,vc=new Ut;class Hi{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,n){return this.normal.set(t,e,i),this.constant=n,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const n=Fr.subVectors(i,e).cross(xc.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(n,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){const n=t.delta(Fr),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||vc.getNormalMatrix(t),n=this.coplanarPoint(Fr).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}}let Mc=0;class dn extends cn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Mc++}),this.uuid=un(),this.name="",this.type="Material",this.blending=ln,this.side=Zi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Sl,this.blendDst=yl,this.blendEquation=Pn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ft(0,0,0),this.blendAlpha=0,this.depthFunc=es,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Hh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gr,this.stencilZFail=gr,this.stencilZPass=gr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){It(`Material: parameter '${e}' has value of undefined.`);continue}const n=this[e];if(n===void 0){It(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector2&&i&&i.isVector2||n&&n.isEuler&&i&&i.isEuler||n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(t).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=n(t.textures),a=n(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Ft().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.diffuseRoughness!==void 0&&(this.diffuseRoughness=t.diffuseRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum),t.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=t.iridescenceThicknessRange[1]),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new Hi().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Tt().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Tt().fromArray(t.clearcoatNormalScale)),t.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=e[t.diffuseRoughnessMap]||null),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const n=e.length;i=new Array(n);for(let r=0;r!==n;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class di extends dn{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ft(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let En;const Yn=new C,wn=new C,Tn=new C,An=new Tt,Kn=new Tt,Wl=new he,ys=new C,Zn=new C,bs=new C,Uo=new Tt,Or=new Tt,Fo=new Tt;class vi extends Ee{constructor(t=new di){if(super(),this.isSprite=!0,this.type="Sprite",En===void 0){En=new ge;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new _c(e,5);En.setIndex([0,1,2,0,2,3]),En.setAttribute("position",new sr(i,3,0,!1)),En.setAttribute("uv",new sr(i,2,3,!1))}this.geometry=En,this.material=t,this.center=new Tt(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&jt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),wn.setFromMatrixScale(this.matrixWorld),Wl.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Tn.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&wn.multiplyScalar(-Tn.z);const i=this.material.rotation;let n,r;i!==0&&(r=Math.cos(i),n=Math.sin(i));const a=this.center;Es(ys.set(-.5,-.5,0),Tn,a,wn,n,r),Es(Zn.set(.5,-.5,0),Tn,a,wn,n,r),Es(bs.set(.5,.5,0),Tn,a,wn,n,r),Uo.set(0,0),Or.set(1,0),Fo.set(1,1);let o=t.ray.intersectTriangle(ys,Zn,bs,!1,Yn);if(o===null&&(Es(Zn.set(-.5,.5,0),Tn,a,wn,n,r),Or.set(0,1),o=t.ray.intersectTriangle(ys,bs,Zn,!1,Yn),o===null))return;const l=t.ray.origin.distanceTo(Yn);l<t.near||l>t.far||e.push({distance:l,point:Yn.clone(),uv:oi.getInterpolation(Yn,ys,Zn,bs,Uo,Or,Fo,new Tt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}toJSON(t){const e=super.toJSON(t);return e.object.center=this.center.toArray(),e}}function Es(s,t,e,i,n,r){An.subVectors(s,e).addScalar(.5).multiply(i),n!==void 0?(Kn.x=r*An.x-n*An.y,Kn.y=n*An.x+r*An.y):Kn.copy(An),s.copy(t),s.x+=Kn.x,s.y+=Kn.y,s.applyMatrix4(Wl)}const Ri=new C,Br=new C,ws=new C,Ts=new C;class Xl{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ri)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ri.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ri.copy(this.origin).addScaledVector(this.direction,e),Ri.distanceToSquared(t))}distanceSqToSegment(t,e,i,n){Br.copy(t).add(e).multiplyScalar(.5),ws.copy(e).sub(t).normalize(),Ts.copy(this.origin).sub(Br);const r=t.distanceTo(e)*.5,a=-this.direction.dot(ws),o=Ts.dot(this.direction),l=-Ts.dot(ws),h=Ts.lengthSq(),c=Math.abs(1-a*a);let u,d,p,_;if(c>0)if(u=a*l-o,d=a*o-l,_=r*c,u>=0)if(d>=-_)if(d<=_){const S=1/c;u*=S,d*=S,p=u*(u+a*d+2*o)+d*(a*u+d+2*l)+h}else d=r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+h;else d=-r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+h;else d<=-_?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+h):d<=_?(u=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+h):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+h);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,u),n&&n.copy(Br).addScaledVector(ws,d),p}intersectSphere(t,e){if(t.radius<0)return null;Ri.subVectors(t.center,this.origin);const i=Ri.dot(this.direction),n=Ri.dot(Ri)-i*i,r=t.radius*t.radius;if(n>r)return null;const a=Math.sqrt(r-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,n,r,a,o,l;const h=1/this.direction.x,c=1/this.direction.y,u=1/this.direction.z,d=this.origin;return h>=0?(i=(t.min.x-d.x)*h,n=(t.max.x-d.x)*h):(i=(t.max.x-d.x)*h,n=(t.min.x-d.x)*h),c>=0?(r=(t.min.y-d.y)*c,a=(t.max.y-d.y)*c):(r=(t.max.y-d.y)*c,a=(t.min.y-d.y)*c),i>a||r>n||((r>i||isNaN(i))&&(i=r),(a<n||isNaN(n))&&(n=a),u>=0?(o=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,e)}intersectsBox(t){return this.intersectBox(t,Ri)!==null}intersectTriangle(t,e,i,n,r){const a=this.origin,o=this.direction,l=o.x,h=o.y,c=o.z,u=t.x-a.x,d=t.y-a.y,p=t.z-a.z,_=e.x-a.x,S=e.y-a.y,m=e.z-a.z,f=i.x-a.x,v=i.y-a.y,T=i.z-a.z,b=Math.abs(l),A=Math.abs(h),w=Math.abs(c);let g,y,L,R,N,F,H,I,V,$,k,et;if(b>=A&&b>=w?(L=l,F=u,V=_,et=f,l>=0?(g=h,y=c,R=d,N=p,H=S,I=m,$=v,k=T):(g=c,y=h,R=p,N=d,H=m,I=S,$=T,k=v)):A>=w?(L=h,F=d,V=S,et=v,h>=0?(g=c,y=l,R=p,N=u,H=m,I=_,$=T,k=f):(g=l,y=c,R=u,N=p,H=_,I=m,$=f,k=T)):(L=c,F=p,V=m,et=T,c>=0?(g=l,y=h,R=u,N=d,H=_,I=S,$=f,k=v):(g=h,y=l,R=d,N=u,H=S,I=_,$=v,k=f)),L===0)return null;const X=g/L,Q=y/L,j=1/L,yt=R-X*F,Ot=N-Q*F,K=H-X*V,pt=I-Q*V,vt=$-X*et,Ct=k-Q*et,mt=vt*pt-Ct*K,kt=yt*Ct-Ot*vt,_e=K*Ot-pt*yt;if(n){if(mt<0||kt<0||_e<0)return null}else if((mt<0||kt<0||_e<0)&&(mt>0||kt>0||_e>0))return null;const Dt=mt+kt+_e;if(Dt===0)return null;const ie=j*(mt*F+kt*V+_e*et);return(Dt>0?ie<0:ie>0)?null:this.at(ie/Dt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class pe extends dn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ft(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ji,this.combine=bl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Oo=new he,sn=new Xl,As=new hr,Bo=new C,Rs=new C,Cs=new C,Ps=new C,zr=new C,Ls=new C,zo=new C,Ds=new C;class _t extends Ee{constructor(t=new ge,e=new pe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const i=this.geometry,n=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(n,t);const o=this.morphTargetInfluences;if(r&&o){Ls.set(0,0,0);for(let l=0,h=r.length;l<h;l++){const c=o[l],u=r[l];c!==0&&(zr.fromBufferAttribute(u,t),a?Ls.addScaledVector(zr,c):Ls.addScaledVector(zr.sub(e),c))}e.add(Ls)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const i=this.geometry,n=this.material,r=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),As.copy(i.boundingSphere),As.applyMatrix4(r),sn.copy(t.ray).recast(t.near),!(As.containsPoint(sn.origin)===!1&&(sn.intersectSphere(As,Bo)===null||sn.origin.distanceToSquared(Bo)>(t.far-t.near)**2))&&(Oo.copy(r).invert(),sn.copy(t.ray).applyMatrix4(Oo),!(i.boundingBox!==null&&sn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,sn)))}_computeIntersections(t,e,i){let n;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,h=r.attributes.uv,c=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,S=d.length;_<S;_++){const m=d[_],f=a[m.materialIndex],v=Math.max(m.start,p.start),T=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let b=v,A=T;b<A;b+=3){const w=o.getX(b),g=o.getX(b+1),y=o.getX(b+2);n=Is(this,f,t,i,h,c,u,w,g,y),n&&(n.faceIndex=Math.floor(b/3),n.face.materialIndex=m.materialIndex,e.push(n))}}else{const _=Math.max(0,p.start),S=Math.min(o.count,p.start+p.count);for(let m=_,f=S;m<f;m+=3){const v=o.getX(m),T=o.getX(m+1),b=o.getX(m+2);n=Is(this,a,t,i,h,c,u,v,T,b),n&&(n.faceIndex=Math.floor(m/3),e.push(n))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,S=d.length;_<S;_++){const m=d[_],f=a[m.materialIndex],v=Math.max(m.start,p.start),T=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let b=v,A=T;b<A;b+=3){const w=b,g=b+1,y=b+2;n=Is(this,f,t,i,h,c,u,w,g,y),n&&(n.faceIndex=Math.floor(b/3),n.face.materialIndex=m.materialIndex,e.push(n))}}else{const _=Math.max(0,p.start),S=Math.min(l.count,p.start+p.count);for(let m=_,f=S;m<f;m+=3){const v=m,T=m+1,b=m+2;n=Is(this,a,t,i,h,c,u,v,T,b),n&&(n.faceIndex=Math.floor(m/3),e.push(n))}}}}function Sc(s,t,e,i,n,r,a,o){let l;if(t.side===We?l=i.intersectTriangle(a,r,n,!0,o):l=i.intersectTriangle(n,r,a,t.side===Zi,o),l===null)return null;Ds.copy(o),Ds.applyMatrix4(s.matrixWorld);const h=e.ray.origin.distanceTo(Ds);return h<e.near||h>e.far?null:{distance:h,point:Ds.clone(),object:s}}function Is(s,t,e,i,n,r,a,o,l,h){s.getVertexPosition(o,Rs),s.getVertexPosition(l,Cs),s.getVertexPosition(h,Ps);const c=Sc(s,t,e,i,Rs,Cs,Ps,zo);if(c){const u=new C;oi.getBarycoord(zo,Rs,Cs,Ps,u),n&&(c.uv=oi.getInterpolatedAttribute(n,o,l,h,u,new Tt)),r&&(c.uv1=oi.getInterpolatedAttribute(r,o,l,h,u,new Tt)),a&&(c.normal=oi.getInterpolatedAttribute(a,o,l,h,u,new C),c.normal.dot(i.direction)>0&&c.normal.multiplyScalar(-1));const d={a:o,b:l,c:h,normal:new C,materialIndex:0};oi.getNormal(Rs,Cs,Ps,d.normal),c.face=d,c.barycoord=u}return c}class yc extends ke{constructor(t=null,e=1,i=1,n,r,a,o,l,h=Ue,c=Ue,u,d){super(null,a,o,l,h,c,n,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const rn=new hr,bc=new Tt(.5,.5),Ns=new C;class as{constructor(t=new Hi,e=new Hi,i=new Hi,n=new Hi,r=new Hi,a=new Hi){this.planes=[t,e,i,n,r,a]}set(t,e,i,n,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(n),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=fi,i=!1){const n=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],h=r[3],c=r[4],u=r[5],d=r[6],p=r[7],_=r[8],S=r[9],m=r[10],f=r[11],v=r[12],T=r[13],b=r[14],A=r[15];if(n[0].setComponents(h-a,p-c,f-_,A-v).normalize(),n[1].setComponents(h+a,p+c,f+_,A+v).normalize(),n[2].setComponents(h+o,p+u,f+S,A+T).normalize(),n[3].setComponents(h-o,p-u,f-S,A-T).normalize(),i)n[4].setComponents(l,d,m,b).normalize(),n[5].setComponents(h-l,p-d,f-m,A-b).normalize();else if(n[4].setComponents(h-l,p-d,f-m,A-b).normalize(),e===fi)n[5].setComponents(h+l,p+d,f+m,A+b).normalize();else if(e===rs)n[5].setComponents(l,d,m,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),rn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),rn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(rn)}intersectsSprite(t){rn.center.set(0,0,0);const e=bc.distanceTo(t.center);return rn.radius=.7071067811865476+e,rn.applyMatrix4(t.matrixWorld),this.intersectsSphere(rn)}intersectsSphere(t){const e=this.planes,i=t.center,n=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<n)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const n=e[i];if(Ns.x=n.normal.x>0?t.max.x:t.min.x,Ns.y=n.normal.y>0?t.max.y:t.min.y,Ns.z=n.normal.z>0?t.max.z:t.min.z,n.distanceToPoint(Ns)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const ko=new he;class Ka{constructor(){this.coordinateSystem=fi,this._frustums=[],this._count=0}setFromArrayCamera(t){const e=t.cameras,i=this._frustums;for(let n=0;n<e.length;n++){const r=e[n];ko.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),i[n]===void 0&&(i[n]=new as),i[n].setFromProjectionMatrix(ko,r.coordinateSystem,r.reversedDepth)}return this._count=e.length,this}getFrustum(t){return this._frustums[t]}intersectsObject(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsObject(t))return!0;return!1}intersectsSprite(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsSprite(t))return!0;return!1}intersectsSphere(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsSphere(t))return!0;return!1}intersectsBox(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsBox(t))return!0;return!1}containsPoint(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;const e=this._frustums,i=t._frustums;for(let n=0;n<t._count;n++)e[n]===void 0&&(e[n]=new as),e[n].copy(i[n]);return this._count=t._count,this}clone(){return new Ka().copy(this)}}class Dn extends dn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ft(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Go=new he,Pa=new Xl,Us=new hr,Fs=new C;class ts extends Ee{constructor(t=new ge,e=new Dn){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const i=this.geometry,n=this.matrixWorld,r=t.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Us.copy(i.boundingSphere),Us.applyMatrix4(n),Us.radius+=r,t.ray.intersectsSphere(Us)===!1)return;Go.copy(n).invert(),Pa.copy(t.ray).applyMatrix4(Go);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,h=i.index,u=i.attributes.position;if(h!==null){const d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let _=d,S=p;_<S;_++){const m=h.getX(_);Fs.fromBufferAttribute(u,m),Ho(Fs,m,l,n,t,e,this)}}else{const d=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let _=d,S=p;_<S;_++)Fs.fromBufferAttribute(u,_),Ho(Fs,_,l,n,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ho(s,t,e,i,n,r,a){const o=Pa.distanceSqToPoint(s);if(o<e){const l=new C;Pa.closestPointToPoint(s,l),l.applyMatrix4(i);const h=n.ray.origin.distanceTo(l);if(h<n.near||h>n.far)return;r.push({distance:h,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class ql extends ke{constructor(t=[],e=In,i,n,r,a,o,l,h,c){super(t,e,i,n,r,a,o,l,h,c),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class fn extends ke{constructor(t,e,i,n,r,a,o,l,h){super(t,e,i,n,r,a,o,l,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Un extends ke{constructor(t,e,i=yi,n,r,a,o=Ue,l=Ue,h,c=$i,u=1){if(c!==$i&&c!==Xi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,n,r,a,o,l,c,i,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new qa(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}}class Yl extends Un{constructor(t,e=yi,i=In,n,r,a=Ue,o=Ue,l,h=$i){const c={width:t,height:t,depth:1},u=[c,c,c,c,c,c];super(t,t,e,i,n,r,a,o,l,h),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Kl extends ke{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class zn extends ge{constructor(t=1,e=1,i=1,n=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:n,heightSegments:r,depthSegments:a};const o=this;n=Math.floor(n),r=Math.floor(r),a=Math.floor(a);const l=[],h=[],c=[],u=[];let d=0,p=0;_("z","y","x",-1,-1,i,e,t,a,r,0),_("z","y","x",1,-1,i,e,-t,a,r,1),_("x","z","y",1,1,t,i,e,n,a,2),_("x","z","y",1,-1,t,i,-e,n,a,3),_("x","y","z",1,-1,t,e,i,n,r,4),_("x","y","z",-1,-1,t,e,-i,n,r,5),this.setIndex(l),this.setAttribute("position",new Qt(h,3)),this.setAttribute("normal",new Qt(c,3)),this.setAttribute("uv",new Qt(u,2));function _(S,m,f,v,T,b,A,w,g,y,L){const R=b/g,N=A/y,F=b/2,H=A/2,I=w/2,V=g+1,$=y+1;let k=0,et=0;const X=new C;for(let Q=0;Q<$;Q++){const j=Q*N-H;for(let yt=0;yt<V;yt++){const Ot=yt*R-F;X[S]=Ot*v,X[m]=j*T,X[f]=I,h.push(X.x,X.y,X.z),X[S]=0,X[m]=0,X[f]=w>0?1:-1,c.push(X.x,X.y,X.z),u.push(yt/g),u.push(1-Q/y),k+=1}}for(let Q=0;Q<y;Q++)for(let j=0;j<g;j++){const yt=d+j+V*Q,Ot=d+j+V*(Q+1),K=d+(j+1)+V*(Q+1),pt=d+(j+1)+V*Q;l.push(yt,Ot,pt),l.push(Ot,K,pt),et+=6}o.addGroup(p,et,L),p+=et,d+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class De extends ge{constructor(t=1,e=1,i=4,n=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:n,heightSegments:r},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),n=Math.max(3,Math.floor(n)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],h=[],c=e/2,u=Math.PI/2*t,d=e,p=2*u+d,_=i*2+r,S=n+1,m=new C,f=new C;for(let v=0;v<=_;v++){let T=0,b=0,A=0,w=0;if(v<=i){const L=v/i,R=L*Math.PI/2;b=-c-t*Math.cos(R),A=t*Math.sin(R),w=-t*Math.cos(R),T=L*u}else if(v<=i+r){const L=(v-i)/r;b=-c+L*e,A=t,w=0,T=u+L*d}else{const L=(v-i-r)/i,R=L*Math.PI/2;b=c+t*Math.sin(R),A=t*Math.cos(R),w=t*Math.sin(R),T=u+d+L*u}const g=Math.max(0,Math.min(1,T/p));let y=0;v===0?y=.5/n:v===_&&(y=-.5/n);for(let L=0;L<=n;L++){const R=L/n,N=R*Math.PI*2,F=Math.sin(N),H=Math.cos(N);f.x=-A*H,f.y=b,f.z=A*F,o.push(f.x,f.y,f.z),m.set(-A*H,w,A*F),m.normalize(),l.push(m.x,m.y,m.z),h.push(R+y,g)}if(v>0){const L=(v-1)*S;for(let R=0;R<n;R++){const N=L+R,F=L+R+1,H=v*S+R,I=v*S+R+1;a.push(N,F,H),a.push(F,I,H)}}}this.setIndex(a),this.setAttribute("position",new Qt(o,3)),this.setAttribute("normal",new Qt(l,3)),this.setAttribute("uv",new Qt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new De(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Li extends ge{constructor(t=1,e=32,i=0,n=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:n},e=Math.max(3,e);const r=[],a=[],o=[],l=[],h=new C,c=new Tt;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const p=i+u/e*n;h.x=t*Math.cos(p),h.y=t*Math.sin(p),a.push(h.x,h.y,h.z),o.push(0,0,1),c.x=(a[d]/t+1)/2,c.y=(a[d+1]/t+1)/2,l.push(c.x,c.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Qt(a,3)),this.setAttribute("normal",new Qt(o,3)),this.setAttribute("uv",new Qt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Li(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class pi extends ge{constructor(t=1,e=1,i=1,n=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:n,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const h=this;n=Math.floor(n),r=Math.floor(r);const c=[],u=[],d=[],p=[];let _=0;const S=[],m=i/2;let f=0;v(),a===!1&&(t>0&&T(!0),e>0&&T(!1)),this.setIndex(c),this.setAttribute("position",new Qt(u,3)),this.setAttribute("normal",new Qt(d,3)),this.setAttribute("uv",new Qt(p,2));function v(){const b=new C,A=new C;let w=0;const g=(e-t)/i;for(let y=0;y<=r;y++){const L=[],R=y/r,N=R*(e-t)+t;for(let F=0;F<=n;F++){const H=F/n,I=H*l+o,V=Math.sin(I),$=Math.cos(I);A.x=N*V,A.y=-R*i+m,A.z=N*$,u.push(A.x,A.y,A.z),b.set(V,g,$).normalize(),d.push(b.x,b.y,b.z),p.push(H,1-R),L.push(_++)}S.push(L)}for(let y=0;y<n;y++)for(let L=0;L<r;L++){const R=S[L][y],N=S[L+1][y],F=S[L+1][y+1],H=S[L][y+1];(t>0||L!==0)&&(c.push(R,N,H),w+=3),(e>0||L!==r-1)&&(c.push(N,F,H),w+=3)}h.addGroup(f,w,0),f+=w}function T(b){const A=_,w=new Tt,g=new C;let y=0;const L=b===!0?t:e,R=b===!0?1:-1;for(let F=1;F<=n;F++)u.push(0,m*R,0),d.push(0,R,0),p.push(.5,.5),_++;const N=_;for(let F=0;F<=n;F++){const I=F/n*l+o,V=Math.cos(I),$=Math.sin(I);g.x=L*$,g.y=m*R,g.z=L*V,u.push(g.x,g.y,g.z),d.push(0,R,0),w.x=V*.5+.5,w.y=$*.5*R+.5,p.push(w.x,w.y),_++}for(let F=0;F<n;F++){const H=A+F,I=N+F;b===!0?c.push(I,I+1,H):c.push(I+1,I,H),y+=3}h.addGroup(f,y,b===!0?1:2),f+=y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pi(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class os extends pi{constructor(t=1,e=1,i=32,n=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,i,n,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:n,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new os(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Za extends ge{constructor(t=[],e=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:n};const r=[],a=[];o(n),h(i),c(),this.setAttribute("position",new Qt(r,3)),this.setAttribute("normal",new Qt(r.slice(),3)),this.setAttribute("uv",new Qt(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const T=new C,b=new C,A=new C;for(let w=0;w<e.length;w+=3)p(e[w+0],T),p(e[w+1],b),p(e[w+2],A),l(T,b,A,v)}function l(v,T,b,A){const w=A+1,g=[];for(let y=0;y<=w;y++){g[y]=[];const L=v.clone().lerp(b,y/w),R=T.clone().lerp(b,y/w),N=w-y;for(let F=0;F<=N;F++)F===0&&y===w?g[y][F]=L:g[y][F]=L.clone().lerp(R,F/N)}for(let y=0;y<w;y++)for(let L=0;L<2*(w-y)-1;L++){const R=Math.floor(L/2);L%2===0?(d(g[y][R+1]),d(g[y+1][R]),d(g[y][R])):(d(g[y][R+1]),d(g[y+1][R+1]),d(g[y+1][R]))}}function h(v){const T=new C;for(let b=0;b<r.length;b+=3)T.x=r[b+0],T.y=r[b+1],T.z=r[b+2],T.normalize().multiplyScalar(v),r[b+0]=T.x,r[b+1]=T.y,r[b+2]=T.z}function c(){const v=new C;for(let T=0;T<r.length;T+=3){v.x=r[T+0],v.y=r[T+1],v.z=r[T+2];const b=m(v)/2/Math.PI+.5,A=f(v)/Math.PI+.5;a.push(b,1-A)}_(),u()}function u(){for(let v=0;v<a.length;v+=6){const T=a[v+0],b=a[v+2],A=a[v+4],w=Math.max(T,b,A),g=Math.min(T,b,A);w>.9&&g<.1&&(T<.2&&(a[v+0]+=1),b<.2&&(a[v+2]+=1),A<.2&&(a[v+4]+=1))}}function d(v){r.push(v.x,v.y,v.z)}function p(v,T){const b=v*3;T.x=t[b+0],T.y=t[b+1],T.z=t[b+2]}function _(){const v=new C,T=new C,b=new C,A=new C,w=new Tt,g=new Tt,y=new Tt;for(let L=0,R=0;L<r.length;L+=9,R+=6){v.set(r[L+0],r[L+1],r[L+2]),T.set(r[L+3],r[L+4],r[L+5]),b.set(r[L+6],r[L+7],r[L+8]),w.set(a[R+0],a[R+1]),g.set(a[R+2],a[R+3]),y.set(a[R+4],a[R+5]),A.copy(v).add(T).add(b).divideScalar(3);const N=m(A);S(w,R+0,v,N),S(g,R+2,T,N),S(y,R+4,b,N)}}function S(v,T,b,A){A<0&&v.x===1&&(a[T]=v.x-1),b.x===0&&b.z===0&&(a[T]=A/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function f(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Za(t.vertices,t.indices,t.radius,t.detail)}}class $a extends Za{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,n=1/i,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-n,-i,0,-n,i,0,n,-i,0,n,i,-n,-i,0,-n,i,0,n,-i,0,n,i,0,-i,0,-n,i,0,-n,-i,0,n,i,0,n],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new $a(t.radius,t.detail)}}class qe extends ge{constructor(t=1,e=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:n};const r=t/2,a=e/2,o=Math.floor(i),l=Math.floor(n),h=o+1,c=l+1,u=t/o,d=e/l,p=[],_=[],S=[],m=[];for(let f=0;f<c;f++){const v=f*d-a;for(let T=0;T<h;T++){const b=T*u-r;_.push(b,-v,0),S.push(0,0,1),m.push(T/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let v=0;v<o;v++){const T=v+h*f,b=v+h*(f+1),A=v+1+h*(f+1),w=v+1+h*f;p.push(T,b,w),p.push(b,A,w)}this.setIndex(p),this.setAttribute("position",new Qt(_,3)),this.setAttribute("normal",new Qt(S,3)),this.setAttribute("uv",new Qt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qe(t.width,t.height,t.widthSegments,t.heightSegments)}}class Ni extends ge{constructor(t=.5,e=1,i=32,n=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:n,thetaStart:r,thetaLength:a},i=Math.max(3,i),n=Math.max(1,n);const o=[],l=[],h=[],c=[];let u=t;const d=(e-t)/n,p=new C,_=new Tt;for(let S=0;S<=n;S++){for(let m=0;m<=i;m++){const f=r+m/i*a;p.x=u*Math.cos(f),p.y=u*Math.sin(f),l.push(p.x,p.y,p.z),h.push(0,0,1),_.x=(p.x/e+1)/2,_.y=(p.y/e+1)/2,c.push(_.x,_.y)}u+=d}for(let S=0;S<n;S++){const m=S*(i+1);for(let f=0;f<i;f++){const v=f+m,T=v,b=v+i+1,A=v+i+2,w=v+1;o.push(T,b,w),o.push(b,A,w)}}this.setIndex(o),this.setAttribute("position",new Qt(l,3)),this.setAttribute("normal",new Qt(h,3)),this.setAttribute("uv",new Qt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ni(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class cs extends ge{constructor(t=1,e=32,i=16,n=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:n,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let h=0;const c=[],u=new C,d=new C,p=[],_=[],S=[],m=[];for(let f=0;f<=i;f++){const v=[],T=f/i,b=a+T*o,A=t*Math.cos(b),w=Math.sqrt(t*t-A*A);let g=0;f===0&&a===0?g=.5/e:f===i&&l===Math.PI&&(g=-.5/e);for(let y=0;y<=e;y++){const L=y/e,R=n+L*r;u.x=-w*Math.cos(R),u.y=A,u.z=w*Math.sin(R),_.push(u.x,u.y,u.z),d.copy(u).normalize(),S.push(d.x,d.y,d.z),m.push(L+g,1-T),v.push(h++)}c.push(v)}for(let f=0;f<i;f++)for(let v=0;v<e;v++){const T=c[f][v+1],b=c[f][v],A=c[f+1][v],w=c[f+1][v+1];(f!==0||a>0)&&p.push(T,b,w),(f!==i-1||l<Math.PI)&&p.push(b,A,w)}this.setIndex(p),this.setAttribute("position",new Qt(_,3)),this.setAttribute("normal",new Qt(S,3)),this.setAttribute("uv",new Qt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new cs(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Ci extends ge{constructor(t=1,e=.4,i=12,n=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:n,arc:r,thetaStart:a,thetaLength:o},i=Math.floor(i),n=Math.floor(n);const l=[],h=[],c=[],u=[],d=new C,p=new C,_=new C;for(let S=0;S<=i;S++){const m=a+S/i*o;for(let f=0;f<=n;f++){const v=f/n*r;p.x=(t+e*Math.cos(m))*Math.cos(v),p.y=(t+e*Math.cos(m))*Math.sin(v),p.z=e*Math.sin(m),h.push(p.x,p.y,p.z),d.x=t*Math.cos(v),d.y=t*Math.sin(v),_.subVectors(p,d).normalize(),c.push(_.x,_.y,_.z),u.push(f/n),u.push(S/i)}}for(let S=1;S<=i;S++)for(let m=1;m<=n;m++){const f=(n+1)*S+m-1,v=(n+1)*(S-1)+m-1,T=(n+1)*(S-1)+m,b=(n+1)*S+m;l.push(f,v,b),l.push(v,T,b)}this.setIndex(l),this.setAttribute("position",new Qt(h,3)),this.setAttribute("normal",new Qt(c,3)),this.setAttribute("uv",new Qt(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ci(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}}function Fn(s){const t={};for(const e in s){t[e]={};for(const i in s[e]){const n=s[e][i];if(Vo(n))n.isRenderTargetTexture?(It("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=n.clone();else if(Array.isArray(n))if(Vo(n[0])){const r=[];for(let a=0,o=n.length;a<o;a++)r[a]=n[a].clone();t[e][i]=r}else t[e][i]=n.slice();else t[e][i]=n}}return t}function Ve(s){const t={};for(let e=0;e<s.length;e++){const i=Fn(s[e]);for(const n in i)t[n]=i[n]}return t}function Vo(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function Ec(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Zl(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Kt.workingColorSpace}const ls={clone:Fn,merge:Ve};var wc=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Tc=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ke extends dn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=wc,this.fragmentShader=Tc,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Fn(t.uniforms),this.uniformsGroups=Ec(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const n in this.uniforms){const a=this.uniforms[n].value;a&&a.isTexture?e.uniforms[n]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[n]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[n]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[n]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[n]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[n]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[n]={type:"m4",value:a.toArray()}:e.uniforms[n]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const i in t.uniforms){const n=t.uniforms[i];switch(this.uniforms[i]={},n.type){case"t":this.uniforms[i].value=e[n.value]||null;break;case"c":this.uniforms[i].value=new Ft().setHex(n.value);break;case"v2":this.uniforms[i].value=new Tt().fromArray(n.value);break;case"v3":this.uniforms[i].value=new C().fromArray(n.value);break;case"v4":this.uniforms[i].value=new me().fromArray(n.value);break;case"m3":this.uniforms[i].value=new Ut().fromArray(n.value);break;case"m4":this.uniforms[i].value=new he().fromArray(n.value);break;default:this.uniforms[i].value=n.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class $l extends Ke{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ac extends dn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ft(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ft(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ra,this.normalScale=new Tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ji,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Rc extends dn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=kh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Cc extends dn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Ja extends Ee{static registerNode(t){this.prototype._lightNode=t}constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ft(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class Pc extends Ja{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ft(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const kr=new he,Wo=new C,Xo=new C;class Jl{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Tt(512,512),this.mapType=je,this.map=null,this.mapPass=null,this.matrix=new he,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new as,this._frameExtents=new Tt(1,1),this._viewportCount=1,this._viewports=[new me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera;Wo.setFromMatrixPosition(t.matrixWorld),e.position.copy(Wo),Xo.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Xo),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,i,n){kr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),i.setFromProjectionMatrix(kr,t.coordinateSystem,t.reversedDepth);const r=this._frameExtents,a=n?n.z/r.x:1,o=n?n.w/r.y:1,l=n?n.x/r.x:0,h=n?n.y/r.y:0;t.coordinateSystem===rs||t.reversedDepth?e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+h,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+h,0,0,.5,.5,0,0,0,1),e.multiply(kr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.mapType=t.mapType,this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.mapType=this.mapType,t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Os=new C,Bs=new Bn,gi=new C;class Ql extends Ee{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new he,this.projectionMatrix=new he,this.projectionMatrixInverse=new he,this.coordinateSystem=fi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Os,Bs,gi),gi.x===1&&gi.y===1&&gi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Os,Bs,gi.set(1,1,1)).invert()}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(Os,Bs,gi),gi.x===1&&gi.y===1&&gi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Os,Bs,gi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Gi=new C,qo=new Tt,Yo=new Tt;class ai extends Ql{constructor(t=50,e=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ca*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(_r*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ca*2*Math.atan(Math.tan(_r*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Gi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Gi.x,Gi.y).multiplyScalar(-t/Gi.z),Gi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Gi.x,Gi.y).multiplyScalar(-t/Gi.z)}getViewSize(t,e){return this.getViewBounds(t,qo,Yo),e.subVectors(Yo,qo)}setViewOffset(t,e,i,n,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(_r*.5*this.fov)/this.zoom,i=2*e,n=this.aspect*i,r=-.5*n;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,h=a.fullHeight;r+=a.offsetX*n/l,e-=a.offsetY*i/h,n*=a.width/l,i*=a.height/h}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+n,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class Lc extends Jl{constructor(){super(new ai(90,1,.5,500)),this.isPointLightShadow=!0}}class Qa extends Ja{constructor(t,e,i=0,n=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new Lc}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class ja extends Ql{constructor(t=-1,e=1,i=1,n=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=n,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,n,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let r=i-t,a=i+t,o=n+e,l=n-e;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=c*this.view.offsetY,l=o-c*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Dc extends Jl{constructor(){super(new ja(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class $n extends Ja{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.target=new Ee,this.shadow=new Dc}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}const Rn=-90,Cn=1;class La extends Ee{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new ai(Rn,Cn,t,e);n.layers=this.layers,this.add(n);const r=new ai(Rn,Cn,t,e);r.layers=this.layers,this.add(r);const a=new ai(Rn,Cn,t,e);a.layers=this.layers,this.add(a);const o=new ai(Rn,Cn,t,e);o.layers=this.layers,this.add(o);const l=new ai(Rn,Cn,t,e);l.layers=this.layers,this.add(l);const h=new ai(Rn,Cn,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,n,r,a,o,l]=e;for(const h of e)this.remove(h);if(t===fi)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===rs)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,h,c]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;const S=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(i,0,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(i,1,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,2,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,3,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(i,4,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),i.texture.mipmapsAutoUpdate=S,t.setRenderTarget(i,5,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),t.setRenderTarget(u,d,p),t.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class Ic extends ai{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t,this.perCameraFrustumCulled=!1}}class Nc{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=Uc.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function Uc(){this._document.hidden===!1&&this.reset()}class Fc{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,It("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Ko(s,t,e,i){const n=Oc(i);switch(e){case Cl:return s*t;case Ll:return s*t/n.components*n.byteLength;case Va:return s*t/n.components*n.byteLength;case hn:return s*t*2/n.components*n.byteLength;case Wa:return s*t*2/n.components*n.byteLength;case Pl:return s*t*3/n.components*n.byteLength;case Si:return s*t*4/n.components*n.byteLength;case Xa:return s*t*4/n.components*n.byteLength;case Xs:case qs:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Ys:case Ks:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case jr:case ea:return Math.max(s,16)*Math.max(t,8)/4;case Qr:case ta:return Math.max(s,8)*Math.max(t,8)/2;case ia:case na:case ra:case aa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case sa:case Qs:case oa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case la:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case ha:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case ca:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case ua:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case da:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case fa:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case pa:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case ma:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case ga:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case _a:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case xa:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case va:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Ma:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case Sa:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case ya:case ba:case Ea:return Math.ceil(s/4)*Math.ceil(t/4)*16;case wa:case Ta:return Math.ceil(s/4)*Math.ceil(t/4)*8;case js:case Aa:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Oc(s){switch(s){case je:case wl:return{byteLength:1,components:1};case ss:case Tl:case Ze:return{byteLength:2,components:1};case Ga:case Ha:return{byteLength:2,components:4};case yi:case ka:case Mi:return{byteLength:4,components:1};case Al:case Rl:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ia}}));typeof window<"u"&&(window.__THREE__?It("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ia);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function jl(){let s=null,t=!1,e=null,i=null;function n(r,a){i=s.requestAnimationFrame(n),e(r,a)}return{start:function(){t!==!0&&e!==null&&s!==null&&(i=s.requestAnimationFrame(n),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function Bc(s){const t=new WeakMap;function e(o,l){const h=o.array,c=o.usage,u=h.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,h,c),o.onUploadCallback();let p;if(h instanceof Float32Array)p=s.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)p=s.HALF_FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?p=s.HALF_FLOAT:p=s.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=s.SHORT;else if(h instanceof Uint32Array)p=s.UNSIGNED_INT;else if(h instanceof Int32Array)p=s.INT;else if(h instanceof Int8Array)p=s.BYTE;else if(h instanceof Uint8Array)p=s.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:d,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,h){const c=l.array,u=l.updateRanges;if(s.bindBuffer(h,o),u.length===0)s.bufferSubData(h,0,c);else{u.sort((p,_)=>p.start-_.start);let d=0;for(let p=1;p<u.length;p++){const _=u[d],S=u[p];S.start<=_.start+_.count+1?_.count=Math.max(_.count,S.start+S.count-_.start):(++d,u[d]=S)}u.length=d+1;for(let p=0,_=u.length;p<_;p++){const S=u[p];s.bufferSubData(h,S.start*c.BYTES_PER_ELEMENT,c,S.start,S.count)}l.clearUpdateRanges()}l.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(s.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const c=t.get(o);(!c||c.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const h=t.get(o);if(h===void 0)t.set(o,e(o,l));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,o,l),h.version=o.version}}return{get:n,remove:r,update:a}}var zc=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,kc=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Gc=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Hc=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vc=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Wc=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Xc=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,qc=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Yc=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Kc=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Zc=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,$c=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Jc=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Qc=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,jc=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,tu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,eu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,iu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,nu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,su=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,ru=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,au=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,ou=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,lu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,hu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,cu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,uu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,du=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,fu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,pu="gl_FragColor = linearToOutputTexel( gl_FragColor );",mu=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,gu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,_u=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,xu=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,vu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Mu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Su=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,yu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Eu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,wu=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Tu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Au=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ru=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Cu=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Pu=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Lu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Du=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Iu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Nu=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Uu=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Fu=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ou=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Bu=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,zu=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ku=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Gu=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Hu=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vu=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wu=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Xu=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,qu=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Yu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ku=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zu=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$u=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ju=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Qu=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ju=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,td=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ed=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,id=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,nd=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,sd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,rd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ad=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,od=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,ld=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,hd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,cd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ud=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,dd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,fd=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,pd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,md=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,gd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,_d=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,xd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,vd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Md=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Sd=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,yd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,bd=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Ed=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,wd=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Td=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ad=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Rd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Cd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Pd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ld=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Dd=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Id=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Nd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ud=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Fd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Od=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Bd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,zd=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Gd=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Vd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Xd=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,qd=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Yd=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Kd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Zd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$d=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Jd=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Qd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,jd=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tf=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ef=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nf=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,sf=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,af=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,of=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lf=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,cf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,uf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,df=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ff=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,pf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,mf=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gf=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_f=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,xf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Vt={alphahash_fragment:zc,alphahash_pars_fragment:kc,alphamap_fragment:Gc,alphamap_pars_fragment:Hc,alphatest_fragment:Vc,alphatest_pars_fragment:Wc,aomap_fragment:Xc,aomap_pars_fragment:qc,batching_pars_vertex:Yc,batching_vertex:Kc,begin_vertex:Zc,beginnormal_vertex:$c,bsdfs:Jc,iridescence_fragment:Qc,bumpmap_pars_fragment:jc,clipping_planes_fragment:tu,clipping_planes_pars_fragment:eu,clipping_planes_pars_vertex:iu,clipping_planes_vertex:nu,color_fragment:su,color_pars_fragment:ru,color_pars_vertex:au,color_vertex:ou,common:lu,defaultnormal_vertex:hu,displacementmap_pars_vertex:cu,displacementmap_vertex:uu,emissivemap_fragment:du,emissivemap_pars_fragment:fu,colorspace_fragment:pu,colorspace_pars_fragment:mu,envmap_fragment:gu,envmap_common_pars_fragment:_u,envmap_pars_fragment:xu,envmap_pars_vertex:vu,envmap_physical_pars_fragment:Pu,envmap_vertex:Mu,fog_vertex:Su,fog_pars_vertex:yu,fog_fragment:bu,fog_pars_fragment:Eu,gradientmap_pars_fragment:wu,lightmap_pars_fragment:Tu,lights_lambert_fragment:Au,lights_lambert_pars_fragment:Ru,lights_pars_begin:Cu,lights_toon_fragment:Lu,lights_toon_pars_fragment:Du,lights_phong_fragment:Iu,lights_phong_pars_fragment:Nu,lights_physical_fragment:Uu,lights_physical_pars_fragment:Fu,lights_fragment_begin:Ou,lights_fragment_maps:Bu,lights_fragment_end:zu,lightprobes_pars_fragment:ku,logdepthbuf_fragment:Gu,logdepthbuf_pars_fragment:Hu,logdepthbuf_pars_vertex:Vu,logdepthbuf_vertex:Wu,map_fragment:Xu,map_pars_fragment:qu,map_particle_fragment:Yu,map_particle_pars_fragment:Ku,metalnessmap_fragment:Zu,metalnessmap_pars_fragment:$u,morphinstance_vertex:Ju,morphcolor_vertex:Qu,morphnormal_vertex:ju,morphtarget_pars_vertex:td,morphtarget_vertex:ed,normal_fragment_begin:id,normal_fragment_maps:nd,normal_pars_fragment:sd,normal_pars_vertex:rd,normal_vertex:ad,normalmap_pars_fragment:od,clearcoat_normal_fragment_begin:ld,clearcoat_normal_fragment_maps:hd,clearcoat_pars_fragment:cd,iridescence_pars_fragment:ud,opaque_fragment:dd,packing:fd,premultiplied_alpha_fragment:pd,project_vertex:md,dithering_fragment:gd,dithering_pars_fragment:_d,roughnessmap_fragment:xd,roughnessmap_pars_fragment:vd,shadowmap_pars_fragment:Md,shadowmap_pars_vertex:Sd,shadowmap_vertex:yd,shadowmask_pars_fragment:bd,skinbase_vertex:Ed,skinning_pars_vertex:wd,skinning_vertex:Td,skinnormal_vertex:Ad,specularmap_fragment:Rd,specularmap_pars_fragment:Cd,tonemapping_fragment:Pd,tonemapping_pars_fragment:Ld,transmission_fragment:Dd,transmission_pars_fragment:Id,uv_pars_fragment:Nd,uv_pars_vertex:Ud,uv_vertex:Fd,worldpos_vertex:Od,background_vert:Bd,background_frag:zd,backgroundCube_vert:kd,backgroundCube_frag:Gd,cube_vert:Hd,cube_frag:Vd,depth_vert:Wd,depth_frag:Xd,distance_vert:qd,distance_frag:Yd,equirect_vert:Kd,equirect_frag:Zd,linedashed_vert:$d,linedashed_frag:Jd,meshbasic_vert:Qd,meshbasic_frag:jd,meshlambert_vert:tf,meshlambert_frag:ef,meshmatcap_vert:nf,meshmatcap_frag:sf,meshnormal_vert:rf,meshnormal_frag:af,meshphong_vert:of,meshphong_frag:lf,meshphysical_vert:hf,meshphysical_frag:cf,meshtoon_vert:uf,meshtoon_frag:df,points_vert:ff,points_frag:pf,shadow_vert:mf,shadow_frag:gf,sprite_vert:_f,sprite_frag:xf},ft={common:{diffuse:{value:new Ft(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ut},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ut}},envmap:{envMap:{value:null},envMapRotation:{value:new Ut},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ut}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ut}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ut},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ut},normalScale:{value:new Tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ut},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ut}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ut}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ut}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ft(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Ft(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0},uvTransform:{value:new Ut}},sprite:{diffuse:{value:new Ft(16777215)},opacity:{value:1},center:{value:new Tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ut},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0}}},xi={basic:{uniforms:Ve([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.fog]),vertexShader:Vt.meshbasic_vert,fragmentShader:Vt.meshbasic_frag},lambert:{uniforms:Ve([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new Ft(0)},envMapIntensity:{value:1}}]),vertexShader:Vt.meshlambert_vert,fragmentShader:Vt.meshlambert_frag},phong:{uniforms:Ve([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new Ft(0)},specular:{value:new Ft(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Vt.meshphong_vert,fragmentShader:Vt.meshphong_frag},standard:{uniforms:Ve([ft.common,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.roughnessmap,ft.metalnessmap,ft.fog,ft.lights,{emissive:{value:new Ft(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag},toon:{uniforms:Ve([ft.common,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.gradientmap,ft.fog,ft.lights,{emissive:{value:new Ft(0)}}]),vertexShader:Vt.meshtoon_vert,fragmentShader:Vt.meshtoon_frag},matcap:{uniforms:Ve([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,{matcap:{value:null}}]),vertexShader:Vt.meshmatcap_vert,fragmentShader:Vt.meshmatcap_frag},points:{uniforms:Ve([ft.points,ft.fog]),vertexShader:Vt.points_vert,fragmentShader:Vt.points_frag},dashed:{uniforms:Ve([ft.common,ft.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Vt.linedashed_vert,fragmentShader:Vt.linedashed_frag},depth:{uniforms:Ve([ft.common,ft.displacementmap]),vertexShader:Vt.depth_vert,fragmentShader:Vt.depth_frag},normal:{uniforms:Ve([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,{opacity:{value:1}}]),vertexShader:Vt.meshnormal_vert,fragmentShader:Vt.meshnormal_frag},sprite:{uniforms:Ve([ft.sprite,ft.fog]),vertexShader:Vt.sprite_vert,fragmentShader:Vt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ut},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Vt.background_vert,fragmentShader:Vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ut}},vertexShader:Vt.backgroundCube_vert,fragmentShader:Vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Vt.cube_vert,fragmentShader:Vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Vt.equirect_vert,fragmentShader:Vt.equirect_frag},distance:{uniforms:Ve([ft.common,ft.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Vt.distance_vert,fragmentShader:Vt.distance_frag},shadow:{uniforms:Ve([ft.lights,ft.fog,{color:{value:new Ft(0)},opacity:{value:1}}]),vertexShader:Vt.shadow_vert,fragmentShader:Vt.shadow_frag}};xi.physical={uniforms:Ve([xi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ut},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ut},clearcoatNormalScale:{value:new Tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ut},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Ut},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ut},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ut},sheen:{value:0},sheenColor:{value:new Ft(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ut},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ut},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ut},transmissionSamplerSize:{value:new Tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ut},attenuationDistance:{value:0},attenuationColor:{value:new Ft(0)},specularColor:{value:new Ft(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ut},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ut},anisotropyVector:{value:new Tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ut}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag};const zs={r:0,b:0,g:0},vf=new he,th=new Ut;th.set(-1,0,0,0,1,0,0,0,1);function Mf(s,t,e,i,n,r){const a=new Ft(0);let o=n===!0?0:1,l,h,c=null,u=0,d=null;function p(v){let T=v.isScene===!0?v.background:null;if(T&&T.isTexture){const b=v.backgroundBlurriness>0;T=t.get(T,b)}return T}function _(v){let T=!1;const b=p(v);b===null?m(a,o):b&&b.isColor&&(m(b,1),T=!0);const A=s.xr.getEnvironmentBlendMode();A==="additive"?e.buffers.color.setClear(0,0,0,1,r):A==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||T)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function S(v,T){const b=p(T);b&&b.isCubeTexture?(h===void 0&&(h=new _t(new zn(1,1,1),new Ke({name:"BackgroundCubeMaterial",uniforms:Fn(xi.backgroundCube.uniforms),vertexShader:xi.backgroundCube.vertexShader,fragmentShader:xi.backgroundCube.fragmentShader,side:We,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,w,g){this.matrixWorld.copyPosition(g.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=b,h.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(vf.makeRotationFromEuler(T.backgroundRotation)).transpose(),b.isRenderTargetTexture===!1&&h.material.uniforms.backgroundRotation.value.premultiply(th),h.material.toneMapped=Kt.getTransfer(b.colorSpace)!==ee,(c!==b||u!==b.version||d!==s.toneMapping)&&(h.material.needsUpdate=!0,c=b,u=b.version,d=s.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):b&&b.isTexture&&(l===void 0&&(l=new _t(new qe(2,2),new Ke({name:"BackgroundMaterial",uniforms:Fn(xi.background.uniforms),vertexShader:xi.background.vertexShader,fragmentShader:xi.background.fragmentShader,side:Zi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=b,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=Kt.getTransfer(b.colorSpace)!==ee,b.matrixAutoUpdate===!0&&b.updateMatrix(),l.material.uniforms.uvTransform.value.copy(b.matrix),(c!==b||u!==b.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,c=b,u=b.version,d=s.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function m(v,T){v.getRGB(zs,Zl(s)),e.buffers.color.setClear(zs.r,zs.g,zs.b,T,r)}function f(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,T=1){a.set(v),o=T,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,m(a,o)},render:_,addToRenderList:S,dispose:f}}function Sf(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},n=d(null);let r=n,a=!1;function o(N,F,H,I,V){let $=!1;const k=u(N,I,H,F);r!==k&&(r=k,h(r.object)),$=p(N,I,H,V),$&&_(N,I,H,V),V!==null&&t.update(V,s.ELEMENT_ARRAY_BUFFER),($||a)&&(a=!1,b(N,F,H,I),V!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(V).buffer))}function l(){return s.createVertexArray()}function h(N){return s.bindVertexArray(N)}function c(N){return s.deleteVertexArray(N)}function u(N,F,H,I){const V=I.wireframe===!0;let $=i[F.id];$===void 0&&($={},i[F.id]=$);const k=N.isInstancedMesh===!0?N.id:0;let et=$[k];et===void 0&&(et={},$[k]=et);let X=et[H.id];X===void 0&&(X={},et[H.id]=X);let Q=X[V];return Q===void 0&&(Q=d(l()),X[V]=Q),Q}function d(N){const F=[],H=[],I=[];for(let V=0;V<e;V++)F[V]=0,H[V]=0,I[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:H,attributeDivisors:I,object:N,attributes:{},index:null}}function p(N,F,H,I){const V=r.attributes,$=F.attributes;let k=0;const et=H.getAttributes();for(const X in et)if(et[X].location>=0){const j=V[X];let yt=$[X];if(yt===void 0&&(X==="instanceMatrix"&&N.instanceMatrix&&(yt=N.instanceMatrix),X==="instanceColor"&&N.instanceColor&&(yt=N.instanceColor)),j===void 0||j.attribute!==yt||yt&&j.data!==yt.data)return!0;k++}return r.attributesNum!==k||r.index!==I}function _(N,F,H,I){const V={},$=F.attributes;let k=0;const et=H.getAttributes();for(const X in et)if(et[X].location>=0){let j=$[X];j===void 0&&(X==="instanceMatrix"&&N.instanceMatrix&&(j=N.instanceMatrix),X==="instanceColor"&&N.instanceColor&&(j=N.instanceColor));const yt={};yt.attribute=j,j&&j.data&&(yt.data=j.data),V[X]=yt,k++}r.attributes=V,r.attributesNum=k,r.index=I}function S(){const N=r.newAttributes;for(let F=0,H=N.length;F<H;F++)N[F]=0}function m(N){f(N,0)}function f(N,F){const H=r.newAttributes,I=r.enabledAttributes,V=r.attributeDivisors;H[N]=1,I[N]===0&&(s.enableVertexAttribArray(N),I[N]=1),V[N]!==F&&(s.vertexAttribDivisor(N,F),V[N]=F)}function v(){const N=r.newAttributes,F=r.enabledAttributes;for(let H=0,I=F.length;H<I;H++)F[H]!==N[H]&&(s.disableVertexAttribArray(H),F[H]=0)}function T(N,F,H,I,V,$,k){k===!0?s.vertexAttribIPointer(N,F,H,V,$):s.vertexAttribPointer(N,F,H,I,V,$)}function b(N,F,H,I){S();const V=I.attributes,$=H.getAttributes(),k=F.defaultAttributeValues;for(const et in $){const X=$[et];if(X.location>=0){let Q=V[et];if(Q===void 0&&(et==="instanceMatrix"&&N.instanceMatrix&&(Q=N.instanceMatrix),et==="instanceColor"&&N.instanceColor&&(Q=N.instanceColor)),Q!==void 0){const j=Q.normalized,yt=Q.itemSize,Ot=t.get(Q);if(Ot===void 0)continue;const K=Ot.buffer,pt=Ot.type,vt=Ot.bytesPerElement,Ct=pt===s.INT||pt===s.UNSIGNED_INT||Q.gpuType===ka;if(Q.isInterleavedBufferAttribute){const mt=Q.data,kt=mt.isInterleavedBuffer===!0?mt.stride:mt.itemSize,_e=Q.offset;if(mt.isInstancedInterleavedBuffer||mt.isInstancedBufferAttribute){for(let Dt=0;Dt<X.locationSize;Dt++)f(X.location+Dt,mt.meshPerAttribute);N.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=mt.meshPerAttribute*mt.count)}else for(let Dt=0;Dt<X.locationSize;Dt++)m(X.location+Dt);s.bindBuffer(s.ARRAY_BUFFER,K);for(let Dt=0;Dt<X.locationSize;Dt++)T(X.location+Dt,yt/X.locationSize,pt,j,kt*vt,(_e+yt/X.locationSize*Dt)*vt,Ct)}else{if(Q.isInstancedBufferAttribute){for(let mt=0;mt<X.locationSize;mt++)f(X.location+mt,Q.meshPerAttribute);N.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let mt=0;mt<X.locationSize;mt++)m(X.location+mt);s.bindBuffer(s.ARRAY_BUFFER,K);for(let mt=0;mt<X.locationSize;mt++)T(X.location+mt,yt/X.locationSize,pt,j,yt*vt,yt/X.locationSize*mt*vt,Ct)}}else if(k!==void 0){const j=k[et];if(j!==void 0)switch(j.length){case 2:s.vertexAttrib2fv(X.location,j);break;case 3:s.vertexAttrib3fv(X.location,j);break;case 4:s.vertexAttrib4fv(X.location,j);break;default:s.vertexAttrib1fv(X.location,j)}}}}v()}function A(){L();for(const N in i){const F=i[N];for(const H in F){const I=F[H];for(const V in I){const $=I[V];for(const k in $)c($[k].object),delete $[k];delete I[V]}}delete i[N]}}function w(N){if(i[N.id]===void 0)return;const F=i[N.id];for(const H in F){const I=F[H];for(const V in I){const $=I[V];for(const k in $)c($[k].object),delete $[k];delete I[V]}}delete i[N.id]}function g(N){for(const F in i){const H=i[F];for(const I in H){const V=H[I];if(V[N.id]===void 0)continue;const $=V[N.id];for(const k in $)c($[k].object),delete $[k];delete V[N.id]}}}function y(N){for(const F in i){const H=i[F],I=N.isInstancedMesh===!0?N.id:0,V=H[I];if(V!==void 0){for(const $ in V){const k=V[$];for(const et in k)c(k[et].object),delete k[et];delete V[$]}delete H[I],Object.keys(H).length===0&&delete i[F]}}}function L(){R(),a=!0,r!==n&&(r=n,h(r.object))}function R(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:L,resetDefaultState:R,dispose:A,releaseStatesOfGeometry:w,releaseStatesOfObject:y,releaseStatesOfProgram:g,initAttributes:S,enableAttribute:m,disableUnusedAttributes:v}}function yf(s,t,e){let i;function n(l){i=l}function r(l,h){s.drawArrays(i,l,h),e.update(h,i,1)}function a(l,h,c){c!==0&&(s.drawArraysInstanced(i,l,h,c),e.update(h,i,c))}function o(l,h,c){if(c===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,c);let d=0;for(let p=0;p<c;p++)d+=h[p];e.update(d,i,1)}this.setMode=n,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function bf(s,t,e,i){let n;function r(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const g=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(g.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(g){return!(g!==Si&&i.convert(g)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(g){const y=g===Ze&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(g!==je&&g!==Mi&&!y&&i.convert(g)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(g){if(g==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";g="mediump"}return g==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=e.precision!==void 0?e.precision:"highp";const c=l(h);c!==h&&(It("WebGLRenderer:",h,"not supported, using",c,"instead."),h=c);const u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),d=e.logarithmicDepthBuffer===!0&&u===!1;e.reversedDepthBuffer===!0&&u===!1&&It("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),e.logarithmicDepthBuffer===!0&&u===!0&&It("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const p=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),f=s.getParameter(s.MAX_VERTEX_ATTRIBS),v=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),T=s.getParameter(s.MAX_VARYING_VECTORS),b=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),A=s.getParameter(s.MAX_SAMPLES),w=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:_,maxTextureSize:S,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:v,maxVaryings:T,maxFragmentUniforms:b,maxSamples:A,samples:w}}function Ef(s){const t=this;let e=null,i=0,n=!1,r=!1;const a=new Hi,o=new Ut,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const p=u.length!==0||d||i!==0||n;return n=d,i=u.length,p},this.beginShadows=function(){r=!0,c(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=c(u,d,0)},this.setState=function(u,d,p){const _=u.clippingPlanes,S=u.clipIntersection,m=u.clipShadows,f=s.get(u);if(!n||_===null||_.length===0||r&&!m)r?c(null):h();else{const v=r?0:i,T=v*4;let b=f.clippingState||null;l.value=b,b=c(_,d,T,p);for(let A=0;A!==T;++A)b[A]=e[A];f.clippingState=b,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=v}};function h(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function c(u,d,p,_){const S=u!==null?u.length:0;let m=null;if(S!==0){if(m=l.value,_!==!0||m===null){const f=p+S*4,v=d.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<f)&&(m=new Float32Array(f));for(let T=0,b=p;T!==S;++T,b+=4)a.copy(u[T]).applyMatrix4(v,o),a.normal.toArray(m,b),m[b+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=S,t.numIntersection=0,m}}class to extends $e{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},n=[i,i,i,i,i,i];this.texture=new ql(n),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},n=new zn(5,5,5),r=new Ke({name:"CubemapFromEquirect",uniforms:Fn(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:We,blending:on});r.uniforms.tEquirect.value=e;const a=new _t(n,r),o=e.minFilter;return e.minFilter===Wi&&(e.minFilter=Ye),new La(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,n=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,n);t.setRenderTarget(r)}}const Zo=256,wf=3,Tf=20,eh=256,ih=16,Af=3,Rf=new C,Cf=new Ft;class rr{constructor(t){this._renderer=t,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new La(1,10,null),this._boxMesh=new _t(new zn(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(t,e=0,i=.1,n=100,r={}){const{size:a=256,position:o=Rf}=r,l=this._renderer;this._setSize(a);const h=this._allocateTarget(),c=this._getSourceTarget(!0);e>0&&(c.texture.mipmapsAutoUpdate=!1);const u=l.autoClear,d=l.autoClearColor,p=l.autoClearDepth,_=l.autoClearStencil,S=t.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,S===null&&(t.background=l.getClearColor(Cf));const m=new La(i,n,c);return m.position.copy(o),m.update(l,t),l.autoClear=u,l.autoClearColor=d,l.autoClearDepth=p,l.autoClearStencil=_,t.background=S,e>0&&(c.texture.mipmapsAutoUpdate=!0,this._blur(h,e)),this._applyPMREM(h),h}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Qo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Jo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(t,e){return e>0?1-Math.sqrt(1-t/e):0}_setSize(t){this._cubeSize=Math.max(Zo,jh(t))}_fromTexture(t,e){t.mapping===In||t.mapping===is?this._setSize(t.image.length===0?Zo:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4);const i=e||this._allocateTarget();return this._textureToCubemap(t),this._applyPMREM(i),i}_allocateTarget(){const t=this._cubeSize,e=$o(t,!1,!1),i=Math.log2(t)-wf;for(let n=0;n<=i;n++)e.texture.mipmaps.push({width:t>>n,height:t>>n});return e.texture.name="PMREM",e.texture.isPMREMTexture=!0,e}_getSourceTarget(t=!1){const e=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==e||t&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=$o(e,!0,t)),this._sourceTarget}_compileMaterial(t){this._boxMesh.material=t,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(t,e,i){const n=this._boxMesh,r=this._cubeCamera;n.material=i,r.renderTarget=t,r.activeMipmapLevel=e;const a=t.width>>e;t.viewport.set(0,0,a,a),r.update(this._renderer,n),t.viewport.set(0,0,t.width,t.height)}_textureToCubemap(t){let e;t.mapping===In||t.mapping===is?(this._cubemapMaterial===null&&(this._cubemapMaterial=Qo()),e=this._cubemapMaterial,e.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Jo()),e=this._equirectMaterial),e.uniforms.envMap.value=t,this._renderCube(this._getSourceTarget(),0,e)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=Pf(),this._integrationMaterial=Lf());const e=this._cubeSize,i=t.texture.mipmaps.length-1,n=this._ggxMaterial.uniforms;n.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(e/ih);for(let a=0;a<=i;a++){const o=rr.lodToRoughness(a,i);if(a>i-Af)r.roughness.value=o,this._renderCube(t,a,this._integrationMaterial);else{const l=o>0?Math.log2(e)+.5*Math.log2(6/(eh*Math.pow(o,4)))+.5:0;n.roughness.value=o,n.lodBias.value=l,this._renderCube(t,a,this._ggxMaterial)}}}_blur(t,e){this._blurMaterial===null&&(this._blurMaterial=Df());const i=this._blurMaterial,n=i.uniforms,r=this._sourceTarget;n.sigma.value=Math.min(e,Math.PI)/Math.SQRT2,n.envMap.value=r.texture,this._renderCube(t,0,i),n.envMap.value=t.texture,this._renderCube(r,0,i)}}function $o(s,t,e){return new to(s,{minFilter:Wi,generateMipmaps:t,type:Ze,colorSpace:tr,depthBuffer:e})}function us(s,t,e){return new Ke({name:s,uniforms:t,vertexShader:Vt.cube_vert,fragmentShader:e,side:We,blending:on,depthTest:!1,depthWrite:!1})}function Pf(){return us("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${eh}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Lf(){return us("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:ih}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Df(){return us("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Tf}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Jo(){return us("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Qo(){return us("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function If(s){let t=new WeakMap,e=new WeakMap,i=null;function n(d,p=!1){return d==null?null:p?a(d):r(d)}function r(d){if(d&&d.isTexture){const p=d.mapping;if(p===Ws||p===pr)if(t.has(d)){const _=t.get(d).texture;return o(_,d.mapping)}else{const _=d.image;if(_&&_.height>0){const S=new to(_.height);return S.fromEquirectangularTexture(s,d),t.set(d,S),d.addEventListener("dispose",h),o(S.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture&&d.isPMREMTexture!==!0){const p=d.mapping,_=p===Ws||p===pr,S=p===In||p===is;if(_||S){let m=e.get(d);const f=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==f)return i===null&&(i=new rr(s)),m=_?i.fromEquirectangular(d,m):i.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),m.texture;if(m!==void 0)return m.texture;{const v=d.image;return _&&v&&v.height>0||S&&v&&l(v)?(i===null&&(i=new rr(s)),m=_?i.fromEquirectangular(d):i.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),d.addEventListener("dispose",c),m.texture):null}}}return d}function o(d,p){return p===Ws?d.mapping=In:p===pr&&(d.mapping=is),d}function l(d){let p=0;const _=6;for(let S=0;S<_;S++)d[S]!==void 0&&p++;return p===_}function h(d){const p=d.target;p.removeEventListener("dispose",h);const _=t.get(p);_!==void 0&&(t.delete(p),_.dispose())}function c(d){const p=d.target;p.removeEventListener("dispose",c);const _=e.get(p);_!==void 0&&(e.delete(p),_.dispose())}function u(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:n,dispose:u}}function Nf(s){const t={};function e(i){if(t[i]!==void 0)return t[i];const n=s.getExtension(i);return t[i]=n,n}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const n=e(i);return n===null&&Zs("WebGLRenderer: "+i+" extension not supported."),n}}}function Uf(s,t,e,i){const n={},r=new WeakMap,a=new FinalizationRegistry(_=>delete n[_]);function o(_){l(_.target)}function l(_){_.index!==null&&t.remove(_.index);for(const m in _.attributes)t.remove(_.attributes[m]);_.removeEventListener("dispose",o),delete n[_.id],a.unregister(_);const S=r.get(_);S&&(t.remove(S),r.delete(_)),i.releaseStatesOfGeometry(_),_.isInstancedBufferGeometry===!0&&delete _._maxInstanceCount,e.memory.geometries--}function h(_,S){return n[S.id]!==void 0||(S.addEventListener("dispose",o),n[S.id]=new WeakRef(S),a.register(S,S.id,S),e.memory.geometries++),S}function c(_){const S=_.attributes;for(const m in S)t.update(S[m],s.ARRAY_BUFFER)}function u(_){const S=_.index,m=_.attributes.position;let f=0;if(m===void 0)return;const v=S!==null?S.array.length:m.array.length/3-1,T=m.count>=65535?Vl:Hl,b=new T(Math.ceil(v/3)*6,1),A=b.array;if(S!==null){const g=S.array;f=S.version;for(let y=0,L=0;y<v;y+=3){const R=g[y+0],N=g[y+1],F=g[y+2];A[L++]=R,A[L++]=N,A[L++]=N,A[L++]=F,A[L++]=F,A[L++]=R}}else{f=m.version;for(let g=0,y=0;g<v;g+=3){const L=g+0,R=g+1,N=g+2;A[y++]=L,A[y++]=R,A[y++]=R,A[y++]=N,A[y++]=N,A[y++]=L}}b.version=f;const w=r.get(_);w&&t.remove(w),r.set(_,b)}function d(_){const S=r.get(_);if(S){const m=_.index;m!==null&&S.version<m.version&&u(_)}else u(_);return r.get(_)}function p(){for(const _ in n){const S=n[_].deref();S!==void 0&&l(S)}}return{get:h,update:c,getWireframeAttribute:d,dispose:p}}function Ff(s,t,e){let i;function n(u){i=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,d){s.drawElements(i,d,r,u*a),e.update(d,i,1)}function h(u,d,p){p!==0&&(s.drawElementsInstanced(i,d,r,u*a,p),e.update(d,i,p))}function c(u,d,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,r,u,0,p);let S=0;for(let m=0;m<p;m++)S+=d[m];e.update(S,i,1)}this.setMode=n,this.setIndex=o,this.render=l,this.renderInstances=h,this.renderMultiDraw=c}function Of(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:jt("WebGLInfo: Unknown draw mode:",a);break}}function n(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:n,update:i}}function Bf(s,t,e){const i=new WeakMap,n=new me;function r(a,o,l){const h=a.morphTargetInfluences,c=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=c!==void 0?c.length:0;let d=i.get(o);if(d===void 0||d.count!==u){let R=function(){y.dispose(),i.delete(o),o.removeEventListener("dispose",R)};var p=R;d!==void 0&&d.texture.dispose();const _=o.morphAttributes.position!==void 0,S=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let b=0;_===!0&&(b=1),S===!0&&(b=2),m===!0&&(b=3);let A=o.attributes.position.count*b,w=1;A>t.maxTextureSize&&(w=Math.ceil(A/t.maxTextureSize),A=t.maxTextureSize);const g=new Float32Array(A*w*4*u),y=new zl(g,A,w,u);y.type=Mi,y.needsUpdate=!0;const L=b*4;for(let N=0;N<u;N++){const F=f[N],H=v[N],I=T[N],V=A*w*4*N;for(let $=0;$<F.count;$++){const k=$*L;_===!0&&(n.fromBufferAttribute(F,$),g[V+k+0]=n.x,g[V+k+1]=n.y,g[V+k+2]=n.z,g[V+k+3]=0),S===!0&&(n.fromBufferAttribute(H,$),g[V+k+4]=n.x,g[V+k+5]=n.y,g[V+k+6]=n.z,g[V+k+7]=0),m===!0&&(n.fromBufferAttribute(I,$),g[V+k+8]=n.x,g[V+k+9]=n.y,g[V+k+10]=n.z,g[V+k+11]=I.itemSize===4?n.w:1)}}d={count:u,texture:y,size:new Tt(A,w)},i.set(o,d),o.addEventListener("dispose",R)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let _=0;for(let m=0;m<h.length;m++)_+=h[m];const S=o.morphTargetsRelative?1:1-_;l.getUniforms().setValue(s,"morphTargetBaseInfluence",S),l.getUniforms().setValue(s,"morphTargetInfluences",h)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function zf(s,t,e,i,n){let r=new WeakMap;function a(h){const c=n.render.frame,u=h.geometry,d=t.get(h,u);if(r.get(d)!==c&&(t.update(d),r.set(d,c)),h.isInstancedMesh&&(h.hasEventListener("dispose",l)===!1&&h.addEventListener("dispose",l),r.get(h)!==c&&(e.update(h.instanceMatrix,s.ARRAY_BUFFER),h.instanceColor!==null&&e.update(h.instanceColor,s.ARRAY_BUFFER),r.set(h,c))),h.isSkinnedMesh){const p=h.skeleton;r.get(p)!==c&&(p.update(),r.set(p,c))}return d}function o(){r=new WeakMap}function l(h){const c=h.target;c.removeEventListener("dispose",l),i.releaseStatesOfObject(c),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:a,dispose:o}}const kf={[Na]:"LINEAR_TONE_MAPPING",[Ua]:"REINHARD_TONE_MAPPING",[Fa]:"CINEON_TONE_MAPPING",[or]:"ACES_FILMIC_TONE_MAPPING",[Ba]:"AGX_TONE_MAPPING",[za]:"NEUTRAL_TONE_MAPPING",[Oa]:"CUSTOM_TONE_MAPPING"};function Gf(s,t,e,i,n,r){const a=new $e(t,e,{type:s,depthBuffer:n,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,h=null;const c=new ge;c.setAttribute("position",new Qt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Qt([0,2,0,0,2,0],2));const u=new $l({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new _t(c,u),p=new ja(-1,1,1,-1,0,1);let _=null,S=null,m=!1,f,v=null,T=[],b=!1;this.setSize=function(A,w){a.setSize(A,w),o!==null&&o.setSize(A,w),l!==null&&l.setSize(A,w);for(let g=0;g<T.length;g++){const y=T[g];y.setSize&&y.setSize(A,w)}},this.setEffects=function(A){T=A,b=T.length>0&&T[0].isRenderPass===!0;const w=a.width,g=a.height;T.length>0&&o===null&&(o=new $e(w,g,{type:Ze,depthBuffer:!1,stencilBuffer:!1}),l=new $e(w,g,{type:Ze,depthBuffer:!1,stencilBuffer:!1}));const y=n===!0&&T.some(L=>L.needsDepthTexture===!0);y!==(a.depthTexture!==null)&&(y===!0&&h===null&&(h=new Un(w,g),r===!0&&(h.format=Xi,h.type=Nn)),a.dispose(),a.depthTexture=y?h:null,a.resolveDepthBuffer=y,a.storeMultisampledDepthBuffer=y);for(let L=0;L<T.length;L++){const R=T[L];R.setSize&&R.setSize(w,g),y&&R.needsDepthTexture===!0&&R.setDepthTexture&&R.setDepthTexture(h)}},this.begin=function(A,w){if(m||A.toneMapping===Di&&T.length===0)return!1;if(v=w,w!==null){const g=w.width,y=w.height;(a.width!==g||a.height!==y)&&this.setSize(g,y)}return b===!1&&A.setRenderTarget(a),f=A.toneMapping,A.toneMapping=Di,!0},this.hasRenderPass=function(){return b},this.end=function(A,w){A.toneMapping=f,m=!0;let g=a,y=o;for(let L=0;L<T.length;L++){const R=T[L];R.enabled!==!1&&(R.render(A,y,g,w),R.needsSwap!==!1&&(g=y,y=y===o?l:o))}if(_!==A.outputColorSpace||S!==A.toneMapping){_=A.outputColorSpace,S=A.toneMapping,u.defines={},Kt.getTransfer(_)===ee&&(u.defines.SRGB_TRANSFER="");const L=kf[S];L&&(u.defines[L]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=g.texture,A.setRenderTarget(v),A.render(d,p),v=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}const nh=new ke,sh=new Un(1,1),rh=new Yl(1),ah=new zl,oh=new rc,lh=new ql,jo=[],tl=[],el=new Float32Array(16),il=new Float32Array(9),nl=new Float32Array(4);function kn(s,t,e){const i=s[0];if(i<=0||i>0)return s;const n=t*e;let r=jo[n];if(r===void 0&&(r=new Float32Array(n),jo[n]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function we(s,t){if(s.length!==t.length)return!1;for(let e=0,i=s.length;e<i;e++)if(s[e]!==t[e])return!1;return!0}function Te(s,t){for(let e=0,i=t.length;e<i;e++)s[e]=t[e]}function cr(s,t){let e=tl[t];e===void 0&&(e=new Int32Array(t),tl[t]=e);for(let i=0;i!==t;++i)e[i]=s.allocateTextureUnit();return e}function Hf(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Vf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;s.uniform2fv(this.addr,t),Te(e,t)}}function Wf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(we(e,t))return;s.uniform3fv(this.addr,t),Te(e,t)}}function Xf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;s.uniform4fv(this.addr,t),Te(e,t)}}function qf(s,t){const e=this.cache,i=t.elements;if(i===void 0){if(we(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Te(e,t)}else{if(we(e,i))return;nl.set(i),s.uniformMatrix2fv(this.addr,!1,nl),Te(e,i)}}function Yf(s,t){const e=this.cache,i=t.elements;if(i===void 0){if(we(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Te(e,t)}else{if(we(e,i))return;il.set(i),s.uniformMatrix3fv(this.addr,!1,il),Te(e,i)}}function Kf(s,t){const e=this.cache,i=t.elements;if(i===void 0){if(we(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Te(e,t)}else{if(we(e,i))return;el.set(i),s.uniformMatrix4fv(this.addr,!1,el),Te(e,i)}}function Zf(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function $f(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;s.uniform2iv(this.addr,t),Te(e,t)}}function Jf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;s.uniform3iv(this.addr,t),Te(e,t)}}function Qf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;s.uniform4iv(this.addr,t),Te(e,t)}}function jf(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function tp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;s.uniform2uiv(this.addr,t),Te(e,t)}}function ep(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;s.uniform3uiv(this.addr,t),Te(e,t)}}function ip(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;s.uniform4uiv(this.addr,t),Te(e,t)}}function ur(s){return s.version===0&&(s.compareFunction=Nl,s.needsUpdate=!0),s}function np(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n);let r;this.type===s.SAMPLER_2D_SHADOW?r=ur(sh):r=nh,e.setTexture2D(t||r,n)}function sp(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTexture3D(t||oh,n)}function rp(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n);let r;this.type===s.SAMPLER_CUBE_SHADOW?r=ur(rh):r=lh,e.setTextureCube(t||r,n)}function ap(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTexture2DArray(t||ah,n)}function op(s){switch(s){case 5126:return Hf;case 35664:return Vf;case 35665:return Wf;case 35666:return Xf;case 35674:return qf;case 35675:return Yf;case 35676:return Kf;case 5124:case 35670:return Zf;case 35667:case 35671:return $f;case 35668:case 35672:return Jf;case 35669:case 35673:return Qf;case 5125:return jf;case 36294:return tp;case 36295:return ep;case 36296:return ip;case 35678:case 36198:case 36298:case 36306:case 35682:return np;case 35679:case 36299:case 36307:return sp;case 35680:case 36300:case 36308:case 36293:return rp;case 36289:case 36303:case 36311:case 36292:return ap}}function lp(s,t){s.uniform1fv(this.addr,t)}function hp(s,t){const e=kn(t,this.size,2);s.uniform2fv(this.addr,e)}function cp(s,t){const e=kn(t,this.size,3);s.uniform3fv(this.addr,e)}function up(s,t){const e=kn(t,this.size,4);s.uniform4fv(this.addr,e)}function dp(s,t){const e=kn(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function fp(s,t){const e=kn(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function pp(s,t){const e=kn(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function mp(s,t){s.uniform1iv(this.addr,t)}function gp(s,t){s.uniform2iv(this.addr,t)}function _p(s,t){s.uniform3iv(this.addr,t)}function xp(s,t){s.uniform4iv(this.addr,t)}function vp(s,t){s.uniform1uiv(this.addr,t)}function Mp(s,t){s.uniform2uiv(this.addr,t)}function Sp(s,t){s.uniform3uiv(this.addr,t)}function yp(s,t){s.uniform4uiv(this.addr,t)}function bp(s,t,e){const i=this.cache,n=t.length,r=cr(e,n);we(i,r)||(s.uniform1iv(this.addr,r),Te(i,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=ur(sh):a=nh;for(let o=0;o!==n;++o)e.setTexture2D(t[o]||a,r[o])}function Ep(s,t,e){const i=this.cache,n=t.length,r=cr(e,n);we(i,r)||(s.uniform1iv(this.addr,r),Te(i,r));for(let a=0;a!==n;++a)e.setTexture3D(t[a]||oh,r[a])}function wp(s,t,e){const i=this.cache,n=t.length,r=cr(e,n);we(i,r)||(s.uniform1iv(this.addr,r),Te(i,r));let a;this.type===s.SAMPLER_CUBE_SHADOW?a=ur(rh):a=lh;for(let o=0;o!==n;++o)e.setTextureCube(t[o]||a,r[o])}function Tp(s,t,e){const i=this.cache,n=t.length,r=cr(e,n);we(i,r)||(s.uniform1iv(this.addr,r),Te(i,r));for(let a=0;a!==n;++a)e.setTexture2DArray(t[a]||ah,r[a])}function Ap(s){switch(s){case 5126:return lp;case 35664:return hp;case 35665:return cp;case 35666:return up;case 35674:return dp;case 35675:return fp;case 35676:return pp;case 5124:case 35670:return mp;case 35667:case 35671:return gp;case 35668:case 35672:return _p;case 35669:case 35673:return xp;case 5125:return vp;case 36294:return Mp;case 36295:return Sp;case 36296:return yp;case 35678:case 36198:case 36298:case 36306:case 35682:return bp;case 35679:case 36299:case 36307:return Ep;case 35680:case 36300:case 36308:case 36293:return wp;case 36289:case 36303:case 36311:case 36292:return Tp}}class Rp{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=op(e.type)}}class Cp{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Ap(e.type)}}class Pp{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const n=this.seq;for(let r=0,a=n.length;r!==a;++r){const o=n[r];o.setValue(t,e[o.id],i)}}}const Gr=/(\w+)(\])?(\[|\.)?/g;function sl(s,t){s.seq.push(t),s.map[t.id]=t}function Lp(s,t,e){const i=s.name,n=i.length;for(Gr.lastIndex=0;;){const r=Gr.exec(i),a=Gr.lastIndex;let o=r[1];const l=r[2]==="]",h=r[3];if(l&&(o=o|0),h===void 0||h==="["&&a+2===n){sl(e,h===void 0?new Rp(o,s,t):new Cp(o,s,t));break}else{let u=e.map[o];u===void 0&&(u=new Pp(o),sl(e,u)),e=u}}}class $s{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);Lp(o,l,this)}const n=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?n.push(a):r.push(a);n.length>0&&(this.seq=n.concat(r))}setValue(t,e,i,n){const r=this.map[e];r!==void 0&&r.setValue(t,i,n)}setOptional(t,e,i){const n=e[i];n!==void 0&&this.setValue(t,i,n)}static upload(t,e,i,n){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,n)}}static seqWithValue(t,e){const i=[];for(let n=0,r=t.length;n!==r;++n){const a=t[n];a.id in e&&i.push(a)}return i}}function rl(s,t,e){const i=s.createShader(t);return s.shaderSource(i,e),s.compileShader(i),i}const Dp=37297;let Ip=0;function Np(s,t){const e=s.split(`
`),i=[],n=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=n;a<r;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}const al=new Ut;function Up(s){Kt._getMatrix(al,Kt.workingColorSpace,s);const t=`mat3( ${al.elements.map(e=>e.toFixed(4))} )`;switch(Kt.getTransfer(s)){case er:return[t,"LinearTransferOETF"];case ee:return[t,"sRGBTransferOETF"];default:return It("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function ol(s,t,e){const i=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Np(s.getShaderSource(t),o)}else return r}function Fp(s,t){const e=Up(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( ${e[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const Op={[Na]:"Linear",[Ua]:"Reinhard",[Fa]:"Cineon",[or]:"ACESFilmic",[Ba]:"AgX",[za]:"Neutral",[Oa]:"Custom"};function Bp(s,t){const e=Op[t];return e===void 0?(It("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ks=new C;function zp(){Kt.getLuminanceCoefficients(ks);const s=ks.x.toFixed(4),t=ks.y.toFixed(4),e=ks.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function kp(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(jn).join(`
`)}function Gp(s){const t=[];for(const e in s){const i=s[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Hp(s,t){const e={},i=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const r=s.getActiveAttrib(t,n),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function jn(s){return s!==""}function ll(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function hl(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Vp=/^[ \t]*#include +<([\w\d./]+)>/gm;function Da(s){return s.replace(Vp,Wp)}function Wp(s,t){const e=Vt[t];if(e===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return Da(e)}const Xp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function cl(s){return s.replace(Xp,qp)}function qp(s,t,e,i){let n="";for(let r=parseInt(t);r<parseInt(e);r++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return n}function ul(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const Yp={[Vs]:"SHADOWMAP_TYPE_PCF",[Qn]:"SHADOWMAP_TYPE_VSM"};function Kp(s){return Yp[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Zp={[is]:"ENVMAP_MODE_REFRACTION"};function $p(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Zp[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Jp={[bl]:"ENVMAP_BLENDING_MULTIPLY",[Oh]:"ENVMAP_BLENDING_MIX",[Bh]:"ENVMAP_BLENDING_ADD"};function Qp(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Jp[s.combine]||"ENVMAP_BLENDING_NONE"}function jp(s,t,e,i){const n=s.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=Kp(e),h=e.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",c=$p(e),u=Qp(e),d=kp(e),p=Gp(r),_=n.createProgram();let S,m,f=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(S=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(jn).join(`
`),S.length>0&&(S+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(jn).join(`
`),m.length>0&&(m+=`
`)):(S=[ul(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+e.diffuseRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(jn).join(`
`),m=[ul(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMapPMREM?"#define ENVMAP_MAX_LOD "+e.envMapMaxLod+".0":"",e.envMapPMREM?"#define ENVMAP_SIZE "+e.envMapSize+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Di?"#define TONE_MAPPING":"",e.toneMapping!==Di?Vt.tonemapping_pars_fragment:"",e.toneMapping!==Di?Bp("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Vt.colorspace_pars_fragment,Fp("linearToOutputTexel",e.outputColorSpace),zp(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(jn).join(`
`)),a=Da(a),a=ll(a,e),a=hl(a,e),o=Da(o),o=ll(o,e),o=hl(o,e),a=cl(a),o=cl(o),e.isRawShaderMaterial!==!0&&(f=`#version 300 es
`,S=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,m=["#define varying in",e.glslVersion===So?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===So?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const v=f+S+a,T=f+m+o,b=rl(n,n.VERTEX_SHADER,v),A=rl(n,n.FRAGMENT_SHADER,T);n.attachShader(_,b),n.attachShader(_,A),e.index0AttributeName!==void 0?n.bindAttribLocation(_,0,e.index0AttributeName):e.hasPositionAttribute===!0&&n.bindAttribLocation(_,0,"position"),n.linkProgram(_);function w(R){if(s.debug.checkShaderErrors){const N=n.getProgramInfoLog(_)||"",F=n.getShaderInfoLog(b)||"",H=n.getShaderInfoLog(A)||"",I=N.trim(),V=F.trim(),$=H.trim();let k=!0,et=!0;if(n.getProgramParameter(_,n.LINK_STATUS)===!1)if(k=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(n,_,b,A);else{const X=ol(n,b,"vertex"),Q=ol(n,A,"fragment");jt("WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(_,n.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+I+`
`+X+`
`+Q)}else I!==""?It("WebGLProgram: Program Info Log:",I):(V===""||$==="")&&(et=!1);et&&(R.diagnostics={runnable:k,programLog:I,vertexShader:{log:V,prefix:S},fragmentShader:{log:$,prefix:m}})}n.deleteShader(b),n.deleteShader(A),g=new $s(n,_),y=Hp(n,_)}let g;this.getUniforms=function(){return g===void 0&&w(this),g};let y;this.getAttributes=function(){return y===void 0&&w(this),y};let L=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=n.getProgramParameter(_,Dp)),L},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Ip++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=b,this.fragmentShader=A,this}let tm=0;class em{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,i){const n=this._getShaderCacheForMaterial(t);return n.has(e)===!1&&(n.add(e),e.usedTimes++),n.has(i)===!1&&(n.add(i),i.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new im(t),e.set(t,i)),i}}class im{constructor(t){this.id=tm++,this.code=t,this.usedTimes=0}}function nm(s){return s===hn||s===Qs||s===js}function sm(s,t,e,i,n,r){const a=new kl,o=new em,l=new Set,h=[],c=new Map,u=i.logarithmicDepthBuffer,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(g){return l.add(g),g===0?"uv":`uv${g}`}function _(g,y,L,R,N,F){const H=R.fog,I=N.geometry,V=g.isMeshStandardMaterial||g.isMeshLambertMaterial||g.isMeshPhongMaterial?R.environment:null,$=g.isMeshStandardMaterial||g.isMeshLambertMaterial&&!g.envMap||g.isMeshPhongMaterial&&!g.envMap,k=t.get(g.envMap||V,$),et=d[g.type];let X=i.precision;g.precision!==null&&(X=i.getMaxPrecision(g.precision),X!==g.precision&&It("WebGLProgram.getParameters:",g.precision,"not supported, using",X,"instead."));const Q=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,j=Q!==void 0?Q.length:0;let yt=0;I.morphAttributes.position!==void 0&&(yt=1),I.morphAttributes.normal!==void 0&&(yt=2),I.morphAttributes.color!==void 0&&(yt=3);let Ot,K,pt,vt;if(et){const dt=xi[et];Ot=dt.vertexShader,K=dt.fragmentShader}else{Ot=g.vertexShader,K=g.fragmentShader;const dt=o.getVertexShaderStage(g),ne=o.getFragmentShaderStage(g);o.update(g,dt,ne),pt=dt.id,vt=ne.id}const Ct=s.getRenderTarget(),mt=s.state.buffers.depth.getReversed(),kt=N.isInstancedMesh===!0,_e=N.isBatchedMesh===!0,Dt=!!g.map,ie=!!g.matcap,se=!!k,Xt=se&&k.isPMREMTexture===!0,Ie=!!g.aoMap,ye=!!g.lightMap,Xe=!!g.bumpMap&&g.wireframe===!1,de=!!g.normalMap,mi=!!g.displacementMap,Ae=!!g.emissiveMap,ei=!!g.metalnessMap,ii=!!g.roughnessMap,ni=g.anisotropy>0,U=g.clearcoat>0,si=g.diffuseRoughness>0,ce=g.dispersion>0,ue=g.retroreflectivity>0,ut=g.iridescence>0,be=g.sheen>0,Pt=g.transmission>0,Nt=ni&&!!g.anisotropyMap,E=U&&!!g.clearcoatMap,x=U&&!!g.clearcoatNormalMap,B=U&&!!g.clearcoatRoughnessMap,tt=si&&!!g.diffuseRoughnessMap,J=ut&&!!g.iridescenceMap,st=ut&&!!g.iridescenceThicknessMap,ht=be&&!!g.sheenColorMap,q=be&&!!g.sheenRoughnessMap,Y=!!g.specularMap,at=!!g.specularColorMap,P=!!g.specularIntensityMap,Z=Pt&&!!g.transmissionMap,W=Pt&&!!g.thicknessMap,ot=!!g.gradientMap,nt=!!g.alphaMap,rt=g.alphaTest>0,At=!!g.alphaHash,Ht=!!g.extensions;let it=Di;g.toneMapped&&(Ct===null||Ct.isXRRenderTarget===!0)&&(it=s.toneMapping);const Rt=Xt?k.isCompressedCubeTexture?k.image[0].mipmaps:k.mipmaps:null,Gt={shaderID:et,shaderType:g.type,shaderName:g.name,vertexShader:Ot,fragmentShader:K,defines:g.defines,customVertexShaderID:pt,customFragmentShaderID:vt,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:X,batching:_e,batchingColor:_e&&N._colorsTexture!==null,instancing:kt,instancingColor:kt&&N.instanceColor!==null,instancingMorph:kt&&N.morphTexture!==null,outputColorSpace:Ct===null?s.outputColorSpace:Ct.isXRRenderTarget===!0?Ct.texture.colorSpace:Kt.workingColorSpace,alphaToCoverage:!!g.alphaToCoverage,map:Dt,matcap:ie,envMap:se,envMapMode:se&&k.mapping,envMapPMREM:Xt,envMapMaxLod:Xt?Rt.length-1:null,envMapSize:Xt?Rt[0].width:null,aoMap:Ie,lightMap:ye,bumpMap:Xe,normalMap:de,displacementMap:mi,emissiveMap:Ae,normalMapObjectSpace:de&&g.normalMapType===Gh,normalMapTangentSpace:de&&g.normalMapType===Ra,packedNormalMap:de&&g.normalMapType===Ra&&nm(g.normalMap.format),metalnessMap:ei,roughnessMap:ii,anisotropy:ni,anisotropyMap:Nt,clearcoat:U,clearcoatMap:E,clearcoatNormalMap:x,clearcoatRoughnessMap:B,diffuseRoughness:si,diffuseRoughnessMap:tt,dispersion:ce,retroreflection:ue,iridescence:ut,iridescenceMap:J,iridescenceThicknessMap:st,sheen:be,sheenColorMap:ht,sheenRoughnessMap:q,specularMap:Y,specularColorMap:at,specularIntensityMap:P,transmission:Pt,transmissionMap:Z,thicknessMap:W,gradientMap:ot,opaque:g.transparent===!1&&g.blending===ln&&g.alphaToCoverage===!1,alphaMap:nt,alphaTest:rt,alphaHash:At,combine:g.combine,mapUv:Dt&&p(g.map.channel),aoMapUv:Ie&&p(g.aoMap.channel),lightMapUv:ye&&p(g.lightMap.channel),bumpMapUv:Xe&&p(g.bumpMap.channel),normalMapUv:de&&p(g.normalMap.channel),displacementMapUv:mi&&p(g.displacementMap.channel),emissiveMapUv:Ae&&p(g.emissiveMap.channel),metalnessMapUv:ei&&p(g.metalnessMap.channel),roughnessMapUv:ii&&p(g.roughnessMap.channel),anisotropyMapUv:Nt&&p(g.anisotropyMap.channel),clearcoatMapUv:E&&p(g.clearcoatMap.channel),clearcoatNormalMapUv:x&&p(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:B&&p(g.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:tt&&p(g.diffuseRoughnessMap.channel),iridescenceMapUv:J&&p(g.iridescenceMap.channel),iridescenceThicknessMapUv:st&&p(g.iridescenceThicknessMap.channel),sheenColorMapUv:ht&&p(g.sheenColorMap.channel),sheenRoughnessMapUv:q&&p(g.sheenRoughnessMap.channel),specularMapUv:Y&&p(g.specularMap.channel),specularColorMapUv:at&&p(g.specularColorMap.channel),specularIntensityMapUv:P&&p(g.specularIntensityMap.channel),transmissionMapUv:Z&&p(g.transmissionMap.channel),thicknessMapUv:W&&p(g.thicknessMap.channel),alphaMapUv:nt&&p(g.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(de||ni),vertexNormals:!!I.attributes.normal,vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!I.attributes.uv&&(Dt||nt),fog:!!H,useFog:g.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:g.wireframe===!1&&(g.flatShading===!0||I.attributes.normal===void 0&&de===!1&&(g.isMeshLambertMaterial||g.isMeshPhongMaterial||g.isMeshStandardMaterial||g.isMeshPhysicalMaterial)),sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:mt,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:I.attributes.position!==void 0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:j,morphTextureStride:yt,numSunLights:y.sun.length,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numSunLightShadows:y.sunShadowMap.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numLightProbeGrids:F.filter(dt=>dt.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:g.dithering,shadowMapEnabled:s.shadowMap.enabled&&L.length>0,shadowMapType:s.shadowMap.type,toneMapping:it,decodeVideoTexture:Dt&&g.map.isVideoTexture===!0&&Kt.getTransfer(g.map.colorSpace)===ee,decodeVideoTextureEmissive:Ae&&g.emissiveMap.isVideoTexture===!0&&Kt.getTransfer(g.emissiveMap.colorSpace)===ee,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===Se,flipSided:g.side===We,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:Ht&&g.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ht&&g.extensions.multiDraw===!0||_e)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return Gt.vertexUv1s=l.has(1),Gt.vertexUv2s=l.has(2),Gt.vertexUv3s=l.has(3),l.clear(),Gt}function S(g){const y=[];if(g.shaderID?y.push(g.shaderID):(y.push(g.customVertexShaderID),y.push(g.customFragmentShaderID)),g.defines!==void 0)for(const L in g.defines)y.push(L),y.push(g.defines[L]);return g.isRawShaderMaterial===!1&&(m(y,g),f(y,g),y.push(s.outputColorSpace)),y.push(g.customProgramCacheKey),y.join()}function m(g,y){g.push(y.precision),g.push(y.outputColorSpace),g.push(y.envMapMode),g.push(y.envMapPMREM),g.push(y.envMapMaxLod),g.push(y.envMapSize),g.push(y.mapUv),g.push(y.alphaMapUv),g.push(y.lightMapUv),g.push(y.aoMapUv),g.push(y.bumpMapUv),g.push(y.normalMapUv),g.push(y.displacementMapUv),g.push(y.emissiveMapUv),g.push(y.metalnessMapUv),g.push(y.roughnessMapUv),g.push(y.anisotropyMapUv),g.push(y.clearcoatMapUv),g.push(y.clearcoatNormalMapUv),g.push(y.clearcoatRoughnessMapUv),g.push(y.diffuseRoughnessMapUv),g.push(y.iridescenceMapUv),g.push(y.iridescenceThicknessMapUv),g.push(y.sheenColorMapUv),g.push(y.sheenRoughnessMapUv),g.push(y.specularMapUv),g.push(y.specularColorMapUv),g.push(y.specularIntensityMapUv),g.push(y.transmissionMapUv),g.push(y.thicknessMapUv),g.push(y.combine),g.push(y.fogExp2),g.push(y.sizeAttenuation),g.push(y.morphTargetsCount),g.push(y.numSunLights),g.push(y.numDirLights),g.push(y.numPointLights),g.push(y.numSpotLights),g.push(y.numSpotLightMaps),g.push(y.numHemiLights),g.push(y.numRectAreaLights),g.push(y.numSunLightShadows),g.push(y.numDirLightShadows),g.push(y.numPointLightShadows),g.push(y.numSpotLightShadows),g.push(y.numSpotLightShadowsWithMaps),g.push(y.numLightProbes),g.push(y.numLightProbeGrids),g.push(y.shadowMapType),g.push(y.toneMapping),g.push(y.numClippingPlanes),g.push(y.numClipIntersection),g.push(y.depthPacking)}function f(g,y){a.disableAll(),y.instancing&&a.enable(0),y.instancingColor&&a.enable(1),y.instancingMorph&&a.enable(2),y.matcap&&a.enable(3),y.envMap&&a.enable(4),y.normalMapObjectSpace&&a.enable(5),y.normalMapTangentSpace&&a.enable(6),y.clearcoat&&a.enable(7),y.iridescence&&a.enable(8),y.alphaTest&&a.enable(9),y.vertexColors&&a.enable(10),y.vertexAlphas&&a.enable(11),y.vertexUv1s&&a.enable(12),y.vertexUv2s&&a.enable(13),y.vertexUv3s&&a.enable(14),y.vertexTangents&&a.enable(15),y.anisotropy&&a.enable(16),y.alphaHash&&a.enable(17),y.batching&&a.enable(18),y.dispersion&&a.enable(19),y.retroreflection&&a.enable(24),y.diffuseRoughness&&a.enable(25),y.batchingColor&&a.enable(20),y.gradientMap&&a.enable(21),y.packedNormalMap&&a.enable(22),y.vertexNormals&&a.enable(23),g.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),y.numLightProbeGrids>0&&a.enable(22),y.hasPositionAttribute&&a.enable(23),g.push(a.mask)}function v(g){const y=d[g.type];let L;if(y){const R=xi[y];L=ls.clone(R.uniforms)}else L=g.uniforms;return L}function T(g,y){let L=c.get(y);return L!==void 0?++L.usedTimes:(L=new jp(s,y,g,n),h.push(L),c.set(y,L)),L}function b(g){if(--g.usedTimes===0){const y=h.indexOf(g);h[y]=h[h.length-1],h.pop(),c.delete(g.cacheKey),g.destroy()}}function A(g){o.remove(g)}function w(){o.dispose()}return{getParameters:_,getProgramCacheKey:S,getUniforms:v,acquireProgram:T,releaseProgram:b,releaseShaderCache:A,programs:h,dispose:w}}function rm(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function i(a){s.delete(a)}function n(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:i,update:n,dispose:r}}function am(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function dl(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function fl(){const s=[];let t=0;const e=[],i=[],n=[];function r(){t=0,e.length=0,i.length=0,n.length=0}function a(d){let p=0;return d.isInstancedMesh&&(p+=2),d.isSkinnedMesh&&(p+=1),p}function o(d,p,_,S,m,f){let v=s[t];return v===void 0?(v={id:d.id,object:d,geometry:p,material:_,materialVariant:a(d),groupOrder:S,renderOrder:d.renderOrder,z:m,group:f},s[t]=v):(v.id=d.id,v.object=d,v.geometry=p,v.material=_,v.materialVariant=a(d),v.groupOrder=S,v.renderOrder=d.renderOrder,v.z=m,v.group=f),t++,v}function l(d,p,_,S,m,f,v){v.reversedDepth===!0&&(m=-m);const T=o(d,p,_,S,m,f);_.transmission>0?i.push(T):_.transparent===!0?n.push(T):e.push(T)}function h(d,p,_,S,m,f){const v=o(d,p,_,S,m,f);_.transmission>0?i.unshift(v):_.transparent===!0?n.unshift(v):e.unshift(v)}function c(d,p){e.length>1&&e.sort(d||am),i.length>1&&i.sort(p||dl),n.length>1&&n.sort(p||dl)}function u(){for(let d=t,p=s.length;d<p;d++){const _=s[d];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:e,transmissive:i,transparent:n,init:r,push:l,unshift:h,finish:u,sort:c}}function om(){let s=new WeakMap;function t(i,n){const r=s.get(i);let a;return r===void 0?(a=new fl,s.set(i,[a])):n>=r.length?(a=new fl,r.push(a)):a=r[n],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function lm(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new C,color:new Ft};break;case"SpotLight":e={position:new C,direction:new C,color:new Ft,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new Ft,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new Ft,groundColor:new Ft};break;case"RectAreaLight":e={color:new Ft,position:new C,halfWidth:new C,halfHeight:new C};break}return s[t.id]=e,e}}}function hm(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let cm=0;function um(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function dm(s){const t=new lm,e=hm(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new C);const n=new C,r=new he,a=new he;function o(h){let c=0,u=0,d=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let p=0,_=0,S=0,m=0,f=0,v=0,T=0,b=0,A=0,w=0,g=0,y=0,L=0,R=0;h.sort(um);for(let F=0,H=h.length;F<H;F++){const I=h[F],V=I.color,$=I.intensity,k=I.distance;let et=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===hn?et=I.shadow.map.texture:et=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)c+=V.r*$,u+=V.g*$,d+=V.b*$;else if(I.isLightProbe){for(let X=0;X<9;X++)i.probe[X].addScaledVector(I.sh.coefficients[X],$);R++}else if(I.isSunLight){const X=t.get(I);if(X.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const Q=I.shadow,j=e.get(I);j.shadowIntensity=Q.intensity,j.shadowBias=Q.bias,j.shadowNormalBias=Q.normalBias,j.shadowRadius=Q.radius,j.shadowMapSize.copy(Q.mapSize).multiply(Q.getFrameExtents()),i.sunShadow[_]=j,i.sunShadowMap[_]=et;const yt=Q.getViewportCount();for(let Ot=0;Ot<yt;Ot++)i.sunShadowMatrix[S+Ot]=Q.getMatrix(Ot),i.sunShadowCascade[S+Ot]=Q._cascadeData[Ot];S+=yt,_++}i.sun[p]=X,p++}else if(I.isDirectionalLight){const X=t.get(I);if(X.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const Q=I.shadow,j=e.get(I);j.shadowIntensity=Q.intensity,j.shadowBias=Q.bias,j.shadowNormalBias=Q.normalBias,j.shadowRadius=Q.radius,j.shadowMapSize=Q.mapSize,i.directionalShadow[m]=j,i.directionalShadowMap[m]=et,i.directionalShadowMatrix[m]=I.shadow.matrix,A++}i.directional[m]=X,m++}else if(I.isSpotLight){const X=t.get(I);X.position.setFromMatrixPosition(I.matrixWorld),X.color.copy(V).multiplyScalar($),X.distance=k,X.coneCos=Math.cos(I.angle),X.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),X.decay=I.decay,i.spot[v]=X;const Q=I.shadow;if(I.map&&(i.spotLightMap[y]=I.map,y++,Q.updateMatrices(I),I.castShadow&&L++),i.spotLightMatrix[v]=Q.matrix,I.castShadow){const j=e.get(I);j.shadowIntensity=Q.intensity,j.shadowBias=Q.bias,j.shadowNormalBias=Q.normalBias,j.shadowRadius=Q.radius,j.shadowMapSize=Q.mapSize,i.spotShadow[v]=j,i.spotShadowMap[v]=et,g++}v++}else if(I.isRectAreaLight){const X=t.get(I);X.color.copy(V).multiplyScalar($),X.halfWidth.set(I.width*.5,0,0),X.halfHeight.set(0,I.height*.5,0),i.rectArea[T]=X,T++}else if(I.isPointLight){const X=t.get(I);if(X.color.copy(I.color).multiplyScalar(I.intensity),X.distance=I.distance,X.decay=I.decay,I.castShadow){const Q=I.shadow,j=e.get(I);j.shadowIntensity=Q.intensity,j.shadowBias=Q.bias,j.shadowNormalBias=Q.normalBias,j.shadowRadius=Q.radius,j.shadowMapSize=Q.mapSize,j.shadowCameraNear=Q.camera.near,j.shadowCameraFar=Q.camera.far,i.pointShadow[f]=j,i.pointShadowMap[f]=et,i.pointShadowMatrix[f]=I.shadow.matrix,w++}i.point[f]=X,f++}else if(I.isHemisphereLight){const X=t.get(I);X.skyColor.copy(I.color).multiplyScalar($),X.groundColor.copy(I.groundColor).multiplyScalar($),i.hemi[b]=X,b++}}T>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ft.LTC_FLOAT_1,i.rectAreaLTC2=ft.LTC_FLOAT_2):(i.rectAreaLTC1=ft.LTC_HALF_1,i.rectAreaLTC2=ft.LTC_HALF_2)),i.ambient[0]=c,i.ambient[1]=u,i.ambient[2]=d;const N=i.hash;(N.sunLength!==p||N.directionalLength!==m||N.pointLength!==f||N.spotLength!==v||N.rectAreaLength!==T||N.hemiLength!==b||N.numSunShadows!==_||N.numDirectionalShadows!==A||N.numPointShadows!==w||N.numSpotShadows!==g||N.numSpotMaps!==y||N.numLightProbes!==R)&&(i.sun.length=p,i.directional.length=m,i.spot.length=v,i.rectArea.length=T,i.point.length=f,i.hemi.length=b,i.sunShadow.length=_,i.sunShadowMap.length=_,i.sunShadowMatrix.length=S,i.sunShadowCascade.length=S,i.directionalShadow.length=A,i.directionalShadowMap.length=A,i.directionalShadowMatrix.length=A,i.pointShadow.length=w,i.pointShadowMap.length=w,i.pointShadowMatrix.length=w,i.spotShadow.length=g,i.spotShadowMap.length=g,i.spotLightMatrix.length=g+y-L,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=L,i.numLightProbes=R,N.sunLength=p,N.directionalLength=m,N.pointLength=f,N.spotLength=v,N.rectAreaLength=T,N.hemiLength=b,N.numSunShadows=_,N.numDirectionalShadows=A,N.numPointShadows=w,N.numSpotShadows=g,N.numSpotMaps=y,N.numLightProbes=R,i.version=cm++)}function l(h,c){let u=0,d=0,p=0,_=0,S=0,m=0;const f=c.matrixWorldInverse;for(let v=0,T=h.length;v<T;v++){const b=h[v];if(b.isSunLight){const A=i.sun[u];A.direction.setFromMatrixPosition(b.matrixWorld),A.direction.transformDirection(f),u++}else if(b.isDirectionalLight){const A=i.directional[d];A.direction.setFromMatrixPosition(b.matrixWorld),n.setFromMatrixPosition(b.target.matrixWorld),A.direction.sub(n),A.direction.transformDirection(f),d++}else if(b.isSpotLight){const A=i.spot[_];A.position.setFromMatrixPosition(b.matrixWorld),A.position.applyMatrix4(f),A.direction.setFromMatrixPosition(b.matrixWorld),n.setFromMatrixPosition(b.target.matrixWorld),A.direction.sub(n),A.direction.transformDirection(f),_++}else if(b.isRectAreaLight){const A=i.rectArea[S];A.position.setFromMatrixPosition(b.matrixWorld),A.position.applyMatrix4(f),a.identity(),r.copy(b.matrixWorld),r.premultiply(f),a.extractRotation(r),A.halfWidth.set(b.width*.5,0,0),A.halfHeight.set(0,b.height*.5,0),A.halfWidth.applyMatrix4(a),A.halfHeight.applyMatrix4(a),S++}else if(b.isPointLight){const A=i.point[p];A.position.setFromMatrixPosition(b.matrixWorld),A.position.applyMatrix4(f),p++}else if(b.isHemisphereLight){const A=i.hemi[m];A.direction.setFromMatrixPosition(b.matrixWorld),A.direction.transformDirection(f),m++}}}return{setup:o,setupView:l,state:i}}function pl(s){const t=new dm(s),e=[],i=[],n=[];function r(u){c.camera=u,e.length=0,i.length=0,n.length=0}function a(u){u.isLightProbeGrid?n.push(u):e.push(u)}function o(u){i.push(u)}function l(){t.setup(e),n.sort((u,d)=>u.priority-d.priority||u.id-d.id)}function h(u){t.setupView(e,u)}const c={lightsArray:e,shadowsArray:i,lightProbeGridArray:n,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:c,setupLights:l,setupLightsView:h,pushLight:a,pushShadow:o}}function fm(s){let t=new WeakMap;function e(n,r=0){const a=t.get(n);let o;return a===void 0?(o=new pl(s),t.set(n,[o])):r>=a.length?(o=new pl(s),a.push(o)):o=a[r],o}function i(){t=new WeakMap}return{get:e,dispose:i}}const pm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,mm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,gm=[new C(1,0,0),new C(-1,0,0),new C(0,1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1)],_m=[new C(0,-1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1),new C(0,-1,0),new C(0,-1,0)],ml=new he,Jn=new C,Hr=new C;function xm(s,t,e){let i=new as;const n=new Tt,r=new Tt,a=new me,o=new Rc,l=new Cc,h={},c=e.maxTextureSize,u={[Zi]:We,[We]:Zi,[Se]:Se},d=new Ke({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Tt},radius:{value:4}},vertexShader:pm,fragmentShader:mm}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const _=new ge;_.setAttribute("position",new ti(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new _t(_,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Vs;let f=this.type;this.render=function(w,g,y){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;this.type===Ml&&(It("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Vs);const L=s.getRenderTarget(),R=s.getActiveCubeFace(),N=s.getActiveMipmapLevel(),F=s.state;F.setBlending(on),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const H=f!==this.type;H&&g.traverse(function(I){I.material&&(Array.isArray(I.material)?I.material.forEach(V=>V.needsUpdate=!0):I.material.needsUpdate=!0)});for(let I=0,V=w.length;I<V;I++){const $=w[I],k=$.shadow;if(k===void 0){It("WebGLShadowMap:",$,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;n.copy(k.mapSize);const et=k.getFrameExtents();n.multiply(et),r.copy(k.mapSize),(n.x>c||n.y>c)&&(n.x>c&&(r.x=Math.floor(c/et.x),n.x=r.x*et.x,k.mapSize.x=r.x),n.y>c&&(r.y=Math.floor(c/et.y),n.y=r.y*et.y,k.mapSize.y=r.y));const X=s.state.buffers.depth.getReversed();if(k.camera._reversedDepth=X,k.map===null||H===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===Qn){if($.isPointLight){It("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new $e(n.x,n.y,{format:hn,type:Ze,minFilter:Ye,magFilter:Ye,generateMipmaps:!1}),k.map.texture.name=$.name+".shadowMap",k.map.depthTexture=new Un(n.x,n.y,Mi),k.map.depthTexture.name=$.name+".shadowMapDepth",k.map.depthTexture.format=$i,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Ue,k.map.depthTexture.magFilter=Ue}else $.isPointLight?(k.map=new to(n.x),k.map.depthTexture=new Yl(n.x,yi)):(k.map=new $e(n.x,n.y),k.map.depthTexture=new Un(n.x,n.y,yi)),k.map.depthTexture.name=$.name+".shadowMap",k.map.depthTexture.format=$i,this.type===Vs?(k.map.depthTexture.compareFunction=X?Il:Dl,k.map.depthTexture.minFilter=Ye,k.map.depthTexture.magFilter=Ye):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Ue,k.map.depthTexture.magFilter=Ue);k.camera.updateProjectionMatrix()}k.map.isWebGLCubeRenderTarget!==!0&&(k.map.width!==n.x||k.map.height!==n.y)&&k.map.setSize(n.x,n.y);const Q=k.map.isWebGLCubeRenderTarget?6:k.getViewportCount();$.isPointLight!==!0&&k.updateMatrices($,y);const j=(k.camera.layers.mask&4294967294)!==0?k.camera.layers:y.layers;for(let yt=0;yt<Q;yt++){const Ot=k.getCamera(yt);if($.isPointLight){const K=k.camera,pt=k.matrix,vt=$.distance||K.far;vt!==K.far&&(K.far=vt,K.updateProjectionMatrix()),Jn.setFromMatrixPosition($.matrixWorld),K.position.copy(Jn),Hr.copy(K.position),Hr.add(gm[yt]),K.up.copy(_m[yt]),K.lookAt(Hr),K.updateMatrixWorld(),pt.makeTranslation(-Jn.x,-Jn.y,-Jn.z),ml.multiplyMatrices(K.projectionMatrix,K.matrixWorldInverse),k._frustum.setFromProjectionMatrix(ml,K.coordinateSystem,K.reversedDepth)}if(k.map.isWebGLCubeRenderTarget)s.setRenderTarget(k.map,yt),s.clear();else{yt===0&&(s.setRenderTarget(k.map),s.clear());const K=k.getViewport(yt);a.set(r.x*K.x,r.y*K.y,r.x*K.z,r.y*K.w),F.viewport(a)}i=k.getFrustum(yt),b(g,y,Ot,$,j,this.type)}k.isPointLightShadow!==!0&&this.type===Qn&&v(k,y),k.needsUpdate=!1}f=this.type,m.needsUpdate=!1,s.setRenderTarget(L,R,N)};function v(w,g){const y=t.update(S);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null?w.mapPass=new $e(n.x,n.y,{format:hn,type:Ze}):(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)&&w.mapPass.setSize(w.map.width,w.map.height),d.uniforms.shadow_pass.value=w.map.depthTexture,d.uniforms.resolution.value.set(w.map.width,w.map.height),d.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(g,null,y,d,S,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value.set(w.map.width,w.map.height),p.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(g,null,y,p,S,null)}function T(w,g,y,L){let R=null;const N=y.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(N!==void 0)R=N;else if(R=y.isPointLight===!0?l:o,s.localClippingEnabled&&g.clipShadows===!0&&Array.isArray(g.clippingPlanes)&&g.clippingPlanes.length!==0||g.displacementMap&&g.displacementScale!==0||g.alphaMap&&g.alphaTest>0||g.map&&g.alphaTest>0||g.alphaToCoverage===!0){const F=R.uuid,H=g.uuid;let I=h[F];I===void 0&&(I={},h[F]=I);let V=I[H];V===void 0&&(V=R.clone(),I[H]=V,g.addEventListener("dispose",A)),R=V}if(R.visible=g.visible,R.wireframe=g.wireframe,L===Qn?R.side=g.shadowSide!==null?g.shadowSide:g.side:R.side=g.shadowSide!==null?g.shadowSide:u[g.side],R.alphaMap=g.alphaMap,R.alphaTest=g.alphaToCoverage===!0?.5:g.alphaTest,R.map=g.map,R.clipShadows=g.clipShadows,R.clippingPlanes=g.clippingPlanes,R.clipIntersection=g.clipIntersection,R.displacementMap=g.displacementMap,R.displacementScale=g.displacementScale,R.displacementBias=g.displacementBias,R.wireframeLinewidth=g.wireframeLinewidth,R.linewidth=g.linewidth,y.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const F=s.properties.get(R);F.light=y}return R}function b(w,g,y,L,R,N){if(w.visible===!1)return;if(w.layers.test(R)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&N===Qn)&&(!w.frustumCulled||w.intersectsFrustum(i))){w.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,w.matrixWorld);const I=t.update(w),V=w.material;if(Array.isArray(V)){const $=I.groups;for(let k=0,et=$.length;k<et;k++){const X=$[k],Q=V[X.materialIndex];if(Q&&Q.visible){const j=T(w,Q,L,N);w.onBeforeShadow(s,w,g,y,I,j,X),s.renderBufferDirect(y,null,I,j,w,X),w.onAfterShadow(s,w,g,y,I,j,X)}}}else if(V.visible){const $=T(w,V,L,N);w.onBeforeShadow(s,w,g,y,I,$,null),s.renderBufferDirect(y,null,I,$,w,null),w.onAfterShadow(s,w,g,y,I,$,null)}}const H=w.children;for(let I=0,V=H.length;I<V;I++)b(H[I],g,y,L,R,N)}function A(w){w.target.removeEventListener("dispose",A);for(const y in h){const L=h[y],R=w.target.uuid;R in L&&(L[R].dispose(),delete L[R])}}}function vm(s,t){function e(){let P=!1;const Z=new me;let W=null;const ot=new me(0,0,0,0);return{setMask:function(nt){W!==nt&&!P&&(s.colorMask(nt,nt,nt,nt),W=nt)},setLocked:function(nt){P=nt},setClear:function(nt,rt,At,Ht,it){it===!0&&(nt*=Ht,rt*=Ht,At*=Ht),Z.set(nt,rt,At,Ht),ot.equals(Z)===!1&&(s.clearColor(nt,rt,At,Ht),ot.copy(Z))},reset:function(){P=!1,W=null,ot.set(-1,0,0,0)}}}function i(){let P=!1,Z=!1,W=null,ot=null,nt=null;return{setReversed:function(rt){if(Z!==rt){const At=t.get("EXT_clip_control");rt?At.clipControlEXT(At.LOWER_LEFT_EXT,At.ZERO_TO_ONE_EXT):At.clipControlEXT(At.LOWER_LEFT_EXT,At.NEGATIVE_ONE_TO_ONE_EXT),Z=rt;const Ht=nt;nt=null,this.setClear(Ht)}},getReversed:function(){return Z},setTest:function(rt){rt?mt(s.DEPTH_TEST):kt(s.DEPTH_TEST)},setMask:function(rt){W!==rt&&!P&&(s.depthMask(rt),W=rt)},setFunc:function(rt){if(Z&&(rt=Jh[rt]),ot!==rt){switch(rt){case Wr:s.depthFunc(s.NEVER);break;case Xr:s.depthFunc(s.ALWAYS);break;case qr:s.depthFunc(s.LESS);break;case es:s.depthFunc(s.LEQUAL);break;case Yr:s.depthFunc(s.EQUAL);break;case Kr:s.depthFunc(s.GEQUAL);break;case Zr:s.depthFunc(s.GREATER);break;case $r:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ot=rt}},setLocked:function(rt){P=rt},setClear:function(rt){nt!==rt&&(nt=rt,Z&&(rt=1-rt),s.clearDepth(rt))},reset:function(){P=!1,W=null,ot=null,nt=null,Z=!1}}}function n(){let P=!1,Z=null,W=null,ot=null,nt=null,rt=null,At=null,Ht=null,it=null;return{setTest:function(Rt){P||(Rt?mt(s.STENCIL_TEST):kt(s.STENCIL_TEST))},setMask:function(Rt){Z!==Rt&&!P&&(s.stencilMask(Rt),Z=Rt)},setFunc:function(Rt,Gt,dt){(W!==Rt||ot!==Gt||nt!==dt)&&(s.stencilFunc(Rt,Gt,dt),W=Rt,ot=Gt,nt=dt)},setOp:function(Rt,Gt,dt){(rt!==Rt||At!==Gt||Ht!==dt)&&(s.stencilOp(Rt,Gt,dt),rt=Rt,At=Gt,Ht=dt)},setLocked:function(Rt){P=Rt},setClear:function(Rt){it!==Rt&&(s.clearStencil(Rt),it=Rt)},reset:function(){P=!1,Z=null,W=null,ot=null,nt=null,rt=null,At=null,Ht=null,it=null}}}const r=new e,a=new i,o=new n;let l={};const h=new WeakMap;let c={},u={},d={},p=new WeakMap,_=[],S=null,m=!1,f=null,v=null,T=null,b=null,A=null,w=null,g=null,y=new Ft(0,0,0),L=0,R=!1,N=null,F=null,H=null,I=null,V=null;const $=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,et=0;const X=s.getParameter(s.VERSION);X.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec(X)[1]),k=et>=1):X.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),k=et>=2);let Q=null,j={};const yt=s.getParameter(s.SCISSOR_BOX),Ot=s.getParameter(s.VIEWPORT),K=new me().fromArray(yt),pt=new me().fromArray(Ot);function vt(P,Z,W,ot){const nt=new Uint8Array(4),rt=s.createTexture();s.bindTexture(P,rt),s.texParameteri(P,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(P,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let At=0;At<W;At++)P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY?s.texImage3D(Z,0,s.RGBA,1,1,ot,0,s.RGBA,s.UNSIGNED_BYTE,nt):s.texImage2D(Z+At,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,nt);return rt}const Ct={};Ct[s.TEXTURE_2D]=vt(s.TEXTURE_2D,s.TEXTURE_2D,1),Ct[s.TEXTURE_CUBE_MAP]=vt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ct[s.TEXTURE_2D_ARRAY]=vt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Ct[s.TEXTURE_3D]=vt(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),mt(s.DEPTH_TEST),a.setFunc(es),Xe(!1),de(xo),mt(s.CULL_FACE),Ie(on);function mt(P){c[P]!==!0&&(s.enable(P),c[P]=!0)}function kt(P){c[P]!==!1&&(s.disable(P),c[P]=!1)}function _e(P,Z){return d[P]!==Z?(s.bindFramebuffer(P,Z),d[P]=Z,P===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=Z),P===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=Z),!0):!1}function Dt(P,Z){let W=_,ot=!1;if(P){W=p.get(Z),W===void 0&&(W=[],p.set(Z,W));const nt=P.textures;if(W.length!==nt.length||W[0]!==s.COLOR_ATTACHMENT0){for(let rt=0,At=nt.length;rt<At;rt++)W[rt]=s.COLOR_ATTACHMENT0+rt;W.length=nt.length,ot=!0}}else W[0]!==s.BACK&&(W[0]=s.BACK,ot=!0);ot&&s.drawBuffers(W)}function ie(P){return S!==P?(s.useProgram(P),S=P,!0):!1}const se={[Pn]:s.FUNC_ADD,[Mh]:s.FUNC_SUBTRACT,[Sh]:s.FUNC_REVERSE_SUBTRACT};se[yh]=s.MIN,se[bh]=s.MAX;const Xt={[Eh]:s.ZERO,[wh]:s.ONE,[Th]:s.SRC_COLOR,[Sl]:s.SRC_ALPHA,[Dh]:s.SRC_ALPHA_SATURATE,[Ph]:s.DST_COLOR,[Rh]:s.DST_ALPHA,[Ah]:s.ONE_MINUS_SRC_COLOR,[yl]:s.ONE_MINUS_SRC_ALPHA,[Lh]:s.ONE_MINUS_DST_COLOR,[Ch]:s.ONE_MINUS_DST_ALPHA,[Ih]:s.CONSTANT_COLOR,[Nh]:s.ONE_MINUS_CONSTANT_COLOR,[Uh]:s.CONSTANT_ALPHA,[Fh]:s.ONE_MINUS_CONSTANT_ALPHA};function Ie(P,Z,W,ot,nt,rt,At,Ht,it,Rt){if(P===on){m===!0&&(kt(s.BLEND),m=!1);return}if(m===!1&&(mt(s.BLEND),m=!0),P!==vh){if(P!==f||Rt!==R){if((v!==Pn||A!==Pn)&&(s.blendEquation(s.FUNC_ADD),v=Pn,A=Pn),Rt)switch(P){case ln:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case oe:s.blendFunc(s.ONE,s.ONE);break;case vo:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Mo:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:jt("WebGLState: Invalid blending: ",P);break}else switch(P){case ln:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case oe:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case vo:jt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Mo:jt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:jt("WebGLState: Invalid blending: ",P);break}T=null,b=null,w=null,g=null,y.set(0,0,0),L=0,f=P,R=Rt}return}nt=nt||Z,rt=rt||W,At=At||ot,(Z!==v||nt!==A)&&(s.blendEquationSeparate(se[Z],se[nt]),v=Z,A=nt),(W!==T||ot!==b||rt!==w||At!==g)&&(s.blendFuncSeparate(Xt[W],Xt[ot],Xt[rt],Xt[At]),T=W,b=ot,w=rt,g=At),(Ht.equals(y)===!1||it!==L)&&(s.blendColor(Ht.r,Ht.g,Ht.b,it),y.copy(Ht),L=it),f=P,R=!1}function ye(P,Z){P.side===Se?kt(s.CULL_FACE):mt(s.CULL_FACE);let W=P.side===We;Z&&(W=!W),Xe(W),P.blending===ln&&P.transparent===!1?Ie(on):Ie(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),a.setFunc(P.depthFunc),a.setTest(P.depthTest),a.setMask(P.depthWrite),r.setMask(P.colorWrite);const ot=P.stencilWrite;o.setTest(ot),ot&&(o.setMask(P.stencilWriteMask),o.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),o.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),Ae(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?mt(s.SAMPLE_ALPHA_TO_COVERAGE):kt(s.SAMPLE_ALPHA_TO_COVERAGE)}function Xe(P){N!==P&&(P?s.frontFace(s.CW):s.frontFace(s.CCW),N=P)}function de(P){P!==_h?(mt(s.CULL_FACE),P!==F&&(P===xo?s.cullFace(s.BACK):P===xh?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):kt(s.CULL_FACE),F=P}function mi(P){P!==H&&(k&&s.lineWidth(P),H=P)}function Ae(P,Z,W){P?(mt(s.POLYGON_OFFSET_FILL),(I!==Z||V!==W)&&(I=Z,V=W,a.getReversed()&&(Z=-Z,W=-W),s.polygonOffset(Z,W))):kt(s.POLYGON_OFFSET_FILL)}function ei(P){P?mt(s.SCISSOR_TEST):kt(s.SCISSOR_TEST)}function ii(P){P===void 0&&(P=s.TEXTURE0+$-1),Q!==P&&(s.activeTexture(P),Q=P)}function ni(P,Z,W){W===void 0&&(Q===null?W=s.TEXTURE0+$-1:W=Q);let ot=j[W];ot===void 0&&(ot={type:void 0,texture:void 0},j[W]=ot),(ot.type!==P||ot.texture!==Z)&&(Q!==W&&(s.activeTexture(W),Q=W),s.bindTexture(P,Z||Ct[P]),ot.type=P,ot.texture=Z)}function U(){const P=j[Q];P!==void 0&&P.type!==void 0&&(s.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function si(){try{s.compressedTexImage2D(...arguments)}catch(P){jt("WebGLState:",P)}}function ce(){try{s.compressedTexImage3D(...arguments)}catch(P){jt("WebGLState:",P)}}function ue(){try{s.texSubImage2D(...arguments)}catch(P){jt("WebGLState:",P)}}function ut(){try{s.texSubImage3D(...arguments)}catch(P){jt("WebGLState:",P)}}function be(){try{s.compressedTexSubImage2D(...arguments)}catch(P){jt("WebGLState:",P)}}function Pt(){try{s.compressedTexSubImage3D(...arguments)}catch(P){jt("WebGLState:",P)}}function Nt(){try{s.texStorage2D(...arguments)}catch(P){jt("WebGLState:",P)}}function E(){try{s.texStorage3D(...arguments)}catch(P){jt("WebGLState:",P)}}function x(){try{s.texImage2D(...arguments)}catch(P){jt("WebGLState:",P)}}function B(){try{s.texImage3D(...arguments)}catch(P){jt("WebGLState:",P)}}function tt(P){return u[P]!==void 0?u[P]:s.getParameter(P)}function J(P,Z){u[P]!==Z&&(s.pixelStorei(P,Z),u[P]=Z)}function st(P){K.equals(P)===!1&&(s.scissor(P.x,P.y,P.z,P.w),K.copy(P))}function ht(P){pt.equals(P)===!1&&(s.viewport(P.x,P.y,P.z,P.w),pt.copy(P))}function q(P,Z){let W=h.get(Z);W===void 0&&(W=new WeakMap,h.set(Z,W));let ot=W.get(P);ot===void 0&&(ot=s.getUniformBlockIndex(Z,P.name),s.uniformBlockBinding(Z,ot,ot),W.set(P,ot))}function Y(P,Z,W){const nt=h.get(Z).get(P);l[nt]!==W&&(s.bindBufferBase(s.UNIFORM_BUFFER,nt,W),l[nt]=W)}function at(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),c={},u={},Q=null,j={},d={},l={},p=new WeakMap,_=[],S=null,m=!1,f=null,v=null,T=null,b=null,A=null,w=null,g=null,y=new Ft(0,0,0),L=0,R=!1,N=null,F=null,H=null,I=null,V=null,K.set(0,0,s.canvas.width,s.canvas.height),pt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:mt,disable:kt,bindFramebuffer:_e,drawBuffers:Dt,useProgram:ie,setBlending:Ie,setMaterial:ye,setFlipSided:Xe,setCullFace:de,setLineWidth:mi,setPolygonOffset:Ae,setScissorTest:ei,activeTexture:ii,bindTexture:ni,unbindTexture:U,compressedTexImage2D:si,compressedTexImage3D:ce,texImage2D:x,texImage3D:B,pixelStorei:J,getParameter:tt,updateUBOMapping:q,uniformBlockBinding:Y,texStorage2D:Nt,texStorage3D:E,texSubImage2D:ue,texSubImage3D:ut,compressedTexSubImage2D:be,compressedTexSubImage3D:Pt,scissor:st,viewport:ht,reset:at}}function Mm(s,t,e,i,n,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Tt,c=new WeakMap,u=new Set;let d;const p=new WeakMap,_=new Set,S=new FinalizationRegistry(E=>_.delete(E));let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function f(E,x){return m?new OffscreenCanvas(E,x):ir("canvas")}function v(E,x,B){let tt=1;const J=Nt(E);if((J.width>B||J.height>B)&&(tt=B/Math.max(J.width,J.height)),tt<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){const st=Math.floor(tt*J.width),ht=Math.floor(tt*J.height);d===void 0&&(d=f(st,ht));const q=x?f(st,ht):d;return q.width=st,q.height=ht,q.getContext("2d").drawImage(E,0,0,st,ht),It("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+st+"x"+ht+")."),q}else return"data"in E&&It("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),E;return E}function T(E){return E.generateMipmaps}function b(E){s.generateMipmap(E)}function A(E){return E.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?s.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function w(E,x,B,tt,J,st=!1){if(E!==null){if(s[E]!==void 0)return s[E];It("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let ht;tt&&(ht=t.get("EXT_texture_norm16"),ht||It("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let q=x;if(x===s.RED&&(B===s.FLOAT&&(q=s.R32F),B===s.HALF_FLOAT&&(q=s.R16F),B===s.UNSIGNED_BYTE&&(q=s.R8),B===s.UNSIGNED_SHORT&&ht&&(q=ht.R16_EXT),B===s.SHORT&&ht&&(q=ht.R16_SNORM_EXT)),x===s.RED_INTEGER&&(B===s.UNSIGNED_BYTE&&(q=s.R8UI),B===s.UNSIGNED_SHORT&&(q=s.R16UI),B===s.UNSIGNED_INT&&(q=s.R32UI),B===s.BYTE&&(q=s.R8I),B===s.SHORT&&(q=s.R16I),B===s.INT&&(q=s.R32I)),x===s.RG&&(B===s.FLOAT&&(q=s.RG32F),B===s.HALF_FLOAT&&(q=s.RG16F),B===s.UNSIGNED_BYTE&&(q=s.RG8),B===s.UNSIGNED_SHORT&&ht&&(q=ht.RG16_EXT),B===s.SHORT&&ht&&(q=ht.RG16_SNORM_EXT)),x===s.RG_INTEGER&&(B===s.UNSIGNED_BYTE&&(q=s.RG8UI),B===s.UNSIGNED_SHORT&&(q=s.RG16UI),B===s.UNSIGNED_INT&&(q=s.RG32UI),B===s.BYTE&&(q=s.RG8I),B===s.SHORT&&(q=s.RG16I),B===s.INT&&(q=s.RG32I)),x===s.RGB_INTEGER&&(B===s.UNSIGNED_BYTE&&(q=s.RGB8UI),B===s.UNSIGNED_SHORT&&(q=s.RGB16UI),B===s.UNSIGNED_INT&&(q=s.RGB32UI),B===s.BYTE&&(q=s.RGB8I),B===s.SHORT&&(q=s.RGB16I),B===s.INT&&(q=s.RGB32I)),x===s.RGBA_INTEGER&&(B===s.UNSIGNED_BYTE&&(q=s.RGBA8UI),B===s.UNSIGNED_SHORT&&(q=s.RGBA16UI),B===s.UNSIGNED_INT&&(q=s.RGBA32UI),B===s.BYTE&&(q=s.RGBA8I),B===s.SHORT&&(q=s.RGBA16I),B===s.INT&&(q=s.RGBA32I)),x===s.RGB&&(B===s.UNSIGNED_SHORT&&ht&&(q=ht.RGB16_EXT),B===s.SHORT&&ht&&(q=ht.RGB16_SNORM_EXT),B===s.UNSIGNED_INT_5_9_9_9_REV&&(q=s.RGB9_E5),B===s.UNSIGNED_INT_10F_11F_11F_REV&&(q=s.R11F_G11F_B10F)),x===s.RGBA){const Y=st?er:Kt.getTransfer(J);B===s.FLOAT&&(q=s.RGBA32F),B===s.HALF_FLOAT&&(q=s.RGBA16F),B===s.UNSIGNED_BYTE&&(q=Y===ee?s.SRGB8_ALPHA8:s.RGBA8),B===s.UNSIGNED_SHORT&&ht&&(q=ht.RGBA16_EXT),B===s.SHORT&&ht&&(q=ht.RGBA16_SNORM_EXT),B===s.UNSIGNED_SHORT_4_4_4_4&&(q=s.RGBA4),B===s.UNSIGNED_SHORT_5_5_5_1&&(q=s.RGB5_A1)}return(q===s.R16F||q===s.R32F||q===s.RG16F||q===s.RG32F||q===s.RGBA16F||q===s.RGBA32F)&&t.get("EXT_color_buffer_float"),q}function g(E,x){let B;return E?x===null||x===yi||x===Nn?B=s.DEPTH24_STENCIL8:x===Mi?B=s.DEPTH32F_STENCIL8:x===ss&&(B=s.DEPTH24_STENCIL8,It("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===yi||x===Nn?B=s.DEPTH_COMPONENT24:x===Mi?B=s.DEPTH_COMPONENT32F:x===ss&&(B=s.DEPTH_COMPONENT16),B}function y(E,x){return T(E)===!0||E.isFramebufferTexture&&E.minFilter!==Ue&&E.minFilter!==Ye?Math.log2(Math.max(x.width,x.height))+1:E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?x.mipmaps.length:1}function L(E){const x=new WeakRef(E);i.get(E).__ref=x,_.add(x),S.register(E,x,x)}function R(E){const x=i.get(E).__ref;x!==void 0&&(_.delete(x),S.unregister(x))}function N(E){H(E.target)}function F(E){I(E.target)}function H(E){E.removeEventListener("dispose",N),R(E),$(E),E.isVideoTexture&&c.delete(E),E.isHTMLTexture&&u.delete(E)}function I(E){E.removeEventListener("dispose",F),R(E),et(E)}function V(){for(const E of _){const x=E.deref();x!==void 0&&(x.isRenderTarget===!0?I(x):H(x))}_.clear(),u.clear()}function $(E){const x=i.get(E);if(x.__webglInit===void 0)return;const B=E.source,tt=p.get(B);if(tt){const J=tt[x.__cacheKey];J.usedTimes--,J.usedTimes===0&&k(E),Object.keys(tt).length===0&&p.delete(B)}i.remove(E)}function k(E){const x=i.get(E);s.deleteTexture(x.__webglTexture);const B=E.source,tt=p.get(B);delete tt[x.__cacheKey],a.memory.textures--}function et(E){const x=i.get(E);x.__depthDisposeCallback&&x.__depthDisposeCallback();const B=E.depthTexture;if(B&&B.renderTarget===E&&H(B),E.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(x.__webglFramebuffer[J]))for(let st=0;st<x.__webglFramebuffer[J].length;st++)s.deleteFramebuffer(x.__webglFramebuffer[J][st]);else s.deleteFramebuffer(x.__webglFramebuffer[J]);x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer[J])}else{if(Array.isArray(x.__webglFramebuffer))for(let J=0;J<x.__webglFramebuffer.length;J++)s.deleteFramebuffer(x.__webglFramebuffer[J]);else s.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&s.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let J=0;J<x.__webglColorRenderbuffer.length;J++)x.__webglColorRenderbuffer[J]&&s.deleteRenderbuffer(x.__webglColorRenderbuffer[J]);x.__webglDepthRenderbuffer&&s.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const tt=E.textures;for(let J=0,st=tt.length;J<st;J++){const ht=i.get(tt[J]);ht.__webglTexture&&(s.deleteTexture(ht.__webglTexture),a.memory.textures--),i.remove(tt[J])}i.remove(E)}let X=0;function Q(){X=0}function j(){return X}function yt(E){X=E}function Ot(){const E=X;return E>=n.maxTextures&&It("WebGLTextures: Trying to use "+(E+1)+" texture units while this GPU supports only "+n.maxTextures),X+=1,E}function K(E){const x=[];return x.push(E.wrapS),x.push(E.wrapT),x.push(E.wrapR||0),x.push(E.magFilter),x.push(E.minFilter),x.push(E.anisotropy),x.push(E.internalFormat),x.push(E.format),x.push(E.type),x.push(E.generateMipmaps),x.push(E.mipmapsAutoUpdate),x.push(E.premultiplyAlpha),x.push(E.flipY),x.push(E.unpackAlignment),x.push(E.colorSpace),x.join()}function pt(E,x){const B=i.get(E);if(E.isVideoTexture&&be(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&B.__version!==E.version){const tt=E.image;if(tt===null)It("WebGLRenderer: Texture marked for update but no image data found.");else if(tt.complete===!1)It("WebGLRenderer: Texture marked for update but image is incomplete");else{ye(B,E,x);return}}else E.isExternalTexture&&(B.__webglTexture=E.sourceTexture?E.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,B.__webglTexture,s.TEXTURE0+x)}function vt(E,x){const B=i.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&B.__version!==E.version){ye(B,E,x);return}else E.isExternalTexture&&(B.__webglTexture=E.sourceTexture?E.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,B.__webglTexture,s.TEXTURE0+x)}function Ct(E,x){const B=i.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&B.__version!==E.version){ye(B,E,x);return}e.bindTexture(s.TEXTURE_3D,B.__webglTexture,s.TEXTURE0+x)}function mt(E,x){const B=i.get(E);if(E.version>0&&B.__version!==E.version){Xe(B,E,x);return}e.bindTexture(s.TEXTURE_CUBE_MAP,B.__webglTexture,s.TEXTURE0+x)}const kt={[ns]:s.REPEAT,[Pi]:s.CLAMP_TO_EDGE,[Jr]:s.MIRRORED_REPEAT},_e={[Ue]:s.NEAREST,[zh]:s.NEAREST_MIPMAP_NEAREST,[ps]:s.NEAREST_MIPMAP_LINEAR,[Ye]:s.LINEAR,[mr]:s.LINEAR_MIPMAP_NEAREST,[Wi]:s.LINEAR_MIPMAP_LINEAR},Dt={[Vh]:s.NEVER,[Nl]:s.ALWAYS,[Wh]:s.LESS,[Dl]:s.LEQUAL,[Xh]:s.EQUAL,[Il]:s.GEQUAL,[qh]:s.GREATER,[Yh]:s.NOTEQUAL};function ie(E,x){if(x.type===Mi&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===Ye||x.magFilter===mr||x.magFilter===ps||x.magFilter===Wi||x.minFilter===Ye||x.minFilter===mr||x.minFilter===ps||x.minFilter===Wi)&&It("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(E,s.TEXTURE_WRAP_S,kt[x.wrapS]),s.texParameteri(E,s.TEXTURE_WRAP_T,kt[x.wrapT]),(E===s.TEXTURE_3D||E===s.TEXTURE_2D_ARRAY)&&s.texParameteri(E,s.TEXTURE_WRAP_R,kt[x.wrapR]),s.texParameteri(E,s.TEXTURE_MAG_FILTER,_e[x.magFilter]),s.texParameteri(E,s.TEXTURE_MIN_FILTER,_e[x.minFilter]),x.compareFunction&&(s.texParameteri(E,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(E,s.TEXTURE_COMPARE_FUNC,Dt[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Ue||x.minFilter!==ps&&x.minFilter!==Wi||x.type===Mi&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const B=t.get("EXT_texture_filter_anisotropic");s.texParameterf(E,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,n.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function se(E,x){let B=!1;E.__webglInit===void 0&&(E.__webglInit=!0,x.addEventListener("dispose",N),L(x));const tt=x.source;let J=p.get(tt);J===void 0&&(J={},p.set(tt,J));const st=K(x);if(st!==E.__cacheKey){J[st]===void 0&&(J[st]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,B=!0),J[st].usedTimes++;const ht=J[E.__cacheKey];ht!==void 0&&(J[E.__cacheKey].usedTimes--,ht.usedTimes===0&&k(x)),E.__cacheKey=st,E.__webglTexture=J[st].texture}return B}function Xt(E,x,B){return Math.floor(Math.floor(E/B)/x)}function Ie(E,x,B,tt){const st=E.updateRanges;if(st.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,x.width,x.height,B,tt,x.data);else{st.sort((P,Z)=>P.start-Z.start);let ht=0;for(let P=1;P<st.length;P++){const Z=st[ht],W=st[P],ot=Z.start+Z.count,nt=Xt(W.start,x.width,4),rt=Xt(Z.start,x.width,4);W.start<=ot+1&&nt===rt&&Xt(W.start+W.count-1,x.width,4)===nt?Z.count=Math.max(Z.count,W.start+W.count-Z.start):(++ht,st[ht]=W)}st.length=ht+1;const q=e.getParameter(s.UNPACK_ROW_LENGTH),Y=e.getParameter(s.UNPACK_SKIP_PIXELS),at=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,x.width);for(let P=0,Z=st.length;P<Z;P++){const W=st[P],ot=Math.floor(W.start/4),nt=Math.ceil(W.count/4),rt=ot%x.width,At=Math.floor(ot/x.width),Ht=nt,it=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,rt),e.pixelStorei(s.UNPACK_SKIP_ROWS,At),e.texSubImage2D(s.TEXTURE_2D,0,rt,At,Ht,it,B,tt,x.data)}E.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,q),e.pixelStorei(s.UNPACK_SKIP_PIXELS,Y),e.pixelStorei(s.UNPACK_SKIP_ROWS,at)}}function ye(E,x,B){let tt=s.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(tt=s.TEXTURE_2D_ARRAY),x.isData3DTexture&&(tt=s.TEXTURE_3D);const J=se(E,x),st=x.source;e.bindTexture(tt,E.__webglTexture,s.TEXTURE0+B);const ht=i.get(st);if(st.version!==ht.__version||J===!0){if(e.activeTexture(s.TEXTURE0+B),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const it=Kt.getPrimaries(Kt.workingColorSpace),Rt=x.colorSpace===Vi?null:Kt.getPrimaries(x.colorSpace),Gt=x.colorSpace===Vi||it===Rt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Gt)}e.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment);let Y=v(x.image,!1,n.maxTextureSize);Y=Pt(x,Y);const at=r.convert(x.format,x.colorSpace),P=r.convert(x.type);let Z=w(x.internalFormat,at,P,x.normalized,x.colorSpace,x.isVideoTexture);ie(tt,x);let W;const ot=x.mipmaps,nt=x.isVideoTexture!==!0,rt=ht.__version===void 0||J===!0,At=st.dataReady,Ht=y(x,Y);if(x.isDepthTexture)Z=g(x.format===Xi,x.type),rt&&(nt?e.texStorage2D(s.TEXTURE_2D,1,Z,Y.width,Y.height):e.texImage2D(s.TEXTURE_2D,0,Z,Y.width,Y.height,0,at,P,null));else if(x.isDataTexture)if(ot.length>0){nt&&rt&&e.texStorage2D(s.TEXTURE_2D,Ht,Z,ot[0].width,ot[0].height);for(let it=0,Rt=ot.length;it<Rt;it++)W=ot[it],nt?At&&e.texSubImage2D(s.TEXTURE_2D,it,0,0,W.width,W.height,at,P,W.data):e.texImage2D(s.TEXTURE_2D,it,Z,W.width,W.height,0,at,P,W.data);x.generateMipmaps=!1}else nt?(rt&&e.texStorage2D(s.TEXTURE_2D,Ht,Z,Y.width,Y.height),At&&Ie(x,Y,at,P)):e.texImage2D(s.TEXTURE_2D,0,Z,Y.width,Y.height,0,at,P,Y.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){nt&&rt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Ht,Z,ot[0].width,ot[0].height,Y.depth);for(let it=0,Rt=ot.length;it<Rt;it++)if(W=ot[it],x.format!==Si)if(at!==null)if(nt){if(At)if(x.layerUpdates.size>0){const Gt=Ko(W.width,W.height,x.format,x.type);for(const dt of x.layerUpdates){const ne=W.data.subarray(dt*Gt/W.data.BYTES_PER_ELEMENT,(dt+1)*Gt/W.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,it,0,0,dt,W.width,W.height,1,at,ne)}}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,it,0,0,0,W.width,W.height,Y.depth,at,W.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,it,Z,W.width,W.height,Y.depth,0,W.data,0,0);else It("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else nt?At&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,it,0,0,0,W.width,W.height,Y.depth,at,P,W.data):e.texImage3D(s.TEXTURE_2D_ARRAY,it,Z,W.width,W.height,Y.depth,0,at,P,W.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{nt&&rt&&e.texStorage2D(s.TEXTURE_2D,Ht,Z,ot[0].width,ot[0].height);for(let it=0,Rt=ot.length;it<Rt;it++)W=ot[it],x.format!==Si?at!==null?nt?At&&e.compressedTexSubImage2D(s.TEXTURE_2D,it,0,0,W.width,W.height,at,W.data):e.compressedTexImage2D(s.TEXTURE_2D,it,Z,W.width,W.height,0,W.data):It("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):nt?At&&e.texSubImage2D(s.TEXTURE_2D,it,0,0,W.width,W.height,at,P,W.data):e.texImage2D(s.TEXTURE_2D,it,Z,W.width,W.height,0,at,P,W.data)}else if(x.isDataArrayTexture)if(nt){if(rt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Ht,Z,Y.width,Y.height,Y.depth),At)if(x.layerUpdates.size>0){const it=Ko(Y.width,Y.height,x.format,x.type);for(const Rt of x.layerUpdates){const Gt=Y.data.subarray(Rt*it/Y.data.BYTES_PER_ELEMENT,(Rt+1)*it/Y.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Rt,Y.width,Y.height,1,at,P,Gt)}x.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Y.width,Y.height,Y.depth,at,P,Y.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Z,Y.width,Y.height,Y.depth,0,at,P,Y.data);else if(x.isData3DTexture)nt?(rt&&e.texStorage3D(s.TEXTURE_3D,Ht,Z,Y.width,Y.height,Y.depth),At&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Y.width,Y.height,Y.depth,at,P,Y.data)):e.texImage3D(s.TEXTURE_3D,0,Z,Y.width,Y.height,Y.depth,0,at,P,Y.data);else if(x.isFramebufferTexture){if(rt)if(nt)e.texStorage2D(s.TEXTURE_2D,Ht,Z,Y.width,Y.height);else{let it=Y.width,Rt=Y.height;for(let Gt=0;Gt<Ht;Gt++)e.texImage2D(s.TEXTURE_2D,Gt,Z,it,Rt,0,at,P,null),it>>=1,Rt>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in s){const it=s.canvas;if(it.hasAttribute("layoutsubtree")||it.setAttribute("layoutsubtree","true"),Y.parentNode!==it){it.appendChild(Y),u.add(x),it.onpaint=Rt=>{const Gt=Rt.changedElements;for(const dt of u)Gt.includes(dt.image)&&(dt.needsUpdate=!0)},it.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,Y);else{const Gt=s.RGBA,dt=s.RGBA,ne=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Gt,dt,ne,Y)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(ot.length>0){if(nt&&rt){const it=Nt(ot[0]);e.texStorage2D(s.TEXTURE_2D,Ht,Z,it.width,it.height)}for(let it=0,Rt=ot.length;it<Rt;it++)W=ot[it],nt?At&&e.texSubImage2D(s.TEXTURE_2D,it,0,0,at,P,W):e.texImage2D(s.TEXTURE_2D,it,Z,at,P,W);x.generateMipmaps=!1}else if(nt){if(rt){const it=Nt(Y);e.texStorage2D(s.TEXTURE_2D,Ht,Z,it.width,it.height)}At&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,at,P,Y)}else e.texImage2D(s.TEXTURE_2D,0,Z,at,P,Y);T(x)&&x.mipmapsAutoUpdate===!0&&b(tt),ht.__version=st.version,x.onUpdate&&x.onUpdate(x)}E.__version=x.version}function Xe(E,x,B){if(x.image.length!==6)return;const tt=se(E,x),J=x.source;e.bindTexture(s.TEXTURE_CUBE_MAP,E.__webglTexture,s.TEXTURE0+B);const st=i.get(J);if(J.version!==st.__version||tt===!0){e.activeTexture(s.TEXTURE0+B);const ht=Kt.getPrimaries(Kt.workingColorSpace),q=x.colorSpace===Vi?null:Kt.getPrimaries(x.colorSpace),Y=x.colorSpace===Vi||ht===q?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Y);const at=x.isCompressedTexture||x.image[0].isCompressedTexture,P=x.image[0]&&x.image[0].isDataTexture,Z=[];for(let dt=0;dt<6;dt++)!at&&!P?Z[dt]=v(x.image[dt],!0,n.maxCubemapSize):Z[dt]=P?x.image[dt].image:x.image[dt],Z[dt]=Pt(x,Z[dt]);const W=Z[0],ot=r.convert(x.format,x.colorSpace),nt=r.convert(x.type);let rt=w(x.internalFormat,ot,nt,x.normalized,x.colorSpace);const At=x.isVideoTexture!==!0,Ht=st.__version===void 0||tt===!0,it=J.dataReady;let Rt=y(x,W);ie(s.TEXTURE_CUBE_MAP,x);let Gt;if(x.isDepthTexture){if(rt=g(x.format===Xi,x.type),Ht)if(At)e.texStorage2D(s.TEXTURE_CUBE_MAP,1,rt,W.width,W.height);else for(let dt=0;dt<6;dt++)e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,rt,W.width,W.height,0,ot,nt,null)}else if(at){At&&Ht&&e.texStorage2D(s.TEXTURE_CUBE_MAP,Rt,rt,W.width,W.height);for(let dt=0;dt<6;dt++){Gt=Z[dt].mipmaps;for(let ne=0;ne<Gt.length;ne++){const Re=Gt[ne];x.format!==Si?ot!==null?At?it&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,ne,0,0,Re.width,Re.height,ot,Re.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,ne,rt,Re.width,Re.height,0,Re.data):It("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):At?it&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,ne,0,0,Re.width,Re.height,ot,nt,Re.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,ne,rt,Re.width,Re.height,0,ot,nt,Re.data)}}}else{if(Gt=x.mipmaps,At&&Ht){Gt.length>0&&Rt++;const dt=Nt(Z[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,Rt,rt,dt.width,dt.height)}for(let dt=0;dt<6;dt++)if(P){At?it&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,Z[dt].width,Z[dt].height,ot,nt,Z[dt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,rt,Z[dt].width,Z[dt].height,0,ot,nt,Z[dt].data);for(let ne=0;ne<Gt.length;ne++){const Ui=Gt[ne].image[dt].image;At?it&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,ne+1,0,0,Ui.width,Ui.height,ot,nt,Ui.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,ne+1,rt,Ui.width,Ui.height,0,ot,nt,Ui.data)}}else{At?it&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,ot,nt,Z[dt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,rt,ot,nt,Z[dt]);for(let ne=0;ne<Gt.length;ne++){const Re=Gt[ne];At?it&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,ne+1,0,0,ot,nt,Re.image[dt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,ne+1,rt,ot,nt,Re.image[dt])}}}T(x)&&x.mipmapsAutoUpdate===!0&&b(s.TEXTURE_CUBE_MAP),st.__version=J.version,x.onUpdate&&x.onUpdate(x)}E.__version=x.version}function de(E,x,B,tt,J,st){const ht=r.convert(B.format,B.colorSpace),q=r.convert(B.type),Y=w(B.internalFormat,ht,q,B.normalized,B.colorSpace),at=i.get(x),P=i.get(B);if(P.__renderTarget=x,!at.__hasExternalTextures){const Z=Math.max(1,x.width>>st),W=Math.max(1,x.height>>st);J===s.TEXTURE_3D||J===s.TEXTURE_2D_ARRAY?e.texImage3D(J,st,Y,Z,W,x.depth,0,ht,q,null):e.texImage2D(J,st,Y,Z,W,0,ht,q,null)}e.bindFramebuffer(s.FRAMEBUFFER,E),ut(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,tt,J,P.__webglTexture,0,ue(x)):(J===s.TEXTURE_2D||J>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,tt,J,P.__webglTexture,st),e.bindFramebuffer(s.FRAMEBUFFER,null)}function mi(E,x,B){if(s.bindRenderbuffer(s.RENDERBUFFER,E),x.depthBuffer){const tt=x.depthTexture,J=tt&&tt.isDepthTexture?tt.type:null,st=g(x.stencilBuffer,J),ht=x.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;ut(x)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ue(x),st,x.width,x.height):B?s.renderbufferStorageMultisample(s.RENDERBUFFER,ue(x),st,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,st,x.width,x.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ht,s.RENDERBUFFER,E)}else{const tt=x.textures;for(let J=0;J<tt.length;J++){const st=tt[J],ht=r.convert(st.format,st.colorSpace),q=r.convert(st.type),Y=w(st.internalFormat,ht,q,st.normalized,st.colorSpace);ut(x)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ue(x),Y,x.width,x.height):B?s.renderbufferStorageMultisample(s.RENDERBUFFER,ue(x),Y,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,Y,x.width,x.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ae(E,x,B){const tt=x.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,E),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const J=i.get(x.depthTexture);J.__renderTarget=x;const st=tt?x.depthTexture.image[0]:x.depthTexture.image;(!J.__webglTexture||st.width!==x.width||st.height!==x.height)&&(st.width=x.width,st.height=x.height,x.depthTexture.needsUpdate=!0),tt?mt(x.depthTexture,0):pt(x.depthTexture,0);const ht=J.__webglTexture,q=ue(x),Y=tt?s.TEXTURE_CUBE_MAP_POSITIVE_X+B:s.TEXTURE_2D,at=x.depthTexture.format===Xi?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(x.depthTexture.format===$i)ut(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,at,Y,ht,0,q):s.framebufferTexture2D(s.FRAMEBUFFER,at,Y,ht,0);else if(x.depthTexture.format===Xi)ut(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,at,Y,ht,0,q):s.framebufferTexture2D(s.FRAMEBUFFER,at,Y,ht,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ei(E){const x=i.get(E),B=E.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==E.depthTexture){const tt=E.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),tt){const J=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,tt.removeEventListener("dispose",J)};tt.addEventListener("dispose",J),x.__depthDisposeCallback=J}x.__boundDepthTexture=tt}if(E.depthTexture&&!x.__autoAllocateDepthBuffer)if(B)for(let tt=0;tt<6;tt++)Ae(x.__webglFramebuffer[tt],E,tt);else E.texture.mipmaps.length>0?Ae(x.__webglFramebuffer[0],E,0):Ae(x.__webglFramebuffer,E,0);else if(B){x.__webglDepthbuffer=[];for(let tt=0;tt<6;tt++)if(e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer[tt]),x.__webglDepthbuffer[tt]===void 0)x.__webglDepthbuffer[tt]=s.createRenderbuffer(),mi(x.__webglDepthbuffer[tt],E,!1);else{const J=E.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,st=x.__webglDepthbuffer[tt];s.bindRenderbuffer(s.RENDERBUFFER,st),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,st)}}else if(E.texture.mipmaps.length>0?e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=s.createRenderbuffer(),mi(x.__webglDepthbuffer,E,!1);else{const J=E.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,st=x.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,st),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,st)}e.bindFramebuffer(s.FRAMEBUFFER,null)}function ii(E,x,B){const tt=i.get(E);x!==void 0&&de(tt.__webglFramebuffer,E,E.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),B!==void 0&&ei(E)}function ni(E){const x=E.texture,B=i.get(E),tt=i.get(x);E.addEventListener("dispose",F),L(E);const J=E.textures,st=E.isWebGLCubeRenderTarget===!0,ht=J.length>1;if(ht||(tt.__webglTexture===void 0&&(tt.__webglTexture=s.createTexture()),tt.__version=x.version,a.memory.textures++),st){B.__webglFramebuffer=[];for(let q=0;q<6;q++)if(x.mipmaps.length>0){B.__webglFramebuffer[q]=[];for(let Y=0;Y<x.mipmaps.length;Y++)B.__webglFramebuffer[q][Y]=s.createFramebuffer()}else B.__webglFramebuffer[q]=s.createFramebuffer()}else{if(x.mipmaps.length>0){B.__webglFramebuffer=[];for(let q=0;q<x.mipmaps.length;q++)B.__webglFramebuffer[q]=s.createFramebuffer()}else B.__webglFramebuffer=s.createFramebuffer();if(ht)for(let q=0,Y=J.length;q<Y;q++){const at=i.get(J[q]);at.__webglTexture===void 0&&(at.__webglTexture=s.createTexture(),a.memory.textures++)}if(E.samples>0&&ut(E)===!1){B.__webglMultisampledFramebuffer=s.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let q=0;q<J.length;q++){const Y=J[q];B.__webglColorRenderbuffer[q]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,B.__webglColorRenderbuffer[q]);const at=r.convert(Y.format,Y.colorSpace),P=r.convert(Y.type),Z=w(Y.internalFormat,at,P,Y.normalized,Y.colorSpace,E.isXRRenderTarget===!0),W=ue(E);s.renderbufferStorageMultisample(s.RENDERBUFFER,W,Z,E.width,E.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+q,s.RENDERBUFFER,B.__webglColorRenderbuffer[q])}s.bindRenderbuffer(s.RENDERBUFFER,null),E.depthBuffer&&(B.__webglDepthRenderbuffer=s.createRenderbuffer(),mi(B.__webglDepthRenderbuffer,E,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(st){e.bindTexture(s.TEXTURE_CUBE_MAP,tt.__webglTexture),ie(s.TEXTURE_CUBE_MAP,x);for(let q=0;q<6;q++)if(x.mipmaps.length>0)for(let Y=0;Y<x.mipmaps.length;Y++)de(B.__webglFramebuffer[q][Y],E,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+q,Y);else de(B.__webglFramebuffer[q],E,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+q,0);T(x)?b(s.TEXTURE_CUBE_MAP):x.mipmaps.length>0&&s.texParameteri(s.TEXTURE_CUBE_MAP,s.TEXTURE_MAX_LEVEL,x.mipmaps.length-1),e.unbindTexture()}else if(ht){for(let q=0,Y=J.length;q<Y;q++){const at=J[q],P=i.get(at);let Z=s.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(Z=E.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(Z,P.__webglTexture),ie(Z,at),de(B.__webglFramebuffer,E,at,s.COLOR_ATTACHMENT0+q,Z,0),T(at)&&b(Z)}e.unbindTexture()}else{let q=s.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(q=E.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(q,tt.__webglTexture),ie(q,x),x.mipmaps.length>0)for(let Y=0;Y<x.mipmaps.length;Y++)de(B.__webglFramebuffer[Y],E,x,s.COLOR_ATTACHMENT0,q,Y);else de(B.__webglFramebuffer,E,x,s.COLOR_ATTACHMENT0,q,0);T(x)?b(q):x.mipmaps.length>0&&s.texParameteri(q,s.TEXTURE_MAX_LEVEL,x.mipmaps.length-1),e.unbindTexture()}E.depthBuffer&&ei(E)}function U(E){const x=E.textures;for(let B=0,tt=x.length;B<tt;B++){const J=x[B];if(T(J)&&J.mipmapsAutoUpdate===!0){const st=A(E),ht=i.get(J).__webglTexture;e.bindTexture(st,ht),b(st),e.unbindTexture()}}}const si=[];function ce(E){if(E.samples>0){if(ut(E)===!1){const x=E.textures,B=E.width,tt=E.height;let J=s.COLOR_BUFFER_BIT;const st=E.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ht=i.get(E),q=x.length>1;if(q)for(let at=0;at<x.length;at++)e.bindFramebuffer(s.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+at,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,ht.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+at,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,ht.__webglMultisampledFramebuffer),E.texture.mipmaps.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ht.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ht.__webglFramebuffer);for(let at=0;at<x.length;at++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(J|=s.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(J|=s.STENCIL_BUFFER_BIT)),q){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ht.__webglColorRenderbuffer[at]);const P=i.get(x[at]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,P,0)}s.blitFramebuffer(0,0,B,tt,0,0,B,tt,J,s.NEAREST),l===!0&&(si.length=0,si.push(s.COLOR_ATTACHMENT0+at),E.depthBuffer&&E.storeMultisampledDepthBuffer===!1&&si.push(st),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,si))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),q)for(let at=0;at<x.length;at++){e.bindFramebuffer(s.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+at,s.RENDERBUFFER,ht.__webglColorRenderbuffer[at]);const P=i.get(x[at]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,ht.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+at,s.TEXTURE_2D,P,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ht.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.storeMultisampledDepthBuffer===!1&&l){const x=E.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[x])}}}function ue(E){return Math.min(n.maxSamples,E.samples)}function ut(E){const x=i.get(E);return E.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function be(E){const x=a.render.frame;c.get(E)!==x&&(c.set(E,x),E.update())}function Pt(E,x){const B=E.colorSpace,tt=E.format,J=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||B!==tr&&B!==Vi&&(Kt.getTransfer(B)===ee?(tt!==Si||J!==je)&&It("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):jt("WebGLTextures: Unsupported texture color space:",B)),x}function Nt(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(h.width=E.naturalWidth||E.width,h.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(h.width=E.displayWidth,h.height=E.displayHeight):(h.width=E.width,h.height=E.height),h}this.allocateTextureUnit=Ot,this.resetTextureUnits=Q,this.getTextureUnits=j,this.setTextureUnits=yt,this.setTexture2D=pt,this.setTexture2DArray=vt,this.setTexture3D=Ct,this.setTextureCube=mt,this.rebindTextures=ii,this.setupRenderTarget=ni,this.updateRenderTargetMipmap=U,this.updateMultisampleRenderTarget=ce,this.setupDepthRenderbuffer=ei,this.setupFrameBufferTexture=de,this.useMultisampledRTT=ut,this.dispose=V}function Sm(s,t){function e(i,n=Vi){let r;const a=Kt.getTransfer(n);if(i===je)return s.UNSIGNED_BYTE;if(i===Ga)return s.UNSIGNED_SHORT_4_4_4_4;if(i===Ha)return s.UNSIGNED_SHORT_5_5_5_1;if(i===Al)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===Rl)return s.UNSIGNED_INT_10F_11F_11F_REV;if(i===wl)return s.BYTE;if(i===Tl)return s.SHORT;if(i===ss)return s.UNSIGNED_SHORT;if(i===ka)return s.INT;if(i===yi)return s.UNSIGNED_INT;if(i===Mi)return s.FLOAT;if(i===Ze)return s.HALF_FLOAT;if(i===Cl)return s.ALPHA;if(i===Pl)return s.RGB;if(i===Si)return s.RGBA;if(i===$i)return s.DEPTH_COMPONENT;if(i===Xi)return s.DEPTH_STENCIL;if(i===Ll)return s.RED;if(i===Va)return s.RED_INTEGER;if(i===hn)return s.RG;if(i===Wa)return s.RG_INTEGER;if(i===Xa)return s.RGBA_INTEGER;if(i===Xs||i===qs||i===Ys||i===Ks)if(a===ee)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Xs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===qs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ys)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ks)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Xs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===qs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ys)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ks)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Qr||i===jr||i===ta||i===ea)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Qr)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===jr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ta)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ea)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ia||i===na||i===sa||i===ra||i===aa||i===Qs||i===oa)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===ia||i===na)return a===ee?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===sa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===ra)return r.COMPRESSED_R11_EAC;if(i===aa)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Qs)return r.COMPRESSED_RG11_EAC;if(i===oa)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===la||i===ha||i===ca||i===ua||i===da||i===fa||i===pa||i===ma||i===ga||i===_a||i===xa||i===va||i===Ma||i===Sa)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===la)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===ha)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ca)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ua)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===da)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===fa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===pa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ma)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ga)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===_a)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===xa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===va)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ma)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Sa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ya||i===ba||i===Ea)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===ya)return a===ee?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ba)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ea)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===wa||i===Ta||i===js||i===Aa)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===wa)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Ta)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===js)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Aa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Nn?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:e}}const ym=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,bm=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Em{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new Kl(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Ke({vertexShader:ym,fragmentShader:bm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new _t(new qe(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class wm extends cn{constructor(t,e){super();const i=this;let n=null,r=1,a=null,o="local-floor",l=1,h=null,c=null,u=null,d=null,p=null,_=null;const S=typeof XRWebGLBinding<"u",m=new Em,f={},v=e.getContextAttributes();let T=null,b=null;const A=[],w=[],g=new Tt;let y=null,L=null;const R=new ai;R.viewport=new me;const N=new ai;N.viewport=new me;const F=[R,N],H=new Ic;let I=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let pt=A[K];return pt===void 0&&(pt=new Er,A[K]=pt),pt.getTargetRaySpace()},this.getControllerGrip=function(K){let pt=A[K];return pt===void 0&&(pt=new Er,A[K]=pt),pt.getGripSpace()},this.getHand=function(K){let pt=A[K];return pt===void 0&&(pt=new Er,A[K]=pt),pt.getHandSpace()};function $(K){const pt=w.indexOf(K.inputSource);if(pt===-1)return;const vt=A[pt];vt!==void 0&&(vt.update(K.inputSource,K.frame,h||a),vt.dispatchEvent({type:K.type,data:K.inputSource}))}function k(){n.removeEventListener("select",$),n.removeEventListener("selectstart",$),n.removeEventListener("selectend",$),n.removeEventListener("squeeze",$),n.removeEventListener("squeezestart",$),n.removeEventListener("squeezeend",$),n.removeEventListener("end",k),n.removeEventListener("inputsourceschange",et);for(let K=0;K<A.length;K++){const pt=w[K];pt!==null&&(w[K]=null,A[K].disconnect(pt))}I=null,V=null,m.reset();for(const K in f)delete f[K];if(t.setRenderTarget(T),p=null,d=null,u=null,n=null,b=null,Ot.stop(),i.isPresenting=!1,t.setPixelRatio(y),t.setSize(g.width,g.height,!1),L!==null){const K=L.camera;K.fov=L.fov,K.zoom=L.zoom,K.updateProjectionMatrix(),L=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,i.isPresenting===!0&&It("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,i.isPresenting===!0&&It("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(K){h=K},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u===null&&S&&(u=new XRWebGLBinding(n,e)),u},this.getFrame=function(){return _},this.getSession=function(){return n},this.setSession=async function(K){if(n=K,n!==null){if(T=t.getRenderTarget(),n.addEventListener("select",$),n.addEventListener("selectstart",$),n.addEventListener("selectend",$),n.addEventListener("squeeze",$),n.addEventListener("squeezestart",$),n.addEventListener("squeezeend",$),n.addEventListener("end",k),n.addEventListener("inputsourceschange",et),v.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(g),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let vt=null,Ct=null,mt=null;v.depth&&(mt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,vt=v.stencil?Xi:$i,Ct=v.stencil?Nn:yi);const kt={colorFormat:e.RGBA8,depthFormat:mt,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(kt),n.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),b=new $e(d.textureWidth,d.textureHeight,{format:Si,type:je,depthTexture:new Un(d.textureWidth,d.textureHeight,Ct,void 0,void 0,void 0,void 0,void 0,void 0,vt),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{const vt={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(n,e,vt),n.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),b=new $e(p.framebufferWidth,p.framebufferHeight,{format:Si,type:je,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),h=null,a=await n.requestReferenceSpace(o),Ot.setContext(n),Ot.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function et(K){for(let pt=0;pt<K.removed.length;pt++){const vt=K.removed[pt],Ct=w.indexOf(vt);Ct>=0&&(w[Ct]=null,A[Ct].disconnect(vt))}for(let pt=0;pt<K.added.length;pt++){const vt=K.added[pt];let Ct=w.indexOf(vt);if(Ct===-1){for(let kt=0;kt<A.length;kt++)if(kt>=w.length){w.push(vt),Ct=kt;break}else if(w[kt]===null){w[kt]=vt,Ct=kt;break}if(Ct===-1)break}const mt=A[Ct];mt&&mt.connect(vt)}}function X(K,pt){pt===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(pt.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(n===null)return;let pt=K.near,vt=K.far;m.texture!==null&&(m.depthNear>0&&(pt=m.depthNear),m.depthFar>0&&(vt=m.depthFar)),H.near=N.near=R.near=pt,H.far=N.far=R.far=vt,(I!==H.near||V!==H.far)&&(n.updateRenderState({depthNear:H.near,depthFar:H.far}),I=H.near,V=H.far),H.layers.mask=K.layers.mask|6,R.layers.mask=H.layers.mask&-5,N.layers.mask=H.layers.mask&-3;const Ct=K.parent,mt=H.cameras;X(H,Ct);for(let kt=0;kt<mt.length;kt++)X(mt[kt],Ct);H.projectionMatrix.copy(R.projectionMatrix),H.projectionMatrixInverse.copy(R.projectionMatrixInverse),L===null&&K.isPerspectiveCamera&&(L={camera:K,fov:K.fov,zoom:K.zoom}),Q(K,H,Ct)};function Q(K,pt,vt){vt===null?K.matrix.copy(pt.matrixWorld):(K.matrix.copy(vt.matrixWorld),K.matrix.invert(),K.matrix.multiply(pt.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(pt.projectionMatrix),K.projectionMatrixInverse.copy(pt.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Ca*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return H},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(K){l=K,d!==null&&(d.fixedFoveation=K),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=K)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(H)},this.getCameraTexture=function(K){return f[K]};let j=null;function yt(K,pt){if(c=pt.getViewerPose(h||a),_=pt,c!==null){const vt=c.views;p!==null&&(t.setRenderTargetFramebuffer(b,p.framebuffer),t.setRenderTarget(b));let Ct=!1;vt.length!==H.cameras.length&&(H.cameras.length=0,Ct=!0);for(let Dt=0;Dt<vt.length;Dt++){const ie=vt[Dt];let se=null;if(p!==null)se=p.getViewport(ie);else{const Ie=u.getViewSubImage(d,ie);se=Ie.viewport,Dt===0&&(t.setRenderTargetTextures(b,Ie.colorTexture,Ie.depthStencilTexture),t.setRenderTarget(b))}let Xt=F[Dt];Xt===void 0&&(Xt=new ai,Xt.layers.enable(Dt),Xt.viewport=new me,F[Dt]=Xt),Xt.matrix.fromArray(ie.transform.matrix),Xt.matrix.decompose(Xt.position,Xt.quaternion,Xt.scale),Xt.projectionMatrix.fromArray(ie.projectionMatrix),Xt.projectionMatrixInverse.copy(Xt.projectionMatrix).invert(),Xt.viewport.set(se.x,se.y,se.width,se.height),Dt===0&&(H.matrix.copy(Xt.matrix),H.matrix.decompose(H.position,H.quaternion,H.scale)),Ct===!0&&H.cameras.push(Xt)}const mt=n.enabledFeatures;if(mt&&mt.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&S){u=i.getBinding();const Dt=u.getDepthInformation(vt[0]);Dt&&Dt.isValid&&Dt.texture&&m.init(Dt,n.renderState)}if(mt&&mt.includes("camera-access")&&S){t.state.unbindTexture(),u=i.getBinding();for(let Dt=0;Dt<vt.length;Dt++){const ie=vt[Dt].camera;if(ie){let se=f[ie];se||(se=new Kl,f[ie]=se);const Xt=u.getCameraImage(ie);se.sourceTexture=Xt}}}}for(let vt=0;vt<A.length;vt++){const Ct=w[vt],mt=A[vt];Ct!==null&&mt!==void 0&&mt.update(Ct,pt,h||a)}j&&j(K,pt),pt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:pt}),_=null}const Ot=new jl;Ot.setAnimationLoop(yt),this.setAnimationLoop=function(K){j=K},this.dispose=function(){}}}const Tm=new he,hh=new Ut;hh.set(-1,0,0,0,1,0,0,0,1);function Am(s,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,Zl(s)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function n(m,f,v,T,b){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?r(m,f):f.isMeshLambertMaterial?(r(m,f),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),c(m,f),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,b)):f.isMeshMatcapMaterial?(r(m,f),_(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),S(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,v,T):f.isSpriteMaterial?h(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===We&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===We&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const v=t.get(f),T=v.envMap,b=v.envMapRotation;T&&(m.envMap.value=T,m.envMapRotation.value.setFromMatrix4(Tm.makeRotationFromEuler(b)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(hh),m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,v,T){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*v,m.scale.value=T*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,v){m.ior.value=f.ior,f.diffuseRoughness>0&&(m.diffuseRoughness.value=f.diffuseRoughness,f.diffuseRoughnessMap&&(m.diffuseRoughnessMap.value=f.diffuseRoughnessMap,e(f.diffuseRoughnessMap,m.diffuseRoughnessMapTransform))),f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===We&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.retroreflectivity>0&&(m.retroreflectivity.value=f.retroreflectivity),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessMinimum,m.iridescenceThicknessMaximum.value=f.iridescenceThicknessMaximum,f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,f){f.matcap&&(m.matcap.value=f.matcap)}function S(m,f){const v=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function Rm(s,t,e,i){let n={},r={};function a(v,T){const b=T.program;i.uniformBlockBinding(v,b,n[v.id])}function o(v,T){let b=n[v.id];b===void 0&&(_(v),b=l(v),n[v.id]=b,v.addEventListener("dispose",m));const A=T.program;i.updateUBOMapping(v,A);const w=t.render.frame;r[v.id]!==w&&(h(v),r[v.id]=w)}function l(v){const T=s.createBuffer(),b=v.__size,A=v.usage;return s.bindBuffer(s.UNIFORM_BUFFER,T),s.bufferData(s.UNIFORM_BUFFER,b,A),s.bindBuffer(s.UNIFORM_BUFFER,null),T}function h(v){const T=n[v.id],b=v.uniforms,A=v.__cache;s.bindBuffer(s.UNIFORM_BUFFER,T);for(let w=0,g=b.length;w<g;w++){const y=b[w];if(Array.isArray(y))for(let L=0,R=y.length;L<R;L++)c(y[L],w,L,A);else c(y,w,0,A)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function c(v,T,b,A){if(d(v,T,b,A)===!0){const w=v.__offset,g=v.value;if(Array.isArray(g)){let y=0;for(let L=0;L<g.length;L++){const R=g[L],N=S(R,!0);u(R,v.__data,y),y+=N.storage/Float32Array.BYTES_PER_ELEMENT}}else u(g,v.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,w,v.__data)}}function u(v,T,b){typeof v=="number"||typeof v=="boolean"?T[b]=v:v.isMatrix3?(T[b]=v.elements[0],T[b+1]=v.elements[1],T[b+2]=v.elements[2],T[b+3]=0,T[b+4]=v.elements[3],T[b+5]=v.elements[4],T[b+6]=v.elements[5],T[b+7]=0,T[b+8]=v.elements[6],T[b+9]=v.elements[7],T[b+10]=v.elements[8],T[b+11]=0):ArrayBuffer.isView(v)?T.set(v.subarray(0,T.length-b),b):v.toArray(T,b)}function d(v,T,b,A){const w=v.value,g=T+"_"+b;if(Array.isArray(w)){A[g]===void 0&&(A[g]=[]);const y=A[g];let L=!1;for(let R=0;R<w.length;R++)p(w[R],y,R)===!0&&(L=!0);return L}return p(w,A,g)}function p(v,T,b){if(T[b]===void 0)return typeof v=="number"||typeof v=="boolean"?T[b]=v:ArrayBuffer.isView(v)?T[b]=v.slice():T[b]=v.clone(),!0;{const A=T[b];if(typeof v=="number"||typeof v=="boolean"){if(A!==v)return T[b]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(A.equals(v)===!1)return A.copy(v),!0}}return!1}function _(v){const T=v.uniforms;let b=0;const A=16;for(let g=0,y=T.length;g<y;g++){const L=Array.isArray(T[g])?T[g]:[T[g]];for(let R=0,N=L.length;R<N;R++){const F=L[R],H=Array.isArray(F.value)?F.value:[F.value],I=Array.isArray(T[g])||Array.isArray(F.value);let V=b;for(let k=0,et=H.length;k<et;k++){const X=H[k],Q=S(X,I),j=b%A,yt=j%Q.boundary,Ot=j+yt;b+=yt,Ot!==0&&A-Ot<Q.storage&&(b+=A-Ot),k===0&&(V=b),b+=Q.storage}const $=F.type==="int"?Int32Array:F.type==="uint"?Uint32Array:Float32Array;F.__data=new $((b-V)/Float32Array.BYTES_PER_ELEMENT),F.__offset=V}}const w=b%A;return w>0&&(b+=A-w),v.__size=b,v.__cache={},this}function S(v,T){const b={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(b.boundary=4,b.storage=4):v.isVector2?(b.boundary=8,b.storage=8):v.isVector3||v.isColor?(b.boundary=16,b.storage=12):v.isVector4?(b.boundary=16,b.storage=16):v.isMatrix3?(b.boundary=16,b.storage=48):v.isMatrix4?(b.boundary=16,b.storage=64):v.isTexture?It("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(b.boundary=16,b.storage=v.byteLength):It("WebGLRenderer: Unsupported uniform value type.",v),T===!0&&(b.boundary=16,b.storage=Math.ceil(b.storage/16)*16),b}function m(v){const T=v.target;T.removeEventListener("dispose",m),s.deleteBuffer(n[T.id]),delete n[T.id],delete r[T.id]}function f(){for(const v in n)s.deleteBuffer(n[v]);n={},r={}}return{bind:a,update:o,dispose:f}}const Cm=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let _i=null;function Pm(){return _i===null&&(_i=new yc(Cm,16,16,hn,Ze),_i.name="DFG_LUT",_i.minFilter=Ye,_i.magFilter=Ye,_i.wrapS=Pi,_i.wrapT=Pi,_i.generateMipmaps=!1,_i.needsUpdate=!0),_i}class Lm{constructor(t={}){const{canvas:e=Zh(),context:i=null,depth:n=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:h=!1,powerPreference:c="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:p=je}=t;this.isWebGLRenderer=!0;let _;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=i.getContextAttributes().alpha}else _=a;const S=p,m=new Set([Xa,Wa,Va]),f=new Set([je,yi,ss,Nn,Ga,Ha]),v=new Uint32Array(4),T=new Int32Array(4),b={textures:[],min:[],max:[],resolution:[]};let A=null,w=null;const g=[],y=[];let L=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Di,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let N=!1,F=null,H=null,I=null,V=null;this._outputColorSpace=Me;let $=0,k=0,et=null,X=-1,Q=null;const j=new me,yt=new me;let Ot=null;const K=new Ft(0);let pt=0,vt=e.width,Ct=e.height,mt=1,kt=null,_e=null;const Dt=new me(0,0,vt,Ct),ie=new me(0,0,vt,Ct);let se=!1;const Xt=new as,Ie=new Ka;let ye=!1,Xe=!1;const de=new he,mi=new C,Ae=new me,ei={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ii=!1;function ni(){return et===null?mt:1}let U=i;function si(M,D){return e.getContext(M,D)}let ce,ue,ut,be,Pt,Nt,E,x,B,tt,J,st,ht,q,Y,at,P,Z,W,ot,nt,rt,At;try{const M={alpha:!0,depth:n,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:h,powerPreference:c,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ia}`),e.addEventListener("webglcontextlost",Rt,!1),e.addEventListener("webglcontextrestored",Gt,!1),e.addEventListener("webglcontextcreationerror",dt,!1),U===null){const D="webgl2";if(U=si(D,M),U===null)throw si(D)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ht()}catch(M){throw e.removeEventListener("webglcontextlost",Rt,!1),e.removeEventListener("webglcontextrestored",Gt,!1),e.removeEventListener("webglcontextcreationerror",dt,!1),jt("WebGLRenderer: "+M.message),M}function Ht(){ce=new Nf(U),ce.init(),nt=new Sm(U,ce),ue=new bf(U,ce,t,nt),ut=new vm(U,ce),ue.reversedDepthBuffer&&d&&ut.buffers.depth.setReversed(!0),H=U.createFramebuffer(),I=U.createFramebuffer(),V=U.createFramebuffer(),be=new Of(U),Pt=new rm,Nt=new Mm(U,ce,ut,Pt,ue,nt,be),E=new If(R),x=new Bc(U),rt=new Sf(U,x),B=new Uf(U,x,be,rt),tt=new zf(U,B,x,rt,be),Z=new Bf(U,ue,Nt),Y=new Ef(Pt),J=new sm(R,E,ce,ue,rt,Y),st=new Am(R,Pt),ht=new om,q=new fm(ce),P=new Mf(R,E,ut,tt,_,l),at=new xm(R,tt,ue),At=new Rm(U,be,ue,ut),W=new yf(U,ce,be),ot=new Ff(U,ce,be),be.programs=J.programs,R.capabilities=ue,R.extensions=ce,R.properties=Pt,R.renderLists=ht,R.shadowMap=at,R.state=ut,R.info=be}S!==je&&(L=new Gf(S,e.width,e.height,o,n,r));const it=new wm(R,U);this.xr=it,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const M=ce.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=ce.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return mt},this.setPixelRatio=function(M){M!==void 0&&(mt=M,this.setSize(vt,Ct,!1))},this.getSize=function(M){return M.set(vt,Ct)},this.setSize=function(M,D,G=!0){if(it.isPresenting){It("WebGLRenderer: Can't change size while VR device is presenting.");return}vt=M,Ct=D,e.width=Math.floor(M*mt),e.height=Math.floor(D*mt),G===!0&&(e.style.width=M+"px",e.style.height=D+"px"),L!==null&&L.setSize(e.width,e.height),this.setViewport(0,0,M,D)},this.getDrawingBufferSize=function(M){return M.set(vt*mt,Ct*mt).floor()},this.setDrawingBufferSize=function(M,D,G){vt=M,Ct=D,mt=G,e.width=Math.floor(M*G),e.height=Math.floor(D*G),this.setViewport(0,0,M,D)},this.setEffects=function(M){if(S===je){jt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let D=0;D<M.length;D++)if(M[D].isOutputPass===!0){It("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}L.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(j)},this.getViewport=function(M){return M.copy(Dt)},this.setViewport=function(M,D,G,O){M.isVector4?Dt.set(M.x,M.y,M.z,M.w):Dt.set(M,D,G,O),ut.viewport(j.copy(Dt).multiplyScalar(ni()).round())},this.getScissor=function(M){return M.copy(ie)},this.setScissor=function(M,D,G,O){M.isVector4?ie.set(M.x,M.y,M.z,M.w):ie.set(M,D,G,O),ut.scissor(yt.copy(ie).multiplyScalar(ni()).round())},this.getScissorTest=function(){return se},this.setScissorTest=function(M){ut.setScissorTest(se=M)},this.setOpaqueSort=function(M){kt=M},this.setTransparentSort=function(M){_e=M},this.getClearColor=function(M){return M.copy(P.getClearColor())},this.setClearColor=function(){P.setClearColor(...arguments)},this.getClearAlpha=function(){return P.getClearAlpha()},this.setClearAlpha=function(){P.setClearAlpha(...arguments)},this.clear=function(M=!0,D=!0,G=!0){let O=0;if(M){let z=!1;if(et!==null){const ct=et.texture.format;z=m.has(ct)}if(z){const ct=et.texture.type,xt=f.has(ct),lt=P.getClearColor(),gt=P.getClearAlpha(),bt=lt.r,Bt=lt.g,qt=lt.b;xt?(v[0]=bt,v[1]=Bt,v[2]=qt,v[3]=gt,U.clearBufferuiv(U.COLOR,0,v)):(T[0]=bt,T[1]=Bt,T[2]=qt,T[3]=gt,U.clearBufferiv(U.COLOR,0,T))}else O|=U.COLOR_BUFFER_BIT}D&&(O|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),G&&(O|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O!==0&&U.clear(O)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),F=M},this.dispose=function(){e.removeEventListener("webglcontextlost",Rt,!1),e.removeEventListener("webglcontextrestored",Gt,!1),e.removeEventListener("webglcontextcreationerror",dt,!1),P.dispose(),ht.dispose(),q.dispose(),Nt.dispose(),Pt.dispose(),E.dispose(),tt.dispose(),B.dispose(),rt.dispose(),At.dispose(),J.dispose(),it.dispose(),it.removeEventListener("sessionstart",oo),it.removeEventListener("sessionend",lo),Qi.stop()};function Rt(M){M.preventDefault(),nr("WebGLRenderer: Context Lost."),N=!0}function Gt(){nr("WebGLRenderer: Context Restored."),N=!1;const M=be.autoReset,D=at.enabled,G=at.autoUpdate,O=at.needsUpdate,z=at.type;Ht(),be.autoReset=M,at.enabled=D,at.autoUpdate=G,at.needsUpdate=O,at.type=z}function dt(M){jt("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function ne(M){const D=M.target;D.removeEventListener("dispose",ne),Re(D)}function Re(M){Ui(M),Pt.remove(M)}function Ui(M){const D=Pt.get(M).programs;D!==void 0&&(D.forEach(function(G){J.releaseProgram(G)}),M.isShaderMaterial&&J.releaseShaderCache(M))}this.renderBufferDirect=function(M,D,G,O,z,ct){D===null&&(D=ei);const xt=z.isMesh&&z.matrixWorld.determinantAffine()<0,lt=ph(M,D,G,O,z);ut.setMaterial(O,xt);let gt=G.index,bt=1;if(O.wireframe===!0){if(gt=B.getWireframeAttribute(G),gt===void 0)return;bt=2}const Bt=G.drawRange,qt=G.attributes.position;let Mt=Bt.start*bt,Yt=(Bt.start+Bt.count)*bt;ct!==null&&(Mt=Math.max(Mt,ct.start*bt),Yt=Math.min(Yt,(ct.start+ct.count)*bt)),gt!==null?(Mt=Math.max(Mt,0),Yt=Math.min(Yt,gt.count)):qt!=null&&(Mt=Math.max(Mt,0),Yt=Math.min(Yt,qt.count));const xe=Yt-Mt;if(xe<0||xe===1/0)return;rt.setup(z,O,lt,G,gt);let le,re=W;if(gt!==null&&(le=x.get(gt),re=ot,re.setIndex(le)),z.isMesh)O.wireframe===!0?(ut.setLineWidth(O.wireframeLinewidth*ni()),re.setMode(U.LINES)):re.setMode(U.TRIANGLES);else if(z.isLine){let Fe=O.linewidth;Fe===void 0&&(Fe=1),ut.setLineWidth(Fe*ni()),z.isLineSegments?re.setMode(U.LINES):z.isLineLoop?re.setMode(U.LINE_LOOP):re.setMode(U.LINE_STRIP)}else z.isPoints?re.setMode(U.POINTS):z.isSprite&&re.setMode(U.TRIANGLES);if(z.isBatchedMesh)if(ce.get("WEBGL_multi_draw"))re.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Fe=z._multiDrawStarts,St=z._multiDrawCounts,Ge=z._multiDrawCount,te=gt?x.get(gt).bytesPerElement:1,ji=Pt.get(O).currentProgram.getUniforms();for(let Oe=0;Oe<Ge;Oe++)ji.setValue(U,"_gl_DrawID",Oe),re.render(Fe[Oe]/te,St[Oe])}else if(z.isInstancedMesh)re.renderInstances(Mt,xe,z.count);else if(G.isInstancedBufferGeometry){const Fe=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,St=Math.min(G.instanceCount,Fe);re.renderInstances(Mt,xe,St)}else re.render(Mt,xe)};function ao(M,D,G,O){F!==null&&M.isNodeMaterial&&F.setObject(O,M),ye===!0&&Y.setState(M,G,!1),M.transparent===!0&&M.side===Se&&M.forceSinglePass===!1?(M.side=We,M.needsUpdate=!0,Hn(M,D,O),M.side=Zi,M.needsUpdate=!0,Hn(M,D,O),M.side=Se):Hn(M,D,O)}this.compile=function(M,D,G=null){G===null&&(G=M),F!==null&&F.renderStart(M,D,G),w=q.get(G),w.init(D),y.push(w),G.traverseVisible(function(z){z.isLight&&z.layers.test(D.layers)&&(w.pushLight(z),z.castShadow&&w.pushShadow(z))}),M!==G&&M.traverseVisible(function(z){z.isLight&&z.layers.test(D.layers)&&(w.pushLight(z),z.castShadow&&w.pushShadow(z))}),w.setupLights(),F!==null&&F.updateLights(w.state.lightsArray),Xe=this.localClippingEnabled,ye=Y.init(this.clippingPlanes,Xe),ye===!0&&Y.setGlobalState(this.clippingPlanes,D),F!==null&&at.render(w.state.shadowsArray,G,D);const O=new Set;return M.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const ct=z.material;if(ct)if(Array.isArray(ct))for(let xt=0;xt<ct.length;xt++){const lt=ct[xt];ao(lt,G,D,z),O.add(lt)}else ao(ct,G,D,z),O.add(ct)}),w=y.pop(),F!==null&&F.renderEnd(),O},this.compileAsync=function(M,D,G=null){const O=this.compile(M,D,G);return new Promise(z=>{function ct(){if(O.forEach(function(xt){const gt=Pt.get(xt).currentProgram;(gt===void 0||gt.isReady())&&O.delete(xt)}),O.size===0){z(M);return}setTimeout(ct,10)}ce.get("KHR_parallel_shader_compile")!==null?ct():setTimeout(ct,10)})};let dr=null;function dh(M){dr&&dr(M)}function oo(){Qi.stop()}function lo(){Qi.start()}const Qi=new jl;Qi.setAnimationLoop(dh),typeof self<"u"&&Qi.setContext(self),this.setAnimationLoop=function(M){dr=M,it.setAnimationLoop(M),M===null?Qi.stop():Qi.start()},it.addEventListener("sessionstart",oo),it.addEventListener("sessionend",lo),this.render=function(M,D){if(D!==void 0&&D.isCamera!==!0){jt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;F!==null&&F.renderStart(M,D);const G=it.enabled===!0&&it.isPresenting===!0,O=L!==null&&(et===null||G)&&L.begin(R,et);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),it.enabled===!0&&it.isPresenting===!0&&(L===null||L.isCompositing()===!1)&&(it.cameraAutoUpdate===!0&&it.updateCamera(D),D=it.getCamera()),M.isScene===!0&&M.onBeforeRender(R,M,D,et),w=q.get(M,y.length),w.init(D),w.state.textureUnits=Nt.getTextureUnits(),y.push(w),de.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),D.isArrayCamera?Ie.setFromArrayCamera(D):Xt.setFromProjectionMatrix(de,fi,D.reversedDepth),Xe=this.localClippingEnabled,ye=Y.init(this.clippingPlanes,Xe),A=ht.get(M,g.length),A.init(),g.push(A),this.info.render.frame++,it.enabled===!0&&it.isPresenting===!0){const xt=R.xr.getDepthSensingMesh();xt!==null&&fr(xt,D,-1/0,R.sortObjects)}fr(M,D,0,R.sortObjects),A.finish(),F!==null&&F.updateLights(w.state.lightsArray),R.sortObjects===!0&&A.sort(kt,_e),ii=it.enabled===!1||it.isPresenting===!1||it.hasDepthSensing()===!1,ii&&P.addToRenderList(A,M),this.info.autoReset===!0&&this.info.reset(),ye===!0&&Y.beginShadows();const z=w.state.shadowsArray;if(at.render(z,M,D),ye===!0&&Y.endShadows(),(O&&L.hasRenderPass())===!1){const xt=A.opaque,lt=A.transmissive;if(w.setupLights(),D.isArrayCamera){const gt=D.cameras;if(lt.length>0)for(let bt=0,Bt=gt.length;bt<Bt;bt++){const qt=gt[bt];co(xt,lt,M,qt)}ii&&P.render(M);for(let bt=0,Bt=gt.length;bt<Bt;bt++){const qt=gt[bt];ho(A,M,qt,qt.viewport)}}else lt.length>0&&co(xt,lt,M,D),ii&&P.render(M),ho(A,M,D)}et!==null&&k===0&&(Nt.updateMultisampleRenderTarget(et),Nt.updateRenderTargetMipmap(et)),O&&L.end(R),M.isScene===!0&&M.onAfterRender(R,M,D),rt.resetDefaultState(),X=-1,Q=null,y.pop(),y.length>0?(w=y[y.length-1],Nt.setTextureUnits(w.state.textureUnits),ye===!0&&Y.setGlobalState(R.clippingPlanes,w.state.camera)):w=null,g.pop(),g.length>0?A=g[g.length-1]:A=null,F!==null&&F.renderEnd()};function fr(M,D,G,O){if(M.visible===!1)return;if(M.layers.test(D.layers)){if(M.isGroup)G=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(D);else if(M.isLight)w.pushLight(M),M.castShadow&&w.pushShadow(M);else if(M.isSprite){const xt=D.isArrayCamera?Ie:Xt;if(!M.frustumCulled||M.intersectsFrustum(xt)){O&&Ae.setFromMatrixPosition(M.matrixWorld).applyMatrix4(de);const lt=tt.update(M),gt=M.material;gt.visible&&A.push(M,lt,gt,G,Ae.z,null,D)}}else if(M.isMesh||M.isLine||M.isPoints){const xt=D.isArrayCamera?Ie:Xt;if(!M.frustumCulled||M.intersectsFrustum(xt)){const lt=tt.update(M),gt=M.material;if(O&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Ae.copy(M.boundingSphere.center)):(lt.boundingSphere===null&&lt.computeBoundingSphere(),Ae.copy(lt.boundingSphere.center)),Ae.applyMatrix4(M.matrixWorld).applyMatrix4(de)),Array.isArray(gt)){const bt=lt.groups;for(let Bt=0,qt=bt.length;Bt<qt;Bt++){const Mt=bt[Bt],Yt=gt[Mt.materialIndex];Yt&&Yt.visible&&A.push(M,lt,Yt,G,Ae.z,Mt,D)}}else gt.visible&&A.push(M,lt,gt,G,Ae.z,null,D)}}}const ct=M.children;for(let xt=0,lt=ct.length;xt<lt;xt++)fr(ct[xt],D,G,O)}function ho(M,D,G,O){const{opaque:z,transmissive:ct,transparent:xt}=M;w.setupLightsView(G),ye===!0&&Y.setGlobalState(R.clippingPlanes,G),O&&ut.viewport(j.copy(O)),z.length>0&&ds(z,D,G),ct.length>0&&ds(ct,D,G),xt.length>0&&ds(xt,D,G),ut.buffers.depth.setTest(!0),ut.buffers.depth.setMask(!0),ut.buffers.color.setMask(!0),ut.setPolygonOffset(!1)}function co(M,D,G,O){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[O.id]===void 0){const Mt=ce.has("EXT_color_buffer_half_float")||ce.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[O.id]=new $e(1,1,{generateMipmaps:!0,type:Mt?Ze:je,minFilter:Wi,samples:Math.max(4,ue.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Kt.workingColorSpace})}const ct=w.state.transmissionRenderTarget[O.id],xt=O.viewport||j;ct.setSize(xt.z*R.transmissionResolutionScale,xt.w*R.transmissionResolutionScale);const lt=R.getRenderTarget(),gt=R.getActiveCubeFace(),bt=R.getActiveMipmapLevel();R.setRenderTarget(ct),R.getClearColor(K),pt=R.getClearAlpha(),pt<1&&R.setClearColor(16777215,.5),R.clear(),ii&&P.render(G);const Bt=R.toneMapping;R.toneMapping=Di;const qt=O.viewport;if(O.viewport!==void 0&&(O.viewport=void 0),w.setupLightsView(O),ye===!0&&Y.setGlobalState(R.clippingPlanes,O),ds(M,G,O),Nt.updateMultisampleRenderTarget(ct),Nt.updateRenderTargetMipmap(ct),ce.has("WEBGL_multisampled_render_to_texture")===!1){let Mt=!1;for(let Yt=0,xe=D.length;Yt<xe;Yt++){const le=D[Yt],{object:re,geometry:Fe,material:St,group:Ge}=le;if(St.side===Se&&re.layers.test(O.layers)){const te=St.side;St.side=We,St.needsUpdate=!0,uo(re,G,O,Fe,St,Ge),St.side=te,St.needsUpdate=!0,Mt=!0}}Mt===!0&&(Nt.updateMultisampleRenderTarget(ct),Nt.updateRenderTargetMipmap(ct))}R.setRenderTarget(lt,gt,bt),R.setClearColor(K,pt),qt!==void 0&&(O.viewport=qt),R.toneMapping=Bt}function ds(M,D,G){const O=D.isScene===!0?D.overrideMaterial:null;for(let z=0,ct=M.length;z<ct;z++){const xt=M[z],{object:lt,geometry:gt,group:bt}=xt;let Bt=xt.material;Bt.allowOverride===!0&&O!==null&&(Bt=O),lt.layers.test(G.layers)&&uo(lt,D,G,gt,Bt,bt)}}function uo(M,D,G,O,z,ct){F!==null&&z.isNodeMaterial&&F.setObject(M,z),M.onBeforeRender(R,D,G,O,z,ct),M.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),z.onBeforeRender(R,D,G,O,M,ct),z.transparent===!0&&z.side===Se&&z.forceSinglePass===!1?(z.side=We,z.needsUpdate=!0,R.renderBufferDirect(G,D,O,z,M,ct),z.side=Zi,z.needsUpdate=!0,R.renderBufferDirect(G,D,O,z,M,ct),z.side=Se):R.renderBufferDirect(G,D,O,z,M,ct),M.onAfterRender(R,D,G,O,z,ct)}function fo(M){let D=0;for(const G of M)G.texture!==null&&D++;return D}function Hn(M,D,G){D.isScene!==!0&&(D=ei);const O=Pt.get(M),z=w.state.lights,ct=w.state.shadowsArray,xt=z.state.version,lt=J.getParameters(M,z.state,ct,D,G,w.state.lightProbeGridArray),gt=J.getProgramCacheKey(lt);let bt=O.programs;O.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?D.environment:null,O.fog=D.fog;const Bt=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;O.envMap=E.get(M.envMap||O.environment,Bt),O.envMapRotation=O.environment!==null&&M.envMap===null?D.environmentRotation:M.envMapRotation,bt===void 0&&(M.addEventListener("dispose",ne),bt=new Map,O.programs=bt,O.programVariants=new Map);let qt=bt.get(gt);if(qt!==void 0){if(O.currentProgram===qt&&O.lightsStateVersion===xt)return mo(M,lt),qt}else lt.uniforms=J.getUniforms(M),F!==null&&M.isNodeMaterial&&F.build(M,G,lt),M.onBeforeCompile(lt,R),qt=J.acquireProgram(lt,gt),bt.set(gt,qt),O.uniforms=lt.uniforms;const Mt=O.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Mt.clippingPlanes=Y.uniform),mo(M,lt),O.needsLights=gh(M),O.lightsStateVersion=xt,O.needsLights&&(Mt.ambientLightColor.value=z.state.ambient,Mt.lightProbe.value=z.state.probe,Mt.sunLights.value=z.state.sun,Mt.sunLightShadows.value=z.state.sunShadow,Mt.directionalLights.value=z.state.directional,Mt.directionalLightShadows.value=z.state.directionalShadow,Mt.spotLights.value=z.state.spot,Mt.spotLightShadows.value=z.state.spotShadow,Mt.rectAreaLights.value=z.state.rectArea,Mt.ltc_1.value=z.state.rectAreaLTC1,Mt.ltc_2.value=z.state.rectAreaLTC2,Mt.pointLights.value=z.state.point,Mt.pointLightShadows.value=z.state.pointShadow,Mt.hemisphereLights.value=z.state.hemi,Mt.sunShadowMatrix.value=z.state.sunShadowMatrix,Mt.sunShadowCascade.value=z.state.sunShadowCascade,Mt.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Mt.spotLightMatrix.value=z.state.spotLightMatrix,Mt.spotLightMap.value=z.state.spotLightMap,Mt.pointShadowMatrix.value=z.state.pointShadowMatrix),O.numLightProbeGrids=fo(w.state.lightProbeGridArray),O.currentProgram=qt,O.uniformsList=null,qt}function fh(M,D,G,O,z){const ct=Pt.get(M),xt=ct.currentProgram.id+","+O+","+z;let lt=ct.programVariants.get(xt);return lt===void 0?(lt=Hn(M,D,G),ct.programVariants.set(xt,lt)):(ct.currentProgram=lt,ct.uniformsList=null,ct.outputColorSpace=O,ct.toneMapping=z),lt}function po(M){if(M.uniformsList===null){const D=M.currentProgram.getUniforms();M.uniformsList=$s.seqWithValue(D.seq,M.uniforms)}return M.uniformsList}function mo(M,D){const G=Pt.get(M);G.outputColorSpace=D.outputColorSpace,G.batching=D.batching,G.batchingColor=D.batchingColor,G.instancing=D.instancing,G.instancingColor=D.instancingColor,G.instancingMorph=D.instancingMorph,G.skinning=D.skinning,G.morphTargets=D.morphTargets,G.morphNormals=D.morphNormals,G.morphColors=D.morphColors,G.morphTargetsCount=D.morphTargetsCount,G.numClippingPlanes=D.numClippingPlanes,G.numIntersection=D.numClipIntersection,G.vertexAlphas=D.vertexAlphas,G.vertexTangents=D.vertexTangents,G.toneMapping=D.toneMapping}function ph(M,D,G,O,z){D.isScene!==!0&&(D=ei),Nt.resetTextureUnits();const ct=D.fog,xt=O.isMeshStandardMaterial||O.isMeshLambertMaterial||O.isMeshPhongMaterial?D.environment:null,lt=et===null?R.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:Kt.workingColorSpace,gt=O.isMeshStandardMaterial||O.isMeshLambertMaterial&&!O.envMap||O.isMeshPhongMaterial&&!O.envMap,bt=E.get(O.envMap||xt,gt),Bt=O.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,qt=!!G.attributes.tangent&&(!!O.normalMap||O.anisotropy>0),Mt=!!G.morphAttributes.position,Yt=!!G.morphAttributes.normal,xe=!!G.morphAttributes.color;let le=Di;O.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(le=R.toneMapping);const re=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Fe=re!==void 0?re.length:0,St=Pt.get(O),Ge=w.state.lights;if(ye===!0&&(Xe===!0||M!==Q)){const fe=M===Q&&O.id===X;Y.setState(O,M,fe)}let te=!1,ji=!1;O.version===St.__version?St.needsLights&&St.lightsStateVersion!==Ge.state.version||z.isBatchedMesh&&St.batching===!1||!z.isBatchedMesh&&St.batching===!0||z.isBatchedMesh&&St.batchingColor===!0&&z._colorsTexture===null||z.isBatchedMesh&&St.batchingColor===!1&&z._colorsTexture!==null||z.isInstancedMesh&&St.instancing===!1||!z.isInstancedMesh&&St.instancing===!0||z.isSkinnedMesh&&St.skinning===!1||!z.isSkinnedMesh&&St.skinning===!0||z.isInstancedMesh&&St.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&St.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&St.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&St.instancingMorph===!1&&z.morphTexture!==null||St.envMap!==bt||O.fog===!0&&St.fog!==ct||St.numClippingPlanes!==void 0&&(St.numClippingPlanes!==Y.numPlanes||St.numIntersection!==Y.numIntersection)||St.vertexAlphas!==Bt||St.vertexTangents!==qt||St.morphTargets!==Mt||St.morphNormals!==Yt||St.morphColors!==xe||St.morphTargetsCount!==Fe||St.numLightProbeGrids!==fo(w.state.lightProbeGridArray)?te=!0:(St.outputColorSpace!==lt||St.toneMapping!==le)&&(ji=!0):(te=!0,St.__version=O.version);let Oe=St.currentProgram;(te===!0||ji===!0)&&(Oe=ji===!0?fh(O,D,z,lt,le):Hn(O,D,z),F&&O.isNodeMaterial&&F.onUpdateProgram(O,Oe,St));let fs=!1,Fi=!1,tn=!1;const Jt=Oe.getUniforms(),Ne=St.uniforms;if(ut.useProgram(Oe.program)&&(fs=!0,Fi=!0,tn=!0),O.id!==X&&(X=O.id,Fi=!0),fs||Q!==M){ut.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),Jt.setValue(U,"projectionMatrix",M.projectionMatrix),Jt.setValue(U,"viewMatrix",M.matrixWorldInverse);const Ce=Jt.map.cameraPosition;Ce!==void 0&&Ce.setValue(U,mi.setFromMatrixPosition(M.matrixWorld)),ue.logarithmicDepthBuffer&&Jt.setValue(U,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(O.isMeshPhongMaterial||O.isMeshToonMaterial||O.isMeshLambertMaterial||O.isMeshBasicMaterial||O.isMeshStandardMaterial||O.isShaderMaterial)&&Jt.setValue(U,"isOrthographic",M.isOrthographicCamera===!0),Q!==M&&(Q=M,Fi=!0,tn=!0)}if(St.needsLights&&(Ge.state.sunShadowMap.length>0&&Jt.setValue(U,"sunShadowMap",Ge.state.sunShadowMap,Nt),Ge.state.directionalShadowMap.length>0&&Jt.setValue(U,"directionalShadowMap",Ge.state.directionalShadowMap,Nt),Ge.state.spotShadowMap.length>0&&Jt.setValue(U,"spotShadowMap",Ge.state.spotShadowMap,Nt),Ge.state.pointShadowMap.length>0&&Jt.setValue(U,"pointShadowMap",Ge.state.pointShadowMap,Nt)),z.isSkinnedMesh){Jt.setOptional(U,z,"bindMatrix"),Jt.setOptional(U,z,"bindMatrixInverse");const fe=z.skeleton;fe&&(fe.boneTexture===null&&fe.computeBoneTexture(),Jt.setValue(U,"boneTexture",fe.boneTexture,Nt))}z.isBatchedMesh&&(Jt.setOptional(U,z,"batchingTexture"),Jt.setValue(U,"batchingTexture",z._matricesTexture,Nt),Jt.setOptional(U,z,"batchingIdTexture"),Jt.setValue(U,"batchingIdTexture",z._indirectTexture,Nt),Jt.setOptional(U,z,"batchingColorTexture"),z._colorsTexture!==null&&Jt.setValue(U,"batchingColorTexture",z._colorsTexture,Nt));const li=G.morphAttributes;if((li.position!==void 0||li.normal!==void 0||li.color!==void 0)&&Z.update(z,G,Oe),(Fi||St.receiveShadow!==z.receiveShadow)&&(St.receiveShadow=z.receiveShadow,Jt.setValue(U,"receiveShadow",z.receiveShadow)),(O.isMeshStandardMaterial||O.isMeshLambertMaterial||O.isMeshPhongMaterial)&&O.envMap===null&&D.environment!==null&&(Ne.envMapIntensity.value=D.environmentIntensity),Ne.dfgLUT!==void 0&&(Ne.dfgLUT.value=Pm()),Fi){if(Jt.setValue(U,"toneMappingExposure",R.toneMappingExposure),St.needsLights&&mh(Ne,tn),ct&&O.fog===!0&&st.refreshFogUniforms(Ne,ct),st.refreshMaterialUniforms(Ne,O,mt,Ct,w.state.transmissionRenderTarget[M.id]),St.needsLights&&St.numLightProbeGrids>0){const fe=b;let Ce=0;for(const bi of w.state.lightProbeGridArray)bi.texture!==null&&(fe.textures[Ce]=bi.texture,fe.min[Ce]=bi.boundingBox.min,fe.max[Ce]=bi.boundingBox.max,fe.resolution[Ce]=bi.resolution,Ce++);for(const bi in fe)fe[bi].length=Ce;Ne.probesSH.value=fe.textures,Ne.probesMin.value=fe.min,Ne.probesMax.value=fe.max,Ne.probesResolution.value=fe.resolution}$s.upload(U,po(St),Ne,Nt)}if(O.isShaderMaterial&&O.uniformsNeedUpdate===!0&&($s.upload(U,po(St),Ne,Nt),O.uniformsNeedUpdate=!1),O.isSpriteMaterial&&Jt.setValue(U,"center",z.center),Jt.setValue(U,"modelViewMatrix",z.modelViewMatrix),Jt.setValue(U,"normalMatrix",z.normalMatrix),Jt.setValue(U,"modelMatrix",z.matrixWorld),O.uniformsGroups!==void 0){const fe=O.uniformsGroups;for(let Ce=0,bi=fe.length;Ce<bi;Ce++){const _o=fe[Ce];At.update(_o,Oe),At.bind(_o,Oe)}}return Oe}function mh(M,D){M.ambientLightColor.needsUpdate=D,M.lightProbe.needsUpdate=D,M.sunLights.needsUpdate=D,M.sunLightShadows.needsUpdate=D,M.directionalLights.needsUpdate=D,M.directionalLightShadows.needsUpdate=D,M.pointLights.needsUpdate=D,M.pointLightShadows.needsUpdate=D,M.spotLights.needsUpdate=D,M.spotLightShadows.needsUpdate=D,M.rectAreaLights.needsUpdate=D,M.hemisphereLights.needsUpdate=D}function gh(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return $},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return et},this.setRenderTargetTextures=function(M,D,G){const O=Pt.get(M);O.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,O.__autoAllocateDepthBuffer===!1&&(O.__useRenderToTexture=!1),Pt.get(M.texture).__webglTexture=D,Pt.get(M.depthTexture).__webglTexture=O.__autoAllocateDepthBuffer?void 0:G,O.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,D){const G=Pt.get(M);G.__webglFramebuffer=D,G.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(M,D=0,G=0){et=M,$=D,k=G;let O=null,z=!1,ct=!1;if(M){const lt=Pt.get(M);if(lt.__useDefaultFramebuffer!==void 0){ut.bindFramebuffer(U.FRAMEBUFFER,lt.__webglFramebuffer),j.copy(M.viewport),yt.copy(M.scissor),Ot=M.scissorTest,ut.viewport(j),ut.scissor(yt),ut.setScissorTest(Ot),X=-1;return}else if(lt.__webglFramebuffer===void 0)Nt.setupRenderTarget(M);else if(lt.__hasExternalTextures)Nt.rebindTextures(M,Pt.get(M.texture).__webglTexture,Pt.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const Bt=M.depthTexture;if(lt.__boundDepthTexture!==Bt){if(Bt!==null&&Pt.has(Bt)&&(M.width!==Bt.image.width||M.height!==Bt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Nt.setupDepthRenderbuffer(M)}}const gt=M.texture;(gt.isData3DTexture||gt.isDataArrayTexture||gt.isCompressedArrayTexture)&&(ct=!0);const bt=Pt.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(bt[D])?O=bt[D][G]:O=bt[D],z=!0):M.samples>0&&Nt.useMultisampledRTT(M)===!1?O=Pt.get(M).__webglMultisampledFramebuffer:Array.isArray(bt)?O=bt[G]:O=bt,j.copy(M.viewport),yt.copy(M.scissor),Ot=M.scissorTest}else j.copy(Dt).multiplyScalar(mt).floor(),yt.copy(ie).multiplyScalar(mt).floor(),Ot=se;if(G!==0&&(O=H),ut.bindFramebuffer(U.FRAMEBUFFER,O)&&ut.drawBuffers(M,O),ut.viewport(j),ut.scissor(yt),ut.setScissorTest(Ot),z){const lt=Pt.get(M.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+D,lt.__webglTexture,G)}else if(ct){const lt=D;for(let gt=0;gt<M.textures.length;gt++){const bt=Pt.get(M.textures[gt]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+gt,bt.__webglTexture,G,lt)}}else if(M!==null&&G!==0){const lt=Pt.get(M.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,lt.__webglTexture,G)}X=-1};function go(M){const D=Pt.get(M);return(D.__readFormat!==M.format||D.__readType!==M.type)&&(D.__readFormat=M.format,D.__readType=M.type,D.__formatReadable=ue.textureFormatReadable(M.format),D.__typeReadable=ue.textureTypeReadable(M.type)),D}this.readRenderTargetPixels=function(M,D,G,O,z,ct,xt,lt=0){if(!(M&&M.isWebGLRenderTarget)){jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let gt=Pt.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&xt!==void 0&&(gt=gt[xt],Array.isArray(gt)&&(gt=gt[0])),gt){ut.bindFramebuffer(U.FRAMEBUFFER,gt);try{const bt=M.textures[lt],Bt=bt.format,qt=bt.type;M.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+lt);const Mt=go(bt);if(Mt.__formatReadable===!1){jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Mt.__typeReadable===!1){jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=M.width-O&&G>=0&&G<=M.height-z&&U.readPixels(D,G,O,z,nt.convert(Bt),nt.convert(qt),ct)}finally{const bt=et!==null?Pt.get(et).__webglFramebuffer:null;ut.bindFramebuffer(U.FRAMEBUFFER,bt)}}},this.readRenderTargetPixelsAsync=async function(M,D,G,O,z,ct,xt,lt=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let gt=Pt.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&xt!==void 0&&(gt=gt[xt],Array.isArray(gt)&&(gt=gt[0])),gt)if(D>=0&&D<=M.width-O&&G>=0&&G<=M.height-z){ut.bindFramebuffer(U.FRAMEBUFFER,gt);const bt=M.textures[lt],Bt=bt.format,qt=bt.type;M.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+lt);const Mt=go(bt);if(Mt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Mt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Yt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Yt),U.bufferData(U.PIXEL_PACK_BUFFER,ct.byteLength,U.STREAM_READ),U.readPixels(D,G,O,z,nt.convert(Bt),nt.convert(qt),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);const xe=et!==null?Pt.get(et).__webglFramebuffer:null;ut.bindFramebuffer(U.FRAMEBUFFER,xe);const le=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await $h(U,le,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Yt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,ct),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(Yt),U.deleteSync(le),ct}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,D=null,G=0){const O=Math.pow(2,-G),z=Math.floor(M.image.width*O),ct=Math.floor(M.image.height*O),xt=D!==null?D.x:0,lt=D!==null?D.y:0;Nt.setTexture2D(M,0),U.copyTexSubImage2D(U.TEXTURE_2D,G,0,0,xt,lt,z,ct),ut.unbindTexture()},this.copyTextureToTexture=function(M,D,G=null,O=null,z=0,ct=0){let xt,lt,gt,bt,Bt,qt,Mt,Yt,xe;const le=M.isCompressedTexture?M.mipmaps[ct]:M.image;if(G!==null)xt=G.max.x-G.min.x,lt=G.max.y-G.min.y,gt=G.isBox3?G.max.z-G.min.z:1,bt=G.min.x,Bt=G.min.y,qt=G.isBox3?G.min.z:0;else{const Jt=Math.pow(2,-z);xt=Math.floor(le.width*Jt),lt=Math.floor(le.height*Jt),M.isDataArrayTexture?gt=le.depth:M.isData3DTexture?gt=Math.floor(le.depth*Jt):gt=1,bt=0,Bt=0,qt=0}O!==null?(Mt=O.x,Yt=O.y,xe=O.z):(Mt=0,Yt=0,xe=0);const re=nt.convert(D.format),Fe=nt.convert(D.type);let St;D.isData3DTexture?(Nt.setTexture3D(D,0),St=U.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(Nt.setTexture2DArray(D,0),St=U.TEXTURE_2D_ARRAY):(Nt.setTexture2D(D,0),St=U.TEXTURE_2D),ut.activeTexture(U.TEXTURE0),ut.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,D.flipY),ut.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),ut.pixelStorei(U.UNPACK_ALIGNMENT,D.unpackAlignment);const Ge=ut.getParameter(U.UNPACK_ROW_LENGTH),te=ut.getParameter(U.UNPACK_IMAGE_HEIGHT),ji=ut.getParameter(U.UNPACK_SKIP_PIXELS),Oe=ut.getParameter(U.UNPACK_SKIP_ROWS),fs=ut.getParameter(U.UNPACK_SKIP_IMAGES);ut.pixelStorei(U.UNPACK_ROW_LENGTH,le.width),ut.pixelStorei(U.UNPACK_IMAGE_HEIGHT,le.height),ut.pixelStorei(U.UNPACK_SKIP_PIXELS,bt),ut.pixelStorei(U.UNPACK_SKIP_ROWS,Bt),ut.pixelStorei(U.UNPACK_SKIP_IMAGES,qt);const Fi=M.isDataArrayTexture||M.isData3DTexture,tn=D.isDataArrayTexture||D.isData3DTexture;if(M.isDepthTexture){const Jt=Pt.get(M),Ne=Pt.get(D),li=Pt.get(Jt.__renderTarget),fe=Pt.get(Ne.__renderTarget);ut.bindFramebuffer(U.READ_FRAMEBUFFER,li.__webglFramebuffer),ut.bindFramebuffer(U.DRAW_FRAMEBUFFER,fe.__webglFramebuffer);for(let Ce=0;Ce<gt;Ce++)Fi&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Pt.get(M).__webglTexture,z,qt+Ce),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Pt.get(D).__webglTexture,ct,xe+Ce)),U.blitFramebuffer(bt,Bt,bt+xt,Bt+lt,Mt,Yt,Mt+xt,Yt+lt,U.DEPTH_BUFFER_BIT,U.NEAREST);ut.bindFramebuffer(U.READ_FRAMEBUFFER,null),ut.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(z!==0||M.isRenderTargetTexture||Pt.has(M)){const Jt=Pt.get(M),Ne=Pt.get(D);ut.bindFramebuffer(U.READ_FRAMEBUFFER,I),ut.bindFramebuffer(U.DRAW_FRAMEBUFFER,V);for(let li=0;li<gt;li++)Fi?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Jt.__webglTexture,z,qt+li):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Jt.__webglTexture,z),tn?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ne.__webglTexture,ct,xe+li):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Ne.__webglTexture,ct),z!==0?U.blitFramebuffer(bt,Bt,bt+xt,Bt+lt,Mt,Yt,Mt+xt,Yt+lt,U.COLOR_BUFFER_BIT,U.NEAREST):tn?U.copyTexSubImage3D(St,ct,Mt,Yt,xe+li,bt,Bt,xt,lt):U.copyTexSubImage2D(St,ct,Mt,Yt,bt,Bt,xt,lt);ut.bindFramebuffer(U.READ_FRAMEBUFFER,null),ut.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else tn?M.isDataTexture||M.isData3DTexture?U.texSubImage3D(St,ct,Mt,Yt,xe,xt,lt,gt,re,Fe,le.data):D.isCompressedArrayTexture?U.compressedTexSubImage3D(St,ct,Mt,Yt,xe,xt,lt,gt,re,le.data):U.texSubImage3D(St,ct,Mt,Yt,xe,xt,lt,gt,re,Fe,le):M.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,ct,Mt,Yt,xt,lt,re,Fe,le.data):M.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,ct,Mt,Yt,le.width,le.height,re,le.data):U.texSubImage2D(U.TEXTURE_2D,ct,Mt,Yt,xt,lt,re,Fe,le);ut.pixelStorei(U.UNPACK_ROW_LENGTH,Ge),ut.pixelStorei(U.UNPACK_IMAGE_HEIGHT,te),ut.pixelStorei(U.UNPACK_SKIP_PIXELS,ji),ut.pixelStorei(U.UNPACK_SKIP_ROWS,Oe),ut.pixelStorei(U.UNPACK_SKIP_IMAGES,fs),ct===0&&D.generateMipmaps===!0&&D.mipmapsAutoUpdate===!0&&U.generateMipmap(St),ut.unbindTexture()},this.initRenderTarget=function(M){Pt.get(M).__webglFramebuffer===void 0&&Nt.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?Nt.setTextureCube(M,0):M.isData3DTexture?Nt.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?Nt.setTexture2DArray(M,0):Nt.setTexture2D(M,0),ut.unbindTexture()},this.resetState=function(){$=0,k=0,et=null,ut.reset(),rt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return fi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Kt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Kt._getUnpackColorSpace()}}const Js={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Gn{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Dm=new ja(-1,1,1,-1,0,1);class Im extends ge{constructor(){super(),this.setAttribute("position",new Qt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Qt([0,2,0,0,2,0],2))}}const Nm=new Im;class eo{constructor(t){this._mesh=new _t(Nm,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Dm)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Um extends Gn{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof Ke?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=ls.clone(t.uniforms),this.material=new Ke({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new eo(this.material)}render(t,e,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class gl extends Gn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,i){const n=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),r.buffers.stencil.setFunc(n.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(n.EQUAL,1,4294967295),r.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),r.buffers.stencil.setLocked(!0)}}class Fm extends Gn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class Om{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const i=t.getSize(new Tt);this._width=i.width,this._height=i.height,e=new $e(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ze}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Um(Js),this.copyPass.material.blending=on,this.timer=new Nc}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());const e=this.renderer.getRenderTarget();let i=!1;for(let n=0,r=this.passes.length;n<r;n++){const a=this.passes[n];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(n),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),a.needsSwap){if(i){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}gl!==void 0&&(a instanceof gl?i=!0:a instanceof Fm&&(i=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new Tt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const i=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(i,n),this.renderTarget2.setSize(i,n);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,n)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Bm extends Gn{constructor(t,e,i=null,n=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=i,this.clearColor=n,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Ft}render(t,e,i){const n=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=n}}const zm={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ft(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class On extends Gn{constructor(t,e=1,i,n){super(),this.strength=e,this.radius=i,this.threshold=n,this.resolution=t!==void 0?new Tt(t.x,t.y):new Tt(256,256),this.clearColor=new Ft(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new $e(r,a,{type:Ze,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let c=0;c<this.nMips;c++){const u=new $e(r,a,{type:Ze,depthBuffer:!1});u.texture.name="UnrealBloomPass.h"+c,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const d=new $e(r,a,{type:Ze,depthBuffer:!1});d.texture.name="UnrealBloomPass.v"+c,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),a=Math.round(a/2)}const o=zm;this.highPassUniforms=ls.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ke({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let c=0;c<this.nMips;c++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[c])),this.separableBlurMaterials[c].uniforms.invSize.value=new Tt(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ls.clone(Js.uniforms),this.blendMaterial=new Ke({uniforms:this.copyUniforms,vertexShader:Js.vertexShader,fragmentShader:Js.fragmentShader,premultipliedAlpha:!0,blending:oe,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Ft,this._oldClearAlpha=1,this._basic=new pe,this._fsQuad=new eo(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let i=Math.round(t/2),n=Math.round(e/2);this.renderTargetBright.setSize(i,n);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,n),this.renderTargetsVertical[r].setSize(i,n),this.separableBlurMaterials[r].uniforms.invSize.value=new Tt(1/i,1/n),i=Math.round(i/2),n=Math.round(n/2)}render(t,e,i,n,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=On.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=On.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(i),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){const e=[],i=t/3;for(let a=0;a<t;a++)e.push(.39894*Math.exp(-.5*a*a/(i*i))/i);const n=[],r=[];for(let a=1;a<t;a+=2){const o=e[a],l=a+1<t?e[a+1]:0,h=o+l;n.push((a*o+(a+1)*l)/h),r.push(h)}return new Ke({defines:{KERNEL_PAIRS:n.length},uniforms:{colorTexture:{value:null},invSize:{value:new Tt(.5,.5)},direction:{value:new Tt(.5,.5)},centerWeight:{value:e[0]},gaussianOffsets:{value:n},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(t){return new Ke({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}On.BlurDirectionX=new Tt(1,0);On.BlurDirectionY=new Tt(0,1);const Gs={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class km extends Gn{constructor(){super(),this.isOutputPass=!0,this.uniforms=ls.clone(Gs.uniforms),this.material=new $l({name:Gs.name,uniforms:this.uniforms,vertexShader:Gs.vertexShader,fragmentShader:Gs.fragmentShader}),this._fsQuad=new eo(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Kt.getTransfer(this._outputColorSpace)===ee&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Na?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ua?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Fa?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===or?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ba?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===za?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Oa&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}function Gm(s,t=!1){const e=s[0].index!==null,i=new Set(Object.keys(s[0].attributes)),n=new Set(Object.keys(s[0].morphAttributes)),r={},a={},o=s[0].morphTargetsRelative,l=new ge;l.morphTargetsRelative=o;let h=0;for(let c=0;c<s.length;++c){const u=s[c];let d=0,p=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const _ in u.attributes){if(!i.has(_))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+'. All geometries must have compatible attributes; make sure "'+_+'" attribute exists among all geometries, or in none of them.'),null;r[_]===void 0&&(r[_]=[]),r[_].push(u.attributes[_]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const _ in u.morphAttributes){if(!n.has(_))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+".  .morphAttributes must be consistent throughout all geometries."),null;if(u.morphAttributes[_].length!==s[0].morphAttributes[_].length)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+'. All geometries must have the same number of morph targets for the "'+_+'" morph attribute.'),null;a[_]===void 0&&(a[_]=[]),a[_].push(u.morphAttributes[_]),p++}if(p!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". Make sure all geometries have the same number of morph attributes."),null;if(t){let _;if(e)_=u.index.count;else if(u.attributes.position!==void 0)_=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". The geometry must have either an index or a position attribute"),null;l.addGroup(h,_,c),h+=_}}if(e){let c=0;const u=[];for(let d=0;d<s.length;++d){const p=s[d].index;for(let _=0;_<p.count;++_)u.push(p.getX(_)+c);c+=s[d].attributes.position.count}l.setIndex(u)}for(const c in r){const u=_l(r[c]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+c+" attribute."),null;l.setAttribute(c,u)}for(const c in a){const u=a[c][0].length;if(u!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[c]=[];for(let d=0;d<u;++d){const p=[];for(let S=0;S<a[c].length;++S)p.push(a[c][S][d]);const _=_l(p);if(!_)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+c+" morphAttribute."),null;l.morphAttributes[c].push(_)}}}return l}function _l(s){let t,e,i,n=-1,r=0;for(let h=0;h<s.length;++h){const c=s[h];if(t===void 0&&(t=c.array.constructor),t!==c.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=c.itemSize),e!==c.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=c.normalized),i!==c.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(n===-1&&(n=c.gpuType),n!==c.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=c.count*e}const a=new t(r),o=new ti(a,e,i);let l=0;for(let h=0;h<s.length;++h){const c=s[h];if(c.isInterleavedBufferAttribute){const u=l/e;for(let d=0,p=c.count;d<p;d++)for(let _=0;_<e;_++){const S=c.getComponent(d,_);o.setComponent(d+u,_,S)}}else a.set(c.array,l);l+=c.count*e}return n!==void 0&&(o.gpuType=n),o}const $t=(s,t,e)=>Math.min(e,Math.max(t,s)),Et=(s,t,e)=>s+(t-s)*e,an=(s,t,e,i)=>Et(s,t,1-Math.exp(-e*i)),zt=(s=0,t=1)=>s+Math.random()*(t-s),Hm=s=>s[Math.floor(Math.random()*s.length)];function qi(s=1){let t=s>>>0;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)}function ch(s,t=1,e=1){const i=new fn(s);return i.colorSpace=Me,i.wrapS=ns,i.wrapT=ns,i.repeat.set(t,e),i.anisotropy=4,i}function Vm(){const s=document.createElement("canvas");s.width=1024,s.height=512;const t=s.getContext("2d"),e=t.createLinearGradient(0,0,0,s.height);e.addColorStop(0,"#05070d"),e.addColorStop(.42,"#111827"),e.addColorStop(.58,"#2a2a30"),e.addColorStop(.72,"#1a1512"),e.addColorStop(1,"#08090c"),t.fillStyle=e,t.fillRect(0,0,s.width,s.height);const i=t.createRadialGradient(300,125,0,300,125,120);i.addColorStop(0,"rgba(240,244,255,0.95)"),i.addColorStop(.18,"rgba(190,208,240,0.5)"),i.addColorStop(1,"rgba(80,110,170,0)"),t.fillStyle=i,t.fillRect(140,0,320,280);for(const[r,a,o,l]of[[700,320,95,.32],[90,335,70,.22],[920,300,85,.26]]){const h=t.createRadialGradient(r,a,0,r,a,o);h.addColorStop(0,`rgba(255,160,82,${l})`),h.addColorStop(.45,`rgba(150,76,38,${l*.45})`),h.addColorStop(1,"rgba(40,20,12,0)"),t.fillStyle=h,t.fillRect(r-o,a-o,o*2,o*2)}const n=new fn(s);return n.mapping=Ws,n.colorSpace=Me,n}function Wm(s=512){const t=document.createElement("canvas");t.width=t.height=s;const e=t.getContext("2d"),i=qi(73);e.fillStyle="#202126",e.fillRect(0,0,s,s);const n=8,r=s/n;for(let o=0;o<n;o++){const l=o%2?-s/10:0;for(let h=-1;h<6;h++){const c=s/5,u=h*c+l+(i()-.5)*4,d=o*r+(i()-.5)*2,p=38+Math.floor(i()*28);e.fillStyle=`rgb(${p},${p+1},${p+4})`,e.fillRect(u+2,d+2,c-4,r-4),e.strokeStyle="rgba(0,0,0,0.55)",e.lineWidth=2,e.strokeRect(u+1,d+1,c-2,r-2),e.strokeStyle=`rgba(${p+26},${p+24},${p+20},0.15)`,e.lineWidth=1,e.beginPath(),e.moveTo(u+5,d+5),e.lineTo(u+c-5,d+5),e.stroke();for(let _=0;_<16;_++){const S=u+i()*c,m=d+i()*r,f=i()>.5?255:0;e.fillStyle=`rgba(${f},${f},${f},${i()*.035})`,e.fillRect(S,m,1+i()*2,1+i()*2)}}}e.strokeStyle="rgba(4,4,6,0.7)";for(let o=0;o<18;o++){let l=i()*s,h=i()*s;e.beginPath(),e.moveTo(l,h);const c=2+Math.floor(i()*4);for(let u=0;u<c;u++)l+=(i()-.5)*70,h+=(i()-.5)*70,e.lineTo(l,h);e.lineWidth=.6+i()*1.5,e.stroke()}const a=e.getImageData(0,0,s,s);for(let o=0;o<a.data.length;o+=4){const l=(i()-.5)*13;a.data[o]=$t(a.data[o]+l,0,255),a.data[o+1]=$t(a.data[o+1]+l,0,255),a.data[o+2]=$t(a.data[o+2]+l,0,255)}return e.putImageData(a,0,0),ch(t,5,5)}function Xm(s=512){const t=document.createElement("canvas");t.width=t.height=s;const e=t.getContext("2d"),i=qi(19);e.fillStyle="#101114",e.fillRect(0,0,s,s);const n=10;for(let r=0;r<n;r++){const a=s/4,o=r%2?-a/2:0;for(let l=-1;l<5;l++){const h=18+Math.floor(i()*18);e.fillStyle=`rgb(${h},${h+2},${h+5})`,e.fillRect(l*a+o+2,r*(s/n)+2,a-4,s/n-4),e.strokeStyle="rgba(0,0,0,0.6)",e.lineWidth=2,e.strokeRect(l*a+o+1,r*(s/n)+1,a-2,s/n-2)}}return ch(t,3,5)}function qm(s=512){const t=document.createElement("canvas");t.width=t.height=s;const e=t.getContext("2d");e.clearRect(0,0,s,s),e.translate(s/2,s/2),e.strokeStyle="rgba(210,185,128,0.85)",e.lineWidth=2,e.shadowColor="rgba(220,190,120,0.8)",e.shadowBlur=12,e.beginPath(),e.arc(0,0,s*.37,0,Math.PI*2),e.stroke(),e.beginPath(),e.arc(0,0,s*.29,0,Math.PI*2),e.stroke(),e.lineWidth=1.2;for(let n=0;n<12;n++){const r=n/12*Math.PI*2;e.beginPath(),e.moveTo(Math.cos(r)*s*.3,Math.sin(r)*s*.3),e.lineTo(Math.cos(r)*s*.36,Math.sin(r)*s*.36),e.stroke()}for(let n=0;n<8;n++){const r=n/8*Math.PI*2+.2,a=s*.22;e.beginPath(),e.moveTo(Math.cos(r)*a,Math.sin(r)*a),e.lineTo(Math.cos(r+.18)*a*.55,Math.sin(r+.18)*a*.55),e.lineTo(Math.cos(r+.35)*a,Math.sin(r+.35)*a),e.stroke()}e.shadowBlur=0;const i=new fn(t);return i.colorSpace=Me,i}function Yi(s=128,t="rgba(255,255,255,1)",e="rgba(255,255,255,0)"){const i=document.createElement("canvas");i.width=i.height=s;const n=i.getContext("2d"),r=n.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,t),r.addColorStop(.22,"rgba(255,255,255,0.65)"),r.addColorStop(.55,"rgba(255,255,255,0.16)"),r.addColorStop(1,e),n.fillStyle=r,n.fillRect(0,0,s,s);const a=new fn(i);return a.colorSpace=Me,a}function Ym(s=256){const t=document.createElement("canvas");t.width=t.height=s;const e=t.getContext("2d"),i=qi(44);e.clearRect(0,0,s,s);for(let r=0;r<24;r++){const a=s/2+(i()-.5)*s*.55,o=s/2+(i()-.5)*s*.55,l=s*(.12+i()*.28),h=e.createRadialGradient(a,o,0,a,o,l);h.addColorStop(0,`rgba(180,185,195,${.05+i()*.07})`),h.addColorStop(1,"rgba(120,125,140,0)"),e.fillStyle=h,e.fillRect(a-l,o-l,l*2,l*2)}const n=new fn(t);return n.colorSpace=Me,n}function Km(s=512){const t=document.createElement("canvas");t.width=t.height=s;const e=t.getContext("2d"),i=qi(9),n=e.createRadialGradient(s/2,s/2,s*.08,s/2,s/2,s*.48);n.addColorStop(0,"rgba(255,250,230,0.95)"),n.addColorStop(.45,"rgba(235,228,205,0.82)"),n.addColorStop(.68,"rgba(190,195,205,0.25)"),n.addColorStop(1,"rgba(150,160,180,0)"),e.fillStyle=n,e.beginPath(),e.arc(s/2,s/2,s*.48,0,Math.PI*2),e.fill();for(let a=0;a<22;a++){const o=i()*Math.PI*2,l=i()*s*.3,h=s/2+Math.cos(o)*l,c=s/2+Math.sin(o)*l,u=3+i()*16;e.fillStyle=`rgba(110,112,120,${.04+i()*.09})`,e.beginPath(),e.arc(h,c,u,0,Math.PI*2),e.fill()}const r=new fn(t);return r.colorSpace=Me,r}function uh(s=64){const t=document.createElement("canvas");t.width=t.height=s;const e=t.getContext("2d"),i=e.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);i.addColorStop(0,"rgba(255,255,255,1)"),i.addColorStop(.3,"rgba(255,235,190,0.9)"),i.addColorStop(1,"rgba(255,180,90,0)"),e.fillStyle=i,e.fillRect(0,0,s,s);const n=new fn(t);return n.colorSpace=Me,n}function ae(s,t={}){return new Ac({color:s,metalness:t.metalness??.1,roughness:t.roughness??.8,emissive:t.emissive??0,emissiveIntensity:t.emissiveIntensity??0,flatShading:t.flatShading??!1,side:t.side??Zi,transparent:t.transparent??!1,opacity:t.opacity??1,map:t.map??null,alphaMap:t.alphaMap??null,depthWrite:t.depthWrite??!0,blending:t.blending??ln})}function wt(s,t,e,i,n,r=0,a=0,o=0,l=0,h=0,c=0){const u=new _t(new zn(t,e,i),n);return u.position.set(r,a,o),u.rotation.set(l,h,c),u.castShadow=!0,u.receiveShadow=!0,s.add(u),u}function Ki(s,t,e,i=0,n=0,r=0,a=1,o=1,l=1){const h=new _t(new cs(t,16,12),e);return h.position.set(i,n,r),h.scale.set(a,o,l),h.castShadow=!0,h.receiveShadow=!0,s.add(h),h}function Le(s,t,e,i,n=0,r=0,a=0,o=0,l=0,h=0){const c=new _t(new os(t,e,8),i);return c.position.set(n,r,a),c.rotation.set(o,l,h),c.castShadow=!0,s.add(c),c}function Zm(s,t,e,i,n=0,r=0,a=0,o=0,l=0,h=0){const c=new _t(new Ci(t,e,6,24),i);return c.position.set(n,r,a),c.rotation.set(o,l,h),c.castShadow=!0,s.add(c),c}class $m{constructor(t){this.scene=t,this.time=0,this.torches=[],this.fogs=[],this.banners=[],this.rune=null,this.ash=null,this.ashData=[],this.stoneTex=Wm(512),this.brickTex=Xm(512),this.smokeTex=Ym(256),this.sparkTex=uh(64),this.glowTex=Yi(128,"rgba(255,180,90,1)","rgba(255,80,20,0)"),this.materials={stone:ae(5592926,{roughness:.94,metalness:.02,map:this.stoneTex}),stoneDark:ae(3158583,{roughness:.96,metalness:.02,map:this.brickTex}),stoneLight:ae(7040112,{roughness:.92,map:this.stoneTex}),iron:ae(1908257,{roughness:.48,metalness:.8}),gold:ae(9401154,{roughness:.38,metalness:.85}),cloth:ae(3871769,{roughness:.95,side:Se}),bone:ae(11576975,{roughness:.8}),ember:new pe({color:16747061})},this.buildSky(),this.buildGround(),this.buildColonnade(),this.buildGate(),this.buildProps(),this.buildAtmosphere(),this.mergeStatic()}mergeStatic(){const t=new Map,e=[];this.scene.updateMatrixWorld(!0),this.scene.traverse(i=>{if(!i.isMesh||i.userData.noMerge||i.material?.transparent||i.material?.isMeshBasicMaterial||i===this.rune)return;const n=i.material.uuid;t.has(n)||t.set(n,{material:i.material,geos:[]});const r=i.geometry.clone().applyMatrix4(i.matrixWorld),a=r.index?r.toNonIndexed():r;t.get(n).geos.push(a),e.push(i)});for(const i of e)i.parent?.remove(i);for(const{material:i,geos:n}of t.values()){if(!n.length)continue;const r=Gm(n,!1);if(n.forEach(o=>o.dispose()),!r)continue;const a=new _t(r,i);a.receiveShadow=!0,a.castShadow=!1,this.scene.add(a)}}buildSky(){const t=new cs(150,32,24),e=new Ke({side:We,depthWrite:!1,uniforms:{topColor:{value:new Ft(395279)},midColor:{value:new Ft(1120295)},bottomColor:{value:new Ft(1774866)}},vertexShader:`
        varying vec3 vWorld;
        void main() {
          vec4 world = modelMatrix * vec4(position, 1.0);
          vWorld = world.xyz;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,fragmentShader:`
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 bottomColor;
        varying vec3 vWorld;
        void main() {
          float h = normalize(vWorld).y;
          vec3 col = mix(bottomColor, midColor, smoothstep(-0.15, 0.28, h));
          col = mix(col, topColor, smoothstep(0.28, 0.9, h));
          gl_FragColor = vec4(col, 1.0);
        }
      `});this.scene.add(new _t(t,e));const i=qi(1234),n=[];for(let d=0;d<1800;d++){const p=i()*Math.PI*2,_=Math.acos(.05+i()*.95),S=120;n.push(Math.sin(_)*Math.cos(p)*S,Math.cos(_)*S,Math.sin(_)*Math.sin(p)*S)}const r=new ge;r.setAttribute("position",new Qt(n,3));const a=new Dn({color:13621482,size:.32,transparent:!0,opacity:.55,depthWrite:!1,sizeAttenuation:!0});this.scene.add(new ts(r,a));const o=Km(512),l=new di({map:o,color:15986651,transparent:!0,opacity:.95,depthWrite:!1,blending:oe}),h=new vi(l);h.position.set(-46,48,-92),h.scale.setScalar(28),this.scene.add(h);const c=new di({map:Yi(256,"rgba(220,225,240,0.7)","rgba(100,120,180,0)"),transparent:!0,opacity:.3,depthWrite:!1,blending:oe}),u=new vi(c);u.position.copy(h.position),u.scale.setScalar(74),this.scene.add(u)}buildGround(){const t=new _t(new Li(75,64),ae(658190,{roughness:1}));t.rotation.x=-Math.PI/2,t.position.y=-2.4,t.receiveShadow=!0,this.scene.add(t);const e=new _t(new pi(24.5,25.5,.5,64),this.materials.stoneDark);e.position.y=-.3,e.receiveShadow=!0,this.scene.add(e);const i=new _t(new pi(22.5,24.2,.55,64),this.materials.stone);i.position.y=.06,i.receiveShadow=!0,this.scene.add(i);const n=this.stoneTex.clone();n.repeat.set(13,13),n.needsUpdate=!0;const r=ae(6842993,{roughness:.94,metalness:.02,map:n}),a=new _t(new Li(22,96),r);a.rotation.x=-Math.PI/2,a.position.y=.36,a.receiveShadow=!0,this.scene.add(a);const o=new _t(new Ni(15.9,16.12,96),ae(8086587,{metalness:.7,roughness:.45,emissive:2364678,emissiveIntensity:.4}));o.rotation.x=-Math.PI/2,o.position.y=.38,this.scene.add(o);const l=new _t(new Ci(22.2,.22,8,96),this.materials.gold);l.rotation.x=-Math.PI/2,l.position.y=.38,this.scene.add(l);const h=qm(512),c=new pe({map:h,transparent:!0,opacity:.19,color:14071928,blending:oe,depthWrite:!1});this.rune=new _t(new qe(13,13),c),this.rune.rotation.x=-Math.PI/2,this.rune.position.y=.39,this.scene.add(this.rune);const u=new pe({map:h,transparent:!0,opacity:.1,color:10334916,blending:oe,depthWrite:!1}),d=new _t(new qe(19,19),u);d.rotation.x=-Math.PI/2,d.position.y=.385,this.scene.add(d);for(let p=0;p<18;p++){const _=p/18*Math.PI*2+zt(-.04,.04),S=zt(6.5,21),m=new _t(new qe(zt(.05,.12),zt(1.5,5)),ae(526603,{roughness:1}));m.rotation.x=-Math.PI/2,m.rotation.z=_+zt(-.5,.5),m.position.set(Math.cos(_)*S,.395,Math.sin(_)*S),this.scene.add(m)}}buildColonnade(){const t=qi(88),e=18;for(let n=0;n<e;n++){const r=n/e*Math.PI*2,a=25.5,o=Math.cos(r)*a,l=Math.sin(r)*a;if(Math.abs(o)<8&&l<-18)continue;const h=t()>.64,c=h?2.4+t()*5:9.5+t()*2.2,u=new Wt;u.position.set(o,.35,l),u.rotation.y=-r+Math.PI/2,wt(u,2.8,.42,2.8,this.materials.stoneDark,0,.2,0),wt(u,2.15,.5,2.15,this.materials.stone,0,.65,0);const d=new _t(new pi(.68,.82,c,10),this.materials.stone);d.position.y=.9+c/2,d.castShadow=!0,d.receiveShadow=!0,u.add(d);for(let p=0;p<4;p++){const _=wt(u,.08,c*.94,.08,this.materials.stoneDark,Math.cos(p*Math.PI/2)*.66,.9+c/2,Math.sin(p*Math.PI/2)*.66);_.castShadow=!1}if(!h)wt(u,2.3,.55,2.3,this.materials.stone,0,c+1.08,0),wt(u,2.7,.35,2.7,this.materials.stoneDark,0,c+1.5,0),t()>.35&&wt(u,1.8,.3,1.8,this.materials.stone,0,c+1.85,0);else{const p=Le(u,.72,1.1,this.materials.stone,0,c+.95,0,0,t()*3,0);p.rotation.x=zt(-.2,.2)}this.scene.add(u),!h&&n%3===0&&this.addTorch(o*.93,l*.93,-r+Math.PI/2)}const i=new _t(new Ci(25.5,.14,5,128),this.materials.gold);i.rotation.x=-Math.PI/2,i.position.y=.36,this.scene.add(i)}addTorch(t,e,i=0){const n=new Wt;n.position.set(t,.35,e),n.rotation.y=i,wt(n,.25,1.1,.25,this.materials.iron,0,.55,0),Le(n,.42,.75,this.materials.iron,0,1.25,0,Math.PI,0,0),Ki(n,.33,this.materials.ember,0,1.55,0,.8,1.5,.8);const r=new di({map:this.glowTex,color:16747066,transparent:!0,opacity:.9,depthWrite:!1,blending:oe}),a=new vi(r);a.position.set(0,1.62,0),a.scale.setScalar(2.3),n.add(a);const o=new Qa(16747074,26,13,2);o.position.set(0,1.8,0),n.add(o),this.scene.add(n),this.torches.push({group:n,light:o,glow:a,base:26,phase:zt(0,10)})}buildGate(){const t=new Wt;t.position.set(0,0,-30),this.scene.add(t);const e=this.materials.stoneDark;for(const l of[-1,1]){wt(t,5,20,5,e,l*10,10,0),wt(t,6,1.1,6,this.materials.stone,l*10,20.4,0),wt(t,5.6,.6,5.6,this.materials.stoneDark,l*10,21.2,0);for(let h=0;h<4;h++)wt(t,.7,1.3,.7,e,l*10+(h-1.5)*1.3,21.9,-1.2);for(let h=0;h<3;h++){const c=wt(t,.3,2.4,.06,new pe({color:2890509}),l*10,10+h*3.2,2.52);c.castShadow=!1}}const i=new _t(new Ci(10,.65,8,28,Math.PI),this.materials.stoneDark);i.position.set(0,14,0),i.castShadow=!0,t.add(i);const n=new _t(new Ci(8.7,.24,6,24,Math.PI),this.materials.gold);n.position.set(0,14,.4),t.add(n);for(let l=0;l<9;l++){const h=Math.PI-l/8*Math.PI;Le(t,.4,1.2,this.materials.stone,Math.cos(h)*10,14+Math.sin(h)*10+.7,.2,0,0,-h+Math.PI/2)}const r=new _t(new Li(5.1,32),new pe({color:1120810,transparent:!0,opacity:.85}));r.position.set(0,14.2,-.8),t.add(r);const a=new _t(new Ci(5.2,.18,6,48),this.materials.gold);a.position.copy(r.position),t.add(a);const o=new vi(new di({map:Yi(256,"rgba(130,165,215,0.9)","rgba(40,70,130,0)"),transparent:!0,opacity:.4,depthWrite:!1,blending:oe}));o.position.set(0,14.2,0),o.scale.setScalar(13),t.add(o);for(let l=0;l<12;l++){const h=l/12*Math.PI*2,c=6.3;wt(t,.5,.1,.1,this.materials.gold,Math.cos(h)*c,14.2+Math.sin(h)*c,.1,0,0,h)}}buildProps(){const t=qi(55);for(let i=0;i<26;i++){const n=t()*Math.PI*2,r=zt(18.8,22.2),a=new Wt;a.position.set(Math.cos(n)*r,.35,Math.sin(n)*r),a.rotation.y=t()*Math.PI*2;const o=zt(1.2,2.8);wt(a,.09,o,.035,this.materials.iron,0,o/2-.2,0,zt(-.35,.35),0,zt(-.35,.35)),wt(a,.55,.07,.09,this.materials.iron,0,.18,0,0,0,zt(-.2,.2)),wt(a,.08,.38,.08,this.materials.iron,0,-.04,0),this.scene.add(a)}for(let i=0;i<16;i++){const n=t()*Math.PI*2,r=zt(22.5,26),a=new _t(new $a(zt(.3,1.1),0),this.materials.stoneDark);a.position.set(Math.cos(n)*r,zt(.1,.7),Math.sin(n)*r),a.rotation.set(t()*3,t()*3,t()*3),a.castShadow=!0,this.scene.add(a)}const e=this.materials.cloth;for(let i=0;i<6;i++){const n=i/6*Math.PI*2+.3,r=20.5,a=new Wt;a.position.set(Math.cos(n)*r,7.2,Math.sin(n)*r),a.rotation.y=-n+Math.PI/2;const o=new _t(new qe(1.7,5.4,6,10),e);o.position.y=-2.7,o.castShadow=!0,o.userData.noMerge=!0,a.add(o),wt(a,2.2,.12,.12,this.materials.gold,0,.05,0),Zm(a,.2,.025,this.materials.gold,0,-5.2,0);const l=new _t(new Li(.4,3),new pe({color:10122808,transparent:!0,opacity:.5}));l.position.set(0,-2.7,.03),a.add(l),this.scene.add(a),this.banners.push({mesh:o,phase:t()*6})}for(let i=0;i<8;i++){const n=i/8*Math.PI*2+.2,r=16.9,a=new Wt;a.position.set(Math.cos(n)*r,.36,Math.sin(n)*r),wt(a,.45,1.1,.45,this.materials.iron,0,.55,0),Le(a,.5,.55,this.materials.iron,0,1.2,0,Math.PI,0,0);const o=Ki(a,.25,this.materials.ember,0,1.45,0,.8,1.2,.8);o.castShadow=!1;const l=new vi(new di({map:this.glowTex,color:16741932,transparent:!0,opacity:.7,depthWrite:!1,blending:oe}));l.position.set(0,1.55,0),l.scale.setScalar(1.5),a.add(l),this.scene.add(a),this.torches.push({group:a,light:null,glow:l,base:0,phase:zt(0,10)})}}buildAtmosphere(){const t=qi(202),e=2600,i=new Float32Array(e*3);for(let h=0;h<e;h++){const c=t()*Math.PI*2,u=Math.sqrt(t())*34;i[h*3]=Math.cos(c)*u,i[h*3+1]=t()*26,i[h*3+2]=Math.sin(c)*u,this.ashData.push({speed:.18+t()*.55,drift:.25+t()*.8,phase:t()*10})}const n=new ge;n.setAttribute("position",new ti(i,3));const r=new Dn({color:13089703,size:.055,transparent:!0,opacity:.58,map:this.sparkTex,depthWrite:!1,blending:oe,sizeAttenuation:!0});this.ash=new ts(n,r),this.ash.frustumCulled=!1,this.scene.add(this.ash);for(let h=0;h<10;h++){const c=new pe({map:this.smokeTex,color:7173250,transparent:!0,opacity:.11,depthWrite:!1,side:Se,blending:oe}),u=new _t(new qe(24,24),c);u.rotation.x=-Math.PI/2,u.position.set(zt(-14,14),.42+zt(0,.25),zt(-14,14)),u.rotation.z=zt(0,Math.PI),this.scene.add(u),this.fogs.push({mesh:u,speed:zt(.02,.08),phase:zt(0,10),baseX:u.position.x,baseZ:u.position.z})}const a=new ge,o=new Float32Array(420*3);for(let h=0;h<420;h++)o[h*3]=zt(-22,22),o[h*3+1]=zt(.4,9),o[h*3+2]=zt(-22,22);a.setAttribute("position",new ti(o,3));const l=new Dn({color:16760178,size:.09,transparent:!0,opacity:.35,map:this.sparkTex,depthWrite:!1,blending:oe});this.dust=new ts(a,l),this.scene.add(this.dust)}update(t,e){this.time=e;for(const i of this.torches){const n=.82+Math.sin(e*7.3+i.phase)*.08+Math.sin(e*13.7+i.phase*2)*.05+Math.random()*.03;i.glow.scale.setScalar((i.base?2.3:1.5)*n),i.light&&(i.light.intensity=i.base*n)}if(this.rune&&(this.rune.material.opacity=.14+Math.sin(e*.8)*.035,this.rune.rotation.z+=t*.008),this.ash){const i=this.ash.geometry.attributes.position.array;for(let n=0;n<this.ashData.length;n++){const r=this.ashData[n];if(i[n*3+1]-=r.speed*t,i[n*3]+=Math.sin(e*.4+r.phase)*r.drift*t,i[n*3+2]+=Math.cos(e*.33+r.phase)*r.drift*t,i[n*3+1]<0){i[n*3+1]=26;const a=Math.random()*Math.PI*2,o=Math.sqrt(Math.random())*34;i[n*3]=Math.cos(a)*o,i[n*3+2]=Math.sin(a)*o}}this.ash.geometry.attributes.position.needsUpdate=!0}for(const i of this.fogs)i.mesh.position.x=i.baseX+Math.sin(e*i.speed+i.phase)*2.2,i.mesh.position.z=i.baseZ+Math.cos(e*i.speed*.7+i.phase)*2.2,i.mesh.rotation.z+=t*.008;for(const i of this.banners)i.mesh.rotation.z=Math.sin(e*.9+i.phase)*.035,i.mesh.rotation.x=Math.sin(e*.6+i.phase)*.02;this.dust&&(this.dust.rotation.y=e*.01)}}const Jm={warden:{act:1,name:"THE ASHEN WARDEN",epithet:"KEEPER OF THE FIRST GATE",maxHp:720,speed:2.35,radius:1.25,scale:1.04,color:16760426,armor:2829617,armorDark:1382170,trim:9466943,cloth:4331035,eye:16764806,attacks:[{id:"cleave",range:5.8,min:0,max:7.2,windup:.82,active:.18,recovery:.62,damage:24,arc:2.45,parryable:!0,cooldown:.7,weight:3,kind:"sweep"},{id:"slam",range:5.3,min:0,max:7.5,windup:1.08,active:.2,recovery:.95,damage:38,aoe:5.4,parryable:!0,cooldown:1.25,weight:2,kind:"slam"},{id:"charge",range:18,min:9.5,max:19,windup:.78,active:.48,recovery:.82,damage:28,arc:1.3,parryable:!1,cooldown:1.2,weight:2,kind:"charge"},{id:"backhand",range:4.9,min:0,max:5.6,windup:.56,active:.14,recovery:.42,damage:18,arc:2.8,parryable:!0,cooldown:.55,weight:2,kind:"sweep"}]},chorister:{act:2,name:"THE PALE CHORISTER",epithet:"VOICE BENEATH THE VAULT",maxHp:860,speed:3.15,radius:1,scale:.96,hover:.28,color:10478591,armor:11052701,armorDark:5658975,trim:10397619,cloth:7236452,eye:11135743,attacks:[{id:"twin",range:5.2,min:0,max:6.4,windup:.5,active:.14,recovery:.4,damage:15,arc:2.7,parryable:!0,cooldown:.42,weight:3,kind:"twin"},{id:"blink",range:22,min:5.5,max:23,windup:.62,active:.16,recovery:.5,damage:27,arc:2.1,parryable:!0,cooldown:.9,weight:2,kind:"blink"},{id:"fan",range:24,min:7.5,max:25,windup:.82,active:.22,recovery:.72,damage:13,parryable:!1,cooldown:1,weight:2,kind:"fan"},{id:"lunge",range:10,min:3.8,max:11,windup:.54,active:.28,recovery:.48,damage:20,arc:1.5,parryable:!0,cooldown:.72,weight:2,kind:"lunge"}]},king:{act:3,name:"THE HOLLOW KING",epithet:"THE VOW THAT WOULD NOT DIE",maxHp:1180,speed:2.45,radius:1.45,scale:1.14,color:16739120,armor:1710879,armorDark:855569,trim:9394994,cloth:1904659,eye:16734757,attacks:[{id:"cleave",range:6.6,min:0,max:8,windup:.74,active:.18,recovery:.6,damage:30,arc:2.35,parryable:!0,cooldown:.65,weight:3,kind:"sweep"},{id:"slam",range:5.8,min:0,max:8,windup:1.02,active:.2,recovery:.9,damage:44,aoe:6,parryable:!0,cooldown:1.1,weight:2,kind:"slam"},{id:"flurry",range:5.8,min:0,max:7,windup:.62,active:.56,recovery:.82,damage:16,arc:2.85,parryable:!0,cooldown:1.2,weight:2,kind:"flurry",hits:[0,.2,.4]},{id:"eruption",range:22,min:8,max:23,windup:.92,active:.2,recovery:.8,damage:34,parryable:!1,cooldown:1.5,weight:2,kind:"eruption"}]}};class Qm{constructor(t,e,i,n,r){this.scene=t,this.effects=e,this.audio=i,this.game=n,this.kind=r,this.config=Jm[r],this.name=this.config.name,this.epithet=this.config.epithet,this.maxHp=this.config.maxHp,this.hp=this.maxHp,this.radius=this.config.radius,this.speed=this.config.speed,this.scale=this.config.scale,this.act=this.config.act,this.color=this.config.color,this.root=new Wt,this.model=new Wt,this.root.add(this.model),this.scene.add(this.root),this.pos=this.root.position,this.spawn=new C(0,.36,-7.5),this.pos.copy(this.spawn),this.yaw=0,this.root.rotation.y=this.yaw,this.state="idle",this.stateTime=0,this.cooldown=1.2,this.think=1.5,this.attack=null,this.attackTime=0,this.hitIndex=0,this.attackHit=!1,this.staggerMeter=0,this.staggerTimer=0,this.hitFlash=0,this.weaponGlow=0,this.parryCue=!1,this.phase=1,this.phaseTransition=!1,this.projectiles=[],this.hazards=[],this.deadTime=0,this.defeated=!1,this.hover=0,this.walkPhase=0,this.blink=0,this.tipFlash=0,this.intro=0,this.buildModel(),this.root.scale.setScalar(this.scale*1.08),this.root.position.y=.36}get alive(){return this.hp>0&&this.state!=="dead"}get isStaggered(){return this.state==="stagger"}get hpRatio(){return $t(this.hp/this.maxHp,0,1)}forward(t=new C){return t.set(Math.sin(this.yaw),0,Math.cos(this.yaw))}buildModel(){const t=this.config,e=ae(this.kind==="warden"?4474701:t.armor,{metalness:.64,roughness:.48}),i=ae(t.armorDark,{metalness:.7,roughness:.52}),n=ae(t.trim,{metalness:.85,roughness:.34}),r=ae(t.cloth,{roughness:.92,side:Se}),a=new pe({color:t.eye}),o=ae(11581632,{metalness:.95,roughness:.24,emissive:1120288,emissiveIntensity:.3});this.armor=e,this.armorDark=i,this.trim=n,this.eyeMat=a,this.weaponMat=o,this.body=new Wt,this.model.add(this.body),wt(this.body,1.05,.55,.62,i,0,1.62,0),wt(this.body,1.1,.16,.66,n,0,1.88,0),this.torso=new Wt,this.torso.position.set(0,1.86,0),this.body.add(this.torso);const l=new _t(new De(.62,.66,5,12),e);l.position.y=.5,l.scale.set(1.22,1,.82),l.castShadow=!0,this.torso.add(l),wt(this.torso,1.3,.95,.42,e,0,.53,.26),wt(this.torso,1,.12,.48,n,0,1,.24),wt(this.torso,.88,.11,.46,n,0,.18,.24),this.chestGlow=new _t(new Ni(.1,.17,6),new pe({color:new Ft(t.eye).multiplyScalar(.68)})),this.chestGlow.position.set(0,.58,.49),this.chestGlow.scale.setScalar(.66),this.chestGlow.rotation.z=Math.PI/6,this.torso.add(this.chestGlow),this.head=new Wt,this.head.position.set(0,1.14,.02),this.torso.add(this.head),this.kind==="chorister"?this.buildChoristerHead(e,i,n,a,r):this.buildKnightHead(e,i,n,a);for(const S of[-1,1]){const m=Ki(this.torso,.38,e,S*.82,.85,0,1.2,.8,1.1);m.castShadow=!0,wt(this.torso,.6,.12,.55,n,S*.86,1.1,0),this.kind==="king"?(Le(this.torso,.12,.55,n,S*1.05,1.14,0,0,0,S*.5),Le(this.torso,.1,.38,i,S*.95,1.2,-.12,-.2,0,S*.3)):this.kind==="warden"&&Le(this.torso,.1,.42,n,S*1.03,1.14,0,0,0,S*.5)}this.armR=new Wt,this.armR.position.set(.82,.82,0),this.torso.add(this.armR);const h=new _t(new De(.18,.56,3,8),i);h.position.y=-.36,h.castShadow=!0,this.armR.add(h),this.elbowR=new Wt,this.elbowR.position.y=-.73,this.armR.add(this.elbowR);const c=new _t(new De(.15,.48,3,8),e);c.position.y=-.31,c.castShadow=!0,this.elbowR.add(c),wt(this.elbowR,.34,.26,.34,i,0,-.64,0),this.armL=new Wt,this.armL.position.set(-.82,.82,0),this.torso.add(this.armL);const u=new _t(new De(.18,.56,3,8),i);u.position.y=-.36,u.castShadow=!0,this.armL.add(u),this.elbowL=new Wt,this.elbowL.position.y=-.73,this.armL.add(this.elbowL);const d=new _t(new De(.15,.48,3,8),e);if(d.position.y=-.31,d.castShadow=!0,this.elbowL.add(d),wt(this.elbowL,.34,.26,.34,i,0,-.64,0),this.kind==="chorister"){const S=new _t(new os(.85,2.1,10,1,!0),r);S.position.y=.72,S.castShadow=!0,this.body.add(S),this.robe=S;for(let m=0;m<5;m++){const f=new _t(new qe(.13,1.9),r);f.position.set(Math.cos(m*1.256)*.52,.5,Math.sin(m*1.256)*.52),f.rotation.y=m*1.256,this.body.add(f)}}else for(const S of[-1,1]){const m=new Wt;m.position.set(S*.38,1.58,0),this.body.add(m);const f=new _t(new De(.22,.58,3,8),i);f.position.y=-.38,f.castShadow=!0,m.add(f),Ki(m,.18,e,0,-.72,.04,1,.8,1.1);const v=new _t(new De(.17,.56,3,8),e);v.position.y=-1.02,v.castShadow=!0,m.add(v),wt(m,.38,.2,.58,i,0,-1.36,.12),S===1?this.legR=m:this.legL=m}this.capePivot=new Wt,this.capePivot.position.set(0,.98,-.4),this.torso.add(this.capePivot);const p=new _t(new qe(1.75,2.65,6,10),r);p.position.y=-1.22,p.rotation.x=.08,p.castShadow=!0,this.capePivot.add(p),this.cape=p;const _=new _t(new qe(1.8,.12),n);if(_.position.set(0,-2.48,.01),p.add(_),this.weapon=new Wt,this.weapon.position.set(0,-.66,.05),this.elbowR.add(this.weapon),this.buildWeapon(o,n,i),this.kind==="chorister"&&(this.weaponL=new Wt,this.weaponL.position.set(0,-.66,.05),this.elbowL.add(this.weaponL),this.buildTwinBlade(this.weaponL,o,n),this.halo=new _t(new Ci(.62,.035,4,48),new pe({color:t.eye,transparent:!0,opacity:.75,blending:oe})),this.halo.position.set(0,1.5,-.15),this.halo.rotation.x=.35,this.torso.add(this.halo)),this.kind==="king"){const S=new Wt;S.position.set(0,1.45,0),this.head.add(S);for(let f=0;f<7;f++){const v=f/7*Math.PI*2;Le(S,.075,.45+f%2*.25,n,Math.cos(v)*.32,.2,Math.sin(v)*.32,0,0,Math.cos(v)*.3)}const m=new pe({color:16735010});for(let f=0;f<5;f++){const v=wt(this.torso,.045,zt(.3,.7),.03,m,zt(-.42,.42),zt(.2,.95),.5,0,0,zt(-.5,.5));v.castShadow=!1}}this.aura=new vi(new di({map:Yi(256,"rgba(255,255,255,0.75)","rgba(0,0,0,0)"),color:t.color,transparent:!0,opacity:.05,depthWrite:!1,blending:oe})),this.aura.position.set(0,2.25,-1.1),this.aura.scale.set(4.6,6.2,1),this.model.add(this.aura),this.light=new Qa(t.color,5,8,2),this.light.position.set(0,2.6,-1.1),this.model.add(this.light),this.weaponTipGlow=new vi(new di({map:Yi(128,"rgba(255,255,255,1)","rgba(255,210,140,0)"),color:16774358,transparent:!0,opacity:0,depthWrite:!1,depthTest:!1,blending:oe})),this.weaponTipGlow.position.set(0,this.kind==="king"?2.55:3.15,0),this.weaponTipGlow.renderOrder=12,this.weapon.add(this.weaponTipGlow),this.root.traverse(S=>{S.isMesh&&(S.castShadow=!0,S.receiveShadow=!0)})}buildKnightHead(t,e,i,n){const r=new _t(new De(.32,.26,4,12),t);r.position.y=.22,r.castShadow=!0,this.head.add(r),wt(this.head,.58,.16,.12,e,0,.25,.27),wt(this.head,.42,.035,.02,n,0,.26,.34),Le(this.head,.1,.7,i,-.4,.55,0,0,0,-.55),Le(this.head,.1,.7,i,.4,.55,0,0,0,.55),Le(this.head,.08,.42,e,0,.55,-.18,-.2,0,0),wt(this.head,.18,.22,.4,e,0,.06,-.06)}buildChoristerHead(t,e,i,n,r){const a=new _t(new os(.42,.95,8),r);a.position.y=.32,a.rotation.x=.06,a.castShadow=!0,this.head.add(a);const o=new _t(new Li(.23,16),ae(14209988,{roughness:.5,metalness:.1}));o.position.set(0,.2,.31),this.head.add(o);for(const l of[-1,1]){const h=wt(this.head,.07,.025,.02,n,l*.09,.25,.335);h.rotation.z=l*.2}wt(this.head,.1,.28,.05,i,0,.08,.32)}buildWeapon(t,e,i){if(this.kind==="king"){const r=new _t(new pi(.055,.065,2.2,8),ae(2365201,{roughness:.9}));r.position.y=.45,this.weapon.add(r),wt(this.weapon,.75,.14,.22,e,0,1.55,0);const a=wt(this.weapon,.85,1.55,.1,t,.12,2.28,0,0,0,-.12);a.castShadow=!0,wt(this.weapon,.26,1.1,.08,i,-.34,2.28,0,0,0,.25),Le(this.weapon,.24,.6,t,.54,2.98,0,0,0,-.3),this.blade=a,this.bladeLen=3.1}else{const r=new _t(new pi(.05,.055,.55,8),ae(2365201,{roughness:.9}));r.position.y=.1,this.weapon.add(r),wt(this.weapon,.75,.1,.16,e,0,.36,0),Ki(this.weapon,.09,e,0,-.2,0);const a=wt(this.weapon,.2,2.65,.07,t,0,1.7,0);a.castShadow=!0,Le(this.weapon,.1,.48,t,0,3.15,0),wt(this.weapon,.035,2.1,.075,new pe({color:this.config.eye}),0,1.7,.005),this.blade=a,this.bladeLen=3.3}}buildTwinBlade(t,e,i){const n=new _t(new pi(.035,.04,.45,8),ae(2365201,{roughness:.9}));t.add(n),wt(t,.44,.07,.1,i,0,.24,0);const r=wt(t,.1,1.8,.04,e,0,1.16,0,0,0,.04);r.castShadow=!0,Le(t,.05,.34,e,.04,2.16,0,0,0,.04),wt(t,.02,1.4,.045,new pe({color:this.config.eye}),.015,1.15,.005)}clearHazards(){for(const t of this.projectiles)this.scene.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose();this.projectiles.length=0;for(const t of this.hazards)t.mesh&&(this.scene.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose()),t.ring&&(this.scene.remove(t.ring),t.ring.geometry.dispose(),t.ring.material.dispose());this.hazards.length=0}spawnAt(t){this.clearHazards(),this.pos.copy(t),this.root.position.copy(t),this.root.position.y=.36,this.state="idle",this.stateTime=0,this.cooldown=1.4,this.hp=this.maxHp,this.staggerMeter=0,this.phase=1,this.phaseTransition=!1,this.defeated=!1,this.attack=null,this.staggerTimer=0,this.blink=0,this.windupSound=!1,this.blinked=!1,this.model.visible=!0,this.model.position.y=0,this.root.rotation.set(0,0,0)}chooseAttack(t){const e=this.distanceTo(t.pos),i=this.config.attacks.filter(a=>e>=a.min&&e<=a.max&&(!a.phase2||this.phase===2));if(!i.length)return null;const n=i.reduce((a,o)=>a+(o.weight||1),0);let r=Math.random()*n;for(const a of i)if(r-=a.weight||1,r<=0)return a;return Hm(i)}beginAttack(t){this.attack=t,this.state="windup",this.stateTime=0,this.attackTime=0,this.hitIndex=0,this.attackHit=!1,this.parryCue=!1,this.weaponGlow=0,this.windupSound=!1,this.blinked=!1,this.game.bossTelegraph(this,t),this.audio.whoosh()}update(t,e){if(this.stateTime+=t,this.attackTime+=t,this.hitFlash=Math.max(0,this.hitFlash-t*4),this.weaponGlow=Math.max(0,this.weaponGlow-t*3.2),this.tipFlash=Math.max(0,this.tipFlash-t*5),this.updateProjectiles(t,e),this.updateHazards(t,e),this.hover=this.config.hover?this.config.hover+Math.sin(this.game.time*1.8+2)*.09:0,this.state==="dead"){this.deadTime+=t,this.animate(t,e),this.updateGlow(t);return}this.hp<=this.maxHp*.5&&this.phase===1&&this.kind==="king"&&this.enterPhaseTwo(),this.cooldown=Math.max(0,this.cooldown-t);const i=this.distanceTo(e.pos);switch(this.parryCue=!1,this.state){case"idle":{if(this.face(e,t,3.2),this.think-=t,this.think<=0&&this.cooldown<=0){const n=this.chooseAttack(e);n?this.beginAttack(n):i>6?(this.state="approach",this.stateTime=0,this.think=zt(.6,1.4)):this.think=zt(.25,.6)}break}case"approach":{this.face(e,t,5);const n=this.forward(),r=this.speed*t;i>4.8&&(this.pos.x+=n.x*r,this.pos.z+=n.z*r),this.walkPhase+=t*7,(this.stateTime>1.6||i<4.9)&&(this.state="idle",this.stateTime=0,this.think=zt(.05,.3));break}case"windup":{const n=this.attack;this.face(e,t,1.6);const r=$t(this.stateTime/n.windup,0,1);this.weaponGlow=r>.5?(r-.5)*2:0,n.parryable&&this.stateTime>=n.windup-.24&&(this.parryCue=!0),n.kind==="blink"&&r>.38&&!this.blinked&&(this.blinked=!0,this.blink=1,this.teleportBehind(e),this.effects.flash(new C(this.pos.x,1.6,this.pos.z),{color:12447487,size:4,life:.4})),r>.7&&!this.windupSound&&(this.windupSound=!0,this.audio.whoosh(),this.tipFlash=1),this.stateTime>=n.windup&&(this.state="active",this.stateTime=0,this.windupSound=!1,this.blinked=!1,this.doImpact(e));break}case"active":{const n=this.attack;if(n.kind==="charge"){const r=this.forward();this.pos.x+=r.x*14*t,this.pos.z+=r.z*14*t,this.attackHit||this.strikePlayer(e,n)}if(n.kind==="lunge"){const r=this.forward();this.pos.x+=r.x*8*t,this.pos.z+=r.z*8*t}if(n.kind==="flurry")for(let r=this.hitIndex;r<n.hits.length&&this.state==="active";r++)this.stateTime>=n.hits[r]&&(this.hitIndex=r+1,this.strikePlayer(e,n,.05));this.stateTime>=n.active&&(this.state="recovery",this.stateTime=0);break}case"recovery":{this.face(e,t,1.2),this.stateTime>=this.attack.recovery&&(this.state="idle",this.stateTime=0,this.cooldown=this.attack.cooldown*(this.phase===2?.65:1),this.think=zt(.15,.55),this.attack=null,this.windupSound=!1);break}case"stagger":{this.staggerTimer-=t,this.staggerTimer<=0&&(this.state="idle",this.stateTime=0,this.cooldown=.4,this.staggerMeter=0,this.game.bossRecovered(this));break}case"phase":{this.stateTime>2.1&&(this.state="idle",this.stateTime=0,this.cooldown=.6,this.think=.2);break}}if(this.state!=="dead"){this.pos.x=$t(this.pos.x,-21,21),this.pos.z=$t(this.pos.z,-21,21);const n=Math.hypot(this.pos.x,this.pos.z);n>21&&(this.pos.x*=21/n,this.pos.z*=21/n),this.root.position.set(this.pos.x,.36+this.hover,this.pos.z),this.root.rotation.y=this.yaw,this.animate(t,e),this.updateGlow(t)}}updateGlow(t){this.state==="windup"&&$t(this.stateTime/this.attack.windup,0,1);const e=this.state==="active"?1:0,i=Math.max(this.weaponGlow*2.5,this.tipFlash*2.5,e*.6);this.weaponMat&&(this.weaponMat.emissiveIntensity=.3+i*5.5),this.weaponMat&&this.weaponMat.emissive.setHex(i>1.4?16773312:this.config.eye),this.weaponTipGlow&&(this.weaponTipGlow.material.opacity=$t(this.weaponGlow*1.8+this.tipFlash,0,1),this.weaponTipGlow.scale.setScalar(.85+this.tipFlash*1.8+this.weaponGlow*.5)),this.eyeMat&&this.eyeMat.color.setHex(this.hitFlash>.2?16777215:this.config.eye),this.aura&&(this.aura.material.opacity=.055+Math.sin(this.game.time*2.2)*.015+(this.phase===2?.06:0)+this.weaponGlow*.08),this.light&&(this.light.intensity=5+Math.sin(this.game.time*3)*1.2+this.weaponGlow*15+(this.phase===2?8:0)),this.chestGlow&&this.chestGlow.scale.setScalar(1+this.weaponGlow*.7+Math.sin(this.game.time*2.8)*.08),this.halo&&(this.halo.rotation.z+=t*.4,this.halo.material.opacity=.45+Math.sin(this.game.time*2)*.15)}face(t,e,i){let r=Math.atan2(t.pos.x-this.pos.x,t.pos.z-this.pos.z)-this.yaw;for(;r>Math.PI;)r-=Math.PI*2;for(;r<-Math.PI;)r+=Math.PI*2;this.yaw+=r*Math.min(1,e*i)}distanceTo(t){return Math.hypot(t.x-this.pos.x,t.z-this.pos.z)}doImpact(t){const e=this.attack;if(e){if(this.tipFlash=1,this.effects.flash(new C(this.pos.x,2.2,this.pos.z),{color:this.config.color,size:2.4,life:.25}),e.kind==="slam"){if(this.strikePlayer(t,e,0),this.state==="stagger")return;this.effects.ring(this.pos,{color:this.config.color,radius:e.aoe,life:.65,width:.2}),this.effects.burst(new C(this.pos.x,.7,this.pos.z),{color:this.config.color,count:36,speed:7,size:.13,gravity:4}),this.spawnShockwave(this.pos.clone(),e.aoe,24,this.config.color)}else e.kind==="sweep"||e.kind==="twin"||e.kind==="blink"||e.kind==="lunge"||e.kind==="flurry"?this.effects.slash(new C(this.pos.x,this.pos.y||.36,this.pos.z),this.yaw,{radius:e.range||4,arc:e.arc||2.4,color:this.config.color,life:.2,y:1.5,scale:1.2}):e.kind==="fan"?this.castFan(t):e.kind==="eruption"&&this.castEruption(t);["sweep","twin","blink","lunge"].includes(e.kind)&&this.strikePlayer(t,e,0)}}strikePlayer(t,e,i=0){const n=this.distanceTo(t.pos),r=new C(t.pos.x-this.pos.x,0,t.pos.z-this.pos.z).normalize(),a=this.forward().dot(r),o=e.aoe||(e.kind==="charge"?2.8:e.kind==="lunge"?3.4:e.range||5),l=n<=o+t.radius,h=e.aoe||!e.arc||a>Math.cos(e.arc/2);if(!(!l||!h)){if(t.isParryActive&&e.parryable){this.game.bossParried(this,t);return}t.state==="roll"&&t.invuln>0||this.hitPlayer(t,e)}}hitPlayer(t,e){this.attackHit&&this.attack&&this.attack.kind!=="flurry"||(this.attack&&this.attack.kind!=="flurry"&&(this.attackHit=!0),t.takeDamage(e.damage,this.pos,{unblockable:!e.parryable}))}castFan(t){const i=Math.atan2(t.pos.x-this.pos.x,t.pos.z-this.pos.z);for(let n=0;n<5;n++){const r=(n-2)*.18;this.spawnProjectile(i+r)}this.audio.cast(),this.effects.flash(new C(this.pos.x,2.4,this.pos.z),{color:11135743,size:3.4,life:.45})}spawnProjectile(t){const e=new cs(.18,8,6),i=new pe({color:12382207}),n=new _t(e,i);n.position.set(this.pos.x,2.2,this.pos.z);const r=new vi(new di({map:Yi(128,"rgba(190,240,255,0.9)","rgba(80,160,255,0)"),transparent:!0,opacity:.9,depthWrite:!1,blending:oe}));r.scale.setScalar(1.8),n.add(r),this.scene.add(n);const a=11;this.projectiles.push({mesh:n,vel:new C(Math.sin(t)*a,0,Math.cos(t)*a),life:3.4,damage:13,hit:!1})}updateProjectiles(t,e){for(let i=this.projectiles.length-1;i>=0;i--){const n=this.projectiles[i];n.life-=t,n.mesh.position.addScaledVector(n.vel,t),n.mesh.rotation.y+=t*8;const r=n.mesh.position.x-e.pos.x,a=n.mesh.position.z-e.pos.z;!n.hit&&Math.hypot(r,a)<.75&&Math.abs(n.mesh.position.y-(e.pos.y+1.1))<1.4&&(n.hit=!0,e.state==="roll"&&e.invuln>0||e.takeDamage(n.damage,n.mesh.position,{unblockable:!0}),this.effects.burst(n.mesh.position,{color:11135743,count:16,speed:4,size:.1,gravity:2,life:.5})),(n.life<=0||n.hit||Math.hypot(n.mesh.position.x,n.mesh.position.z)>26)&&(this.scene.remove(n.mesh),n.mesh.geometry.dispose(),n.mesh.material.dispose(),this.projectiles.splice(i,1))}}spawnShockwave(t,e,i,n){const r=new Ni(.93,1,64),a=new pe({color:n,transparent:!0,opacity:.85,side:Se,depthWrite:!1,blending:oe}),o=new _t(r,a);o.position.set(t.x,.45,t.z),o.rotation.x=-Math.PI/2,o.scale.setScalar(.6),this.scene.add(o),this.hazards.push({type:"wave",mesh:o,radius:.6,maxRadius:e,speed:13,damage:i,hit:!1,life:1.3,color:n})}castEruption(t){this.audio.cast();for(let e=0;e<2;e++){const i=e===0?0:zt(-3,3),n=new C(t.pos.x+i,.42,t.pos.z+(e===0?0:zt(-3,3))),r=new Li(2.6,32),a=new pe({color:16731934,transparent:!0,opacity:.18,side:Se,depthWrite:!1,blending:oe}),o=new _t(r,a);o.rotation.x=-Math.PI/2,o.position.copy(n),this.scene.add(o);const l=new _t(new Ni(2.5,2.7,48),new pe({color:16753758,transparent:!0,opacity:.7,side:Se,depthWrite:!1,blending:oe}));l.rotation.x=-Math.PI/2,l.position.copy(n),this.scene.add(l),this.hazards.push({type:"eruption",mesh:o,ring:l,pos:n,timer:.95,radius:2.7,damage:34,exploded:!1,life:1.6})}}updateHazards(t,e){for(let i=this.hazards.length-1;i>=0;i--){const n=this.hazards[i];if(n.life-=t,n.type==="wave"){n.radius+=n.speed*t,n.mesh.scale.setScalar(n.radius),n.mesh.material.opacity=$t(1-n.radius/n.maxRadius,0,1)*.85;const r=this.distanceTo(e.pos);!n.hit&&Math.abs(r-n.radius)<.8&&e.invuln<=0&&(n.hit=!0,e.takeDamage(n.damage,this.pos,{unblockable:!0}),this.effects.burst(new C(e.pos.x,.6,e.pos.z),{color:n.color,count:24,speed:4,size:.12,gravity:5})),(n.radius>=n.maxRadius||n.life<=0)&&(this.scene.remove(n.mesh),n.mesh.geometry.dispose(),n.mesh.material.dispose(),this.hazards.splice(i,1))}else if(n.type==="eruption"){n.timer-=t;const r=$t(1-n.timer/.95,0,1);n.mesh.material.opacity=.12+r*.22+Math.sin(this.game.time*20)*.05,n.mesh.scale.setScalar(.5+r*.5),!n.exploded&&n.timer<=0&&(n.exploded=!0,n.mesh.material.opacity=.7,this.effects.flash(n.pos,{color:16738850,size:6,life:.6,y:.5}),this.effects.ring(n.pos,{color:16738850,radius:n.radius+1,life:.6}),this.effects.burst(new C(n.pos.x,.6,n.pos.z),{color:16742958,count:60,speed:9,size:.15,gravity:5,life:1.1}),this.audio.hit(!0),Math.hypot(e.pos.x-n.pos.x,e.pos.z-n.pos.z)<n.radius&&e.invuln<=0&&e.takeDamage(n.damage,n.pos,{unblockable:!0}),n.mesh.material.opacity=.35),n.life<=0&&(this.scene.remove(n.mesh),this.scene.remove(n.ring),n.mesh.geometry.dispose(),n.mesh.material.dispose(),n.ring.geometry.dispose(),n.ring.material.dispose(),this.hazards.splice(i,1))}}}teleportBehind(t){const e=new C(Math.sin(t.yaw),0,Math.cos(t.yaw));this.pos.set(t.pos.x-e.x*3.2,.36,t.pos.z-e.z*3.2),this.yaw=Math.atan2(t.pos.x-this.pos.x,t.pos.z-this.pos.z),this.blink=1}enterPhaseTwo(){this.phase=2,this.state="phase",this.stateTime=0,this.attack=null,this.weaponGlow=1,this.audio.roar(!0),this.game.bossPhaseTwo(this),this.effects.ring(this.pos,{color:16735010,radius:10,life:1.2}),this.effects.flash(new C(this.pos.x,2.4,this.pos.z),{color:16739120,size:8,life:.8}),this.effects.burst(new C(this.pos.x,1.2,this.pos.z),{color:16735010,count:100,speed:11,size:.18,gravity:2,life:1.6}),this.game.cameraShake(.8)}takeDamage(t,e=0,i=null,n="light"){if(this.alive){if(this.hp=Math.max(0,this.hp-t),this.hitFlash=1,this.staggerMeter+=e,this.game.updateBossUI(this),n==="riposte"&&(this.staggerTimer=Math.max(this.staggerTimer,1.2),this.staggerMeter=0),this.hp<=0){this.die();return}this.staggerMeter>=100&&this.state!=="stagger"&&this.state!=="phase"&&this.stagger()}}stagger(){this.state="stagger",this.stateTime=0,this.staggerTimer=2.55,this.staggerMeter=0,this.attack=null,this.parryCue=!1,this.weaponGlow=0,this.audio.roar(!1),this.effects.ring(this.pos,{color:16769184,radius:6,life:.8}),this.effects.burst(new C(this.pos.x,2.1,this.pos.z),{color:16769184,count:45,speed:7,size:.13,gravity:3}),this.game.bossStaggered(this),this.game.cameraShake(.35)}die(){this.defeated||(this.defeated=!0,this.state="dead",this.stateTime=0,this.deadTime=0,this.attack=null,this.parryCue=!1,this.audio.bossDeath(),this.effects.flash(new C(this.pos.x,2.2,this.pos.z),{color:this.config.color,size:9,life:.9}),this.effects.ring(this.pos,{color:this.config.color,radius:12,life:1.3}),this.effects.burst(new C(this.pos.x,2,this.pos.z),{color:this.config.color,count:120,speed:10,size:.16,gravity:2,life:1.8}),this.game.cameraShake(.9),this.game.bossDefeated(this))}animate(t,e){const i=this.game.time;this.walkPhase+=t*(this.state==="approach"?8:2.2);const n=this.walkPhase,r=Math.sin(i*1.8)*.012;if(this.body.position.set(0,0,0),this.body.rotation.set(0,0,0),this.model.position.y=0,this.torso.position.y=1.86+r,this.torso.rotation.set(0,0,0),this.head.rotation.set(0,0,0),this.armR.rotation.set(-.18,0,.18),this.armL.rotation.set(-.12,0,-.18),this.elbowR.rotation.set(.12,0,0),this.elbowL.rotation.set(.12,0,0),this.cape.rotation.set(.08,0,0),this.capePivot.rotation.set(0,0,0),this.legR&&this.legR.rotation.set(0,0,0),this.legL&&this.legL.rotation.set(0,0,0),this.weapon&&this.weapon.rotation.set(0,0,0),this.weaponL&&this.weaponL.rotation.set(0,0,0),this.halo&&(this.halo.position.y=1.5+Math.sin(i*1.2)*.05),this.state==="approach"||this.state==="idle"){const a=this.state==="approach",o=a?1:.12;this.legR&&(this.legR.rotation.x=Math.sin(n)*.48*o,this.legL.rotation.x=-Math.sin(n)*.48*o),this.armR.rotation.x=-.18-Math.sin(n)*.2*o,this.armL.rotation.x=-.12+Math.sin(n)*.2*o,this.torso.rotation.z=Math.sin(n*2)*.025*o,this.cape.rotation.x=.08+(a?.16:.02)+Math.sin(i*1.4)*.03,this.model.position.y=a?Math.abs(Math.sin(n))*.03:0}if(this.state==="windup"&&this.attack){const a=this.attack,o=$t(this.stateTime/a.windup,0,1),l=o*o*(3-2*o);a.kind==="slam"?(this.armR.rotation.x=Et(-.2,-2.9,l),this.armR.rotation.z=Et(.18,.55,l),this.elbowR.rotation.x=Et(.12,.6,l),this.torso.rotation.x=Et(0,-.16,l),this.torso.rotation.y=Et(0,-.25,l),this.armL.rotation.x=Et(-.12,-.9,l),this.cape.rotation.x=.1+l*.3):a.kind==="fan"||a.kind==="eruption"?(this.armR.rotation.x=Et(-.2,-2.6,l),this.armL.rotation.x=Et(-.12,-2.6,l),this.armR.rotation.z=Et(.18,.45,l),this.armL.rotation.z=Et(-.18,-.45,l),this.torso.rotation.x=Et(0,-.12,l),this.head.rotation.x=Et(0,-.2,l)):a.kind==="charge"?(this.armR.rotation.x=Et(-.2,-1.2,l),this.armR.rotation.z=Et(.18,.6,l),this.torso.rotation.x=Et(0,.25,l),this.body.position.y=-l*.18,this.legR&&(this.legR.rotation.x=.4*l,this.legL.rotation.x=-.5*l)):a.kind==="twin"?(this.armR.rotation.x=Et(-.2,-1.9,l),this.armL.rotation.x=Et(-.12,-1.7,l),this.armR.rotation.z=Et(.18,.7,l),this.armL.rotation.z=Et(-.18,-.7,l),this.torso.rotation.y=Et(0,-.55,l)):(this.armR.rotation.x=Et(-.2,-2.45,l),this.armR.rotation.z=Et(.18,.7,l),this.elbowR.rotation.x=Et(.12,.4,l),this.torso.rotation.y=Et(0,-.75,l),this.torso.rotation.x=Et(0,.12,l),this.armL.rotation.x=Et(-.12,-.7,l),this.cape.rotation.x=.1+l*.25),this.head.rotation.y=-this.torso.rotation.y*.4}else if(this.state==="active"&&this.attack){const a=this.attack,o=$t(this.stateTime/a.active,0,1),l=1-Math.pow(1-o,2);if(a.kind==="slam")this.armR.rotation.x=Et(-2.9,1.15,l),this.armR.rotation.z=Et(.55,-.1,l),this.torso.rotation.x=Et(-.16,.55,l),this.torso.rotation.y=Et(-.25,.3,l),this.body.position.y=-Math.sin(o*Math.PI)*.12;else if(a.kind==="fan"||a.kind==="eruption")this.armR.rotation.x=Et(-2.6,-.2,l),this.armL.rotation.x=Et(-2.6,-.2,l),this.torso.rotation.x=Et(-.12,.18,l);else if(a.kind==="twin")this.armR.rotation.x=Et(-1.9,.7,l),this.armL.rotation.x=Et(-1.7,.4,l),this.torso.rotation.y=Et(-.55,.65,l);else if(a.kind==="flurry"){const h=Math.sin(o*Math.PI*3);this.armR.rotation.x=-1.4+h*1.9,this.armL.rotation.x=-1.3-h*1.6,this.torso.rotation.y=h*.7,this.torso.rotation.x=.2}else a.kind==="charge"?(this.armR.rotation.x=-1,this.armR.rotation.z=.8,this.torso.rotation.x=.35,this.body.position.y=-.1):(this.armR.rotation.x=Et(-2.45,.85,l),this.armR.rotation.z=Et(.7,-.15,l),this.torso.rotation.y=Et(-.75,.72,l),this.torso.rotation.x=Et(.12,.38,l),this.armL.rotation.x=Et(-.7,-.15,l),this.cape.rotation.x=.3+l*.3);this.legR&&(this.legR.rotation.x=-.25*l),this.legL&&(this.legL.rotation.x=.3*l)}else if(this.state==="recovery"){const o=1-$t(this.stateTime/this.attack.recovery,0,1);this.armR.rotation.x=-.2-o*.8,this.torso.rotation.x=o*.2,this.torso.rotation.y=o*.15}else if(this.state==="stagger"){const a=Math.sin($t(this.stateTime/.45,0,1)*Math.PI/2);this.body.position.y=-.28*a,this.torso.rotation.x=.55*a,this.torso.rotation.z=-.12*a,this.head.rotation.x=.4*a,this.armR.rotation.x=.35*a,this.armL.rotation.x=.3*a,this.armR.rotation.z=.45*a,this.armL.rotation.z=-.45*a,this.legR&&(this.legR.rotation.x=-.4*a,this.legL.rotation.x=-.5*a),this.cape.rotation.x=.05}else if(this.state==="phase"){const a=Math.sin($t(this.stateTime/2.1,0,1)*Math.PI);this.torso.rotation.x=-.3*a,this.head.rotation.x=-.5*a,this.armR.rotation.x=-2.4*a,this.armL.rotation.x=-2.4*a,this.armR.rotation.z=.6*a,this.armL.rotation.z=-.6*a,this.body.position.y=.08*a,this.cape.rotation.x=.5*a,this.legR&&(this.legR.rotation.x=-.2*a,this.legL.rotation.x=-.2*a)}else if(this.state==="dead"){const a=$t(this.deadTime/1.7,0,1),o=a*a*(3-2*a);this.body.rotation.z=o*1.35,this.body.rotation.x=o*.25,this.body.position.y=-o*.45,this.armR.rotation.x=-.8*o,this.armL.rotation.x=-.6*o,this.armR.rotation.z=.5*o,this.armL.rotation.z=-.5*o,this.legR&&(this.legR.rotation.x=.2*o,this.legL.rotation.x=-.2*o),this.cape.rotation.x=.6*o,this.model.position.y=-o*.1}this.blink>0?(this.blink=Math.max(0,this.blink-t*3),this.model.visible=this.blink<.65):this.state!=="dead"&&(this.model.visible=!0),this.state==="dead"&&(this.model.visible=this.deadTime<3.6,this.root.position.y=.36)}}const Vr=["warden","chorister","king"];class jm{constructor(t){this.scene=t,this.items=[],this.sparkTex=uh(64),this.glowTex=Yi(128,"rgba(255,245,215,1)","rgba(255,180,90,0)"),this.tmp=new C}burst(t,{color:e=16761963,count:i=24,speed:n=5,size:r=.09,gravity:a=8,life:o=.7,spread:l=1,upward:h=.5,additive:c=!0}={}){const u=new Float32Array(i*3),d=[];for(let m=0;m<i;m++){u[m*3]=t.x,u[m*3+1]=t.y,u[m*3+2]=t.z;const f=new C(zt(-1,1)*l,zt(-.2,1)*l+h,zt(-1,1)*l).normalize();d.push(f.multiplyScalar(zt(n*.25,n)))}const p=new ge;p.setAttribute("position",new ti(u,3));const _=new Dn({map:this.sparkTex,color:e,size:r,transparent:!0,opacity:1,depthWrite:!1,blending:c?oe:ln,sizeAttenuation:!0}),S=new ts(p,_);S.frustumCulled=!1,this.scene.add(S),this.items.push({type:"particles",obj:S,velocities:d,life:o,maxLife:o,gravity:a,drag:.96})}dust(t,{count:e=18,radius:i=1.5,color:n=10196104}={}){const r=new Float32Array(e*3),a=[];for(let c=0;c<e;c++){const u=Math.random()*Math.PI*2,d=zt(.1,i);r[c*3]=t.x+Math.cos(u)*d,r[c*3+1]=t.y+zt(0,.3),r[c*3+2]=t.z+Math.sin(u)*d,a.push(new C(Math.cos(u)*zt(.4,2),zt(.2,1.4),Math.sin(u)*zt(.4,2)))}const o=new ge;o.setAttribute("position",new ti(r,3));const l=new Dn({map:this.sparkTex,color:n,size:.16,transparent:!0,opacity:.5,depthWrite:!1,blending:oe}),h=new ts(o,l);h.frustumCulled=!1,this.scene.add(h),this.items.push({type:"particles",obj:h,velocities:a,life:.8,maxLife:.8,gravity:-.4,drag:.94})}slash(t,e,{radius:i=2.2,arc:n=Math.PI*.95,color:r=14209728,life:a=.2,y:o=1.2,tilt:l=.15,scale:h=1}={}){const c=new Ni(i*.55,i,40,1,-n/2,n),u=new pe({color:r,transparent:!0,opacity:.85,side:Se,depthWrite:!1,blending:oe}),d=new _t(c,u);d.position.set(t.x,t.y+o,t.z),d.rotation.set(-Math.PI/2+l,e+Math.PI/2,0),d.scale.setScalar(h*.75),this.scene.add(d),this.items.push({type:"slash",obj:d,life:a,maxLife:a,startScale:h*.75,endScale:h*1.35})}ring(t,{color:e=13215850,radius:i=4,life:n=.55,y:r=.08,width:a=.12,opacity:o=.8}={}){const l=new Ni(.94,1,64),h=new pe({color:e,transparent:!0,opacity:o,side:Se,depthWrite:!1,blending:oe}),c=new _t(l,h);c.position.set(t.x,t.y+r,t.z),c.rotation.x=-Math.PI/2,c.scale.setScalar(.4),this.scene.add(c),this.items.push({type:"ring",obj:c,life:n,maxLife:n,radius:i})}flash(t,{color:e=16773836,size:i=1.2,life:n=.24,y:r=0}={}){const a=new di({map:this.glowTex,color:e,transparent:!0,opacity:1,depthWrite:!1,blending:oe}),o=new vi(a);o.position.set(t.x,t.y+r,t.z),o.scale.setScalar(i),this.scene.add(o),this.items.push({type:"flash",obj:o,life:n,maxLife:n,size:i})}beam(t,e,{color:i=16765562,life:n=.28,width:r=.12}={}){const a=new C().subVectors(e,t),o=a.length(),l=new pi(r,r*.25,o,6,1,!0),h=new pe({color:i,transparent:!0,opacity:.9,depthWrite:!1,blending:oe,side:Se}),c=new _t(l,h);c.position.copy(t).addScaledVector(a,.5),c.quaternion.setFromUnitVectors(new C(0,1,0),a.clone().normalize()),this.scene.add(c),this.items.push({type:"beam",obj:c,life:n,maxLife:n})}update(t){for(let e=this.items.length-1;e>=0;e--){const i=this.items[e];i.life-=t;const n=Math.max(0,i.life/i.maxLife);if(i.type==="particles"){const r=i.obj.geometry.attributes.position,a=r.array;for(let o=0;o<i.velocities.length;o++){const l=i.velocities[o];l.y-=i.gravity*t,l.multiplyScalar(Math.pow(i.drag,t*60)),a[o*3]+=l.x*t,a[o*3+1]+=l.y*t,a[o*3+2]+=l.z*t}r.needsUpdate=!0,i.obj.material.opacity=Math.min(1,n*2.2)}else if(i.type==="slash"){const r=1-n;i.obj.material.opacity=Math.sin(r*Math.PI)*.9,i.obj.scale.setScalar(i.startScale+(i.endScale-i.startScale)*r),i.obj.rotation.z=r*.5}else if(i.type==="ring"){const r=1-n;i.obj.scale.setScalar(.4+i.radius*r),i.obj.material.opacity=(1-r)*.75}else if(i.type==="flash"){const r=1-n;i.obj.material.opacity=n,i.obj.scale.setScalar(i.size*(.4+r*1.1))}else i.type==="beam"&&(i.obj.material.opacity=n);i.life<=0&&(this.scene.remove(i.obj),i.obj.geometry?.dispose(),i.obj.material?.dispose(),this.items.splice(e,1))}}}class t0{constructor(t){this.canvas=t,this.keys=new Set,this.queue=[],this.lookX=0,this.lookY=0,this.moveX=0,this.moveZ=0,this.touchMove={x:0,y:0},this.pointerLocked=!1,this.dragging=!1,this.lastPointer={x:0,y:0},this.enabled=!1,this.touchActive=!1,this.joystick=document.getElementById("joystick"),this.knob=document.getElementById("joystickKnob"),this.cameraZone=document.getElementById("cameraZone"),this._bind()}_bind(){window.addEventListener("keydown",t=>{["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(t.code)&&t.preventDefault(),!t.repeat&&(this.keys.add(t.code),(t.code==="KeyW"||t.code==="ArrowUp")&&this.keys.add("KeyW"),(t.code==="KeyA"||t.code==="ArrowLeft")&&this.keys.add("KeyA"),(t.code==="KeyS"||t.code==="ArrowDown")&&this.keys.add("KeyS"),(t.code==="KeyD"||t.code==="ArrowRight")&&this.keys.add("KeyD"),this._keyAction(t.code))}),window.addEventListener("keyup",t=>{this.keys.delete(t.code),(t.code==="KeyW"||t.code==="ArrowUp")&&this.keys.delete("KeyW"),(t.code==="KeyA"||t.code==="ArrowLeft")&&this.keys.delete("KeyA"),(t.code==="KeyS"||t.code==="ArrowDown")&&this.keys.delete("KeyS"),(t.code==="KeyD"||t.code==="ArrowRight")&&this.keys.delete("KeyD")}),window.addEventListener("blur",()=>this.keys.clear()),this.canvas.addEventListener("mousedown",t=>{this.enabled&&(t.button===0?(this.press("attack"),this.pointerLocked||this.canvas.requestPointerLock?.()):t.button===2&&(t.preventDefault(),this.press("parry")))}),this.canvas.addEventListener("contextmenu",t=>t.preventDefault()),document.addEventListener("pointerlockchange",()=>{this.pointerLocked=document.pointerLockElement===this.canvas,document.body.classList.toggle("pointer-locked",this.pointerLocked)}),document.addEventListener("mousemove",t=>{this.enabled&&(this.pointerLocked?(this.lookX+=t.movementX*.0022,this.lookY+=t.movementY*.0019):this.dragging&&(this.lookX+=(t.clientX-this.lastPointer.x)*.0032,this.lookY+=(t.clientY-this.lastPointer.y)*.0027,this.lastPointer={x:t.clientX,y:t.clientY}))}),this.canvas.addEventListener("mousedown",t=>{(t.button===1||t.button===0&&!this.pointerLocked)&&(this.dragging=!0,this.lastPointer={x:t.clientX,y:t.clientY})}),window.addEventListener("mouseup",()=>{this.dragging=!1}),this._bindTouch()}_keyAction(t){t==="KeyJ"?this.press("attack"):t==="KeyK"?this.press("heavy"):t==="KeyF"?this.press("parry"):t==="ShiftLeft"||t==="ShiftRight"||t==="Space"?this.press("dodge"):t==="KeyR"?this.press("flask"):t==="KeyQ"?this.press("lock"):t==="Escape"?this.press("pause"):t==="Enter"&&this.press("confirm")}_bindTouch(){const t=matchMedia("(pointer: coarse)").matches||"ontouchstart"in window;if(this.touchActive=t,this.joystick){let e=null;const i=()=>this.joystick.getBoundingClientRect(),n=a=>{if(a.pointerId!==e)return;const o=i(),l=o.left+o.width/2,h=o.top+o.height/2;let c=(a.clientX-l)/(o.width*.36),u=(a.clientY-h)/(o.height*.36);const d=Math.hypot(c,u);d>1&&(c/=d,u/=d),this.touchMove.x=c,this.touchMove.y=u,this.knob&&(this.knob.style.transform=`translate(${c*o.width*.3}px, ${u*o.height*.3}px)`)},r=a=>{a.pointerId===e&&(e=null,this.touchMove.x=0,this.touchMove.y=0,this.knob&&(this.knob.style.transform=""))};this.joystick.addEventListener("pointerdown",a=>{if(this.enabled){a.preventDefault(),e=a.pointerId;try{this.joystick.setPointerCapture(a.pointerId)}catch{}n(a)}}),this.joystick.addEventListener("pointermove",n),this.joystick.addEventListener("pointerup",r),this.joystick.addEventListener("pointercancel",r)}if(this.cameraZone){let e=null,i=0,n=0;this.cameraZone.addEventListener("pointerdown",a=>{if(this.enabled){a.preventDefault(),e=a.pointerId,i=a.clientX,n=a.clientY;try{this.cameraZone.setPointerCapture(a.pointerId)}catch{}}}),this.cameraZone.addEventListener("pointermove",a=>{a.pointerId===e&&(this.lookX+=(a.clientX-i)*.0045,this.lookY+=(a.clientY-n)*.0038,i=a.clientX,n=a.clientY)});const r=a=>{a.pointerId===e&&(e=null)};this.cameraZone.addEventListener("pointerup",r),this.cameraZone.addEventListener("pointercancel",r)}document.querySelectorAll("[data-action]").forEach(e=>{const i=e.dataset.action;e.addEventListener("pointerdown",r=>{this.enabled&&(r.preventDefault(),r.stopPropagation(),this.press(i),e.classList.add("is-down"))});const n=()=>e.classList.remove("is-down");e.addEventListener("pointerup",n),e.addEventListener("pointercancel",n),e.addEventListener("pointerleave",n)})}press(t){this.enabled&&this.queue.push(t)}consume(t){const e=this.queue.indexOf(t);return e===-1?!1:(this.queue.splice(e,1),!0)}flush(){this.queue.length=0,this.lookX=0,this.lookY=0}update(){let t=0,e=0;this.keys.has("KeyA")&&(t-=1),this.keys.has("KeyD")&&(t+=1),this.keys.has("KeyW")&&(e+=1),this.keys.has("KeyS")&&(e-=1),this.touchActive&&(Math.abs(this.touchMove.x)>.05||Math.abs(this.touchMove.y)>.05)&&(t=this.touchMove.x,e=-this.touchMove.y),this.moveX=t,this.moveZ=e;const i=this.lookX,n=this.lookY;return this.lookX=0,this.lookY=0,{x:t,z:e,lookX:i,lookY:n}}releasePointer(){document.pointerLockElement&&document.exitPointerLock?.()}}const xl=[{duration:.5,active:.17,end:.28,comboAt:.24,damage:42,poise:18,stamina:17,range:3.4,arc:1.85,lunge:2.2},{duration:.52,active:.18,end:.3,comboAt:.25,damage:48,poise:20,stamina:19,range:3.5,arc:1.95,lunge:2.3},{duration:.72,active:.24,end:.38,comboAt:.36,damage:68,poise:30,stamina:23,range:3.7,arc:1.7,lunge:2.8}],vl={duration:1,active:.42,end:.58,damage:105,poise:55,stamina:34,range:4.1,arc:1.75,lunge:3.2};class e0{constructor(t,e,i,n){this.scene=t,this.effects=e,this.audio=i,this.game=n,this.root=new Wt,this.model=new Wt,this.root.add(this.model),this.scene.add(this.root),this.pos=this.root.position,this.radius=.55,this.maxHp=100,this.maxStamina=100,this.reset(),this.buildModel(),this.root.position.set(0,.36,7),this.yaw=Math.PI,this.root.rotation.y=this.yaw}reset(){this.hp=this.maxHp,this.stamina=this.maxStamina,this.flasks=3,this.state="idle",this.stateTime=0,this.attackIndex=0,this.attackQueued=!1,this.attackDef=null,this.attackHit=!1,this.healed=!1,this.invuln=0,this.staminaDelay=0,this.velocity=new C,this.rollDir=new C(0,0,-1),this.combo=0,this.comboTimer=0,this.lockOn=!1,this.walkPhase=0,this.footClock=0,this.deadTime=0,this.hitFlash=0,this.parryGlow=0,this.riposteHit=!1,this.lastDamage=0,this.time=0,this.root&&(this.root.rotation.x=0),this.body&&(this.body.rotation.set(0,0,0),this.body.position.set(0,0,0))}get alive(){return this.hp>0&&this.state!=="dead"}get hpRatio(){return $t(this.hp/this.maxHp,0,1)}get staminaRatio(){return $t(this.stamina/this.maxStamina,0,1)}get isParryActive(){return this.state==="parry"&&this.stateTime>=.045&&this.stateTime<=.33}forward(t=new C){return t.set(Math.sin(this.yaw),0,Math.cos(this.yaw))}distanceToBoss(t){return t?Math.hypot(t.pos.x-this.pos.x,t.pos.z-this.pos.z):999}buildModel(){const t=ae(4278355,{metalness:.62,roughness:.48}),e=ae(1909289,{metalness:.6,roughness:.52}),i=ae(9271890,{metalness:.82,roughness:.36}),n=ae(2833232,{metalness:.05,roughness:.94,side:Se}),r=ae(7167034,{metalness:.35,roughness:.7,side:Se}),a=ae(12107975,{metalness:.95,roughness:.22,emissive:1385518,emissiveIntensity:.45}),o=new pe({color:10474730});this.glowMat=o,this.armorMat=t,this.body=new Wt,this.model.add(this.body),wt(this.body,.55,.3,.33,e,0,1,0),wt(this.body,.58,.1,.35,i,0,1.15,0),wt(this.body,.14,.14,.36,i,0,1,0),this.torso=new Wt,this.torso.position.set(0,1.18,0),this.body.add(this.torso);const l=new _t(new De(.29,.34,4,10),t);l.position.y=.28,l.scale.set(1.15,1,.72),l.castShadow=!0,this.torso.add(l),wt(this.torso,.62,.46,.18,t,0,.31,.14),wt(this.torso,.5,.07,.2,i,0,.52,.13),wt(this.torso,.38,.05,.2,i,0,.08,.14);const h=new _t(new Li(.09,4),o);h.position.set(0,.3,.245),h.rotation.z=Math.PI/4,this.torso.add(h),this.head=new Wt,this.head.position.set(0,.66,0),this.torso.add(this.head);const c=new _t(new De(.155,.12,4,10),t);c.position.y=.12,c.castShadow=!0,this.head.add(c),wt(this.head,.28,.07,.08,e,0,.13,.14);const u=wt(this.head,.2,.022,.02,o,0,.14,.19);u.castShadow=!1,Le(this.head,.045,.28,i,-.16,.28,0,0,0,-.45),Le(this.head,.045,.28,i,.16,.28,0,0,0,.45),wt(this.head,.05,.2,.25,e,0,.05,-.04);for(const L of[-1,1]){const R=Ki(this.torso,.2,t,L*.4,.45,0,1.2,.72,1.05);Le(this.torso,.08,.24,i,L*.53,.55,0,0,0,L*.5),R.castShadow=!0}this.armR=new Wt,this.armR.position.set(.42,.45,0),this.torso.add(this.armR);const d=new _t(new De(.105,.3,3,8),e);d.position.y=-.21,d.castShadow=!0,this.armR.add(d),this.elbowR=new Wt,this.elbowR.position.y=-.43,this.armR.add(this.elbowR);const p=new _t(new De(.085,.25,3,8),t);p.position.y=-.18,p.castShadow=!0,this.elbowR.add(p),wt(this.elbowR,.17,.14,.18,e,0,-.35,0),this.weapon=new Wt,this.weapon.position.set(0,-.38,.02),this.elbowR.add(this.weapon);const _=new _t(new pi(.026,.03,.26,8),ae(2365971,{roughness:.9}));_.position.y=.03,this.weapon.add(_),wt(this.weapon,.34,.055,.08,i,0,.15,0),Ki(this.weapon,.055,i,0,-.12,0);const S=wt(this.weapon,.075,1.12,.026,a,0,.73,0);S.castShadow=!0;const m=Le(this.weapon,.038,.22,a,0,1.39,0,0,0,0);m.castShadow=!0;const f=wt(this.weapon,.018,.9,.03,o,0,.72,.002);f.castShadow=!1,this.blade=S,this.armL=new Wt,this.armL.position.set(-.42,.45,0),this.torso.add(this.armL);const v=new _t(new De(.105,.3,3,8),e);v.position.y=-.21,v.castShadow=!0,this.armL.add(v),this.elbowL=new Wt,this.elbowL.position.y=-.43,this.armL.add(this.elbowL);const T=new _t(new De(.085,.25,3,8),t);T.position.y=-.18,T.castShadow=!0,this.elbowL.add(T),this.shield=new Wt,this.shield.position.set(-.09,-.22,.14),this.shield.rotation.z=.08,this.elbowL.add(this.shield);const b=wt(this.shield,.52,.64,.07,t,0,0,0);b.castShadow=!0,wt(this.shield,.54,.06,.08,i,0,.26,.01),wt(this.shield,.54,.06,.08,i,0,-.26,.01);const A=new _t(new Ni(.06,.1,6),o);A.position.set(0,0,.042),A.rotation.z=Math.PI/6,this.shield.add(A);for(const L of[-1,1]){const R=new Wt;R.position.set(L*.18,1,0),this.body.add(R);const N=new _t(new De(.135,.36,3,8),e);N.position.y=-.23,N.castShadow=!0,R.add(N);const F=Ki(R,.115,t,0,-.43,.03,1,.8,1.1);F.castShadow=!0;const H=new _t(new De(.1,.34,3,8),t);H.position.y=-.61,H.castShadow=!0,R.add(H),wt(R,.22,.14,.34,e,0,-.83,.06),L===1?this.legR=R:this.legL=R}this.capePivot=new Wt,this.capePivot.position.set(0,.55,-.18),this.torso.add(this.capePivot);const w=new qe(.68,1.12,5,8),g=w.attributes.position;for(let L=0;L<g.count;L++){const R=g.getY(L),N=.56+.44*((R+.56)/1.12);g.setX(L,g.getX(L)*N),R<-.42&&g.setX(L,g.getX(L)+Math.sin(R*9)*.025)}w.computeVertexNormals(),this.cape=new _t(w,n),this.cape.position.y=-.58,this.cape.rotation.x=.12,this.cape.castShadow=!0,this.capePivot.add(this.cape);const y=new _t(new qe(.6,.05,5,1),r);y.position.set(0,-1.07,.01),this.cape.add(y),this.parryAura=new vi(new di({map:Yi(128,"rgba(255,248,225,1)","rgba(255,220,150,0)"),transparent:!0,opacity:0,depthWrite:!1,blending:oe})),this.parryAura.scale.setScalar(2.2),this.shield.add(this.parryAura),this.parryAura.position.set(0,0,.2),this.root.traverse(L=>{L.isMesh&&(L.castShadow=!0,L.receiveShadow=!0)})}handleAction(t,e){if(!(!this.alive||this.game.state!=="playing")){if(t==="lock"){e&&e.alive&&(this.lockOn=!this.lockOn,this.game.audio.ui(),this.game.setToast(this.lockOn?"LOCKED ON":"LOCK RELEASED",!1,.7));return}if(!(this.state==="roll"||this.state==="hurt"||this.state==="dead"||this.state==="riposte"||this.state==="heal")){if((t==="attack"||t==="heavy")&&e&&e.isStaggered&&this.distanceToBoss(e)<4.4){this.startRiposte(e);return}if(t==="attack"){if(this.state==="attack"){this.stateTime>this.attackDef.comboAt*.65&&(this.attackQueued=!0);return}if(this.state==="parry")return;this.startAttack(!1,e)}else if(t==="heavy"){if(this.state==="attack"){this.stateTime>.28&&(this.attackQueued=!0);return}if(this.state==="parry")return;this.startAttack(!0,e)}else if(t==="dodge"){if(this.state==="attack"&&this.stateTime<this.attackDef.duration*.72)return;this.startDodge()}else if(t==="parry"){if(this.state==="attack"&&this.stateTime<this.attackDef.duration*.78)return;this.startParry()}else t==="flask"&&this.startHeal()}}}startAttack(t,e){const i=t?vl.stamina:xl[this.attackIndex].stamina;if(this.stamina<i){this.game.setToast("EXHAUSTED",!0,.5),this.game.audio.ui();return}if(this.stamina-=i,this.staminaDelay=.55,this.state=t?"heavy":"attack",this.stateTime=0,this.attackHit=!1,this.attackQueued=!1,this.attackDef=t?vl:xl[this.attackIndex],this.heavyAttack=t,t||(this.attackIndex=(this.attackIndex+1)%3),e&&!this.lockOn){const n=e.pos.x-this.pos.x,r=e.pos.z-this.pos.z;Math.hypot(n,r)<6&&(this.yaw=Math.atan2(n,r))}this.audio.swing(t),this.velocity.multiplyScalar(.3),this.game.playerAttackStarted(t)}startDodge(){if(this.stamina<22){this.game.setToast("EXHAUSTED",!0,.5),this.game.audio.ui();return}this.stamina-=22,this.staminaDelay=.6,this.state="roll",this.stateTime=0,this.attackQueued=!1;const t=this.game.input;let e=t.moveX,i=t.moveZ;Math.hypot(e,i)<.1&&(e=0,i=-1);const n=this.game.cameraYaw,r=new C(Math.sin(n),0,Math.cos(n)),a=new C(Math.cos(n),0,-Math.sin(n));this.rollDir.copy(r).multiplyScalar(i).addScaledVector(a,e).normalize(),this.yaw=Math.atan2(this.rollDir.x,this.rollDir.z),this.audio.dodge(),this.effects.dust(this.pos,{count:12,radius:.8})}startParry(){if(this.stamina<16){this.game.setToast("EXHAUSTED",!0,.5),this.game.audio.ui();return}this.stamina-=16,this.staminaDelay=.6,this.state="parry",this.stateTime=0,this.attackQueued=!1,this.parryGlow=1,this.audio.whoosh(),this.game.playerParryStarted()}startHeal(){if(this.flasks<=0){this.game.setToast("NO EMBERS LEFT",!0,.8),this.game.audio.ui();return}this.state==="attack"||this.state==="heavy"||(this.state="heal",this.stateTime=0,this.healed=!1,this.velocity.multiplyScalar(.1),this.game.audio.cast())}startRiposte(t){this.state="riposte",this.stateTime=0,this.riposteHit=!1,this.riposteTarget=t,this.yaw=Math.atan2(t.pos.x-this.pos.x,t.pos.z-this.pos.z),this.velocity.set(0,0,0),this.game.setToast("RIPOSTE",!1,1),this.game.playerRiposteStarted(t)}update(t,e){if(this.time+=t,this.state==="dead"){this.deadTime+=t,this.animate(t,0);return}if(this.stateTime+=t,this.invuln=Math.max(0,this.invuln-t),this.comboTimer=Math.max(0,this.comboTimer-t),this.comboTimer<=0&&(this.combo=0),this.staminaDelay=Math.max(0,this.staminaDelay-t),this.staminaDelay<=0&&this.state!=="roll"&&this.state!=="attack"&&this.state!=="heavy"&&(this.stamina=Math.min(this.maxStamina,this.stamina+31*t)),this.parryGlow>0&&(this.parryGlow=Math.max(0,this.parryGlow-t*2.8)),this.hitFlash=Math.max(0,this.hitFlash-t*3.5),e&&e.alive&&this.lockOn){let r=Math.atan2(e.pos.x-this.pos.x,e.pos.z-this.pos.z)-this.yaw;for(;r>Math.PI;)r-=Math.PI*2;for(;r<-Math.PI;)r+=Math.PI*2;this.yaw+=r*Math.min(1,t*8)}switch(this.state){case"idle":case"run":this.updateMovement(t,e);break;case"attack":case"heavy":this.updateAttack(t,e);break;case"roll":this.updateRoll(t);break;case"parry":this.updateParry(t);break;case"heal":this.updateHeal(t);break;case"riposte":this.updateRiposte(t);break;case"hurt":this.updateHurt(t);break}this.pos.x=$t(this.pos.x,-20.6,20.6),this.pos.z=$t(this.pos.z,-20.6,20.6);const i=Math.hypot(this.pos.x,this.pos.z);i>20.6&&(this.pos.x*=20.6/i,this.pos.z*=20.6/i),this.root.rotation.y=this.yaw,this.root.position.y=.36,this.animate(t,this.velocity.length())}updateMovement(t,e){const i=this.game.input,n=i.moveX,r=i.moveZ,a=this.game.cameraYaw,o=new C(Math.sin(a),0,Math.cos(a)),l=new C(Math.cos(a),0,-Math.sin(a)),h=o.multiplyScalar(r).addScaledVector(l,n),u=h.length()>.08;u&&h.normalize().multiplyScalar(5.25);const d=u?15:20;if(this.velocity.x=an(this.velocity.x,h.x,d,t),this.velocity.z=an(this.velocity.z,h.z,d,t),this.velocity.lengthSq()>.04&&(this.pos.x+=this.velocity.x*t,this.pos.z+=this.velocity.z*t),!this.lockOn&&u){let S=Math.atan2(this.velocity.x,this.velocity.z)-this.yaw;for(;S>Math.PI;)S-=Math.PI*2;for(;S<-Math.PI;)S+=Math.PI*2;this.yaw+=S*Math.min(1,t*12)}const p=u?"run":"idle";if(p!==this.state&&(this.state=p,this.stateTime=0),u&&(this.footClock-=t,this.footClock<=0&&(this.footClock=.34,this.audio.step())),e&&e.alive){const _=this.pos.x-e.pos.x,S=this.pos.z-e.pos.z,m=Math.hypot(_,S),f=1.15+this.radius;m<f&&m>.001&&(this.pos.x=e.pos.x+_/m*f,this.pos.z=e.pos.z+S/m*f)}}updateAttack(t,e){const i=this.attackDef,n=this.stateTime,r=this.forward();if(!this.attackHit&&n>=i.active){this.attackHit=!0;const a=this.distanceToBoss(e),o=r.dot(new C(e.pos.x-this.pos.x,0,e.pos.z-this.pos.z).normalize());a<=i.range+(e.radius||0)&&o>Math.cos(i.arc/2)?(this.game.hitBoss(i.damage,i.poise,this,this.heavyAttack?"heavy":"light"),this.audio.hit(this.heavyAttack),this.effects.burst(new C(e.pos.x,1.5,e.pos.z),{color:16765578,count:this.heavyAttack?32:18,speed:this.heavyAttack?7:5,size:.1,gravity:6}),this.effects.slash(this.pos,this.yaw,{radius:i.range+.5,arc:i.arc,color:this.heavyAttack?16761963:13097183,life:.18,y:this.heavyAttack?1.3:1.15,tilt:.12}),this.game.cameraShake(this.heavyAttack?.34:.18),this.game.hitStop(this.heavyAttack?.075:.045),this.combo++,this.comboTimer=2.4,this.game.updateCombo(this.combo)):a<5&&this.effects.slash(this.pos,this.yaw,{radius:i.range,arc:i.arc,color:10333880,life:.14,y:1.1})}n>i.active-.04&&n<i.end&&(this.pos.x+=r.x*i.lunge*t,this.pos.z+=r.z*i.lunge*t),n>=i.duration&&(this.attackQueued&&!this.heavyAttack?(this.attackQueued=!1,this.state="idle",this.stateTime=0,this.startAttack(!1,e)):(this.state="idle",this.stateTime=0,this.attackQueued=!1))}updateRoll(t){const e=this.stateTime/.52,i=11.5*(1-Math.pow(e,1.6))+1.5;this.pos.x+=this.rollDir.x*i*t,this.pos.z+=this.rollDir.z*i*t,this.invuln=Math.max(this.invuln,e>.06&&e<.62?.08:0),e>.25&&e<.7&&Math.random()<t*35&&this.effects.burst(new C(this.pos.x,.5,this.pos.z),{color:9142642,count:4,speed:1.2,size:.12,gravity:-.2,life:.5}),this.stateTime>=.52&&(this.state="idle",this.stateTime=0)}updateParry(t){this.stateTime>.3&&this.parryGlow>0&&(this.parryGlow=Math.max(0,this.parryGlow-t*2)),this.stateTime>=.58&&(this.state="idle",this.stateTime=0)}updateHeal(t){!this.healed&&this.stateTime>=.55&&(this.healed=!0,this.flasks--,this.hp=Math.min(this.maxHp,this.hp+38),this.effects.flash(new C(this.pos.x,1.2,this.pos.z),{color:16761963,size:2.2,life:.5}),this.effects.burst(new C(this.pos.x,1.1,this.pos.z),{color:16757854,count:30,speed:3,size:.12,gravity:-1,life:1.1,upward:1.2}),this.audio.heal(),this.game.setToast("EMBER RESTORED",!1,1)),this.stateTime>=1.15&&(this.state="idle",this.stateTime=0)}updateRiposte(t){const e=this.stateTime,i=this.riposteTarget;i&&(this.yaw=Math.atan2(i.pos.x-this.pos.x,i.pos.z-this.pos.z)),!this.riposteHit&&e>=.58&&(this.riposteHit=!0,i&&i.alive&&(this.game.hitBoss(260,120,this,"riposte"),this.audio.hit(!0),this.audio.parry(),this.effects.flash(new C(i.pos.x,2.2,i.pos.z),{color:16770728,size:4.5,life:.55}),this.effects.burst(new C(i.pos.x,2,i.pos.z),{color:16765562,count:70,speed:10,size:.16,gravity:4,life:1.1}),this.effects.slash(this.pos,this.yaw,{radius:4,arc:1.5,color:16769441,life:.32,y:1.4,scale:1.3}),this.game.cameraShake(.7),this.game.hitStop(.14),this.game.slowMotion(.25,.5))),e>=1.28&&(this.state="idle",this.stateTime=0)}updateHurt(t){this.pos.x+=this.velocity.x*t,this.pos.z+=this.velocity.z*t,this.velocity.multiplyScalar(Math.pow(.03,t)),this.stateTime>=.34&&(this.state="idle",this.stateTime=0)}takeDamage(t,e,{unblockable:i=!1}={}){if(!this.alive||this.invuln>0||this.state==="riposte")return!1;const n=this.pos.x-e.x,r=this.pos.z-e.z,a=Math.hypot(n,r)||1;return this.hp=Math.max(0,this.hp-t),this.lastDamage=t,this.hitFlash=1,this.invuln=.72,this.combo=0,this.comboTimer=0,this.game.updateCombo(0),this.game.cameraShake(.55),this.game.damageFlash(),this.game.hitStop(.06),this.effects.burst(new C(this.pos.x,1.1,this.pos.z),{color:10298153,count:26,speed:4.5,size:.11,gravity:9,life:.7}),this.audio.damage(),this.velocity.set(n/a*5.5,0,r/a*5.5),this.hp<=0?this.die():(this.state="hurt",this.stateTime=0,this.game.setToast(i?"UNBLOCKABLE":"WOUNDED",!0,.6)),!0}die(){this.state="dead",this.stateTime=0,this.deadTime=0,this.velocity.set(0,0,0),this.audio.death(),this.game.playerDied()}animate(t,e){const i=this.time,n=this.state==="run";this.walkPhase+=t*(n?10.2:2);const r=this.walkPhase,a=Math.sin(i*2.1)*.008;if(this.body.position.set(0,0,0),this.body.rotation.set(0,0,0),this.torso.position.y=1.18+a,this.torso.rotation.set(0,0,0),this.head.rotation.set(0,0,0),this.armR.rotation.set(-.16,0,.12),this.armL.rotation.set(-.12,0,-.15),this.elbowR.rotation.set(.08,0,0),this.elbowL.rotation.set(.12,0,0),this.legR.rotation.set(0,0,0),this.legL.rotation.set(0,0,0),this.cape.rotation.set(.12,0,0),this.shield.rotation.set(0,0,.08),this.weapon.rotation.set(0,0,0),n){const o=$t(e/5.25,0,1);this.legR.rotation.x=Math.sin(r)*.68*o,this.legL.rotation.x=-Math.sin(r)*.68*o,this.armR.rotation.x=-.1-Math.sin(r)*.3*o,this.armL.rotation.x=-.1+Math.sin(r)*.3*o,this.torso.rotation.z=Math.sin(r*2)*.035*o,this.body.position.y=Math.abs(Math.sin(r))*.045*o,this.cape.rotation.x=.3+Math.sin(r*2)*.08,this.capePivot.rotation.x=-.08*o}else this.armR.rotation.x+=Math.sin(i*2.1)*.015,this.armL.rotation.x+=Math.sin(i*2.1+1)*.015,this.cape.rotation.x=.12+Math.sin(i*1.3)*.025,this.capePivot.rotation.x=0;if(this.state==="attack"||this.state==="heavy"){const o=this.attackDef,l=$t(this.stateTime/o.duration,0,1),h=$t(l/.38,0,1),c=$t((l-.38)/.3,0,1),u=1-Math.pow(1-h,3),d=c*c*(3-2*c),p=this.heavyAttack;this.armR.rotation.x=p?Et(-.2,-2.75,u)-d*3.3:Et(-.2,-2.35,u)-d*2.9,this.armR.rotation.z=p?Et(.15,.45,u)-d*.35:Et(.15,.5,u)-d*.8,this.elbowR.rotation.x=Et(.1,.55,u)-d*.2,this.torso.rotation.y=Et(0,p?-.65:-.55,u)+d*(p?1.1:.95),this.torso.rotation.x=d*(p?.35:.2),this.armL.rotation.x=Et(-.2,-.7,u)+d*.5,this.armL.rotation.z=-.3,this.legR.rotation.x=Et(0,-.25,d),this.legL.rotation.x=Et(0,.3,d),this.cape.rotation.x=.25+d*.45,this.capePivot.rotation.x=-.1-d*.2}else if(this.state==="roll"){const o=$t(this.stateTime/.52,0,1);this.body.rotation.x=-o*Math.PI*2,this.body.position.y=Math.sin(o*Math.PI)*.35,this.armR.rotation.x=-1.1,this.armL.rotation.x=-1.1,this.elbowR.rotation.x=1.2,this.elbowL.rotation.x=1.2,this.legR.rotation.x=-1,this.legL.rotation.x=-.8,this.cape.rotation.x=.6}else if(this.state==="parry"){const o=$t(this.stateTime/.2,0,1);this.armL.rotation.x=Et(-.12,-1.35,Math.min(1,o*2.2)),this.armL.rotation.z=Et(-.15,.55,Math.min(1,o*2.2)),this.elbowL.rotation.x=Et(.12,.9,Math.min(1,o*2.2)),this.armR.rotation.x=-.55,this.armR.rotation.z=-.2,this.torso.rotation.y=-.25,this.torso.rotation.x=-.05,this.shield.rotation.z=.6}else if(this.state==="heal"){const o=Math.sin($t(this.stateTime/1.15,0,1)*Math.PI);this.armL.rotation.x=Et(-.12,-1.45,o),this.armL.rotation.z=Et(-.15,.65,o),this.elbowL.rotation.x=1.1*o,this.armR.rotation.x=-.5,this.torso.rotation.x=-.12*o,this.head.rotation.x=.15*o}else if(this.state==="riposte"){const o=$t((this.stateTime-.28)/.32,0,1),l=o*o*(3-2*o);this.armR.rotation.x=Et(-2.3,.55,l),this.armR.rotation.z=Et(.5,.05,l),this.elbowR.rotation.x=Et(.9,0,l),this.torso.rotation.y=Et(-.6,.35,l),this.torso.rotation.x=.18*l,this.armL.rotation.x=-.9,this.legR.rotation.x=-.3,this.legL.rotation.x=.2,this.cape.rotation.x=.45}else if(this.state==="hurt"){const o=$t(this.stateTime/.34,0,1);this.body.rotation.x=-.18*Math.sin(o*Math.PI),this.torso.rotation.x=.25*Math.sin(o*Math.PI),this.armR.rotation.x=-.8,this.armL.rotation.x=-.9,this.head.rotation.x=-.2}else if(this.state==="dead"){const o=$t(this.deadTime/1.3,0,1),l=o*o*(3-2*o);this.body.rotation.z=l*1.45,this.body.position.y=-l*.15,this.armR.rotation.x=-.5,this.armL.rotation.x=-.4,this.legR.rotation.x=.15,this.legL.rotation.x=-.15}this.parryAura.material.opacity=this.parryGlow*.85,this.parryAura.scale.setScalar(1.9+(1-this.parryGlow)*.8),this.glowMat.color.setHex(this.hitFlash>0?16736085:10474730)}restoreAfterBoss(){this.hp=Math.min(this.maxHp,this.hp+32),this.flasks=Math.min(3,this.flasks+1),this.stamina=this.maxStamina,this.lockOn=!1,this.state="idle",this.stateTime=0,this.invuln=1.2}}class i0{constructor(){this.ctx=null,this.master=null,this.musicGain=null,this.sfxGain=null,this.ambientGain=null,this.reverb=null,this.noise=null,this.started=!1,this.musicClock=0,this.heartClock=0,this.intensity=0,this._lastStep=0}async init(){if(this.ctx){this.ctx.state==="suspended"&&await this.ctx.resume();return}const t=window.AudioContext||window.webkitAudioContext;if(!t)return;this.ctx=new t;const e=this.ctx;this.master=e.createGain(),this.master.gain.value=.72;const i=e.createDynamicsCompressor();i.threshold.value=-20,i.knee.value=18,i.ratio.value=5,i.attack.value=.005,i.release.value=.3,this.master.connect(i),i.connect(e.destination),this.musicGain=e.createGain(),this.musicGain.gain.value=.36,this.sfxGain=e.createGain(),this.sfxGain.gain.value=.82,this.ambientGain=e.createGain(),this.ambientGain.gain.value=.55,this.musicGain.connect(this.master),this.sfxGain.connect(this.master),this.ambientGain.connect(this.master),this.reverb=e.createConvolver(),this.reverb.buffer=this._impulse(3.4,2.7);const n=e.createGain();n.gain.value=.24,this.reverb.connect(n),n.connect(this.master),this.noise=this._noiseBuffer(2.5),this._buildAmbient(),e.state==="suspended"&&await e.resume(),this.started=!0}_impulse(t,e){const i=this.ctx.sampleRate,n=i*t,r=this.ctx.createBuffer(2,n,i);for(let a=0;a<2;a++){const o=r.getChannelData(a);for(let l=0;l<n;l++)o[l]=(Math.random()*2-1)*Math.pow(1-l/n,e)}return r}_noiseBuffer(t){const e=this.ctx.sampleRate,i=Math.floor(e*t),n=this.ctx.createBuffer(1,i,e),r=n.getChannelData(0);for(let a=0;a<i;a++)r[a]=Math.random()*2-1;return n}_noiseSource(t=!1){const e=this.ctx.createBufferSource();return e.buffer=this.noise,e.loop=t,e}_buildAmbient(){const t=this.ctx,e=this._noiseSource(!0),i=t.createBiquadFilter();i.type="bandpass",i.frequency.value=280,i.Q.value=.7;const n=t.createGain();n.gain.value=.055,e.connect(i),i.connect(n),n.connect(this.ambientGain),e.start();const r=t.createOscillator();r.frequency.value=.055;const a=t.createGain();a.gain.value=160,r.connect(a),a.connect(i.frequency),r.start(),[43.65,65.4,87.3].forEach((o,l)=>{const h=t.createOscillator();h.type=l===2?"triangle":"sine",h.frequency.value=o;const c=t.createGain();c.gain.value=[.11,.055,.018][l];const u=t.createBiquadFilter();u.type="lowpass",u.frequency.value=220,h.connect(u),u.connect(c),c.connect(this.ambientGain),h.start()})}_env(t,e,i,n,r=.5){const a=t.gain;a.cancelScheduledValues(e),a.setValueAtTime(1e-4,e),a.exponentialRampToValueAtTime(Math.max(r,2e-4),e+i),a.exponentialRampToValueAtTime(1e-4,e+i+n)}_tone({freq:t=220,type:e="sine",dur:i=.2,gain:n=.2,slide:r=0,delay:a=0,filter:o=0,reverb:l=0}){if(!this.ctx||this.ctx.state!=="running")return;const h=this.ctx,c=h.currentTime+a,u=h.createOscillator();u.type=e,u.frequency.setValueAtTime(t,c),r&&u.frequency.exponentialRampToValueAtTime(Math.max(20,t+r),c+i);const d=h.createGain();this._env(d,c,.006,i,n);let p=d;if(o){const _=h.createBiquadFilter();_.type="lowpass",_.frequency.value=o,d.connect(_),p=_}if(u.connect(d),p.connect(this.sfxGain),l){const _=h.createGain();_.gain.value=l,p.connect(_),_.connect(this.reverb)}u.start(c),u.stop(c+i+.05)}_burst({dur:t=.16,gain:e=.2,freq:i=1200,q:n=1.2,type:r="bandpass",delay:a=0,reverb:o=.1,slide:l=0}){if(!this.ctx||this.ctx.state!=="running")return;const h=this.ctx,c=h.currentTime+a,u=this._noiseSource(),d=h.createBiquadFilter();d.type=r,d.frequency.setValueAtTime(i,c),l&&d.frequency.exponentialRampToValueAtTime(Math.max(60,i+l),c+t),d.Q.value=n;const p=h.createGain();if(this._env(p,c,.004,t,e),u.connect(d),d.connect(p),p.connect(this.sfxGain),o){const _=h.createGain();_.gain.value=o,p.connect(_),_.connect(this.reverb)}u.start(c),u.stop(c+t+.05)}swing(t=!1){this._burst({dur:t?.32:.18,gain:t?.34:.22,freq:t?700:1500,slide:-520,q:.8,reverb:.08}),this._tone({freq:t?88:140,type:"sine",dur:.16,gain:t?.12:.06,slide:-40})}hit(t=!1){this._burst({dur:t?.3:.16,gain:t?.55:.34,freq:520,q:.7,reverb:.22}),this._tone({freq:t?52:76,type:"sine",dur:t?.38:.2,gain:t?.55:.3,slide:-25}),this._tone({freq:t?118:180,type:"triangle",dur:.12,gain:.1,slide:-60,delay:.01})}parry(){[880,1320,1760,2640].forEach((t,e)=>{this._tone({freq:t,type:"sine",dur:.9-e*.12,gain:.2-e*.03,delay:e*.006,reverb:.7})}),this._burst({dur:.42,gain:.4,freq:4200,q:2.5,reverb:.6}),this._tone({freq:54,type:"sine",dur:.6,gain:.35,slide:-15,reverb:.3})}damage(){this._burst({dur:.26,gain:.45,freq:280,q:.6,reverb:.3}),this._tone({freq:92,type:"sawtooth",dur:.22,gain:.14,slide:-45,filter:340})}dodge(){this._burst({dur:.3,gain:.2,freq:900,slide:-600,q:.7,reverb:.2})}step(){this._burst({dur:.07,gain:.07,freq:210,q:.8,reverb:.05})}heal(){[392,523.25,659.25,783.99].forEach((t,e)=>{this._tone({freq:t,type:"sine",dur:.7,gain:.12,delay:e*.06,reverb:.65})})}roar(t=!1){this._tone({freq:t?68:92,type:"sawtooth",dur:1.2,gain:.3,slide:-26,filter:280,reverb:.55}),this._tone({freq:t?34:46,type:"sine",dur:1.4,gain:.4,slide:-8,reverb:.4}),this._burst({dur:.9,gain:.2,freq:340,q:.5,reverb:.6})}whoosh(){this._burst({dur:.4,gain:.14,freq:620,slide:-420,q:.5,reverb:.35})}cast(){this._tone({freq:220,type:"triangle",dur:.55,gain:.12,slide:440,reverb:.6}),this._tone({freq:330,type:"sine",dur:.8,gain:.08,slide:660,delay:.08,reverb:.7})}death(){this._tone({freq:55,type:"sine",dur:3.4,gain:.4,slide:-22,reverb:.7}),this._tone({freq:82.4,type:"triangle",dur:2.8,gain:.15,slide:-30,filter:200,reverb:.6}),this._burst({dur:1.6,gain:.15,freq:240,q:.4,reverb:.8})}victory(){[130.8,164.8,196,261.6,329.6].forEach((t,e)=>{this._tone({freq:t,type:"triangle",dur:3.2,gain:.1,delay:e*.16,reverb:.75})}),this._tone({freq:65.4,type:"sine",dur:4,gain:.35,reverb:.5})}bossDeath(){this._tone({freq:110,type:"sawtooth",dur:2.4,gain:.22,slide:-80,filter:500,reverb:.6}),this._tone({freq:44,type:"sine",dur:3,gain:.5,slide:-18,reverb:.5}),this._burst({dur:1.8,gain:.28,freq:900,slide:-780,q:.4,reverb:.6})}ui(){this._tone({freq:620,type:"sine",dur:.08,gain:.08,reverb:.15})}update(t,{active:e=!1,intensity:i=0,hp:n=1}={}){if(!this.ctx||this.ctx.state!=="running"||(this.intensity+=(i-this.intensity)*Math.min(1,t*1.5),!e))return;this.musicClock+=t;const r=1.08-this.intensity*.16;if(this.musicClock>r){this.musicClock=0;const a=this.ctx.currentTime,o=this.ctx.createOscillator();o.type="sine",o.frequency.setValueAtTime(74,a),o.frequency.exponentialRampToValueAtTime(36,a+.26);const l=this.ctx.createGain();this._env(l,a,.006,.38,.34+this.intensity*.18),o.connect(l),l.connect(this.musicGain),o.start(a),o.stop(a+.45),this._lastStep=(this._lastStep+1)%4,this._lastStep===2&&this._tone({freq:49,type:"sine",dur:.7,gain:.16+this.intensity*.08,filter:160,reverb:.25})}n<.32&&(this.heartClock+=t,this.heartClock>.88&&(this.heartClock=0,this._tone({freq:46,type:"sine",dur:.17,gain:.18,slide:-8}),this._tone({freq:42,type:"sine",dur:.2,gain:.12,delay:.18,slide:-6})))}}const Lt=s=>document.getElementById(s),Hs=s=>{const t=Math.max(0,Math.floor(s));return`${String(Math.floor(t/60)).padStart(2,"0")}:${String(t%60).padStart(2,"0")}`};class n0{constructor(){this.canvas=Lt("scene"),this.renderer=new Lm({canvas:this.canvas,antialias:!0,powerPreference:"high-performance"});const t=this.renderer.getContext(),e=t.getExtension("WEBGL_debug_renderer_info");this.softwareRenderer=/swiftshader|llvmpipe|software/i.test(e?t.getParameter(e.UNMASKED_RENDERER_WEBGL):""),this.renderScale=this.softwareRenderer?.8:Math.min(window.devicePixelRatio||1,1.6),this.renderer.setPixelRatio(this.renderScale),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Ml,this.renderer.toneMapping=or,this.renderer.toneMappingExposure=1.24,this.renderer.outputColorSpace=Me,this.scene=new fc,this.scene.fog=new Ya(526863,.014),this.scene.environment=Vm(),this.scene.environmentIntensity=.52,this.camera=new ai(56,window.innerWidth/window.innerHeight,.1,240),this.camera.position.set(0,4,17),this.composer=new Om(this.renderer),this.composer.setPixelRatio(this.renderScale),this.composer.addPass(new Bm(this.scene,this.camera)),this.bloom=new On(new Tt(Math.floor(window.innerWidth*.62),Math.floor(window.innerHeight*.62)),.5,.72,.86),this.composer.addPass(this.bloom),this.composer.addPass(new km),this.clock=new Fc,this.time=0,this.cameraYaw=Math.PI,this.cameraPitch=.16,this.cameraDistance=6.35,this.shake=0,this.fovKick=0,this.state="menu",this.runTime=0,this.parryCount=0,this.deaths=0,this.act=1,this.boss=null,this.bossKind="warden",this.toastTimer=0,this.deathTimer=0,this.transitionTimer=0,this.introTimer=0,this.timeScale=1,this.hitstopTimer=0,this.slowTimer=0,this.slowScale=1,this.menuTime=0,this.hitFlashTimer=0,this.parryFlashTimer=0,this.lastDamage=0,this.combo=0,this.comboTimer=0,this.bossMaxHp=1,this._parryAnchor=new C,this._parryCenter=new C,this.ui={hud:Lt("hud"),menu:Lt("menu"),intro:Lt("bossIntro"),death:Lt("deathScreen"),victory:Lt("victoryScreen"),pause:Lt("pauseScreen"),bossPlate:Lt("bossPlate"),bossName:Lt("bossName"),bossEpithet:Lt("bossEpithet"),bossHp:Lt("bossHp"),bossHpGhost:Lt("bossHpGhost"),bossPhase:Lt("bossPhase"),bossStagger:Lt("bossStagger"),actNumber:Lt("actNumber"),actName:Lt("actName"),timer:Lt("timer"),parryCount:Lt("parryCount"),hpBar:Lt("hpBar"),hpGhost:Lt("hpGhost"),hpText:Lt("hpText"),staminaBar:Lt("staminaBar"),flasks:Lt("flasks"),playerSigil:Lt("playerSigil"),reticle:Lt("reticle"),parryPrompt:Lt("parryPrompt"),toast:Lt("toast"),combo:Lt("combo"),comboNum:Lt("comboNum"),lockBadge:Lt("lockBadge"),bossOffscreen:Lt("bossOffscreen"),damageFlash:Lt("damageFlash"),parryFlash:Lt("parryFlash"),introAct:Lt("introAct"),introName:Lt("introName"),introEpithet:Lt("introEpithet"),finalTime:Lt("finalTime"),finalParries:Lt("finalParries"),finalDeaths:Lt("finalDeaths"),finalRank:Lt("finalRank"),deathTip:Lt("deathTip"),bestRun:Lt("bestRun"),boot:Lt("boot")},this.setupLights(),this.audio=new i0,this.effects=new jm(this.scene),this.arena=new $m(this.scene),this.input=new t0(this.canvas),document.body.classList.toggle("touch",this.input.touchActive);const i=this.ui.parryPrompt.querySelector("small");i&&this.input.touchActive&&(i.textContent="TAP PARRY");const n=document.querySelector(".pause-hint");n&&this.input.touchActive&&(n.textContent="TAP PARRY · TAP ROLL · TAP FLASK · DRAG TO LOOK"),this.player=new e0(this.scene,this.effects,this.audio,this),this.spawnBoss("warden",!0),this.boss.think=999,this.boss.cooldown=999,this.player.root.visible=!0,this.bindUI(),this.bindResize(),this.updateHUD(),this.updateBestRun(),this.loadBestRun(),this.state="menu",this.input.enabled=!0,this.clock.start(),this.animate=this.animate.bind(this),requestAnimationFrame(this.animate),setTimeout(()=>this.ui.boot.classList.add("is-done"),500)}setupLights(){const t=new Pc(6978468,1511951,1.55);this.scene.add(t);const e=new $n(12702450,2.5);e.position.set(-26,34,-18),e.castShadow=!0,e.shadow.mapSize.set(1024,1024),e.shadow.camera.left=-34,e.shadow.camera.right=34,e.shadow.camera.top=38,e.shadow.camera.bottom=-22,e.shadow.camera.near=1,e.shadow.camera.far=90,e.shadow.bias=-4e-4,e.shadow.normalBias=.04,this.scene.add(e),this.moon=e;const i=new $n(8296644,1.35);i.position.set(14,16,26),this.scene.add(i);const n=new $n(10117176,.75);n.position.set(-16,8,14),this.scene.add(n);const r=new $n(9414870,.65);r.position.set(0,9,-28),this.scene.add(r);const a=new Qa(3693455,42,34,2);a.position.set(0,13,-28),this.scene.add(a),this.heroLight=new $n(11125480,1.15),this.heroLight.position.set(0,6,18),this.heroLight.target.position.set(0,1.2,4),this.scene.add(this.heroLight),this.scene.add(this.heroLight.target)}spawnBoss(t,e=!1){this.boss&&this.disposeBoss(),this.bossKind=t,this.boss=new Qm(this.scene,this.effects,this.audio,this,t),this.boss.spawnAt(new C(0,.36,-2.2)),this.bossMaxHp=this.boss.maxHp,this.act=this.boss.act,this.ui.actNumber.textContent=["","I","II","III"][this.act],this.ui.actName.textContent=["","THE FIRST GATE","THE HOLLOW VAULT","THE LAST THRONE"][this.act],this.ui.bossName.textContent=this.boss.name,this.ui.bossEpithet.textContent=this.boss.epithet,this.ui.bossPhase.textContent="PHASE I",this.ui.bossStagger.classList.remove("is-on"),this.ui.bossHp.style.transform="scaleX(1)",this.ui.bossHpGhost.style.transform="scaleX(1)",this.ui.bossPlate.classList.add("is-active"),e||this.updateBossUI(this.boss)}disposeBoss(){if(!this.boss)return;const t=this.boss;for(const e of t.projectiles)this.scene.remove(e.mesh),e.mesh.geometry.dispose(),e.mesh.material.dispose();for(const e of t.hazards)e.mesh&&(this.scene.remove(e.mesh),e.mesh.geometry.dispose(),e.mesh.material.dispose()),e.ring&&(this.scene.remove(e.ring),e.ring.geometry.dispose(),e.ring.material.dispose());this.scene.remove(t.root),t.root.traverse(e=>{e.isMesh&&(e.geometry?.dispose(),Array.isArray(e.material)?e.material.forEach(i=>i.dispose()):e.material?.dispose())}),this.boss=null}bindUI(){Lt("startBtn").addEventListener("click",()=>this.startRun()),Lt("retryBtn").addEventListener("click",()=>this.retryBoss()),Lt("againBtn").addEventListener("click",()=>this.startRun()),Lt("quitBtn").addEventListener("click",()=>this.returnToMenu()),Lt("victoryQuitBtn").addEventListener("click",()=>this.returnToMenu()),Lt("pauseQuitBtn").addEventListener("click",()=>this.returnToMenu()),Lt("resumeBtn").addEventListener("click",()=>this.resume()),window.addEventListener("keydown",t=>{t.code==="Escape"&&this.state==="playing"?this.pause():t.code==="Escape"&&this.state==="paused"?this.resume():t.code==="Enter"&&this.state==="menu"?this.startRun():(t.code==="KeyR"||t.code==="Enter")&&this.state==="dead"?this.retryBoss():t.code==="Enter"&&this.state==="victory"&&this.startRun()}),document.addEventListener("visibilitychange",()=>{document.hidden&&this.state==="playing"&&this.pause()})}bindResize(){window.addEventListener("resize",()=>{const t=window.innerWidth,e=window.innerHeight;this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,e),this.composer.setSize(t,e),this.bloom.setSize(Math.max(320,Math.floor(t*.62)),Math.max(180,Math.floor(e*.62)))})}async startRun(){if(await this.audio.init(),this.audio.ui(),this.input.enabled=!0,this.ui.menu.classList.remove("is-active"),this.ui.death.classList.remove("is-active"),this.ui.victory.classList.remove("is-active"),this.ui.pause.classList.remove("is-active"),this.ui.hud.classList.remove("is-hidden"),document.body.classList.add("playing"),this.input.flush(),this.runTime=0,this.parryCount=0,this.deaths=0,this.combo=0,this.player.reset(),this.player.pos.set(0,.36,7),this.player.yaw=Math.PI,this.player.root.visible=!0,this.player.lockOn=!1,this.cameraYaw=Math.PI,this.cameraPitch=.14,this.spawnBoss("warden"),this.boss.spawnAt(new C(0,.36,-2.2)),this.state="playing",this.ui.intro.classList.remove("is-active"),this.boss.think=1,this.boss.cooldown=1,this.updateHUD(),this.updateBossUI(this.boss),this.ui.bossPlate.classList.add("is-active"),this.updateParryCount(),this.setToast("ACT I — THE FIRST GATE",!1,1.6),this.audio.roar(!1),!this.input.touchActive&&!document.pointerLockElement)try{this.canvas.requestPointerLock?.()}catch{}}beginIntro(t=1.7){this.state="intro",this.introTimer=t,this.ui.introAct.textContent=`ACT ${["","I","II","III"][this.act]}`,this.ui.introName.textContent=this.boss.name,this.ui.introEpithet.textContent=this.boss.epithet,this.ui.intro.classList.add("is-active"),this.player.state="idle",this.player.stateTime=0}endIntro(){this.state="playing",this.ui.intro.classList.remove("is-active"),this.boss&&(this.boss.think=.8,this.boss.cooldown=.9,this.audio.roar(this.boss.kind==="king"))}nextBoss(){const t=Vr.indexOf(this.bossKind);if(t>=Vr.length-1){this.victory();return}this.audio.ui(),this.player.restoreAfterBoss(),this.player.pos.set(0,.36,7),this.player.yaw=Math.PI,this.player.velocity.set(0,0,0),this.player.root.visible=!0,this.cameraYaw=Math.PI,this.cameraPitch=.14,this.spawnBoss(Vr[t+1]),this.boss.spawnAt(new C(0,.36,-2.2)),this.boss.think=999,this.ui.bossHp.style.transform="scaleX(1)",this.ui.bossHpGhost.style.transform="scaleX(1)",this.beginIntro(1.8),this.setToast(`ACT ${["","I","II","III"][this.act]} — ${["","THE FIRST GATE","THE HOLLOW VAULT","THE LAST THRONE"][this.act]}`,!1,1.8),this.updateHUD(),this.updateBossUI(this.boss)}retryBoss(){if(this.boss&&(this.audio.init(),this.deaths++,this.ui.death.classList.remove("is-active"),this.ui.hud.classList.remove("is-hidden"),document.body.classList.add("playing"),this.player.reset(),this.player.pos.set(0,.36,7),this.player.yaw=Math.PI,this.player.root.visible=!0,this.player.lockOn=!1,this.cameraYaw=Math.PI,this.cameraPitch=.14,this.boss.spawnAt(new C(0,.36,-2.2)),this.boss.think=999,this.beginIntro(.75),this.updateHUD(),this.updateBossUI(this.boss),this.input.flush(),this.setToast("RISE AGAIN",!1,1),!this.input.touchActive))try{this.canvas.requestPointerLock?.()}catch{}}returnToMenu(){this.input.releasePointer(),this.input.flush(),this.ui.death.classList.remove("is-active"),this.ui.victory.classList.remove("is-active"),this.ui.pause.classList.remove("is-active"),this.ui.intro.classList.remove("is-active"),this.ui.hud.classList.add("is-hidden"),this.ui.menu.classList.add("is-active"),this.ui.bossPlate.classList.remove("is-active"),document.body.classList.remove("playing"),this.state="menu",this.spawnBoss("warden"),this.boss.think=999,this.boss.cooldown=999,this.player.reset(),this.player.pos.set(0,.36,7),this.player.yaw=Math.PI,this.player.root.visible=!0,this.cameraYaw=Math.PI,this.cameraPitch=.14,this.menuTime=0,this.updateBestRun()}pause(){this.state==="playing"&&(this.state="paused",this.ui.pause.classList.add("is-active"),this.input.releasePointer(),this.input.flush(),this.audio.ui())}resume(){if(this.state==="paused"&&(this.state="playing",this.ui.pause.classList.remove("is-active"),this.input.flush(),!this.input.touchActive))try{this.canvas.requestPointerLock?.()}catch{}}playerDied(){this.state!=="dead"&&(this.state="dying",this.deathTimer=1.35,this.input.releasePointer(),this.ui.hud.classList.remove("is-hidden"),this.audio.death())}showDeath(){this.state="dead",this.ui.deathTip.textContent=this.parryCount===0?"The white glint is the promise. Answer it sooner.":"Patience is a weapon. Raise your guard, then strike.",this.ui.death.classList.add("is-active"),document.body.classList.remove("playing"),this.updateBestRun()}victory(){this.state="victory",this.ui.hud.classList.add("is-hidden"),this.ui.victory.classList.add("is-active"),document.body.classList.remove("playing"),this.input.releasePointer(),this.audio.victory(),this.ui.finalTime.textContent=Hs(this.runTime),this.ui.finalParries.textContent=String(this.parryCount),this.ui.finalDeaths.textContent=String(this.deaths),this.ui.finalRank.textContent=this.rank(),this.saveBestRun(),this.updateBestRun()}rank(){const t=this.parryCount,e=this.deaths;return e===0&&t>=10?"S":e<=1&&t>=6?"A":e<=3?"B":"C"}hitBoss(t,e,i,n){return!this.boss||!this.boss.alive?!1:(this.boss.takeDamage(t,e,i,n),this.updateBossUI(this.boss),!0)}bossParried(t,e){this.parryCount++,this.updateParryCount(),e.stamina=Math.min(e.maxStamina,e.stamina+18),e.parryGlow=1,e.invuln=Math.max(e.invuln,.7),this.parryFlashTimer=.18,this.ui.parryFlash.classList.add("hit"),this.hitStop(.08),this.slowMotion(.3,.35),this.cameraShake(.5),this.audio.parry(),this.effects.flash(new C(t.pos.x,2.4,t.pos.z),{color:16773312,size:5.2,life:.55}),this.effects.burst(new C(t.pos.x,2.3,t.pos.z),{color:16769440,count:60,speed:8,size:.13,gravity:2,life:1}),this.effects.ring(t.pos,{color:16769440,radius:7,life:.8}),this.setToast("PARRY",!1,.8),t.stagger(),this.updateBossUI(t)}bossStaggered(t){this.ui.bossStagger.classList.add("is-on"),this.setToast("GUARD BROKEN — STRIKE TO RIPOSTE",!1,1.7)}bossRecovered(t){this.ui.bossStagger.classList.remove("is-on")}bossPhaseTwo(t){this.ui.bossPhase.textContent="PHASE II",this.ui.bossPhase.style.color="#ffb18a",this.setToast("THE CROWN REMEMBERS",!0,2),this.audio.roar(!0)}bossDefeated(t){this.ui.bossStagger.classList.remove("is-on"),this.state="vanquish",this.transitionTimer=3.2,this.setToast("VANQUISHED",!1,2.6),this.saveBestRun(),this.updateBestRun()}setToast(t,e=!1,i=1.2){this.ui.toast.textContent=t,this.ui.toast.classList.toggle("is-danger",e),this.ui.toast.classList.add("is-on"),this.toastTimer=i}updateCombo(t){this.combo=t,this.comboTimer=2.4,this.ui.comboNum.textContent=String(t),this.ui.combo.classList.toggle("is-on",t>=2)}updateParryCount(){this.ui.parryCount.textContent=String(this.parryCount)}updateBossUI(t){if(!t)return;const e=t.hpRatio;this.ui.bossHp.style.transform=`scaleX(${e})`,this.ui.bossHpGhost.style.transform=`scaleX(${e})`,t.phase===2&&(this.ui.bossPhase.textContent="PHASE II"),this.ui.bossStagger.classList.toggle("is-on",t.isStaggered)}updateHUD(){const t=this.player;this.ui.hpBar.style.transform=`scaleX(${t.hpRatio})`,this.ui.hpGhost.style.transform=`scaleX(${t.hpRatio})`,this.ui.hpText.textContent=String(Math.ceil(t.hp)),this.ui.staminaBar.style.transform=`scaleX(${t.staminaRatio})`,this.ui.staminaBar.classList.toggle("is-low",t.staminaRatio<.25),this.ui.playerSigil.classList.toggle("low",t.hpRatio<.32),this.ui.flasks.querySelectorAll(".flask").forEach((i,n)=>i.classList.toggle("full",n<t.flasks)),this.ui.timer.textContent=Hs(this.runTime)}playerAttackStarted(t){this.fovKick=t?3.4:1.5}playerParryStarted(){this.fovKick=.8}playerRiposteStarted(t){this.fovKick=4.5,this.cameraShake(.25)}bossTelegraph(t,e){this.fovKick=Math.max(this.fovKick,e.kind==="slam"?2.2:1.1)}damageFlash(){this.hitFlashTimer=.22,this.ui.damageFlash.classList.add("hit"),this.lastDamage=this.player.lastDamage}cameraShake(t){this.shake=Math.max(this.shake,t)}hitStop(t){this.hitstopTimer=Math.max(this.hitstopTimer,t)}slowMotion(t,e){this.slowScale=t,this.slowTimer=Math.max(this.slowTimer,e)}loadBestRun(){try{this.best=JSON.parse(localStorage.getItem("ashen-vow-best")||"null")}catch{this.best=null}}saveBestRun(){if(this.state!=="menu"&&(!this.best||this.runTime<this.best.time)){this.best={time:this.runTime,parries:this.parryCount,rank:this.rank()};try{localStorage.setItem("ashen-vow-best",JSON.stringify(this.best))}catch{}}}updateBestRun(){this.loadBestRun(),this.ui.bestRun.textContent=this.best?`BEST VOW — ${Hs(this.best.time)} · ${this.best.rank} RANK`:"BEST VOW — UNWRITTEN"}processInput(t){if(this.state==="menu"){this.input.consume("confirm")&&this.startRun(),this.input.flush();return}if(this.state==="paused"){(this.input.consume("pause")||this.input.consume("confirm"))&&this.resume(),this.input.flush();return}if(this.state==="dead"){(this.input.consume("confirm")||this.input.consume("flask"))&&this.retryBoss(),this.input.flush();return}if(this.state==="victory"){this.input.consume("confirm")&&this.startRun(),this.input.flush();return}if(this.state==="playing"){if(this.input.consume("pause")){this.pause();return}for(const e of["attack","heavy","parry","dodge","flask","lock"])this.input.consume(e)&&this.player.handleAction(e,this.boss)}}updateCamera(t){if(this.state==="menu"){this.menuTime+=t;const c=.45+this.menuTime*.055,u=15.5,d=new C(0,2.2,0),p=new C(Math.cos(c)*u,4.6+Math.sin(this.menuTime*.25)*.3,Math.sin(c)*u);this.camera.position.lerp(p,1-Math.exp(-t*1.5)),this.camera.lookAt(d),this.camera.fov=an(this.camera.fov,54,3,t),this.camera.updateProjectionMatrix();return}const e=this.lastInput||{lookX:0,lookY:0};if((this.state==="playing"||this.state==="intro")&&(this.cameraYaw+=e.lookX,this.cameraPitch=$t(this.cameraPitch+e.lookY,-.12,.72)),this.player.lockOn&&this.boss&&this.boss.alive){let u=Math.atan2(this.boss.pos.x-this.player.pos.x,this.boss.pos.z-this.player.pos.z)-this.cameraYaw;for(;u>Math.PI;)u-=Math.PI*2;for(;u<-Math.PI;)u+=Math.PI*2;this.cameraYaw+=u*Math.min(1,t*3.5),this.cameraPitch=an(this.cameraPitch,.18,2.5,t)}const i=new C(this.player.pos.x,this.player.pos.y+1.36,this.player.pos.z),n=new C(Math.sin(this.cameraYaw),0,Math.cos(this.cameraYaw)),r=new C(Math.cos(this.cameraYaw),0,-Math.sin(this.cameraYaw));i.addScaledVector(r,.48);const a=Math.cos(this.cameraPitch)*this.cameraDistance,o=1.55+Math.sin(this.cameraPitch)*this.cameraDistance,l=i.clone().addScaledVector(n,-a);if(l.y=this.player.pos.y+o,this.state==="intro"){const u=(this.boss?this.boss.pos.clone().setY(2.2):i).clone().add(new C(Math.sin(this.cameraYaw+.18)*10,5.2,Math.cos(this.cameraYaw+.18)*10));l.lerp(u,.55)}this.camera.position.lerp(l,1-Math.exp(-t*9));const h=i.clone();if(this.state==="intro"&&this.boss&&h.lerp(this.boss.pos.clone().setY(2.2),.45),this.camera.lookAt(h),this.heroLight&&(this.heroLight.position.set(this.camera.position.x,this.camera.position.y+3.5,this.camera.position.z),this.heroLight.target.position.set(this.player.pos.x,this.player.pos.y+1.25,this.player.pos.z)),this.camera.fov=an(this.camera.fov,56+this.fovKick,5,t),this.camera.updateProjectionMatrix(),this.shake>.001){const c=this.shake*.13;this.camera.position.x+=(Math.random()-.5)*c,this.camera.position.y+=(Math.random()-.5)*c,this.camera.position.z+=(Math.random()-.5)*c,this.camera.rotation.z+=(Math.random()-.5)*c*.12}}updateUI(t){this.toastTimer>0&&(this.toastTimer-=t,this.toastTimer<=0&&this.ui.toast.classList.remove("is-on")),this.hitFlashTimer>0&&(this.hitFlashTimer-=t,this.hitFlashTimer<=0&&this.ui.damageFlash.classList.remove("hit")),this.parryFlashTimer>0&&(this.parryFlashTimer-=t,this.parryFlashTimer<=0&&this.ui.parryFlash.classList.remove("hit")),this.comboTimer>0&&(this.comboTimer-=t,this.comboTimer<=0&&this.updateCombo(0)),this.state!=="menu"&&(this.updateHUD(),this.ui.timer.textContent=Hs(this.runTime));const e=this.player,i=this.boss,n=this.state==="playing"&&i&&i.alive&&i.parryCue&&i.state==="windup";this.updateParryPrompt(n),this.ui.lockBadge.classList.toggle("is-on",e.lockOn&&this.state==="playing"),this.ui.reticle.classList.toggle("is-target",e.lockOn||i&&i.alive&&this.state==="playing"),i&&i.alive&&(this.ui.bossStagger.classList.toggle("is-on",i.isStaggered),this.ui.bossHpGhost.style.transform=`scaleX(${i.hpRatio})`),this.shake>.001&&(this.shake=Math.max(0,this.shake-t*3.5)),this.fovKick=an(this.fovKick,0,6,t),this.ui.bossOffscreen.classList.remove("is-on")}updateParryPrompt(t){const e=this.ui.parryPrompt;if(e.classList.toggle("is-active",t),!t)return;const i=this.boss,n=this._parryAnchor;let r=window.innerWidth*.5,a=window.innerHeight*.59;if(i&&i.weaponTipGlow){const c=this._parryCenter;if(i.weaponTipGlow.getWorldPosition(n),c.set(i.pos.x,i.pos.y+2.1,i.pos.z),n.project(this.camera),c.project(this.camera),n.z<1&&Math.abs(n.x)<1.15&&Math.abs(n.y)<1.15){const u=(n.x*.5+.5)*window.innerWidth,d=(c.x*.5+.5)*window.innerWidth,p=u>=d?1:-1;r=u+p*92,a=(-n.y*.5+.5)*window.innerHeight+6}}const o=Math.min(88,window.innerWidth*.16),l=92,h=this.input.touchActive?176:112;r=$t(r,o,window.innerWidth-o),a=$t(a,l,window.innerHeight-h),e.style.left=`${r}px`,e.style.top=`${a}px`}animate(){requestAnimationFrame(this.animate);const t=Math.min(this.clock.getDelta(),.05);this.time+=t,this.hitstopTimer>0?(this.hitstopTimer-=t,this.timeScale=.045):this.slowTimer>0?(this.slowTimer-=t,this.timeScale=this.slowScale):this.timeScale=an(this.timeScale,1,12,t);const e=t*this.timeScale;this.lastInput=this.input.update(),this.processInput(t),this.state==="playing"?(this.runTime+=t,this.player.update(e,this.boss),this.boss&&this.boss.update(e,this.player),this.boss&&this.boss.alive&&this.audio.update(t,{active:!0,intensity:.45+(1-this.boss.hpRatio)*.55,hp:this.player.hpRatio})):this.state==="intro"?(this.introTimer-=t,this.player.update(e,null),this.boss&&this.boss.update(e,this.player),this.introTimer<=0&&this.endIntro()):this.state==="vanquish"?(this.transitionTimer-=t,this.player.update(e,null),this.boss&&this.boss.update(e,this.player),this.transitionTimer<=0&&this.nextBoss()):this.state==="dying"?(this.deathTimer-=t,this.player.update(e,this.boss),this.boss&&this.boss.update(e,this.player),this.deathTimer<=0&&this.showDeath()):this.state==="paused"||this.state==="dead"||this.state==="victory"?(this.player.update(e,this.boss),this.boss&&this.state!=="paused"&&this.boss.update(e,this.player)):this.state==="menu"&&(this.player.update(e,null),this.boss&&this.boss.update(e,this.player)),this.effects.update(e),this.arena.update(t,this.time),this.updateCamera(t),this.updateUI(t),this.composer.render()}}window.addEventListener("DOMContentLoaded",()=>{const s=new n0;window.__ASHEN_VOW__=s});
