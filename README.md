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

## Persistência local

Os dados são salvos no `localStorage` do navegador e permanecem disponíveis neste dispositivo, sem login, cadastro ou comunicação com backend. As coleções de finanças, hábitos, anotações, eventos e treinos são gravadas localmente conforme são alteradas. Os dados existentes nas chaves locais da aplicação continuam sendo carregados.

Os lembretes atuais aparecem dentro da aplicação por meio da lista de próximos eventos. Notificações do navegador em segundo plano ainda não fazem parte desta versão.
# Gestao-Pessoal