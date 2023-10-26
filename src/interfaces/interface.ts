export interface tokenDetails {
  tax: string;
  name: string;
  chain: string;
  owner: string;
  symbol: string;
  address: string;
  maxBuy: string;
  totalSupply: string;
  initialLiquidity: string;
}

export interface whiteListedTokenDetails extends tokenDetails {
  liquidityLocked: string;
}
