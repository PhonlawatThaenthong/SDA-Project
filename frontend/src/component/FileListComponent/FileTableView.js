import React from 'react';
import { Table, Space, Button, Popconfirm, List, Card, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { getFileIcon, getFileTypeTag, formatFileSize } from './fileUtils';

const { Text } = Typography;

const FileTableView = ({ files, onPreview, onDelete, isMobile, themeColors }) => {
  // ในกรณีหน้าจอเล็ก ให้ใช้ List แทน Table
  if (isMobile) {
    return (
      <List
        dataSource={files}
        renderItem={file => (
          <List.Item
            style={{ 
              padding: "8px", 
              borderRadius: "8px", 
              marginBottom: "8px",
              border: "1px solid #f0f0f0",
              background: "#fff"
            }}
          >
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              width: "100%",
              cursor: "pointer"
            }}
            onClick={() => onPreview(file)}
            >
              <div style={{ marginRight: "8px" }}>
                {getFileIcon(file)}
              </div>
              <div style={{ 
                flex: 1, 
                overflow: "hidden", 
                display: "flex", 
                flexDirection: "column" 
              }}>
                <Text 
                  ellipsis={{ tooltip: file.filename }} 
                  style={{ 
                    fontWeight: 500, 
                    fontSize: "13px",
                    marginBottom: "4px"
                  }}
                >
                  {file.filename}
                </Text>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <Space size="small">
                    {getFileTypeTag(file)}
                    <Text type="secondary" style={{ fontSize: "11px" }}>
                      {formatFileSize(file.size || 0)}
                    </Text>
                  </Space>
                  <Text type="secondary" style={{ fontSize: "11px" }}>
                    {new Date(file.createdAt || Date.now()).toLocaleDateString('th-TH', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </Text>
                </div>
              </div>
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              marginTop: "8px",
              borderTop: "1px solid #f0f0f0",
              paddingTop: "8px"
            }}>
              <Button 
                type="text" 
                icon={<EyeOutlined />}
                size="small"
                onClick={() => onPreview(file)}
              >
                เปิด
              </Button>
              <Popconfirm
                title="คุณต้องการลบไฟล์นี้หรือไม่?"
                description="การกระทำนี้ไม่สามารถเรียกคืนได้"
                onConfirm={() => onDelete(file._id)}
                okText="ใช่"
                cancelText="ไม่"
                placement="topRight"
              >
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  size="small"
                >
                  ลบ
                </Button>
              </Popconfirm>
            </div>
          </List.Item>
        )}
      />
    );
  }

  // สำหรับหน้าจอปกติและแท็บเล็ต ใช้ Table ปกติ
  const columns = [
    {
      title: 'ชื่อไฟล์',
      dataIndex: 'filename',
      key: 'filename',
      render: (text, record) => (
        <Space>
          {getFileIcon(record)}
          <div>{text}</div>
        </Space>
      ),
      ellipsis: true,
    },
    {
      title: 'ประเภท',
      key: 'type',
      render: (_, record) => getFileTypeTag(record),
      responsive: ['md'], // แสดงเฉพาะบนหน้าจอตั้งแต่ md ขึ้นไป
    },
    {
      title: 'ขนาด',
      key: 'size',
      dataIndex: 'size',
      render: (size) => formatFileSize(size || 0),
      responsive: ['md'], // แสดงเฉพาะบนหน้าจอตั้งแต่ md ขึ้นไป
    },
    {
      title: 'วันที่อัปโหลด',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date || Date.now()).toLocaleDateString('th-TH', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      }),
      responsive: ['sm'], // แสดงเฉพาะบนหน้าจอตั้งแต่ sm ขึ้นไป
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => onPreview(record)} 
          />
          <Popconfirm
            title="คุณต้องการลบไฟล์นี้หรือไม่?"
            description="การกระทำนี้ไม่สามารถเรียกคืนได้"
            onConfirm={() => onDelete(record._id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={files}
      rowKey="_id"
      pagination={{ 
        pageSize: 10,
        size: "small", // ปรับขนาด pagination ให้เล็กลงบนหน้าจอเล็ก
        hideOnSinglePage: true // ซ่อน pagination เมื่อมีหน้าเดียว
      }}
      size="middle" // ปรับขนาดตาราง
      scroll={{ x: 'max-content' }} // ให้สามารถเลื่อนตารางในแนวนอนได้
    />
  );
};

export default FileTableView;