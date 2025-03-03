import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FeedbackForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        app_version: "",
        app_name: "",
        date: "",
        description: "",
        device_model: "",
        device_token: "",
        email: "",
        from_screen: "",
        like_dislike: "",
        os_version: "",
        rate_star: "",
        report: "",
        faq: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/save-to-notepad", formData);
            setMessage(response.data.message);
            setFormData({
                app_version: "",
                app_name: "",
                date: "",
                description: "",
                device_model: "",
                device_token: "",
                email: "",
                from_screen: "",
                like_dislike: "",
                os_version: "",
                rate_star: "",
                report: "",
                faq: "",
            });
        } catch (error) {
            setMessage("Error submitting feedback");
            console.error(error);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Submit Feedback</h2>
                <button 
                    onClick={() => navigate("/show_data")} 
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Show Data
                </button>
            </div>

            {message && <p className="text-green-600">{message}</p>}
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
                <input type="text" name="app_version" placeholder="App Version" value={formData.app_version} onChange={handleChange} className="border p-2 rounded" required />
                <input type="text" name="app_name" placeholder="App Name" value={formData.app_name} onChange={handleChange} className="border p-2 rounded" required />
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-2 rounded" required />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border p-2 rounded" required></textarea>
                <input type="text" name="device_model" placeholder="Device Model" value={formData.device_model} onChange={handleChange} className="border p-2 rounded" required />
                <input type="text" name="device_token" placeholder="Device Token" value={formData.device_token} onChange={handleChange} className="border p-2 rounded" required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border p-2 rounded" required />
                <input type="text" name="from_screen" placeholder="From Screen" value={formData.from_screen} onChange={handleChange} className="border p-2 rounded" required />

                {/* Like/Dislike Dropdown */}
                <select name="like_dislike" value={formData.like_dislike} onChange={handleChange} className="border p-2 rounded" required>
                    <option value="">Do you like this app?</option>
                    <option value="Like">Like</option>
                    <option value="Dislike">Dislike</option>
                </select>

                <input type="text" name="os_version" placeholder="OS Version" value={formData.os_version} onChange={handleChange} className="border p-2 rounded" required />
                <input type="number" name="rate_star" placeholder="Rate Star (1-5)" value={formData.rate_star} onChange={handleChange} className="border p-2 rounded" required />

                {/* Report Textarea */}
                <textarea name="report" placeholder="Report (if any issue)" value={formData.report} onChange={handleChange} className="border p-2 rounded"></textarea>

                {/* FAQ Text Input */}
                <input type="text" name="faq" placeholder="Frequently Asked Question" value={formData.faq} onChange={handleChange} className="border p-2 rounded" />

                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Submit Feedback</button>
            </form>
        </div>
    );
};

export default FeedbackForm;
