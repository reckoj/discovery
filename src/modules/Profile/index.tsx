import { useState } from 'react';
import Header from '../../shared/Header';
import Sidebar from '../../shared/Sidebar';
import Button from '../../shared/Button';

const Profile = ({}: any) => {
  const [payload, setPayload] = useState({
    fullname: '',
    email: '',
    organization: '',
    age: '',
  });
  const [loading, setLoading] = useState(false);

  return (
    <main className="h-full w-full inline-flex ">
      <section className="w-[280px] h-full">
        <Sidebar />
      </section>
      <section className="w-board h-full">
        <Header />

        <aside className="inline-flex w-full align-center justify-between p-4 flex-col">
          <h2 className="text-xl font-bold text-cyan-800">
            Welcome to your profile!
          </h2>

          <form className="max-w-[300px] mt-10">
            <div className="mb-8 relative w-full">
              <label
                className="block text-neutral-700 text-sm font-medium"
                htmlFor="fullname"
              >
                Full Name
              </label>
              <input
                id="fullname"
                value={payload?.email}
                onChange={(e) =>
                  setPayload((prev) => {
                    return { ...prev, fullname: e.target.value };
                  })
                }
                placeholder=""
                className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
              />
            </div>

            <div className="mb-8 relative w-full">
              <label
                className="block text-neutral-700 text-sm font-medium"
                htmlFor="org"
              >
                Organization
              </label>
              <input
                id="org"
                value={payload?.email}
                onChange={(e) =>
                  setPayload((prev) => {
                    return { ...prev, organization: e.target.value };
                  })
                }
                placeholder=""
                className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                type="org"
              />
            </div>

            <div className="mb-8 relative w-full">
              <label
                className="block text-neutral-700 text-sm font-medium"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                value={payload?.email}
                onChange={(e) =>
                  setPayload((prev) => {
                    return { ...prev, email: e.target.value };
                  })
                }
                placeholder=""
                className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
              />
            </div>

            <Button
              className="h-[38px] w-[140px]"
              disabled={loading}
              htmlType="submit"
              loading={loading}
            >
              Update
            </Button>
          </form>
        </aside>
      </section>
    </main>
  );
};
export default Profile;
