import { useEffect, useRef } from 'react';

interface DNAExtractionSimulationProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

export default function DNAExtractionSimulation({ currentStep }: DNAExtractionSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw based on current step
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#1f2937';

    switch (currentStep) {
      case 0:
        drawSetupEquipment(ctx, canvas);
        break;
      case 1:
        drawPrepareSample(ctx, canvas);
        break;
      case 2:
        drawExtractDNA(ctx, canvas);
        break;
      case 3:
        drawCollectObserve(ctx, canvas);
        break;
      default:
        break;
    }
  }, [currentStep]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full border-2 border-gray-300 rounded-lg"
        style={{ height: '400px' }}
      />
    </div>
  );
}

function drawSetupEquipment(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Title
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('Step 1: Setup Equipment', centerX - 120, 30);
  ctx.font = '14px sans-serif';

  // Draw beaker
  drawBeaker(ctx, centerX - 180, centerY - 50, 60, 100);
  ctx.fillText('Beaker', centerX - 200, centerY + 80);

  // Draw cheesecloth
  drawCheesecloth(ctx, centerX, centerY - 50, 50, 60);
  ctx.fillText('Cheesecloth', centerX - 40, centerY + 80);

  // Draw stirring rod
  drawStirringRod(ctx, centerX + 180, centerY - 50, 10, 100);
  ctx.fillText('Glass Rod', centerX + 140, centerY + 80);

  // Instructions
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('✓ Prepare a clear glass or beaker', 20, canvas.height - 50);
  ctx.fillText('✓ Gather cheesecloth or coffee filter', 20, canvas.height - 30);
  ctx.fillText('✓ Get a glass rod for stirring', 20, canvas.height - 10);
}

function drawPrepareSample(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Title
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('Step 2: Prepare Sample', centerX - 100, 30);
  ctx.font = '14px sans-serif';

  // Draw blender
  drawBlender(ctx, centerX - 100, centerY - 80, 80, 120);
  ctx.fillText('Blender', centerX - 140, centerY + 80);

  // Draw filter
  drawFilter(ctx, centerX + 120, centerY - 60, 60, 80);
  ctx.fillText('Filtering', centerX + 90, centerY + 80);

  // Animation lines
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(centerX - 30, centerY);
  ctx.lineTo(centerX + 50, centerY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Instructions
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('✓ Measure ~50g of sample and blend with water', 20, canvas.height - 50);
  ctx.fillText('✓ Blend for 15 seconds to break down cell walls', 20, canvas.height - 30);
  ctx.fillText('✓ Filter through cheesecloth into container', 20, canvas.height - 10);
}

function drawExtractDNA(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Title
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('Step 3: Extract DNA', centerX - 100, 30);
  ctx.font = '14px sans-serif';

  // Draw test tube with solution
  drawTestTube(ctx, centerX - 150, centerY - 80, 50, 140);

  // Draw ethanol being added
  drawLiquidPouring(ctx, centerX - 80, centerY - 100);

  // Draw result with precipitate
  drawTestTubeWithDNA(ctx, centerX + 80, centerY - 80, 50, 140);

  // Animation arrow
  ctx.fillStyle = '#3b82f6';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('→', centerX + 10, centerY);

  // Instructions
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('✓ Add extraction buffer to sample', 20, canvas.height - 50);
  ctx.fillText('✓ Add cold ethanol slowly - white precipitate forms', 20, canvas.height - 30);
  ctx.fillText('✓ This white precipitate is DNA!', 20, canvas.height - 10);
}

function drawCollectObserve(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Title
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('Step 4: Collect & Observe', centerX - 110, 30);
  ctx.font = '14px sans-serif';

  // Draw final result
  drawTestTubeWithDNA(ctx, centerX, centerY - 60, 50, 120);
  ctx.fillText('Extracted DNA', centerX - 60, centerY + 100);

  // Draw observations box
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, canvas.height - 110, canvas.width - 40, 80);
  ctx.fillStyle = '#d1fae5';
  ctx.fillRect(20, canvas.height - 110, canvas.width - 40, 80);

  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('Observations:', 30, canvas.height - 90);
  ctx.font = '11px sans-serif';
  ctx.fillText('• DNA appears as white strands or clumps', 30, canvas.height - 70);
  ctx.fillText('• Can be spooled out with glass rod', 30, canvas.height - 55);
  ctx.fillText('• Preserved in buffer solution for storage', 30, canvas.height - 40);
}

