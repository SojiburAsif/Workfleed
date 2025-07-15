import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import Swal from "sweetalert2";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyCheckAlt,
  FaInfoCircle,
} from "react-icons/fa";
import UseAxios from "../../../Hooks/UseAxios";
import UseAuth from "../../../Hooks/UseAuth";
import { useNavigate, Outlet } from "react-router";

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = UseAuth();
  const axiosSecure = UseAxios();
  const navigate = useNavigate();

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [payMonth, setPayMonth] = useState("");
  const [payYear, setPayYear] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get("/users");
        setUsers(res.data);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to fetch users", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [axiosSecure]);

  const toggleVerified = async (user) => {
    if (user.role === "admin") return;

    try {
      const updatedStatus = !user.isVerified;
      await axiosSecure.put(`/users/${user._id}`, {
        isVerified: updatedStatus,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isVerified: updatedStatus } : u
        )
      );

      Swal.fire(
        "Success",
        `User verification set to ${
          updatedStatus ? "Verified ✅" : "Not Verified ❌"
        }`,
        "success"
      );
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update verification", "error");
    }
  };

  const openPayModal = (user) => {
    setSelectedUser(user);
    setPayMonth("");
    setPayYear("");
    setPayModalOpen(true);
  };

  const closePayModal = () => {
    setPayModalOpen(false);
    setSelectedUser(null);
  };

  const submitPayRequest = async () => {
    if (!payMonth || !payYear) {
      Swal.fire("Missing Info", "Please select both month and year.", "warning");
      return;
    }

    const requestPayload = {
      userId: selectedUser._id,
      name: selectedUser.name,
      email: selectedUser.email,
      salary: Number(selectedUser.salary),
      month: payMonth,
      year: payYear,
      paid: false,
      paymentDate: new Date().toISOString(),
      requestedBy: user.email,
      requestedAt: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/payroll", requestPayload);

      if (res.data.insertedId) {
        Swal.fire("Success", "Payment request sent!", "success");
        closePayModal();
      } else {
        throw new Error("Insert failed");
      }
    } catch (error) {
      console.error("Payroll Request Error:", error);
      Swal.fire("Error", "Failed to send payment request", "error");
    }
  };

  const openDetailsPage = (user) => {
    navigate(`/dashboard/employList/details/${user._id}`);
  };

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <span>
              {user.name}
              {user.role === "admin" && (
                <span className="ml-2 text-xs text-white bg-red-600 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </span>
          );
        },
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Verified",
        accessorKey: "isVerified",
        cell: ({ row }) => {
          const user = row.original;
          const isVerified = user.isVerified || false;
          const isAdmin = user.role === "admin";

          return (
            <button
              onClick={() => {
                if (!isAdmin) toggleVerified(user);
              }}
              disabled={isAdmin}
              className={`flex items-center gap-1 text-xl ${
                isAdmin ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title={
                isAdmin
                  ? "Cannot change verification for Admin"
                  : isVerified
                  ? "Click to mark Unverified"
                  : "Click to mark Verified"
              }
            >
              {isVerified ? (
                <>
                  <FaCheckCircle className="text-green-600" />
                  <span className="ml-1 text-green-700 font-semibold">
                    Verified
                  </span>
                </>
              ) : (
                <>
                  <FaTimesCircle className="text-red-600" />
                  <span className="ml-1 text-red-700 font-semibold">
                    Not Verified
                  </span>
                </>
              )}
            </button>
          );
        },
      },
      {
        header: "Bank Account",
        accessorKey: "bank_account_no",
        cell: ({ row }) => row.original.bank_account_no || "N/A",
      },
      {
        header: "Salary",
        accessorKey: "salary",
        cell: ({ row }) => {
          const salary = Number(row.original.salary);
          return !isNaN(salary) ? salary.toFixed(2) : "N/A";
        },
      },
      {
        header: "Pay",
        cell: ({ row }) => {
          const user = row.original;
          const isDisabled = !user.isVerified || user.role === "admin";
          return (
            <button
              disabled={isDisabled}
              onClick={() => openPayModal(user)}
              className={`btn btn-sm ${
                isDisabled ? "btn-gray cursor-not-allowed opacity-60" : "btn-green"
              } flex items-center gap-1`}
              title={
                user.role === "admin"
                  ? "Cannot pay Admin"
                  : user.isVerified
                  ? "Pay this employee"
                  : "Cannot pay unverified employee"
              }
            >
              <FaMoneyCheckAlt />
              Pay
            </button>
          );
        },
      },
      {
        header: "Details",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <button
              onClick={() => openDetailsPage(user)}
              className="btn btn-sm btn-blue flex items-center gap-1"
            >
              <FaInfoCircle />
              Details
            </button>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Employee List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-300 rounded-md">
            <thead className="bg-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border px-4 py-2 text-left text-gray-700"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    No employees found.
                  </td>
                </tr>
              )}
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-100 border-b border-gray-300"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border px-4 py-2 text-gray-800"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Nested Route Render */}
      <div className="mt-6">
        <Outlet />
      </div>

      {/* Pay Modal */}
      {payModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-96 max-w-full shadow-2xl z-50">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Pay Salary - {selectedUser?.name}
            </h3>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Salary</label>
              <input
                type="text"
                readOnly
                value={
                  typeof selectedUser?.salary === "number"
                    ? selectedUser.salary.toFixed(2)
                    : !isNaN(Number(selectedUser?.salary))
                    ? Number(selectedUser.salary).toFixed(2)
                    : "N/A"
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="payMonth" className="block mb-1 font-medium">
                Month
              </label>
              <select
                id="payMonth"
                value={payMonth}
                onChange={(e) => setPayMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="payYear" className="block mb-1 font-medium">
                Year
              </label>
              <input
                id="payYear"
                type="number"
                value={payYear}
                onChange={(e) => setPayYear(e.target.value)}
                placeholder="e.g. 2025"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="2000"
                max="2100"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={closePayModal}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitPayRequest}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
              >
                Submit Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
