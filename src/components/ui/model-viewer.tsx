"use clinet";
import React, { Suspense } from "react";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Sky, Html } from "@react-three/drei";

const ModelViewer = ({ gltfModelUrl }: { gltfModelUrl: string }) => {
  return (
    <Canvas style={{ width: "100%", height: "100%" }}>
      <PerspectiveCamera makeDefault position={[2, 0, -0.1]} />
      <OrbitControls />
      <Suspense fallback={<div>Loading...</div>}>
        <Model gltfUrl={gltfModelUrl} />
        <ambientLight intensity={1.5} />
      </Suspense>
    </Canvas>
  );
};
const Model = ({ gltfUrl }: { gltfUrl: string }) => {
  const [gltf, setGltf] = React.useState<GLTF | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const loader = new GLTFLoader();

    loader.load(
      gltfUrl,
      (loadedGltf) => {
        setGltf(loadedGltf);
      },
      // Optional progress callback
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (err: any) => {
        setError(err);
        console.error("Error loading GLTF:", err);
      }
    );
  }, [gltfUrl]); // Re-run useEffect on gltfUrl change

  if (error) {
    return (
      <Html transform={false} style={{ position: "relative", zIndex: 10 }}>
        {" "}
        <div
          className="html-label"
          style={{
            display: "flex", // Use flexbox for centering
            justifyContent: "center", // Center horizontally
            alignItems: "center", // Center vertically
            textWrap: "nowrap",
            position: "absolute",
            left: -100,
            zIndex: 10,
          }}
        >
          preview blocked by browser
        </div>
      </Html>
    );
  }

  if (!gltf) {
    return <Html>Loading...</Html>;
  }

  return <primitive object={gltf.scene} />;
};

export default ModelViewer;
