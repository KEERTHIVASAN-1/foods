import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

// Simplex noise implementation for organic motion
class SimplexNoise {
  private grad3: number[][];
  private p: number[];
  private perm: number[];
  private permMod12: number[];

  constructor() {
    this.grad3 = [
      [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
      [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
      [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ];
    this.p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
    this.perm = new Array(512);
    this.permMod12 = new Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  dot(g: number[], x: number, y: number): number {
    return g[0] * x + g[1] * y;
  }

  noise(xin: number, yin: number): number {
    const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    let i1, j1;
    if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2;
    const y2 = y0 - 1.0 + 2.0 * G2;
    const ii = i & 255;
    const jj = j & 255;
    const gi0 = this.permMod12[ii + this.perm[jj]];
    const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]];
    const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]];
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    let n0 = 0;
    if (t0 >= 0) {
      t0 *= t0;
      n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    let n1 = 0;
    if (t1 >= 0) {
      t1 *= t1;
      n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    let n2 = 0;
    if (t2 >= 0) {
      t2 *= t2;
      n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
    }
    return 70.0 * (n0 + n1 + n2);
  }
}

interface LiveWallpaperBackgroundProps {
  className?: string;
}

const LiveWallpaperBackground: React.FC<LiveWallpaperBackgroundProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const timeRef = useRef(0);
  const isActiveRef = useRef(true);
  const noiseRef = useRef(new SimplexNoise());
  const layersRef = useRef<{
    far: THREE.Group;
    mid: THREE.Group;
    near: THREE.Group;
    particles: THREE.Points;
  } | null>(null);

  // Smooth interpolation (lerp)
  const lerp = useCallback((start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  }, []);

  // Clamp value to prevent excessive movement
  const clamp = useCallback((value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
  }, []);

  // Handle mouse movement for parallax
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normalizedY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    
    // Clamp to prevent nausea-inducing movement - gentler
    mouseRef.current.targetX = clamp(normalizedX * 0.3, -0.3, 0.3);
    mouseRef.current.targetY = clamp(normalizedY * 0.3, -0.3, 0.3);
  }, [clamp]);

  // Handle visibility change for performance
  const handleVisibilityChange = useCallback(() => {
    isActiveRef.current = !document.hidden;
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a); // Dark neutral background
    sceneRef.current = scene;
    
    // Disable frustum culling to prevent square boundaries
    scene.frustumCulled = false;

    // Camera setup - wider FOV for seamless background
    const camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup (GPU-accelerated)
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
    // Enable smooth rendering
    renderer.setClearColor(0x1a1a1a, 1);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create layered depth system
    const layers = {
      far: new THREE.Group(),
      mid: new THREE.Group(),
      near: new THREE.Group(),
      particles: new THREE.Points()
    };
    layersRef.current = layers;

    // Far layer: Slow-moving gradient blobs (background)
    const farGeometry = new THREE.BufferGeometry();
    const farCount = 12;
    const farPositions = new Float32Array(farCount * 3);
    const farSizes = new Float32Array(farCount);
    const farColors = new Float32Array(farCount * 3);

    for (let i = 0; i < farCount; i++) {
      const i3 = i * 3;
      // Spread particles for seamless coverage
      farPositions[i3] = (Math.random() - 0.5) * 50;
      farPositions[i3 + 1] = (Math.random() - 0.5) * 50;
      farPositions[i3 + 2] = -15 - Math.random() * 12;
      farSizes[i] = 6 + Math.random() * 8;
      
      // Warm tones: soft orange, coral, amber
      const hue = 0.08 + Math.random() * 0.1; // Orange to coral range
      const sat = 0.3 + Math.random() * 0.2; // Low saturation
      const light = 0.3 + Math.random() * 0.2; // Brighter
      const color = new THREE.Color().setHSL(hue, sat, light);
      farColors[i3] = color.r;
      farColors[i3 + 1] = color.g;
      farColors[i3 + 2] = color.b;
    }

    farGeometry.setAttribute('position', new THREE.BufferAttribute(farPositions, 3));
    farGeometry.setAttribute('size', new THREE.BufferAttribute(farSizes, 1));
    farGeometry.setAttribute('color', new THREE.BufferAttribute(farColors, 3));

    const farMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.4 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;
        uniform float time;
        uniform float opacity;
        void main() {
          vColor = color;
          vOpacity = opacity;
          vec3 pos = position;
          pos.x += sin(time * 0.15 + position.z * 0.1) * 0.8;
          pos.y += cos(time * 0.12 + position.z * 0.1) * 0.8;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (350.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          // Create perfect circle by checking distance from center
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          // Smooth circular falloff - perfect circle shape
          float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * vOpacity;
          // Discard pixels outside circle to ensure perfect circle
          if (dist > 0.5) discard;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const farPoints = new THREE.Points(farGeometry, farMaterial);
    layers.far.add(farPoints);

    // Mid layer: Medium response particles
    const midGeometry = new THREE.BufferGeometry();
    const midCount = 18;
    const midPositions = new Float32Array(midCount * 3);
    const midSizes = new Float32Array(midCount);
    const midColors = new Float32Array(midCount * 3);

    for (let i = 0; i < midCount; i++) {
      const i3 = i * 3;
      // Spread particles for seamless coverage
      midPositions[i3] = (Math.random() - 0.5) * 40;
      midPositions[i3 + 1] = (Math.random() - 0.5) * 40;
      midPositions[i3 + 2] = -8 - Math.random() * 6;
      midSizes[i] = 5 + Math.random() * 6;
      
      const hue = 0.06 + Math.random() * 0.12;
      const sat = 0.4 + Math.random() * 0.2;
      const light = 0.35 + Math.random() * 0.25;
      const color = new THREE.Color().setHSL(hue, sat, light);
      midColors[i3] = color.r;
      midColors[i3 + 1] = color.g;
      midColors[i3 + 2] = color.b;
    }

    midGeometry.setAttribute('position', new THREE.BufferAttribute(midPositions, 3));
    midGeometry.setAttribute('size', new THREE.BufferAttribute(midSizes, 1));
    midGeometry.setAttribute('color', new THREE.BufferAttribute(midColors, 3));

    const midMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.5 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;
        uniform float time;
        uniform float opacity;
        void main() {
          vColor = color;
          vOpacity = opacity;
          vec3 pos = position;
          pos.x += sin(time * 0.2 + position.z * 0.15) * 1.0;
          pos.y += cos(time * 0.18 + position.z * 0.15) * 1.0;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (350.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          // Create perfect circle by checking distance from center
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          // Smooth circular falloff - perfect circle shape
          float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * vOpacity;
          // Discard pixels outside circle to ensure perfect circle
          if (dist > 0.5) discard;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const midPoints = new THREE.Points(midGeometry, midMaterial);
    layers.mid.add(midPoints);

    // Near layer: Foreground glow points
    const nearGeometry = new THREE.BufferGeometry();
    const nearCount = 20;
    const nearPositions = new Float32Array(nearCount * 3);
    const nearSizes = new Float32Array(nearCount);
    const nearColors = new Float32Array(nearCount * 3);

    for (let i = 0; i < nearCount; i++) {
      const i3 = i * 3;
      // Spread particles for seamless coverage
      nearPositions[i3] = (Math.random() - 0.5) * 35;
      nearPositions[i3 + 1] = (Math.random() - 0.5) * 35;
      nearPositions[i3 + 2] = -3 - Math.random() * 4;
      nearSizes[i] = 4 + Math.random() * 5;
      
      const hue = 0.05 + Math.random() * 0.15;
      const sat = 0.5 + Math.random() * 0.2;
      const light = 0.4 + Math.random() * 0.3;
      const color = new THREE.Color().setHSL(hue, sat, light);
      nearColors[i3] = color.r;
      nearColors[i3 + 1] = color.g;
      nearColors[i3 + 2] = color.b;
    }

    nearGeometry.setAttribute('position', new THREE.BufferAttribute(nearPositions, 3));
    nearGeometry.setAttribute('size', new THREE.BufferAttribute(nearSizes, 1));
    nearGeometry.setAttribute('color', new THREE.BufferAttribute(nearColors, 3));

    const nearMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.6 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;
        uniform float time;
        uniform float opacity;
        void main() {
          vColor = color;
          vOpacity = opacity;
          vec3 pos = position;
          pos.x += sin(time * 0.25 + position.z * 0.2) * 1.2;
          pos.y += cos(time * 0.22 + position.z * 0.2) * 1.2;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (350.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          // Create perfect circle by checking distance from center
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          // Smooth circular falloff - perfect circle shape
          float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * vOpacity;
          // Discard pixels outside circle to ensure perfect circle
          if (dist > 0.5) discard;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const nearPoints = new THREE.Points(nearGeometry, nearMaterial);
    layers.near.add(nearPoints);

    // Add all layers to scene
    scene.add(layers.far);
    scene.add(layers.mid);
    scene.add(layers.near);

    // Animation loop with performance optimization
    const animate = () => {
      if (!isActiveRef.current) {
        // Reduce motion when tab is inactive
        timeRef.current += 0.01;
      } else {
        timeRef.current += 0.015; // Slower, smoother animation
      }

      // Smooth mouse interpolation (lerp) - slower for smoother movement
      mouseRef.current.x = lerp(mouseRef.current.x, mouseRef.current.targetX, 0.02);
      mouseRef.current.y = lerp(mouseRef.current.y, mouseRef.current.targetY, 0.02);

      // Apply parallax to camera (creates depth illusion) - smoother
      if (camera) {
        camera.position.x = mouseRef.current.x * 2;
        camera.position.y = mouseRef.current.y * 2;
        camera.lookAt(0, 0, 0);
      }

      // Update layer materials with time
      if (layers.far.children[0]) {
        const farMat = (layers.far.children[0] as THREE.Points).material as THREE.ShaderMaterial;
        farMat.uniforms.time.value = timeRef.current * (isActiveRef.current ? 1 : 0.3);
      }
      if (layers.mid.children[0]) {
        const midMat = (layers.mid.children[0] as THREE.Points).material as THREE.ShaderMaterial;
        midMat.uniforms.time.value = timeRef.current * (isActiveRef.current ? 1 : 0.3);
      }
      if (layers.near.children[0]) {
        const nearMat = (layers.near.children[0] as THREE.Points).material as THREE.ShaderMaterial;
        nearMat.uniforms.time.value = timeRef.current * (isActiveRef.current ? 1 : 0.3);
      }

      // Render
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (renderer) {
        renderer.dispose();
        if (container && renderer.domElement) {
          container.removeChild(renderer.domElement);
        }
      }
      
      // Dispose geometries and materials
      [layers.far, layers.mid, layers.near].forEach(layer => {
        layer.traverse((child) => {
          if (child instanceof THREE.Points) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
      });
    };
  }, [handleMouseMove, handleVisibilityChange, lerp]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-full z-0 pointer-events-none ${className}`}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    />
  );
};

export default LiveWallpaperBackground;

