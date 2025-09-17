const KEY = 'plab:single'

export function saveState(payload){
  try { localStorage.setItem(KEY, JSON.stringify({ ...(loadState()||{}), ...payload })) } catch {}
}
export function loadState(){
  try { const raw = localStorage.getItem(KEY); return raw? JSON.parse(raw): null } catch { return null }
}
export function clearState(){
  try { localStorage.removeItem(KEY) } catch {}
}
