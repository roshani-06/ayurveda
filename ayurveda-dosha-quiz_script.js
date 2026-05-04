const QUESTIONS = [
   {
    cat: "Body & Physical",
    text: "What is your natural body type?",
    hint: "Think about your body without dieting or exercise.",
    opts: [
      { t: "Thin, find it hard to gain weight", d: "vata" },
      { t: "Medium body, gain and lose weight easily", d: "pitta" },
      { t: "Broad/heavy body, gain weight easily", d: "kapha" }
    ]
  },
  {
    cat: "Body & Physical",
    text: "How is your skin?",
    hint: "Your natural skin without products.",
    opts: [
      { t: "Dry, rough, cracks easily", d: "vata" },
      { t: "Oily, sensitive, gets acne", d: "pitta" },
      { t: "Smooth, soft, slightly oily", d: "kapha" }
    ]
  },
  {
    cat: "Body & Physical",
    text: "How is your hair naturally?",
    hint: "Before any treatment or styling.",
    opts: [
      { t: "Dry, frizzy, breaks easily", d: "vata" },
      { t: "Thin, oily, early greying", d: "pitta" },
      { t: "Thick, shiny, strong", d: "kapha" }
    ]
  },
  {
    cat: "Digestion & Appetite",
    text: "How is your appetite?",
    hint: "Think about most days.",
    opts: [
      { t: "Irregular, sometimes very hungry", d: "vata" },
      { t: "Strong hunger, cannot skip meals", d: "pitta" },
      { t: "Normal, can skip meals easily", d: "kapha" }
    ]
  },
  {
    cat: "Digestion & Appetite",
    text: "How is your digestion?",
    hint: "Your usual digestion pattern.",
    opts: [
      { t: "Gas, bloating, constipation", d: "vata" },
      { t: "Acidity or loose motion", d: "pitta" },
      { t: "Slow but regular digestion", d: "kapha" }
    ]
  },
  {
    cat: "Mind & Emotions",
    text: "How does your mind work?",
    hint: "Your normal thinking style.",
    opts: [
      { t: "Fast, creative but easily distracted", d: "vata" },
      { t: "Focused, logical, goal-oriented", d: "pitta" },
      { t: "Calm, slow but strong memory", d: "kapha" }
    ]
  },
  {
    cat: "Mind & Emotions",
    text: "How do you react to stress?",
    hint: "Your first reaction.",
    opts: [
      { t: "Worry, anxiety", d: "vata" },
      { t: "Anger, irritation", d: "pitta" },
      { t: "Quiet, sad, withdraw", d: "kapha" }
    ]
  },
  {
    cat: "Sleep & Energy",
    text: "How is your sleep?",
    hint: "Without alarms or medicines.",
    opts: [
      { t: "Light sleep, wake up often", d: "vata" },
      { t: "Normal sleep, sometimes dreams", d: "pitta" },
      { t: "Deep sleep, hard to wake up", d: "kapha" }
    ]
  },
  {
    cat: "Sleep & Energy",
    text: "How is your energy level?",
    hint: "Your daily natural energy.",
    opts: [
      { t: "Energy comes and goes", d: "vata" },
      { t: "Steady energy, gets tired after work", d: "pitta" },
      { t: "Slow start but long-lasting energy", d: "kapha" }
    ]
  },
  {
    cat: "Work & Decision",
    text: "How do you work or study?",
    hint: "Your natural working style.",
    opts: [
      { t: "Start excited but lose interest", d: "vata" },
      { t: "Focused, competitive, goal-driven", d: "pitta" },
      { t: "Slow start but consistent and finish work", d: "kapha" }
    ]
  }
];

