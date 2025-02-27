import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Typography, 
  Form, 
  Input, 
  Button, 
  Avatar, 
  Upload, 
  Card, 
  message, 
  Divider, 
  Space 
} from 'antd';
import { 
  UserOutlined, 
  UploadOutlined, 
  SaveOutlined, 
  ArrowLeftOutlined,
  MailOutlined,
  PhoneOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;

const UserSettingPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  // ข้อมูลผู้ใช้ตัวอย่าง (ในโปรเจคจริงจะรับมาจาก API)
  const userData = {
    name: 'สมชาย ใจดี',
    email: 'somchai@example.com',
    phone: '086-123-4567',
    position: 'ผู้จัดการฝ่ายไอที',
  };

  useEffect(() => {
    // กำหนดค่าเริ่มต้นให้กับฟอร์ม
    form.setFieldsValue({
      name: userData.name,
      phone: userData.phone,
    });
  }, [form]);

  const handleSubmit = (values) => {
    setLoading(true);

    // จำลองการบันทึกข้อมูล (ในโปรเจคจริงจะต้องส่งข้อมูลไป API)
    setTimeout(() => {
      setLoading(false);
      message.success('บันทึกข้อมูลเรียบร้อยแล้ว');
    }, 1000);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  // ฟังก์ชันจัดการการอัพโหลดรูปภาพ
  const handleAvatarChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // ในโปรเจคจริง ตรงนี้จะได้ URL จาก response ของ API
      // แต่ในตัวอย่างนี้ เราใช้ URL.createObjectURL เพื่อแสดงรูปภาพทันที
      const url = URL.createObjectURL(info.file.originFileObj);
      setAvatar(url);
      message.success('อัพโหลดรูปภาพสำเร็จ');
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} อัพโหลดไม่สำเร็จ`);
    }
  };

  // กำหนดการอัปโหลดรูปภาพ
  const uploadProps = {
    name: 'avatar',
    showUploadList: false,
    customRequest: ({ file, onSuccess }) => {
      // จำลองการอัพโหลด (ในโปรเจคจริงจะต้องส่งไฟล์ไป API)
      setTimeout(() => {
        onSuccess('ok');
      }, 500);
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น');
      }
      const isLessThan2M = file.size / 1024 / 1024 < 2;
      if (!isLessThan2M) {
        message.error('รูปภาพต้องมีขนาดไม่เกิน 2MB');
      }
      return isImage && isLessThan2M;
    },
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ margin: '24px 16px' }}>
        <Card 
          style={{ 
            width: '100%', 
            maxWidth: 800, 
            margin: '0 auto',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
          title={
            <Space>
              <Button 
                icon={<ArrowLeftOutlined />} 
                type="text" 
                onClick={handleGoBack}
              />
              <Title level={4} style={{ margin: 0 }}>ตั้งค่าบัญชี</Title>
            </Space>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '24px 0' }}>
            <Avatar 
              size={120} 
              icon={<UserOutlined />} 
              src={avatar}
              style={{ marginBottom: 16 }}
            />
            
            <Upload {...uploadProps} onChange={handleAvatarChange}>
              <Button icon={<UploadOutlined />}>เปลี่ยนรูปโปรไฟล์</Button>
            </Upload>
            
            <Text type="secondary" style={{ marginTop: 8 }}>
              รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 2MB
            </Text>
          </div>

          <Divider />
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              name: userData.name,
              phone: userData.phone
            }}
          >
            <Form.Item
              label="อีเมล"
              name="email"
            >
              <Input 
                prefix={<MailOutlined />} 
                disabled 
                defaultValue={userData.email}
              />
            </Form.Item>
            
            <Form.Item
              label="ชื่อ-นามสกุล"
              name="name"
              rules={[{ required: true, message: 'กรุณากรอกชื่อ-นามสกุล' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="กรอกชื่อ-นามสกุล" />
            </Form.Item>
            
            <Form.Item
              label="เบอร์โทรศัพท์"
              name="phone"
              rules={[
                { required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' },
                { pattern: /^[0-9-]{10,13}$/, message: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง' }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="กรอกเบอร์โทรศัพท์" 
              />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />} 
                loading={loading}
                block
                style={{ 
                  background: 'linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)',
                  border: 'none',
                  marginTop: 16
                }}
              >
                บันทึกข้อมูล
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default UserSettingPage;