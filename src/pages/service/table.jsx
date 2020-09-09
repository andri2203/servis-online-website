import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Checkbox,
  Table,
  Tag,
  Button,
  message,
  Modal,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import firebase from "../../firebase";

function TableServices() {
  var [pageS, setpageS] = useState(50);
  var [loading, setloading] = useState(true);
  var [data, setdata] = useState([]);
  const [form] = Form.useForm();
  const options = [
    { label: "Berat", value: "Berat" },
    { label: "Ringan", value: "Ringan" },
  ];
  const validate = { required: "wajib diisi", min: "terlalu sedikit" };
  var [visible, setvisible] = useState(false);
  var [modal, setmodal] = useState();
  const [btn, setbtn] = useState({ disabled: false, text: "Update" });

  const handleDelete = (key) => {
    firebase
      .firestore()
      .collection("montir")
      .doc(key)
      .delete()
      .finally(() => {
        setTimeout(() => {
          message.success("Data berhasil dihapus.", 5);
        }, 1000);
      })
      .catch((reason) => {
        setTimeout(() => {
          message.error(reason, 7);
        }, 1000);
      });
  };

  const columns = [
    {
      key: "rowNum",
      dataIndex: "rowNum",
      title: "#",
      width: 50,
    },
    {
      key: "montir",
      dataIndex: "montir",
      title: "Nama Montir",
    },
    {
      key: "kategori",
      dataIndex: "kategori",
      title: "Kategori",

      render: (kategori) => {
        return (
          <span>
            {kategori.map((tag) => {
              let color = tag === "Berat" ? "volcano" : "green";
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        );
      },
    },
    {
      key: "kode",
      dataIndex: "kode",
      title: "Kode Montir",
    },
    {
      key: "action",
      dataIndex: "action",
      title: "Action",
      render: (text, record) => {
        return (
          <React.Fragment>
            <Button
              icon={<EditOutlined />}
              type="primary"
              className="success"
              onClick={() => {
                setvisible(true);
                setmodal(record.key);

                form.setFieldsValue({
                  u_nama: text["nama"],
                  u_kategori: text["kategori"],
                  u_kode: text["kode"],
                });
              }}
            />
            <Button
              icon={<DeleteOutlined />}
              type="primary"
              className="danger"
              danger
              onClick={() => {
                const modal = Modal.confirm({
                  title: "Anda akan menghapus data ini?",
                  content:
                    text["nama"] +
                    " akan dihapus dari daftar montir secara permanen. Apakah anda ingin menghapusnya? ",
                  cancelText: "Tidak Sekarang",
                  okText: "Ya Sekarang",
                });
                modal.update({
                  onOk: function () {
                    handleDelete(record.key, modal);
                  },
                });
              }}
            />
            <Modal
              key={record.key}
              centered={true}
              title="Update Data Montir"
              visible={visible && modal === record.key}
              onCancel={() => {
                if (btn.disabled === false) {
                  setvisible(false);
                  setmodal(null);
                  form.resetFields();
                }
              }}
              footer={false}
              width="40%"
            >
              <Form
                form={form}
                validateMessages={validate}
                onFinish={handleFormUpdate}
                autoComplete="off"
              >
                <Form.Item
                  label="Nama Montir"
                  name="u_nama"
                  rules={[{ required: true, min: 5 }]}
                >
                  <Input placeholder="Mohon Diisi" />
                </Form.Item>
                <Form.Item
                  label="Kategori"
                  name="u_kategori"
                  rules={[{ required: true }]}
                >
                  <Checkbox.Group
                    options={options}
                    onChange={(check) => console.log(check)}
                  />
                </Form.Item>
                <Form.Item
                  label="Kode Montir"
                  name="u_kode"
                  rules={[{ required: true, min: 3 }]}
                >
                  <Input placeholder="Mohon Diisi" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={btn.disabled}
                  >
                    {btn.text}
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </React.Fragment>
        );
      },
      width: 150,
    },
  ];

  const handleFormUpdate = (value) => {
    setbtn({ disabled: true, text: "Loading..." });

    const update = firebase.firestore().collection("montir").doc(modal).update({
      nama: value.u_nama,
      kategori: value.u_kategori,
      kode: value.u_kode,
    });

    return update
      .finally(() => {
        setvisible(false);
        setmodal(null);
        form.resetFields();
        setbtn({ disabled: false, text: "Update" });
        return Modal.success({
          title: "Berhasil!!!",
          content: "Data Montir berhasil diubah",
        });
      })
      .catch((reason) => {
        setbtn({ disabled: false, text: "Update" });
        return Modal.error({
          title: "Maaf!!!",
          content: "Data Montir gagal diubah. " + reason,
        });
      });
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("montir")
      .orderBy("nama", "asc")
      .onSnapshot((snapshot) => {
        setloading(false);
        let qry = snapshot.docs.map((doc, i) => ({
          key: doc.id,
          rowNum: i + 1,
          montir: doc.data()["nama"],
          kategori: doc.data()["kategori"],
          kode: doc.data()["kode"],
          action: doc.data(),
        }));
        setdata(qry);
      });
  }, []);

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{
        pageSize: pageS,
        onChange: (page, pageSize) => {
          setpageS(pageSize);
        },
      }}
      scroll={{ y: 350 }}
      loading={loading}
    />
  );
}

export default TableServices;
