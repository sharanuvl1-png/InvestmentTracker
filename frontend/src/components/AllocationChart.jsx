import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#4f46e5","#06b6d4","#10b981","#f59e0b","#ef4444","#a78bfa"];

export default function AllocationChart({ data=[] }){
  const pieData = data.map((d,i)=> ({ name: d.name, value: d.value, color: COLORS[i%COLORS.length] }));
  if(pieData.length===0) return <div className="allocation-placeholder">No allocation yet</div>;
  return (
    <div style={{height:220}}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
            {pieData.map((entry,i)=> <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip formatter={(v)=> `₹${Number(v).toLocaleString()}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
