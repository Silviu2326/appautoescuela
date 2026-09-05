import {createContext,useContext,type ReactNode} from 'react';
import type {Question,SessionResult,Tab} from './types';
export type Route={name:'tabs'}|{name:'concept';id:string}|{name:'study'}|{name:'exam'}|{name:'result';result:SessionResult}|{name:'scenes'}|{name:'risk'}|{name:'notes'}|{name:'settings'}|{name:'tutor';question?:Question};
export type Navigation={tab:Tab;setTab:(t:Tab)=>void;open:(r:Route)=>void;back:()=>void;home:()=>void;replace:(r:Route)=>void};
const C=createContext<Navigation|null>(null);export const NavigationProvider=({value,children}:{value:Navigation;children:ReactNode})=><C.Provider value={value}>{children}</C.Provider>;
export function useNav(){const n=useContext(C);if(!n)throw Error('Missing navigation');return n;}
