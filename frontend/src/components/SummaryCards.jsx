import React from "react";

export default function SummaryCards({ invested, current, profit }) {
  const profitPerc = invested ? (profit / invested) * 100 : 0;

  const cards = [
    {
      title: "Total Invested",
      value: invested,
      color: "#111827"
    },
    {
      title: "Current Value",
      value: current,
      color: "#111827"
    },
    {
      title: "Profit / Loss",
      value: profit,
      info: `${profitPerc.toFixed(1)}%`,
      color: profit >= 0 ? "#059669" : "#dc2626"
    }
  ];

  return (
    <div className="summary-container">
      {cards.map((c, idx) => (
        <div className="summary-card" key={idx}>
          <div className="summary-title">{c.title}</div>

          <div 
            className="summary-value" 
            style={{ color: c.color }}
          >
            ₹{Number(c.value).toLocaleString()}
            {c.info && (
              <span 
                className="summary-info"
                style={{ color: c.color }}
              >
                {" "}
                ({c.info})
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
