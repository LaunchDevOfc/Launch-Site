import { useState } from 'react';

const emptyForm = {
  nome: '',
  email: '',
  whatsapp: '',
  empresa: '',
  equipe: '',
  mensagem: ''
};

export default function ContactForm() {
  const [form, setForm] = useState(emptyForm);

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    // TODO: enviar `form` para o backend / serviço de e-mail. O protótipo original
    // também não tinha destino, então aqui só evitamos o reload da página.
    console.log('Solicitação de demonstração:', form);
  }

  return (
    <section className="form-card">
      <h2>Solicitar demonstração</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="nome">Nome</label>
            <input id="nome" type="text" placeholder="Seu nome" value={form.nome} onChange={update('nome')} />
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="voce@empresa.com"
              value={form.email}
              onChange={update('email')}
            />
          </div>

          <div className="field">
            <label htmlFor="whatsapp">WhatsApp</label>
            <input
              id="whatsapp"
              type="tel"
              placeholder="(00) 00000-0000"
              value={form.whatsapp}
              onChange={update('whatsapp')}
            />
          </div>

          <div className="field">
            <label htmlFor="empresa">Empresa</label>
            <input
              id="empresa"
              type="text"
              placeholder="Nome da agência"
              value={form.empresa}
              onChange={update('empresa')}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="equipe">Tamanho do time</label>
          <select id="equipe" value={form.equipe} onChange={update('equipe')}>
            <option value="" disabled>
              Selecione
            </option>
            <option value="1-5">1 - 5 pessoas</option>
            <option value="6-10">6 - 10 pessoas</option>
            <option value="11-20">11 - 20 pessoas</option>
            <option value="20+">20+ pessoas</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="mensagem">Mensagem (opcional)</label>
          <textarea
            id="mensagem"
            placeholder="Conte rapidamente seu maior desafio hoje"
            value={form.mensagem}
            onChange={update('mensagem')}
          />
        </div>

        <button type="submit">
          Solicitar demonstração
          <span>→</span>
        </button>

        <small>Seus dados são usados apenas para entrar em contato sobre a demonstração.</small>
      </form>
    </section>
  );
}
