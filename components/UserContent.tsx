
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  User, 
  GraduationCap, 
  BookOpen, 
  Shield, 
  Upload, 
  FileSpreadsheet, 
  Check, 
  X,
  Mail,
  MoreHorizontal
} from 'lucide-react';
import { 
  Badge, 
  Modal, 
  TextInput, 
  SelectGroup, 
  FileUpload, 
  SectionHeader 
} from './FormElements';

// Mock Data
interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Teacher' | 'Admin';
  idNumber: string; // Roll No or Emp ID
  status: 'Active' | 'Inactive' | 'Invited';
  joinedDate: string;
  avatarColor: string;
}

const MOCK_USERS: UserData[] = [
  { id: '1', name: 'Alice Freeman', email: 'alice.f@college.edu', role: 'Student', idNumber: 'STU-2024-001', status: 'Active', joinedDate: 'Dec 12, 2024', avatarColor: 'bg-blue-100 text-blue-600' },
  { id: '2', name: 'Robert Fox', email: 'robert.fox@college.edu', role: 'Teacher', idNumber: 'FAC-092', status: 'Active', joinedDate: 'Nov 20, 2024', avatarColor: 'bg-orange-100 text-orange-600' },
  { id: '3', name: 'Darlene Robertson', email: 'darlene@college.edu', role: 'Student', idNumber: 'STU-2024-042', status: 'Inactive', joinedDate: 'Dec 10, 2024', avatarColor: 'bg-green-100 text-green-600' },
  { id: '4', name: 'Jerome Bell', email: 'jerome.b@college.edu', role: 'Admin', idNumber: 'ADM-001', status: 'Active', joinedDate: 'Jan 15, 2023', avatarColor: 'bg-purple-100 text-purple-600' },
  { id: '5', name: 'Kathryn Murphy', email: 'kathryn.m@college.edu', role: 'Student', idNumber: 'STU-2024-089', status: 'Invited', joinedDate: '-', avatarColor: 'bg-pink-100 text-pink-600' },
  { id: '6', name: 'Jacob Jones', email: 'jacob.j@college.edu', role: 'Teacher', idNumber: 'FAC-103', status: 'Active', joinedDate: 'Oct 05, 2024', avatarColor: 'bg-teal-100 text-teal-600' },
];

