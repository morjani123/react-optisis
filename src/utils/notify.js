export function playBeep(){ 
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 880
    o.connect(g)
    g.connect(ctx.destination)
    g.gain.value = 0.02
    o.start()
    setTimeout(()=>{ o.stop(); ctx.close() }, 150)
  }catch(e){ console.warn('audio failed', e) }
}

export function toast(msg, opts={type:'info', timeout:2500}){
  const rootId = '__optisis_toast_root'
  let root = document.getElementById(rootId)
  if(!root){
    root = document.createElement('div'); root.id = rootId
    root.style.position = 'fixed'
    root.style.right = '20px'
    root.style.top = '20px'
    root.style.zIndex = 9999
    document.body.appendChild(root)
  }
  const el = document.createElement('div')
  el.style.marginTop = '8px'
  el.style.padding = '10px 14px'
  el.style.borderRadius = '10px'
  el.style.boxShadow = '0 6px 14px rgba(0,0,0,0.08)'
  el.style.background = opts.type === 'success' ? '#e6f5ff' : (opts.type==='error'? '#ffe6e6':'#fff')
  el.style.color = '#0369a1'
  el.textContent = msg
  root.appendChild(el)
  playBeep()
  setTimeout(()=>{ el.style.opacity = '0'; setTimeout(()=>el.remove(),300) }, opts.timeout)
}