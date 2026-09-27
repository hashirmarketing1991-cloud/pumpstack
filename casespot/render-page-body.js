const {Liquid}=require('liquidjs');const fs=require('fs');
const T='/home/user/pumpstack/casespot/theme/';
const CDN='https://cdn.shopify.com/s/files/1/0681/6517/3554/files/';
const V={'543d6010-e53f-4bcb-917d-3bed31e24b87.png':'1790177703','304342cc-570a-4aae-96e4-97e4219b7a3c.png':'1790175831','download.jpg':'1790332381','download_1.jpg':'1790332908','download_2.jpg':'1790333474','b6b8de19-9782-4b22-996d-d96234a27b6a.png':'1790261971','4f7dced5-0971-4aba-87c4-6a827fee6961.png':'1790418490','54471468-a3bc-4941-ad4d-fc3a8ede3d8f.png':'1790418356','a853150c-5a3f-4ac6-ab95-c8bffb3c6690.png':'1790418128','ade7763c-b014-4878-afc2-5544fcdb7808.png':'1790417931','c03eec14-6863-430b-b2c0-558756b4ab33.png':'1790417426','71LuQndsOuL._AC_SL1500.jpg':'1772085517'};
const img=n=>({url:CDN+n+'?v='+V[n]});
const engine=new Liquid();
engine.registerTag('schema',{parse(tk,remain){const s=this.liquid.parser.parseStream(remain);s.on('tag:endschema',()=>s.stop()).start();},render(){return ''}});
engine.registerFilter('asset_url',v=>v);engine.registerFilter('stylesheet_tag',()=>'');
engine.registerFilter('image_url',(v,...a)=>{let w=1000;for(const x of a)if(Array.isArray(x)&&x[0]==='width')w=x[1];return {url:v.url,w,toString(){return v.url+'&width='+w}}});
engine.registerFilter('image_tag',(v,...a)=>{if(typeof v==='string')return v;let o={};for(const x of a)if(Array.isArray(x))o[x[0]]=x[1];
 const ws=(o.widths||String(v.w)).split(',').map(s=>s.trim());const srcset=ws.length>1?ws.map(w=>`${v.url}&width=${w} ${w}w`).join(', '):'';
 const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
 return `<img src="${v.url}&width=${v.w}"${srcset?` srcset="${srcset}"`:``}${o.sizes?` sizes="${o.sizes}"`:''} loading="${o.loading||'lazy'}"${o.fetchpriority?` fetchpriority="${o.fetchpriority}"`:''}${o.class?` class="${o.class}"`:''} alt="${esc(o.alt)}">`});
