import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import UsersPage from "./components/UsersPage";
import { useSelector } from "react-redux";
import { Layout } from "antd";
import LayoutHeader from "./components/LayoutHeader";
import { RootState } from "./app/store";

function App() {
  const token = useSelector((state: RootState) => state.auth.token);
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <LayoutHeader />
        <Layout.Content style={{ padding: "24px" }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/users"
              element={token ? <UsersPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/"
              element={<Navigate to={token ? "/users" : "/login"} />}
            />
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </Layout.Content>
      </Layout>
    </Router>
  );
}

export default App;
