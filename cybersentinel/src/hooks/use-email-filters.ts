import { useState, useEffect } from 'react';
import { Email, RiskLevel, EmailStatus } from '@/lib/types';

export function useEmailFilters(allEmails: Email[]) {
  const [emails, setEmails] = useState<Email[]>(allEmails);
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Filter emails based on risk level, status and search query
  useEffect(() => {
    let filtered = allEmails;
    
    // Apply risk level filter
    if (filterRisk !== "all") {
      filtered = filtered.filter(email => email.riskLevel === filterRisk);
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(email => email.status === filterStatus);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(email => 
        email.sender.toLowerCase().includes(query) || 
        email.subject.toLowerCase().includes(query)
      );
    }
    
    setEmails(filtered);
  }, [filterRisk, filterStatus, searchQuery, allEmails]);

  return {
    emails,
    setEmails,
    filterRisk,
    setFilterRisk,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery
  };
}