// Validate Type
function validateType(key: string, value: any, type: string) {
  if (typeof value !== type) {
    throw new Error(
      `Invalid type for ${key}. Expected ${type} but got ${typeof value}`
    );
  }
}

// * validation for links
function validateLinks(links: any) {
  if (!Array.isArray(links)) {
    throw new Error(
      "Invalid type for links. Expected array but got " + typeof links
    );
  }

  links.forEach((link: any, index: number) => {
    if (typeof link !== "object") {
      throw new Error(
        `Invalid type for link at index ${index}: expected object`
      );
    }

    validateType("link.title", link.title, "string");
    validateType("link.url", link.url, "string");
  });
}

// * validation for tokenDetails
export function validateTokenDetails(data: any) {
  validateType("CA", data.CA, "string");
  validateType("tax", data.tax, "string");
  validateType("token", data.token, "string");
  validateType("chain", data.chain, "string");
  validateType("owner", data.owner, "string");
  validateType("maxBuy", data.maxBuy, "string");
  validateType("totalSupply", data.totalSupply, "string");
  validateType("teamAllocation", data.teamAllocation, "string");
  validateType("initialLiquidity", data.initialLiquidity, "string");

  if (data.isTokenCreated) {
    validateType("isTokenCreated", data.isTokenCreated, "boolean");
  }

  if (data.message) {
    validateType("message", data.message, "string");
  }

  if (data.liquidityLocked) {
    validateType("liquidityLocked", data.liquidityLocked, "string");
  }

  validateLinks(data.links);

  return true;
}

// * validation for whiteListTokenDetails
export function validateWhiteListTokenDetails(data: any) {
  validateTokenDetails(data);

  validateType("whiteListDuration", data.whiteListDuration, "string");
  validateType("currentWhiteListed", data.currentWhiteListed, "string");

  return true;
}

// * validation for launchWhiteListTokenDetails
export function validateLaunchWhiteListTokenDetails(data: any) {
  validateType("tax", data.tax, "string");
  validateType("token", data.token, "string");
  validateType("whiteListDuration", data.whiteListDuration, "string");
  validateType("currentWhiteListed", data.currentWhiteListed, "string");
  validateLinks(data.links);

  if (data.message) {
    validateType("message", data.message, "string");
  }

  return true;
}
