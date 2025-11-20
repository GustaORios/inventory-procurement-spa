import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { CubeIcon, UsersIcon, ReceiptPercentIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';


import logo from './SATURN.png';

const sidebarTheme = {
  bg: "bg-gray-900",
  border: "border-gray-700",
  text: "text-gray-300",
  accent: "text-teal-500",
  hoverBg: "hover:bg-gray-800",
  activeBg: "bg-gray-800 border-l-4 border-teal-500",
  activeText: "text-white font-semibold",
};

const menuItems = [
  { name: 'Inventory', path: '/inventory', icon: CubeIcon, role: ['picker', 'manager', 'admin'] },
  { name: "Suppliers", path: "/suppliers", icon: UsersIcon, role: ['manager', 'admin'] },
  { name: "Purchase Orders", path: "/purchase-orders", icon: ReceiptPercentIcon, role: ['manager', 'supplier', 'admin', 'picker'] },
  { name: 'Settings', path: '/settings', icon: Cog6ToothIcon, role: ['picker', 'manager', 'supplier', 'admin'] }
];

export default function Sidebar() {
  const { user, logout } = useContext(UserContext);

  const activeClass = `${sidebarTheme.activeBg} ${sidebarTheme.activeText}`;
  const inactiveClass = `${sidebarTheme.hoverBg} ${sidebarTheme.text} border-l-4 border-transparent`;

  if (!user) return null;

  return (

    <aside className={`w-60 flex flex-col p-4 shadow-2xl ${sidebarTheme.bg} ${sidebarTheme.border} border-r`}>

      <div className="flex items-center justify-center mb-10 p-2">
        <img src={logo} alt="Saturn Logo" className="w-32" />
      </div>


      <nav className="flex flex-col gap-1">
        {menuItems
          .filter(item => item.role.includes(user.role))
          .map((item) => {
            const IconComponent = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-3 py-2 rounded-md transition-all text-sm ${isActive
                    ? activeClass
                    : inactiveClass
                  }`
                }
              >
                <IconComponent className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
      </nav>

      <div className="flex flex-col gap-3 border-t border-gray-700 pt-6 mt-auto">

        <div className="px-2">
          <p className="text-white font-semibold">{user.username}</p>
          <p className="text-gray-400 text-xs mt-0.5 capitalize">Role: {user.role}</p>
        </div>

        <button
          onClick={logout}
          className="bg-red-700 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}