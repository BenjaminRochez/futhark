uniform float time;
varying vec2 vUv;
uniform vec2 pixels;
uniform float uXDisplacement;
uniform float uYDisplacement;

float PI = 3.141592653589793238;
void main() {
  vUv = uv;
  vec3 newPosition = position;
  newPosition.x += (uXDisplacement) / 5.;
  newPosition.y += (uYDisplacement) / 5.;
  newPosition.z *= sin(uXDisplacement) * 10.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
} 