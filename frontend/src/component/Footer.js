import React from 'react';
import { Layout, Row, Col } from 'antd';

const { Footer } = Layout;

const CustomFooter = () => {
  return (
    <Footer style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#001529', color: '#fff' }}>
      <Row justify="center">
        <Col span={24}>
          <h2 style={{ marginBottom: '10px' }}>My Awesome Website</h2>
          <p style={{ fontSize: '16px' }}>©2025 Created by Us</p>
          <p style={{ fontSize: '16px' }}> <a href="https://www.facebook.com/phonlawat.thaenthong" target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>Phonlawat Thaenthong </a></p>
          <p style={{ fontSize: '16px' }}> <a href="https://www.facebook.com/share/1DkJ2syH9q/" target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>Pawaris Phansatithwong </a></p>
          <p style={{ fontSize: '16px' }}> <a href="https://www.facebook.com/pongsaton.saefung.3#" target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>pongsaton.saefung </a></p>
        </Col>
      </Row>
    </Footer>
  );
};

export default CustomFooter;
