import React, { useRef } from 'react';
import { ChevronDown, X, Upload, Check, Info } from 'lucide-react';
import { BillingInterval } from '../types';

interface SelectGroupProps {
  label: string;
  placeholder: string;
  options?: string[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectGroup = ({ label, placeholder, options = ['Option 1', 'Option 2'], value, onChange }: SelectGroupProps) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="relative">
      <select 
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm shadow-sm"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
    </div>
  </div>
);

export const DateInput = ({ label, placeholder, value }: { label: string; placeholder: string; value?: string }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="relative">
      <input 
        type="text" 
        placeholder={placeholder}
        defaultValue={value}
        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm shadow-sm"
      />
    </div>
  </div>
);

export const TextInput = ({ 
  label, 
  placeholder, 
  value, 
  onChange,
  icon: Icon, 
  type = "text" 
}: { 
  label: string; 
  placeholder: string; 
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ElementType; 
  type?: string;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />}
      <input 
        type={type} 
        placeholder={placeholder}
        {...(onChange ? { value, onChange } : { defaultValue: value })}
        className={`w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-200 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm shadow-sm ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
      />
    </div>
  </div>
);

export const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 pr-4 w-full shadow-sm">
      <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 relative">
         <input type="color" value={value} onChange={onChange} className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer" />
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-300 font-mono flex-1 uppercase">{value}</span>
    </div>
  </div>
);

export const TextArea = ({ label, placeholder, value, onChange }: { label: string; placeholder: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <textarea 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm shadow-sm min-h-[100px] resize-none"
    />
  </div>
);

export const BillingToggle = ({ selected, onChange }: { selected: BillingInterval, onChange: (val: BillingInterval) => void }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Billing Interval</label>
    <div className="flex gap-2 bg-gray-50/50 dark:bg-gray-800/50 p-1 rounded-full border border-gray-100 dark:border-gray-700 w-fit">
      {[BillingInterval.MONTHLY, BillingInterval.YEARLY, BillingInterval.CUSTOM].map((interval) => {
        const isActive = selected === interval;
        return (
          <button
            key={interval}
            onClick={() => onChange(interval)}
            className={`py-2 px-6 rounded-full text-xs font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-white dark:bg-gray-700 text-brand-teal dark:text-brand-teal shadow-md border border-gray-100 dark:border-gray-600'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            {interval}
          </button>
        );
      })}
    </div>
  </div>
);

export const Toggle = ({ label, checked, onChange }: { label: string; checked?: boolean; onChange?: () => void }) => (
  <label className="flex items-center gap-3 cursor-pointer group select-none">
    <div className={`relative w-11 h-6 transition-colors rounded-full ${checked ? 'bg-brand-teal' : 'bg-gray-200 dark:bg-gray-700'}`} onClick={onChange}>
      <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${checked ? 'translate-x-5' : ''}`}></div>
    </div>
    {label && <span className="text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>}
  </label>
);

export const Slider = ({ min, max, step, value, onChange }: { min: number, max: number, step: number, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="w-full">
        <input 
            type="range" 
            min={min} 
            max={max} 
            step={step} 
            value={value} 
            onChange={onChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-teal"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>{min}</span>
            <span>{max}+</span>
        </div>
    </div>
);

export const PillSelection = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (val: string) => void }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = value === option;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              isActive
                ? 'bg-brand-orangeLight dark:bg-orange-900/30 border-brand-orange text-brand-orange shadow-sm'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  </div>
);

export const FileUpload = ({ label, sublabel }: { label: string; sublabel?: string }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-brand-teal transition-all cursor-pointer group"
      >
        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 group-hover:text-brand-teal transition-colors text-gray-400">
          <Upload size={18} />
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">Click to upload</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sublabel || 'SVG, PNG, JPG (max. 800x400px)'}</span>
        <input type="file" ref={fileInputRef} className="hidden" />
      </div>
    </div>
  );
};

export const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-6">
    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
    <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
  </div>
);

export const Badge = ({ status }: { status: 'Active' | 'Expired' | 'Pending' | 'Failed' | 'Paid' | 'Trial' | 'Suspended' | 'Paused' | 'Terminated' }) => {
  const styles = {
    Active: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    Paid: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    Expired: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    Failed: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    Trial: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    Suspended: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    Paused: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    Terminated: 'bg-red-50 text-red-800 border-red-100 line-through dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
  };
  
  return (
    <span className={`px-2.5 py-0.5 border text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white dark:bg-brand-darkCard rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 shrink-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 shadow-sm">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30 flex justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};