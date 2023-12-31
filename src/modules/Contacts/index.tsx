import React, { useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux-toolkit/store/store';
import { toast } from 'react-toastify';
import Button from '../../shared/Button';
import Dropdown from '../../shared/Dropdown';
import Header from '../../shared/Header';
import Sidebar from '../../shared/Sidebar';
import Table from '../../shared/Table';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Modal from '../../shared/Modal';
import { MdOutlineCancel } from 'react-icons/md';
import { getAlUsers, removeUser, updateUser } from '../../apis/users.api';
import { toastUtil } from '../../utils/toast-utils';
import { AppRoles } from '../../enums/roles';
import Loader from '../../shared/Loader';
import {
  addContact,
  getAllContacts,
  removeAFile,
  removeContact,
  updateContact,
} from '../../apis/contacts.api';
import FileUpload from '../../shared/FileUpload';
import { stateReason, stateReasonOrg } from '../../apis/logs.apis';
import ImageViewer from '../../shared/ImageViewer';
import Selector from '../../shared/Selector';
import { countries, countries_all } from '../../utils/countries';
import SearchBar from '../../shared/Searchbar/search';

const Contacts = ({}: any) => {
  const navigate = useNavigate();
  const authToken: any = useSelector((state: RootState) => state.auth.value);
  const user: any = useSelector((state: RootState) => state.user.value);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isReadonModalOpen, setReasonModalOpen]: any = useState(false);
  const [attachments, setAttachments]: any = useState([]);
  const [loop, setLoop] = useState([0]);
  const [reason, setReason]: any = useState('');
  const [payload, setPayload]: any = useState({
    fullname: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    description: '',
    organization: user?.name || user?.organization,
    is_active: true,
    added_by: user?.email,
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination]: any = useState();

  const [showViewer, setShowViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowViewer(true);
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
    setSelectedImage('');
  };
  const columns: any = [
    // { key: "id", label: "ID" },
    { key: 'fullname', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    { key: 'state', label: 'State/Province' },
    { key: 'has_attachments', label: 'Uploaded Attachments' },
    { key: 'email', label: 'Email' },
    { key: 'country', label: 'Country' },
    { key: 'description', label: 'Description' },
    { key: 'action', label: 'Actions' },
  ];

  const [rows, setRows]: any = useState();

  useLayoutEffect(() => {
    onGettingUsers(1, '');
  }, []);

  const getRoleBasedActions = () => {
    let admin_opts = [
      { id: 1, title: 'View' },
      { id: 2, title: 'Edit' },
      { id: 3, title: 'Delete' },
    ];
    let org_admin_opts = [
      { id: 1, title: 'View' },
      { id: 2, title: 'Edit' },
      { id: 3, title: 'Delete' },
    ];
    let user_opts = [{ id: 1, title: 'View' }];
    if (
      user?.user_type === AppRoles.SUPER_ADMIN ||
      user?.user_type === AppRoles.ORGANIZATION
    )
      return admin_opts;
    else if (user?.user_type === AppRoles.USER) return user_opts;
    else if (user?.user_type === AppRoles.ORGANIZATION_ADMIN)
      return org_admin_opts;
  };

  const onHandle = (item: any, user: any) => {
    if (item.title.toLowerCase() === 'view') {
      navigate(`/user/${user?._id}`);
    } else if (item.title.toLowerCase() === 'edit') {
      setPayload(user);
      setReasonModalOpen(user);
    } else if (item.title.toLowerCase() === 'delete') {
      let confirm = window.confirm(
        'Are you sure you want to delete this user?'
      );
      if (confirm) onRemoveUser(user?._id);
    }
  };

  const onGettingUsers = async (page: number, search = '') => {
    try {
      let options: any = getRoleBasedActions();
      let { status, data } = await getAllContacts(
        { page, search, organization: user?.name || user?.organization },
        authToken
      );
      if (status === 200) {
        let dtrows = data?.data?.results.map((item: any) => {
          item.attachments = item.attachments;
          item.has_attachments = item.attachments.length ? 'Yes' : 'No';
          item.action = (
            <Dropdown
              options={options}
              onClick={(i: any) => onHandle(i, item)}
              icon={<BsThreeDotsVertical className="h-6 w-6 cursor-pointer" />}
            />
          );
          return item;
        });
        setRows(dtrows);
        setPagination(data?.data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message, toastUtil);
    } finally {
    }
  };

  const onRemoveUser = async (id: string) => {
    try {
      setLoading(true);
      let { status, data } = await removeContact(id, authToken);
      if (status === 204) {
        toast.success('Contact deleted successfully', toastUtil);
        onGettingUsers(1, '');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message, toastUtil);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateContact = async (id: string, payload: any) => {
    try {
      setLoading(true);
      let { status, data } = await updateContact(payload, id, authToken);
      if (status === 200) {
        toast.success('User updated successfully', toastUtil);
        onGettingUsers(1, '');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message, toastUtil);
    } finally {
      setLoading(false);
    }
  };

  const updateUserPayload = async () => {
    try {
      let error: string[] = [];
      if (!payload.fullname) error.push('Please enter the Full Name');
      if (!payload.email) error.push('Please enter the Email');
      if (!payload.phone) error.push('Please enter the Phone');
      if (!payload.address) error.push('Please enter the Address');
      if (!payload.state) error.push('Please enter the State or Province');
      if (!payload.description) error.push('Please enter the Description');
      if (!attachments.length) error.push('Please enter all attachments');
      setLoading(true);
      let form = new FormData();
      form.append('fullname', payload.fullname);
      form.append('email', payload.email);
      form.append('phone', payload.phone);
      form.append('address', payload.address);
      form.append('state', payload.state);
      form.append('description', payload.description);
      form.append('is_active', payload.is_active ? 'true' : 'false');
      form.append('added_by', payload.added_by);
      form.append('organization', payload.organization);
      form.append('country', payload.country);

      attachments.forEach((at: any) => form.append('files', at.file));
      let { status } = await updateContact(form, payload?._id, authToken);
      if (status === 200) {
        toast.success('User updated successfully!', toastUtil);
        setModalOpen(false);
        setLoop([0]);
        onGettingUsers(1, '');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message, toastUtil);
    } finally {
      setAttachments([]);
      setPayload({
        fullname: '',
        email: '',
        phone: '',
        address: '',
        state: '',
        country: '',
        description: '',
        is_active: true,
        organization: user?.name || user?.organization,
        added_by: user?.email,
      });
      setLoading(false);
    }
  };

  const submitUser = async () => {
    try {
      let error: string[] = [];
      if (!payload.fullname) error.push('Please enter the Full Name');
      if (!payload.email) error.push('Please enter the Email');
      if (!payload.phone) error.push('Please enter the Phonr');
      if (!payload.address) error.push('Please enter the Address');
      if (!payload.state) error.push('Please enter the State or Province');
      if (!payload.description) error.push('Please enter the Description');
      setLoading(true);
      let fd = new FormData();
      fd.append('fullname', payload.fullname);
      fd.append('email', payload.email);
      fd.append('phone', payload.phone);
      fd.append('address', payload.address);
      fd.append('state', payload.state);
      fd.append('description', payload.description);
      fd.append('is_active', payload.is_active ? 'true' : 'false');
      fd.append('added_by', payload.added_by);
      fd.append('country', payload.country);
      fd.append('organization', payload.organization);

      attachments.forEach((at: any) => fd.append('files', at.file));
      let { status } = await addContact(fd, authToken);
      if (status === 201) {
        toast.success('Contact added successfully!', toastUtil);
        setModalOpen(false);
        setLoop([0]);
        onGettingUsers(1, '');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message, toastUtil);
    } finally {
      setAttachments([]);
      setPayload({
        fullname: '',
        email: '',
        phone: '',
        country: '',
        address: '',
        state: '',
        description: '',
        organization: user?.name || user?.organization,
        is_active: true,
        added_by: user?.email,
      });
      setLoading(false);
    }
  };

  const onSetAttahments = (file: File, id: string) => {
    setAttachments((prev: any) => {
      return [...prev, { id, file }];
    });
  };

  const onRemoveAttahments = (id: string) => {
    let _attachments = attachments.filter((at: any) => at.id !== id);
    setAttachments(_attachments);
  };

  const onPostReason = async () => {
    try {
      if (!reason)
        return toast.warning('Please state the reason for visit', toastUtil);
      setLoading(true);
      let payl = {
        reason,
        visit_by: user.email,
        is_deleted: false,
        user: isReadonModalOpen?._id,
        added_by: user?.name || user?.organization || '',
      };
      let { status } =
        user?.user_type !== AppRoles.ORGANIZATION
          ? await stateReason(payl, authToken)
          : await stateReasonOrg(payl, authToken);
      if (status === 201) {
        setReasonModalOpen(false);
        toast.success('Reason for visit logged', toastUtil);
        setModalOpen(true);
        setLoop([0]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const addLogo = (idx: number) => {
    return (
      <div className="mt-5">
        <span className="text-cyan-500 font-medium text-sm">
          * Add Attachment
        </span>
        <FileUpload
          id={`elem-${idx}`}
          setFile={(file: File, id: string) => {
            onSetAttahments(file, id);
            setLoop((p) => {
              return [...p, p.length];
            });
          }}
          onRemoveAttahments={onRemoveAttahments}
        />
      </div>
    );
  };

  const removeFile = async (file: string) => {
    try {
      setLoading(true);
      let { data, status } = await removeAFile({ file }, authToken);
      if (status === 204) {
        toast.success('File Deleted Successfully', toastUtil);
        let attachments = payload.attachments.filter((a: any) => a !== file);
        setPayload((prev: any) => {
          return { ...prev, attachments };
        });
        onUpdateContact(payload._id, { attachments });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getSelected = async (item: any) => {
    onGettingUsers(1, item.value);
  };

  const onSearch = (str: string) => {
    onGettingUsers(1, str);
  };

  return (
    <main className="h-full w-full inline-flex ">
      <section className="w-[280px] h-full">
        <Sidebar />
      </section>
      {loading ? (
        <Loader />
      ) : (
        <React.Fragment>
          <section className="w-board h-full">
            <Header />

            <aside className="inline-flex w-full align-center justify-between p-4">
              <h2 className="text-2xl font-bold">Contacts</h2>
              <Button
                onClick={() => {
                  setPayload({
                    fullname: '',
                    email: '',
                    phone: '',
                    address: '',
                    state: '',
                    description: '',
                    organization: user?.name || user?.organization,
                    is_active: true,
                    added_by: user?.email,
                  });
                  setModalOpen(true);
                  setLoop([0]);
                }}
              >
                Add a Contact
              </Button>
            </aside>
            <aside className="p-4 inline-flex items-end gap-5">
              <div className="w-[180px]">
                <label className="text-cyan-800 text-sm">Select Country</label>
                <Selector
                  options={countries_all}
                  onChange={(item: any) => getSelected(item)}
                />
              </div>

              <div>
                <SearchBar onSearch={onSearch} />
              </div>
            </aside>

            <aside className="p-4 h-full">
              <Table
                rows={rows}
                totalPages={pagination?.totalPages}
                columns={columns}
                onHandlePage={(page: number) => getAlUsers(page, '')}
              />
            </aside>
          </section>

          <Modal show={isModalOpen}>
            <div
              className="rounded-md h-8 w-8 inline-grid place-items-center cursor-pointer absolute w-full h-full"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.078' }}
            >
              <div className="relative p-4 rounded-md shadow-cs-1 flex flex-col items-center bg-white outline-none max-h-[90%] w-[400px] overflox-x-hidden overflow-y-auto focus:outline-none screen800:px-3">
                <small
                  className="absolute right-2 top-2 cursor-pointer"
                  onClick={() => {
                    setModalOpen(false);
                    setLoop([0]);
                  }}
                >
                  <MdOutlineCancel className="w-5 h-5" />
                </small>
                <h3 className="text-primary font-medium text-xl">
                  {payload._id
                    ? 'Update Contact Details'
                    : 'Add Contact Details'}
                </h3>
                <form className="flex items-center flex-col rounded-lg shadow-1 bg-white p-4 w-[350px] min-h-[490px]">
                  <div className="mb-8 relative w-full">
                    <label
                      className="block text-neutral-700 text-sm font-medium"
                      htmlFor="fullname"
                    >
                      Full Name <span>*</span>
                    </label>
                    <input
                      id="fullname"
                      value={payload?.fullname}
                      onChange={(e) =>
                        setPayload((prev: any) => {
                          return { ...prev, fullname: e.target.value };
                        })
                      }
                      placeholder=""
                      className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                    />
                  </div>

                  <div className="mb-8 relative w-full">
                    <label
                      className="block text-neutral-700 text-sm font-medium"
                      htmlFor="address"
                    >
                      Address <span>*</span>
                    </label>
                    <input
                      id="address"
                      value={payload?.address}
                      onChange={(e) =>
                        setPayload((prev: any) => {
                          return { ...prev, address: e.target.value };
                        })
                      }
                      placeholder=""
                      className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                    />
                  </div>
                  <div className="mb-8 relative w-full">
                    <label
                      className="block text-neutral-700 text-sm font-medium"
                      htmlFor="state"
                    >
                      State/Province <span>*</span>
                    </label>
                    <input
                      id="state"
                      value={payload?.state}
                      onChange={(e) =>
                        setPayload((prev: any) => {
                          return { ...prev, state: e.target.value };
                        })
                      }
                      placeholder=""
                      className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                    />
                  </div>

                  <div className="mb-8 relative w-full">
                    <label
                      className="block text-neutral-700 text-sm font-medium"
                      htmlFor="country"
                    >
                      Country <b>{payload.country}</b> <span>*</span>
                    </label>
                    <Selector
                      options={countries}
                      value={payload.country}
                      defaultValue={{
                        label: payload.country,
                        value: payload.country,
                      }}
                      onChange={(e: any) =>
                        setPayload((prev: any) => {
                          return { ...prev, country: e.value };
                        })
                      }
                    />
                  </div>

                  <div className="mb-8 relative w-full">
                    <label
                      className="block text-neutral-700 text-sm font-medium"
                      htmlFor="ph"
                    >
                      Phone <span>*</span>
                    </label>
                    <input
                      id="ph"
                      value={payload?.phone}
                      onChange={(e) =>
                        setPayload((prev: any) => {
                          return { ...prev, phone: e.target.value };
                        })
                      }
                      placeholder=""
                      className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                    />
                  </div>

                  <div className="mb-8 relative w-full">
                    <label
                      className="block text-neutral-700 text-sm font-medium"
                      htmlFor="email"
                    >
                      Email <span>*</span>
                    </label>
                    <input
                      id="email"
                      value={payload?.email}
                      onChange={(e) =>
                        setPayload((prev: any) => {
                          return { ...prev, email: e.target.value };
                        })
                      }
                      placeholder=""
                      className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                      type="email"
                    />
                  </div>
                  <div className="mb-8 relative w-full">
                    <label
                      className="block text-neutral-700 text-sm font-medium"
                      htmlFor="description"
                    >
                      Contact Description <span>*</span>
                    </label>
                    {/* <input
                      id="description"
                      value={payload?.description}
                      onChange={(e) =>
                        setPayload((prev: any) => {
                          return { ...prev, description: e.target.value };
                        })
                      }
                      placeholder="Enter contact description"
                      className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                    /> */}

                    <textarea
                      id="description"
                      value={payload?.description}
                      onChange={(e) =>
                        setPayload((prev: any) => {
                          return { ...prev, description: e.target.value };
                        })
                      }
                      rows={4}
                      className=" h-[84px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder=""
                    />
                  </div>

                  <div className="mb-8 relative w-full">
                    <label
                      className="block text-neutral-700 text-sm font-medium"
                      htmlFor="email"
                    >
                      Attachments
                    </label>
                    <small className="text-neutral-700 text-sm">
                      * Please add all necessary documents
                    </small>

                    {payload?.attachments?.length &&
                      React.Children.toArray(
                        payload?.attachments?.map((i: any) => {
                          return (
                            <div className="relative">
                              <MdOutlineCancel
                                className="w-5 h-5 absolute left-2 top-1 text-white"
                                style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}
                                onClick={() => removeFile(i)}
                              />
                              <img
                                src={i}
                                className="max-w-[150px] max-h-[150px] m-2"
                                onClick={() => handleImageClick(i)}
                              />
                            </div>
                          );
                        })
                      )}
                    <section className="mt-4">
                      {React.Children.toArray(loop.map((i) => addLogo(i)))}
                    </section>
                  </div>

                  {!payload._id ? (
                    <Button
                      className="h-[38px] w-[140px] mt-10"
                      disabled={loading}
                      htmlType="button"
                      loading={loading}
                      onClick={submitUser}
                    >
                      Add
                    </Button>
                  ) : (
                    <Button
                      className="h-[38px] w-[140px] mt-10"
                      disabled={loading}
                      htmlType="button"
                      loading={loading}
                      onClick={updateUserPayload}
                    >
                      Update
                    </Button>
                  )}
                </form>
              </div>
            </div>
          </Modal>
          <Modal show={isReadonModalOpen ? true : false}>
            <div
              className="rounded-md h-8 w-8 inline-grid place-items-center cursor-pointer absolute w-full h-full"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.078' }}
            >
              <div className="p-8 rounded-md shadow-cs-1 flex flex-col items-center w-full bg-white outline-none focus:outline-none screen800:px-3">
                <div className="mb-8 relative w-[300px]">
                  <label
                    className="block text-neutral-700 text-lg font-bold"
                    htmlFor="org"
                  >
                    Why are you updating this profile?
                  </label>
                  <textarea
                    id="org"
                    value={payload?.reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter your reason here"
                    className=" h-[150px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 mt-2 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                  ></textarea>
                </div>
                <Button onClick={onPostReason}>Submit</Button>
              </div>
            </div>
          </Modal>
        </React.Fragment>
      )}

      {showViewer && (
        <ImageViewer imageUrl={selectedImage} onClose={handleCloseViewer} />
      )}
    </main>
  );
};
export default Contacts;
