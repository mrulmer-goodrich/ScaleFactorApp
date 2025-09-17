import React, { useEffect, useRef, useState } from 'react'

export default function Graph({ lang='en', k, x, setX, unitSmall='cm', unitLarge='m', imageSrc }) {
  const [w, setW] = useState(800)
  const [h, setH] = useState(560)
  const svgRef = useRef(null)

  useEffect(()=>{
    const onResize = ()=>{
      const bb = svgRef.current?.parentElement?.getBoundingClientRect()
      if (bb) { setW(Math.max(560, bb.width-4)); setH(Math.max(440, bb.height-4)) }
    }
    onResize()
    window.addEventListener('resize', onResize)
    return ()=>window.removeEventListener('resize', onResize)
  }, [])

  // keyboard: arrows adjust x
  useEffect(()=>{
    const onKey = (e)=>{
      const step = e.shiftKey ? 1 : 0.1
      if (['ArrowLeft','ArrowRight'].includes(e.key)) {
        e.preventDefault()
        setX(prev=>{
          let nx = prev + (e.key==='ArrowRight' ? step : -step)
          nx = Math.max(0, Math.min(10, Math.round(nx*100)/100))
          return nx
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return ()=>window.removeEventListener('keydown', onKey)
  }, [setX])

  const maxX = 10
  const maxY = Math.max(10, Math.ceil((k||1)*maxX))
  const pad = 48
  const xToPx = val=> pad + (val/maxX)*(w-pad*2)
  const yToPx = val=> h - pad - (val/maxY)*(h-pad*2)
  const pxToX = px=> ((px-pad)/(w-pad*2))*maxX

  const handleDrag = (evt)=>{
    const rect = svgRef.current.getBoundingClientRect()
    const px = evt.clientX - rect.left
    let nx = Math.min(maxX, Math.max(0, pxToX(px)))
    nx = Math.round(nx*100)/100
    setX(nx)
  }

  const y = (k||0)*x
  const scale = 20
  const imgW = Math.max(10, x*scale)
  const imgH = Math.max(10, (k||0.5)*x*scale)

  return (
    <div className="axis-wrap card" style={{height:'100%'}}>
      <div className="legend" style={{marginBottom:8}}>
        <span className="pill">y = kx</span>
        <span className="pill">k = {k ? k.toFixed(3) : '—'} ({unitLarge}/{unitSmall})</span>
        <span className="pill">({x.toFixed(2)}, {y.toFixed(2)})</span>
      </div>

      <svg ref={svgRef} width="100%" height="100%"
        viewBox={`0 0 ${w} ${h}`} style={{touchAction:'none'}}
        onPointerDown={handleDrag} onPointerMove={e=>{ if(e.buttons===1) handleDrag(e) }}>
        <rect x="0" y="0" width={w} height={h} fill="transparent"/>
        <line x1={pad} y1={yToPx(0)} x2={w-pad} y2={yToPx(0)} stroke="var(--axis)" strokeWidth="2"/>
        <line x1={xToPx(0)} y1={pad} x2={xToPx(0)} y2={h-pad} stroke="var(--axis)" strokeWidth="2"/>

        <line x1={xToPx(0)} y1={yToPx(0)} x2={xToPx(maxX)} y2={yToPx((k||0)*maxX)} stroke="var(--accent)" strokeWidth="3"/>
        <circle cx={xToPx(x)} cy={yToPx(y)} r="7" fill="var(--ok)" stroke="#065f46" strokeWidth="2"/>
      </svg>

      <div className="card" style={{marginTop:12}}>
        <h2>Image Panel</h2>
        <p className="hint">Image width ≈ x ({unitSmall}); height ≈ y ({unitLarge}).</p>
        <div style={{display:'grid', placeItems:'center', minHeight:220}}>
          {imageSrc ? (
            <img src={imageSrc} alt="scaled" style={{width: imgW, height: imgH, objectFit:'cover'}}/>
          ) : (
            <div style={{width: imgW, height: imgH, background:'#60a5fa55', border:'2px solid var(--axis)'}}/>
          )}
        </div>
      </div>
    </div>
  )
}
