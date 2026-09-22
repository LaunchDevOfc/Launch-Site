import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

// O contorno vem de public/launch-logo1.svg: o SVGLoader precisa buscá-lo por
// URL, então ele fica fora do pipeline de assets do Vite.
const LOGO_URL = '/launch-logo1.svg';

// Só o canvas: a casca da seção fica em Logo3D.jsx, que carrega este módulo
// (e o three.js junto) sob demanda.
export default function Logo3DStage() {
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0, 7.6);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    stage.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.order = 'YXZ';
    scene.add(group);
    scene.add(new THREE.HemisphereLight(0xffe8e8, 0x120307, 1.8));
    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(-3, 4, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xff2436, 1.1);
    fill.position.set(4, -1, 2);
    scene.add(fill);

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xe60020,
      metalness: 0.24,
      roughness: 0.3,
      clearcoat: 0.45,
      clearcoatRoughness: 0.2
    });
    const bevel = {
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.055,
      bevelSize: 0.045,
      bevelSegments: 3,
      curveSegments: 2
    };

    let hasModel = false;
    let disposed = false;

    new SVGLoader().load(
      LOGO_URL,
      (data) => {
        if (disposed) return;
        data.paths.forEach((path) => {
          SVGLoader.createShapes(path).forEach((shape) => {
            const geometry = new THREE.ExtrudeGeometry(shape, bevel);
            geometry.computeVertexNormals();
            const item = new THREE.Mesh(geometry, material);
            item.castShadow = true;
            item.receiveShadow = true;
            group.add(item);
          });
        });

        // O SVG usa coordenadas de tela (Y para baixo). Invertemos somente o eixo Y
        // e redimensionamos pelo bounding box para manter o símbolo centralizado.
        const rawBounds = new THREE.Box3().setFromObject(group);
        const rawCenter = rawBounds.getCenter(new THREE.Vector3());
        const rawSize = rawBounds.getSize(new THREE.Vector3());
        const scale = 2.5 / rawSize.x;
        // O contorno precisa ser normalizado em X/Y, mas a profundidade deve
        // permanecer em unidades próprias para continuar visível ao girar.
        group.scale.set(scale, -scale, 1);
        group.position.set(-rawCenter.x * scale, rawCenter.y * scale, -rawCenter.z);
        hasModel = true;
        resize();
      },
      undefined,
      (error) => {
        console.error('Não foi possível carregar o contorno do logo 3D.', error);
      }
    );

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    function onPointerMove(event) {
      if (reduced.matches || !finePointer.matches || event.pointerType === 'touch') return;
      const rect = stage.getBoundingClientRect();
      targetY = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1) * 0.3;
      targetX = THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1) * 0.2;
    }
    function resetTarget() {
      targetX = 0;
      targetY = 0;
    }
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerleave', resetTarget);
    stage.addEventListener('pointercancel', resetTarget);

    function resize() {
      const width = Math.max(stage.clientWidth, 1);
      const height = Math.max(stage.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Mantém uma margem para que as extremidades continuem visíveis durante o tilt.
      if (!hasModel) return;
      const bounds = new THREE.Box3().setFromObject(group);
      const size = bounds.getSize(new THREE.Vector3());
      const verticalSpan = Math.max(size.y, size.x / camera.aspect);
      const margin = 1.28;
      camera.position.z =
        (verticalSpan * margin) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    }

    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    resize();

    function animate() {
      frame = requestAnimationFrame(animate);
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;
      group.rotation.x = currentX;
      group.rotation.y = currentY;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', resetTarget);
      stage.removeEventListener('pointercancel', resetTarget);
      group.traverse((object) => object.geometry?.dispose());
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      className="logo-3d-stage"
      ref={stageRef}
      aria-label="Logo Launch tridimensional interativo"
      role="img"
    />
  );
}
