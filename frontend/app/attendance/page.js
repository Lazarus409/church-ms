"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AttendancePage() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    scheduled_date: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchMembers();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/attendance/services");
      setServices(res.data);
    } catch {
      router.push("/login");
    }
  };

  const fetchMembers = async () => {
    const res = await api.get("/members/");
    setMembers(res.data);
    const initial = {};
    res.data.forEach((m) => (initial[m.id] = "present"));
    setAttendance(initial);
  };

  const handleCreateService = async () => {
    setSaving(true);
    try {
      await api.post("/attendance/services", serviceForm);
      setShowServiceForm(false);
      setServiceForm({ name: "", scheduled_date: "" });
      fetchServices();
    } catch {
      alert("Error creating service");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!selectedService) return alert("Select a service first");
    setSaving(true);
    try {
      const records = members.map((m) => ({
        member_id: m.id,
        status: attendance[m.id] || "absent",
      }));
      await api.post("/attendance/mark", {
        service_id: selectedService,
        records,
      });
      alert("Attendance saved!");
    } catch {
      alert("Error saving attendance");
    } finally {
      setSaving(false);
    }
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
          <a href="/members" className="text-gray-600 hover:text-blue-600">
            Members
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

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Attendance</h2>
          <button
            onClick={() => setShowServiceForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + New Service
          </button>
        </div>

        {/* New Service Form */}
        {showServiceForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Create Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Service name (e.g. Sunday Service)"
                value={serviceForm.name}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, name: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={serviceForm.scheduled_date}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    scheduled_date: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleCreateService}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Create Service"}
              </button>
              <button
                onClick={() => setShowServiceForm(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Select Service */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedService(s.id)}
                className={`p-4 rounded-xl border-2 text-left transition ${
                  selectedService === s.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-gray-500">{s.scheduled_date}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Mark Attendance */}
        {members.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Mark Attendance</h3>
            <div className="space-y-3">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <span className="font-medium">{m.full_name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setAttendance({ ...attendance, [m.id]: "present" })
                      }
                      className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                        attendance[m.id] === "present"
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-green-100"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() =>
                        setAttendance({ ...attendance, [m.id]: "absent" })
                      }
                      className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                        attendance[m.id] === "absent"
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-red-100"
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleMarkAttendance}
              disabled={saving}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
