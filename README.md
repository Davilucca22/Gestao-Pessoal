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

O frontend autentica no backend e sincroniza as coleções por conta. Os dados já existentes nas chaves do `localStorage` são importados automaticamente no primeiro login ou cadastro; enquanto sincroniza, o cache local é mantido. O backend persiste o documento JSONB por usuário na tabela `USER_APP_DATA`.

Em desenvolvimento, o Vite encaminha `/api` para `http://localhost:3000`. Para apontar diretamente a outra instalação do backend, configure `VITE_API_URL` com a URL base da API. No backend, configure `URLFRONT` com a origem do frontend (por exemplo, `http://localhost:5173`) e as variáveis `DATABASE_CONNECT` e `SECRET`, conforme a documentação do backend.

Os lembretes atuais aparecem dentro da aplicação por meio da lista de próximos eventos. Notificações do navegador em segundo plano ainda não fazem parte desta versão.
# Gestao-Pessoal