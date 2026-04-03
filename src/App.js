import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from "recharts";
import { Plus } from "lucide-react";
import "./App.css";

const initialData = [
  { id: 1, date: "2026-03-01", amount: 5000, category: "Salary", type: "income" },
  { id: 2, date: "2026-03-02", amount: 1200, category: "Food", type: "expense" },
  { id: 3, date: "2026-03-03", amount: 800, category: "Transport", type: "expense" },
  { id: 4, date: "2026-03-04", amount: 2000, category: "Freelance", type: "income" }
];

const COLORS = ["#4ade80", "#f87171", "#60a5fa", "#facc15"];
const CARD_STYLES = [
  "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
  "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
  "linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)"
];

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem("data")) || initialData;
  });

  const [role, setRole] = useState("viewer");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(transactions));
  }, [transactions]);

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expenses;

  const filtered = transactions.filter((t) =>
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const categoryData = Object.values(
    transactions.reduce((acc, t) => {
      acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
      acc[t.category].value += t.amount;
      return acc;
    }, {})
  );

  const highestCategory = [...categoryData].sort((a, b) => b.value - a.value)[0];

  const addTransaction = () => {
    const newTx = {
      id: Date.now(),
      date: "2026-03-10",
      amount: 1000,
      category: "Misc",
      type: "expense"
    };
    setTransactions([...transactions, newTx]);
  };

  return (
    <div className="app-shell">
      <div className="dashboard-container dashboard-entrance">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">Personal Finance</span>
            <h1 className="dashboard-title">Finance Dashboard</h1>
            <p className="hero-text">
              A centered, professional dashboard with polished cards, vivid colours, and gentle animations.
            </p>
          </div>
          <div className="header-actions">
            <div className="role-pill">
              Role: <strong>{role}</strong>
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="role-select"
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </header>

        <section className="stats-grid">
          {[
            { title: "Balance", value: `₹${balance}`, gradient: CARD_STYLES[0] },
            { title: "Income", value: `₹${income}`, gradient: CARD_STYLES[1] },
            { title: "Expenses", value: `₹${expenses}`, gradient: CARD_STYLES[2] }
          ].map((card) => (
            <Card key={card.title} {...card} />
          ))}
        </section>

        <section className="charts-grid">
          <div className="panel chart-panel">
            <div className="panel-title">
              <div>
                <h2>Balance Trend</h2>
                <p>Current cash flow movement in a polished line chart.</p>
              </div>
              <span className="badge badge-blue">Live</span>
            </div>
            <LineChart width={360} height={240} data={transactions}>
              <XAxis dataKey="date" stroke="#cbd5e1" tick={{ fontSize: 12 }} />
              <YAxis stroke="#cbd5e1" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} itemStyle={{ color: '#ffffff' }} />
              <Line type="monotone" dataKey="amount" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, stroke: '#38bdf8', strokeWidth: 2, fill: '#020617' }} />
            </LineChart>
          </div>

          <div className="panel chart-panel">
            <div className="panel-title">
              <div>
                <h2>Spending Breakdown</h2>
                <p>Color-coded category totals for fast decisions.</p>
              </div>
              <span className="badge badge-pink">Insight</span>
            </div>
            <PieChart width={360} height={240}>
              <Pie data={categoryData} dataKey="value" innerRadius={70} outerRadius={100} paddingAngle={4} label>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </section>

        <section className="panel transaction-panel">
          <div className="panel-title panel-title-tight">
            <h2>Transactions</h2>
            {role === "admin" && (
              <button className="action-button" onClick={addTransaction}>
                <Plus size={16} /> Add Transaction
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td>{t.category}</td>
                    <td className="amount-cell">₹{t.amount}</td>
                    <td className={t.type === "income" ? "type-income" : "type-expense"}>{t.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel insights-panel">
          <h2>Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <p className="insight-label">Highest Spending Category</p>
              <p className="insight-value">{highestCategory?.name || "N/A"}</p>
            </div>
            <div className="insight-card">
              <p className="insight-label">Total Transactions</p>
              <p className="insight-value">{transactions.length}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Card({ title, value, gradient }) {
  return (
    <div className="stat-card card-float" style={{ backgroundImage: gradient }}>
      <p className="stat-title">{title}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}
