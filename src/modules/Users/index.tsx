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
import { addUser, getAlUsers, removeUser, updateUser } from "../../apis/users.api";
import { toast } from "react-toastify";
import { toastUtil } from "../../utils/toast-utils";
import Loader from "../../shared/Loader";
import { getAlOrganizations } from "../../apis/organizations.api";

const Users = ({ }: any) => {
    const navigate = useNavigate();
    const authToken: any = useSelector((state: RootState) => state.auth.value);
    const user: any = useSelector((state: RootState) => state.user.value);

    const [isModalOpen, setModalOpen] = useState(false);
    const [payload, setPayload]: any = useState({ fullname: "", email: "", password: "", organization: "", phone: "", age: "", address: "", island: "", user_type: "" });
    const [loading, setLoading] = useState(false);
    const [organizations, setOrganizations] = useState({ all: [], names: [] });
    const [pagination, setPagination]: any = useState();

    const [columns, setColumns]: any = useState([]);

    const [rows, setRows]: any = useState();

    useLayoutEffect(() => {
        setColumns([
            // { key: "id", label: "ID" },
            { key: "fullname", label: "Name" },
            { key: "phone", label: "Phone" },
            { key: "address", label: "Address" },
            { key: "attachments", label: "Attachments" },
            { key: "organization", label: "Organization" },
            { key: "island", label: "Island" },
            { key: "user_type", label: "User Role" },
            { key: "action", label: "Actions" },
        ]);
        onGettingOrganizations();
        onGettingUsers(1, "");
    }, []);

    const onHandle = (item: any, id: string) => {
        if (item.title.toLowerCase() === "view") {
            navigate(`/user/${id}`);
        }
        else if (item.title.toLowerCase() === "delete") {
            let confirm = window.confirm("Are you sure you want to delete this user?");
            if (confirm)
                onRemoveUser(id);
        }

        else if (item.title.toLowerCase() === "make employee") {
            let confirm = window.confirm("Are you sure you want to make this user employee?");
            if (confirm)
                onUpdateUser(id, { user_type: "org_admin" });
        }
    };

    const onGettingOrganizations = async () => {
        try {
            setLoading(true);
            let { status, data } = await getAlOrganizations(1, authToken);
            if (status === 200) {
                let orgs = data?.data?.results?.map((org: any) => {
                    return { label: org?.name, value: org?.name }
                });
                setOrganizations({ names: orgs, all: data?.data?.results })

            }

        } catch (error: any) {
            toast.error(error?.response?.data?.message, toastUtil);

        } finally {
            setModalOpen(false);
            setLoading(false);
        }
    };

    const getRoleBasedActions = () => {
        let opts = [{ id: 1, title: "Delete" }, { id: 2, title: "Make Employee" }];
        return opts;
    }

    const onGettingUsers = async (page: number, island: "") => {
        try {
            setLoading(true);
            let options: any = getRoleBasedActions();
            let { status, data } = await getAlUsers({ page, island }, authToken);
            if (status === 200) {
                let dtrows = data?.data?.results.map((item: any) => {
                    item.attachments = item.attachments.length;
                    item.action = <Dropdown options={options} onClick={(i: any) => onHandle(i, item?._id)} icon={<BsThreeDotsVertical className="h-6 w-6 cursor-pointer" />} />;
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

    const onUpdateUser = async (id: string, payload: any) => {
        try {
            setLoading(true);
            let { status, data } = await updateUser(id, payload, authToken);
            if (status === 200) {
                toast.success("User updated successfully", toastUtil);
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
            if (!payload.phone) error.push("Please enter the Phone");
            if (!payload.age) error.push("Please enter the Age");
            if (!payload.address) error.push("Please enter the Address");
            if (!payload.island) error.push("Please enter the Island");
            if (error.length) return error.forEach(err => toast.warning(err, toastUtil));
            setLoading(true);
            let _payload = { ...payload, organization: payload?.organization?.value, user_type: payload?.user_type?.label }
            let { status, data } = await addUser(_payload, authToken);
            if (status === 201) {
                toast.success("User added successfully!", toastUtil);
                setPayload({ fullname: "", email: "", password: "", organization: "", phone: "", age: "", address: "", island: "", user_type: "" });
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

            let { status, data } = await getAlUsers({ island: item.value || null, page: Number(pagination?.currentPage) }, authToken);
            if (status === 200) {
                let dtrows = data?.data?.results.map((item: any) => {
                    item.attachments = item.attachments.length;
                    item.action = <Dropdown options={options} onClick={(i: any) => onHandle(i, item?._id)} icon={<BsThreeDotsVertical className="h-6 w-6 cursor-pointer" />} />;
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
                                <h2 className="text-2xl font-bold">Users</h2>
                                <Button onClick={() => setModalOpen(true)}>Add a User</Button>
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
                                    <small className="absolute right-2 top-2 cursor-pointer" onClick={() => setModalOpen(false)}>
                                        <MdOutlineCancel className="w-5 h-5" />
                                    </small>
                                    <h3 className="text-primary font-medium text-xl">Add User Details</h3>
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
                                            <Selector options={islands} onChange={(e: any) => setPayload((prev: any) => { return { ...prev, island: e.value } })} />
                                        </div>

                                        <div className="mb-8 relative w-full">
                                            <label className="block text-neutral-700 text-sm font-medium" htmlFor="org">Organization</label>
                                            <Selector options={organizations?.names} defaultValue={payload?.organization} onChange={(item: any) => {
                                                setPayload((prev: any) => { return { ...prev, organization: item } })
                                            }} />
                                        </div>

                                        <div className="mb-8 relative w-full">
                                            <label className="block text-neutral-700 text-sm font-medium" htmlFor="role">User Role</label>
                                            <Selector options={[{ label: "org_admin", value: "Admin" }]} defaultValue={payload?.user_type} onChange={(item: any) => {
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

                                        <Button
                                            className="h-[38px] w-[140px] mt-10"
                                            disabled={loading}
                                            loading={loading}
                                            onClick={submitUser}
                                        >
                                            Add
                                        </Button>
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
export default Users;