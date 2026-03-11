import { Button, Form, Input, Select, DatePicker, TimePicker, message } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import { useState } from 'react';

const FormLichHen = () => {
    const { data, getDataLichHen, row, isEdit, setVisible, kiemTraLop } = useModel('lichhen');
    const [form] = Form.useForm();

    const nhanVienList = JSON.parse(localStorage.getItem('nhanvien_data') || '[]');
    const dichVuList = JSON.parse(localStorage.getItem('dichvu_data') || '[]');

    const [ngayChon, setNgayChon] = useState<any>(row?.ngay ? moment(row.ngay) : undefined);
    const [gioChon, setGioChon] = useState<any>(row?.gio ? moment(row.gio, 'HH:mm') : undefined);

    const filteredNhanVien = nhanVienList.filter((nv: any) => {
        if (!ngayChon || !gioChon) return true;
        if (!nv.ngayLamViec || !nv.gioLamViec) return true;

        const ngayHenStr = ngayChon.format('YYYY-MM-DD');
        const gioHenStr = gioChon.format('HH:mm');

        const [ngayStart, ngayEnd] = nv.ngayLamViec;
        const [gioStart, gioEnd] = nv.gioLamViec;

        const isDateValid = ngayHenStr >= ngayStart && ngayHenStr <= ngayEnd;
        const isTimeValid = gioHenStr >= gioStart && gioHenStr <= gioEnd;

        return isDateValid && isTimeValid;
    });

    return (
        <Form
            form={form}
            onValuesChange={(changedValues) => {
                if (changedValues.ngay) {
                    setNgayChon(changedValues.ngay);
                    form.setFieldsValue({ nhanVienId: undefined });
                }
                if (changedValues.gio) {
                    setGioChon(changedValues.gio);
                    form.setFieldsValue({ nhanVienId: undefined });
                }
            }}
            onFinish={(values) => {
                const formValues = {
                    ...values,
                    ngay: values.ngay.format('YYYY-MM-DD'),
                    gio: values.gio.format('HH:mm'),
                };

                const dataTemp = [...data];

                if (!kiemTraLop(formValues, dataTemp, nhanVienList, isEdit, row?.id)) {
                    return;
                }

                if (isEdit) {
                    const index = data.findIndex((item: any) => item.id === row?.id);
                    dataTemp.splice(index, 1, { ...formValues, id: row?.id });
                } else {
                    const newId = new Date().getTime().toString();
                    dataTemp.unshift({ ...formValues, id: newId, trangThai: 'Chờ duyệt' });
                }
                localStorage.setItem('lichhen_data', JSON.stringify(dataTemp));
                setVisible(false);
                getDataLichHen();
                message.success(isEdit ? 'Cập nhật lịch hẹn thành công' : 'Đặt lịch hẹn thành công');
            }}
            initialValues={{
                ...row,
                ngay: row?.ngay ? moment(row.ngay) : undefined,
                gio: row?.gio ? moment(row.gio, 'HH:mm') : undefined,
                trangThai: row?.trangThai || 'Chờ duyệt'
            }}
            layout='vertical'
        >
            <Form.Item
                label='Khách hàng'
                name='khachHang'
                rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label='Thời gian'
                style={{ marginBottom: 0 }}
            >
                <Form.Item
                    name='ngay'
                    style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginRight: 8 }}
                    rules={[{ required: true, message: 'Chọn ngày!' }]}
                >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
                <Form.Item
                    name='gio'
                    style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                    rules={[{ required: true, message: 'Chọn giờ!' }]}
                >
                    <TimePicker format="HH:mm" style={{ width: '100%' }} />
                </Form.Item>
            </Form.Item>

            <Form.Item
                label='Nhân viên phục vụ'
                name='nhanVienId'
                rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
            >
                <Select disabled={!ngayChon || !gioChon} placeholder={(!ngayChon || !gioChon) ? "Vui lòng chọn ngày và giờ trước" : "Chọn nhân viên"}>
                    {filteredNhanVien.map((nv: any) => (
                        <Select.Option key={nv.id} value={nv.id}>
                            {nv.tenNhanVien}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label='Dịch vụ'
                name='dichVuId'
                rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
            >
                <Select>
                    {dichVuList.map((dv: any) => (
                        <Select.Option key={dv.id} value={dv.id}>
                            {dv.tenDichVu}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            {isEdit && (
                <Form.Item
                    label='Trạng thái'
                    name='trangThai'
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Select>
                        <Select.Option value='Chờ duyệt'>Chờ duyệt</Select.Option>
                        <Select.Option value='Xác nhận'>Xác nhận</Select.Option>
                        <Select.Option value='Hoàn thành'>Hoàn thành</Select.Option>
                        <Select.Option value='Hủy'>Hủy</Select.Option>
                    </Select>
                </Form.Item>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button onClick={() => setVisible(false)}>Hủy</Button>
                <Button htmlType='submit' type='primary'>
                    {isEdit ? 'Lưu' : 'Thêm mới'}
                </Button>
            </div>
        </Form>
    );
};

export default FormLichHen;
