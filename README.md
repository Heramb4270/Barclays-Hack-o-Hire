# API Call Analysis and Alert System

<div align="center">
  <h3>AI-Powered API Monitoring and Anomaly Detection System</h3>
  <p>Developed for Barclays Hack-o-Hire 2025</p>
</div>

## 📋 Overview

This solution provides an intelligent API monitoring framework that uses AI to analyze API performance, detect anomalies, and predict potential failures across distributed multi-environment platforms. The system handles high-frequency API calls across on-premises, cloud, and multi-cloud setups, providing real-time insights and actionable alerts to maintain optimal platform health.

## 🎯 Problem Statement

Large-scale distributed platforms generate vast amounts of log data from high-frequency API calls spanning various environments (on-premises, cloud, multi-cloud). APIs from these diverse environments can be part of a single request journey, adding complexity to monitoring and analysis.

## 🚀 Key Features

- **Cross-Environment Monitoring**: Track API performance metrics across on-premises, cloud, and multi-cloud environments
- **Real-time Anomaly Detection**: Identify unusual patterns in response times and error rates
- **Predictive Analytics**: Forecast potential system failures before they impact users
- **End-to-End Request Journey Tracking**: Monitor complete request flows that span multiple environments
- **Intelligent Alerting**: Context-aware notifications with proper prioritization and actionable insights
- **Automated Onboarding**: New applications automatically added to monitoring setup
- **Interactive Dashboards**: Visual representation of system health and performance metrics

## 🤖 AI/ML-Based Anomaly Detection Engine

This module powers the intelligent core of our API monitoring system, using a hybrid approach that combines traditional machine learning, deep learning, and statistical methods to detect anomalies in real-time API traffic across distributed environments.

 ### 🔍 Models Used
🧠 **AutoEncoder (AE)**
- Learns baseline behavior of API request patterns.
- Calculates reconstruction error to identify unusual payloads, tokens, response times, or headers.
- Effective for structure-based anomalies in single requests.

⏱️ **LSTM (Long Short-Term Memory)**
- Sequence model trained on user sessions and request flows.
- Detects temporal anomalies, such as deviations in call order, delays, or flow changes across time.
- Useful for behavioral pattern tracking.

🚨 **Isolation Forest (IF)**
- Unsupervised tree-based model that isolates statistical outliers.
- Detects sudden spikes in latency, rare IPs, abnormal user agents, etc.
- Ideal for lightweight, quick anomaly detection in high-dimensional spaces.

## 🛠️ Technologies Used

- **Backend**: Go (37%)
- **Frontend**: JavaScript (55.3%)
- **Containerization**: Docker (7.7%)
- **Cloud Services**: AWS
- **Log Aggregation**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **AI/ML**: Python with scikit-learn/TensorFlow
- **Database**: PostreSQL for log storage and analysis


Our system follows a microservices architecture with these key components:

1. **Log Collection Service**: Gathers logs from various APIs across different environments
2. **Data Processing Pipeline**: Normalizes and enriches log data for analysis
3. **Anomaly Detection Engine**: AI models that identify abnormal patterns in API performance
4. **Predictive Analytics Service**: Forecasts potential issues before they occur
5. **Alert Management System**: Sends context-aware notifications through various channels
6. **Visualization Dashboard**: Provides interactive insights into system performance

## 🔧 Installation & Setup

### Prerequisites
- Docker and Docker Compose
- Go 1.16+
- Node.js 16+
- AWS CLI (if using AWS services)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Heramb4270/Barclays-Hack-o-Hire.git
cd Barclays-Hack-o-Hire

# Build and run with Docker
docker-compose up -d
