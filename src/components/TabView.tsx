import { ReactNode } from 'react';
import { X } from 'lucide-react';

export interface Tab {
  id: string;
  title: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface TabViewProps {
  tabs: Tab[];
  activeTab: string | null;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

export default function TabView({ tabs, activeTab, onTabChange, onTabClose }: TabViewProps) {
  if (tabs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Seleccione una opción del menú para comenzar
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10 max-w-xs ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-500 border-b border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 justify-center">
                {tab.icon}
                <span className="truncate">{tab.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab.id);
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}