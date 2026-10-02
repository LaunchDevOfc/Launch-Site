import { useEffect, useState } from 'react';
import { m } from 'motion/react';

const questions = [
  {
    question: 'Que tipo de software a Launch desenvolve?',
    answer: 'A Launch é uma empresa de desenvolvimento de software que cria soluções digitais sob medida para empresas. Isso inclui sistemas web personalizados, ferramentas internas, automação de processos e produtos pensados para a rotina real de cada operação.'
  },
  {
    question: 'Vocês desenvolvem sistemas personalizados para empresas?',
    answer: 'Sim. Desenvolvemos sistemas personalizados que podem centralizar informações, organizar fluxos de trabalho e substituir controles manuais espalhados entre planilhas e ferramentas. O escopo parte das necessidades e dos processos da sua empresa.'
  },
  {
    question: 'Como funciona o desenvolvimento de um projeto sob medida?',
    answer: 'Começamos entendendo o contexto, os objetivos e os pontos que hoje dificultam a operação. A partir disso, a Launch define o caminho do projeto, constrói a solução por etapas e mantém a conversa próxima de quem vai usar o sistema.'
  },
  {
    question: 'Quanto custa desenvolver um sistema ou solução digital?',
    answer: 'O investimento depende da complexidade, das funcionalidades, das integrações e do escopo necessário para o projeto. Depois de entender a sua necessidade, preparamos um orçamento personalizado e claro para a solução.'
  },
  {
    question: 'Quanto tempo leva para desenvolver um projeto?',
    answer: 'O prazo varia conforme o tamanho do sistema, as decisões necessárias e as integrações envolvidas. Organizamos o desenvolvimento em etapas para que você tenha visibilidade sobre o que está sendo construído e sobre os próximos passos.'
  },
  {
    question: 'É possível automatizar processos da minha empresa com inteligência artificial?',
    answer: 'Sim. A Launch cria automações de processos e soluções com inteligência artificial quando elas ajudam a reduzir tarefas repetitivas, acelerar respostas ou organizar informações. A tecnologia é aplicada com foco no ganho prático da operação, não apenas pela novidade.'
  },
  {
    question: 'A Launch desenvolve chatbots e atendimento com IA?',
    answer: 'Desenvolvemos chatbots e fluxos de atendimento com IA para qualificar contatos, responder dúvidas recorrentes e encaminhar cada conversa de forma mais organizada. Quando necessário, o atendimento continua naturalmente com a equipe responsável.'
  },
  {
    question: 'Vocês desenvolvem landing pages e dashboards personalizados?',
    answer: 'Sim. Criamos landing pages para apresentar uma oferta com clareza e dashboards personalizados para transformar dados da operação em painéis de gestão úteis. Cada entrega é adaptada à identidade, ao público e às decisões que a empresa precisa tomar.'
  },
  {
    question: 'Posso solicitar uma solução que não aparece entre os serviços do site?',
    answer: 'Pode. Os serviços apresentados mostram caminhos frequentes, mas a Launch também desenvolve software para empresas com necessidades específicas, como orçamentos digitais personalizados e sistemas para automatizar processos empresariais. Conte o que você precisa resolver para avaliarmos a melhor solução.'
  }
];

function ToggleIcon({ open }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      {open ? <><path d="m5.75 5.75 8.5 8.5" /><path d="m14.25 5.75-8.5 8.5" /></> : <><path d="M4 10h12" /><path d="M10 4v12" /></>}
    </svg>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => setEnhanced(true), []);

  return (
    <section className="section faq-section theme-light" id="perguntas-frequentes" aria-labelledby="faq-title">
      <svg className="faq-background-flow" viewBox="0 0 1200 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path className="faq-background-flow-line faq-background-flow-line--blue" d="M-80 168 C 116 48 274 284 492 170 S 878 82 1280 210" />
        <path className="faq-background-flow-line faq-background-flow-line--gray" d="M-100 204 C 126 84 300 326 526 210 S 906 122 1300 250" />
        <path className="faq-background-flow-line faq-background-flow-line--blue faq-background-flow-line--soft" d="M-70 790 C 160 660 350 918 604 796 S 988 684 1280 818" />
        <path className="faq-background-flow-line faq-background-flow-line--gray faq-background-flow-line--soft" d="M-90 834 C 138 702 382 960 642 844 S 1010 734 1300 870" />
        <path className="faq-background-flow-line faq-background-flow-line--gray faq-background-flow-line--middle" d="M-80 488 C 190 368 360 582 600 488 S 1000 374 1280 506" />
      </svg>
      <div className="wrap faq-layout">
        <header className="faq-intro" data-reveal>
          <h2 className="section-title" id="faq-title">Antes de colocar sua ideia em <span>movimento.</span></h2>
          <p>Reunimos aqui o que costuma surgir nas primeiras conversas com a Launch.</p>
        </header>

        <div className="faq-accordion" data-reveal data-reveal-delay="60">
          {questions.map((item, index) => {
            const open = openIndex === index;
            const buttonId = `faq-question-${index + 1}`;
            const panelId = `faq-answer-${index + 1}`;

            return (
              <article className={`faq-item${open ? ' is-open' : ''}`} key={item.question}>
                <h3>
                  <button
                    className="faq-trigger"
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? -1 : index)}
                  >
                    <span className="faq-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span className="faq-question">{item.question}</span>
                    <span className="faq-icon"><ToggleIcon open={open} /></span>
                  </button>
                </h3>
                <m.div
                  className="faq-answer"
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={enhanced ? !open : undefined}
                  initial={false}
                  animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.24, ease: [.16, 1, .3, 1] }}
                >
                  <p>{item.answer}</p>
                </m.div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
