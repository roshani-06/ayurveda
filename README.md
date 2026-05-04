# AyurVeda — Flask + MySQL Setup Guide

## 1. Database setup
```bash
mysql -u root -p < ayurveda_db.sql
```

## 2. Configure credentials in app.py (or set env vars)
```
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
```

## 3. Install & run
```bash
pip install -r requirements.txt
python app.py
```
Visit: http://localhost:5000

## Routes
- /                → Home page
- /remedies        → Search/browse (supports ?q= and ?cat=)
- /dosha-quiz      → Dosha quiz

## API Endpoints
- GET  /api/remedies              → All remedies (filterable: q, cat, dosha, diff, sort, page)
- GET  /api/remedies/<id>         → Single remedy detail
- GET  /api/categories            → Categories with counts
- GET  /api/search?q=             → Autocomplete suggestions
- GET  /api/quiz/questions        → Quiz questions & options
- POST /api/quiz/result           → Submit quiz scores, get dosha + recommendations
