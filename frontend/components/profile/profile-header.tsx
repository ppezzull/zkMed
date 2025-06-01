"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Heart, Shield, CheckCircle, XCircle } from "lucide-react";
import { RoleLabels } from "@/actions/registration";

interface ProfileHeaderProps {
  address: string;
  role: number;
  verified: boolean;
  active: boolean;
}

export function ProfileHeader({ address, role, verified, active }: ProfileHeaderProps) {
  const getRoleIcon = () => {
    switch (role) {
      case 1: // Patient
        return User;
      case 2: // Hospital
        return Heart;
      case 3: // Insurer
        return Shield;
      default:
        return User;
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 1: // Patient
        return "bg-blue-500";
      case 2: // Hospital
        return "bg-green-500";
      case 3: // Insurer
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const Icon = getRoleIcon();
  const roleColor = getRoleColor();
  const roleLabel = RoleLabels[role as keyof typeof RoleLabels] || "Unknown";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className={roleColor}>
              <Icon className="h-8 w-8 text-white" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Welcome to zkMed</h2>
            <p className="text-muted-foreground">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-sm">
            Role: {roleLabel}
          </Badge>
          <Badge 
            variant={verified ? "default" : "destructive"} 
            className="text-sm flex items-center gap-1"
          >
            {verified ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            {verified ? "Verified" : "Unverified"}
          </Badge>
          <Badge 
            variant={active ? "default" : "secondary"} 
            className="text-sm"
          >
            {active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
} 