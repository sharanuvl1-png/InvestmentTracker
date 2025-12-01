import React, { useState } from "react";

export default function AddInvestmentModal({ onClose, onSave }){
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Mutual Funds");
  const [invested, setInvested] = useState("");
  const [current, setCurrent] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [sip, setSip] = useState("");
  const [tag, setTag] = useState("long term");

  function submit(e){
    e.preventDefault();
    onSave({ name, category, invested: Number(invested||0), current: Number(current||0), date, notes, sip: Number(sip||0), tag });
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
              <option>Mutual Funds</option>
              <option>Stocks</option>
              <option>Fixed Deposits</option>
              <option>Gold</option>
              <option>Bonds</option>
              <option>PPF</option>
              <option>ULIP</option>
              <option>Others</option>
            </select>
          </div>
          <div className="form-row">
            <input className="input" placeholder="Invested (INR)" type="number" value={invested} onChange={e=>setInvested(e.target.value)} />
            <input className="input" placeholder="Current Value (INR)" type="number" value={current} onChange={e=>setCurrent(e.target.value)} />
          </div>

          <div className="form-row">
            <input className="input" placeholder="Date of Investment" type="date" value={date} onChange={e=>setDate(e.target.value)} />
            <input className="input" placeholder="SIP per month (INR)" type="number" value={sip} onChange={e=>setSip(e.target.value)} />
          </div>

          <div className="form-row">
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
