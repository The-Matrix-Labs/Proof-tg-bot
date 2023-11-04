export interface ITokenDetails {
  CA: string;
  tax: string;
  token: string;
  chain: string;
  owner: string;
  maxBuy: string;
  message?: string;
  totalSupply: string;
  teamAllocation: string;
  initialLiquidity: string;
  liquidityLocked?: string;
}

export interface IWhiteListedTokenDetails extends ITokenDetails {
  whiteListDuration: string;
  currentWhiteListed: string;
}

export interface INetwork {
  [key: string]: {
    contract: string;
    factory: string;
    weth: string;
    router?: string;
  };
}

export interface ITokenLaunchInfo {
  Tax: string;
  Token: string;
  message?: string;
  WhitelistDuration: string;
  CurrentlyWhitelisted: string;
}
