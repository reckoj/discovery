import { useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux-toolkit/store/store";
import { toast } from "react-toastify";
import Button from "../../shared/Button";
import Header from "../../shared/Header";
import Modal from "../../shared/Modal";
import { BsThreeDotsVertical } from "react-icons/bs";
import Sidebar from "../../shared/Sidebar";
import Table from "../../shared/Table";
import { MdOutlineCancel } from "react-icons/md";
import { toastUtil } from "../../utils/toast-utils";
import { addOrganization, getAlOrganizations, removeOrganization, updateOrganization } from "../../apis/organizations.api";
import Dropdown from "../../shared/Dropdown";
import { getAlUsers } from "../../apis/users.api";
import { AppRoles } from "../../enums/roles";
import CryptoJS from "crypto-js";
import { getEnv } from "../../env";
import Selector from "../../shared/Selector";
import { islands, islands_all } from "../../utils/islands";

const ENV = getEnv();

const Organizations = ({ }: any) => {
    const navigate = useNavigate();
    const authToken: any = useSelector((state: RootState) => state.auth.value);
    const [isModalOpen, setModalOpen] = useState(false);
    const [payload, setPayload]: any = useState({ name: "", owner: "", email: "", island: "", description: "", user_type: AppRoles.ORGANIZATION, established: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [userOptions, setUserOptions] = useState([]);
    const options = [{ id: 1, title: "View" }, { id: 2, title: "Edit" }, { id: 3, title: "Delete" }];

    const columns: any = [
        // { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "owner", label: "Owner" },
        { key: "email", label: "Owner's Email" },
        { key: "island", label: "Island" },
        { key: "established", label: "Established on" },
        { key: "action", label: "Actions" }
    ];

    const [rows, setRows]: any = useState();


    useLayoutEffect(() => {
        onGetting();
        onGettingUsers();
    }, []);

    const onHandle = (item: any, org: any) => {
        if (item.title.toLowerCase() === "view") {
            navigate(`/organization/${org?._id}`);
        }
        else if (item.title.toLowerCase() === "edit") {
            var bytes = CryptoJS.AES.decrypt(org?.password, ENV.ENCRYPT_KEY);
            var dbPassword = bytes.toString(CryptoJS.enc.Utf8);
            org.password = dbPassword;
            setPayload(org);
            setModalOpen(true);
        }
        else if (item.title.toLowerCase() === "delete") {
            let confirm = window.confirm("Are you sure you want to delete this organization?");
            if (confirm)
                onRemove(org?._id);
        }
    };

    const getSelected = async (item: any) => {
        onGetting(item.value);
    };

    const onGetting = async (island = "") => {
        try {
            setLoading(true);
            
            let { status, data } = await getAlOrganizations({island}, authToken);
            if (status === 200) {
                let dtrows = data?.data?.results.map((item: any) => {
                    item.action = <Dropdown options={options} onClick={(i: any) => onHandle(i, item)} icon={<BsThreeDotsVertical className="h-6 w-6 cursor-pointer" />} />;
                    return item;
                });
                setRows(dtrows);
            }

        } catch (error: any) {
            toast.error(error?.response?.data?.message, toastUtil);

        } finally {
            setModalOpen(false);
            setLoading(false);
        }
    };

    const onGettingUsers = async () => {
        try {
            setLoading(true);
            let { status, data } = await getAlUsers("", authToken);
            if (status === 200) {
                let dtrows = data?.data.map((item: any) => {
                    return { label: item.fullname, value: item.fullname };
                });
                setUserOptions(dtrows);
            }

        } catch (error: any) {
            toast.error(error?.response?.data?.message, toastUtil);

        } finally {
            setModalOpen(false);
            setLoading(false);
        }
    };

    const onRemove = async (id: string) => {
        try {
            setLoading(true);
            let { status, data } = await removeOrganization(id, authToken);
            if (status === 204) {
                toast.success("Organization deleted successfully", toastUtil);
                onGetting();
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message, toastUtil);
        } finally {
            setLoading(false);
        }
    };

    const submit = async () => {
        try {
            setLoading(true);
            let { status, data } = await addOrganization(payload, authToken);
            if (status === 201) {
                toast.success("Organization added successfully!", toastUtil);
                setPayload({ name: "", owner: "", email: "", description: "", island: "", established: "", user_type: AppRoles.ORGANIZATION, password: "" });
                setModalOpen(false);
                onGetting();
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message, toastUtil);
        } finally {
            setLoading(false);
        }
    };

    const update = async () => {
        try {
            setLoading(true);
            let { status, data } = await updateOrganization(payload, payload?._id, authToken);
            if (status === 200) {
                toast.success("Organization updated successfully!", toastUtil);
                setPayload({ name: "", owner: "", email: "", description: "", island: "", established: "", user_type: AppRoles.ORGANIZATION, password: "" });
                setModalOpen(false);
                onGetting();
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
            <section className="w-board h-full">
                <Header />

                <aside className="inline-flex w-full align-center justify-between p-4">
                    <h2 className="text-2xl font-bold">Organizations</h2>
                    <Button onClick={() => setModalOpen(true)}>Add New Organization</Button>
                </aside>

                <aside className="p-4">
                    <div className="w-[180px]">
                        <label className="text-cyan-800 text-sm">Select an Island</label>
                        <Selector options={islands_all} onChange={(item: any) => getSelected(item)} />
                    </div>
                </aside>

                <aside className="p-4 h-full">
                    <Table rows={rows} columns={columns} />
                </aside>
            </section>

            <Modal show={isModalOpen}>
                <div className="rounded-md h-8 w-8 inline-grid place-items-center cursor-pointer absolute w-full h-full" style={{ backgroundColor: "rgba(0, 0, 0, 0.078" }}>
                    <div className="relative p-8 rounded-md shadow-cs-1 flex flex-col items-center bg-white outline-none focus:outline-none screen800:px-3 max-h-[600px] overflow-x-hidden overflow-y-auto w-[400px]">
                        <small className="absolute right-2 top-2 cursor-pointer" onClick={() => setModalOpen(false)}>
                            <MdOutlineCancel className="w-5 h-5" />
                        </small>
                        <h3 className="text-primary font-medium text-xl">{payload?._id ? "Edit" : "Add"} Organization Details</h3>
                        <form className="flex items-center flex-col rounded-lg shadow-1 bg-white p-4 w-[350px] min-h-[490px]">
                            <div className="mb-8 relative w-full">
                                <label className="block text-neutral-700 text-sm font-medium" htmlFor="name">Organization Name</label>
                                <input id="name" value={payload?.name} onChange={(e) => setPayload((prev: any) => { return { ...prev, name: e.target.value } })} placeholder="Levis"
                                    className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="text" />
                            </div>

                            <div className="mb-8 relative w-full">
                                <label className="block text-neutral-700 text-sm font-medium" htmlFor="owner">Owner</label>
                                {/* <Selector options={userOptions} onChange={(e: any) => setPayload((prev:any) => { return { ...prev, owner: e.value } })} />
                                <p className="text-primary my-2 text-center">Or add a custom user</p> */}
                                <input id="owner" value={payload?.owner} onChange={(e) => setPayload((prev: any) => { return { ...prev, owner: e.target.value } })} placeholder="John Doe"
                                    className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="text" />
                            </div>
                            <div className="mb-8 relative w-full">
                                <label className="block text-neutral-700 text-sm font-medium" htmlFor="island">Island <b>{payload.island}</b></label>
                                <Selector options={islands} value={payload.island} defaultValue={{label: payload.island, value: payload.island}} onChange={(e: any) => setPayload((prev: any) => { return { ...prev, island: e.value } })} />
                            </div>

                            <div className="mb-8 relative w-full">
                                <label className="block text-neutral-700 text-sm font-medium" htmlFor="owner">Email</label>
                                <input id="owner" value={payload?.email} onChange={(e) => setPayload((prev: any) => { return { ...prev, email: e.target.value } })} placeholder="john@doe.com"
                                    className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="text" />
                            </div>

                            <div className="mb-8 relative w-full">
                                <label className="block text-neutral-700 text-sm font-medium" htmlFor="password">Password</label>
                                <input id="password" value={payload?.password} onChange={(e) => setPayload((prev: any) => { return { ...prev, password: e.target.value } })} placeholder="********"
                                    className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="password" />
                            </div>

                            <div className="mb-8 relative w-full">
                                <label className="block text-neutral-700 text-sm font-medium" htmlFor="description">Description</label>
                                <textarea id="description" value={payload?.description} onChange={(e) => setPayload((prev: any) => { return { ...prev, description: e.target.value } })} placeholder="Add description"
                                    className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                            </div>

                            <div className="mb-8 relative w-full">
                                <label className="block text-neutral-700 text-sm font-medium" htmlFor="est">Established on</label>
                                <input id="est" value={payload?.established} onChange={(e) => setPayload((prev: any) => { return { ...prev, established: e.target.value } })} placeholder="02-02-2022"
                                    className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="date" />
                            </div>

                            {
                                payload?._id ? (
                                    <Button className="h-[38px] w-[140px] mt-6" disabled={loading} htmlType="submit" loading={loading} onClick={update} >
                                        Update
                                    </Button>
                                ) : (
                                    <Button className="h-[38px] w-[140px] mt-6" disabled={loading} htmlType="submit" loading={loading} onClick={submit} >
                                        Add
                                    </Button>
                                )
                            }
                        </form>
                    </div>
                </div>
            </Modal>
        </main>
    );
};
export default Organizations;