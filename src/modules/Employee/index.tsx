import React, { useState, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../../shared/Header';
import { MdOutlineCancel } from 'react-icons/md';
import Modal from '../../shared/Modal';
import Sidebar from '../../shared/Sidebar';
import Button from '../../shared/Button';
import Accordion from '../../shared/Collapse';
import { AiOutlinePlus } from 'react-icons/ai';
import { RootState } from '../../redux-toolkit/store/store';
import { useSelector } from 'react-redux';
import { toastUtil } from '../../utils/toast-utils';
import { getUserNotes, postUserNotes } from '../../apis/notes.apis';
import { getContact } from '../../apis/contacts.api';
import { getUser } from '../../apis/users.api';

const Employee = ({}: any) => {
  const { id }: any = useParams();
  const user: any = useSelector((state: RootState) => state.user.value);
  const authToken: any = useSelector((state: RootState) => state.auth.value);

  const [isModalOpen, setModalOpen] = useState({ notes: false });
  const [payload, setPayload] = useState({
    reason: '',
    is_deleted: false,
    user: user?._id,
  });
  const [notes, setNotes] = useState({
    title: '',
    content: '',
    is_deleted: false,
    added_by: '',
  });
  const [loading, setLoading] = useState(false);
  const [org, setOrg]: any = useState(null);
  const [accordion, setAccordian]: any = useState([]);

  useLayoutEffect(() => {
    onGetUser();
    onGetUserNotes();
    onGetContact();
  }, []);

  const onGetUser = async () => {
    try {
      setLoading(true);
      let { data, status } = await getUser(id, authToken);
      if (status === 200) {
        setOrg(data?.data);
        setPayload((prev) => {
          return { ...prev, user: id };
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onGetUserNotes = async () => {
    try {
      setLoading(true);
      let { data, status } = await getUserNotes(id, authToken);
      if (status === 200) {
        setAccordian(data?.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onGetContact = async () => {
    try {
      setLoading(true);
      let { data, status } = await getContact(id, authToken);
      if (status === 200) {
        setOrg(data?.data);
        setPayload((prev) => {
          return { ...prev, user: id };
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onPostNote = async () => {
    try {
      if (!notes.content || !notes.title)
        return toast.warning('Please enter notes details', toastUtil);
      setLoading(true);
      let payl = {
        ...notes,
        user: id,
        added_by: user?.email,
        userType: 'User',
      };
      let { data, status } = await postUserNotes(payl, authToken);
      if (status === 201) {
        toast.success('Note added for user', toastUtil);
        setModalOpen((prev) => {
          return { ...prev, notes: false };
        });
        onGetUserNotes();
      }
    } catch (error) {
      toast.error('Could not post note', toastUtil);
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

        <aside
          className="inline-flex w-full align-center p-4 flex-col overflow-x-hidden overflow-y-auto"
          style={{ height: 'calc(100% - 40px)' }}
        >
          <h2 className="text-xl font-bold text-cyan-800 text-center">
            {org?.fullname}
          </h2>

          <div className="inline-flex items-start justify-between w-full h-full">
            <section className="w-[70%] inline-flex flex-wrap gap-4">
              <div className="inline-flex flex-col">
                <small className="text-primary font-bold">Name</small>
                <input
                  className="text-secondary"
                  value={org?.fullname}
                  disabled
                />
              </div>

              <div className="inline-flex flex-col">
                <small className="text-primary font-bold">Email</small>
                <input className="text-secondary" value={org?.email} disabled />
              </div>

              <div className="inline-flex flex-col">
                <small className="text-primary font-bold">Phone</small>
                <input className="text-secondary" value={org?.phone} disabled />
              </div>

              <div className="inline-flex flex-col">
                <small className="text-primary font-bold">Address</small>
                <input
                  className="text-secondary"
                  value={org?.address}
                  disabled
                />
              </div>

              <div className="inline-flex flex-col">
                <small className="text-primary font-bold">Organization</small>
                <input
                  className="text-secondary"
                  value={org?.organization}
                  disabled
                />
              </div>

              <div className="inline-flex flex-col">
                <small className="text-primary font-bold">Island</small>
                <input
                  className="text-secondary"
                  value={org?.island}
                  disabled
                />
              </div>

              <div className="inline-flex flex-col">
                <small className="text-primary font-bold">Attachments</small>
                <input
                  className="text-secondary"
                  value={org?.attachments?.length}
                  disabled
                />
                {React.Children.toArray(
                  org?.attachments?.map((img: any) => (
                    <img
                      src={img}
                      alt="Image"
                      className="max-w-[200px] max-h-[200px] m-2 cursor-pointer"
                      onClick={() => {
                        window.open(img, '_blank');
                      }}
                    />
                  ))
                )}
                <img src="" alt="" />
              </div>
            </section>
            <section className="w-[30%] max-h-full overflow-y-auto">
              <Button
                className="text-white text-lg mb-3"
                onClick={() => {
                  setModalOpen((prev) => {
                    return { ...prev, notes: true };
                  });
                }}
              >
                <AiOutlinePlus />
                <small>Add new note</small>
              </Button>
              {React.Children.toArray(
                accordion.map((ac: any) => <Accordion item={ac} />)
              )}
            </section>
          </div>
        </aside>
      </section>

      <Modal show={isModalOpen.notes}>
        <div
          className="rounded-md h-8 w-8 inline-grid place-items-center cursor-pointer absolute w-full h-full"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.078' }}
        >
          <div className="p-8 rounded-md shadow-cs-1 flex flex-col items-center w-full bg-white outline-none focus:outline-none screen800:px-3">
            <div className="mb-8 relative w-[300px]">
              <MdOutlineCancel
                className="absolute right-[-1rem] top-[-1rem] cursor-pointer"
                onClick={() => setModalOpen({ notes: false })}
              />
              <label
                className="block text-neutral-700 text-lg font-bold"
                htmlFor="note"
              >
                Note Title
              </label>
              <input
                id="note"
                value={notes?.title}
                onChange={(e) =>
                  setNotes((prev) => {
                    return { ...prev, title: e.target.value };
                  })
                }
                placeholder="Enter note title"
                className=" h-[40px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 mt-2 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
              />
            </div>
            <div className="mb-8 relative w-[300px]">
              <label
                className="block text-neutral-700 text-lg font-bold"
                htmlFor="note"
              >
                Note Content
              </label>
              <input
                id="noteEmployee"
                value={notes?.content}
                onChange={(e) =>
                  setNotes((prev) => {
                    return { ...prev, content: e.target.value };
                  })
                }
                placeholder="Enter note content"
                className=" h-[40px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 mt-2 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
              />
            </div>
            <Button onClick={onPostNote}>Submit</Button>
          </div>
        </div>
      </Modal>
    </main>
  );
};
export default Employee;
