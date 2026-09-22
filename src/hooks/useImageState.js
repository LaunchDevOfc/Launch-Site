import { useEffect, useState } from 'react';

/**
 * Acompanha o carregamento da imagem de um serviço. Enquanto os arquivos não
 * estiverem em public/img/servicos/, o `error` mantém o painel reservado no
 * lugar, em vez de mostrar ícone de imagem quebrada.
 */
export function useImageState(src) {
  const [state, setState] = useState('loading');

  useEffect(() => setState('loading'), [src]);

  return {
    state,
    imgProps: {
      onLoad: () => setState('loaded'),
      onError: () => setState('error')
    }
  };
}
