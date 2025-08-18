import React, { useEffect, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import UseAxios from '../../../Hooks/UseAxios';
import {
  FaUser,
  FaBriefcase,
  FaUserShield,
  FaMoneyBillWave,
  FaUsers
} from 'react-icons/fa';
import LoadingCard from '../../Shared/LoadingCard';
import { ThemeContext } from '../../../Theme/ThemeProvider';

const AllEmployeeList = () => {
  const { theme } = useContext(ThemeContext);
  const axiosSecure = UseAxios();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEmp, setEditingEmp] = useState(null);
  const [newSalary, setNewSalary] = useState('');
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    axiosSecure
      .get('/users?verified=true')
      .then(res => setEmployees(res.data))
      .catch(err => console.error('Failed to load employees:', err))
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  const updateEmployeeInState = (id, updatedFields) => {
    setEmployees(prev =>
      prev.map(emp => (emp._id === id ? { ...emp, ...updatedFields } : emp))
    );
  };

  const handleMakeHR = emp => {
    Swal.fire({
      title: `Make ${emp.name} an HR?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Make HR',
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure.put(`/users/make-hr/${emp._id}`)
          .then(({ data }) => {
            Swal.fire('Success!', data.message || `${emp.name} is now an HR.`, 'success');
            updateEmployeeInState(emp._id, { role: 'HR' });
          })
          .catch(() => Swal.fire('Error', 'Failed to make HR', 'error'));
      }
    });
  };

  const handleMakeEmployee = emp => {
    Swal.fire({
      title: `Remove HR role from ${emp.name}?`,
      text: 'They will become a regular employee.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Make Employee',
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure.put(`/users/make-employee/${emp._id}`)
          .then(({ data }) => {
            Swal.fire('Success!', data.message || `${emp.name} is now an employee.`, 'success');
            updateEmployeeInState(emp._id, { role: 'employee' });
          })
          .catch(() => Swal.fire('Error', 'Failed to change role', 'error'));
      }
    });
  };

  const handleSalaryAdjust = () => {
    const salary = parseFloat(newSalary);
    if (isNaN(salary) || salary <= editingEmp.salary) {
      return Swal.fire('Invalid Input', `Please enter a number greater than ৳${editingEmp.salary}.`, 'warning');
    }
    axiosSecure.put(`/users/salary/${editingEmp._id}`, { salary })
      .then(({ data }) => {
        Swal.fire('Updated!', data.message || 'Salary updated.', 'success');
        updateEmployeeInState(editingEmp._id, { salary });
        setEditingEmp(null);
        setNewSalary('');
      })
      .catch(() => Swal.fire('Error', 'Failed to update salary.', 'error'));
  };

  const handleFire = emp => {
    Swal.fire({
      title: `Fire ${emp.name}?`,
      text: 'This will mark the user as fired.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Fire',
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure.put(`/users/fire/${emp._id}`)
          .then(({ data }) => {
            Swal.fire('Success!', data.message || 'User fired successfully.', 'success');
            updateEmployeeInState(emp._id, { fired: true });
          })
          .catch(() => Swal.fire('Error', 'Failed to fire user.', 'error'));
      }
    });
  };

  const handleUnfire = emp => {
    Swal.fire({
      title: `Rehire ${emp.name}?`,
      text: 'This will make the user active again.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Unfire',
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure.put(`/users/unfire/${emp._id}`)
          .then(({ data }) => {
            Swal.fire('Success!', data.message || 'User is active again.', 'success');
            updateEmployeeInState(emp._id, { fired: false });
          })
          .catch(() => Swal.fire('Error', 'Failed to unfire user.', 'error'));
      }
    });
  };

  if (loading) return <LoadingCard />;

  const bgClass = theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-black';
  const cardClass = theme === 'dark' ? 'bg-gray-950 text-white border border-gray-700' : 'bg-white text-black border border-gray-200';
  const tableHeaderClass = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black';
  const modalClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black';
  const btnClass = 'btn bg-red-600 text-white hover:bg-red-700';

  const filteredEmployees = employees.filter(emp => emp.role !== 'admin');

  return (
    <section className={`px-4 sm:px-6 lg:px-12 py-8 min-h-screen ${bgClass}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-red-500 font-bold flex items-center gap-2">
          <FaUsers /> All Verified Employees
        </h2>
        <button
          onClick={() => setViewMode(vm => (vm === 'table' ? 'grid' : 'table'))}
          className={`${btnClass} w-full sm:w-auto`}
        >
          {viewMode === 'table' ? 'Card View' : 'Table View'}
        </button>
      </div>

      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="table w-full text-sm sm:text-base">
            <thead className={tableHeaderClass}>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Role</th>
                <th>Salary</th>
                <th className="text-center">Change Role</th>
                <th className="text-center">Adjust Salary</th>
                <th className="text-center">Fire/Unfire</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr
                  key={emp._id}
                  className={`${emp.fired ? (theme==='dark'?'bg-red-900 text-red-300':'bg-red-50 text-red-800') : ''}`}
                >
                  <td>{emp.name}</td>
                  <td>{emp.designation || '-'}</td>
                  <td>
                    {emp.fired ? (
                      <span className="italic text-red-600">Fired</span>
                    ) : emp.role === 'HR' ? (
                      <span className="badge badge-warning text-black">HR</span>
                    ) : (
                      <span className="badge badge-secondary text-black">Employee</span>
                    )}
                  </td>
                  <td>৳{emp.salary}</td>
                  <td className="text-center">
                    {!emp.fired && (
                      emp.role === 'HR' ? (
                        <button onClick={() => handleMakeEmployee(emp)} className="btn btn-xs sm:btn-sm bg-gray-700 text-white">Employee</button>
                      ) : (
                        <button onClick={() => handleMakeHR(emp)} className="btn btn-xs sm:btn-sm bg-red-600 text-white">HR</button>
                      )
                    )}
                  </td>
                  <td className="text-center">
                    {!emp.fired && (
                      <button onClick={() => { setEditingEmp(emp); setNewSalary(emp.salary); }} className="btn btn-xs sm:btn-sm bg-red-600 text-white">Adjust</button>
                    )}
                  </td>
                  <td className="text-center">
                    {emp.fired ? (
                      <button onClick={() => handleUnfire(emp)} className="btn btn-xs sm:btn-sm bg-green-600 text-white">Unfire</button>
                    ) : (
                      <button onClick={() => handleFire(emp)} className="btn btn-xs sm:btn-sm bg-red-600 text-white">Fire</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map(emp => (
            <div
              key={emp._id}
              className={`border rounded-lg p-6 shadow-md ${emp.fired ? (theme==='dark'?'bg-red-900 text-red-300':'bg-red-50 text-red-800') : cardClass}`}
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-4 border-b pb-2 flex items-center gap-2">
                <FaUser /> {emp.name}
              </h3>
              <p className="mb-2 flex items-center gap-2 text-sm sm:text-base">
                <FaBriefcase className="text-red-500" />
                <strong>Designation:</strong> {emp.designation || '-'}
              </p>
              <p className="mb-2 flex items-center gap-2 text-sm sm:text-base">
                <FaUserShield className="text-red-500" />
                <strong>Role:</strong> {emp.fired ? 'Fired' : emp.role}
              </p>
              <p className="mb-4 flex items-center gap-2 text-sm sm:text-base">
                <FaMoneyBillWave className="text-red-500" />
                <strong>Salary:</strong> ৳{emp.salary}
              </p>
              {!emp.fired && (
                <div className="flex flex-col gap-2">
                  {emp.role === 'HR' ? (
                    <button onClick={() => handleMakeEmployee(emp)} className="btn btn-sm bg-gray-700 text-white">Make Employee</button>
                  ) : (
                    <button onClick={() => handleMakeHR(emp)} className="btn btn-sm bg-red-600 text-white">Make HR</button>
                  )}
                  <button onClick={() => { setEditingEmp(emp); setNewSalary(emp.salary); }} className="btn btn-sm bg-red-600 text-white">Adjust Salary</button>
                  <button onClick={() => handleFire(emp)} className="btn btn-sm bg-red-700 text-white">Fire</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editingEmp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className={`p-6 rounded-lg max-w-md w-full shadow-lg ${modalClass}`}>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
              Adjust Salary for {editingEmp.name}
            </h3>
            <input
              type="number"
              className={`input input-bordered w-full mb-4 ${theme==='dark'?'bg-gray-800 text-white border-gray-600':'bg-white text-black border-gray-300'}`}
              value={newSalary}
              onChange={e => setNewSalary(e.target.value)}
              min={editingEmp.salary + 0.01}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button onClick={() => setEditingEmp(null)} className="btn btn-outline border-gray-500 text-white hover:bg-gray-700 w-full sm:w-auto">
                Cancel
              </button>
              <button onClick={handleSalaryAdjust} className="btn bg-red-600 text-white w-full sm:w-auto">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AllEmployeeList;
