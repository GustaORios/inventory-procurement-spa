import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-primary text-gray-200">
      <Sidebar />
      <main className="flex-1 p-8">
        {}
        <Outlet /> 
      </main>
    </div>
  );
}