import ContactForm from './ContactForm.jsx';

const iconProps = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

const principles = [
  {
    title: 'Solução pensada para o negócio',
    text: 'A tecnologia parte do problema real, não de um pacote pronto.',
    icon: <svg {...iconProps}><path d="M12 3 4.5 7.2v9.6L12 21l7.5-4.2V7.2L12 3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></svg>
  },
  {
    title: 'Contato direto durante o projeto',
    text: 'Decisões e próximos passos explicados com clareza.',
    icon: <svg {...iconProps}><path d="M7 18.5 3.5 21l1-4.3A8 8 0 1 1 7 18.5Z" /><path d="M8 11h8M8 14h5" /></svg>
  },
  {
    title: 'Da ideia à entrega',
    text: 'Estratégia, construção e evolução no mesmo caminho.',
    icon: <svg {...iconProps}><path d="M5 19 19 5M9 5h10v10" /><path d="M5 9v10h10" /></svg>
  }
];

export default function Contact() {
  return (
    <section className="contact" id="contato" aria-labelledby="contact-title">
      <div className="wrap contact-layout">
        <header className="contact-copy" data-reveal>
          <div className="eyebrow">Seu próximo projeto</div>
          <h2 className="section-title" id="contact-title">Vamos transformar sua ideia em uma solução que funciona.</h2>
          <p className="contact-description">
            A Launch desenvolve software sob medida e soluções digitais para empresas — de sistemas personalizados e
            automações com IA a landing pages, dashboards e novos produtos digitais.
          </p>
          <div className="contact-principles">
            {principles.map((principle) => (
              <div className="contact-principle" key={principle.title}>
                <span className="contact-principle-icon">{principle.icon}</span>
                <span><strong>{principle.title}</strong><small>{principle.text}</small></span>
              </div>
            ))}
          </div>
        </header>
        <ContactForm />
      </div>
    </section>
  );
}
