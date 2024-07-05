const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/budget', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('MongoDB connection error:', err));

const incomeSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    date: { type: Date, default: Date.now }
});

const expenseSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    date: { type: Date, default: Date.now }
});

const Income = mongoose.model('Income', incomeSchema);
const Expense = mongoose.model('Expense', expenseSchema);

// Маршруты для доходов
app.get('/incomes', async (req, res) => {
    try {
        const incomes = await Income.find();
        res.json(incomes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/incomes', async (req, res) => {
    try {
        const newIncome = new Income(req.body);
        await newIncome.save();
        res.json(newIncome);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Маршруты для расходов
app.get('/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/expenses', async (req, res) => {
    try {
        const newExpense = new Expense(req.body);
        await newExpense.save();
        res.json(newExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Маршруты для удаления доходов
app.delete('/incomes/:id', async (req, res) => {
    try {
        const income = await Income.findByIdAndDelete(req.params.id);
        if (!income) return res.status(404).json({ message: 'Income not found' });
        res.json({ message: 'Income deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Маршруты для удаления расходов
app.delete('/expenses/:id', async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        res.json({ message: 'Expense deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
