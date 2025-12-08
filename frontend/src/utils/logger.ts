/**
 * Sistema de logs coloridos para facilitar debugging
 */

type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

const colors = {
  info: '\x1b[36m',    // Cyan
  success: '\x1b[32m', // Green
  warning: '\x1b[33m', // Yellow
  error: '\x1b[31m',   // Red
  debug: '\x1b[35m',   // Magenta
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

const icons = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✗',
  debug: '◆',
};

class Logger {
  private enabled = process.env.NODE_ENV === 'development';
  private prefix = '[NSR]';

  private getTimestamp(): string {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3 
    });
  }

  private format(level: LogLevel, message: string, data?: any): string {
    const timestamp = this.getTimestamp();
    const icon = icons[level];
    const color = colors[level];
    
    return `${colors.dim}${timestamp}${colors.reset} ${color}${colors.bold}${icon} ${this.prefix}${colors.reset} ${color}${message}${colors.reset}`;
  }

  info(message: string, data?: any) {
    if (!this.enabled) return;
    console.log(this.format('info', message));
    if (data) console.log(data);
  }

  success(message: string, data?: any) {
    if (!this.enabled) return;
    console.log(this.format('success', message));
    if (data) console.log(data);
  }

  warning(message: string, data?: any) {
    if (!this.enabled) return;
    console.warn(this.format('warning', message));
    if (data) console.warn(data);
  }

  error(message: string, error?: any) {
    if (!this.enabled) return;
    console.error(this.format('error', message));
    
    if (error) {
      // Formatar erro detalhado
      if (error.response) {
        // Erro de resposta HTTP
        console.group(`${colors.error}📡 Resposta HTTP${colors.reset}`);
        console.error(`Status: ${error.response.status} ${error.response.statusText}`);
        console.error(`URL: ${error.config?.url}`);
        console.error(`Method: ${error.config?.method?.toUpperCase()}`);
        
        if (error.response.data) {
          console.error('Data:', error.response.data);
        }
        
        if (error.config?.data) {
          try {
            const payload = JSON.parse(error.config.data);
            console.error('Payload enviado:', payload);
          } catch {
            console.error('Payload enviado:', error.config.data);
          }
        }
        console.groupEnd();
      } else if (error.request) {
        // Erro de rede (sem resposta)
        console.group(`${colors.error}🌐 Erro de Rede${colors.reset}`);
        console.error('Nenhuma resposta recebida do servidor');
        console.error('URL:', error.config?.url);
        console.groupEnd();
      } else {
        // Erro genérico
        console.error(error);
      }

      // Stack trace
      if (error.stack) {
        console.group(`${colors.dim}Stack Trace${colors.reset}`);
        console.error(error.stack);
        console.groupEnd();
      }
    }
  }

  debug(message: string, data?: any) {
    if (!this.enabled) return;
    console.debug(this.format('debug', message));
    if (data) console.debug(data);
  }

  group(label: string) {
    if (!this.enabled) return;
    console.group(`${colors.bold}${label}${colors.reset}`);
  }

  groupEnd() {
    if (!this.enabled) return;
    console.groupEnd();
  }

  table(data: any) {
    if (!this.enabled) return;
    console.table(data);
  }

  // Logs específicos para produto
  productCreation = {
    start: (productName: string) => {
      logger.group('🏗️  Criação de Produto');
      logger.info(`Iniciando criação: ${productName}`);
    },

    validation: (step: string, isValid: boolean, errors?: any) => {
      if (isValid) {
        logger.success(`✓ Validação ${step}`);
      } else {
        logger.error(`✗ Validação ${step} falhou`, errors);
      }
    },

    imageUpload: (count: number, urls?: string[]) => {
      logger.info(`📤 Upload de ${count} imagem(ns)`);
      if (urls) {
        logger.debug('URLs geradas:', urls);
      }
    },

    transform: (payload: any) => {
      logger.debug('🔄 Dados transformados para API');
      logger.table(payload);
    },

    apiCall: (method: string, url: string, payload?: any) => {
      logger.info(`📡 ${method} ${url}`);
      if (payload) {
        logger.debug('Payload:', payload);
      }
    },

    success: (productId: string, product: any) => {
      logger.success(`✓ Produto criado: ${productId}`);
      logger.debug('Dados do produto:', product);
      logger.groupEnd();
    },

    error: (stage: string, error: any) => {
      logger.error(`✗ Erro em: ${stage}`, error);
      logger.groupEnd();
    },
  };

  // Logs específicos para validação
  validation = {
    field: (field: string, value: any, isValid: boolean, error?: string) => {
      if (isValid) {
        logger.debug(`✓ ${field}: ${JSON.stringify(value)}`);
      } else {
        logger.warning(`✗ ${field}: ${error}`);
      }
    },

    summary: (totalFields: number, validFields: number, errors: Record<string, string>) => {
      const hasErrors = Object.keys(errors).length > 0;
      
      if (hasErrors) {
        logger.warning(`Validação: ${validFields}/${totalFields} campos válidos`);
        logger.table(errors);
      } else {
        logger.success(`Validação: ${totalFields}/${totalFields} campos válidos`);
      }
    },
  };

  // Logs específicos para upload
  upload = {
    start: (files: File[]) => {
      logger.group('📤 Upload de Arquivos');
      logger.info(`${files.length} arquivo(s) selecionado(s)`);
      logger.table(files.map(f => ({
        nome: f.name,
        tamanho: `${(f.size / 1024).toFixed(2)} KB`,
        tipo: f.type,
      })));
    },

    progress: (fileName: string, progress: number) => {
      logger.debug(`${fileName}: ${progress}%`);
    },

    success: (urls: string[]) => {
      logger.success(`✓ ${urls.length} arquivo(s) enviado(s)`);
      logger.debug('URLs:', urls);
      logger.groupEnd();
    },

    error: (fileName: string, error: any) => {
      logger.error(`✗ Falha no upload: ${fileName}`, error);
      logger.groupEnd();
    },
  };

  // Logs específicos para API
  api = {
    request: (method: string, url: string, data?: any) => {
      logger.info(`📡 ${method.toUpperCase()} ${url}`);
      if (data) {
        logger.debug('Request data:', data);
      }
    },

    response: (method: string, url: string, status: number, data?: any) => {
      if (status >= 200 && status < 300) {
        logger.success(`✓ ${method.toUpperCase()} ${url} - ${status}`);
      } else {
        logger.warning(`⚠ ${method.toUpperCase()} ${url} - ${status}`);
      }
      if (data) {
        logger.debug('Response data:', data);
      }
    },

    error: (method: string, url: string, error: any) => {
      logger.error(`✗ ${method.toUpperCase()} ${url}`, error);
    },
  };
}

export const logger = new Logger();

// Helper para medir performance
export function measureTime<T>(
  label: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now();
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result.then(value => {
      const end = performance.now();
      logger.debug(`⏱️  ${label}: ${(end - start).toFixed(2)}ms`);
      return value;
    });
  }
  
  const end = performance.now();
  logger.debug(`⏱️  ${label}: ${(end - start).toFixed(2)}ms`);
  return result;
}
