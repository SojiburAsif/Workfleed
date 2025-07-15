import React, { useState } from 'react';
import UseAxios from '../../../Hooks/UseAxios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import Swal from 'sweetalert2';

const MakeAdmin = () => {
  const axiosSecure = UseAxios();
  const queryClient = useQueryClient();
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
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });

  // Role change with Swal confirmation
  const handleRoleChange = async (id, currentRole, name) => {
    let newRole = '';
    if (currentRole.toLowerCase() === 'admin') {
      newRole = 'HR';
    } else if (currentRole.toLowerCase() === 'hr') {
      newRole = 'admin';
    } else {
      return;
    }

    const actionText =
      newRole === 'admin' ? 'promote to Admin' : 'demote to HR';

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
        Swal.fire(
          'Success!',
          `${name} has been ${actionText}.`,
          'success'
        );
      } catch (err) {
        console.log(err);
        Swal.fire(
          'Error!',
          'Failed to update role. Please try again.',
          'error'
        );
      }
    }
  };

  const filteredUsers = users
    .filter(user => ['admin', 'hr'].includes(user.role?.toLowerCase()))
    .filter(user => !user.fired)
    .filter(user => {
      const text = searchText.toLowerCase();
      return (
        user.name?.toLowerCase().includes(text) ||
        user.email?.toLowerCase().includes(text)
      );
    });

  if (isLoading)
    return <p className="text-center mt-10 text-lg text-blue-500">Loading users...</p>;

  if (isError)
    return <p className="text-center mt-10 text-red-500 text-lg">{error.message}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Admin Panel – Promote / Remove Admin
      </h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="🔍 Search by name or email"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 border-b">Photo</th>
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">Email</th>
              <th className="px-4 py-3 border-b">Role</th>
              <th className="px-4 py-3 border-b">Joined</th>
              <th className="px-6 py-3 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-3 border-b">
                    <img
                      src={user.photo || 'https://via.placeholder.com/40'}
                      alt={user.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  </td>
                  <td className="px-6 py-4 border-b font-semibold">{user.name || 'N/A'}</td>
                  <td className="px-6 py-4 border-b">{user.email || 'N/A'}</td>
                  <td className="px-4 py-4 border-b font-bold uppercase">{user.role}</td>
                  <td className="px-4 py-4 border-b">
                    {user.registeredAt
                      ? moment(user.registeredAt).format('MMM D, YYYY')
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    {user.isVerified ? (
                      <button
                        onClick={() => handleRoleChange(user._id, user.role, user.name)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                        disabled={isUpdating}
                      >
                        {user.role.toLowerCase() === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">Not Verified</span>
                    )}
                  </td>
                </tr>
              ))
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
    </div>
  );
};

export default MakeAdmin;
