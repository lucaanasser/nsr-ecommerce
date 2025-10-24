import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import AddressFormModal from '@/components/address/AddressFormModal';
import { Address } from '@/services/address.service';
import { getErrorMessage } from '@/services';

interface AddressesTabProps {
  enderecos: Address[];
  isLoading: boolean;
  onCreateAddress: (data: any) => Promise<void>;
  onUpdateAddress: (id: string, data: any) => Promise<void>;
  onDeleteAddress: (id: string) => Promise<void>;
  onSetDefaultAddress: (id: string) => Promise<void>;
}

/**
 * Componente da aba de endereços do usuário
 */
export default function AddressesTab({
  enderecos,
  isLoading,
  onCreateAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefaultAddress,
}: AddressesTabProps) {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (data: any) => {
    try {
      if (editingAddress) {
        await onUpdateAddress(editingAddress.id, data);
      } else {
        await onCreateAddress(data);
      }
      setShowAddressModal(false);
      setEditingAddress(null);
    } catch (error: any) {
      console.error('Erro ao salvar endereço:', error);
      throw error;
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Tem certeza que deseja remover este endereço?')) {
      return;
    }
    try {
      await onDeleteAddress(addressId);
    } catch (error: any) {
      alert('Erro ao remover endereço: ' + getErrorMessage(error));
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await onSetDefaultAddress(addressId);
    } catch (error: any) {
      alert('Erro ao definir endereço padrão: ' + getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-8 text-primary-white/50"
      >
        Carregando endereços...
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <Button variant="primary" className="py-2 px-6" onClick={handleAddAddress}>
          + Adicionar Endereço
        </Button>
      </div>

      {enderecos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-primary-white/50 mb-4">Você ainda não tem endereços cadastrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enderecos.map((endereco) => (
            <div
              key={endereco.id}
              className="bg-dark-card border border-dark-border p-6 rounded-sm hover:border-primary-bronze transition-colors relative"
            >
              {endereco.isDefault && (
                <span className="absolute top-4 right-4 text-xs bg-primary-bronze text-dark-bg px-2 py-1 rounded-sm">
                  Principal
                </span>
              )}
              <h3 className="text-primary-bronze font-semibold mb-3">{endereco.label}</h3>
              <p className="text-primary-white/70 text-sm mb-1">
                {endereco.street}, {endereco.number}
                {endereco.complement && ` - ${endereco.complement}`}
              </p>
              <p className="text-primary-white/70 text-sm mb-1">
                {endereco.neighborhood} - {endereco.city}/{endereco.state}
              </p>
              <p className="text-primary-white/70 text-sm mb-4">CEP: {endereco.zipCode}</p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="ghost"
                  className="text-sm text-primary-bronze hover:underline p-0"
                  onClick={() => handleEditAddress(endereco)}
                >
                  Editar
                </Button>
                {!endereco.isDefault && (
                  <Button
                    variant="ghost"
                    className="text-sm text-primary-gold hover:underline p-0"
                    onClick={() => handleSetDefaultAddress(endereco.id)}
                  >
                    Definir como Padrão
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="text-sm text-red-500 hover:underline p-0"
                  onClick={() => handleDeleteAddress(endereco.id)}
                >
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Endereço */}
      <AddressFormModal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        addressToEdit={editingAddress}
      />
    </motion.div>
  );
}
