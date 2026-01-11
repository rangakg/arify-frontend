export default function Table({ columns, data }) {
    return (
        <table className="w-full bg-white shadow rounded overflow-hidden">
            <thead className="bg-gray-100 text-left">
                <tr>
                    {columns.map((col) => (
                        <th key={col} className="p-3 font-medium">{col}</th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {data.map((row, i) => (
                    <tr key={i} className="border-t">
                        {columns.map((col) => (
                            <td key={col} className="p-3">{row[col]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
