import React, { useState } from 'react';
import { Modal, Upload, Button, message, Progress, Typography } from 'antd';
import { 
  InboxOutlined, 
  FileOutlined,
  CloseOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Dragger } = Upload;
const { Text } = Typography;

const UploadModal = ({ visible, onCancel }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleUpload = async (options) => {
    const { file, onSuccess, onError, onProgress } = options;
    
    const formData = new FormData();
    formData.append("file", file);
    
    setUploadLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      // อัพโหลดไฟล์จริง
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      
      if (response.ok) {
        // อัพโหลดสำเร็จ
        message.success({
          content: "อัพโหลดไฟล์สำเร็จ",
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
        });
        onSuccess(result, file);
        setUploadProgress(100); // ตั้งค่าสถานะว่าอัพโหลดเสร็จแล้ว
      } else {
        // อัพโหลดล้มเหลว
        message.error(result.error || "อัพโหลดไฟล์ล้มเหลว");
        onError(new Error(result.error));
      }
    } catch (error) {
      console.error("Upload failed:", error);
      message.error("อัพโหลดไฟล์ล้มเหลว");
      onError(error);
    } finally {
      setUploadLoading(false);
    }
  };

  const props = {
    name: 'file',
    multiple: true,
    fileList,
    customRequest: handleUpload,
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
          <Progress percent={uploadProgress} status="active" />
        </div>
      )}
    </Modal>
  );
};

export default UploadModal;
