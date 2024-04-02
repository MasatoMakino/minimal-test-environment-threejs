import { WebGLRenderer } from "three";
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
});
