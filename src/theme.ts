import {StyleSheet} from 'react-native';
export const colors={background:'#F7F8FA',surface:'#FFFFFF',ink:'#172A34',muted:'#687780',green:'#176B55',mint:'#E3F2EA',border:'#DCE2E6',orange:'#A45C1B',orangeLight:'#FFF1E4',red:'#A73838'};
export const styles=StyleSheet.create({
 screen:{flex:1,backgroundColor:colors.background},content:{padding:22,paddingBottom:30,gap:24},
 row:{flexDirection:'row',alignItems:'center',gap:12},between:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},
 title:{fontSize:32,lineHeight:38,fontWeight:'700',letterSpacing:-1,color:colors.ink},heading:{fontSize:21,lineHeight:27,fontWeight:'700',color:colors.ink},body:{fontSize:16,lineHeight:24,color:colors.ink},muted:{fontSize:14,lineHeight:21,color:colors.muted},caption:{fontSize:12,lineHeight:18,color:colors.muted},
 panel:{backgroundColor:colors.surface,borderRadius:16,padding:20,borderWidth:1,borderColor:colors.border,gap:12},note:{backgroundColor:colors.mint,borderRadius:12,padding:18,gap:6},list:{backgroundColor:colors.surface,borderRadius:14,borderWidth:1,borderColor:colors.border,overflow:'hidden'},
 divider:{height:1,backgroundColor:colors.border},badge:{color:colors.green,fontWeight:'700',fontSize:14},
});
