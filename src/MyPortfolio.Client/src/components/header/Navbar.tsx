import { Home, GraduationCap, Briefcase, Award, MessageSquare } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isLightMode: boolean;
}

export function Navbar({ activeSection, onSectionChange, isLightMode }: NavbarProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <nav className={`border-b sticky top-0 z-10 ${
      isLightMode 
        ? 'bg-white border-[#d0d7de]' 
        : 'bg-[#0d1117] border-[#30363d]'
    }`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                  isActive
                    ? isLightMode
                      ? 'border-[#fd8c73] text-gray-900'
                      : 'border-[#fd8c73] text-white'
                    : isLightMode
                      ? 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      : 'border-transparent text-[#7d8590] hover:text-[#c9d1d9] hover:border-[#30363d]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}