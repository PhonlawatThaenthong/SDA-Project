import React, { useState } from 'react';
import { Table, Card, Space, Button, Dropdown, Menu, Empty, Select, Typography, Tooltip } from 'antd';
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
  StarFilled,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  AppstoreOutlined,
  BarsOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

const FavoritesList = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  // ข้อมูลตัวอย่างสำหรับรายการโปรด
  const favoriteFilesData = [
    {
      key: '1',
      name: 'รายงานประจำปี.pdf',
      type: 'pdf',
      size: '5.2 MB',
      lastModified: '20/02/2025',
    },
    {
      key: '2',
      name: 'ภาพทีมงาน.jpg',
      type: 'image',
      size: '3.7 MB',
      lastModified: '22/02/2025',
    },
    {
      key: '3',
      name: 'แผนการตลาด.docx',
      type: 'word',
      size: '2.1 MB',
      lastModified: '24/02/2025',
    }
  ];
  
  // กรองและเรียงลำดับข้อมูลไฟล์
  const getFilteredFiles = () => {
    let filtered = [...favoriteFilesData];
    
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
      <Menu.Item key="removeFromFavorites" icon={<StarFilled />}>
        นำออกจากรายการโปรด
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
          <StarFilled style={{ color: '#faad14' }} />
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
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100, background: '#fafafa', position: 'relative' }}>
                {getFileIcon(file.type)}
                <StarFilled style={{ position: 'absolute', top: 10, right: 10, color: '#faad14', fontSize: '16px' }} />
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
        <Empty description="ไม่พบไฟล์ในรายการโปรด" style={{ margin: '40px auto' }} />
      )}
    </div>
  );

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          รายการโปรด
        </Typography.Title>
      </div>
      
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
          locale={{ emptyText: <Empty description="ไม่พบไฟล์ในรายการโปรด" /> }}
        />
      )}
    </>
  );
};

export default FavoritesList;