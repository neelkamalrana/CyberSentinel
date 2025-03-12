"use client"

import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Link as LinkIcon, 
  Zap,
  Shield,
  Bell,
  Settings,
  MoreHorizontal,
  Eye,
  Ban,
  Flag,
  Trash2,
  Download,
  User,
  Users,
  LogOut
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

// User roles
type UserRole = 'admin' | 'analyst' | 'viewer';

// Mock user data
const currentUser = {
  id: 1,
  name: "Alex Johnson",
  email: "alex.johnson@company.com",
  role: 'admin' as UserRole,
  avatar: "/avatars/user-01.png" // Replace with your actual path
};

// Mock data - replace with your API calls
const mockEmails = [
  { 
    id: 1, 
    sender: "noreply@amazzon-security.com", 
    subject: "Your Amazon account has been locked", 
    receivedAt: "2025-03-10T14:32:00", 
    riskLevel: "phishing",
    status: "flagged",
    indicators: ["spoofed domain", "urgent action requested", "suspicious link"]
  },
  { 
    id: 2, 
    sender: "updates@dropbox.com", 
    subject: "Your shared document has been updated", 
    receivedAt: "2025-03-10T11:15:00", 
    riskLevel: "suspicious",
    status: "reviewing",
    indicators: ["attachment request", "external sharing"]
  },
  { 
    id: 3, 
    sender: "newsletter@medium.com", 
    subject: "Weekly Digest: Top stories for you", 
    receivedAt: "2025-03-09T09:45:00", 
    riskLevel: "safe",
    status: "cleared",
    indicators: []
  },
  { 
    id: 4, 
    sender: "secur1ty@paypaI.com", 
    subject: "Urgent: Verify your account now", 
    receivedAt: "2025-03-09T16:28:00", 
    riskLevel: "phishing",
    status: "blocked",
    indicators: ["homograph attack", "urgent action", "suspicious sender"]
  },
  { 
    id: 5, 
    sender: "hr@companyname.com", 
    subject: "March company updates", 
    receivedAt: "2025-03-08T10:05:00", 
    riskLevel: "safe",
    status: "cleared",
    indicators: []
  },
  { 
    id: 6, 
    sender: "support@microsoft365.net", 
    subject: "Your Office 365 password will expire soon", 
    receivedAt: "2025-03-08T14:52:00", 
    riskLevel: "suspicious",
    status: "reviewing",
    indicators: ["unusual domain", "credential request"]
  },
];

// Statistics based on mock data
const mockStats = {
  totalEmails: mockEmails.length,
  phishingCount: mockEmails.filter(email => email.riskLevel === "phishing").length,
  suspiciousCount: mockEmails.filter(email => email.riskLevel === "suspicious").length,
  safeCount: mockEmails.filter(email => email.riskLevel === "safe").length,
  maliciousUrls: 7,
  fraudAttempts: 3,
  blockedCount: mockEmails.filter(email => email.status === "blocked").length,
  weeklyChange: +12.5, // Percentage change
  weeklyTotal: 28
};

// Risk level badge styling and icons
const riskLevelConfig = {
  phishing: {
    icon: <AlertCircle className="h-4 w-4 mr-1" />,
    color: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    label: "Phishing"
  },
  suspicious: {
    icon: <AlertTriangle className="h-4 w-4 mr-1" />,
    color: "bg-amber-500 text-white hover:bg-amber-600",
    label: "Suspicious"
  },
  safe: {
    icon: <CheckCircle className="h-4 w-4 mr-1" />,
    color: "bg-emerald-500 text-white hover:bg-emerald-600",
    label: "Safe"
  }
};

// Status configuration
const statusConfig = {
  flagged: {
    icon: <Flag className="h-4 w-4" />,
    color: "text-amber-500",
    label: "Flagged"
  },
  reviewing: {
    icon: <Eye className="h-4 w-4" />,
    color: "text-blue-500",
    label: "Reviewing"
  },
  blocked: {
    icon: <Ban className="h-4 w-4" />,
    color: "text-destructive",
    label: "Blocked"
  },
  cleared: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: "text-emerald-500",
    label: "Cleared"
  }
};

// Role permissions
const rolePermissions = {
  admin: {
    canBlock: true,
    canDelete: true,
    canExport: true,
    canManageUsers: true,
    canChangeSettings: true
  },
  analyst: {
    canBlock: true,
    canDelete: false,
    canExport: true,
    canManageUsers: false,
    canChangeSettings: false
  },
  viewer: {
    canBlock: false,
    canDelete: false,
    canExport: true,
    canManageUsers: false,
    canChangeSettings: false
  }
};

