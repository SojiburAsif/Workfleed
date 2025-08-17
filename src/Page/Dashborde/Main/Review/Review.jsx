import React, { useEffect, useMemo, useState, useContext } from "react";
import { Link } from "react-router";
import UseAxios from "../../../../Hooks/UseAxios";
import { ThemeContext } from "../../../../Theme/ThemeProvider";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { FaTrash, FaRegNewspaper, FaArrowLeft } from "react-icons/fa";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function ReviewsPage() {
    const axiosSecure = UseAxios();
    const { theme } = useContext(ThemeContext) || {};
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        let mounted = true;
        async function run() {
            try {
                const r = await axiosSecure.get("/reviews");
                if (!mounted) return;
                setReviews(Array.isArray(r.data) ? r.data : r.data?.data ?? []);
                console.log("Fetched reviews:", r.data);
            } catch (e) {
                setErr(e?.message || String(e));
            } finally {
                if (mounted) setLoading(false);
            }
        }
        run();
        return () => (mounted = false);
    }, [axiosSecure]);

    const starDist = useMemo(() => {
        const dist = [1, 2, 3, 4, 5].map((s) => ({ star: s, count: 0 }));
        (reviews || []).forEach((r) => {
            const s = Number(r.rating);
            if (s >= 1 && s <= 5) dist[s - 1].count += 1;
        });
        return dist;
    }, [reviews]);

    const wrapperBg = theme === "dark" ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900";
    const cardBg = theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900";
    const chartGridStroke = theme === "dark" ? "#111827" : "#E5E7EB";

    // swal delete
    async function deleteOne(id) {
        if (!id || !axiosSecure) return;

        const result = await MySwal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this review?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/reviews/${id}`);
                setReviews((prev) => prev.filter((r) => r._id !== id));
                MySwal.fire("Deleted!", "The review has been deleted.", "success");
            } catch (e) {
                MySwal.fire("Error!", "Failed to delete the review.", "error");
            }
        }
    }

    return (
        <div className={`${wrapperBg} min-h-screen p-6`}>
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FaRegNewspaper className="text-red-500" /> {/* icon added */}
                        All Reviews
                    </h1>

                    <Link
                        to="/dashboard"
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                    >
                        <FaArrowLeft /> Back to Dashboard
                    </Link>
                </div>

                {/* Star distribution chart */}
                <div className={`${cardBg} rounded-2xl p-5 shadow`}>
                    <h3 className="text-lg font-semibold mb-3">Star Rating Distribution</h3>
                    <div className="w-full h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={starDist}>
                                <CartesianGrid stroke={chartGridStroke} strokeDasharray="3 3" />
                                <XAxis dataKey="star" tickFormatter={(v) => `${v}★`} />
                                <YAxis allowDecimals={false} />
                                <Tooltip formatter={(v) => [`${v}`, "Reviews"]} labelFormatter={(l) => `${l}★`} />
                                <Legend />
                                <Bar dataKey="count" name="Reviews" fill="#ef4444" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Reviews list */}
                <div className={`${cardBg} rounded-2xl p-5 shadow`}>
                    {loading && <div className="text-sm opacity-70">Loading…</div>}
                    {err && <div className="text-sm text-red-500">{err}</div>}
                    <div className="grid gap-4">
                        {(reviews || []).map((r) => (
                            <div
                                key={r._id}
                                className="p-4 border border-black/10 dark:border-white/10 rounded-xl flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg">{r.title || r.name}</h3>
                                        {r.rating && <span className="text-yellow-500">{"⭐".repeat(Number(r.rating))}</span>}
                                    </div>
                                    <div className="text-sm opacity-60">
                                        By {r.name || "Anonymous"} • {r.date || "—"}
                                    </div>
                                    <p className="mt-2 text-sm opacity-90 max-w-3xl">{r.content || r.message}</p>
                                </div>
                                <button
                                    onClick={() => deleteOne(r._id)}
                                    className="self-start shrink-0 px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        ))}
                        {(reviews || []).length === 0 && !loading && (
                            <div className="text-sm opacity-70">No reviews found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
