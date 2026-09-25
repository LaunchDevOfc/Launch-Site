import { useEffect, useRef, useState } from 'react';
import { m } from 'motion/react';
import { useContact } from '../context/ContactContext.jsx';
import { contactSubjects, teamSizeOptions } from '../data/contactSubjects.js';

const emptyForm = { name: '', email: '', phone: '', company: '', teamSize: '', message: '', website: '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form, subject) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Informe seu nome.';
  else if (form.name.trim().length > 100) errors.name = 'Use no máximo 100 caracteres.';
  if (!form.email.trim()) errors.email = 'Informe seu e-mail.';
  else if (!emailPattern.test(form.email.trim())) errors.email = 'Informe um e-mail válido.';
  const phoneDigits = form.phone.replace(/\D/g, '');
  if (!form.phone.trim()) errors.phone = 'Informe seu telefone.';
  else if (phoneDigits.length < 8 || phoneDigits.length > 15) errors.phone = 'Informe um telefone válido.';
  if (!form.company.trim()) errors.company = 'Informe o nome da empresa.';
  else if (form.company.trim().length > 120) errors.company = 'Use no máximo 120 caracteres.';
  if (!subject) errors.subject = 'Selecione um assunto.';
  if (!form.message.trim()) errors.message = 'Conte brevemente sobre o projeto.';
  else if (form.message.trim().length < 10) errors.message = 'Escreva pelo menos 10 caracteres.';
  return errors;
}

