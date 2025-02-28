import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";
import th_TH from "antd/locale/th_TH";
import "./index.css";
import "antd/dist/reset.css"; // Ant Design 5.x
import App from "./App";
import LoginPage from "./page/login"; // นำเข้า LoginPage
import UserSettingPage from "./page/UserSettingPage"; // นำเข้า UserSettingPage
import Home from "./page/Home"; // นำเข้า Home
import reportWebVitals from "./reportWebVitals";
import Upload from "./page/Upload";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ConfigProvider locale={th_TH}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/usersetting" element={<UserSettingPage />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Upload" element={<Upload />} />
        </Routes>
      </Router>
    </ConfigProvider>
  </React.StrictMode>
);

reportWebVitals();