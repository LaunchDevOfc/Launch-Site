import { services } from './services.js';

export const contactSubjects = [
  { id: 'falar-projeto', label: 'Falar sobre meu projeto' },
  ...services.map(({ id, title }) => ({ id, label: title })),
  { id: 'nao-sei', label: 'Ainda não sei qual solução preciso' }
];

export const teamSizeOptions = [
  { id: '1', label: '1 pessoa' },
  { id: '2-5', label: '2–5 pessoas' },
  { id: '6-10', label: '6–10 pessoas' },
  { id: '11-25', label: '11–25 pessoas' },
  { id: '26-50', label: '26–50 pessoas' },
  { id: '51+', label: '51+ pessoas' }
];

export function isContactSubject(id) {
  return contactSubjects.some((subject) => subject.id === id);
}

export function getContactSubject(id) {
  return contactSubjects.find((subject) => subject.id === id) ?? null;
}

export function getTeamSize(id) {
  return teamSizeOptions.find((option) => option.id === id) ?? null;
}
