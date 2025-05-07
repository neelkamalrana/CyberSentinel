import React from 'react';
import { RiskLevel, EmailStatus, RolePermissions } from './types';
import { AlertCircle, AlertTriangle, CheckCircle, Flag, Eye, Ban } from 'lucide-react';

// Risk level badge styling and icons
export const riskLevelConfig: Record<RiskLevel, {
  icon: React.ReactNode;
  color: string;
  label: string;
}> = {
  phishing: {
    icon: React.createElement(AlertCircle, { className: "h-4 w-4 mr-1" }),
    color: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    label: "Phishing"
  },
  suspicious: {
    icon: React.createElement(AlertTriangle, { className: "h-4 w-4 mr-1" }),
    color: "bg-amber-500 text-white hover:bg-amber-600",
    label: "Suspicious"
  },
  safe: {
    icon: React.createElement(CheckCircle, { className: "h-4 w-4 mr-1" }),
    color: "bg-emerald-500 text-white hover:bg-emerald-600",
    label: "Safe"
  }
};

// Status configuration
export const statusConfig: Record<EmailStatus, {
  icon: React.ReactNode;
  color: string;
  label: string;
}> = {
  flagged: {
    icon: React.createElement(Flag, { className: "h-4 w-4" }),
    color: "text-amber-500",
    label: "Flagged"
  },
  reviewing: {
    icon: React.createElement(Eye, { className: "h-4 w-4" }),
    color: "text-blue-500",
    label: "Reviewing"
  },
  blocked: {
    icon: React.createElement(Ban, { className: "h-4 w-4" }),
    color: "text-destructive",
    label: "Blocked"
  },
  cleared: {
    icon: React.createElement(CheckCircle, { className: "h-4 w-4" }),
    color: "text-emerald-500",
    label: "Cleared"
  }
};

// Role permissions
export const rolePermissions: RolePermissions = {
  admin: {
    canBlock: true,
    canDelete: true,
    canExport: true,
    canManageUsers: true,
    canChangeSettings: true,
    canSuggestCorrections: true
  },
  analyst: {
    canBlock: true,
    canDelete: false,
    canExport: true,
    canManageUsers: false,
    canChangeSettings: false,
    canSuggestCorrections: true
  },
  viewer: {
    canBlock: false,
    canDelete: false,
    canExport: true,
    canManageUsers: false,
    canChangeSettings: false,
    canSuggestCorrections: true  // Allow viewers to suggest corrections
  }
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};