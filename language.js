/* OpenCC conversion is local. Original Traditional text is retained exactly. */
(() => {
  const convert = OpenCC.Converter({from:'tw',to:'cn'});
  const texts = new WeakMap(), attributes = new WeakMap();
  const title = document.title;
  let language = 'zh-Hant';
  const requested = new URL(location.href).searchParams.get('lang');
  try { language = requested || localStorage.getItem('yilan-language') || language; } catch {}
  if (!['zh-Hant','zh-Hans'].includes(language)) language='zh-Hant';
  const excluded = node => node.parentElement?.closest('script,style,code,pre,[data-no-convert]');
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if(record.type==='characterData' && !excluded(record.target)) texts.set(record.target,record.target.nodeValue);
      if(record.type==='attributes' && !record.target.closest('[data-no-convert]')) {
        const values=attributes.get(record.target)||{};
        values[record.attributeName]=record.target.getAttribute(record.attributeName);
        attributes.set(record.target,values);
      }
    }
    refresh();
  });
  function observe(){observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['alt','aria-label','title','placeholder']});}
  function format(value){return language==='zh-Hans'?convert(value):value;}
  function refresh(){
    observer.disconnect();
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      if(excluded(node)||!node.nodeValue.trim())continue;
      if(!texts.has(node))texts.set(node,node.nodeValue);
      const output=format(texts.get(node));
      if(node.nodeValue!==output)node.nodeValue=output;
    }
    for(const element of document.body.querySelectorAll('[alt],[aria-label],[title],[placeholder]')){
      if(element.closest('[data-no-convert]'))continue;
      const values=attributes.get(element)||{};
      for(const key of ['alt','aria-label','title','placeholder']){
        if(!element.hasAttribute(key))continue;
        if(!(key in values))values[key]=element.getAttribute(key);
        const output=format(values[key]);
        if(element.getAttribute(key)!==output)element.setAttribute(key,output);
      }
      attributes.set(element,values);
    }
    document.documentElement.lang=language==='zh-Hans'?'zh-Hans-CN':'zh-Hant-TW';
    document.title=format(title);
    document.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===language)));
    observe();
  }
  function set(next){
    language=next;
    try{localStorage.setItem('yilan-language',language);}catch{}
    const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);
    refresh();
  }
  document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>set(button.dataset.language)));
  window.travelLanguage={refresh,format,get current(){return language;}};
  refresh();
})();
