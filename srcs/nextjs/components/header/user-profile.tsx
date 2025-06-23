'use client';

import { memo } from 'react';
import WalletConnect from '@/components/wallet-connect';

const UserProfile = memo(function UserProfile() {
  return <WalletConnect variant="header" />;
});

export default UserProfile;
