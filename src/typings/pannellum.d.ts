declare module 'pannellum/src/js/libpannellum.js' {}
declare module 'pannellum/src/js/pannellum.js' {}
declare module 'pannellum/src/js/RequestAnimationFrame' {}

type eventName = 'mousedown' | 'mouseup'

interface PannellumViewer {
  setHfov: (hfov: number, animated?: boolean | number) => PannellumViewer
  setYaw: (yaw: number, animated?: boolean | number) => PannellumViewer
  setPitch: (pitch: number, animated?: boolean | number) => PannellumViewer
  getHfov: () => number
  getYaw: () => number
  getPitch: () => number
  toggleFullscreen: () => void
  stopAutoRotate: () => void
  on: (eventName: eventName, callback: () => void) => PannellumViewer
}

interface PannellumProps {
  autoLoad?: boolean
  panorama: string
  showControls?: boolean
  showZoomCtrl?: boolean
  keyboardZoom?: boolean
  yaw?: number
  pitch?: number
  hfov?: number
  haov?: number
  maxHfov?: number
  minHfov?: number
  maxHfov?: number
  mouseZoom?: boolean
  type?: 'equirectangular' | 'cubemap'
  autoRotate?: number
}

// module with pannellum types so that they can be easily imported
declare module 'pannellum' {
  export { PannellumViewer, PannellumProps }
}

// pannellum lib defines pannellum as global variable
declare namespace pannellum {
  const viewer: (id: string, props: PannellumProps) => PannellumViewer
}
