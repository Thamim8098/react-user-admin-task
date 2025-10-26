import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import { User } from "../features/users/usersSlice";

interface UserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<User, "id">) => void;
  initial?: User | null;
}

export default function UserModal({
  visible,
  onCancel,
  onSubmit,
  initial,
}: UserModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(
      initial || { first_name: "", last_name: "", email: "", avatar: "" }
    );
  }, [initial, form]);

  return (
    <Modal
      open={visible}
      title={initial ? "Edit User" : "Create New User"}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={(vals) => onSubmit(vals)}>
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Please enter first name" />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Please enter last name" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true }, { type: "email" }]}
        >
          <Input placeholder="Please enter email" />
        </Form.Item>
        <Form.Item
          label="Profile Image Link"
          name="avatar"
          rules={[{ required: true }, { type: "url" }]}
        >
          <Input placeholder="Please enter profile image link" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
