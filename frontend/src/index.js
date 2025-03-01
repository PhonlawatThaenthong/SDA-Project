import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";
import th_TH from "antd/locale/th_TH";
import "./index.css";
import "antd/dist/reset.css"; // Ant Design 5.x
import App from "./App";
import LoginPage from "./page/login";
import UserSettingPage from "./page/UserSettingPage";
import Home from "./page/Home";
import reportWebVitals from "./reportWebVitals";
import Upload from "./page/Upload";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ConfigProvider locale={th_TH}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/usersetting" element={<UserSettingPage />} />
            <Route path="/Home" element={<App />} />
            <Route path="/Upload" element={<Upload />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  </React.StrictMode>
);

reportWebVitals();