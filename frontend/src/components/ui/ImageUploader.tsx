'use client';

import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';

export interface ImageData {
  id?: string;
  url: string;
  altText?: string;
  order: number;
  isPrimary: boolean;
  file?: File;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

interface ImageUploaderProps {
  images: ImageData[];
  onChange: (images: ImageData[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  disabled?: boolean;
}

const DEFAULT_ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_MAX_IMAGES = 10;

export function ImageUploader({
  images,
  onChange,
  maxImages = DEFAULT_MAX_IMAGES,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  disabled = false,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAddMore = images.length < maxImages;

  // Validar arquivo individual
  const validateFile = useCallback(
    (file: File): string | null => {
      // Validar tipo
      if (!acceptedFormats.includes(file.type)) {
        return `Formato inválido. Aceito: ${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}`;
      }

      // Validar tamanho
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        return `Arquivo muito grande (${sizeMB.toFixed(1)}MB). Máximo: ${maxSizeMB}MB`;
      }

      return null;
    },
    [acceptedFormats, maxSizeMB]
  );

  // Processar arquivos selecionados
  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const newErrors: string[] = [];
      const validFiles: File[] = [];

      // Verificar limite
      if (images.length + fileArray.length > maxImages) {
        newErrors.push(`Máximo de ${maxImages} imagens permitido`);
        setErrors(newErrors);
        return;
      }

      // Validar cada arquivo
      fileArray.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });

      if (newErrors.length > 0) {
        setErrors(newErrors);
        setTimeout(() => setErrors([]), 5000);
      }

      // Criar previews para arquivos válidos
      if (validFiles.length > 0) {
        validFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const newImage: ImageData = {
              url: reader.result as string,
              altText: file.name.replace(/\.[^/.]+$/, ''),
              order: images.length,
              isPrimary: images.length === 0,
              file,
              uploadProgress: 0,
              uploadStatus: 'pending',
            };

            onChange([...images, newImage]);
          };
          reader.readAsDataURL(file);
        });
      }
    },
    [images, maxImages, onChange, validateFile]
  );

  // Handlers de drag & drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled || !canAddMore) return;

      const { files } = e.dataTransfer;
      if (files && files.length > 0) {
        processFiles(files);
      }
    },
    [disabled, canAddMore, processFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        e.target.value = ''; // Reset input
      }
    },
    [processFiles]
  );

  // Remover imagem
  const removeImage = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      
      // Reorganizar ordem e primary
      const reorderedImages = newImages.map((img, i) => ({
        ...img,
        order: i,
        isPrimary: i === 0 && newImages.length > 0,
      }));

      onChange(reorderedImages);
    },
    [images, onChange]
  );

  // Marcar como principal
  const setPrimary = useCallback(
    (index: number) => {
      const newImages = images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }));
      onChange(newImages);
    },
    [images, onChange]
  );

  // Atualizar alt text
  const updateAltText = useCallback(
    (index: number, altText: string) => {
      const newImages = [...images];
      newImages[index] = { ...newImages[index], altText };
      onChange(newImages);
    },
    [images, onChange]
  );

  // Reordenar imagens (drag & drop entre cards)
  const reorderImages = useCallback(
    (fromIndex: number, toIndex: number) => {
      const newImages = [...images];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);

      // Atualizar ordem
      const reorderedImages = newImages.map((img, i) => ({
        ...img,
        order: i,
        isPrimary: img.isPrimary, // Manter primary
      }));

      onChange(reorderedImages);
    },
    [images, onChange]
  );

  return (
    <div className="space-y-4">
      {/* Área de Upload */}
      {canAddMore && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8
            transition-colors duration-200 cursor-pointer
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFormats.join(',')}
            onChange={handleFileInput}
            disabled={disabled}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Clique para fazer upload ou arraste as imagens
            </p>
            <p className="text-xs text-gray-500">
              {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} até {maxSizeMB}MB
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {images.length} de {maxImages} imagens
            </p>
          </div>
        </div>
      )}

      {/* Mensagens de Erro */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          {errors.map((error, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Grid de Imagens */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <ImageCard
              key={image.url}
              image={image}
              index={index}
              isPrimary={image.isPrimary}
              onRemove={() => removeImage(index)}
              onSetPrimary={() => setPrimary(index)}
              onUpdateAltText={(altText) => updateAltText(index, altText)}
              onReorder={reorderImages}
              disabled={disabled}
            />
          ))}
        </div>
      )}

      {/* Estado Vazio */}
      {images.length === 0 && !canAddMore && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhuma imagem adicionada</p>
        </div>
      )}
    </div>
  );
}

// Componente de Card Individual
interface ImageCardProps {
  image: ImageData;
  index: number;
  isPrimary: boolean;
  onRemove: () => void;
  onSetPrimary: () => void;
  onUpdateAltText: (altText: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  disabled?: boolean;
}

function ImageCard({
  image,
  index,
  isPrimary,
  onRemove,
  onSetPrimary,
  onUpdateAltText,
  disabled,
}: ImageCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showAltInput, setShowAltInput] = useState(false);

  return (
    <div
      className={`
        relative group rounded-lg overflow-hidden border-2 transition-all
        ${isPrimary ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
        ${isDragging ? 'opacity-50' : ''}
        ${disabled ? 'opacity-50' : ''}
      `}
      draggable={!disabled}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      {/* Imagem */}
      <div className="aspect-square bg-gray-100 relative">
        <img
          src={image.url}
          alt={image.altText || `Imagem ${index + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Badge Primary */}
        {isPrimary && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Principal
          </div>
        )}

        {/* Progress Bar */}
        {image.uploadStatus === 'uploading' && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${image.uploadProgress || 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Status Icons */}
        {image.uploadStatus === 'success' && (
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        )}
        {image.uploadStatus === 'error' && (
          <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Overlay com ações */}
        {!disabled && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200">
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onRemove}
                className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                title="Remover"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isPrimary && (
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={onSetPrimary}
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 text-xs py-1.5 rounded font-medium transition-colors"
                >
                  Marcar como principal
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Alt Text Input */}
      <div className="p-2 bg-white">
        {showAltInput ? (
          <input
            type="text"
            value={image.altText || ''}
            onChange={(e) => onUpdateAltText(e.target.value)}
            onBlur={() => setShowAltInput(false)}
            placeholder="Texto alternativo"
            className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
            autoFocus
            disabled={disabled}
          />
        ) : (
          <button
            onClick={() => !disabled && setShowAltInput(true)}
            className="w-full text-left text-xs text-gray-600 hover:text-gray-800 truncate"
            disabled={disabled}
          >
            {image.altText || 'Adicionar texto alternativo'}
          </button>
        )}
      </div>
    </div>
  );
}
