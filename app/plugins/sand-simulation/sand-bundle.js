// src/frontend/helpers/getSeconds.ts
var getSeconds_default = () => {
  return Math.floor(Date.now() / 1e3);
};

// src/frontend/helpers/debounce.ts
var debounce_default = (callback, time2) => {
  let interval;
  return (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      interval = null;
      callback(...args);
    }, time2);
  };
};

// src/frontend/helpers/getDims.ts
var scale = 0.5;
var getDims_default = () => {
  let width = 200;
  let height = 200;
  if (process["browser"] || "innerWidth" in globalThis) {
    width = window.innerWidth;
    height = window.innerHeight;
  }
  width *= scale;
  height *= scale;
  height = Math.round(height / 100) * 100;
  width = Math.round(width / 100) * 100;
  return {
    width,
    height,
    get scale() {
      return scale;
    },
    set scale(v) {
      scale = v;
    }
  };
};

// src/frontend/helpers/go.ts
if (typeof global !== "undefined") {
} else if (typeof window !== "undefined") {
  window.global = window;
} else if (typeof self !== "undefined") {
  self.global = self;
} else {
  throw new Error("cannot export Go (neither global, window nor self is defined)");
}
var enosys = () => {
  const err = new Error("not implemented");
  err.code = "ENOSYS";
  return err;
};
if (!global.fs) {
  let outputBuf = "";
  global.fs = {
    constants: {O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1},
    writeSync(fd, buf) {
      outputBuf += decoder.decode(buf);
      const nl = outputBuf.lastIndexOf("\n");
      if (nl != -1) {
        console.log(outputBuf.substr(0, nl));
        outputBuf = outputBuf.substr(nl + 1);
      }
      return buf.length;
    },
    write(fd, buf, offset, length, position, callback) {
      if (offset !== 0 || length !== buf.length || position !== null) {
        callback(enosys());
        return;
      }
      const n = this.writeSync(fd, buf);
      callback(null, n);
    },
    chmod(path, mode, callback) {
      callback(enosys());
    },
    chown(path, uid, gid, callback) {
      callback(enosys());
    },
    close(fd, callback) {
      callback(enosys());
    },
    fchmod(fd, mode, callback) {
      callback(enosys());
    },
    fchown(fd, uid, gid, callback) {
      callback(enosys());
    },
    fstat(fd, callback) {
      callback(enosys());
    },
    fsync(fd, callback) {
      callback(null);
    },
    ftruncate(fd, length, callback) {
      callback(enosys());
    },
    lchown(path, uid, gid, callback) {
      callback(enosys());
    },
    link(path, link, callback) {
      callback(enosys());
    },
    lstat(path, callback) {
      callback(enosys());
    },
    mkdir(path, perm, callback) {
      callback(enosys());
    },
    open(path, flags, mode, callback) {
      callback(enosys());
    },
    read(fd, buffer, offset, length, position, callback) {
      callback(enosys());
    },
    readdir(path, callback) {
      callback(enosys());
    },
    readlink(path, callback) {
      callback(enosys());
    },
    rename(from, to, callback) {
      callback(enosys());
    },
    rmdir(path, callback) {
      callback(enosys());
    },
    stat(path, callback) {
      callback(enosys());
    },
    symlink(path, link, callback) {
      callback(enosys());
    },
    truncate(path, length, callback) {
      callback(enosys());
    },
    unlink(path, callback) {
      callback(enosys());
    },
    utimes(path, atime, mtime, callback) {
      callback(enosys());
    }
  };
}
if (!global.process) {
  global.process = {
    getuid() {
      return -1;
    },
    getgid() {
      return -1;
    },
    geteuid() {
      return -1;
    },
    getegid() {
      return -1;
    },
    getgroups() {
      throw enosys();
    },
    pid: -1,
    ppid: -1,
    umask() {
      throw enosys();
    },
    cwd() {
      throw enosys();
    },
    chdir() {
      throw enosys();
    }
  };
}
if (!global.crypto && global.require) {
  const nodeCrypto = require("crypto");
  global.crypto = {
    getRandomValues(b) {
      nodeCrypto.randomFillSync(b);
    }
  };
}
if (!global.crypto) {
  throw new Error("global.crypto is not available, polyfill required (getRandomValues only)");
}
if (!global.performance) {
  global.performance = {
    now() {
      const [sec, nsec] = process.hrtime();
      return sec * 1e3 + nsec / 1e6;
    }
  };
}
if (!global.TextEncoder && global.require) {
  global.TextEncoder = require("util").TextEncoder;
}
if (!global.TextEncoder) {
  throw new Error("global.TextEncoder is not available, polyfill required");
}
if (!global.TextDecoder && global.require) {
  global.TextDecoder = require("util").TextDecoder;
}
if (!global.TextDecoder) {
  throw new Error("global.TextDecoder is not available, polyfill required");
}
var encoder = new TextEncoder();
var decoder = new TextDecoder("utf-8");
var logLine = [];
var go_default = class {
  constructor() {
    this._values = [];
    this.exited = false;
    this.importObject = {};
    this._callbackTimeouts = new Map();
    this._nextCallbackTimeoutID = 1;
    const mem = () => {
      return new DataView(this._inst.exports.memory.buffer);
    };
    const setInt64 = (addr, v) => {
      mem().setUint32(addr + 0, v, true);
      mem().setUint32(addr + 4, Math.floor(v / 4294967296), true);
    };
    const getInt64 = (addr) => {
      const low = mem().getUint32(addr + 0, true);
      const high = mem().getInt32(addr + 4, true);
      return low + high * 4294967296;
    };
    const loadValue = (addr) => {
      const f = mem().getFloat64(addr, true);
      if (f === 0) {
        return void 0;
      }
      if (!isNaN(f)) {
        return f;
      }
      const id = mem().getUint32(addr, true);
      return this._values[id];
    };
    const storeValue = (addr, v) => {
      const nanHead = 2146959360;
      if (typeof v === "number") {
        if (isNaN(v)) {
          mem().setUint32(addr + 4, nanHead, true);
          mem().setUint32(addr, 0, true);
          return;
        }
        if (v === 0) {
          mem().setUint32(addr + 4, nanHead, true);
          mem().setUint32(addr, 1, true);
          return;
        }
        mem().setFloat64(addr, v, true);
        return;
      }
      switch (v) {
        case void 0:
          mem().setFloat64(addr, 0, true);
          return;
        case null:
          mem().setUint32(addr + 4, nanHead, true);
          mem().setUint32(addr, 2, true);
          return;
        case true:
          mem().setUint32(addr + 4, nanHead, true);
          mem().setUint32(addr, 3, true);
          return;
        case false:
          mem().setUint32(addr + 4, nanHead, true);
          mem().setUint32(addr, 4, true);
          return;
      }
      let id = this._ids.get(v);
      if (id === void 0) {
        id = this._idPool.pop();
        if (id === void 0) {
          id = this._values.length;
        }
        this._values[id] = v;
        this._goRefCounts[id] = 0;
        this._ids.set(v, id);
      }
      this._goRefCounts[id]++;
      let typeFlag = 1;
      switch (typeof v) {
        case "string":
          typeFlag = 2;
          break;
        case "symbol":
          typeFlag = 3;
          break;
        case "function":
          typeFlag = 4;
          break;
      }
      mem().setUint32(addr + 4, nanHead | typeFlag, true);
      mem().setUint32(addr, id, true);
    };
    const loadSlice = (array, len) => {
      return new Uint8Array(this._inst.exports.memory.buffer, array, len);
    };
    const loadSliceOfValues = (array, len) => {
      const a = new Array(len);
      for (let i = 0; i < len; i++) {
        a[i] = loadValue(array + i * 8);
      }
      return a;
    };
    const loadString = (ptr, len) => {
      return decoder.decode(new DataView(this._inst.exports.memory.buffer, ptr, len));
    };
    const timeOrigin = Date.now() - performance.now();
    this.importObject = {
      wasi_unstable: {
        fd_write: function(fd, iovs_ptr, iovs_len, nwritten_ptr) {
          let nwritten = 0;
          if (fd == 1) {
            for (let iovs_i = 0; iovs_i < iovs_len; iovs_i++) {
              let iov_ptr = iovs_ptr + iovs_i * 8;
              let ptr = mem().getUint32(iov_ptr + 0, true);
              let len = mem().getUint32(iov_ptr + 4, true);
              for (let i = 0; i < len; i++) {
                let c = mem().getUint8(ptr + i);
                if (c == 13) {
                } else if (c == 10) {
                  let line = decoder.decode(new Uint8Array(logLine));
                  logLine = [];
                  console.log(line);
                } else {
                  logLine.push(c);
                }
              }
            }
          } else {
            console.error("invalid file descriptor:", fd);
          }
          mem().setUint32(nwritten_ptr, nwritten, true);
          return 0;
        }
      },
      env: {
        "runtime.ticks": () => {
          return timeOrigin + performance.now();
        },
        "runtime.sleepTicks": (timeout) => {
          setTimeout(this._inst.exports.go_scheduler, timeout);
        },
        "syscall.Exit": (code) => {
          throw "trying to exit with code " + code;
        },
        "syscall/js.finalizeRef": (sp) => {
          console.error("syscall/js.finalizeRef not implemented");
        },
        "syscall/js.stringVal": (ret_ptr, value_ptr, value_len) => {
          const s = loadString(value_ptr, value_len);
          storeValue(ret_ptr, s);
        },
        "syscall/js.valueGet": (retval, v_addr, p_ptr, p_len) => {
          let prop = loadString(p_ptr, p_len);
          let value = loadValue(v_addr);
          let result = Reflect.get(value, prop);
          storeValue(retval, result);
        },
        "syscall/js.valueSet": (v_addr, p_ptr, p_len, x_addr) => {
          const v = loadValue(v_addr);
          const p = loadString(p_ptr, p_len);
          const x = loadValue(x_addr);
          Reflect.set(v, p, x);
        },
        "syscall/js.valueDelete": (v_addr, p_ptr, p_len) => {
          const v = loadValue(v_addr);
          const p = loadString(p_ptr, p_len);
          Reflect.deleteProperty(v, p);
        },
        "syscall/js.valueIndex": (ret_addr, v_addr, i) => {
          storeValue(ret_addr, Reflect.get(loadValue(v_addr), i));
        },
        "syscall/js.valueSetIndex": (v_addr, i, x_addr) => {
          Reflect.set(loadValue(v_addr), i, loadValue(x_addr));
        },
        "syscall/js.valueCall": (ret_addr, v_addr, m_ptr, m_len, args_ptr, args_len) => {
          const v = loadValue(v_addr);
          const name = loadString(m_ptr, m_len);
          const args = loadSliceOfValues(args_ptr, args_len);
          try {
            const m = Reflect.get(v, name);
            storeValue(ret_addr, Reflect.apply(m, v, args));
            mem().setUint8(ret_addr + 8, 1);
          } catch (err) {
            storeValue(ret_addr, err);
            mem().setUint8(ret_addr + 8, 0);
          }
        },
        "syscall/js.valueInvoke": (ret_addr, v_addr, args_ptr, args_len) => {
          try {
            const v = loadValue(v_addr);
            const args = loadSliceOfValues(args_ptr, args_len);
            storeValue(ret_addr, Reflect.apply(v, void 0, args));
            mem().setUint8(ret_addr + 8, 1);
          } catch (err) {
            storeValue(ret_addr, err);
            mem().setUint8(ret_addr + 8, 0);
          }
        },
        "syscall/js.valueNew": (ret_addr, v_addr, args_ptr, args_len) => {
          const v = loadValue(v_addr);
          const args = loadSliceOfValues(args_ptr, args_len);
          try {
            storeValue(ret_addr, Reflect.construct(v, args));
            mem().setUint8(ret_addr + 8, 1);
          } catch (err) {
            storeValue(ret_addr, err);
            mem().setUint8(ret_addr + 8, 0);
          }
        },
        "syscall/js.valueLength": (v_addr) => {
          return loadValue(v_addr).length;
        },
        "syscall/js.valuePrepareString": (ret_addr, v_addr) => {
          const s = String(loadValue(v_addr));
          const str = encoder.encode(s);
          storeValue(ret_addr, str);
          setInt64(ret_addr + 8, str.length);
        },
        "syscall/js.valueLoadString": (v_addr, slice_ptr, slice_len, slice_cap) => {
          const str = loadValue(v_addr);
          loadSlice(slice_ptr, slice_len).set(str);
        },
        "syscall/js.valueInstanceOf": (v_addr, t_addr) => {
          return loadValue(v_addr) instanceof loadValue(t_addr);
        },
        "syscall/js.copyBytesToGo": (ret_addr, dest_addr, dest_len, dest_cap, source_addr) => {
          let num_bytes_copied_addr = ret_addr;
          let returned_status_addr = ret_addr + 4;
          const dst = loadSlice(dest_addr, dest_len);
          const src = loadValue(source_addr);
          if (!(src instanceof Uint8Array)) {
            mem().setUint8(returned_status_addr, 0);
            return;
          }
          const toCopy = src.subarray(0, dst.length);
          dst.set(toCopy);
          setInt64(num_bytes_copied_addr, toCopy.length);
          mem().setUint8(returned_status_addr, 1);
        },
        "syscall/js.copyBytesToJS": (ret_addr, dest_addr, source_addr, source_len, source_cap) => {
          let num_bytes_copied_addr = ret_addr;
          let returned_status_addr = ret_addr + 4;
          const dst = loadValue(dest_addr);
          const src = loadSlice(source_addr, source_len);
          if (!(dst instanceof Uint8Array)) {
            mem().setUint8(returned_status_addr, 0);
            return;
          }
          const toCopy = src.subarray(0, dst.length);
          dst.set(toCopy);
          setInt64(num_bytes_copied_addr, toCopy.length);
          mem().setUint8(returned_status_addr, 1);
        }
      }
    };
  }
  async run(instance) {
    this._inst = instance;
    this._values = [
      NaN,
      0,
      null,
      true,
      false,
      global,
      this
    ];
    this._goRefCounts = [];
    this._ids = new Map();
    this._idPool = [];
    this.exited = false;
    const mem = new DataView(this._inst.exports.memory.buffer);
    while (true) {
      const callbackPromise = new Promise((resolve) => {
        this._resolveCallbackPromise = () => {
          if (this.exited) {
            throw new Error("bad callback: Go program has already exited");
          }
          setTimeout(resolve, 0);
        };
      });
      this._inst.exports._start();
      if (this.exited) {
        break;
      }
      await callbackPromise;
    }
  }
  _resume() {
    if (this.exited) {
      throw new Error("Go program has already exited");
    }
    this._inst.exports.resume();
    if (this.exited) {
      this._resolveExitPromise();
    }
  }
  _makeFuncWrapper(id) {
    const go2 = this;
    return function() {
      const event = {id, this: this, args: arguments, result: {}};
      go2._pendingEvent = event;
      go2._resume();
      return event.result;
    };
  }
};
var go_default2 = go_default;

