import { AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

/**
 * Estado de erro reutilizável
 */
interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ 
  message, 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
        <AlertCircle className="text-red-500" size={32} />
      </div>
      <div className="text-center space-y-2">
        <p className="text-primary-white font-medium">Ops! Algo deu errado</p>
        <p className="text-primary-white/60 text-sm">{message}</p>
      </div>
      {onRetry && (
        <Button 
          variant="primary" 
          onClick={onRetry}
          className="px-6"
        >
          Tentar Novamente
        </Button>
      )}
    </div>
  );
}
