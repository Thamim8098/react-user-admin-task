import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsersPage,
  createUser,
  updateUser,
  deleteUser,
  setViewMode,
  setSearch,
  User,
} from "../features/users/usersSlice";
import {
  Table,
  Button,
  Space,
  Input,
  Card,
  Row,
  Col,
  Spin,
  Popconfirm,
} from "antd";
import UserModal from "./UserModal";
import UserCard from "./UserCard";
import { RootState, AppDispatch } from "../app/store";
import type { ColumnsType } from "antd/es/table";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, total_pages, viewMode, search } = useSelector(
    (s: RootState) => s.users
  );

  const [page, setPage] = React.useState(1);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editing, setEditing] = React.useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsersPage(page));
  }, [dispatch, page]);

  const handleCreate = (vals: Omit<User, "id">) => {
    dispatch(createUser(vals));
    setModalVisible(false);
  };

  const handleUpdate = (vals: Omit<User, "id">) => {
    if (editing) {
      dispatch(updateUser({ id: editing.id, ...vals }));
      setModalVisible(false);
      setEditing(null);
    }
  };

  const handleDelete = (id: number) => {
    dispatch(deleteUser(id));
  };

  const filtered = React.useMemo(() => {
    if (!search) return list;
    const s = search.toLowerCase();
    return list.filter((u: User) =>
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(s)
    );
  }, [list, search]);

  const columns: ColumnsType<User> = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      render: (text: string) => (
        <img src={text} alt="avatar" style={{ width: 40, borderRadius: 20 }} />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text: string) => <a>{text}</a>,
    },
    { title: "First Name", dataIndex: "first_name" },
    { title: "Last Name", dataIndex: "last_name" },
    {
      title: "Action",
      render: (_: any, record: User) => (
        <Space>
          <Button
            onClick={() => {
              setEditing(record);
              setModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card>
        <Space style={{ marginBottom: 12 }}>
          <Input.Search
            placeholder="Search by name"
            onSearch={(v) => dispatch(setSearch(v))}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            style={{ width: 240 }}
          />
          <Button
            onClick={() =>
              dispatch(setViewMode(viewMode === "table" ? "card" : "table"))
            }
          >
            Switch to {viewMode === "table" ? "Card" : "Table"}
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setEditing(null);
              setModalVisible(true);
            }}
          >
            Create User
          </Button>
        </Space>

        {loading ? <Spin /> : null}

        {viewMode === "table" ? (
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={{
              current: page,
              total: total_pages * 6,
              onChange: (p) => setPage(p),
            }}
          />
        ) : (
          <Row gutter={[16, 16]}>
            {filtered.map((u: User) => (
              <Col key={u.id}>
                <UserCard
                  user={u}
                  onEdit={() => {
                    setEditing(u);
                    setModalVisible(true);
                  }}
                  onDelete={() => handleDelete(u.id)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Card>

      <UserModal
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditing(null);
        }}
        initial={editing}
        onSubmit={(vals) => {
          if (editing) handleUpdate(vals);
          else handleCreate(vals);
        }}
      />
    </>
  );
}
