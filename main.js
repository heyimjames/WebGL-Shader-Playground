// WebGL Shader Playground with Presets

// DOM elements
const canvas = document.getElementById('glCanvas');
const runBtn = document.getElementById('runBtn');
const vertexEditor = document.getElementById('vertexEditor');
const fragmentEditor = document.getElementById('fragmentEditor');
const logEl = document.getElementById('log');
const shaderSelect = document.getElementById('shaderSelect');
const parametersList = document.getElementById('parametersList');
const shaderName = document.getElementById('shaderName');
const shaderIcon = document.getElementById('shaderIcon');
const shaderDescription = document.getElementById('shaderDescription');
const helpButton = document.getElementById('helpButton');
const helpModal = document.getElementById('helpModal');
const closeHelp = document.getElementById('closeHelp');

// Tab elements
const tabs = document.querySelectorAll('.tab');
const editorPanes = document.querySelectorAll('.editor-pane');

// Save/Export elements
const saveBtn = document.getElementById('saveBtn');
const exportBtn = document.getElementById('exportBtn');
const shareBtn = document.getElementById('shareBtn');
const saveModal = document.getElementById('saveModal');
const exportModal = document.getElementById('exportModal');
const shareModal = document.getElementById('shareModal');
const closeSave = document.getElementById('closeSave');
const closeExport = document.getElementById('closeExport');
const closeShare = document.getElementById('closeShare');
const saveNameInput = document.getElementById('saveNameInput');
const exportNameInput = document.getElementById('exportNameInput');
const saveList = document.getElementById('saveList');
const saveShaderBtn = document.getElementById('saveShaderBtn');
const downloadBtn = document.getElementById('downloadBtn');
const cancelSaveBtn = document.getElementById('cancelSaveBtn');
const cancelExportBtn = document.getElementById('cancelExportBtn');
const shareUrl = document.getElementById('shareUrl');
const copyShareBtn = document.getElementById('copyShareBtn');
const fpsCounter = document.getElementById('fpsCounter');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const canvasContainer = document.getElementById('canvasContainer');
const addTextureBtn = document.getElementById('addTextureBtn');
const textureInput = document.getElementById('textureInput');
const textureList = document.getElementById('textureList');

// Line numbers functionality
const vertexLineNumbers = document.getElementById('vertexLineNumbers');
const fragmentLineNumbers = document.getElementById('fragmentLineNumbers');

// Shader descriptions
const shaderDescriptions = {
    kaleidoscope: {
        icon: "🔮",
        description: "Symmetrical patterns that create mesmerizing kaleidoscope effects. Mouse controls rotation and complexity.",
        categories: ["2d", "interactive", "generative"]
    },
    glass: {
        icon: "🔍",
        description: "Realistic glass refraction with chromatic aberration. Move your mouse to shift the view angle.",
        categories: ["2d", "interactive"]
    },
    rainbow: {
        icon: "🌈",
        description: "Smooth animated gradient with customizable speed and scale. Perfect for backgrounds.",
        categories: ["2d", "generative"]
    },
    plasma: {
        icon: "🌊",
        description: "Classic plasma effect with flowing, organic patterns. Adjust intensity and frequency.",
        categories: ["2d", "generative"]
    },
    mandelbrot: {
        icon: "🌀",
        description: "Explore the infinite complexity of the Mandelbrot set. Use mouse to navigate.",
        categories: ["2d", "interactive"]
    },
    raymarching: {
        icon: "🔵",
        description: "3D spheres rendered using ray marching technique. Features dynamic lighting.",
        categories: ["3d", "interactive"]
    },
    voronoi: {
        icon: "🔶",
        description: "Animated Voronoi cells creating organic, cellular patterns.",
        categories: ["2d", "generative"]
    },
    fractal: {
        icon: "🌿",
        description: "Multi-octave fractal noise for natural-looking textures and patterns.",
        categories: ["2d", "generative"]
    },
    waves: {
        icon: "🌊",
        description: "Interference patterns from multiple wave sources. Hypnotic and mathematical.",
        categories: ["2d", "generative"]
    },
    tunnel: {
        icon: "🌀",
        description: "Psychedelic tunnel effect with swirling colors and motion.",
        categories: ["2d", "generative", "interactive"]
    },
    imageEffect: {
        icon: "🖼️",
        description: "Image processing effects. Load a texture and apply various filters like blur, edge detection, or color adjustments.",
        categories: ["2d", "image", "interactive"]
    },
    fractal3d: {
        icon: "🌌",
        description: "3D fractal with ray marching and dynamic lighting. Navigate through infinite mathematical structures.",
        categories: ["3d", "interactive", "generative"]
    }
};

