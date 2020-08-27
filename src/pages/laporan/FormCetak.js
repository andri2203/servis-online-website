import React, { useState } from "react";
import { Select, Button } from "antd";
import moment from "moment";
import "moment/locale/id";

const FormCetak = (props) => {
  const { Option } = Select;
  const date = new Date();
  const bulanDefault = date.getMonth();
  moment.locale("id");

  const [bulan, setBulan] = useState(bulanDefault);

  const handleClick = () => {
    console.log(props);
    window.location.href = `/cetak/${parseInt(bulan) + 1}`;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "15px",
        marginTop: "15px",
        justifyContent: "flex-end",
      }}
    >
      <h4 style={{ marginRight: "10px" }}>Cetak Laporan per Bulan : </h4>
      <Select
        defaultValue={bulanDefault}
        style={{ width: "100px", marginRight: "10px" }}
        onChange={(item) => setBulan(item)}
      >
        {moment.months().map((item, i) => {
          return (
            <Option key={i} value={i}>
              {item}
            </Option>
          );
        })}
      </Select>
      <Button type="primary" onClick={handleClick}>
        Cetak
      </Button>
    </div>
  );
};

export default FormCetak;
