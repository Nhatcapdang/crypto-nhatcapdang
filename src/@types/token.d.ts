type TokenFormData2 = {
  name: string;
  symbol: string;
  totalSupply: number;
  decimals: number;
  description: string;
  freezeAuthority: boolean;
  mintAuthority: boolean;
  updateAuthority: boolean;
  tokenImage: File;
  website?: string | undefined;
  telegram?: string | undefined;
  twitter?: string | undefined;
  discord?: string | undefined;
};
