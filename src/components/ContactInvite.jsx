import { useEffect, useRef } from 'react';

// Convite que o sino do header abre. Fica controlado pelo pai: `open` manda o
// <dialog> abrir/fechar, `onSyncClose` devolve o estado quando o Esc fecha sozinho.
export default function ContactInvite({ open, onDismiss, onSyncClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      className="contact-invite"
      id="contact-invite"
      ref={dialogRef}
      aria-labelledby="contact-invite-title"
      aria-describedby="contact-invite-description"
      onClose={onSyncClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onDismiss();
      }}
    >
      <button className="contact-invite-close" type="button" aria-label="Fechar convite" onClick={onDismiss}>
        ×
      </button>
      <span className="contact-invite-kicker">UMA CONVERSA PODE SER O COMEÇO</span>
      <h2 id="contact-invite-title">Vamos conversar sobre seu projeto?</h2>
      <p id="contact-invite-description">
        Conte sua ideia à equipe Launch. Vamos entender o que você precisa e, se fizer sentido, marcar uma reunião
        para pensar nos próximos passos.
      </p>
      <a className="btn contact-invite-action" href="#contato" onClick={onDismiss}>
        Falar com a equipe <span aria-hidden="true">↗</span>
      </a>
    </dialog>
  );
}
