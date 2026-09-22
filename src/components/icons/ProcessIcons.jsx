// Ícones das etapas do processo. O tamanho vem do CSS (.process-step-icon svg
// e .process-modal-icon svg), então o mesmo componente serve para card e modal.

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

function BriefingIcon() {
  return (
    <svg {...base}>
      <rect x="8.6" y="2.4" width="13" height="9" rx="2.6" fill="currentColor" opacity=".22" stroke="none" />
      <rect x="8.6" y="2.4" width="13" height="9" rx="2.6" />
      <path d="M12.6 11.4v3.2l3.4-3.2" />
      <path d="M11.4 5.9h7.2M11.4 8.4h4.4" />
      <circle cx="6.4" cy="14.8" r="2.8" fill="currentColor" opacity=".22" stroke="none" />
      <circle cx="6.4" cy="14.8" r="2.8" />
      <path d="M1.7 22.6a4.7 4.7 0 0 1 9.4 0" />
    </svg>
  );
}

function BlueprintIcon() {
  return (
    <svg {...base}>
      <rect x="2.4" y="2.8" width="12.2" height="12.2" rx="2.4" fill="currentColor" opacity=".22" stroke="none" />
      <rect x="2.4" y="2.8" width="12.2" height="12.2" rx="2.4" />
      <path d="M2.4 6.9h12.2" />
      <path d="M5.6 10.2h5.8M5.6 12.6h3.4" />
      <path d="m11.4 21.8-3.1.8.8-3.1 7.4-7.4 2.3 2.3z" />
      <path d="m17.3 10.9 1.5-1.5a1.6 1.6 0 0 1 2.3 2.3l-1.5 1.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ContractIcon() {
  return (
    <svg {...base}>
      <path d="M5.2 2.6h8l5 5v11.2a2 2 0 0 1-2 2H5.2a2 2 0 0 1-2-2V4.6a2 2 0 0 1 2-2Z" fill="currentColor" opacity=".22" stroke="none" />
      <path d="M5.2 2.6h8l5 5v11.2a2 2 0 0 1-2 2H5.2a2 2 0 0 1-2-2V4.6a2 2 0 0 1 2-2Z" />
      <path d="M13.2 2.6v5h5" />
      <path d="M6.6 11.4h6M6.6 14.2h3.4" />
      <circle cx="17.8" cy="18.2" r="3.8" fill="currentColor" opacity=".22" stroke="none" />
      <circle cx="17.8" cy="18.2" r="3.8" />
      <path d="m16.1 18.2 1.3 1.3 2.3-2.5" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg {...base}>
      <rect x="2.2" y="4" width="19.6" height="16" rx="2.6" fill="currentColor" opacity=".22" stroke="none" />
      <rect x="2.2" y="4" width="19.6" height="16" rx="2.6" />
      <path d="M2.2 8.6h19.6" />
      <circle cx="5.4" cy="6.3" r=".85" fill="currentColor" stroke="none" />
      <circle cx="8.1" cy="6.3" r=".85" fill="currentColor" stroke="none" />
      <path d="m6.6 12.4 2.4 2.3-2.4 2.3" />
      <path d="M11.9 16.9h5.5" />
    </svg>
  );
}

function TestIcon() {
  return (
    <svg {...base}>
      <rect x="2.2" y="3.2" width="19.6" height="13.4" rx="2.4" fill="currentColor" opacity=".22" stroke="none" />
      <rect x="2.2" y="3.2" width="19.6" height="13.4" rx="2.4" />
      <path d="M12 16.6v4.2M8.2 20.8h7.6" />
      <path d="M9.4 6.6 12.58 14.25 13.71 10.92 17.05 9.78Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LaunchIcon() {
  return (
    <svg {...base}>
      <path d="M12 2.4c2.8 2.3 4.3 5.6 4.3 9.2v3.6l-1.9 2.2H9.6l-1.9-2.2v-3.6C7.7 8 9.2 4.7 12 2.4Z" fill="currentColor" opacity=".22" stroke="none" />
      <path d="M12 2.4c2.8 2.3 4.3 5.6 4.3 9.2v3.6l-1.9 2.2H9.6l-1.9-2.2v-3.6C7.7 8 9.2 4.7 12 2.4Z" />
      <circle cx="12" cy="9.6" r="1.9" fill="currentColor" stroke="none" />
      <path d="M7.7 12.6 4.6 15.4v3.3l3.1-2M16.3 12.6l3.1 2.8v3.3l-3.1-2" />
      <path d="M10.4 19.3c0 1.4.7 2.6 1.6 3.4.9-.8 1.6-2 1.6-3.4" />
    </svg>
  );
}

export const processIcons = {
  briefing: BriefingIcon,
  blueprint: BlueprintIcon,
  contract: ContractIcon,
  terminal: TerminalIcon,
  test: TestIcon,
  launch: LaunchIcon
};
