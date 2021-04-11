// import vue from 'vue'
import sandSim from 'sand-simulation'

// class Test {
//   constructor() {
//     console.log("EYYY");
//   }
// }

export default ({ app }, inject) => {
  // Inject $botui(selector) in Vue, context and store.
  inject('sandSim', () => {
    sandSim.init({
      duration: 500,
      progress: 0,
      wasmPath: '/sand-backend.wasm',
    })
  })
}
