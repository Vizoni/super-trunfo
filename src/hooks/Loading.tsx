import React, { ReactNode, useEffect, useState } from "react";
import ReactLoading from "react-loading";

export function Loading(props: any) {
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		console.log("USOU LOADING...", props);
	}, []);

	return (
		<div>
			{isLoading && (
				<ReactLoading type={"balls"} color={"#f53"} height={667} width={375} />
			)}
		</div>
	);
}
