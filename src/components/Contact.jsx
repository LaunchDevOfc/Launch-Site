import ContactForm from './ContactForm.jsx';

const iconProps = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 };

const benefits = [
  {
    text: 'Demonstração de 30 minutos, direto ao ponto',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    )
  },
  {
    text: 'Focada na operação da sua agência',
    icon: (
      <svg {...iconProps}>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="M4 10h16" />
      </svg>
    )
  },
  {
    text: 'Sem compromisso e sem cartão de crédito',
    icon: (
      <svg {...iconProps}>
        <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    )
  }
];

const stats = [
  {
    value: '500+',
    label: 'Agências organizadas',
    icon: (
      <svg {...iconProps}>
        <path d="M4 21V10l4-3v14" />
        <path d="M8 21V4h8v17" />
        <path d="M16 21v-8l4-2v10" />
        <path d="M2 21h20" />
      </svg>
    )
  },
  {
    value: '4.9',
    label: 'Nota de satisfação',
    icon: (
      <svg {...iconProps}>
        <path d="M12 2l3 6 6 .9-4.5 4.4 1 6.2L12 16.5 6.5 19.5l1-6.2L3 8.9 9 8z" />
      </svg>
    )
  }
];

export default function Contact() {
  return (
    <section className="contact" id="contato" aria-labelledby="contact-title">
      <div className="wrap demo-container">
        <section className="content">
          <div className="badge">
            <span />
            DEMONSTRAÇÃO GUIADA
          </div>

          <h2 id="contact-title">
            Veja o Launch
            <br />
            rodando na <strong>sua operação.</strong>
          </h2>

          <p className="description">
            Agende uma demonstração e mostramos como centralizar clientes, projetos, aprovações e entregas em um
            único lugar.
          </p>

          <div className="benefits">
            {benefits.map((benefit) => (
              <div className="benefit" key={benefit.text}>
                <div className="icon">{benefit.icon}</div>
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="stats">
            {stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <div className="stat-icon">{stat.icon}</div>
                <div>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <ContactForm />
      </div>
    </section>
  );
}
