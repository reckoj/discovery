import React, { PropsWithChildren, Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux-toolkit/store/store';
import Loader from '../../shared/Loader';
import { AppRoles } from '../../enums/roles';

// Modules
const Authenticate = lazy(() => import('../Authenticate'));
const Dashboard = lazy(() => import('../Dashboard'));
const Organizations = lazy(() => import('../Organizations'));
const Organization = lazy(() => import('../Organization'));
const Users = lazy(() => import('../Users'));
const Customers = lazy(() => import('../Customers'));
const Contacts = lazy(() => import('../Contacts'));
const OrganizationAdmins = lazy(() => import('../OrganizationAdmins'));
const User = lazy(() => import('../User'));
const Employee = lazy(() => import('../Employee'));
const Orders = lazy(() => import('../Orders'));
const Profile = lazy(() => import('../Profile'));
const Notes = lazy(() => import('../Notes'));
const Logs = lazy(() => import('../Logs'));

const AuthenticateRoute = (props: PropsWithChildren) => {
  const { children } = props;
  const authToken: any = useSelector((state: RootState) => state.auth.value);
  if (authToken) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return <Navigate to="authenticate/login" replace />;
};

const AuthenticateAuthRoute = (props: PropsWithChildren) => {
  const { children } = props;
  const authToken: any = useSelector((state: RootState) => state.auth.value);
  if (!authToken) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return <Navigate to="/organization-users" replace />;
};

const AuthenticateRole = (props: PropsWithChildren | any) => {
  const { children, role } = props;
  const user: any = useSelector((state: RootState) => state.user.value);
  if (role === AppRoles.ALL || user?.user_type === role)
    return <React.Fragment>{children}</React.Fragment>;
  return <Navigate to="/organization-users" replace />;
};

const RouterModule = () => {
  const dispatch = useDispatch();
  const authToken: any = useSelector((state: RootState) => state.auth.value);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<Loader />}>
            <AuthenticateRoute>
              <AuthenticateRole role={AppRoles.ALL}>
                <Dashboard guard={authToken} />
              </AuthenticateRole>
            </AuthenticateRoute>
          </Suspense>
        }
      />
      <Route
        path="/authenticate/:type"
        element={
          <Suspense fallback={<Loader />}>
            <AuthenticateAuthRoute>
              <Authenticate guard={authToken} />
            </AuthenticateAuthRoute>
          </Suspense>
        }
      />

      <Route
        path="/organizations"
        element={
          <Suspense fallback={<Loader />}>
            <Organizations guard={authToken} />
          </Suspense>
        }
      />

      <Route
        path="/organization/:id"
        element={
          <Suspense fallback={<Loader />}>
            <Organization guard={authToken} />
          </Suspense>
        }
      />

      <Route
        path="/users"
        element={
          <Suspense fallback={<Loader />}>
            <Users guard={authToken} />
          </Suspense>
        }
      />

      <Route
        path="/organization-users"
        element={
          <Suspense fallback={<Loader />}>
            <Customers guard={authToken} />
          </Suspense>
        }
      />
      <Route
        path="/organization-contacts"
        element={
          <Suspense fallback={<Loader />}>
            <Contacts guard={authToken} />
          </Suspense>
        }
      />

      <Route
        path="/organization-admins"
        element={
          <Suspense fallback={<Loader />}>
            <OrganizationAdmins guard={authToken} />
          </Suspense>
        }
      />

      <Route
        path="/user/:id"
        element={
          <Suspense fallback={<Loader />}>
            <User guard={authToken} />
          </Suspense>
        }
      />
    
      <Route
        path="/employee/:id"
        element={
          <Suspense fallback={<Loader />}>
            <Employee guard={authToken} />
          </Suspense>
        }
      />

      <Route
        path="/orders"
        element={
          <Suspense fallback={<Loader />}>
            <Orders guard={authToken} />
          </Suspense>
        }
      />

      <Route
        path="/profile"
        element={
          <Suspense fallback={<Loader />}>
            <Profile guard={authToken} />
          </Suspense>
        }
      />

      <Route
        path="/notes"
        element={
          <Suspense fallback={<Loader />}>
            <Notes guard={authToken} />
          </Suspense>
        }
      />

      <Route
        path="/logs"
        element={
          <Suspense fallback={<Loader />}>
            <Logs guard={authToken} />
          </Suspense>
        }
      />
    </Routes>
  );
};
export default RouterModule;
