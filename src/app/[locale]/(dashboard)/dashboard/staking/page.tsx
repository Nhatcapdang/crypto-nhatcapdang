import { Metadata } from 'next'
import SolanaStaking from '@/components/dashboard-layout/solana-staking'

export const metadata: Metadata = {
	title: 'Solana Staking - Dashboard',
	description: 'Stake your Solana tokens, earn rewards, and manage your staking portfolio with real-time transaction history.',
	keywords: ['solana', 'staking', 'defi', 'crypto', 'rewards', 'blockchain'],
}

export default function StakingPage() {
	return (
		<div className="min-h-screen bg-background">
			<SolanaStaking />
		</div>
	)
}