# zkMed - Revolutionary Healthcare Insurance Platform

> **Privacy-preserving healthcare platform using vlayer MailProofs and automatic payments on Base**

[![Base](https://img.shields.io/badge/Base-Network-blue)](https://base.org/)
[![vlayer](https://img.shields.io/badge/vlayer-MailProofs-green)](https://book.vlayer.xyz/features/email.html)
[![Chainlink](https://img.shields.io/badge/Chainlink-Automation-orange)](https://chain.link/automation)
[![Scaffold-ETH](https://img.shields.io/badge/Scaffold--ETH-Privy-purple)](https://github.com/scaffold-eth/scaffold-eth-2)

**Developed at [ETHGlobal Napuleth 2025](https://ethglobal.com/events/napuleth) hackathon on Base**

---

## 🎯 Project Vision

### Overview
zkMed is the world's first **privacy-preserving healthcare insurance payment platform** that automates payments from insurers to hospitals and patients by leveraging cryptographically verifiable email proofs (vlayer MailProofs) and Chainlink Automation for recurring payments. Built on Base with a seamless Privy wallet integration.

### Core Innovation
**Web2/Web3 hybrid architecture** that maintains regulatory compliance while delivering revolutionary blockchain benefits:
- **Web2 Layer**: Traditional claim processing, medical review, regulatory compliance
- **Web3 Layer**: MailProof verification, instant payments, automated processing
- **Bridge**: DKIM-signed emails provide cryptographic proof without exposing medical data

### Current MVP Stage
- ✅ **Smart contract development and fixing of vlayer wagmi config error caused by different configs used by vlayer and privy**
- ✅ **Connect the mocked pages to the contracts with scaffold.**
- ✅ **Setup and deploy all of the contracts with verified ABIs and website deployment.**
- ✅ **Dynamic Address Resolution**: Client automatically connects to appropriate contract addresses
- ✅ **Chainlink Automation**: Automated payment execution via zkMedLinkPay
- ✅ **Email Verification**: Working vlayer proofs for registration and payment plans

---

## 🏗️ Technical Architecture

### Blockchain Infrastructure
- **Primary Chain**: [Base](https://base.org/) (Ethereum L2)
- **Chain ID**: 31337 (Local Fork) / 8453 (Mainnet)
- **Native Currency**: ETH for all transactions
- **Development**: Scaffold-ETH 2 with Privy wallet integration ([repo](https://github.com/ppezzull/Scaffold-Privy-AA))

### Privacy Layer
- **[vlayer MailProof](https://book.vlayer.xyz/features/email.html)**: DKIM verification for payment authorization
- **Domain Verification**: Cryptographic proof of organizational email control
- **Zero-Knowledge Architecture**: Complete medical privacy preservation
- **Audit Trails**: Complete email verification history for compliance

### Payment System
- **Chainlink Automation**: Scheduled monthly payment execution
- **zkMedLinkPay**: Smart contract handling recurring payments and fees
- **Payment Plans**: Verified by email proof between insurer and patient

### Frontend
- **Framework**: Next.js with Server Components
- **Web3 Integration**: Privy SDK for seamless authentication
- **Smart Accounts**: Abstract account management with gas sponsorship
- **Responsive Design**: Desktop-first approach with modern UI/UX

---

## 📋 Smart Contract Architecture

### Core Contract
**zkMedCore.sol**: Central hub contract that coordinates all components
- Manages registration of patients, hospitals, and insurers
- Maintains user roles and permissions
- Connects all specialized contracts together
- Provides core functionality like getRole for identifying user types

### Request Management
**zkMedRequestManager.sol**: Handles all system requests
- Processes registration requests for users and organizations
- Manages payment plan authorization requests
- Tracks request status (pending, approved, rejected)
- Stores organization metadata securely

### Payment Infrastructure
**zkMedLinkPay.sol**: Chainlink-powered automatic payment system
- Uses Chainlink Automation for scheduled payments
- Executes monthly payments from insurers to hospitals
- Manages payment plans with configurable durations
- Collects and distributes platform fees
- Maintains complete payment history and statistics

**zkMedPaymentHistory.sol**: Records all transaction activity
- Stores detailed payment records
- Provides statistical analysis of platform usage
- Enables audit trails for compliance purposes
- Preserves privacy while maintaining transparency

### Verification Provers
**zkMedRegistrationProver.sol**: Verifies organization identities
- Validates DKIM-signed emails for domain verification
- Ensures hospitals and insurers own their claimed email domains
- Prevents impersonation through cryptographic proof
- Built on vlayer email proof technology

**zkMedPaymentPlanProver.sol**: Validates payment authorizations
- Verifies insurer-approved payment plans via email proof
- Extracts payment terms from DKIM-verified emails
- Ensures patient consent through dual verification
- Protects sensitive medical information via zero-knowledge proofs

### User Contracts
**zkMedPatient.sol**: Patient interface contract
- Manages patient registration and verification
- Links patients to their payment plans
- Stores patient metadata securely
- Integrates with zkMedLinkPay for automated payments

**zkMedHospital.sol**: Hospital interface contract
- Handles hospital registration with domain verification
- Manages hospital payment receipt
- Maintains hospital metadata and credentials
- Enables service fee configuration

**zkMedInsurer.sol**: Insurance provider interface
- Manages insurer registration and verification
- Handles payment plan creation and approval
- Maintains connections to patients and hospitals
- Controls monthly payment allocations

**zkMedAdmin.sol**: Administrative interface
- Provides platform governance capabilities
- Manages system parameters and fee structures
- Handles dispute resolution and special cases
- Controls platform upgrades and maintenance

### 🧪 Test Suite Status
#### 🎯 Overview
- Overall test coverage: ~82%
- Critical suites (Chainlink Automation & Registration Prover): 100%
- Core contract tests: ~83%
- PaymentPlanFlow tests: 0%

#### 📊 Test Coverage

| Test Suite                | Pass Rate |
|---------------------------|-----------|
| zkMedLinkPay              | 100%      |
| zkMedRegistrationProver   | 100%      |
| zkMedCore                 | 83%       |
| PaymentPlanFlow           | 0%        |
| YourContract              | 100%      |

---

## 🔄 Hybrid Claim Processing Flow

### Web2/Web3 Integration Architecture

```mermaid
sequenceDiagram
    participant P as Patient
    participant H as Hospital
    participant I as Insurer (Web2)
    participant V as vlayer
    participant C as Chainlink
    
    Note over P,I: Web2 Traditional Claim Processing
    P->>H: 1. Receive Medical Treatment
    H->>I: 2. Submit Claim via Portal/EHR
    I->>I: 3. Review & Assess Claim (Manual Process)
    I->>I: 4. Approve/Deny Decision
    
    Note over I,C: Web3 Automated Payment Processing
    I->>P: 5. Send DKIM-Signed Payment Plan Email
    P->>V: 6. Submit MailProof for Verification
    V->>C: 7. Setup Recurring Payment Schedule
    C->>H: 8. Execute Monthly Payments Automatically
```

### Why Hybrid Architecture?
- **Regulatory Compliance**: Medical data stays in traditional systems (GDPR/HIPAA)
- **Industry Integration**: Seamless adoption without disrupting existing workflows
- **Privacy Protection**: Medical information never exposed on-chain
- **Recurring Settlements**: Blockchain automation for scheduled payment execution

---

## 🚀 Bounties Implementation

### Scaffold++ (Scaffold-ETH with Privy)
- **Template Used**: Scaffold-ETH 2 with Privy integration (commit a3b4adaf29ea90ab5323e5255e22b76e5e3ca674)
- **Features Added**:
  - Smart wallet creation and management
  - Social login options (email, phone, social)
  - Gasless transactions for improved UX
  - Automatic user role detection and routing

### Chainlink Automation
- **Contract**: zkMedLinkPay.sol
- **Implementation**:
  - `checkUpkeep`: Identifies payment plans due for processing
  - `performUpkeep`: Executes monthly payments to hospitals
  - Triggers automatic payments based on email-verified payment plans
  - Handles platform fee distribution and payment statistics

### Base Deployment
- **Contract Addresses**:
  - zkMedCore: 0x7Ca6F9b0Ef149Ae82D57947Cd7D54B0a701e8dBD
  - zkMedPatient: 0xF8CeD8823d8d91a42f0775382BC757CCb490d587
  - zkMedHospital: 0x5aDaB6091C85F08173D5aDb801f4cB63480F0288
  - zkMedInsurer: 0x9889827a14aF61111E5C79Ea0AB5D343961FeE4f
  - zkMedAdmin: 0xC6d5aa79bD2f579ECbB6a1f2420B34Fd7a113E20
  - zkMedPaymentHistory: 0xB03AAa4a2Df9BD42f7CcB32A75E28A329DF39D6B
  - zkMedRequestManager: 0x51a41348d9b0061A7000D6BAcE8e83D06aE00764
  - zkMedRegistrationProver: 0x700b6a60ce7eaaea56f065753d8dcb9653dbad35
  - zkMedPaymentPlanProver: 0x364d6D0333B6BB0cAB7e6FDC06D5B9c45e69Ff8E

---

## 🧪 Email Formats

### Registration Email
Organizations (hospitals and insurers) verify their identity through domain ownership:
- **From**: admin@hospitalname.com
- **Subject**: "Hospital registration on zkMed"
- **Body**: Contains organization name and wallet address

### Payment Plan Email
Insurers authorize payment plans through verified emails:
- **From**: insurance@provider.com
- **To**: patient@email.com
- **Subject**: "{insurance name} payment contract in zkMed"
- **Body**:
  ```
  Patient payment contract
  Duration: 01/01/2027
  Monthly allowance: 40$
  ```

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18+
- **Yarn**: For package management
- **Foundry**: For smart contract development

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/zkMed.git
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
- ✅ **Email Verification**: Working vlayer MailProofs for registration
- ✅ **Payment Plans**: Automated payment system via Chainlink
- ✅ **Role-Based Access**: Dynamic routing based on user type

### Next Steps
- 🚧 **Enhanced Payment Analytics**: Detailed reporting for hospitals and insurers
- 🚧 **Mobile Interface**: Progressive web app for on-the-go access
- 🚧 **Multi-Currency Support**: Integration with stablecoins for global usage

### Long-Term Vision
- 📋 **Regulatory Compliance Framework**: Comprehensive GDPR/HIPAA compliance
- 📋 **Decentralized Health Records**: Private, patient-controlled medical data
- 📋 **Global Healthcare Network**: Cross-border insurance and care coordination

---

## 🎯 Economic Model

### Stakeholder Benefits

#### Patients
- **Simplified Process**: One-time setup for recurring payments
- **Enhanced Privacy**: Medical data never exposed during processing
- **Trusted Verification**: Cryptographic proof of payment authorization

#### Hospitals
- **Predictable Cash Flow**: Guaranteed monthly payments
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

zkMed is being built by a team passionate about healthcare innovation and blockchain technology.

---

**zkMed represents the first practical implementation of privacy-preserving healthcare insurance through Web3 technology, delivering measurable benefits while maintaining regulatory compliance and user familiarity.** 🚀

---

*Built with ❤️ for the future of healthcare finance*