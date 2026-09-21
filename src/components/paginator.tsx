import { useState } from "react";
import { Pagination } from "react-bootstrap";

type PaginatorProps = {
	tracker: number;
	min?: number;
	max?: number;
	bump: (step: number) => void;
	jump: (page: number) => void;
	step?: number;
};

type JumpInputPosition = "before" | "after" | null;

export function Paginator({
	tracker,
	min = 0,
	max = 100,
	bump,
	jump,
	step = 10,
}: PaginatorProps) {
	const [jumpInputPosition, setJumpInputPosition] =
		useState<JumpInputPosition>(null);
	const [jumpInput, setJumpInput] = useState(String(tracker));

	function openJumpInput(position: Exclude<JumpInputPosition, null>) {
		setJumpInput(String(tracker));
		setJumpInputPosition(position);
	}

	function handleJumpInputKeyDown(
		event: React.KeyboardEvent<HTMLInputElement>,
	) {
		if (event.key !== "Enter") return;

		const selectedIndex = Number(jumpInput);
		if (
			Number.isInteger(selectedIndex) &&
			selectedIndex >= min &&
			selectedIndex <= max
		) {
			jump(selectedIndex);
			setJumpInputPosition(null);
		}
	}

	function renderJumpInput() {
		return (
			<li className="page-item">
				<input
					className="page-link"
					autoFocus
					aria-label="Ir a la página"
					type="number"
					min={min}
					max={max}
					value={jumpInput}
					onChange={(event) => setJumpInput(event.target.value)}
					onKeyDown={handleJumpInputKeyDown}
					onBlur={() => setJumpInputPosition(null)}
				/>
			</li>
		);
	}

	function tierJump() {
		const tierStart = min + Math.floor((tracker - min) / step) * step;
		const tierEnd = Math.min(tierStart + step - 1, max);

		return Array.from({ length: tierEnd - tierStart + 1 }, (_, index) => {
			const page = tierStart + index;

			return (
				<Pagination.Item
					active={tracker === page}
					key={page}
					onClick={() => jump(page)}>
					{page}
				</Pagination.Item>
			);
		});
	}
	return (
			<Pagination size="sm" className="catalog-pagination-list">
				<Pagination.First
					disabled={tracker <= min + 1}
					onClick={() => jump(min)}
				/>
				<Pagination.Prev
					disabled={tracker <= min}
					onClick={() => bump(-1)}
				/>
				{jumpInputPosition === "before" ? (
					renderJumpInput()
				) : (
					<Pagination.Ellipsis
						disabled={tracker <= min}
						onClick={() => openJumpInput("before")}
					/>
				)}
				{tierJump()}
				{jumpInputPosition === "after" ? (
					renderJumpInput()
				) : (
					<Pagination.Ellipsis onClick={() => openJumpInput("after")} />
				)}
				<Pagination.Next
					disabled={tracker >= max - 2}
					onClick={() => bump(1)}
				/>
				<Pagination.Last
					disabled={tracker >= max - 1}
					onClick={() => jump(max)}
				/>
			</Pagination>
	);
}
