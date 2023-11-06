import { ITokenDetails, ITokenLaunchInfo } from "../interfaces/interface";

export function tokenDetailsTemplate<T extends ITokenDetails>(
  data: T,
  isWhitelist?: boolean
) {
  let template = `
<b>${data.message ? data.message : ""}</b>


<b>Chain:</b> ${data.chain}

<b>Token:</b> ${data.token}

<b>CA:</b> <code>${data.CA}</code>

<b>Owner:</b> <code>${data.owner}</code>

<b>Tax:</b> ${data.tax}

<b>Total supply:</b> ${data.totalSupply}

<b>Max buy:</b> ${data.maxBuy}

<b>Team allocation:</b> ${data.teamAllocation}

<b>Initial liquidity:</b> ${data.initialLiquidity}
`;

  if (data.liquidityLocked) {
    template += `\n<b>Liquidity locked:</b> ${data.liquidityLocked}\n`;
  }

  if (isWhitelist && "whiteListDuration" in data) {
    template += `\n<b>Whitelist duration:</b> ${data.whiteListDuration}\n`;
  }

  if (isWhitelist && "currentWhiteListed" in data) {
    template += `\n<b>Currently whitelisted:</b> ${data.currentWhiteListed}\n`;
  }

  template += "\n\n";

  template += data.links
    .map((link) => `<b><a href="${link.url}">${link.title}</a></b>`)
    .join(" | ");

  template += "\n";

  if ("isTokenCreated" in data && data.isTokenCreated) {
    template += `\n(We will notify you as soon as this token is launched and available to buy.)`;
  }
  return template;
}

export function launchTokenTemplate(data: ITokenLaunchInfo) {
  let template = `

<b>${data.message ? data.message : ""}</b>


<b>Token:</b> ${data.token}

<b>Tax:</b> ${data.tax}

<b>Whitelist duration:</b> ${data.whiteListDuration}

<b>Currently whitelisted:</b> ${data.currentWhiteListed}
`;

  template += "\n\n";

  template += data.links
    .map((link) => `<b><a href="${link.url}">${link.title}</a></b>`)
    .join(" | ");

  template += "\n";

  template += `\n🎟️ As a PROOF Pass holder, the wallet address that holds your NFT is automatically whitelisted.`;

  return template;
}
