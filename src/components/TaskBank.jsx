import React, { useState } from 'react'
import { tr } from '../lib/i18n.js'

const BANK = {
  en: [
    { id:1, prompt:"Map 1 cm : 2 km. Route 7 cm. How many km?", k:2, x:7, expect:"14 km" },
    { id:2, prompt:"Scale: 1 in : 4 ft. Wall is 9 in. Real length?", k:4, x:9, expect:"36 ft" },
  ],
  es: [
    { id:101, prompt:"Mapa 1 cm : 2 km. Ruta 7 cm. ¿Cuántos km?", k:2, x:7, expect:"14 km" },
    { id:102, prompt:"Escala: 1 pulgada : 4 pies. Pared 9 in. ¿Longitud real?", k:4, x:9, expect:"36 ft" },
  ]
}

export default function TaskBank({ lang='en', onApplyK }){
  const tasks = BANK[lang]
  const [idx,setIdx] = useState(0)
  const [reveal,setReveal] = useState(false)
  const [answer,setAnswer] = useState('')
  const task = tasks[idx % tasks.length]

  const check = ()=> answer.trim().toLowerCase()===task.expect.toLowerCase()

  return (
    <div className="card">
      <h2>{tr(lang,'tasksTitle')}</h2>
      <button className="btn" onClick={()=>{setIdx(i=>i+1); setReveal(false); setAnswer('')}}>{tr(lang,'newTask')}</button>
      <p>{task.prompt}</p>
      <input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder={tr(lang,'enterAnswer')}/>
      <button className="btn" onClick={()=>alert(check()?"✅":"❌")}>{tr(lang,'check')}</button>
      <button className="btn alt" onClick={()=>setReveal(r=>!r)}>{tr(lang,'reveal')}</button>
      {reveal && <p className="hint">Answer: {task.expect}</p>}
      <button className="btn" onClick={()=>onApplyK?.(task.k)}>Use k</button>
    </div>
  )
}
