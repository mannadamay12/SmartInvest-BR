# Smart Invest BR

**Smart Invest BR** is a comprehensive financial advisory platform powered by AI and tailored for personalized financial insights. The system leverages advanced technologies to help users define, track, and achieve their financial goals with ease.

---
![Architecture Diagram]()

## Key Features

### 1. **Personalized Financial Advice**
- AI-driven analysis using user inputs (e.g., age, financial goals, time horizons).
- Multi-layered insights presented in an intuitive interface.

### 2. **Speech-to-Text Functionality**
- Real-time speech recognition to capture financial queries.
- Seamlessly integrated for a hands-free user experience.

### 3. **Interactive Dashboards**
- Data visualization tools for goal tracking and analytics.
- User-friendly components like charts and graphs.

### 4. **Fact-Checking and Validation**
- Ensures advice and assumptions are backed by verified data.

### 5. **Mobile and Desktop Accessibility**
- Responsive design for accessibility across all devices.

---

## Technology Stack

### **Frontend**
- React.js
  - Dynamic and responsive user interface.
  - Components for charts and interactive forms.

### **Backend**
- Node.js
  - Secure APIs for processing user queries.

### **AI Integration**
- **LangChain** and **OpenAI**
  - Natural language processing for generating financial insights.

### **Streamlit**
- Interactive interface for AI-powered recommendations.

### **Deployment**
- Docker
  - Scalable and containerized deployment.
- Stripe Integration
  - Secure payment handling.

---

## Installation Guide

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Python 3.8+](https://www.python.org/)
- [Docker](https://www.docker.com/)
- [Yarn](https://yarnpkg.com/) or npm

### Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/mannadamay12/SmartInvest-BR.git
   cd SmartInvest-BR
   ```

2. **Install Dependencies**
   #### Frontend:
   ```bash
   cd client-react
   yarn install  # or npm install
   ```
   #### Backend:
   ```bash
   cd server
   npm install
   ```
   #### Streamlit:
   ```bash
   cd streamlit-advicegpt
   pip install -r requirements.txt
   ```

3. **Set Up API Keys**
   Replace the placeholder API keys in `Apifile.py` with your OpenAI credentials.

4. **Run the Application**
   #### Frontend:
   ```bash
   yarn start  # or npm start
   ```
   #### Backend:
   ```bash
   node server.js
   ```
   #### Streamlit:
   ```bash
   streamlit run financial_advisior.py
   ```

5. **Access the Platform**
   - Frontend: `http://localhost:3000`
   - Streamlit App: `http://localhost:8502`

---

## Directory Structure

```plaintext
mannadamay12-SmartInvest-BR/
├── streamlit-advicegpt/          # Streamlit app for AI-powered advice
│   ├── financial_advisior.py    # Main Streamlit script
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile               # Docker configuration
│   └── Apifile.py               # API key setup
├── client-react/                # React frontend
│   ├── src/                     # Source code
│   ├── public/                  # Public assets
│   ├── package.json             # Dependencies and scripts
│   └── Dockerfile               # Docker configuration
├── server/                      # Backend
│   ├── server.js                # Main backend server
│   ├── stripe/                  # Stripe payment integration
│   └── Dockerfile               # Docker configuration
└── README.md                    # Documentation
```

---

## Deployment

### Docker
To deploy the application using Docker:
1. Build the containers:
   ```bash
   docker-compose build
   ```
2. Start the containers:
   ```bash
   docker-compose up
   ```

The application will be available on the specified ports.

---

## Future Enhancements
- Expand AI models for diversified financial planning.
- Incorporate real-time market data integration.
- Add support for multiple languages.

---

## License
This project is licensed under the MIT License.

---

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

---

## Contact
For any inquiries or feedback:
- **Email**: meadamann2002@gmail.com
- **LinkedIn**: [Adamay Mann](https://www.linkedin.com/in/adamaymann7/)
