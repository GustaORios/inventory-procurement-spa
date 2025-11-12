import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-primary text-gray-200">
      <main className="flex-1 p-8">
        {}
        <Outlet /> 
      </main>
    </div>
  );
}