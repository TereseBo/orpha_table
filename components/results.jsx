"use client";
export function Results() {
    return (
        <div className="flex flex-row m-8 p-8 bg-white rounded">
            <table className="table-auto border border-slate-400">
                <thead>
                    <tr>
                        <th className="border border-slate-400 p-2" scope="col">ORPHAcode</th>
                        <th className="border border-slate-400 p-2" scope="col">ICD-10</th>
                        <th className="border border-slate-400 p-2" scope="col">Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-slate-400 px-2">ORPHA:166024</td>
                        <td className="border border-slate-400 px-2">Q87.1</td>
                        <td className="border border-slate-400 px-2">Albinism-deafness syndrome</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}