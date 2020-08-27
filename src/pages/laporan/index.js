import React from "react"
import { Layout, Breadcrumb } from "antd";
import TableLaporan from './table'
import FormCetak from "./FormCetak";

const { Content } = Layout
const Laporan = () => {
    return (
        <React.Fragment>
            <Breadcrumb style={{ margin: '24px 16px 0px 16px' }}>
                <Breadcrumb.Item>Beranda</Breadcrumb.Item>
                <Breadcrumb.Item>Servis</Breadcrumb.Item>
            </Breadcrumb>
            <Content
                className="site-layout-background"
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'wrap'
                }}
            >
                <h1 style={{ textAlign: 'center', textTransform: 'uppercase' }}>Laporan Data Kerusakan Motor</h1>
                <FormCetak />
                <TableLaporan />
            </Content>
        </React.Fragment>
    )
}

export default Laporan