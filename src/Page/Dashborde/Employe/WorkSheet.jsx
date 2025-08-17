/* WorkSheet.js */
import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEdit, FaPaperPlane, FaTrash, FaCalendarAlt, FaClock, FaTasks } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import UseAxios from '../../../Hooks/UseAxios';
import UseAuth from '../../../Hooks/UseAuth';
import LoadingCard from '../../Shared/LoadingCard';
import { ThemeContext } from '../../../Theme/ThemeProvider';

const WorkSheet = () => {
  const [task, setTask] = useState('Sales');
  const [hours, setHours] = useState(1);
  const [date, setDate] = useState(new Date());
  const [editData, setEditData] = useState(null);
  const { user } = UseAuth();
  const axiosSecure = UseAxios();
  const { theme } = useContext(ThemeContext);

  const { data: works = [], isLoading, refetch } = useQuery({
    queryKey: ['works', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/works?email=${user.email}`);
      return res.data;
    },
  });

  useEffect(() => { }, [isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user?.email) return Swal.fire('Error', 'User email not found. Please login again.', 'error');

    const newEntry = {
      task,
      hours: Number(hours),
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
      .catch(() => Swal.fire('Error', 'Failed to add entry', 'error'));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/works/${id}`)
          .then(() => {
            refetch();
            Swal.fire('Deleted!', 'The work has been deleted.', 'success');
          })
          .catch(() => Swal.fire('Error', 'Failed to delete entry', 'error'));
      }
    });
  };

  const handleUpdate = () => {
    if (!editData) return;
    const { _id, ...updatedFields } = editData;
    updatedFields.hours = Number(updatedFields.hours);

    axiosSecure
      .put(`/works/${_id}`, updatedFields)
      .then(() => {
        refetch();
        setEditData(null);
        Swal.fire('Updated!', 'The work entry was updated.', 'success');
      })
      .catch(() => Swal.fire('Error', 'Failed to update entry', 'error'));
  };

  if (isLoading) return <LoadingCard />;

  /* THEME CLASSES FIXED FOR LIGHT MODE */
  const sectionBg = theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900';
  const panelBg = theme === 'dark' ? 'bg-gray-950 text-gray-100 border border-gray-800' : 'bg-white text-gray-950 border border-gray-200';
  const inputClass = theme === 'dark'
    ? 'input input-bordered w-full bg-gray-900 text-gray-100 border-gray-700'
    : 'input input-bordered w-full bg-white text-gray-950 border border-gray-300';
  const selectClass = theme === 'dark'
    ? 'select select-bordered w-full bg-gray-900 text-gray-100 border-gray-700'
    : 'select select-bordered w-full bg-white text-gray-950 border border-gray-300';
  const btnPrimary = 'btn bg-red-500 hover:bg-red-600 text-white';
  const btnWarning = 'btn bg-red-400 hover:bg-red-500 text-white';
  const btnDanger = 'btn bg-red-500 hover:bg-red-600 text-white';
  const tableHeadBg = theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900';
  const tableRowBg = theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900';
  const formRowBg = theme === 'dark' ? 'text-white' : 'text-white';

  return (
    <div className={`${sectionBg} min-h-screen py-8`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-md bg-red-600 text-white inline-flex items-center justify-center">
              <FaTasks />
            </span>
            <div>
              <h1 className="text-2xl font-bold">Work Sheet</h1>
              <p className="text-sm text-gray-500">Log daily tasks & hours</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-800">
              <strong>{works.length}</strong> entries
            </div>
          </div>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`w-full ${panelBg} rounded-lg p-4 sm:p-6 shadow-sm flex flex-col gap-4 md:flex-row md:items-end md:gap-6`}
        >
          <div className="w-full md:w-1/3">
            <label className="label flex flex-col items-start gap-1">
              <FaTasks className="text-red-500 text-lg" />
              <span className={`abel-text font-medium ${formRowBg}`}>Task</span>
            </label>
            <select
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className={selectClass}
            >
              <option>Sales</option>
              <option>Support</option>
              <option>Content</option>
              <option>Paper-work</option>
              <option>Design</option>
              <option>Development</option>
            </select>
          </div>

          <div className="w-full md:w-1/6">
            <label className="label flex flex-col items-start gap-1">
              <FaClock className="text-red-500 text-lg" />
              <span className={`abel-text font-medium ${formRowBg}`}>Hours</span>
            </label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value ? Number(e.target.value) : 0)}
              className={inputClass}
              min="0"
            />
          </div>

          <div className="w-full md:w-1/3">
            <label className="label flex flex-col items-start gap-1">
              <FaCalendarAlt className="text-red-500 text-lg" />
              <span className={`abel-text font-medium ${formRowBg}`}>Date</span>
            </label>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              className={`${inputClass} py-2`}
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className="w-full md:w-auto flex justify-end">
            <button type="submit" className={`${btnPrimary} px-4 h-10 flex items-center gap-2`}>
              <FaPaperPlane />
              <span>Submit</span>
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="mt-6 overflow-x-auto shadow-sm rounded-lg">
          <table className="table w-full">
            <thead className={`${tableHeadBg}`}>
              <tr>
                <th className="text-left px-4 py-3"><span className="inline-flex items-center gap-2"><FaTasks className="text-red-500" /> Task</span></th>
                <th className="text-center px-4 py-3"><span className="inline-flex items-center gap-2"><FaClock className="text-red-500" /> Hours</span></th>
                <th className="text-left px-4 py-3"><span className="inline-flex items-center gap-2"><FaCalendarAlt className="text-red-500" /> Date</span></th>
                <th className="text-center px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {works.map((w) => (
                <tr key={w._id} className={`${tableRowBg}`}>
                  <td className="px-4 py-3">{w.task}</td>
                  <td className="px-4 py-3 text-center">{w.hours}</td>
                  <td className="px-4 py-3">{w.date}</td>
                  <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                    <button
                      onClick={() => setEditData({ ...w })}
                      className={`${btnWarning} btn-sm px-3 py-1 flex items-center gap-2`}
                      title="Edit"
                    ><FaEdit /></button>
                    <button
                      onClick={() => handleDelete(w._id)}
                      className={`${btnDanger} btn-sm px-3 py-1 flex items-center gap-2`}
                      title="Delete"
                    ><FaTrash /></button>
                  </td>
                </tr>
              ))}
              {works.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-400">No entries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editData && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/40">
            <div className={`${panelBg} rounded-lg w-full max-w-md p-6 shadow-lg`}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaEdit className="text-red-500" /> Edit Work Entry
              </h3>

              <div className="form-control mb-4">
                <label className="label"><span className="label-text font-medium">Task</span></label>
                <select
                  value={editData.task}
                  onChange={(e) => setEditData({ ...editData, task: e.target.value })}
                  className={selectClass}
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
                <label className="label"><span className="label-text font-medium">Hours</span></label>
                <input
                  type="number"
                  value={editData.hours}
                  onChange={(e) => setEditData({ ...editData, hours: e.target.value })}
                  className={inputClass}
                  min="0"
                />
              </div>

              <div className="form-control mb-6">
                <label className="label"><span className="label-text font-medium">Date:</span></label>
                <br />
                <DatePicker
                  selected={new Date(editData.date)}
                  onChange={(d) => setEditData({ ...editData, date: d.toISOString().split('T')[0] })}
                  className={`${inputClass} py-2`}
                  dateFormat="yyyy-MM-dd"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setEditData(null)} className="btn">Cancel</button>
                <button onClick={handleUpdate} className={`${btnPrimary}`}>Update</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default WorkSheet;
