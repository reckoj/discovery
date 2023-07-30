import { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import { toastUtil } from '../../utils/toast-utils';
import { loginUser } from '../../apis/users.api';
import { saveUserData } from '../../redux-toolkit/slicer/user.slicer';
import { saveToken } from '../../redux-toolkit/slicer/auth.slicer';
import { loginOrganization } from '../../apis/organizations.api';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [payload, setPayload] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);

  const onLogin = async () => {
    try {
      if (!payload.email || !payload.password)
        return toast.warning('Please enter all fields', toastUtil);
      setLoading(true);
      let { data, status } =
        current === 1
          ? await loginUser(payload)
          : await loginOrganization(payload);
      if (status === 200) {
        toast.success(data?.message, toastUtil);
        dispatch(saveUserData(data?.data?.user));
        dispatch(saveToken(data?.data?.token));
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message, toastUtil);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex items-center flex-col rounded-lg shadow-1 bg-white p-4 w-[350px] h-[400px]">
      <div className="bg-primary text-white px-6 py-2 rounded-sm relative top-[-30px]">
        Login
      </div>
      <div className="inline-flex items-center justify-center gap-2">
        <div
          className={`shadow-lg p-2 rounded-sm cursor-pointer hover:bg-gray-300 tranistion-all text-sm text-primary font-bold ${
            current === 1 && 'bg-gray-300'
          }`}
          onClick={() => setCurrent(1)}
        >
          User
        </div>
        <div
          className={`shadow-lg p-2 rounded-sm cursor-pointer hover:bg-gray-300 tranistion-all text-sm text-primary font-bold ${
            current === 2 && 'bg-gray-300'
          }`}
          onClick={() => setCurrent(2)}
        >
          Organization
        </div>
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
          placeholder="john@doe.com"
          className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
          type="email"
        />
      </div>

      <div className="mb-4 relative w-full">
        <label
          className="block text-neutral-700 text-sm font-medium"
          htmlFor="pass"
        >
          Password
        </label>
        <input
          id="pass"
          value={payload?.password}
          onChange={(e) =>
            setPayload((prev) => {
              return { ...prev, password: e.target.value };
            })
          }
          placeholder="********"
          className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
        />
      </div>

      <Button
        className="h-[38px] w-[140px] absolute bottom-4"
        disabled={loading}
        htmlType="submit"
        loading={loading}
        onClick={onLogin}
      >
        Sign in
      </Button>

      {/* <div>
        <h2 className="text-primary font-medium text-xl flex justify-center">
          Demo Accounts
        </h2>
        <div className="my-5 ">
          <h2 className="text-primary font-medium text-sm">
            Global Admin - demoadmin@admin.com
          </h2>
          <h2 className="text-primary font-medium text-sm">
            Password - Rayban23
          </h2>
        </div>
        <div className="mb-5">
          <h2 className="text-primary font-medium text-sm">
            Organization - social@email.com
          </h2>
          <h2 className="text-primary font-medium text-sm">
            Password - Rayban23
          </h2>
        </div>
        <div className="mb-5">
          <h2 className="text-primary font-medium text-sm">
            Employee username - harry@email.com
          </h2>
          <h2 className="text-primary font-medium text-sm">
            Password - Rayban23
          </h2>
        </div>
      </div> */}
    </form>
  );
};
export default Login;
