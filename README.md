# DataFlow CI Ingestion Platform

Application développée dans le cadre du challenge technique Artefact CI - Software Engineer Intern 2026.

## Contexte

DataFlow CI reçoit quotidiennement des fichiers CSV provenant de nombreuses entreprises (télécom, banque, retail).

Chaque source possède son propre format et ses propres règles métier.

L'objectif de cette plateforme est d'automatiser :

* la gestion des schémas de données
* la validation des fichiers entrants
* le suivi des traitements
* le monitoring de la qualité des données

---

# Fonctionnalités

## Authentification

* Login via email et mot de passe
* Gestion des sessions avec NextAuth
* Contrôle d'accès basé sur les rôles (RBAC)

### Rôles

#### ADMIN

* Gestion des utilisateurs
* Gestion des sources
* Gestion des schémas
* Upload de fichiers
* Consultation des rapports
* Consultation des logs d'audit

#### ANALYST

* Consultation des sources
* Upload de fichiers
* Consultation des rapports

#### VIEWER

* Consultation uniquement

---

## Gestion des sources

Création de nouvelles sources de données :

Exemple :

* Ventes Orange CI
* Stock Banque CI

Chaque source possède :

* un nom
* une description
* plusieurs versions de schéma

---

## Versionnement des schémas

Chaque source peut évoluer dans le temps.

Les anciennes versions restent disponibles afin de conserver l'historique des validations.

---

## Upload de fichiers

Formats supportés :

* CSV

Fonctionnement :

1. Sélection d'une source
2. Upload du fichier
3. Création d'un enregistrement d'upload
4. Traitement asynchrone
5. Validation des lignes

---

## Validation

Validation ligne par ligne selon le schéma associé.

Types supportés :

* string
* integer
* date
* enum

Contraintes supportées :

* required
* pattern
* min
* max
* allowed_values

---

## Rapport d'ingestion

Pour chaque upload :

* statut
* nombre de lignes totales
* nombre de lignes valides
* nombre de lignes invalides
* détail des erreurs

Statuts disponibles :

* PENDING
* PROCESSING
* SUCCESS
* PARTIAL
* FAILED

---

## Dashboard

Le dashboard fournit :

### KPI

* Nombre total d'uploads
* Nombre de lignes traitées
* Nombre de sources
* Taux de succès

### Visualisations

* Uploads par source
* Répartition des statuts
* Nombre de lignes traitées par source

---

## Audit Log

Toutes les actions importantes sont tracées :

* création de source
* création de schéma
* upload de fichier
* changement de rôle

---

# Stack Technique

## Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS

## Backend

* Next.js Route Handlers
* TypeScript

## Base de données

* PostgreSQL
* Prisma ORM

## Authentification

* NextAuth

## Validation

* PapaParse

---

# Architecture

```text
Client
   |
Next.js
   |
Services
   |
Prisma
   |
PostgreSQL
```

---

# Installation

## Cloner le projet

```bash
git clone https://github.com/OYKLd/dataflow-ci-ingestion-platform.git
cd dataflow-ci-ingestion-platform
```

## Installer les dépendances

```bash
npm install
```

## Variables d'environnement

Créer un fichier :

```env
.env
```

Exemple :

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

---

## Migration Prisma

```bash
npx prisma migrate dev
```

---

## Lancer l'application

```bash
npm run dev
```

Application :

```text
http://localhost:3000
```

---

# Compte de démonstration

Admin :

```text
Email : admin@dataflow.ci
Password : Admin123!
```

---

# Déploiement

Application déployée :

```text
https://dataflow-ci-ingestion-platform.vercel.app
```

---

# Auteur
Lydie Ouattara
Développé dans le cadre du challenge Artefact CI 2026.
