import React from "react";

export default function InvestmentTable({ items = [], onRemove = () => {}, onEdit = () => {}, onUpdate = () => {} }) {
  return (
    <div className="table-wrapper">
      <table className="table clean-table">
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
            const rp = invested ? ((gain / invested) * 100).toFixed(1) : "0.0";

            return (
              <tr key={it.id}>
                <td className="text-ellipsis">{it.name}</td>

                <td>
                  <span className="badge">{it.category}</span>
                </td>

                <td>₹{invested.toLocaleString()}</td>
                <td>₹{current.toLocaleString()}</td>

                <td style={{ color: gain >= 0 ? "var(--success)" : "var(--danger)", fontWeight: 600 }}>
                  ₹{gain.toLocaleString()}
                </td>

                <td style={{ color: gain >= 0 ? "var(--success)" : "var(--danger)" }}>
                  {rp}%
                </td>

                <td>{it.roi || "-"}</td>
                <td>{it.date || "-"}</td>
                <td>₹{Number(it.sip || 0).toLocaleString()}</td>

                <td>
                  {it.recurringType || "none"}
                  {it.recurringType === "custom" && it.recurringInterval ? ` (${it.recurringInterval}m)` : ""}
                </td>

                <td>
                  <span className="tag">{it.tag || "-"}</span>
                </td>

                <td className="text-ellipsis" title={it.notes || ""}>{it.notes || ""}</td>

                <td>
                  <button className="btn-small" onClick={() => onEdit(it)}>Edit</button>
                  <button className="btn-small" onClick={() => {
                    const newNotes = prompt("Edit notes", it.notes || "");
                    if (newNotes !== null) onUpdate(it.id, { notes: newNotes });
                  }}>Notes</button>
                  <button className="btn-small danger" onClick={() => onRemove(it.id)}>Delete</button>
                </td>
              </tr>
            );
          })}

          {items.length === 0 && (
            <tr>
              <td colSpan={13} className="empty-row">No investments yet — click Add Investment</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
