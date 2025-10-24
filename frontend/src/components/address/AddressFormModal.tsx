'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Address } from '@/services/address.service';
import { getErrorMessage } from '@/services';

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  addressToEdit?: Address | null;
}

export default function AddressFormModal({ isOpen, onClose, onSave, addressToEdit }: AddressFormModalProps) {
  const [formData, setFormData] = useState({
    label: '',
    receiverName: '',
    receiverPhone: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    isDefault: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Preenche o formulário quando está editando
  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        label: addressToEdit.label || '',
        receiverName: addressToEdit.receiverName || '',
        receiverPhone: addressToEdit.receiverPhone || '',
        zipCode: addressToEdit.zipCode || '',
        street: addressToEdit.street || '',
        number: addressToEdit.number || '',
        complement: addressToEdit.complement || '',
        neighborhood: addressToEdit.neighborhood || '',
        city: addressToEdit.city || '',
        state: addressToEdit.state || '',
        isDefault: addressToEdit.isDefault || false,
      });
    } else {
      // Limpa o formulário para novo endereço
      setFormData({
        label: '',
        receiverName: '',
        receiverPhone: '',
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        isDefault: false,
      });
    }
    setError('');
  }, [addressToEdit, isOpen]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações básicas
    if (!formData.label.trim()) {
      setError('O título do endereço é obrigatório');
      return;
    }

    if (!formData.receiverName.trim()) {
      setError('O nome do destinatário é obrigatório');
      return;
    }

    if (!formData.zipCode.trim()) {
      setError('O CEP é obrigatório');
      return;
    }

    if (!formData.street.trim()) {
      setError('O endereço é obrigatório');
      return;
    }

    if (!formData.number.trim()) {
      setError('O número é obrigatório');
      return;
    }

    if (!formData.neighborhood.trim()) {
      setError('O bairro é obrigatório');
      return;
    }

    if (!formData.city.trim()) {
      setError('A cidade é obrigatória');
      return;
    }

    if (!formData.state.trim()) {
      setError('O estado é obrigatório');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-dark-card border-2 border-primary-bronze rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
          >
            {/* Botão fechar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-primary-white/50 hover:text-primary-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Título */}
            <h2 className="text-2xl font-bold text-primary-bronze mb-6 font-nsr">
              {addressToEdit ? 'Editar Endereço' : 'Novo Endereço'}
            </h2>

            {/* Erro */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-sm text-sm">
                {error}
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Título do Endereço */}
              <div>
                <label className="block text-sm font-medium text-primary-white/80 mb-2">
                  Título do Endereço *
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Casa, Trabalho, Casa da Praia..."
                  value={formData.label}
                  onChange={(e) => handleChange('label', e.target.value)}
                  required
                />
              </div>

              {/* Destinatário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-primary-white/80 mb-2">
                    Nome do Destinatário *
                  </label>
                  <Input
                    type="text"
                    placeholder="Nome completo"
                    value={formData.receiverName}
                    onChange={(e) => handleChange('receiverName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-white/80 mb-2">
                    Telefone *
                  </label>
                  <Input
                    type="tel"
                    placeholder="(11) 98765-4321"
                    value={formData.receiverPhone}
                    onChange={(e) => handleChange('receiverPhone', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* CEP */}
              <div>
                <label className="block text-sm font-medium text-primary-white/80 mb-2">
                  CEP *
                </label>
                <Input
                  type="text"
                  placeholder="12345-678"
                  value={formData.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  maxLength={9}
                  required
                />
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-primary-white/80 mb-2">
                  Endereço *
                </label>
                <Input
                  type="text"
                  placeholder="Rua, Avenida, etc."
                  value={formData.street}
                  onChange={(e) => handleChange('street', e.target.value)}
                  required
                />
              </div>

              {/* Número e Complemento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-primary-white/80 mb-2">
                    Número *
                  </label>
                  <Input
                    type="text"
                    placeholder="123"
                    value={formData.number}
                    onChange={(e) => handleChange('number', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-white/80 mb-2">
                    Complemento
                  </label>
                  <Input
                    type="text"
                    placeholder="Apto, Bloco, etc."
                    value={formData.complement}
                    onChange={(e) => handleChange('complement', e.target.value)}
                  />
                </div>
              </div>

              {/* Bairro */}
              <div>
                <label className="block text-sm font-medium text-primary-white/80 mb-2">
                  Bairro *
                </label>
                <Input
                  type="text"
                  placeholder="Nome do bairro"
                  value={formData.neighborhood}
                  onChange={(e) => handleChange('neighborhood', e.target.value)}
                  required
                />
              </div>

              {/* Cidade e Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-primary-white/80 mb-2">
                    Cidade *
                  </label>
                  <Input
                    type="text"
                    placeholder="São Paulo"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-white/80 mb-2">
                    Estado *
                  </label>
                  <Input
                    type="text"
                    placeholder="SP"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
                    maxLength={2}
                    required
                  />
                </div>
              </div>

              {/* Checkbox Endereço Padrão */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => handleChange('isDefault', e.target.checked)}
                    className="w-4 h-4 accent-primary-bronze"
                  />
                  <span className="text-sm text-primary-white/80">
                    Definir como endereço padrão
                  </span>
                </label>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1 border border-dark-border"
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar Endereço'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
