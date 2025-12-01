import React, { useState } from "react";

const CATEGORY_OPTIONS = [
  "Bonds",
  "Kite (Stocks, MF, SGB)",
  "NPS",
  "PPF",
  "SSS",
  "PF",
  "FD",
  "ULIP",
  "Gold Physical",
  "Reliance Jewel",
  "LIC",
  "Car",
  "Plot",
  "Bikes",
  "Others"
];

export default function AddInvestmentModal({ onClose, onSave }){
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[1]); // default Kite
  const [invested, setInvested] = useState("");
  const [current, setCurrent] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [sip, setSip] = useState("");
  const [tag, setTag] = useState("long term");
  const [roi, setRoi] = useState("");

  function submit(e){
    e.preventDefault();

    const investedNum = Number(invested || 0);
    const currentNum = Number(current || 0);
    const roiNum = Number(roi || 0);

    // auto-calc current if current not provided but roi + date given
    let autoCurrent = currentNum;
    if ((!current || Number(current) === 0) && roiNum > 0 && date) {
      const years = Math.max(0, (Date.now() - new Date(date).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      autoCurrent = Number((investedNum * Math.pow(1 + roiNum / 100, years)).toFixed(2));
    }

    onSave({
      name,
      category,
      invested: investedNum,
      current: autoCurrent || currentNum,
      date,
      notes,
      sip: Number(sip || 0),
      tag,
      roi: roiNum
    });
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3 style={{marginTop:0}}>Add Investment</h3>
        <form onSubmit={submit}>
          <div className="form-row">
            <input className="input" placeholder="Name (e.g., HDFC Long Term)" value={name} onChange={e=>setName(e.target.value)} required />
          </div>

          <div className="form-row">
            <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-row">
            <input className="input" placeholder="Invested (INR)" type="number" value={invested} onChange={e=>setInvested(e.target.value)} />
            <input className="input" placeholder="Current Value (INR) — leave blank to auto-calc" type="number" value={current} onChange={e=>setCurrent(e.target.value)} />
          </div>

          <div className="form-row">
            <input className="input" placeholder="Date of Investment" type="date" value={date} onChange={e=>setDate(e.target.value)} />
            <input className="input" placeholder="Rate of Interest (%)" type="number" value={roi} onChange={e=>setRoi(e.target.value)} />
          </div>

          <div className="form-row">
            <input className="input" placeholder="SIP per month (INR)" type="number" value={sip} onChange={e=>setSip(e.target.value)} />
            <select className="input" value={tag} onChange={e=>setTag(e.target.value)}>
              <option value="long term">long term</option>
              <option value="short term">short term</option>
              <option value="child plan">child plan</option>
              <option value="retirement">retirement</option>
            </select>
          </div>

          <div style={{marginBottom:10}}>
            <textarea className="input" placeholder="Notes (optional)" value={notes} onChange={e=>setNotes(e.target.value)} rows={3}></textarea>
          </div>

          <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn" type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
