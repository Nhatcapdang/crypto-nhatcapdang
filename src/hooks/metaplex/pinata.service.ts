import { TokenFormData } from '@/components/dashboard-layout/create-token';
import { PinataSDK } from 'pinata';

export class PinataService {
  private pinata: PinataSDK;

  constructor() {
    this.pinata = new PinataSDK({
      pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
      pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
    });
  }
  /**
   * Upload a file buffer to json via Pinata
   */
  async uploadFile(values: TokenFormData): Promise<{
    metadataUri: string;
  }> {
    const { name, symbol, description, tokenImage } = values;
    // https://gateway.pinata.cloud/ipfs/
    // https://ipfs.io/ipfs/
    const uploadFile = await this.pinata.upload.public.file(tokenImage);
    const uploadJson = await this.pinata.upload.public
      .json({
        name,
        symbol,
        description,
        image: `https://gateway.pinata.cloud/ipfs/${uploadFile.cid}`,
      })
      .name(`${name}.json`);
    return {
      metadataUri: `https://gateway.pinata.cloud/ipfs/${uploadJson.cid}`,
    };
  }

  /**
   * Upload metadata JSON with social links to IPFS via Pinata
   * Following Solana Token Metadata Standard for better platform compatibility
   */
  async uploadMetadataWithSocialLinks({
    name,
    symbol,
    description,
    tokenImage,
    website,
    telegram,
    twitter,
    discord,
  }: Omit<
    TokenFormData,
    | 'totalSupply'
    | 'decimals'
    | 'freezeAuthority'
    | 'mintAuthority'
    | 'updateAuthority'
  >): Promise<{
    metadataUri: string;
    cid: string;
  }> {
    let imageUri = '';
    if (tokenImage) {
      const uploadFile = await this.pinata.upload.public.file(tokenImage);
      imageUri = await this.pinata.gateways.public.convert(uploadFile.cid);
    }
    // Create metadata following Solana Token Metadata Standard
    // Reference: https://docs.metaplex.com/programs/token-metadata/token-standard
    const metadata = {
      name,
      symbol,
      description,
      image: imageUri, // Token image/logo
      external_url: website || twitter, // Primary website/homepage
      website,
      twitter,
      telegram,
      discord,
      // showName: true,
      // extensions: {
      //   website,
      //   twitter,
      //   telegram,
      //   discord: discordLink,
      // },
    };

    // Upload to IPFS via Pinata
    const uploadJson = await this.pinata.upload.public
      .json(metadata)
      .name(`${name}-${symbol}.json`);

    const metadataUri = await this.pinata.gateways.public.convert(
      uploadJson.cid,
    );
    return {
      metadataUri,
      cid: uploadJson.cid,
    };
  }

  async updateFile(
    id: string,
    name: string,
    keyvalues: Record<string, string>,
  ) {
    const x = await this.pinata.upload.public
      .cid('bafkreiaq2nmcprm3vo375uj6zc2grco52r75n4rl7u3y2p2fi6v4zkywnq')
      .keyvalues({
        name: 'test',
        symbol: 'test',
        description: 'test',
        image: 'test',
      });
    console.log('x', x, id, name, keyvalues);
    const uploadFile = await this.pinata.files.public.update({
      id: 'bafkreiaq2nmcprm3vo375uj6zc2grco52r75n4rl7u3y2p2fi6v4zkywnq',
      name: 'test',
      keyvalues: {
        name: 'test',
        symbol: 'test',
        description: 'test',
        image: 'test',
      },
    });
    console.log('uploadFile', uploadFile);
    return {
      metadataUri: `${this.pinata.config?.pinataGateway}/${uploadFile.cid}`,
      cid: uploadFile.cid,
    };
  }
}
