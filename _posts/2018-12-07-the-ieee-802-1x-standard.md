---
title: The IEEE 802.1x Standard
date: 2018-12-07 00:00:00 +0630
categories: [802dot1x]
tags: [802dot1x, IEEE 802dot1x]
---

![Window shadow](/posts/201812071/diagram.png){: .shadow width="500" height="500" style="max-width: 90%" }


<h3>zawgyi</h3>

Hello! မဂၤလာပါခင္ဗ်!
အရင္တပတ္က က်ေနာ္ 802.1x lab ေလးစမ္းျဖစ္ခဲ့ပါတယ္။ အဲ့ထဲကမွ က်ေနာ္သိခဲ့တဲ့ The IEEE 802.1x standard အေၾကာင္းေလး ေဆြးေႏြးေျပာျပခ်င္ပါတယ္။

The IEEE 802.1x ဆိုတာကေတာ့ LANs ဒါမွမဟုတ္ wireless LANs ထဲမွာ႐ွိေနတဲ့ device အခ်င္းခ်င္း ခ်ိတ္ဆက္အသံုးျပဳရာမွာ သံုးတဲ့ authentication standard ကိုသတ္မွတ္ေပးတဲ့ "စံ" ပါ။

The IEEE 802.1x standard ကိုသိေအာင္မလုပ္ခင္ point-to-point protocol (PPP) နဲ႔ extensible-authentication-protocol (EAP) တို႔ကိုအက်ဥ္းခ်ံဳးေလ့လာၾကည့္မယ္ဆိုရင္ PPP protocol က username နဲ႔ password ကိုသံုးပီး access လုပ္တဲ့ user ကို identify လုပ္တယ္။ EAP protocol က်ေတာ့ password ကေန challenge-response tokens ေတ public-key infrastructure certificate ေတအသံုးျပဳၿပီး authentication လုပ္ပါတယ္။

The IEEE 802.1x standard မွာက်ေတာ့ EAP protocol ကိုသံုးပီး authentication လုပ္တယ္ေပါ့။ အဓိကအားျဖင့္အစိတ္အပိုင္းသံုးခုေပၚအေျခခံပါတယ္။ supplicant (authenticate လုပ္မယ့္ client), radius (authentication server) နဲ႔ authenticator (wireless AP or network device) ေတေပါ့။ သူ႔ရဲ႕ main concept က memory နည္းပီး load မ်ားမ်ားမလုပ္ႏုိင္တဲ့ Access Points ေတအတြက္ရည္ရြယ္တာပါ။ အဲ့တာေျကာင့္ Operation load ေတာ္ေတာ္မ်ားမ်ားဟာ supplicant နဲ႔ radius ေပၚမွာ႐ွိေနမွာပါ။

![Window shadow](/posts/201812071/procedure.png){: .shadow width="500" height="500" style="max-width: 90%" }

# Why 802.1x?

အရင္ အသံုးျပဳခဲ့တဲ့ Wired Equivalent Privacy (WEP) protocol က Enterprise Network security အတြက္ guarantee မေပးနိုင္ေတာ့လို႔ပါ။ 802.1x မွာက authenticator (switch) ေပၚမွာ port level security control လုပ္လို႔ရပီး 802.1x protected လုပ္ထားတဲ့ port နဲ႔ join ထားတဲ့ user က authentication မေအာင္မျခင္း EAP ကလြဲလို႔ တျခား ဘယ္ traffic ကိုမွ authenticator ဆီပို႔လို႔ရမွာမဟုတ္ပါဘူးခင္ဗ်။

![Window shadow](/posts/201812071/why.png){: .shadow width="500" height="500" style="max-width: 90%" }

<h3>unicode</h3>

Hello! မင်္ဂလာပါခင်ဗျ!
အရင်တပတ်က ကျနော် 802.1x lab လေးစမ်းဖြစ်ခဲ့ပါတယ်။ အဲ့ထဲကမှ ကျနော်သိခဲ့တဲ့ The IEEE 802.1x standard အကြောင်းလေး ဆွေးနွေးပြောပြချင်ပါတယ်။

 The IEEE 802.1x ဆိုတာကတော့ LANs ဒါမှမဟုတ် wireless LANs ထဲမှာရှိနေတဲ့ device အချင်းချင်း ချိတ်ဆက်အသုံးပြုရာမှာ သုံးတဲ့ authentication standard ကိုသတ်မှတ်ပေးတဲ့ "စံ" ပါ။

The IEEE 802.1x standard ကိုသိအောင်မလုပ်ခင် point-to-point protocol (PPP) နဲ့ extensible-authentication-protocol (EAP) တို့ကိုအကျဉ်းချုံးလေ့လာကြည့်မယ်ဆိုရင် PPP protocol က username နဲ့ password ကိုသုံးပီး access လုပ်တဲ့ user ကို identify လုပ်တယ်။ EAP protocol ကျတော့ password ကနေ challenge-response tokens တေ public-key infrastructure certificate တေအသုံးပြုပြီး authentication လုပ်ပါတယ်။

![Window shadow](/posts/201812071/procedure.png){: .shadow width="500" height="500" style="max-width: 90%" }

The IEEE 802.1x standard မှာကျတော့ EAP protocol ကိုသုံးပီး authentication လုပ်တယ်ပေါ့။ အဓိကအားဖြင့်အစိတ်အပိုင်းသုံးခုပေါ်အခြေခံပါတယ်။ supplicant (authenticate လုပ်မယ့် client), radius (authentication server) နဲ့ authenticator (wireless AP or network device) တေပေါ့။ သူ့ရဲ့ main concept က memory နည်းပီး load များများမလုပ်နိုင်တဲ့ Access Points တေအတွက်ရည်ရွယ်တာပါ။ အဲ့တာကြောင့် Operation load တော်တော်များများဟာ supplicant နဲ့ radius ပေါ်မှာရှိနေမှာပါ။

# Why use 802.1x?

အရင် အသုံးပြုခဲ့တဲ့ Wired Equivalent Privacy (WEP) protocol က Enterprise Network security အတွက် guarantee မပေးနိုင်တော့လို့ပါ။ 802.1x မွာက authenticator (switch) ပေါ်မှာ port level security control လုပ်လို့ရပီး 802.1x protected လုပ်ထားတဲ့ port နဲ့ join ထားတဲ့ user က authentication မအောင်မခြင်း EAP ကလွဲလို့ တခြား ဘယ် traffic ကိုမှ authenticator ဆီပို့လို့ရမှာမဟုတ်ပါဘူးခင်ဗျ။

![Window shadow](/posts/201812071/why.png){: .shadow width="500" height="500" style="max-width: 90%" }




