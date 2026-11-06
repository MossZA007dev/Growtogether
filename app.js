'use strict';

const icons = {
  sparkle:'<path d="M12 2c0 6-4 10-10 10 6 0 10 4 10 10 0-6 4-10 10-10-6 0-10-4-10-10Z"/><path d="M19 3v4m-2-2h4"/>',
  home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-6h6v6"/>',
  scan:'<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3M9 10h.01m6 0h.01m-6 5q3 3 6 0"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  user:'<circle cx="12" cy="8" r="3.4"/><path d="M5 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2"/>',
  heart:'<path d="M20.8 4.6a5 5 0 0 0-7.1 0L12 6.3l-1.7-1.7a5 5 0 0 0-7.1 7.1l8.8 8.8 8.8-8.8a5 5 0 0 0 0-7.1Z"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
  moon:'<path d="M20.9 13.4A9 9 0 0 1 10.6 3.1 9 9 0 1 0 20.9 13.4Z"/>',
  drop:'<path d="M12 3C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-12Z"/><path d="M8 15a4 4 0 0 0 3 4"/>',
  cream:'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2M4 12h16m-10 4h4"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
  camera:'<path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="3"/>'
};
const icon = (name) => '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">'+icons[name]+'</svg>';
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const $ = (id) => document.getElementById(id);
const routes = {home:['home','วันนี้'], skin:['scan','เช็กผิว'], calendar:['calendar','ปฏิทิน'], goals:['target','เป้าหมาย'], profile:['user','โปรไฟล์'], body:null, routine:null, reminders:null, review:null, share:null, shared:null};
const periods = {am:'ตอนเช้า',pm:'ก่อนนอน'};
const maxSteps = 8;
const skinTypes = {balanced:'ผิวสมดุล', dry:'ผิวแห้ง', oily:'ผิวมัน', combo:'ผิวผสม', unsure:'ยังไม่แน่ใจ'};
const concerns = {
  glow:{label:'ผิวดูชุ่มชื้น ฉ่ำใส', message:'ถ่ายรูปในแสงเดิมสัปดาห์ละครั้งและจดว่าผิวตึงน้อยลงไหม', detail:'เริ่มจากมอยส์เจอไรเซอร์ที่ใช้ได้สม่ำเสมอและกันแดดทุกเช้า เลือกเนื้อสัมผัสที่ชอบแล้วสังเกตว่าผิวรู้สึกสบายขึ้นไหม'},
  moisture:{label:'ผิวชุ่มชื้น', message:'สังเกตว่าผิวตึงหรือลอกน้อยลงหลังล้างหน้า', detail:'เลือกมอยส์เจอไรเซอร์ที่มีกลีเซอรีนหรือเซราไมด์ ทาบนผิวหมาดเพื่อกักความชุ่มชื้น ถ้ายังตึง ให้ลองเนื้อครีมเฉพาะบริเวณแห้ง'},
  acne:{label:'สิวลดลง', message:'สังเกตว่ามีสิวใหม่ลดลงจากสัปดาห์ก่อนหรือไม่', detail:'เลือกสูตรระบุว่า non-comedogenic ล้างหน้าเบา ๆ และเลี่ยงการสครับหรือบีบสิว หากสิวยังขึ้นต่อเนื่อง ปวด หรือทิ้งแผลเป็น ให้ปรึกษาแพทย์ผิวหนังเพื่อเลือกการรักษา'},
  spots:{label:'รอยดูจางลง', message:'ถ่ายรูปสัปดาห์ละครั้งด้วยแสงและมุมเดิมเพื่อเทียบรอย', detail:'ใช้กันแดด broad spectrum SPF 30 ขึ้นไปทุกเช้า กันแดดแบบมีสีที่มี iron oxides เป็นอีกตัวเลือกสำหรับรอยคล้ำ ทาซ้ำทุก 2 ชั่วโมงขณะอยู่กลางแจ้งและหลังว่ายน้ำหรือเหงื่อออก'},
  calm:{label:'ผิวระคายเคืองน้อยลง', message:'จดว่าผิวแสบ แดง หรือคันหลังใช้ผลิตภัณฑ์ตัวไหน', detail:'เลือกคลีนเซอร์และมอยส์เจอไรเซอร์ที่ระบุว่า fragrance-free เริ่มทีละตัวและทดสอบกับผิวบริเวณเล็ก ๆ ก่อน งดสครับหรือผลัดเซลล์ผิวช่วงที่ระคายเคือง'},
  faceBody:{label:'ผิวหน้าและผิวกายดูกระจ่างใสขึ้น', message:'เลือกจุดที่อยากติดตามบนหน้าและผิวกาย แล้วถ่ายเทียบในแสงเดิม', detail:'เน้นให้รอยคล้ำและสีผิวที่ไม่สม่ำเสมอดูดีขึ้นตามสีผิวธรรมชาติ ทากันแดด SPF 30 ขึ้นไปที่หน้า คอ และผิวกายที่เสื้อผ้าไม่ปิดก่อนออกแดด'},
  eyes:{label:'ขอบตาดำดูจางลง', message:'ถ่ายเทียบในแสงและมุมเดิม พร้อมจดว่าช่วงนั้นนอนพอไหม', detail:'ขอบตาคล้ำเกิดได้หลายสาเหตุ เช่น พันธุกรรม ภูมิแพ้ หรือพักผ่อนน้อย เริ่มจากนอนให้พอและหลีกเลี่ยงการขยี้ตา'},
  custom:{label:'เป้าหมายอื่น ๆ', message:'เลือกหนึ่งอย่างที่สังเกตได้ แล้วจดเทียบสัปดาห์ละครั้ง', detail:'ใช้แผนพื้นฐานจากสภาพผิวที่ตอบไว้ และเก็บเป้าหมายที่พิมพ์ไว้สำหรับติดตามผลหรือใช้ถาม ChatGPT เพิ่ม'}
};
const skinGoalLabel = (a) => a.concern==='custom' ? a.extraGoal : concerns[a.concern].label;
const extraSkinGoal = (a) => a.concern==='custom' ? '' : (a.extraGoal ?? '');
const prefs = {
  dry:['คลีนเซอร์เนื้อครีมหรือโลชันที่อ่อนโยน ล้างแล้วไม่ตึง','มอยส์เจอไรเซอร์เนื้อครีมที่มีกลีเซอรีนหรือเซราไมด์','กันแดดเนื้อโลชันที่ให้ความชุ่มชื้น'],
  oily:['คลีนเซอร์เจลอ่อนโยน ใช้ปลายนิ้วล้างและซับเบา ๆ','มอยส์เจอไรเซอร์เนื้อเจลหรือโลชันบางเบา สูตร non-comedogenic','กันแดดเนื้อบางเบา สูตร non-comedogenic'],
  combo:['คลีนเซอร์อ่อนโยนที่ใช้ได้ทั้งแก้มและทีโซน','โลชันเนื้อเบาทั่วหน้า เพิ่มครีมเฉพาะบริเวณที่แห้ง','กันแดดเนื้อโลชันบางเบาที่เกลี่ยได้ทั่วหน้า'],
  balanced:['คลีนเซอร์อ่อนโยนที่ล้างแล้วผิวสบาย','มอยส์เจอไรเซอร์เนื้อโลชันที่ผิวรู้สึกสบาย','กันแดดเนื้อที่ใช้ได้สม่ำเสมอ'],
  unsure:['คลีนเซอร์อ่อนโยน ลองสังเกตความตึงหรือมันหลังล้าง','มอยส์เจอไรเซอร์สูตรเรียบง่าย เริ่มจากเนื้อโลชัน','กันแดดเนื้อที่ผิวรู้สึกสบาย']
};

const storageKey = 'glow-together.v1';
const backupFormat = 'glow-together-backup';
const maxFacePhotos = 30;
const newProfile = (name) => ({name, answers:null, goal:'', goalDate:'', days:{}, logs:[], photos:[]});
let state = {active:0, people:[newProfile('ฉัน'),newProfile('แฟน')]};
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved?.people?.length === 2) state = saved;
} catch {}
let period = 'am';
let page = 'home';
let toastTimer;
let draft;
let showCompleted = false;
let showSkipped = false;
const current = () => state.people[state.active];
const dayKey = (date = new Date()) => [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
const thaiDate = (key, options = {day:'numeric',month:'long'}) => new Intl.DateTimeFormat('th-TH',options).format(new Date(key+'T12:00:00'));
const avatar = (profile, index) => '<span class="avatar '+(index ? 'other':'')+'">'+esc(Array.from(profile.name)[0])+'</span>';
const bar = (value, total = 5) => '<div class="progress" role="progressbar" aria-label="ขั้นตอนที่ทำแล้ว" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+value+'"><i style="width:'+Math.round(value/total*100)+'%"></i></div>';
const validId = (id) => typeof id==='string' && /^[a-z0-9-]{1,64}$/i.test(id);
const jpeg = (value) => typeof value==='string' && /^data:image\/jpeg;base64,[a-z0-9+/]+=*$/i.test(value);

function notify(message) {
  $('toast').textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('toast').textContent = ''; }, 3300);
}
function update(change, message) {
  const previous = structuredClone(state);
  change();
  try {
    archiveToday(current());
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    state = previous;
    notify('บันทึกไม่ได้ พื้นที่ของเบราว์เซอร์อาจเต็มหรือถูกปิดใช้งาน');
    return false;
  }
  render();
  if (message) notify(message);
  return true;
}
function downloadBackup() {
  downloadFile(JSON.stringify({format:backupFormat,version:1,state}),'application/json','Glow-Together-Backup-'+dayKey()+'.json');
}
function downloadFile(contents, type, filename) {
  const blob = new Blob([contents], {type});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function readBackup(backup) {
  const date = (value) => typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value+'T12:00:00'));
  const string = (value, max) => typeof value==='string' && value.length<=max;
  const record = (value) => value && typeof value==='object' && !Array.isArray(value);
  const entry = (value) => record(value) && validId(value.id) && date(value.date);
  const ids = (items) => Array.isArray(items) && items.length<=maxSteps && items.every(validId) &&
    new Set(items).size===items.length;
  const day = (value) => record(value) && Object.keys(periods).every(time => ids(value[time])) &&
    (value.planned===undefined || (record(value.planned) &&
      Object.keys(periods).every(time => ids(value.planned[time]) && value.planned[time].length)));
  const clock = (value) => typeof value==='string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
  const plan = (value) => record(value) && clock(value.time) && Array.isArray(value.items) &&
    value.items.length>0 && ids(value.items.map(item=>item?.id)) &&
    value.items.every(item=>string(item.title,60) && item.title.trim() &&
      string(item.product,80) && string(item.detail,220) &&
      (item.time==='' || clock(item.time)) && (item.photo==='' || jpeg(item.photo)));
  const plans = (value) => record(value) && Object.keys(periods).every(time =>
    value[time]===undefined || plan(value[time]));
  const habitItem = (h) => record(h) && validId(h.id) && string(h.title,60) && h.title.trim() &&
    (h.time==='' || clock(h.time)) && string(h.detail,160);
  const schedule = (h) => habitItem(h) && date(h.since) && Array.isArray(h.days) &&
    (h.once ? date(h.once) && !h.days.length :
      h.once==='' && h.days.length>0 && new Set(h.days).size===h.days.length &&
      h.days.every(day=>allWeekdays.includes(day)));
  const uniqueItems = (items,test) => Array.isArray(items) && items.every(test) &&
    new Set(items.map(h=>h.id)).size===items.length;
  const taskHistory = (tasks) => Array.isArray(tasks) && tasks.every(task=>
    record(task) && validId(task.id) && (task.slot==='' || Object.hasOwn(periods,task.slot)) &&
    string(task.title,60) && string(task.product,80) && string(task.detail,220) &&
    (task.time==='' || clock(task.time))) && new Set(tasks.map(taskKey)).size===tasks.length;
  const personal = (p) => record(p) && Object.entries(preferences).every(([key,values])=>
    Object.hasOwn(values,p[key])) && string(p.current,180) && string(p.avoid,180);
  const validProfile = (p) => record(p) && string(p.name,24) && p.name.trim() &&
    string(p.goal,100) && (p.goalDate==='' || date(p.goalDate)) &&
    (p.answers===null || (record(p.answers) && Object.hasOwn(skinTypes,p.answers.type) &&
      Object.hasOwn(concerns,p.answers.concern) && ['yes','no','unsure'].includes(p.answers.reaction) &&
      p.answers.sensitive===(p.answers.reaction==='yes') &&
      (p.answers.extraGoal===undefined || string(p.answers.extraGoal,100)) &&
      (p.answers.concern!=='custom' || Boolean(p.answers.extraGoal?.trim())))) &&
    record(p.days) && Object.entries(p.days).every(([key,value])=>date(key) && day(value)) &&
    Array.isArray(p.logs) && p.logs.every(log=>entry(log) && string(log.text,350)) &&
    Array.isArray(p.photos) && p.photos.length<=maxFacePhotos && p.photos.every(photo=>entry(photo) && jpeg(photo.src) &&
      (photo.note===undefined || string(photo.note,180))) &&
    (p.routine===undefined || plans(p.routine)) &&
    (p.todayRoutine===undefined || (plans(p.todayRoutine) && date(p.todayRoutine.date))) &&
    (p.morningStart===undefined || (record(p.morningStart) && date(p.morningStart.date) &&
      clock(p.morningStart.time) && ids(p.morningStart.completed))) &&
    (p.personal===undefined || personal(p.personal)) &&
    (p.bodyPlan===undefined || (record(p.bodyPlan) && Object.hasOwn(bodyGoals,p.bodyPlan.goal) &&
      Object.hasOwn(bodyFeel,p.bodyPlan.feel) && string(p.bodyPlan.avoid,180))) &&
    (p.dayTasks===undefined || (record(p.dayTasks) &&
      Object.entries(p.dayTasks).every(([key,tasks])=>date(key) && taskHistory(tasks)))) &&
    (p.skipped===undefined || (record(p.skipped) &&
      Object.entries(p.skipped).every(([key,tasks])=>date(key) && Array.isArray(tasks) &&
        tasks.every(task=>typeof task==='string' && /^(?:am|pm|habit)-[a-z0-9-]{1,64}$/i.test(task))))) &&
    (p.checkins===undefined || (record(p.checkins) && Object.entries(p.checkins).every(([key,checkin])=>
      date(key) && record(checkin) && date(checkin.date) && Object.hasOwn(checkinLabels,checkin.rating) &&
      string(checkin.note,200)))) &&
    (p.habits===undefined || (uniqueItems(p.habits,schedule) && p.habits.length<=32)) &&
    (p.habitChecks===undefined || (record(p.habitChecks) &&
      Object.entries(p.habitChecks).every(([key,items])=>date(key) && uniqueItems(items,habitItem))));
  const data = backup?.state;
  if (backup?.format!==backupFormat || backup.version!==1 || ![0,1].includes(data?.active) ||
      !Array.isArray(data.people) || data.people.length!==2 || !data.people.every(validProfile)) {
    throw new Error('Invalid backup');
  }
  return data;
}

async function restoreBackup(input) {
  const file = input.files[0];
  if (!file) return;
  input.value = '';
  let restored;
  try {
    if (file.size>24*1024*1024) throw new Error('Backup too large');
    restored = readBackup(JSON.parse(await file.text()));
  } catch {
    return notify('เปิดไฟล์นี้ไม่ได้ กรุณาเลือกไฟล์ .json ที่สำรองจาก Glow Together');
  }
  if (window.confirm('นำเข้าข้อมูลทั้งสองโปรไฟล์หรือไม่? ข้อมูลจากไฟล์จะแทนที่ข้อมูลในแอปนี้')) {
    update(() => { state = restored; }, 'นำเข้าข้อมูลทั้งสองโปรไฟล์แล้ว ♡');
  }
}

