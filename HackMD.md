# 循環貸計算機 :smiley_cat:

###### From Murmurcats-NorthBei.CT.LL

## <u>Concept</u>

藉由存款幣種利率大於借款幣種利率的狀況下,重複多次存/借款動作來放大總年化報酬,或是看多某個幣種,預期漲幅收益會大過被收取利息,並想放大獲利

### Definition

Max LTV(Loan to Value): 最高抵押貸款比率,假設 80%,表示抵押 100 USD 等值的 ETH,最多可以借出 80 USD 的資產

Liquidation threshold: 清算門檻,假設 82.5%,表示你抵押的 ETH 下跌超過 17.5%,便會被砍倉,ETH 會被賣出償還債務,以免協議虧錢

Liquidation penalty: 清算罰款,假設 5%,當被清算時,如果想贖回抵押資產,需多付原借出金額 5％的費用

## <u>Incentive</u>

- 存款幣種利率>借款幣種利率,想放大存款的年化收益
- 看多某個幣種,想放大上漲後的獲利

## <u>Concern</u>

- 存款幣價下跌超過清算門檻
- 降低資金利用率

## <u>Example</u>

![](https://i.imgur.com/x6EkioB.png)

![](https://i.imgur.com/VpD7PrF.png)

流程: 買 CRV->存 CRV 進協議->借 USDC 出來->買 CRV...(重複)

CRV 存款利率(**Supply APY**): 20.56%
USDC 借款利率(**Borrow APY**): 2.21%
最高貸款比率(**Maximum LTV**): 80%
循環貸次數(**Lending loops**): 3
起始投入資金(**Starting Value**): 10000 USD
一次交易手續費(**transcation fee**): 10 USD

三次循環貸預估一年後收益:
10000x0.2056=2056
8000x(0.2056-0.0221)=1468
6400x(0.2056-0.0221)=1174.4
...2056+1468+1174.4=4698.4

三次循環貸預估手續費:
10x2=20(買幣+存幣)
10x3=30(借幣+買幣+存幣)
10x3=30(借幣+買幣+存幣)
...20+30+30=80

- <font color=#00800>**4698.4 U**</font>->一年後淨收益(未扣除手續費)
- 4698.4/10000=<font color=#00800>**46.98%**</font>->放大的 APY
- 46.98/20.56=<font color=#00800>**1.89**</font>->利率放大倍數
- <font color=#80000>**80 U**</font>->總鏈上操作所需手需費
- 80/((10000x46.98%)/365)=6.2~=<font color=#80000>**7 days**</font>->循環貸 3 次,需要的手續費回本天數
- 10000+8000+6400=<font color=#80000>**24400 U**</font>->需等量放空的資金(如想去掉幣價波動造成收益下降的風險)

![](https://i.imgur.com/DDBvKFy.png)

![](https://i.imgur.com/iG7caXT.png)

![](https://i.imgur.com/q2TuYIz.png)

## <u>Conclusion</u>

藉由循環貸的機制(以 3 個 loop 為例)可以把存款 APY 放大近 2 倍,但潛在風險為存款幣種下跌到清算門檻時,會需多付清算罰款才能贖回原本存款的幣,以及需準備額外一份資金去做合約對沖,減少因利息的幣價浮動而吃掉收益的可能
