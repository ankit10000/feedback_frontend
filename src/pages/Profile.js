import React, { useEffect, useState } from "react";

function Profile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("authToken");

  // Fetch logged-in admin profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("https://backend-2l3h.onrender.com/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setAdmin(data);
        } else {
          setError(data.message || "Failed to fetch profile");
        }
      } catch (error) {
        setError("Server error, please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-6">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Admin Profile</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : (
          admin && (
            <div className="border border-gray-300 p-4 rounded-lg bg-gray-100">
              <p className="text-lg font-semibold text-gray-700">
                <span className="text-gray-600">Name:</span> {admin.name}
              </p>
              <p className="text-lg font-semibold text-gray-700">
                <span className="text-gray-600">Email:</span> {admin.email}
              </p>
              <p className="text-lg font-semibold text-gray-700">
                <span className="text-gray-600">Role:</span> 
                <span className="text-blue-600 font-bold"> {admin.role.toUpperCase()}</span>
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Profile;
