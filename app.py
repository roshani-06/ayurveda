"""
AyurVeda — Flask Backend
========================
Connects the Jinja2 HTML templates to a MySQL database.
 
Project layout expected:
  ayurveda/
  ├── app.py                 ← this file
  ├── config.py              ← DB credentials (see below)
  ├── requirements.txt
  ├── static/
  │   ├── css/
  │   └── js/
  └── templates/
      ├── ayurveda-home.html
      ├── ayurveda-search.html
      └── ayurveda-dosha-quiz.html
"""
 
from flask import Flask, render_template, request, jsonify, abort
import mysql.connector
from mysql.connector import pooling
import os
 
# ─── App setup ───────────────────────────────────────────────────────────────
app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "ayurveda-dev-secret-2026")
 
# ─── Database configuration ──────────────────────────────────────────────────
DB_CONFIG = {
    "host":     os.environ.get("DB_HOST",     "localhost"),
    "port":     int(os.environ.get("DB_PORT", 3306)),
    "user":     os.environ.get("DB_USER",     "root"),
    "password": os.environ.get("DB_PASSWORD", "roshani@0610"),   # ← change this
    "database": os.environ.get("DB_NAME",     "ayurveda_db"),
    "charset":  "utf8mb4",
    "use_unicode": True,
}
 
# Connection pool — avoids opening a new connection on every request
connection_pool = pooling.MySQLConnectionPool(
    pool_name="ayurveda_pool",
    pool_size=5,
    **DB_CONFIG,
)
 
def get_conn():
    """Return a pooled database connection."""
    return connection_pool.get_connection()
 
# ─── Helper: run a SELECT and return list of dicts ───────────────────────────
def query(sql: str, params: tuple = ()) -> list[dict]:
    conn = get_conn()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(sql, params)
        rows = cursor.fetchall()
        return rows
    finally:
        cursor.close()
        conn.close()
 
# ─── Routes ──────────────────────────────────────────────────────────────────
 
@app.route("/")
def home():
    """Home page — no DB query needed; static page with links."""
    return render_template("ayurveda-home.html")
 
 
@app.route("/remedies")
def remedies():
    """
    Search/browse page.
    Passes all remedies to the template as JSON so the JS can filter client-side.
    Also supports optional ?cat=<slug> for deep-link category pre-selection.
    """
    rows = query("""
        SELECT
            r.id, r.disease, r.herb_name,
            c.slug AS category, c.name AS category_name, c.icon AS category_icon,
            d.slug AS dosha_type,
            r.difficulty, r.rating, r.review_count,
            r.prep_time_min, r.title, r.preparation, r.benefits, r.caution
        FROM remedies r
        JOIN categories c ON c.id = r.category_id
        JOIN doshas     d ON d.id = r.dosha_id
        ORDER BY r.id
    """)
    selected_cat = request.args.get("cat", "all")
    return render_template(
        "ayurveda-search.html",
        remedies=rows,          # list of dicts → Jinja passes to JS as flaskRemedies
        selected_cat=selected_cat,
    )
 
 
@app.route("/dosha-quiz")
def dosha_quiz():
    """Dosha quiz page — questions are embedded in the JS, no server data needed."""
    return render_template("ayurveda-dosha-quiz.html")
 
 
# ─── API endpoints (called by JS with fetch) ─────────────────────────────────
 
