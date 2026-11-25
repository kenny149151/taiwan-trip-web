(() => {
  const repository='https://kenny149151.github.io/taiwan-trip-web/';
  const status=document.querySelector('#share-status');
  document.querySelector('#github-share-url').value=repository;
  document.querySelector('#open-github').href=repository;
  if(location.hostname==='htmlpreview.github.io'){
    const localTarget=link=>{
      try{const raw=link.getAttribute('href')||'';const u=new URL(link.href,location.href);
        if(!u.hash||!(raw.startsWith('#')||u.origin===location.origin))return null;
        return document.getElementById(decodeURIComponent(u.hash.slice(1)));
      }catch{return null;}
    };
    document.querySelectorAll('a[href]').forEach(link=>{const target=localTarget(link);if(target)link.href=repository+'#'+target.id;});
    document.addEventListener('click',event=>{
      const link=event.target.closest('a[href]');if(!link)return;
      const target=localTarget(link);if(!target)return;
      event.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});
      history.replaceState(null,'',repository+'#'+target.id);
    });
  }
  const say=text=>{status.textContent=text;window.travelLanguage?.refresh();};
  document.querySelector('#copy-github').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(repository);say('網站連結已複製，旅伴可直接開啟，無需登入。');}
    catch{const input=document.querySelector('#github-share-url');input.focus();input.select();say('請複製已選取的網站連結。');}
  });
  document.querySelector('#native-share').addEventListener('click',async()=>{
    try{
      if(navigator.share){await navigator.share({title:'慢慢東遊｜山城小吃與花蓮海岸',text:window.travelLanguage?.format('繁體／簡體旅遊App；直接開啟，無需登入。'),url:repository});say('分享已完成。');}
      else document.querySelector('#copy-github').click();
    }catch(error){if(error.name!=='AbortError')say('請使用複製連結或下載QR分享卡。');}
  });
})();
