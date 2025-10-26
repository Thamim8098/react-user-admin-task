import React from "react";
import { Card, Avatar } from "antd";
import { User } from "../features/users/usersSlice";

interface UserCardProps {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <Card hoverable style={{ width: 260, margin: 12, textAlign: "center" }}>
      <Avatar size={80} src={user.avatar} />
      <h3 style={{ marginTop: 12 }}>
        {(user.first_name || "") + " " + (user.last_name || "")}
      </h3>
      <div style={{ color: "#888" }}>{user.email}</div>
    </Card>
  );
}
