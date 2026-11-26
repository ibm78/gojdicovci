'use strict';
// Also invoked by player-i18n.js for existing player pages.
(() => {
  if (window.__gojdicovciFresh || window.__gojdicovciRefreshing || location.protocol==='file:') return;
  window.__gojdicovciRefreshing=true;
  const token=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
  const freshUrl=(value,base=location.href)=>{
    const url=new URL(value,base);
    url.searchParams.set('_fresh',token);
    return url.href;
  };
  const read=async url=>{
    const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(20000)});
    if (!response.ok) throw Error('HTTP '+response.status);
    return response.text();
  };
  async function refresh() {
    try {
      const html=await read(freshUrl(location.href));
      const parsed=new DOMParser().parseFromString(html,'text/html');
      const base=new URL(parsed.querySelector('base[href]')?.getAttribute('href') || location.href,location.href).href;
      for (const link of parsed.querySelectorAll('link[rel="stylesheet"][href]')) {
        const url=new URL(link.getAttribute('href'),base);
        if (!url.pathname.includes('/web-common-assets/')) continue;
        let css=await read(freshUrl(url));
        // Resolve font URLs against the stylesheet, not against the HTML.
        css=css.replace(/url\(\s*(["']?)([^)'"\s]+)\1\s*\)/g,(match,quote,value)=>
          /^(data:|blob:|#)/i.test(value) ? match : 'url('+JSON.stringify(freshUrl(value,url))+')');
        const style=parsed.createElement('style');
        style.dataset.source=url.href;
        style.textContent=css;
        link.replaceWith(style);
      }
      for (const script of parsed.querySelectorAll('script[src]')) {
        const url=new URL(script.getAttribute('src'),base);
        if (url.pathname.includes('/web-common-assets/')) script.src=freshUrl(url);
      }
      window.__gojdicovciFresh=true;
      delete window.GojdicovciI18n;
      document.open();
      document.write('<!doctype html>\n'+parsed.documentElement.outerHTML);
      document.close();
    } catch (error) {
      window.__gojdicovciRefreshing=false;
      console.error('Gojdičovci: obnovenie súborov zlyhalo.',error);
      const status=document.getElementById('error');
      if (status) {status.hidden=false;status.textContent='Aktuálny obsah sa nepodarilo načítať. Skontrolujte internet a obnovte stránku.';}
    }
  }
  // Let the first document finish initialization before replacing it.
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',refresh,{once:true});
  else setTimeout(refresh,0);
})();