const DOSHA_DATA = {
  vata:{
    name:"Vata",icon:"&#127811;",element:"Air & Space",color:"var(--vata)",bgColor:"var(--vata-bg)",midColor:"var(--vata-mid)",
    badge_bg:"#eaf3de",badge_color:"#27500a",badge_border:"#c8e6b8",
    desc:"Vata is the dosha of movement and change. As the dominant force in your constitution, you are naturally creative, enthusiastic, and quick-thinking. You tend toward a light frame, variable appetite, and an active, imaginative mind. When in balance, Vata brings vitality and inspiration. When disturbed, anxiety, dryness, and inconsistency arise.", herbs:["Ashwagandha","Shatavari","Sesame","Licorice","Haritaki","Brahmi","Bala","Ghee"],
    herbColors:["prop-g","prop-t","prop-a","prop-t","prop-a","prop-b","prop-g","prop-a"],
    eat_favour:["Warm, cooked, oily foods","Sweet, sour, salty tastes","Ghee and nourishing oils","Root vegetables, grains","Warm soups and stews","Warm spiced milk"],
    eat_reduce:["Raw salads and cold food","Dry, light, crunchy snacks","Caffeine and stimulants","Fasting or skipping meals","Cold beverages","Astringent and bitter excess"],
    lifestyle:["Maintain regular daily routine (Dinacharya)","Daily Abhyanga (warm oil self-massage)","Go to bed before 10 PM consistently","Favour gentle, grounding yoga and walking","Meditate daily to quiet the racing mind","Avoid over-scheduling and multitasking"],
    balance:["Sesame oil massage daily","Warm baths with calming herbs","Reduced screen time before bed","Journalling to settle mental chatter","Regular meals at consistent times","Gentle pranayama: Nadi Shodhana"],
  },
  pitta:{
    name:"Pitta",icon:"&#128293;",element:"Fire & Water",color:"var(--pitta)",bgColor:"var(--pitta-bg)",midColor:"var(--pitta-mid)",
    badge_bg:"#faeeda",badge_color:"#633806",badge_border:"#f5cc80",
    desc:"Pitta is the dosha of transformation and metabolism. As the dominant force in your constitution, you possess a sharp, penetrating mind, strong digestion, and natural leadership ability. You are goal-oriented, articulate, and intensely focused. When in balance, Pitta brings clarity, courage, and brilliant intelligence. When disturbed, anger, inflammation, and perfectionism arise.", herbs:["Shatavari","Brahmi","Amalaki","Neem","Coriander","Manjistha","Guduchi","Triphala"],
    herbColors:["prop-p","prop-b","prop-g","prop-g","prop-t","prop-p","prop-t","prop-g"],
    eat_favour:["Cool, refreshing, slightly raw foods","Sweet, bitter, astringent tastes","Coconut, coriander, fennel","Cooling dairy like milk and ghee","Seasonal fruits, leafy greens","Rose water, hibiscus, mint tea"],
    eat_reduce:["Spicy, hot, oily, fried foods","Alcohol, vinegar, fermented foods","Excess salt and sour tastes","Coffee and stimulants","Red meat and eggs in excess","Eating when angry or stressed"],
    lifestyle:["Avoid overworking and perfectionism","Spend time in nature near water","Moderate, refreshing exercise (swimming)","Practice non-competitive meditation","Take regular breaks from intense focus","Cultivate patience and compassion"],
    balance:["Coconut oil head massage on weekends","Moonlight walks in the evening","Daily journalling to release perfectionism","Cool showers after exercise","Pitta-pacifying herbs in warm milk","Sitali pranayama (cooling breath)"],
  },
  kapha:{
    name:"Kapha",icon:"&#128167;",element:"Earth & Water",color:"var(--kapha)",bgColor:"var(--kapha-bg)",midColor:"var(--kapha-mid)",
    badge_bg:"#deeaf8",badge_color:"#0c447c",badge_border:"#a8c8f0",
    desc:"Kapha is the dosha of structure and nourishment. As the dominant force in your constitution, you are grounded, patient, and deeply compassionate. You have a strong, enduring build, excellent long-term memory, and a calm, nurturing presence. When in balance, Kapha provides stability, love, and remarkable endurance. When disturbed, lethargy, attachment, and weight gain arise.", herbs:["Trikatu","Guggul","Neem","Ginger","Turmeric","Triphala","Chitrak","Vidanga"],
    herbColors:["prop-r","prop-a","prop-g","prop-a","prop-a","prop-g","prop-r","prop-r"],
    eat_favour:["Light, dry, warm, spiced foods","Pungent, bitter, astringent tastes","Ginger, black pepper, turmeric","Legumes, leafy greens, millets","Honey (not heated) as a sweetener","Light soups with stimulating spices"],
    eat_reduce:["Heavy, oily, sweet, cold foods","Excess dairy (milk, cheese, cream)","Wheat and refined carbohydrates","Ice cream, sweets, desserts","Oversleeping and sedentary habits","Eating when not truly hungry"],
    lifestyle:["Wake before sunrise — avoid oversleeping","Vigorous daily exercise (running, yoga)","Seek new experiences and stimulation","Reduce attachment to people and things","Declutter your physical environment","Use dry brush massage (Garshana)"],
    balance:["Dry powder massage (Udwartana) weekly","Invigorating kapha-stimulating yoga","Reduce daytime napping completely","Enjoy stimulating and lively company","Trikatu tea before meals to ignite Agni","Kapalabhati pranayama every morning"],
  },
};

