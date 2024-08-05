import { buildAddress } from "./address";
import { MAINNET } from "./chain";
import { buildContractRef, ContractRef } from "./contract";
import { Currency } from "./currency";
import { charCount, ENSName } from "./ensname";
import { EthRegistrar } from "./ethregistrar";
import { buildPrice, Price } from "./price";
import {
  RegistrarCharge,
  RegistrarChargeType,
  RegistrarServiceFee,
} from "./registrar";

// example of how to modify a pricing policy to add a service fee to the base registration rate
export class NameKitRegistrar extends EthRegistrar {
  public constructor(registrarContract: ContractRef) {
    super(registrarContract);
  }

  protected getAnnualCharges(name: ENSName): RegistrarCharge[] {
    const baseCharges = super.getAnnualCharges(name);
    const subname = this.getValidatedSubname(name);
    const subnameLength = charCount(subname.name);
    let annualServiceFee: Price;
    if (subnameLength === 3 || subnameLength == 4) {
      annualServiceFee = buildPrice(999n, Currency.Usd); // $9.99 USD
    } else {
      annualServiceFee = buildPrice(99n, Currency.Usd); // $0.99 USD
    }

    const serviceFee: RegistrarServiceFee = {
      type: RegistrarChargeType.ServiceFee,
      price: annualServiceFee,
      reason: "Example NameKit convenience fee.", // TODO: update this
    };

    return [...baseCharges, serviceFee];
  }
}

// NOTE: This is an example deployment of a NameKitRegistrar contract on the Ethereum Mainnet.
// You're not supposed to use this yourself directly. You should deploy your own instance of
// this contract.
export const MAINNET_EXAMPLE_NAMEKIT_REGISTRAR_CONTRACT = buildContractRef(
  MAINNET,
  buildAddress("0x232332263e6e4bd8a134b238975e2200c8b7dac1"),
);

export const MAINNET_EXAMPLE_NAMEKIT_REGISTRAR = new NameKitRegistrar(
    MAINNET_EXAMPLE_NAMEKIT_REGISTRAR_CONTRACT
);