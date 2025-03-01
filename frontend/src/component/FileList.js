import React, { useState, useEffect } from "react";
import { 
  Upload, 
  Button, 
  message, 
  List, 
  Card, 
  Modal, 
  Image, 
  Typography, 
  Row, 
  Col, 
  Spin, 
  Empty, 
  Popconfirm,
  Divider,
  Tag,
  Tooltip,
  Select,
  Space,
  Table,
  Dropdown,
  Menu
} from "antd";
import { 
  UploadOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
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
  SoundOutlined,
  CloudUploadOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
  RedoOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  AppstoreOutlined,
  BarsOutlined,
  MoreOutlined,
  DownloadOutlined,
  ShareAltOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;
const { Option } = Select;

function FileUpload() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // เพิ่มตัวแปรสำหรับการกรอง เรียงลำดับ และมุมมอง
  const [viewMode, setViewMode] = useState('grid'); // 'grid' หรือ 'list'
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'date', หรือ 'size'

  // Fetch files from the backend
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    fetch("http://localhost:5000/files", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched files:", data);
        setFiles(Array.isArray(data) ? data : []);
        setLoading(false);
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
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/file/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        message.success({
          content: "ลบไฟล์สำเร็จ",
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
        });
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/logs-remove-file`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        });
        setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id));
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

  // Function to determine if file is an image
  const isImageFile = (file) => {
    // ตรวจสอบจาก mimetype ก่อน
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      return true;
    }
    
    // ถ้าไม่มี mimetype ให้ตรวจสอบจากชื่อไฟล์
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
  const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on file type
  const getFileIcon = (file) => {
    if (!file.filename) return <FileUnknownOutlined style={{ fontSize: "24px" }} />;
    
    const ext = getFileExtension(file.filename);
    const style = { fontSize: "24px" };
    
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

  // ฟังก์ชันสำหรับไอคอนขนาดใหญ่
  const getLargeFileIcon = (filename) => {
    if (!filename) return <FileUnknownOutlined style={{ fontSize: "64px", color: "#8c8c8c" }} />;
    
    const ext = getFileExtension(filename);
    const style = { fontSize: "64px" };
    
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
  const getFileBackgroundColor = (file) => {
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
  const getFileTypeTag = (file) => {
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

  // ฟังก์ชันสำหรับกรองประเภทไฟล์
  const getFilteredFiles = () => {
    let filtered = [...files];
    
    // กรองตามประเภทไฟล์
    if (filterType !== 'all') {
      filtered = filtered.filter(file => {
        const ext = getFileExtension(file.filename);
        
        if (filterType === 'image' && isImageFile(file)) {
          return true;
        } else if (filterType === 'pdf' && ext === 'pdf') {
          return true;
        } else if (filterType === 'word' && (ext === 'doc' || ext === 'docx')) {
          return true;
        } else if (filterType === 'excel' && (ext === 'xls' || ext === 'xlsx' || ext === 'csv')) {
          return true;
        } else if (filterType === 'text' && ext === 'txt') {
          return true;
        } else if (filterType === 'video' && (ext === 'mp4' || ext === 'avi' || ext === 'mov' || ext === 'wmv' || ext === 'webm')) {
          return true;
        } else if (filterType === 'audio' && (ext === 'mp3' || ext === 'wav' || ext === 'ogg')) {
          return true;
        }
        
        return false;
      });
    }
    
    // เรียงลำดับ
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.filename.localeCompare(b.filename);
      } else if (sortBy === 'date') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); // เรียงจากใหม่ไปเก่า
      } else if (sortBy === 'size') {
        return (b.size || 0) - (a.size || 0); // เรียงจากใหญ่ไปเล็ก
      }
      return 0;
    });
    
    return filtered;
  };

  // สร้าง columns สำหรับมุมมองตาราง
  const columns = [
    {
      title: 'ชื่อไฟล์',
      dataIndex: 'filename',
      key: 'filename',
      render: (text, record) => (
        <Space>
          {getFileIcon(record)}
          <div>{text}</div>
        </Space>
      ),
    },
    {
      title: 'ประเภท',
      key: 'type',
      render: (_, record) => getFileTypeTag(record),
    },
    {
      title: 'วันที่อัปโหลด',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date || Date.now()).toLocaleDateString('th-TH', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      }),
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handlePreview(record)} 
          />
          <Popconfirm
            title="คุณต้องการลบไฟล์นี้หรือไม่?"
            description="การกระทำนี้ไม่สามารถเรียกคืนได้"
            onConfirm={() => handleDelete(record._id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredFiles = getFilteredFiles();

  return (
    <div style={{ padding: "20px", maxWidth: "1500px", margin: "0 auto", background: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>

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

      {/* เพิ่มส่วนกรองและเรียงลำดับ */}
      <div className="file-tools" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Select
            placeholder="ประเภทไฟล์"
            style={{ width: 150 }}
            value={filterType}
            onChange={value => setFilterType(value)}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">ทั้งหมด</Option>
            <Option value="pdf">PDF</Option>
            <Option value="image">รูปภาพ</Option>
            <Option value="word">Word</Option>
            <Option value="excel">Excel</Option>
            <Option value="text">Text</Option>
            <Option value="video">วิดีโอ</Option>
            <Option value="audio">เสียง</Option>
          </Select>
          
          <Select
            placeholder="เรียงตาม"
            style={{ width: 150 }}
            value={sortBy}
            onChange={value => setSortBy(value)}
            suffixIcon={<SortAscendingOutlined />}
          >
            <Option value="name">ชื่อ</Option>
            <Option value="date">วันที่อัปโหลด</Option>
            <Option value="size">ขนาด</Option>
          </Select>
        </Space>
        
        <Space>
          <Tooltip title="มุมมองกริด">
            <Button 
              type={viewMode === 'grid' ? 'primary' : 'default'} 
              icon={<AppstoreOutlined />} 
              onClick={() => setViewMode('grid')}
            />
          </Tooltip>
          <Tooltip title="มุมมองตาราง">
            <Button 
              type={viewMode === 'list' ? 'primary' : 'default'} 
              icon={<BarsOutlined />} 
              onClick={() => setViewMode('list')}
            />
          </Tooltip>
        </Space>
      </div>

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
        <Row gutter={[16, 16]}>
          {filteredFiles.map((file) => (
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
                      onClick={() => handlePreview(file)}
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
                      onClick={() => handlePreview(file)}
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
                      onClick={() => handlePreview(file)}
                    />
                  </Tooltip>,
                  <Tooltip title="ลบไฟล์">
                    <Popconfirm
                      title="คุณต้องการลบไฟล์นี้หรือไม่?"
                      description="การกระทำนี้ไม่สามารถเรียกคืนได้"
                      onConfirm={() => handleDelete(file._id)}
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
      ) : (
        // แสดงแบบตาราง
        <Table 
          columns={columns} 
          dataSource={filteredFiles}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      )}

      <Modal
        visible={previewVisible}
        title={<div style={{ display: 'flex', alignItems: 'center' }}>
          {getFileIcon({ filename: previewTitle })}
          <span style={{ marginLeft: '8px' }}>{previewTitle}</span>
        </div>}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            ปิด
          </Button>,
          <Button 
            key="download" 
            type="primary" 
            href={previewImage} 
            target="_blank" 
            download={previewTitle}
          >
            ดาวน์โหลด
          </Button>
        ]}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        centered
        destroyOnClose
      >
        {previewImage && (
          <>
            {/* ตรวจสอบประเภทไฟล์จากชื่อไฟล์ */}
            {previewTitle && (
              <>
                {/* รูปภาพ */}
                {previewTitle.match(/\.(jpeg|jpg|gif|png|bmp|webp)$/i) && (
                  <div style={{ textAlign: 'center' }}>
                    <Image 
                      alt="preview" 
                      style={{ maxWidth: '100%', maxHeight: '70vh' }} 
                      src={previewImage}
                      preview={false}
                    />
                  </div>
                )}
                
                {/* ไฟล์ PDF */}
                {previewTitle.match(/\.(pdf)$/i) && (
                  <iframe 
                    src={previewImage} 
                    style={{ width: '100%', height: '70vh', border: '1px solid #f0f0f0', borderRadius: '4px' }} 
                    title="PDF Preview"
                  />
                )}
                
                {/* ไฟล์วิดีโอ */}
                {previewTitle.match(/\.(mp4|webm|ogg|mov|avi|wmv)$/i) && (
                  <div style={{ textAlign: 'center', background: '#000', padding: '16px', borderRadius: '4px' }}>
                    <video 
                      controls 
                      style={{ width: '100%', maxHeight: '70vh' }} 
                      src={previewImage}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                
                {/* ไฟล์เสียง */}
                {previewTitle.match(/\.(mp3|wav|ogg)$/i) && (
                  <div style={{ textAlign: 'center', padding: '32px', background: '#fffbe6', borderRadius: '4px' }}>
                    <SoundOutlined style={{ fontSize: '64px', color: '#faad14', marginBottom: '24px' }} />
                    <div style={{ marginBottom: '24px' }}>
                      <Title level={4}>{previewTitle}</Title>
                    </div>
                    <audio 
                      controls 
                      style={{ width: '100%' }} 
                      src={previewImage}
                    >
                      Your browser does not support the audio tag.
                    </audio>
                  </div>
                )}
                
                {/* ไฟล์ประเภทอื่นๆ ที่ไม่รองรับการแสดงตัวอย่าง */}
                {!previewTitle.match(/\.(jpeg|jpg|gif|png|bmp|webp|pdf|mp4|webm|ogg|mp3|wav|mov|avi|wmv)$/i) && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    background: getFileBackgroundColor({ filename: previewTitle }),
                    borderRadius: '8px'
                  }}>
                    {getLargeFileIcon(previewTitle)}
                    <Title level={3} style={{ margin: '24px 0 8px' }}>{previewTitle}</Title>
                    <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
                      ไม่สามารถแสดงตัวอย่างได้สำหรับประเภทไฟล์นี้
                    </Paragraph>
                    <Button type="primary" size="large" href={previewImage} target="_blank" download={previewTitle}>
                      ดาวน์โหลดไฟล์
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}

export default FileUpload;