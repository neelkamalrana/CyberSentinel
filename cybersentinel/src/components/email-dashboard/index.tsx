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
import { globalStorage } from '@/lib/global-storage';
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
  
  const [allEmails, setAllEmails] = useState<Email[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([]);
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState(generateMockStats([]));
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  useEffect(() => {
    if (!authUser) {
      router.push('/login');
    }
  }, [authUser, router]);
  
  useEffect(() => {
    const globalEmails = globalStorage.getAllEmails();
    
    if (globalEmails.length === 0) {
      setAllEmails(mockEmails);
      globalStorage.saveAllEmails(mockEmails);
    } else {
      setAllEmails(globalEmails);
    }
  }, []);
  
  const permissions = authUser ? rolePermissions[authUser.role] : rolePermissions.viewer;
  
  const dashboardUser: User = {
    id: 1,
    name: authUser?.name || authUser?.email?.split('@')[0] || 'User',
    email: authUser?.email || 'user@example.com',
    role: authUser?.role || 'viewer',
    avatar: "/avatars/user-01.png"
  };
  
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);
  
  useEffect(() => {
    let filtered = allEmails;
    
    if (filterRisk !== "all") {
      filtered = filtered.filter(email => email.riskLevel === filterRisk);
    }
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(email => email.status === filterStatus);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(email => 
        email.sender.toLowerCase().includes(query) || 
        email.subject.toLowerCase().includes(query)
      );
    }
    
    setFilteredEmails(filtered);
  }, [filterRisk, filterStatus, searchQuery, allEmails]);

  useEffect(() => {
    setStats(generateMockStats(allEmails));
  }, [allEmails]);

  const handleAddEmail = (newEmail: Email) => {
    const updatedEmails = [newEmail, ...allEmails];
    setAllEmails(updatedEmails);
    
    globalStorage.saveAllEmails(updatedEmails);
  };

  const handleBlockEmail = (id: number) => {
    if (!permissions.canBlock) return;
    
    const updatedEmails = allEmails.map(email => 
      email.id === id ? { ...email, status: 'blocked' } : email
    );
    
    setAllEmails(updatedEmails);
    
    globalStorage.saveAllEmails(updatedEmails);
  };

  const handleDeleteEmail = (id: number) => {
    if (!permissions.canDelete) return;
    
    const updatedEmails = allEmails.filter(email => email.id !== id);
    setAllEmails(updatedEmails);
    
    globalStorage.saveAllEmails(updatedEmails);
  };

  const handleExportData = () => {
    if (!permissions.canExport) return;
    
    const dataStr = JSON.stringify(allEmails, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `email-security-data-${new Date().toISOString().slice(0, 10)}.json`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
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
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Security Dashboard
            </h2>
            <p className="text-muted-foreground">
              All emails are visible to all users with appropriate roles
            </p>
          </div>
          
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
                {allEmails.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No emails found. Use the Security Tools to analyze emails.</p>
                  </div>
                ) : (
                  <EmailTable 
                    emails={filteredEmails}
                    totalEmails={stats.totalEmails}
                    permissions={permissions}
                    onBlockEmail={handleBlockEmail}
                    onDeleteEmail={handleDeleteEmail}
                    currentRole={authUser.role}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
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