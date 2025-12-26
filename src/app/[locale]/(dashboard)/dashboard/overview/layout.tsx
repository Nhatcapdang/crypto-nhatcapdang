export default function OverviewLayout({
  children,
  pool,
  'create-liquidity': createLiquidity,
}: {
  children: React.ReactNode;
  pool: React.ReactNode;
  'create-liquidity': React.ReactNode;
}) {
  return (
    <>
      {pool}
      {createLiquidity}
      {children}
    </>
  );
}
