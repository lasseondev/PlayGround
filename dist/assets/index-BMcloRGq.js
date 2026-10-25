(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=e(n);fetch(n.href,r)}})();/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const eo="186",Xc=0,Xo=1,qc=2,as=1,Yc=2,ss=3,rn=0,Xe=1,_e=2,vi=0,nn=1,oe=2,qo=3,Yo=4,Zc=5,In=100,Kc=101,$c=102,Jc=103,Qc=104,jc=200,th=201,eh=202,ih=203,rc=204,ac=205,nh=206,sh=207,rh=208,ah=209,oh=210,lh=211,ch=212,hh=213,uh=214,ua=0,da=1,fa=2,os=3,pa=4,ma=5,ga=6,_a=7,oc=0,dh=1,fh=2,Mi=0,io=1,no=2,so=3,dr=4,ro=5,ao=6,oo=7,lc=300,an=301,On=302,Js=303,br=304,fr=306,ls=1e3,Ci=1001,xa=1002,Ue=1003,ph=1004,_s=1005,ke=1006,wr=1007,tn=1008,je=1009,cc=1010,hc=1011,cs=1012,lo=1013,yi=1014,ci=1015,Ke=1016,co=1017,ho=1018,hs=1020,uc=35902,dc=35899,fc=1021,pc=1022,hi=1023,Li=1026,en=1027,uo=1028,fo=1029,on=1030,po=1031,mo=1033,Qs=33776,js=33777,tr=33778,er=33779,va=35840,Ma=35841,Sa=35842,ya=35843,ba=36196,wa=37492,Ea=37496,Ta=37488,Aa=37489,sr=37490,Ra=37491,Ca=37808,Pa=37809,La=37810,Da=37811,Ia=37812,Ua=37813,Na=37814,Fa=37815,Oa=37816,za=37817,Ba=37818,ka=37819,Ga=37820,Ha=37821,Va=36492,Wa=36494,Xa=36495,qa=36283,Ya=36284,rr=36285,Za=36286,mh=3200,Ka=0,gh=1,Vi="",we="srgb",ar="srgb-linear",or="linear",te="srgb",Er=7680,_h=519,xh=512,vh=513,Mh=514,go=515,Sh=516,yh=517,_o=518,bh=519,mc=35044,Zo="300 es",xi=2e3,us=2001;function wh(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function lr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Eh(){const s=lr("canvas");return s.style.display="block",s}const Ko={};function cr(...s){const t="THREE."+s.shift();console.log(t,...s)}function gc(s){const t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function It(...s){s=gc(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function Yt(...s){s=gc(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function Nn(...s){const t=s.join(" ");t in Ko||(Ko[t]=!0,It(...s))}function Th(s,t,e){return new Promise(function(i,n){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:n();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}const Ah={[ua]:da,[fa]:ga,[pa]:_a,[os]:ma,[da]:ua,[ga]:fa,[_a]:pa,[ma]:os};class ln{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const n=i[t];if(n!==void 0){const r=n.indexOf(e);r!==-1&&n.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const n=i.slice(0);for(let r=0,a=n.length;r<a;r++)n[r].call(this,t);t.target=null}}}const ze=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Tr=Math.PI/180,$a=180/Math.PI;function Wi(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(ze[s&255]+ze[s>>8&255]+ze[s>>16&255]+ze[s>>24&255]+"-"+ze[t&255]+ze[t>>8&255]+"-"+ze[t>>16&15|64]+ze[t>>24&255]+"-"+ze[e&63|128]+ze[e>>8&255]+"-"+ze[e>>16&255]+ze[e>>24&255]+ze[i&255]+ze[i>>8&255]+ze[i>>16&255]+ze[i>>24&255]).toLowerCase()}function Xt(s,t,e){return Math.max(t,Math.min(e,s))}function Rh(s,t){return(s%t+t)%t}function Ar(s,t,e){return(1-e)*s+e*t}function _i(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function se(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Po=class Po{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,n=t.elements;return this.x=n[0]*e+n[3]*i+n[6],this.y=n[1]*e+n[4]*i+n[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Xt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Xt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),n=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*n+t.x,this.y=r*n+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Po.prototype.isVector2=!0;let wt=Po;class cn{constructor(t=0,e=0,i=0,n=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=n}static slerpFlat(t,e,i,n,r,a,o){let l=i[n+0],c=i[n+1],h=i[n+2],p=i[n+3],u=r[a+0],d=r[a+1],g=r[a+2],S=r[a+3];if(p!==S||l!==u||c!==d||h!==g){let m=l*u+c*d+h*g+p*S;m<0&&(u=-u,d=-d,g=-g,S=-S,m=-m);let f=1-o;if(m<.9995){const y=Math.acos(m),A=Math.sin(y);f=Math.sin(f*y)/A,o=Math.sin(o*y)/A,l=l*f+u*o,c=c*f+d*o,h=h*f+g*o,p=p*f+S*o}else{l=l*f+u*o,c=c*f+d*o,h=h*f+g*o,p=p*f+S*o;const y=1/Math.sqrt(l*l+c*c+h*h+p*p);l*=y,c*=y,h*=y,p*=y}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=p}static multiplyQuaternionsFlat(t,e,i,n,r,a){const o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],p=r[a],u=r[a+1],d=r[a+2],g=r[a+3];return t[e]=o*g+h*p+l*d-c*u,t[e+1]=l*g+h*u+c*p-o*d,t[e+2]=c*g+h*d+o*u-l*p,t[e+3]=h*g-o*p-l*u-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,n){return this._x=t,this._y=e,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,n=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),p=o(r/2),u=l(i/2),d=l(n/2),g=l(r/2);switch(a){case"XYZ":this._x=u*h*p+c*d*g,this._y=c*d*p-u*h*g,this._z=c*h*g+u*d*p,this._w=c*h*p-u*d*g;break;case"YXZ":this._x=u*h*p+c*d*g,this._y=c*d*p-u*h*g,this._z=c*h*g-u*d*p,this._w=c*h*p+u*d*g;break;case"ZXY":this._x=u*h*p-c*d*g,this._y=c*d*p+u*h*g,this._z=c*h*g+u*d*p,this._w=c*h*p-u*d*g;break;case"ZYX":this._x=u*h*p-c*d*g,this._y=c*d*p+u*h*g,this._z=c*h*g-u*d*p,this._w=c*h*p+u*d*g;break;case"YZX":this._x=u*h*p+c*d*g,this._y=c*d*p+u*h*g,this._z=c*h*g-u*d*p,this._w=c*h*p-u*d*g;break;case"XZY":this._x=u*h*p-c*d*g,this._y=c*d*p-u*h*g,this._z=c*h*g+u*d*p,this._w=c*h*p+u*d*g;break;default:It("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,n=Math.sin(i);return this._x=t.x*n,this._y=t.y*n,this._z=t.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],n=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],p=e[10],u=i+o+p;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-n)*d}else if(i>o&&i>p){const d=2*Math.sqrt(1+i-o-p);this._w=(h-l)/d,this._x=.25*d,this._y=(n+a)/d,this._z=(r+c)/d}else if(o>p){const d=2*Math.sqrt(1+o-i-p);this._w=(r-c)/d,this._x=(n+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+p-i-o);this._w=(a-n)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Xt(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const n=Math.min(1,e/i);return this.slerp(t,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,n=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+a*o+n*c-r*l,this._y=n*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-n*o,this._w=a*h-i*o-n*l-r*c,this._onChangeCallback(),this}slerp(t,e){let i=t._x,n=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(i=-i,n=-n,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+i*e,this._y=this._y*l+n*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+i*e,this._y=this._y*l+n*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(n*Math.sin(t),n*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Lo=class Lo{constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion($o.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion($o.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,n=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*n,this.y=r[1]*e+r[4]*i+r[7]*n,this.z=r[2]*e+r[5]*i+r[8]*n,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*n+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*n+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*n+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*n+r[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,n=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*n-o*i),h=2*(o*e-r*n),p=2*(r*i-a*e);return this.x=e+l*c+a*p-o*h,this.y=i+l*h+o*c-r*p,this.z=n+l*p+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,n=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*n,this.y=r[1]*e+r[5]*i+r[9]*n,this.z=r[2]*e+r[6]*i+r[10]*n,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Xt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,n=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=n*l-r*o,this.y=r*a-i*l,this.z=i*o-n*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Rr.copy(this).projectOnVector(t),this.sub(Rr)}reflect(t){return this.sub(Rr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Xt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,n=this.z-t.z;return e*e+i*i+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const n=Math.sin(e)*t;return this.x=n*Math.sin(i),this.y=Math.cos(e)*t,this.z=n*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),n=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=n,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Lo.prototype.isVector3=!0;let R=Lo;const Rr=new R,$o=new cn,Do=class Do{constructor(t,e,i,n,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,n,r,a,o,l,c)}set(t,e,i,n,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=n,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],p=i[7],u=i[2],d=i[5],g=i[8],S=n[0],m=n[3],f=n[6],y=n[1],A=n[4],M=n[7],b=n[2],E=n[5],C=n[8];return r[0]=a*S+o*y+l*b,r[3]=a*m+o*A+l*E,r[6]=a*f+o*M+l*C,r[1]=c*S+h*y+p*b,r[4]=c*m+h*A+p*E,r[7]=c*f+h*M+p*C,r[2]=u*S+d*y+g*b,r[5]=u*m+d*A+g*E,r[8]=u*f+d*M+g*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],n=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-i*r*h+i*o*l+n*r*c-n*a*l}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],p=h*a-o*c,u=o*l-h*r,d=c*r-a*l,g=e*p+i*u+n*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/g;return t[0]=p*S,t[1]=(n*c-h*i)*S,t[2]=(o*i-n*a)*S,t[3]=u*S,t[4]=(h*e-n*l)*S,t[5]=(n*r-o*e)*S,t[6]=d*S,t[7]=(i*l-c*e)*S,t[8]=(a*e-i*r)*S,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,n,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-n*c,n*l,-n*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return Nn("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Cr.makeScale(t,e)),this}rotate(t){return Nn("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Cr.makeRotation(-t)),this}translate(t,e){return Nn("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Cr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<9;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Do.prototype.isMatrix3=!0;let Nt=Do;const Cr=new Nt,Jo=new Nt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Qo=new Nt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ch(){const s={enabled:!0,workingColorSpace:ar,spaces:{},convert:function(n,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===te&&(n.r=Pi(n.r),n.g=Pi(n.g),n.b=Pi(n.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(n.applyMatrix3(this.spaces[r].toXYZ),n.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===te&&(n.r=Fn(n.r),n.g=Fn(n.g),n.b=Fn(n.b))),n},workingToColorSpace:function(n,r){return this.convert(n,this.workingColorSpace,r)},colorSpaceToWorking:function(n,r){return this.convert(n,r,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Vi?or:this.spaces[n].transfer},getToneMappingMode:function(n){return this.spaces[n].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(n,r=this.workingColorSpace){return n.fromArray(this.spaces[r].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,r,a){return n.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(n,r){return Nn("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(n,r)},toWorkingColorSpace:function(n,r){return Nn("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(n,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return s.define({[ar]:{primaries:t,whitePoint:i,transfer:or,toXYZ:Jo,fromXYZ:Qo,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:we},outputColorSpaceConfig:{drawingBufferColorSpace:we}},[we]:{primaries:t,whitePoint:i,transfer:te,toXYZ:Jo,fromXYZ:Qo,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:we}}}),s}const Wt=Ch();function Pi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Fn(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let pn;class Ph{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{pn===void 0&&(pn=lr("canvas")),pn.width=t.width,pn.height=t.height;const n=pn.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),i=pn}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=lr("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const n=i.getImageData(0,0,t.width,t.height),r=n.data;for(let a=0;a<r.length;a++)r[a]=Pi(r[a]/255)*255;return i.putImageData(n,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Pi(e[i]/255)*255):e[i]=Pi(e[i]);return{data:e,width:t.width,height:t.height}}else return It("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Lh=0;class xo{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Lh++}),this.uuid=Wi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let r;if(Array.isArray(n)){r=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?r.push(Pr(n[a].image)):r.push(Pr(n[a]))}else r=Pr(n);i.url=r}return e||(t.images[this.uuid]=i),i}}function Pr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Ph.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(It("Texture: Unable to serialize Texture."),{})}let Dh=0;const Lr=new R;class Ge extends ln{constructor(t=Ge.DEFAULT_IMAGE,e=Ge.DEFAULT_MAPPING,i=Ci,n=Ci,r=ke,a=tn,o=hi,l=je,c=Ge.DEFAULT_ANISOTROPY,h=Vi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Dh++}),this.uuid=Wi(),this.name="",this.source=new xo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new wt(0,0),this.repeat=new wt(1,1),this.center=new wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Nt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Lr).x}get height(){return this.source.getSize(Lr).y}get depth(){return this.source.getSize(Lr).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){It(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const n=this[e];if(n===void 0){It(`Texture.setValues(): property '${e}' does not exist.`);continue}n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==lc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ls:t.x=t.x-Math.floor(t.x);break;case Ci:t.x=t.x<0?0:1;break;case xa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ls:t.y=t.y-Math.floor(t.y);break;case Ci:t.y=t.y<0?0:1;break;case xa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ge.DEFAULT_IMAGE=null;Ge.DEFAULT_MAPPING=lc;Ge.DEFAULT_ANISOTROPY=1;const Io=class Io{constructor(t=0,e=0,i=0,n=1){this.x=t,this.y=e,this.z=i,this.w=n}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,n){return this.x=t,this.y=e,this.z=i,this.w=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*n+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*n+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*n+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*n+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,n,r;const l=t.elements,c=l[0],h=l[4],p=l[8],u=l[1],d=l[5],g=l[9],S=l[2],m=l[6],f=l[10];if(Math.abs(h-u)<.01&&Math.abs(p-S)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(p+S)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const A=(c+1)/2,M=(d+1)/2,b=(f+1)/2,E=(h+u)/4,C=(p+S)/4,x=(g+m)/4;return A>M&&A>b?A<.01?(i=0,n=.707106781,r=.707106781):(i=Math.sqrt(A),n=E/i,r=C/i):M>b?M<.01?(i=.707106781,n=0,r=.707106781):(n=Math.sqrt(M),i=E/n,r=x/n):b<.01?(i=.707106781,n=.707106781,r=0):(r=Math.sqrt(b),i=C/r,n=x/r),this.set(i,n,r,e),this}let y=Math.sqrt((m-g)*(m-g)+(p-S)*(p-S)+(u-h)*(u-h));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(p-S)/y,this.z=(u-h)/y,this.w=Math.acos((c+d+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this.w=Xt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this.w=Xt(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Xt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Io.prototype.isVector4=!0;let me=Io;class Ih extends ln{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ke,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new me(0,0,t,e),this.scissorTest=!1,this.viewport=new me(0,0,t,e),this.textures=[];const n={width:t,height:e,depth:i.depth},r=new Ge(n),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:ke,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let n=0,r=this.textures.length;n<r;n++)this.textures[n].image.width=t,this.textures[n].image.height=e,this.textures[n].image.depth=i,this.textures[n].isData3DTexture!==!0&&(this.textures[n].isArrayTexture=this.textures[n].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const n=Object.assign({},t.textures[e].image);this.textures[e].source=new xo(n)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){const e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class qe extends Ih{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class _c extends Ge{constructor(t=null,e=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=Ue,this.minFilter=Ue,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Uh extends Ge{constructor(t=null,e=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=Ue,this.minFilter=Ue,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}}const ur=class ur{constructor(t,e,i,n,r,a,o,l,c,h,p,u,d,g,S,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,n,r,a,o,l,c,h,p,u,d,g,S,m)}set(t,e,i,n,r,a,o,l,c,h,p,u,d,g,S,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=i,f[12]=n,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=p,f[14]=u,f[3]=d,f[7]=g,f[11]=S,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ur().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,i=t.elements,n=1/mn.setFromMatrixColumn(t,0).length(),r=1/mn.setFromMatrixColumn(t,1).length(),a=1/mn.setFromMatrixColumn(t,2).length();return e[0]=i[0]*n,e[1]=i[1]*n,e[2]=i[2]*n,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,n=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(r),p=Math.sin(r);if(t.order==="XYZ"){const u=a*h,d=a*p,g=o*h,S=o*p;e[0]=l*h,e[4]=-l*p,e[8]=c,e[1]=d+g*c,e[5]=u-S*c,e[9]=-o*l,e[2]=S-u*c,e[6]=g+d*c,e[10]=a*l}else if(t.order==="YXZ"){const u=l*h,d=l*p,g=c*h,S=c*p;e[0]=u+S*o,e[4]=g*o-d,e[8]=a*c,e[1]=a*p,e[5]=a*h,e[9]=-o,e[2]=d*o-g,e[6]=S+u*o,e[10]=a*l}else if(t.order==="ZXY"){const u=l*h,d=l*p,g=c*h,S=c*p;e[0]=u-S*o,e[4]=-a*p,e[8]=g+d*o,e[1]=d+g*o,e[5]=a*h,e[9]=S-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const u=a*h,d=a*p,g=o*h,S=o*p;e[0]=l*h,e[4]=g*c-d,e[8]=u*c+S,e[1]=l*p,e[5]=S*c+u,e[9]=d*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const u=a*l,d=a*c,g=o*l,S=o*c;e[0]=l*h,e[4]=S-u*p,e[8]=g*p+d,e[1]=p,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=d*p+g,e[10]=u-S*p}else if(t.order==="XZY"){const u=a*l,d=a*c,g=o*l,S=o*c;e[0]=l*h,e[4]=-p,e[8]=c*h,e[1]=u*p+S,e[5]=a*h,e[9]=d*p-g,e[2]=g*p-d,e[6]=o*h,e[10]=S*p+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Nh,t,Fh)}lookAt(t,e,i){const n=this.elements;return $e.subVectors(t,e),$e.lengthSq()===0&&($e.z=1),$e.normalize(),Ni.crossVectors(i,$e),Ni.lengthSq()===0&&(Math.abs(i.z)===1?$e.x+=1e-4:$e.z+=1e-4,$e.normalize(),Ni.crossVectors(i,$e)),Ni.normalize(),xs.crossVectors($e,Ni),n[0]=Ni.x,n[4]=xs.x,n[8]=$e.x,n[1]=Ni.y,n[5]=xs.y,n[9]=$e.y,n[2]=Ni.z,n[6]=xs.z,n[10]=$e.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],p=i[5],u=i[9],d=i[13],g=i[2],S=i[6],m=i[10],f=i[14],y=i[3],A=i[7],M=i[11],b=i[15],E=n[0],C=n[4],x=n[8],w=n[12],P=n[1],I=n[5],F=n[9],G=n[13],N=n[2],k=n[6],K=n[10],W=n[14],nt=n[3],q=n[7],j=n[11],it=n[15];return r[0]=a*E+o*P+l*N+c*nt,r[4]=a*C+o*I+l*k+c*q,r[8]=a*x+o*F+l*K+c*j,r[12]=a*w+o*G+l*W+c*it,r[1]=h*E+p*P+u*N+d*nt,r[5]=h*C+p*I+u*k+d*q,r[9]=h*x+p*F+u*K+d*j,r[13]=h*w+p*G+u*W+d*it,r[2]=g*E+S*P+m*N+f*nt,r[6]=g*C+S*I+m*k+f*q,r[10]=g*x+S*F+m*K+f*j,r[14]=g*w+S*G+m*W+f*it,r[3]=y*E+A*P+M*N+b*nt,r[7]=y*C+A*I+M*k+b*q,r[11]=y*x+A*F+M*K+b*j,r[15]=y*w+A*G+M*W+b*it,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],n=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],p=t[6],u=t[10],d=t[14],g=t[3],S=t[7],m=t[11],f=t[15],y=l*d-c*u,A=o*d-c*p,M=o*u-l*p,b=a*d-c*h,E=a*u-l*h,C=a*p-o*h;return e*(S*y-m*A+f*M)-i*(g*y-m*b+f*E)+n*(g*A-S*b+f*C)-r*(g*M-S*E+m*C)}determinantAffine(){const t=this.elements,e=t[0],i=t[4],n=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(a*h-o*c)-i*(r*h-o*l)+n*(r*c-a*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const n=this.elements;return t.isVector3?(n[12]=t.x,n[13]=t.y,n[14]=t.z):(n[12]=t,n[13]=e,n[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],p=t[9],u=t[10],d=t[11],g=t[12],S=t[13],m=t[14],f=t[15],y=e*o-i*a,A=e*l-n*a,M=e*c-r*a,b=i*l-n*o,E=i*c-r*o,C=n*c-r*l,x=h*S-p*g,w=h*m-u*g,P=h*f-d*g,I=p*m-u*S,F=p*f-d*S,G=u*f-d*m,N=y*G-A*F+M*I+b*P-E*w+C*x;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/N;return t[0]=(o*G-l*F+c*I)*k,t[1]=(n*F-i*G-r*I)*k,t[2]=(S*C-m*E+f*b)*k,t[3]=(u*E-p*C-d*b)*k,t[4]=(l*P-a*G-c*w)*k,t[5]=(e*G-n*P+r*w)*k,t[6]=(m*M-g*C-f*A)*k,t[7]=(h*C-u*M+d*A)*k,t[8]=(a*F-o*P+c*x)*k,t[9]=(i*P-e*F-r*x)*k,t[10]=(g*E-S*M+f*y)*k,t[11]=(p*M-h*E-d*y)*k,t[12]=(o*w-a*I-l*x)*k,t[13]=(e*I-i*w+n*x)*k,t[14]=(S*A-g*b-m*y)*k,t[15]=(h*b-p*A+u*y)*k,this}scale(t){const e=this.elements,i=t.x,n=t.y,r=t.z;return e[0]*=i,e[4]*=n,e[8]*=r,e[1]*=i,e[5]*=n,e[9]*=r,e[2]*=i,e[6]*=n,e[10]*=r,e[3]*=i,e[7]*=n,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],n=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,n))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),n=Math.sin(e),r=1-i,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*a,0,c*l-n*o,h*l+n*a,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,n,r,a){return this.set(1,i,r,0,t,1,a,0,e,n,1,0,0,0,0,1),this}compose(t,e,i){const n=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,p=o+o,u=r*c,d=r*h,g=r*p,S=a*h,m=a*p,f=o*p,y=l*c,A=l*h,M=l*p,b=i.x,E=i.y,C=i.z;return n[0]=(1-(S+f))*b,n[1]=(d+M)*b,n[2]=(g-A)*b,n[3]=0,n[4]=(d-M)*E,n[5]=(1-(u+f))*E,n[6]=(m+y)*E,n[7]=0,n[8]=(g+A)*C,n[9]=(m-y)*C,n[10]=(1-(u+S))*C,n[11]=0,n[12]=t.x,n[13]=t.y,n[14]=t.z,n[15]=1,this}decompose(t,e,i){const n=this.elements;t.x=n[12],t.y=n[13],t.z=n[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),e.identity(),this;let a=mn.set(n[0],n[1],n[2]).length();const o=mn.set(n[4],n[5],n[6]).length(),l=mn.set(n[8],n[9],n[10]).length();r<0&&(a=-a),ai.copy(this);const c=1/a,h=1/o,p=1/l;return ai.elements[0]*=c,ai.elements[1]*=c,ai.elements[2]*=c,ai.elements[4]*=h,ai.elements[5]*=h,ai.elements[6]*=h,ai.elements[8]*=p,ai.elements[9]*=p,ai.elements[10]*=p,e.setFromRotationMatrix(ai),i.x=a,i.y=o,i.z=l,this}makePerspective(t,e,i,n,r,a,o=xi,l=!1){const c=this.elements,h=2*r/(e-t),p=2*r/(i-n),u=(e+t)/(e-t),d=(i+n)/(i-n);let g,S;if(l)g=r/(a-r),S=a*r/(a-r);else if(o===xi)g=-(a+r)/(a-r),S=-2*a*r/(a-r);else if(o===us)g=-a/(a-r),S=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=p,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=S,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,n,r,a,o=xi,l=!1){const c=this.elements,h=2/(e-t),p=2/(i-n),u=-(e+t)/(e-t),d=-(i+n)/(i-n);let g,S;if(l)g=1/(a-r),S=a/(a-r);else if(o===xi)g=-2/(a-r),S=-(a+r)/(a-r);else if(o===us)g=-1/(a-r),S=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=p,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=S,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<16;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}};ur.prototype.isMatrix4=!0;let ie=ur;const mn=new R,ai=new ie,Nh=new R(0,0,0),Fh=new R(1,1,1),Ni=new R,xs=new R,$e=new R,jo=new ie,tl=new cn;class qi{constructor(t=0,e=0,i=0,n=qi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=n}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,n=this._order){return this._x=t,this._y=e,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const n=t.elements,r=n[0],a=n[4],o=n[8],l=n[1],c=n[5],h=n[9],p=n[2],u=n[6],d=n[10];switch(e){case"XYZ":this._y=Math.asin(Xt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Xt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-p,r),this._z=0);break;case"ZXY":this._x=Math.asin(Xt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-p,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Xt(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Xt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-p,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Xt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:It("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return jo.makeRotationFromQuaternion(t),this.setFromRotationMatrix(jo,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return tl.setFromEuler(this),this.setFromQuaternion(tl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}qi.DEFAULT_ORDER="XYZ";class vo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Oh=0;const el=new R,gn=new cn,wi=new ie,vs=new R,qn=new R,zh=new R,Bh=new cn,il=new R(1,0,0),nl=new R(0,1,0),sl=new R(0,0,1),rl={type:"added"},kh={type:"removed"},_n={type:"childadded",child:null},Dr={type:"childremoved",child:null};class ye extends ln{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Oh++}),this.uuid=Wi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ye.DEFAULT_UP.clone();const t=new R,e=new qi,i=new cn,n=new R(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new ie},normalMatrix:{value:new Nt}}),this.matrix=new ie,this.matrixWorld=new ie,this.matrixAutoUpdate=ye.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return gn.setFromAxisAngle(t,e),this.quaternion.multiply(gn),this}rotateOnWorldAxis(t,e){return gn.setFromAxisAngle(t,e),this.quaternion.premultiply(gn),this}rotateX(t){return this.rotateOnAxis(il,t)}rotateY(t){return this.rotateOnAxis(nl,t)}rotateZ(t){return this.rotateOnAxis(sl,t)}translateOnAxis(t,e){return el.copy(t).applyQuaternion(this.quaternion),this.position.add(el.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(il,t)}translateY(t){return this.translateOnAxis(nl,t)}translateZ(t){return this.translateOnAxis(sl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(wi.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?vs.copy(t):vs.set(t,e,i);const n=this.parent;this.updateWorldMatrix(!0,!1),qn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?wi.lookAt(qn,vs,this.up):wi.lookAt(vs,qn,this.up),this.quaternion.setFromRotationMatrix(wi),n&&(wi.extractRotation(n.matrixWorld),gn.setFromRotationMatrix(wi),this.quaternion.premultiply(gn.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Yt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(rl),_n.child=t,this.dispatchEvent(_n),_n.child=null):Yt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(kh),Dr.child=t,this.dispatchEvent(Dr),Dr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),wi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),wi.multiply(t.parent.matrixWorld)),t.applyMatrix4(wi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(rl),_n.child=t,this.dispatchEvent(_n),_n.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,n=this.children.length;i<n;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qn,t,zh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qn,Bh,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,i=t.y,n=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*i-r[8]*n,r[13]+=i-r[1]*e-r[5]*i-r[9]*n,r[14]+=n-r[2]*e-r[6]*i-r[10]*n}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e,i=!1){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,n.name=this.name,n.castShadow=this.castShadow,n.receiveShadow=this.receiveShadow,n.visible=this.visible,n.frustumCulled=this.frustumCulled,n.renderOrder=this.renderOrder,n.static=this.static,n.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.pivot!==null&&(n.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(n.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(n.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(t),n.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const p=l[c];r(t.shapes,p)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));n.material=o}else n.material=r(t.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];n.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),p=a(t.shapes),u=a(t.skeletons),d=a(t.animations),g=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),p.length>0&&(i.shapes=p),u.length>0&&(i.skeletons=u),d.length>0&&(i.animations=d),g.length>0&&(i.nodes=g)}return i.object=n,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const n=t.children[i];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}ye.DEFAULT_UP=new R(0,1,0);ye.DEFAULT_MATRIX_AUTO_UPDATE=!0;ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class re extends ye{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Gh={type:"move"};class Ir{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new re,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new re,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new re,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let n=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const S of t.hand.values()){const m=e.getJointPose(S,i),f=this._getHandJoint(c,S);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=c.joints["index-finger-tip"],p=c.joints["thumb-tip"],u=h.position.distanceTo(p.position),d=.02,g=.005;c.inputState.pinching&&u>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(n=e.getPose(t.targetRaySpace,i),n===null&&r!==null&&(n=r),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Gh)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new re;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const xc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fi={h:0,s:0,l:0},Ms={h:0,s:0,l:0};function Ur(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Dt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const n=t;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=we){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Wt.colorSpaceToWorking(this,e),this}setRGB(t,e,i,n=Wt.workingColorSpace){return this.r=t,this.g=e,this.b=i,Wt.colorSpaceToWorking(this,n),this}setHSL(t,e,i,n=Wt.workingColorSpace){if(t=Rh(t,1),e=Xt(e,0,1),i=Xt(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=Ur(a,r,t+1/3),this.g=Ur(a,r,t),this.b=Ur(a,r,t-1/3)}return Wt.colorSpaceToWorking(this,n),this}setStyle(t,e=we){function i(r){r!==void 0&&parseFloat(r)<1&&It("Color: Alpha component of "+t+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:It("Color: Unknown color model "+t)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=n[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);It("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=we){const i=xc[t.toLowerCase()];return i!==void 0?this.setHex(i,e):It("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Pi(t.r),this.g=Pi(t.g),this.b=Pi(t.b),this}copyLinearToSRGB(t){return this.r=Fn(t.r),this.g=Fn(t.g),this.b=Fn(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=we){return Wt.workingToColorSpace(Be.copy(this),t),Math.round(Xt(Be.r*255,0,255))*65536+Math.round(Xt(Be.g*255,0,255))*256+Math.round(Xt(Be.b*255,0,255))}getHexString(t=we){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Wt.workingColorSpace){Wt.workingToColorSpace(Be.copy(this),e);const i=Be.r,n=Be.g,r=Be.b,a=Math.max(i,n,r),o=Math.min(i,n,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const p=a-o;switch(c=h<=.5?p/(a+o):p/(2-a-o),a){case i:l=(n-r)/p+(n<r?6:0);break;case n:l=(r-i)/p+2;break;case r:l=(i-n)/p+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Wt.workingColorSpace){return Wt.workingToColorSpace(Be.copy(this),e),t.r=Be.r,t.g=Be.g,t.b=Be.b,t}getStyle(t=we){Wt.workingToColorSpace(Be.copy(this),t);const e=Be.r,i=Be.g,n=Be.b;return t!==we?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(t,e,i){return this.getHSL(Fi),this.setHSL(Fi.h+t,Fi.s+e,Fi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Fi),t.getHSL(Ms);const i=Ar(Fi.h,Ms.h,e),n=Ar(Fi.s,Ms.s,e),r=Ar(Fi.l,Ms.l,e);return this.setHSL(i,n,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,n=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*n,this.g=r[1]*e+r[4]*i+r[7]*n,this.b=r[2]*e+r[5]*i+r[8]*n,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Be=new Dt;Dt.NAMES=xc;class Mo{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Dt(t),this.density=e}clone(){return new Mo(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Hh extends ye{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new qi,this.environmentIntensity=1,this.environmentRotation=new qi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}}const oi=new R,Ei=new R,Nr=new R,Ti=new R,xn=new R,vn=new R,al=new R,Fr=new R,Or=new R,zr=new R,Br=new me,kr=new me,Gr=new me;class ni{constructor(t=new R,e=new R,i=new R){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,n){n.subVectors(i,e),oi.subVectors(t,e),n.cross(oi);const r=n.lengthSq();return r>0?n.multiplyScalar(1/Math.sqrt(r)):n.set(0,0,0)}static getBarycoord(t,e,i,n,r){oi.subVectors(n,e),Ei.subVectors(i,e),Nr.subVectors(t,e);const a=oi.dot(oi),o=oi.dot(Ei),l=oi.dot(Nr),c=Ei.dot(Ei),h=Ei.dot(Nr),p=a*c-o*o;if(p===0)return r.set(0,0,0),null;const u=1/p,d=(c*l-o*h)*u,g=(a*h-o*l)*u;return r.set(1-d-g,g,d)}static containsPoint(t,e,i,n){return this.getBarycoord(t,e,i,n,Ti)===null?!1:Ti.x>=0&&Ti.y>=0&&Ti.x+Ti.y<=1}static getInterpolation(t,e,i,n,r,a,o,l){return this.getBarycoord(t,e,i,n,Ti)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ti.x),l.addScaledVector(a,Ti.y),l.addScaledVector(o,Ti.z),l)}static getInterpolatedAttribute(t,e,i,n,r,a){return Br.setScalar(0),kr.setScalar(0),Gr.setScalar(0),Br.fromBufferAttribute(t,e),kr.fromBufferAttribute(t,i),Gr.fromBufferAttribute(t,n),a.setScalar(0),a.addScaledVector(Br,r.x),a.addScaledVector(kr,r.y),a.addScaledVector(Gr,r.z),a}static isFrontFacing(t,e,i,n){return oi.subVectors(i,e),Ei.subVectors(t,e),oi.cross(Ei).dot(n)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,n){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[n]),this}setFromAttributeAndIndices(t,e,i,n){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return oi.subVectors(this.c,this.b),Ei.subVectors(this.a,this.b),oi.cross(Ei).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ni.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return ni.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,n,r){return ni.getInterpolation(t,this.a,this.b,this.c,e,i,n,r)}containsPoint(t){return ni.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ni.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,n=this.b,r=this.c;let a,o;xn.subVectors(n,i),vn.subVectors(r,i),Fr.subVectors(t,i);const l=xn.dot(Fr),c=vn.dot(Fr);if(l<=0&&c<=0)return e.copy(i);Or.subVectors(t,n);const h=xn.dot(Or),p=vn.dot(Or);if(h>=0&&p<=h)return e.copy(n);const u=l*p-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(i).addScaledVector(xn,a);zr.subVectors(t,r);const d=xn.dot(zr),g=vn.dot(zr);if(g>=0&&d<=g)return e.copy(r);const S=d*c-l*g;if(S<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(i).addScaledVector(vn,o);const m=h*g-d*p;if(m<=0&&p-h>=0&&d-g>=0)return al.subVectors(r,n),o=(p-h)/(p-h+(d-g)),e.copy(n).addScaledVector(al,o);const f=1/(m+S+u);return a=S*f,o=u*f,e.copy(i).addScaledVector(xn,a).addScaledVector(vn,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class Yi{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(li.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(li.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=li.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,li):li.fromBufferAttribute(r,a),li.applyMatrix4(t.matrixWorld),this.expandByPoint(li);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ss.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ss.copy(i.boundingBox)),Ss.applyMatrix4(t.matrixWorld),this.union(Ss)}const n=t.children;for(let r=0,a=n.length;r<a;r++)this.expandByObject(n[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,li),li.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Yn),ys.subVectors(this.max,Yn),Mn.subVectors(t.a,Yn),Sn.subVectors(t.b,Yn),yn.subVectors(t.c,Yn),Oi.subVectors(Sn,Mn),zi.subVectors(yn,Sn),Ki.subVectors(Mn,yn);let e=[0,-Oi.z,Oi.y,0,-zi.z,zi.y,0,-Ki.z,Ki.y,Oi.z,0,-Oi.x,zi.z,0,-zi.x,Ki.z,0,-Ki.x,-Oi.y,Oi.x,0,-zi.y,zi.x,0,-Ki.y,Ki.x,0];return!Hr(e,Mn,Sn,yn,ys)||(e=[1,0,0,0,1,0,0,0,1],!Hr(e,Mn,Sn,yn,ys))?!1:(bs.crossVectors(Oi,zi),e=[bs.x,bs.y,bs.z],Hr(e,Mn,Sn,yn,ys))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,li).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(li).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ai[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ai[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ai[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ai[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ai[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ai[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ai[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ai[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ai),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Ai=[new R,new R,new R,new R,new R,new R,new R,new R],li=new R,Ss=new Yi,Mn=new R,Sn=new R,yn=new R,Oi=new R,zi=new R,Ki=new R,Yn=new R,ys=new R,bs=new R,$i=new R;function Hr(s,t,e,i,n){for(let r=0,a=s.length-3;r<=a;r+=3){$i.fromArray(s,r);const o=n.x*Math.abs($i.x)+n.y*Math.abs($i.y)+n.z*Math.abs($i.z),l=t.dot($i),c=e.dot($i),h=i.dot($i);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Se=new R,ws=new wt;let Vh=0;class Te extends ln{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Vh++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=mc,this.updateRanges=[],this.gpuType=ci,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let n=0,r=this.itemSize;n<r;n++)this.array[t+n]=e.array[i+n];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)ws.fromBufferAttribute(this,e),ws.applyMatrix3(t),this.setXY(e,ws.x,ws.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix3(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix4(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Se.fromBufferAttribute(this,e),Se.applyNormalMatrix(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Se.fromBufferAttribute(this,e),Se.transformDirection(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=_i(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=se(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=_i(e,this.array)),e}setX(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=_i(e,this.array)),e}setY(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=_i(e,this.array)),e}setZ(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=_i(e,this.array)),e}setW(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),i=se(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,n){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),i=se(i,this.array),n=se(n,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this}setXYZW(t,e,i,n,r){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),i=se(i,this.array),n=se(n,this.array),r=se(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}}class vc extends Te{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Mc extends Te{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class $t extends Te{constructor(t,e,i){super(new Float32Array(t),e,i)}}const Wh=new Yi,Zn=new R,Vr=new R;class hn{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Wh.setFromPoints(t).getCenter(i);let n=0;for(let r=0,a=t.length;r<a;r++)n=Math.max(n,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(n),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Zn.subVectors(t,this.center);const e=Zn.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),n=(i-this.radius)*.5;this.center.addScaledVector(Zn,n/i),this.radius+=n}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Vr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Zn.copy(t.center).add(Vr)),this.expandByPoint(Zn.copy(t.center).sub(Vr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let Xh=0;const ei=new ie,Wr=new ye,bn=new R,Je=new Yi,Kn=new Yi,Pe=new R;class ge extends ln{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Xh++}),this.uuid=Wi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(wh(t)?Mc:vc)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Nt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(t),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return ei.makeRotationFromQuaternion(t),this.applyMatrix4(ei),this}rotateX(t){return ei.makeRotationX(t),this.applyMatrix4(ei),this}rotateY(t){return ei.makeRotationY(t),this.applyMatrix4(ei),this}rotateZ(t){return ei.makeRotationZ(t),this.applyMatrix4(ei),this}translate(t,e,i){return ei.makeTranslation(t,e,i),this.applyMatrix4(ei),this}scale(t,e,i){return ei.makeScale(t,e,i),this.applyMatrix4(ei),this}lookAt(t){return Wr.lookAt(t),Wr.updateMatrix(),this.applyMatrix4(Wr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bn).negate(),this.translate(bn.x,bn.y,bn.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let n=0,r=t.length;n<r;n++){const a=t[n];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new $t(i,3))}else{const i=Math.min(t.length,e.count);for(let n=0;n<i;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&It("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Yi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Yt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,n=e.length;i<n;i++){const r=e[i];Je.setFromBufferAttribute(r),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,Je.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,Je.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(Je.min),this.boundingBox.expandByPoint(Je.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Yt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new hn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Yt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){const i=this.boundingSphere.center;if(Je.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Kn.setFromBufferAttribute(o),this.morphTargetsRelative?(Pe.addVectors(Je.min,Kn.min),Je.expandByPoint(Pe),Pe.addVectors(Je.max,Kn.max),Je.expandByPoint(Pe)):(Je.expandByPoint(Kn.min),Je.expandByPoint(Kn.max))}Je.getCenter(i);let n=0;for(let r=0,a=t.count;r<a;r++)Pe.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(Pe));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Pe.fromBufferAttribute(o,c),l&&(bn.fromBufferAttribute(t,c),Pe.add(bn)),n=Math.max(n,i.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&Yt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Yt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,n=e.normal,r=e.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new Te(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let x=0;x<i.count;x++)o[x]=new R,l[x]=new R;const c=new R,h=new R,p=new R,u=new wt,d=new wt,g=new wt,S=new R,m=new R;function f(x,w,P){c.fromBufferAttribute(i,x),h.fromBufferAttribute(i,w),p.fromBufferAttribute(i,P),u.fromBufferAttribute(r,x),d.fromBufferAttribute(r,w),g.fromBufferAttribute(r,P),h.sub(c),p.sub(c),d.sub(u),g.sub(u);const I=1/(d.x*g.y-g.x*d.y);isFinite(I)&&(S.copy(h).multiplyScalar(g.y).addScaledVector(p,-d.y).multiplyScalar(I),m.copy(p).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(I),o[x].add(S),o[w].add(S),o[P].add(S),l[x].add(m),l[w].add(m),l[P].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let x=0,w=y.length;x<w;++x){const P=y[x],I=P.start,F=P.count;for(let G=I,N=I+F;G<N;G+=3)f(t.getX(G+0),t.getX(G+1),t.getX(G+2))}const A=new R,M=new R,b=new R,E=new R;function C(x){b.fromBufferAttribute(n,x),E.copy(b);const w=o[x];A.copy(w),A.sub(b.multiplyScalar(b.dot(w))).normalize(),M.crossVectors(E,w);const I=M.dot(l[x])<0?-1:1;a.setXYZW(x,A.x,A.y,A.z,I)}for(let x=0,w=y.length;x<w;++x){const P=y[x],I=P.start,F=P.count;for(let G=I,N=I+F;G<N;G+=3)C(t.getX(G+0)),C(t.getX(G+1)),C(t.getX(G+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new Te(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let u=0,d=i.count;u<d;u++)i.setXYZ(u,0,0,0);const n=new R,r=new R,a=new R,o=new R,l=new R,c=new R,h=new R,p=new R;if(t)for(let u=0,d=t.count;u<d;u+=3){const g=t.getX(u+0),S=t.getX(u+1),m=t.getX(u+2);n.fromBufferAttribute(e,g),r.fromBufferAttribute(e,S),a.fromBufferAttribute(e,m),h.subVectors(a,r),p.subVectors(n,r),h.cross(p),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,S),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(S,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,d=e.count;u<d;u+=3)n.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),p.subVectors(n,r),h.cross(p),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Pe.fromBufferAttribute(t,e),Pe.normalize(),t.setXYZ(e,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,p=o.normalized,u=new c.constructor(l.length*h);let d=0,g=0;for(let S=0,m=l.length;S<m;S++){o.isInterleavedBufferAttribute?d=l[S]*o.data.stride+o.offset:d=l[S]*h;for(let f=0;f<h;f++)u[g++]=c[d++]}return new Te(u,h,p)}if(this.index===null)return It("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ge,i=this.index.array,n=this.attributes;for(const o in n){const l=n[o],c=t(l,i);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,p=c.length;h<p;h++){const u=c[h],d=t(u,i);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const n={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let p=0,u=c.length;p<u;p++){const d=c[p];h.push(d.toJSON(t.data))}h.length>0&&(n[l]=h,r=!0)}r&&(t.data.morphAttributes=n,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const n=t.attributes;for(const c in n){const h=n[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],p=r[c];for(let u=0,d=p.length;u<d;u++)h.push(p[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const p=a[c];this.addGroup(p.start,p.count,p.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class qh{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=mc,this.updateRanges=[],this.version=0,this.uuid=Wi()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let n=0,r=this.stride;n<r;n++)this.array[t+n]=e.array[i+n];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Wi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Wi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const e={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return e.usage=this.usage,e}}const Ve=new R;class hr{constructor(t,e,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Ve.fromBufferAttribute(this,e),Ve.applyMatrix4(t),this.setXYZ(e,Ve.x,Ve.y,Ve.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ve.fromBufferAttribute(this,e),Ve.applyNormalMatrix(t),this.setXYZ(e,Ve.x,Ve.y,Ve.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ve.fromBufferAttribute(this,e),Ve.transformDirection(t),this.setXYZ(e,Ve.x,Ve.y,Ve.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=_i(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=se(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=_i(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=_i(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=_i(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=_i(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),i=se(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),i=se(i,this.array),n=se(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this}setXYZW(t,e,i,n,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),i=se(i,this.array),n=se(n,this.array),r=se(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this.data.array[t+3]=r,this}clone(t){if(t===void 0){cr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[n+r])}return new Te(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new hr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){cr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[n+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Xr=new R,Yh=new R,Zh=new Nt;class Hi{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,n){return this.normal.set(t,e,i),this.constant=n,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const n=Xr.subVectors(i,e).cross(Yh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(n,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){const n=t.delta(Xr),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Zh.getNormalMatrix(t),n=this.coplanarPoint(Xr).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}}let Kh=0;class un extends ln{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Kh++}),this.uuid=Wi(),this.name="",this.type="Material",this.blending=nn,this.side=rn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=rc,this.blendDst=ac,this.blendEquation=In,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Dt(0,0,0),this.blendAlpha=0,this.depthFunc=os,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=_h,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Er,this.stencilZFail=Er,this.stencilZPass=Er,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){It(`Material: parameter '${e}' has value of undefined.`);continue}const n=this[e];if(n===void 0){It(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector2&&i&&i.isVector2||n&&n.isEuler&&i&&i.isEuler||n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=n(t.textures),a=n(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Dt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new Hi().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new wt().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new wt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const n=e.length;i=new Array(n);for(let r=0;r!==n;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class si extends un{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Dt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let wn;const $n=new R,En=new R,Tn=new R,An=new wt,Jn=new wt,Sc=new ie,Es=new R,Qn=new R,Ts=new R,ol=new wt,qr=new wt,ll=new wt;class Si extends ye{constructor(t=new si){if(super(),this.isSprite=!0,this.type="Sprite",wn===void 0){wn=new ge;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new qh(e,5);wn.setIndex([0,1,2,0,2,3]),wn.setAttribute("position",new hr(i,3,0,!1)),wn.setAttribute("uv",new hr(i,2,3,!1))}this.geometry=wn,this.material=t,this.center=new wt(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&Yt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),En.setFromMatrixScale(this.matrixWorld),Sc.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Tn.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&En.multiplyScalar(-Tn.z);const i=this.material.rotation;let n,r;i!==0&&(r=Math.cos(i),n=Math.sin(i));const a=this.center;As(Es.set(-.5,-.5,0),Tn,a,En,n,r),As(Qn.set(.5,-.5,0),Tn,a,En,n,r),As(Ts.set(.5,.5,0),Tn,a,En,n,r),ol.set(0,0),qr.set(1,0),ll.set(1,1);let o=t.ray.intersectTriangle(Es,Qn,Ts,!1,$n);if(o===null&&(As(Qn.set(-.5,.5,0),Tn,a,En,n,r),qr.set(0,1),o=t.ray.intersectTriangle(Es,Ts,Qn,!1,$n),o===null))return;const l=t.ray.origin.distanceTo($n);l<t.near||l>t.far||e.push({distance:l,point:$n.clone(),uv:ni.getInterpolation($n,Es,Qn,Ts,ol,qr,ll,new wt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function As(s,t,e,i,n,r){An.subVectors(s,e).addScalar(.5).multiply(i),n!==void 0?(Jn.x=r*An.x-n*An.y,Jn.y=n*An.x+r*An.y):Jn.copy(An),s.copy(t),s.x+=Jn.x,s.y+=Jn.y,s.applyMatrix4(Sc)}const Ri=new R,Yr=new R,Rs=new R,Cs=new R;class pr{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ri)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ri.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ri.copy(this.origin).addScaledVector(this.direction,e),Ri.distanceToSquared(t))}distanceSqToSegment(t,e,i,n){Yr.copy(t).add(e).multiplyScalar(.5),Rs.copy(e).sub(t).normalize(),Cs.copy(this.origin).sub(Yr);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Rs),o=Cs.dot(this.direction),l=-Cs.dot(Rs),c=Cs.lengthSq(),h=Math.abs(1-a*a);let p,u,d,g;if(h>0)if(p=a*l-o,u=a*o-l,g=r*h,p>=0)if(u>=-g)if(u<=g){const S=1/h;p*=S,u*=S,d=p*(p+a*u+2*o)+u*(a*p+u+2*l)+c}else u=r,p=Math.max(0,-(a*u+o)),d=-p*p+u*(u+2*l)+c;else u=-r,p=Math.max(0,-(a*u+o)),d=-p*p+u*(u+2*l)+c;else u<=-g?(p=Math.max(0,-(-a*r+o)),u=p>0?-r:Math.min(Math.max(-r,-l),r),d=-p*p+u*(u+2*l)+c):u<=g?(p=0,u=Math.min(Math.max(-r,-l),r),d=u*(u+2*l)+c):(p=Math.max(0,-(a*r+o)),u=p>0?r:Math.min(Math.max(-r,-l),r),d=-p*p+u*(u+2*l)+c);else u=a>0?-r:r,p=Math.max(0,-(a*u+o)),d=-p*p+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,p),n&&n.copy(Yr).addScaledVector(Rs,u),d}intersectSphere(t,e){if(t.radius<0)return null;Ri.subVectors(t.center,this.origin);const i=Ri.dot(this.direction),n=Ri.dot(Ri)-i*i,r=t.radius*t.radius;if(n>r)return null;const a=Math.sqrt(r-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,n,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,p=1/this.direction.z,u=this.origin;return c>=0?(i=(t.min.x-u.x)*c,n=(t.max.x-u.x)*c):(i=(t.max.x-u.x)*c,n=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),i>a||r>n||((r>i||isNaN(i))&&(i=r),(a<n||isNaN(n))&&(n=a),p>=0?(o=(t.min.z-u.z)*p,l=(t.max.z-u.z)*p):(o=(t.max.z-u.z)*p,l=(t.min.z-u.z)*p),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,e)}intersectsBox(t){return this.intersectBox(t,Ri)!==null}intersectTriangle(t,e,i,n,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,p=t.x-a.x,u=t.y-a.y,d=t.z-a.z,g=e.x-a.x,S=e.y-a.y,m=e.z-a.z,f=i.x-a.x,y=i.y-a.y,A=i.z-a.z,M=Math.abs(l),b=Math.abs(c),E=Math.abs(h);let C,x,w,P,I,F,G,N,k,K,W,nt;if(M>=b&&M>=E?(w=l,F=p,k=g,nt=f,l>=0?(C=c,x=h,P=u,I=d,G=S,N=m,K=y,W=A):(C=h,x=c,P=d,I=u,G=m,N=S,K=A,W=y)):b>=E?(w=c,F=u,k=S,nt=y,c>=0?(C=h,x=l,P=d,I=p,G=m,N=g,K=A,W=f):(C=l,x=h,P=p,I=d,G=g,N=m,K=f,W=A)):(w=h,F=d,k=m,nt=A,h>=0?(C=l,x=c,P=p,I=u,G=g,N=S,K=f,W=y):(C=c,x=l,P=u,I=p,G=S,N=g,K=y,W=f)),w===0)return null;const q=C/w,j=x/w,it=1/w,Ct=P-q*F,At=I-j*F,le=G-q*k,qt=N-j*k,Jt=K-q*nt,Y=W-j*nt,Q=Jt*qt-Y*le,vt=Ct*Y-At*Jt,Ut=le*At-qt*Ct;if(n){if(Q<0||vt<0||Ut<0)return null}else if((Q<0||vt<0||Ut<0)&&(Q>0||vt>0||Ut>0))return null;const gt=Q+vt+Ut;if(gt===0)return null;const Bt=it*(Q*F+vt*k+Ut*nt);return(gt>0?Bt<0:Bt>0)?null:this.at(Bt/gt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ee extends un{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Dt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qi,this.combine=oc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const cl=new ie,Ji=new pr,Ps=new hn,hl=new R,Ls=new R,Ds=new R,Is=new R,Zr=new R,Us=new R,ul=new R,Ns=new R;class tt extends ye{constructor(t=new ge,e=new Ee){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const i=this.geometry,n=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(n,t);const o=this.morphTargetInfluences;if(r&&o){Us.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],p=r[l];h!==0&&(Zr.fromBufferAttribute(p,t),a?Us.addScaledVector(Zr,h):Us.addScaledVector(Zr.sub(e),h))}e.add(Us)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const i=this.geometry,n=this.material,r=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ps.copy(i.boundingSphere),Ps.applyMatrix4(r),Ji.copy(t.ray).recast(t.near),!(Ps.containsPoint(Ji.origin)===!1&&(Ji.intersectSphere(Ps,hl)===null||Ji.origin.distanceToSquared(hl)>(t.far-t.near)**2))&&(cl.copy(r).invert(),Ji.copy(t.ray).applyMatrix4(cl),!(i.boundingBox!==null&&Ji.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Ji)))}_computeIntersections(t,e,i){let n;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,p=r.attributes.normal,u=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,S=u.length;g<S;g++){const m=u[g],f=a[m.materialIndex],y=Math.max(m.start,d.start),A=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let M=y,b=A;M<b;M+=3){const E=o.getX(M),C=o.getX(M+1),x=o.getX(M+2);n=Fs(this,f,t,i,c,h,p,E,C,x),n&&(n.faceIndex=Math.floor(M/3),n.face.materialIndex=m.materialIndex,e.push(n))}}else{const g=Math.max(0,d.start),S=Math.min(o.count,d.start+d.count);for(let m=g,f=S;m<f;m+=3){const y=o.getX(m),A=o.getX(m+1),M=o.getX(m+2);n=Fs(this,a,t,i,c,h,p,y,A,M),n&&(n.faceIndex=Math.floor(m/3),e.push(n))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,S=u.length;g<S;g++){const m=u[g],f=a[m.materialIndex],y=Math.max(m.start,d.start),A=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let M=y,b=A;M<b;M+=3){const E=M,C=M+1,x=M+2;n=Fs(this,f,t,i,c,h,p,E,C,x),n&&(n.faceIndex=Math.floor(M/3),n.face.materialIndex=m.materialIndex,e.push(n))}}else{const g=Math.max(0,d.start),S=Math.min(l.count,d.start+d.count);for(let m=g,f=S;m<f;m+=3){const y=m,A=m+1,M=m+2;n=Fs(this,a,t,i,c,h,p,y,A,M),n&&(n.faceIndex=Math.floor(m/3),e.push(n))}}}}function $h(s,t,e,i,n,r,a,o){let l;if(t.side===Xe?l=i.intersectTriangle(a,r,n,!0,o):l=i.intersectTriangle(n,r,a,t.side===rn,o),l===null)return null;Ns.copy(o),Ns.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Ns);return c<e.near||c>e.far?null:{distance:c,point:Ns.clone(),object:s}}function Fs(s,t,e,i,n,r,a,o,l,c){s.getVertexPosition(o,Ls),s.getVertexPosition(l,Ds),s.getVertexPosition(c,Is);const h=$h(s,t,e,i,Ls,Ds,Is,ul);if(h){const p=new R;ni.getBarycoord(ul,Ls,Ds,Is,p),n&&(h.uv=ni.getInterpolatedAttribute(n,o,l,c,p,new wt)),r&&(h.uv1=ni.getInterpolatedAttribute(r,o,l,c,p,new wt)),a&&(h.normal=ni.getInterpolatedAttribute(a,o,l,c,p,new R),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new R,materialIndex:0};ni.getNormal(Ls,Ds,Is,u.normal),h.face=u,h.barycoord=p}return h}class yc extends Ge{constructor(t=null,e=1,i=1,n,r,a,o,l,c=Ue,h=Ue,p,u){super(null,a,o,l,c,h,n,r,p,u),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class dl extends Te{constructor(t,e,i,n=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Rn=new ie,fl=new ie,Os=[],pl=new Yi,Jh=new ie,jn=new tt,ts=new hn;class ml extends tt{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new dl(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,Jh)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Yi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Rn),pl.copy(t.boundingBox).applyMatrix4(Rn),this.boundingBox.union(pl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new hn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Rn),ts.copy(t.boundingSphere).applyMatrix4(Rn),this.boundingSphere.union(ts)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,n=this.morphTexture.source.data.data,r=i.length+1,a=t*r+1;for(let o=0;o<i.length;o++)i[o]=n[a+o]}raycast(t,e){const i=this.matrixWorld,n=this.count;if(jn.geometry=this.geometry,jn.material=this.material,jn.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ts.copy(this.boundingSphere),ts.applyMatrix4(i),t.ray.intersectsSphere(ts)!==!1))for(let r=0;r<n;r++){this.getMatrixAt(r,Rn),fl.multiplyMatrices(i,Rn),jn.matrixWorld=fl,jn.raycast(t,Os);for(let a=0,o=Os.length;a<o;a++){const l=Os[a];l.instanceId=r,l.object=this,e.push(l)}Os.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new dl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const i=e.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new yc(new Float32Array(n*this.count),n,this.count,uo,ci));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=n*t;return r[l]=o,r.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Qi=new hn,Qh=new wt(.5,.5),zs=new R;class So{constructor(t=new Hi,e=new Hi,i=new Hi,n=new Hi,r=new Hi,a=new Hi){this.planes=[t,e,i,n,r,a]}set(t,e,i,n,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(n),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=xi,i=!1){const n=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],p=r[5],u=r[6],d=r[7],g=r[8],S=r[9],m=r[10],f=r[11],y=r[12],A=r[13],M=r[14],b=r[15];if(n[0].setComponents(c-a,d-h,f-g,b-y).normalize(),n[1].setComponents(c+a,d+h,f+g,b+y).normalize(),n[2].setComponents(c+o,d+p,f+S,b+A).normalize(),n[3].setComponents(c-o,d-p,f-S,b-A).normalize(),i)n[4].setComponents(l,u,m,M).normalize(),n[5].setComponents(c-l,d-u,f-m,b-M).normalize();else if(n[4].setComponents(c-l,d-u,f-m,b-M).normalize(),e===xi)n[5].setComponents(c+l,d+u,f+m,b+M).normalize();else if(e===us)n[5].setComponents(l,u,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Qi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Qi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Qi)}intersectsSprite(t){Qi.center.set(0,0,0);const e=Qh.distanceTo(t.center);return Qi.radius=.7071067811865476+e,Qi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Qi)}intersectsSphere(t){const e=this.planes,i=t.center,n=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<n)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const n=e[i];if(zs.x=n.normal.x>0?t.max.x:t.min.x,zs.y=n.normal.y>0?t.max.y:t.min.y,zs.z=n.normal.z>0?t.max.z:t.min.z,n.distanceToPoint(zs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class yo extends un{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Dt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const gl=new ie,Ja=new pr,Bs=new hn,ks=new R;class bo extends ye{constructor(t=new ge,e=new yo){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const i=this.geometry,n=this.matrixWorld,r=t.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Bs.copy(i.boundingSphere),Bs.applyMatrix4(n),Bs.radius+=r,t.ray.intersectsSphere(Bs)===!1)return;gl.copy(n).invert(),Ja.copy(t.ray).applyMatrix4(gl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,p=i.attributes.position;if(c!==null){const u=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let g=u,S=d;g<S;g++){const m=c.getX(g);ks.fromBufferAttribute(p,m),_l(ks,m,l,n,t,e,this)}}else{const u=Math.max(0,a.start),d=Math.min(p.count,a.start+a.count);for(let g=u,S=d;g<S;g++)ks.fromBufferAttribute(p,g),_l(ks,g,l,n,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function _l(s,t,e,i,n,r,a){const o=Ja.distanceSqToPoint(s);if(o<e){const l=new R;Ja.closestPointToPoint(s,l),l.applyMatrix4(i);const c=n.ray.origin.distanceTo(l);if(c<n.near||c>n.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class bc extends Ge{constructor(t=[],e=an,i,n,r,a,o,l,c,h){super(t,e,i,n,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Hn extends Ge{constructor(t,e,i,n,r,a,o,l,c){super(t,e,i,n,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ds extends Ge{constructor(t,e,i=yi,n,r,a,o=Ue,l=Ue,c,h=Li,p=1){if(h!==Li&&h!==en)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:p};super(u,n,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new xo(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}}class jh extends ds{constructor(t,e=yi,i=an,n,r,a=Ue,o=Ue,l,c=Li){const h={width:t,height:t,depth:1},p=[h,h,h,h,h,h];super(t,t,e,i,n,r,a,o,l,c),this.image=p,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class wc extends Ge{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Pt extends ge{constructor(t=1,e=1,i=1,n=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:n,heightSegments:r,depthSegments:a};const o=this;n=Math.floor(n),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],p=[];let u=0,d=0;g("z","y","x",-1,-1,i,e,t,a,r,0),g("z","y","x",1,-1,i,e,-t,a,r,1),g("x","z","y",1,1,t,i,e,n,a,2),g("x","z","y",1,-1,t,i,-e,n,a,3),g("x","y","z",1,-1,t,e,i,n,r,4),g("x","y","z",-1,-1,t,e,-i,n,r,5),this.setIndex(l),this.setAttribute("position",new $t(c,3)),this.setAttribute("normal",new $t(h,3)),this.setAttribute("uv",new $t(p,2));function g(S,m,f,y,A,M,b,E,C,x,w){const P=M/C,I=b/x,F=M/2,G=b/2,N=E/2,k=C+1,K=x+1;let W=0,nt=0;const q=new R;for(let j=0;j<K;j++){const it=j*I-G;for(let Ct=0;Ct<k;Ct++){const At=Ct*P-F;q[S]=At*y,q[m]=it*A,q[f]=N,c.push(q.x,q.y,q.z),q[S]=0,q[m]=0,q[f]=E>0?1:-1,h.push(q.x,q.y,q.z),p.push(Ct/C),p.push(1-j/x),W+=1}}for(let j=0;j<x;j++)for(let it=0;it<C;it++){const Ct=u+it+k*j,At=u+it+k*(j+1),le=u+(it+1)+k*(j+1),qt=u+(it+1)+k*j;l.push(Ct,At,qt),l.push(At,le,qt),nt+=6}o.addGroup(d,nt,w),d+=nt,u+=W}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pt(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class wo extends ge{constructor(t=1,e=1,i=4,n=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:n,heightSegments:r},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),n=Math.max(3,Math.floor(n)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=e/2,p=Math.PI/2*t,u=e,d=2*p+u,g=i*2+r,S=n+1,m=new R,f=new R;for(let y=0;y<=g;y++){let A=0,M=0,b=0,E=0;if(y<=i){const w=y/i,P=w*Math.PI/2;M=-h-t*Math.cos(P),b=t*Math.sin(P),E=-t*Math.cos(P),A=w*p}else if(y<=i+r){const w=(y-i)/r;M=-h+w*e,b=t,E=0,A=p+w*u}else{const w=(y-i-r)/i,P=w*Math.PI/2;M=h+t*Math.sin(P),b=t*Math.cos(P),E=t*Math.sin(P),A=p+u+w*p}const C=Math.max(0,Math.min(1,A/d));let x=0;y===0?x=.5/n:y===g&&(x=-.5/n);for(let w=0;w<=n;w++){const P=w/n,I=P*Math.PI*2,F=Math.sin(I),G=Math.cos(I);f.x=-b*G,f.y=M,f.z=b*F,o.push(f.x,f.y,f.z),m.set(-b*G,E,b*F),m.normalize(),l.push(m.x,m.y,m.z),c.push(P+x,C)}if(y>0){const w=(y-1)*S;for(let P=0;P<n;P++){const I=w+P,F=w+P+1,G=y*S+P,N=y*S+P+1;a.push(I,F,G),a.push(F,N,G)}}}this.setIndex(a),this.setAttribute("position",new $t(o,3)),this.setAttribute("normal",new $t(l,3)),this.setAttribute("uv",new $t(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wo(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Eo extends ge{constructor(t=1,e=32,i=0,n=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:n},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new R,h=new wt;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let p=0,u=3;p<=e;p++,u+=3){const d=i+p/e*n;c.x=t*Math.cos(d),c.y=t*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/t+1)/2,h.y=(a[u+1]/t+1)/2,l.push(h.x,h.y)}for(let p=1;p<=e;p++)r.push(p,p+1,0);this.setIndex(r),this.setAttribute("position",new $t(a,3)),this.setAttribute("normal",new $t(o,3)),this.setAttribute("uv",new $t(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Eo(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ie extends ge{constructor(t=1,e=1,i=1,n=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:n,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;n=Math.floor(n),r=Math.floor(r);const h=[],p=[],u=[],d=[];let g=0;const S=[],m=i/2;let f=0;y(),a===!1&&(t>0&&A(!0),e>0&&A(!1)),this.setIndex(h),this.setAttribute("position",new $t(p,3)),this.setAttribute("normal",new $t(u,3)),this.setAttribute("uv",new $t(d,2));function y(){const M=new R,b=new R;let E=0;const C=(e-t)/i;for(let x=0;x<=r;x++){const w=[],P=x/r,I=P*(e-t)+t;for(let F=0;F<=n;F++){const G=F/n,N=G*l+o,k=Math.sin(N),K=Math.cos(N);b.x=I*k,b.y=-P*i+m,b.z=I*K,p.push(b.x,b.y,b.z),M.set(k,C,K).normalize(),u.push(M.x,M.y,M.z),d.push(G,1-P),w.push(g++)}S.push(w)}for(let x=0;x<n;x++)for(let w=0;w<r;w++){const P=S[w][x],I=S[w+1][x],F=S[w+1][x+1],G=S[w][x+1];(t>0||w!==0)&&(h.push(P,I,G),E+=3),(e>0||w!==r-1)&&(h.push(I,F,G),E+=3)}c.addGroup(f,E,0),f+=E}function A(M){const b=g,E=new wt,C=new R;let x=0;const w=M===!0?t:e,P=M===!0?1:-1;for(let F=1;F<=n;F++)p.push(0,m*P,0),u.push(0,P,0),d.push(.5,.5),g++;const I=g;for(let F=0;F<=n;F++){const N=F/n*l+o,k=Math.cos(N),K=Math.sin(N);C.x=w*K,C.y=m*P,C.z=w*k,p.push(C.x,C.y,C.z),u.push(0,P,0),E.x=k*.5+.5,E.y=K*.5*P+.5,d.push(E.x,E.y),g++}for(let F=0;F<n;F++){const G=b+F,N=I+F;M===!0?h.push(N,N+1,G):h.push(N+1,N,G),x+=3}c.addGroup(f,x,M===!0?1:2),f+=x}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ie(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class sn extends Ie{constructor(t=1,e=1,i=32,n=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,i,n,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:n,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new sn(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class mr extends ge{constructor(t=[],e=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:n};const r=[],a=[];o(n),c(i),h(),this.setAttribute("position",new $t(r,3)),this.setAttribute("normal",new $t(r.slice(),3)),this.setAttribute("uv",new $t(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const A=new R,M=new R,b=new R;for(let E=0;E<e.length;E+=3)d(e[E+0],A),d(e[E+1],M),d(e[E+2],b),l(A,M,b,y)}function l(y,A,M,b){const E=b+1,C=[];for(let x=0;x<=E;x++){C[x]=[];const w=y.clone().lerp(M,x/E),P=A.clone().lerp(M,x/E),I=E-x;for(let F=0;F<=I;F++)F===0&&x===E?C[x][F]=w:C[x][F]=w.clone().lerp(P,F/I)}for(let x=0;x<E;x++)for(let w=0;w<2*(E-x)-1;w++){const P=Math.floor(w/2);w%2===0?(u(C[x][P+1]),u(C[x+1][P]),u(C[x][P])):(u(C[x][P+1]),u(C[x+1][P+1]),u(C[x+1][P]))}}function c(y){const A=new R;for(let M=0;M<r.length;M+=3)A.x=r[M+0],A.y=r[M+1],A.z=r[M+2],A.normalize().multiplyScalar(y),r[M+0]=A.x,r[M+1]=A.y,r[M+2]=A.z}function h(){const y=new R;for(let A=0;A<r.length;A+=3){y.x=r[A+0],y.y=r[A+1],y.z=r[A+2];const M=m(y)/2/Math.PI+.5,b=f(y)/Math.PI+.5;a.push(M,1-b)}g(),p()}function p(){for(let y=0;y<a.length;y+=6){const A=a[y+0],M=a[y+2],b=a[y+4],E=Math.max(A,M,b),C=Math.min(A,M,b);E>.9&&C<.1&&(A<.2&&(a[y+0]+=1),M<.2&&(a[y+2]+=1),b<.2&&(a[y+4]+=1))}}function u(y){r.push(y.x,y.y,y.z)}function d(y,A){const M=y*3;A.x=t[M+0],A.y=t[M+1],A.z=t[M+2]}function g(){const y=new R,A=new R,M=new R,b=new R,E=new wt,C=new wt,x=new wt;for(let w=0,P=0;w<r.length;w+=9,P+=6){y.set(r[w+0],r[w+1],r[w+2]),A.set(r[w+3],r[w+4],r[w+5]),M.set(r[w+6],r[w+7],r[w+8]),E.set(a[P+0],a[P+1]),C.set(a[P+2],a[P+3]),x.set(a[P+4],a[P+5]),b.copy(y).add(A).add(M).divideScalar(3);const I=m(b);S(E,P+0,y,I),S(C,P+2,A,I),S(x,P+4,M,I)}}function S(y,A,M,b){b<0&&y.x===1&&(a[A]=y.x-1),M.x===0&&M.z===0&&(a[A]=b/2/Math.PI+.5)}function m(y){return Math.atan2(y.z,-y.x)}function f(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new mr(t.vertices,t.indices,t.radius,t.detail)}}class To extends mr{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,n=1/i,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-n,-i,0,-n,i,0,n,-i,0,n,i,-n,-i,0,-n,i,0,n,-i,0,n,i,0,-i,0,-n,i,0,-n,-i,0,n,i,0,n],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new To(t.radius,t.detail)}}class gr extends mr{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],n=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,n,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new gr(t.radius,t.detail)}}class Ze extends ge{constructor(t=1,e=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:n};const r=t/2,a=e/2,o=Math.floor(i),l=Math.floor(n),c=o+1,h=l+1,p=t/o,u=e/l,d=[],g=[],S=[],m=[];for(let f=0;f<h;f++){const y=f*u-a;for(let A=0;A<c;A++){const M=A*p-r;g.push(M,-y,0),S.push(0,0,1),m.push(A/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let y=0;y<o;y++){const A=y+c*f,M=y+c*(f+1),b=y+1+c*(f+1),E=y+1+c*f;d.push(A,M,E),d.push(M,b,E)}this.setIndex(d),this.setAttribute("position",new $t(g,3)),this.setAttribute("normal",new $t(S,3)),this.setAttribute("uv",new $t(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ze(t.width,t.height,t.widthSegments,t.heightSegments)}}class Xi extends ge{constructor(t=.5,e=1,i=32,n=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:n,thetaStart:r,thetaLength:a},i=Math.max(3,i),n=Math.max(1,n);const o=[],l=[],c=[],h=[];let p=t;const u=(e-t)/n,d=new R,g=new wt;for(let S=0;S<=n;S++){for(let m=0;m<=i;m++){const f=r+m/i*a;d.x=p*Math.cos(f),d.y=p*Math.sin(f),l.push(d.x,d.y,d.z),c.push(0,0,1),g.x=(d.x/e+1)/2,g.y=(d.y/e+1)/2,h.push(g.x,g.y)}p+=u}for(let S=0;S<n;S++){const m=S*(i+1);for(let f=0;f<i;f++){const y=f+m,A=y,M=y+i+1,b=y+i+2,E=y+1;o.push(A,M,E),o.push(M,b,E)}}this.setIndex(o),this.setAttribute("position",new $t(l,3)),this.setAttribute("normal",new $t(c,3)),this.setAttribute("uv",new $t(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xi(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ps extends ge{constructor(t=1,e=32,i=16,n=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:n,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],p=new R,u=new R,d=[],g=[],S=[],m=[];for(let f=0;f<=i;f++){const y=[],A=f/i,M=a+A*o,b=t*Math.cos(M),E=Math.sqrt(t*t-b*b);let C=0;f===0&&a===0?C=.5/e:f===i&&l===Math.PI&&(C=-.5/e);for(let x=0;x<=e;x++){const w=x/e,P=n+w*r;p.x=-E*Math.cos(P),p.y=b,p.z=E*Math.sin(P),g.push(p.x,p.y,p.z),u.copy(p).normalize(),S.push(u.x,u.y,u.z),m.push(w+C,1-A),y.push(c++)}h.push(y)}for(let f=0;f<i;f++)for(let y=0;y<e;y++){const A=h[f][y+1],M=h[f][y],b=h[f+1][y],E=h[f+1][y+1];(f!==0||a>0)&&d.push(A,M,E),(f!==i-1||l<Math.PI)&&d.push(M,b,E)}this.setIndex(d),this.setAttribute("position",new $t(g,3)),this.setAttribute("normal",new $t(S,3)),this.setAttribute("uv",new $t(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ps(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class zn extends ge{constructor(t=1,e=.4,i=12,n=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:n,arc:r,thetaStart:a,thetaLength:o},i=Math.floor(i),n=Math.floor(n);const l=[],c=[],h=[],p=[],u=new R,d=new R,g=new R;for(let S=0;S<=i;S++){const m=a+S/i*o;for(let f=0;f<=n;f++){const y=f/n*r;d.x=(t+e*Math.cos(m))*Math.cos(y),d.y=(t+e*Math.cos(m))*Math.sin(y),d.z=e*Math.sin(m),c.push(d.x,d.y,d.z),u.x=t*Math.cos(y),u.y=t*Math.sin(y),g.subVectors(d,u).normalize(),h.push(g.x,g.y,g.z),p.push(f/n),p.push(S/i)}}for(let S=1;S<=i;S++)for(let m=1;m<=n;m++){const f=(n+1)*S+m-1,y=(n+1)*(S-1)+m-1,A=(n+1)*(S-1)+m,M=(n+1)*S+m;l.push(f,y,M),l.push(y,A,M)}this.setIndex(l),this.setAttribute("position",new $t(c,3)),this.setAttribute("normal",new $t(h,3)),this.setAttribute("uv",new $t(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zn(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}}function Bn(s){const t={};for(const e in s){t[e]={};for(const i in s[e]){const n=s[e][i];if(xl(n))n.isRenderTargetTexture?(It("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=n.clone();else if(Array.isArray(n))if(xl(n[0])){const r=[];for(let a=0,o=n.length;a<o;a++)r[a]=n[a].clone();t[e][i]=r}else t[e][i]=n.slice();else t[e][i]=n}}return t}function We(s){const t={};for(let e=0;e<s.length;e++){const i=Bn(s[e]);for(const n in i)t[n]=i[n]}return t}function xl(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function tu(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Ec(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Wt.workingColorSpace}const fs={clone:Bn,merge:We};var eu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,iu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ne extends un{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=eu,this.fragmentShader=iu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Bn(t.uniforms),this.uniformsGroups=tu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const n in this.uniforms){const a=this.uniforms[n].value;a&&a.isTexture?e.uniforms[n]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[n]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[n]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[n]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[n]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[n]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[n]={type:"m4",value:a.toArray()}:e.uniforms[n]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const i in t.uniforms){const n=t.uniforms[i];switch(this.uniforms[i]={},n.type){case"t":this.uniforms[i].value=e[n.value]||null;break;case"c":this.uniforms[i].value=new Dt().setHex(n.value);break;case"v2":this.uniforms[i].value=new wt().fromArray(n.value);break;case"v3":this.uniforms[i].value=new R().fromArray(n.value);break;case"v4":this.uniforms[i].value=new me().fromArray(n.value);break;case"m3":this.uniforms[i].value=new Nt().fromArray(n.value);break;case"m4":this.uniforms[i].value=new ie().fromArray(n.value);break;default:this.uniforms[i].value=n.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class Tc extends Ne{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class kt extends un{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Dt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Dt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ka,this.normalScale=new wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class nu extends un{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=mh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class su extends un{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class _r extends ye{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Dt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class ru extends _r{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Dt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const Kr=new ie,vl=new R,Ml=new R;class Ac{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new wt(512,512),this.mapType=je,this.map=null,this.mapPass=null,this.matrix=new ie,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new So,this._frameExtents=new wt(1,1),this._viewportCount=1,this._viewports=[new me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera;vl.setFromMatrixPosition(t.matrixWorld),e.position.copy(vl),Ml.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ml),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,i,n){Kr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),i.setFromProjectionMatrix(Kr,t.coordinateSystem,t.reversedDepth);const r=this._frameExtents,a=n?n.z/r.x:1,o=n?n.w/r.y:1,l=n?n.x/r.x:0,c=n?n.y/r.y:0;t.coordinateSystem===us||t.reversedDepth?e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(Kr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Gs=new R,Hs=new cn,fi=new R;class Rc extends ye{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ie,this.projectionMatrix=new ie,this.projectionMatrixInverse=new ie,this.coordinateSystem=xi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Gs,Hs,fi),fi.x===1&&fi.y===1&&fi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Gs,Hs,fi.set(1,1,1)).invert()}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(Gs,Hs,fi),fi.x===1&&fi.y===1&&fi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Gs,Hs,fi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Bi=new R,Sl=new wt,yl=new wt;class Qe extends Rc{constructor(t=50,e=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=$a*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Tr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return $a*2*Math.atan(Math.tan(Tr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Bi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Bi.x,Bi.y).multiplyScalar(-t/Bi.z),Bi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Bi.x,Bi.y).multiplyScalar(-t/Bi.z)}getViewSize(t,e){return this.getViewBounds(t,Sl,yl),e.subVectors(yl,Sl)}setViewOffset(t,e,i,n,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Tr*.5*this.fov)/this.zoom,i=2*e,n=this.aspect*i,r=-.5*n;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*n/l,e-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+n,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class au extends Ac{constructor(){super(new Qe(90,1,.5,500)),this.isPointLightShadow=!0}}class kn extends _r{constructor(t,e,i=0,n=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new au}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class xr extends Rc{constructor(t=-1,e=1,i=1,n=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=n,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,n,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let r=i-t,a=i+t,o=n+e,l=n-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class ou extends Ac{constructor(){super(new xr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class $r extends _r{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.target=new ye,this.shadow=new ou}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}class lu extends _r{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}const Cn=-90,Pn=1;class cu extends ye{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new Qe(Cn,Pn,t,e);n.layers=this.layers,this.add(n);const r=new Qe(Cn,Pn,t,e);r.layers=this.layers,this.add(r);const a=new Qe(Cn,Pn,t,e);a.layers=this.layers,this.add(a);const o=new Qe(Cn,Pn,t,e);o.layers=this.layers,this.add(o);const l=new Qe(Cn,Pn,t,e);l.layers=this.layers,this.add(l);const c=new Qe(Cn,Pn,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,n,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===xi)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===us)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,p=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const S=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(i,0,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(i,1,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,2,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,3,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(i,4,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),i.texture.generateMipmaps=S,t.setRenderTarget(i,5,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(p,u,d),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class hu extends Qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class uu{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=du.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function du(){this._document.hidden===!1&&this.reset()}const bl=new ie;class fu{constructor(t,e,i=0,n=1/0){this.ray=new pr(t,e),this.near=i,this.far=n,this.camera=null,this.layers=new vo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Yt("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return bl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(bl),this}intersectObject(t,e=!0,i=[]){return Qa(t,this,i,e),i.sort(wl),i}intersectObjects(t,e=!0,i=[]){for(let n=0,r=t.length;n<r;n++)Qa(t[n],this,i,e);return i.sort(wl),i}}function wl(s,t){return s.distance-t.distance}function Qa(s,t,e,i){let n=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(n=!1),n===!0&&i===!0){const r=s.children;for(let a=0,o=r.length;a<o;a++)Qa(r[a],t,e,!0)}}const Uo=class Uo{constructor(t,e,i,n){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,i,n)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let i=0;i<4;i++)this.elements[i]=t[i+e];return this}set(t,e,i,n){const r=this.elements;return r[0]=t,r[2]=e,r[1]=i,r[3]=n,this}};Uo.prototype.isMatrix2=!0;let El=Uo;function Tl(s,t,e,i){const n=pu(i);switch(e){case fc:return s*t;case uo:return s*t/n.components*n.byteLength;case fo:return s*t/n.components*n.byteLength;case on:return s*t*2/n.components*n.byteLength;case po:return s*t*2/n.components*n.byteLength;case pc:return s*t*3/n.components*n.byteLength;case hi:return s*t*4/n.components*n.byteLength;case mo:return s*t*4/n.components*n.byteLength;case Qs:case js:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case tr:case er:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ma:case ya:return Math.max(s,16)*Math.max(t,8)/4;case va:case Sa:return Math.max(s,8)*Math.max(t,8)/2;case ba:case wa:case Ta:case Aa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Ea:case sr:case Ra:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ca:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Pa:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case La:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Da:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case Ia:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Ua:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Na:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case Fa:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Oa:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case za:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Ba:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case ka:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Ga:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case Ha:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case Va:case Wa:case Xa:return Math.ceil(s/4)*Math.ceil(t/4)*16;case qa:case Ya:return Math.ceil(s/4)*Math.ceil(t/4)*8;case rr:case Za:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function pu(s){switch(s){case je:case cc:return{byteLength:1,components:1};case cs:case hc:case Ke:return{byteLength:2,components:1};case co:case ho:return{byteLength:2,components:4};case yi:case lo:case ci:return{byteLength:4,components:1};case uc:case dc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:eo}}));typeof window<"u"&&(window.__THREE__?It("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=eo);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Cc(){let s=null,t=!1,e=null,i=null;function n(r,a){i=s.requestAnimationFrame(n),e(r,a)}return{start:function(){t!==!0&&e!==null&&s!==null&&(i=s.requestAnimationFrame(n),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function mu(s){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,p=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=s.SHORT;else if(c instanceof Uint32Array)d=s.UNSIGNED_INT;else if(c instanceof Int32Array)d=s.INT;else if(c instanceof Int8Array)d=s.BYTE;else if(c instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:p}}function i(o,l,c){const h=l.array,p=l.updateRanges;if(s.bindBuffer(c,o),p.length===0)s.bufferSubData(c,0,h);else{p.sort((d,g)=>d.start-g.start);let u=0;for(let d=1;d<p.length;d++){const g=p[u],S=p[d];S.start<=g.start+g.count+1?g.count=Math.max(g.count,S.start+S.count-g.start):(++u,p[u]=S)}p.length=u+1;for(let d=0,g=p.length;d<g;d++){const S=p[d];s.bufferSubData(c,S.start*h.BYTES_PER_ELEMENT,h,S.start,S.count)}l.clearUpdateRanges()}l.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(s.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:n,remove:r,update:a}}var gu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_u=`#ifdef USE_ALPHAHASH
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
#endif`,xu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Mu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Su=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,yu=`#ifdef USE_AOMAP
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
#endif`,bu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,wu=`#ifdef USE_BATCHING
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
#endif`,Eu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Tu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Au=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ru=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Cu=`#ifdef USE_IRIDESCENCE
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
#endif`,Pu=`#ifdef USE_BUMPMAP
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
#endif`,Lu=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Du=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Iu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Uu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Nu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Fu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Ou=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,zu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Bu=`#define PI 3.141592653589793
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
} // validated`,ku=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Gu=`vec3 transformedNormal = objectNormal;
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
#endif`,Hu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Vu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Wu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Xu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,qu="gl_FragColor = linearToOutputTexel( gl_FragColor );",Yu=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Zu=`#ifdef USE_ENVMAP
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
#endif`,Ku=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,$u=`#ifdef USE_ENVMAP
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
#endif`,Ju=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Qu=`#ifdef USE_ENVMAP
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
#endif`,ju=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,td=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ed=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,id=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,nd=`#ifdef USE_GRADIENTMAP
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
}`,sd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,rd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ad=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,od=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,ld=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
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
				#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,cd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,hd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ud=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,dd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,fd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
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
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
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
#endif`,pd=`uniform sampler2D dfgLUT;
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
		float roughness = material.clearcoatRoughness;
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
	float roughness = material.roughness;
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
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
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
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
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
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
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
}`,md=`
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
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,gd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
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
#endif`,_d=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,xd=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
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
#endif`,vd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Md=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,bd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ed=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Td=`#if defined( USE_POINTS_UV )
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
#endif`,Ad=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Rd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Cd=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Pd=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ld=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dd=`#ifdef USE_MORPHTARGETS
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
#endif`,Id=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ud=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Nd=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Fd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Od=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Bd=`#ifdef USE_NORMALMAP
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
#endif`,kd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Gd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Hd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Vd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Wd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Xd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,qd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Yd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Zd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Kd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,$d=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Jd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Qd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
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
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
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
#endif`,jd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,tf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ef=`float getShadowMask() {
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
}`,nf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,sf=`#ifdef USE_SKINNING
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
#endif`,rf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,af=`#ifdef USE_SKINNING
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
#endif`,of=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,lf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,cf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,hf=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,uf=`#ifdef USE_TRANSMISSION
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
#endif`,df=`#ifdef USE_TRANSMISSION
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
#endif`,ff=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,pf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const _f=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,xf=`uniform sampler2D t2D;
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
}`,vf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Mf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bf=`#include <common>
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
}`,wf=`#if DEPTH_PACKING == 3200
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
}`,Ef=`#define DISTANCE
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
}`,Tf=`#define DISTANCE
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
}`,Af=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Rf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cf=`uniform float scale;
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
}`,Pf=`uniform vec3 diffuse;
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
}`,Lf=`#include <common>
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
}`,Df=`uniform vec3 diffuse;
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
}`,If=`#define LAMBERT
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
}`,Uf=`#define LAMBERT
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
#include <cube_uv_reflection_fragment>
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
}`,Nf=`#define MATCAP
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
}`,Ff=`#define MATCAP
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
}`,Of=`#define NORMAL
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
}`,zf=`#define NORMAL
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
}`,Bf=`#define PHONG
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
}`,kf=`#define PHONG
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
#include <cube_uv_reflection_fragment>
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
}`,Gf=`#define STANDARD
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
}`,Hf=`#define STANDARD
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
#include <cube_uv_reflection_fragment>
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
}`,Vf=`#define TOON
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
}`,Wf=`#define TOON
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
}`,Xf=`uniform float size;
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
}`,qf=`uniform vec3 diffuse;
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
}`,Yf=`#include <common>
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
}`,Zf=`uniform vec3 color;
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
}`,Kf=`uniform float rotation;
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
}`,$f=`uniform vec3 diffuse;
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
}`,zt={alphahash_fragment:gu,alphahash_pars_fragment:_u,alphamap_fragment:xu,alphamap_pars_fragment:vu,alphatest_fragment:Mu,alphatest_pars_fragment:Su,aomap_fragment:yu,aomap_pars_fragment:bu,batching_pars_vertex:wu,batching_vertex:Eu,begin_vertex:Tu,beginnormal_vertex:Au,bsdfs:Ru,iridescence_fragment:Cu,bumpmap_pars_fragment:Pu,clipping_planes_fragment:Lu,clipping_planes_pars_fragment:Du,clipping_planes_pars_vertex:Iu,clipping_planes_vertex:Uu,color_fragment:Nu,color_pars_fragment:Fu,color_pars_vertex:Ou,color_vertex:zu,common:Bu,cube_uv_reflection_fragment:ku,defaultnormal_vertex:Gu,displacementmap_pars_vertex:Hu,displacementmap_vertex:Vu,emissivemap_fragment:Wu,emissivemap_pars_fragment:Xu,colorspace_fragment:qu,colorspace_pars_fragment:Yu,envmap_fragment:Zu,envmap_common_pars_fragment:Ku,envmap_pars_fragment:$u,envmap_pars_vertex:Ju,envmap_physical_pars_fragment:ld,envmap_vertex:Qu,fog_vertex:ju,fog_pars_vertex:td,fog_fragment:ed,fog_pars_fragment:id,gradientmap_pars_fragment:nd,lightmap_pars_fragment:sd,lights_lambert_fragment:rd,lights_lambert_pars_fragment:ad,lights_pars_begin:od,lights_toon_fragment:cd,lights_toon_pars_fragment:hd,lights_phong_fragment:ud,lights_phong_pars_fragment:dd,lights_physical_fragment:fd,lights_physical_pars_fragment:pd,lights_fragment_begin:md,lights_fragment_maps:gd,lights_fragment_end:_d,lightprobes_pars_fragment:xd,logdepthbuf_fragment:vd,logdepthbuf_pars_fragment:Md,logdepthbuf_pars_vertex:Sd,logdepthbuf_vertex:yd,map_fragment:bd,map_pars_fragment:wd,map_particle_fragment:Ed,map_particle_pars_fragment:Td,metalnessmap_fragment:Ad,metalnessmap_pars_fragment:Rd,morphinstance_vertex:Cd,morphcolor_vertex:Pd,morphnormal_vertex:Ld,morphtarget_pars_vertex:Dd,morphtarget_vertex:Id,normal_fragment_begin:Ud,normal_fragment_maps:Nd,normal_pars_fragment:Fd,normal_pars_vertex:Od,normal_vertex:zd,normalmap_pars_fragment:Bd,clearcoat_normal_fragment_begin:kd,clearcoat_normal_fragment_maps:Gd,clearcoat_pars_fragment:Hd,iridescence_pars_fragment:Vd,opaque_fragment:Wd,packing:Xd,premultiplied_alpha_fragment:qd,project_vertex:Yd,dithering_fragment:Zd,dithering_pars_fragment:Kd,roughnessmap_fragment:$d,roughnessmap_pars_fragment:Jd,shadowmap_pars_fragment:Qd,shadowmap_pars_vertex:jd,shadowmap_vertex:tf,shadowmask_pars_fragment:ef,skinbase_vertex:nf,skinning_pars_vertex:sf,skinning_vertex:rf,skinnormal_vertex:af,specularmap_fragment:of,specularmap_pars_fragment:lf,tonemapping_fragment:cf,tonemapping_pars_fragment:hf,transmission_fragment:uf,transmission_pars_fragment:df,uv_pars_fragment:ff,uv_pars_vertex:pf,uv_vertex:mf,worldpos_vertex:gf,background_vert:_f,background_frag:xf,backgroundCube_vert:vf,backgroundCube_frag:Mf,cube_vert:Sf,cube_frag:yf,depth_vert:bf,depth_frag:wf,distance_vert:Ef,distance_frag:Tf,equirect_vert:Af,equirect_frag:Rf,linedashed_vert:Cf,linedashed_frag:Pf,meshbasic_vert:Lf,meshbasic_frag:Df,meshlambert_vert:If,meshlambert_frag:Uf,meshmatcap_vert:Nf,meshmatcap_frag:Ff,meshnormal_vert:Of,meshnormal_frag:zf,meshphong_vert:Bf,meshphong_frag:kf,meshphysical_vert:Gf,meshphysical_frag:Hf,meshtoon_vert:Vf,meshtoon_frag:Wf,points_vert:Xf,points_frag:qf,shadow_vert:Yf,shadow_frag:Zf,sprite_vert:Kf,sprite_frag:$f},ut={common:{diffuse:{value:new Dt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Nt}},envmap:{envMap:{value:null},envMapRotation:{value:new Nt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Nt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Nt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Nt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Nt},normalScale:{value:new wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Nt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Nt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Nt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Nt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Dt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new R},probesMax:{value:new R},probesResolution:{value:new R}},points:{diffuse:{value:new Dt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0},uvTransform:{value:new Nt}},sprite:{diffuse:{value:new Dt(16777215)},opacity:{value:1},center:{value:new wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}}},gi={basic:{uniforms:We([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.fog]),vertexShader:zt.meshbasic_vert,fragmentShader:zt.meshbasic_frag},lambert:{uniforms:We([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,ut.lights,{emissive:{value:new Dt(0)},envMapIntensity:{value:1}}]),vertexShader:zt.meshlambert_vert,fragmentShader:zt.meshlambert_frag},phong:{uniforms:We([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,ut.lights,{emissive:{value:new Dt(0)},specular:{value:new Dt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:zt.meshphong_vert,fragmentShader:zt.meshphong_frag},standard:{uniforms:We([ut.common,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.roughnessmap,ut.metalnessmap,ut.fog,ut.lights,{emissive:{value:new Dt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag},toon:{uniforms:We([ut.common,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.gradientmap,ut.fog,ut.lights,{emissive:{value:new Dt(0)}}]),vertexShader:zt.meshtoon_vert,fragmentShader:zt.meshtoon_frag},matcap:{uniforms:We([ut.common,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,{matcap:{value:null}}]),vertexShader:zt.meshmatcap_vert,fragmentShader:zt.meshmatcap_frag},points:{uniforms:We([ut.points,ut.fog]),vertexShader:zt.points_vert,fragmentShader:zt.points_frag},dashed:{uniforms:We([ut.common,ut.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:zt.linedashed_vert,fragmentShader:zt.linedashed_frag},depth:{uniforms:We([ut.common,ut.displacementmap]),vertexShader:zt.depth_vert,fragmentShader:zt.depth_frag},normal:{uniforms:We([ut.common,ut.bumpmap,ut.normalmap,ut.displacementmap,{opacity:{value:1}}]),vertexShader:zt.meshnormal_vert,fragmentShader:zt.meshnormal_frag},sprite:{uniforms:We([ut.sprite,ut.fog]),vertexShader:zt.sprite_vert,fragmentShader:zt.sprite_frag},background:{uniforms:{uvTransform:{value:new Nt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:zt.background_vert,fragmentShader:zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Nt}},vertexShader:zt.backgroundCube_vert,fragmentShader:zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:zt.cube_vert,fragmentShader:zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:zt.equirect_vert,fragmentShader:zt.equirect_frag},distance:{uniforms:We([ut.common,ut.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:zt.distance_vert,fragmentShader:zt.distance_frag},shadow:{uniforms:We([ut.lights,ut.fog,{color:{value:new Dt(0)},opacity:{value:1}}]),vertexShader:zt.shadow_vert,fragmentShader:zt.shadow_frag}};gi.physical={uniforms:We([gi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Nt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Nt},clearcoatNormalScale:{value:new wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Nt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Nt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Nt},sheen:{value:0},sheenColor:{value:new Dt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Nt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Nt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Nt},transmissionSamplerSize:{value:new wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Nt},attenuationDistance:{value:0},attenuationColor:{value:new Dt(0)},specularColor:{value:new Dt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Nt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Nt},anisotropyVector:{value:new wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Nt}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag};const Vs={r:0,b:0,g:0},Jf=new ie,Pc=new Nt;Pc.set(-1,0,0,0,1,0,0,0,1);function Qf(s,t,e,i,n,r){const a=new Dt(0);let o=n===!0?0:1,l,c,h=null,p=0,u=null;function d(y){let A=y.isScene===!0?y.background:null;if(A&&A.isTexture){const M=y.backgroundBlurriness>0;A=t.get(A,M)}return A}function g(y){let A=!1;const M=d(y);M===null?m(a,o):M&&M.isColor&&(m(M,1),A=!0);const b=s.xr.getEnvironmentBlendMode();b==="additive"?e.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||A)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function S(y,A){const M=d(A);M&&(M.isCubeTexture||M.mapping===fr)?(c===void 0&&(c=new tt(new Pt(1,1,1),new Ne({name:"BackgroundCubeMaterial",uniforms:Bn(gi.backgroundCube.uniforms),vertexShader:gi.backgroundCube.vertexShader,fragmentShader:gi.backgroundCube.fragmentShader,side:Xe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,E,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Jf.makeRotationFromEuler(A.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Pc),c.material.toneMapped=Wt.getTransfer(M.colorSpace)!==te,(h!==M||p!==M.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=M,p=M.version,u=s.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new tt(new Ze(2,2),new Ne({name:"BackgroundMaterial",uniforms:Bn(gi.background.uniforms),vertexShader:gi.background.vertexShader,fragmentShader:gi.background.fragmentShader,side:rn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=Wt.getTransfer(M.colorSpace)!==te,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||p!==M.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=M,p=M.version,u=s.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function m(y,A){y.getRGB(Vs,Ec(s)),e.buffers.color.setClear(Vs.r,Vs.g,Vs.b,A,r)}function f(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,A=1){a.set(y),o=A,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,m(a,o)},render:g,addToRenderList:S,dispose:f}}function jf(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},n=u(null);let r=n,a=!1;function o(I,F,G,N,k){let K=!1;const W=p(I,N,G,F);r!==W&&(r=W,c(r.object)),K=d(I,N,G,k),K&&g(I,N,G,k),k!==null&&t.update(k,s.ELEMENT_ARRAY_BUFFER),(K||a)&&(a=!1,M(I,F,G,N),k!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function l(){return s.createVertexArray()}function c(I){return s.bindVertexArray(I)}function h(I){return s.deleteVertexArray(I)}function p(I,F,G,N){const k=N.wireframe===!0;let K=i[F.id];K===void 0&&(K={},i[F.id]=K);const W=I.isInstancedMesh===!0?I.id:0;let nt=K[W];nt===void 0&&(nt={},K[W]=nt);let q=nt[G.id];q===void 0&&(q={},nt[G.id]=q);let j=q[k];return j===void 0&&(j=u(l()),q[k]=j),j}function u(I){const F=[],G=[],N=[];for(let k=0;k<e;k++)F[k]=0,G[k]=0,N[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:G,attributeDivisors:N,object:I,attributes:{},index:null}}function d(I,F,G,N){const k=r.attributes,K=F.attributes;let W=0;const nt=G.getAttributes();for(const q in nt)if(nt[q].location>=0){const it=k[q];let Ct=K[q];if(Ct===void 0&&(q==="instanceMatrix"&&I.instanceMatrix&&(Ct=I.instanceMatrix),q==="instanceColor"&&I.instanceColor&&(Ct=I.instanceColor)),it===void 0||it.attribute!==Ct||Ct&&it.data!==Ct.data)return!0;W++}return r.attributesNum!==W||r.index!==N}function g(I,F,G,N){const k={},K=F.attributes;let W=0;const nt=G.getAttributes();for(const q in nt)if(nt[q].location>=0){let it=K[q];it===void 0&&(q==="instanceMatrix"&&I.instanceMatrix&&(it=I.instanceMatrix),q==="instanceColor"&&I.instanceColor&&(it=I.instanceColor));const Ct={};Ct.attribute=it,it&&it.data&&(Ct.data=it.data),k[q]=Ct,W++}r.attributes=k,r.attributesNum=W,r.index=N}function S(){const I=r.newAttributes;for(let F=0,G=I.length;F<G;F++)I[F]=0}function m(I){f(I,0)}function f(I,F){const G=r.newAttributes,N=r.enabledAttributes,k=r.attributeDivisors;G[I]=1,N[I]===0&&(s.enableVertexAttribArray(I),N[I]=1),k[I]!==F&&(s.vertexAttribDivisor(I,F),k[I]=F)}function y(){const I=r.newAttributes,F=r.enabledAttributes;for(let G=0,N=F.length;G<N;G++)F[G]!==I[G]&&(s.disableVertexAttribArray(G),F[G]=0)}function A(I,F,G,N,k,K,W){W===!0?s.vertexAttribIPointer(I,F,G,k,K):s.vertexAttribPointer(I,F,G,N,k,K)}function M(I,F,G,N){S();const k=N.attributes,K=G.getAttributes(),W=F.defaultAttributeValues;for(const nt in K){const q=K[nt];if(q.location>=0){let j=k[nt];if(j===void 0&&(nt==="instanceMatrix"&&I.instanceMatrix&&(j=I.instanceMatrix),nt==="instanceColor"&&I.instanceColor&&(j=I.instanceColor)),j!==void 0){const it=j.normalized,Ct=j.itemSize,At=t.get(j);if(At===void 0)continue;const le=At.buffer,qt=At.type,Jt=At.bytesPerElement,Y=qt===s.INT||qt===s.UNSIGNED_INT||j.gpuType===lo;if(j.isInterleavedBufferAttribute){const Q=j.data,vt=Q.stride,Ut=j.offset;if(Q.isInstancedInterleavedBuffer){for(let gt=0;gt<q.locationSize;gt++)f(q.location+gt,Q.meshPerAttribute);I.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let gt=0;gt<q.locationSize;gt++)m(q.location+gt);s.bindBuffer(s.ARRAY_BUFFER,le);for(let gt=0;gt<q.locationSize;gt++)A(q.location+gt,Ct/q.locationSize,qt,it,vt*Jt,(Ut+Ct/q.locationSize*gt)*Jt,Y)}else{if(j.isInstancedBufferAttribute){for(let Q=0;Q<q.locationSize;Q++)f(q.location+Q,j.meshPerAttribute);I.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let Q=0;Q<q.locationSize;Q++)m(q.location+Q);s.bindBuffer(s.ARRAY_BUFFER,le);for(let Q=0;Q<q.locationSize;Q++)A(q.location+Q,Ct/q.locationSize,qt,it,Ct*Jt,Ct/q.locationSize*Q*Jt,Y)}}else if(W!==void 0){const it=W[nt];if(it!==void 0)switch(it.length){case 2:s.vertexAttrib2fv(q.location,it);break;case 3:s.vertexAttrib3fv(q.location,it);break;case 4:s.vertexAttrib4fv(q.location,it);break;default:s.vertexAttrib1fv(q.location,it)}}}}y()}function b(){w();for(const I in i){const F=i[I];for(const G in F){const N=F[G];for(const k in N){const K=N[k];for(const W in K)h(K[W].object),delete K[W];delete N[k]}}delete i[I]}}function E(I){if(i[I.id]===void 0)return;const F=i[I.id];for(const G in F){const N=F[G];for(const k in N){const K=N[k];for(const W in K)h(K[W].object),delete K[W];delete N[k]}}delete i[I.id]}function C(I){for(const F in i){const G=i[F];for(const N in G){const k=G[N];if(k[I.id]===void 0)continue;const K=k[I.id];for(const W in K)h(K[W].object),delete K[W];delete k[I.id]}}}function x(I){for(const F in i){const G=i[F],N=I.isInstancedMesh===!0?I.id:0,k=G[N];if(k!==void 0){for(const K in k){const W=k[K];for(const nt in W)h(W[nt].object),delete W[nt];delete k[K]}delete G[N],Object.keys(G).length===0&&delete i[F]}}}function w(){P(),a=!0,r!==n&&(r=n,c(r.object))}function P(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:w,resetDefaultState:P,dispose:b,releaseStatesOfGeometry:E,releaseStatesOfObject:x,releaseStatesOfProgram:C,initAttributes:S,enableAttribute:m,disableUnusedAttributes:y}}function tp(s,t,e){let i;function n(l){i=l}function r(l,c){s.drawArrays(i,l,c),e.update(c,i,1)}function a(l,c,h){h!==0&&(s.drawArraysInstanced(i,l,c,h),e.update(c,i,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];e.update(u,i,1)}this.setMode=n,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function ep(s,t,e,i){let n;function r(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(C){return!(C!==hi&&i.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const x=C===Ke&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==je&&C!==ci&&!x&&i.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(It("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const p=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&It("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),f=s.getParameter(s.MAX_VERTEX_ATTRIBS),y=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),A=s.getParameter(s.MAX_VARYING_VECTORS),M=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),b=s.getParameter(s.MAX_SAMPLES),E=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:p,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:g,maxTextureSize:S,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:y,maxVaryings:A,maxFragmentUniforms:M,maxSamples:b,samples:E}}function ip(s){const t=this;let e=null,i=0,n=!1,r=!1;const a=new Hi,o=new Nt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(p,u){const d=p.length!==0||u||i!==0||n;return n=u,i=p.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(p,u){e=h(p,u,0)},this.setState=function(p,u,d){const g=p.clippingPlanes,S=p.clipIntersection,m=p.clipShadows,f=s.get(p);if(!n||g===null||g.length===0||r&&!m)r?h(null):c();else{const y=r?0:i,A=y*4;let M=f.clippingState||null;l.value=M,M=h(g,u,A,d);for(let b=0;b!==A;++b)M[b]=e[b];f.clippingState=M,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(p,u,d,g){const S=p!==null?p.length:0;let m=null;if(S!==0){if(m=l.value,g!==!0||m===null){const f=d+S*4,y=u.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<f)&&(m=new Float32Array(f));for(let A=0,M=d;A!==S;++A,M+=4)a.copy(p[A]).applyMatrix4(y,o),a.normal.toArray(m,M),m[M+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=S,t.numIntersection=0,m}}const Un=4,np=6,sp=20,rp=256,es=new xr,Al=new Dt;let Jr=null,Qr=0,jr=0,ta=!1;const ap=new R,ji=new R;class Rl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,i=.1,n=100,r={}){const{size:a=256,position:o=ap}=r;Jr=this._renderer.getRenderTarget(),Qr=this._renderer.getActiveCubeFace(),jr=this._renderer.getActiveMipmapLevel(),ta=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,n,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ll(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Pl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Jr,Qr,jr),this._renderer.xr.enabled=ta,t.scissorTest=!1,Ln(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===an||t.mapping===On?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Jr=this._renderer.getRenderTarget(),Qr=this._renderer.getActiveCubeFace(),jr=this._renderer.getActiveMipmapLevel(),ta=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:ke,minFilter:ke,generateMipmaps:!1,type:Ke,format:hi,colorSpace:ar,depthBuffer:!1},n=Cl(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Cl(t,e,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=op(r)),this._blurMaterial=cp(r,t,e),this._ggxMaterial=lp(r,t,e)}return n}_compileMaterial(t){const e=new tt(new ge,t);this._renderer.compile(e,es)}_sceneToCubeUV(t,e,i,n,r){const l=new Qe(90,1,e,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],p=this._renderer,u=p.autoClear,d=p.toneMapping;p.getClearColor(Al),p.toneMapping=Mi,p.autoClear=!1,p.state.buffers.depth.getReversed()&&(p.setRenderTarget(n),p.clearDepth(),p.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new tt(new Pt,new Ee({name:"PMREM.Background",side:Xe,depthWrite:!1,depthTest:!1})));const S=this._backgroundBox,m=S.material;let f=!1;const y=t.background;y?y.isColor&&(m.color.copy(y),t.background=null,f=!0):(m.color.copy(Al),f=!0);for(let A=0;A<6;A++){const M=A%3;M===0?(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[A],r.y,r.z)):M===1?(l.up.set(0,0,c[A]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[A],r.z)):(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[A]));const b=this._cubeSize;Ln(n,M*b,A>2?b:0,b,b),p.setRenderTarget(n),f&&p.render(S,l),p.render(t,l)}p.toneMapping=d,p.autoClear=u,t.background=y}_textureToCubeUV(t,e){const i=this._renderer,n=t.mapping===an||t.mapping===On;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ll()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Pl());const r=n?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;Ln(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(a,es)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const n=this._lodMeshes.length;for(let r=1;r<n;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=i}_applyGGXFilter(t,e,i){const n=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),p=Math.sqrt(c*c-h*h),u=c*1.25,d=p*u,{_lodMax:g}=this,S=this._sizeLods[i],m=3*S*(i>g-Un?i-g+Un:0),f=4*(this._cubeSize-S);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=g-e,Ln(r,m,f,3*S,2*S),n.setRenderTarget(r),n.render(o,es),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-i,Ln(t,m,f,3*S,2*S),n.setRenderTarget(t),n.render(o,es)}_blur(t,e,i,n){const r=this._pingPongRenderTarget,a=Math.min(n,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,i,a),this._blurPass(r,t,i,i,a)}_blurPass(t,e,i,n,r){const a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[n];l.material=o;const c=o.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-i;const h=this._sizeLods[n],p=3*h*(n>this._lodMax-Un?n-this._lodMax+Un:0),u=4*(this._cubeSize-h);Ln(e,p,u,3*h,2*h),a.setRenderTarget(e),a.render(l,es)}}function op(s){const t=[],e=[];let i=s;const n=s-Un+1+np;for(let r=0;r<n;r++){const a=Math.pow(2,i);t.push(a);const o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],p=6,u=6,d=3,g=new Float32Array(d*u*p),S=new Float32Array(d*u*p);for(let f=0;f<p;f++){const y=f%3*2/3-1,A=f>2?0:-1,M=[y,A,0,y+2/3,A,0,y+2/3,A+1,0,y,A,0,y+2/3,A+1,0,y,A+1,0];g.set(M,d*u*f);for(let b=0;b<u;b++){const E=h[b*2]*2-1,C=h[b*2+1]*2-1;f===0?ji.set(1,C,E):f===1?ji.set(-E,1,-C):f===2?ji.set(-E,C,1):f===3?ji.set(-1,C,-E):f===4?ji.set(-E,-1,C):ji.set(E,C,-1),ji.toArray(S,(f*u+b)*d)}}const m=new ge;m.setAttribute("position",new Te(g,d)),m.setAttribute("outputDirection",new Te(S,d)),e.push(new tt(m,null)),i>Un&&i--}return{lodMeshes:e,sizeLods:t}}function Cl(s,t,e){const i=new qe(s,t,e);return i.texture.mapping=fr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ln(s,t,e,i,n){s.viewport.set(t,e,i,n),s.scissor.set(t,e,i,n)}function lp(s,t,e){return new Ne({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:rp,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:vr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function cp(s,t,e){return new Ne({name:"SphericalGaussianBlur",defines:{SAMPLES:sp,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:vr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

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

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Pl(){return new Ne({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:vr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Ll(){return new Ne({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:vr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function vr(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class Lc extends qe{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},n=[i,i,i,i,i,i];this.texture=new bc(n),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},n=new Pt(5,5,5),r=new Ne({name:"CubemapFromEquirect",uniforms:Bn(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Xe,blending:vi});r.uniforms.tEquirect.value=e;const a=new tt(n,r),o=e.minFilter;return e.minFilter===tn&&(e.minFilter=ke),new cu(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,n=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,n);t.setRenderTarget(r)}}function hp(s){let t=new WeakMap,e=new WeakMap,i=null;function n(u,d=!1){return u==null?null:d?a(u):r(u)}function r(u){if(u&&u.isTexture){const d=u.mapping;if(d===Js||d===br)if(t.has(u)){const g=t.get(u).texture;return o(g,u.mapping)}else{const g=u.image;if(g&&g.height>0){const S=new Lc(g.height);return S.fromEquirectangularTexture(s,u),t.set(u,S),u.addEventListener("dispose",c),o(S.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const d=u.mapping,g=d===Js||d===br,S=d===an||d===On;if(g||S){let m=e.get(u);const f=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==f)return i===null&&(i=new Rl(s)),m=g?i.fromEquirectangular(u,m):i.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),m.texture;if(m!==void 0)return m.texture;{const y=u.image;return g&&y&&y.height>0||S&&y&&l(y)?(i===null&&(i=new Rl(s)),m=g?i.fromEquirectangular(u):i.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,d){return d===Js?u.mapping=an:d===br&&(u.mapping=On),u}function l(u){let d=0;const g=6;for(let S=0;S<g;S++)u[S]!==void 0&&d++;return d===g}function c(u){const d=u.target;d.removeEventListener("dispose",c);const g=t.get(d);g!==void 0&&(t.delete(d),g.dispose())}function h(u){const d=u.target;d.removeEventListener("dispose",h);const g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function p(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:n,dispose:p}}function up(s){const t={};function e(i){if(t[i]!==void 0)return t[i];const n=s.getExtension(i);return t[i]=n,n}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const n=e(i);return n===null&&Nn("WebGLRenderer: "+i+" extension not supported."),n}}}function dp(s,t,e,i){const n={},r=new WeakMap;function a(p){const u=p.target;u.index!==null&&t.remove(u.index);for(const g in u.attributes)t.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete n[u.id];const d=r.get(u);d&&(t.remove(d),r.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(p,u){return n[u.id]===!0||(u.addEventListener("dispose",a),n[u.id]=!0,e.memory.geometries++),u}function l(p){const u=p.attributes;for(const d in u)t.update(u[d],s.ARRAY_BUFFER)}function c(p){const u=[],d=p.index,g=p.attributes.position;let S=0;if(g===void 0)return;if(d!==null){const y=d.array;S=d.version;for(let A=0,M=y.length;A<M;A+=3){const b=y[A+0],E=y[A+1],C=y[A+2];u.push(b,E,E,C,C,b)}}else{const y=g.array;S=g.version;for(let A=0,M=y.length/3-1;A<M;A+=3){const b=A+0,E=A+1,C=A+2;u.push(b,E,E,C,C,b)}}const m=new(g.count>=65535?Mc:vc)(u,1);m.version=S;const f=r.get(p);f&&t.remove(f),r.set(p,m)}function h(p){const u=r.get(p);if(u){const d=p.index;d!==null&&u.version<d.version&&c(p)}else c(p);return r.get(p)}return{get:o,update:l,getWireframeAttribute:h}}function fp(s,t,e){let i;function n(p){i=p}let r,a;function o(p){r=p.type,a=p.bytesPerElement}function l(p,u){s.drawElements(i,u,r,p*a),e.update(u,i,1)}function c(p,u,d){d!==0&&(s.drawElementsInstanced(i,u,r,p*a,d),e.update(u,i,d))}function h(p,u,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,r,p,0,d);let S=0;for(let m=0;m<d;m++)S+=u[m];e.update(S,i,1)}this.setMode=n,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function pp(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:Yt("WebGLInfo: Unknown draw mode:",a);break}}function n(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:n,update:i}}function mp(s,t,e){const i=new WeakMap,n=new me;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=h!==void 0?h.length:0;let u=i.get(o);if(u===void 0||u.count!==p){let P=function(){x.dispose(),i.delete(o),o.removeEventListener("dispose",P)};var d=P;u!==void 0&&u.texture.dispose();const g=o.morphAttributes.position!==void 0,S=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],A=o.morphAttributes.color||[];let M=0;g===!0&&(M=1),S===!0&&(M=2),m===!0&&(M=3);let b=o.attributes.position.count*M,E=1;b>t.maxTextureSize&&(E=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);const C=new Float32Array(b*E*4*p),x=new _c(C,b,E,p);x.type=ci,x.needsUpdate=!0;const w=M*4;for(let I=0;I<p;I++){const F=f[I],G=y[I],N=A[I],k=b*E*4*I;for(let K=0;K<F.count;K++){const W=K*w;g===!0&&(n.fromBufferAttribute(F,K),C[k+W+0]=n.x,C[k+W+1]=n.y,C[k+W+2]=n.z,C[k+W+3]=0),S===!0&&(n.fromBufferAttribute(G,K),C[k+W+4]=n.x,C[k+W+5]=n.y,C[k+W+6]=n.z,C[k+W+7]=0),m===!0&&(n.fromBufferAttribute(N,K),C[k+W+8]=n.x,C[k+W+9]=n.y,C[k+W+10]=n.z,C[k+W+11]=N.itemSize===4?n.w:1)}}u={count:p,texture:x,size:new wt(b,E)},i.set(o,u),o.addEventListener("dispose",P)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const S=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(s,"morphTargetBaseInfluence",S),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function gp(s,t,e,i,n){let r=new WeakMap;function a(c){const h=n.render.frame,p=c.geometry,u=t.get(c,p);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return u}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}const _p={[io]:"LINEAR_TONE_MAPPING",[no]:"REINHARD_TONE_MAPPING",[so]:"CINEON_TONE_MAPPING",[dr]:"ACES_FILMIC_TONE_MAPPING",[ao]:"AGX_TONE_MAPPING",[oo]:"NEUTRAL_TONE_MAPPING",[ro]:"CUSTOM_TONE_MAPPING"};function xp(s,t,e,i,n,r){const a=new qe(t,e,{type:s,depthBuffer:n,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null;const c=new ge;c.setAttribute("position",new $t([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new $t([0,2,0,0,2,0],2));const h=new Tc({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),p=new tt(c,h),u=new xr(-1,1,1,-1,0,1);let d=null,g=null,S=!1,m,f=null,y=[],A=!1;this.setSize=function(M,b){a.setSize(M,b),o!==null&&o.setSize(M,b),l!==null&&l.setSize(M,b);for(let E=0;E<y.length;E++){const C=y[E];C.setSize&&C.setSize(M,b)}},this.setEffects=function(M){y=M,A=y.length>0&&y[0].isRenderPass===!0;const b=a.width,E=a.height;y.length>0&&o===null&&(o=new qe(b,E,{type:Ke,depthBuffer:!1,stencilBuffer:!1}),l=new qe(b,E,{type:Ke,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<y.length;C++){const x=y[C];x.setSize&&x.setSize(b,E)}},this.begin=function(M,b){if(S||M.toneMapping===Mi&&y.length===0)return!1;if(f=b,b!==null){const E=b.width,C=b.height;(a.width!==E||a.height!==C)&&this.setSize(E,C)}return A===!1&&M.setRenderTarget(a),m=M.toneMapping,M.toneMapping=Mi,!0},this.hasRenderPass=function(){return A},this.end=function(M,b){M.toneMapping=m,S=!0;let E=a,C=o;for(let x=0;x<y.length;x++){const w=y[x];w.enabled!==!1&&(w.render(M,C,E,b),w.needsSwap!==!1&&(E=C,C=C===o?l:o))}if(d!==M.outputColorSpace||g!==M.toneMapping){d=M.outputColorSpace,g=M.toneMapping,h.defines={},Wt.getTransfer(d)===te&&(h.defines.SRGB_TRANSFER="");const x=_p[g];x&&(h.defines[x]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=E.texture,M.setRenderTarget(f),M.render(p,u),f=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}const Dc=new Ge,ja=new ds(1,1),Ic=new _c,Uc=new Uh,Nc=new bc,Dl=[],Il=[],Ul=new Float32Array(16),Nl=new Float32Array(9),Fl=new Float32Array(4);function Vn(s,t,e){const i=s[0];if(i<=0||i>0)return s;const n=t*e;let r=Dl[n];if(r===void 0&&(r=new Float32Array(n),Dl[n]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function Ae(s,t){if(s.length!==t.length)return!1;for(let e=0,i=s.length;e<i;e++)if(s[e]!==t[e])return!1;return!0}function Re(s,t){for(let e=0,i=t.length;e<i;e++)s[e]=t[e]}function Mr(s,t){let e=Il[t];e===void 0&&(e=new Int32Array(t),Il[t]=e);for(let i=0;i!==t;++i)e[i]=s.allocateTextureUnit();return e}function vp(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Mp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;s.uniform2fv(this.addr,t),Re(e,t)}}function Sp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ae(e,t))return;s.uniform3fv(this.addr,t),Re(e,t)}}function yp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;s.uniform4fv(this.addr,t),Re(e,t)}}function bp(s,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ae(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,i))return;Fl.set(i),s.uniformMatrix2fv(this.addr,!1,Fl),Re(e,i)}}function wp(s,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ae(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,i))return;Nl.set(i),s.uniformMatrix3fv(this.addr,!1,Nl),Re(e,i)}}function Ep(s,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ae(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,i))return;Ul.set(i),s.uniformMatrix4fv(this.addr,!1,Ul),Re(e,i)}}function Tp(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Ap(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;s.uniform2iv(this.addr,t),Re(e,t)}}function Rp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;s.uniform3iv(this.addr,t),Re(e,t)}}function Cp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;s.uniform4iv(this.addr,t),Re(e,t)}}function Pp(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Lp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;s.uniform2uiv(this.addr,t),Re(e,t)}}function Dp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;s.uniform3uiv(this.addr,t),Re(e,t)}}function Ip(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;s.uniform4uiv(this.addr,t),Re(e,t)}}function Up(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n);let r;this.type===s.SAMPLER_2D_SHADOW?(ja.compareFunction=e.isReversedDepthBuffer()?_o:go,r=ja):r=Dc,e.setTexture2D(t||r,n)}function Np(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTexture3D(t||Uc,n)}function Fp(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTextureCube(t||Nc,n)}function Op(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTexture2DArray(t||Ic,n)}function zp(s){switch(s){case 5126:return vp;case 35664:return Mp;case 35665:return Sp;case 35666:return yp;case 35674:return bp;case 35675:return wp;case 35676:return Ep;case 5124:case 35670:return Tp;case 35667:case 35671:return Ap;case 35668:case 35672:return Rp;case 35669:case 35673:return Cp;case 5125:return Pp;case 36294:return Lp;case 36295:return Dp;case 36296:return Ip;case 35678:case 36198:case 36298:case 36306:case 35682:return Up;case 35679:case 36299:case 36307:return Np;case 35680:case 36300:case 36308:case 36293:return Fp;case 36289:case 36303:case 36311:case 36292:return Op}}function Bp(s,t){s.uniform1fv(this.addr,t)}function kp(s,t){const e=Vn(t,this.size,2);s.uniform2fv(this.addr,e)}function Gp(s,t){const e=Vn(t,this.size,3);s.uniform3fv(this.addr,e)}function Hp(s,t){const e=Vn(t,this.size,4);s.uniform4fv(this.addr,e)}function Vp(s,t){const e=Vn(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Wp(s,t){const e=Vn(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Xp(s,t){const e=Vn(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function qp(s,t){s.uniform1iv(this.addr,t)}function Yp(s,t){s.uniform2iv(this.addr,t)}function Zp(s,t){s.uniform3iv(this.addr,t)}function Kp(s,t){s.uniform4iv(this.addr,t)}function $p(s,t){s.uniform1uiv(this.addr,t)}function Jp(s,t){s.uniform2uiv(this.addr,t)}function Qp(s,t){s.uniform3uiv(this.addr,t)}function jp(s,t){s.uniform4uiv(this.addr,t)}function tm(s,t,e){const i=this.cache,n=t.length,r=Mr(e,n);Ae(i,r)||(s.uniform1iv(this.addr,r),Re(i,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=ja:a=Dc;for(let o=0;o!==n;++o)e.setTexture2D(t[o]||a,r[o])}function em(s,t,e){const i=this.cache,n=t.length,r=Mr(e,n);Ae(i,r)||(s.uniform1iv(this.addr,r),Re(i,r));for(let a=0;a!==n;++a)e.setTexture3D(t[a]||Uc,r[a])}function im(s,t,e){const i=this.cache,n=t.length,r=Mr(e,n);Ae(i,r)||(s.uniform1iv(this.addr,r),Re(i,r));for(let a=0;a!==n;++a)e.setTextureCube(t[a]||Nc,r[a])}function nm(s,t,e){const i=this.cache,n=t.length,r=Mr(e,n);Ae(i,r)||(s.uniform1iv(this.addr,r),Re(i,r));for(let a=0;a!==n;++a)e.setTexture2DArray(t[a]||Ic,r[a])}function sm(s){switch(s){case 5126:return Bp;case 35664:return kp;case 35665:return Gp;case 35666:return Hp;case 35674:return Vp;case 35675:return Wp;case 35676:return Xp;case 5124:case 35670:return qp;case 35667:case 35671:return Yp;case 35668:case 35672:return Zp;case 35669:case 35673:return Kp;case 5125:return $p;case 36294:return Jp;case 36295:return Qp;case 36296:return jp;case 35678:case 36198:case 36298:case 36306:case 35682:return tm;case 35679:case 36299:case 36307:return em;case 35680:case 36300:case 36308:case 36293:return im;case 36289:case 36303:case 36311:case 36292:return nm}}class rm{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=zp(e.type)}}class am{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=sm(e.type)}}class om{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const n=this.seq;for(let r=0,a=n.length;r!==a;++r){const o=n[r];o.setValue(t,e[o.id],i)}}}const ea=/(\w+)(\])?(\[|\.)?/g;function Ol(s,t){s.seq.push(t),s.map[t.id]=t}function lm(s,t,e){const i=s.name,n=i.length;for(ea.lastIndex=0;;){const r=ea.exec(i),a=ea.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===n){Ol(e,c===void 0?new rm(o,s,t):new am(o,s,t));break}else{let p=e.map[o];p===void 0&&(p=new om(o),Ol(e,p)),e=p}}}class ir{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);lm(o,l,this)}const n=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?n.push(a):r.push(a);n.length>0&&(this.seq=n.concat(r))}setValue(t,e,i,n){const r=this.map[e];r!==void 0&&r.setValue(t,i,n)}setOptional(t,e,i){const n=e[i];n!==void 0&&this.setValue(t,i,n)}static upload(t,e,i,n){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,n)}}static seqWithValue(t,e){const i=[];for(let n=0,r=t.length;n!==r;++n){const a=t[n];a.id in e&&i.push(a)}return i}}function zl(s,t,e){const i=s.createShader(t);return s.shaderSource(i,e),s.compileShader(i),i}const cm=37297;let hm=0;function um(s,t){const e=s.split(`
`),i=[],n=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=n;a<r;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}const Bl=new Nt;function dm(s){Wt._getMatrix(Bl,Wt.workingColorSpace,s);const t=`mat3( ${Bl.elements.map(e=>e.toFixed(4))} )`;switch(Wt.getTransfer(s)){case or:return[t,"LinearTransferOETF"];case te:return[t,"sRGBTransferOETF"];default:return It("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function kl(s,t,e){const i=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+um(s.getShaderSource(t),o)}else return r}function fm(s,t){const e=dm(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const pm={[io]:"Linear",[no]:"Reinhard",[so]:"Cineon",[dr]:"ACESFilmic",[ao]:"AgX",[oo]:"Neutral",[ro]:"Custom"};function mm(s,t){const e=pm[t];return e===void 0?(It("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ws=new R;function gm(){Wt.getLuminanceCoefficients(Ws);const s=Ws.x.toFixed(4),t=Ws.y.toFixed(4),e=Ws.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function _m(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(rs).join(`
`)}function xm(s){const t=[];for(const e in s){const i=s[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function vm(s,t){const e={},i=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const r=s.getActiveAttrib(t,n),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function rs(s){return s!==""}function Gl(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Hl(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Mm=/^[ \t]*#include +<([\w\d./]+)>/gm;function to(s){return s.replace(Mm,ym)}const Sm=new Map;function ym(s,t){let e=zt[t];if(e===void 0){const i=Sm.get(t);if(i!==void 0)e=zt[i],It('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return to(e)}const bm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vl(s){return s.replace(bm,wm)}function wm(s,t,e,i){let n="";for(let r=parseInt(t);r<parseInt(e);r++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return n}function Wl(s){let t=`precision ${s.precision} float;
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
#define LOW_PRECISION`),t}const Em={[as]:"SHADOWMAP_TYPE_PCF",[ss]:"SHADOWMAP_TYPE_VSM"};function Tm(s){return Em[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Am={[an]:"ENVMAP_TYPE_CUBE",[On]:"ENVMAP_TYPE_CUBE",[fr]:"ENVMAP_TYPE_CUBE_UV"};function Rm(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":Am[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const Cm={[On]:"ENVMAP_MODE_REFRACTION"};function Pm(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Cm[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Lm={[oc]:"ENVMAP_BLENDING_MULTIPLY",[dh]:"ENVMAP_BLENDING_MIX",[fh]:"ENVMAP_BLENDING_ADD"};function Dm(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Lm[s.combine]||"ENVMAP_BLENDING_NONE"}function Im(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function Um(s,t,e,i){const n=s.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=Tm(e),c=Rm(e),h=Pm(e),p=Dm(e),u=Im(e),d=_m(e),g=xm(r),S=n.createProgram();let m,f,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(rs).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(rs).join(`
`),f.length>0&&(f+=`
`)):(m=[Wl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(rs).join(`
`),f=[Wl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+p:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Mi?"#define TONE_MAPPING":"",e.toneMapping!==Mi?zt.tonemapping_pars_fragment:"",e.toneMapping!==Mi?mm("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",zt.colorspace_pars_fragment,fm("linearToOutputTexel",e.outputColorSpace),gm(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(rs).join(`
`)),a=to(a),a=Gl(a,e),a=Hl(a,e),o=to(o),o=Gl(o,e),o=Hl(o,e),a=Vl(a),o=Vl(o),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===Zo?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Zo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const A=y+m+a,M=y+f+o,b=zl(n,n.VERTEX_SHADER,A),E=zl(n,n.FRAGMENT_SHADER,M);n.attachShader(S,b),n.attachShader(S,E),e.index0AttributeName!==void 0?n.bindAttribLocation(S,0,e.index0AttributeName):e.hasPositionAttribute===!0&&n.bindAttribLocation(S,0,"position"),n.linkProgram(S);function C(I){if(s.debug.checkShaderErrors){const F=n.getProgramInfoLog(S)||"",G=n.getShaderInfoLog(b)||"",N=n.getShaderInfoLog(E)||"",k=F.trim(),K=G.trim(),W=N.trim();let nt=!0,q=!0;if(n.getProgramParameter(S,n.LINK_STATUS)===!1)if(nt=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(n,S,b,E);else{const j=kl(n,b,"vertex"),it=kl(n,E,"fragment");Yt("WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(S,n.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+k+`
`+j+`
`+it)}else k!==""?It("WebGLProgram: Program Info Log:",k):(K===""||W==="")&&(q=!1);q&&(I.diagnostics={runnable:nt,programLog:k,vertexShader:{log:K,prefix:m},fragmentShader:{log:W,prefix:f}})}n.deleteShader(b),n.deleteShader(E),x=new ir(n,S),w=vm(n,S)}let x;this.getUniforms=function(){return x===void 0&&C(this),x};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let P=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=n.getProgramParameter(S,cm)),P},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(S),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=hm++,this.cacheKey=t,this.usedTimes=1,this.program=S,this.vertexShader=b,this.fragmentShader=E,this}let Nm=0;class Fm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,i){const n=this._getShaderCacheForMaterial(t);return n.has(e)===!1&&(n.add(e),e.usedTimes++),n.has(i)===!1&&(n.add(i),i.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Om(t),e.set(t,i)),i}}class Om{constructor(t){this.id=Nm++,this.code=t,this.usedTimes=0}}function zm(s){return s===on||s===sr||s===rr}function Bm(s,t,e,i,n,r){const a=new vo,o=new Fm,l=new Set,c=[],h=new Map,p=i.logarithmicDepthBuffer;let u=i.precision;const d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return l.add(x),x===0?"uv":`uv${x}`}function S(x,w,P,I,F,G){const N=I.fog,k=F.geometry,K=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?I.environment:null,W=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,nt=t.get(x.envMap||K,W),q=nt&&nt.mapping===fr?nt.image.height:null,j=d[x.type];x.precision!==null&&(u=i.getMaxPrecision(x.precision),u!==x.precision&&It("WebGLProgram.getParameters:",x.precision,"not supported, using",u,"instead."));const it=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,Ct=it!==void 0?it.length:0;let At=0;k.morphAttributes.position!==void 0&&(At=1),k.morphAttributes.normal!==void 0&&(At=2),k.morphAttributes.color!==void 0&&(At=3);let le,qt,Jt,Y;if(j){const he=gi[j];le=he.vertexShader,qt=he.fragmentShader}else{le=x.vertexShader,qt=x.fragmentShader;const he=o.getVertexShaderStage(x),Qt=o.getFragmentShaderStage(x);o.update(x,he,Qt),Jt=he.id,Y=Qt.id}const Q=s.getRenderTarget(),vt=s.state.buffers.depth.getReversed(),Ut=F.isInstancedMesh===!0,gt=F.isBatchedMesh===!0,Bt=!!x.map,be=!!x.matcap,Gt=!!nt,Kt=!!x.aoMap,ce=!!x.lightMap,Vt=!!x.bumpMap&&x.wireframe===!1,fe=!!x.normalMap,Ce=!!x.displacementMap,Ye=!!x.emissiveMap,pe=!!x.metalnessMap,ve=!!x.roughnessMap,U=x.anisotropy>0,Fe=x.clearcoat>0,ee=x.dispersion>0,T=x.retroreflectivity>0,_=x.iridescence>0,O=x.sheen>0,H=x.transmission>0,X=U&&!!x.anisotropyMap,st=Fe&&!!x.clearcoatMap,rt=Fe&&!!x.clearcoatNormalMap,Z=Fe&&!!x.clearcoatRoughnessMap,J=_&&!!x.iridescenceMap,at=_&&!!x.iridescenceThicknessMap,Et=O&&!!x.sheenColorMap,ht=O&&!!x.sheenRoughnessMap,ot=!!x.specularMap,Tt=!!x.specularColorMap,Lt=!!x.specularIntensityMap,Ft=H&&!!x.transmissionMap,D=H&&!!x.thicknessMap,lt=!!x.gradientMap,$=!!x.alphaMap,ct=x.alphaTest>0,pt=!!x.alphaHash,et=!!x.extensions;let Rt=Mi;x.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Rt=s.toneMapping);const yt={shaderID:j,shaderType:x.type,shaderName:x.name,vertexShader:le,fragmentShader:qt,defines:x.defines,customVertexShaderID:Jt,customFragmentShaderID:Y,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:u,batching:gt,batchingColor:gt&&F._colorsTexture!==null,instancing:Ut,instancingColor:Ut&&F.instanceColor!==null,instancingMorph:Ut&&F.morphTexture!==null,outputColorSpace:Q===null?s.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Wt.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Bt,matcap:be,envMap:Gt,envMapMode:Gt&&nt.mapping,envMapCubeUVHeight:q,aoMap:Kt,lightMap:ce,bumpMap:Vt,normalMap:fe,displacementMap:Ce,emissiveMap:Ye,normalMapObjectSpace:fe&&x.normalMapType===gh,normalMapTangentSpace:fe&&x.normalMapType===Ka,packedNormalMap:fe&&x.normalMapType===Ka&&zm(x.normalMap.format),metalnessMap:pe,roughnessMap:ve,anisotropy:U,anisotropyMap:X,clearcoat:Fe,clearcoatMap:st,clearcoatNormalMap:rt,clearcoatRoughnessMap:Z,dispersion:ee,retroreflection:T,iridescence:_,iridescenceMap:J,iridescenceThicknessMap:at,sheen:O,sheenColorMap:Et,sheenRoughnessMap:ht,specularMap:ot,specularColorMap:Tt,specularIntensityMap:Lt,transmission:H,transmissionMap:Ft,thicknessMap:D,gradientMap:lt,opaque:x.transparent===!1&&x.blending===nn&&x.alphaToCoverage===!1,alphaMap:$,alphaTest:ct,alphaHash:pt,combine:x.combine,mapUv:Bt&&g(x.map.channel),aoMapUv:Kt&&g(x.aoMap.channel),lightMapUv:ce&&g(x.lightMap.channel),bumpMapUv:Vt&&g(x.bumpMap.channel),normalMapUv:fe&&g(x.normalMap.channel),displacementMapUv:Ce&&g(x.displacementMap.channel),emissiveMapUv:Ye&&g(x.emissiveMap.channel),metalnessMapUv:pe&&g(x.metalnessMap.channel),roughnessMapUv:ve&&g(x.roughnessMap.channel),anisotropyMapUv:X&&g(x.anisotropyMap.channel),clearcoatMapUv:st&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:rt&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:at&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:Et&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:ht&&g(x.sheenRoughnessMap.channel),specularMapUv:ot&&g(x.specularMap.channel),specularColorMapUv:Tt&&g(x.specularColorMap.channel),specularIntensityMapUv:Lt&&g(x.specularIntensityMap.channel),transmissionMapUv:Ft&&g(x.transmissionMap.channel),thicknessMapUv:D&&g(x.thicknessMap.channel),alphaMapUv:$&&g(x.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(fe||U),vertexNormals:!!k.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!k.attributes.uv&&(Bt||$),fog:!!N,useFog:x.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||k.attributes.normal===void 0&&fe===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:vt,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:Ct,morphTextureStride:At,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:G.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:Rt,decodeVideoTexture:Bt&&x.map.isVideoTexture===!0&&Wt.getTransfer(x.map.colorSpace)===te,decodeVideoTextureEmissive:Ye&&x.emissiveMap.isVideoTexture===!0&&Wt.getTransfer(x.emissiveMap.colorSpace)===te,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===_e,flipSided:x.side===Xe,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:et&&x.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(et&&x.extensions.multiDraw===!0||gt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return yt.vertexUv1s=l.has(1),yt.vertexUv2s=l.has(2),yt.vertexUv3s=l.has(3),l.clear(),yt}function m(x){const w=[];if(x.shaderID?w.push(x.shaderID):(w.push(x.customVertexShaderID),w.push(x.customFragmentShaderID)),x.defines!==void 0)for(const P in x.defines)w.push(P),w.push(x.defines[P]);return x.isRawShaderMaterial===!1&&(f(w,x),y(w,x),w.push(s.outputColorSpace)),w.push(x.customProgramCacheKey),w.join()}function f(x,w){x.push(w.precision),x.push(w.outputColorSpace),x.push(w.envMapMode),x.push(w.envMapCubeUVHeight),x.push(w.mapUv),x.push(w.alphaMapUv),x.push(w.lightMapUv),x.push(w.aoMapUv),x.push(w.bumpMapUv),x.push(w.normalMapUv),x.push(w.displacementMapUv),x.push(w.emissiveMapUv),x.push(w.metalnessMapUv),x.push(w.roughnessMapUv),x.push(w.anisotropyMapUv),x.push(w.clearcoatMapUv),x.push(w.clearcoatNormalMapUv),x.push(w.clearcoatRoughnessMapUv),x.push(w.iridescenceMapUv),x.push(w.iridescenceThicknessMapUv),x.push(w.sheenColorMapUv),x.push(w.sheenRoughnessMapUv),x.push(w.specularMapUv),x.push(w.specularColorMapUv),x.push(w.specularIntensityMapUv),x.push(w.transmissionMapUv),x.push(w.thicknessMapUv),x.push(w.combine),x.push(w.fogExp2),x.push(w.sizeAttenuation),x.push(w.morphTargetsCount),x.push(w.morphAttributeCount),x.push(w.numSunLights),x.push(w.numDirLights),x.push(w.numPointLights),x.push(w.numSpotLights),x.push(w.numSpotLightMaps),x.push(w.numHemiLights),x.push(w.numRectAreaLights),x.push(w.numSunLightShadows),x.push(w.numDirLightShadows),x.push(w.numPointLightShadows),x.push(w.numSpotLightShadows),x.push(w.numSpotLightShadowsWithMaps),x.push(w.numLightProbes),x.push(w.shadowMapType),x.push(w.toneMapping),x.push(w.numClippingPlanes),x.push(w.numClipIntersection),x.push(w.depthPacking)}function y(x,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.retroreflection&&a.enable(24),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function A(x){const w=d[x.type];let P;if(w){const I=gi[w];P=fs.clone(I.uniforms)}else P=x.uniforms;return P}function M(x,w){let P=h.get(w);return P!==void 0?++P.usedTimes:(P=new Um(s,w,x,n),c.push(P),h.set(w,P)),P}function b(x){if(--x.usedTimes===0){const w=c.indexOf(x);c[w]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function E(x){o.remove(x)}function C(){o.dispose()}return{getParameters:S,getProgramCacheKey:m,getUniforms:A,acquireProgram:M,releaseProgram:b,releaseShaderCache:E,programs:c,dispose:C}}function km(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function i(a){s.delete(a)}function n(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:i,update:n,dispose:r}}function Gm(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function Xl(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function ql(){const s=[];let t=0;const e=[],i=[],n=[];function r(){t=0,e.length=0,i.length=0,n.length=0}function a(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function o(u,d,g,S,m,f){let y=s[t];return y===void 0?(y={id:u.id,object:u,geometry:d,material:g,materialVariant:a(u),groupOrder:S,renderOrder:u.renderOrder,z:m,group:f},s[t]=y):(y.id=u.id,y.object=u,y.geometry=d,y.material=g,y.materialVariant=a(u),y.groupOrder=S,y.renderOrder=u.renderOrder,y.z=m,y.group=f),t++,y}function l(u,d,g,S,m,f,y){y.reversedDepth===!0&&(m=-m);const A=o(u,d,g,S,m,f);g.transmission>0?i.push(A):g.transparent===!0?n.push(A):e.push(A)}function c(u,d,g,S,m,f){const y=o(u,d,g,S,m,f);g.transmission>0?i.unshift(y):g.transparent===!0?n.unshift(y):e.unshift(y)}function h(u,d){e.length>1&&e.sort(u||Gm),i.length>1&&i.sort(d||Xl),n.length>1&&n.sort(d||Xl)}function p(){for(let u=t,d=s.length;u<d;u++){const g=s[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:i,transparent:n,init:r,push:l,unshift:c,finish:p,sort:h}}function Hm(){let s=new WeakMap;function t(i,n){const r=s.get(i);let a;return r===void 0?(a=new ql,s.set(i,[a])):n>=r.length?(a=new ql,r.push(a)):a=r[n],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function Vm(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new R,color:new Dt};break;case"SpotLight":e={position:new R,direction:new R,color:new Dt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new Dt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new Dt,groundColor:new Dt};break;case"RectAreaLight":e={color:new Dt,position:new R,halfWidth:new R,halfHeight:new R};break}return s[t.id]=e,e}}}function Wm(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let Xm=0;function qm(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Ym(s){const t=new Vm,e=Wm(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new R);const n=new R,r=new ie,a=new ie;function o(c){let h=0,p=0,u=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let d=0,g=0,S=0,m=0,f=0,y=0,A=0,M=0,b=0,E=0,C=0,x=0,w=0,P=0;c.sort(qm);for(let F=0,G=c.length;F<G;F++){const N=c[F],k=N.color,K=N.intensity,W=N.distance;let nt=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===on?nt=N.shadow.map.texture:nt=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)h+=k.r*K,p+=k.g*K,u+=k.b*K;else if(N.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(N.sh.coefficients[q],K);P++}else if(N.isSunLight){const q=t.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){const j=N.shadow,it=e.get(N);it.shadowIntensity=j.intensity,it.shadowBias=j.bias,it.shadowNormalBias=j.normalBias,it.shadowRadius=j.radius,it.shadowMapSize.copy(j.mapSize).multiply(j.getFrameExtents()),i.sunShadow[g]=it,i.sunShadowMap[g]=nt;const Ct=j.getViewportCount();for(let At=0;At<Ct;At++)i.sunShadowMatrix[S+At]=j.getMatrix(At),i.sunShadowCascade[S+At]=j._cascadeData[At];S+=Ct,g++}i.sun[d]=q,d++}else if(N.isDirectionalLight){const q=t.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){const j=N.shadow,it=e.get(N);it.shadowIntensity=j.intensity,it.shadowBias=j.bias,it.shadowNormalBias=j.normalBias,it.shadowRadius=j.radius,it.shadowMapSize=j.mapSize,i.directionalShadow[m]=it,i.directionalShadowMap[m]=nt,i.directionalShadowMatrix[m]=N.shadow.matrix,b++}i.directional[m]=q,m++}else if(N.isSpotLight){const q=t.get(N);q.position.setFromMatrixPosition(N.matrixWorld),q.color.copy(k).multiplyScalar(K),q.distance=W,q.coneCos=Math.cos(N.angle),q.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),q.decay=N.decay,i.spot[y]=q;const j=N.shadow;if(N.map&&(i.spotLightMap[x]=N.map,x++,j.updateMatrices(N),N.castShadow&&w++),i.spotLightMatrix[y]=j.matrix,N.castShadow){const it=e.get(N);it.shadowIntensity=j.intensity,it.shadowBias=j.bias,it.shadowNormalBias=j.normalBias,it.shadowRadius=j.radius,it.shadowMapSize=j.mapSize,i.spotShadow[y]=it,i.spotShadowMap[y]=nt,C++}y++}else if(N.isRectAreaLight){const q=t.get(N);q.color.copy(k).multiplyScalar(K),q.halfWidth.set(N.width*.5,0,0),q.halfHeight.set(0,N.height*.5,0),i.rectArea[A]=q,A++}else if(N.isPointLight){const q=t.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),q.distance=N.distance,q.decay=N.decay,N.castShadow){const j=N.shadow,it=e.get(N);it.shadowIntensity=j.intensity,it.shadowBias=j.bias,it.shadowNormalBias=j.normalBias,it.shadowRadius=j.radius,it.shadowMapSize=j.mapSize,it.shadowCameraNear=j.camera.near,it.shadowCameraFar=j.camera.far,i.pointShadow[f]=it,i.pointShadowMap[f]=nt,i.pointShadowMatrix[f]=N.shadow.matrix,E++}i.point[f]=q,f++}else if(N.isHemisphereLight){const q=t.get(N);q.skyColor.copy(N.color).multiplyScalar(K),q.groundColor.copy(N.groundColor).multiplyScalar(K),i.hemi[M]=q,M++}}A>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ut.LTC_FLOAT_1,i.rectAreaLTC2=ut.LTC_FLOAT_2):(i.rectAreaLTC1=ut.LTC_HALF_1,i.rectAreaLTC2=ut.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=p,i.ambient[2]=u;const I=i.hash;(I.sunLength!==d||I.directionalLength!==m||I.pointLength!==f||I.spotLength!==y||I.rectAreaLength!==A||I.hemiLength!==M||I.numSunShadows!==g||I.numDirectionalShadows!==b||I.numPointShadows!==E||I.numSpotShadows!==C||I.numSpotMaps!==x||I.numLightProbes!==P)&&(i.sun.length=d,i.directional.length=m,i.spot.length=y,i.rectArea.length=A,i.point.length=f,i.hemi.length=M,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=S,i.sunShadowCascade.length=S,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.directionalShadowMatrix.length=b,i.pointShadow.length=E,i.pointShadowMap.length=E,i.pointShadowMatrix.length=E,i.spotShadow.length=C,i.spotShadowMap.length=C,i.spotLightMatrix.length=C+x-w,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=P,I.sunLength=d,I.directionalLength=m,I.pointLength=f,I.spotLength=y,I.rectAreaLength=A,I.hemiLength=M,I.numSunShadows=g,I.numDirectionalShadows=b,I.numPointShadows=E,I.numSpotShadows=C,I.numSpotMaps=x,I.numLightProbes=P,i.version=Xm++)}function l(c,h){let p=0,u=0,d=0,g=0,S=0,m=0;const f=h.matrixWorldInverse;for(let y=0,A=c.length;y<A;y++){const M=c[y];if(M.isSunLight){const b=i.sun[p];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(f),p++}else if(M.isDirectionalLight){const b=i.directional[u];b.direction.setFromMatrixPosition(M.matrixWorld),n.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(n),b.direction.transformDirection(f),u++}else if(M.isSpotLight){const b=i.spot[g];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(f),b.direction.setFromMatrixPosition(M.matrixWorld),n.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(n),b.direction.transformDirection(f),g++}else if(M.isRectAreaLight){const b=i.rectArea[S];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(f),a.identity(),r.copy(M.matrixWorld),r.premultiply(f),a.extractRotation(r),b.halfWidth.set(M.width*.5,0,0),b.halfHeight.set(0,M.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),S++}else if(M.isPointLight){const b=i.point[d];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(f),d++}else if(M.isHemisphereLight){const b=i.hemi[m];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(f),m++}}}return{setup:o,setupView:l,state:i}}function Yl(s){const t=new Ym(s),e=[],i=[],n=[];function r(u){p.camera=u,e.length=0,i.length=0,n.length=0}function a(u){e.push(u)}function o(u){i.push(u)}function l(u){n.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}const p={lightsArray:e,shadowsArray:i,lightProbeGridArray:n,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:p,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Zm(s){let t=new WeakMap;function e(n,r=0){const a=t.get(n);let o;return a===void 0?(o=new Yl(s),t.set(n,[o])):r>=a.length?(o=new Yl(s),a.push(o)):o=a[r],o}function i(){t=new WeakMap}return{get:e,dispose:i}}const Km=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,$m=`uniform sampler2D shadow_pass;
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
}`,Jm=[new R(1,0,0),new R(-1,0,0),new R(0,1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1)],Qm=[new R(0,-1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1),new R(0,-1,0),new R(0,-1,0)],Zl=new ie,is=new R,ia=new R;function jm(s,t,e){let i=new So;const n=new wt,r=new wt,a=new me,o=new nu,l=new su,c={},h=e.maxTextureSize,p={[rn]:Xe,[Xe]:rn,[_e]:_e},u=new Ne({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new wt},radius:{value:4}},vertexShader:Km,fragmentShader:$m}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const g=new ge;g.setAttribute("position",new Te(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new tt(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=as;let f=this.type;this.render=function(E,C,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;this.type===Yc&&(It("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=as);const w=s.getRenderTarget(),P=s.getActiveCubeFace(),I=s.getActiveMipmapLevel(),F=s.state;F.setBlending(vi),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const G=f!==this.type;G&&C.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(k=>k.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,k=E.length;N<k;N++){const K=E[N],W=K.shadow;if(W===void 0){It("WebGLShadowMap:",K,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;n.copy(W.mapSize);const nt=W.getFrameExtents();n.multiply(nt),r.copy(W.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(r.x=Math.floor(h/nt.x),n.x=r.x*nt.x,W.mapSize.x=r.x),n.y>h&&(r.y=Math.floor(h/nt.y),n.y=r.y*nt.y,W.mapSize.y=r.y));const q=s.state.buffers.depth.getReversed();if(W.camera._reversedDepth=q,W.map===null||G===!0){if(W.map!==null&&(W.map.depthTexture!==null&&(W.map.depthTexture.dispose(),W.map.depthTexture=null),W.map.dispose()),this.type===ss){if(K.isPointLight){It("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}W.map=new qe(n.x,n.y,{format:on,type:Ke,minFilter:ke,magFilter:ke,generateMipmaps:!1}),W.map.texture.name=K.name+".shadowMap",W.map.depthTexture=new ds(n.x,n.y,ci),W.map.depthTexture.name=K.name+".shadowMapDepth",W.map.depthTexture.format=Li,W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=Ue,W.map.depthTexture.magFilter=Ue}else K.isPointLight?(W.map=new Lc(n.x),W.map.depthTexture=new jh(n.x,yi)):(W.map=new qe(n.x,n.y),W.map.depthTexture=new ds(n.x,n.y,yi)),W.map.depthTexture.name=K.name+".shadowMap",W.map.depthTexture.format=Li,this.type===as?(W.map.depthTexture.compareFunction=q?_o:go,W.map.depthTexture.minFilter=ke,W.map.depthTexture.magFilter=ke):(W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=Ue,W.map.depthTexture.magFilter=Ue);W.camera.updateProjectionMatrix()}W.map.isWebGLCubeRenderTarget!==!0&&(W.map.width!==n.x||W.map.height!==n.y)&&W.map.setSize(n.x,n.y);const j=W.map.isWebGLCubeRenderTarget?6:W.getViewportCount();K.isPointLight!==!0&&W.updateMatrices(K,x);for(let it=0;it<j;it++){const Ct=W.getCamera(it);if(K.isPointLight){const At=W.camera,le=W.matrix,qt=K.distance||At.far;qt!==At.far&&(At.far=qt,At.updateProjectionMatrix()),is.setFromMatrixPosition(K.matrixWorld),At.position.copy(is),ia.copy(At.position),ia.add(Jm[it]),At.up.copy(Qm[it]),At.lookAt(ia),At.updateMatrixWorld(),le.makeTranslation(-is.x,-is.y,-is.z),Zl.multiplyMatrices(At.projectionMatrix,At.matrixWorldInverse),W._frustum.setFromProjectionMatrix(Zl,At.coordinateSystem,At.reversedDepth)}if(W.map.isWebGLCubeRenderTarget)s.setRenderTarget(W.map,it),s.clear();else{it===0&&(s.setRenderTarget(W.map),s.clear());const At=W.getViewport(it);a.set(r.x*At.x,r.y*At.y,r.x*At.z,r.y*At.w),F.viewport(a)}i=W.getFrustum(it),M(C,x,Ct,K,this.type)}W.isPointLightShadow!==!0&&this.type===ss&&y(W,x),W.needsUpdate=!1}f=this.type,m.needsUpdate=!1,s.setRenderTarget(w,P,I)};function y(E,C){const x=t.update(S);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null?E.mapPass=new qe(n.x,n.y,{format:on,type:Ke}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),u.uniforms.shadow_pass.value=E.map.depthTexture,u.uniforms.resolution.value.set(E.map.width,E.map.height),u.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(C,null,x,u,S,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value.set(E.map.width,E.map.height),d.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(C,null,x,d,S,null)}function A(E,C,x,w){let P=null;const I=x.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(I!==void 0)P=I;else if(P=x.isPointLight===!0?l:o,s.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const F=P.uuid,G=C.uuid;let N=c[F];N===void 0&&(N={},c[F]=N);let k=N[G];k===void 0&&(k=P.clone(),N[G]=k,C.addEventListener("dispose",b)),P=k}if(P.visible=C.visible,P.wireframe=C.wireframe,w===ss?P.side=C.shadowSide!==null?C.shadowSide:C.side:P.side=C.shadowSide!==null?C.shadowSide:p[C.side],P.alphaMap=C.alphaMap,P.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,P.map=C.map,P.clipShadows=C.clipShadows,P.clippingPlanes=C.clippingPlanes,P.clipIntersection=C.clipIntersection,P.displacementMap=C.displacementMap,P.displacementScale=C.displacementScale,P.displacementBias=C.displacementBias,P.wireframeLinewidth=C.wireframeLinewidth,P.linewidth=C.linewidth,x.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const F=s.properties.get(P);F.light=x}return P}function M(E,C,x,w,P){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&P===ss)&&(!E.frustumCulled||E.intersectsFrustum(i))){E.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,E.matrixWorld);const G=t.update(E),N=E.material;if(Array.isArray(N)){const k=G.groups;for(let K=0,W=k.length;K<W;K++){const nt=k[K],q=N[nt.materialIndex];if(q&&q.visible){const j=A(E,q,w,P);E.onBeforeShadow(s,E,C,x,G,j,nt),s.renderBufferDirect(x,null,G,j,E,nt),E.onAfterShadow(s,E,C,x,G,j,nt)}}}else if(N.visible){const k=A(E,N,w,P);E.onBeforeShadow(s,E,C,x,G,k,null),s.renderBufferDirect(x,null,G,k,E,null),E.onAfterShadow(s,E,C,x,G,k,null)}}const F=E.children;for(let G=0,N=F.length;G<N;G++)M(F[G],C,x,w,P)}function b(E){E.target.removeEventListener("dispose",b);for(const x in c){const w=c[x],P=E.target.uuid;P in w&&(w[P].dispose(),delete w[P])}}}function t0(s,t){function e(){let D=!1;const lt=new me;let $=null;const ct=new me(0,0,0,0);return{setMask:function(pt){$!==pt&&!D&&(s.colorMask(pt,pt,pt,pt),$=pt)},setLocked:function(pt){D=pt},setClear:function(pt,et,Rt,yt,he){he===!0&&(pt*=yt,et*=yt,Rt*=yt),lt.set(pt,et,Rt,yt),ct.equals(lt)===!1&&(s.clearColor(pt,et,Rt,yt),ct.copy(lt))},reset:function(){D=!1,$=null,ct.set(-1,0,0,0)}}}function i(){let D=!1,lt=!1,$=null,ct=null,pt=null;return{setReversed:function(et){if(lt!==et){const Rt=t.get("EXT_clip_control");et?Rt.clipControlEXT(Rt.LOWER_LEFT_EXT,Rt.ZERO_TO_ONE_EXT):Rt.clipControlEXT(Rt.LOWER_LEFT_EXT,Rt.NEGATIVE_ONE_TO_ONE_EXT),lt=et;const yt=pt;pt=null,this.setClear(yt)}},getReversed:function(){return lt},setTest:function(et){et?Q(s.DEPTH_TEST):vt(s.DEPTH_TEST)},setMask:function(et){$!==et&&!D&&(s.depthMask(et),$=et)},setFunc:function(et){if(lt&&(et=Ah[et]),ct!==et){switch(et){case ua:s.depthFunc(s.NEVER);break;case da:s.depthFunc(s.ALWAYS);break;case fa:s.depthFunc(s.LESS);break;case os:s.depthFunc(s.LEQUAL);break;case pa:s.depthFunc(s.EQUAL);break;case ma:s.depthFunc(s.GEQUAL);break;case ga:s.depthFunc(s.GREATER);break;case _a:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ct=et}},setLocked:function(et){D=et},setClear:function(et){pt!==et&&(pt=et,lt&&(et=1-et),s.clearDepth(et))},reset:function(){D=!1,$=null,ct=null,pt=null,lt=!1}}}function n(){let D=!1,lt=null,$=null,ct=null,pt=null,et=null,Rt=null,yt=null,he=null;return{setTest:function(Qt){D||(Qt?Q(s.STENCIL_TEST):vt(s.STENCIL_TEST))},setMask:function(Qt){lt!==Qt&&!D&&(s.stencilMask(Qt),lt=Qt)},setFunc:function(Qt,ri,ui){($!==Qt||ct!==ri||pt!==ui)&&(s.stencilFunc(Qt,ri,ui),$=Qt,ct=ri,pt=ui)},setOp:function(Qt,ri,ui){(et!==Qt||Rt!==ri||yt!==ui)&&(s.stencilOp(Qt,ri,ui),et=Qt,Rt=ri,yt=ui)},setLocked:function(Qt){D=Qt},setClear:function(Qt){he!==Qt&&(s.clearStencil(Qt),he=Qt)},reset:function(){D=!1,lt=null,$=null,ct=null,pt=null,et=null,Rt=null,yt=null,he=null}}}const r=new e,a=new i,o=new n,l=new WeakMap,c=new WeakMap;let h={},p={},u={},d=new WeakMap,g=[],S=null,m=!1,f=null,y=null,A=null,M=null,b=null,E=null,C=null,x=new Dt(0,0,0),w=0,P=!1,I=null,F=null,G=null,N=null,k=null;const K=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,nt=0;const q=s.getParameter(s.VERSION);q.indexOf("WebGL")!==-1?(nt=parseFloat(/^WebGL (\d)/.exec(q)[1]),W=nt>=1):q.indexOf("OpenGL ES")!==-1&&(nt=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),W=nt>=2);let j=null,it={};const Ct=s.getParameter(s.SCISSOR_BOX),At=s.getParameter(s.VIEWPORT),le=new me().fromArray(Ct),qt=new me().fromArray(At);function Jt(D,lt,$,ct){const pt=new Uint8Array(4),et=s.createTexture();s.bindTexture(D,et),s.texParameteri(D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(D,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Rt=0;Rt<$;Rt++)D===s.TEXTURE_3D||D===s.TEXTURE_2D_ARRAY?s.texImage3D(lt,0,s.RGBA,1,1,ct,0,s.RGBA,s.UNSIGNED_BYTE,pt):s.texImage2D(lt+Rt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,pt);return et}const Y={};Y[s.TEXTURE_2D]=Jt(s.TEXTURE_2D,s.TEXTURE_2D,1),Y[s.TEXTURE_CUBE_MAP]=Jt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[s.TEXTURE_2D_ARRAY]=Jt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Y[s.TEXTURE_3D]=Jt(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Q(s.DEPTH_TEST),a.setFunc(os),Vt(!1),fe(Xo),Q(s.CULL_FACE),Kt(vi);function Q(D){h[D]!==!0&&(s.enable(D),h[D]=!0)}function vt(D){h[D]!==!1&&(s.disable(D),h[D]=!1)}function Ut(D,lt){return u[D]!==lt?(s.bindFramebuffer(D,lt),u[D]=lt,D===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=lt),D===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=lt),!0):!1}function gt(D,lt){let $=g,ct=!1;if(D){$=d.get(lt),$===void 0&&($=[],d.set(lt,$));const pt=D.textures;if($.length!==pt.length||$[0]!==s.COLOR_ATTACHMENT0){for(let et=0,Rt=pt.length;et<Rt;et++)$[et]=s.COLOR_ATTACHMENT0+et;$.length=pt.length,ct=!0}}else $[0]!==s.BACK&&($[0]=s.BACK,ct=!0);ct&&s.drawBuffers($)}function Bt(D){return S!==D?(s.useProgram(D),S=D,!0):!1}const be={[In]:s.FUNC_ADD,[Kc]:s.FUNC_SUBTRACT,[$c]:s.FUNC_REVERSE_SUBTRACT};be[Jc]=s.MIN,be[Qc]=s.MAX;const Gt={[jc]:s.ZERO,[th]:s.ONE,[eh]:s.SRC_COLOR,[rc]:s.SRC_ALPHA,[oh]:s.SRC_ALPHA_SATURATE,[rh]:s.DST_COLOR,[nh]:s.DST_ALPHA,[ih]:s.ONE_MINUS_SRC_COLOR,[ac]:s.ONE_MINUS_SRC_ALPHA,[ah]:s.ONE_MINUS_DST_COLOR,[sh]:s.ONE_MINUS_DST_ALPHA,[lh]:s.CONSTANT_COLOR,[ch]:s.ONE_MINUS_CONSTANT_COLOR,[hh]:s.CONSTANT_ALPHA,[uh]:s.ONE_MINUS_CONSTANT_ALPHA};function Kt(D,lt,$,ct,pt,et,Rt,yt,he,Qt){if(D===vi){m===!0&&(vt(s.BLEND),m=!1);return}if(m===!1&&(Q(s.BLEND),m=!0),D!==Zc){if(D!==f||Qt!==P){if((y!==In||b!==In)&&(s.blendEquation(s.FUNC_ADD),y=In,b=In),Qt)switch(D){case nn:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case oe:s.blendFunc(s.ONE,s.ONE);break;case qo:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Yo:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Yt("WebGLState: Invalid blending: ",D);break}else switch(D){case nn:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case oe:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case qo:Yt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Yo:Yt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Yt("WebGLState: Invalid blending: ",D);break}A=null,M=null,E=null,C=null,x.set(0,0,0),w=0,f=D,P=Qt}return}pt=pt||lt,et=et||$,Rt=Rt||ct,(lt!==y||pt!==b)&&(s.blendEquationSeparate(be[lt],be[pt]),y=lt,b=pt),($!==A||ct!==M||et!==E||Rt!==C)&&(s.blendFuncSeparate(Gt[$],Gt[ct],Gt[et],Gt[Rt]),A=$,M=ct,E=et,C=Rt),(yt.equals(x)===!1||he!==w)&&(s.blendColor(yt.r,yt.g,yt.b,he),x.copy(yt),w=he),f=D,P=!1}function ce(D,lt){D.side===_e?vt(s.CULL_FACE):Q(s.CULL_FACE);let $=D.side===Xe;lt&&($=!$),Vt($),D.blending===nn&&D.transparent===!1?Kt(vi):Kt(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);const ct=D.stencilWrite;o.setTest(ct),ct&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Ye(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Q(s.SAMPLE_ALPHA_TO_COVERAGE):vt(s.SAMPLE_ALPHA_TO_COVERAGE)}function Vt(D){I!==D&&(D?s.frontFace(s.CW):s.frontFace(s.CCW),I=D)}function fe(D){D!==Xc?(Q(s.CULL_FACE),D!==F&&(D===Xo?s.cullFace(s.BACK):D===qc?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):vt(s.CULL_FACE),F=D}function Ce(D){D!==G&&(W&&s.lineWidth(D),G=D)}function Ye(D,lt,$){D?(Q(s.POLYGON_OFFSET_FILL),(N!==lt||k!==$)&&(N=lt,k=$,a.getReversed()&&(lt=-lt),s.polygonOffset(lt,$))):vt(s.POLYGON_OFFSET_FILL)}function pe(D){D?Q(s.SCISSOR_TEST):vt(s.SCISSOR_TEST)}function ve(D){D===void 0&&(D=s.TEXTURE0+K-1),j!==D&&(s.activeTexture(D),j=D)}function U(D,lt,$){$===void 0&&(j===null?$=s.TEXTURE0+K-1:$=j);let ct=it[$];ct===void 0&&(ct={type:void 0,texture:void 0},it[$]=ct),(ct.type!==D||ct.texture!==lt)&&(j!==$&&(s.activeTexture($),j=$),s.bindTexture(D,lt||Y[D]),ct.type=D,ct.texture=lt)}function Fe(){const D=it[j];D!==void 0&&D.type!==void 0&&(s.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function ee(){try{s.compressedTexImage2D(...arguments)}catch(D){Yt("WebGLState:",D)}}function T(){try{s.compressedTexImage3D(...arguments)}catch(D){Yt("WebGLState:",D)}}function _(){try{s.texSubImage2D(...arguments)}catch(D){Yt("WebGLState:",D)}}function O(){try{s.texSubImage3D(...arguments)}catch(D){Yt("WebGLState:",D)}}function H(){try{s.compressedTexSubImage2D(...arguments)}catch(D){Yt("WebGLState:",D)}}function X(){try{s.compressedTexSubImage3D(...arguments)}catch(D){Yt("WebGLState:",D)}}function st(){try{s.texStorage2D(...arguments)}catch(D){Yt("WebGLState:",D)}}function rt(){try{s.texStorage3D(...arguments)}catch(D){Yt("WebGLState:",D)}}function Z(){try{s.texImage2D(...arguments)}catch(D){Yt("WebGLState:",D)}}function J(){try{s.texImage3D(...arguments)}catch(D){Yt("WebGLState:",D)}}function at(D){return p[D]!==void 0?p[D]:s.getParameter(D)}function Et(D,lt){p[D]!==lt&&(s.pixelStorei(D,lt),p[D]=lt)}function ht(D){le.equals(D)===!1&&(s.scissor(D.x,D.y,D.z,D.w),le.copy(D))}function ot(D){qt.equals(D)===!1&&(s.viewport(D.x,D.y,D.z,D.w),qt.copy(D))}function Tt(D,lt){let $=c.get(lt);$===void 0&&($=new WeakMap,c.set(lt,$));let ct=$.get(D);ct===void 0&&(ct=s.getUniformBlockIndex(lt,D.name),$.set(D,ct))}function Lt(D,lt){const ct=c.get(lt).get(D);l.get(lt)!==ct&&(s.uniformBlockBinding(lt,ct,D.__bindingPointIndex),l.set(lt,ct))}function Ft(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},p={},j=null,it={},u={},d=new WeakMap,g=[],S=null,m=!1,f=null,y=null,A=null,M=null,b=null,E=null,C=null,x=new Dt(0,0,0),w=0,P=!1,I=null,F=null,G=null,N=null,k=null,le.set(0,0,s.canvas.width,s.canvas.height),qt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Q,disable:vt,bindFramebuffer:Ut,drawBuffers:gt,useProgram:Bt,setBlending:Kt,setMaterial:ce,setFlipSided:Vt,setCullFace:fe,setLineWidth:Ce,setPolygonOffset:Ye,setScissorTest:pe,activeTexture:ve,bindTexture:U,unbindTexture:Fe,compressedTexImage2D:ee,compressedTexImage3D:T,texImage2D:Z,texImage3D:J,pixelStorei:Et,getParameter:at,updateUBOMapping:Tt,uniformBlockBinding:Lt,texStorage2D:st,texStorage3D:rt,texSubImage2D:_,texSubImage3D:O,compressedTexSubImage2D:H,compressedTexSubImage3D:X,scissor:ht,viewport:ot,reset:Ft}}function e0(s,t,e,i,n,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new wt,h=new WeakMap,p=new Set;let u;const d=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(T,_){return g?new OffscreenCanvas(T,_):lr("canvas")}function m(T,_,O){let H=1;const X=ee(T);if((X.width>O||X.height>O)&&(H=O/Math.max(X.width,X.height)),H<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const st=Math.floor(H*X.width),rt=Math.floor(H*X.height);u===void 0&&(u=S(st,rt));const Z=_?S(st,rt):u;return Z.width=st,Z.height=rt,Z.getContext("2d").drawImage(T,0,0,st,rt),It("WebGLRenderer: Texture has been resized from ("+X.width+"x"+X.height+") to ("+st+"x"+rt+")."),Z}else return"data"in T&&It("WebGLRenderer: Image in DataTexture is too big ("+X.width+"x"+X.height+")."),T;return T}function f(T){return T.generateMipmaps}function y(T){s.generateMipmap(T)}function A(T){return T.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?s.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function M(T,_,O,H,X,st=!1){if(T!==null){if(s[T]!==void 0)return s[T];It("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let rt;H&&(rt=t.get("EXT_texture_norm16"),rt||It("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=_;if(_===s.RED&&(O===s.FLOAT&&(Z=s.R32F),O===s.HALF_FLOAT&&(Z=s.R16F),O===s.UNSIGNED_BYTE&&(Z=s.R8),O===s.UNSIGNED_SHORT&&rt&&(Z=rt.R16_EXT),O===s.SHORT&&rt&&(Z=rt.R16_SNORM_EXT)),_===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.R8UI),O===s.UNSIGNED_SHORT&&(Z=s.R16UI),O===s.UNSIGNED_INT&&(Z=s.R32UI),O===s.BYTE&&(Z=s.R8I),O===s.SHORT&&(Z=s.R16I),O===s.INT&&(Z=s.R32I)),_===s.RG&&(O===s.FLOAT&&(Z=s.RG32F),O===s.HALF_FLOAT&&(Z=s.RG16F),O===s.UNSIGNED_BYTE&&(Z=s.RG8),O===s.UNSIGNED_SHORT&&rt&&(Z=rt.RG16_EXT),O===s.SHORT&&rt&&(Z=rt.RG16_SNORM_EXT)),_===s.RG_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.RG8UI),O===s.UNSIGNED_SHORT&&(Z=s.RG16UI),O===s.UNSIGNED_INT&&(Z=s.RG32UI),O===s.BYTE&&(Z=s.RG8I),O===s.SHORT&&(Z=s.RG16I),O===s.INT&&(Z=s.RG32I)),_===s.RGB_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.RGB8UI),O===s.UNSIGNED_SHORT&&(Z=s.RGB16UI),O===s.UNSIGNED_INT&&(Z=s.RGB32UI),O===s.BYTE&&(Z=s.RGB8I),O===s.SHORT&&(Z=s.RGB16I),O===s.INT&&(Z=s.RGB32I)),_===s.RGBA_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.RGBA8UI),O===s.UNSIGNED_SHORT&&(Z=s.RGBA16UI),O===s.UNSIGNED_INT&&(Z=s.RGBA32UI),O===s.BYTE&&(Z=s.RGBA8I),O===s.SHORT&&(Z=s.RGBA16I),O===s.INT&&(Z=s.RGBA32I)),_===s.RGB&&(O===s.UNSIGNED_SHORT&&rt&&(Z=rt.RGB16_EXT),O===s.SHORT&&rt&&(Z=rt.RGB16_SNORM_EXT),O===s.UNSIGNED_INT_5_9_9_9_REV&&(Z=s.RGB9_E5),O===s.UNSIGNED_INT_10F_11F_11F_REV&&(Z=s.R11F_G11F_B10F)),_===s.RGBA){const J=st?or:Wt.getTransfer(X);O===s.FLOAT&&(Z=s.RGBA32F),O===s.HALF_FLOAT&&(Z=s.RGBA16F),O===s.UNSIGNED_BYTE&&(Z=J===te?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT&&rt&&(Z=rt.RGBA16_EXT),O===s.SHORT&&rt&&(Z=rt.RGBA16_SNORM_EXT),O===s.UNSIGNED_SHORT_4_4_4_4&&(Z=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&(Z=s.RGB5_A1)}return(Z===s.R16F||Z===s.R32F||Z===s.RG16F||Z===s.RG32F||Z===s.RGBA16F||Z===s.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function b(T,_){let O;return T?_===null||_===yi||_===hs?O=s.DEPTH24_STENCIL8:_===ci?O=s.DEPTH32F_STENCIL8:_===cs&&(O=s.DEPTH24_STENCIL8,It("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===yi||_===hs?O=s.DEPTH_COMPONENT24:_===ci?O=s.DEPTH_COMPONENT32F:_===cs&&(O=s.DEPTH_COMPONENT16),O}function E(T,_){return f(T)===!0||T.isFramebufferTexture&&T.minFilter!==Ue&&T.minFilter!==ke?Math.log2(Math.max(_.width,_.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?_.mipmaps.length:1}function C(T){const _=T.target;_.removeEventListener("dispose",C),w(_),_.isVideoTexture&&h.delete(_),_.isHTMLTexture&&p.delete(_)}function x(T){const _=T.target;_.removeEventListener("dispose",x),I(_)}function w(T){const _=i.get(T);if(_.__webglInit===void 0)return;const O=T.source,H=d.get(O);if(H){const X=H[_.__cacheKey];X.usedTimes--,X.usedTimes===0&&P(T),Object.keys(H).length===0&&d.delete(O)}i.remove(T)}function P(T){const _=i.get(T);s.deleteTexture(_.__webglTexture);const O=T.source,H=d.get(O);delete H[_.__cacheKey],a.memory.textures--}function I(T){const _=i.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),i.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(_.__webglFramebuffer[H]))for(let X=0;X<_.__webglFramebuffer[H].length;X++)s.deleteFramebuffer(_.__webglFramebuffer[H][X]);else s.deleteFramebuffer(_.__webglFramebuffer[H]);_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer[H])}else{if(Array.isArray(_.__webglFramebuffer))for(let H=0;H<_.__webglFramebuffer.length;H++)s.deleteFramebuffer(_.__webglFramebuffer[H]);else s.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&s.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let H=0;H<_.__webglColorRenderbuffer.length;H++)_.__webglColorRenderbuffer[H]&&s.deleteRenderbuffer(_.__webglColorRenderbuffer[H]);_.__webglDepthRenderbuffer&&s.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const O=T.textures;for(let H=0,X=O.length;H<X;H++){const st=i.get(O[H]);st.__webglTexture&&(s.deleteTexture(st.__webglTexture),a.memory.textures--),i.remove(O[H])}i.remove(T)}let F=0;function G(){F=0}function N(){return F}function k(T){F=T}function K(){const T=F;return T>=n.maxTextures&&It("WebGLTextures: Trying to use "+(T+1)+" texture units while this GPU supports only "+n.maxTextures),F+=1,T}function W(T){const _=[];return _.push(T.wrapS),_.push(T.wrapT),_.push(T.wrapR||0),_.push(T.magFilter),_.push(T.minFilter),_.push(T.anisotropy),_.push(T.internalFormat),_.push(T.format),_.push(T.type),_.push(T.generateMipmaps),_.push(T.premultiplyAlpha),_.push(T.flipY),_.push(T.unpackAlignment),_.push(T.colorSpace),_.join()}function nt(T,_){const O=i.get(T);if(T.isVideoTexture&&U(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&O.__version!==T.version){const H=T.image;if(H===null)It("WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)It("WebGLRenderer: Texture marked for update but image is incomplete");else{vt(O,T,_);return}}else T.isExternalTexture&&(O.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+_)}function q(T,_){const O=i.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){vt(O,T,_);return}else T.isExternalTexture&&(O.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+_)}function j(T,_){const O=i.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){vt(O,T,_);return}e.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+_)}function it(T,_){const O=i.get(T);if(T.isCubeDepthTexture!==!0&&T.version>0&&O.__version!==T.version){Ut(O,T,_);return}e.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+_)}const Ct={[ls]:s.REPEAT,[Ci]:s.CLAMP_TO_EDGE,[xa]:s.MIRRORED_REPEAT},At={[Ue]:s.NEAREST,[ph]:s.NEAREST_MIPMAP_NEAREST,[_s]:s.NEAREST_MIPMAP_LINEAR,[ke]:s.LINEAR,[wr]:s.LINEAR_MIPMAP_NEAREST,[tn]:s.LINEAR_MIPMAP_LINEAR},le={[xh]:s.NEVER,[bh]:s.ALWAYS,[vh]:s.LESS,[go]:s.LEQUAL,[Mh]:s.EQUAL,[_o]:s.GEQUAL,[Sh]:s.GREATER,[yh]:s.NOTEQUAL};function qt(T,_){if(_.type===ci&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===ke||_.magFilter===wr||_.magFilter===_s||_.magFilter===tn||_.minFilter===ke||_.minFilter===wr||_.minFilter===_s||_.minFilter===tn)&&It("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(T,s.TEXTURE_WRAP_S,Ct[_.wrapS]),s.texParameteri(T,s.TEXTURE_WRAP_T,Ct[_.wrapT]),(T===s.TEXTURE_3D||T===s.TEXTURE_2D_ARRAY)&&s.texParameteri(T,s.TEXTURE_WRAP_R,Ct[_.wrapR]),s.texParameteri(T,s.TEXTURE_MAG_FILTER,At[_.magFilter]),s.texParameteri(T,s.TEXTURE_MIN_FILTER,At[_.minFilter]),_.compareFunction&&(s.texParameteri(T,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(T,s.TEXTURE_COMPARE_FUNC,le[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Ue||_.minFilter!==_s&&_.minFilter!==tn||_.type===ci&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");s.texParameterf(T,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,n.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function Jt(T,_){let O=!1;T.__webglInit===void 0&&(T.__webglInit=!0,_.addEventListener("dispose",C));const H=_.source;let X=d.get(H);X===void 0&&(X={},d.set(H,X));const st=W(_);if(st!==T.__cacheKey){X[st]===void 0&&(X[st]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,O=!0),X[st].usedTimes++;const rt=X[T.__cacheKey];rt!==void 0&&(X[T.__cacheKey].usedTimes--,rt.usedTimes===0&&P(_)),T.__cacheKey=st,T.__webglTexture=X[st].texture}return O}function Y(T,_,O){return Math.floor(Math.floor(T/O)/_)}function Q(T,_,O,H){const st=T.updateRanges;if(st.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,_.width,_.height,O,H,_.data);else{st.sort((Et,ht)=>Et.start-ht.start);let rt=0;for(let Et=1;Et<st.length;Et++){const ht=st[rt],ot=st[Et],Tt=ht.start+ht.count,Lt=Y(ot.start,_.width,4),Ft=Y(ht.start,_.width,4);ot.start<=Tt+1&&Lt===Ft&&Y(ot.start+ot.count-1,_.width,4)===Lt?ht.count=Math.max(ht.count,ot.start+ot.count-ht.start):(++rt,st[rt]=ot)}st.length=rt+1;const Z=e.getParameter(s.UNPACK_ROW_LENGTH),J=e.getParameter(s.UNPACK_SKIP_PIXELS),at=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,_.width);for(let Et=0,ht=st.length;Et<ht;Et++){const ot=st[Et],Tt=Math.floor(ot.start/4),Lt=Math.ceil(ot.count/4),Ft=Tt%_.width,D=Math.floor(Tt/_.width),lt=Lt,$=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,Ft),e.pixelStorei(s.UNPACK_SKIP_ROWS,D),e.texSubImage2D(s.TEXTURE_2D,0,Ft,D,lt,$,O,H,_.data)}T.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,Z),e.pixelStorei(s.UNPACK_SKIP_PIXELS,J),e.pixelStorei(s.UNPACK_SKIP_ROWS,at)}}function vt(T,_,O){let H=s.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(H=s.TEXTURE_2D_ARRAY),_.isData3DTexture&&(H=s.TEXTURE_3D);const X=Jt(T,_),st=_.source;e.bindTexture(H,T.__webglTexture,s.TEXTURE0+O);const rt=i.get(st);if(st.version!==rt.__version||X===!0){if(e.activeTexture(s.TEXTURE0+O),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){const $=Wt.getPrimaries(Wt.workingColorSpace),ct=_.colorSpace===Vi?null:Wt.getPrimaries(_.colorSpace),pt=_.colorSpace===Vi||$===ct?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt)}e.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment);let J=m(_.image,!1,n.maxTextureSize);J=Fe(_,J);const at=r.convert(_.format,_.colorSpace),Et=r.convert(_.type);let ht=M(_.internalFormat,at,Et,_.normalized,_.colorSpace,_.isVideoTexture);qt(H,_);let ot;const Tt=_.mipmaps,Lt=_.isVideoTexture!==!0,Ft=rt.__version===void 0||X===!0,D=st.dataReady,lt=E(_,J);if(_.isDepthTexture)ht=b(_.format===en,_.type),Ft&&(Lt?e.texStorage2D(s.TEXTURE_2D,1,ht,J.width,J.height):e.texImage2D(s.TEXTURE_2D,0,ht,J.width,J.height,0,at,Et,null));else if(_.isDataTexture)if(Tt.length>0){Lt&&Ft&&e.texStorage2D(s.TEXTURE_2D,lt,ht,Tt[0].width,Tt[0].height);for(let $=0,ct=Tt.length;$<ct;$++)ot=Tt[$],Lt?D&&e.texSubImage2D(s.TEXTURE_2D,$,0,0,ot.width,ot.height,at,Et,ot.data):e.texImage2D(s.TEXTURE_2D,$,ht,ot.width,ot.height,0,at,Et,ot.data);_.generateMipmaps=!1}else Lt?(Ft&&e.texStorage2D(s.TEXTURE_2D,lt,ht,J.width,J.height),D&&Q(_,J,at,Et)):e.texImage2D(s.TEXTURE_2D,0,ht,J.width,J.height,0,at,Et,J.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Lt&&Ft&&e.texStorage3D(s.TEXTURE_2D_ARRAY,lt,ht,Tt[0].width,Tt[0].height,J.depth);for(let $=0,ct=Tt.length;$<ct;$++)if(ot=Tt[$],_.format!==hi)if(at!==null)if(Lt){if(D)if(_.layerUpdates.size>0){const pt=Tl(ot.width,ot.height,_.format,_.type);for(const et of _.layerUpdates){const Rt=ot.data.subarray(et*pt/ot.data.BYTES_PER_ELEMENT,(et+1)*pt/ot.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,$,0,0,et,ot.width,ot.height,1,at,Rt)}}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,$,0,0,0,ot.width,ot.height,J.depth,at,ot.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,$,ht,ot.width,ot.height,J.depth,0,ot.data,0,0);else It("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Lt?D&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,$,0,0,0,ot.width,ot.height,J.depth,at,Et,ot.data):e.texImage3D(s.TEXTURE_2D_ARRAY,$,ht,ot.width,ot.height,J.depth,0,at,Et,ot.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{Lt&&Ft&&e.texStorage2D(s.TEXTURE_2D,lt,ht,Tt[0].width,Tt[0].height);for(let $=0,ct=Tt.length;$<ct;$++)ot=Tt[$],_.format!==hi?at!==null?Lt?D&&e.compressedTexSubImage2D(s.TEXTURE_2D,$,0,0,ot.width,ot.height,at,ot.data):e.compressedTexImage2D(s.TEXTURE_2D,$,ht,ot.width,ot.height,0,ot.data):It("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Lt?D&&e.texSubImage2D(s.TEXTURE_2D,$,0,0,ot.width,ot.height,at,Et,ot.data):e.texImage2D(s.TEXTURE_2D,$,ht,ot.width,ot.height,0,at,Et,ot.data)}else if(_.isDataArrayTexture)if(Lt){if(Ft&&e.texStorage3D(s.TEXTURE_2D_ARRAY,lt,ht,J.width,J.height,J.depth),D)if(_.layerUpdates.size>0){const $=Tl(J.width,J.height,_.format,_.type);for(const ct of _.layerUpdates){const pt=J.data.subarray(ct*$/J.data.BYTES_PER_ELEMENT,(ct+1)*$/J.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,ct,J.width,J.height,1,at,Et,pt)}_.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,at,Et,J.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,ht,J.width,J.height,J.depth,0,at,Et,J.data);else if(_.isData3DTexture)Lt?(Ft&&e.texStorage3D(s.TEXTURE_3D,lt,ht,J.width,J.height,J.depth),D&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,at,Et,J.data)):e.texImage3D(s.TEXTURE_3D,0,ht,J.width,J.height,J.depth,0,at,Et,J.data);else if(_.isFramebufferTexture){if(Ft)if(Lt)e.texStorage2D(s.TEXTURE_2D,lt,ht,J.width,J.height);else{let $=J.width,ct=J.height;for(let pt=0;pt<lt;pt++)e.texImage2D(s.TEXTURE_2D,pt,ht,$,ct,0,at,Et,null),$>>=1,ct>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in s){const $=s.canvas;if($.hasAttribute("layoutsubtree")||$.setAttribute("layoutsubtree","true"),J.parentNode!==$){$.appendChild(J),p.add(_),$.onpaint=ct=>{const pt=ct.changedElements;for(const et of p)pt.includes(et.image)&&(et.needsUpdate=!0)},$.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,J);else{const pt=s.RGBA,et=s.RGBA,Rt=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,pt,et,Rt,J)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Tt.length>0){if(Lt&&Ft){const $=ee(Tt[0]);e.texStorage2D(s.TEXTURE_2D,lt,ht,$.width,$.height)}for(let $=0,ct=Tt.length;$<ct;$++)ot=Tt[$],Lt?D&&e.texSubImage2D(s.TEXTURE_2D,$,0,0,at,Et,ot):e.texImage2D(s.TEXTURE_2D,$,ht,at,Et,ot);_.generateMipmaps=!1}else if(Lt){if(Ft){const $=ee(J);e.texStorage2D(s.TEXTURE_2D,lt,ht,$.width,$.height)}D&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,at,Et,J)}else e.texImage2D(s.TEXTURE_2D,0,ht,at,Et,J);f(_)&&y(H),rt.__version=st.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function Ut(T,_,O){if(_.image.length!==6)return;const H=Jt(T,_),X=_.source;e.bindTexture(s.TEXTURE_CUBE_MAP,T.__webglTexture,s.TEXTURE0+O);const st=i.get(X);if(X.version!==st.__version||H===!0){e.activeTexture(s.TEXTURE0+O);const rt=Wt.getPrimaries(Wt.workingColorSpace),Z=_.colorSpace===Vi?null:Wt.getPrimaries(_.colorSpace),J=_.colorSpace===Vi||rt===Z?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,J);const at=_.isCompressedTexture||_.image[0].isCompressedTexture,Et=_.image[0]&&_.image[0].isDataTexture,ht=[];for(let et=0;et<6;et++)!at&&!Et?ht[et]=m(_.image[et],!0,n.maxCubemapSize):ht[et]=Et?_.image[et].image:_.image[et],ht[et]=Fe(_,ht[et]);const ot=ht[0],Tt=r.convert(_.format,_.colorSpace),Lt=r.convert(_.type),Ft=M(_.internalFormat,Tt,Lt,_.normalized,_.colorSpace),D=_.isVideoTexture!==!0,lt=st.__version===void 0||H===!0,$=X.dataReady;let ct=E(_,ot);qt(s.TEXTURE_CUBE_MAP,_);let pt;if(at){D&&lt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,ct,Ft,ot.width,ot.height);for(let et=0;et<6;et++){pt=ht[et].mipmaps;for(let Rt=0;Rt<pt.length;Rt++){const yt=pt[Rt];_.format!==hi?Tt!==null?D?$&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Rt,0,0,yt.width,yt.height,Tt,yt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Rt,Ft,yt.width,yt.height,0,yt.data):It("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?$&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Rt,0,0,yt.width,yt.height,Tt,Lt,yt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Rt,Ft,yt.width,yt.height,0,Tt,Lt,yt.data)}}}else{if(pt=_.mipmaps,D&&lt){pt.length>0&&ct++;const et=ee(ht[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,ct,Ft,et.width,et.height)}for(let et=0;et<6;et++)if(Et){D?$&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,ht[et].width,ht[et].height,Tt,Lt,ht[et].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Ft,ht[et].width,ht[et].height,0,Tt,Lt,ht[et].data);for(let Rt=0;Rt<pt.length;Rt++){const he=pt[Rt].image[et].image;D?$&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Rt+1,0,0,he.width,he.height,Tt,Lt,he.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Rt+1,Ft,he.width,he.height,0,Tt,Lt,he.data)}}else{D?$&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Tt,Lt,ht[et]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Ft,Tt,Lt,ht[et]);for(let Rt=0;Rt<pt.length;Rt++){const yt=pt[Rt];D?$&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Rt+1,0,0,Tt,Lt,yt.image[et]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Rt+1,Ft,Tt,Lt,yt.image[et])}}}f(_)&&y(s.TEXTURE_CUBE_MAP),st.__version=X.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function gt(T,_,O,H,X,st){const rt=r.convert(O.format,O.colorSpace),Z=r.convert(O.type),J=M(O.internalFormat,rt,Z,O.normalized,O.colorSpace),at=i.get(_),Et=i.get(O);if(Et.__renderTarget=_,!at.__hasExternalTextures){const ht=Math.max(1,_.width>>st),ot=Math.max(1,_.height>>st);X===s.TEXTURE_3D||X===s.TEXTURE_2D_ARRAY?e.texImage3D(X,st,J,ht,ot,_.depth,0,rt,Z,null):e.texImage2D(X,st,J,ht,ot,0,rt,Z,null)}e.bindFramebuffer(s.FRAMEBUFFER,T),ve(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,H,X,Et.__webglTexture,0,pe(_)):(X===s.TEXTURE_2D||X>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&X<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,H,X,Et.__webglTexture,st),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Bt(T,_,O){if(s.bindRenderbuffer(s.RENDERBUFFER,T),_.depthBuffer){const H=_.depthTexture,X=H&&H.isDepthTexture?H.type:null,st=b(_.stencilBuffer,X),rt=_.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;ve(_)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,pe(_),st,_.width,_.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,pe(_),st,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,st,_.width,_.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,rt,s.RENDERBUFFER,T)}else{const H=_.textures;for(let X=0;X<H.length;X++){const st=H[X],rt=r.convert(st.format,st.colorSpace),Z=r.convert(st.type),J=M(st.internalFormat,rt,Z,st.normalized,st.colorSpace);ve(_)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,pe(_),J,_.width,_.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,pe(_),J,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,J,_.width,_.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function be(T,_,O){const H=_.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,T),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const X=i.get(_.depthTexture);if(X.__renderTarget=_,(!X.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),H){if(X.__webglInit===void 0&&(X.__webglInit=!0,_.depthTexture.addEventListener("dispose",C)),X.__webglTexture===void 0){X.__webglTexture=s.createTexture(),e.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture),qt(s.TEXTURE_CUBE_MAP,_.depthTexture);const at=r.convert(_.depthTexture.format),Et=r.convert(_.depthTexture.type);let ht;_.depthTexture.format===Li?ht=s.DEPTH_COMPONENT24:_.depthTexture.format===en&&(ht=s.DEPTH24_STENCIL8);for(let ot=0;ot<6;ot++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,ht,_.width,_.height,0,at,Et,null)}}else nt(_.depthTexture,0);const st=X.__webglTexture,rt=pe(_),Z=H?s.TEXTURE_CUBE_MAP_POSITIVE_X+O:s.TEXTURE_2D,J=_.depthTexture.format===en?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(_.depthTexture.format===Li)ve(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,J,Z,st,0,rt):s.framebufferTexture2D(s.FRAMEBUFFER,J,Z,st,0);else if(_.depthTexture.format===en)ve(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,J,Z,st,0,rt):s.framebufferTexture2D(s.FRAMEBUFFER,J,Z,st,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Gt(T){const _=i.get(T),O=T.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==T.depthTexture){const H=T.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),H){const X=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,H.removeEventListener("dispose",X)};H.addEventListener("dispose",X),_.__depthDisposeCallback=X}_.__boundDepthTexture=H}if(T.depthTexture&&!_.__autoAllocateDepthBuffer)if(O)for(let H=0;H<6;H++)be(_.__webglFramebuffer[H],T,H);else{const H=T.texture.mipmaps;H&&H.length>0?be(_.__webglFramebuffer[0],T,0):be(_.__webglFramebuffer,T,0)}else if(O){_.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[H]),_.__webglDepthbuffer[H]===void 0)_.__webglDepthbuffer[H]=s.createRenderbuffer(),Bt(_.__webglDepthbuffer[H],T,!1);else{const X=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,st=_.__webglDepthbuffer[H];s.bindRenderbuffer(s.RENDERBUFFER,st),s.framebufferRenderbuffer(s.FRAMEBUFFER,X,s.RENDERBUFFER,st)}}else{const H=T.texture.mipmaps;if(H&&H.length>0?e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=s.createRenderbuffer(),Bt(_.__webglDepthbuffer,T,!1);else{const X=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,st=_.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,st),s.framebufferRenderbuffer(s.FRAMEBUFFER,X,s.RENDERBUFFER,st)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function Kt(T,_,O){const H=i.get(T);_!==void 0&&gt(H.__webglFramebuffer,T,T.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&Gt(T)}function ce(T){const _=T.texture,O=i.get(T),H=i.get(_);T.addEventListener("dispose",x);const X=T.textures,st=T.isWebGLCubeRenderTarget===!0,rt=X.length>1;if(rt||(H.__webglTexture===void 0&&(H.__webglTexture=s.createTexture()),H.__version=_.version,a.memory.textures++),st){O.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[Z]=[];for(let J=0;J<_.mipmaps.length;J++)O.__webglFramebuffer[Z][J]=s.createFramebuffer()}else O.__webglFramebuffer[Z]=s.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let Z=0;Z<_.mipmaps.length;Z++)O.__webglFramebuffer[Z]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(rt)for(let Z=0,J=X.length;Z<J;Z++){const at=i.get(X[Z]);at.__webglTexture===void 0&&(at.__webglTexture=s.createTexture(),a.memory.textures++)}if(T.samples>0&&ve(T)===!1){O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let Z=0;Z<X.length;Z++){const J=X[Z];O.__webglColorRenderbuffer[Z]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[Z]);const at=r.convert(J.format,J.colorSpace),Et=r.convert(J.type),ht=M(J.internalFormat,at,Et,J.normalized,J.colorSpace,T.isXRRenderTarget===!0),ot=pe(T);s.renderbufferStorageMultisample(s.RENDERBUFFER,ot,ht,T.width,T.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Z,s.RENDERBUFFER,O.__webglColorRenderbuffer[Z])}s.bindRenderbuffer(s.RENDERBUFFER,null),T.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),Bt(O.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(st){e.bindTexture(s.TEXTURE_CUBE_MAP,H.__webglTexture),qt(s.TEXTURE_CUBE_MAP,_);for(let Z=0;Z<6;Z++)if(_.mipmaps&&_.mipmaps.length>0)for(let J=0;J<_.mipmaps.length;J++)gt(O.__webglFramebuffer[Z][J],T,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,J);else gt(O.__webglFramebuffer[Z],T,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);f(_)&&y(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(rt){for(let Z=0,J=X.length;Z<J;Z++){const at=X[Z],Et=i.get(at);let ht=s.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ht=T.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(ht,Et.__webglTexture),qt(ht,at),gt(O.__webglFramebuffer,T,at,s.COLOR_ATTACHMENT0+Z,ht,0),f(at)&&y(ht)}e.unbindTexture()}else{let Z=s.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(Z=T.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(Z,H.__webglTexture),qt(Z,_),_.mipmaps&&_.mipmaps.length>0)for(let J=0;J<_.mipmaps.length;J++)gt(O.__webglFramebuffer[J],T,_,s.COLOR_ATTACHMENT0,Z,J);else gt(O.__webglFramebuffer,T,_,s.COLOR_ATTACHMENT0,Z,0);f(_)&&y(Z),e.unbindTexture()}T.depthBuffer&&Gt(T)}function Vt(T){const _=T.textures;for(let O=0,H=_.length;O<H;O++){const X=_[O];if(f(X)){const st=A(T),rt=i.get(X).__webglTexture;e.bindTexture(st,rt),y(st),e.unbindTexture()}}}const fe=[],Ce=[];function Ye(T){if(T.samples>0){if(ve(T)===!1){const _=T.textures,O=T.width,H=T.height;let X=s.COLOR_BUFFER_BIT;const st=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,rt=i.get(T),Z=_.length>1;if(Z)for(let at=0;at<_.length;at++)e.bindFramebuffer(s.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+at,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,rt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+at,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,rt.__webglMultisampledFramebuffer);const J=T.texture.mipmaps;J&&J.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,rt.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,rt.__webglFramebuffer);for(let at=0;at<_.length;at++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(X|=s.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(X|=s.STENCIL_BUFFER_BIT)),Z){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,rt.__webglColorRenderbuffer[at]);const Et=i.get(_[at]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Et,0)}s.blitFramebuffer(0,0,O,H,0,0,O,H,X,s.NEAREST),l===!0&&(fe.length=0,Ce.length=0,fe.push(s.COLOR_ATTACHMENT0+at),T.depthBuffer&&T.storeMultisampledDepthBuffer===!1&&(fe.push(st),Ce.push(st),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Ce)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,fe))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Z)for(let at=0;at<_.length;at++){e.bindFramebuffer(s.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+at,s.RENDERBUFFER,rt.__webglColorRenderbuffer[at]);const Et=i.get(_[at]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,rt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+at,s.TEXTURE_2D,Et,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,rt.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.storeMultisampledDepthBuffer===!1&&l){const _=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[_])}}}function pe(T){return Math.min(n.maxSamples,T.samples)}function ve(T){const _=i.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function U(T){const _=a.render.frame;h.get(T)!==_&&(h.set(T,_),T.update())}function Fe(T,_){const O=T.colorSpace,H=T.format,X=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||O!==ar&&O!==Vi&&(Wt.getTransfer(O)===te?(H!==hi||X!==je)&&It("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Yt("WebGLTextures: Unsupported texture color space:",O)),_}function ee(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=K,this.resetTextureUnits=G,this.getTextureUnits=N,this.setTextureUnits=k,this.setTexture2D=nt,this.setTexture2DArray=q,this.setTexture3D=j,this.setTextureCube=it,this.rebindTextures=Kt,this.setupRenderTarget=ce,this.updateRenderTargetMipmap=Vt,this.updateMultisampleRenderTarget=Ye,this.setupDepthRenderbuffer=Gt,this.setupFrameBufferTexture=gt,this.useMultisampledRTT=ve,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function i0(s,t){function e(i,n=Vi){let r;const a=Wt.getTransfer(n);if(i===je)return s.UNSIGNED_BYTE;if(i===co)return s.UNSIGNED_SHORT_4_4_4_4;if(i===ho)return s.UNSIGNED_SHORT_5_5_5_1;if(i===uc)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===dc)return s.UNSIGNED_INT_10F_11F_11F_REV;if(i===cc)return s.BYTE;if(i===hc)return s.SHORT;if(i===cs)return s.UNSIGNED_SHORT;if(i===lo)return s.INT;if(i===yi)return s.UNSIGNED_INT;if(i===ci)return s.FLOAT;if(i===Ke)return s.HALF_FLOAT;if(i===fc)return s.ALPHA;if(i===pc)return s.RGB;if(i===hi)return s.RGBA;if(i===Li)return s.DEPTH_COMPONENT;if(i===en)return s.DEPTH_STENCIL;if(i===uo)return s.RED;if(i===fo)return s.RED_INTEGER;if(i===on)return s.RG;if(i===po)return s.RG_INTEGER;if(i===mo)return s.RGBA_INTEGER;if(i===Qs||i===js||i===tr||i===er)if(a===te)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Qs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===js)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===tr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===er)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Qs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===js)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===tr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===er)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===va||i===Ma||i===Sa||i===ya)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===va)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ma)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Sa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ya)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ba||i===wa||i===Ea||i===Ta||i===Aa||i===sr||i===Ra)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===ba||i===wa)return a===te?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Ea)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Ta)return r.COMPRESSED_R11_EAC;if(i===Aa)return r.COMPRESSED_SIGNED_R11_EAC;if(i===sr)return r.COMPRESSED_RG11_EAC;if(i===Ra)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Ca||i===Pa||i===La||i===Da||i===Ia||i===Ua||i===Na||i===Fa||i===Oa||i===za||i===Ba||i===ka||i===Ga||i===Ha)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Ca)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Pa)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===La)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Da)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ia)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ua)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Na)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Fa)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Oa)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===za)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ba)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ka)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ga)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ha)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Va||i===Wa||i===Xa)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===Va)return a===te?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Wa)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Xa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===qa||i===Ya||i===rr||i===Za)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===qa)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Ya)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===rr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Za)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===hs?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:e}}const n0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,s0=`
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

}`;class r0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new wc(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Ne({vertexShader:n0,fragmentShader:s0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new tt(new Ze(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class a0 extends ln{constructor(t,e){super();const i=this;let n=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,p=null,u=null,d=null,g=null;const S=typeof XRWebGLBinding<"u",m=new r0,f={},y=e.getContextAttributes();let A=null,M=null;const b=[],E=[],C=new wt;let x=null,w=null;const P=new Qe;P.viewport=new me;const I=new Qe;I.viewport=new me;const F=[P,I],G=new hu;let N=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let Q=b[Y];return Q===void 0&&(Q=new Ir,b[Y]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(Y){let Q=b[Y];return Q===void 0&&(Q=new Ir,b[Y]=Q),Q.getGripSpace()},this.getHand=function(Y){let Q=b[Y];return Q===void 0&&(Q=new Ir,b[Y]=Q),Q.getHandSpace()};function K(Y){const Q=E.indexOf(Y.inputSource);if(Q===-1)return;const vt=b[Q];vt!==void 0&&(vt.update(Y.inputSource,Y.frame,c||a),vt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function W(){n.removeEventListener("select",K),n.removeEventListener("selectstart",K),n.removeEventListener("selectend",K),n.removeEventListener("squeeze",K),n.removeEventListener("squeezestart",K),n.removeEventListener("squeezeend",K),n.removeEventListener("end",W),n.removeEventListener("inputsourceschange",nt);for(let Y=0;Y<b.length;Y++){const Q=E[Y];Q!==null&&(E[Y]=null,b[Y].disconnect(Q))}N=null,k=null,m.reset();for(const Y in f)delete f[Y];if(t.setRenderTarget(A),d=null,u=null,p=null,n=null,M=null,Jt.stop(),i.isPresenting=!1,t.setPixelRatio(x),t.setSize(C.width,C.height,!1),w!==null){const Y=w.camera;Y.fov=w.fov,Y.zoom=w.zoom,Y.updateProjectionMatrix(),w=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,i.isPresenting===!0&&It("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,i.isPresenting===!0&&It("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return p===null&&S&&(p=new XRWebGLBinding(n,e)),p},this.getFrame=function(){return g},this.getSession=function(){return n},this.setSession=async function(Y){if(n=Y,n!==null){if(A=t.getRenderTarget(),n.addEventListener("select",K),n.addEventListener("selectstart",K),n.addEventListener("selectend",K),n.addEventListener("squeeze",K),n.addEventListener("squeezestart",K),n.addEventListener("squeezeend",K),n.addEventListener("end",W),n.addEventListener("inputsourceschange",nt),y.xrCompatible!==!0&&await e.makeXRCompatible(),x=t.getPixelRatio(),t.getSize(C),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let vt=null,Ut=null,gt=null;y.depth&&(gt=y.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,vt=y.stencil?en:Li,Ut=y.stencil?hs:yi);const Bt={colorFormat:e.RGBA8,depthFormat:gt,scaleFactor:r};p=this.getBinding(),u=p.createProjectionLayer(Bt),n.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),M=new qe(u.textureWidth,u.textureHeight,{format:hi,type:je,depthTexture:new ds(u.textureWidth,u.textureHeight,Ut,void 0,void 0,void 0,void 0,void 0,void 0,vt),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{const vt={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(n,e,vt),n.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),M=new qe(d.framebufferWidth,d.framebufferHeight,{format:hi,type:je,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),Jt.setContext(n),Jt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function nt(Y){for(let Q=0;Q<Y.removed.length;Q++){const vt=Y.removed[Q],Ut=E.indexOf(vt);Ut>=0&&(E[Ut]=null,b[Ut].disconnect(vt))}for(let Q=0;Q<Y.added.length;Q++){const vt=Y.added[Q];let Ut=E.indexOf(vt);if(Ut===-1){for(let Bt=0;Bt<b.length;Bt++)if(Bt>=E.length){E.push(vt),Ut=Bt;break}else if(E[Bt]===null){E[Bt]=vt,Ut=Bt;break}if(Ut===-1)break}const gt=b[Ut];gt&&gt.connect(vt)}}const q=new R,j=new R;function it(Y,Q,vt){q.setFromMatrixPosition(Q.matrixWorld),j.setFromMatrixPosition(vt.matrixWorld);const Ut=q.distanceTo(j),gt=Q.projectionMatrix.elements,Bt=vt.projectionMatrix.elements,be=gt[14]/(gt[10]-1),Gt=gt[14]/(gt[10]+1),Kt=(gt[9]+1)/gt[5],ce=(gt[9]-1)/gt[5],Vt=(gt[8]-1)/gt[0],fe=(Bt[8]+1)/Bt[0],Ce=be*Vt,Ye=be*fe,pe=Ut/(-Vt+fe),ve=pe*-Vt;if(Q.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(ve),Y.translateZ(pe),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),gt[10]===-1)Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const U=be+pe,Fe=Gt+pe,ee=Ce-ve,T=Ye+(Ut-ve),_=Kt*Gt/Fe*U,O=ce*Gt/Fe*U;Y.projectionMatrix.makePerspective(ee,T,_,O,U,Fe),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Ct(Y,Q){Q===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(Q.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(n===null)return;let Q=Y.near,vt=Y.far;m.texture!==null&&(m.depthNear>0&&(Q=m.depthNear),m.depthFar>0&&(vt=m.depthFar)),G.near=I.near=P.near=Q,G.far=I.far=P.far=vt,(N!==G.near||k!==G.far)&&(n.updateRenderState({depthNear:G.near,depthFar:G.far}),N=G.near,k=G.far),G.layers.mask=Y.layers.mask|6,P.layers.mask=G.layers.mask&-5,I.layers.mask=G.layers.mask&-3;const Ut=Y.parent,gt=G.cameras;Ct(G,Ut);for(let Bt=0;Bt<gt.length;Bt++)Ct(gt[Bt],Ut);gt.length===2?it(G,P,I):G.projectionMatrix.copy(P.projectionMatrix),w===null&&Y.isPerspectiveCamera&&(w={camera:Y,fov:Y.fov,zoom:Y.zoom}),At(Y,G,Ut)};function At(Y,Q,vt){vt===null?Y.matrix.copy(Q.matrixWorld):(Y.matrix.copy(vt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(Q.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=$a*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return G},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(Y){l=Y,u!==null&&(u.fixedFoveation=Y),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(G)},this.getCameraTexture=function(Y){return f[Y]};let le=null;function qt(Y,Q){if(h=Q.getViewerPose(c||a),g=Q,h!==null){const vt=h.views;d!==null&&(t.setRenderTargetFramebuffer(M,d.framebuffer),t.setRenderTarget(M));let Ut=!1;vt.length!==G.cameras.length&&(G.cameras.length=0,Ut=!0);for(let Gt=0;Gt<vt.length;Gt++){const Kt=vt[Gt];let ce=null;if(d!==null)ce=d.getViewport(Kt);else{const fe=p.getViewSubImage(u,Kt);ce=fe.viewport,Gt===0&&(t.setRenderTargetTextures(M,fe.colorTexture,fe.depthStencilTexture),t.setRenderTarget(M))}let Vt=F[Gt];Vt===void 0&&(Vt=new Qe,Vt.layers.enable(Gt),Vt.viewport=new me,F[Gt]=Vt),Vt.matrix.fromArray(Kt.transform.matrix),Vt.matrix.decompose(Vt.position,Vt.quaternion,Vt.scale),Vt.projectionMatrix.fromArray(Kt.projectionMatrix),Vt.projectionMatrixInverse.copy(Vt.projectionMatrix).invert(),Vt.viewport.set(ce.x,ce.y,ce.width,ce.height),Gt===0&&(G.matrix.copy(Vt.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale)),Ut===!0&&G.cameras.push(Vt)}const gt=n.enabledFeatures;if(gt&&gt.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&S){p=i.getBinding();const Gt=p.getDepthInformation(vt[0]);Gt&&Gt.isValid&&Gt.texture&&m.init(Gt,n.renderState)}if(gt&&gt.includes("camera-access")&&S){t.state.unbindTexture(),p=i.getBinding();for(let Gt=0;Gt<vt.length;Gt++){const Kt=vt[Gt].camera;if(Kt){let ce=f[Kt];ce||(ce=new wc,f[Kt]=ce);const Vt=p.getCameraImage(Kt);ce.sourceTexture=Vt}}}}for(let vt=0;vt<b.length;vt++){const Ut=E[vt],gt=b[vt];Ut!==null&&gt!==void 0&&gt.update(Ut,Q,c||a)}le&&le(Y,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),g=null}const Jt=new Cc;Jt.setAnimationLoop(qt),this.setAnimationLoop=function(Y){le=Y},this.dispose=function(){}}}const o0=new ie,Fc=new Nt;Fc.set(-1,0,0,0,1,0,0,0,1);function l0(s,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,Ec(s)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function n(m,f,y,A,M){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?r(m,f):f.isMeshLambertMaterial?(r(m,f),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(r(m,f),p(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(r(m,f),u(m,f),f.isMeshPhysicalMaterial&&d(m,f,M)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),S(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,y,A):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Xe&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Xe&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const y=t.get(f),A=y.envMap,M=y.envMapRotation;A&&(m.envMap.value=A,m.envMapRotation.value.setFromMatrix4(o0.makeRotationFromEuler(M)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Fc),m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,y,A){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*y,m.scale.value=A*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function p(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function u(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function d(m,f,y){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Xe&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.retroreflectivity>0&&(m.retroreflectivity.value=f.retroreflectivity),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function S(m,f){const y=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function c0(s,t,e,i){let n={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,b){const E=b.program;i.uniformBlockBinding(M,E)}function c(M,b){let E=n[M.id];E===void 0&&(m(M),E=h(M),n[M.id]=E,M.addEventListener("dispose",y));const C=b.program;i.updateUBOMapping(M,C);const x=t.render.frame;r[M.id]!==x&&(u(M),r[M.id]=x)}function h(M){const b=p();M.__bindingPointIndex=b;const E=s.createBuffer(),C=M.__size,x=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,E),s.bufferData(s.UNIFORM_BUFFER,C,x),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,b,E),E}function p(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return Yt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(M){const b=n[M.id],E=M.uniforms,C=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,b);for(let x=0,w=E.length;x<w;x++){const P=E[x];if(Array.isArray(P))for(let I=0,F=P.length;I<F;I++)d(P[I],x,I,C);else d(P,x,0,C)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(M,b,E,C){if(S(M,b,E,C)===!0){const x=M.__offset,w=M.value;if(Array.isArray(w)){let P=0;for(let I=0;I<w.length;I++){const F=w[I],G=f(F);g(F,M.__data,P),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(P+=G.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(w,M.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,x,M.__data)}}function g(M,b,E){typeof M=="number"||typeof M=="boolean"?b[0]=M:M.isMatrix3?(b[0]=M.elements[0],b[1]=M.elements[1],b[2]=M.elements[2],b[3]=0,b[4]=M.elements[3],b[5]=M.elements[4],b[6]=M.elements[5],b[7]=0,b[8]=M.elements[6],b[9]=M.elements[7],b[10]=M.elements[8],b[11]=0):ArrayBuffer.isView(M)?b.set(new M.constructor(M.buffer,M.byteOffset,b.length)):M.toArray(b,E)}function S(M,b,E,C){const x=M.value,w=b+"_"+E;if(C[w]===void 0)return typeof x=="number"||typeof x=="boolean"?C[w]=x:ArrayBuffer.isView(x)?C[w]=x.slice():C[w]=x.clone(),!0;{const P=C[w];if(typeof x=="number"||typeof x=="boolean"){if(P!==x)return C[w]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(P.equals(x)===!1)return P.copy(x),!0}}return!1}function m(M){const b=M.uniforms;let E=0;const C=16;for(let w=0,P=b.length;w<P;w++){const I=Array.isArray(b[w])?b[w]:[b[w]];for(let F=0,G=I.length;F<G;F++){const N=I[F],k=Array.isArray(N.value)?N.value:[N.value];for(let K=0,W=k.length;K<W;K++){const nt=k[K],q=f(nt),j=E%C,it=j%q.boundary,Ct=j+it;E+=it,Ct!==0&&C-Ct<q.storage&&(E+=C-Ct),N.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=E,E+=q.storage}}}const x=E%C;return x>0&&(E+=C-x),M.__size=E,M.__cache={},this}function f(M){const b={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(b.boundary=4,b.storage=4):M.isVector2?(b.boundary=8,b.storage=8):M.isVector3||M.isColor?(b.boundary=16,b.storage=12):M.isVector4?(b.boundary=16,b.storage=16):M.isMatrix3?(b.boundary=48,b.storage=48):M.isMatrix4?(b.boundary=64,b.storage=64):M.isTexture?It("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(b.boundary=16,b.storage=M.byteLength):It("WebGLRenderer: Unsupported uniform value type.",M),b}function y(M){const b=M.target;b.removeEventListener("dispose",y);const E=a.indexOf(b.__bindingPointIndex);a.splice(E,1),s.deleteBuffer(n[b.id]),delete n[b.id],delete r[b.id]}function A(){for(const M in n)s.deleteBuffer(n[M]);a=[],n={},r={}}return{bind:l,update:c,dispose:A}}const h0=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let pi=null;function u0(){return pi===null&&(pi=new yc(h0,16,16,on,Ke),pi.name="DFG_LUT",pi.minFilter=ke,pi.magFilter=ke,pi.wrapS=Ci,pi.wrapT=Ci,pi.generateMipmaps=!1,pi.needsUpdate=!0),pi}class d0{constructor(t={}){const{canvas:e=Eh(),context:i=null,depth:n=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:u=!1,outputBufferType:d=je}=t;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=a;const S=d,m=new Set([mo,po,fo]),f=new Set([je,yi,cs,hs,co,ho]),y=new Uint32Array(4),A=new Int32Array(4),M=new R;let b=null,E=null;const C=[],x=[];let w=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Mi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let I=!1,F=null,G=null,N=null,k=null;this._outputColorSpace=we;let K=0,W=0,nt=null,q=-1,j=null;const it=new me,Ct=new me;let At=null;const le=new Dt(0);let qt=0,Jt=e.width,Y=e.height,Q=1,vt=null,Ut=null;const gt=new me(0,0,Jt,Y),Bt=new me(0,0,Jt,Y);let be=!1;const Gt=new So;let Kt=!1,ce=!1;const Vt=new ie,fe=new R,Ce=new me,Ye={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let pe=!1;function ve(){return nt===null?Q:1}let U=i;function Fe(v,L){return e.getContext(v,L)}let ee,T,_,O,H,X,st,rt,Z,J,at,Et,ht,ot,Tt,Lt,Ft,D,lt,$,ct,pt,et;try{const v={alpha:!0,depth:n,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:p};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${eo}`),e.addEventListener("webglcontextlost",he,!1),e.addEventListener("webglcontextrestored",Qt,!1),e.addEventListener("webglcontextcreationerror",ri,!1),U===null){const L="webgl2";if(U=Fe(L,v),U===null)throw Fe(L)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Rt()}catch(v){throw e.removeEventListener("webglcontextlost",he,!1),e.removeEventListener("webglcontextrestored",Qt,!1),e.removeEventListener("webglcontextcreationerror",ri,!1),Yt("WebGLRenderer: "+v.message),v}function Rt(){ee=new up(U),ee.init(),ct=new i0(U,ee),T=new ep(U,ee,t,ct),_=new t0(U,ee),T.reversedDepthBuffer&&u&&_.buffers.depth.setReversed(!0),G=U.createFramebuffer(),N=U.createFramebuffer(),k=U.createFramebuffer(),O=new pp(U),H=new km,X=new e0(U,ee,_,H,T,ct,O),st=new hp(P),rt=new mu(U),pt=new jf(U,rt),Z=new dp(U,rt,O,pt),J=new gp(U,Z,rt,pt,O),D=new mp(U,T,X),Tt=new ip(H),at=new Bm(P,st,ee,T,pt,Tt),Et=new l0(P,H),ht=new Hm,ot=new Zm(ee),Ft=new Qf(P,st,_,J,g,l),Lt=new jm(P,J,T),et=new c0(U,O,T,_),lt=new tp(U,ee,O),$=new fp(U,ee,O),O.programs=at.programs,P.capabilities=T,P.extensions=ee,P.properties=H,P.renderLists=ht,P.shadowMap=Lt,P.state=_,P.info=O}S!==je&&(w=new xp(S,e.width,e.height,o,n,r));const yt=new a0(P,U);this.xr=yt,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const v=ee.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){const v=ee.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(v){v!==void 0&&(Q=v,this.setSize(Jt,Y,!1))},this.getSize=function(v){return v.set(Jt,Y)},this.setSize=function(v,L,V=!0){if(yt.isPresenting){It("WebGLRenderer: Can't change size while VR device is presenting.");return}Jt=v,Y=L,e.width=Math.floor(v*Q),e.height=Math.floor(L*Q),V===!0&&(e.style.width=v+"px",e.style.height=L+"px"),w!==null&&w.setSize(e.width,e.height),this.setViewport(0,0,v,L)},this.getDrawingBufferSize=function(v){return v.set(Jt*Q,Y*Q).floor()},this.setDrawingBufferSize=function(v,L,V){Jt=v,Y=L,Q=V,e.width=Math.floor(v*V),e.height=Math.floor(L*V),this.setViewport(0,0,v,L)},this.setEffects=function(v){if(S===je){Yt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(v){for(let L=0;L<v.length;L++)if(v[L].isOutputPass===!0){It("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(v||[])},this.getCurrentViewport=function(v){return v.copy(it)},this.getViewport=function(v){return v.copy(gt)},this.setViewport=function(v,L,V,z){v.isVector4?gt.set(v.x,v.y,v.z,v.w):gt.set(v,L,V,z),_.viewport(it.copy(gt).multiplyScalar(Q).round())},this.getScissor=function(v){return v.copy(Bt)},this.setScissor=function(v,L,V,z){v.isVector4?Bt.set(v.x,v.y,v.z,v.w):Bt.set(v,L,V,z),_.scissor(Ct.copy(Bt).multiplyScalar(Q).round())},this.getScissorTest=function(){return be},this.setScissorTest=function(v){_.setScissorTest(be=v)},this.setOpaqueSort=function(v){vt=v},this.setTransparentSort=function(v){Ut=v},this.getClearColor=function(v){return v.copy(Ft.getClearColor())},this.setClearColor=function(){Ft.setClearColor(...arguments)},this.getClearAlpha=function(){return Ft.getClearAlpha()},this.setClearAlpha=function(){Ft.setClearAlpha(...arguments)},this.clear=function(v=!0,L=!0,V=!0){let z=0;if(v){let B=!1;if(nt!==null){const ft=nt.texture.format;B=m.has(ft)}if(B){const ft=nt.texture.type,_t=f.has(ft),dt=Ft.getClearColor(),Mt=Ft.getClearAlpha(),bt=dt.r,Ot=dt.g,Ht=dt.b;_t?(y[0]=bt,y[1]=Ot,y[2]=Ht,y[3]=Mt,U.clearBufferuiv(U.COLOR,0,y)):(A[0]=bt,A[1]=Ot,A[2]=Ht,A[3]=Mt,U.clearBufferiv(U.COLOR,0,A))}else z|=U.COLOR_BUFFER_BIT}L&&(z|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),V&&(z|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z!==0&&U.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(v){v.setRenderer(this),F=v},this.dispose=function(){e.removeEventListener("webglcontextlost",he,!1),e.removeEventListener("webglcontextrestored",Qt,!1),e.removeEventListener("webglcontextcreationerror",ri,!1),Ft.dispose(),ht.dispose(),ot.dispose(),H.dispose(),st.dispose(),J.dispose(),pt.dispose(),et.dispose(),at.dispose(),yt.dispose(),yt.removeEventListener("sessionstart",Fo),yt.removeEventListener("sessionend",Oo),Zi.stop()};function he(v){v.preventDefault(),cr("WebGLRenderer: Context Lost."),I=!0}function Qt(){cr("WebGLRenderer: Context Restored."),I=!1;const v=O.autoReset,L=Lt.enabled,V=Lt.autoUpdate,z=Lt.needsUpdate,B=Lt.type;Rt(),O.autoReset=v,Lt.enabled=L,Lt.autoUpdate=V,Lt.needsUpdate=z,Lt.type=B}function ri(v){Yt("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function ui(v){const L=v.target;L.removeEventListener("dispose",ui),zc(L)}function zc(v){Bc(v),H.remove(v)}function Bc(v){const L=H.get(v).programs;L!==void 0&&(L.forEach(function(V){at.releaseProgram(V)}),v.isShaderMaterial&&at.releaseShaderCache(v))}this.renderBufferDirect=function(v,L,V,z,B,ft){L===null&&(L=Ye);const _t=B.isMesh&&B.matrixWorld.determinantAffine()<0,dt=Hc(v,L,V,z,B);_.setMaterial(z,_t);let Mt=V.index,bt=1;if(z.wireframe===!0){if(Mt=Z.getWireframeAttribute(V),Mt===void 0)return;bt=2}const Ot=V.drawRange,Ht=V.attributes.position;let St=Ot.start*bt,jt=(Ot.start+Ot.count)*bt;ft!==null&&(St=Math.max(St,ft.start*bt),jt=Math.min(jt,(ft.start+ft.count)*bt)),Mt!==null?(St=Math.max(St,0),jt=Math.min(jt,Mt.count)):Ht!=null&&(St=Math.max(St,0),jt=Math.min(jt,Ht.count));const Me=jt-St;if(Me<0||Me===1/0)return;pt.setup(B,z,dt,V,Mt);let de,ae=lt;if(Mt!==null&&(de=rt.get(Mt),ae=$,ae.setIndex(de)),B.isMesh)z.wireframe===!0?(_.setLineWidth(z.wireframeLinewidth*ve()),ae.setMode(U.LINES)):ae.setMode(U.TRIANGLES);else if(B.isLine){let Oe=z.linewidth;Oe===void 0&&(Oe=1),_.setLineWidth(Oe*ve()),B.isLineSegments?ae.setMode(U.LINES):B.isLineLoop?ae.setMode(U.LINE_LOOP):ae.setMode(U.LINE_STRIP)}else B.isPoints?ae.setMode(U.POINTS):B.isSprite&&ae.setMode(U.TRIANGLES);if(B.isBatchedMesh)if(ee.get("WEBGL_multi_draw"))ae.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Oe=B._multiDrawStarts,mt=B._multiDrawCounts,He=B._multiDrawCount,Zt=Mt?rt.get(Mt).bytesPerElement:1,ti=H.get(z).currentProgram.getUniforms();for(let di=0;di<He;di++)ti.setValue(U,"_gl_DrawID",di),ae.render(Oe[di]/Zt,mt[di])}else if(B.isInstancedMesh)ae.renderInstances(St,Me,B.count);else if(V.isInstancedBufferGeometry){const Oe=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,mt=Math.min(V.instanceCount,Oe);ae.renderInstances(St,Me,mt)}else ae.render(St,Me)};function No(v,L,V,z){F!==null&&v.isNodeMaterial&&F.setObject(z,v),Kt===!0&&Tt.setState(v,V,!1),v.transparent===!0&&v.side===_e&&v.forceSinglePass===!1?(v.side=Xe,v.needsUpdate=!0,gs(v,L,z),v.side=rn,v.needsUpdate=!0,gs(v,L,z),v.side=_e):gs(v,L,z)}this.compile=function(v,L,V=null){V===null&&(V=v),F!==null&&F.renderStart(v,L,V),E=ot.get(V),E.init(L),x.push(E),V.traverseVisible(function(B){B.isLight&&B.layers.test(L.layers)&&(E.pushLight(B),B.castShadow&&E.pushShadow(B))}),v!==V&&v.traverseVisible(function(B){B.isLight&&B.layers.test(L.layers)&&(E.pushLight(B),B.castShadow&&E.pushShadow(B))}),E.setupLights(),F!==null&&F.updateLights(E.state.lightsArray),ce=this.localClippingEnabled,Kt=Tt.init(this.clippingPlanes,ce),Kt===!0&&Tt.setGlobalState(this.clippingPlanes,L),F!==null&&Lt.render(E.state.shadowsArray,V,L);const z=new Set;return v.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const ft=B.material;if(ft)if(Array.isArray(ft))for(let _t=0;_t<ft.length;_t++){const dt=ft[_t];No(dt,V,L,B),z.add(dt)}else No(ft,V,L,B),z.add(ft)}),E=x.pop(),F!==null&&F.renderEnd(),z},this.compileAsync=function(v,L,V=null){const z=this.compile(v,L,V);return new Promise(B=>{function ft(){if(z.forEach(function(_t){const Mt=H.get(_t).currentProgram;(Mt===void 0||Mt.isReady())&&z.delete(_t)}),z.size===0){B(v);return}setTimeout(ft,10)}ee.get("KHR_parallel_shader_compile")!==null?ft():setTimeout(ft,10)})};let Sr=null;function kc(v){Sr&&Sr(v)}function Fo(){Zi.stop()}function Oo(){Zi.start()}const Zi=new Cc;Zi.setAnimationLoop(kc),typeof self<"u"&&Zi.setContext(self),this.setAnimationLoop=function(v){Sr=v,yt.setAnimationLoop(v),v===null?Zi.stop():Zi.start()},yt.addEventListener("sessionstart",Fo),yt.addEventListener("sessionend",Oo),this.render=function(v,L){if(L!==void 0&&L.isCamera!==!0){Yt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;F!==null&&F.renderStart(v,L);const V=yt.enabled===!0&&yt.isPresenting===!0,z=w!==null&&(nt===null||V)&&w.begin(P,nt);if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),yt.enabled===!0&&yt.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(yt.cameraAutoUpdate===!0&&yt.updateCamera(L),L=yt.getCamera()),v.isScene===!0&&v.onBeforeRender(P,v,L,nt),E=ot.get(v,x.length),E.init(L),E.state.textureUnits=X.getTextureUnits(),x.push(E),Vt.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),Gt.setFromProjectionMatrix(Vt,xi,L.reversedDepth),ce=this.localClippingEnabled,Kt=Tt.init(this.clippingPlanes,ce),b=ht.get(v,C.length),b.init(),C.push(b),yt.enabled===!0&&yt.isPresenting===!0){const _t=P.xr.getDepthSensingMesh();_t!==null&&yr(_t,L,-1/0,P.sortObjects)}yr(v,L,0,P.sortObjects),b.finish(),F!==null&&F.updateLights(E.state.lightsArray),P.sortObjects===!0&&b.sort(vt,Ut),pe=yt.enabled===!1||yt.isPresenting===!1||yt.hasDepthSensing()===!1,pe&&Ft.addToRenderList(b,v),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Kt===!0&&Tt.beginShadows();const B=E.state.shadowsArray;if(Lt.render(B,v,L),Kt===!0&&Tt.endShadows(),(z&&w.hasRenderPass())===!1){const _t=b.opaque,dt=b.transmissive;if(E.setupLights(),L.isArrayCamera){const Mt=L.cameras;if(dt.length>0)for(let bt=0,Ot=Mt.length;bt<Ot;bt++){const Ht=Mt[bt];Bo(_t,dt,v,Ht)}pe&&Ft.render(v);for(let bt=0,Ot=Mt.length;bt<Ot;bt++){const Ht=Mt[bt];zo(b,v,Ht,Ht.viewport)}}else dt.length>0&&Bo(_t,dt,v,L),pe&&Ft.render(v),zo(b,v,L)}nt!==null&&W===0&&(X.updateMultisampleRenderTarget(nt),X.updateRenderTargetMipmap(nt)),z&&w.end(P),v.isScene===!0&&v.onAfterRender(P,v,L),pt.resetDefaultState(),q=-1,j=null,x.pop(),x.length>0?(E=x[x.length-1],X.setTextureUnits(E.state.textureUnits),Kt===!0&&Tt.setGlobalState(P.clippingPlanes,E.state.camera)):E=null,C.pop(),C.length>0?b=C[C.length-1]:b=null,F!==null&&F.renderEnd()};function yr(v,L,V,z){if(v.visible===!1)return;if(v.layers.test(L.layers)){if(v.isGroup)V=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(L);else if(v.isLightProbeGrid)E.pushLightProbeGrid(v);else if(v.isLight)E.pushLight(v),v.castShadow&&E.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||v.intersectsFrustum(Gt)){z&&Ce.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Vt);const _t=J.update(v),dt=v.material;dt.visible&&b.push(v,_t,dt,V,Ce.z,null,L)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||v.intersectsFrustum(Gt))){const _t=J.update(v),dt=v.material;if(z&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),Ce.copy(v.boundingSphere.center)):(_t.boundingSphere===null&&_t.computeBoundingSphere(),Ce.copy(_t.boundingSphere.center)),Ce.applyMatrix4(v.matrixWorld).applyMatrix4(Vt)),Array.isArray(dt)){const Mt=_t.groups;for(let bt=0,Ot=Mt.length;bt<Ot;bt++){const Ht=Mt[bt],St=dt[Ht.materialIndex];St&&St.visible&&b.push(v,_t,St,V,Ce.z,Ht,L)}}else dt.visible&&b.push(v,_t,dt,V,Ce.z,null,L)}}const ft=v.children;for(let _t=0,dt=ft.length;_t<dt;_t++)yr(ft[_t],L,V,z)}function zo(v,L,V,z){const{opaque:B,transmissive:ft,transparent:_t}=v;E.setupLightsView(V),Kt===!0&&Tt.setGlobalState(P.clippingPlanes,V),z&&_.viewport(it.copy(z)),B.length>0&&ms(B,L,V),ft.length>0&&ms(ft,L,V),_t.length>0&&ms(_t,L,V),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function Bo(v,L,V,z){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[z.id]===void 0){const St=ee.has("EXT_color_buffer_half_float")||ee.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[z.id]=new qe(1,1,{generateMipmaps:!0,type:St?Ke:je,minFilter:tn,samples:Math.max(4,T.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Wt.workingColorSpace})}const ft=E.state.transmissionRenderTarget[z.id],_t=z.viewport||it;ft.setSize(_t.z*P.transmissionResolutionScale,_t.w*P.transmissionResolutionScale);const dt=P.getRenderTarget(),Mt=P.getActiveCubeFace(),bt=P.getActiveMipmapLevel();P.setRenderTarget(ft),P.getClearColor(le),qt=P.getClearAlpha(),qt<1&&P.setClearColor(16777215,.5),P.clear(),pe&&Ft.render(V);const Ot=P.toneMapping;P.toneMapping=Mi;const Ht=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),E.setupLightsView(z),Kt===!0&&Tt.setGlobalState(P.clippingPlanes,z),ms(v,V,z),X.updateMultisampleRenderTarget(ft),X.updateRenderTargetMipmap(ft),ee.has("WEBGL_multisampled_render_to_texture")===!1){let St=!1;for(let jt=0,Me=L.length;jt<Me;jt++){const de=L[jt],{object:ae,geometry:Oe,material:mt,group:He}=de;if(mt.side===_e&&ae.layers.test(z.layers)){const Zt=mt.side;mt.side=Xe,mt.needsUpdate=!0,ko(ae,V,z,Oe,mt,He),mt.side=Zt,mt.needsUpdate=!0,St=!0}}St===!0&&(X.updateMultisampleRenderTarget(ft),X.updateRenderTargetMipmap(ft))}P.setRenderTarget(dt,Mt,bt),P.setClearColor(le,qt),Ht!==void 0&&(z.viewport=Ht),P.toneMapping=Ot}function ms(v,L,V){const z=L.isScene===!0?L.overrideMaterial:null;for(let B=0,ft=v.length;B<ft;B++){const _t=v[B],{object:dt,geometry:Mt,group:bt}=_t;let Ot=_t.material;Ot.allowOverride===!0&&z!==null&&(Ot=z),dt.layers.test(V.layers)&&ko(dt,L,V,Mt,Ot,bt)}}function ko(v,L,V,z,B,ft){F!==null&&B.isNodeMaterial&&F.setObject(v,B),v.onBeforeRender(P,L,V,z,B,ft),v.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),B.onBeforeRender(P,L,V,z,v,ft),B.transparent===!0&&B.side===_e&&B.forceSinglePass===!1?(B.side=Xe,B.needsUpdate=!0,P.renderBufferDirect(V,L,z,B,v,ft),B.side=rn,B.needsUpdate=!0,P.renderBufferDirect(V,L,z,B,v,ft),B.side=_e):P.renderBufferDirect(V,L,z,B,v,ft),v.onAfterRender(P,L,V,z,B,ft)}function gs(v,L,V){L.isScene!==!0&&(L=Ye);const z=H.get(v),B=E.state.lights,ft=E.state.shadowsArray,_t=B.state.version,dt=at.getParameters(v,B.state,ft,L,V,E.state.lightProbeGridArray),Mt=at.getProgramCacheKey(dt);let bt=z.programs;z.environment=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?L.environment:null,z.fog=L.fog;const Ot=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap;z.envMap=st.get(v.envMap||z.environment,Ot),z.envMapRotation=z.environment!==null&&v.envMap===null?L.environmentRotation:v.envMapRotation,bt===void 0&&(v.addEventListener("dispose",ui),bt=new Map,z.programs=bt);let Ht=bt.get(Mt);if(Ht!==void 0){if(z.currentProgram===Ht&&z.lightsStateVersion===_t)return Ho(v,dt),Ht}else dt.uniforms=at.getUniforms(v),F!==null&&v.isNodeMaterial&&F.build(v,V,dt),v.onBeforeCompile(dt,P),Ht=at.acquireProgram(dt,Mt),bt.set(Mt,Ht),z.uniforms=dt.uniforms;const St=z.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(St.clippingPlanes=Tt.uniform),Ho(v,dt),z.needsLights=Wc(v),z.lightsStateVersion=_t,z.needsLights&&(St.ambientLightColor.value=B.state.ambient,St.lightProbe.value=B.state.probe,St.sunLights.value=B.state.sun,St.sunLightShadows.value=B.state.sunShadow,St.directionalLights.value=B.state.directional,St.directionalLightShadows.value=B.state.directionalShadow,St.spotLights.value=B.state.spot,St.spotLightShadows.value=B.state.spotShadow,St.rectAreaLights.value=B.state.rectArea,St.ltc_1.value=B.state.rectAreaLTC1,St.ltc_2.value=B.state.rectAreaLTC2,St.pointLights.value=B.state.point,St.pointLightShadows.value=B.state.pointShadow,St.hemisphereLights.value=B.state.hemi,St.sunShadowMatrix.value=B.state.sunShadowMatrix,St.sunShadowCascade.value=B.state.sunShadowCascade,St.directionalShadowMatrix.value=B.state.directionalShadowMatrix,St.spotLightMatrix.value=B.state.spotLightMatrix,St.spotLightMap.value=B.state.spotLightMap,St.pointShadowMatrix.value=B.state.pointShadowMatrix),z.lightProbeGrid=E.state.lightProbeGridArray.length>0,z.currentProgram=Ht,z.uniformsList=null,Ht}function Go(v){if(v.uniformsList===null){const L=v.currentProgram.getUniforms();v.uniformsList=ir.seqWithValue(L.seq,v.uniforms)}return v.uniformsList}function Ho(v,L){const V=H.get(v);V.outputColorSpace=L.outputColorSpace,V.batching=L.batching,V.batchingColor=L.batchingColor,V.instancing=L.instancing,V.instancingColor=L.instancingColor,V.instancingMorph=L.instancingMorph,V.skinning=L.skinning,V.morphTargets=L.morphTargets,V.morphNormals=L.morphNormals,V.morphColors=L.morphColors,V.morphTargetsCount=L.morphTargetsCount,V.numClippingPlanes=L.numClippingPlanes,V.numIntersection=L.numClipIntersection,V.vertexAlphas=L.vertexAlphas,V.vertexTangents=L.vertexTangents,V.toneMapping=L.toneMapping}function Gc(v,L){if(v.length===0)return null;if(v.length===1)return v[0].texture!==null?v[0]:null;M.setFromMatrixPosition(L.matrixWorld);for(let V=0,z=v.length;V<z;V++){const B=v[V];if(B.texture!==null&&B.boundingBox.containsPoint(M))return B}return null}function Hc(v,L,V,z,B){L.isScene!==!0&&(L=Ye),X.resetTextureUnits();const ft=L.fog,_t=z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial?L.environment:null,dt=nt===null?P.outputColorSpace:nt.isXRRenderTarget===!0?nt.texture.colorSpace:Wt.workingColorSpace,Mt=z.isMeshStandardMaterial||z.isMeshLambertMaterial&&!z.envMap||z.isMeshPhongMaterial&&!z.envMap,bt=st.get(z.envMap||_t,Mt),Ot=z.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Ht=!!V.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),St=!!V.morphAttributes.position,jt=!!V.morphAttributes.normal,Me=!!V.morphAttributes.color;let de=Mi;z.toneMapped&&(nt===null||nt.isXRRenderTarget===!0)&&(de=P.toneMapping);const ae=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Oe=ae!==void 0?ae.length:0,mt=H.get(z),He=E.state.lights;if(Kt===!0&&(ce===!0||v!==j)){const ue=v===j&&z.id===q;Tt.setState(z,v,ue)}let Zt=!1;z.version===mt.__version?(mt.needsLights&&mt.lightsStateVersion!==He.state.version||mt.outputColorSpace!==dt||B.isBatchedMesh&&mt.batching===!1||!B.isBatchedMesh&&mt.batching===!0||B.isBatchedMesh&&mt.batchingColor===!0&&B._colorsTexture===null||B.isBatchedMesh&&mt.batchingColor===!1&&B._colorsTexture!==null||B.isInstancedMesh&&mt.instancing===!1||!B.isInstancedMesh&&mt.instancing===!0||B.isSkinnedMesh&&mt.skinning===!1||!B.isSkinnedMesh&&mt.skinning===!0||B.isInstancedMesh&&mt.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&mt.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&mt.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&mt.instancingMorph===!1&&B.morphTexture!==null||mt.envMap!==bt||z.fog===!0&&mt.fog!==ft||mt.numClippingPlanes!==void 0&&(mt.numClippingPlanes!==Tt.numPlanes||mt.numIntersection!==Tt.numIntersection)||mt.vertexAlphas!==Ot||mt.vertexTangents!==Ht||mt.morphTargets!==St||mt.morphNormals!==jt||mt.morphColors!==Me||mt.toneMapping!==de||mt.morphTargetsCount!==Oe||!!mt.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(Zt=!0):(Zt=!0,mt.__version=z.version);let ti=mt.currentProgram;Zt===!0&&(ti=gs(z,L,B),F&&z.isNodeMaterial&&F.onUpdateProgram(z,ti,mt));let di=!1,Di=!1,dn=!1;const ne=ti.getUniforms(),xe=mt.uniforms;if(_.useProgram(ti.program)&&(di=!0,Di=!0,dn=!0),z.id!==q&&(q=z.id,Di=!0),mt.needsLights){const ue=Gc(E.state.lightProbeGridArray,B);mt.lightProbeGrid!==ue&&(mt.lightProbeGrid=ue,Di=!0)}if(di||j!==v){_.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),ne.setValue(U,"projectionMatrix",v.projectionMatrix),ne.setValue(U,"viewMatrix",v.matrixWorldInverse);const Ui=ne.map.cameraPosition;Ui!==void 0&&Ui.setValue(U,fe.setFromMatrixPosition(v.matrixWorld)),T.logarithmicDepthBuffer&&ne.setValue(U,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&ne.setValue(U,"isOrthographic",v.isOrthographicCamera===!0),j!==v&&(j=v,Di=!0,dn=!0)}if(mt.needsLights&&(He.state.sunShadowMap.length>0&&ne.setValue(U,"sunShadowMap",He.state.sunShadowMap,X),He.state.directionalShadowMap.length>0&&ne.setValue(U,"directionalShadowMap",He.state.directionalShadowMap,X),He.state.spotShadowMap.length>0&&ne.setValue(U,"spotShadowMap",He.state.spotShadowMap,X),He.state.pointShadowMap.length>0&&ne.setValue(U,"pointShadowMap",He.state.pointShadowMap,X)),B.isSkinnedMesh){ne.setOptional(U,B,"bindMatrix"),ne.setOptional(U,B,"bindMatrixInverse");const ue=B.skeleton;ue&&(ue.boneTexture===null&&ue.computeBoneTexture(),ne.setValue(U,"boneTexture",ue.boneTexture,X))}B.isBatchedMesh&&(ne.setOptional(U,B,"batchingTexture"),ne.setValue(U,"batchingTexture",B._matricesTexture,X),ne.setOptional(U,B,"batchingIdTexture"),ne.setValue(U,"batchingIdTexture",B._indirectTexture,X),ne.setOptional(U,B,"batchingColorTexture"),B._colorsTexture!==null&&ne.setValue(U,"batchingColorTexture",B._colorsTexture,X));const Ii=V.morphAttributes;if((Ii.position!==void 0||Ii.normal!==void 0||Ii.color!==void 0)&&D.update(B,V,ti),(Di||mt.receiveShadow!==B.receiveShadow)&&(mt.receiveShadow=B.receiveShadow,ne.setValue(U,"receiveShadow",B.receiveShadow)),(z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial)&&z.envMap===null&&L.environment!==null&&(xe.envMapIntensity.value=L.environmentIntensity),xe.dfgLUT!==void 0&&(xe.dfgLUT.value=u0()),Di){if(ne.setValue(U,"toneMappingExposure",P.toneMappingExposure),mt.needsLights&&Vc(xe,dn),ft&&z.fog===!0&&Et.refreshFogUniforms(xe,ft),Et.refreshMaterialUniforms(xe,z,Q,Y,E.state.transmissionRenderTarget[v.id]),mt.needsLights&&mt.lightProbeGrid){const ue=mt.lightProbeGrid;xe.probesSH.value=ue.texture,xe.probesMin.value.copy(ue.boundingBox.min),xe.probesMax.value.copy(ue.boundingBox.max),xe.probesResolution.value.copy(ue.resolution)}ir.upload(U,Go(mt),xe,X)}if(z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(ir.upload(U,Go(mt),xe,X),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&ne.setValue(U,"center",B.center),ne.setValue(U,"modelViewMatrix",B.modelViewMatrix),ne.setValue(U,"normalMatrix",B.normalMatrix),ne.setValue(U,"modelMatrix",B.matrixWorld),z.uniformsGroups!==void 0){const ue=z.uniformsGroups;for(let Ui=0,fn=ue.length;Ui<fn;Ui++){const Wo=ue[Ui];et.update(Wo,ti),et.bind(Wo,ti)}}return ti}function Vc(v,L){v.ambientLightColor.needsUpdate=L,v.lightProbe.needsUpdate=L,v.sunLights.needsUpdate=L,v.sunLightShadows.needsUpdate=L,v.directionalLights.needsUpdate=L,v.directionalLightShadows.needsUpdate=L,v.pointLights.needsUpdate=L,v.pointLightShadows.needsUpdate=L,v.spotLights.needsUpdate=L,v.spotLightShadows.needsUpdate=L,v.rectAreaLights.needsUpdate=L,v.hemisphereLights.needsUpdate=L}function Wc(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return K},this.getActiveMipmapLevel=function(){return W},this.getRenderTarget=function(){return nt},this.setRenderTargetTextures=function(v,L,V){const z=H.get(v);z.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),H.get(v.texture).__webglTexture=L,H.get(v.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:V,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,L){const V=H.get(v);V.__webglFramebuffer=L,V.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(v,L=0,V=0){nt=v,K=L,W=V;let z=null,B=!1,ft=!1;if(v){const dt=H.get(v);if(dt.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(U.FRAMEBUFFER,dt.__webglFramebuffer),it.copy(v.viewport),Ct.copy(v.scissor),At=v.scissorTest,_.viewport(it),_.scissor(Ct),_.setScissorTest(At),q=-1;return}else if(dt.__webglFramebuffer===void 0)X.setupRenderTarget(v);else if(dt.__hasExternalTextures)X.rebindTextures(v,H.get(v.texture).__webglTexture,H.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){const Ot=v.depthTexture;if(dt.__boundDepthTexture!==Ot){if(Ot!==null&&H.has(Ot)&&(v.width!==Ot.image.width||v.height!==Ot.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");X.setupDepthRenderbuffer(v)}}const Mt=v.texture;(Mt.isData3DTexture||Mt.isDataArrayTexture||Mt.isCompressedArrayTexture)&&(ft=!0);const bt=H.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(bt[L])?z=bt[L][V]:z=bt[L],B=!0):v.samples>0&&X.useMultisampledRTT(v)===!1?z=H.get(v).__webglMultisampledFramebuffer:Array.isArray(bt)?z=bt[V]:z=bt,it.copy(v.viewport),Ct.copy(v.scissor),At=v.scissorTest}else it.copy(gt).multiplyScalar(Q).floor(),Ct.copy(Bt).multiplyScalar(Q).floor(),At=be;if(V!==0&&(z=G),_.bindFramebuffer(U.FRAMEBUFFER,z)&&_.drawBuffers(v,z),_.viewport(it),_.scissor(Ct),_.setScissorTest(At),B){const dt=H.get(v.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+L,dt.__webglTexture,V)}else if(ft){const dt=L;for(let Mt=0;Mt<v.textures.length;Mt++){const bt=H.get(v.textures[Mt]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Mt,bt.__webglTexture,V,dt)}}else if(v!==null&&V!==0){const dt=H.get(v.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,dt.__webglTexture,V)}q=-1};function Vo(v){const L=H.get(v);return(L.__readFormat!==v.format||L.__readType!==v.type)&&(L.__readFormat=v.format,L.__readType=v.type,L.__formatReadable=T.textureFormatReadable(v.format),L.__typeReadable=T.textureTypeReadable(v.type)),L}this.readRenderTargetPixels=function(v,L,V,z,B,ft,_t,dt=0){if(!(v&&v.isWebGLRenderTarget)){Yt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Mt=H.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&_t!==void 0&&(Mt=Mt[_t]),Mt){_.bindFramebuffer(U.FRAMEBUFFER,Mt);try{const bt=v.textures[dt],Ot=bt.format,Ht=bt.type;v.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+dt);const St=Vo(bt);if(St.__formatReadable===!1){Yt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(St.__typeReadable===!1){Yt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=v.width-z&&V>=0&&V<=v.height-B&&U.readPixels(L,V,z,B,ct.convert(Ot),ct.convert(Ht),ft)}finally{const bt=nt!==null?H.get(nt).__webglFramebuffer:null;_.bindFramebuffer(U.FRAMEBUFFER,bt)}}},this.readRenderTargetPixelsAsync=async function(v,L,V,z,B,ft,_t,dt=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Mt=H.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&_t!==void 0&&(Mt=Mt[_t]),Mt)if(L>=0&&L<=v.width-z&&V>=0&&V<=v.height-B){_.bindFramebuffer(U.FRAMEBUFFER,Mt);const bt=v.textures[dt],Ot=bt.format,Ht=bt.type;v.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+dt);const St=Vo(bt);if(St.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(St.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const jt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,jt),U.bufferData(U.PIXEL_PACK_BUFFER,ft.byteLength,U.STREAM_READ),U.readPixels(L,V,z,B,ct.convert(Ot),ct.convert(Ht),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);const Me=nt!==null?H.get(nt).__webglFramebuffer:null;_.bindFramebuffer(U.FRAMEBUFFER,Me);const de=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Th(U,de,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,jt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,ft),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(jt),U.deleteSync(de),ft}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,L=null,V=0){const z=Math.pow(2,-V),B=Math.floor(v.image.width*z),ft=Math.floor(v.image.height*z),_t=L!==null?L.x:0,dt=L!==null?L.y:0;X.setTexture2D(v,0),U.copyTexSubImage2D(U.TEXTURE_2D,V,0,0,_t,dt,B,ft),_.unbindTexture()},this.copyTextureToTexture=function(v,L,V=null,z=null,B=0,ft=0){let _t,dt,Mt,bt,Ot,Ht,St,jt,Me;const de=v.isCompressedTexture?v.mipmaps[ft]:v.image;if(V!==null)_t=V.max.x-V.min.x,dt=V.max.y-V.min.y,Mt=V.isBox3?V.max.z-V.min.z:1,bt=V.min.x,Ot=V.min.y,Ht=V.isBox3?V.min.z:0;else{const xe=Math.pow(2,-B);_t=Math.floor(de.width*xe),dt=Math.floor(de.height*xe),v.isDataArrayTexture?Mt=de.depth:v.isData3DTexture?Mt=Math.floor(de.depth*xe):Mt=1,bt=0,Ot=0,Ht=0}z!==null?(St=z.x,jt=z.y,Me=z.z):(St=0,jt=0,Me=0);const ae=ct.convert(L.format),Oe=ct.convert(L.type);let mt;L.isData3DTexture?(X.setTexture3D(L,0),mt=U.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(X.setTexture2DArray(L,0),mt=U.TEXTURE_2D_ARRAY):(X.setTexture2D(L,0),mt=U.TEXTURE_2D),_.activeTexture(U.TEXTURE0),_.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,L.flipY),_.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),_.pixelStorei(U.UNPACK_ALIGNMENT,L.unpackAlignment);const He=_.getParameter(U.UNPACK_ROW_LENGTH),Zt=_.getParameter(U.UNPACK_IMAGE_HEIGHT),ti=_.getParameter(U.UNPACK_SKIP_PIXELS),di=_.getParameter(U.UNPACK_SKIP_ROWS),Di=_.getParameter(U.UNPACK_SKIP_IMAGES);_.pixelStorei(U.UNPACK_ROW_LENGTH,de.width),_.pixelStorei(U.UNPACK_IMAGE_HEIGHT,de.height),_.pixelStorei(U.UNPACK_SKIP_PIXELS,bt),_.pixelStorei(U.UNPACK_SKIP_ROWS,Ot),_.pixelStorei(U.UNPACK_SKIP_IMAGES,Ht);const dn=v.isDataArrayTexture||v.isData3DTexture,ne=L.isDataArrayTexture||L.isData3DTexture;if(v.isDepthTexture){const xe=H.get(v),Ii=H.get(L),ue=H.get(xe.__renderTarget),Ui=H.get(Ii.__renderTarget);_.bindFramebuffer(U.READ_FRAMEBUFFER,ue.__webglFramebuffer),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,Ui.__webglFramebuffer);for(let fn=0;fn<Mt;fn++)dn&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,H.get(v).__webglTexture,B,Ht+fn),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,H.get(L).__webglTexture,ft,Me+fn)),U.blitFramebuffer(bt,Ot,_t,dt,St,jt,_t,dt,U.DEPTH_BUFFER_BIT,U.NEAREST);_.bindFramebuffer(U.READ_FRAMEBUFFER,null),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(B!==0||v.isRenderTargetTexture||H.has(v)){const xe=H.get(v),Ii=H.get(L);_.bindFramebuffer(U.READ_FRAMEBUFFER,N),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,k);for(let ue=0;ue<Mt;ue++)dn?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,xe.__webglTexture,B,Ht+ue):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,xe.__webglTexture,B),ne?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ii.__webglTexture,ft,Me+ue):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Ii.__webglTexture,ft),B!==0?U.blitFramebuffer(bt,Ot,_t,dt,St,jt,_t,dt,U.COLOR_BUFFER_BIT,U.NEAREST):ne?U.copyTexSubImage3D(mt,ft,St,jt,Me+ue,bt,Ot,_t,dt):U.copyTexSubImage2D(mt,ft,St,jt,bt,Ot,_t,dt);_.bindFramebuffer(U.READ_FRAMEBUFFER,null),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else ne?v.isDataTexture||v.isData3DTexture?U.texSubImage3D(mt,ft,St,jt,Me,_t,dt,Mt,ae,Oe,de.data):L.isCompressedArrayTexture?U.compressedTexSubImage3D(mt,ft,St,jt,Me,_t,dt,Mt,ae,de.data):U.texSubImage3D(mt,ft,St,jt,Me,_t,dt,Mt,ae,Oe,de):v.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,ft,St,jt,_t,dt,ae,Oe,de.data):v.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,ft,St,jt,de.width,de.height,ae,de.data):U.texSubImage2D(U.TEXTURE_2D,ft,St,jt,_t,dt,ae,Oe,de);_.pixelStorei(U.UNPACK_ROW_LENGTH,He),_.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Zt),_.pixelStorei(U.UNPACK_SKIP_PIXELS,ti),_.pixelStorei(U.UNPACK_SKIP_ROWS,di),_.pixelStorei(U.UNPACK_SKIP_IMAGES,Di),ft===0&&L.generateMipmaps&&U.generateMipmap(mt),_.unbindTexture()},this.initRenderTarget=function(v){H.get(v).__webglFramebuffer===void 0&&X.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?X.setTextureCube(v,0):v.isData3DTexture?X.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?X.setTexture2DArray(v,0):X.setTexture2D(v,0),_.unbindTexture()},this.resetState=function(){K=0,W=0,nt=null,_.reset(),pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Wt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Wt._getUnpackColorSpace()}}const nr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Wn{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const f0=new xr(-1,1,1,-1,0,1);class p0 extends ge{constructor(){super(),this.setAttribute("position",new $t([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new $t([0,2,0,0,2,0],2))}}const m0=new p0;class Ao{constructor(t){this._mesh=new tt(m0,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,f0)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class g0 extends Wn{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof Ne?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=fs.clone(t.uniforms),this.material=new Ne({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Ao(this.material)}render(t,e,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Kl extends Wn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,i){const n=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),r.buffers.stencil.setFunc(n.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(n.EQUAL,1,4294967295),r.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),r.buffers.stencil.setLocked(!0)}}class _0 extends Wn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class x0{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const i=t.getSize(new wt);this._width=i.width,this._height=i.height,e=new qe(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ke}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new g0(nr),this.copyPass.material.blending=vi,this.timer=new uu}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());const e=this.renderer.getRenderTarget();let i=!1;for(let n=0,r=this.passes.length;n<r;n++){const a=this.passes[n];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(n),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),a.needsSwap){if(i){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Kl!==void 0&&(a instanceof Kl?i=!0:a instanceof _0&&(i=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new wt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const i=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(i,n),this.renderTarget2.setSize(i,n);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,n)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class v0 extends Wn{constructor(t,e,i=null,n=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=i,this.clearColor=n,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Dt}render(t,e,i){const n=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=n}}const M0={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Dt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Gn extends Wn{constructor(t,e=1,i,n){super(),this.strength=e,this.radius=i,this.threshold=n,this.resolution=t!==void 0?new wt(t.x,t.y):new wt(256,256),this.clearColor=new Dt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new qe(r,a,{type:Ke,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const p=new qe(r,a,{type:Ke,depthBuffer:!1});p.texture.name="UnrealBloomPass.h"+h,p.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(p);const u=new qe(r,a,{type:Ke,depthBuffer:!1});u.texture.name="UnrealBloomPass.v"+h,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),r=Math.round(r/2),a=Math.round(a/2)}const o=M0;this.highPassUniforms=fs.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ne({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new wt(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=fs.clone(nr.uniforms),this.blendMaterial=new Ne({uniforms:this.copyUniforms,vertexShader:nr.vertexShader,fragmentShader:nr.fragmentShader,premultipliedAlpha:!0,blending:oe,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Dt,this._oldClearAlpha=1,this._basic=new Ee,this._fsQuad=new Ao(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let i=Math.round(t/2),n=Math.round(e/2);this.renderTargetBright.setSize(i,n);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,n),this.renderTargetsVertical[r].setSize(i,n),this.separableBlurMaterials[r].uniforms.invSize.value=new wt(1/i,1/n),i=Math.round(i/2),n=Math.round(n/2)}render(t,e,i,n,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=Gn.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Gn.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(i),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){const e=[],i=t/3;for(let a=0;a<t;a++)e.push(.39894*Math.exp(-.5*a*a/(i*i))/i);const n=[],r=[];for(let a=1;a<t;a+=2){const o=e[a],l=a+1<t?e[a+1]:0,c=o+l;n.push((a*o+(a+1)*l)/c),r.push(c)}return new Ne({defines:{KERNEL_PAIRS:n.length},uniforms:{colorTexture:{value:null},invSize:{value:new wt(.5,.5)},direction:{value:new wt(.5,.5)},centerWeight:{value:e[0]},gaussianOffsets:{value:n},gaussianWeights:{value:r}},vertexShader:`

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

				}`})}_getCompositeMaterial(t){return new Ne({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}}Gn.BlurDirectionX=new wt(1,0);Gn.BlurDirectionY=new wt(0,1);const Xs={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class S0 extends Wn{constructor(){super(),this.isOutputPass=!0,this.uniforms=fs.clone(Xs.uniforms),this.material=new Tc({name:Xs.name,uniforms:this.uniforms,vertexShader:Xs.vertexShader,fragmentShader:Xs.fragmentShader}),this._fsQuad=new Ao(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Wt.getTransfer(this._outputColorSpace)===te&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===io?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===no?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===so?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===dr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ao?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===oo?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===ro&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const na=Math.PI*2;function Xn(s){let t=s>>>0;return function(){t|=0,t=t+1831565813|0;let i=Math.imul(t^t>>>15,1|t);return i=i+Math.imul(i^i>>>7,61|i)^i,((i^i>>>14)>>>0)/4294967296}}function xt(s=0,t=1){return s+Math.random()*(t-s)}function De(s,t,e){return s<t?t:s>e?e:s}function y0(s,t,e){return s+(t-s)*e}function Le(s,t,e,i){return y0(s,t,1-Math.exp(-e*i))}function b0(s,t=Math.random){return s[Math.floor(t()*s.length)]}function sa(s){return Math.max(0,Math.floor(s)).toString().padStart(6,"0")}function $l(s,t){let e=(t-s)%na;return e>Math.PI&&(e-=na),e<-Math.PI&&(e+=na),e}function bi(s,t){const e=document.createElement("canvas");return e.width=s,e.height=t,e}function Ro(s,t,e,i,n,r=.05,a=1){for(let o=0;o<i;o+=1){const l=Math.floor(n()*70);s.fillStyle=`rgba(${l},${l},${l+4},${r*n()})`,s.fillRect(n()*t,n()*e,a*(.4+n()),a*(.4+n()))}}function Oc(s,t,e,i,n=12){for(let r=0;r<n;r+=1){const a=i()*t,o=i()*e,l=12+i()*64,c=s.createRadialGradient(a,o,0,a,o,l);c.addColorStop(0,`rgba(${90+i()*40},${36+i()*22},14,${.08+i()*.12})`),c.addColorStop(1,"rgba(40,16,6,0)"),s.fillStyle=c,s.beginPath(),s.arc(a,o,l,0,Math.PI*2),s.fill()}}function Co(s,t,e,i,n=18){s.strokeStyle="rgba(0,0,0,0.55)";for(let r=0;r<n;r+=1){let a=i()*t,o=i()*e;s.lineWidth=.7+i()*1.2,s.beginPath(),s.moveTo(a,o);const l=3+Math.floor(i()*6);for(let c=0;c<l;c+=1)a+=(i()-.5)*38,o+=(i()-.5)*38,s.lineTo(a,o);s.stroke()}}function Gi(s,t=1,e=1){const i=new Hn(s);return i.wrapS=ls,i.wrapT=ls,i.repeat.set(t,e),i.colorSpace=we,i.anisotropy=8,i}function Jl(){const t=bi(512,512),e=t.getContext("2d"),i=Xn(596675);e.fillStyle="#2a2d36",e.fillRect(0,0,512,512);const n=4,r=512/n;for(let a=0;a<n;a+=1)for(let o=0;o<n;o+=1){const l=o*r,c=a*r,h=38+Math.floor(i()*20),p=e.createLinearGradient(l,c,l+r,c+r);p.addColorStop(0,`rgb(${h+8},${h+9},${h+14})`),p.addColorStop(.55,`rgb(${h},${h+1},${h+5})`),p.addColorStop(1,`rgb(${h-7},${h-6},${h-2})`),e.fillStyle=p,e.fillRect(l+3,c+3,r-6,r-6),e.strokeStyle="rgba(130,140,160,0.16)",e.lineWidth=2,e.beginPath(),e.moveTo(l+3,c+r-3),e.lineTo(l+3,c+3),e.lineTo(l+r-3,c+3),e.stroke(),e.strokeStyle="rgba(0,0,0,0.55)",e.beginPath(),e.moveTo(l+r-3,c+3),e.lineTo(l+r-3,c+r-3),e.lineTo(l+3,c+r-3),e.stroke();for(const[u,d]of[[14,14],[r-14,14],[14,r-14],[r-14,r-14]])e.fillStyle="rgba(8,9,12,0.9)",e.beginPath(),e.arc(l+u,c+d,3.4,0,Math.PI*2),e.fill(),e.fillStyle="rgba(150,158,170,0.18)",e.beginPath(),e.arc(l+u-.7,c+d-.7,1.5,0,Math.PI*2),e.fill();if(i()>.55){const u=l+22+i()*(r-44),d=c+20+i()*(r-40);e.fillStyle="rgba(255,106,36,0.10)",e.fillRect(u,d,2+i()*20,1)}}e.strokeStyle="rgba(4,5,8,0.85)",e.lineWidth=3;for(let a=0;a<=n;a+=1)e.beginPath(),e.moveTo(a*r,0),e.lineTo(a*r,512),e.stroke(),e.beginPath(),e.moveTo(0,a*r),e.lineTo(512,a*r),e.stroke();Co(e,512,512,i,30),Oc(e,512,512,i,16),Ro(e,512,512,26e3,i,.07),e.save(),e.translate(512/2,512/2),e.rotate(Math.PI/4),e.globalAlpha=.05;for(let a=-512;a<512;a+=42)e.fillStyle=a%84===0?"#ff5a1f":"#000000",e.fillRect(a,-512,18,512*2);return e.restore(),t}function Ql(){const t=bi(512,512),e=t.getContext("2d"),i=Xn(129338);e.fillStyle="#1a1c23",e.fillRect(0,0,512,512);const n=6,r=512/n,a=512/3;for(let o=0;o<n;o+=1){const l=o%2===0?0:-a/2;for(let c=-1;c<4;c+=1){const h=c*a+l,p=o*r,u=44+Math.floor(i()*20),d=e.createLinearGradient(h,p,h+a,p+r);d.addColorStop(0,`rgb(${u+7},${u+8},${u+13})`),d.addColorStop(.6,`rgb(${u},${u+1},${u+6})`),d.addColorStop(1,`rgb(${u-10},${u-9},${u-5})`),e.fillStyle=d,e.fillRect(h+2,p+2,a-4,r-4),e.fillStyle="rgba(0,0,0,0.34)",e.fillRect(h,p+r-3,a,3),e.fillStyle="rgba(255,255,255,0.055)",e.fillRect(h+2,p+2,a-4,2),e.strokeStyle="rgba(0,0,0,0.22)",e.lineWidth=1;for(let g=0;g<4;g+=1){const S=h+8+i()*(a-16),m=p+8+i()*(r-16);e.beginPath(),e.moveTo(S,m),e.lineTo(S+8+i()*22,m+(i()-.5)*5),e.stroke()}}}for(let o=0;o<32;o+=1){const l=i()*512,c=i()*512*.6,h=40+i()*220,p=e.createLinearGradient(l,c,l,c+h);p.addColorStop(0,"rgba(0,0,0,0.22)"),p.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=p,e.fillRect(l,c,1+i()*4,h)}return Oc(e,512,512,i,18),Co(e,512,512,i,12),Ro(e,512,512,2e4,i,.06),t}function jl(){const t=bi(512,512),e=t.getContext("2d"),i=Xn(490449);e.fillStyle="#2a2d36",e.fillRect(0,0,512,512);for(let r=0;r<9e3;r+=1){const a=20+Math.floor(i()*60);e.fillStyle=`rgba(${a},${a+3},${a+8},${.05+i()*.08})`,e.fillRect(i()*512,i()*512,1+i()*26,1)}const n=512/2;for(let r=0;r<2;r+=1)for(let a=0;a<2;a+=1){const o=a*n,l=r*n,c=e.createLinearGradient(o,l,o,l+n);c.addColorStop(0,"rgba(255,255,255,0.055)"),c.addColorStop(.5,"rgba(0,0,0,0.02)"),c.addColorStop(1,"rgba(0,0,0,0.28)"),e.fillStyle=c,e.fillRect(o+3,l+3,n-6,n-6),e.strokeStyle="rgba(0,0,0,0.65)",e.lineWidth=3,e.strokeRect(o+2,l+2,n-4,n-4),e.strokeStyle="rgba(150,160,180,0.1)",e.lineWidth=1,e.strokeRect(o+5,l+5,n-10,n-10);for(let h=0;h<8;h+=1){const p=o+14+h%4*((n-28)/3),u=l+14+Math.floor(h/4)*(n-28);e.fillStyle="rgba(5,6,8,0.9)",e.beginPath(),e.arc(p,u,3.2,0,Math.PI*2),e.fill(),e.fillStyle="rgba(190,200,215,0.22)",e.beginPath(),e.arc(p-.8,u-.8,1.3,0,Math.PI*2),e.fill()}}e.save(),e.globalAlpha=.5;for(let r=-512;r<512*2;r+=34)e.fillStyle=r%68===0?"#ff5a1f":"#0c0c10",e.beginPath(),e.moveTo(r,478),e.lineTo(r+17,478),e.lineTo(r+17+30,512),e.lineTo(r+30,512),e.closePath(),e.fill();return e.restore(),Co(e,512,512,i,10),Ro(e,512,512,14e3,i,.07),t}function w0(){const t=bi(512,512),e=t.getContext("2d"),i=Xn(260753),n=e.createLinearGradient(0,0,512,512);n.addColorStop(0,"#390700"),n.addColorStop(.4,"#8f1604"),n.addColorStop(.7,"#d33505"),n.addColorStop(1,"#4a0800"),e.fillStyle=n,e.fillRect(0,0,512,512);for(let r=0;r<90;r+=1){const a=i()*512,o=i()*512,l=10+i()*90,c=e.createRadialGradient(a,o,0,a,o,l),h=i()>.5;c.addColorStop(0,h?"rgba(255,226,130,0.85)":"rgba(255,120,20,0.7)"),c.addColorStop(.4,h?"rgba(255,150,30,0.5)":"rgba(210,60,5,0.45)"),c.addColorStop(1,"rgba(80,10,0,0)"),e.fillStyle=c,e.beginPath(),e.arc(a,o,l,0,Math.PI*2),e.fill()}e.strokeStyle="rgba(24,4,2,0.85)";for(let r=0;r<44;r+=1){let a=i()*512,o=i()*512;e.lineWidth=1+i()*4,e.beginPath(),e.moveTo(a,o);for(let l=0;l<5;l+=1)a+=(i()-.5)*70,o+=(i()-.5)*70,e.lineTo(a,o);e.stroke()}for(let r=0;r<26;r+=1){const a=i()*512,o=i()*512,l=e.createRadialGradient(a,o,0,a,o,20);l.addColorStop(0,"rgba(255,246,196,0.95)"),l.addColorStop(.3,"rgba(255,170,50,0.5)"),l.addColorStop(1,"rgba(255,120,20,0)"),e.fillStyle=l,e.beginPath(),e.arc(a,o,20,0,Math.PI*2),e.fill()}return t}function E0(){const e=bi(1536,768),i=e.getContext("2d"),n=Xn(912087),r=i.createLinearGradient(0,0,0,768);r.addColorStop(0,"#03040a"),r.addColorStop(.32,"#070b1a"),r.addColorStop(.55,"#131024"),r.addColorStop(.72,"#32141a"),r.addColorStop(.84,"#6b2317"),r.addColorStop(.92,"#161016"),r.addColorStop(1,"#05060a"),i.fillStyle=r,i.fillRect(0,0,1536,768);for(let u=0;u<70;u+=1){const d=n()*1536,g=n()*768*.7,S=40+n()*220,m=i.createRadialGradient(d,g,0,d,g,S),f=n();f>.72?m.addColorStop(0,"rgba(255,90,31,0.055)"):f>.4?m.addColorStop(0,"rgba(96,78,190,0.05)"):m.addColorStop(0,"rgba(38,108,150,0.045)"),m.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=m,i.beginPath(),i.arc(d,g,S,0,Math.PI*2),i.fill()}for(let u=0;u<1600;u+=1){const d=n()*1536,g=n()*768*.75,S=n()*1.8+.2,m=.15+n()*.75;if(i.fillStyle=`rgba(${200+n()*55},${210+n()*40},255,${m})`,i.fillRect(d,g,S,S),n()>.985){const f=i.createRadialGradient(d,g,0,d,g,9);f.addColorStop(0,"rgba(190,220,255,0.55)"),f.addColorStop(1,"rgba(120,160,255,0)"),i.fillStyle=f,i.beginPath(),i.arc(d,g,9,0,Math.PI*2),i.fill()}}const a=1536*.71,o=768*.29,l=58,c=i.createRadialGradient(a,o,l*.4,a,o,l*4.2);c.addColorStop(0,"rgba(255,120,60,0.24)"),c.addColorStop(.4,"rgba(255,80,30,0.08)"),c.addColorStop(1,"rgba(255,60,20,0)"),i.fillStyle=c,i.beginPath(),i.arc(a,o,l*4.2,0,Math.PI*2),i.fill();const h=i.createRadialGradient(a-l*.35,o-l*.35,2,a,o,l);h.addColorStop(0,"#ffe4c2"),h.addColorStop(.35,"#ffb276"),h.addColorStop(.75,"#c85a2c"),h.addColorStop(1,"#7d2c12"),i.fillStyle=h,i.beginPath(),i.arc(a,o,l,0,Math.PI*2),i.fill(),i.globalAlpha=.22;for(let u=0;u<14;u+=1){const d=n()*Math.PI*2,g=n()*l*.78,S=3+n()*13;i.fillStyle="#5b1d0b",i.beginPath(),i.arc(a+Math.cos(d)*g,o+Math.sin(d)*g,S,0,Math.PI*2),i.fill()}i.globalAlpha=1;const p=i.createLinearGradient(0,768*.62,0,768*.9);return p.addColorStop(0,"rgba(255,90,31,0)"),p.addColorStop(.5,"rgba(255,86,30,0.12)"),p.addColorStop(1,"rgba(255,60,20,0)"),i.fillStyle=p,i.fillRect(0,768*.62,1536,768*.3),e}function T0(){const t=bi(128,128),e=t.getContext("2d"),i=e.createRadialGradient(128/2,128/2,0,128/2,128/2,128/2);i.addColorStop(0,"rgba(255,255,255,1)"),i.addColorStop(.18,"rgba(255,245,220,0.95)"),i.addColorStop(.42,"rgba(255,170,80,0.45)"),i.addColorStop(1,"rgba(255,90,20,0)"),e.fillStyle=i,e.fillRect(0,0,128,128);const n=new Hn(t);return n.colorSpace=we,n}function A0(){const t=bi(128,128),e=t.getContext("2d"),i=Xn(332836),n=e.createRadialGradient(128/2,128/2,2,128/2,128/2,128/2);n.addColorStop(0,"rgba(0,0,0,0.85)"),n.addColorStop(.42,"rgba(8,5,4,0.6)"),n.addColorStop(.75,"rgba(16,8,4,0.18)"),n.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=n,e.fillRect(0,0,128,128);for(let a=0;a<40;a+=1){const o=i()*Math.PI*2,l=i()*128*.42;e.fillStyle=`rgba(0,0,0,${.1+i()*.25})`,e.beginPath(),e.arc(128/2+Math.cos(o)*l,128/2+Math.sin(o)*l,1+i()*5,0,Math.PI*2),e.fill()}const r=new Hn(t);return r.colorSpace=we,r}function R0(){const t=bi(1024,1024),e=t.getContext("2d"),i=1024/2,n=1024/2;e.translate(i,n),e.strokeStyle="rgba(255,106,36,0.9)",e.lineWidth=8,e.shadowColor="rgba(255,90,31,0.9)",e.shadowBlur=30,e.beginPath(),e.arc(0,0,430,0,Math.PI*2),e.stroke(),e.lineWidth=3,e.setLineDash([10,18]),e.beginPath(),e.arc(0,0,390,0,Math.PI*2),e.stroke(),e.setLineDash([]),e.lineWidth=2,e.beginPath(),e.arc(0,0,320,0,Math.PI*2),e.stroke(),e.beginPath(),e.arc(0,0,210,0,Math.PI*2),e.stroke();for(let a=0;a<16;a+=1){const o=a/16*Math.PI*2;e.save(),e.rotate(o),e.beginPath(),e.moveTo(330,0),e.lineTo(375,-14),e.lineTo(410,0),e.lineTo(375,14),e.closePath(),e.stroke(),e.restore()}e.lineWidth=34,e.beginPath(),e.arc(0,-20,118,Math.PI*.18,Math.PI*2.05),e.stroke(),e.lineWidth=30,e.beginPath(),e.moveTo(52,46),e.lineTo(150,152),e.stroke(),e.lineWidth=6,e.beginPath(),e.moveTo(-70,90),e.lineTo(0,-140),e.lineTo(70,90),e.stroke(),e.beginPath(),e.moveTo(-36,30),e.lineTo(36,30),e.stroke(),e.shadowBlur=0;const r=new Hn(t);return r.colorSpace=we,r.anisotropy=8,r}function C0(){const e=bi(256,512),i=e.getContext("2d"),n=i.createLinearGradient(0,0,0,512);n.addColorStop(0,"#3d0c0a"),n.addColorStop(.4,"#5e100b"),n.addColorStop(.85,"#2b0706"),n.addColorStop(1,"#160303"),i.fillStyle=n,i.fillRect(0,0,256,512),i.strokeStyle="rgba(230,150,80,0.18)",i.lineWidth=5,i.strokeRect(13,13,230,486),i.strokeStyle="rgba(255,110,40,0.55)",i.lineWidth=4,i.save(),i.translate(256/2,512*.4),i.beginPath(),i.arc(0,0,64,0,Math.PI*2),i.stroke(),i.beginPath();for(let a=0;a<8;a+=1){const o=a/8*Math.PI*2,l=20,c=92;i.moveTo(Math.cos(o)*l,Math.sin(o)*l),i.lineTo(Math.cos(o)*c,Math.sin(o)*c)}i.stroke(),i.restore(),i.globalCompositeOperation="destination-out";for(let a=0;a<10;a+=1){const o=a/10*256,l=12+Math.random()*46;i.beginPath(),i.moveTo(o,512),i.lineTo(o+256/10,512),i.lineTo(o+256/20,512-l),i.closePath(),i.fill()}i.globalCompositeOperation="source-over";const r=new Hn(e);return r.colorSpace=we,r.anisotropy=4,r}function P0(){const e=bi(256,64),i=e.getContext("2d");i.fillStyle="#0a0a0d",i.fillRect(0,0,256,64),i.fillStyle="#ff5a1f";for(let n=-64;n<320;n+=44)i.beginPath(),i.moveTo(n,64),i.lineTo(n+22,64),i.lineTo(n+22+64,0),i.lineTo(n+64,0),i.closePath(),i.fill();i.fillStyle="rgba(0,0,0,0.32)";for(let n=0;n<700;n+=1)i.fillRect(Math.random()*256,Math.random()*64,2,1);return Gi(e,4,1)}function L0(s){const t=Gi(Jl(),10,10),e=Gi(Jl(),4,4),i=Gi(Ql(),5,2.5),n=Gi(Ql(),3,2),r=Gi(jl(),4,1),a=Gi(jl(),6,1),o=Gi(w0(),2,2),l=new Hn(E0());l.colorSpace=we,l.mapping=Js,l.anisotropy=4;const c=T0(),h=A0(),p=R0(),u=C0(),d=P0(),g=s.capabilities.getMaxAnisotropy();for(const S of[t,e,i,n,r,a,o,d])S.anisotropy=Math.min(g,8);return{floor:t,floorPlatform:e,wall:i,wallHigh:n,metal:r,metalCatwalk:a,lava:o,sky:l,glow:c,scorch:h,emblem:p,banner:u,hazard:d}}class D0{constructor(){this.ctx=null,this.master=null,this.noiseBuffer=null,this.ambientNodes=[],this.enabled=!0}unlock(){if(!this.ctx){const t=window.AudioContext||window.webkitAudioContext;if(!t)return;this.ctx=new t;const e=this.ctx.createDynamicsCompressor();e.threshold.value=-18,e.knee.value=22,e.ratio.value=7,e.attack.value=.003,e.release.value=.22,this.master=this.ctx.createGain(),this.master.gain.value=.62,this.master.connect(e),e.connect(this.ctx.destination),this.noiseBuffer=this.makeNoise(2.5),this.startAmbient()}this.ctx.state==="suspended"&&this.ctx.resume()}makeNoise(t){const e=Math.floor(this.ctx.sampleRate*t),i=this.ctx.createBuffer(1,e,this.ctx.sampleRate),n=i.getChannelData(0);let r=0;for(let a=0;a<e;a+=1){const o=Math.random()*2-1;r=.96*r+.04*o,n[a]=o*.7+r*.6}return i}startAmbient(){if(!this.ctx)return;const t=this.ctx.currentTime,e=this.ctx.createGain();e.gain.setValueAtTime(0,t),e.gain.linearRampToValueAtTime(.16,t+3.5),e.connect(this.master);const i=this.ctx.createBiquadFilter();i.type="lowpass",i.frequency.value=220,i.Q.value=2,i.connect(e),[41.2,55,82.4,110.3].forEach((h,p)=>{const u=this.ctx.createOscillator();u.type=p%2===0?"sine":"triangle",u.frequency.value=h,u.detune.value=(p-1.5)*6;const d=this.ctx.createGain();d.gain.value=.16/(p*.55+1),u.connect(d),d.connect(i),u.start();const g=this.ctx.createOscillator();g.frequency.value=.045+p*.018;const S=this.ctx.createGain();S.gain.value=.06,g.connect(S),S.connect(d.gain),g.start(),this.ambientNodes.push(u,g)});const r=this.ctx.createBufferSource();r.buffer=this.noiseBuffer,r.loop=!0;const a=this.ctx.createBiquadFilter();a.type="bandpass",a.frequency.value=280,a.Q.value=.7;const o=this.ctx.createGain();o.gain.value=.045,r.connect(a),a.connect(o),o.connect(this.master),r.start();const l=this.ctx.createOscillator();l.frequency.value=.07;const c=this.ctx.createGain();c.gain.value=.025,l.connect(c),c.connect(o.gain),l.start(),this.ambientNodes.push(r,l)}noise(t,{type:e="bandpass",freq:i=1e3,endFreq:n=null,q:r=1,gain:a=.4,attack:o=.002}={}){if(!this.ctx||!this.enabled)return;const l=this.ctx.currentTime,c=this.ctx.createBufferSource();c.buffer=this.noiseBuffer,c.playbackRate.value=.8+Math.random()*.4;const h=this.ctx.createBiquadFilter();h.type=e,h.frequency.setValueAtTime(i,l),n&&h.frequency.exponentialRampToValueAtTime(Math.max(30,n),l+t),h.Q.value=r;const p=this.ctx.createGain();p.gain.setValueAtTime(1e-4,l),p.gain.linearRampToValueAtTime(a,l+o),p.gain.exponentialRampToValueAtTime(1e-4,l+t),c.connect(h),h.connect(p),p.connect(this.master),c.start(l,Math.random()*1.5,t+.05),c.stop(l+t+.06)}tone(t,{type:e="sine",from:i=440,to:n=null,gain:r=.2,attack:a=.004}={}){if(!this.ctx||!this.enabled)return;const o=this.ctx.currentTime,l=this.ctx.createOscillator();l.type=e,l.frequency.setValueAtTime(i,o),n&&l.frequency.exponentialRampToValueAtTime(Math.max(20,n),o+t);const c=this.ctx.createGain();c.gain.setValueAtTime(1e-4,o),c.gain.linearRampToValueAtTime(r,o+a),c.gain.exponentialRampToValueAtTime(1e-4,o+t),l.connect(c),c.connect(this.master),l.start(o),l.stop(o+t+.03)}rocket(){this.noise(.42,{type:"lowpass",freq:2600,endFreq:190,q:1.6,gain:.55}),this.tone(.32,{type:"sine",from:130,to:38,gain:.5}),this.tone(.16,{type:"sawtooth",from:300,to:90,gain:.12})}shotgun(){this.noise(.32,{type:"lowpass",freq:4200,endFreq:260,q:1.2,gain:.7}),this.tone(.2,{type:"square",from:170,to:45,gain:.28})}rail(){this.tone(.24,{type:"sawtooth",from:1800,to:240,gain:.18,attack:.002}),this.noise(.3,{type:"highpass",freq:1400,endFreq:4600,q:2,gain:.28}),this.tone(.5,{type:"sine",from:90,to:55,gain:.24})}explosion(t=1){this.noise(.9*t,{type:"lowpass",freq:900,endFreq:60,q:1.4,gain:.75}),this.tone(.7*t,{type:"sine",from:90,to:28,gain:.6}),this.noise(.2,{type:"bandpass",freq:2600,endFreq:600,q:.8,gain:.3})}enemyShoot(t="grunt"){t==="wraith"?this.tone(.18,{type:"sawtooth",from:900,to:1600,gain:.1}):t==="brute"?this.tone(.24,{type:"square",from:220,to:90,gain:.13}):this.tone(.16,{type:"square",from:520,to:190,gain:.1}),this.noise(.12,{type:"bandpass",freq:1200,endFreq:500,q:1.5,gain:.09})}enemyHit(){this.noise(.09,{type:"bandpass",freq:2200,endFreq:900,q:2,gain:.16}),this.tone(.07,{type:"square",from:320,to:170,gain:.06})}enemyDeath(){this.tone(.6,{type:"sawtooth",from:190,to:38,gain:.16}),this.noise(.45,{type:"lowpass",freq:700,endFreq:100,q:1,gain:.25})}hitmarker(t=!1){this.tone(.06,{type:"square",from:t?1900:1250,to:t?1200:1e3,gain:.09})}playerHurt(){this.tone(.22,{type:"sawtooth",from:180,to:60,gain:.2}),this.noise(.16,{type:"lowpass",freq:900,endFreq:120,q:1,gain:.22})}playerDeath(){this.tone(1.4,{type:"sawtooth",from:140,to:24,gain:.3}),this.noise(1.2,{type:"lowpass",freq:500,endFreq:40,q:1,gain:.35})}pickup(t="health"){const e=t==="health"?620:t==="armor"?500:380;this.tone(.09,{type:"sine",from:e,to:e*1.5,gain:.16}),setTimeout(()=>this.tone(.12,{type:"sine",from:e*1.5,to:e*2,gain:.13}),55)}jump(){this.noise(.1,{type:"highpass",freq:700,endFreq:1600,q:.6,gain:.06})}land(){this.noise(.13,{type:"lowpass",freq:500,endFreq:120,q:1,gain:.14})}footstep(){this.noise(.07,{type:"lowpass",freq:420,endFreq:180,q:2,gain:.07})}dash(){this.noise(.22,{type:"bandpass",freq:400,endFreq:1600,q:1.4,gain:.12})}wave(){this.tone(.3,{type:"sine",from:60,to:42,gain:.3}),this.tone(.5,{type:"sawtooth",from:110,to:146,gain:.08}),setTimeout(()=>this.tone(.6,{type:"sawtooth",from:146,to:110,gain:.07}),220)}ui(){this.tone(.06,{type:"square",from:800,to:1200,gain:.05})}deny(){this.tone(.14,{type:"square",from:180,to:120,gain:.1})}empty(){this.tone(.05,{type:"square",from:260,to:200,gain:.06})}}const I0=`
  attribute float aSize;
  attribute float aAlpha;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = color;
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (420.0 / max(1.0, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`,U0=`
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    if (d > 1.0) discard;
    float core = smoothstep(1.0, 0.0, d);
    float hot = smoothstep(0.6, 0.0, d);
    vec3 col = vColor + hot * 0.35;
    gl_FragColor = vec4(col, core * core * vAlpha);
  }
`;class tc{constructor(t,e,i=!0){this.count=e,this.positions=new Float32Array(e*3),this.colors=new Float32Array(e*3),this.sizes=new Float32Array(e),this.alphas=new Float32Array(e),this.vel=new Float32Array(e*3),this.life=new Float32Array(e),this.maxLife=new Float32Array(e),this.baseSize=new Float32Array(e),this.grow=new Float32Array(e),this.gravity=new Float32Array(e),this.drag=new Float32Array(e),this.fade=new Float32Array(e),this.cursor=0;const n=new ge;n.setAttribute("position",new Te(this.positions,3)),n.setAttribute("color",new Te(this.colors,3)),n.setAttribute("aSize",new Te(this.sizes,1)),n.setAttribute("aAlpha",new Te(this.alphas,1)),n.setDrawRange(0,e),this.geo=n,this.material=new Ne({vertexShader:I0,fragmentShader:U0,transparent:!0,depthWrite:!1,vertexColors:!0,blending:i?oe:nn}),this.points=new bo(n,this.material),this.points.frustumCulled=!1,this.points.renderOrder=4,t.add(this.points);for(let r=0;r<e;r+=1)this.alphas[r]=0,this.positions[r*3+1]=-9999}spawn(t,e,i,n,r,a,o,l,c,{gravity:h=0,drag:p=0,grow:u=0,fade:d=1}={}){const g=this.cursor;this.cursor=(this.cursor+1)%this.count;const S=g*3;return this.positions[S]=t,this.positions[S+1]=e,this.positions[S+2]=i,this.vel[S]=n,this.vel[S+1]=r,this.vel[S+2]=a,this.colors[S]=o.r,this.colors[S+1]=o.g,this.colors[S+2]=o.b,this.sizes[g]=l,this.baseSize[g]=l,this.alphas[g]=1,this.life[g]=c,this.maxLife[g]=c,this.gravity[g]=h,this.drag[g]=p,this.grow[g]=u,this.fade[g]=d,g}update(t){const{positions:e,vel:i,life:n,maxLife:r,alphas:a,sizes:o,baseSize:l,gravity:c,drag:h,grow:p}=this;for(let u=0;u<this.count;u+=1){if(n[u]<=0)continue;if(n[u]-=t,n[u]<=0){a[u]=0,e[u*3+1]=-9999;continue}const d=u*3,g=Math.max(0,1-h[u]*t);i[d]*=g,i[d+1]=i[d+1]*g+c[u]*t,i[d+2]*=g,e[d]+=i[d]*t,e[d+1]+=i[d+1]*t,e[d+2]+=i[d+2]*t,o[u]=Math.max(.01,l[u]*(1+p[u]*(1-n[u]/r[u])));const S=n[u]/r[u];a[u]=Math.pow(S,.7)}this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.color.needsUpdate=!0,this.geo.attributes.aSize.needsUpdate=!0,this.geo.attributes.aAlpha.needsUpdate=!0}}const ec=new R(0,1,0);class N0{constructor(t){this.game=t,this.scene=t.scene,this.textures=t.textures,this.sparks=new tc(this.scene,2200,!0),this.smoke=new tc(this.scene,900,!1),this.decals=[],this.transients=[],this.lights=[],this.gibBodies=[],this.rings=[],this.decalGeo=new Ze(1,1),this.decalMat=new Ee({map:this.textures.scorch,transparent:!0,depthWrite:!1,opacity:.75,color:1447446,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),this.glowSpriteMat=new si({map:this.textures.glow,color:16777215,transparent:!0,depthWrite:!1,blending:oe}),this.smokeSpriteMat=new si({map:this.textures.glow,color:5914680,transparent:!0,depthWrite:!1,opacity:.35,blending:nn}),this.lightPool=[];for(let e=0;e<6;e+=1){const i=new kn(16742959,0,18,2);i.visible=!1,this.scene.add(i),this.lightPool.push({light:i,life:0,max:0,power:0})}this.lightCursor=0,this.buildAmbientDust()}buildAmbientDust(){const e=new ge,i=new Float32Array(420*3);for(let r=0;r<420;r+=1)i[r*3]=xt(-52,52),i[r*3+1]=xt(.4,22),i[r*3+2]=xt(-52,52);e.setAttribute("position",new Te(i,3));const n=new yo({color:16751196,size:.055,transparent:!0,opacity:.55,depthWrite:!1,blending:oe,map:this.textures.glow});this.dust=new bo(e,n),this.dust.frustumCulled=!1,this.scene.add(this.dust),this.dustPhase=0}burst(t,e,i=16,n=5,r={}){const a=new Dt(e),o=r.size??.24,l=r.life??.6;for(let c=0;c<i;c+=1){const h=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1),u=n*(.25+Math.random()*.75),d=Math.sin(p)*Math.cos(h)*u,g=Math.cos(p)*u*(r.up??1),S=Math.sin(p)*Math.sin(h)*u;this.sparks.spawn(t.x,t.y,t.z,d,g,S,a,o*(.6+Math.random()*.9),l*(.5+Math.random()),{gravity:r.gravity??-9,drag:r.drag??1.4,grow:r.grow??-.2,fade:1})}}smokePuff(t,e=8,i=4008482,n=.9,r=1.2,a=1.6){const o=new Dt(i);for(let l=0;l<e;l+=1)this.smoke.spawn(t.x+xt(-.4,.4),t.y+xt(-.2,.5),t.z+xt(-.4,.4),xt(-a,a),xt(.3,a),xt(-a,a),o,n*(.6+Math.random()*.8),r*(.7+Math.random()*.7),{gravity:.5,drag:1.1,grow:2.4})}muzzle(t,e=16752714){const i=new Si(new si({map:this.textures.glow,color:e,transparent:!0,depthWrite:!1,blending:oe}));i.position.copy(t);const n=xt(.8,1.15);i.scale.set(n,n,1),this.scene.add(i),this.transients.push({object:i,life:.07,max:.07,type:"sprite"}),this.flashLight(t,e,3.4,.09,9),this.burst(t,e,5,3.2,{size:.12,life:.14,drag:2})}flashLight(t,e,i,n,r=16){const a=this.lightPool[this.lightCursor];this.lightCursor=(this.lightCursor+1)%this.lightPool.length,a.light.position.copy(t),a.light.color.set(e),a.light.distance=r,a.light.intensity=i,a.light.visible=!0,a.life=n,a.max=n,a.power=i}explosion(t,e=1){new Dt(16738850),this.burst(t,16756810,Math.floor(42*e),13*e,{size:.55,life:.75,drag:2.1,up:1.2}),this.burst(t,16726538,Math.floor(30*e),8*e,{size:.8,life:1.1,drag:1.6,up:1.4}),this.smokePuff(t,Math.floor(16*e),2957597,1.8*e,1.7,2.6*e),this.flashLight(t,16742959,14*e,.5,26*e);const i=new tt(new ps(1,16,12),new Ee({color:16766624,transparent:!0,opacity:.95,blending:oe,depthWrite:!1}));i.position.copy(t),i.scale.setScalar(.8*e),this.scene.add(i),this.transients.push({object:i,life:.22,max:.22,type:"flash",grow:7*e});const n=new Xi(.6,.84,48),r=new tt(n,new Ee({color:16751178,transparent:!0,opacity:.85,side:_e,blending:oe,depthWrite:!1}));r.position.copy(t),r.position.y=Math.max(t.y,.08),r.rotation.x=-Math.PI/2,this.scene.add(r),this.rings.push({mesh:r,life:.5,max:.5,scale:9*e});const a=new Si(this.smokeSpriteMat.clone());a.position.copy(t),a.scale.setScalar(1.5*e),this.scene.add(a),this.transients.push({object:a,life:1.5,max:1.5,type:"smoke",grow:4*e}),t.y<3&&this.scorch(t,e),this.game.addShake(.5*e,.4)}ring(t,e=16738850,i=1.6){const n=new tt(new Xi(.55,.78,40),new Ee({color:e,transparent:!0,opacity:.85,side:_e,blending:oe,depthWrite:!1,toneMapped:!1}));n.position.copy(t),n.position.y=Math.max(t.y+.05,.08),n.rotation.x=-Math.PI/2,this.scene.add(n),this.rings.push({mesh:n,life:.7,max:.7,scale:i*3.2})}railBeam(t,e,i=9435135){const n=new R().subVectors(e,t),r=n.length();if(r<.01)return;n.normalize();const a=new re,o=new tt(new Ie(.035,.035,r,6,1,!0),new Ee({color:15400959,transparent:!0,opacity:1,blending:oe,depthWrite:!1})),l=new tt(new Ie(.16,.16,r,8,1,!0),new Ee({color:i,transparent:!0,opacity:.5,blending:oe,depthWrite:!1}));a.add(o,l),a.position.copy(t).add(e).multiplyScalar(.5),a.quaternion.setFromUnitVectors(ec,n),this.scene.add(a),this.transients.push({object:a,life:.22,max:.22,type:"beam"}),this.flashLight(e,i,5,.16,14),this.burst(e,i,18,7,{size:.22,life:.4,drag:2.6}),this.burst(e,16777215,6,3,{size:.3,life:.25,drag:3}),this.game.addShake(.09,.12)}impact(t,e,i=16756832){const n=e?e.clone().normalize():ec.clone();this.burst(t,i,9,5.5,{size:.16,life:.35,drag:2.2,up:1}),this.burst(t,16773312,3,4,{size:.24,life:.22,drag:2.5}),this.smokePuff(t,3,3158063,.5,.7,.7);const r=new Si(new si({map:this.textures.glow,color:i,transparent:!0,depthWrite:!1,blending:oe}));r.position.copy(t).addScaledVector(n,.05),r.scale.setScalar(.55),this.scene.add(r),this.transients.push({object:r,life:.09,max:.09,type:"sprite"}),this.decal(t,n)}decal(t,e){const i=new tt(this.decalGeo,this.decalMat.clone());i.position.copy(t).addScaledVector(e,.02),i.lookAt(t.clone().add(e)),i.rotateZ(Math.random()*Math.PI*2);const n=xt(.7,1.35);if(i.scale.set(n,n,n),i.renderOrder=2,this.scene.add(i),this.decals.push({mesh:i,life:18,max:18}),this.decals.length>36){const r=this.decals.shift();this.scene.remove(r.mesh),r.mesh.material.dispose()}}scorch(t,e=1){const i=new tt(this.decalGeo,this.decalMat.clone());if(i.material.opacity=.85,i.position.copy(t),i.position.y=Math.max(.035,t.y-.4),i.rotation.x=-Math.PI/2,i.rotation.z=Math.random()*Math.PI,i.scale.setScalar(1.6*e),i.renderOrder=2,this.scene.add(i),this.decals.push({mesh:i,life:22,max:22}),this.decals.length>36){const n=this.decals.shift();this.scene.remove(n.mesh),n.mesh.material.dispose()}}rocketTrail(t,e=16747066){Math.random()<.85&&this.sparks.spawn(t.x+xt(-.08,.08),t.y+xt(-.08,.08),t.z+xt(-.08,.08),xt(-.5,.5),xt(-.2,.8),xt(-.5,.5),new Dt(e),xt(.24,.44),xt(.35,.6),{gravity:1.5,drag:2.2,grow:1.4}),Math.random()<.5&&this.smoke.spawn(t.x,t.y,t.z,xt(-.3,.3),xt(.1,.5),xt(-.3,.3),new Dt(4866621),xt(.3,.6),xt(.45,.9),{gravity:.6,drag:1.4,grow:2.6})}ember(t){this.sparks.spawn(t.x+xt(-.4,.4),t.y+xt(0,.3),t.z+xt(-.4,.4),xt(-.35,.35),xt(.7,2),xt(-.35,.35),new Dt().setHSL(xt(.04,.09),1,xt(.5,.7)),xt(.06,.16),xt(.7,1.8),{gravity:.5,drag:.2,grow:-.5})}gibs(t,e,i=8){const n=new kt({color:e,roughness:.55,metalness:.45,emissive:new Dt(e).multiplyScalar(.18)});for(let r=0;r<i;r+=1){const a=xt(.07,.2),o=new tt(new Pt(a,a,a*xt(.5,1.4)),n);o.position.copy(t),o.position.y+=xt(0,1.2);const l=Math.random()*Math.PI*2,c=xt(2.5,7),h={mesh:o,vel:new R(Math.cos(l)*c,xt(2,7),Math.sin(l)*c),spin:new R(xt(-9,9),xt(-9,9),xt(-9,9)),life:xt(1.2,2.4)};this.scene.add(o),this.gibBodies.push(h)}}update(t){this.sparks.update(t),this.smoke.update(t),this.dustPhase+=t,this.dust&&(this.dust.rotation.y+=t*.008,this.dust.material.opacity=.45+Math.sin(this.dustPhase*.6)*.12);for(let e=this.transients.length-1;e>=0;e-=1){const i=this.transients[e];i.life-=t;const n=De(i.life/i.max,0,1);i.type==="flash"?(i.object.scale.setScalar(1+(1-n)*i.grow),i.object.material.opacity=n*.95):i.type==="sprite"?(i.object.material.opacity=n,i.object.scale.multiplyScalar(1+t*.8)):i.type==="smoke"?(i.object.scale.setScalar(1.5+(1-n)*i.grow),i.object.material.opacity=n*.35):i.type==="beam"&&i.object.children.forEach(r=>{r.material.opacity=n}),i.life<=0&&(this.scene.remove(i.object),i.object.traverse?.(r=>{r.material&&(r.geometry&&r.geometry.dispose(),r.material.dispose())}),this.transients.splice(e,1))}for(let e=this.rings.length-1;e>=0;e-=1){const i=this.rings[e];i.life-=t;const n=De(i.life/i.max,0,1);i.mesh.scale.setScalar(1+(1-n)*i.scale),i.mesh.material.opacity=n*.8,i.life<=0&&(this.scene.remove(i.mesh),i.mesh.geometry.dispose(),i.mesh.material.dispose(),this.rings.splice(e,1))}for(let e=this.lightPool.length-1;e>=0;e-=1){const i=this.lightPool[e];if(!i.light.visible)continue;i.life-=t;const n=De(i.life/i.max,0,1);i.light.intensity=i.power*n*n,i.life<=0&&(i.light.visible=!1,i.light.intensity=0)}for(let e=this.gibBodies.length-1;e>=0;e-=1){const i=this.gibBodies[e];i.life-=t,i.vel.y-=24*t,i.mesh.position.addScaledVector(i.vel,t),i.mesh.position.y<.15&&(i.mesh.position.y=.15,i.vel.y*=-.32,i.vel.x*=.7,i.vel.z*=.7,i.spin.multiplyScalar(.6)),i.mesh.rotation.x+=i.spin.x*t,i.mesh.rotation.y+=i.spin.y*t,i.mesh.rotation.z+=i.spin.z*t,i.life<=0&&(this.scene.remove(i.mesh),i.mesh.geometry.dispose(),e===0&&i.mesh.material.dispose(),this.gibBodies.splice(e,1))}for(let e=this.decals.length-1;e>=0;e-=1){const i=this.decals[e];i.life-=t,i.life<3&&(i.mesh.material.opacity=Math.max(0,i.life/3)*.75),i.life<=0&&(this.scene.remove(i.mesh),i.mesh.material.dispose(),this.decals.splice(e,1))}}clear(){for(const t of this.transients)this.scene.remove(t.object);this.transients.length=0;for(const t of this.decals)this.scene.remove(t.mesh),t.mesh.material.dispose();this.decals.length=0;for(const t of this.gibBodies)this.scene.remove(t.mesh),t.mesh.geometry.dispose();this.gibBodies.length=0;for(const t of this.rings)this.scene.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose();this.rings.length=0}}const ic=new R,qs=new R;class F0{constructor(t){this.game=t,this.scene=t.scene,this.textures=t.textures,this.solids=[],this.ramps=[],this.groundBoxes=[],this.raycastTargets=[],this.hazards=[],this.torches=[],this.portals=[],this.jumpPads=[],this.portalTime=0,this.lavaLights=[],this.raycaster=new fu,this.raycaster.far=200,this.group=new re,this.scene.add(this.group),this.buildMaterials(),this.buildSky(),this.buildLights(),this.buildFloor(),this.buildPlatform(),this.buildWalls(),this.buildCatwalk(),this.buildPillars(),this.buildCover(),this.buildLava(),this.buildPortals(),this.buildJumpPads(),this.buildProps(),this.pickups=new O0(t,this),this.spawnPoints=this.portals.map(e=>e.spawn)}buildMaterials(){const t=this.textures;this.mat={floor:new kt({map:t.floor,roughness:.9,metalness:.22,color:12566728}),stone:new kt({map:t.wall,roughness:.95,metalness:.08,color:11119282}),stoneHigh:new kt({map:t.wallHigh,roughness:.96,metalness:.06,color:9540509}),metal:new kt({map:t.metal,roughness:.48,metalness:.82,color:11844294}),metalDark:new kt({map:t.metalCatwalk,roughness:.55,metalness:.78,color:7370628}),blackStone:new kt({color:789777,roughness:.92,metalness:.14}),orangeGlow:new kt({color:2756872,emissive:16734751,emissiveIntensity:4.2,roughness:.4,metalness:.3}),cyanGlow:new kt({color:465438,emissive:5433599,emissiveIntensity:3.4,roughness:.35,metalness:.4}),lava:new kt({map:t.lava,emissiveMap:t.lava,emissive:16734738,emissiveIntensity:2.6,color:16777215,roughness:.65,metalness:0}),hazard:new kt({map:t.hazard,roughness:.6,metalness:.5}),emblem:new Ee({map:t.emblem,transparent:!0,opacity:.9,blending:oe,depthWrite:!1,toneMapped:!1,side:_e}),banner:new kt({map:t.banner,transparent:!0,side:_e,roughness:1,metalness:0,alphaTest:.15})}}buildSky(){const t=new ps(280,48,32),e=new Ee({map:this.textures.sky,side:Xe,fog:!1,toneMapped:!1,depthWrite:!1}),i=new tt(t,e);i.rotation.y=-.85,i.renderOrder=-10,this.scene.add(i),this.sky=i;const n=new ge,r=600,a=new Float32Array(r*3);for(let o=0;o<r;o+=1){const l=Math.random()*Math.PI*2,c=Math.acos(xt(.08,1)),h=245;a[o*3]=Math.sin(c)*Math.cos(l)*h,a[o*3+1]=Math.cos(c)*h+20,a[o*3+2]=Math.sin(c)*Math.sin(l)*h}n.setAttribute("position",new Te(a,3)),this.stars=new bo(n,new yo({color:13624575,size:.9,transparent:!0,opacity:.8,depthWrite:!1,sizeAttenuation:!0,fog:!1,map:this.textures.glow})),this.scene.add(this.stars)}buildLights(){this.scene.add(new ru(10400486,3808269,1.55)),this.scene.add(new lu(3885156,1.5));const t=new $r(16757370,2.6);t.position.set(-42,62,30),t.castShadow=!0,t.shadow.mapSize.set(2048,2048),t.shadow.camera.left=-68,t.shadow.camera.right=68,t.shadow.camera.top=68,t.shadow.camera.bottom=-68,t.shadow.camera.near=1,t.shadow.camera.far=180,t.shadow.bias=-6e-4,t.shadow.normalBias=.035,this.scene.add(t),this.moon=t;const e=new $r(3833343,.85);e.position.set(38,24,-44),this.scene.add(e);const i=new $r(9413324,1.8);i.position.set(0,28,70),this.scene.add(i),this.scene.fog=new Mo(526865,.0058)}addSolid(t,e,i,n,r,a,o=!1){const l={minX:t,maxX:e,minY:i,maxY:n,minZ:r,maxZ:a,walkable:o};return this.solids.push(l),o&&this.groundBoxes.push(l),l}addTarget(t){return this.raycastTargets.push(t),t}buildFloor(){const t=new tt(new Ze(108,108),this.mat.floor);t.rotation.x=-Math.PI/2,t.receiveShadow=!0,this.group.add(t),this.addTarget(t);const e=new tt(new Ze(300,300),new kt({color:460812,roughness:1}));e.rotation.x=-Math.PI/2,e.position.y=-.6,this.scene.add(e);for(const[i,n,r,a]of[[0,-52.5,108,1.2],[0,52.5,108,1.2],[-52.5,0,1.2,108],[52.5,0,1.2,108]]){const o=new tt(new Pt(r,1.6,a),this.mat.metalDark);o.position.set(i,.8,n),o.castShadow=!0,o.receiveShadow=!0,this.group.add(o),this.addTarget(o)}}buildPlatform(){const i=new tt(new Pt(32,2.2,32),this.mat.stoneHigh);i.position.y=2.2/2,i.castShadow=!0,i.receiveShadow=!0,i.material=this.mat.stoneHigh.clone(),i.material.map=this.textures.wall.clone(),i.material.map.repeat.set(3,1),i.material.map.needsUpdate=!0,this.group.add(i),this.addTarget(i),this.addSolid(-32/2,32/2,0,2.2,-32/2,32/2,!0);const n=new tt(new Ze(32,32),this.textures.floorPlatform);n.rotation.x=-Math.PI/2,n.position.y=2.2+.005,n.receiveShadow=!0,n.material=new kt({map:this.textures.floorPlatform,roughness:.85,metalness:.3,color:12764364}),this.group.add(n),this.addTarget(n);const r=this.mat.metal;for(const[d,g,S,m]of[[0,-32/2,32+1.2,.7],[0,32/2,32+1.2,.7],[-32/2,0,.7,32+1.2],[32/2,0,.7,32+1.2]]){const f=new tt(new Pt(S,.22,m),r);f.position.set(d,2.2+.08,g),f.castShadow=!0,f.receiveShadow=!0,this.group.add(f),this.addTarget(f)}for(const[d,g,S,m]of[[0,-32/2-.52,32+1.2,.1],[0,32/2+.52,32+1.2,.1],[-32/2-.52,0,.1,32+1.2],[32/2+.52,0,.1,32+1.2]]){const f=new tt(new Pt(S,.07,m),this.mat.cyanGlow);f.position.set(d,2.2-.28,g),this.group.add(f)}const a=new tt(new Ze(14,14),this.mat.emblem);a.rotation.x=-Math.PI/2,a.position.y=2.2+.03,a.renderOrder=3,this.group.add(a),this.emblem=a;const o=new Xi(7.1,7.35,96),l=new tt(o,new Ee({color:16738850,transparent:!0,opacity:.55,side:_e,blending:oe,depthWrite:!1,toneMapped:!1}));l.rotation.x=-Math.PI/2,l.position.y=2.2+.025,this.group.add(l),this.emblemRing=l;const c=7,h=10,p=32/2,u=[{x:0,z:p+h/2,high:"minZ"},{x:0,z:-p-h/2,high:"maxZ"},{x:p+h/2,z:0,high:"minX"},{x:-p-h/2,z:0,high:"maxX"}];for(const d of u){const g=this.makeWedge(c,h,2.2);g.position.set(d.x,0,d.z),d.high==="minX"&&(g.rotation.y=-Math.PI/2),d.high==="maxX"&&(g.rotation.y=Math.PI/2),d.high==="minZ"&&(g.rotation.y=Math.PI),g.castShadow=!0,g.receiveShadow=!0,this.group.add(g),this.addTarget(g);let S=d.x-c/2,m=d.x+c/2,f=d.z-h/2,y=d.z+h/2;const A={minX:S,maxX:m,minZ:f,maxZ:y,lowY:0,highY:2.2,high:d.high};this.ramps.push(A);const M=new tt(new Pt(c+.5,.08,.4),this.mat.hazard);d.high==="minZ"||d.high==="maxZ"?M.position.set(d.x,.05,d.high==="minZ"?d.z+h/2-.3:d.z-h/2+.3):(M.rotation.y=Math.PI/2,M.position.set(d.high==="minX"?d.x+h/2-.3:d.x-h/2+.3,.05,d.z)),this.group.add(M)}}makeWedge(t,e,i){const n=t/2,r=e/2,a=new Float32Array([-n,0,-r,n,0,-r,n,0,r,-n,0,r,-n,i,r,n,i,r]),o=new Float32Array([0,0,t/2,0,t/2,e/2,0,e/2,0,e/2,t/2,e/2]),l=[0,1,5,0,5,4,0,4,3,1,2,5,3,4,5,3,5,2,0,2,1,0,3,2],c=new ge;c.setAttribute("position",new Te(a,3)),c.setAttribute("uv",new Te(o,2)),c.setIndex(l),c.computeVertexNormals();const h=this.mat.metal.clone();return h.side=_e,h.map=this.textures.metal,new tt(c,h)}buildWalls(){const t=this.mat.stone,e=21,i=2,n=[{x:0,z:-54,w:110,d:i,rot:0},{x:0,z:54,w:110,d:i,rot:Math.PI},{x:-54,z:0,w:i,d:110,rot:Math.PI/2},{x:54,z:0,w:i,d:110,rot:-Math.PI/2}];for(const r of n){const a=new tt(new Pt(r.w,e,r.d),t);a.position.set(r.x,e/2-1,r.z),a.receiveShadow=!0,a.castShadow=!0,this.group.add(a),this.addTarget(a)}for(let r=0;r<4;r+=1){const a=r*Math.PI/2,o=Math.sin(a),l=Math.cos(a),c=Math.cos(a),h=-Math.sin(a);for(const u of[1.1,7.7,15.2]){const d=new tt(new Pt(104,.45,.9),this.mat.metalDark);d.position.set(o*52.2,u,l*52.2),d.rotation.y=a,d.castShadow=!0,d.receiveShadow=!0,this.group.add(d),this.addTarget(d)}const p=new tt(new Pt(100,.09,.22),this.mat.orangeGlow);p.position.set(o*52.7,13.1,l*52.7),p.rotation.y=a,this.group.add(p);for(const u of[-45,-30,-15,0,15,30,45]){const d=c*u+o*52,g=h*u+l*52,S=new tt(new Pt(2.3,16,2.6),this.mat.stoneHigh);S.position.set(d,7.2,g),S.rotation.y=a,S.castShadow=!0,S.receiveShadow=!0,this.group.add(S),this.addTarget(S),this.addSolid(d-1.3,d+1.3,0,15.2,g-1.4,g+1.4);const m=new tt(new Pt(3.1,.45,3.3),this.mat.metalDark);m.position.set(d,10.5,g),m.rotation.y=a,m.castShadow=!0,this.group.add(m)}for(const u of[-37.5,-12.5,12.5,37.5])this.buildArch(c*u+o*52.94,h*u+l*52.94,a+Math.PI,u)}for(let r=0;r<4;r+=1){const a=r*Math.PI/2,o=Math.sin(a),l=Math.cos(a),c=o*52.9+Math.cos(a)*0,h=l*52.9,p=new tt(new Ze(3.4,7.4),this.mat.banner);p.position.set(c,11.2,h),p.rotation.y=a,this.group.add(p)}}buildArch(t,e,i,n){const r=new re;r.position.set(t,0,e),r.rotation.y=i,this.group.add(r);const a=new tt(new Ze(6.2,10.6),new kt({color:526605,roughness:1,metalness:0}));a.position.set(0,6.5,.04),r.add(a);const o=new tt(new Ze(3.4,3.4),this.mat.emblem);o.position.set(0,6.8,.08),o.material=this.mat.emblem,r.add(o);for(const c of[-1,1]){const h=new tt(new Pt(.62,9.4,.7),this.mat.stoneHigh);h.position.set(c*3.2,4.7,.18),h.castShadow=!0,h.receiveShadow=!0,r.add(h);const p=new tt(new Pt(1.1,.55,1.2),this.mat.metalDark);p.position.set(c*3.2,.3,.2),r.add(p);const u=new tt(new Pt(.55,4.6,.7),this.mat.stoneHigh);u.position.set(c*1.7,9.4,.18),u.rotation.z=c*.55,u.castShadow=!0,r.add(u)}const l=new tt(new Pt(.9,.85,.9),this.mat.metalDark);if(l.position.set(0,11.5,.2),l.castShadow=!0,r.add(l),Math.abs(n)>1){const h=new tt(new Pt(.48,.48,1.2),this.mat.metalDark);h.position.set(0,9.6,.8),r.add(h);const p=new tt(new Ie(.45,.22,.55,8),this.mat.blackStone);p.position.set(0,9.6+.45,1.3),r.add(p);const u=new Si(new si({map:this.textures.glow,color:16747058,transparent:!0,opacity:.9,blending:oe,depthWrite:!1}));u.position.set(0,9.6+.9,1.3),u.scale.setScalar(1.5),r.add(u),r.updateMatrixWorld(!0);const d=new R;u.getWorldPosition(d);let g=null;n===12.5&&(g=new kn(16742954,30,26,2),g.position.copy(d),this.scene.add(g)),this.torches.push({flame:u,world:d,phase:Math.random()*10,light:g})}}buildCatwalk(){const n=[{x:0,z:50.5,w:106,d:5},{x:0,z:-50.5,w:106,d:5},{x:50.5,z:0,w:5,d:101},{x:-50.5,z:0,w:5,d:101}];for(const f of n){const y=new tt(new Pt(f.w,.5,f.d),this.mat.metalDark);y.position.set(f.x,7.5-.25,f.z),y.castShadow=!0,y.receiveShadow=!0,this.group.add(y),this.addTarget(y),this.addSolid(f.x-f.w/2,f.x+f.w/2,7.5-.5,7.5,f.z-f.d/2,f.z+f.d/2,!0)}const r=this.mat.metal,a=new Pt(.16,1.15,.16),o=68,l=new ml(a,r,o);l.castShadow=!0;const c=new ie;let h=0;const p=44;for(let f=0;f<4;f+=1)for(let y=0;y<17;y+=1){const A=-p+y/16*p*2;let M=0,b=0;f===0&&(M=A,b=-48),f===1&&(M=A,b=48),f===2&&(M=-48,b=A),f===3&&(M=48,b=A),c.makeTranslation(M,7.5+.58,b),l.setMatrixAt(h,c),h+=1}l.instanceMatrix.needsUpdate=!0,this.group.add(l);const u=[7.5+.35,7.5+.95],d=[{x:0,z:-48,w:88,d:.12,ry:0,skip:!1},{x:0,z:48,w:88,d:.12,ry:0,skip:!0},{x:-48,z:0,w:96,d:.12,ry:Math.PI/2,skip:!1},{x:48,z:0,w:96,d:.12,ry:Math.PI/2,skip:!1}];for(const f of d){if(f.skip){for(const y of u){const A=new tt(new Pt(84,.09,f.d),r);A.position.set(0,y,f.z),this.group.add(A)}continue}for(const y of u){const A=new tt(new Pt(f.w,.09,f.d),r);A.position.set(f.x,y,f.z),A.rotation.y=f.ry,this.group.add(A),this.addTarget(A)}}this.addSolid(-42,42,7.5,7.5+1.15,-48-.1,-48+.1),this.addSolid(-42,42,7.5,7.5+1.15,48-.1,48+.1),this.addSolid(-48-.1,-48+.1,7.5,7.5+1.15,-48,48),this.addSolid(48-.1,48+.1,7.5,7.5+1.15,-48,48);const g=new Pt(.22,7,.22),S=new ml(g,this.mat.metal,44);S.castShadow=!0;let m=0;for(let f=0;f<4;f+=1)for(let y=0;y<11;y+=1){const A=-48+y/10*96;let M,b;f===0?(M=A,b=-48):f===1?(M=A,b=48):f===2?(M=-48,b=A):(M=48,b=A),c.makeTranslation(M,3.6,b),S.setMatrixAt(m,c),m+=1}S.instanceMatrix.needsUpdate=!0,this.group.add(S),this.buildCatwalkRamp(46,21,49,5,7.5,"maxZ"),this.buildCatwalkRamp(-46,21,49,5,7.5,"maxZ")}buildCatwalkRamp(t,e,i,n,r,a){const o=i-e,l=this.makeWedge(n,o,r);l.position.set(t,0,(e+i)/2),l.castShadow=!0,l.receiveShadow=!0,this.group.add(l),this.addTarget(l),this.ramps.push({minX:t-n/2,maxX:t+n/2,minZ:e,maxZ:i,lowY:0,highY:r,high:a});const c=new tt(new Pt(n,.08,.4),this.mat.hazard);c.position.set(t,.05,e+.3),this.group.add(c)}buildPillars(){for(let i=0;i<8;i+=1){const n=i/8*Math.PI*2+Math.PI/8,r=Math.cos(n)*34,a=Math.sin(n)*34,o=new re;o.position.set(r,0,a),this.group.add(o);const l=new tt(new Pt(4.6,.7,4.6),this.mat.stoneHigh);l.position.y=.35,l.castShadow=!0,l.receiveShadow=!0,o.add(l),this.addTarget(l);const c=new tt(new Ie(1.35,1.65,15,8),this.mat.stone);c.position.y=8.1,c.castShadow=!0,c.receiveShadow=!0,o.add(c),this.addTarget(c),this.addSolid(r-1.65,r+1.65,0,15.6,a-1.65,a+1.65);const h=new tt(new Pt(4,.75,4),this.mat.stoneHigh);h.position.y=15.9,h.castShadow=!0,o.add(h),this.addTarget(h);const p=new tt(new Ie(1.9,2.2,1.1,8),this.mat.metalDark);p.position.y=16.8,p.castShadow=!0,o.add(p);const u=new tt(new Ie(1.48,1.48,.18,8),this.mat.orangeGlow);u.position.y=6.2,o.add(u);const d=new Si(new si({map:this.textures.glow,color:16742952,transparent:!0,opacity:.75,blending:oe,depthWrite:!1}));d.position.set(0,17.9,0),d.scale.setScalar(2.2),o.add(d),o.updateMatrixWorld(!0);const g=new R;d.getWorldPosition(g),this.torches.push({flame:d,world:g,phase:Math.random()*10})}}buildCover(){const t=[{x:-35,z:-10,w:5.2,h:2.6,d:1.6,ry:0},{x:35,z:10,w:5.2,h:2.6,d:1.6,ry:0},{x:-10,z:-35,w:1.6,h:2.6,d:5.2,ry:0},{x:10,z:35,w:1.6,h:2.6,d:5.2,ry:0},{x:-39,z:39,w:3,h:3,d:3,ry:.2},{x:39,z:-39,w:3,h:3,d:3,ry:-.15},{x:-39,z:-39,w:2.6,h:2.2,d:2.6,ry:.4},{x:39,z:39,w:2.6,h:2.2,d:2.6,ry:-.4}];for(const e of t){const i=new tt(new Pt(e.w,e.h,e.d),this.mat.metalDark.clone());i.material.map=this.textures.metal.clone(),i.material.map.repeat.set(Math.max(1,e.w/2),Math.max(1,e.h/2)),i.material.map.needsUpdate=!0,i.position.set(e.x,e.h/2,e.z),i.rotation.y=e.ry,i.castShadow=!0,i.receiveShadow=!0,this.group.add(i),this.addTarget(i);const n=e.w/2,r=e.d/2,a=Math.abs(Math.cos(e.ry))*n+Math.abs(Math.sin(e.ry))*r,o=Math.abs(Math.sin(e.ry))*n+Math.abs(Math.cos(e.ry))*r;this.addSolid(e.x-a,e.x+a,0,e.h,e.z-o,e.z+o,!0)}for(const[e,i]of[[-11,-11],[11,-11],[-11,11],[11,11]]){const n=new tt(new Pt(2.4,1,1),this.mat.stoneHigh);n.position.set(e,2.7,i),n.castShadow=!0,n.receiveShadow=!0,this.group.add(n),this.addTarget(n),this.addSolid(e-1.2,e+1.2,2.2,3.2,i-.5,i+.5,!0)}}buildLava(){const t=[{x:-37,z:37,w:9,d:6},{x:37,z:37,w:9,d:6},{x:-37,z:-37,w:9,d:6},{x:37,z:-37,w:9,d:6}];for(const e of t){const i=new tt(new Pt(e.w+1.2,.45,e.d+1.2),this.mat.blackStone);i.position.set(e.x,.2,e.z),i.receiveShadow=!0,this.group.add(i),this.addTarget(i);const n=new tt(new Ze(e.w,e.d),this.mat.lava.clone());n.rotation.x=-Math.PI/2,n.position.set(e.x,.44,e.z),this.group.add(n),this.addTarget(n);const r=this.mat.metal;for(const[o,l,c,h]of[[e.x,e.z-e.d/2-.7,e.w+1.2,.16],[e.x,e.z+e.d/2+.7,e.w+1.2,.16],[e.x-e.w/2-.7,e.z,.16,e.d+1.2],[e.x+e.w/2+.7,e.z,.16,e.d+1.2]]){const p=new tt(new Pt(c,.08,h),r);p.position.set(o,1.1,l),this.group.add(p)}for(const[o,l]of[[e.x-e.w/2-.7,e.z-e.d/2-.7],[e.x+e.w/2+.7,e.z-e.d/2-.7],[e.x-e.w/2-.7,e.z+e.d/2+.7],[e.x+e.w/2+.7,e.z+e.d/2+.7]]){const c=new tt(new Pt(.16,1.15,.16),r);c.position.set(o,.57,l),this.group.add(c)}this.hazards.push({minX:e.x-e.w/2,maxX:e.x+e.w/2,minZ:e.z-e.d/2,maxZ:e.z+e.d/2});const a=new kn(16730638,26,26,2);a.position.set(e.x,1.8,e.z),this.scene.add(a),this.lavaLights.push(a)}}buildPortals(){const t=[{x:43,z:0,ry:-Math.PI/2},{x:-43,z:0,ry:Math.PI/2},{x:0,z:43,ry:0},{x:0,z:-43,ry:Math.PI}];for(const e of t){const i=new re;i.position.set(e.x,0,e.z),i.rotation.y=e.ry,this.scene.add(i);const n=new tt(new zn(2.2,.14,8,48),new kt({color:1574918,emissive:16730646,emissiveIntensity:4.2,roughness:.3}));n.rotation.x=-Math.PI/2,n.position.y=.06,i.add(n);const r=new tt(new Eo(2.05,48),new Ee({color:16734751,transparent:!0,opacity:.1,blending:oe,depthWrite:!1,side:_e}));r.rotation.x=-Math.PI/2,r.position.y=.07,i.add(r);for(const o of[-1,1]){const l=new tt(new sn(.55,5.4,4),this.mat.blackStone);l.position.set(o*3.1,2.7,0),l.castShadow=!0,i.add(l);const c=new tt(new gr(.32),this.mat.orangeGlow);c.position.set(o*3.1,5.6,0),i.add(c)}i.updateMatrixWorld(!0);const a=new R(e.x,0,e.z);this.portals.push({group:i,ring:n,inner:r,spawn:a,phase:Math.random()*10})}}buildJumpPads(){const t=[{x:-30,z:30},{x:30,z:30},{x:-30,z:-30},{x:30,z:-30}];for(const e of t){const i=new re;i.position.set(e.x,0,e.z),this.scene.add(i);const n=new tt(new Ie(1.65,1.9,.22,24),this.mat.metal);n.position.y=.11,n.receiveShadow=!0,i.add(n);const r=new tt(new Xi(.55,1.45,32),new Ee({color:6747391,transparent:!0,opacity:.8,side:_e,blending:oe,depthWrite:!1,toneMapped:!1}));r.rotation.x=-Math.PI/2,r.position.y=.235,i.add(r);const a=new tt(new Xi(.2,.42,3),new Ee({color:15400959,transparent:!0,opacity:.9,side:_e,blending:oe,depthWrite:!1,toneMapped:!1}));a.rotation.x=-Math.PI/2,a.rotation.z=Math.PI/2,a.position.y=.24,i.add(a),this.jumpPads.push({position:new R(e.x,.1,e.z),ring:r,chevron:a,cooldown:0,phase:Math.random()*10})}}buildProps(){const t=new kt({color:2763827,metalness:.9,roughness:.5});for(let i=0;i<18;i+=1){const n=i/18*Math.PI*2+.12,r=50.5,a=Math.cos(n)*r,o=Math.sin(n)*r,l=xt(2.4,6),c=new tt(new Ie(.035,.035,l,4),t);c.position.set(a,17.5-l/2,o),this.group.add(c);const h=new tt(new zn(.16,.04,5,10),t);h.position.set(a,17.5-l,o),h.rotation.x=Math.PI/2,this.group.add(h)}const e=new kt({color:2829363,roughness:.95,metalness:.1});for(let i=0;i<30;i+=1){const n=xt(.12,.45),r=new tt(new To(n,0),e),a=Math.random()*Math.PI*2,o=xt(20,50);r.position.set(Math.cos(a)*o,n/2,Math.sin(a)*o),r.rotation.set(Math.random(),Math.random(),Math.random()),r.castShadow=!0,r.receiveShadow=!0,this.group.add(r)}}groundHeightAt(t,e,i){let n=0;const r=.62;for(const a of this.groundBoxes)t>=a.minX-.1&&t<=a.maxX+.1&&e>=a.minZ-.1&&e<=a.maxZ+.1&&a.maxY<=i+r&&a.maxY>n&&(n=a.maxY);for(const a of this.ramps)if(t>=a.minX&&t<=a.maxX&&e>=a.minZ&&e<=a.maxZ){let o;a.high==="maxZ"||a.high==="minZ"?(o=(e-a.minZ)/(a.maxZ-a.minZ),a.high==="minZ"&&(o=1-o)):(o=(t-a.minX)/(a.maxX-a.minX),a.high==="minX"&&(o=1-o));const l=a.lowY+(a.highY-a.lowY)*De(o,0,1);l<=i+r&&l>n&&(n=l)}return n}inHazard(t,e){for(const i of this.hazards)if(t>=i.minX&&t<=i.maxX&&e>=i.minZ&&e<=i.maxZ)return!0;return!1}pointBlocked(t,e,i,n=0){for(const r of this.solids)if(t>r.minX-n&&t<r.maxX+n&&e>r.minY-n&&e<r.maxY+n&&i>r.minZ-n&&i<r.maxZ+n)return!0;return!1}raycast(t,e,i=200){this.raycaster.set(t,e),this.raycaster.far=i;const n=this.raycaster.intersectObjects(this.raycastTargets,!1);return n.length?n[0]:null}hasLineOfSight(t,e){qs.subVectors(e,t);const i=qs.length();if(i<.001)return!0;qs.divideScalar(i),ic.copy(t);const n=this.raycast(ic,qs,i);return!n||n.distance>i-.55}update(t){this.portalTime+=t,this.textures.lava.offset.x+=t*.012,this.textures.lava.offset.y+=t*.008;for(let e=0;e<this.lavaLights.length;e+=1){const i=this.portalTime*1.7+e*1.3;this.lavaLights[e].intensity=22+Math.sin(i)*5+Math.sin(i*2.7)*2.4}for(const e of this.torches){const i=.7+Math.sin(this.portalTime*8+e.phase)*.14+Math.sin(this.portalTime*21+e.phase*2)*.08;e.flame.scale.setScalar(1.3+i*.55),e.flame.material.opacity=.65+i*.25,e.light&&(e.light.intensity=24+i*12),Math.random()<t*16&&this.game.effects.ember(e.world)}for(const e of this.portals){const i=this.portalTime*.8+e.phase;e.ring.rotation.z+=t*.2,e.ring.scale.setScalar(1+Math.sin(i)*.035),e.inner.material.opacity=.07+(Math.sin(i*1.7)+1)*.04,e.inner.rotation.z-=t*.35,Math.random()<t*5&&this.game.effects.ember(e.spawn.clone().add(new R(xt(-1.6,1.6),.4,xt(-1.6,1.6))))}for(const e of this.jumpPads){e.cooldown=Math.max(0,e.cooldown-t),e.ring.rotation.z+=t*.9,e.chevron.rotation.z-=t*1.4;const i=1+Math.sin(this.portalTime*3+e.phase)*.08;e.ring.scale.setScalar(i)}this.emblem&&(this.emblem.material.opacity=.78+Math.sin(this.portalTime*1.1)*.12,this.emblemRing.material.opacity=.4+Math.sin(this.portalTime*1.4)*.2,this.emblemRing.rotation.z+=t*.02),this.stars&&(this.stars.rotation.y+=t*.0015),this.pickups.update(t),this.updateJumpPads(t)}updateJumpPads(t){const e=this.game.player;if(!(!e||!e.alive))for(const i of this.jumpPads){if(i.cooldown>0)continue;const n=e.pos.x-i.position.x,r=e.pos.z-i.position.z;if(n*n+r*r<2.4&&e.pos.y<.6){const a=new R(-i.position.x,0,-i.position.z).normalize();e.vel.set(a.x*9,17.5,a.z*9),e.onGround=!1,i.cooldown=1.4,this.game.audio.dash(),this.game.effects.burst(i.position.clone().setY(.4),6747391,22,7,{size:.22,life:.5,up:2}),this.game.addShake(.12,.2)}}}}class O0{constructor(t,e){this.game=t,this.arena=e,this.scene=t.scene,this.textures=t.textures,this.items=[],this.defs=[{kind:"health",x:-24,y:0,z:0,respawn:22},{kind:"health",x:24,y:0,z:0,respawn:22},{kind:"health",x:0,y:2.2,z:0,respawn:30},{kind:"armor",x:0,y:0,z:24,respawn:24},{kind:"armor",x:0,y:0,z:-24,respawn:24},{kind:"rockets",x:12,y:2.2,z:12,respawn:14},{kind:"rockets",x:-12,y:2.2,z:-12,respawn:14},{kind:"rockets",x:0,y:0,z:42,respawn:16},{kind:"shells",x:-12,y:2.2,z:12,respawn:14},{kind:"shells",x:12,y:2.2,z:-12,respawn:14},{kind:"slugs",x:30,y:0,z:30,respawn:18},{kind:"slugs",x:-30,y:0,z:-30,respawn:18}];for(const i of this.defs)this.addItem(i.kind,new R(i.x,i.y,i.z),i.respawn)}makeMesh(t){const e=new re,i=t==="health"?16726826:t==="armor"?6220287:t==="rockets"?16747054:t==="shells"?16761418:9272319,n=new kn(i,2.4,6,2);n.position.y=.9,e.add(n);const r=new tt(new Xi(.55,.78,32),new Ee({color:i,transparent:!0,opacity:.5,side:_e,blending:oe,depthWrite:!1,toneMapped:!1}));r.rotation.x=-Math.PI/2,r.position.y=.03,e.add(r);const a=new Si(new si({map:this.textures.glow,color:i,transparent:!0,opacity:.35,blending:oe,depthWrite:!1}));a.position.y=.85,a.scale.setScalar(1.7),e.add(a);const o=new re;if(o.position.y=.9,e.add(o),t==="health"){const l=new kt({color:16052196,emissive:16722450,emissiveIntensity:.9,roughness:.35,metalness:.15}),c=new tt(new Pt(.95,.3,.3),l),h=new tt(new Pt(.3,.95,.3),l);o.add(c,h)}else if(t==="armor"){const l=new kt({color:997184,emissive:3132904,emissiveIntensity:1.6,roughness:.2,metalness:.8}),c=new tt(new gr(.46),l);o.add(c)}else if(t==="rockets"){const l=new kt({color:3882823,emissive:16734751,emissiveIntensity:.55,roughness:.4,metalness:.8});for(let c=0;c<3;c+=1){const h=new tt(new Ie(.09,.09,.8,8),l);h.position.set((c-1)*.28,0,0),h.rotation.z=.2*(c-1),o.add(h)}}else if(t==="shells"){const l=new kt({color:12092974,emissive:7027720,emissiveIntensity:.4,roughness:.3,metalness:.9});for(let c=0;c<3;c+=1){const h=new tt(new Ie(.12,.12,.55,8),l);h.position.set((c-1)*.3,0,0),h.rotation.z=Math.PI/2,o.add(h)}}else{const l=new kt({color:2958416,emissive:9272319,emissiveIntensity:1.7,roughness:.2,metalness:.7});for(let c=0;c<2;c+=1){const h=new tt(new wo(.1,.5,4,8),l);h.position.set((c-.5)*.3,0,0),h.rotation.z=.2,o.add(h)}}return e.userData.icon=o,e.userData.ring=r,e.userData.glow=a,e.userData.color=i,e}addItem(t,e,i=18,n=!1,r=25){const a=this.makeMesh(t);a.position.copy(e),a.position.y+=.02,this.scene.add(a);const o={kind:t,mesh:a,baseY:e.y,active:!0,timer:0,respawn:i,temporary:n,life:r,spin:xt(.6,1.2),pulse:Math.random()*10};return this.items.push(o),o}spawnDrop(t,e){const i=this.addItem(t,new R(e.x,Math.max(e.y,0),e.z),0,!0,24);return i.mesh.position.y=Math.max(e.y,.1),i.baseY=i.mesh.position.y,i}update(t){const e=this.game.player;if(e)for(let i=this.items.length-1;i>=0;i-=1){const n=this.items[i],r=n.mesh;if(!n.active)if(n.timer-=t,n.timer<=0){if(n.temporary){this.scene.remove(r),this.items.splice(i,1);continue}n.active=!0,r.visible=!0}else continue;if(n.temporary&&(n.life-=t,n.life<=0)){r.visible=!1,n.active=!1,n.timer=.001;continue}n.pulse+=t;const a=Math.sin(n.pulse*2)*.12;r.position.y=n.baseY+.04+a,r.userData.icon.rotation.y+=t*n.spin,r.userData.ring.rotation.z+=t*.7;const o=1+Math.sin(n.pulse*3)*.12;if(r.userData.ring.scale.setScalar(o),r.userData.glow.material.opacity=.3+(Math.sin(n.pulse*3)+1)*.08,!e.alive)continue;const l=e.pos.x-r.position.x,c=e.pos.z-r.position.z,h=e.pos.y+.9-r.position.y;l*l+c*c<2.4&&Math.abs(h)<1.8&&this.collect(n,e)&&(n.active=!1,n.timer=n.respawn,r.visible=!1,n.temporary&&(this.scene.remove(r),this.items.splice(i,1)))}}collect(t,e){const i=this.game;if(t.kind==="health"){if(e.health>=100)return!1;e.health=Math.min(100,e.health+35),i.audio.pickup("health"),i.hud.pickupFlash(),i.hud.toast("+35 HEALTH")}else if(t.kind==="armor"){if(e.armor>=100)return!1;e.armor=Math.min(100,e.armor+50),i.audio.pickup("armor"),i.hud.pickupFlash(),i.hud.toast("+50 ARMOR")}else{const n=e.ammoMax[t.kind];if(e.ammo[t.kind]>=n)return!1;const r=t.kind==="rockets"?5:t.kind==="shells"?6:3;e.ammo[t.kind]=Math.min(n,e.ammo[t.kind]+r),i.audio.pickup("ammo"),i.hud.pickupFlash(),i.hud.toast(`+${r} ${t.kind.toUpperCase()}`)}return i.effects.burst(t.mesh.position.clone(),t.mesh.userData.color,14,3.5,{size:.2,life:.5,up:1.5}),i.hud.update(),!0}reset(){for(const t of this.items)this.scene.remove(t.mesh);this.items.length=0;for(const t of this.defs)this.addItem(t.kind,new R(t.x,t.y,t.z),t.respawn)}}const ra=new R,aa=new R,mi=new R,ns=new R;class z0{constructor(t){this.game=t,this.camera=t.camera,this.arena=t.arena,this.camera.rotation.order="YXZ",this.pos=new R(0,0,38),this.vel=new R,this.yaw=0,this.pitch=0,this.roll=0,this.height=1.8,this.radius=.42,this.alive=!0,this.onGround=!0,this.coyote=0,this.jumpBuffer=0,this.jumpSpeed=8.3,this.gravity=25,this.walkSpeed=9.8,this.maxSpeed=30,this.health=100,this.armor=0,this.maxHealth=100,this.maxArmor=100,this.ammo={rockets:20,shells:12,slugs:8},this.ammoMax={rockets:40,shells:30,slugs:20},this.weapon=0,this.keys=new Set,this.mouseDown=!1,this.mouseHeld=!1,this.pointerLocked=!1,this.sensitivity=.0022,this.bobPhase=0,this.bobAmount=0,this.landDip=0,this.pitchKick=0,this.shake=0,this.shakeLife=0,this.speed=0,this.footstepTimer=0,this.dashCooldown=0,this.hurtCooldown=0,this.invuln=0,this.lastDamageTime=-10,this.bindInput()}bindInput(){window.addEventListener("keydown",t=>{t.code!=="Escape"&&this.game.state==="playing"&&(["Space","ShiftLeft","ShiftRight"].includes(t.code)&&t.preventDefault(),this.keys.add(t.code),t.code==="Space"&&(this.jumpBuffer=.14),(t.code==="ShiftLeft"||t.code==="ShiftRight")&&this.tryDash(),t.code==="Digit1"&&this.game.weapons.setWeapon(0),t.code==="Digit2"&&this.game.weapons.setWeapon(1),t.code==="Digit3"&&this.game.weapons.setWeapon(2))}),window.addEventListener("keyup",t=>{this.keys.delete(t.code)}),window.addEventListener("blur",()=>{this.keys.clear(),this.mouseDown=!1}),document.addEventListener("mousemove",t=>{if(!this.pointerLocked||this.game.state!=="playing")return;const e=t.movementX||0,i=t.movementY||0;this.yaw-=e*this.sensitivity,this.pitch=De(this.pitch-i*this.sensitivity,-1.48,1.48),this.game.weapons.onLook(e,i),this.roll=Le(this.roll,De(-e*55e-5,-.035,.035),10,.016)}),window.addEventListener("mousedown",t=>{t.button===0&&this.game.state==="playing"&&(this.mouseDown=!0,this.mouseHeld=!0,this.game.audio.unlock())}),window.addEventListener("mouseup",t=>{t.button===0&&(this.mouseDown=!1,this.mouseHeld=!1)}),window.addEventListener("wheel",t=>{this.game.state==="playing"&&(t.preventDefault(),this.game.weapons.cycle(t.deltaY>0?1:-1))},{passive:!1}),window.addEventListener("contextmenu",t=>t.preventDefault()),document.addEventListener("pointerlockchange",()=>{this.pointerLocked=document.pointerLockElement===this.game.renderer.domElement,!this.pointerLocked&&this.game.state==="playing"&&this.game.startedWithLock&&this.game.pause()})}reset(){this.pos.set(0,0,38),this.vel.set(0,0,0),this.yaw=0,this.pitch=-.02,this.roll=0,this.alive=!0,this.onGround=!0,this.coyote=0,this.jumpBuffer=0,this.health=100,this.armor=0,this.ammo={rockets:20,shells:12,slugs:8},this.weapon=0,this.bobPhase=0,this.landDip=0,this.pitchKick=0,this.shake=0,this.dashCooldown=0,this.invuln=.8,this.hurtCooldown=0,this.keys.clear(),this.mouseDown=!1,this.mouseHeld=!1,this.camera.position.set(this.pos.x,this.pos.y+this.height*.92,this.pos.z),this.camera.fov=80,this.camera.updateProjectionMatrix(),this.updateCamera(0)}tryDash(){!this.alive||this.dashCooldown>0||(this.computeWish(),!(mi.lengthSq()<.1)&&(this.dashCooldown=1.7,this.vel.addScaledVector(mi,11.5),this.vel.y=Math.max(this.vel.y,1.5),this.game.audio.dash(),this.game.effects.burst(new R(this.pos.x,this.pos.y+.3,this.pos.z),6747391,18,5,{size:.18,life:.4,up:.7}),this.game.addShake(.07,.14)))}computeWish(){return ra.set(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),aa.set(Math.cos(this.yaw),0,-Math.sin(this.yaw)),mi.set(0,0,0),(this.keys.has("KeyW")||this.keys.has("ArrowUp"))&&mi.add(ra),(this.keys.has("KeyS")||this.keys.has("ArrowDown"))&&mi.sub(ra),(this.keys.has("KeyD")||this.keys.has("ArrowRight"))&&mi.add(aa),(this.keys.has("KeyA")||this.keys.has("ArrowLeft"))&&mi.sub(aa),mi.lengthSq()>0&&mi.normalize(),mi}update(t){if(!this.alive)return;this.invuln=Math.max(0,this.invuln-t),this.dashCooldown=Math.max(0,this.dashCooldown-t),this.hurtCooldown=Math.max(0,this.hurtCooldown-t);const e=this.computeWish(),i=e.lengthSq()>.001;if(this.onGround&&(this.vel.x*=Math.max(0,1-9.5*t),this.vel.z*=Math.max(0,1-9.5*t)),i){const l=this.walkSpeed,c=this.vel.x*e.x+this.vel.z*e.z,h=Math.max(0,l-c),p=this.onGround?62:13;this.vel.x+=e.x*h*p*t,this.vel.z+=e.z*h*p*t}this.onGround||i&&(this.vel.x+=e.x*5.2*t,this.vel.z+=e.z*5.2*t);const n=Math.hypot(this.vel.x,this.vel.z),r=this.onGround?14:this.maxSpeed;if(n>r){const l=r/n;this.vel.x*=l,this.vel.z*=l}this.jumpBuffer=Math.max(0,this.jumpBuffer-t),this.coyote=this.onGround?.12:Math.max(0,this.coyote-t),this.jumpBuffer>0&&this.coyote>0&&(this.vel.y=this.jumpSpeed,this.onGround=!1,this.coyote=0,this.jumpBuffer=0,this.game.audio.jump(),this.landDip=.04,this.game.effects.burst(new R(this.pos.x,this.pos.y+.1,this.pos.z),9080734,8,2.2,{size:.14,life:.35,gravity:2})),this.vel.y-=this.gravity*t,this.moveHorizontal(t);const a=this.onGround;this.pos.y+=this.vel.y*t;const o=this.arena.groundHeightAt(this.pos.x,this.pos.z,this.pos.y+.35);if(this.pos.y<=o||this.vel.y<=0&&this.pos.y-o<.04?(!a&&this.vel.y<-7&&(this.game.audio.land(),this.landDip=De(this.vel.y*.014,-.24,-.06),this.game.effects.burst(new R(this.pos.x,o+.1,this.pos.z),7830922,10,2.6,{size:.15,life:.4,gravity:2})),this.pos.y=o,this.vel.y=0,this.onGround=!0):this.onGround=!1,this.pos.y<-12){this.kill();return}this.arena.inHazard(this.pos.x,this.pos.z)&&this.pos.y<.75&&this.hazardDamage(t),this.speed=Math.hypot(this.vel.x,this.vel.z),this.onGround&&this.speed>1.2?(this.footstepTimer-=t,this.footstepTimer<=0&&(this.footstepTimer=De(.62-this.speed*.032,.24,.5),this.game.audio.footstep()),this.bobPhase+=t*(4.2+this.speed*.62),this.bobAmount=Le(this.bobAmount,De(this.speed/10,0,1),8,t)):this.bobAmount=Le(this.bobAmount,0,8,t),this.landDip=Le(this.landDip,0,12,t),this.pitchKick=Le(this.pitchKick,0,8,t),this.roll=Le(this.roll,0,8,t),this.game.weapons.update(t),this.updateCamera(t),this.game.hud.update()}moveHorizontal(t){this.moveAxis("x",this.vel.x*t),this.moveAxis("z",this.vel.z*t)}moveAxis(t,e){if(e===0)return;this.pos[t]+=e;const i=this.pos.y,n=i+this.height;for(const r of this.arena.solids)n<=r.minY+.02||i>=r.maxY-.1||this.pos.x+this.radius>r.minX&&this.pos.x-this.radius<r.maxX&&this.pos.z+this.radius>r.minZ&&this.pos.z-this.radius<r.maxZ&&(t==="x"?(e>0?this.pos.x=r.minX-this.radius:this.pos.x=r.maxX+this.radius,this.vel.x=0):(e>0?this.pos.z=r.minZ-this.radius:this.pos.z=r.maxZ+this.radius,this.vel.z=0))}updateCamera(t){const e=Math.sin(this.bobPhase)*.026*this.bobAmount,i=Math.abs(Math.sin(this.bobPhase*2))*.035*this.bobAmount;ns.set(0,0,0),this.shake>.001&&(ns.set(xt(-1,1),xt(-1,1),xt(-1,1)).multiplyScalar(this.shake*.08),this.shake=Le(this.shake,0,8,t)),this.camera.position.set(this.pos.x+e*.5+ns.x,this.pos.y+this.height*.92+i+this.landDip+ns.y,this.pos.z+ns.z),this.camera.rotation.set(this.pitch+this.pitchKick,this.yaw,this.roll+this.landDip*.25)}addShake(t,e=.25){this.shake=Math.max(this.shake,t),this.shakeLife=Math.max(this.shakeLife,e)}addPitchKick(t){this.pitchKick-=t}takeDamage(t,e,{armorPierce:i=.45,knockback:n=null}={}){if(!this.alive||this.invuln>0)return;let r=t;if(this.armor>0){const a=Math.min(this.armor,r*.6);this.armor-=a,r-=a*(1-i)}this.health-=r,this.lastDamageTime=this.game.elapsed,this.hurtCooldown=.18,n&&this.vel.add(n),this.game.audio.playerHurt(),this.game.hud.damageFlash(Math.min(1,.35+r/60),e),this.game.addShake(Math.min(.35,.12+r/220),.25),this.health<=0&&(this.health=0,this.kill()),this.game.hud.update()}hazardDamage(t){this.hurtCooldown>0||(this.hurtCooldown=.32,this.health-=7,this.lastDamageTime=this.game.elapsed,this.game.audio.playerHurt(),this.game.hud.damageFlash(.22,null),this.game.hud.toast("LAVA · MOVE!"),this.game.effects.burst(new R(this.pos.x,this.pos.y+.3,this.pos.z),16738850,12,3.2,{size:.2,life:.5,up:1.8}),this.health<=0&&(this.health=0,this.kill()),this.game.hud.update())}kill(){this.alive&&(this.alive=!1,this.health=0,this.mouseDown=!1,this.mouseHeld=!1,this.game.audio.playerDeath(),this.game.addShake(.6,.7),this.game.onPlayerDeath())}addAmmo(t,e){this.ammo[t]=Math.min(this.ammoMax[t],this.ammo[t]+e)}heal(t){this.health=Math.min(this.maxHealth,this.health+t)}}const B0=[{id:"rocket",name:"ROCKET LAUNCHER",slot:"01",ammo:"rockets",ammoLabel:"ROCKETS",fireRate:.78,auto:!0,color:16742954},{id:"rail",name:"RAILGUN",slot:"02",ammo:"slugs",ammoLabel:"SLUGS",fireRate:1.05,auto:!1,color:8386047},{id:"shotgun",name:"SHOTGUN",slot:"03",ammo:"shells",ammoLabel:"SHELLS",fireRate:.85,auto:!1,color:16762976}],ii=new R,ki=new R,oa=new R,la=new R,Ys=new R,k0=new R,G0=new cn,H0=new R(0,0,1);class V0{constructor(t){this.game=t,this.player=t.player,this.camera=t.camera,this.scene=t.scene,this.arena=t.arena,this.defs=B0,this.viewRoot=new re,this.viewRoot.position.set(0,0,0),this.camera.add(this.viewRoot),this.scene.add(this.camera),this.cooldown=0,this.equipTimer=0,this.recoil=0,this.recoilZ=0,this.flashTimer=0,this.swayX=0,this.swayY=0,this.bobTime=0,this.wasHeld=!1,this.rockets=[],this.lastShot=-10,this.buildMaterials(),this.models=[this.buildRocket(),this.buildRail(),this.buildShotgun()];for(const e of this.models)this.viewRoot.add(e.group),e.group.visible=!1;this.models[0].group.visible=!0}buildMaterials(){this.mats={gun:new kt({color:2501169,metalness:.55,roughness:.45}),gunDark:new kt({color:1053206,metalness:.8,roughness:.48}),gunLight:new kt({color:2237997,metalness:.08,roughness:.82}),edge:new kt({color:8225678,metalness:.35,roughness:.45}),glove:new kt({color:1579550,metalness:.1,roughness:.92}),gloveTrim:new kt({color:3877410,metalness:.3,roughness:.7}),orange:new kt({color:1968643,emissive:16730642,emissiveIntensity:1.15,metalness:.4,roughness:.3}),cyan:new kt({color:202781,emissive:6090495,emissiveIntensity:1.6,metalness:.4,roughness:.25}),wood:new kt({color:4005650,metalness:.05,roughness:.82})}}box(t,e,i,n,r,a,o,l,c=0,h=0,p=0){const u=new tt(new Pt(e,i,n),l);return u.position.set(r,a,o),u.rotation.set(c,h,p),t.add(u),u}cyl(t,e,i,n,r,a,o,l,c=16,h=0,p=0,u=0){const d=new tt(new Ie(e,i,n,c),l);return d.position.set(r,a,o),d.rotation.set(h,p,u),t.add(d),d}torus(t,e,i,n,r,a,o,l=0,c=0,h=0){const p=new tt(new zn(e,i,8,24),o);return p.position.set(n,r,a),p.rotation.set(l,c,h),t.add(p),p}makeMuzzle(t,e,i,n,r){const a=new Si(new si({map:this.game.textures.glow,color:r,transparent:!0,opacity:0,depthTest:!1,depthWrite:!1,blending:oe,toneMapped:!1}));return a.position.set(e,i,n),a.scale.setScalar(.34),a.renderOrder=100,t.add(a),a}buildRocket(){const t=new re,e=new R(.37,-.34,-.62);t.position.copy(e);const i=new re;t.add(i),this.cyl(i,.115,.135,1.18,0,0,-.12,this.mats.gun,18,Math.PI/2),this.cyl(i,.142,.142,.09,0,0,-.7,this.mats.gunDark,18,Math.PI/2),this.cyl(i,.095,.095,.06,0,0,-.755,this.mats.gunDark,18,Math.PI/2),this.box(i,.22,.2,.58,0,.01,-.04,this.mats.gunDark),this.box(i,.16,.05,.72,0,.14,-.1,this.mats.gunLight),this.box(i,.05,.035,.5,0,.18,-.12,this.mats.orange);for(let r=0;r<4;r+=1)this.torus(i,.135,.018,0,0,-.6+r*.16,r%2?this.mats.edge:this.mats.orange,0,0,0);for(const r of[-1,1])for(let a=0;a<4;a+=1)this.box(i,.025,.1,.06,r*.135,-.02,-.52+a*.13,this.mats.gunDark);this.cyl(i,.12,.1,.1,0,0,.48,this.mats.gunDark,16,Math.PI/2),this.torus(i,.11,.014,0,0,.52,this.mats.orange),this.box(i,.11,.27,.15,0,-.22,.12,this.mats.gunDark,.22),this.box(i,.12,.07,.32,0,-.08,.36,this.mats.gun),this.box(i,.1,.18,.13,0,-.16,.27,this.mats.gunDark,.3),this.box(i,.07,.09,.13,0,.22,-.18,this.mats.gunDark),this.box(i,.035,.02,.07,0,.27,-.18,this.mats.orange),this.box(i,.03,.12,.03,0,.2,-.36,this.mats.gunLight),this.box(i,.06,.06,.06,0,.2,-.42,this.mats.gunDark),this.box(i,.12,.13,.16,.01,-.28,.09,this.mats.glove,.22),this.box(i,.13,.1,.17,-.11,-.12,-.35,this.mats.glove,.1),this.box(i,.14,.05,.06,.01,-.35,.055,this.mats.gloveTrim,.22);const n=this.makeMuzzle(i,0,0,-.82,16752714);return{group:t,model:i,base:e,flash:n,muzzle:new R(0,0,-.84)}}buildRail(){const t=new re,e=new R(.34,-.31,-.66);t.position.copy(e);const i=new re;t.add(i),this.box(i,.16,.2,1.15,0,0,-.1,this.mats.gun),this.box(i,.1,.05,1.25,0,.13,-.14,this.mats.gunLight),this.box(i,.04,.035,.95,0,.17,-.12,this.mats.cyan);for(const r of[-1,1]){this.box(i,.035,.05,1.24,r*.085,.06,-.16,this.mats.edge);for(let a=0;a<5;a+=1)this.torus(i,.075,.012,r*.085,.06,-.62+a*.24,this.mats.gunDark)}this.box(i,.18,.1,.22,0,-.02,.3,this.mats.gunDark),this.box(i,.14,.035,.16,0,.035,.3,this.mats.cyan),this.cyl(i,.06,.075,.14,0,.06,-.74,this.mats.gunDark,12,Math.PI/2);for(let r=0;r<3;r+=1)this.torus(i,.073,.011,0,.06,-.77+r*.035,r===1?this.mats.cyan:this.mats.edge);this.cyl(i,.055,.055,.34,0,.23,-.08,this.mats.gunDark,12,Math.PI/2),this.cyl(i,.065,.05,.06,0,.23,-.26,this.mats.gunDark,12,Math.PI/2),this.box(i,.05,.06,.1,0,.16,-.08,this.mats.gunDark),this.box(i,.09,.012,.03,0,.252,-.29,this.mats.cyan),this.box(i,.1,.25,.14,0,-.2,.15,this.mats.gunDark,.2),this.box(i,.12,.13,.16,.01,-.27,.12,this.mats.glove,.2),this.box(i,.12,.11,.2,-.1,-.1,-.36,this.mats.glove,.06),this.box(i,.13,.05,.06,.01,-.33,.09,this.mats.gloveTrim,.2),this.box(i,.02,.08,.55,-.085,-.04,-.08,this.mats.cyan),this.box(i,.02,.08,.55,.085,-.04,-.08,this.mats.cyan);const n=this.makeMuzzle(i,0,.06,-.82,9435135);return{group:t,model:i,base:e,flash:n,muzzle:new R(0,.06,-.84)}}buildShotgun(){const t=new re,e=new R(.36,-.35,-.64);t.position.copy(e);const i=new re;t.add(i),this.cyl(i,.062,.068,1.05,0,.04,-.2,this.mats.gun,14,Math.PI/2),this.cyl(i,.085,.085,.06,0,.04,-.71,this.mats.gunDark,14,Math.PI/2),this.cyl(i,.048,.048,.95,0,-.1,-.16,this.mats.gunDark,12,Math.PI/2),this.box(i,.16,.24,.38,0,0,.1,this.mats.gun),this.box(i,.17,.08,.36,0,.15,.08,this.mats.gunLight),this.box(i,.04,.03,.2,0,.195,.05,this.mats.orange),this.box(i,.14,.14,.26,0,-.11,-.3,this.mats.wood);for(let r=0;r<4;r+=1)this.box(i,.15,.02,.02,0,-.11,-.42+r*.08,this.mats.gunDark);this.box(i,.13,.17,.42,0,-.06,.46,this.mats.wood,-.12),this.box(i,.15,.2,.06,0,-.1,.68,this.mats.gunDark,-.12),this.box(i,.03,.04,.04,0,.23,-.38,this.mats.gunLight),this.box(i,.06,.02,.05,0,.22,.02,this.mats.gunDark),this.box(i,.12,.12,.15,.01,-.19,.13,this.mats.glove,.18),this.box(i,.14,.12,.18,-.09,-.2,-.28,this.mats.glove,.1),this.box(i,.13,.05,.06,.01,-.25,.115,this.mats.gloveTrim,.18);const n=this.makeMuzzle(i,0,.04,-.78,16762976);return{group:t,model:i,base:e,flash:n,muzzle:new R(0,.04,-.8)}}setWeapon(t){if(!(t<0||t>=this.models.length)&&!(t===this.player.weapon&&this.models[t].group.visible)){this.player.weapon=t,this.equipTimer=.28;for(let e=0;e<this.models.length;e+=1)this.models[e].group.visible=e===t,this.models[e].flash.material.opacity=0;this.game.audio.ui(),this.game.hud.update()}}cycle(t){const e=(this.player.weapon+t+this.models.length)%this.models.length;this.setWeapon(e)}onLook(t,e){this.swayX=De(this.swayX-t*22e-5,-.035,.035),this.swayY=De(this.swayY-e*22e-5,-.03,.03)}update(t){this.cooldown=Math.max(0,this.cooldown-t),this.equipTimer=Math.max(0,this.equipTimer-t),this.recoil=Le(this.recoil,0,11,t),this.recoilZ=Le(this.recoilZ,0,12,t),this.swayX=Le(this.swayX,0,7,t),this.swayY=Le(this.swayY,0,7,t),this.flashTimer=Math.max(0,this.flashTimer-t);const e=this.player,i=e.speed||0,n=e.onGround?1:.35;this.bobTime+=t*(3.6+i*.55)*n;const r=this.models[e.weapon],a=r.group,o=this.equipTimer>0?Math.sin(this.equipTimer/.28*Math.PI):0;if(a.position.set(r.base.x+this.swayX+Math.sin(this.bobTime)*.012*n,r.base.y+this.swayY-o*.32+Math.abs(Math.sin(this.bobTime*2))*.012*n,r.base.z+this.recoilZ*.16),a.rotation.set(-this.recoil*.11-this.swayY*.4,this.swayX*.8,this.swayX*.5+Math.sin(this.bobTime)*.006*n),this.flashTimer<=0)for(const h of this.models)h.flash.material.opacity=0;const l=e.mouseHeld&&e.alive&&this.game.state==="playing",c=this.defs[e.weapon];l&&(!this.wasHeld||c.auto)&&this.tryFire(),this.wasHeld=l,this.updateRockets(t)}tryFire(){const t=this.player;if(!t.alive||this.game.state!=="playing")return;const e=this.defs[t.weapon];if(this.cooldown>0)return;if(t.ammo[e.ammo]<=0){this.cooldown=.28,this.game.audio.empty(),this.game.hud.toast("OUT OF AMMO");return}t.ammo[e.ammo]-=1,this.cooldown=e.fireRate,this.lastShot=this.game.elapsed,this.recoil=1,this.recoilZ=1,this.flashTimer=.065,this.game.audio[e.id]();const i=this.models[t.weapon];i.flash.material.opacity=1,i.flash.material.rotation=Math.random()*Math.PI*2;const n=e.id==="shotgun"?.5:e.id==="rail"?.4:.36;i.flash.scale.setScalar(n),this.camera.updateMatrixWorld(),i.model.getWorldPosition(Ys),Ys.add(i.muzzle.clone().applyMatrix4(i.model.matrixWorld).sub(i.model.getWorldPosition(new R))),this.camera.getWorldDirection(ii),oa.set(1,0,0).applyQuaternion(this.camera.quaternion),la.set(0,1,0).applyQuaternion(this.camera.quaternion),ki.copy(this.camera.position),this.game.effects.flashLight(Ys,e.color,e.id==="shotgun"?2.6:3.4,.08,8),t.addPitchKick(e.id==="rail"?.006:.014),this.game.addShake(e.id==="shotgun"?.08:.05,.12),e.id==="rocket"?this.spawnRocket(Ys.clone(),ii.clone()):e.id==="rail"?this.fireRail():this.fireShotgun(),this.game.hud.update()}spawnRocket(t,e){const i=new re,n=new tt(new Ie(.055,.075,.5,10),new kt({color:3817287,metalness:.8,roughness:.35,emissive:16734751,emissiveIntensity:.4}));n.rotation.x=Math.PI/2,i.add(n);const r=new tt(new sn(.075,.18,10),new kt({color:1710622,emissive:16742954,emissiveIntensity:2,metalness:.5,roughness:.4}));r.rotation.x=Math.PI/2,r.position.z=-.32,i.add(r);const a=new Si(new si({map:this.game.textures.glow,color:16747066,transparent:!0,opacity:.9,blending:oe,depthWrite:!1}));a.scale.setScalar(.8),i.add(a);const o=new kn(16738850,5,8,2);i.add(o),i.position.copy(t),i.quaternion.copy(G0.setFromUnitVectors(H0,e)),this.scene.add(i),this.rockets.push({group:i,light:o,vel:e.clone().multiplyScalar(54).addScaledVector(this.player.vel,.25),life:5,trailTimer:0})}updateRockets(t){for(let e=this.rockets.length-1;e>=0;e-=1){const i=this.rockets[e];i.life-=t;const n=i.group.position.clone();i.group.position.addScaledVector(i.vel,t),i.vel.y-=1.2*t,i.trailTimer+=t,i.trailTimer>.016&&(i.trailTimer=0,this.game.effects.rocketTrail(i.group.position));const r=i.vel.length()*t,a=k0.copy(i.vel).normalize();let o=!1;if(i.group.position.y<=.15)this.explodeRocket(i.group.position.clone().setY(.2)),o=!0;else{const l=this.arena.raycast(n,a,r+.1);l&&(this.explodeRocket(l.point),o=!0)}if(!o)for(const l of this.game.enemies.list){if(!l.alive)continue;const c=l.pos.x-i.group.position.x,h=l.pos.y+1.1-i.group.position.y,p=l.pos.z-i.group.position.z;if(c*c+h*h+p*p<1.55){this.explodeRocket(i.group.position.clone()),o=!0;break}}(o||i.life<=0)&&(i.life<=0&&this.explodeRocket(i.group.position.clone()),this.scene.remove(i.group),i.group.traverse(l=>{l.geometry&&l.geometry.dispose(),l.material&&(l.material.map&&l.material.map!==this.game.textures.glow&&l.material.map.dispose(),l.material.dispose())}),this.rockets.splice(e,1))}}explodeRocket(t){this.game.effects.explosion(t,1),this.game.audio.explosion(1),this.game.enemies.damageRadius(t,6.2,105,"ROCKET",.15);const e=this.player,i=e.pos.x-t.x,n=e.pos.y+.7-t.y,r=e.pos.z-t.z,a=Math.sqrt(i*i+n*n+r*r);if(a<6.4&&e.alive){const o=1-a/6.4,l=9+o*20,c=new R(i,n+.5,r).normalize().multiplyScalar(l);e.vel.add(c),e.onGround=!1,a>1.1&&this.game.elapsed-this.lastShot>.05?e.takeDamage(8+o*18,t,{armorPierce:.9}):a<=1.1&&e.takeDamage(6+o*10,t,{armorPierce:.9})}this.game.addShake(.32,.35)}fireRail(){this.camera.updateMatrixWorld(),ki.copy(this.camera.position),this.camera.getWorldDirection(ii);const t=this.arena.raycast(ki,ii,160),e=t?t.distance:160,i=this.game.enemies.rayHits(ki,ii,e);let n=t?t.point.clone():ki.clone().addScaledVector(ii,160),r=!1;const a=Math.min(3,i.length);for(let l=0;l<a;l+=1){const c=i[l],h=c.head?135:95;c.enemy.takeDamage(h,c.point,"RAILGUN",c.head,ii),r=!0,this.game.effects.burst(c.point,10483967,12,4,{size:.22,life:.45,up:1.4}),l===0&&(n=c.point.clone().addScaledVector(ii,.12))}const o=this.models[1].model.getWorldPosition(new R);o.addScaledVector(ii,.2),this.game.effects.railBeam(o,n,8386047),!r&&t&&this.game.effects.impact(t.point,t.face?.normal??ii.clone().negate(),8386047),r&&(this.game.hud.hitmarker(i[0].head),this.game.audio.hitmarker(i[0].head))}fireShotgun(){this.camera.updateMatrixWorld(),ki.copy(this.camera.position),this.camera.getWorldDirection(ii),oa.set(1,0,0).applyQuaternion(this.camera.quaternion),la.set(0,1,0).applyQuaternion(this.camera.quaternion);let t=!1,e=!1;for(let i=0;i<10;i+=1){const n=xt(-.055,.055),r=xt(-.055,.055),a=ii.clone().addScaledVector(oa,n).addScaledVector(la,r).normalize(),o=this.arena.raycast(ki,a,110),l=o?o.distance:110,c=this.game.enemies.rayHits(ki,a,l);if(c.length){const h=c[0],p=De(1-h.distance/70,.28,1),u=Math.round((h.head?26:13)*p);h.enemy.takeDamage(u,h.point,"SHOTGUN",h.head,a),this.game.effects.burst(h.point,h.head?16762976:16742986,5,2.8,{size:.16,life:.35}),t=!0,e=e||h.head,i%2===0&&this.game.effects.burst(h.point,8856078,3,1.8,{size:.2,life:.5,gravity:-10})}else o&&i<5&&this.game.effects.impact(o.point,o.face?.normal??a.clone().negate(),16756832)}t&&(this.game.hud.hitmarker(e),this.game.audio.hitmarker(e))}reset(){for(const t of this.rockets)this.scene.remove(t.group);this.rockets.length=0,this.cooldown=0,this.equipTimer=0,this.recoil=0,this.swayX=0,this.swayY=0;for(let t=0;t<this.models.length;t+=1)this.models[t].group.visible=t===this.player.weapon,this.models[t].flash.material.opacity=0;this.wasHeld=!1}}const W0={grunt:{name:"GRUNT",health:95,speed:4.6,scale:1,body:5003852,dark:2304804,trim:16747050,range:32,preferred:11,fireDelay:[1.35,2.1],projSpeed:25,damage:11,score:100,radius:.52},wraith:{name:"WRAITH",health:65,speed:6.3,scale:.9,body:2899028,dark:1383208,trim:6090495,range:30,preferred:8,fireDelay:[1,1.6],projSpeed:31,damage:9,score:140,radius:.45},brute:{name:"BRUTE",health:235,speed:3.4,scale:1.32,body:5973020,dark:2756620,trim:16726546,range:34,preferred:9,fireDelay:[1.8,2.6],projSpeed:21,damage:20,score:220,radius:.68}},Zs=new pr,ca=new hn,ha=new Yi,nc=new R,sc=new R,Ks=new R,Dn=new R,$s=new R;let X0=1;class q0{constructor(t,e,i,n=!1){this.game=t,this.type=W0[e],this.typeName=e,this.ambient=n,this.id=X0++,this.pos=i.clone(),this.vel=new R,this.health=this.type.health,this.maxHealth=this.type.health,this.scale=this.type.scale,this.alive=!0,this.state=n?"ambient":"spawning",this.spawnTimer=n?0:.75,this.deadTimer=0,this.fireTimer=xt(.8,2),this.losTimer=0,this.hasLos=!1,this.strafeDir=Math.random()>.5?1:-1,this.strafeTimer=xt(1,2.4),this.walkPhase=Math.random()*10,this.moving=0,this.hitFlash=0,this.deathSpin=new R,this.aimYaw=0,this.targetYaw=0,this.invuln=n?0:.6,this.hazardTimer=0,this.buildModel(),this.root.position.copy(this.pos),this.root.scale.setScalar(n?this.scale:.25*this.scale),this.game.scene.add(this.root),n||this.spawnEffect()}buildModel(){const t=this.type;this.root=new re,this.model=new re,this.root.add(this.model),this.mats={body:new kt({color:t.body,metalness:.62,roughness:.48,emissive:t.trim,emissiveIntensity:.05}),dark:new kt({color:t.dark,metalness:.7,roughness:.55}),trim:new kt({color:1312773,emissive:t.trim,emissiveIntensity:3.2,metalness:.5,roughness:.3}),eye:new Ee({color:t.trim,toneMapped:!1})},this.baseEmissive=[];for(const d of["body","dark","trim"])this.baseEmissive.push({mat:this.mats[d],value:this.mats[d].emissiveIntensity});this.scale;const e=this.mats.body,i=this.mats.dark,n=this.mats.trim,r=new tt(new Pt(.62,.32,.42),i);r.position.y=1.02,r.castShadow=!0,this.model.add(r);const a=new tt(new Pt(.92,.92,.56),e);a.position.y=1.58,a.castShadow=!0,a.receiveShadow=!0,this.model.add(a);const o=new tt(new Pt(.62,.5,.14),i);o.position.set(0,1.65,.32),o.castShadow=!0,this.model.add(o);const l=new tt(new Pt(.16,.34,.08),n);l.position.set(0,1.62,.42),this.model.add(l);for(const d of[-1,1]){const g=new tt(new Pt(.18,.54,.1),n);g.position.set(d*.27,1.65,.41),this.model.add(g);const S=new tt(new Pt(.38,.32,.44),i);if(S.position.set(d*.62,1.92,0),S.rotation.z=d*.12,S.castShadow=!0,this.model.add(S),this.typeName==="brute"){const m=new tt(new Pt(.5,.18,.58),e);m.position.set(d*.68,2.08,0),m.rotation.z=d*.18,m.castShadow=!0,this.model.add(m);const f=new tt(new sn(.1,.48,5),n);f.position.set(d*.82,2.24,0),f.rotation.z=d*-.55,this.model.add(f)}}this.head=new re,this.head.position.y=2.2,this.model.add(this.head);const c=new tt(new Pt(.4,.42,.42),e);c.castShadow=!0,this.head.add(c);const h=new tt(new Pt(.48,.16,.48),i);h.position.y=.2,this.head.add(h);const p=new tt(new Pt(.3,.075,.03),this.mats.eye);if(p.position.set(0,.03,.22),this.head.add(p),this.typeName==="brute")for(const d of[-1,1]){const g=new tt(new sn(.08,.55,5),n);g.position.set(d*.18,.32,-.03),g.rotation.z=d*.35,this.head.add(g)}if(this.typeName==="wraith"){const d=new tt(new sn(.42,.7,5,1,!0),i);d.position.set(0,.18,-.04),d.rotation.x=.1,d.material=this.mats.dark,d.material.side=_e,this.head.add(d);const g=new tt(new Ze(1.1,1.6),new kt({color:857634,side:_e,roughness:.9,metalness:.1}));g.position.set(0,1.45,-.38),g.rotation.x=.1,this.model.add(g)}this.arms=[];for(const d of[-1,1]){const g=new re;g.position.set(d*.63,1.82,0),this.model.add(g),this.arms.push(g);const S=new tt(new Pt(.22,.58,.22),i);S.position.y=-.28,S.castShadow=!0,g.add(S);const m=new re;m.position.y=-.58,g.add(m);const f=new tt(new Pt(.2,.52,.2),e);if(f.position.y=-.25,f.castShadow=!0,m.add(f),d===1){this.arm=g,this.forearm=m,this.blaster=new re,this.blaster.position.set(.02,-.48,.04),m.add(this.blaster);const y=new tt(new Ie(.09,.12,.62,10),this.mats.dark);y.rotation.x=Math.PI/2,y.position.z=.18,this.blaster.add(y);const A=new tt(new zn(.1,.025,6,12),n);A.position.z=.5,this.blaster.add(A);const M=new Si(new si({map:this.game.textures.glow,color:this.type.trim,transparent:!0,opacity:.7,blending:oe,depthWrite:!1}));M.position.z=.54,M.scale.setScalar(.36),this.blaster.add(M),this.muzzleGlow=M,this.muzzleObject=new ye,this.muzzleObject.position.set(0,0,.58),this.blaster.add(this.muzzleObject)}else this.leftForearm=m}this.legs=[];for(const d of[-1,1]){const g=new re;g.position.set(d*.24,.95,0),this.model.add(g);const S=new tt(new Pt(.28,.62,.3),e);S.position.y=-.3,S.castShadow=!0,g.add(S);const m=new tt(new Pt(.24,.58,.26),i);m.position.set(0,-.82,.02),m.castShadow=!0,g.add(m);const f=new tt(new Pt(.3,.2,.46),i);f.position.set(0,-1.14,.08),f.castShadow=!0,g.add(f),this.legs.push(g)}const u=new tt(new Pt(.08,.7,.08),n);u.position.set(0,1.6,-.34),this.model.add(u),this.root.scale.setScalar(this.scale),this.model.traverse(d=>{d.isMesh&&(d.castShadow=!0)})}spawnEffect(){const t=this.pos.clone();this.game.effects.burst(t.clone().setY(1),this.type.trim,26,5.5,{size:.28,life:.8,up:2}),this.game.effects.flashLight(t.clone().setY(1.4),this.type.trim,8,.5,12),this.game.effects.ring(t,this.type.trim);const e=new tt(new Ie(.42,.9,14,12,1,!0),new Ee({color:this.type.trim,transparent:!0,opacity:.4,blending:oe,depthWrite:!1,side:_e,toneMapped:!1}));e.position.copy(t).setY(7),this.game.scene.add(e),this.game.effects.transients.push({object:e,life:.55,max:.55,type:"beam"})}setState(t){this.state=t}update(t,e){if(!this.alive){this.updateDeath(t);return}if(this.invuln=Math.max(0,this.invuln-t),this.hitFlash=Math.max(0,this.hitFlash-t*4),this.fireTimer-=t,this.losTimer-=t,this.strafeTimer-=t,this.strafeTimer<=0&&(this.strafeTimer=xt(1.2,2.8),this.strafeDir*=-1),this.state==="spawning"){this.spawnTimer-=t;const d=De(1-this.spawnTimer/.75,0,1),g=(.25+d*.75)*this.scale;this.root.scale.setScalar(g),this.model.position.y=(1-d)*-.5+Math.sin(d*Math.PI)*.3,this.muzzleGlow.material.opacity=.2+d*.5,this.spawnTimer<=0&&(this.state="chase",this.root.scale.setScalar(this.scale),this.model.position.y=0);return}if(this.state==="ambient"){this.updateAmbient(t);return}const i=this.game.player;if(!i||!i.alive){this.idle(t);return}sc.set(i.pos.x-this.pos.x,i.pos.y+1.2-(this.pos.y+1.6),i.pos.z-this.pos.z);const n=Math.hypot(i.pos.x-this.pos.x,i.pos.z-this.pos.z);this.targetYaw=Math.atan2(i.pos.x-this.pos.x,i.pos.z-this.pos.z);const r=$l(this.root.rotation.y,this.targetYaw);if(this.root.rotation.y+=r*Math.min(1,t*7),this.losTimer<=0){this.losTimer=xt(.16,.32);const d=Ks.set(this.pos.x,this.pos.y+1.9*this.scale,this.pos.z);$s.set(i.pos.x,i.pos.y+1.1,i.pos.z),this.hasLos=this.game.arena.hasLineOfSight(d,$s)}const a=this.game.arena.inHazard(this.pos.x,this.pos.z);let o=0,l=0,c=this.type.speed,h=!1;if(a){if(o=-this.pos.x,l=-this.pos.z,c=5.5,this.hazardTimer-=t,this.hazardTimer<=0&&(this.hazardTimer=.5,this.health-=6,this.game.effects.burst(this.pos.clone().setY(.6),16734754,6,2.4,{size:.18,life:.4,up:2}),this.health<=0)){this.die("LAVA",!1,sc.clone().normalize());return}}else if(this.hasLos&&n<this.type.range){const d=this.type.preferred;n>d+2.5?(o=i.pos.x-this.pos.x,l=i.pos.z-this.pos.z):n<d-3.5?(o=this.pos.x-i.pos.x,l=this.pos.z-i.pos.z):(o=(i.pos.z-this.pos.z)*this.strafeDir*.9,l=-(i.pos.x-this.pos.x)*this.strafeDir*.9),h=!0}else this.resolveNavigation(i,d=>{o=d.x,l=d.z});if(this.game.arena.inHazard(this.pos.x+o*.6,this.pos.z+l*.6)){const d=o;o=-l,l=d}for(const d of this.game.enemies.list){if(d===this||!d.alive)continue;const g=this.pos.x-d.pos.x,S=this.pos.z-d.pos.z,m=g*g+S*S;if(m>.001&&m<5){const f=Math.sqrt(m);o+=g/f*1.6,l+=S/f*1.6}}const p=Math.hypot(o,l);p>.001?(o/=p,l/=p,this.moving=Le(this.moving,1,8,t),this.moveWithCollision(o*c*t,l*c*t)):this.moving=Le(this.moving,0,8,t);const u=this.game.arena.groundHeightAt(this.pos.x,this.pos.z,this.pos.y+.5);this.pos.y=Le(this.pos.y,u,16,t),this.root.position.copy(this.pos),this.animate(t,h),h&&this.fireTimer<=0&&this.hasLos&&n<this.type.range&&this.fire(i)}resolveNavigation(t,e){const i=t.pos.y>1.5&&Math.abs(t.pos.x)<16&&Math.abs(t.pos.z)<16,n=this.pos.y>1.5&&Math.abs(this.pos.x)<17&&Math.abs(this.pos.z)<17;if(i&&!n){const r=[{x:0,z:28},{x:0,z:-28},{x:28,z:0},{x:-28,z:0}];let a=r[0],o=1/0;for(const c of r){const h=(c.x-this.pos.x)**2+(c.z-this.pos.z)**2;h<o&&(o=h,a=c)}Math.hypot(a.x-this.pos.x,a.z-this.pos.z)>3.2?e({x:a.x-this.pos.x,z:a.z-this.pos.z}):e({x:-a.x,z:-a.z});return}if(!i&&n){const r=[{x:0,z:26},{x:0,z:-26},{x:26,z:0},{x:-26,z:0}];let a=r[0],o=1/0;for(const l of r){const c=(l.x-this.pos.x)**2+(l.z-this.pos.z)**2;c<o&&(o=c,a=l)}e({x:a.x-this.pos.x,z:a.z-this.pos.z});return}e({x:t.pos.x-this.pos.x,z:t.pos.z-this.pos.z})}idle(t){this.moving=Le(this.moving,0,5,t),this.animate(t,!1),this.root.position.copy(this.pos)}updateAmbient(t){this.walkPhase+=t*1.6,this.moving=Le(this.moving,.45,2,t),this.model.position.y=Math.abs(Math.sin(this.walkPhase))*.025;const e=Math.sin(this.walkPhase*.3)*.4;this.root.rotation.y=e,this.animate(t,!1)}animate(t,e){const i=this.walkPhase,n=Math.sin(i)*.55*this.moving,r=Math.sin(i+Math.PI)*.55*this.moving;this.legs[0].rotation.x=n,this.legs[1].rotation.x=r,this.arms[0].rotation.x=e?-.55:n*.55,this.arm.rotation.x=e?-1.12:r*.55,this.arm.rotation.z=e?.05:-.06,this.leftForearm&&(this.leftForearm.rotation.x=e?-.75:0),this.model.position.y=Math.abs(Math.sin(i*2))*.035*this.moving,this.root.position.copy(this.pos);const a=1.8+Math.sin(this.game.elapsed*3.2+this.id)*.6;this.muzzleGlow&&this.muzzleGlow.scale.setScalar(.28+Math.sin(this.game.elapsed*5+this.id)*.08);const o=this.hitFlash;for(const l of this.baseEmissive)l.mat.emissiveIntensity=l.value+o*5;this.mats.trim.emissiveIntensity=a+o*7,this.aimYaw&&(this.head.rotation.y=Le(this.head.rotation.y,De($l(this.root.rotation.y,this.targetYaw),-.4,.4),6,t))}updateDeath(t){this.deadTimer-=t,this.model.position.y=Math.max(-1.4,this.model.position.y-t*1.1),this.root.rotation.z=Le(this.root.rotation.z,1.35,3,t),this.root.rotation.y+=t*.6,this.root.scale.multiplyScalar(Math.max(0,1-t*.12)),this.deadTimer<=0&&this.remove()}moveWithCollision(t,e){this.pos.x+=t,this.collideAxis("x",t),this.pos.z+=e,this.collideAxis("z",e),this.walkPhase+=Math.hypot(t,e)*6.5}collideAxis(t,e){const i=this.type.radius,n=this.pos.y,r=n+1.8*this.scale;for(const a of this.game.arena.solids)r<=a.minY+.02||n>=a.maxY-.04||this.pos.x+i>a.minX&&this.pos.x-i<a.maxX&&this.pos.z+i>a.minZ&&this.pos.z-i<a.maxZ&&(t==="x"?e>0?this.pos.x=a.minX-i:this.pos.x=a.maxX+i:e>0?this.pos.z=a.minZ-i:this.pos.z=a.maxZ+i)}fire(t){const e=this.type;this.fireTimer=xt(e.fireDelay[0],e.fireDelay[1]),this.muzzleObject.getWorldPosition(Ks),this.game.camera.updateMatrixWorld(),this.game.scene.updateMatrixWorld();const i=e.projSpeed,n=De(Math.hypot(t.pos.x-this.pos.x,t.pos.z-this.pos.z)/i,0,.55);$s.set(t.pos.x+t.vel.x*n*.55,t.pos.y+1.05+t.vel.y*n*.2,t.pos.z+t.vel.z*n*.55),Dn.subVectors($s,Ks).normalize(),Dn.x+=xt(-.035,.035),Dn.y+=xt(-.025,.03),Dn.z+=xt(-.035,.035),Dn.normalize(),this.game.enemies.spawnProjectile(Ks.clone(),Dn.clone().multiplyScalar(i),e,this),this.game.audio.enemyShoot(this.typeName),this.muzzleGlow&&(this.muzzleGlow.material.opacity=1,this.muzzleGlow.scale.setScalar(.8),setTimeout(()=>{this.muzzleGlow&&this.muzzleGlow.scale.setScalar(.3)},80))}takeDamage(t,e,i="SHOTGUN",n=!1,r=null){if(!(!this.alive||this.invuln>0)){if(this.health-=t,this.hitFlash=1,this.game.audio.enemyHit(),r){const a=.18*(n?1.3:1);this.pos.x+=r.x*a,this.pos.z+=r.z*a}this.game.effects.burst(e,this.typeName==="wraith"?6090495:9380880,n?10:6,3,{size:.16,life:.4,gravity:-10}),this.health<=0&&this.die(i,n,r)}}die(t,e,i){if(!this.alive)return;this.alive=!1,this.deadTimer=2.3,this.state="dead",this.root.rotation.z=0,this.health=0,this.game.audio.enemyDeath();const n=this.pos.clone().setY(this.pos.y+1.1);this.game.effects.burst(n,this.type.trim,34,8,{size:.34,life:.9,up:1.6}),this.game.effects.burst(n,9380880,22,5,{size:.3,life:.8,up:1.2}),this.game.effects.gibs(n,this.type.body,this.typeName==="brute"?14:9),this.game.effects.flashLight(n,this.type.trim,7,.35,12),this.game.enemies.onKill(this,t,e)}remove(){this.game.scene.remove(this.root),this.model.traverse(t=>{t.geometry&&t.geometry.dispose()});for(const t of Object.keys(this.mats))this.mats[t].dispose()}}class Y0{constructor(t,e,i,n,r){this.game=t,this.vel=i,this.owner=r,this.life=4,this.damage=n.damage,this.color=n.trim,this.removeMe=!1,this.mesh=new re,this.mesh.position.copy(e);const a=new tt(new ps(.15,10,8),new Ee({color:n.trim,toneMapped:!1}));this.mesh.add(a);const o=new Si(new si({map:t.textures.glow,color:n.trim,transparent:!0,opacity:.9,blending:oe,depthWrite:!1}));o.scale.setScalar(.9),this.mesh.add(o),this.light=new kn(n.trim,1.6,5,2),this.mesh.add(this.light),t.scene.add(this.mesh)}update(t){if(this.removeMe)return;this.life-=t;const e=this.mesh.position.clone();this.mesh.position.addScaledVector(this.vel,t),this.mesh.scale.setScalar(1+Math.sin(this.life*28)*.08);const i=this.game.player;if(i.alive){const o=this.mesh.position.x-i.pos.x,l=this.mesh.position.y-(i.pos.y+1),c=this.mesh.position.z-i.pos.z;if(o*o+l*l+c*c<.62){const h=this.vel.clone().normalize().multiplyScalar(1.6);i.takeDamage(this.damage,this.mesh.position,{knockback:h}),this.game.effects.burst(this.mesh.position,this.color,14,4.5,{size:.2,life:.45}),this.destroy();return}}const n=this.vel.clone().normalize(),r=this.vel.length()*t,a=this.game.arena.raycast(e,n,r+.2);if(a){this.game.effects.impact(a.point,a.face?.normal??n.clone().negate(),this.color),this.destroy();return}(this.mesh.position.y<.12||this.life<=0)&&(this.game.effects.burst(this.mesh.position,this.color,8,2.5,{size:.16,life:.3}),this.destroy())}destroy(){this.removeMe=!0,this.game.scene.remove(this.mesh),this.mesh.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()})}}class Z0{constructor(t){this.game=t,this.list=[],this.projectiles=[]}spawn(t,e,i=!1){const n=new q0(this.game,t,e,i);return this.list.push(n),n}spawnWave(t,e){const i=this.game.arena.spawnPoints;for(let n=0;n<t;n+=1){const r=i[(n+Math.floor(Math.random()*i.length))%i.length],a=new R(xt(-3.5,3.5),0,xt(-3.5,3.5));let o="grunt";e>=5&&Math.random()<.22?o="brute":e>=3&&Math.random()<.4&&(o="wraith");const l=r.clone().add(a);Math.hypot(l.x-this.game.player.pos.x,l.z-this.game.player.pos.z)<12&&l.multiplyScalar(-1),this.spawn(o,l)}}spawnAmbient(){const t=[new R(-8,2.2,-5),new R(7,2.2,4),new R(-28,0,12),new R(25,0,-20)],e=["grunt","wraith","brute"];for(let i=0;i<t.length;i+=1)this.spawn(e[i%e.length],t[i],!0)}update(t,e){for(let i=this.list.length-1;i>=0;i-=1){const n=this.list[i];n.update(t,e),n.state==="dead"&&n.deadTimer<=0&&this.list.splice(i,1)}for(let i=this.projectiles.length-1;i>=0;i-=1){const n=this.projectiles[i];n.update(t),n.removeMe&&this.projectiles.splice(i,1)}}spawnProjectile(t,e,i,n){this.projectiles.push(new Y0(this.game,t,e,i,n))}rayHits(t,e,i){Zs.origin.copy(t),Zs.direction.copy(e);const n=[];for(const r of this.list){if(!r.alive)continue;const a=r.scale,o=r.pos.x,l=r.pos.z,c=r.pos.y;ca.center.set(o,c+2.2*a,l),ca.radius=.3*a+.06;const h=Zs.intersectSphere(ca,nc);if(h){const u=h.distanceTo(t);if(u<=i){n.push({enemy:r,distance:u,head:!0,point:h.clone()});continue}}ha.min.set(o-.5*a,c+.15*a,l-.45*a),ha.max.set(o+.5*a,c+1.95*a,l+.45*a);const p=Zs.intersectBox(ha,nc);if(p){const u=p.distanceTo(t);u<=i&&n.push({enemy:r,distance:u,head:!1,point:p.clone()})}}return n.sort((r,a)=>r.distance-a.distance),n}damageRadius(t,e,i,n,r=.1){for(const a of this.list){if(!a.alive)continue;const o=a.pos.x-t.x,l=a.pos.y+1.1-t.y,c=a.pos.z-t.z,h=Math.sqrt(o*o+l*l+c*c);if(h<e){const p=Math.max(r,1-h/e),u=new R(o,l+.35,c).normalize();a.pos.addScaledVector(u,.45*p),a.takeDamage(i*p,new R(a.pos.x,a.pos.y+1.1,a.pos.z),n,!1,u)}}}onKill(t,e,i){this.game.onEnemyKilled(t,e,i)}clear(){for(const t of this.list){this.game.scene.remove(t.root),t.model.traverse(e=>{e.geometry&&e.geometry.dispose()});for(const e of Object.keys(t.mats))t.mats[e].dispose()}this.list.length=0;for(const t of this.projectiles)this.game.scene.remove(t.mesh);this.projectiles.length=0}get aliveCount(){return this.list.filter(t=>t.alive).length}}class K0{constructor(t){this.game=t,this.el={hud:document.getElementById("hud"),health:document.getElementById("health"),armor:document.getElementById("armor"),ammo:document.getElementById("ammo"),ammoType:document.getElementById("ammoType"),ammoReserve:document.getElementById("ammoReserve"),weaponName:document.getElementById("weaponName"),weaponSlot:document.getElementById("weaponSlot"),weaponList:document.getElementById("weaponList"),score:document.getElementById("score"),waveLabel:document.getElementById("waveLabel"),enemiesLeft:document.getElementById("enemiesLeft"),enemyBar:document.getElementById("enemyBar"),killfeed:document.getElementById("killfeed"),crosshair:document.getElementById("crosshair"),hitmarker:document.getElementById("hitmarker"),damageFlash:document.getElementById("damageFlash"),pickupFlash:document.getElementById("pickupFlash"),waveBanner:document.getElementById("waveBanner"),bannerKicker:document.getElementById("bannerKicker"),bannerTitle:document.getElementById("bannerTitle"),bannerSub:document.getElementById("bannerSub"),toast:document.getElementById("toast"),vitalHealth:document.getElementById("health")?.closest(".vital"),vitalArmor:document.getElementById("armor")?.closest(".vital"),menu:document.getElementById("menu"),pause:document.getElementById("pause"),death:document.getElementById("death"),loading:document.getElementById("loading"),loadBar:document.getElementById("loadBar"),loadText:document.getElementById("loadText"),deathWave:document.getElementById("deathWave"),deathScore:document.getElementById("deathScore"),deathKills:document.getElementById("deathKills"),deathQuote:document.getElementById("deathQuote"),bestScore:document.getElementById("bestScore")},this.slots=[...document.querySelectorAll(".wslot")],this.last={},this.toastTimer=null,this.bannerTimer=null,this.hitTimer=null,this.damageTimer=null,this.best=0;try{this.best=Number(localStorage.getItem("quake-arena-best")||0)}catch{this.best=0}this.setBest(this.best)}setBest(t){this.best=Math.max(this.best,t),this.el.bestScore&&(this.el.bestScore.textContent=sa(this.best))}setText(t,e){t&&this.last[t.id]!==e&&(this.last[t.id]=e,t.textContent=e)}update(){const t=this.game,e=t.player;if(!e)return;const i=Math.max(0,Math.ceil(e.health)),n=Math.max(0,Math.ceil(e.armor));this.setText(this.el.health,String(i)),this.setText(this.el.armor,String(n));const r=t.weapons.defs[e.weapon];this.setText(this.el.weaponName,r.name),this.setText(this.el.weaponSlot,r.slot),this.setText(this.el.ammoType,r.ammoLabel),this.setText(this.el.ammo,String(e.ammo[r.ammo])),this.setText(this.el.ammoReserve,`MAX ${e.ammoMax[r.ammo]}`),this.setText(this.el.score,sa(t.score)),this.setText(this.el.waveLabel,`WAVE ${String(t.wave).padStart(2,"0")}`);const a=t.enemies.aliveCount+t.pendingSpawns;this.setText(this.el.enemiesLeft,String(a));const o=Math.max(1,t.waveTotal),l=De(a/o,0,1);this.el.enemyBar.style.width=`${l*100}%`,this.slots.forEach((p,u)=>{p.classList.toggle("active",u===e.weapon)}),this.el.vitalHealth&&this.el.vitalHealth.classList.toggle("low",i<=30),this.el.vitalArmor&&this.el.vitalArmor.classList.toggle("low",n>0&&n<=25);const c=e.speed||0,h=De(7+c*.5+(e.onGround?0:5),6,22);this.el.crosshair.style.setProperty("--gap",`${h.toFixed(1)}px`),document.body.classList.toggle("low-health",i<=30&&e.alive)}killFeed(t,e,i){const n=document.createElement("div");for(n.className="kf",n.innerHTML=`<b>${t}</b><i>${i?"HEADSHOT":"ELIMINATED"}</i><span>${e}</span>`,this.el.killfeed.appendChild(n);this.el.killfeed.children.length>5;)this.el.killfeed.removeChild(this.el.killfeed.firstChild);setTimeout(()=>{n.classList.add("out"),setTimeout(()=>n.remove(),420)},3600)}waveBanner(t,e,i,n=2400){this.el.bannerKicker.textContent=t,this.el.bannerTitle.textContent=e,this.el.bannerSub.textContent=i,this.el.waveBanner.classList.add("show"),clearTimeout(this.bannerTimer),this.bannerTimer=setTimeout(()=>{this.el.waveBanner.classList.remove("show")},n)}toast(t,e=1700){this.el.toast&&(this.el.toast.textContent=t,this.el.toast.classList.add("show"),clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.el.toast.classList.remove("show")},e))}hitmarker(t=!1){this.el.hitmarker.classList.add("show"),this.el.hitmarker.style.filter=t?"drop-shadow(0 0 8px #ffcf4a)":"",clearTimeout(this.hitTimer),this.hitTimer=setTimeout(()=>this.el.hitmarker.classList.remove("show"),130)}damageFlash(t=.5,e=null){this.el.damageFlash&&(this.el.damageFlash.style.opacity=String(De(t,.1,1)),clearTimeout(this.damageTimer),this.damageTimer=setTimeout(()=>{this.el.damageFlash.style.opacity="0"},140))}pickupFlash(){this.el.pickupFlash&&(this.el.pickupFlash.style.opacity="1",clearTimeout(this.pickupTimer),this.pickupTimer=setTimeout(()=>{this.el.pickupFlash.style.opacity="0"},220))}showHud(t){this.el.hud.classList.toggle("hidden",!t)}showMenu(t){this.el.menu.classList.toggle("hidden",!t)}showPause(t){this.el.pause.classList.toggle("hidden",!t)}showDeath(t){this.el.death.classList.toggle("hidden",!t)}showLoading(t,e=100,i="FORGING THE SLAYGROUND…"){this.el.loading&&(this.el.loadBar&&(this.el.loadBar.style.width=`${e}%`),this.el.loadText&&(this.el.loadText.textContent=i),t?this.el.loading.classList.remove("hidden","done"):(this.el.loading.classList.add("done"),setTimeout(()=>this.el.loading.classList.add("hidden"),800)))}showDeathStats(t,e,i){this.el.deathWave.textContent=String(t),this.el.deathScore.textContent=sa(e),this.el.deathKills.textContent=String(i);const n=['"THE ARENA ALWAYS WINS."','"YOU WERE ALMOST LEGEND."','"THE HORDE REMEMBERS."','"ANOTHER NAME FOR THE WALL."','"RELOAD. RE-ENTER. REPEAT."'];this.el.deathQuote.textContent=n[Math.floor(Math.random()*n.length)]}}class $0{constructor(){this.state="loading",this.elapsed=0,this.score=0,this.kills=0,this.wave=0,this.waveTotal=0,this.pendingSpawns=0,this.waveState="intermission",this.waveTimer=0,this.spawnTimer=0,this.waveClearTimer=0,this.deathTimer=0,this.deathShown=!1,this.startedWithLock=!1,this.attractAngle=.6,this.app=document.getElementById("app"),this.setupRenderer(),this.textures=L0(this.renderer),this.audio=new D0,this.hud=new K0(this),this.effects=new N0(this),this.arena=new F0(this),this.player=new z0(this),this.weapons=new V0(this),this.enemies=new Z0(this),this.hud.showLoading(!0,70,"LIGHTING THE FORGE…"),this.arena.emblem.material.opacity=.9,this.lastTime=performance.now(),this.bindUi(),this.enemies.spawnAmbient(),this.weapons.viewRoot.visible=!1,this.camera.position.set(31,10.5,24),this.camera.lookAt(0,3,0),requestAnimationFrame(()=>{this.hud.showLoading(!1),this.state="menu",this.hud.setBest(this.hud.best)}),window.__QUAKE__=this,window.addEventListener("resize",()=>this.onResize()),window.addEventListener("keydown",t=>{t.code==="Escape"&&(this.state==="playing"?this.pause():this.state==="paused"&&this.resume())}),this.animate=this.animate.bind(this),requestAnimationFrame(this.animate)}setupRenderer(){this.renderer=new d0({antialias:!0,powerPreference:"high-performance",alpha:!1}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.55)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=as,this.renderer.toneMapping=dr,this.renderer.toneMappingExposure=1.18,this.renderer.outputColorSpace=we,this.app.appendChild(this.renderer.domElement),this.scene=new Hh,this.camera=new Qe(80,window.innerWidth/window.innerHeight,.05,450),this.scene.add(this.camera),this.composer=new x0(this.renderer),this.renderPass=new v0(this.scene,this.camera),this.composer.addPass(this.renderPass),this.bloom=new Gn(new wt(window.innerWidth,window.innerHeight),.26,.35,1.35),this.composer.addPass(this.bloom),this.composer.addPass(new S0),this.composer.setSize(window.innerWidth,window.innerHeight)}bindUi(){const t=(e,i)=>{const n=document.getElementById(e);n&&n.addEventListener("click",()=>{this.audio.unlock(),i()})};t("startBtn",()=>this.startGame(!0)),t("resumeBtn",()=>this.resume()),t("quitBtn",()=>this.returnToMenu()),t("retryBtn",()=>this.startGame(!0)),t("menuBtn",()=>this.returnToMenu())}startGame(t=!1){if(this.audio.unlock(),this.state="playing",this.startedWithLock=t,this.elapsed=0,this.score=0,this.kills=0,this.wave=0,this.waveTotal=0,this.pendingSpawns=0,this.waveState="intermission",this.waveTimer=1.5,this.spawnTimer=0,this.deathTimer=0,this.deathShown=!1,this.attractAngle=.6,this.enemies.clear(),this.effects.clear(),this.arena.pickups.reset(),this.player.reset(),this.weapons.reset(),this.player.weapon=0,this.weapons.setWeapon(0),this.weapons.models[0].group.visible=!0,this.weapons.viewRoot.visible=!0,this.hud.showMenu(!1),this.hud.showPause(!1),this.hud.showDeath(!1),this.hud.showHud(!0),this.hud.update(),this.hud.waveBanner("INCOMING","SURVIVE","THE GATES ARE OPEN",1500),t){const e=this.renderer.domElement;if(e.requestPointerLock){const i=e.requestPointerLock();i&&i.catch&&i.catch(()=>{})}}}pause(){this.state==="playing"&&(this.state="paused",this.player.mouseHeld=!1,this.player.mouseDown=!1,this.hud.showPause(!0),document.pointerLockElement&&document.exitPointerLock())}resume(){if(this.state!=="paused")return;this.state="playing",this.hud.showPause(!1);const t=this.renderer.domElement;if(t.requestPointerLock){const e=t.requestPointerLock();e&&e.catch&&e.catch(()=>{})}}returnToMenu(){this.state="menu",this.startedWithLock=!1,this.player.mouseHeld=!1,this.player.mouseDown=!1,this.player.alive=!0,this.weapons.viewRoot.visible=!1,this.enemies.clear(),this.effects.clear(),this.arena.pickups.reset(),this.player.reset(),this.player.alive=!0,this.player.pos.set(0,0,40),this.enemies.spawnAmbient(),this.hud.showMenu(!0),this.hud.showPause(!1),this.hud.showDeath(!1),this.hud.showHud(!1),this.hud.setBest(this.score),document.pointerLockElement&&document.exitPointerLock(),document.body.classList.remove("low-health"),this.wave=0,this.score=0,this.kills=0}startWave(){this.wave+=1,this.waveTotal=Math.min(4+(this.wave-1)*2,16),this.pendingSpawns=this.waveTotal,this.waveState="spawning",this.spawnTimer=.85,this.hud.waveBanner("INCOMING",`WAVE ${String(this.wave).padStart(2,"0")}`,this.wave>=5?"BRUTES AND WRAITHS DETECTED":this.wave>=3?"WRAITHS DETECTED":"THEY ARE COMING FOR YOU",2300),this.audio.wave(),this.hud.update()}updateWaves(t){if(this.state==="playing"){if(this.waveState==="intermission"){this.waveTimer-=t,this.waveTimer<=0&&this.startWave();return}if(this.waveState==="spawning"||this.waveState==="active"){if(this.pendingSpawns>0&&(this.spawnTimer-=t,this.spawnTimer<=0&&(this.spawnTimer=this.wave>=6?.38:.58,this.enemies.spawnWave(1,this.wave),this.pendingSpawns-=1,this.pendingSpawns===0&&(this.waveState="active"))),this.pendingSpawns===0&&this.enemies.aliveCount===0){this.waveState="cleared",this.waveTimer=4.2;const e=200*this.wave;this.score+=e,this.player.heal(12),this.hud.waveBanner("AREA CLEARED",`WAVE ${String(this.wave).padStart(2,"0")} COMPLETE`,`+${e} BONUS · PATCHING ARMOR`,3e3),this.hud.toast(`+${e} WAVE BONUS`),this.audio.pickup("health"),this.hud.update()}return}this.waveState==="cleared"&&(this.waveTimer-=t,this.waveTimer<=0&&(this.waveState="intermission",this.waveTimer=1.2))}}onEnemyKilled(t,e,i){const n=Math.round(t.type.score*(i?2:1)*(1+this.wave*.04));if(this.score+=n,this.kills+=1,this.hud.killFeed(e,t.type.name,i),this.hud.update(),Math.random()<.34){const a=b0(["health","rockets","shells","slugs"]),o=this.arena.pickups.spawnDrop(a,t.pos.clone());o.baseY=Math.max(.15,o.mesh.position.y),this.effects.burst(o.mesh.position.clone().setY(.7),o.mesh.userData.color,10,2.4,{size:.18,life:.5,up:1.4})}}onPlayerDeath(){if(this.state==="playing"){this.state="dead",this.startedWithLock=!1,this.deathTimer=0,this.deathShown=!1,this.player.mouseHeld=!1,this.player.mouseDown=!1,document.pointerLockElement&&document.exitPointerLock(),this.deathCameraBase=this.camera.position.clone(),this.deathCameraRot=this.camera.rotation.z,this.hud.setBest(this.score);try{this.score>Number(localStorage.getItem("quake-arena-best")||0)&&localStorage.setItem("quake-arena-best",String(this.score))}catch{}}}debugFight(){this.startGame(!1),this.enemies.clear(),this.effects.clear(),this.score=0,this.kills=0,this.wave=3,this.waveTotal=6,this.pendingSpawns=0,this.waveState="active",this.player.pos.set(0,2.2,29),this.player.yaw=0,this.player.pitch=-.03,this.player.health=84,this.player.armor=50,this.player.ammo={rockets:17,shells:9,slugs:6},this.player.alive=!0,this.player.onGround=!0,this.weapons.viewRoot.visible=!0,this.enemies.spawn("brute",new R(-6,2.2,4)),this.enemies.spawn("grunt",new R(6,2.2,2)),this.enemies.spawn("wraith",new R(-11,2.2,-2)),this.enemies.spawn("grunt",new R(11,2.2,-4)),this.enemies.list.forEach(t=>{t.invuln=0,t.state="chase",t.root.scale.setScalar(t.scale)}),this.hud.showMenu(!1),this.hud.showHud(!0),this.hud.waveBanner("INCOMING","WAVE 03","THEY ARE COMING FOR YOU",2e3),this.hud.update(),this.player.updateCamera(.016),this.camera.updateMatrixWorld()}addShake(t,e=.25){this.player&&this.player.addShake(t,e)}onResize(){const t=window.innerWidth,e=window.innerHeight;this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,e),this.composer.setSize(t,e),this.bloom.setSize(t,e)}updateMenu(t){this.elapsed+=t,this.attractAngle+=t*.055;const e=33+Math.sin(this.attractAngle*1.7)*2.5,i=10.5+Math.sin(this.attractAngle*2.3)*1.4;this.camera.position.set(Math.cos(this.attractAngle)*e,i,Math.sin(this.attractAngle)*e),this.camera.lookAt(0,3.6,0),this.weapons.viewRoot.visible=!1,this.arena.update(t),this.enemies.update(t,"menu"),this.effects.update(t)}updatePlaying(t){this.elapsed+=t,this.player.update(t),this.player.alive&&(this.enemies.update(t,"playing"),this.arena.update(t),this.effects.update(t),this.updateWaves(t),this.hud.update())}updateDead(t){this.elapsed+=t,this.deathTimer+=t,this.arena.update(t),this.enemies.update(t,"dead"),this.effects.update(t),this.deathCameraBase&&(this.camera.position.y=Math.max(.6,this.deathCameraBase.y-this.deathTimer*.75),this.camera.rotation.z=this.deathCameraRot+this.deathTimer*.22),!this.deathShown&&this.deathTimer>.85&&(this.deathShown=!0,this.hud.showHud(!1),this.hud.showDeath(!0),this.hud.showDeathStats(this.wave,this.score,this.kills),this.hud.setBest(this.score))}animate(){requestAnimationFrame(this.animate);const t=performance.now(),e=Math.min(.05,(t-this.lastTime)/1e3);this.lastTime=t,this.state==="menu"?this.updateMenu(e):this.state==="playing"?this.updatePlaying(e):this.state==="dead"?this.updateDead(e):this.state==="paused"?this.elapsed+=e*.15:this.state==="loading"&&(this.elapsed+=e),this.state!=="paused"&&(this.gameplayTime=(this.gameplayTime||0)+e),this.composer.render()}}new $0;
