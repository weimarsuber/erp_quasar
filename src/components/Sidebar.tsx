import { useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings as SettingsIcon 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Usuarios', path: '/users', icon: Users },
  { name: 'Artículos', path: '/articles', icon: Package },
  { name: 'Compras', path: '/purchases', icon: ShoppingCart },
  { name: 'Configuración', path: '/settings', icon: SettingsIcon },
];

interface SidebarProps {
  onNavigate: (path: string) => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation();

  return (
    <nav className="w-64 bg-white border-r border-gray-200">
      <div className="p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.name}>
                <button
                  onClick={() => onNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}