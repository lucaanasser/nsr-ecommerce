import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { ColorOption, PREDEFINED_COLORS } from '../../types/variant.types';
import ColorButton from './ColorButton';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '../Modal';

interface ColorSelectorProps {
  colors: ColorOption[];
  onColorsChange: (colors: ColorOption[]) => void;
}

/**
 * Seletor de cores (predefinidas e customizadas)
 */
export default function ColorSelector({
  colors,
  onColorsChange,
}: ColorSelectorProps) {
  const [showCustomColorModal, setShowCustomColorModal] = useState(false);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#000000');

  const toggleColor = (color: ColorOption) => {
    const isSelected = colors.some((c) => c.id === color.id);

    if (isSelected) {
      onColorsChange(colors.filter((c) => c.id !== color.id));
    } else {
      onColorsChange([...colors, color]);
    }
  };

  const addCustomColor = () => {
    if (!customColorName.trim()) {
      alert('Por favor, insira um nome para a cor');
      return;
    }

    const newColor: ColorOption = {
      id: `custom-${Date.now()}`,
      name: customColorName.trim(),
      hex: customColorHex.toUpperCase(),
      isPredefined: false,
    };

    onColorsChange([...colors, newColor]);
    setShowCustomColorModal(false);
    setCustomColorName('');
    setCustomColorHex('#000000');
  };

  const removeCustomColor = (colorId: string) => {
    onColorsChange(colors.filter((c) => c.id !== colorId));
  };

  // Separar cores predefinidas e customizadas
  const customColors = colors.filter((c) => !c.isPredefined);

  return (
    <div className="space-y-6">
      {/* Cores Predefinidas */}
      <div>
        <label className="block text-sm font-medium text-primary-white mb-3">
          Cores Predefinidas
        </label>
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {PREDEFINED_COLORS.map((color) => (
            <ColorButton
              key={color.id}
              color={color}
              isSelected={colors.some((c) => c.id === color.id)}
              onToggle={() => toggleColor(color)}
            />
          ))}
        </div>
      </div>

      {/* Cores Customizadas */}
      {customColors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-primary-white mb-3">
            Cores Customizadas
          </label>
          <div className="flex flex-wrap gap-2">
            {customColors.map((color) => (
              <div
                key={color.id}
                className="flex items-center gap-2 px-3 py-2 bg-dark-card border border-dark-border rounded-sm"
              >
                <div
                  className="w-5 h-5 rounded-full border-2 border-dark-border"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm text-primary-white">{color.name}</span>
                <span className="text-xs text-primary-white/50">{color.hex}</span>
                <button
                  type="button"
                  onClick={() => removeCustomColor(color.id)}
                  className="text-primary-white/60 hover:text-red-500 transition-colors ml-2"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botão Adicionar Cor Customizada */}
      <Button
        variant="ghost"
        onClick={() => setShowCustomColorModal(true)}
        className="flex items-center gap-2"
      >
        <Plus size={18} />
        Adicionar Cor Customizada
      </Button>

      {/* Feedback de seleção */}
      {colors.length > 0 && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-sm">
          <p className="text-sm text-green-500">
            ✓ {colors.length} cor{colors.length !== 1 ? 'es' : ''} selecionada
            {colors.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Modal de Cor Customizada */}
      <Modal
        isOpen={showCustomColorModal}
        title="Adicionar Cor Customizada"
        onClose={() => {
          setShowCustomColorModal(false);
          setCustomColorName('');
          setCustomColorHex('#000000');
        }}
      >
        <div className="space-y-6 p-6">
          {/* Nome da Cor */}
          <div>
            <label className="block text-sm font-medium text-primary-white mb-2">
              Nome da Cor <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={customColorName}
              onChange={(e) => setCustomColorName(e.target.value)}
              placeholder="Ex: Verde Oliva, Azul Marinho"
            />
          </div>

          {/* Seletor de Cor */}
          <div>
            <label className="block text-sm font-medium text-primary-white mb-3">
              Selecione a Cor
            </label>
            <div className="flex flex-col items-center gap-4">
              <HexColorPicker
                color={customColorHex}
                onChange={setCustomColorHex}
                style={{ width: '100%', height: '200px' }}
              />
              <div className="flex items-center gap-3 w-full">
                <div
                  className="w-16 h-16 rounded-sm border-2 border-dark-border"
                  style={{ backgroundColor: customColorHex }}
                />
                <div className="flex-1">
                  <Input
                    type="text"
                    value={customColorHex}
                    onChange={(e) => setCustomColorHex(e.target.value)}
                    placeholder="#000000"
                    className="font-mono"
                  />
                  <p className="mt-1 text-xs text-primary-white/50">
                    Código hexadecimal da cor
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <Button variant="primary" onClick={addCustomColor} className="flex-1">
              Adicionar Cor
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowCustomColorModal(false);
                setCustomColorName('');
                setCustomColorHex('#000000');
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
