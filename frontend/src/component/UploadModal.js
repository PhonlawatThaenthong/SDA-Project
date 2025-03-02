import React, { useState, useContext } from 'react';
import { Modal, Upload, Button, message, Progress, Typography } from 'antd';
import { 
  InboxOutlined, 
  CloseOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { StorageContext } from '../context/StorageContext'; // We'll create this context

const { Dragger } = Upload;
const { Text } = Typography;

const UploadModal = ({ visible, onCancel }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLoading, setUploadLoading] = useState(false);
  const { refreshStorage } = useContext(StorageContext); // Get the refresh function from context

  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    
    const formData = new FormData();
    formData.append("file", file);
    
    setUploadLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 99) {
            clearInterval(progressInterval);
            return 99;
          }
          return prev + 10;
        });
      }, 200);

      // อัพโหลดไฟล์จริง
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      clearInterval(progressInterval);
      const result = await response.json();
      
      if (response.ok) {
        // อัพโหลดสำเร็จ
        message.success({
          content: "อัพโหลดไฟล์สำเร็จ",
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
        });
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5000/logs-upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: `อัพโหลดไฟล์ ${file.name} (${formatFileSize(file.size)})`,
            level: "info"
          })
        });
        onSuccess(result, file);
        setUploadProgress(100); // ตั้งค่าสถานะว่าอัพโหลดเสร็จแล้ว
        
        // Refresh storage usage after successful upload
        refreshStorage();
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        message.success(`${info.file.name} (${formatFileSize(info.file.size)}) อัพโหลดสำเร็จ`);
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
    beforeUpload: (file) => {
      // Check file size before upload (max 1GB per file)
      const isLessThan1GB = file.size / 1024 / 1024 / 1024 < 1;
      if (!isLessThan1GB) {
        message.error(`${file.name} ขนาดไฟล์เกิน 1GB ไม่สามารถอัพโหลดได้`);
        return Upload.LIST_IGNORE;
      }
      return true;
    }
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
      refreshStorage(); // Refresh storage data after upload
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
          รองรับไฟล์เดี่ยวหรือหลายไฟล์ ขนาดไฟล์สูงสุด 1GB ต่อไฟล์
        </p>
      </Dragger>

      {fileList.length > 0 && uploadLoading && (
        <div style={{ marginTop: 16 }}>
          <Text>กำลังอัพโหลด...</Text>
          <Progress percent={uploadProgress} status="active" />
        </div>
      )}
    </Modal>
  );
};

export default UploadModal;