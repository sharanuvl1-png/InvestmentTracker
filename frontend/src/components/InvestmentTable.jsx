import React from "react";

export default function InvestmentTable({ items = [], onRemove = () => {}, onEdit = () => {}, onUpdate = () => {} }) {
  return (
    <div className="table-container">
      <table className="modern-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Invested</th>
            <th>Current</th>
            <th>Gain</th>
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
            const current = Number(it.displayCurrent || 0);
            const gain = current - invested;
            const returnPerc = invested ? ((gain / invested) * 100).toFixed(1) : "0.0";

            return (
              <tr key={it.id} className="modern-row">
                <td className="ellipsis">{it.name}</td>

                <td><span className="pill cat-pill">{it.category}</span></td>

                <td>₹{invested.toLocaleString()}</td>
                <td>₹{current.toLocaleString()}</td>

                <td className={gain >= 0 ? "profit-text" : "loss-text"}>
                  ₹{gain.toLocaleString()}
                </td>

                <td className={gain >= 0 ? "profit-text" : "loss-text"}>
                  {returnPerc}%
                </td>

                <td>{it.roi || "-"}</td>
                <td>{it.date || "-"}</td>
                <td>₹{Number(it.sip || 0).toLocaleString()}</td>

                <td>
                  <span className="pill recur-pill">
                    {it.recurringType || "none"}
                    {it.recurringType === "custom" && it.recurringInterval ? ` (${it.recurringInterval}m)` : ""}
                  </span>
                </td>

                <td><span className="pill tag-pill">{it.tag || "-"}</span></td>

                <td className="ellipsis" title={it.notes || ""}>
                  {it.notes || ""}
                </td>

                <td className="action-buttons">
                  <button className="btn-mini" onClick={() => onEdit(it)}>Edit</button>
                  <button className="btn-mini" onClick={() => {
                    const newNotes = prompt("Edit notes", it.notes || "");
                    if (newNotes !== null) onUpdate(it.id, { notes: newNotes });
                  }}>Notes</button>
                  <button className="btn-mini danger" onClick={() => onRemove(it.id)}>Delete</button>
                </td>
              </tr>
            );
          })}

          {items.length === 0 && (
            <tr>
              <td colSpan="13" className="empty-state">No investments yet — click Add Investment</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
