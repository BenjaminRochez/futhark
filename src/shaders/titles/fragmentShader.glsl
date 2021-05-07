uniform sampler2D uImage;
varying vec2 vUv;
float PI = 3.141592653589793238;
uniform float uOpacity;
void main()	{

	vec2 newUV = vUv;
	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	//vec4 view = vec4(uImage, vUv);
	vec4 oceanView = texture2D(uImage, newUV) * uOpacity;
	gl_FragColor = oceanView; 
	
}