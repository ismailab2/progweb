import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import {getAllContacts, getContactById, addContact, updateContact, removeContact} from '../controllers/contactController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();


/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Inscrire un nouvel utilisateur
 *     tags:
 *       - Authentification
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       '201':
 *         description: Utilisateur créé avec succès
 *       '400':
 *         description: Email ou mot de passe manquant
 *       '409':
 *         description: Cet email est déjà utilisé
 */
router.post('/auth/register', registerUser);


/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Connecter un utilisateur
 *     tags:
 *       - Authentification
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       '200':
 *         description: Connexion réussie, retourne un JWT
 *       '400':
 *         description: Email ou mot de passe manquant
 *       '401':
 *         description: Identifiants incorrects
 */
router.post('/auth/login', loginUser);

router.get('/', function (req, res) {
    res.status(200).json({
        status: 'API is Working',
        message: 'Welcome!',
    });
});


/**
 * @openapi
 * /api/contacts:
 *   get:
 *     summary: Récupérer tous les contacts
 *     tags:
 *       - Contacts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Liste des contacts récupérée
 *       '401':
 *         description: Token absent, invalide ou expiré
 */
router.route('/contacts').get(requireAuth, async (req, res) => {
        const response = await getAllContacts();
        if (response.success === true) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
        }
    }
);

router.route('/contacts/:id').get(requireAuth, async (req, res) => {
        const response = await getContactById(req.params.id);
        if (response.success === true) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
        }
    }
);

router.route('/contacts').post(requireAuth, async (req, res) => {
        const response = await addContact(req.body);
        if (response.success === true) {
            res.status(201).json(response);
        } else {
            res.status(400).json(response);
        }
    }
);

router.route('/contacts/:id').put(requireAuth, async (req, res) => {
        const response = await updateContact(
            req.params.id,
            req.body.name,
            req.body.age
        );
        if (response.success === true) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
        }
    }
);

router.route('/contacts/:id').delete(requireAuth, async (req, res) => {
        const response = await removeContact(req.params.id);
        if (response.success === true) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
        }
    }
);

export default router;