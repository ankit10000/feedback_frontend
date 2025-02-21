import React, { useState, useEffect } from "react";
import axios from "axios";

const ShowFeedBackData = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/get_feedback");
                setEmployees(response.data.data);
                setFilteredEmployees(response.data.data);
            } catch (err) {
                setError("Failed to fetch feedback");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);
        
        const sortedData = [...filteredEmployees].sort((a, b) => {
            if (a[field] < b[field]) return order === "asc" ? -1 : 1;
            if (a[field] > b[field]) return order === "asc" ? 1 : -1;
            return 0;
        });
        setFilteredEmployees(sortedData);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filteredData = employees.filter((emp) =>
            Object.values(emp).some(value => value.toString().toLowerCase().includes(query))
        );
        setFilteredEmployees(filteredData);
    };

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const handleRowClick = (employee) => {
        setSelectedEmployee(employee);
    };

    const handleClosePopup = () => {
        setSelectedEmployee(null);
    };

    return (
        <div className="max-w-8xl mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white overflow-x-auto">
            <button onClick={() => window.location.href = '/'} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Back
            </button>
            <h2 className="text-xl font-bold mb-4">User Feedback</h2>
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="mb-4 p-2 border rounded w-full"
            />
            {loading && <p className="text-gray-600">Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => handleSort("app_version")}>App Version</th>
                            <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => handleSort("app_name")}>App Name</th>
                            <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => handleSort("date")}>Date</th>
                            <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => handleSort("description")}>Description</th>
                            <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => handleSort("email")}>Email</th>
                            <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => handleSort("rate_star")}>Rate Star</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((emp, index) => (
                                <tr key={index} className="hover:bg-gray-100 text-center cursor-pointer" onClick={() => handleRowClick(emp)}>
                                    <td className="border border-gray-300 p-2">{emp.app_version}</td>
                                    <td className="border border-gray-300 p-2">{emp.app_name}</td>
                                    <td className="border border-gray-300 p-2">{emp.date}</td>
                                    <td className="border border-gray-300 p-2">{emp.description}</td>
                                    <td className="border border-gray-300 p-2">{emp.email}</td>
                                    <td className="border border-gray-300 p-2">{emp.rate_star}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="border border-gray-300 p-2 text-center">No feedback found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
            {selectedEmployee && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Employee Details</h3>
                        <p><strong>_Id:</strong> {selectedEmployee._id}</p>
                        <p><strong>App Version:</strong> {selectedEmployee.app_version}</p>
                        <p><strong>App Name:</strong> {selectedEmployee.app_name}</p>
                        <p><strong>Date:</strong> {selectedEmployee.date}</p>
                        <p><strong>Description:</strong> {selectedEmployee.description}</p>
                        <p><strong>Device Model:</strong> {selectedEmployee.device_model}</p>
                        <p><strong>Device Token:</strong> {selectedEmployee.device_token}</p>
                        <p><strong>Email:</strong> {selectedEmployee.email}</p>
                        <p><strong>From Screen:</strong> {selectedEmployee.from_screen}</p>
                        <p><strong>Like/Dislike:</strong> {selectedEmployee.like_dislike}</p>
                        <p><strong>OS Version:</strong> {selectedEmployee.os_version}</p>
                        <p><strong>Rate Star:</strong> {selectedEmployee.rate_star}</p>
                        <p><strong>Timestamp:</strong> {new Date(selectedEmployee.timestamp).toLocaleString()}</p>
                        <button 
                            onClick={handleClosePopup} 
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowFeedBackData;