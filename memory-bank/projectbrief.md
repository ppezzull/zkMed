# zkMed - Privacy-Preserving Health Claims Platform

## Project Vision

zkMed revolutionizes health insurance claims processing by leveraging zero-knowledge proofs to ensure complete patient privacy while enabling automated verification and payouts. The platform eliminates the need to expose sensitive medical data on-chain while maintaining trust and transparency in the claims process.

## Core Value Propositions

### 1. Privacy by Design
- **Zero Sensitive Data Exposure**: Medical records, patient details, and personal information never touch the blockchain
- **Zero-Knowledge Proofs**: Verify claims validity without revealing underlying medical data
- **Cryptographic Commitments**: Patient registration uses local hash commitments for privacy

### 2. Automated Trust & Verification
- **Smart Contract Orchestration**: Automated claim processing based on programmable insurance policies
- **vlayer Email Proofs**: Cryptographically prove domain ownership without exposing email addresses
- **Oracle Integration**: Real-time policy rules and cost data via Flare Data Connector & FTSO

### 3. Transparent Rewards & Audit
- **Blockscout Merits System**: Publicly visible rewards for successful claims completion
- **Immutable Audit Trail**: All registration and claim events recorded on-chain for transparency
- **Decentralized Authentication**: Thirdweb SIWE for passwordless, wallet-based user sessions

## Project Scope

### Phase 1: Foundation (Current)
- ✅ Basic smart contract infrastructure (Foundry)
- ✅ vlayer SDK integration for email proofs
- 🚧 RegistrationContract for user/organization onboarding
- 🚧 Email proof verification system

### Phase 2: Core Platform
- 📋 ClaimContract for processing health insurance claims
- 📋 InsuranceContract for policy management
- 📋 Flare Data Connector integration for off-chain policy rules
- 📋 FTSO integration for real-time cost oracles

### Phase 3: Frontend & UX
- 📋 Next.js application with Thirdweb authentication
- 📋 Patient registration and commitment workflow
- 📋 Organization domain verification interface
- 📋 Claims submission and tracking dashboard

### Phase 4: Advanced Features
- 📋 Blockscout Merits system integration
- 📋 Advanced vlayer Web Proofs for domain auditing
- 📋 Multi-signature approvals for large claims
- 📋 Analytics and reporting dashboards

## Success Metrics

### Technical
- Zero PII/PHI data exposure on-chain
- Sub-5 minute claim processing for standard cases
- 99.9% uptime for critical smart contracts
- Gas-optimized transactions (<100k gas per claim)

### Business
- Support for major insurance providers (domain verification)
- Integration with healthcare provider systems
- Regulatory compliance (HIPAA, GDPR considerations)
- Cost reduction vs traditional claims processing

## Technical Architecture

### Blockchain Layer
- **Ethereum/Sepolia**: Primary execution environment
- **Smart Contracts**: Foundry-based development and testing
- **vlayer Proofs**: Email and web verification system

### Integration Layer
- **Thirdweb**: Decentralized authentication (SIWE)
- **Flare**: Off-chain data and oracle feeds
- **Blockscout**: Public merit tracking and transparency

### Application Layer
- **Next.js**: Modern React-based frontend
- **Server Actions**: Secure on-chain transaction handling
- **TypeScript**: Type-safe development across all layers

## Key Constraints

### Privacy Requirements
- No medical data stored on-chain
- No email addresses exposed in public state
- Patient commitment schemes must be unbreakable
- All proofs must be zero-knowledge

### Regulatory Considerations
- HIPAA compliance for US healthcare data
- GDPR compliance for EU user data
- Insurance regulation compliance
- Audit trail requirements for financial transactions

### Technical Limitations
- Gas cost optimization for mainstream adoption
- Proof generation time must be reasonable (<30 seconds)
- Frontend must work on mobile devices
- Integration complexity with existing healthcare systems

## Competitive Advantage

zkMed uniquely combines:
1. **True Privacy**: Zero medical data exposure vs traditional systems
2. **Automated Processing**: Smart contract automation vs manual review
3. **Cryptographic Trust**: Mathematical proof vs institutional trust
4. **Public Transparency**: Merit system and audit trails vs opaque processes
5. **Modern UX**: Web3-native interface vs legacy healthcare portals

This foundation enables a new paradigm in healthcare claims processing that prioritizes patient privacy while delivering efficiency gains for all stakeholders. 