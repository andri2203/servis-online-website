import React from 'react';
import { Result } from 'antd';
import { Link } from 'react-router-dom';

const Page404 = () => {
    return (<Result
        status="404"
        title="404"
        subTitle="Maaf, Halaman yang anda cari tidak ditemukan."
        extra={<Link to="/" style={{
            padding: '10px 15px',
            backgroundColor: "#1890ff",
            color: 'white'
        }}>Back Home</Link>}
    />);
}

export default Page404;