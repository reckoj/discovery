import React, { useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../../redux-toolkit/store/store';
import { MdDashboard } from 'react-icons/md';
import { MdSupervisorAccount } from 'react-icons/md';
import { RiOrganizationChart } from 'react-icons/ri';
import { GiTicket } from 'react-icons/gi';
import { GiPapers } from 'react-icons/gi';

import { FiUsers } from 'react-icons/fi';
import { CgNotes } from 'react-icons/cg';
import { MdNotes } from 'react-icons/md';
import { AppRoles } from '../../enums/roles';
import Logo from '../../styles/logo.jpg';
import OrganizationView from '../../modules/Dashboard/OrganizationView';
import OrganizationAdminView from '../../modules/Dashboard/OrganizationAdminView';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user: any = useSelector((state: RootState) => state.user.value);
  const adminSidebar = [
    { id: 1, title: 'Dashboard', icon: <MdDashboard />, url: '/' },
    { id: 2, title: 'Users', icon: <MdSupervisorAccount />, url: '/users' },
    {
      id: 3,
      title: 'Organizations',
      icon: <RiOrganizationChart />,
      url: '/organizations',
    },
    {
      id: 4,
      title: 'Employees',
      icon: <FiUsers />,
      url: '/organization-admins',
    },
    {
      id: 5,
      title: 'Customers',
      icon: <FiUsers />,
      url: '/organization-users',
    },
    { id: 6, title: 'Orders', icon: <GiPapers />, url: '/orders' },
    { id: 7, title: 'Notes', icon: <CgNotes />, url: '/notes' },
    { id: 8, title: 'Visit Logs', icon: <MdNotes />, url: '/logs' },
    {
      id: 9,
      title: 'Contacts',
      icon: <FiUsers />,
      url: '/organization-contacts',
    },
  ];
  const organizationSidebar = [
    // { id: 1, title: 'Dashboard', icon: <MdDashboard />, url: '/' },
    {
      id: 2,
      title: 'Employees',
      icon: <FiUsers />,
      url: '/organization-admins',
    },
    {
      id: 3,
      title: 'Customers',
      icon: <FiUsers />,
      url: '/organization-users',
    },
    { id: 4, title: 'Visit Logs', icon: <MdNotes />, url: '/logs' },
    { id: 5, title: 'Orders', icon: <GiPapers />, url: '/orders' },
    {
      id: 6,
      title: 'Contacts',
      icon: <FiUsers />,
      url: '/organization-contacts',
    },
  ];

  const organizationAdminSidebar = [
    // { id: 1, title: 'Dashboard', icon: <MdDashboard />, url: '/' },
    {
      id: 2,
      title: 'Employees',
      icon: <FiUsers />,
      url: '/organization-admins',
    },
    {
      id: 3,
      title: 'Customers',
      icon: <FiUsers />,
      url: '/organization-users',
    },
    { id: 4, title: 'Visit Logs', icon: <MdNotes />, url: '/logs' },
    { id: 5, title: 'Orders', icon: <GiPapers />, url: '/orders' },
    // {
    //   id: 6,
    //   title: 'Contacts',
    //   icon: <FiUsers />,
    //   url: '/organization-contacts',
    // },
  ];

  const [selected, setSelected]: any = useState(null);
  useLayoutEffect(() => {
    if (user?.user_type === AppRoles.SUPER_ADMIN) {
      let fi = adminSidebar.find((as) => as.url === location.pathname);
      if (fi) setSelected(fi);
      else setSelected(adminSidebar[0]);
    } else if (user?.user_type === AppRoles.ORGANIZATION) {
      let fi = organizationSidebar.find((as) => as.url === location.pathname);
      if (fi) setSelected(fi);
      else setSelected(organizationSidebar[0]);
    } else if (user?.user_type === AppRoles.ORGANIZATION_ADMIN) {
      let fi = organizationAdminSidebar.find(
        (as) => as.url === location.pathname
      );
      if (fi) setSelected(fi);
      else setSelected(organizationAdminSidebar[0]);
    }
  }, [location]);

  const renderRoleBasedItems = () => {
    if (user?.user_type === AppRoles.SUPER_ADMIN) {
      return (
        <ul className="flex flex-col mx-3 mt-3 gap-3">
          {React.Children.toArray(
            adminSidebar.map((item: any) => {
              return (
                <li
                  onClick={() => {
                    setSelected(item);
                    navigate(`${item.url}`);
                  }}
                  className={`inline-flex items-center text-xl py-2 px-4 rounded-[20px] gap-2 cursor-pointer text-white hover:bg-transparent transition-all ${
                    selected?.id === item.id &&
                    'text-zinc-900 bg-secondary hover:bg-secondary-imp'
                  }`}
                >
                  <small className="text-lg">{item.icon}</small>
                  <small className="text-lg">{item.title}</small>
                </li>
              );
            })
          )}
        </ul>
      );
    } else if (user?.user_type === AppRoles.ORGANIZATION) {
      return (
        <>
          <ul className="flex flex-col mx-3 mt-8 gap-3">
            {React.Children.toArray(
              organizationSidebar.map((item: any) => {
                return (
                  <li
                    onClick={() => {
                      setSelected(item);
                      navigate(`${item.url}`);
                    }}
                    className={`inline-flex items-center text-xl py-2 px-4 rounded-[20px] gap-2 cursor-pointer text-white hover:bg-transparent transition-all ${
                      selected?.id === item.id &&
                      'text-zinc-900 bg-secondary hover:bg-secondary-imp'
                    }`}
                  >
                    <small className="text-lg">{item.icon}</small>
                    <small className="text-lg font-normal">{item.title}</small>
                    <small>{item.order}</small>
                  </li>
                );
              })
            )}
          </ul>
          <div className=" h-12">
            <OrganizationView />
          </div>
        </>
      );
    } else if (user?.user_type === AppRoles.ORGANIZATION_ADMIN) {
      return (
        <>
          <ul className="flex flex-col mx-3 mt-8 gap-3">
            {React.Children.toArray(
              organizationAdminSidebar.map((item: any) => {
                return (
                  <li
                    onClick={() => {
                      setSelected(item);
                      navigate(`${item.url}`);
                    }}
                    className={`inline-flex items-center text-xl py-2 px-4 rounded-[20px] gap-2 cursor-pointer text-white hover:bg-transparent transition-all ${
                      selected?.id === item.id &&
                      'text-zinc-900 bg-secondary hover:bg-secondary-imp'
                    }`}
                  >
                    <small className="text-lg">{item.icon}</small>
                    <small className="text-lg font-normal">{item.title}</small>
                  </li>
                );
              })
            )}
          </ul>
          <div>
            <OrganizationAdminView />
          </div>
        </>
      );
    }
  };

  return (
    <section className="bg-primary h-full w-full">
      <div className="relative h-[40px] font-bold text-xl text-center pt-1 inline-flex align-center gap-2 items-center  w-full">
        <img
          className="pl-4 py-1 max-h-[100%] max-w-[100%]"
          src={Logo}
          alt="Bethelle"
        />
        <span className="text-white"> Discovery</span>
      </div>

      {renderRoleBasedItems()}
    </section>
  );
};
export default Sidebar;
