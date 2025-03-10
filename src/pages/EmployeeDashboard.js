import React, { useState, useEffect } from "react";
import axios from "axios";
import { GrView } from "react-icons/gr";


const ShowFeedBackData = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [assignedApps, setAssignedApps] = useState([]);

  // Retrieve logged-in user's email and token from localStorage
  const loggedInUserEmail = localStorage.getItem("email");
  const authToken = localStorage.getItem("authToken");  // Ensure consistent token key

  useEffect(() => {
    if (!loggedInUserEmail || !authToken) {
      setError("No authentication token found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchAssignedApps = async () => {
      try {
        const response = await axios.get(`https://backend-2l3h.onrender.com/api/admin/check-assigned-apps/${loggedInUserEmail}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        if (response.data.assignedApps) {
          setAssignedApps(response.data.assignedApps);
        }
      } catch (err) {
        console.error("Failed to fetch assigned apps:", err);
        setError("Failed to fetch assigned apps");
      }
    };

    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("https://backend-2l3h.onrender.com/api/notepad/get_feedback", {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        if (Array.isArray(response.data.data)) {
          setFeedbacks(response.data.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Unexpected response format.");
        }
      } catch (err) {
        console.error("Failed to fetch feedback:", err);
        setError("Failed to fetch feedback");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedApps();
    fetchFeedbacks();
  }, [loggedInUserEmail, authToken]);

  useEffect(() => {
    if (feedbacks.length > 0 && assignedApps.length > 0) {
      setFilteredFeedbacks(feedbacks.filter(fb => assignedApps.includes(fb.app_name)));
    } else {
      setFilteredFeedbacks([]);
    }
  }, [feedbacks, assignedApps]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    setFilteredFeedbacks(feedbacks.filter(
      fb => assignedApps.includes(fb.app_name) &&
        Object.values(fb).some(value => value?.toString().toLowerCase().includes(query))
    ));
  };
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [replyEmployee, setReplyEmployee] = useState(null);
  const [viewreplyEmployee, setViewReplyEmployee] = useState(null);
  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
  };
  const submitReplies = async () => {
    if (!replyMessage.trim()) {
      alert("Reply message cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("https://backend-2l3h.onrender.com/api/reply/send-reply", {
        email: replyEmployee.email,
        subject: "Feedback Reply",
        message: replyMessage,
      });

      if (response.data.message) {
        alert("Reply sent successfully!");
        setReplyEmployee(null);  // Close modal
        setReplyMessage("");  // Clear message
      } else {
        alert("Failed to send reply.");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending reply.");
    }
  };
  const handleClosePopup = () => {
    setSelectedEmployee(null);
    setReplyEmployee(null);
    setViewReplyEmployee(null); // Open the reply

  };
  const [replyMessage, setReplyMessage] = useState("");

  const handleReply = (employee) => {
    setReplyEmployee(employee);
    setSelectedEmployee(null);  // Close the employee details popup
    setReplyMessage("");
  };
  const handleViewReply = async (employee) => {
    try {
      const response = await axios.get(`https://backend-2l3h.onrender.com/api/reply/replies-by-email?email=${employee.email}`);
      if (response.data.success) {
        setViewReplyEmployee({ ...employee, replies: response.data.data });
      } else {
        alert("No replies found for this user.");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching replies.");
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
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">App Name</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Rate Star</th>
              <th className="border border-gray-300 p-2">Report</th>
              <th className="border border-gray-300 p-2 cursor-pointer">Reply</th>
              <th className="border border-gray-300 p-2 cursor-pointer">View Reply</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map((fb, index) => (
                <tr key={index} className="hover:bg-gray-100 text-center" onClick={() => handleRowClick(fb)}>
                  <td className="border border-gray-300 p-2">{fb.app_name}</td>
                  <td className="border border-gray-300 p-2">{fb.date}</td>
                  <td className="border border-gray-300 p-2">{fb.description}</td>
                  <td className="border border-gray-300 p-2">{fb.email}</td>
                  <td className="border border-gray-300 p-2">{fb.rate_star}</td>
                  <td className="border border-gray-300 p-2">{fb.report}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents triggering row click
                        handleReply(fb);
                      }}
                      className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                      Reply
                    </button>

                  </td>
                  <td className="border border-gray-300 p-2"><button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents triggering row click
                      handleViewReply(fb);
                    }}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    <GrView />
                  </button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border border-gray-300 p-2 text-center">No feedback found</td>
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
                onChange={(e) => setReplyMessage(e.target.value)}  // Update state on input
              ></textarea>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={submitReplies}  // No need to pass parameters now
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
                            {viewreplyEmployee.replies.length > 0 ? (
                                viewreplyEmployee.replies.map((reply, index) => (
                                    <div key={index} className="p-2 border-b border-gray-300">
                                        <p className="text-sm text-gray-600">{new Date(reply.timestamp).toLocaleString()}</p>
                                        <p>{reply.message}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No replies found.</p>
                            )}
                        </div>
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
    </div>
  );
};

export default ShowFeedBackData;
