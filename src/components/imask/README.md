# Inputs com Máscara

Este diretório contém componentes reutilizáveis de inputs com máscara, implementados em **React** utilizando a biblioteca [react-imask](https://imask.js.org/).

Cada componente aplica automaticamente uma máscara de formatação para campos comuns em formulários brasileiros, como CPF, CNPJ, CEP e telefones.

## 📂 Componentes Disponíveis

### 1. `TelefoneMaskInput`
- **Máscara:** `(00) 0000-0000`
- **Uso:** Números de telefone fixo.
- [Código fonte](./TelefoneMaskInput.tsx)

### 2. `CelularMaskInput`
- **Máscara:** `(00) 0 0000-0000`
- **Uso:** Números de celular.
- [Código fonte](./CelularMaskInput.tsx)

### 3. `CepMaskInput`
- **Máscara:** `00000-000`
- **Uso:** CEP (Código de Endereçamento Postal).
- [Código fonte](./CepMaskInput.tsx)

### 4. `CnpjMaskInput`
- **Máscara:** `00.000.000/0000-00`
- **Uso:** Cadastro Nacional da Pessoa Jurídica.
- [Código fonte](./CnpjMaskInput.tsx)

### 5. `CpfMaskInput`
- **Máscara:** `000.000.000-00`
- **Uso:** Cadastro de Pessoa Física.
- [Código fonte](./CpfMaskInput.tsx)

---

## 🛠️ Propriedades Comuns

Todos os inputs aceitam as seguintes props:

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `name` | `string` | Nome do campo (usado em formulários controlados). |
| `onChange` | `(event: { target: { name: string; value: string } }) => void` | Função chamada sempre que o valor é alterado. Retorna o valor **sem máscara**. |
| `ref` | `React.Ref<HTMLInputElement>` | Referência para o input (suporta `forwardRef`). |

---

## 🚀 Exemplo de Uso

```tsx
import React, { useState } from "react";
import CpfMaskInput from "@/components/inputs/CpfMaskInput";
import TelefoneMaskInput from "@/components/inputs/TelefoneMaskInput";

export default function FormExample() {
  const [formData, setFormData] = useState({ cpf: "", telefone: "" });

  const handleChange = (event: { target: { name: string; value: string } }) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form>
      <label>
        CPF:
        <CpfMaskInput name="cpf" onChange={handleChange} />
      </label>

      <label>
        Telefone:
        <TelefoneMaskInput name="telefone" onChange={handleChange} />
      </label>
    </form>
  );
}
```

---

## 📦 Dependências

- [react](https://react.dev/)  
- [react-imask](https://imask.js.org/)

Instalação:

```bash
npm install react-imask
# ou
yarn add react-imask
```

---

## 📌 Observações
- Todos os valores retornados pelo `onChange` são **não formatados** (sem pontos, traços ou parênteses).  
- Ideal para integrar com bibliotecas de formulários como **React Hook Form** ou **Formik**.  
