import { useState } from 'react';

/**
 * Acompanha o carregamento da imagem de um serviço. Enquanto os arquivos não
 * estiverem em public/img/servicos/, o `error` mantém o painel reservado no
 * lugar, em vez de mostrar ícone de imagem quebrada.
 *
 * O resultado fica guardado junto do `src` a que pertence: trocar de imagem
 * volta a 'loading' sem precisar de efeito. (Um efeito que zerasse o estado
 * rodaria depois do `load` de imagens em cache e as deixaria presas invisíveis.)
 */
export function useImageState(src) {
  const [result, setResult] = useState({ src: null, state: 'loading' });
  const state = result.src === src ? result.state : 'loading';

  return {
    state,
    imgProps: {
      onLoad: () => setResult({ src, state: 'loaded' }),
      onError: () => setResult({ src, state: 'error' })
    }
  };
}
