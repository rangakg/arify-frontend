
import { useEffect, useState } from "react";

export default function AppointmentsPage() {
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);

    const [doctors, setDoctors] = useState([]);
    const [filters, setFilters] = useState({
        doctor: "",
        status: "",
        date: "",
        search: "",
    });

    // ------------------------------------------------------
    // FETCH INITIAL DATA
    // ------------------------------------------------------
    useEffect(() => {
        loadDoctors();
        loadAppointments();
    }, []);

    // LOAD DOCTORS
    async function loadDoctors() {
        try {
            const res = await fetch("/api/doctors");
            const data = await res.json();
            setDoctors(data);
        } catch (e) {
            console.error("Failed to load doctors");
        }
    }

    // LOAD APPOINTMENTS (from Supabase view or API endpoint)
    async function loadAppointments() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/appointments"); // You will create backend endpoint
            const data = await res.json();
            setAppointments(data);
        } catch (e) {
            console.error("Failed to fetch appointments");
        }
        setLoading(false);
    }

    // FILTER LOGIC
    const filtered = appointments.filter((a) => {
        const s = filters.search.toLowerCase();
        const matchesSearch =
            a.userName.toLowerCase().includes(s) ||
            a.phone.includes(s) ||
            a.doctorName.toLowerCase().includes(s);

        const matchesDoctor = !filters.doctor || a.doctorId === Number(filters.doctor);
        const matchesStatus = !filters.status || a.status === filters.status;
        const matchesDate = !filters.date || a.slot.startsWith(filters.date);

        return matchesSearch && matchesDoctor && matchesStatus && matchesDate;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white p-6">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <h1 className="text-3xl font-bold mb-6 bg-white/40 backdrop-blur-xl p-4 rounded-2xl shadow">
                    Admin — Appointments
                </h1>

                {/* FILTER BAR */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

                    {/* Search */}
                    <input
                        className="p-3 rounded-xl border bg-white/60"
                        placeholder="Search patient / phone / doctor"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />

                    {/* Doctor Filter */}
                    <select
                        className="p-3 rounded-xl border bg-white/60"
                        value={filters.doctor}
                        onChange={(e) => setFilters({ ...filters, doctor: e.target.value })}
                    >
                        <option value="">All Doctors</option>
                        {doctors.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        className="p-3 rounded-xl border bg-white/60"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="closed">Closed</option>
                    </select>

                    {/* Date Filter */}
                    <input
                        type="date"
                        className="p-3 rounded-xl border bg-white/60"
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    />
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto rounded-2xl shadow bg-white/70 backdrop-blur-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-200/70">
                                <th className="p-3">Patient</th>
                                <th className="p-3">Phone</th>
                                <th className="p-3">Doctor</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Time</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                [...Array(6)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="p-3 bg-gray-200/50"> </td>
                                        <td className="p-3 bg-gray-200/50"> </td>
                                        <td className="p-3 bg-gray-200/50"> </td>
                                        <td className="p-3 bg-gray-200/50"> </td>
                                        <td className="p-3 bg-gray-200/50"> </td>
                                        <td className="p-3 bg-gray-200/50"> </td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-6 text-gray-500">
                                        No appointments found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((a) => (
                                    <tr key={a.id} className="border-t hover:bg-slate-100 transition">
                                        <td className="p-3">{a.userName}</td>
                                        <td className="p-3">{a.phone}</td>
                                        <td className="p-3">{a.doctorName}</td>
                                        <td className="p-3">{a.slot.substring(0, 10)}</td>
                                        <td className="p-3">
                                            {new Date(a.slot).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`px-3 py-1 rounded-xl text-sm font-semibold ${a.status === "paid"
                                                    ? "bg-green-200 text-green-900"
                                                    : a.status === "pending"
                                                        ? "bg-yellow-200 text-yellow-900"
                                                        : "bg-gray-300 text-gray-900"
                                                    }`}
                                            >
                                                {a.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


