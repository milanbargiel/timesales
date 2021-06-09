precision mediump float;
uniform vec2 u_resolution;
uniform sampler2D u_tex;
vec3 col1 = vec3(0.878, 0.815, 0.717);
vec3 col2 = vec3(0.803, 0.721, 0.600);
vec3 col3 = vec3(0.933, 0.874, 0.705);
vec3 lerpColor(vec3 cl, vec3 cr, float alpha) {
  return cl * alpha + cr * (1.0 - alpha);
}

float padding = 0.1;
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

void main() {
  vec2 texCoord = gl_FragCoord.xy / u_resolution;
  float floatColor = texture2D(u_tex, texCoord).r;
  if (floatColor == 0.0) {
    gl_FragColor.rgb = col1;
  } else if (floatColor < 0.333) {
    float a = floatColor / 0.333;
    gl_FragColor.rgb = applyPadding(col3, col1, col2, a);
  } else if (floatColor < 0.666) {
    float a = (floatColor - 0.333) / 0.333;
    gl_FragColor.rgb = applyPadding(col1, col2, col3, a);
  } else {
    float a = (floatColor - 0.666) / 0.333;
    gl_FragColor.rgb = applyPadding(col2, col3, col1, a);
  }
  gl_FragColor.a = floatColor < 0.0001 ? 0.0 : 1.0;
}