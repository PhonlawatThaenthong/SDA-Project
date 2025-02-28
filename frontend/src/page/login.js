import React, { useState } from "react";
import { Button, Checkbox, Form, Grid, Input, theme, Typography, Card, message } from "antd";
import { LockOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { token } = useToken();
  const screens = useBreakpoint();
  const [isSignUp, setIsSignUp] = useState(false); // Toggle Sign In / Sign Up

  const onFinish = async (values) => {
    try {
      if (isSignUp) {
        // Signup API call
        const { email, username, password } = values;
        const res = await axios.post("http://localhost:5000/signup", { email, username, password });
        message.success("Sign up successful!");
        setIsSignUp(false);
      } else {
        // Login API call
        const res = await axios.post("http://localhost:5000/login", values);
        
        // เก็บ token และข้อมูลผู้ใช้ลงใน localStorage
        if (res.data && res.data.token) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          message.success("Login successful!");
          navigate("/");
        } else if (res.data === "User signed in") {
          // กรณีเซิร์ฟเวอร์ยังไม่ได้แก้ไขให้ส่ง token กลับมา
          message.success("Login successful!");
          navigate("/");
        } else {
          message.error("Login failed: No token received");
        }
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // สร้างฟังก์ชันสำหรับตรวจสอบว่ามี token อยู่ใน localStorage หรือไม่
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  };

  // เรียกใช้ฟังก์ชัน checkAuth เมื่อคอมโพเนนต์ถูกโหลด
  React.useEffect(() => {
    checkAuth();
  }, []);

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundImage: "url('https://wallpapersmug.com/download/1920x1080/a3d4db/beautiful-evening-landscape-minimal.jpeg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      padding: screens.md ? "0" : "20px",
    },
    card: {
      width: "380px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      borderRadius: token.borderRadiusLG,
      padding: "24px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
    footer: { marginTop: token.marginLG, textAlign: "center", width: "100%" },
    forgotPassword: { float: "right" },
    text: { color: token.colorTextSecondary },
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={3}>{isSignUp ? "Sign Up" : "Sign In"}</Title>
          <Text style={styles.text}>
            {isSignUp ? "Create an account to get started." : "Welcome back! Please sign in."}
          </Text>
        </div>

        {/* Sign In Form */}
        {!isSignUp && (
          <Form name="login_form" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
            <Form.Item name="email" rules={[{ type: "email", required: true, message: "Please input your Email!" }]}>
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a style={styles.forgotPassword} href="">Forgot password?</a>
            </Form.Item>
            <Form.Item>
              <Button block type="primary" htmlType="submit">Log in</Button>
              <div style={styles.footer}>
                <Text style={styles.text}>Don't have an account?</Text>{" "}
                <Link onClick={() => setIsSignUp(true)}>Sign up now</Link>
              </div>
            </Form.Item>
          </Form>
        )}

        {/* Sign Up Form */}
        {isSignUp && (
          <Form name="signup_form" onFinish={onFinish} layout="vertical">
            <Form.Item name="username" rules={[{ required: true, message: "Please input your Username!" }]}> 
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item name="email" rules={[{ type: "email", required: true, message: "Please input your Email!" }]}> 
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}> 
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) return Promise.resolve();
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
            </Form.Item>
            <Form.Item>
              <Button block type="primary" htmlType="submit">Sign Up</Button>
              <div style={styles.footer}>
                <Text style={styles.text}>Already have an account?</Text>{" "}
                <Link onClick={() => setIsSignUp(false)}>Log in</Link>
              </div>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;