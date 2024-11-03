import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import TabView, { Tab } from './TabView';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Articles from '../pages/Articles';
import Purchases from '../pages/Purchases';
import Settings from '../pages/Settings';
import { LayoutDashboard, Users as UsersIcon, Package, ShoppingCart, Settings as SettingsIcon } from 'lucide-react';

const ROUTES = {
  '/': { component: Dashboard, title: 'Dashboard', icon: LayoutDashboard },
  '/users': { component: Users, title: 'Usuarios', icon: UsersIcon },
  '/articles': { component: Articles, title: 'Artículos', icon: Package },
  '/purchases': { component: Purchases, title: 'Compras', icon: ShoppingCart },
  '/settings': { component: Settings, title: 'Configuración', icon: SettingsIcon },
};

export default function Layout() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const addTab = (path: string) => {
    const route = ROUTES[path as keyof typeof ROUTES];
    if (!route) return;

    const Icon = route.icon;
    const newTab: Tab = {
      id: path,
      title: route.title,
      content: <route.component />,
      icon: <Icon className="h-4 w-4" />,
    };

    if (!tabs.find((tab) => tab.id === path)) {
      setTabs((prev) => [...prev, newTab]);
    }
    setActiveTab(path);
    navigate(path);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(tabId);
  };

  const handleTabClose = (tabId: string) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== tabId));
    if (activeTab === tabId) {
      const remainingTabs = tabs.filter((tab) => tab.id !== tabId);
      if (remainingTabs.length > 0) {
        setActiveTab(remainingTabs[remainingTabs.length - 1].id);
        navigate(remainingTabs[remainingTabs.length - 1].id);
      } else {
        setActiveTab(null);
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar onNavigate={addTab} />
        <main className="flex-1 p-6 overflow-hidden">
          <TabView
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onTabClose={handleTabClose}
          />
        </main>
      </div>
    </div>
  );
}