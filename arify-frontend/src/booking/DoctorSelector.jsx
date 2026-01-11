export default function DoctorSelector({ doctors, onSelect }) {
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">Select Doctor</h2>

            <div className="grid grid-cols-1 gap-3">
                {doctors.map((d) => (
                    <button
                        key={d.id}
                        className="p-4 rounded-xl border bg-white hover:bg-gray-100"
                        onClick={() => onSelect(d)}
                    >
                        <div className="font-medium">{d.name}</div>
                        <div className="text-sm text-gray-600">{d.service}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
