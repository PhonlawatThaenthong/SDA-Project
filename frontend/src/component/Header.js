import React from 'react';
import { Layout, Row, Col, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import './home component/Header.css';  // ถ้าต้องการเพิ่ม CSS แบบแยกไฟล์

const { Header } = Layout;

const CustomHeader = () => {
  return (
    <Header style={{ background: '#fff', padding: '0 50px' }}>
      <Row justify="space-between" align="middle" style={{ width: '100%' }}>
        <Col>
          <Menu theme="light" mode="horizontal">
            <Menu.Item key="1">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/about">About</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/contact">Contact</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Link to="/login">
            <Button type="primary" style={{ minWidth: '120px' }}>
              Sign Up
            </Button>
          </Link>
        </Col>
      </Row>
    </Header>
  );
};

export default CustomHeader;