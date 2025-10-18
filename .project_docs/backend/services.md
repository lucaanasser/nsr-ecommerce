# Resumo dos Serviços do Backend

## services/
- **auth.service.ts**: Lógica de autenticação, integração com UserRepository e JWT. Envia email de boas-vindas no registro.
- **category.service.ts**: Lógica de categorias de produtos (CRUD completo).
- **collection.service.ts**: Lógica de coleções de produtos (CRUD completo).
- **product.service.ts**: Lógica de produtos (CRUD, filtros, paginação).
- **cloudinary.service.ts**: Upload e deleção de imagens no Cloudinary.
- **cart.service.ts**: Lógica de carrinho de compras (add, update, remove, clear, validações de estoque e produto ativo).
- **order.service.ts**: Criação de pedidos, cálculo de totais, aplicação de cupons, envio de email de confirmação.
- **shipping.service.ts**: Cálculo de frete por tabela, simulação de frete.
- **coupon.service.ts**: Validação e aplicação de cupons de desconto.
- **email.service.ts**: Envio de emails transacionais (boas-vindas, confirmação de pedido, atualização de status, redefinição de senha). Template único reutilizável.

---
Consulte este arquivo para referência rápida dos serviços existentes.
