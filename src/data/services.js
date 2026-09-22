// Catálogo de serviços — uma coleção só, oito cards do mesmo tamanho.
//
// `tier: 'principal'` marca os quatro que abrem a grade. É um destaque sutil
// (número vermelho, painel de imagem mais trabalhado, hover um pouco mais forte),
// não uma categoria separada.
//
// Consolidações feitas sobre a lista original de dez itens — nenhum serviço foi
// descartado, todos aparecem em algum card:
//
//   · "Sites institucionais" → dentro de "Landing pages e sites". Eram a mesma
//     coisa, uma página web, mudando só a quantidade de páginas.
//   · "Manutenção e suporte" + "Consultoria técnica" → "Consultoria e suporte".
//     São as duas pontas do mesmo trabalho de engenharia em volta do sistema:
//     desenhar antes, acompanhar depois. A manutenção segue citada em "Sistemas
//     sob medida", porque para o que a Launch constrói ela é inclusa.
//   · "Chatbots" ficou SEPARADO de "Automação com IA" de propósito. Apesar de um
//     chatbot ser IA, o comprador é outro: automação resolve processo interno do
//     time, chatbot resolve atendimento de quem chega de fora. Além disso é a
//     porta de entrada mais procurada — esconder num nome abstrato custaria
//     demanda. Os dois textos dizem essa diferença explicitamente.
//
// As imagens ficam em public/img/servicos/ — enquanto não existirem, o card
// mantém o painel reservado.

