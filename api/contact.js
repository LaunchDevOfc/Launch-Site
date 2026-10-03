import { getContactSubject, getTeamSize } from '../src/data/contactSubjects.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimit = globalThis.__launchContactRateLimit ?? new Map();
globalThis.__launchContactRateLimit = rateLimit;

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);
}

function getClientIp(request) {
  const forwarded = request.headers['x-forwarded-for'];
  return String(Array.isArray(forwarded) ? forwarded[0] : forwarded ?? request.socket?.remoteAddress ?? 'unknown').split(',')[0].trim();
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (rateLimit.get(ip) ?? []).filter((timestamp) => now - timestamp < 10 * 60 * 1000);
  recent.push(now);
  rateLimit.set(ip, recent);
  return recent.length > 5;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ ok: false, message: 'Método não permitido.' });
  }

  if (isRateLimited(getClientIp(request))) {
    return response.status(429).json({ ok: false, message: 'Não foi possível enviar agora.' });
  }

  const contentLength = Number(request.headers['content-length']);
  if (Number.isFinite(contentLength) && contentLength > 12000) {
    return response.status(413).json({ ok: false, message: 'Conteúdo muito grande.' });
  }

  let body = request.body ?? {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return response.status(400).json({ ok: false, message: 'Verifique os dados enviados.' });
    }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) body = {};
  if (JSON.stringify(body).length > 12000) {
    return response.status(413).json({ ok: false, message: 'Conteúdo muito grande.' });
  }
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const company = typeof body.company === 'string' ? body.company.trim() : '';
  const teamSizeId = typeof body.teamSize === 'string' ? body.teamSize : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const website = typeof body.website === 'string' ? body.website.trim() : '';
  const selectedSubject = getContactSubject(body.subjectId);
  const selectedTeamSize = teamSizeId ? getTeamSize(teamSizeId) : null;
  const startedAt = Number(body.startedAt);

  if (website) return response.status(200).json({ ok: true });

  const submittedTooFast = !Number.isFinite(startedAt) || Date.now() - startedAt < 1200;
  const phoneDigits = phone.replace(/\D/g, '');
  if (submittedTooFast || !name || name.length > 100 || !emailPattern.test(email) || email.length > 160 || phoneDigits.length < 8 || phoneDigits.length > 15 || !company || company.length > 120 || (teamSizeId && !selectedTeamSize) || !selectedSubject || message.length < 10 || message.length > 3000) {
    return response.status(400).json({ ok: false, message: 'Verifique os dados enviados.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !toEmail || !fromEmail) {
    console.error('Configuração de e-mail ausente.');
    return response.status(503).json({ ok: false, message: 'Serviço temporariamente indisponível.' });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeCompany = escapeHtml(company);
  const safeSubject = escapeHtml(selectedSubject.label);
  const safeTeamSize = selectedTeamSize ? escapeHtml(selectedTeamSize.label) : '';
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  const teamText = selectedTeamSize ? `\nTamanho da equipe: ${selectedTeamSize.label}` : '';
  const teamRow = selectedTeamSize ? `<tr><td style="padding:6px 16px 6px 0;color:#6e6e6e;font-size:13px;vertical-align:top;">Tamanho da equipe</td><td style="padding:6px 0;color:#141414;font-size:14px;">${safeTeamSize}</td></tr>` : '';

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `Novo contato Launch — ${selectedSubject.label}`,
        text: `NOVO CONTATO PELO SITE DA LAUNCH\n\nUm novo contato foi enviado através do site.\n\nDADOS DO CONTATO\n\nNome: ${name}\nE-mail: ${email}\nTelefone: ${phone}\nEmpresa: ${company}${teamText}\n\nINTERESSE\n\n${selectedSubject.label}\n\nMENSAGEM DO CLIENTE\n\n${message}`,
        html: `<div style="margin:0;padding:28px;background:#f5f5f4;font-family:Arial,sans-serif;color:#141414;"><div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e7e5e3;"><div style="padding:22px 26px;background:#141414;color:#ffffff;"><strong style="font-size:18px;">LAUNCH</strong><div style="margin-top:5px;color:#b6b6ba;font-size:12px;">Novo contato pelo site</div></div><div style="padding:26px;"><p style="margin:0 0 22px;color:#555;font-size:14px;line-height:1.6;">Um novo contato foi enviado através do site.</p><h2 style="margin:0 0 10px;color:#d2001c;font-size:12px;letter-spacing:1px;">DADOS DO CONTATO</h2><table role="presentation" style="width:100%;border-collapse:collapse;"><tr><td style="padding:6px 16px 6px 0;color:#6e6e6e;font-size:13px;vertical-align:top;">Nome</td><td style="padding:6px 0;color:#141414;font-size:14px;">${safeName}</td></tr><tr><td style="padding:6px 16px 6px 0;color:#6e6e6e;font-size:13px;vertical-align:top;">E-mail</td><td style="padding:6px 0;color:#141414;font-size:14px;">${safeEmail}</td></tr><tr><td style="padding:6px 16px 6px 0;color:#6e6e6e;font-size:13px;vertical-align:top;">Telefone</td><td style="padding:6px 0;color:#141414;font-size:14px;">${safePhone}</td></tr><tr><td style="padding:6px 16px 6px 0;color:#6e6e6e;font-size:13px;vertical-align:top;">Empresa</td><td style="padding:6px 0;color:#141414;font-size:14px;">${safeCompany}</td></tr>${teamRow}</table><h2 style="margin:26px 0 9px;color:#d2001c;font-size:12px;letter-spacing:1px;">INTERESSE</h2><p style="margin:0;padding:12px 14px;background:#f7f6f4;border-left:3px solid #d2001c;font-size:14px;">${safeSubject}</p><h2 style="margin:26px 0 9px;color:#d2001c;font-size:12px;letter-spacing:1px;">MENSAGEM DO CLIENTE</h2><p style="margin:0;color:#333;font-size:14px;line-height:1.7;">${safeMessage}</p></div></div></div>`
      })
    });

    if (!resendResponse.ok) {
      console.error('Falha no provedor de e-mail:', resendResponse.status, await resendResponse.text());
      return response.status(502).json({ ok: false, message: 'Não foi possível enviar a mensagem.' });
    }
    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Erro ao enviar contato:', error);
    return response.status(502).json({ ok: false, message: 'Não foi possível enviar a mensagem.' });
  }
}