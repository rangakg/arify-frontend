import { useEffect, useState } from "react";

export default function BookingPage() {
    const [step, setStep] = useState("doctors");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [doctors, setDoctors] = useState([]);
    const [doctor, setDoctor] = useState(null);

    const [dates, setDates] = useState([]);
    const [date, setDate] = useState(null);

    const [groups, setGroups] = useState([]);
    const [group, setGroup] = useState(null);

    const [slots, setSlots] = useState([]);
    const [slot, setSlot] = useState(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    // ------------------------------
    // LOADING SKELETON
    // ------------------------------
    const Skeleton = ({ className }) => (
        <div className={`animate-pulse bg-gray-300/30 rounded-xl ${className}`}></div>
    );

    // ------------------------------------------------------
    // FETCH DOCTORS
    // ------------------------------------------------------
    useEffect(() => {
        setLoading(true);
        fetch("/api/doctors")
            .then((res) => res.json())
            .then((data) => {
                setDoctors(data);
            })
            .catch(() => setError("Unable to load doctors"))
            .finally(() => setLoading(false));
    }, []);

    // ------------------------------------------------------
    const selectDoctor = async (doc) => {
        setDoctor(doc);
        setLoading(true);

        try {
            const res = await fetch(`/api/doctors/${doc.id}/dates`);
            const list = await res.json();
            setDates(list);
            setStep("dates");
        } catch {
            setError("Failed to load dates");
        }
        setLoading(false);
    };

    const selectDate = async (d) => {
        setDate(d);
        setLoading(true);

        try {
            const res = await fetch(`/api/doctors/${doctor.id}/dates/${d}/slot-groups`);
            const list = await res.json();
            setGroups(list);
            setStep("groups");
        } catch {
            setError("Failed to load slot groups");
        }
        setLoading(false);
    };

    const selectGroup = async (g) => {
        setGroup(g);
        setLoading(true);

        try {
            const res = await fetch(
                `/api/doctors/${doctor.id}/dates/${date}/slot-groups/${g}/slots`
            );
            const list = await res.json();
            setSlots(list);
            setStep("slots");
        } catch {
            setError("Failed to load slots");
        }
        setLoading(false);
    };

    const selectSlot = (s) => {
        setSlot(s);
        setStep("details");
    };

    // ------------------------------------------------------
    // CREATE DRAFT & GO TO PAYMENT
    // ------------------------------------------------------
    async function createDraftAndPay() {
        if (!name.trim() || !phone.trim()) {
            setError("Enter patient name & phone");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await fetch("/api/bookings/draft", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    doctorId: doctor.id,
                    slotId: slot.id,
                    name,
                    phone,
                }),
            });

            window.location.href =
                `https://payments.cashfree.com/forms/arify3` +
                `?phone=${phone}&doctorId=${doctor.id}&slotId=${slot.id}`;
        } catch {
            setError("Failed to create draft booking");
        }

        setLoading(false);
    }

    // ------------------------------------------------------
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-6 flex justify-center">
            <div className="w-full max-w-xl">
                <h1 className="text-3xl font-bold text-center mb-6 bg-white/40 backdrop-blur-xl p-4 rounded-2xl shadow">
                    Arify Admin Booking
                </h1>

                {error && (
                    <div className="p-3 mb-4 bg-red-200 text-red-900 rounded-xl shadow">
                        {error}
                    </div>
                )}

                {/* ------------------------- */}
                {/* STEP 1: Doctor Selection */}
                {/* ------------------------- */}
                {step === "doctors" && (
                    <div className="grid gap-4">
                        {loading
                            ? Array(4)
                                .fill(0)
                                .map((_, i) => <Skeleton key={i} className="h-20" />)
                            : doctors.map((d) => (
                                <button
                                    key={d.id}
                                    className="p-5 bg-white/40 backdrop-blur-xl border border-white/20 
                               rounded-2xl shadow-md hover:scale-[1.02] 
                               transition-all text-left"
                                    onClick={() => selectDoctor(d)}
                                >
                                    <div className="font-semibold text-lg">{d.name}</div>
                                    <div className="text-sm text-gray-700">{d.service}</div>
                                </button>
                            ))}
                    </div>
                )}

                {/* ------------------------- */}
                {/* STEP 2: Date Selection */}
                {/* ------------------------- */}
                {step === "dates" && (
                    <div className="grid gap-3">
                        {dates.map((d) => (
                            <button
                                key={d}
                                className="p-4 bg-white/40 backdrop-blur-xl rounded-xl hover:bg-white 
                           transition shadow text-gray-900 font-medium"
                                onClick={() => selectDate(d)}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                )}

                {/* ------------------------- */}
                {/* STEP 3: Group Selection */}
                {/* ------------------------- */}
                {step === "groups" && (
                    <div className="grid gap-3">
                        {groups.map((g) => (
                            <button
                                key={g}
                                className="p-4 bg-white/40 backdrop-blur-xl rounded-xl hover:bg-white 
                           transition shadow"
                                onClick={() => selectGroup(g)}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                )}

                {/* ------------------------- */}
                {/* STEP 4: Slot Selection */}
                {/* ------------------------- */}
                {step === "slots" && (
                    <div className="grid grid-cols-2 gap-3">
                        {slots.map((s) => (
                            <button
                                key={s.id}
                                className="p-4 bg-white/40 backdrop-blur-xl rounded-xl hover:bg-white 
                           shadow transition text-center"
                                onClick={() => selectSlot(s)}
                            >
                                {s.time}
                            </button>
                        ))}
                    </div>
                )}

                {/* ------------------------- */}
                {/* STEP 5: Details + Payment */}
                {/* ------------------------- */}
                {step === "details" && (
                    <div className="space-y-4">
                        <div className="bg-white/50 backdrop-blur-xl p-4 rounded-2xl shadow">
                            <div><b>Doctor:</b> {doctor.name}</div>
                            <div><b>Date:</b> {date}</div>
                            <div><b>Time:</b> {slot.time}</div>
                        </div>

                        <input
                            className="w-full p-3 rounded-xl border bg-white/50 backdrop-blur-xl"
                            placeholder="Patient Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            className="w-full p-3 rounded-xl border bg-white/50 backdrop-blur-xl"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />

                        <button
                            onClick={createDraftAndPay}
                            className="w-full p-4 bg-blue-600 text-white text-lg rounded-2xl
                         hover:bg-blue-700 transition shadow-lg"
                        >
                            Confirm & Continue to Payment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
