import React from "react";
import { Layout, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../app/store";

export default function LayoutHeader() {
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.auth.token);
  const navigate = useNavigate();

  function doLogout() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <Layout.Header
      style={{
        background: "#0b2233",
        color: "#fff",
        padding: "0 24px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      {token ? (
        <Button onClick={doLogout} danger>
          Logout
        </Button>
      ) : null}
    </Layout.Header>
  );
}
