import { useEffect, useRef, useState } from 'react';
import { m } from 'motion/react';
import { useContact } from '../context/ContactContext.jsx';
import { contactSubjects, getContactSubject, getTeamSize, teamSizeOptions } from '../data/contactSubjects.js';

const emptyForm = { name: '', email: '', phone: '', company: '', teamSize: '', message: '', 'bot-field': '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form, subject) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Informe seu nome.';
  else if (form.name.trim().length > 100) errors.name = 'Use no máximo 100 caracteres.';
  if (!form.email.trim()) errors.email = 'Informe seu e-mail.';
  else if (!emailPattern.test(form.email.trim())) errors.email = 'Informe um e-mail válido.';
  else if (form.email.trim().length > 160) errors.email = 'Use no máximo 160 caracteres.';
  const phoneDigits = form.phone.replace(/\D/g, '');
  if (!form.phone.trim()) errors.phone = 'Informe seu telefone.';
  else if (phoneDigits.length < 8 || phoneDigits.length > 15) errors.phone = 'Informe um telefone válido.';
  else if (form.phone.length > 30) errors.phone = 'Use no máximo 30 caracteres.';
  if (!form.company.trim()) errors.company = 'Informe o nome da empresa.';
  else if (form.company.trim().length > 120) errors.company = 'Use no máximo 120 caracteres.';
  if (form.teamSize && !getTeamSize(form.teamSize)) errors.teamSize = 'Selecione um tamanho de equipe válido.';
  if (!getContactSubject(subject)) errors.subject = 'Selecione um assunto.';
  if (!form.message.trim()) errors.message = 'Conte brevemente sobre o projeto.';
  else if (form.message.trim().length < 10) errors.message = 'Escreva pelo menos 10 caracteres.';
  else if (form.message.trim().length > 3000) errors.message = 'Use no máximo 3000 caracteres.';
  return errors;
}

export default function ContactForm() {
  const { subject, setSubject } = useContact();
  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const submitting = useRef(false);
  const selectedSubject = getContactSubject(subject);
  const selectedTeamSize = getTeamSize(form.teamSize);

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
      setStatus((current) => current === 'sending' ? current : 'idle');
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
    setStatus((current) => current === 'sending' ? current : 'idle');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting.current) return;
    const nextErrors = validate(form, subject);
    setTouched({ name: true, email: true, phone: true, company: true, teamSize: true, subject: true, message: true });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    submitting.current = true;
    setStatus('sending');
    try {
      const payload = new URLSearchParams(new FormData(event.currentTarget));
      payload.set('form-name', 'launch-contact');
      payload.set('subject', selectedSubject.label);
      payload.set('teamSizeLabel', selectedTeamSize?.label ?? 'Não informado');
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
      });
      if (!response.ok) throw new Error('Falha no envio');
      setStatus('success');
      setForm(emptyForm);
      setSubject('');
      setTouched({});
      setErrors({});
    } catch {
      setStatus('error');
    } finally {
      submitting.current = false;
    }
  }

  const errorFor = (field) => touched[field] && errors[field];

  return (
    <div className="contact-form-card" data-reveal data-reveal-delay="60">
      <div className="contact-form-head">
        <span>Conte o que você precisa</span>
        <h3>Fale com a equipe Launch</h3>
      </div>
      <noscript><p>Ative o JavaScript para enviar uma mensagem pelo formulário.</p></noscript>
      <form name="launch-contact" method="POST" action="/" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={handleSubmit} noValidate aria-busy={status === 'sending'}>
        <input type="hidden" name="form-name" value="launch-contact" />
        <input type="hidden" name="subject" value={selectedSubject?.label ?? ''} />
        <input type="hidden" name="teamSizeLabel" value={selectedTeamSize?.label ?? 'Não informado'} />
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

        <div className={`contact-field${errorFor('teamSize') ? ' has-error' : ''}`}>
          <label htmlFor="contact-team-size">Tamanho da equipe <em>(opcional)</em></label>
          <div className="contact-select-wrap">
            <select id="contact-team-size" name="teamSize" value={form.teamSize} onChange={update('teamSize')} aria-invalid={Boolean(errorFor('teamSize'))} aria-describedby={errorFor('teamSize') ? 'contact-team-size-error' : undefined}>
              <option value="">Não informado</option>
              {teamSizeOptions.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}
            </select>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg>
          </div>
          {errorFor('teamSize') && <small id="contact-team-size-error" className="contact-field-error">{errors.teamSize}</small>}
        </div>

        <div className={`contact-field${errorFor('subject') ? ' has-error' : ''}`}>
          <label htmlFor="contact-subject">Assunto / interesse <span aria-hidden="true">*</span></label>
          <div className="contact-select-wrap">
            <select id="contact-subject" name="subjectId" value={subject} required onChange={changeSubject} aria-invalid={Boolean(errorFor('subject'))} aria-describedby={errorFor('subject') ? 'contact-subject-error' : undefined}>
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
          <input id="contact-website" name="bot-field" type="text" tabIndex="-1" autoComplete="off" value={form['bot-field']} onChange={update('bot-field')} />
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
