(() => {
  const repository='https://kenny149151.github.io/taiwan-trip-web/';
  const status=document.querySelector('#share-status');
  const say=text=>{status.textContent=text;window.travelLanguage?.refresh();};
  document.querySelector('#copy-github').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(repository);say('網站連結已複製，旅伴可直接開啟，無需登入。');}
    catch{const input=document.querySelector('#github-share-url');input.focus();input.select();say('請複製已選取的網站連結。');}
  });
  document.querySelector('#native-share').addEventListener('click',async()=>{
    try{
      if(navigator.share){await navigator.share({title:'慢慢宜蘭｜台北與宜蘭自駕手帖',text:window.travelLanguage?.format('繁體／簡體旅遊App；直接開啟，無需登入。'),url:repository});say('分享已完成。');}
      else document.querySelector('#copy-github').click();
    }catch(error){if(error.name!=='AbortError')say('請使用複製連結或下載QR分享卡。');}
  });
})();
