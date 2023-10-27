export interface tokenDetails {
  tax: string;
  name: string;
  chain: string;
  owner: string;
  symbol: string;
  address: string;
  maxBuy: string;
  totalSupply: string;
  teamAllocation: string;
  initialLiquidity: string;
}

export interface whiteListedTokenDetails extends tokenDetails {
  liquidityLocked: string;
}

export interface INetwork {
  [key: string]: {
    contract: string;
    factory: string;
    weth: string;
    router?: string;
  };
}
