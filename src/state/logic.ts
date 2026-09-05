export {emptyProgress} from '../engine/progress';
export {parseProgress} from '../engine/progress';
import type {Answer,Mode,Progress,Question} from '../types';
import {shuffled} from '../engine/learning';
export const shuffle=shuffled;
export function latestAnswers(answers:Answer[]){return new Map(answers.map(a=>[a.questionId,a]));}
export function pendingQuestions(bank:Question[],p:Progress){const latest=latestAnswers(p.answers);return bank.filter(q=>latest.get(q.id)?.correct===false);}
export function selectQuestions(bank:Question[],p:Progress,mode:Mode){let list=bank.filter(q=>q.pool==='training'&&q.review!=='retired');if(mode==='review')return shuffled(pendingQuestions(list,p));if(!['daily','quick'].includes(mode))return shuffled(list.filter(q=>q.topic===mode));const latest=latestAnswers(p.answers);list=shuffled(list).sort((a,b)=>Number(latest.get(b.id)?.correct===false)-Number(latest.get(a.id)?.correct===false));return list.slice(0,mode==='daily'?5:10);}
