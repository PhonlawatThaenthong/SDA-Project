import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";
import th_TH from "antd/locale/th_TH";
import "./index.css";
import "antd/dist/reset.css"; // Ant Design 5.x
import App from "./App";
import LoginPage from "./page/login"; // นำเข้า LoginPage
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ConfigProvider locale={th_TH}>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </ConfigProvider>
  </React.StrictMode>
);

reportWebVitals();