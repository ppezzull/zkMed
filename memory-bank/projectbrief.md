# zkMed Project Brief - Streamlined Web3 Healthcare Platform

## 🎯 Project Vision

**zkMed** is a streamlined Web3 healthcare platform that enables privacy-preserving medical claims processing using cutting-edge technologies including vlayer WebProofs/MailProofs, thirdweb authentication, Aave V3 pooling infrastructure, and native Mantle USD (mUSD) integration for simplified, reliable operations. Built for deployment on Mantle blockchain as part of [The Cookathon](https://www.cookathon.dev/) hackathon with **containerized Dockploy deployment and live demo environment**.

---

## 🔐 Core Innovation: Multi-Proof Privacy Architecture with Pooling

### The Problem
Traditional healthcare systems expose sensitive medical data during insurance claims processing, creating privacy risks and limiting patient control over personal health information. Additionally, patients and insurers often lack efficient pooling mechanisms for collecting and distributing funds.

### Our Solution
zkMed enables **complete privacy-preserving healthcare claims with intelligent pooling** where:
- **Patients** register with mailproof from verified insurers OR select an insurer to start paying monthly
- **Organizations** verify domain ownership via vlayer MailProofs
- **Pooling** uses Aave V3 infrastructure where patients and insurers deposit funds that earn yield until authorization
- **Claims** are validated through multiple proof types (ZK + Web + Mail proofs)
- **Payments** use native Mantle USD (mUSD) for stable, reliable processing
- **Transactions** are sponsored via thirdweb's gas sponsorship for seamless UX
- **Deployment** targets **containerized Dockploy infrastructure** with persistent Mantle fork and pre-configured demo accounts

---

## 🐳 Revolutionary Dockploy Deployment Architecture

### Container-First Production Strategy

#### Live Demo Environment Features
- **Persistent Mantle Fork**: Long-running blockchain container (Chain ID: 31339)
- **Pre-Configured Demo Accounts**: Ready-to-use insurer, hospital, and patient accounts
- **Live Frontend Client**: Functional Next.js application with real interactions
- **Automated Setup**: One-command deployment with demo data initialization
- **Clean Domain Access**: Custom domain with SSL via reverse proxy

#### Demo Account Configuration
```json
{
  "demoInsurer": {
    "name": "Regione Lazio Health Insurance",
    "domain": "laziosalute.it",
    "walletAddress": "0x742d35Cc6634C0532925a3b8D0B5B0052A57adD4",
    "poolBalance": "100000000000000000000000" // 100k mUSD
  },
  "demoHospital": {
    "name": "Ospedale San Giovanni", 
    "domain": "sangiovanni.lazio.it",
    "walletAddress": "0x8ba1f109551bD432803012645Hac136c7Aad5a6"
  },
  "demoPatient": {
    "walletAddress": "0x123456789abcdef123456789abcdef1234567890",
    "insurer": "0x742d35Cc6634C0532925a3b8D0B5B0052A57adD4",
    "monthlyPremium": "500000000000000000000", // 500 mUSD
    "poolBalance": "6000000000000000000000" // 6k mUSD (12 months)
  }
}
```

#### Container Services Architecture
```yaml
# Dockploy Container Stack
services:
  mantle-fork:          # Persistent blockchain (Chain ID: 31339)
    image: zkmed/mantle-fork
    ports: ["8545:8545"]
    restart: always
    
  contract-deployer:    # Demo setup (one-time)
    image: zkmed/deployer
    depends_on: [mantle-fork]
    restart: "no"
    
  zkmed-frontend:       # Live Next.js client
    image: zkmed/frontend
    ports: ["3000:3000"]
    restart: always
    
  nginx-proxy:          # Domain access + SSL
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    restart: always
```

---

## 🏗️ System Architecture

### Core Contract Suite

#### 1. **RegistrationContract.sol** - Identity & Access Control
- Privacy-preserving patient registration with commitments
- **Dual Registration Path**: Either mailproof from verified insurer OR insurer selection for monthly payments
- Organization verification via vlayer MailProofs
- thirdweb gas sponsorship integration for seamless UX
- Multi-owner system with role-based access control

#### 2. **PatientModule.sol** - Advanced Patient Operations
- **Insurance Selection Flow**: Patients can browse and select from verified insurers
- **Monthly Payment Setup**: Automated mUSD payments to selected insurer pools
- WebProof-based operation proposals from patient portals
- Encrypted EHR management with PRE encryption
- thirdweb sponsored patient transactions
- Privacy-preserving medical necessity verification

#### 3. **OrganizationModule.sol** - Multi-Proof Validation
- Hospital system verification via WebProofs
- **Insurer Registration**: Insurance companies register and verify domain ownership
- Multi-proof claim submission workflows
- Enhanced operation approval with proof validation
- Integration with vlayer WebProof SDK

#### 4. **PoolingContract.sol** - Aave V3 Healthcare Pool Management
- **Patient Pool Deposits**: Patients pay monthly premiums into yield-generating Aave V3 pools
- **Insurer Pool Contributions**: Insurance companies deposit operational funds earning yield
- **Automated Yield Distribution**: Interest earned from Aave pools distributed to stakeholders
- **Authorization-Based Withdrawals**: Funds released to hospitals only after claim authorization
- **mUSD Native Integration**: All pool operations use Mantle USD for stability
- **Real-time Liquidity Management**: Dynamic pool rebalancing based on claim volume

#### 5. **InsuranceContract.sol** - Streamlined Policy & Claims Management
- Native mUSD policy coverage and claims processing
- **Pool Integration**: Direct connection to Aave V3 pools for fund management
- Multi-proof claim processing (ZK + Web + Mail)
- thirdweb sponsored claim approvals
- Simplified policy management with encrypted metadata

#### 6. **ClaimProcessingContract.sol** - Streamlined Proof Validator
- Multiple proof type validation system
- **Pool Authorization**: Triggers fund release from Aave pools to hospitals
- Native mUSD amount processing
- thirdweb gas sponsorship support
- Privacy preservation with encrypted EHR handling

---

## 🌐 Streamlined Web3 Integrations

### Aave V3 Pooling Infrastructure
- **Healthcare-Specific Pools**: Dedicated Aave V3 pools for patient premiums and insurer funds
- **Yield Generation**: Patient and insurer deposits earn interest while awaiting claims
- **Instant Liquidity**: Aave's proven liquidity mechanisms ensure funds available when needed
- **Risk Management**: Aave's battle-tested risk parameters protect deposited funds
- **Capital Efficiency**: Idle healthcare funds productive until claim authorization
- **Multi-Asset Support**: Support for mUSD and other Mantle ecosystem assets
- **Container Integration**: Fully functional in containerized environment with demo data

### vlayer Integration (MailProofs + WebProofs)
- **MailProofs**: Organization domain verification via email AND patient insurer verification
- **WebProofs**: Patient portal and hospital system validation  
- **Multi-Proof Architecture**: Combined proof validation for maximum security
- **Privacy Preservation**: Prove validity without exposing sensitive data
- **Demo Integration**: Pre-configured proofs for live demonstration

### thirdweb Gas Sponsorship & Authentication
- **Sponsored Transactions**: Gas-free patient and hospital interactions via thirdweb's paymaster
- **Social Login**: Easy onboarding with familiar authentication methods
- **Smart Account Integration**: Direct integration with thirdweb SDK
- **Container Compatibility**: Fully functional in Dockploy deployment
- **Demo Workflows**: Pre-configured sponsored transactions for demo accounts

### Native Mantle USD (mUSD) Integration
- **Stable Value Processing**: Native mUSD eliminates volatility in healthcare payments
- **Mantle Ecosystem**: Optimized for Mantle blockchain with official stablecoin
- **Pool Compatibility**: Seamless integration with Aave V3 pools on Mantle
- **Lower Fees**: Reduced transaction costs compared to bridged stablecoins
- **Container Support**: Native mUSD fully operational in fork environment

---

## 🔄 Enhanced Claims Workflow with Containerized Demo

### 1. **Live Demo Patient Registration**
**Live Demo Access**: `https://zkmed.yourdomain.com/demo/patient`

**Option A: Existing Insurance Coverage (Demo)**
- Demo patient connects with pre-configured wallet
- Automatic mailproof verification from demo insurer
- Instant access to existing demo pool funds
- Real yield generation demonstration

**Option B: New Insurance Selection (Demo)**
- Browse verified demo insurers on live platform
- Select demo insurer and coverage plan
- Live setup of automated monthly mUSD payments
- Real pool creation and fund management

### 2. **Live Demo Organization Verification**
**Live Demo Access**: `https://zkmed.yourdomain.com/demo/hospital`

- Demo hospital proves domain ownership via pre-configured MailProof
- Live WebProof validation from demo hospital systems
- Real-time registration confirmation
- Automated verification workflows

### 3. **Live Demo Claim Processing**
**Live Demo Access**: `https://zkmed.yourdomain.com/demo/claims`

- Demo hospital submits live multi-proof claims:
  - **ZK Proof**: Demo encrypted EHR with covered procedure
  - **WebProof**: Live procedure validation in demo hospital system
  - **MailProof**: Pre-verified demo hospital domain
- Real mUSD amounts processed from live Aave pools
- Live pool liquidity validation
- Real-time sponsored transaction processing

### 4. **Live Demo Approval Workflow**
**Live Demo Access**: `https://zkmed.yourdomain.com/demo/insurer`

- Demo insurer reviews live proof validation results
- Real multi-proof validation demonstration
- Live pool authorization with actual fund movement
- Real mUSD transfers to demo hospital wallet

### 5. **Live Demo Payout System**
**Live Demo Access**: `https://zkmed.yourdomain.com/demo/payout`

- Automated live mUSD payout from Aave pool
- Real yield distribution to demo stakeholders
- Live audit trail demonstration
- Complete workflow transparency

---

## 🎨 Containerized Frontend Architecture

### Technology Stack (Container-Optimized)
- **Next.js 15** with App Router optimized for container deployment
- **thirdweb React SDK** for seamless authentication and gas sponsorship
- **thirdweb Smart Accounts** for abstract account management
- **vlayer client + verifier SDK** for proof generation
- **Aave V3 SDK** for pool management and yield tracking
- **IPFS / web3.storage** for encrypted EHR storage
- **Mantle USD Integration** for native stablecoin handling
- **Container Environment**: Optimized for Dockploy deployment

### Live Demo Features (Container-Deployed)
- **Demo Account Switcher**: Switch between pre-configured demo accounts
- **Live Transaction Monitoring**: Real-time transaction status with demo data
- **Pool Dashboard Demo**: Live yield tracking with actual demo pool data
- **Gas-Free Demo Interactions**: All demo workflows sponsored via thirdweb
- **Multi-Proof Demo**: Live proof generation and validation workflows
- **Native mUSD Demo**: Real stablecoin transactions in demo environment
- **Mobile-Responsive Demo**: Full demo functionality on mobile devices

### Container Environment Configuration
```typescript
// Container-specific configuration
export const containerConfig = {
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'http://mantle-fork:8545',
  chainId: 31339,
  demoMode: true,
  demoAccounts: {
    insurer: process.env.NEXT_PUBLIC_DEMO_INSURER,
    hospital: process.env.NEXT_PUBLIC_DEMO_HOSPITAL,
    patient: process.env.NEXT_PUBLIC_DEMO_PATIENT
  },
  contractAddresses: {
    registration: process.env.NEXT_PUBLIC_REGISTRATION_CONTRACT,
    pooling: process.env.NEXT_PUBLIC_POOLING_CONTRACT
  }
};
```

---

## 🚀 Innovation Highlights

### 🔐 **Privacy-First Architecture with Live Demo**
- Medical data never exposed on-chain (demonstrated with real interactions)
- Multiple proof types ensure validity without revealing details
- Live demo preserves all privacy guarantees
- Real-time proof generation and validation

### 💳 **Seamless User Experience in Container Environment**
- **Dual Registration Demo**: Live demonstration of both registration paths
- Gas-free interactions via thirdweb (functional in demo)
- Social login through thirdweb integration
- Real-time proof generation and validation
- Mobile-responsive demo accessible anywhere

### 💰 **Live Pool Management Demonstration**
- **Aave V3 Integration Demo**: Real healthcare funds earning yield in demo pools
- Live mUSD handling eliminates volatility risks
- Automated liquidity management demonstration
- Real yield distribution to demo stakeholders
- Live capital efficiency demonstration

### 🔧 **Production-Ready Container Architecture**
- Multi-proof validation architecture (live demonstration)
- Proven Aave V3 pooling infrastructure
- thirdweb gas sponsorship for seamless UX
- Native Mantle USD for stable value transfer
- Containerized deployment for scalability and reliability

---

## 🎯 Success Metrics (Container Deployment)

### Live Demo Achievements
- [ ] **Container Stack Deployed**: Complete multi-service architecture on Dockploy
- [ ] **Persistent Mantle Fork**: Long-running blockchain with demo data
- [ ] **Live Demo Accounts**: Functional insurer, hospital, and patient accounts
- [ ] **Real Pool Operations**: Aave V3 pools operational with demo mUSD
- [ ] **Live Frontend**: Accessible demo at custom domain
- [ ] **Demo Workflows**: All major workflows functional with real transactions
- [ ] **SSL and Domain**: Secure access via custom domain
- [ ] **Monitoring**: Container health monitoring and alerting active

### Privacy & Security (Demonstrated Live)
- [ ] Zero medical data exposed on-chain (verified in live demo)
- [ ] Multi-proof validation ensures claim legitimacy (live demonstration)
- [ ] thirdweb sponsored transactions maintain user privacy
- [ ] PRE encryption enables controlled post-approval access
- [ ] Domain verification prevents impersonation
- [ ] Pool fund security via Aave's battle-tested protocols

### User Experience (Live Demo)
- [ ] Gas-free demo interactions via thirdweb sponsorship on Mantle
- [ ] Intuitive demo insurer selection for new patients
- [ ] Seamless demo mailproof verification for existing coverage
- [ ] Live pool yield tracking and transparency
- [ ] Demo social login via thirdweb working smoothly
- [ ] Seamless demo multi-proof generation
- [ ] Native mUSD demo integration for intuitive payments
- [ ] Mobile-responsive demo experience

---

## 🎉 Platform Impact (Live Demonstration)

### For Patients (Demo Experience)
- **Live Dual Registration**: Experience both registration options with demo accounts
- **Real Earning Demonstration**: See actual yield generation on demo premium payments
- **Privacy Protection Demo**: Medical data protection demonstrated with real interactions
- **Gas-Free Experience**: All demo interactions sponsored via thirdweb
- **Social Login Demo**: Easy onboarding demonstration with familiar authentication
- **Native mUSD Demo**: Stable value healthcare transactions

### For Healthcare Organizations (Demo Workflows)
- **Live Payment Demo**: See instant payments after claim authorization
- **Proof-Based Demo**: Experience multiple validation methods for security
- **Sponsored Demo Operations**: Reduced operational costs demonstrated via thirdweb
- **Pool Liquidity Demo**: Always sufficient funds via Aave's proven mechanisms
- **Mantle Optimization Demo**: Fast, cost-effective transactions demonstrated
- **Simplified Demo Workflows**: Automated proof generation and validation

### For Insurers (Demo Experience)
- **Live Yield Generation Demo**: See pool funds earning interest while awaiting claims
- **Privacy-Preserving Demo**: Validate claims without seeing medical details
- **Native mUSD Demo**: Stable value claims eliminate volatility risk
- **Sponsored Transaction Demo**: Improve customer experience by covering gas costs
- **Aave Integration Demo**: Leverage battle-tested DeFi infrastructure
- **Advanced Security Demo**: Multi-proof validation prevents fraud

---

## 🛠️ Dockploy Deployment Strategy

### Production Container Deployment
zkMed employs a **container-first production strategy** using Dockploy for scalable, reliable deployment with live demo capabilities.

#### Dockploy Container Configuration
- **Service Orchestration**: Multi-container setup with health monitoring
- **Persistent Data**: Blockchain state and demo data preserved across restarts
- **Auto-scaling**: Frontend containers scale based on demand
- **SSL Termination**: Automatic certificate management for custom domains
- **Monitoring**: Real-time container health and performance tracking

#### Demo Environment Benefits
- **Live Interactions**: Real contract interactions with demo accounts
- **Persistent State**: Demo data preserved across container restarts
- **Scalable Access**: Multiple users can access demo simultaneously
- **Production Environment**: Real production-like deployment for validation
- **Instant Deployment**: One-command setup for complete demo environment

#### Development to Production Pipeline
- **Local Testing**: Docker-compose for local container testing
- **Container Validation**: Test all containers before Dockploy deployment
- **Demo Setup**: Automated demo account creation and funding
- **Live Deployment**: One-command deployment to Dockploy infrastructure
- **Monitoring**: Comprehensive logging and alerting for production demo

---

## 🚀 Development Roadmap (Container-Focused)

### Phase 1: Container Architecture Setup (Weeks 1-2)
- **Multi-Container Design**: Complete Docker setup for all services
- **Dockploy Configuration**: Service orchestration and networking
- **Demo Account Setup**: Pre-configured accounts with real interactions
- **Persistent Blockchain**: Long-running Mantle fork with demo data

### Phase 2: Live Demo Implementation (Weeks 3-4)
- **Frontend Container**: Next.js production build with demo workflows
- **Demo Interactions**: Real transaction capabilities with pre-configured accounts
- **Pool Operations**: Functional Aave V3 pools with demo mUSD
- **Multi-Proof Demo**: Live proof generation and validation workflows

### Phase 3: Production Deployment (Weeks 5-6)
- **Dockploy Deployment**: Complete stack deployment with monitoring
- **Domain Configuration**: Custom domain with SSL termination
- **Performance Optimization**: Container resource optimization and scaling
- **Security Hardening**: Production security measures and access controls

### Phase 4: Demo Validation & Cookathon Preparation (Weeks 7-8)
- **Live Demo Testing**: Comprehensive testing of all demo workflows
- **Performance Monitoring**: Container performance and user experience validation
- **Documentation**: Complete deployment and demo interaction guides
- **Cookathon Submission**: Live demo preparation with presentation materials

---

**zkMed represents the future of healthcare privacy and efficiency, combining advanced Web3 technologies with proven DeFi infrastructure to create a secure, yield-generating, and privacy-preserving healthcare claims platform. Deployed via containerized Dockploy infrastructure with live demo capabilities for [The Cookathon](https://www.cookathon.dev/) on Mantle blockchain with native mUSD integration and Aave V3 pooling for optimal reliability and capital efficiency.** 🚀

---

## 🏆 Cookathon Integration (Container Deployment)

### Competition Context
- **Event**: [The Cookathon](https://www.cookathon.dev/) - Mantle's flagship hackathon
- **Timeline**: Monthly hackathon (May-Oct 2025) with $15K monthly prizes
- **Target**: 1st place ($5K) with potential for grants and accelerator opportunities
- **Partners**: Leveraging thirdweb (official Cookathon partner) for optimal integration
- **Demo Strategy**: Live containerized deployment for real-time judge interaction

### Competitive Advantages (Live Demo)
- **Privacy-First Healthcare**: Unique application of zero-knowledge proofs demonstrated live
- **Aave V3 Pool Integration**: First healthcare platform with yield-generating pools (functional demo)
- **Multi-Proof Architecture**: Advanced validation system using vlayer (live demonstration)
- **Dual Registration Paths**: Flexible onboarding demonstrated with real accounts
- **Native mUSD Integration**: Seamless stable value payments on Mantle (live transactions)
- **Container Deployment**: Production-ready scalable infrastructure
- **Live Demo Access**: Judges can interact with real platform functionality 