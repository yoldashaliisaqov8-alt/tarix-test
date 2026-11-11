(function(){
var KEY="isk_gm_v1";
var LEVELS=[{n:"Yangi",e:"🌱",min:0},{n:"Bilimdon",e:"📘",min:300},{n:"Ekspert",e:"🎓",min:1000},{n:"Ustoz",e:"👑",min:3000}];
var BADGES=[
{id:"first",e:"🎯",n:"Birinchi test",d:"Birinchi testni oxirigacha yeching"},
{id:"q100",e:"💯",n:"Birinchi 100 savol",d:"Jami 100 ta savolga javob bering"},
{id:"q500",e:"📚",n:"500 savol",d:"Jami 500 ta savolga javob bering"},
{id:"att90",e:"🏆",n:"Attestatsiya 90%+",d:"Attestatsiya variantida 90% va undan yuqori natija"},
{id:"s3",e:"🔥",n:"3 kunlik seriya",d:"3 kun ketma-ket test yeching"},
{id:"s7",e:"⚡",n:"7 kunlik seriya",d:"7 kun ketma-ket test yeching"},
{id:"daily",e:"✅",n:"Kunlik topshiriq",d:"Kunlik topshiriqni birinchi marta bajaring"},
{id:"perfect",e:"🌟",n:"Mukammal natija",d:"Testni 100% natija bilan tugating"}
];
var DAILY_GOAL=20,DAILY_BONUS=20,FINISH_BONUS=10;
var mem=null;
function today(){var d=new Date();return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
function yest(){var d=new Date();d.setDate(d.getDate()-1);return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
function fresh(){return{xp:0,streak:0,best:0,last:"",answered:0,correct:0,finished:0,badges:{},dayKey:"",dayAns:0,dayDone:false}}
function load(){var s=null;try{s=JSON.parse(localStorage.getItem(KEY))}catch(e){}if(!s&&mem)s=mem;if(!s||typeof s!=="object")s=fresh();var f=fresh();for(var k in f)if(!(k in s))s[k]=f[k];return s}
function save(s){mem=s;try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
var S=load();
function rollDay(){var t=today();if(S.dayKey!==t){S.dayKey=t;S.dayAns=0;S.dayDone=false}}
function levelOf(xp){var i=0;for(var k=0;k<LEVELS.length;k++)if(xp>=LEVELS[k].min)i=k;return i}
var tq=[],tt=null;
function toast(msg,big){tq.push({m:msg,b:big});if(!tt)nextToast()}
function nextToast(){var x=tq.shift();if(!x){tt=null;return}
 var el=document.getElementById("gmToast");if(!el){el=document.createElement("div");el.id="gmToast";document.body.appendChild(el)}
 el.className=x.b?"big":"";el.textContent=x.m;el.style.opacity="1";el.style.transform="translate(-50%,0)";
 tt=setTimeout(function(){el.style.opacity="0";el.style.transform="translate(-50%,-10px)";setTimeout(nextToast,220)},x.b?2600:1000)}
var small=0,smallT=null;
function smallXp(n){small+=n;clearTimeout(smallT);smallT=setTimeout(function(){if(small>0)toast("+"+small+" XP ⭐");small=0},900)}
function award(id){if(S.badges[id])return;S.badges[id]=today();var b=BADGES.filter(function(x){return x.id===id})[0];toast("🏅 Yangi nishon: "+b.n,true)}
function addXp(n,quiet){var before=levelOf(S.xp);S.xp+=n;var after=levelOf(S.xp);if(!quiet&&n>=5)toast("+"+n+" XP ⭐",true);if(after>before)toast(LEVELS[after].e+" Yangi daraja: "+LEVELS[after].n+"!",true)}
function touchDay(){rollDay();var t=today();if(S.last!==t){var first=true;if(S.last===yest())S.streak++;else S.streak=1;S.last=t;if(S.streak>S.best)S.best=S.streak;if(S.streak>=2)toast(S.streak+" kun ketma-ket test yechdingiz 🔥",true);if(S.streak>=3)award("s3");if(S.streak>=7)award("s7")}}
function countAns(n,c){S.answered+=n;S.correct+=c;S.dayAns+=n;if(S.answered>=100)award("q100");if(S.answered>=500)award("q500");
 if(!S.dayDone&&S.dayAns>=DAILY_GOAL){S.dayDone=true;addXp(DAILY_BONUS,true);toast("🎁 Kunlik topshiriq bajarildi! +"+DAILY_BONUS+" XP",true);award("daily")}}
var GM={
 answer:function(ok){try{touchDay();countAns(1,ok?1:0);if(ok){addXp(1,true);smallXp(1)}save(S);render()}catch(e){}},
 finish:function(pct,total){try{touchDay();S.finished++;addXp(FINISH_BONUS);award("first");if(pct>=100)award("perfect");save(S);render()}catch(e){}},
 attDone:function(correct,answered,pct){var gain=0;try{touchDay();var b=S.xp;countAns(answered,correct);S.finished++;addXp(correct+FINISH_BONUS);award("first");if(pct>=90)award("att90");if(pct>=100)award("perfect");gain=S.xp-b;save(S);render()}catch(e){}return gain},
 state:function(){return S},
 show:function(){openBadges()},
 render:render
};
window.GM=GM;
var css="#gmCard{margin:4px 8px 12px;padding:14px 16px;border-radius:18px;background:rgba(255,255,255,.14);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.22);color:#fff;font-family:inherit}\n#gmCard .gm-r{display:flex;align-items:center;gap:10px}\n#gmCard .gm-lv{font-weight:800;font-size:17px;flex:1}\n#gmCard .gm-xp{font-weight:700;font-size:14px;opacity:.95}\n#gmCard .gm-bar{height:8px;border-radius:6px;background:rgba(255,255,255,.22);overflow:hidden;margin:9px 0}\n#gmCard .gm-bar i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#ffd54a,#ff9f1c);transition:width .4s}\n#gmCard .gm-s{font-size:12.5px;opacity:.92}\n#gmCard .gm-chip{background:rgba(255,255,255,.18);border-radius:12px;padding:6px 10px;font-weight:700;font-size:13px;white-space:nowrap}\n#gmCard .gm-q{margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.2)}\n#gmCard .gm-btn{margin-top:10px;width:100%;border:0;border-radius:12px;padding:9px;font-weight:700;font-size:14px;background:rgba(255,255,255,.2);color:#fff;cursor:pointer}\n#gmToast{position:fixed;top:14px;left:50%;transform:translate(-50%,-10px);opacity:0;transition:.22s;z-index:99999;background:#14233f;color:#fff;padding:9px 16px;border-radius:14px;font-weight:700;font-size:14px;box-shadow:0 6px 20px rgba(0,0,0,.3);max-width:90vw;text-align:center;pointer-events:none}\n#gmToast.big{background:linear-gradient(90deg,#ff9f1c,#ff6b35);font-size:15px}\n#gmOv{position:fixed;inset:0;background:rgba(10,20,40,.7);z-index:99998;display:flex;align-items:center;justify-content:center;padding:16px}\n#gmOv .gm-md{background:#fff;color:#14233f;border-radius:20px;max-width:420px;width:100%;max-height:85vh;overflow:auto;padding:18px}\n#gmOv h3{margin:0 0 12px;font-size:18px}\n#gmOv .gm-b{display:flex;gap:12px;align-items:center;padding:10px 0;border-top:1px solid #e6ebf5}\n#gmOv .gm-b .e{font-size:28px;width:40px;text-align:center}\n#gmOv .gm-b.lock{opacity:.4;filter:grayscale(1)}\n#gmOv .gm-b b{display:block;font-size:15px}#gmOv .gm-b small{color:#5a6a88;font-size:12.5px}\n#gmOv button{margin-top:12px;width:100%;border:0;border-radius:12px;padding:11px;font-weight:700;background:#14233f;color:#fff;font-size:15px;cursor:pointer}";
function ensureStyle(){if(document.getElementById("gmCss"))return;var st=document.createElement("style");st.id="gmCss";st.textContent=css;document.head.appendChild(st)}
function openBadges(){ensureStyle();var o=document.createElement("div");o.id="gmOv";var h='<div class="gm-md"><h3>🏅 Nishonlar ('+Object.keys(S.badges).length+'/'+BADGES.length+')</h3>';
 BADGES.forEach(function(b){var has=!!S.badges[b.id];h+='<div class="gm-b'+(has?'':' lock')+'"><div class="e">'+b.e+'</div><div><b>'+b.n+'</b><small>'+b.d+(has?" · ✔ "+S.badges[b.id]:"")+'</small></div></div>'});
 h+='<h3 style="margin-top:16px">📊 Statistika</h3><div class="gm-b"><div><small>Jami javob: <b style="display:inline">'+S.answered+'</b> · To\'g\'ri: <b style="display:inline">'+S.correct+'</b> · Tugatilgan testlar: <b style="display:inline">'+S.finished+'</b> · Eng uzoq seriya: <b style="display:inline">'+S.best+'</b> kun</small></div></div><button>Yopish</button></div>';
 o.innerHTML=h;document.body.appendChild(o);o.onclick=function(e){if(e.target===o||e.target.tagName==="BUTTON")o.remove()}}
function render(){ensureStyle();var mp=document.querySelector("#homeScreen .menu-panel");if(!mp)return;rollDay();
 var card=document.getElementById("gmCard");if(!card){card=document.createElement("div");card.id="gmCard";mp.insertBefore(card,mp.firstChild)}
 var li=levelOf(S.xp),L=LEVELS[li],N=LEVELS[li+1],pct=N?Math.round((S.xp-L.min)/(N.min-L.min)*100):100;
 var active=S.last===today()||S.last===yest();var sk=active?S.streak:0;
 var dq=Math.min(S.dayAns,DAILY_GOAL),dp=Math.round(dq/DAILY_GOAL*100);
 card.innerHTML='<div class="gm-r"><div class="gm-lv">'+L.e+' '+L.n+'</div><div class="gm-chip">🔥 '+sk+' kun</div><div class="gm-chip">⭐ '+S.xp+'</div></div><div class="gm-bar"><i style="width:'+pct+'%"></i></div><div class="gm-s">'+(N?'Keyingi daraja «'+N.n+'»: yana '+(N.min-S.xp)+' XP':'Eng yuqori darajadasiz 👑')+'</div>'
 +'<div class="gm-q"><div class="gm-r"><div class="gm-s" style="flex:1"><b>🎯 Kunlik topshiriq:</b> bugun '+DAILY_GOAL+' ta savol yeching (+'+DAILY_BONUS+' XP)</div><div class="gm-s"><b>'+(S.dayDone?'✅':dq+'/'+DAILY_GOAL)+'</b></div></div><div class="gm-bar"><i style="width:'+dp+'%"></i></div></div>'
 +'<button class="gm-btn" id="gmBadgeBtn">🏅 Nishonlar ('+Object.keys(S.badges).length+'/'+BADGES.length+')</button>';
 document.getElementById("gmBadgeBtn").onclick=openBadges}
function boot(){render();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
window.addEventListener("pageshow",render);
})();
