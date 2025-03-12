// User roles
export type UserRole = 'admin' | 'analyst' | 'viewer';

// Risk level types
export type RiskLevel = 'phishing' | 'suspicious' | 'safe';

// Email status types
export type EmailStatus = 'flagged' | 'reviewing' | 'blocked' | 'cleared';

// User interface
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

// Link interface
export interface EmailLink {
  url: string;
  isSuspicious: boolean;
  reason: string;
}

// Attachment interface
export interface EmailAttachment {
  name: string;
  size: string;
  type: string;
  isMalicious?: boolean;
  reason?: string;
}

// Email interface (enhanced)
export interface Email {
  id: number;
  sender: string;
  subject: string;
  receivedAt: string;
  riskLevel: RiskLevel;
  status: EmailStatus;
  indicators: string[];
  // Additional fields for detail view
  recipient: string;
  content: string;
  links: EmailLink[];
  attachments: EmailAttachment[];
}

// Stats interface
export interface DashboardStats {
  totalEmails: number;
  phishingCount: number;
  suspiciousCount: number;
  safeCount: number;
  maliciousUrls: number;
  fraudAttempts: number;
  blockedCount: number;
  weeklyChange: number;
  weeklyTotal: number;
}

// Role permissions
export interface RolePermission {
  canBlock: boolean;
  canDelete: boolean;
  canExport: boolean;
  canManageUsers: boolean;
  canChangeSettings: boolean;
}

export interface RolePermissions {
  [key: string]: RolePermission;
}