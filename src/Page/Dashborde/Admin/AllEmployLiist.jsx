import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import UseAxios from '../../../Hooks/UseAxios';
import {
  FaUser,
  FaBriefcase,
  FaUserShield,
  FaMoneyBillWave,
} from 'react-icons/fa';
import LoadingCard from '../../Shared/LoadingCard';

const AllEmployeeList = () => {
  const axiosSecure = UseAxios();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEmp, setEditingEmp] = useState(null);
  const [newSalary, setNewSalary] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  useEffect(() => {
    axiosSecure
      .get('/users?verified=true')
      .then(res => setEmployees(res.data))
      .catch(err => console.error('Failed to load employees:', err))
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  const updateEmployeeInState = (id, updatedFields) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp._id === id ? { ...emp, ...updatedFields } : emp
      )
    );
  };

  // Change role handlers
  const handleMakeHR = emp => {
    Swal.fire({
      title: `Make ${emp.name} an HR?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Make HR',
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure
          .put(`/users/make-hr/${emp._id}`)
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
        axiosSecure
          .put(`/users/make-employee/${emp._id}`)
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
      return Swal.fire(
        'Invalid Input',
        `Please enter a number greater than the current salary (৳${editingEmp.salary}).`,
        'warning'
      );
    }
    axiosSecure
      .put(`/users/salary/${editingEmp._id}`, { salary })
      .then(({ data }) => {
        Swal.fire('Updated!', data.message || 'Salary updated.', 'success');
        updateEmployeeInState(editingEmp._id, { salary });
        setEditingEmp(null);
        setNewSalary('');
      })
      .catch(() => Swal.fire('Error', 'Failed to update salary.', 'error'));
  };

  if (loading) {
    return <LoadingCard></LoadingCard>
  }

  return (
    <section className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold text-black">All Verified Employees</h2>
        <button
          onClick={() => setViewMode(vm => (vm === 'table' ? 'grid' : 'table'))}
          className="btn bg-red-600 hover:bg-red-700 text-white"
        >
          {viewMode === 'table' ? 'Card View' : 'Table View'}
        </button>
      </div>

      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-gray-100">
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Role</th>
                <th>Salary</th>
                <th className="text-center">Change Role</th>
                <th className="text-center">Adjust Salary</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr
                  key={emp._id}
                  className={`${emp.fired ? 'bg-red-50 text-red-800' : 'text-black'}`}
                >
                  <td>{emp.name}</td>
                  <td>{emp.designation || '-'}</td>
                  <td>
                    {emp.fired ? (
                      <span className="italic text-red-600">Fired</span>
                    ) : emp.role === 'admin' ? (
                      <span className="badge badge-outline badge-error text-black">Admin</span>
                    ) : emp.role === 'HR' ? (
                      <span className="badge badge-outline badge-warning text-black">HR</span>
                    ) : (
                      <span className="badge badge-outline badge-secondary text-black">Employee</span>
                    )}
                  </td>
                  <td>৳{emp.salary}</td>
                  <td className="text-center">
                    {!emp.fired && emp.role !== 'admin' ? (
                      emp.role === 'HR' ? (
                        <button
                          onClick={() => handleMakeEmployee(emp)}
                          className="btn btn-sm px-6 py-2 bg-black text-white font-semibold hover:bg-gray-400 transition"
                        >
                          Employee
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMakeHR(emp)}
                          className="btn btn-sm px-6 py-2 bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                        >
                          HR
                        </button>
                      )
                    ) : (
                      <span className="italic text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="text-center">
                    {!emp.fired && emp.role !== 'admin' ? (
                      <button
                        onClick={() => {
                          setEditingEmp(emp);
                          setNewSalary(emp.salary);
                        }}
                        className="btn btn-sm bg-red-600 hover:bg-red-700 text-white"
                      >
                        Adjust Salary
                      </button>
                    ) : (
                      <span className="italic text-gray-500">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map(emp => (
            <div
              key={emp._id}
              className={`border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ${emp.fired ? 'bg-red-50 text-red-800' : 'bg-white text-black'
                }`}
            >
              <h3 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2 flex items-center gap-2 text-black">
                <FaUser /> {emp.name}
              </h3>

              <p className="mb-3 flex items-center gap-2 text-gray-800">
                <FaBriefcase className="text-red-600" />{' '}
                <span>
                  <strong>Designation:</strong> {emp.designation || '-'}
                </span>
              </p>

              <p className="mb-3 flex items-center gap-2 text-gray-800">
                <FaUserShield className="text-red-600" />{' '}
                <span>
                  <strong>Role: </strong>
                  {emp.fired ? (
                    <span className="italic text-red-600">Fired</span>
                  ) : emp.role === 'admin' ? (
                    <span className="badge badge-outline badge-error text-black">Admin</span>
                  ) : emp.role === 'HR' ? (
                    <span className="badge badge-outline badge-warning text-black">HR</span>
                  ) : (
                    <span className="badge badge-outline badge-secondary text-black">Employee</span>
                  )}
                </span>
              </p>

              <p className="mb-4 flex items-center gap-2 text-gray-800">
                <FaMoneyBillWave className="text-red-600" />{' '}
                <span>
                  <strong>Salary:</strong> ৳{emp.salary}
                </span>
              </p>

              {!emp.fired && emp.role !== 'admin' && (
                <div className="flex flex-col gap-2">
                  {emp.role === 'HR' ? (
                    <button
                      onClick={() => handleMakeEmployee(emp)}
                      className="btn px-6 py-2 bg-gray-300 text-black font-semibold hover:bg-gray-400 transition"
                    >
                      Make Employee
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMakeHR(emp)}
                      className="btn px-6 py-2 bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                    >
                      Make HR
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingEmp(emp);
                      setNewSalary(emp.salary);
                    }}
                    className="btn bg-red-600 hover:bg-red-700 text-white"
                  >
                    Adjust Salary
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Salary Modal */}
      {editingEmp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-center text-black">
              Adjust Salary for {editingEmp.name}
            </h3>
            <input
              type="number"
              className="input input-bordered w-full mb-4"
              value={newSalary}
              onChange={e => setNewSalary(e.target.value)}
              min={editingEmp.salary + 0.01}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingEmp(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSalaryAdjust}
                className="btn bg-red-600 hover:bg-red-700 text-white"
              >
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
