import { ITokenDetails, ITokenLaunchInfo } from "../interfaces/interface";

export function tokenDetailsTemplate<T extends ITokenDetails>(
  data: T,
  isWhitelist?: boolean
) {
  let template = `
<b>${data.message ? data.message : ""}</b>

<b>Chain:</b> ${data.chain}&#8201
<b>Token:</b> ${data.token}&#8201
<b>CA:</b> <code>${data.CA}</code>&#8201
<b>Owner:</b> <code>${data.owner}</code>&#8201
<b>Tax:</b> ${data.tax}&#8201
<b>Total supply:</b> ${data.totalSupply}&#8201
<b>Max buy:</b> ${data.maxBuy}&#8201
<b>Team allocation:</b> ${data.teamAllocation}&#8201
<b>Initial liquidity:</b> ${data.initialLiquidity}&#8201`;

  if (data.liquidityLocked) {
    template += `\n<b>Liquidity locked:</b> ${data.liquidityLocked}&#8201`;
  }

  if (isWhitelist && "whiteListDuration" in data) {
    template += `\n<b>Whitelist duration:</b> ${data.whiteListDuration}&#8201`;
  }

  if (isWhitelist && "currentWhiteListed" in data) {
    template += `\n<b>Currently whitelisted:</b> ${data.currentWhiteListed}&#8201`;
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

<b>Chain:</b> ${data.chain}&#8201
<b>Token:</b> ${data.token}&#8201
<b>Tax:</b> ${data.tax}&#8201
<b>Whitelist duration:</b> ${data.whiteListDuration}&#8201
<b>Currently whitelisted:</b> ${data.currentWhiteListed}&#8201`;

  template += "\n\n";

  template += data.links
    .map((link) => `<b><a href="${link.url}">${link.title}</a></b>`)
    .join(" | ");

  template += "\n";

  template += `\n🎟️ As a PROOF Pass holder, the wallet address that holds your NFT is automatically whitelisted.`;

  return template;
}
