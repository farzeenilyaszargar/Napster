"use client";

import { useEffect, useRef } from "react";

type PixelShimmerTextProps = {
  text: string;
  className?: string;
};

type MaskData = {
  cellSize: number;
  pixelSize: number;
  pixelInset: number;
  columns: number;
  rows: number;
  width: number;
  height: number;
  mask: Uint8Array;
  values: Float32Array;
  targets: Float32Array;
  nextShiftAt: Float32Array;
};

const MIN_SHADE = 0;
const MAX_SHADE = 170;

function randomShade() {
  return MIN_SHADE + Math.random() * (MAX_SHADE - MIN_SHADE);
}

function getCanvasFont(style: CSSStyleDeclaration) {
  if (style.font) {
    return style.font;
  }

  return [
    style.fontStyle,
    style.fontVariant,
    style.fontWeight,
    style.fontSize,
    style.fontFamily,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildMask(
  width: number,
  height: number,
  text: string,
  style: CSSStyleDeclaration,
): MaskData | null {
  const safeWidth = Math.max(1, Math.ceil(width));
  const safeHeight = Math.max(1, Math.ceil(height));
  const fontSize = Number.parseFloat(style.fontSize) || 128;
  const cellSize = Math.min(12, Math.max(8, Math.round(fontSize / 16)));
  const pixelGap = Math.max(1, Math.round(cellSize * 0.12));
  const pixelSize = Math.max(1, cellSize - pixelGap);
  const pixelInset = (cellSize - pixelSize) / 2;
  const columns = Math.ceil(safeWidth / cellSize);
  const rows = Math.ceil(safeHeight / cellSize);

  const offscreen = document.createElement("canvas");
  offscreen.width = safeWidth;
  offscreen.height = safeHeight;

  const context = offscreen.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return null;
  }

  context.clearRect(0, 0, safeWidth, safeHeight);
  context.font = getCanvasFont(style);
  context.textBaseline = "top";
  context.textAlign = "left";
  context.fillStyle = "#fff";
  context.fillText(text, 0, 0);

  const imageData = context.getImageData(0, 0, safeWidth, safeHeight);
  const mask = new Uint8Array(columns * rows);
  const values = new Float32Array(columns * rows);
  const targets = new Float32Array(columns * rows);
  const nextShiftAt = new Float32Array(columns * rows);

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const startX = column * cellSize;
      const startY = row * cellSize;
      const endX = Math.min(startX + cellSize, safeWidth);
      const endY = Math.min(startY + cellSize, safeHeight);

      let alphaTotal = 0;
      let samples = 0;

      for (let y = startY; y < endY; y += 1) {
        for (let x = startX; x < endX; x += 1) {
          alphaTotal += imageData.data[(y * safeWidth + x) * 4 + 3];
          samples += 1;
        }
      }

      const index = row * columns + column;
      const coverage = samples === 0 ? 0 : alphaTotal / (samples * 255);

      if (coverage > 0.18) {
        mask[index] = 1;
        const shade = randomShade();
        values[index] = shade;
        targets[index] = shade;
        nextShiftAt[index] = Math.random() * 900;
      }
    }
  }

  return {
    cellSize,
    pixelSize,
    pixelInset,
    columns,
    rows,
    width: safeWidth,
    height: safeHeight,
    mask,
    values,
    targets,
    nextShiftAt,
  };
}

export default function PixelShimmerText({
  text,
  className = "",
}: PixelShimmerTextProps) {
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskRef = useRef<MaskData | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const measureElement = measureRef.current;
    const canvas = canvasRef.current;

    if (!measureElement || !canvas) {
      return undefined;
    }

    let cancelled = false;

    const paintFrame = (timestamp: number) => {
      const currentMask = maskRef.current;
      const currentCanvas = canvasRef.current;

      if (!currentMask || !currentCanvas) {
        return;
      }

      const context = currentCanvas.getContext("2d");
      if (!context) {
        return;
      }

      context.clearRect(0, 0, currentMask.width, currentMask.height);

      for (let row = 0; row < currentMask.rows; row += 1) {
        for (let column = 0; column < currentMask.columns; column += 1) {
          const index = row * currentMask.columns + column;
          if (currentMask.mask[index] !== 1) {
            continue;
          }

          if (timestamp >= currentMask.nextShiftAt[index]) {
            currentMask.targets[index] = randomShade();
            currentMask.nextShiftAt[index] =
              timestamp + 240 + Math.random() * 1000;
          }

          const nextValue =
            currentMask.values[index] +
            (currentMask.targets[index] - currentMask.values[index]) * 0.08;
          currentMask.values[index] = nextValue;

          const shade = Math.round(nextValue);
          context.fillStyle = `rgba(${shade}, ${shade}, ${shade}, 0.96)`;
          context.fillRect(
            column * currentMask.cellSize + currentMask.pixelInset,
            row * currentMask.cellSize + currentMask.pixelInset,
            currentMask.pixelSize,
            currentMask.pixelSize,
          );
        }
      }
    };

    const render = () => {
      const rect = measureElement.getBoundingClientRect();
      const width = Math.ceil(rect.width);
      const height = Math.ceil(rect.height);

      if (!width || !height) {
        return;
      }

      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(width * devicePixelRatio));
      canvas.height = Math.max(1, Math.round(height * devicePixelRatio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      context.imageSmoothingEnabled = false;

      const mask = buildMask(
        width,
        height,
        text,
        window.getComputedStyle(measureElement),
      );
      maskRef.current = mask;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const animate = (timestamp: number) => {
        if (cancelled) {
          return;
        }

        paintFrame(timestamp);
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => {
      render();
    });

    resizeObserver.observe(measureElement);

    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        if (!cancelled) {
          render();
        }
      });
    } else {
      render();
    }

    return () => {
      cancelled = true;
      resizeObserver.disconnect();

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [text]);

  return (
    <h2 className={`relative ${className}`}>
      <span className="sr-only">{text}</span>
      <span
        ref={measureRef}
        aria-hidden="true"
        className="invisible block whitespace-pre"
      >
        {text}
      </span>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 block h-full w-full"
      />
    </h2>
  );
}
