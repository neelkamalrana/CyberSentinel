"use client"

import React from 'react';
import { Shield } from 'lucide-react';
import { UserNav } from './user-nav';
import { User } from '@/lib/types';

interface DashboardHeaderProps {
  user: User;
  onLogout: () => void;
}

export function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">CyberSentinel</h1>
        </div>
        
        <UserNav 
          user={user} 
          onLogout={onLogout} 
        />
      </div>
    </header>
  );
}