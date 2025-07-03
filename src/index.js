import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import RotateHint from "./components/RotateHint";           // 👈 作ったヒント
import { AppDataProvider } from "./contexts/AppDataContext";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppDataProvider>
    {/* ラッパーにクラス付与 */}
    <div className="app-portrait-lock">
      <App />
    </div>
    <RotateHint />      {/* 横向き時に “縦で見てね” オーバーレイ */}
  </AppDataProvider>
);

serviceWorkerRegistration.register();
