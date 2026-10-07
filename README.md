# MyControl · Gestão pessoal

Aplicação web responsiva para organizar dinheiro, hábitos, anotações e eventos em um único espaço pessoal.

## Stack

- React + TypeScript + Vite
- React Router
- Tailwind CSS v4 (integração Vite disponível)
- React Toastify
- Recharts
- Lucide React

## Executar localmente

```bash
npm install
npm run dev
```

Também estão disponíveis `npm run build`, `npm run lint` e `npm run preview`.

## Funcionalidades

- Dashboard com saldo, fluxo da semana, rotina e lançamentos recentes.
- Finanças com receitas, gastos e investimentos, cálculo de sobra, filtros, exclusão e gráfico de distribuição.
- Hábitos com criação e checklist mensal navegável por mês, marcação diária e progresso.
- Agenda de anotações com data, busca e exclusão.
- Calendário de eventos com data, horário opcional, descrição e próximos compromissos.
- Treinos com planos de exercícios, séries, repetições, dias da semana, edição, exclusão e registro de sessões.
- Gráfico de evolução mensal baseado nas sessões de treino registradas.
- Layout adaptado para desktop e celular, com menu lateral responsivo e feedback por toast.

## Persistência e backend

O frontend autentica no backend e sincroniza as coleções por conta. Ao criar uma conta, os dados existentes nas chaves do `localStorage` são importados para ela antes de liberar o acesso. No login, o cache local é exibido primeiro e depois atualizado pelos dados da conta; alterações locais marcadas como pendentes são enviadas ao backend. O backend persiste o documento JSONB por usuário na tabela `USER_APP_DATA`.

O endpoint da API é configurado pela variável `VITE_API_URL` no arquivo `.env`, com `http://localhost:300` como padrão. As chamadas do frontend e o proxy do Vite usam essa configuração. Para apontar para outra instalação do backend, altere o valor da variável. No backend, configure `URLFRONT` com a origem do frontend (por exemplo, `http://localhost:5173`) e as variáveis `DATABASE_CONNECT` e `SECRET`, conforme a documentação do backend.

Os lembretes atuais aparecem dentro da aplicação por meio da lista de próximos eventos. Notificações do navegador em segundo plano ainda não fazem parte desta versão.
# Gestao-Pessoal