import React, { useEffect, useState } from "react";

function AssignedApps() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [appName, setAppName] = useState("");
  const [assigning, setAssigning] = useState(false);
  const token = localStorage.getItem("authToken");



  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://backend-2l3h.onrender.com/api/auth/get-all-employees", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setEmployees(data);
      } else {
        setError(data.message || "Failed to fetch employees");
      }
    } catch (error) {
      setError("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignApp = async (e) => {
    e.preventDefault();
    if (!employeeEmail || !appName) {
      setError("Please enter both employee email and app name.");
      return;
    }

    setAssigning(true);
    try {
      const response = await fetch("https://backend-2l3h.onrender.com/api/admin/assign-app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employeeEmail, appName }),
      });

      const data = await response.json();
      if (response.ok) {
        setEmployeeEmail("");
        setAppName("");
        fetchEmployees(); // Refresh list after assignment
      } else {
        setError(data.message || "Failed to assign app.");
      }
    } catch (error) {
      setError("Server error, please try again.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-6">
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Assigned Apps</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Assign App Form */}
        <form onSubmit={handleAssignApp} className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="email"
            placeholder="Employee Email"
            className="border p-2 rounded w-full sm:w-1/2"
            value={employeeEmail}
            onChange={(e) => setEmployeeEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="App Name"
            className="border p-2 rounded w-full sm:w-1/2"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={assigning}
          >
            {assigning ? "Assigning..." : "Assign App"}
          </button>
        </form>

        {/* Show loading spinner */}
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Employee Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Assigned Apps</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((employee, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{employee.email}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {employee.assignedApps && employee.assignedApps.length > 0 ? (
                          <ul className="list-disc list-inside text-gray-600">
                            {employee.assignedApps.map((app, idx) => (
                              <li key={idx}>{app}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-500">No apps assigned</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignedApps;
