'use client';

import { useActiveAccount } from 'thirdweb/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import WalletConnect from '@/components/wallet-connect';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { useHealthcareRegistration } from '@/hooks/useHealthcareRegistration';
import { UserType } from '@/utils/types/healthcare';

interface UserProfileProps {
  onShowRegistration: () => void;
}

export default function UserProfile({ onShowRegistration }: UserProfileProps) {
  const account = useActiveAccount();
  const router = useRouter();
  const { disconnect } = useWallet();
  const registration = useHealthcareRegistration();

  const getUserRoleDisplay = () => {
    if (!registration.userRole) return null;
    
    const roleNames = {
      [UserType.PATIENT]: 'Patient',
      [UserType.HOSPITAL]: 'Hospital',
      [UserType.INSURER]: 'Insurance Company'
    };
    
    return roleNames[registration.userRole];
  };

  const getUserDisplayName = () => {
    if (!registration.userRecord) return null;
    
    if (registration.userRole === UserType.PATIENT) {
      return `${account?.address?.slice(0, 6)}...${account?.address?.slice(-4)}`;
    } else {
      return registration.userRecord.organizationName || registration.userRecord.domain;
    }
  };

  if (!account) {
    return <WalletConnect variant="header" />;
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Registration status badge */}
      {registration.isRegistered && getUserRoleDisplay() ? (
        <Badge className={`text-xs px-2 py-1 ${
          registration.userRole === UserType.PATIENT 
            ? 'bg-blue-100 text-blue-700'
            : registration.userRole === UserType.HOSPITAL
            ? 'bg-green-100 text-green-700'
            : 'bg-purple-100 text-purple-700'
        }`}>
          {getUserRoleDisplay()}
        </Badge>
      ) : (
        <Badge className="bg-orange-100 text-orange-700 text-xs px-2 py-1">
          🧪 Testnet Active
        </Badge>
      )}
      
      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-lg">👤</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium leading-none">
              {registration.isRegistered && getUserDisplayName() 
                ? getUserDisplayName() 
                : 'Connected Wallet'
              }
            </p>
            <p className="text-xs leading-none text-slate-600">
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </p>
          </div>
          <DropdownMenuSeparator />
          
          {/* Show different menu items based on registration status */}
          {registration.isRegistered ? (
            <>
              {registration.userRole === UserType.PATIENT && (
                <DropdownMenuItem onClick={() => router.push('/patient')}>
                  🏥 My Records
                </DropdownMenuItem>
              )}
              {(registration.userRole === UserType.HOSPITAL || registration.userRole === UserType.INSURER) && (
                <DropdownMenuItem onClick={() => router.push('/organization')}>
                  📊 Dashboard
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => router.push('/claims')}>
                🏥 My Claims
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/pool')}>
                💰 Pool Analytics
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={onShowRegistration}>
              📝 Complete Registration
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={() => router.push('/dev')}>
            🛠️ Developer Tools
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnect} className="text-red-600">
            🚪 Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
