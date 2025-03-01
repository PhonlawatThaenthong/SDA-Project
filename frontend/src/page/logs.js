import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  Typography, 
  Tag, 
  Divider, 
  Spin, 
  Badge, 
  Empty, 
  message, 
  Layout, 
  Space, 
  Button, 
  Avatar, 
  Dropdown, 
  Menu
} from 'antd';
import { 
  InfoCircleOutlined, 
  SettingOutlined, 
  ClockCircleOutlined, 
  UserOutlined, 
  DownOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

function Logs() {
  const [logs, setLogs] = useState([]);
  const [groupedLogs, setGroupedLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก localStorage (เหมือนใน mainpage.js)
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.username) {
      setUsername(user.username);
    }

    // Fetch logs from the backend
    setLoading(true);
    axios.get('http://localhost:5000/logs')
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
  }, []);

  // ฟังก์ชันจัดการออกจากระบบ เหมือนใน mainpage.js
  const handleLogout = () => {
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

  // Get tag color based on log type
  const getTypeColor = (type) => {
    if (!type) return 'default'; // Return default color if type is undefined
    
    const logType = type.toLowerCase();
    const typeMap = {
      'login': 'success',
      'logout': 'warning',
      'delete': 'error',
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
      'settings': <SettingOutlined />,
      'default': <InfoCircleOutlined />
    };
    
    return typeMap[logType] || typeMap.default;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <Spin size="large" tip="กำลังโหลด Audit Logs..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* เพิ่ม Header คล้ายกับใน mainpage.js แต่ไม่มีแถบค้นหา */}
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <div>
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            Audit Log Monitor
          </Title>
        </div>
        
        <Space size="middle">
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
        <div className="p-4 bg-gray-50">
          <Card 
            className="shadow-lg" 
            style={{ background: '#ffffff', borderRadius: '8px' }}
            bodyStyle={{ padding: '16px' }}
          >
            {logs.length === 0 ? (
              <Empty 
                description="ไม่พบข้อมูล Audit Logs" 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
              />
            ) : (
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
            )}
          </Card>
        </div>
      </Content>
    </Layout>
  );
}

export default Logs;