import { useRef, useEffect, useState, useCallback } from 'react';
import ForceGraph2D, {
  type ForceGraphMethods,
  type NodeObject,
  type LinkObject,
} from 'react-force-graph-2d';
import { usePortfolioStore, type PortfolioNode, type PortfolioLink } from '../store/store';

export function GraphView() {
  const fgRef = useRef<ForceGraphMethods<NodeObject<PortfolioNode>, LinkObject<PortfolioNode, PortfolioLink>>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const nodes = usePortfolioStore((s) => s.nodes);
  const links = usePortfolioStore((s) => s.links);
  const setSelectedNodeId = usePortfolioStore((s) => s.setSelectedNodeId);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState<NodeObject<PortfolioNode> | null>(null);

  // ── ResizeObserver to fill container ───────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    };

    updateSize();

    const observer = new ResizeObserver(() => updateSize());
    observer.observe(el);

    window.addEventListener('resize', updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // ── Physics engine tuning ──────────────────────────────────────────────────
  useEffect(() => {
    if (!fgRef.current) return;

    const charge = fgRef.current.d3Force('charge');
    if (charge) {
      charge.strength(-400);
    }

    const link = fgRef.current.d3Force('link');
    if (link) {
      link.distance(100);
    }

    fgRef.current.d3ReheatSimulation();
  }, []);

  // ── Node sizing helper ───────────────────────────────────────────────────
  const getNodeRadius = useCallback((node: NodeObject<PortfolioNode>) => {
    if (node.group === 'project' || node.group === 'experience') return 8;
    if (node.group === 'education') return 6;
    return 4;
  }, []);

  // ── Custom node renderer ───────────────────────────────────────────────────
  const nodeCanvasObject = useCallback(
    (node: NodeObject<PortfolioNode>, ctx: CanvasRenderingContext2D) => {
      const isHovered = hoveredNode !== null && node.id === hoveredNode.id;
      const radius = getNodeRadius(node);
      const x = node.x ?? 0;
      const y = node.y ?? 0;

      // Circle fill
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = '#1c1b1b';
      ctx.fill();

      // Circle stroke
      ctx.strokeStyle = isHovered ? '#adc6ff' : '#424754';
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.stroke();

      // Label for project / experience nodes only
      if (node.group === 'project' || node.group === 'experience') {
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#e5e2e1';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.label, x, y + radius + 6);
      }
    },
    [hoveredNode, getNodeRadius]
  );

  // ── Hit-area paint for custom shapes ───────────────────────────────────────
  const nodePointerAreaPaint = useCallback(
    (node: NodeObject<PortfolioNode>, color: string, ctx: CanvasRenderingContext2D) => {
      const radius = getNodeRadius(node) + 4; // slightly larger for easier hovering
      const x = node.x ?? 0;
      const y = node.y ?? 0;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
    },
    [getNodeRadius]
  );

  // ── Interaction handlers ───────────────────────────────────────────────────
  const handleNodeHover = useCallback((node: NodeObject<PortfolioNode> | null) => {
    setHoveredNode(node);
  }, []);

  const handleNodeClick = useCallback(
    (node: NodeObject<PortfolioNode>) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  return (
    <div ref={containerRef} className="h-full w-full">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <ForceGraph2D<PortfolioNode, PortfolioLink>
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={{ nodes, links }}
          backgroundColor="#131313"
          // Links
          linkColor={() => '#424754'}
          linkWidth={1}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={1.5}
          linkDirectionalParticleColor={() => '#adc6ff'}
          // Nodes
          nodeCanvasObjectMode={() => 'replace'}
          nodeCanvasObject={nodeCanvasObject}
          nodePointerAreaPaint={nodePointerAreaPaint}
          // Interaction
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
          showPointerCursor={true}
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
        />
      )}
    </div>
  );
}
