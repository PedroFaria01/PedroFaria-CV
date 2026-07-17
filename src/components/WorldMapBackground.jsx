import { memo, useEffect, useMemo, useRef } from 'react';
import DottedMap from 'dotted-map/without-countries';
import { animate, cubicBezier } from 'animejs';
import worldMapGrid from '../data/worldMapGrid.json';
import portugalMapGrid from '../data/portugalMapGrid.json';
import './WorldMapBackground.css';

const EASE_OUT = cubicBezier(0.22, 1, 0.36, 1);

const worldMap = new DottedMap({ map: worldMapGrid });
const portugalMap = new DottedMap({ map: portugalMapGrid });

const worldDots = worldMap.getPoints();
const portugalDots = portugalMap.getPoints();

const WORLD_VIEW_BOX = `0 0 ${worldMap.width} ${worldMap.height}`;
const PORTUGAL_VIEW_BOX = `0 0 ${portugalMap.width} ${portugalMap.height}`;

const Dots = memo(function Dots({ points }) {
  return (
    <>
      {points.map((dot) => (
        <circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={0.38}
          className="world-map-bg__dot"
        />
      ))}
    </>
  );
});

function locationKey(location) {
  return `${location.lat},${location.lng}`;
}

function usePins(map, locations) {
  return useMemo(() => {
    const seen = new Map();
    locations.forEach((location) => {
      const key = locationKey(location);
      if (!seen.has(key)) {
        seen.set(key, { ...map.getPin(location), label: location.label, key });
      }
    });
    return [...seen.values()];
  }, [map, locations]);
}

function MapLayer({
  map,
  dots,
  viewBox,
  locations,
  activeKey,
  isVisible,
  svgClassName = '',
  preserveAspectRatio = 'xMidYMid slice',
  pinRingRadius = 1.8,
  pinDotRadius = 0.7,
  cometRadius = 0.9,
  panStrength = 0.18,
  persistentRoute = true,
}) {
  const groupRef = useRef(null);
  const cometRef = useRef(null);
  const routeRef = useRef(null);
  const pinRefs = useRef({});
  const prevKeyRef = useRef(null);

  const pins = usePins(map, locations);
  const activePin = pins.find((pin) => pin.key === activeKey);

  const routeD = useMemo(() => {
    if (pins.length < 2) return '';
    return `M${pins[0].x},${pins[0].y} ${pins
      .slice(1)
      .map((pin) => `L${pin.x},${pin.y}`)
      .join(' ')}`;
  }, [pins]);

  useEffect(() => {
    if (!isVisible || !activePin) return;

    Object.entries(pinRefs.current).forEach(([key, el]) => {
      if (!el) return;
      animate(el, {
        scale: key === activeKey ? [1, 1.4] : 1,
        opacity: key === activeKey ? 1 : 0.45,
        duration: 500,
        ease: 'outElastic(1, 0.6)',
      });
    });

    if (groupRef.current && panStrength) {
      animate(groupRef.current, {
        translateX: (map.width / 2 - activePin.x) * panStrength,
        translateY: (map.height / 2 - activePin.y) * panStrength,
        duration: 900,
        ease: EASE_OUT,
      });
    }

    const prevKey = prevKeyRef.current;
    if (prevKey && prevKey !== activeKey && cometRef.current) {
      const fromPin = pins.find((pin) => pin.key === prevKey);
      if (fromPin) {
        cometRef.current.setAttribute('cx', fromPin.x);
        cometRef.current.setAttribute('cy', fromPin.y);
        animate(cometRef.current, {
          cx: [fromPin.x, activePin.x],
          cy: [fromPin.y, activePin.y],
          opacity: [1, 0],
          duration: 850,
          ease: 'inOutQuad',
        });

        if (!persistentRoute && routeRef.current) {
          animate(routeRef.current, {
            opacity: [0, 0.6, 0],
            duration: 850,
            ease: 'inOutQuad',
          });
        }
      }
    }
    prevKeyRef.current = activeKey;
  }, [activeKey, activePin, pins, isVisible, map, panStrength, persistentRoute]);

  return (
    <svg
      className={`world-map-bg__svg ${svgClassName}`.trim()}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
    >
      <g ref={groupRef}>
        <Dots points={dots} />
        {routeD && (
          <path
            ref={routeRef}
            d={routeD}
            className="world-map-bg__route"
            style={persistentRoute ? undefined : { opacity: 0 }}
          />
        )}
        <circle ref={cometRef} r={cometRadius} className="world-map-bg__comet" opacity={0} />
        {pins.map((pin) => (
          <g key={pin.key} transform={`translate(${pin.x}, ${pin.y})`}>
            <g
              ref={(el) => {
                pinRefs.current[pin.key] = el;
              }}
              className={`world-map-bg__pin${pin.key === activeKey ? ' is-active' : ''}`}
            >
              <circle r={pinRingRadius} className="world-map-bg__pin-ring" />
              <circle r={pinDotRadius} className="world-map-bg__pin-dot" />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}

function WorldMapBackground({ stages, activeIndex }) {
  const worldLayerRef = useRef(null);
  const portugalLayerRef = useRef(null);
  const modeRef = useRef(null);

  const worldLocations = useMemo(
    () => stages.filter((stage) => stage.location.map !== 'portugal').map((stage) => stage.location),
    [stages]
  );
  const portugalLocations = useMemo(
    () => stages.filter((stage) => stage.location.map === 'portugal').map((stage) => stage.location),
    [stages]
  );

  const activeStage = stages[activeIndex];
  const mode = activeStage?.location.map === 'portugal' ? 'portugal' : 'world';
  const activeKey = activeStage ? locationKey(activeStage.location) : null;

  useEffect(() => {
    if (modeRef.current === mode) return;
    modeRef.current = mode;

    if (worldLayerRef.current) {
      animate(worldLayerRef.current, {
        opacity: mode === 'world' ? [0, 1] : [1, 0],
        scale: mode === 'world' ? [1.05, 1] : 1,
        duration: 700,
        ease: EASE_OUT,
      });
    }
    if (portugalLayerRef.current) {
      animate(portugalLayerRef.current, {
        opacity: mode === 'portugal' ? [0, 1] : [1, 0],
        scale: mode === 'portugal' ? [1.08, 1] : 1,
        duration: 700,
        ease: EASE_OUT,
      });
    }
  }, [mode]);

  return (
    <div className="world-map-bg" aria-hidden="true">
      <div className="world-map-bg__layer" ref={worldLayerRef} style={{ opacity: mode === 'world' ? 1 : 0 }}>
        <MapLayer
          map={worldMap}
          dots={worldDots}
          viewBox={WORLD_VIEW_BOX}
          locations={worldLocations}
          activeKey={activeKey}
          isVisible={mode === 'world'}
        />
      </div>
      <div
        className="world-map-bg__layer"
        ref={portugalLayerRef}
        style={{ opacity: mode === 'portugal' ? 1 : 0 }}
      >
        <MapLayer
          map={portugalMap}
          dots={portugalDots}
          viewBox={PORTUGAL_VIEW_BOX}
          locations={portugalLocations}
          activeKey={activeKey}
          isVisible={mode === 'portugal'}
          svgClassName="world-map-bg__svg--portugal"
          preserveAspectRatio="xMidYMid meet"
          pinRingRadius={0.9}
          pinDotRadius={0.35}
          cometRadius={0.45}
          panStrength={0.12}
          persistentRoute={false}
        />
      </div>
    </div>
  );
}

export default WorldMapBackground;
