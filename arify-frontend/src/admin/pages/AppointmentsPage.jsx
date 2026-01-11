import { useEffect, useState } from "react";
import Table from "../components/Table";

export default function AppointmentsPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/appointments")   // <-- Backend endpoint we will add next
            .then((res) => res.json())
            .then((list) => setData(list))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading…</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Appointments</h2>

            <Table
                columns={["id", "name", "phone", "doctor", "date", "time", "status"]}
                data={data}
            />
        </div>
    );
}
