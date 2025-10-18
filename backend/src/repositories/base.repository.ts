/**
 * Base Repository Interface
 * Define métodos CRUD comuns para todos os repositories
 */
export interface IBaseRepository<T> {
  /**
   * Encontra um registro por ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Encontra múltiplos registros com filtros opcionais
   */
  findMany(args?: any): Promise<T[]>;

  /**
   * Cria um novo registro
   */
  create(data: any): Promise<T>;

  /**
   * Atualiza um registro existente
   */
  update(id: string, data: any): Promise<T>;

  /**
   * Remove um registro (soft ou hard delete)
   */
  delete(id: string): Promise<T>;

  /**
   * Conta registros com filtros opcionais
   */
  count(args?: any): Promise<number>;
}

/**
 * Abstract Base Repository Implementation
 * Classe base com implementações padrão usando Prisma
 */
export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected abstract model: any;

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
    });
  }

  async findMany(args: any = {}): Promise<T[]> {
    return this.model.findMany(args);
  }

  async create(data: any): Promise<T> {
    return this.model.create({
      data,
    });
  }

  async update(id: string, data: any): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  async count(args: any = {}): Promise<number> {
    return this.model.count(args);
  }
}
