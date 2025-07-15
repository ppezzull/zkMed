# zkMed Page Specifications - Complete User Journey Map

**Date**: Friday, July 4, 2025 at 1:35 pm CEST  
**Purpose**: Detailed page specifications for all user roles  
**Scope**: Complete frontend architecture for hackathon

---

## 🏠 **LANDING PAGE** (`/`)

### **Layout Structure**
```
┌─────────────────────────────────────────────────────────────┐
│                      zkMed Logo                             │
│              Decentralized Healthcare Payments              │
│                                                             │
│    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│    │   Admin     │  │  Hospital   │  │  Insurance  │        │
│    │   Portal    │  │   Portal    │  │   Portal    │        │
│    │   [Login]   │  │   [Login]   │  │   [Login]   │        │
│    └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│                  ┌─────────────┐                            │
│                  │   Patient   │                            │
│                  │   Portal    │                            │
│                  │   [Login]   │                            │
│                  └─────────────┘                            │
│                                                             │
│              Connect your wallet to continue                │
└─────────────────────────────────────────────────────────────┘
```

### **Components Required**
- `<HeroBanner>` - zkMed branding and value proposition
- `<RoleSelectionGrid>` - 4 role portals with hover effects
- `<WalletConnectButton>` - thirdweb integration
- `<FeatureHighlights>` - Yield, Privacy, Speed benefits

---

## 👑 **ADMIN DASHBOARD** (`/admin`)

### **Main Dashboard**
```
┌─────────────────────────────────────────────────────────────┐
│ zkMed Admin    [🔔 Notifications]    [👤 Profile] [Logout] │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│ │Total Orgs   │ │Active       │ │Pending      │ │Rejected │ │
│ │     24      │ │     20      │ │     3       │ │    1    │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Recent Activity                                    [View All]│
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ • Hospital Milano approved                    2h ago     │ │
│ │ • Generali Insurance pending                  4h ago     │ │
│ │ • San Raffaele rejected (domain)             1d ago      │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Quick Actions                                               │
│ [📋 View Pending] [🏢 All Organizations] [🔍 Domain Check] │
└─────────────────────────────────────────────────────────────┘
```

### **Admin Subpages**

#### **Pending Requests** (`/admin/pending`)
- Organization approval workflow
- Domain verification interface
- Bulk approve/reject actions
- MailProof validation display

#### **Organizations** (`/admin/organizations`)
- Complete organization table
- Search and filter functionality
- Organization detail views
- Status management interface

#### **Domain Verification** (`/admin/verification`)
- MailProof verification workflow
- Domain ownership validation
- Email authentication status
- Verification history tracking

---

## 🏥 **HOSPITAL DASHBOARD** (`/hospital/[address]`)

### **Main Dashboard**
```
┌─────────────────────────────────────────────────────────────┐
│ Hospital Portal  💰 Due: 1,250 USDC  [👤 Profile] [⚙️]    │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│ │This Month   │ │Pending      │ │Insurance    │ │Patients │ │
│ │3,200 USDC   │ │1,250 USDC   │ │Partners: 3  │ │   89    │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Treatment Queue                                   [View All]│
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ • Patient: 0x1234...  Treatment: Cardiology  [Submit]   │ │
│ │ • Patient: 0x5678...  Treatment: Radiology   [Submit]   │ │
│ │ • Patient: 0x9abc...  Treatment: Surgery     [Submit]   │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Navigation                                                  │
│ [👥 Patients] [📋 Claims] [🤝 Associations]                │
└─────────────────────────────────────────────────────────────┘
```

### **Hospital Subpages**

#### **Patients** (`/hospital/[address]/patients`)
- Current patient list
- Treatment history
- Patient status tracking
- Treatment submission interface

#### **Claims** (`/hospital/[address]/claims`)
- Claim submission interface
- Claim status tracking
- Payment history
- MailProof claim verification

#### **Associations** (`/hospital/[address]/associations`)
- Insurance partnership management
- Association request interface
- Partnership status tracking
- Revenue by insurance partner

---

## 🏢 **INSURANCE DASHBOARD** (`/insurance/[address]`)

### **Main Dashboard**
```
┌─────────────────────────────────────────────────────────────┐
│ Insurance Portal  💰 Pool: 50,000 USDC  [👤 Profile] [⚙️] │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│ │Total Pool   │ │Active Claims│ │APY Return   │ │Patients │ │
│ │50,000 USDC  │ │     12      │ │   8.5%      │ │   456   │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Recent Payments                                    [View All]│
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ • Hospital Milano    Patient: 0x1234...   €250  [✅]    │ │
│ │ • San Raffaele      Patient: 0x5678...   €180  [✅]     │ │
│ │ • Bambino Gesù      Patient: 0x9abc...   €320  [⏳]     │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Navigation                                                  │
│ [👥 Patients] [🏥 Hospitals] [📋 Claims] [💰 Pools]        │
└─────────────────────────────────────────────────────────────┘
```

### **Insurance Subpages**

#### **Patients** (`/insurance/[address]/patients`)
- Patient search and management
- Add patient by hash interface
- Patient insurance status
- Payment history per patient

#### **Hospitals** (`/insurance/[address]/hospitals`)
- Hospital network management
- Add hospital by hash interface
- Hospital payment tracking
- Partnership management

#### **Claims** (`/insurance/[address]/claims`)
- Claim processing interface
- Approve/reject workflow
- MailProof verification
- Claim payment tracking

#### **Pools** (`/insurance/[address]/pools`)
- Pool performance dashboard
- APY tracking and analytics
- Yield distribution visualization
- Pool management interface

