import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEdit, FaPaperPlane, FaTrash } from 'react-icons/fa';
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

  const {
    data: works = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['works', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/works?email=${user.email}`);
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
      name: user.displayName || user.email.split('@')[0],
    };

    axiosSecure
      .post('/work', newEntry)
      .then(() => {
        refetch();
        setTask('Sales');
        setHours(1);
        setDate(new Date());
        Swal.fire('Success!', 'New work entry added.', 'success');
      })
      .catch(() => {
        Swal.fire('Error', 'Failed to add entry', 'error');
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // red-500
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/works/${id}`)
          .then(() => {
            refetch();
            Swal.fire('Deleted!', 'The work has been deleted.', 'success');
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete entry', 'error');
          });
      }
    });
  };

  const handleUpdate = () => {
    const { _id, ...updatedFields } = editData;

    axiosSecure
      .put(`/works/${_id}`, updatedFields)
      .then(() => {
        refetch();
        setEditData(null);
        Swal.fire('Updated!', 'The work entry was updated.', 'success');
      })
      .catch(() => {
        Swal.fire('Error', 'Failed to update entry', 'error');
      });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 mx-auto ">
      {/* Form */}
     <form
  onSubmit={handleSubmit}
  className="
    flex flex-wrap gap-4 items-end bg-base-200 p-4 
    flex-col
    md:flex-row md:items-end md:flex-wrap
  "
>
  <div className="form-control w-full md:w-auto flex-grow md:flex-grow-0">
    <label className="label font-semibold">Task</label>
    <select
      value={task}
      onChange={(e) => setTask(e.target.value)}
      className="select select-bordered w-full"
    >
      <option>Sales</option>
      <option>Support</option>
      <option>Content</option>
      <option>Paper-work</option>
      <option>Design</option>
      <option>Development</option>
    </select>
  </div>

  <div className="form-control w-full md:w-auto flex-grow md:flex-grow-0">
    <label className="label font-semibold">Hours Worked</label>
    <input
      type="number"
      value={hours}
      onChange={(e) => setHours(e.target.value)}
      className="input input-bordered w-full"
      min="0"
    />
  </div>

  <div className="form-control w-full md:w-auto flex-grow md:flex-grow-0">
    <label className="label font-semibold">Date</label> <br />
    <DatePicker
      selected={date}
      onChange={(date) => setDate(date)}
      className="input input-bordered w-full"
      dateFormat="yyyy-MM-dd"
    />
  </div>

  <div className="form-control w-full md:w-auto mt-4 md:mt-0 flex justify-end">
    <button
      type="submit"
      className="btn bg-red-500 gap-2 w-full md:w-auto"
    >
      <FaPaperPlane /> Submit
    </button>
  </div>
</form>


      {/* Table */}
      <div className="overflow-x-auto mt-6 bg-base-100 rounded-lg">
        <table className="table table-zebra w-full text-sm">
          <thead>
            <tr className="bg-base-200 text-md font-semibold text-center">
              <th>Task</th>
              <th>Hours</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {works.map((w) => (
              <tr key={w._id}>
                <td>{w.task}</td>
                <td>{w.hours}</td>
                <td>{w.date}</td>
                <td className="flex justify-center gap-2">
                  <button
                    onClick={() => setEditData(w)}
                    className="btn btn-sm bg-yellow-400 hover:bg-yellow-500 text-white tooltip"
                    data-tip="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(w._id)}
                    className="btn btn-sm bg-red-500 hover:bg-red-600 text-white tooltip"
                    data-tip="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
  {editData && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50 p-4">
    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Edit Work Entry</h3>

      <div className="form-control mb-4">
        <label className="label font-semibold mb-1">Task</label>
        <select
          value={editData.task}
          onChange={(e) =>
            setEditData({ ...editData, task: e.target.value })
          }
          className="select select-bordered w-full"
        >
          <option>Sales</option>
          <option>Support</option>
          <option>Content</option>
          <option>Paper-work</option>
          <option>Design</option>
          <option>Development</option>
        </select>
      </div>

      <div className="form-control mb-4">
        <label className="label font-semibold mb-1">Hours</label>
        <input
          type="number"
          value={editData.hours}
          onChange={(e) =>
            setEditData({ ...editData, hours: e.target.value })
          }
          className="input input-bordered w-full"
          min="0"
        />
      </div>

      <div className="form-control mb-6">
        <label className="label font-semibold mb-1">Date</label> <br />
        <DatePicker
          selected={new Date(editData.date)}
          onChange={(date) =>
            setEditData({
              ...editData,
              date: date.toISOString().split('T')[0],
            })
          }
          className="input input-bordered w-full"
          dateFormat="yyyy-MM-dd"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          className="btn"
          onClick={() => setEditData(null)}
        >
          Cancel
        </button>
        <button
          className="btn bg-red-500 hover:bg-red-600 text-white"
          onClick={handleUpdate}
        >
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
