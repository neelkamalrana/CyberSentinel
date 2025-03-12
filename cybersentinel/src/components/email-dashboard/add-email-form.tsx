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
  Brain,
  LinkIcon
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

interface AnalysisResult {
  riskLevel: RiskLevel;
  confidence: number;
  indicators: string[];
  analysis: string;
  suspiciousLinks: { url: string; reason: string }[];
  recommendedAction: string;
}

export function AddEmailForm({ onAddEmail }: AddEmailFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

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
    setAnalysisError(null);
    
    console.log("Attempting to analyze email with data:", data);
    
    try {
      // Call our API route
      console.log("Sending request to /api/analyze-email...");
      const response = await fetch('/api/analyze-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: data.sender,
          subject: data.subject,
          content: data.content
        }),
      });
      
      console.log("Response received:", response.status, response.statusText);
      
      if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error("API Error Details:", errorData);
          errorMessage = errorData.error || errorMessage;
          if (errorData.details) {
            console.error("API Error Full Details:", JSON.stringify(errorData.details, null, 2));
          }
        } catch (e) {
          console.error("Could not parse error response");
        }
        throw new Error(errorMessage);
      }
      
      console.log("Parsing response JSON...");
      const analysisResult = await response.json();
      console.log("Analysis result:", analysisResult);
      setAnalysisResults(analysisResult);
    } catch (error) {
      console.error('Error analyzing email:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Failed to analyze the email');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = (data: FormValues) => {
    // First analyze the email if not already analyzed
    if (!analysisResults) {
      console.log("No analysis results yet, starting analysis...");
      analyzeEmail(data);
      return;
    }
    
    console.log("Analysis complete, creating new email entry");
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
      links: formatLinks(analysisResults.suspiciousLinks || [], data.content),
      attachments: []
    };
    
    onAddEmail(newEmail);
    
    // Reset form and close dialog
    form.reset();
    setAnalysisResults(null);
    setIsOpen(false);
  };

  // Helper function to format links from analysis results and content
  const formatLinks = (
    suspiciousLinks: { url: string; reason: string }[], 
    content: string
  ) => {
    // Extract all links from content with a simple regex
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const allLinks = content.match(urlRegex) || [];
    
    // Create a map of suspicious links
    const suspiciousMap = new Map();
    suspiciousLinks.forEach(link => {
      suspiciousMap.set(link.url, link.reason);
    });
    
    // Return formatted links
    return allLinks.map(url => ({
      url,
      isSuspicious: suspiciousMap.has(url),
      reason: suspiciousMap.get(url) || ''
    }));
  };
  
  // Handle dialog close - reset form and analysis
  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
      setAnalysisResults(null);
      setAnalysisError(null);
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
            Enter email details to analyze for potential phishing or security threats using advanced AI.
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
            
            {/* Error Message */}
            {analysisError && (
              <div className="bg-destructive/10 p-3 rounded-md text-destructive flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Analysis failed</p>
                  <p className="text-sm">{analysisError}</p>
                </div>
              </div>
            )}
            
            {/* Analysis Results */}
            {analysisResults && (
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">AI Analysis Results</CardTitle>
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
                  <CardDescription>Phishing threat assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  
                  <Separator />
                  
                  {/* Analysis explanation */}
                  <div className="text-sm">
                    <p>{analysisResults.analysis}</p>
                  </div>
                  
                  {/* Detected Indicators */}
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
                  
                  {/* Suspicious Links */}
                  {analysisResults.suspiciousLinks && analysisResults.suspiciousLinks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Suspicious Links:</h4>
                      <ul className="space-y-2">
                        {analysisResults.suspiciousLinks.map((link, idx) => (
                          <li key={idx} className="text-sm p-2 bg-destructive/10 rounded-md">
                            <div className="flex items-start">
                              <LinkIcon className="h-4 w-4 text-destructive mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-destructive break-all">{link.url}</p>
                                <p className="text-xs text-muted-foreground mt-1">{link.reason}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Recommended Action */}
                  <div className="mt-4 p-3 rounded-md bg-muted text-sm">
                    <h4 className="font-medium mb-1">Recommended Action:</h4>
                    <p>{analysisResults.recommendedAction}</p>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 text-xs rounded-b-lg">
                  <p className="text-muted-foreground">
                    Analysis performed using OpenAI GPT-4 Turbo
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
                className={analysisResults ? 
                  (analysisResults.riskLevel === 'phishing' ? 'bg-destructive hover:bg-destructive/90' : '') : ''}
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