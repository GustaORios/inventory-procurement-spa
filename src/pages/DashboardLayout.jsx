import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  return (
      <div className="bg-gray-900/50 shadow-xl">
        <Outlet />
    </div>
  );
}
