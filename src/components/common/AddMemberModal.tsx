import React, { useState } from 'react';
import { projectService, AddMemberByEmailRequest } from '../../services/project.service';
import './AddMemberModal.css';

interface AddMemberModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded?: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  projectId,
  isOpen,
  onClose,
  onMemberAdded,
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'>('MEMBER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const data: AddMemberByEmailRequest = {
        email: email.trim(),
        role,
      };

      await projectService.addMemberByEmail(projectId, data);
      setSuccess('Member added successfully!');
      setEmail('');
      setRole('MEMBER');
      
      // Notify parent component
      if (onMemberAdded) {
        onMemberAdded();
      }

      // Close modal after 1.5 seconds
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setRole('MEMBER');
    setError(null);
    setSuccess(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Member to Project</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-member-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter member's email"
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              disabled={loading}
              className="form-select"
            >
              <option value="VIEWER">Viewer</option>
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
            </select>
            <small className="form-hint">
              {role === 'VIEWER' && 'Can view project but cannot make changes'}
              {role === 'MEMBER' && 'Can create and edit tasks'}
              {role === 'ADMIN' && 'Can manage project settings and members'}
              {role === 'OWNER' && 'Full control over the project'}
            </small>
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <span className="alert-icon">✓</span>
              {success}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !email}
            >
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
