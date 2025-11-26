import React, { useState, useEffect } from 'react';
import { PlanSection, BillingInterval, AddOn, SubscriptionHistory } from '../types';
import { SelectGroup, BillingToggle, DateInput, Toggle, Badge, Modal, Slider, TextArea, TextInput } from './FormElements';
import { Check, Info, Server, Users, Video, Database, ArrowRight, ShieldAlert, CreditCard, Clock, FileText, ChevronRight, DollarSign, Calendar, Sparkles, GraduationCap, Store, Briefcase, Zap, Timer, AlertOctagon, PauseCircle, RefreshCw, Loader2, Send, Download, Printer, AlertTriangle, PlayCircle, Ban, ArrowLeft } from 'lucide-react';

interface PlanContentProps {
  activeSection: PlanSection;
  tenantStatus: 'Active' | 'Suspended' | 'Paused' | 'Terminated';
  setTenantStatus: (status: 'Active' | 'Suspended' | 'Paused' | 'Terminated') => void;
  onNavigateToSettings: () => void;
}

export const PlanContent: React.FC<PlanContentProps> = ({ activeSection, tenantStatus, setTenantStatus, onNavigateToSettings }) => {
  // Mock State
  const [hasPlan, setHasPlan] = useState(false); // Toggle this to see Create vs View mode
  
  // Status State
  const [isTrialMode, setIsTrialMode] = useState(false);
  const [trialDays, setTrialDays] = useState(14);
  
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(BillingInterval.YEARLY);
  const [planGroup, setPlanGroup] = useState('Campus Starter');
  const [productPackage, setProductPackage] = useState('LMS Core');
  
  // Reseller Logic
  const [isReseller, setIsReseller] = useState(false);


  // Modals State
  const [isRenewModalOpen, setRenewModalOpen] = useState(false);
  const [isRecordPaymentModalOpen, setRecordPaymentModalOpen] = useState(false);
  const [isEditConfigModalOpen, setEditConfigModalOpen] = useState(false);
  
  // Manage Access Modal State
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [accessAction, setAccessAction] = useState<'menu' | 'suspend' | 'pause' | 'resume' | 'activate' | 'terminate'>('menu');
  const [suspensionReason, setSuspensionReason] = useState('');
  const [terminationConfirmText, setTerminationConfirmText] = useState('');

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  
  // Upgrade Wizard State
  const [upgradeStep, setUpgradeStep] = useState(1);
  const [selectedUpgradeGroup, setSelectedUpgradeGroup] = useState<string>('');

  // Renewal Flow State
  const [renewStep, setRenewStep] = useState<'review' | 'preview' | 'processing' | 'success'>('review');
  const [selectedDuration, setSelectedDuration] = useState('1 Year');
  const [sendInvoiceEmail, setSendInvoiceEmail] = useState(true);
  
  // Resource Limits State (New Feature)
  const [studentLimit, setStudentLimit] = useState(500);
  const [teacherLimit, setTeacherLimit] = useState(20);
  const [adminLimit, setAdminLimit] = useState(2);

  // Effect to update limits when toggling reseller mode
  useEffect(() => {
    if (isReseller) {
        setStudentLimit(2000);
        setTeacherLimit(50);
        setAdminLimit(10);
    } else {
        setStudentLimit(500);
        setTeacherLimit(20);
        setAdminLimit(2);
    }
  }, [isReseller]);

  // Dynamic Limits based on Client Type
  const limits = {
      students: isReseller ? 2000 : 500,
      teachers: isReseller ? 50 : 20,
      admins: isReseller ? 10 : 2
  };

  // Pricing Logic
  const getPricingBreakdown = () => {
    const isMonthly = billingInterval === BillingInterval.MONTHLY;
    
    // Rates
    const rates = {
        base: {
            'Campus Starter': isMonthly ? 120 : 1200,
            'Institution Pro': isMonthly ? 240 : 2400,
            'Enterprise Elite': isMonthly ? 500 : 5000,
        },
        // Reseller has a higher base price but includes more resources
        resellerBase: isMonthly ? 350 : 3500, 
        student: isMonthly ? 5 : 50, // Per 100
        teacher: isMonthly ? 5 : 50, // Per 5
        admin: isMonthly ? 10 : 100, // Per 1
    };

    let basePrice = rates.base[planGroup as keyof typeof rates.base] || rates.base['Campus Starter'];
    
    // If reseller, override base price logic (Simplified for demo)
    if (isReseller) {
        basePrice = rates.resellerBase; 
    }

    // Extras Calculation
    const extraStudents = Math.max(0, studentLimit - limits.students);
    const extraTeachers = Math.max(0, teacherLimit - limits.teachers);
    const extraAdmins = Math.max(0, adminLimit - limits.admins);

    // Cost Calc
    const studentCost = Math.ceil(extraStudents / 100) * rates.student;
    const teacherCost = Math.ceil(extraTeachers / 5) * rates.teacher;
    const adminCost = extraAdmins * rates.admin;
    
    const subtotal = basePrice + studentCost + teacherCost + adminCost;

    return {
        basePrice,
        studentCost,
        teacherCost,
        adminCost,
        total: isTrialMode ? 0 : subtotal,
        futureRenewalPrice: subtotal,
        extraStudents,
        extraTeachers,
        extraAdmins,
        intervalLabel: isMonthly ? '/mo' : '/yr'
    };
  };

  const pricing = getPricingBreakdown();

  // Helper to calculate Preview Invoice Totals
  const getPreviewTotals = () => {
    // Simulated values based on duration
    const baseVal = selectedDuration === '1 Month' ? 120 : 
                    selectedDuration === '6 Months' ? 650 : 
                    selectedDuration === '1 Year' ? 1200 : 2200;
    
    const subtotal = baseVal;
    const tax = baseVal * 0.05; // 5% tax
    const total = subtotal + tax;

    return {
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    };
  };

  const handleCreatePlanSubmit = () => {
      setTenantStatus('Active');
      setHasPlan(true);
  };

  const handleActivateTrial = () => {
      // Logic to convert trial to paid
      setRenewModalOpen(true); // Re-use renew flow for activation
  };

  const handleReactivate = () => {
      setAccessAction('menu');
      setIsAccessModalOpen(true);
  }

  const handleAccessChange = () => {
      if (accessAction === 'suspend') setTenantStatus('Suspended');
      if (accessAction === 'pause') setTenantStatus('Paused');
      if (accessAction === 'resume' || accessAction === 'activate') setTenantStatus('Active');
      if (accessAction === 'terminate') setTenantStatus('Terminated');

      setIsAccessModalOpen(false);
      setAccessAction('menu'); // Reset for next time
      setSuspensionReason('');
      setTerminationConfirmText('');
  };

  const openAccessModal = () => {
      setAccessAction('menu');
      setIsAccessModalOpen(true);
  };

  // Data State
  const [history, setHistory] = useState<SubscriptionHistory[]>([
    { id: 'inv_001', plan: 'Campus Starter', date: 'Dec 12, 2024', amount: '$1,200.00', status: 'Paid', type: 'Renewal' },
    { id: 'inv_002', plan: 'Campus Starter', date: 'Dec 12, 2023', amount: '$1,200.00', status: 'Paid', type: 'Creation' },
  ]);

  const addOns: AddOn[] = [
    { id: '1', name: 'Extra Storage', price: '$10/mo', quantity: 0, unit: '500GB', description: 'Additional cloud storage for resources.' },
    { id: '2', name: 'Live Class Hours', price: '$25/mo', quantity: 1, unit: '100 Hrs', description: 'Extended streaming time per month.' },
    { id: '3', name: 'Admin Users', price: '$15/user', quantity: 2, unit: 'User', description: 'Full access administrative accounts.' },
  ];

  // Logic to handle simulated invoice generation
  const handleRenewalTrigger = () => {
    setRenewStep('processing');
    
    // Simulate API call
    setTimeout(() => {
        const { total } = getPreviewTotals();
        
        const newInvoice: SubscriptionHistory = {
            id: `inv_${Math.floor(Math.random() * 10000)}`,
            plan: planGroup,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            amount: `$${total}`,
            status: 'Pending',
            type: isTrialMode ? 'Creation' : 'Renewal'
        };

        setHistory([newInvoice, ...history]);
        setRenewStep('success');
        
        // If activated from trial, change status
        if(isTrialMode) {
            setIsTrialMode(false);
            setTenantStatus('Active');
        }

    }, 2000);
  };

  const resetRenewModal = () => {
    setRenewModalOpen(false);
    setTimeout(() => setRenewStep('review'), 300);
  };

  // Logic for Recording Payment
  const openRecordPayment = (id: string) => {
    setSelectedInvoiceId(id);
    setRecordPaymentModalOpen(true);
  };

  const confirmPayment = () => {
    if (selectedInvoiceId) {
        setHistory(prev => prev.map(item => 
            item.id === selectedInvoiceId ? { ...item, status: 'Paid' } : item
        ));
        setRecordPaymentModalOpen(false);
        setSelectedInvoiceId(null);
    }
  };

  // --- RENDER HELPERS ---

  const ClientTypeSelector = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button 
            onClick={() => setIsReseller(false)}
            className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                !isReseller 
                ? 'border-brand-teal bg-teal-50/50 dark:bg-teal-900/30 ring-1 ring-brand-teal' 
                : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
            }`}
        >
            <div className="flex items-start gap-4 z-10 relative">
                <div className={`p-3 rounded-xl ${!isReseller ? 'bg-brand-teal text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'}`}>
                    <GraduationCap size={24} />
                </div>
                <div>
                    <h4 className={`font-bold ${!isReseller ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Direct Institution</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Standard licensing model. Best for single schools or colleges managing their own LMS.</p>
                </div>
            </div>
            {!isReseller && <div className="absolute top-4 right-4 text-brand-teal"><Check size={20} /></div>}
        </button>

        <button 
            onClick={() => setIsReseller(true)}
            className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                isReseller 
                ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-900/30 ring-1 ring-purple-500' 
                : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
            }`}
        >
            <div className="flex items-start gap-4 z-10 relative">
                <div className={`p-3 rounded-xl ${isReseller ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'}`}>
                    <Briefcase size={24} />
                </div>
                <div>
                    <h4 className={`font-bold ${isReseller ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Reseller Partner</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Bulk licensing model. Best for academies or agencies managing multiple sub-units.</p>
                </div>
            </div>
            {isReseller && <div className="absolute top-4 right-4 text-purple-600"><Check size={20} /></div>}
        </button>
    </div>
  );

  const ResourceCounter = ({ 
    label, 
    count, 
    setCount, 
    base, 
    step, 
    priceInfo,
    icon: Icon 
  }: { 
    label: string, 
    count: number, 
    setCount: (n: number) => void, 
    base: number, 
    step: number, 
    priceInfo: string,
    icon: React.ElementType
  }) => {
    const isOverLimit = count > base;
    
    return (
      <div className={`bg-white dark:bg-gray-800 border rounded-xl p-4 transition-all ${isOverLimit ? 'border-brand-teal/50 shadow-sm' : 'border-gray-200 dark:border-gray-700'}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${isOverLimit ? 'bg-brand-orangeLight dark:bg-orange-900/30 text-brand-orange' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                <Icon size={18} />
             </div>
             <div>
               <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{label}</h4>
               <p className="text-[10px] text-gray-500 dark:text-gray-400">{priceInfo}</p>
             </div>
          </div>
          <div className="text-right">
             <span className="text-xl font-bold text-gray-900 dark:text-white block">{count}</span>
             <span className="text-[10px] text-gray-400 font-medium">{isReseller ? 'Bulk Cap' : 'Included'}: {base}</span>
          </div>
        </div>
        
        <Slider 
            min={base} 
            max={base * 5} 
            step={step} 
            value={count} 
            onChange={(e) => setCount(parseInt(e.target.value))} 
        />
        
        {isOverLimit && (
          <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-brand-orange bg-brand-orangeLight/50 dark:bg-orange-900/30 px-2 py-1 rounded w-fit">
            <Sparkles size={10} />
            <span>+{count - base} Extra</span>
          </div>
        )}
      </div>
    );
  };

  const getPlanCardStyles = () => {
      if (tenantStatus === 'Suspended') return 'bg-gradient-to-r from-gray-700 to-gray-800';
      if (tenantStatus === 'Paused') return 'bg-gradient-to-r from-amber-500 to-amber-600';
      if (tenantStatus === 'Terminated') return 'bg-gray-900';
      if (isTrialMode) return 'bg-gradient-to-r from-blue-600 to-indigo-600';
      if (isReseller) return 'bg-gradient-to-r from-purple-600 to-indigo-600';
      return 'bg-gradient-to-r from-brand-teal to-teal-600';
  }

  const renderCreatePlan = () => (
    <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Create Plan for Tenant</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Configure resources and billing to match tenant growth.</p>
        </div>
        <button 
          onClick={() => { setHasPlan(true); setTenantStatus('Active'); }} 
          className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full transition-colors"
        >
          Dev: Switch to 'View Mode'
        </button>
      </div>
      
      <div className="space-y-8">
        
        {/* Section A: Plan Info */}
        <div className="space-y-4">
           <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
            <Server size={16} className="text-brand-teal" /> Plan Configuration
           </h3>

           <ClientTypeSelector />

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
             <SelectGroup 
                label="Plan Group" 
                placeholder="Select Group" 
                options={['Campus Starter', 'Institution Pro', 'Enterprise Elite']} 
                value={planGroup}
                onChange={(e) => setPlanGroup(e.target.value)}
             />
             <SelectGroup 
                label="Included Products" 
                placeholder="Select Products" 
                options={['LMS Core', 'Live Classes', 'Analytics Pack']} 
                value={productPackage}
                onChange={(e) => setProductPackage(e.target.value)}
             />
           </div>
        </div>

        {/* Section: Trial Config */}
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                 <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                    <Zap size={16} className="text-amber-500" /> Trial Access
                 </h3>
                 <div className="flex items-center gap-2">
                     <span className={`text-xs font-medium ${isTrialMode ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Enable Free Trial Period</span>
                     <Toggle label="" checked={isTrialMode} onChange={() => setIsTrialMode(!isTrialMode)} />
                 </div>
             </div>

             {isTrialMode && (
                 <div className="p-6 bg-amber-50/50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800 animate-in fade-in slide-in-from-top-2 duration-300">
                     <div className="flex items-start gap-4">
                         <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-lg text-amber-600 dark:text-amber-300 shrink-0">
                             <Timer size={20} />
                         </div>
                         <div className="flex-1">
                             <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Select Trial Duration</h4>
                             <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">The client will have full access to the selected plan resources during this period without charge.</p>
                             <div className="flex gap-2">
                                 {[7, 14, 30].map(days => (
                                     <button
                                        key={days}
                                        onClick={() => setTrialDays(days)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                                            trialDays === days 
                                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm' 
                                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-amber-300'
                                        }`}
                                     >
                                         {days} Days
                                     </button>
                                 ))}
                                 <button className="px-4 py-2 rounded-lg text-xs font-bold border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300">
                                     Custom
                                 </button>
                             </div>
                         </div>
                     </div>
                 </div>
             )}
        </div>

        {/* Section: Subscription Period (Hidden if Trial) */}
        {!isTrialMode && (
            <div className="space-y-4 animate-in fade-in duration-300">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                    <Clock size={16} className="text-brand-orange" /> Subscription Period
                </h3>
                <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-4">
                    <BillingToggle selected={billingInterval} onChange={setBillingInterval} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DateInput label="Start Date" placeholder="Select start date" value="12-12-2024" />
                        <DateInput label="End Date" placeholder="Select end date" value="12-12-2025" />
                    </div>
                </div>
            </div>
        )}

        {/* Section: Resource Limits */}
        <div className="space-y-4">
           <div className="flex justify-between items-center">
             <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                <Users size={16} className="text-blue-500" /> Resource Limits
             </h3>
             {isReseller && (
                 <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase rounded-full border border-purple-200 shadow-sm flex items-center gap-1.5">
                     <Store size={12} /> Partner Bulk Pack
                 </span>
             )}
           </div>
           
           <div className={`p-6 rounded-2xl border grid grid-cols-1 md:grid-cols-3 gap-4 ${isReseller ? 'bg-purple-50/30 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800' : 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700'}`}>
              <ResourceCounter 
                label="Students" 
                count={studentLimit} 
                setCount={setStudentLimit} 
                base={limits.students} 
                step={50}
                priceInfo={isReseller ? `Included in License` : `Includes ${limits.students}.`}
                icon={Users}
              />
              <ResourceCounter 
                label="Teachers" 
                count={teacherLimit} 
                setCount={setTeacherLimit} 
                base={limits.teachers} 
                step={5}
                priceInfo={isReseller ? `Included in License` : `Includes ${limits.teachers}.`}
                icon={GraduationCap}
              />
              <ResourceCounter 
                label="Admins" 
                count={adminLimit} 
                setCount={setAdminLimit} 
                base={limits.admins} 
                step={1}
                priceInfo={isReseller ? `Included in License` : `Includes ${limits.admins}.`}
                icon={ShieldAlert}
              />
           </div>
        </div>

        {/* Section C: Controls */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
           <Toggle label="Auto-update plan when new version available" checked={true} />
           <div className="flex items-center gap-4">
               <div className="text-right">
                   <p className="text-xs text-gray-500 dark:text-gray-400">Estimated Total</p>
                   {isTrialMode ? (
                        <div className="flex items-baseline gap-1 justify-end">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">$0.00</p>
                            <span className="text-xs font-normal text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 rounded-full border border-amber-100 dark:border-amber-800">Trial Period</span>
                        </div>
                   ) : (
                        <div className="flex items-baseline gap-1 justify-end">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">${pricing.total.toLocaleString()}</p>
                            <span className="text-xs font-normal text-gray-500 dark:text-gray-400">{pricing.intervalLabel}</span>
                        </div>
                   )}
                   {isReseller && <p className="text-[10px] text-purple-600 font-bold bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-full inline-block mt-1">Reseller Pricing</p>}
               </div>
               <button 
                onClick={handleCreatePlanSubmit}
                className={`${isTrialMode ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-brand-teal hover:bg-brand-tealDark shadow-brand-teal/20'} text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all hover:scale-[1.02]`}
               >
                 {isTrialMode ? 'Start Free Trial' : 'Assign Plan to Tenant'}
               </button>
           </div>
        </div>
      </div>
    </div>
  );

  const renderInvoicePreview = () => {
    const totals = getPreviewTotals();
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    return (
        <div className="animate-in fade-in zoom-in-95 duration-300">
            {/* Invoice Container */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-2xl mx-auto my-4 text-gray-900">
                {/* Note: Invoice Preview usually stays light mode for printing fidelity */}
                
                {/* Header Brand */}
                <div className="bg-[#FFF5EB] p-8 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-8 h-8 text-gray-900" />
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-gray-900">Classory</h1>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">One Classroom, Millions of Stories</p>
                        </div>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                        Built for your users. Branded for your name.
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Addresses */}
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-400 font-bold uppercase mb-2">Bill From:</p>
                            <div className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                                <Server size={14} className="text-brand-teal" /> Classory Inc.
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                                <p>(684) 879 - 0102</p>
                                <p>Pablo Alto, San Francisco, CA 94109</p>
                                <p>United States of America</p>
                                <p>12345 6789 US0001</p>
                            </div>
                        </div>

                        <div className="flex-1 flex gap-4">
                            <div className="flex-1 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-xs text-green-600 font-bold uppercase mb-2">Invoice To:</p>
                                <div className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                                    <div className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-[10px]">L</div>
                                    Lady Doak College
                                </div>
                                <div className="text-xs text-gray-500 space-y-1">
                                    <p>Pablo Alto, San Francisco</p>
                                    <p>CA 92102, United States</p>
                                </div>
                            </div>
                            
                            <div className="flex-1 space-y-2">
                                <div className="p-3 border border-gray-100 rounded-xl text-center">
                                    <p className="text-xs text-red-500 font-bold">Amount Due:</p>
                                    <p className="text-lg font-bold text-gray-900">${totals.total}</p>
                                    <p className="text-[10px] text-green-600 font-bold bg-green-50 rounded px-1 inline-block mt-1">USD</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded-lg text-center">
                                    <p className="text-[10px] text-gray-400">Invoice No: <span className="text-gray-900 font-mono">000027</span></p>
                                    <p className="text-[10px] text-gray-400">Date: <span className="text-gray-900">{today}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-orange-500 font-bold">
                                <tr>
                                    <th className="p-4">Description</th>
                                    <th className="p-4 text-center">Quantity</th>
                                    <th className="p-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="p-4">
                                        <p className="font-bold text-gray-900">{planGroup} Subscription</p>
                                        <p className="text-xs text-brand-teal">{selectedDuration} Duration</p>
                                    </td>
                                    <td className="p-4 text-center text-gray-500">1</td>
                                    <td className="p-4 text-right font-medium text-red-500">${totals.subtotal}</td>
                                </tr>
                                <tr>
                                    <td className="p-4">
                                        <p className="font-bold text-gray-900">Resource Allocation</p>
                                        <p className="text-xs text-gray-500">{studentLimit} Students, {teacherLimit} Teachers</p>
                                    </td>
                                    <td className="p-4 text-center text-gray-500">-</td>
                                    <td className="p-4 text-right font-medium text-red-500">Included</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                             <div className="flex justify-end gap-8 text-sm">
                                 <div className="text-right space-y-2">
                                     <p className="text-gray-500">Subtotal:</p>
                                     <p className="text-gray-500">Tax (5%):</p>
                                     <p className="text-lg font-bold text-brand-teal">Grand Total:</p>
                                 </div>
                                 <div className="text-right space-y-2">
                                     <p className="font-medium text-gray-900">${totals.subtotal}</p>
                                     <p className="font-medium text-gray-900">${totals.tax}</p>
                                     <p className="text-lg font-bold text-red-500">${totals.total}</p>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Footer Terms */}
                    <div className="text-[10px] text-gray-400 leading-relaxed border-t border-gray-100 pt-4">
                        <p className="font-bold text-gray-600 mb-1">Terms & Conditions:</p>
                        Fees and payment terms will be established in the contract or agreement prior to the commencement of the project. An initial deposit will be required before any design work begins. We reserve the right to suspend or halt work in the event of non-payment.
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderCurrentPlan = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-end">
         <button 
            onClick={() => setHasPlan(false)} 
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-3 py-1"
          >
            Dev: Switch to 'Create Mode'
          </button>
       </div>

       {/* Plan Summary Card */}
       <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-0 border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className={`p-8 text-white relative overflow-hidden transition-all duration-500 ${getPlanCardStyles()}`}>
             {/* Decorative pattern */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="relative z-10 flex justify-between items-start">
               <div>
                 <div className="flex items-center gap-3 mb-3">
                   {isTrialMode && (
                       <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/20">
                           {trialDays}-Day Trial
                       </span>
                   )}
                   {!isTrialMode && tenantStatus === 'Active' && (
                       <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/20">Yearly Plan</span>
                   )}
                   
                   <Badge status={isTrialMode ? 'Trial' : tenantStatus} />
                   
                   {isReseller && (
                       <span className="bg-white text-purple-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                           <Briefcase size={12} /> Reseller Partner
                       </span>
                   )}
                 </div>
                 <h1 className="text-3xl font-bold mb-3">{planGroup}</h1>
                 
                 {/* Dynamic Description based on Status */}
                 {tenantStatus === 'Suspended' ? (
                     <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-3 max-w-lg mb-6 flex gap-3 items-start">
                         <AlertOctagon size={20} className="shrink-0 text-red-200 mt-0.5" />
                         <div>
                             <p className="font-bold text-red-100 text-sm">Service Suspended</p>
                             <p className="text-red-200/80 text-xs">Access blocked due to suspicious activity (Ref: ID-9982). Tenant users cannot login.</p>
                         </div>
                     </div>
                 ) : tenantStatus === 'Paused' ? (
                     <div className="bg-amber-900/30 border border-amber-500/30 rounded-xl p-3 max-w-lg mb-6 flex gap-3 items-start">
                         <PauseCircle size={20} className="shrink-0 text-amber-200 mt-0.5" />
                         <div>
                             <p className="font-bold text-amber-100 text-sm">Subscription Paused</p>
                             <p className="text-amber-200/80 text-xs">Billing and services are temporarily frozen. Data is retained.</p>
                         </div>
                     </div>
                 ) : (
                    <p className="text-white/90 text-sm max-w-lg leading-relaxed mb-6">
                        {isTrialMode
                            ? 'You are currently on a free trial with full access to standard features.'
                            : isReseller 
                                ? 'Reseller Partner Package with bulk licensing.'
                                : 'Designed for growing institutions. Includes core LMS features.'
                        }
                    </p>
                 )}

                 {/* Configured Limits Display - Dimmed if not active */}
                 <div className={`flex flex-wrap gap-4 ${tenantStatus !== 'Active' && !isTrialMode ? 'opacity-50 grayscale' : ''}`}>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-lg text-sm">
                        <Users size={16} className="text-white/80" />
                        <span className="font-semibold text-white">{studentLimit}</span>
                        <span className="text-white/80 text-xs">Students</span>
                    </div>
                     <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-lg text-sm">
                        <GraduationCap size={16} className="text-white/80" />
                        <span className="font-semibold text-white">{teacherLimit}</span>
                        <span className="text-white/80 text-xs">Teachers</span>
                    </div>
                     <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-lg text-sm">
                        <ShieldAlert size={16} className="text-white/80" />
                        <span className="font-semibold text-white">{adminLimit}</span>
                        <span className="text-white/80 text-xs">Admins</span>
                    </div>
                 </div>
               </div>
               
               <div className="text-right bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/10 shadow-lg min-w-[180px]">
                 {isTrialMode ? (
                     <>
                        <p className="text-white/70 text-xs font-medium mb-1">Trial Expires On</p>
                        <p className="text-2xl font-bold mb-3">Dec 26, 2024</p>
                        
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-white/80 font-medium">
                                <span>Day 1</span>
                                <span>{trialDays} Days Left</span>
                            </div>
                            <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-[10%] rounded-full"></div>
                            </div>
                        </div>
                     </>
                 ) : (
                     <>
                        <p className="text-white/70 text-xs font-medium mb-1">
                            {tenantStatus === 'Paused' ? 'Paused On' : 'Next Renewal'}
                        </p>
                        <p className="text-2xl font-bold">
                            {tenantStatus === 'Paused' ? 'Dec 12, 2024' : 'Dec 12, 2025'}
                        </p>
                        {tenantStatus === 'Active' && (
                            <p className="text-xs text-white/60 mt-2 flex items-center justify-end gap-1">
                                <Check size={12} /> Auto-renew enabled
                            </p>
                        )}
                     </>
                 )}
               </div>
             </div>
          </div>

          <div className="p-8">
            <div className="flex flex-wrap items-center gap-3">
              {/* Primary Actions based on Status */}
              {tenantStatus === 'Suspended' || tenantStatus === 'Paused' ? (
                   <button 
                    onClick={handleReactivate}
                    className="px-6 py-3 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md flex items-center gap-2"
                   >
                     <RefreshCw size={16} /> {tenantStatus === 'Paused' ? 'Resume Subscription' : 'Unsuspend Account'}
                   </button>
              ) : isTrialMode ? (
                  <button 
                    onClick={handleActivateTrial}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-200 hover:shadow-lg flex items-center gap-2 animate-pulse"
                  >
                    <Zap size={16} fill="currentColor" /> Activate Subscription
                  </button>
              ) : (
                  <button 
                    onClick={() => setRenewModalOpen(true)}
                    className="px-6 py-3 bg-brand-teal hover:bg-brand-tealDark text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-brand-teal/20 hover:shadow-lg flex items-center gap-2"
                  >
                    Renew Plan <ArrowRight size={16} />
                  </button>
              )}
              
              <button 
                onClick={() => setEditConfigModalOpen(true)}
                disabled={tenantStatus !== 'Active' && !isTrialMode}
                className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Edit Configuration
              </button>

              <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl transition-colors flex items-center gap-2">
                <FileText size={16} /> Invoices
              </button>

              {/* Lifecycle Actions (Suspicious activity, etc) */}
              <button 
                onClick={openAccessModal}
                className="ml-auto px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium rounded-xl transition-all flex items-center gap-2"
                title="Manage Access & Status"
              >
                <ShieldAlert size={18} /> Manage Access
              </button>
            </div>
          </div>
       </div>

       {/* --- MODALS FOR CURRENT PLAN ACTIONS --- */}
       
       {/* Renew Modal */}
       <Modal
         isOpen={isRenewModalOpen}
         onClose={resetRenewModal}
         title="Renew Subscription"
         footer={
           renewStep === 'review' ? (
             <div className="flex gap-2 w-full">
               <button onClick={resetRenewModal} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
               <button onClick={() => setRenewStep('preview')} className="flex-1 py-2.5 bg-brand-teal text-white rounded-xl text-sm font-medium hover:bg-brand-tealDark shadow-lg shadow-brand-teal/20 flex items-center justify-center gap-2">Preview Invoice <ArrowRight size={16}/></button>
             </div>
           ) : renewStep === 'preview' ? (
             <div className="flex gap-2 w-full">
               <button onClick={() => setRenewStep('review')} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">Back</button>
               <button onClick={handleRenewalTrigger} className="flex-1 py-2.5 bg-brand-teal text-white rounded-xl text-sm font-medium hover:bg-brand-tealDark shadow-lg shadow-brand-teal/20 flex items-center justify-center gap-2"><Send size={16}/> Send Invoice</button>
             </div>
           ) : renewStep === 'success' ? (
             <div className="w-full">
               <button onClick={resetRenewModal} className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium hover:bg-black dark:hover:bg-gray-200">Done</button>
             </div>
           ) : null
         }
       >
         <div className="min-h-[300px] flex flex-col">
            {renewStep === 'review' && (
                <div className="space-y-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Select Renewal Duration</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {['1 Month', '6 Months', '1 Year', '2 Years'].map(d => (
                                <button
                                    key={d}
                                    onClick={() => setSelectedDuration(d)}
                                    className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                                        selectedDuration === d 
                                        ? 'bg-white dark:bg-gray-800 border-brand-teal text-brand-teal shadow-md ring-1 ring-brand-teal/20' 
                                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                         <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Order Summary</h4>
                         <div className="space-y-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4">
                             <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                                 <span>{planGroup} ({selectedDuration})</span>
                                 <span>{selectedDuration === '1 Month' ? '$120.00' : '$1,200.00'}</span>
                             </div>
                             <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                                 <span>Platform Tax (5%)</span>
                                 <span>$60.00</span>
                             </div>
                             <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between font-bold text-gray-900 dark:text-white text-lg">
                                 <span>Total Amount</span>
                                 <span>{selectedDuration === '1 Month' ? '$126.00' : '$1,260.00'}</span>
                             </div>
                         </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                           <div className="bg-white dark:bg-gray-800 p-1.5 rounded-lg text-blue-500 shadow-sm"><Send size={16}/></div>
                           <div className="text-xs">
                               <p className="font-bold text-blue-900 dark:text-blue-100">Email Payment Reminder</p>
                               <p className="text-blue-700/80 dark:text-blue-300/80">Notify client admin immediately</p>
                           </div>
                        </div>
                        <Toggle label="" checked={sendInvoiceEmail} onChange={() => setSendInvoiceEmail(!sendInvoiceEmail)} />
                    </div>
                </div>
            )}

            {renewStep === 'preview' && renderInvoicePreview()}

            {renewStep === 'processing' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                    <Loader2 size={48} className="text-brand-teal animate-spin mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Generating Invoice...</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Creating PDF and sending email notification.</p>
                </div>
            )}

            {renewStep === 'success' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
                        <Check size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invoice Sent Successfully!</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto mb-6">
                        Invoice <strong>#INV-2024-092</strong> has been generated and sent to <strong>admin@ladydoak.edu</strong>.
                    </p>
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-4 py-3 rounded-xl text-sm font-medium border border-yellow-100 dark:border-yellow-800 inline-flex items-center gap-2">
                        <Info size={16} /> Status: Awaiting Payment
                    </div>
                </div>
            )}
         </div>
       </Modal>

       {/* Manage Access Modal */}
       <Modal
         isOpen={isAccessModalOpen}
         onClose={() => setIsAccessModalOpen(false)}
         title="Manage Tenant Access"
         footer={
             accessAction !== 'menu' && (
                 <div className="flex gap-2 w-full">
                     <button onClick={() => setAccessAction('menu')} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2">
                        <ArrowLeft size={16} /> Back
                     </button>
                     <button 
                        onClick={handleAccessChange} 
                        disabled={accessAction === 'terminate' && terminationConfirmText !== 'DELETE'}
                        className={`flex-1 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            accessAction === 'terminate' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' :
                            accessAction === 'suspend' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' :
                            accessAction === 'resume' || accessAction === 'activate' ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20' :
                            'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                        }`}
                     >
                        {accessAction === 'terminate' ? 'Permanently Terminate' : 
                         accessAction === 'suspend' ? 'Confirm Suspension' : 
                         accessAction === 'resume' ? 'Confirm Resume' :
                         accessAction === 'activate' ? 'Confirm Reactivation' :
                         'Confirm Pause'}
                     </button>
                 </div>
             )
         }
       >
         <div className="min-h-[250px] flex flex-col justify-center">
            {/* MENU STATE */}
            {accessAction === 'menu' && (
               <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4 px-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Select an action to change the tenant's status.</p>
                      <Badge status={tenantStatus} />
                  </div>

                  {/* ACTIVE STATE ACTIONS */}
                  {tenantStatus === 'Active' && (
                     <>
                        <button onClick={() => setAccessAction('pause')} className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all text-left group">
                             <div className="p-2 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg group-hover:bg-amber-200 dark:group-hover:bg-amber-800 transition-colors"><PauseCircle size={20} /></div>
                             <div>
                                 <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-300">Pause Subscription</h4>
                                 <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-amber-700 dark:group-hover:text-amber-400">Freeze billing and access. Data retained.</p>
                             </div>
                        </button>
                        <button onClick={() => setAccessAction('suspend')} className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all text-left group">
                             <div className="p-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-800 transition-colors"><ShieldAlert size={20} /></div>
                             <div>
                                 <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-red-800 dark:group-hover:text-red-300">Suspend Tenant</h4>
                                 <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-red-700 dark:group-hover:text-red-400">Block all access immediately due to risk.</p>
                             </div>
                        </button>
                     </>
                  )}

                  {/* PAUSED STATE ACTIONS */}
                  {tenantStatus === 'Paused' && (
                        <button onClick={() => setAccessAction('resume')} className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all text-left group">
                             <div className="p-2 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors"><PlayCircle size={20} /></div>
                             <div>
                                 <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-green-800 dark:group-hover:text-green-300">Resume Subscription</h4>
                                 <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-green-700 dark:group-hover:text-green-400">Restore full access and billing.</p>
                             </div>
                        </button>
                  )}

                  {/* SUSPENDED STATE ACTIONS */}
                  {tenantStatus === 'Suspended' && (
                        <button onClick={() => setAccessAction('activate')} className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all text-left group">
                             <div className="p-2 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors"><RefreshCw size={20} /></div>
                             <div>
                                 <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-green-800 dark:group-hover:text-green-300">Unsuspend / Reactivate</h4>
                                 <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-green-700 dark:group-hover:text-green-400">Restore access to all users.</p>
                             </div>
                        </button>
                  )}
                  
                  {/* TERMINATE (ALWAYS AVAILABLE unless terminated) */}
                  {tenantStatus !== 'Terminated' && (
                     <button onClick={() => setAccessAction('terminate')} className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-left group">
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors"><Ban size={20} /></div>
                          <div>
                              <h4 className="font-bold text-gray-900 dark:text-white">Terminate Tenant</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Permanently delete and offboard.</p>
                          </div>
                     </button>
                  )}
                  
                  {tenantStatus === 'Terminated' && (
                      <div className="text-center py-6 text-gray-500 dark:text-gray-400 italic">This tenant is terminated. No further actions available.</div>
                  )}
               </div>
            )}

            {/* CONFIRMATION FORMS */}
            {accessAction === 'suspend' && (
                 <div className="space-y-4">
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-xl text-sm flex gap-3 border border-red-100 dark:border-red-800">
                      <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                      <div>
                          <p className="font-bold mb-1">Warning: Blocks Access</p>
                          <p>All users (Students, Teachers, Admins) will be logged out and blocked from logging in. Data is preserved.</p>
                      </div>
                    </div>
                    <TextArea label="Reason for Suspension" placeholder="e.g. Non-payment of invoice or Suspicious Activity" />
                 </div>
            )}

            {accessAction === 'pause' && (
                 <div className="space-y-4">
                    <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 p-4 rounded-xl text-sm flex gap-3 border border-amber-100 dark:border-amber-800">
                      <PauseCircle size={20} className="shrink-0 mt-0.5" />
                      <div>
                          <p className="font-bold mb-1">Billing Halted</p>
                          <p>Users will lose access to premium features. Read-only access can be configured in the Fallback plan.</p>
                      </div>
                    </div>
                    <DateInput label="Pause Until (Optional)" placeholder="Select Date" />
                 </div>
            )}

            {(accessAction === 'resume' || accessAction === 'activate') && (
                  <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-6 rounded-xl text-sm flex flex-col items-center text-center gap-3 border border-green-100 dark:border-green-800">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-2">
                        <Check size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-lg mb-1">Ready to Restore?</p>
                        <p>Tenant access and billing cycles will resume immediately.</p>
                    </div>
                  </div>
            )}

            {accessAction === 'terminate' && (
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-xl text-sm border border-red-100 dark:border-red-800">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <ShieldAlert size={16} /> WARNING: IRREVERSIBLE ACTION
                    </div>
                    <p>This will permanently delete the tenant <strong>Lady Doak College</strong> and all associated data (Users, content, histories). This cannot be undone.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Type "DELETE" to confirm</label>
                    <input
                      type="text"
                      value={terminationConfirmText}
                      onChange={(e) => setTerminationConfirmText(e.target.value)}
                      placeholder="DELETE"
                      className="w-full bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
            )}
         </div>
       </Modal>

       {/* Edit Config Modal */}
       <Modal
         isOpen={isEditConfigModalOpen}
         onClose={() => setEditConfigModalOpen(false)}
         title="Edit Plan Configuration"
         footer={
             <div className="flex gap-2 w-full">
                 <button onClick={() => setEditConfigModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                 <button 
                    onClick={() => setEditConfigModalOpen(false)} 
                    className="flex-1 py-2.5 bg-brand-teal text-white rounded-xl text-sm font-medium hover:bg-brand-tealDark shadow-lg shadow-brand-teal/20"
                 >
                    Apply Changes
                 </button>
             </div>
         }
       >
         <div className="space-y-6">
             <ClientTypeSelector />

             <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
                 <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     <Server size={16} /> Plan Details
                 </h4>
                 <div className="grid grid-cols-2 gap-4">
                     <SelectGroup 
                        label="Plan Group" 
                        placeholder="Select Group" 
                        options={['Campus Starter', 'Institution Pro', 'Enterprise Elite']} 
                        value={planGroup}
                        onChange={(e) => setPlanGroup(e.target.value)}
                     />
                     <SelectGroup 
                        label="Product Package" 
                        placeholder="Select Products" 
                        options={['LMS Core', 'Live Classes', 'Analytics Pack']} 
                        value={productPackage}
                        onChange={(e) => setProductPackage(e.target.value)}
                     />
                 </div>
                 <BillingToggle selected={billingInterval} onChange={setBillingInterval} />
             </div>

             <div className="space-y-4">
                 <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     <Users size={16} /> Resource Allocation
                 </h4>
                 <ResourceCounter 
                    label="Students" count={studentLimit} setCount={setStudentLimit} base={limits.students} step={50} priceInfo="Scale student licenses" icon={Users}
                 />
                 <ResourceCounter 
                    label="Teachers" count={teacherLimit} setCount={setTeacherLimit} base={limits.teachers} step={5} priceInfo="Scale faculty access" icon={GraduationCap}
                 />
                 <ResourceCounter 
                    label="Admins" count={adminLimit} setCount={setAdminLimit} base={limits.admins} step={1} priceInfo="Administrative users" icon={ShieldAlert}
                 />
             </div>

             {/* Pricing Summary Widget */}
             <div className="sticky bottom-0 bg-white dark:bg-brand-darkCard border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-4 flex justify-between items-center">
                 <div>
                     <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">New Monthly Total</p>
                     <p className="text-xl font-bold text-brand-teal">${pricing.total.toLocaleString()}</p>
                 </div>
                 <div className="text-right text-xs text-gray-400 dark:text-gray-500">
                     <p>Base: ${pricing.basePrice}</p>
                     <p>Extras: +${pricing.studentCost + pricing.teacherCost + pricing.adminCost}</p>
                 </div>
             </div>
         </div>
       </Modal>
    </div>
  );

  const renderFallbackPlan = () => (
    <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm animate-in fade-in duration-500">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">FallBack Configuration</h2>
          <span className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">Required</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Configure what happens if the main subscription expires or payment fails.</p>
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-2xl p-4 mb-8 flex gap-3">
         <ShieldAlert className="text-orange-500 shrink-0 mt-0.5" size={20} />
         <div>
           <h4 className="text-sm font-bold text-orange-800 dark:text-orange-300 mb-1">Fail-safe Protection</h4>
           <p className="text-xs text-orange-700/80 dark:text-orange-400/80 leading-relaxed">
             This plan automatically activates immediately when the primary plan becomes inactive. Ensure this plan provides at least read-only access to critical data so the tenant is not completely locked out.
           </p>
         </div>
      </div>

      <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectGroup label="Fallback Group" placeholder="Select Group" options={['Free Tier (Read Only)', 'Basic Maintenance', 'Grace Period Extension']} />
            <SelectGroup label="Active Features" placeholder="Select Features" options={['Login Access', 'Data Export', 'Admin Dashboard']} />
          </div>

          <div className="w-full md:w-3/4 lg:w-2/3">
             <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Billing Logic</label>
                <div className="flex gap-2">
                   <button className="py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium border border-gray-200 dark:border-gray-700">Free of Charge</button>
                   <button className="py-2 px-4 rounded-lg bg-white dark:bg-brand-darkCard hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-medium border border-gray-200 dark:border-gray-700">Daily Rate</button>
                </div>
             </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
             <button className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 px-6 py-2.5 rounded-xl font-medium text-sm transition-colors">
               Save Fallback Configuration
             </button>
          </div>
      </div>
    </div>
  );

  const renderUpgradeWizard = () => (
    <div className="bg-white dark:bg-brand-darkCard rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-500">
       {/* Stepper Header */}
       <div className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
             {[1, 2, 3, 4].map((step) => (
               <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    upgradeStep >= step ? 'bg-brand-teal text-white shadow-md' : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                  }`}>
                    {step}
                  </div>
                  {step !== 4 && <div className={`w-12 h-0.5 mx-2 ${upgradeStep > step ? 'bg-brand-teal' : 'bg-gray-200 dark:bg-gray-700'}`}></div>}
               </div>
             ))}
          </div>
          <div className="text-center mt-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {upgradeStep === 1 && 'Choose Plan Group'}
              {upgradeStep === 2 && 'Customize Resources'}
              {upgradeStep === 3 && 'Billing Summary'}
              {upgradeStep === 4 && 'Confirmation'}
            </h2>
          </div>
       </div>

       {/* Step Content */}
       <div className="p-8 min-h-[400px]">
          {upgradeStep === 1 && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Starter', 'Pro', 'Enterprise'].map((plan) => (
                  <button 
                    key={plan}
                    onClick={() => setSelectedUpgradeGroup(plan)}
                    className={`relative p-6 rounded-2xl border-2 text-left transition-all hover:shadow-lg group ${
                      selectedUpgradeGroup === plan 
                      ? 'border-brand-teal bg-teal-50/30 dark:bg-teal-900/30 ring-1 ring-brand-teal' 
                      : 'border-gray-100 dark:border-gray-700 hover:border-brand-teal/50'
                    }`}
                  >
                     {selectedUpgradeGroup === plan && <div className="absolute top-4 right-4 text-brand-teal"><Check size={20} /></div>}
                     <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 mb-4 group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:shadow-sm transition-all flex items-center justify-center">
                        <Server size={24} className="text-gray-600 dark:text-gray-400" />
                     </div>
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{plan}</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Perfect for scaling up operations.</p>
                     <ul className="space-y-2 mb-6">
                       <li className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2"><Check size={12} className="text-brand-teal"/> All previous features</li>
                       <li className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2"><Check size={12} className="text-brand-teal"/> Higher limits</li>
                     </ul>
                  </button>
                ))}
             </div>
          )}

          {upgradeStep === 2 && (
             <div className="space-y-6 max-w-2xl mx-auto">
               <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">Pro Plan Selected</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Base configuration includes 500 users and 1TB storage.</p>
               </div>
               
               <div className="space-y-4">
                 {addOns.map(addon => (
                   <div key={addon.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 shadow-sm">
                          <PlusCircleIcon id={addon.id} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{addon.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{addon.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="text-sm font-medium text-gray-900 dark:text-white">{addon.price}</span>
                         <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-1">
                            <button className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300">-</button>
                            <span className="text-xs font-semibold w-4 text-center text-gray-900 dark:text-white">{addon.quantity}</span>
                            <button className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300">+</button>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {upgradeStep === 3 && (
            <div className="max-w-xl mx-auto space-y-6">
               <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl space-y-4 border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-300">New Plan (Pro)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">$2,400.00 / yr</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Add-ons Total</span>
                    <span className="font-semibold text-gray-900 dark:text-white">$300.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 p-2 rounded-lg border border-green-100 dark:border-green-800">
                    <span>Unused Time Credit (Current Plan)</span>
                    <span className="font-semibold">-$800.00</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900 dark:text-white">Prorated Total Due</span>
                    <span className="text-xl font-bold text-brand-teal">$1,900.00</span>
                  </div>
               </div>
               <p className="text-center text-xs text-gray-400">By confirming, the new plan limits will be applied immediately.</p>
            </div>
          )}

          {upgradeStep === 4 && (
             <div className="text-center max-w-md mx-auto py-8">
               <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Check size={40} />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upgrade Successful!</h3>
               <p className="text-gray-500 dark:text-gray-400 mb-8">The tenant has been upgraded to the <strong>Pro Plan</strong>. All new resources are now available.</p>
               <button onClick={() => setUpgradeStep(1)} className="text-brand-teal font-semibold text-sm hover:underline">Return to Dashboard</button>
             </div>
          )}
       </div>

       {/* Stepper Footer */}
       {upgradeStep < 4 && (
         <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30 flex justify-between">
            <button 
              disabled={upgradeStep === 1}
              onClick={() => setUpgradeStep(s => s - 1)}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Back
            </button>
            <button 
              onClick={() => setUpgradeStep(s => s + 1)}
              className="px-8 py-2.5 rounded-xl text-sm font-medium bg-brand-teal text-white shadow-lg shadow-brand-teal/20 hover:bg-brand-tealDark transition-all flex items-center gap-2"
            >
              {upgradeStep === 3 ? 'Confirm & Apply' : 'Next Step'} <ArrowRight size={16} />
            </button>
         </div>
       )}
    </div>
  );

  const renderAddOns = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="bg-white dark:bg-brand-darkCard p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Manage Add-ons</h2>
            <button className="text-sm text-brand-teal font-medium hover:underline">Browse Catalog</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {addOns.map(addon => (
               <div key={addon.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-brand-teal/50 hover:shadow-md transition-all group bg-white dark:bg-gray-800/50">
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:bg-brand-orangeLight dark:group-hover:bg-orange-900/30 group-hover:text-brand-orange transition-colors">
                        <PlusCircleIcon id={addon.id} />
                     </div>
                     <Badge status="Active" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{addon.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 h-8">{addon.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                     <span className="font-semibold text-gray-900 dark:text-white text-sm">{addon.price}</span>
                     <div className="flex items-center gap-2">
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">-</button>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{addon.quantity}</span>
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors">+</button>
                     </div>
                  </div>
               </div>
             ))}
             
             {/* Add New Card */}
             <button className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-brand-teal hover:text-brand-teal hover:bg-teal-50/10 transition-all cursor-pointer h-full min-h-[180px]">
                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-1">
                   <ChevronRight size={24} />
                </div>
                <span className="font-medium text-sm">Add New Resource</span>
             </button>
          </div>
       </div>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Current Subscription Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
               <CreditCard size={80} className="text-gray-900 dark:text-white" />
            </div>
            <div className="flex flex-col h-full justify-between">
              <div>
                <Badge status={isTrialMode ? 'Trial' : tenantStatus} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-3">{planGroup}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Yearly Billing • Auto-renew ON</p>
              </div>
              <div className="mt-8">
                 <div className="flex justify-between items-end mb-2">
                   <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">
                       {isTrialMode ? 'Trial Expires' : 'Expires'}
                   </span>
                   <span className="text-2xl font-bold text-gray-900 dark:text-white">
                       {isTrialMode ? 'Dec 26, 2024' : 'Dec 12, 2025'}
                   </span>
                 </div>
                 <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full w-[25%] ${isTrialMode ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                 </div>
                 <p className="text-xs text-right text-gray-400 mt-1">
                     {isTrialMode ? `${trialDays} days remaining` : '285 days remaining'}
                 </p>
              </div>
            </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 border-dashed flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Next Invoice Estimate</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">${pricing.total.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Due on Dec 12, 2025</p>
            <button className="mt-4 text-xs font-semibold text-brand-teal hover:underline">View Projection</button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-brand-darkCard rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <h3 className="font-bold text-gray-900 dark:text-white">Subscription History</h3>
            <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
              <FileText size={14}/> Download All
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
                  <tr>
                     <th className="px-6 py-4">Invoice ID</th>
                     <th className="px-6 py-4">Plan Name</th>
                     <th className="px-6 py-4">Date</th>
                     <th className="px-6 py-4">Type</th>
                     <th className="px-6 py-4">Amount</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                       <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">#{item.id}</td>
                       <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.plan}</td>
                       <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.date}</td>
                       <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded border ${
                            item.type === 'Renewal' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800' : 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-800'
                          }`}>{item.type}</span>
                       </td>
                       <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.amount}</td>
                       <td className="px-6 py-4"><Badge status={item.status} /></td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {item.status === 'Pending' && (
                                <button 
                                    onClick={() => openRecordPayment(item.id)}
                                    className="text-xs bg-brand-teal text-white px-3 py-1.5 rounded-lg font-medium hover:bg-brand-tealDark transition-colors shadow-sm"
                                >
                                    Record Payment
                                </button>
                            )}
                            {(item.status === 'Paid' || item.status === 'Failed') && (
                                <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-xs border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                                    Download
                                </button>
                            )}
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

       {/* Record Payment Modal */}
       <Modal
         isOpen={isRecordPaymentModalOpen}
         onClose={() => setRecordPaymentModalOpen(false)}
         title="Record Payment"
         footer={
             <div className="flex gap-2 w-full">
                 <button 
                    onClick={() => setRecordPaymentModalOpen(false)} 
                    className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                 >
                     Cancel
                 </button>
                 <button 
                    onClick={confirmPayment} 
                    className="flex-1 py-2.5 bg-brand-teal text-white rounded-xl text-sm font-medium hover:bg-brand-tealDark shadow-lg shadow-brand-teal/20"
                 >
                     Confirm & Mark Paid
                 </button>
             </div>
         }
       >
         <div className="space-y-4">
             <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-xl p-4 flex gap-3">
                 <Info className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" size={18} />
                 <p className="text-xs text-yellow-800 dark:text-yellow-300">
                     You are manually recording an external payment for Invoice <strong>#{selectedInvoiceId}</strong>. This will mark the subscription as active.
                 </p>
             </div>

             <div>
                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Payment Date</label>
                 <div className="relative">
                     <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                     <input type="date" className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none text-gray-900 dark:text-white" />
                 </div>
             </div>

             <div>
                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Payment Method</label>
                 <select className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none text-gray-900 dark:text-white">
                     <option>Bank Transfer / Wire</option>
                     <option>Check</option>
                     <option>Cash</option>
                     <option>External Credit Card Terminal</option>
                     <option>Other</option>
                 </select>
             </div>

             <div>
                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Reference / Transaction ID</label>
                 <div className="relative">
                     <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                     <input type="text" placeholder="e.g. TXN-12345678" className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none text-gray-900 dark:text-white" />
                 </div>
             </div>
             
             <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Amount Received</label>
                 <div className="relative">
                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                     <input type="text" placeholder="1200.00" className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none text-gray-900 dark:text-white" />
                 </div>
             </div>
         </div>
       </Modal>
    </div>
  );

  // Helper icon component
  const PlusCircleIcon = ({ id }: { id: string }) => {
    if (id === '1') return <Database size={18} />;
    if (id === '2') return <Video size={18} />;
    return <Users size={18} />;
  };
  
  // --- MAIN RENDER SWITCH ---
  switch (activeSection) {
    case PlanSection.ACTUAL_PLAN:
      return hasPlan ? renderCurrentPlan() : renderCreatePlan();
    case PlanSection.FALLBACK_PLAN:
      return renderFallbackPlan();
    case PlanSection.ADD_ONS:
      return renderAddOns();
    case PlanSection.SUBSCRIPTIONS:
      return renderSubscriptions();
    case PlanSection.BUY_OR_UPGRADE:
      return renderUpgradeWizard();
    default:
      return <div>Coming Soon</div>;
  }
};