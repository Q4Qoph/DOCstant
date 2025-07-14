"use client"

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Eye,
  EyeOff,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

// Zod schema for user validation
const userRoles = ['0', '1', '2', '3', '4', '5'] as const;


const baseUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number'),
  role: z.enum(userRoles, {
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
  // department: z.string().optional(),
});



type CreateUserFormData = z.infer<typeof baseUserSchema>;
type EditUserFormData = z.infer<typeof baseUserSchema>;
type FormData = CreateUserFormData | EditUserFormData;

const UserForm = ({ user, isOpen, onClose, onSave }: {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
}) => {
  const isEditing = !!user;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    role: '' as User['role'],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role.toString(),
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '' as User['role'],
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (data: FormData): Record<string, string> => {
    try {
      baseUserSchema.parse(data);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        return fieldErrors;
      }
      return { general: 'Validation failed' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validationErrors = validateForm(formData);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        const userData = {
          ...formData,
          role: Number(formData.role),
        };

        await onSave(userData);
        onClose();
        toast.success(isEditing ? 'User updated successfully' : 'User created successfully');
      }
    } catch (error) {
      toast.error('An error occurred while saving the user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleLabels: Record<User['role'], string> = {
    '0': 'Receptionist',
    '1': 'General Practitioner',
    '2': 'Specialist',
    '3': 'Pharmacist',
    '4': 'Lab Technician',
    '5': 'Admin',
  };


  return (
    <SheetContent className="sm:max-w-[900px] w-full overflow-y-auto px-8 py-4">
      <SheetHeader className='p-0'>
        <SheetTitle>{isEditing ? 'Edit User' : 'Add New User'}</SheetTitle>
        <SheetDescription>
          {isEditing ? 'Update user information and permissions' : 'Create a new user account with appropriate role and permissions'}
        </SheetDescription>
      </SheetHeader>

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter full name"
              className={errors.name ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              className={errors.email ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1234567890"
              className={errors.phone ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(value: User['role']) => handleInputChange('role', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Receptionist</SelectItem>
                <SelectItem value="1">General Practitioner</SelectItem>
                <SelectItem value="2">Specialist</SelectItem>
                <SelectItem value="3">Pharmacist</SelectItem>
                <SelectItem value="4">Lab Technician</SelectItem>
                <SelectItem value="5">Admin</SelectItem>

              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
          </div>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {errors.general}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex  space-x-2 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting
              ? (isEditing ? 'Updating...' : 'Creating...')
              : (isEditing ? 'Update User' : 'Create User')
            }
          </Button>
        </div>
      </form>
    </SheetContent>
  );
};

export default UserForm;