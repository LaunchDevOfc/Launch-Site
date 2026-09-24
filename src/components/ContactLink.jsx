import { useContact } from '../context/ContactContext.jsx';

export default function ContactLink({ subject = '', onClick, children, ...props }) {
  const { goToContact } = useContact();

  return (
    <a
      href="#contato"
      {...props}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
        requestAnimationFrame(() => goToContact(subject));
      }}
    >
      {children}
    </a>
  );
}
