import React, { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux-toolkit/store/store";
import Button from "../../shared/Button";
import Dropdown from "../../shared/Dropdown";
import Header from "../../shared/Header";
import Sidebar from "../../shared/Sidebar";
import Table from "../../shared/Table";
import { BsThreeDotsVertical } from "react-icons/bs";
import Selector from "../../shared/Selector";
import { islands, islands_all } from "../../utils/islands";
import Modal from "../../shared/Modal";
import { MdOutlineCancel } from "react-icons/md";
import { getAlUsers, removeUser, updateUser } from "../../apis/users.api";
import { toast } from "react-toastify";
import { toastUtil } from "../../utils/toast-utils";
import { AppRoles } from "../../enums/roles";
import Loader from "../../shared/Loader";
import { addOrganizationUser, getOrganizationAdmins, updateOrganizationUser } from "../../apis/organizations.api";
import CryptoJS from "crypto-js";
import { getEnv } from "../../env";

const ENV = getEnv();

const OrganizationAdmins = ({ }: any) => {
    const navigate = useNavigate();
    const authToken: any = useSelector((state: RootState) => state.auth.value);
    const user: any = useSelector((state: RootState) => state.user.value);

    const [isModalOpen, setModalOpen] = useState(false);
    const [payload, setPayload]: any = useState({ fullname: "", email: "", password: "", organization: user?.name || user?.organization, phone: "", age: "", address: "", island: "", user_type: "" });
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination]: any = useState();

    const columns: any = [
        // { key: "id", label: "ID" },
        { key: "fullname", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "address", label: "Address" },
        { key: "email", label: "Email" },
        { key: "island", label: "Island" },
        { key: "user_type", label: "User Role" },
        { key: "action", label: "Actions" },
    ];

    const [rows, setRows]: any = useState();

    useLayoutEffect(() => {
        onGettingUsers(1, "");
    }, []);

    const getRoleBasedActions = () => {
        let admin_opts = [{ id: 1, title: "Edit" }, { id: 2, title: "Delete" }];
        if (user?.user_type === AppRoles.SUPER_ADMIN || user?.user_type === AppRoles.ORGANIZATION)
            return admin_opts
    }

    const onHandle = (item: any, _user: any) => {
        setLoading(true);
        if (item.title.toLowerCase() === "view") {
            navigate(`/user/${_user?._id}`);
        }
        else if (item.title.toLowerCase() === "edit") {
            let user = { ..._user, island: { label: _user.island, value: _user.island } };
            var bytes = CryptoJS.AES.decrypt(user?.password, ENV.ENCRYPT_KEY);
            var dbPassword = bytes.toString(CryptoJS.enc.Utf8);
            user.password = dbPassword;
            setPayload(user);
            setModalOpen(true);
        }
        else if (item.title.toLowerCase() === "delete") {
            let confirm = window.confirm("Are you sure you want to delete this user?");
            if (confirm)
                onRemoveUser(_user._id);
        }
        setLoading(false);
    };

    const onGettingUsers = async (page: number, island: "") => {
        try {
            setLoading(true);
            let options: any = getRoleBasedActions();
            let { status, data } = await getOrganizationAdmins({ page, island, organization: user?.name || user?.organization }, authToken);
            if (status === 200) {
                let dtrows = data?.data?.results.map((item: any) => {
                    item.attachments = item.attachments.length;
                    item.action = <Dropdown options={options} onClick={(i: any) => onHandle(i, item)} icon={<BsThreeDotsVertical className="h-6 w-6 cursor-pointer" />} />;
                    return item;
                });
                setRows(dtrows);
                setPagination(data?.data);
            }

        } catch (error: any) {
            toast.error(error?.response?.data?.message, toastUtil);

        } finally {
            setModalOpen(false);
            setLoading(false);
        }
    };

    const onRemoveUser = async (id: string) => {
        try {
            setLoading(true);
            let { status, data } = await removeUser(id, authToken);
            if (status === 204) {
                toast.success("User deleted successfully", toastUtil);
                onGettingUsers(1, "");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message, toastUtil);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async () => {
        try {
            let error: string[] = [];
            if (!payload.fullname) error.push("Please enter the Full Name");
            if (!payload.email) error.push("Please enter the Email");
            if (!payload.organization) error.push("Please enter the Organization");
            if (!payload.phone) error.push("Please enter the Phonr");
            if (!payload.age) error.push("Please enter the Age");
            if (!payload.address) error.push("Please enter the Address");
            if (!payload.island) error.push("Please enter the Island");
            setLoading(true);
            let _payload = { ...payload, user_type: payload?.user_type?.label, island: payload?.island?.label }

            let { status } = await updateOrganizationUser(_payload, payload?._id, authToken);
            if (status === 200) {
                toast.success("Employee updated successfully!", toastUtil);
                setPayload({ fullname: "", email: "", password: "", phone: "", age: "", address: "", island: "", organization: user?.name || user?.organization, user_type: "" });
                setModalOpen(false);
                onGettingUsers(1, "");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message, toastUtil);
        } finally {
            setLoading(false);
        }
    };

    const submitUser = async () => {
        try {
            let error: string[] = [];
            if (!payload.fullname) error.push("Please enter the Full Name");
            if (!payload.email) error.push("Please enter the Email");
            if (!payload.password) error.push("Please enter the Password");
            if (!payload.organization) error.push("Please enter the Organization");
            if (!payload.phone) error.push("Please enter the Phonr");
            if (!payload.age) error.push("Please enter the Age");
            if (!payload.address) error.push("Please enter the Address");
            if (!payload.island) error.push("Please enter the Island");
            setLoading(true);
            let _payload = { ...payload, user_type: payload?.user_type?.label }

            let { status, data } = await addOrganizationUser(_payload, authToken);
            if (status === 201) {
                toast.success("Employee added successfully!", toastUtil);
                setPayload({ fullname: "", email: "", password: "", phone: "", age: "", address: "", island: "", organization: user?.name || user?.organization, user_type: "" });
                setModalOpen(false);
                onGettingUsers(1, "");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message, toastUtil);
        } finally {
            setLoading(false);
        }
    };

    const getSelected = async (item: any) => {
        try {
            setLoading(true);
            let options: any = getRoleBasedActions();

            let { status, data } = await getOrganizationAdmins({ island: item.value || null, page: Number(pagination?.currentPage) }, authToken);
            if (status === 200) {
                let dtrows = data?.data?.results.map((item: any) => {
                    item.attachments = item.attachments.length;
                    item.action = <Dropdown options={options} onClick={(i: any) => onHandle(i, item)} icon={<BsThreeDotsVertical className="h-6 w-6 cursor-pointer" />} />;
                    return item;
                });
                setRows(dtrows);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message, toastUtil);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="h-full w-full inline-flex ">
            <section className="w-[280px] h-full">
                <Sidebar />
            </section>
            {
                loading ? (
                    <Loader />
                ) : (
                    <React.Fragment>
                        <section className="w-board h-full">
                            <Header />

                            <aside className="inline-flex w-full align-center justify-between p-4">
                                <h2 className="text-2xl font-bold">Employees</h2>
                                {
                                    (user?.user_type === AppRoles.ORGANIZATION || user?.user_type === AppRoles.SUPER_ADMIN) && <Button onClick={() => setModalOpen(true)}>Add an Employee</Button>
                                }
                            </aside>

                            <aside className="p-4">
                                <div className="w-[180px]">
                                    <label className="text-cyan-800 text-sm">Select an Island</label>
                                    <Selector options={islands_all} onChange={(item: any) => getSelected(item)} />
                                </div>
                            </aside>
                            <aside className="p-4 h-full">
                                <Table rows={rows} totalPages={pagination?.totalPages} columns={columns} onHandlePage={(page: number) => getAlUsers(page, "")} />
                            </aside>
                        </section>

                        <Modal show={isModalOpen}>
                            <div className="rounded-md h-8 w-8 inline-grid place-items-center cursor-pointer absolute w-full h-full" style={{ backgroundColor: "rgba(0, 0, 0, 0.078" }}>
                                <div className="relative p-4 rounded-md shadow-cs-1 flex flex-col items-center bg-white outline-none max-h-[90%] w-[400px] overflox-x-hidden overflow-y-auto focus:outline-none screen800:px-3">
                                    <small className="absolute right-2 top-2 cursor-pointer" onClick={() => {
                                        setModalOpen(false);
                                        setPayload({ fullname: "", email: "", password: "", organization: user?.name || user?.organization, phone: "", age: "", address: "", island: "", user_type: "" })
                                    }}>
                                        <MdOutlineCancel className="w-5 h-5" />
                                    </small>
                                    <h3 className="text-primary font-medium text-xl">{payload?._id ? "Edit" : "Add"} Employee Details</h3>
                                    <form className="flex items-center flex-col rounded-lg shadow-1 bg-white p-4 w-[350px] min-h-[490px]">
                                        <div className="mb-8 relative w-full">
                                            <label className="block text-neutral-700 text-sm font-medium" htmlFor="fullname">Full Name</label>
                                            <input id="fullname" value={payload?.fullname} onChange={(e) => setPayload((prev: any) => { return { ...prev, fullname: e.target.value } })} placeholder="John Doe"
                                                className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="text" />
                                        </div>

                                        <div className="mb-8 relative w-full">
                                            <label className="block text-neutral-700 text-sm font-medium" htmlFor="address">Address</label>
                                            <input id="address" value={payload?.address} onChange={(e) => setPayload((prev: any) => { return { ...prev, address: e.target.value } })} placeholder="New Orlands"
                                                className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="text" />
                                        </div>

                                        <div className="mb-8 relative w-full">
                                            <label className="block text-neutral-700 text-sm font-medium" htmlFor="ph">Phone #</label>
                                            <input id="ph" value={payload?.phone} onChange={(e) => setPayload((prev: any) => { return { ...prev, phone: e.target.value } })} placeholder="+9259556583258"
                                                className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="text" />
                                        </div>

                                        <div className="mb-8 relative w-full">
                                            <label className="block text-neutral-700 text-sm font-medium" htmlFor="island">Island</label>
                                            <Selector options={islands} defaultValue={payload.island} onChange={(e: any) => setPayload((prev: any) => { return { ...prev, island: e.value } })} />
                                        </div>

                                        <div className="mb-8 relative w-full">
                                            <label className="block text-neutral-700 text-sm font-medium" htmlFor="role">User Role</label>
                                            <Selector options={[{ label: "org_admin", value: "Employee" }]} defaultValue={payload?.user_type} onChange={(item: any) => {
                                                setPayload((prev: any) => { return { ...prev, user_type: item } })
                                            }} />
                                        </div>

                                        <div className="mb-8 relative w-full">
                                            <label className="block text-neutral-700 text-sm font-medium" htmlFor="age">Age</label>
                                            <input id="age" value={payload?.age} onChange={(e) => setPayload((prev: any) => { return { ...prev, age: e.target.value } })} placeholder="25"
                                                className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="text" />
                                        </div>

                                        <div className="mb-8 relative w-full">
                                            <label className="block text-neutral-700 text-sm font-medium" htmlFor="email">Email</label>
                                            <input id="email" value={payload?.email} onChange={(e) => setPayload((prev: any) => { return { ...prev, email: e.target.value } })} placeholder="john@doe.com"
                                                className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="email" />
                                        </div>

                                        <div className="mb-4 relative w-full">
                                            <label className="block text-neutral-700 text-sm font-medium" htmlFor="pass">Password</label>
                                            <input id="pass" value={payload?.password} onChange={(e) => setPayload((prev: any) => { return { ...prev, password: e.target.value } })} placeholder="********"
                                                className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="password" />
                                        </div>

                                        {payload?._id ? (
                                            <Button className="h-[38px] w-[140px] mt-10" disabled={loading} htmlType="submit" loading={loading} onClick={updateUser} >
                                                Update
                                            </Button>
                                        ) : (
                                            <Button className="h-[38px] w-[140px] mt-10" disabled={loading} htmlType="submit" loading={loading} onClick={submitUser} >
                                                Add
                                            </Button>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </Modal>
                    </React.Fragment>
                )
            }
        </main>
    );
};
export default OrganizationAdmins;