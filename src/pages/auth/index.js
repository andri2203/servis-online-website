import React, { useCallback, useContext } from 'react';
import { withRouter, Redirect } from "react-router-dom";
import { Form, Input, Button, Checkbox, Layout } from 'antd';
import "./style.css"
import firebase from '../../firebase'
import { AuthContext } from "../../AuthProvider";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const Login = ({ history }) => {
    const onFinish = useCallback(async values => {
        const { email, password } = values;
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            // window.location.href = '/'
            history.push("/")
        } catch (error) {
            alert(error)
        }
    }, [history]);

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const { currentUser } = useContext(AuthContext)

    if (currentUser) {
        return <Redirect to='/' />

    }

    return (
        <Layout className="cont">
            <div className="login-cont">
                <h1>Login</h1>
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Mohon Masukkan Email!!',
                            },
                            {
                                type: 'email',
                                message: "Email Tidak Valid"
                            }
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Mohon Masukkan Password',
                            },
                        ]} >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                </Button>
                    </Form.Item>
                </Form>
            </div>
        </Layout>
    );
};

export default withRouter(Login);