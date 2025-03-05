import React from 'react';
import { Row, Col, Card, Typography, Tag, Tooltip, Button, Popconfirm } from 'antd';
import { EyeOutlined, DeleteOutlined, MoreOutlined, DownloadOutlined } from '@ant-design/icons';
import { 
  isImageFile, 
  getFileIcon, 
  getFileBackgroundColor, 
  getFileTypeTag, 
  getFileExtension,
  formatFileSize 
} from './fileUtils';
import config from '../../config.js';

const { Text } = Typography;

const FileGridView = ({ files, onPreview, onDelete, isMobile, isTablet, themeColors }) => {
  // Set column counts based on device size
  const getColProps = () => {
    if (isMobile) {
      return {
        xs: 24,  // 1 คอลัมน์เต็มหน้าจอบนมือถือที่เล็กมาก
        sm: 12,  // 2 คอลัมน์บนมือถือทั่วไป
        md: 8,
        lg: 6
      };
    } else if (isTablet) {
      return {
        xs: 12,
        sm: 12,
        md: 8,  // 3 คอลัมน์บนแท็บเล็ต
        lg: 6
      };
    } else {
      return {
        xs: 24,
        sm: 12,
        md: 8,
        lg: 6  // 4 คอลัมน์บนเดสก์ท็อป
      };
    }
  };

  // Function to render card actions, responsive for different screen sizes
  const renderCardActions = (file) => {
    if (isMobile) {
      // For mobile, use a more button with dropdown
      return [
        <Tooltip title="เปิดไฟล์">
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(file);
            }}
          />
        </Tooltip>,
        <Tooltip title="ลบไฟล์">
          <Popconfirm
            title="คุณต้องการลบไฟล์นี้หรือไม่?"
            description="การกระทำนี้ไม่สามารถเรียกคืนได้"
            onConfirm={(e) => {
              onDelete(file._id);
            }}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              size="small"
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Tooltip>
      ];
    } else {
      // Standard actions for tablet and desktop
      return [
        <Tooltip title="เปิดไฟล์">
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onPreview(file);
            }}
          />
        </Tooltip>,
        <Tooltip title="ลบไฟล์">
          <Popconfirm
            title="คุณต้องการลบไฟล์นี้หรือไม่?"
            description="การกระทำนี้ไม่สามารถเรียกคืนได้"
            onConfirm={(e) => {
              onDelete(file._id);
            }}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Tooltip>
      ];
    }
  };

  return (
    <Row 
      gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]} 
      style={{ width: '100%', margin: 0 }}
    >
      {files.map((file) => (
        <Col {...getColProps()} key={file._id} style={{ padding: isMobile ? '4px' : undefined }}>
          <Card
            hoverable
            style={{ 
              overflow: "hidden",
              borderRadius: isMobile ? "4px" : "8px",
              transition: "all 0.3s ease",
              border: isMobile ? "none" : "1px solid #f0f0f0",
              boxShadow: isMobile ? "0 1px 3px rgba(0, 0, 0, 0.1)" : undefined,
              marginBottom: isMobile ? "8px" : 0
            }}
            bodyStyle={{ padding: isMobile ? "8px" : "12px" }}
            cover={
              isImageFile(file) ? (
                <div 
                  style={{ 
                    height: isMobile ? "120px" : "180px", 
                    overflow: "hidden", 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center",
                    background: "#f5f5f5",
                    cursor: "pointer"
                  }}
                  onClick={() => onPreview(file)}
                >
                  <img
                    alt={file.filename}
                    src={`${config.serverUrlPrefix}/file/${file._id}`}
                    style={{ 
                      maxHeight: "100%", 
                      maxWidth: "100%", 
                      objectFit: "contain" 
                    }}
                  />
                </div>
              ) : (
                <div 
                  style={{ 
                    height: isMobile ? "120px" : "180px", 
                    display: "flex", 
                    flexDirection: "column",
                    justifyContent: "center", 
                    alignItems: "center",
                    background: getFileBackgroundColor(file),
                    cursor: "pointer",
                    padding: isMobile ? "12px" : "16px"
                  }}
                  onClick={() => onPreview(file)}
                >
                  {getFileIcon(file, isMobile ? "normal" : "large")}
                  <div style={{ 
                    fontSize: isMobile ? "14px" : "16px", 
                    fontWeight: 500, 
                    marginTop: isMobile ? "12px" : "16px",
                    color: "#595959",
                    textAlign: "center", 
                    width: "100%", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis", 
                    whiteSpace: "nowrap"
                  }}>
                    {getFileExtension(file.filename).toUpperCase()}
                  </div>
                  {getFileTypeTag(file)}
                </div>
              )
            }
            actions={renderCardActions(file)}
          >
            <Card.Meta
              avatar={getFileIcon(file, isMobile ? "small" : "normal")}
              title={
                <Tooltip title={file.filename}>
                  <Text 
                    ellipsis={{ tooltip: file.filename }} 
                    style={{ 
                      width: "100%",
                      fontSize: isMobile ? "13px" : "14px" 
                    }}
                  >
                    {file.filename}
                  </Text>
                </Tooltip>
              }
              description={
                <div>
                  <Text type="secondary" style={{ fontSize: isMobile ? "11px" : "12px" }}>
                    {new Date(file.createdAt || Date.now()).toLocaleDateString('th-TH', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: isMobile ? undefined : '2-digit',
                      minute: isMobile ? undefined : '2-digit'
                    })}
                  </Text>
                  {file.size && (
                    <div style={{ marginTop: "4px" }}>
                      <Tag color="default" style={{ fontSize: isMobile ? "10px" : "11px" }}>
                        {formatFileSize(file.size)}
                      </Tag>
                    </div>
                  )}
                </div>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default FileGridView;