function defaultPlan(profile, period) {
  const answers = profile.answers;
  const tips = prefs[answers?.type ?? 'unsure'];
  const fragrance = answers?.sensitive ? ' · เลือกสูตร fragrance-free' : '';
  const dryMorning = period==='am' && answers?.type==='dry';
  const items = [
    ['cleanse','ล้างหน้า',dryMorning?'น้ำอุ่นเล็กน้อย':'คลีนเซอร์อ่อนโยน',
      dryMorning?'หลังตื่นนอน ล้างเบา ๆ แล้วซับหน้า':'เริ่มจากล้างหน้าเบา ๆ แล้วซับผิว · '+tips[0]+fragrance],
    ['moisturize','เติมความชุ่มชื้น','มอยส์เจอไรเซอร์','ทาหลังล้างหน้าขณะผิวยังหมาด · '+tips[1]+fragrance]
  ];
  if (period==='am') items.push(['spf','ทากันแดด','กันแดด Broad Spectrum SPF 30+','ทาเป็นขั้นสุดท้าย ประมาณ 15 นาทีก่อนออกแดด · '+tips[2]]);
  return {time:period==='am'?'07:00':'21:30',items:items.map(([id,title,product,detail])=>({id,title,product,detail,time:'',photo:''}))};
}
function basePlanFor(p, time, date) {
  const override = p.todayRoutine?.date===date ? p.todayRoutine[time] : undefined;
  return override ?? p.routine?.[time] ?? defaultPlan(p,time);
}
const clockMinutes = (time) => Number(time.slice(0,2))*60+Number(time.slice(3,5));
const minuteClock = (minutes) => String(Math.floor(minutes/60)).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0');

function planFor(p, time, date = dayKey()) {
  const plan = basePlanFor(p,time,date);
  const start = p.morningStart;
  if (time!=='am' || start?.date!==date) return plan;
  const remaining = plan.items.filter(item=>!start.completed.includes(item.id));
  if (!remaining.length) return plan;
  const first = Math.min(...remaining.map(item=>clockMinutes(item.time || plan.time)));
  const offset = clockMinutes(start.time)-first;
  return {
    time:start.time,
    items:plan.items.map(item=>{
      const original = item.time || plan.time;
      const adjusted = start.completed.includes(item.id) ? original : minuteClock(Math.min(1439,clockMinutes(original)+offset));
      return {...item,time:adjusted};
    })
  };
}
const plannedKeys = (p, date) => Object.fromEntries(Object.keys(periods).map(time =>
  [time,planFor(p,time,date).items.map(item=>item.id)]));
function progressFor(p, date = dayKey()) {
  const day = p.days[date];
  const keys = date===dayKey() ? plannedKeys(p,date) :
    day?.planned ?? Object.fromEntries(Object.keys(periods).map(time=>[time,defaultPlan(p,time).items.map(item=>item.id)]));
  return Object.entries(keys).reduce((progress,[time,items])=>{
    progress.total += items.length;
    progress.done += items.filter(id=>day?.[time]?.includes(id)).length;
    return progress;
  },{done:0,total:0});
}
const sectionHead = (eyebrow,title,subtitle) => '<div class="pagehead"><span class="kicker">'+eyebrow+'</span><h1>'+title+'</h1><p class="subtle">'+subtitle+'</p></div>';
const goto = (pageId) => {
  if (!Object.hasOwn(routes,pageId)) return;
  if (pageId==='routine' && !draft) pageId = 'home';
  if (pageId!=='routine') draft = undefined;
  if (pageId!=='home') showCompleted = showSkipped = false;
  if (pageId!=='review') reviewDraft = null;
  if (pageId!=='calendar') habitDraft = null;
  if (pageId!=='skin' && pageId!=='goals') {
    facePhotoDraft = null;
    facePhotoRequest++;
  }
  page = pageId;
  if (location.hash !== '#'+page) location.hash = page;
  render();
  window.scrollTo(0,0);
};

const productArt = {
  cleanse:['#dce9e0','<path d="M20 13h13v5h-7v7h-6z" fill="#456a5a"/><rect x="14" y="23" width="24" height="23" rx="6" fill="#81a891"/><rect x="17" y="29" width="18" height="11" rx="2" fill="#fbf7e8"/><path d="M24 34h5" stroke="#547462" stroke-width="1.4"/>'],
  moisturize:['#f5e0d4','<rect x="11" y="24" width="30" height="20" rx="5" fill="#dfad97"/><rect x="10" y="18" width="32" height="9" rx="3" fill="#a96753"/><rect x="16" y="30" width="20" height="9" rx="2" fill="#fff7eb"/><path d="M23 34.5h6" stroke="#996b54" stroke-width="1.4"/>'],
  spf:['#f4ebcf','<path d="M14 13h24l-3 26H17z" fill="#e4b663"/><rect x="18" y="39" width="16" height="6" rx="2" fill="#96692f"/><circle cx="26" cy="26" r="5" fill="#fff3cc"/><path d="M26 19v2m0 10v2m-7-7h2m10 0h2" stroke="#fff3cc" stroke-width="1.2"/>']
};
function productImage(item) {
  if (item.photo) return '<img class="product-image" src="'+esc(item.photo)+'" alt="">';
  const [background, drawing] = Object.hasOwn(productArt,item.id) ? productArt[item.id] : productArt.cleanse;
  return '<svg class="product-image" viewBox="0 0 52 52" aria-hidden="true"><rect width="52" height="52" rx="13" fill="'+background+'"/>'+drawing+'</svg>';
}
const displayTime = (time) => time+' น.';

const weekdays = ['จ.','อ.','พ.','พฤ.','ศ.','ส.','อา.'];
const allWeekdays = [0,1,2,3,4,5,6];
const weekday = (key) => (new Date(key+'T12:00:00').getDay()+6)%7;
function shiftDate(key, days) {
  const date = new Date(key+'T12:00:00');
  date.setDate(date.getDate()+days);
  return dayKey(date);
}
const habitPresets = {
  brushAm:{title:'แปรงฟันตอนเช้า',time:'07:00',days:allWeekdays,detail:'แปรง 2 นาทีด้วยยาสีฟันผสมฟลูออไรด์'},
  brushPm:{title:'แปรงฟันก่อนนอน',time:'21:30',days:allWeekdays,detail:'แปรง 2 นาทีด้วยยาสีฟันผสมฟลูออไรด์'},
  hair:{title:'สระผม',time:'19:00',days:[2,6],detail:'เลือกวันให้เหมาะกับความมันและความสกปรกของหนังศีรษะ'},
  scrub:{title:'สครับผิวกาย',time:'19:30',days:[2],detail:'ถ้าผิวระคายเคือง ไหม้แดด หรือมีแผล ให้ข้ามวันนี้'},
  photo:{title:'ถ่ายรูปติดตามผิว',time:'08:00',days:[6],detail:'ถ่ายมุมและแสงเดิม แล้วเก็บไว้ที่หน้าเป้าหมาย'}
};
let calendarDate = dayKey();
let calendarView = 'week';
let habitDraft = null;
const checksOn = (p,key) => p.habitChecks?.[key] ?? [];
function habitsOn(p,key) {
  const done = checksOn(p,key);
  if (key<dayKey()) return done;
  const planned = (p.habits ?? []).filter(h=>key>=h.since && (h.once ? h.once===key : h.days.includes(weekday(key))));
  return [...planned,...done.filter(task=>!planned.some(h=>h.id===task.id))]
    .sort((first,second)=>(first.time || '99:99').localeCompare(second.time || '99:99'));
}
function habitForm() {
  const h = habitDraft;
  const once = !!h.once;
  return '<section class="box" id="habit-editor" tabindex="-1"><h2>'+(h.id?'แก้งาน':'เพิ่มงานดูแลตัวเอง')+'</h2>'+
    '<form id="habit-form"><div class="field"><label for="habit-title">งานที่ต้องทำ</label><input id="habit-title" name="title" type="text" required maxlength="60" value="'+esc(h.title)+'"></div>'+
    '<div class="editor-settings habit-fields"><div class="field"><label for="habit-time">เวลา (ถ้ามี)</label><input id="habit-time" name="time" type="time" value="'+esc(h.time)+'"></div>'+
    '<div class="field"><label for="habit-repeat">ทำเมื่อไหร่?</label><select id="habit-repeat" name="repeat"><option value="weekly" '+(!once?'selected':'')+'>ซ้ำทุกสัปดาห์</option><option value="once" '+(once?'selected':'')+'>ครั้งเดียว</option></select></div></div>'+
    '<fieldset class="field" id="habit-weekdays" '+(once?'hidden':'')+'><legend>เลือกวัน</legend><div class="choices">'+weekdays.map((label,i)=>
      '<label class="choice"><input name="days" type="checkbox" value="'+i+'" '+(h.days.includes(i)?'checked':'')+'>'+label+'</label>').join('')+'</div></fieldset>'+
    '<div class="field" id="habit-single-date" '+(!once?'hidden':'')+'><label for="habit-date">วันที่ทำ</label><input id="habit-date" name="date" type="date" min="'+dayKey()+'" value="'+esc(h.once || (calendarDate>=dayKey()?calendarDate:dayKey()))+'" '+(once?'required':'disabled')+'></div>'+
    '<div class="field"><label for="habit-detail">โน้ต (ถ้ามี)</label><input id="habit-detail" name="detail" type="text" maxlength="160" value="'+esc(h.detail)+'"></div>'+
    '<div class="actions"><button class="btn" type="submit">บันทึกงาน</button><button type="button" class="btn light" id="cancel-habit">ยกเลิก</button></div></form></section>';
}
function reminderChoices(p) {
  const today = dayKey();
  const routines = Object.entries(periods).flatMap(([slot,label])=>{
    const recurring = p.routine?.[slot] ?? defaultPlan(p,slot);
    const todayPlan = planFor(p,slot,today);
    const items = [...recurring.items,...todayPlan.items.filter(step=>!recurring.items.some(item=>item.id===step.id))];
    return items.map(item=>{
      const regular = recurring.items.find(step=>step.id===item.id);
      const currentItem = todayPlan.items.find(step=>step.id===item.id);
      const normalTime = regular ? regular.time || recurring.time : '';
      const todayTime = currentItem ? currentItem.time || todayPlan.time : '';
      const title = (regular ?? currentItem).title;
      const events = [];
      if (regular) events.push({key:slot+'-'+item.id,date:todayTime===normalTime?today:shiftDate(today,1),time:normalTime,title,days:allWeekdays});
      if (todayTime && todayTime!==normalTime) events.push({key:slot+'-'+item.id+'-'+today,date:today,time:todayTime,title:currentItem.title,days:[]});
      return {id:slot+'-'+item.id,title,label:label+' · '+displayTime(normalTime || todayTime)+(regular?'':' · เฉพาะวันนี้'),events};
    });
  });
  const habits = (p.habits ?? []).filter(task=>task.time && (!task.once || task.once>=today)).map(task=>({
    id:'habit-'+task.id,title:task.title,label:displayTime(task.time)+' · '+(task.once?thaiDate(task.once):
      task.days.length===7?'ทุกวัน':task.days.map(day=>weekdays[day]).join(' ')),
    events:[{key:'habit-'+task.id,date:task.once || (task.since>today?task.since:today),time:task.time,title:task.title,days:task.days}]
  }));
  return [...routines,...habits];
}

function reminders() {
  const p = current();
  return sectionHead('IPHONE REMINDERS','ตั้งเตือนของ'+esc(p.name),'เลือกเฉพาะงานที่อยากให้ปฏิทิน iPhone เตือนตามเวลาที่ตั้งไว้')+
    '<div class="grid"><section class="box"><h2>งานที่จะเตือน</h2><form id="reminder-form" class="stack">'+
    reminderChoices(p).map(item=>'<label class="body-choice reminder-choice"><input name="reminder" type="checkbox" value="'+item.id+'">'+
      '<span><strong>'+esc(item.title)+'</strong><small>'+esc(item.label)+'</small></span></label>').join('')+
    '<div class="actions"><button class="btn" type="submit">'+icon('calendar')+'ดาวน์โหลดไฟล์เตือน</button></div></form></section>'+
    '<section class="box"><h2>เพิ่มลงปฏิทิน iPhone</h2><ol class="reminder-help"><li>ดาวน์โหลดไฟล์ .ics จากงานที่เลือก</li>'+
    '<li>แนบไฟล์ส่งให้ตัวเอง แล้วเปิดไฟล์แนบจากแอป Mail บน iPhone เพื่อนำเข้า Calendar</li>'+
    '<li>เปิดเหตุการณ์ใน Calendar แล้วตรวจว่า Alert ตั้งไว้ที่เวลาเริ่มงานและเปิดการแจ้งเตือนของ Calendar อยู่</li></ol>'+
    '<p class="note">ถ้าเปลี่ยนเวลาหรือลบงานใน Glow Together ให้แก้รายการที่นำเข้าไว้ใน Calendar ด้วย</p>'+
    '<div class="sources"><a href="https://support.apple.com/guide/iphone/set-up-mail-contacts-and-calendar-accounts-ipha0d932e96/ios" target="_blank" rel="noopener">วิธีนำเข้าไฟล์จาก Apple</a></div></section></div>';
}
const calendarDays = ['MO','TU','WE','TH','FR','SA','SU'];
const icsText = (value) => value.replace(/[\\;,\r\n]/g,char=>char==='\r' || char==='\n'?'\\n':'\\'+char);
function foldIcs(line) {
  const encoder = new TextEncoder();
  let result = '', size = 0;
  for (const char of line) {
    const bytes = encoder.encode(char).length;
    if (size+bytes>75) {
      result += '\r\n ';
      size = 1;
    }
    result += char;
    size += bytes;
  }
  return result;
}
function reminderCalendar(events, now = new Date()) {
  const today = dayKey(now);
  const clock = String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
  const stamp = now.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
  const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Glow Together//Routine reminders//TH','CALSCALE:GREGORIAN'];
  for (const event of events) {
    let date = event.date;
    if (event.days.length) {
      if (date===today && event.time<=clock) date = shiftDate(date,1);
      while (!event.days.includes(weekday(date))) date = shiftDate(date,1);
    } else if (date<today || (date===today && event.time<=clock)) {
      continue;
    }
    const start = date.replaceAll('-','')+'T'+event.time.replace(':','')+'00';
    lines.push('BEGIN:VEVENT','UID:'+state.active+'-'+event.key+'@glow-together.local','DTSTAMP:'+stamp,
      'DTSTART:'+start,'DURATION:PT5M','SUMMARY:'+icsText(event.title));
    if (event.days.length===7) lines.push('RRULE:FREQ=DAILY');
    else if (event.days.length) lines.push('RRULE:FREQ=WEEKLY;BYDAY='+event.days.map(day=>calendarDays[day]).join(','));
    lines.push('BEGIN:VALARM','ACTION:DISPLAY','TRIGGER:PT0M','DESCRIPTION:'+icsText(event.title),'END:VALARM','END:VEVENT');
  }
  return lines.includes('BEGIN:VEVENT') ? [...lines,'END:VCALENDAR',''].map(foldIcs).join('\r\n') : '';
}
function exportReminders(data) {
  const selected = new Set(data.getAll('reminder'));
  if (!selected.size) return notify('เลือกงานที่ต้องการเตือนก่อน');
  const file = reminderCalendar(reminderChoices(current()).filter(item=>selected.has(item.id)).flatMap(item=>item.events));
  if (!file) return notify('เวลาของงานที่เลือกผ่านไปแล้ว');
  downloadFile(file,'text/calendar;charset=utf-8','Glow-Together-Reminders.ics');
  notify('ดาวน์โหลดไฟล์เตือนแล้ว เปิดไฟล์แนบใน Mail เพื่อนำเข้า Calendar');
}

function monthDates(key) {
  const first = key.slice(0,7)+'-01';
  const date = new Date(first+'T12:00:00');
  const total = new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
  return [
    ...Array(weekday(first)).fill(null),
    ...Array.from({length:total},(_,index)=>shiftDate(first,index))
  ];
}

function shiftMonth(key, offset) {
  const date = new Date(key+'T12:00:00'), day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth()+offset);
  const last = new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
  date.setDate(Math.min(day,last));
  return dayKey(date);
}

