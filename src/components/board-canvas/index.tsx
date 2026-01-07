/**
 * 画笔 Canvas 组件
 * 使用 HTML5 Canvas 实现笔迹绘制
 */
import IcEraserBig from "../../assets/icons/ic_eraser_big.svg";
import { useEffect, useRef, useState } from "react";
import type { Point, Stroke } from "./types";
import { STROKE_OPTIONS, COLOR_OPTIONS } from "./constant";

// types/toolbar
export type StrokeKey = (typeof STROKE_OPTIONS)[number]["key"];
export type ColorValue = (typeof COLOR_OPTIONS)[number]["value"];



interface BoardCanvasProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentRef?: React.RefObject<HTMLDivElement | null>; // 内容区域的 ref，用于计算逻辑坐标
  containerMaxWidth?: string; // 内容区域的逻辑宽度（缩放前的宽度）
  activeTool: "pen" | "eraser" | null;
  selectedStroke: StrokeKey;
  selectedColor: ColorValue;
  onStrokeComplete?: (stroke: Stroke) => void;
  onDrawingStart?: () => void; // 开始绘制时的回调
  onStrokesChange?: (strokes: Stroke[]) => void; // 笔迹变化时的回调（用于擦除）
  strokes?: Stroke[];
  scale?: number;
  className?: string;
  hideEraserIndicator?: boolean; // 是否隐藏黑板擦指示器（滑动清屏面板打开时）
}

