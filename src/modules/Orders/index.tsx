import React, { useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { toastUtil } from '../../utils/toast-utils';
import { MdOutlineCancel } from 'react-icons/md';
import { AppRoles } from '../../enums/roles';
import Button from '../../shared/Button';
import Dropdown from '../../shared/Dropdown';
import Header from '../../shared/Header';
import Sidebar from '../../shared/Sidebar';
import Table from '../../shared/Table';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RootState } from '../../redux-toolkit/store/store';
import {
  addOrder,
  getAllOrders,
  removeOrder,
  resolveOrder,
} from '../../apis/orders.apis';
import Modal from '../../shared/Modal';
import Selector from '../../shared/Selector';
import { getAlOrganizations } from '../../apis/organizations.api';
import { getAllCustomers } from '../../apis/customers.api';
import SearchBar from '../../shared/Searchbar/search';

const Orders = ({}: any) => {
  const authToken: any = useSelector((state: RootState) => state.auth.value);
  const user: any = useSelector((state: RootState) => state.user.value);
  const [payload, setPayload]: any = useState({
    reason: '',
    raised_by: user?.email,
    associated_to: '',
    description: '',
    status: 'Incomplete',
    organization: user?.name || user?.organization,
    is_deleted: false,
  });
  const [rows, setRows]: any = useState();
  const [options, setOptions] = useState(
    user?.user_type === AppRoles.ORGANIZATION_ADMIN ||
      user?.user_type === AppRoles.ADMIN
      ? [{ id: 1, title: 'Resolve' }]
      : [
          { id: 1, title: 'Delete' },
          { id: 2, title: 'Resolve' },
        ]
  );
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination]: any = useState();
  const [organizations, setOrganizations] = useState({ all: [], names: [] });
  const [customers, setCustomers] = useState({ all: [], names: [] });
  const [isModalOpen, setModalOpen] = useState(false);

  const columns: any = [
    // { key: "id", label: "ID" },
    { key: 'reason', label: 'Reason' },
    { key: 'description', label: 'Description' },
    { key: 'associated_to', label: 'Order For' },
    { key: 'createdAt', label: 'Create Time' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Actions' },
  ];

  useLayoutEffect(() => {
    setPayload((prev: any) => {
      return { ...prev, organization: user?.name || user?.organization };
    });
    onGettingOrganizations();

    onGettingorders(1, '');
  }, []);

  const onGettingOrganizations = async () => {
    try {
      setLoading(true);
      let { status, data } = await getAlOrganizations(
        { island: '' },
        authToken
      );
      console.log('data?.data?.results', data);
      if (status === 200) {
        let orgs = data?.data?.results?.map((org: any) => {
          return { label: org?.name, value: org?.name };
        });
        setOrganizations({ names: orgs, all: data?.data?.results });
      }

      let customers = await getAllCustomers(
        { organization: user?.name || user?.organization },
        authToken
      );
      console.log('customers', customers);

      let allCuses: any[] = [];
      if (user?.user_type !== AppRoles.SUPER_ADMIN)
        allCuses = customers?.data?.data?.results.map(
          (cus: any) => cus?.added_by === user?.email
        );
      else allCuses = customers?.data?.data?.results.map((cus: any) => cus);
      if (customers?.status === 200) {
        let orgs = customers?.data?.data?.results?.map((user: any) => {
          return { label: user?.fullname, value: user?.email };
        });
        setCustomers({ names: orgs, all: customers?.data?.data?.results });
      }
    } catch (error: any) {
      console.log(error);

      toast.error(error?.response?.data?.message, toastUtil);
    } finally {
      console.log(258);
      setModalOpen(false);
      setLoading(false);
    }
  };

  const onHandle = (item: any, id: string) => {
    if (item.title === 'Resolved' || item.title === 'Resolve') {
      let confirm = window.confirm(
        'Are you sure you want to resolve this order?'
      );
      if (confirm) onUpdateOrder(id, { status: 'Resolved' });
    } else if (item.title.toLowerCase() === 'delete') {
      let confirm = window.confirm(
        'Are you sure you want to remove this order?'
      );
      if (confirm) onRemoveOrder(id);
    }
  };

  const onGettingorders = async (page: number, search = '') => {
    try {
      setLoading(true);
      let { status, data } = await getAllOrders(user?.user_type, {
        page,
        search,
        id: user?._id,
        user_type: user?.user_type,
        organization: user?.name || user?.organization,
      });
      if (status === 200) {
        let dtrows = data?.data?.results.map((item: any) => {
          item.associated_to = item?.associated_to?.fullname || 'NA';
          item.action = (
            <Dropdown
              options={options}
              onClick={(i: any) => onHandle(i, item?._id)}
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
      setModalOpen(false);
      setLoading(false);
    }
  };

  const onRemoveOrder = async (id: string) => {
    try {
      setLoading(true);
      let { status, data } = await removeOrder(id);
      if (status === 204) {
        toast.success('Order deleted successfully', toastUtil);
        onGettingorders(1, '');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message, toastUtil);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateOrder = async (id: string, payload: any) => {
    try {
      setLoading(true);
      let { status, data } = await resolveOrder(id, payload);
      if (status === 200) {
        toast.success('Order updated successfully', toastUtil);
        onGettingorders(1, '');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message, toastUtil);
    } finally {
      setLoading(false);
    }
  };

  const submitOrder = async () => {
    try {
      setLoading(true);
      let _payload;
      let as_to: any = customers.all.find(
        (asc: any) => asc.email === payload?.associated_to?.value
      );
      _payload = {
        ...payload,
        associated_to: as_to?._id,
        organization: user?.name || user?.organization,
      };
      let { status, data } = await addOrder(_payload);
      if (status === 201) {
        toast.success('Order created successfully!', toastUtil);
        setPayload({
          reason: '',
          raised_by: user?.email,
          associated_to: '',
          description: '',
          status: 'Incomplete',
          organization: user?.name || user?.organization,
          is_deleted: false,
        });
        setModalOpen(false);
        onGettingorders(1, '');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message, toastUtil);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (str: string) => {
    onGettingorders(1, str);
  };

  return (
    <main className="h-full w-full inline-flex ">
      <section className="w-[280px] h-full">
        <Sidebar />
      </section>
      <section className="w-board h-full">
        <Header />
        <aside className="p-4 inline-flex items-end gap-5">
          <div>
            <SearchBar onSearch={onSearch} />
          </div>
        </aside>
        <aside className="inline-flex w-full align-center justify-between p-4">
          {user?.user_type === AppRoles.SUPER_ADMIN ||
          user?.user_type === AppRoles.ORGANIZATION ? (
            <React.Fragment>
              <h2 className="text-2xl font-bold">Orders</h2>
              <Button onClick={() => setModalOpen(true)}>
                Create new order
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <h2 className="text-2xl font-bold">My orders</h2>
              <Button onClick={() => setModalOpen(true)}>Create Order</Button>
            </React.Fragment>
          )}
        </aside>

        <aside className="p-4">
          <Table
            rows={rows}
            totalPages={pagination?.totalPages}
            columns={columns}
            onHandlePage={(page: number) => onGettingorders(page, '')}
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
              onClick={() => setModalOpen(false)}
            >
              <MdOutlineCancel className="w-5 h-5" />
            </small>
            <h3 className="text-primary font-medium text-xl">
              Add Order Details
            </h3>
            <form className="flex items-center flex-col rounded-lg shadow-1 bg-white p-4 w-[350px] min-h-[490px]">
              <div className="mb-8 relative w-full">
                <label
                  className="block text-neutral-700 text-sm font-medium"
                  htmlFor="reason"
                >
                  Order Title
                </label>
                <input
                  id="fullname"
                  value={payload?.reason}
                  onChange={(e) =>
                    setPayload((prev: any) => {
                      return { ...prev, reason: e.target.value };
                    })
                  }
                  placeholder="State reason"
                  className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                />
              </div>

              <div className="mb-8 relative w-full">
                <label
                  className="block text-neutral-700 text-sm font-medium"
                  htmlFor="description"
                >
                  Order Details
                </label>
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
                  placeholder="Enter details for order"
                />
              </div>

              <div className="mb-8 relative w-full">
                <label
                  className="block text-neutral-700 text-sm font-medium"
                  htmlFor="t_for"
                >
                  Order For
                </label>
                <Selector
                  options={customers?.names}
                  defaultValue={payload?.associated_to}
                  onChange={(item: any) => {
                    setPayload((prev: any) => {
                      return { ...prev, associated_to: item };
                    });
                  }}
                />
              </div>

              {user?.user_type === AppRoles.SUPER_ADMIN && (
                <div className="mb-8 relative w-full">
                  <label
                    className="block text-neutral-700 text-sm font-medium"
                    htmlFor="org"
                  >
                    Organization
                  </label>
                  <Selector
                    options={organizations?.names}
                    defaultValue={payload?.organization}
                    onChange={(item: any) => {
                      setPayload((prev: any) => {
                        return { ...prev, organization: item };
                      });
                    }}
                  />
                </div>
              )}

              <Button
                className="h-[38px] w-[140px] mt-10"
                disabled={loading}
                htmlType="submit"
                loading={loading}
                onClick={submitOrder}
              >
                Add
              </Button>
            </form>
          </div>
        </div>
      </Modal>
    </main>
  );
};
export default Orders;
