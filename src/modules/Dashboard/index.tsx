import { useSelector } from "react-redux";
import Sidebar from "../../shared/Sidebar";
import { RootState } from "../../redux-toolkit/store/store";
import { AppRoles } from "../../enums/roles";
import AdminView from "./AdminView";
import OrganizationView from "./OrganizationView";
import UsersView from "./UsersView";
import Header from "../../shared/Header";
import OrganizationAdminView from "./OrganizationAdminView";

const Dashboard = ({ }: any) => {
    const user: any = useSelector((state: RootState) => state.user.value);

    const renderUserView = () => {
        if (user?.user_type === AppRoles.SUPER_ADMIN) return <AdminView />
        else if (user?.user_type === AppRoles.ORGANIZATION) return <OrganizationView />
        else if (user?.user_type === AppRoles.ORGANIZATION_ADMIN) return <OrganizationAdminView />
        else if (user?.user_type === AppRoles.USER) return <UsersView user={user} />
        else return <AdminView />
    };

    return (
        <main className="h-full w-full inline-flex ">
            <section className="w-[280px] h-full">
                <Sidebar />
            </section>
            <section className="w-board h-full">
                <Header />
                {renderUserView()}
            </section>
        </main>
    );
}

export default Dashboard;