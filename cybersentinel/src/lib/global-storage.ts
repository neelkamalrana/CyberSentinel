import { Email } from './types';

const GLOBAL_EMAILS_KEY = 'cybersentinel_global_emails';

export const globalStorage = {
  getAllEmails: (): Email[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const storedEmails = localStorage.getItem(GLOBAL_EMAILS_KEY);
      return storedEmails ? JSON.parse(storedEmails) : [];
    } catch (error) {
      console.error('Error getting emails from localStorage:', error);
      return [];
    }
  },

  saveAllEmails: (emails: Email[]): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(GLOBAL_EMAILS_KEY, JSON.stringify(emails));
    } catch (error) {
      console.error('Error saving emails to localStorage:', error);
    }
  },

  addEmail: (email: Email): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const currentEmails = globalStorage.getAllEmails();
      const updatedEmails = [email, ...currentEmails];
      globalStorage.saveAllEmails(updatedEmails);
    } catch (error) {
      console.error('Error adding email to localStorage:', error);
    }
  },

  updateEmail: (emailId: number, updatedEmail: Partial<Email>): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const currentEmails = globalStorage.getAllEmails();
      const updatedEmails = currentEmails.map(email => 
        email.id === emailId ? { ...email, ...updatedEmail } : email
      );
      globalStorage.saveAllEmails(updatedEmails);
    } catch (error) {
      console.error('Error updating email in localStorage:', error);
    }
  },

  removeEmail: (emailId: number): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const currentEmails = globalStorage.getAllEmails();
      const updatedEmails = currentEmails.filter(email => email.id !== emailId);
      globalStorage.saveAllEmails(updatedEmails);
    } catch (error) {
      console.error('Error removing email from localStorage:', error);
    }
  },

  clearAllEmails: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(GLOBAL_EMAILS_KEY);
    } catch (error) {
      console.error('Error clearing emails from localStorage:', error);
    }
  }
};