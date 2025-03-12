import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download necessary NLTK resources
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')

# Sample data - in a real scenario, you would load this from a CSV or database
emails = [
    {"content": "Dear user, your account has been compromised. Click here to reset: http://malicious-link.com", "is_phishing": 1},
    {"content": "URGENT: Your PayPal account has been limited! Verify now: http://paypa1-security.com/verify", "is_phishing": 1},
    {"content": "You've won a $1000 gift card! Claim now at http://free-gifts.net/claim", "is_phishing": 1},
    {"content": "Your password will expire in 24 hours. Update immediately: http://company-login.net", "is_phishing": 1},
    {"content": "Bank alert: Unusual activity detected. Verify your identity: http://bank-verify.co/secure", "is_phishing": 1},
    {"content": "Hi team, please review the attached quarterly report and let me know your thoughts.", "is_phishing": 0},
    {"content": "Your Amazon order #12345 has shipped. Track your package at amazon.com/orders", "is_phishing": 0},
    {"content": "Meeting reminder: Project review at 2pm in Conference Room B. Bring your notes.", "is_phishing": 0},
    {"content": "Thank you for your payment. Your receipt is attached. Best regards, Accounting Team", "is_phishing": 0},
    {"content": "The latest company newsletter is now available. Read about our new initiatives at company.com/news", "is_phishing": 0},
    # Add more examples for better training
]

# Convert to DataFrame
df = pd.DataFrame(emails)

# Text preprocessing function
def preprocess_text(text):
    # Convert to lowercase
    text = text.lower()
    
    # Remove URLs (common in phishing emails)
    text = re.sub(r'https?://\S+|www\.\S+', 'URL', text)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', 'EMAIL', text)
    
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Tokenize
    tokens = nltk.word_tokenize(text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]
    
    # Lemmatization
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    
    return ' '.join(tokens)

# Apply preprocessing
df['processed_content'] = df['content'].apply(preprocess_text)

# Split data into features and target
X = df['processed_content']
y = df['is_phishing']

# Split into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Convert text to features using TF-IDF
vectorizer = TfidfVectorizer(max_features=1000)
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# Train a Random Forest Classifier
classifier = RandomForestClassifier(n_estimators=100, random_state=42)
classifier.fit(X_train_tfidf, y_train)

# Make predictions
y_pred = classifier.predict(X_test_tfidf)

# Evaluate the model
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Function to predict if a new email is phishing
def predict_phishing(email_content):
    # Preprocess the email
    processed_email = preprocess_text(email_content)
    
    # Vectorize
    email_tfidf = vectorizer.transform([processed_email])
    
    # Predict
    prediction = classifier.predict(email_tfidf)[0]
    probability = classifier.predict_proba(email_tfidf)[0]
    
    result = {
        "is_phishing": bool(prediction),
        "confidence": probability[1] if prediction == 1 else probability[0],
        "indicators": extract_phishing_indicators(email_content)
    }
    
    return result

# Function to extract common phishing indicators
def extract_phishing_indicators(email_content):
    indicators = []
    
    # Check for urgency language
    urgency_words = ["urgent", "immediately", "alert", "attention", "important"]
    if any(word in email_content.lower() for word in urgency_words):
        indicators.append("Contains urgent language")
    
    # Check for suspicious URLs
    suspicious_domains = ["login", "verify", "secure", "account", "update", "confirm"]
    url_pattern = re.compile(r'https?://([^\s/]+)')
    urls = url_pattern.findall(email_content)
    
    for url in urls:
        # Check for suspicious domains
        if any(word in url.lower() for word in suspicious_domains):
            indicators.append(f"Suspicious URL: {url}")
        
        # Check for IP addresses in URLs
        if re.match(r'\d+\.\d+\.\d+\.\d+', url):
            indicators.append(f"URL contains IP address: {url}")
        
        # Check for typosquatting (common brands with slight modifications)
        common_brands = ["paypal", "amazon", "apple", "microsoft", "google", "facebook"]
        for brand in common_brands:
            if brand in url.lower() and brand not in url.lower():
                indicators.append(f"Possible typosquatting: {url}")
    
    # Check for requesting personal information
    info_words = ["password", "social security", "credit card", "ssn", "account number"]
    if any(word in email_content.lower() for word in info_words):
        indicators.append("Requests sensitive information")
    
    return indicators

# Example usage
test_email = """
URGENT: Your PayPal account has been locked due to suspicious activity.
Please verify your information at http://paypa1-secure-login.com to restore access.
Enter your PayPal email, password, and credit card details for verification.
"""

result = predict_phishing(test_email)
print("\nTest Prediction:")
print(f"Is Phishing: {result['is_phishing']}")
print(f"Confidence: {result['confidence']:.2f}")
print("Indicators:")
for indicator in result['indicators']:
    print(f"- {indicator}")