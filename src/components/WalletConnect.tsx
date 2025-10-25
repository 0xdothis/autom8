import React from 'react';

interface WalletConnectProps extends React.HTMLAttributes<HTMLDivElement> {
  // keep flexible props (className etc.)
}

export default function WalletConnect({ className, ...props }: WalletConnectProps) {
  return (
    <div className={className} {...props}>
      {/* Simple placeholder button for wallet connect. Replace with RainbowKit or your wallet UI when available. */}
      <button
        type="button"
        className="btn-primary px-6 py-3 rounded-md"
        onClick={() => {
          // noop or trigger wallet connect flow if implemented elsewhere
          // eslint-disable-next-line no-alert
          alert('Open wallet connect UI (placeholder)');
        }}
      >
        Connect Wallet
      </button>
    </div>
  );
}
