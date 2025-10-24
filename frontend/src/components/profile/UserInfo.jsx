import { useEffect, useState } from "react";
import api from "../utils/axios";
import { UserCircle } from "lucide-react";

function UserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/user/user_details/")
      .then(res => setUser(res.data))
      .catch(err => console.error("Error fetching user info:", err));
  }, []);

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-500">Loading user info...</p>
      </div>
    );
  }

  return (
      <div className="bg-white rounded-xl shadow p-6 max-h-[420px] overflow-y-auto">
      <div className="flex items-center gap-4 mb-6 sticky top-0 bg-white z-10 border-b border-gray-200">
        <UserCircle className="w-10 h-10 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">User Information</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm text-gray-700">
        <InfoItem label="Username" value={user.username} />
        <InfoItem label="Email" value={user.email} />
        <InfoItem label="First Name" value={user.first_name} />
        <InfoItem label="Last Name" value={user.last_name} />
        <InfoItem label="Phone" value={user.phone} />
        <InfoItem label="Address" value={user.address} />
        <InfoItem label="City" value={user.city} />
        <InfoItem label="State" value={user.state} />
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 font-medium">{label}</p>
      <p className="text-gray-900">{value || "—"}</p>
    </div>
  );
}

export default UserInfo;
