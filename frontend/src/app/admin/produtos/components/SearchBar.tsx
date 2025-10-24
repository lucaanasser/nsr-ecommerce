import { Search, X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

/**
 * Barra de busca reutilizável
 */
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Buscar...",
  className = ""
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-white/40 z-10" 
        size={18} 
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-white/40 hover:text-primary-white transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
