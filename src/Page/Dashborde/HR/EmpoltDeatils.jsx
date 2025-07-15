import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Swal from 'sweetalert2';
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { MdVerified, MdCancel } from 'react-icons/md';
import UseAxios from '../../../Hooks/UseAxios';

const EmployDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const axiosSecure = UseAxios();

  // fetch basic user info
  useEffect(() => {
    axiosSecure
      .get(`/users/${id}`)
      .then((res) => setUser(res.data))
      .catch(() =>
        Swal.fire("Error", "Failed to load employee data", "error")
      );
  }, [id, axiosSecure]);

  // fetch payroll history for chart
  useEffect(() => {
    axiosSecure
      .get(`/payroll/${id}`)
      .then((res) => {
        const data = res.data.map((p) => ({
          label: `${p.month.slice(0, 3)} ${p.year}`,
          salary: Number(p.salary),
        }));
        setHistory(data);
      })
      .catch(() =>
        Swal.fire("Error", "Failed to load payroll history", "error")
      );
  }, [id, axiosSecure]);

  if (!user) {
    return (
      <p className="text-center mt-10 text-lg font-semibold">
        Loading user…
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 bg-gradient-to-b from-white via-red-50 to-white min-h-[80vh]">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Card */}
        <div className="flex-1 bg-white rounded-xl p-10 border-2 border-red-300">
          <div className="text-center mb-10">
            <img
              src={user.photo || "/placeholder.png"}
              alt={user.name}
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-red-600"
            />
            <h3 className="mt-5 text-4xl font-extrabold text-red-700">
              {user.name}
            </h3>
            <p className="text-red-400 uppercase tracking-wider text-lg mt-1">
              {user.designation || "N/A"}
            </p>
            <p className="mt-2 font-semibold flex items-center justify-center gap-2 text-lg">
              {user.isVerified ? (
                <>
                  <MdVerified className="text-green-600" size={24} />
                  Verified
                </>
              ) : (
                <>
                  <MdCancel className="text-red-600" size={24} />
                  Not Verified
                </>
              )}
            </p>
          </div>
          <div className="text-gray-800 text-lg space-y-6">
            <div className="flex justify-between font-semibold">
              <span className="text-red-700">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-red-700">Role:</span>
              <span>{user.role}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-red-700">Bank Account:</span>
              <span>{user.bank_account_no || "N/A"}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-red-700">Salary:</span>
              <span>
                {user.salary ? Number(user.salary).toFixed(2) : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Salary History Chart */}
        <div className="flex-1 bg-white rounded-xl p-10 flex flex-col border-2 border-red-300">
          <h4 className="text-3xl font-bold text-red-700 mb-8 text-center">
            Salary History
          </h4>
          {history.length === 0 ? (
            <p className="text-center text-gray-500 mt-auto">
              No paid history to show.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={history}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 14 }}
                  label={{ value: "Month", position: "bottom", offset: 0 }}
                />
                <YAxis
                  tick={{ fontSize: 14 }}
                  label={{ value: "Salary", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value) => `${value.toFixed(2)}`}
                  wrapperStyle={{ fontSize: "14px" }}
                />
                <Bar dataKey="salary" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployDetails;
