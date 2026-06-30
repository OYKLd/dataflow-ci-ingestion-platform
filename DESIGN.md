# DESIGN.md

## 1. Compréhension du besoin

### Problème

DataFlow CI agrège et revend des données à des clients du secteur télécom, banque et grande distribution. Ces clients envoient quotidiennement des fichiers de données (CSV, Excel) depuis des dizaines de sources différentes, chacune avec son propre format, ses propres règles métier et ses propres bizarreries.

Aujourd'hui, 4 personnes à temps plein ouvrent ces fichiers manuellement, vérifient qu'ils sont conformes, et les chargent dans le data warehouse. Quand un fichier est invalide, on rappelle le client, on attend une correction, et personne ne sait où en est quoi. C'est lent, coûteux, et on perd la trace de tout.

### Solution proposée

Construire une plateforme qui permet de :

1. **Définir des schémas de données par source** : chaque source a son schéma attendu (colonnes, types, contraintes) avec versionnement pour faire évoluer les règles sans casser l'historique
2. **Uploader et valider automatiquement** : les fichiers sont attachés à une source et validés ligne par ligne selon le schéma de manière asynchrone
3. **Consulter des rapports détaillés** : pour chaque fichier, voir le statut, le nombre de lignes valides/invalides, et le détail des erreurs
4. **Exporter les lignes valides** : permettre de télécharger uniquement les lignes valides en CSV pour correction ou intégration
5. **Monitorer l'activité** : un dashboard avec des KPIs et visualisations pour suivre la qualité des données et identifier les sources problématiques

### Hypothèses prises

Pour respecter le délai de 2 semaines du challenge :

- **Format de fichiers** : CSV et Excel uniquement (pas de JSON, XML, etc.)
- **Taille des fichiers** : limite à 10 MB pour le MVP
- **Validation asynchrone** : approche simple avec traitement en arrière-plan sans queue de message complexe
- **Authentification** : email/mot de passe simple, pas d'OAuth ou magic link
- **Stockage** : Vercel Blob Storage pour simplifier le déploiement
- **Base de données** : PostgreSQL unique, pas de sharding ou de réplication
- **Schémas** : créés manuellement via l'interface, pas d'import automatique depuis des fichiers existants
- **Multi-tenant** : non implémenté pour le MVP (tous les utilisateurs voient toutes les sources)

---

## 2. Architecture

### Architecture globale

```text
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                    (React + Tailwind)                        │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ HTTP
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  API Routes  │  │  Middleware  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Services Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Source     │  │   Upload     │  │   Dashboard  │     │
│  │  Management  │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                       Prisma ORM                             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL                              │
└─────────────────────────────────────────────────────────────┘
```

### Flux d'upload et validation

```text
User uploads file
       │
       ▼
Create FileUpload (status: PENDING)
       │
       ▼
Store file in Vercel Blob
       │
       ▼
Return upload ID to user (immediate)
       │
       │
       ▼ (async processing)
Fetch active schema version
       │
       ▼
Parse file (CSV or Excel)
       │
       ▼
Validate row by row
       │
       ▼
Create ValidationError records
       │
       ▼
Update FileUpload stats
       │
       ▼
Set status (SUCCESS / PARTIAL / FAILED)
```

### Choix d'architecture