// Shader presets
const SHADERS = {
    kaleidoscope: {
        name: "Kaleidoscope",
        vertex: `
attribute vec4 aVertexPosition;
void main() {
    gl_Position = aVertexPosition;
}`,
        fragment: `
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_segments;
uniform float u_complexity;
uniform float u_colorShift;

vec2 kaleidoscope(vec2 uv, float n) {
    float angle = 3.1415926 * 2.0 / n;
    float a = atan(uv.y, uv.x) + angle * 0.5;
    a = mod(a, angle) - angle * 0.5;
    return vec2(cos(a), sin(a)) * length(uv);
}

void main() {
    vec2 st = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
    vec2 mouse = (u_mouse - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
    
    // Apply kaleidoscope transformation
    st = kaleidoscope(st, u_segments);
    
    // Create pattern
    float d = length(st);
    float a = atan(st.y, st.x);
    
    vec3 color = vec3(0.0);
    
    for (float i = 0.0; i < 3.0; i++) {
        vec2 p = st * (2.0 + i * u_complexity);
        p = fract(p + u_time * 0.1 + i * 0.1);
        
        float pattern = sin(p.x * 10.0) * sin(p.y * 10.0);
        pattern += sin(distance(p, vec2(0.5)) * 20.0 - u_time * 2.0);
        
        vec3 col = 0.5 + 0.5 * cos(u_time + pattern + vec3(0, 2, 4) + i * u_colorShift);
        color += col / (3.0 + d * 2.0);
    }
    
    // Mouse influence
    float mouseDist = length(st - mouse);
    color += (1.0 - smoothstep(0.0, 0.5, mouseDist)) * 0.2;
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_segments: { type: 'float', value: 6.0, min: 3.0, max: 12.0, step: 1.0, name: 'Segments' },
            u_complexity: { type: 'float', value: 0.5, min: 0.1, max: 2.0, step: 0.1, name: 'Complexity' },
            u_colorShift: { type: 'float', value: 1.0, min: 0.0, max: 3.0, step: 0.1, name: 'Color Shift' }
        }
    },
    
    glass: {
        name: "Glass Refraction",
        vertex: `
attribute vec4 aVertexPosition;
void main() {
    gl_Position = aVertexPosition;
}`,
        fragment: `
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_refraction;
uniform float u_dispersion;
uniform float u_glassiness;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float noise(vec2 p) {
    return sin(p.x * 10.0) * sin(p.y * 10.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 mouse = u_mouse.xy / u_resolution.xy;
    
    // Create glass-like distortion
    vec2 distortion = vec2(
        noise(uv * 5.0 + u_time * 0.1),
        noise(uv * 5.0 - u_time * 0.1)
    ) * u_refraction * 0.1;
    
    // Apply refraction
    vec2 refracted = uv + distortion;
    
    // Chromatic aberration for dispersion effect
    float r = sin((refracted.x + distortion.x * u_dispersion) * 10.0 + u_time) * 0.5 + 0.5;
    float g = sin((refracted.x) * 10.0 + u_time) * 0.5 + 0.5;
    float b = sin((refracted.x - distortion.x * u_dispersion) * 10.0 + u_time) * 0.5 + 0.5;
    
    // Glass tint
    vec3 glassColor = vec3(0.9, 0.95, 1.0);
    vec3 color = vec3(r, g, b) * glassColor;
    
    // Fresnel effect
    float fresnel = pow(1.0 - abs(dot(normalize(vec2(uv - 0.5)), vec2(0.0, 1.0))), 2.0);
    color += fresnel * u_glassiness * 0.3;
    
    // Mouse interaction
    float mouseDist = length(uv - mouse);
    color += (1.0 - smoothstep(0.0, 0.3, mouseDist)) * 0.2;
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_refraction: { type: 'float', value: 1.0, min: 0.0, max: 2.0, step: 0.1, name: 'Refraction' },
            u_dispersion: { type: 'float', value: 0.5, min: 0.0, max: 1.0, step: 0.05, name: 'Dispersion' },
            u_glassiness: { type: 'float', value: 1.0, min: 0.0, max: 2.0, step: 0.1, name: 'Glassiness' }
        }
    },
    
    rainbow: {
        name: "Rainbow Gradient",
        vertex: `
attribute vec4 aVertexPosition;
void main() {
    gl_Position = aVertexPosition;
}`,
        fragment: `
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_speed;
uniform float u_scale;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec3 color = 0.5 + 0.5 * cos(u_time * u_speed + st.xyx * u_scale + vec3(0,2,4));
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_speed: { type: 'float', value: 1.0, min: 0.1, max: 5.0, step: 0.1, name: 'Speed' },
            u_scale: { type: 'float', value: 6.28, min: 1.0, max: 20.0, step: 0.1, name: 'Scale' }
        }
    },
    
    plasma: {
        name: "Plasma",
        vertex: `
attribute vec4 aVertexPosition;
void main() {
    gl_Position = aVertexPosition;
}`,
        fragment: `
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;
uniform float u_frequency;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 mouse = u_mouse / u_resolution.xy;
    
    float v = 0.0;
    v += sin((st.x + u_time) * u_frequency);
    v += sin((st.y + u_time) * u_frequency);
    v += sin((st.x + st.y + u_time) * u_frequency);
    v += sin(sqrt(st.x * st.x + st.y * st.y + 1.0) * u_frequency);
    v = v / 2.0;
    
    vec3 color = vec3(sin(v * 3.14 * u_intensity), 
                      sin(v * 3.14 * u_intensity + 2.094), 
                      sin(v * 3.14 * u_intensity + 4.188));
    
    gl_FragColor = vec4(color * 0.5 + 0.5, 1.0);
}`,
        uniforms: {
            u_intensity: { type: 'float', value: 2.0, min: 0.5, max: 5.0, step: 0.1, name: 'Intensity' },
            u_frequency: { type: 'float', value: 5.0, min: 1.0, max: 20.0, step: 0.5, name: 'Frequency' }
        }
    },
    
    mandelbrot: {
        name: "Mandelbrot Set",
        vertex: `
attribute vec4 aVertexPosition;
void main() {
    gl_Position = aVertexPosition;
}`,
        fragment: `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_zoom;
uniform float u_iterations;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 st = (gl_FragCoord.xy - u_resolution.xy * 0.5) / min(u_resolution.x, u_resolution.y);
    vec2 mouse = (u_mouse - u_resolution.xy * 0.5) / min(u_resolution.x, u_resolution.y);
    
    st = st / u_zoom - mouse;
    
    vec2 z = vec2(0.0);
    vec2 c = st;
    
    float n = 0.0;
    for (float i = 0.0; i < 100.0; i++) {
        if (i >= u_iterations) break;
        
        float x = (z.x * z.x - z.y * z.y) + c.x;
        float y = (z.y * z.x + z.x * z.y) + c.y;
        
        if ((x * x + y * y) > 4.0) break;
        z.x = x;
        z.y = y;
        n++;
    }
    
    vec3 color = hsv2rgb(vec3(n / u_iterations, 1.0, n < u_iterations ? 1.0 : 0.0));
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_zoom: { type: 'float', value: 0.5, min: 0.1, max: 10.0, step: 0.1, name: 'Zoom' },
            u_iterations: { type: 'float', value: 50.0, min: 10.0, max: 100.0, step: 5.0, name: 'Iterations' }
        }
    },
    
    raymarching: {
        name: "Raymarching Spheres",
        vertex: `
attribute vec4 aVertexPosition;
void main() {
    gl_Position = aVertexPosition;
}`,
        fragment: `
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_sphereSize;
uniform float u_lightIntensity;

float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

float map(vec3 p) {
    float d = sdSphere(p - vec3(0.0, 0.0, 0.0), u_sphereSize);
    d = min(d, sdSphere(p - vec3(sin(u_time) * 2.0, 0.0, 0.0), u_sphereSize * 0.7));
    d = min(d, sdSphere(p - vec3(0.0, cos(u_time) * 2.0, 0.0), u_sphereSize * 0.5));
    return d;
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
    ));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - u_resolution.xy * 0.5) / min(u_resolution.x, u_resolution.y);
    
    vec3 ro = vec3(0.0, 0.0, 5.0);
    vec3 rd = normalize(vec3(uv, -1.0));
    
    float t = 0.0;
    for (int i = 0; i < 100; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        if (d < 0.001) break;
        t += d;
        if (t > 20.0) break;
    }
    
    vec3 color = vec3(0.0);
    if (t < 20.0) {
        vec3 p = ro + rd * t;
        vec3 n = calcNormal(p);
        vec3 light = normalize(vec3(1.0, 1.0, 1.0));
        float diff = max(dot(n, light), 0.0) * u_lightIntensity;
        color = vec3(diff);
    }
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_sphereSize: { type: 'float', value: 1.0, min: 0.5, max: 2.0, step: 0.1, name: 'Sphere Size' },
            u_lightIntensity: { type: 'float', value: 1.0, min: 0.5, max: 2.0, step: 0.1, name: 'Light Intensity' }
        }
    },
    
    voronoi: {
        name: "Voronoi",
        vertex: `
attribute vec4 aVertexPosition;
void main() {
    gl_Position = aVertexPosition;
}`,
        fragment: `
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_cellSize;
uniform float u_animSpeed;

vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)),
              dot(st, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st *= u_cellSize;
    
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    
    float m_dist = 1.0;
    vec2 m_point;
    
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = random2(i_st + neighbor);
            point = 0.5 + 0.5 * sin(u_time * u_animSpeed + 6.2831 * point);
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);
            
            if (dist < m_dist) {
                m_dist = dist;
                m_point = point;
            }
        }
    }
    
    vec3 color = vec3(m_dist);
    color += vec3(m_point, 0.0);
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_cellSize: { type: 'float', value: 10.0, min: 5.0, max: 50.0, step: 1.0, name: 'Cell Size' },
            u_animSpeed: { type: 'float', value: 1.0, min: 0.0, max: 3.0, step: 0.1, name: 'Animation Speed' }
        }
    },
    
    fractal: {
        name: "Fractal Noise",
        vertex: `
attribute vec4 aVertexPosition;
void main() {
    gl_Position = aVertexPosition;
}`,
        fragment: `
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_octaves;
uniform float u_lacunarity;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) +
            (c - a) * u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    
    for (int i = 0; i < 6; i++) {
        if (float(i) >= u_octaves) break;
        value += amplitude * noise(st);
        st *= u_lacunarity;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st *= 5.0;
    
    vec3 color = vec3(0.0);
    color += fbm(st + u_time * 0.1);
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_octaves: { type: 'float', value: 4.0, min: 1.0, max: 6.0, step: 1.0, name: 'Octaves' },
            u_lacunarity: { type: 'float', value: 2.0, min: 1.5, max: 3.0, step: 0.1, name: 'Lacunarity' }
        }
    },
    
    waves: {
        name: "Wave Interference",
        vertex: `
attribute vec4 aVertexPosition;
void main() {
    gl_Position = aVertexPosition;
}`,
        fragment: `
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_waveCount;
uniform float u_waveSpeed;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 mouse = u_mouse / u_resolution.xy;
    
    float wave = 0.0;
    
    for (float i = 0.0; i < 10.0; i++) {
        if (i >= u_waveCount) break;
        vec2 center = vec2(
            0.5 + 0.4 * sin(u_time * 0.3 + i),
            0.5 + 0.4 * cos(u_time * 0.3 + i * 1.3)
        );
        float dist = distance(st, center);
        wave += sin(dist * 20.0 - u_time * u_waveSpeed) / (i + 1.0);
    }
    
    wave += sin(distance(st, mouse) * 30.0 - u_time * u_waveSpeed * 1.5);
    
    vec3 color = vec3(0.5 + 0.5 * wave);
    color *= vec3(0.8, 0.9, 1.0);
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_waveCount: { type: 'float', value: 5.0, min: 1.0, max: 10.0, step: 1.0, name: 'Wave Count' },
            u_waveSpeed: { type: 'float', value: 2.0, min: 0.5, max: 5.0, step: 0.1, name: 'Wave Speed' }
        }
    },
    
    imageEffect: {
        name: "Image Effects",
        vertex: `
attribute vec4 aVertexPosition;
void main() {
    gl_Position = aVertexPosition;
}`,
        fragment: `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform sampler2D u_texture0;
uniform float u_effect;
uniform float u_intensity;
uniform float u_time;

vec4 blur(vec2 uv, float amount) {
    vec4 color = vec4(0.0);
    float total = 0.0;
    for (float x = -4.0; x <= 4.0; x++) {
        for (float y = -4.0; y <= 4.0; y++) {
            vec2 offset = vec2(x, y) * amount / u_resolution;
            float weight = 1.0 - length(vec2(x, y)) / 6.0;
            color += texture2D(u_texture0, uv + offset) * weight;
            total += weight;
        }
    }
    return color / total;
}

vec4 edgeDetect(vec2 uv) {
    vec2 texel = 1.0 / u_resolution;
    
    float tl = texture2D(u_texture0, uv + vec2(-texel.x, -texel.y)).r;
    float tm = texture2D(u_texture0, uv + vec2(0.0, -texel.y)).r;
    float tr = texture2D(u_texture0, uv + vec2(texel.x, -texel.y)).r;
    float ml = texture2D(u_texture0, uv + vec2(-texel.x, 0.0)).r;
    float mm = texture2D(u_texture0, uv).r;
    float mr = texture2D(u_texture0, uv + vec2(texel.x, 0.0)).r;
    float bl = texture2D(u_texture0, uv + vec2(-texel.x, texel.y)).r;
    float bm = texture2D(u_texture0, uv + vec2(0.0, texel.y)).r;
    float br = texture2D(u_texture0, uv + vec2(texel.x, texel.y)).r;
    
    float gx = -1.0 * tl + 1.0 * tr + -2.0 * ml + 2.0 * mr + -1.0 * bl + 1.0 * br;
    float gy = -1.0 * tl + -2.0 * tm + -1.0 * tr + 1.0 * bl + 2.0 * bm + 1.0 * br;
    
    float edge = length(vec2(gx, gy));
    return vec4(vec3(edge), 1.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec4 color = texture2D(u_texture0, uv);
    
    if (u_effect < 1.0) {
        // Original
        gl_FragColor = color;
    } else if (u_effect < 2.0) {
        // Blur
        vec4 blurred = blur(uv, u_intensity * 5.0);
        gl_FragColor = mix(color, blurred, u_effect - 1.0);
    } else if (u_effect < 3.0) {
        // Edge detection
        vec4 edges = edgeDetect(uv);
        gl_FragColor = mix(color, edges, u_effect - 2.0);
    } else if (u_effect < 4.0) {
        // Pixelate
        float pixels = 512.0 / (1.0 + u_intensity * 10.0);
        vec2 pixelUV = floor(uv * pixels) / pixels;
        vec4 pixelated = texture2D(u_texture0, pixelUV);
        gl_FragColor = mix(color, pixelated, u_effect - 3.0);
    } else if (u_effect < 5.0) {
        // Wave distortion
        vec2 distorted = uv + vec2(
            sin(uv.y * 10.0 + u_time) * u_intensity * 0.1,
            cos(uv.x * 10.0 + u_time) * u_intensity * 0.1
        );
        vec4 wave = texture2D(u_texture0, distorted);
        gl_FragColor = mix(color, wave, u_effect - 4.0);
    } else {
        // Chromatic aberration
        float amount = u_intensity * 0.01;
        vec4 chromatic;
        chromatic.r = texture2D(u_texture0, uv + vec2(amount, 0.0)).r;
        chromatic.g = texture2D(u_texture0, uv).g;
        chromatic.b = texture2D(u_texture0, uv - vec2(amount, 0.0)).b;
        chromatic.a = 1.0;
        gl_FragColor = mix(color, chromatic, u_effect - 5.0);
    }
}`,
        uniforms: {
            u_effect: { type: 'float', value: 0.0, min: 0.0, max: 6.0, step: 1.0, name: 'Effect Type' },
            u_intensity: { type: 'float', value: 1.0, min: 0.0, max: 2.0, step: 0.1, name: 'Intensity' }
        }
    },
    
    fractal3d: {
        name: "3D Fractal Explorer",
        vertex: `
attribute vec4 aVertexPosition;
void main() {
    gl_Position = aVertexPosition;
}`,
        fragment: `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_iterations;
uniform float u_detail;
uniform float u_glow;

const int MAX_STEPS = 100;
const float MIN_DIST = 0.001;
const float MAX_DIST = 100.0;

mat3 rotateX(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
}

mat3 rotateY(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
}

float mandelbulb(vec3 p) {
    vec3 z = p;
    float dr = 1.0;
    float r = 0.0;
    float power = 8.0 + sin(u_time * 0.1) * 2.0;
    
    for (int i = 0; i < 15; i++) {
        if (float(i) >= u_iterations) break;
        
        r = length(z);
        if (r > 2.0) break;
        
        float theta = acos(z.z / r);
        float phi = atan(z.y, z.x);
        dr = pow(r, power - 1.0) * power * dr + 1.0;
        
        float zr = pow(r, power);
        theta = theta * power;
        phi = phi * power;
        
        z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
        z += p;
    }
    
    return 0.5 * log(r) * r / dr;
}

float scene(vec3 p) {
    mat3 rot = rotateY(u_time * 0.2) * rotateX(u_time * 0.1);
    p = rot * p;
    return mandelbulb(p) * u_detail;
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        scene(p + e.xyy) - scene(p - e.xyy),
        scene(p + e.yxy) - scene(p - e.yxy),
        scene(p + e.yyx) - scene(p - e.yyx)
    ));
}

vec3 raymarch(vec3 ro, vec3 rd) {
    float t = 0.0;
    float glow = 0.0;
    
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * t;
        float d = scene(p);
        
        if (d < MIN_DIST) {
            vec3 n = getNormal(p);
            vec3 lightDir = normalize(vec3(0.5, 0.7, 0.3));
            
            float diff = max(dot(n, lightDir), 0.0);
            float spec = pow(max(dot(reflect(-lightDir, n), -rd), 0.0), 32.0);
            float ao = 1.0 - float(i) / float(MAX_STEPS);
            
            vec3 color = vec3(0.1, 0.3, 0.6) * diff;
            color += vec3(1.0) * spec * 0.5;
            color *= ao;
            color += vec3(0.1, 0.05, 0.2) * glow * u_glow;
            
            return color;
        }
        
        glow += 0.01 / (1.0 + d * d);
        t += d;
        
        if (t > MAX_DIST) break;
    }
    
    return vec3(0.05, 0.02, 0.1) + vec3(0.1, 0.05, 0.2) * glow * u_glow;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
    vec2 mouse = (u_mouse - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
    
    vec3 ro = vec3(0.0, 0.0, 3.0);
    vec3 rd = normalize(vec3(uv, -1.0));
    
    mat3 rotY = rotateY(mouse.x * 3.14);
    mat3 rotX = rotateX(mouse.y * 3.14);
    rd = rotY * rotX * rd;
    ro = rotY * rotX * ro;
    
    vec3 color = raymarch(ro, rd);
    
    // Tone mapping
    color = color / (1.0 + color);
    color = pow(color, vec3(0.4545));
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_iterations: { type: 'float', value: 10.0, min: 1.0, max: 15.0, step: 1.0, name: 'Fractal Iterations' },
            u_detail: { type: 'float', value: 1.0, min: 0.1, max: 2.0, step: 0.1, name: 'Detail Level' },
            u_glow: { type: 'float', value: 0.5, min: 0.0, max: 2.0, step: 0.1, name: 'Glow Intensity' }
        }
    },
    
    tunnel: {
        name: "Tunnel",
        vertex: `
attribute vec4 aVertexPosition;
void main() {
    gl_Position = aVertexPosition;
}`,
        fragment: `
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_tunnelSpeed;
uniform float u_tunnelTwist;

void main() {
    vec2 st = (gl_FragCoord.xy - u_resolution.xy * 0.5) / min(u_resolution.x, u_resolution.y);
    
    float a = atan(st.y, st.x) + u_time * u_tunnelTwist;
    float r = length(st);
    
    vec2 uv = vec2(0.3 / r + u_time * u_tunnelSpeed, a / 3.1415927);
    
    vec3 color = vec3(0.0);
    color.r = sin(uv.x * 10.0) * 0.5 + 0.5;
    color.g = sin(uv.y * 10.0) * 0.5 + 0.5;
    color.b = sin((uv.x + uv.y) * 10.0) * 0.5 + 0.5;
    
    color *= r;
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_tunnelSpeed: { type: 'float', value: 0.5, min: 0.1, max: 2.0, step: 0.1, name: 'Tunnel Speed' },
            u_tunnelTwist: { type: 'float', value: 0.2, min: 0.0, max: 1.0, step: 0.05, name: 'Tunnel Twist' }
        }
    }
};

