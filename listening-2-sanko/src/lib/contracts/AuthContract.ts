import { ethers } from 'ethers';

export interface AuthContract extends ethers.Contract {
    authenticate: () => Promise<ethers.ContractTransaction>;
    isAuthenticated: (address: string) => Promise<boolean>;
    accessStreamingTools: () => Promise<boolean>;
}

export const AUTH_CONTRACT_ABI = [
    "function authenticate() public",
    "function isAuthenticated(address user) public view returns (bool)",
    "function accessStreamingTools() public view returns (bool)"
];

export const AUTH_CONTRACT_ADDRESS = "0xF5bF55CF8da13e9a97B04048989ada6163b2E2A1";
