import { useState } from "react";
import DoctorSelector from "./DoctorSelector";
import DateSelector from "./DateSelector";
import SlotGroupSelector from "./SlotGroupSelector";
import SlotSelector from "./SlotSelector";
import Confirmation from "./Confirmation";

export default function BookingPage() {
    const [doctor, setDoctor] = useState(null);
    const [date, setDate] = useState(null);
    const [slotGroup, setSlotGroup] = useState(null);
    const [slot, setSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const resetFrom = (level) => {
        if (level <= 1) setDoctor(null);
        if (level <= 2) setDate(null);
        if (level <= 3) setSlotGroup(null);
        if (level <= 4) setSlot(null);
    };

    const handleConfirm = async (payload) => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/appointments/draft", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    doctorId: doctor.id,
                    slot,
                    ...payload
                })
            });

            if (!res.ok) throw new Error("Failed to create booking");

            const data = await res.json();

            // Redirect to Cashfree
            window.location.href = data.paymentLink;
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6">Book Appointment</h1>

            {/* Step 1: Doctor */}
            {!doctor && (
                <DoctorSelector onSelect={setDoctor} />
            )}

            {/* Step 2: Date */}
            {doctor && !date && (
                <DateSelector
                    doctor={doctor}
                    onSelect={setDate}
                    onBack={() => resetFrom(1)}
                />
            )}

            {/* Step 3: Slot Group */}
            {doctor && date && !slotGroup && (
                <SlotGroupSelector
                    doctor={doctor}
                    date={date}
                    onSelect={setSlotGroup}
                    onBack={() => resetFrom(2)}
                />
            )}

            {/* Step 4: Slot */}
            {slotGroup && !slot && (
                <SlotSelector
                    slotGroup={slotGroup}
                    onSelect={setSlot}
                    onBack={() => resetFrom(3)}
                />
            )}

            {/* Step 5: Confirmation */}
            {slot && (
                <Confirmation
                    doctor={doctor}
                    date={date}
                    slot={slot}
                    onBack={() => resetFrom(4)}
                    onConfirm={handleConfirm}
                    loading={loading}
                    error={error}
                />
            )}
        </div>
    );
}
