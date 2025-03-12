import { User, Email, DashboardStats } from './types';

// Mock user data
export const currentUser: User = {
  id: 1,
  name: "Alex Johnson",
  email: "alex.johnson@company.com",
  role: 'admin',
  avatar: "/avatars/user-01.png" // Replace with your actual path
};

// Mock email data
export const mockEmails: Email[] = [
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

// Generate statistics based on mock data
export const generateMockStats = (emails: Email[]): DashboardStats => {
  return {
    totalEmails: emails.length,
    phishingCount: emails.filter(email => email.riskLevel === "phishing").length,
    suspiciousCount: emails.filter(email => email.riskLevel === "suspicious").length,
    safeCount: emails.filter(email => email.riskLevel === "safe").length,
    maliciousUrls: 7,
    fraudAttempts: 3,
    blockedCount: emails.filter(email => email.status === "blocked").length,
    weeklyChange: +12.5, // Percentage change
    weeklyTotal: 28
  };
};

// Create stats
export const mockStats: DashboardStats = generateMockStats(mockEmails);