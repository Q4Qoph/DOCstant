"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Calendar, Package, TestTube, FileText, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const getDashboardCards = () => {
    switch (user?.role) {
      case 'RN':
        return [
          { title: 'Patients Today', value: '24', icon: Users, color: 'bg-blue-500' },
          { title: 'Appointments', value: '12', icon: Calendar, color: 'bg-green-500' },
          { title: 'Pending Payments', value: '8', icon: Package, color: 'bg-yellow-500' },
          { title: 'Pregnant Patients', value: '3', icon: Users, color: 'bg-pink-500' },
        ];
      case 'GP':
      case 'C':
        return [
          { title: 'Patients Today', value: '18', icon: Users, color: 'bg-blue-500' },
          { title: 'Consultations', value: '15', icon: FileText, color: 'bg-green-500' },
          { title: 'Pending Diagnoses', value: '5', icon: TestTube, color: 'bg-yellow-500' },
          { title: 'Follow-ups', value: '7', icon: Calendar, color: 'bg-purple-500' },
        ];
      case 'P':
        return [
          { title: 'Prescriptions', value: '23', icon: Package, color: 'bg-blue-500' },
          { title: 'Low Stock Items', value: '6', icon: TrendingUp, color: 'bg-red-500' },
          { title: 'Expired Items', value: '2', icon: Package, color: 'bg-yellow-500' },
          { title: 'Orders Today', value: '31', icon: FileText, color: 'bg-green-500' },
        ];
      case 'L':
        return [
          { title: 'Pending Tests', value: '12', icon: TestTube, color: 'bg-blue-500' },
          { title: 'Completed Today', value: '28', icon: FileText, color: 'bg-green-500' },
          { title: 'Critical Results', value: '3', icon: TrendingUp, color: 'bg-red-500' },
          { title: 'Equipment Status', value: 'OK', icon: TestTube, color: 'bg-green-500' },
        ];
      case 'admin':
        return [
          { title: 'Total Patients', value: '1,234', icon: Users, color: 'bg-blue-500' },
          { title: 'Active Staff', value: '45', icon: Users, color: 'bg-green-500' },
          { title: 'Revenue Today', value: '$2,450', icon: TrendingUp, color: 'bg-green-500' },
          { title: 'Departments', value: '5', icon: FileText, color: 'bg-purple-500' },
        ];
      default:
        return [];
    }
  };

  const cards = getDashboardCards();

  const departmentStats = [
    { name: 'Internal Medicine', patients: 45, color: 'bg-blue-100 text-blue-800' },
    { name: 'Surgery', patients: 23, color: 'bg-red-100 text-red-800' },
    { name: 'Paediatrics', patients: 31, color: 'bg-green-100 text-green-800' },
    { name: 'Obs & Gyn', patients: 18, color: 'bg-pink-100 text-pink-800' },
    { name: 'Geriatrics', patients: 12, color: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded-md ${card.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {(user?.role === 'admin' || user?.role === 'GP' || user?.role === 'C') && (
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Patient distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {departmentStats.map((dept, index) => (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${dept.color}`}>
                    {dept.patients} patients
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{dept.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm">Patient John Doe checked in - 10:30 AM</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm">Lab results ready for Patient #1234 - 10:15 AM</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <p className="text-sm">Prescription approved - 10:00 AM</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm">New appointment scheduled - 9:45 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {user?.role === 'RN' && (
                <>
                  <button className="p-3 text-left border rounded-lg hover:bg-gray-50">
                    <div className="font-medium text-sm">Add Patient</div>
                    <div className="text-xs text-gray-500">Register new patient</div>
                  </button>
                  <button className="p-3 text-left border rounded-lg hover:bg-gray-50">
                    <div className="font-medium text-sm">Record Vitals</div>
                    <div className="text-xs text-gray-500">Update patient vitals</div>
                  </button>
                </>
              )}
              {(user?.role === 'GP' || user?.role === 'C') && (
                <>
                  <button className="p-3 text-left border rounded-lg hover:bg-gray-50">
                    <div className="font-medium text-sm">New Consultation</div>
                    <div className="text-xs text-gray-500">Start patient consultation</div>
                  </button>
                  <button className="p-3 text-left border rounded-lg hover:bg-gray-50">
                    <div className="font-medium text-sm">Write Prescription</div>
                    <div className="text-xs text-gray-500">Create new prescription</div>
                  </button>
                </>
              )}
              {user?.role === 'P' && (
                <>
                  <button className="p-3 text-left border rounded-lg hover:bg-gray-50">
                    <div className="font-medium text-sm">Review Prescription</div>
                    <div className="text-xs text-gray-500">Approve medications</div>
                  </button>
                  <button className="p-3 text-left border rounded-lg hover:bg-gray-50">
                    <div className="font-medium text-sm">Update Inventory</div>
                    <div className="text-xs text-gray-500">Manage stock levels</div>
                  </button>
                </>
              )}
              {user?.role === 'L' && (
                <>
                  <button className="p-3 text-left border rounded-lg hover:bg-gray-50">
                    <div className="font-medium text-sm">Add Lab Result</div>
                    <div className="text-xs text-gray-500">Update test results</div>
                  </button>
                  <button className="p-3 text-left border rounded-lg hover:bg-gray-50">
                    <div className="font-medium text-sm">Equipment Status</div>
                    <div className="text-xs text-gray-500">Check equipment</div>
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default Dashboard;
