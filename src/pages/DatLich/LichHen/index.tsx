import { Button, Modal, Table, Tag } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormLichHen from './Form';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const LichHen = () => {
    const { data, getDataLichHen, setRow, isEdit, setVisible, setIsEdit, visible } = useModel('lichhen');
    const nhanVienList = JSON.parse(localStorage.getItem('nhanvien_data') || '[]');
    const dichVuList = JSON.parse(localStorage.getItem('dichvu_data') || '[]');

    useEffect(() => {
        getDataLichHen();
    }, []);

    const columns: any[] = [
        {
            title: 'Khách hàng',
            dataIndex: 'khachHang',
            key: 'khachHang',
        },
        {
            title: 'Ngày giờ',
            key: 'ngayGio',
            render: (record: any) => `${moment(record.ngay).format('DD/MM/YYYY')} ${record.gio}`,
        },
        {
            title: 'Nhân viên',
            dataIndex: 'nhanVienId',
            key: 'nhanVienId',
            render: (id: string) => {
                const nv = nhanVienList.find((item: any) => item.id === id);
                return nv ? nv.tenNhanVien : id;
            }
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'dichVuId',
            key: 'dichVuId',
            render: (id: string) => {
                const dv = dichVuList.find((item: any) => item.id === id);
                return dv ? dv.tenDichVu : id;
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: (status: string) => {
                let color = 'gold';
                if (status === 'Xác nhận') color = 'blue';
                if (status === 'Hoàn thành') color = 'green';
                if (status === 'Hủy') color = 'red';
                return <Tag color={color}>{status}</Tag>;
            }
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
                                const dataLocal: any = JSON.parse(localStorage.getItem('lichhen_data') || '[]');
                                const newData = dataLocal.filter((item: any) => item.id !== record.id);
                                localStorage.setItem('lichhen_data', JSON.stringify(newData));
                                getDataLichHen();
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
                Nhận lịch hẹn
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
                title={isEdit ? 'Cập nhật Lịch hẹn' : 'Thêm Lịch hẹn'}
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                }}
            >
                <FormLichHen />
            </Modal>
        </div>
    );
};

export default LichHen;
