import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ShowEmployees() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://backend-2l3h.onrender.com/api/auth/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          setError(data.message || "Failed to fetch users");
        }
      } catch (error) {
        setError("Server error, please try again later");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
        
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Employees & Admins</h2>

        {loading && <p className="text-center text-blue-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="border-t border-gray-300 hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                      <td className="border border-gray-300 px-4 py-2 capitalize">{user.role}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No users found
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

export default ShowEmployees;
