import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Card, 
  Typography, 
  Tag, 
  Divider, 
  Spin, 
  Empty, 
  message, 
  Layout, 
  Space, 
  Button, 
  Avatar, 
  Dropdown, 
  Menu,
  Tabs,
  Table,
  Progress,
  Statistic,
  Row,
  Col,
  Tooltip,
  List,
  Grid
} from 'antd';
import { 
  InfoCircleOutlined, 
  SettingOutlined, 
  ClockCircleOutlined, 
  UserOutlined, 
  DownOutlined,
  CloudOutlined,
  FileOutlined,
  DatabaseOutlined,
  CloudUploadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  ReloadOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  FolderOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { config } from '../config.js';

const { Title, Text } = Typography;
const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

function Logs() {
  const [logs, setLogs] = useState([]);
  const [groupedLogs, setGroupedLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [storageData, setStorageData] = useState([]);
  const [storageLoading, setStorageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('1');
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const navigate = useNavigate();
  const screens = useBreakpoint();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.username) {
      setUsername(user.username);
    }

    loadAuditLogs();
    loadStorageData();
  }, []);

  const loadAuditLogs = () => {
    setLoading(true);
    
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('กรุณาเข้าสู่ระบบ');
      setLoading(false);
      return;
    }
    
    axios.get(`${config.serverUrlPrefix}/logs`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setLogs(response.data);
        groupLogsByDate(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching logs:', error);
        message.error('ไม่สามารถโหลดข้อมูล log ได้');
        setLoading(false);
      });
  };

  const loadStorageData = () => {
    setStorageLoading(true);
    
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('กรุณาเข้าสู่ระบบ');
      setStorageLoading(false);
      return;
    }
    
    axios.get(`${config.serverUrlPrefix}/user/all-storage`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const formattedData = response.data.map((item, index) => ({
          ...item,
          key: item._id || item.userId || index.toString()
        }));
        
        setStorageData(formattedData);
        setStorageLoading(false);
      })
      .catch(error => {
        console.error('Error fetching storage data:', error);
        message.error('ไม่สามารถโหลดข้อมูลพื้นที่จัดเก็บได้');
        setStorageLoading(false);
      });
  };

  const navigateToMainPage = () => {
    navigate('/home');
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
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

  const groupLogsByDate = (logs) => {
    const grouped = logs.reduce((groups, log) => {
      const date = new Date(log.timestamp);
      const dateStr = formatDateHeader(date);
      
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      
      groups[dateStr].push(log);
      return groups;
    }, {});
    
    setGroupedLogs(grouped);
  };

  const formatDateHeader = (date) => {
    return new Date(date).toLocaleDateString('th-TH', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeColor = (type) => {
    if (!type) return 'default';
    
    const logType = type.toLowerCase();
    const typeMap = {
      'login': 'success',
      'logout': 'warning',
      'delete': 'error',
      'upload': 'processing',
      'remove-file': 'error',
      'update': 'processing',
      'create': 'purple',
      'permission': 'magenta',
      'settings': 'cyan',
      'error': 'error',
      'warning': 'warning'
    };
    
    return typeMap[logType] || 'default';
  };

  const getTypeIcon = (type) => {
    if (!type) return <InfoCircleOutlined />; 
    
    const logType = type.toLowerCase();
    const typeMap = {
      'login': <UserOutlined />,
      'logout': <UserOutlined />,
      'upload': <CloudUploadOutlined />,
      'remove-file': <FileOutlined />,
      'settings': <SettingOutlined />,
      'default': <InfoCircleOutlined />
    };
    
    return typeMap[logType] || typeMap.default;
  };

  const calculateStoragePercentage = (bytes) => {
    const storageLimit = 1 * 1024 * 1024 * 1024; 
    return Math.min(Math.round((bytes / storageLimit) * 100), 100);
  };

  const getProgressStatus = (percentage) => {
    if (percentage >= 90) return 'exception';
    if (percentage >= 70) return 'warning';
    return 'normal';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return '#ff4d4f';
    if (percentage >= 70) return '#faad14';
    return '#52c41a';
  };

  // Responsive columns for mobile
  const getStorageColumns = () => {
    const baseColumns = [
      {
        title: 'ผู้ใช้',
        dataIndex: 'username',
        key: 'username',
        render: (text) => <Text strong>{text}</Text>,
      },
      {
        title: 'จำนวนไฟล์',
        dataIndex: 'totalFiles',
        key: 'totalFiles',
        sorter: (a, b) => a.totalFiles - b.totalFiles,
        render: (files) => (
          <Tag color="blue" icon={<FileOutlined />}>
            {files} ไฟล์
          </Tag>
        ),
      },
      {
        title: 'ขนาดที่ใช้',
        dataIndex: 'totalSizeBytes',
        key: 'totalSize',
        sorter: (a, b) => a.totalSizeBytes - b.totalSizeBytes,
        render: (bytes) => <Text type="secondary">{formatFileSize(bytes)}</Text>,
      },
      {
        title: 'พื้นที่ใช้งาน',
        dataIndex: 'totalSizeBytes',
        key: 'storageUsage',
        sorter: (a, b) => a.totalSizeBytes - b.totalSizeBytes,
        render: (bytes) => {
          const percentage = calculateStoragePercentage(bytes);
          return (
            <Tooltip title={`${percentage}% จาก 1GB`}>
              <Progress 
                percent={percentage}
                size="small"
                status={getProgressStatus(percentage)}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': getProgressColor(percentage),
                }} 
              />
            </Tooltip>
          );
        },
      },
      {
        title: 'อัพโหลดล่าสุด',
        dataIndex: 'lastUpload',
        key: 'lastUpload',
        sorter: (a, b) => {
          if (!a.lastUpload) return 1;
          if (!b.lastUpload) return -1;
          return new Date(b.lastUpload) - new Date(a.lastUpload);
        },
        render: (date) => formatDate(date),
      },
    ];
    
    // For mobile and small screens, show fewer columns
    if (!screens.md) {
      return [
        baseColumns[0],
        baseColumns[1],
        baseColumns[2],
      ];
    }
    
    return baseColumns;
  };

  const totalFiles = storageData.reduce((sum, user) => sum + user.totalFiles, 0);
  const totalSize = storageData.reduce((sum, user) => sum + user.totalSizeBytes, 0);
  const activeUsers = storageData.length;
  const averageSize = activeUsers ? totalSize / activeUsers : 0;

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === '1') {
      loadAuditLogs();
    } else if (key === '2') {
      loadStorageData();
    }
  };

  const handleRefresh = () => {
    if (activeTab === '1') {
      loadAuditLogs();
    } else {
      loadStorageData();
    }
  };

  const renderAuditLogsTab = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Spin size="large" tip="กำลังโหลด Audit Logs..." />
        </div>
      );
    }
    
    if (logs.length === 0) {
      return (
        <Empty 
          description="ไม่พบข้อมูล Audit Logs" 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      );
    }
    
    return (
      <>
        {Object.keys(groupedLogs).map((dateGroup, index) => (
          <div 
            key={dateGroup} 
            style={{ 
              marginBottom: '16px', 
              padding: screens.md ? '20px' : '12px',
              background: '#f9f9f9',
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="date-divider">
              <Divider orientation={screens.md ? "left" : "center"} orientationMargin="0" 
                style={{ 
                  color: '#1890ff', 
                  borderColor: '#d9d9d9',
                  fontSize: screens.md ? '16px' : '14px',
                  fontWeight: 'bold'
                }}
              >
                <ClockCircleOutlined style={{ marginRight: '8px' }} />
                {dateGroup}
              </Divider>
            </div>
            
            <div style={{ marginTop: '16px' }}>
              {groupedLogs[dateGroup].map(log => (
                <Card 
                  key={log._id || `log-${Math.random()}`} 
                  style={{ 
                    background: '#ffffff', 
                    marginBottom: '10px', 
                    borderRadius: '4px',
                    border: '1px solid #f0f0f0'
                  }}
                  bodyStyle={{ padding: screens.md ? '12px' : '8px' }}
                  hoverable
                >
                  <div style={{ display: 'flex', flexDirection: screens.sm ? 'row' : 'column' }}>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Text strong style={{ color: '#262626', marginRight: '8px' }}>
                          {log.username || 'Unknown User'}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px', color: '#8c8c8c' }}>
                          {formatTime(log.timestamp)}
                        </Text>
                      </div>
                      
                      <div style={{ marginTop: '8px', display: 'flex', flexDirection: screens.sm ? 'row' : 'column', alignItems: screens.sm ? 'center' : 'flex-start' }}>
                        <Tag 
                          color={getTypeColor(log.type)} 
                          icon={getTypeIcon(log.type)}
                          style={{ marginRight: '8px', marginBottom: screens.sm ? 0 : '4px' }}
                        >
                          {log.type || 'Unknown'}
                        </Tag>
                        <Text style={{ color: '#595959' }}>
                          {log.message || `${log.username || 'User'} performed ${log.type ? `a ${log.type}` : 'an'} action`}
                        </Text>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  };

  const renderStorageUsageTab = () => {
    if (storageLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Spin size="large" tip="กำลังโหลดข้อมูลพื้นที่จัดเก็บ..." />
        </div>
      );
    }

    if (storageData.length === 0) {
      return (
        <Empty 
          description="ไม่พบข้อมูลพื้นที่จัดเก็บ" 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      );
    }

    return (
      <>
        {/* Storage statistics dashboard */}
        <Card 
          style={{ 
            marginBottom: '24px', 
            borderRadius: '8px',
            background: 'linear-gradient(145deg, #f0f2f5, #ffffff)'
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="จำนวนไฟล์ทั้งหมด"
                  value={totalFiles}
                  prefix={<FileOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="พื้นที่ใช้งานทั้งหมด"
                  value={formatFileSize(totalSize)}
                  prefix={<DatabaseOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="จำนวนผู้ใช้"
                  value={activeUsers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="ขนาดเฉลี่ยต่อผู้ใช้"
                  value={formatFileSize(averageSize)}
                  prefix={<BarChartOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Users storage usage table */}
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CloudOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              <span style={{ fontSize: screens.md ? '16px' : '14px' }}>การใช้พื้นที่จัดเก็บของผู้ใช้งาน</span>
            </div>
          }
          extra={
            <Tooltip title="ผู้ใช้แต่ละคนมีพื้นที่จัดเก็บ 1GB">
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          }
          style={{ borderRadius: '8px' }}
        >
          <div style={{ overflowX: 'auto' }}>
            <Table 
              dataSource={storageData}
              columns={getStorageColumns()}
              pagination={{ 
                pageSize: screens.md ? 10 : 5,
                size: screens.md ? 'default' : 'small'
              }}
              rowKey="key"
              size={screens.md ? 'default' : 'small'}
            />
          </div>
        </Card>

        {/* Top users by storage usage - Only show if we have data */}
        {storageData.length > 0 && (
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <PieChartOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                <span style={{ fontSize: screens.md ? '16px' : '14px' }}>ผู้ใช้ที่ใช้พื้นที่มากที่สุด</span>
              </div>
            }
            style={{ marginTop: '24px', borderRadius: '8px' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={[...storageData].sort((a, b) => b.totalSizeBytes - a.totalSizeBytes).slice(0, 3)}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          backgroundColor: index === 0 ? '#f56a00' : index === 1 ? '#7265e6' : '#ffbf00',
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}
                      >
                        {index + 1}
                      </Avatar>
                    }
                    title={<Text strong>{item.username}</Text>}
                    description={
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: screens.md ? 'row' : 'column', 
                        alignItems: screens.md ? 'center' : 'flex-start', 
                        gap: 8 
                      }}>
                        <Tag color="blue">{formatFileSize(item.totalSizeBytes)}</Tag>
                        <Text type="secondary">{item.totalFiles} ไฟล์</Text>
                        <Progress 
                          percent={calculateStoragePercentage(item.totalSizeBytes)} 
                          size="small" 
                          style={{ width: screens.md ? 120 : '100%', marginTop: screens.md ? 0 : 4 }}
                          strokeColor={getProgressColor(calculateStoragePercentage(item.totalSizeBytes))}
                        />
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}
      </>
    );
  };

  // Responsive mobile menu button and dropdown
  const renderMobileMenu = () => {
    if (screens.md) return null;
    
    return (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="home" onClick={navigateToMainPage}>
              <HomeOutlined /> หน้าหลัก
            </Menu.Item>
            <Menu.Item key="refresh" onClick={handleRefresh}>
              <ReloadOutlined /> รีเฟรช
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="settings">
              <SettingOutlined /> ตั้งค่า
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout}>
              <UserOutlined /> ออกจากระบบ
            </Menu.Item>
          </Menu>
        }
        trigger={['click']}
        visible={mobileMenuVisible}
        onVisibleChange={setMobileMenuVisible}
      >
        <Button 
          type="text" 
          icon={<MenuOutlined />} 
          size="large"
          style={{ color: '#1890ff' }}
        />
      </Dropdown>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Responsive Header */}
      <Header style={{ 
        background: '#fff', 
        padding: '0 16px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {screens.md && (
            <Tooltip title="กลับไปยังหน้าหลัก">
              <Button 
                type="primary" 
                shape="circle" 
                icon={<ArrowLeftOutlined />} 
                onClick={navigateToMainPage}
                style={{ 
                  marginRight: '16px',
                  background: 'linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)',
                  border: 'none'
                }} 
              />
            </Tooltip>
          )}
          <Title level={screens.md ? 4 : 5} style={{ margin: 0, color: '#1890ff' }}>
            {activeTab === '1' ? 'Audit Log Monitor' : 'Storage Usage Monitor'}
          </Title>
        </div>
        
        <Space size={screens.md ? "middle" : "small"}>
          {screens.md ? (
            <>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleRefresh}
                loading={activeTab === '1' ? loading : storageLoading}
              >
                รีเฟรช
              </Button>
              
              <Dropdown overlay={userMenu} trigger={['click']}>
                <Button type="text" style={{ height: '40px' }}>
                  <Space>
                    <Avatar 
                      icon={<UserOutlined />} 
                      style={{ backgroundColor: '#1890ff' }}
                    />
                    <span>{username || 'ผู้ใช้'}</span>
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </>
          ) : renderMobileMenu()}
        </Space>
      </Header>
      
      <Content style={{ margin: screens.md ? '16px' : '8px' }}>
        <Card 
          style={{ 
            background: '#ffffff', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
          bodyStyle={{ padding: screens.md ? '16px' : '12px' }}
        >
          <Tabs 
            activeKey={activeTab} 
            onChange={handleTabChange}
            size={screens.md ? "large" : "default"}
            tabBarStyle={{ marginBottom: screens.md ? 24 : 16 }}
            tabBarGutter={screens.md ? 24 : 12}
            centered={!screens.md}
          >
            <TabPane 
              tab={
                <span>
                  <InfoCircleOutlined />
                  {screens.sm && " Audit Logs"}
                </span>
              } 
              key="1"
            >
              {renderAuditLogsTab()}
            </TabPane>
            <TabPane 
              tab={
                <span>
                  <CloudUploadOutlined />
                  {screens.sm && " Storage Usage"}
                </span>
              } 
              key="2"
            >
              {renderStorageUsageTab()}
            </TabPane>
          </Tabs>
        </Card>
      </Content>
    </Layout>
  );
}

export default Logs;