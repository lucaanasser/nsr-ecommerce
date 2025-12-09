Aqui está **exatamente o conteúdo do PDF convertido para Markdown (.md)** — **sem alterar nada**, apenas estruturado em Markdown para você copiar:

---

# Erro 40002 – chave pública e criptografia

O código de erro **40002 (invalid_parameter)** indica que algum valor enviado não está no formato esperado. Isso geralmente significa que um campo da requisição está incorreto. No caso de cartões criptografados, verifique especialmente a **chave pública** e a **estrutura do JSON de pagamento**.

---

## Chave pública (sandbox)

Para criptografar o cartão, é necessário usar uma **chave pública do ambiente correto**.
No Sandbox do PagBank você deve gerar ou consultar uma chave pública do tipo **card** usando a API. Por exemplo:

### Criar nova chave (sandbox)

```
POST https://sandbox.api.pagseguro.com/public-keys
Content-Type: application/json

{"type": "card"}
```

A resposta terá a chave no campo `key`.

### Consultar chave existente

```
GET https://sandbox.api.pagseguro.com/public-keys/card
```

Use sempre o **token de acesso (Bearer token)** no cabeçalho `Authorization`.

⚠️ Não use autenticação AWS (Signature V4). O PagBank usa OAuth/Bearer.

---

## Formato do `expYear`

O SDK do PagBank exige o **ano completo com 4 dígitos**.

Exemplo correto:

```json
"expYear": "2030"
```

Exemplo incorreto:

```json
"expYear": "30"
```

Se você usar apenas dois dígitos, receberá erros como `INVALID_EXPIRATION_YEAR`.

Concatenar `"20" + expYear` funciona **desde que gere 4 dígitos válidos**.

---

## Validação do criptograma

Não existe endpoint dedicado apenas para validar o criptograma antes do pagamento.

As opções são:

### ✔️ Validação no front-end via SDK

O método:

```js
PagSeguro.encryptCard()
```

retorna:

* `hasErrors: false` → criptograma OK
* `encryptedCard` → string gerada

Se `hasErrors = true`, analise o campo `errors`.

### ✔️ Validação via API `/orders`

Envie o criptograma em um pedido normal.

Se houver problema:

* chave pública incorreta → erro 40002
* criptograma malformado → erro detalhado
* criptograma já usado → erro `"ENCRYPTED CARD ALREADY USED"`

### ⚠️ Sobre o endpoint `/tokens/cards`

Ele aceita:

```json
{"encrypted": "<criptograma>"}
```

Mas muitos usuários relatam **instabilidade (erro 500)** no sandbox.
Logo, não é a opção mais confiável.

---

## Reutilização de criptograma

O criptograma é **de uso único**.

Se você tentar reutilizar um criptograma, recebe:

```
40002 - ENCRYPTED CARD ALREADY USED
```

Você DEVE chamar `encryptCard()` novamente a cada tentativa de pagamento.

---

## Cartões de teste (sandbox)

O PagBank fornece cartões fictícios oficiais.

### VISA — sucesso

* Número: **4539 6206 5992 2097**
* CVV: 123
* Validade: 12/2026
  ➡️ Autoriza normalmente no sandbox

### VISA — negado

* Número: **4929 2918 9838 0766**
* CVV: 123
* Validade: 12/2026
  ➡️ Retorna `DECLINED`

### Mastercard — sucesso

* Número: **5240 0829 7562 2454**
* CVV: 123
* Validade: 12/2026

### Amex — negado

* Número: **3458 1769 0311 361**
* CVV: 1234
* Validade: 12/2026

⚠️ Use sempre **sandbox.api.pagseguro.com**
⚠️ Não use cartões reais no sandbox.

---

## Estrutura correta do payload

Um erro comum é colocar `holder` **dentro** de `card`.
A API espera assim:

```json
"payment_method": {
  "type": "CREDIT_CARD",
  "installments": 1,
  "capture": true,
  "card": {
    "encrypted": "<criptograma>",
    "store": false
  },
  "holder": {
    "name": "Nome do Portador",
    "tax_id": "CPFsemPontos"
  }
}
```

Observe:

* `card` e `holder` são **irmãos** na estrutura
* `holder` **não** deve estar dentro de `card`

Isso sozinho resolve muitos erros 40002.

---

## Erro genérico 40002 e como depurar

O erro genérico:

```
40002 - invalid_parameter
```

significa apenas que **algum parâmetro está inválido**.

### Notas importantes:

* Se faltar um parâmetro → pode resultar em 40001 ou 40002
* Se o PagBank identificar o campo → a resposta inclui `parameter_name`
* Caso contrário, você recebe apenas um erro genérico

Exemplo quando reconhece o parâmetro:

```
parameter_name: "charges[0].payment_method.card.encrypted"
error: "ENCRYPTED CARD ALREADY USED"
```

### Não existe log detalhado no Sandbox

O que vem na resposta é **tudo o que você recebe**.
Para diagnósticos avançados, só suporte PagBank.

---

## Checklist para evitar erro 40002

* ✔️ Usar chave pública **SANDOX**, não produção
* ✔️ Estrutura correta (`holder` fora de `card`)
* ✔️ `expYear` com **4 dígitos**
* ✔️ Telefone válido: `country`, `area`, `number`
* ✔️ `postal_code` com 8 dígitos
* ✔️ CPF válido, mesmo sendo fictício
* ✔️ Criptograma **novo a cada tentativa**
* ✔️ `Content-Type: application/json`
* ✔️ `Authorization: Bearer <token>`

---

Se quiser, posso gerar **um `.md` para download** ou **um `.md` completo com código formatado e exemplos adicionais**.