@app.route("/api/remedies")
def api_remedies():
    """
    GET /api/remedies
    Query params:
      q        — free-text search (disease / herb / category)
      cat      — category slug  (e.g. digestion, diabetes)
      dosha    — dosha slug     (vata | pitta | kapha | all)
      diff     — difficulty     (easy | moderate | advanced)
      sort     — name | rating | easy
      page     — page number (default 1)
      per_page — results per page (default 12, max 50)
    """
    q        = request.args.get("q",        "").strip()
    cat      = request.args.get("cat",      "")
    dosha    = request.args.get("dosha",    "")
    diff     = request.args.get("diff",     "")
    sort     = request.args.get("sort",     "default")
    page     = max(1, int(request.args.get("page",     1)))
    per_page = min(50, max(1, int(request.args.get("per_page", 12))))
 
    # Build WHERE clause dynamically
    where_clauses = []
    params = []
 
    if q:
        where_clauses.append(
            "(r.disease LIKE %s OR r.herb_name LIKE %s OR c.name LIKE %s OR r.preparation LIKE %s)"
        )
        like = f"%{q}%"
        params.extend([like, like, like, like])
 
    if cat and cat != "all":
        where_clauses.append("c.slug = %s")
        params.append(cat)
 
    if dosha and dosha != "all":
        where_clauses.append("(d.slug = %s OR d.slug = 'all')")
        params.append(dosha)
 
    if diff:
        where_clauses.append("r.difficulty = %s")
        params.append(diff)
 
    where_sql = ("WHERE " + " AND ".join(where_clauses)) if where_clauses else ""
 
    # ORDER BY
    order_map = {
        "name":   "r.disease ASC",
        "rating": "r.rating DESC",
        "easy":   "FIELD(r.difficulty,'easy','moderate','advanced')",
    }
    order_sql = order_map.get(sort, "r.id ASC")
 
    # Count total (for pagination metadata)
    count_sql = f"""
        SELECT COUNT(*) AS total
        FROM remedies r
        JOIN categories c ON c.id = r.category_id
        JOIN doshas     d ON d.id = r.dosha_id
        {where_sql}
    """
    total = query(count_sql, tuple(params))[0]["total"]
 
    # Fetch page
    offset = (page - 1) * per_page
    data_sql = f"""
        SELECT
            r.id, r.disease, r.herb_name,
            c.slug AS category, c.name AS category_name, c.icon AS category_icon,
            d.slug AS dosha_type,
            r.difficulty, r.rating, r.review_count,
            r.prep_time_min, r.title, r.preparation, r.benefits, r.caution
        FROM remedies r
        JOIN categories c ON c.id = r.category_id
        JOIN doshas     d ON d.id = r.dosha_id
        {where_sql}
        ORDER BY {order_sql}
        LIMIT %s OFFSET %s
    """
    rows = query(data_sql, tuple(params) + (per_page, offset))
 
    # Fetch tags for each remedy (batched)
    if rows:
        ids = tuple(r["id"] for r in rows)
        placeholders = ",".join(["%s"] * len(ids))
        tag_rows = query(
            f"""
            SELECT rt.remedy_id, t.name
            FROM remedy_tags rt
            JOIN tags t ON t.id = rt.tag_id
            WHERE rt.remedy_id IN ({placeholders})
            """,
            ids,
        )
        tags_by_id: dict[int, list[str]] = {}
        for tr in tag_rows:
            tags_by_id.setdefault(tr["remedy_id"], []).append(tr["name"])
        for r in rows:
            r["tags"] = tags_by_id.get(r["id"], [])
 
    return jsonify({
        "total":    total,
        "page":     page,
        "per_page": per_page,
        "pages":    (total + per_page - 1) // per_page,
        "remedies": rows,
    })
 
 
@app.route("/api/remedies/<int:remedy_id>")
def api_remedy_detail(remedy_id: int):
    """GET /api/remedies/<id> — full detail for a single remedy."""
    rows = query(
        """
        SELECT
            r.id, r.disease, r.herb_name,
            c.slug AS category, c.name AS category_name, c.icon AS category_icon,
            d.slug AS dosha_type, d.name AS dosha_name,
            r.difficulty, r.rating, r.review_count,
            r.prep_time_min, r.title, r.preparation, r.benefits, r.caution
        FROM remedies r
        JOIN categories c ON c.id = r.category_id
        JOIN doshas     d ON d.id = r.dosha_id
        WHERE r.id = %s
        """,
        (remedy_id,),
    )
    if not rows:
        abort(404, description="Remedy not found")
 
    remedy = rows[0]
 
    # Tags
    tag_rows = query(
        "SELECT t.name FROM remedy_tags rt JOIN tags t ON t.id = rt.tag_id WHERE rt.remedy_id = %s",
        (remedy_id,),
    )
    remedy["tags"] = [tr["name"] for tr in tag_rows]
 
    return jsonify(remedy)
 
 