export default function ContactForm() {
  const { subject, setSubject } = useContact();
  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (!subject) return;
    setStatus((current) => current === 'sending' ? current : 'idle');
    setErrors((current) => {
      if (!current.subject) return current;
      const remaining = { ...current };
      delete remaining.subject;
      return remaining;
    });
  }, [subject]);

  function update(field) {
    return (event) => {
      const value = event.target.value;
      const nextForm = { ...form, [field]: value };
      setForm(nextForm);
      if (touched[field]) setErrors(validate(nextForm, subject));
      if (status !== 'idle') setStatus('idle');
    };
  }

  function blur(field) {
    return () => {
      setTouched((current) => ({ ...current, [field]: true }));
      setErrors(validate(form, subject));
    };
  }

  function changeSubject(event) {
    const value = event.target.value;
    setSubject(value);
    setTouched((current) => ({ ...current, subject: true }));
    setErrors(validate(form, value));
    if (status !== 'idle') setStatus('idle');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form, subject);
    setTouched({ name: true, email: true, phone: true, company: true, subject: true, message: true });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subjectId: subject, startedAt: startedAt.current })
      });
      if (!response.ok) throw new Error('Falha no envio');
      setStatus('success');
      setForm(emptyForm);
      setSubject('');
      setTouched({});
      setErrors({});
      startedAt.current = Date.now();
    } catch {
      setStatus('error');
    }
  }

  const errorFor = (field) => touched[field] && errors[field];

  return (
    <div className="contact-form-card">
      <div className="contact-form-head">
        <span>Conte o que você precisa</span>
        <h3>Fale com a equipe Launch</h3>
      </div>
      <form onSubmit={handleSubmit} noValidate aria-busy={status === 'sending'}>
        <div className="contact-form-grid">
          <div className={`contact-field${errorFor('name') ? ' has-error' : ''}`}>
            <label htmlFor="contact-name">Nome <span aria-hidden="true">*</span></label>
            <input id="contact-name" name="name" type="text" autoComplete="name" maxLength="100" required placeholder="Seu nome" value={form.name} onChange={update('name')} onBlur={blur('name')} aria-invalid={Boolean(errorFor('name'))} aria-describedby={errorFor('name') ? 'contact-name-error' : undefined} />
            {errorFor('name') && <small id="contact-name-error" className="contact-field-error">{errors.name}</small>}
          </div>
          <div className={`contact-field${errorFor('email') ? ' has-error' : ''}`}>
            <label htmlFor="contact-email">E-mail <span aria-hidden="true">*</span></label>
            <input id="contact-email" name="email" type="email" inputMode="email" autoComplete="email" maxLength="160" required placeholder="voce@empresa.com" value={form.email} onChange={update('email')} onBlur={blur('email')} aria-invalid={Boolean(errorFor('email'))} aria-describedby={errorFor('email') ? 'contact-email-error' : undefined} />
            {errorFor('email') && <small id="contact-email-error" className="contact-field-error">{errors.email}</small>}
          </div>
        </div>

        <div className="contact-form-grid">
          <div className={`contact-field${errorFor('phone') ? ' has-error' : ''}`}>
            <label htmlFor="contact-phone">WhatsApp / Telefone <span aria-hidden="true">*</span></label>
            <input id="contact-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength="30" required placeholder="(00) 00000-0000" value={form.phone} onChange={update('phone')} onBlur={blur('phone')} aria-invalid={Boolean(errorFor('phone'))} aria-describedby={errorFor('phone') ? 'contact-phone-error' : undefined} />
            {errorFor('phone') && <small id="contact-phone-error" className="contact-field-error">{errors.phone}</small>}
          </div>
          <div className={`contact-field${errorFor('company') ? ' has-error' : ''}`}>
            <label htmlFor="contact-company">Nome da empresa <span aria-hidden="true">*</span></label>
            <input id="contact-company" name="company" type="text" autoComplete="organization" maxLength="120" required placeholder="Sua empresa" value={form.company} onChange={update('company')} onBlur={blur('company')} aria-invalid={Boolean(errorFor('company'))} aria-describedby={errorFor('company') ? 'contact-company-error' : undefined} />
            {errorFor('company') && <small id="contact-company-error" className="contact-field-error">{errors.company}</small>}
          </div>
        </div>

        <div className="contact-field">
          <label htmlFor="contact-team-size">Tamanho da equipe <em>(opcional)</em></label>
          <div className="contact-select-wrap">
            <select id="contact-team-size" name="teamSize" value={form.teamSize} onChange={update('teamSize')}>
              <option value="">Não informado</option>
              {teamSizeOptions.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}
            </select>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg>
          </div>
        </div>

        <div className={`contact-field${errorFor('subject') ? ' has-error' : ''}`}>
          <label htmlFor="contact-subject">Assunto / interesse <span aria-hidden="true">*</span></label>
          <div className="contact-select-wrap">
            <select id="contact-subject" name="subject" value={subject} required onChange={changeSubject} aria-invalid={Boolean(errorFor('subject'))} aria-describedby={errorFor('subject') ? 'contact-subject-error' : undefined}>
              <option value="" disabled>Selecione um assunto</option>
              {contactSubjects.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}
            </select>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg>
          </div>
          {errorFor('subject') && <small id="contact-subject-error" className="contact-field-error">{errors.subject}</small>}
        </div>

        <div className={`contact-field${errorFor('message') ? ' has-error' : ''}`}>
          <label htmlFor="contact-message">Mensagem <span aria-hidden="true">*</span></label>
          <textarea id="contact-message" name="message" maxLength="3000" required placeholder="Conte um pouco sobre sua ideia, necessidade ou desafio atual" value={form.message} onChange={update('message')} onBlur={blur('message')} aria-invalid={Boolean(errorFor('message'))} aria-describedby={errorFor('message') ? 'contact-message-error' : undefined} />
          <span className="contact-character-count" aria-hidden="true">{form.message.length} / 3000</span>
          {errorFor('message') && <small id="contact-message-error" className="contact-field-error">{errors.message}</small>}
        </div>

        <div className="contact-honeypot" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input id="contact-website" name="website" type="text" tabIndex="-1" autoComplete="off" value={form.website} onChange={update('website')} />
        </div>

        <m.button className="btn btn-lg contact-submit" type="submit" disabled={status === 'sending'} whileTap={{ scale: .99 }}>
          {status === 'sending' ? <><span className="contact-spinner" aria-hidden="true" />Enviando...</> : <>Enviar mensagem <span aria-hidden="true">→</span></>}
        </m.button>
        <div className={`contact-form-status is-${status}`} role="status" aria-live="polite">
          {status === 'success' && 'Mensagem enviada. Recebemos seu contato e responderemos assim que possível.'}
          {status === 'error' && 'Não foi possível enviar agora. Revise os dados e tente novamente.'}
        </div>
        <p className="contact-privacy">Seus dados serão usados apenas para responder sobre o seu projeto.</p>
      </form>
    </div>
  );
}
