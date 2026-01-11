export default function DoctorSelector({ doctors, onSelect }) {
    return (
        <div>
            <h2 className="text-xl font-medium mb-4">Select Doctor</h2>
            {doctors.map((d) => (
                <button
                    key={d.id}
                    onClick={() => onSelect(d)}
                    className="block w-full p-3 border rounded mb-2 hover:bg-blue-200"
                >
                    {d.name}
                </button>
            ))}
        </div>
    );
}