export const UserContent: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal States
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Form State
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', role: 'Student', idNumber: '' });

  // Filtering Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.idNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    const u: UserData = {
        id: Date.now().toString(),
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        role: newUser.role as any,
        idNumber: newUser.idNumber,
        status: 'Invited',
        joinedDate: '-',
        avatarColor: 'bg-gray-100 text-gray-600'
    };
    setUsers([u, ...users]);
    setIsAddUserOpen(false);
    setNewUser({ firstName: '', lastName: '', email: '', role: 'Student', idNumber: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Users</p>
             <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
           </div>
           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
             <User size={24} />
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Students</p>
             <h3 className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'Student').length}</h3>
           </div>
           <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
             <GraduationCap size={24} />
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Teachers</p>
             <h3 className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'Teacher').length}</h3>
           </div>
           <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
             <BookOpen size={24} />
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Search by name, email or ID..." 
                   className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
              <div className="flex items-center gap-2">
                 <select 
                    className="bg-white border border-gray-200 text-gray-600 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-teal"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                 >
                    <option value="All">All Roles</option>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Admin">Admin</option>
                 </select>
                 <select 
                    className="bg-white border border-gray-200 text-gray-600 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-teal"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                 >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Invited">Invited</option>
                    <option value="Inactive">Inactive</option>
                 </select>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsImportOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                 <Upload size={16} /> Import
              </button>
              <button 
                onClick={() => setIsAddUserOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-brand-teal text-white text-sm font-semibold rounded-xl hover:bg-brand-tealDark shadow-lg shadow-brand-teal/20 transition-all"
              >
                 <Plus size={18} /> Add User
              </button>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold">
                 <tr>
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">ID Number</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${user.avatarColor}`}>
                                    {user.name.charAt(0)}
                                 </div>
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-900">{user.name}</h4>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                                user.role === 'Student' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                user.role === 'Teacher' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                'bg-purple-50 text-purple-700 border-purple-100'
                              }`}>
                                 {user.role === 'Student' && <GraduationCap size={12} />}
                                 {user.role === 'Teacher' && <BookOpen size={12} />}
                                 {user.role === 'Admin' && <Shield size={12} />}
                                 {user.role}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                              {user.idNumber}
                           </td>
                           <td className="px-6 py-4">
                              {user.status === 'Active' && <Badge status="Active" />}
                              {user.status === 'Inactive' && <Badge status="Expired" />} {/* Using Expired style for Inactive */}
                              {user.status === 'Invited' && <Badge status="Pending" />}
                           </td>
                           <td className="px-6 py-4 text-sm text-gray-500">
                              {user.joinedDate}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                 <MoreHorizontal size={18} />
                              </button>
                           </td>
                        </tr>
                    ))
                 ) : (
                    <tr>
                       <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                             <Search size={32} className="text-gray-300" />
                             <p className="text-sm font-medium">No users found matching your filters.</p>
                          </div>
                       </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>

        {/* Pagination (Visual Only) */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
           <p className="text-xs text-gray-500">Showing <span className="font-bold text-gray-900">{filteredUsers.length}</span> of <span className="font-bold text-gray-900">{users.length}</span> users</p>
           <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg text-gray-400 disabled:opacity-50" disabled>Previous</button>
              <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Next</button>
           </div>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal 
        isOpen={isAddUserOpen} 
        onClose={() => setIsAddUserOpen(false)} 
        title="Add New User"
        footer={
           <div className="flex gap-2 w-full">
               <button onClick={() => setIsAddUserOpen(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
               <button onClick={handleAddUser} className="flex-1 py-2.5 bg-brand-teal text-white rounded-xl text-sm font-medium hover:bg-brand-tealDark shadow-lg shadow-brand-teal/20">Create User</button>
           </div>
        }
      >
         <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <TextInput 
                  label="First Name" 
                  placeholder="e.g. John" 
                  value={newUser.firstName} 
                  onChange={(e: any) => setNewUser({...newUser, firstName: e.target.value})} 
               />
               <TextInput 
                  label="Last Name" 
                  placeholder="e.g. Doe" 
                  value={newUser.lastName} 
                  onChange={(e: any) => setNewUser({...newUser, lastName: e.target.value})} 
               />
            </div>
            <TextInput 
               label="Email Address" 
               placeholder="john.doe@college.edu" 
               icon={Mail}
               value={newUser.email}
               onChange={(e: any) => setNewUser({...newUser, email: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
               <SelectGroup 
                  label="Role" 
                  placeholder="Select Role" 
                  options={['Student', 'Teacher', 'Admin']} 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
               />
               <TextInput 
                  label="ID Number / Roll No" 
                  placeholder="e.g. STU-001" 
                  value={newUser.idNumber}
                  onChange={(e: any) => setNewUser({...newUser, idNumber: e.target.value})}
               />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start border border-blue-100">
               <div className="bg-white p-1 rounded-full text-blue-500 shadow-sm mt-0.5"><Mail size={12} /></div>
               <div className="text-xs text-blue-800">
                  <p className="font-bold mb-1">Invitation will be sent</p>
                  The user will receive an email to set their password and activate their account.
               </div>
            </div>
         </div>
      </Modal>

      {/* Bulk Import Modal */}
      <Modal 
        isOpen={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        title="Bulk Import Users"
        footer={
           <div className="flex gap-2 w-full">
               <button onClick={() => setIsImportOpen(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
               <button onClick={() => setIsImportOpen(false)} className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-black shadow-lg">Start Import</button>
           </div>
        }
      >
         <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                     <FileSpreadsheet size={20} />
                  </div>
                  <div>
                     <h4 className="text-sm font-bold text-gray-900">Download Template</h4>
                     <p className="text-xs text-gray-500">Use this CSV file to format your data correctly.</p>
                  </div>
               </div>
               <button className="text-xs font-semibold text-brand-teal hover:underline flex items-center gap-1">
                  <Download size={14} /> Download CSV
               </button>
            </div>

            <FileUpload label="Upload CSV / Excel File" sublabel="Drag and drop or click to browse" />

            <div className="space-y-2">
               <h4 className="text-sm font-medium text-gray-700">Import Settings</h4>
               <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" className="w-4 h-4 text-brand-teal rounded border-gray-300 focus:ring-brand-teal" defaultChecked />
                  <span className="text-sm text-gray-600">Send welcome emails automatically</span>
               </label>
               <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" className="w-4 h-4 text-brand-teal rounded border-gray-300 focus:ring-brand-teal" />
                  <span className="text-sm text-gray-600">Overwrite existing users if ID matches</span>
               </label>
            </div>
         </div>
      </Modal>

    </div>
  );
};
