import { useLayoutEffect, useState } from 'react';
import { getStatsUsers } from '../../../apis/dashboard.apis';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux-toolkit/store/store';
import { GiPapers } from 'react-icons/gi';
import { FiUsers } from 'react-icons/fi';

const UsersView = ({ user }: any) => {
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
      let { data, status } = await getStatsUsers(
        { name: user?.name || user?.organization },
        authToken
      );
      if (status === 200) {
        setPayload({ users: data?.data?.users, orders: data?.data?.orders });
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
      <h2 className="text-2xl text-primary font-bold text-center mb-10">
        Welcome to {user?.name}'s Dashboard
      </h2>

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
              {payload?.orders}
            </small>
          </aside>
        </div>
      </section>
    </main>
  );
};
export default UsersView;
