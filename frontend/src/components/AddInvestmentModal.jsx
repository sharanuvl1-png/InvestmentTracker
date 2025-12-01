import React, { useState, useEffect } from "react";

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

export default function AddInvestmentModal({ onClose, onSave, editData }) {
  // Initialize state from editData when provided
  const [name, setName] = useState(editData?.name || "");
  const [category, setCategory] = useState(editData?.category || CATEGORY_OPTIONS[1]);
  const [invested, setInvested] = useState(editData?.invested || "");
  const [current, setCurrent] = useState(typeof editData?.current !== "undefined" ? editData.current : "");
  const [date, setDate] = useState(editData?.date || "");
  const [notes, setNotes] = useState(editData?.notes || "");
  const [sip, setSip] = useState(editData?.sip || "");
  const [tag, setTag] = useState(editData?.tag || "long term");
  const [roi, setRoi] = useState(typeof editData?.roi !== "undefined" ? editData.roi : "");
  const [recurringType, setRecurringType] = useState(editData?.recurringType || "none");
  const [recurringInterval, setRecurringInterval] = useState(editData?.recurringInterval || "");

  // When editData changes (opening modal for edit), update fields
  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setCategory(editData.category || CATEGORY_OPTIONS[1]);
      setInvested(editData.invested || "");
      setCurrent(typeof editData.current !== "undefined" ? editData.current : "");
      setDate(editData.date || "");
      setNotes(editData.notes || "");
      setSip(editData.sip || "");
      setTag(editData.tag || "long term");
      setRoi(typeof editData.roi !== "undefined" ? editData.roi : "");
      setRecurringType(editData.recurringType || "none");
      setRecurringInterval(editData.recurringInterval || "");
    }
  }, [editData]);

  function submit(e) {
    e.preventDefault();

    // send raw values; App will compute accurate current if left blank
    onSave({
      name,
      category,
      invested: Number(invested || 0),
      current: current === "" ? 0 : Number(current || 0),
      date,
      notes,
      sip: Number(sip || 0),
      tag,
      roi: Number(roi || 0),
      recurringType,
      recurringInterval: Number(recurringInterval || 0)
    });
  }

  const title = editData ? "Edit Investment" : "Add Investment";

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <form onSubmit={submit}>
          <div className="form-row">
            <input className="input" placeholder="Name (e.g., HDFC Long Term)" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="form-row">
            <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-row">
            <input className="input" placeholder="Invested (INR)" type="number" value={invested} onChange={e => setInvested(e.target.value)} />
            <input className="input" placeholder="Current Value (INR) — leave blank to auto-calc" type="number" value={current} onChange={e => setCurrent(e.target.value)} />
          </div>

          <div className="form-row">
            <input className="input" placeholder="Date of Investment" type="date" value={date} onChange={e => setDate(e.target.value)} />
            <input className="input" placeholder="Rate of Interest (%)" type="number" value={roi} onChange={e => setRoi(e.target.value)} />
          </div>

          <div className="form-row">
            <input className="input" placeholder="SIP per month (INR)" type="number" value={sip} onChange={e => setSip(e.target.value)} />
            <select className="input" value={tag} onChange={e => setTag(e.target.value)}>
              <option value="long term">long term</option>
              <option value="short term">short term</option>
              <option value="child plan">child plan</option>
              <option value="retirement">retirement</option>
            </select>
          </div>

          <div className="form-row">
            <select className="input" value={recurringType} onChange={e => setRecurringType(e.target.value)}>
              <option value="none">Recurring: None</option>
              <option value="monthly">Monthly SIP</option>
              <option value="yearly">Yearly Recurring</option>
              <option value="custom">Custom (every X months)</option>
            </select>

            {recurringType === "custom" && (
              <input className="input" placeholder="Every X months" type="number" value={recurringInterval} onChange={e => setRecurringInterval(e.target.value)} />
            )}
          </div>

          <div style={{ marginBottom: 10 }}>
            <textarea className="input" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} rows={3}></textarea>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button type="button" className="btn-ghost" onClick={() => { onClose(); }}>Cancel</button>
            <button className="btn" type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