// Current shader state
let currentShader = 'kaleidoscope';
let customShader = {
    vertex: SHADERS.kaleidoscope.vertex,
    fragment: SHADERS.kaleidoscope.fragment,
    uniforms: {}
};

// Texture management
let textures = [];
let textureUnits = [];

// Setup WebGL
const gl = canvas.getContext('webgl');
if (!gl) {
    alert('WebGL not supported.');
    throw new Error('WebGL unsupported');
}

// Fullscreen triangle buffer
const buffers = initBuffers(gl);

// Globals for animation
let programInfo = null;
let startTime = performance.now();
let mouse = [0, 0];
let uniformValues = {};

// FPS tracking
let showFPS = false;
let frameCount = 0;
let lastFPSUpdate = performance.now();
let currentFPS = 60;

// Performance monitoring
let performanceStats = {
    drawCalls: 0,
    shaderCompileTime: 0,
    textureMemory: 0,
    vertexCount: 0
};

// Auto-save functionality
let autoSaveTimer = null;
const AUTO_SAVE_KEY = 'shaderPlayground_autosave';
const autoSaveIndicator = document.querySelector('.auto-save-indicator');

function showAutoSaveIndicator() {
    autoSaveIndicator.classList.add('show');
    setTimeout(() => {
        autoSaveIndicator.classList.remove('show');
    }, 2000);
}

