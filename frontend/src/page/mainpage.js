import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Progress, Dropdown, Space, Typography, Tooltip, Input } from 'antd';
import { 
  UploadOutlined, 
  UserOutlined, 
  DownOutlined,
  HomeOutlined,
  StarOutlined,
  DeleteOutlined,
  CloudOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import FileList from '../component/FileList';
import FavoritesList from '../component/FavoritesList';
import TrashList from '../component/TrashList';
import UploadModal from '../component/UploadModal';
import UserProfileModal from '../component/UserProfileModal';
const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { Search } = Input;

const MainPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isUserProfileVisible, setIsUserProfileVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState('files'); // เพิ่มตัวแปร state สำหรับติดตามหน้าปัจจุบัน
  
  // อัตราการใช้พื้นที่เก็บข้อมูล (ตัวอย่าง)
  const storageUsed = 45; // เปอร์เซ็นต์ที่ใช้ไป
  
  const showUploadModal = () => {
    setIsUploadModalVisible(true);
  };
  
  const handleUploadCancel = () => {
    setIsUploadModalVisible(false);
  };
  
  const showUserProfile = () => {
    setIsUserProfileVisible(true);
  };
  
  const handleUserProfileCancel = () => {
    setIsUserProfileVisible(false);
  };
  
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={showUserProfile}>
        ข้อมูลของฉัน
      </Menu.Item>
      <Menu.Item key="settings">
        ตั้งค่า
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        ออกจากระบบ
      </Menu.Item>
    </Menu>
  );

  // เซกชั่นแสดงข้อมูลพื้นที่เก็บข้อมูล
  const StorageSection = () => (
    <div style={{ padding: '16px', borderRadius: '8px', background: '#f5f5f5', marginTop: '16px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong>พื้นที่เก็บข้อมูล</Text>
        </div>
        
        <Progress percent={storageUsed} size="small" strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {storageUsed}% ใช้งานแล้ว
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            45GB / 100GB
          </Text>
        </div>
      </Space>
    </div>
  );

  // แสดงคอมโพเนนต์ตามหน้าที่เลือก
  const renderContent = () => {
    switch(currentPage) {
      case 'files':
        return <FileList />;
      case 'favorites':
        return <FavoritesList />;
      case 'shared':
        return <div>พื้นที่ใช้งานร่วม</div>; // ยังไม่มีคอมโพเนนต์ เลยใส่ placeholder ไว้ก่อน
      case 'trash':
        return <TrashList />;
      default:
        return <FileList />;
    }
  };

  // ฟังก์ชันจัดการการเปลี่ยนหน้า
  const handleMenuSelect = (e) => {
    setCurrentPage(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="light"
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)' }}
      >
        <div style={{ 
          height: 48, 
          margin: '16px 16px', 
          background: 'linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)', 
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CloudOutlined style={{ fontSize: '24px', color: 'white' }} />
          {!collapsed && <span style={{ color: 'white', marginLeft: '8px', fontWeight: 'bold' }}>TH Cloud</span>}
        </div>
        
        <Menu 
          theme="light" 
          selectedKeys={[currentPage]} 
          mode="inline"
          onClick={handleMenuSelect}
        >
          <Menu.Item key="files" icon={<HomeOutlined />}>
            ไฟล์ของฉัน
          </Menu.Item>
          <Menu.Item key="favorites" icon={<StarOutlined />}>
            รายการโปรด
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="shared" icon={<CloudOutlined />}>
            พื้นที่ใช้งานร่วม
          </Menu.Item>
          <Menu.Item key="trash" icon={<DeleteOutlined />}>
            ถังขยะ
          </Menu.Item>
        </Menu>
        
        {!collapsed && <StorageSection />}
      </Sider>
      
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
        }}>
          <Search
            placeholder="ค้นหาไฟล์หรือโฟลเดอร์"
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            style={{ width: '400px' }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          
          <Space size="middle">
            <Button 
              type="primary" 
              icon={<UploadOutlined />} 
              onClick={showUploadModal}
              style={{ 
                background: 'linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)',
                border: 'none'
              }}
            >
              อัพโหลด
            </Button>
            
            <Dropdown overlay={userMenu} trigger={['click']}>
              <Button type="text" style={{ height: '40px' }}>
                <Space>
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ backgroundColor: '#1890ff' }}
                  />
                  {!collapsed && <span>สมชาย ใจดี</span>}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ margin: '16px' }}>
          <div style={{ 
            padding: 24, 
            background: '#fff', 
            minHeight: 360,
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            {renderContent()} {/* แสดงคอมโพเนนต์ตามหน้าที่เลือก */}
          </div>
        </Content>
      </Layout>
      
      <UploadModal 
        visible={isUploadModalVisible} 
        onCancel={handleUploadCancel} 
      />
      
      <UserProfileModal 
        visible={isUserProfileVisible}
        onCancel={handleUserProfileCancel}
      />
    </Layout>
  );
};

export default MainPage;