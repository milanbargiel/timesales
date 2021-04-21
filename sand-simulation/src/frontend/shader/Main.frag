precision mediump float;
uniform vec2 u_resolution;
uniform sampler2D u_tex;
uniform float u_debug;

vec3 lerpColor(vec3 cl, vec3 cr, float alpha) {
  return cl * alpha + cr * (1.0 - alpha);
}

float padding = 0.0;
vec3 applyPadding(vec3 cl, vec3 c, vec3 cr, float a) {
  if (a < padding) {
    float alpha = a / padding;
    return lerpColor(cl, c, alpha);
  } else if (a > 1.0 - padding) {
    float alpha = (a - (1.0 - padding)) / padding;
    return lerpColor(c, cr, alpha);
  }
  return c;
}

const float colorAmount = 4.0;
vec3 getColor(float index) {
  if (u_debug < 0.5) {
    if (index < 1.0) {
      return vec3(0.878, 0.815, 0.717);
    } else if (index < 2.0) {
      return vec3(0.803, 0.721, 0.600);
    } else if (index < 3.0) {
      return vec3(0.933, 0.874, 0.705);
    }
    return vec3(0.301, 0.298, 0.274);
    // return vec3(0.927, 0.917, 0.850);
  }

  if (index < 1.0) {
    return vec3(1.0, 0.0, 0.0);
  } else if (index < 2.0) {
    return vec3(0.0, 1.0, 0.0);
  } else if (index < 3.0) {
    return vec3(0.0, 0.0, 1.0);
  } else if (index < 4.0) {
    return vec3(0.0, 1.0, 1.0);
  }
  return vec3(1.0, 1.0, 0.0);
}

float map(float v, float fromMin, float fromMax, float toMin, float toMax) {
  float normalized = (v - fromMin) / (fromMax - fromMin);
  return toMin + normalized * toMax;
}

vec3 interpolateArray(float alpha) {
  float index = float(int((colorAmount - 0.7) * alpha));
  float before = max(index - 1.0, 0.0);
  float after = min(before + 2.0, 4.0);

  float a = map(alpha, alpha, after / colorAmount, 0.0, 1.0);

  return applyPadding(getColor(before), getColor(index), getColor(after), a);

  // return vec3(float(before), float(index), float(after));
}

void main() {

  vec2 texCoord = gl_FragCoord.xy / u_resolution;

  float floatColor = texture2D(u_tex, texCoord.xy).r;

  //   gl_FragColor.rgb = vec3(floatColor, floatColor, floatColor);
  gl_FragColor.rgb = interpolateArray(floatColor);

  gl_FragColor.a = floatColor < 0.0001 ? 0.0 : 1.0;
}