import React from 'react'
import { UNITS, tr } from '../lib/i18n.js'

export default function UnitChips({ lang='en' }) {
  return (
    <div style={{margin:'8px 0'}}>
      <div className="hint">{tr(lang,'chipsTitle')}</div>
      <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
        {UNITS.map(u=>(
          <button key={u} className="pill"
            draggable onDragStart={e=>e.dataTransfer.setData('text/unit', u)}>
            {u}
          </button>
        ))}
      </div>
    </div>
  )
}
