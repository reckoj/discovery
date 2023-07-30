import React, { useState, useLayoutEffect } from "react";
import { useParams } from 'react-router-dom';
import Header from "../../shared/Header";
import Sidebar from "../../shared/Sidebar";
import { getOrganization } from "../../apis/organizations.api";
import { useSelector } from "react-redux";
import { RootState } from "../../redux-toolkit/store/store";
import Loader from "../../shared/Loader";


const Organization = ({ }: any) => {
    const { id }: any = useParams();
    const authToken: any = useSelector((state: RootState) => state.auth.value);
    const [loading, setLoading] = useState(false);
    const [org, setOrg]: any = useState(null);

    useLayoutEffect(() => {
        onGetOrganization();
    }, []);

    const onGetOrganization = async () => {
        try {
            setLoading(true);
            let { data, status } = await getOrganization(id, authToken);
            if (status === 200) {
                setOrg(data?.data)
            }
        } catch (error) {

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
                loading ? <Loader /> : (
                    <section className="w-board h-full">
                        <Header />

                        <aside className="inline-flex w-full align-center justify-between p-4 flex-col">
                            <h2 className="text-xl font-bold text-cyan-800 text-center">{org?.name}</h2>

                            <div className="inline-flex items-start justify-between w-full pt-[50px] flex-wrap gap-4">
                                <div className="inline-flex flex-col">
                                    <small className="text-primary font-bold">Organization Owner</small>
                                    <input className="text-secondary" value={org?.name} disabled />
                                </div>

                                <div className="inline-flex flex-col">
                                    <small className="text-primary font-bold">Owner Email</small>
                                    <input className="text-secondary" value={org?.email} disabled />
                                </div>

                                <div className="inline-flex flex-col">
                                    <small className="text-primary font-bold">Establish Date</small>
                                    <input className="text-secondary" value={org?.established} disabled />
                                </div>

                                <div className="inline-flex flex-col">
                                    <small className="text-primary font-bold">Details</small>
                                    <input className="text-secondary" value={org?.description} disabled />
                                </div>
                            </div>
                        </aside>
                    </section>
                )
            }
        </main>
    )
};
export default Organization;