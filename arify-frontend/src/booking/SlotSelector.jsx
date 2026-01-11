export default function SlotSelector({ doctor, date, group, slots, onSelect }) {
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">Select Slot</h2>

            <div className="grid grid-cols-2 gap-3">
                {slots.map((slot) => (
                    <button
                        key={slot.id}
                        className="p-3 rounded-xl border bg-white hover:bg-gray-100"
                        onClick={() => onSelect(slot)}
                    >
                        {slot.time}
                    </button>
                ))}
            </div>
        </div>
    );
}
