"use client"

import React, { useState } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Search,
  UserPlus,
  Edit3,
  Trash2,
  Shield,
  Phone,
  Mail,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import UserForm from './UserForm';
import api from '@/lib/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import UserManagementSkeleton from '../loading';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

  const queryClient = useQueryClient()

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/api/user/users")
      return response.data
    }
  })

  const handleAddUser = () => {
    setEditingUser(undefined);
    setIsSheetOpen(true);
    console.log(editingUser)
  };

  const handleSaveUser = async (userData: any) => {
    try {
      if (editingUser) {
        // Update existing user
        await api.put(`/api/User/update/${editingUser.id}`, userData)
        toast.success('User updated successfully!');
        queryClient.invalidateQueries({ queryKey: ['users'] });
      } else {
        // Add new user
        await api.post('/api/user/register', userData)
        toast.success('User created successfully!');
        queryClient.invalidateQueries({ queryKey: ['users'] });
      }
    } catch (error) {
      toast.error('Failed to save user. Please try again.');
    }

  };
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsSheetOpen(true);
  };

  const roleLabels: Record<User['role'], string> = {
    '0': 'Receptionist',
    '1': 'General Practitioner',
    '2': 'Specialist',
    '3': 'Pharmacist',
    '4': 'Lab Technician',
    '5': 'Admin',
  };

  const roleColors: Record<number, string> = {
    0: 'bg-blue-100 text-blue-800',
    1: 'bg-green-100 text-green-800',
    2: 'bg-purple-100 text-purple-800',
    3: 'bg-orange-100 text-orange-800',
    4: 'bg-cyan-100 text-cyan-800',
    5: 'bg-red-100 text-red-800'
  };

  const handleRoleUpdate = async (user: User, newRole: User['role']) => {
    try {
      await api.put(`/api/User/update/${user.id}`, { ...user, role: Number(newRole) });
      toast.success("User role has been successfully updated.");
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      toast.error("Failed to update user role.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.delete(`/api/User/${userId}`);
      toast.success('User has been successfully removed from the system.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      toast.error('Failed to delete user.');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (isLoading) return <UserManagementSkeleton />
  if (isError) return <p>Loading..</p>

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage system users, roles, and permissions</p>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={handleAddUser} className="flex bg-blue-500 hover:bg-blue-600 items-center space-x-2">
              <UserPlus className="h-4 w-4" />
              <span>Add New User</span>
            </Button>
          </SheetTrigger>
          <UserForm
            user={editingUser}
            isOpen={isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
            onSave={handleSaveUser}
          />
        </Sheet>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">GP</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doctors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((u: User) => u.role === 'GP' || u.role === 'C').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">RN</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nurses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((u: User) => u.role === 'RN').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-sm">ST</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Support Staff</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((u: User) => u.role === 'P' || u.role === 'L').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="RN">Receptionist/Nurse</SelectItem>
                  <SelectItem value="GP">General Practitioner</SelectItem>
                  <SelectItem value="C">Specialist</SelectItem>
                  <SelectItem value="P">Pharmacist</SelectItem>
                  <SelectItem value="L">Lab Technician</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-600 text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value: User['role']) => handleRoleUpdate(user, value)}
                    >
                      <SelectTrigger className="w-40">
                        <Badge className={roleColors[user.role]}>
                          {roleLabels[user.role]}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Receptionist/Nurse</SelectItem>
                        <SelectItem value="1">General Practitioner</SelectItem>
                        <SelectItem value="2">Specialist</SelectItem>
                        <SelectItem value="3">Pharmacist</SelectItem>
                        <SelectItem value="4">Lab Technician</SelectItem>
                        <SelectItem value="5">Administrator</SelectItem>

                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2 ">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {user.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete User
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No users found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
