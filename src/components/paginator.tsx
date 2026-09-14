import { useLocalStorage } from "@uidotdev/usehooks";
import { useState } from "react";
import { Pagination } from "react-bootstrap";

export function Paginator({ tracker, min = 0, max = 100, bump, jump, step }) {
	const list = Array.from({ length: step });
	return (
		<Pagination>
			<Pagination.First
				disabled={tracker <= min + 1}
				onClick={() => jump(min)}
			/>
			<Pagination.Prev
				disabled={tracker <= min}
				onClick={() => bump(-1)}
			/>
			<Pagination.Ellipsis />
			{list.map((_, index) => {
				const isTenth = index % 10 === 0;
				return (
					<Pagination.Item
						active={tracker === index}
						key={index}
						onClick={() => jump(index)}>
						{isTenth && <h3>Group {Math.floor(index/10)+1}</h3>}
					</Pagination.Item>
				);
			})}
			<Pagination.Ellipsis />
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
