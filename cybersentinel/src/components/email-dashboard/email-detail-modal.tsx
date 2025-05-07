"use client"

import React, { useState } from 'react';
import { Email, RiskLevel } from '@/lib/types';
import { formatDate } from '@/lib/config';
import { riskLevelConfig, statusConfig } from '@/lib/config';
import { FlagCorrection } from './flag-correction';
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
  FileText,
  AlertTriangle,
  CheckCircle,
  Flag
} from "lucide-react";

interface EmailDetailModalProps {
  email: Email | null;
  isOpen: boolean;
  onClose: () => void;
  onBlock: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateFlag?: (id: number, newRiskLevel: RiskLevel, feedback: string) => void;
  canBlock: boolean;
  canDelete: boolean;
}

export function EmailDetailModal({
  email,
  isOpen,
  onClose,
  onBlock,
  onDelete,
  onUpdateFlag,
  canBlock,
  canDelete
}: EmailDetailModalProps) {
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  
  if (!email) return null;

  const handleBlock = () => {
    onBlock(email.id);
    onClose();
  };

  const handleDelete = () => {
    onDelete(email.id);
    onClose();
  };
  
  const handleOpenCorrection = () => {
    setIsCorrectionOpen(true);
  };

  return (
    <>
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
                    <span className="ml-2">{email.recipient}</span>
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
                {email.content}
              </div>
            </div>

            {/* Links detected */}
            {email.links.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Links Detected</h4>
                <div className="space-y-2">
                  {email.links.map((link, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-md ${link.isSuspicious ? 'bg-destructive/10' : 'bg-muted/50 border'}`}
                    >
                      <div className="flex items-start">
                        {link.isSuspicious ? (
                          <AlertTriangle className="h-4 w-4 text-destructive mr-2 mt-0.5 flex-shrink-0" />
                        ) : (
                          <LinkIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex flex-col">
                          <span className={link.isSuspicious ? 'text-destructive' : ''}>
                            {link.url}
                          </span>
                          {link.isSuspicious && link.reason && (
                            <span className="text-xs text-muted-foreground">
                              Detected as: {link.reason}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments if any */}
            {email.attachments.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Attachments</h4>
                <div className="bg-muted/50 p-3 rounded-md space-y-2 border">
                  {email.attachments.map((attachment, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {attachment.isMalicious ? (
                          <AlertCircle className="h-4 w-4 text-destructive mr-2" />
                        ) : (
                          <FileText className="h-4 w-4 mr-2" />
                        )}
                        <span>{attachment.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">({attachment.size})</span>
                      </div>
                      {attachment.isMalicious && (
                        <Badge variant="destructive" className="text-xs">
                          Malicious
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                {email.attachments.some(att => att.isMalicious) && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 text-destructive mr-2 flex-shrink-0" />
                    <span>This email contains potentially malicious attachments that have been blocked.</span>
                  </div>
                )}
              </div>
            )}

            {/* Security recommendation */}
            <div className="rounded-md p-3 text-sm flex items-center mt-4">
              {email.riskLevel === 'phishing' && (
                <div className="bg-destructive/10 p-3 rounded-md flex items-center">
                  <AlertCircle className="h-4 w-4 text-destructive mr-2 flex-shrink-0" />
                  <span>This email is highly suspicious and likely a phishing attempt. Do not click any links or download attachments.</span>
                </div>
              )}
              {email.riskLevel === 'suspicious' && (
                <div className="bg-amber-500/10 p-3 rounded-md flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                  <span>This email contains suspicious elements. Exercise caution and verify with the sender before taking any action.</span>
                </div>
              )}
              {email.riskLevel === 'safe' && (
                <div className="bg-emerald-500/10 p-3 rounded-md flex items-center">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                  <span>This email appears to be legitimate and safe.</span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-wrap gap-2 sm:justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            
            <div className="flex flex-wrap gap-2">
              {onUpdateFlag && (
                <Button 
                  variant="outline" 
                  onClick={handleOpenCorrection}
                  className="flex items-center"
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Suggest Correction
                </Button>
              )}
              
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
      
      {/* Flag Correction Modal */}
      {email && onUpdateFlag && (
        <FlagCorrection
          email={email}
          isOpen={isCorrectionOpen}
          onClose={() => setIsCorrectionOpen(false)}
          onUpdateFlag={onUpdateFlag}
        />
      )}
    </>
  );
}