function autoSave() {
    const data = {
        vertex: vertexEditor.value,
        fragment: fragmentEditor.value,
        shader: currentShader,
        uniformValues: uniformValues,
        timestamp: Date.now()
    };
    
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(data));
    showAutoSaveIndicator();
}

function loadAutoSave() {
    const saved = localStorage.getItem(AUTO_SAVE_KEY);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            // Only load if less than 24 hours old
            if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                if (confirm('Restore auto-saved work from ' + new Date(data.timestamp).toLocaleString() + '?')) {
                    vertexEditor.value = data.vertex;
                    fragmentEditor.value = data.fragment;
                    currentShader = data.shader;
                    uniformValues = data.uniformValues || {};
                    shaderSelect.value = currentShader;
                    updateShaderInfo(currentShader);
                    buildParameterControls(shaders[currentShader].uniforms);
                    compileAndRun();
                }
            }
        } catch (e) {
            console.error('Failed to load auto-save:', e);
        }
    }
}

// Initialize
loadShader(currentShader);

// Check for shared shader in URL
checkSharedShader();

// Initialize syntax highlighting
initSyntaxHighlighting();

// Check for auto-saved work
loadAutoSave();

// Basic syntax highlighting
function highlightShaderCode(code, type) {
    // This is a simple syntax highlighter - for production, consider using a library like Prism.js
    const keywords = [
        'attribute', 'uniform', 'varying', 'const', 'void', 'float', 'vec2', 'vec3', 'vec4',
        'mat2', 'mat3', 'mat4', 'sampler2D', 'if', 'else', 'for', 'while', 'return',
        'gl_Position', 'gl_FragCoord', 'gl_FragColor', 'precision', 'highp', 'mediump', 'lowp'
    ];
    
    const functions = [
        'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'pow', 'exp', 'log', 'sqrt',
        'abs', 'sign', 'floor', 'ceil', 'fract', 'mod', 'min', 'max', 'clamp',
        'mix', 'step', 'smoothstep', 'length', 'distance', 'dot', 'cross',
        'normalize', 'reflect', 'refract', 'texture2D'
    ];
    
    // For now, we'll just add some basic coloring hints
    // In a real implementation, you'd want to use a proper syntax highlighter
    return code;
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Show help with ?
    if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        if (!isDialogOpen()) {
            e.preventDefault();
            showKeyboardShortcuts();
        }
    }
    
    // Close dialogs with Escape
    if (e.key === 'Escape') {
        hideKeyboardShortcuts();
        closeSaveDialog();
        closeExportDialog();
        closeShareDialog();
        closeHelpDialog();
    }
    
    // Save with Ctrl/Cmd + S
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveBtn.click();
    }
    
    // Export with Ctrl/Cmd + E
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportBtn.click();
    }
    
    // Toggle comment with Ctrl/Cmd + /
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        toggleComment();
    }
    
    // Tab switching
    if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const activeTab = document.querySelector('.tab.active');
        const tabs = Array.from(document.querySelectorAll('.tab'));
        const currentIndex = tabs.indexOf(activeTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        
        if (document.activeElement === vertexEditor || document.activeElement === fragmentEditor) {
            e.preventDefault();
            tabs[nextIndex].click();
            
            // Focus the corresponding editor
            if (tabs[nextIndex].dataset.tab === 'vertex') {
                vertexEditor.focus();
            } else {
                fragmentEditor.focus();
            }
        }
    }
    
    // FPS toggle
    if (e.key === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (document.activeElement !== vertexEditor && 
            document.activeElement !== fragmentEditor &&
            document.activeElement !== saveNameInput &&
            document.activeElement !== exportNameInput) {
            e.preventDefault();
            toggleFPS();
        }
    }
    
    // Fullscreen toggle
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
});

