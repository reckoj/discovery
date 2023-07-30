import { useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Dropdown from '../../shared/Dropdown';
import Header from '../../shared/Header';
import Sidebar from '../../shared/Sidebar';
import Table from '../../shared/Table';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { getLogs, removeLog } from '../../apis/logs.apis';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux-toolkit/store/store';
import { toastUtil } from '../../utils/toast-utils';
import { AppRoles } from '../../enums/roles';

const Logs = ({}: any) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination]: any = useState();
  const authToken: any = useSelector((state: RootState) => state.auth.value);
  const user: any = useSelector((state: RootState) => state.user.value);

  const columns: any = [
    // { key: "id", label: "ID" },
    { key: 'reason', label: 'Log' },
    { key: 'added_by', label: 'Organization' },
    { key: 'visit_by', label: 'Visitor' },
    { key: 'user', label: 'Customer' },
    { key: 'user', label: 'Contact' },
    { key: 'createdAt', label: 'Added on' },
    { key: 'action', label: 'Actions' },
  ];

  useLayoutEffect(() => {
    getAllLogs(1);
  }, []);

  const onHandle = (item: any, id: string) => {
    if (item.title.toLowerCase() === 'view') {
      navigate(`/user/${id}`);
    } else if (item.title.toLowerCase() === 'delete') {
      let confirm = window.confirm('Are you sure you want to delete this log?');
      if (confirm) onRemoveLog(id);
    }
  };

  const getAllLogs = async (page: number) => {
    try {
      setLoading(true);
      let { data, status } = await getLogs(
        { page, added_by: user?.name || user?.organization },
        authToken
      );
      if (status === 200) {
        const options =
          user?.user_type === AppRoles.ORGANIZATION_ADMIN ||
          user?.user_type === AppRoles.ADMIN
            ? []
            : [{ id: 1, title: 'Delete' }];

        let dtrows = data?.data?.results.map((item: any) => {
          item.visit_by = item?.visit_by || 'NA';
          item.user = item?.user?.fullname || 'NA';
          item.is_deleted = item.is_deleted ? 'Yes' : 'No';
          item.action = (
            <Dropdown
              options={options}
              onClick={(i: any) => onHandle(i, item?._id)}
              icon={<BsThreeDotsVertical className="h-6 w-6 cursor-pointer" />}
            />
          );
          return item;
        });
        setRows(dtrows);
        setPagination(data?.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onRemoveLog = async (id: string) => {
    try {
      setLoading(true);
      let { status, data } = await removeLog(id, authToken);
      if (status === 204) {
        toast.success('Log deleted successfully', toastUtil);
        getAllLogs(1);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message, toastUtil);
    } finally {
      setLoading(false);
    }
  };

  const [rows, setRows]: any = useState([]);
  return (
    <main className="h-full w-full inline-flex ">
      <section className="w-[280px] h-full">
        <Sidebar />
      </section>
      <section className="w-board h-full">
        <Header />

        <aside className="p-4 h-full">
          <Table
            rows={rows}
            totalPages={pagination?.totalPages}
            columns={columns}
            onHandlePage={(page: number) => {
              getAllLogs(page);
            }}
          />
        </aside>
      </section>
    </main>
  );
};
export default Logs;
