import React from "react"
import { Layout, Breadcrumb } from "antd";
import TableServices from "./table";
import FormInput from "./form_input";

import "./style.css"

const { Content } = Layout

function service() {
    return <React.Fragment>
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
            <FormInput style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                marginTop: '0.5rem'
            }} />
            <TableServices />
        </Content>
    </React.Fragment>
}

export default service