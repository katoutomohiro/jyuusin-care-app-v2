import React from "react";
import { useLocation } from "react-router-dom";

const box: React.CSSProperties = {
  position: "fixed",
  top: 10,
  right: 10,
  zIndex: 9999,
  background: "rgba(0,0,0,.7)",
  color: "#fff",
  padding: "8px 12px",
  fontSize: 12,
  borderRadius: 8,
  pointerEvents: "none",
  lineHeight: 1.4,
};

export default function RouteProbe() {
  const loc = useLocation();
  return (
    <div style={box}>
      <div>RouteProbe</div>
      <div>pathname: {loc.pathname}</div>
      <div>search: {loc.search || "-"}</div>
      <div>hash: {loc.hash || "-"}</div>
    </div>
  );
}
