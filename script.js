/* ============ TRADEWITHDZUNG — script.js ============ */
const WA_NUMBER = "255745199576";

/* ---------- Animated canvas background (hero) ---------- */
(function(){
  const cv = document.getElementById("fx");
  if(!cv) return;
  const ctx = cv.getContext("2d");
  let W, H, waves = [];

  function resize(){
    W = cv.width = cv.offsetWidth;
    H = cv.height = cv.offsetHeight;
    waves = Array.from({length:4}, (_, index) => ({
      offset:index * 1.7,
      speed:.006 + index * .001,
      height:H * (.07 + index * .025),
      baseline:H * (.28 + index * .16)
    }));
  }
  resize();
  window.addEventListener("resize", resize);

  (function loop(){
    ctx.clearRect(0,0,W,H);
    waves.forEach(wave => {
      ctx.beginPath();
      for(let x=0; x<=W; x+=12){
        const y = wave.baseline + Math.sin(x * wave.speed + wave.offset) * wave.height;
        if(x === 0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);
      }
      ctx.strokeStyle = "rgba(143,181,39,.22)";
      ctx.lineWidth = 2;
      ctx.stroke();
      wave.offset += .012;
    });
    requestAnimationFrame(loop);
  })();
})();

/* ---------- Mobile nav ---------- */
const burger = document.querySelector(".burger");
const links  = document.querySelector(".nav .links");
if(burger){
  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    links.classList.toggle("open");
  });
}

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
}), {threshold:.12});
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* ---------- Live-ish ticker chips ---------- */
(function(){
  const data = {
    "XAUUSD": 2387.42, "BTCUSD": 64120.5, "NAS100": 17890.2, "EURUSD": 1.0862
  };
  document.querySelectorAll(".chip").forEach(c => {
    const sym = c.dataset.sym, el = c.querySelector(".prc"), dir = c.querySelector(".dir");
    if(!sym || !el) return;
    let base = data[sym] || 100;
    setInterval(() => {
      const chg = (Math.random()-.5) * base * 0.0012;
      const v = base + chg;
      el.textContent = v.toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2});
      dir.textContent = (chg>=0?"▲ ":"▼ ") + Math.abs(chg).toFixed(2);
      dir.className = "dir " + (chg>=0?"up":"dn");
      base = v;
    }, 1600);
  });
})();

/* ---------- Animated counters ---------- */
(function(){
  const nums = document.querySelectorAll(".num[data-count]");
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if(!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, suf = el.dataset.suffix || "";
    const t0 = performance.now(), dur = 1800;
    (function tick(t){
      const p = Math.min((t-t0)/dur, 1), ease = 1-Math.pow(1-p,3);
      el.textContent = Math.round(target*ease).toLocaleString() + suf;
      if(p<1) requestAnimationFrame(tick);
    })(t0);
    cio.unobserve(el);
  }), {threshold:.4});
  nums.forEach(n => cio.observe(n));
})();

/* ---------- WhatsApp form helper ---------- */
function buildWA(fields, heading){
  const lines = [heading, "------------------------------"];
  fields.forEach(([k,v]) => { if(v) lines.push(`${k}: ${v}`); });
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
function bindForm(formId, heading, okId){
  const f = document.getElementById(formId);
  if(!f) return;
  f.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(f);
    const fields = [];
    for(const [k,v] of fd.entries()){
      if(k === "services" || k === "ea"){
        const all = fd.getAll(k).join(", ");
        if(!fields.some(x => x[0]===k)) fields.push([k==="services"?"Service(s) wanted":"EA(s) interested in", all]);
      } else {
        fields.push([k, v]);
      }
    }
    window.open(buildWA(fields, heading), "_blank");
    const ok = document.getElementById(okId);
    if(ok){ ok.style.display = "block"; f.reset(); }
  });
}

/* Account & Management form */
bindForm("acctForm", "NEW CLIENT — ACCOUNT & MANAGEMENT", "acctOk");

/* EA inquiry form */
bindForm("eaForm", "NEW EA INQUIRY — TRADEWITHDZUNG", "eaOk");

/* Education registration form */
bindForm("educationForm", "NEW EDUCATION REGISTRATION — TRADEWITHDZUNG", "educationOk");

document.querySelectorAll("[data-education-package]").forEach(btn => {
  btn.addEventListener("click", () => {
    const form = document.getElementById("educationForm");
    const packageField = document.getElementById("educationPackage");
    if(!form || !packageField) return;
    packageField.value = btn.dataset.educationPackage;
    form.scrollIntoView({behavior:"smooth"});
  });
});

/* EA card "Enquire" buttons → preselect EA + scroll to form */
document.querySelectorAll("[data-ea-pick]").forEach(btn => {
  btn.addEventListener("click", () => {
    const cb = document.querySelector(`input[name="ea"][value="${btn.dataset.eaPick}"]`);
    if(cb) cb.checked = true;
    document.getElementById("eaForm").scrollIntoView({behavior:"smooth"});
  });
});