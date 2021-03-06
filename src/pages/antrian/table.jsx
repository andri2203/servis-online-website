import React, { useState, useEffect } from "react";
import { Table, Button, message, Modal, Form, Input } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import firebase from "../../firebase";

const TableAntrian = function () {
  const [form] = Form.useForm();
  var [pageS, setpageS] = useState(50);
  var [loading, setloading] = useState(true);
  var [data, setdata] = useState([]);
  const [visible, setVisible] = useState(false);
  var [dataItem, setdataItem] = useState([]);
  const [consfirm, setconsfirm] = useState(false);
  var [modal, setmodal] = useState();
  // var dataItem = [];

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
      key: "tglWaktu",
      dataIndex: "tglWaktu",
      title: "Tgl Waktu",
    },

    {
      key: "montir",
      dataIndex: "montir",
      title: "Montir",
    },
    {
      key: "servis",
      dataIndex: "servis",
      title: "Servis",
    },
    {
      key: "status",
      dataIndex: "status",
      title: "Status",
      render: (status) => {
        if (status === 1) {
          return <span style={{ padding: "7px 15px", background: 'green', display: "inline-block", color: 'white' }}>Sedang Dikerjakan</span>
        } else if (status === 0) {
          return <span style={{ padding: "7px 15px", background: '#ffd700', display: "inline-block", color: 'white' }}>Menunggu</span>

        }
      }
    },
    {
      key: "action",
      dataIndex: "action",
      title: "Action",
      render: ({ key, data }) => {
        const validate = { required: "wajib diisi", min: "terlalu sedikit" };
        if (data['success'] === 1) {

          return <React.Fragment>
            <Button
              icon={<EditOutlined />}
              type="primary"
              className="success"
              onClick={(e) => {
                setVisible(true);
                setmodal(key);
              }}
            />
            <Modal
              centered={true}
              title="Form Kerusakan Motor"
              visible={visible && modal === key}
              onCancel={() => {
                setVisible(false);
                setdataItem([]);
                form.resetFields();
              }}
              onOk={() => handleInsertDataItem(key)}
              width="60%"
              confirmLoading={consfirm}
            >
              <Form
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                  marginTop: "0.5rem",
                }}
                layout="inline"
                form={form}
                validateMessages={validate}
                onFinish={handleDataItem}
                autoComplete="off"
              >
                <Form.Item
                  label="Item Rusak"
                  name="jenis"
                  rules={[{ required: true, min: 3 }]}
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
                  <Button type="primary" htmlType="submit">
                    Tambah
                  </Button>
                </Form.Item>
              </Form>
              <Table
                columns={[
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
                  },
                  {
                    key: "harga",
                    dataIndex: "harga",
                    title: "Harga Item",
                  },
                  {
                    key: "action",
                    dataIndex: "action",
                    title: "Action",
                    render: (text, record) => {
                      return (
                        <Button
                          style={{ color: "red" }}
                          onClick={() => {
                            const ds = [...dataItem];
                            setdataItem(
                              ds.filter((item) => item.key !== record.key)
                            );
                          }}
                        >
                          Hapus
                        </Button>
                      );
                    },
                  },
                ]}
                dataSource={dataItem}
                footer={() => (
                  <h3>
                    Total : Rp.{" "}
                    {dataItem.length === 0
                      ? 0
                      : dataItem.length === 1
                        ? dataItem[0].harga
                        : dataItem.reduce((x, y) => x + parseInt(y.harga), 0)}
                  </h3>
                )}
              />
            </Modal>
          </React.Fragment>
        } else if (data['success'] === 0) {
          return <React.Fragment>
            <Button
              type="primary"
              icon={<ExclamationCircleOutlined />}
              onClick={() => {
                const modal = Modal.confirm({
                  title: "Konfirmasi",
                  content: `Motor ${data['motor']} dari ${data['nama']} akan di servis.`,
                  cancelText: "Jangan Sekarang",
                  okText: "Servis Sekarang",
                });
                modal.update({
                  onOk: function (e) {
                    handleServis(key, modal)
                  },
                });

              }}
            >
              Kerjakan
            </Button>
            <Button
              icon={<DeleteOutlined />}
              type="primary"
              className="danger"
              danger
              onClick={() => {
                const modal = Modal.confirm({
                  title: "Anda akan menghapus data ini?",
                  content: key + " akan dihapus permanen.",
                  cancelText: "Tidak Sekarang",
                  okText: "Ya Sekarang",
                });
                modal.update({
                  onOk: function (e) {
                    handleDelete(key, modal);
                  },
                });

              }}
            >Hapus</Button>
          </React.Fragment>
        }

      },
      width: 150,
    },
  ];

  const handleDataItem = (value) => {
    let item = [
      ...dataItem,
      {
        key: dataItem.length,
        row: dataItem.length + 1,
        jenis: value.jenis,
        harga: value.harga,
      },
    ];
    setdataItem(item);
    form.resetFields();
  };

  const handleInsertDataItem = (key) => {
    if (dataItem.length > 0) {
      setconsfirm(true);
      firebase
        .firestore()
        .collection("antrian")
        .doc(key)
        .update({
          kerusakan: dataItem,
          success: 2,
        })
        .finally(() =>
          message.success(
            `${dataItem.length} Item telah ditambahkan ke ${key}`,
            3,
            () => {
              setconsfirm(false);
              setdataItem([]);
              form.resetFields();
              setVisible(false);
            }
          )
        );
    } else {
      message.info("Isi Data dulu", 5);
    }
  };

  const handleServis = (key, modal) => {
    firebase.firestore().collection('antrian').doc(key).update({
      success: 1
    }).finally(() => {
      modal.destroy();
      setTimeout(() => {
        message.success("Motor Telah masuk ruangan servis.", 5);
      }, 1000);
    })
  }

  const handleDelete = (key, modal) => {
    firebase
      .firestore()
      .collection("antrian")
      .doc(key)
      .delete()
      .finally(() => {
        modal.destroy();
        setTimeout(() => {
          message.success("Data berhasil dihapus.", 5);
        }, 1000);
      })
      .catch((reason) => {
        modal.destroy();
        setTimeout(() => {
          message.error(reason, 7);
        }, 1000);
      });
  };

  var dateFormat = (dateStamp) => {
    var date = new Date(dateStamp);
    var format = new Intl.DateTimeFormat("id", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    var [
      { value: day },
      ,
      { value: month },
      ,
      { value: year },
      ,
      { value: hour },
      ,
      { value: minute },
    ] = format.formatToParts(date);

    return `${day} ${month} ${year}, ${hour}:${minute}`;
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("antrian")
      .where("success", "<", 2)
      .orderBy('success', 'desc')
      .orderBy('daftar', 'desc')
      .onSnapshot((snap) => {
        setloading(false);
        let qry = snap.docs.map((doc, i) => ({
          key: doc.id,
          noAntrian: doc.id,
          nama: doc.data()["nama"],
          plat: `${doc.data()["plat"]}`,
          motor: doc.data()["motor"],
          tglWaktu: dateFormat(doc.data()["daftar"].seconds * 1000),
          montir: doc.data()["montir"],
          servis: doc.data()["servis"],
          status: doc.data()["success"],
          action: { key: doc.id, data: doc.data() },
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

export default TableAntrian;
