import Login from '../../shared/Login';
import { useNavigate, useParams } from 'react-router-dom';
import Signup from '../../shared/Signup';

const Authenticate = ({}: any) => {
  const { type } = useParams();

  return (
    <main className="h-full w-full bg-[#3A6A7D]">
      <img
        className="relative z-1 h-full w-full"
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        alt=""
      />
      {type === 'login' ? <Login /> : <Signup />}
    </main>
  );
};
export default Authenticate;