// src/frontend/createBackend.ts
var go = new go_default2();
var wasm;
var createBackend_default = (WASM_URL = "build/sand-backend.wasm") => new Promise((resolve, reject) => {
  if ("instantiateStreaming" in WebAssembly) {
    WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject).then(function(obj) {
      wasm = obj.instance;
      go.run(wasm);
      resolve(wasm.exports);
    });
  } else {
    fetch(WASM_URL).then((resp) => resp.arrayBuffer()).then((bytes) => WebAssembly.instantiate(bytes, go.importObject).then(function(obj) {
      wasm = obj.instance;
      go.run(wasm);
      resolve(wasm.exports);
    }));
  }
});

// src/frontend/shader/Main.frag
var Main_default = "precision mediump float;\n#define GLSLIFY 1\nuniform vec2 u_resolution;uniform sampler2D u_tex;vec3 col1=vec3(0.878,0.815,0.717);vec3 col2=vec3(0.803,0.721,0.600);vec3 col3=vec3(0.933,0.874,0.705);vec3 lerpColor(vec3 cl,vec3 cr,float alpha){return cl*alpha+cr*(1.0-alpha);}float padding=0.1;vec3 applyPadding(vec3 cl,vec3 c,vec3 cr,float a){if(a<padding){float alpha=a/padding;return lerpColor(cl,c,alpha);}else if(a>1.0-padding){float alpha=(a-(1.0-padding))/padding;return lerpColor(c,cr,alpha);}return c;}void main(){vec2 texCoord=gl_FragCoord.xy/u_resolution;float floatColor=texture2D(u_tex,texCoord).r;if(floatColor==0.0){gl_FragColor.rgb=col1;}else if(floatColor<0.333){float a=floatColor/0.333;gl_FragColor.rgb=applyPadding(col3,col1,col2,a);}else if(floatColor<0.666){float a=(floatColor-0.333)/0.333;gl_FragColor.rgb=applyPadding(col1,col2,col3,a);}else{float a=(floatColor-0.666)/0.333;gl_FragColor.rgb=applyPadding(col2,col3,col1,a);}gl_FragColor.a=floatColor<0.0001 ? 0.0 : 1.0;}";

