import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt"; 
import dotenv from "dotenv";
import User from "./user.js";

dotenv.config();

const app = express();
app.use(express.json());

// criando a conexão com o banco
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conexão com o banco efetuada com sucesso!');
    } catch (err) {
        console.error('Conexão com o banco falhou!', err.message);
        process.exit(1);
    }
};
export default connectDB;

connectDB();

//Criando as rotas
app.post('/registerUser', async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({message: 'Este email já está cadastrado!'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Falha ao cadastrar!', error: error.message });
    }
});

app.post('/searchUser', async (req, res) => {
    const { name } = req.body;
    
    try {
    const user = await User.find({ name });

    if (user.length === 0){
        return res.status(404).json({ message: 'Nenhum usuário encontrado'});
    }
    res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error: err.message });
    }
});

app.put('/editUser', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = hashedPassword;
    
        await user.save();

        res.status(200).json({ message: 'Usuário atualizado com sucesso!', user });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar usuário', error: err.message });
    }
});

app.delete('/deleteUser', async (req, res) => {
    const { email } = req.body;

    try {
        let user;
        if (email) {
            user = await User.findOneAndDelete({ email });
        } else {
            return res.status(400).json({ message: 'Informe um email para deletar o usuário.' });
        }
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar usuário!', error: error.message });
    }
});


app.listen(5000, () => {
    console.log('Servidor rodando na porta 5000');
});