import React, { useState } from "react";

const Table = ({ columns = [], rows = [],totalPages, itemsPerPage = 10, onHandlePage }: any) => {
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {React.Children.toArray(
                            columns.map((c: any) => <th scope="col" className="px-6 py-3">{c.label}</th>)
                        )}
                    </tr>
                </thead>
                <tbody>
                    {React.Children.toArray(
                        rows.map((row: any, index: number) => {
                            return (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    {React.Children.toArray(
                                        columns.map((column: any) => (
                                            <td className="px-6 py-4 cursor-pointer">
                                                {row[column.key]}
                                            </td>
                                        ))
                                    )}
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>

            <div className="flex justify-center my-4">
                <nav>
                    <ul className="flex items-center">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li
                                key={index}
                                className={`mx-1 px-3 py-2 text-sm rounded-md cursor-pointer ${currentPage === index + 1 ? "bg-primary text-white" : ""
                                    }`}
                                onClick={() => {
                                    handlePageChange(index + 1);
                                    onHandlePage(index+1);
                                }}
                            >
                                {index + 1}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    )
};
export default Table;