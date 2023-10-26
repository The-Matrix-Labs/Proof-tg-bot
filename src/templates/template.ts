import { tokenDetails } from "../interfaces/interface";

export const tokenDetailsTemplate = (data: tokenDetails) => {
  return `
  🔗 <b>Chain:</b> ${data.chain}
  
  🔹 <b>Token:</b> ${data.name} ${data.symbol}

  🔹 <b>Contract Address:</b> <code>${data.address}</code>

  🔹 <b>Owner:</b> <code>${data.owner}</code>

  🔹 <b>Tax:</b> ${data.tax}

  🔹 <b>Total Supply:</b> ${data.totalSupply}

  🔹 <b>Max Buy:</b> ${data.maxBuy}

  🔹 <b>Team Allocation:</b> 5% (caution: team can sell this, unless they lock it)

  🔹 <b>Initial Liquidity:</b> ${data.initialLiquidity} ${data.chain}
  
  `;
};
