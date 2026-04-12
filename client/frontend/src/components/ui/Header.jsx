import { LogOut, User } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
  const { logout } = useContext(AuthContext);

  const [showCard, setShowCard] = useState(false);

  const showCardHandler = () => {
    setShowCard(!showCard);
  };

  const handleLogout = async () => {
    try {
      const res = await logout();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="h-16 border-b border-red-500 flex flex-row-reverse gap-2 items-center px-4">
      <div className="w-9 h-9 rounded-full bg-black flex justify-center items-center hover:cursor-pointer text-white">
        <User color="#FFFFFF" onClick={showCardHandler} />
      </div>

      {showCard && (
        <div className="bg-white shadow-md rounded-lg px-6 py-4 border w-fit">
          <button className="text-md font-semibold hover:text-red-500 flex gap-3 justify-center items-center transition" onClick={handleLogout}>
            Logout <LogOut size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
