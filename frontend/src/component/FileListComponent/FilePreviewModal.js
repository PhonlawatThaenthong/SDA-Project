import React from 'react';
import { Modal, Button, Image, Typography, Space } from 'antd';
import { SoundOutlined, DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import { getFileIcon, getFileBackgroundColor } from './fileUtils';

const { Title, Paragraph } = Typography;

const FilePreviewModal = ({ visible, title, imageUrl, onClose, isMobile, themeColors }) => {
  // Function to get large file icon
  const getLargeFileIcon = (filename) => {
    if (!filename) return null;
    
    const file = { filename };
    return getFileIcon(file, isMobile ? "normal" : "large");
  };

  // Check file type
  const isImage = title && title.match(/\.(jpeg|jpg|gif|png|bmp|webp)$/i);
  const isPdf = title && title.match(/\.(pdf)$/i);
  const isVideo = title && title.match(/\.(mp4|webm|ogg|mov|avi|wmv)$/i);
  const isAudio = title && title.match(/\.(mp3|wav|ogg)$/i);

  // Adjust modal props based on device
  const modalProps = {
    open: visible,
    title: (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        fontSize: isMobile ? '14px' : '16px'
      }}>
        {title && getFileIcon({ filename: title })}
        <span style={{ 
          marginLeft: '8px', 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: isMobile ? 'calc(100vw - 120px)' : '700px'
        }}>{title}</span>
      </div>
    ),
    footer: [
      <Button 
        key="close" 
        onClick={onClose}
        size={isMobile ? "small" : "middle"}
        icon={<CloseOutlined />}
      >
        ปิด
      </Button>,
      <Button 
        key="download" 
        type="primary" 
        href={imageUrl} 
        target="_blank" 
        download={title}
        icon={<DownloadOutlined />}
        size={isMobile ? "small" : "middle"}
      >
        ดาวน์โหลด
      </Button>
    ],
    onCancel: onClose,
    width: isMobile ? '95%' : 800,
    centered: true,
    destroyOnClose: true,
    bodyStyle: { 
      padding: isMobile ? '12px' : '24px',
      maxHeight: isMobile ? 'calc(80vh - 120px)' : 'calc(85vh - 150px)',
      overflow: 'auto'
    }
  };

  return (
    <Modal {...modalProps}>
      {imageUrl && (
        <>
          {/* Image files */}
          {isImage && (
            <div style={{ textAlign: 'center' }}>
              <Image 
                alt="preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: isMobile ? '60vh' : '70vh',
                  objectFit: 'contain'
                }} 
                src={imageUrl}
                preview={false}
              />
            </div>
          )}
          
          {/* PDF files */}
          {isPdf && (
            <iframe 
              src={imageUrl} 
              style={{ 
                width: '100%', 
                height: isMobile ? '60vh' : '70vh', 
                border: '1px solid #f0f0f0', 
                borderRadius: '4px' 
              }} 
              title="PDF Preview"
            />
          )}
          
          {/* Video files */}
          {isVideo && (
            <div style={{ textAlign: 'center', background: '#000', padding: isMobile ? '8px' : '16px', borderRadius: '4px' }}>
              <video 
                controls 
                style={{ width: '100%', maxHeight: isMobile ? '60vh' : '70vh' }} 
                src={imageUrl}
                playsInline // เพิ่มคุณสมบัติ playsInline สำหรับ iOS
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          
          {/* Audio files */}
          {isAudio && (
            <div style={{ 
              textAlign: 'center', 
              padding: isMobile ? '16px' : '32px', 
              background: '#fffbe6', 
              borderRadius: '4px' 
            }}>
              <SoundOutlined style={{ 
                fontSize: isMobile ? '48px' : '64px', 
                color: '#faad14', 
                marginBottom: isMobile ? '16px' : '24px' 
              }} />
              <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
                <Title level={isMobile ? 5 : 4}>{title}</Title>
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
              padding: isMobile ? '24px' : '40px', 
              background: getFileBackgroundColor({ filename: title }),
              borderRadius: '8px'
            }}>
              {getLargeFileIcon(title)}
              <Title level={isMobile ? 4 : 3} style={{ margin: isMobile ? '16px 0 8px' : '24px 0 8px' }}>{title}</Title>
              <Paragraph type="secondary" style={{ marginBottom: isMobile ? '16px' : '24px' }}>
                ไม่สามารถแสดงตัวอย่างได้สำหรับประเภทไฟล์นี้
              </Paragraph>
              <Space>
                <Button 
                  type="primary" 
                  size={isMobile ? "middle" : "large"} 
                  href={imageUrl} 
                  target="_blank" 
                  download={title}
                  icon={<DownloadOutlined />}
                >
                  ดาวน์โหลดไฟล์
                </Button>
                <Button 
                  onClick={onClose}
                  size={isMobile ? "middle" : "large"}
                >
                  ปิด
                </Button>
              </Space>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default FilePreviewModal;