import React from "react";

export default function InvestmentTable({ items=[], onUpdate=()=>{}, onRemove=()=>{} }){
  return (
    <div>
      <table className="table">
        <thead>
          <tr><th>Name</th><th>Category</th><th>Invested</th><th>Current</th><th>Return %</th><th>Date</th><th>SIP</th><th>Tag</th><th>Notes</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {items.map(it=>{
            const r = Number(it.current||0) - Number(it.invested||0);
            const rp = it.invested ? ((r/it.invested)*100).toFixed(1) : "0.0";
            return (
              <tr key={it.id}>
                <td>{it.name}</td>
                <td>{it.category}</td>
                <td>₹{Number(it.invested||0).toLocaleString()}</td>
                <td>₹{Number(it.current||0).toLocaleString()}</td>
                <td style={{color: r>=0? "var(--success)":"var(--danger)"}}>{rp}%</td>
                <td>{it.date || "-"}</td>
                <td>₹{Number(it.sip||0).toLocaleString()}</td>
                <td>{it.tag || "-"}</td>
                <td style={{maxWidth:200,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}} title={it.notes||""}>{it.notes||""}</td>
                <td>
                  <button className="btn-ghost" onClick={()=>{ const nv = prompt("Update current value (INR)", String(it.current||0)); if(nv!==null) onUpdate(it.id, { current: Number(nv) }) }}>Update</button>
                  <button className="btn-ghost" onClick={()=>{ const newNotes = prompt("Edit notes", it.notes||""); if(newNotes!==null) onUpdate(it.id, { notes: newNotes }) }} style={{marginLeft:6}}>Notes</button>
                  <button className="btn-ghost" onClick={()=> onRemove(it.id)} style={{marginLeft:6,color:"var(--danger)"}}>Delete</button>
                </td>
              </tr>
            )
          })}
          {items.length===0 && <tr><td colSpan={10} style={{padding:18,textAlign:"center",color:"var(--muted)"}}>No investments yet — click Add Investment</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
