# Funcionalidade de Busca de CEP

## 📦 Descrição

Implementação de busca automática de endereço através do CEP utilizando a API do ViaCEP. Esta funcionalidade preenche automaticamente os campos de endereço (rua, bairro, cidade e estado) quando o usuário digita um CEP válido.

## 🚀 Arquivos Criados/Modificados

### Novos Arquivos

1. **`/frontend/src/hooks/useCepLookup.ts`**
   - Hook personalizado para busca de CEP
   - Gerencia estados de loading, erro e dados
   - Faz requisição à API do ViaCEP

2. **`/frontend/src/utils/cep.ts`**
   - Utilitários para formatação e validação de CEP
   - Funções: `formatCep()`, `cleanCep()`, `isValidCep()`

### Arquivos Modificados

1. **`/frontend/src/components/address/AddressFormModal.tsx`**
   - Adicionado busca automática de CEP no modal de endereços do perfil
   - Formatação automática do CEP enquanto digita
   - Indicador de loading durante a busca

2. **`/frontend/src/app/checkout/components/steps/EntregaStep.tsx`**
   - Adicionado busca automática de CEP no checkout
   - Mesmo comportamento do modal de perfil
   - Reutilização do mesmo hook

## 🎯 Funcionalidades

### 1. Busca Automática
- Quando o usuário digita 8 dígitos, automaticamente busca o endereço
- Preenche os campos: rua, bairro, cidade e estado
- Não sobrescreve campos já preenchidos manualmente

### 2. Formatação Automática
- CEP formatado no padrão `12345-678` enquanto o usuário digita
- Remove caracteres não numéricos automaticamente

### 3. Validação
- Verifica se o CEP tem 8 dígitos
- Exibe mensagens de erro apropriadas:
  - "CEP inválido" - quando tem menos de 8 dígitos
  - "CEP não encontrado" - quando o CEP não existe na base do ViaCEP
  - "Erro ao buscar CEP" - em caso de erro na requisição

### 4. Feedback Visual
- Ícone de loading (spinner) enquanto busca
- Mensagem de erro quando necessário
- Dica para o usuário: "Digite o CEP para preencher automaticamente"

## 💻 Como Usar

### No Código

```tsx
import { useCepLookup } from '@/hooks/useCepLookup';
import { formatCep, cleanCep } from '@/utils/cep';

function MeuComponente() {
  const { loading, error, lookupCep } = useCepLookup();
  const [cep, setCep] = useState('');

  const handleCepChange = async (value: string) => {
    // Formata o CEP
    const formatted = formatCep(value);
    setCep(formatted);

    // Busca quando tiver 8 dígitos
    const cleaned = cleanCep(value);
    if (cleaned.length === 8) {
      const data = await lookupCep(cleaned);
      if (data) {
        // Preenche os campos de endereço
        setEndereco(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.localidade);
        setEstado(data.uf);
      }
    }
  };

  return (
    <div>
      <input 
        value={cep}
        onChange={(e) => handleCepChange(e.target.value)}
        maxLength={9}
      />
      {loading && <Spinner />}
      {error && <p>{error}</p>}
    </div>
  );
}
```

### Para o Usuário

1. Digite o CEP no campo apropriado
2. Após digitar 8 dígitos, aguarde alguns segundos
3. Os campos de endereço serão preenchidos automaticamente
4. Você ainda pode editar qualquer campo manualmente

## 🔧 API Utilizada

**ViaCEP**: https://viacep.com.br/

- Endpoint: `https://viacep.com.br/ws/{cep}/json/`
- Gratuita e sem necessidade de autenticação
- Retorna dados de CEPs brasileiros

### Exemplo de Resposta

```json
{
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "complemento": "",
  "bairro": "Bela Vista",
  "localidade": "São Paulo",
  "uf": "SP",
  "ibge": "3550308",
  "gia": "1004",
  "ddd": "11",
  "siafi": "7107"
}
```

## 🎨 UX/UI

### Estados Visuais

1. **Normal**: Campo de CEP vazio ou parcialmente preenchido
2. **Loading**: Spinner animado no canto direito do campo
3. **Sucesso**: Campos preenchidos automaticamente (sem mensagem)
4. **Erro**: Mensagem de erro abaixo do campo em vermelho

### Acessibilidade

- Labels descritivos
- Mensagens de erro claras
- Indicador visual de loading
- Campos editáveis após preenchimento automático

## 🧪 Testando

### Casos de Teste

1. **CEP Válido**: Digite `01310-100` (Av. Paulista)
2. **CEP Inválido**: Digite `00000-000`
3. **CEP Parcial**: Digite apenas `01310` (não deve buscar)
4. **Formatação**: Digite `01310100` (deve formatar para `01310-100`)

## 🔄 Reutilização

Esta funcionalidade está implementada em dois lugares:

1. **Perfil do Usuário**: Modal de adicionar/editar endereço
2. **Checkout**: Formulário de endereço de entrega

Ambos utilizam o mesmo hook `useCepLookup` e as mesmas funções utilitárias, garantindo consistência e manutenibilidade.

## 📝 Melhorias Futuras

- [ ] Adicionar debounce para evitar requisições excessivas
- [ ] Cache de CEPs já buscados
- [ ] Suporte offline com CEPs salvos localmente
- [ ] Integração com outras APIs de CEP como backup
- [ ] Animação ao preencher os campos
- [ ] Toast de sucesso ao encontrar o CEP
