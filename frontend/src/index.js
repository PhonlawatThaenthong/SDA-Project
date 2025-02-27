import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import th_TH from 'antd/locale/th_TH';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/reset.css'; // เปลี่ยนเป็นเส้นทางสำหรับ Ant Design 5.x

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider locale={th_TH}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

reportWebVitals();