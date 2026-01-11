export default function Confirmation({
    doctor,
    date,
    group,
    slot,
    name,
    phone,
    setName,
    setPhone,
    onSubmit,
}) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-medium">Confirm Details</h2>

            <div>Doctor: {doctor.name}</div>
            <div>Date: {date}</div>
            <div>Group: {group}</div>
            <div>Time: {slot.time}</div>

            <input
                className="border p-2 w-full"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                className="border p-2 w-full"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <button
                onClick={onSubmit}
                className="w-full p-3 bg-green-600 text-white rounded"
            >
                Confirm & Proceed to Payment
            </button>
        </div>
    );
}
