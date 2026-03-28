# Beauty Glow Final

## Installation

```bash
npm run install:all
```

## Base de données Neon
1. Crée un projet Neon.
2. Exécute `docs/schema.sql` dans l'éditeur SQL de Neon.
3. Si tu mets à jour une ancienne base déjà créée avec la v3, exécute aussi `docs/update-from-v3.sql`.
4. Copie `backend/.env.example` vers `backend/.env`.
5. Renseigne `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `WHATSAPP_SALON`.
6. Lance `npm --prefix backend run seed:admin`.
7. Lance `npm run dev`.

## URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Admin: http://localhost:5173/admin/login

## WhatsApp
- Quand une réservation est créée, le backend enregistre la réservation et retourne un lien WhatsApp prérempli vers le salon.
- Quand l'admin confirme une réservation, le backend prépare un message client et le journalise.
- Pour un envoi **automatique réel**, branche une API comme WhatsApp Cloud API ou Twilio dans `backend/src/utils/whatsapp.js`.
