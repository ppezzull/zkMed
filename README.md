# zkMed - Revolutionary Healthcare Insurance Platform

 > **Privacy-preserving healthcare platform using vlayer MailProofs and automatic payments on Base**

 [![Base](https://img.shields.io/badge/Base-Network-blue)](https://base.org/)
 [![vlayer](https://img.shields.io/badge/vlayer-MailProofs-green)](https://book.vlayer.xyz/features/email.html)
 [![Chainlink](https://img.shields.io/badge/Chainlink-Automation-orange)](https://docs.chain.link/chainlink-automation)
 [![Scaffold-ETH](https://img.shields.io/badge/Scaffold--ETH-Privy-purple)](https://github.com/ppezzull/Scaffold-Privy-AA)

 **Developed at [ETHGlobal Napuleth 2025](https://ethglobal.com/events/napuleth) hackathon on Base**

---

## 🎯 Project Vision

### Overview
zkMed is the world's first **privacy-preserving healthcare insurance payment platform** that automates payments from insurers to hospitals and patients by leveraging cryptographically verifiable email proofs (vlayer MailProofs) and [Chainlink Automation](https://docs.chain.link/chainlink-automation) for recurring payments. Built on Base with a seamless Privy wallet integration.

### Core Innovation
**Web2/Web3 hybrid architecture** that maintains regulatory compliance while delivering revolutionary blockchain benefits:
- **Web2 Layer**: Traditional claim processing, medical review, regulatory compliance
- **Web3 Layer**: MailProof verification, instant payments, automated processing
- **Bridge**: DKIM-signed emails provide cryptographic proof without exposing medical data

---

## 🏗️ Technical Architecture

### Blockchain Infrastructure
- **Primary Chain**: [Base](https://base.org/) (Ethereum L2)
- **Chain ID**: 31337 (Local Fork) / 8453 (Mainnet)  
- **Native Currency**: ETH for all transactions
- **Development**: [Scaffold-ETH 2 with Privy integration](https://github.com/ppezzull/Scaffold-Privy-AA)

### Privacy Layer
- **[vlayer MailProof](https://book.vlayer.xyz/features/email.html)**: DKIM verification for payment authorization
- **Domain Verification**: Cryptographic proof of organizational email control
- **Zero-Knowledge Architecture**: Complete medical privacy preservation
- **Audit Trails**: Complete email verification history for compliance

### Payment System
- **[Chainlink Automation](https://docs.chain.link/chainlink-automation)**: Scheduled monthly payment execution via `checkUpkeep` and `performUpkeep` functions
- **zkMedLinkPay**: Smart contract implementing AutomationCompatibleInterface for recurring payments and fees
- **Payment Plans**: Verified by email proof between insurer and patient

### Frontend
- **Framework**: Next.js with Server Components
- **Web3 Integration**: Privy SDK for seamless authentication
- **Smart Accounts**: Abstract account management with gas sponsorship
- **Responsive Design**: Modern UI/UX with desktop-first approach

---

## 📋 Smart Contract Architecture

### Hybrid Insurance System Integration
```mermaid
graph TB
    subgraph "Web2: Traditional Insurance Systems"
        A[Insurer Claims Portal] --> B[Manual Claim Review]
        B --> C[DKIM-Signed Payment Plan Email]
    end
    
    subgraph "Web3: Blockchain Automation"
        D[vlayer MailProof Verification] --> E[zkMed Smart Contracts]
        E --> F[Chainlink Automation Trigger]
        F --> G[Automated Monthly Payments]
    end
    
    C --> D
```

### Automated Payment Flow
This diagram shows how a patient uses a DKIM-signed email from their insurer to set up an automated payment plan using Chainlink Automation.

```mermaid
sequenceDiagram
    participant P as Patient
    participant I as Insurer (Web2)
    participant FE as zkMed Frontend (Privy)
    participant V as vlayer
    participant ZK as zkMed Contracts
    participant C as Chainlink Automation
    participant H as Hospital

    Note over I,P: 1. Insurer sends Payment Plan Email
    I->>P: DKIM-Signed email with payment terms

    Note over P,FE: 2. Patient Onboards & Sets Up Plan
    P->>FE: Logs in with Privy, submits email proof
    FE->>V: Verifies email proof with vlayer
    V-->>FE: Returns verified payment data
    
    Note over FE,C: 3. Frontend Creates Chainlink Upkeep
    FE->>ZK: Registers payment plan on-chain
    ZK-->>FE: Confirms registration
    FE->>C: Creates and funds a new Chainlink Upkeep

    Note over C,H: 4. Chainlink Executes Automated Payments
    loop Monthly Payments
        C->>ZK: checkUpkeep()
        ZK-->>C: upkeepNeeded = true
        C->>ZK: performUpkeep()
        ZK->>H: Transfers payment to Hospital
    end
```

---

## 🏥 Multi-Role User Management Patterns

### Patient Experience Pattern
```mermaid
sequenceDiagram
    participant P as Patient
    participant I as Insurer (Web2)
    participant FE as zkMed Frontend (Privy)
    participant V as vlayer
    participant C as Chainlink Automation
    participant H as Hospital

    Note over P,I: 1. Web2 Registration & Claim Approval
    P->>I: Submits registration & documents
    I->>P: Sends insurance agreement
    P->>H: Receives medical treatment
    H->>I: Submits claim via traditional portal
    I->>I: Reviews and approves claim

    Note over I,P: 2. Web3 Payment Authorization
    I->>P: Sends DKIM-signed payment plan email

    Note over P,FE: 3. Patient Sets Up Automated Payments
    P->>FE: Logs in with Privy, submits email
    FE->>V: Verifies email proof with vlayer
    V-->>FE: Returns verified data
    FE->>C: Creates Chainlink Upkeep for automated payments to Hospital
```

### Hospital Integration Pattern
```mermaid
sequenceDiagram
    participant H as Hospital
    participant V as vlayer
    participant I as Insurer (Web2)
    participant P as Patient
    participant C as Chainlink Automation

    Note over H,V: 1. Hospital Onboarding
    H->>V: Submits domain verification MailProof
    V-->>H: Confirms email domain ownership
    H->>H: Configures payment wallet on zkMed

    Note over P,I: 2. Traditional Claim Process
    P->>H: Receives medical treatment
    H->>I: Submits claim via traditional portal
    I->>I: Reviews and approves claim

    Note over I,C: 3. Automated Settlement
    I->>P: Sends DKIM-signed payment plan email
    P->>C: Patient sets up Chainlink Automation
    C->>H: Executes automated monthly payments
```

### Insurance Company Pattern
```mermaid
sequenceDiagram
    participant I as Insurer (Web2)
    participant V as vlayer
    participant P as Patient
    participant H as Hospital
    participant C as Chainlink Automation

    Note over I,V: 1. Insurer Onboarding
    I->>V: Submits company domain MailProof
    V-->>I: Verifies corporate email domain

    Note over I,P: 2. Traditional Claim & Authorization
    P->>H: Patient receives treatment
    H->>I: Hospital submits claim
    I->>I: Insurer reviews and approves
    I->>P: Generates & sends DKIM-signed payment plan email

    Note over P,C: 3. Patient-Initiated Payment Automation
    P->>V: Patient verifies email proof via zkMed Frontend
    V-->>P: Returns verified data
    P->>C: Patient creates Chainlink Upkeep
    C->>H: Chainlink automatically pays the hospital monthly
```

---

## 🔄 Hybrid Claim Processing Flow


### Why Hybrid Architecture?
- **Regulatory Compliance**: Medical data stays in traditional systems (GDPR/HIPAA)
- **Industry Integration**: Seamless adoption without disrupting existing workflows
- **Privacy Protection**: Medical information never exposed on-chain
- **Recurring Settlements**: Blockchain automation for scheduled payment execution

---

## 🚀 Bounties Implementation

### Scaffold++ (Scaffold-ETH with Privy)
- **Template Used**: [Scaffold-ETH 2 with Privy integration](https://github.com/ppezzull/Scaffold-Privy-AA)
- **Features Added**:
  - Smart wallet creation and management
  - Social login options (email, phone, social)
  - Gasless transactions for improved UX
  - Automatic user role detection and routing

### Chainlink Automation
- **Contract**: zkMedLinkPay.sol
- **Implementation**: Full [AutomationCompatibleInterface](https://docs.chain.link/chainlink-automation) with:
  - `checkUpkeep`: Identifies payment plans due for processing
  - `performUpkeep`: Executes monthly payments to hospitals
  - Automated triggers based on email-verified payment plans
  - Platform fee distribution and payment statistics

### Base Deployment
- **Contract Addresses** (Base Mainnet):
  - zkMedCore: 0x202Fa7479d6fcBa37148009D256Ac2936729e577
  - zkMedPatient: 0x2a76C471CC4353dAAb3E4938D89f02c7fF1e2F77
  - zkMedHospital: 0xc9913ad9B3730a0C18d7064313A526d24A6F3DFD
  - zkMedInsurer: 0xcE451eC2002643f248d0689650Ef36012bAef6f4
  - zkMedAdmin: 0xb9C155122BcB683EB7d39E980daf811C62203292
  - zkMedPaymentHistory: 0x852FfA30dBdd64a4893D1cAB9DbA14148Ed3690D
  - zkMedRequestManager: 0xA95704b4C8d55594394B7B9602C0454Dc9C0f8a9
  - zkMedRegistrationProver: 0x961A3057DCA3CaAb2bD9Ba54F9BAb42C7c8BEAFa
  - zkMedPaymentPlanProver: 0x2796E5Ff369a1b845dd70948cE19BE01762D42a5

---

## 🧪 Email Formats

### Registration Email
Organizations verify identity through domain ownership:
- **From**: admin@hospitalname.com
- **Subject**: "Hospital registration on zkMed"  
- **Body**: Contains organization name and wallet address

### Payment Plan Email
Insurers authorize payment plans through verified emails:
- **From**: insurance@provider.com
- **To**: patient@email.com
- **Subject**: "{insurance name} payment contract in zkMed"
- **Body**: Patient payment contract, Duration: 01/01/2027, Monthly allowance: 40$

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18+
- **Yarn**: For package management
- **Foundry**: For smart contract development

### Quick Start

```bash
# Clone the repository
git clone https://github.com/ppezzull/zkMed.git
cd zkMed

# Install dependencies
yarn install

# Start development environment
yarn chain

# Deploy contracts
yarn deploy

# Start frontend
yarn start
```

### Environment Setup for Base
```bash
# Start a local Base fork
yarn chain:base

# Deploy to Base testnet
yarn deploy --network base-testnet
```

---

## 🗺️ Development Roadmap

### Current MVP (Hackathon Submission)
- ✅ **Privy Integration**: Smart account integration with social logins
- ✅ **Smart Contract Deploy**: Smart contracts deployed and accessible via /debug page
- ✅ **Role-Based Access**: Dynamic routing based on user type

### Next Steps
- 🚧 **Email Verification**: vlayer MailProofs integration (addressing wagmi config conflicts with Privy)
- 🚧 **Enhanced Payment Analytics**: Detailed reporting for hospitals and insurers
- 🚧 **Mobile Interface**: Progressive web app for on-the-go access
- 🚧 **Multi-Currency Support**: Integration with stablecoins for global usage

### Long-Term Vision
- 📋 **Regulatory Compliance Framework**: Comprehensive GDPR/HIPAA compliance
- 📋 **Decentralized Health Records**: Private, patient-controlled medical data
- 📋 **Global Healthcare Network**: Cross-border insurance and care coordination
- 📋 **Universal Insurance Integration**: Payment system compatible with every insurance provider

---

## 🎯 Economic Model

### Stakeholder Benefits

#### Patients
- **Simplified Process**: One-time setup for recurring payments
- **Enhanced Privacy**: Medical data never exposed during processing
- **Trusted Verification**: Cryptographic proof of payment authorization

#### Hospitals
- **Predictable Cash Flow**: Guaranteed monthly payments from insurance
- **Reduced Admin Costs**: Automated processing reduces overhead
- **Enhanced Security**: MailProof validation prevents fraud

#### Insurers
- **Capital Efficiency**: Clear payment schedules improve financial planning
- **Reduced Overhead**: Automation eliminates manual payment processing
- **Enhanced Transparency**: Complete audit trail of all transactions

#### Platform
- **Sustainable Revenue**: Small fee from each processed payment
- **Scalable Model**: Infrastructure supports unlimited users and transactions
- **Regulatory Compliance**: Privacy-preserving architecture meets healthcare standards

---

## 👨‍💻 Contributors

Built by students from [42 Roma Luiss](https://42roma.it/):

- [ppezzull](https://github.com/ppezzull/) – Smart contract backend
- [rdolzi](https://github.com/rdolzi/) – Next.js frontend

---

**zkMed represents the first practical implementation of privacy-preserving healthcare insurance through Web3 technology, delivering measurable benefits while maintaining regulatory compliance and user familiarity.** 🚀

---

*Built with ❤️ for the future of healthcare finance*