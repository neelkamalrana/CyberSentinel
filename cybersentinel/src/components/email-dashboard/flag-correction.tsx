"use client"

import React, { useState } from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle,
  Loader2
} from 'lucide-react';
import { RiskLevel, Email } from '@/lib/types';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FlagCorrectionProps {
  email: Email;
  isOpen: boolean;
  onClose: () => void;
  onUpdateFlag: (id: number, newRiskLevel: RiskLevel, feedback: string) => void;
}

export function FlagCorrection({ 
  email, 
  isOpen, 
  onClose, 
  onUpdateFlag 
}: FlagCorrectionProps) {
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<RiskLevel>(email.riskLevel);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate a slight delay for processing
    setTimeout(() => {
      onUpdateFlag(email.id, selectedRiskLevel, feedback);
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  const getRiskIcon = (risk: RiskLevel) => {
    switch (risk) {
      case 'phishing':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'suspicious':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'safe':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Suggest Risk Level Correction</DialogTitle>
          <DialogDescription>
            If you believe this email has been incorrectly classified, you can suggest a correction.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Current Classification</h3>
            <div className="flex items-center p-3 bg-muted rounded-md">
              {getRiskIcon(email.riskLevel)}
              <span className="ml-2 capitalize">{email.riskLevel}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Suggest New Classification</h3>
            <RadioGroup 
              value={selectedRiskLevel} 
              onValueChange={(value) => setSelectedRiskLevel(value as RiskLevel)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                <RadioGroupItem value="phishing" id="phishing" />
                <Label htmlFor="phishing" className="flex items-center cursor-pointer">
                  <AlertCircle className="h-4 w-4 text-destructive mr-2" />
                  <span>Phishing (High Risk)</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                <RadioGroupItem value="suspicious" id="suspicious" />
                <Label htmlFor="suspicious" className="flex items-center cursor-pointer">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                  <span>Suspicious (Medium Risk)</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                <RadioGroupItem value="safe" id="safe" />
                <Label htmlFor="safe" className="flex items-center cursor-pointer">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                  <span>Safe (No Risk)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Feedback (Optional)</h3>
            <Textarea
              placeholder="Why do you think this email should be reclassified?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || selectedRiskLevel === email.riskLevel}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Correction'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}