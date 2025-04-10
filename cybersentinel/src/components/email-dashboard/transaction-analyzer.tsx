"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  CheckCircle,
  Upload,
  Loader2,
  CreditCard,
  DollarSign,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
} from "lucide-react";
import { useForm } from "react-hook-form";

interface TransactionData {
  id: string;
  date: string;
  amount: string;
  description: string;
  account: string;
  category: string;
}

interface FraudAnalysisResult {
  overallStatus: 'normal' | 'suspicious';
  confidenceScore: number;
  suspiciousTransactions: {
    transactionId: string;
    reason: string;
    riskLevel: number;
  }[];
  normalTransactions: string[];
  analysisDetails: string;
}

export function TransactionAnalyzer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<FraudAnalysisResult | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'text' | 'file'>('text');
  const [fileName, setFileName] = useState("");

  const form = useForm({
    defaultValues: {
      transactionData: '',
      fileUpload: null as unknown as FileList,
    }
  });

  const handleUpload = async (data: any) => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis results
      const mockResults: FraudAnalysisResult = {
        overallStatus: Math.random() > 0.6 ? 'suspicious' : 'normal',
        confidenceScore: Math.floor(Math.random() * 30) + 70,
        suspiciousTransactions: [
          {
            transactionId: 'TX' + Math.floor(Math.random() * 10000),
            reason: 'Unusual transaction amount compared to history',
            riskLevel: 0.85
          },
          {
            transactionId: 'TX' + Math.floor(Math.random() * 10000),
            reason: 'Unusual location and time of transaction',
            riskLevel: 0.72
          }
        ],
        normalTransactions: ['TX10023', 'TX10024', 'TX10025', 'TX10026'],
        analysisDetails: 'The system detected unusual patterns in 2 transactions that deviate from your normal spending behavior.',
      };
      
      if (Math.random() > 0.7) {
        mockResults.suspiciousTransactions.pop(); // Randomly have fewer suspicious transactions
      }
      
      setAnalysisResults(mockResults);
    } catch (error) {
      console.error('Error analyzing transactions:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };
  
  const mockTransactions: TransactionData[] = [
    { 
      id: "TX10023", 
      date: "2025-04-07", 
      amount: "$84.50", 
      description: "Grocery Store Purchase", 
      account: "Main Checking", 
      category: "Groceries"
    },
    { 
      id: "TX10024", 
      date: "2025-04-07", 
      amount: "$32.99", 
      description: "Gas Station", 
      account: "Main Checking", 
      category: "Transportation"
    },
    { 
      id: "TX10025", 
      date: "2025-04-06", 
      amount: "$129.99", 
      description: "Online Shopping", 
      account: "Credit Card", 
      category: "Shopping"
    },
    { 
      id: "TX10026", 
      date: "2025-04-05", 
      amount: "$9.99", 
      description: "Subscription Service", 
      account: "Credit Card", 
      category: "Entertainment"
    },
    { 
      id: "TX10027", 
      date: "2025-04-04", 
      amount: "$1,999.99", 
      description: "Electronics Store", 
      account: "Main Checking", 
      category: "Electronics"
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <CreditCard className="mr-2 h-4 w-4" />
          Analyze Transactions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Fraud Analysis</DialogTitle>
          <DialogDescription>
            Upload transaction data to analyze for potentially fraudulent activities.
          </DialogDescription>
        </DialogHeader>
        
        {!analysisResults ? (
          <form onSubmit={form.handleSubmit(handleUpload)} className="space-y-4">
            <div className="flex space-x-4 mb-4">
              <Button
                type="button"
                variant={uploadMethod === 'text' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('text')}
                className="flex-1"
              >
                <FileText className="mr-2 h-4 w-4" />
                Paste Data
              </Button>
              <Button
                type="button"
                variant={uploadMethod === 'file' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('file')}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </div>
            
            {uploadMethod === 'text' ? (
              <div className="space-y-2">
                <Label htmlFor="transactionData">Transaction Data (CSV or JSON format)</Label>
                <Textarea
                  id="transactionData"
                  placeholder="Paste your transaction data here..."
                  className="min-h-[200px]"
                  {...form.register('transactionData')}
                />
                <p className="text-xs text-muted-foreground">
                  Format: date,amount,description,account,category (CSV) or JSON array
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="fileUpload">Upload Transaction File</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drop your CSV, JSON, or Excel file here, or click to browse
                  </p>
                  <Input
                    id="fileUpload"
                    type="file"
                    accept=".csv,.json,.xlsx,.xls"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('fileUpload')?.click()}
                  >
                    Select File
                  </Button>
                  {fileName && (
                    <p className="text-sm mt-2">
                      Selected: <span className="font-medium">{fileName}</span>
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Analyze for Fraud
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Analysis Results</CardTitle>
                  <Badge
                    className={
                      analysisResults.overallStatus === 'suspicious'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }
                  >
                    {analysisResults.confidenceScore}% Confidence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center mb-4">
                  {analysisResults.overallStatus === 'suspicious' ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
                  )}
                  <span className="font-semibold">
                    {analysisResults.overallStatus === 'suspicious'
                      ? 'Suspicious Activity Detected'
                      : 'All Transactions Appear Normal'}
                  </span>
                </div>
                
                <p className="text-sm mb-4">{analysisResults.analysisDetails}</p>
                
                <Separator className="my-4" />
                
                <h4 className="font-medium mb-2">Transaction Overview</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((transaction) => {
                      const isSuspicious = analysisResults.suspiciousTransactions.some(
                        t => t.transactionId === transaction.id
                      );
                      const suspiciousDetails = analysisResults.suspiciousTransactions.find(
                        t => t.transactionId === transaction.id
                      );
                      
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {transaction.date}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {transaction.amount}
                            </div>
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            {isSuspicious ? (
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Suspicious
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Normal
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                
                {analysisResults.suspiciousTransactions.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium">Suspicious Transactions Details</h4>
                    {analysisResults.suspiciousTransactions.map((transaction) => (
                      <Card key={transaction.transactionId} className="bg-amber-500/5 border-amber-200">
                        <CardContent className="pt-4">
                          <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Transaction ID: {transaction.transactionId}</p>
                              <p className="text-sm mt-1">{transaction.reason}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                Risk Score: {(transaction.riskLevel * 100).toFixed(0)}%
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button onClick={() => setAnalysisResults(null)}>
                Analyze New Data
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}