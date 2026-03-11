import { useState } from 'react';
import { message } from 'antd';

export default () => {
    const [data, setData] = useState<any[]>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [row, setRow] = useState<any>();

    const getDataLichHen = async () => {
        const dataLocal: any = JSON.parse(localStorage.getItem('lichhen_data') || '[]');
        setData(dataLocal);
    };

    const kiemTraLop = (values: any, dataTemp: any[], nhanvienList: any[], isEdit: boolean, rowId?: string) => {
        const { ngay, gio, nhanVienId } = values;

        const lichChungNhanVien = dataTemp.filter(
            (item: any) => item.ngay === ngay && item.nhanVienId === nhanVienId && item.trangThai !== 'Hủy' && (!isEdit || item.id !== rowId)
        );

        const nhanVienInfo = nhanvienList.find((nv: any) => nv.id === nhanVienId);

        if (lichChungNhanVien.length >= (nhanVienInfo?.soKhachToiDa || 100)) {
            message.error(`Nhân viên này đã đạt giới hạn khách trong ngày ${ngay}`);
            return false;
        }

        const lichTrungGio = lichChungNhanVien.find((item: any) => item.gio === gio);
        if (lichTrungGio) {
            message.error(`Nhân viên đã có lịch hẹn vào lúc ${gio} ngày ${ngay}`);
            return false;
        }

        return true;
    };

    return {
        data,
        visible,
        setVisible,
        row,
        setRow,
        isEdit,
        setIsEdit,
        setData,
        getDataLichHen,
        kiemTraLop
    };
};
