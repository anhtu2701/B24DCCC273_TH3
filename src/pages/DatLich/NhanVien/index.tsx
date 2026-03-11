import { Button, Modal, Table } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormNhanVien from './Form';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const NhanVien = () => {
    const { data, getDataNhanVien, setRow, isEdit, setVisible, setIsEdit, visible } = useModel('nhanvien');

    useEffect(() => {
        getDataNhanVien();
    }, []);

    const columns: any[] = [
        {
            title: 'Tên nhân viên',
            dataIndex: 'tenNhanVien',
            key: 'tenNhanVien',
        },
        {
            title: 'Số khách tối đa/ngày',
            dataIndex: 'soKhachToiDa',
            key: 'soKhachToiDa',
            width: 200,
            align: 'center',
        },
        {
            title: 'Lịch làm việc',
            dataIndex: 'lichLamViec',
            key: 'lichLamViec',
        },
        {
            title: 'Thao tác',
            width: 150,
            align: 'center',
            render: (record: any) => {
                return (
                    <div>
                        <Button
                            type='primary'
                            icon={<EditOutlined />}
                            onClick={() => {
                                setVisible(true);
                                setRow(record);
                                setIsEdit(true);
                            }}
                        />
                        <Button
                            style={{ marginLeft: 8 }}
                            danger
                            type='primary'
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                const dataLocal: any = JSON.parse(localStorage.getItem('nhanvien_data') || '[]');
                                const newData = dataLocal.filter((item: any) => item.id !== record.id);
                                localStorage.setItem('nhanvien_data', JSON.stringify(newData));
                                getDataNhanVien();
                            }}
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <div style={{ padding: 24, background: '#fff' }}>
            <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={() => {
                    setVisible(true);
                    setRow(undefined);
                    setIsEdit(false);
                }}
                style={{ marginBottom: 16 }}
            >
                Thêm nhân viên
            </Button>

            <Table
                dataSource={data}
                columns={columns}
                rowKey="id"
                bordered
            />

            <Modal
                destroyOnClose
                footer={false}
                title={isEdit ? 'Sửa Nhân viên' : 'Thêm Nhân viên'}
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                }}
            >
                <FormNhanVien />
            </Modal>
        </div>
    );
};

export default NhanVien;
