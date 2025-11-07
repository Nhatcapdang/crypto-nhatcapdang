'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

// Types for Solana staking
interface StakingStats {
	totalStakedInPool: number
	yourStaked: number
	pendingReward: number
	totalEarn: number
	tokenBalance: number
	solBalance: number
}

interface Transaction {
	id: string
	type: 'stake' | 'unstake' | 'claim' | 'initialize' | 'add_reward'
	amount: number
	timestamp: Date
	signature: string
	status: 'success' | 'pending' | 'failed'
}

// Mock data for demonstration
const mockStats: StakingStats = {
	totalStakedInPool: 1250000,
	yourStaked: 5000,
	pendingReward: 125.50,
	totalEarn: 1850.75,
	tokenBalance: 10000,
	solBalance: 2.5
}

const mockTransactions: Transaction[] = [
	{
		id: '1',
		type: 'stake',
		amount: 1000,
		timestamp: new Date('2024-11-07T10:30:00'),
		signature: '3Kx7...9Yz2',
		status: 'success'
	},
	{
		id: '2',
		type: 'claim',
		amount: 25.50,
		timestamp: new Date('2024-11-06T15:45:00'),
		signature: '7Qm4...2Bx8',
		status: 'success'
	},
	{
		id: '3',
		type: 'unstake',
		amount: 500,
		timestamp: new Date('2024-11-05T09:15:00'),
		signature: '9Pn1...5Kw7',
		status: 'pending'
	},
	{
		id: '4',
		type: 'add_reward',
		amount: 100,
		timestamp: new Date('2024-11-04T14:20:00'),
		signature: '2Hj8...3Vt9',
		status: 'success'
	},
	{
		id: '5',
		type: 'initialize',
		amount: 0,
		timestamp: new Date('2024-11-03T11:00:00'),
		signature: '6Rl3...8Nm4',
		status: 'success'
	}
]

