"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    date_joined: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/members/");
      setMembers(res.data);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearch(val);
    const res = await api.get(`/members/?search=${val}`);
    setMembers(res.data);
  };

  const handleAdd = async () => {
    setSaving(true);
    try {
      await api.post("/members/", form);
      setShowForm(false);
      setForm({
        full_name: "",
        phone: "",
        email: "",
        address: "",
        date_joined: "",
      });
      fetchMembers();
    } catch (err) {
      alert("Error adding member");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this member?")) return;
    await api.delete(`/members/${id}`);
    fetchMembers();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-700">ChurchMS</h1>
        <div className="flex gap-4">
          <a href="/dashboard" className="text-gray-600 hover:text-blue-600">
            Dashboard
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

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Members</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Member
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={handleSearch}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Add Member Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">New Member</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["full_name", "phone", "email", "address"].map((field) => (
                <input
                  key={field}
                  placeholder={field.replace("_", " ")}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
              <input
                type="date"
                value={form.date_joined}
                onChange={(e) =>
                  setForm({ ...form, date_joined: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAdd}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Member"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Members Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {loading ? (
            <p className="p-6 text-gray-400">Loading...</p>
          ) : members.length === 0 ? (
            <p className="p-6 text-gray-400">
              No members yet. Add your first member.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">{m.full_name}</td>
                    <td className="px-6 py-3">{m.phone || "—"}</td>
                    <td className="px-6 py-3">{m.email || "—"}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          m.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">{m.date_joined || "—"}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Delete
                      </button>
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
