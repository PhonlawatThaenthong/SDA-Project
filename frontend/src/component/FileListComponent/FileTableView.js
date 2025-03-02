import React from 'react';
import { Table, Space, Button, Popconfirm } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { getFileIcon, getFileTypeTag } from './fileUtils';

const FileTableView = ({ files, onPreview, onDelete }) => {
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
    },
    {
      title: 'ประเภท',
      key: 'type',
      render: (_, record) => getFileTypeTag(record),
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
      pagination={{ pageSize: 10 }}
    />
  );
};

export default FileTableView;