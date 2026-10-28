(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Oa="170",Lh=0,uo=1,Dh=2,Dl=1,Il=2,Sn=3,Gn=0,Ie=1,ve=2,Tn=0,ii=1,fe=2,fo=3,po=4,Ih=5,ti=100,Uh=101,Nh=102,Fh=103,Oh=104,zh=200,Bh=201,kh=202,Hh=203,qr=204,Yr=205,Gh=206,Vh=207,Wh=208,Xh=209,qh=210,Yh=211,Kh=212,$h=213,Zh=214,Kr=0,$r=1,Zr=2,Ci=3,jr=4,Jr=5,Qr=6,ta=7,Ul=0,jh=1,Jh=2,Hn=0,Nl=1,Fl=2,Ol=3,za=4,Qh=5,zl=6,Bl=7,kl=300,Pi=301,Li=302,ea=303,na=304,sr=306,Zs=1e3,He=1001,ia=1002,on=1003,tc=1004,ms=1005,fn=1006,cr=1007,ni=1008,Pn=1009,Hl=1010,Gl=1011,ls=1012,Ba=1013,si=1014,wn=1015,An=1016,ka=1017,Ha=1018,Di=1020,Vl=35902,Wl=1021,Xl=1022,rn=1023,ql=1024,Yl=1025,Ai=1026,Ii=1027,Kl=1028,Ga=1029,$l=1030,Va=1031,Wa=1033,Ws=33776,Xs=33777,qs=33778,Ys=33779,sa=35840,ra=35841,aa=35842,oa=35843,la=36196,ha=37492,ca=37496,ua=37808,da=37809,fa=37810,pa=37811,ma=37812,ga=37813,va=37814,_a=37815,xa=37816,Ma=37817,ya=37818,Sa=37819,wa=37820,Ea=37821,Ks=36492,ba=36494,Ta=36495,Zl=36283,Aa=36284,Ra=36285,Ca=36286,ec=3200,nc=3201,jl=0,ic=1,kn="",Fe="srgb",zi="srgb-linear",rr="linear",ne="srgb",ai=7680,mo=519,sc=512,rc=513,ac=514,Jl=515,oc=516,lc=517,hc=518,cc=519,Pa=35044,go="300 es",En=2e3,js=2001;class Bi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}}const Pe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let vo=1234567;const ss=Math.PI/180,Ui=180/Math.PI;function Rn(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Pe[s&255]+Pe[s>>8&255]+Pe[s>>16&255]+Pe[s>>24&255]+"-"+Pe[t&255]+Pe[t>>8&255]+"-"+Pe[t>>16&15|64]+Pe[t>>24&255]+"-"+Pe[e&63|128]+Pe[e>>8&255]+"-"+Pe[e>>16&255]+Pe[e>>24&255]+Pe[n&255]+Pe[n>>8&255]+Pe[n>>16&255]+Pe[n>>24&255]).toLowerCase()}function Se(s,t,e){return Math.max(t,Math.min(e,s))}function Xa(s,t){return(s%t+t)%t}function uc(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function dc(s,t,e){return s!==t?(e-s)/(t-s):0}function rs(s,t,e){return(1-e)*s+e*t}function fc(s,t,e,n){return rs(s,t,1-Math.exp(-e*n))}function pc(s,t=1){return t-Math.abs(Xa(s,t*2)-t)}function mc(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function gc(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function vc(s,t){return s+Math.floor(Math.random()*(t-s+1))}function _c(s,t){return s+Math.random()*(t-s)}function xc(s){return s*(.5-Math.random())}function Mc(s){s!==void 0&&(vo=s);let t=vo+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function yc(s){return s*ss}function Sc(s){return s*Ui}function wc(s){return(s&s-1)===0&&s!==0}function Ec(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function bc(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Tc(s,t,e,n,i){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),h=r((t+n)/2),c=o((t+n)/2),u=r((t-n)/2),f=o((t-n)/2),d=r((n-t)/2),g=o((n-t)/2);switch(i){case"XYX":s.set(a*c,l*u,l*f,a*h);break;case"YZY":s.set(l*f,a*c,l*u,a*h);break;case"ZXZ":s.set(l*u,l*f,a*c,a*h);break;case"XZX":s.set(a*c,l*g,l*d,a*h);break;case"YXY":s.set(l*d,a*c,l*g,a*h);break;case"ZYZ":s.set(l*g,l*d,a*c,a*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function sn(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function ie(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Nt={DEG2RAD:ss,RAD2DEG:Ui,generateUUID:Rn,clamp:Se,euclideanModulo:Xa,mapLinear:uc,inverseLerp:dc,lerp:rs,damp:fc,pingpong:pc,smoothstep:mc,smootherstep:gc,randInt:vc,randFloat:_c,randFloatSpread:xc,seededRandom:Mc,degToRad:yc,radToDeg:Sc,isPowerOfTwo:wc,ceilPowerOfTwo:Ec,floorPowerOfTwo:bc,setQuaternionFromProperEuler:Tc,normalize:ie,denormalize:sn};class nt{constructor(t=0,e=0){nt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Se(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class zt{constructor(t,e,n,i,r,o,a,l,h){zt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,h)}set(t,e,n,i,r,o,a,l,h){const c=this.elements;return c[0]=t,c[1]=i,c[2]=a,c[3]=e,c[4]=r,c[5]=l,c[6]=n,c[7]=o,c[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],h=n[1],c=n[4],u=n[7],f=n[2],d=n[5],g=n[8],v=i[0],m=i[3],p=i[6],S=i[1],T=i[4],y=i[7],F=i[2],A=i[5],R=i[8];return r[0]=o*v+a*S+l*F,r[3]=o*m+a*T+l*A,r[6]=o*p+a*y+l*R,r[1]=h*v+c*S+u*F,r[4]=h*m+c*T+u*A,r[7]=h*p+c*y+u*R,r[2]=f*v+d*S+g*F,r[5]=f*m+d*T+g*A,r[8]=f*p+d*y+g*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],h=t[7],c=t[8];return e*o*c-e*a*h-n*r*c+n*a*l+i*r*h-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],h=t[7],c=t[8],u=c*o-a*h,f=a*l-c*r,d=h*r-o*l,g=e*u+n*f+i*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(i*h-c*n)*v,t[2]=(a*n-i*o)*v,t[3]=f*v,t[4]=(c*e-i*l)*v,t[5]=(i*r-a*e)*v,t[6]=d*v,t[7]=(n*l-h*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){const l=Math.cos(r),h=Math.sin(r);return this.set(n*l,n*h,-n*(l*o+h*a)+o+t,-i*h,i*l,-i*(-h*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(ur.makeScale(t,e)),this}rotate(t){return this.premultiply(ur.makeRotation(-t)),this}translate(t,e){return this.premultiply(ur.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ur=new zt;function Ql(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Js(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Ac(){const s=Js("canvas");return s.style.display="block",s}const _o={};function ns(s){s in _o||(_o[s]=!0,console.warn(s))}function Rc(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function Cc(s){const t=s.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Pc(s){const t=s.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const $t={enabled:!0,workingColorSpace:zi,spaces:{},convert:function(s,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ne&&(s.r=Cn(s.r),s.g=Cn(s.g),s.b=Cn(s.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(s.applyMatrix3(this.spaces[t].toXYZ),s.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ne&&(s.r=Ri(s.r),s.g=Ri(s.g),s.b=Ri(s.b))),s},fromWorkingColorSpace:function(s,t){return this.convert(s,this.workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===kn?rr:this.spaces[s].transfer},getLuminanceCoefficients:function(s,t=this.workingColorSpace){return s.fromArray(this.spaces[t].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,t,e){return s.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}};function Cn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ri(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}const xo=[.64,.33,.3,.6,.15,.06],Mo=[.2126,.7152,.0722],yo=[.3127,.329],So=new zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),wo=new zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);$t.define({[zi]:{primaries:xo,whitePoint:yo,transfer:rr,toXYZ:So,fromXYZ:wo,luminanceCoefficients:Mo,workingColorSpaceConfig:{unpackColorSpace:Fe},outputColorSpaceConfig:{drawingBufferColorSpace:Fe}},[Fe]:{primaries:xo,whitePoint:yo,transfer:ne,toXYZ:So,fromXYZ:wo,luminanceCoefficients:Mo,outputColorSpaceConfig:{drawingBufferColorSpace:Fe}}});let oi;class Lc{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{oi===void 0&&(oi=Js("canvas")),oi.width=t.width,oi.height=t.height;const n=oi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=oi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Js("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Cn(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Cn(e[n]/255)*255):e[n]=Cn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Dc=0;class th{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Dc++}),this.uuid=Rn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(dr(i[o].image)):r.push(dr(i[o]))}else r=dr(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function dr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Lc.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ic=0;class Oe extends Bi{constructor(t=Oe.DEFAULT_IMAGE,e=Oe.DEFAULT_MAPPING,n=He,i=He,r=fn,o=ni,a=rn,l=Pn,h=Oe.DEFAULT_ANISOTROPY,c=kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ic++}),this.uuid=Rn(),this.name="",this.source=new th(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=h,this.format=a,this.internalFormat=null,this.type=l,this.offset=new nt(0,0),this.repeat=new nt(1,1),this.center=new nt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==kl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Zs:t.x=t.x-Math.floor(t.x);break;case He:t.x=t.x<0?0:1;break;case ia:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Zs:t.y=t.y-Math.floor(t.y);break;case He:t.y=t.y<0?0:1;break;case ia:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Oe.DEFAULT_IMAGE=null;Oe.DEFAULT_MAPPING=kl;Oe.DEFAULT_ANISOTROPY=1;class se{constructor(t=0,e=0,n=0,i=1){se.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,h=l[0],c=l[4],u=l[8],f=l[1],d=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(c-f)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(c+f)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(h+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const T=(h+1)/2,y=(d+1)/2,F=(p+1)/2,A=(c+f)/4,R=(u+v)/4,D=(g+m)/4;return T>y&&T>F?T<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(T),i=A/n,r=R/n):y>F?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=A/i,r=D/i):F<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(F),n=R/r,i=D/r),this.set(n,i,r,e),this}let S=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(f-c)*(f-c));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(u-v)/S,this.z=(f-c)/S,this.w=Math.acos((h+d+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Uc extends Bi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new se(0,0,t,e),this.scissorTest=!1,this.viewport=new se(0,0,t,e);const i={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:fn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Oe(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new th(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ln extends Uc{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class eh extends Oe{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=on,this.minFilter=on,this.wrapR=He,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Nc extends Oe{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=on,this.minFilter=on,this.wrapR=He,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ki{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],h=n[i+1],c=n[i+2],u=n[i+3];const f=r[o+0],d=r[o+1],g=r[o+2],v=r[o+3];if(a===0){t[e+0]=l,t[e+1]=h,t[e+2]=c,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=d,t[e+2]=g,t[e+3]=v;return}if(u!==v||l!==f||h!==d||c!==g){let m=1-a;const p=l*f+h*d+c*g+u*v,S=p>=0?1:-1,T=1-p*p;if(T>Number.EPSILON){const F=Math.sqrt(T),A=Math.atan2(F,p*S);m=Math.sin(m*A)/F,a=Math.sin(a*A)/F}const y=a*S;if(l=l*m+f*y,h=h*m+d*y,c=c*m+g*y,u=u*m+v*y,m===1-a){const F=1/Math.sqrt(l*l+h*h+c*c+u*u);l*=F,h*=F,c*=F,u*=F}}t[e]=l,t[e+1]=h,t[e+2]=c,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,o){const a=n[i],l=n[i+1],h=n[i+2],c=n[i+3],u=r[o],f=r[o+1],d=r[o+2],g=r[o+3];return t[e]=a*g+c*u+l*d-h*f,t[e+1]=l*g+c*f+h*u-a*d,t[e+2]=h*g+c*d+a*f-l*u,t[e+3]=c*g-a*u-l*f-h*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,h=a(n/2),c=a(i/2),u=a(r/2),f=l(n/2),d=l(i/2),g=l(r/2);switch(o){case"XYZ":this._x=f*c*u+h*d*g,this._y=h*d*u-f*c*g,this._z=h*c*g+f*d*u,this._w=h*c*u-f*d*g;break;case"YXZ":this._x=f*c*u+h*d*g,this._y=h*d*u-f*c*g,this._z=h*c*g-f*d*u,this._w=h*c*u+f*d*g;break;case"ZXY":this._x=f*c*u-h*d*g,this._y=h*d*u+f*c*g,this._z=h*c*g+f*d*u,this._w=h*c*u-f*d*g;break;case"ZYX":this._x=f*c*u-h*d*g,this._y=h*d*u+f*c*g,this._z=h*c*g-f*d*u,this._w=h*c*u+f*d*g;break;case"YZX":this._x=f*c*u+h*d*g,this._y=h*d*u+f*c*g,this._z=h*c*g-f*d*u,this._w=h*c*u-f*d*g;break;case"XZY":this._x=f*c*u-h*d*g,this._y=h*d*u-f*c*g,this._z=h*c*g+f*d*u,this._w=h*c*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],h=e[2],c=e[6],u=e[10],f=n+a+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(c-l)*d,this._y=(r-h)*d,this._z=(o-i)*d}else if(n>a&&n>u){const d=2*Math.sqrt(1+n-a-u);this._w=(c-l)/d,this._x=.25*d,this._y=(i+o)/d,this._z=(r+h)/d}else if(a>u){const d=2*Math.sqrt(1+a-n-u);this._w=(r-h)/d,this._x=(i+o)/d,this._y=.25*d,this._z=(l+c)/d}else{const d=2*Math.sqrt(1+u-n-a);this._w=(o-i)/d,this._x=(r+h)/d,this._y=(l+c)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Se(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,h=e._z,c=e._w;return this._x=n*c+o*a+i*h-r*l,this._y=i*c+o*l+r*a-n*h,this._z=r*c+o*h+n*l-i*a,this._w=o*c-n*a-i*l-r*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const d=1-e;return this._w=d*o+e*this._w,this._x=d*n+e*this._x,this._y=d*i+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}const h=Math.sqrt(l),c=Math.atan2(h,a),u=Math.sin((1-e)*c)/h,f=Math.sin(e*c)/h;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=i*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class E{constructor(t=0,e=0,n=0){E.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Eo.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Eo.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,h=2*(o*i-a*n),c=2*(a*e-r*i),u=2*(r*n-o*e);return this.x=e+l*h+o*u-a*c,this.y=n+l*c+a*h-r*u,this.z=i+l*u+r*c-o*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return fr.copy(this).projectOnVector(t),this.sub(fr)}reflect(t){return this.sub(fr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Se(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const fr=new E,Eo=new ki;class us{constructor(t=new E(1/0,1/0,1/0),e=new E(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(tn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(tn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=tn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,tn):tn.fromBufferAttribute(r,o),tn.applyMatrix4(t.matrixWorld),this.expandByPoint(tn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),gs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),gs.copy(n.boundingBox)),gs.applyMatrix4(t.matrixWorld),this.union(gs)}const i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,tn),tn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Xi),vs.subVectors(this.max,Xi),li.subVectors(t.a,Xi),hi.subVectors(t.b,Xi),ci.subVectors(t.c,Xi),Un.subVectors(hi,li),Nn.subVectors(ci,hi),Xn.subVectors(li,ci);let e=[0,-Un.z,Un.y,0,-Nn.z,Nn.y,0,-Xn.z,Xn.y,Un.z,0,-Un.x,Nn.z,0,-Nn.x,Xn.z,0,-Xn.x,-Un.y,Un.x,0,-Nn.y,Nn.x,0,-Xn.y,Xn.x,0];return!pr(e,li,hi,ci,vs)||(e=[1,0,0,0,1,0,0,0,1],!pr(e,li,hi,ci,vs))?!1:(_s.crossVectors(Un,Nn),e=[_s.x,_s.y,_s.z],pr(e,li,hi,ci,vs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,tn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(tn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(vn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const vn=[new E,new E,new E,new E,new E,new E,new E,new E],tn=new E,gs=new us,li=new E,hi=new E,ci=new E,Un=new E,Nn=new E,Xn=new E,Xi=new E,vs=new E,_s=new E,qn=new E;function pr(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){qn.fromArray(s,r);const a=i.x*Math.abs(qn.x)+i.y*Math.abs(qn.y)+i.z*Math.abs(qn.z),l=t.dot(qn),h=e.dot(qn),c=n.dot(qn);if(Math.max(-Math.max(l,h,c),Math.min(l,h,c))>a)return!1}return!0}const Fc=new us,qi=new E,mr=new E;class ds{constructor(t=new E,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Fc.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;qi.subVectors(t,this.center);const e=qi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(qi,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(mr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(qi.copy(t.center).add(mr)),this.expandByPoint(qi.copy(t.center).sub(mr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const _n=new E,gr=new E,xs=new E,Fn=new E,vr=new E,Ms=new E,_r=new E;class ar{constructor(t=new E,e=new E(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,_n)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=_n.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(_n.copy(this.origin).addScaledVector(this.direction,e),_n.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){gr.copy(t).add(e).multiplyScalar(.5),xs.copy(e).sub(t).normalize(),Fn.copy(this.origin).sub(gr);const r=t.distanceTo(e)*.5,o=-this.direction.dot(xs),a=Fn.dot(this.direction),l=-Fn.dot(xs),h=Fn.lengthSq(),c=Math.abs(1-o*o);let u,f,d,g;if(c>0)if(u=o*l-a,f=o*a-l,g=r*c,u>=0)if(f>=-g)if(f<=g){const v=1/c;u*=v,f*=v,d=u*(u+o*f+2*a)+f*(o*u+f+2*l)+h}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+h;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+h;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+h):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+h):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+h);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(gr).addScaledVector(xs,f),d}intersectSphere(t,e){_n.subVectors(t.center,this.origin);const n=_n.dot(this.direction),i=_n.dot(_n)-n*n,r=t.radius*t.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l;const h=1/this.direction.x,c=1/this.direction.y,u=1/this.direction.z,f=this.origin;return h>=0?(n=(t.min.x-f.x)*h,i=(t.max.x-f.x)*h):(n=(t.max.x-f.x)*h,i=(t.min.x-f.x)*h),c>=0?(r=(t.min.y-f.y)*c,o=(t.max.y-f.y)*c):(r=(t.max.y-f.y)*c,o=(t.min.y-f.y)*c),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,_n)!==null}intersectTriangle(t,e,n,i,r){vr.subVectors(e,t),Ms.subVectors(n,t),_r.crossVectors(vr,Ms);let o=this.direction.dot(_r),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Fn.subVectors(this.origin,t);const l=a*this.direction.dot(Ms.crossVectors(Fn,Ms));if(l<0)return null;const h=a*this.direction.dot(vr.cross(Fn));if(h<0||l+h>o)return null;const c=-a*Fn.dot(_r);return c<0?null:this.at(c/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class re{constructor(t,e,n,i,r,o,a,l,h,c,u,f,d,g,v,m){re.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,h,c,u,f,d,g,v,m)}set(t,e,n,i,r,o,a,l,h,c,u,f,d,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=h,p[6]=c,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new re().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/ui.setFromMatrixColumn(t,0).length(),r=1/ui.setFromMatrixColumn(t,1).length(),o=1/ui.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),h=Math.sin(i),c=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=o*c,d=o*u,g=a*c,v=a*u;e[0]=l*c,e[4]=-l*u,e[8]=h,e[1]=d+g*h,e[5]=f-v*h,e[9]=-a*l,e[2]=v-f*h,e[6]=g+d*h,e[10]=o*l}else if(t.order==="YXZ"){const f=l*c,d=l*u,g=h*c,v=h*u;e[0]=f+v*a,e[4]=g*a-d,e[8]=o*h,e[1]=o*u,e[5]=o*c,e[9]=-a,e[2]=d*a-g,e[6]=v+f*a,e[10]=o*l}else if(t.order==="ZXY"){const f=l*c,d=l*u,g=h*c,v=h*u;e[0]=f-v*a,e[4]=-o*u,e[8]=g+d*a,e[1]=d+g*a,e[5]=o*c,e[9]=v-f*a,e[2]=-o*h,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const f=o*c,d=o*u,g=a*c,v=a*u;e[0]=l*c,e[4]=g*h-d,e[8]=f*h+v,e[1]=l*u,e[5]=v*h+f,e[9]=d*h-g,e[2]=-h,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const f=o*l,d=o*h,g=a*l,v=a*h;e[0]=l*c,e[4]=v-f*u,e[8]=g*u+d,e[1]=u,e[5]=o*c,e[9]=-a*c,e[2]=-h*c,e[6]=d*u+g,e[10]=f-v*u}else if(t.order==="XZY"){const f=o*l,d=o*h,g=a*l,v=a*h;e[0]=l*c,e[4]=-u,e[8]=h*c,e[1]=f*u+v,e[5]=o*c,e[9]=d*u-g,e[2]=g*u-d,e[6]=a*c,e[10]=v*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Oc,t,zc)}lookAt(t,e,n){const i=this.elements;return Ve.subVectors(t,e),Ve.lengthSq()===0&&(Ve.z=1),Ve.normalize(),On.crossVectors(n,Ve),On.lengthSq()===0&&(Math.abs(n.z)===1?Ve.x+=1e-4:Ve.z+=1e-4,Ve.normalize(),On.crossVectors(n,Ve)),On.normalize(),ys.crossVectors(Ve,On),i[0]=On.x,i[4]=ys.x,i[8]=Ve.x,i[1]=On.y,i[5]=ys.y,i[9]=Ve.y,i[2]=On.z,i[6]=ys.z,i[10]=Ve.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],h=n[12],c=n[1],u=n[5],f=n[9],d=n[13],g=n[2],v=n[6],m=n[10],p=n[14],S=n[3],T=n[7],y=n[11],F=n[15],A=i[0],R=i[4],D=i[8],w=i[12],M=i[1],C=i[5],H=i[9],k=i[13],X=i[2],Z=i[6],W=i[10],J=i[14],V=i[3],rt=i[7],ft=i[11],Et=i[15];return r[0]=o*A+a*M+l*X+h*V,r[4]=o*R+a*C+l*Z+h*rt,r[8]=o*D+a*H+l*W+h*ft,r[12]=o*w+a*k+l*J+h*Et,r[1]=c*A+u*M+f*X+d*V,r[5]=c*R+u*C+f*Z+d*rt,r[9]=c*D+u*H+f*W+d*ft,r[13]=c*w+u*k+f*J+d*Et,r[2]=g*A+v*M+m*X+p*V,r[6]=g*R+v*C+m*Z+p*rt,r[10]=g*D+v*H+m*W+p*ft,r[14]=g*w+v*k+m*J+p*Et,r[3]=S*A+T*M+y*X+F*V,r[7]=S*R+T*C+y*Z+F*rt,r[11]=S*D+T*H+y*W+F*ft,r[15]=S*w+T*k+y*J+F*Et,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],h=t[13],c=t[2],u=t[6],f=t[10],d=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+r*l*u-i*h*u-r*a*f+n*h*f+i*a*d-n*l*d)+v*(+e*l*d-e*h*f+r*o*f-i*o*d+i*h*c-r*l*c)+m*(+e*h*u-e*a*d-r*o*u+n*o*d+r*a*c-n*h*c)+p*(-i*a*c-e*l*u+e*a*f+i*o*u-n*o*f+n*l*c)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],h=t[7],c=t[8],u=t[9],f=t[10],d=t[11],g=t[12],v=t[13],m=t[14],p=t[15],S=u*m*h-v*f*h+v*l*d-a*m*d-u*l*p+a*f*p,T=g*f*h-c*m*h-g*l*d+o*m*d+c*l*p-o*f*p,y=c*v*h-g*u*h+g*a*d-o*v*d-c*a*p+o*u*p,F=g*u*l-c*v*l-g*a*f+o*v*f+c*a*m-o*u*m,A=e*S+n*T+i*y+r*F;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/A;return t[0]=S*R,t[1]=(v*f*r-u*m*r-v*i*d+n*m*d+u*i*p-n*f*p)*R,t[2]=(a*m*r-v*l*r+v*i*h-n*m*h-a*i*p+n*l*p)*R,t[3]=(u*l*r-a*f*r-u*i*h+n*f*h+a*i*d-n*l*d)*R,t[4]=T*R,t[5]=(c*m*r-g*f*r+g*i*d-e*m*d-c*i*p+e*f*p)*R,t[6]=(g*l*r-o*m*r-g*i*h+e*m*h+o*i*p-e*l*p)*R,t[7]=(o*f*r-c*l*r+c*i*h-e*f*h-o*i*d+e*l*d)*R,t[8]=y*R,t[9]=(g*u*r-c*v*r-g*n*d+e*v*d+c*n*p-e*u*p)*R,t[10]=(o*v*r-g*a*r+g*n*h-e*v*h-o*n*p+e*a*p)*R,t[11]=(c*a*r-o*u*r-c*n*h+e*u*h+o*n*d-e*a*d)*R,t[12]=F*R,t[13]=(c*v*i-g*u*i+g*n*f-e*v*f-c*n*m+e*u*m)*R,t[14]=(g*a*i-o*v*i-g*n*l+e*v*l+o*n*m-e*a*m)*R,t[15]=(o*u*i-c*a*i+c*n*l-e*u*l-o*n*f+e*a*f)*R,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,h=r*o,c=r*a;return this.set(h*o+n,h*a-i*l,h*l+i*a,0,h*a+i*l,c*a+n,c*l-i*o,0,h*l-i*a,c*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,h=r+r,c=o+o,u=a+a,f=r*h,d=r*c,g=r*u,v=o*c,m=o*u,p=a*u,S=l*h,T=l*c,y=l*u,F=n.x,A=n.y,R=n.z;return i[0]=(1-(v+p))*F,i[1]=(d+y)*F,i[2]=(g-T)*F,i[3]=0,i[4]=(d-y)*A,i[5]=(1-(f+p))*A,i[6]=(m+S)*A,i[7]=0,i[8]=(g+T)*R,i[9]=(m-S)*R,i[10]=(1-(f+v))*R,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let r=ui.set(i[0],i[1],i[2]).length();const o=ui.set(i[4],i[5],i[6]).length(),a=ui.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],en.copy(this);const h=1/r,c=1/o,u=1/a;return en.elements[0]*=h,en.elements[1]*=h,en.elements[2]*=h,en.elements[4]*=c,en.elements[5]*=c,en.elements[6]*=c,en.elements[8]*=u,en.elements[9]*=u,en.elements[10]*=u,e.setFromRotationMatrix(en),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=En){const l=this.elements,h=2*r/(e-t),c=2*r/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i);let d,g;if(a===En)d=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===js)d=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=c,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=En){const l=this.elements,h=1/(e-t),c=1/(n-i),u=1/(o-r),f=(e+t)*h,d=(n+i)*c;let g,v;if(a===En)g=(o+r)*u,v=-2*u;else if(a===js)g=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*h,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*c,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ui=new E,en=new re,Oc=new E(0,0,0),zc=new E(1,1,1),On=new E,ys=new E,Ve=new E,bo=new re,To=new ki;class hn{constructor(t=0,e=0,n=0,i=hn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],h=i[5],c=i[9],u=i[2],f=i[6],d=i[10];switch(e){case"XYZ":this._y=Math.asin(Se(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-c,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Se(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Se(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,h)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Se(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,h));break;case"YZX":this._z=Math.asin(Se(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-c,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Se(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,h),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-c,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return bo.makeRotationFromQuaternion(t),this.setFromRotationMatrix(bo,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return To.setFromEuler(this),this.setFromQuaternion(To,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}hn.DEFAULT_ORDER="XYZ";class qa{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Bc=0;const Ao=new E,di=new ki,xn=new re,Ss=new E,Yi=new E,kc=new E,Hc=new ki,Ro=new E(1,0,0),Co=new E(0,1,0),Po=new E(0,0,1),Lo={type:"added"},Gc={type:"removed"},fi={type:"childadded",child:null},xr={type:"childremoved",child:null};class _e extends Bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Bc++}),this.uuid=Rn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=_e.DEFAULT_UP.clone();const t=new E,e=new hn,n=new ki,i=new E(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new re},normalMatrix:{value:new zt}}),this.matrix=new re,this.matrixWorld=new re,this.matrixAutoUpdate=_e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=_e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return di.setFromAxisAngle(t,e),this.quaternion.multiply(di),this}rotateOnWorldAxis(t,e){return di.setFromAxisAngle(t,e),this.quaternion.premultiply(di),this}rotateX(t){return this.rotateOnAxis(Ro,t)}rotateY(t){return this.rotateOnAxis(Co,t)}rotateZ(t){return this.rotateOnAxis(Po,t)}translateOnAxis(t,e){return Ao.copy(t).applyQuaternion(this.quaternion),this.position.add(Ao.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ro,t)}translateY(t){return this.translateOnAxis(Co,t)}translateZ(t){return this.translateOnAxis(Po,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(xn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ss.copy(t):Ss.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Yi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xn.lookAt(Yi,Ss,this.up):xn.lookAt(Ss,Yi,this.up),this.quaternion.setFromRotationMatrix(xn),i&&(xn.extractRotation(i.matrixWorld),di.setFromRotationMatrix(xn),this.quaternion.premultiply(di.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Lo),fi.child=t,this.dispatchEvent(fi),fi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Gc),xr.child=t,this.dispatchEvent(xr),xr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),xn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),xn.multiply(t.parent.matrixWorld)),t.applyMatrix4(xn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Lo),fi.child=t,this.dispatchEvent(fi),fi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yi,t,kc),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yi,Hc,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let h=0,c=l.length;h<c;h++){const u=l[h];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,h=this.material.length;l<h;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),h=o(t.textures),c=o(t.images),u=o(t.shapes),f=o(t.skeletons),d=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),h.length>0&&(n.textures=h),c.length>0&&(n.images=c),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const l=[];for(const h in a){const c=a[h];delete c.metadata,l.push(c)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}_e.DEFAULT_UP=new E(0,1,0);_e.DEFAULT_MATRIX_AUTO_UPDATE=!0;_e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const nn=new E,Mn=new E,Mr=new E,yn=new E,pi=new E,mi=new E,Do=new E,yr=new E,Sr=new E,wr=new E,Er=new se,br=new se,Tr=new se;class Ze{constructor(t=new E,e=new E,n=new E){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),nn.subVectors(t,e),i.cross(nn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){nn.subVectors(i,e),Mn.subVectors(n,e),Mr.subVectors(t,e);const o=nn.dot(nn),a=nn.dot(Mn),l=nn.dot(Mr),h=Mn.dot(Mn),c=Mn.dot(Mr),u=o*h-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(h*l-a*c)*f,g=(o*c-a*l)*f;return r.set(1-d-g,g,d)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,yn)===null?!1:yn.x>=0&&yn.y>=0&&yn.x+yn.y<=1}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,yn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,yn.x),l.addScaledVector(o,yn.y),l.addScaledVector(a,yn.z),l)}static getInterpolatedAttribute(t,e,n,i,r,o){return Er.setScalar(0),br.setScalar(0),Tr.setScalar(0),Er.fromBufferAttribute(t,e),br.fromBufferAttribute(t,n),Tr.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(Er,r.x),o.addScaledVector(br,r.y),o.addScaledVector(Tr,r.z),o}static isFrontFacing(t,e,n,i){return nn.subVectors(n,e),Mn.subVectors(t,e),nn.cross(Mn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return nn.subVectors(this.c,this.b),Mn.subVectors(this.a,this.b),nn.cross(Mn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ze.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Ze.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return Ze.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return Ze.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ze.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let o,a;pi.subVectors(i,n),mi.subVectors(r,n),yr.subVectors(t,n);const l=pi.dot(yr),h=mi.dot(yr);if(l<=0&&h<=0)return e.copy(n);Sr.subVectors(t,i);const c=pi.dot(Sr),u=mi.dot(Sr);if(c>=0&&u<=c)return e.copy(i);const f=l*u-c*h;if(f<=0&&l>=0&&c<=0)return o=l/(l-c),e.copy(n).addScaledVector(pi,o);wr.subVectors(t,r);const d=pi.dot(wr),g=mi.dot(wr);if(g>=0&&d<=g)return e.copy(r);const v=d*h-l*g;if(v<=0&&h>=0&&g<=0)return a=h/(h-g),e.copy(n).addScaledVector(mi,a);const m=c*g-d*u;if(m<=0&&u-c>=0&&d-g>=0)return Do.subVectors(r,i),a=(u-c)/(u-c+(d-g)),e.copy(i).addScaledVector(Do,a);const p=1/(m+v+f);return o=v*p,a=f*p,e.copy(n).addScaledVector(pi,o).addScaledVector(mi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const nh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},zn={h:0,s:0,l:0},ws={h:0,s:0,l:0};function Ar(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Ct{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Fe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,$t.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=$t.workingColorSpace){return this.r=t,this.g=e,this.b=n,$t.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=$t.workingColorSpace){if(t=Xa(t,1),e=Se(e,0,1),n=Se(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Ar(o,r,t+1/3),this.g=Ar(o,r,t),this.b=Ar(o,r,t-1/3)}return $t.toWorkingColorSpace(this,i),this}setStyle(t,e=Fe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Fe){const n=nh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Cn(t.r),this.g=Cn(t.g),this.b=Cn(t.b),this}copyLinearToSRGB(t){return this.r=Ri(t.r),this.g=Ri(t.g),this.b=Ri(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Fe){return $t.fromWorkingColorSpace(Le.copy(this),t),Math.round(Se(Le.r*255,0,255))*65536+Math.round(Se(Le.g*255,0,255))*256+Math.round(Se(Le.b*255,0,255))}getHexString(t=Fe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=$t.workingColorSpace){$t.fromWorkingColorSpace(Le.copy(this),e);const n=Le.r,i=Le.g,r=Le.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,h;const c=(a+o)/2;if(a===o)l=0,h=0;else{const u=o-a;switch(h=c<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=h,t.l=c,t}getRGB(t,e=$t.workingColorSpace){return $t.fromWorkingColorSpace(Le.copy(this),e),t.r=Le.r,t.g=Le.g,t.b=Le.b,t}getStyle(t=Fe){$t.fromWorkingColorSpace(Le.copy(this),t);const e=Le.r,n=Le.g,i=Le.b;return t!==Fe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(zn),this.setHSL(zn.h+t,zn.s+e,zn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(zn),t.getHSL(ws);const n=rs(zn.h,ws.h,e),i=rs(zn.s,ws.s,e),r=rs(zn.l,ws.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Le=new Ct;Ct.NAMES=nh;let Vc=0;class Vn extends Bi{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Vc++}),this.uuid=Rn(),this.name="",this.blending=ii,this.side=Gn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=qr,this.blendDst=Yr,this.blendEquation=ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ct(0,0,0),this.blendAlpha=0,this.depthFunc=Ci,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=mo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ai,this.stencilZFail=ai,this.stencilZPass=ai,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ii&&(n.blending=this.blending),this.side!==Gn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==qr&&(n.blendSrc=this.blendSrc),this.blendDst!==Yr&&(n.blendDst=this.blendDst),this.blendEquation!==ti&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ci&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==mo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ai&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ai&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ai&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class bt extends Vn{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Ct(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.combine=Ul,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ye=new E,Es=new nt;class je{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Pa,this.updateRanges=[],this.gpuType=wn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Es.fromBufferAttribute(this,e),Es.applyMatrix3(t),this.setXY(e,Es.x,Es.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix3(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix4(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyNormalMatrix(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.transformDirection(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=sn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ie(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=sn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=sn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=sn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=sn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),i=ie(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),i=ie(i,this.array),r=ie(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Pa&&(t.usage=this.usage),t}}class ih extends je{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class sh extends je{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ae extends je{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Wc=0;const Ke=new re,Rr=new _e,gi=new E,We=new us,Ki=new us,Ae=new E;class Te extends Bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Wc++}),this.uuid=Rn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ql(t)?sh:ih)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new zt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ke.makeRotationFromQuaternion(t),this.applyMatrix4(Ke),this}rotateX(t){return Ke.makeRotationX(t),this.applyMatrix4(Ke),this}rotateY(t){return Ke.makeRotationY(t),this.applyMatrix4(Ke),this}rotateZ(t){return Ke.makeRotationZ(t),this.applyMatrix4(Ke),this}translate(t,e,n){return Ke.makeTranslation(t,e,n),this.applyMatrix4(Ke),this}scale(t,e,n){return Ke.makeScale(t,e,n),this.applyMatrix4(Ke),this}lookAt(t){return Rr.lookAt(t),Rr.updateMatrix(),this.applyMatrix4(Rr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gi).negate(),this.translate(gi.x,gi.y,gi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,r=t.length;i<r;i++){const o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ae(n,3))}else{for(let n=0,i=e.count;n<i;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new us);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new E(-1/0,-1/0,-1/0),new E(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];We.setFromBufferAttribute(r),this.morphTargetsRelative?(Ae.addVectors(this.boundingBox.min,We.min),this.boundingBox.expandByPoint(Ae),Ae.addVectors(this.boundingBox.max,We.max),this.boundingBox.expandByPoint(Ae)):(this.boundingBox.expandByPoint(We.min),this.boundingBox.expandByPoint(We.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ds);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new E,1/0);return}if(t){const n=this.boundingSphere.center;if(We.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Ki.setFromBufferAttribute(a),this.morphTargetsRelative?(Ae.addVectors(We.min,Ki.min),We.expandByPoint(Ae),Ae.addVectors(We.max,Ki.max),We.expandByPoint(Ae)):(We.expandByPoint(Ki.min),We.expandByPoint(Ki.max))}We.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)Ae.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Ae));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let h=0,c=a.count;h<c;h++)Ae.fromBufferAttribute(a,h),l&&(gi.fromBufferAttribute(t,h),Ae.add(gi)),i=Math.max(i,n.distanceToSquared(Ae))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new je(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let D=0;D<n.count;D++)a[D]=new E,l[D]=new E;const h=new E,c=new E,u=new E,f=new nt,d=new nt,g=new nt,v=new E,m=new E;function p(D,w,M){h.fromBufferAttribute(n,D),c.fromBufferAttribute(n,w),u.fromBufferAttribute(n,M),f.fromBufferAttribute(r,D),d.fromBufferAttribute(r,w),g.fromBufferAttribute(r,M),c.sub(h),u.sub(h),d.sub(f),g.sub(f);const C=1/(d.x*g.y-g.x*d.y);isFinite(C)&&(v.copy(c).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(C),m.copy(u).multiplyScalar(d.x).addScaledVector(c,-g.x).multiplyScalar(C),a[D].add(v),a[w].add(v),a[M].add(v),l[D].add(m),l[w].add(m),l[M].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let D=0,w=S.length;D<w;++D){const M=S[D],C=M.start,H=M.count;for(let k=C,X=C+H;k<X;k+=3)p(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const T=new E,y=new E,F=new E,A=new E;function R(D){F.fromBufferAttribute(i,D),A.copy(F);const w=a[D];T.copy(w),T.sub(F.multiplyScalar(F.dot(w))).normalize(),y.crossVectors(A,w);const C=y.dot(l[D])<0?-1:1;o.setXYZW(D,T.x,T.y,T.z,C)}for(let D=0,w=S.length;D<w;++D){const M=S[D],C=M.start,H=M.count;for(let k=C,X=C+H;k<X;k+=3)R(t.getX(k+0)),R(t.getX(k+1)),R(t.getX(k+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new je(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const i=new E,r=new E,o=new E,a=new E,l=new E,h=new E,c=new E,u=new E;if(t)for(let f=0,d=t.count;f<d;f+=3){const g=t.getX(f+0),v=t.getX(f+1),m=t.getX(f+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,m),c.subVectors(o,r),u.subVectors(i,r),c.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),h.fromBufferAttribute(n,m),a.add(c),l.add(c),h.add(c),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,h.x,h.y,h.z)}else for(let f=0,d=e.count;f<d;f+=3)i.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),c.subVectors(o,r),u.subVectors(i,r),c.cross(u),n.setXYZ(f+0,c.x,c.y,c.z),n.setXYZ(f+1,c.x,c.y,c.z),n.setXYZ(f+2,c.x,c.y,c.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ae.fromBufferAttribute(t,e),Ae.normalize(),t.setXYZ(e,Ae.x,Ae.y,Ae.z)}toNonIndexed(){function t(a,l){const h=a.array,c=a.itemSize,u=a.normalized,f=new h.constructor(l.length*c);let d=0,g=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?d=l[v]*a.data.stride+a.offset:d=l[v]*c;for(let p=0;p<c;p++)f[g++]=h[d++]}return new je(f,c,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Te,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],h=t(l,n);e.setAttribute(a,h)}const r=this.morphAttributes;for(const a in r){const l=[],h=r[a];for(let c=0,u=h.length;c<u;c++){const f=h[c],d=t(f,n);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const h=o[a];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const h in l)l[h]!==void 0&&(t[h]=l[h]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const h=n[l];t.data.attributes[l]=h.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const h=this.morphAttributes[l],c=[];for(let u=0,f=h.length;u<f;u++){const d=h[u];c.push(d.toJSON(t.data))}c.length>0&&(i[l]=c,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const h in i){const c=i[h];this.setAttribute(h,c.clone(e))}const r=t.morphAttributes;for(const h in r){const c=[],u=r[h];for(let f=0,d=u.length;f<d;f++)c.push(u[f].clone(e));this.morphAttributes[h]=c}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let h=0,c=o.length;h<c;h++){const u=o[h];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Io=new re,Yn=new ar,bs=new ds,Uo=new E,Ts=new E,As=new E,Rs=new E,Cr=new E,Cs=new E,No=new E,Ps=new E;class P extends _e{constructor(t=new Te,e=new bt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(r&&a){Cs.set(0,0,0);for(let l=0,h=r.length;l<h;l++){const c=a[l],u=r[l];c!==0&&(Cr.fromBufferAttribute(u,t),o?Cs.addScaledVector(Cr,c):Cs.addScaledVector(Cr.sub(e),c))}e.add(Cs)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),bs.copy(n.boundingSphere),bs.applyMatrix4(r),Yn.copy(t.ray).recast(t.near),!(bs.containsPoint(Yn.origin)===!1&&(Yn.intersectSphere(bs,Uo)===null||Yn.origin.distanceToSquared(Uo)>(t.far-t.near)**2))&&(Io.copy(r).invert(),Yn.copy(t.ray).applyMatrix4(Io),!(n.boundingBox!==null&&Yn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Yn)))}_computeIntersections(t,e,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,h=r.attributes.uv,c=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=f.length;g<v;g++){const m=f[g],p=o[m.materialIndex],S=Math.max(m.start,d.start),T=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let y=S,F=T;y<F;y+=3){const A=a.getX(y),R=a.getX(y+1),D=a.getX(y+2);i=Ls(this,p,t,n,h,c,u,A,R,D),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,d.start),v=Math.min(a.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const S=a.getX(m),T=a.getX(m+1),y=a.getX(m+2);i=Ls(this,o,t,n,h,c,u,S,T,y),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=f.length;g<v;g++){const m=f[g],p=o[m.materialIndex],S=Math.max(m.start,d.start),T=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let y=S,F=T;y<F;y+=3){const A=y,R=y+1,D=y+2;i=Ls(this,p,t,n,h,c,u,A,R,D),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const S=m,T=m+1,y=m+2;i=Ls(this,o,t,n,h,c,u,S,T,y),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function Xc(s,t,e,n,i,r,o,a){let l;if(t.side===Ie?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===Gn,a),l===null)return null;Ps.copy(a),Ps.applyMatrix4(s.matrixWorld);const h=e.ray.origin.distanceTo(Ps);return h<e.near||h>e.far?null:{distance:h,point:Ps.clone(),object:s}}function Ls(s,t,e,n,i,r,o,a,l,h){s.getVertexPosition(a,Ts),s.getVertexPosition(l,As),s.getVertexPosition(h,Rs);const c=Xc(s,t,e,n,Ts,As,Rs,No);if(c){const u=new E;Ze.getBarycoord(No,Ts,As,Rs,u),i&&(c.uv=Ze.getInterpolatedAttribute(i,a,l,h,u,new nt)),r&&(c.uv1=Ze.getInterpolatedAttribute(r,a,l,h,u,new nt)),o&&(c.normal=Ze.getInterpolatedAttribute(o,a,l,h,u,new E),c.normal.dot(n.direction)>0&&c.normal.multiplyScalar(-1));const f={a,b:l,c:h,normal:new E,materialIndex:0};Ze.getNormal(Ts,As,Rs,f.normal),c.face=f,c.barycoord=u}return c}class ut extends Te{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],h=[],c=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,i,o,2),g("x","z","y",1,-1,t,n,-e,i,o,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new ae(h,3)),this.setAttribute("normal",new ae(c,3)),this.setAttribute("uv",new ae(u,2));function g(v,m,p,S,T,y,F,A,R,D,w){const M=y/R,C=F/D,H=y/2,k=F/2,X=A/2,Z=R+1,W=D+1;let J=0,V=0;const rt=new E;for(let ft=0;ft<W;ft++){const Et=ft*C-k;for(let Wt=0;Wt<Z;Wt++){const oe=Wt*M-H;rt[v]=oe*S,rt[m]=Et*T,rt[p]=X,h.push(rt.x,rt.y,rt.z),rt[v]=0,rt[m]=0,rt[p]=A>0?1:-1,c.push(rt.x,rt.y,rt.z),u.push(Wt/R),u.push(1-ft/D),J+=1}}for(let ft=0;ft<D;ft++)for(let Et=0;Et<R;Et++){const Wt=f+Et+Z*ft,oe=f+Et+Z*(ft+1),Y=f+(Et+1)+Z*(ft+1),et=f+(Et+1)+Z*ft;l.push(Wt,oe,et),l.push(oe,Y,et),V+=6}a.addGroup(d,V,w),d+=V,f+=J}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ut(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ni(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Ne(s){const t={};for(let e=0;e<s.length;e++){const n=Ni(s[e]);for(const i in n)t[i]=n[i]}return t}function qc(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function rh(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:$t.workingColorSpace}const hs={clone:Ni,merge:Ne};var Yc=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Kc=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class De extends Vn{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Yc,this.fragmentShader=Kc,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ni(t.uniforms),this.uniformsGroups=qc(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class ah extends _e{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new re,this.projectionMatrix=new re,this.projectionMatrixInverse=new re,this.coordinateSystem=En}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Bn=new E,Fo=new nt,Oo=new nt;class ke extends ah{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ui*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ss*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ui*2*Math.atan(Math.tan(ss*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Bn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Bn.x,Bn.y).multiplyScalar(-t/Bn.z),Bn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Bn.x,Bn.y).multiplyScalar(-t/Bn.z)}getViewSize(t,e){return this.getViewBounds(t,Fo,Oo),e.subVectors(Oo,Fo)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ss*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,h=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/h,i*=o.width/l,n*=o.height/h}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const vi=-90,_i=1;class $c extends _e{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new ke(vi,_i,t,e);i.layers=this.layers,this.add(i);const r=new ke(vi,_i,t,e);r.layers=this.layers,this.add(r);const o=new ke(vi,_i,t,e);o.layers=this.layers,this.add(o);const a=new ke(vi,_i,t,e);a.layers=this.layers,this.add(a);const l=new ke(vi,_i,t,e);l.layers=this.layers,this.add(l);const h=new ke(vi,_i,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(const h of e)this.remove(h);if(t===En)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===js)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,h,c]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,h),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,i),t.render(e,c),t.setRenderTarget(u,f,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class oh extends Oe{constructor(t,e,n,i,r,o,a,l,h,c){t=t!==void 0?t:[],e=e!==void 0?e:Pi,super(t,e,n,i,r,o,a,l,h,c),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Zc extends ln{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new oh(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:fn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new ut(5,5,5),r=new De({name:"CubemapFromEquirect",uniforms:Ni(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ie,blending:Tn});r.uniforms.tEquirect.value=e;const o=new P(i,r),a=e.minFilter;return e.minFilter===ni&&(e.minFilter=fn),new $c(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,i){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}}const Pr=new E,jc=new E,Jc=new zt;class Jn{constructor(t=new E(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Pr.subVectors(n,e).cross(jc.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Pr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Jc.getNormalMatrix(t),i=this.coplanarPoint(Pr).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Kn=new ds,Ds=new E;class Ya{constructor(t=new Jn,e=new Jn,n=new Jn,i=new Jn,r=new Jn,o=new Jn){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=En){const n=this.planes,i=t.elements,r=i[0],o=i[1],a=i[2],l=i[3],h=i[4],c=i[5],u=i[6],f=i[7],d=i[8],g=i[9],v=i[10],m=i[11],p=i[12],S=i[13],T=i[14],y=i[15];if(n[0].setComponents(l-r,f-h,m-d,y-p).normalize(),n[1].setComponents(l+r,f+h,m+d,y+p).normalize(),n[2].setComponents(l+o,f+c,m+g,y+S).normalize(),n[3].setComponents(l-o,f-c,m-g,y-S).normalize(),n[4].setComponents(l-a,f-u,m-v,y-T).normalize(),e===En)n[5].setComponents(l+a,f+u,m+v,y+T).normalize();else if(e===js)n[5].setComponents(a,u,v,T).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Kn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Kn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Kn)}intersectsSprite(t){return Kn.center.set(0,0,0),Kn.radius=.7071067811865476,Kn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Kn)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Ds.x=i.normal.x>0?t.max.x:t.min.x,Ds.y=i.normal.y>0?t.max.y:t.min.y,Ds.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Ds)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function lh(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function Qc(s){const t=new WeakMap;function e(a,l){const h=a.array,c=a.usage,u=h.byteLength,f=s.createBuffer();s.bindBuffer(l,f),s.bufferData(l,h,c),a.onUploadCallback();let d;if(h instanceof Float32Array)d=s.FLOAT;else if(h instanceof Uint16Array)a.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(h instanceof Int16Array)d=s.SHORT;else if(h instanceof Uint32Array)d=s.UNSIGNED_INT;else if(h instanceof Int32Array)d=s.INT;else if(h instanceof Int8Array)d=s.BYTE;else if(h instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:f,type:d,bytesPerElement:h.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,h){const c=l.array,u=l.updateRanges;if(s.bindBuffer(h,a),u.length===0)s.bufferSubData(h,0,c);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){const g=u[f],v=u[d];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++f,u[f]=v)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){const v=u[d];s.bufferSubData(h,v.start*c.BYTES_PER_ELEMENT,c,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(s.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const c=t.get(a);(!c||c.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const h=t.get(a);if(h===void 0)t.set(a,e(a,l));else if(h.version<a.version){if(h.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(h.buffer,a,l),h.version=a.version}}return{get:i,remove:r,update:o}}class Ht extends Te{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),h=a+1,c=l+1,u=t/a,f=e/l,d=[],g=[],v=[],m=[];for(let p=0;p<c;p++){const S=p*f-o;for(let T=0;T<h;T++){const y=T*u-r;g.push(y,-S,0),v.push(0,0,1),m.push(T/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let S=0;S<a;S++){const T=S+h*p,y=S+h*(p+1),F=S+1+h*(p+1),A=S+1+h*p;d.push(T,y,A),d.push(y,F,A)}this.setIndex(d),this.setAttribute("position",new ae(g,3)),this.setAttribute("normal",new ae(v,3)),this.setAttribute("uv",new ae(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ht(t.width,t.height,t.widthSegments,t.heightSegments)}}var tu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,eu=`#ifdef USE_ALPHAHASH
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
#endif`,nu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,iu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,su=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ru=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,au=`#ifdef USE_AOMAP
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
#endif`,ou=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,lu=`#ifdef USE_BATCHING
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
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,hu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,cu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,uu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,du=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,fu=`#ifdef USE_IRIDESCENCE
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
#endif`,pu=`#ifdef USE_BUMPMAP
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
#endif`,mu=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,gu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,vu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,_u=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,xu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Mu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,yu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Su=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,wu=`#define PI 3.141592653589793
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
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
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
} // validated`,Eu=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,bu=`vec3 transformedNormal = objectNormal;
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
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Tu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Au=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ru=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Cu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Pu="gl_FragColor = linearToOutputTexel( gl_FragColor );",Lu=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Du=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Iu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Uu=`#ifdef USE_ENVMAP
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
#endif`,Nu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Fu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ou=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,zu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Bu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ku=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Hu=`#ifdef USE_GRADIENTMAP
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
}`,Gu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Vu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Wu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Xu=`uniform bool receiveShadow;
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
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
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
#endif`,qu=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
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
	#endif
#endif`,Yu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ku=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,$u=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Zu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ju=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
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
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
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
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
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
#endif`,Ju=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
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
		vec3 iridescenceF0;
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
		float v = 0.5 / ( gv + gl );
		return saturate(v);
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
	vec3 f0 = material.specularColor;
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
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
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
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
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
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
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
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Qu=`
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
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
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
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,td=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ed=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,nd=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,id=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sd=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rd=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ad=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,od=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ld=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,hd=`#if defined( USE_POINTS_UV )
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
#endif`,cd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ud=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,dd=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,fd=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,pd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,md=`#ifdef USE_MORPHTARGETS
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
#endif`,gd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
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
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,_d=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,xd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Md=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,yd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Sd=`#ifdef USE_NORMALMAP
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
#endif`,wd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ed=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,bd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Td=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ad=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Rd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Cd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Pd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ld=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Dd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Id=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ud=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Nd=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
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
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
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
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
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
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Fd=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
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
#endif`,Od=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
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
#endif`,zd=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
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
	#if NUM_POINT_LIGHT_SHADOWS > 0
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
}`,Bd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,kd=`#ifdef USE_SKINNING
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
#endif`,Hd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Gd=`#ifdef USE_SKINNING
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
#endif`,Vd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Wd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Xd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,qd=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Yd=`#ifdef USE_TRANSMISSION
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
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Kd=`#ifdef USE_TRANSMISSION
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
#endif`,$d=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Zd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jd=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Qd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,tf=`uniform sampler2D t2D;
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
}`,ef=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,nf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,af=`#include <common>
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
}`,of=`#if DEPTH_PACKING == 3200
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
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,lf=`#define DISTANCE
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
}`,hf=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,cf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,uf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,df=`uniform float scale;
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
}`,ff=`uniform vec3 diffuse;
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
}`,pf=`#include <common>
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
}`,mf=`uniform vec3 diffuse;
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
}`,gf=`#define LAMBERT
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
}`,vf=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
}`,_f=`#define MATCAP
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
}`,xf=`#define MATCAP
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
}`,Mf=`#define NORMAL
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
}`,yf=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
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
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Sf=`#define PHONG
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
}`,wf=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
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
}`,Ef=`#define STANDARD
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
}`,bf=`#define STANDARD
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
#include <packing>
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
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
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
}`,Tf=`#define TOON
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
}`,Af=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
}`,Rf=`uniform float size;
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
}`,Cf=`uniform vec3 diffuse;
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
}`,Pf=`#include <common>
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
}`,Lf=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
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
}`,Df=`uniform float rotation;
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
}`,If=`uniform vec3 diffuse;
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
}`,kt={alphahash_fragment:tu,alphahash_pars_fragment:eu,alphamap_fragment:nu,alphamap_pars_fragment:iu,alphatest_fragment:su,alphatest_pars_fragment:ru,aomap_fragment:au,aomap_pars_fragment:ou,batching_pars_vertex:lu,batching_vertex:hu,begin_vertex:cu,beginnormal_vertex:uu,bsdfs:du,iridescence_fragment:fu,bumpmap_pars_fragment:pu,clipping_planes_fragment:mu,clipping_planes_pars_fragment:gu,clipping_planes_pars_vertex:vu,clipping_planes_vertex:_u,color_fragment:xu,color_pars_fragment:Mu,color_pars_vertex:yu,color_vertex:Su,common:wu,cube_uv_reflection_fragment:Eu,defaultnormal_vertex:bu,displacementmap_pars_vertex:Tu,displacementmap_vertex:Au,emissivemap_fragment:Ru,emissivemap_pars_fragment:Cu,colorspace_fragment:Pu,colorspace_pars_fragment:Lu,envmap_fragment:Du,envmap_common_pars_fragment:Iu,envmap_pars_fragment:Uu,envmap_pars_vertex:Nu,envmap_physical_pars_fragment:qu,envmap_vertex:Fu,fog_vertex:Ou,fog_pars_vertex:zu,fog_fragment:Bu,fog_pars_fragment:ku,gradientmap_pars_fragment:Hu,lightmap_pars_fragment:Gu,lights_lambert_fragment:Vu,lights_lambert_pars_fragment:Wu,lights_pars_begin:Xu,lights_toon_fragment:Yu,lights_toon_pars_fragment:Ku,lights_phong_fragment:$u,lights_phong_pars_fragment:Zu,lights_physical_fragment:ju,lights_physical_pars_fragment:Ju,lights_fragment_begin:Qu,lights_fragment_maps:td,lights_fragment_end:ed,logdepthbuf_fragment:nd,logdepthbuf_pars_fragment:id,logdepthbuf_pars_vertex:sd,logdepthbuf_vertex:rd,map_fragment:ad,map_pars_fragment:od,map_particle_fragment:ld,map_particle_pars_fragment:hd,metalnessmap_fragment:cd,metalnessmap_pars_fragment:ud,morphinstance_vertex:dd,morphcolor_vertex:fd,morphnormal_vertex:pd,morphtarget_pars_vertex:md,morphtarget_vertex:gd,normal_fragment_begin:vd,normal_fragment_maps:_d,normal_pars_fragment:xd,normal_pars_vertex:Md,normal_vertex:yd,normalmap_pars_fragment:Sd,clearcoat_normal_fragment_begin:wd,clearcoat_normal_fragment_maps:Ed,clearcoat_pars_fragment:bd,iridescence_pars_fragment:Td,opaque_fragment:Ad,packing:Rd,premultiplied_alpha_fragment:Cd,project_vertex:Pd,dithering_fragment:Ld,dithering_pars_fragment:Dd,roughnessmap_fragment:Id,roughnessmap_pars_fragment:Ud,shadowmap_pars_fragment:Nd,shadowmap_pars_vertex:Fd,shadowmap_vertex:Od,shadowmask_pars_fragment:zd,skinbase_vertex:Bd,skinning_pars_vertex:kd,skinning_vertex:Hd,skinnormal_vertex:Gd,specularmap_fragment:Vd,specularmap_pars_fragment:Wd,tonemapping_fragment:Xd,tonemapping_pars_fragment:qd,transmission_fragment:Yd,transmission_pars_fragment:Kd,uv_pars_fragment:$d,uv_pars_vertex:Zd,uv_vertex:jd,worldpos_vertex:Jd,background_vert:Qd,background_frag:tf,backgroundCube_vert:ef,backgroundCube_frag:nf,cube_vert:sf,cube_frag:rf,depth_vert:af,depth_frag:of,distanceRGBA_vert:lf,distanceRGBA_frag:hf,equirect_vert:cf,equirect_frag:uf,linedashed_vert:df,linedashed_frag:ff,meshbasic_vert:pf,meshbasic_frag:mf,meshlambert_vert:gf,meshlambert_frag:vf,meshmatcap_vert:_f,meshmatcap_frag:xf,meshnormal_vert:Mf,meshnormal_frag:yf,meshphong_vert:Sf,meshphong_frag:wf,meshphysical_vert:Ef,meshphysical_frag:bf,meshtoon_vert:Tf,meshtoon_frag:Af,points_vert:Rf,points_frag:Cf,shadow_vert:Pf,shadow_frag:Lf,sprite_vert:Df,sprite_frag:If},it={common:{diffuse:{value:new Ct(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new zt}},envmap:{envMap:{value:null},envMapRotation:{value:new zt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new zt},normalScale:{value:new nt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ct(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ct(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0},uvTransform:{value:new zt}},sprite:{diffuse:{value:new Ct(16777215)},opacity:{value:1},center:{value:new nt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}}},dn={basic:{uniforms:Ne([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.fog]),vertexShader:kt.meshbasic_vert,fragmentShader:kt.meshbasic_frag},lambert:{uniforms:Ne([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new Ct(0)}}]),vertexShader:kt.meshlambert_vert,fragmentShader:kt.meshlambert_frag},phong:{uniforms:Ne([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new Ct(0)},specular:{value:new Ct(1118481)},shininess:{value:30}}]),vertexShader:kt.meshphong_vert,fragmentShader:kt.meshphong_frag},standard:{uniforms:Ne([it.common,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.roughnessmap,it.metalnessmap,it.fog,it.lights,{emissive:{value:new Ct(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:kt.meshphysical_vert,fragmentShader:kt.meshphysical_frag},toon:{uniforms:Ne([it.common,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.gradientmap,it.fog,it.lights,{emissive:{value:new Ct(0)}}]),vertexShader:kt.meshtoon_vert,fragmentShader:kt.meshtoon_frag},matcap:{uniforms:Ne([it.common,it.bumpmap,it.normalmap,it.displacementmap,it.fog,{matcap:{value:null}}]),vertexShader:kt.meshmatcap_vert,fragmentShader:kt.meshmatcap_frag},points:{uniforms:Ne([it.points,it.fog]),vertexShader:kt.points_vert,fragmentShader:kt.points_frag},dashed:{uniforms:Ne([it.common,it.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:kt.linedashed_vert,fragmentShader:kt.linedashed_frag},depth:{uniforms:Ne([it.common,it.displacementmap]),vertexShader:kt.depth_vert,fragmentShader:kt.depth_frag},normal:{uniforms:Ne([it.common,it.bumpmap,it.normalmap,it.displacementmap,{opacity:{value:1}}]),vertexShader:kt.meshnormal_vert,fragmentShader:kt.meshnormal_frag},sprite:{uniforms:Ne([it.sprite,it.fog]),vertexShader:kt.sprite_vert,fragmentShader:kt.sprite_frag},background:{uniforms:{uvTransform:{value:new zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:kt.background_vert,fragmentShader:kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new zt}},vertexShader:kt.backgroundCube_vert,fragmentShader:kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:kt.cube_vert,fragmentShader:kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:kt.equirect_vert,fragmentShader:kt.equirect_frag},distanceRGBA:{uniforms:Ne([it.common,it.displacementmap,{referencePosition:{value:new E},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:kt.distanceRGBA_vert,fragmentShader:kt.distanceRGBA_frag},shadow:{uniforms:Ne([it.lights,it.fog,{color:{value:new Ct(0)},opacity:{value:1}}]),vertexShader:kt.shadow_vert,fragmentShader:kt.shadow_frag}};dn.physical={uniforms:Ne([dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new zt},clearcoatNormalScale:{value:new nt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new zt},sheen:{value:0},sheenColor:{value:new Ct(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new zt},transmissionSamplerSize:{value:new nt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new zt},attenuationDistance:{value:0},attenuationColor:{value:new Ct(0)},specularColor:{value:new Ct(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new zt},anisotropyVector:{value:new nt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new zt}}]),vertexShader:kt.meshphysical_vert,fragmentShader:kt.meshphysical_frag};const Is={r:0,b:0,g:0},$n=new hn,Uf=new re;function Nf(s,t,e,n,i,r,o){const a=new Ct(0);let l=r===!0?0:1,h,c,u=null,f=0,d=null;function g(S){let T=S.isScene===!0?S.background:null;return T&&T.isTexture&&(T=(S.backgroundBlurriness>0?e:t).get(T)),T}function v(S){let T=!1;const y=g(S);y===null?p(a,l):y&&y.isColor&&(p(y,1),T=!0);const F=s.xr.getEnvironmentBlendMode();F==="additive"?n.buffers.color.setClear(0,0,0,1,o):F==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||T)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(S,T){const y=g(T);y&&(y.isCubeTexture||y.mapping===sr)?(c===void 0&&(c=new P(new ut(1,1,1),new De({name:"BackgroundCubeMaterial",uniforms:Ni(dn.backgroundCube.uniforms),vertexShader:dn.backgroundCube.vertexShader,fragmentShader:dn.backgroundCube.fragmentShader,side:Ie,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(F,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),$n.copy(T.backgroundRotation),$n.x*=-1,$n.y*=-1,$n.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&($n.y*=-1,$n.z*=-1),c.material.uniforms.envMap.value=y,c.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Uf.makeRotationFromEuler($n)),c.material.toneMapped=$t.getTransfer(y.colorSpace)!==ne,(u!==y||f!==y.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,u=y,f=y.version,d=s.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(h===void 0&&(h=new P(new Ht(2,2),new De({name:"BackgroundMaterial",uniforms:Ni(dn.background.uniforms),vertexShader:dn.background.vertexShader,fragmentShader:dn.background.fragmentShader,side:Gn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(h)),h.material.uniforms.t2D.value=y,h.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,h.material.toneMapped=$t.getTransfer(y.colorSpace)!==ne,y.matrixAutoUpdate===!0&&y.updateMatrix(),h.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||f!==y.version||d!==s.toneMapping)&&(h.material.needsUpdate=!0,u=y,f=y.version,d=s.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null))}function p(S,T){S.getRGB(Is,rh(s)),n.buffers.color.setClear(Is.r,Is.g,Is.b,T,o)}return{getClearColor:function(){return a},setClearColor:function(S,T=1){a.set(S),l=T,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(S){l=S,p(a,l)},render:v,addToRenderList:m}}function Ff(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=f(null);let r=i,o=!1;function a(M,C,H,k,X){let Z=!1;const W=u(k,H,C);r!==W&&(r=W,h(r.object)),Z=d(M,k,H,X),Z&&g(M,k,H,X),X!==null&&t.update(X,s.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,y(M,C,H,k),X!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(X).buffer))}function l(){return s.createVertexArray()}function h(M){return s.bindVertexArray(M)}function c(M){return s.deleteVertexArray(M)}function u(M,C,H){const k=H.wireframe===!0;let X=n[M.id];X===void 0&&(X={},n[M.id]=X);let Z=X[C.id];Z===void 0&&(Z={},X[C.id]=Z);let W=Z[k];return W===void 0&&(W=f(l()),Z[k]=W),W}function f(M){const C=[],H=[],k=[];for(let X=0;X<e;X++)C[X]=0,H[X]=0,k[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:H,attributeDivisors:k,object:M,attributes:{},index:null}}function d(M,C,H,k){const X=r.attributes,Z=C.attributes;let W=0;const J=H.getAttributes();for(const V in J)if(J[V].location>=0){const ft=X[V];let Et=Z[V];if(Et===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(Et=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(Et=M.instanceColor)),ft===void 0||ft.attribute!==Et||Et&&ft.data!==Et.data)return!0;W++}return r.attributesNum!==W||r.index!==k}function g(M,C,H,k){const X={},Z=C.attributes;let W=0;const J=H.getAttributes();for(const V in J)if(J[V].location>=0){let ft=Z[V];ft===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(ft=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(ft=M.instanceColor));const Et={};Et.attribute=ft,ft&&ft.data&&(Et.data=ft.data),X[V]=Et,W++}r.attributes=X,r.attributesNum=W,r.index=k}function v(){const M=r.newAttributes;for(let C=0,H=M.length;C<H;C++)M[C]=0}function m(M){p(M,0)}function p(M,C){const H=r.newAttributes,k=r.enabledAttributes,X=r.attributeDivisors;H[M]=1,k[M]===0&&(s.enableVertexAttribArray(M),k[M]=1),X[M]!==C&&(s.vertexAttribDivisor(M,C),X[M]=C)}function S(){const M=r.newAttributes,C=r.enabledAttributes;for(let H=0,k=C.length;H<k;H++)C[H]!==M[H]&&(s.disableVertexAttribArray(H),C[H]=0)}function T(M,C,H,k,X,Z,W){W===!0?s.vertexAttribIPointer(M,C,H,X,Z):s.vertexAttribPointer(M,C,H,k,X,Z)}function y(M,C,H,k){v();const X=k.attributes,Z=H.getAttributes(),W=C.defaultAttributeValues;for(const J in Z){const V=Z[J];if(V.location>=0){let rt=X[J];if(rt===void 0&&(J==="instanceMatrix"&&M.instanceMatrix&&(rt=M.instanceMatrix),J==="instanceColor"&&M.instanceColor&&(rt=M.instanceColor)),rt!==void 0){const ft=rt.normalized,Et=rt.itemSize,Wt=t.get(rt);if(Wt===void 0)continue;const oe=Wt.buffer,Y=Wt.type,et=Wt.bytesPerElement,yt=Y===s.INT||Y===s.UNSIGNED_INT||rt.gpuType===Ba;if(rt.isInterleavedBufferAttribute){const at=rt.data,Pt=at.stride,Ut=rt.offset;if(at.isInstancedInterleavedBuffer){for(let Xt=0;Xt<V.locationSize;Xt++)p(V.location+Xt,at.meshPerAttribute);M.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Xt=0;Xt<V.locationSize;Xt++)m(V.location+Xt);s.bindBuffer(s.ARRAY_BUFFER,oe);for(let Xt=0;Xt<V.locationSize;Xt++)T(V.location+Xt,Et/V.locationSize,Y,ft,Pt*et,(Ut+Et/V.locationSize*Xt)*et,yt)}else{if(rt.isInstancedBufferAttribute){for(let at=0;at<V.locationSize;at++)p(V.location+at,rt.meshPerAttribute);M.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let at=0;at<V.locationSize;at++)m(V.location+at);s.bindBuffer(s.ARRAY_BUFFER,oe);for(let at=0;at<V.locationSize;at++)T(V.location+at,Et/V.locationSize,Y,ft,Et*et,Et/V.locationSize*at*et,yt)}}else if(W!==void 0){const ft=W[J];if(ft!==void 0)switch(ft.length){case 2:s.vertexAttrib2fv(V.location,ft);break;case 3:s.vertexAttrib3fv(V.location,ft);break;case 4:s.vertexAttrib4fv(V.location,ft);break;default:s.vertexAttrib1fv(V.location,ft)}}}}S()}function F(){D();for(const M in n){const C=n[M];for(const H in C){const k=C[H];for(const X in k)c(k[X].object),delete k[X];delete C[H]}delete n[M]}}function A(M){if(n[M.id]===void 0)return;const C=n[M.id];for(const H in C){const k=C[H];for(const X in k)c(k[X].object),delete k[X];delete C[H]}delete n[M.id]}function R(M){for(const C in n){const H=n[C];if(H[M.id]===void 0)continue;const k=H[M.id];for(const X in k)c(k[X].object),delete k[X];delete H[M.id]}}function D(){w(),o=!0,r!==i&&(r=i,h(r.object))}function w(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:D,resetDefaultState:w,dispose:F,releaseStatesOfGeometry:A,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:m,disableUnusedAttributes:S}}function Of(s,t,e){let n;function i(h){n=h}function r(h,c){s.drawArrays(n,h,c),e.update(c,n,1)}function o(h,c,u){u!==0&&(s.drawArraysInstanced(n,h,c,u),e.update(c,n,u))}function a(h,c,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,h,0,c,0,u);let d=0;for(let g=0;g<u;g++)d+=c[g];e.update(d,n,1)}function l(h,c,u,f){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<h.length;g++)o(h[g],c[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(n,h,0,c,0,f,0,u);let g=0;for(let v=0;v<u;v++)g+=c[v]*f[v];e.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function zf(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(R){return!(R!==rn&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const D=R===An&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==Pn&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==wn&&!D)}function l(R){if(R==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=e.precision!==void 0?e.precision:"highp";const c=l(h);c!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",c,"instead."),h=c);const u=e.logarithmicDepthBuffer===!0,f=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),S=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),T=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),F=g>0,A=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:h,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:T,maxFragmentUniforms:y,vertexTextures:F,maxSamples:A}}function Bf(s){const t=this;let e=null,n=0,i=!1,r=!1;const o=new Jn,a=new zt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||i;return i=f,n=u.length,d},this.beginShadows=function(){r=!0,c(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=c(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?c(null):h();else{const S=r?0:n,T=S*4;let y=p.clippingState||null;l.value=y,y=c(g,f,T,d);for(let F=0;F!==T;++F)y[F]=e[F];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function h(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function c(u,f,d,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=d+v*4,S=f.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let T=0,y=d;T!==v;++T,y+=4)o.copy(u[T]).applyMatrix4(S,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function kf(s){let t=new WeakMap;function e(o,a){return a===ea?o.mapping=Pi:a===na&&(o.mapping=Li),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===ea||a===na)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const h=new Zc(l.height);return h.fromEquirectangularTexture(s,o),t.set(o,h),o.addEventListener("dispose",i),e(h.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Ka extends ah{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,o=r+h*this.view.width,a-=c*this.view.offsetY,l=a-c*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ti=4,zo=[.125,.215,.35,.446,.526,.582],ei=20,Lr=new Ka,Bo=new Ct;let Dr=null,Ir=0,Ur=0,Nr=!1;const Qn=(1+Math.sqrt(5))/2,xi=1/Qn,ko=[new E(-Qn,xi,0),new E(Qn,xi,0),new E(-xi,0,Qn),new E(xi,0,Qn),new E(0,Qn,-xi),new E(0,Qn,xi),new E(-1,1,-1),new E(1,1,-1),new E(-1,1,1),new E(1,1,1)];class La{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){Dr=this._renderer.getRenderTarget(),Ir=this._renderer.getActiveCubeFace(),Ur=this._renderer.getActiveMipmapLevel(),Nr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Go(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Dr,Ir,Ur),this._renderer.xr.enabled=Nr,t.scissorTest=!1,Us(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Pi||t.mapping===Li?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Dr=this._renderer.getRenderTarget(),Ir=this._renderer.getActiveCubeFace(),Ur=this._renderer.getActiveMipmapLevel(),Nr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:fn,minFilter:fn,generateMipmaps:!1,type:An,format:rn,colorSpace:zi,depthBuffer:!1},i=Ho(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ho(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Hf(r)),this._blurMaterial=Gf(r,t,e)}return i}_compileMaterial(t){const e=new P(this._lodPlanes[0],t);this._renderer.compile(e,Lr)}_sceneToCubeUV(t,e,n,i){const a=new ke(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],c=this._renderer,u=c.autoClear,f=c.toneMapping;c.getClearColor(Bo),c.toneMapping=Hn,c.autoClear=!1;const d=new bt({name:"PMREM.Background",side:Ie,depthWrite:!1,depthTest:!1}),g=new P(new ut,d);let v=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,v=!0):(d.color.copy(Bo),v=!0);for(let p=0;p<6;p++){const S=p%3;S===0?(a.up.set(0,l[p],0),a.lookAt(h[p],0,0)):S===1?(a.up.set(0,0,l[p]),a.lookAt(0,h[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,h[p]));const T=this._cubeSize;Us(i,S*T,p>2?T:0,T,T),c.setRenderTarget(i),v&&c.render(g,a),c.render(t,a)}g.geometry.dispose(),g.material.dispose(),c.toneMapping=f,c.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Pi||t.mapping===Li;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vo()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Go());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new P(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;Us(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Lr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=ko[(i-r-1)%ko.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){const l=this._renderer,h=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const c=3,u=new P(this._lodPlanes[i],h),f=h.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*ei-1),v=r/g,m=isFinite(r)?1+Math.floor(c*v):ei;m>ei&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ei}`);const p=[];let S=0;for(let R=0;R<ei;++R){const D=R/v,w=Math.exp(-D*D/2);p.push(w),R===0?S+=w:R<m&&(S+=2*w)}for(let R=0;R<p.length;R++)p[R]=p[R]/S;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:T}=this;f.dTheta.value=g,f.mipInt.value=T-n;const y=this._sizeLods[i],F=3*y*(i>T-Ti?i-T+Ti:0),A=4*(this._cubeSize-y);Us(e,F,A,3*y,2*y),l.setRenderTarget(e),l.render(u,Lr)}}function Hf(s){const t=[],e=[],n=[];let i=s;const r=s-Ti+1+zo.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);e.push(a);let l=1/a;o>s-Ti?l=zo[o-s+Ti-1]:o===0&&(l=0),n.push(l);const h=1/(a-2),c=-h,u=1+h,f=[c,c,u,c,u,u,c,c,u,u,c,u],d=6,g=6,v=3,m=2,p=1,S=new Float32Array(v*g*d),T=new Float32Array(m*g*d),y=new Float32Array(p*g*d);for(let A=0;A<d;A++){const R=A%3*2/3-1,D=A>2?0:-1,w=[R,D,0,R+2/3,D,0,R+2/3,D+1,0,R,D,0,R+2/3,D+1,0,R,D+1,0];S.set(w,v*g*A),T.set(f,m*g*A);const M=[A,A,A,A,A,A];y.set(M,p*g*A)}const F=new Te;F.setAttribute("position",new je(S,v)),F.setAttribute("uv",new je(T,m)),F.setAttribute("faceIndex",new je(y,p)),t.push(F),i>Ti&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Ho(s,t,e){const n=new ln(s,t,e);return n.texture.mapping=sr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Us(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function Gf(s,t,e){const n=new Float32Array(ei),i=new E(0,1,0);return new De({name:"SphericalGaussianBlur",defines:{n:ei,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:$a(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function Go(){return new De({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:$a(),fragmentShader:`

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
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function Vo(){return new De({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:$a(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function $a(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Vf(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,h=l===ea||l===na,c=l===Pi||l===Li;if(h||c){let u=t.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return e===null&&(e=new La(s)),u=h?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const d=a.image;return h&&d&&d.height>0||c&&d&&i(d)?(e===null&&(e=new La(s)),u=h?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let l=0;const h=6;for(let c=0;c<h;c++)a[c]!==void 0&&l++;return l===h}function r(a){const l=a.target;l.removeEventListener("dispose",r);const h=t.get(l);h!==void 0&&(t.delete(l),h.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Wf(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&ns("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Xf(s,t,e,n){const i={},r=new WeakMap;function o(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const v=f.morphAttributes[g];for(let m=0,p=v.length;m<p;m++)t.remove(v[m])}f.removeEventListener("dispose",o),delete i[f.id];const d=r.get(f);d&&(t.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return i[f.id]===!0||(f.addEventListener("dispose",o),i[f.id]=!0,e.memory.geometries++),f}function l(u){const f=u.attributes;for(const g in f)t.update(f[g],s.ARRAY_BUFFER);const d=u.morphAttributes;for(const g in d){const v=d[g];for(let m=0,p=v.length;m<p;m++)t.update(v[m],s.ARRAY_BUFFER)}}function h(u){const f=[],d=u.index,g=u.attributes.position;let v=0;if(d!==null){const S=d.array;v=d.version;for(let T=0,y=S.length;T<y;T+=3){const F=S[T+0],A=S[T+1],R=S[T+2];f.push(F,A,A,R,R,F)}}else if(g!==void 0){const S=g.array;v=g.version;for(let T=0,y=S.length/3-1;T<y;T+=3){const F=T+0,A=T+1,R=T+2;f.push(F,A,A,R,R,F)}}else return;const m=new(Ql(f)?sh:ih)(f,1);m.version=v;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function c(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&h(u)}else h(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:c}}function qf(s,t,e){let n;function i(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,d){s.drawElements(n,d,r,f*o),e.update(d,n,1)}function h(f,d,g){g!==0&&(s.drawElementsInstanced(n,d,r,f*o,g),e.update(d,n,g))}function c(f,d,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];e.update(m,n,1)}function u(f,d,g,v){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)h(f[p]/o,d[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,v,0,g);let p=0;for(let S=0;S<g;S++)p+=d[S]*v[S];e.update(p,n,1)}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=h,this.renderMultiDraw=c,this.renderMultiDrawInstances=u}function Yf(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Kf(s,t,e){const n=new WeakMap,i=new se;function r(o,a,l){const h=o.morphTargetInfluences,c=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=c!==void 0?c.length:0;let f=n.get(a);if(f===void 0||f.count!==u){let M=function(){D.dispose(),n.delete(a),a.removeEventListener("dispose",M)};var d=M;f!==void 0&&f.texture.dispose();const g=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],S=a.morphAttributes.normal||[],T=a.morphAttributes.color||[];let y=0;g===!0&&(y=1),v===!0&&(y=2),m===!0&&(y=3);let F=a.attributes.position.count*y,A=1;F>t.maxTextureSize&&(A=Math.ceil(F/t.maxTextureSize),F=t.maxTextureSize);const R=new Float32Array(F*A*4*u),D=new eh(R,F,A,u);D.type=wn,D.needsUpdate=!0;const w=y*4;for(let C=0;C<u;C++){const H=p[C],k=S[C],X=T[C],Z=F*A*4*C;for(let W=0;W<H.count;W++){const J=W*w;g===!0&&(i.fromBufferAttribute(H,W),R[Z+J+0]=i.x,R[Z+J+1]=i.y,R[Z+J+2]=i.z,R[Z+J+3]=0),v===!0&&(i.fromBufferAttribute(k,W),R[Z+J+4]=i.x,R[Z+J+5]=i.y,R[Z+J+6]=i.z,R[Z+J+7]=0),m===!0&&(i.fromBufferAttribute(X,W),R[Z+J+8]=i.x,R[Z+J+9]=i.y,R[Z+J+10]=i.z,R[Z+J+11]=X.itemSize===4?i.w:1)}}f={count:u,texture:D,size:new nt(F,A)},n.set(a,f),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<h.length;m++)g+=h[m];const v=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(s,"morphTargetBaseInfluence",v),l.getUniforms().setValue(s,"morphTargetInfluences",h)}l.getUniforms().setValue(s,"morphTargetsTexture",f.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",f.size)}return{update:r}}function $f(s,t,e,n){let i=new WeakMap;function r(l){const h=n.render.frame,c=l.geometry,u=t.get(l,c);if(i.get(u)!==h&&(t.update(u),i.set(u,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==h&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,h))),l.isSkinnedMesh){const f=l.skeleton;i.get(f)!==h&&(f.update(),i.set(f,h))}return u}function o(){i=new WeakMap}function a(l){const h=l.target;h.removeEventListener("dispose",a),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:o}}class hh extends Oe{constructor(t,e,n,i,r,o,a,l,h,c=Ai){if(c!==Ai&&c!==Ii)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&c===Ai&&(n=si),n===void 0&&c===Ii&&(n=Di),super(null,i,r,o,a,l,c,n,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:on,this.minFilter=l!==void 0?l:on,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const ch=new Oe,Wo=new hh(1,1),uh=new eh,dh=new Nc,fh=new oh,Xo=[],qo=[],Yo=new Float32Array(16),Ko=new Float32Array(9),$o=new Float32Array(4);function Hi(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=Xo[i];if(r===void 0&&(r=new Float32Array(i),Xo[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function Ee(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function be(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function or(s,t){let e=qo[t];e===void 0&&(e=new Int32Array(t),qo[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function Zf(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function jf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;s.uniform2fv(this.addr,t),be(e,t)}}function Jf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ee(e,t))return;s.uniform3fv(this.addr,t),be(e,t)}}function Qf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;s.uniform4fv(this.addr,t),be(e,t)}}function tp(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),be(e,t)}else{if(Ee(e,n))return;$o.set(n),s.uniformMatrix2fv(this.addr,!1,$o),be(e,n)}}function ep(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),be(e,t)}else{if(Ee(e,n))return;Ko.set(n),s.uniformMatrix3fv(this.addr,!1,Ko),be(e,n)}}function np(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),be(e,t)}else{if(Ee(e,n))return;Yo.set(n),s.uniformMatrix4fv(this.addr,!1,Yo),be(e,n)}}function ip(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function sp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;s.uniform2iv(this.addr,t),be(e,t)}}function rp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;s.uniform3iv(this.addr,t),be(e,t)}}function ap(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;s.uniform4iv(this.addr,t),be(e,t)}}function op(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function lp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;s.uniform2uiv(this.addr,t),be(e,t)}}function hp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;s.uniform3uiv(this.addr,t),be(e,t)}}function cp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;s.uniform4uiv(this.addr,t),be(e,t)}}function up(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Wo.compareFunction=Jl,r=Wo):r=ch,e.setTexture2D(t||r,i)}function dp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||dh,i)}function fp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||fh,i)}function pp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||uh,i)}function mp(s){switch(s){case 5126:return Zf;case 35664:return jf;case 35665:return Jf;case 35666:return Qf;case 35674:return tp;case 35675:return ep;case 35676:return np;case 5124:case 35670:return ip;case 35667:case 35671:return sp;case 35668:case 35672:return rp;case 35669:case 35673:return ap;case 5125:return op;case 36294:return lp;case 36295:return hp;case 36296:return cp;case 35678:case 36198:case 36298:case 36306:case 35682:return up;case 35679:case 36299:case 36307:return dp;case 35680:case 36300:case 36308:case 36293:return fp;case 36289:case 36303:case 36311:case 36292:return pp}}function gp(s,t){s.uniform1fv(this.addr,t)}function vp(s,t){const e=Hi(t,this.size,2);s.uniform2fv(this.addr,e)}function _p(s,t){const e=Hi(t,this.size,3);s.uniform3fv(this.addr,e)}function xp(s,t){const e=Hi(t,this.size,4);s.uniform4fv(this.addr,e)}function Mp(s,t){const e=Hi(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function yp(s,t){const e=Hi(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Sp(s,t){const e=Hi(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function wp(s,t){s.uniform1iv(this.addr,t)}function Ep(s,t){s.uniform2iv(this.addr,t)}function bp(s,t){s.uniform3iv(this.addr,t)}function Tp(s,t){s.uniform4iv(this.addr,t)}function Ap(s,t){s.uniform1uiv(this.addr,t)}function Rp(s,t){s.uniform2uiv(this.addr,t)}function Cp(s,t){s.uniform3uiv(this.addr,t)}function Pp(s,t){s.uniform4uiv(this.addr,t)}function Lp(s,t,e){const n=this.cache,i=t.length,r=or(e,i);Ee(n,r)||(s.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||ch,r[o])}function Dp(s,t,e){const n=this.cache,i=t.length,r=or(e,i);Ee(n,r)||(s.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||dh,r[o])}function Ip(s,t,e){const n=this.cache,i=t.length,r=or(e,i);Ee(n,r)||(s.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||fh,r[o])}function Up(s,t,e){const n=this.cache,i=t.length,r=or(e,i);Ee(n,r)||(s.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||uh,r[o])}function Np(s){switch(s){case 5126:return gp;case 35664:return vp;case 35665:return _p;case 35666:return xp;case 35674:return Mp;case 35675:return yp;case 35676:return Sp;case 5124:case 35670:return wp;case 35667:case 35671:return Ep;case 35668:case 35672:return bp;case 35669:case 35673:return Tp;case 5125:return Ap;case 36294:return Rp;case 36295:return Cp;case 36296:return Pp;case 35678:case 36198:case 36298:case 36306:case 35682:return Lp;case 35679:case 36299:case 36307:return Dp;case 35680:case 36300:case 36308:case 36293:return Ip;case 36289:case 36303:case 36311:case 36292:return Up}}class Fp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=mp(e.type)}}class Op{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Np(e.type)}}class zp{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(t,e[a.id],n)}}}const Fr=/(\w+)(\])?(\[|\.)?/g;function Zo(s,t){s.seq.push(t),s.map[t.id]=t}function Bp(s,t,e){const n=s.name,i=n.length;for(Fr.lastIndex=0;;){const r=Fr.exec(n),o=Fr.lastIndex;let a=r[1];const l=r[2]==="]",h=r[3];if(l&&(a=a|0),h===void 0||h==="["&&o+2===i){Zo(e,h===void 0?new Fp(a,s,t):new Op(a,s,t));break}else{let u=e.map[a];u===void 0&&(u=new zp(a),Zo(e,u)),e=u}}}class $s{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);Bp(r,o,this)}}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function jo(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const kp=37297;let Hp=0;function Gp(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Jo=new zt;function Vp(s){$t._getMatrix(Jo,$t.workingColorSpace,s);const t=`mat3( ${Jo.elements.map(e=>e.toFixed(4))} )`;switch($t.getTransfer(s)){case rr:return[t,"LinearTransferOETF"];case ne:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Qo(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+Gp(s.getShaderSource(t),o)}else return i}function Wp(s,t){const e=Vp(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Xp(s,t){let e;switch(t){case Nl:e="Linear";break;case Fl:e="Reinhard";break;case Ol:e="Cineon";break;case za:e="ACESFilmic";break;case zl:e="AgX";break;case Bl:e="Neutral";break;case Qh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ns=new E;function qp(){$t.getLuminanceCoefficients(Ns);const s=Ns.x.toFixed(4),t=Ns.y.toFixed(4),e=Ns.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Yp(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(is).join(`
`)}function Kp(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function $p(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function is(s){return s!==""}function tl(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function el(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Zp=/^[ \t]*#include +<([\w\d./]+)>/gm;function Da(s){return s.replace(Zp,Jp)}const jp=new Map;function Jp(s,t){let e=kt[t];if(e===void 0){const n=jp.get(t);if(n!==void 0)e=kt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Da(e)}const Qp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nl(s){return s.replace(Qp,tm)}function tm(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function il(s){let t=`precision ${s.precision} float;
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
#define LOW_PRECISION`),t}function em(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Dl?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Il?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Sn&&(t="SHADOWMAP_TYPE_VSM"),t}function nm(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Pi:case Li:t="ENVMAP_TYPE_CUBE";break;case sr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function im(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Li:t="ENVMAP_MODE_REFRACTION";break}return t}function sm(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Ul:t="ENVMAP_BLENDING_MULTIPLY";break;case jh:t="ENVMAP_BLENDING_MIX";break;case Jh:t="ENVMAP_BLENDING_ADD";break}return t}function rm(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function am(s,t,e,n){const i=s.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=em(e),h=nm(e),c=im(e),u=sm(e),f=rm(e),d=Yp(e),g=Kp(r),v=i.createProgram();let m,p,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(is).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(is).join(`
`),p.length>0&&(p+=`
`)):(m=[il(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(is).join(`
`),p=[il(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Hn?"#define TONE_MAPPING":"",e.toneMapping!==Hn?kt.tonemapping_pars_fragment:"",e.toneMapping!==Hn?Xp("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",kt.colorspace_pars_fragment,Wp("linearToOutputTexel",e.outputColorSpace),qp(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(is).join(`
`)),o=Da(o),o=tl(o,e),o=el(o,e),a=Da(a),a=tl(a,e),a=el(a,e),o=nl(o),a=nl(a),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===go?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===go?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const T=S+m+o,y=S+p+a,F=jo(i,i.VERTEX_SHADER,T),A=jo(i,i.FRAGMENT_SHADER,y);i.attachShader(v,F),i.attachShader(v,A),e.index0AttributeName!==void 0?i.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function R(C){if(s.debug.checkShaderErrors){const H=i.getProgramInfoLog(v).trim(),k=i.getShaderInfoLog(F).trim(),X=i.getShaderInfoLog(A).trim();let Z=!0,W=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(Z=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,F,A);else{const J=Qo(i,F,"vertex"),V=Qo(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+H+`
`+J+`
`+V)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(k===""||X==="")&&(W=!1);W&&(C.diagnostics={runnable:Z,programLog:H,vertexShader:{log:k,prefix:m},fragmentShader:{log:X,prefix:p}})}i.deleteShader(F),i.deleteShader(A),D=new $s(i,v),w=$p(i,v)}let D;this.getUniforms=function(){return D===void 0&&R(this),D};let w;this.getAttributes=function(){return w===void 0&&R(this),w};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=i.getProgramParameter(v,kp)),M},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Hp++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=F,this.fragmentShader=A,this}let om=0;class lm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new hm(t),e.set(t,n)),n}}class hm{constructor(t){this.id=om++,this.code=t,this.usedTimes=0}}function cm(s,t,e,n,i,r,o){const a=new qa,l=new lm,h=new Set,c=[],u=i.logarithmicDepthBuffer,f=i.vertexTextures;let d=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(w){return h.add(w),w===0?"uv":`uv${w}`}function m(w,M,C,H,k){const X=H.fog,Z=k.geometry,W=w.isMeshStandardMaterial?H.environment:null,J=(w.isMeshStandardMaterial?e:t).get(w.envMap||W),V=J&&J.mapping===sr?J.image.height:null,rt=g[w.type];w.precision!==null&&(d=i.getMaxPrecision(w.precision),d!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",d,"instead."));const ft=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Et=ft!==void 0?ft.length:0;let Wt=0;Z.morphAttributes.position!==void 0&&(Wt=1),Z.morphAttributes.normal!==void 0&&(Wt=2),Z.morphAttributes.color!==void 0&&(Wt=3);let oe,Y,et,yt;if(rt){const ee=dn[rt];oe=ee.vertexShader,Y=ee.fragmentShader}else oe=w.vertexShader,Y=w.fragmentShader,l.update(w),et=l.getVertexShaderID(w),yt=l.getFragmentShaderID(w);const at=s.getRenderTarget(),Pt=s.state.buffers.depth.getReversed(),Ut=k.isInstancedMesh===!0,Xt=k.isBatchedMesh===!0,pe=!!w.map,Zt=!!w.matcap,xe=!!J,N=!!w.aoMap,qe=!!w.lightMap,qt=!!w.bumpMap,Yt=!!w.normalMap,At=!!w.displacementMap,ce=!!w.emissiveMap,Tt=!!w.metalnessMap,b=!!w.roughnessMap,_=w.anisotropy>0,O=w.clearcoat>0,K=w.dispersion>0,j=w.iridescence>0,q=w.sheen>0,St=w.transmission>0,ot=_&&!!w.anisotropyMap,pt=O&&!!w.clearcoatMap,jt=O&&!!w.clearcoatNormalMap,Q=O&&!!w.clearcoatRoughnessMap,mt=j&&!!w.iridescenceMap,Rt=j&&!!w.iridescenceThicknessMap,Lt=q&&!!w.sheenColorMap,gt=q&&!!w.sheenRoughnessMap,Kt=!!w.specularMap,Bt=!!w.specularColorMap,le=!!w.specularIntensityMap,L=St&&!!w.transmissionMap,st=St&&!!w.thicknessMap,G=!!w.gradientMap,$=!!w.alphaMap,ct=w.alphaTest>0,lt=!!w.alphaHash,Ft=!!w.extensions;let ge=Hn;w.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(ge=s.toneMapping);const Ce={shaderID:rt,shaderType:w.type,shaderName:w.name,vertexShader:oe,fragmentShader:Y,defines:w.defines,customVertexShaderID:et,customFragmentShaderID:yt,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:d,batching:Xt,batchingColor:Xt&&k._colorsTexture!==null,instancing:Ut,instancingColor:Ut&&k.instanceColor!==null,instancingMorph:Ut&&k.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:at===null?s.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:zi,alphaToCoverage:!!w.alphaToCoverage,map:pe,matcap:Zt,envMap:xe,envMapMode:xe&&J.mapping,envMapCubeUVHeight:V,aoMap:N,lightMap:qe,bumpMap:qt,normalMap:Yt,displacementMap:f&&At,emissiveMap:ce,normalMapObjectSpace:Yt&&w.normalMapType===ic,normalMapTangentSpace:Yt&&w.normalMapType===jl,metalnessMap:Tt,roughnessMap:b,anisotropy:_,anisotropyMap:ot,clearcoat:O,clearcoatMap:pt,clearcoatNormalMap:jt,clearcoatRoughnessMap:Q,dispersion:K,iridescence:j,iridescenceMap:mt,iridescenceThicknessMap:Rt,sheen:q,sheenColorMap:Lt,sheenRoughnessMap:gt,specularMap:Kt,specularColorMap:Bt,specularIntensityMap:le,transmission:St,transmissionMap:L,thicknessMap:st,gradientMap:G,opaque:w.transparent===!1&&w.blending===ii&&w.alphaToCoverage===!1,alphaMap:$,alphaTest:ct,alphaHash:lt,combine:w.combine,mapUv:pe&&v(w.map.channel),aoMapUv:N&&v(w.aoMap.channel),lightMapUv:qe&&v(w.lightMap.channel),bumpMapUv:qt&&v(w.bumpMap.channel),normalMapUv:Yt&&v(w.normalMap.channel),displacementMapUv:At&&v(w.displacementMap.channel),emissiveMapUv:ce&&v(w.emissiveMap.channel),metalnessMapUv:Tt&&v(w.metalnessMap.channel),roughnessMapUv:b&&v(w.roughnessMap.channel),anisotropyMapUv:ot&&v(w.anisotropyMap.channel),clearcoatMapUv:pt&&v(w.clearcoatMap.channel),clearcoatNormalMapUv:jt&&v(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Q&&v(w.clearcoatRoughnessMap.channel),iridescenceMapUv:mt&&v(w.iridescenceMap.channel),iridescenceThicknessMapUv:Rt&&v(w.iridescenceThicknessMap.channel),sheenColorMapUv:Lt&&v(w.sheenColorMap.channel),sheenRoughnessMapUv:gt&&v(w.sheenRoughnessMap.channel),specularMapUv:Kt&&v(w.specularMap.channel),specularColorMapUv:Bt&&v(w.specularColorMap.channel),specularIntensityMapUv:le&&v(w.specularIntensityMap.channel),transmissionMapUv:L&&v(w.transmissionMap.channel),thicknessMapUv:st&&v(w.thicknessMap.channel),alphaMapUv:$&&v(w.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(Yt||_),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!Z.attributes.uv&&(pe||$),fog:!!X,useFog:w.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Pt,skinning:k.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:Et,morphTextureStride:Wt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:s.shadowMap.enabled&&C.length>0,shadowMapType:s.shadowMap.type,toneMapping:ge,decodeVideoTexture:pe&&w.map.isVideoTexture===!0&&$t.getTransfer(w.map.colorSpace)===ne,decodeVideoTextureEmissive:ce&&w.emissiveMap.isVideoTexture===!0&&$t.getTransfer(w.emissiveMap.colorSpace)===ne,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===ve,flipSided:w.side===Ie,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Ft&&w.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ft&&w.extensions.multiDraw===!0||Xt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Ce.vertexUv1s=h.has(1),Ce.vertexUv2s=h.has(2),Ce.vertexUv3s=h.has(3),h.clear(),Ce}function p(w){const M=[];if(w.shaderID?M.push(w.shaderID):(M.push(w.customVertexShaderID),M.push(w.customFragmentShaderID)),w.defines!==void 0)for(const C in w.defines)M.push(C),M.push(w.defines[C]);return w.isRawShaderMaterial===!1&&(S(M,w),T(M,w),M.push(s.outputColorSpace)),M.push(w.customProgramCacheKey),M.join()}function S(w,M){w.push(M.precision),w.push(M.outputColorSpace),w.push(M.envMapMode),w.push(M.envMapCubeUVHeight),w.push(M.mapUv),w.push(M.alphaMapUv),w.push(M.lightMapUv),w.push(M.aoMapUv),w.push(M.bumpMapUv),w.push(M.normalMapUv),w.push(M.displacementMapUv),w.push(M.emissiveMapUv),w.push(M.metalnessMapUv),w.push(M.roughnessMapUv),w.push(M.anisotropyMapUv),w.push(M.clearcoatMapUv),w.push(M.clearcoatNormalMapUv),w.push(M.clearcoatRoughnessMapUv),w.push(M.iridescenceMapUv),w.push(M.iridescenceThicknessMapUv),w.push(M.sheenColorMapUv),w.push(M.sheenRoughnessMapUv),w.push(M.specularMapUv),w.push(M.specularColorMapUv),w.push(M.specularIntensityMapUv),w.push(M.transmissionMapUv),w.push(M.thicknessMapUv),w.push(M.combine),w.push(M.fogExp2),w.push(M.sizeAttenuation),w.push(M.morphTargetsCount),w.push(M.morphAttributeCount),w.push(M.numDirLights),w.push(M.numPointLights),w.push(M.numSpotLights),w.push(M.numSpotLightMaps),w.push(M.numHemiLights),w.push(M.numRectAreaLights),w.push(M.numDirLightShadows),w.push(M.numPointLightShadows),w.push(M.numSpotLightShadows),w.push(M.numSpotLightShadowsWithMaps),w.push(M.numLightProbes),w.push(M.shadowMapType),w.push(M.toneMapping),w.push(M.numClippingPlanes),w.push(M.numClipIntersection),w.push(M.depthPacking)}function T(w,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),w.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),w.push(a.mask)}function y(w){const M=g[w.type];let C;if(M){const H=dn[M];C=hs.clone(H.uniforms)}else C=w.uniforms;return C}function F(w,M){let C;for(let H=0,k=c.length;H<k;H++){const X=c[H];if(X.cacheKey===M){C=X,++C.usedTimes;break}}return C===void 0&&(C=new am(s,M,w,r),c.push(C)),C}function A(w){if(--w.usedTimes===0){const M=c.indexOf(w);c[M]=c[c.length-1],c.pop(),w.destroy()}}function R(w){l.remove(w)}function D(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:F,releaseProgram:A,releaseShaderCache:R,programs:c,dispose:D}}function um(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function dm(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function sl(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function rl(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(u,f,d,g,v,m){let p=s[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},s[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),t++,p}function a(u,f,d,g,v,m){const p=o(u,f,d,g,v,m);d.transmission>0?n.push(p):d.transparent===!0?i.push(p):e.push(p)}function l(u,f,d,g,v,m){const p=o(u,f,d,g,v,m);d.transmission>0?n.unshift(p):d.transparent===!0?i.unshift(p):e.unshift(p)}function h(u,f){e.length>1&&e.sort(u||dm),n.length>1&&n.sort(f||sl),i.length>1&&i.sort(f||sl)}function c(){for(let u=t,f=s.length;u<f;u++){const d=s[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:c,sort:h}}function fm(){let s=new WeakMap;function t(n,i){const r=s.get(n);let o;return r===void 0?(o=new rl,s.set(n,[o])):i>=r.length?(o=new rl,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function pm(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new E,color:new Ct};break;case"SpotLight":e={position:new E,direction:new E,color:new Ct,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new E,color:new Ct,distance:0,decay:0};break;case"HemisphereLight":e={direction:new E,skyColor:new Ct,groundColor:new Ct};break;case"RectAreaLight":e={color:new Ct,position:new E,halfWidth:new E,halfHeight:new E};break}return s[t.id]=e,e}}}function mm(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let gm=0;function vm(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function _m(s){const t=new pm,e=mm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new E);const i=new E,r=new re,o=new re;function a(h){let c=0,u=0,f=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let d=0,g=0,v=0,m=0,p=0,S=0,T=0,y=0,F=0,A=0,R=0;h.sort(vm);for(let w=0,M=h.length;w<M;w++){const C=h[w],H=C.color,k=C.intensity,X=C.distance,Z=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)c+=H.r*k,u+=H.g*k,f+=H.b*k;else if(C.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(C.sh.coefficients[W],k);R++}else if(C.isDirectionalLight){const W=t.get(C);if(W.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const J=C.shadow,V=e.get(C);V.shadowIntensity=J.intensity,V.shadowBias=J.bias,V.shadowNormalBias=J.normalBias,V.shadowRadius=J.radius,V.shadowMapSize=J.mapSize,n.directionalShadow[d]=V,n.directionalShadowMap[d]=Z,n.directionalShadowMatrix[d]=C.shadow.matrix,S++}n.directional[d]=W,d++}else if(C.isSpotLight){const W=t.get(C);W.position.setFromMatrixPosition(C.matrixWorld),W.color.copy(H).multiplyScalar(k),W.distance=X,W.coneCos=Math.cos(C.angle),W.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),W.decay=C.decay,n.spot[v]=W;const J=C.shadow;if(C.map&&(n.spotLightMap[F]=C.map,F++,J.updateMatrices(C),C.castShadow&&A++),n.spotLightMatrix[v]=J.matrix,C.castShadow){const V=e.get(C);V.shadowIntensity=J.intensity,V.shadowBias=J.bias,V.shadowNormalBias=J.normalBias,V.shadowRadius=J.radius,V.shadowMapSize=J.mapSize,n.spotShadow[v]=V,n.spotShadowMap[v]=Z,y++}v++}else if(C.isRectAreaLight){const W=t.get(C);W.color.copy(H).multiplyScalar(k),W.halfWidth.set(C.width*.5,0,0),W.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=W,m++}else if(C.isPointLight){const W=t.get(C);if(W.color.copy(C.color).multiplyScalar(C.intensity),W.distance=C.distance,W.decay=C.decay,C.castShadow){const J=C.shadow,V=e.get(C);V.shadowIntensity=J.intensity,V.shadowBias=J.bias,V.shadowNormalBias=J.normalBias,V.shadowRadius=J.radius,V.shadowMapSize=J.mapSize,V.shadowCameraNear=J.camera.near,V.shadowCameraFar=J.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=Z,n.pointShadowMatrix[g]=C.shadow.matrix,T++}n.point[g]=W,g++}else if(C.isHemisphereLight){const W=t.get(C);W.skyColor.copy(C.color).multiplyScalar(k),W.groundColor.copy(C.groundColor).multiplyScalar(k),n.hemi[p]=W,p++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=it.LTC_FLOAT_1,n.rectAreaLTC2=it.LTC_FLOAT_2):(n.rectAreaLTC1=it.LTC_HALF_1,n.rectAreaLTC2=it.LTC_HALF_2)),n.ambient[0]=c,n.ambient[1]=u,n.ambient[2]=f;const D=n.hash;(D.directionalLength!==d||D.pointLength!==g||D.spotLength!==v||D.rectAreaLength!==m||D.hemiLength!==p||D.numDirectionalShadows!==S||D.numPointShadows!==T||D.numSpotShadows!==y||D.numSpotMaps!==F||D.numLightProbes!==R)&&(n.directional.length=d,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=y+F-A,n.spotLightMap.length=F,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=R,D.directionalLength=d,D.pointLength=g,D.spotLength=v,D.rectAreaLength=m,D.hemiLength=p,D.numDirectionalShadows=S,D.numPointShadows=T,D.numSpotShadows=y,D.numSpotMaps=F,D.numLightProbes=R,n.version=gm++)}function l(h,c){let u=0,f=0,d=0,g=0,v=0;const m=c.matrixWorldInverse;for(let p=0,S=h.length;p<S;p++){const T=h[p];if(T.isDirectionalLight){const y=n.directional[u];y.direction.setFromMatrixPosition(T.matrixWorld),i.setFromMatrixPosition(T.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),u++}else if(T.isSpotLight){const y=n.spot[d];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(T.matrixWorld),i.setFromMatrixPosition(T.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),d++}else if(T.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(T.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(T.width*.5,0,0),y.halfHeight.set(0,T.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(T.isPointLight){const y=n.point[f];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(m),f++}else if(T.isHemisphereLight){const y=n.hemi[v];y.direction.setFromMatrixPosition(T.matrixWorld),y.direction.transformDirection(m),v++}}}return{setup:a,setupView:l,state:n}}function al(s){const t=new _m(s),e=[],n=[];function i(c){h.camera=c,e.length=0,n.length=0}function r(c){e.push(c)}function o(c){n.push(c)}function a(){t.setup(e)}function l(c){t.setupView(e,c)}const h={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:h,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function xm(s){let t=new WeakMap;function e(i,r=0){const o=t.get(i);let a;return o===void 0?(a=new al(s),t.set(i,[a])):r>=o.length?(a=new al(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class Mm extends Vn{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=ec,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class ym extends Vn{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Sm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,wm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Em(s,t,e){let n=new Ya;const i=new nt,r=new nt,o=new se,a=new Mm({depthPacking:nc}),l=new ym,h={},c=e.maxTextureSize,u={[Gn]:Ie,[Ie]:Gn,[ve]:ve},f=new De({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new nt},radius:{value:4}},vertexShader:Sm,fragmentShader:wm}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new Te;g.setAttribute("position",new je(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new P(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Dl;let p=this.type;this.render=function(A,R,D){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const w=s.getRenderTarget(),M=s.getActiveCubeFace(),C=s.getActiveMipmapLevel(),H=s.state;H.setBlending(Tn),H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);const k=p!==Sn&&this.type===Sn,X=p===Sn&&this.type!==Sn;for(let Z=0,W=A.length;Z<W;Z++){const J=A[Z],V=J.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;i.copy(V.mapSize);const rt=V.getFrameExtents();if(i.multiply(rt),r.copy(V.mapSize),(i.x>c||i.y>c)&&(i.x>c&&(r.x=Math.floor(c/rt.x),i.x=r.x*rt.x,V.mapSize.x=r.x),i.y>c&&(r.y=Math.floor(c/rt.y),i.y=r.y*rt.y,V.mapSize.y=r.y)),V.map===null||k===!0||X===!0){const Et=this.type!==Sn?{minFilter:on,magFilter:on}:{};V.map!==null&&V.map.dispose(),V.map=new ln(i.x,i.y,Et),V.map.texture.name=J.name+".shadowMap",V.camera.updateProjectionMatrix()}s.setRenderTarget(V.map),s.clear();const ft=V.getViewportCount();for(let Et=0;Et<ft;Et++){const Wt=V.getViewport(Et);o.set(r.x*Wt.x,r.y*Wt.y,r.x*Wt.z,r.y*Wt.w),H.viewport(o),V.updateMatrices(J,Et),n=V.getFrustum(),y(R,D,V.camera,J,this.type)}V.isPointLightShadow!==!0&&this.type===Sn&&S(V,D),V.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(w,M,C)};function S(A,R){const D=t.update(v);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,d.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new ln(i.x,i.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,s.setRenderTarget(A.mapPass),s.clear(),s.renderBufferDirect(R,null,D,f,v,null),d.uniforms.shadow_pass.value=A.mapPass.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,s.setRenderTarget(A.map),s.clear(),s.renderBufferDirect(R,null,D,d,v,null)}function T(A,R,D,w){let M=null;const C=D.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(C!==void 0)M=C;else if(M=D.isPointLight===!0?l:a,s.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const H=M.uuid,k=R.uuid;let X=h[H];X===void 0&&(X={},h[H]=X);let Z=X[k];Z===void 0&&(Z=M.clone(),X[k]=Z,R.addEventListener("dispose",F)),M=Z}if(M.visible=R.visible,M.wireframe=R.wireframe,w===Sn?M.side=R.shadowSide!==null?R.shadowSide:R.side:M.side=R.shadowSide!==null?R.shadowSide:u[R.side],M.alphaMap=R.alphaMap,M.alphaTest=R.alphaTest,M.map=R.map,M.clipShadows=R.clipShadows,M.clippingPlanes=R.clippingPlanes,M.clipIntersection=R.clipIntersection,M.displacementMap=R.displacementMap,M.displacementScale=R.displacementScale,M.displacementBias=R.displacementBias,M.wireframeLinewidth=R.wireframeLinewidth,M.linewidth=R.linewidth,D.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const H=s.properties.get(M);H.light=D}return M}function y(A,R,D,w,M){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&M===Sn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,A.matrixWorld);const k=t.update(A),X=A.material;if(Array.isArray(X)){const Z=k.groups;for(let W=0,J=Z.length;W<J;W++){const V=Z[W],rt=X[V.materialIndex];if(rt&&rt.visible){const ft=T(A,rt,w,M);A.onBeforeShadow(s,A,R,D,k,ft,V),s.renderBufferDirect(D,null,k,ft,A,V),A.onAfterShadow(s,A,R,D,k,ft,V)}}}else if(X.visible){const Z=T(A,X,w,M);A.onBeforeShadow(s,A,R,D,k,Z,null),s.renderBufferDirect(D,null,k,Z,A,null),A.onAfterShadow(s,A,R,D,k,Z,null)}}const H=A.children;for(let k=0,X=H.length;k<X;k++)y(H[k],R,D,w,M)}function F(A){A.target.removeEventListener("dispose",F);for(const D in h){const w=h[D],M=A.target.uuid;M in w&&(w[M].dispose(),delete w[M])}}}const bm={[Kr]:$r,[Zr]:Qr,[jr]:ta,[Ci]:Jr,[$r]:Kr,[Qr]:Zr,[ta]:jr,[Jr]:Ci};function Tm(s,t){function e(){let L=!1;const st=new se;let G=null;const $=new se(0,0,0,0);return{setMask:function(ct){G!==ct&&!L&&(s.colorMask(ct,ct,ct,ct),G=ct)},setLocked:function(ct){L=ct},setClear:function(ct,lt,Ft,ge,Ce){Ce===!0&&(ct*=ge,lt*=ge,Ft*=ge),st.set(ct,lt,Ft,ge),$.equals(st)===!1&&(s.clearColor(ct,lt,Ft,ge),$.copy(st))},reset:function(){L=!1,G=null,$.set(-1,0,0,0)}}}function n(){let L=!1,st=!1,G=null,$=null,ct=null;return{setReversed:function(lt){if(st!==lt){const Ft=t.get("EXT_clip_control");st?Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.ZERO_TO_ONE_EXT):Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.NEGATIVE_ONE_TO_ONE_EXT);const ge=ct;ct=null,this.setClear(ge)}st=lt},getReversed:function(){return st},setTest:function(lt){lt?at(s.DEPTH_TEST):Pt(s.DEPTH_TEST)},setMask:function(lt){G!==lt&&!L&&(s.depthMask(lt),G=lt)},setFunc:function(lt){if(st&&(lt=bm[lt]),$!==lt){switch(lt){case Kr:s.depthFunc(s.NEVER);break;case $r:s.depthFunc(s.ALWAYS);break;case Zr:s.depthFunc(s.LESS);break;case Ci:s.depthFunc(s.LEQUAL);break;case jr:s.depthFunc(s.EQUAL);break;case Jr:s.depthFunc(s.GEQUAL);break;case Qr:s.depthFunc(s.GREATER);break;case ta:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}$=lt}},setLocked:function(lt){L=lt},setClear:function(lt){ct!==lt&&(st&&(lt=1-lt),s.clearDepth(lt),ct=lt)},reset:function(){L=!1,G=null,$=null,ct=null,st=!1}}}function i(){let L=!1,st=null,G=null,$=null,ct=null,lt=null,Ft=null,ge=null,Ce=null;return{setTest:function(ee){L||(ee?at(s.STENCIL_TEST):Pt(s.STENCIL_TEST))},setMask:function(ee){st!==ee&&!L&&(s.stencilMask(ee),st=ee)},setFunc:function(ee,Je,mn){(G!==ee||$!==Je||ct!==mn)&&(s.stencilFunc(ee,Je,mn),G=ee,$=Je,ct=mn)},setOp:function(ee,Je,mn){(lt!==ee||Ft!==Je||ge!==mn)&&(s.stencilOp(ee,Je,mn),lt=ee,Ft=Je,ge=mn)},setLocked:function(ee){L=ee},setClear:function(ee){Ce!==ee&&(s.clearStencil(ee),Ce=ee)},reset:function(){L=!1,st=null,G=null,$=null,ct=null,lt=null,Ft=null,ge=null,Ce=null}}}const r=new e,o=new n,a=new i,l=new WeakMap,h=new WeakMap;let c={},u={},f=new WeakMap,d=[],g=null,v=!1,m=null,p=null,S=null,T=null,y=null,F=null,A=null,R=new Ct(0,0,0),D=0,w=!1,M=null,C=null,H=null,k=null,X=null;const Z=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,J=0;const V=s.getParameter(s.VERSION);V.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(V)[1]),W=J>=1):V.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),W=J>=2);let rt=null,ft={};const Et=s.getParameter(s.SCISSOR_BOX),Wt=s.getParameter(s.VIEWPORT),oe=new se().fromArray(Et),Y=new se().fromArray(Wt);function et(L,st,G,$){const ct=new Uint8Array(4),lt=s.createTexture();s.bindTexture(L,lt),s.texParameteri(L,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(L,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ft=0;Ft<G;Ft++)L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY?s.texImage3D(st,0,s.RGBA,1,1,$,0,s.RGBA,s.UNSIGNED_BYTE,ct):s.texImage2D(st+Ft,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,ct);return lt}const yt={};yt[s.TEXTURE_2D]=et(s.TEXTURE_2D,s.TEXTURE_2D,1),yt[s.TEXTURE_CUBE_MAP]=et(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),yt[s.TEXTURE_2D_ARRAY]=et(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),yt[s.TEXTURE_3D]=et(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),at(s.DEPTH_TEST),o.setFunc(Ci),qt(!1),Yt(uo),at(s.CULL_FACE),N(Tn);function at(L){c[L]!==!0&&(s.enable(L),c[L]=!0)}function Pt(L){c[L]!==!1&&(s.disable(L),c[L]=!1)}function Ut(L,st){return u[L]!==st?(s.bindFramebuffer(L,st),u[L]=st,L===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=st),L===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=st),!0):!1}function Xt(L,st){let G=d,$=!1;if(L){G=f.get(st),G===void 0&&(G=[],f.set(st,G));const ct=L.textures;if(G.length!==ct.length||G[0]!==s.COLOR_ATTACHMENT0){for(let lt=0,Ft=ct.length;lt<Ft;lt++)G[lt]=s.COLOR_ATTACHMENT0+lt;G.length=ct.length,$=!0}}else G[0]!==s.BACK&&(G[0]=s.BACK,$=!0);$&&s.drawBuffers(G)}function pe(L){return g!==L?(s.useProgram(L),g=L,!0):!1}const Zt={[ti]:s.FUNC_ADD,[Uh]:s.FUNC_SUBTRACT,[Nh]:s.FUNC_REVERSE_SUBTRACT};Zt[Fh]=s.MIN,Zt[Oh]=s.MAX;const xe={[zh]:s.ZERO,[Bh]:s.ONE,[kh]:s.SRC_COLOR,[qr]:s.SRC_ALPHA,[qh]:s.SRC_ALPHA_SATURATE,[Wh]:s.DST_COLOR,[Gh]:s.DST_ALPHA,[Hh]:s.ONE_MINUS_SRC_COLOR,[Yr]:s.ONE_MINUS_SRC_ALPHA,[Xh]:s.ONE_MINUS_DST_COLOR,[Vh]:s.ONE_MINUS_DST_ALPHA,[Yh]:s.CONSTANT_COLOR,[Kh]:s.ONE_MINUS_CONSTANT_COLOR,[$h]:s.CONSTANT_ALPHA,[Zh]:s.ONE_MINUS_CONSTANT_ALPHA};function N(L,st,G,$,ct,lt,Ft,ge,Ce,ee){if(L===Tn){v===!0&&(Pt(s.BLEND),v=!1);return}if(v===!1&&(at(s.BLEND),v=!0),L!==Ih){if(L!==m||ee!==w){if((p!==ti||y!==ti)&&(s.blendEquation(s.FUNC_ADD),p=ti,y=ti),ee)switch(L){case ii:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case fe:s.blendFunc(s.ONE,s.ONE);break;case fo:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case po:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case ii:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case fe:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case fo:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case po:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}S=null,T=null,F=null,A=null,R.set(0,0,0),D=0,m=L,w=ee}return}ct=ct||st,lt=lt||G,Ft=Ft||$,(st!==p||ct!==y)&&(s.blendEquationSeparate(Zt[st],Zt[ct]),p=st,y=ct),(G!==S||$!==T||lt!==F||Ft!==A)&&(s.blendFuncSeparate(xe[G],xe[$],xe[lt],xe[Ft]),S=G,T=$,F=lt,A=Ft),(ge.equals(R)===!1||Ce!==D)&&(s.blendColor(ge.r,ge.g,ge.b,Ce),R.copy(ge),D=Ce),m=L,w=!1}function qe(L,st){L.side===ve?Pt(s.CULL_FACE):at(s.CULL_FACE);let G=L.side===Ie;st&&(G=!G),qt(G),L.blending===ii&&L.transparent===!1?N(Tn):N(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),o.setFunc(L.depthFunc),o.setTest(L.depthTest),o.setMask(L.depthWrite),r.setMask(L.colorWrite);const $=L.stencilWrite;a.setTest($),$&&(a.setMask(L.stencilWriteMask),a.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),a.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),ce(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?at(s.SAMPLE_ALPHA_TO_COVERAGE):Pt(s.SAMPLE_ALPHA_TO_COVERAGE)}function qt(L){M!==L&&(L?s.frontFace(s.CW):s.frontFace(s.CCW),M=L)}function Yt(L){L!==Lh?(at(s.CULL_FACE),L!==C&&(L===uo?s.cullFace(s.BACK):L===Dh?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Pt(s.CULL_FACE),C=L}function At(L){L!==H&&(W&&s.lineWidth(L),H=L)}function ce(L,st,G){L?(at(s.POLYGON_OFFSET_FILL),(k!==st||X!==G)&&(s.polygonOffset(st,G),k=st,X=G)):Pt(s.POLYGON_OFFSET_FILL)}function Tt(L){L?at(s.SCISSOR_TEST):Pt(s.SCISSOR_TEST)}function b(L){L===void 0&&(L=s.TEXTURE0+Z-1),rt!==L&&(s.activeTexture(L),rt=L)}function _(L,st,G){G===void 0&&(rt===null?G=s.TEXTURE0+Z-1:G=rt);let $=ft[G];$===void 0&&($={type:void 0,texture:void 0},ft[G]=$),($.type!==L||$.texture!==st)&&(rt!==G&&(s.activeTexture(G),rt=G),s.bindTexture(L,st||yt[L]),$.type=L,$.texture=st)}function O(){const L=ft[rt];L!==void 0&&L.type!==void 0&&(s.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function K(){try{s.compressedTexImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function j(){try{s.compressedTexImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function q(){try{s.texSubImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function St(){try{s.texSubImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ot(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function pt(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function jt(){try{s.texStorage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Q(){try{s.texStorage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function mt(){try{s.texImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Rt(){try{s.texImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Lt(L){oe.equals(L)===!1&&(s.scissor(L.x,L.y,L.z,L.w),oe.copy(L))}function gt(L){Y.equals(L)===!1&&(s.viewport(L.x,L.y,L.z,L.w),Y.copy(L))}function Kt(L,st){let G=h.get(st);G===void 0&&(G=new WeakMap,h.set(st,G));let $=G.get(L);$===void 0&&($=s.getUniformBlockIndex(st,L.name),G.set(L,$))}function Bt(L,st){const $=h.get(st).get(L);l.get(st)!==$&&(s.uniformBlockBinding(st,$,L.__bindingPointIndex),l.set(st,$))}function le(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),c={},rt=null,ft={},u={},f=new WeakMap,d=[],g=null,v=!1,m=null,p=null,S=null,T=null,y=null,F=null,A=null,R=new Ct(0,0,0),D=0,w=!1,M=null,C=null,H=null,k=null,X=null,oe.set(0,0,s.canvas.width,s.canvas.height),Y.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:at,disable:Pt,bindFramebuffer:Ut,drawBuffers:Xt,useProgram:pe,setBlending:N,setMaterial:qe,setFlipSided:qt,setCullFace:Yt,setLineWidth:At,setPolygonOffset:ce,setScissorTest:Tt,activeTexture:b,bindTexture:_,unbindTexture:O,compressedTexImage2D:K,compressedTexImage3D:j,texImage2D:mt,texImage3D:Rt,updateUBOMapping:Kt,uniformBlockBinding:Bt,texStorage2D:jt,texStorage3D:Q,texSubImage2D:q,texSubImage3D:St,compressedTexSubImage2D:ot,compressedTexSubImage3D:pt,scissor:Lt,viewport:gt,reset:le}}function ol(s,t,e,n){const i=Am(n);switch(e){case Wl:return s*t;case ql:return s*t;case Yl:return s*t*2;case Kl:return s*t/i.components*i.byteLength;case Ga:return s*t/i.components*i.byteLength;case $l:return s*t*2/i.components*i.byteLength;case Va:return s*t*2/i.components*i.byteLength;case Xl:return s*t*3/i.components*i.byteLength;case rn:return s*t*4/i.components*i.byteLength;case Wa:return s*t*4/i.components*i.byteLength;case Ws:case Xs:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case qs:case Ys:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case ra:case oa:return Math.max(s,16)*Math.max(t,8)/4;case sa:case aa:return Math.max(s,8)*Math.max(t,8)/2;case la:case ha:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case ca:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case ua:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case da:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case fa:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case pa:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case ma:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case ga:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case va:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case _a:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case xa:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Ma:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case ya:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case Sa:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case wa:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case Ea:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case Ks:case ba:case Ta:return Math.ceil(s/4)*Math.ceil(t/4)*16;case Zl:case Aa:return Math.ceil(s/4)*Math.ceil(t/4)*8;case Ra:case Ca:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Am(s){switch(s){case Pn:case Hl:return{byteLength:1,components:1};case ls:case Gl:case An:return{byteLength:2,components:1};case ka:case Ha:return{byteLength:2,components:4};case si:case Ba:case wn:return{byteLength:4,components:1};case Vl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function Rm(s,t,e,n,i,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new nt,c=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(b,_){return d?new OffscreenCanvas(b,_):Js("canvas")}function v(b,_,O){let K=1;const j=Tt(b);if((j.width>O||j.height>O)&&(K=O/Math.max(j.width,j.height)),K<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const q=Math.floor(K*j.width),St=Math.floor(K*j.height);u===void 0&&(u=g(q,St));const ot=_?g(q,St):u;return ot.width=q,ot.height=St,ot.getContext("2d").drawImage(b,0,0,q,St),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+q+"x"+St+")."),ot}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),b;return b}function m(b){return b.generateMipmaps}function p(b){s.generateMipmap(b)}function S(b){return b.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:b.isWebGL3DRenderTarget?s.TEXTURE_3D:b.isWebGLArrayRenderTarget||b.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function T(b,_,O,K,j=!1){if(b!==null){if(s[b]!==void 0)return s[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let q=_;if(_===s.RED&&(O===s.FLOAT&&(q=s.R32F),O===s.HALF_FLOAT&&(q=s.R16F),O===s.UNSIGNED_BYTE&&(q=s.R8)),_===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&(q=s.R8UI),O===s.UNSIGNED_SHORT&&(q=s.R16UI),O===s.UNSIGNED_INT&&(q=s.R32UI),O===s.BYTE&&(q=s.R8I),O===s.SHORT&&(q=s.R16I),O===s.INT&&(q=s.R32I)),_===s.RG&&(O===s.FLOAT&&(q=s.RG32F),O===s.HALF_FLOAT&&(q=s.RG16F),O===s.UNSIGNED_BYTE&&(q=s.RG8)),_===s.RG_INTEGER&&(O===s.UNSIGNED_BYTE&&(q=s.RG8UI),O===s.UNSIGNED_SHORT&&(q=s.RG16UI),O===s.UNSIGNED_INT&&(q=s.RG32UI),O===s.BYTE&&(q=s.RG8I),O===s.SHORT&&(q=s.RG16I),O===s.INT&&(q=s.RG32I)),_===s.RGB_INTEGER&&(O===s.UNSIGNED_BYTE&&(q=s.RGB8UI),O===s.UNSIGNED_SHORT&&(q=s.RGB16UI),O===s.UNSIGNED_INT&&(q=s.RGB32UI),O===s.BYTE&&(q=s.RGB8I),O===s.SHORT&&(q=s.RGB16I),O===s.INT&&(q=s.RGB32I)),_===s.RGBA_INTEGER&&(O===s.UNSIGNED_BYTE&&(q=s.RGBA8UI),O===s.UNSIGNED_SHORT&&(q=s.RGBA16UI),O===s.UNSIGNED_INT&&(q=s.RGBA32UI),O===s.BYTE&&(q=s.RGBA8I),O===s.SHORT&&(q=s.RGBA16I),O===s.INT&&(q=s.RGBA32I)),_===s.RGB&&O===s.UNSIGNED_INT_5_9_9_9_REV&&(q=s.RGB9_E5),_===s.RGBA){const St=j?rr:$t.getTransfer(K);O===s.FLOAT&&(q=s.RGBA32F),O===s.HALF_FLOAT&&(q=s.RGBA16F),O===s.UNSIGNED_BYTE&&(q=St===ne?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT_4_4_4_4&&(q=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&(q=s.RGB5_A1)}return(q===s.R16F||q===s.R32F||q===s.RG16F||q===s.RG32F||q===s.RGBA16F||q===s.RGBA32F)&&t.get("EXT_color_buffer_float"),q}function y(b,_){let O;return b?_===null||_===si||_===Di?O=s.DEPTH24_STENCIL8:_===wn?O=s.DEPTH32F_STENCIL8:_===ls&&(O=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===si||_===Di?O=s.DEPTH_COMPONENT24:_===wn?O=s.DEPTH_COMPONENT32F:_===ls&&(O=s.DEPTH_COMPONENT16),O}function F(b,_){return m(b)===!0||b.isFramebufferTexture&&b.minFilter!==on&&b.minFilter!==fn?Math.log2(Math.max(_.width,_.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?_.mipmaps.length:1}function A(b){const _=b.target;_.removeEventListener("dispose",A),D(_),_.isVideoTexture&&c.delete(_)}function R(b){const _=b.target;_.removeEventListener("dispose",R),M(_)}function D(b){const _=n.get(b);if(_.__webglInit===void 0)return;const O=b.source,K=f.get(O);if(K){const j=K[_.__cacheKey];j.usedTimes--,j.usedTimes===0&&w(b),Object.keys(K).length===0&&f.delete(O)}n.remove(b)}function w(b){const _=n.get(b);s.deleteTexture(_.__webglTexture);const O=b.source,K=f.get(O);delete K[_.__cacheKey],o.memory.textures--}function M(b){const _=n.get(b);if(b.depthTexture&&(b.depthTexture.dispose(),n.remove(b.depthTexture)),b.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(_.__webglFramebuffer[K]))for(let j=0;j<_.__webglFramebuffer[K].length;j++)s.deleteFramebuffer(_.__webglFramebuffer[K][j]);else s.deleteFramebuffer(_.__webglFramebuffer[K]);_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer[K])}else{if(Array.isArray(_.__webglFramebuffer))for(let K=0;K<_.__webglFramebuffer.length;K++)s.deleteFramebuffer(_.__webglFramebuffer[K]);else s.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&s.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let K=0;K<_.__webglColorRenderbuffer.length;K++)_.__webglColorRenderbuffer[K]&&s.deleteRenderbuffer(_.__webglColorRenderbuffer[K]);_.__webglDepthRenderbuffer&&s.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const O=b.textures;for(let K=0,j=O.length;K<j;K++){const q=n.get(O[K]);q.__webglTexture&&(s.deleteTexture(q.__webglTexture),o.memory.textures--),n.remove(O[K])}n.remove(b)}let C=0;function H(){C=0}function k(){const b=C;return b>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+i.maxTextures),C+=1,b}function X(b){const _=[];return _.push(b.wrapS),_.push(b.wrapT),_.push(b.wrapR||0),_.push(b.magFilter),_.push(b.minFilter),_.push(b.anisotropy),_.push(b.internalFormat),_.push(b.format),_.push(b.type),_.push(b.generateMipmaps),_.push(b.premultiplyAlpha),_.push(b.flipY),_.push(b.unpackAlignment),_.push(b.colorSpace),_.join()}function Z(b,_){const O=n.get(b);if(b.isVideoTexture&&At(b),b.isRenderTargetTexture===!1&&b.version>0&&O.__version!==b.version){const K=b.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(O,b,_);return}}e.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+_)}function W(b,_){const O=n.get(b);if(b.version>0&&O.__version!==b.version){Y(O,b,_);return}e.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+_)}function J(b,_){const O=n.get(b);if(b.version>0&&O.__version!==b.version){Y(O,b,_);return}e.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+_)}function V(b,_){const O=n.get(b);if(b.version>0&&O.__version!==b.version){et(O,b,_);return}e.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+_)}const rt={[Zs]:s.REPEAT,[He]:s.CLAMP_TO_EDGE,[ia]:s.MIRRORED_REPEAT},ft={[on]:s.NEAREST,[tc]:s.NEAREST_MIPMAP_NEAREST,[ms]:s.NEAREST_MIPMAP_LINEAR,[fn]:s.LINEAR,[cr]:s.LINEAR_MIPMAP_NEAREST,[ni]:s.LINEAR_MIPMAP_LINEAR},Et={[sc]:s.NEVER,[cc]:s.ALWAYS,[rc]:s.LESS,[Jl]:s.LEQUAL,[ac]:s.EQUAL,[hc]:s.GEQUAL,[oc]:s.GREATER,[lc]:s.NOTEQUAL};function Wt(b,_){if(_.type===wn&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===fn||_.magFilter===cr||_.magFilter===ms||_.magFilter===ni||_.minFilter===fn||_.minFilter===cr||_.minFilter===ms||_.minFilter===ni)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(b,s.TEXTURE_WRAP_S,rt[_.wrapS]),s.texParameteri(b,s.TEXTURE_WRAP_T,rt[_.wrapT]),(b===s.TEXTURE_3D||b===s.TEXTURE_2D_ARRAY)&&s.texParameteri(b,s.TEXTURE_WRAP_R,rt[_.wrapR]),s.texParameteri(b,s.TEXTURE_MAG_FILTER,ft[_.magFilter]),s.texParameteri(b,s.TEXTURE_MIN_FILTER,ft[_.minFilter]),_.compareFunction&&(s.texParameteri(b,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(b,s.TEXTURE_COMPARE_FUNC,Et[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===on||_.minFilter!==ms&&_.minFilter!==ni||_.type===wn&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");s.texParameterf(b,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,i.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function oe(b,_){let O=!1;b.__webglInit===void 0&&(b.__webglInit=!0,_.addEventListener("dispose",A));const K=_.source;let j=f.get(K);j===void 0&&(j={},f.set(K,j));const q=X(_);if(q!==b.__cacheKey){j[q]===void 0&&(j[q]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,O=!0),j[q].usedTimes++;const St=j[b.__cacheKey];St!==void 0&&(j[b.__cacheKey].usedTimes--,St.usedTimes===0&&w(_)),b.__cacheKey=q,b.__webglTexture=j[q].texture}return O}function Y(b,_,O){let K=s.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(K=s.TEXTURE_2D_ARRAY),_.isData3DTexture&&(K=s.TEXTURE_3D);const j=oe(b,_),q=_.source;e.bindTexture(K,b.__webglTexture,s.TEXTURE0+O);const St=n.get(q);if(q.version!==St.__version||j===!0){e.activeTexture(s.TEXTURE0+O);const ot=$t.getPrimaries($t.workingColorSpace),pt=_.colorSpace===kn?null:$t.getPrimaries(_.colorSpace),jt=_.colorSpace===kn||ot===pt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,jt);let Q=v(_.image,!1,i.maxTextureSize);Q=ce(_,Q);const mt=r.convert(_.format,_.colorSpace),Rt=r.convert(_.type);let Lt=T(_.internalFormat,mt,Rt,_.colorSpace,_.isVideoTexture);Wt(K,_);let gt;const Kt=_.mipmaps,Bt=_.isVideoTexture!==!0,le=St.__version===void 0||j===!0,L=q.dataReady,st=F(_,Q);if(_.isDepthTexture)Lt=y(_.format===Ii,_.type),le&&(Bt?e.texStorage2D(s.TEXTURE_2D,1,Lt,Q.width,Q.height):e.texImage2D(s.TEXTURE_2D,0,Lt,Q.width,Q.height,0,mt,Rt,null));else if(_.isDataTexture)if(Kt.length>0){Bt&&le&&e.texStorage2D(s.TEXTURE_2D,st,Lt,Kt[0].width,Kt[0].height);for(let G=0,$=Kt.length;G<$;G++)gt=Kt[G],Bt?L&&e.texSubImage2D(s.TEXTURE_2D,G,0,0,gt.width,gt.height,mt,Rt,gt.data):e.texImage2D(s.TEXTURE_2D,G,Lt,gt.width,gt.height,0,mt,Rt,gt.data);_.generateMipmaps=!1}else Bt?(le&&e.texStorage2D(s.TEXTURE_2D,st,Lt,Q.width,Q.height),L&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,Q.width,Q.height,mt,Rt,Q.data)):e.texImage2D(s.TEXTURE_2D,0,Lt,Q.width,Q.height,0,mt,Rt,Q.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Bt&&le&&e.texStorage3D(s.TEXTURE_2D_ARRAY,st,Lt,Kt[0].width,Kt[0].height,Q.depth);for(let G=0,$=Kt.length;G<$;G++)if(gt=Kt[G],_.format!==rn)if(mt!==null)if(Bt){if(L)if(_.layerUpdates.size>0){const ct=ol(gt.width,gt.height,_.format,_.type);for(const lt of _.layerUpdates){const Ft=gt.data.subarray(lt*ct/gt.data.BYTES_PER_ELEMENT,(lt+1)*ct/gt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,G,0,0,lt,gt.width,gt.height,1,mt,Ft)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,G,0,0,0,gt.width,gt.height,Q.depth,mt,gt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,G,Lt,gt.width,gt.height,Q.depth,0,gt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Bt?L&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,G,0,0,0,gt.width,gt.height,Q.depth,mt,Rt,gt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,G,Lt,gt.width,gt.height,Q.depth,0,mt,Rt,gt.data)}else{Bt&&le&&e.texStorage2D(s.TEXTURE_2D,st,Lt,Kt[0].width,Kt[0].height);for(let G=0,$=Kt.length;G<$;G++)gt=Kt[G],_.format!==rn?mt!==null?Bt?L&&e.compressedTexSubImage2D(s.TEXTURE_2D,G,0,0,gt.width,gt.height,mt,gt.data):e.compressedTexImage2D(s.TEXTURE_2D,G,Lt,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Bt?L&&e.texSubImage2D(s.TEXTURE_2D,G,0,0,gt.width,gt.height,mt,Rt,gt.data):e.texImage2D(s.TEXTURE_2D,G,Lt,gt.width,gt.height,0,mt,Rt,gt.data)}else if(_.isDataArrayTexture)if(Bt){if(le&&e.texStorage3D(s.TEXTURE_2D_ARRAY,st,Lt,Q.width,Q.height,Q.depth),L)if(_.layerUpdates.size>0){const G=ol(Q.width,Q.height,_.format,_.type);for(const $ of _.layerUpdates){const ct=Q.data.subarray($*G/Q.data.BYTES_PER_ELEMENT,($+1)*G/Q.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,$,Q.width,Q.height,1,mt,Rt,ct)}_.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,mt,Rt,Q.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Lt,Q.width,Q.height,Q.depth,0,mt,Rt,Q.data);else if(_.isData3DTexture)Bt?(le&&e.texStorage3D(s.TEXTURE_3D,st,Lt,Q.width,Q.height,Q.depth),L&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,mt,Rt,Q.data)):e.texImage3D(s.TEXTURE_3D,0,Lt,Q.width,Q.height,Q.depth,0,mt,Rt,Q.data);else if(_.isFramebufferTexture){if(le)if(Bt)e.texStorage2D(s.TEXTURE_2D,st,Lt,Q.width,Q.height);else{let G=Q.width,$=Q.height;for(let ct=0;ct<st;ct++)e.texImage2D(s.TEXTURE_2D,ct,Lt,G,$,0,mt,Rt,null),G>>=1,$>>=1}}else if(Kt.length>0){if(Bt&&le){const G=Tt(Kt[0]);e.texStorage2D(s.TEXTURE_2D,st,Lt,G.width,G.height)}for(let G=0,$=Kt.length;G<$;G++)gt=Kt[G],Bt?L&&e.texSubImage2D(s.TEXTURE_2D,G,0,0,mt,Rt,gt):e.texImage2D(s.TEXTURE_2D,G,Lt,mt,Rt,gt);_.generateMipmaps=!1}else if(Bt){if(le){const G=Tt(Q);e.texStorage2D(s.TEXTURE_2D,st,Lt,G.width,G.height)}L&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,mt,Rt,Q)}else e.texImage2D(s.TEXTURE_2D,0,Lt,mt,Rt,Q);m(_)&&p(K),St.__version=q.version,_.onUpdate&&_.onUpdate(_)}b.__version=_.version}function et(b,_,O){if(_.image.length!==6)return;const K=oe(b,_),j=_.source;e.bindTexture(s.TEXTURE_CUBE_MAP,b.__webglTexture,s.TEXTURE0+O);const q=n.get(j);if(j.version!==q.__version||K===!0){e.activeTexture(s.TEXTURE0+O);const St=$t.getPrimaries($t.workingColorSpace),ot=_.colorSpace===kn?null:$t.getPrimaries(_.colorSpace),pt=_.colorSpace===kn||St===ot?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt);const jt=_.isCompressedTexture||_.image[0].isCompressedTexture,Q=_.image[0]&&_.image[0].isDataTexture,mt=[];for(let $=0;$<6;$++)!jt&&!Q?mt[$]=v(_.image[$],!0,i.maxCubemapSize):mt[$]=Q?_.image[$].image:_.image[$],mt[$]=ce(_,mt[$]);const Rt=mt[0],Lt=r.convert(_.format,_.colorSpace),gt=r.convert(_.type),Kt=T(_.internalFormat,Lt,gt,_.colorSpace),Bt=_.isVideoTexture!==!0,le=q.__version===void 0||K===!0,L=j.dataReady;let st=F(_,Rt);Wt(s.TEXTURE_CUBE_MAP,_);let G;if(jt){Bt&&le&&e.texStorage2D(s.TEXTURE_CUBE_MAP,st,Kt,Rt.width,Rt.height);for(let $=0;$<6;$++){G=mt[$].mipmaps;for(let ct=0;ct<G.length;ct++){const lt=G[ct];_.format!==rn?Lt!==null?Bt?L&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct,0,0,lt.width,lt.height,Lt,lt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct,Kt,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Bt?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct,0,0,lt.width,lt.height,Lt,gt,lt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct,Kt,lt.width,lt.height,0,Lt,gt,lt.data)}}}else{if(G=_.mipmaps,Bt&&le){G.length>0&&st++;const $=Tt(mt[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,st,Kt,$.width,$.height)}for(let $=0;$<6;$++)if(Q){Bt?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,mt[$].width,mt[$].height,Lt,gt,mt[$].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Kt,mt[$].width,mt[$].height,0,Lt,gt,mt[$].data);for(let ct=0;ct<G.length;ct++){const Ft=G[ct].image[$].image;Bt?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct+1,0,0,Ft.width,Ft.height,Lt,gt,Ft.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct+1,Kt,Ft.width,Ft.height,0,Lt,gt,Ft.data)}}else{Bt?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Lt,gt,mt[$]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Kt,Lt,gt,mt[$]);for(let ct=0;ct<G.length;ct++){const lt=G[ct];Bt?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct+1,0,0,Lt,gt,lt.image[$]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct+1,Kt,Lt,gt,lt.image[$])}}}m(_)&&p(s.TEXTURE_CUBE_MAP),q.__version=j.version,_.onUpdate&&_.onUpdate(_)}b.__version=_.version}function yt(b,_,O,K,j,q){const St=r.convert(O.format,O.colorSpace),ot=r.convert(O.type),pt=T(O.internalFormat,St,ot,O.colorSpace),jt=n.get(_),Q=n.get(O);if(Q.__renderTarget=_,!jt.__hasExternalTextures){const mt=Math.max(1,_.width>>q),Rt=Math.max(1,_.height>>q);j===s.TEXTURE_3D||j===s.TEXTURE_2D_ARRAY?e.texImage3D(j,q,pt,mt,Rt,_.depth,0,St,ot,null):e.texImage2D(j,q,pt,mt,Rt,0,St,ot,null)}e.bindFramebuffer(s.FRAMEBUFFER,b),Yt(_)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,K,j,Q.__webglTexture,0,qt(_)):(j===s.TEXTURE_2D||j>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,K,j,Q.__webglTexture,q),e.bindFramebuffer(s.FRAMEBUFFER,null)}function at(b,_,O){if(s.bindRenderbuffer(s.RENDERBUFFER,b),_.depthBuffer){const K=_.depthTexture,j=K&&K.isDepthTexture?K.type:null,q=y(_.stencilBuffer,j),St=_.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ot=qt(_);Yt(_)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ot,q,_.width,_.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,ot,q,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,q,_.width,_.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,St,s.RENDERBUFFER,b)}else{const K=_.textures;for(let j=0;j<K.length;j++){const q=K[j],St=r.convert(q.format,q.colorSpace),ot=r.convert(q.type),pt=T(q.internalFormat,St,ot,q.colorSpace),jt=qt(_);O&&Yt(_)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,jt,pt,_.width,_.height):Yt(_)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,jt,pt,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,pt,_.width,_.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Pt(b,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,b),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=n.get(_.depthTexture);K.__renderTarget=_,(!K.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),Z(_.depthTexture,0);const j=K.__webglTexture,q=qt(_);if(_.depthTexture.format===Ai)Yt(_)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,j,0,q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,j,0);else if(_.depthTexture.format===Ii)Yt(_)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,j,0,q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function Ut(b){const _=n.get(b),O=b.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==b.depthTexture){const K=b.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),K){const j=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,K.removeEventListener("dispose",j)};K.addEventListener("dispose",j),_.__depthDisposeCallback=j}_.__boundDepthTexture=K}if(b.depthTexture&&!_.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");Pt(_.__webglFramebuffer,b)}else if(O){_.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[K]),_.__webglDepthbuffer[K]===void 0)_.__webglDepthbuffer[K]=s.createRenderbuffer(),at(_.__webglDepthbuffer[K],b,!1);else{const j=b.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,q=_.__webglDepthbuffer[K];s.bindRenderbuffer(s.RENDERBUFFER,q),s.framebufferRenderbuffer(s.FRAMEBUFFER,j,s.RENDERBUFFER,q)}}else if(e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=s.createRenderbuffer(),at(_.__webglDepthbuffer,b,!1);else{const K=b.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,j=_.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,j),s.framebufferRenderbuffer(s.FRAMEBUFFER,K,s.RENDERBUFFER,j)}e.bindFramebuffer(s.FRAMEBUFFER,null)}function Xt(b,_,O){const K=n.get(b);_!==void 0&&yt(K.__webglFramebuffer,b,b.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&Ut(b)}function pe(b){const _=b.texture,O=n.get(b),K=n.get(_);b.addEventListener("dispose",R);const j=b.textures,q=b.isWebGLCubeRenderTarget===!0,St=j.length>1;if(St||(K.__webglTexture===void 0&&(K.__webglTexture=s.createTexture()),K.__version=_.version,o.memory.textures++),q){O.__webglFramebuffer=[];for(let ot=0;ot<6;ot++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[ot]=[];for(let pt=0;pt<_.mipmaps.length;pt++)O.__webglFramebuffer[ot][pt]=s.createFramebuffer()}else O.__webglFramebuffer[ot]=s.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let ot=0;ot<_.mipmaps.length;ot++)O.__webglFramebuffer[ot]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(St)for(let ot=0,pt=j.length;ot<pt;ot++){const jt=n.get(j[ot]);jt.__webglTexture===void 0&&(jt.__webglTexture=s.createTexture(),o.memory.textures++)}if(b.samples>0&&Yt(b)===!1){O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ot=0;ot<j.length;ot++){const pt=j[ot];O.__webglColorRenderbuffer[ot]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[ot]);const jt=r.convert(pt.format,pt.colorSpace),Q=r.convert(pt.type),mt=T(pt.internalFormat,jt,Q,pt.colorSpace,b.isXRRenderTarget===!0),Rt=qt(b);s.renderbufferStorageMultisample(s.RENDERBUFFER,Rt,mt,b.width,b.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ot,s.RENDERBUFFER,O.__webglColorRenderbuffer[ot])}s.bindRenderbuffer(s.RENDERBUFFER,null),b.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),at(O.__webglDepthRenderbuffer,b,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(q){e.bindTexture(s.TEXTURE_CUBE_MAP,K.__webglTexture),Wt(s.TEXTURE_CUBE_MAP,_);for(let ot=0;ot<6;ot++)if(_.mipmaps&&_.mipmaps.length>0)for(let pt=0;pt<_.mipmaps.length;pt++)yt(O.__webglFramebuffer[ot][pt],b,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,pt);else yt(O.__webglFramebuffer[ot],b,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0);m(_)&&p(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(St){for(let ot=0,pt=j.length;ot<pt;ot++){const jt=j[ot],Q=n.get(jt);e.bindTexture(s.TEXTURE_2D,Q.__webglTexture),Wt(s.TEXTURE_2D,jt),yt(O.__webglFramebuffer,b,jt,s.COLOR_ATTACHMENT0+ot,s.TEXTURE_2D,0),m(jt)&&p(s.TEXTURE_2D)}e.unbindTexture()}else{let ot=s.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(ot=b.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(ot,K.__webglTexture),Wt(ot,_),_.mipmaps&&_.mipmaps.length>0)for(let pt=0;pt<_.mipmaps.length;pt++)yt(O.__webglFramebuffer[pt],b,_,s.COLOR_ATTACHMENT0,ot,pt);else yt(O.__webglFramebuffer,b,_,s.COLOR_ATTACHMENT0,ot,0);m(_)&&p(ot),e.unbindTexture()}b.depthBuffer&&Ut(b)}function Zt(b){const _=b.textures;for(let O=0,K=_.length;O<K;O++){const j=_[O];if(m(j)){const q=S(b),St=n.get(j).__webglTexture;e.bindTexture(q,St),p(q),e.unbindTexture()}}}const xe=[],N=[];function qe(b){if(b.samples>0){if(Yt(b)===!1){const _=b.textures,O=b.width,K=b.height;let j=s.COLOR_BUFFER_BIT;const q=b.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,St=n.get(b),ot=_.length>1;if(ot)for(let pt=0;pt<_.length;pt++)e.bindFramebuffer(s.FRAMEBUFFER,St.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,St.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,St.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,St.__webglFramebuffer);for(let pt=0;pt<_.length;pt++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(j|=s.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(j|=s.STENCIL_BUFFER_BIT)),ot){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,St.__webglColorRenderbuffer[pt]);const jt=n.get(_[pt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,jt,0)}s.blitFramebuffer(0,0,O,K,0,0,O,K,j,s.NEAREST),l===!0&&(xe.length=0,N.length=0,xe.push(s.COLOR_ATTACHMENT0+pt),b.depthBuffer&&b.resolveDepthBuffer===!1&&(xe.push(q),N.push(q),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,N)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,xe))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ot)for(let pt=0;pt<_.length;pt++){e.bindFramebuffer(s.FRAMEBUFFER,St.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.RENDERBUFFER,St.__webglColorRenderbuffer[pt]);const jt=n.get(_[pt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,St.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.TEXTURE_2D,jt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,St.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&l){const _=b.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[_])}}}function qt(b){return Math.min(i.maxSamples,b.samples)}function Yt(b){const _=n.get(b);return b.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function At(b){const _=o.render.frame;c.get(b)!==_&&(c.set(b,_),b.update())}function ce(b,_){const O=b.colorSpace,K=b.format,j=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||O!==zi&&O!==kn&&($t.getTransfer(O)===ne?(K!==rn||j!==Pn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),_}function Tt(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(h.width=b.naturalWidth||b.width,h.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(h.width=b.displayWidth,h.height=b.displayHeight):(h.width=b.width,h.height=b.height),h}this.allocateTextureUnit=k,this.resetTextureUnits=H,this.setTexture2D=Z,this.setTexture2DArray=W,this.setTexture3D=J,this.setTextureCube=V,this.rebindTextures=Xt,this.setupRenderTarget=pe,this.updateRenderTargetMipmap=Zt,this.updateMultisampleRenderTarget=qe,this.setupDepthRenderbuffer=Ut,this.setupFrameBufferTexture=yt,this.useMultisampledRTT=Yt}function Cm(s,t){function e(n,i=kn){let r;const o=$t.getTransfer(i);if(n===Pn)return s.UNSIGNED_BYTE;if(n===ka)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Ha)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Vl)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Hl)return s.BYTE;if(n===Gl)return s.SHORT;if(n===ls)return s.UNSIGNED_SHORT;if(n===Ba)return s.INT;if(n===si)return s.UNSIGNED_INT;if(n===wn)return s.FLOAT;if(n===An)return s.HALF_FLOAT;if(n===Wl)return s.ALPHA;if(n===Xl)return s.RGB;if(n===rn)return s.RGBA;if(n===ql)return s.LUMINANCE;if(n===Yl)return s.LUMINANCE_ALPHA;if(n===Ai)return s.DEPTH_COMPONENT;if(n===Ii)return s.DEPTH_STENCIL;if(n===Kl)return s.RED;if(n===Ga)return s.RED_INTEGER;if(n===$l)return s.RG;if(n===Va)return s.RG_INTEGER;if(n===Wa)return s.RGBA_INTEGER;if(n===Ws||n===Xs||n===qs||n===Ys)if(o===ne)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ws)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Xs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===qs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ys)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ws)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Xs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===qs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ys)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===sa||n===ra||n===aa||n===oa)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===sa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ra)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===aa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===oa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===la||n===ha||n===ca)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===la||n===ha)return o===ne?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ca)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ua||n===da||n===fa||n===pa||n===ma||n===ga||n===va||n===_a||n===xa||n===Ma||n===ya||n===Sa||n===wa||n===Ea)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ua)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===da)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===fa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===pa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ma)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ga)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===va)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===_a)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===xa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ma)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ya)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Sa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===wa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ea)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ks||n===ba||n===Ta)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Ks)return o===ne?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ba)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ta)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Zl||n===Aa||n===Ra||n===Ca)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ks)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Aa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ra)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ca)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Di?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}class Pm extends ke{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Vt extends _e{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Lm={type:"move"};class Or{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Vt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Vt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new E,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new E),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Vt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new E,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new E),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){o=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(h,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const c=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],f=c.position.distanceTo(u.position),d=.02,g=.005;h.inputState.pinching&&f>d+g?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&f<=d-g&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Lm)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),h!==null&&(h.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Vt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Dm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Im=`
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

}`;class Um{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const i=new Oe,r=t.properties.get(i);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new De({vertexShader:Dm,fragmentShader:Im,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new P(new Ht(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Nm extends Bi{constructor(t,e){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,h=null,c=null,u=null,f=null,d=null,g=null;const v=new Um,m=e.getContextAttributes();let p=null,S=null;const T=[],y=[],F=new nt;let A=null;const R=new ke;R.viewport=new se;const D=new ke;D.viewport=new se;const w=[R,D],M=new Pm;let C=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let et=T[Y];return et===void 0&&(et=new Or,T[Y]=et),et.getTargetRaySpace()},this.getControllerGrip=function(Y){let et=T[Y];return et===void 0&&(et=new Or,T[Y]=et),et.getGripSpace()},this.getHand=function(Y){let et=T[Y];return et===void 0&&(et=new Or,T[Y]=et),et.getHandSpace()};function k(Y){const et=y.indexOf(Y.inputSource);if(et===-1)return;const yt=T[et];yt!==void 0&&(yt.update(Y.inputSource,Y.frame,h||o),yt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function X(){i.removeEventListener("select",k),i.removeEventListener("selectstart",k),i.removeEventListener("selectend",k),i.removeEventListener("squeeze",k),i.removeEventListener("squeezestart",k),i.removeEventListener("squeezeend",k),i.removeEventListener("end",X),i.removeEventListener("inputsourceschange",Z);for(let Y=0;Y<T.length;Y++){const et=y[Y];et!==null&&(y[Y]=null,T[Y].disconnect(et))}C=null,H=null,v.reset(),t.setRenderTarget(p),d=null,f=null,u=null,i=null,S=null,oe.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(F.width,F.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||o},this.setReferenceSpace=function(Y){h=Y},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(p=t.getRenderTarget(),i.addEventListener("select",k),i.addEventListener("selectstart",k),i.addEventListener("selectend",k),i.addEventListener("squeeze",k),i.addEventListener("squeezestart",k),i.addEventListener("squeezeend",k),i.addEventListener("end",X),i.addEventListener("inputsourceschange",Z),m.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(F),i.renderState.layers===void 0){const et={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(i,e,et),i.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),S=new ln(d.framebufferWidth,d.framebufferHeight,{format:rn,type:Pn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let et=null,yt=null,at=null;m.depth&&(at=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,et=m.stencil?Ii:Ai,yt=m.stencil?Di:si);const Pt={colorFormat:e.RGBA8,depthFormat:at,scaleFactor:r};u=new XRWebGLBinding(i,e),f=u.createProjectionLayer(Pt),i.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),S=new ln(f.textureWidth,f.textureHeight,{format:rn,type:Pn,depthTexture:new hh(f.textureWidth,f.textureHeight,yt,void 0,void 0,void 0,void 0,void 0,void 0,et),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),h=null,o=await i.requestReferenceSpace(a),oe.setContext(i),oe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function Z(Y){for(let et=0;et<Y.removed.length;et++){const yt=Y.removed[et],at=y.indexOf(yt);at>=0&&(y[at]=null,T[at].disconnect(yt))}for(let et=0;et<Y.added.length;et++){const yt=Y.added[et];let at=y.indexOf(yt);if(at===-1){for(let Ut=0;Ut<T.length;Ut++)if(Ut>=y.length){y.push(yt),at=Ut;break}else if(y[Ut]===null){y[Ut]=yt,at=Ut;break}if(at===-1)break}const Pt=T[at];Pt&&Pt.connect(yt)}}const W=new E,J=new E;function V(Y,et,yt){W.setFromMatrixPosition(et.matrixWorld),J.setFromMatrixPosition(yt.matrixWorld);const at=W.distanceTo(J),Pt=et.projectionMatrix.elements,Ut=yt.projectionMatrix.elements,Xt=Pt[14]/(Pt[10]-1),pe=Pt[14]/(Pt[10]+1),Zt=(Pt[9]+1)/Pt[5],xe=(Pt[9]-1)/Pt[5],N=(Pt[8]-1)/Pt[0],qe=(Ut[8]+1)/Ut[0],qt=Xt*N,Yt=Xt*qe,At=at/(-N+qe),ce=At*-N;if(et.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(ce),Y.translateZ(At),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Pt[10]===-1)Y.projectionMatrix.copy(et.projectionMatrix),Y.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{const Tt=Xt+At,b=pe+At,_=qt-ce,O=Yt+(at-ce),K=Zt*pe/b*Tt,j=xe*pe/b*Tt;Y.projectionMatrix.makePerspective(_,O,K,j,Tt,b),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function rt(Y,et){et===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(et.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let et=Y.near,yt=Y.far;v.texture!==null&&(v.depthNear>0&&(et=v.depthNear),v.depthFar>0&&(yt=v.depthFar)),M.near=D.near=R.near=et,M.far=D.far=R.far=yt,(C!==M.near||H!==M.far)&&(i.updateRenderState({depthNear:M.near,depthFar:M.far}),C=M.near,H=M.far),R.layers.mask=Y.layers.mask|2,D.layers.mask=Y.layers.mask|4,M.layers.mask=R.layers.mask|D.layers.mask;const at=Y.parent,Pt=M.cameras;rt(M,at);for(let Ut=0;Ut<Pt.length;Ut++)rt(Pt[Ut],at);Pt.length===2?V(M,R,D):M.projectionMatrix.copy(R.projectionMatrix),ft(Y,M,at)};function ft(Y,et,yt){yt===null?Y.matrix.copy(et.matrixWorld):(Y.matrix.copy(yt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(et.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(et.projectionMatrix),Y.projectionMatrixInverse.copy(et.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Ui*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(Y){l=Y,f!==null&&(f.fixedFoveation=Y),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Y)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let Et=null;function Wt(Y,et){if(c=et.getViewerPose(h||o),g=et,c!==null){const yt=c.views;d!==null&&(t.setRenderTargetFramebuffer(S,d.framebuffer),t.setRenderTarget(S));let at=!1;yt.length!==M.cameras.length&&(M.cameras.length=0,at=!0);for(let Ut=0;Ut<yt.length;Ut++){const Xt=yt[Ut];let pe=null;if(d!==null)pe=d.getViewport(Xt);else{const xe=u.getViewSubImage(f,Xt);pe=xe.viewport,Ut===0&&(t.setRenderTargetTextures(S,xe.colorTexture,f.ignoreDepthValues?void 0:xe.depthStencilTexture),t.setRenderTarget(S))}let Zt=w[Ut];Zt===void 0&&(Zt=new ke,Zt.layers.enable(Ut),Zt.viewport=new se,w[Ut]=Zt),Zt.matrix.fromArray(Xt.transform.matrix),Zt.matrix.decompose(Zt.position,Zt.quaternion,Zt.scale),Zt.projectionMatrix.fromArray(Xt.projectionMatrix),Zt.projectionMatrixInverse.copy(Zt.projectionMatrix).invert(),Zt.viewport.set(pe.x,pe.y,pe.width,pe.height),Ut===0&&(M.matrix.copy(Zt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),at===!0&&M.cameras.push(Zt)}const Pt=i.enabledFeatures;if(Pt&&Pt.includes("depth-sensing")){const Ut=u.getDepthInformation(yt[0]);Ut&&Ut.isValid&&Ut.texture&&v.init(t,Ut,i.renderState)}}for(let yt=0;yt<T.length;yt++){const at=y[yt],Pt=T[yt];at!==null&&Pt!==void 0&&Pt.update(at,et,h||o)}Et&&Et(Y,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),g=null}const oe=new lh;oe.setAnimationLoop(Wt),this.setAnimationLoop=function(Y){Et=Y},this.dispose=function(){}}}const Zn=new hn,Fm=new re;function Om(s,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,rh(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,S,T,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),c(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,y)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,S,T):p.isSpriteMaterial?h(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ie&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ie&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=t.get(p),T=S.envMap,y=S.envMapRotation;T&&(m.envMap.value=T,Zn.copy(y),Zn.x*=-1,Zn.y*=-1,Zn.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Zn.y*=-1,Zn.z*=-1),m.envMapRotation.value.setFromMatrix4(Fm.makeRotationFromEuler(Zn)),m.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,S,T){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=T*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ie&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const S=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function zm(s,t,e,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,T){const y=T.program;n.uniformBlockBinding(S,y)}function h(S,T){let y=i[S.id];y===void 0&&(g(S),y=c(S),i[S.id]=y,S.addEventListener("dispose",m));const F=T.program;n.updateUBOMapping(S,F);const A=t.render.frame;r[S.id]!==A&&(f(S),r[S.id]=A)}function c(S){const T=u();S.__bindingPointIndex=T;const y=s.createBuffer(),F=S.__size,A=S.usage;return s.bindBuffer(s.UNIFORM_BUFFER,y),s.bufferData(s.UNIFORM_BUFFER,F,A),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,T,y),y}function u(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(S){const T=i[S.id],y=S.uniforms,F=S.__cache;s.bindBuffer(s.UNIFORM_BUFFER,T);for(let A=0,R=y.length;A<R;A++){const D=Array.isArray(y[A])?y[A]:[y[A]];for(let w=0,M=D.length;w<M;w++){const C=D[w];if(d(C,A,w,F)===!0){const H=C.__offset,k=Array.isArray(C.value)?C.value:[C.value];let X=0;for(let Z=0;Z<k.length;Z++){const W=k[Z],J=v(W);typeof W=="number"||typeof W=="boolean"?(C.__data[0]=W,s.bufferSubData(s.UNIFORM_BUFFER,H+X,C.__data)):W.isMatrix3?(C.__data[0]=W.elements[0],C.__data[1]=W.elements[1],C.__data[2]=W.elements[2],C.__data[3]=0,C.__data[4]=W.elements[3],C.__data[5]=W.elements[4],C.__data[6]=W.elements[5],C.__data[7]=0,C.__data[8]=W.elements[6],C.__data[9]=W.elements[7],C.__data[10]=W.elements[8],C.__data[11]=0):(W.toArray(C.__data,X),X+=J.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,H,C.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(S,T,y,F){const A=S.value,R=T+"_"+y;if(F[R]===void 0)return typeof A=="number"||typeof A=="boolean"?F[R]=A:F[R]=A.clone(),!0;{const D=F[R];if(typeof A=="number"||typeof A=="boolean"){if(D!==A)return F[R]=A,!0}else if(D.equals(A)===!1)return D.copy(A),!0}return!1}function g(S){const T=S.uniforms;let y=0;const F=16;for(let R=0,D=T.length;R<D;R++){const w=Array.isArray(T[R])?T[R]:[T[R]];for(let M=0,C=w.length;M<C;M++){const H=w[M],k=Array.isArray(H.value)?H.value:[H.value];for(let X=0,Z=k.length;X<Z;X++){const W=k[X],J=v(W),V=y%F,rt=V%J.boundary,ft=V+rt;y+=rt,ft!==0&&F-ft<J.storage&&(y+=F-ft),H.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=y,y+=J.storage}}}const A=y%F;return A>0&&(y+=F-A),S.__size=y,S.__cache={},this}function v(S){const T={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(T.boundary=4,T.storage=4):S.isVector2?(T.boundary=8,T.storage=8):S.isVector3||S.isColor?(T.boundary=16,T.storage=12):S.isVector4?(T.boundary=16,T.storage=16):S.isMatrix3?(T.boundary=48,T.storage=48):S.isMatrix4?(T.boundary=64,T.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),T}function m(S){const T=S.target;T.removeEventListener("dispose",m);const y=o.indexOf(T.__bindingPointIndex);o.splice(y,1),s.deleteBuffer(i[T.id]),delete i[T.id],delete r[T.id]}function p(){for(const S in i)s.deleteBuffer(i[S]);o=[],i={},r={}}return{bind:l,update:h,dispose:p}}class Bm{constructor(t={}){const{canvas:e=Ac(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:h=!1,powerPreference:c="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const S=[],T=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Fe,this.toneMapping=Hn,this.toneMappingExposure=1;const y=this;let F=!1,A=0,R=0,D=null,w=-1,M=null;const C=new se,H=new se;let k=null;const X=new Ct(0);let Z=0,W=e.width,J=e.height,V=1,rt=null,ft=null;const Et=new se(0,0,W,J),Wt=new se(0,0,W,J);let oe=!1;const Y=new Ya;let et=!1,yt=!1;const at=new re,Pt=new re,Ut=new E,Xt=new se,pe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Zt=!1;function xe(){return D===null?V:1}let N=n;function qe(x,I){return e.getContext(x,I)}try{const x={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:h,powerPreference:c,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Oa}`),e.addEventListener("webglcontextlost",$,!1),e.addEventListener("webglcontextrestored",ct,!1),e.addEventListener("webglcontextcreationerror",lt,!1),N===null){const I="webgl2";if(N=qe(I,x),N===null)throw qe(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let qt,Yt,At,ce,Tt,b,_,O,K,j,q,St,ot,pt,jt,Q,mt,Rt,Lt,gt,Kt,Bt,le,L;function st(){qt=new Wf(N),qt.init(),Bt=new Cm(N,qt),Yt=new zf(N,qt,t,Bt),At=new Tm(N,qt),Yt.reverseDepthBuffer&&f&&At.buffers.depth.setReversed(!0),ce=new Yf(N),Tt=new um,b=new Rm(N,qt,At,Tt,Yt,Bt,ce),_=new kf(y),O=new Vf(y),K=new Qc(N),le=new Ff(N,K),j=new Xf(N,K,ce,le),q=new $f(N,j,K,ce),Lt=new Kf(N,Yt,b),Q=new Bf(Tt),St=new cm(y,_,O,qt,Yt,le,Q),ot=new Om(y,Tt),pt=new fm,jt=new xm(qt),Rt=new Nf(y,_,O,At,q,d,l),mt=new Em(y,q,Yt),L=new zm(N,ce,Yt,At),gt=new Of(N,qt,ce),Kt=new qf(N,qt,ce),ce.programs=St.programs,y.capabilities=Yt,y.extensions=qt,y.properties=Tt,y.renderLists=pt,y.shadowMap=mt,y.state=At,y.info=ce}st();const G=new Nm(y,N);this.xr=G,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const x=qt.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){const x=qt.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(x){x!==void 0&&(V=x,this.setSize(W,J,!1))},this.getSize=function(x){return x.set(W,J)},this.setSize=function(x,I,z=!0){if(G.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=x,J=I,e.width=Math.floor(x*V),e.height=Math.floor(I*V),z===!0&&(e.style.width=x+"px",e.style.height=I+"px"),this.setViewport(0,0,x,I)},this.getDrawingBufferSize=function(x){return x.set(W*V,J*V).floor()},this.setDrawingBufferSize=function(x,I,z){W=x,J=I,V=z,e.width=Math.floor(x*z),e.height=Math.floor(I*z),this.setViewport(0,0,x,I)},this.getCurrentViewport=function(x){return x.copy(C)},this.getViewport=function(x){return x.copy(Et)},this.setViewport=function(x,I,z,B){x.isVector4?Et.set(x.x,x.y,x.z,x.w):Et.set(x,I,z,B),At.viewport(C.copy(Et).multiplyScalar(V).round())},this.getScissor=function(x){return x.copy(Wt)},this.setScissor=function(x,I,z,B){x.isVector4?Wt.set(x.x,x.y,x.z,x.w):Wt.set(x,I,z,B),At.scissor(H.copy(Wt).multiplyScalar(V).round())},this.getScissorTest=function(){return oe},this.setScissorTest=function(x){At.setScissorTest(oe=x)},this.setOpaqueSort=function(x){rt=x},this.setTransparentSort=function(x){ft=x},this.getClearColor=function(x){return x.copy(Rt.getClearColor())},this.setClearColor=function(){Rt.setClearColor.apply(Rt,arguments)},this.getClearAlpha=function(){return Rt.getClearAlpha()},this.setClearAlpha=function(){Rt.setClearAlpha.apply(Rt,arguments)},this.clear=function(x=!0,I=!0,z=!0){let B=0;if(x){let U=!1;if(D!==null){const tt=D.texture.format;U=tt===Wa||tt===Va||tt===Ga}if(U){const tt=D.texture.type,ht=tt===Pn||tt===si||tt===ls||tt===Di||tt===ka||tt===Ha,_t=Rt.getClearColor(),xt=Rt.getClearAlpha(),It=_t.r,Ot=_t.g,Mt=_t.b;ht?(g[0]=It,g[1]=Ot,g[2]=Mt,g[3]=xt,N.clearBufferuiv(N.COLOR,0,g)):(v[0]=It,v[1]=Ot,v[2]=Mt,v[3]=xt,N.clearBufferiv(N.COLOR,0,v))}else B|=N.COLOR_BUFFER_BIT}I&&(B|=N.DEPTH_BUFFER_BIT),z&&(B|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",$,!1),e.removeEventListener("webglcontextrestored",ct,!1),e.removeEventListener("webglcontextcreationerror",lt,!1),pt.dispose(),jt.dispose(),Tt.dispose(),_.dispose(),O.dispose(),q.dispose(),le.dispose(),L.dispose(),St.dispose(),G.dispose(),G.removeEventListener("sessionstart",io),G.removeEventListener("sessionend",so),Wn.stop()};function $(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),F=!0}function ct(){console.log("THREE.WebGLRenderer: Context Restored."),F=!1;const x=ce.autoReset,I=mt.enabled,z=mt.autoUpdate,B=mt.needsUpdate,U=mt.type;st(),ce.autoReset=x,mt.enabled=I,mt.autoUpdate=z,mt.needsUpdate=B,mt.type=U}function lt(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function Ft(x){const I=x.target;I.removeEventListener("dispose",Ft),ge(I)}function ge(x){Ce(x),Tt.remove(x)}function Ce(x){const I=Tt.get(x).programs;I!==void 0&&(I.forEach(function(z){St.releaseProgram(z)}),x.isShaderMaterial&&St.releaseShaderCache(x))}this.renderBufferDirect=function(x,I,z,B,U,tt){I===null&&(I=pe);const ht=U.isMesh&&U.matrixWorld.determinant()<0,_t=Rh(x,I,z,B,U);At.setMaterial(B,ht);let xt=z.index,It=1;if(B.wireframe===!0){if(xt=j.getWireframeAttribute(z),xt===void 0)return;It=2}const Ot=z.drawRange,Mt=z.attributes.position;let Jt=Ot.start*It,he=(Ot.start+Ot.count)*It;tt!==null&&(Jt=Math.max(Jt,tt.start*It),he=Math.min(he,(tt.start+tt.count)*It)),xt!==null?(Jt=Math.max(Jt,0),he=Math.min(he,xt.count)):Mt!=null&&(Jt=Math.max(Jt,0),he=Math.min(he,Mt.count));const ue=he-Jt;if(ue<0||ue===1/0)return;le.setup(U,B,_t,z,xt);let ze,Qt=gt;if(xt!==null&&(ze=K.get(xt),Qt=Kt,Qt.setIndex(ze)),U.isMesh)B.wireframe===!0?(At.setLineWidth(B.wireframeLinewidth*xe()),Qt.setMode(N.LINES)):Qt.setMode(N.TRIANGLES);else if(U.isLine){let wt=B.linewidth;wt===void 0&&(wt=1),At.setLineWidth(wt*xe()),U.isLineSegments?Qt.setMode(N.LINES):U.isLineLoop?Qt.setMode(N.LINE_LOOP):Qt.setMode(N.LINE_STRIP)}else U.isPoints?Qt.setMode(N.POINTS):U.isSprite&&Qt.setMode(N.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)Qt.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(qt.get("WEBGL_multi_draw"))Qt.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const wt=U._multiDrawStarts,gn=U._multiDrawCounts,te=U._multiDrawCount,Qe=xt?K.get(xt).bytesPerElement:1,ri=Tt.get(B).currentProgram.getUniforms();for(let Ge=0;Ge<te;Ge++)ri.setValue(N,"_gl_DrawID",Ge),Qt.render(wt[Ge]/Qe,gn[Ge])}else if(U.isInstancedMesh)Qt.renderInstances(Jt,ue,U.count);else if(z.isInstancedBufferGeometry){const wt=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,gn=Math.min(z.instanceCount,wt);Qt.renderInstances(Jt,ue,gn)}else Qt.render(Jt,ue)};function ee(x,I,z){x.transparent===!0&&x.side===ve&&x.forceSinglePass===!1?(x.side=Ie,x.needsUpdate=!0,ps(x,I,z),x.side=Gn,x.needsUpdate=!0,ps(x,I,z),x.side=ve):ps(x,I,z)}this.compile=function(x,I,z=null){z===null&&(z=x),p=jt.get(z),p.init(I),T.push(p),z.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),x!==z&&x.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),p.setupLights();const B=new Set;return x.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const tt=U.material;if(tt)if(Array.isArray(tt))for(let ht=0;ht<tt.length;ht++){const _t=tt[ht];ee(_t,z,U),B.add(_t)}else ee(tt,z,U),B.add(tt)}),T.pop(),p=null,B},this.compileAsync=function(x,I,z=null){const B=this.compile(x,I,z);return new Promise(U=>{function tt(){if(B.forEach(function(ht){Tt.get(ht).currentProgram.isReady()&&B.delete(ht)}),B.size===0){U(x);return}setTimeout(tt,10)}qt.get("KHR_parallel_shader_compile")!==null?tt():setTimeout(tt,10)})};let Je=null;function mn(x){Je&&Je(x)}function io(){Wn.stop()}function so(){Wn.start()}const Wn=new lh;Wn.setAnimationLoop(mn),typeof self<"u"&&Wn.setContext(self),this.setAnimationLoop=function(x){Je=x,G.setAnimationLoop(x),x===null?Wn.stop():Wn.start()},G.addEventListener("sessionstart",io),G.addEventListener("sessionend",so),this.render=function(x,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),G.enabled===!0&&G.isPresenting===!0&&(G.cameraAutoUpdate===!0&&G.updateCamera(I),I=G.getCamera()),x.isScene===!0&&x.onBeforeRender(y,x,I,D),p=jt.get(x,T.length),p.init(I),T.push(p),Pt.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),Y.setFromProjectionMatrix(Pt),yt=this.localClippingEnabled,et=Q.init(this.clippingPlanes,yt),m=pt.get(x,S.length),m.init(),S.push(m),G.enabled===!0&&G.isPresenting===!0){const tt=y.xr.getDepthSensingMesh();tt!==null&&hr(tt,I,-1/0,y.sortObjects)}hr(x,I,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(rt,ft),Zt=G.enabled===!1||G.isPresenting===!1||G.hasDepthSensing()===!1,Zt&&Rt.addToRenderList(m,x),this.info.render.frame++,et===!0&&Q.beginShadows();const z=p.state.shadowsArray;mt.render(z,x,I),et===!0&&Q.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=m.opaque,U=m.transmissive;if(p.setupLights(),I.isArrayCamera){const tt=I.cameras;if(U.length>0)for(let ht=0,_t=tt.length;ht<_t;ht++){const xt=tt[ht];ao(B,U,x,xt)}Zt&&Rt.render(x);for(let ht=0,_t=tt.length;ht<_t;ht++){const xt=tt[ht];ro(m,x,xt,xt.viewport)}}else U.length>0&&ao(B,U,x,I),Zt&&Rt.render(x),ro(m,x,I);D!==null&&(b.updateMultisampleRenderTarget(D),b.updateRenderTargetMipmap(D)),x.isScene===!0&&x.onAfterRender(y,x,I),le.resetDefaultState(),w=-1,M=null,T.pop(),T.length>0?(p=T[T.length-1],et===!0&&Q.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function hr(x,I,z,B){if(x.visible===!1)return;if(x.layers.test(I.layers)){if(x.isGroup)z=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(I);else if(x.isLight)p.pushLight(x),x.castShadow&&p.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||Y.intersectsSprite(x)){B&&Xt.setFromMatrixPosition(x.matrixWorld).applyMatrix4(Pt);const ht=q.update(x),_t=x.material;_t.visible&&m.push(x,ht,_t,z,Xt.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||Y.intersectsObject(x))){const ht=q.update(x),_t=x.material;if(B&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),Xt.copy(x.boundingSphere.center)):(ht.boundingSphere===null&&ht.computeBoundingSphere(),Xt.copy(ht.boundingSphere.center)),Xt.applyMatrix4(x.matrixWorld).applyMatrix4(Pt)),Array.isArray(_t)){const xt=ht.groups;for(let It=0,Ot=xt.length;It<Ot;It++){const Mt=xt[It],Jt=_t[Mt.materialIndex];Jt&&Jt.visible&&m.push(x,ht,Jt,z,Xt.z,Mt)}}else _t.visible&&m.push(x,ht,_t,z,Xt.z,null)}}const tt=x.children;for(let ht=0,_t=tt.length;ht<_t;ht++)hr(tt[ht],I,z,B)}function ro(x,I,z,B){const U=x.opaque,tt=x.transmissive,ht=x.transparent;p.setupLightsView(z),et===!0&&Q.setGlobalState(y.clippingPlanes,z),B&&At.viewport(C.copy(B)),U.length>0&&fs(U,I,z),tt.length>0&&fs(tt,I,z),ht.length>0&&fs(ht,I,z),At.buffers.depth.setTest(!0),At.buffers.depth.setMask(!0),At.buffers.color.setMask(!0),At.setPolygonOffset(!1)}function ao(x,I,z,B){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[B.id]===void 0&&(p.state.transmissionRenderTarget[B.id]=new ln(1,1,{generateMipmaps:!0,type:qt.has("EXT_color_buffer_half_float")||qt.has("EXT_color_buffer_float")?An:Pn,minFilter:ni,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$t.workingColorSpace}));const tt=p.state.transmissionRenderTarget[B.id],ht=B.viewport||C;tt.setSize(ht.z,ht.w);const _t=y.getRenderTarget();y.setRenderTarget(tt),y.getClearColor(X),Z=y.getClearAlpha(),Z<1&&y.setClearColor(16777215,.5),y.clear(),Zt&&Rt.render(z);const xt=y.toneMapping;y.toneMapping=Hn;const It=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),p.setupLightsView(B),et===!0&&Q.setGlobalState(y.clippingPlanes,B),fs(x,z,B),b.updateMultisampleRenderTarget(tt),b.updateRenderTargetMipmap(tt),qt.has("WEBGL_multisampled_render_to_texture")===!1){let Ot=!1;for(let Mt=0,Jt=I.length;Mt<Jt;Mt++){const he=I[Mt],ue=he.object,ze=he.geometry,Qt=he.material,wt=he.group;if(Qt.side===ve&&ue.layers.test(B.layers)){const gn=Qt.side;Qt.side=Ie,Qt.needsUpdate=!0,oo(ue,z,B,ze,Qt,wt),Qt.side=gn,Qt.needsUpdate=!0,Ot=!0}}Ot===!0&&(b.updateMultisampleRenderTarget(tt),b.updateRenderTargetMipmap(tt))}y.setRenderTarget(_t),y.setClearColor(X,Z),It!==void 0&&(B.viewport=It),y.toneMapping=xt}function fs(x,I,z){const B=I.isScene===!0?I.overrideMaterial:null;for(let U=0,tt=x.length;U<tt;U++){const ht=x[U],_t=ht.object,xt=ht.geometry,It=B===null?ht.material:B,Ot=ht.group;_t.layers.test(z.layers)&&oo(_t,I,z,xt,It,Ot)}}function oo(x,I,z,B,U,tt){x.onBeforeRender(y,I,z,B,U,tt),x.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),U.onBeforeRender(y,I,z,B,x,tt),U.transparent===!0&&U.side===ve&&U.forceSinglePass===!1?(U.side=Ie,U.needsUpdate=!0,y.renderBufferDirect(z,I,B,U,x,tt),U.side=Gn,U.needsUpdate=!0,y.renderBufferDirect(z,I,B,U,x,tt),U.side=ve):y.renderBufferDirect(z,I,B,U,x,tt),x.onAfterRender(y,I,z,B,U,tt)}function ps(x,I,z){I.isScene!==!0&&(I=pe);const B=Tt.get(x),U=p.state.lights,tt=p.state.shadowsArray,ht=U.state.version,_t=St.getParameters(x,U.state,tt,I,z),xt=St.getProgramCacheKey(_t);let It=B.programs;B.environment=x.isMeshStandardMaterial?I.environment:null,B.fog=I.fog,B.envMap=(x.isMeshStandardMaterial?O:_).get(x.envMap||B.environment),B.envMapRotation=B.environment!==null&&x.envMap===null?I.environmentRotation:x.envMapRotation,It===void 0&&(x.addEventListener("dispose",Ft),It=new Map,B.programs=It);let Ot=It.get(xt);if(Ot!==void 0){if(B.currentProgram===Ot&&B.lightsStateVersion===ht)return ho(x,_t),Ot}else _t.uniforms=St.getUniforms(x),x.onBeforeCompile(_t,y),Ot=St.acquireProgram(_t,xt),It.set(xt,Ot),B.uniforms=_t.uniforms;const Mt=B.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(Mt.clippingPlanes=Q.uniform),ho(x,_t),B.needsLights=Ph(x),B.lightsStateVersion=ht,B.needsLights&&(Mt.ambientLightColor.value=U.state.ambient,Mt.lightProbe.value=U.state.probe,Mt.directionalLights.value=U.state.directional,Mt.directionalLightShadows.value=U.state.directionalShadow,Mt.spotLights.value=U.state.spot,Mt.spotLightShadows.value=U.state.spotShadow,Mt.rectAreaLights.value=U.state.rectArea,Mt.ltc_1.value=U.state.rectAreaLTC1,Mt.ltc_2.value=U.state.rectAreaLTC2,Mt.pointLights.value=U.state.point,Mt.pointLightShadows.value=U.state.pointShadow,Mt.hemisphereLights.value=U.state.hemi,Mt.directionalShadowMap.value=U.state.directionalShadowMap,Mt.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Mt.spotShadowMap.value=U.state.spotShadowMap,Mt.spotLightMatrix.value=U.state.spotLightMatrix,Mt.spotLightMap.value=U.state.spotLightMap,Mt.pointShadowMap.value=U.state.pointShadowMap,Mt.pointShadowMatrix.value=U.state.pointShadowMatrix),B.currentProgram=Ot,B.uniformsList=null,Ot}function lo(x){if(x.uniformsList===null){const I=x.currentProgram.getUniforms();x.uniformsList=$s.seqWithValue(I.seq,x.uniforms)}return x.uniformsList}function ho(x,I){const z=Tt.get(x);z.outputColorSpace=I.outputColorSpace,z.batching=I.batching,z.batchingColor=I.batchingColor,z.instancing=I.instancing,z.instancingColor=I.instancingColor,z.instancingMorph=I.instancingMorph,z.skinning=I.skinning,z.morphTargets=I.morphTargets,z.morphNormals=I.morphNormals,z.morphColors=I.morphColors,z.morphTargetsCount=I.morphTargetsCount,z.numClippingPlanes=I.numClippingPlanes,z.numIntersection=I.numClipIntersection,z.vertexAlphas=I.vertexAlphas,z.vertexTangents=I.vertexTangents,z.toneMapping=I.toneMapping}function Rh(x,I,z,B,U){I.isScene!==!0&&(I=pe),b.resetTextureUnits();const tt=I.fog,ht=B.isMeshStandardMaterial?I.environment:null,_t=D===null?y.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:zi,xt=(B.isMeshStandardMaterial?O:_).get(B.envMap||ht),It=B.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Ot=!!z.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),Mt=!!z.morphAttributes.position,Jt=!!z.morphAttributes.normal,he=!!z.morphAttributes.color;let ue=Hn;B.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(ue=y.toneMapping);const ze=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Qt=ze!==void 0?ze.length:0,wt=Tt.get(B),gn=p.state.lights;if(et===!0&&(yt===!0||x!==M)){const Ye=x===M&&B.id===w;Q.setState(B,x,Ye)}let te=!1;B.version===wt.__version?(wt.needsLights&&wt.lightsStateVersion!==gn.state.version||wt.outputColorSpace!==_t||U.isBatchedMesh&&wt.batching===!1||!U.isBatchedMesh&&wt.batching===!0||U.isBatchedMesh&&wt.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&wt.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&wt.instancing===!1||!U.isInstancedMesh&&wt.instancing===!0||U.isSkinnedMesh&&wt.skinning===!1||!U.isSkinnedMesh&&wt.skinning===!0||U.isInstancedMesh&&wt.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&wt.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&wt.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&wt.instancingMorph===!1&&U.morphTexture!==null||wt.envMap!==xt||B.fog===!0&&wt.fog!==tt||wt.numClippingPlanes!==void 0&&(wt.numClippingPlanes!==Q.numPlanes||wt.numIntersection!==Q.numIntersection)||wt.vertexAlphas!==It||wt.vertexTangents!==Ot||wt.morphTargets!==Mt||wt.morphNormals!==Jt||wt.morphColors!==he||wt.toneMapping!==ue||wt.morphTargetsCount!==Qt)&&(te=!0):(te=!0,wt.__version=B.version);let Qe=wt.currentProgram;te===!0&&(Qe=ps(B,I,U));let ri=!1,Ge=!1,Vi=!1;const de=Qe.getUniforms(),cn=wt.uniforms;if(At.useProgram(Qe.program)&&(ri=!0,Ge=!0,Vi=!0),B.id!==w&&(w=B.id,Ge=!0),ri||M!==x){At.buffers.depth.getReversed()?(at.copy(x.projectionMatrix),Cc(at),Pc(at),de.setValue(N,"projectionMatrix",at)):de.setValue(N,"projectionMatrix",x.projectionMatrix),de.setValue(N,"viewMatrix",x.matrixWorldInverse);const Dn=de.map.cameraPosition;Dn!==void 0&&Dn.setValue(N,Ut.setFromMatrixPosition(x.matrixWorld)),Yt.logarithmicDepthBuffer&&de.setValue(N,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&de.setValue(N,"isOrthographic",x.isOrthographicCamera===!0),M!==x&&(M=x,Ge=!0,Vi=!0)}if(U.isSkinnedMesh){de.setOptional(N,U,"bindMatrix"),de.setOptional(N,U,"bindMatrixInverse");const Ye=U.skeleton;Ye&&(Ye.boneTexture===null&&Ye.computeBoneTexture(),de.setValue(N,"boneTexture",Ye.boneTexture,b))}U.isBatchedMesh&&(de.setOptional(N,U,"batchingTexture"),de.setValue(N,"batchingTexture",U._matricesTexture,b),de.setOptional(N,U,"batchingIdTexture"),de.setValue(N,"batchingIdTexture",U._indirectTexture,b),de.setOptional(N,U,"batchingColorTexture"),U._colorsTexture!==null&&de.setValue(N,"batchingColorTexture",U._colorsTexture,b));const Wi=z.morphAttributes;if((Wi.position!==void 0||Wi.normal!==void 0||Wi.color!==void 0)&&Lt.update(U,z,Qe),(Ge||wt.receiveShadow!==U.receiveShadow)&&(wt.receiveShadow=U.receiveShadow,de.setValue(N,"receiveShadow",U.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(cn.envMap.value=xt,cn.flipEnvMap.value=xt.isCubeTexture&&xt.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&I.environment!==null&&(cn.envMapIntensity.value=I.environmentIntensity),Ge&&(de.setValue(N,"toneMappingExposure",y.toneMappingExposure),wt.needsLights&&Ch(cn,Vi),tt&&B.fog===!0&&ot.refreshFogUniforms(cn,tt),ot.refreshMaterialUniforms(cn,B,V,J,p.state.transmissionRenderTarget[x.id]),$s.upload(N,lo(wt),cn,b)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&($s.upload(N,lo(wt),cn,b),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&de.setValue(N,"center",U.center),de.setValue(N,"modelViewMatrix",U.modelViewMatrix),de.setValue(N,"normalMatrix",U.normalMatrix),de.setValue(N,"modelMatrix",U.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const Ye=B.uniformsGroups;for(let Dn=0,In=Ye.length;Dn<In;Dn++){const co=Ye[Dn];L.update(co,Qe),L.bind(co,Qe)}}return Qe}function Ch(x,I){x.ambientLightColor.needsUpdate=I,x.lightProbe.needsUpdate=I,x.directionalLights.needsUpdate=I,x.directionalLightShadows.needsUpdate=I,x.pointLights.needsUpdate=I,x.pointLightShadows.needsUpdate=I,x.spotLights.needsUpdate=I,x.spotLightShadows.needsUpdate=I,x.rectAreaLights.needsUpdate=I,x.hemisphereLights.needsUpdate=I}function Ph(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(x,I,z){Tt.get(x.texture).__webglTexture=I,Tt.get(x.depthTexture).__webglTexture=z;const B=Tt.get(x);B.__hasExternalTextures=!0,B.__autoAllocateDepthBuffer=z===void 0,B.__autoAllocateDepthBuffer||qt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),B.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(x,I){const z=Tt.get(x);z.__webglFramebuffer=I,z.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(x,I=0,z=0){D=x,A=I,R=z;let B=!0,U=null,tt=!1,ht=!1;if(x){const xt=Tt.get(x);if(xt.__useDefaultFramebuffer!==void 0)At.bindFramebuffer(N.FRAMEBUFFER,null),B=!1;else if(xt.__webglFramebuffer===void 0)b.setupRenderTarget(x);else if(xt.__hasExternalTextures)b.rebindTextures(x,Tt.get(x.texture).__webglTexture,Tt.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){const Mt=x.depthTexture;if(xt.__boundDepthTexture!==Mt){if(Mt!==null&&Tt.has(Mt)&&(x.width!==Mt.image.width||x.height!==Mt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");b.setupDepthRenderbuffer(x)}}const It=x.texture;(It.isData3DTexture||It.isDataArrayTexture||It.isCompressedArrayTexture)&&(ht=!0);const Ot=Tt.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(Ot[I])?U=Ot[I][z]:U=Ot[I],tt=!0):x.samples>0&&b.useMultisampledRTT(x)===!1?U=Tt.get(x).__webglMultisampledFramebuffer:Array.isArray(Ot)?U=Ot[z]:U=Ot,C.copy(x.viewport),H.copy(x.scissor),k=x.scissorTest}else C.copy(Et).multiplyScalar(V).floor(),H.copy(Wt).multiplyScalar(V).floor(),k=oe;if(At.bindFramebuffer(N.FRAMEBUFFER,U)&&B&&At.drawBuffers(x,U),At.viewport(C),At.scissor(H),At.setScissorTest(k),tt){const xt=Tt.get(x.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+I,xt.__webglTexture,z)}else if(ht){const xt=Tt.get(x.texture),It=I||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,xt.__webglTexture,z||0,It)}w=-1},this.readRenderTargetPixels=function(x,I,z,B,U,tt,ht){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _t=Tt.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&ht!==void 0&&(_t=_t[ht]),_t){At.bindFramebuffer(N.FRAMEBUFFER,_t);try{const xt=x.texture,It=xt.format,Ot=xt.type;if(!Yt.textureFormatReadable(It)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Yt.textureTypeReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=x.width-B&&z>=0&&z<=x.height-U&&N.readPixels(I,z,B,U,Bt.convert(It),Bt.convert(Ot),tt)}finally{const xt=D!==null?Tt.get(D).__webglFramebuffer:null;At.bindFramebuffer(N.FRAMEBUFFER,xt)}}},this.readRenderTargetPixelsAsync=async function(x,I,z,B,U,tt,ht){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _t=Tt.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&ht!==void 0&&(_t=_t[ht]),_t){const xt=x.texture,It=xt.format,Ot=xt.type;if(!Yt.textureFormatReadable(It))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Yt.textureTypeReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=x.width-B&&z>=0&&z<=x.height-U){At.bindFramebuffer(N.FRAMEBUFFER,_t);const Mt=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Mt),N.bufferData(N.PIXEL_PACK_BUFFER,tt.byteLength,N.STREAM_READ),N.readPixels(I,z,B,U,Bt.convert(It),Bt.convert(Ot),0);const Jt=D!==null?Tt.get(D).__webglFramebuffer:null;At.bindFramebuffer(N.FRAMEBUFFER,Jt);const he=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Rc(N,he,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Mt),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,tt),N.deleteBuffer(Mt),N.deleteSync(he),tt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(x,I=null,z=0){x.isTexture!==!0&&(ns("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,x=arguments[1]);const B=Math.pow(2,-z),U=Math.floor(x.image.width*B),tt=Math.floor(x.image.height*B),ht=I!==null?I.x:0,_t=I!==null?I.y:0;b.setTexture2D(x,0),N.copyTexSubImage2D(N.TEXTURE_2D,z,0,0,ht,_t,U,tt),At.unbindTexture()},this.copyTextureToTexture=function(x,I,z=null,B=null,U=0){x.isTexture!==!0&&(ns("WebGLRenderer: copyTextureToTexture function signature has changed."),B=arguments[0]||null,x=arguments[1],I=arguments[2],U=arguments[3]||0,z=null);let tt,ht,_t,xt,It,Ot,Mt,Jt,he;const ue=x.isCompressedTexture?x.mipmaps[U]:x.image;z!==null?(tt=z.max.x-z.min.x,ht=z.max.y-z.min.y,_t=z.isBox3?z.max.z-z.min.z:1,xt=z.min.x,It=z.min.y,Ot=z.isBox3?z.min.z:0):(tt=ue.width,ht=ue.height,_t=ue.depth||1,xt=0,It=0,Ot=0),B!==null?(Mt=B.x,Jt=B.y,he=B.z):(Mt=0,Jt=0,he=0);const ze=Bt.convert(I.format),Qt=Bt.convert(I.type);let wt;I.isData3DTexture?(b.setTexture3D(I,0),wt=N.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(b.setTexture2DArray(I,0),wt=N.TEXTURE_2D_ARRAY):(b.setTexture2D(I,0),wt=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,I.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,I.unpackAlignment);const gn=N.getParameter(N.UNPACK_ROW_LENGTH),te=N.getParameter(N.UNPACK_IMAGE_HEIGHT),Qe=N.getParameter(N.UNPACK_SKIP_PIXELS),ri=N.getParameter(N.UNPACK_SKIP_ROWS),Ge=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,ue.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ue.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,xt),N.pixelStorei(N.UNPACK_SKIP_ROWS,It),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ot);const Vi=x.isDataArrayTexture||x.isData3DTexture,de=I.isDataArrayTexture||I.isData3DTexture;if(x.isRenderTargetTexture||x.isDepthTexture){const cn=Tt.get(x),Wi=Tt.get(I),Ye=Tt.get(cn.__renderTarget),Dn=Tt.get(Wi.__renderTarget);At.bindFramebuffer(N.READ_FRAMEBUFFER,Ye.__webglFramebuffer),At.bindFramebuffer(N.DRAW_FRAMEBUFFER,Dn.__webglFramebuffer);for(let In=0;In<_t;In++)Vi&&N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Tt.get(x).__webglTexture,U,Ot+In),x.isDepthTexture?(de&&N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Tt.get(I).__webglTexture,U,he+In),N.blitFramebuffer(xt,It,tt,ht,Mt,Jt,tt,ht,N.DEPTH_BUFFER_BIT,N.NEAREST)):de?N.copyTexSubImage3D(wt,U,Mt,Jt,he+In,xt,It,tt,ht):N.copyTexSubImage2D(wt,U,Mt,Jt,he+In,xt,It,tt,ht);At.bindFramebuffer(N.READ_FRAMEBUFFER,null),At.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else de?x.isDataTexture||x.isData3DTexture?N.texSubImage3D(wt,U,Mt,Jt,he,tt,ht,_t,ze,Qt,ue.data):I.isCompressedArrayTexture?N.compressedTexSubImage3D(wt,U,Mt,Jt,he,tt,ht,_t,ze,ue.data):N.texSubImage3D(wt,U,Mt,Jt,he,tt,ht,_t,ze,Qt,ue):x.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,U,Mt,Jt,tt,ht,ze,Qt,ue.data):x.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,U,Mt,Jt,ue.width,ue.height,ze,ue.data):N.texSubImage2D(N.TEXTURE_2D,U,Mt,Jt,tt,ht,ze,Qt,ue);N.pixelStorei(N.UNPACK_ROW_LENGTH,gn),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,te),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Qe),N.pixelStorei(N.UNPACK_SKIP_ROWS,ri),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ge),U===0&&I.generateMipmaps&&N.generateMipmap(wt),At.unbindTexture()},this.copyTextureToTexture3D=function(x,I,z=null,B=null,U=0){return x.isTexture!==!0&&(ns("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,B=arguments[1]||null,x=arguments[2],I=arguments[3],U=arguments[4]||0),ns('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(x,I,z,B,U)},this.initRenderTarget=function(x){Tt.get(x).__webglFramebuffer===void 0&&b.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?b.setTextureCube(x,0):x.isData3DTexture?b.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?b.setTexture2DArray(x,0):b.setTexture2D(x,0),At.unbindTexture()},this.resetState=function(){A=0,R=0,D=null,At.reset(),le.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=$t._getDrawingBufferColorSpace(t),e.unpackColorSpace=$t._getUnpackColorSpace()}}class Za{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ct(t),this.density=e}clone(){return new Za(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class ph extends _e{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new hn,this.environmentIntensity=1,this.environmentRotation=new hn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class km{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Pa,this.updateRanges=[],this.version=0,this.uuid=Rn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ue=new E;class Qs{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix4(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyNormalMatrix(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.transformDirection(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=sn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ie(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=sn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=sn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=sn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=sn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),i=ie(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),i=ie(i,this.array),r=ie(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new je(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Qs(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class me extends Vn{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Ct(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Mi;const $i=new E,yi=new E,Si=new E,wi=new nt,Zi=new nt,mh=new re,Fs=new E,ji=new E,Os=new E,ll=new nt,zr=new nt,hl=new nt;class Me extends _e{constructor(t=new me){if(super(),this.isSprite=!0,this.type="Sprite",Mi===void 0){Mi=new Te;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new km(e,5);Mi.setIndex([0,1,2,0,2,3]),Mi.setAttribute("position",new Qs(n,3,0,!1)),Mi.setAttribute("uv",new Qs(n,2,3,!1))}this.geometry=Mi,this.material=t,this.center=new nt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),yi.setFromMatrixScale(this.matrixWorld),mh.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Si.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&yi.multiplyScalar(-Si.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const o=this.center;zs(Fs.set(-.5,-.5,0),Si,o,yi,i,r),zs(ji.set(.5,-.5,0),Si,o,yi,i,r),zs(Os.set(.5,.5,0),Si,o,yi,i,r),ll.set(0,0),zr.set(1,0),hl.set(1,1);let a=t.ray.intersectTriangle(Fs,ji,Os,!1,$i);if(a===null&&(zs(ji.set(-.5,.5,0),Si,o,yi,i,r),zr.set(0,1),a=t.ray.intersectTriangle(Fs,Os,ji,!1,$i),a===null))return;const l=t.ray.origin.distanceTo($i);l<t.near||l>t.far||e.push({distance:l,point:$i.clone(),uv:Ze.getInterpolation($i,Fs,ji,Os,ll,zr,hl,new nt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function zs(s,t,e,n,i,r){wi.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(Zi.x=r*wi.x-i*wi.y,Zi.y=i*wi.x+r*wi.y):Zi.copy(wi),s.copy(t),s.x+=Zi.x,s.y+=Zi.y,s.applyMatrix4(mh)}class gh extends Vn{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Ct(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const tr=new E,er=new E,cl=new re,Ji=new ar,Bs=new ds,Br=new E,ul=new E;class Hm extends _e{constructor(t=new Te,e=new gh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)tr.fromBufferAttribute(e,i-1),er.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=tr.distanceTo(er);t.setAttribute("lineDistance",new ae(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Bs.copy(n.boundingSphere),Bs.applyMatrix4(i),Bs.radius+=r,t.ray.intersectsSphere(Bs)===!1)return;cl.copy(i).invert(),Ji.copy(t.ray).applyMatrix4(cl);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,h=this.isLineSegments?2:1,c=n.index,f=n.attributes.position;if(c!==null){const d=Math.max(0,o.start),g=Math.min(c.count,o.start+o.count);for(let v=d,m=g-1;v<m;v+=h){const p=c.getX(v),S=c.getX(v+1),T=ks(this,t,Ji,l,p,S);T&&e.push(T)}if(this.isLineLoop){const v=c.getX(g-1),m=c.getX(d),p=ks(this,t,Ji,l,v,m);p&&e.push(p)}}else{const d=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let v=d,m=g-1;v<m;v+=h){const p=ks(this,t,Ji,l,v,v+1);p&&e.push(p)}if(this.isLineLoop){const v=ks(this,t,Ji,l,g-1,d);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function ks(s,t,e,n,i,r){const o=s.geometry.attributes.position;if(tr.fromBufferAttribute(o,i),er.fromBufferAttribute(o,r),e.distanceSqToSegment(tr,er,Br,ul)>n)return;Br.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(Br);if(!(l<t.near||l>t.far))return{distance:l,point:ul.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:s}}class vh extends Vn{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Ct(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const dl=new re,Ia=new ar,Hs=new ds,Gs=new E;class Gm extends _e{constructor(t=new Te,e=new vh){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Hs.copy(n.boundingSphere),Hs.applyMatrix4(i),Hs.radius+=r,t.ray.intersectsSphere(Hs)===!1)return;dl.copy(i).invert(),Ia.copy(t.ray).applyMatrix4(dl);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),d=Math.min(h.count,o.start+o.count);for(let g=f,v=d;g<v;g++){const m=h.getX(g);Gs.fromBufferAttribute(u,m),fl(Gs,m,l,i,t,e,this)}}else{const f=Math.max(0,o.start),d=Math.min(u.count,o.start+o.count);for(let g=f,v=d;g<v;g++)Gs.fromBufferAttribute(u,g),fl(Gs,g,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function fl(s,t,e,n,i,r,o){const a=Ia.distanceSqToPoint(s);if(a<e){const l=new E;Ia.closestPointToPoint(s,l),l.applyMatrix4(n);const h=i.ray.origin.distanceTo(l);if(h<i.near||h>i.far)return;r.push({distance:h,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class _h extends Oe{constructor(t,e,n,i,r,o,a,l,h){super(t,e,n,i,r,o,a,l,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class pn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let i=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,h;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),h=n[i]-o,h<0)a=i+1;else if(h>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(r-1);const c=n[i],f=n[i+1]-c,d=(o-c)/f;return(i+d)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);const o=this.getPoint(i),a=this.getPoint(r),l=e||(o.isVector2?new nt:new E);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new E,i=[],r=[],o=[],a=new E,l=new re;for(let d=0;d<=t;d++){const g=d/t;i[d]=this.getTangentAt(g,new E)}r[0]=new E,o[0]=new E;let h=Number.MAX_VALUE;const c=Math.abs(i[0].x),u=Math.abs(i[0].y),f=Math.abs(i[0].z);c<=h&&(h=c,n.set(1,0,0)),u<=h&&(h=u,n.set(0,1,0)),f<=h&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(i[d-1],i[d]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Se(i[d-1].dot(i[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(a,g))}o[d].crossVectors(i[d],r[d])}if(e===!0){let d=Math.acos(Se(r[0].dot(r[t]),-1,1));d/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(d=-d);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],d*g)),o[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class ja extends pn{constructor(t=0,e=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new nt){const n=e,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),h=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const c=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,d=h-this.aY;l=f*c-d*u+this.aX,h=f*u+d*c+this.aY}return n.set(l,h)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Vm extends ja{constructor(t,e,n,i,r,o){super(t,e,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Ja(){let s=0,t=0,e=0,n=0;function i(r,o,a,l){s=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,h){i(o,a,h*(a-r),h*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,h,c,u){let f=(o-r)/h-(a-r)/(h+c)+(a-o)/c,d=(a-o)/c-(l-o)/(c+u)+(l-a)/u;f*=c,d*=c,i(o,a,f,d)},calc:function(r){const o=r*r,a=o*r;return s+t*r+e*o+n*a}}}const Vs=new E,kr=new Ja,Hr=new Ja,Gr=new Ja;class Wm extends pn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new E){const n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let h,c;this.closed||a>0?h=i[(a-1)%r]:(Vs.subVectors(i[0],i[1]).add(i[0]),h=Vs);const u=i[a%r],f=i[(a+1)%r];if(this.closed||a+2<r?c=i[(a+2)%r]:(Vs.subVectors(i[r-1],i[r-2]).add(i[r-1]),c=Vs),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(h.distanceToSquared(u),d),v=Math.pow(u.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(c),d);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),kr.initNonuniformCatmullRom(h.x,u.x,f.x,c.x,g,v,m),Hr.initNonuniformCatmullRom(h.y,u.y,f.y,c.y,g,v,m),Gr.initNonuniformCatmullRom(h.z,u.z,f.z,c.z,g,v,m)}else this.curveType==="catmullrom"&&(kr.initCatmullRom(h.x,u.x,f.x,c.x,this.tension),Hr.initCatmullRom(h.y,u.y,f.y,c.y,this.tension),Gr.initCatmullRom(h.z,u.z,f.z,c.z,this.tension));return n.set(kr.calc(l),Hr.calc(l),Gr.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new E().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function pl(s,t,e,n,i){const r=(n-t)*.5,o=(i-e)*.5,a=s*s,l=s*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*s+e}function Xm(s,t){const e=1-s;return e*e*t}function qm(s,t){return 2*(1-s)*s*t}function Ym(s,t){return s*s*t}function as(s,t,e,n){return Xm(s,t)+qm(s,e)+Ym(s,n)}function Km(s,t){const e=1-s;return e*e*e*t}function $m(s,t){const e=1-s;return 3*e*e*s*t}function Zm(s,t){return 3*(1-s)*s*s*t}function jm(s,t){return s*s*s*t}function os(s,t,e,n,i){return Km(s,t)+$m(s,e)+Zm(s,n)+jm(s,i)}class xh extends pn{constructor(t=new nt,e=new nt,n=new nt,i=new nt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new nt){const n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(os(t,i.x,r.x,o.x,a.x),os(t,i.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Jm extends pn{constructor(t=new E,e=new E,n=new E,i=new E){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new E){const n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(os(t,i.x,r.x,o.x,a.x),os(t,i.y,r.y,o.y,a.y),os(t,i.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Mh extends pn{constructor(t=new nt,e=new nt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new nt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new nt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Qm extends pn{constructor(t=new E,e=new E){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new E){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new E){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class yh extends pn{constructor(t=new nt,e=new nt,n=new nt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new nt){const n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(as(t,i.x,r.x,o.x),as(t,i.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class t0 extends pn{constructor(t=new E,e=new E,n=new E){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new E){const n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(as(t,i.x,r.x,o.x),as(t,i.y,r.y,o.y),as(t,i.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Sh extends pn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new nt){const n=e,i=this.points,r=(i.length-1)*t,o=Math.floor(r),a=r-o,l=i[o===0?o:o-1],h=i[o],c=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(pl(a,l.x,h.x,c.x,u.x),pl(a,l.y,h.y,c.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new nt().fromArray(i))}return this}}var ml=Object.freeze({__proto__:null,ArcCurve:Vm,CatmullRomCurve3:Wm,CubicBezierCurve:xh,CubicBezierCurve3:Jm,EllipseCurve:ja,LineCurve:Mh,LineCurve3:Qm,QuadraticBezierCurve:yh,QuadraticBezierCurve3:t0,SplineCurve:Sh});class e0 extends pn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ml[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const o=i[r]-n,a=this.curves[r],l=a.getLength(),h=l===0?0:1-o/l;return a.getPointAt(h,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const o=r[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let h=0;h<l.length;h++){const c=l[h];n&&n.equals(c)||(e.push(c),n=c)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(new ml[i.type]().fromJSON(i))}return this}}class n0 extends e0{constructor(t){super(),this.type="Path",this.currentPoint=new nt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Mh(this.currentPoint.clone(),new nt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){const r=new yh(this.currentPoint.clone(),new nt(t,e),new nt(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,o){const a=new xh(this.currentPoint.clone(),new nt(t,e),new nt(n,i),new nt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Sh(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,i,r,o),this}absarc(t,e,n,i,r,o){return this.absellipse(t,e,n,n,i,r,o),this}ellipse(t,e,n,i,r,o,a,l){const h=this.currentPoint.x,c=this.currentPoint.y;return this.absellipse(t+h,e+c,n,i,r,o,a,l),this}absellipse(t,e,n,i,r,o,a,l){const h=new ja(t,e,n,i,r,o,a,l);if(this.curves.length>0){const u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);const c=h.getPoint(1);return this.currentPoint.copy(c),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Qa extends Te{constructor(t=[new nt(0,-.5),new nt(.5,0),new nt(0,.5)],e=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:i},e=Math.floor(e),i=Se(i,0,Math.PI*2);const r=[],o=[],a=[],l=[],h=[],c=1/e,u=new E,f=new nt,d=new E,g=new E,v=new E;let m=0,p=0;for(let S=0;S<=t.length-1;S++)switch(S){case 0:m=t[S+1].x-t[S].x,p=t[S+1].y-t[S].y,d.x=p*1,d.y=-m,d.z=p*0,v.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case t.length-1:l.push(v.x,v.y,v.z);break;default:m=t[S+1].x-t[S].x,p=t[S+1].y-t[S].y,d.x=p*1,d.y=-m,d.z=p*0,g.copy(d),d.x+=v.x,d.y+=v.y,d.z+=v.z,d.normalize(),l.push(d.x,d.y,d.z),v.copy(g)}for(let S=0;S<=e;S++){const T=n+S*c*i,y=Math.sin(T),F=Math.cos(T);for(let A=0;A<=t.length-1;A++){u.x=t[A].x*y,u.y=t[A].y,u.z=t[A].x*F,o.push(u.x,u.y,u.z),f.x=S/e,f.y=A/(t.length-1),a.push(f.x,f.y);const R=l[3*A+0]*y,D=l[3*A+1],w=l[3*A+0]*F;h.push(R,D,w)}}for(let S=0;S<e;S++)for(let T=0;T<t.length-1;T++){const y=T+S*t.length,F=y,A=y+t.length,R=y+t.length+1,D=y+1;r.push(F,A,D),r.push(R,D,A)}this.setIndex(r),this.setAttribute("position",new ae(o,3)),this.setAttribute("uv",new ae(a,2)),this.setAttribute("normal",new ae(h,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qa(t.points,t.segments,t.phiStart,t.phiLength)}}class an extends Qa{constructor(t=1,e=1,n=4,i=8){const r=new n0;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),i),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:i}}static fromJSON(t){return new an(t.radius,t.length,t.capSegments,t.radialSegments)}}class bn extends Te{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const r=[],o=[],a=[],l=[],h=new E,c=new nt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const d=n+u/e*i;h.x=t*Math.cos(d),h.y=t*Math.sin(d),o.push(h.x,h.y,h.z),a.push(0,0,1),c.x=(o[f]/t+1)/2,c.y=(o[f+1]/t+1)/2,l.push(c.x,c.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ae(o,3)),this.setAttribute("normal",new ae(a,3)),this.setAttribute("uv",new ae(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bn(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Gt extends Te{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const h=this;i=Math.floor(i),r=Math.floor(r);const c=[],u=[],f=[],d=[];let g=0;const v=[],m=n/2;let p=0;S(),o===!1&&(t>0&&T(!0),e>0&&T(!1)),this.setIndex(c),this.setAttribute("position",new ae(u,3)),this.setAttribute("normal",new ae(f,3)),this.setAttribute("uv",new ae(d,2));function S(){const y=new E,F=new E;let A=0;const R=(e-t)/n;for(let D=0;D<=r;D++){const w=[],M=D/r,C=M*(e-t)+t;for(let H=0;H<=i;H++){const k=H/i,X=k*l+a,Z=Math.sin(X),W=Math.cos(X);F.x=C*Z,F.y=-M*n+m,F.z=C*W,u.push(F.x,F.y,F.z),y.set(Z,R,W).normalize(),f.push(y.x,y.y,y.z),d.push(k,1-M),w.push(g++)}v.push(w)}for(let D=0;D<i;D++)for(let w=0;w<r;w++){const M=v[w][D],C=v[w+1][D],H=v[w+1][D+1],k=v[w][D+1];(t>0||w!==0)&&(c.push(M,C,k),A+=3),(e>0||w!==r-1)&&(c.push(C,H,k),A+=3)}h.addGroup(p,A,0),p+=A}function T(y){const F=g,A=new nt,R=new E;let D=0;const w=y===!0?t:e,M=y===!0?1:-1;for(let H=1;H<=i;H++)u.push(0,m*M,0),f.push(0,M,0),d.push(.5,.5),g++;const C=g;for(let H=0;H<=i;H++){const X=H/i*l+a,Z=Math.cos(X),W=Math.sin(X);R.x=w*W,R.y=m*M,R.z=w*Z,u.push(R.x,R.y,R.z),f.push(0,M,0),A.x=Z*.5+.5,A.y=W*.5*M+.5,d.push(A.x,A.y),g++}for(let H=0;H<i;H++){const k=F+H,X=C+H;y===!0?c.push(X,X+1,k):c.push(X+1,X,k),D+=3}h.addGroup(p,D,y===!0?1:2),p+=D}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Gt(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class nr extends Gt{constructor(t=1,e=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new nr(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Fi extends Te{constructor(t=.5,e=1,n=32,i=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);const a=[],l=[],h=[],c=[];let u=t;const f=(e-t)/i,d=new E,g=new nt;for(let v=0;v<=i;v++){for(let m=0;m<=n;m++){const p=r+m/n*o;d.x=u*Math.cos(p),d.y=u*Math.sin(p),l.push(d.x,d.y,d.z),h.push(0,0,1),g.x=(d.x/e+1)/2,g.y=(d.y/e+1)/2,c.push(g.x,g.y)}u+=f}for(let v=0;v<i;v++){const m=v*(n+1);for(let p=0;p<n;p++){const S=p+m,T=S,y=S+n+1,F=S+n+2,A=S+1;a.push(T,y,A),a.push(y,F,A)}}this.setIndex(a),this.setAttribute("position",new ae(l,3)),this.setAttribute("normal",new ae(h,3)),this.setAttribute("uv",new ae(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fi(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class we extends Te{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let h=0;const c=[],u=new E,f=new E,d=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const S=[],T=p/n;let y=0;p===0&&o===0?y=.5/e:p===n&&l===Math.PI&&(y=-.5/e);for(let F=0;F<=e;F++){const A=F/e;u.x=-t*Math.cos(i+A*r)*Math.sin(o+T*a),u.y=t*Math.cos(o+T*a),u.z=t*Math.sin(i+A*r)*Math.sin(o+T*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),v.push(f.x,f.y,f.z),m.push(A+y,1-T),S.push(h++)}c.push(S)}for(let p=0;p<n;p++)for(let S=0;S<e;S++){const T=c[p][S+1],y=c[p][S],F=c[p+1][S],A=c[p+1][S+1];(p!==0||o>0)&&d.push(T,y,A),(p!==n-1||l<Math.PI)&&d.push(y,F,A)}this.setIndex(d),this.setAttribute("position",new ae(g,3)),this.setAttribute("normal",new ae(v,3)),this.setAttribute("uv",new ae(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new we(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class to extends Te{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const o=[],a=[],l=[],h=[],c=new E,u=new E,f=new E;for(let d=0;d<=n;d++)for(let g=0;g<=i;g++){const v=g/i*r,m=d/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(v),u.y=(t+e*Math.cos(m))*Math.sin(v),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),c.x=t*Math.cos(v),c.y=t*Math.sin(v),f.subVectors(u,c).normalize(),l.push(f.x,f.y,f.z),h.push(g/i),h.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=i;g++){const v=(i+1)*d+g-1,m=(i+1)*(d-1)+g-1,p=(i+1)*(d-1)+g,S=(i+1)*d+g;o.push(v,m,S),o.push(m,p,S)}this.setIndex(o),this.setAttribute("position",new ae(a,3)),this.setAttribute("normal",new ae(l,3)),this.setAttribute("uv",new ae(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new to(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class i0 extends De{static get type(){return"RawShaderMaterial"}constructor(t){super(t),this.isRawShaderMaterial=!0}}class dt extends Vn{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Ct(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ct(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=jl,this.normalScale=new nt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ua extends dt{static get type(){return"MeshPhysicalMaterial"}constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new nt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Se(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ct(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ct(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ct(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class lr extends _e{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ct(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class s0 extends lr{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_e.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ct(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Vr=new re,gl=new E,vl=new E;class eo{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new nt(512,512),this.map=null,this.mapPass=null,this.matrix=new re,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ya,this._frameExtents=new nt(1,1),this._viewportCount=1,this._viewports=[new se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;gl.setFromMatrixPosition(t.matrixWorld),e.position.copy(gl),vl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(vl),e.updateMatrixWorld(),Vr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Vr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Vr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class r0 extends eo{constructor(){super(new ke(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,n=Ui*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(n!==e.fov||i!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=i,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class a0 extends lr{constructor(t,e,n=0,i=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(_e.DEFAULT_UP),this.updateMatrix(),this.target=new _e,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new r0}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const _l=new re,Qi=new E,Wr=new E;class o0 extends eo{constructor(){super(new ke(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new nt(4,2),this._viewportCount=6,this._viewports=[new se(2,1,1,1),new se(0,1,1,1),new se(3,1,1,1),new se(1,1,1,1),new se(3,0,1,1),new se(1,0,1,1)],this._cubeDirections=[new E(1,0,0),new E(-1,0,0),new E(0,0,1),new E(0,0,-1),new E(0,1,0),new E(0,-1,0)],this._cubeUps=[new E(0,1,0),new E(0,1,0),new E(0,1,0),new E(0,1,0),new E(0,0,1),new E(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,i=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Qi.setFromMatrixPosition(t.matrixWorld),n.position.copy(Qi),Wr.copy(n.position),Wr.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Wr),n.updateMatrixWorld(),i.makeTranslation(-Qi.x,-Qi.y,-Qi.z),_l.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(_l)}}class Re extends lr{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new o0}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class l0 extends eo{constructor(){super(new Ka(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class h0 extends lr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_e.DEFAULT_UP),this.updateMatrix(),this.target=new _e,this.shadow=new l0}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class wh{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=xl(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=xl();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function xl(){return performance.now()}const Ml=new re;class Eh{constructor(t,e,n=0,i=1/0){this.ray=new ar(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new qa,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Ml.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ml),this}intersectObject(t,e=!0,n=[]){return Na(t,this,n,e),n.sort(yl),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)Na(t[i],this,n,e);return n.sort(yl),n}}function yl(s,t){return s.distance-t.distance}function Na(s,t,e,n){let i=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let o=0,a=r.length;o<a;o++)Na(r[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Oa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Oa);const bh={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Gi{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const c0=new Ka(-1,1,1,-1,0,1);class u0 extends Te{constructor(){super(),this.setAttribute("position",new ae([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ae([0,2,0,0,2,0],2))}}const d0=new u0;class no{constructor(t){this._mesh=new P(d0,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,c0)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Th extends Gi{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof De?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=hs.clone(t.uniforms),this.material=new De({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new no(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Sl extends Gi{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class f0 extends Gi{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class p0{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new nt);this._width=n.width,this._height=n.height,e=new ln(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:An}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Th(bh),this.copyPass.material.blending=Tn,this.clock=new wh}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Sl!==void 0&&(o instanceof Sl?n=!0:o instanceof f0&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new nt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class m0 extends Gi{constructor(t,e,n=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Ct}render(t,e,n){const i=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=i}}const g0={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ct(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Oi extends Gi{constructor(t,e,n,i){super(),this.strength=e!==void 0?e:1,this.radius=n,this.threshold=i,this.resolution=t!==void 0?new nt(t.x,t.y):new nt(256,256),this.clearColor=new Ct(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new ln(r,o,{type:An}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const f=new ln(r,o,{type:An});f.texture.name="UnrealBloomPass.h"+u,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const d=new ln(r,o,{type:An});d.texture.name="UnrealBloomPass.v"+u,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),o=Math.round(o/2)}const a=g0;this.highPassUniforms=hs.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new De({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new nt(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new E(1,1,1),new E(1,1,1),new E(1,1,1),new E(1,1,1),new E(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const c=bh;this.copyUniforms=hs.clone(c.uniforms),this.blendMaterial=new De({uniforms:this.copyUniforms,vertexShader:c.vertexShader,fragmentShader:c.fragmentShader,blending:fe,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Ct,this.oldClearAlpha=1,this.basic=new bt,this.fsQuad=new no(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),i=Math.round(e/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new nt(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(t,e,n,i,r){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=Oi.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Oi.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this.fsQuad.render(t),a=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(n),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=o}getSeperableBlurMaterial(t){const e=[];for(let n=0;n<t;n++)e.push(.39894*Math.exp(-.5*n*n/(t*t))/t);return new De({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new nt(.5,.5)},direction:{value:new nt(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new De({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Oi.BlurDirectionX=new nt(1,0);Oi.BlurDirectionY=new nt(0,1);const v0={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class _0 extends Gi{constructor(){super();const t=v0;this.uniforms=hs.clone(t.uniforms),this.material=new i0({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new no(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},$t.getTransfer(this._outputColorSpace)===ne&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Nl?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Fl?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Ol?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===za?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===zl?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Bl&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class x0 extends ph{constructor(){super();const t=new ut;t.deleteAttribute("uv");const e=new dt({side:Ie}),n=new dt,i=new Re(16777215,900,28,2);i.position.set(.418,16.199,.3),this.add(i);const r=new P(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const o=new P(t,n);o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),this.add(o);const a=new P(t,n);a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),this.add(a);const l=new P(t,n);l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),this.add(l);const h=new P(t,n);h.position.set(-2.017,.018,6.124),h.rotation.set(0,.333,0),h.scale.set(2.002,4.566,2.064),this.add(h);const c=new P(t,n);c.position.set(2.291,-.756,-2.621),c.rotation.set(0,-.286,0),c.scale.set(1.546,1.552,1.496),this.add(c);const u=new P(t,n);u.position.set(-2.193,-.369,-5.547),u.rotation.set(0,.516,0),u.scale.set(3.875,3.487,2.986),this.add(u);const f=new P(t,Ei(50));f.position.set(-16.116,14.37,8.208),f.scale.set(.1,2.428,2.739),this.add(f);const d=new P(t,Ei(50));d.position.set(-16.109,18.021,-8.207),d.scale.set(.1,2.425,2.751),this.add(d);const g=new P(t,Ei(17));g.position.set(14.904,12.198,-1.832),g.scale.set(.15,4.265,6.331),this.add(g);const v=new P(t,Ei(43));v.position.set(-.462,8.89,14.52),v.scale.set(4.38,5.441,.088),this.add(v);const m=new P(t,Ei(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);const p=new P(t,Ei(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){const t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(const e of t)e.dispose()}}function Ei(s){const t=new bt;return t.color.setScalar(s),t}const ts=new E;function $e(s,t,e,n,i,r){const o=2*Math.PI*i/4,a=Math.max(r-2*i,0),l=Math.PI/4;ts.copy(t),ts[n]=0,ts.normalize();const h=.5*o/(o+a),c=1-ts.angleTo(s)/l;return Math.sign(ts[e])===1?c*h:a/(o+a)+h+h*(1-c)}class vt extends ut{constructor(t=1,e=1,n=1,i=2,r=.1){if(i=i*2+1,r=Math.min(t/2,e/2,n/2,r),super(1,1,1,i,i,i),i===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const a=new E,l=new E,h=new E(t,e,n).divideScalar(2).subScalar(r),c=this.attributes.position.array,u=this.attributes.normal.array,f=this.attributes.uv.array,d=c.length/6,g=new E,v=.5/i;for(let m=0,p=0;m<c.length;m+=3,p+=2)switch(a.fromArray(c,m),l.copy(a),l.x-=Math.sign(l.x)*v,l.y-=Math.sign(l.y)*v,l.z-=Math.sign(l.z)*v,l.normalize(),c[m+0]=h.x*Math.sign(a.x)+l.x*r,c[m+1]=h.y*Math.sign(a.y)+l.y*r,c[m+2]=h.z*Math.sign(a.z)+l.z*r,u[m+0]=l.x,u[m+1]=l.y,u[m+2]=l.z,Math.floor(m/d)){case 0:g.set(1,0,0),f[p+0]=$e(g,l,"z","y",r,n),f[p+1]=1-$e(g,l,"y","z",r,e);break;case 1:g.set(-1,0,0),f[p+0]=1-$e(g,l,"z","y",r,n),f[p+1]=1-$e(g,l,"y","z",r,e);break;case 2:g.set(0,1,0),f[p+0]=1-$e(g,l,"x","z",r,t),f[p+1]=$e(g,l,"z","x",r,n);break;case 3:g.set(0,-1,0),f[p+0]=1-$e(g,l,"x","z",r,t),f[p+1]=1-$e(g,l,"z","x",r,n);break;case 4:g.set(0,0,1),f[p+0]=1-$e(g,l,"x","y",r,t),f[p+1]=1-$e(g,l,"y","x",r,e);break;case 5:g.set(0,0,-1),f[p+0]=$e(g,l,"x","y",r,t),f[p+1]=1-$e(g,l,"y","x",r,e);break}}}function Ln(s){let t=s>>>0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}let M0=8;function y0(s,t){const e=document.createElement("canvas");return e.width=s,e.height=t,e}function Xe(s,t,e,{repeat:n=[1,1],srgb:i=!0,wrap:r=Zs}={}){const o=y0(s,t),a=o.getContext("2d");e(a,s,t);const l=new _h(o);return l.wrapS=l.wrapT=r,l.repeat.set(n[0],n[1]),l.anisotropy=M0,i&&(l.colorSpace=Fe),l.needsUpdate=!0,l}function S0(){const s=Ln(34191),t=1024,e=4,n=t/e,r=Xe(t,t,a=>{a.fillStyle="#22252c",a.fillRect(0,0,t,t);for(let l=0;l<e;l++)for(let h=0;h<e;h++){const c=h*n,u=l*n,f=30+Math.floor(s()*16);a.fillStyle=`rgb(${f+2},${f+4},${f+9})`,a.fillRect(c+3,u+3,n-6,n-6);const d=a.createLinearGradient(c,u,c+n,u+n);d.addColorStop(0,"rgba(255,255,255,0.055)"),d.addColorStop(.48,"rgba(255,255,255,0)"),d.addColorStop(1,"rgba(0,0,0,0.18)"),a.fillStyle=d,a.fillRect(c+3,u+3,n-6,n-6);for(let g=0;g<7;g++){a.beginPath();const v=c+s()*n,m=u+s()*n;a.moveTo(v,m),a.bezierCurveTo(v+(s()-.5)*110,m+s()*90,v+(s()-.5)*140,m+s()*160,v+(s()-.5)*180,m+s()*210),a.strokeStyle=s()>.5?"rgba(190,196,208,0.06)":"rgba(4,6,10,0.2)",a.lineWidth=.6+s()*1.6,a.stroke()}for(let g=0;g<3;g++)a.beginPath(),a.ellipse(c+s()*n,u+s()*n,10+s()*48,8+s()*30,s()*3,0,Math.PI*2),a.fillStyle=`rgba(8,10,12,${.04+s()*.08})`,a.fill()}a.strokeStyle="rgba(7,9,12,0.9)",a.lineWidth=5;for(let l=0;l<=e;l++){const h=l*n;a.beginPath(),a.moveTo(h,0),a.lineTo(h,t),a.stroke(),a.beginPath(),a.moveTo(0,h),a.lineTo(t,h),a.stroke()}},{repeat:[7,10.5]}),o=Xe(t,t,a=>{a.fillStyle="#5c5c5c",a.fillRect(0,0,t,t);const l=Ln(999);for(let h=0;h<9e3;h++){const c=60+Math.floor(l()*100);a.fillStyle=`rgba(${c},${c},${c},${.2+l()*.4})`,a.fillRect(l()*t,l()*t,1+l()*8,1+l()*8)}a.strokeStyle="rgba(220,220,220,0.9)",a.lineWidth=6;for(let h=0;h<=e;h++){const c=h*n;a.beginPath(),a.moveTo(c,0),a.lineTo(c,t),a.stroke(),a.beginPath(),a.moveTo(0,c),a.lineTo(t,c),a.stroke()}},{repeat:[7,10.5],srgb:!1});return{map:r,rough:o}}function w0(s=[2,1]){const t=Ln(7712);return Xe(512,512,(e,n,i)=>{e.fillStyle="#35373b",e.fillRect(0,0,n,i);for(let o=0;o<16e3;o++){const a=30+t()*40;e.fillStyle=`rgba(${a},${a},${a+3},${.12+t()*.25})`,e.fillRect(t()*n,t()*i,1+t()*3,1+t()*3)}const r=e.createLinearGradient(0,0,0,i);r.addColorStop(0,"rgba(255,255,255,0.05)"),r.addColorStop(1,"rgba(0,0,0,0.24)"),e.fillStyle=r,e.fillRect(0,0,n,i),e.strokeStyle="rgba(12,14,17,0.5)",e.lineWidth=2,e.strokeRect(1,1,n-2,i-2);for(let o=0;o<16;o++){e.beginPath();const a=t()*n,l=t()*i;e.moveTo(a,l);let h=a,c=l;for(let u=0;u<7;u++)h+=(t()-.5)*70,c+=t()*32,e.lineTo(h,c);e.strokeStyle=`rgba(8,9,11,${.16+t()*.2})`,e.lineWidth=.8+t(),e.stroke()}},{repeat:s})}function E0(){const s=Ln(51);return Xe(256,256,(t,e,n)=>{t.fillStyle="#4a2224",t.fillRect(0,0,e,n);for(let i=0;i<9e3;i++){const r=s()>.5?"rgba(255,150,140,0.04)":"rgba(20,4,6,0.16)";t.fillStyle=r,t.fillRect(s()*e,s()*n,2,2)}t.strokeStyle="rgba(189,140,90,0.18)",t.lineWidth=3,t.strokeRect(22,22,e-44,n-44),t.strokeRect(34,34,e-68,n-68)},{repeat:[3,26]})}function b0(s=[4,2]){const t=Ln(1201);return Xe(512,512,(e,n,i)=>{e.fillStyle="#1d2429",e.fillRect(0,0,n,i);const r=64,o=64;for(let l=0;l<i/o;l++)for(let h=0;h<n/r;h++){const c=26+t()*12;e.fillStyle=`rgb(${c},${c+5},${c+8})`,e.fillRect(h*r+2,l*o+2,r-4,o-4)}const a=e.createLinearGradient(0,0,0,i);a.addColorStop(0,"rgba(120,170,180,0.08)"),a.addColorStop(1,"rgba(0,0,0,0.3)"),e.fillStyle=a,e.fillRect(0,0,n,i)},{repeat:s})}function un(s,{color:t="#ff5a4d",sub:e="",background:n="rgba(6,8,12,0.92)",border:i=!0,font:r="Archivo Black",fontSize:o=116,letterSpacing:a=4,width:l=1024,height:h=256}={}){return Xe(l,h,(c,u,f)=>{c.clearRect(0,0,u,f),n&&(c.fillStyle=n,c.fillRect(0,0,u,f)),i&&(c.strokeStyle="rgba(255,255,255,0.14)",c.lineWidth=3,c.strokeRect(9,9,u-18,f-18)),c.textAlign="center",c.textBaseline="middle",c.font=`${o}px "${r}", "Arial Black", sans-serif`,c.shadowColor=t,c.shadowBlur=42,c.fillStyle=t;let d=u/2;if(a){const g=s.split(""),v=g.map(p=>c.measureText(p).width),m=v.reduce((p,S)=>p+S,0)+a*(g.length-1);d=u/2-m/2,c.textAlign="left";for(let p=0;p<g.length;p++)c.fillText(g[p],d,e?f*.42:f*.5),d+=v[p]+a}else c.fillText(s,u/2,e?f*.42:f*.5);if(c.shadowBlur=8,c.fillStyle=t,a){let g=u/2;const v=s.split(""),m=v.map(S=>c.measureText(S).width),p=m.reduce((S,T)=>S+T,0)+a*(v.length-1);g=u/2-p/2,c.textAlign="left";for(let S=0;S<v.length;S++)c.fillText(v[S],g,e?f*.42:f*.5),g+=m[S]+a}else c.textAlign="center",c.fillText(s,u/2,e?f*.42:f*.5);e&&(c.shadowBlur=0,c.fillStyle="rgba(239,233,223,0.6)",c.font="600 24px Rajdhani, sans-serif",c.textAlign="center",c.fillText(e,u/2,f*.76))},{wrap:He})}function T0(s=0){const t=Ln(100+s*17),e=[["NOIR","#0a1a24","#52d6c9","#d9e6df"],["NIGHT","#1b0b16","#f0497c","#f6e8d8"],["SALE","#241a07","#f0a13c","#f6efdf"],["LOST","#08131c","#8ab4ff","#e8eef5"]],[n,i,r,o]=e[s%e.length];return Xe(384,560,(a,l,h)=>{a.fillStyle=i,a.fillRect(0,0,l,h);const c=a.createRadialGradient(l*.6,h*.28,10,l*.5,h*.4,h*.8);c.addColorStop(0,r+"55"),c.addColorStop(1,"transparent"),a.fillStyle=c,a.fillRect(0,0,l,h);for(let u=0;u<24;u++)a.fillStyle=`rgba(255,255,255,${t()*.05})`,a.fillRect(t()*l,t()*h,t()*90,1+t()*2);a.save(),a.translate(l/2,h*.46),a.strokeStyle=r,a.lineWidth=2,a.globalAlpha=.8,a.beginPath(),a.arc(0,0,92,0,Math.PI*2),a.stroke(),a.beginPath(),a.arc(0,0,64,0,Math.PI*2),a.stroke(),a.globalAlpha=1,a.restore(),a.fillStyle=o,a.textAlign="center",a.font='400 58px "Archivo Black", sans-serif',a.fillText(n,l/2,h*.75),a.font="600 17px Rajdhani, sans-serif",a.fillStyle=r,a.fillText(s%2?"NOW SHOWING · LEVEL 2":"ATRIUM · TONIGHT",l/2,h*.82),a.fillStyle="rgba(239,233,223,0.35)",a.font="500 13px Rajdhani, sans-serif",a.fillText("OMNICORP MALL",l/2,h*.9),a.strokeStyle="rgba(255,255,255,0.16)",a.lineWidth=2,a.strokeRect(12,12,l-24,h-24)},{wrap:He})}function Ah(s=1){const t=Ln(s*991+7);return Xe(512,512,(e,n,i)=>{e.clearRect(0,0,n,i);const r=n/2,o=i/2;for(let a=0;a<28;a++){const l=r+(t()-.5)*260,h=o+(t()-.5)*230,c=12+t()*85,u=e.createRadialGradient(l,h,1,l,h,c);u.addColorStop(0,"rgba(104,8,10,0.95)"),u.addColorStop(.6,"rgba(74,5,8,0.75)"),u.addColorStop(1,"rgba(40,2,4,0)"),e.fillStyle=u,e.beginPath(),e.arc(l,h,c,0,Math.PI*2),e.fill()}e.fillStyle="rgba(70,4,7,0.75)";for(let a=0;a<16;a++){const l=r+(t()-.5)*210;e.fillRect(l,o+(t()-.5)*60,1+t()*4,20+t()*100)}for(let a=0;a<80;a++)e.beginPath(),e.arc(r+(t()-.5)*430,o+(t()-.5)*400,.8+t()*3.2,0,Math.PI*2),e.fillStyle=`rgba(80,5,8,${.3+t()*.5})`,e.fill()},{wrap:He})}function cs(){return Xe(128,128,(s,t,e)=>{const n=s.createRadialGradient(t/2,e/2,0,t/2,e/2,t/2);n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.18,"rgba(255,240,210,0.75)"),n.addColorStop(.5,"rgba(255,190,130,0.16)"),n.addColorStop(1,"rgba(255,160,100,0)"),s.fillStyle=n,s.fillRect(0,0,t,e)},{wrap:He})}function A0(){return Xe(64,64,(s,t,e)=>{const n=s.createRadialGradient(t/2,e/2,0,t/2,e/2,t/2);n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.35,"rgba(255,210,150,0.85)"),n.addColorStop(1,"rgba(255,120,40,0)"),s.fillStyle=n,s.fillRect(0,0,t,e)},{wrap:He})}function R0(){return Xe(256,256,(s,t,e)=>{s.translate(t/2,e/2);const n=s.createRadialGradient(0,0,0,0,0,70);n.addColorStop(0,"rgba(255,255,240,1)"),n.addColorStop(.35,"rgba(255,214,140,0.9)"),n.addColorStop(1,"rgba(255,140,50,0)"),s.fillStyle=n,s.beginPath(),s.arc(0,0,70,0,Math.PI*2),s.fill(),s.globalCompositeOperation="lighter";for(let i=0;i<9;i++){s.rotate(Math.PI*2/9+.12);const r=s.createLinearGradient(0,0,116,0);r.addColorStop(0,"rgba(255,250,225,0.95)"),r.addColorStop(1,"rgba(255,170,70,0)"),s.fillStyle=r,s.beginPath(),s.moveTo(0,-5),s.lineTo(116,0),s.lineTo(0,5),s.closePath(),s.fill()}},{wrap:He})}function C0(){const s=Ln(414);return Xe(256,256,(t,e,n)=>{t.fillStyle="#c9a227",t.fillRect(0,0,e,n),t.fillStyle="#17181a";for(let r=-n;r<e+n;r+=64)t.beginPath(),t.moveTo(r,0),t.lineTo(r+32,0),t.lineTo(r+32-n,n),t.lineTo(r-n,n),t.closePath(),t.fill();for(let r=0;r<6e3;r++)t.fillStyle=`rgba(0,0,0,${s()*.14})`,t.fillRect(s()*e,s()*n,2,2);const i=t.createLinearGradient(0,0,0,n);i.addColorStop(0,"rgba(0,0,0,0.15)"),i.addColorStop(1,"rgba(0,0,0,0.42)"),t.fillStyle=i,t.fillRect(0,0,e,n)},{repeat:[1,1]})}function P0(){return Xe(512,512,(s,t,e)=>{s.fillStyle="#0b1014",s.fillRect(0,0,t,e),s.strokeStyle="rgba(87,216,208,0.5)",s.lineWidth=3,s.strokeRect(14,14,t-28,e-28),s.fillStyle="#57d8d0",s.font="700 24px Rajdhani, sans-serif",s.textAlign="center",s.fillText("ATRIUM DIRECTORY",t/2,52),s.strokeStyle="rgba(87,216,208,0.25)",s.beginPath(),s.moveTo(40,70),s.lineTo(t-40,70),s.stroke();const n=[["CINEMA 8","LEVEL 2"],["GAME OVER ARCADE","LEVEL 2"],["FOOD COURT","LEVEL 1"],["SPORTSWORLD","LEVEL 1"],["PHARMACY","LEVEL 1"],["TOYBOX","LEVEL 1"],["PARKING","P2"],["EXIT","SEALED"]];s.textAlign="left",s.font="600 22px Rajdhani, sans-serif",n.forEach(([i,r],o)=>{const a=112+o*48;s.fillStyle=o===n.length-1?"#e23b32":"#cfe6e2",s.fillText(i,46,a),s.textAlign="right",s.fillStyle="rgba(207,230,226,0.45)",s.fillText(r,t-46,a),s.textAlign="left",s.strokeStyle="rgba(87,216,208,0.1)",s.beginPath(),s.moveTo(46,a+13),s.lineTo(t-46,a+13),s.stroke()})},{wrap:He})}new E;class L0{constructor(t){this.game=t,this.group=new Vt,this.group.name="mall",this.colliders=[],this.impactMeshes=[],this.spawnPoints=[],this.flickers=[],this.banners=[],this.glowSprites=[],this.rnd=Ln(20241),this.build()}build(){this.createMaterials(),this.createFloors(),this.createShell(),this.createColumns(),this.createStorefronts(),this.createUpperLevel(),this.createCinema(),this.createEscalators(),this.createEntrance(),this.createAtrium(),this.createProps(),this.createBarricades(),this.createLighting(),this.createSigns(),this.createBanners(),this.createDust(),this.createSpawnPoints()}createMaterials(){const{map:t,rough:e}=S0();this.mats={floor:new dt({map:t,roughnessMap:e,roughness:.62,metalness:.12,envMapIntensity:1.35,color:12107464}),carpet:new dt({map:E0(),roughness:.96,metalness:0,color:11577506}),concrete:new dt({map:w0([2,1]),roughness:.9,metalness:.03,color:10462120}),tileWall:new dt({map:b0([3,2]),roughness:.55,metalness:.1,color:12173508,envMapIntensity:.8}),ceiling:new dt({color:1580323,roughness:.94,metalness:.08}),darkMetal:new dt({color:1777702,roughness:.42,metalness:.75,envMapIntensity:1.1}),steel:new dt({color:5791590,roughness:.3,metalness:.85,envMapIntensity:1.2}),brass:new dt({color:10122818,roughness:.32,metalness:.9,envMapIntensity:1.3}),black:new dt({color:790033,roughness:.5,metalness:.4}),glass:new Ua({color:11065565,roughness:.06,metalness:.1,transparent:!0,opacity:.14,envMapIntensity:2.2,side:ve,depthWrite:!1}),glassDark:new Ua({color:7113616,roughness:.08,metalness:.2,transparent:!0,opacity:.24,envMapIntensity:1.8,side:ve,depthWrite:!1}),wood:new dt({color:4861728,roughness:.68,metalness:.05}),darkWood:new dt({color:2759186,roughness:.7,metalness:.03}),leaf:new dt({color:2575154,roughness:.85,metalness:0}),leafLight:new dt({color:3959619,roughness:.8,metalness:0}),fabric:new dt({color:7023403,roughness:.95,metalness:0}),fabricDark:new dt({color:2369068,roughness:.96,metalness:0}),storeWarm:new dt({color:6968128,roughness:.85,metalness:.05}),white:new dt({color:14276302,roughness:.65,metalness:.02}),redPlastic:new dt({color:10362652,roughness:.4,metalness:.1}),mannequin:new dt({color:13617339,roughness:.55,metalness:.02}),hazard:new dt({map:C0(),roughness:.8,metalness:.1}),glowWarm:new bt({color:16769196,toneMapped:!1}),glowCool:new bt({color:13232895,toneMapped:!1}),glowRed:new bt({color:16723748,toneMapped:!1}),glowTeal:new bt({color:6488041,toneMapped:!1}),glowMagenta:new bt({color:16727194,toneMapped:!1}),glowAmber:new bt({color:16757575,toneMapped:!1}),glowGreen:new bt({color:7864202,toneMapped:!1})},this.mats.floor.map.needsUpdate=!0,this.bloodMats=[0,1,2,3].map(n=>new bt({map:Ah(n+1),transparent:!0,opacity:.82,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,color:9257281})),this.glowTex=cs()}createFloors(){const t=new P(new Ht(46,94),this.mats.floor);t.rotation.x=-Math.PI/2,t.receiveShadow=!0,t.userData.impact="floor",this.group.add(t);const e=new P(new Ht(7.2,78),this.mats.carpet);e.rotation.x=-Math.PI/2,e.position.set(0,.012,-4),e.receiveShadow=!0,this.group.add(e);const n=new P(new Ht(2.2,60),this.mats.carpet);n.rotation.x=-Math.PI/2,n.position.set(-10.5,.01,0);const i=n.clone();i.position.x=10.5,this.group.add(n,i);const r=new P(new Fi(3.4,5.2,64),new dt({color:2304307,roughness:.35,metalness:.8,envMapIntensity:1.2}));r.rotation.x=-Math.PI/2,r.position.set(0,.018,2),this.group.add(r);const o=new P(new Fi(5.3,5.55,64),this.mats.brass);o.rotation.x=-Math.PI/2,o.position.set(0,.019,2),this.group.add(o),[[4.2,7.7,.2,3.1],[-6.5,3.2,1.3,2.6],[9.5,-8.4,2.4,4.2],[-2.3,-17,.7,3.4],[7.8,21,4.8,5.1],[-11.2,14,2.2,3],[1.2,31,5.4,2.9],[12,-27,1.1,4.4],[-8,-34,.4,3.6],[14,4,3.8,2.2],[-14.5,-8,2.7,3.4]].forEach(([l,h,c,u],f)=>{const d=new P(new Ht(u,u),this.bloodMats[f%this.bloodMats.length]);d.rotation.x=-Math.PI/2,d.rotation.z=c,d.position.set(l,.024,h),this.group.add(d)})}createShell(){const e=(i,r,o,a,l,h,c,u=!0,f=!1)=>{const d=new P(new vt(i,r,o,2,.02),a);return d.position.set(l,h,c),d.castShadow=f,d.receiveShadow=!0,d.userData.impact=!0,this.group.add(d),u&&this.addCollider(l,c,i,o),d};e(46,.4,94,this.mats.ceiling,0,14.2,0,!1),e(46,5.4,.5,this.mats.tileWall,0,5.4/2,-46.8,!0),e(46,5.4,.5,this.mats.tileWall,0,5.4/2,46.8,!0),e(.5,5.4,94,this.mats.tileWall,-22.8,5.4/2,0,!0),e(.5,5.4,94,this.mats.tileWall,22.8,5.4/2,0,!0);const n=this.mats.darkMetal;for(const i of[-46.2,46.2]){const r=new P(new ut(46,.36,.5),n);r.position.set(0,5.3,i),this.group.add(r)}for(let i=-44;i<=44;i+=8){const r=new P(new vt(30,.55,.5,2,.04),this.mats.darkMetal);r.position.set(0,13.5,i),r.receiveShadow=!0,this.group.add(r)}for(let i=-18;i<=18;i+=6){const r=new P(new vt(.4,.5,92,2,.04),this.mats.darkMetal);r.position.set(i,13.5,0),this.group.add(r)}this.createSkylight()}createSkylight(){const t=new bt({color:7314884,transparent:!0,opacity:.1,side:ve,depthWrite:!1}),e=new P(new Ht(20,40),t);e.rotation.x=Math.PI/2,e.position.set(0,14.05,0),this.group.add(e);const n=this.mats.darkMetal;for(let a=-20;a<=20;a+=5){const l=new P(new ut(20,.12,.22),n);l.position.set(0,14,a),this.group.add(l)}for(let a=-10;a<=10;a+=5){const l=new P(new ut(.22,.12,40),n);l.position.set(a,14,0),this.group.add(l)}const i=new P(new bn(1.6,32),new bt({color:14478079,toneMapped:!1}));i.rotation.x=Math.PI/2,i.position.set(4.8,14.01,-5),this.group.add(i);const r=new Me(new me({map:this.glowTex,color:10339583,transparent:!0,opacity:.55,blending:fe,depthWrite:!1}));r.scale.set(9,9,1),r.position.set(4.8,13.9,-5),this.group.add(r);const o=new De({uniforms:{uColor:{value:new Ct(10405887)},uOpacity:{value:.15}},vertexShader:`varying vec2 vUv; varying vec3 vN; varying vec3 vWorld;
        void main(){ vUv = uv; vN = normalize(normalMatrix * normal);
          vec4 wp = modelMatrix * vec4(position, 1.0); vWorld = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`varying vec2 vUv; varying vec3 vN; varying vec3 vWorld; uniform vec3 uColor; uniform float uOpacity;
        void main(){ vec3 viewDir = normalize(cameraPosition - vWorld);
          float facing = abs(dot(normalize(vN), viewDir));
          float soft = smoothstep(0.02, 0.55, facing);
          float fade = smoothstep(0.0, 0.55, vUv.y) * (1.0 - smoothstep(0.75, 1.0, vUv.y));
          float a = soft * fade * uOpacity;
          gl_FragColor = vec4(uColor, a); }`,transparent:!0,depthWrite:!1,blending:fe,side:Ie});for(const[a,l,h]of[[4.8,-5,7.5],[-5,9,6],[7,15,5]]){const c=new P(new nr(h,13.8,32,1,!0),o.clone());c.material.uniforms.uOpacity.value=.075,c.position.set(a,7.1,l),c.renderOrder=4,this.group.add(c)}this.moonlightShafts=!0}createColumns(){const t=[-40,-28,-16,-4,8,20,32,42];for(const e of[-1,1])for(const n of t){const i=e*13.6,r=new P(new vt(1.05,14,1.05,3,.03),this.mats.concrete);r.position.set(i,7,n),r.castShadow=!1,r.receiveShadow=!0,r.userData.impact=!0,this.group.add(r);const o=new P(new ut(1.3,.18,1.3),this.mats.brass);o.position.set(i,3.5,n),this.group.add(o);const a=o.clone();a.position.y=9.2,this.group.add(a);const l=new P(new ut(.045,4,.045),e>0?this.mats.glowTeal:this.mats.glowCool);if(l.position.set(i-e*.54,6.4,n+.4),this.group.add(l),this.addCollider(i,n,1.05,1.05),n===20||n===-28){const h=new P(new we(.16,12,8),this.mats.glowRed);h.position.set(i,4.4,n+.56),this.group.add(h);const c=new Me(new me({map:this.glowTex,color:16724518,transparent:!0,opacity:.6,blending:fe,depthWrite:!1}));c.scale.set(1.1,1.1,1),c.position.copy(h.position),this.group.add(c),this.flickers.push({mesh:h,light:null,glow:c,base:.7,speed:5+this.rnd()*6,phase:this.rnd()*10})}}}createStorefronts(){const t=[{side:-1,z:-40,name:"VANITY",color:"#ff7fb2",style:"fashion"},{side:-1,z:-26,name:"TOYBOX",color:"#ffcf4d",style:"toys"},{side:-1,z:-12,name:"PHARMACY",color:"#71ff9a",style:"pharmacy"},{side:-1,z:6,name:"URBAN",color:"#8fd0ff",style:"fashion"},{side:-1,z:20,name:"JEWEL BOX",color:"#ffe6a0",style:"jewel"},{side:-1,z:34,name:"CAFÉ NOIR",color:"#ff9c62",style:"cafe"},{side:1,z:-40,name:"SPORTSWORLD",color:"#8dff6b",style:"sports"},{side:1,z:-26,name:"GAME OVER",color:"#ff4fd2",style:"arcade"},{side:1,z:-12,name:"FOOD COURT",color:"#5fffe3",style:"food"},{side:1,z:6,name:"TEChNOIR",color:"#7ea7ff",style:"tech"},{side:1,z:20,name:"CINEMA 8",color:"#ffb347",style:"cinema"},{side:1,z:34,name:"SHOE DEPT.",color:"#ffd16e",style:"shoes"}];for(const e of t)this.createStorefront(e)}createStorefront(t){const{side:e,z:n,name:i,color:r,style:o}=t,a=e*18,l=11.4,h=e*24.4,c=new P(new ut(12.6,5.2,l),new dt({color:1185050,roughness:.9,metalness:.05}));c.position.set(e*21.2,2.6,n),this.group.add(c);const u=new P(new Ht(l,5.2),new dt({color:1909290,roughness:.85}));u.position.set(h,2.6,n),u.rotation.y=e>0?-Math.PI/2:Math.PI/2,this.group.add(u);const f=new P(new vt(.5,1.45,l,2,.02),new dt({color:1382430,roughness:.5,metalness:.5}));f.position.set(a,4.68,n),this.group.add(f);const d=new P(new ut(.55,.34,l),this.mats.darkMetal);d.position.set(a,.17,n),this.group.add(d);for(const p of[n-l/2,n+l/2]){const S=new P(new ut(.6,5.2,.34),this.mats.darkMetal);S.position.set(a,2.6,p),this.group.add(S)}for(const p of[-2.9,2.9]){const S=new P(new Ht(4.9,3.9),this.mats.glass);S.rotation.y=e>0?-Math.PI/2:Math.PI/2,S.position.set(a-e*.04,2.15,n+p),S.userData.impact=!1,this.group.add(S)}const g=new Vt;for(const[p,S,T,y]of[[0,-.7,.06,.1],[0,.7,.06,.1],[0,0,.08,.06]]){const F=new P(new ut(T,3.9,y),this.mats.steel);F.position.set(a,2.15,n+S),g.add(F)}const v=new P(new ut(.1,.9,.06),this.mats.brass);v.position.set(a-e*.08,1.5,n+.48),g.add(v),this.group.add(g),this.addStoreSign(i,r,e,n,4.68),this.addInterior(o,e,n,r),this.addCollider(a,n,1.4,l);const m=new P(new ut(.12,.12,l-1.6),new bt({color:16769712,toneMapped:!1}));if(m.position.set(e*22.6,5.05,n),this.group.add(m),this.rnd()>.45){const p=new P(new Ht(.9,1.2),this.bloodMats[this.rnd()>.5?1:3]);p.rotation.y=e>0?-Math.PI/2:Math.PI/2,p.position.set(a-e*.07,1.8,n+(this.rnd()-.5)*6),this.group.add(p)}}addStoreSign(t,e,n,i,r){const o=un(t,{color:e,fontSize:t.length>9?86:104,letterSpacing:5,background:"rgba(8,10,14,0.96)"}),a=new bt({map:o,toneMapped:!1}),l=new P(new Ht(6.6,1.32),a);l.rotation.y=n>0?-Math.PI/2:Math.PI/2,l.position.set(n*17.66,r,i),this.group.add(l);const h=new Me(new me({map:this.glowTex,color:new Ct(e),transparent:!0,opacity:.4,blending:fe,depthWrite:!1}));h.scale.set(7,2.6,1),h.position.set(n*17.4,r,i),this.group.add(h),this.glowSprites.push(h)}addInterior(t,e,n,i){const r=e*21,o=(a,l=.8,h=.05)=>new dt({color:a,roughness:l,metalness:h});if(t==="arcade"){for(let l=0;l<5;l++){const h=new Vt,c=new P(new ut(1.1,1.85,.8),o(1447708,.5,.4));c.position.y=.93,h.add(c);const u=new P(new Ht(.78,.58),new bt({color:l%2?16727206:4780256,toneMapped:!1}));u.position.set(0,1.28,-.41),u.rotation.y=Math.PI,h.add(u);const f=new P(new Ht(.9,.24),new bt({color:l%2?16765018:5945087,toneMapped:!1}));f.position.set(0,1.93,-.41),f.rotation.y=Math.PI,h.add(f),h.position.set(r+e*(l%2)*.4,0,n-3.8+l*1.9),h.rotation.y=e>0?-.12:.12,this.group.add(h)}const a=new Re(16727206,55,12,2);a.position.set(e*20.6,3,n),this.group.add(a),this.flickers.push({light:a,base:55,speed:9,phase:2})}else if(t==="food"){for(let l=0;l<4;l++){const h=new P(new Gt(.55,.55,.06,16),o(10125410,.45,.2));h.position.set(r+e*(l%2)*.8,.75,n-3.4+l*2.1),this.group.add(h);const c=new P(new Gt(.05,.05,.75,8),this.mats.steel);c.position.set(h.position.x,.37,h.position.z),this.group.add(c);for(const u of[0,Math.PI]){const f=new P(new ut(.5,.06,.5),this.mats.redPlastic);f.position.set(h.position.x+Math.cos(u+(e>0?0:Math.PI))*.85,.48,h.position.z+Math.sin(u)*.85),this.group.add(f)}}const a=new Re(6291427,45,11,2);a.position.set(e*20.4,3.1,n),this.group.add(a)}else if(t==="cinema"){const a=new P(new Ht(4.2,2.2),new bt({color:10336255,toneMapped:!1,transparent:!0,opacity:.5}));a.rotation.y=e>0?-Math.PI/2:Math.PI/2,a.position.set(e*23.8,3.1,n),this.group.add(a);const l=new Re(9086719,45,12,2);l.position.set(e*20.4,3,n),this.group.add(l),this.flickers.push({light:l,base:45,speed:13,phase:5})}else if(t==="fashion"){for(let l=0;l<3;l++){const h=this.makeMannequin(e>0?2764342:7162428);h.position.set(r+e*.5,0,n-2.8+l*2.6),h.rotation.y=e>0?-.4:.4,this.group.add(h)}const a=new P(new Gt(.03,.03,3.4,8),this.mats.steel);a.rotation.z=Math.PI/2,a.rotation.y=Math.PI/2,a.position.set(r-e*1.4,1.85,n+2.2),this.group.add(a)}else if(t==="sports")for(let a=0;a<4;a++){const l=new P(new ut(1.7,.08,.5),o(2369582,.7));l.position.set(r,.4+a*.55,n-2.5+a*1.6),this.group.add(l);const h=new P(new we(.3,12,8),o(a%2?13986346:13617072,.6));h.position.set(r-e*.5,.75+a*.55,n-2.5+a*1.6),this.group.add(h)}else if(t==="pharmacy"){for(let l=0;l<3;l++){const h=new P(new ut(.6,2.3,2.4),o(13617854,.7));h.position.set(r+e*1.1,1.15,n-2.4+l*2.4),this.group.add(h)}const a=new P(new Ht(.55,1.5),new bt({color:6094716,toneMapped:!1}));a.rotation.y=e>0?-Math.PI/2:Math.PI/2,a.position.set(e*23.9,3.5,n),this.group.add(a)}else if(t==="toys")for(let a=0;a<6;a++){const l=new P(new ut(.5,.5,.5),o([14826290,3112418,15778620,3124835][a%4],.6));l.position.set(r+(this.rnd()-.5)*2,.4+a%2*.6,n-3.4+a*1.2),l.rotation.set(this.rnd(),this.rnd()*3,this.rnd()),this.group.add(l)}else if(t==="jewel"){const a=new dt({color:2760984,roughness:.25,metalness:.7,envMapIntensity:1.4});for(let l=0;l<3;l++){const h=new P(new ut(.8,.9,1.5),a);h.position.set(r,.45,n-1.8+l*1.8),this.group.add(h);const c=new P(new ut(.02,.05,1.3),this.mats.glowWarm);c.position.set(r-e*.42,.9,n-1.8+l*1.8),this.group.add(c)}}else if(t==="tech")for(let a=0;a<5;a++){const l=new P(new ut(.12,.9,1.5),this.mats.black);l.position.set(r,2+a%2*.9,n-3+a*1.5),this.group.add(l);const h=new P(new Ht(1.3,.72),new bt({color:a%2?5213695:5302480,toneMapped:!1,transparent:!0,opacity:.75}));h.rotation.y=e>0?-Math.PI/2:Math.PI/2,h.position.set(r-e*.08,2+a%2*.9,n-3+a*1.5),this.group.add(h)}else if(t==="shoes")for(let a=0;a<5;a++){const l=new P(new ut(1.2,.1,.4),o(2828844,.7));l.position.set(r,.4+a*.4,n+1),this.group.add(l)}else if(t==="cafe"){const a=new P(new ut(1.2,1.1,4),o(4862500,.5));a.position.set(r,.55,n+1),this.group.add(a);for(let h=0;h<3;h++){const c=new P(new Gt(.26,.3,.08,12),this.mats.redPlastic);c.position.set(r-e*1.1,.62,n-1+h*1.2),this.group.add(c)}const l=new Re(16751714,38,11,2);l.position.set(e*20.2,3,n),this.group.add(l)}}makeMannequin(t){const e=new Vt,n=new dt({color:t,roughness:.55,metalness:.05}),i=new P(new an(.22,.55,4,8),n);i.position.y=1.18,e.add(i);const r=new P(new we(.16,12,10),this.mats.mannequin);r.position.y=1.68,e.add(r);const o=new P(new Gt(.09,.07,.85,8),n);o.position.y=.45,e.add(o);const a=new P(new Gt(.28,.32,.05,12),this.mats.darkMetal);return a.position.y=.03,e.add(a),e.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!0)}),e}createUpperLevel(){const t=this.mats.concrete;for(const n of[-1,1]){const i=new P(new vt(8.6,.42,92,2,.03),t);i.position.set(n*18.1,5.45,0),i.receiveShadow=!0,this.group.add(i);const r=new P(new ut(.2,.7,92),this.mats.darkMetal);r.position.set(n*13.8,5.2,0),this.group.add(r);const o=new P(new Ht(92,1.05),this.mats.glass);o.rotation.y=Math.PI/2,o.position.set(n*13.9,6.15,0),this.group.add(o);const a=new P(new ut(.09,.09,92),this.mats.steel);a.position.set(n*13.9,6.7,0),this.group.add(a);for(let u=-45;u<=45;u+=3){const f=new P(new ut(.05,1.1,.05),this.mats.steel);f.position.set(n*13.9,6.15,u),this.group.add(f)}this.addCollider(n*13.9,0,.3,92);for(let u=0;u<6;u++){const f=-38+u*15,d=new P(new vt(.5,4.6,12.4,2,.02),new dt({color:u%2?1711910:2106669,roughness:.7,metalness:.2}));d.position.set(n*18.2,8.1,f),this.group.add(d);const g=new P(new Ht(11.6,3.2),this.mats.glassDark);g.rotation.y=n>0?-Math.PI/2:Math.PI/2,g.position.set(n*17.92,8.2,f),this.group.add(g);const v=new P(new Ht(4.4,.8),new bt({map:un(["OBSIDIAN","LUMEN","NORTHFACE","PULSE","AURUM","VERTIGO"][u],{color:["#cfd8e0","#80e8ff","#ffd37a","#ff6aa8","#e9d18a","#a0b4ff"][u],fontSize:82,letterSpacing:6}),toneMapped:!1}));v.rotation.y=n>0?-Math.PI/2:Math.PI/2,v.position.set(n*17.9,10.2,f),this.group.add(v);const m=new P(new ut(.08,.08,11.4),new bt({color:16769971,toneMapped:!1}));m.position.set(n*17.8,6.55,f),this.group.add(m)}const l=new P(new ut(.5,8.6,92),this.mats.tileWall);l.position.set(n*22.8,9.7,0),this.group.add(l);const h=new P(new ut(9,8.6,.5),this.mats.tileWall);h.position.set(n*18.1,9.7,-46.1),this.group.add(h);const c=h.clone();c.position.z=46.1,this.group.add(c)}const e=new P(new ut(46,.3,94),this.mats.ceiling);e.position.set(0,14.1,0),this.group.add(e)}createCinema(){const e=new P(new ut(28,13,.5),new dt({color:1316894,roughness:.8}));e.position.set(0,6.5,-46.1),e.receiveShadow=!0,this.group.add(e);const n=new P(new ut(13,6.2,.8),this.mats.black);n.position.set(0,3.1,-46.1+.4),this.group.add(n);const i=new dt({color:5706776,roughness:.95,side:ve});for(const f of[-5.6,5.6]){const d=new P(new Ht(2.2,5.4),i);d.position.set(f,2.8,-46.1+.85),this.group.add(d)}const r=new P(new Ht(7.6,4.2),this.mats.glassDark);r.position.set(0,2.4,-46.1+.86),this.group.add(r);for(const f of[-3.8,0,3.8]){const d=new P(new ut(.1,4.4,.12),this.mats.steel);d.position.set(f,2.4,-46.1+.9),this.group.add(d)}const o=un("CINEMA 8",{color:"#ffbe5c",fontSize:132,letterSpacing:8,sub:"NOW SHOWING · DAWN OF THE DEAD",background:"rgba(10,8,8,0.98)"}),a=new P(new Ht(15,3.75),new bt({map:o,toneMapped:!1}));a.position.set(0,8.9,-46.1+.32),this.group.add(a);const l=new Me(new me({map:this.glowTex,color:16757575,transparent:!0,opacity:.34,blending:fe,depthWrite:!1}));l.scale.set(18,6,1),l.position.set(0,8.9,-46.1+.9),this.group.add(l);const h=new Re(16757575,150,28,2);h.position.set(0,8.4,-46.1+3.2),this.group.add(h),this.flickers.push({light:h,base:150,speed:2.2,phase:1});for(let f=0;f<3;f++)for(const d of[-1,1]){const g=new P(new ut(2.15,3.1,.16),this.mats.darkMetal);g.position.set(d*(8.8+f*2.5),5.2,-46.1+.35),this.group.add(g);const v=new P(new Ht(1.9,2.85),new bt({map:T0((f+(d>0?2:0))%4),toneMapped:!1}));v.position.set(d*(8.8+f*2.5),5.2,-46.1+.45),this.group.add(v)}const c=new P(new vt(3,2.4,1.6,2,.04),this.mats.darkWood);c.position.set(9.5,1.2,-46.1+2.4),this.group.add(c),this.addCollider(9.5,-46.1+2.4,3,1.6);const u=new P(new ut(3.4,.2,1.9),this.mats.brass);u.position.set(9.5,2.5,-46.1+2.4),this.group.add(u);for(const f of[-1,1]){for(let g=0;g<4;g++){const v=new P(new Gt(.045,.045,.95,8),this.mats.brass);v.position.set(f*(3+g*2.6),.5,-46.1+4.2),this.group.add(v)}const d=new P(new Gt(.028,.028,7.8,8),new dt({color:8000800,roughness:.9}));d.rotation.z=Math.PI/2,d.position.set(f*6.9,.92,-46.1+4.2),this.group.add(d)}}createEntrance(){const e=this.mats.glassDark,n=new P(new ut(30,12,.5),new dt({color:1382944,roughness:.8}));n.position.set(0,6,46.1),n.receiveShadow=!0,this.group.add(n);const i=new P(new Ht(12,6),e);i.rotation.y=Math.PI,i.position.set(0,3,46.1-.32),this.group.add(i);for(const c of[-6,-2,2,6]){const u=new P(new ut(.18,6.2,.3),this.mats.steel);u.position.set(c,3.1,46.1-.4),this.group.add(u)}const r=new P(new ut(13,.24,.4),this.mats.steel);r.position.set(0,6.1,46.1-.4),this.group.add(r);for(let c=0;c<4;c++){const u=new P(new ut(14-c*.6,.34,.09),this.mats.darkWood);u.position.set(0,1.1+c*1.15,46.1-.52),u.rotation.z=(c%2?1:-1)*.035,this.group.add(u)}const o=new bt({color:15123234,transparent:!0,opacity:.92,side:ve});for(let c=0;c<2;c++){const u=new P(new Ht(15,.16),o);u.position.set(0,2.2+c*1.4,46.1-.58),u.rotation.z=.12-c*.2,u.material=o.clone(),this.group.add(u)}const a=new P(new Ht(2.4,.9),new bt({map:un("EXIT",{color:"#ff3a30",fontSize:150,letterSpacing:10,background:"rgba(10,4,4,0.96)"}),toneMapped:!1}));a.position.set(0,7.4,46.1-.3),a.rotation.y=Math.PI,this.group.add(a);const l=new Me(new me({map:this.glowTex,color:16723748,transparent:!0,opacity:.4,blending:fe,depthWrite:!1}));l.scale.set(4,2.4,1),l.position.set(0,7.4,46.1-.5),this.group.add(l);const h=new P(new Ht(11,2.4),new bt({map:un("SHOP UNTIL YOU DROP",{color:"#efe9df",fontSize:82,letterSpacing:4,background:"rgba(12,10,10,0.96)"}),toneMapped:!1}));h.position.set(0,9.4,46.1-.3),h.rotation.y=Math.PI,this.group.add(h)}createAtrium(){const t=new dt({color:3093563,roughness:.6,metalness:.15}),e=new P(new Gt(3.7,3.9,.55,48),t);e.position.set(0,.28,2),e.receiveShadow=!0,e.castShadow=!0,e.userData.impact=!0,this.group.add(e),this.addCollider(0,2,7.6,7.6);const n=new P(new Gt(3.1,3.3,.5,48),new dt({color:1974824,roughness:.35,metalness:.4}));n.position.set(0,.42,2),this.group.add(n);const i=new P(new bn(3.05,48),new dt({color:659732,roughness:.06,metalness:.85,envMapIntensity:2}));i.rotation.x=-Math.PI/2,i.position.set(0,.58,2),this.group.add(i);const r=new P(new Gt(.9,1.2,1.4,24),t);r.position.set(0,1.25,2),r.userData.impact=!0,this.group.add(r);for(let u=0;u<3;u++){const f=new P(new Gt(1.6-u*.4,1.7-u*.4,.2,24),t);f.position.set(0,.9+u*.5,2),this.group.add(f)}const o=this.makeMannequin(2896699);o.scale.set(1.3,1.3,1.3),o.position.set(0,2.1,2),this.group.add(o);const a=new Re(7845846,70,16,2);a.position.set(0,3.5,2),this.group.add(a);const l=[[-10.5,-20],[10.5,-5],[-10.5,26],[10.5,30],[-10.5,2],[10.5,-35]];for(const[u,f]of l)this.createPlanter(u,f);for(const[u,f,d]of[[-9,12,0],[9,14,Math.PI],[-9.5,-10,0],[9.5,-18,Math.PI],[-8,36,Math.PI/2],[8,-38,-Math.PI/2]])this.createBench(u,f,d);this.createKiosk(-7.4,22,16747068),this.createKiosk(8.2,10,5560063),this.createKiosk(-6.8,-26,13685978);const h=new P(new ut(.16,2.6,1.5),this.mats.darkMetal);h.position.set(10.8,1.3,1),this.group.add(h);const c=new P(new Ht(1.35,2.2),new bt({map:P0(),toneMapped:!1}));c.rotation.y=-Math.PI/2,c.position.set(10.7,1.45,1),this.group.add(c),this.addCollider(10.8,1,.5,1.5);for(const[u,f,d]of[[-4.2,28,.5],[6.3,-14,-1.2],[11,27,2.2]])this.createCart(u,f,d)}createPlanter(t,e){const n=new P(new vt(2.5,.9,2.5,2,.05),this.mats.concrete);n.position.set(t,.45,e),n.castShadow=!0,n.receiveShadow=!0,n.userData.impact=!0,this.group.add(n);const i=new P(new ut(2.2,.08,2.2),new dt({color:1774606,roughness:1}));i.position.set(t,.92,e),this.group.add(i);const r=this.rnd;for(let o=0;o<7;o++){const a=1.1+r()*1.8,l=new P(new Gt(.035,.06,a,5),this.mats.darkWood);l.position.set(t+(r()-.5)*1.1,.9+a/2,e+(r()-.5)*1.1),l.rotation.z=(r()-.5)*.35,l.rotation.x=(r()-.5)*.35,this.group.add(l);for(let h=0;h<3;h++){const c=new P(new nr(.35+r()*.3,.7+r()*.6,6),r()>.5?this.mats.leaf:this.mats.leafLight);c.position.set(l.position.x+(r()-.5)*.5,.9+a*(.6+r()*.4),l.position.z+(r()-.5)*.5),c.rotation.set(r(),r(),r()),c.castShadow=!0,this.group.add(c)}}this.addCollider(t,e,2.5,2.5)}createBench(t,e,n){const i=new Vt,r=new P(new vt(3.2,.16,.9,2,.04),this.mats.wood);r.position.y=.55,r.castShadow=!0,i.add(r);const o=new P(new vt(3.2,.75,.14,2,.04),this.mats.wood);o.position.set(0,.95,.4),o.rotation.x=-.12,i.add(o);for(const a of[-1.25,1.25]){const l=new P(new ut(.12,.55,.72),this.mats.darkMetal);l.position.set(a,.28,0),i.add(l)}i.position.set(t,0,e),i.rotation.y=n,i.traverse(a=>{a.isMesh&&(a.castShadow=!0,a.receiveShadow=!0,a.userData.impact=!0)}),this.group.add(i),this.addCollider(t,e,Math.abs(Math.cos(n))*3.2+Math.abs(Math.sin(n))*.9,Math.abs(Math.sin(n))*3.2+Math.abs(Math.cos(n))*.9)}createKiosk(t,e,n){const i=new Vt,r=new P(new vt(2.6,1.05,1.6,2,.05),this.mats.darkMetal);r.position.y=.55,r.castShadow=!0,i.add(r);const o=new P(new vt(2.9,.12,1.9,2,.03),this.mats.steel);o.position.y=1.12,i.add(o);const a=new P(new ut(3,.1,2),new dt({color:n,roughness:.5}));a.position.y=2.5,i.add(a);for(const u of[-1.2,1.2])for(const f of[-.7,.7]){const d=new P(new Gt(.035,.035,1.4,8),this.mats.steel);d.position.set(u,1.8,f),i.add(d)}const l=new P(new ut(2.7,.05,1.7),new bt({color:16772548,toneMapped:!1}));l.position.y=2.42,i.add(l);const h="#"+new Ct(n).getHexString(),c=new P(new Ht(2.6,.5),new bt({map:un(["PRETZEL","PHONE CASE","SUNGLASSES"][Math.floor(this.rnd()*3)],{color:h,fontSize:120,letterSpacing:4}),toneMapped:!1}));c.position.set(0,2,.86),i.add(c),i.position.set(t,0,e),i.traverse(u=>{u.isMesh&&(u.castShadow=!0,u.receiveShadow=!0,u.userData.impact=!0)}),this.group.add(i),this.addCollider(t,e,2.9,1.9)}createCart(t,e,n){const i=new Vt,r=new dt({color:9146775,roughness:.35,metalness:.85,side:ve}),o=new P(new ut(1.1,.62,.75),r);o.position.y=.85,i.add(o);for(let l=0;l<5;l++){const h=new P(new ut(1.12,.02,.02),this.mats.steel);h.position.set(0,.6+l*.12,.38),i.add(h)}const a=new P(new ut(1.14,.05,.05),this.mats.steel);a.position.set(0,1.05,.62),i.add(a);for(const l of[-.4,.4])for(const h of[-.25,.25]){const c=new P(new Gt(.08,.08,.05,10),this.mats.black);c.rotation.z=Math.PI/2,c.position.set(l,.08,h),i.add(c)}i.position.set(t,0,e),i.rotation.y=n,this.group.add(i),this.addCollider(t,e,1.2,1.2)}createProps(){for(const[i,r]of[[-12.4,8],[12.4,-22],[-12.4,-34],[12.4,38]]){const o=new P(new Gt(.42,.36,1,12),this.mats.darkMetal);o.position.set(i,.5,r),o.castShadow=!0,o.userData.impact=!0,this.group.add(o);const a=new P(new Gt(.46,.46,.08,12),this.mats.steel);a.position.set(i,1.03,r),this.group.add(a),this.addCollider(i,r,.9,.9)}for(let i=0;i<5;i++){const o=-2+i*2.5,a=new P(new Gt(.05,.05,.95,8),this.mats.brass);a.position.set(4.5,.5,o),this.group.add(a);const l=new P(new Gt(.22,.24,.05,12),this.mats.darkMetal);l.position.set(4.5,.03,o),this.group.add(l)}for(let i=0;i<4;i++){const r=new P(new ut(.8,.16,.6),this.mats.redPlastic);r.position.set(-2+i*1.3,.1,17+i*.6),r.rotation.set(.02,i*1.1,.02),this.group.add(r)}for(let i=0;i<9;i++){const r=.4+this.rnd()*.5,o=new P(new ut(r,r*.8,r*.9),new dt({color:7033913,roughness:.95}));o.position.set(-14+this.rnd()*28,r*.4,-30+this.rnd()*64),o.rotation.y=this.rnd()*3,o.castShadow=!0,this.group.add(o)}const t=new Vt,e=new P(new ut(.55,.75,.04),new dt({color:14136622,roughness:.6}));e.rotation.x=.18,e.position.y=.42,t.add(e);const n=e.clone();n.rotation.x=-.18,n.position.z=-.18,t.add(n),t.position.set(6.5,0,24),t.rotation.y=.6,this.group.add(t)}createBarricades(){const t=new bt({color:15123234,transparent:!0,opacity:.9,side:ve});for(let n=0;n<2;n++){const i=new P(new Ht(13,.13),t);i.position.set(0,1.2+n*2.2,44.5),i.rotation.z=n?-.08:.1,this.group.add(i)}for(let n=0;n<4;n++){const i=new P(new vt(.65,.1,.65,2,.03),this.mats.wood);i.position.set(15.5+n%2*.2,.3+n*.28,12+n%2*.4),i.rotation.set(this.rnd()*.4,this.rnd()*2,this.rnd()*.4),this.group.add(i)}this.addCollider(15.5,12,1.2,1.2);const e=new P(new Ht(8,.5),this.mats.hazard);e.rotation.x=-Math.PI/2,e.position.set(-9.5,.03,-37.5),this.group.add(e)}createEscalators(){for(const t of[-1,1]){const e=new Vt,n=new P(new vt(3.2,.5,13,2,.05),this.mats.darkMetal);n.position.set(0,.25,0),n.rotation.x=-.36,e.add(n);const i=this.mats.glassDark;for(const o of[-1.5,1.5]){const a=new P(new ut(.12,1,13),i);a.position.set(o,.9,0),a.rotation.x=-.36,e.add(a)}const r=new P(new ut(2.9,.08,12.8),this.mats.steel);r.position.set(0,.55,0),r.rotation.x=-.36,e.add(r),e.position.set(t*9.8,0,-35),this.group.add(e),this.addCollider(t*9.8,-35,3.4,12)}}createLighting(){const t=new s0(10467540,2365970,.9);this.group.add(t);const e=new h0(11127551,2.8);e.position.set(12,27,6),e.target.position.set(0,0,-6),e.castShadow=!0,e.shadow.mapSize.set(2048,2048),e.shadow.camera.left=-34,e.shadow.camera.right=34,e.shadow.camera.top=46,e.shadow.camera.bottom=-46,e.shadow.camera.near=1,e.shadow.camera.far=70,e.shadow.bias=-6e-4,e.shadow.normalBias=.045,this.group.add(e,e.target),this.moonLight=e;const n=[-34,-12,12,34];for(const o of n){const a=new Re(16763786,210,38,2);a.position.set(0,9.5,o),this.group.add(a)}const i=new Re(6291427,85,24,2);i.position.set(16,4.5,-12),this.group.add(i);const r=new Re(16727194,70,20,2);r.position.set(16,4.5,-26),this.group.add(r);for(const o of[-1,1])for(let a=-40;a<=40;a+=10){const l=new P(new ut(2.2,.12,.55),this.mats.darkMetal);l.position.set(o*7.5,12.9,a),this.group.add(l);const h=new P(new ut(1.9,.05,.36),new bt({color:16771527,toneMapped:!1,transparent:!0,opacity:.9}));h.position.set(o*7.5,12.82,a),this.group.add(h);const c=new Me(new me({map:this.glowTex,color:16766880,transparent:!0,opacity:.25,blending:fe,depthWrite:!1}));c.scale.set(3,1,1),c.position.set(o*7.5,12.6,a),this.group.add(c),this.rnd()>.55&&this.flickers.push({mesh:h,glow:c,base:.88,speed:6+this.rnd()*12,phase:this.rnd()*20})}for(let o=-40;o<=40;o+=14)for(const a of[-1,1]){const l=new Re(16768174,36,12,2);l.position.set(a*20.5,3.2,o),this.group.add(l)}for(const[o,a]of[[-12.5,-6],[12.5,30]]){const l=new Re(16722462,45,15,2);l.position.set(o,4.6,a),this.group.add(l),this.flickers.push({light:l,base:45,speed:3.5,phase:4+o})}}createSigns(){const t=[["FOOD COURT","#5fffe3",-10.5,38],["CINEMA 8","#ffb347",10.5,-20],["RESTROOMS","#8fb6ff",-10.5,-22],["PARKING P2","#ff6b60",10.5,24]];for(const[i,r,o,a]of t){const l=new P(new Ht(3.4,.64),new bt({map:un(i,{color:r,fontSize:100,letterSpacing:4}),toneMapped:!1,side:ve}));l.position.set(o,8.2,a),l.rotation.y=Math.PI/2,this.group.add(l);const h=new Me(new me({map:this.glowTex,color:new Ct(r),transparent:!0,opacity:.22,blending:fe,depthWrite:!1}));h.scale.set(5,2,1),h.position.set(o,8.2,a),this.group.add(h)}const e=D0(),n=new P(new Ht(14,5),new bt({map:e,toneMapped:!1,side:ve,transparent:!0}));n.position.set(0,9.8,-2),n.rotation.y=0,this.group.add(n),this.banners.push({mesh:n,baseY:9.8,phase:0});for(const i of[-1,1])for(let r=0;r<3;r++){const o=new P(new Ht(1.4,1),new bt({map:un(r===1?"SALE":r===2?"CLOSED":"50% OFF",{color:r===2?"#e23b32":"#f5e9d8",fontSize:118,letterSpacing:3,background:r===2?"rgba(12,6,6,0.94)":"rgba(30,10,10,0.94)"}),toneMapped:!1}));o.rotation.y=i>0?-Math.PI/2:Math.PI/2,o.position.set(i*17.8,2.6,-36+r*20+(i>0?4:0)),this.group.add(o)}}createBanners(){const t=[{text:"OMNICORP",sub:"EVERYTHING UNDER ONE ROOF",color:"#d8e0e4",x:-8.5,z:-14,rot:.1},{text:"EAT · SHOP · SURVIVE",sub:"MALL OF THE DEAD",color:"#e23b32",x:8.5,z:8,rot:-.1}];for(const e of t){const n=un(e.text,{color:e.color,sub:e.sub,fontSize:e.text.length>12?76:104,letterSpacing:5,background:"rgba(9,12,16,0.9)"}),i=new P(new Ht(4.4,2.2),new bt({map:n,toneMapped:!1,side:ve}));i.position.set(e.x,8.3,e.z),i.rotation.y=e.rot,this.group.add(i);const r=new P(new Gt(.035,.035,4.8,8),this.mats.steel);r.rotation.z=Math.PI/2,r.position.set(e.x,9.45,e.z),this.group.add(r);for(const o of[-2.1,2.1]){const a=new P(new Gt(.012,.012,5.2,4),this.mats.steel);a.position.set(e.x+o,11.9,e.z),a.rotation.z=.18*Math.sign(o),this.group.add(a)}this.banners.push({mesh:i,baseY:8.3,phase:this.rnd()*6})}}createDust(){const e=new Te,n=new Float32Array(900*3),i=new Float32Array(900);for(let o=0;o<900;o++)n[o*3]=(Math.random()-.5)*30,n[o*3+1]=Math.random()*12,n[o*3+2]=(Math.random()-.5)*88,i[o]=.04+Math.random()*.12;e.setAttribute("position",new je(n,3));const r=new vh({size:.055,map:this.glowTex,transparent:!0,opacity:.5,depthWrite:!1,blending:fe,color:13623528,sizeAttenuation:!0});this.dust=new Gm(e,r),this.dustSpeeds=i,this.group.add(this.dust)}createSpawnPoints(){this.spawnPoints=[new E(0,0,-42),new E(-7,0,-41),new E(7,0,-41),new E(-12,0,-39),new E(12,0,-39),new E(0,0,43),new E(-8,0,42),new E(8,0,42),new E(0,0,20),new E(-8,0,19),new E(8,0,20),new E(-12,0,41),new E(12,0,41),new E(-12,0,29),new E(12,0,27)]}addCollider(t,e,n,i){this.colliders.push({minX:t-n/2,maxX:t+n/2,minZ:e-i/2,maxZ:e+i/2})}collide(t,e=.38){for(const n of this.colliders){const i=Nt.clamp(t.x,n.minX,n.maxX),r=Nt.clamp(t.z,n.minZ,n.maxZ);let o=t.x-i,a=t.z-r,l=o*o+a*a;if(l<e*e){let h=Math.sqrt(l);h<1e-5&&(o=t.x-(n.minX+n.maxX)/2,a=t.z-(n.minZ+n.maxZ)/2,h=Math.sqrt(o*o+a*a)||1);const c=(e-h)/h;t.x+=o*c,t.z+=a*c}}return t.x=Nt.clamp(t.x,-21.8,21.8),t.z=Nt.clamp(t.z,-45.2,45.2),t}isClear(t,e,n=.45){for(const i of this.colliders){const r=Nt.clamp(t,i.minX,i.maxX),o=Nt.clamp(e,i.minZ,i.maxZ),a=t-r,l=e-o;if(a*a+l*l<n*n)return!1}return!0}getSpawnPoint(t,e){const n=this.spawnPoints.filter(r=>r.distanceTo(t)>12.5||e&&r.distanceTo(e)>9),i=n.length?n:this.spawnPoints;return i[Math.floor(Math.random()*i.length)].clone()}update(t,e){for(const n of this.flickers){const i=Math.sin(e*n.speed+n.phase)*.5+.5,r=Math.sin(e*n.speed*3.7+n.phase*2.1),o=i>.15?1:r>0?.35:.08;n.mesh&&(n.mesh.material&&n.mesh.material.transparent?n.mesh.material.opacity=n.base*(.55+o*.45):n.mesh.material&&n.mesh.material.color.setScalar(.35+o*.65)),n.light&&(n.light.intensity=n.base*(.35+o*.65)),n.glow&&(n.glow.material.opacity=.25+o*.4)}for(const n of this.banners)n.mesh.rotation.z=Math.sin(e*.45+n.phase)*.012,n.mesh.position.y=n.baseY+Math.sin(e*.7+n.phase)*.03;if(this.dust){const n=this.dust.geometry.attributes.position,i=n.array;for(let r=0;r<i.length/3;r++)i[r*3+1]+=this.dustSpeeds[r]*t,i[r*3]+=Math.sin(e*.1+r)*.0015,i[r*3+1]>12.5&&(i[r*3+1]=.2);n.needsUpdate=!0,this.dust.material.opacity=.38+Math.sin(e*.3)*.06}for(const n of this.glowSprites)n.material.opacity=.32+Math.sin(e*2+n.position.x)*.05}}function D0(){const s=document.createElement("canvas");s.width=1024,s.height=360;const t=s.getContext("2d");t.clearRect(0,0,1024,360),t.strokeStyle="rgba(226,59,50,0.6)",t.lineWidth=3,t.strokeRect(18,18,988,324),t.fillStyle="rgba(8,11,15,0.72)",t.fillRect(26,26,972,308),t.textAlign="center",t.fillStyle="#efe9df",t.font='400 112px "Archivo Black", sans-serif',t.fillText("MALL OF THE DEAD",512,165,940),t.fillStyle="#e23b32",t.font="700 34px Rajdhani, sans-serif",t.fillText("CO-OP SURVIVAL · OMNICORP ATRIUM",512,232),t.fillStyle="rgba(207,198,184,0.5)",t.font="500 24px Rajdhani, sans-serif",t.fillText("THE NIGHT SHIFT NEVER ENDS",512,282);const e=new _h(s);return e.colorSpace=Fe,e.anisotropy=8,e}class I0{constructor(t){this.canvas=t,this.keys=new Set,this.pressed=new Set,this.released=new Set,this.mouse={left:!1,right:!1,middle:!1},this.lookDX=0,this.lookDY=0,this.wheel=0,this.pointerLocked=!1,this.enabled=!1,window.addEventListener("keydown",e=>{this.enabled&&(["Tab","Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)&&e.preventDefault(),this.keys.has(e.code)||this.pressed.add(e.code),this.keys.add(e.code))}),window.addEventListener("keyup",e=>{this.keys.delete(e.code),this.released.add(e.code)}),window.addEventListener("blur",()=>{this.keys.clear(),this.mouse.left=this.mouse.right=this.mouse.middle=!1}),document.addEventListener("mousemove",e=>{!this.pointerLocked||!this.enabled||(this.lookDX+=e.movementX,this.lookDY+=e.movementY)}),document.addEventListener("mousedown",e=>{!this.pointerLocked||!this.enabled||(e.button===0&&(this.mouse.left=!0),e.button===1&&(this.mouse.middle=!0),e.button===2&&(this.mouse.right=!0))}),document.addEventListener("mouseup",e=>{e.button===0&&(this.mouse.left=!1),e.button===1&&(this.mouse.middle=!1),e.button===2&&(this.mouse.right=!1)}),document.addEventListener("contextmenu",e=>e.preventDefault()),document.addEventListener("wheel",e=>{!this.pointerLocked||!this.enabled||(this.wheel+=Math.sign(e.deltaY))},{passive:!0}),document.addEventListener("pointerlockchange",()=>{this.pointerLocked=document.pointerLockElement===this.canvas,this.pointerLocked||(this.mouse.left=this.mouse.right=this.mouse.middle=!1)})}down(t){return this.keys.has(t)}hit(t){return this.pressed.has(t)}endFrame(){this.pressed.clear(),this.released.clear(),this.wheel=0,this.lookDX=0,this.lookDY=0}requestLock(){document.pointerLockElement!==this.canvas&&this.canvas.requestPointerLock?.()}releaseLock(){document.pointerLockElement&&document.exitPointerLock?.()}}class U0{constructor(t){this.game=t,this.camera=t.camera,this.radius=.36,this.eyeHeight=1.68,this.pos=new E(0,0,34),this.velocity=new E,this.yaw=0,this.pitch=0,this.recoilPitch=0,this.recoilYaw=0,this.shake=0,this.health=100,this.maxHealth=100,this.stamina=100,this.grenades=2,this.maxGrenades=3,this.state="alive",this.sprinting=!1,this.crouching=!1,this.onGround=!0,this.vertical=0,this.bob=0,this.landDip=0,this.stepDist=0,this.lastDamage=99,this.ads=0,this.flashlightOn=!0,this.hits=0,this.shotsFired=0,this.stats={shots:0,hits:0,kills:0,headshots:0},this.throwCooldown=0,this.damageDirections=[],this.triggerHeld=!1,this.createFlashlight(),this.applyCamera(0,!0)}createFlashlight(){const t=new a0(16771528,120,36,.48,.6,1.55);t.position.set(.12,-.06,-1.15),t.target.position.set(.02,-.02,-12),this.camera.add(t),this.camera.add(t.target),this.flashlight=t;const e=new Re(14083312,1.35,3.4,2);e.position.set(.1,.15,.2),this.camera.add(e)}reset(){this.pos.set(0,0,34),this.velocity.set(0,0,0),this.yaw=0,this.pitch=0,this.recoilPitch=0,this.recoilYaw=0,this.shake=0,this.health=this.maxHealth,this.stamina=100,this.grenades=2,this.state="alive",this.sprinting=!1,this.crouching=!1,this.vertical=0,this.lastDamage=99,this.hits=0,this.shotsFired=0,this.stats={shots:0,hits:0,kills:0,headshots:0},this.throwCooldown=0,this.flashlight.intensity=120,this.flashlightOn=!0,this.flashlight.visible=!0,this.applyCamera(0,!0)}get alive(){return this.state==="alive"}update(t,e){const n=this.game.sensitivity;if(this.state==="dead"){this.recoilPitch=Nt.damp(this.recoilPitch,0,4,t),this.applyCamera(t);return}this.yaw-=e.lookDX*.0022*n,this.pitch-=e.lookDY*.0022*n,this.pitch=Nt.clamp(this.pitch,-1.42,1.42),this.game.settings.invertY&&(this.pitch+=e.lookDY*.0044*n),this.lastDamage+=t,this.throwCooldown=Math.max(0,this.throwCooldown-t);const i=-Math.sin(this.yaw),r=-Math.cos(this.yaw),o=Math.cos(this.yaw),a=-Math.sin(this.yaw);let l=0,h=0;e.down("KeyW")&&(h+=1),e.down("KeyS")&&(h-=1),e.down("KeyD")&&(l+=1),e.down("KeyA")&&(l-=1);const c=l!==0||h!==0,u=c?Math.hypot(l,h):1;l/=u,h/=u,this.crouching=e.down("ControlLeft")||e.down("KeyC");const f=(e.down("ShiftLeft")||e.down("ShiftRight"))&&h>.2&&!this.crouching&&this.stamina>4&&this.ads<.5;if(this.sprinting=f&&c,this.sprinting)this.stamina=Math.max(0,this.stamina-t*18);else{const T=this.crouching?15:22;this.stamina=Math.min(100,this.stamina+t*T)}this.stamina<=0&&(this.sprinting=!1);let d=this.crouching?2.7:5.1;this.sprinting&&(d=7.8),this.ads>.2&&(d*=1-this.ads*.36),this.crouching&&this.ads>.2&&(d*=.8);const g=(i*h+o*l)*d,v=(r*h+a*l)*d,m=this.onGround?14:3.5;this.velocity.x=Nt.damp(this.velocity.x,g,m,t),this.velocity.z=Nt.damp(this.velocity.z,v,m,t),e.hit("Space")&&this.onGround&&(this.vertical=4.6,this.onGround=!1,this.game.audio.playJump()),this.onGround||(this.vertical-=14.5*t,this.pos.y+=this.vertical*t,this.pos.y<=0&&(this.pos.y=0,this.onGround=!0,this.vertical<-4&&(this.landDip=.09,this.game.audio.playLand()),this.vertical=0));const p=this.pos.x,S=this.pos.z;if(this.pos.x+=this.velocity.x*t,this.pos.z+=this.velocity.z*t,this.game.mall.collide(this.pos,this.radius),this.game.mall.collide(this.pos,this.radius),this.onGround){const T=Math.hypot(this.pos.x-p,this.pos.z-S);this.stepDist+=T;const y=this.sprinting?2.1:this.crouching?3.4:2.7;this.stepDist>y&&T>.002&&(this.stepDist=0,this.game.audio.playFootstep(this.sprinting,this.crouching)),T>.01&&(this.bob+=t*(this.sprinting?12.5:8.4))}this.flashlight.intensity=120*(.9+Math.sin(this.game.time*31)*.015),e.hit("KeyF")&&this.toggleFlashlight(),e.hit("KeyR")&&this.game.weapon.reload(),e.hit("Digit1")&&this.game.weapon.requestSwitch("rifle"),e.hit("Digit2")&&this.game.weapon.requestSwitch("shotgun"),e.hit("KeyG")&&this.throwGrenade(),this.recoilPitch=Nt.damp(this.recoilPitch,0,7,t),this.recoilYaw=Nt.damp(this.recoilYaw,0,7,t),this.shake=Nt.damp(this.shake,0,9,t),this.landDip=Nt.damp(this.landDip,0,12,t),this.health<this.maxHealth&&this.lastDamage>6.5&&(this.health=Math.min(this.maxHealth,this.health+t*9)),this.applyCamera(t)}applyCamera(t,e=!1){this.sprinting;const n=Math.hypot(this.velocity.x,this.velocity.z),i=Math.min(n/5,1.4)*(this.crouching?.4:1),r=Math.abs(Math.sin(this.bob*.5))*.032*i,o=Math.sin(this.bob)*.024*i,a=this.crouching?-.42:0,l=(Math.random()-.5)*this.shake*.02,h=(Math.random()-.5)*this.shake*.02,c=(Math.random()-.5)*this.shake*.03,u=this.eyeHeight+a-this.landDip;this.camera.position.set(this.pos.x+o+l,this.pos.y+u+r+h,this.pos.z),this.camera.rotation.order="YXZ",this.camera.rotation.set(this.pitch+this.recoilPitch+(Math.random()-.5)*this.shake*.006,this.yaw+this.recoilYaw+(Math.random()-.5)*this.shake*.004,c+(this.sprinting?-.012:0));const f=75-this.ads*23+(this.sprinting?4:0);this.camera.fov=e?f:Nt.damp(this.camera.fov,f,10,t),this.camera.updateProjectionMatrix()}addRecoil(t,e,n=.1){this.recoilPitch+=t,this.recoilYaw+=e,this.shake=Math.min(1.6,this.shake+n)}addShake(t){this.shake=Math.min(2,this.shake+t)}damage(t,e){this.state==="alive"&&(this.health-=t,this.lastDamage=0,this.addShake(Math.min(.9,t*.055)),this.game.hud.damageFlash(t),this.game.hud.damageArrow(e),this.game.audio.playHurt(),this.health<=0&&(this.health=0,this.die()),this.game.hud.updateVitals(this))}heal(t){this.health=Math.min(this.maxHealth,this.health+t),this.game.hud.updateVitals(this),this.game.hud.healFlash()}die(){this.state!=="dead"&&(this.state="dead",this.game.onPlayerDeath())}toggleFlashlight(){this.flashlightOn=!this.flashlightOn,this.flashlight.visible=this.flashlightOn,this.game.audio.playClick(),this.game.hud.subtitle("",this.flashlightOn?"Flashlight on":"Flashlight off",.8)}throwGrenade(){this.grenades<=0||this.throwCooldown>0||this.state!=="alive"||(this.grenades--,this.throwCooldown=.9,this.game.hud.setGrenades(this.grenades),this.game.throwGrenade(),this.game.audio.playThrow(),this.addShake(.12))}addGrenade(t=1){this.grenades=Math.min(this.maxGrenades,this.grenades+t),this.game.hud.setGrenades(this.grenades)}}const jn={rifle:{key:"rifle",name:"M4 · CARBINE",short:"M4",mag:30,reserve:210,reserveMax:300,interval:.082,damage:27,headMult:3.6,limbMult:.62,pellets:1,spreadHip:.021,spreadAds:.0035,spreadMove:.024,reloadTime:1.85,range:140,auto:!0,recoil:{pitch:.0125,yaw:.0042,kick:.028,shake:.12}},shotgun:{key:"shotgun",name:"M870 · BREACHER",short:"M870",mag:8,reserve:40,reserveMax:56,interval:.78,damage:16,headMult:1.7,limbMult:.55,pellets:9,spreadHip:.075,spreadAds:.048,spreadMove:.035,reloadTime:2.65,range:70,auto:!1,recoil:{pitch:.042,yaw:.01,kick:.09,shake:.42}}},wl=new ki,El=new hn;class N0{constructor(t){this.game=t,this.camera=t.camera,this.root=new Vt,this.root.name="viewmodel",this.root.renderOrder=20,this.root.scale.setScalar(.8),this.camera.add(this.root),this.states={};for(const e of Object.keys(jn))this.states[e]={mag:jn[e].mag,reserve:jn[e].reserve};this.current="rifle",this.cooldown=0,this.reloading=0,this.reloadDuration=0,this.switchTimer=0,this.pendingSwitch=null,this.adsTarget=0,this.ads=0,this.aiming=!1,this.triggerHeld=!1,this.wasTrigger=!1,this.kick=0,this.kickRot=0,this.swayX=0,this.swayY=0,this.bobTime=0,this.flashTime=0,this.shotCount=0,this.raycaster=new Eh,this.raycaster.far=160,this.build(),this.equip("rifle",!0)}get def(){return jn[this.current]}get state(){return this.states[this.current]}get ammo(){return this.state.mag}get reserve(){return this.state.reserve}build(){const t=new dt({color:1513757,roughness:.33,metalness:.86,envMapIntensity:1.25}),e=new dt({color:2829875,roughness:.28,metalness:.9,envMapIntensity:1.4}),n=new dt({color:1974566,roughness:.7,metalness:.12}),i=new dt({color:8087372,roughness:.62,metalness:.08}),r=new dt({color:2302495,roughness:.85,metalness:.02}),o=new dt({color:2369826,roughness:.98,metalness:0}),a=new Ua({color:5078934,roughness:.06,metalness:.2,transparent:!0,opacity:.55,envMapIntensity:2}),l=new bt({color:16722458,toneMapped:!1});this.mats={metal:t,metalLight:e,polymer:n,tan:i,glove:r,sleeve:o,lens:a,dotMat:l},this.models={},this.models.rifle=this.buildRifle(),this.models.shotgun=this.buildShotgun();for(const h of Object.values(this.models))h.visible=!1,this.root.add(h);this.flashTex=R0(),this.flash=new Me(new me({map:this.flashTex,color:16767392,transparent:!0,opacity:.95,blending:fe,depthWrite:!1,toneMapped:!1})),this.flash.scale.set(.34,.34,1),this.flash.visible=!1,this.root.add(this.flash),this.flashLight=new Re(16760952,0,12,2),this.root.add(this.flashLight)}buildRifle(){const t=new Vt,{metal:e,metalLight:n,polymer:i,tan:r,glove:o,sleeve:a,lens:l,dotMat:h}=this.mats,c=(d,g,v,m,p,S=0,T=0,y=0,F=t)=>{const A=new P(d,g);return A.position.set(v,m,p),A.rotation.set(S,T,y),F.add(A),A};c(new vt(.072,.088,.34,3,.012),e,0,0,.02),c(new vt(.06,.036,.3,2,.01),n,0,.058,-.01),c(new vt(.058,.07,.31,3,.014),i,0,-.004,-.31),c(new vt(.062,.024,.31,2,.008),r,0,.03,-.31),c(new Gt(.0135,.0135,.26,12).rotateX(Math.PI/2),e,0,.012,-.57),c(new Gt(.021,.019,.06,12).rotateX(Math.PI/2),n,0,.012,-.7),c(new vt(.052,.075,.2,2,.01),i,0,-.014,.26),c(new vt(.06,.095,.035,2,.01),i,0,-.02,.37),c(new vt(.045,.115,.052,2,.01),i,0,-.1,.085,.32),c(new vt(.05,.14,.075,2,.012),e,0,-.1,-.055,.18),c(new vt(.054,.02,.075,2,.006),r,0,-.175,-.038,.18),c(new vt(.052,.018,.28,2,.006),n,0,.081,-.01),c(new vt(.058,.024,.1,2,.006),e,0,.095,-.025),c(new Gt(.023,.023,.088,16).rotateX(Math.PI/2),e,0,.122,-.03),c(new bn(.021,20),l,0,.122,-.075),c(new bn(.019,20),l,0,.122,.015,0,Math.PI,0),c(new bn(.0035,10),h,0,.122,-.0745);for(let d=0;d<5;d++)c(new ut(.058,.006,.02),e,0,.09,-.12+d*.055);c(new vt(.042,.12,.052,2,.01),i,0,-.085,-.3,.18),c(new Gt(.021,.021,.1,12).rotateX(Math.PI/2),e,-.045,-.005,-.34),c(new bn(.019,12),new bt({color:16050897,toneMapped:!1}),-.045,-.005,-.392,0,Math.PI,0),c(new vt(.036,.036,.055,2,.008),e,0,.012,-.745);const u=new Vt;c(new vt(.055,.085,.085,3,.02),o,0,-.105,.1,.1,0,.1,u);for(let d=0;d<4;d++)c(new vt(.013,.04,.05,2,.006),o,-.033,-.09-d*.012,.065+d*.012,.2,.2,0,u);c(new vt(.06,.09,.085,3,.02),o,-.005,-.12,-.06,.2,0,-.08,u),c(new Gt(.038,.047,.16,10),a,.05,-.17,.18,.35,0,-.55,u),t.add(u);const f=new Vt;c(new vt(.07,.06,.1,3,.018),o,-.012,-.075,-.295,0,0,-.02,f);for(let d=0;d<4;d++)c(new vt(.011,.045,.05,2,.005),o,.02,-.07+d*.011,-.31+d*.008,0,.25,0,f);return c(new Gt(.036,.045,.12,10),a,-.06,-.11,-.23,.18,0,.5,f),t.add(f),t.userData.muzzle=new E(0,.012,-.78),t.traverse(d=>{d.isMesh&&(d.castShadow=!1,d.receiveShadow=!1,d.frustumCulled=!1)}),t}buildShotgun(){const t=new Vt,{metal:e,metalLight:n,polymer:i,tan:r,glove:o,sleeve:a}=this.mats,l=(h,c,u,f,d,g=0,v=0,m=0)=>{const p=new P(h,c);return p.position.set(u,f,d),p.rotation.set(g,v,m),t.add(p),p};l(new vt(.07,.085,.3,3,.012),e,0,0,.02),l(new vt(.06,.07,.18,2,.01),e,0,-.01,.24),l(new vt(.065,.1,.035,2,.01),i,0,-.02,.34),l(new Gt(.017,.017,.44,12).rotateX(Math.PI/2),e,0,.025,-.44),l(new Gt(.014,.014,.36,12).rotateX(Math.PI/2),n,0,-.018,-.4),l(new vt(.07,.065,.22,3,.014),r,0,-.005,-.31),l(new vt(.05,.11,.05,2,.01),r,0,-.09,-.14,.15),l(new vt(.045,.11,.05,2,.01),i,0,-.095,.09,.3),l(new vt(.052,.02,.28,2,.006),n,0,.075,-.02),l(new vt(.02,.028,.02),e,0,.092,-.63),l(new we(.009,8,6),n,0,.066,-.62),l(new vt(.058,.085,.085,3,.02),o,0,-.105,.095,.1,0,.1),l(new vt(.07,.06,.11,3,.018),o,-.01,-.075,-.28,0,0,.02),l(new Gt(.038,.046,.16,10),a,.05,-.16,.2,.4,0,-.5),l(new Gt(.035,.043,.14,10),a,-.07,-.11,-.21,.15,0,.55);for(let h=0;h<4;h++)l(new Gt(.008,.008,.045,8),new dt({color:10300454,roughness:.5,metalness:.3}),.04,.02,.02+h*.017,Math.PI/2,0,0);return t.userData.muzzle=new E(0,.025,-.68),t.traverse(h=>{h.isMesh&&(h.castShadow=!1,h.receiveShadow=!1,h.frustumCulled=!1)}),t}equip(t,e=!1){if(jn[t]&&!(!e&&this.current===t)){this.current=t;for(const[n,i]of Object.entries(this.models))i.visible=n===t;this.reloading=0,e?(this.ads=0,this.switchTimer=0,this.root.position.set(.18,-.175,-.53),this.root.rotation.set(0,0,0)):(this.switchTimer=.34,this.pendingSwitch=t),this.game.hud?.setWeapon(this)}}requestSwitch(t){this.current===t||this.pendingSwitch||(this.pendingSwitch=t,this.switchTimer=.34,this.game.audio?.playSwitch())}reload(){const t=this.def;this.reloading>0||this.state.mag>=t.mag||this.state.reserve<=0||(this.reloading=t.reloadTime,this.reloadDuration=t.reloadTime,this.aiming=!1,this.adsTarget=0,this.game.audio?.playReload(this.current),this.current==="shotgun"&&this.game.hud?.subtitle("ROOK","Reloading — cover me!",1.2))}startReloadIfEmpty(){this.state.mag<=0&&this.reload()}update(t,e,n){const i=this.def;if(this.cooldown=Math.max(0,this.cooldown-t),this.flashTime=Math.max(0,this.flashTime-t),this.kick=Nt.damp(this.kick,0,16,t),this.kickRot=Nt.damp(this.kickRot,0,14,t),this.switchTimer>0&&(this.switchTimer-=t,this.switchTimer<=0&&this.pendingSwitch)){const A=this.pendingSwitch;this.pendingSwitch=null;for(const[R,D]of Object.entries(this.models))D.visible=R===A;this.current=A,this.game.hud?.setWeapon(this),this.game.audio?.playSwitch()}let r=0;if(this.reloading>0&&(this.reloading-=t,r=1-Math.max(0,this.reloading)/this.reloadDuration,this.reloading<=0)){this.reloading=0;const A=this.def,R=this.state,D=A.mag-R.mag,w=Math.min(D,R.reserve);R.mag+=w,R.reserve-=w,this.game.audio?.playReloadEnd(),this.game.hud?.setWeapon(this)}const o=!n.sprinting&&this.reloading<=0&&this.switchTimer<=0&&this.state.mag>0;this.aiming=e.mouse.right&&o,this.adsTarget=this.aiming?1:0,this.ads=Nt.damp(this.ads,this.adsTarget,13,t),n.ads=this.ads;const a=e.mouse.left;(i.auto?a:a&&!this.wasTrigger)&&this.cooldown<=0&&this.reloading<=0&&this.switchTimer<=0&&this.state.mag>0&&this.game.state==="playing"&&this.fire(n),this.wasTrigger=a,this.state.mag<=0&&this.reloading<=0&&this.cooldown<=0&&e.mouse.left&&this.game.state==="playing"&&(this.reload(),this.state.reserve<=0&&this.game.audio?.playDryFire()),this.swayX=Nt.damp(this.swayX,Nt.clamp(-e.lookDX*.0016,-.035,.035),9,t),this.swayY=Nt.damp(this.swayY,Nt.clamp(e.lookDY*.0016,-.03,.03),9,t),e.lookDX=0,e.lookDY=0;const h=Math.hypot(n.velocity.x,n.velocity.z);h>.4&&n.onGround&&(this.bobTime+=t*(6.4+h*.7));const c=Nt.clamp(h/6,0,1)*.012,u=Math.sin(this.bobTime)*c,f=Math.abs(Math.cos(this.bobTime))*c*.8,d=this.ads,g=new E(.18,-.175,-.53),v=new E(0,-.085,-.5),m=g.lerp(v,d),p=1-d*.6;m.x+=u*(1-d*.75)+this.swayX*p,m.y+=f*(1-d*.75)+this.swayY*p,m.z+=this.kick*1.4;let S=0,T=0;if(this.reloading>0){const R=Math.sin(Math.PI*r);S=.55*R,T=-.35*R,m.x+=.05*R}if(this.switchTimer>0){const A=Math.min(1,(.34-this.switchTimer)/.17),R=this.switchTimer>.17?A:this.switchTimer/.17;m.y-=.25*R,S+=.5*R}n.state==="dead"&&(m.y-=.4,S+=.6),this.root.position.copy(m),this.root.rotation.set(T-this.kickRot*.55,.02*Math.sin(this.bobTime*.5)-this.swayX*.5,S+this.swayX*1.2);const y=this.models[this.current];if(this.reloading>0){const R=Math.sin(Math.PI*r);y.position.y=-.03*R,y.rotation.z=.02*R}else y.position.y=0,y.rotation.z=0;const F=y.userData.muzzle;if(this.flash.position.copy(F),this.flashLight.position.copy(F),this.flashTime>0){this.flash.visible=!0;const A=this.flashTime/.045;this.flash.scale.setScalar(.28+(1-A)*.12+Math.random()*.08),this.flash.material.rotation=Math.random()*Math.PI*2,this.flash.material.opacity=Math.min(1,A*1.4),this.flashLight.intensity=22*A}else this.flash.visible=!1,this.flashLight.intensity=0}fire(t){const e=this.def,n=this.state;n.mag--,this.cooldown=e.interval,this.flashTime=.045,this.shotCount++,t.shotsFired+=e.pellets;const i=Math.hypot(t.velocity.x,t.velocity.z)>1.2,r=Nt.lerp(e.spreadHip,e.spreadAds,this.ads)+(i?e.spreadMove*(1-this.ads*.7):0),o=new E;this.camera.getWorldPosition(o);const a=new E(0,0,-1).applyQuaternion(this.camera.quaternion),l=new E;this.getMuzzleWorld(l);let h=!1,c=!1,u=!1;for(let f=0;f<e.pellets;f++){const d=a.clone(),g=e.pellets>1?r*(.6+Math.random()*.8):r,v=Math.random()*Math.PI*2,m=Math.sqrt(Math.random())*g;El.set(Math.cos(v)*m,Math.sin(v)*m,0),wl.setFromEuler(El),d.applyQuaternion(wl);const p=this.game.fireHitscan(o,d,e,this);p.hit&&(h=!0,p.head&&(c=!0),p.kill&&(u=!0)),f===0&&this.game.effects.spawnTracer(l,p.point||o.clone().addScaledVector(d,60))}this.kick=Math.min(.14,this.kick+e.recoil.kick),this.kickRot=Math.min(.28,this.kickRot+e.recoil.pitch*6),t.addRecoil(e.recoil.pitch,(Math.random()-.5)*2*e.recoil.yaw,e.recoil.shake),this.game.effects.spawnMuzzleSmoke(l,e.pellets>1?1.6:1),this.game.effects.spawnCasing(l,this.current),this.game.audio.playShot(this.current),h&&(this.game.hud.hitmarker(c,u),this.game.audio.playHit(c,u),t.hits+=e.pellets),this.game.hud.setWeapon(this),this.game.player.stats.shots+=e.pellets,h&&(this.game.player.stats.hits+=1)}getMuzzleWorld(t){const e=this.models[this.current],n=e.userData.muzzle;return t.copy(n),e.localToWorld(t),t}addAmmo(t=1){for(const e of Object.keys(this.states)){const n=jn[e],i=this.states[e];i.reserve=Math.min(n.reserveMax,i.reserve+Math.round(n.reserveMax*.42*t))}}refillAll(){for(const t of Object.keys(this.states)){const e=jn[t],n=this.states[t];n.mag=e.mag,n.reserve=e.reserveMax}this.game.hud?.setWeapon(this)}}new E;new E;class F0{constructor(t){this.game=t,this.isPartner=!0,this.pos=new E(-1.45,0,30.7),this.velocity=new E,this.yaw=0,this.state="alive",this.down=!1,this.hp=100,this.maxHp=100,this.lastDamage=99,this.fireCd=0,this.reviveProgress=0,this.speed=4.4,this.target=null,this.aimTimer=0,this.walkPhase=Math.random()*6,this.talkCd=12,this.groanCd=0,this.downedTime=0,this.radius=.36,this.muzzleFlash=0,this.build()}build(){const t=new dt({color:2896687,roughness:.9,metalness:.02}),e=new dt({color:1843230,roughness:.72,metalness:.14}),n=new dt({color:10121560,roughness:.78}),i=new dt({color:3817274,roughness:.65,metalness:.2}),r=new dt({color:1382170,roughness:.35,metalness:.8}),o=new bt({color:5757136,toneMapped:!1});this.mats=[t,e,n,i],this.group=new Vt,this.body=new Vt,this.group.add(this.body);const a=(c,u,f,d,g,v=this.body)=>{const m=new P(c,u);return m.position.set(f,d,g),m.castShadow=!0,m.receiveShadow=!0,v.add(m),m};this.hips=new Vt,this.hips.position.y=.98,this.body.add(this.hips),a(new vt(.52,.72,.32,3,.08),t,0,.38,0,this.hips),a(new vt(.58,.58,.4,3,.07),e,0,.4,0,this.hips);for(let c=0;c<3;c++)a(new vt(.13,.15,.09,2,.02),i,-.16+c*.16,.3,-.21,this.hips);a(new vt(.36,.24,.22,2,.05),i,0,.36,.24,this.hips),a(new vt(.56,.16,.34,2,.04),i,0,.02,0,this.hips),a(new we(.035,8,6),o,-.3,.66,.14,this.hips);const l=new Me(new me({map:cs(),color:5757136,transparent:!0,opacity:.55,blending:fe,depthWrite:!1}));l.scale.set(.24,.24,1),l.position.set(-.3,.66,.18),this.hips.add(l),this.headPivot=new Vt,this.headPivot.position.y=.88,this.hips.add(this.headPivot),a(new we(.18,14,12),n,0,0,0,this.headPivot).scale.set(.92,1.04,.95),a(new we(.2,14,10,0,Math.PI*2,0,Math.PI*.58),i,0,.05,0,this.headPivot).scale.set(1,.85,1.02),a(new vt(.28,.08,.1,2,.02),r,0,.02,.15,this.headPivot),a(new vt(.05,.035,.06,2,.01),r,.08,.03,-.19,this.headPivot),this.armL=this.buildArm(t,n,i,-1),this.armR=this.buildArm(t,n,i,1),this.legL=this.buildLeg(t,i,-1),this.legR=this.buildLeg(t,i,1),this.rifle=new Vt,a(new vt(.07,.09,.46,2,.012),r,0,0,0,this.rifle),a(new Gt(.014,.014,.26,8).rotateX(Math.PI/2),r,0,.02,-.34,this.rifle),a(new vt(.055,.12,.08,2,.01),i,0,-.11,-.04,this.rifle),a(new vt(.06,.07,.18,2,.012),t,0,-.01,.3,this.rifle),a(new vt(.035,.05,.1,2,.008),r,0,.09,.02,this.rifle),this.rifle.userData.muzzle=new E(0,.02,-.48),this.rifle.position.set(.09,.32,-.28),this.hips.add(this.rifle),this.flash=new Me(new me({map:cs(),color:16764807,transparent:!0,opacity:.9,blending:fe,depthWrite:!1,toneMapped:!1})),this.flash.scale.set(.3,.3,1),this.flash.visible=!1,this.rifle.add(this.flash),this.flashLight=new Re(16761466,0,9,2),this.rifle.add(this.flashLight),this.marker=new Me(new me({map:un("ROOK",{color:"#57d8d0",fontSize:120,background:"rgba(0,0,0,0)",border:!1,width:512,height:128}),transparent:!0,opacity:.66,depthTest:!1,depthWrite:!1,toneMapped:!1})),this.marker.scale.set(.58,.145,1),this.marker.position.set(0,2.3,0),this.group.add(this.marker),this.marker.renderOrder=30,this.group.scale.setScalar(1),this.group.position.copy(this.pos),this.game.scene.add(this.group)}buildArm(t,e,n,i){const r=new Vt;r.position.set(i*.35,.62,0),this.hips.add(r);const o=new P(new an(.075,.26,3,8),t);o.position.y=-.18,r.add(o);const a=new Vt;a.position.y=-.36,r.add(a);const l=new P(new an(.062,.24,3,8),t);l.position.y=-.14,a.add(l);const h=new P(new vt(.1,.16,.08,2,.02),n);return h.position.y=-.32,a.add(h),r.rotation.x=-.85,r.rotation.z=i*.2,a.rotation.x=-1.05,{shoulder:r,elbow:a,side:i}}buildLeg(t,e,n){const i=new Vt;i.position.set(n*.16,-.12,0),this.hips.add(i);const r=new P(new an(.095,.3,3,8),t);r.position.y=-.2,i.add(r);const o=new Vt;o.position.y=-.44,i.add(o);const a=new P(new an(.08,.3,3,8),t);a.position.y=-.16,o.add(a);const l=new P(new vt(.16,.14,.3,2,.02),e);return l.position.set(0,-.36,.05),o.add(l),{hip:i,knee:o,side:n}}reset(){this.pos.set(-1.45,0,30.7),this.velocity.set(0,0,0),this.hp=this.maxHp,this.state="alive",this.down=!1,this.reviveProgress=0,this.lastDamage=99,this.fireCd=.5,this.group.visible=!0,this.hips.rotation.set(0,0,0),this.body.position.y=0,this.body.rotation.set(0,0,0),this.marker.material.opacity=.66,this.game.hud?.updatePartner(this)}update(t,e){if(!this.group.visible)return;if(this.lastDamage+=t,this.fireCd=Math.max(0,this.fireCd-t),this.talkCd-=t,this.muzzleFlash=Math.max(0,this.muzzleFlash-t),this.muzzleFlash<=0)this.flash.visible=!1,this.flashLight.intensity=0;else{this.flash.visible=!0;const c=this.muzzleFlash/.05;this.flash.material.opacity=c,this.flash.scale.setScalar(.22+(1-c)*.1),this.flashLight.intensity=12*c}if(this.state==="down"){this.downedTime+=t,this.updateDown(t,e),this.group.position.copy(this.pos);return}this.hp<this.maxHp&&this.lastDamage>7&&(this.hp=Math.min(this.maxHp,this.hp+t*7));const n=this.game.player;let i=null,r=this.pos.distanceTo(n.pos);this.findTarget();const o=this.target&&this.target.state!=="dead"&&!this.target.removed&&this.target.pos.distanceTo(this.pos)<30;if(o){const c=this.target,u=c.pos.distanceTo(this.pos),f=Math.atan2(c.pos.x-this.pos.x,c.pos.z-this.pos.z);this.turnToward(f,t,9),u>6&&u<9.5&&r<7.5?i={x:c.pos.x,z:c.pos.z,stop:6.5}:r>6.5&&(i={x:n.pos.x+1.7,z:n.pos.z-.8,stop:2.4}),this.fireCd<=0&&u<28&&this.shoot(c),this.talkCd<=0&&(this.talkCd=14+Math.random()*16,this.game.hud.subtitle("ROOK",this.pickLine(),2.2))}else{if(this.target=null,r>3.2){const c=Math.sin(this.game.time*.6)*.45,u=-Math.sin(n.yaw),f=-Math.cos(n.yaw),d=Math.cos(n.yaw),g=-Math.sin(n.yaw),v=n.pos.x+u*2.8+d*(-2.1+c),m=n.pos.z+f*2.8+g*(-2.1+c);i={x:v,z:m,stop:1.9}}else if(r<1.7){const c=this.pos.x-n.pos.x,u=this.pos.z-n.pos.z,f=Math.hypot(c,u)||1;i={x:this.pos.x+c/f*1.6,z:this.pos.z+u/f*1.6,stop:.2}}i||this.turnToward(n.yaw,t,4),this.talkCd<=0&&r<6&&Math.random()<.5&&(this.talkCd=22+Math.random()*24,this.game.hud.subtitle("ROOK",["Stay sharp.","I hear them in the vents.","Ammo check?","This place gives me the creeps."][Math.floor(Math.random()*4)],2))}if(i){const c=i.x-this.pos.x,u=i.z-this.pos.z,f=Math.hypot(c,u);if(f>i.stop){const d=this.speed*(o?.72:1);this.velocity.x=Nt.damp(this.velocity.x,c/f*d,8,t),this.velocity.z=Nt.damp(this.velocity.z,u/f*d,8,t),o||this.turnToward(Math.atan2(c,u),t,6)}else this.velocity.x=Nt.damp(this.velocity.x,0,10,t),this.velocity.z=Nt.damp(this.velocity.z,0,10,t)}else this.velocity.x=Nt.damp(this.velocity.x,0,10,t),this.velocity.z=Nt.damp(this.velocity.z,0,10,t);const a=this.pos.x-n.pos.x,l=this.pos.z-n.pos.z,h=Math.hypot(a,l);h<1.25&&h>.001&&(this.pos.x+=a/h*(1.25-h)*.7,this.pos.z+=l/h*(1.25-h)*.7),this.pos.x+=this.velocity.x*t,this.pos.z+=this.velocity.z*t,this.game.mall.collide(this.pos,this.radius),this.group.position.set(this.pos.x,this.pos.y,this.pos.z),this.group.rotation.y=this.yaw,this.animate(t,o),this.game.hud?.updatePartner(this)}updateDown(t,e){this.velocity.set(0,0,0),this.hips.rotation.x=Nt.damp(this.hips.rotation.x,.15,5,t),this.body.position.y=Nt.damp(this.body.position.y,-.58,6,t),this.body.rotation.z=Nt.damp(this.body.rotation.z,.2,4,t),this.headPivot.rotation.x=.35,this.marker.material.opacity=.28+Math.sin(this.game.time*6)*.2,this.marker.material.color.setHex(16726831),this.flash.visible=!1,this.flashLight.intensity=0;const n=this.game.player;Math.hypot(n.pos.x-this.pos.x,n.pos.z-this.pos.z)<2.4&&n.state==="alive"?e.down("KeyE")?(this.reviveProgress+=t/2.4,this.game.audio.playReviveTick(),this.reviveProgress>=1&&this.revive()):this.reviveProgress=Math.max(0,this.reviveProgress-t*.6):this.reviveProgress=Math.max(0,this.reviveProgress-t*.8),this.game.hud?.updatePartner(this)}revive(){this.state="alive",this.down=!1,this.hp=55,this.reviveProgress=0,this.body.position.y=0,this.body.rotation.set(0,0,0),this.hips.rotation.set(0,0,0),this.headPivot.rotation.set(0,0,0),this.marker.material.color.setHex(5757136),this.marker.material.opacity=.66,this.game.hud.subtitle("ROOK","I owe you one. Let's finish this.",2.4),this.game.audio.playRevive(),this.game.hud.updatePartner(this)}damage(t,e){this.state!=="alive"||this.down||(this.hp-=t,this.lastDamage=0,this.game.audio.playPartnerHurt(),this.hp<=0&&(this.hp=0,this.goDown(e)),this.game.hud.updatePartner(this))}goDown(t){this.state="down",this.down=!0,this.reviveProgress=0,this.downedTime=0,this.target=null,this.game.hud.subtitle("ROOK","I'm hit — I'm down! Get to me!",3),this.game.audio.playPartnerDown(),this.game.hud.updatePartner(this)}findTarget(){let t=null,e=30*30;for(const n of this.game.zombies){if(n.state==="dead"||n.removed)continue;const i=n.pos.distanceToSquared(this.pos);i<e&&(e=i,t=n)}this.target=t}shoot(t){this.fireCd=.48+Math.random()*.22,this.muzzleFlash=.05;const e=new E;this.rifle.updateWorldMatrix(!0,!1),e.copy(this.rifle.userData.muzzle),this.rifle.localToWorld(e);const i=Math.random()<.82,r=new E(t.pos.x,1.15+Math.random()*.4,t.pos.z);if(i||r.add(new E((Math.random()-.5)*1.6,Math.random()*.7,(Math.random()-.5)*1.6)),this.game.effects.spawnTracer(e,r,10479325),this.game.audio.playPartnerShot(this.pos),i){const o=r.clone().sub(this.pos).normalize();t.takeDamage(15+Math.random()*8,"torso",r,o,"partner")}}pickLine(){const t=["Contact, left side!","Dropping them.","Reloading soon — cover me.","They keep coming.","Headshots, make them count."];return t[Math.floor(Math.random()*t.length)]}turnToward(t,e,n){let i=t-this.yaw;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;this.yaw+=Nt.clamp(i,-e*n,e*n)}animate(t,e){const n=Math.hypot(this.velocity.x,this.velocity.z);n>.2&&(this.walkPhase+=t*(5.4+n*.4));const i=Math.sin(this.walkPhase),r=n>.2?.5:.03;this.legL.hip.rotation.x=i*r,this.legR.hip.rotation.x=-i*r,this.legL.knee.rotation.x=Math.max(0,-i)*.55+.08,this.legR.knee.rotation.x=Math.max(0,i)*.55+.08,this.body.position.y=Math.abs(Math.sin(this.walkPhase*2))*.035*(n>.2?1:.2)+Math.sin(this.game.time*1.7)*.005,this.body.rotation.z=Math.sin(this.walkPhase)*.02,e?(this.armL.shoulder.rotation.x=-1.35,this.armR.shoulder.rotation.x=-1.15,this.armL.elbow.rotation.x=-.7,this.armR.elbow.rotation.x=-.95,this.rifle.rotation.x=0,this.rifle.rotation.z=.02):(this.armL.shoulder.rotation.x=-.85+Math.sin(this.walkPhase)*.12,this.armR.shoulder.rotation.x=-.85-Math.sin(this.walkPhase)*.12,this.armL.elbow.rotation.x=-1.05,this.armR.elbow.rotation.x=-1.05,this.rifle.rotation.x=.15),this.headPivot.rotation.y=Math.sin(this.game.time*.4)*.18,this.headPivot.rotation.x=e?-.06:0}}const O0=new we(.035,5,4);new we(.018,4,3);const z0=new Gt(.009,.009,.032,6),B0=new bn(.035,8);class k0{constructor(t){this.game=t,this.group=new Vt,this.group.name="effects",t.scene.add(this.group),this.particles=[],this.tracers=[],this.decals=[],this.lights=[],this.bloodMat=new bt({color:4851721}),this.bloodMatDark=new bt({color:2753541}),this.sparkMat=new bt({color:16760928,toneMapped:!1}),this.casingMat=new dt({color:11569730,roughness:.3,metalness:.9}),this.holeMat=new bt({color:657930,transparent:!0,opacity:.85,side:ve,polygonOffset:!0,polygonOffsetFactor:-2}),this.glowTex=cs(),this.sparkTex=A0(),this.bloodTex=Ah(7),this.smokeMats=[];for(let e=0;e<4;e++)this.smokeMats.push(new me({map:this.glowTex,color:9080723,transparent:!0,opacity:.22,depthWrite:!1,blending:ii}));this.shockGeo=new Fi(.4,.55,32)}reset(){for(const t of this.particles)this.group.remove(t.obj),t.obj.material?.dispose?.();for(const t of this.tracers)this.group.remove(t.line);for(const t of this.decals)this.group.remove(t.mesh);for(const t of this.lights)this.group.remove(t.light);this.particles.length=0,this.tracers.length=0,this.lights.length=0;for(const t of this.decals)t.mesh.material.dispose();this.decals.length=0}addParticle(t,{vel:e,life:n,gravity:i=9,scale:r=1,shrink:o=1,fade:a=0,rot:l=null,bounce:h=!1}){this.group.add(t);const c={obj:t,vel:e.clone(),life:n,maxLife:n,gravity:i,scale:r,shrink:o,fade:a,rot:l,bounce:h,baseOpacity:t.material?.opacity??1};if(this.particles.push(c),this.particles.length>420){const u=this.particles.shift();this.group.remove(u.obj),u.obj.material?.dispose?.()}return c}spawnBlood(t,e,n=1){const i=Math.min(22,Math.floor(5+n*5+Math.random()*5));for(let o=0;o<i;o++){const a=new P(O0,Math.random()>.5?this.bloodMat:this.bloodMatDark);a.position.copy(t),a.position.x+=(Math.random()-.5)*.18,a.position.y+=(Math.random()-.5)*.18,a.position.z+=(Math.random()-.5)*.18;const l=.5+Math.random()*1.4*n;a.scale.setScalar(l);const h=new E(e.x*(1+Math.random()*3)+(Math.random()-.5)*3.2,Math.random()*3+e.y*1.5+.6,e.z*(1+Math.random()*3)+(Math.random()-.5)*3.2);this.addParticle(a,{vel:h,life:.8+Math.random()*.9,gravity:11,shrink:1,bounce:!0})}const r=new Me(new me({map:this.bloodTex,color:10230555,transparent:!0,opacity:.5,depthWrite:!1}));r.position.copy(t),r.scale.setScalar(.7+n*.5),this.addParticle(r,{vel:e.clone().multiplyScalar(1.2).add(new E(0,.5,0)),life:.25,gravity:-1,scale:1,fade:1})}spawnHead(t,e){const n=new Vt,i=new dt({color:8161392,roughness:.85}),r=new P(new we(.17,12,9),i);r.scale.set(.94,1.08,1);const o=new P(new ut(.18,.1,.15),i);o.position.set(0,-.12,.03),o.rotation.x=.3,n.add(r,o);for(let a=0;a<4;a++){const l=new P(new we(.04,5,4),this.bloodMat);l.position.set((Math.random()-.5)*.2,(Math.random()-.5)*.2,(Math.random()-.5)*.2),n.add(l)}n.position.copy(t),this.addParticle(n,{vel:e.clone().multiplyScalar(3.2).add(new E((Math.random()-.5)*1.4,3+Math.random()*2,(Math.random()-.5)*1.4)),life:4,gravity:12,rot:new E(Math.random()*8,Math.random()*8,Math.random()*8),bounce:!0});for(let a=0;a<3;a++){const l=new P(new we(.08,5,4),this.bloodMat);l.position.copy(t),this.addParticle(l,{vel:new E((Math.random()-.5)*3,Math.random()*2,(Math.random()-.5)*3),life:1.1,gravity:10,bounce:!0})}}spawnTracer(t,e,n=16767392,i=1){const r=new Te().setFromPoints([t.clone(),e.clone()]),o=new gh({color:n,transparent:!0,opacity:.9,blending:fe,depthWrite:!1,toneMapped:!1}),a=new Hm(r,o);a.frustumCulled=!1,this.group.add(a),this.tracers.push({line:a,life:.055,maxLife:.055})}spawnImpact(t,e,n=16760928){for(let r=0;r<6;r++){const o=new Me(new me({map:this.sparkTex,color:n,transparent:!0,opacity:1,blending:fe,depthWrite:!1}));o.position.copy(t),o.scale.setScalar(.06+Math.random()*.08);const a=e.clone().multiplyScalar(2+Math.random()*3).add(new E((Math.random()-.5)*2.5,(Math.random()-.3)*2.5,(Math.random()-.5)*2.5));this.addParticle(o,{vel:a,life:.2+Math.random()*.25,gravity:8,fade:1})}const i=new Me(new me({map:this.glowTex,color:10132118,transparent:!0,opacity:.2,depthWrite:!1}));if(i.position.copy(t).addScaledVector(e,.03),i.scale.setScalar(.22),this.addParticle(i,{vel:e.clone().multiplyScalar(.8),life:.3,gravity:.3,fade:1}),Math.random()<.5){const r=new P(B0,this.holeMat);if(r.position.copy(t).addScaledVector(e,.012),r.lookAt(t.clone().add(e)),this.group.add(r),this.decals.push({mesh:r,life:8}),this.decals.length>50){const o=this.decals.shift();this.group.remove(o.mesh)}}}spawnBloodDecal(t,e,n=2,i=.028){const r=new bt({map:this.bloodTex,transparent:!0,opacity:.7,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,color:9382442}),o=new P(new Ht(n,n),r);if(o.rotation.x=-Math.PI/2,o.rotation.z=Math.random()*Math.PI*2,o.position.set(t,i,e),this.group.add(o),this.decals.push({mesh:o,life:999}),this.decals.length>30){const a=this.decals.shift();this.group.remove(a.mesh),a.mesh.material.dispose(),a.mesh.geometry.dispose()}}spawnMuzzleSmoke(t,e=1){for(let n=0;n<2;n++){const i=new Me(new me({map:this.glowTex,color:9145222,transparent:!0,opacity:.3,depthWrite:!1}));i.position.copy(t),i.scale.setScalar(.09*e),this.addParticle(i,{vel:new E((Math.random()-.5)*.3,.25+Math.random()*.3,(Math.random()-.5)*.3),life:.5+Math.random()*.4,gravity:-.4,scale:1,fade:1})}}spawnCasing(t,e){const n=new P(z0,this.casingMat);n.position.copy(t);const i=new E(1.2+Math.random()*1.4,1.2+Math.random()*1.6,.7+Math.random());e==="shotgun"&&n.scale.setScalar(1.5),this.addParticle(n,{vel:i,life:1.4,gravity:12,rot:new E(Math.random()*14,Math.random()*14,Math.random()*14),bounce:!0})}spawnExplosion(t){const e=new Me(new me({map:this.glowTex,color:16765562,transparent:!0,opacity:1,blending:fe,depthWrite:!1,toneMapped:!1}));e.position.copy(t),e.scale.setScalar(1.5),this.addParticle(e,{vel:new E,life:.28,gravity:0,scale:1,fade:1});const n=new Me(new me({map:this.sparkTex,color:16743210,transparent:!0,opacity:1,blending:fe,depthWrite:!1,toneMapped:!1}));n.position.copy(t),n.scale.setScalar(3),this.addParticle(n,{vel:new E,life:.22,gravity:0,scale:1,fade:1});for(let a=0;a<30;a++){const l=new Me(new me({map:this.sparkTex,color:a%3?16757322:16734750,transparent:!0,opacity:1,blending:fe,depthWrite:!1}));l.position.copy(t),l.scale.setScalar(.1+Math.random()*.15);const h=new E(Math.random()-.5,Math.random()*.9,Math.random()-.5).normalize().multiplyScalar(5+Math.random()*9);this.addParticle(l,{vel:h,life:.5+Math.random()*.7,gravity:9,fade:1,bounce:!0})}for(let a=0;a<10;a++){const l=new Me(new me({map:this.glowTex,color:4868164,transparent:!0,opacity:.34,depthWrite:!1}));l.position.copy(t).add(new E((Math.random()-.5)*1.2,Math.random()*1.2,(Math.random()-.5)*1.2)),l.scale.setScalar(.8+Math.random()),this.addParticle(l,{vel:new E((Math.random()-.5)*2,.6+Math.random()*1.6,(Math.random()-.5)*2),life:1.4+Math.random()*1.2,gravity:-.8,fade:1,scale:1.8})}const i=new P(this.shockGeo,new bt({color:16762234,transparent:!0,opacity:.7,side:ve,depthWrite:!1,blending:fe}));i.rotation.x=-Math.PI/2,i.position.copy(t),i.position.y=.1,this.addParticle(i,{vel:new E,life:.4,gravity:0,scale:1,fade:1}),i.userData.grow=14;const r=new Re(16752714,130,24,2);r.position.copy(t),r.position.y+=1,this.group.add(r),this.lights.push({light:r,life:.45,maxLife:.45,base:130});const o={x:t.x,z:t.z,size:3.4};this.spawnBloodDecal(o.x,o.z,o.size,.026)}update(t){for(let e=this.particles.length-1;e>=0;e--){const n=this.particles[e];if(n.life-=t,n.life<=0){this.group.remove(n.obj),n.obj.material?.dispose?.(),this.particles.splice(e,1);continue}const i=n.life/n.maxLife;if(n.vel.y-=n.gravity*t,n.obj.position.addScaledVector(n.vel,t),n.bounce&&n.obj.position.y<.03&&(n.obj.position.y=.03,n.vel.y*=-.32,n.vel.x*=.55,n.vel.z*=.55,Math.abs(n.vel.y)<.2&&(n.vel.y=0,n.gravity=0)),n.rot&&(n.obj.rotation.x+=n.rot.x*t,n.obj.rotation.y+=n.rot.y*t,n.obj.rotation.z+=n.rot.z*t),n.obj.userData.grow){const r=1+(1-i)*n.obj.userData.grow;n.obj.scale.setScalar(r)}else if(n.shrink&&n.obj.scale){const r=n.obj.scale.x;n.obj.isSprite&&n.obj.scale.setScalar(Math.max(.001,r*(1+t*n.scale*1.5)))}n.fade&&n.obj.material&&(n.obj.material.opacity=n.baseOpacity*i)}for(let e=this.tracers.length-1;e>=0;e--){const n=this.tracers[e];n.life-=t,n.line.material.opacity=Math.max(0,n.life/n.maxLife)*.9,n.life<=0&&(this.group.remove(n.line),n.line.geometry.dispose(),n.line.material.dispose(),this.tracers.splice(e,1))}for(let e=this.lights.length-1;e>=0;e--){const n=this.lights[e];n.life-=t,n.light.intensity=n.base*Math.max(0,n.life/n.maxLife)**2,n.life<=0&&(this.group.remove(n.light),this.lights.splice(e,1))}for(let e=this.decals.length-1;e>=0;e--){const n=this.decals[e];n.life<900&&(n.life-=t,n.life<=0&&(this.group.remove(n.mesh),n.mesh.material.dispose(),n.mesh.geometry.dispose(),this.decals.splice(e,1)))}}}class H0{constructor(){this.ctx=null,this.ready=!1,this.volume=.8,this.lastHeart=0,this.heartSide=0,this.droneNodes=[],this.distantTimer=8}init(){if(this.ready){this.ctx.resume?.();return}const t=window.AudioContext||window.webkitAudioContext;if(!t)return;try{this.ctx=new t}catch{return}const e=this.ctx;this.master=e.createGain(),this.master.gain.value=this.volume,this.compressor=e.createDynamicsCompressor(),this.compressor.threshold.value=-18,this.compressor.knee.value=22,this.compressor.ratio.value=5,this.compressor.attack.value=.004,this.compressor.release.value=.22,this.master.connect(this.compressor),this.compressor.connect(e.destination),this.reverb=e.createConvolver(),this.reverb.buffer=this.makeImpulse(2.1,2.9),this.reverbGain=e.createGain(),this.reverbGain.gain.value=.55,this.reverb.connect(this.reverbGain),this.reverbGain.connect(this.master),this.sfx=e.createGain(),this.sfx.gain.value=.9,this.sfx.connect(this.master),this.sfxSend=e.createGain(),this.sfxSend.gain.value=.32,this.sfx.connect(this.sfxSend),this.sfxSend.connect(this.reverb),this.noise=this.makeNoise(2),this.ready=!0,this.startAmbience()}makeNoise(t=2){const e=this.ctx,n=Math.floor(e.sampleRate*t),i=e.createBuffer(2,n,e.sampleRate);for(let r=0;r<2;r++){const o=i.getChannelData(r);for(let a=0;a<n;a++)o[a]=Math.random()*2-1}return i}makeImpulse(t,e){const n=this.ctx,i=Math.floor(n.sampleRate*t),r=n.createBuffer(2,i,n.sampleRate);for(let o=0;o<2;o++){const a=r.getChannelData(o);for(let l=0;l<i;l++){const h=l/i;a[l]=(Math.random()*2-1)*Math.pow(1-h,e)*(1-h*.2)}}return r}setVolume(t){this.volume=t,this.master&&this.master.gain.setTargetAtTime(t,this.ctx.currentTime,.05)}startAmbience(){const t=this.ctx,e=t.createGain();e.gain.value=.2;const n=t.createBiquadFilter();n.type="lowpass",n.frequency.value=210,n.Q.value=.6,e.connect(n),n.connect(this.master);const i=[43.65,55,82.41];for(const f of i){const d=t.createOscillator();d.type="sawtooth",d.frequency.value=f;const g=t.createGain();g.gain.value=.035;const v=t.createOscillator();v.frequency.value=.05+Math.random()*.08;const m=t.createGain();m.gain.value=.02,v.connect(m),m.connect(g.gain),d.connect(g),g.connect(e),d.start(),v.start(),this.droneNodes.push(d,v)}const r=t.createBufferSource();r.buffer=this.noise,r.loop=!0;const o=t.createBiquadFilter();o.type="bandpass",o.frequency.value=340,o.Q.value=.7;const a=t.createGain();a.gain.value=.02,r.connect(o),o.connect(a),a.connect(e),r.start();const l=t.createOscillator();l.type="sine",l.frequency.value=118;const h=t.createGain();h.gain.value=.008,l.connect(h),h.connect(this.master),l.start(),this.droneNodes.push(l);const c=t.createOscillator();c.frequency.value=.03;const u=t.createGain();u.gain.value=70,c.connect(u),u.connect(n.frequency),c.start(),this.droneNodes.push(c),this.ambGain=e}update(t,e){if(!this.ready)return;this.distantTimer-=t,this.distantTimer<=0&&(this.distantTimer=10+Math.random()*16,this.playDistant());const n=e.player?.health??100;if(n<35&&e.state==="playing"&&(this.lastHeart-=t,this.lastHeart<=0&&(this.lastHeart=.55+n/35*.6,this.playHeartbeat(.12+(1-n/35)*.18))),this.ambGain){const i=e.state==="playing"?.16+Math.min(.12,e.zombies.filter(r=>r.state!=="dead").length*.004):.13;this.ambGain.gain.setTargetAtTime(i,this.ctx.currentTime,1.5)}}panFor(t,e=1){if(!t||!this.gameCamera)return{pan:0,gain:1};const n=this.gameCamera,i=t.x-n.position.x,r=t.z-n.position.z,o=Math.hypot(i,r),a=Math.cos(n.rotation.y),l=-Math.sin(n.rotation.y),h=Math.max(-1,Math.min(1,(i*a+r*l)/Math.max(1,o)*.8)),c=e/(1+o*.06);return{pan:h,gain:c}}out(t=0){const e=this.ctx,n=e.createGain();if(e.createStereoPanner){const i=e.createStereoPanner();i.pan.value=t,n.connect(i),i.connect(this.sfx)}else n.connect(this.sfx);return n}noiseHit({duration:t=.12,freq:e=1800,freqEnd:n=400,gain:i=.5,type:r="lowpass",pan:o=0,q:a=.8,send:l=!0}){if(!this.ready)return;const h=this.ctx,c=h.currentTime,u=h.createBufferSource();u.buffer=this.noise,u.playbackRate.value=.9+Math.random()*.2;const f=h.createBiquadFilter();f.type=r,f.Q.value=a,f.frequency.setValueAtTime(e,c),f.frequency.exponentialRampToValueAtTime(Math.max(40,n),c+t);const d=h.createGain();d.gain.setValueAtTime(i,c),d.gain.exponentialRampToValueAtTime(1e-4,c+t);const g=this.out(o);u.connect(f),f.connect(d),d.connect(g),u.start(c),u.stop(c+t+.02),l&&this.sendToReverb(d,.7)}tone({freq:t=440,freqEnd:e=220,duration:n=.2,gain:i=.2,type:r="sine",pan:o=0,delay:a=0,send:l=!1}){if(!this.ready)return;const h=this.ctx,c=h.currentTime+a,u=h.createOscillator();u.type=r,u.frequency.setValueAtTime(t,c),u.frequency.exponentialRampToValueAtTime(Math.max(20,e),c+n);const f=h.createGain();f.gain.setValueAtTime(1e-4,c),f.gain.exponentialRampToValueAtTime(i,c+.005),f.gain.exponentialRampToValueAtTime(1e-4,c+n);const d=this.out(o);u.connect(f),f.connect(d),u.start(c),u.stop(c+n+.03),l&&this.sendToReverb(f,.5)}sendToReverb(t,e=.5){if(!this.ready)return;const n=this.ctx.createGain();n.gain.value=e,t.connect(n),n.connect(this.reverb)}playShot(t="rifle"){this.ready&&(t==="shotgun"?(this.noiseHit({duration:.3,freq:3200,freqEnd:160,gain:1.1,q:.5}),this.tone({freq:120,freqEnd:34,duration:.35,gain:.55,type:"sine",send:!0}),this.noiseHit({duration:.08,freq:6e3,freqEnd:2e3,gain:.32,type:"highpass",q:.6})):(this.noiseHit({duration:.13,freq:4200,freqEnd:300,gain:.78,q:.7}),this.tone({freq:150,freqEnd:48,duration:.16,gain:.42,type:"triangle",send:!0}),this.noiseHit({duration:.035,freq:8e3,freqEnd:3e3,gain:.32,type:"highpass",q:.5})))}playHit(t=!1,e=!1){this.ready&&(t?(this.tone({freq:2100,freqEnd:1500,duration:.05,gain:.1,type:"square"}),this.noiseHit({duration:.1,freq:900,freqEnd:160,gain:.3})):this.tone({freq:e?1200:1500,freqEnd:900,duration:.04,gain:.055,type:"sine"}))}playHeadshot(){this.noiseHit({duration:.18,freq:1500,freqEnd:120,gain:.5}),this.tone({freq:90,freqEnd:40,duration:.25,gain:.3,type:"sine"})}playReload(t="rifle"){this.ready&&(this.clickAt(0,.18),this.clickAt(t==="shotgun"?.25:.35,.12),t==="shotgun"?(this.clickAt(.7,.15),this.clickAt(1.15,.15)):this.clickAt(1.35,.16))}playReloadEnd(){this.clickAt(.02,.24),this.tone({freq:500,freqEnd:300,duration:.06,gain:.06})}clickAt(t,e=.15){if(!this.ready)return;const n=this.ctx,i=n.currentTime+t,r=n.createBufferSource();r.buffer=this.noise;const o=n.createBiquadFilter();o.type="bandpass",o.frequency.value=1800+Math.random()*800,o.Q.value=2;const a=n.createGain();a.gain.setValueAtTime(e,i),a.gain.exponentialRampToValueAtTime(1e-4,i+.05);const l=this.out((Math.random()-.5)*.3);r.connect(o),o.connect(a),a.connect(l),r.start(i),r.stop(i+.06),this.tone({freq:2200,freqEnd:1400,duration:.03,gain:e*.3,type:"square",delay:t})}playDryFire(){this.clickAt(0,.18),this.tone({freq:900,freqEnd:500,duration:.05,gain:.05,type:"square"})}playSwitch(){this.clickAt(0,.12),this.tone({freq:700,freqEnd:500,duration:.05,gain:.04})}playClick(){this.clickAt(0,.08)}playThrow(){this.noiseHit({duration:.18,freq:900,freqEnd:300,gain:.15})}playFootstep(t=!1,e=!1){this.ready&&(this.noiseHit({duration:.09,freq:e?300:520,freqEnd:120,gain:e?.06:t?.2:.13,send:!1}),this.tone({freq:90,freqEnd:55,duration:.08,gain:e?.03:.07,type:"sine"}))}playJump(){this.noiseHit({duration:.08,freq:500,freqEnd:200,gain:.1,send:!1})}playLand(){this.noiseHit({duration:.14,freq:320,freqEnd:90,gain:.18}),this.tone({freq:70,freqEnd:40,duration:.12,gain:.1})}playHurt(){this.noiseHit({duration:.22,freq:700,freqEnd:100,gain:.3}),this.tone({freq:160,freqEnd:70,duration:.25,gain:.15,type:"triangle"}),this.tone({freq:3400,freqEnd:2600,duration:1.2,gain:.02,type:"sine"})}playPartnerHurt(){this.noiseHit({duration:.16,freq:500,freqEnd:150,gain:.16})}playPartnerDown(){this.tone({freq:240,freqEnd:100,duration:.6,gain:.18,type:"sawtooth"}),this.noiseHit({duration:.5,freq:800,freqEnd:100,gain:.2})}playZombie(t,e="walker"){if(!this.ready)return;const{pan:n,gain:i}=this.panFor(t,e==="brute"?.42:.28);if(i<.04)return;const r=this.ctx,o=r.currentTime,a=r.createOscillator();a.type="sawtooth";const l=e==="brute"?52:e==="runner"?96:68;a.frequency.setValueAtTime(l+Math.random()*20,o),a.frequency.linearRampToValueAtTime(l*.7,o+.8);const h=r.createBiquadFilter();h.type="lowpass",h.frequency.value=420,h.Q.value=5;const c=r.createGain();c.gain.setValueAtTime(1e-4,o),c.gain.exponentialRampToValueAtTime(i*.5,o+.12),c.gain.exponentialRampToValueAtTime(1e-4,o+1);const u=this.out(n);a.connect(h),h.connect(c),c.connect(u),a.start(o),a.stop(o+1.1),this.noiseHit({duration:.5,freq:600,freqEnd:180,gain:i*.22,pan:n,send:!0}),this.sendToReverb(c,.6)}playZombieAttack(t,e){const{pan:n,gain:i}=this.panFor(t,.34);this.noiseHit({duration:.22,freq:1200,freqEnd:200,gain:i*.5,pan:n}),this.tone({freq:120,freqEnd:60,duration:.15,gain:i*.2,type:"square",pan:n})}playDeath(t,e){const{pan:n,gain:i}=this.panFor(t,.4);this.tone({freq:150,freqEnd:40,duration:.7,gain:i*.4,type:"sawtooth",pan:n}),this.noiseHit({duration:.5,freq:800,freqEnd:60,gain:i*.35,pan:n})}playPartnerShot(t){if(!this.ready)return;const{pan:e}=this.panFor(t,1);this.noiseHit({duration:.1,freq:3e3,freqEnd:300,gain:.32,pan:e}),this.tone({freq:130,freqEnd:50,duration:.12,gain:.16,type:"triangle",pan:e})}playExplosion(t){if(!this.ready)return;const e=this.panFor(t,1);this.noiseHit({duration:1.1,freq:2600,freqEnd:40,gain:1.2,pan:e.pan,q:.4}),this.tone({freq:90,freqEnd:24,duration:1,gain:.6,type:"sine",pan:e.pan,send:!0}),this.noiseHit({duration:.16,freq:7e3,freqEnd:900,gain:.4,type:"highpass",pan:e.pan})}playWave(){this.ready&&(this.tone({freq:110,freqEnd:82,duration:2.2,gain:.28,type:"sawtooth",send:!0}),this.tone({freq:164,freqEnd:123,duration:2.2,gain:.17,type:"triangle",send:!0}),this.tone({freq:55,freqEnd:41,duration:2.6,gain:.22,type:"sine"}),this.noiseHit({duration:1.6,freq:400,freqEnd:90,gain:.14,send:!0}))}playWaveClear(){this.ready&&(this.tone({freq:392,freqEnd:392,duration:.2,gain:.12,type:"triangle",send:!0}),this.tone({freq:523,freqEnd:523,duration:.35,gain:.12,type:"triangle",delay:.16,send:!0}),this.tone({freq:659,freqEnd:659,duration:.6,gain:.1,type:"triangle",delay:.32,send:!0}))}playPickup(){this.tone({freq:520,freqEnd:780,duration:.12,gain:.12,type:"triangle"}),this.tone({freq:780,freqEnd:1040,duration:.15,gain:.1,type:"sine",delay:.08})}playHeal(){this.tone({freq:300,freqEnd:600,duration:.35,gain:.1,type:"sine"}),this.tone({freq:450,freqEnd:900,duration:.4,gain:.07,type:"triangle",delay:.1})}playReviveTick(){this.tone({freq:700+Math.random()*100,freqEnd:900,duration:.05,gain:.05,type:"square"})}playRevive(){this.tone({freq:440,freqEnd:440,duration:.2,gain:.1,type:"triangle"}),this.tone({freq:660,freqEnd:660,duration:.3,gain:.1,type:"triangle",delay:.15})}playHeartbeat(t=.2){this.tone({freq:58,freqEnd:38,duration:.16,gain:t,type:"sine"}),this.tone({freq:52,freqEnd:34,duration:.18,gain:t*.7,type:"sine",delay:.18})}playDistant(){if(!this.ready)return;const t=(Math.random()-.5)*1.6,e=50+Math.random()*40,n=this.ctx,i=n.currentTime,r=n.createOscillator();r.type="sawtooth",r.frequency.setValueAtTime(e,i),r.frequency.linearRampToValueAtTime(e*.8,i+2);const o=n.createBiquadFilter();o.type="lowpass",o.frequency.value=200;const a=n.createGain();a.gain.setValueAtTime(1e-4,i),a.gain.exponentialRampToValueAtTime(.02,i+.4),a.gain.exponentialRampToValueAtTime(1e-4,i+2.2);const l=this.out(t);r.connect(o),o.connect(a),a.connect(l),r.start(i),r.stop(i+2.3),this.sendToReverb(a,1),Math.random()>.5&&this.noiseHit({duration:.3,freq:3e3,freqEnd:400,gain:.02,pan:t,send:!0})}}const Be={torso:new vt(.62,.78,.34,3,.1),pelvis:new vt(.48,.28,.3,2,.06),head:new we(.19,14,12),jaw:new vt(.2,.11,.16,2,.03),shoulder:new we(.11,10,8),upperArm:new an(.085,.3,3,8),lowerArm:new an(.07,.28,3,8),hand:new vt(.11,.18,.08,2,.02),upperLeg:new an(.105,.34,3,8),lowerLeg:new an(.085,.34,3,8),foot:new vt(.16,.1,.32,2,.02),eye:new we(.021,6,5),blood:new ut(.16,.1,.02)},bl=[8161392,9146999,7174755,9740420,8358525,6976864],Tl=[6040363,3358794,4016692,5982772,4865106,3093304,7035976,8010282],Al=[2764341,3551274,2831408,2304566,3815996],Rl={walker:{hp:75,speed:1.35,damage:9,score:100,scale:1,attackCd:1.15},runner:{hp:55,speed:3.15,damage:7,score:150,scale:.94,attackCd:.85},brute:{hp:260,speed:1.05,damage:22,score:500,scale:1.36,attackCd:1.45},crawler:{hp:40,speed:1.9,damage:6,score:80,scale:.8,attackCd:1}};let G0=1;class V0{constructor(t,e,n){this.game=t,this.type=e,this.def=Rl[e]||Rl.walker,this.id=G0++,this.hp=this.def.hp*(1+Math.min(.4,(t.wave-1)*.035)),this.maxHp=this.hp,this.speed=this.def.speed*(.9+Math.random()*.25),this.damage=this.def.damage,this.radius=.36*this.def.scale,this.pos=n.clone(),this.pos.y=0,this.velocity=new E,this.yaw=Math.random()*Math.PI*2,this.state="spawning",this.stateTime=0,this.attackCd=Math.random()*.6,this.walkPhase=Math.random()*Math.PI*2,this.attackAnim=0,this.stagger=0,this.flash=0,this.deathTimer=0,this.groanTimer=2+Math.random()*8,this.target=null,this.removed=!1,this.headless=!1,this.build()}build(){const t=Math.random(),e=bl[Math.floor(Math.random()*bl.length)],n=this.type==="runner"?8006437:Tl[Math.floor(Math.random()*Tl.length)],i=Al[Math.floor(Math.random()*Al.length)],r=new dt({color:e,roughness:.82,metalness:.02,emissive:0}),o=new dt({color:n,roughness:.92,metalness:.02,emissive:0}),a=new dt({color:i,roughness:.94,metalness:.02,emissive:0}),l=new dt({color:1315860,roughness:.7,metalness:.1}),h=new dt({color:4917257,roughness:.65,metalness:.05}),c=new bt({color:this.type==="runner"?16722452:this.type==="brute"?16738834:14221162,toneMapped:!1});this.mats=[r,o,a],this.flashMats=[r,o,a],this.group=new Vt,this.group.name=`zombie-${this.id}`,this.body=new Vt,this.group.add(this.body);const u=(v,m,p,S,T,y=this.body,F="limb")=>{const A=new P(v,m);return A.position.set(p,S,T),A.castShadow=!0,A.receiveShadow=!0,A.userData.zombie=this,A.userData.part=F,y.add(A),A};this.hips=new Vt,this.hips.position.y=.96,this.body.add(this.hips),this.torso=u(Be.torso,o,0,.38,0,this.hips,"torso"),this.torso.scale.set(1,1,1),this.type==="brute"&&this.torso.scale.set(1.18,1.12,1.16),u(Be.pelvis,a,0,-.08,0,this.hips,"torso"),this.headPivot=new Vt,this.headPivot.position.set(0,.9,.015),this.hips.add(this.headPivot),this.head=u(Be.head,r,0,0,0,this.headPivot,"head"),this.head.scale.set(.94,1.08,1),this.jaw=u(Be.jaw,r,0,-.13,.03,this.headPivot,"head"),this.jaw.rotation.x=.35+Math.random()*.25;const f=u(Be.eye,c,-.065,.02,.17,this.headPivot,"head"),d=u(Be.eye,c,.065,.02,.17,this.headPivot,"head");f.scale.setScalar(1),d.scale.setScalar(1);const g=new Me(new me({map:cs(),color:c.color,transparent:!0,opacity:.62,blending:fe,depthWrite:!1,toneMapped:!1}));g.scale.set(.4,.4,1),g.position.set(0,.02,.2),this.headPivot.add(g);for(let v=0;v<2;v++){const m=u(Be.blood,h,(Math.random()-.5)*.3,.35+Math.random()*.3,.17,this.hips,"torso");m.rotation.z=Math.random()*2,m.scale.set(.5+Math.random(),.4+Math.random(),1)}if(t>.55){const v=u(new ut(.18,.24,.02),r,(Math.random()-.5)*.3,.25+Math.random()*.2,.178,this.hips,"torso");v.rotation.z=Math.random()}this.armL=this.buildArm(r,o,-1),this.armR=this.buildArm(r,o,1),this.legL=this.buildLeg(a,l,-1),this.legR=this.buildLeg(a,l,1),this.body.traverse(v=>{v.isMesh&&(v.castShadow=!0,v.receiveShadow=!0)}),this.group.scale.setScalar(this.def.scale),this.group.position.copy(this.pos),this.group.rotation.y=this.yaw,this.game.scene.add(this.group)}buildArm(t,e,n){const i=new Vt;i.position.set(n*.37,.64,0),this.hips.add(i);const r=new P(Be.shoulder,e);r.userData.zombie=this,r.userData.part="limb",i.add(r);const o=new P(Be.upperArm,Math.random()>.4?e:t);o.position.y=-.2,o.userData.zombie=this,o.userData.part="limb",i.add(o);const a=new Vt;a.position.y=-.4,i.add(a);const l=new P(Be.lowerArm,t);l.position.y=-.16,l.userData.zombie=this,l.userData.part="limb",a.add(l);const h=new P(Be.hand,t);return h.position.y=-.36,h.userData.zombie=this,h.userData.part="limb",a.add(h),i.rotation.x=-1.05-Math.random()*.5,i.rotation.z=n*.13,a.rotation.x=-.25-Math.random()*.35,{shoulder:i,elbow:a,side:n}}buildLeg(t,e,n){const i=new Vt;i.position.set(n*.17,-.12,0),this.hips.add(i);const r=new P(Be.upperLeg,t);r.position.y=-.22,r.userData.zombie=this,r.userData.part="limb",i.add(r);const o=new Vt;o.position.y=-.46,i.add(o);const a=new P(Be.lowerLeg,t);a.position.y=-.18,a.userData.zombie=this,a.userData.part="limb",o.add(a);const l=new P(Be.foot,e);return l.position.set(0,-.38,.06),l.userData.zombie=this,l.userData.part="limb",o.add(l),{hip:i,knee:o,side:n}}get headWorld(){const t=new E;return this.head.getWorldPosition(t),t}update(t){if(this.removed)return;this.stateTime+=t,this.flash=Math.max(0,this.flash-t),this.stagger=Math.max(0,this.stagger-t),this.attackCd=Math.max(0,this.attackCd-t),this.groanTimer-=t,this.attackAnim=Math.max(0,this.attackAnim-t*3.4);const e=this.flash>0;for(const d of this.flashMats)e?d.emissive.setRGB(.55,.05,.04):d.emissive.setRGB(0,0,0);if(this.state==="dead"){this.updateDeath(t);return}if(this.state==="spawning"){this.body.position.y=-1.2+Math.min(1,this.stateTime/.5)*1.2,this.stateTime>.5&&(this.state="chase",this.body.position.y=0);return}this.groanTimer<=0&&(this.groanTimer=3+Math.random()*9,this.pos.distanceTo(this.game.player.pos)<26&&this.game.audio.playZombie(this.pos,this.type)),this.chooseTarget();const n=this.target;if(!n||n.state==="dead"||n.isPartner&&n.down){this.idle(t);return}const i=n.pos.x-this.pos.x,r=n.pos.z-this.pos.z,o=Math.hypot(i,r);let l=Math.atan2(i,r)-this.yaw;for(;l>Math.PI;)l-=Math.PI*2;for(;l<-Math.PI;)l+=Math.PI*2;this.yaw+=Nt.clamp(l,-t*5,t*5);const h=this.stagger>0,c=(this.type==="brute"?1.9:1.45)+this.def.scale*.3;if(o>c*.9&&!h){const d=this.speed*(this.stagger>0?.2:1),g=i/(o||1),v=r/(o||1),m=Math.sin(this.walkPhase*.9+this.id)*.22,p=g*Math.cos(m)-v*Math.sin(m),S=g*Math.sin(m)+v*Math.cos(m);this.velocity.x=Nt.damp(this.velocity.x,p*d,6,t),this.velocity.z=Nt.damp(this.velocity.z,S*d,6,t)}else this.velocity.x=Nt.damp(this.velocity.x,0,10,t),this.velocity.z=Nt.damp(this.velocity.z,0,10,t);let u=0,f=0;for(const d of this.game.zombies){if(d===this||d.state==="dead"||d.removed)continue;const g=this.pos.x-d.pos.x,v=this.pos.z-d.pos.z,m=g*g+v*v,p=(this.radius+d.radius)*.94;if(m<p*p&&m>1e-4){const S=Math.sqrt(m);u+=g/S*(p-S)*3.2,f+=v/S*(p-S)*3.2}}this.pos.x+=(this.velocity.x+u)*t,this.pos.z+=(this.velocity.z+f)*t,this.game.mall.collide(this.pos,this.radius),o<=c&&this.attackCd<=0&&!h&&(this.attackCd=this.def.attackCd*(.85+Math.random()*.3),this.attackAnim=1,this.attackTarget=n,this.game.audio.playZombieAttack(this.pos,this.type),setTimeout(()=>{if(this.state==="dead"||this.removed||this.game.state!=="playing"||!this.attackTarget)return;const d=this.attackTarget;if(d.state==="dead"||d.isPartner&&d.down)return;Math.hypot(d.pos.x-this.pos.x,d.pos.z-this.pos.z)<c+.5&&d.damage(this.damage,this.pos)},260)),this.animate(t,o,h),this.group.position.set(this.pos.x,this.pos.y,this.pos.z),this.group.rotation.y=this.yaw}idle(t){this.velocity.multiplyScalar(.9),this.animate(t,10,!1),this.group.position.set(this.pos.x,this.pos.y,this.pos.z),this.group.rotation.y=this.yaw}chooseTarget(){const t=this.game.player,e=this.game.partner,n=[];if(t.state==="alive"&&n.push(t),e&&!e.down&&e.state==="alive"&&n.push(e),!n.length){this.target=null;return}let i=null,r=1/0;for(const o of n){const a=o.pos.distanceToSquared(this.pos);a<r&&(r=a,i=o)}this.target=i}animate(t,e,n){const i=Math.hypot(this.velocity.x,this.velocity.z);i>.1&&(this.walkPhase+=t*(2.2+this.speed*1.6)),this.state==="chase"||this.state;const r=this.attackAnim,o=i>.1?.58:.08,a=Math.sin(this.walkPhase);this.legL.hip.rotation.x=a*o,this.legR.hip.rotation.x=-a*o,this.legL.knee.rotation.x=Math.max(0,-a)*.7+.16,this.legR.knee.rotation.x=Math.max(0,a)*.7+.16,this.body.position.y=Math.abs(Math.sin(this.walkPhase*2))*.045*(i>.1?1:.2),this.body.position.x=Math.sin(this.walkPhase)*.02*(i>.1?1:.2),this.body.rotation.z=Math.sin(this.walkPhase)*.045,this.body.rotation.x=(this.type==="runner"?.16:.08)+(n?-.25:0),this.hips.rotation.y=Math.sin(this.walkPhase)*.05;const l=this.type==="runner"?-1.25:-.95,h=Math.sin(this.walkPhase+Math.PI)*.16;this.armL.shoulder.rotation.x=l+h-r*.7+(n?.4:0),this.armR.shoulder.rotation.x=l-h-r*.7+(n?.4:0),this.armL.shoulder.rotation.z=-.14-r*.18,this.armR.shoulder.rotation.z=.14+r*.18,this.armL.elbow.rotation.x=-.3-r*.3,this.armR.elbow.rotation.x=-.3-r*.3,this.headPivot.rotation.x=-.15+Math.sin(this.walkPhase*.5)*.08-r*.2,this.headPivot.rotation.z=Math.sin(this.walkPhase*.43)*.12,this.jaw.rotation.x=.35+Math.sin(this.walkPhase*.7)*.1,this.headless&&(this.headPivot.visible=!1)}takeDamage(t,e,n,i,r){return this.state==="dead"||this.state==="spawning"?{dead:!1,head:!1}:(this.hp-=t,this.lastAttacker=r,this.flash=.11,this.stagger=Math.min(.45,this.stagger+(this.type==="brute"?.05:.18)),this.velocity.x+=i.x*(this.type==="brute"?.4:1.2),this.velocity.z+=i.z*(this.type==="brute"?.4:1.2),r==="player"&&(e==="head"&&this.game.player.stats.headshots++,this.game.player.stats.hits++),this.game.effects.spawnBlood(n,i,e==="head"?1.6:1),this.hp<=0?(this.die(e,i),{dead:!0,head:e==="head"}):{dead:!1,head:e==="head"})}die(t,e){this.state="dead",this.deathTimer=0,this.velocity.set(e.x*1.6,0,e.z*1.6),this.game.addKill(this,t==="head",this.lastAttacker==="partner"),t==="head"&&(this.headless=!0,this.headPivot.visible=!1,this.game.effects.spawnHead(this.headWorld,e),this.game.audio.playHeadshot()),this.game.effects.spawnBlood(this.headWorld,new E(e.x,.6,e.z),3),this.game.effects.spawnBlood(new E(this.pos.x,1.2,this.pos.z),new E(e.x,.2,e.z),2),this.game.effects.spawnBloodDecal(this.pos.x+e.x*1.1,this.pos.z+e.z*1.1,1.7+Math.random()*1.4),this.game.audio.playDeath(this.pos,this.type),this.deathTilt=(Math.random()-.5)*.6,this.deathSpeed=2.6+Math.random(),this.game.hud.killfeed(this.type,t==="head");const n=Math.random();n<.17?this.game.spawnPickup("health",this.pos):n<.42&&this.game.spawnPickup("ammo",this.pos)}updateDeath(t){this.deathTimer+=t;const e=Math.min(1,this.deathTimer/.7);this.body.rotation.x=this.body.rotation.x+(this.deathTilt-this.body.rotation.x)*Math.min(1,t*8);const n=e*e;this.body.position.y=-n*.85,this.body.rotation.z=Nt.lerp(this.body.rotation.z,this.deathTilt*.8,Math.min(1,t*6)),this.group.position.set(this.pos.x,this.pos.y,this.pos.z),this.deathTimer>4.5&&(this.group.position.y=-(this.deathTimer-4.5)*.5,this.deathTimer>7&&this.remove())}remove(){if(!this.removed){this.removed=!0,this.game.scene.remove(this.group);for(const t of this.mats)t.dispose()}}}const Cl=["THE HORDE IS INSIDE THE BUILDING","SOMETHING MOVING IN THE FOOD COURT","THE CINEMA DOORS ARE OPEN","THEY CAME UP FROM PARKING P2","SECURITY FEED IS OFFLINE","THE ESCALATORS ARE NOT A SAFE HAVEN","DO NOT LET THEM REACH THE ATRIUM","THE NIGHT SHIFT IS GETTING CROWDED"];class W0{constructor(t){this.game=t,this.number=0,this.total=0,this.toSpawn=0,this.spawnTimer=0,this.spawnInterval=1,this.maxAlive=8,this.state="idle",this.intermissionLeft=0,this.totalWaves=0}reset(){this.number=0,this.total=0,this.toSpawn=0,this.state="idle",this.intermissionLeft=0,this.spawnTimer=1.2,this.startWave(1)}composition(t){const e=[],n=4+Math.floor(t*2.4);for(let i=0;i<n;i++)e.push("walker");if(t>=2)for(let i=0;i<Math.floor(t*.9);i++)e.push("runner");if(t>=4)for(let i=0;i<Math.floor((t-2)/2);i++)e.push("brute");if(t>=6&&t%3===0)for(let i=0;i<2;i++)e.push("crawler");for(let i=e.length-1;i>0;i--){const r=Math.floor(Math.random()*(i+1));[e[i],e[r]]=[e[r],e[i]]}return e.slice(0,48)}startWave(t){this.number=t,this.game.wave=t,this.state="active";const e=this.composition(t);this.queue=e,this.total=e.length,this.toSpawn=e.length,this.spawnTimer=.8,this.spawnInterval=Math.max(.42,1.35-t*.07),this.maxAlive=Math.min(20,6+t*2),this.game.hud.waveBanner(`WAVE ${String(t).padStart(2,"0")}`,t===1?"THE HORDE IS INSIDE THE BUILDING":Cl[(t-2)%Cl.length],2.8),this.game.audio.playWave(),t>1&&this.game.player.addGrenade(1),this.game.hud.setWave(this.snapshot())}snapshot(){const t=this.game.zombies.filter(e=>!e.removed&&e.state!=="dead").length;return{number:this.number,total:this.total,toSpawn:this.toSpawn,remaining:t,intermission:this.state==="intermission",intermissionLeft:this.intermissionLeft}}update(t){if(this.state==="active"){const e=this.game.zombies.filter(n=>!n.removed&&n.state!=="dead").length;this.spawnTimer-=t,this.toSpawn>0&&this.spawnTimer<=0&&e<this.maxAlive&&(this.spawn(),this.spawnTimer=this.spawnInterval*(.75+Math.random()*.5)),this.toSpawn<=0&&e===0&&this.game.state==="playing"&&this.completeWave(),this.game.hud.setWave(this.snapshot())}else this.state==="intermission"&&(this.intermissionLeft-=t,this.game.hud.setWave(this.snapshot()),this.intermissionLeft<=0&&this.startWave(this.number+1))}spawn(){const t=this.queue.pop()||"walker";this.toSpawn--;const e=this.game.mall.getSpawnPoint(this.game.player.pos,this.game.partner?.pos),n=new V0(this.game,t,e);this.game.zombies.push(n),this.game.audio.playZombie(e,t)}completeWave(){this.state="intermission",this.intermissionLeft=8,this.game.hud.waveBanner(`WAVE ${String(this.number).padStart(2,"0")} CLEARED`,"CATCH YOUR BREATH — RESUPPLY IN THE ATRIUM",3.2),this.game.audio.playWaveClear(),this.game.addScore(250+this.number*125,!1),this.game.partner&&this.game.partner.down&&setTimeout(()=>{this.game.state==="playing"&&this.game.partner.revive()},1500),this.game.spawnIntermissionPickups(),this.game.hud.subtitle("ROOK","Wave clear. Grab what you can — they regroup fast.",2.8)}}const Dt=s=>document.getElementById(s);class X0{constructor(t){this.game=t,this.root=Dt("hud"),this.el={waveNum:Dt("wave-num"),waveProgress:Dt("wave-progress"),waveSub:Dt("wave-sub"),hostiles:Dt("hostiles"),score:Dt("score"),killTotal:Dt("kill-total"),killfeed:Dt("killfeed"),healthBar:Dt("health-bar"),healthNum:Dt("health-num"),staminaBar:Dt("stamina-bar"),partnerPanel:Dt("partner-panel"),partnerHp:Dt("partner-hp"),partnerState:Dt("partner-state"),partnerRevive:Dt("partner-revive"),reviveProgress:Dt("revive-progress"),grenades:Dt("grenades"),weaponName:Dt("weapon-name"),ammoMag:Dt("ammo-mag"),ammoReserve:Dt("ammo-reserve"),slot1:Dt("slot-1"),slot2:Dt("slot-2"),crosshair:Dt("crosshair"),hitmarker:Dt("hitmarker"),subtitle:Dt("subtitle"),interact:Dt("interact"),interactLabel:Dt("interact-label"),waveBanner:Dt("wave-banner"),wbTitle:Dt("wb-title"),wbSub:Dt("wb-sub"),lowHealth:Dt("low-health"),fxDamage:Dt("fx-damage"),fxHeal:Dt("fx-heal"),compassTape:Dt("compass-tape"),compassDeg:Dt("compass-deg"),damageArrows:Dt("damage-arrows")},this.killfeedItems=[],this.subtitleTimer=null,this.damageTimer=null,this.bannerTimer=null,this.quality=Dt("quality-label"),this.lowHealthOn=!1}show(){this.root.classList.remove("hidden")}hide(){this.root.classList.add("hidden")}reset(){this.el.killfeed.innerHTML="",this.killfeedItems.length=0,this.el.subtitle.classList.remove("on"),this.el.waveBanner.classList.add("hidden"),this.el.waveBanner.classList.remove("out"),this.el.interact.classList.add("hidden"),this.el.lowHealth.classList.add("hidden"),this.lowHealthOn=!1,this.el.crosshair.classList.remove("ads","hidden"),this.el.damageArrows.innerHTML="",this.el.fxDamage.classList.remove("on"),this.el.fxHeal.classList.remove("on"),this.el.partnerPanel.classList.remove("down")}setWave(t){this.el.waveNum.textContent=String(t.number).padStart(2,"0");const e=Math.max(1,t.total),n=t.remaining+t.toSpawn,i=Math.max(0,Math.min(1,1-n/e));this.el.waveProgress.style.width=`${i*100}%`,this.el.hostiles.textContent=n,t.intermission?this.el.waveSub.innerHTML=`NEXT WAVE IN <b>${Math.ceil(t.intermissionLeft)}</b>`:this.el.waveSub.innerHTML=`HOSTILES REMAINING <b>${n}</b>`}setScore(t,e){this.el.score.textContent=t.toLocaleString("en-US"),this.el.killTotal.textContent=`${e} KILL${e===1?"":"S"}`}setWeapon(t){const e=t.def;this.el.weaponName.textContent=e.name,this.el.ammoMag.textContent=String(t.state.mag).padStart(2,"0"),this.el.ammoReserve.textContent=t.state.reserve,this.el.ammoMag.classList.toggle("low",t.state.mag<=Math.ceil(e.mag*.25)),this.el.slot1.classList.toggle("active",t.current==="rifle"),this.el.slot2.classList.toggle("active",t.current==="shotgun")}updateVitals(t){const e=Math.max(0,Math.round(t.health));this.el.healthBar.style.width=`${t.health/t.maxHealth*100}%`,this.el.healthNum.textContent=e,this.el.staminaBar.style.width=`${t.stamina}%`;const n=t.health<=32&&t.state==="alive";n!==this.lowHealthOn&&(this.lowHealthOn=n,this.el.lowHealth.classList.toggle("hidden",!n)),t.state==="dead"&&(this.el.healthNum.textContent="0")}setGrenades(t){this.el.grenades.textContent=t}updatePartner(t){if(!t){this.el.partnerPanel.classList.add("hidden");return}this.el.partnerPanel.classList.remove("hidden");const e=t.down;this.el.partnerPanel.classList.toggle("down",e),this.el.partnerHp.style.width=`${Math.max(0,t.hp/t.maxHp)*100}%`,this.el.partnerState.textContent=e?"DOWN":t.hp<100?"WOUNDED":"LINKED",this.el.partnerRevive.classList.toggle("hidden",!e),e&&(this.el.reviveProgress.style.width=`${Math.min(100,t.reviveProgress*100)}%`)}hitmarker(t=!1,e=!1){const n=this.el.hitmarker;n.classList.remove("on","head"),n.offsetWidth,n.classList.add("on"),t&&n.classList.add("head"),e?n.style.transform="scale(1.3)":n.style.transform=""}damageFlash(t){const e=this.el.fxDamage;e.classList.add("on"),clearTimeout(this.damageTimer),this.damageTimer=setTimeout(()=>e.classList.remove("on"),140)}damageArrow(t){if(!t)return;const e=this.game.player,n=t.x-e.pos.x,i=t.z-e.pos.z,r=-Math.sin(e.yaw),o=-Math.cos(e.yaw),a=Math.cos(e.yaw),l=-Math.sin(e.yaw),h=Math.atan2(n*a+i*l,n*r+i*o)*180/Math.PI,c=document.createElement("div");c.className="dmg-arrow",c.style.transform=`rotate(${h-90}deg)`;const u=document.createElement("i");c.appendChild(u),this.el.damageArrows.appendChild(c),setTimeout(()=>c.remove(),750)}healFlash(){const t=this.el.fxHeal;t.classList.add("on"),setTimeout(()=>t.classList.remove("on"),240)}subtitle(t,e,n=2){clearTimeout(this.subtitleTimer),this.el.subtitle.innerHTML=t?`<b>${t}</b> ${e}`:e,this.el.subtitle.classList.add("on"),this.subtitleTimer=setTimeout(()=>this.el.subtitle.classList.remove("on"),n*1e3)}interact(t,e=""){this.el.interact.classList.toggle("hidden",!t),e&&(this.el.interactLabel.textContent=e)}killfeed(t,e){const n={walker:"WALKER",runner:"RUNNER",brute:"BRUTE",crawler:"CRAWLER"},i=document.createElement("div");i.className="kill-line",i.innerHTML=`<b>${n[t]||"INFECTED"}</b> ${e?'<span class="hs">HEADSHOT</span>':"DOWN"} · <b>M4</b>`,this.el.killfeed.appendChild(i),this.killfeedItems.push(i),this.killfeedItems.length>4&&this.killfeedItems.shift().remove(),setTimeout(()=>{i.style.transition="opacity .4s",i.style.opacity="0",setTimeout(()=>i.remove(),400)},3600)}waveBanner(t,e,n=2.8){const i=this.el.waveBanner;clearTimeout(this.bannerTimer),this.el.wbTitle.textContent=t,this.el.wbSub.textContent=e,i.classList.remove("hidden","out"),i.offsetWidth,this.bannerTimer=setTimeout(()=>{i.classList.add("out"),setTimeout(()=>i.classList.add("hidden"),500)},n*1e3)}updateCrosshair(t,e){e.def;const n=Math.hypot(t.velocity.x,t.velocity.z)>1.5;q0(6,20,1-e.ads);const i=4+(n?7:0)+(e.reloading>0?14:0)+(t.sprinting?8:0);this.el.crosshair.style.setProperty("--spread",`${i}px`),this.el.crosshair.classList.toggle("ads",e.ads>.6)}updateCompass(t){let e=(-t*180/Math.PI%360+360)%360;this.el.compassDeg.textContent=String(Math.round(e)).padStart(3,"0");const n=e/360*320;this.el.compassTape.style.backgroundPosition=`${-n}px 0`,this.el.compassTape.style.transform="none"}setQuality(t){this.quality&&(this.quality.textContent=t)}showGameover(t){Dt("stat-wave").textContent=t.wave,Dt("stat-kills").textContent=t.kills,Dt("stat-heads").textContent=t.headshots,Dt("stat-acc").textContent=`${t.accuracy}%`,Dt("stat-score").textContent=t.score.toLocaleString("en-US"),Dt("stat-time").textContent=t.time,Dt("gameover-copy").textContent=t.copy||"The mall keeps its guests.",Dt("gameover").classList.remove("hidden")}}function q0(s,t,e){return s+(t-s)*e}new E;new E;const Y0={uniforms:{tDiffuse:{value:null},uTime:{value:0},uResolution:{value:new nt(1,1)},uGrain:{value:.032},uVignette:{value:.85},uAberration:{value:.0011}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
    uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uResolution;
    uniform float uGrain; uniform float uVignette; uniform float uAberration;
    varying vec2 vUv;
    float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453); }
    void main(){
      vec2 uv = vUv;
      float ca = uAberration;
      vec3 col;
      col.r = texture2D(tDiffuse, uv + vec2(ca, 0.0)).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - vec2(ca, 0.0)).b;
      float d = distance(uv, vec2(0.5));
      float vig = smoothstep(0.86, 0.28, d);
      col *= mix(1.0, vig, uVignette);
      float g = rand(uv * uResolution + fract(uTime) * 431.7) - 0.5;
      col += g * uGrain;
      col *= 0.985 + 0.015 * rand(vec2(uTime, 1.0));
      gl_FragColor = vec4(col, 1.0);
    }`};class K0{constructor(){this.state="loading",this.time=0,this.menuTime=0,this.wave=1,this.score=0,this.kills=0,this.partnerKills=0,this.mode="coop",this.zombies=[],this.pickups=[],this.grenades=[],this.settings={sensitivity:1,volume:.8,quality:"auto",invertY:!1},this.loadSettings(),this.sensitivity=this.settings.sensitivity,this.deathTimer=0,this.elapsed=0,this.shotsFired=0,this.shotsHit=0,this.qualityLevel="high",this.setupRenderer(),this.scene=new ph,this.scene.background=new Ct(461327),this.scene.fog=new Za(658965,.0125),this.camera=new ke(75,innerWidth/innerHeight,.045,220),this.camera.rotation.order="YXZ",this.scene.add(this.camera),this.audio=new H0,this.audio.volume=this.settings.volume,this.audio.gameCamera=this.camera,this.hud=new X0(this),this.input=new I0(this.renderer.domElement),this.input.enabled=!1,this.effects=new k0(this),this.mall=new L0(this),this.scene.add(this.mall.group),this.mall.group.traverse(n=>{n.isMesh&&n.userData.impact&&this.mall.impactMeshes.push(n)});const t=new La(this.renderer),e=new x0;this.scene.environment=t.fromScene(e,.04).texture,this.scene.environmentIntensity=.42,t.dispose(),this.player=new U0(this),this.weapon=new N0(this),this.partnerObject=new F0(this),this.partner=this.partnerObject,this.waves=new W0(this),this.setupComposer(),this.setupUI(),this.applyQuality(this.settings.quality,!0),this.resetRun("coop"),this.enterMenu(!0),this.bindEvents(),this.clock=new wh,this.loop=this.loop.bind(this),requestAnimationFrame(this.loop)}loadSettings(){try{const t=localStorage.getItem("motd-settings");t&&Object.assign(this.settings,JSON.parse(t))}catch{}}saveSettings(){try{localStorage.setItem("motd-settings",JSON.stringify(this.settings))}catch{}this.sensitivity=this.settings.sensitivity,this.audio.setVolume(this.settings.volume)}setupRenderer(){const t=document.createElement("canvas");t.id="game-canvas",t.tabIndex=0,document.getElementById("viewport").appendChild(t),this.renderer=new Bm({canvas:t,antialias:!0,powerPreference:"high-performance",stencil:!1}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6)),this.renderer.setSize(innerWidth,innerHeight),this.renderer.outputColorSpace=Fe,this.renderer.toneMapping=za,this.renderer.toneMappingExposure=1.2,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Il;const e=this.renderer.getContext(),n=e.getExtension("WEBGL_debug_renderer_info"),i=n?e.getParameter(n.UNMASKED_RENDERER_WEBGL):"";this.gpuName=String(i||""),this.softwareRenderer=/swiftshader|llvmpipe|software|basic render/i.test(this.gpuName)}setupComposer(){this.composer=new p0(this.renderer),this.renderPass=new m0(this.scene,this.camera),this.composer.addPass(this.renderPass),this.bloom=new Oi(new nt(innerWidth,innerHeight),.52,.62,.82),this.composer.addPass(this.bloom),this.vignette=new Th(Y0),this.vignette.uniforms.uResolution.value.set(innerWidth,innerHeight),this.composer.addPass(this.vignette),this.output=new _0,this.composer.addPass(this.output)}applyQuality(t,e=!1){const i=t==="low"||t==="auto"&&this.softwareRenderer;this.qualityLevel=i?"low":"high",this.renderer.setPixelRatio(i?1:Math.min(devicePixelRatio,1.6)),this.bloom.strength=i?.34:.52,this.bloom.radius=i?.5:.62,this.renderer.shadowMap.enabled=!i,this.mall.moonLight.castShadow=!i,this.mall.moonLight.shadow&&this.mall.moonLight.shadow.mapSize.set(i?1024:2048,i?1024:2048),this.scene.traverse(r=>{if(r.material){const o=Array.isArray(r.material)?r.material:[r.material];for(const a of o)a.needsUpdate=!0}}),this.hud.setQuality(i?this.softwareRenderer?"SOFTWARE / PERFORMANCE":"PERFORMANCE":"HIGH"),e||this.saveSettings()}setupUI(){const t=(l,h)=>document.getElementById(l)?.addEventListener("click",h);t("btn-play",()=>this.startGame("coop")),t("btn-solo",()=>this.startGame("solo")),t("btn-help",()=>this.openModal("help")),t("btn-help-close",()=>this.closeModal("help")),t("help-done",()=>this.closeModal("help")),t("btn-options",()=>this.openModal("options")),t("options-close",()=>this.closeModal("options")),t("options-done",()=>this.closeModal("options")),t("btn-pause-help",()=>this.openModal("help")),t("btn-resume",()=>this.resume()),t("btn-restart",()=>{this.closeModal("pause"),this.startGame(this.mode)}),t("btn-quit",()=>{this.closeModal("pause"),this.enterMenu()}),t("btn-redeploy",()=>{document.getElementById("gameover").classList.add("hidden"),this.startGame(this.mode)}),t("btn-gameover-quit",()=>{document.getElementById("gameover").classList.add("hidden"),this.enterMenu()});const e=document.getElementById("opt-sens"),n=document.getElementById("opt-sens-out");e.value=this.settings.sensitivity,n.textContent=Number(this.settings.sensitivity).toFixed(2),e.addEventListener("input",()=>{this.settings.sensitivity=Number(e.value),n.textContent=Number(e.value).toFixed(2),this.sensitivity=Number(e.value),this.saveSettings()});const i=document.getElementById("opt-vol"),r=document.getElementById("opt-vol-out");i.value=this.settings.volume,r.textContent=`${Math.round(this.settings.volume*100)}%`,i.addEventListener("input",()=>{this.settings.volume=Number(i.value),r.textContent=`${Math.round(i.value*100)}%`,this.saveSettings()});const o=document.getElementById("opt-quality");o.value=this.settings.quality,o.addEventListener("change",()=>{this.settings.quality=o.value,this.applyQuality(o.value),this.saveSettings()});const a=document.getElementById("opt-invert");a.checked=!!this.settings.invertY,a.addEventListener("change",()=>{this.settings.invertY=a.checked,this.saveSettings()}),document.getElementById("rotate")?.classList.add("hidden")}openModal(t){document.getElementById(t)?.classList.remove("hidden"),this.state==="playing"&&this.input.releaseLock()}closeModal(t){document.getElementById(t)?.classList.add("hidden"),this.state==="playing"&&!this.input.pointerLocked&&this.input.requestLock()}bindEvents(){window.addEventListener("resize",()=>this.onResize()),document.addEventListener("pointerlockchange",()=>{this.input.pointerLocked=document.pointerLockElement===this.renderer.domElement,!this.input.pointerLocked&&this.state==="playing"&&!this.starting&&this.pause()}),window.addEventListener("keydown",t=>{if(t.code==="Escape")if(this.state==="playing")this.pause();else if(this.state==="paused")this.resume();else for(const e of["help","options"])this.closeModal(e);t.code==="KeyM"&&this.state==="playing"&&(this.audio.setVolume(this.settings.volume>0?0:.8),this.settings.volume=this.audio.volume,this.saveSettings())}),this.renderer.domElement.addEventListener("click",()=>{this.state==="playing"&&!this.input.pointerLocked&&this.input.requestLock()}),document.addEventListener("visibilitychange",()=>{document.hidden&&this.state==="playing"&&this.pause()})}onResize(){this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(innerWidth,innerHeight),this.composer.setSize(innerWidth,innerHeight),this.vignette.uniforms.uResolution.value.set(innerWidth,innerHeight),this.bloom.setSize(innerWidth,innerHeight)}resetRun(t){this.mode=t,this.zombies.forEach(e=>e.remove()),this.zombies.length=0,this.pickups.forEach(e=>this.scene.remove(e.group)),this.pickups.length=0,this.grenades.forEach(e=>this.scene.remove(e.mesh)),this.grenades.length=0,this.effects.reset(),this.score=0,this.kills=0,this.partnerKills=0,this.elapsed=0,this.shotsFired=0,this.shotsHit=0,this.deathTimer=0,this.player.reset(),this.weapon.refillAll(),this.weapon.equip("rifle",!0),this.weapon.root.visible=!0,this.partner=t==="coop"?this.partnerObject:null,this.partnerObject.group.visible=t==="coop",t==="coop"&&this.partnerObject.reset(),this.hud.reset(),this.hud.setScore(0,0),this.hud.setGrenades(this.player.grenades),this.hud.setWeapon(this.weapon),this.hud.updateVitals(this.player),this.hud.updatePartner(this.partner),this.waves.number=0,this.waves.state="idle",this.wave=1}startGame(t){this.audio.init(),this.audio.setVolume(this.settings.volume),this.resetRun(t),this.menuEl=document.getElementById("menu"),this.menuEl.classList.add("out"),document.getElementById("help")?.classList.add("hidden"),document.getElementById("options")?.classList.add("hidden"),this.hud.show(),this.hud.setScore(0,0),this.state="playing",this.starting=!0,this.input.enabled=!0,this.player.applyCamera(0,!0),this.camera.fov=75,this.camera.updateProjectionMatrix(),this.input.requestLock(),setTimeout(()=>{this.starting=!1},450),this.waves.reset(),this.elapsed=0,setTimeout(()=>{this.state==="playing"&&this.hud.subtitle("ROOK",this.mode==="coop"?"On me. Keep the atrium clear and watch the escalators.":"No partner, no backup. Stay mobile.",3.4)},1400)}enterMenu(t=!1){this.state="menu",this.input.enabled=!1,this.input.releaseLock(),this.weapon.root.visible=!1,this.partnerObject.group.visible=!1,this.player.flashlight.visible=!1,this.hud.hide(),document.getElementById("pause")?.classList.add("hidden"),document.getElementById("gameover")?.classList.add("hidden"),document.getElementById("menu").classList.remove("out"),this.menuTime=0,this.zombies.forEach(n=>n.remove()),this.zombies.length=0,this.pickups.forEach(n=>this.scene.remove(n.group)),this.pickups.length=0,t||(this.audio.setVolume(this.settings.volume),this.audio.ambGain&&(this.audio.ambGain.gain.value=.13))}pause(){this.state==="playing"&&(this.state="paused",this.input.enabled=!1,this.input.mouse.left=this.input.mouse.right=!1,document.getElementById("pause").classList.remove("hidden"),this.input.releaseLock())}resume(){this.state==="paused"&&(document.getElementById("pause").classList.add("hidden"),this.state="playing",this.input.enabled=!0,this.input.requestLock(),this.clock.getDelta())}onPlayerDeath(){this.state==="playing"&&(this.state="dying",this.deathTimer=0,this.input.enabled=!1,this.input.releaseLock(),this.hud.subtitle("ROOK","No... no, get up!",2.6),this.audio.playDeath(this.player.pos,"brute"),this.hud.hide(),setTimeout(()=>{if(this.state!=="dying")return;this.state="gameover",this.input.enabled=!1;const t=Math.floor(this.elapsed),e=`${String(Math.floor(t/60)).padStart(2,"0")}:${String(t%60).padStart(2,"0")}`;this.hud.showGameover({wave:this.wave,kills:this.kills,headshots:this.player.stats.headshots,accuracy:this.shotsFired?Math.round(this.shotsHit/this.shotsFired*100):0,score:this.score,time:e,copy:this.mode==="coop"?"Rook is still in there. The mall keeps its guests.":"No partner. No backup. The mall keeps its guests."})},1900))}addKill(t,e,n=!1){this.kills++,n?(this.partnerKills++,this.addScore(Math.round(t.def.score*.6),!1)):(this.player.stats.kills++,this.addScore(Math.round(t.def.score*(e?1.6:1)),!1)),this.hud.setScore(this.score,this.kills)}addScore(t,e=!0){this.score+=t,e&&this.hud.setScore(this.score,this.kills)}fireHitscan(t,e,n,i){this.raycaster=this.raycaster||new Eh,this.raycaster.set(t,e),this.raycaster.far=n.range;const r=[];for(const c of this.zombies)!c.removed&&c.state!=="dead"&&r.push(c.group);const o=r.length?this.raycaster.intersectObjects(r,!0):[],a=this.mall.impactMeshes.length?this.raycaster.intersectObjects(this.mall.impactMeshes,!1):[];let l=null;for(const c of o){const u=c.object.userData.zombie;if(!(!u||u.state==="dead"||u.removed)&&!(c.object.userData.part==="head"&&u.headless)){l=c;break}}const h=a[0];if(l&&(!h||l.distance<h.distance)){const c=l.object.userData.zombie,u=l.object.userData.part||"torso",f=u==="head"?n.headMult:u==="torso"?1:n.limbMult,d=n.damage*f*(.92+Math.random()*.16);this.shotsHit++;const g=c.takeDamage(d,u,l.point,e,"player");return g.head&&this.hud.hitmarker(!0,g.dead),{hit:!0,head:g.head,kill:g.dead,point:l.point,normal:l.face?.normal||e.clone().negate()}}return h?(this.effects.spawnImpact(h.point,h.face?.normal||e.clone().negate()),this.audio.noiseHit({duration:.06,freq:2600,freqEnd:500,gain:.09,send:!0}),{hit:!1,point:h.point}):{hit:!1,point:t.clone().addScaledVector(e,80)}}spawnPickup(t,e){const n=new Vt,i=t==="health"?5898138:t==="ammo"?16761178:8051199;if(t==="health"){const l=new P(new ut(.44,.3,.34),new dt({color:15262940,roughness:.55}));l.position.y=.25,n.add(l);const h=new bt({color:16726832,toneMapped:!1}),c=new P(new ut(.26,.07,.012),h);c.position.set(0,.25,.176),n.add(c);const u=new P(new ut(.07,.22,.012),h);u.position.set(0,.25,.176),n.add(u)}else if(t==="ammo"){const l=new P(new ut(.5,.3,.32),new dt({color:3951157,roughness:.7,metalness:.2}));l.position.y=.22,n.add(l);const h=new P(new ut(.52,.06,.34),new bt({color:16757575,toneMapped:!1}));h.position.y=.25,n.add(h)}else{const l=new P(new we(.16,10,8),new dt({color:4214848,roughness:.45,metalness:.5}));l.position.y=.25,l.scale.set(1,1.2,1),n.add(l);const h=new P(new Gt(.165,.165,.06,10),new bt({color:8051199,toneMapped:!1}));h.position.y=.28,n.add(h)}const r=new Me(new me({map:this.effects.glowTex,color:i,transparent:!0,opacity:.55,blending:fe,depthWrite:!1}));r.scale.set(1.2,1.2,1),r.position.y=.4,n.add(r);const o=new P(new Fi(.4,.46,24),new bt({color:i,transparent:!0,opacity:.5,side:ve,depthWrite:!1,toneMapped:!1,blending:fe}));o.rotation.x=-Math.PI/2,o.position.y=.02,n.add(o),n.position.set(e.x,0,e.z),this.scene.add(n);const a={group:n,type:t,age:0,baseY:0,ring:o,glow:r};return this.pickups.push(a),a}spawnIntermissionPickups(){for(const e of this.pickups)this.scene.remove(e.group);this.pickups.length=0;const t=[{type:"ammo",x:6.5,z:22},{type:"health",x:-6.5,z:16},{type:"ammo",x:-5,z:-14},{type:"health",x:7,z:-20},{type:"grenade",x:0,z:9}];for(const e of t)this.spawnPickup(e.type,e)}collectPickup(t){const e=this.pickups.indexOf(t);if(!(e<0))if(this.pickups.splice(e,1),this.scene.remove(t.group),t.type==="health"){const n=this.player.health;this.player.heal(45),this.audio.playHeal(),this.hud.subtitle("",`+${Math.round(this.player.health-n)} HEALTH`,1.2)}else t.type==="ammo"?(this.weapon.addAmmo(1),this.audio.playPickup(),this.hud.subtitle("","AMMO RESUPPLIED",1.2),this.hud.setWeapon(this.weapon)):(this.player.addGrenade(1),this.audio.playPickup(),this.hud.subtitle("","+1 FRAG GRENADE",1.2))}throwGrenade(){const t=new we(.09,10,8),e=new dt({color:3885624,roughness:.5,metalness:.35}),n=new P(t,e),i=new E(0,0,-1).applyQuaternion(this.camera.quaternion);n.position.copy(this.camera.position).addScaledVector(i,.45),n.position.y-=.1;const r=new P(new to(.09,.012,6,14),new bt({color:16738890,toneMapped:!1}));r.rotation.x=Math.PI/2,n.add(r);const o=new Re(16738890,3,3,2);n.add(o),this.scene.add(n),this.grenades.push({mesh:n,vel:i.clone().multiplyScalar(13).add(new E(0,2.6,0)).add(new E(this.player.velocity.x*.5,0,this.player.velocity.z*.5)),fuse:2.3,light:o,bounces:0})}updateGrenades(t){for(let e=this.grenades.length-1;e>=0;e--){const n=this.grenades[e];n.fuse-=t,n.vel.y-=15*t,n.mesh.position.clone(),n.mesh.position.addScaledVector(n.vel,t),n.mesh.rotation.x+=t*5,n.mesh.rotation.z+=t*7,n.mesh.position.y<.1&&(n.mesh.position.y=.1,n.vel.y<-1?(n.vel.y*=-.42,n.vel.x*=.72,n.vel.z*=.72,this.audio.playClick(),n.bounces++):(n.vel.y=0,n.vel.x*=.92,n.vel.z*=.92));const i=n.mesh.position.clone();this.mall.collide(i,.1),i.distanceToSquared(n.mesh.position)>1e-5&&(n.mesh.position.x=i.x,n.mesh.position.z=i.z,n.vel.x*=-.45,n.vel.z*=-.45),n.light.intensity=2.2+(Math.sin(this.time*30)*.5+.5)*1.8,n.fuse<=0&&(this.explodeGrenade(n),this.scene.remove(n.mesh),this.grenades.splice(e,1))}}explodeGrenade(t){const e=t.mesh.position.clone();this.effects.spawnExplosion(e),this.audio.playExplosion(e),this.player.addShake(.9);for(const i of this.zombies){if(i.state==="dead"||i.removed)continue;const r=Math.hypot(i.pos.x-e.x,i.pos.z-e.z);if(r<7){const o=Math.max(.15,1-r/7),a=new E(i.pos.x-e.x,.3,i.pos.z-e.z).normalize(),l=i.takeDamage(200*o,"torso",new E(i.pos.x,1,i.pos.z),a,"player");this.shotsHit++,l.dead&&this.hud.hitmarker(!1,!0)}}const n=Math.hypot(this.player.pos.x-e.x,this.player.pos.z-e.z);n<4.5&&(this.player.addShake(1),this.player.damage(8*(1-n/4.5),e))}updatePickups(t){for(let e=this.pickups.length-1;e>=0;e--){const n=this.pickups[e];n.age+=t,n.group.position.y=Math.sin(this.time*2+e)*.05,n.group.rotation.y+=t*.8,n.ring.rotation.z+=t*.6,n.glow.material.opacity=.42+Math.sin(this.time*4+e)*.12,n.age>.4&&this.player.state==="alive"&&Math.hypot(this.player.pos.x-n.group.position.x,this.player.pos.z-n.group.position.z)<1.55&&this.collectPickup(n)}}updateInteract(){let t=!1,e="";this.partner&&this.partner.down&&(Math.hypot(this.player.pos.x-this.partner.pos.x,this.player.pos.z-this.partner.pos.z)<2.4?(t=!0,e="REVIVE ROOK"):(t=!0,e="ROOK IS DOWN")),this.hud.interact(t,e)}update(t){if(this.time+=t,this.state==="menu"){this.menuTime+=t;const e=this.menuTime,n=this.camera,i=Math.sin(e*.08);n.position.set(5.6+i*1.4,4.15+Math.sin(e*.13)*.12,29-Math.sin(e*.05)*2.2),n.lookAt(-3.2+Math.sin(e*.045)*2.4,6.3+Math.sin(e*.07)*.4,-30),n.fov=66,n.updateProjectionMatrix(),this.mall.update(t,this.time),this.effects.update(t),this.audio.update(t,this),this.render(t);return}if(this.state==="playing"){this.elapsed+=t,this.mall.update(t,this.time),this.player.update(t,this.input),this.weapon.update(t,this.input,this.player),this.partner&&this.partner.update(t,this.input);for(const e of this.zombies)e.update(t);this.waves.update(t),this.effects.update(t),this.updateGrenades(t),this.updatePickups(t),this.audio.update(t,this),this.hud.updateVitals(this.player),this.hud.updatePartner(this.partner),this.hud.updateCrosshair(this.player,this.weapon),this.hud.updateCompass(this.player.yaw),this.hud.setScore(this.score,this.kills),this.updateInteract(),this.input.endFrame(),this.starting=!1}else if(this.state==="paused")this.mall.update(t*.12,this.time),this.effects.update(t*.12),this.audio.update(t*.05,this);else if(this.state==="dying"){this.deathTimer+=t,this.mall.update(t,this.time),this.effects.update(t),this.updateGrenades(t);for(const n of this.zombies)n.update(t*.35);this.audio.update(t,this);const e=Math.min(1,this.deathTimer/1.7);this.camera.rotation.z=Nt.lerp(0,1.15,e*e),this.camera.position.y=Nt.lerp(this.camera.position.y,.55,e*.2),this.hud.updateVitals(this.player)}else this.state==="gameover"&&(this.mall.update(t,this.time),this.effects.update(t),this.audio.update(t*.4,this));this.render(t)}render(t){this.vignette&&(this.vignette.uniforms.uTime.value=this.time),this.composer.render(t)}loop(){requestAnimationFrame(this.loop);const t=Math.min(.05,this.clock.getDelta());this.update(t)}}const Xr=document.getElementById("loading"),Fa=document.getElementById("loading-status"),ir=document.getElementById("loading-bar"),Pl=["TIP: AIM FOR THE HEAD. THEY HATE THAT.","TIP: FRAG GRENADES CLEAR A CROWDED ATRIUM.","TIP: ROOK CAN BE REVIVED WITH E. SO CAN YOU.","TIP: A RUNNING ZOMBIE IS STILL A DEAD ZOMBIE.","TIP: THE FLASHLIGHT DOES NOT ATTRACT THEM. PROBABLY.","TIP: WATCH THE CINEMA DOORS."],Ll=document.getElementById("loading-tip");Ll&&(Ll.textContent=Pl[Math.floor(Math.random()*Pl.length)]);function bi(s,t){ir&&(ir.style.width=`${s}%`),Fa&&t&&(Fa.textContent=t)}const es=s=>new Promise(t=>setTimeout(t,s));async function $0(){try{bi(8,"LINKING SECURITY FEED"),await es(180),bi(24,"LOADING FONTS AND FLOOR PLANS"),await document.fonts.ready.catch(()=>{}),await es(120),bi(46,"SEALING EXTERIOR DOORS"),await new Promise(t=>requestAnimationFrame(()=>requestAnimationFrame(t)));const s=new K0;window.__game=s,bi(78,"CALIBRATING FLASHLIGHT"),await es(240),bi(92,"COUNTING THE HOSTILES"),await es(280),bi(100,"ATRIUM SECURED"),await es(420),Xr?.classList.add("out"),setTimeout(()=>Xr?.classList.add("hidden"),900),window.__ready=!0}catch(s){console.error(s),window.__bootError=String(s&&s.stack||s),Xr&&(Fa.textContent="RENDERER FAILURE",ir.style.width="100%",ir.style.background="#e23b32"),document.getElementById("webgl-error")?.classList.remove("hidden")}}$0();
