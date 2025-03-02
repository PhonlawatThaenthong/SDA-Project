import React, { useState, useEffect } from "react";
import { message, Spin, Empty, Typography, Divider, Button } from "antd";
import { InfoCircleOutlined, RedoOutlined, CheckCircleOutlined } from "@ant-design/icons";
import FileFilterControls from "./FileListComponent/FileFilterControls";
import FilePreviewModal from "./FileListComponent/FilePreviewModal";
import FileGridView from "./FileListComponent/FileGridView";
import FileTableView from "./FileListComponent/FileTableView";
import { fetchFiles as apiFetchFiles, deleteFile } from "./FileListComponent/fileApi";
import { isImageFile, getFileExtension, getFileCategory } from "./FileListComponent/fileUtils";

const { Title, Text } = Typography;

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
    fetchFiles();
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
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
        });
        setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id));
        
        // เรียกใช้ onFileChange หลังจากลบไฟล์เสร็จ เพื่ออัปเดตข้อมูลพื้นที่จัดเก็บ
        if (onFileChange) {
          onFileChange();
        }
        
        // บันทึกประวัติการลบไฟล์
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5000/logs-remove-file`, {
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
    setPreviewImage(`http://localhost:5000/file/${file._id}`);
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
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <Title level={3} style={{ margin: 0 }}>
          ไฟล์ที่อัพโหลดแล้ว
        </Title>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <Button
            type="default"
            icon={<RedoOutlined />}
            onClick={fetchFiles}
            size="small"
            style={{ borderRadius: '4px' }}
          >
            Refresh
          </Button>

          <Text type="secondary" style={{ marginLeft: "8px" }}>
            <InfoCircleOutlined style={{ marginRight: "4px" }} />
            {files.length} ไฟล์
          </Text>
        </div>
      </div>
      
      <Divider style={{ margin: "16px 0 24px" }} />

      {/* Filter controls component */}
      <FileFilterControls 
        filterType={filterType}
        setFilterType={setFilterType}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px", color: "#1890ff" }}>กำลังโหลดไฟล์...</div>
        </div>
      ) : filteredFiles.length === 0 ? (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description={
            <div>
              <p>ไม่พบไฟล์ที่ตรงตามเงื่อนไข</p>
              <Text type="secondary">ลองเปลี่ยนตัวกรองหรืออัปโหลดไฟล์ใหม่</Text>
            </div>
          } 
          style={{ padding: "60px 0" }} 
        />
      ) : viewMode === 'grid' ? (
        <FileGridView
          files={filteredFiles}
          onPreview={handlePreview}
          onDelete={handleDelete}
        />
      ) : (
        <FileTableView
          files={filteredFiles}
          onPreview={handlePreview}
          onDelete={handleDelete}
        />
      )}

      {/* File preview modal */}
      <FilePreviewModal
        visible={previewVisible}
        title={previewTitle}
        imageUrl={previewImage}
        onClose={() => setPreviewVisible(false)}
      />
    </div>
  );
}

export default FileList;