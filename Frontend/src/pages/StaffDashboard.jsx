import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const StaffDashboard = () => {
    const { auth, addItem } = useAuth(); // Added addItem from context
    const [itemName, setItemName] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [message, setMessage] = useState("");

    const handleAddItem = (e) => {
        e.preventDefault();
        
        if (!itemName || !itemDescription || !itemPrice) {
            setMessage("Please fill all fields");
            return;
        }

        const newItem = {
            id: Date.now(),
            name: itemName,
            description: itemDescription,
            price: parseFloat(itemPrice),
            addedBy: auth?.username,
            addedAt: new Date().toISOString()
        };

        addItem(newItem);
        setMessage("Item added successfully!");
        
        // Clear form
        setItemName("");
        setItemDescription("");
        setItemPrice("");
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-yellow-600">Staff Dashboard</h1>
            <p className="mt-2">Welcome, {auth?.username} (Role: {auth?.role})</p>
            
            {/* Add Item Form */}
            <div className="mt-6 bg-white p-6 rounded-lg border border-yellow-200 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Add New Item for Users</h2>
                {message && (
                    <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                        {message}
                    </div>
                )}
                <form onSubmit={handleAddItem}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Item Name</label>
                        <input
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-yellow-500"
                            placeholder="Enter item name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            value={itemDescription}
                            onChange={(e) => setItemDescription(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-yellow-500"
                            placeholder="Enter item description"
                            rows="3"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Price ($)</label>
                        <input
                            type="number"
                            value={itemPrice}
                            onChange={(e) => setItemPrice(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-yellow-500"
                            placeholder="Enter price"
                            step="0.01"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
                    >
                        Add Item
                    </button>
                </form>
            </div>

            <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h2 className="text-xl font-semibold">Staff Tools</h2>
                <ul className="list-disc ml-6 mt-2">
                    <li>Manage daily tasks</li>
                    <li>View reports</li>
                    <li>Process user requests</li>
                </ul>
            </div>
        </div>
    );
};

export default StaffDashboard;