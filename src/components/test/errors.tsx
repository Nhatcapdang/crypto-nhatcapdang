import {
  isWalletStandardError,
  WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_CHAIN_UNSUPPORTED,
  WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_FEATURE_UNIMPLEMENTED,
  WALLET_STANDARD_ERROR__FEATURES__WALLET_FEATURE_UNIMPLEMENTED,
} from '@wallet-standard/core';
import React from 'react';

export const NO_ERROR = Symbol();

export function getErrorMessage(
  err: unknown,
  fallbackMessage: React.ReactNode,
): React.ReactNode {
  if (
    isWalletStandardError(
      err,
      WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_FEATURE_UNIMPLEMENTED,
    )
  ) {
    return (
      <>
        This account does not support the{' '}
        <span className="font-mono">{err.context.featureName}</span> feature
      </>
    );
  } else if (
    isWalletStandardError(
      err,
      WALLET_STANDARD_ERROR__FEATURES__WALLET_FEATURE_UNIMPLEMENTED,
    )
  ) {
    return (
      <div className="flex flex-col gap-4">
        <p>
          The wallet &apos;{err.context.walletName}&apos; (
          {err.context.supportedChains.sort().map((chain, ii, { length }) => (
            <React.Fragment key={chain}>
              <span className="font-mono">{chain}</span>
              {ii === length - 1 ? null : ', '}
            </React.Fragment>
          ))}
          ) does not support the{' '}
          <span className="font-mono">{err.context.featureName}</span> feature.
        </p>
        <p>
          Features supported:
          <ul>
            {err.context.supportedFeatures.sort().map(featureName => (
              <li key={featureName}>
                <span className="font-mono">{featureName}</span>
              </li>
            ))}
          </ul>
        </p>
      </div>
    );
  } else if (
    isWalletStandardError(
      err,
      WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_CHAIN_UNSUPPORTED,
    )
  ) {
    return (
      <div className="flex flex-col gap-4">
        <p>
          This account does not support the chain{' '}
          <span className="font-mono">{err.context.chain}</span>.
        </p>
        <p>
          Chains supported:
          <ul>
            {err.context.supportedChains.sort().map(chain => (
              <li key={chain}>
                <span className="font-mono">{chain}</span>
              </li>
            ))}
          </ul>
        </p>
      </div>
    );
  } else if (err && typeof err === 'object' && 'message' in err) {
    return String(err.message);
  }
  return fallbackMessage;
}
