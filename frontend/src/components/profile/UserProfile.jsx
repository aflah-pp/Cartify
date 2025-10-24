import UserInfo from "./UserInfo";
import OrderHistoryContainer from "./OrderHistoryContainer";
import Navbar from "../ui/NavBar";

function UserProfile({numCartItems}) {
  return (
    <>
      <Navbar numCartItems={numCartItems}/>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 border-b pb-2">
          My Profile
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserInfo />
          <OrderHistoryContainer />
        </div>
      </div>
    </>
  );
}

export default UserProfile;
