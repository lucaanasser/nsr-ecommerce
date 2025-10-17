'use client';

import { useState } from 'react';
import { 
  Upload, 
  File, 
  FileText, 
  FileSpreadsheet, 
  Image as ImageIcon,
  Folder,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  User
} from 'lucide-react';
import { documents, Document, getUserById } from '@/data/collaborationData';
import { useAdmin } from '@/context/AdminContext';

/**
 * Página de Gestão de Documentos
 * Sistema de upload, organização e compartilhamento de arquivos entre sócios
 */
export default function DocumentosPage() {
  const { user } = useAdmin();
  const [allDocuments, setAllDocuments] = useState<Document[]>(documents);
  const [selectedFolder, setSelectedFolder] = useState<string>('todos');
  const [selectedOwner, setSelectedOwner] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar documentos
  const filteredDocuments = allDocuments.filter((doc) => {
    const folderMatch = selectedFolder === 'todos' || doc.folder === selectedFolder;
    const ownerMatch = selectedOwner === 'todos' || doc.owner === selectedOwner || doc.owner === 'both';
    const searchMatch = 
      searchTerm === '' ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return folderMatch && ownerMatch && searchMatch;
  });

  // Obter pastas únicas
  const folders = Array.from(new Set(allDocuments.map((doc) => doc.folder)));

  // Calcular totais
  const totalSize = filteredDocuments.reduce((acc, doc) => acc + doc.size, 0);
  const myDocuments = allDocuments.filter((doc) => doc.owner === user?.id || doc.owner === 'both').length;

  // Formatar tamanho de arquivo
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // Obter ícone por tipo
  const getFileIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText size={20} className="text-red-400" />;
      case 'image':
        return <ImageIcon size={20} className="text-blue-400" />;
      case 'spreadsheet':
        return <FileSpreadsheet size={20} className="text-green-400" />;
      case 'doc':
        return <FileText size={20} className="text-blue-500" />;
      default:
        return <File size={20} className="text-primary-white/60" />;
    }
  };

  // Obter cor do owner
  const getOwnerColor = (ownerId: string) => {
    if (ownerId === 'both') return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    const owner = getUserById(ownerId);
    if (owner?.id === '2') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
  };

  const getOwnerLabel = (ownerId: string) => {
    if (ownerId === 'both') return 'Ambos';
    const owner = getUserById(ownerId);
    return owner?.name || 'Desconhecido';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-white">Documentos</h1>
          <p className="text-sm text-primary-white/60 mt-1">
            Gerencie e compartilhe arquivos da empresa
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-gold text-dark-bg rounded-sm font-medium hover:bg-primary-bronze transition-colors">
          <Upload size={20} />
          Fazer Upload
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-card p-6 rounded-sm border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <File size={16} className="text-primary-white/60" />
            <p className="text-sm text-primary-white/60">Total de Arquivos</p>
          </div>
          <p className="text-2xl font-bold text-primary-white">{filteredDocuments.length}</p>
        </div>

        <div className="bg-dark-card p-6 rounded-sm border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-primary-gold" />
            <p className="text-sm text-primary-white/60">Meus Documentos</p>
          </div>
          <p className="text-2xl font-bold text-primary-gold">{myDocuments}</p>
        </div>

        <div className="bg-dark-card p-6 rounded-sm border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <Folder size={16} className="text-primary-white/60" />
            <p className="text-sm text-primary-white/60">Pastas</p>
          </div>
          <p className="text-2xl font-bold text-primary-white">{folders.length}</p>
        </div>

        <div className="bg-dark-card p-6 rounded-sm border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <FileSpreadsheet size={16} className="text-primary-white/60" />
            <p className="text-sm text-primary-white/60">Espaço Usado</p>
          </div>
          <p className="text-2xl font-bold text-primary-white">{formatSize(totalSize)}</p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-dark-card rounded-sm border border-dark-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-white/40" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-sm pl-10 pr-3 py-2 text-primary-white focus:outline-none focus:border-primary-gold"
            />
          </div>

          {/* Filtro por Pasta */}
          <div className="flex items-center gap-2">
            <Folder size={18} className="text-primary-gold" />
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="flex-1 bg-dark-bg border border-dark-border rounded-sm px-3 py-2 text-primary-white focus:outline-none focus:border-primary-gold"
            >
              <option value="todos">Todas as pastas</option>
              {folders.map((folder) => (
                <option key={folder} value={folder}>{folder}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Proprietário */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-primary-gold" />
            <select
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              className="flex-1 bg-dark-bg border border-dark-border rounded-sm px-3 py-2 text-primary-white focus:outline-none focus:border-primary-gold"
            >
              <option value="todos">Todos os proprietários</option>
              <option value="2">Luca</option>
              <option value="3">Sócio NSR</option>
              <option value="both">Ambos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="bg-dark-card rounded-sm border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg border-b border-dark-border">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-primary-white/80">Nome</th>
                <th className="text-left p-4 text-sm font-semibold text-primary-white/80">Pasta</th>
                <th className="text-left p-4 text-sm font-semibold text-primary-white/80">Proprietário</th>
                <th className="text-left p-4 text-sm font-semibold text-primary-white/80">Tags</th>
                <th className="text-right p-4 text-sm font-semibold text-primary-white/80">Tamanho</th>
                <th className="text-right p-4 text-sm font-semibold text-primary-white/80">Data</th>
                <th className="text-center p-4 text-sm font-semibold text-primary-white/80">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => {
                const uploader = getUserById(doc.uploadedBy);
                return (
                  <tr key={doc.id} className="border-b border-dark-border hover:bg-dark-bg/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {getFileIcon(doc.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-primary-white">{doc.name}</p>
                          <p className="text-xs text-primary-white/40">
                            Por {uploader?.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-primary-white/80">
                        <Folder size={14} />
                        {doc.folder}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 rounded-sm text-xs font-medium border ${getOwnerColor(doc.owner)}`}>
                        {getOwnerLabel(doc.owner)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-0.5 bg-dark-bg text-primary-white/60 text-xs rounded-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right text-sm text-primary-white/80">
                      {formatSize(doc.size)}
                    </td>
                    <td className="p-4 text-right text-sm text-primary-white/80">
                      {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-primary-white/60 hover:text-primary-gold hover:bg-dark-bg rounded transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-primary-white/60 hover:text-green-400 hover:bg-dark-bg rounded transition-colors">
                          <Download size={16} />
                        </button>
                        <button className="p-2 text-primary-white/60 hover:text-red-400 hover:bg-dark-bg rounded transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="p-12 text-center">
            <File size={48} className="text-primary-white/20 mx-auto mb-4" />
            <p className="text-primary-white/60">Nenhum documento encontrado</p>
          </div>
        )}
      </div>

      {/* Grid de Pastas */}
      <div className="bg-dark-card rounded-sm border border-dark-border p-6">
        <h2 className="text-lg font-semibold text-primary-white mb-4">Navegação por Pastas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {folders.map((folder) => {
            const folderDocs = allDocuments.filter((doc) => doc.folder === folder);
            const folderSize = folderDocs.reduce((acc, doc) => acc + doc.size, 0);
            return (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={`p-4 rounded-sm border transition-all text-left ${
                  selectedFolder === folder
                    ? 'bg-primary-gold/10 border-primary-gold'
                    : 'bg-dark-bg border-dark-border hover:border-primary-gold/50'
                }`}
              >
                <Folder size={24} className={selectedFolder === folder ? 'text-primary-gold' : 'text-primary-white/60'} />
                <p className="text-sm font-medium text-primary-white mt-2">{folder}</p>
                <p className="text-xs text-primary-white/40 mt-1">
                  {folderDocs.length} arquivo{folderDocs.length !== 1 ? 's' : ''} · {formatSize(folderSize)}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
