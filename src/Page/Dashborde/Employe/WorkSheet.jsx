import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import UseAxios from '../../../Hooks/UseAxios';
import UseAuth from '../../../Hooks/UseAuth';
import Loading from '../../Shared/Loading';

const WorkSheet = () => {
  const [task, setTask] = useState('Sales');
  const [hours, setHours] = useState(1);
  const [date, setDate] = useState(new Date());
  const [editData, setEditData] = useState(null);
  const { user } = UseAuth();
  const axiosSecure = UseAxios();

  // ✅ useQuery for fetching work entries
  const {
    data: works = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['works', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/works?email=${user.email}`,);
      return res.data;
    },
  });

 const handleSubmit = (e) => {
  e.preventDefault();

  if (!user?.email) {
    Swal.fire('Error', 'User email not found. Please login again.', 'error');
    return;
  }

  const newEntry = {
    task,
    hours,
    date: date.toISOString().split('T')[0],
    userEmail: user.email,
    name: user.displayName || user.email.split('@')[0], // ✅ নাম যুক্ত করা হলো
  };

  axiosSecure.post('/work', newEntry)
    .then(res => {
      console.log(res);
      refetch();
      setTask('Sales');
      setHours(1);
      setDate(new Date());
      Swal.fire('Success!', 'New work entry added.', 'success');
    })
    .catch(error => {
      console.error("Failed to save:", error);
      Swal.fire('Error', 'Failed to add entry', 'error');
    });
};


  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/works/${id}`)
          .then(() => {
            refetch(); // ✅ refresh data
            Swal.fire('Deleted!', 'The work has been deleted.', 'success');
          })
          .catch(error => {
            console.error("Delete failed:", error);
            Swal.fire('Error', 'Failed to delete entry', 'error');
          });
      }
    });
  };

  const handleUpdate = () => {
    const { _id, ...updatedFields } = editData;

    axiosSecure.put(`/works/${_id}`, updatedFields)
      .then(() => {
        refetch(); // ✅ refresh data
        setEditData(null);
        Swal.fire('Updated!', 'The work entry was updated.', 'success');
      })
      .catch(error => {
        console.error("Update failed:", error);
        Swal.fire('Error', 'Failed to update entry', 'error');
      });
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-4 items-end bg-base-200 p-4 rounded shadow"
      >
        <div>
          <label className="block mb-1">Task</label>
          <select
            value={task}
            onChange={e => setTask(e.target.value)}
            className="select select-bordered"
          >
            <option>Sales</option>
            <option>Support</option>
            <option>Content</option>
            <option>Paper-work</option>
            <option>Design</option>
            <option>Development</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Hours Worked</label>
          <input
            type="number"
            value={hours}
            onChange={e => setHours(e.target.value)}
            className="input input-bordered"
            min="0"
          />
        </div>

        <div>
          <label className="block mb-1">Date</label>
          <DatePicker
            selected={date}
            onChange={date => setDate(date)}
            className="input input-bordered"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Add / Submit
        </button>
      </form>

      <div className="overflow-x-auto mt-6">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Task</th>
              <th>Hours</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {works.map(w => (
              <tr key={w._id}>
                <td>{w.task}</td>
                <td>{w.hours}</td>
                <td>{w.date}</td>
                <td className="flex gap-2">
                  <button className="btn btn-xs" onClick={() => setEditData(w)}>
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => handleDelete(w._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editData && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
          <div className="bg-white p-6 rounded w-96 shadow">
            <h3 className="text-xl mb-4 font-bold">Edit Entry</h3>
            <label className="block mb-2">Task</label>
            <select
              value={editData.task}
              onChange={e =>
                setEditData({ ...editData, task: e.target.value })
              }
              className="select select-bordered w-full mb-3"
            >
              <option>Sales</option>
              <option>Support</option>
              <option>Content</option>
              <option>Paper-work</option>
              <option>Design</option>
              <option>Development</option>
            </select>

            <label className="block mb-2">Hours</label>
            <input
              type="number"
              value={editData.hours}
              onChange={e =>
                setEditData({ ...editData, hours: e.target.value })
              }
              className="input input-bordered w-full mb-3"
              min="0"
            />

            <label className="block mb-2">Date</label>
            <DatePicker
              selected={new Date(editData.date)}
              onChange={date =>
                setEditData({
                  ...editData,
                  date: date.toISOString().split('T')[0],
                })
              }
              className="input input-bordered w-full mb-3"
              dateFormat="yyyy-MM-dd"
            />

            <div className="flex justify-end gap-2">
              <button className="btn" onClick={() => setEditData(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdate}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkSheet;
