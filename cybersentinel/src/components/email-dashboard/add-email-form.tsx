"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Email, RiskLevel, EmailStatus } from '@/lib/types';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Plus,
  Brain
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AddEmailFormProps {
  onAddEmail: (email: Email) => void;
}

interface FormValues {
  sender: string;
  subject: string;
  content: string;
}

export function AddEmailForm({ onAddEmail }: AddEmailFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<{
    riskLevel: RiskLevel;
    indicators: string[];
    confidence: number;
  } | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      sender: '',
      subject: '',
      content: ''
    }
  });

  const analyzeEmail = async (data: FormValues) => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    // Simulate AI analysis with a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simplified phishing detection logic
    const senderDomain = data.sender.split('@')[1];
    const content = data.content.toLowerCase();
    const subject = data.subject.toLowerCase();
    
    const indicators: string[] = [];
    let riskLevel: RiskLevel = 'safe';
    let confidence = 0;
    
    // Check for suspicious sender domains
    if (senderDomain) {
      const suspiciousDomains = ['amazzon', 'amaz0n', 'paypaI', 'goog1e', 'micros0ft', 'microsoft365.net'];
      const hasTypos = suspiciousDomains.some(domain => senderDomain.includes(domain));
      if (hasTypos) {
        indicators.push('spoofed domain (potential homograph attack)');
        riskLevel = 'phishing';
        confidence += 30;
      }
    }
    
    // Check for urgent language
    if (
      subject.includes('urgent') || 
      subject.includes('immediate') || 
      subject.includes('alert') ||
      subject.includes('verify') ||
      subject.includes('suspended') ||
      subject.includes('locked')
    ) {
      indicators.push('urgent action requested in subject');
      if (riskLevel !== 'phishing') riskLevel = 'suspicious';
      confidence += 15;
    }
    
    // Check for suspicious content patterns
    if (
      content.includes('verify your account') ||
      content.includes('security alert') ||
      content.includes('unusual activity') ||
      content.includes('password will expire') ||
      content.includes('click here to') ||
      content.includes('limited access')
    ) {
      indicators.push('suspicious action prompts in content');
      confidence += 20;
      if (indicators.length > 1) riskLevel = 'phishing';
    }
    
    // Check for links with suspicious patterns
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = content.match(urlRegex) || [];
    
    if (urls.length > 0) {
      const suspiciousUrlPatterns = [
        'security-verify', 
        'account-confirm', 
        'login-secure',
        'password-reset'
      ];
      
      const hasSuspiciousUrls = urls.some(url => 
        suspiciousUrlPatterns.some(pattern => url.includes(pattern))
      );
      
      if (hasSuspiciousUrls) {
        indicators.push('suspicious URL patterns detected');
        riskLevel = 'phishing';
        confidence += 25;
      }
    }
    
    // Check for credential requests
    if (
      content.includes('enter your password') ||
      content.includes('provide your details') ||
      content.includes('confirm your information') ||
      content.includes('update your account')
    ) {
      indicators.push('requests for credentials or personal information');
      if (riskLevel !== 'phishing') riskLevel = 'suspicious';
      confidence += 20;
    }
    
    // Normalize confidence score
    confidence = Math.min(Math.ceil(confidence), 100);
    
    // Set risk level based on overall confidence and indicators
    if (confidence >= 60) {
      riskLevel = 'phishing';
    } else if (confidence >= 30) {
      riskLevel = 'suspicious';
    } else {
      riskLevel = 'safe';
    }
    
    // Set analysis results
    setAnalysisResults({
      riskLevel,
      indicators: indicators.length > 0 ? indicators : ['no suspicious indicators detected'],
      confidence
    });
    
    setIsAnalyzing(false);
  };

  const onSubmit = (data: FormValues) => {
    // First analyze the email
    if (!analysisResults) {
      analyzeEmail(data);
      return;
    }
    
    // If we already have analysis results, create and add the email
    const newEmail: Email = {
      id: Date.now(),
      sender: data.sender,
      subject: data.subject,
      content: data.content,
      receivedAt: new Date().toISOString(),
      riskLevel: analysisResults.riskLevel,
      status: analysisResults.riskLevel === 'phishing' ? 'flagged' : 
              analysisResults.riskLevel === 'suspicious' ? 'reviewing' : 'cleared',
      indicators: analysisResults.indicators,
      recipient: 'me@company.com',
      links: extractLinks(data.content, analysisResults.riskLevel === 'phishing'),
      attachments: []
    };
    
    onAddEmail(newEmail);
    
    // Reset form and close dialog
    form.reset();
    setAnalysisResults(null);
    setIsOpen(false);
  };

  // Helper function to extract links from content
  const extractLinks = (content: string, isSuspicious: boolean): { url: string; isSuspicious: boolean; reason: string }[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = content.match(urlRegex) || [];
    
    return urls.map(url => ({
      url,
      isSuspicious,
      reason: isSuspicious ? 'Detected in suspected phishing email' : ''
    }));
  };
  
  // Handle dialog close - reset form and analysis
  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
      setAnalysisResults(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add Email for Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Email for AI Analysis</DialogTitle>
          <DialogDescription>
            Enter email details to analyze for potential phishing or security threats.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="sender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@domain.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Email subject line" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the email content here..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Analysis Results */}
            {analysisResults && (
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">AI Analysis Results</CardTitle>
                  <CardDescription>Phishing threat assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {analysisResults.riskLevel === 'phishing' && (
                        <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                      )}
                      {analysisResults.riskLevel === 'suspicious' && (
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                      )}
                      {analysisResults.riskLevel === 'safe' && (
                        <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
                      )}
                      <span className="font-semibold capitalize">{analysisResults.riskLevel}</span>
                    </div>
                    <Badge
                      className={
                        analysisResults.riskLevel === 'phishing'
                          ? 'bg-destructive'
                          : analysisResults.riskLevel === 'suspicious'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }
                    >
                      {analysisResults.confidence}% Confidence
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Detected Indicators:</h4>
                    <ul className="space-y-1">
                      {analysisResults.indicators.map((indicator, idx) => (
                        <li key={idx} className="text-sm flex">
                          <span className="mr-2">•</span>
                          <span>{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 text-xs rounded-b-lg">
                  <p className="text-muted-foreground">
                    Analysis performed using AI-based phishing detection
                  </p>
                </CardFooter>
              </Card>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isAnalyzing || (!analysisResults && Object.values(form.getValues()).some(val => !val))}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : !analysisResults ? (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Email
                  </>
                ) : (
                  'Add to Dashboard'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
