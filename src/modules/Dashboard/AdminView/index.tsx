import { MdSupervisorAccount } from 'react-icons/md';
import { RiOrganizationChart } from 'react-icons/ri';
import { GiPapers } from 'react-icons/gi';
import { FiUsers } from 'react-icons/fi';
import { useLayoutEffect, useState } from 'react';
import { getStats } from '../../../apis/dashboard.apis';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux-toolkit/store/store';
import { MdNotes } from 'react-icons/md';

const AdminView = ({}: any) => {
  const authToken: any = useSelector((state: RootState) => state.auth.value);
  const [payload, setPayload]: any = useState({
    users: 0,
    organizations: 0,
    notes: 0,
    orders: 0,
    logs: 0,
  });
  const [loading, setLoading] = useState(false);
  useLayoutEffect(() => {
    onGetStats();
  }, []);

  const onGetStats = async () => {
    try {
      setLoading(true);
      let { data, status } = await getStats(authToken);
      if (status === 200) {
        
        setPayload({
          users: data?.data?.users,
          organizations: data?.data?.organizations,
          notes: data?.data?.notes,
          logs: data?.data?.logs,
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="h-full w-full px-4 pt-12"
      style={{ backgroundColor: '#eceff180' }}
    >
      <section className="flex gap-6 flex-wrap justify-center">
        <div className="shadow-md relative w-[170px] h-[140px] bg-white">
          <div className="absolute top-[-20px] shadow-lg shadow-blue-500 bg-blue-400 w-20 h-12 rounded-md inline-grid place-items-center left-1/2 translate-x-[-50%]">
            <FiUsers className="w-7 h-7 text-white" />
          </div>
          <aside className="relative pt-12 w-full inline-flex items-center flex-col gap-0">
            <small className="font-bold text-lg text-primary">Users</small>
            <small className="font-bold text-2xl text-secondary">
              {payload?.users}
            </small>
          </aside>
        </div>

        <div className="shadow-md relative w-[170px] h-[140px] bg-white">
          <div className="absolute top-[-20px] shadow-lg shadow-green-500 bg-green-400 w-20 h-12 rounded-md inline-grid place-items-center left-1/2 translate-x-[-50%]">
            <GiPapers className="w-7 h-7 text-white" />
          </div>
          <aside className="relative pt-12 w-full inline-flex items-center flex-col gap-0">
            <small className="font-bold text-lg text-primary">Orders</small>
            <small className="font-bold text-2xl text-secondary">
              {payload?.notes || 0}
            </small>
          </aside>
        </div>

        <div className="shadow-md relative w-[170px] h-[140px] bg-white">
          <div className="absolute top-[-20px] shadow-lg shadow-red-500 bg-red-400 w-20 h-12 rounded-md inline-grid place-items-center left-1/2 translate-x-[-50%]">
            <MdNotes className="w-7 h-7 text-white" />
          </div>
          <aside className="relative pt-12 w-full inline-flex items-center flex-col gap-0">
            <small className="font-bold text-lg text-primary">Logs</small>
            <small className="font-bold text-2xl text-secondary">
              {payload?.logs || 0}
            </small>
          </aside>
        </div>

        <div className="shadow-md relative w-[170px] h-[140px] bg-white">
          <div className="absolute top-[-20px] shadow-lg shadow-orange-500 bg-orange-400 w-20 h-12 rounded-md inline-grid place-items-center left-1/2 translate-x-[-50%]">
            <RiOrganizationChart className="w-7 h-7 text-white" />
          </div>
          <aside className="relative pt-12 w-full inline-flex items-center flex-col gap-0">
            <small className="font-bold text-lg text-primary">
              Organizations
            </small>
            <small className="font-bold text-2xl text-secondary">
              {payload?.organizations}
            </small>
          </aside>
        </div>
      </section>
    </main>
  );
};
export default AdminView;
