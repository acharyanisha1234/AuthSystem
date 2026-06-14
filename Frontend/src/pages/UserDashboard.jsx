import { useAuth } from "../context/AuthContext";

const UserDashboard = () => {
    const { auth } = useAuth();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-green-600">User Dashboard</h1>
            <p className="mt-2">Welcome, {auth?.username} (Role: {auth?.role})</p>
            <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
                <h2 className="text-xl font-semibold">👤 Your Area</h2>
                <ul className="list-disc ml-6 mt-2">
                    <li>View profile</li>
                    <li>Update info</li>
                    <li>Access basic features</li>
                </ul>
            </div>
        </div>
    );
};
export default UserDashboard;