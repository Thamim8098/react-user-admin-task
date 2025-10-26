import React, { useEffect } from "react";
import { Form, Input, Button, Card, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../app/store";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((s: RootState) => s.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.token) navigate("/users");
  }, [auth.token, navigate]);

  const onFinish = (values: { email: string; password: string }) => {
    dispatch(login(values));
  };

  return (
    <div
      style={{
        display: "flex",
        height: "80vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card style={{ width: 420 }}>
        <h2 style={{ textAlign: "center" }}>Sign in</h2>
        {auth.error && (
          <Alert
            type="error"
            message={auth.error}
            style={{ marginBottom: 12 }}
          />
        )}
        <Form
          name="login"
          onFinish={onFinish}
          initialValues={{
            email: "eve.holt@reqres.in",
            password: "cityslicka",
          }}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input email" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input password" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={auth.status === "loading"}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
