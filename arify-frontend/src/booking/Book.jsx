import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    getAvailableDates,
    getAvailableGroups,
    getSlotsForGroup
} from "./slotLogic.js";

export default function Book() {
    const [params] = useSearchParams();
    const phone = params.get("phone");

    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState([]);

    const [doctorId, setDoctorId] = useState("");
    const [date, setDate] = useState("");
    const [group, setGroup] = useState("");
    const [slotId, setSlotId] = useState("");

    const [error, setError] = useState("");
    const [confirming, setConfirming] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    // --------------------------------------------------
    // HARD GUARD
    // --------------------------------------------------
    if (!phone) {
        return (
            <div className="max-w-md mx-auto p-4 text-red-600">
                Invalid booking link. Please open this link from WhatsApp.
            </div>
        );
    }

    // --------------------------------------------------
    // LOAD DOCTORS
    // --------------------------------------------------
    useEffect(() => {
        fetch("/api/booking/doctors")
            .then(r => r.json())
            .then(setDoctors)
            .catch(() => setError("Failed to load doctors"));
    }, []);

    // --------------------------------------------------
    // SELECT DOCTOR → SET SESSION STATE (CRITICAL)
    // --------------------------------------------------
    useEffect(() => {
        if (!doctorId) return;

        fetch("/api/booking/select-doctor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, doctorId })
        });

        setDate("");
        setGroup("");
        setSlotId("");
        setConfirmed(false);
        setSlots([]);

        fetch(`/api/booking/slots/all?doctorId=${doctorId}&phone=${phone}`)
            .then(r => r.json())
            .then(setSlots)
            .catch(() => setError("Failed to load slots"));

    }, [doctorId, phone]);

    // --------------------------------------------------
    // DERIVED (V1 LOGIC)
    // --------------------------------------------------
    const dates = useMemo(() => getAvailableDates(slots), [slots]);
    const groups = useMemo(() => date ? getAvailableGroups(slots, date) : [], [slots, date]);
    const filteredSlots = useMemo(() => group ? getSlotsForGroup(slots, date, group) : [], [slots, date, group]);

    // --------------------------------------------------
    // CONFIRM BOOKING
    // --------------------------------------------------
    async function confirmBooking() {
        if (confirming) return;

        setConfirming(true);
        setError("");

        try {
            const res = await fetch("/api/booking/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, slotId })
            });

            if (!res.ok) throw new Error();
            setConfirmed(true);

        } catch {
            setError("Slot already booked or session expired.");
        } finally {
            setConfirming(false);
        }
    }

    // --------------------------------------------------
    // UI
    // --------------------------------------------------
    if (error) {
        return <div className="text-red-600 max-w-md mx-auto p-4">{error}</div>;
    }

    if (confirmed) {
        return (
            <div className="max-w-md mx-auto p-4 text-green-700 text-center">
                <h2 className="text-xl font-bold mb-2">Almost done!</h2>
                <p>✅ Slot locked.<br />📲 Check WhatsApp to pay.</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-4 space-y-4">
            <h1 className="text-xl font-bold">Book Appointment</h1>

            <select value={doctorId} onChange={e => setDoctorId(e.target.value)}>
                <option value="">Select Doctor</option>
                {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                ))}
            </select>

            {dates.length > 0 && (
                <select value={date} onChange={e => { setDate(e.target.value); setGroup(""); }}>
                    <option value="">Select Date</option>
                    {dates.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            )}

            {groups.length > 0 && (
                <select value={group} onChange={e => setGroup(e.target.value)}>
                    <option value="">Select Time Range</option>
                    {groups.includes("morning") && <option value="morning">Morning</option>}
                    {groups.includes("before_lunch") && <option value="before_lunch">Before Lunch</option>}
                    {groups.includes("after_lunch") && <option value="after_lunch">After Lunch</option>}
                    {groups.includes("evening") && <option value="evening">Evening</option>}
                    {groups.includes("late_evening") && <option value="late_evening">Late Evening</option>}
                </select>
            )}

            {filteredSlots.length > 0 && (
                <select value={slotId} onChange={e => setSlotId(e.target.value)}>
                    <option value="">Select Slot</option>
                    {filteredSlots.map(s => (
                        <option key={s.id} value={s.id}>
                            {new Date(s.slot).toLocaleTimeString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true
                            })}
                        </option>
                    ))}
                </select>
            )}

            {slotId && (
                <button
                    onClick={confirmBooking}
                    disabled={confirming}
                    className="w-full bg-green-600 text-white py-2 rounded"
                >
                    {confirming ? "Confirming…" : "Confirm Booking"}
                </button>
            )}
        </div>
    );
}