// FPS counter functionality
function toggleFPS() {
    showFPS = !showFPS;
    fpsCounter.classList.toggle('active', showFPS);
    if (showFPS) {
        frameCount = 0;
        lastFPSUpdate = performance.now();
        updatePerformanceStats();
    }
}

// Fullscreen functionality
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        canvasContainer.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

fullscreenBtn.addEventListener('click', toggleFullscreen);

// Update fullscreen button on fullscreen change
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        fullscreenBtn.innerHTML = '⛶';
        fullscreenBtn.title = 'Exit Fullscreen';
    } else {
        fullscreenBtn.innerHTML = '⛶';
        fullscreenBtn.title = 'Fullscreen';
    }
});

// Resize handler
function resize() {
    canvas.width = window.innerWidth - canvas.offsetLeft;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}
window.addEventListener('resize', resize);
resize();

// Mouse tracking
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse[0] = e.clientX - rect.left;
    mouse[1] = rect.height - (e.clientY - rect.top);
});

// Setup auto-save on editor changes
vertexEditor.addEventListener('input', () => {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(autoSave, 2000);
});

fragmentEditor.addEventListener('input', () => {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(autoSave, 2000);
});

// Tab switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetEditor = tab.dataset.tab;
        
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const wrappers = document.querySelectorAll('.editor-wrapper');
        wrappers.forEach(wrapper => wrapper.style.display = 'none');
        
        if (targetEditor === 'vertex') {
            wrappers[0].style.display = 'flex';
            vertexEditor.focus();
        } else {
            wrappers[1].style.display = 'flex';
            fragmentEditor.focus();
        }
    });
});

// Help modal
helpButton.addEventListener('click', () => {
    helpModal.classList.add('active');
});

closeHelp.addEventListener('click', () => {
    helpModal.classList.remove('active');
});

helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
        helpModal.classList.remove('active');
    }
});

// Shader selector
shaderSelect.addEventListener('change', (e) => {
    currentShader = e.target.value;
    if (currentShader !== 'custom') {
        loadShader(currentShader);
    } else {
        vertexEditor.value = customShader.vertex;
        fragmentEditor.value = customShader.fragment;
        buildParameterControls(customShader.uniforms);
        updateShaderInfo('custom');
    }
});

// Compile and run button
runBtn.addEventListener('click', compileAndRun);
window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        compileAndRun();
    }
});

// Initial compile
compileAndRun();
requestAnimationFrame(render);

function updateShaderInfo(shaderName) {
    if (shaderName === 'custom') {
        shaderIcon.textContent = '✏️';
        shaderName.textContent = 'Custom Shader';
        shaderDescription.textContent = 'Write your own vertex and fragment shaders. You have access to u_time, u_resolution, and u_mouse uniforms.';
    } else {
        const info = shaderDescriptions[shaderName];
        const shader = SHADERS[shaderName];
        shaderIcon.textContent = info.icon;
        shaderName.textContent = shader.name;
        shaderDescription.textContent = info.description;
    }
}

function loadShader(shaderName) {
    const shader = SHADERS[shaderName];
    vertexEditor.value = shader.vertex.trim();
    fragmentEditor.value = shader.fragment.trim();
    
    // Initialize uniform values
    uniformValues = {};
    if (shader.uniforms) {
        for (const [key, uniform] of Object.entries(shader.uniforms)) {
            uniformValues[key] = uniform.value;
        }
    }
    
    updateShaderInfo(shaderName);
    buildParameterControls(shader.uniforms || {});
    compileAndRun();
}

function buildParameterControls(uniforms) {
    parametersList.innerHTML = '';
    
    for (const [key, uniform] of Object.entries(uniforms)) {
        const div = document.createElement('div');
        div.className = 'parameter';
        
        const label = document.createElement('label');
        label.textContent = uniform.name || key;
        
        const input = document.createElement('input');
        input.type = 'range';
        input.min = uniform.min;
        input.max = uniform.max;
        input.step = uniform.step;
        input.value = uniformValues[key] || uniform.value;
        
        const value = document.createElement('span');
        value.className = 'parameter-value';
        value.textContent = input.value;
        
        input.addEventListener('input', (e) => {
            uniformValues[key] = parseFloat(e.target.value);
            value.textContent = e.target.value;
        });
        
        label.appendChild(value);
        div.appendChild(label);
        div.appendChild(input);
        parametersList.appendChild(div);
    }
}

function compileAndRun() {
    clearLog();
    clearErrorHighlights();
    
    try {
        const vsSource = vertexEditor.value;
        const fsSource = fragmentEditor.value;
        
        // Save custom shader if in custom mode
        if (currentShader === 'custom') {
            customShader.vertex = vsSource;
            customShader.fragment = fsSource;
        }

        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
        if (!shaderProgram) return;

        // Extract all uniforms from the shader
        const uniformLocations = {};
        const numUniforms = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
        
        for (let i = 0; i < numUniforms; i++) {
            const uniformInfo = gl.getActiveUniform(shaderProgram, i);
            uniformLocations[uniformInfo.name] = gl.getUniformLocation(shaderProgram, uniformInfo.name);
        }

        programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            },
            uniformLocations: uniformLocations
        };

        log('✓ Shaders compiled successfully', 'success');
    } catch (e) {
        logError(e.message);
    }
}

function render(now) {
    if (programInfo) {
        const time = (now - startTime) / 1000.0;
        drawScene(gl, programInfo, buffers, time, mouse);
    }
    
    // FPS calculation
    if (showFPS) {
        frameCount++;
        const elapsed = now - lastFPSUpdate;
        if (elapsed >= 1000) {
            currentFPS = Math.round((frameCount * 1000) / elapsed);
            const memoryMB = (performanceStats.textureMemory / (1024 * 1024)).toFixed(2);
            
            fpsCounter.innerHTML = `
                <div>FPS: ${currentFPS}</div>
                <div style="font-size: 10px; margin-top: 4px; opacity: 0.8;">
                    Draw Calls: ${performanceStats.drawCalls}<br>
                    Compile: ${performanceStats.shaderCompileTime.toFixed(1)}ms<br>
                    Textures: ${memoryMB}MB<br>
                    Vertices: ${performanceStats.vertexCount}
                </div>
            `;
            
            frameCount = 0;
            lastFPSUpdate = now;
            performanceStats.drawCalls = 0;
        }
    }
    
    requestAnimationFrame(render);
}

// ---------------- Helper functions ----------------
function initBuffers(gl) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Fullscreen triangle
    const positions = [
        -1.0, -1.0,
         3.0, -1.0,
        -1.0,  3.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return { position: positionBuffer };
}

function drawScene(gl, programInfo, buffers, time, mouse) {
    performanceStats.drawCalls++;
    
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(programInfo.program);

    // Attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);

    // Set uniforms
    const uniforms = programInfo.uniformLocations;
    
    // Standard uniforms
    if (uniforms.u_time) gl.uniform1f(uniforms.u_time, time);
    if (uniforms.u_resolution) gl.uniform2f(uniforms.u_resolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
    if (uniforms.u_mouse) gl.uniform2f(uniforms.u_mouse, mouse[0], mouse[1]);
    
    // Texture uniforms
    for (let i = 0; i < 4; i++) {
        if (textures[i] && uniforms[`u_texture${i}`]) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, textures[i].texture);
            gl.uniform1i(uniforms[`u_texture${i}`], i);
        }
    }
    
    // Custom uniforms from parameter controls
    for (const [key, value] of Object.entries(uniformValues)) {
        if (uniforms[key]) {
            gl.uniform1f(uniforms[key], value);
        }
    }

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function loadShaderSource(gl, type, source) {
    const startTime = performance.now();
    
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    performanceStats.shaderCompileTime = performance.now() - startTime;
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const msg = gl.getShaderInfoLog(shader);
        logError(msg);
        gl.deleteShader(shader);
        
        // Parse error for line number
        const lineMatch = msg.match(/ERROR: \d+:(\d+)/) || msg.match(/(\d+):/);
        if (lineMatch) {
            const lineNumber = parseInt(lineMatch[1]);
            if (type === gl.VERTEX_SHADER) {
                highlightErrorLine(vertexEditor, vertexLineNumbers, lineNumber);
            } else {
                highlightErrorLine(fragmentEditor, fragmentLineNumbers, lineNumber);
            }
        }
        
        return null;
    }
    return shader;
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShaderSource(gl, gl.VERTEX_SHADER, vsSource);
    if (!vertexShader) return null;
    const fragmentShader = loadShaderSource(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!fragmentShader) return null;

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.bindAttribLocation(shaderProgram, 0, 'aVertexPosition');
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        const msg = gl.getProgramInfoLog(shaderProgram);
        logError('Program link error: ' + msg);
        return null;
    }
    return shaderProgram;
}

