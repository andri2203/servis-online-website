import React from "react";
import { Layout, Breadcrumb, Button } from "antd";
import firebase from "../../firebase";

import TableAntrian from "./table";

const { Content } = Layout;

const Antrian = () => {
  const handleUpdateAll = async () => {
    const collection = await firebase.firestore().collection("antrian").get();
    collection.forEach((doc) => {
      doc.ref
        .update({
          kerusakan: [],
          success: 0,
        })
        .finally(() => console.log(`${doc.id} Reset Success`));
    });
  };

  return (
    <React.Fragment>
      <Breadcrumb style={{ margin: "24px 16px 0px 16px" }}>
        <Breadcrumb.Item>Beranda</Breadcrumb.Item>
        <Breadcrumb.Item>Layanan</Breadcrumb.Item>
      </Breadcrumb>
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
        <div style={{ width: "10%", marginBottom: "10px" }}>
          <Button type="primary" onClick={handleUpdateAll}>
            Pengerjaan
          </Button>
        </div>
        <TableAntrian />
      </Content>
    </React.Fragment>
  );
};

export default Antrian;