let answers = new Array(QUESTIONS.length).fill(null);
let currentQ = 0;
let scores = {vata:0,pitta:0,kapha:0};

function startQuiz(){
  document.getElementById('intro-screen').style.display='none';
  document.getElementById('quiz-screen').style.display='block';
  renderQuestion(0);
  window.scrollTo(0,0);
}

function renderQuestion(idx){
  const q = QUESTIONS[idx];
  const letters = ['A','B','C'];
  const dClasses = ['vata-opt','pitta-opt','kapha-opt'];
  const dTags = ['vata-tag','pitta-tag','kapha-tag'];
  const dLabels = ['Vata','Pitta','Kapha'];
  const dScores = ['vata','pitta','kapha'];

  document.getElementById('q-num').textContent = `Question ${String(idx+1).padStart(2,'0')}`;
  document.getElementById('q-text').textContent = q.text;
  document.getElementById('q-hint').textContent = q.hint;
  document.getElementById('q-cat-pill').innerHTML = `&#127807; ${q.cat}`;

  const pct = Math.round((idx/QUESTIONS.length)*100);
  document.getElementById('progress-fill').style.width = pct+'%';
  document.getElementById('prog-label').textContent = `Question ${idx+1} of ${QUESTIONS.length}`;
  document.getElementById('prog-pct').textContent = pct+'%';

  const wrap = document.getElementById('options-wrap');
  wrap.innerHTML = q.opts.map((o,i)=>{
    const dc = dScores.indexOf(o.d);
    const sel = answers[idx]===i ? 'selected' : '';
    return `<div class="option ${dClasses[dc]} ${sel}" onclick="selectOption(${i})">
      <div class="option-indicator"></div>
      <div class="option-content">
        <div class="option-letter">${letters[i]}</div>
        <div class="option-text">${o.t}</div>
        <span class="option-dosha-tag ${dTags[dc]}">${dLabels[dc]}</span>
      </div>
    </div>`;
  }).join('');

  const nextBtn = document.getElementById('next-btn');
  nextBtn.disabled = answers[idx]===null;
  nextBtn.textContent = idx===QUESTIONS.length-1 ? 'See My Results ✦' : 'Next →';

  document.getElementById('lt-v').textContent = scores.vata;
  document.getElementById('lt-p').textContent = scores.pitta;
  document.getElementById('lt-k').textContent = scores.kapha;
}

function selectOption(i){
  const prev = answers[currentQ];
  const q = QUESTIONS[currentQ];
  if(prev!==null){
    const prevD = q.opts[prev].d;
    scores[prevD]--;
  }
  answers[currentQ] = i;
  const d = q.opts[i].d;
  scores[d]++;

  document.getElementById('lt-v').textContent=scores.vata;
  document.getElementById('lt-p').textContent=scores.pitta;
  document.getElementById('lt-k').textContent=scores.kapha;

  document.querySelectorAll('.option').forEach((el,j)=>{
    el.classList.toggle('selected',j===i);
  });
  document.getElementById('next-btn').disabled=false;

  setTimeout(()=>{
    if(currentQ<QUESTIONS.length-1) nextQuestion();
  },520);
}

