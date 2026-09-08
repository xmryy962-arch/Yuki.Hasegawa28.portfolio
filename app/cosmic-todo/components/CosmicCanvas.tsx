'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CelestialBody, Task, TaskCategory, TaskPriority, CATEGORY_CONFIG } from '../types';
import { soundManager } from '../utils/sound';

interface CosmicCanvasProps {
  completedTasks: Task[];
  universeLevel: number;
  onSelectCelestial: (celestial: CelestialBody) => void;
  selectedCelestialId: string | null;
  newCompletedTaskId: string | null;
  onAnimationFinish?: () => void;
}

interface BackgroundStar {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

interface NovaParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

export default function CosmicCanvas({
  completedTasks,
  universeLevel,
  onSelectCelestial,
  selectedCelestialId,
  newCompletedTaskId,
  onAnimationFinish,
}: CosmicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // マウスパララックス用
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const hoveredCelestialRef = useRef<CelestialBody | null>(null);
  const [hoveredInfo, setHoveredInfo] = useState<{ name: string; x: number; y: number; color: string } | null>(null);

  // 天体リストの保持
  const celestialsRef = useRef<CelestialBody[]>([]);

  // 新星爆発パーティクル
  const novaParticlesRef = useRef<NovaParticle[]>([]);

  // 流星リスト
  const shootingStarsRef = useRef<ShootingStar[]>([]);

  // 背景の微小な深宇宙星（タスクとは無関係な深宇宙のわずかな塵星）
  const bgStarsRef = useRef<BackgroundStar[]>([]);

  // 擬似乱数ジェネレータ（同一タスクで常に同じ座標・外見になるように）
  const pseudoRandom = (seed: string) => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
    }
    return () => {
      h = Math.imul(h ^ (h >>> 15), 1 | h);
      h = (h + Math.imul(h ^ (h >>> 7), 61 | h)) ^ h;
      return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
    };
  };

  // タスクリストから天体を生成・同期
  useEffect(() => {
    const updated: CelestialBody[] = completedTasks.map((task, index) => {
      const existing = celestialsRef.current.find((c) => c.taskId === task.id);
      if (existing) return existing;

      const rng = pseudoRandom(task.id + task.completedAt);
      const catConfig = CATEGORY_CONFIG[task.category];

      // 天体タイプの決定
      let type: CelestialBody['type'] = 'star';
      let size = 4 + rng() * 3;
      let hasRing = false;
      let moons: CelestialBody['moons'] = undefined;

      if (task.priority === 'high') {
        if (index % 2 === 0) {
          type = 'planet';
          size = 11 + rng() * 6;
          hasRing = rng() > 0.4;
          if (rng() > 0.5) {
            moons = [
              {
                distance: size + 10 + rng() * 12,
                size: 2.5 + rng() * 1.5,
                angle: rng() * Math.PI * 2,
                speed: (0.015 + rng() * 0.02) * (rng() > 0.5 ? 1 : -1),
                color: '#e2e8f0'
              }
            ];
          }
        } else {
          type = 'giant';
          size = 9 + rng() * 4;
        }
      } else if (task.priority === 'medium') {
        type = 'star';
        size = 5.5 + rng() * 3.5;
      } else {
        type = 'satellite';
        size = 3.5 + rng() * 2;
      }

      // 黄金螺旋または同心円状の美しい距離配置
      // 中心から近すぎず、遠すぎず
      const minRadius = 80;
      const spread = 28;
      const distance = minRadius + Math.sqrt(index + 1) * spread + (rng() - 0.5) * 35;
      const angle = (index * 2.39996) + rng() * 0.8; // ゴールデンアングルに近い配置

      // 公転速度 (内側ほど少し速く、外側ほどゆっくり)
      const baseSpeed = 0.0008;
      const orbitSpeed = (baseSpeed * (120 / distance)) * (rng() > 0.3 ? 1 : -1);

      return {
        id: `celestial-${task.id}`,
        taskId: task.id,
        taskTitle: task.title,
        category: task.category,
        priority: task.priority,
        completedAt: task.completedAt || new Date().toISOString(),
        type,
        angle,
        distance,
        orbitSpeed,
        size,
        color: catConfig.color,
        glowColor: catConfig.glow,
        twinkleSpeed: 0.02 + rng() * 0.04,
        twinklePhase: rng() * Math.PI * 2,
        hasRing,
        ringColor: catConfig.glow,
        ringRadius: size * 1.9,
        moons
      };
    });

    celestialsRef.current = updated;
  }, [completedTasks]);

  // 新タスク達成時のパーティクル爆発エフェクトトリガー
  useEffect(() => {
    if (!newCompletedTaskId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const target = celestialsRef.current.find((c) => c.taskId === newCompletedTaskId);
    const cat = target ? CATEGORY_CONFIG[target.category].color : '#38bdf8';

    // 中心から放射するスパークを生成
    const particles: NovaParticle[] = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;
      particles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        color: Math.random() > 0.3 ? cat : '#ffffff',
        alpha: 1,
        decay: 0.015 + Math.random() * 0.025
      });
    }
    novaParticlesRef.current = particles;

    if (onAnimationFinish) {
      const timer = setTimeout(() => {
        onAnimationFinish();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [newCompletedTaskId, onAnimationFinish]);

  // 背景の固定星の初期化
  useEffect(() => {
    const stars: BackgroundStar[] = [];
    const count = 75; // 初期の宇宙空間にある控えめな深宇宙星（邪魔にならない程度）
    for (let i = 0; i < count; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        size: 0.6 + Math.random() * 1.4,
        brightness: 0.2 + Math.random() * 0.5,
        twinkleSpeed: 0.01 + Math.random() * 0.03,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
    bgStarsRef.current = stars;
  }, []);

  // メインアニメーションループ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 1;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // パララックスの補間
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;
      const shiftX = mousePos.current.x * 25;
      const shiftY = mousePos.current.y * 25;

      // 1. 背景の描画 (超深宇宙グラデーション)
      ctx.save();
      const bgGradient = ctx.createRadialGradient(
        centerX + shiftX * 0.3,
        centerY + shiftY * 0.3,
        10,
        centerX,
        centerY,
        Math.max(width, height) * 0.75
      );
      bgGradient.addColorStop(0, '#0c102b'); // 中心：深いインディゴ
      bgGradient.addColorStop(0.5, '#050716'); // 中間：ミッドナイト
      bgGradient.addColorStop(1, '#020308'); // 外縁：漆黒
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 2. 微小な深宇宙星屑の描画
      ctx.save();
      ctx.translate(centerX + shiftX * 0.2, centerY + shiftY * 0.2);
      for (const bs of bgStarsRef.current) {
        const twinkle = Math.sin(time * bs.twinkleSpeed + bs.twinklePhase);
        const alpha = Math.max(0.1, bs.brightness + twinkle * 0.25);
        ctx.fillStyle = `rgba(226, 232, 240, ${alpha})`;
        ctx.beginPath();
        ctx.arc(bs.x, bs.y, bs.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. 星雲 (Nebula) の描画 (Stage 3以上で出現・進化)
      if (universeLevel >= 3) {
        ctx.save();
        ctx.translate(centerX + shiftX * 0.4, centerY + shiftY * 0.4);
        ctx.globalCompositeOperation = 'screen';

        const nebulaCount = Math.min(universeLevel - 1, 4);
        for (let n = 0; n < nebulaCount; n++) {
          const angle = time * 0.0015 * (n % 2 === 0 ? 1 : -1) + (n * Math.PI) / 2;
          const dist = 110 + n * 45;
          const nx = Math.cos(angle) * dist;
          const ny = Math.sin(angle) * dist * 0.8;
          const radius = 180 + n * 50 + Math.sin(time * 0.01 + n) * 15;

          const nGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, radius);
          if (n === 0) {
            nGrad.addColorStop(0, 'rgba(168, 85, 247, 0.22)'); // パープル
            nGrad.addColorStop(0.5, 'rgba(192, 132, 252, 0.08)');
            nGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          } else if (n === 1) {
            nGrad.addColorStop(0, 'rgba(6, 182, 212, 0.18)'); // シアン
            nGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.06)');
            nGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          } else if (n === 2) {
            nGrad.addColorStop(0, 'rgba(244, 63, 94, 0.16)'); // マゼンタ
            nGrad.addColorStop(0.5, 'rgba(251, 113, 133, 0.05)');
            nGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          } else {
            nGrad.addColorStop(0, 'rgba(234, 179, 8, 0.14)'); // ゴールド
            nGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.04)');
            nGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          }

          ctx.fillStyle = nGrad;
          ctx.beginPath();
          ctx.arc(nx, ny, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 4. 大銀河スパイラルアーム (Stage 6で覚醒)
      if (universeLevel >= 6) {
        ctx.save();
        ctx.translate(centerX + shiftX * 0.5, centerY + shiftY * 0.5);
        ctx.rotate(time * 0.001);
        ctx.globalCompositeOperation = 'lighter';

        const arms = 3;
        const ptsPerArm = 55;
        for (let a = 0; a < arms; a++) {
          const armOffset = (a * Math.PI * 2) / arms;
          for (let p = 0; p < ptsPerArm; p++) {
            const ratio = p / ptsPerArm;
            const dist = 60 + ratio * 320;
            const theta = armOffset + ratio * 3.5;
            const px = Math.cos(theta) * dist;
            const py = Math.sin(theta) * dist * 0.85;
            const pSize = 1.2 + ratio * 2;
            const pAlpha = (1 - ratio * 0.6) * 0.4;

            ctx.fillStyle = `rgba(147, 197, 253, ${pAlpha})`;
            ctx.beginPath();
            ctx.arc(px, py, pSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // 5. アステロイドベルト（小惑星帯） (Stage 5以上)
      if (universeLevel >= 5) {
        ctx.save();
        ctx.translate(centerX + shiftX * 0.6, centerY + shiftY * 0.6);
        ctx.rotate(-time * 0.0006);
        const beltRadius = 240;
        const rockCount = 60;
        for (let r = 0; r < rockCount; r++) {
          const rAngle = (r * Math.PI * 2) / rockCount + Math.sin(r) * 0.15;
          const rDist = beltRadius + Math.cos(r * 5) * 16;
          const rx = Math.cos(rAngle) * rDist;
          const ry = Math.sin(rAngle) * rDist * 0.9;
          const rSize = 1.0 + (r % 3) * 0.6;
          ctx.fillStyle = 'rgba(203, 213, 225, 0.45)';
          ctx.beginPath();
          ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 6. 軌道ラインの描画 (Stage 4以上、または惑星天体)
      if (universeLevel >= 4) {
        ctx.save();
        ctx.translate(centerX + shiftX * 0.6, centerY + shiftY * 0.6);
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 7]);
        for (const c of celestialsRef.current) {
          if (c.type === 'planet') {
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
            ctx.beginPath();
            ctx.ellipse(0, 0, c.distance, c.distance * 0.92, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        ctx.setLineDash([]);
        ctx.restore();
      }

      // 7. 星座ライン (Constellation Lines) (Stage 2以上)
      if (universeLevel >= 2 && celestialsRef.current.length >= 2) {
        ctx.save();
        ctx.translate(centerX + shiftX * 0.7, centerY + shiftY * 0.7);
        ctx.lineWidth = 1;
        const celestials = celestialsRef.current;

        for (let i = 0; i < celestials.length; i++) {
          const c1 = celestials[i];
          const currAngle1 = c1.angle + time * c1.orbitSpeed;
          const x1 = Math.cos(currAngle1) * c1.distance;
          const y1 = Math.sin(currAngle1) * c1.distance * 0.92;

          for (let j = i + 1; j < celestials.length; j++) {
            const c2 = celestials[j];
            const currAngle2 = c2.angle + time * c2.orbitSpeed;
            const x2 = Math.cos(currAngle2) * c2.distance;
            const y2 = Math.sin(currAngle2) * c2.distance * 0.92;

            const dx = x2 - x1;
            const dy = y2 - y1;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // 近傍の星同士を線で結ぶ
            if (dist < 130) {
              const alpha = (1 - dist / 130) * 0.28;
              ctx.strokeStyle = `rgba(186, 230, 253, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      // 8. 中心の宇宙核 (Cosmic Core / Singularity) の描画
      ctx.save();
      ctx.translate(centerX + shiftX * 0.7, centerY + shiftY * 0.7);

      const breathe = Math.sin(time * 0.03) * 3;
      let coreSize = 16 + breathe;
      let glowRadius = 55 + breathe * 2;
      let coreColor1 = '#60a5fa'; // 水色
      let coreColor2 = '#3b82f6';

      if (universeLevel === 0) {
        // Stage 0: 静寂の原始光核
        coreSize = 9 + Math.sin(time * 0.04) * 2;
        glowRadius = 35 + Math.sin(time * 0.04) * 5;
        coreColor1 = '#93c5fd';
        coreColor2 = '#2563eb';
      } else if (universeLevel === 1) {
        // Stage 1: 最初のスパーク
        coreSize = 14 + breathe;
        glowRadius = 55;
        coreColor1 = '#fef08a';
        coreColor2 = '#eab308';
      } else if (universeLevel >= 2 && universeLevel <= 3) {
        coreSize = 18 + breathe * 1.5;
        glowRadius = 75;
        coreColor1 = '#fef9c3';
        coreColor2 = '#f59e0b';
      } else if (universeLevel >= 4) {
        // Stage 4以上: 壮大な超恒星核
        coreSize = 24 + breathe * 2;
        glowRadius = 110 + Math.sin(time * 0.02) * 10;
        coreColor1 = '#ffffff';
        coreColor2 = '#fbbf24';
      }

      // 外側のオーラ
      const auraGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
      auraGrad.addColorStop(0, `${coreColor1}99`);
      auraGrad.addColorStop(0.35, `${coreColor2}44`);
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // 内側の核
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.6, coreColor1);
      coreGrad.addColorStop(1, coreColor2);
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, coreSize, 0, Math.PI * 2);
      ctx.fill();

      // 中心核の光芒スパイク (Stage 1以上)
      if (universeLevel >= 1) {
        ctx.save();
        ctx.rotate(time * 0.005);
        ctx.strokeStyle = `${coreColor1}66`;
        ctx.lineWidth = 1.5;
        const spikeLen = coreSize * 2.2 + Math.sin(time * 0.05) * 6;
        for (let s = 0; s < 4; s++) {
          ctx.rotate(Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(0, -spikeLen);
          ctx.lineTo(0, spikeLen);
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.restore();

      // 9. 天体（星・惑星・衛星）の描画とクリック判定座標更新
      ctx.save();
      ctx.translate(centerX + shiftX * 0.7, centerY + shiftY * 0.7);

      let foundHover: CelestialBody | null = null;
      const mouseCanvasX = mousePos.current.targetX * (width / 2) - shiftX * 0.7;
      const mouseCanvasY = mousePos.current.targetY * (height / 2) - shiftY * 0.7;

      for (const c of celestialsRef.current) {
        const currAngle = c.angle + time * c.orbitSpeed;
        const cx = Math.cos(currAngle) * c.distance;
        const cy = Math.sin(currAngle) * c.distance * 0.92;

        const isSelected = selectedCelestialId === c.id;
        const twinkle = Math.sin(time * c.twinkleSpeed + c.twinklePhase) * 0.35 + 0.65;

        // マウスホバー判定
        const hitRadius = Math.max(c.size * 2, 16);
        const distToMouse = Math.hypot(mouseCanvasX - cx, mouseCanvasY - cy);
        const isHovered = distToMouse <= hitRadius;
        if (isHovered) {
          foundHover = c;
        }

        // 天体の外側グロー
        const glowRad = (c.size * 3.2 + 8) * (isSelected || isHovered ? 1.4 : 1);
        const gGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRad);
        gGrad.addColorStop(0, c.glowColor);
        gGrad.addColorStop(0.5, c.glowColor.replace('0.6', '0.2'));
        gGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, glowRad, 0, Math.PI * 2);
        ctx.fill();

        // 惑星の環（リング）の描画
        if (c.hasRing && c.ringRadius) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(0.35); // 環の傾き
          ctx.strokeStyle = c.glowColor.replace('0.6', '0.7');
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.ellipse(0, 0, c.ringRadius, c.ringRadius * 0.35, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // 天体本体の描画
        const bodyGrad = ctx.createRadialGradient(
          cx - c.size * 0.3,
          cy - c.size * 0.3,
          0,
          cx,
          cy,
          c.size
        );
        bodyGrad.addColorStop(0, '#ffffff');
        bodyGrad.addColorStop(0.4, c.color);
        bodyGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, c.size, 0, Math.PI * 2);
        ctx.fill();

        // 巨星・大星のクロススパイク
        if (c.type === 'giant') {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.strokeStyle = `${c.color}99`;
          ctx.lineWidth = 1;
          const sLen = c.size * 2 + twinkle * 4;
          ctx.beginPath();
          ctx.moveTo(-sLen, 0);
          ctx.lineTo(sLen, 0);
          ctx.moveTo(0, -sLen);
          ctx.lineTo(0, sLen);
          ctx.stroke();
          ctx.restore();
        }

        // 周回する衛星（月）の描画
        if (c.moons) {
          for (const m of c.moons) {
            const mAngle = m.angle + time * m.speed;
            const mx = cx + Math.cos(mAngle) * m.distance;
            const my = cy + Math.sin(mAngle) * m.distance * 0.6;
            ctx.fillStyle = m.color;
            ctx.beginPath();
            ctx.arc(mx, my, m.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 選択中またはホバー中のフォーカスリング
        if (isSelected || isHovered) {
          ctx.strokeStyle = isSelected ? '#38bdf8' : '#e2e8f0';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, c.size + 6 + Math.sin(time * 0.1) * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.restore();

      hoveredCelestialRef.current = foundHover;
      if (foundHover) {
        // スクリーン座標に変換
        const currAngle = foundHover.angle + time * foundHover.orbitSpeed;
        const cx = Math.cos(currAngle) * foundHover.distance;
        const cy = Math.sin(currAngle) * foundHover.distance * 0.92;
        setHoveredInfo({
          name: foundHover.taskTitle,
          x: centerX + shiftX * 0.7 + cx,
          y: centerY + shiftY * 0.7 + cy,
          color: foundHover.color
        });
      } else {
        setHoveredInfo(null);
      }

      // 10. 新星爆発パーティクル (Nova Burst) の描画
      if (novaParticlesRef.current.length > 0) {
        ctx.save();
        ctx.translate(centerX + shiftX * 0.7, centerY + shiftY * 0.7);
        ctx.globalCompositeOperation = 'lighter';

        for (let i = novaParticlesRef.current.length - 1; i >= 0; i--) {
          const p = novaParticlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;
          p.size = Math.max(0, p.size - 0.04);

          if (p.alpha <= 0 || p.size <= 0) {
            novaParticlesRef.current.splice(i, 1);
            continue;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 11. 流星（流れ星）の描画 (Stage 5以上)
      if (universeLevel >= 5) {
        // ランダムに流星を発生
        if (Math.random() < 0.015 && shootingStarsRef.current.length < 3) {
          shootingStarsRef.current.push({
            x: Math.random() * width * 0.8,
            y: Math.random() * (height * 0.4),
            length: 80 + Math.random() * 80,
            speed: 12 + Math.random() * 8,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
            opacity: 1,
            active: true
          });
        }

        ctx.save();
        for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
          const s = shootingStarsRef.current[i];
          s.x += Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          s.opacity -= 0.02;

          if (s.opacity <= 0 || s.x > width + 100 || s.y > height + 100) {
            shootingStarsRef.current.splice(i, 1);
            continue;
          }

          const tailX = s.x - Math.cos(s.angle) * s.length;
          const tailY = s.y - Math.sin(s.angle) * s.length;

          const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
          grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
          grad.addColorStop(0.4, `rgba(186, 230, 253, ${s.opacity * 0.7})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [universeLevel, selectedCelestialId]);

  // リサイズ処理 (高解像度Retinaディスプレイ対応)
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // マウス操作（パララックス）
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mousePos.current.targetX = x;
    mousePos.current.targetY = y;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePos.current.targetX = 0;
    mousePos.current.targetY = 0;
  }, []);

  // クリックで天体を選択
  const handleClick = useCallback(() => {
    if (hoveredCelestialRef.current) {
      soundManager.playStarClick();
      onSelectCelestial(hoveredCelestialRef.current);
    }
  }, [onSelectCelestial]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-crosshair bg-slate-950"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />

      {/* ホバー時の星情報ツールチップ */}
      {hoveredInfo && (
        <div
          className="pointer-events-none absolute z-30 transform -translate-x-1/2 -translate-y-full pb-3 transition-opacity duration-150"
          style={{ left: hoveredInfo.x, top: hoveredInfo.y }}
        >
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-lg px-3 py-1.5 shadow-2xl flex items-center gap-2 whitespace-nowrap text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block animate-pulse shadow-sm"
              style={{ backgroundColor: hoveredInfo.color, boxShadow: `0 0 8px ${hoveredInfo.color}` }}
            />
            <span className="text-slate-100 font-medium">{hoveredInfo.name}</span>
            <span className="text-slate-400 text-[10px]">クリックで詳細</span>
          </div>
        </div>
      )}

      {/* 初期状態（Stage 0）の優しいナビゲーション表示 */}
      {universeLevel === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="mt-32 max-w-sm text-center px-6 py-4 bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-2xl animate-fade-in shadow-xl">
            <p className="text-cyan-300/90 text-sm font-semibold tracking-wide">
              🌌 虚空の宇宙へようこそ
            </p>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              中央に灯る原始の光核が待っています。<br />
              タスクを完了すると、光が集まり最初の星が誕生します。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
