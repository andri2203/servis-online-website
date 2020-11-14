import React, { useState, useEffect, useRef } from "react";
import { Table, Button } from "antd";
import { useReactToPrint } from "react-to-print";
import firebase from "../../firebase";
import moment from "moment";
import "moment/locale/id";

const DataTable = React.forwardRef((props, ref) => {
  const { bulan } = props.match.params;
  const start = new Date(Date.parse(`${bulan}/1/2020`));
  moment.locale("id");
  const end = new Date(
    start.getFullYear(),
    start.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  var [loading, setloading] = useState(true);
  var [data, setdata] = useState([]);
  const columns = [
    {
      key: "noAntrian",
      dataIndex: "noAntrian",
      title: "No. Antrian",
    },
    {
      key: "daftar",
      dataIndex: "daftar",
      title: "Tanggal",
    },
    {
      key: "servis",
      dataIndex: "servis",
      title: "Servis",
    },
    {
      key: "totalItem",
      dataIndex: "totalItem",
      title: "Total Item",
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
  ];

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
      .where("daftar", ">=", start)
      .where("daftar", "<=", end)
      .where("success", "==", 2)
      .orderBy("daftar", "desc")
      .onSnapshot((snap) => {
        setloading(false);
        let qry = snap.docs.map((doc, i) => ({
          key: doc.id,
          noAntrian: doc.id,
          daftar: dateFormat(doc.data()["daftar"].seconds * 1000),
          servis: doc.data()["servis"],
          totalItem: doc.data()["kerusakan"].length + " Diservis",
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
  });

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        Laporan Bulan {moment.months()[bulan - 1]}{" "}
        {new Date(Date.now()).getFullYear()}
      </h1>
      <table style={{ marginBottom: "15px", marginRight: "8px" }}>
        <tbody>
          <tr>
            <td width="70">Periode</td>
            <td width="10"> : </td>
            <td>
              {moment.months()[bulan - 1]} {new Date(Date.now()).getFullYear()}
            </td>
          </tr>
          <tr>
            <td>Total</td>
            <td> : </td>
            <td>
              Rp.
              {formatter.format(
              data.reduce((a, b) => a + parseInt(b.harga.substr(4)), 0)
            )}
            </td>
          </tr>
        </tbody>
      </table>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        loading={loading}
      />
    </div>
  );
});

class Print extends React.Component {
  render() {
    return <DataTable {...this.props} />;
  }
}

const Cetak = (props) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: "A4",
  });
  return (
    <div>
      <Button
        type="primary"
        onClick={handlePrint}
        style={{
          position: "absolute",
          right: "20px",
          top: "20px",
        }}
      >
        Print
      </Button>
      <Print {...props} ref={componentRef} />
    </div>
  );
};

export default Cetak;
