import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../server/app.ts';
import {emptyProgress} from '../src/engine/progress.ts';
test('server: account isolation, sharing revocation, editorial versioning, provider gating',async()=>{
 const app=createApp({dbPath:':memory:',adminEmail:'editor@example.com',adminPassword:'test-password-strong',publicUrl:'https://school.example'});
 await new Promise<void>(r=>app.server.listen(0,'127.0.0.1',r));const port=(app.server.address() as any).port;
 const request=async(path:string,data?:unknown,token?:string)=>{const r=await fetch(`http://127.0.0.1:${port}${path}`,{method:data===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:data===undefined?undefined:JSON.stringify(data)});return {status:r.status,data:await r.json() as any};};
 try{
  const first=await request('/api/register',{email:'one@example.com',password:'student-password-1'});assert.equal(first.status,200);const token=first.data.token;
  const second=await request('/api/register',{email:'two@example.com',password:'student-password-2'});const token2=second.data.token;
  assert.equal((await request('/api/admin/state',undefined,token)).status,403);
  assert.equal((await request('/api/sync',{progress:{}},token)).status,400);
  const progress=emptyProgress();progress.notes=[{id:'note-1',text:'Practicar prioridad',concepts:['right'],at:new Date().toISOString(),updatedAt:new Date().toISOString(),deleted:false}];
  assert.equal((await request('/api/sync',{progress},token)).data.progress.notes.length,1);
  assert.equal((await request('/api/sync',{progress:emptyProgress()},token2)).data.progress.notes.length,0);
  const share=await request('/api/shares',{noteId:'note-1',text:'Practicar prioridad'},token);const secret=new URL(share.data.url).hash.slice(1);
  assert.equal((await request('/api/review',{secret})).data.text,'Practicar prioridad');
  assert.equal((await request('/api/review',{secret,feedback:'Revisar el cruce sin señalizar'})).status,200);
  assert.match((await request('/api/feedback?noteId=note-1',undefined,token)).data.feedback,/cruce/);
  await request('/api/shares/revoke',{id:share.data.id},token2);assert.equal((await request('/api/review',{secret})).status,200);
  await request('/api/shares/revoke',{id:share.data.id},token);assert.equal((await request('/api/review',{secret})).status,404);
  assert.equal((await request('/api/tutor',{message:'Hola'},token)).status,503);
  const admin=(await request('/api/login',{email:'editor@example.com',password:'test-password-strong'})).data.token;
  const state=(await request('/api/admin/state',undefined,admin)).data;const question={...state.pack.questions[0],review:'reviewed',reviewedBy:'Editor',reviewedAt:new Date().toISOString()};
  assert.equal((await request('/api/admin/draft',{kind:'question',item:question,baseVersion:1},admin)).status,200);
  assert.equal((await request('/api/admin/publish',{id:question.id,baseVersion:1},admin)).data.version,2);
  const pack=(await request('/api/content')).data;assert.equal(pack.questions.find((q:any)=>q.id===question.id).reviewedBy,'editor@example.com');
  assert.equal((await request('/api/admin/draft',{kind:'question',item:question,baseVersion:1},admin)).status,409);
  const concept={...pack.concepts[0],summary:pack.concepts[0].summary+' Ejemplo revisado.'};
  await request('/api/admin/draft',{kind:'concept',item:concept,baseVersion:2},admin);assert.equal((await request('/api/admin/publish',{id:concept.id,baseVersion:2},admin)).data.version,3);
  assert.equal((await request('/api/admin/restore',{version:1,baseVersion:3},admin)).data.version,4);
  const restored=(await request('/api/content')).data;assert.ok(restored.questions[0].version>1);
  await request('/api/logout',{},token);assert.equal((await request('/api/shares',undefined,token)).status,401);
 }finally{await new Promise<void>((r,e)=>app.server.close(err=>err?e(err):r()));app.db.close();}
});
