export default function SlotGroupSelector({ doctor, date, groups, onSelect }) {
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">
                Select Time of Day — {date}
            </h2>

            <div className="flex flex-col gap-3">
                {groups.map((group) => (
                    <button
                        key={group}
                        className="p-4 rounded-xl border bg-white hover:bg-gray-100"
                        onClick={() => onSelect(group)}
                    >
                        {group}
                    </button>
                ))}
            </div>
        </div>
    );
}
