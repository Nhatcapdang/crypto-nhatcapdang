import { UpdateMetadataForm } from '@/components/dashboard-layout/update-metadata';
import { QUERY_KEY } from '@/constants';
import {
  updateV1,
  UpdateV1InstructionAccounts,
  UpdateV1InstructionArgs,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  AuthorityType,
  setAuthority,
  transferSol,
} from '@metaplex-foundation/mpl-toolbox';
import { publicKey, transactionBuilder } from '@metaplex-foundation/umi';
import { SendTransactionError } from '@solana/web3.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  FEE_RECIPIENT_WALLET,
  PinataService,
  response,
  TRANSACTION_FEE,
  TransactionSuccessDescription,
  useUmi,
} from '.';

export function useUpdateTokenMetadata() {
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
    UpdateMetadataForm
  >({
    mutationFn: async ({
      name,
      symbol,
      description,
      tokenImage,
      website,
      discord,
      telegram,
      twitter,
      freezeAuthority,
      mintAuthority,
      updateAuthority,
      selectedToken,
    }) => {
      if (!selectedToken) {
        throw new Error('Please select a token to update');
      }

      const pinataService = new PinataService();
      const { metadataUri } = await pinataService.uploadMetadataWithSocialLinks(
        {
          name,
          symbol,
          description,
          tokenImage,
          website,
          discord,
          telegram,
          twitter,
        },
      );
      const feeTransferIx = transferSol(umi, {
        source: umi.identity,
        destination: publicKey(FEE_RECIPIENT_WALLET),
        amount: TRANSACTION_FEE,
      });

      let txBuilder = transactionBuilder().add(feeTransferIx);

      if (
        mintAuthority &&
        selectedToken?.mint?.mintAuthority.__option === 'Some'
      ) {
        const revokeMintAuthorityIx = setAuthority(umi, {
          authorityType: AuthorityType.MintTokens,
          newAuthority: null,
          owned: selectedToken?.mint.publicKey,
          owner: umi.identity.publicKey,
        });
        txBuilder = txBuilder.add(revokeMintAuthorityIx);
      }

      if (
        freezeAuthority &&
        selectedToken?.mint?.freezeAuthority.__option === 'Some'
      ) {
        const revokeFreezeAuthorityIx = setAuthority(umi, {
          authorityType: AuthorityType.FreezeAccount,
          newAuthority: null,
          owned: selectedToken?.mint.publicKey,
          owner: umi.identity.publicKey,
        });
        txBuilder = txBuilder.add(revokeFreezeAuthorityIx);
      }

      // https://developers.metaplex.com/token-metadata/update#new-update-authority
      const params: UpdateV1InstructionAccounts & UpdateV1InstructionArgs = {
        mint: selectedToken.mint.publicKey,
        data: {
          name,
          symbol,
          uri: metadataUri,
          sellerFeeBasisPoints: selectedToken?.metadata.sellerFeeBasisPoints,
          creators: selectedToken?.metadata.creators,
        },
        primarySaleHappened: selectedToken?.metadata.primarySaleHappened,
      };

      if (updateAuthority) {
        params.isMutable = false;
        params.newUpdateAuthority = null;
      }
      const tx = await txBuilder.add(updateV1(umi, params)).sendAndConfirm(umi);

      return response({
        tx,
        mint: selectedToken?.mint.publicKey,
      });
    },
    onSuccess: ({ mintAddress, solscanUrl }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.useAllDigitalAssetByOwner],
      });
      toast('Update Token completed', {
        duration: 15 * 1000,
        description: (
          <TransactionSuccessDescription
            mintAddress={mintAddress}
            solscanUrl={solscanUrl}
          />
        ),
      });
    },
  });
}
