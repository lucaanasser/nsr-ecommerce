'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuthContext } from '@/context/AuthContext';
import { IMAGES } from '@/config/images';
import { getErrorMessage } from '@/services';

// Hooks customizados
import { useProfileData } from './hooks/useProfileData';
import { useOrders } from './hooks/useOrders';
import { useAddresses } from './hooks/useAddresses';

// Componentes modulares
import ProfileTabs from './components/ProfileTabs';
import OrdersTab from './components/OrdersTab';
import PersonalDataTab from './components/PersonalDataTab';
import AddressesTab from './components/AddressesTab';
import PaymentTab from './components/PaymentTab';
import FavoritesTab from './components/FavoritesTab';
import SaveChangesModal from './components/modals/SaveChangesModal';
import DeleteAccountModal from './components/modals/DeleteAccountModal';

type TabType = 'pedidos' | 'dados' | 'enderecos' | 'pagamento' | 'favoritos';

/**
 * Página Perfil do Usuário - Versão Refatorada e Modular
 * 
 * Gerencia todas as informações do usuário através de abas:
 * - Pedidos
 * - Dados Pessoais
 * - Endereços
 * - Formas de Pagamento
 * - Favoritos
 */
export default function PerfilPage() {
  const { isAuthenticated, isLoading, deleteAccount } = useAuthContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('pedidos');
  const { favoritos, removerDosFavoritos } = useFavorites();
  
  // Modais
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Hooks customizados para gerenciar dados
  const profileData = useProfileData();
  const { pedidos, isLoading: pedidosLoading } = useOrders(activeTab === 'pedidos', isAuthenticated);
  const addresses = useAddresses(activeTab === 'enderecos', isAuthenticated);

  // Protege a página de perfil
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Handler para exclusão de conta
  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    
    const senha = window.prompt('Digite sua senha para confirmar a exclusão da conta:');
    
    if (!senha) {
      alert('Senha não fornecida. Exclusão cancelada.');
      return;
    }

    try {
      await deleteAccount(senha);
      alert('Sua conta foi excluída com sucesso. Você será redirecionado para a página inicial.');
      router.push('/');
    } catch (error: any) {
      alert('Erro ao excluir conta: ' + getErrorMessage(error));
    }
  };

  // Handler para salvar alterações do perfil
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    profileData.setSaveError('');

    const validationError = profileData.validateData();
    if (validationError) {
      profileData.setSaveError(validationError);
      return;
    }

    setShowSaveModal(true);
  };

  // Confirma salvamento
  const confirmSaveChanges = async () => {
    setShowSaveModal(false);
    
    try {
      await profileData.saveChanges();
      alert('Alterações salvas com sucesso!');
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <p className="text-primary-white">Carregando...</p>
      </div>
    );
  }

  // Não renderiza nada se não estiver autenticado
  if (!isAuthenticated || !profileData.user) {
    return null;
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-dark-bg pt-24 pb-16 relative overflow-hidden">
        {/* Imagem de fundo com filtro vintage */}
        <div className="fixed inset-0 z-0">
          <Image
            src={IMAGES.profile}
            alt="Background"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          {/* Overlay escuro com fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/85 via-dark-bg/90 to-dark-bg/95" />
          {/* Filtro vintage granulado */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuNSIvPjwvc3ZnPg==')]" />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary-bronze">
              <span className="font-nsr">Meu Perfil</span>
            </h1>

            {/* Navegação por Tabs */}
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Conteúdo das Tabs */}
            <div className="mt-8">
              {activeTab === 'pedidos' && (
                <OrdersTab pedidos={pedidos} isLoading={pedidosLoading} />
              )}

              {activeTab === 'dados' && (
                <PersonalDataTab
                  user={profileData.user}
                  isEditing={profileData.isEditing}
                  setIsEditing={profileData.setIsEditing}
                  isSaving={profileData.isSaving}
                  saveError={profileData.saveError}
                  editData={profileData.editData}
                  passwordData={profileData.passwordData}
                  onEditDataChange={profileData.updateEditData}
                  onPasswordChange={profileData.updatePasswordData}
                  onSubmit={handleSaveChanges}
                  onDeleteAccount={() => setShowDeleteModal(true)}
                />
              )}

              {activeTab === 'enderecos' && (
                <AddressesTab
                  enderecos={addresses.enderecos}
                  isLoading={addresses.isLoading}
                  onCreateAddress={addresses.createAddress}
                  onUpdateAddress={addresses.updateAddress}
                  onDeleteAddress={addresses.deleteAddress}
                  onSetDefaultAddress={addresses.setDefaultAddress}
                />
              )}

              {activeTab === 'pagamento' && <PaymentTab />}

              {activeTab === 'favoritos' && (
                <FavoritesTab
                  favoritos={favoritos}
                  onRemoveFavorite={removerDosFavoritos}
                />
              )}
            </div>
          </motion.div>
        </Container>
      </main>

      <Footer />

      {/* Modais */}
      <SaveChangesModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={confirmSaveChanges}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
}