// src/frontend/shader/Main.vert
var Main_default2 = "#define GLSLIFY 1\nattribute vec2 a_position;void main(){gl_Position=vec4(a_position,0,1);}";

// src/frontend/createCanvas.ts
var createCanvas_default = ({
  pixels,
  width,
  height
}) => {
  var canvas2 = document.createElement("canvas");
  document.body.append(canvas2);
  canvas2.width = width;
  canvas2.height = height;
  const gl = canvas2.getContext("webgl");
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, Main_default2);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(vertexShader));
    throw new Error("Failed to compile vertex shader");
  }
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, Main_default);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(fragmentShader));
    throw new Error("Failed to compile fragment shader");
  }
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    throw new Error("Failed to link program");
  }
  gl.useProgram(program);
  const positionLocation = gl.getAttribLocation(program, "a_position");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  gl.uniform2f(resolutionLocation, canvas2.width, canvas2.height);
  const debugLocation = gl.getUniformLocation(program, "u_debug");
  gl.uniform1f(debugLocation, 0);
  window.setDebug = (v) => {
    gl.uniform1f(debugLocation, v ? 1 : 0);
  };
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  function update2() {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width, height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, pixels);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  function resize(_w, _h, p) {
    width = _w;
    height = _h;
    pixels = p;
  }
  return {
    update: update2,
    resize,
    get width() {
      return width;
    },
    get height() {
      return height;
    },
    el: canvas2
  };
};

