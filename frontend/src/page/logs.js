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
  List
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
  FolderOutlined
} from '@ant-design/icons';
import { config } from '../config.js';

const { Title, Text } = Typography;
const { Header, Content } = Layout;
const { TabPane } = Tabs;

function Logs() {
  const [logs, setLogs] = useState([]);
  const [groupedLogs, setGroupedLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [storageData, setStorageData] = useState([]);
  const [storageLoading, setStorageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('1');
  const navigate = useNavigate();

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก localStorage (เหมือนใน mainpage.js)
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.username) {
      setUsername(user.username);
    }

    // Fetch logs from the backend
    loadAuditLogs();
    
    // Fetch storage data 
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
    
    // เรียกใช้ API endpoint จริงที่ได้เพิ่มไปใน server.js
    axios.get(`${config.serverUrlPrefix}/user/all-storage`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
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

  // ฟังก์ชันนำทางกลับไปยังหน้าหลัก
  const navigateToMainPage = () => {
    navigate('/home');
  };

  // ฟังก์ชันจัดการออกจากระบบ เหมือนใน mainpage.js
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

  // เมนูผู้ใช้ เหมือนใน mainpage.js
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

  // Function to group logs by date
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

  // Format date for header display
  const formatDateHeader = (date) => {
    return new Date(date).toLocaleDateString('th-TH', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format time to display hour:minute
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get tag color based on log type
  const getTypeColor = (type) => {
    if (!type) return 'default'; // Return default color if type is undefined
    
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

  // Get icon based on log type
  const getTypeIcon = (type) => {
    if (!type) return <InfoCircleOutlined />; // Return default icon if type is undefined
    
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

  // Calculate storage usage percentage
  const calculateStoragePercentage = (bytes) => {
    // 1 GB = 1,073,741,824 bytes
    const storageLimit = 1 * 1024 * 1024 * 1024; 
    return Math.min(Math.round((bytes / storageLimit) * 100), 100);
  };

  // Get progress status based on percentage
  const getProgressStatus = (percentage) => {
    if (percentage >= 90) return 'exception';
    if (percentage >= 70) return 'warning';
    return 'normal';
  };

  // Get progress color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage >= 90) return '#ff4d4f';
    if (percentage >= 70) return '#faad14';
    return '#52c41a';
  };

  // Table columns for storage usage
  const storageColumns = [
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

  // Calculate total storage statistics
  const totalFiles = storageData.reduce((sum, user) => sum + user.totalFiles, 0);
  const totalSize = storageData.reduce((sum, user) => sum + user.totalSizeBytes, 0);
  const activeUsers = storageData.length;
  const averageSize = activeUsers ? totalSize / activeUsers : 0;

  // Tab change handler
  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === '1') {
      loadAuditLogs();
    } else if (key === '2') {
      loadStorageData();
    }
  };

  // Refresh data based on active tab
  const handleRefresh = () => {
    if (activeTab === '1') {
      loadAuditLogs();
    } else {
      loadStorageData();
    }
  };

  // Renderer for Audit Logs tab
  const renderAuditLogsTab = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64 bg-white">
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
              marginBottom: '32px', 
              padding: '20px',
              background: index % 2 === 0 ? '#f9f9f9' : '#f9f9f9',
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="date-divider">
              <Divider orientation="left" orientationMargin="0" 
                style={{ 
                  color: '#1890ff', 
                  borderColor: '#d9d9d9',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                <ClockCircleOutlined style={{ marginRight: '8px' }} />
                {dateGroup}
              </Divider>
            </div>
            
            <div className="log-messages space-y-2" style={{ marginTop: '16px' }}>
              {groupedLogs[dateGroup].map(log => (
                <Card 
                  key={log._id || `log-${Math.random()}`} 
                  style={{ 
                    background: '#ffffff', 
                    marginBottom: '10px', 
                    borderRadius: '4px',
                    border: '1px solid #f0f0f0'
                  }}
                  bodyStyle={{ padding: '12px' }}
                  hoverable
                  className="transition-all hover:bg-gray-50"
                >
                  <div className="flex items-start">
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center">
                        <Text strong style={{ color: '#262626', marginRight: '8px' }}>
                          {log.username || 'Unknown User'}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px', color: '#8c8c8c' }}>
                          {formatTime(log.timestamp)}
                        </Text>
                      </div>
                      
                      <div className="mt-2 flex items-start">
                        <Tag 
                          color={getTypeColor(log.type)} 
                          icon={getTypeIcon(log.type)}
                          style={{ marginRight: '8px' }}
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

  // Renderer for Storage Usage tab
  const renderStorageUsageTab = () => {
    if (storageLoading) {
      return (
        <div className="flex justify-center items-center h-64 bg-white">
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
          <Row gutter={24}>
            <Col span={6}>
              <Card bordered={false}>
                <Statistic
                  title="จำนวนไฟล์ทั้งหมด"
                  value={totalFiles}
                  prefix={<FileOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={false}>
                <Statistic
                  title="พื้นที่ใช้งานทั้งหมด"
                  value={formatFileSize(totalSize)}
                  prefix={<DatabaseOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={false}>
                <Statistic
                  title="จำนวนผู้ใช้"
                  value={activeUsers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col span={6}>
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
              <span>การใช้พื้นที่จัดเก็บของผู้ใช้งาน</span>
            </div>
          }
          extra={
            <Tooltip title="ผู้ใช้แต่ละคนมีพื้นที่จัดเก็บ 1GB">
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          }
          style={{ borderRadius: '8px' }}
        >
          <Table 
            dataSource={storageData}
            columns={storageColumns}
            pagination={{ pageSize: 10 }}
            rowKey="key"
          />
        </Card>

        {/* Top users by storage usage */}
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <PieChartOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              <span>ผู้ใช้ที่ใช้พื้นที่มากที่สุด</span>
            </div>
          }
          style={{ marginTop: '24px', borderRadius: '8px' }}
        >
          <List
            itemLayout="horizontal"
            dataSource={storageData.length > 0 ? 
              [...storageData].sort((a, b) => b.totalSizeBytes - a.totalSizeBytes).slice(0, 3) : 
              []
            }
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Tag color="blue">{formatFileSize(item.totalSizeBytes)}</Tag>
                      <Text type="secondary">{item.totalFiles} ไฟล์</Text>
                      <Progress 
                        percent={calculateStoragePercentage(item.totalSizeBytes)} 
                        size="small" 
                        style={{ width: 120 }}
                        strokeColor={getProgressColor(calculateStoragePercentage(item.totalSizeBytes))}
                      />
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            {activeTab === '1' ? 'Audit Log Monitor' : 'Storage Usage Monitor'}
          </Title>
        </div>
        
        <Space size="middle">
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
        </Space>
      </Header>
      
      <Content style={{ margin: '16px' }}>
        <Card 
          className="shadow-lg" 
          style={{ background: '#ffffff', borderRadius: '8px' }}
          bodyStyle={{ padding: '16px' }}
        >
          <Tabs 
            activeKey={activeTab} 
            onChange={handleTabChange}
            size="large"
            tabBarStyle={{ marginBottom: 24 }}
            tabBarGutter={24}
          >
            <TabPane 
              tab={
                <span>
                  <InfoCircleOutlined />
                  Audit Logs
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
                  Storage Usage
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