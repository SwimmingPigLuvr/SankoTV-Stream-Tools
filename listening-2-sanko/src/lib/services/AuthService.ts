import { ethers } from 'ethers';
import { AUTH_CONTRACT_ABI, AUTH_CONTRACT_ADDRESS } from '$lib/contracts/AuthContract';
import type { AuthContract } from '$lib/contracts/AuthContract';

export class AuthService {
  private contract: AuthContract;

  constructor(signer: ethers.Signer) {
    this.contract = new ethers.Contract(AUTH_CONTRACT_ADDRESS, AUTH_CONTRACT_ABI, signer) as AuthContract;
  }

  async authenticate() {
    try {
      const tx = await this.contract.authenticate();
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Authentication failed:", error);
      return false;
    }
  }

  async isAuthenticated(address: string): Promise<boolean> {
    return await this.contract.isAuthenticated(address);
  }
}
