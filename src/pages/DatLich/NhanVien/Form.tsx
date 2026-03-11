import { Button, Form, Input, InputNumber, DatePicker, TimePicker } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const FormNhanVien = () => {
    const { data, getDataNhanVien, row, isEdit, setVisible } = useModel('nhanvien');
    const [form] = Form.useForm();

    return (
        <Form
            form={form}
            onFinish={(values) => {
                const dataTemp = [...data];
                const formattedValues = {
                    ...values,
                    ngayLamViec: [values.ngayLamViec[0].format('YYYY-MM-DD'), values.ngayLamViec[1].format('YYYY-MM-DD')],
                    gioLamViec: [values.gioLamViec[0].format('HH:mm'), values.gioLamViec[1].format('HH:mm')],
                };

                if (isEdit) {
                    const index = data.findIndex((item: any) => item.id === row?.id);
                    dataTemp.splice(index, 1, { ...formattedValues, id: row?.id });
                } else {
                    const newId = new Date().getTime().toString();
                    dataTemp.unshift({ ...formattedValues, id: newId });
                }
                localStorage.setItem('nhanvien_data', JSON.stringify(dataTemp));
                setVisible(false);
                getDataNhanVien();
            }}
            initialValues={{
                ...row,
                ngayLamViec: row?.ngayLamViec ? [moment(row.ngayLamViec[0]), moment(row.ngayLamViec[1])] : undefined,
                gioLamViec: row?.gioLamViec ? [moment(row.gioLamViec[0], 'HH:mm'), moment(row.gioLamViec[1], 'HH:mm')] : undefined,
            }}
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
                label='Ngày làm việc (Từ ngày - Đến ngày)'
                name='ngayLamViec'
                rules={[{ required: true, message: 'Vui lòng chọn ngày làm việc!' }]}
            >
                <DatePicker.RangePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                label='Giờ làm việc trong ngày'
                name='gioLamViec'
                rules={[{ required: true, message: 'Vui lòng chọn giờ làm việc!' }]}
            >
                <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
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
