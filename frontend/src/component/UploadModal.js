import React, { useState } from 'react';
import { Modal, Upload, Button, message, Progress, Typography } from 'antd';
import { 
  InboxOutlined, 
  FileOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { Dragger } = Upload;
const { Text } = Typography;

const UploadModal = ({ visible, onCancel }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const props = {
    name: 'file',
    multiple: true,
    fileList,
    action: '//placeholder-api-endpoint/upload',
    onChange(info) {
      const { status } = info.file;
      
      let newFileList = [...info.fileList];
      
      // เก็บเฉพาะไฟล์ 5 ไฟล์ล่าสุด
      newFileList = newFileList.slice(-5);
      
      // อัพเดทสถานะ
      setFileList(newFileList);
      
      if (status === 'done') {
        message.success(`${info.file.name} อัพโหลดสำเร็จ`);
      } else if (status === 'error') {
        message.error(`${info.file.name} อัพโหลดไม่สำเร็จ`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      size: 3,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
    },
    showUploadList: {
      showDownloadIcon: false,
      showRemoveIcon: true,
      removeIcon: <CloseOutlined />,
    },
  };
  
  const handleOk = () => {
    if (fileList.length === 0) {
      message.warning('กรุณาเลือกไฟล์ที่ต้องการอัพโหลด');
      return;
    }
    
    setUploading(true);
    
    // จำลองการอัพโหลด
    setTimeout(() => {
      setUploading(false);
      setFileList([]);
      onCancel();
      message.success('อัพโหลดไฟล์ทั้งหมดเรียบร้อยแล้ว');
    }, 2000);
  };
  
  return (
    <Modal
      title="อัพโหลดไฟล์"
      open={visible}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="back" onClick={onCancel}>
          ยกเลิก
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={uploading} 
          onClick={handleOk}
          disabled={fileList.length === 0}
        >
          อัพโหลด
        </Button>,
      ]}
    >
      <Dragger {...props} disabled={uploading}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">คลิกหรือลากไฟล์มาที่นี่เพื่ออัพโหลด</p>
        <p className="ant-upload-hint">
          รองรับไฟล์เดี่ยวหรือหลายไฟล์ ขนาดไฟล์สูงสุด 100MB ต่อไฟล์
        </p>
      </Dragger>
      
      {fileList.length > 0 && uploading && (
        <div style={{ marginTop: 16 }}>
          <Text>กำลังอัพโหลด...</Text>
          <Progress percent={45} status="active" />
        </div>
      )}
    </Modal>
  );
};

export default UploadModal;