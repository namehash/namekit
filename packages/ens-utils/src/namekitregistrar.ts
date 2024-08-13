import { buildAddress } from "./address";
import { ChainId, MAINNET } from "./chain";
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

/**
 * Example of how to customize a pricing policy that adds a registrar service
 * fee to the "base" .eth registration rate.
 */
export class NameKitRegistrar extends EthRegistrar {

  /**
   * Currently the NameKitRegistrar contract always uses NameWrapper.
   */
  protected static readonly USES_NAMEWRAPPER: boolean = true;

  /**
   * Each `NameKitRegistrar` is implemented as a wrapper around this official
   * .eth registrar.
   */
  protected readonly wrappingRegistrar: ContractRef;

  /**
   * Builds a new `NameKitRegistrar` instance using the provided configuration.
   *
   * @param chain The chain to use for the `NameKitRegistrar`.
   * @param nameKitRegistrarDeployment Your deployment of the NameKit registrar
   *                                   contract on the provided `chain`.
   * @throws `Error` if the provided configuration is not supported.
   */
  public constructor(chain: ChainId, nameKitRegistrarDeployment: ContractRef) {
    super(chain, NameKitRegistrar.USES_NAMEWRAPPER);
    this.wrappingRegistrar = nameKitRegistrarDeployment;

    if (chain.chainId !== nameKitRegistrarDeployment.chain.chainId) {
      throw new Error(
        `ChainId mismatch: ${chain.chainId} !== ${nameKitRegistrarDeployment.chain.chainId}`,
      );
    }
  }

  public getContractRef(): ContractRef {
    return this.wrappingRegistrar;
  }

  /**
   * @returns the `ContractRef` for the .eth registrar wrapped by this
   *          `NameKitRegistrar` that executes the actual registration of .eth
   *          subdomains.
   */
  public getWrappedRegistrar(): ContractRef {
    return super.getContractRef();
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
      reason: "Example NameKitRegistrar service fee.",
    };

    return [...baseCharges, serviceFee];
  }
}

const MAINNET_EXAMPLE_NAMEKIT_REGISTRAR_CONTRACT = buildContractRef(
  MAINNET,
  buildAddress("0x232332263e6e4bd8a134b238975e2200c8b7dac1"),
);

/**
 * NOTE: This is an example deployment of a NameKitRegistrar contract on the
 * Ethereum Mainnet. You're not supposed to use this yourself directly. You
 * should deploy your own instance of this contract so that it will be
 * possible to withdraw any collected funds into your own treasury.
 */
export const MAINNET_EXAMPLE_NAMEKIT_REGISTRAR = new NameKitRegistrar(
  MAINNET,
  MAINNET_EXAMPLE_NAMEKIT_REGISTRAR_CONTRACT,
);
