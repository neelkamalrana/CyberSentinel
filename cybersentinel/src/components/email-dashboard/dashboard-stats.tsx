"use client"

import React from 'react';
import type { DashboardStats } from '@/lib/types';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent 
} from "@/components/ui/card";
import { LinkIcon, Zap } from 'lucide-react';

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
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
                <span>Phishing: {stats.phishingCount}</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                <span>Suspicious: {stats.suspiciousCount}</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                <span>Safe: {stats.safeCount}</span>
              </div>
            </div>
            <div className="h-20 w-20 rounded-full border-4 border-muted flex items-center justify-center bg-card shadow-sm">
              <span className="text-lg font-bold">{stats.totalEmails}</span>
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
            <span className="text-2xl font-bold">{stats.maliciousUrls}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-destructive h-2.5 rounded-full" 
              style={{ width: `${(stats.maliciousUrls / 10) * 100}%` }}
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
            <span className="text-2xl font-bold">{stats.fraudAttempts}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-amber-500 h-2.5 rounded-full" 
              style={{ width: `${(stats.fraudAttempts / 10) * 100}%` }}
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
            <span className="text-2xl font-bold">{stats.weeklyTotal}</span>
          </div>
          <div className="flex items-center">
            <span className={`text-sm ${stats.weeklyChange >= 0 ? 'text-destructive' : 'text-emerald-500'}`}>
              {stats.weeklyChange >= 0 ? "+" : ""}{stats.weeklyChange}%
            </span>
            <span className="text-sm text-muted-foreground ml-2">from last week</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}