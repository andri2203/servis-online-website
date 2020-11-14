import React, { useState, useEffect } from "react";
import { Area } from "@ant-design/charts";
import firebase from "../../firebase";
import moment from "moment";
import "moment/locale/id";
import _ from "lodash";

import { Layout, Breadcrumb, Row, Col, Statistic } from "antd";
const { Content } = Layout;

const Dashboard = () => {
  moment.locale("id");
  const [data, setData] = useState([]);
  const [antrian, setAntrian] = useState([]);
  const [pengguna, setPengguna] = useState(0);
  const [montir, setMontir] = useState(0);
  const [laporan, setLaporan] = useState([]);

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
    ] = format.formatToParts(date);

    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("antrian")
      .where("success", "==", 2)
      .orderBy("daftar", "asc")
      .onSnapshot((snap) => {
        setLaporan(snap.docs);
        let qry = snap.docs.map((dt, i) => {
          let d = dt.data()["kerusakan"];
          const pendapatan = d.reduce((x, y) => x + parseInt(y.harga), 0);
          const tanggal = dt.data()["daftar"].toDate();

          return {
            tanggal: dateFormat(tanggal),
            jumlah: pendapatan,
          };
        });

        const groupingDataChart = _.groupBy(qry, (dt) => {
          return dt.tanggal;
        });

        const dataChart = _.map(groupingDataChart, (element, i) => {
          return {
            tanggal: element[0].tanggal,
            jumlah: element.reduce((a, b) => a + parseInt(b.jumlah), 0),
          };
        });
        setData(dataChart);
      });

    firebase
      .firestore()
      .collection("antrian")
      .where("success", "<", 2)
      .onSnapshot((snap) => {
        setAntrian(snap.docs);
      });

    firebase
      .firestore()
      .collection("users")
      .onSnapshot((snap) => {
        setPengguna(snap.docs.length);
      });

    firebase
      .firestore()
      .collection("montir")
      .onSnapshot((snap) => {
        setMontir(snap.docs.length);
      });
  }, []);

  const config = {
    data,
    title: {
      visible: true,
      text: `Data Pendapatan`,
    },
    xField: "tanggal",
    yField: "jumlah",
    point: {
      visible: true,
      size: 5,
      shape: "diamond",
      style: {
        fill: "white",
        stroke: "#2593fc",
        lineWidth: 1.5,
      },
    },
  };
  return (
    <React.Fragment>
      <Breadcrumb style={{ margin: "24px 16px 0px 16px" }}>
        <Breadcrumb.Item>Beranda</Breadcrumb.Item>
        <Breadcrumb.Item>Servis</Breadcrumb.Item>
      </Breadcrumb>
      <Row
        gutter={16}
        className="site-layout-background"
        style={{
          margin: "24px 16px 0px 16px",
          padding: 16,
        }}
        justify="space-around"
      >
        <Col span={4.8}>
          <Statistic
            title={`Total Pengguna`}
            suffix=" Pengguna"
            value={pengguna}
          />
        </Col>
        <Col span={4.8}>
          <Statistic title={`Total Montir`} suffix=" Montir" value={montir} />
        </Col>
        <Col span={4.8}>
          <Statistic
            title={`Total Antrian`}
            suffix=" Antrian"
            value={antrian.length}
          />
        </Col>
        <Col span={4.8}>
          <Statistic
            title={`Jumlah Laporan`}
            suffix=" Laporan"
            value={laporan.length}
          />
        </Col>
        <Col span={4.8}>
          <Statistic
            title={`Total Pendapatan`}
            prefix="Rp. "
            value={data.reduce((a, b) => a + parseInt(b.jumlah), 0)}
            precision={2}
          />
        </Col>
      </Row>
      <Content
        className="site-layout-background"
        style={{
          margin: "24px 16px",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
        }}
      >
        <Area {...config} />
      </Content>
    </React.Fragment>
  );
};

export default Dashboard;
