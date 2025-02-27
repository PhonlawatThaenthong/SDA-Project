import React from 'react';
import { Modal, Avatar, Typography, Descriptions, Button, Divider, Space, Tag } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined,
  CloudOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const UserProfileModal = ({ visible, onCancel }) => {
  // ข้อมูลผู้ใช้ตัวอย่าง (ในโปรเจคจริงจะรับมาจาก API)
  const userData = {
    name: 'สมชาย ใจดี',
    email: 'somchai@example.com',
    phone: '086-123-4567',
    position: 'ผู้จัดการฝ่ายไอที',
    storageUsed: 45,
    totalStorage: 100,
    memberSince: '01/01/2024',
    plan: 'Professional',
  };
  
  return (
    <Modal
      title="ข้อมูลผู้ใช้"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          ปิด
        </Button>,
        <Button key="settings" icon={<SettingOutlined />} type="default">
          ตั้งค่าบัญชี
        </Button>,
      ]}
      width={500}
    >
      <div style={{ textAlign: 'center', margin: '16px 0' }}>
        <Avatar size={80} icon={<UserOutlined />} />
        <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
          {userData.name}
        </Title>
        <Text type="secondary">{userData.position}</Text>
        <div style={{ margin: '16px 0' }}>
          <Tag color="blue">{userData.plan}</Tag>
        </div>
      </div>
      
      <Divider />
      
      <Descriptions layout="vertical" column={1}>
        <Descriptions.Item label={<Space><MailOutlined /> อีเมล</Space>}>
          {userData.email}
        </Descriptions.Item>
        <Descriptions.Item label={<Space><PhoneOutlined /> เบอร์โทรศัพท์</Space>}>
          {userData.phone}
        </Descriptions.Item>
        <Descriptions.Item label={<Space><CloudOutlined /> พื้นที่เก็บข้อมูล</Space>}>
          <div>
            <Text>{userData.storageUsed} GB จาก {userData.totalStorage} GB</Text>
            <div style={{ 
              width: '100%', 
              height: 8, 
              backgroundColor: '#f0f0f0', 
              borderRadius: 4,
              marginTop: 8 
            }}>
              <div style={{ 
                width: `${(userData.storageUsed / userData.totalStorage) * 100}%`, 
                height: '100%', 
                backgroundColor: '#1890ff', 
                borderRadius: 4 
              }} />
            </div>
          </div>
        </Descriptions.Item>
      </Descriptions>
      
      <Divider dashed />
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text type="secondary">เป็นสมาชิกตั้งแต่</Text>
        <Text>{userData.memberSince}</Text>
      </div>
    </Modal>
  );
};

export default UserProfileModal;