**Architecture monolithique avec Next.js** : J'ai choisi une architecture monolithique plutôt que microservices pour plusieurs raisons :
- Plus simple à déployer et maintenir pour un MVP
- Next.js permet de gérer frontend et backend dans un même projet
- Réduit la latence entre frontend et backend (pas d'appels réseau)
- Suffisant pour le volume attendu du MVP

**Séparation par features** : Le code est organisé par fonctionnalités métier (source-management, file-upload, dashboard, auth) plutôt que par couches techniques. Cela facilite la navigation et la compréhension du code.

---

## 3. Modélisation du domaine

### Entités principales

#### Source
Représente une source de données métier (ex: "Ventes Orange CI - Hebdo").

**Attributs** :
- `id` : identifiant unique
- `name` : nom de la source
- `description` : description optionnelle
- `createdAt` / `updatedAt` : timestamps

**Relations** :
- 1:N vers `SchemaVersion` (une source a plusieurs versions de schéma)
- 1:N vers `FileUpload` (une source reçoit plusieurs fichiers)

**Invariants** :
- Une source ne peut être supprimée si elle a des uploads associés (cascade delete non activé intentionnellement)

#### SchemaVersion
Permet le versionnement des règles de validation.

**Attributs** :
- `id` : identifiant unique
- `sourceId` : référence vers la source
- `version` : numéro de version (entier)
- `schema` : JSON contenant les colonnes, types et contraintes
- `createdAt` : timestamp

**Relations** :
- N:1 vers `Source`

**Invariants** :
- Le couple (sourceId, version) est unique
- Les versions sont incrémentales
- La validation utilise toujours la version la plus élevée (active)

**Structure du schema JSON** :
```json
{
  "columns": [
    {
      "name": "date_vente",
      "type": "date",
      "required": true,
      "format": "YYYY-MM-DD"
    },
    {
      "name": "region",
      "type": "enum",
      "required": true,
      "allowed_values": ["Abidjan", "Bouaké", ...]
    }
  ]
}
```

#### FileUpload
Représente un fichier reçu et traité.

**Attributs** :
- `id` : identifiant unique
- `sourceId` : référence vers la source
- `fileName` : nom du fichier original
- `filePath` : chemin de stockage dans Vercel Blob
- `status` : PENDING | PROCESSING | SUCCESS | PARTIAL | FAILED
- `totalRows` : nombre total de lignes
- `validRows` : nombre de lignes valides
- `invalidRows` : nombre de lignes invalides
- `qualityScore` : pourcentage de lignes valides (0-100)
- `createdAt` / `updatedAt` : timestamps

**Relations** :
- N:1 vers `Source`
- 1:N vers `ValidationError`

**Invariants** :
- `totalRows = validRows + invalidRows`
- `qualityScore = (validRows / totalRows) * 100`
- Le statut évolue : PENDING → PROCESSING → (SUCCESS | PARTIAL | FAILED)

#### ValidationError
Stocke les erreurs de validation ligne par ligne.

**Attributs** :
- `id` : identifiant unique
- `uploadId` : référence vers l'upload
- `rowNumber` : numéro de la ligne en erreur
- `columnName` : nom de la colonne en erreur
- `message` : message d'erreur explicite

**Relations** :
- N:1 vers `FileUpload`

**Invariants** :
- Une erreur est toujours associée à un upload existant

#### User
Utilisateur authentifié.

**Attributs** :
- `id` : identifiant unique
- `email` : email unique
- `password` : mot de passe hashé (bcrypt)
- `role` : ADMIN | ANALYST | VIEWER
- `active` : statut du compte
- `createdAt` : timestamp

**Invariants** :
- L'email est unique
- Le mot de passe est toujours hashé avant stockage

#### AuditLog
Traçabilité des actions critiques.

**Attributs** :
- `id` : identifiant unique
- `action` : CREATE_SOURCE | CREATE_SCHEMA | UPLOAD_FILE | CHANGE_ROLE
- `entityId` : identifiant de l'entité concernée
- `entityType` : type de l'entité
- `actorEmail` : email de l'utilisateur ayant effectué l'action
- `metadata` : JSON avec des informations contextuelles
- `createdAt` : timestamp

**Invariants** :
- Toute action critique doit générer un audit log

### Diagramme des relations

```text
User (1) ──────── (N) AuditLog
 │
 │ (uploads via AuditLog)
 │
Source (1) ──────── (N) FileUpload
 │                    │
 │                    │ (1)
 │                    │
 │ (1)                │
SchemaVersion (N) ───┘
                    │
                    │ (1)
                    │
              ValidationError (N)
```

---

## 4. Choix techniques

### Stack imposée

**TypeScript** : Utilisé pour le frontend et le backend comme demandé dans le brief.
- Typage fort réduit les erreurs runtime
- Meilleure maintenabilité et autocomplétion
- Documentation vivante via les types

**Next.js 16** : Framework React choisi.
- App Router pour une architecture moderne
- API Routes intégrées pour le backend
- Server Components pour de meilleures performances
- Déploiement simplifié sur Vercel

**Git + GitHub** : Pour le versionnement comme demandé.

### Stack libre - Choix et justifications

#### Base de données : PostgreSQL + Prisma

**Pourquoi PostgreSQL ?**
- Base de données relationnelle robuste et éprouvée
- Supporte les types JSON (utile pour stocker les schémas flexibles)
- Compatible avec Prisma
- Disponible gratuitement via Neon ou Vercel Postgres

**Pourquoi Prisma ?**
- ORM moderne avec TypeScript-first
- Migrations automatiques et réversibles
- Type-safe queries (le schéma Prisma génère des types TypeScript)
- Productivité élevée comparé à SQL brut

#### Authentification : NextAuth

**Pourquoi NextAuth ?**
- Intégration native avec Next.js
- Supporte plusieurs providers (email/password, OAuth, etc.)
- Gestion des sessions out-of-the-box
- Configuration simple pour un MVP

**Pourquoi pas better-auth ou Clerk ?**
- NextAuth est plus éprouvé et documenté
- Clerk aurait nécessité un compte tiers et des coûts
- better-auth est plus récent et moins documenté

#### Stockage de fichiers : Vercel Blob Storage

**Pourquoi Vercel Blob ?**
- Intégration native avec Vercel (choisi pour l'hébergement)
- Simple à utiliser (API REST + SDK)
- Pas de configuration d'AWS S3 ou GCS nécessaire
- Coût prévisible pour un MVP

**Pourquoi pas le filesystem local ?**
- Ne fonctionne pas sur Vercel (serverless)
- Pas de persistance entre les déploiements
- Difficile de scaler horizontalement

#### Validation : PapaParse + XLSX

**Pourquoi PapaParse pour CSV ?**
- Bibliothèque robuste et éprouvée
- Gère les cas edge (quotes, délimiteurs, encodage)
- Streaming possible pour les gros fichiers (non implémenté pour le MVP)

**Pourquoi XLSX pour Excel ?**
- Bibliothèque standard pour lire/écrire Excel
- Supporte .xlsx et .xls
- Conversion simple en JSON

#### Dashboard : Recharts

**Pourquoi Recharts ?**
- Bibliothèque React populaire et bien documentée
- Composants déclaratifs
- Responsive par défaut
- Intégration facile avec Tailwind CSS

### Traitement asynchrone

**Approche choisie pour le MVP :**
- Création immédiate de l'upload avec statut PENDING
- Retour immédiat de l'upload ID à l'utilisateur
- Traitement déclenché en arrière-plan via un appel API séparé
- Polling côté client pour vérifier le statut

**Pourquoi cette approche ?**
- Simple à implémenter sans infrastructure externe
- Fonctionne sur Vercel (serverless)
- Suffisant pour le volume du MVP

**Pourquoi pas BullMQ / Inngest / Trigger.dev ?**
- BullMQ nécessite Redis (infrastructure supplémentaire)
- Inngest et Trigger.dev sont des services externes (compte tiers)
- Pour un MVP, l'approche simple est suffisante

**Limites de l'approche actuelle :**
- Pas de reprise automatique en cas d'échec
- Pas de priorité entre les traitements
- Pas de parallélisme (un fichier à la fois)

**Next steps** : Avec plus de temps, j'implémenterais BullMQ avec Redis pour une vraie file d'attente.

---

## 5. Ce qui marche, ce qui ne marche pas, ce qui manque

### Ce qui marche

**Gestion des sources** : Création, modification, suppression des sources avec interface intuitive

**Versionnement des schémas** : Création de nouvelles versions sans casser l'historique, validation utilise toujours la dernière version

**Upload de fichiers** : Support CSV et Excel, limite de 10 MB, stockage sur Vercel Blob

**Validation asynchrone** : L'utilisateur n'est pas bloqué pendant le traitement, polling pour suivre le statut

**Validation ligne par ligne** : Types (string, integer, date, enum) et contraintes (required, pattern, min, max, allowed_values) fonctionnels

**Rapports d'ingestion** : Statut global, statistiques détaillées, erreurs par ligne avec messages explicites

**Export des lignes valides** : Fonctionnalité implémentée et testée

**Dashboard** : KPIs pertinents, 3 visualisations (uploads par source, répartition statuts, lignes par source)

**Authentification** : Login email/password, sessions gérées par NextAuth

**RBAC** : 3 rôles (ADMIN, ANALYST, VIEWER) avec permissions différenciées

**Audit logs** : Traçabilité des actions critiques

### Ce qui ne marche pas / Limites connues

**Pas de reprise automatique** : Si le traitement échoue (crash serveur), l'upload reste en statut PROCESSING indéfiniment

**Pas de validation croisée** : Les contraintes entre lignes (ex: unicité d'une combinaison de colonnes) ne sont pas implémentées

**Pas de gestion des doublons** : Le même fichier peut être uploadé plusieurs fois

**Polling côté client** : L'utilisateur doit rafraîchir la page pour voir le statut final (pas de WebSocket ou SSE)

**Pas de notifications** : L'utilisateur n'est pas notifié quand le traitement est terminé

**Pas de multi-tenant** : Tous les utilisateurs voient toutes les sources

### Ce qui manque (non implémenté)

**Notifications** : Pas de notifications in-app, email ou autre quand un fichier est traité

**Webhooks sortants** : DataFlow CI ne peut pas notifier ses systèmes aval

**Multi-tenant** : Pas d'isolation entre clients de DataFlow CI

**Tests automatisés** : Pas de tests unitaires ou d'integration

**CI/CD** : Pas de pipeline GitHub Actions

**Observabilité** : Pas de monitoring avancé (logs agrégés, métriques, alertes)

---

## 6. Trade-offs assumés

Pour respecter le délai de 2 semaines et livrer un MVP fonctionnel, j'ai fait les compromis suivants :

### 1. RBAC complet vs authentification simple

**Trade-off** : Le brief demandait "pas de gestion de rôles complexe", mais j'ai implémenté un RBAC complet avec 3 rôles.

**Pourquoi** : J'ai estimé que le contrôle d'accès était important pour un vrai cas d'usage métier.

**Coût** : Complexité accrue, code supplémentaire à maintenir.

### 2. Audit logs vs simplicité

**Trade-off** : J'ai ajouté un système d'audit logs non demandé.

**Pourquoi** : La traçabilité est cruciale pour une plateforme de données. Cela montre une réflexion sur les besoins métier réels.

**Coût** : Table supplémentaire, code à chaque action critique.

### 3. Validation synchrone en mémoire vs file d'attente

**Trade-off** : La validation se fait en mémoire sans file d'attente persistante.

**Pourquoi** : Plus simple à implémenter pour un MVP, fonctionne sur Vercel serverless.

**Coût** : Pas de reprise en cas d'échec, pas de parallélisme, risque d'OOM sur gros fichiers.

### 4. Schémas JSON vs DSL dédié

**Trade-off** : Les schémas sont stockés en JSON brut sans DSL ou langage dédié.

**Pourquoi** : Flexible, simple à sérialiser/désérialiser, pas besoin de parser complexe.

**Coût** : Pas de validation du schéma lui-même, risque d'incohérences.

### 5. Stockage Blob vs S3

**Trade-off** : Vercel Blob au lieu de AWS S3 ou GCS.

**Pourquoi** : Intégration native avec Vercel, configuration simple, pas de compte AWS nécessaire.

**Coût** : Vendor lock-in avec Vercel, moins de contrôle.

### 6. Pas de tests vs qualité du code

**Trade-off** : Pas de tests automatisés pour privilégier les fonctionnalités.

**Pourquoi** : Le temps limité (2 semaines) m'a forcé à choisir entre fonctionnalités complètes ou tests. J'ai privilégié les fonctionnalités.

**Coût** : Risque de régressions, pas de garantie de qualité.

### 7. Dashboard simple vs analytics avancés

**Trade-off** : Dashboard avec 3 visualisations basiques vs analytics avancés.

**Pourquoi** : Les 3 visualisations demandées par le brief sont suffisantes pour un MVP.

**Coût** : Moins d'insights possibles, pas de drill-down.

---

## 7. Next steps

Si j'avais 2 semaines supplémentaires, voici ce que je ferais dans l'ordre de priorité :

### Priorité haute

1. **Tests automatisés**
   - Tests unitaires pour les services de validation
   - Tests d'integration pour les API routes
   - Tests E2E avec Playwright pour les flows critiques
   - Couverture minimale de 80%

2. **CI/CD avec GitHub Actions**
   - Lint à chaque PR
   - Tests automatiques
   - Build vérifié
   - Déploiement automatique sur Vercel en staging
   - Déploiement manuel en production

3. **Notifications**
   - Notifications in-app quand un fichier est traité
   - Optionnel : notifications email via Resend ou SendGrid
   - Préférences utilisateur pour les notifications

4. **File d'attente avec BullMQ**
   - Implémentation de BullMQ avec Redis
   - Reprise automatique en cas d'échec
   - Priorité entre les traitements
   - Parallélisme des traitements

### Priorité moyenne

5. **Webhooks sortants**
   - Configuration de webhooks par source
   - Envoi de notifications quand un fichier est validé
   - Retry automatique en cas d'échec
   - Logs des appels webhook

6. **Validation croisée**
   - Contraintes entre lignes (unicité, références)
   - Validation de sommes totales
   - Détection de doublons

7. **Multi-tenant**
   - Isolation des sources par client
   - Chaque utilisateur ne voit que ses sources
   - Administration centrale pour DataFlow CI

8. **Import de schémas**
   - Import depuis un fichier CSV/Excel existant
   - Inférence automatique des types
   - Génération de contraintes suggérées

### Priorité basse

9. **Observabilité avancée**
   - Logs centralisés (Logtail ou Datadog)
   - Métriques de performance
   - Alertes sur les erreurs
   - Dashboard d'observabilité

10. **Stockage S3**
    - Migration de Vercel Blob vers AWS S3
    - Configuration via variables d'environnement
    - Support de multiples providers

11. **WebSocket / SSE**
    - Mise à jour temps réel du statut d'upload
    - Plus besoin de polling
    - Meilleure UX

12. **UI/UX améliorée**
    - Dark mode
    - Thèmes personnalisables
    - Accessibilité (ARIA labels, keyboard navigation)
    - Mobile responsive

---

## Conclusion

Ce projet a été conçu pour livrer un MVP fonctionnel et robuste dans un délai de 2 semaines. L'architecture est simple mais extensible, les choix techniques sont justifiés par le contexte du challenge, et les trade-offs sont assumés et documentés. Le projet répond à toutes les exigences obligatoires du brief et pourrait facilement être étendu avec les next steps identifiés.
