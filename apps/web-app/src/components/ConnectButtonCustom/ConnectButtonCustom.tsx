import { ConnectButton } from "@rainbow-me/rainbowkit";
import IconWallet from "@/assets/icons/IconWallet";
import { FC } from "react";

const ConnectButtonCustom: FC<{
  isAlwaysShow?: boolean;
}> = ({ isAlwaysShow }) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="block w-full h-full"
                  >
                    {!isAlwaysShow && (
                      <div>
                        <div className="hidden md:block bg-[#09090B] transition-colors duration-200 hover:bg-[#5569ff] px-4 py-2 rounded-full text-white">
                          Connect Wallet
                        </div>
                        <div className="block md:hidden">
                          <IconWallet />
                        </div>
                      </div>
                    )}
                    {isAlwaysShow && (
                      <div className="block bg-[#09090B] transition-colors duration-200 hover:bg-[#5569ff] px-4 py-2 rounded-full text-white">
                        Connect Wallet
                      </div>
                    )}
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectButtonCustom;
