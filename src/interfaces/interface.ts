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
  isTokenCreated?: boolean;
  initialLiquidity: string;
  liquidityLocked?: string;
  links: ILink[];
}

export interface ILink {
  title: string;
  url: string;
}

export interface IWhiteListedTokenDetails extends ITokenDetails {
  whiteListDuration: string;
  currentWhiteListed: string;
}

export interface ITokenLaunchInfo {
  tax: string;
  token: string;
  message?: string;
  links: ILink[];
  whiteListDuration: string;
  currentWhiteListed: string;
}
