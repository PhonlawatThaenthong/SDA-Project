import React, { useState, useEffect } from "react";
import { message, Spin, Empty, Typography, Divider, Button } from "antd";
import { InfoCircleOutlined, RedoOutlined, CheckCircleOutlined } from "@ant-design/icons";
import FileFilterControls from "./FileListComponent/FileFilterControls";
import FilePreviewModal from "./FileListComponent/FilePreviewModal";
import FileGridView from "./FileListComponent/FileGridView";
import FileTableView from "./FileListComponent/FileTableView";
import { fetchFiles as apiFetchFiles, deleteFile } from "./FileListComponent/fileApi";
import { isImageFile, getFileExtension, getFileCategory } from "./FileListComponent/fileUtils";
import { config } from '../config.js';

const { Title, Text } = Typography;

// Modern theme colors
const themeColors = {
  primary: '#4361ee', // Modern blue
  secondary: '#3a0ca3', // Deep purple
  accent: '#4cc9f0', // Bright cyan
  gradient: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
  gradientAccent: 'linear-gradient(135deg, #4cc9f0 0%, #4361ee 100%)',
  siderBg: '#f8f9fa', // Light gray background
  headerBg: '#FFFFFF',
  contentBg: '#f8f9fa',
  warningColor: '#ff9800', // Orange
  dangerColor: '#f44336', // Red
  successColor: '#4caf50', // Green
  textPrimary: '#212529',
  boxShadow: '0 4px 12px rgba(67, 97, 238, 0.15)',
  cardPrimary: '#ffffff',
  borderColor: 'rgba(67, 97, 238, 0.1)'
};

function FileList({ onFileChange }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  
  // State for filtering, sorting, and view
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'date', or 'size'

  // Fetch files from the backend
  useEffect(() => {
    // ทำการเรียกข้อมูลเฉพาะครั้งแรก ไม่รวมถึงอัปเดต storage
    apiFetchFiles()
      .then((data) => {
        console.log("Initial file fetch:", data);
        setFiles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching files:", err);
        message.error("ไม่สามารถดึงข้อมูลไฟล์ได้");
        setLoading(false);
      });
  }, []);

  const fetchFiles = () => {
    setLoading(true);
    apiFetchFiles()
      .then((data) => {
        console.log("Fetched files:", data);
        setFiles(Array.isArray(data) ? data : []);
        setLoading(false);
        
        // เรียกใช้ onFileChange หลังจากดึงข้อมูลไฟล์เสร็จ (ถ้ามี)
        if (onFileChange) {
          onFileChange();
        }
      })
      .catch((err) => {
        console.error("Error fetching files:", err);
        message.error("ไม่สามารถดึงข้อมูลไฟล์ได้");
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const data = await deleteFile(id);
      
      if (data.success) {
        message.success({
          content: "ลบไฟล์สำเร็จ",
          icon: <CheckCircleOutlined style={{ color: themeColors.successColor }} />
        });
        setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id));
        
        // เรียกใช้ onFileChange หลังจากลบไฟล์เสร็จ เพื่ออัปเดตข้อมูลพื้นที่จัดเก็บ
        if (onFileChange) {
          onFileChange();
        }
        
        // บันทึกประวัติการลบไฟล์
        const token = localStorage.getItem("token");
        await fetch(`${config.serverUrlPrefix}/logs-remove-file`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: "ลบไฟล์",
            level: "info"
          })
        });
      } else {
        message.error(data.error || "ลบไฟล์ล้มเหลว");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("ลบไฟล์ล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (file) => {
    setPreviewImage(`${config.serverUrlPrefix}/file/${file._id}`);
    setPreviewTitle(file.filename);
    setPreviewVisible(true);
  };

  // Function for applying filters and sorting
  const getFilteredFiles = () => {
    let filtered = [...files];
    
    // Filter by file type
    if (filterType !== 'all') {
      filtered = filtered.filter(file => {
        const fileType = getFileCategory(file);
        return fileType === filterType;
      });
    }
    
    // Sort files
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.filename.localeCompare(b.filename);
      } else if (sortBy === 'date') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); // newest first
      } else if (sortBy === 'size') {
        return (b.size || 0) - (a.size || 0); // largest first
      }
      return 0;
    });
    
    return filtered;
  };

  // Get file category for filtering
  const getFileCategory = (file) => {
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

  const filteredFiles = getFilteredFiles();

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        marginBottom: "16px",
        position: "relative",
        zIndex: 1
      }}>
        <Title level={3} style={{ 
          margin: 0, 
          color: themeColors.textPrimary,
          position: "relative",
          display: "flex",
          alignItems: "center"
        }}>
          <span style={{ 
            background: themeColors.gradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 600,
            display: "inline-block"
          }}>
            ไฟล์ที่อัพโหลดแล้ว
          </span>
        </Title>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <Button
            type="default"
            icon={<RedoOutlined />}
            onClick={fetchFiles}
            size="middle"
            style={{ 
              borderRadius: '8px',
              border: '1px solid rgba(67, 97, 238, 0.1)',
              background: 'rgba(67, 97, 238, 0.03)',
              color: themeColors.textPrimary
            }}
          >
            Refresh
          </Button>

          <Text type="secondary" style={{ marginLeft: "12px", display: "flex", alignItems: "center" }}>
            <InfoCircleOutlined style={{ marginRight: "6px", color: themeColors.primary }} />
            <span style={{ 
              background: themeColors.accent,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 500
            }}>
              {files.length} ไฟล์
            </span>
          </Text>
        </div>
      </div>
      
      <Divider style={{ 
        margin: "16px 0 24px", 
        borderColor: "rgba(67, 97, 238, 0.08)"
      }} />

      {/* Filter controls component */}
      <FileFilterControls 
        filterType={filterType}
        setFilterType={setFilterType}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        themeColors={themeColors}
      />

      {loading ? (
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center", 
          padding: "60px 0",
          gap: "16px"
        }}>
          <Spin size="large" />
          <div style={{ 
            marginTop: "16px", 
            color: themeColors.primary, 
            fontWeight: 500
          }}>
            กำลังโหลดไฟล์...
          </div>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div style={{
          padding: "60px 0",
          textAlign: "center",
          background: "rgba(67, 97, 238, 0.02)",
          borderRadius: "16px",
          border: "1px dashed rgba(67, 97, 238, 0.1)"
        }}>
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description={
              <div>
                <p style={{ color: themeColors.textPrimary, fontWeight: 500, marginBottom: "8px" }}>
                  ไม่พบไฟล์ที่ตรงตามเงื่อนไข
                </p>
                <Text type="secondary">ลองเปลี่ยนตัวกรองหรืออัปโหลดไฟล์ใหม่</Text>
              </div>
            }
          />
        </div>
      ) : viewMode === 'grid' ? (
        <FileGridView
          files={filteredFiles}
          onPreview={handlePreview}
          onDelete={handleDelete}
          themeColors={themeColors}
        />
      ) : (
        <FileTableView
          files={filteredFiles}
          onPreview={handlePreview}
          onDelete={handleDelete}
          themeColors={themeColors}
        />
      )}

      {/* File preview modal */}
      <FilePreviewModal
        visible={previewVisible}
        title={previewTitle}
        imageUrl={previewImage}
        onClose={() => setPreviewVisible(false)}
        themeColors={themeColors}
      />
    </div>
  );
}

export default FileList;