import React from "react";

export default function InvestmentTable({ items = [], onUpdate = () => { }, onRemove = () => { }, onEdit = () => { } }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="table" style={{ minWidth: 1100 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Invested (total)</th>
            <th>Current</th>
            <th>Return %</th>
            <th>ROI %</th>
            <th>Date</th>
            <th>SIP</th>
            <th>Recurring</th>
            <th>Tag</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => {
            const invested = Number(it.investedTotal || it.invested || 0);
            const current = Number(it.displayCurrent || it.computedCurrent || 0);
            const r = current - invested;
            const rp = invested ? ((r / invested) * 100).toFixed(1) : "0.0";
            return (
              <tr key={it.id}>
                <td style={{ maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.name}</td>
                <td>{it.category}</td>
                <td>₹{invested.toLocaleString()}</td>
                <td>₹{current.toLocaleString()}</td>
                <td style={{ color: r >= 0 ? "var(--success)" : "var(--danger)" }}>{rp}%</td>
                <td>{it.roi || "-"}</td>
                <td>{it.date || "-"}</td>
                <td>₹{Number(it.sip || 0).toLocaleString()}</td>
                <td>{it.recurringType || "none"}{it.recurringType === "custom" && it.recurringInterval ? ` (${it.recurringInterval}m)` : ""}</td>
                <td>{it.tag || "-"}</td>
                <td style={{ maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={it.notes || ""}>{it.notes || ""}</td>
                <td>
                  <button className="btn-ghost" onClick={() => onEdit(it)}>Edit</button>
                  <button className="btn-ghost" onClick={() => {
                    const newNotes = prompt("Edit notes", it.notes || "");
                    if (newNotes !== null) onUpdate(it.id, { notes: newNotes });
                  }} style={{ marginLeft: 6 }}>Notes</button>
                  <button className="btn-ghost" onClick={() => onRemove(it.id)} style={{ marginLeft: 6, color: "var(--danger)" }}>Delete</button>
                </td>
              </tr>
            );
          })}
          {items.length === 0 && <tr><td colSpan={12} style={{ padding: 18, textAlign: "center", color: "var(--muted)" }}>No investments yet — click Add Investment</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
