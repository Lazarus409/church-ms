"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    api
      .get("/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-700">ChurchMS</h1>
        <div className="flex gap-4">
          <a href="/members" className="text-gray-600 hover:text-blue-600">
            Members
          </a>
          <a href="/attendance" className="text-gray-600 hover:text-blue-600">
            Attendance
          </a>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Members"
            value={stats?.total_members}
            color="blue"
          />
          <StatCard
            label="Active Members"
            value={stats?.active_members}
            color="green"
          />
          <StatCard
            label="Inactive Members"
            value={stats?.inactive_members}
            color="red"
          />
          <StatCard
            label="Total Services"
            value={stats?.total_services}
            color="purple"
          />
        </div>

        {/* Attendance Trend */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Attendance
          </h3>
          {stats?.attendance_trend?.length === 0 ? (
            <p className="text-gray-400">No attendance data yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Service</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Present</th>
                </tr>
              </thead>
              <tbody>
                {stats?.attendance_trend?.map((row, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2">{row.service}</td>
                    <td className="py-2">{row.date}</td>
                    <td className="py-2 font-medium text-green-600">
                      {row.present}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <div className={`rounded-2xl p-6 ${colors[color]} shadow`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-4xl font-bold mt-2">{value ?? 0}</p>
    </div>
  );
}
