import React, { useState } from 'react';
import UseAxios from '../../../Hooks/UseAxios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import Swal from 'sweetalert2';
import UseAuth from '../../../Hooks/UseAuth';
import { FaSearch } from 'react-icons/fa';
import LoadingCard from '../../Shared/LoadingCard';

const MakeAdmin = () => {
  const axiosSecure = UseAxios();
  const queryClient = useQueryClient();
  const { user: currentUser } = UseAuth();
  const [searchText, setSearchText] = useState('');

  // Fetch all users
  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
  });

  // Update role
  const { mutateAsync: updateRole, isLoading: isUpdating } = useMutation({
    mutationFn: async ({ id, role }) => {
      return await axiosSecure.patch(`/users/${id}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
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
      return (
        u.name?.toLowerCase().includes(txt) ||
        u.email?.toLowerCase().includes(txt)
      );
    });

  if (isLoading) {
    return <LoadingCard></LoadingCard>
  }

  if (isError) {
    return (
      <p className="text-center mt-10 text-red-600 text-lg">{error.message}</p>
    );
  }

  return (
    <section className="w-full mx-auto p-8 ">
      <h1 className="text-3xl font-bold mb-8 text-center text-red-600 drop-shadow">
        Admin Panel – Promote / Remove Admin
      </h1>

      {/* Search */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-xl">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="w-full pl-12 pr-5 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
          />
        </div>
      </div>


      {/* Table */}
      <div className="overflow-x-auto bborder border-gray-200  rounded-xs shadow-sm">
        <table className="min-w-full text-sm text-left divide-y divide-gray-200  overflow-hidden">
          <thead className="bg-red-100 text-red-700 text-sm font-semibold uppercase">
            <tr>
              <th className="px-4 py-3">Photo</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => {
                const isAdmin = user.role.toLowerCase() === 'admin';
                const roleLabel =
                  user.role.charAt(0).toUpperCase() + user.role.slice(1);

                return (
                  <tr key={user._id} className="hover:bg-red-50">
                    <td className="px-4 py-3">
                      <img
                        src={user.photo || 'https://via.placeholder.com/40'}
                        alt={user.name || 'User'}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    </td>
                    <td className="px-6 py-3 font-medium">{user.name || 'N/A'}</td>
                    <td className="px-6 py-3">{user.email || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className="badge badge-outline badge-secondary">
                        {roleLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.registeredAt
                        ? moment(user.registeredAt).format('MMM D, YYYY')
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {user.isVerified ? (
                        <button
                          onClick={() =>
                            handleRoleChange(user._id, user.role, user.name, user.email)
                          }
                          className={`px-4 py-2 rounded-md transition disabled:opacity-50 ${isAdmin
                              ? 'bg-gray-500 hover:bg-gray-600 text-white'
                              : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
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
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No eligible HR or Admin users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MakeAdmin;
