# zkMed Project Brief - Streamlined Web3 Healthcare Platform

## 🎯 Project Vision

**zkMed** is a streamlined Web3 healthcare platform that enables privacy-preserving medical claims processing using cutting-edge technologies including vlayer WebProofs/MailProofs, thirdweb authentication, Aave V3 pooling infrastructure, and native Mantle USD (mUSD) integration for simplified, reliable operations. Built for deployment on Mantle blockchain as part of [The Cookathon](https://www.cookathon.dev/) hackathon.

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
- **Deployment** targets Mantle blockchain for optimal performance and ecosystem benefits

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

### vlayer Integration (MailProofs + WebProofs)
- **MailProofs**: Organization domain verification via email AND patient insurer verification
- **WebProofs**: Patient portal and hospital system validation  
- **Multi-Proof Architecture**: Combined proof validation for maximum security
- **Privacy Preservation**: Prove validity without exposing sensitive data

### thirdweb Gas Sponsorship
- **Sponsored Transactions**: Gas-free patient and hospital interactions via thirdweb's paymaster
- **Seamless Integration**: Direct integration with thirdweb SDK
- **Account Abstraction**: Simplified user experience with smart accounts
- **Flexible Sponsorship**: Configurable gas sponsorship rules

### thirdweb Authentication
- **Social Login**: Easy onboarding with familiar authentication methods
- **Wallet Abstraction**: Simplified wallet management for users
- **Session Management**: Persistent user sessions across devices
- **Account Binding**: Link social accounts to abstract accounts

### Native Mantle USD (mUSD) Integration
- **Stable Value Processing**: Native mUSD eliminates volatility in healthcare payments
- **Mantle Ecosystem**: Optimized for Mantle blockchain with official stablecoin
- **Pool Compatibility**: Seamless integration with Aave V3 pools on Mantle
- **Lower Fees**: Reduced transaction costs compared to bridged stablecoins
- **Better Reliability**: Native asset with no bridge risk or external dependencies

---

## 🔄 Enhanced Claims Workflow with Pooling

### 1. **Multi-Path Patient Registration**
**Option A: Existing Insurance Coverage**
- Patient receives mailproof from their verified insurer confirming coverage
- Privacy-preserving commitment creation with insurer verification
- Automatic access to existing insurer pool funds

**Option B: New Insurance Selection**
- Patient browses verified insurers on platform
- Selects preferred insurer and coverage plan
- Sets up automated monthly mUSD payments to Aave pool
- thirdweb sponsored registration for gas-free onboarding

### 2. **Organization Verification with MailProofs**
- Hospital/insurer proves domain ownership via vlayer MailProof
- Additional WebProof validation from organization systems
- thirdweb sponsored organization registration

### 3. **Pool-Enabled Claim Submission**
- Hospital generates multiple proofs:
  - **ZK Proof**: Encrypted EHR contains covered procedure
  - **WebProof**: Procedure validated in hospital system
  - **MailProof**: Organization domain ownership verified
- Claims processed with mUSD amounts sourced from Aave pools
- Pool liquidity check ensures sufficient funds for claim
- thirdweb sponsored claim submission for improved UX

### 4. **Privacy-Preserving Approval with Pool Authorization**
- Insurer reviews proof validation results (not raw data)
- Multi-proof validation ensures claim legitimacy
- **Pool Authorization**: Approved claims trigger smart contract to release funds from Aave pool
- thirdweb sponsored approval transactions
- Native mUSD payment processing with yield distribution

### 5. **Secure Payout from Pool Infrastructure**
- Automated mUSD payout from Aave pool to hospital wallet
- **Yield Distribution**: Interest earned during fund holding distributed to stakeholders
- PRE encryption enables controlled post-approval access
- thirdweb sponsored withdrawal transactions for hospitals
- Complete audit trail without exposing sensitive data

---

## 🎨 Frontend Architecture

### Technology Stack
- **Next.js 15** with App Router for modern React patterns
- **thirdweb React SDK** for seamless authentication and gas sponsorship
- **thirdweb Smart Accounts** for abstract account management
- **vlayer client + verifier SDK** for proof generation
- **Aave V3 SDK** for pool management and yield tracking
- **IPFS / web3.storage** for encrypted EHR storage
- **Mantle USD Integration** for native stablecoin handling
- **Mantle Network** for optimized blockchain deployment

### Key Features
- **Social Login** via thirdweb for familiar user experience
- **Insurer Selection Interface** for new patient onboarding
- **Pool Dashboard** showing yield generation and fund status
- **Gas-Free Interactions** through thirdweb gas sponsorship
- **Multi-Proof Generation** with real-time status monitoring
- **Native mUSD Integration** for seamless payments
- **Yield Tracking** for pool performance monitoring
- **Mantle Network Optimization** for fast, cost-effective transactions
- **Mobile-Responsive PWA** for accessibility across devices

---

## 🚀 Innovation Highlights

### 🔐 **Privacy-First Architecture**
- Medical data never exposed on-chain
- Multiple proof types ensure validity without revealing details
- Sponsored transactions maintain user privacy
- PRE encryption enables controlled access

### 💳 **Seamless User Experience**
- **Dual Registration**: Existing insurer mailproof OR new insurer selection
- Gas-free interactions via thirdweb gas sponsorship
- Social login through thirdweb integration
- Real-time proof generation and validation
- Mobile-responsive design for all users

### 💰 **Intelligent Pool Management**
- **Aave V3 Integration**: Healthcare funds earn yield while awaiting claims
- Native mUSD handling eliminates volatility risks
- Automated liquidity management ensures claim payments
- Yield distribution rewards long-term pool participants
- Capital efficiency maximizes fund utilization

### 🔧 **Streamlined Technical Architecture**
- Multi-proof validation architecture
- Proven Aave V3 pooling infrastructure
- thirdweb gas sponsorship for seamless UX
- Native Mantle USD for stable value transfer
- Reduced external dependencies for better reliability

---

## 🎯 Success Metrics

### Technical Achievements
- [ ] **Local Fork Environment**: Mantle fork (chain ID 31339) fully operational with real mainnet state
- [ ] Aave V3 pool integration functional and tested on local Mantle fork
- [ ] thirdweb gas sponsorship integration tested on forked environment
- [ ] vlayer WebProof + MailProof integration working end-to-end on local setup
- [ ] Native mUSD processing implemented and thoroughly tested on fork
- [ ] Dual patient registration paths (mailproof + selection) working on local environment
- [ ] thirdweb authentication seamless and secure on fork
- [ ] Multi-proof validation system operational and tested locally
- [ ] Pool yield distribution mechanisms functional on fork with mock scenarios
- [ ] **Mainnet Migration**: Successful deployment from tested fork to live Mantle network
- [ ] Cookathon submission with live demonstration capabilities

### Privacy & Security
- [ ] Zero medical data exposed on-chain
- [ ] Multi-proof validation ensures claim legitimacy
- [ ] thirdweb sponsored transactions maintain user privacy
- [ ] PRE encryption enables controlled post-approval access
- [ ] Domain verification prevents impersonation
- [ ] Pool fund security via Aave's battle-tested protocols

### User Experience
- [ ] Gas-free patient interactions via thirdweb sponsorship on Mantle
- [ ] Intuitive insurer selection for new patients
- [ ] Seamless mailproof verification for existing coverage
- [ ] Pool yield tracking and transparency
- [ ] Social login via thirdweb working smoothly
- [ ] Seamless multi-proof generation
- [ ] Native mUSD integration for intuitive payments
- [ ] Mobile-responsive PWA experience optimized for Mantle

---

## 🎉 Platform Impact

### For Patients
- **Dual Registration Options**: Use existing insurer mailproof OR select new coverage
- **Earning Idle Funds**: Monthly premium payments earn yield in Aave pools
- **Privacy Protection**: Medical data never exposed during claims
- **Gas-Free Experience**: thirdweb sponsored transactions eliminate barriers
- **Social Login**: Easy onboarding with familiar authentication
- **Native mUSD Payments**: Stable value for healthcare transactions

### For Healthcare Organizations
- **Instant Payments**: Funds available immediately after claim authorization
- **Proof-Based Verification**: Multiple validation methods for security
- **Sponsored Operations**: Reduced operational costs via thirdweb sponsorship
- **Pool Liquidity**: Always sufficient funds via Aave's proven mechanisms
- **Mantle Optimization**: Fast, cost-effective transactions on optimized blockchain
- **Simplified Workflows**: Automated proof generation and validation

### For Insurers
- **Yield Generation**: Pool funds earn interest while awaiting claims
- **Privacy-Preserving Approval**: Validate claims without seeing medical details
- **Native mUSD Processing**: Stable value claims eliminate volatility risk
- **thirdweb Sponsored Transactions**: Improve customer experience by covering gas costs
- **Aave Integration**: Leverage battle-tested DeFi infrastructure for reliability
- **Advanced Security**: Multi-proof validation prevents fraud

---

## 🛠️ Development Environment Strategy

### Local-First Development Approach
zkMed employs a **local-first development strategy** using a comprehensive Mantle fork environment to ensure robust testing before mainnet deployment.

#### Local Mantle Fork Configuration
- **Chain ID**: 31339 (local development)
- **Fork Source**: https://rpc.mantle.xyz (Mantle mainnet state)
- **Container**: Docker-based Anvil setup for consistent development environment
- **Benefits**: 
  - Instant transaction confirmation for rapid development
  - Access to real Mantle mainnet state and contracts
  - Zero cost testing of complex DeFi interactions
  - Safe environment for Aave V3 pool integration testing

#### Testing Strategy
- **Unit Testing**: Foundry-based smart contract testing on local fork
- **Integration Testing**: Full end-to-end workflows with vlayer proofs and Aave pools
- **UI Testing**: Frontend testing against local fork with mock but realistic data
- **Performance Testing**: Gas optimization and transaction batching validation
- **Security Testing**: Multi-proof validation and privacy preservation verification

#### Development Advantages
- **Risk-Free Iteration**: Test complex Aave pool interactions without mainnet costs
- **Realistic Environment**: Fork maintains real mainnet state for accurate testing
- **Rapid Development**: Instant feedback loop for smart contract changes
- **Comprehensive Testing**: Validate all integrations before live deployment

---

## 🚀 Development Roadmap

### Phase 1: Local Mantle Fork Setup & mUSD Integration (Weeks 1-2)
- **Local Development Environment**: Full testing on Mantle local fork (chain ID 31339)
- Anvil-based Mantle fork for rapid development and testing
- Native Mantle USD (mUSD) integration and testing on local fork
- thirdweb gas sponsorship setup and testing on forked environment
- Complete local testing of all core functionalities before mainnet deployment

### Phase 2: Aave V3 Pool Integration (Weeks 3-4)
- Aave V3 pool contracts deployment and testing on Mantle fork
- Healthcare-specific pool configuration with mUSD on local environment
- Yield generation and distribution mechanisms testing
- Pool authorization for claim payments validation
- Comprehensive pool testing with mock data before live deployment

### Phase 3: vlayer WebProof & Dual Registration (Weeks 5-6)
- WebProof SDK integration for patient portals and hospital systems
- Dual patient registration: mailproof verification + insurer selection
- Enhanced PatientModule and OrganizationModule with multi-proof support
- Real-time proof validation and status monitoring

### Phase 4: Cookathon Frontend & Mainnet Deployment (Weeks 7-8)
- Next.js 15 frontend optimized for both local fork and Mantle mainnet
- Insurer selection interface for new patients
- Pool dashboard with yield tracking and fund status
- thirdweb Smart Accounts integration with Mantle
- Native mUSD UI/UX for seamless payments
- **Mainnet Migration**: Deploy thoroughly tested contracts from fork to Mantle mainnet
- Cookathon submission preparation with live demonstration capabilities

---

**zkMed represents the future of healthcare privacy and efficiency, combining advanced Web3 technologies with proven DeFi infrastructure to create a secure, yield-generating, and privacy-preserving healthcare claims platform. Built for [The Cookathon](https://www.cookathon.dev/) on Mantle blockchain with native mUSD integration and Aave V3 pooling for optimal reliability and capital efficiency.** 🚀

---

## 🏆 Cookathon Integration

### Competition Context
- **Event**: [The Cookathon](https://www.cookathon.dev/) - Mantle's flagship hackathon
- **Timeline**: Monthly hackathon (May-Oct 2025) with $15K monthly prizes
- **Target**: 1st place ($5K) with potential for grants and accelerator opportunities
- **Partners**: Leveraging thirdweb (official Cookathon partner) for optimal integration

### Competitive Advantages
- **Privacy-First Healthcare**: Unique application of zero-knowledge proofs in healthcare
- **Aave V3 Pool Integration**: First healthcare platform with yield-generating fund pools
- **Multi-Proof Architecture**: Advanced validation system using vlayer WebProofs/MailProofs
- **Dual Registration Paths**: Flexible onboarding for existing and new insurance customers
- **Native mUSD Integration**: Seamless stable value payments on Mantle
- **Mantle Optimization**: Built specifically for Mantle's performance characteristics
- **thirdweb Integration**: Leveraging official Cookathon partner technology 