function StakingStatsCard({ stats }: { stats: StakingStats }) {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-xl font-bold text-center">Staking Overview</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
						<p className="text-sm text-muted-foreground">Total Staked in Pool</p>
						<p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
							{stats.totalStakedInPool.toLocaleString()}
						</p>
					</div>
					
					<div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
						<p className="text-sm text-muted-foreground">Your Staked</p>
						<p className="text-2xl font-bold text-green-600 dark:text-green-400">
							{stats.yourStaked.toLocaleString()}
						</p>
					</div>
					
					<div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg">
						<p className="text-sm text-muted-foreground">Pending Reward</p>
						<p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
							{stats.pendingReward.toFixed(2)}
						</p>
					</div>
					
					<div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
						<p className="text-sm text-muted-foreground">Total Earned</p>
						<p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
							{stats.totalEarn.toFixed(2)}
						</p>
					</div>
					
					<div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 rounded-lg">
						<p className="text-sm text-muted-foreground">Token Balance</p>
						<p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
							{stats.tokenBalance.toLocaleString()}
						</p>
					</div>
					
					<div className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-4 rounded-lg">
						<p className="text-sm text-muted-foreground">SOL Balance</p>
						<p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
							{stats.solBalance.toFixed(2)}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

function StakingActions() {
	const [stakeAmount, setStakeAmount] = useState('')
	const [unstakeAmount, setUnstakeAmount] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleStake = useCallback(async () => {
		if (!stakeAmount) return
		setIsLoading(true)
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 2000))
		setIsLoading(false)
		setStakeAmount('')
		// Add success notification here
	}, [stakeAmount])

	const handleUnstake = useCallback(async () => {
		if (!unstakeAmount) return
		setIsLoading(true)
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 2000))
		setIsLoading(false)
		setUnstakeAmount('')
		// Add success notification here
	}, [unstakeAmount])

	const handleClaimReward = useCallback(async () => {
		setIsLoading(true)
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 2000))
		setIsLoading(false)
		// Add success notification here
	}, [])

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-xl font-bold text-center">Staking Actions</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Stake Token */}
					<div className="space-y-3">
						<h3 className="font-semibold text-lg">Stake Token</h3>
						<div className="flex gap-2">
							<Input
								type="number"
								placeholder="Amount to stake"
								value={stakeAmount}
								onChange={(e) => setStakeAmount(e.target.value)}
								className="flex-1"
							/>
							<Button 
								onClick={handleStake} 
								disabled={!stakeAmount || isLoading}
								className="bg-green-600 hover:bg-green-700"
							>
								{isLoading ? 'Staking...' : 'Stake'}
							</Button>
						</div>
					</div>

					{/* Unstake Token */}
					<div className="space-y-3">
						<h3 className="font-semibold text-lg">Unstake Token</h3>
						<div className="flex gap-2">
							<Input
								type="number"
								placeholder="Amount to unstake"
								value={unstakeAmount}
								onChange={(e) => setUnstakeAmount(e.target.value)}
								className="flex-1"
							/>
							<Button 
								onClick={handleUnstake} 
								disabled={!unstakeAmount || isLoading}
								variant="destructive"
							>
								{isLoading ? 'Unstaking...' : 'Unstake'}
							</Button>
						</div>
					</div>
				</div>

				<Separator />

				{/* Claim Reward */}
				<div className="text-center space-y-3">
					<h3 className="font-semibold text-lg">Claim Rewards</h3>
					<Button 
						onClick={handleClaimReward} 
						disabled={isLoading}
						size="lg"
						className="bg-yellow-600 hover:bg-yellow-700 text-white"
					>
						{isLoading ? 'Claiming...' : 'Claim Reward'}
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
	const getTransactionTypeColor = (type: Transaction['type']) => {
		switch (type) {
			case 'stake': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
			case 'unstake': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
			case 'claim': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
			case 'initialize': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
			case 'add_reward': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
			default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
		}
	}

	const getStatusColor = (status: Transaction['status']) => {
		switch (status) {
			case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
			case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
			case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
			default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
		}
	}

	const filterTransactions = (type?: Transaction['type']) => {
		if (!type) return transactions
		return transactions.filter(tx => tx.type === type)
	}

	const TransactionList = ({ filteredTransactions }: { filteredTransactions: Transaction[] }) => (
		<div className="space-y-3">
			{filteredTransactions.length === 0 ? (
				<div className="text-center py-8 text-muted-foreground">
					No transactions found
				</div>
			) : (
				filteredTransactions.map((tx) => (
					<div key={tx.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Badge className={getTransactionTypeColor(tx.type)}>
									{tx.type.replace('_', ' ').toUpperCase()}
								</Badge>
								<div>
									<p className="font-medium">
										{tx.amount > 0 ? `${tx.amount.toLocaleString()} tokens` : 'Pool initialization'}
									</p>
									<p className="text-sm text-muted-foreground">
										{tx.timestamp.toLocaleDateString()} {tx.timestamp.toLocaleTimeString()}
									</p>
								</div>
							</div>
							<div className="text-right space-y-1">
								<Badge className={getStatusColor(tx.status)}>
									{tx.status.toUpperCase()}
								</Badge>
								<p className="text-xs text-muted-foreground font-mono">
									{tx.signature}
								</p>
							</div>
						</div>
					</div>
				))
			)}
		</div>
	)

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-xl font-bold text-center">Transaction History</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="all" className="w-full">
					<TabsList className="grid w-full grid-cols-6">
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="stake">Stake</TabsTrigger>
						<TabsTrigger value="unstake">Unstake</TabsTrigger>
						<TabsTrigger value="claim">Claim</TabsTrigger>
						<TabsTrigger value="initialize">Initialize</TabsTrigger>
						<TabsTrigger value="add_reward">Add Reward</TabsTrigger>
					</TabsList>
					
					<TabsContent value="all" className="mt-4">
						<TransactionList filteredTransactions={filterTransactions()} />
					</TabsContent>
					
					<TabsContent value="stake" className="mt-4">
						<TransactionList filteredTransactions={filterTransactions('stake')} />
					</TabsContent>
					
					<TabsContent value="unstake" className="mt-4">
						<TransactionList filteredTransactions={filterTransactions('unstake')} />
					</TabsContent>
					
					<TabsContent value="claim" className="mt-4">
						<TransactionList filteredTransactions={filterTransactions('claim')} />
					</TabsContent>
					
					<TabsContent value="initialize" className="mt-4">
						<TransactionList filteredTransactions={filterTransactions('initialize')} />
					</TabsContent>
					
					<TabsContent value="add_reward" className="mt-4">
						<TransactionList filteredTransactions={filterTransactions('add_reward')} />
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}

export default function SolanaStaking() {
	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold">Solana Staking Dashboard</h1>
				<p className="text-muted-foreground">
					Stake your tokens, earn rewards, and track your transaction history
				</p>
			</div>
			
			<StakingStatsCard stats={mockStats} />
			<StakingActions />
			<TransactionHistory transactions={mockTransactions} />
		</div>
	)
}