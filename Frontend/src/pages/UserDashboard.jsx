import { useAuth } from "../context/AuthContext";

const UserDashboard = () => {
    const { auth, items } = useAuth(); // Get items from context

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-600">User Dashboard</h1>
            <p className="mt-2">Welcome, {auth?.username} (Role: {auth?.role})</p>
            
            {/* Display Items Added by Staff */}
            <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Available Items</h2>
                {items && items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                <p className="text-gray-600 mt-2">{item.description}</p>
                                <p className="text-green-600 font-bold mt-2">${item.price.toFixed(2)}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Added by: {item.addedBy} | {new Date(item.addedAt).toLocaleDateString()}
                                </p>
                                <button className="mt-3 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition">
                                    Request Item
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
                        No items available yet. Staff will add items soon!
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;