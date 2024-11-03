import { Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Branch } from '../types';

export default function Header() {
  const { user, branch, setBranch } = useAuth();
  const [showBranchSelect, setShowBranchSelect] = useState(false);

  const handleBranchChange = (newBranch: Branch) => {
    setBranch(newBranch);
    setShowBranchSelect(false);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
            <div className="relative ml-4">
              <button
                onClick={() => setShowBranchSelect(!showBranchSelect)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none"
              >
                {branch?.name}
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showBranchSelect && (
                <div className="absolute top-full left-0 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {user?.branches.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => handleBranchChange(b)}
                        className={`block w-full px-4 py-2 text-sm text-left ${
                          b.id === branch?.id
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-gray-50">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}