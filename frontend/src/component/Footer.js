// src/components/Footer/Footer.js
import React from 'react';
import { Layout, Row, Col } from 'antd';

const { Footer } = Layout;

const CustomFooter = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      <Row justify="center">
        <Col>
          <p>My Awesome Website ©2025 Created by Me</p>
        </Col>
      </Row>
    </Footer>
  );
};

export default CustomFooter;
