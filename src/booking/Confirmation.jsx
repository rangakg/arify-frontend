export default function Confirmation({ doctor, date, slot, onConfirm }) {
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">Confirm Appointment</h2>

            <div className="bg-white p-4 rounded-xl border mb-4">
                <div className="mb-1"><b>Doctor:</b> {doctor.name}</div>
                <div className="mb-1"><b>Date:</b> {date}</div>
                <div className="mb-1"><b>Time:</b> {slot.time}</div>
            </div>

            <button
                onClick={onConfirm}
                className="w-full p-3 bg-blue-500 text-white rounded-xl"
            >
                Confirm & Continue
            </button>
        </div>
    );
}
