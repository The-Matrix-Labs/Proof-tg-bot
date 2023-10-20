query MyQuery {
  ethereum(network: bsc_testnet) {
    smartContractEvents(
      smartContractAddress: {is: "0x88d119E11AAe9074B73dAd4894C1Ec588A38Da93"}
      smartContractEvent: {is: "TokenAddress"}
    ) {
      smartContractEvent {
        name
        signature
      }
      arguments {
        value
        argument
      }
    }
  }
}
# proof-tg-bot
