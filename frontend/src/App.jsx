import React, { useEffect, useState, useMemo } from "react";
import SummaryCards from "./components/SummaryCards.jsx";
import AddInvestmentModal from "./components/AddInvestmentModal.jsx";
import InvestmentTable from "./components/InvestmentTable.jsx";
import AllocationChart from "./components/AllocationChart.jsx";
import Sidebar from "./components/Sidebar.jsx";   // ⭐ ADD THIS LINE

/**
 * Accurate recurring logic (Option B)
 */
const DEFAULT = [
  { id: 1, name: "HDFC Long Term", category: "Kite (Stocks, MF, SGB)", invested: 100000, current: 0, date: "2023-04-10", notes: "SIP started 2020", sip: 5000, tag: "long term", roi: 10, recurringType: "monthly", recurringInterval: 0 },
  { id: 2, name: "ICICI Bank FD", category: "FD", invested: 200000, current: 0, date: "2022-12-01", notes: "", sip: 0, tag: "short term", roi: 4.5, recurringType: "none", recurringInterval: 0 }
];

function monthsBetween(start, end) {
  const sy = start.getFullYear(), sm = start.getMonth();
  const ey = end.getFullYear(), em = end.getMonth();
  return (ey - sy) * 12 + (em - sm);
}

function yearsBetweenFractional(start, end) {
  const ms = end.getTime() - start.getTime();
  return ms / (365.25 * 24 * 60 * 60 * 1000);
}

function computeAccurateValues(item) {
  const invested0 = Number(item.invested || 0);
  const roi = Number(item.roi || 0) / 100;
  const sip = Number(item.sip || 0);
  const startDate = item.date ? new Date(item.date) : null;
  const now = new Date();

  let investedTotal = 0;
  let currentValue = 0;

  function addContribution(amount, contributionDate) {
    if (!contributionDate) {
      investedTotal += amount;
      currentValue += amount;
      return;
    }
    investedTotal += amount;
    const years = yearsBetweenFractional(contributionDate, now);
    const fv = amount * Math.pow(1 + roi, Math.max(0, years));
    currentValue += Number(fv);
  }

  if (startDate) addContribution(invested0, startDate);
  else addContribution(invested0, now);

  const type = item.recurringType || "none";
  const interval = Number(item.recurringInterval || 0);

  if (type === "monthly" && sip > 0 && startDate) {
    const totalMonths = monthsBetween(startDate, now);
    for (let m = 1; m <= totalMonths; m++) {
      const contribDate = new Date(startDate.getFullYear(), startDate.getMonth() + m, startDate.getDate());
      if (contribDate > now) break;
      addContribution(sip, contribDate);
    }
  } else if (type === "yearly" && invested0 > 0 && startDate) {
    const totalYears = Math.floor(yearsBetweenFractional(startDate, now));
    for (let y = 1; y <= totalYears; y++) {
      const contribDate = new Date(startDate.getFullYear() + y, startDate.getMonth(), startDate.getDate());
      if (contribDate > now) break;
      addContribution(invested0, contribDate);
    }
  } else if (type === "custom" && interval > 0 && invested0 > 0 && startDate) {
    const totalMonths = monthsBetween(startDate, now);
    const periods = Math.floor(totalMonths / interval);
    for (let p = 1; p <= periods; p++) {
      const contribDate = new Date(startDate.getFullYear(), startDate.getMonth() + p * interval, startDate.getDate());
      if (contribDate > now) break;
      addContribution(invested0, contribDate);
    }
  }

  const explicitCurrent = Number(item.current || 0);
  const finalCurrent = explicitCurrent > 0 ? explicitCurrent : currentValue;

  return {
    investedTotal: Number(investedTotal.toFixed(2)),
    currentValue: Number(finalCurrent.toFixed(2))
  };
}

