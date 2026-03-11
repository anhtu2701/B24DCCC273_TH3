import { Button, Form, Input, InputNumber } from 'antd';
import { useModel } from 'umi';

const FormNhanVien = () => {
    const { data, getDataNhanVien, row, isEdit, setVisible } = useModel('nhanvien');
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
                localStorage.setItem('nhanvien_data', JSON.stringify(dataTemp));
                setVisible(false);
                getDataNhanVien();
            }}
            initialValues={row}
            layout='vertical'
        >
            <Form.Item
                label='Tên nhân viên'
                name='tenNhanVien'
                rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label='Số khách tối đa / ngày'
                name='soKhachToiDa'
                rules={[{ required: true, message: 'Vui lòng nhập số khách tối đa!' }]}
            >
                <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                label='Lịch làm việc'
                name='lichLamViec'
                rules={[{ required: true, message: 'Vui lòng nhập lịch làm việc!' }]}
            >
                <Input placeholder='Ví dụ: 9h-17h thứ 6' />
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

export default FormNhanVien;
