# Samples - Challenge Technique Artefact CI

Ce dossier contient les fichiers de données de test fournis par Artefact CI pour le challenge technique.

## Contenu

### Source 1 — Ventes Orange CI
- `source-ventes-orange.json` - Schéma de la source "Ventes Orange CI - Hebdomadaire"
- `ventes-orange-clean.csv` - Fichier CSV conforme au schéma (données valides)
- `ventes-orange-dirty.csv` - Fichier CSV avec erreurs volontaires (données invalides)

### Source 2 — Stock Banque Atlantique
- `source-stock-banque.json` - Schéma de la source "Stock Cartes Bancaires - Banque Atlantique CI"
- `stock-banque-clean.csv` - Fichier CSV conforme au schéma (données valides)
- `stock-banque-dirty.csv` - Fichier CSV avec erreurs volontaires (données invalides)

## Utilisation

Ces fichiers sont destinés à:
- Tester la validation de schéma
- Vérifier le traitement des erreurs
- Démontrer les fonctionnalités d'upload et de validation
- Servir de données de test pour les tests automatisés

## Structure des schémas

Les fichiers JSON définissent:
- Les colonnes attendues avec leurs types
- Les contraintes de validation (required, pattern, allowed_values, min, max)
- Les contraintes au niveau des lignes (unicité, dépendances)
- Les métadonnées de la source (fréquence attendue, format, encoding)

## Erreurs dans les fichiers "dirty"

Les fichiers avec le suffixe `-dirty.csv` contiennent volontairement:
- Types incorrects
- Valeurs manquantes pour des champs requis
- Valeurs hors des plages autorisées
- Formats non conformes aux patterns
- Doublons
- Dates invalides
