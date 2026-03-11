import { Button, Modal, Table, Popconfirm, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormDichVu from './Form';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const DichVu = () => {
    const { data, getDataDichVu, setRow, isEdit, setVisible, setIsEdit, visible } = useModel('dichvu');

    useEffect(() => {
        getDataDichVu();
    }, []);

    const columns: any[] = [
        {
            title: 'Tên dịch vụ',
            dataIndex: 'tenDichVu',
            key: 'tenDichVu',
        },
        {
            title: 'Giá (VNĐ)',
            dataIndex: 'gia',
            key: 'gia',
            width: 150,
            align: 'right',
            render: (val: number) => val?.toLocaleString('vi-VN'),
        },
        {
            title: 'Thời gian (Phút)',
            dataIndex: 'thoiGianThucHien',
            key: 'thoiGianThucHien',
            width: 150,
            align: 'center',
        },
        {
            title: 'Thao tác',
            width: 150,
            align: 'center',
            render: (record: any) => {
                return (
                    <div>
                        <Tooltip title="Chỉnh sửa">
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    setVisible(true);
                                    setRow(record);
                                    setIsEdit(true);
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Xóa">
                            <Popconfirm
                                title="Bạn có chắc chắn muốn xóa?"
                                onConfirm={() => {
                                    const dataLocal: any = JSON.parse(localStorage.getItem('dichvu_data') || '[]');
                                    const newData = dataLocal.filter((item: any) => item.id !== record.id);
                                    localStorage.setItem('dichvu_data', JSON.stringify(newData));
                                    getDataDichVu();
                                }}
                                okText="Có"
                                cancelText="Không"
                            >
                                <Button
                                    style={{ marginLeft: 8 }}
                                    type="primary"
                                    icon={<DeleteOutlined />}
                                />
                            </Popconfirm>
                        </Tooltip>
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
                Thêm dịch vụ
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
                title={isEdit ? 'Sửa Dịch vụ' : 'Thêm Dịch vụ'}
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                }}
            >
                <FormDichVu />
            </Modal>
        </div>
    );
};

export default DichVu;
