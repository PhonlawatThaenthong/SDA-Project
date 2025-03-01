import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Typography, Tag, Divider, Spin, Badge, Empty, message } from 'antd';
import { InfoCircleOutlined, SettingOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function Logs() {
  const [logs, setLogs] = useState([]);
  const [groupedLogs, setGroupedLogs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (logs.length === 0) {
    return (
      <Card className="shadow-lg">
        <Empty 
          description="ไม่พบข้อมูล Audit Logs" 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      </Card>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Card 
        className="shadow-lg" 
        style={{ background: '#ffffff', borderRadius: '8px' }}
        bodyStyle={{ padding: '16px' }}
      >
        <Title level={3} style={{ color: '#1890ff', marginBottom: '24px' }}>
          <Badge status="processing" color="#1890ff" /> 
          Audit Log Monitor
        </Title>
        
        {Object.keys(groupedLogs).map(dateGroup => (
          <div key={dateGroup} className="mb-8">
            <div className="date-divider flex items-center my-4">
              <Divider orientation="left" orientationMargin="0" 
                style={{ color: '#8c8c8c', borderColor: '#f0f0f0' }}>
                <ClockCircleOutlined style={{ marginRight: '8px' }} />
                {dateGroup}
              </Divider>
            </div>
            
            <div className="log-messages space-y-2">
              {groupedLogs[dateGroup].map(log => (
                <Card 
                  key={log._id || `log-${Math.random()}`} 
                  style={{ 
                    background: '#ffffff', 
                    marginBottom: '8px', 
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
      </Card>
    </div>
  );
}

export default Logs;