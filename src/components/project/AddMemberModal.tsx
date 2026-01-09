import { useState } from 'react';
import { X, Mail, UserPlus } from 'lucide-react';
import { projectService } from '../../services/project.service';
import type { AddMemberByEmailRequest } from '../../services/project.service';
import { useToast } from '../common/ToastProvider';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onMemberAdded?: () => void;
}

export default function AddMemberModal({
  isOpen,
  onClose,
  projectId,
  projectName,
  onMemberAdded,
}: AddMemberModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'>('MEMBER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const request: AddMemberByEmailRequest = {
        email: email.trim(),
        role,
      };

      await projectService.addMemberByEmail(projectId, request);
      
      addToast({ 
        type: 'success', 
        message: `Successfully added ${email} to ${projectName}` 
      });
      
      // Reset form
      setEmail('');
      setRole('MEMBER');
      
      // Notify parent component
      if (onMemberAdded) {
        onMemberAdded();
      }
      
      // Close modal
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add member';
      addToast({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setEmail('');
      setRole('MEMBER');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add Member</h2>
              <p className="text-sm text-gray-600">{projectName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Email Input */}
          <div>
            <label htmlFor="memberEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="memberEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@example.com"
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                required
                disabled={isSubmitting}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Enter the email address of the person you want to add
            </p>
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="memberRole" className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              id="memberRole"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              required
              disabled={isSubmitting}
            >
              <option value="VIEWER">Viewer - Can view project</option>
              <option value="MEMBER">Member - Can view and edit</option>
              <option value="ADMIN">Admin - Can manage project</option>
              <option value="OWNER">Owner - Full control</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Select the permission level for this member
            </p>
          </div>

          {/* Role Descriptions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Role Permissions</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li><strong>Viewer:</strong> Can only view project details</li>
              <li><strong>Member:</strong> Can create and edit tasks</li>
              <li><strong>Admin:</strong> Can manage members and settings</li>
              <li><strong>Owner:</strong> Full project control including deletion</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
