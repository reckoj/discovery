import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import { useDispatch } from 'react-redux';
import Selector from '../Selector';
import { islands } from '../../utils/islands';
import { AppRoles } from '../../enums/roles';
import { getVerificationCode, signupUser } from '../../apis/users.api';
import { toastUtil } from '../../utils/toast-utils';
import { saveUserData } from '../../redux-toolkit/slicer/user.slicer';
import { saveToken } from '../../redux-toolkit/slicer/auth.slicer';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    fullname: '',
    email: '',
    password: '',
    organization: '',
    phone: '',
    age: '',
    address: '',
    island: '',
    user_type: AppRoles.USER,
  });
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationState, setVerificationState] = useState(false);

  const onVerifyAccount = async () => {
    try {
      setLoading(true);
      let { data, status } = await signupUser(payload, code);
      if (status === 201) {
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

  const onSignup = async () => {
    try {
      setLoading(true);
      let { data, status } = await getVerificationCode(payload);
      if (status === 201) {
        setVerificationState(true);
        toast.success(data?.message, toastUtil);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message, toastUtil);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={`absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex items-center flex-col rounded-lg shadow-1 bg-white p-4 w-[350px] max-h-[100%] overflow-y-auto ${
        !verificationState ? 'min-h-[490px]' : 'min-h-[200px]'
      }`}
    >
      {!verificationState ? (
        <React.Fragment>
          <div className="mb-8 relative w-full">
            <label
              className="block text-neutral-700 text-sm font-medium"
              htmlFor="fullname"
            >
              Full Name
            </label>
            <input
              id="fullname"
              value={payload?.fullname}
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
              htmlFor="address"
            >
              Address
            </label>
            <input
              id="address"
              value={payload?.address}
              onChange={(e) =>
                setPayload((prev) => {
                  return { ...prev, address: e.target.value };
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
              htmlFor="ph"
            >
              Phone #
            </label>
            <input
              id="ph"
              value={payload?.phone}
              onChange={(e) =>
                setPayload((prev) => {
                  return { ...prev, phone: e.target.value };
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
              htmlFor="island"
            >
              Island
            </label>
            <Selector
              options={islands}
              onChange={(e: any) =>
                setPayload((prev) => {
                  return { ...prev, island: e.value };
                })
              }
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
              value={payload?.organization}
              onChange={(e) =>
                setPayload((prev) => {
                  return { ...prev, organization: e.target.value };
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
              htmlFor="age"
            >
              Age
            </label>
            <input
              id="age"
              value={payload?.age}
              onChange={(e) =>
                setPayload((prev) => {
                  return { ...prev, age: e.target.value };
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
            className="h-[38px] w-[140px] mt-10"
            disabled={loading}
            htmlType="submit"
            loading={loading}
            onClick={onSignup}
          >
            Signup
          </Button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="mb-8 relative w-full">
            <label
              className="block text-neutral-700 text-sm font-bold"
              htmlFor="code"
            >
              Enter Verification Code
            </label>
            <input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g 7H7DA2z"
              className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
            />
          </div>

          <Button
            className="h-[38px] w-[140px] mt-4"
            disabled={loading}
            htmlType="submit"
            loading={loading}
            onClick={onVerifyAccount}
          >
            Verify
          </Button>
        </React.Fragment>
      )}
    </form>
  );
};

export default Signup;