const monthStatusLabels = {complete:'รูทีนครบ',partial:'ทำบางส่วนหรือข้าม',pending:'ยังไม่ทำ'};
function monthRoutineStatus(tasks) {
  const routine = tasks.filter(task=>task.slot);
  if (!routine.length) return '';
  if (routine.every(task=>task.status==='done')) return 'complete';
  return routine.some(task=>task.status!=='pending') ? 'partial' : 'pending';
}

function calendarPicker(p,today) {
  const monthly = calendarView==='month';
  const start = shiftDate(calendarDate,-weekday(calendarDate));
  const title = monthly ? thaiDate(calendarDate,{month:'long',year:'numeric'}) :
    thaiDate(start)+' – '+thaiDate(shiftDate(start,6));
  const periodLabel = monthly?'เดือน':'สัปดาห์';
  const dates = monthly ? monthDates(calendarDate) : weekdays.map((_,index)=>shiftDate(start,index));
  return '<div class="calendar-picker" id="calendar-picker" tabindex="-1">'+
    '<div class="calendar-view-switch" aria-label="มุมมองปฏิทิน">'+
    '<button type="button" class="btn light small" data-calendar-view="week" aria-pressed="'+!monthly+'">รายสัปดาห์</button>'+
    '<button type="button" class="btn light small" data-calendar-view="month" aria-pressed="'+monthly+'">ดูทั้งเดือน</button></div>'+
    '<div class="calendar-head"><button type="button" class="btn light small" data-calendar-jump="-1" aria-label="'+periodLabel+'ก่อน">‹</button>'+
    '<strong aria-live="polite">'+title+'</strong>'+
    '<button type="button" class="btn light small" data-calendar-jump="1" aria-label="'+periodLabel+'ถัดไป">›</button></div>'+
    '<div class="calendar-week'+(monthly?' calendar-month':'')+'" aria-label="เลือกวัน">'+
    (monthly?weekdays.map(label=>'<small class="month-weekday" aria-hidden="true">'+label+'</small>').join(''):'')+
    dates.map(key=>{
      if (!key) return '<span class="month-empty" aria-hidden="true"></span>';
      const tasks = calendarTimeline(p,key);
      const hasPhotos = photosOn(p,key).length>0;
      const status = monthly && key<=today ? monthRoutineStatus(tasks) : '';
      const label = thaiDate(key,{weekday:'long',day:'numeric',month:'long'})+
        (status?' · '+monthStatusLabels[status]:'')+(tasks.length?' · '+tasks.length+' งาน':'')+(hasPhotos?' · มีรูปผิว':'');
      const marker = monthly ? (status?'<i class="calendar-dot '+status+'" aria-hidden="true"></i>':'') :
        (tasks.length?tasks.length+' งาน':hasPhotos?'รูป':'·');
      return '<button type="button" data-calendar-date="'+key+'" aria-label="'+label+'" aria-pressed="'+(key===calendarDate)+'"'+
        (key===today?' aria-current="date"':'')+'>'+
        (monthly?'':'<small>'+weekdays[weekday(key)]+'</small>')+'<strong>'+Number(key.slice(-2))+'</strong>'+
        '<span>'+(hasPhotos?icon('camera'):'')+marker+'</span></button>';
    }).join('')+'</div>'+
    (monthly?'<div class="calendar-legend" aria-label="ความหมายของสัญลักษณ์">'+
      Object.entries(monthStatusLabels).map(([status,label])=>'<span><i class="calendar-dot '+status+'" aria-hidden="true"></i>'+label+'</span>').join('')+
      '<span>'+icon('camera')+'มีรูปผิว</span></div>':'')+'</div>';
}

function calendar() {
  const p = current(), today = dayKey(), tasks = calendarTimeline(p,calendarDate);
  const monthly = calendarView==='month';
  const routine = tasks.filter(task=>task.slot);
  const done = tasks.filter(task=>task.status==='done').length;
  return sectionHead('CALENDAR','ปฏิทินของ'+esc(p.name),'เลือกวันเพื่อดูงานที่ทำ รูทีน และบันทึกรูปผิว')+
    (monthly?'<section class="box calendar-full">'+calendarPicker(p,today)+'</section>':'')+
    '<div class="grid calendar-grid"><div class="stack"><section class="box">'+
    (monthly?'':calendarPicker(p,today))+
    '<div class="section-top calendar-selected"><div><h2 id="calendar-day-detail" tabindex="-1">'+
    thaiDate(calendarDate,{weekday:'long',day:'numeric',month:'long'})+'</h2>'+
    (tasks.length?'<p class="subtle">เสร็จ '+done+'/'+tasks.length+' งาน'+
      (routine.length?' · รูทีน '+routine.filter(task=>task.status==='done').length+'/'+routine.length:'')+'</p>':'')+
    '</div><div class="calendar-detail-actions">'+
    (calendarDate===today?'<span class="pill">วันนี้</span>':'<button type="button" class="link-btn" data-calendar-date="'+today+'">กลับวันนี้</button>')+
    (monthly?'<button type="button" class="link-btn" id="calendar-back-to-month">↑ ดูทั้งเดือน</button>':'')+'</div></div>'+
    calendarPhotoDiary(p,calendarDate)+
    (tasks.length?'<ul class="steps calendar-tasks">'+tasks.map(task=>timelineRow(task,false,calendarDate===today)).join('')+'</ul>':
      '<p class="subtle">ไม่มีตารางที่บันทึกไว้สำหรับวันนี้</p>')+
    (calendarDate<today && !p.dayTasks?.[calendarDate]?'<p class="subtle">วันเก่าแสดงเฉพาะงานที่มีประวัติบันทึกไว้</p>':'')+'</section>'+
    (habitDraft ? habitForm() : '<section class="box"><h2>เพิ่มงาน</h2><p class="subtle">เลือกตัวอย่างแล้วปรับวันและเวลาได้</p><div class="actions">'+
      Object.entries(habitPresets).map(([key,h])=>'<button type="button" class="btn light small" data-preset="'+key+'">'+h.title+'</button>').join('')+
      '<button type="button" class="btn" data-preset="custom">＋ งานของฉัน</button></div><div class="sources"><a href="https://www.ada.org/resources/ada-library/oral-health-topics/home-oral-care/" target="_blank" rel="noopener">การดูแลฟัน</a><a href="https://www.aad.org/public/everyday-care/hair-scalp-care/hair/healthy-hair-tips" target="_blank" rel="noopener">การสระผม</a><a href="https://www.aad.org/public/everyday-care/skin-care-secrets/routine/safely-exfoliate-at-home" target="_blank" rel="noopener">การสครับผิว</a></div></section>')+
    '</div><section class="box"><h2>ตารางของฉัน</h2>'+
    ((p.habits ?? []).length?p.habits.map(h=>'<article class="log"><strong>'+esc(h.title)+'</strong><p class="subtle">'+
      (h.once?thaiDate(h.once):h.days.length===7?'ทุกวัน':h.days.map(day=>weekdays[day]).join(' · '))+
      (h.time?' · '+esc(displayTime(h.time)):'')+'</p><div class="habit-actions"><button type="button" class="link-btn" data-edit-habit="'+h.id+'">แก้ไข</button>'+
      '<button type="button" class="link-btn" data-delete-habit="'+h.id+'">ลบ</button></div></article>').join(''):'<p class="subtle">งานที่บันทึกไว้จะแสดงที่นี่</p>')+
    '</section></div>';
}
function saveHabit(data) {
  const p = current(), title = data.get('title').trim();
  const once = data.get('repeat')==='once' ? data.get('date') : '';
  const days = once ? [] : data.getAll('days').map(Number);
  if (!title) return notify('ใส่ชื่องานก่อนบันทึก');
  if (!once && !days.length) return notify('เลือกอย่างน้อยหนึ่งวัน');
  if (once && once<dayKey()) return notify('เลือกวันนี้หรือวันถัดไป');
  if (!habitDraft.id && (p.habits?.length ?? 0)>=32) return notify('ตารางนี้เก็บได้ 32 งาน ลบงานที่ไม่ได้ใช้ก่อนเพิ่ม');
  const h = {id:habitDraft.id || crypto.randomUUID(),title,time:data.get('time'),days,once,since:dayKey(),detail:data.get('detail').trim()};
  const selected = once || shiftDate(dayKey(),(days.find(day=>day>=weekday(dayKey())) ?? days[0]+7)-weekday(dayKey()));
  const previous = habitDraft;
  const oldDate = calendarDate;
  habitDraft = null;
  calendarDate = selected;
  if (!update(()=>{
    p.habits = [...(p.habits ?? []).filter(task=>task.id!==h.id),h];
  },'บันทึกงานแล้ว ♡')) {
    habitDraft = previous;
    calendarDate = oldDate;
  } else {
    window.scrollTo(0,0);
  }
}
const taskKey = (task) => (task.slot || 'habit')+'-'+task.id;
const taskLabels = {pending:'รอทำ',done:'เสร็จแล้ว',skipped:'ข้ามวันนี้'};

function taskStatus(p,date,task) {
  const checked = task.slot ? p.days[date]?.[task.slot]?.includes(task.id) :
    checksOn(p,date).some(item=>item.id===task.id);
  if (checked) return 'done';
  return p.skipped?.[date]?.includes(taskKey(task)) ? 'skipped' : 'pending';
}

function archiveToday(p) {
  const date = dayKey();
  (p.dayTasks ??= {})[date] = todayTimeline(p,date).map(({id,slot,time,title,product,detail})=>({
    id,slot:slot || '',time,title,product:product || '',detail
  }));
  const cutoff = shiftDate(date,-89);
  for (const key of Object.keys(p.dayTasks)) {
    if (key<cutoff) delete p.dayTasks[key];
  }
}

function calendarTimeline(p,date) {
  if (date>=dayKey()) return todayTimeline(p,date);
  const stored = p.dayTasks?.[date];
  if (stored) return stored.map(task=>({
    ...task,label:task.slot?'สกินแคร์ · '+periods[task.slot]:'ดูแลตัวเอง',status:taskStatus(p,date,task)
  }));
  const old = p.days[date];
  const routine = Object.keys(periods).flatMap(slot=>{
    const plan = defaultPlan(p,slot);
    return (old?.planned?.[slot] ?? old?.[slot] ?? []).map(id=>{
      const item = plan.items.find(step=>step.id===id);
      const task = {id,slot,time:'',title:item?.title ?? 'ขั้นตอนสกินแคร์ที่เคยบันทึก',
        label:'สกินแคร์ · '+periods[slot],detail:''};
      return {...task,status:taskStatus(p,date,task)};
    });
  });
  return [...routine,...checksOn(p,date).map(task=>({...task,label:'ดูแลตัวเอง',status:'done'}))];
}

function changeTaskStatus(key, action) {
  const p = current(), date = dayKey();
  const task = todayTimeline(p,date).find(item=>taskKey(item)===key);
  if (!task) return;
  const status = action==='skip' ? (task.status==='skipped'?'pending':'skipped') :
    task.status==='done'?'pending':'done';
  if (update(()=>{
    const skipped = (p.skipped?.[date] ?? []).filter(value=>value!==key);
    if (status==='skipped') skipped.push(key);
    if (skipped.length || p.skipped?.[date]) (p.skipped ??= {})[date] = skipped;
    if (task.slot) {
      const day = p.days[date] ??= {am:[],pm:[]};
      day[task.slot] = day[task.slot].filter(id=>id!==task.id);
      if (status==='done') day[task.slot].push(task.id);
      refreshDay(p,date);
    } else {
      const checked = checksOn(p,date).filter(item=>item.id!==task.id);
      if (status==='done') checked.push({id:task.id,title:task.title,time:task.time,detail:task.detail});
      (p.habitChecks ??= {})[date] = checked;
    }
  })) focusAfterCheck('[data-task="'+key+'"]');
}

function todayTimeline(p, date) {
  const routine = Object.keys(periods).flatMap(slot=>{
    const plan = planFor(p,slot,date);
    return plan.items.map(item=>({...item,slot,time:item.time || plan.time,label:'สกินแคร์ · '+periods[slot]}));
  });
  const habits = habitsOn(p,date).map(item=>({...item,label:'ดูแลตัวเอง'}));
  return [...routine,...habits].sort((a,b)=>(a.time || '99:99').localeCompare(b.time || '99:99'))
    .map(task=>({...task,status:taskStatus(p,date,task)}));
}

function timelineRow(task, next = false, editable = true) {
  const source = task.slot ? productImage(task) : '<span class="stepicon">'+icon('calendar')+'</span>';
  const title = esc(task.title), status = taskLabels[task.status], key = taskKey(task);
  const content = source+'<span class="step-content"><small class="step-number">'+
    (task.time?esc(displayTime(task.time)):'ไม่กำหนดเวลา')+' · '+task.label+(next?' · งานถัดไป':'')+'</small><strong>'+title+'</strong>'+
    '<small>'+(task.product?'<b>'+esc(task.product)+'</b>':'')+esc(task.detail)+'</small></span>'+
    '<span class="task-status '+task.status+'">'+status+'</span>';
  const row = editable ? '<button type="button" class="step-toggle" data-task="'+key+'" aria-pressed="'+(task.status==='done')+'">'+content+'</button>' :
    '<div class="step-toggle">'+content+'</div>';
  const skip = editable && task.status!=='done' ? '<button type="button" class="link-btn task-skip" data-skip-task="'+key+'" aria-label="'+
    (task.status==='skipped'?'คืนเป็นรอทำ ':'ข้ามวันนี้ ')+title+'">'+(task.status==='skipped'?'คืนเป็นรอทำ':'ข้าม')+'</button>' : '';
  return '<li class="step'+(next?' timeline-next':'')+'">'+row+skip+'</li>';
}

function morningControl(p, date, remaining) {
  const start = p.morningStart?.date===date ? p.morningStart : null;
  if (start) {
    return '<div class="morning-control"><div><strong>เช้านี้เริ่ม '+displayTime(start.time)+'</strong>'+
      '<small>ใช้กับรูทีนเช้าของวันนี้</small></div>'+
      '<button type="button" class="link-btn" id="undo-morning-start">คืนเวลาเดิม</button></div>';
  }
  if (!remaining.some(task=>task.slot==='am')) return '';
  return '<div class="morning-control"><div><strong>ตื่นแล้ว เริ่มได้เลย</strong>'+
    '<small>เลื่อนขั้นเช้าที่ยังเหลือให้เริ่มตอนนี้ เฉพาะวันนี้</small></div>'+
    '<button type="button" class="btn small" id="start-morning">เริ่มรูทีนเช้าตอนนี้</button></div>';
}

function startMorning(now = new Date()) {
  const p = current(), date = dayKey(now);
  const plan = basePlanFor(p,'am',date);
  const completed = plan.items.filter(item=>taskStatus(p,date,{id:item.id,slot:'am'})!=='pending').map(item=>item.id);
  if (p.morningStart?.date===date || completed.length===plan.items.length) return;
  const time = minuteClock(now.getHours()*60+now.getMinutes());
  if (update(()=>{p.morningStart = {date,time,completed:[...completed]};},'เริ่มรูทีนเช้าวันนี้ '+displayTime(time))) {
    $('undo-morning-start')?.focus();
  }
}

