import { 
    FileOutlined,
    FilePdfOutlined,
    FileExcelOutlined,
    FileWordOutlined,
    FileZipOutlined,
    FilePptOutlined,
    FileTextOutlined,
    FileImageOutlined,
    FileMarkdownOutlined,
    FileUnknownOutlined,
    PlayCircleOutlined,
    SoundOutlined
  } from "@ant-design/icons";
  import React from "react";
  import { Tag } from "antd";
  
  // Check if file is an image
  export const isImageFile = (file) => {
    // Check mimetype first
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      return true;
    }
    
    // If no mimetype, check filename
    if (file.filename) {
      const filename = file.filename.toLowerCase();
      return filename.endsWith('.jpg') || 
             filename.endsWith('.jpeg') || 
             filename.endsWith('.png') || 
             filename.endsWith('.gif') || 
             filename.endsWith('.bmp') || 
             filename.endsWith('.webp');
    }
    
    return false;
  };
  
  // Get file extension
  export const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
  };
  
  // Format file size
  export const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Get file icon based on file type
  export const getFileIcon = (file, size = "normal") => {
    if (!file.filename) return <FileUnknownOutlined style={{ fontSize: size === "large" ? "64px" : "24px" }} />;
    
    const ext = getFileExtension(file.filename);
    const style = { fontSize: size === "large" ? "64px" : "24px" };
    
    if (isImageFile(file)) {
      return <FileImageOutlined style={{ ...style, color: "#36cfc9" }} />;
    }
    
    switch (ext) {
      case 'pdf':
        return <FilePdfOutlined style={{ ...style, color: "#f5222d" }} />;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <FileExcelOutlined style={{ ...style, color: "#52c41a" }} />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined style={{ ...style, color: "#1890ff" }} />;
      case 'ppt':
      case 'pptx':
        return <FilePptOutlined style={{ ...style, color: "#fa8c16" }} />;
      case 'zip':
      case 'rar':
      case '7z':
        return <FileZipOutlined style={{ ...style, color: "#722ed1" }} />;
      case 'txt':
        return <FileTextOutlined style={{ ...style, color: "#595959" }} />;
      case 'md':
        return <FileMarkdownOutlined style={{ ...style, color: "#13c2c2" }} />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'webm':
        return <PlayCircleOutlined style={{ ...style, color: "#eb2f96" }} />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <SoundOutlined style={{ ...style, color: "#faad14" }} />;
      default:
        return <FileOutlined style={{ ...style, color: "#8c8c8c" }} />;
    }
  };
  
  // Get file background color based on type
  export const getFileBackgroundColor = (file) => {
    if (!file.filename) return "#f5f5f5";
    
    const ext = getFileExtension(file.filename);
    
    if (isImageFile(file)) {
      return "#e6fffb";  // Light cyan
    }
    
    switch (ext) {
      case 'pdf':
        return "#fff1f0";  // Light red
      case 'xls':
      case 'xlsx':
      case 'csv':
        return "#f6ffed";  // Light green
      case 'doc':
      case 'docx':
        return "#e6f7ff";  // Light blue
      case 'ppt':
      case 'pptx':
        return "#fff7e6";  // Light orange
      case 'zip':
      case 'rar':
      case '7z':
        return "#f9f0ff";  // Light purple
      case 'txt':
        return "#fafafa";  // Light gray
      case 'md':
        return "#e6fffb";  // Light cyan
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'webm':
        return "#fff0f6";  // Light pink
      case 'mp3':
      case 'wav':
      case 'ogg':
        return "#fffbe6";  // Light yellow
      default:
        return "#f5f5f5";  // Default light gray
    }
  };
  
  // Get file type tag
  export const getFileTypeTag = (file) => {
    if (!file.filename) return <Tag>Unknown</Tag>;
    
    const ext = getFileExtension(file.filename);
    
    if (isImageFile(file)) {
      return <Tag color="cyan">รูปภาพ</Tag>;
    }
    
    switch (ext) {
      case 'pdf':
        return <Tag color="red">PDF</Tag>;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <Tag color="green">Excel</Tag>;
      case 'doc':
      case 'docx':
        return <Tag color="blue">Word</Tag>;
      case 'ppt':
      case 'pptx':
        return <Tag color="orange">PowerPoint</Tag>;
      case 'zip':
      case 'rar':
      case '7z':
        return <Tag color="purple">Archive</Tag>;
      case 'txt':
        return <Tag color="default">Text</Tag>;
      case 'md':
        return <Tag color="cyan">Markdown</Tag>;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'webm':
        return <Tag color="pink">วิดีโอ</Tag>;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <Tag color="gold">เสียง</Tag>;
      default:
        return <Tag color="default">{ext.toUpperCase()}</Tag>;
    }
  };
  
  // Get file category for filtering
  export const getFileCategory = (file) => {
    if (!file.filename) return 'unknown';
    
    const ext = getFileExtension(file.filename);
    
    if (isImageFile(file)) {
      return 'image';
    }
    
    if (ext === 'pdf') {
      return 'pdf';
    } else if (ext === 'doc' || ext === 'docx') {
      return 'word';
    } else if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') {
      return 'excel';
    } else if (ext === 'txt') {
      return 'text';
    } else if (['mp4', 'avi', 'mov', 'wmv', 'webm'].includes(ext)) {
      return 'video';
    } else if (['mp3', 'wav', 'ogg'].includes(ext)) {
      return 'audio';
    }
    
    return 'unknown';
  };