import {initialPack} from './catalog';
export const questions=initialPack.questions;
export const topics=[...new Set(questions.map(q=>q.topic))];
export const questionMap=new Map(questions.map(q=>[q.id,q]));
