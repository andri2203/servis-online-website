import React from "react"
import {
    BarsOutlined,
    DashboardOutlined,
    ToolOutlined,
    PrinterOutlined
} from '@ant-design/icons'

import Dashboard from "../pages/dashboard"
import service from "../pages/service"
import Laporan from "../pages/laporan"
import Antrian from "../pages/antrian"


const pageRoutes = () => {
    return [
        {
            name: 'Beranda',
            route: '/',
            path: '/',
            icon: <DashboardOutlined />,
            component: Dashboard
        },
        {
            name: 'layanan',
            route: '/layanan',
            path: '/layanan',
            icon: <BarsOutlined />,
            component: Antrian
        },
        {
            name: 'Servis',
            route: '/service',
            path: '/service',
            icon: <ToolOutlined />,
            component: service
        },
        {
            name: 'Laporan',
            route: '/laporan',
            path: '/laporan',
            icon: <PrinterOutlined />,
            component: Laporan
        },
    ];
}

export default pageRoutes()