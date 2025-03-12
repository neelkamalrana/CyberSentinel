"use client"

import React from 'react';
import { Email } from '@/lib/types';
import { formatDate } from '@/lib/config';
import { riskLevelConfig, statusConfig } from '@/lib/config';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Clock,
  Link as LinkIcon,
  Mail,
  Calendar,
  ExternalLink,
  Trash2,
  Ban,
  Archive
} from "lucide-react";

interface EmailDetailModalProps {
  email: Email | null;
  isOpen: boolean;
  onClose: () => void;
  onBlock: (id: number) => void;
  onDelete: (id: number) => void;
  canBlock: boolean;
  canDelete: boolean;
}

export function EmailDetailModal({
  email,
  isOpen,
  onClose,
  onBlock,
  onDelete,
  canBlock,
  canDelete
}: EmailDetailModalProps) {
  if (!email) return null;

  const handleBlock = () => {
    onBlock(email.id);
    onClose();
  };

  const handleDelete = () => {
    onDelete(email.id);
    onClose();
  };

  // Mock email content
  const mockContent = `
Dear Customer,

We have detected unusual activity on your account. To ensure your account security, 
please verify your information immediately by clicking the link below:

${email.riskLevel === 'phishing' ? 'https://security-verify.amazzon-security.com/verify' : 'https://account.amazon.com/security'}

Failure to verify your account within 24 hours may result in account suspension.

Regards,
${email.sender.split('@')[0]} Team
  `;

  // Mock email attachments for phishing emails
  const mockAttachments = email.riskLevel === 'phishing' ? [
    { name: 'Invoice_PDF.exe', size: '245 KB', type: 'application/octet-stream' },
    { name: 'Account_Details.html', size: '12 KB', type: 'text/html' }
  ] : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Details
          </DialogTitle>
          <DialogDescription>
            Detailed analysis of the email message
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Email header information */}
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{email.subject}</h3>
              <Badge 
                className={`flex items-center ${riskLevelConfig[email.riskLevel].color}`}
              >
                {riskLevelConfig[email.riskLevel].icon}
                {riskLevelConfig[email.riskLevel].label}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="font-medium">From:</span>
                  <span className="ml-2">{email.sender}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="font-medium">To:</span>
                  <span className="ml-2">you@company.com</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">{formatDate(email.receivedAt)}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="font-medium">Status:</span>
                  <span className={`ml-2 flex items-center ${statusConfig[email.status].color}`}>
                    {statusConfig[email.status].icon}
                    <span className="ml-1">{statusConfig[email.status].label}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Risk indicators */}
          {email.indicators.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Detection Indicators</h4>
              <div className="bg-muted p-3 rounded-md">
                <ul className="space-y-2">
                  {email.indicators.map((indicator, idx) => (
                    <li key={idx} className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-destructive mr-2 mt-0.5 flex-shrink-0" />
                      <span>{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Email content */}
          <div className="space-y-3">
            <h4 className="font-medium">Email Content</h4>
            <div className="bg-muted/50 p-4 rounded-md whitespace-pre-line border">
              {mockContent}
            </div>
          </div>

          {/* Links detected */}
          {email.riskLevel === 'phishing' && (
            <div className="space-y-3">
              <h4 className="font-medium">Suspicious Links Detected</h4>
              <div className="bg-destructive/10 p-3 rounded-md space-y-2">
                <div className="flex items-start">
                  <LinkIcon className="h-4 w-4 text-destructive mr-2 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-destructive">https://security-verify.amazzon-security.com/verify</span>
                    <span className="text-xs text-muted-foreground">Detected as: Spoofed domain (Homograph attack)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attachments if any */}
          {mockAttachments.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Attachments</h4>
              <div className="bg-muted/50 p-3 rounded-md space-y-2 border">
                {mockAttachments.map((attachment, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className={`h-4 w-4 ${attachment.name.endsWith('.exe') ? 'text-destructive' : 'text-amber-500'} mr-2`} />
                      <span>{attachment.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({attachment.size})</span>
                    </div>
                    {attachment.name.endsWith('.exe') && (
                      <Badge variant="destructive" className="text-xs">Malicious</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          <div className="flex gap-2">
            {canBlock && email.status !== 'blocked' && (
              <Button variant="destructive" onClick={handleBlock}>
                <Ban className="mr-2 h-4 w-4" />
                Block Email
              </Button>
            )}
            {canDelete && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}