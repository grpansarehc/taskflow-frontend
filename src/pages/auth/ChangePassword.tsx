import React, { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle2, XCircle } from 'lucide-react';

interface PasswordStrength {
  score: number;
  feedback: string;
  color: string;
}


const PasswordInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  toggleShow: () => void;
  placeholder: string;
}> = ({ label, value, onChange, show, toggleShow, placeholder }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-white/80 tracking-wide">{label}</label>
    <div className="relative flex items-center">
      <Lock size={18} className="absolute left-4 text-white/30 pointer-events-none z-10" />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-3.5 px-12 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] placeholder:text-white/30 transition-all duration-300 outline-none focus:bg-white/8 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-4 text-white/40 hover:text-white/70 transition-colors p-1 flex items-center justify-center"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const strengths = [
      { score: 0, feedback: 'Very Weak', color: '#ef4444' },
      { score: 1, feedback: 'Weak', color: '#f97316' },
      { score: 2, feedback: 'Fair', color: '#eab308' },
      { score: 3, feedback: 'Good', color: '#84cc16' },
      { score: 4, feedback: 'Strong', color: '#22c55e' },
      { score: 5, feedback: 'Very Strong', color: '#10b981' },
    ];

    return strengths[score];
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  const validateForm = (): boolean => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return false;
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from current password');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setIsSubmitting(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8">
      <div className="w-full max-width: 480px; animate-[fadeIn_0.6s_ease-out]">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
          .animate-slide-down { animation: slideDown 0.3s ease-out; }
          .animate-spin { animation: spin 0.6s linear infinite; }
        `}</style>
        
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden max-w-md mx-auto">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl inline-flex items-center justify-center mb-5 animate-pulse-slow">
              <Lock size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-semibold mb-2 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
              Change Password
            </h1>
            <p className="text-white/50 text-[15px]">Secure your account with a new password</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrentPassword}
              toggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
              placeholder="Enter current password"
            /> */}

            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNewPassword}
              toggleShow={() => setShowNewPassword(!showNewPassword)}
              placeholder="Enter new password"
            />

            {newPassword && (
              <div className="mt-3 animate-slide-down">
                <div className="flex justify-between items-center mb-2 text-[13px]">
                  <span className="text-white/60">Password Strength:</span>
                  <span className="font-medium" style={{ color: passwordStrength.color }}>
                    {passwordStrength.feedback}
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  />
                </div>
              </div>
            )}

            {newPassword && (
              <div className="mt-4 p-4 bg-white/[0.03] border border-white/5 rounded-lg animate-slide-down">
                <div className="text-[13px] font-medium text-white/70 mb-3">Password Requirements:</div>
                <div className={`flex items-center gap-2 text-[13px] mb-1.5 ${newPassword.length >= 8 ? 'text-emerald-400' : 'text-white/50'}`}>
                  {newPassword.length >= 8 ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  At least 8 characters
                </div>
                <div className={`flex items-center gap-2 text-[13px] mb-1.5 ${/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? 'text-emerald-400' : 'text-white/50'}`}>
                  {/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  Uppercase and lowercase letters
                </div>
                <div className={`flex items-center gap-2 text-[13px] mb-1.5 ${/\d/.test(newPassword) ? 'text-emerald-400' : 'text-white/50'}`}>
                  {/\d/.test(newPassword) ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  At least one number
                </div>
                <div className={`flex items-center gap-2 text-[13px] ${/[^a-zA-Z0-9]/.test(newPassword) ? 'text-emerald-400' : 'text-white/50'}`}>
                  {/[^a-zA-Z0-9]/.test(newPassword) ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  At least one special character
                </div>
              </div>
            )}

            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirmPassword}
              toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              placeholder="Re-enter new password"
            />

            {error && (
              <div className="flex items-center gap-2.5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm animate-slide-down">
                <XCircle size={18} />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm animate-slide-down">
                <CheckCircle2 size={18} />
                Password changed successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white text-base font-semibold tracking-wide transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_12px_24px_rgba(99,102,241,0.4)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Changing Password...
                </span>
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;