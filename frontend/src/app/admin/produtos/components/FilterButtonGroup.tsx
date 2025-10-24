import Button from '@/components/ui/Button';

/**
 * Grupo de botões de filtro reutilizável
 */
interface FilterButtonGroupProps<T extends string> {
  options: { value: T; label: string }[];
  selected: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function FilterButtonGroup<T extends string>({ 
  options, 
  selected, 
  onChange,
  className = ""
}: FilterButtonGroupProps<T>) {
  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={selected === option.value ? 'primary' : 'ghost'}
          onClick={() => onChange(option.value)}
          className={`px-4 py-2 text-sm ${
            selected === option.value 
              ? '' 
              : 'bg-dark-bg/50 text-primary-white/60 hover:text-primary-white border border-dark-border'
          }`}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
