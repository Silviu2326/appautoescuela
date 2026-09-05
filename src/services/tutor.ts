import type {ContentPack,Question} from '../types';
import {suggestedConcept} from '../engine/learning';
export type TutorMessage={role:'user'|'assistant';provider?:'guided'|'ai';text:string;source?:string};
export function guidedReply(pack:ContentPack,text:string,q?:Question,kind:'explain'|'simple'|'reason'='explain'){
 const id=q?.concepts[0]??suggestedConcept(pack,text)[0];const c=pack.concepts.find(c=>c.id===id);
 if(!c)return {text:'No tengo una explicación local suficiente para esa duda. Elige un concepto del temario o pregunta al profesor de tu autoescuela. Con un servidor y un proveedor configurados puedes activar el tutor conversacional.',source:undefined};
 if(kind==='simple')return {text:`Imagina esto: ${c.example}\n\nQuédate con esta idea: ${c.summary}`,source:c.source};
 if(kind==='reason')return {text:`Compara tu razonamiento con este punto: ${c.pitfall}\n\n${c.summary}\n\n¿Cambiarías tu respuesta? Puedes practicar una variante para comprobarlo.`,source:c.source};
 return {text:`${q?.explanation??c.summary}\n\nUn ejemplo: ${c.example}\n\nPresta atención: ${c.pitfall}`,source:q?.source??c.source};
}
