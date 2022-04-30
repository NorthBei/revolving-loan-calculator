let SA=prompt("Supply APY");
let BA=prompt("Borrow APY");
let LTV=prompt("LTV");
let loop=prompt("Loop");
let SV=parseInt(prompt("SV"));
x=SV*SA;
for(y=1;y<=loop;y++){
    x=x+SV*LTV**(y)*(SA-BA); 
}

x=x/(SV*SA);

alert("Total APY="+SA*x*100+"%");

x1=SV;
for(y1=1;y1<=loop;y1++){
    x1=x1+SV*LTV**(y1);
}

alert("Ｎeed short amount="+x1+"USDT");