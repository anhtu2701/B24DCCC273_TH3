import { Button, Form, Input, InputNumber } from 'antd';
import { useModel } from 'umi';

const FormDichVu = () => {
    const { data, getDataDichVu, row, isEdit, setVisible } = useModel('dichvu');
    const [form] = Form.useForm();

    return (
        <Form
            form={form}
            onFinish={(values) => {
                const dataTemp = [...data];
                if (isEdit) {
                    const index = data.findIndex((item: any) => item.id === row?.id);
                    dataTemp.splice(index, 1, { ...values, id: row?.id });
                } else {
                    const newId = new Date().getTime().toString();
                    dataTemp.unshift({ ...values, id: newId });
                }
                localStorage.setItem('dichvu_data', JSON.stringify(dataTemp));
                setVisible(false);
                getDataDichVu();
            }}
            initialValues={row}
            layout='vertical'
        >
            <Form.Item
                label='Tên dịch vụ'
                name='tenDichVu'
                rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label='Giá (VNĐ)'
                name='gia'
                rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ!' }]}
            >
                <InputNumber min={0} step={10000} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                label='Thời gian thực hiện (Phút)'
                name='thoiGianThucHien'
                rules={[{ required: true, message: 'Vui lòng nhập thời gian thực hiện!' }]}
            >
                <InputNumber min={5} step={5} style={{ width: '100%' }} />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button onClick={() => setVisible(false)}>Hủy</Button>
                <Button htmlType='submit' type='primary'>
                    {isEdit ? 'Lưu' : 'Thêm mới'}
                </Button>
            </div>
        </Form>
    );
};

export default FormDichVu;