function nextQuestion(){
  if(answers[currentQ]===null && currentQ<QUESTIONS.length-1){
    currentQ++; renderQuestion(currentQ); return;
  }
  if(currentQ===QUESTIONS.length-1){
    showResults(); return;
  }
  const card=document.getElementById('q-card');
  card.style.animation='slideOut .25s ease both';
  setTimeout(()=>{
    currentQ++;
    card.style.animation='slideIn .35s ease both';
    renderQuestion(currentQ);
    window.scrollTo({top:document.getElementById('quiz-screen').offsetTop-100,behavior:'smooth'});
  },220);
}

function goBack(){
  if(currentQ===0){
    document.getElementById('quiz-screen').style.display='none';
    document.getElementById('intro-screen').style.display='flex';
    return;
  }
  const prev=answers[currentQ-1];
  const q=QUESTIONS[currentQ-1];
  if(prev!==null){scores[q.opts[prev].d]--; answers[currentQ-1]=null;}
  if(answers[currentQ]!==null){scores[QUESTIONS[currentQ].opts[answers[currentQ]].d]--; answers[currentQ]=null;}
  currentQ--;
  const card=document.getElementById('q-card');
  card.style.animation='none';
  void card.offsetWidth;
  card.style.animation='slideIn .35s ease both';
  renderQuestion(currentQ);
}

function skipQuestion(){
  if(currentQ<QUESTIONS.length-1){
    currentQ++; renderQuestion(currentQ);
  } else { showResults(); }
}

