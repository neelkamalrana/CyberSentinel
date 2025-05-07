"use client"

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { DashboardHeader } from './dashboard-header';
import { DashboardStats } from './dashboard-stats';
import { FilterControls } from './filter-controls';
import { EmailTable } from './email-table';
import { AddEmailForm } from './add-email-form';
import { SecurityToolsHub } from './security-tools-hub';
import { mockEmails, generateMockStats } from '@/lib/mock-data';
import { rolePermissions } from '@/lib/config';
import { Email, User } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
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
  Settings,
  AlertTriangle,
  Shield
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';

export default function PhishingDashboard() {
  const { setTheme } = useTheme();
  const { user: authUser, logout } = useAuth();
  const router = useRouter();
  const [allEmails, setAllEmails] = useState<Email[]>(mockEmails);
  const [filteredEmails, setFilteredEmails] = useState<Email[]>(mockEmails);
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState(generateMockStats(mockEmails));
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  // If no authenticated user, redirect to login
  useEffect(() => {
    if (!authUser) {
      router.push('/login');
    }
  }, [authUser, router]);
  
  // Get permissions based on the authenticated user's role
  const permissions = authUser ? rolePermissions[authUser.role] : rolePermissions.viewer;
  
  // Create a user object compatible with our existing components
  const dashboardUser: User = {
    id: 1,
    name: authUser?.name || authUser?.email?.split('@')[0] || 'User',
    email: authUser?.email || 'user@example.com',
    role: authUser?.role || 'viewer',
    avatar: "/avatars/user-01.png"
  };
  
  // Handle logout with redirect
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  // Set dark theme on component mount
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);
  
  // Filter emails based on risk level, status and search query
  useEffect(() => {
    let filtered = allEmails;
    
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
    
    setFilteredEmails(filtered);
  }, [filterRisk, filterStatus, searchQuery, allEmails]);

  // Update stats when all emails change
  useEffect(() => {
    setStats(generateMockStats(allEmails));
  }, [allEmails]);

  // Handler for adding a new email after AI analysis
  const handleAddEmail = (newEmail: Email) => {
    setAllEmails(prev => [newEmail, ...prev]);
  };

  // Mock email action handlers
  const handleBlockEmail = (id: number) => {
    if (!permissions.canBlock) return;
    
    setAllEmails(prev => 
      prev.map(email => 
        email.id === id ? { ...email, status: 'blocked' } : email
      )
    );
  };

  const handleDeleteEmail = (id: number) => {
    if (!permissions.canDelete) return;
    
    setAllEmails(prev => prev.filter(email => email.id !== id));
  };

  const handleExportData = () => {
    if (!permissions.canExport) return;
    
    alert("Exporting data...");
    // Implement export functionality
  };
  
  // Guard against no user
  if (!authUser) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader 
        user={dashboardUser}
        onLogout={handleLogout}
      />

      <main className="flex-grow container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
          <h2 className="text-3xl font-bold tracking-tight">Security Dashboard</h2>
          
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
      
        {/* Phishing alerts summary */}
        {stats.phishingCount > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Phishing Threats Detected</AlertTitle>
            <AlertDescription>
              {stats.phishingCount} potential phishing emails have been identified. 
              Review and take action to protect your organization.
            </AlertDescription>
          </Alert>
        )}
      
        <DashboardStats stats={stats} />
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="dashboard" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            {/* Only show the Security Tools tab for admin and analyst roles */}
            {(authUser.role === 'admin' || authUser.role === 'analyst') && (
              <TabsTrigger value="tools" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Security Tools
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
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
                  emails={filteredEmails}
                  totalEmails={stats.totalEmails}
                  permissions={permissions}
                  onBlockEmail={handleBlockEmail}
                  onDeleteEmail={handleDeleteEmail}
                  currentRole={authUser.role}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Only show the Security Tools tab content for admin and analyst roles */}
          {(authUser.role === 'admin' || authUser.role === 'analyst') && (
            <TabsContent value="tools" className="mt-6">
              <SecurityToolsHub onAddEmail={handleAddEmail} />
            </TabsContent>
          )}
        </Tabs>
      </main>
      
      <footer className="border-t bg-muted/40 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© 2025 CyberSentinel. All rights reserved.</p>
            <p>Version 2.1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}