function home() {
  const date = dayKey();
  const p = current();
  const timeline = todayTimeline(p,date);
  const remaining = timeline.filter(task=>task.status==='pending');
  const skipped = timeline.filter(task=>task.status==='skipped');
  const completed = timeline.filter(task=>task.status==='done');
  return '<div class="today-head"><div class="today-intro"><div class="date kicker">'+icon('calendar')+thaiDate(date,{weekday:'long',day:'numeric',month:'long'})+'</div>'+
    '<h1>วันนี้ของ'+esc(p.name)+' <span aria-hidden="true">♡</span></h1><p class="subtle">เปิดดูงานถัดไป แล้วแตะทั้งแถวเมื่อทำเสร็จ</p></div><img src="ritual.svg" alt=""></div>'+
    '<div class="dash"><section class="box timeline"><div class="section-top"><div><span class="kicker">DAILY CARE</span><h2>ตารางวันนี้</h2></div>'+
    '<span class="pill">'+completed.length+'/'+timeline.length+' งาน</span></div>'+bar(completed.length,timeline.length)+
    morningControl(p,date,remaining)+
    (remaining.length ? '<ul class="steps">'+remaining.map((task,index)=>timelineRow(task,index===0)).join('')+'</ul>' :
      '<p class="note">'+(skipped.length?'จัดการงานวันนี้ครบแล้ว ♡':'ครบทุกงานของวันนี้แล้ว ♡')+'</p>')+
    (completed.length ? '<details class="timeline-done" '+(showCompleted?'open':'')+'><summary>ทำเสร็จแล้ว · '+completed.length+' งาน</summary>'+
      '<ul class="steps">'+completed.map(task=>timelineRow(task)).join('')+'</ul></details>' : '')+
    (skipped.length?'<details class="timeline-done" '+(showSkipped?'open':'')+' data-skipped><summary>ข้ามวันนี้ · '+skipped.length+' งาน</summary><ul class="steps">'+
      skipped.map(task=>timelineRow(task)).join('')+'</ul></details>':'')+
    '<div class="actions today-actions"><button type="button" class="btn light small" data-edit-period="am">แก้รูทีนเช้า</button>'+
    '<button type="button" class="btn light small" data-edit-period="pm">แก้รูทีนก่อนนอน</button>'+
    '<button type="button" class="btn light small" id="open-calendar">เปิดปฏิทิน</button>'+
    '<button type="button" class="btn light small" data-page="reminders">ตั้งเตือน</button></div></section>'+
    '<aside class="rightcol"><section class="box couple"><div class="section-top"><div class="badge-icon">'+icon('heart')+'</div><div><h3>ทำไปด้วยกัน</h3><small>ตารางวันนี้ของเราสองคน</small></div></div>'+
    state.people.map((person,index)=>{
      const tasks = todayTimeline(person,date);
      const done = tasks.filter(task=>task.status==='done').length;
      return '<div class="couple-row">'+avatar(person,index)+'<strong>'+esc(person.name)+'</strong>'+bar(done,tasks.length)+'<small>'+done+'/'+tasks.length+'</small></div>';
    }).join('')+'<button type="button" class="link-btn" data-page="share">แชร์ยอด 7 วัน</button></section>'+
    '<section class="box goal-card"><div class="goal-head"><div class="badge-icon mint">'+icon('target')+'</div><div><span class="kicker">MY SKIN GOAL</span><h3>เป้าหมายของ'+esc(p.name)+'</h3></div></div><p class="subtle">'+esc(p.goal || 'เลือกสิ่งที่อยากให้ผิวค่อย ๆ ดีขึ้น')+'</p><button class="link-btn" data-page="goals">'+(p.goal?'ดูความคืบหน้า':'ตั้งเป้าหมาย')+icon('arrow')+'</button></section></aside></div>';
}

function focusAfterCheck(selector) {
  const row = document.querySelector(selector);
  const folded = row?.closest('details:not([open])');
  (folded ? document.querySelector('.timeline-next button') ?? folded.querySelector('summary') : row)?.focus();
}

function routine() {
  const {plan,scope} = draft;
  return sectionHead('MY DAILY RITUAL','แก้รูทีน'+periods[period],'ของ'+esc(current().name)+' · แตะเพื่อแก้เวลา ขั้นตอน และผลิตภัณฑ์')+
    '<form id="routine-form" class="stack routine-editor"><section class="box"><div class="editor-settings">'+
    '<div class="field"><label for="routine-time">เวลาเริ่มรูทีน</label><input id="routine-time" name="routine-time" type="time" required value="'+esc(plan.time)+'"></div>'+
    '<div class="field"><label for="routine-scope">ใช้รูทีนนี้เมื่อไหร่?</label><select id="routine-scope" name="scope">'+
    '<option value="daily" '+(scope==='daily'?'selected':'')+'>ทุกวัน</option><option value="today" '+(scope==='today'?'selected':'')+'>เฉพาะวันนี้</option></select></div></div>'+
    '<p class="subtle">ตั้งเวลาตามตารางของคุณ และใส่เวลาแยกสำหรับขั้นที่ต้องทำต่างเวลาได้</p></section>'+
    plan.items.map((item,i)=>'<section class="box editor-step" data-item="'+item.id+'"><div class="editor-step-head">'+productImage(item)+
      '<div><span class="kicker">ขั้น '+(i+1)+'</span><h3>'+esc(item.title || 'ขั้นตอนใหม่')+'</h3></div><div class="editor-order">'+
      '<button type="button" class="btn light small" data-move="-1" aria-label="เลื่อนขั้น '+(i+1)+' ขึ้น" '+(i===0?'disabled':'')+'>↑</button>'+
      '<button type="button" class="btn light small" data-move="1" aria-label="เลื่อนขั้น '+(i+1)+' ลง" '+(i===plan.items.length-1?'disabled':'')+'>↓</button></div></div>'+
      '<div class="editor-settings"><div class="field"><label for="title-'+item.id+'">ขั้นตอน</label><input id="title-'+item.id+'" data-key="title" type="text" required maxlength="60" value="'+esc(item.title)+'" placeholder="เช่น ทามอยส์เจอไรเซอร์"></div>'+
      '<div class="field"><label for="time-'+item.id+'">เวลาแยก (ถ้ามี)</label><input id="time-'+item.id+'" data-key="time" type="time" value="'+esc(item.time)+'"></div></div>'+
      '<div class="field"><label for="product-'+item.id+'">ชื่อผลิตภัณฑ์</label><input id="product-'+item.id+'" data-key="product" type="text" maxlength="80" value="'+esc(item.product)+'" placeholder="เช่น ชื่อครีมที่ใช้อยู่"></div>'+
      '<div class="field"><label for="detail-'+item.id+'">ใช้เมื่อไหร่ และใช้อย่างไร</label><textarea id="detail-'+item.id+'" data-key="detail" rows="2" maxlength="220" placeholder="เช่น ทาหลังล้างหน้าขณะผิวยังหมาด">'+esc(item.detail)+'</textarea></div>'+
      '<div class="actions"><button type="button" class="btn light small" data-pick-product>'+icon('camera')+(item.photo?'เปลี่ยนรูป':'ใส่รูปผลิตภัณฑ์')+'</button>'+
      '<input type="file" accept="image/*" data-product-file hidden>'+
      (item.photo?'<button type="button" class="link-btn" data-remove-product>เอารูปออก</button>':'')+
      '<button type="button" class="link-btn" data-remove-step '+(plan.items.length===1?'disabled':'')+'>ลบขั้นตอน</button></div></section>').join('')+
    '<div class="actions"><button type="button" class="btn soft" id="add-step" '+(plan.items.length===maxSteps?'disabled':'')+'>＋ เพิ่มขั้นตอน</button>'+
    '<button type="button" class="link-btn" id="reset-plan">ใช้แผนแนะนำ</button></div>'+
    '<div class="editor-save"><button type="button" class="btn light" data-page="home">ยกเลิก</button><button type="submit" class="btn">'+icon('check')+'บันทึกรูทีน</button></div></form>';
}

function options(name, items, value) {
  return '<div class="choices">'+Object.entries(items).map(([key,label])=>'<label class="choice"><input type="radio" name="'+name+'" value="'+key+'" '+(key===value?'checked':'')+' required>'+label+'</label>').join('')+'</div>';
}
const preferences = {
  age:{unsure:'ไม่ระบุ',teen:'ต่ำกว่า 18 ปี',adult:'18–34 ปี',mid:'35–54 ปี',older:'55 ปีขึ้นไป'},
  texture:{any:'ได้ทุกแบบ',light:'ชอบแบบบางเบา',rich:'ชอบเนื้อครีม'},
  budget:{reuse:'เน้นใช้ของที่มี',simple:'ซื้อเพิ่มทีละชิ้น',compare:'อยากเทียบตัวเลือก'}
};
const catalog = {
  gentle:{name:'Cetaphil Gentle Skin Cleanser',url:'https://www.cetaphil.co.th/en/products/face',why:'ตัวอย่างคลีนเซอร์อ่อนโยนสำหรับผิวที่ตึงง่าย'},
  foam:{name:'CeraVe Foaming Cleanser',url:'https://www.cerave.co.th/',why:'ตัวอย่างเจลล้างหน้าสำหรับผิวธรรมดาถึงมัน'},
  lotion:{name:'CeraVe Moisturising Lotion',url:'https://www.cerave.co.th/skincare/body-moisturizers',why:'ตัวอย่างโลชั่นเนื้อเบา ถ้าชอบสัมผัสที่เกลี่ยง่าย'},
  cream:{name:'CeraVe Moisturising Cream',url:'https://www.cerave.co.th/skincare/moisturising-cream',why:'ตัวอย่างครีมเข้มข้นสำหรับบริเวณที่แห้ง'},
  oil:{name:'Eucerin Sun Dry Touch Oil Control SPF50+',url:'https://www.eucerin.co.th/products/sun-protection/sun-dry-touch-acne-oil-control-spf-50-pa-plus-plus',why:'ตัวอย่างกันแดดเนื้อแห้งบางเบา ถ้าชอบผิวสัมผัสแบบแมตต์'},
  fluid:{name:'La Roche-Posay Anthelios UVMune 400 Invisible Fluid SPF50+',url:'https://www.larocheposay-th.com/anthelios/anthelios-uvmune-400-invisible-fluid-spf50',why:'ตัวอย่างกันแดดเนื้อฟลูอิด เขย่าขวดก่อนใช้ตามฉลาก'}
};
function selects(name,label,values,selected) {
  return '<div class="field"><label for="skin-'+name+'">'+label+'</label><select name="'+name+'" id="skin-'+name+'">'+
    Object.entries(values).map(([key,value])=>'<option value="'+key+'" '+(key===selected?'selected':'')+'>'+value+'</option>').join('')+'</select></div>';
}
function personalFields(p) {
  const data = p.personal ?? {};
  return '<details class="personal-fields"><summary>บอกข้อมูลเพิ่มเพื่อปรับแผน (ไม่บังคับ)</summary>'+
    '<div class="editor-settings habit-fields">'+selects('age','ช่วงอายุ',preferences.age,data.age)+
    selects('texture','เนื้อสัมผัสที่ชอบ',preferences.texture,data.texture)+'</div>'+
    selects('budget','อยากเริ่มแบบไหน?',preferences.budget,data.budget)+
    '<div class="field"><label for="skin-current">ของที่ใช้อยู่</label><input id="skin-current" name="current" type="text" maxlength="180" placeholder="เช่น คลีนเซอร์ มอยส์เจอไรเซอร์ กันแดด" value="'+esc(data.current)+'"></div>'+
    '<div class="field"><label for="skin-avoid">ส่วนผสมหรือสูตรที่เคยมีปัญหา</label><input id="skin-avoid" name="avoid" type="text" maxlength="180" placeholder="กรอกเฉพาะถ้าทราบ" value="'+esc(data.avoid)+'"></div></details>';
}
function examplesFor(p) {
  const a = p.answers, data = p.personal ?? {};
  const prefersRich = data.texture==='rich' || (a.type==='dry' && data.texture!=='light');
  const oily = a.type==='oily' || a.type==='combo';
  return {
    cleanse:a.type==='oily' && !a.sensitive ? ['foam','gentle'] : ['gentle','foam'],
    moisturize:prefersRich ? ['cream','lotion'] : ['lotion','cream'],
    spf:oily && a.concern!=='glow' ? ['oil','fluid'] : ['fluid','oil']
  };
}
function exampleCards(p) {
  const data = p.personal ?? {};
  if (data.avoid) return '<p class="note">คุณระบุสูตรหรือส่วนผสมที่เคยมีปัญหา แผนจึงแนะนำประเภทผลิตภัณฑ์ ให้ตรวจฉลากก่อนเลือกยี่ห้อ</p>';
  const alternatives = examplesFor(p);
  return '<section class="product-examples"><h3>ตัวอย่างผลิตภัณฑ์</h3>'+
    '<p class="subtle">เลือกอย่างละหนึ่งตามเนื้อสัมผัสและงบ เช็กส่วนผสมบนฉลากและลองทีละตัว</p>'+
    Object.entries(alternatives).map(([type,keys])=>{
      if (type==='spf' && p.answers.sensitive) {
        return '<p class="note">ถ้ากันแดดเคยทำให้แสบ ลองมองหาสูตรมิเนอรัลไม่มีน้ำหอมที่ใช้ zinc oxide หรือ titanium dioxide แล้วทดลองบริเวณเล็ก ๆ ก่อน</p>';
      }
      const options = data.budget==='compare' ? keys : keys.slice(0,1);
      return options.map(key=>{
        const item = catalog[key];
        return '<a class="product-card" href="'+item.url+'" target="_blank" rel="noopener">'+productImage({id:type})+
          '<span><strong>'+item.name+'</strong><small>'+item.why+'</small></span>'+icon('arrow')+'</a>';
      }).join('');
    }).join('')+'</section>';
}
function planContext(p) {
  const data = p.personal ?? {};
  const goal = skinGoalLabel(p.answers);
  const method = data.budget==='compare'?'เทียบเนื้อสัมผัสก่อนตัดสินใจ':data.budget==='simple'?
    'ถ้าจะซื้อเพิ่ม ให้เริ่มทีละตัวจากขั้นที่ยังขาด':'เริ่มจากของที่ใช้อยู่และผิวรับได้';
  return '<p class="note skin-goal-copy"><strong>'+esc(goal)+'</strong> · '+method+
    (data.age==='teen'?' ใช้แผนพื้นฐานและปรึกษาผู้ปกครองก่อนเพิ่มผลิตภัณฑ์เฉพาะปัญหา':'')+
    (data.current?' <span class="subtle">ของที่ใช้ตอนนี้ '+esc(data.current)+'</span>':'')+'</p>';
}
function aiPrompt(p) {
  const a = p.answers, data = p.personal ?? {};
  return [
    'ช่วยสังเกตภาพผิวหน้าของฉันที่ฉันเลือกแนบ โดยบอกเฉพาะสิ่งที่มองเห็น เช่น ความเงา ความแดง หรือผิวเป็นขุย ระบุข้อจำกัดเรื่องแสงและมุมภาพ ไม่ระบุอัตลักษณ์ ไม่วินิจฉัยโรคและไม่สรุปประเภทผิวจากรูปอย่างเดียว',
    'สภาพผิวจากการสังเกต: '+skinTypes[a.type]+' · ระคายเคืองจากผลิตภัณฑ์ใหม่: '+({yes:'ค่อนข้างง่าย',no:'ไม่ค่อย',unsure:'ยังไม่แน่ใจ'})[a.reaction],
    'เป้าหมายจากแบบเช็กผิว: '+skinGoalLabel(a),
    extraSkinGoal(a)?'เป้าหมายเพิ่มเติม: '+extraSkinGoal(a):'',
    p.goal && p.goal!==skinGoalLabel(a)?'เป้าหมายในไดอารี: '+p.goal:'',
    data.age && data.age!=='unsure'?'ช่วงอายุ: '+preferences.age[data.age]:'',
    data.texture && data.texture!=='any'?'เนื้อสัมผัสที่ชอบ: '+preferences.texture[data.texture]:'',
    data.budget?'วิธีเลือกซื้อ: '+preferences.budget[data.budget]:'',
    data.current?'ผลิตภัณฑ์ที่ใช้อยู่: '+data.current:'',
    data.avoid?'สิ่งที่เคยมีปัญหา: '+data.avoid:'',
    'ช่วยเสนอแผนเช้าและก่อนนอนที่เริ่มได้ง่าย บอกลำดับ วิธีใช้ และตัวอย่างคลีนเซอร์ มอยส์เจอไรเซอร์ และกันแดดจากเว็บไซต์ผู้ผลิตในไทย ระบุสิ่งที่ควรตรวจบนฉลาก และสิ่งที่ควรบันทึกเพื่อเทียบผลรายสัปดาห์ ถ้าข้อมูลไม่พอให้ถามก่อน'
  ].filter(Boolean).join('\n');
}
function aiCard(p) {
  return '<details class="ai-card"><summary>'+icon('sparkle')+' ใช้ ChatGPT ช่วยดูรูปและแผน</summary>'+
    '<p class="subtle">อ่านข้อความก่อนคัดลอก เปิด ChatGPT แล้ววางคำถามและแนบรูปที่คุณเลือกเอง ผลจะอยู่ในแชต แอปนี้เก็บคำตอบแบบสอบถามและรูปไว้ในเครื่อง</p>'+
    '<label for="ai-prompt">คำถามของคุณ</label><textarea readonly id="ai-prompt" rows="5">'+esc(aiPrompt(p))+'</textarea>'+
    '<div class="actions"><button type="button" class="btn light small" id="copy-ai">คัดลอกคำถาม</button><a class="btn small" href="https://chatgpt.com/" target="_blank" rel="noopener">เปิด ChatGPT'+icon('arrow')+'</a></div></details>';
}
async function copyAiPrompt() {
  const field = $('ai-prompt');
  try {
    await navigator.clipboard.writeText(field.value);
    notify('คัดลอกแล้ว วางใน ChatGPT ได้เลย');
  } catch {
    field.focus();
    field.select();
    notify('เลือกข้อความแล้ว แตะคัดลอกได้เลย');
  }
}
function applySkinPlan() {
  const p = current();
  if (!p.answers) return;
  if ((p.routine || p.todayRoutine?.date===dayKey()) && !window.confirm('ใช้แผนนี้แทนรูทีนเช้าและก่อนนอนที่ตั้งไว้หรือไม่?')) return;
  if (update(()=>{
    p.routine = Object.fromEntries(Object.keys(periods).map(time=>{
      const plan = defaultPlan(p,time);
      plan.time = basePlanFor(p,time,dayKey()).time;
      return [time,plan];
    }));
    delete p.todayRoutine;
    refreshDay(p,dayKey());
  },'ใช้แผนในรูทีนแล้ว ♡')) goto('home');
}

