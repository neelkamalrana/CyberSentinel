"use client"

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { DashboardHeader } from './dashboard-header';
import { DashboardStats } from './dashboard-stats';
import { FilterControls } from './filter-controls';
import { EmailTable } from './email-table';
import { currentUser, mockEmails, mockStats } from '@/lib/mock-data';
import { rolePermissions } from '@/lib/config';
import { UserRole, Email } from '@/lib/types';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Settings 
} from "lucide-react";

export default function PhishingDashboard() {
  const { setTheme } = useTheme();
  const [emails, setEmails] = useState(mockEmails);
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentRole, setCurrentRole] = useState<UserRole>(currentUser.role);
  const permissions = rolePermissions[currentRole];
  
  // Set dark theme on component mount
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);
  
  // Filter emails based on risk level, status and search query
  useEffect(() => {
    let filtered = mockEmails;
    
    // Apply risk level filter
    if (filterRisk !== "all") {
      filtered = filtered.filter(email => email.riskLevel === filterRisk);
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(email => email.status === filterStatus);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(email => 
        email.sender.toLowerCase().includes(query) || 
        email.subject.toLowerCase().includes(query)
      );
    }
    
    setEmails(filtered);
  }, [filterRisk, filterStatus, searchQuery]);

  // Mock email action handlers
  const handleBlockEmail = (id: number) => {
    if (!permissions.canBlock) return;
    
    setEmails(prev => 
      prev.map(email => 
        email.id === id ? { ...email, status: 'blocked' } : email
      )
    );
  };

  const handleDeleteEmail = (id: number) => {
    if (!permissions.canDelete) return;
    
    setEmails(prev => prev.filter(email => email.id !== id));
  };

  const handleExportData = () => {
    if (!permissions.canExport) return;
    
    alert("Exporting data...");
    // Implement export functionality
  };

  const handleChangeRole = (role: UserRole) => {
    setCurrentRole(role);
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader 
        user={currentUser} 
        currentRole={currentRole} 
        onChangeRole={handleChangeRole} 
      />

      <main className="flex-grow container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
          <h2 className="text-3xl font-bold tracking-tight">Email Security Dashboard</h2>
          
          <div className="flex items-center space-x-2">
            {permissions.canExport && (
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={handleExportData}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            )}
            
            {permissions.canChangeSettings && (
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            )}
          </div>
        </div>
      
        <DashboardStats stats={mockStats} />
        
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Email Security Analysis</CardTitle>
            <CardDescription>
              Review and monitor potentially dangerous emails
            </CardDescription>
            
            <FilterControls 
              filterRisk={filterRisk}
              setFilterRisk={setFilterRisk}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </CardHeader>
          <CardContent>
            <EmailTable 
              emails={emails}
              totalEmails={mockStats.totalEmails}
              permissions={permissions}
              onBlockEmail={handleBlockEmail}
              onDeleteEmail={handleDeleteEmail}
              currentRole={currentRole}
            />
          </CardContent>
        </Card>
      </main>
      
      <footer className="border-t bg-muted/40 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© 2025 CyberSentinel. All rights reserved.</p>
            <p>Version 2.0.1</p>
          </div>
        </div>
      </footer>
    </div>
  );
}