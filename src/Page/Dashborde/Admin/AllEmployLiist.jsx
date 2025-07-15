import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import UseAxios from '../../../Hooks/UseAxios';

const AllEmployeeList = () => {
  const axiosSecure = UseAxios();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEmp, setEditingEmp] = useState(null);
  const [newSalary, setNewSalary] = useState('');

  useEffect(() => {
    axiosSecure.get('/users?verified=true')
      .then(res => {
        setEmployees(res.data);
      })
      .catch(err => {
        console.error('Failed to load employees:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [axiosSecure]);

  const updateEmployeeInState = (id, updatedFields) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp._id === id ? { ...emp, ...updatedFields } : emp
      )
    );
  };

  // Fire employee
  const handleFire = (emp) => {
    Swal.fire({
      title: `Fire ${emp.name}?`,
      text: "After firing, this user won't be able to login anymore!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Fire',
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure.put(`/users/fire/${emp._id}`)
          .then(({ data }) => {
            Swal.fire('Fired!', data.message || `${emp.name} has been fired.`, 'success');
            updateEmployeeInState(emp._id, { fired: true });
          })
          .catch(() => Swal.fire('Error', 'Failed to fire employee', 'error'));
      }
    });
  };

  // Rehire employee
  // const handleRehire = (emp) => {
  //   Swal.fire({
  //     title: `Rehire ${emp.name}?`,
  //     text: "This will restore the employee's status.",
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, Rehire',
  //   }).then(result => {
  //     if (result.isConfirmed) {
  //       axiosSecure.put(`/users/rehire/${emp._id}`)
  //         .then(({ data }) => {
  //           Swal.fire('Success!', data.message || `${emp.name} has been rehired.`, 'success');
  //           updateEmployeeInState(emp._id, { fired: false });
  //         })
  //         .catch(() => Swal.fire('Error', 'Failed to rehire employee', 'error'));
  //     }
  //   });
  // };

  // Make HR
  const handleMakeHR = (emp) => {
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

  // Make Employee (remove HR role)
  const handleMakeEmployee = (emp) => {
    Swal.fire({
      title: `Remove HR role from ${emp.name}?`,
      text: 'This will make the user a regular employee.',
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

  // Adjust salary
  const handleSalaryAdjust = () => {
    const salary = parseFloat(newSalary);
    if (isNaN(salary) || salary <= 0) {
      return Swal.fire('Invalid Input', 'Please enter a valid positive number.', 'warning');
    }

    axiosSecure.put(`/users/salary/${editingEmp._id}`, { salary })
      .then(({ data }) => {
        Swal.fire('Success', data.message || 'Salary updated successfully.', 'success');
        updateEmployeeInState(editingEmp._id, { salary });
        setEditingEmp(null);
        setNewSalary('');
      })
      .catch(() => Swal.fire('Error', 'Failed to update salary.', 'error'));
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">All Verified Employees</h2>

      {employees.length === 0 ? (
        <p className="text-center text-gray-500">No employees found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Designation</th>
              <th className="border px-4 py-2 text-left">Role</th>
              <th className="border px-4 py-2 text-left">Salary</th>
              <th className="border px-4 py-2 text-center">Change Role</th>
              <th className="border px-4 py-2 text-center">Fire / Rehire</th>
              <th className="border px-4 py-2 text-center">Salary Adjust</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr
                key={emp._id}
                className={`hover:bg-gray-50 ${emp.fired ? 'bg-red-100 text-red-800' : ''}`}
              >
                <td className="border px-4 py-2">{emp.name || 'N/A'}</td>
                <td className="border px-4 py-2">{emp.designation || '-'}</td>
                <td className="border px-4 py-2">
                  {emp.fired ? 'Fired' : (emp.role?.toUpperCase() || 'EMPLOYEE')}
                </td>
                <td className="border px-4 py-2">{emp.salary ? `৳${emp.salary}` : '-'}</td>

                <td className="border px-4 py-2 text-center">
                  {!emp.fired && emp.role !== 'admin' ? (
                    emp.role?.toLowerCase() === 'hr' ? (
                      <button
                        onClick={() => handleMakeEmployee(emp)}
                        className="btn btn-sm btn-warning"
                      >
                        Make Employee
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMakeHR(emp)}
                        className="btn btn-sm btn-primary"
                      >
                        Make HR
                      </button>
                    )
                  ) : emp.fired ? (
                    <span className="text-gray-500 italic">N/A</span>
                  ) : (
                    <span className="text-gray-500 italic">Admin</span>
                  )}
                </td>

                <td className="border px-4 py-2 text-center">
                  {!emp.fired && emp.role !== 'admin' ? (
                    <button
                      onClick={() => handleFire(emp)}
                      className="btn btn-sm btn-error"
                    >
                      Fire
                    </button>
                  ) : emp.role === 'admin' ? (
                    <span className="text-gray-500 italic">Admin</span>
                  ) : (
                    <span className="text-gray-500 italic">N/A</span>
                  )}
                </td>


                <td className="border px-4 py-2 text-center">
                  {!emp.fired && emp.role !== 'admin' ? (
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        setEditingEmp(emp);
                        setNewSalary(emp.salary || '');
                      }}
                    >
                      Adjust Salary
                    </button>
                  ) : (
                    <span className="text-gray-500 italic">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Salary Modal */}
      {editingEmp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">
              Adjust Salary for {editingEmp.name}
            </h3>
            <input
              type="number"
              className="border px-3 py-2 w-full mb-4 rounded"
              placeholder="Enter new salary"
              value={newSalary}
              onChange={(e) => setNewSalary(e.target.value)}
              min={0}
            />
            <div className="flex justify-end gap-3">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setEditingEmp(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-success"
                onClick={handleSalaryAdjust}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEmployeeList;
