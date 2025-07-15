# zkMed Component Specifications - 48h Hackathon Implementation

**Date**: Friday, July 4, 2025 at 1:25 pm CEST  
**Purpose**: Detailed technical specifications for all UI components  
**Scope**: Frontend component library for all 4 user roles  
**Timeline**: 48h hackathon development window

---

## 🎨 **DESIGN SYSTEM TOKENS**

### **Color System**
```typescript
export const zkMedColors = {
  primary: {
    navy: '#283044',      // Headers, primary text, navigation
    blue: '#78A1BB',      // Interactive elements, buttons, links
    mint: '#EBF5EE',      // Success states, positive actions
    taupe: '#BFA89E',     // Secondary text, subtle backgrounds
    brown: '#8B786D',     // Borders, accents, secondary actions
  },
  semantic: {
    success: '#EBF5EE',
    warning: '#FFF3CD',
    error: '#F8D7DA',
    info: '#D1ECF1',
  },
  neutral: {
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
  }
} as const;
```

### **Typography Scale**
```typescript
export const typography = {
  h1: 'text-3xl font-bold text-primary-navy',
  h2: 'text-2xl font-semibold text-primary-navy',
  h3: 'text-xl font-medium text-primary-navy',
  h4: 'text-lg font-medium text-primary-navy',
  body: 'text-base text-primary-navy',
  bodySmall: 'text-sm text-primary-taupe',
  caption: 'text-xs text-primary-taupe',
  button: 'text-sm font-medium',
} as const;
```

### **Spacing System**
```typescript
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;
```

---

## 🧩 **CORE UI COMPONENTS**

### **1. Button Component**

#### **Interface Definition**
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}
```

#### **Variant Specifications**
```css
/* Primary Button */
.btn-primary {
  background-color: #78A1BB;
  color: white;
  border: 1px solid #78A1BB;
  hover:background-color: #6891AB;
  focus:ring-2 focus:ring-#78A1BB focus:ring-opacity-50;
}

/* Secondary Button */
.btn-secondary {
  background-color: transparent;
  color: #78A1BB;
  border: 1px solid #78A1BB;
  hover:background-color: #EBF5EE;
}

/* Tertiary Button */
.btn-tertiary {
  background-color: transparent;
  color: #283044;
  border: none;
  hover:background-color: #F3F4F6;
}

