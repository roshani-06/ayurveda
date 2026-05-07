-- ============================================================
--  AyurVeda — CLEAN REINSTALL
--  Run this in MySQL Workbench or: mysql -u root -p < fix_ayurveda_db.sql
-- ============================================================

DROP DATABASE IF EXISTS ayurveda_db;

CREATE DATABASE ayurveda_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ayurveda_db;

-- ------------------------------------------------------------
-- categories
-- ------------------------------------------------------------
CREATE TABLE categories (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(50)  NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  icon        VARCHAR(10)  NOT NULL,
  description TEXT
);

-- ------------------------------------------------------------
-- doshas
-- ------------------------------------------------------------
CREATE TABLE doshas (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(20)  NOT NULL UNIQUE,
  name        VARCHAR(50)  NOT NULL,
  element     VARCHAR(50),
  description TEXT
);

-- ------------------------------------------------------------
-- remedies
-- ------------------------------------------------------------
CREATE TABLE remedies (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  disease         VARCHAR(150)  NOT NULL,
  herb_name       VARCHAR(150)  NOT NULL,
  category_id     INT UNSIGNED  NOT NULL,
  dosha_id        INT UNSIGNED  NOT NULL,
  difficulty      ENUM('easy','moderate','advanced') NOT NULL DEFAULT 'easy',
  rating          DECIMAL(3,1)  NOT NULL DEFAULT 4.5,
  review_count    INT UNSIGNED  NOT NULL DEFAULT 0,
  prep_time_min   INT UNSIGNED  NOT NULL DEFAULT 10,
  title           VARCHAR(200),
  preparation     TEXT          NOT NULL,
  benefits        TEXT,
  caution         TEXT,
  CONSTRAINT fk_remedy_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT fk_remedy_dosha    FOREIGN KEY (dosha_id)    REFERENCES doshas(id)
);

