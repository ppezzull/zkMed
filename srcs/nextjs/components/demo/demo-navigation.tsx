'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DemoNavigation() {
  const demoUrls = [
    {
      title: "Admin Dashboard",
      description: "View registration stats and manage pending requests",
      url: "/admin",
      icon: "⚙️"
    },
    {
      title: "Patient Dashboard",
      description: "View patient medical records and registration",
      url: "/patient/0x7890123456789012345678901234567890123456",
      icon: "👤"
    },
    {
      title: "Hospital Dashboard", 
      description: "Access hospital management and patient care tools",
      url: "/hospital/0x1234567890123456789012345678901234567890",
      icon: "🏥"
    },
    {
      title: "Insurance Dashboard",
      description: "Manage insurance policies and claims processing", 
      url: "/insurance/0x2345678901234567890123456789012345678901",
      icon: "🛡️"
    },
    {
      title: "Demo Overview",
      description: "General demo page with registration statistics",
      url: "/demo",
      icon: "📊"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          zkMed Demo Navigation
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Navigate through different dashboards to experience the zkMed healthcare platform.
          All data is mocked for demonstration purposes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoUrls.map((item) => (
          <Card key={item.url} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">{item.icon}</div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 text-sm mb-4">
                {item.description}
              </p>
              <Button asChild className="w-full">
                <Link href={item.url}>
                  View Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📋 Demo Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">✅ What Works:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• All pages load with mock data</li>
              <li>• No wallet connection required</li>
              <li>• Realistic healthcare data display</li>
              <li>• Admin dashboard with stats</li>
              <li>• User role-specific dashboards</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">🔧 Mock Data Includes:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 1,247 total registered users</li>
              <li>• 892 patients, 23 hospitals, 12 insurers</li>
              <li>• Pending registration requests</li>
              <li>• Organization records and verification data</li>
              <li>• Admin roles and permissions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
