import React from "react";
import { Button, Checkbox, Form, Grid, Input, theme, Typography, Card } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

const LoginPage = () => {
  const { token } = useToken();
  const screens = useBreakpoint();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundImage: "url('https://wallpapersmug.com/download/1920x1080/a3d4db/beautiful-evening-landscape-minimal.jpeg')", // ใส่ URL รูปพื้นหลัง
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      padding: screens.md ? "0" : "20px",
    },
    overlay: {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      backgroundColor: "rgba(0, 0, 0, 0.3)", // เพิ่ม Layer มืดให้พื้นหลัง
      backdropFilter: "blur(6px)", // ทำให้พื้นหลังเบลอ
    },
    card: {
      position: "relative",
      width: "380px",
      zIndex: 10,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      borderRadius: token.borderRadiusLG,
      padding: "24px",
      backgroundColor: "rgba(255, 255, 255, 0.9)", // ทำให้ Card โปร่งแสง
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    forgotPassword: {
      float: "right",
    },
    text: {
      color: token.colorTextSecondary,
    },
  };


  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={3}>Sign in</Title>
          <Text style={styles.text}>Welcome back! Please enter your details to sign in.</Text>
        </div>
        <Form name="normal_login" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical" requiredMark="optional">
          <Form.Item name="email" rules={[{ type: "email", required: true, message: "Please input your Email!" }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
            <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
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
              <Text style={styles.text}>Don't have an account?</Text> <Link href="">Sign up now</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
