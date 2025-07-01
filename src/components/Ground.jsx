// components/Ground.jsx
import React from "react";

export default function Ground() {
  return (
    <div
      className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-pink-200 to-transparent"
      style={{
        borderTop: "2px solid #e5a4b0",
        zIndex: 5,
      }}
    />
  );
}
