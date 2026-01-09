export default function DateSelector({ doctor, dates, onSelect }) {
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">
                Select Date for {doctor.name}
            </h2>

            <div className="grid grid-cols-2 gap-3">
                {dates.map((date) => (
                    <button
                        key={date}
                        className="p-3 rounded-xl border bg-white hover:bg-gray-100"
                        onClick={() => onSelect(date)}
                    >
                        {date}
                    </button>
                ))}
            </div>
        </div>
    );
}
