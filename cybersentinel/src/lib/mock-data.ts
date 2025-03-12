import { User, Email, DashboardStats } from './types';

// Mock user data
export const currentUser: User = {
  id: 1,
  name: "Alex Johnson",
  email: "alex.johnson@company.com",
  role: 'admin',
  avatar: "/avatars/user-01.png" // Replace with your actual path
};

// Enhanced mock email data with more details for modal display
export const mockEmails: Email[] = [
  { 
    id: 1, 
    sender: "noreply@amazzon-security.com", 
    subject: "Your Amazon account has been locked", 
    receivedAt: "2025-03-10T14:32:00", 
    riskLevel: "phishing",
    status: "flagged",
    indicators: ["spoofed domain", "urgent action requested", "suspicious link"],
    recipient: "alex.johnson@company.com",
    content: `
Dear Amazon Customer,

We have detected unusual sign-in activity on your account. For your protection, we have temporarily locked your account.

To restore access to your account, please verify your information by clicking the link below:

https://security-verify.amazzon-security.com/verify?id=29481

Failure to verify within 24 hours will result in permanent account suspension.

Thank you for your cooperation,
Amazon Security Team
    `,
    links: [
      {
        url: "https://security-verify.amazzon-security.com/verify?id=29481",
        isSuspicious: true,
        reason: "Spoofed domain (Homograph attack)"
      }
    ],
    attachments: [
      {
        name: "Amazon_Verification.html",
        size: "12 KB",
        type: "text/html",
        isMalicious: true,
        reason: "Contains phishing form"
      }
    ]
  },
  { 
    id: 2, 
    sender: "updates@dropbox.com", 
    subject: "Your shared document has been updated", 
    receivedAt: "2025-03-10T11:15:00", 
    riskLevel: "suspicious",
    status: "reviewing",
    indicators: ["attachment request", "external sharing"],
    recipient: "alex.johnson@company.com",
    content: `
Hello,

A document shared with you has been updated.

Document: Q1_Financial_Report.xlsx
Updated by: james.wilson@partner-company.com

You can view the document by clicking here: https://www.dropbox.com/s/a9b8c7d6e5f4g3h2/document

Regards,
Dropbox Team
    `,
    links: [
      {
        url: "https://www.dropbox.com/s/a9b8c7d6e5f4g3h2/document",
        isSuspicious: false,
        reason: ""
      }
    ],
    attachments: []
  },
  { 
    id: 3, 
    sender: "newsletter@medium.com", 
    subject: "Weekly Digest: Top stories for you", 
    receivedAt: "2025-03-09T09:45:00", 
    riskLevel: "safe",
    status: "cleared",
    indicators: [],
    recipient: "alex.johnson@company.com",
    content: `
Hi Alex,

Here are your recommended stories for the week:

- The Future of AI in Cybersecurity
- 10 Ways to Improve Your Digital Privacy
- Understanding Zero-Trust Architecture
- New Trends in Data Science

Happy reading!
Medium Team
    `,
    links: [
      {
        url: "https://medium.com/topics/ai-cybersecurity",
        isSuspicious: false,
        reason: ""
      },
      {
        url: "https://medium.com/topics/privacy",
        isSuspicious: false,
        reason: ""
      }
    ],
    attachments: []
  },
  { 
    id: 4, 
    sender: "secur1ty@paypaI.com", 
    subject: "Urgent: Verify your account now", 
    receivedAt: "2025-03-09T16:28:00", 
    riskLevel: "phishing",
    status: "blocked",
    indicators: ["homograph attack", "urgent action", "suspicious sender"],
    recipient: "alex.johnson@company.com",
    content: `
ATTENTION: Your PayPal account has been limited!

Dear valued customer,

We have noticed suspicious activity on your PayPal account. Your account has been limited until you verify your information.

Please download the attached form, fill it out with your account details, and reply to this email.

Regards,
PayPal Security Department
    `,
    links: [],
    attachments: [
      {
        name: "PayPal_Verification_Form.doc",
        size: "38 KB",
        type: "application/msword",
        isMalicious: true,
        reason: "Contains malicious macros"
      },
      {
        name: "Restore_Account.exe",
        size: "245 KB",
        type: "application/octet-stream",
        isMalicious: true,
        reason: "Executable file"
      }
    ]
  },
  { 
    id: 5, 
    sender: "hr@companyname.com", 
    subject: "March company updates", 
    receivedAt: "2025-03-08T10:05:00", 
    riskLevel: "safe",
    status: "cleared",
    indicators: [],
    recipient: "all-staff@companyname.com",
    content: `
Hello team,

Here are the important company updates for March:

1. The annual security training is due by March 30th
2. New hybrid work policy starts next month
3. Q1 town hall meeting will be on March 24th
4. HR system maintenance on March 15th (system will be down for 2 hours)

Please let me know if you have any questions.

Best regards,
HR Department
    `,
    links: [
      {
        url: "https://training.companyname.com/security-2025",
        isSuspicious: false,
        reason: ""
      }
    ],
    attachments: [
      {
        name: "March_Newsletter.pdf",
        size: "1.2 MB",
        type: "application/pdf",
        isMalicious: false,
        reason: ""
      }
    ]
  },
  { 
    id: 6, 
    sender: "support@microsoft365.net", 
    subject: "Your Office 365 password will expire soon", 
    receivedAt: "2025-03-08T14:52:00", 
    riskLevel: "suspicious",
    status: "reviewing",
    indicators: ["unusual domain", "credential request"],
    recipient: "alex.johnson@company.com",
    content: `
Dear Microsoft 365 User,

Your Office 365 password will expire in 3 days. To maintain access to your account, please update your password immediately.

Click here to update your password: https://login.microsoft365.net/password-update

If you do not update your password, your account will be locked automatically.

Microsoft 365 Support
    `,
    links: [
      {
        url: "https://login.microsoft365.net/password-update",
        isSuspicious: true,
        reason: "Unofficial Microsoft domain"
      }
    ],
    attachments: []
  },
];

// Generate statistics based on mock data
export const generateMockStats = (emails: Email[]): DashboardStats => {
  return {
    totalEmails: emails.length,
    phishingCount: emails.filter(email => email.riskLevel === "phishing").length,
    suspiciousCount: emails.filter(email => email.riskLevel === "suspicious").length,
    safeCount: emails.filter(email => email.riskLevel === "safe").length,
    maliciousUrls: emails.reduce((count, email) => count + email.links.filter(link => link.isSuspicious).length, 0),
    fraudAttempts: emails.filter(email => email.riskLevel === "phishing").length,
    blockedCount: emails.filter(email => email.status === "blocked").length,
    weeklyChange: +12.5, // Percentage change
    weeklyTotal: 28
  };
};

// Create stats
export const mockStats: DashboardStats = generateMockStats(mockEmails);