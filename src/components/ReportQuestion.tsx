import {useState} from 'react';
import {View} from 'react-native';
import {Button} from './UI';
import {Field,Hint} from './Common';
import {api,loadConnection} from '../services/api';
export function ReportQuestion({questionId}:{questionId:string}){const [open,setOpen]=useState(false),[text,setText]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);return <View style={{gap:12}}><Button secondary label="Informar de un problema" onPress={()=>setOpen(!open)}/>{open?<><Field label="¿Qué deberíamos revisar?" value={text} onChange={setText} multiline/><Button label="Enviar al equipo editorial" disabled={busy||!text.trim()} onPress={async()=>{setBusy(true);try{const c=await loadConnection();if(!c)throw Error('Conecta una cuenta en Mi avance para enviar la incidencia.');await api(c,'/api/report',{questionId,text});setMessage('Incidencia enviada para revisión.');setText('');}catch(e){setMessage((e as Error).message);}finally{setBusy(false);}}}/>{message?<Hint>{message}</Hint>:null}</>:null}</View>;}
