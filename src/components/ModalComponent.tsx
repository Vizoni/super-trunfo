import { useEffect, useState } from "react";
import { useGame } from "../hooks/useGame";
import { Card } from "../interfaces/Card";
import "./modalStyle.css";

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

export function ModalComponent(props: any) {
	const [displayModal, setDisplayModal] = useState(false);

	useEffect(() => {
		console.log("props", props);
		setDisplayModal(props.display);
	}, [props]);

	function closeModalAndRedirect() {
		setDisplayModal(false);
		setTimeout(() => {
			props.closeFunction();
		}, 500);
	}

	return (
		<>
			<Modal
				open={displayModal}
				onClose={() => closeModalAndRedirect()}
				center
				modalId="super-trunfo-modal"
				classNames={{ modal: `modal-box` }}
			>
				<div className="modal-box-container">
					<h1 className={`modal-title ${props.userWon ? `victory` : `defeat`}`}>
						{props.title}
					</h1>
					<div className="modal-text">
						<p>{props.subTitle}</p>
						<p>{props.text}</p>
					</div>
					<button className="modal-btn-home" onClick={closeModalAndRedirect}>
						{props.btnLabel ? props.btnLabel : "OK"}
					</button>
				</div>
			</Modal>
		</>
	);
}