export const services = [
  {
    id: 'landing-pages',
    tier: 'principal',
    num: '01',
    title: 'Landing pages e sites',
    summary: 'Página de campanha ou site completo, feitos para carregar rápido e converter quem chega.',
    image: '/img/servicos/landing-pages.jpg',
    imageAlt: 'Ilustração do serviço de Landing pages e sites',
    detail:
      'Quando o objetivo é uma campanha, construímos uma página só, com um caminho claro até a ação que interessa: comprar, cadastrar ou marcar uma conversa. Quando o objetivo é presença digital, entregamos o site completo — Home, Sobre, Serviços, Blog e Contato — organizado para quem pesquisa a sua empresa antes de fechar negócio. Nos dois casos a base é a mesma: carregar rápido, funcionar bem no celular e ser fácil de atualizar depois.',
    highlights: [
      'Estrutura definida pelo objetivo da página, não por um modelo pronto',
      'Otimizada para celular e para tempo de carregamento',
      'Pixel, analytics e SEO básico já configurados',
      'Conteúdo fácil de atualizar conforme o negócio muda'
    ]
  },
  {
    id: 'sistemas-sob-medida',
    tier: 'principal',
    num: '02',
    title: 'Sistemas sob medida',
    summary: 'O sistema construído em volta da sua operação — e mantido por quem construiu.',
    image: '/img/servicos/sistemas-sob-medida.jpg',
    imageAlt: 'Ilustração do serviço de Sistemas sob medida',
    detail:
      'Construímos o sistema em volta do jeito que sua operação já funciona, em vez de pedir que a equipe se adapte a um software genérico. Cada tela nasce de uma rotina real do seu negócio, e o que foi entregue continua nosso trabalho depois de publicado: correção quando aparece um problema, evolução quando a operação muda e manutenção preventiva para os problemas que ainda não apareceram.',
    highlights: [
      'Arquitetura desenhada para a sua operação, não um molde pronto',
      'Código e banco de dados seus, sem licença de terceiros',
      'Correção, evolução e manutenção preventiva depois da entrega',
      'Preparado para crescer junto com o negócio'
    ]
  },
  {
    id: 'automacao-ia',
    tier: 'principal',
    num: '03',
    title: 'Automação com IA',
    summary: 'IA nas tarefas repetitivas do time, dentro do sistema que ele já usa.',
    image: '/img/servicos/automacao-ia.jpg',
    imageAlt: 'Ilustração do serviço de Automação com IA',
    detail:
      'Fluxos automatizados que usam IA para classificar, responder ou decidir o que é simples e repetitivo: triar pedidos que chegam, resumir um histórico, preencher um documento, encaminhar para a pessoa certa. Aqui o foco é o processo interno do time — o atendimento de quem chega de fora é trabalho do chatbot. A automação vive dentro do próprio sistema, com regras que você acompanha.',
    highlights: [
      'Menos tarefa manual repetitiva para a equipe',
      'IA aplicada dentro do sistema que já está em uso',
      'Regras visíveis e ajustáveis, sem caixa-preta',
      'Decisões sensíveis continuam passando por uma pessoa'
    ]
  },
  {
    id: 'dashboards-paineis',
    tier: 'principal',
    num: '04',
    title: 'Dashboards e painéis',
    summary: 'Os números da operação num painel só, com acesso por perfil de usuário.',
    image: '/img/servicos/dashboards-paineis.jpg',
    imageAlt: 'Ilustração do serviço de Dashboards e painéis',
    detail:
      'Uma área de gestão com os indicadores que importam para o seu negócio em um lugar só, sem abrir três planilhas para entender como a operação está indo. Cada perfil de usuário enxerga o que precisa, os dados atualizam sozinhos e o que aparece na tela é definido junto com quem vai usar o painel todo dia.',
    highlights: [
      'Indicadores do negócio em um único painel',
      'Atualização em tempo real, sem planilha intermediária',
      'Permissões por nível de usuário',
      'Relatórios e exportação para levar o dado adiante'
    ]
  },
  {
    id: 'chatbots',
    tier: 'complementar',
    num: '05',
    title: 'Chatbots',
    summary: 'Atendimento automático no WhatsApp e no site, com passagem para um humano.',
    image: '/img/servicos/chatbots.jpg',
    imageAlt: 'Ilustração do serviço de Chatbots',
    detail:
      'Um assistente que responde no WhatsApp ou no seu site a qualquer hora, resolve as dúvidas repetidas, qualifica quem está interessado e entrega a conversa para um atendente quando o assunto exige. É o outro lado da automação: aqui o alvo é quem chega de fora, não o processo interno do time.',
    highlights: [
      'Atendimento 24h sem depender de alguém online',
      'Integrado ao seu sistema ou CRM',
      'Qualifica o contato antes de chegar no time',
      'Escalona para um atendente humano quando necessário'
    ]
  },
  {
    id: 'e-commerce',
    tier: 'complementar',
    num: '06',
    title: 'E-commerce',
    summary: 'Loja própria com catálogo, carrinho e Pix, sem comissão de marketplace.',
    image: '/img/servicos/e-commerce.jpg',
    imageAlt: 'Ilustração do serviço de E-commerce',
    detail:
      'Loja virtual própria, com catálogo, carrinho e pagamento integrado, sem depender de marketplace nem pagar comissão por venda. O controle do catálogo, dos preços e da base de clientes fica com você, e a loja pode conversar com o estoque que a sua operação já usa.',
    highlights: [
      'Catálogo e carrinho sob seu controle',
      'Integração com Pix e cartão',
      'Sem taxa por venda de marketplace',
      'Conecta com o controle de estoque existente'
    ]
  },
  {
    id: 'integracoes-personalizadas',
    tier: 'complementar',
    num: '07',
    title: 'Integrações',
    summary: 'Seu sistema conversando com WhatsApp, Pix, planilhas e outras APIs.',
    image: '/img/servicos/integracoes-personalizadas.jpg',
    imageAlt: 'Ilustração do serviço de Integrações',
    detail:
      'Conectamos o sistema com as ferramentas que a sua operação já usa — WhatsApp, Pix, planilhas, serviços de IA, o ERP que já está lá — para que o dado circule sozinho em vez de ser copiado de um lado para o outro. Tudo dentro da plataforma que construímos, sem gambiarra pendurada por fora.',
    highlights: [
      'Conecta com as ferramentas que já estão em uso',
      'Sem planilha solta nem digitação em duplicidade',
      'Tudo acontecendo dentro de um sistema só',
      'Falhas de integração monitoradas, não descobertas pelo cliente'
    ]
  },
  {
    id: 'consultoria-suporte',
    tier: 'complementar',
    num: '08',
    title: 'Consultoria e suporte',
    summary: 'Discovery antes do projeto e evolução contínua depois que ele está no ar.',
    image: '/img/servicos/consultoria-suporte.jpg',
    imageAlt: 'Ilustração do serviço de Consultoria e suporte',
    detail:
      'As duas pontas do trabalho técnico em volta de um sistema. Antes do projeto começar, levantamos os requisitos reais, mapeamos o processo e desenhamos a arquitetura — etapa paga, que vale até para quem só quer o desenho técnico em mãos. Depois que o sistema está no ar, seguimos acompanhando: correção, ajuste e evolução conforme a operação muda, com prazo de atendimento combinado em contrato.',
    highlights: [
      'Requisitos e arquitetura definidos antes do orçamento fechar',
      'Desenho técnico entregue mesmo sem a Launch executar o projeto',
      'Correção e evolução contínua depois da entrega',
      'Prazo de atendimento combinado em contrato'
    ]
  }
];

export const featuredServices = services.filter((service) => service.tier === 'principal');
