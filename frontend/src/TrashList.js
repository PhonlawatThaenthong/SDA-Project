import React, { useState } from 'react';
import { Table, Card, Space, Button, Dropdown, Menu, Empty, Select, Typography, Tooltip, Modal } from 'antd';
import { 
  FileOutlined, 
  FileImageOutlined, 
  FilePdfOutlined, 
  FileTextOutlined, 
  FileExcelOutlined, 
  FileWordOutlined,
  MoreOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ClearOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Text, Title } = Typography;
const { confirm } = Modal;

const TrashList = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  
  // ข้อมูลตัวอย่างสำหรับถังขยะ
  const trashedFilesData = [
    {
      key: '1',
      name: 'ไฟล์เก่า.pdf',
      type: 'pdf',
      size: '1.5 MB',
      deletedDate: '25/02/2025',
      expiryDate: '25/03/2025',
    },
    {
      key: '2',
      name: 'ภาพทดสอบ.jpg',
      type: 'image',
      size: '2.3 MB',
      deletedDate: '24/02/2025',
      expiryDate: '24/03/2025',
    },
    {
      key: '3',
      name: 'รายงานแก้ไข.docx',
      type: 'word',
      size: '1.2 MB',
      deletedDate: '23/02/2025',
      expiryDate: '23/03/2025',
    },
    {
      key: '4',
      name: 'ข้อมูลสำรอง.xlsx',
      type: 'excel',
      size: '3.4 MB',
      deletedDate: '20/02/2025',
      expiryDate: '20/03/2025',
    }
  ];
  
  // กรองและเรียงลำดับข้อมูลไฟล์
  const getFilteredFiles = () => {
    let filtered = [...trashedFilesData];
    
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
        const dateA = a.deletedDate.split('/').reverse().join('-');
        const dateB = b.deletedDate.split('/').reverse().join('-');
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
  
  // แสดง confirm dialog สำหรับการลบถาวร
  const showDeleteConfirm = () => {
    confirm({
      title: 'คุณต้องการลบไฟล์ถาวรหรือไม่?',
      icon: <ExclamationCircleOutlined />,
      content: 'เมื่อลบแล้ว ไฟล์จะไม่สามารถกู้คืนได้อีก',
      okText: 'ใช่ ลบถาวร',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk() {
        console.log('ลบถาวร');
      },
    });
  };
  
  // แสดง confirm dialog สำหรับการลบทั้งหมด
  const showEmptyTrashConfirm = () => {
    confirm({
      title: 'คุณต้องการล้างถังขยะทั้งหมดหรือไม่?',
      icon: <ExclamationCircleOutlined />,
      content: 'เมื่อลบแล้ว ไฟล์ทั้งหมดจะไม่สามารถกู้คืนได้อีก',
      okText: 'ใช่ ล้างถังขยะ',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk() {
        console.log('ล้างถังขยะ');
      },
    });
  };
  
  const fileActionMenu = (
    <Menu>
      <Menu.Item key="restore" icon={<ReloadOutlined />}>
        กู้คืน
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={showDeleteConfirm}>
        ลบถาวร
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
      title: 'วันที่ลบ',
      dataIndex: 'deletedDate',
      key: 'deletedDate',
    },
    {
      title: 'จะถูกลบถาวรในวันที่',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'การจัดการ',
      key: 'action',
      render: () => (
        <Space>
          <Button type="text" icon={<ReloadOutlined />} title="กู้คืน" />
          <Button type="text" danger icon={<DeleteOutlined />} title="ลบถาวร" onClick={showDeleteConfirm} />
        </Space>
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
              <ReloadOutlined key="restore" title="กู้คืน" />,
              <DeleteOutlined key="delete" onClick={showDeleteConfirm} title="ลบถาวร" />,
              <Dropdown overlay={fileActionMenu} trigger={['click']}>
                <MoreOutlined key="more" />
              </Dropdown>,
            ]}
          >
            <Card.Meta
              title={file.name}
              description={
                <div>
                  <div>{`${file.size} • ลบเมื่อ ${file.deletedDate}`}</div>
                  <div style={{ color: '#ff4d4f', fontSize: '12px' }}>จะถูกลบถาวรใน {file.expiryDate}</div>
                </div>
              }
            />
          </Card>
        ))
      ) : (
        <Empty description="ไม่มีไฟล์ในถังขยะ" style={{ margin: '40px auto' }} />
      )}
    </div>
  );

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title level={4} style={{ margin: 0 }}>
          ถังขยะ
        </Title>
        <Button 
          danger 
          icon={<ClearOutlined />} 
          onClick={showEmptyTrashConfirm}
          disabled={filteredFiles.length === 0}
        >
          ล้างถังขยะ
        </Button>
      </div>
      
      <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
        ไฟล์ที่ถูกลบจะถูกเก็บไว้ในถังขยะเป็นเวลา 30 วัน หลังจากนั้นจะถูกลบถาวร
      </Text>
      
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
            <Option value="date">วันที่ลบ</Option>
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
          locale={{ emptyText: <Empty description="ไม่มีไฟล์ในถังขยะ" /> }}
        />
      )}
    </>
  );
};

export default TrashList;