# DESIGN.md

## 1. Compréhension du besoin

DataFlow CI reçoit quotidiennement des fichiers provenant de nombreux clients.

Chaque client possède son propre format de données, ses propres règles métier et ses propres contraintes de validation.

Aujourd'hui ces vérifications sont réalisées manuellement, ce qui entraîne :

* un temps de traitement élevé
* un manque de traçabilité
* des erreurs humaines
* des difficultés de suivi

L'objectif du projet est de construire une plateforme permettant :

* de définir des schémas de données par source
* de recevoir des fichiers CSV
* de valider automatiquement les données
* de fournir un rapport détaillé
* de monitorer l'activité globale

---

# 2. Hypothèses prises

Pour respecter le délai du challenge, plusieurs hypothèses ont été retenues :

* CSV uniquement pour le MVP
* stockage local des fichiers uploadés
* validation asynchrone simple
* authentification par email / mot de passe
* gestion des rôles ADMIN / ANALYST / VIEWER
* PostgreSQL comme base de données unique

---

# 3. Architecture

Architecture retenue :

```text
Browser
   |
Next.js App Router
   |
Services
   |
Prisma ORM
   |
PostgreSQL
```

Les uploads suivent le flux suivant :

```text
Upload CSV
      |
Création Upload
      |
Statut PENDING
      |
Traitement asynchrone
      |
Validation ligne par ligne
      |
Création des erreurs
      |
Mise à jour du rapport
```

---

# 4. Modélisation du domaine

## Source

Représente une source métier.

Exemples :

* Orange CI
* Banque CI

Une source possède :

* plusieurs uploads
* plusieurs versions de schéma

---

## SchemaVersion

Permet le versionnement des règles de validation.

Chaque version contient :

* colonnes
* types
* contraintes

Le système valide toujours avec la dernière version disponible.

---

## FileUpload

Représente un fichier reçu.

Informations :

* statut
* nombre de lignes
* qualité des données
* source associée

---

## ValidationError

Stocke les erreurs de validation.

Informations :

* ligne
* colonne
* message

---

## User

Utilisateur authentifié.

Rôles :

* ADMIN
* ANALYST
* VIEWER

---

## AuditLog

Traçabilité des actions critiques :

* création de source
* création de schéma
* upload
* changement de rôle

---

# 5. Choix techniques

## Next.js

Choisi pour :

* React intégré
* App Router
* API Routes
* déploiement simple sur Vercel

---

## TypeScript

Permet :

* typage fort
* réduction des erreurs
* meilleure maintenabilité

---

## Prisma

Choisi pour :

* productivité élevée
* migrations
* intégration PostgreSQL

---

## PostgreSQL

Choisi pour :

* fiabilité
* simplicité
* compatibilité Prisma

---

## NextAuth

Permet :

* authentification rapide
* intégration native avec Next.js

---

# 6. Traitement asynchrone

Le brief impose que l'utilisateur ne reste pas bloqué pendant la validation.

Pour le MVP :

* création immédiate de l'upload
* retour instantané à l'utilisateur
* traitement exécuté en arrière-plan

Une implémentation industrielle utiliserait :

* BullMQ
* Inngest
* Trigger.dev

---

# 7. Dashboard

Les indicateurs retenus sont :

* nombre total d'uploads
* taux de succès
* nombre de lignes traitées
* nombre de sources actives

Visualisations :

* uploads par source
* répartition des statuts
* lignes traitées par source

Ces métriques permettent d'identifier rapidement :

* les sources les plus actives
* les problèmes qualité
* les tendances d'utilisation

---

# 8. Sécurité

Mesures implémentées :

* authentification
* mots de passe hashés
* contrôle d'accès par rôle
* journalisation des actions

---

# 9. Ce qui fonctionne

Fonctionnalités terminées :

* gestion des sources
* versionnement des schémas
* upload CSV
* validation automatique
* rapports d'ingestion
* dashboard
* authentification
* RBAC
* audit logs

---

# 10. Limites du MVP

Non implémenté :

* upload Excel
* export des lignes valides
* notifications
* webhooks
* multi-tenant
* tests automatisés
* pipeline CI/CD

---

# 11. Trade-offs

Afin de respecter le délai :

* stockage local des fichiers
* validation synchrone en mémoire
* schémas créés manuellement
* architecture volontairement simple

L'objectif principal était d'obtenir un flux complet fonctionnel de bout en bout.

---

# 12. Next Steps

Avec deux semaines supplémentaires :

1. Upload Excel
2. Export des lignes valides
3. Notifications temps réel
4. Webhooks
5. Multi-tenant
6. BullMQ pour les traitements
7. Tests automatisés
8. GitHub Actions
9. Stockage S3
10. Observabilité avancée
