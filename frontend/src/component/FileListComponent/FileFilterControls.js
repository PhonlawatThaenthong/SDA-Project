import React from 'react';
import { Space, Select, Button, Tooltip } from 'antd';
import { 
  FilterOutlined, 
  SortAscendingOutlined, 
  AppstoreOutlined, 
  BarsOutlined 
} from '@ant-design/icons';

const { Option } = Select;

const FileFilterControls = ({ 
  filterType, 
  setFilterType, 
  sortBy, 
  setSortBy, 
  viewMode, 
  setViewMode 
}) => {
  return (
    <div className="file-tools" style={{ 
      marginBottom: '24px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
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
          <Option value="video">วิดีโอ</Option>
          <Option value="audio">เสียง</Option>
        </Select>
        
        <Select
          placeholder="เรียงตาม"
          style={{ width: 150 }}
          value={sortBy}
          onChange={value => setSortBy(value)}
          suffixIcon={<SortAscendingOutlined />}
        >
          <Option value="name">ชื่อ</Option>
          <Option value="date">วันที่อัปโหลด</Option>
          <Option value="size">ขนาด</Option>
        </Select>
      </Space>
      
      <Space>
        <Tooltip title="มุมมองกริด">
          <Button 
            type={viewMode === 'grid' ? 'primary' : 'default'} 
            icon={<AppstoreOutlined />} 
            onClick={() => setViewMode('grid')}
          />
        </Tooltip>
        <Tooltip title="มุมมองตาราง">
          <Button 
            type={viewMode === 'list' ? 'primary' : 'default'} 
            icon={<BarsOutlined />} 
            onClick={() => setViewMode('list')}
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default FileFilterControls;