// src/frontend/createSound.ts
var createSound_default = () => {
  var AudioContext = window.AudioContext || window["webkitAudioContext"] || false;
  if (!AudioContext) {
    return {
      setVolume: (v) => {
      }
    };
  }
  const ctx = new AudioContext();
  const bufferSize = 4096;
  const pinkNoise = function() {
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0;
    const node = ctx.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = function(e) {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.011;
        b6 = white * 0.115926;
      }
    };
    return node;
  }();
  const gainNode = ctx.createGain();
  gainNode.gain.value = 0.1;
  pinkNoise.connect(gainNode);
  gainNode.connect(ctx.destination);
  return {
    setVolume: (v) => {
      gainNode.gain.value = v;
    },
    pause() {
      ctx.state === "running" && ctx.suspend();
    },
    resume() {
      ctx.state !== "running" && ctx.resume();
    }
  };
};

// src/frontend/perfomanceKeeper.ts
var perfomanceKeeper_default = (resize) => {
  let t, i = 0;
  let measurements = [];
  const optimalMS = 25;
  const worstMaxMS = 100;
  const dims = getDims_default();
  return {
    start: () => {
      t = performance.now();
    },
    end: () => {
      i++;
      measurements = [...measurements.slice(-59), performance.now() - t];
      if (i % 30 == 0) {
        let sum = 0;
        for (let i2 = 0; i2 < measurements.length; i2++) {
          sum += measurements[i2];
        }
        const avg = Math.floor(sum / measurements.length);
        if (avg > optimalMS - 5 && avg < optimalMS + 5)
          return;
        console.log("[PERF] ", avg, "ms");
        if (avg < optimalMS) {
          const howGoodIsIt = (optimalMS - avg) / optimalMS;
          const s = 1 + howGoodIsIt * 0.25;
          console.log("[PERF] increase scale by", s);
          dims.scale *= s;
          const {width, height} = getDims_default();
          resize(width, height);
        } else {
          const howBadIsIt = Math.min(avg - optimalMS, worstMaxMS) / worstMaxMS;
          const s = 1 - howBadIsIt * 0.25;
          console.log("[PERF] decrease scale by", s);
          dims.scale *= s;
          const {width, height} = getDims_default();
          resize(width, height);
        }
      }
    }
  };
};

