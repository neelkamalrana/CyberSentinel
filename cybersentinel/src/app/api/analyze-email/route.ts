import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { sender, subject, content } = await req.json();

    // Validate required fields
    if (!sender || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: sender, subject, and content are required' },
        { status: 400 }
      );
    }

    // Create the prompt for OpenAI
    const prompt = `
You are an advanced email security system analyzing an email for phishing or security threats.
Analyze the following email for potential phishing indicators or security threats. Be thorough and precise.

Sender: ${sender}
Subject: ${subject}
Content:
${content}

Provide your analysis in the following JSON format:
{
  "riskLevel": "phishing" | "suspicious" | "safe",
  "confidence": [percentage between 0-100],
  "indicators": [array of specific security indicators detected],
  "analysis": [brief explanation of your assessment],
  "suspiciousLinks": [array of suspicious URLs detected],
  "recommendedAction": [what action should be taken]
}

Consider these phishing indicators in your analysis:
1. Spoofed domains or typosquatting attempts
2. Urgent language demanding immediate action
3. Suspicious URL patterns or redirect links
4. Requests for sensitive information or credentials
5. Grammar, spelling, or formatting issues
6. Impersonation of trusted entities
7. Mismatched URL text and actual destinations
8. Unsolicited attachments or download requests
`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2, // Lower temperature for more consistent, analytical responses
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    });

    // Extract and parse the response
    const responseContent = response.choices[0].message.content;
    
    if (!responseContent) {
      return NextResponse.json(
        { error: 'Failed to get a valid response from AI analysis' },
        { status: 500 }
      );
    }

    try {
      // Parse the JSON response
      const analysisResult = JSON.parse(responseContent);
      
      // Return the analysis results
      return NextResponse.json(analysisResult);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse AI analysis result', raw: responseContent },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in email analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze email' },
      { status: 500 }
    );
  }
}