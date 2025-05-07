"use client"

import PhishingDashboard from '@/components/email-dashboard';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <PhishingDashboard />
    </AuthGuard>
  );
}