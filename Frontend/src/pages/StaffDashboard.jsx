import { useAuth } from "../context/AuthContext";

const StaffDashboard = () => {
    const { auth } = useAuth();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-yellow-600">Staff Dashboard</h1>
            <p className="mt-2">Welcome, {auth?.username} (Role: {auth?.role})</p>
            <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h2 className="text-xl font-semibold"> Staff Tools</h2>
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