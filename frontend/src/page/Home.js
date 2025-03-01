// src/page/Home.js
import React, { useContext } from 'react';
import { Layout, Row, Col, Button, Typography, Card, message } from 'antd';
import CustomHeader from '../component/Header';
import CustomFooter from '../component/Footer';
import '../component/home component/style.css';
import { AuthContext } from '../context/AuthContext';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <Layout>
      <CustomHeader />
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <Title style={{ fontSize: '48px', fontWeight: 'bold', color: '#fff' }}>Welcome to My Awesome Website</Title>
          <Paragraph style={{ fontSize: '20px', color: '#fff' }}>
            This is a place to show your awesome product or service.
          </Paragraph>
          <Button type="primary" size="large" style={{ marginTop: '20px' }}>Get Started</Button>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ background: '#fff', padding: '50px 0' }}>
        <Row justify="center" gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card title="Feature 1" bordered={false}>
              <p>Details about Feature 1.</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Feature 2" bordered={false}>
              <p>Details about Feature 2.</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Feature 3" bordered={false}>
              <p>Details about Feature 3.</p>
            </Card>
          </Col>
        </Row>
      </div>
      <CustomFooter />
    </Layout>
  );
};

export default Home;