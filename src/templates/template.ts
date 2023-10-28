import {
  ITokenDetails,
  IWhiteListedTokenDetails,
} from "../interfaces/interface";

export function tokenDetailsTemplate(
  data: ITokenDetails | IWhiteListedTokenDetails,
  isWhilteList?: boolean
): string {
  return `
  🔗 <b>Chain:</b> ${data.chain}
  
  🔹 <b>Token:</b> ${data.token}

  🔹 <b>Contract Address:</b> <code>${data.CA}</code>

  🔹 <b>Owner:</b> <code>${data.owner}</code>

  🔹 <b>Tax:</b> ${data.tax}

  🔹 <b>Total Supply:</b> ${data.totalSupply}

  🔹 <b>Max Buy:</b> ${data.maxBuy}

  🔹 <b>Team Allocation:</b> ${data.teamAllocation}

  🔹 <b>Initial Liquidity:</b> ${data.initialLiquidity}

  ${
    data.liquidityLocked !== ""
      ? `🔹 <b>Liquidity locked:</b> ${data.liquidityLocked}`
      : ""
  }

  ${
    isWhilteList && "whiteListDuration" in data
      ? `🔹 <b>WhiteList Duration:</b> ${
          (data as IWhiteListedTokenDetails).whiteListDuration
        }`
      : ""
  }

  ${
    isWhilteList && "currentWhiteListed" in data
      ? `🔹 <b>Currently whitelisted:</b> ${
          (data as IWhiteListedTokenDetails).currentWhiteListed
        }`
      : ""
  }
  
  `;
}
