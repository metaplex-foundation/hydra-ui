import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatAmount } from "@/common/format";
import { useAnalytics } from "@/hooks/useAnalytics";
interface DistributionModalProps { available: number; token: string }
export const DistributionModal: React.FC<DistributionModalProps> = ({ available, token }) => {
	const { track } = useAnalytics();
	const [open, setOpen] = React.useState(false);
	const [pending, setPending] = React.useState(false);
	const onDistribute = async () => {
		setPending(true);
		track({ name: 'distribution_initiated', scope: 'all' });
		await new Promise(r => setTimeout(r, 800));
		setPending(false);
		setOpen(false);
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="w-auto px-4 font-medium">Distribute All</Button>
			</DialogTrigger>
			<DialogContent className="glass-panel p-6 max-w-sm w-full" data-elev={3}>
				<DialogHeader>
					<DialogTitle className="font-heading">Distribute Funds</DialogTitle>
					<DialogDescription>
						This will create a distribution transaction for all members based on share percentages.
					</DialogDescription>
				</DialogHeader>
				<div className="text-sm space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-[var(--text-color-muted)]">Available</span>
						<strong className="font-mono tabular-nums">{formatAmount(available,{ maxSig:6, minSig:2 })} {token}</strong>
					</div>
					<div className="text-[11px] text-[var(--text-color-muted)]">Network fee estimate will display here.</div>
				</div>
				<div className="flex justify-end gap-2 pt-4">
					<Button variant="outline" size="sm" className="w-auto px-4" onClick={() => setOpen(false)} disabled={pending}>Cancel</Button>
					<Button size="sm" className="w-auto px-5 font-medium" onClick={onDistribute} disabled={pending || available <= 0}>{pending ? "Distributing…" : "Confirm"}</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
