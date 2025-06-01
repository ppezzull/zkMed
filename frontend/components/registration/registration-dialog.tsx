"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Shield, Heart } from "lucide-react";
import { Role } from "@/lib/constants";

interface RegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleSelect: (role: number) => void;
}

export function RegistrationDialog({ open, onOpenChange, onRoleSelect }: RegistrationDialogProps) {
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  const roles = [
    {
      id: Role.Patient,
      title: "Patient",
      description: "Register as a patient to manage your medical records and claims",
      icon: User,
      color: "bg-blue-500",
      features: ["Privacy-preserving medical records", "Submit insurance claims", "Control data access"],
    },
    {
      id: Role.Hospital,
      title: "Hospital",
      description: "Register as a healthcare provider to manage patient care",
      icon: Heart,
      color: "bg-green-500",
      features: ["Verify patient procedures", "Submit claims on behalf of patients", "Access authorized medical data"],
    },
    {
      id: Role.Insurer,
      title: "Insurance Company",
      description: "Register as an insurance provider to process claims",
      icon: Shield,
      color: "bg-purple-500",
      features: ["Review and approve claims", "Manage policy coverage", "Process payments securely"],
    },
  ];

  const handleRoleSelect = (roleId: number) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole !== null) {
      onRoleSelect(selectedRole);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to zkMed
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Choose your role to get started with privacy-preserving healthcare
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected ? "ring-2 ring-primary shadow-lg" : ""
                }`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full ${role.color} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {role.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  {isSelected && (
                    <Badge className="mt-4 w-full justify-center" variant="default">
                      Selected
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleContinue}
            disabled={selectedRole === null}
            size="lg"
            className="px-8"
          >
            Continue Registration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 