// src/frontend/timeKeeper.ts
var duration = 60;
var time = 0;
var progress = 1;
var isPaused = false;
var lN;
var lastTime = getSeconds_default();
var update = () => {
  if (isPaused)
    return;
  let cTime = getSeconds_default();
  let elapsedTimeSinceLastUpdate = cTime - lastTime;
  time += elapsedTimeSinceLastUpdate;
  if (elapsedTimeSinceLastUpdate > 0) {
    lastTime = cTime;
  }
  const n = duration - time;
  progress = Math.floor(n / duration * 100) / 100;
  if (!lN)
    lN = n;
  lN = n;
};
function pause() {
  isPaused = true;
  console.log("[TIME] paused");
}
function resume() {
  lastTime = getSeconds_default();
  isPaused = false;
  console.log("[TIME] unpaused");
}
function setDuration(d) {
  console.log("[TIME] set duration ", d);
  duration = d;
}
function getProgress() {
  return progress;
}
function setProgress(p) {
  time = duration - Math.floor(duration * p);
  console.log("[TIME] set progress ", time);
}
var timeKeeper_default = {
  update,
  getProgress,
  setDuration,
  setProgress,
  pause,
  resume
};

// src/frontend/index.ts
var backend;
var canvas;
var sound;
var simPaused = false;
async function init({
  duration: duration2,
  progress: progress2,
  wasmPath
}) {
  let {width, height} = getDims_default();
  let pixels = new Uint8Array(width * height);
  window["sandPixelArray"] = pixels;
  backend = await createBackend_default(wasmPath);
  await backend.CreateCanvas(width, height);
  canvas = createCanvas_default({pixels, width, height});
  sound = createSound_default();
  timeKeeper_default.setDuration(duration2 || 60);
  timeKeeper_default.setProgress(progress2 || 1);
  function resize(_w, _h) {
    if (_w != width || _h != height) {
      width = _w;
      height = _h;
      pixels = new Uint8Array(width * height);
      window["sandPixelArray"] = pixels;
      backend.Resize(width, height);
      canvas.resize(width, height, pixels);
    }
  }
  const performanceKeeper = perfomanceKeeper_default(resize);
  let _promise;
  let updates = 100;
  let isResizing = false;
  async function updateSim() {
    if (_promise)
      return;
    _promise = await backend.Update(timeKeeper_default.getProgress());
    updates = _promise;
    _promise = false;
  }
  async function render() {
    if (!simPaused && !isResizing && timeKeeper_default.getProgress() > -0.05) {
      performanceKeeper.start();
      updateSim();
      timeKeeper_default.update();
      sound.resume();
      sound.setVolume(Math.min(0.05, updates / 4e6));
      canvas.update();
      performanceKeeper.end();
    } else {
      sound.pause();
    }
    requestAnimationFrame(render);
  }
  window.addEventListener("resize", debounce_default(() => {
    const {width: _w, height: _h} = getDims_default();
    resize(_w, _h);
  }, 500));
  render();
}
function pause2() {
  simPaused = !simPaused;
  if (simPaused) {
    timeKeeper_default.pause();
    sound.pause();
  } else {
    timeKeeper_default.resume();
    sound.resume();
  }
}
function getProgress2() {
  return timeKeeper_default.getProgress();
}
var frontend_default = {
  init,
  pause: pause2,
  getProgress: getProgress2
};
export {
  frontend_default as default
};
//# sourceMappingURL=sand-bundle.js.map
