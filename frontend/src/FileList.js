import React, { useState } from 'react';
import { Table, Card, Space, Button, Dropdown, Menu, Empty, Input, Select, Typography, Tooltip } from 'antd';
import { 
  FileOutlined, 
  FileImageOutlined, 
  FilePdfOutlined, 
  FileTextOutlined, 
  FileExcelOutlined, 
  FileWordOutlined,
  MoreOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  StarOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  AppstoreOutlined,
  BarsOutlined
} from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const FileList = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  // ข้อมูลตัวอย่าง (ในโปรเจคจริงจะรับมาจาก API)
  const filesData = [
    {
      key: '1',
      name: 'รายงานสรุปประจำเดือน.pdf',
      type: 'pdf',
      size: '2.3 MB',
      lastModified: '27/02/2025',
    },
    {
      key: '2',
      name: 'ภาพการประชุม.jpg',
      type: 'image',
      size: '4.1 MB',
      lastModified: '25/02/2025',
    },
    {
      key: '3',
      name: 'เอกสารสำคัญ.docx',
      type: 'word',
      size: '1.5 MB',
      lastModified: '20/02/2025',
    },
    {
      key: '4',
      name: 'ข้อมูลยอดขาย.xlsx',
      type: 'excel',
      size: '3.7 MB',
      lastModified: '18/02/2025',
    },
    {
      key: '5',
      name: 'บันทึกการประชุม.txt',
      type: 'text',
      size: '0.5 MB',
      lastModified: '15/02/2025',
    },
  ];
  
  // กรองและเรียงลำดับข้อมูลไฟล์
  const getFilteredFiles = () => {
    let filtered = [...filesData];
    
    // กรองตามประเภทไฟล์
    if (filterType !== 'all') {
      filtered = filtered.filter(file => file.type === filterType);
    }
    
    // เรียงลำดับ
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'date') {
        // แปลงวันที่ไทยเป็นรูปแบบที่เปรียบเทียบได้
        const dateA = a.lastModified.split('/').reverse().join('-');
        const dateB = b.lastModified.split('/').reverse().join('-');
        return dateB.localeCompare(dateA); // เรียงจากใหม่ไปเก่า
      } else if (sortBy === 'size') {
        // แปลงขนาดไฟล์เป็นตัวเลข
        const sizeA = parseFloat(a.size.split(' ')[0]);
        const sizeB = parseFloat(b.size.split(' ')[0]);
        return sizeB - sizeA; // เรียงจากใหญ่ไปเล็ก
      }
      return 0;
    });
    
    return filtered;
  };
  
  const filteredFiles = getFilteredFiles();
  
  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf':
        return <FilePdfOutlined style={{ fontSize: '32px', color: '#ff4d4f' }} />;
      case 'image':
        return <FileImageOutlined style={{ fontSize: '32px', color: '#1890ff' }} />;
      case 'word':
        return <FileWordOutlined style={{ fontSize: '32px', color: '#1565c0' }} />;
      case 'excel':
        return <FileExcelOutlined style={{ fontSize: '32px', color: '#4caf50' }} />;
      case 'text':
        return <FileTextOutlined style={{ fontSize: '32px', color: '#faad14' }} />;
      default:
        return <FileOutlined style={{ fontSize: '32px', color: '#8c8c8c' }} />;
    }
  };
  
  const fileActionMenu = (
    <Menu>
      <Menu.Item key="preview" icon={<EyeOutlined />}>
        ดูตัวอย่าง
      </Menu.Item>
      <Menu.Item key="download" icon={<DownloadOutlined />}>
        ดาวน์โหลด
      </Menu.Item>
      <Menu.Item key="share" icon={<ShareAltOutlined />}>
        แชร์
      </Menu.Item>
      <Menu.Item key="rename" icon={<EditOutlined />}>
        เปลี่ยนชื่อ
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="favorite" icon={<StarOutlined />}>
        เพิ่มในรายการโปรด
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
        ลบ
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'ชื่อไฟล์',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {getFileIcon(record.type)}
          <div>{text}</div>
        </Space>
      ),
    },
    {
      title: 'ขนาด',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'แก้ไขล่าสุด',
      dataIndex: 'lastModified',
      key: 'lastModified',
    },
    {
      title: 'การจัดการ',
      key: 'action',
      render: () => (
        <Dropdown overlay={fileActionMenu} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const GridView = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {filteredFiles.length > 0 ? (
        filteredFiles.map(file => (
          <Card
            key={file.key}
            hoverable
            style={{ width: 200 }}
            cover={
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100, background: '#fafafa' }}>
                {getFileIcon(file.type)}
              </div>
            }
            actions={[
              <DownloadOutlined key="download" />,
              <ShareAltOutlined key="share" />,
              <Dropdown overlay={fileActionMenu} trigger={['click']}>
                <MoreOutlined key="more" />
              </Dropdown>,
            ]}
          >
            <Card.Meta
              title={file.name}
              description={
                <div>
                  <div>{`${file.size} • ${file.lastModified}`}</div>
                </div>
              }
            />
          </Card>
        ))
      ) : (
        <Empty description="ไม่พบไฟล์" style={{ margin: '40px auto' }} />
      )}
    </div>
  );

  return (
    <>
      {/* เครื่องมือกรองและเรียงลำดับ */}
      <div className="file-tools" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Select
            placeholder="ประเภทไฟล์"
            style={{ width: 150 }}
            value={filterType}
            onChange={value => setFilterType(value)}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">ทั้งหมด</Option>
            <Option value="pdf">PDF</Option>
            <Option value="image">รูปภาพ</Option>
            <Option value="word">Word</Option>
            <Option value="excel">Excel</Option>
            <Option value="text">Text</Option>
          </Select>
          
          <Select
            placeholder="เรียงตาม"
            style={{ width: 150 }}
            value={sortBy}
            onChange={value => setSortBy(value)}
            suffixIcon={<SortAscendingOutlined />}
          >
            <Option value="name">ชื่อ</Option>
            <Option value="date">วันที่แก้ไข</Option>
            <Option value="size">ขนาด</Option>
          </Select>
        </Space>
        
        <Space>
          <Tooltip title="แบบตาราง">
            <Button 
              type={viewMode === 'grid' ? 'primary' : 'default'} 
              icon={<AppstoreOutlined />} 
              onClick={() => setViewMode('grid')}
            />
          </Tooltip>
          <Tooltip title="แบบรายการ">
            <Button 
              type={viewMode === 'list' ? 'primary' : 'default'} 
              icon={<BarsOutlined />} 
              onClick={() => setViewMode('list')}
            />
          </Tooltip>
        </Space>
      </div>
      
      {viewMode === 'grid' ? (
        <GridView />
      ) : (
        <Table 
          columns={columns} 
          dataSource={filteredFiles}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: <Empty description="ไม่พบไฟล์" /> }}
        />
      )}
    </>
  );
};

export default FileList;