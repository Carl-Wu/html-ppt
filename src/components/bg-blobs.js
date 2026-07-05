/* ===================================================================
   bg-blobs — 全局三层模糊渐变光斑背景层
   挂在 body 下（脱离 swiper-wrapper 的 transform 影响），
   由页面 activate/deactivate 控制显隐。
   颜色：蓝 #004af0 / 青 #00d4aa / 薰衣草 #8b7cf0
   blur(80px) + opacity:.55，各自不同速度缓慢漂移缩放
   =================================================================== */

let el = null;

function ensure(){
  if(el) return el;
  el = document.createElement('div');
  el.className = 'bg-blobs-global';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<div class="bg-blob b1"></div>' +
    '<div class="bg-blob b2"></div>' +
    '<div class="bg-blob b3"></div>';
  if(!document.getElementById('bgBlobsStyle')){
    const s = document.createElement('style');
    s.id = 'bgBlobsStyle';
    s.textContent = `
    .bg-blobs-global{position:fixed;inset:0;overflow:hidden;z-index:0;pointer-events:none;display:none}
    .bg-blob{position:absolute;border-radius:50%;filter:blur(80px);opacity:.55;will-change:transform}
    .bg-blob.b1{width:44vw;height:44vw;left:-8vw;top:-8vh;background:radial-gradient(circle,#004af0 0%,transparent 70%);animation:blobFloat1 18s ease-in-out infinite}
    .bg-blob.b2{width:38vw;height:38vw;right:-6vw;top:12vh;background:radial-gradient(circle,#00d4aa 0%,transparent 70%);animation:blobFloat2 22s ease-in-out infinite}
    .bg-blob.b3{width:48vw;height:48vw;left:28vw;bottom:-14vh;background:radial-gradient(circle,#8b7cf0 0%,transparent 70%);animation:blobFloat3 26s ease-in-out infinite}
    @keyframes blobFloat1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(8vw,6vh) scale(1.15)}66%{transform:translate(-4vw,10vh) scale(.9)}}
    @keyframes blobFloat2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-10vw,8vh) scale(1.1)}66%{transform:translate(6vw,-6vh) scale(1.2)}}
    @keyframes blobFloat3{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(6vw,-8vh) scale(1.1)}66%{transform:translate(-8vw,4vh) scale(.95)}}`;
    document.head.appendChild(s);
  }
  document.body.appendChild(el);
  return el;
}

export function showBlobs(){
  ensure().style.display = 'block';
}
export function hideBlobs(){
  if(el) el.style.display = 'none';
}