// Logging helpers
function log(msg, type = 'info') {
    const line = document.createElement('div');
    line.className = type;
    line.textContent = msg;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
}
function logError(msg) { log('✗ ' + msg, 'error'); }
function clearLog() { 
    logEl.innerHTML = '';
    log('Console cleared. Compile shader with Run button or Ctrl/Cmd+Enter');
} 

// Save/Load functionality
const STORAGE_KEY = 'webgl_shader_saves';

function getSavedShaders() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}

function saveShader(name) {
    const saves = getSavedShaders();
    const shaderData = {
        id: Date.now(),
        name: name,
        date: new Date().toISOString(),
        vertex: vertexEditor.value,
        fragment: fragmentEditor.value,
        uniforms: uniformValues
    };
    
    saves.unshift(shaderData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
    return shaderData;
}

function loadSavedShader(id) {
    const saves = getSavedShaders();
    const shader = saves.find(s => s.id === id);
    if (shader) {
        vertexEditor.value = shader.vertex;
        fragmentEditor.value = shader.fragment;
        uniformValues = shader.uniforms || {};
        currentShader = 'custom';
        shaderSelect.value = 'custom';
        updateShaderInfo('custom');
        buildParameterControls({});
        compileAndRun();
    }
}

function deleteSavedShader(id) {
    const saves = getSavedShaders();
    const filtered = saves.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    updateSaveList();
}

function updateSaveList() {
    const saves = getSavedShaders();
    saveList.innerHTML = '';
    
    if (saves.length === 0) {
        saveList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No saved shaders yet</p>';
        return;
    }
    
    saves.forEach(save => {
        const item = document.createElement('div');
        item.className = 'save-item';
        
        const info = document.createElement('div');
        info.innerHTML = `
            <div class="save-item-name">${save.name}</div>
            <div class="save-item-date">${new Date(save.date).toLocaleDateString()}</div>
        `;
        info.style.flex = '1';
        info.addEventListener('click', () => {
            loadSavedShader(save.id);
            saveModal.classList.remove('active');
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-save';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Delete "${save.name}"?`)) {
                deleteSavedShader(save.id);
            }
        });
        
        item.appendChild(info);
        item.appendChild(deleteBtn);
        saveList.appendChild(item);
    });
}

// Export functionality
function exportShader(filename) {
    const textureData = textures.filter(t => t).map(t => ({
        name: t.name,
        url: t.url
    }));
    
    // Ask user if they want minified shaders
    const minify = confirm('Minify shaders for smaller file size?\n\nThis will remove comments and compress the code.');
    
    const vertexSource = minify ? minifyGLSL(vertexEditor.value) : vertexEditor.value;
    const fragmentSource = minify ? minifyGLSL(fragmentEditor.value) : fragmentEditor.value;
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename} - WebGL Shader</title>
    <style>
        body { margin: 0; overflow: hidden; }
        canvas { display: block; width: 100%; height: 100vh; }
        .info {
            position: absolute;
            bottom: 10px;
            left: 10px;
            color: white;
            font-family: monospace;
            font-size: 12px;
            text-shadow: 0 0 4px rgba(0,0,0,0.8);
        }
    </style>
</head>
<body>
    <canvas id="glCanvas"></canvas>
    <div class="info">Created with WebGL Shader Playground by @jamesfrewin1</div>
    <script>
const vertexShaderSource = \`${vertexSource}\`;
const fragmentShaderSource = \`${fragmentSource}\`;
const uniformValues = ${JSON.stringify(uniformValues)};
const textureData = ${JSON.stringify(textureData)};

const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    alert('WebGL not supported');
    throw new Error('WebGL not supported');
}

// Load textures
const textures = [];
let texturesLoaded = 0;

function loadTexture(data, index) {
    const img = new Image();
    img.onload = () => {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        textures[index] = texture;
        texturesLoaded++;
        if (texturesLoaded === textureData.length || textureData.length === 0) {
            startShader();
        }
    };
    img.src = data.url;
}

// Load all textures
if (textureData.length > 0) {
    textureData.forEach((data, i) => loadTexture(data, i));
} else {
    startShader();
}

function startShader() {
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    // Compile shaders
    function compileShader(gl, source, type) {
        const startTime = performance.now();
        
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        performanceStats.shaderCompileTime = performance.now() - startTime;

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
    }

    // Create fullscreen triangle
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'aVertexPosition');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');

    // Get texture uniform locations
    const textureLocations = [];
    for (let i = 0; i < textures.length; i++) {
        textureLocations[i] = gl.getUniformLocation(program, 'u_texture' + i);
    }

    // Get custom uniform locations
    const customUniforms = {};
    for (const [name, value] of Object.entries(uniformValues)) {
        customUniforms[name] = gl.getUniformLocation(program, name);
    }

    let mouse = [0, 0];
    canvas.addEventListener('mousemove', (e) => {
        mouse[0] = e.clientX;
        mouse[1] = canvas.height - e.clientY;
    });

    const startTime = performance.now();

    function render(now) {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.useProgram(program);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        
        if (timeLocation) gl.uniform1f(timeLocation, (now - startTime) / 1000);
        if (resolutionLocation) gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        if (mouseLocation) gl.uniform2f(mouseLocation, mouse[0], mouse[1]);
        
        // Bind textures
        textures.forEach((texture, i) => {
            if (textureLocations[i]) {
                gl.activeTexture(gl.TEXTURE0 + i);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.uniform1i(textureLocations[i], i);
            }
        });
        
        // Set custom uniforms
        for (const [name, location] of Object.entries(customUniforms)) {
            if (location && uniformValues[name] !== undefined) {
                gl.uniform1f(location, uniformValues[name]);
            }
        }
        
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}
    </script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.html`;
    a.click();
    URL.revokeObjectURL(url);
}

// Share functionality
function generateShareUrl() {
    const shaderData = {
        v: vertexEditor.value,
        f: fragmentEditor.value,
        u: uniformValues
    };
    
    const compressed = btoa(JSON.stringify(shaderData));
    const url = new URL(window.location.href);
    url.searchParams.set('shader', compressed);
    return url.toString();
}

