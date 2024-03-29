import { WebGLRenderer } from "three";
import { describe, test, expect } from "vitest";

describe("Test", () => {
  const canvas = document.createElement("canvas");

  test("2d context should be exist", () => {
    const context = canvas.getContext("2d");
    expect(context).toBeTruthy();
  });

  test("generate webgl context", () => {
    const gl = require("gl")(1, 1);
    expect(gl).toBeTruthy();
  });

  test("generate webgl renderer", () => {
    const gl = require("gl")(1, 1);
    const renderer = new WebGLRenderer({ context: gl, canvas: canvas });
    renderer.setSize(640, 480);

    expect(renderer.getContext()).toBeTruthy();
    expect(renderer.getContext()).toBe(gl);
    expect(renderer.domElement.width).toBe(640);
  });
});
