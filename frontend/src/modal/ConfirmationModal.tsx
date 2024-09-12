import "./Modal.css"

type ConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

export default function ConfirmationModal({isOpen, onClose, onConfirm, message}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content confirmation-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    X
                </button>
                <p>{message}</p>
                <div className="confirmation-buttons">
                    <button className="confirm-button" onClick={onConfirm}>Delete</button>
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
