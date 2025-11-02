import { NavLink } from 'react-router-dom';

const menuItems = [
  { name: 'Products', path: '/products' },
  { name: 'Suppliers', path: '/suppliers' },
  { name: 'Purchase Orders', path: '/purchase-orders' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar text-gray-200 flex flex-col p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 bg-accent rounded-md" />
        <span className="text-cyan-300 font-bold text-lg">ITEMSNAME</span>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-accent text-black font-semibold'
                  : 'hover:text-cyan-300'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