function showResults(){
  document.getElementById('quiz-screen').style.display='none';
  document.getElementById('result-screen').style.display='block';
  window.scrollTo(0,0);

  const total=scores.vata+scores.pitta+scores.kapha||1;
  const pcts={
    vata:Math.round((scores.vata/total)*100),
    pitta:Math.round((scores.pitta/total)*100),
    kapha:Math.round((scores.kapha/total)*100),
  };

  const primary = Object.keys(scores).reduce((a,b)=>scores[a]>scores[b]?a:b);
  const sorted = Object.keys(scores).sort((a,b)=>scores[b]-scores[a]);
  const secondary = sorted[1];
  const d = DOSHA_DATA[primary];
  const ds = DOSHA_DATA[secondary];

  // Style result hero
  const hero=document.getElementById('result-hero');
  hero.style.background = primary==='vata'
    ? 'linear-gradient(135deg,#eaf3de 0%,#f5f0e8 60%)'
    : primary==='pitta'
    ? 'linear-gradient(135deg,#faeeda 0%,#f5f0e8 60%)'
    : 'linear-gradient(135deg,#deeaf8 0%,#f5f0e8 60%)';

  const badge=document.getElementById('result-badge');
  badge.textContent='Your Prakriti';
  badge.style.cssText=`background:${d.badge_bg};color:${d.badge_color};border-color:${d.badge_border}`;

  document.getElementById('result-icon').innerHTML=d.icon;
  document.getElementById('result-title').innerHTML=`You are <span style="color:${d.color}">${d.name}</span>`;
  document.getElementById('result-sub').textContent=d.tagline;

  // Bars
  const barsEl=document.getElementById('dosha-bars');
  const doshas=[
    {key:'vata',label:'Vata',cls:'dbf-v'},
    {key:'pitta',label:'Pitta',cls:'dbf-p'},
    {key:'kapha',label:'Kapha',cls:'dbf-k'},
  ];
  barsEl.innerHTML=doshas.map(x=>`
    <div class="dbar-wrap${x.key===primary?' primary':''}">
      <div class="dbar-label">${x.label}</div>
      <div class="dbar-track">
        <div class="dbar-fill ${x.cls}" id="bar-${x.key}"></div>
      </div>
      <div class="dbar-pct" style="color:${DOSHA_DATA[x.key].color}">${pcts[x.key]}%</div>
    </div>`).join('');

  setTimeout(()=>{
    doshas.forEach(x=>{
      const el=document.getElementById('bar-'+x.key);
      if(el) el.style.height=pcts[x.key]+'%';
    });
  },200);

  // Build result body sections

  const herbChipsHtml=d.herbs.map((h,i)=>`
    <span class="herb-chip" style="background:${d.badge_bg};color:${d.badge_color};border-color:${d.badge_border}">${h}</span>`).join('');

  const eatFavourHtml=d.eat_favour.map(x=>`<li>${x}</li>`).join('');
  const eatReduceHtml=d.eat_reduce.map(x=>`<li>${x}</li>`).join('');
  const lifestyleHtml=d.lifestyle.map(x=>`<li>${x}</li>`).join('');
  const balanceHtml=d.balance.map((t,i)=>{
    const icons=['&#127806;','&#129754;','&#128214;','&#127774;','&#127807;','&#127775;'];
    return `<div class="tip-item">
      <span class="tip-ico">${icons[i]||'✦'}</span>
      <div class="tip-text"><strong>${t.split(' ').slice(0,3).join(' ')}</strong>${t}</div>
    </div>`;
  }).join('');

  const secScorePct = pcts[secondary];
  const combinedNote = secScorePct>=28
    ? `Your constitution shows a notable ${DOSHA_DATA[secondary].name} influence (${secScorePct}%). You may benefit from guidance for both doshas.`
    : `${DOSHA_DATA[secondary].name} is your secondary dosha (${secScorePct}%) and plays a smaller supportive role in your constitution.`;

  document.getElementById('result-body').innerHTML=`
    <div class="res-section" style="animation-delay:.05s">
      <div class="res-section-title">&#129504; Your ${d.name} constitution</div>
      <p style="font-size:13px;color:var(--muted);line-height:1.75">${d.desc}</p>
    </div>

    <div class="res-section" style="animation-delay:.15s">
      <div class="res-section-title">&#127807; Best herbs for your dosha</div>
      <div class="herb-chips">${herbChipsHtml}</div>
      <p style="font-size:11px;color:var(--muted);margin-top:10px;font-style:italic">These herbs are traditionally recommended to balance ${d.name} dosha. Consult an Ayurvedic practitioner before beginning any herbal protocol.</p>
    </div>

    <div class="res-section" style="animation-delay:.2s">
      <div class="res-section-title">&#127869;&#65039; Dietary guidance for ${d.name}</div>
      <div class="rec-grid">
        <div class="rec-card">
          <div class="rc-label">&#9989; Favour these foods</div>
          <ul class="rc-items">${eatFavourHtml}</ul>
        </div>
        <div class="rec-card">
          <div class="rc-label">&#128683; Reduce or avoid</div>
          <ul class="rc-items">${eatReduceHtml}</ul>
        </div>
      </div>
    </div>

    <div class="res-section" style="animation-delay:.25s">
      <div class="res-section-title">&#127775; Lifestyle recommendations</div>
      <div class="rec-grid">
        <div class="rec-card">
          <div class="rc-label">&#128161; Daily practices</div>
          <ul class="rc-items">${lifestyleHtml}</ul>
        </div>
        <div class="rec-card">
          <div class="rc-label">&#9881;&#65039; Balance rituals</div>
          <div class="tips-list">${balanceHtml}</div>
        </div>
      </div>
    </div>

    <div class="retake-wrap">
      <button class="retake-btn" onclick="retakeQuiz()">
        &#8635; Retake the Quiz
      </button>
      <div class="share-row">
        <button class="share-btn" onclick="copyResult('${d.name}',${pcts[primary]})">&#128203; Copy my result</button>
        <button class="share-btn" onclick="window.location.href='/remedies'">&#127806; Explore ${d.name} herbs</button>
      </div>
    </div>`;

  document.querySelectorAll('.res-section').forEach((el,i)=>{
    setTimeout(()=>el.classList.add('visible'),i*80);
  });
}

function retakeQuiz(){
  answers=new Array(QUESTIONS.length).fill(null);
  scores={vata:0,pitta:0,kapha:0};
  currentQ=0;
  document.getElementById('result-screen').style.display='none';
  document.getElementById('intro-screen').style.display='flex';
  window.scrollTo(0,0);
}

function copyResult(name,pct){
  const text=`I just took the AyurVeda Dosha Quiz and discovered I am predominantly ${name} (${pct}%). Discover your Prakriti at AyurVeda!`;
  if(navigator.clipboard){
    navigator.clipboard.writeText(text).then(()=>alert('Result copied to clipboard!'));
  } else {
    const ta=document.createElement('textarea');
    ta.value=text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    alert('Result copied!');
  }
}