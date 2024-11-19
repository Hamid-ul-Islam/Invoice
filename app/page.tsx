import Invoice from '@/components/Invoice'

export default function Home() {
	return (
		<div className="flex min-h-screen  flex-col items-center justify-center py-10 bg-gradient-to-r from-purple-700/30 via-purble-500/20 to-amber-400/10">
			<Invoice />
		</div>
	)
}
