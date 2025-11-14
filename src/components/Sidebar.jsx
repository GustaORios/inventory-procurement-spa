import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊', role: ['manager', 'admin'] },
  { name: 'Inventory', path: '/inventory', icon: '📦', role: ['picker', 'manager', 'admin'] },
  { name: "Suppliers", path: "/suppliers", icon: '👥', role: ['manager', 'admin'] },
  { name: "Purchase Orders", path: "/purchase-orders", icon: '🧾', role: ['supplier', 'manager', 'admin', 'picker'] },
  { name: 'Settings', path: '/settings', icon: '⚙️', role: ['admin'] }
];

export default function Sidebar() {
  const { user, logout } = useContext(UserContext);
  const activeClass = "bg-accent text-white font-semibold";
  const inactiveClass = "hover:bg-gray-700";

  if (!user) return null;

  return (
    <aside className="w-60 bg-primary flex flex-col p-4 shadow-lg min-h-screen">
      <div className="flex items-center gap-3 mb-8 p-2">
        <div className="w-10 h-10 bg-gray-700 border-2 border-accent rounded-full flex items-center justify-center">
          <span className="font-bold text-accent text-lg">N</span>
        </div>
        <span className="text-white font-bold text-xl">NTG</span>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems
          .filter(item => item.role.includes(user.role))
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? activeClass : inactiveClass
                }`
              }
            >
              {item.icon} {item.name}
            </NavLink>
          ))}
      </nav>

      <div className="flex flex-col gap-2 border-t border-gray-700 pt-4 mt-auto">
        <p className="text-gray-200">
          {user.username} ({user.role})
        </p>

        <button
          onClick={logout}
          className="bg-red-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-400 transition mt-2"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
