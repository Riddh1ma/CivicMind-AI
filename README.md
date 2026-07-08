# 🏙️ CivicMind AI

### AI-Powered Smart Civic Issue Reporting & Urban Management Platform

CivicMind AI is an intelligent smart-city platform that enables citizens to report civic issues using image evidence and live location data while providing authorities with real-time incident management, AI-assisted insights, and city-wide analytics.

Built as a submission for the **Google Cloud Community Hero Hackathon**, CivicMind AI explores how artificial intelligence, cloud technologies, real-time systems, and geospatial data can contribute to smarter and more responsive urban governance.

---

## 🔗 Live Application

🌐 **Live Demo:** [View CivicMind AI](https://civicmind-ai-b8dd5.web.app/)

> The application is actively being improved beyond the original hackathon submission.

---

## 📌 The Problem

Reporting civic issues such as potholes, water leakage, garbage accumulation, damaged streetlights, and drainage problems is often a slow and fragmented process.

Citizens may not know:

- Which municipal department is responsible for an issue.
- How severe or urgent the reported problem is.
- Whether action has been taken after submitting a complaint.
- How to efficiently communicate accurate location and visual evidence.

At the same time, municipal authorities need better tools to monitor incidents, prioritize complaints, identify trends, and make data-driven decisions.

---

## 💡 The Solution

CivicMind AI provides an end-to-end intelligent civic issue reporting workflow.

Citizens can upload an image of a civic problem and share their live location. The platform uses **Google Gemini AI** to analyze the image, classify the issue, estimate its severity, generate a summary, and recommend the appropriate municipal department.

The report is then synchronized through **Cloud Firestore**, allowing it to appear in real time across citizen and authority dashboards.

Municipal authorities can monitor incidents through an interactive command center, while City Pulse Analytics provides insights into issue distribution, department workloads, geographic hotspots, and city-wide trends.

---

## ✨ Key Features

### 👤 Citizen Portal

- Google Authentication
- AI-powered civic issue reporting
- Image-based issue analysis
- Automatic GPS location detection
- Reverse geocoding and address autofill
- Interactive Google Maps
- Real-time report tracking
- Live notifications
- Personal activity statistics

### 🤖 AI-Powered Issue Analysis

Using Google Gemini AI, uploaded civic issue images are analyzed to determine:

- Issue category
- Severity level
- AI-generated incident summary
- Recommended municipal department
- Analysis confidence score

### 🏛️ Authority Command Center

- Real-time incident monitoring
- Interactive GIS issue mapping
- AI-assisted prioritization
- Incident status management
- Department-based routing
- Live dispatch timeline
- Search and filtering
- Real-time Firestore synchronization

### 📊 City Pulse Analytics

- City-wide incident statistics
- Live KPI monitoring
- Issue category distribution
- Priority and severity analysis
- Department workload insights
- Geographic issue hotspots
- Operational trends
- AI-generated insights

### 🔔 Real-Time Synchronization

CivicMind AI uses Cloud Firestore listeners to synchronize changes across the application.

Updates to reports, notifications, incident statuses, and dashboard statistics are reflected in real time without requiring manual page refreshes.

---

## 🔄 Application Workflow

```text
Citizen Authentication
          │
          ▼
    Citizen Dashboard
          │
          ▼
      Report Issue
          │
          ├───────────────┐
          ▼               ▼
   Upload Evidence    GPS Location
          │               │
          ▼               ▼
     Cloudinary       Google Maps
          │               │
          └───────┬───────┘
                  ▼
          Gemini AI Analysis
                  │
                  ▼
             Cloud Firestore
                  │
          ┌───────┴────────┐
          ▼                ▼
   Citizen Dashboard   Authority Dashboard
                           │
                           ▼
                  City Pulse Analytics
## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Artificial Intelligence
- Google Gemini AI
- Gemini Vision Analysis

### Google Technologies
- Firebase Authentication
- Cloud Firestore
- Firebase Hosting
- Google Maps JavaScript API
- Google Geocoding API

### Image Management
- Cloudinary

### Development & Deployment
- Git
- GitHub
- Firebase CLI
- Google Cloud Infrastructure

---

## 📁 Project Structure

    CivicMind-AI/
    │
    ├── public/
    │
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── firebase/
    │   ├── hooks/
    │   ├── services/
    │   ├── types/
    │   ├── App.tsx
    │   └── main.tsx
    │
    ├── .env.example
    ├── .gitignore
    ├── firebase.json
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts

---
