import React, { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios"; // <-- ADDED
import { Link } from "react-router";
import UseAuth from "../../../Hooks/UseAuth";
import UseAxios from "../../../Hooks/UseAxios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaUsers, FaTasks, FaMoneyBillWave, FaClock, FaStar, FaEnvelope, FaList, FaChartBar } from "react-icons/fa";
import { MdVerified, MdClose } from "react-icons/md";
import { ThemeContext } from "../../../Theme/ThemeProvider";
import RewLoading from "../../Shared/RewLoading";
import { HiArrowSmRight } from "react-icons/hi";

// === fallback data (only used if fetch fails) ===
const PROVIDED_USER = {
  _id: "687253bce954b145482f7335",
  name: "User..",
  email: "asif81534@gmail.com",
  photo: "https://i.ibb.co.com/mFTv3zj6/322823b95163.png",
  role: "employee.....",
  salary: 200000,
  verified: false,
  isVerified: false, // new normalized flag
};
const PROVIDED_WORK = [
  { _id: "6874c7532005bae68258ab5b", task: "Sales", hours: "2", date: "2025-01-30", userEmail: "nohaluve@mailinator.com", name: "Ora Alston" },
];
const PROVIDED_PAYMENT = [
  { _id: "68736b9a044899259d61fd43", userId: "68725fd43a2d8b91981af012", name: "Md Asif", email: "asif1@gmail.com", salary: 2333, paid: true, paymentDate: "2025-07-16T17:03:23.356+00:00" }
];

function formatShort(n) {
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return n;
}

// Normalize a user object so it always has isVerified
function normalizeUser(u = {}) {
  return {
    ...u,
    isVerified: typeof u.isVerified === "boolean" ? u.isVerified : (typeof u.verified === "boolean" ? u.verified : false),
  };
}

export default function DashboardWithReviews() {
  const axiosSecure = UseAxios();
  const { user } = UseAuth(); // removed updateUser since edit removed
  const { theme, toggleTheme } = useContext(ThemeContext) || {};

  // data state
  const [latestUser, setLatestUser] = useState(normalizeUser(PROVIDED_USER));
  const [works, setWorks] = useState(PROVIDED_WORK);
  const [payments, setPayments] = useState(PROVIDED_PAYMENT);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);

  // modal for stat details
  const [statModalOpen, setStatModalOpen] = useState(false);
  const [statModalType, setStatModalType] = useState(null); // 'Users'|'Payroll'|'Hours'|'Works'

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      if (!axiosSecure) {
        // use fallbacks
        if (mounted) {
          setLatestUser(normalizeUser(PROVIDED_USER));
          setWorks(PROVIDED_WORK);
          setPayments(PROVIDED_PAYMENT);
          setReviews([]);
          setUsers([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        // reviews
        try {
          const r = await axiosSecure.get("/reviews");
          if (!mounted) return;
          setReviews(Array.isArray(r.data) ? r.data : r.data?.data ?? []);
        } catch (e) {
          if (mounted) setReviews([]);
        }

        // payrolls
        try {
          const p = await axiosSecure.get("/payroll/all");
          if (!mounted) return;
          setPayments(Array.isArray(p.data) ? p.data : p.data?.data ?? []);
        } catch (e) {
          if (mounted) setPayments(PROVIDED_PAYMENT);
        }

        // works
        try {
          const w = await axiosSecure.get("/works");
          if (!mounted) return;
          setWorks(Array.isArray(w.data) ? w.data : w.data?.data ?? []);
        } catch (e) {
          if (mounted) setWorks(PROVIDED_WORK);
        }

        // users list
        try {
          const ulist = await axiosSecure.get("/users");
          if (!mounted) return;
          const raw = Array.isArray(ulist.data) ? ulist.data : ulist.data?.data ?? [];
          // normalize each user to have isVerified
          if (mounted) setUsers(raw.map(normalizeUser));
        } catch (e) {
          if (mounted) setUsers([]);
        }

        // profile
        try {
          if (user?.email) {
            const u = await axiosSecure.get(`/user/${encodeURIComponent(user.email)}`);
            if (!mounted) return;
            // support both direct object and { data: [...] }
            const fetched = u.data ?? PROVIDED_USER;
            setLatestUser(normalizeUser(fetched));
          } else {
            setLatestUser(normalizeUser(PROVIDED_USER));
          }
        } catch (e) {
          if (mounted) setLatestUser(normalizeUser(PROVIDED_USER));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();
    return () => (mounted = false);
  }, [axiosSecure, user?.email]);

  // Derived chart data
  const payrollChartData = useMemo(() => {
    const paidCount = payments.filter((p) => p.paid).length;
    const unpaidCount = payments.filter((p) => !p.paid).length;
    return [{ name: "Paid", value: paidCount }, { name: "Unpaid", value: unpaidCount }];
  }, [payments]);

  const monthsRange = useMemo(() => ["2024-11", "2024-12", "2025-01", "2025-02", "2025-03", "2025-04", "2025-05"], []);
  const areaData = useMemo(() => {
    return monthsRange.map((m) => {
      const [y, mm] = m.split("-");
      const paymentSum = payments.filter((p) => p.paymentDate)
        .filter((p) => {
          const d = new Date(p.paymentDate);
          return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}` === m;
        }).reduce((s, p) => s + (Number(p.salary) || 0), 0);
      const workHours = works.filter((w) => w.date && w.date.startsWith(`${y}-${mm}`)).reduce((s, w) => s + Number(w.hours || 0), 0);
      const paymentsCount = payments.filter((p) => {
        if (!p.paymentDate) return false;
        const d = new Date(p.paymentDate);
        return d.getUTCFullYear() === Number(y) && String(d.getUTCMonth() + 1).padStart(2, "0") === mm;
      }).length;
      return { name: `${y}-${mm}`, v5: paymentSum, v6: workHours, v7: paymentsCount };
    });
  }, [payments, works, monthsRange]);

  const barData = useMemo(() => {
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const counts = new Array(7).fill(0);
    works.forEach((w) => {
      if (!w.date) return;
      const d = new Date(w.date);
      const idx = (d.getUTCDay() + 6) % 7;
      counts[idx] += 1;
    });
    return days.map((day, i) => ({ day, issues: counts[i] }));
  }, [works]);

  // top 3 reviews (by rating)
  const topReviews = useMemo(() =>
    (reviews || []).slice().sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)).slice(0, 3),
    [reviews]
  );

  // star dist for mini chart
  const starDist = useMemo(() => {
    return [1, 2, 3, 4, 5].map((s) => ({ star: `${s}★`, count: (reviews || []).filter(r => Math.round(Number(r.rating || 0)) === s).length }));
  }, [reviews]);

  // theme tokens
  const wrapperBg = theme === "dark" ? "bg-gray-950 text-white" : "bg-gray-50 text-black";
  const cardBg = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";
  const subtleText = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const chartGridStroke = theme === "dark" ? "#111827" : "#E5E7EB";
  const primary = "#EF4444";

  // helper to show icon in stat modal header
  function getStatIcon(t) {
    if (t === 'Users') return <FaUsers className="w-5 h-5" />;
    if (t === 'Works') return <FaTasks className="w-5 h-5" />;
    if (t === 'Hours') return <FaClock className="w-5 h-5" />;
    if (t === 'Payroll') return <FaMoneyBillWave className="w-5 h-5" />;
    return <FaList className="w-5 h-5" />;
  }

  function openStatModal(type) {
    setStatModalType(type);
    setStatModalOpen(true);
  }

  function closeStatModal() {
    setStatModalOpen(false);
    setStatModalType(null);
  }

  // Users pie data (role distribution + verified)
  const usersRoleDistribution = useMemo(() => {
    const roles = {};
    let verified = 0;
    (users || []).forEach(u => {
      roles[u.role || 'unknown'] = (roles[u.role || 'unknown'] || 0) + 1;
      if (u.isVerified) verified += 1;
    });
    const roleData = Object.keys(roles).map(k => ({ name: k, value: roles[k] }));
    const verifiedData = [
      { name: 'Verified', value: verified },
      { name: 'Unverified', value: (users || []).length - verified }
    ];
    return { roleData, verifiedData };
  }, [users]);

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#06b6d4'];

  return (
    <div className={`${wrapperBg} min-h-screen p-4 sm:p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header row: title, toggle, profile card */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            Analytics Dashboard <FaChartBar className="text-red-500" />
          </h1>

          <div className="flex items-center gap-4">
            {/* swap/toggle (uses your SVGs) */}
            <label className="swap swap-rotate">
              <input
                type="checkbox"
                onChange={() => (typeof toggleTheme === "function" ? toggleTheme() : null)}
                checked={theme === "dark"}
                aria-label="Toggle theme"
              />

              {/* sun icon (swap-on) */}
              <svg className="swap-on h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>

              {/* moon icon (swap-off) */}
              <svg className="swap-off h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label>

            <div className={`${cardBg} rounded-2xl p-3 flex items-center gap-3 shadow`}>
              <img src={latestUser.photo || "https://i.ibb.co.com/s7fySm4/user-1.png"} alt={latestUser.name || "User"} className="w-12 h-12 rounded-full object-cover border" />
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold" style={{ color: theme === "dark" ? "white" : "black" }}>{latestUser.name}</div>
                  {latestUser?.isVerified ? (
                    <MdVerified title="Verified" className="text-green-400 w-5 h-5" />
                  ) : (
                    <MdClose title="Unverified" className="text-gray-400 w-5 h-5" />
                  )}
                </div>
                <div className={`${subtleText} text-sm`}>{latestUser.role || "—"}</div>
              </div>
              {/* Edit button removed as requested */}
            </div>
          </div>
        </div>

        {loading ? (
          <RewLoading></RewLoading>
        ) : null}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<FaUsers />} label="Users" value={`${users?.length || 0}`} cardBg={cardBg} theme={theme} onClick={() => openStatModal('Users')} />
          <StatCard icon={<FaTasks />} label="Works" value={`${works?.length || 0}`} cardBg={cardBg} theme={theme} onClick={() => openStatModal('Works')} />
          <StatCard icon={<FaClock />} label="Hours" value={`${works.reduce((s, w) => s + Number(w.hours || 0), 0)}`} cardBg={cardBg} theme={theme} onClick={() => openStatModal('Hours')} />
          <StatCard icon={<FaMoneyBillWave />} label="Payroll" value={payrollChartData.reduce((s, d) => s + d.value, 0)} cardBg={cardBg} theme={theme} smallChart smallChartData={areaData.map(d => ({ name: d.name, v: d.v5 }))} onClick={() => openStatModal('Payroll')} />
        </div>

        {/* Charts area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${cardBg} rounded-2xl p-5 shadow lg:col-span-2`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Monthly Trends</h2>
              <div className={`${subtleText} text-sm`}>Primary: Red</div>
            </div>
            <div className="w-full h-[320px] sm:h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 8, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradV5" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={primary} stopOpacity={0.9} />
                      <stop offset="95%" stopColor={theme === "dark" ? "#0f172a" : "#ffffff"} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={chartGridStroke} strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: theme === "dark" ? "#CBD5E1" : "#374151" }} />
                  <YAxis tickFormatter={formatShort} tick={{ fill: theme === "dark" ? "#CBD5E1" : "#374151" }} />
                  <Tooltip wrapperStyle={{ background: theme === "dark" ? "#0f172a" : "#fff", borderRadius: 8, color: theme === "dark" ? "#fff" : "#111827" }} />
                  <Area type="monotone" dataKey="v5" stroke={primary} strokeWidth={2} fill="url(#gradV5)" />
                  <Area type="monotone" dataKey="v6" stroke="#f59e0b" strokeWidth={2} fillOpacity={0.2} />
                  <Area type="monotone" dataKey="v7" stroke="#3b82f6" strokeWidth={2} fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`${cardBg} rounded-2xl p-5 shadow`}>
              <h3 className="text-sm opacity-80 mb-2">Payroll Overview (Paid vs Unpaid)</h3>
              <div style={{ width: "100%", height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={payrollChartData} margin={{ top: 6, right: 6, left: 6, bottom: 6 }}>
                    <CartesianGrid stroke={chartGridStroke} strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fill: theme === "dark" ? "#CBD5E1" : "#374151" }} />
                    <YAxis tick={{ fill: theme === "dark" ? "#CBD5E1" : "#374151" }} />
                    <Tooltip wrapperStyle={{ background: theme === "dark" ? "#0f172a" : "#fff", borderRadius: 8, color: theme === "dark" ? "#fff" : "#111827" }} />
                    <Bar dataKey="value" fill={primary} radius={[6, 6, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`${cardBg} rounded-2xl p-5 shadow`}>
              <h3 className="text-sm opacity-80 mb-2">Works Per Day</h3>
              <div style={{ width: "100%", height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid stroke={chartGridStroke} strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fill: theme === "dark" ? "#CBD5E1" : "#374151" }} />
                    <YAxis tick={{ fill: theme === "dark" ? "#CBD5E1" : "#374151" }} />
                    <Tooltip wrapperStyle={{ background: theme === "dark" ? "#0f172a" : "#fff" }} />
                    <Bar dataKey="issues" fill={primary} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Reviews preview (top 3) */}
        <div className={`${theme === "dark" ? "bg-gray-950" : ""} rounded-lg mt-6`}>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Latest Reviews</h2>
              <Link
                to="/dashboard/reviews"
                className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition flex items-center gap-1"
              >
                View All Reviews <HiArrowSmRight />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topReviews.map((r) => (
                <div key={r._id} className={`${cardBg} p-4 rounded-xl shadow flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm line-clamp-1">{r.title || r.name}</h3>
                      {r.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {Array.from({ length: Math.max(0, Math.round(Number(r.rating || 0))) }).map((_, i) => (
                              <FaStar key={i} className="text-yellow-400 w-4 h-4" />
                            ))}
                          </div>
                          <span className="text-xs opacity-80">({r.rating})</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs opacity-70 line-clamp-3">{r.content || r.message}</p>
                  </div>
                  <div className="mt-3 text-xs opacity-60">By {r.name || "Anonymous"} • {r.date || "—"}</div>
                </div>
              ))}
              {topReviews.length === 0 && <div className="col-span-3 text-sm opacity-70 p-4">No reviews yet</div>}
            </div>

            {/* star distribution mini-chart */}
            <div className={`${cardBg} mt-4 p-3 rounded-xl shadow`}>
              <h3 className="text-sm font-semibold mb-2">Star Distribution</h3>
              <div style={{ width: "100%", height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={starDist} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis dataKey="star" tick={{ fill: theme === "dark" ? "#CBD5E1" : "#374151" }} />
                    <YAxis allowDecimals={false} tick={{ fill: theme === "dark" ? "#CBD5E1" : "#374151" }} />
                    <Tooltip />
                    <Bar dataKey="count" fill={primary} radius={[4, 4, 0, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Stat details modal (transparent bg + content) */}
        {statModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeStatModal}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <div className={`${cardBg} relative z-10 rounded-2xl max-w-4xl w-full p-4 shadow-lg shadow-red-500/10 hover:shadow-red-500/20`} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-red-500">{getStatIcon(statModalType)}</div>
                  <div>
                    <h3 className="text-xl font-semibold">{statModalType} Details</h3>
                    <p className="text-sm opacity-70">Details and breakdown for {statModalType}</p>
                  </div>
                </div>
                <button onClick={closeStatModal} className="text-sm px-2 py-1 rounded border"><MdClose /></button>
              </div>

           <div className="mt-4">
  {statModalType === 'Users' && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="font-medium mb-2 flex items-center gap-2 text-sm sm:text-base">
          <FaUsers /> Role distribution
        </h4>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                data={usersRoleDistribution.roleData}
                outerRadius={80}
                label
              >
                {usersRoleDistribution.roleData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2 flex items-center gap-2 text-sm sm:text-base">
          <MdVerified /> Verified vs Unverified
        </h4>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                data={usersRoleDistribution.verifiedData}
                outerRadius={80}
                label
              >
                {usersRoleDistribution.verifiedData.map((entry, index) => (
                  <Cell
                    key={`cellv-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User List */}
      <div className="md:col-span-2 mt-2">
        <h4 className="font-medium mb-2 flex items-center gap-2 text-sm sm:text-base">
          <FaList /> User list
        </h4>
        <div className="overflow-x-auto max-h-48 border rounded p-2">
          <table className="w-full text-xs sm:text-sm min-w-[500px]">
            <thead>
              <tr className="text-left">
                <th className="pr-2">Name</th>
                <th className="pr-2">Email</th>
                <th className="pr-2">Role</th>
                <th className="pr-2">Verified</th>
              </tr>
            </thead>
            <tbody>
              {(users || []).map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="pr-2 py-1">{u.name ? u.name : '—'}</td>
                  <td className="pr-2 py-1 flex items-center gap-1">
                    <FaEnvelope className="w-3 h-3 opacity-60" /> {u.email}
                  </td>
                  <td className="pr-2 py-1">{u.role || '—'}</td>
                  <td className="pr-2 py-1">{u.isVerified ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}

  {statModalType === 'Payroll' && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="font-medium flex items-center gap-2 text-sm sm:text-base">
          <FaMoneyBillWave /> Recent payrolls
        </h4>
        <div className="overflow-x-auto max-h-48 border rounded p-2 mt-2 text-xs sm:text-sm">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Salary</th>
                <th className="text-left">Paid</th>
              </tr>
            </thead>
            <tbody>
              {(payments || [])
                .slice()
                .reverse()
                .map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="py-1 flex items-center gap-1">
                      <FaUsers className="w-3 h-3 opacity-60" /> {p.name}
                    </td>
                    <td className="py-1">{p.email}</td>
                    <td className="py-1">{p.salary}</td>
                    <td className="py-1">
                      {p.paid ? (
                        <span className="text-green-500">Yes</span>
                      ) : (
                        <span className="text-red-400">No</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-sm sm:text-base">Summary</h4>
        <div className="mt-2 text-xs sm:text-sm">
          <div>Total payroll items: {(payments || []).length}</div>
          <div>Paid: {payments.filter((p) => p.paid).length}</div>
          <div>Unpaid: {payments.filter((p) => !p.paid).length}</div>
          <div className="mt-2">
            Total amount paid:{' '}
            {formatShort(
              (payments || []).reduce(
                (s, p) => s + (Number(p.salary) || 0),
                0
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )}

  {statModalType === 'Hours' && (
    <div>
      <h4 className="font-medium mb-2 flex items-center gap-2 text-sm sm:text-base">
        <FaClock /> Works and hours
      </h4>
      <div className="overflow-x-auto max-h-64 border rounded p-2 text-xs sm:text-sm">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr>
              <th className="text-left">Date</th>
              <th className="text-left">Name</th>
              <th className="text-left">Task</th>
              <th className="text-left">Hours</th>
            </tr>
          </thead>
          <tbody>
            {(works || [])
              .slice()
              .reverse()
              .map((w) => (
                <tr key={w._id} className="border-t">
                  <td className="py-1">{w.date}</td>
                  <td className="py-1">{w.name || w.userEmail}</td>
                  <td className="py-1">{w.task}</td>
                  <td className="py-1">{w.hours}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="mt-2 text-xs sm:text-sm">
          Total hours:{' '}
          {(works || []).reduce((s, w) => s + Number(w.hours || 0), 0)}
        </div>
      </div>
    </div>
  )}

  {statModalType === 'Works' && (
    <div>
      <h4 className="font-medium mb-2 flex items-center gap-2 text-sm sm:text-base">
        <FaTasks /> All works
      </h4>
      <div className="overflow-auto max-h-64 border rounded p-2 text-xs sm:text-sm">
        <ul className="space-y-2">
          {(works || [])
            .slice()
            .reverse()
            .map((w) => (
              <li key={w._id} className="p-2 border rounded">
                <div className="text-sm font-medium">
                  {w.task} — {w.name || w.userEmail}
                </div>
                <div className="text-xs opacity-70">
                  Date: {w.date} • Hours: {w.hours}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )}
</div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* Small UI helper */
function StatCard({ icon, label, value, smallChart, smallChartData, cardBg, theme, onClick }) {
  return (
    <button onClick={onClick} className={`${cardBg} rounded-2xl p-4 shadow transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20 flex items-center gap-4 text-left w-full`}>
      <div className="text-3xl text-red-500">{icon}</div>
      <div className="flex-1">
        <div className="text-sm opacity-70">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      {smallChart && (
        <div style={{ width: 80, height: 40 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={smallChartData || [{ name: "a", v: 0 }]}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="v" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </button>
  );
}

const UserList = ({ users }) => {
  return (
    <div>
      {users.map(user => (
        <div key={user._id} className="flex items-center gap-2">
          <span>{user.name}</span>
          {user.isVerified ? (
            <MdVerified className="text-green-500" title="Verified" />
          ) : (
            <MdClose className="text-red-500" title="Unverified" />
          )}
        </div>
      ))}
    </div>
  );
};
