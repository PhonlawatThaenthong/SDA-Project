import React from 'react';
import { Space, Select, Button, Tooltip } from 'antd';
import { 
  FilterOutlined, 
  SortAscendingOutlined, 
  AppstoreOutlined, 
  BarsOutlined,
  FileTextOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  PlaySquareOutlined,
  SoundOutlined,
  FolderOutlined
} from '@ant-design/icons';

const { Option } = Select;

const FileFilterControls = ({ 
  filterType, 
  setFilterType, 
  sortBy, 
  setSortBy, 
  viewMode, 
  setViewMode,
  themeColors = {
    primary: '#4361ee',
    secondary: '#3a0ca3',
    accent: '#4cc9f0'
  }
}) => {
  // Get icon for file type option
  const getFileTypeIcon = (type) => {
    switch(type) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#f5222d' }} />;
      case 'image':
        return <FileImageOutlined style={{ color: '#36cfc9' }} />;
      case 'word':
        return <FileWordOutlined style={{ color: '#1890ff' }} />;
      case 'excel':
        return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      case 'text':
        return <FileTextOutlined style={{ color: '#595959' }} />;
      case 'video':
        return <PlaySquareOutlined style={{ color: '#eb2f96' }} />;
      case 'audio':
        return <SoundOutlined style={{ color: '#faad14' }} />;
      default:
        return <FolderOutlined style={{ color: themeColors.primary }} />;
    }
  };

  return (
    <div className="file-tools" style={{ 
      marginBottom: '24px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      background: 'rgba(67, 97, 238, 0.03)',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(67, 97, 238, 0.08)'
    }}>
      <Space size="middle">
        <Select
          placeholder="ประเภทไฟล์"
          style={{ 
            width: 150,
            borderRadius: '8px'
          }}
          value={filterType}
          onChange={value => setFilterType(value)}
          suffixIcon={<FilterOutlined style={{ color: themeColors.primary }} />}
          dropdownStyle={{ 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(67, 97, 238, 0.15)'
          }}
        >
          <Option value="all">
            <Space>
              {getFileTypeIcon('all')}
              <span>ทั้งหมด</span>
            </Space>
          </Option>
          <Option value="pdf">
            <Space>
              {getFileTypeIcon('pdf')}
              <span>PDF</span>
            </Space>
          </Option>
          <Option value="image">
            <Space>
              {getFileTypeIcon('image')}
              <span>รูปภาพ</span>
            </Space>
          </Option>
          <Option value="word">
            <Space>
              {getFileTypeIcon('word')}
              <span>Word</span>
            </Space>
          </Option>
          <Option value="excel">
            <Space>
              {getFileTypeIcon('excel')}
              <span>Excel</span>
            </Space>
          </Option>
          <Option value="text">
            <Space>
              {getFileTypeIcon('text')}
              <span>Text</span>
            </Space>
          </Option>
          <Option value="video">
            <Space>
              {getFileTypeIcon('video')}
              <span>วิดีโอ</span>
            </Space>
          </Option>
          <Option value="audio">
            <Space>
              {getFileTypeIcon('audio')}
              <span>เสียง</span>
            </Space>
          </Option>
        </Select>
        
        <Select
          placeholder="เรียงตาม"
          style={{ 
            width: 150,
            borderRadius: '8px'
          }}
          value={sortBy}
          onChange={value => setSortBy(value)}
          suffixIcon={<SortAscendingOutlined style={{ color: themeColors.primary }} />}
          dropdownStyle={{ 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(67, 97, 238, 0.15)'
          }}
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
            style={{ 
              borderRadius: '8px',
              ...(viewMode === 'grid' ? {
                background: themeColors.gradient,
                border: 'none',
                boxShadow: '0 2px 8px rgba(67, 97, 238, 0.2)'
              } : {
                border: '1px solid rgba(67, 97, 238, 0.1)',
                color: themeColors.primary
              })
            }}
          />
        </Tooltip>
        <Tooltip title="มุมมองตาราง">
          <Button 
            type={viewMode === 'list' ? 'primary' : 'default'} 
            icon={<BarsOutlined />} 
            onClick={() => setViewMode('list')}
            style={{ 
              borderRadius: '8px',
              ...(viewMode === 'list' ? {
                background: themeColors.gradient,
                border: 'none',
                boxShadow: '0 2px 8px rgba(67, 97, 238, 0.2)'
              } : {
                border: '1px solid rgba(67, 97, 238, 0.1)',
                color: themeColors.primary
              })
            }}
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default FileFilterControls;