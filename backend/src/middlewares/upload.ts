/**
 * Middleware responsável por upload e validação de arquivos de imagem usando Multer.
 * Suporta upload em memória para integração com serviços externos como Cloudinary.
 */
import multer from 'multer';
import { Request } from 'express';
import { BadRequestError } from '../utils/errors';

// Configurar storage do Multer (memoryStorage para upload direto ao Cloudinary)
const storage = multer.memoryStorage();

// Validação de tipo de arquivo
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        `Tipo de arquivo não permitido: ${file.mimetype}. Use: jpg, jpeg, png ou webp`
      )
    );
  }
};

// Configuração do Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB por arquivo
  },
});

// Middleware para upload de uma única imagem
export const uploadSingle = upload.single('image');

// Middleware para upload de múltiplas imagens (máximo 10)
export const uploadMultiple = upload.array('images', 10);

// Exportar a instância do upload para uso customizado
export default upload;
