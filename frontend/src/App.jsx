import React, { useEffect, useState, useMemo } from "react";
import SummaryCards from "./components/SummaryCards.jsx";
import AddInvestmentModal from "./components/AddInvestmentModal.jsx";
import InvestmentTable from "./components/InvestmentTable.jsx";
import AllocationChart from "./components/AllocationChart.jsx";

const DEFAULT = [
  { id: 1, name: "HDFC Long Term", category: "Mutual Funds", invested: 100000, current: 123500, date: "2023-04-10", notes: "SIP started 2020", sip: 5000, tag: "long term" },
  { id: 2, name: "ICICI Bank FD", category: "Fixed Deposits", invested: 200000, current: 206000, date: "2022-12-01", notes: "", sip: 0, tag: "short term" }
];

export default function App(){
  const [items, setItems] = useState(()=>{
    try { const raw = localStorage.getItem("mc360:items"); return raw ? JSON.parse(raw) : DEFAULT; } catch { return DEFAULT; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [sortBy, setSortBy] = useState("none"); // none, return, value, category
  const [filterTag, setFilterTag] = useState("All");

  useEffect(()=> localStorage.setItem("mc360:items", JSON.stringify(items)), [items]);

  function addItem(item){ setItems(s => [{ id: Date.now(), ...item }, ...s]); }
  function updateItem(id, patch){ setItems(s => s.map(it => it.id === id ? { ...it, ...patch } : it)); }
  function removeItem(id){ if(!confirm("Delete this investment?")) return; setItems(s => s.filter(it => it.id !== id)); }

  const totals = items.reduce((acc, it) => { acc.invested += Number(it.invested||0); acc.current += Number(it.current||0); return acc }, { invested:0, current:0 });
  const profit = totals.current - totals.invested;

  const byCategory = items.reduce((m, it) => { m[it.category] = (m[it.category]||0) + Number(it.current||it.invested||0); return m }, {});
  const allocation = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

  // filtering and sorting
  const filtered = useMemo(()=>{
    let list = items.slice();
    if(filterTag !== "All") list = list.filter(i => (i.tag||"").toLowerCase() === filterTag.toLowerCase());
    if(sortBy === "return") list.sort((a,b)=> ((b.current - b.invested)/(b.invested||1)) - ((a.current - a.invested)/(a.invested||1)));
    if(sortBy === "value") list.sort((a,b)=> (b.current||0) - (a.current||0));
    if(sortBy === "category") list.sort((a,b)=> (a.category||"").localeCompare(b.category||""));
    return list;
  }, [items, sortBy, filterTag]);

  function exportCSV(){
    const rows = [["id","name","category","invested","current","date","notes","sip","tag"]];
    for(const it of items){
      rows.push([it.id, it.name, it.category, it.invested, it.current, it.date || "", (it.notes||"").replace(/"/g,'""'), it.sip || 0, it.tag || ""]);
    }
    const csv = rows.map(r => r.map(c => typeof c === "string" && c.includes(",") ? '"' + c + '"' : c).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "mycapital360_portfolio.csv"; a.click(); URL.revokeObjectURL(a.href);
  }

  return (
    <div className="wrap">
      <header className="topbar">
        <div className="brand">
          <div className="logo">MC</div>
          <div>
            <div className="title">MyCapital360</div>
            <div className="subtitle">Personal Investment Tracker</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <select value={filterTag} onChange={e=>setFilterTag(e.target.value)} className="input">
            <option>All</option>
            <option>long term</option>
            <option>short term</option>
            <option>child plan</option>
            <option>retirement</option>
          </select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="input">
            <option value="none">Sort: None</option>
            <option value="return">Sort: Return %</option>
            <option value="value">Sort: Current Value</option>
            <option value="category">Sort: Category</option>
          </select>
          <button className="btn" onClick={()=>setShowAdd(true)}>Add Investment</button>
          <button className="btn-ghost" onClick={exportCSV}>Export CSV</button>
        </div>
      </header>

      <main className="main">
        <section className="left">
          <SummaryCards invested={totals.invested} current={totals.current} profit={profit} />
          <div className="card">
            <InvestmentTable items={filtered} onUpdate={updateItem} onRemove={removeItem} />
          </div>
        </section>

        <aside className="right">
          <div className="card">
            <h4 style={{marginTop:0}}>Allocation</h4>
            <AllocationChart data={allocation} />
          </div>
          <div className="card" style={{marginTop:14}}>
            <h4 style={{marginTop:0}}>Quick</h4>
            <button className="btn-ghost" onClick={()=>{ if(!confirm("Clear all?")) return; localStorage.removeItem("mc360:items"); window.location.reload(); }}>Clear All</button>
          </div>
        </aside>
      </main>

      {showAdd && <AddInvestmentModal onClose={()=>setShowAdd(false)} onSave={(it)=>{ addItem(it); setShowAdd(false); }} />}

      <footer className="footer">Local only • Data stored in your browser</footer>
    </div>
  );
}
