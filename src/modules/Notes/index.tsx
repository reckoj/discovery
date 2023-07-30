import { useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Dropdown from "../../shared/Dropdown";
import Header from "../../shared/Header";
import Sidebar from "../../shared/Sidebar";
import Table from "../../shared/Table";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../../redux-toolkit/store/store";
import { toastUtil } from "../../utils/toast-utils";
import { getNotes, removeNote } from "../../apis/notes.api";

const Notes = ({ }: any) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination]: any = useState();
    const authToken: any = useSelector((state: RootState) => state.auth.value);

    const columns: any = [
        // { key: "id", label: "ID" },
        { key: "title", label: "Title" },
        { key: "content", label: "Content" },
        { key: "user", label: "Added For" },
        { key: "added_by", label: "Added By" },
        { key: "createdAt", label: "Added on" },
        { key: "action", label: "Actions" },
    ];
    const options = [{ id: 1, title: "View" }, { id: 2, title: "Edit" }, { id: 3, title: "Delete" }];

    useLayoutEffect(() => {
        getAllNotes(1)
    }, []);


    const onHandle = (item: any, id: string) => {
        if (item.title.toLowerCase() === "view") {
            navigate(`/user/${id}`);
        }
        else if (item.title.toLowerCase() === "delete") {
            let confirm = window.confirm("Are you sure you want to delete this note?");
            if (confirm)
                onRemoveNote(id);
        }
    };

    const getAllNotes = async (page: number) => {
        try {
            setLoading(true);
            let { data, status } = await getNotes({ page }, authToken);
            if (status === 200) {
                let dtrows = data?.data?.results.map((item: any) => {
                    item.user = item?.user?.fullname || "NA";
                    item.is_deleted = item.is_deleted ? "Yes" : "No";
                    item.action = <Dropdown options={options} onClick={(i: any) => onHandle(i, item?._id)} icon={<BsThreeDotsVertical className="h-6 w-6 cursor-pointer" />} />;
                    return item;
                });
                setRows(dtrows);
                setPagination(data?.data)
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const onRemoveNote = async (id: string) => {
        try {
            setLoading(true);
            let { status, data } = await removeNote(id, authToken);
            if (status === 204) {
                toast.success("Note deleted successfully", toastUtil);
                getAllNotes(1);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message, toastUtil);
        } finally {
            setLoading(false);
        }
    };

    const [rows, setRows]: any = useState([])
    return (
        <main className="h-full w-full inline-flex ">
            <section className="w-[280px] h-full">
                <Sidebar />
            </section>
            <section className="w-board h-full">
                <Header />

                <aside className="p-4 h-full">
                    <Table rows={rows} totalPages={pagination?.totalPages} columns={columns} onHandlePage={(page: number) => { getAllNotes(page) }} />
                </aside>
            </section>
        </main>
    );
};
export default Notes;