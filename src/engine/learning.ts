import type {Answer,ContentPack,Mastery,Progress,Question} from '../types';
export const DAY=86400000;
export function mastery(pack:ContentPack,p:Progress,now=Date.now()):Mastery[]{
 const versions=new Map(pack.questions.filter(q=>q.review!=='retired').map(q=>[q.id,q.version]));
 return pack.concepts.map(c=>{
  const attempts=p.answers.filter(a=>a.concepts.includes(c.id)&&(a.mode==='risk'||(versions.get(a.questionId)===a.questionVersion)));
  let chain:Answer[]=[];
  for(const a of attempts){if(a.correct&&a.confidence==='sure'&&!a.helpUsed)chain.push(a);else chain=[];}
  const last=attempts.at(-1);const days=new Set(chain.map(a=>a.at.slice(0,10))).size;const variants=new Set(chain.map(a=>a.questionId)).size;
  const stage=!last?'new':!last.correct||last.confidence!=='sure'||last.helpUsed?'understand':days>=3&&variants>=2&&chain.length>=3&&Date.parse(last.at)-Date.parse(chain[0].at)>=2*DAY?'consolidated':'practice';
  // Only distinct days advance the interval. Same-session repetition cannot consolidate.
  const interval=stage==='understand'?10*60*1000:stage==='consolidated'?7*DAY:Math.min(3,Math.max(1,days))*DAY;
  return {id:c.id,stage,attempts:attempts.length,successes:chain.length,days,variants,dueAt:last?new Date(Date.parse(last.at)+interval).toISOString():null,lastAt:last?.at??null,uncertain:!!last&&(last.confidence!=='sure'||last.helpUsed)};
 });
}
export function shuffled<T>(list:T[],rng=Math.random){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function studySelection(pack:ContentPack,p:Progress,{count=5,conceptId,review=false}:{count?:number;conceptId?:string;review?:boolean}={},now=Date.now()){
 const states=new Map(mastery(pack,p,now).map(m=>[m.id,m]));const seen=new Set(p.answers.map(a=>a.questionId));const last=new Map(p.answers.map(a=>[a.questionId,a]));const marked=new Set(p.bookmarks.filter(b=>b.active).map(b=>b.questionId));
 let bank=pack.questions.filter(q=>q.pool==='training'&&q.review!=='retired');
 if(conceptId)bank=bank.filter(q=>q.concepts.includes(conceptId));
 if(review)bank=bank.filter(q=>marked.has(q.id)||last.get(q.id)?.correct===false||q.concepts.some(id=>{const m=states.get(id);return !!m?.dueAt&&Date.parse(m.dueAt)<=now;}));
 const priority=(q:Question)=>{let score=marked.has(q.id)?90:0;score+=last.get(q.id)?.correct===false?70:0;score+=!seen.has(q.id)?30:0;for(const id of q.concepts){const m=states.get(id);if(m?.dueAt&&Date.parse(m.dueAt)<=now)score+=50;if(m?.stage==='understand')score+=35;}return score;};
 const ordered=shuffled(bank).sort((a,b)=>priority(b)-priority(a));const selected:Question[]=[];const families=new Set<string>();for(const q of ordered){if(!families.has(q.family)){selected.push(q);families.add(q.family);}if(selected.length>=count)break;}for(const q of ordered){if(selected.length>=count)break;if(!selected.some(x=>x.id===q.id))selected.push(q);}return selected;
}
export function examSelection(pack:ContentPack,p:Progress,count=30){const seen=new Set(p.answers.map(a=>a.questionId));return shuffled(pack.questions.filter(q=>q.pool==='assessment'&&q.review!=='retired')).sort((a,b)=>Number(seen.has(a.id))-Number(seen.has(b.id))).slice(0,count);}
export function suggestedConcept(pack:ContentPack,text:string){const clean=text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');return pack.concepts.filter(c=>c.keywords.some(k=>clean.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g,'')))).map(c=>c.id);}
export function readiness(p:Progress){const exams=p.sessions.filter(s=>s.mode==='exam').slice(0,5);return {exams,stable:exams.length>=3&&exams.slice(0,3).every(s=>s.total===30&&s.total-s.correct<=3),unseen:exams.reduce((sum,s)=>sum+s.unseen,0),accuracy:exams.length?exams.reduce((sum,s)=>sum+s.correct,0)/exams.reduce((sum,s)=>sum+s.total,0):null};}
export const stageLabel={new:'Por descubrir',understand:'Por entender',practice:'Practicando',consolidated:'Consolidado'};
export function localDay(at=new Date()){return `${at.getFullYear()}-${String(at.getMonth()+1).padStart(2,'0')}-${String(at.getDate()).padStart(2,'0')}`;}