// Helper drawing functions
function drawBeaker(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#dbeafe';

  // Beaker body
  ctx.beginPath();
  ctx.moveTo(x + 5, y);
  ctx.lineTo(x + width + 5, y);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Liquid inside
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 2, y + height - 20, width - 4, 18);
}

function drawCheesecloth(ctx: CanvasRenderingContext2D, x: number, y: number, _w: number, h: number) {
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#fed7aa';

  const width = _w;

  // Triangle shape
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width / 2, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Weave pattern
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(x + (i * width) / 5, y);
    ctx.lineTo(x + (i * width) / 5 + width / 10, y + h);
    ctx.stroke();
  }
}


function drawStirringRod(ctx: CanvasRenderingContext2D, x: number, y: number, _w: number, h: number) {
  ctx.strokeStyle = '#6b7280';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + h);
  ctx.stroke();

  // Knob at top
  ctx.fillStyle = '#4b5563';
  ctx.beginPath();
  ctx.arc(x, y - 5, 8, 0, Math.PI * 2);
  ctx.fill();
}

function drawBlender(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2;

  // Base
  ctx.fillStyle = '#9ca3af';
  ctx.fillRect(x, y + h - 20, w, 20);
  ctx.strokeRect(x, y + h - 20, w, 20);

  // Pitcher
  ctx.fillStyle = '#dbeafe';
  ctx.beginPath();
  ctx.moveTo(x + 10, y + h - 20);
  ctx.lineTo(x + w - 10, y + h - 20);
  ctx.lineTo(x + w - 5, y + 20);
  ctx.lineTo(x + 5, y + 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Blades
  ctx.fillStyle = '#6b7280';
  ctx.fillRect(x + w / 2 - 8, y + h - 30, 16, 10);
}

function drawFilter(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#fed7aa';

  // Filter cone
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w / 2, y + h * 0.7);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Spout
  ctx.beginPath();
  ctx.moveTo(x + w / 2 - 5, y + h * 0.7);
  ctx.lineTo(x + w / 2 - 3, y + h);
  ctx.lineTo(x + w / 2 + 3, y + h);
  ctx.lineTo(x + w / 2 + 5, y + h * 0.7);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawTestTube(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#dbeafe';

  // Tube
  ctx.beginPath();
  ctx.moveTo(x, y + 10);
  ctx.lineTo(x, y + h - 10);
  ctx.quadraticCurveTo(x, y + h, x + w / 2, y + h);
  ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - 10);
  ctx.lineTo(x + w, y + 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Liquid
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(x + 2, y + h - 20);
  ctx.lineTo(x + 2, y + h - 10);
  ctx.quadraticCurveTo(x + 2, y + h - 2, x + w / 2, y + h - 2);
  ctx.quadraticCurveTo(x + w - 2, y + h - 2, x + w - 2, y + h - 10);
  ctx.lineTo(x + w - 2, y + h - 20);
  ctx.closePath();
  ctx.fill();
}

function drawLiquidPouring(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 30);
  ctx.stroke();

  // Droplet
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(x, y + 35, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawTestTubeWithDNA(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#dbeafe';

  // Tube
  ctx.beginPath();
  ctx.moveTo(x, y + 10);
  ctx.lineTo(x, y + h - 10);
  ctx.quadraticCurveTo(x, y + h, x + w / 2, y + h);
  ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - 10);
  ctx.lineTo(x + w, y + 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // DNA precipitate (white strands)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(x + w / 2 + Math.sin(i) * 8, y + h - 30);
    ctx.lineTo(x + w / 2 + Math.sin(i) * 8, y + h - 20 + Math.sin(i) * 5);
    ctx.stroke();
  }

  // Highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.arc(x + w / 4, y + 20, 5, 0, Math.PI * 2);
  ctx.fill();
}
