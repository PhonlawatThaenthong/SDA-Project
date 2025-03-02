import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Button, Avatar, Progress, Dropdown, Space, Typography, Tooltip, Input } from 'antd';
import { 
  UploadOutlined, 
  UserOutlined, 
  DownOutlined,
  HomeOutlined,
  CloudOutlined,
  SearchOutlined,
  WarningOutlined
} from '@ant-design/icons';
import FileList from '../component/FileList';
import UploadModal from '../component/UploadModal';
import UserProfileModal from '../component/UserProfileModal';
import { StorageContext } from '../context/StorageContext';
import { config } from '../config.js';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { Search } = Input;

const MainPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isUserProfileVisible, setIsUserProfileVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState('files');
  const [username, setUsername] = useState('');

  // Get storage data from context
  const { storageData, error, refreshStorage } = useContext(StorageContext);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.username) {
      setUsername(user.username);
    }
    
    // Refresh storage data when the component mounts
    refreshStorage();
  }, [refreshStorage]);

  const showUploadModal = () => {
    setIsUploadModalVisible(true);
  };
  
  const handleUploadCancel = () => {
    setIsUploadModalVisible(false);
    // Refresh storage data after closing upload modal
    refreshStorage();
  };
  
  const handleUserProfileCancel = () => {
    setIsUserProfileVisible(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      // Log logout action
      await fetch(`${config.serverUrlPrefix}/logs-logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "User logged out",
          level: "info"
        })
      });
    } catch (error) {
      console.error("Error logging logout:", error);
    }
    
    // ล้างข้อมูลทั้งหมดจาก localStorage
    localStorage.clear();

    // รีเฟรชหน้า
    window.location.reload();
  };
  
  const userMenu = (
    <Menu>
      <Menu.Item key="settings">
        ตั้งค่า
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        ออกจากระบบ
      </Menu.Item>
    </Menu>
  );

  // เซกชั่นแสดงข้อมูลพื้นที่เก็บข้อมูล
  const StorageSection = () => {
    // ถ้ามี error ให้แสดงค่าเริ่มต้น ไม่แสดงข้อความ error
    if (error) {
      console.error("Storage error:", error);
    }
    
    // ถ้ากำลังโหลดข้อมูล แสดงข้อมูลที่มีอยู่ ไม่แสดงข้อความกำลังโหลด
    
    // Convert storage data to display format
    const storageUsed = storageData.storagePercentage || 0;
    const isStorageNearlyFull = storageUsed > 80;
    const usedGB = (storageData.totalSizeInGB || 0).toFixed(2);
    const totalGB = storageData.storageLimit || 1; // ใช้ค่าเริ่มต้น 1GB
    
    return (
      <div style={{ padding: '16px', borderRadius: '8px', background: '#f5f5f5', marginTop: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>พื้นที่เก็บข้อมูล</Text>
            {isStorageNearlyFull && (
              <Tooltip title="พื้นที่เก็บข้อมูลเกือบเต็มแล้ว">
                <WarningOutlined style={{ color: '#faad14' }} />
              </Tooltip>
            )}
          </div>
          
          <Progress 
            percent={storageUsed} 
            size="small" 
            status={storageUsed >= 100 ? "exception" : "normal"}
            strokeColor={{
              '0%': '#108ee9',
              '100%': storageUsed >= 90 ? '#ff4d4f' : '#87d068',
            }} 
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {storageUsed.toFixed(1)}% ใช้งานแล้ว
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {usedGB}GB / {totalGB}GB
            </Text>
          </div>
        </Space>
      </div>
    );
  };

  // แสดงคอมโพเนนต์ตามหน้าที่เลือก
  const renderContent = () => {
    switch(currentPage) {
      case 'files':
        return <FileList onFileChange={refreshStorage} />;
      default:
        return <FileList onFileChange={refreshStorage} />;
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
              // Disable upload button if storage is full
              disabled={storageData.storagePercentage >= 100}
              title={storageData.storagePercentage >= 100 ? "พื้นที่เก็บข้อมูลเต็มแล้ว" : "อัพโหลดไฟล์"}
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
                  {!collapsed && <span>{username || 'ผู้ใช้'}</span>}
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
            {renderContent()}
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