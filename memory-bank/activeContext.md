# Active Context - Current zkMed Development Focus

## Current Sprint Focus

### Primary Objective: Foundation Infrastructure
**Timeline**: Current Sprint (2 weeks)
**Goal**: Establish core registration system with vlayer email proof integration

### Active Work Items

#### 1. RegistrationContract Implementation [IN PROGRESS]
**Priority**: High
**Status**: 🚧 Design Phase → Implementation

**Current State**:
- Basic Foundry project structure is complete
- vlayer SDK integration working with example contracts
- Need to implement actual RegistrationContract for zkMed use case

**Next Actions**:
1. Create `RegistrationContract.sol` with:
   - Patient commitment registration
   - Organization domain verification
   - Role-based access control (Patient, Hospital, Insurer)
   - Integration with vlayer email proof verifier

2. Implement supporting contracts:
   - Email proof verification wrapper
   - Event emission for audit trails
   - Access control modifiers

**Blockers**: None currently identified

#### 2. vlayer Email Proof Integration [NEXT UP]
**Priority**: High
**Status**: 📋 Ready to Start

**Requirements**:
- Modify existing `prove.ts` script for email domain verification
- Create frontend workflow for organization registration
- Implement error handling for proof failures

**Dependencies**: RegistrationContract completion

#### 3. Testing Infrastructure [PARALLEL WORK]
**Priority**: Medium
**Status**: 📋 Planning

**Scope**:
- Unit tests for RegistrationContract functions
- Integration tests with vlayer proof mocks
- Gas optimization testing
- Privacy guarantee verification tests

## Recent Decisions & Context

### Architecture Decisions Made

1. **vlayer Integration Approach** ✅
   - **Decision**: Use vlayer SDK for email domain verification rather than custom proof system
   - **Rationale**: Proven security, faster development, maintained infrastructure
   - **Impact**: Reduces development complexity, improves security guarantees

2. **Smart Contract Structure** ✅
   - **Decision**: Single RegistrationContract for all user types with role-based access
   - **Rationale**: Simplified state management, clearer access patterns
   - **Impact**: Easier auditing, reduced deployment complexity

3. **Privacy Pattern** ✅
   - **Decision**: Use commitment-reveal scheme for patient registration
   - **Rationale**: Zero on-chain personal data, cryptographically secure identity
   - **Impact**: Meets privacy requirements, enables future ZK proof integration

### Pending Decisions

1. **Frontend Framework Setup** 🤔
   - **Question**: Start Next.js application in parallel or after contract completion?
   - **Options**: 
     - A) Wait for contract stability (current approach)
     - B) Start with mock contracts for parallel development
   - **Impact**: Development timeline and testing feedback loops

2. **Deployment Strategy** 🤔
   - **Question**: Deploy to testnet immediately or complete full testing locally?
   - **Considerations**: vlayer testnet integration, gas cost analysis, public testing
   - **Target Decision Date**: End of current sprint

3. **Error Handling Approach** 🤔
   - **Question**: How to handle vlayer proof generation failures?
   - **Options**: Retry mechanisms, fallback flows, manual override processes
   - **Impact**: User experience and system reliability

## Current Technical Challenges

### 1. vlayer Proof Integration Complexity
**Challenge**: Understanding optimal integration patterns for email proofs in healthcare context

**Research Needed**:
- How to handle proof failures gracefully
- Optimal user experience for domain verification workflow
- Integration with existing healthcare email systems

**Mitigation Strategy**:
- Start with simple domain verification
- Build comprehensive error handling
- Plan for manual fallback processes

### 2. Gas Optimization Requirements
**Challenge**: Healthcare operations need low transaction costs for adoption

**Current Analysis**:
- Patient registration: Target <50k gas
- Organization verification: Target <100k gas
- Need batch operations for efficiency

**Next Steps**:
- Implement gas reporting in tests
- Optimize storage patterns
- Consider proxy patterns for upgradability

### 3. Privacy Testing Methodology
**Challenge**: How to verify privacy guarantees in automated tests

**Approach Being Developed**:
- Test that no personal data appears in events or storage
- Verify commitment schemes work correctly
- Ensure no data leakage in error conditions

## Development Environment Status

### Working Components ✅
- Foundry compilation and basic testing
- vlayer SDK integration with TypeScript
- Docker devnet setup for vlayer
- Basic example contracts compile and deploy

### Setup Issues 🔧
- No major blockers identified
- Development environment is stable
- Team members can contribute effectively

### Tooling Gaps 📋
- Need frontend development environment setup
- Missing automated deployment scripts
- No CI/CD pipeline yet (planned for next sprint)

## Next 2-Week Sprint Plan

### Week 1: Contract Implementation
1. **Days 1-2**: RegistrationContract core implementation
   - Basic structure and role management
   - Patient commitment registration
   - Event emission patterns

2. **Days 3-4**: vlayer Integration
   - Email proof verification
   - Organization domain verification
   - Error handling patterns

3. **Day 5**: Testing & Validation
   - Unit tests for all functions
   - Gas optimization analysis
   - Security review

### Week 2: Integration & Testing
1. **Days 1-2**: Integration Testing
   - End-to-end vlayer proof workflows
   - Edge case handling
   - Performance optimization

2. **Days 3-4**: Documentation & Deployment Prep
   - Contract documentation
   - Deployment scripts
   - Testnet deployment preparation

3. **Day 5**: Sprint Review & Next Sprint Planning
   - Demo working registration system
   - Plan frontend development start
   - Outline claim contract requirements

## Stakeholder Communication

### Internal Team Updates
- **Frequency**: Daily standups
- **Focus**: Technical blockers, integration challenges, testing results
- **Medium**: Development chat + weekly longer sync

### External Dependencies
- **vlayer Team**: Proof generation support and best practices
- **Healthcare SMEs**: Workflow validation and compliance guidance
- **Potential Partners**: Early feedback on registration user experience

## Risk Monitor

### Technical Risks 🟡
1. **vlayer Integration Complexity**: Medium risk, mitigated by starting simple
2. **Gas Costs Too High**: Low risk, early optimization focus
3. **Privacy Implementation Gaps**: Low risk, well-understood patterns

### Timeline Risks 🟢
1. **Scope Creep**: Low risk, focused sprint goals
2. **External Dependencies**: Low risk, vlayer SDK is stable
3. **Testing Complexity**: Medium risk, building comprehensive suite

### Business Risks 🟡
1. **Regulatory Compliance**: Medium risk, healthcare regulations complex
2. **Market Timing**: Low risk, building MVP for validation
3. **Technology Adoption**: Medium risk, Web3 UX challenges

## Success Metrics for Current Sprint

### Technical Metrics
- [ ] RegistrationContract passes all unit tests
- [ ] Email proof integration works end-to-end
- [ ] Gas costs within target ranges
- [ ] Zero personal data exposed in testing

### Functional Metrics
- [ ] Patient can register with commitment successfully
- [ ] Organization can verify domain ownership
- [ ] Error cases handled gracefully
- [ ] Event audit trail captures all actions

### Quality Metrics
- [ ] 100% test coverage on critical functions
- [ ] Security review completed without major issues
- [ ] Documentation covers all user flows
- [ ] Code review process followed for all changes

This active context will be updated regularly as development progresses and new information becomes available. 