const bodyGoals = {
  even:'สีผิวดูสม่ำเสมอขึ้น',
  soft:'ผิวนุ่ม ชุ่มชื้นขึ้น',
  outdoor:'ดูแลผิวที่โดนแดดบ่อย'
};
const bodyFeel = {dry:'แห้งตึงหลังอาบน้ำ',balanced:'รู้สึกสบายผิว',sensitive:'ระคายเคืองง่าย'};
const bodyProducts = {
  lotion:{id:'lotion',name:'CeraVe Daily Moisturising Lotion',short:'CeraVe Daily Lotion',detail:'เนื้อโลชั่นบางเบา',url:'https://www.cerave.co.th/skincare/daily-moisturising-lotion'},
  cream:{id:'cream',name:'CeraVe Moisturising Cream',short:'CeraVe Cream',detail:'เนื้อครีมสำหรับผิวที่แห้งตึง',url:'https://www.cerave.co.th/skincare/moisturising-cream'},
  sun:{id:'sun',name:'Eucerin Sun Body Oil Control Dry Touch SPF50+',short:'Eucerin Sun Body SPF50+',detail:'กันแดดผิวกายเนื้อแห้งเบา สูตรนี้มีแอลกอฮอล์',url:'https://www.eucerin.co.th/products/sun-protection/sun-gel-cream-dry-touch-sensitive-protect-spf-50plus'},
  tone:{id:'tone',name:'Eucerin Spotless Brightening Body Lotion',short:'Eucerin Spotless Body Lotion',detail:'โลชั่นผิวกายที่มี Thiamidol ให้ทดลองบริเวณเล็ก ๆ และใช้ตามฉลาก',url:'https://www.eucerin.co.th/products/spotless-brightening/spotless-skin-tone-perfecting-body-lotion'}
};

function bodySteps(p) {
  const {goal,feel,avoid} = p.bodyPlan;
  const gentle = feel==='sensitive';
  const moisturizers = feel==='dry' ? [bodyProducts.cream,bodyProducts.lotion] : [bodyProducts.lotion,bodyProducts.cream];
  if (goal==='even' && !gentle) moisturizers.push(bodyProducts.tone);
  const steps = [
    {id:'body-spf',title:'ทากันแดดผิวกาย',time:'07:00',days:allWeekdays,art:'spf',selected:true,
      detail:'ทาบริเวณที่เสื้อผ้าไม่ปิด 15 นาทีก่อนออกแดด ทาซ้ำทุก 2 ชม. เมื่ออยู่กลางแจ้งและหลังว่ายน้ำหรือเหงื่อออก',
      products:gentle?[]:[bodyProducts.sun]},
    {id:'body-moisturize',title:'ทาโลชั่นหรือครีมทาตัว',time:'20:00',days:allWeekdays,art:'moisturize',selected:true,
      detail:'ทาหลังอาบน้ำและซับตัวหมาด ๆ'+(gentle?' เลือกสูตรไม่มีน้ำหอม':''),
      products:moisturizers},
    {id:'body-checkin',title:'เช็กความเปลี่ยนแปลงของผิวกาย',time:'19:00',days:[6],art:'',selected:false,
      detail:goal==='even'?'สังเกตรอยคล้ำหรือสีผิวบริเวณเดิมในแสงเดิม':goal==='soft'?
        'จดว่าผิวตึงหรือเป็นขุยหลังอาบน้ำน้อยลงไหม':'จดว่าวันไหนออกแดดและทากันแดดซ้ำได้ตามแผน',
      products:[]}
  ];
  return avoid ? steps.map(step=>({...step,products:[]})) : steps;
}

function bodyPlanForm(p) {
  const data = p.bodyPlan ?? {};
  return '<section class="box"><span class="kicker">BODY CHECK</span><h2>อยากดูแลเรื่องไหน?</h2><form id="body-form">'+
    '<fieldset class="field"><legend>เป้าหมายผิวกาย</legend>'+options('goal',bodyGoals,data.goal)+'</fieldset>'+
    '<fieldset class="field"><legend>ปกติผิวกายรู้สึกอย่างไร?</legend>'+options('feel',bodyFeel,data.feel)+'</fieldset>'+
    '<div class="field"><label for="body-avoid">ส่วนผสมที่เคยมีปัญหา (ถ้ามี)</label>'+
    '<input id="body-avoid" name="avoid" type="text" maxlength="180" value="'+esc(data.avoid)+'"></div>'+
    '<div class="actions"><button class="btn" type="submit">'+icon('sparkle')+'ดูแผนผิวกาย</button></div></form>'+
    '<p class="note">แผนนี้เน้นให้ผิวรู้สึกสบาย ดูชุ่มชื้น และลดโอกาสเกิดรอยคล้ำเพิ่ม ผลของรอยเดิมขึ้นอยู่กับสาเหตุ</p></section>';
}
function bodyStepCard(p,step) {
  const existing = p.habits?.find(h=>h.id===step.id);
  const days = existing?.days ?? step.days;
  const schedule = existing?.once ? thaiDate(existing.once) :
    days.length===7 ? 'ทุกวัน' : days.map(day=>weekdays[day]).join(' · ');
  const choices = step.products.map(product=>'<a class="product-card" href="'+product.url+'" target="_blank" rel="noopener">'+
    productImage({id:step.art})+'<span><strong>'+product.name+'</strong><small>'+product.detail+'</small></span>'+icon('arrow')+'</a>').join('');
  return '<article class="body-step"><label class="body-choice"><input type="checkbox" name="steps" value="'+step.id+'" '+(step.selected?'checked':'')+'>'+
    '<span><strong>'+step.title+'</strong><small>'+schedule+
    (existing?' · อยู่ในปฏิทินแล้ว':'')+'</small></span></label><p class="subtle">'+step.detail+'</p>'+
    (step.id==='body-spf' && p.bodyPlan.feel==='sensitive'?
      '<p class="subtle">ถ้าทากันแดดแล้วแสบง่าย ลองดูสูตรมิเนอรัลไม่มีน้ำหอมที่ฉลากระบุ zinc oxide หรือ titanium dioxide</p>':'')+
    choices+
    '<div class="editor-settings habit-fields"><div class="field"><label for="'+step.id+'-time">เวลาที่สะดวก</label><input id="'+step.id+'-time" name="'+step.id+'-time" type="time" value="'+esc(existing?.time || step.time)+'"></div>'+
    (step.products.length?'<div class="field"><label for="'+step.id+'-product">ผลิตภัณฑ์ในงาน</label><select id="'+step.id+'-product" name="'+step.id+'-product"><option value="">ใช้ของที่มี</option>'+
      step.products.map(product=>'<option value="'+product.id+'">'+product.short+'</option>').join('')+'</select></div>':'')+
    '</div></article>';
}
function bodyReview(p) {
  const plan = p.bodyPlan;
  return '<span class="kicker">REVIEW YOUR PLAN</span><h2>'+bodyGoals[plan.goal]+'</h2>'+
    '<p class="subtle">ติ๊กเฉพาะขั้นที่อยากเพิ่ม เลือกเวลาและผลิตภัณฑ์ได้ก่อนบันทึก</p>'+
    (plan.avoid?'<p class="note">คุณระบุส่วนผสมที่เคยมีปัญหา แผนนี้แสดงประเภทผลิตภัณฑ์เพื่อให้ตรวจฉลากก่อนเลือกสูตร</p>':'')+
    '<form id="apply-body-form">'+bodySteps(p).map(step=>bodyStepCard(p,step)).join('')+
    '<div class="actions"><button class="btn" type="submit">'+icon('check')+'เพิ่มขั้นที่เลือกลงปฏิทิน</button></div></form>'+
    '<details class="ai-card"><summary>'+icon('sparkle')+' ขอความเห็นจาก ChatGPT</summary>'+
    '<p class="subtle">อ่านข้อความก่อนคัดลอก แล้วเลือกเองว่าจะแนบรูปบริเวณที่ต้องการดูใน ChatGPT หรือไม่</p>'+
    '<label for="ai-prompt">คำถามของคุณ</label><textarea readonly id="ai-prompt" rows="5">'+esc([
      'ช่วยทบทวนแผนดูแลผิวกายเพื่อเป้าหมาย '+bodyGoals[plan.goal]+' ผิวของฉัน '+bodyFeel[plan.feel]+'.',
      plan.avoid?'ส่วนผสมที่เคยมีปัญหา '+plan.avoid:'',
      'ถ้าฉันแนบรูป ให้บอกเฉพาะสิ่งที่เห็น พร้อมข้อจำกัดจากแสงและมุมภาพ โดยไม่วินิจฉัยจากรูป',
      'เสนอแผนสั้น ๆ ที่ระบุเวลา วิธีใช้ และตัวอย่างผลิตภัณฑ์จากผู้ผลิตในไทย ช่วยแยกขั้นพื้นฐานกับตัวเลือกเสริม งดสูตรฟอกผิวหรือคำสัญญาว่าจะเปลี่ยนสีผิวเดิม'
    ].filter(Boolean).join('\n'))+'</textarea><div class="actions"><button type="button" class="btn light small" id="copy-ai">คัดลอกคำถาม</button>'+
    '<a class="btn small" href="https://chatgpt.com/" target="_blank" rel="noopener">เปิด ChatGPT'+icon('arrow')+'</a></div></details>'+
    '<div class="sources"><a href="https://www.aad.org/public/everyday-care/skin-care-basics/dry/dermatologists-tips-relieve-dry-skin" target="_blank" rel="noopener">การดูแลผิวแห้ง</a>'+
    '<a href="https://www.aad.org/public/everyday-care/skin-care-secrets/routine/fade-dark-spots" target="_blank" rel="noopener">ดูแลรอยคล้ำ</a>'+
    '<a href="https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/how-to-apply-sunscreen" target="_blank" rel="noopener">วิธีใช้กันแดด</a></div>';
}
function body() {
  const p = current();
  return sectionHead('BODY CARE','แผนผิวกายของ'+esc(p.name),'เลือกเป้าหมาย ดูตัวอย่างผลิตภัณฑ์ แล้วเพิ่มเฉพาะขั้นที่อยากทำ')+
    '<button class="link-btn" data-page="skin">‹ กลับไปเช็กผิวหน้า</button><div class="grid">'+bodyPlanForm(p)+
    '<section class="box" id="body-result" tabindex="-1">'+(p.bodyPlan?bodyReview(p):
      '<div class="badge-icon mint">'+icon('heart')+'</div><h2>แผนของคุณ</h2><p class="subtle">ตอบสองข้อเพื่อดูขั้นตอนและตัวอย่างผลิตภัณฑ์ก่อนเลือกใช้</p>')+'</section></div>';
}
function applyBodyPlan(data) {
  const p = current(), today = dayKey();
  const selection = new Set(data.getAll('steps'));
  const selected = bodySteps(p).filter(step=>selection.has(step.id));
  if (!selected.length) return notify('เลือกอย่างน้อยหนึ่งขั้นตอน');
  const retained = (p.habits ?? []).filter(task=>!selection.has(task.id));
  if (retained.length+selected.length>32) return notify('ตารางนี้เก็บได้ 32 งาน ลบงานที่ไม่ได้ใช้ก่อนเพิ่ม');
  const planned = selected.map(step=>{
    const existing = p.habits?.find(task=>task.id===step.id);
    const product = step.products.find(item=>item.id===data.get(step.id+'-product'));
    const detail = product ? product.short+' · '+step.detail : step.detail;
    return {id:step.id,title:step.title,time:data.get(step.id+'-time') || step.time,
      days:existing?.days ?? step.days,once:existing?.once ?? '',since:existing?.since ?? today,detail};
  });
  if (update(()=>{p.habits = [...retained,...planned];},'เพิ่มขั้นที่เลือกแล้ว ♡')) {
    calendarDate = today;
    goto('calendar');
  }
}

let facePhotoDraft = null;
let facePhotoRequest = 0;
const photosOn = (p,date) => p.photos.filter(photo=>photo.date===date);

function facePhotoGallery(photos, canDelete = false) {
  return '<div class="photo-grid face-photo-grid">'+photos.map(photo=>
    '<figure><img class="photo" loading="lazy" src="'+esc(photo.src)+'" alt="รูปติดตามผิววันที่ '+thaiDate(photo.date)+'">'+
    '<figcaption><div><small>'+thaiDate(photo.date)+'</small>'+
    (photo.note?'<p>'+esc(photo.note)+'</p>':'')+'</div>'+
    (canDelete?'<button type="button" class="link-btn" data-delete-photo="'+photo.id+'">ลบรูป</button>':'')+
    '</figcaption></figure>').join('')+'</div>';
}

function facePhotoEditor(p) {
  const disabled = p.photos.length>=maxFacePhotos ? ' disabled' : '';
  const pending = facePhotoDraft;
  return '<div class="actions face-photo-actions"><button type="button" class="btn" data-face-picker="face-camera"'+disabled+'>'+
    icon('camera')+'ถ่ายรูป</button><button type="button" class="btn light" data-face-picker="face-library"'+disabled+'>เลือกรูป</button></div>'+
    '<input id="face-camera" type="file" accept="image/*" capture="user" hidden>'+
    '<input id="face-library" type="file" accept="image/*" hidden>'+
    (disabled?'<p class="note">ครบ '+maxFacePhotos+' รูปแล้ว ลบรูปที่ไม่ต้องการในหน้าเป้าหมายก่อนเพิ่มรูปใหม่</p>':'')+
    (pending?'<form id="face-photo-form" class="face-photo-preview" tabindex="-1">'+
      '<div class="face-preview-head"><img class="photo" src="'+esc(pending.src)+'" alt="ตัวอย่างรูปก่อนบันทึก">'+
      '<div><strong>ตัวอย่างรูป</strong><small>'+thaiDate(pending.date)+'</small></div></div>'+
      '<div class="field"><label for="face-note">ผิววันนี้เป็นอย่างไร? (ไม่บังคับ)</label>'+
      '<textarea id="face-note" name="note" rows="2" maxlength="180" placeholder="เช่น แก้มแห้งน้อยลง">'+esc(pending.note)+'</textarea></div>'+
      '<div class="actions"><button type="submit" class="btn">บันทึกรูปผิว</button>'+
      '<button type="button" class="btn light" id="cancel-face-photo">ยกเลิก</button></div></form>':'');
}

