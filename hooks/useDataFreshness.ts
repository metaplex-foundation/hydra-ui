import * as React from "react";
export function useDataFreshness(lastUpdated: number | null, { intervalMs = 15000 } = {}) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(()=>{ const id = setInterval(()=>setNow(Date.now()), intervalMs); return ()=>clearInterval(id); }, [intervalMs]);
  const ageMs = lastUpdated ? now - lastUpdated : Infinity;
  return { ageMs, ageSeconds: Math.floor(ageMs/1000), isStale: ageMs > intervalMs * 2, refreshTimestamp: now };
}
