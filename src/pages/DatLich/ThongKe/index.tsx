import { Card, Col, Row, Statistic, Table, Divider } from 'antd';
import { useMemo } from 'react';

const ThongKe = () => {
    const lichHenList = JSON.parse(localStorage.getItem('lichhen_data') || '[]');
    const nhanVienList = JSON.parse(localStorage.getItem('nhanvien_data') || '[]');
    const dichVuList = JSON.parse(localStorage.getItem('dichvu_data') || '[]');

    const thongKeLichHenTheoNgay = useMemo<any[]>(() => {
        const stats: any = {};
        lichHenList.forEach((lh: any) => {
            if (!stats[lh.ngay]) {
                stats[lh.ngay] = { ngay: lh.ngay, soLuong: 0, hoanThanh: 0, huy: 0 };
            }
            stats[lh.ngay].soLuong += 1;
            if (lh.trangThai === 'Hoàn thành') stats[lh.ngay].hoanThanh += 1;
            if (lh.trangThai === 'Hủy') stats[lh.ngay].huy += 1;
        });
        return Object.values(stats).sort((a: any, b: any) => a.ngay.localeCompare(b.ngay));
    }, [lichHenList]);

    const thongKeDoanhThu = useMemo<any>(() => {
        const statsNV: any = {};
        const statsDV: any = {};
        let tongDoanhThu = 0;

        lichHenList.filter((lh: any) => lh.trangThai === 'Hoàn thành').forEach((lh: any) => {
            const dv = dichVuList.find((item: any) => item.id === lh.dichVuId);
            const nv = nhanVienList.find((item: any) => item.id === lh.nhanVienId);
            const gia = dv ? dv.gia : 0;
            tongDoanhThu += gia;

            if (nv) {
                if (!statsNV[nv.id]) statsNV[nv.id] = { id: nv.id, ten: nv.tenNhanVien, doanhThu: 0 };
                statsNV[nv.id].doanhThu += gia;
            }

            if (dv) {
                if (!statsDV[dv.id]) statsDV[dv.id] = { id: dv.id, ten: dv.tenDichVu, doanhThu: 0, soLuot: 0 };
                statsDV[dv.id].doanhThu += gia;
                statsDV[dv.id].soLuot += 1;
            }
        });

        return {
            tongDoanhThu,
            theoNhanVien: Object.values(statsNV).sort((a: any, b: any) => b.doanhThu - a.doanhThu),
            theoDichVu: Object.values(statsDV).sort((a: any, b: any) => b.doanhThu - a.doanhThu)
        };
    }, [lichHenList, nhanVienList, dichVuList]);

    const columnsLichHen: any[] = [
        { title: 'Ngày', dataIndex: 'ngay', key: 'ngay' },
        { title: 'Tổng số lịch', dataIndex: 'soLuong', key: 'soLuong', align: 'center' },
        { title: 'Hoàn thành', dataIndex: 'hoanThanh', key: 'hoanThanh', align: 'center' },
        { title: 'Hủy', dataIndex: 'huy', key: 'huy', align: 'center' },
    ];

    const columnsDoanhThuNV: any[] = [
        { title: 'Nhân viên', dataIndex: 'ten', key: 'ten' },
        {
            title: 'Doanh thu',
            dataIndex: 'doanhThu',
            key: 'doanhThu',
            align: 'right',
            render: (val: number) => `${val.toLocaleString('vi-VN')} VNĐ`
        },
    ];

    const columnsDoanhThuDV: any[] = [
        { title: 'Dịch vụ', dataIndex: 'ten', key: 'ten' },
        { title: 'Số lượt sử dụng', dataIndex: 'soLuot', key: 'soLuot', align: 'center' },
        {
            title: 'Doanh thu',
            dataIndex: 'doanhThu',
            key: 'doanhThu',
            align: 'right',
            render: (val: number) => `${val.toLocaleString('vi-VN')} VNĐ`
        },
    ];

    return (
        <div style={{ padding: 24, background: '#fff' }}>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Card bordered={true}>
                        <Statistic
                            title="Tổng số lịch hẹn"
                            value={lichHenList.length}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={true}>
                        <Statistic
                            title="Lịch hẹn hoàn thành"
                            value={lichHenList.filter((lh: any) => lh.trangThai === 'Hoàn thành').length}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={true}>
                        <Statistic
                            title="Tổng doanh thu"
                            value={thongKeDoanhThu.tongDoanhThu}
                            suffix="VNĐ"
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Divider orientation="left">Thống kê lịch hẹn theo ngày</Divider>
            <Table dataSource={thongKeLichHenTheoNgay} columns={columnsLichHen} rowKey="ngay" pagination={false} bordered />

            <Row gutter={24} style={{ marginTop: 24 }}>
                <Col span={12}>
                    <Divider orientation="left">Doanh thu theo dịch vụ</Divider>
                    <Table dataSource={thongKeDoanhThu.theoDichVu} columns={columnsDoanhThuDV} rowKey="id" pagination={false} bordered />
                </Col>
                <Col span={12}>
                    <Divider orientation="left">Doanh thu theo nhân viên</Divider>
                    <Table dataSource={thongKeDoanhThu.theoNhanVien} columns={columnsDoanhThuNV} rowKey="id" pagination={false} bordered />
                </Col>
            </Row>
        </div>
    );
};

export default ThongKe;
