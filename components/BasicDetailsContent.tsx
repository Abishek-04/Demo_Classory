
import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Palette, 
  Save, 
  Globe, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  CheckCircle2, 
  RefreshCcw,
  Info,
  Copy,
  Eye,
  EyeOff,
  Check,
  Smartphone,
  AtSign,
  PlusCircle,
  MoreVertical
} from 'lucide-react';
import { 
  TextInput, 
  SelectGroup, 
  PillSelection, 
  SectionHeader, 
  Toggle, 
  FileUpload, 
  ColorInput 
} from './FormElements';

type SubSection = 'Tenant Details' | 'Admin' | 'Appearance';

interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Invited';
}

export const BasicDetailsContent: React.FC = () => {
  const [activeSubSection, setActiveSubSection] = useState<SubSection>('Tenant Details');
  const [institutionType, setInstitutionType] = useState('Private');
  
  // Theme State for Preview
  const [primaryColor, setPrimaryColor] = useState('#2A9D8F');
  const [secondaryColor, setSecondaryColor] = useState('#F4A261');
  const [buttonColor, setButtonColor] = useState('#2A9D8F');

  // Admin Setup State
  const [adminStep, setAdminStep] = useState<'list' | 'form' | 'success'>('form');
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [passwordMode, setPasswordMode] = useState<'auto' | 'manual'>('manual');
  const [showPassword, setShowPassword] = useState(false);
  const [adminForm, setAdminForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const menuItems: { id: SubSection; icon: React.ElementType; label: string }[] = [
    { id: 'Tenant Details', icon: Building2, label: 'Tenant Details' },
    { id: 'Admin', icon: ShieldCheck, label: 'Admin Setup' },
    { id: 'Appearance', icon: Palette, label: 'Appearance' },
  ];

  const handleCreateAdmin = () => {
    // Simulate API call
    setTimeout(() => {
      const newAdmin: AdminProfile = {
        id: Date.now().toString(),
        firstName: adminForm.firstName,
        lastName: adminForm.lastName,
        email: adminForm.email,
        phone: adminForm.phone,
        role: 'Client Admin',
        status: 'Invited'
      };
      setAdmins([...admins, newAdmin]);
      setAdminStep('success');
    }, 500);
  };

  const handleAddNewClick = () => {
      setAdminForm({ firstName: '', lastName: '', email: '', phone: '', password: '' });
      setAdminStep('form');
  };

  const renderTenantDetails = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <SectionHeader 
          title="Institution Information" 
          subtitle="Enter the key details to onboard a new institution to Classory LMS" 
        />
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput label="Institution Name" placeholder="e.g. Lady Doak College" value="Lady Doak College" icon={Building2} />
            <SelectGroup 
              label="University Affiliation" 
              placeholder="Select Type" 
              options={['Autonomous', 'Affiliated', 'Deemed University', 'Private University']} 
              value="Autonomous" 
            />
          </div>
          
          <PillSelection 
            label="Institution Type" 
            options={['Private', 'Government', 'Deemed', 'Trust-run']} 
            value={institutionType}
            onChange={setInstitutionType}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <SectionHeader 
          title="Contact Details" 
          subtitle="Primary point of contact for this tenant" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TextInput label="Main Admin Name" placeholder="e.g. Dr. Sarah Johnson" icon={User} />
          <TextInput label="Contact Email" placeholder="principal@college.edu" icon={Mail} />
          <TextInput label="Institution Phone" placeholder="+91 98765 43210" icon={Phone} />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <SectionHeader 
          title="Address & Location" 
          subtitle="Physical location of the main campus" 
        />
        
        <div className="space-y-6">
          <TextInput label="Institution Address" placeholder="Street Address, Area" icon={MapPin} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <TextInput label="City" placeholder="Madurai" />
            <TextInput label="State" placeholder="Tamil Nadu" />
            <TextInput label="Country" placeholder="India" />
            <TextInput label="Pincode" placeholder="625002" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <SectionHeader 
          title="Additional Info" 
          subtitle="Regulatory and operational details" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SelectGroup label="Academic Zone" placeholder="Select Zone" options={['North', 'South', 'East', 'West', 'Central']} value="South" />
          <TextInput label="Institution Code (Optional)" placeholder="e.g. INST-2024" />
          <TextInput label="Year of Establishment" placeholder="e.g. 1948" />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button className="bg-brand-teal hover:bg-brand-tealDark text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-brand-teal/20 transition-all flex items-center gap-2">
          <Save size={18} /> Save Changes
        </button>
      </div>
    </div>
  );

  const renderAdminList = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
       <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <SectionHeader 
               title="Admin Setup" 
               subtitle="Manage administrators for this institution." 
            />
            <button 
              onClick={handleAddNewClick}
              className="bg-brand-teal hover:bg-brand-tealDark text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-brand-teal/20 transition-all flex items-center gap-2"
            >
              <PlusCircle size={16} /> Add New Admin
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
             {admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-brand-teal/30 transition-all bg-gray-50/30">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg uppercase">
                         {admin.firstName[0]}{admin.lastName[0]}
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900">{admin.firstName} {admin.lastName}</h4>
                         <p className="text-xs text-gray-500">{admin.email} • {admin.phone}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                        {admin.status}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                   </div>
                </div>
             ))}
             
             {admins.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400">
                      <ShieldCheck size={32} />
                   </div>
                   <h3 className="text-gray-900 font-medium mb-1">No Admins Added</h3>
                   <p className="text-gray-500 text-xs mb-4">Create the first administrator to manage this tenant.</p>
                   <button 
                      onClick={handleAddNewClick}
                      className="text-brand-teal font-semibold text-sm hover:underline"
                   >
                      Create Admin
                   </button>
                </div>
             )}
          </div>
       </div>
    </div>
  );

  const renderAdminSetup = () => {
    if (adminStep === 'list') {
        return renderAdminList();
    }
    
    if (adminStep === 'success') {
      return (
        <div className="animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto">
           <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-xl text-center">
              {/* Success Illustration */}
              <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                 <div className="absolute inset-0 bg-teal-100 rounded-full animate-ping opacity-20"></div>
                 <CheckCircle2 size={48} className="text-brand-teal" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Added</h2>
              <p className="text-gray-500 text-sm mb-8">The admin has been added to your organization</p>

              {/* Credential Card */}
              <div className="bg-orange-50/50 border border-orange-100 rounded-2xl overflow-hidden mb-6">
                 <div className="flex border-b border-orange-100">
                    <div className="flex-1 p-4 border-r border-orange-100">
                       <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">Username</p>
                       <p className="text-gray-900 font-semibold text-lg">{adminForm.firstName || 'MANISHA'}.{adminForm.lastName?.[0] || 'M'}</p>
                       <p className="text-xs text-gray-500">{adminForm.email || 'manishaa@admin1.com'}</p>
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-center">
                       <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">Password</p>
                       <div className="flex items-center justify-center gap-2">
                          <span className="text-gray-900 font-bold text-lg tracking-widest">••••••</span>
                          <EyeOff size={16} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Actions */}
              <div className="text-left mb-6">
                 <label className="flex items-start gap-3 cursor-pointer group p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="relative flex items-center">
                       <input type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-brand-teal checked:bg-brand-teal" defaultChecked />
                       <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                         <Check size={12} strokeWidth={4} />
                       </div>
                    </div>
                    <div>
                       <span className="text-sm font-medium text-gray-900 block">Send sign-in activation link to <span className="text-brand-teal">{adminForm.email || 'manishaa@admin1.com'}</span></span>
                       <span className="text-xs text-gray-500">Ask them to open the link and set their password to activate their admin account.</span>
                    </div>
                 </label>
              </div>

              {/* Copy Link */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-3 mb-8 hover:border-gray-300 transition-colors">
                 <span className="text-xs text-brand-teal truncate flex-1 font-mono">https://classory.app/account/activate?token=8f92h3h92h39h39dh2939dh239d</span>
                 <button className="text-gray-400 hover:text-gray-700 p-1.5 hover:bg-white rounded-lg transition-all">
                    <Copy size={16} />
                 </button>
              </div>

              <div className="flex gap-4 justify-center">
                 <button 
                    onClick={handleAddNewClick}
                    className="px-6 py-2.5 rounded-full border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
                 >
                    Add Another Admin
                 </button>
                 <button 
                    onClick={() => setAdminStep('list')}
                    className="px-6 py-2.5 rounded-full bg-brand-teal text-white font-medium text-sm hover:bg-brand-tealDark shadow-lg shadow-brand-teal/20 transition-all"
                 >
                    Done
                 </button>
              </div>
           </div>
        </div>
      );
    }

    // Form Step
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
         <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <SectionHeader 
               title="User Information" 
               subtitle="Enter the details for the main client administrator." 
            />

            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-gray-700">First Name</label>
                     <input 
                        type="text" 
                        placeholder="Eg: Anna" 
                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm shadow-sm"
                        value={adminForm.firstName}
                        onChange={(e) => setAdminForm({...adminForm, firstName: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-gray-700">Last Name</label>
                     <input 
                        type="text" 
                        placeholder="Eg: University" 
                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm shadow-sm"
                        value={adminForm.lastName}
                        onChange={(e) => setAdminForm({...adminForm, lastName: e.target.value})}
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-gray-700">Primary Email</label>
                     <input 
                        type="email" 
                        placeholder="Eg: anna@university.edu" 
                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm shadow-sm"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                     />
                  </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-gray-700">Phone Number</label>
                     <input 
                        type="tel" 
                        placeholder="Eg: +91 98765 43210" 
                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm shadow-sm"
                        value={adminForm.phone}
                        onChange={(e) => setAdminForm({...adminForm, phone: e.target.value})}
                     />
                  </div>
               </div>

               <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">Secondary Email (Optional)</label>
                   <input 
                      type="email" 
                      placeholder="Eg: recovery@university.edu" 
                      className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm shadow-sm"
                   />
               </div>
            </div>
         </div>

         <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Password</h2>
            
            <div className="space-y-4">
               {/* Option 1: Auto Generate */}
               <div 
                  onClick={() => setPasswordMode('auto')}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                     passwordMode === 'auto' 
                     ? 'bg-brand-teal/5 border-brand-teal ring-1 ring-brand-teal/20' 
                     : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
               >
                  <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                     passwordMode === 'auto' ? 'border-brand-teal' : 'border-gray-300'
                  }`}>
                     {passwordMode === 'auto' && <div className="w-2.5 h-2.5 rounded-full bg-brand-teal"></div>}
                  </div>
                  <div>
                     <span className="text-sm font-bold text-gray-900 block mb-1">Automatically generate a password</span>
                     <span className="text-xs text-gray-500">You'll be able to view and copy the password in the next step.</span>
                  </div>
               </div>

               {/* Option 2: Create Password */}
               <div 
                  onClick={() => setPasswordMode('manual')}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                     passwordMode === 'manual' 
                     ? 'bg-brand-teal/5 border-brand-teal ring-1 ring-brand-teal/20' 
                     : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
               >
                  <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                     passwordMode === 'manual' ? 'border-brand-teal' : 'border-gray-300'
                  }`}>
                     {passwordMode === 'manual' && <div className="w-2.5 h-2.5 rounded-full bg-brand-teal"></div>}
                  </div>
                  <div className="flex-1">
                     <span className="text-sm font-bold text-gray-900 block mb-3">Create Password</span>
                     {passwordMode === 'manual' && (
                        <div className="relative max-w-sm animate-in fade-in slide-in-from-top-1">
                           <input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter Password" 
                              className="w-full bg-white border border-gray-300 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-brand-teal"
                              onClick={(e) => e.stopPropagation()}
                              value={adminForm.password}
                              onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                           />
                           <button 
                              onClick={(e) => { e.stopPropagation(); setShowPassword(!showPassword); }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                           >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
               <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
               <p className="text-xs text-blue-800">
                  <span className="font-bold text-blue-900">Requirement:</span> This user will be required to change their password when they sign in for the first time.
               </p>
            </div>
         </div>

         <div className="flex justify-end pt-4 gap-3">
            <button 
                onClick={() => setAdminStep(admins.length > 0 ? 'list' : 'form')}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
               Cancel
            </button>
            <button 
               onClick={handleCreateAdmin}
               className="bg-brand-teal hover:bg-brand-tealDark text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-brand-teal/20 transition-all"
            >
               Create Admin
            </button>
         </div>
      </div>
    );
  };

  const renderAppearance = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Brand Identity */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <SectionHeader 
          title="Brand Identity" 
          subtitle="Upload institution assets. These will be used across the portal." 
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FileUpload label="Institution Logo" sublabel="Primary logo for dashboard (PNG, SVG)" />
          <FileUpload label="Favicon" sublabel="Browser tab icon (32x32px)" />
          <FileUpload label="Dark Mode Logo" sublabel="Optional. Used on dark backgrounds" />
        </div>
      </div>

      {/* Theme Configuration with Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-1 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <SectionHeader 
              title="Color Theme" 
              subtitle="Define your brand palette" 
            />
            <div className="space-y-6">
              <ColorInput label="Primary Color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
              <ColorInput label="Secondary Color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
              <ColorInput label="Button / Accent" value={buttonColor} onChange={(e) => setButtonColor(e.target.value)} />
            </div>
         </div>

         {/* Mini Preview Widget */}
         <div className="lg:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-100 flex flex-col items-center justify-center">
             <div className="mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Live Dashboard Preview</div>
             
             {/* Simulated Mini Dashboard */}
             <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                {/* Mini Header */}
                <div className="h-12 border-b border-gray-100 flex items-center px-4 justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md" style={{ backgroundColor: primaryColor }}></div>
                      <div className="h-2 w-20 bg-gray-200 rounded-full"></div>
                   </div>
                   <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                   </div>
                </div>
                {/* Mini Body */}
                <div className="flex h-48">
                   {/* Mini Sidebar */}
                   <div className="w-16 border-r border-gray-100 bg-gray-50/50 p-2 flex flex-col gap-2">
                      <div className="h-6 w-full rounded bg-white border border-gray-100"></div>
                      <div className="h-6 w-full rounded text-white opacity-80" style={{ backgroundColor: primaryColor }}></div>
                      <div className="h-6 w-full rounded bg-white border border-gray-100"></div>
                   </div>
                   {/* Mini Content */}
                   <div className="flex-1 p-4 space-y-3">
                      <div className="h-8 w-1/3 bg-gray-100 rounded-lg"></div>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="h-20 bg-white border border-gray-100 rounded-lg shadow-sm p-3 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-8 h-8 rounded-bl-full opacity-20" style={{ backgroundColor: secondaryColor }}></div>
                         </div>
                         <div className="h-20 bg-white border border-gray-100 rounded-lg shadow-sm p-3 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-8 h-8 rounded-bl-full opacity-20" style={{ backgroundColor: secondaryColor }}></div>
                         </div>
                      </div>
                      <div className="flex justify-end mt-2">
                         <div className="h-6 w-20 rounded text-center text-[8px] flex items-center justify-center text-white" style={{ backgroundColor: buttonColor }}>Action</div>
                      </div>
                   </div>
                </div>
             </div>
         </div>
      </div>

      {/* Domain & Login */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
         <SectionHeader 
           title="Domain Whitelabeling" 
           subtitle="Connect a custom domain for a fully branded experience" 
         />
         <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <TextInput label="Custom Domain URL" placeholder="lms.yourcollege.edu" icon={Globe} />
            </div>
            <button className="h-[50px] px-6 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-black transition-colors shrink-0">
               Verify Domain
            </button>
         </div>
         <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-3">
             <div className="bg-white p-1 rounded-full text-orange-500 h-fit shadow-sm"><Info size={14} /></div>
             <div className="text-xs text-orange-800 leading-relaxed">
               <p className="font-bold mb-1">DNS Configuration Required</p>
               To verify, please add a <strong>CNAME</strong> record pointing to <code className="bg-white px-1 py-0.5 rounded border border-orange-200">cname.classory.app</code> in your DNS provider settings.
             </div>
         </div>
      </div>

      {/* Login Customization */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
         <SectionHeader 
           title="Login Page Customization" 
           subtitle="Customize the first screen your users will see" 
         />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FileUpload label="Login Banner Image" sublabel="High Quality (1920x1080px)" />
            <div className="space-y-4">
               <TextInput label="Welcome Message" placeholder="Welcome to Digital Campus" />
               <TextInput label="Sub-text Description" placeholder="Sign in to continue your learning journey" />
               <Toggle checked={true} label="Show 'Powered by Classory' footer" />
            </div>
         </div>
      </div>

      <div className="flex justify-end pt-4 pb-8">
        <button className="bg-brand-teal hover:bg-brand-tealDark text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-brand-teal/20 transition-all flex items-center gap-2">
          <Save size={18} /> Save Appearance Settings
        </button>
      </div>

    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Menu */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm sticky top-32">
          <h3 className="text-sm font-semibold text-gray-900 px-4 py-3 mb-2">Basic Details</h3>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSubSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  activeSubSection === item.id 
                  ? 'bg-brand-orangeLight text-brand-orange' 
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon 
                  size={18} 
                  className={`transition-colors ${activeSubSection === item.id ? 'text-brand-orange' : 'text-gray-400 group-hover:text-gray-600'}`} 
                />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="lg:col-span-9">
        {activeSubSection === 'Tenant Details' && renderTenantDetails()}
        {activeSubSection === 'Admin' && renderAdminSetup()}
        {activeSubSection === 'Appearance' && renderAppearance()}
      </div>
    </div>
  );
};
