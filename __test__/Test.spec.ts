import { WebGLRenderer, Scene, PerspectiveCamera } from "three";
import WebGPURenderer from "three/src/renderers/webgpu/WebGPURenderer.js";
import { describe, test, expect } from "vitest";

describe("Test", () => {
  test("2d context should be exist", () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    expect(context).toBeTruthy();
  });

  test("generate webgl renderer", () => {
    const renderer = new WebGLRenderer();
    renderer.setSize(640, 480);

    expect(renderer.getContext()).toBeTruthy();
    expect(renderer.domElement.width).toBe(640);
  });

  test("rendering webgl", () => {
    const renderer = new WebGLRenderer();
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, 640 / 480, 0.1, 1000);
    renderer.render(scene, camera);
  });

  test("generate webgpu renerer", () => {
    const renderer = new WebGPURenderer();
    renderer.setSize(640, 480);
    expect(renderer.domElement.width).toBe(640);
  });

  test("rendering webgpu", () => {
    const renderer = new WebGPURenderer();
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, 640 / 480, 0.1, 1000);
    renderer.renderAsync(scene, camera);
  });
});
