import { useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { saveToken } from '../../redux-toolkit/slicer/auth.slicer';
import { saveUserData } from '../../redux-toolkit/slicer/user.slicer';
import { RootState } from '../../redux-toolkit/store/store';
import SearchBar from '../Searchbar/search';

const Header = () => {
  const user: any = useSelector((state: RootState) => state.user.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onPerformLogout = () => {
    dispatch(saveToken(''));
    dispatch(saveUserData(''));
    localStorage.clear();
    navigate('/authenticate/login');
  };

  return (
    <>
      <nav className="bg-primary w-full h-[44px]">
        <ul className="inline-flex justify-between w-full h-full items-center pr-4 gap-3">
          <div className="flex justify-end w-full">
            <li className="text-white mr-4">
              {user?.fullname ? user?.fullname : user?.name}
            </li>
            <li onClick={() => onPerformLogout()}>
              <BiLogOut className="h-6 w-6 text-white transition-all hover:text-gray-400 cursor-pointer" />
            </li>
          </div>
        </ul>
      </nav>
    </>
  );
};
export default Header;
