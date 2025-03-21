import React, { useState, useEffect } from "react";
import axios from "axios";
import { GrView } from "react-icons/gr";

const ShowFeedBackData = () => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [replyEmployee, setReplyEmployee] = useState(null);
    const [viewreplyEmployee, setViewReplyEmployee] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const [replyMessage, setReplyMessage] = useState("");

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get("https://backend-2l3h.onrender.com/api/notepad/get_feedback");
                console.log("Feedback API Response:", response.data);
                const feedbacks = response.data?.data || [];
    
                if (feedbacks.length === 0) {
                    setError("No feedback data available.");
                }
    
                const feedbackIds = feedbacks.map(fb => fb._id);
                const replies = await Promise.all(
                    feedbackIds.map(id =>
                        axios
                            .get(`https://backend-2l3h.onrender.com/api/reply/replies-by-feedback?feedbackId=${id}`)
                            .then(response => ({ feedbackId: id, replies: response.data?.data || [] }))
                            .catch(error => ({ feedbackId: id, error: error.message }))
                    )
                );
    
                feedbacks.forEach(fb => {
                    const reply = replies.find(r => r.feedbackId === fb._id);
                    fb.replies = reply?.replies || [];
                    fb.error = reply?.error;
                });
    
                setEmployees(feedbacks);
                setFilteredEmployees(feedbacks);
            } catch (err) {
                console.error("Error fetching feedback:", err);
                setError("Failed to fetch feedback.");
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

        setFilteredEmployees((prev) =>
            [...prev].sort((a, b) => (a[field] < b[field] ? (order === "asc" ? -1 : 1) : (a[field] > b[field] ? (order === "asc" ? 1 : -1) : 0)))
        );
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredEmployees(employees.filter(emp =>
            Object.values(emp).some(value => value?.toString().toLowerCase().includes(query))
        ));
    };

    const handleRowClick = (employee) => {
        setSelectedEmployee(employee);
      };
    const handleClosePopup = () => {
        setSelectedEmployee(null);
        setReplyEmployee(null);
        setViewReplyEmployee(null);
    
      };
    const handleReply = (employee) => {
        setReplyEmployee(employee);
        setSelectedEmployee(null);  
        setReplyMessage("");
      };

    const submitReplies = async () => {
        if (!replyMessage.trim()) return alert("Reply message cannot be empty.");

        try {
            const { data } = await axios.post("https://backend-2l3h.onrender.com/api/reply/send-reply", {
                email: replyEmployee.email,
                subject: "Feedback Reply",
                message: replyMessage,
                feedbackId: replyEmployee._id,
            });

            data.message ? alert("Reply sent successfully!") : alert("Failed to send reply.");
            setReplyEmployee(null);
            setReplyMessage("");
        } catch {
            alert("Error sending reply.");
        }
    };

    const handleViewReply = async (employee) => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `https://backend-2l3h.onrender.com/api/reply/replies-by-feedback?feedbackId=${employee._id}`
            );
            setViewReplyEmployee({ ...employee, replies: data.success ? data.data : [] });
        } catch {
            alert("Error fetching replies.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="max-w-8xl mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white overflow-x-auto">

            <h2 className="text-xl font-bold mb-4">App Feedback</h2>
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="mb-4 p-2 border rounded w-full"
            />
            {loading && 
                <div className="flex justify-center items-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            }
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
                            <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => handleSort("report")}>Report</th>
                            <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => handleSort("fraq")}>Freq Ask</th>

                            <th className="border border-gray-300 p-2 cursor-pointer">Reply</th>
                            <th className="border border-gray-300 p-2 cursor-pointer">All Replies</th>
                            <th className="border border-gray-300 p-2 cursor-pointer">Last Reply</th>
                            <th className="border border-gray-300 p-2 cursor-pointer">Reply Date</th>

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
                                    <td className="border border-gray-300 p-2">{(emp.report ? emp.report : "null")}</td>
                                    <td className="border border-gray-300 p-2">{(emp.fraq ? emp.fraq : "null")}</td>
                                    <td className="border border-gray-300 p-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleReply(emp);
                                            }}
                                            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                        >
                                            Reply
                                        </button>

                                    </td>
                                    <td className="border border-gray-300 p-2"><button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewReply(emp);
                                        }}
                                        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                    >
                                        <GrView />
                                    </button></td>
                                    <td className="border border-gray-300 p-2">
                                        {emp.replies && emp.replies.length > 0
                                            ? emp.replies[emp.replies.length - 1]?.message
                                            : "No replies"}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {emp.replies && emp.replies.length > 0
                                            ? new Date(emp.replies[emp.replies.length - 1]?.timestamp).toLocaleString()
                                            : "No replies"}
                                    </td>
                                    {/* <td className="border border-gray-300 p-2">{emp.replyTimestamp}</td> */}


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
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h3 className="text-2xl font-semibold mb-4 text-center">Employee Details</h3>
                        <table className="w-full border-collapse border border-gray-300">
                            <tbody>
                                <tr><td className="border border-gray-300 p-2 font-semibold">_Id</td><td className="border border-gray-300 p-2">{selectedEmployee._id}</td></tr>
                                <tr><td className="border border-gray-300 p-2 font-semibold">App Version</td><td className="border border-gray-300 p-2">{selectedEmployee.app_version}</td></tr>
                                <tr><td className="border border-gray-300 p-2 font-semibold">App Name</td><td className="border border-gray-300 p-2">{selectedEmployee.app_name}</td></tr>
                                <tr><td className="border border-gray-300 p-2 font-semibold">Date</td><td className="border border-gray-300 p-2">{selectedEmployee.date}</td></tr>
                                <tr><td className="border border-gray-300 p-2 font-semibold">Description</td><td className="border border-gray-300 p-2">{selectedEmployee.description}</td></tr>
                                <tr><td className="border border-gray-300 p-2 font-semibold">Device Model</td><td className="border border-gray-300 p-2">{selectedEmployee.device_model}</td></tr>
                                <tr><td className="border border-gray-300 p-2 font-semibold">Device Token</td><td className="border border-gray-300 p-2">{selectedEmployee.device_token}</td></tr>
                                <tr><td className="border border-gray-300 p-2 font-semibold">Email</td><td className="border border-gray-300 p-2">{selectedEmployee.email}</td></tr>
                                <tr><td className="border border-gray-300 p-2 font-semibold">From Screen</td><td className="border border-gray-300 p-2">{selectedEmployee.from_screen}</td></tr>
                                <tr><td className="border border-gray-300 p-2 font-semibold">Like/Dislike</td><td className="border border-gray-300 p-2">{selectedEmployee.like_dislike}</td></tr>
                                <tr><td className="border border-gray-300 p-2 font-semibold">OS Version</td><td className="border border-gray-300 p-2">{selectedEmployee.os_version}</td></tr>
                                <tr><td className="border border-gray-300 p-2 font-semibold">Rate Star</td><td className="border border-gray-300 p-2">{selectedEmployee.rate_star}</td></tr>
                                <tr><td className="border border-gray-300 p-2 font-semibold">Report</td><td className="border border-gray-300 p-2">{selectedEmployee.report}</td></tr>
                                <tr><td className="border border-gray-300 p-2 font-semibold">FAQ</td><td className="border border-gray-300 p-2">{selectedEmployee.fraq}</td></tr>
                                <tr><td className="border border-gray-300 p-2 font-semibold">Timestamp</td><td className="border border-gray-300 p-2">{new Date(selectedEmployee.timestamp).toLocaleString()}</td></tr>
                            </tbody>
                        </table>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={handleClosePopup}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {replyEmployee && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h3 className="text-2xl font-semibold mb-4 text-center">Enter Description</h3>
                        <div className="grid">
                            <label htmlFor="description">{replyEmployee.email}</label>
                            <textarea
                                id="description"
                                name="description"
                                className="border border-gray-300 p-2 w-full my-5"
                                rows={10}
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={submitReplies}
                                className="px-4 py-2 mr-4 bg-blue-500 text-white rounded hover:bg-blue-700"
                            >
                                Submit Reply
                            </button>
                            <button
                                onClick={handleClosePopup}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {viewreplyEmployee && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h3 className="text-2xl font-semibold mb-4 text-center">View Replies</h3>
                        <div className="grid">
                            {viewreplyEmployee.replies?.length > 0 ? (
                                viewreplyEmployee.replies.map((reply, index) => (
                                    <div key={index} className="p-2 border-b border-gray-300">
                                        <p className="text-sm text-gray-600">
                                            {new Date(reply.timestamp).toLocaleString()}
                                        </p>
                                        <p>{reply.message}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No replies found.</p>
                            )}
                        </div>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => setViewReplyEmployee(null)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default ShowFeedBackData;