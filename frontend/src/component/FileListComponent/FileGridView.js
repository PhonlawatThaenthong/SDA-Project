import React from 'react';
import { Row, Col, Card, Typography, Tag, Tooltip, Button, Popconfirm } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { 
  isImageFile, 
  getFileIcon, 
  getFileBackgroundColor, 
  getFileTypeTag, 
  getFileExtension,
  formatFileSize 
} from './fileUtils';

const { Text } = Typography;

const FileGridView = ({ files, onPreview, onDelete }) => {
  return (
    <Row gutter={[16, 16]}>
      {files.map((file) => (
        <Col xs={24} sm={12} md={8} lg={6} key={file._id}>
          <Card
            hoverable
            style={{ 
              overflow: "hidden",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              border: "1px solid #f0f0f0"
            }}
            bodyStyle={{ padding: "12px" }}
            cover={
              isImageFile(file) ? (
                <div 
                  style={{ 
                    height: "180px", 
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
                    src={`http://localhost:5000/file/${file._id}`}
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
                    height: "180px", 
                    display: "flex", 
                    flexDirection: "column",
                    justifyContent: "center", 
                    alignItems: "center",
                    background: getFileBackgroundColor(file),
                    cursor: "pointer",
                    padding: "16px"
                  }}
                  onClick={() => onPreview(file)}
                >
                  {getFileIcon(file)}
                  <div style={{ 
                    fontSize: "16px", 
                    fontWeight: 500, 
                    marginTop: "16px",
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
            actions={[
              <Tooltip title="เปิดไฟล์">
                <Button 
                  type="text" 
                  icon={<EyeOutlined />}
                  onClick={() => onPreview(file)}
                />
              </Tooltip>,
              <Tooltip title="ลบไฟล์">
                <Popconfirm
                  title="คุณต้องการลบไฟล์นี้หรือไม่?"
                  description="การกระทำนี้ไม่สามารถเรียกคืนได้"
                  onConfirm={() => onDelete(file._id)}
                  okText="ใช่"
                  cancelText="ไม่"
                >
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </Tooltip>
            ]}
          >
            <Card.Meta
              avatar={getFileIcon(file)}
              title={
                <Tooltip title={file.filename}>
                  <Text ellipsis={{ tooltip: file.filename }} style={{ width: "100%" }}>
                    {file.filename}
                  </Text>
                </Tooltip>
              }
              description={
                <div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {new Date(file.createdAt || Date.now()).toLocaleDateString('th-TH', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                  {file.size && (
                    <div style={{ marginTop: "4px" }}>
                      <Tag color="default" style={{ fontSize: "11px" }}>
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