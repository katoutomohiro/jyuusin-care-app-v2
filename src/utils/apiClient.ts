function ensurePath(p: string) { return p.startsWith('/') ? p : `/${p}`; }
export async function apiGet<T=any>(path: string): Promise<T> { const url=ensurePath(path); const r=await fetch(url); if(!r.ok) throw new Error(`[GET] ${url} ${r.status}`); return r.json(); }
export async function apiPost<T=any>(path: string, body:any): Promise<T> { const url=ensurePath(path); const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); if(!r.ok) throw new Error(`[POST] ${url} ${r.status}`); return r.json(); }
