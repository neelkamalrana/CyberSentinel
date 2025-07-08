# CyberSentinel

CyberSentinel is a security-focused email analysis dashboard built with [Next.js](https://nextjs.org). It allows you to analyze emails for phishing, suspicious, and safe content. The app provides a dashboard for monitoring email security and includes tools for analyzing and flagging emails.

## Features
- Email dashboard with risk analysis (phishing, suspicious, safe)
- Security tools for email analysis
- Notification system for flagged emails
- Responsive and modern UI

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/neelkamalrana/CyberSentinel.git
cd CyberSentinel/cybersentinel
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set up environment variables
Create a `.env.local` file in the `cybersentinel` directory with the following variables:
```
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Build & Production
To build for production:
```bash
npm run build
npm start
```

## Linting
To check for linting issues:
```bash
npm run lint
```

## Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## License
This project is for educational/demo purposes.
