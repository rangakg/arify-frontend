import { useState } from "react";

export default function Sidebar() {
    const [active, setActive] = useState("appointments");

    return (
        <aside className="w-64 bg-white shadow-md p-6 space-y-4">
            <h1 className="text-xl font-semibold text-blue-600">Arify Admin</h1>

            <nav className="space-y-2">
                <button
                    className={`block w-full text-left p-3 rounded ${active === "appointments"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-200"
                        }`}
                    onClick={() => setActive("appointments")}
                >
                    Appointments
                </button>

                <button
                    className={`block w-full text-left p-3 rounded ${active === "doctors"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-200"
                        }`}
                    onClick={() => setActive("doctors")}
                >
                    Doctors
                </button>

                <button
                    className={`block w-full text-left p-3 rounded ${active === "slots"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-200"
                        }`}
                    onClick={() => setActive("slots")}
                >
                    Slots
                </button>
            </nav>
        </aside>
    );
}
