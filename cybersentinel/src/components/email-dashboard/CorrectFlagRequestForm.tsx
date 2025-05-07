"use client"

import React, { useState } from 'react';
import { Email, RiskLevel } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Flag,
  CheckCircle2
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from '@/lib/auth-context';
import { notificationsStore } from '@/lib/notifications-store';

interface CorrectFlagRequestFormProps {
  email: Email;
  onClose: () => void;
  onRequestSubmitted: () => void;
}

interface FormValues {
  proposedRiskLevel: RiskLevel;
  reason: string;
}

export function CorrectFlagRequestForm({ email, onClose, onRequestSubmitted }: CorrectFlagRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: authUser } = useAuth();

  const form = useForm<FormValues>({
    defaultValues: {
      proposedRiskLevel: 'safe', // Default to safe as most correction requests will be to mark as safe
      reason: '',
    }
  });

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a notification about the correction request
    notificationsStore.addNotification({
      message: `Correction request submitted by ${authUser?.name || 'a user'} for email "${email.subject}" (proposing ${data.proposedRiskLevel} risk level)`,
      emailId: email.id,
      type: 'info'
    });
    
    setIsSubmitting(false);
    onRequestSubmitted();
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">Current Assessment:</h3>
          <Badge 
            className={
              email.riskLevel === 'phishing'
                ? 'bg-destructive'
                : email.riskLevel === 'suspicious'
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }
          >
            {email.riskLevel === 'phishing' && <AlertCircle className="h-4 w-4 mr-1" />}
            {email.riskLevel === 'suspicious' && <AlertTriangle className="h-4 w-4 mr-1" />}
            {email.riskLevel === 'safe' && <CheckCircle className="h-4 w-4 mr-1" />}
            {email.riskLevel.charAt(0).toUpperCase() + email.riskLevel.slice(1)}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Submit a correction request if you believe this email has been incorrectly flagged.
          An analyst or admin will review your request.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="proposedRiskLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proposed Risk Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select proposed risk level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="safe">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                        <span>Safe - Not a security threat</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="suspicious">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                        <span>Suspicious - Needs review</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="phishing">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-destructive" />
                        <span>Phishing - Definite threat</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Justification</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Explain why you believe this email should be reclassified..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Flag className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}