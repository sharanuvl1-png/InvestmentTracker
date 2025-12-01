import React from "react";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="side-header">
        <div className="side-logo">MC</div>
        <div className="side-title">MyCapital360</div>
      </div>

      <nav className="side-nav">
        <a className="side-link active">Portfolio</a>
        <a className="side-link">Insurance</a>
        <a className="side-link">Goals</a>
        <a className="side-link">Family</a>
        <a className="side-link">Settings</a>
      </nav>
    </div>
  );
}
