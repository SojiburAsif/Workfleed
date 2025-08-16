import React, { useEffect, useMemo, useState, useContext } from "react";
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
  FaUser,
  FaThList,
  FaThLarge,
} from "react-icons/fa";
import UseAxios from "../../../Hooks/UseAxios";
import UseAuth from "../../../Hooks/UseAuth";
import { useNavigate, Outlet } from "react-router";
import LoadingCard from "../../Shared/LoadingCard";
import { ThemeContext } from "../../../Theme/ThemeProvider";

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = UseAuth();
  const axiosSecure = UseAxios();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [payMonth, setPayMonth] = useState("");
  const [payYear, setPayYear] = useState("");

  // viewMode: 'cards' (default) or 'table'
  const [viewMode, setViewMode] = useState("cards");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get("/users");
        setUsers(res.data || []);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to fetch users", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [axiosSecure]);

  const toggleVerified = async (u) => {
    if (u.role === "admin") return;
    try {
      const updatedStatus = !u.isVerified;
      await axiosSecure.put(`/users/${u._id}`, {
        isVerified: updatedStatus,
      });
      setUsers((prev) =>
        prev.map((x) => (x._id === u._id ? { ...x, isVerified: updatedStatus } : x))
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

  const openPayModal = (u) => {
    setSelectedUser(u);
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
      if (res.data?.insertedId) {
        Swal.fire("Success", "Payment request sent!", "success");
        closePayModal();
      } else {
        throw new Error("Insert failed");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to send payment request", "error");
    }
  };

  const openDetailsPage = (u) => {
    navigate(`/dashboard/employList/details/${u._id}`);
  };

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="flex items-center gap-2">
              <FaUser className="text-xl" />
              <div className="">
                <div className="font-medium">{u.name}</div>
                <div className="text-sm text-gray-500">{u.role ?? "employee"}</div>
              </div>
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
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-gray-500" />
              <span>{email}</span>
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
          const isVerified = !!u.isVerified;
          return (
            <button
              onClick={() => !isAdmin && toggleVerified(u)}
              disabled={isAdmin}
              className="flex items-center gap-2"
            >
              {isVerified ? (
                <span className="text-green-600 flex items-center gap-1">
                  <FaCheckCircle /> Verified
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1">
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
        cell: ({ getValue }) => <span>{getValue() || "N/A"}</span>,
      },
      {
        header: "Salary",
        accessorKey: "salary",
        cell: ({ getValue }) => {
          const val = Number(getValue());
          return <span>{!isNaN(val) ? `${val.toFixed(2)} ৳` : "N/A"}</span>;
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
              className={`px-2 py-3 rounded-md text-white text-xs flex items-center gap-1 justify-center ${disabled ? "bg-gray-400 cursor-not-allowed min-w-[100px]" : "bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 min-w-[100px]"}`}
            >
              <FaMoneyCheckAlt className="text-xs" /> Pay
            </button>
          );
        },
      },
      {
        header: "Details",
        cell: ({ row }) => (
          <button
            onClick={() => openDetailsPage(row.original)}
            className="px-2 py-3 rounded-md bg-gray-800 text-white text-xs flex items-center gap-1 justify-center min-w-[100px] border border-gray-100 "
          >
            <FaInfoCircle className="text-xs" /> View
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

  // Theme-aware classes
  const pageBg = theme === "dark" ? "bg-black text-gray-100" : "bg-white text-gray-900";
  const cardBg = theme === "dark" ? "bg-gray-950 border border-gray-800 text-gray-100" : "bg-white border border-gray-200 text-gray-900";
  const headerText = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const muted = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const badgeBg = theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800";

  return (
    <div className={`${pageBg} min-h-screen p-6 max-w-7xl mx-auto`}>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 className={`text-2xl font-bold ${headerText}`}>Employee List</h2>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="inline-flex items-center gap-2 bg-transparent rounded-md p-1">
            <button
              onClick={() => setViewMode("cards")}
              title="Card view"
              className={`p-2 rounded-md transition ${viewMode === "cards" ? "bg-red-600 text-white" : `${theme === "dark" ? "text-gray-400 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}`}
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => setViewMode("table")}
              title="Table view"
              className={`p-2 rounded-md transition ${viewMode === "table" ? "bg-red-600 text-white" : `${theme === "dark" ? "text-gray-400 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}`}
            >
              <FaThList />
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <LoadingCard />
      ) : (
        <>
          {/* Cards view (DEFAULT) */}
          {viewMode === "cards" && (
            <>
              {users.length === 0 ? (
                <p className="text-center text-red-500 font-semibold">No users found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {users.map((u) => {
                    const disabledPay = !u.isVerified || u.role === "admin";
                    return (
                      <div
                        key={u._id}
                        className={`${cardBg} rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[240px]`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-semibold">{u.name}</h3>
                              <div className={`inline-flex items-center gap-2 mt-2 ${muted}`}>
                                <FaEnvelope /> <span className="text-sm">{u.email}</span>
                              </div>
                              <div className="mt-3 flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-md text-xs ${badgeBg}`}>{u.role ?? "employee"}</span>
                                <span className={u.isVerified ? "text-green-500 text-sm flex items-center gap-1" : "text-red-500 text-sm flex items-center gap-1"}>
                                  {u.isVerified ? <><FaCheckCircle /> Verified</> : <><FaTimesCircle /> Not Verified</>}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 min-w-[10px]">
                              <div className="text-sm text-muted">Salary</div>
                              <div className="text-lg font-bold">{typeof u.salary === "number" ? `${u.salary.toFixed(2)} ৳` : (u.salary ? `${Number(u.salary).toFixed(2)} ৳` : "N/A")}</div>
                            </div>
                          </div>

                          <div className="mt-4 text-sm">
                            <div><strong>Bank A/C:</strong> {u.bank_account_no || "N/A"}</div>
                            <div className="mt-2"><strong>Joined:</strong> {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}</div>
                          </div>
                        </div>

                        <div className="mt-5 flex items-center gap-1">
                          {/* Verify / Unverify (reversed logic) */}
                          <button
                            onClick={() => toggleVerified(u)}
                            disabled={u.role === "admin"}
                            aria-label={u.isVerified ? "Verify user" : "Unverify user"}
                            className={`flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition min-w-[96px]   ${u.role === "admin"
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : u.isVerified
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-red-600 text-white hover:bg-red-700"
                              }`}
                          >
                            {u.isVerified ? (
                              <>
                                <FaCheckCircle className="text-white text-base" />
                                <span>Verify</span>
                              </>
                            ) : (
                              <>
                                <FaTimesCircle className="text-white text-base" />
                                <span>Unverify</span>
                              </>
                            )}
                          </button>

                          {/* Pay (compact) */}
                          <button
                            onClick={() => openPayModal(u)}
                            disabled={disabledPay}
                            aria-label="Pay salary"
                            className={`flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition min-w-[96px]  ${disabledPay
                              ? "bg-gray-400 cursor-not-allowed text-white"
                              : "bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 text-white"
                              }`}
                          >
                            <FaMoneyCheckAlt className="text-white text-base" />
                            <span>Pay</span>
                          </button>

                          {/* View (compact) */}
                          <button
                            onClick={() => openDetailsPage(u)}
                            className="ml-auto flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-gray-800 text-white text-sm font-medium min-w-[96px] hover:bg-gray-900 transition"
                            aria-label="View details"
                          >
                            <FaInfoCircle className="text-white text-base" />
                            <span>View</span>
                          </button>
                        </div>


                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Table view */}
          {viewMode === "table" && (
            <div className="overflow-x-auto">
              <table className={`table w-full ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                <thead className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                      {hg.headers.map((header) => (
                        <th key={header.id} className="text-left">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-4">No employees found.</td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className={`${theme === "dark" ? "border-t border-gray-800" : ""}`}>
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="py-3">
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
        </>
      )}

      <Outlet />

      {/* Pay modal */}
      {payModalOpen && (
        <dialog open className="modal modal-open">
          <div className={`modal-box w-full max-w-2xl rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-950 text-gray-100 border border-red-600" : "bg-white text-gray-900 border border-red-500"}`}>
            {/* Close button */}
            <form method="dialog" className="absolute right-3 top-3">
              <button onClick={closePayModal} className="btn btn-sm btn-circle btn-ghost">
                ✕
              </button>
            </form>

            <h3 className="font-bold text-3xl text-center text-red-600 mb-6">Pay Salary to {selectedUser?.name}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
              <div className="form-control">
                <label className={`label font-medium text-base ${headerText || ""}`}>Salary Amount (৳)</label>
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
                  className={`input input-bordered w-full ${theme === "dark" ? "bg-gray-900 text-gray-100 border-gray-700" : "bg-base-100 text-gray-900"}`}
                />
              </div>

              <div className="form-control">
                <label className={`label font-medium text-base ${headerText || ""}`}>Select Month</label>
                <select
                  value={payMonth}
                  onChange={(e) => setPayMonth(e.target.value)}
                  className={`select select-bordered w-full ${theme === "dark" ? "bg-gray-900 text-gray-100 border-gray-700" : "bg-base-100 text-gray-900"}`}
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

              <div className="form-control md:col-span-2">
                <label className={`label font-medium text-base ${headerText || ""}`}>Enter Year</label>
                <input
                  type="number"
                  value={payYear}
                  onChange={(e) => setPayYear(e.target.value)}
                  placeholder="e.g. 2025"
                  className={`input input-bordered w-full ${theme === "dark" ? "bg-gray-900 text-gray-100 border-gray-700" : "bg-base-100 text-gray-900"}`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={closePayModal}
                className={`px-4 py-2 rounded-md border ${theme === "dark" ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white" : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"}`}
              >
                Cancel
              </button>
              <button
                onClick={submitPayRequest}
                className="px-6 py-3 rounded-md bg-red-600 text-white"
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
