# DataFlow CI Ingestion Platform

Plateforme d'automatisation de l'ingestion et validation de fichiers de données pour DataFlow CI.

## Ce que fait l'application

DataFlow CI reçoit quotidiennement des fichiers de données (CSV, Excel) de dizaines de sources différentes (télécom, banque, grande distribution). Chaque source a son propre format et ses propres règles métier.

Cette plateforme permet de :

- **Définir des schémas de données** par source avec versionnement
- **Uploader des fichiers** (CSV, Excel) et les valider automatiquement selon le schéma
- **Consulter des rapports détaillés** : statut, lignes valides/invalides, erreurs ligne par ligne
- **Exporter les lignes valides** en CSV pour correction ou intégration
- **Monitorer l'activité** via un dashboard avec KPIs et visualisations

## Version déployée

https://dataflow-ci-ingestion-platform.vercel.app

## Compte de démonstration

```
Email : admin@dataflow.ci
Password : Admin123!
```

---

## Lancer le projet en local

### Prérequis

- Node.js 18+
- PostgreSQL (ou utiliser Neon/Vercel Postgres)
- Git

### Installation

1. **Cloner le repository**

```bash
git clone https://github.com/OYKLd/dataflow-ci-ingestion-platform.git
cd dataflow-ci-ingestion-platform
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env` à la racine :

```env
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_SECRET=votre_secret_aleatoire
NEXTAUTH_URL=http://localhost:3000
BLOB_READ_WRITE_TOKEN=vercel_blob_token
```

4. **Initialiser la base de données**

```bash
npx prisma migrate dev
```

5. **Créer l'utilisateur admin**

```bash
npm run create-admin
```

6. **Lancer l'application**

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

---

## Stack technique

- **Frontend** : Next.js 16, React, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes, TypeScript
- **Base de données** : PostgreSQL + Prisma ORM
- **Authentification** : NextAuth
- **Stockage fichiers** : Vercel Blob Storage
- **Validation** : PapaParse (CSV), XLSX (Excel)

---

## Fonctionnalités principales

### 1. Gestion des sources
- Création de sources de données (ex: "Ventes Orange CI")
- Définition de schémas avec colonnes, types, contraintes
- Versionnement des schémas (historique préservé)

### 2. Upload et validation
- Upload de fichiers CSV et Excel (max 10 MB)
- Validation asynchrone (non bloquante)
- Validation ligne par ligne selon le schéma
- Types supportés : string, integer, date, enum
- Contraintes : required, pattern, min, max, allowed_values

### 3. Rapport d'ingestion
- Statut global (PENDING, PROCESSING, SUCCESS, PARTIAL, FAILED)
- Nombre de lignes totales / valides / invalides
- Détail des erreurs par ligne (numéro, colonne, raison)
- Export des lignes valides en CSV

### 4. Dashboard de monitoring
- Nombre de fichiers ingérés par source
- Taux de succès / d'erreur
- Sources les plus actives
- Visualisations avec Recharts

### 5. Authentification
- Login email + mot de passe
- Gestion des rôles (ADMIN, ANALYST, VIEWER)
- Contrôle d'accès par permission

---

## Données de test

Des fichiers d'exemple sont disponibles dans le dossier `samples/` :

- `source-ventes-orange.json` - Schéma exemple
- `ventes-orange-clean.csv` - Fichier conforme
- `ventes-orange-dirty.csv` - Fichier avec erreurs
- `source-stock-banque.json` - Autre schéma exemple
- `stock-banque-clean.csv` / `stock-banque-dirty.csv`

---

## Design document

Pour plus de détails sur l'architecture, les choix techniques et les trade-offs, consultez [DESIGN.md](./DESIGN.md).

---

## Auteur

Lydie Ouattara - Challenge Artefact CI 2026
