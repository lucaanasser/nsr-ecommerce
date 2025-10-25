interface ColorToggleProps {
  hasColors: boolean;
  onChange: (enabled: boolean) => void;
}

/**
 * Toggle para ativar/desativar cores
 */
export default function ColorToggle({ hasColors, onChange }: ColorToggleProps) {
  return (
    <div className="bg-dark-card/50 border border-dark-border rounded-sm p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-primary-white mb-1">
            Adicionar Cores
          </h4>
          <p className="text-sm text-primary-white/60">
            Ative para criar variantes por cor (ex: Preto, Branco, Azul)
          </p>
        </div>

        <button
          type="button"
          onClick={() => onChange(!hasColors)}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-gold focus:ring-offset-2 focus:ring-offset-dark-bg
            ${hasColors ? 'bg-primary-gold' : 'bg-dark-border'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
              ${hasColors ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {hasColors && (
        <div className="mt-3 p-3 bg-primary-gold/10 border border-primary-gold/30 rounded-sm">
          <p className="text-xs text-primary-gold">
            ℹ️ Cada tamanho será multiplicado pelas cores selecionadas
          </p>
        </div>
      )}
    </div>
  );
}
