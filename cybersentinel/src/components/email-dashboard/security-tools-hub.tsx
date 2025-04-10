"use client"

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CreditCard, LinkIcon } from "lucide-react";
import { AddEmailForm } from './add-email-form';
import { TransactionAnalyzer } from './transaction-analyzer';
import { UrlChecker } from './url-checker';
import { Email } from '@/lib/types';

interface SecurityToolsHubProps {
  onAddEmail?: (email: Email) => void;
}

export function SecurityToolsHub({ onAddEmail }: SecurityToolsHubProps) {
  const [activeTab, setActiveTab] = useState<string>("email");

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Security Analysis Tools</CardTitle>
        <CardDescription>
          Analyze emails, transactions, and URLs for potential security threats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="email" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Email Analysis
            </TabsTrigger>
            <TabsTrigger value="transaction" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Transaction Fraud
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center">
              <LinkIcon className="mr-2 h-4 w-4" />
              URL Checker
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="mt-0">
            <div className="bg-muted/30 p-6 rounded-md">
              <h3 className="text-lg font-medium mb-4">Email Phishing Detection</h3>
              <p className="text-muted-foreground mb-6">
                Upload an email to analyze it for phishing attempts and security threats.
                Our AI will classify the email as safe, suspicious, or dangerous.
              </p>
              <AddEmailForm onAddEmail={onAddEmail} />
            </div>
          </TabsContent>
          
          <TabsContent value="transaction" className="mt-0">
            <div className="bg-muted/30 p-6 rounded-md">
              <h3 className="text-lg font-medium mb-4">Transaction Fraud Detection</h3>
              <p className="text-muted-foreground mb-6">
                Upload transaction data to identify potentially fraudulent activities.
                Our system will analyze patterns and flag suspicious transactions.
              </p>
              <TransactionAnalyzer />
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="mt-0">
            <div className="bg-muted/30 p-6 rounded-md">
              <h3 className="text-lg font-medium mb-4">URL Safety Checker</h3>
              <p className="text-muted-foreground mb-6">
                Check if a URL is potentially malicious before visiting.
                Our system analyzes the URL structure and domain reputation.
              </p>
              <UrlChecker />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}