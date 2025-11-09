import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";

const menuItems = [
  { name: "Products", path: "/products", icon: '' },
  { name: "Suppliers", path: "/suppliers", icon: '' },
  { name: "Purchase Orders", path: "/purchase-orders", icon: '' },
  { name: 'Dashboard', path: '/dashboard', icon: '' },
  { name: 'Inventory', path: '/inventory', icon: '' },
  { name: 'Settings', path: '/settings', icon: '' }
];

export default function Sidebar() {
  const { user, login, logout } = useContext(UserContext);
  const activeClass = "bg-accent text-white font-semibold";
  const inactiveClass = "hover:bg-gray-700";

  return (
    <aside className="w-60 bg-primary flex flex-col p-4 shadow-lg">
      <div className="flex items-center gap-3 mb-8 p-2">
        {/* Simulação do logo 'NTG' do print */}
        <div className="w-10 h-10 bg-gray-700 border-2 border-accent rounded-full flex items-center justify-center">
          <span className="font-bold text-accent text-lg">N</span>
        </div>
        <span className="text-white font-bold text-xl">NTG</span>
      </div>

      <div className="mb-4">
        {user ? (
          <>
            <p>Welcome, {user.name}!</p>
            <button onClick={logout} className="text-red-400">Logout</button>
          </>
        ) : (
          <button onClick={login} className="text-green-400">Login</button>
        )}
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive ? activeClass : inactiveClass
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>


      <div className="flex flex-col gap-2 border-t border-gray-700 pt-4">
        {user ? (
          <>
            <p>Welcome, {user.name}!</p>
            <button onClick={logout} className={`flex items-center gap-3 px-3 py-2 rounded-md ${inactiveClass}`}>Logout</button>
          </>
        ) : (
          <button onClick={login} className={`flex items-center gap-3 px-3 py-2 rounded-md ${inactiveClass}`}>Login</button>
        )}
      </div>
    </aside>
  );
}