function checkSharedShader() {
    const params = new URLSearchParams(window.location.search);
    const shaderData = params.get('shader');
    
    if (shaderData) {
        try {
            const decoded = JSON.parse(atob(shaderData));
            vertexEditor.value = decoded.v;
            fragmentEditor.value = decoded.f;
            uniformValues = decoded.u || {};
            currentShader = 'custom';
            shaderSelect.value = 'custom';
            updateShaderInfo('custom');
            buildParameterControls({});
            compileAndRun();
            
            // Clear URL to avoid confusion
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (e) {
            console.error('Failed to load shared shader:', e);
        }
    }
}

// Event listeners for save/load/export
saveBtn.addEventListener('click', () => {
    updateSaveList();
    saveModal.classList.add('active');
    saveNameInput.value = '';
    saveNameInput.focus();
});

exportBtn.addEventListener('click', () => {
    exportModal.classList.add('active');
    exportNameInput.focus();
    exportNameInput.select();
});

shareBtn.addEventListener('click', () => {
    const url = generateShareUrl();
    shareUrl.textContent = url;
    shareModal.classList.add('active');
});

saveShaderBtn.addEventListener('click', () => {
    const name = saveNameInput.value.trim();
    if (name) {
        saveShader(name);
        saveModal.classList.remove('active');
        log('✓ Shader saved successfully', 'success');
    }
});

downloadBtn.addEventListener('click', () => {
    const filename = exportNameInput.value.trim() || 'shader';
    exportShader(filename);
    exportModal.classList.remove('active');
    log('✓ Shader exported successfully', 'success');
});

copyShareBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(shareUrl.textContent).then(() => {
        copyShareBtn.classList.add('copied');
        copyShareBtn.querySelector('span:last-child').textContent = 'Copied!';
        setTimeout(() => {
            copyShareBtn.classList.remove('copied');
            copyShareBtn.querySelector('span:last-child').textContent = 'Copy URL';
        }, 2000);
    });
});

// Modal close handlers
closeSave.addEventListener('click', () => saveModal.classList.remove('active'));
closeExport.addEventListener('click', () => exportModal.classList.remove('active'));
closeShare.addEventListener('click', () => shareModal.classList.remove('active'));
cancelSaveBtn.addEventListener('click', () => saveModal.classList.remove('active'));
cancelExportBtn.addEventListener('click', () => exportModal.classList.remove('active'));

[saveModal, exportModal, shareModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Enter key handlers
saveNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        saveShaderBtn.click();
    }
});

exportNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        downloadBtn.click();
    }
}); 

// Texture management
function initSyntaxHighlighting() {
    // Override textarea behavior to update syntax highlighting
    const updateHighlighting = (editor, language) => {
        if (typeof Prism !== 'undefined') {
            try {
                const highlighted = Prism.highlight(editor.value, Prism.languages.glsl, language);
                // For now, we'll keep the plain textarea but could overlay highlighted code
                // In a production version, you'd use a proper code editor like CodeMirror or Monaco
            } catch (e) {
                console.error('Syntax highlighting error:', e);
            }
        }
    };
    
    vertexEditor.addEventListener('input', () => updateHighlighting(vertexEditor, 'glsl'));
    fragmentEditor.addEventListener('input', () => updateHighlighting(fragmentEditor, 'glsl'));
}

// Texture loading functionality
function loadTexture(file, index) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            
            // Upload the image to the texture
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            
            // Set texture parameters
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            
            // Store texture info
            textures[index] = {
                texture: texture,
                name: file.name,
                url: e.target.result,
                width: img.width,
                height: img.height
            };
            
            updateTextureList();
            log(`✓ Texture loaded: ${file.name}`, 'success');
        };
        
        img.onerror = () => {
            log(`✗ Failed to load texture: ${file.name}`, 'error');
        };
        
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

function removeTexture(index) {
    if (textures[index]) {
        gl.deleteTexture(textures[index].texture);
        textures[index] = null;
        updateTextureList();
        log('✓ Texture removed', 'success');
    }
}

function updateTextureList() {
    textureList.innerHTML = '';
    
    let hasTextures = false;
    
    for (let i = 0; i < 4; i++) { // Support up to 4 textures
        if (textures[i]) {
            hasTextures = true;
            const item = document.createElement('div');
            item.className = 'texture-item';
            
            const preview = document.createElement('div');
            preview.className = 'texture-preview';
            const img = document.createElement('img');
            img.src = textures[i].url;
            preview.appendChild(img);
            
            const info = document.createElement('div');
            info.className = 'texture-info';
            info.innerHTML = `
                <div class="texture-name">${textures[i].name}</div>
                <div class="texture-uniform">u_texture${i} (${textures[i].width}×${textures[i].height})</div>
            `;
            
            const actions = document.createElement('div');
            actions.className = 'texture-actions';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'texture-btn remove';
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => removeTexture(i));
            
            actions.appendChild(removeBtn);
            
            item.appendChild(preview);
            item.appendChild(info);
            item.appendChild(actions);
            textureList.appendChild(item);
        }
    }
    
    if (!hasTextures) {
        textureList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 12px;">No textures loaded</p>';
    }
}

// Texture upload handlers
addTextureBtn.addEventListener('click', () => {
    textureInput.click();
});

textureInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        // Find first available slot
        let index = -1;
        for (let i = 0; i < 4; i++) {
            if (!textures[i]) {
                index = i;
                break;
            }
        }
        
        if (index !== -1) {
            loadTexture(file, index);
        } else {
            log('✗ Maximum 4 textures supported', 'error');
        }
    }
    
    // Reset input
    textureInput.value = '';
}); 

function updatePerformanceStats() {
    // Calculate texture memory usage
    performanceStats.textureMemory = 0;
    textures.forEach(tex => {
        if (tex) {
            // Estimate based on dimensions (RGBA = 4 bytes per pixel)
            performanceStats.textureMemory += tex.width * tex.height * 4;
        }
    });
    
    // Update vertex count (we use a fullscreen triangle)
    performanceStats.vertexCount = 3;
} 