@app.route("/api/categories")
def api_categories():
    """GET /api/categories — list all categories with remedy counts."""
    rows = query(
        """
        SELECT c.slug, c.name, c.icon, COUNT(r.id) AS remedy_count
        FROM categories c
        LEFT JOIN remedies r ON r.category_id = c.id
        GROUP BY c.id
        ORDER BY c.id
        """
    )
    return jsonify(rows)
 
 
@app.route("/api/search")
def api_search():
    """
    GET /api/search?q=<term>
    Lightweight autocomplete / suggestion endpoint used by the hero search box.
    Returns up to 8 matches across disease, herb_name, and category name.
    """
    q = request.args.get("q", "").strip()
    if len(q) < 2:
        return jsonify([])
    like = f"%{q}%"
    rows = query(
        """
        SELECT r.id, r.disease, r.herb_name, c.slug AS category, c.icon AS category_icon
        FROM remedies r
        JOIN categories c ON c.id = r.category_id
        WHERE r.disease LIKE %s OR r.herb_name LIKE %s OR c.name LIKE %s
        ORDER BY r.rating DESC
        LIMIT 8
        """,
        (like, like, like),
    )
    return jsonify(rows)
 
 
@app.route("/api/quiz/questions")
def api_quiz_questions():
    """GET /api/quiz/questions — all quiz questions with their options."""
    questions = query("SELECT * FROM quiz_questions ORDER BY question_no")
    if not questions:
        return jsonify([])
    q_ids = tuple(q["id"] for q in questions)
    placeholders = ",".join(["%s"] * len(q_ids))
    options = query(
        f"SELECT * FROM quiz_options WHERE question_id IN ({placeholders}) ORDER BY question_id, id",
        q_ids,
    )
    opts_by_qid: dict[int, list] = {}
    for opt in options:
        opts_by_qid.setdefault(opt["question_id"], []).append(opt)
    for q in questions:
        q["options"] = opts_by_qid.get(q["id"], [])
    return jsonify(questions)
 
 
@app.route("/api/quiz/result", methods=["POST"])
def api_quiz_result():
    """
    POST /api/quiz/result
    Body JSON: { "vata": 4, "pitta": 7, "kapha": 3 }
    Returns dominant dosha and recommended remedies.
    """
    data = request.get_json(force=True)
    vata  = int(data.get("vata",  0))
    pitta = int(data.get("pitta", 0))
    kapha = int(data.get("kapha", 0))
 
    scores = {"vata": vata, "pitta": pitta, "kapha": kapha}
    dominant = max(scores, key=scores.get)
 
    # Fetch top-rated remedies for this dosha
    recommended = query(
        """
        SELECT r.id, r.disease, r.herb_name,
               c.slug AS category, c.icon AS category_icon,
               d.slug AS dosha_type, r.difficulty, r.rating, r.prep_time_min
        FROM remedies r
        JOIN categories c ON c.id = r.category_id
        JOIN doshas     d ON d.id = r.dosha_id
        WHERE d.slug = %s OR d.slug = 'all'
        ORDER BY r.rating DESC
        LIMIT 6
        """,
        (dominant,),
    )
 
    return jsonify({
        "dominant_dosha": dominant,
        "scores":         scores,
        "recommended":    recommended,
    })
 
 
# ─── Error handlers ──────────────────────────────────────────────────────────
 
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": str(e)}), 404
 
@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500
 
 
# ─── Run ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
 


