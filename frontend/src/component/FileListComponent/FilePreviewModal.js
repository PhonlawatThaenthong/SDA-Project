import React from 'react';
import { Modal, Button, Image, Typography } from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import { getFileIcon, getFileBackgroundColor } from './fileUtils';

const { Title, Paragraph } = Typography;

const FilePreviewModal = ({ visible, title, imageUrl, onClose }) => {
  // Function to get large file icon
  const getLargeFileIcon = (filename) => {
    if (!filename) return null;
    
    const file = { filename };
    return getFileIcon(file, "large");
  };

  // Check file type
  const isImage = title && title.match(/\.(jpeg|jpg|gif|png|bmp|webp)$/i);
  const isPdf = title && title.match(/\.(pdf)$/i);
  const isVideo = title && title.match(/\.(mp4|webm|ogg|mov|avi|wmv)$/i);
  const isAudio = title && title.match(/\.(mp3|wav|ogg)$/i);

  return (
    <Modal
      visible={visible}
      title={<div style={{ display: 'flex', alignItems: 'center' }}>
        {title && getFileIcon({ filename: title })}
        <span style={{ marginLeft: '8px' }}>{title}</span>
      </div>}
      footer={[
        <Button key="close" onClick={onClose}>
          ปิด
        </Button>,
        <Button 
          key="download" 
          type="primary" 
          href={imageUrl} 
          target="_blank" 
          download={title}
        >
          ดาวน์โหลด
        </Button>
      ]}
      onCancel={onClose}
      width={800}
      centered
      destroyOnClose
    >
      {imageUrl && (
        <>
          {/* Image files */}
          {isImage && (
            <div style={{ textAlign: 'center' }}>
              <Image 
                alt="preview" 
                style={{ maxWidth: '100%', maxHeight: '70vh' }} 
                src={imageUrl}
                preview={false}
              />
            </div>
          )}
          
          {/* PDF files */}
          {isPdf && (
            <iframe 
              src={imageUrl} 
              style={{ width: '100%', height: '70vh', border: '1px solid #f0f0f0', borderRadius: '4px' }} 
              title="PDF Preview"
            />
          )}
          
          {/* Video files */}
          {isVideo && (
            <div style={{ textAlign: 'center', background: '#000', padding: '16px', borderRadius: '4px' }}>
              <video 
                controls 
                style={{ width: '100%', maxHeight: '70vh' }} 
                src={imageUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          
          {/* Audio files */}
          {isAudio && (
            <div style={{ textAlign: 'center', padding: '32px', background: '#fffbe6', borderRadius: '4px' }}>
              <SoundOutlined style={{ fontSize: '64px', color: '#faad14', marginBottom: '24px' }} />
              <div style={{ marginBottom: '24px' }}>
                <Title level={4}>{title}</Title>
              </div>
              <audio 
                controls 
                style={{ width: '100%' }} 
                src={imageUrl}
              >
                Your browser does not support the audio tag.
              </audio>
            </div>
          )}
          
          {/* Other file types that cannot be previewed */}
          {!isImage && !isPdf && !isVideo && !isAudio && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              background: getFileBackgroundColor({ filename: title }),
              borderRadius: '8px'
            }}>
              {getLargeFileIcon(title)}
              <Title level={3} style={{ margin: '24px 0 8px' }}>{title}</Title>
              <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
                ไม่สามารถแสดงตัวอย่างได้สำหรับประเภทไฟล์นี้
              </Paragraph>
              <Button type="primary" size="large" href={imageUrl} target="_blank" download={title}>
                ดาวน์โหลดไฟล์
              </Button>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default FilePreviewModal;