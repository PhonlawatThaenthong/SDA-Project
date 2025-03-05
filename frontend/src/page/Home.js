// src/page/Home.js
import React, { useContext, useEffect } from 'react';
import { Layout, Row, Col, Button, Typography, Card} from 'antd';
import { useNavigate } from 'react-router-dom'; // Add this import
import CustomHeader from '../component/Header';
import CustomFooter from '../component/Footer';
import '../component/home component/style.css';
import { AuthContext } from '../context/AuthContext';

const { Title, Paragraph } = Typography;

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate(); // Add this hook

  // Add this effect to redirect authenticated users to /home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home'); //อันนี้ redirect -> auth user จะ page ไหน
    }
  }, [isAuthenticated, navigate]);

  // Add this handler for the Get Started button
  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <Layout>
      <CustomHeader />
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <Title style={{ fontSize: '48px', fontWeight: 'bold', color: '#fff' }}>Welcome to My Awesome Storage Website</Title>
          <Paragraph style={{ fontSize: '20px', color: '#fff' }}>
            This is a Website.
          </Paragraph>
          <Button 
            type="primary" 
            size="large" 
            style={{ marginTop: '20px' }}
            onClick={handleGetStarted} // Add onClick handler
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ background: '#fff', padding: '50px 0' }}>
        <Row justify="center" gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card title="Load Balancer" bordered={false}>
              <p>ใช้ Load Balancer บน Cloud เพื่อลดภาระของเซิร์ฟเวอร์และกระจายโหลด</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Scheduler Snapshot" bordered={false}>
              <p>ตั้งค่าการสร้าง Snapshot อัตโนมัติตามช่วงเวลาที่กำหนด</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Backup" bordered={false}>
              <p>มีระบบสำรองข้อมูลอัตโนมัติตาม Schedule เพื่อลดความเสี่ยงจากข้อมูลสูญหาย</p>
            </Card>
          </Col>
        </Row>
      </div>
      <CustomFooter />
    </Layout>
  );
};

export default Home;