function skinPhotoDiary(p) {
  const today = dayKey(), photos = photosOn(p,today);
  return '<section class="box skin-photo-diary" id="skin-photo-diary"><div class="goal-head">'+
    '<span class="badge-icon mint">'+icon('camera')+'</span><div><span class="kicker">PHOTO DIARY</span><h2>บันทึกรูปผิววันนี้</h2>'+
    '<p class="subtle">เก็บรูปและสิ่งที่สังเกตไว้ดูย้อนหลังในปฏิทิน</p></div></div>'+
    facePhotoEditor(p)+(photos.length?
      '<div class="face-diary-saved"><strong>บันทึกวันนี้ '+photos.length+' รูป</strong>'+facePhotoGallery(photos.slice(0,1))+'</div>':
      '<p class="subtle face-diary-saved">วันนี้ยังไม่มีรูปผิว</p>')+
    '<button type="button" class="link-btn" data-photo-date="'+today+'">ดูรูปวันนี้ในปฏิทิน'+icon('arrow')+'</button>'+
    '<p class="subtle">รูปเก็บในเบราว์เซอร์ของเครื่องนี้ · '+p.photos.length+'/'+maxFacePhotos+' รูป</p></section>';
}

function calendarPhotoDiary(p,date) {
  const photos = photosOn(p,date);
  if (!photos.length && date>dayKey()) return '';
  return '<section class="calendar-photo-diary"><div class="section-top"><div><h3>บันทึกรูปผิว</h3></div>'+
    (photos.length?'<span class="pill">'+photos.length+' รูป</span>':'')+'</div>'+
    (photos.length?facePhotoGallery(photos):'<p class="subtle">ไม่มีรูปผิวที่บันทึกไว้ในวันนี้</p>')+
    (date===dayKey()?'<button type="button" class="link-btn" id="calendar-add-face-photo">'+icon('camera')+'เพิ่มรูปผิววันนี้</button>':'')+
    '</section>';
}

async function previewFacePhoto(file) {
  const p = current(), date = dayKey(), request = ++facePhotoRequest;
  if (p.photos.length>=maxFacePhotos) return notify('ลบรูปที่ไม่ต้องการก่อนเพิ่มรูปใหม่');
  notify('กำลังเตรียมรูป…');
  try {
    const src = await resizedPhoto(file,512,.72,40000);
    if (request!==facePhotoRequest || p!==current()) return;
    facePhotoDraft = {src,date,note:facePhotoDraft?.note ?? ''};
    render();
    $('face-photo-form').focus();
  } catch {
    if (request===facePhotoRequest) notify('เปิดไฟล์รูปนี้ไม่ได้ ลองเลือก JPG หรือ PNG');
  }
}

function saveFacePhoto(note) {
  const p = current(), preview = facePhotoDraft;
  if (!preview || p.photos.length>=maxFacePhotos) return;
  facePhotoDraft = null;
  facePhotoRequest++;
  const photo = {id:crypto.randomUUID(),date:preview.date,src:preview.src,note:note.trim()};
  if (!update(()=>{p.photos.unshift(photo);},'บันทึกรูปในปฏิทินแล้ว ♡')) {
    facePhotoDraft = {...preview,note:note.trim()};
  }
}

function skin() {
  const p = current(), a = p.answers;
  return sectionHead('01 / SKIN CHECK','ทำความรู้จักผิวของ'+esc(p.name),'บอกสภาพผิวและเป้าหมาย แล้วรับแผนเช้า–ก่อนนอนที่ใช้เป็นจุดเริ่มต้นได้')+
    skinPhotoDiary(p)+'<div class="box body-entry"><span class="badge-icon mint">'+icon('heart')+'</span><div><h3>อยากดูแลผิวกายด้วย?</h3><p class="subtle">วางแผนให้ผิวชุ่มชื้นหรือสีผิวดูสม่ำเสมอขึ้น</p></div><button class="btn light small" data-page="body">ดูแผนผิวกาย'+icon('arrow')+'</button></div>'+
    '<div class="grid"><section class="box"><h2>เช็กผิวแบบสั้น ๆ</h2><form id="skin-form">'+
    '<fieldset class="field"><legend>1. ปกติระหว่างวัน ผิวคุณเป็นแบบไหน?</legend>'+options('type',{balanced:'สบายผิว ไม่ค่อยมัน',dry:'ตึงหรือเป็นขุย',oily:'มันทั่วหน้า',combo:'มันเฉพาะหน้าผาก จมูก คาง',unsure:'ยังไม่แน่ใจ'},a?.type)+'</fieldset>'+
    '<fieldset class="field"><legend>2. ใช้ผลิตภัณฑ์ใหม่แล้วแสบ แดง หรือคันง่ายไหม?</legend>'+options('sensitive',{yes:'ค่อนข้างง่าย',no:'ไม่ค่อย',unsure:'ยังไม่แน่ใจ'},a?.reaction)+'</fieldset>'+
    '<fieldset class="field"><legend>3. ตอนนี้อยากดูแลเรื่องไหนก่อน?</legend>'+options('concern',Object.fromEntries(Object.entries(concerns).map(([key,c])=>[key,c.label])),a?.concern)+'</fieldset>'+
    '<div class="field"><label for="skin-extra-goal">อยากดูแลเรื่องอื่นด้วยไหม?</label><textarea id="skin-extra-goal" name="extraGoal" rows="2" maxlength="100" aria-describedby="skin-extra-hint" placeholder="เช่น คอดูคล้ำน้อยลง หรือข้อศอกไม่แห้ง">'+esc(a?.extraGoal)+'</textarea><small id="skin-extra-hint">พิมพ์เพิ่มได้ตามใจ หรือเว้นว่างถ้าเลือกเป้าหมายหลักไว้แล้ว</small></div>'+
    personalFields(p)+'<div class="actions"><button class="btn" type="submit">'+icon('sparkle')+'สร้างแผนของฉัน</button></div></form><p class="note">ผลอิงจากคำตอบของคุณ ใช้เป็นจุดเริ่มต้นในการดูแลผิว หากอาการปวด แสบ หรือผื่นเป็นต่อเนื่อง ควรปรึกษาแพทย์ผิวหนัง</p></section>'+
    '<section class="box" id="skin-result" tabindex="-1">'+(a ? results(p) : '<span class="badge-icon mint">'+icon('scan')+'</span><h2 style="margin-top:10px">แผนดูแลผิวของคุณ</h2><p class="subtle">ตอบแบบเช็กผิวเพื่อดูผลและคำแนะนำเฉพาะโปรไฟล์ ระหว่างนี้คุณเริ่มติ๊กรูทีนพื้นฐานได้จากหน้า “วันนี้”</p>')+'</section></div>';
}
function results(p) {
  const a = p.answers;
  const tips = prefs[a.type];
  const focus = concerns[a.concern];
  const gentle = a.sensitive ? ' เลือกสูตร fragrance-free และลองทีละตัว' : ' ลองผลิตภัณฑ์ใหม่ทีละตัวเพื่อสังเกตปฏิกิริยา';
  const source = 'https://www.aad.org/public/';
  const items = [
    ['01 · คลีนเซอร์',tips[0]+'.'+gentle],
    ['02 · มอยส์เจอไรเซอร์',tips[1]+'. ทาหลังซับหน้าเบา ๆ ขณะที่ผิวยังหมาด'+gentle],
    ['03 · กันแดด',tips[2]+'. มองหา broad spectrum SPF 30 ขึ้นไป และ water resistant ทาก่อนออกแดดและทาซ้ำทุก 2 ชั่วโมงขณะอยู่กลางแจ้ง รวมถึงหลังว่ายน้ำหรือเหงื่อออก']
  ];
  return '<div class="section-top"><div><span class="kicker">YOUR SKIN PLAN</span><h2>'+skinTypes[a.type]+'</h2></div><span class="pill">จากคำตอบของคุณ</span></div>'+
    '<p class="subtle">'+(a.sensitive?'ผิวมีแนวโน้มระคายเคืองง่าย ควรเริ่มด้วยสูตรอ่อนโยน':a.reaction==='unsure'?'ค่อย ๆ สังเกตว่าผิวตอบสนองต่อผลิตภัณฑ์ใหม่อย่างไร':'เริ่มจากรูทีนพื้นฐาน แล้วสังเกตว่าผิวรู้สึกอย่างไร')+'</p>'+
    planContext(p)+'<p class="subtle"><strong>เช้า</strong> ล้างหน้า → มอยส์เจอไรเซอร์ → กันแดด<br><strong>ก่อนนอน</strong> ล้างหน้า → มอยส์เจอไรเซอร์</p>'+
    items.map(([title,detail])=>'<details class="recommend" open><summary>'+title+'</summary><p>'+detail+'</p></details>').join('')+
    '<details class="recommend skin-goal-copy" open><summary>โฟกัส · '+esc(skinGoalLabel(a))+'</summary><p>'+focus.detail+'</p>'+
    (extraSkinGoal(a)?'<p><strong>เป้าหมายเพิ่มเติม</strong> '+esc(extraSkinGoal(a))+'</p>':'')+
    '<p><strong>ติดตามผล</strong> '+focus.message+'</p>'+
    (a.concern==='faceBody'?'<div class="actions"><button type="button" class="btn light small" data-page="body">เปิดแผนผิวกาย'+icon('arrow')+'</button></div><p><a href="'+source+'everyday-care/skin-care-secrets/routine/fade-dark-spots" target="_blank" rel="noopener">เรื่องรอยคล้ำและกันแดด · AAD</a></p>':'')+
    (a.concern==='eyes'?'<p><a href="https://my.clevelandclinic.org/health/symptoms/23128-dark-circles-under-eyes" target="_blank" rel="noopener">สาเหตุของขอบตาคล้ำ · Cleveland Clinic</a></p>':'')+'</details>'+
    exampleCards(p)+'<div class="actions"><button type="button" class="btn small" id="apply-skin-plan">ใช้แผนนี้ในรูทีน'+icon('arrow')+'</button>'+
    '<button type="button" class="btn light small" id="photo-checkin">ตั้งวันติดตามผิว</button></div>'+aiCard(p)+
    '<div class="sources">แหล่งอ้างอิงจาก AAD <a target="_blank" rel="noopener" href="'+source+'everyday-care/skin-care-basics/care/skin-care-budget">พื้นฐานการดูแลผิว</a><a target="_blank" rel="noopener" href="'+source+'everyday-care/sun-protection/shade-clothing-sunscreen/how-to-apply-sunscreen">วิธีทากันแดด</a><a target="_blank" rel="noopener" href="'+source+'diseases/acne/skin-care/tips">การดูแลผิวที่เป็นสิว</a></div>';
}

const checkinLabels = {better:'ดีขึ้น',same:'เหมือนเดิม',worse:'แย่ลง',unsure:'ยังไม่แน่ใจ'};
const weekStart = (key) => shiftDate(key,-weekday(key));

function weeklyStats(p, end = dayKey()) {
  return Array.from({length:7},(_,index)=>{
    const key = shiftDate(end,index-6);
    return {key,...progressFor(p,key),other:checksOn(p,key).length,
      recorded:key===dayKey() || Boolean(p.days[key] || p.dayTasks?.[key] || p.habitChecks?.[key])};
  });
}

function weeklyCheckin(p) {
  const key = weekStart(dayKey()), checkin = p.checkins?.[key];
  const recent = Object.entries(p.checkins ?? {}).filter(([week])=>week<key).sort(([a],[b])=>b.localeCompare(a)).slice(0,3);
  return '<section class="box"><span class="kicker">WEEKLY CHECK-IN</span><h2>เช็กอินผิวสัปดาห์นี้</h2>'+
    '<p class="subtle">สัปดาห์เริ่ม '+thaiDate(key)+(checkin?' · บันทึกล่าสุด '+thaiDate(checkin.date):'')+'</p>'+
    '<form id="checkin-form"><fieldset class="field"><legend>ผิวเป็นอย่างไรเมื่อเทียบกับสัปดาห์ก่อน?</legend>'+
    options('rating',checkinLabels,checkin?.rating)+'</fieldset>'+
    '<div class="field"><label for="checkin-note">สังเกตอะไรได้บ้าง? (ไม่บังคับ)</label>'+
    '<textarea id="checkin-note" name="note" rows="2" maxlength="200" placeholder="เช่น แก้มตึงน้อยลงหลังล้างหน้า">'+esc(checkin?.note)+'</textarea></div>'+
    '<div class="actions"><button type="submit" class="btn">'+(checkin?'อัปเดตเช็กอิน':'บันทึกเช็กอิน')+'</button></div></form>'+
    (recent.length?'<details class="timeline-done"><summary>เช็กอินก่อนหน้า</summary>'+recent.map(([,entry])=>
      '<article class="log"><small>'+thaiDate(entry.date)+'</small><p><strong>'+checkinLabels[entry.rating]+'</strong>'+
      (entry.note?' · '+esc(entry.note):'')+'</p></article>').join('')+'</details>':'')+'</section>';
}

function comparePhotos(p) {
  if (p.photos.length<2) return '<p class="subtle">เมื่อมีสองรูปขึ้นไป รูปแรกกับรูปล่าสุดจะมาอยู่คู่กันตรงนี้</p>';
  return '<div class="photo-grid compare-photos">'+[['รูปแรก',p.photos.at(-1)],['รูปล่าสุด',p.photos[0]]].map(([label,photo])=>
    '<figure><figcaption><strong>'+label+'</strong><small>'+thaiDate(photo.date)+'</small></figcaption>'+
    '<img class="photo" src="'+esc(photo.src)+'" alt="'+label+' '+thaiDate(photo.date)+'"></figure>').join('')+'</div>';
}

const sharedBase = 'https://mossza007dev.github.io/Growtogether/';
let sharedCounts = null;
function sharedProgressHash(hash) {
  const match = /^shared\/(\d{4}-\d{2}-\d{2})\/((?:\d{1,4}|x)(?:\.(?:\d{1,4}|x)){6})$/.exec(hash);
  if (!match) return null;
  const [,date,encoded] = match;
  const parsed = new Date(date+'T12:00:00');
  if (!Number.isFinite(parsed.getTime()) || dayKey(parsed)!==date) return null;
  return {date,counts:encoded.split('.').map(value=>value==='x'?null:Number(value))};
}

