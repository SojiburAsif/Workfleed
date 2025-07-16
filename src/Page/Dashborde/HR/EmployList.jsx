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
  FaEnvelope,
} from "react-icons/fa";
import UseAxios from "../../../Hooks/UseAxios";
import UseAuth from "../../../Hooks/UseAuth";
import { useNavigate, Outlet } from "react-router";
import LoadingCard from "../../Shared/LoadingCard";

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
        `User is now ${updatedStatus ? "Verified ✅" : "Not Verified ❌"}`,
        "success"
      );
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Verification update failed", "error");
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
      Swal.fire("Missing Info", "Please select both month and year", "warning");
      return;
    }

    const payload = {
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
      const res = await axiosSecure.post("/payroll", payload);
      if (res.data.insertedId) {
        Swal.fire("Success", "Payment request sent!", "success");
        closePayModal();
      } else throw new Error("Insert failed");
    } catch (error) {
      console.error(error);
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
          const u = row.original;
          return (
            <div className="flex items-center gap-2 text-black text-base">
              {u.name}
              {u.role === "admin" && (
                <span className="badge badge-outline badge-secondary badge-sm text-base">
                  Admin
                </span>
              )}
            </div>
          );
        },
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => {
          const email = row.original.email;
          return (
            <div className="flex items-center gap-2 text-black text-base">
              <FaEnvelope className="text-gray-700" />
              {email}
            </div>
          );
        },
      },
      {
        header: "Verified",
        accessorKey: "isVerified",
        cell: ({ row }) => {
          const u = row.original;
          const isAdmin = u.role === "admin";
          const isVerified = u.isVerified || false;
          return (
            <button
              onClick={() => !isAdmin && toggleVerified(u)}
              disabled={isAdmin}
              className="flex items-center gap-2 text-black text-base"
            >
              {isVerified ? (
                <span className="text-green-600 flex items-center gap-1 text-xl">
                  <FaCheckCircle /> Verified
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1 text-xl">
                  <FaTimesCircle /> Not Verified
                </span>
              )}
            </button>
          );
        },
      },
      {
        header: "Bank A/C",
        accessorKey: "bank_account_no",
        cell: ({ getValue }) => (
          <span className="text-black text-base">{getValue() || "N/A"}</span>
        ),
      },
      {
        header: "Salary",
        accessorKey: "salary",
        cell: ({ getValue }) => {
          const val = Number(getValue());
          return (
            <span className="text-black text-base">
              {!isNaN(val) ? `${val.toFixed(2)} ৳` : "N/A"}
            </span>
          );
        },
      },
      {
        header: "Pay",
        cell: ({ row }) => {
          const u = row.original;
          const disabled = !u.isVerified || u.role === "admin";
          return (
            <button
              onClick={() => openPayModal(u)}
              disabled={disabled}
              className={`btn btn-md px-6 py-2 text-white text-base rounded shadow-md transition ${disabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700"
                } flex items-center gap-2`}
            >
              <FaMoneyCheckAlt /> Pay
            </button>
          );
        },
      },
      {
        header: "Details",
        cell: ({ row }) => (
          <button
            onClick={() => openDetailsPage(row.original)}
            className="btn btn-md px-6 py-2 bg-gray-800 text-white text-base rounded shadow-md hover:from-blue-600 flex items-center gap-2"
          >
            <FaInfoCircle /> View
          </button>
        ),
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
      <h2 className="text-2xl font-bold text-black mb-4">Employee List</h2>

      {loading ? (
        <LoadingCard></LoadingCard>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th key={header.id} className="text-black text-base">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4 text-black text-base">
                    No employees found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="text-black text-base">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Outlet />

      {payModalOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box w-full max-w-2xl rounded-xl border border-red-500 shadow-lg">
            {/* Close button */}
            <form method="dialog" className="absolute right-3 top-3">
              <button onClick={closePayModal} className="btn btn-sm btn-circle btn-ghost">
                ✕
              </button>
            </form>

            <h3 className="font-bold text-3xl text-center text-red-600 mb-8">
              Pay Salary to {selectedUser?.name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
              {/* Salary Info */}
              <div className="form-control">
                <label className="label font-medium text-base text-black">
                  Salary Amount (৳)
                </label>
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
                  className="input input-bordered bg-base-100 text-black text-base w-full"
                />
              </div>

              {/* Month Selector */}
              <div className="form-control">
                <label className="label font-medium text-base text-black">
                  Select Month
                </label>
                <select
                  value={payMonth}
                  onChange={(e) => setPayMonth(e.target.value)}
                  className="select select-bordered bg-base-100 text-black text-base w-full"
                >
                  <option value="">Choose Month</option>
                  {[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Year Input */}
              <div className="form-control md:col-span-2">
                <label className="label font-medium text-base text-black">
                  Enter Year
                </label>
                <input
                  type="number"
                  value={payYear}
                  onChange={(e) => setPayYear(e.target.value)}
                  placeholder="e.g. 2025"
                  className="input input-bordered bg-base-100 text-black text-base w-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 px-2">
              <button
                onClick={closePayModal}
                className="btn btn-outline text-base border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitPayRequest}
                className="btn btn-error text-white text-base"
              >
                Submit
              </button>
            </div>
          </div>
        </dialog>
      )}


    </div>
  );
};

export default EmployeeList;