/* Danger Button */
.btn-danger {
  background-color: #DC2626;
  color: white;
  border: 1px solid #DC2626;
  hover:background-color: #B91C1C;
}
```

#### **Size Specifications**
```css
.btn-sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
.btn-md { padding: 0.75rem 1.5rem; font-size: 1rem; }
.btn-lg { padding: 1rem 2rem; font-size: 1.125rem; }
```

### **2. Card Component**

#### **Interface Definition**
```typescript
interface CardProps {
  variant: 'default' | 'bordered' | 'elevated' | 'interactive';
  padding: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
```

#### **Implementation Structure**
```tsx
export function Card({ variant, padding, header, children, footer, onClick, className }: CardProps) {
  return (
    <div className={cn(
      'bg-white rounded-lg',
      {
        'border border-gray-200': variant === 'bordered',
        'shadow-lg': variant === 'elevated',
        'cursor-pointer hover:shadow-md transition-shadow': variant === 'interactive',
        'p-0': padding === 'none',
        'p-4': padding === 'sm',
        'p-6': padding === 'md',
        'p-8': padding === 'lg',
      },
      className
    )} onClick={onClick}>
      {header && (
        <div className="border-b border-gray-200 pb-4 mb-4">
          {header}
        </div>
      )}
      {children}
      {footer && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          {footer}
        </div>
      )}
    </div>
  );
}
```

### **3. Badge Component**

#### **Interface Definition**
```typescript
interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}
```

#### **Variant Styles**
```css
.badge-success { background: #EBF5EE; color: #059669; }
.badge-warning { background: #FFF3CD; color: #D97706; }
.badge-error { background: #F8D7DA; color: #DC2626; }
.badge-info { background: #D1ECF1; color: #0891B2; }
.badge-neutral { background: #F3F4F6; color: #374151; }
```

---

## 🏥 **HEALTHCARE-SPECIFIC COMPONENTS**

### **1. BaseRecordCard Component**

#### **Interface Definition**
```typescript
interface BaseRecordCardProps {
  record: {
    wallet: string;
    emailHash: string;
    registrationTime: Date;
    isActive: boolean;
    role: 'patient' | 'hospital' | 'insurance' | 'admin';
    name?: string;
    domain?: string;
  };
  actions?: Action[];
  onClick?: () => void;
  showDetails?: boolean;
}

interface Action {
  label: string;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
}
```

#### **Component Structure**
```tsx
export function BaseRecordCard({ record, actions, onClick, showDetails }: BaseRecordCardProps) {
  return (
    <Card variant="bordered" padding="md" onClick={onClick} className="group">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            {getRoleIcon(record.role)}
          </Avatar>
          <div>
            <h3 className="font-medium text-primary-navy">
              {record.name || truncateAddress(record.wallet)}
            </h3>
            <p className="text-sm text-primary-taupe">
              {record.domain || record.emailHash}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={record.isActive ? 'success' : 'error'}>
            {record.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <RoleIcon role={record.role} />
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-primary-taupe">Registered:</span>
            <span className="text-primary-navy">{formatDate(record.registrationTime)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-primary-taupe">Wallet:</span>
            <span className="text-primary-navy font-mono">{truncateAddress(record.wallet)}</span>
          </div>
        </div>
      )}
      
      {actions && actions.length > 0 && (
        <div className="mt-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              icon={action.icon}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
}
```

### **2. AssociationManager Component**

#### **Interface Definition**
```typescript
interface AssociationManagerProps {
  currentAssociations: Association[];
  onSearch: (query: string) => Promise<SearchResult[]>;
  onInvite: (target: SearchResult, message?: string) => Promise<void>;
  onRemove: (associationId: string) => Promise<void>;
  role: 'patient' | 'hospital' | 'insurance';
}

interface Association {
  id: string;
  targetWallet: string;
  targetName: string;
  targetType: 'patient' | 'hospital' | 'insurance';
  status: 'active' | 'pending' | 'rejected';
  createdAt: Date;
  totalPaid?: number;
  totalReceived?: number;
}

interface SearchResult {
  wallet: string;
  name: string;
  type: 'patient' | 'hospital' | 'insurance';
  domain?: string;
  isVerified: boolean;
  canAssociate: boolean;
  reason?: string;
}
```

#### **Component Implementation**
```tsx
export function AssociationManager({ currentAssociations, onSearch, onInvite, onRemove, role }: AssociationManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [inviteMessage, setInviteMessage] = useState('');

  const handleSearch = async (query: string) => {
    if (query.length < 3) return;
    
    setIsLoading(true);
    try {
      const results = await onSearch(query);
      setSearchResults(results);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card variant="bordered" padding="md">
        <h3 className="text-lg font-medium text-primary-navy mb-4">Add New Association</h3>
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search by wallet address or email hash..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              icon={<Search className="h-4 w-4" />}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Spinner className="h-4 w-4" />
              </div>
            )}
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-primary-taupe">Search Results:</p>
              {searchResults.map((result) => (
                <div key={result.wallet} className={cn(
                  'p-3 border rounded-lg cursor-pointer transition-colors',
                  result.canAssociate 
                    ? 'border-gray-200 hover:border-primary-blue hover:bg-blue-50'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        {getRoleIcon(result.type)}
                      </Avatar>
                      <div>
                        <p className="font-medium text-primary-navy">{result.name}</p>
                        <p className="text-sm text-primary-taupe">{result.domain || truncateAddress(result.wallet)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {result.isVerified && (
                        <Badge variant="success" size="sm">Verified</Badge>
                      )}
                      {result.canAssociate ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setSelectedResult(result)}
                        >
                          Invite
                        </Button>
                      ) : (
                        <Badge variant="error" size="sm">{result.reason}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Current Associations */}
      <Card variant="bordered" padding="md">
        <h3 className="text-lg font-medium text-primary-navy mb-4">Current Associations</h3>
        {currentAssociations.length === 0 ? (
          <p className="text-primary-taupe text-center py-8">No associations yet</p>
        ) : (
          <div className="space-y-3">
            {currentAssociations.map((association) => (
              <div key={association.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    {getRoleIcon(association.targetType)}
                  </Avatar>
                  <div>
                    <p className="font-medium text-primary-navy">{association.targetName}</p>
                    <p className="text-sm text-primary-taupe">
                      {truncateAddress(association.targetWallet)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {association.totalPaid !== undefined && (
                    <div className="text-right">
                      <p className="text-sm text-primary-taupe">Paid</p>
                      <p className="font-medium">${association.totalPaid}</p>
                    </div>
                  )}
                  {association.totalReceived !== undefined && (
                    <div className="text-right">
                      <p className="text-sm text-primary-taupe">Received</p>
                      <p className="font-medium">${association.totalReceived}</p>
                    </div>
                  )}
                  <Badge variant={
                    association.status === 'active' ? 'success' :
                    association.status === 'pending' ? 'warning' : 'error'
                  }>
                    {association.status}
                  </Badge>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onRemove(association.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Invite Modal */}
      {selectedResult && (
        <Modal open={!!selectedResult} onClose={() => setSelectedResult(null)}>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Send Association Request</h3>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  {getRoleIcon(selectedResult.type)}
                </Avatar>
                <div>
                  <p className="font-medium">{selectedResult.name}</p>
                  <p className="text-sm text-gray-600">{selectedResult.domain || truncateAddress(selectedResult.wallet)}</p>
                </div>
              </div>
            </div>
            <textarea
              placeholder="Optional message..."
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg resize-none"
              rows={3}
            />
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={() => setSelectedResult(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  await onInvite(selectedResult, inviteMessage);
                  setSelectedResult(null);
                  setInviteMessage('');
                }}
              >
                Send Request
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
```

### **3. ReceiptUpload Component**

#### **Interface Definition**
```typescript
interface ReceiptUploadProps {
  onUpload: (file: File, metadata: ReceiptMetadata) => Promise<UploadResult>;
  acceptedFormats: string[];
  maxSize: number;
  autoDetectAmount: boolean;
  hospitalOptions: Hospital[];
  treatmentTypes: TreatmentType[];
}

interface ReceiptMetadata {
  hospital: string;
  treatmentType: string;
  amount: number;
  date: Date;
  notes?: string;
}

interface UploadResult {
  success: boolean;
  mailProofId?: string;
  claimId?: string;
  error?: string;
}

interface Hospital {
  id: string;
  name: string;
  domain: string;
  isAssociated: boolean;
}

interface TreatmentType {
  id: string;
  name: string;
  category: string;
}
```

#### **Component Implementation**
```tsx
export function ReceiptUpload({ onUpload, acceptedFormats, maxSize, autoDetectAmount, hospitalOptions, treatmentTypes }: ReceiptUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Partial<ReceiptMetadata>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${formatFileSize(maxSize)}`);
    }

    if (!acceptedFormats.includes(file.type)) {
      throw new Error(`File type not supported. Accepted formats: ${acceptedFormats.join(', ')}`);
    }

    setSelectedFile(file);
    
    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }

    // Auto-detect amount if enabled
    if (autoDetectAmount) {
      extractAmountFromFile(file).then((amount) => {
        if (amount) {
          setMetadata(prev => ({ ...prev, amount }));
        }
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !metadata.hospital || !metadata.amount) {
      throw new Error('Please fill in all required fields');
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await onUpload(selectedFile, metadata as ReceiptMetadata);
      
      if (result.success) {
        // Reset form
        setSelectedFile(null);
        setPreview(null);
        setMetadata({});
        toast.success('Claim submitted successfully!');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card variant="bordered" padding="lg">
      <h3 className="text-xl font-semibold text-primary-navy mb-6">Submit New Claim</h3>
      
      <div className="space-y-6">
        {/* File Upload Area */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-primary-navy">
            Receipt Upload
          </label>
          
          {!selectedFile ? (
            <FileDropzone
              onFileSelect={handleFileSelect}
              acceptedFormats={acceptedFormats}
              maxSize={maxSize}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileIcon className="h-8 w-8 text-primary-blue" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                >
                  Remove
                </Button>
              </div>
              
              {preview && (
                <div className="relative">
                  <img src={preview} alt="Receipt preview" className="max-h-64 rounded-lg border" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Metadata Form */}
        {selectedFile && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-navy mb-2">
                Hospital
              </label>
              <select
                value={metadata.hospital || ''}
                onChange={(e) => setMetadata(prev => ({ ...prev, hospital: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-lg"
              >
                <option value="">Select hospital...</option>
                {hospitalOptions.map(hospital => (
                  <option key={hospital.id} value={hospital.id} disabled={!hospital.isAssociated}>
                    {hospital.name} {!hospital.isAssociated && '(Not Associated)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-navy mb-2">
                Treatment Type
              </label>
              <select
                value={metadata.treatmentType || ''}
                onChange={(e) => setMetadata(prev => ({ ...prev, treatmentType: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-lg"
              >
                <option value="">Select treatment...</option>
                {treatmentTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-navy mb-2">
                  Amount (€)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={metadata.amount || ''}
                  onChange={(e) => setMetadata(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                  placeholder="0.00"
                />
                {autoDetectAmount && metadata.amount && (
                  <p className="text-xs text-primary-taupe mt-1">Auto-detected</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-navy mb-2">
                  Date
                </label>
                <Input
                  type="date"
                  value={metadata.date ? formatDateForInput(metadata.date) : ''}
                  onChange={(e) => setMetadata(prev => ({ ...prev, date: new Date(e.target.value) }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-navy mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={metadata.notes || ''}
                onChange={(e) => setMetadata(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional information about the treatment..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Submit Section */}
        {selectedFile && (
          <div className="border-t pt-6">
            {isUploading && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Submitting claim...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
            
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                  setMetadata({});
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!metadata.hospital || !metadata.amount || isUploading}
                loading={isUploading}
              >
                Submit Claim
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
```

---

## 📊 **DATA VISUALIZATION COMPONENTS**

### **1. PoolOverview Component**

#### **Interface Definition**
```typescript
interface PoolOverviewProps {
  poolData: {
    totalPool: number;
    userBalance: number;
      costSavings: number;
  automatedClaims: number;
    totalClaims: number;
    activeClaims: number;
    currency: 'USDC' | 'mUSD';
  };
  showDetails?: boolean;
  onViewDetails?: () => void;
}
```

#### **Component Implementation**
```tsx
export function PoolOverview({ poolData, showDetails, onViewDetails }: PoolOverviewProps) {
  const { totalPool, userBalance, costSavings, automatedClaims, totalClaims, activeClaims, currency } = poolData;

  return (
    <Card variant="elevated" padding="lg" className="bg-gradient-to-br from-primary-blue/5 to-primary-mint/10">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary-navy">Pool Overview</h2>
          <p className="text-primary-taupe">Real-time pool performance</p>
        </div>
        {onViewDetails && (
          <Button variant="tertiary" size="sm" onClick={onViewDetails}>
            View Details
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <MetricCard
          title="Total Pool"
          value={formatCurrency(totalPool, currency)}
          trend={+2.5}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
                  title="Cost Savings"
        value={`${costSavings.toFixed(1)}%`}
          trend={+0.3}
          icon={<TrendingUp className="h-5 w-5" />}
          highlight
        />
        <MetricCard
          title="Your Balance"
          value={formatCurrency(userBalance, currency)}
          subtitle={`Automated: ${automatedClaims} claims`}
          icon={<Wallet className="h-5 w-5" />}
        />
      </div>

      {showDetails && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-medium text-primary-navy mb-2">Claims Activity</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-primary-taupe">Total Claims</span>
                  <span className="font-medium">{totalClaims}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-taupe">Active Claims</span>
                  <Badge variant="info">{activeClaims}</Badge>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-medium text-primary-navy mb-2">Pool Health</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-primary-taupe">Utilization</span>
                  <span className="font-medium">73%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-taupe">Liquidity</span>
                  <Badge variant="success">High</Badge>
                </div>
              </div>
            </div>
          </div>

          <PoolChart data={generatePoolChartData()} />
        </div>
      )}
    </Card>
  );
}
```

### **2. MetricsCard Component**

#### **Interface Definition**
```typescript
interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  icon?: React.ReactNode;
  highlight?: boolean;
  onClick?: () => void;
}
```

#### **Component Implementation**
```tsx
export function MetricsCard({ title, value, subtitle, trend, icon, highlight, onClick }: MetricsCardProps) {
  return (
    <Card 
      variant={onClick ? "interactive" : "bordered"} 
      padding="md" 
      onClick={onClick}
      className={cn(
        'transition-all duration-200',
        highlight && 'border-primary-blue bg-primary-blue/5'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-primary-taupe mb-1">{title}</p>
          <p className="text-2xl font-bold text-primary-navy">{value}</p>
          {subtitle && (
            <p className="text-sm text-primary-taupe mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={cn(
            'p-2 rounded-lg',
            highlight ? 'bg-primary-blue text-white' : 'bg-gray-100 text-primary-blue'
          )}>
            {icon}
          </div>
        )}
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center mt-3">
          <div className={cn(
            'flex items-center text-sm',
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
          )}>
            {trend > 0 ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : trend < 0 ? (
              <ArrowDown className="h-3 w-3 mr-1" />
            ) : null}
            {Math.abs(trend)}%
          </div>
          <span className="text-xs text-primary-taupe ml-2">vs last month</span>
        </div>
      )}
    </Card>
  );
}
```

---

## 📱 **MOBILE-SPECIFIC COMPONENTS**

### **1. MobileNavigation Component**

#### **Interface Definition**
```typescript
interface MobileNavigationProps {
  role: 'patient' | 'hospital' | 'insurance' | 'admin';
  currentPath: string;
  onNavigate: (path: string) => void;
}
```

#### **Component Implementation**
```tsx
export function MobileNavigation({ role, currentPath, onNavigate }: MobileNavigationProps) {
  const navigationItems = getNavigationItems(role);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 lg:hidden">
      <div className="flex justify-around items-center">
        {navigationItems.slice(0, 5).map((item) => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={cn(
              'flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors min-w-0',
              currentPath === item.path
                ? 'text-primary-blue bg-primary-blue/10'
                : 'text-gray-600'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

### **2. MobileHeader Component**

#### **Component Implementation**
```tsx
export function MobileHeader({ title, user, onMenuToggle, onProfileToggle }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button variant="tertiary" size="sm" onClick={onMenuToggle}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-primary-navy truncate">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="tertiary" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="tertiary" size="sm" onClick={onProfileToggle}>
            <Avatar className="h-6 w-6">
              {user.name?.[0] || '?'}
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
}
```

---

## 🔧 **UTILITY COMPONENTS**

### **1. LoadingSpinner Component**
```tsx
export function LoadingSpinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  return (
    <div className={cn(
      'animate-spin rounded-full border-2 border-gray-200 border-t-primary-blue',
      {
        'h-4 w-4': size === 'sm',
        'h-6 w-6': size === 'md',
        'h-8 w-8': size === 'lg',
      },
      className
    )} />
  );
}
```

### **2. EmptyState Component**
```tsx
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

### **3. ErrorBoundary Component**
```tsx
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export function ErrorBoundary({ children, fallback: Fallback }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(new Error(event.message));
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    if (Fallback) {
      return <Fallback error={error} resetError={() => setError(null)} />;
    }

    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <Button onClick={() => setError(null)}>Try Again</Button>
      </div>
    );
  }

  return <>{children}</>;
}
```

---

## 📋 **IMPLEMENTATION CHECKLIST**

### **Priority 1: Core Components** (Hour 1-12)
- [ ] Button with all variants and states
- [ ] Card with different padding and interaction options
- [ ] Badge for status indicators
- [ ] Input with validation and error states
- [ ] Modal for overlays and dialogs

### **Priority 2: Healthcare Components** (Hour 13-24)
- [ ] BaseRecordCard for user information display
- [ ] MetricsCard for dashboard statistics
- [ ] LoadingSpinner and EmptyState for feedback
- [ ] MobileHeader and MobileNavigation
- [ ] ErrorBoundary for error handling

### **Priority 3: Advanced Components** (Hour 25-36)
- [ ] AssociationManager for relationship management
- [ ] ReceiptUpload for MailProof integration
- [ ] PoolOverview for financial visualization
- [ ] PaymentHistory for transaction tracking
- [ ] NotificationCenter for real-time alerts

### **Priority 4: Polish Components** (Hour 37-48)
- [ ] Advanced search interfaces
- [ ] Data visualization charts
- [ ] Bulk action components
- [ ] Export and reporting tools
- [ ] Accessibility enhancements

---

## 🎯 **SUCCESS CRITERIA**

### **Component Quality Standards**
- ✅ **Accessibility**: WCAG 2.1 AA compliance
- ✅ **Performance**: <100ms render time for all components
- ✅ **Responsiveness**: Perfect mobile/desktop adaptation
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Reusability**: Consistent API across similar components

### **Integration Requirements**
- ✅ **Design System**: Consistent color/typography usage
- ✅ **State Management**: Clean prop interfaces
- ✅ **Error Handling**: Graceful failure modes
- ✅ **Loading States**: Smooth user feedback
- ✅ **Testing**: Unit tests for critical components

**This component library provides the foundation for a world-class healthcare platform that will dominate the hackathon through superior UX/UI implementation.** 🏆

---

**Specifications Completed**: Friday, July 4, 2025 at 1:25 pm CEST  
**Implementation Ready**: All components specified with TypeScript interfaces  
**Hackathon Victory Path**: Execute component priority list for optimal results 