export default function App() {
  const [items, setItems] = useState(() => {
    try { const raw = localStorage.getItem("mc360:items"); return raw ? JSON.parse(raw) : DEFAULT; } catch { return DEFAULT; }
  });

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [sortBy, setSortBy] = useState("none");
  const [filterTag, setFilterTag] = useState("All");

  useEffect(() => localStorage.setItem("mc360:items", JSON.stringify(items)), [items]);

  function addItem(item) {
    const base = { id: Date.now(), ...item };
    const vals = computeAccurateValues(base);
    base.current = Number(item.current || 0) > 0 ? Number(item.current) : vals.currentValue;
    base.invested = Number(base.invested || 0);
    setItems(s => [base, ...s]);
  }

  function updateItem(id, patch) {
    setItems(s => s.map(it => {
      if (it.id !== id) return it;
      const merged = { ...it, ...patch };
      const vals = computeAccurateValues(merged);
      merged.current = Number(patch.current || merged.current || 0) > 0 ? Number(patch.current || merged.current) : vals.currentValue;
      return merged;
    }));
  }

  function removeItem(id) {
    if (!confirm("Delete this investment?")) return;
    setItems(s => s.filter(it => it.id !== id));
  }

  const computedItems = useMemo(() => items.map(it => {
    const vals = computeAccurateValues(it);
    return {
      ...it,
      investedTotal: vals.investedTotal,
      computedCurrent: vals.currentValue,
      displayCurrent: Number(it.current || 0) > 0 ? Number(it.current) : vals.currentValue
    };
  }), [items]);

  const totals = computedItems.reduce((acc, it) => {
    acc.invested += Number(it.investedTotal || 0);
    acc.current += Number(it.displayCurrent || 0);
    return acc;
  }, { invested: 0, current: 0 });

  const profit = totals.current - totals.invested;

  const byCategory = computedItems.reduce((m, it) => {
    m[it.category] = (m[it.category] || 0) + Number(it.displayCurrent || 0);
    return m;
  }, {});
  const allocation = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

  const filtered = useMemo(() => {
    let list = computedItems.slice();
    if (filterTag !== "All") list = list.filter(i => (i.tag || "").toLowerCase() === filterTag.toLowerCase());

    if (sortBy === "return") {
      list.sort((a, b) => {
        const ra = a.investedTotal ? ((a.displayCurrent - a.investedTotal) / a.investedTotal) : -Infinity;
        const rb = b.investedTotal ? ((b.displayCurrent - b.investedTotal) / b.investedTotal) : -Infinity;
        return rb - ra;
      });
    }
    if (sortBy === "value") list.sort((a, b) => (b.displayCurrent || 0) - (a.displayCurrent || 0));
    if (sortBy === "category") list.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
    if (sortBy === "roi") list.sort((a, b) => (b.roi || 0) - (a.roi || 0));

    return list;
  }, [computedItems, sortBy, filterTag]);

  function handleEdit(item) {
    setEditItem(item);
    setShowModal(true);
  }

  function handleSaveFromModal(payload) {
    if (editItem) updateItem(editItem.id, payload);
    else addItem(payload);

    setEditItem(null);
    setShowModal(false);
  }

  // ⭐⭐⭐ NEW UPDATED LAYOUT WITH SIDEBAR ⭐⭐⭐
  return (
    <div className="app-wrapper">
      
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="main-section">

        <header className="topbar">
          <div className="brand">
            <div className="logo">MC</div>
            <div>
              <div className="title">MyCapital360</div>
              <div className="subtitle">Personal Investment Tracker</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select value={filterTag} onChange={e => setFilterTag(e.target.value)} className="input">
              <option>All</option>
              <option>long term</option>
              <option>short term</option>
              <option>child plan</option>
              <option>retirement</option>
            </select>

            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input">
              <option value="none">Sort: None</option>
              <option value="return">Sort: Return %</option>
              <option value="value">Sort: Current Value</option>
              <option value="category">Sort: Category</option>
              <option value="roi">Sort: ROI %</option>
            </select>

            <button className="btn" onClick={() => { setEditItem(null); setShowModal(true); }}>Add Investment</button>
          </div>
        </header>

        <main className="main">
          <section className="left">
            <SummaryCards invested={totals.invested} current={totals.current} profit={profit} />
            <div className="card">
              <InvestmentTable items={filtered} onUpdate={updateItem} onRemove={removeItem} onEdit={handleEdit} />
            </div>
          </section>

          <aside className="right">
            <div className="card">
              <h4 style={{ marginTop: 0 }}>Allocation</h4>
              <AllocationChart data={allocation} />
            </div>

            <div className="card" style={{ marginTop: 14 }}>
              <h4 style={{ marginTop: 0 }}>Quick</h4>
              <button className="btn-ghost" onClick={() => { if (!confirm("Clear all?")) return; localStorage.removeItem("mc360:items"); window.location.reload(); }}>Clear All</button>
            </div>
          </aside>
        </main>

        {showModal && (
          <AddInvestmentModal
            onClose={() => { setShowModal(false); setEditItem(null); }}
            onSave={handleSaveFromModal}
            editData={editItem}
          />
        )}

        <footer className="footer">Local only • Data stored in your browser</footer>
      </div>

    </div>
  );
}
