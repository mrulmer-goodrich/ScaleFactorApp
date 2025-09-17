import React, { useRef, useState } from 'react'

export default function Ruler({ unit='cm', pxPerUnit=50 }) {
  const [pts, setPts] = useState([])
  const ref = useRef(null)

  const addPt = (e)=>{
    const r = ref.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    setPts(p => p.length>=2 ? [{x,y}] : [...p,{x,y}])
  }

  let distPx = 0
  if (pts.length===2){
    const dx = pts[1].x-pts[0].x
    const dy = pts[1].y-pts[0].y
    distPx = Math.sqrt(dx*dx+dy*dy)
  }
  const distUnits = pxPerUnit ? distPx/pxPerUnit : 0

  return (
    <div className="card">
      <h2>On-Screen Ruler</h2>
      <p className="hint">Click two points to measure.</p>
      <div ref={ref} onPointerDown={addPt}
        style={{border:'1px dashed var(--axis)', borderRadius:10, height:160, position:'relative'}}>
        {pts.map((p,i)=><div key={i} style={{position:'absolute', left:p.x-5, top:p.y-5, width:10, height:10, background:'var(--accent)'}}/>)}
        {pts.length===2 && (
          <svg width="100%" height="100%" style={{position:'absolute', left:0, top:0}}>
            <line x1={pts[0].x} y1={pts[0].y} x2={pts[1].x} y2={pts[1].y} stroke="var(--warn)" strokeWidth="3"/>
          </svg>
        )}
      </div>
      <div className="legend" style={{marginTop:8}}>
        <span className="pill">≈ {distPx.toFixed(1)} px</span>
        <span className="pill">≈ {distUnits.toFixed(3)} {unit}</span>
      </div>
    </div>
  )
}
