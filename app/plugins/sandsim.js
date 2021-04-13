import sandSim from 'sand-simulation'

export default ({ app }, inject) => {
  // Make $sandsim(duration, progress) globally accessible
  inject('sandSim', (duration, progress) => {
    sandSim.init({
      duration,
      progress,
      wasmPath: '/sand-backend.wasm',
    })
  })
}
