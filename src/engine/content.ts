import type {ContentPack,Question} from '../types';
export function validateQuestion(q:Question,pack:Pick<ContentPack,'concepts'|'scenes'>){
 if(!q||typeof q.id!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(q.id)||typeof q.prompt!=='string'||q.prompt.length<10||q.prompt.length>2500||!Array.isArray(q.options)||q.options.length!==3||q.options.some(o=>typeof o!=='string'||!o.trim()||o.length>1200)||!Number.isInteger(q.correct)||q.correct<0||q.correct>2||typeof q.explanation!=='string'||q.explanation.length<10||!q.concepts?.length||q.concepts.some(c=>!pack.concepts.some(x=>x.id===c))||!['training','assessment'].includes(q.pool)||!Number.isInteger(q.version)||q.version<1||!['demonstration','reviewed','retired'].includes(q.review)||typeof q.rights!=='string'||!q.rights.trim()||typeof q.family!=='string'||!q.family)throw new Error('Pregunta incompleta o inválida.');
 const url=new URL(q.source);if(url.protocol!=='https:')throw new Error('La fuente debe ser HTTPS.');
 if(q.sceneId&&!pack.scenes.some(s=>s.id===q.sceneId))throw new Error('Escena inexistente.');
 if(q.review==='reviewed'&&(!q.reviewedBy?.trim()||!q.reviewedAt||!Number.isFinite(Date.parse(q.reviewedAt))))throw new Error('Faltan responsable y fecha de revisión.');
}
const validId=(v:unknown)=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(v);
const strings=(v:unknown)=>Array.isArray(v)&&v.every(x=>typeof x==='string'&&x.trim());
const https=(v:string)=>{try{return new URL(v).protocol==='https:';}catch{return false;}};
export function validatePack(p:ContentPack){
 if(!p||!Number.isInteger(p.version)||p.version<1||!Array.isArray(p.questions)||p.questions.length>20000||!Array.isArray(p.concepts)||!Array.isArray(p.scenes)||typeof p.notice!=='string'||!Number.isFinite(Date.parse(p.updatedAt)))throw new Error('Paquete inválido.');
 for(const collection of [p.questions,p.concepts,p.scenes])if(new Set(collection.map(q=>q?.id)).size!==collection.length)throw new Error('Identificadores duplicados.');
 for(const c of p.concepts){if(!c||!validId(c.id)||![c.name,c.summary,c.example,c.pitfall].every(v=>typeof v==='string'&&v.trim())||!strings(c.keywords)||!strings(c.prerequisites)||!https(c.source)||c.prerequisites.some(id=>!p.concepts.some(x=>x.id===id)))throw new Error('Concepto inválido.');}
 const walk=(id:string,path:Set<string>)=>{if(path.has(id))throw new Error('Los requisitos forman un ciclo.');const next=new Set(path).add(id);for(const parent of p.concepts.find(c=>c.id===id)!.prerequisites)walk(parent,next);};for(const c of p.concepts)walk(c.id,new Set());
 for(const s of p.scenes){if(!s||!validId(s.id)||typeof s.name!=='string'||!s.name.trim()||typeof s.explanation!=='string'||s.explanation.length<10||!strings(s.concepts)||!s.concepts.length||s.concepts.some(id=>!p.concepts.some(c=>c.id===id))||!https(s.source)||!['right','giveA','giveB','stopA','blocked'].includes(s.rule)||!['A','B','none'].includes(s.winner))throw new Error('Escena inválida.');const expected=s.rule==='giveB'?'A':s.rule==='blocked'?'none':'B';if(s.winner!==expected)throw new Error('La solución de la escena no coincide con su regla.');}
 for(const q of p.questions)validateQuestion(q,p);return p;
}
