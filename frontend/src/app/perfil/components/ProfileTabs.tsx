import Button from '@/components/ui/Button';

type TabType = 'pedidos' | 'dados' | 'enderecos' | 'pagamento' | 'favoritos';

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

/**
 * Componente de navegação por abas do perfil
 */
export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'pedidos', label: 'Meus Pedidos' },
    { id: 'dados', label: 'Dados Pessoais' },
    { id: 'enderecos', label: 'Endereços' },
    { id: 'pagamento', label: 'Pagamento' },
    { id: 'favoritos', label: 'Favoritos' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8 border-b border-dark-border">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 text-sm uppercase tracking-wider ${
            activeTab === tab.id
              ? 'text-primary-bronze border-b-2 border-primary-bronze'
              : 'text-primary-white/50 hover:text-primary-white'
          }`}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
