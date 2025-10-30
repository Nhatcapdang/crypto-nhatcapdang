import { TokenFormData } from '@/components/dashboard-layout/create-token';
import { QUERY_KEY } from '@/constants';
import { Amount, getExplorerLink } from '@/utils';
import {
  TokenStandard,
  createAndMint,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  AuthorityType,
  setAuthority,
  transferSol,
} from '@metaplex-foundation/mpl-toolbox';
import {
  PublicKey,
  RpcConfirmTransactionResult,
  TransactionSignature,
  generateSigner,
  percentAmount,
  publicKey,
  sol,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { SendTransactionError } from '@solana/web3.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useUmi } from '.';
import { PinataService } from './pinata.service';

export const FEE_RECIPIENT_WALLET =
  'CmBm1H7W9JvevNymPFqNeoarZNFejavomrnRpKcABL66'; // Replace with your actual wallet address
export const TRANSACTION_FEE = sol(0.1); // 0.1 SOL fee

export function useCreateMintWithAssociatedTokenTxMutation() {
  const { umi } = useUmi();
  const queryClient = useQueryClient();
  return useMutation<
    {
      signature: string;
      mintAddress: string;
      explorerUrl: string;
      solscanUrl: string;
    },
    SendTransactionError,
    TokenFormData
  >({
    mutationFn: async values => {
      const mintSigner = generateSigner(umi);
      const totalSupply = values.totalSupply;
      const decimals = values.decimals;
      const totalSupplyWithDecimals = Amount(totalSupply, decimals);
      const pinataService = new PinataService();
      const { metadataUri } =
        await pinataService.uploadMetadataWithSocialLinks(values);

      // Create the fee transfer instruction
      const feeTransferIx = transferSol(umi, {
        source: umi.identity,
        destination: publicKey(FEE_RECIPIENT_WALLET),
        amount: TRANSACTION_FEE,
      });

      const createFungibleIx = createAndMint(umi, {
        mint: mintSigner,
        name: values.name,
        symbol: values.symbol,
        amount: totalSupplyWithDecimals,
        // authority: values.mintAuthority ? undefined : mintSigner, // The ability to mint new tokens after creation
        // isMutable: !values.updateAuthority, // Determines if the token's metadata can be updated after creation
        // updateAuthority: values.updateAuthority ? undefined : mintSigner, // The ability to update the token's metadata after creation
        uri: metadataUri, // we use the `metadataUri` variable we created earlier that is storing our uri.
        sellerFeeBasisPoints: percentAmount(0), // this is 2.5%
        decimals, // set the amount of decimals you want your token to have.
        //  A boolean that indicates whether the asset can be updated again. When changing this to false, any future updates will fail.
        // authority NFTs can have an update authority, which allows the metadata to be updated in the future.
        tokenStandard: TokenStandard.Fungible,
      });

      let txBuilder = transactionBuilder()
        .add(feeTransferIx)
        .add(createFungibleIx);

      if (values.mintAuthority) {
        const revokeMintAuthorityIx = setAuthority(umi, {
          authorityType: AuthorityType.MintTokens,
          newAuthority: null,
          owned: mintSigner.publicKey,
          owner: umi.identity.publicKey,
        });
        txBuilder = txBuilder.add(revokeMintAuthorityIx);
      }

      if (values.freezeAuthority) {
        const revokeFreezeAuthorityIx = setAuthority(umi, {
          authorityType: AuthorityType.FreezeAccount,
          newAuthority: null,
          owned: mintSigner.publicKey,
          owner: umi.identity.publicKey,
        });
        txBuilder = txBuilder.add(revokeFreezeAuthorityIx);
      }

      const tx = await txBuilder.sendAndConfirm(umi);
      return response({
        tx,
        mint: mintSigner.publicKey,
      });
    },
    onError: error => {
      console.error(error);
      toast.error('Create Token failed', {
        duration: 15 * 1000,
        description: error.message,
      });
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.useAllDigitalAssetByOwner],
      });
      toast.success('Create Token completed successfully', {
        duration: 15 * 1000,
        description: (
          <div>
            <p>Token created successfully</p>
            <p>Token address: {data.mintAddress}</p>
            <p>Explorer URL: {data.explorerUrl}</p>
            <p>Solscan URL: {data.solscanUrl}</p>
          </div>
        ),
      });
    },
  });
}

export const response = ({
  tx,
  mint,
}: {
  tx: {
    signature: TransactionSignature;
    result: RpcConfirmTransactionResult;
  };
  mint: PublicKey;
}) => {
  // finally we can deserialize the signature that we can check on chain.
  const signature = base58.deserialize(tx.signature)[0];
  const mintAddress = mint.toString();
  const { explorerUrl, solscanUrl } = getExplorerLink({
    account: mint,
    signature,
  });
  // Log out the signature and the links to the transaction and the NFT.
  // Explorer links are for the devnet chain, you can change the clusters to mainnet.
  console.log('\nTransaction Complete');
  console.log('View Transaction on Solana Explorer');
  console.log('View Token on Solscan');
  console.log(explorerUrl, solscanUrl, mintAddress);
  return {
    signature,
    explorerUrl,
    mintAddress,
    solscanUrl,
  };
};