-- ------------------------------------------------------------
-- tags
-- ------------------------------------------------------------
CREATE TABLE tags (
  id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE remedy_tags (
  remedy_id  INT UNSIGNED NOT NULL,
  tag_id     INT UNSIGNED NOT NULL,
  PRIMARY KEY (remedy_id, tag_id),
  CONSTRAINT fk_rt_remedy FOREIGN KEY (remedy_id) REFERENCES remedies(id) ON DELETE CASCADE,
  CONSTRAINT fk_rt_tag    FOREIGN KEY (tag_id)    REFERENCES tags(id)     ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- quiz
-- ------------------------------------------------------------
CREATE TABLE quiz_questions (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question_no  TINYINT UNSIGNED NOT NULL,
  category     VARCHAR(80) NOT NULL,
  question     TEXT        NOT NULL,
  hint         TEXT
);

CREATE TABLE quiz_options (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question_id INT UNSIGNED NOT NULL,
  option_text TEXT NOT NULL,
  dosha       ENUM('vata','pitta','kapha') NOT NULL,
  CONSTRAINT fk_qo_question FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);

-- ============================================================
--  SEED DATA
-- ============================================================

INSERT INTO categories (slug, name, icon, description) VALUES
  ('digestion',   'Digestion',       '🫁', 'Remedies for digestive ailments'),
  ('diabetes',    'Diabetes',        '🩸', 'Herbal support for blood sugar regulation'),
  ('stress',      'Stress & Anxiety','🧠', 'Adaptogenic herbs for stress and mental health'),
  ('skin',        'Skin & Hair',     '✨', 'Natural treatments for skin and hair conditions'),
  ('respiratory', 'Respiratory',     '🌬️', 'Herbal remedies for cold, flu, asthma'),
  ('joints',      'Joint & Bone',    '🦴', 'Anti-inflammatory herbs for joints and bones'),
  ('immunity',    'Immunity',        '🛡️', 'Rasayana formulas to strengthen immunity'),
  ('heart',       'Heart Health',    '❤️', 'Cardioprotective herbs for heart health');

INSERT INTO doshas (slug, name, element, description) VALUES
  ('vata',  'Vata',       'Air + Space',  'Governs movement, creativity, and the nervous system.'),
  ('pitta', 'Pitta',      'Fire + Water', 'Governs digestion, metabolism, and transformation.'),
  ('kapha', 'Kapha',      'Earth + Water','Governs structure, stability, and nourishment.'),
  ('all',   'All Doshas', 'Universal',    'Suitable for all three doshas.');

INSERT INTO remedies (id, disease, herb_name, category_id, dosha_id, difficulty, rating, review_count, prep_time_min, title, preparation, benefits, caution) VALUES
(1,  'Indigestion',        'Ajwain & Ginger',            1, 1, 'easy',     4.8, 320, 10, 'Ajwain Ginger Warm Water',        'Boil 1 tsp ajwain seeds in 2 cups water for 5 minutes. Add half tsp freshly grated ginger. Strain and drink warm before or after meals.', 'Reduces bloating, stimulates digestive fire (Agni), relieves gas and cramps.', 'Avoid on empty stomach if you have ulcers.'),
(2,  'Diabetes (Type 2)',  'Bitter Gourd & Fenugreek',   2, 3, 'moderate', 4.7, 215, 20, 'Karela Methi Juice',              'Blend 1 bitter gourd (seeds removed) with 1 tbsp soaked fenugreek seeds and quarter cup water. Strain and drink 30 ml every morning on empty stomach.', 'Regulates blood glucose, improves insulin sensitivity, reduces glycosylated haemoglobin.', 'Monitor blood sugar closely; may interact with anti-diabetic medications.'),
(3,  'Chronic Stress',     'Ashwagandha & Brahmi',       3, 1, 'easy',     4.9, 540, 5,  'Ashwagandha Brahmi Milk',         'Mix 1 tsp Ashwagandha root powder and half tsp Brahmi powder in 1 cup warm full-fat milk. Add a pinch of cardamom and jaggery to taste. Drink at night.', 'Calms the nervous system, reduces cortisol, improves stress resilience and sleep quality.', 'Avoid during pregnancy; may cause drowsiness.'),
(4,  'Acne & Pimples',     'Neem & Turmeric',            4, 2, 'easy',     4.6, 410, 15, 'Neem Turmeric Face Paste',        'Grind 10 fresh neem leaves into a smooth paste. Mix with quarter tsp turmeric powder and 1 tsp rose water. Apply on affected areas for 20 minutes then rinse.', 'Clears bacterial infection, reduces inflammation, prevents future breakouts.', 'Patch-test first; avoid contact with eyes; turmeric may temporarily stain the skin.'),
(5,  'Common Cold',        'Tulsi & Ginger Tea',         5, 1, 'easy',     4.9, 680, 10, 'Tulsi Ginger Kadha',              'Boil 10 fresh Tulsi leaves, half tsp grated ginger, and 2 black peppercorns in 2 cups water for 10 minutes. Strain, add 1 tsp raw honey after cooling, and drink warm.', 'Clears nasal congestion, soothes the throat, boosts immunity, reduces fever.', 'Do not add honey to boiling liquid as heat destroys its beneficial enzymes.'),
(6,  'Arthritis Pain',     'Boswellia & Turmeric',       6, 1, 'moderate', 4.7, 290, 20, 'Shallaki Turmeric Paste',         'Mix 1 tbsp Shallaki (Boswellia serrata) resin powder with half tsp turmeric in warm sesame oil to form a paste. Apply to affected joints for 20 minutes. Internally, take 1 tsp Shallaki powder with warm milk twice daily.', 'Reduces joint inflammation, slows cartilage degradation, relieves chronic pain.', 'External paste may stain clothing; not a substitute for prescribed anti-inflammatory drugs.'),
(7,  'Low Immunity',       'Chyawanprash Formula',       7, 4, 'easy',     4.8, 750, 2,  'Chyawanprash Daily Rasayana',     'Take 1 to 2 tsp Chyawanprash with warm milk every morning on an empty stomach. For best results, use consistently for 3 to 6 months.', 'Boosts immunity, builds Ojas (vital energy), supports respiratory health, provides antioxidant protection.', 'Contains sugar; people with diabetes should use sugar-free variants.'),
(8,  'Hair Fall',          'Bhringraj & Amla Oil',       4, 2, 'moderate', 4.6, 330, 30, 'Bhringraj Amla Hair Oil',         'Warm 100 ml sesame oil and add 2 tbsp Bhringraj powder and 1 tbsp Amla powder. Simmer on low heat for 15 minutes, cool, and strain. Massage into scalp, leave for 1 hour, then wash.', 'Nourishes hair follicles, prevents premature greying, reduces hair fall, conditions scalp.', 'Perform a patch-test for sensitivity; avoid if allergic to sesame.'),
(9,  'Asthma',             'Vasaka & Licorice',          5, 3, 'advanced', 4.5, 185, 25, 'Vasaka Licorice Decoction',       'Boil 10 fresh Vasaka (Malabar nut) leaves with 1 tsp licorice root in 3 cups water. Reduce to 1 cup. Strain and drink lukewarm, twice daily.', 'Opens bronchial passages, reduces mucus, eases breathing difficulty, acts as expectorant.', 'Long-term use of licorice can raise blood pressure; do not self-medicate severe asthma.'),
(10, 'Constipation',       'Triphala Churna',            1, 4, 'easy',     4.9, 890, 5,  'Triphala Bedtime Decoction',      'Mix 1 tsp Triphala powder in 1 cup warm water. Stir well and drink at bedtime on an empty stomach.', 'Gently cleanses the colon, restores bowel regularity, detoxifies the gut.', 'Start with half tsp if you have a sensitive stomach.'),
(11, 'Hypertension',       'Arjuna & Sarpagandha',       8, 2, 'moderate', 4.6, 240, 20, 'Arjuna Bark Heart Tonic',         'Boil 1 tsp Arjuna bark powder in 2 cups water for 15 minutes. Strain and drink warm in the morning. Sarpagandha Vati tablets can be added under physician guidance.', 'Strengthens cardiac muscle, regulates blood pressure, improves heart function, reduces LDL cholesterol.', 'Sarpagandha must be taken only under qualified medical supervision; may cause drowsiness.'),
(12, 'Anxiety & Insomnia', 'Jatamansi & Valerian',       3, 1, 'easy',     4.7, 365, 5,  'Jatamansi Sleep Tonic',           'Blend half tsp Jatamansi root powder in 1 cup warm milk with a pinch of nutmeg. Drink 30 minutes before sleep.', 'Calms the mind, relieves anxiety and nervous tension, promotes deep restful sleep.', 'Do not combine with pharmaceutical sedatives without medical advice.'),
(13, 'Skin Rashes',        'Manjistha & Neem',           4, 2, 'moderate', 4.5, 178, 20, 'Manjistha Blood Purifier',        'Take half tsp Manjistha powder internally in warm water twice daily. Externally, apply neem leaf paste on affected skin. Continue for 4 to 6 weeks.', 'Purifies the blood, soothes rashes, reduces itching, supports liver detoxification.', 'Internal Manjistha may turn urine reddish; this is normal and harmless.'),
(14, 'Poor Digestion',     'Trikatu Churna',             1, 3, 'easy',     4.8, 430, 5,  'Trikatu Digestive Blend',         'Combine equal parts black pepper, dry ginger, and long pepper (pipali) powder. Take quarter tsp with warm water or honey 15 minutes before meals.', 'Ignites digestive fire, improves metabolism, reduces ama (toxins), relieves gas.', 'Not recommended during pregnancy or for those with gastric ulcers.'),
(15, 'Blood Sugar',        'Gymnema & Gudmar',           2, 2, 'easy',     4.6, 195, 10, 'Gymnema Leaf Tea',                'Steep 1 tsp dried Gymnema sylvestre leaves in 1 cup boiling water for 10 minutes. Strain and drink twice daily before meals.', 'Reduces sugar cravings, regenerates pancreatic beta cells, lowers post-prandial glucose.', 'Avoid if you are on insulin therapy without medical supervision.'),
(16, 'Heart Weakness',     'Arjuna & Punarnava',         8, 3, 'advanced', 4.5, 140, 30, 'Arjuna Punarnava Cardio Formula', 'Take Punarnava Mandur tablets (2 twice daily) with Arjuna bark decoction for 3 months under an Ayurvedic physician supervision. Avoid salt and excess fluid.', 'Reduces fluid retention, strengthens cardiac muscles, improves circulatory function, supports kidney health.', 'Advanced formula; do not self-medicate; requires professional Ayurvedic supervision.'),
(17, 'Bronchitis',         'Kantakari & Ginger',         5, 3, 'moderate', 4.6, 210, 20, 'Kantakari Cough Decoction',       'Boil 1 tsp Kantakari root powder and half tsp dry ginger powder in 2 cups water for 15 minutes. Strain and drink warm twice a day.', 'Reduces bronchial inflammation, clears accumulated mucus, eases cough and wheezing.', 'Consult a physician before use during pregnancy or in children under 5.'),
(18, 'Acid Reflux (GERD)', 'Licorice & Amla',            1, 2, 'easy',     4.7, 380, 10, 'Licorice Amla Antacid Blend',     'Mix half tsp licorice (mulethi) powder and half tsp amla powder in 1 cup warm water. Drink 30 minutes after meals.', 'Neutralises excess acid, soothes the oesophagus lining, prevents heartburn.', 'Avoid long-term use of licorice if you have hypertension.'),
(19, 'Knee Joint Pain',    'Shallaki & Guggul',          6, 1, 'moderate', 4.7, 260, 20, 'Guggul Boswellia Joint Formula',  'Take 2 Shallaki-Guggul tablets (500 mg each) with warm water after meals twice daily. For external relief, massage warm sesame oil infused with camphor on the knee joint.', 'Inhibits inflammatory enzymes, reduces swelling, restores knee joint mobility.', 'Guggul may interact with thyroid medications; consult a physician.'),
(20, 'Depression',         'Saffron & Brahmi',           3, 2, 'moderate', 4.8, 420, 15, 'Saffron Brahmi Brain Tonic',      'Melt 1 tsp Brahmi ghee in warm milk; add 4 to 5 saffron strands. Stir and drink in the morning. Alternatively, take Brahmi Vati tablets twice daily.', 'Nourishes the brain, increases serotonin activity, lifts mood, improves cognitive function.', 'Consult a physician if on antidepressant medications.'),
(21, 'Obesity & Weight',   'Triphala & Guggul',          1, 3, 'easy',     4.5, 305, 5,  'Triphala Guggul Detox Formula',   'Take 2 Triphala Guggul tablets with warm water in the morning on an empty stomach and before bedtime.', 'Increases metabolism, reduces fat accumulation, detoxifies the digestive channel.', 'Consult a physician before use; not suitable during pregnancy.'),
(22, 'Anaemia',            'Lohasava & Punarnava',       2, 2, 'moderate', 4.6, 165, 30, 'Loha Rasayana',                   'Take 15 to 20 ml Lohasava with equal parts water after meals twice a day. Supplement with Punarnava Mandur tablets as directed by an Ayurvedic practitioner.', 'Increases haemoglobin and red blood cell production, corrects iron-deficiency anaemia.', 'Consult a qualified practitioner; excess iron can be harmful.'),
(23, 'Immunity Boost',     'Giloy (Guduchi) Stem',       7, 4, 'easy',     4.9, 620, 10, 'Giloy Immunity Juice',            'Blend a 6-inch fresh Giloy stem (crushed) in 1 cup water, strain, and drink 30 ml daily on an empty stomach. Alternatively, boil stem pieces for 15 minutes and drink the decoction.', 'Potent immunomodulator, enhances white blood cell activity, combats chronic infections, reduces fever.', 'Avoid during autoimmune diseases (lupus, MS) without medical supervision.'),
(24, 'Dandruff',           'Methi & Coconut Oil',        4, 3, 'easy',     4.5, 290, 20, 'Fenugreek Coconut Scalp Mask',    'Soak 3 tbsp fenugreek seeds overnight. Grind into a fine paste. Mix with 2 tbsp warm coconut oil. Apply to scalp, leave for 30 to 45 minutes, then wash with mild shampoo.', 'Treats dandruff, soothes scalp inflammation, conditions hair follicles, reduces itching.', 'Strong fenugreek smell dissipates after washing; perform a patch-test first.');

INSERT INTO tags (name) VALUES
  ('Agni Boost'),('Gas Relief'),('Bloating'),('Colon Cleanse'),('Detox'),
  ('Digestive'),('Metabolism'),('Antacid'),('Pitta Pacifying'),('Soothing'),
  ('Weight Loss'),('Kapha Reducing'),('Blood Sugar'),('Anti-diabetic'),('Sugar Control'),
  ('Iron Boost'),('Haemoglobin'),('Adaptogen'),('Calming'),('Rejuvenating'),
  ('Sleep Aid'),('Mood Boost'),('Brain Tonic'),('Antibacterial'),('Anti-inflam'),
  ('Hair Growth'),('Scalp Health'),('Blood Purifier'),('Anti-itch'),('Anti-dandruff'),
  ('Decongestant'),('Immunity'),('Bronchodilator'),('Expectorant'),('Cough Relief'),
  ('Pain Relief'),('Joint Support'),('Cardio'),('BP Control'),('Cardioprotective'),
  ('Diuretic'),('Rasayana'),('All Doshas'),('Immunomodulator'),('Antiviral');

INSERT INTO remedy_tags (remedy_id, tag_id) VALUES
  (1,1),(1,2),(1,3),
  (10,4),(10,5),(10,12),
  (14,6),(14,7),(14,12),
  (18,8),(18,9),(18,10),
  (21,11),(21,12),(21,5),
  (2,13),(2,14),(2,12),
  (15,13),(15,14),(15,15),
  (22,16),(22,17),
  (3,18),(3,19),(3,20),
  (12,21),(12,19),
  (20,22),(20,23),
  (4,24),(4,25),
  (8,26),(8,27),
  (13,28),(13,29),
  (24,30),(24,27),
  (5,31),(5,32),(5,10),
  (9,33),(9,34),
  (17,35),(17,34),
  (6,25),(6,36),
  (19,25),(19,37),
  (7,42),(7,32),(7,43),
  (23,44),(23,45),(23,32),
  (11,38),(11,39),
  (16,40),(16,41);

INSERT INTO quiz_questions (question_no, category, question, hint) VALUES
  (1,  'Body & Physical', 'What is your natural body frame?',                    'Think about your bone structure before any weight changes.'),
  (2,  'Body & Physical', 'How would you describe your skin texture?',           'Consider how your skin feels most of the time.'),
  (3,  'Body & Physical', 'How is your appetite and digestion?',                 'Reflect on your typical digestion, not after indulging.'),
  (4,  'Body & Physical', 'How is your energy level throughout the day?',        'Think about a typical, healthy day for you.'),
  (5,  'Mind & Emotions', 'How do you respond to stress?',                       'Consider your most natural, unrehearsed reaction.'),
  (6,  'Mind & Emotions', 'How is your memory and learning style?',              'Think about how you naturally absorb new information.'),
  (7,  'Mind & Emotions', 'How would you describe your emotional temperament?',  'Reflect on your baseline mood, not during extreme events.'),
  (8,  'Sleep & Rest',    'How is your sleep quality?',                          'Think about your sleep over the past few months.'),
  (9,  'Lifestyle',       'How do you handle cold weather?',                     'Consider your natural preference, not when ill.'),
  (10, 'Lifestyle',       'What best describes your pace of doing things?',      'Think about your natural rhythm, not when under pressure.');

INSERT INTO quiz_options (question_id, option_text, dosha) VALUES
  (1,'Thin, light frame with prominent joints','vata'),
  (1,'Medium, well-proportioned frame with good muscle tone','pitta'),
  (1,'Broad, heavy or stocky frame with strong bones','kapha'),
  (2,'Dry, rough or thin skin that tends to crack','vata'),
  (2,'Soft, warm, oily or sensitive skin prone to redness','pitta'),
  (2,'Thick, smooth, moist and cool skin','kapha'),
  (3,'Variable appetite; can skip meals easily; prone to gas','vata'),
  (3,'Strong, sharp appetite; irritable if meals are missed','pitta'),
  (3,'Steady, slower appetite; can go without food comfortably','kapha'),
  (4,'Variable energy with bursts of enthusiasm followed by fatigue','vata'),
  (4,'Sustained medium-high energy; driven and goal-oriented','pitta'),
  (4,'Steady, consistent energy; slow to start but enduring','kapha'),
  (5,'Anxious, worried or scattered; may overthink','vata'),
  (5,'Irritable, intense or controlling; problem-solving mode','pitta'),
  (5,'Calm and withdrawn; prefer to avoid confrontation','kapha'),
  (6,'Learn quickly but forget quickly; grasp concepts fast','vata'),
  (6,'Sharp, precise, analytical memory; remember details','pitta'),
  (6,'Slow to learn but retain information for a long time','kapha'),
  (7,'Enthusiastic, creative and changeable','vata'),
  (7,'Passionate, intense and focused','pitta'),
  (7,'Calm, patient, loving and steady','kapha'),
  (8,'Light, restless sleep with vivid dreams; wake easily','vata'),
  (8,'Moderate sleep; fall asleep easily but may wake at night','pitta'),
  (8,'Deep, long and heavy sleep; difficult to wake up','kapha'),
  (9,'Very sensitive to cold; crave warmth; cold hands and feet','vata'),
  (9,'Dislike heat more than cold; feel warm most of the time','pitta'),
  (9,'Tolerate cold reasonably; feel heavy or congested in winter','kapha'),
  (10,'Fast-paced, multi-tasking and always on the move','vata'),
  (10,'Decisive and efficient; complete tasks at a moderate-fast pace','pitta'),
  (10,'Slow, deliberate and methodical; prefer one thing at a time','kapha');

-- View (optional, for convenience)
CREATE OR REPLACE VIEW v_remedies AS
SELECT
  r.id, r.disease, r.herb_name,
  c.slug AS category, c.name AS category_name, c.icon AS category_icon,
  d.slug AS dosha_type,
  r.difficulty, r.rating, r.review_count,
  r.prep_time_min, r.title, r.preparation, r.benefits, r.caution
FROM remedies r
JOIN categories c ON c.id = r.category_id
JOIN doshas     d ON d.id = r.dosha_id;