export default function PhishingDashboard() {
  const { setTheme } = useTheme()
  const [emails, setEmails] = useState(mockEmails)
  const [filterRisk, setFilterRisk] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentRole, setCurrentRole] = useState<UserRole>(currentUser.role)
  const permissions = rolePermissions[currentRole]
  
  // Set dark theme on component mount
  useEffect(() => {
    setTheme("dark")
  }, [setTheme])
  
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

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

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
      {/* Top navigation */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">CyberSentinel</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-background border shadow-md">
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex items-center space-x-2 h-8 mr-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">{currentUser.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{currentRole}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border shadow-md">
                <DropdownMenuLabel className="font-medium">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="font-medium">Switch Role</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleChangeRole('admin')} className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Admin</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleChangeRole('analyst')} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  <span>Analyst</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleChangeRole('viewer')} className="cursor-pointer">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Viewer</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

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
      
        {/* Statistics Cards - US_03 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Email Risk Summary</CardTitle>
              <CardDescription>Overall security status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-destructive mr-2"></span>
                    <span>Phishing: {mockStats.phishingCount}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                    <span>Suspicious: {mockStats.suspiciousCount}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                    <span>Safe: {mockStats.safeCount}</span>
                  </div>
                </div>
                <div className="h-20 w-20 rounded-full border-4 border-muted flex items-center justify-center bg-card shadow-sm">
                  <span className="text-lg font-bold">{mockStats.totalEmails}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Malicious URLs</CardTitle>
              <CardDescription>Detected in emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <LinkIcon className="h-4 w-4 text-destructive mr-2" />
                  <span>Detected</span>
                </div>
                <span className="text-2xl font-bold">{mockStats.maliciousUrls}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-destructive h-2.5 rounded-full" 
                  style={{ width: `${(mockStats.maliciousUrls / 10) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Fraud Attempts</CardTitle>
              <CardDescription>Blocked this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-amber-500 mr-2" />
                  <span>Blocked</span>
                </div>
                <span className="text-2xl font-bold">{mockStats.fraudAttempts}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-amber-500 h-2.5 rounded-full" 
                  style={{ width: `${(mockStats.fraudAttempts / 10) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Weekly Summary</CardTitle>
              <CardDescription>Threat trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total incidents</span>
                <span className="text-2xl font-bold">{mockStats.weeklyTotal}</span>
              </div>
              <div className="flex items-center">
                <span className={`text-sm ${mockStats.weeklyChange >= 0 ? 'text-destructive' : 'text-emerald-500'}`}>
                  {mockStats.weeklyChange >= 0 ? "+" : ""}{mockStats.weeklyChange}%
                </span>
                <span className="text-sm text-muted-foreground ml-2">from last week</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Email List with Filtering - US_01 & US_02 */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Email Security Analysis</CardTitle>
            <CardDescription>
              Review and monitor potentially dangerous emails
            </CardDescription>
            
            {/* Filtering Options */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="w-full sm:w-1/4">
                <Label htmlFor="risk-filter" className="text-sm font-medium">Risk Level</Label>
                <Select 
                  onValueChange={setFilterRisk} 
                  defaultValue="all"
                >
                  <SelectTrigger id="risk-filter" className="bg-background border-input">
                    <SelectValue placeholder="All Risk Levels" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-md">
                    <SelectGroup>
                      <SelectLabel>Risk Levels</SelectLabel>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="phishing">Phishing</SelectItem>
                      <SelectItem value="suspicious">Suspicious</SelectItem>
                      <SelectItem value="safe">Safe</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-1/4">
                <Label htmlFor="status-filter" className="text-sm font-medium">Status</Label>
                <Select 
                  onValueChange={setFilterStatus} 
                  defaultValue="all"
                >
                  <SelectTrigger id="status-filter" className="bg-background border-input">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-md">
                    <SelectGroup>
                      <SelectLabel>Email Status</SelectLabel>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                      <SelectItem value="reviewing">Under Review</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                      <SelectItem value="cleared">Cleared</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-2/4">
                <Label htmlFor="search" className="text-sm font-medium">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by sender or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background border-input"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                {emails.length === 0 
                  ? "No emails match your filters"
                  : `Showing ${emails.length} of ${mockStats.totalEmails} emails`
                }
              </TableCaption>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="w-[250px]">Sender</TableHead>
                  <TableHead className="w-[300px]">Subject</TableHead>
                  <TableHead className="w-[150px]">Received</TableHead>
                  <TableHead className="w-[120px]">Risk Level</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.map((email) => (
                  <TableRow key={email.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{email.sender}</TableCell>
                    <TableCell>{email.subject}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1 opacity-70" />
                        {formatDate(email.receivedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <HoverCard>
                        <HoverCardTrigger>
                          <Badge 
                            className={`flex items-center ${riskLevelConfig[email.riskLevel].color}`}
                          >
                            {riskLevelConfig[email.riskLevel].icon}
                            {riskLevelConfig[email.riskLevel].label}
                          </Badge>
                        </HoverCardTrigger>
                        {email.indicators.length > 0 && (
                          <HoverCardContent className="w-80 p-4 bg-background border shadow-md">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">Detection Indicators</h4>
                              <Separator />
                              <ul className="text-xs space-y-1">
                                {email.indicators.map((indicator, idx) => (
                                  <li key={idx} className="flex items-start py-1">
                                    <AlertCircle className="h-3 w-3 text-destructive mr-2 mt-0.5 flex-shrink-0" />
                                    <span>{indicator}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </HoverCardContent>
                        )}
                      </HoverCard>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center ${statusConfig[email.status].color}`}>
                        {statusConfig[email.status].icon}
                        <span className="ml-1 text-xs font-medium">
                          {statusConfig[email.status].label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border shadow-md">
                          <DropdownMenuLabel className="font-medium">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          {permissions.canBlock && (
                            <DropdownMenuItem 
                              onClick={() => handleBlockEmail(email.id)}
                              className="cursor-pointer"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              <span>Block Email</span>
                            </DropdownMenuItem>
                          )}
                          {permissions.canDelete && (
                            <DropdownMenuItem
                              onClick={() => handleDeleteEmail(email.id)}
                              className="text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/50 py-3 px-6">
            <p className="text-sm text-muted-foreground">
              Current role: <span className="font-medium capitalize">{currentRole}</span>
            </p>
            
            <Button variant="outline" size="sm" disabled={emails.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </CardFooter>
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
  )
}