function share() {
  const stats = weeklyStats(current());
  const encoded = stats.map(day=>day.recorded?Math.min(9999,day.done+day.other):'x').join('.');
  const url = sharedBase+'#shared/'+stats.at(-1).key+'/'+encoded;
  return sectionHead('SHARE PROGRESS','แชร์ยอดที่ทำเสร็จ','เลือกส่งยอด 7 วันให้แฟนดูได้จากอีกเครื่อง')+
    '<section class="box"><h2>สิ่งที่อยู่ในลิงก์</h2><p class="subtle">มีเฉพาะวันที่และจำนวนงานที่ทำเสร็จ ชื่อ รูป ไดอารี และชื่องานเก็บอยู่ในเครื่อง</p>'+
    sharedCountsGrid(stats.map(day=>({date:day.key,count:day.recorded?day.done+day.other:null})))+
    '<p class="note">ลิงก์เป็นภาพรวม ณ วันที่แชร์ ใครที่ได้รับลิงก์จะเปิดดูยอดนี้ได้ ถ้าอยากส่งยอดใหม่ให้สร้างลิงก์อีกครั้ง</p>'+
    '<div class="field"><label for="progress-link">ลิงก์แชร์</label><input id="progress-link" type="text" readonly value="'+esc(url)+'"></div>'+
    '<div class="actions"><button type="button" class="btn" id="share-progress">แชร์ลิงก์</button>'+
    '<button type="button" class="btn light" id="copy-progress">คัดลอกลิงก์</button></div></section>';
}
function sharedCountsGrid(days) {
  return '<div class="week">'+days.map(({date,count})=>'<div><small>'+thaiDate(date,{day:'numeric',month:'short'})+
    '</small><strong>'+(count===null?'–':count)+'</strong></div>').join('')+'</div>';
}
function shared() {
  const {date,counts} = sharedCounts ?? {};
  return sectionHead('GLOW TOGETHER','ยอดที่ได้รับจากลิงก์','จำนวนงานที่ทำเสร็จในช่วง 7 วัน')+
    '<section class="box">'+(counts?'<h2>'+thaiDate(shiftDate(date,-6))+' – '+thaiDate(date)+'</h2>'+
      sharedCountsGrid(counts.map((count,index)=>({date:shiftDate(date,index-6),count})))+
      '<p class="note">ขีดหมายถึงวันนั้นไม่มีข้อมูลบันทึกไว้</p>':'<p class="note">เปิดยอดจากลิงก์นี้ไม่ได้</p>')+
    '<div class="actions"><button type="button" class="btn" data-page="home">กลับหน้าวันนี้</button></div></section>';
}
async function shareProgress(useShare) {
  const field = $('progress-link'), url = field.value;
  try {
    if (useShare && navigator.share) {
      await navigator.share({title:'Glow Together · ยอดที่ทำเสร็จ',url});
    } else {
      await navigator.clipboard.writeText(url);
      notify('คัดลอกลิงก์แล้ว');
    }
  } catch (error) {
    if (error.name==='AbortError') return;
    field.focus();
    field.select();
    notify('เลือกข้อความแล้ว แตะคัดลอกลิงก์ได้เลย');
  }
}

function week(p) {
  const days = weeklyStats(p);
  const tracked = days.filter(day=>day.done>0).length;
  const completed = days.filter(day=>day.done===day.total).length;
  return '<div class="week">'+days.map(({key,done,total,recorded},i)=>
    '<div class="'+(i===6?'today':'')+'">'+thaiDate(key,{weekday:'short'})+'<strong>'+
      (recorded ? done+'/'+total : '–')+'</strong></div>').join('')+'</div>'+
    '<p class="note">'+(tracked?'ทำรูทีน '+tracked+' จาก 7 วัน และทำครบ '+completed+' วัน':'เมื่อติ๊กขั้นตอนในรูทีน สรุปความสม่ำเสมอจะแสดงตรงนี้')+'</p>';
}
let reviewDraft = null;
const clockText = (value) => typeof value==='string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
const recurringPlan = (p,slot) => p.routine?.[slot] ?? defaultPlan(p,slot);
function reviewPrompt(p) {
  const today = dayKey(), start = shiftDate(today,-6);
  const diary = p.logs.filter(log=>log.date>=start && log.date<=today).slice(0,14);
  const counts = weeklyStats(p).map(({key,done,total,recorded,other})=>({
    date:key,routine:recorded?done+'/'+total:'ไม่ได้บันทึก',other
  }));
  const checkin = Object.values(p.checkins ?? {}).filter(entry=>entry.date>=start && entry.date<=today)
    .map(entry=>({date:entry.date,rating:checkinLabels[entry.rating],note:entry.note}));
  const schedule = Object.keys(periods).flatMap(slot=>{
    const plan = recurringPlan(p,slot);
    return plan.items.map(item=>({slot,id:item.id,title:item.title,time:item.time || plan.time,detail:item.detail,product:item.product}));
  });
  const data = {goal:p.goal || (p.answers?skinGoalLabel(p.answers):''),...(p.answers?{
    skinGoal:skinGoalLabel(p.answers),extraSkinGoal:extraSkinGoal(p.answers)
  }:{}),counts,checkin,diary:diary.map(({date,text})=>({date,text})),schedule};
  return [
    'ช่วยทบทวนรูทีนผิวจากข้อมูล 7 วันด้านล่าง สรุปเฉพาะสิ่งที่บันทึกไว้และระบุถ้าข้อมูลยังไม่พอ',
    'ตอบเป็น JSON เท่านั้น ใช้รูปแบบ {"summary":"สรุปภาษาไทยไม่เกิน 600 ตัวอักษร","changes":[{"slot":"am","id":"cleanse","time":"07:30","detail":"โน้ตภาษาไทยไม่เกิน 220 ตัวอักษร","reason":"เหตุผลไม่เกิน 160 ตัวอักษร"}]}',
    'เลือกเฉพาะขั้นที่มี slot และ id ตรงกับ schedule แนะนำเปลี่ยนเวลา (HH:MM) หรือโน้ตตามหลักฐานจริง ใส่ได้เพียงอย่างเดียวถ้าอีกอย่างไม่เปลี่ยน จำกัด 8 ข้อ ถ้าคงแผนเดิมให้ส่ง changes เป็น []',
    'อย่าวินิจฉัยจากบันทึกหรือเสนอให้เริ่มยา สารออกฤทธิ์ หรือสูตรฟอกผิว ถ้ามีอาการแสบหรือผื่นต่อเนื่อง ให้กล่าวถึงการปรึกษาแพทย์หรือเภสัชกรใน summary',
    JSON.stringify(data,null,2)
  ].join('\n');
}
function reviewChanges(p, reply) {
  if (typeof reply?.summary!=='string' || !reply.summary.trim() || reply.summary.length>600 ||
      !Array.isArray(reply.changes) || reply.changes.length>8) throw new Error('Invalid review');
  const seen = new Set();
  const changes = reply.changes.map(change=>{
    const {slot,id,time,detail,reason} = change ?? {};
    if (!Object.hasOwn(periods,slot) || !validId(id) ||
        (time===undefined && detail===undefined) || (time!==undefined && !clockText(time)) ||
        (detail!==undefined && (typeof detail!=='string' || !detail.trim() || detail.length>220)) ||
        (reason!==undefined && (typeof reason!=='string' || reason.length>160))) throw new Error('Invalid change');
    const plan = recurringPlan(p,slot);
    const item = plan.items.find(item=>item.id===id);
    const key = slot+'-'+id;
    if (!item || seen.has(key)) throw new Error('Unknown or duplicate step');
    seen.add(key);
    return {slot,id,key,title:item.title,oldTime:item.time || plan.time,oldDetail:item.detail,time,detail,reason};
  }).filter(change=>(change.time!==undefined && change.time!==change.oldTime) ||
    (change.detail!==undefined && change.detail!==change.oldDetail));
  return {summary:reply.summary,changes};
}
function previewReview(data) {
  const text = data.get('reply').trim().replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/i,'$1');
  try {
    reviewDraft = reviewChanges(current(),JSON.parse(text));
  } catch {
    return notify('อ่านคำตอบไม่ได้ วาง JSON ทั้งก้อนจาก ChatGPT และตรวจว่ารูทีนยังตรงกับที่ส่งไป');
  }
  render();
  $('review-result').focus();
}
function applyReview(data) {
  const selected = new Set(data.getAll('change'));
  const p = current();
  const changes = reviewDraft?.changes.filter(change=>selected.has(change.key)) ?? [];
  if (!changes.length) return notify('เลือกข้อเสนอที่จะใช้ก่อน');
  if (changes.some(change=>{
    const plan = recurringPlan(p,change.slot);
    const item = plan.items.find(item=>item.id===change.id);
    return !item || (item.time || plan.time)!==change.oldTime || item.detail!==change.oldDetail;
  })) return notify('รูทีนเปลี่ยนแล้ว กรุณาสร้างคำถามและทบทวนใหม่');
  if (update(()=>{
    const plans = p.routine ??= {};
    for (const change of changes) {
      const plan = plans[change.slot] ??= defaultPlan(p,change.slot);
      const item = plan.items.find(item=>item.id===change.id);
      if (change.time!==undefined) item.time = change.time;
      if (change.detail!==undefined) item.detail = change.detail;
    }
    refreshDay(p,dayKey());
  },'ปรับเฉพาะข้อที่เลือกแล้ว ♡')) goto('home');
}
function review() {
  const p = current(), result = reviewDraft;
  const override = p.todayRoutine?.date===dayKey() && Object.keys(periods).some(slot=>p.todayRoutine[slot]);
  const stats = weeklyStats(p), start = stats[0].key, end = stats.at(-1).key;
  const notes = p.logs.filter(log=>log.date>=start && log.date<=end);
  const checkin = Object.values(p.checkins ?? {}).filter(entry=>entry.date>=start && entry.date<=end)
    .sort((a,b)=>b.date.localeCompare(a.date))[0];
  const other = stats.reduce((sum,day)=>sum+day.other,0);
  return sectionHead('WEEKLY REVIEW','ทบทวนแผนของ'+esc(p.name),'ดูบันทึก 7 วัน แล้วเลือกเองว่าจะปรับรูทีนตรงไหน')+
    '<section class="box review-overview"><h2>สรุป 7 วัน</h2>'+week(p)+
    '<p class="subtle">งานดูแลตัวเองเสร็จ '+other+' งาน · บันทึกผิว '+notes.length+' รายการ</p>'+
    (checkin?'<p><strong>เช็กอินล่าสุด</strong> '+checkinLabels[checkin.rating]+(checkin.note?' · '+esc(checkin.note):'')+'</p>':'')+
    (notes.length?'<p><strong>บันทึกล่าสุด</strong> '+esc(notes[0].text)+'</p>':'')+'</section>'+
    '<div class="grid"><section class="box"><h2>ขอให้ ChatGPT ช่วยทบทวน (ถ้าต้องการ)</h2>'+
    '<p class="subtle">คำถามมีเป้าหมาย รูทีน สถานะงาน และไดอารีล่าสุด อ่านก่อนคัดลอกไปวางใน ChatGPT</p>'+
    '<div class="field"><label for="ai-prompt">คำถามจากบันทึก 7 วัน</label><textarea readonly id="ai-prompt" rows="6">'+esc(reviewPrompt(p))+'</textarea></div>'+
    '<div class="actions"><button type="button" class="btn light small" id="copy-ai">คัดลอกคำถาม</button><a class="btn small" href="https://chatgpt.com/" target="_blank" rel="noopener">เปิด ChatGPT'+icon('arrow')+'</a></div>'+
    '<form id="review-form"><div class="field"><label for="review-reply">วางคำตอบ JSON จาก ChatGPT</label><textarea id="review-reply" name="reply" required maxlength="16000" rows="4"></textarea></div>'+
    '<div class="actions"><button type="submit" class="btn light">ดูข้อเสนอก่อนใช้</button></div></form></section>'+
    '<section class="box" id="review-result" tabindex="-1"><h2>ตรวจและเลือกข้อที่จะใช้</h2>'+
    (result?'<p class="note">'+esc(result.summary)+'</p>':'<p class="subtle">วางคำตอบเพื่อดูสรุปและเทียบรูทีนก่อนกับหลัง</p>')+
    (result?.changes.length ? '<form id="apply-review-form">'+result.changes.map(change=>
      '<article class="body-step"><label class="body-choice"><input type="checkbox" name="change" value="'+change.key+'">'+
      '<span><strong>'+esc(change.title)+'</strong><small>'+periods[change.slot]+'</small></span></label>'+
      (change.time!==undefined && change.time!==change.oldTime?'<p><strong>เวลา</strong> '+esc(displayTime(change.oldTime))+' → '+esc(displayTime(change.time))+'</p>':'')+
      (change.detail!==undefined && change.detail!==change.oldDetail?'<p class="subtle"><strong>เดิม</strong> '+esc(change.oldDetail || 'ไม่มีโน้ต')+'</p><p><strong>ข้อเสนอ</strong> '+esc(change.detail)+'</p>':'')+
      (change.reason?'<p class="subtle">'+esc(change.reason)+'</p>':'')+'</article>').join('')+
      (override?'<p class="note">ข้อเสนอใช้กับรูทีนประจำ ส่วนขั้นที่ตั้งเฉพาะวันนี้จะยังใช้ตามตารางวันนี้</p>':'')+
      '<div class="actions"><button type="submit" class="btn">ใช้ข้อที่เลือกกับรูทีนประจำ</button></div></form>':
      result?'<p class="subtle">ไม่มีข้อเสนอให้แก้รูทีน</p>':'')+'</section></div>';
}

function goals() {
  const p = current(), suggested = p.answers ? skinGoalLabel(p.answers) : '';
  return sectionHead('02 / SKIN JOURNAL','เป้าหมายผิวของ'+esc(p.name),'เลือกความเปลี่ยนแปลงที่อยากสังเกต แล้วบันทึกสั้น ๆ ระหว่างทาง')+
    '<div class="grid"><div class="stack"><section class="box"><h2>เป้าหมายของฉัน</h2>'+
    (p.goalDate?'<small>เริ่มเป้าหมาย '+thaiDate(p.goalDate)+'</small>':'<p class="subtle">เริ่มจากเป้าหมายเดียวที่สังเกตได้</p>')+
    '<form id="goal-form"><div class="field"><label for="goal">อยากให้ผิวเปลี่ยนอย่างไร?</label><input type="text" name="goal" id="goal" maxlength="100" required placeholder="เช่น หลังล้างหน้า ผิวไม่ตึงเหมือนเดิม" value="'+esc(p.goal)+'"></div>'+
    (suggested?'<button type="button" class="link-btn skin-goal-copy" id="suggest-goal">ใช้เป้าหมายจากผลเช็กผิว · '+esc(suggested)+'</button>':'')+
    '<div class="actions"><button type="submit" class="btn">บันทึกเป้าหมาย</button></div></form></section>'+
    '<section class="box"><h2>ความสม่ำเสมอ 7 วัน</h2><p class="subtle">จำนวนขั้นตอนที่ทำในแต่ละวัน</p>'+week(p)+'<div class="actions"><button class="btn light small" data-page="review">'+icon('sparkle')+'ให้ AI ช่วยทบทวนแผน</button></div></section>'+
    weeklyCheckin(p)+'<section class="box"><h2>ไดอารีผิว</h2><form id="log-form"><div class="field"><label for="log">วันนี้สังเกตอะไรบ้าง?</label><textarea id="log" name="log" rows="3" maxlength="350" required placeholder="เช่น แก้มตึงน้อยลงหลังทาครีม"></textarea></div><div class="actions"><button class="btn" type="submit">เพิ่มบันทึก</button></div></form>'+
    '<div style="margin-top:10px">'+p.logs.map(log=>'<article class="log"><small>'+thaiDate(log.date)+'</small><p>'+esc(log.text)+'</p><button class="link-btn" data-delete-log="'+log.id+'">ลบบันทึก</button></article>').join('')+'</div></section></div>'+
    '<section class="box"><div class="goal-head"><div class="badge-icon mint">'+icon('camera')+'</div><div><h2>รูปติดตามผิว</h2><small>ถ่ายมุมและแสงเดิมเพื่อเปรียบเทียบ</small></div></div><p class="subtle">เก็บได้ '+maxFacePhotos+' รูปต่อคน รูปอยู่ในเบราว์เซอร์นี้</p>'+comparePhotos(p)+facePhotoEditor(p)+
    (p.photos.length?'<details class="timeline-done"><summary>ดูรูปที่บันทึกทั้งหมด · '+p.photos.length+' รูป</summary>'+
      facePhotoGallery(p.photos,true)+'</details>':'')+'</section></div>';
}
function profile() {
  const installHelp = location.protocol==='https:' && !navigator.standalone
    ? '<details class="box install-help"><summary>เพิ่ม Glow Together บนหน้าจอโฮม iPhone</summary><p class="subtle">เปิดหน้านี้ใน Safari กดแชร์ เลือก “เพิ่มไปยังหน้าจอโฮม” เปิด “เปิดเป็นเว็บแอป” แล้วกดเพิ่ม</p></details>'
    : '';
  return sectionHead('03 / OUR LITTLE CLUB','โปรไฟล์ของเราสองคน','สลับโปรไฟล์จากด้านบนเพื่อดูรูทีนและเป้าหมายของแต่ละคน')+
    '<div class="grid"><section class="box"><h2>ตั้งชื่อโปรไฟล์</h2><form id="names-form">'+state.people.map((p,i)=>'<div class="field"><label for="name-'+i+'">'+avatar(p,i)+' '+(i===0?'โปรไฟล์ของฉัน':'โปรไฟล์ของแฟน')+'</label><input id="name-'+i+'" name="name-'+i+'" type="text" required maxlength="24" value="'+esc(p.name)+'"></div>').join('')+'<div class="actions"><button type="submit" class="btn">บันทึกชื่อ</button></div></form></section>'+
    '<section class="box"><div class="goal-head"><div class="badge-icon">'+icon('heart')+'</div><h2>สำรองและย้ายข้อมูล</h2></div>'+
    '<p>เก็บไฟล์สำรองของทั้งสองโปรไฟล์ไว้ในเครื่อง ใช้กู้คืนหรือย้ายรูทีน เป้าหมาย บันทึก และรูปติดตามผิวได้</p>'+
    '<div class="actions"><button type="button" class="btn" id="backup-export">ดาวน์โหลดไฟล์สำรอง</button>'+
    '<button type="button" class="btn light" id="backup-import">นำเข้าไฟล์สำรอง</button><input type="file" id="backup-file" accept=".json,application/json" hidden></div>'+
    '<p class="note">ข้อมูลในแอปอยู่ในเบราว์เซอร์นี้ ไฟล์สำรองรวมรูปใบหน้าที่คุณเก็บไว้ ควรเก็บไฟล์ในที่ส่วนตัว</p></section>'+installHelp+'</div>';
}

