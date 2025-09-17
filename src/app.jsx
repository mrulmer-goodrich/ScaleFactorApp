import React, { useEffect, useMemo, useState } from 'react'
import HTable from './components/HTable.jsx'
import Graph from './components/Graph.jsx'
import Ruler from './components/Ruler.jsx'
import UnitChips from './components/UnitChips.jsx'
import TaskBank from './components/TaskBank.jsx'
import { saveState, loadState, clearState } from './lib/store.js'
import { tr } from './lib/i18n.js'

export default function App(){
  const [lang, setLang] = useState('en')
  const [contrast, setContrast] = useState('normal')

  const [buzz, setBuzz] = useState(false)
  const [state, setState] = useState({
    unitSmall:'cm', unitLarge:'m',
    scaleSmall:'', scaleLarge:'100',
    givenLabel:'width', givenValue:'2',
    unknownLabel:'width', unknownValue:''
  })
  const [x, setX] = useState(2)
  const [imageSrc, setImageSrc] = useState('')

  const k = useMemo(()=>{
    const g = parseFloat(state.scaleLarge)
    if (!isNaN(g) && g>0) return g
    const r = parseFloat(state.scaleSmall)
    if (!isNaN(r) && r>0) return 1/r
    return null
  }, [state.scaleLarge, state.scaleSmall])

  useEffect(()=>{
    const loaded = loadState()
    if (loaded) {
      if (loaded.state) setState(s => ({ ...s, ...loaded.state }))
      if (typeof loaded.x === 'number') setX(loaded.x)
      if (loaded.lang) setLang(loaded.lang)
      if (loaded.imageSrc) setImageSrc(loaded.imageSrc)
      if (loaded.contrast) setContrast(loaded.contrast)
    }
  }, [])

  useEffect(()=>{
    saveState({ state, x, lang, imageSrc, contrast })
  }, [state, x, lang, imageSrc, contrast])

  useEffect(()=>{
    document.documentElement.setAttribute('data-contrast', contrast === 'high' ? 'high' : 'normal')
  }, [contrast])

  const applyUrl = ()=>{
    const el = document.getElementById('img-url-input')
    const url = (el?.value || '').trim()
    if (url) setImageSrc(url)
  }
  const onUpload = (file)=>{
    const reader = new FileReader()
    reader.onload = ()=> setImageSrc(String(reader.result))
    reader.readAsDataURL(file)
  }

  const onAxisSwap = ()=>{
    setState(s=>{
      const newSmall = s.unitLarge
      const newLarge = s.unitSmall
      let newScaleLarge = ''
      let newScaleSmall = ''
      if (s.scaleLarge) newScaleSmall = s.scaleLarge
      if (s.scaleSmall) newScaleLarge = s.scaleSmall
      return {
        ...s,
        unitSmall: newSmall, unitLarge: newLarge,
        scaleLarge: newScaleLarge, scaleSmall: newScaleSmall,
        unknownValue: ''
      }
    })
  }

  const [pA, setPA] = useState({x:1, y:1})
  const [pB, setPB] = useState({x:2, y:2})
  const kFromPoints = useMemo(()=>{
    const dx = pB.x - pA.x
    if (dx === 0) return null
    return (pB.y - pA.y) / dx
  }, [pA, pB])

  return (
    <div className="wrap">
      <div className="card">
        <h1>{tr(lang,'appTitle')}</h1>
        <div className="legend" style={{margin:'8px 0 12px'}}>
          <span className="pill">NC.7.G.1 • NC.7.RP.2</span>
          <span className="pill">{tr(lang,'tagsTouch')}</span>
          <span className="pill">{tr(lang,'tagsStart')}</span>
          <span className="pill">{tr(lang,'profileNote')}</span>
        </div>

        <div className="row" style={{marginBottom:8}}>
          <div>
            <label>{tr(lang,'lang')}</label>
            <select value={lang} onChange={(e)=>setLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
          <div>
            <label>{tr(lang,'contrast')}</label>
            <select value={contrast} onChange={(e)=>setContrast(e.target.value)}>
              <option value="normal">{tr(lang,'contrastNormal')}</option>
              <option value="high">{tr(lang,'contrastHigh')}</option>
            </select>
          </div>
        </div>

        <UnitChips lang={lang} />

        <div className={buzz ? 'shake' : ''} style={{marginBottom:8}}>
          <h2>{tr(lang,'guidedSteps')}</h2>
          <ol style={{margin:'0 0 8px 18px', lineHeight:1.7}}>
            <li>{tr(lang,'step1')}</li>
            <li>{tr(lang,'step2')}</li>
            <li>{tr(lang,'step3')}</li>
            <li>{tr(lang,'step4')}</li>
          </ol>
        </div>

        <HTable
          lang={lang}
          state={state}
          setState={setState}
          buzz={buzz}
          setBuzz={setBuzz}
          onCompute={(kval, xval)=> setX(xval)}
          onAxisSwap={onAxisSwap}
        />

        <div className="card" style={{marginTop:12}}>
          <h2>Image</h2>
          <div className="row">
            <div>
              <label>Upload</label>
              <input type="file" accept="image/*" onChange={(e)=>{ const f=e.target.files?.[0]; if(f) onUpload(f) }} />
            </div>
            <div>
              <label>URL</label>
              <div className="row">
                <input id="img-url-input" placeholder="https://..." />
                <button className="btn" onClick={applyUrl}>Apply</button>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{marginTop:12}}>
          <h2>Find k from two points</h2>
          <div className="row">
            <div className="row">
              <input type="number" step="any" value={pA.x} onChange={e=>setPA(a=>({...a,x:parseFloat(e.target.value||0)}))} placeholder="x1"/>
              <input type="number" step="any" value={pA.y} onChange={e=>setPA(a=>({...a,y:parseFloat(e.target.value||0)}))} placeholder="y1"/>
            </div>
            <div className="row">
              <input type="number" step="any" value={pB.x} onChange={e=>setPB(b=>({...b,x:parseFloat(e.target.value||0)}))} placeholder="x2"/>
              <input type="number" step="any" value={pB.y} onChange={e=>setPB(b=>({...b,y:parseFloat(e.target.value||0)}))} placeholder="y2"/>
            </div>
          </div>
          <div className="legend" style={{marginTop:8}}>
            <span className="pill">k = {kFromPoints!=null ? kFromPoints.toFixed(4) : '—'}</span>
            <button className="btn" onClick={()=>{
              if (kFromPoints!=null){
                setState(s=>({ ...s, scaleLarge: String(kFromPoints), scaleSmall: '' }))
              }
            }}>{tr(lang,'setK')}</button>
          </div>
        </div>

        <TaskBank lang={lang} onApplyK={(kv)=>setState(s=>({...s, scaleLarge:String(kv), scaleSmall:''}))}/>

        <Ruler unit={state.unitSmall||'cm'} pxPerUnit={50}/>

        <div style={{display:'flex', gap:8, marginTop:12}}>
          <button className="btn alt" onClick={()=>clearState()}>Clear Local Save</button>
        </div>
      </div>

      <Graph
        lang={lang}
        k={k||0}
        x={x}
        setX={setX}
        unitSmall={state.unitSmall||'cm'}
        unitLarge={state.unitLarge||'m'}
        imageSrc={imageSrc}
      />
    </div>
  )
}
