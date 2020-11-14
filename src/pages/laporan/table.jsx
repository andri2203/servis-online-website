import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import firebase from "../../firebase";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          <Input />
        </Form.Item>
      ) : (
          children
        )}
    </td>
  );
};

const FormTambah = React.forwardRef((props, ref) => {
  const [btn, setbtn] = useState({ disabled: false, text: "Tambah" });
  const [formActive, setFormActive] = useState(false);
  const validate = { required: "wajib diisi", min: "terlalu sedikit" };

  const onFinishHandler = (value) => {
    setbtn({ disabled: true, text: "Loading...." });
    const last = props.data.pop();
    const item = {
      ...value,
      key: parseInt(last.key) + 1,
      row: parseInt(last.row) + 1,
    };
    const documentid = props.documentid;
    props.data.push(last, item);

    firebase
      .firestore()
      .collection("antrian")
      .doc(documentid)
      .update({
        kerusakan: props.data,
      })
      .finally(() => {
        setbtn({ disabled: false, text: "Tambah" });
        props.form.resetFields();
        Modal.success(
          {
            title: "Data berhasil dihapus",
            onOk: () => setFormActive(false),
          },
          3
        );
      })
      .catch((err) => {
        setbtn({ disabled: false, text: "Tambah" });
        props.form.resetFields();
        Modal.error({
          title: "Data gagal dihapus",
          content: err,
          onOk: () => setFormActive(false),
        });
      });
  };

  return formActive ? (
    <Form
      {...props}
      layout="inline"
      form={props.form}
      validateMessages={validate}
      onFinish={onFinishHandler}
      autoComplete="off"
    >
      <Form.Item
        label="Item Rusak"
        name="jenis"
        rules={[{ required: true, min: 5 }]}
      >
        <Input placeholder="Mohon Diisi" />
      </Form.Item>
      <Form.Item
        label="Harga Item"
        name="harga"
        rules={[{ required: true, min: 3 }]}
      >
        <Input placeholder="Mohon Diisi" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={btn.disabled}>
          {btn.text}
        </Button>
        <Button
          type="primary"
          disabled={btn.disabled}
          danger
          onClick={() => {
            setFormActive(false);
            props.form.resetFields();
          }}
        >
          Batal
        </Button>
      </Form.Item>
    </Form>
  ) : (
      <Button
        type="primary"
        style={{ marginBottom: "10px" }}
        onClick={() => setFormActive(true)}
      >
        Tambah Data
      </Button>
    );
});

