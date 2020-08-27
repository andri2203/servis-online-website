import React from "react"
import { Layout, Breadcrumb } from "antd";

import TableAntrian from './table'

const { Content } = Layout

const Antrian = () => {
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
                <TableAntrian />
            </Content>
        </React.Fragment>
    )
}

export default Antrian