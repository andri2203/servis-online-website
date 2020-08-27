import React, { useState } from "react";
import { Form, Input, Checkbox, Button, Modal } from "antd";
import firebase from "../../firebase"

const FormInput = (props) => {
    const [form] = Form.useForm()
    const options = [{ label: 'Berat', value: 'Berat' }, { label: 'Ringan', value: 'Ringan' }]
    const validate = { required: 'wajib diisi', min: 'terlalu sedikit' }
    const [btn, setbtn] = useState({ disabled: false, text: 'Tambah' })

    const db = firebase.firestore().collection('montir')
    const onFinishHandler = (value) => {
        setbtn({ disabled: true, text: 'Loading...' })
        const add = db.doc().set({
            'nama': value.nama,
            'kategori': value.kategori,
            'kode': value.kode
        })
        return add.finally(() => {
            form.resetFields()
            setbtn({ disabled: false, text: 'Tambah' })
            return Modal.success({
                title: 'Berhasil!!!',
                content: 'Data Montir berhasil ditambah'
            })
        }).catch(reason => {
            setbtn({ disabled: false, text: 'Tambah' })
            return Modal.error({
                title: 'Maaf!!!',
                content: 'Data Montir gagal ditambah. ' + reason,
            })
        })
    }

    return (
        <Form
            {...props}
            layout="inline"
            form={form}
            validateMessages={validate}
            onFinish={onFinishHandler}
            autoComplete="off"
        >
            <Form.Item label="Nama Montir" name="nama" rules={[{ required: true, min: 5 }]}>
                <Input placeholder="Mohon Diisi" />
            </Form.Item>
            <Form.Item label="Kategori" name="kategori" initialValue={['Berat']} rules={[{ required: true, }]}>
                <Checkbox.Group options={options} onChange={(check) => console.log(check)} />
            </Form.Item>
            <Form.Item label="Kode Montir" name="kode" rules={[{ required: true, min: 3 }]}>
                <Input placeholder="Mohon Diisi" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" disabled={btn.disabled}>{btn.text}</Button>
            </Form.Item>
        </Form>
    );
}

export default FormInput