const TableLaporan = function () {
  var [pageS, setpageS] = useState(50);
  var [loading, setloading] = useState(true);
  var [data, setdata] = useState([]);
  var [visible, setvisible] = useState(false);
  var [modalKey, setmodalKey] = useState();
  var [editingKey, seteditingKey] = useState(null);
  const [form] = Form.useForm();
  const [formTambah] = Form.useForm();

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      jenis: "",
      harga: "",
      ...record,
    });
    seteditingKey(record.key);
  };

  const handleDeleteItem = (update) => {
    firebase
      .firestore()
      .collection("antrian")
      .doc(modalKey)
      .update({
        kerusakan: update,
      })
      .finally(() => {
        Modal.success(
          {
            title: "Data berhasil dihapus",
          },
          3
        );
      })
      .catch((err) => {
        Modal.error({
          title: "Data gagal dihapus",
          content: err,
        });
      });
  };

  const deleteRecord = (key) => {
    firebase
      .firestore()
      .collection("antrian")
      .doc(key)
      .delete()
      .finally(() => {
        Modal.success(
          {
            title: "Data berhasil dihapus",
          },
          3
        );
      })
      .catch((err) => {
        Modal.error({
          title: "Data gagal dihapus",
          content: err,
        });
      });
  };

  const columns = [
    {
      key: "noAntrian",
      dataIndex: "noAntrian",
      title: "No. Antrian",
    },
    {
      key: "nama",
      dataIndex: "nama",
      title: "Nama",
    },
    {
      key: "plat",
      dataIndex: "plat",
      title: "No. Plat",
    },
    {
      key: "motor",
      dataIndex: "motor",
      title: "Motor",
    },
    {
      key: "harga",
      dataIndex: "harga",
      title: "Harga",
    },
    {
      key: "action",
      dataIndex: "action",
      title: "Action",
      render: (text, record) => {
        const save = async (key) => {
          try {
            const row = await form.validateFields();
            const newData = [...text];
            const index = newData.findIndex((item) => key === item.key);
            const item = { ...newData[index], ...row };
            const update = [...newData.filter((item, i) => i !== index), item];

            firebase
              .firestore()
              .collection("antrian")
              .doc(modalKey)
              .update({
                kerusakan: update,
              })
              .finally(() => {
                Modal.success(
                  {
                    title: "Update Berhasil!!!",
                  },
                  2
                );
              })
              .catch((err) => console.log(`update gagal` + err));
            seteditingKey(null);
          } catch (error) {
            console.log("Error Editing :" + error);
          }
        };

        var colKerusakan = [
          {
            key: "row",
            dataIndex: "row",
            title: "#",
            width: 50,
          },
          {
            key: "jenis",
            dataIndex: "jenis",
            title: "Item Rusak",
            editable: true,
          },
          {
            key: "harga",
            dataIndex: "harga",
            title: "Harga Item",
            editable: true,
          },
          {
            key: "proces",
            dataIndex: "proces",
            title: "Proses",
            render: (_, record) => {
              const editable = isEditing(record);
              return editable ? (
                <span>
                  <Button onClick={() => save(record.key)}>Simpan</Button>
                  <Popconfirm
                    title="Yakin ingin batalkan?"
                    onConfirm={() => seteditingKey(null)}
                  >
                    <Button>Batal</Button>
                  </Popconfirm>
                </span>
              ) : (
                  <>
                    <Button
                      type="primary"
                      disabled={editingKey !== null}
                      onClick={() => edit(record)}
                    >
                      Edit
                  </Button>
                    <Popconfirm
                      title="Yakin ingin dihapus?"
                      onConfirm={() =>
                        handleDeleteItem(
                          text.filter((item, i) => item.key !== record.key)
                        )
                      }
                    >
                      <Button
                        type="primary"
                        danger
                        disabled={editingKey !== null}
                      >
                        <DeleteOutlined />
                      </Button>
                    </Popconfirm>
                  </>
                );
            },
          },
        ];
        const mergedColumns = colKerusakan.map((col) => {
          if (!col.editable) {
            return col;
          }

          return {
            ...col,
            onCell: (record) => ({
              record,
              inputType: col.dataIndex === "harga" ? "number" : "text",
              dataIndex: col.dataIndex,
              title: col.title,
              editing: isEditing(record),
            }),
          };
        });
        return (
          <React.Fragment>
            <Button
              type="primary"
              onClick={(e) => {
                setvisible(true);
                setmodalKey(record.key);
              }}
            >
              Lihat
            </Button>
            <Button
              type="primary"
              danger
              onClick={() =>
                Modal.confirm({
                  title: "Yakin ingin hapus laporan ini?",
                  onOk: () => deleteRecord(record.key),
                })
              }
            >
              <DeleteOutlined />
            </Button>
            <Modal
              key={record.key}
              centered={true}
              title="Data Kerusakan Motor"
              visible={visible && modalKey === record.key}
              onCancel={() => {
                setvisible(false);
                seteditingKey(null);
              }}
              footer={false}
              width="60%"
            >
              <h3>No. Antrian : {record.noAntrian}</h3>
              <FormTambah
                documentid={modalKey}
                data={text}
                form={formTambah}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              />
              <Form form={form} component={false}>
                <Table
                  columns={mergedColumns}
                  dataSource={text}
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  footer={() => (
                    <h3>
                      Total : Rp.{" "}
                      {text.length === 0
                        ? 0
                        : text.length === 1
                          ? text[0].harga
                          : text.reduce((x, y) => x + parseInt(y.harga), 0)}
                    </h3>
                  )}
                />
              </Form>
            </Modal>
          </React.Fragment>
        );
      },
      width: 150,
    },
  ];

  useEffect(() => {
    firebase
      .firestore()
      .collection("antrian")
      .where("success", "==", 2)
      .orderBy("daftar", "desc")
      .onSnapshot((snap) => {
        setloading(false);
        let qry = snap.docs.map((doc, i) => ({
          key: doc.id,
          noAntrian: doc.id,
          nama: doc.data()["nama"],
          plat: `${doc.data()["plat"]}`,
          motor: doc.data()["motor"],
          harga:
            "RP. " +
            doc.data()["kerusakan"].reduce((x, y) => x + parseInt(y.harga), 0),
          action: doc.data()["kerusakan"],
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
};

export default TableLaporan;
