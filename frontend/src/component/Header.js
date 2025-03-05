import React from 'react';
import { Layout, Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import './home component/Header.css';
import logo from './home component/favicon.ico'; // นำเข้ารูปจาก src/assets

const { Header } = Layout;

const CustomHeader = () => {
  return (
    <Header className="custom-header">
      <Row justify="space-between" align="middle" style={{ width: '100%' }}>
        {/* Logo หรือชื่อเว็บไซต์ (ซ้าย) */}
        <Col>
          <Link to="/" className="logo">
            <img src={logo} alt="Website Logo" className="logo-image" />
          </Link>
        </Col>

        {/* ปุ่ม Sign Up (ขวา) */}
        <Col>
          <Link to="/login">
            <Button type="primary" className="signup-button">
              Sign Up
            </Button>
          </Link>
        </Col>
      </Row>
    </Header>
  );
};

export default CustomHeader;
