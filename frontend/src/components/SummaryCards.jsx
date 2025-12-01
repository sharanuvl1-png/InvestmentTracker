import React from "react";
export default function SummaryCards({ invested, current, profit }){
  const profitPerc = invested ? (profit / invested) * 100 : 0;
  return (
    <div className="card">
      <div className="summary">
        <div className="stat">
          <div className="small-muted">Total Invested</div>
          <div style={{fontSize:18,fontWeight:700}}>₹{Number(invested).toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="small-muted">Current Value</div>
          <div style={{fontSize:18,fontWeight:700}}>₹{Number(current).toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="small-muted">Profit / Loss</div>
          <div style={{fontSize:18,fontWeight:700,color: profit>=0? 'var(--success)': 'var(--danger)'}}>₹{Number(profit).toLocaleString()} ({profitPerc.toFixed(1)}%)</div>
        </div>
      </div>
    </div>
  );
}