export const BoardCanvas = ({
  containerRef,
  contentRef,
  containerMaxWidth,
  activeTool,
  selectedStroke,
  selectedColor,
  onStrokeComplete,
  onDrawingStart,
  onStrokesChange,
  hideEraserIndicator = false,
  strokes = [],
  scale = 1,
  className = "",
}: BoardCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<Point[]>([]);
  const lastPointRef = useRef<Point | null>(null);
  const eraserPathRef = useRef<Point[]>([]); // 擦除路径
  const currentPathRef = useRef<{ lastAbsPoint: Point | null }>({
    lastAbsPoint: null,
  }); // 当前绘制路径状态
  // 触摸屏上的黑板擦指示器位置（屏幕坐标）
  const [eraserIndicatorPosition, setEraserIndicatorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // 同步 isDrawing 状态到 ref
  useEffect(() => {
    isDrawingRef.current = isDrawing;
  }, [isDrawing]);

  // 获取画笔宽度
  const getStrokeWidth = (strokeKey: StrokeKey): number => {
    const option = STROKE_OPTIONS.find((opt) => opt.key === strokeKey);
    if (!option) return 3;
    switch (option.key) {
      case "thin":
        return 2;
      case "medium":
        return 4;
      case "thick":
        return 6;
      default:
        return 3;
    }
  };

  // 获取内容区域的逻辑尺寸（缩放前的尺寸，用于坐标转换）
  // 这样可以确保在不同屏幕和缩放比例下，笔迹位置保持一致
  const getContentLogicalSize = () => {
    if (!contentRef?.current || !containerMaxWidth) {
      // 如果没有提供 contentRef 和 containerMaxWidth，回退到容器尺寸
      if (!containerRef.current) {
        return { width: 0, height: 0 };
      }
      const container = containerRef.current;
      const fallbackSize = {
        width: container.scrollWidth || container.clientWidth,
        height: container.scrollHeight || container.clientHeight,
      };
      return fallbackSize;
    }

    // 获取内容区域的逻辑宽度（缩放前的宽度）
    // 注意：这个宽度应该在所有屏幕上都是一样的，因为它基于固定的字符数和字符宽度
    // 如果 containerMaxWidth 是 "1440px"，那么 logicalWidth 就是 1440
    // 这个值应该与 useFixedCharsPerLine 中计算的 baseContainerWidthPx / scale² 一致
    const logicalWidth = parseFloat(containerMaxWidth) || 0;

    // 如果 logicalWidth 为 0，说明 containerMaxWidth 还没有计算出来
    // 这种情况下，我们需要回退到容器尺寸，但这会导致笔迹位置不一致
    // 所以我们应该确保 containerMaxWidth 总是有值

    // 获取内容区域的实际高度（缩放后的高度）
    // 🔧 修复：使用 scrollHeight 而不是 getBoundingClientRect().height
    // 注意：scrollHeight 会包含 zoom 的影响（因为 zoom 会影响布局）
    // 但是，由于普通题和子母题都使用 scale={1}，所以 logicalHeight = scrollHeight
    // 即使 scrollHeight 包含 zoom 的影响，logicalHeight = scrollHeight 也是对的
    // 这是因为在截图时，我们移除了 zoom，图片变回原始大小，但 scrollHeight 也相应变小
    // 所以逻辑坐标（基于 scrollHeight）在绘制和截图时是一致的
    const contentElement = contentRef.current;
    const actualHeight = contentElement.scrollHeight;

    // 计算内容区域的逻辑高度（缩放前的高度）
    // 逻辑高度 = 实际高度 / scale
    // 注意：由于普通题和子母题都使用 scale={1}，所以 logicalHeight = scrollHeight
    const logicalHeight = actualHeight / scale;

    const logicalSize = { width: logicalWidth, height: logicalHeight };

    return logicalSize;
  };

  // 获取内容区域在容器中的位置（考虑缩放和居中）
  const getContentPosition = () => {
    if (!contentRef?.current || !containerRef.current) {
      return { x: 0, y: 0 };
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    // 计算内容区域相对于容器的位置（考虑滚动）
    const x = contentRect.left - containerRect.left;
    const y =
      contentRect.top - containerRect.top + containerRef.current.scrollTop;

    return { x, y };
  };

  // 坐标转换：将屏幕坐标转换为逻辑坐标（相对于内容区域的逻辑尺寸）
  // 这样可以确保在不同屏幕和缩放比例下，笔迹位置保持一致
  // 注意：逻辑坐标可以超出 0-1 范围，表示占位区域（负数表示顶部占位，>1 表示底部占位）
  const getCanvasCoordinates = (
    clientX: number,
    clientY: number
  ): Point | null => {
    if (!canvasRef.current || !containerRef.current) {
      return null;
    }

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    // 计算相对于容器的绝对坐标（考虑滚动）
    const absoluteX = clientX - containerRect.left;
    const absoluteY = clientY - containerRect.top + container.scrollTop;

    // 获取内容区域的逻辑尺寸和位置
    const logicalSize = getContentLogicalSize();
    const contentPos = getContentPosition();

    if (logicalSize.width === 0 || logicalSize.height === 0) {
      return null;
    }

    // 计算相对于内容区域的坐标（考虑内容区域的位置）
    // 注意：这个坐标可以是负数（顶部占位区域）或大于内容区域高度（底部占位区域）
    const relativeX = absoluteX - contentPos.x;
    const relativeY = absoluteY - contentPos.y;

    // 转换为逻辑坐标（相对于内容区域的逻辑尺寸的比例）
    // 注意：
    // - 逻辑坐标可以超出 0-1 范围，表示占位区域
    // - y < 0 表示顶部占位区域，y > 1 表示底部占位区域
    // - 由于普通题和子母题都使用 scale={1}，所以逻辑坐标 = 相对坐标 / 逻辑尺寸
    const logicalX = relativeX / logicalSize.width;
    const logicalY = relativeY / logicalSize.height;

    return { x: logicalX, y: logicalY, timestamp: Date.now() };
  };

  // 将逻辑坐标转换为绝对坐标（用于绘制）
  const relativeToAbsolute = (point: Point): Point | null => {
    if (!containerRef.current) {
      return null;
    }

    // 检查 point 是否有效
    if (!point || typeof point.x !== "number" || typeof point.y !== "number") {
      return null;
    }

    const logicalSize = getContentLogicalSize();
    const contentPos = getContentPosition();

    if (logicalSize.width === 0 || logicalSize.height === 0) {
      return null;
    }

    // 注意：逻辑坐标可以超出 0-1 范围，表示占位区域
    // y < 0 表示顶部占位区域，y > 1 表示底部占位区域
    // 不再限制坐标范围，允许在整个容器（包括占位区域）绘制
    // 只在开发环境记录超出内容区域的坐标
    // if (process.env.NODE_ENV === "development") {
    //   if (point.x < 0 || point.x > 1 || point.y < 0 || point.y > 1) {
    //     console.log(
    //       "[relativeToAbsolute] 逻辑坐标在占位区域:",
    //       "x:",
    //       point.x,
    //       "y:",
    //       point.y,
    //       point.y < 0 ? "(顶部占位)" : point.y > 1 ? "(底部占位)" : ""
    //     );
    //   }
    // }

    // 将逻辑坐标转换为相对坐标（考虑缩放）
    // 由于普通题和子母题都使用 scale={1}，所以相对坐标 = 逻辑坐标 * 逻辑尺寸
    const relativeX = point.x * logicalSize.width;
    const relativeY = point.y * logicalSize.height;

    // 转换为绝对坐标（相对于容器）
    const absoluteX = relativeX + contentPos.x;
    const absoluteY = relativeY + contentPos.y;

    return {
      x: absoluteX,
      y: absoluteY,
      timestamp: point.timestamp,
    };
  };

  // 计算点到线段的距离
  const distanceToLineSegment = (
    point: Point,
    lineStart: Point,
    lineEnd: Point
  ): number => {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // 检测点是否在擦除路径附近（使用相对坐标）
  const isPointNearEraserPath = (
    point: Point,
    eraserPath: Point[],
    eraserRadius: number
  ): boolean => {
    if (eraserPath.length === 0) return false;

    const logicalSize = getContentLogicalSize();
    if (logicalSize.width === 0 || logicalSize.height === 0) {
      return false;
    }

    // 将擦除半径转换为相对坐标的比例（使用逻辑宽度作为基准）
    // 注意：擦除半径是像素值，需要转换为逻辑坐标的比例
    const relativeRadius = eraserRadius / scale / logicalSize.width;

    // 如果只有一个点，直接计算距离
    if (eraserPath.length === 1) {
      const eraserPoint = eraserPath[0];
      const dx = point.x - eraserPoint.x;
      const dy = point.y - eraserPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < relativeRadius;
    }

    // 检查点是否在擦除路径的任意线段附近
    for (let i = 0; i < eraserPath.length - 1; i++) {
      const distance = distanceToLineSegment(
        point,
        eraserPath[i],
        eraserPath[i + 1]
      );
      if (distance < relativeRadius) {
        return true;
      }
    }

    return false;
  };

  // 检测笔迹线段是否被擦除路径覆盖（使用逻辑坐标）
  const isStrokeSegmentErased = (
    segmentStart: Point,
    segmentEnd: Point,
    eraserPath: Point[],
    eraserRadius: number
  ): boolean => {
    const logicalSize = getContentLogicalSize();
    if (logicalSize.width === 0 || logicalSize.height === 0) {
      return false;
    }

    // 计算相对坐标下的线段长度（相对坐标差值）
    const relativeLength = Math.sqrt(
      Math.pow(segmentEnd.x - segmentStart.x, 2) +
        Math.pow(segmentEnd.y - segmentStart.y, 2)
    );

    // 将采样间隔转换为逻辑坐标（每5像素采样一个点，转换为逻辑比例）
    // 注意：采样间隔是像素值，需要转换为逻辑坐标的比例
    const sampleInterval = 5 / scale / logicalSize.width;
    const samples = Math.max(10, Math.ceil(relativeLength / sampleInterval));

    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const point: Point = {
        x: segmentStart.x + (segmentEnd.x - segmentStart.x) * t,
        y: segmentStart.y + (segmentEnd.y - segmentStart.y) * t,
      };

      // 检查点是否在擦除路径附近
      if (isPointNearEraserPath(point, eraserPath, eraserRadius)) {
        return true;
      }
    }
    return false;
  };

  // 擦除笔迹（只擦除擦除路径经过的部分）
  const eraseStrokes = (eraserPath: Point[]) => {
    if (!onStrokesChange || eraserPath.length === 0 || strokes.length === 0)
      return;

    const eraserRadius = 30; // 增加擦除半径，提高灵敏度
    const remainingStrokes: Stroke[] = [];
    let hasChanged = false;

    if (!strokes || !Array.isArray(strokes)) return;

    strokes.forEach((stroke) => {
      // 安全检查：确保 stroke 和 stroke.points 存在
      if (!stroke || !stroke.points || !Array.isArray(stroke.points)) {
        return;
      }

      // 检查笔迹的每个点是否被擦除
      // 使用数组存储多个片段，每个片段都是一个独立的 stroke
      const segments: Point[][] = [];
      let currentSegment: Point[] = [];

      for (let i = 0; i < stroke.points.length; i++) {
        const point = stroke.points[i];
        let isErased = false;

        // 方法1：检查点是否在擦除路径附近
        isErased = isPointNearEraserPath(point, eraserPath, eraserRadius);

        // 方法2：如果点不在擦除路径附近，检查笔迹的线段是否被擦除路径覆盖
        if (!isErased && i > 0) {
          const prevPoint = stroke.points[i - 1];
          // 检查笔迹的线段是否被擦除路径覆盖
          isErased = isStrokeSegmentErased(
            prevPoint,
            point,
            eraserPath,
            eraserRadius
          );
        }

        if (!isErased) {
          // 点未被擦除，添加到当前片段
          currentSegment.push(point);
        } else {
          // 点被擦除，如果当前片段有内容，保存它并开始新片段
          if (currentSegment.length > 0) {
            segments.push([...currentSegment]);
            currentSegment = [];
          }
          hasChanged = true;
        }
      }

      // 添加最后一个片段
      if (currentSegment.length > 0) {
        segments.push([...currentSegment]);
      }

      // 为每个片段创建一个独立的 stroke
      if (segments.length > 0) {
        // 如果片段数量与原始不同，说明被分割了
        if (
          segments.length > 1 ||
          segments[0].length !== stroke.points.length
        ) {
          hasChanged = true;
        }
        // 为每个片段创建独立的 stroke
        segments.forEach((segmentPoints) => {
          remainingStrokes.push({
            ...stroke,
            points: segmentPoints,
          });
        });
      } else {
        // 如果所有点都被擦除，标记为已改变
        hasChanged = true;
      }
    });

    // 如果有改变，更新笔迹
    if (hasChanged || remainingStrokes.length !== strokes.length) {
      onStrokesChange(remainingStrokes);
    }
  };

  // 绘制单点或线条（实时绘制时保持路径连续）
  const drawPoint = (
    ctx: CanvasRenderingContext2D,
    point: Point,
    lastPoint: Point | null,
    isRealTime = false // 是否为实时绘制
  ) => {
    // 将相对坐标转换为绝对坐标用于绘制
    const absPoint = relativeToAbsolute(point);
    if (!absPoint) return;

    if (!lastPoint) {
      // 绘制单个点，开始新路径
      ctx.beginPath();
      ctx.arc(
        absPoint.x,
        absPoint.y,
        getStrokeWidth(selectedStroke) / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      if (isRealTime) {
        currentPathRef.current.lastAbsPoint = absPoint;
      }
      return;
    }

    // 绘制线条
    const absLastPoint = relativeToAbsolute(lastPoint);
    if (!absLastPoint) return;

    if (isRealTime) {
      // 实时绘制：继续当前路径，确保连续性
      if (currentPathRef.current.lastAbsPoint === null) {
        // 如果路径还没开始，先移动到起始点
        ctx.beginPath();
        ctx.moveTo(absLastPoint.x, absLastPoint.y);
        currentPathRef.current.lastAbsPoint = absLastPoint;
      }

      // 直接绘制到当前点，使用 lineTo 确保连续
      ctx.lineTo(absPoint.x, absPoint.y);
      ctx.lineWidth = getStrokeWidth(selectedStroke);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // 更新路径状态
      currentPathRef.current.lastAbsPoint = absPoint;
    } else {
      // 重绘模式：使用二次贝塞尔曲线平滑
      ctx.beginPath();
      ctx.moveTo(absLastPoint.x, absLastPoint.y);

      // 计算控制点（中点）
      const midX = (absLastPoint.x + absPoint.x) / 2;
      const midY = (absLastPoint.y + absPoint.y) / 2;

      ctx.quadraticCurveTo(absLastPoint.x, absLastPoint.y, midX, midY);
      ctx.lineWidth = getStrokeWidth(selectedStroke);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
  };

  // 重绘所有笔迹
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!strokes || !Array.isArray(strokes)) {
      return;
    }

    if (strokes.length === 0) {
      return;
    }

    strokes.forEach((stroke, index) => {
      if (
        !stroke ||
        !stroke.points ||
        !Array.isArray(stroke.points) ||
        stroke.points.length === 0
      ) {
        return;
      }

      if (!stroke.style) {
        return;
      }

      ctx.strokeStyle = stroke.style.color;
      ctx.fillStyle = stroke.style.color;
      ctx.globalAlpha = stroke.style.opacity ?? 1;
      ctx.lineWidth = stroke.style.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      // const firstPoint = relativeToAbsolute(stroke.points[0]);
      //   if (!firstPoint) {
      //     console.log(
      //       `[redrawCanvas] 笔迹 ${index} 第一个点转换失败:`,
      //       stroke.points[0],
      //       "逻辑坐标:",
      //       stroke.points[0]?.x,
      //       stroke.points[0]?.y,
      //       "contentRef:",
      //       !!contentRef?.current,
      //       "containerRef:",
      //       !!containerRef.current,
      //       "containerMaxWidth:",
      //       containerMaxWidth
      //     );
      //     return;
      //   }
      //   console.log(
      //     `[redrawCanvas] 笔迹 ${index} 第一个点转换成功:`,
      //     "逻辑坐标:",
      //     stroke.points[0]?.x,
      //     stroke.points[0]?.y,
      //     "绝对坐标:",
      //     firstPoint.x,
      //     firstPoint.y
      //   );
      //   // ctx.moveTo(firstPoint.x, firstPoint.y);

      let validPointsCount = 0;
      let invalidPointsCount = 0;
      for (let i = 1; i < stroke.points.length; i++) {
        const point = relativeToAbsolute(stroke.points[i]);
        const prevPoint = relativeToAbsolute(stroke.points[i - 1]);
        if (!point || !prevPoint) {
          invalidPointsCount++;
          continue;
        }
        validPointsCount++;
        const midX = (prevPoint.x + point.x) / 2;
        const midY = (prevPoint.y + point.y) / 2;
        ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, midX, midY);
      }

      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // 绘制当前正在绘制的笔迹（当前绘制使用相对坐标，需要转换）
    if (isDrawing && currentStrokeRef.current.length > 0) {
      ctx.strokeStyle = selectedColor;
      ctx.fillStyle = selectedColor;
      ctx.lineWidth = getStrokeWidth(selectedStroke);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      const firstPoint = relativeToAbsolute(currentStrokeRef.current[0]);
      if (!firstPoint) return;
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < currentStrokeRef.current.length; i++) {
        const point = relativeToAbsolute(currentStrokeRef.current[i]);
        const prevPoint = relativeToAbsolute(currentStrokeRef.current[i - 1]);
        if (!point || !prevPoint) continue;
        const midX = (prevPoint.x + point.x) / 2;
        const midY = (prevPoint.y + point.y) / 2;
        ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, midX, midY);
      }

      ctx.stroke();
    }
  };

  // 初始化 Canvas 尺寸
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const updateCanvasSize = () => {
      const container = containerRef.current;
      if (!container) return;

      // 设置 Canvas 尺寸（与容器一致）
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = container.scrollHeight; // 使用完整内容高度
    };

    updateCanvasSize();
    redrawCanvas();

    // 监听容器大小变化
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
      redrawCanvas();
    });
    resizeObserver.observe(containerRef.current);

    // 监听滚动，更新 Canvas 位置
    const handleScroll = () => {
      redrawCanvas();
    };
    containerRef.current.addEventListener("scroll", handleScroll);

    return () => {
      resizeObserver.disconnect();
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [containerRef, strokes, scale]);

  // 当笔迹数据变化时重绘
  useEffect(() => {
    redrawCanvas();
  }, [
    strokes,
    isDrawing,
    selectedColor,
    selectedStroke,
    containerMaxWidth,
    scale,
  ]);

  // 结束绘制的通用函数
  const finishStroke = () => {
    if (currentStrokeRef.current.length > 0 && onStrokeComplete) {
      const stroke: Stroke = {
        id: `stroke-${Date.now()}-${Math.random()}`,
        tool: "pen",
        points: [...currentStrokeRef.current],
        style: {
          color: selectedColor,
          width: getStrokeWidth(selectedStroke),
          opacity: 1,
        },
        timestamp: Date.now(),
      };

      onStrokeComplete(stroke);
    }

    setIsDrawing(false);
    if (activeTool === "pen") {
      currentStrokeRef.current = [];
      lastPointRef.current = null;
      // 重置路径状态
      currentPathRef.current.lastAbsPoint = null;
    } else if (activeTool === "eraser") {
      eraserPathRef.current = [];
    }
  };

  // 触摸开始（使用原生事件监听器，支持 passive: false）
  // 注意：即使 activeTool 不是 "pen"，也需要注册事件监听器来处理双指触摸
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      // 双指触摸时，不拦截事件，让父级处理双指滚动
      if (e.touches.length === 2) {
        return; // 直接 return，不阻止事件传播
      }

      // 如果不在画笔或擦除模式，不处理单指触摸
      if (activeTool !== "pen" && activeTool !== "eraser") {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const touch = e.touches[0];
      const point = getCanvasCoordinates(touch.clientX, touch.clientY);
      if (!point) return;

      if (activeTool === "pen") {
        // 开始绘制时通知父组件关闭选择面板
        if (onDrawingStart && !isDrawingRef.current) {
          onDrawingStart();
        }

        setIsDrawing(true);
        currentStrokeRef.current = [point];
        lastPointRef.current = point;
        // 重置路径状态
        currentPathRef.current.lastAbsPoint = null;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.strokeStyle = selectedColor;
        ctx.fillStyle = selectedColor;
        ctx.lineWidth = getStrokeWidth(selectedStroke);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = 1;

        // 实时绘制，传入 isRealTime=true
        drawPoint(ctx, point, null, true);
      } else if (activeTool === "eraser") {
        // 擦除模式：开始跟踪擦除路径
        setIsDrawing(true);
        eraserPathRef.current = [point];
        // 更新黑板擦指示器位置（触摸屏可视化）
        setEraserIndicatorPosition({
          x: touch.clientX,
          y: touch.clientY,
        });
        // 立即检测并擦除
        eraseStrokes(eraserPathRef.current);
        // 重绘画布以显示擦除效果
        redrawCanvas();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // 双指触摸时，不拦截事件，让父级处理双指滚动
      if (e.touches.length === 2) {
        return; // 直接 return，不阻止事件传播
      }

      if (
        (activeTool !== "pen" && activeTool !== "eraser") ||
        !isDrawingRef.current
      )
        return;

      const touch = e.touches[0];

      // 检查是否移动到了其他元素上（如子题切换器）
      // 如果是，则中断绘制
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element && element !== canvas) {
        finishStroke();
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const point = getCanvasCoordinates(touch.clientX, touch.clientY);
      if (!point) return;

      if (activeTool === "pen") {
        if (!lastPointRef.current) return;
        currentStrokeRef.current.push(point);

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = getStrokeWidth(selectedStroke);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // 实时绘制，传入 isRealTime=true，保持路径连续
        drawPoint(ctx, point, lastPointRef.current, true);
        lastPointRef.current = point;
      } else if (activeTool === "eraser") {
        // 擦除模式：继续跟踪路径并擦除
        eraserPathRef.current.push(point);
        // 只保留最近的路径点，避免路径过长影响性能
        if (eraserPathRef.current.length > 50) {
          eraserPathRef.current = eraserPathRef.current.slice(-30);
        }
        // 更新黑板擦指示器位置（触摸屏可视化）
        setEraserIndicatorPosition({
          x: touch.clientX,
          y: touch.clientY,
        });
        eraseStrokes(eraserPathRef.current);
        // 重绘画布以显示擦除效果
        redrawCanvas();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (
        (activeTool !== "pen" && activeTool !== "eraser") ||
        !isDrawingRef.current
      )
        return;

      e.preventDefault();
      e.stopPropagation();

      finishStroke();

      // 触摸结束时隐藏黑板擦指示器
      if (activeTool === "eraser") {
        setEraserIndicatorPosition(null);
      }
    };

    // 使用原生事件监听器，设置 passive: false 以允许 preventDefault
    // 注意：对于双指触摸，不使用 capture，让事件先到达 document（capture: true）
    // 对于单指触摸（画笔模式），在 canvas 上处理
    canvas.addEventListener("touchstart", handleTouchStart, {
      passive: false,
      capture: false, // 不使用 capture，让 document 的 capture 监听器先执行
    });
    canvas.addEventListener("touchmove", handleTouchMove, {
      passive: false,
      capture: false,
    });
    canvas.addEventListener("touchend", handleTouchEnd, {
      passive: false,
      capture: false,
    });

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    activeTool,
    selectedColor,
    selectedStroke,
    onStrokeComplete,
    onDrawingStart,
    onStrokesChange,
    strokes,
    getCanvasCoordinates,
    drawPoint,
    eraseStrokes,
    redrawCanvas,
  ]);

  // 鼠标事件（用于开发测试）
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool !== "pen" && activeTool !== "eraser") return;

    e.preventDefault();
    e.stopPropagation();

    const point = getCanvasCoordinates(e.clientX, e.clientY);
    if (!point) return;

    if (activeTool === "pen") {
      // 开始绘制时通知父组件关闭选择面板
      if (onDrawingStart && !isDrawing) {
        onDrawingStart();
      }

      setIsDrawing(true);
      currentStrokeRef.current = [point];
      lastPointRef.current = point;
      // 重置路径状态
      currentPathRef.current.lastAbsPoint = null;
    } else if (activeTool === "eraser") {
      // 擦除模式：开始跟踪擦除路径
      setIsDrawing(true);
      eraserPathRef.current = [point];
      // 更新黑板擦指示器位置（鼠标模式）
      setEraserIndicatorPosition({
        x: e.clientX,
        y: e.clientY,
      });
      // 立即检测并擦除
      eraseStrokes(eraserPathRef.current);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    ctx.lineWidth = getStrokeWidth(selectedStroke);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = 1;

    // 实时绘制，传入 isRealTime=true
    drawPoint(ctx, point, null, true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if ((activeTool !== "pen" && activeTool !== "eraser") || !isDrawing) return;

    // 检查是否移动到了其他元素上
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (element && element !== canvasRef.current) {
      finishStroke();
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const point = getCanvasCoordinates(e.clientX, e.clientY);
    if (!point) return;

    if (activeTool === "pen") {
      if (!lastPointRef.current) return;
      currentStrokeRef.current.push(point);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = getStrokeWidth(selectedStroke);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // 实时绘制，传入 isRealTime=true，保持路径连续
      drawPoint(ctx, point, lastPointRef.current, true);
      lastPointRef.current = point;
    } else if (activeTool === "eraser") {
      // 擦除模式：继续跟踪路径并擦除
      eraserPathRef.current.push(point);
      // 只保留最近的路径点，避免路径过长影响性能
      if (eraserPathRef.current.length > 50) {
        eraserPathRef.current = eraserPathRef.current.slice(-30);
      }
      // 更新黑板擦指示器位置（鼠标模式）
      setEraserIndicatorPosition({
        x: e.clientX,
        y: e.clientY,
      });
      eraseStrokes(eraserPathRef.current);
      // 重绘画布以显示擦除效果
      redrawCanvas();
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if ((activeTool !== "pen" && activeTool !== "eraser") || !isDrawing) return;

    e.preventDefault();
    e.stopPropagation();

    finishStroke();

    // 鼠标抬起时隐藏黑板擦指示器（触摸屏上触摸结束时也会隐藏）
    if (activeTool === "eraser") {
      setEraserIndicatorPosition(null);
    }
  };

  // 全局触摸/鼠标移动监听器：在擦除模式激活时显示指示器
  useEffect(() => {
    if (activeTool !== "eraser") {
      // 如果不是擦除模式，隐藏指示器
      setEraserIndicatorPosition(null);
      return;
    }

    // 检查点是否在当前容器范围内
    const isPointInContainer = (x: number, y: number): boolean => {
      const container = containerRef?.current;
      if (!container) return false;
      const rect = container.getBoundingClientRect();
      return (
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      );
    };

    const handleGlobalTouchStart = (e: TouchEvent) => {
      // 双指触摸时不显示指示器
      if (e.touches.length === 2) {
        setEraserIndicatorPosition(null);
        return;
      }
      // 单指触摸时，只在当前容器范围内显示指示器
      if (e.touches.length === 1) {
        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;
        if (isPointInContainer(x, y)) {
          setEraserIndicatorPosition({ x, y });
        } else {
          setEraserIndicatorPosition(null);
        }
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      // 双指触摸时不显示指示器
      if (e.touches.length === 2) {
        setEraserIndicatorPosition(null);
        return;
      }
      // 单指触摸时，只在当前容器范围内显示指示器
      if (e.touches.length === 1) {
        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;
        if (isPointInContainer(x, y)) {
          setEraserIndicatorPosition({ x, y });
        } else {
          setEraserIndicatorPosition(null);
        }
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      // 鼠标移动时，只在当前容器范围内显示指示器
      const x = e.clientX;
      const y = e.clientY;
      if (isPointInContainer(x, y)) {
        setEraserIndicatorPosition({ x, y });
      } else {
        setEraserIndicatorPosition(null);
      }
    };

    const handleGlobalTouchEnd = () => {
      // 触摸结束时隐藏指示器
      setEraserIndicatorPosition(null);
    };

    const handleGlobalMouseLeave = () => {
      // 鼠标离开窗口时隐藏指示器
      setEraserIndicatorPosition(null);
    };

    // 注册全局事件监听器
    window.addEventListener("touchstart", handleGlobalTouchStart, {
      passive: true,
    });
    window.addEventListener("touchmove", handleGlobalTouchMove, {
      passive: true,
    });
    window.addEventListener("mousemove", handleGlobalMouseMove, {
      passive: true,
    });
    window.addEventListener("touchend", handleGlobalTouchEnd, {
      passive: true,
    });
    document.addEventListener("mouseleave", handleGlobalMouseLeave);

    return () => {
      window.removeEventListener("touchstart", handleGlobalTouchStart);
      window.removeEventListener("touchmove", handleGlobalTouchMove);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("touchend", handleGlobalTouchEnd);
      document.removeEventListener("mouseleave", handleGlobalMouseLeave);
      setEraserIndicatorPosition(null);
    };
  }, [activeTool, containerRef]);

  const isPenMode = activeTool === "pen";
  const isEraserMode = activeTool === "eraser";

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 40 }}
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 ${className}`}
        style={{
          pointerEvents: isPenMode || isEraserMode ? "auto" : "none",
          touchAction: isPenMode || isEraserMode ? "none" : "auto",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      {/* 触摸屏上的黑板擦指示器 */}
      {isEraserMode && eraserIndicatorPosition && !hideEraserIndicator && (
        <div
          className="EraserIndicator pointer-events-none fixed z-50"
          style={{
            left: `${eraserIndicatorPosition.x}px`,
            top: `${eraserIndicatorPosition.y}px`,
            transform: "translate(-50%, -50%)",
            width: "64px",
            height: "64px",
          }}
        >
          <IcEraserBig
            className="h-full w-full"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BoardCanvas;
