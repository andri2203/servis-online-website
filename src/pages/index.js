import React, { useState, useContext } from 'react';
import { Link } from "react-router-dom"
import firebase from "../firebase"
import "../style.css"

import { Layout, Menu, Modal } from 'antd';
import {
    LogoutOutlined,
    ExclamationCircleOutlined,
    LeftOutlined,
    RightOutlined
} from '@ant-design/icons';

import pageRoutes from '../router';
import { AuthContext } from '../AuthProvider';

const { Sider, Footer } = Layout;

const Pages = function (props) {
    const [state, setState] = useState({
        collapsed: false,
        marginLeft: '200px',
        logo: {
            collapsed: false,
            text: 'Service Online'
        },
        visible: false,
    })

    const toggle = () => {
        setState({
            collapsed: !state.collapsed,
            marginLeft: state.marginLeft === '200px' ? '80px' : '200px',
            logo: {
                text: state.logo.collapsed === false ? 'SO' : 'Service Online',
                collapsed: !state.logo.collapsed,
            },
        });
    };

    const { currentUser } = useContext(AuthContext)

    return (
        <Layout>
            <Sider trigger={null}
                collapsible
                collapsed={state.collapsed}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    transition: 'all 0.2s'
                }}>
                <div className="logo" style={{ overflow: 'hidden', wordWrap: 'normal', }}>
                    <h2 style={{ color: '#ffffff', }}>
                        {state.logo.text}
                    </h2>
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={[`${props.index}`]}>
                    {pageRoutes.map((data, i) => {
                        return (
                            <Menu.Item key={i} icon={data.icon}>
                                <Link to={data.route}>
                                    {data.name}
                                </Link>
                            </Menu.Item>
                        );
                    })}
                    <Menu.Item key={pageRoutes.length} icon={<LogoutOutlined />} onClick={() => Modal.confirm({
                        title: 'Anda akan keluar?',
                        icon: <ExclamationCircleOutlined />,
                        content: ' Anda masih bisa masuk dilain waktu. Yakin ingin keluar?',
                        cancelText: 'Tidak Sekarang',
                        okText: 'Ya Sekarang',
                        onOk: () => firebase.auth().signOut().finally()
                    })}>
                        Keluar
            </Menu.Item>
                </Menu>
                {React.createElement(state.collapsed ? RightOutlined : LeftOutlined, {
                    style: {
                        position: 'absolute',
                        bottom: '0px',
                        left: '0px',
                        display: 'block',
                        boxSizing: 'border-box',
                        width: '100%',
                        padding: '12px 0px',
                        backgroundColor: '#002140',
                        fontSize: '12pt', color: 'white'
                    },
                    onClick: toggle,
                })}
            </Sider>
            <Layout className="site-layout" style={{
                marginLeft: currentUser ? state.marginLeft : 0,
                minHeight: '100vh',
                transition: 'all 0.1s linear'
            }}>
                {props.children}
                <Footer style={{ textAlign: 'center', backgroundColor: '#fff' }}>
                    Service Online ©{new Date().getFullYear()}
                </Footer>
            </Layout>
        </Layout>
    );
}

export default Pages;