#### **Pay Interface** (`/insurance/[address]/pay`)
```
┌─────────────────────────────────────────────────────────────┐
│ Send Payment                                          [✕]   │
├─────────────────────────────────────────────────────────────┤
│ Step 1: Find Recipient                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ email@domain.com → email#hash           [Find]         │ │
│ └─────────────────────────────────────────────────────────┘ │
│ Step 2: Payment Details                                     │
│ Amount: [500] USDC   Operation ID: [OP_12345]              │
│ Step 3: Email Composition                                   │
│ Auto-generated payment email with MailProof                │
│              [Cancel]        [Send Payment]                │
└─────────────────────────────────────────────────────────────┘
```

#### **Associates Table** (`/insurance/[address]/associates`)
```
|----------------|-----------|--------|-------|---------|
| HOSPITAL/USER  | MAIL      | STATUS | PAID  | RECEIVED|
|----------------|-----------|--------|-------|---------|
| THE_USER       | THEMAIL   | PAID   | 100   | 200     |
| THE_HOSPITAL   | THEMAIL   | PENDING| 0     | 0       |
| THE_USER2      | THEMAIL   | NOT_PAID| 0    | 0       |
|----------------|-----------|--------|-------|---------|
```

---

## 🩺 **PATIENT DASHBOARD** (`/patient/[address]`)

### **Main Dashboard**
```
┌─────────────────────────────────────────────────────────────┐
│ Patient Portal  ✅ Insurance: Active  [👤 Profile] [⚙️]     │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│ │Active Claims│ │Reimbursed   │ │Insurance    │ │Hospitals│ │
│ │     2       │ │   5,430€    │ │Generali     │ │    3    │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Recent Claims                                      [View All]│
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ • Hospital Milano    €250   [✅ Approved]     2d ago     │ │
│ │ • San Raffaele      €180   [⏳ Pending]       1d ago     │ │
│ │ • Bambino Gesù      €320   [✅ Paid]          5d ago     │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Quick Actions                                               │
│ [📄 Upload Receipt] [🔍 Find Hospital] [💼 Insurance]      │
└─────────────────────────────────────────────────────────────┘
```

### **Patient Subpages**

#### **Claims** (`/patient/[address]/claims`)
- Complete claims history
- Claim status tracking
- Receipt upload interface
- MailProof verification status

#### **Insurance** (`/patient/[address]/insurance`)
- Insurance status management
- Premium payment interface
- Yield tracking display
- Insurance association requests

#### **Hospitals** (`/patient/[address]/hospitals`)
- Hospital selection interface
- Treatment history
- Hospital relationship management
- Hospital finder and search

#### **Payment Interface** (`/patient/[address]/pay`)
```
┌─────────────────────────────────────────────────────────────┐
│ Monthly Premium Payment                                     │
├─────────────────────────────────────────────────────────────┤
│ Duration: [12 months]                                       │
│ Monthly Allowance: [100] USDC                              │
│ Next Payment: [15/02/2025]                                 │
│                                                             │
│ Automatic Payment: [✅ Enabled]                            │
│                                                             │
│              [Update]        [Pay Now]                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 **MOBILE ADAPTATIONS**

### **Mobile Patient Dashboard**
```
┌─────────────────────────────────┐
│ ☰ zkMed      🔔    Profile     │
├─────────────────────────────────┤
│ ✅ Insurance: Active            │
│ 💰 Balance: €1,234              │
├─────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ │
│ │Active Claims│ │Reimbursed   │ │
│ │     2       │ │   5,430€    │ │
│ └─────────────┘ └─────────────┘ │
├─────────────────────────────────┤
│ Recent Claims                   │
│ ┌─────────────────────────────┐ │
│ │ Hospital Milano    €250     │ │
│ │ ✅ Approved      2d ago     │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ [Upload] [Find] [Insurance]     │
└─────────────────────────────────┘
```

### **Bottom Tab Navigation**
```
┌─────────────────────────────────┐
│         Main Content            │
├─────────────────────────────────┤
│ [Home] [Claims] [Hospitals]     │
│                                 │
│ [Insurance] [Settings]          │
└─────────────────────────────────┘
```

---

## 🔄 **USER FLOW CONNECTIONS**

### **Cross-Role Interactions**
1. **Patient → Hospital**: Receipt upload triggers hospital notification
2. **Hospital → Insurance**: Claim submission triggers approval workflow
3. **Insurance → Patient/Hospital**: Payment authorization via MailProof
4. **Admin → All**: Organization approval enables role access

### **Key Modal Workflows**
- **Receipt Upload**: File → Hospital → Amount → Submit
- **Association Request**: Search → Select → Message → Send
- **Payment Sending**: Recipient → Amount → Email → Send
- **Organization Approval**: Review → Verify → Approve/Reject

---

## 🚀 **IMPLEMENTATION PRIORITY**

### **Day 1 (24h)**
1. **Landing Page** - Role selection and wallet connection
2. **Dashboard Shells** - Basic layout for all 4 roles
3. **Core Navigation** - Header, sidebar, mobile nav
4. **Metric Cards** - Dashboard statistics display

### **Day 2 (24h)**
1. **Advanced Features** - MailProof integration
2. **Modal Workflows** - Receipt upload, associations
3. **Real-time Updates** - Payment tracking, notifications
4. **Mobile Optimization** - Responsive design completion

**These page specifications provide the complete blueprint for a professional healthcare platform that will dominate the hackathon through superior UX architecture.** 🏆

---

**Page Specifications Completed**: Friday, July 4, 2025 at 1:35 pm CEST  
**Implementation Ready**: Complete frontend architecture defined  
**Victory Path**: Execute page development in priority order 