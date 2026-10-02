// Etapas da seção "Na prática". `modalColor` é o mesmo --step-modal-color que o
// CSS original definia por :nth-child — aqui ele viaja junto com o conteúdo e é
// aplicado no card e no modal via variável inline.

export const processSteps = [
  {
    id: 'primeira-conversa',
    icon: 'briefing',
    modalColor: 'var(--surface-2)',
    title: 'Primeira conversa',
    tag: 'Ouvimos sua ideia de verdade, antes de propor qualquer coisa.',
    detail:
      'Tudo começa com uma reunião simples, sem compromisso, onde você conta sua ideia, seu problema ou o que já tentou fazer antes. Nosso trabalho aqui é ouvir de verdade, entender o contexto do seu negócio e identificar o que realmente precisa ser resolvido. Não chegamos com solução pronta: essa etapa é sobre entender você.',
    highlights: [
      'Reunião sem compromisso, focada em entender seu problema',
      'Levantamento do contexto real do seu negócio',
      'Base para o time desenhar a solução certa'
    ]
  },
  {
    id: 'discussao-interna',
    icon: 'blueprint',
    modalColor: 'var(--surface-2)',
    title: 'Discussão interna e desenho',
    tag: 'Transformamos a conversa num plano concreto.',
    detail:
      'Com tudo que ouvimos na primeira conversa em mãos, o time se reúne internamente para discutir o problema a fundo. Avaliamos diferentes caminhos possíveis, pensamos em tecnologia, escopo e prazo, e desenhamos uma proposta de solução que realmente resolve o que você trouxe. Só depois disso voltamos até você para apresentar o que desenhamos.',
    highlights: [
      'Time discute o problema em profundidade',
      'Solução desenhada com base no que foi ouvido',
      'Proposta apresentada de volta ao cliente'
    ]
  },
  {
    id: 'alinhamento-contrato',
    icon: 'contract',
    modalColor: 'var(--surface-2)',
    title: 'Alinhamento e contrato',
    tag: 'Fechamos o entendimento antes de escrever qualquer código.',
    detail:
      'Apresentamos o contrato junto com a proposta desenhada, para garantir que estamos buscando exatamente a mesma coisa. É o momento de confirmar se aquilo que desenhamos condiz com a realidade do seu negócio, ajustar detalhes e alinhar expectativas dos dois lados antes de avançar.',
    highlights: [
      'Contrato apresentado junto com a proposta',
      'Verificação se a solução condiz com a realidade do cliente',
      'Ajustes finos antes do início do desenvolvimento'
    ]
  },
  {
    id: 'desenvolvimento',
    icon: 'terminal',
    modalColor: 'var(--surface-2)',
    title: 'Desenvolvimento',
    tag: 'Aqui o sistema começa a ganhar vida de verdade.',
    detail:
      'Com o contrato e o projeto aprovados, o time discute as melhores tecnologias e abordagens para aquele caso específico e começa o desenvolvimento. Cada decisão técnica é pensada pra sua operação, não pra um molde genérico.',
    highlights: [
      'Definição das tecnologias e abordagens ideais',
      'Início efetivo do desenvolvimento',
      'Atualizações frequentes ao longo do caminho'
    ]
  },
  {
    id: 'testes-com-o-cliente',
    icon: 'test',
    modalColor: 'var(--surface-2)',
    title: 'Testes com o cliente',
    tag: 'Você testa, valida e garante que está no caminho certo.',
    detail:
      'Antes da entrega final, o time roda uma fase de testes junto com você. É o momento de ver o sistema funcionando de verdade e confirmar se está alinhado com o que foi pedido, com espaço pra ajustes finos antes de ir pro ar.',
    highlights: [
      'Testes conduzidos junto com o cliente',
      'Validação se o resultado está alinhado ao que foi pedido',
      'Ajustes finais antes da entrega'
    ]
  },
  {
    id: 'entrega-final',
    icon: 'launch',
    modalColor: 'var(--surface-2)',
    title: 'Entrega final e suporte',
    tag: 'Sistema no ar, com a gente ao seu lado depois disso.',
    detail:
      'Sistema publicado e funcionando na sua operação. Mas nosso trabalho não termina aí: seguimos disponíveis pra manutenção, correções e evolução do que foi entregue, porque cada sistema que a gente desenvolve, a gente também mantém.',
    highlights: [
      'Sistema publicado e em produção',
      'Suporte contínuo depois da entrega',
      'Manutenção corretiva, evolutiva e preventiva'
    ]
  }
];
