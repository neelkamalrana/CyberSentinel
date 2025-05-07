import { Email } from './types';

const USER_EMAILS_KEY = (userId: string) => `cybersentinel_user_emails_${userId}`;

export const userStorage = {
  getUserEmails: (userEmail: string): Email[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const storedEmails = localStorage.getItem(USER_EMAILS_KEY(userEmail));
      return storedEmails ? JSON.parse(storedEmails) : [];
    } catch (error) {
      console.error('Error getting user emails from localStorage:', error);
      return [];
    }
  },

  saveUserEmails: (userEmail: string, emails: Email[]): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(USER_EMAILS_KEY(userEmail), JSON.stringify(emails));
    } catch (error) {
      console.error('Error saving user emails to localStorage:', error);
    }
  },

  addUserEmail: (userEmail: string, email: Email): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const currentEmails = userStorage.getUserEmails(userEmail);
      const updatedEmails = [email, ...currentEmails];
      userStorage.saveUserEmails(userEmail, updatedEmails);
    } catch (error) {
      console.error('Error adding email to localStorage:', error);
    }
  },

  updateUserEmail: (userEmail: string, emailId: number, updatedEmail: Partial<Email>): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const currentEmails = userStorage.getUserEmails(userEmail);
      const updatedEmails = currentEmails.map(email => 
        email.id === emailId ? { ...email, ...updatedEmail } : email
      );
      userStorage.saveUserEmails(userEmail, updatedEmails);
    } catch (error) {
      console.error('Error updating email in localStorage:', error);
    }
  },

  removeUserEmail: (userEmail: string, emailId: number): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const currentEmails = userStorage.getUserEmails(userEmail);
      const updatedEmails = currentEmails.filter(email => email.id !== emailId);
      userStorage.saveUserEmails(userEmail, updatedEmails);
    } catch (error) {
      console.error('Error removing email from localStorage:', error);
    }
  },

  clearUserEmails: (userEmail: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(USER_EMAILS_KEY(userEmail));
    } catch (error) {
      console.error('Error clearing user emails from localStorage:', error);
    }
  }
};