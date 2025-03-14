import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";
import th_TH from "antd/locale/th_TH";
import "./index.css";
import "antd/dist/reset.css"; // Ant Design 5.x
import App from "./App";
import MainPage from "./page/mainpage"
import LoginPage from "./page/login";
import UserSettingPage from "./page/UserSettingPage";
import Home from "./page/Home";
import ProtectedRoute from "./component/ProtectedRoute"; // Import the new component
import reportWebVitals from "./reportWebVitals";
import Upload from "./page/Upload";
import { AuthProvider } from "./context/AuthContext";
import { StorageProvider } from "./context/StorageContext"; // เพิ่ม import StorageProvider
import Logs from "./page/logs";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ConfigProvider locale={th_TH}>
      <AuthProvider>
        <StorageProvider> 
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/usersetting" element={
                <ProtectedRoute>
                  <UserSettingPage />
                </ProtectedRoute>
              } />
               <Route path="/main" element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              } />
              <Route path="/home" element={
                <ProtectedRoute>
                  <MainPage />
                </ProtectedRoute>
              } />
              <Route path="/Upload" element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              } />
              
            </Routes>
          </Router>
        </StorageProvider>
      </AuthProvider>
    </ConfigProvider>
  </React.StrictMode>
);

reportWebVitals();