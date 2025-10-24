/**
 * Loading state reutilizável
 */
interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ 
  message = "Carregando..." 
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="w-12 h-12 border-4 border-primary-gold/20 border-t-primary-gold rounded-full animate-spin" />
      <p className="text-primary-white/60 text-sm">{message}</p>
    </div>
  );
}
