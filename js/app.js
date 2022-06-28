const form = document.getElementById("calculator-form");
const inputs = Array.from(form.querySelectorAll('.form-control'));

document.getElementById("submitBtn").addEventListener("click", submit);

const typeValidationMap  = new Map([
  ['2decimal-number', (value) => new RegExp(/^[0-9]*(\.[0-9]{0,2})?$/).test(value)],
  ['number', (value) => new RegExp(/^[+]?\d+$/gm).test(value)]
]);

function submit(event) {
  const isValid = checkDataValidation(event);
  if (isValid) calcRevolvingLoan();
}

function checkDataValidation(event) {
  let isValid = true;

  if (!form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }

  inputs.forEach((input) => {
    const type = input.getAttribute('data-type');
    const validFn = typeValidationMap.get(type);
    if (validFn) {
      if (!validFn(input.value)) {
        input.classList.add('is-invalid');
        isValid = false;
      } else {
        input.classList.remove('is-invalid');
      }
    }
  });
  
  return isValid;
}

function calcRevolvingLoan() {
  // 每次計算前，先清掉舊的計算記錄
  document.getElementsByClassName('calcDetailContent')[0].innerHTML = '';
  // 存幣的年化收益(Supply APY)
  const supplyAPY = document.getElementById("supply-token-apy").value / 100;
  // 借幣的年化利息(borrow APY)
  const borrowAPY = document.getElementById("borrow-token-apy").value / 100;
  // 最高貸款比率(Maximum LTV)
  const maxLTV = document.getElementById("max-ltv").value / 100;
  // 起始資金(Starting Value)
  const startValue = parseInt(document.getElementById("starting-value").value);
  // 循環借貸次數(Lending Loops)
  const loopNums = document.getElementById("lending-loops").value;
  // 每次交易的手續費
  const FeePerTraction = document.getElementById("fee-per-traction").value;

  // 每次拿多少部位去押
  let theRoundValue = 0;
  // 每次貸款取得的利息
  let yieldValue = 0;
  // 循環貸後，全部的利息
  let totalYieldValue = 0;
  // 循環貸後，全部的費用 ( 借幣利息 + 手續費 )
  let totalCost = 0;
  // 循環貸後的APY
  let totalAPY = 0;
  // 循環貸後的部位
  let totalValue = 0;
  //
  let supplyEarning = 0
  //
  let brrowEarning = 0;

  for (let y = 0; y < loopNums; y++) {
    let theRoundSupplyEarning = 0;
    let theRoundBrrowEarning = 0;
    theRoundValue = startValue * maxLTV ** (y);
    totalValue += theRoundValue;
    if (y === 0) {
      // 一開始本金是自己的，不是借的，所以不用支付借款利息
      yieldValue = theRoundValue * supplyAPY;
      theRoundSupplyEarning = theRoundValue * supplyAPY;
      totalCost += parseFloat(FeePerTraction * 2);
    } else {
      theRoundSupplyEarning = theRoundValue * supplyAPY;
      theRoundBrrowEarning = theRoundValue * borrowAPY;
      yieldValue = theRoundValue * (supplyAPY - borrowAPY);
      totalCost += parseFloat(FeePerTraction * 3);
    }

    supplyEarning += theRoundSupplyEarning;
    brrowEarning += theRoundBrrowEarning;

    totalYieldValue = totalYieldValue + yieldValue;
    // console.log(`第 ${y} 輪, 拿 ${theRoundValue.toFixed(2)} 去押, 得到的利息為： ${yieldValue.toFixed(2)} , 目前總部位為： ${totalValue.toFixed(2)}, 總利息為：${totalYieldValue.toFixed(2)}`);

    const tbodyRef = document.getElementsByClassName("calcDetailContent")[0];
    let newTr = document.createElement("tr");
    let newTh = document.createElement("th");
    let newTd1 = document.createElement("td");
    let newTd2 = document.createElement("td");
    let newTd3 = document.createElement("td");
    let newTd4 = document.createElement("td");
    let newTd5 = document.createElement("td");
    let newTd6 = document.createElement("td");
    let newTd7 = document.createElement("td");
    let newTd8 = document.createElement("td");

    newTh.innerHTML = `第 ${y + 1} 輪`;
    newTr.appendChild(newTh);
    newTd1.innerHTML = `拿 ${theRoundValue.toFixed(2)} 去押`;
    newTr.appendChild(newTd1);
    newTd2.innerHTML = `得到的利息為： ${yieldValue.toFixed(2)}`;
    newTr.appendChild(newTd2);
    newTd3.innerHTML = `目前總部位為： ${totalValue.toFixed(2)}`;
    newTr.appendChild(newTd3);
    newTd4.innerHTML = `總利息為：${totalYieldValue.toFixed(2)}`;
    newTr.appendChild(newTd4);
    newTd5.innerHTML = `${Math.round((yieldValue / startValue) * 1000) / 10} %`;
    newTr.appendChild(newTd5);
    newTd6.innerHTML = `${Math.round((totalYieldValue / startValue) * 1000) / 10} %`;
    newTr.appendChild(newTd6);

    if( y === 0){
      newTd7.innerHTML = `$${FeePerTraction * 2 }`;
    }else{
      newTd7.innerHTML = `$${FeePerTraction * 3 }`;
    }
    newTr.appendChild(newTd7);

    // 計算每輪的回本天數
    let costBackDay = Math.ceil(totalCost/ totalYieldValue * 365);
    // console.log(`第 ${y} 輪,  總利息為：${totalYieldValue.toFixed(2)}, 總手續費為：${totalCost}`);
    newTd8.innerHTML = `至少放 ${costBackDay} 天才能回本`;
    newTr.appendChild(newTd8);

    tbodyRef.appendChild(newTr);
    
    // 風險提示 - 清算幣價計算
    const supplyTokenPrice = parseFloat( document.getElementById("supply-token").value );
    const liquidationThreshold = parseFloat( document.getElementById("liquidation-threshold").value );
    if( supplyTokenPrice && liquidationThreshold)
    document.getElementById("danger-notice").innerHTML = `風險提示：當存幣的幣價跌至<span class='text-danger'> ${supplyTokenPrice*liquidationThreshold/100}</span> 時，會發生清算！`;
  }
  totalAPY = supplyAPY * totalYieldValue / (startValue * supplyAPY) * 100;

  document.getElementById("overallInterestValue").textContent = totalAPY.toFixed(2) + '%';
  document.getElementById("supplyEarningsValue").textContent = '$' + supplyEarning.toFixed(2);
  document.getElementById("borrowEarningsValue").textContent = '-$' + brrowEarning.toFixed(2);
  document.getElementById("netEarningsValue").textContent = '$' + totalYieldValue.toFixed(2);
  document.getElementById("totalValue").textContent = '$' + totalValue.toFixed(2);
}