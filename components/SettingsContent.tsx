
import React, { useState } from 'react';
import { Settings, AlertTriangle, PauseCircle, ShieldAlert, Ban, Globe, Lock, Palette, Check, Save, PlayCircle, RefreshCw } from 'lucide-react';
import { Toggle, Modal, TextArea, TextInput, ColorInput, SelectGroup, Badge } from './FormElements';

interface SettingsContentProps {
  tenantStatus: 'Active' | 'Suspended' | 'Paused' | 'Terminated';
  setTenantStatus: (status: 'Active' | 'Suspended' | 'Paused' | 'Terminated') => void;
}

export const SettingsContent: React.FC<SettingsContentProps> = ({ tenantStatus, setTenantStatus }) => {
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<'suspend' | 'pause' | 'terminate' | 'resume' | 'activate'>('suspend');
  const [terminationConfirmText, setTerminationConfirmText] = useState('');
  const [suspensionReason, setSuspensionReason] = useState('');

  const handleStatusChangeSubmit = () => {
    if (statusAction === 'suspend') setTenantStatus('Suspended');
    if (statusAction === 'pause') setTenantStatus('Paused');
    if (statusAction === 'terminate') setTenantStatus('Terminated');
    if (statusAction === 'resume' || statusAction === 'activate') setTenantStatus('Active');
    
    setStatusModalOpen(false);
    setTerminationConfirmText('');
    setSuspensionReason('');
  };

  const openModal = (action: typeof statusAction) => {
    setStatusAction(action);
    setStatusModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-10">
      
      {/* Branding & White-labeling */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Palette size={20} className="text-purple-500" /> Branding & Domain
            </h2>
            <button className="text-sm font-semibold text-brand-teal hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                <Save size={14} /> Save Changes
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <TextInput label="Custom Domain" placeholder="e.g. lms.college.edu" value="portal.ladydoak.edu" icon={Globe} />
                <div className="flex items-center gap-2 text-green-600 text-xs font-semibold bg-green-50 px-3 py-1.5 rounded-lg w-fit">
                    <Check size={12} /> Domain Verified & SSL Active
                </div>
                <SelectGroup label="Theme Preset" placeholder="Select Theme" options={['Classory Light', 'Classory Dark', 'Custom']} value="Custom" />
            </div>
            <div className="space-y-4">
                <ColorInput label="Primary Brand Color" value="#2A9D8F" />
                <ColorInput label="Secondary Accent" value="#F4A261" />
            </div>
        </div>
      </div>

      {/* Security & Access */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Lock size={20} className="text-blue-500" /> Security & Access
        </h2>
        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                <div>
                    <h4 className="text-sm font-semibold text-gray-900">Enforce Single Sign-On (SSO)</h4>
                    <p className="text-xs text-gray-500">Require users to login via Google Workspace or Microsoft Azure.</p>
                </div>
                <Toggle label="" checked={false} />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                <div>
                    <h4 className="text-sm font-semibold text-gray-900">Force 2FA for Admins</h4>
                    <p className="text-xs text-gray-500">All users with administrative privileges must use Two-Factor Authentication.</p>
                </div>
                <Toggle label="" checked={true} />
            </div>
            <div className="pt-2">
                <TextArea label="IP Whitelisting (Optional)" placeholder="Enter allowed IP addresses separated by commas. Leave empty to allow all." />
            </div>
        </div>
      </div>

      {/* Localization */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Globe size={20} className="text-gray-400" /> Regional & Localization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SelectGroup label="Default Language" placeholder="Select Language" options={['English (US)', 'English (UK)', 'Spanish', 'French']} value="English (UK)" />
            <SelectGroup label="Timezone" placeholder="Select Timezone" options={['UTC', 'IST (GMT+5:30)', 'EST (GMT-5)']} value="IST (GMT+5:30)" />
            <SelectGroup label="Currency" placeholder="Select Currency" options={['USD ($)', 'INR (₹)', 'EUR (€)']} value="USD ($)" />
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Settings size={20} className="text-gray-400" /> General Configuration
        </h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Automatic Updates</h4>
              <p className="text-xs text-gray-500">Automatically apply new version patches to this tenant.</p>
            </div>
            <Toggle label="" checked={true} />
          </div>
          <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Billing Notifications</h4>
              <p className="text-xs text-gray-500">Send invoice reminders to tenant admins.</p>
            </div>
            <Toggle label="" checked={true} />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className={`rounded-3xl p-8 border shadow-sm relative overflow-hidden transition-all ${
        tenantStatus === 'Active' ? 'bg-white border-red-100' :
        tenantStatus === 'Paused' ? 'bg-amber-50 border-amber-200' :
        'bg-red-50 border-red-200'
      }`}>
        {tenantStatus === 'Active' && <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>}
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className={`text-lg font-bold mb-2 flex items-center gap-2 ${tenantStatus === 'Active' ? 'text-red-700' : 'text-gray-900'}`}>
              <AlertTriangle size={20} /> Danger Zone
            </h2>
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-500">
                Current Status: 
              </p>
              <Badge status={tenantStatus} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          
          {/* PAUSE / RESUME LOGIC */}
          {tenantStatus === 'Paused' ? (
             <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-amber-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-50 p-2 rounded-lg text-amber-600 border border-amber-100">
                    <PlayCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Resume Subscription</h4>
                    <p className="text-xs text-gray-500">Unfreeze billing and restore full access immediately.</p>
                  </div>
                </div>
                <button
                  onClick={() => openModal('resume')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  Resume Access
                </button>
              </div>
          ) : tenantStatus === 'Active' ? (
             <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg text-amber-600 border border-amber-100 shadow-sm">
                    <PauseCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">Pause Subscription</h4>
                    <p className="text-xs text-amber-700/80">Temporarily freeze billing and access. Data is retained.</p>
                  </div>
                </div>
                <button
                  onClick={() => openModal('pause')}
                  className="px-4 py-2 bg-white border border-amber-200 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-100 transition-colors shadow-sm"
                >
                  Pause Access
                </button>
              </div>
          ) : null}

          {/* SUSPEND / UNSUSPEND LOGIC */}
          {tenantStatus === 'Suspended' ? (
             <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-red-50 p-2 rounded-lg text-red-600 border border-red-100">
                    <RefreshCw size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Unsuspend Tenant</h4>
                    <p className="text-xs text-gray-500">Restore access to all users. Credentials will remain the same.</p>
                  </div>
                </div>
                <button
                  onClick={() => openModal('activate')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  Unsuspend Account
                </button>
              </div>
          ) : tenantStatus === 'Active' ? (
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg text-red-600 border border-red-100 shadow-sm">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-red-900">Suspend Tenant</h4>
                    <p className="text-xs text-red-700/80">Immediately block all access due to policy violation or risk.</p>
                  </div>
                </div>
                <button
                  onClick={() => openModal('suspend')}
                  className="px-4 py-2 bg-white border border-red-200 text-red-700 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                >
                  Suspend Tenant
                </button>
              </div>
          ) : null}

          {/* Terminate (Always Visible unless Terminated) */}
          {tenantStatus !== 'Terminated' && (
            <div className={`flex items-center justify-between p-4 rounded-xl border ${
                tenantStatus === 'Active' ? 'bg-gray-50 border-gray-200' : 'bg-white/50 border-gray-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg text-gray-600 border border-gray-200 shadow-sm">
                  <Ban size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Terminate Tenant</h4>
                  <p className="text-xs text-gray-500">Permanently delete tenant data and revoke all licenses.</p>
                </div>
              </div>
              <button
                onClick={() => openModal('terminate')}
                className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors shadow-sm"
              >
                Terminate
              </button>
            </div>
          )}
          
          {tenantStatus === 'Terminated' && (
             <div className="p-4 bg-red-100 border border-red-200 rounded-xl text-center text-red-800 font-bold">
                 This tenant has been permanently terminated.
             </div>
          )}

        </div>
      </div>

      {/* Lifecycle Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={
          statusAction === 'suspend' ? 'Suspend Tenant Access' :
          statusAction === 'pause' ? 'Pause Subscription' : 
          statusAction === 'terminate' ? 'Terminate Tenant' :
          statusAction === 'resume' ? 'Resume Subscription' : 'Reactivate Tenant'
        }
        footer={
          <div className="flex gap-2 w-full">
            <button onClick={() => setStatusModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button
              onClick={handleStatusChangeSubmit}
              disabled={statusAction === 'terminate' && terminationConfirmText !== 'DELETE'}
              className={`flex-1 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  statusAction === 'terminate' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' :
                  statusAction === 'suspend' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' :
                  statusAction === 'resume' || statusAction === 'activate' ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20' :
                  'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
              }`}
            >
              {statusAction === 'terminate' ? 'Permanently Terminate' : 
               statusAction === 'suspend' ? 'Suspend Access' : 
               statusAction === 'resume' ? 'Confirm Resume' :
               statusAction === 'activate' ? 'Confirm Reactivation' :
               'Confirm Pause'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {statusAction === 'suspend' && (
            <>
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm flex gap-2">
                <AlertTriangle size={18} className="shrink-0" />
                <p>This will immediately block all users (Students, Teachers, Admins) from logging in. Data will be preserved but inaccessible.</p>
              </div>
              <TextArea label="Reason for Suspension" placeholder="e.g. Non-payment of invoice #INV-2024-001 or Suspicious Activity" />
            </>
          )}

          {statusAction === 'pause' && (
            <>
              <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-sm flex gap-2">
                <PauseCircle size={18} className="shrink-0" />
                <p>Billing will be halted. Users will not be able to access premium features. Read-only access can be configured in Fallback plan.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Pause From</label>
                  <input type="date" className="border border-gray-200 rounded-xl px-4 py-2 text-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Resume On (Optional)</label>
                  <input type="date" className="border border-gray-200 rounded-xl px-4 py-2 text-sm" />
                </div>
              </div>
            </>
          )}

          {(statusAction === 'resume' || statusAction === 'activate') && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm flex gap-2">
                <Check size={18} className="shrink-0" />
                <p>
                    {statusAction === 'resume' 
                    ? "Subscription billing will resume immediately. All premium features will be restored." 
                    : "Tenant access will be restored. Users will be able to login with their existing credentials."}
                </p>
              </div>
          )}

          {statusAction === 'terminate' && (
            <>
              <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm border border-red-100">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldAlert size={16} /> WARNING: IRREVERSIBLE ACTION
                </div>
                <p>This will permanently delete the tenant <strong>Lady Doak College</strong> and all associated data (Users, content, histories). This cannot be undone.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Type "DELETE" to confirm</label>
                <input
                  type="text"
                  value={terminationConfirmText}
                  onChange={(e) => setTerminationConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full border border-red-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                />
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
