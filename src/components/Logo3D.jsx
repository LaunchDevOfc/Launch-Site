import { Suspense, lazy } from 'react';
import { useInView } from '../hooks/useInView.js';

// O three.js pesa mais que todo o resto do site somado, e serve só a esta seção:
// o import dinâmico o mantém num chunk separado, baixado quando a seção se aproxima.
const Logo3DStage = lazy(() => import('./Logo3DStage.jsx'));

export default function Logo3D() {
  const [sectionRef, inView] = useInView();

  return (
    <section className="logo-3d-demo" id="teste-3d" aria-labelledby="logo-3d-title" ref={sectionRef}>
      <div className="wrap">
        <div className="eyebrow">Experimento visual</div>
        <h2 id="logo-3d-title">Launch em outra dimensão.</h2>
        <p>Mova o cursor sobre o símbolo para explorar o volume e a iluminação.</p>
        <Suspense fallback={<div className="logo-3d-stage" />}>
          {inView ? <Logo3DStage /> : <div className="logo-3d-stage" />}
        </Suspense>
      </div>
    </section>
  );
}
