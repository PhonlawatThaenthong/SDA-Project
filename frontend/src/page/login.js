import React, { useState } from "react";
import { Button, Checkbox, Form, Grid, Input, theme, Typography, Card } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

const LoginPage = () => {
  const { token } = useToken();
  const screens = useBreakpoint();
  const [isSignUp, setIsSignUp] = useState(false); // state สำหรับ toggle ระหว่าง Sign In กับ Sign Up

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

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
      position: "relative",
      width: "380px",
      zIndex: 10,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      borderRadius: token.borderRadiusLG,
      padding: "24px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
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
    formContainer: {
      transition: "opacity 0.3s ease-in-out", // ใช้ transition แบบง่ายๆ
      opacity: isSignUp ? 1 : 0,
    },
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={3}>{isSignUp ? "Sign Up" : "Sign In"}</Title>
          <Text style={styles.text}>
            {isSignUp
              ? "Create your account to get started."
              : "Welcome back! Please enter your details to sign in."}
          </Text>
        </div>

        {/* Form สำหรับ Sign In */}
        <div style={{ ...styles.formContainer, opacity: isSignUp ? 0 : 1 }}>
          {!isSignUp && (
            <Form name="normal_login" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical" requiredMark="optional">
              <Form.Item
                name="email"
                rules={[{ type: "email", required: true, message: "Please input your Email!" }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please input your Password!" }]}
              >
                <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a style={styles.forgotPassword} href="">Forgot password?</a>
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit">
                  Log in
                </Button>
                <div style={styles.footer}>
                  <Text style={styles.text}>Don't have an account?</Text>{" "}
                  <Link onClick={() => setIsSignUp(!isSignUp)}>Sign up now</Link>
                </div>
              </Form.Item>
            </Form>
          )}
        </div>

        {/* Form สำหรับ Sign Up */}
        <div style={{ ...styles.formContainer, opacity: isSignUp ? 1 : 0 }}>
          {isSignUp && (
            <Form name="sign_up_form" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical" requiredMark="optional">
              <Form.Item
                name="email"
                rules={[{ type: "email", required: true, message: "Please input your Email!" }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please input your Password!" }]}
              >
                <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("The two passwords do not match!"));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} type="password" placeholder="Confirm Password" />
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit">
                  Sign Up
                </Button>
                <div style={styles.footer}>
                  <Text style={styles.text}>Already have an account?</Text>{" "}
                  <Link onClick={() => setIsSignUp(!isSignUp)}>Log in</Link>
                </div>
              </Form.Item>
            </Form>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
