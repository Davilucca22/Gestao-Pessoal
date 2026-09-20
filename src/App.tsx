import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  LayoutDashboard,
  Menu,
  NotebookPen,
  Pencil,
  Plus,
  Search,
  Target,
  Trash2,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { readStorage, STORAGE_KEYS, writeStorage } from "./lib/storage";
import type {
  CalendarEvent,
  Habit,
  Note,
  Transaction,
  TransactionType,
} from "./types";

const today = new Date().toISOString().slice(0, 10);
const uid = () => crypto.randomUUID();
const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dateLabel = (value: string) =>
  new Date(`${value}T12:00:00`)
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    .replace(".", "");
const initialTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    title: "Salário mensal",
    category: "Trabalho",
    amount: 6800,
    date: today,
  },
  {
    id: "2",
    type: "expense",
    title: "Aluguel",
    category: "Casa",
    amount: 1800,
    date: today,
  },
  {
    id: "3",
    type: "expense",
    title: "Mercado",
    category: "Alimentação",
    amount: 420,
    date: today,
  },
  {
    id: "4",
    type: "investment",
    title: "Fundo de emergência",
    category: "Investimentos",
    amount: 500,
    date: today,
  },
];

type Icon = typeof Wallet;
function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
function Shell() {
  const [transactions, setTransactions] = useState(() =>
    readStorage(STORAGE_KEYS.transactions, initialTransactions),
  );
  const [habits, setHabits] = useState<Habit[]>(() =>
    readStorage(STORAGE_KEYS.habits, [
      { id: "h1", name: "Ler 20 minutos", color: "#c5ff4a", checks: {} },
      { id: "h2", name: "Beber 2L de água", color: "#68e0d0", checks: {} },
    ]),
  );
  const [notes, setNotes] = useState<Note[]>(() =>
    readStorage(STORAGE_KEYS.notes, []),
  );
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    readStorage(STORAGE_KEYS.events, []),
  );
  const [open, setOpen] = useState(false);
  useEffect(
    () => writeStorage(STORAGE_KEYS.transactions, transactions),
    [transactions],
  );
  useEffect(() => writeStorage(STORAGE_KEYS.habits, habits), [habits]);
  useEffect(() => writeStorage(STORAGE_KEYS.notes, notes), [notes]);
  useEffect(() => writeStorage(STORAGE_KEYS.events, events), [events]);
  const links: [string, string, Icon][] = [
    ["/", "Visão geral", LayoutDashboard],
    ["/finance", "Finanças", Wallet],
    ["/habits", "Hábitos", Target],
    ["/notes", "Agenda", NotebookPen],
    ["/calendar", "Calendário", CalendarDays],
  ];
  return (
    <>
      <div className="app-shell">
        <aside className={open ? "sidebar open" : "sidebar"}>
          <div className="brand">
            <span className="brand-mark">◒</span>nexo
            <span className="accent">.</span>
          </div>
          <p className="eyebrow sidebar-eyebrow">Seu espaço pessoal</p>
          <nav>
            {links.map(([to, label, IconComponent]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                <IconComponent size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-foot">
            <div className="profile-dot">DL</div>
            <div>
              <strong>Davi Lucas</strong>
              <small>Modo local</small>
            </div>
          </div>
        </aside>
        {open && (
          <button
            className="scrim"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          />
        )}
        <main className="main-content">
          <header className="topbar">
            <button
              className="icon-button mobile-menu"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
            <div>
              <span className="breadcrumb">NEXO / </span>
              <Title />
            </div>
            <div className="top-actions">
              <span className="today-label">
                {new Date().toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              <div className="avatar">DL</div>
            </div>
          </header>
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  transactions={transactions}
                  habits={habits}
                  events={events}
                  notes={notes}
                />
              }
            />
            <Route
              path="/finance"
              element={
                <Finance data={transactions} setData={setTransactions} />
              }
            />
            <Route
              path="/habits"
              element={<Habits data={habits} setData={setHabits} />}
            />
            <Route
              path="/notes"
              element={<Notes data={notes} setData={setNotes} />}
            />
            <Route
              path="/calendar"
              element={<Calendar data={events} setData={setEvents} />}
            />
          </Routes>
        </main>
      </div>
      <ToastContainer theme="dark" position="bottom-right" autoClose={2200} />
    </>
  );
}
function Title() {
  const path = useLocation().pathname;
  return (
    <strong className="page-title">
      {{
        "/": "Visão geral",
        "/finance": "Finanças",
        "/habits": "Hábitos",
        "/notes": "Agenda",
        "/calendar": "Calendário",
      }[path] || "Nexo"}
    </strong>
  );
}
function Intro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-intro">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`card ${className}`}>{children}</section>;
}
function Stat({
  label,
  value,
  detail,
  tone = "lime",
  icon: IconComponent,
}: {
  label: string;
  value: string;
  detail: string;
  tone?: string;
  icon: Icon;
}) {
  return (
    <Card className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <IconComponent size={19} />
      </div>
      <p className="muted">{label}</p>
      <strong className="stat-value">{value}</strong>
      <span className="stat-detail">{detail}</span>
    </Card>
  );
}
function Dashboard({
  transactions,
  habits,
  events,
  notes,
}: {
  transactions: Transaction[];
  habits: Habit[];
  events: CalendarEvent[];
  notes: Note[];
}) {
  const income = sum(transactions, "income");
  const expense = sum(transactions, "expense");
  const investment = sum(transactions, "investment");
  const chart = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(
    (day, i) => ({
      day,
      entradas: [680, 920, 420, 1100, 760, 300, 0][i],
      saidas: [260, 390, 310, 420, 300, 230, 0][i],
    }),
  );
  return (
    <Page>
      <Intro
        eyebrow="Segunda, 20 de setembro"
        title="Bom dia, Davi."
        description="Aqui está um retrato do seu momento."
        action={
          <button
            className="button primary"
            onClick={() =>
              toast.info("Escolha uma área no menu para adicionar um registro.")
            }
          >
            <Plus size={17} /> Novo registro
          </button>
        }
      />
      <div className="stats-grid">
        <Stat
          label="Saldo disponível"
          value={money(income - expense - investment)}
          detail="↑ 12,4% vs. mês passado"
          icon={CircleDollarSign}
        />
        <Stat
          label="Entradas"
          value={money(income)}
          detail="Receitas deste mês"
          tone="teal"
          icon={TrendingUp}
        />
        <Stat
          label="Hábitos em dia"
          value={`${habits.length} ativos`}
          detail="Continue nesse ritmo"
          tone="purple"
          icon={Target}
        />
        <Stat
          label="Próximo evento"
          value={events[0] ? dateLabel(events[0].date) : "Nenhum"}
          detail={events[0]?.title || "Sua agenda está livre"}
          tone="orange"
          icon={CalendarDays}
        />
      </div>
      <div className="dashboard-grid">
        <Card>
          <Heading eyebrow="Movimentação" title="Fluxo da semana" />
          <div className="legend">
            <span>
              <i className="dot lime" />
              Entradas
            </span>
            <span>
              <i className="dot teal" />
              Saídas
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chart}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c5ff4a" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#c5ff4a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#242a2b" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6d7778", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#171c1d",
                  border: "1px solid #30383a",
                }}
              />
              <Area
                type="monotone"
                dataKey="entradas"
                stroke="#c5ff4a"
                fill="url(#fill)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="saidas"
                stroke="#68e0d0"
                fill="none"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <Heading eyebrow="Acompanhe" title="Atalhos rápidos" />
          <Quick
            to="/finance"
            icon={Wallet}
            title="Adicionar gasto"
            detail="Registre uma saída"
          />
          <Quick
            to="/habits"
            icon={Target}
            title="Marcar hábito"
            detail="Mantenha a sequência"
          />
          <Quick
            to="/notes"
            icon={NotebookPen}
            title="Nova anotação"
            detail="Tire da cabeça"
          />
        </Card>
      </div>
      <div className="dashboard-grid lower">
        <Card>
          <Heading eyebrow="Visão recente" title="Últimos lançamentos" />
          <Transactions data={transactions.slice(-4).reverse()} />
        </Card>
        <Card>
          <Heading eyebrow="Hoje" title="Rotina" />
          {habits.slice(0, 3).map((h) => (
            <div className="routine-row" key={h.id}>
              <span className="routine-check" style={{ borderColor: h.color }}>
                <Check size={14} />
              </span>
              <span>{h.name}</span>
              <span className="routine-percent">Ativo</span>
            </div>
          ))}
          {!habits.length && <Empty text="Adicione seu primeiro hábito" />}
        </Card>
      </div>
      <div className="mini-foot">
        {notes.length} anotações · {events.length} eventos salvos localmente
      </div>
    </Page>
  );
}
function Page({ children }: { children: React.ReactNode }) {
  return <div className="page">{children}</div>;
}
function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="card-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
    </div>
  );
}
function Quick({
  to,
  icon: IconComponent,
  title,
  detail,
}: {
  to: string;
  icon: Icon;
  title: string;
  detail: string;
}) {
  return (
    <NavLink className="quick-link" to={to}>
      <span className="quick-icon">
        <IconComponent size={18} />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <ChevronRight size={16} />
    </NavLink>
  );
}
function sum(data: Transaction[], type: TransactionType) {
  return data
    .filter((item) => item.type === type)
    .reduce((total, item) => total + item.amount, 0);
}
function Transactions({
  data,
  onDelete,
}: {
  data: Transaction[];
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="transaction-list">
      {data.map((item) => (
        <div className="transaction-row" key={item.id}>
          <span className={`transaction-icon ${item.type}`}>
            {item.type === "income"
              ? "↗"
              : item.type === "expense"
                ? "↘"
                : "◆"}
          </span>
          <span className="transaction-name">
            <strong>{item.title}</strong>
            <small>
              {item.category} · {dateLabel(item.date)}
            </small>
          </span>
          <strong className={item.type === "income" ? "positive" : ""}>
            {item.type === "income" ? "+" : "-"}
            {money(item.amount)}
          </strong>
          {onDelete && (
            <button
              className="delete-button"
              onClick={() => onDelete(item.id)}
              aria-label="Excluir"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return (
    <div className="empty">
      <ClipboardList size={25} />
      <span>{text}</span>
    </div>
  );
}
function Modal({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-heading">
          <h2>{title}</h2>
          <button className="icon-button" onClick={close} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Finance({
  data,
  setData,
}: {
  data: Transaction[];
  setData: React.Dispatch<React.SetStateAction<Transaction[]>>;
}) {
  const [type, setType] = useState<TransactionType>("expense");
  const [modal, setModal] = useState(false);
  const add = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setData((items) => [
      ...items,
      {
        id: uid(),
        type,
        title: String(form.get("title")),
        category: String(form.get("category")),
        amount: Number(form.get("amount")),
        date: String(form.get("date")),
      },
    ]);
    setModal(false);
    toast.success("Lançamento adicionado");
  };
  return (
    <Page>
      <Intro
        eyebrow="Controle financeiro"
        title="Dinheiro em ordem."
        description="Acompanhe o que entra, sai e cresce."
        action={
          <button className="button primary" onClick={() => setModal(true)}>
            <Plus size={17} /> Adicionar lançamento
          </button>
        }
      />
      <div className="stats-grid">
        <Stat
          label="Sobra do mês"
          value={money(
            sum(data, "income") -
              sum(data, "expense") -
              sum(data, "investment"),
          )}
          detail="Depois de investimentos"
          icon={CircleDollarSign}
        />
        <Stat
          label="Receitas"
          value={money(sum(data, "income"))}
          detail="Entradas"
          tone="teal"
          icon={TrendingUp}
        />
        <Stat
          label="Gastos"
          value={money(sum(data, "expense"))}
          detail="Saídas"
          tone="orange"
          icon={Wallet}
        />
        <Stat
          label="Investimentos"
          value={money(sum(data, "investment"))}
          detail="Construindo futuro"
          tone="purple"
          icon={Target}
        />
      </div>
      <div className="finance-layout">
        <Card>
          <Heading eyebrow="Histórico" title="Todos os lançamentos" />
          <div className="filter-tabs">
            {[
              ["expense", "Gastos"],
              ["income", "Entradas"],
              ["investment", "Investimentos"],
            ].map(([value, label]) => (
              <button
                className={type === value ? "selected" : ""}
                key={value}
                onClick={() => setType(value as TransactionType)}
              >
                {label}
              </button>
            ))}
          </div>
          <Transactions
            data={data
              .filter((item) => item.type === type)
              .slice()
              .reverse()}
            onDelete={(id) => {
              setData((items) => items.filter((item) => item.id !== id));
              toast.info("Lançamento removido");
            }}
          />
        </Card>
        <Card>
          <Heading eyebrow="Distribuição" title="Para onde vai?" />
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={[
                  { name: "Gastos", value: sum(data, "expense") },
                  { name: "Investimentos", value: sum(data, "investment") },
                  {
                    name: "Livre",
                    value: Math.max(
                      sum(data, "income") -
                        sum(data, "expense") -
                        sum(data, "investment"),
                      0,
                    ),
                  },
                ]}
                dataKey="value"
                innerRadius={65}
                outerRadius={90}
              >
                {["#ff9f5a", "#b59cff", "#c5ff4a"].map((color) => (
                  <Cell key={color} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      {modal && (
        <Modal title="Novo lançamento" close={() => setModal(false)}>
          <form onSubmit={add} className="form-grid">
            <label>
              Tipo
              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value as TransactionType)
                }
              >
                <option value="expense">Gasto</option>
                <option value="income">Entrada</option>
                <option value="investment">Investimento</option>
              </select>
            </label>
            <label>
              Descrição
              <input name="title" required placeholder="Ex: Mercado" />
            </label>
            <label>
              Categoria
              <input name="category" required placeholder="Ex: Casa" />
            </label>
            <label>
              Valor
              <input name="amount" required type="number" min="0" step=".01" />
            </label>
            <label>
              Data
              <input name="date" required type="date" defaultValue={today} />
            </label>
            <button className="button primary full" type="submit">
              Salvar lançamento
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}
function Habits({
  data,
  setData,
}: {
  data: Habit[];
  setData: React.Dispatch<React.SetStateAction<Habit[]>>;
}) {
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [cursor, setCursor] = useState(new Date());
  const days = new Date(
    cursor.getFullYear(),
    cursor.getMonth() + 1,
    0,
  ).getDate();
  const prefix = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
  const toggle = (id: string, day: number) =>
    setData((items) =>
      items.map((h) =>
        h.id === id
          ? {
              ...h,
              checks: {
                ...h.checks,
                [`${prefix}-${String(day).padStart(2, "0")}`]:
                  !h.checks[`${prefix}-${String(day).padStart(2, "0")}`],
              },
            }
          : h,
      ),
    );
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name"));
    if (editing) {
      setData((items) =>
        items.map((item) => (item.id === editing.id ? { ...item, name } : item)),
      );
      toast.success("Hábito atualizado");
    } else {
      setData((items) => [
        ...items,
        { id: uid(), name, color: "#c5ff4a", checks: {} },
      ]);
      toast.success("Hábito criado");
    }
    setEditing(null);
    setModal(false);
  };
  const editHabit = (habit: Habit) => {
    setEditing(habit);
    setModal(true);
  };
  const deleteHabit = (habit: Habit) => {
    if (!window.confirm(`Excluir o hábito "${habit.name}"?`)) return;
    setData((items) => items.filter((item) => item.id !== habit.id));
    toast.info("Hábito excluído");
  };
  return (
    <Page>
      <Intro
        eyebrow="Consistência diária"
        title="Pequenos passos."
        description="A constância transforma intenção em resultado."
        action={
          <button
            className="button primary"
            onClick={() => {
              setEditing(null);
              setModal(true);
            }}
          >
            <Plus size={17} /> Novo hábito
          </button>
        }
      />
      <div className="month-switcher">
        <button
          className="icon-button"
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
          }
        >
          <ChevronLeft size={18} />
        </button>
        <strong>
          {cursor.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </strong>
        <button
          className="icon-button"
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
          }
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <Card className="habits-card">
        <div className="habit-header">
          <span>Hábito</span>
          {Array.from({ length: days }, (_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
          <span>Progresso</span>
          <span>Ações</span>
        </div>
        {data.map((h) => (
          <div className="habit-row" key={h.id}>
            <strong>
              <i style={{ background: h.color }} />
              {h.name}
            </strong>
            {Array.from({ length: days }, (_, i) => {
              const key = `${prefix}-${String(i + 1).padStart(2, "0")}`;
              return (
                <button
                  key={i}
                  className={h.checks[key] ? "day-check done" : "day-check"}
                  onClick={() => toggle(h.id, i + 1)}
                  aria-label={`${h.name}, dia ${i + 1}`}
                >
                  {h.checks[key] && <Check size={12} />}
                </button>
              );
            })}
            <span className="habit-progress">
              {Math.round(
                (Object.entries(h.checks).filter(
                  ([key, value]) => key.startsWith(prefix) && value,
                ).length /
                  days) *
                  100,
              )}
              %
            </span>
            <span className="habit-actions">
              <button
                className="icon-button"
                onClick={() => editHabit(h)}
                aria-label={`Editar hábito ${h.name}`}
                title="Editar hábito"
              >
                <Pencil size={14} />
              </button>
              <button
                className="delete-button"
                onClick={() => deleteHabit(h)}
                aria-label={`Excluir hábito ${h.name}`}
                title="Excluir hábito"
              >
                <Trash2 size={14} />
              </button>
            </span>
          </div>
        ))}
        {!data.length && <Empty text="Nenhum hábito cadastrado" />}
      </Card>
      {modal && (
        <Modal
          title={editing ? "Editar hábito" : "Novo hábito"}
          close={() => {
            setEditing(null);
            setModal(false);
          }}
        >
          <form onSubmit={save} className="form-grid">
            <label className="wide">
              Nome do hábito
              <input
                name="name"
                required
                placeholder="Ex: Meditar 10 minutos"
                defaultValue={editing?.name}
              />
            </label>
            <button className="button primary full" type="submit">
              {editing ? "Salvar alterações" : "Criar hábito"}
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}
function Notes({
  data,
  setData,
}: {
  data: Note[];
  setData: React.Dispatch<React.SetStateAction<Note[]>>;
}) {
  const [modal, setModal] = useState(false);
  const [query, setQuery] = useState("");
  const add = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setData((items) => [
      {
        id: uid(),
        title: String(form.get("title")),
        content: String(form.get("content")),
        date: String(form.get("date")),
      },
      ...items,
    ]);
    setModal(false);
    toast.success("Anotação salva");
  };
  const filtered = data.filter((note) =>
    `${note.title} ${note.content}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Page>
      <Intro
        eyebrow="Pensamentos e planos"
        title="Sua agenda."
        description="Um lugar para tudo que merece atenção."
        action={
          <button className="button primary" onClick={() => setModal(true)}>
            <Plus size={17} /> Nova anotação
          </button>
        }
      />
      <div className="search-field">
        <Search size={17} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar anotações..."
        />
      </div>
      <div className="notes-grid">
        {filtered.map((note) => (
          <Card className="note-card" key={note.id}>
            <div className="note-top">
              <span className="note-date">{dateLabel(note.date)}</span>
              <button
                className="delete-button"
                onClick={() =>
                  setData((items) =>
                    items.filter((item) => item.id !== note.id),
                  )
                }
                aria-label="Excluir"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </Card>
        ))}
        {!filtered.length && (
          <Empty text={query ? "Nada encontrado" : "Sua agenda está vazia"} />
        )}
      </div>
      {modal && (
        <Modal title="Nova anotação" close={() => setModal(false)}>
          <form onSubmit={add} className="form-grid">
            <label className="wide">
              Título
              <input name="title" required />
            </label>
            <label className="wide">
              Anotação
              <textarea name="content" required rows={5} />
            </label>
            <label>
              Data
              <input name="date" required type="date" defaultValue={today} />
            </label>
            <button className="button primary full" type="submit">
              Salvar anotação
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}
function Calendar({
  data,
  setData,
}: {
  data: CalendarEvent[];
  setData: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}) {
  const [modal, setModal] = useState(false);
  const add = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setData((items) =>
      [
        ...items,
        {
          id: uid(),
          title: String(form.get("title")),
          date: String(form.get("date")),
          time: String(form.get("time")),
          description: String(form.get("description")),
          remind: true,
        },
      ].sort((a, b) => a.date.localeCompare(b.date)),
    );
    setModal(false);
    toast.success("Evento adicionado");
  };
  return (
    <Page>
      <Intro
        eyebrow="Tempo bem usado"
        title="Seu calendário."
        description="Veja o que vem pela frente e não deixe passar."
        action={
          <button className="button primary" onClick={() => setModal(true)}>
            <Plus size={17} /> Novo evento
          </button>
        }
      />
      <div className="calendar-layout">
        <Card>
          <Heading eyebrow="Próximos compromissos" title="Agenda de eventos" />
          {data.map((event) => (
            <div className="event-row" key={event.id}>
              <div className="event-date">
                <strong>{new Date(`${event.date}T12:00:00`).getDate()}</strong>
                <span>{dateLabel(event.date).slice(3)}</span>
              </div>
              <div>
                <strong>{event.title}</strong>
                <p>
                  {event.time || "Dia inteiro"}{" "}
                  {event.description && `· ${event.description}`}
                </p>
              </div>
              <button
                className="delete-button"
                onClick={() =>
                  setData((items) =>
                    items.filter((item) => item.id !== event.id),
                  )
                }
                aria-label="Excluir"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {!data.length && <Empty text="Nenhum evento próximo" />}
        </Card>
        <Card className="calendar-tip">
          <CalendarDays size={25} />
          <h2>Planeje seu ritmo</h2>
          <p>Adicione compromissos e encontre espaço para o que importa.</p>
          <button className="button secondary" onClick={() => setModal(true)}>
            Adicionar evento
          </button>
        </Card>
      </div>
      {modal && (
        <Modal title="Novo evento" close={() => setModal(false)}>
          <form onSubmit={add} className="form-grid">
            <label className="wide">
              Título
              <input name="title" required />
            </label>
            <label>
              Data
              <input name="date" required type="date" defaultValue={today} />
            </label>
            <label>
              Horário
              <input name="time" type="time" />
            </label>
            <label className="wide">
              Descrição
              <input name="description" />
            </label>
            <button className="button primary full" type="submit">
              Salvar evento
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}
export default App;
