import React from 'react'
import { tr } from '../lib/i18n.js'

export default function HTable({ lang='en', state, setState, onCompute, buzz, setBuzz, onAxisSwap }) {
  const { unitSmall, unitLarge, scaleSmall, scaleLarge, givenLabel, givenValue, unknownLabel, unknownValue } = state
  const handle = (key) => (e) => setState(s => ({ ...s, [key]: e.target.value }))

  const buzzNow = () => { setBuzz(true); setTimeout(() => setBuzz(false), 300) }

  const dropTo = (field) => (e) => {
    e.preventDefault()
    const u = e.dataTransfer.getData('text/unit')
    if (!u) return
    if (field === 'unitSmall' && u === unitLarge) return buzzNow()
    if (field === 'unitLarge' && u === unitSmall) return buzzNow()
    setState(s => ({ ...s, [field]: u }))
  }

  return (
    <div className={buzz ? 'shake' : ''}>
      <div className="row">
        <div onDragOver={(e)=>e.preventDefault()} onDrop={dropTo('unitSmall')}>
          <label>{tr(lang,'hPickSmall')}</label>
          <input value={unitSmall} onChange={handle('unitSmall')} placeholder="cm / in / px / ft / m"/>
        </div>
        <div onDragOver={(e)=>e.preventDefault()} onDrop={dropTo('unitLarge')}>
          <label>{tr(lang,'hPickLarge')}</label>
          <input value={unitLarge} onChange={handle('unitLarge')} placeholder="cm / in / px / ft / m"/>
        </div>
      </div>

      <button className="btn warn" onClick={onAxisSwap}>{tr(lang,'axisSwap')}</button>

      <div className="row">
        <div>
          <label>{tr(lang,'hScaleLarge',{L: unitLarge||'—', S: unitSmall||'—'})}</label>
          <input type="number" step="any" value={scaleLarge||''} onChange={handle('scaleLarge')}/>
        </div>
        <div>
          <label>{tr(lang,'hScaleSmall',{L: unitLarge||'—', S: unitSmall||'—'})}</label>
          <input type="number" step="any" value={scaleSmall||''} onChange={handle('scaleSmall')}/>
        </div>
      </div>

      <div className="row">
        <div>
          <label>{tr(lang,'hGiven')}</label>
          <input value={givenLabel} onChange={handle('givenLabel')} placeholder={tr(lang,'hLabelEx')}/>
          <input type="number" step="any" value={givenValue||''} onChange={handle('givenValue')}/>
        </div>
        <div>
          <label>{tr(lang,'hUnknown')}</label>
          <input value={unknownLabel} onChange={handle('unknownLabel')} placeholder={tr(lang,'hLabelEx')}/>
          <input disabled value={unknownValue||''}/>
        </div>
      </div>

      <button className="btn" onClick={()=>{
        let k = null
        if (scaleLarge) k = parseFloat(scaleLarge)
        else if (scaleSmall) {
          const v = parseFloat(scaleSmall)
          if (v) k = 1/v
        }
        if (!k || !givenValue) return buzzNow()
        const y = k * parseFloat(givenValue)
        setState(s => ({ ...s, unknownValue: +y.toFixed(4) }))
        onCompute?.(k, parseFloat(givenValue), y)
      }}>{tr(lang,'compute')}</button>

      <button className="btn alt" onClick={()=>setState({
        unitSmall:'',unitLarge:'',scaleSmall:'',scaleLarge:'',
        givenLabel:'',givenValue:'',unknownLabel:'',unknownValue:''
      })}>{tr(lang,'reset')}</button>
    </div>
  )
}
