"use client";

import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";
// import { log } from "three/examples/jsm/nodes/Nodes.js";

const StarBackground: React.FC<any> = (props) => {
  const ref = useRef<any>(null);
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5001), { radius: 0.9 })
  );
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });
  
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#fff"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false} 
        />
      </Points>
    </group>
  );
};

function StarsCanvas() {
  return (
    <div className="w-full h-auto fixed inset-0 z-[0]  ">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <StarBackground />
        </Suspense>
      </Canvas>
    </div>
  )
};

export default StarsCanvas