engine.registerFilter('placeholder_svg_tag',()=>'');
const fmt=v=>'Rs.'+Math.round(v/100).toLocaleString('en-US');
engine.registerFilter('money_without_trailing_zeros',fmt);engine.registerFilter('money',fmt);
const raw=[["50942574264626","iPhone 17 Pro Max / with Camera Protector",2799,null],["50942574297394","iPhone 17 Pro",2799,null],["50942574330162","iPhone 17 Air",2799,null],["50942574362930","iPhone 17",2799,null],["49488018833714","iPhone 16 Pro Max",2199,3000],["49488019685682","iPhone 16 Pro",2199,3000],["51502849360178","iPhone 16",2799,null],["49018087506226","iPhone 15 Pro Max",1799,null],["49018087538994","iPhone 15 Pro",1799,null],["49018087571762","iPhone 15",1799,null],["49018087604530","iPhone 14 Pro Max",1699,null],["49018087637298","iPhone 14 Pro",1699,null],["49018087670066","iPhone 14",1699,null],["49018087702834","iPhone 13 Pro Max",1699,null],["49018087735602","iPhone 13 Pro",1699,null],["49018087768370","iPhone 13",1699,null],["49018087801138","iPhone 12 Pro Max",1699,null],["49018087833906","iPhone 12 Pro",1699,null],["49018087866674","iPhone 12",1699,null],["49018087899442","iPhone 11 Pro Max",1699,null],["49018087932210","iPhone 11 Pro",1699,null],["49018087964978","iPhone 11",1699,null],["49018087997746","iPhone Xsmax",1699,null],["49018088030514","iPhone X",1699,null]];
const vars=raw.map(r=>({id:r[0],title:r[1],price:r[2]*100,compare_at_price:r[3]?r[3]*100:null,available:true}));
const media=['H9a04d93794ee42db830e7fe78a650e45V.jpg','H432085ad286f4d83b5fc8b1047881d98E.jpg','H529886cedefe477ead5030b534adeb30L.jpg','H208e5ed109684344afd058e5cfb90416V.jpg','H2d970eabcf6a4b26b20d101e9eb8f99au.jpg','Anti-scratch_Anti-Fingerprint_anti-explosion_HighTransparent_Antishock_FULLGLUE_Dirt-resistant_FULLCOVERAGE_Anti-Oil_Anti-Glare_Waterproof_ULTRA-THIN_BubbleFree_HDCLEAR_Foldable_z.jpg','71LuQndsOuL._AC_SL1500.jpg','H94e7e0fed4b84e4db92b1e4db2a16cd4H.jpg'].map(n=>({media_type:'image',url:CDN+n+'?v=1772085517',alt:''}));
const product={title:'iPhone Privacy Anti-Spy Glass Screen Protector with applying kit',price:169900,price_min:169900,featured_image:media[0],featured_media:media[0],media,variants:vars,selected_or_first_available_variant:vars[0],has_only_default_variant:false};
(async()=>{let out='';const tpl=JSON.parse(fs.readFileSync(T+'templates/page.privacy-anti-spy.json'));
for(const k of tpl.order){const s=tpl.sections[k];if(s.disabled)continue;
 const conv=o=>{const r={...o};for(const [a,b] of Object.entries(r)){if(typeof b==='string'&&b.startsWith('shopify://shop_images/'))r[a]=img(b.split('/').pop());if(a==='product')r[a]=product;}return r};
 const blocks=(s.block_order||[]).map(id=>({type:s.blocks[id].type,settings:conv(s.blocks[id].settings),shopify_attributes:''}));
 const src=fs.readFileSync(T+'sections/'+s.type+'.liquid','utf8').replace(/\{% schema %\}[\s\S]*?\{% endschema %\}/,'');
 out+=await engine.parseAndRender(src,{section:{id:k,settings:conv(s.settings),blocks},routes:{cart_add_url:'/cart/add',cart_url:'/cart'}});}
let css=fs.readFileSync(T+'assets/cs-privacy.css','utf8');
// collect all <style> blocks to the top, bump specificity above Dawn .rte rules
let styles=[css];out=out.replace(/<style>([\s\S]*?)<\/style>/g,(m,c)=>{styles.push(c);return ''});
let allcss=styles.join('\n').replace(/\/\*[\s\S]*?\*\//g,'');
allcss=allcss.replace(/([^{}]+)\{/g,(m,sel)=>{const t=sel.trim();if(t.startsWith('@')||t==='')return m;return sel.replace(t,t.split(',').map(p=>{p=p.trim();return p.startsWith('html ')?'html body '+p.slice(5):'html body '+p}).join(', '))+'{'});
const wrapCss=`
html body .main-page-title{display:none}
html body .page-width:has(.cs-lp){max-width:none!important;padding:0!important}
html body .section:has(#ContactForm){display:none!important}
html body .rte:has(.cs-lp){margin:0}
html body .cs-lp{display:block;width:100%}
html body .cs-lp ul, html body .cs-lp ol{list-style:none;padding-left:0}
html body .cs-lp img{border:0;box-shadow:none;margin:0;border-radius:0;height:100%}
html body .cs-lp .cs-media img{border-radius:0}
html body .cs-lp h1, html body .cs-lp h2, html body .cs-lp h3{margin-top:0}
html body .cs-lp a{text-decoration:none}
`;
const live=`<script>(function(){fetch('/products/iphone-privacy-anti-spy-glass-screen-protector-with-applying-kit.js').then(function(r){return r.json()}).then(function(p){var f=function(c){return 'Rs.'+Math.round(c/100).toLocaleString('en-US')};var sel=document.querySelector('[data-cs-variant]');if(!sel)return;p.variants.forEach(function(v){var o=sel.querySelector('option[value="'+v.id+'"]');if(!o)return;o.dataset.price=f(v.price);o.dataset.compare=v.compare_at_price>v.price?f(v.compare_at_price):'';o.dataset.save=v.compare_at_price>v.price?f(v.compare_at_price-v.price):'';o.dataset.available=String(v.available);o.disabled=!v.available;});sel.dispatchEvent(new Event('change'));document.querySelectorAll('.cs-hero__price strong,.cs-cta__price strong').forEach(function(e){e.textContent=f(p.price_min)});}).catch(function(){})})();</script>`;
const html=`<style>${allcss}${wrapCss}</style><div class="cs-lp">${out}</div>${live}`.replace(/\n\s*\n/g,'\n');
fs.writeFileSync('page-body.html',html);console.log('bytes',html.length);
fs.writeFileSync('page-live-test.html',`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html{font-size:62.5%}body{margin:0;font-size:1.5rem;letter-spacing:.06rem;font-family:Assistant,sans-serif}.rte ul,.rte ol{list-style-position:inside;padding-left:2rem}.rte img{height:auto;max-width:100%;border:1px solid red;border-radius:8px}.rte a{color:blue;text-decoration:underline}</style></head><body><div class="page-width page-width--narrow section" style="max-width:72.6rem;margin:0 auto;padding:0 5rem"><h1 class="main-page-title">Title</h1><div class="rte">${html}</div></div><section class="section"><div class="contact"><form id="ContactForm">FORM</form></div></section></body></html>`);
})().catch(e=>{console.error(e);process.exit(1)});
