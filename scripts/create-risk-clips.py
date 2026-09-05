"""Produce original schematic teaching videos. Requires Pillow and ffmpeg; no external footage."""
from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import subprocess
root=Path(__file__).resolve().parents[1]
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18)
for name in ['hidden-pedestrian','braking-car']:
 out=root/'assets'/'risk'/f'{name}.mp4'
 process=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s','640x360','-r','24','-i','-','-an','-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',str(out)],stdin=subprocess.PIPE)
 for i in range(192):
  t=i/24
  im=Image.new('RGB',(640,360),'#dce9df');d=ImageDraw.Draw(im)
  d.rectangle((180,0,455,360),fill='#65767a');d.rectangle((455,0,470,360),fill='#b7c5c0')
  for y in range(-60,390,70):
   yy=y+int(t*40)%70;d.line((310,yy,310,yy+32),fill='#eef3ef',width=3)
  d.rounded_rectangle((327,267,378,343),radius=11,fill='#176b55',outline='white',width=2)
  d.rectangle((336,278,369,294),fill='#c9dfd7')
  if name=='hidden-pedestrian':
   d.rounded_rectangle((403,136,453,239),radius=9,fill='#aebbba',outline='#f0f4f1',width=2)
   x=480-min(100,max(0,t-2.8)*30);y=122
   d.ellipse((x-10,y-10,x+10,y+10),fill='#db8c47');d.line((x,y+10,x,y+30),fill='#db8c47',width=7)
   d.line((x,y+28,x-8,y+40),fill='#db8c47',width=5);d.line((x,y+28,x+8,y+40),fill='#db8c47',width=5)
   title='Una zona oculta junto a la acera'
  else:
   y=78+min(85,max(0,t-3)*23)
   d.rounded_rectangle((327,y,378,y+72),radius=10,fill='#8faca7',outline='white',width=2)
   d.rectangle((336,y+9,369,y+23),fill='#dbe8e3')
   if t>=3:d.rectangle((329,y+60,339,y+68),fill='#ff3b37');d.rectangle((365,y+60,376,y+68),fill='#ff3b37')
   title='El vehiculo de delante reduce la marcha'
  d.rectangle((0,0,640,38),fill='#172a34');d.text((16,8),title,font=font,fill='white');d.text((14,330),'Escena didactica animada',font=font,fill='#172a34')
  process.stdin.write(im.tobytes())
 process.stdin.close();assert process.wait()==0
 print(out.name,out.stat().st_size)
