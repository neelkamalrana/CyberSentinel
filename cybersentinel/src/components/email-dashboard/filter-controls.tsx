"use client"

import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FilterControlsProps {
  filterRisk: string;
  setFilterRisk: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export function FilterControls({
  filterRisk,
  setFilterRisk,
  filterStatus,
  setFilterStatus,
  searchQuery,
  setSearchQuery
}: FilterControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <div className="w-full sm:w-1/4">
        <Label htmlFor="risk-filter" className="text-sm font-medium">Risk Level</Label>
        <Select 
          onValueChange={setFilterRisk} 
          defaultValue={filterRisk}
        >
          <SelectTrigger id="risk-filter" className="bg-background border-input">
            <SelectValue placeholder="All Risk Levels" />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-md">
            <SelectGroup>
              <SelectLabel>Risk Levels</SelectLabel>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="phishing">Phishing</SelectItem>
              <SelectItem value="suspicious">Suspicious</SelectItem>
              <SelectItem value="safe">Safe</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-1/4">
        <Label htmlFor="status-filter" className="text-sm font-medium">Status</Label>
        <Select 
          onValueChange={setFilterStatus} 
          defaultValue={filterStatus}
        >
          <SelectTrigger id="status-filter" className="bg-background border-input">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-md">
            <SelectGroup>
              <SelectLabel>Email Status</SelectLabel>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="reviewing">Under Review</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="cleared">Cleared</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-2/4">
        <Label htmlFor="search" className="text-sm font-medium">Search</Label>
        <Input
          id="search"
          placeholder="Search by sender or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-background border-input"
        />
      </div>
    </div>
  );
}