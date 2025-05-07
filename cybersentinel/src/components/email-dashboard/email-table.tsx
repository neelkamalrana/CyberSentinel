"use client"

import React, { useState, useEffect } from 'react';
import { Email, RolePermission } from '@/lib/types';
import { formatDate } from '@/lib/config';
import { riskLevelConfig, statusConfig } from '@/lib/config';
import { EmailDetailModal } from './email-detail-modal';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { 
  Separator 
} from "@/components/ui/separator";
import { 
  AlertCircle, 
  Clock, 
  MoreHorizontal,
  Eye,
  Ban,
  Trash2,
  Download
} from "lucide-react";

interface EmailTableProps {
  emails: Email[];
  totalEmails: number;
  permissions: RolePermission;
  onBlockEmail: (id: number) => void;
  onDeleteEmail: (id: number) => void;
  currentRole: string;
  selectedEmailId?: number | null;
  setSelectedEmailId?: (id: number | null) => void;
}

export function EmailTable({ 
  emails, 
  totalEmails, 
  permissions, 
  onBlockEmail, 
  onDeleteEmail,
  currentRole,
  selectedEmailId,
  setSelectedEmailId
}: EmailTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  // Handle auto-opening email detail when selectedEmailId is provided (from notification)
  useEffect(() => {
    if (selectedEmailId) {
      const emailToOpen = emails.find(email => email.id === selectedEmailId);
      if (emailToOpen) {
        setSelectedEmail(emailToOpen);
        setIsModalOpen(true);
      }
    }
  }, [selectedEmailId, emails]);

  const handleViewDetails = (email: Email) => {
    setSelectedEmail(email);
    if (setSelectedEmailId) {
      setSelectedEmailId(email.id);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (setSelectedEmailId) {
      setSelectedEmailId(null);
    }
    // Keep the selected email for a moment to prevent UI flicker during modal close animation
    setTimeout(() => setSelectedEmail(null), 300);
  };

  return (
    <>
      <Table>
        <TableCaption>
          {emails.length === 0 
            ? "No emails match your filters"
            : `Showing ${emails.length} of ${totalEmails} emails`
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
            <TableRow 
              key={email.id} 
              className={`hover:bg-muted/50 cursor-pointer ${email.id === selectedEmailId ? 'bg-muted' : ''}`}
              onClick={() => handleViewDetails(email)}
            >
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
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-background border shadow-md">
                    <DropdownMenuLabel className="font-medium">Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(email);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    {permissions.canBlock && (
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onBlockEmail(email.id);
                        }}
                        className="cursor-pointer"
                        disabled={email.status === 'blocked'}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        <span>Block Email</span>
                      </DropdownMenuItem>
                    )}
                    {permissions.canDelete && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteEmail(email.id);
                        }}
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
      
      <div className="flex justify-between border-t bg-muted/50 py-3 px-6 mt-4">
        <p className="text-sm text-muted-foreground">
          Current role: <span className="font-medium capitalize">{currentRole}</span>
        </p>
        
        <Button variant="outline" size="sm" disabled={emails.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export Results
        </Button>
      </div>

      {/* Email Detail Modal */}
      <EmailDetailModal 
        email={selectedEmail}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBlock={onBlockEmail}
        onDelete={onDeleteEmail}
        canBlock={permissions.canBlock}
        canDelete={permissions.canDelete}
      />
    </>
  );
}