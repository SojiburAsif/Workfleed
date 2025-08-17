import React, { useState, useContext } from 'react';
import UseAxios from '../../../Hooks/UseAxios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import Swal from 'sweetalert2';
import UseAuth from '../../../Hooks/UseAuth';
import { FaSearch, FaUserShield } from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';
import LoadingCard from '../../Shared/LoadingCard';
import { ThemeContext } from '../../../Theme/ThemeProvider';

const MakeAdmin = () => {
  const axiosSecure = UseAxios();
  const queryClient = useQueryClient();
  const { user: currentUser } = UseAuth();
  const { theme } = useContext(ThemeContext);
  const [searchText, setSearchText] = useState('');

  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
  });

  const { mutateAsync: updateRole, isLoading: isUpdating } = useMutation({
    mutationFn: async ({ id, role }) => {
      return await axiosSecure.patch(`/users/${id}/role`, { role });
    },
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });

  const handleRoleChange = async (id, currentRole, name, email) => {
    if (currentUser?.email === email) {
      return Swal.fire({
        icon: 'warning',
        title: "Action Blocked",
        text: "You can't change your own role!",
      });
    }

    const isAdmin = currentRole.toLowerCase() === 'admin';
    const newRole = isAdmin ? 'HR' : 'admin';
    const actionText = isAdmin ? 'demote to HR' : 'promote to Admin';

    const result = await Swal.fire({
      title: `Are you sure?`,
      html: `You are about to <b>${actionText}</b> for <b>${name}</b>.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Confirm',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await updateRole({ id, role: newRole });
        Swal.fire('Success!', `${name} has been ${actionText}.`, 'success');
      } catch {
        Swal.fire('Error!', 'Failed to update role. Please try again.', 'error');
      }
    }
  };

  const filteredUsers = users
    .filter(u => ['admin', 'hr'].includes(u.role?.toLowerCase()))
    .filter(u => !u.fired)
    .filter(u => {
      const txt = searchText.toLowerCase();
      return u.name?.toLowerCase().includes(txt) || u.email?.toLowerCase().includes(txt);
    });

  if (isLoading) return <LoadingCard />;
  if (isError) return <p className="text-center mt-10 text-red-600 text-lg">{error.message}</p>;

  // Theme Classes
  const bgClass = theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900';
  const inputClass = theme === 'dark'
    ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400 focus:ring-red-500'
    : 'bg-gray-200 text-black border-gray-300 placeholder-gray-500 focus:ring-red-500';
  const tableHeaderClass = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-red-100 text-red-700';
  const tableRowClass = theme === 'dark' ? 'bg-gray-950 text-white hover:bg-gray-900' : 'bg-white text-black hover:bg-red-50';
  const cardClass = theme === 'dark' ? 'bg-gray-950 text-white border-gray-700' : 'bg-white text-black border-gray-200';
  const buttonAdmin = isUpdating ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <section className={`w-full mx-auto p-4 sm:p-8 ${bgClass} min-h-screen`}>
      {/* Title */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <MdAdminPanelSettings className="text-red-600 text-3xl" />
        <h1 className="text-3xl font-bold text-center drop-shadow">
          Admin Panel – Promote / Remove Admin
        </h1>
      </div>

      {/* Search */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-xl">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2
           text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className={`w-full pl-12 pr-5 py-3 text-base rounded-sm focus:outline-none focus:ring-2  ${inputClass}`}
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto  ">
        <table className="min-w-full text-sm text-left border
         border-gray-600 divide-y divide-gray-200">
          <thead className={tableHeaderClass}>
            <tr>
              <th className="px-4 py-3">Photo</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => {
              const isAdmin = user.role.toLowerCase() === 'admin';
              const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);
              return (
                <tr key={user._id} className={`${tableRowClass}`}>
                  <td className="px-4 py-3">
                    <img
                      src={user.photo || 'https://via.placeholder.com/40'}
                      alt={user.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover border border-red-500"
                    />
                  </td>
                  <td className="px-6 py-3 font-medium">{user.name || 'N/A'}</td>
                  <td className="px-6 py-3">{user.email || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className="badge badge-outline badge-error">{roleLabel}</span>
                  </td>
                  <td className="px-4 py-3">
                    {user.registeredAt ? moment(user.registeredAt).format('MMM D, YYYY') : 'N/A'}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {user.isVerified ? (
                      <button
                        onClick={() =>
                          handleRoleChange(user._id, user.role, user.name, user.email)
                        }
                        className={`px-4 py-2 rounded-sm transition ${isAdmin
                          ? 'bg-gray-500 hover:bg-gray-600 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'} ${buttonAdmin}`}
                        disabled={isUpdating}
                      >
                        {isAdmin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">Not Verified</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4 mt-6">
        {filteredUsers.map(user => {
          const isAdmin = user.role.toLowerCase() === 'admin';
          const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);
          return (
            <div key={user._id} className={`p-4 rounded-lg shadow border ${cardClass}`}>
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={user.photo || 'https://via.placeholder.com/40'}
                  alt={user.name || 'User'}
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <div>
                  <h3 className="text-lg font-semibold text-red-600">{user.name || 'N/A'}</h3>
                  <p className="text-sm text-gray-400">{user.email || 'N/A'}</p>
                </div>
              </div>
              <p className="text-sm mb-1">
                <strong>Role:</strong> {roleLabel}
              </p>
              <p className="text-sm mb-2">
                <strong>Joined:</strong> {user.registeredAt ? moment(user.registeredAt).format('MMM D, YYYY') : 'N/A'}
              </p>
              {user.isVerified ? (
                <button
                  onClick={() =>
                    handleRoleChange(user._id, user.role, user.name, user.email)
                  }
                  className={`w-full py-2 mt-2 rounded-md text-white text-sm font-semibold transition ${isAdmin
                    ? 'bg-gray-500 hover:bg-gray-600'
                    : 'bg-red-600 hover:bg-red-700'} ${buttonAdmin}`}
                  disabled={isUpdating}
                >
                  {isAdmin ? 'Remove Admin' : 'Make Admin'}
                </button>
              ) : (
                <p className="text-sm text-gray-400 mt-2">Not Verified</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MakeAdmin;
