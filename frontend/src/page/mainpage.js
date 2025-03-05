import React, { useState, useEffect, useContext, useRef } from 'react';
import { Layout, Menu, Button, Avatar, Progress, Dropdown, Space, Typography, Tooltip, Input, Drawer } from 'antd';
import { 
  UploadOutlined, 
  UserOutlined, 
  DownOutlined,
  HomeOutlined,
  CloudOutlined,
  SearchOutlined,
  WarningOutlined,
  AreaChartOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import FileList from '../component/FileList';
import UploadModal from '../component/UploadModal';
import { StorageContext } from '../context/StorageContext';
import { config } from '../config.js';
import { useMediaQuery } from 'react-responsive';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { Search } = Input;

// Modern theme colors
const themeColors = {
  primary: '#4361ee', // Modern blue
  secondary: '#3a0ca3', // Deep purple
  accent: '#4cc9f0', // Bright cyan
  gradient: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
  gradientAccent: 'linear-gradient(135deg, #4cc9f0 0%, #4361ee 100%)',
  siderBg: '#f8f9fa', // Light gray background
  headerBg: '#FFFFFF',
  contentBg: '#f8f9fa',
  warningColor: '#ff9800', // Orange
  dangerColor: '#f44336', // Red
  successColor: '#4caf50', // Green
  textPrimary: '#212529',
  boxShadow: '0 4px 12px rgba(67, 97, 238, 0.15)'
};

const MainPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState('files');
  const [username, setUsername] = useState('');
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const searchInputRef = useRef(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const navigate = useNavigate();

  // Responsive breakpoints using react-responsive
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  // Get storage data from context
  const { storageData, error, refreshStorage } = useContext(StorageContext);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.username) {
      setUsername(user.username);
    }

    // Automatically collapse sidebar on mobile
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  const showUploadModal = () => {
    setIsUploadModalVisible(true);
  };
  
  const handleUploadCancel = () => {
    setIsUploadModalVisible(false);
    // Refresh storage data after closing upload modal
    refreshStorage();
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
    
    localStorage.clear();
    window.location.reload();
  };
  
  const userMenu = (
    <Menu style={{ 
      borderRadius: '12px', 
      boxShadow: themeColors.boxShadow,
      padding: '8px',
      border: '1px solid rgba(67, 97, 238, 0.1)'
    }}>
      <Menu.Item key="settings" style={{ borderRadius: '8px' }}>
        ตั้งค่า
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout} style={{ borderRadius: '8px' }}>
        ออกจากระบบ
      </Menu.Item>
    </Menu>
  );

  // ฟังก์ชันนำทางไปยังหน้า Logs
  const navigateToLogs = () => {
    navigate('/logs');
    if (isMobile) {
      setMobileDrawerVisible(false);
    }
  };

  const handleMenuSelect = (e) => {
    setCurrentPage(e.key);
    if (isMobile) {
      setMobileDrawerVisible(false);
    }
  };

  const toggleMobileSearch = () => {
    setSearchExpanded(!searchExpanded);
    if (!searchExpanded) {
      // Focus on search input when expanded
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  // เซกชั่นแสดงข้อมูลพื้นที่เก็บข้อมูล
  const StorageSection = () => {
    if (error) {
      console.error("Storage error:", error);
    }
    
    const storageUsed = storageData.storagePercentage || 0;
    const isStorageNearlyFull = storageUsed > 80;
    const usedGB = (storageData.totalSizeInGB || 0).toFixed(2);
    const totalGB = storageData.storageLimit || 1;
    
    const getProgressColor = (percentage) => {
      if (percentage > 90) return themeColors.dangerColor;
      if (percentage > 70) return themeColors.warningColor;
      return themeColors.primary;
    };
    
    return (
      <div style={{ 
        padding: '16px', 
        borderRadius: '16px', 
        background: '#ffffff', 
        marginTop: '20px',
        boxShadow: '0 2px 8px rgba(67, 97, 238, 0.1)',
        border: '1px solid rgba(67, 97, 238, 0.05)',
        backgroundImage: 'radial-gradient(rgba(67, 97, 238, 0.03) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong style={{ fontSize: '14px', color: themeColors.textPrimary }}>พื้นที่เก็บข้อมูล</Text>
            <div>
              {isStorageNearlyFull && (
                <Tooltip title="พื้นที่เก็บข้อมูลเกือบเต็มแล้ว">
                  <WarningOutlined style={{ color: themeColors.warningColor }} />
                </Tooltip>
              )}
            </div>
          </div>
          
          <Progress 
            percent={storageUsed} 
            size="small" 
            status={storageUsed >= 100 ? "exception" : "normal"}
            strokeColor={{
              '0%': themeColors.primary,
              '100%': getProgressColor(storageUsed),
            }}
            trailColor="rgba(67, 97, 238, 0.1)"
            style={{ height: '8px' }}
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
    return <FileList onFileChange={refreshStorage} />;
  };

  const sideMenuContent = (
    <>
      <div style={{ 
        height: 48, 
        margin: '16px 16px', 
        background: themeColors.gradient, 
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(67, 97, 238, 0.3)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at top right, rgba(76, 201, 240, 0.3), transparent 70%), radial-gradient(circle at bottom left, rgba(58, 12, 163, 0.3), transparent 70%)',
          zIndex: 1
        }}></div>
        <CloudOutlined style={{ fontSize: '24px', color: 'white', zIndex: 2 }} />
        {(!collapsed || isMobile) && <span style={{ 
          color: 'white', 
          marginLeft: '8px', 
          fontWeight: 'bold', 
          letterSpacing: '0.5px',
          fontFamily: "'Kanit', sans-serif",
          zIndex: 2
        }}>TH Cloud</span>}
      </div>
      
      <Menu 
        theme="light" 
        selectedKeys={[currentPage]} 
        mode="inline"
        onClick={handleMenuSelect}
        style={{ 
          background: 'transparent', 
          borderRight: 'none',
          fontFamily: "'Kanit', sans-serif"
        }}
      >
        <Menu.Item 
          key="files" 
          icon={<HomeOutlined style={{ color: currentPage === 'files' ? themeColors.primary : undefined }} />}
          style={{ 
            margin: '4px 8px',
            borderRadius: '8px',
            color: currentPage === 'files' ? themeColors.primary : undefined,
            fontWeight: currentPage === 'files' ? 500 : 400,
            transition: 'all 0.3s ease'
          }}
        >
          ไฟล์ของฉัน
        </Menu.Item>
        <Menu.Item 
          key="logs" 
          icon={<AreaChartOutlined style={{ color: currentPage === 'logs' ? themeColors.primary : undefined }} />} 
          onClick={navigateToLogs}
          style={{ 
            margin: '4px 8px',
            borderRadius: '8px',
            color: currentPage === 'logs' ? themeColors.primary : undefined,
            fontWeight: currentPage === 'logs' ? 500 : 400,
            transition: 'all 0.3s ease'
          }}
        >
          ประวัติการใช้งาน
        </Menu.Item>
      </Menu>
      
      {(!collapsed || isMobile) && <StorageSection />}
    </>
  );

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      background: themeColors.contentBg,
      width: '100%',
      maxWidth: '100vw',
      overflow: 'hidden'
    }}>
      {/* Sidebar for tablet and desktop */}
      {!isMobile && (
        <Sider 
          collapsible 
          collapsed={collapsed} 
          onCollapse={setCollapsed}
          theme="light"
          style={{ 
            boxShadow: themeColors.boxShadow, 
            background: themeColors.siderBg,
            borderRight: 'none',
            position: 'relative',
            zIndex: 10,
            backgroundImage: 'linear-gradient(180deg, rgba(67, 97, 238, 0.03) 0%, rgba(67, 97, 238, 0.01) 100%)',
          }}
          width={240}
        >
          {sideMenuContent}
        </Sider>
      )}
      
      {/* Mobile Drawer for side menu */}
      {isMobile && (
        <Drawer
          placement="left"
          closable={true}
          onClose={() => setMobileDrawerVisible(false)}
          open={mobileDrawerVisible}
          width="80%"
          bodyStyle={{ padding: 0, background: themeColors.siderBg }}
          className="mobile-drawer"
        >
          {sideMenuContent}
        </Drawer>
      )}
      
      <Layout style={{ 
        background: themeColors.contentBg,
        width: '100%'
      }}>
        <Header style={{ 
          background: themeColors.headerBg, 
          padding: '0 8px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 1px 8px rgba(67, 97, 238, 0.1)',
          height: isMobile ? '56px' : '64px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderBottom: '1px solid rgba(67, 97, 238, 0.05)',
          width: '100%'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            width: isMobile ? 'auto' : '400px',
          }}>
            {/* Mobile menu button */}
            {isMobile && (
              <Button 
                type="text" 
                icon={<MenuOutlined />} 
                onClick={() => setMobileDrawerVisible(true)}
                style={{ marginRight: '4px', padding: '0 8px' }}
                size="small"
              />
            )}
            
            {/* Desktop/Tablet search */}
            {!isMobile && !searchExpanded && (
              <Search
                placeholder="ค้นหาไฟล์หรือโฟลเดอร์"
                allowClear
                enterButton={<SearchOutlined />}
                size="middle"
                style={{ 
                  width: isTablet ? '200px' : '320px',
                  borderRadius: '12px'
                }}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            )}
            
            {/* Mobile search button & expanded search */}
            {isMobile && (
              <>
                {!searchExpanded ? (
                  <Button 
                    type="text" 
                    icon={<SearchOutlined />} 
                    onClick={toggleMobileSearch}
                    size="small"
                    style={{ padding: '0 8px' }}
                  />
                ) : (
                  <Search
                    placeholder="ค้นหา"
                    allowClear
                    size="small"
                    style={{ 
                      width: 'calc(100vw - 140px)',
                      borderRadius: '12px'
                    }}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    onBlur={() => {
                      if (!searchText) {
                        setSearchExpanded(false);
                      }
                    }}
                    ref={searchInputRef}
                  />
                )}
              </>
            )}
          </div>
          
          <Space size={isMobile ? "small" : "middle"} style={{ marginLeft: 'auto' }}>
            <Button 
              type="primary" 
              icon={<UploadOutlined />} 
              onClick={showUploadModal}
              style={{ 
                background: themeColors.gradient,
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(67, 97, 238, 0.2)',
                height: isMobile ? '32px' : '40px',
                position: 'relative',
                overflow: 'hidden',
                padding: isMobile ? '0 4px' : undefined,
                minWidth: isMobile ? '32px' : 'auto'
              }}
              disabled={storageData.storagePercentage >= 100}
              title={storageData.storagePercentage >= 100 ? "พื้นที่เก็บข้อมูลเต็มแล้ว" : "อัพโหลดไฟล์"}
              size={isMobile ? "small" : "middle"}
            >
              {!isMobile && (
                <span style={{ 
                  position: 'relative', 
                  zIndex: 2,
                  padding: '0 4px'
                }}>อัพโหลด</span>
              )}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)',
                zIndex: 1
              }}></div>
            </Button>
            
            <Dropdown overlay={userMenu} trigger={['click']}>
              <Button 
                type="text" 
                style={{ 
                  height: isMobile ? '32px' : '40px',
                  borderRadius: '12px',
                  padding: isMobile ? '0 4px' : '4px 12px',
                  background: 'rgba(67, 97, 238, 0.05)',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(67, 97, 238, 0.1)',
                  minWidth: isMobile ? '32px' : 'auto'
                }}
                size={isMobile ? "small" : "middle"}
              >
                <Space size={isMobile ? "small" : "middle"}>
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ 
                      backgroundColor: themeColors.primary,
                      boxShadow: '0 2px 6px rgba(67, 97, 238, 0.3)'
                    }}
                    size={isMobile ? 'small' : 'default'}
                  />
                  {!isMobile && (
                    <span style={{ color: themeColors.textPrimary, fontFamily: "'Kanit', sans-serif" }}>
                      {username || 'ผู้ใช้'}
                    </span>
                  )}
                  <DownOutlined style={{ fontSize: isMobile ? '10px' : '12px' }} />
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ 
  margin: isMobile ? '0' : '24px',
  padding: isMobile ? '0' : undefined,
  fontFamily: "'Kanit', sans-serif",
  overflowX: 'hidden'  // เพิ่ม property นี้
}}>
  <div style={{ 
    padding: isMobile ? 8 : 24,
    background: '#fff', 
    minHeight: isMobile ? 'calc(100vh - 56px)' : 360,
    borderRadius: isMobile ? 0 : '16px',
    boxShadow: isMobile ? 'none' : '0 4px 20px rgba(67, 97, 238, 0.1)',
    border: isMobile ? 'none' : '1px solid rgba(67, 97, 238, 0.05)',
    backgroundImage: 'radial-gradient(rgba(67, 97, 238, 0.02) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    position: 'relative',
    width: '100%',
    margin: 0,
    overflowX: 'hidden'  // เพิ่ม property นี้
  }}>
    <div style={{
      position: 'relative', 
      zIndex: 1, 
      width: '100%',
      overflowX: 'auto'  // เปลี่ยนเป็น auto เพื่อให้มี scrollbar เมื่อจำเป็น
    }}>
      {renderContent()}
    </div>
  </div>
</Content>
      </Layout>
      
      <UploadModal 
        visible={isUploadModalVisible} 
        onCancel={handleUploadCancel} 
      />
    </Layout>
  );
};

export default MainPage;