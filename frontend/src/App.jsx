import React, { useEffect, useState, useMemo } from "react";
import SummaryCards from "./components/SummaryCards.jsx";
import AddInvestmentModal from "./components/AddInvestmentModal.jsx";
import InvestmentTable from "./components/InvestmentTable.jsx";
import AllocationChart from "./components/AllocationChart.jsx";

const DEFAULT = [
  { id: 1, name: "HDFC Long Term", category: "Kite (Stocks, MF, SGB)", invested: 100000, current: 123500, date: "2023-04-10", notes: "SIP started 2020", sip: 5000, tag: "long term", roi: 10 },
  { id: 2, name: "ICICI Bank FD", category: "FD", invested: 200000, current: 206000, date: "2022-12-01", notes: "", sip: 0, tag: "short term", roi: 4.5 }
];

export default function App(){
  const [items, setItems] = useState(() => {
    try { const raw = localStorage.getItem("mc360:items"); return raw ? JSON.parse(raw) : DEFAULT; } catch { return DEFAULT; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [sortBy, setSortBy] = useState("none"); // none, return, value, category, roi
  const [filterTag, setFilterTag] = useState("All");

  useEffect(()=> localStorage.setItem("mc360:items", JSON.stringify(items)), [items]);

  function addItem(item){
    // ensure fields and numeric types
    const normalized = {
      id: Date.now(),
      name: item.name || "Untitled",
      category: item.category || "Others",
      invested: Number(item.invested || 0),
      current: Number(item.current || 0),
      date: item.date || "",
      notes: item.notes || "",
      sip: Number(item.sip || 0),
      tag: item.tag || "Others",
      roi: Number(item.roi || 0)
    };

    // if current is zero (user left blank) and roi & date provided -> auto-calc
    if ((!item.current || Number(item.current) === 0) && normalized.roi > 0 && normalized.date) {
      const years = Math.max(0, (Date.now() - new Date(normalized.date).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      normalized.current = Number((normalized.invested * Math.pow(1 + normalized.roi / 100, years)).toFixed(2));
    }

    setItems(s => [normalized, ...s]);
  }

  function updateItem(id, patch){
    setItems(s => s.map(it => it.id === id ? { ...it, ...patch } : it));
  }

  function removeItem(id){
    if(!confirm("Delete this investment?")) return;
    setItems(s => s.filter(it => it.id !== id));
  }

  const totals = items.reduce((acc, it) => { acc.invested += Number(it.invested||0); acc.current += Number(it.current||0); return acc; }, { invested:0, current:0 });
  const profit = totals.current - totals.invested;

  const byCategory = items.reduce((m, it) => { m[it.category] = (m[it.category]||0) + Number(it.current||it.invested||0); return m; }, {});
  const allocation = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

  // filtering and sorting
  const filtered = useMemo(()=>{
    let list = items.slice();
    if(filterTag !== "All") list = list.filter(i => (i.tag||"").toLowerCase() === filterTag.toLowerCase());

    if(sortBy === "return"){
      list.sort((a,b) => {
        const ra = (a.invested ? ((a.current - a.invested)/a.invested) : -Infinity);
        const rb = (b.invested ? ((b.current - b.invested)/b.invested) : -Infinity);
        return rb - ra;
      });
    }
    if(sortBy === "value") list.sort((a,b)=> (b.current||0) - (a.current||0));
    if(sortBy === "category") list.sort((a,b)=> (a.category||"").localeCompare(b.category||""));
    if(sortBy === "roi") list.sort((a,b)=> (b.roi||0) - (a.roi||0));
    return list;
  }, [items, sortBy, filterTag]);

  function exportCSV(){
    const rows = [["id","name","category","invested","current","date","roi","notes","sip","tag"]];
    for(const it of items){
      rows.push([it.id, it.name, it.category, it.invested, it.current, it.date || "", it.roi || 0, (it.notes||"").replace(/"/g,'""'), it.sip || 0, it.tag || ""]);
    }
    const csv = rows.map(r => r.map(c => {
      if (c === null || typeof c === "undefined") return "";
      const s = String(c);
      return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g,'""')}"` : s;
    }).join(",")).join("\n");
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
            <option value="roi">Sort: ROI %</option>
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
