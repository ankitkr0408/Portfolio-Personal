"use client";

import Spline from "@splinetool/react-spline/next";

const SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export default function SplineRobot() {
  return (
    <div className="absolute inset-0">
      <Spline scene={SCENE_URL} />
    </div>
  );
}