// Shader minification for exports
function minifyGLSL(code) {
    // Remove comments
    code = code.replace(/\/\/.*$/gm, ''); // Single line comments
    code = code.replace(/\/\*[\s\S]*?\*\//g, ''); // Multi-line comments
    
    // Remove unnecessary whitespace
    code = code.replace(/\s+/g, ' '); // Multiple spaces to single
    code = code.replace(/\s*([{}();,=<>+\-*\/])\s*/g, '$1'); // Remove spaces around operators
    code = code.replace(/\n\s*/g, '\n'); // Remove leading whitespace
    code = code.replace(/^\s+|\s+$/g, ''); // Trim
    
    // Preserve necessary spaces
    code = code.replace(/(\w)\s+(\w)/g, '$1 $2'); // Keep spaces between words
    code = code.replace(/(uniform|attribute|varying|const|void|float|vec2|vec3|vec4|mat2|mat3|mat4|sampler2D)\s+/g, '$1 ');
    
    return code;
} 

function isDialogOpen() {
    return saveDialog.classList.contains('active') ||
           exportDialog.classList.contains('active') ||
           shareDialog.classList.contains('active') ||
           helpDialog.classList.contains('active') ||
           keyboardShortcuts.classList.contains('active');
}

function toggleComment() {
    const activeEditor = document.activeElement;
    if (activeEditor === vertexEditor || activeEditor === fragmentEditor) {
        const start = activeEditor.selectionStart;
        const end = activeEditor.selectionEnd;
        const text = activeEditor.value;
        const lines = text.split('\n');
        
        let lineStart = 0;
        let lineEnd = 0;
        let startLine = 0;
        let endLine = 0;
        
        // Find line numbers for selection
        for (let i = 0; i < lines.length; i++) {
            lineEnd = lineStart + lines[i].length;
            if (start >= lineStart && start <= lineEnd) startLine = i;
            if (end >= lineStart && end <= lineEnd) endLine = i;
            lineStart = lineEnd + 1;
        }
        
        // Toggle comments
        let allCommented = true;
        for (let i = startLine; i <= endLine; i++) {
            if (!lines[i].trim().startsWith('//')) {
                allCommented = false;
                break;
            }
        }
        
        for (let i = startLine; i <= endLine; i++) {
            if (allCommented) {
                lines[i] = lines[i].replace(/^(\s*)\/\/\s?/, '$1');
            } else {
                lines[i] = lines[i].replace(/^(\s*)/, '$1// ');
            }
        }
        
        activeEditor.value = lines.join('\n');
        
        // Restore selection
        const newStart = lines.slice(0, startLine).join('\n').length + (startLine > 0 ? 1 : 0);
        const newEnd = lines.slice(0, endLine + 1).join('\n').length;
        activeEditor.setSelectionRange(newStart, newEnd);
        
        // Trigger input event for auto-save
        activeEditor.dispatchEvent(new Event('input'));
    }
}

// Category filtering
const categoryTags = document.querySelectorAll('.category-tag');
let activeCategory = 'all';

categoryTags.forEach(tag => {
    tag.addEventListener('click', () => {
        categoryTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        activeCategory = tag.dataset.category;
        filterShaders();
    });
});

function filterShaders() {
    const options = shaderSelect.querySelectorAll('option');
    let hasVisibleOption = false;
    
    options.forEach(option => {
        const shaderKey = option.value;
        if (shaderKey === 'custom') {
            option.style.display = '';
            return;
        }
        
        const shader = shaderDescriptions[shaderKey];
        if (shader && (activeCategory === 'all' || shader.categories.includes(activeCategory))) {
            option.style.display = '';
            hasVisibleOption = true;
        } else {
            option.style.display = 'none';
        }
    });
    
    // If current selection is hidden, select first visible option
    if (shaderSelect.options[shaderSelect.selectedIndex].style.display === 'none') {
        for (let option of options) {
            if (option.style.display !== 'none') {
                shaderSelect.value = option.value;
                loadShader(option.value);
                break;
            }
        }
    }
}

// Keyboard shortcuts overlay
const shortcutsOverlay = document.getElementById('shortcutsOverlay');
const keyboardShortcuts = document.getElementById('keyboardShortcuts');

function showKeyboardShortcuts() {
    shortcutsOverlay.classList.add('active');
    keyboardShortcuts.classList.add('active');
}

function hideKeyboardShortcuts() {
    shortcutsOverlay.classList.remove('active');
    keyboardShortcuts.classList.remove('active');
}

shortcutsOverlay.addEventListener('click', hideKeyboardShortcuts);
keyboardShortcuts.addEventListener('click', (e) => {
    if (e.target === keyboardShortcuts) {
        hideKeyboardShortcuts();
    }
}); 

// Generate shader documentation
function generateShaderDocs() {
    const shader = shaders[currentShader];
    if (!shader) return '';
    
    let docs = `# ${shader.name || currentShader} Shader Documentation\n\n`;
    
    // Add description
    const info = shaderDescriptions[currentShader];
    if (info) {
        docs += `## Description\n${info.description}\n\n`;
        docs += `**Categories:** ${info.categories.join(', ')}\n\n`;
    }
    
    // Standard uniforms
    docs += `## Standard Uniforms\n`;
    docs += `- \`uniform float u_time\` - Time in seconds since shader started\n`;
    docs += `- \`uniform vec2 u_resolution\` - Canvas resolution in pixels\n`;
    docs += `- \`uniform vec2 u_mouse\` - Mouse position in pixels\n\n`;
    
    // Custom uniforms
    if (shader.uniforms && Object.keys(shader.uniforms).length > 0) {
        docs += `## Custom Uniforms\n`;
        for (const [name, uniform] of Object.entries(shader.uniforms)) {
            docs += `- \`uniform float ${name}\` - ${uniform.name || name}\n`;
            docs += `  - Range: ${uniform.min} to ${uniform.max}\n`;
            docs += `  - Default: ${uniform.value}\n`;
            docs += `  - Step: ${uniform.step}\n\n`;
        }
    }
    
    // Texture uniforms if any
    const hasTextures = fragmentEditor.value.includes('u_texture');
    if (hasTextures) {
        docs += `## Texture Uniforms\n`;
        docs += `- \`uniform sampler2D u_texture0\` - First texture slot\n`;
        docs += `- \`uniform sampler2D u_texture1\` - Second texture slot\n`;
        docs += `- \`uniform sampler2D u_texture2\` - Third texture slot\n`;
        docs += `- \`uniform sampler2D u_texture3\` - Fourth texture slot\n\n`;
    }
    
    // Usage example
    docs += `## Usage Example\n\`\`\`glsl\n`;
    docs += `void main() {\n`;
    docs += `    vec2 st = gl_FragCoord.xy / u_resolution;\n`;
    docs += `    vec2 mouse = u_mouse / u_resolution;\n`;
    docs += `    float time = u_time;\n`;
    
    if (shader.uniforms && Object.keys(shader.uniforms).length > 0) {
        const firstUniform = Object.keys(shader.uniforms)[0];
        docs += `    \n    // Use custom parameters\n`;
        docs += `    float param = ${firstUniform};\n`;
    }
    
    docs += `    \n    // Your shader logic here\n`;
    docs += `    gl_FragColor = vec4(st.x, st.y, sin(time), 1.0);\n`;
    docs += `}\n\`\`\`\n`;
    
    return docs;
}

// Add documentation button handler
const docBtn = document.createElement('button');
docBtn.className = 'secondary-btn';
docBtn.textContent = '📄 Docs';
docBtn.title = 'Generate documentation for current shader';
docBtn.addEventListener('click', () => {
    const docs = generateShaderDocs();
    const blob = new Blob([docs], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentShader}_documentation.md`;
    a.click();
    URL.revokeObjectURL(url);
    log('✓ Documentation generated', 'success');
});

// Add to button group
const buttonGroup = document.querySelector('.button-group');
if (buttonGroup) {
    buttonGroup.appendChild(docBtn);
}

// Line numbers functionality
function updateLineNumbers(editor, lineNumbersEl) {
    const lines = editor.value.split('\n');
    const lineCount = lines.length;
    const currentLineCount = lineNumbersEl.children.length;
    
    if (lineCount !== currentLineCount) {
        lineNumbersEl.innerHTML = '';
        for (let i = 1; i <= lineCount; i++) {
            const lineDiv = document.createElement('div');
            lineDiv.textContent = i;
            lineNumbersEl.appendChild(lineDiv);
        }
    }
    
    // Sync scroll
    lineNumbersEl.scrollTop = editor.scrollTop;
}

// Update line numbers on input and scroll
vertexEditor.addEventListener('input', () => updateLineNumbers(vertexEditor, vertexLineNumbers));
fragmentEditor.addEventListener('input', () => updateLineNumbers(fragmentEditor, fragmentLineNumbers));
vertexEditor.addEventListener('scroll', () => vertexLineNumbers.scrollTop = vertexEditor.scrollTop);
fragmentEditor.addEventListener('scroll', () => fragmentLineNumbers.scrollTop = fragmentEditor.scrollTop);

// Initialize line numbers
updateLineNumbers(vertexEditor, vertexLineNumbers);
updateLineNumbers(fragmentEditor, fragmentLineNumbers);

// Error line highlighting
function highlightErrorLine(editor, lineNumbersEl, lineNumber) {
    // Clear previous errors
    Array.from(lineNumbersEl.children).forEach(child => {
        child.classList.remove('error-line');
    });
    
    // Highlight error line
    if (lineNumber > 0 && lineNumber <= lineNumbersEl.children.length) {
        lineNumbersEl.children[lineNumber - 1].classList.add('error-line');
        
        // Scroll to error
        const lineHeight = parseFloat(getComputedStyle(editor).lineHeight);
        editor.scrollTop = (lineNumber - 5) * lineHeight;
    }
}

function clearErrorHighlights() {
    Array.from(vertexLineNumbers.children).forEach(child => {
        child.classList.remove('error-line');
    });
    Array.from(fragmentLineNumbers.children).forEach(child => {
        child.classList.remove('error-line');
    });
}