function render() {
  const navPage = ({routine:'home',body:'skin',reminders:'calendar',review:'goals',share:'profile'})[page] ?? page;
  $('nav').innerHTML = Object.entries(routes).filter(([,entry])=>entry).map(([id,[glyph,label]])=>'<button data-page="'+id+'" '+(navPage===id?'class="active" aria-current="page"':'')+'>'+icon(glyph)+label+'</button>').join('');
  $('profiles').innerHTML = state.people.map((p,i)=>'<button data-profile="'+i+'" aria-pressed="'+(state.active===i)+'" class="'+(state.active===i?'active':'')+'" title="'+esc(p.name)+'">'+avatar(p,i)+'<span style="overflow:hidden;text-overflow:ellipsis">'+esc(p.name)+'</span></button>').join('');
  $('main').innerHTML = ({home,skin,body,calendar,goals,profile,routine,reminders,review,share,shared})[page]();
}

function beginRoutine() {
  const p = current();
  const date = dayKey();
  const todayOnly = p.todayRoutine?.date===date && p.todayRoutine[period];
  draft = {plan:structuredClone(basePlanFor(p,period,date)),scope:todayOnly?'today':'daily'};
  goto('routine');
}

function refreshDay(p, date) {
  const day = p.days[date];
  if (!day) return;
  day.planned = plannedKeys(p,date);
  for (const time of Object.keys(periods)) {
    day[time] = day[time].filter(id=>day.planned[time].includes(id));
  }
}

function saveRoutine() {
  if (draft.loadingPhoto) return notify('กำลังเตรียมรูปผลิตภัณฑ์ กรุณารอสักครู่');
  const {plan,scope} = draft;
  if (plan.items.some(item=>!item.title.trim())) return notify('ใส่ชื่อให้ครบทุกขั้นตอน');
  const p = current(), date = dayKey();
  const saved = {
    time:plan.time,
    items:plan.items.map(item=>({...item,title:item.title.trim(),product:item.product.trim(),detail:item.detail.trim()}))
  };
  if (update(()=>{
    if (scope==='today') {
      if (p.todayRoutine?.date!==date) p.todayRoutine = {date};
      p.todayRoutine[period] = saved;
    } else {
      (p.routine ??= {})[period] = saved;
      if (p.todayRoutine?.date===date) delete p.todayRoutine[period];
    }
    if (period==='am' && p.morningStart?.date===date) delete p.morningStart;
    refreshDay(p,date);
  }, 'บันทึกรูทีนแล้ว ♡')) goto('home');
}

function editorClick(btn) {
  const itemId = btn.closest('[data-item]')?.dataset.item;
  const items = draft.plan.items;
  const index = items.findIndex(item=>item.id===itemId);
  if (btn.id==='add-step' && items.length<maxSteps) {
    const id = crypto.randomUUID();
    items.push({id,title:'',product:'',detail:'',time:'',photo:''});
    render();
    $('title-'+id).focus();
  } else if (btn.id==='reset-plan') {
    draft.plan = defaultPlan(current(),period);
    render();
  } else if (index>=0) {
    if (btn.hasAttribute('data-pick-product')) {
      btn.parentElement.querySelector('[data-product-file]').click();
      return;
    }
    if (btn.hasAttribute('data-remove-product')) items[index].photo = '';
    if (btn.hasAttribute('data-remove-step') && items.length>1) items.splice(index,1);
    const other = index+Number(btn.dataset.move);
    if (Number.isInteger(other) && other>=0 && other<items.length) {
      [items[index],items[other]] = [items[other],items[index]];
    }
    render();
  }
}

document.addEventListener('click', (event) => {
  const btn = event.target.closest('button');
  if (!btn) return;
  const {page:target,profile:index,deleteLog,deletePhoto} = btn.dataset;
  if (target) goto(target);
  if (index !== undefined && state.active!==Number(index)) {
    if (page==='routine') goto('home');
    habitDraft = null;
    reviewDraft = null;
    facePhotoDraft = null;
    facePhotoRequest++;
    showCompleted = showSkipped = false;
    update(()=>{state.active = Number(index);});
  }
  const {task,skipTask,calendarDate:date,calendarJump:jump,calendarView:view,preset,editHabit,deleteHabit} = btn.dataset;
  if (btn.id==='start-morning') return startMorning();
  if (btn.id==='undo-morning-start') {
    if (update(()=>{delete current().morningStart;},'คืนเวลารูทีนเช้าของวันนี้แล้ว')) $('start-morning')?.focus();
    return;
  }
  if (btn.id==='apply-skin-plan') return applySkinPlan();
  if (btn.id==='copy-ai') return copyAiPrompt();
  if (btn.id==='share-progress' || btn.id==='copy-progress') return shareProgress(btn.id==='share-progress');
  if (btn.id==='photo-checkin') {
    calendarDate = dayKey();
    habitDraft = structuredClone(habitPresets.photo);
    habitDraft.detail = concerns[current().answers.concern].message;
    goto('calendar');
    $('habit-editor').focus();
  }
  if (btn.id==='open-calendar') {
    calendarDate = dayKey();
    goto('calendar');
  }
  if (task || skipTask) return changeTaskStatus(task || skipTask,skipTask?'skip':'check');
  if (view) {
    calendarView = view;
    render();
    document.querySelector('[data-calendar-view="'+view+'"]').focus();
    return;
  }
  if (date || jump) {
    calendarDate = date || (calendarView==='month'
      ? shiftMonth(calendarDate,Number(jump)) : shiftDate(calendarDate,7*Number(jump)));
    render();
    if (date && calendarView==='month') $('calendar-day-detail').focus();
    else document.querySelector(jump ? '[data-calendar-jump="'+jump+'"]' : '[data-calendar-date="'+date+'"]').focus();
    return;
  }
  if (btn.id==='calendar-back-to-month') {
    $('calendar-picker').focus();
    return;
  }
  if (preset || editHabit) {
    const template = preset==='custom' ? {title:'',time:'',detail:'',days:[weekday(calendarDate)]} : habitPresets[preset];
    habitDraft = structuredClone(editHabit ? current().habits.find(h=>h.id===editHabit) : template);
    render();
    $('habit-editor').focus();
  }
  if (btn.id==='cancel-habit') {
    habitDraft = null;
    render();
  }
  if (deleteHabit && window.confirm('ลบงานนี้ออกจากตารางหรือไม่?')) {
    habitDraft = null;
    update(()=>{current().habits = current().habits.filter(h=>h.id!==deleteHabit);},'ลบงานจากตารางแล้ว');
  }
  if (btn.dataset.editPeriod) {
    period = btn.dataset.editPeriod;
    return beginRoutine();
  }
  if (page==='routine' && btn.type==='button') return editorClick(btn);
  if (btn.id==='suggest-goal') $('goal').value = skinGoalLabel(current().answers);
  if (btn.id==='backup-export') downloadBackup();
  if (btn.id==='backup-import') $('backup-file').click();
  if (btn.dataset.facePicker) $(btn.dataset.facePicker).click();
  if (btn.id==='cancel-face-photo') {
    facePhotoDraft = null;
    facePhotoRequest++;
    render();
    document.querySelector('[data-face-picker="face-camera"]')?.focus();
  }
  if (btn.dataset.photoDate) {
    calendarDate = btn.dataset.photoDate;
    goto('calendar');
  }
  if (btn.id==='calendar-add-face-photo') goto('skin');
  if (deleteLog && window.confirm('ลบบันทึกนี้ใช่ไหม?')) update(()=>{current().logs = current().logs.filter(log=>log.id!==deleteLog);},'ลบบันทึกแล้ว');
  if (deletePhoto && window.confirm('ลบรูปนี้ใช่ไหม?')) update(()=>{current().photos = current().photos.filter(photo=>photo.id!==deletePhoto);},'ลบรูปแล้ว');
});

document.addEventListener('submit', (event) => {
  const form = event.target;
  event.preventDefault();
  if (form.id==='routine-form') return saveRoutine();
  const data = new FormData(form), p = current();
  if (form.id==='habit-form') return saveHabit(data);
  if (form.id==='face-photo-form') return saveFacePhoto(data.get('note'));
  if (form.id==='reminder-form') return exportReminders(data);
  if (form.id==='review-form') return previewReview(data);
  if (form.id==='apply-review-form') return applyReview(data);
  if (form.id==='body-form') {
    if (update(()=>{
      p.bodyPlan = {goal:data.get('goal'),feel:data.get('feel'),avoid:data.get('avoid').trim()};
    })) $('body-result').focus();
    return;
  }
  if (form.id==='apply-body-form') return applyBodyPlan(data);
  if (form.id==='skin-form') {
    const concern = data.get('concern'), extraGoal = data.get('extraGoal').trim();
    if (concern==='custom' && !extraGoal) {
      $('skin-extra-goal').focus();
      return notify('พิมพ์เป้าหมายที่อยากดูแลก่อนสร้างแผน');
    }
    if (update(()=>{
      p.answers = {type:data.get('type'),reaction:data.get('sensitive'),sensitive:data.get('sensitive')==='yes',concern,extraGoal};
      p.personal = {age:data.get('age'),texture:data.get('texture'),budget:data.get('budget'),current:data.get('current').trim(),avoid:data.get('avoid').trim()};
    },'สร้างแผนให้คุณแล้ว ♡')) {
      $('skin-result').focus();
    }
  }
  if (form.id==='checkin-form') {
    const date = dayKey(), rating = data.get('rating'), note = data.get('note').trim();
    if (!Object.hasOwn(checkinLabels,rating)) return;
    update(()=>{(p.checkins ??= {})[weekStart(date)] = {date,rating,note};},'บันทึกเช็กอินแล้ว ♡');
    return;
  }
  if (form.id==='goal-form') {
    const goal = data.get('goal').trim();
    if (!goal) return notify('พิมพ์เป้าหมายก่อนบันทึก');
    update(()=>{if (p.goal!==goal) p.goalDate=dayKey(); p.goal=goal;},'บันทึกเป้าหมายแล้ว ♡');
  }
  if (form.id==='log-form') {
    const text = data.get('log').trim();
    if (!text) return notify('พิมพ์บันทึกก่อนกดเพิ่ม');
    update(()=>{p.logs.unshift({id:crypto.randomUUID(),date:dayKey(),text});},'เพิ่มบันทึกแล้ว');
  }
  if (form.id==='names-form') {
    const names = state.people.map((_,i)=>data.get('name-'+i).trim());
    if (names.some(name=>!name)) return notify('ใส่ชื่อให้ครบทั้งสองโปรไฟล์');
    update(()=>{state.people.forEach((person,i)=>{person.name=names[i];});},'บันทึกชื่อแล้ว');
  }
});

document.addEventListener('toggle', (event)=>{
  if (!event.target.matches('.timeline .timeline-done') || !event.target.isConnected) return;
  if (event.target.hasAttribute('data-skipped')) showSkipped = event.target.open;
  else showCompleted = event.target.open;
},true);

document.addEventListener('input', (event)=>{
  const field = event.target;
  if (field.id==='face-note' && facePhotoDraft) facePhotoDraft.note = field.value;
  if (!draft || !field.closest('#routine-form')) return;
  if (field.id==='routine-time') draft.plan.time = field.value;
  if (field.id==='routine-scope') draft.scope = field.value;
  if (field.dataset.key) {
    const item = draft.plan.items.find(item=>item.id===field.closest('[data-item]').dataset.item);
    item[field.dataset.key] = field.value;
  }
});

async function resizedPhoto(file, size, quality = .78, maxLength = Infinity) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement('canvas');
    let scale = Math.min(1, size/Math.max(img.width,img.height));
    let result;
    do {
      canvas.width = Math.max(1,Math.round(img.width*scale));
      canvas.height = Math.max(1,Math.round(img.height*scale));
      const context = canvas.getContext('2d');
      context.fillStyle = '#fff';
      context.fillRect(0,0,canvas.width,canvas.height);
      context.drawImage(img,0,0,canvas.width,canvas.height);
      result = canvas.toDataURL('image/jpeg',quality);
      scale *= .8;
    } while (result.length>maxLength && Math.max(canvas.width,canvas.height)>120);
    return result;
  } finally {
    URL.revokeObjectURL(url);
  }
}

document.addEventListener('change', async (event) => {
  const input = event.target;
  if (input.id==='habit-repeat') {
    const once = input.value==='once';
    $('habit-weekdays').hidden = once;
    $('habit-single-date').hidden = !once;
    $('habit-date').disabled = !once;
    $('habit-date').required = once;
    return;
  }
  if (input.id==='backup-file') return restoreBackup(input);
  const isProduct = input.hasAttribute('data-product-file');
  const isFace = input.id==='face-camera' || input.id==='face-library';
  if (!isFace && !isProduct) return;
  const file = input.files[0];
  if (!file) return;
  input.value='';
  if ((file.type && !file.type.startsWith('image/')) || file.size>25*1024*1024) {
    return notify('เลือกไฟล์รูปขนาดไม่เกิน 25 MB');
  }
  if (isFace) return previewFacePhoto(file);
  const editing = draft;
  const item = isProduct && editing?.plan.items.find(item=>item.id===input.closest('[data-item]').dataset.item);
  if (item) editing.loadingPhoto = (editing.loadingPhoto ?? 0)+1;
  try {
    const photo = await resizedPhoto(file,288);
    if (draft===editing && editing?.plan.items.includes(item)) {
      item.photo = photo;
      render();
    }
  } catch {
    notify('เปิดไฟล์รูปนี้ไม่ได้ ลองเลือกรูปอื่น');
  } finally {
    if (item) editing.loadingPhoto--;
  }
});

function routeFromHash() {
  const hash = location.hash.slice(1);
  sharedCounts = sharedProgressHash(hash);
  return sharedCounts ? 'shared' : Object.hasOwn(routes,hash) ? hash : 'home';
}
window.addEventListener('hashchange',()=>{
  const target = routeFromHash();
  if (target==='shared') {
    page = target;
    render();
  } else if (target!==page) goto(target);
});
$('logoIcon').innerHTML = icon('sparkle');
const initialPage = routeFromHash();
page = initialPage==='routine' ? 'home' : initialPage;
render();
if (page!=='shared' && !current().dayTasks?.[dayKey()]) {
  archiveToday(current());
  try {
    localStorage.setItem(storageKey,JSON.stringify(state));
  } catch {
    // The app remains usable if browser storage is unavailable.
  }
}

if (globalThis.isSecureContext && location.protocol!=='file:' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
