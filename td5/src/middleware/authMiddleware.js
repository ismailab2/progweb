
import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token manquant'
            });
        }

        const parts = authHeader.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
            return res.status(401).json({
                success: false,
                message: 'Format du token invalide'
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET absent du fichier .env');
            return res.status(500).json({
                success: false,
                message: 'Erreur de configuration du serveur'
            });
        }

        const decoded = jwt.verify(
            parts[1],
            process.env.JWT_SECRET
        );

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token invalide ou expiré'
        });
    }
};
