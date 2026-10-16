import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
     try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                status: false,
                message: 'Email et mot de passe obligatoires'
            });
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                success: false,
                message: 'Cet email est déjà utilisé'
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({email, password: hashedPassword});

        await user.save();
        return res.status(201).json({
                success: true,
                message: 'Utilisateur créé avec succès'
            });
        } catch (error) {
            console.error('Erreur registerUser :', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de la création'
            });
        }
    };
 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe obligatoires'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        const passwordIsValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET est absent du fichier .env');
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            success: true,
            message: 'Connexion réussie',
            token
        });
    } catch (error) {
        console.error('Erreur loginUser :', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la connexion'
        });
    }
};