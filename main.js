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

// New feature elements
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = document.getElementById('playPauseIcon');
const resetTimeBtn = document.getElementById('resetTimeBtn');
const speedSlider = document.getElementById('speedSlider');
const speedDisplay = document.getElementById('speedDisplay');
const screenshotBtn = document.getElementById('screenshotBtn');
const snippetsBtn = document.getElementById('snippetsBtn');
const snippetsMenu = document.getElementById('snippetsMenu');
const comparisonCanvas = document.getElementById('comparisonCanvas');
const comparisonMode = document.getElementById('comparisonMode');

// Time control variables
let isPlaying = true;
let timeSpeed = 1.0;
let baseTime = 0;
let pausedTime = 0;

// Comparison mode
let comparisonShader = null;
let comparisonGL = null;
let comparisonProgram = null;
let comparisonBuffers = null;

// Code snippets
const codeSnippets = {
    noise: {
        title: "Noise Functions",
        code: `// Simple noise function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Smooth noise
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
               mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
}`
    },
    sdf: {
        title: "SDF Shapes",
        code: `// Circle SDF
float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

// Box SDF
float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

// Smooth union
float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h);
}`
    },
    color: {
        title: "Color Utilities",
        code: `// HSB to RGB
vec3 hsb2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

// Palette generator
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}`
    },
    transform: {
        title: "2D Transformations",
        code: `// Rotation matrix
mat2 rotate2d(float angle) {
    return mat2(cos(angle), -sin(angle),
                sin(angle), cos(angle));
}

// Scale from center
vec2 scale(vec2 st, float scale) {
    return (st - 0.5) * scale + 0.5;
}

// Translate
vec2 translate(vec2 st, vec2 offset) {
    return st + offset;
}`
    },
    lighting: {
        title: "Lighting",
        code: `// Phong lighting
vec3 phong(vec3 normal, vec3 lightDir, vec3 viewDir, vec3 color) {
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    
    vec3 ambient = 0.1 * color;
    vec3 diffuse = diff * color;
    vec3 specular = spec * vec3(1.0);
    
    return ambient + diffuse + specular;
}`
    },
    effects: {
        title: "Post Effects",
        code: `// Chromatic aberration
vec3 chromaticAberration(sampler2D tex, vec2 uv, float amount) {
    vec3 color;
    color.r = texture2D(tex, uv + vec2(amount, 0.0)).r;
    color.g = texture2D(tex, uv).g;
    color.b = texture2D(tex, uv - vec2(amount, 0.0)).b;
    return color;
}

// Vignette
float vignette(vec2 uv, float intensity, float extent) {
    uv *= 1.0 - uv.yx;
    float vig = uv.x * uv.y * 15.0;
    return pow(vig, extent * intensity);
}`
    }
};

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
    },
    matrixRain: {
        icon: "💻",
        description: "Digital rain effect inspired by The Matrix. Adjust speed and density of falling characters.",
        categories: ["2d", "generative"]
    },
    neonGrid: {
        icon: "🌃",
        description: "Retro synthwave grid with perspective and neon glow. Mouse controls the light source.",
        categories: ["2d", "interactive", "generative"]
    },
    lavaLamp: {
        icon: "🌋",
        description: "Mesmerizing lava lamp simulation with flowing blobs and color transitions.",
        categories: ["2d", "generative"]
    },
    starfield: {
        icon: "⭐",
        description: "Infinite starfield with warp speed effect. Multiple layers create depth and motion.",
        categories: ["2d", "generative"]
    },
    fluidSimulation: {
        icon: "💧",
        description: "Interactive fluid dynamics simulation. Mouse movement creates currents and vortices.",
        categories: ["2d", "interactive", "generative"]
    },
    circuitBoard: {
        icon: "🔌",
        description: "Animated circuit board pattern with glowing traces and nodes. Cyberpunk aesthetic.",
        categories: ["2d", "generative"]
    },
    galaxySpiral: {
        icon: "🌌",
        description: "Spiral galaxy with rotating arms, stars, and nebula clouds. Cosmic beauty.",
        categories: ["2d", "generative"]
    },
    dnaHelix: {
        icon: "🧬",
        description: "Double helix DNA structure with animated rotation and colorful strands.",
        categories: ["2d", "generative"]
    },
    aurora: {
        icon: "🌌",
        description: "Northern lights simulation with flowing bands of color across the sky.",
        categories: ["2d", "generative"]
    },
    meshGradient: {
        icon: "🎨",
        description: "Smooth mesh gradient with animated control points and film grain. Modern design aesthetic.",
        categories: ["2d", "generative"]
    },
    gradientNoise: {
        icon: "🌈",
        description: "Flowing gradient with organic noise patterns and grain effects. Perfect for backgrounds.",
        categories: ["2d", "generative"]
    },
    liquidMetal: {
        icon: "🪙",
        description: "Interactive liquid metal surface with realistic reflections and mouse-controlled ripples.",
        categories: ["2d", "interactive", "generative"]
    },
    holographicGradient: {
        icon: "✨",
        description: "Iridescent holographic effect with interference patterns and sparkles. Futuristic look.",
        categories: ["2d", "generative"]
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
    },
    
    matrixRain: {
        name: "Matrix Rain",
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
uniform float u_density;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    
    // Create columns
    float columns = 80.0;
    float column = floor(st.x * columns);
    
    // Random speed per column
    float speed = random(vec2(column, 0.0)) * 0.5 + u_speed;
    
    // Character positions
    float y = fract(st.y - u_time * speed);
    float fade = 1.0 - y;
    fade = pow(fade, 3.0);
    
    // Random characters
    float char = random(vec2(column, floor(y * 20.0 + u_time * speed * 20.0)));
    
    // Green color with fade
    vec3 color = vec3(0.0, 1.0, 0.0) * fade;
    
    // Add some glow
    color += vec3(0.0, 0.3, 0.0) * (1.0 - st.y) * 0.5;
    
    // Density threshold
    float show = step(u_density, random(vec2(column, floor(y * 30.0))));
    color *= show;
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_speed: { type: 'float', value: 0.5, min: 0.1, max: 2.0, step: 0.1, name: 'Fall Speed' },
            u_density: { type: 'float', value: 0.5, min: 0.0, max: 1.0, step: 0.05, name: 'Character Density' }
        }
    },
    
    neonGrid: {
        name: "Neon Grid",
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
uniform float u_gridSize;
uniform float u_lineWidth;
uniform float u_glowIntensity;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 mouse = u_mouse / u_resolution;
    
    // Perspective transform
    st -= 0.5;
    float perspective = 1.0 + st.y * 0.5;
    st.x /= perspective;
    st += 0.5;
    
    // Moving grid
    st.y += u_time * 0.1;
    
    // Grid lines
    vec2 grid = fract(st * u_gridSize);
    float lineX = smoothstep(0.0, u_lineWidth, grid.x) * smoothstep(1.0, 1.0 - u_lineWidth, grid.x);
    float lineY = smoothstep(0.0, u_lineWidth, grid.y) * smoothstep(1.0, 1.0 - u_lineWidth, grid.y);
    float lines = 1.0 - max(lineX, lineY);
    
    // Distance from mouse
    float mouseDist = length(st - mouse);
    float mouseGlow = 1.0 / (mouseDist * 10.0 + 1.0);
    
    // Neon colors
    vec3 color = vec3(0.0);
    color += vec3(0.0, 1.0, 1.0) * lines * (1.0 + mouseGlow);
    color += vec3(1.0, 0.0, 1.0) * lines * u_glowIntensity * 0.5;
    
    // Fade to horizon
    color *= 1.0 - st.y * 0.5;
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_gridSize: { type: 'float', value: 20.0, min: 5.0, max: 50.0, step: 1.0, name: 'Grid Size' },
            u_lineWidth: { type: 'float', value: 0.02, min: 0.001, max: 0.1, step: 0.001, name: 'Line Width' },
            u_glowIntensity: { type: 'float', value: 2.0, min: 0.0, max: 5.0, step: 0.1, name: 'Glow Intensity' }
        }
    },
    
    lavaLamp: {
        name: "Lava Lamp",
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
uniform float u_blobSize;
uniform float u_speed;
uniform float u_colorShift;

float blob(vec2 st, vec2 center, float size) {
    float d = length(st - center);
    return smoothstep(size, size * 0.5, d);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    
    float t = u_time * u_speed;
    
    // Multiple blobs
    float b1 = blob(st, vec2(0.5 + sin(t) * 0.3, 0.5 + cos(t * 0.7) * 0.3), u_blobSize);
    float b2 = blob(st, vec2(0.5 + cos(t * 0.8) * 0.3, 0.5 + sin(t * 0.9) * 0.3), u_blobSize * 0.8);
    float b3 = blob(st, vec2(0.5 + sin(t * 1.1) * 0.2, 0.5 + cos(t * 1.3) * 0.2), u_blobSize * 1.2);
    float b4 = blob(st, vec2(0.5 + cos(t * 0.6) * 0.25, 0.5 + sin(t * 0.5) * 0.25), u_blobSize * 0.9);
    
    // Combine blobs
    float blobs = b1 + b2 + b3 + b4;
    blobs = smoothstep(0.4, 0.6, blobs);
    
    // Colors
    vec3 color1 = vec3(1.0, 0.2, 0.1);
    vec3 color2 = vec3(1.0, 0.8, 0.2);
    vec3 color3 = vec3(0.2, 0.1, 0.3);
    
    vec3 color = mix(color3, color1, blobs);
    color = mix(color, color2, sin(blobs * 3.14159 + t * u_colorShift) * 0.5 + 0.5);
    
    // Add some variation
    color += vec3(sin(st.y * 10.0 + t), cos(st.x * 10.0 + t), sin((st.x + st.y) * 10.0 + t)) * 0.05;
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_blobSize: { type: 'float', value: 0.2, min: 0.05, max: 0.5, step: 0.01, name: 'Blob Size' },
            u_speed: { type: 'float', value: 0.3, min: 0.1, max: 2.0, step: 0.1, name: 'Animation Speed' },
            u_colorShift: { type: 'float', value: 1.0, min: 0.0, max: 3.0, step: 0.1, name: 'Color Shift Speed' }
        }
    },
    
    starfield: {
        name: "Starfield",
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
uniform float u_layers;
uniform float u_brightness;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float star(vec2 st, float size) {
    float d = length(st);
    float star = 1.0 - smoothstep(0.0, size, d);
    
    // Add cross effect
    star += (1.0 - smoothstep(0.0, size * 0.1, abs(st.x))) * 0.5;
    star += (1.0 - smoothstep(0.0, size * 0.1, abs(st.y))) * 0.5;
    
    return star;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    st -= 0.5;
    st.x *= u_resolution.x / u_resolution.y;
    
    vec3 color = vec3(0.0);
    
    // Multiple layers of stars
    for (float i = 0.0; i < 5.0; i++) {
        if (i >= u_layers) break;
        
        vec2 pos = st;
        float z = fract(i / 5.0 + u_time * u_speed * (i + 1.0) * 0.1);
        
        // Zoom effect
        pos /= z;
        
        // Tile space
        vec2 id = floor(pos * 10.0);
        vec2 gv = fract(pos * 10.0) - 0.5;
        
        // Random offset per cell
        vec2 offset = vec2(random(id), random(id + 100.0)) - 0.5;
        gv += offset * 0.4;
        
        // Random size and brightness
        float size = random(id + 200.0) * 0.05 + 0.01;
        float brightness = random(id + 300.0) * u_brightness;
        
        // Draw star
        float s = star(gv, size * z);
        
        // Fade based on z
        s *= smoothstep(1.0, 0.0, z);
        s *= smoothstep(0.0, 0.1, z);
        
        // Add color variation
        vec3 starColor = vec3(1.0);
        starColor.r += random(id + 400.0) * 0.3;
        starColor.b += random(id + 500.0) * 0.3;
        
        color += starColor * s * brightness;
    }
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_speed: { type: 'float', value: 0.5, min: 0.0, max: 2.0, step: 0.1, name: 'Warp Speed' },
            u_layers: { type: 'float', value: 5.0, min: 1.0, max: 5.0, step: 1.0, name: 'Star Layers' },
            u_brightness: { type: 'float', value: 1.0, min: 0.1, max: 3.0, step: 0.1, name: 'Star Brightness' }
        }
    },
    
    fluidSimulation: {
        name: "Fluid Simulation",
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
uniform float u_viscosity;
uniform float u_vorticity;

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    
    return dot(n, vec3(70.0));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 mouse = u_mouse / u_resolution;
    
    // Create flow field
    vec2 flow = vec2(0.0);
    float scale = 3.0;
    
    for (float i = 0.0; i < 3.0; i++) {
        float n1 = noise((st + vec2(u_time * 0.1, 0.0)) * scale + i * 100.0);
        float n2 = noise((st + vec2(0.0, u_time * 0.1)) * scale + i * 200.0);
        flow += vec2(n1, n2) / (i + 1.0);
        scale *= 2.0;
    }
    
    // Add mouse influence
    vec2 toMouse = mouse - st;
    float mouseDist = length(toMouse);
    flow += normalize(toMouse) * (1.0 / (mouseDist * 10.0 + 1.0)) * u_vorticity;
    
    // Apply viscosity
    flow *= u_viscosity;
    
    // Visualize flow
    float angle = atan(flow.y, flow.x);
    float magnitude = length(flow);
    
    // Color based on flow
    vec3 color = 0.5 + 0.5 * cos(angle + vec3(0.0, 2.0, 4.0));
    color *= magnitude;
    
    // Add some base color
    color += vec3(0.1, 0.15, 0.2);
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_viscosity: { type: 'float', value: 0.5, min: 0.1, max: 1.0, step: 0.05, name: 'Viscosity' },
            u_vorticity: { type: 'float', value: 1.0, min: 0.0, max: 3.0, step: 0.1, name: 'Vorticity' }
        }
    },
    
    circuitBoard: {
        name: "Circuit Board",
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
uniform float u_complexity;
uniform float u_glow;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float circuit(vec2 st) {
    vec2 grid = floor(st);
    vec2 fpos = fract(st);
    
    float rnd = random(grid);
    
    // Create different circuit patterns
    float pattern = 0.0;
    
    if (rnd < 0.5) {
        // Straight lines
        pattern = step(0.45, fpos.x) * step(fpos.x, 0.55);
        pattern += step(0.45, fpos.y) * step(fpos.y, 0.55);
    } else if (rnd < 0.7) {
        // Corner
        pattern = step(0.45, fpos.x) * step(fpos.x, 0.55) * step(0.5, fpos.y);
        pattern += step(0.45, fpos.y) * step(fpos.y, 0.55) * step(0.5, fpos.x);
    } else if (rnd < 0.9) {
        // Junction
        pattern = step(0.45, fpos.x) * step(fpos.x, 0.55);
        pattern += step(0.45, fpos.y) * step(fpos.y, 0.55);
    }
    
    // Add nodes
    float node = length(fpos - 0.5) < 0.1 ? 1.0 : 0.0;
    
    return max(pattern, node);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    st *= u_complexity;
    
    // Animated offset
    st += vec2(u_time * 0.1, 0.0);
    
    float c = circuit(st);
    
    // Glow effect
    vec3 color = vec3(0.0);
    for (float i = -2.0; i <= 2.0; i++) {
        for (float j = -2.0; j <= 2.0; j++) {
            vec2 offset = vec2(i, j) / u_resolution * u_complexity;
            float sample = circuit(st + offset);
            float dist = length(vec2(i, j));
            color += vec3(0.0, 1.0, 0.5) * sample * exp(-dist * u_glow);
        }
    }
    
    // Add base circuit
    color += vec3(0.0, 1.0, 0.0) * c;
    
    // Add some variation
    color *= 0.8 + 0.2 * sin(u_time + st.x * 10.0);
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_complexity: { type: 'float', value: 20.0, min: 5.0, max: 50.0, step: 1.0, name: 'Circuit Density' },
            u_glow: { type: 'float', value: 0.5, min: 0.1, max: 2.0, step: 0.1, name: 'Glow Intensity' }
        }
    },
    
    galaxySpiral: {
        name: "Galaxy Spiral",
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
uniform float u_arms;
uniform float u_rotation;
uniform float u_density;

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
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec2 st = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
    
    float r = length(st);
    float a = atan(st.y, st.x);
    
    // Spiral arms
    float spiral = 0.0;
    for (float i = 0.0; i < 6.0; i++) {
        if (i >= u_arms) break;
        float armAngle = a + i * 6.28318 / u_arms + r * u_rotation + u_time * 0.1;
        float arm = sin(armAngle) * 0.5 + 0.5;
        arm = pow(arm, 3.0);
        arm *= exp(-r * 2.0);
        spiral += arm;
    }
    
    // Add stars
    vec2 starPos = st * 50.0;
    float stars = 0.0;
    for (float i = 0.0; i < 3.0; i++) {
        float n = noise(starPos + i * 100.0);
        stars += pow(n, 20.0) * u_density;
        starPos *= 2.0;
    }
    
    // Core glow
    float core = exp(-r * 3.0);
    
    // Colors
    vec3 color = vec3(0.0);
    color += vec3(0.8, 0.6, 1.0) * spiral;
    color += vec3(1.0, 0.9, 0.7) * stars;
    color += vec3(1.0, 0.8, 0.6) * core;
    
    // Add some nebula colors
    color += vec3(0.3, 0.1, 0.4) * noise(st * 5.0 + u_time * 0.05) * (1.0 - r);
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_arms: { type: 'float', value: 3.0, min: 1.0, max: 6.0, step: 1.0, name: 'Spiral Arms' },
            u_rotation: { type: 'float', value: 3.0, min: 0.0, max: 10.0, step: 0.1, name: 'Spiral Tightness' },
            u_density: { type: 'float', value: 0.5, min: 0.0, max: 1.0, step: 0.05, name: 'Star Density' }
        }
    },
    
    dnaHelix: {
        name: "DNA Helix",
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
uniform float u_twist;
uniform float u_strands;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 st = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
    
    float y = st.y * 5.0 - u_time;
    float x = st.x * 10.0;
    
    vec3 color = vec3(0.0);
    
    // DNA strands
    for (float i = 0.0; i < 4.0; i++) {
        if (i >= u_strands) break;
        
        float offset = i * 3.14159 / 2.0;
        float strand = sin(y * u_twist + offset) * 0.3;
        float dist = abs(x - strand);
        
        // Strand thickness
        float thickness = 0.05;
        float strandMask = smoothstep(thickness, thickness * 0.5, dist);
        
        // Color based on position
        vec3 strandColor = hsv2rgb(vec3(i * 0.25 + y * 0.1, 0.8, 1.0));
        color += strandColor * strandMask;
        
        // Connections between strands
        if (i < u_strands - 1.0) {
            float nextStrand = sin(y * u_twist + (i + 1.0) * 3.14159 / 2.0) * 0.3;
            float connection = step(min(strand, nextStrand), x) * step(x, max(strand, nextStrand));
            connection *= step(0.0, sin(y * u_twist * 2.0 + i * 3.14159));
            connection *= 0.5;
            color += vec3(0.5, 0.5, 1.0) * connection;
        }
    }
    
    // Glow effect
    float glow = 0.0;
    for (float i = 0.0; i < 4.0; i++) {
        if (i >= u_strands) break;
        float offset = i * 3.14159 / 2.0;
        float strand = sin(y * u_twist + offset) * 0.3;
        float dist = abs(x - strand);
        glow += exp(-dist * 10.0);
    }
    color += vec3(0.2, 0.3, 0.5) * glow * 0.3;
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_twist: { type: 'float', value: 1.0, min: 0.5, max: 3.0, step: 0.1, name: 'Twist Rate' },
            u_strands: { type: 'float', value: 2.0, min: 1.0, max: 4.0, step: 1.0, name: 'Number of Strands' }
        }
    },
    
    aurora: {
        name: "Aurora Borealis",
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
uniform float u_intensity;
uniform float u_speed;

float noise(vec2 p) {
    return sin(p.x * 10.0) * sin(p.y * 10.0);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 0.0;
    
    for (int i = 0; i < 6; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    
    // Create flowing bands
    float y = st.y;
    float x = st.x;
    
    float band1 = sin(x * 3.0 + u_time * u_speed) * 0.1;
    float band2 = sin(x * 5.0 - u_time * u_speed * 0.7) * 0.15;
    float band3 = sin(x * 7.0 + u_time * u_speed * 1.3) * 0.1;
    
    float bands = band1 + band2 + band3 + 0.5;
    
    // Add noise for organic movement
    bands += fbm(vec2(x * 2.0, u_time * 0.1)) * 0.2;
    
    // Create aurora shape
    float aurora = 0.0;
    aurora += exp(-abs(y - bands) * 5.0) * u_intensity;
    aurora += exp(-abs(y - bands) * 10.0) * u_intensity * 0.5;
    aurora += exp(-abs(y - bands) * 20.0) * u_intensity * 0.25;
    
    // Colors
    vec3 color = vec3(0.0);
    color += vec3(0.0, 1.0, 0.3) * aurora;
    color += vec3(0.0, 0.5, 1.0) * aurora * 0.5;
    color += vec3(1.0, 0.0, 0.5) * aurora * 0.2;
    
    // Add stars
    float stars = pow(noise(st * 100.0), 20.0) * (1.0 - aurora);
    color += vec3(stars);
    
    // Atmosphere
    color += vec3(0.0, 0.0, 0.1) * (1.0 - y);
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_intensity: { type: 'float', value: 1.0, min: 0.5, max: 3.0, step: 0.1, name: 'Aurora Intensity' },
            u_speed: { type: 'float', value: 0.5, min: 0.1, max: 2.0, step: 0.1, name: 'Flow Speed' }
        }
    },
    
    meshGradient: {
        name: "Mesh Gradient",
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
uniform float u_meshPoints;
uniform float u_smoothness;
uniform float u_grainAmount;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    
    vec3 color = vec3(0.0);
    float totalWeight = 0.0;
    
    // Create mesh points
    for (float i = 0.0; i < 16.0; i++) {
        if (i >= u_meshPoints * u_meshPoints) break;
        
        float x = mod(i, u_meshPoints) / (u_meshPoints - 1.0);
        float y = floor(i / u_meshPoints) / (u_meshPoints - 1.0);
        
        vec2 point = vec2(x, y);
        
        // Animate points
        point += vec2(
            sin(u_time * 0.5 + i * 0.5) * 0.1,
            cos(u_time * 0.3 + i * 0.7) * 0.1
        );
        
        float dist = distance(st, point);
        float weight = 1.0 / pow(dist + 0.01, u_smoothness);
        
        // Color for this point
        vec3 pointColor = hsv2rgb(vec3(
            i * 0.1 + u_time * 0.05,
            0.7,
            0.9
        ));
        
        color += pointColor * weight;
        totalWeight += weight;
    }
    
    color /= totalWeight;
    
    // Add grain
    float grain = random(st + fract(u_time)) * 2.0 - 1.0;
    color += grain * u_grainAmount;
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_meshPoints: { type: 'float', value: 4.0, min: 2.0, max: 6.0, step: 1.0, name: 'Mesh Points' },
            u_smoothness: { type: 'float', value: 2.0, min: 0.5, max: 4.0, step: 0.1, name: 'Smoothness' },
            u_grainAmount: { type: 'float', value: 0.05, min: 0.0, max: 0.2, step: 0.01, name: 'Grain Amount' }
        }
    },
    
    gradientNoise: {
        name: "Gradient Noise",
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
uniform float u_scale;
uniform float u_noiseAmount;
uniform float u_colorShift;

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
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    
    // Base gradient
    vec3 color1 = vec3(0.1, 0.2, 0.5);
    vec3 color2 = vec3(0.9, 0.1, 0.3);
    vec3 color3 = vec3(0.1, 0.9, 0.5);
    vec3 color4 = vec3(0.9, 0.7, 0.1);
    
    // Shift colors over time
    float t = u_time * u_colorShift;
    color1 = 0.5 + 0.5 * cos(t + color1 * 6.28318 + vec3(0, 2, 4));
    color2 = 0.5 + 0.5 * cos(t + color2 * 6.28318 + vec3(1, 3, 5));
    color3 = 0.5 + 0.5 * cos(t + color3 * 6.28318 + vec3(2, 4, 0));
    color4 = 0.5 + 0.5 * cos(t + color4 * 6.28318 + vec3(3, 5, 1));
    
    // Bilinear interpolation
    vec3 color = mix(
        mix(color1, color2, st.x),
        mix(color3, color4, st.x),
        st.y
    );
    
    // Add flowing noise
    float n = 0.0;
    vec2 pos = st * u_scale;
    for (float i = 0.0; i < 3.0; i++) {
        n += noise(pos + vec2(u_time * 0.1, u_time * 0.15) * (i + 1.0)) / (i + 1.0);
        pos *= 2.0;
    }
    
    color += n * u_noiseAmount;
    
    // Film grain
    float grain = random(st + fract(u_time * 100.0)) * 0.05;
    color += vec3(grain);
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_scale: { type: 'float', value: 3.0, min: 1.0, max: 10.0, step: 0.1, name: 'Noise Scale' },
            u_noiseAmount: { type: 'float', value: 0.2, min: 0.0, max: 0.5, step: 0.01, name: 'Noise Amount' },
            u_colorShift: { type: 'float', value: 0.1, min: 0.0, max: 1.0, step: 0.01, name: 'Color Shift Speed' }
        }
    },
    
    liquidMetal: {
        name: "Liquid Metal",
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
uniform float u_metallic;
uniform float u_viscosity;
uniform float u_refraction;

float noise(vec2 p) {
    return sin(p.x * 10.0) * sin(p.y * 10.0);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    
    for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    
    return value;
}

vec3 getNormal(vec2 p) {
    float eps = 0.01;
    float h = fbm(p);
    float hx = fbm(p + vec2(eps, 0.0));
    float hy = fbm(p + vec2(0.0, eps));
    
    return normalize(vec3((h - hx) / eps, (h - hy) / eps, 1.0));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 mouse = u_mouse / u_resolution;
    
    // Create flowing liquid surface
    vec2 p = st * 5.0;
    p += vec2(u_time * 0.1, u_time * 0.05);
    
    // Add mouse interaction
    vec2 toMouse = st - mouse;
    float mouseDist = length(toMouse);
    float mouseInfluence = exp(-mouseDist * 5.0) * 2.0;
    p += normalize(toMouse) * mouseInfluence * u_viscosity;
    
    // Get surface normal
    vec3 normal = getNormal(p);
    
    // Lighting
    vec3 lightDir = normalize(vec3(mouse - 0.5, 0.5));
    float diffuse = max(dot(normal, lightDir), 0.0);
    
    // View direction (straight down)
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    
    // Reflection
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    
    // Refraction effect
    vec2 refractedUV = st + normal.xy * u_refraction * 0.1;
    float refractPattern = fbm(refractedUV * 10.0 + u_time * 0.2);
    
    // Metallic color
    vec3 baseColor = vec3(0.7, 0.7, 0.8);
    vec3 color = baseColor * diffuse;
    color += vec3(1.0) * spec * u_metallic;
    
    // Add chromatic aberration for metallic look
    color.r += fbm(p + vec2(0.01, 0.0)) * 0.1;
    color.b += fbm(p - vec2(0.01, 0.0)) * 0.1;
    
    // Environment reflection simulation
    float env = fbm(reflect(vec3(st - 0.5, 0.0), normal).xy * 5.0);
    color += vec3(0.5, 0.6, 0.7) * env * 0.3 * u_metallic;
    
    // Add ripples from refraction
    color += refractPattern * 0.1;
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_metallic: { type: 'float', value: 0.8, min: 0.0, max: 1.0, step: 0.05, name: 'Metallic' },
            u_viscosity: { type: 'float', value: 0.5, min: 0.0, max: 1.0, step: 0.05, name: 'Viscosity' },
            u_refraction: { type: 'float', value: 0.5, min: 0.0, max: 1.0, step: 0.05, name: 'Refraction' }
        }
    },
    
    holographicGradient: {
        name: "Holographic Gradient",
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
uniform float u_iridescence;
uniform float u_grainIntensity;
uniform float u_waveFrequency;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    
    // Create holographic waves
    float wave1 = sin(st.x * u_waveFrequency + u_time) * 0.5 + 0.5;
    float wave2 = sin(st.y * u_waveFrequency * 0.7 + u_time * 1.3) * 0.5 + 0.5;
    float wave3 = sin((st.x + st.y) * u_waveFrequency * 0.5 + u_time * 0.8) * 0.5 + 0.5;
    
    // Combine waves for interference pattern
    float interference = wave1 * wave2 * wave3;
    
    // Create iridescent color shift
    float hue = interference + st.x * 0.3 + st.y * 0.2 + u_time * 0.1;
    vec3 color = hsv2rgb(vec3(hue * u_iridescence, 0.7, 0.9));
    
    // Add metallic sheen
    float sheen = pow(wave1 * wave2, 2.0);
    color += vec3(sheen) * 0.3;
    
    // Holographic sparkles
    float sparkle = pow(random(floor(st * 100.0) + floor(u_time * 10.0)), 20.0);
    color += vec3(sparkle);
    
    // Film grain for texture
    float grain = (random(st + fract(u_time * 100.0)) - 0.5) * u_grainIntensity;
    color += vec3(grain);
    
    // Subtle vignette
    float vignette = 1.0 - length(st - 0.5) * 0.5;
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
}`,
        uniforms: {
            u_iridescence: { type: 'float', value: 2.0, min: 0.5, max: 5.0, step: 0.1, name: 'Iridescence' },
            u_grainIntensity: { type: 'float', value: 0.05, min: 0.0, max: 0.2, step: 0.01, name: 'Grain Intensity' },
            u_waveFrequency: { type: 'float', value: 10.0, min: 5.0, max: 30.0, step: 1.0, name: 'Wave Frequency' }
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

// Initialize time
baseTime = performance.now() / 1000.0;

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
    // Calculate time based on play state and speed
    let time;
    if (isPlaying) {
        time = (now / 1000.0 - baseTime) * timeSpeed;
    } else {
        time = pausedTime;
    }
    
    if (programInfo) {
        drawScene(gl, programInfo, buffers, time, mouse);
    }
    
    // Comparison canvas
    if (isComparisonMode && comparisonProgram) {
        const rect = comparisonCanvas.getBoundingClientRect();
        comparisonCanvas.width = rect.width * window.devicePixelRatio;
        comparisonCanvas.height = rect.height * window.devicePixelRatio;
        comparisonGL.viewport(0, 0, comparisonCanvas.width, comparisonCanvas.height);
        
        // Draw comparison shader
        const compProgramInfo = {
            program: comparisonProgram,
            attribLocations: {
                vertexPosition: comparisonGL.getAttribLocation(comparisonProgram, 'aVertexPosition'),
            },
            uniformLocations: {
                u_time: comparisonGL.getUniformLocation(comparisonProgram, 'u_time'),
                u_resolution: comparisonGL.getUniformLocation(comparisonProgram, 'u_resolution'),
                u_mouse: comparisonGL.getUniformLocation(comparisonProgram, 'u_mouse'),
            }
        };
        
        // Add custom uniforms
        for (const name in comparisonShader.uniforms) {
            compProgramInfo.uniformLocations[name] = comparisonGL.getUniformLocation(comparisonProgram, name);
        }
        
        drawScene(comparisonGL, compProgramInfo, comparisonBuffers, time, mouse, comparisonShader.uniforms);
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

function drawScene(gl, programInfo, buffers, time, mouse, customUniforms = uniformValues) {
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
    for (const [key, value] of Object.entries(customUniforms)) {
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
    const shader = SHADERS[currentShader];
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

// Time control handlers
playPauseBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playPauseIcon.textContent = '⏸';
        baseTime = performance.now() / 1000.0 - pausedTime;
    } else {
        playPauseIcon.textContent = '▶';
        pausedTime = (performance.now() / 1000.0 - baseTime) * timeSpeed;
    }
});

resetTimeBtn.addEventListener('click', () => {
    baseTime = performance.now() / 1000.0;
    pausedTime = 0;
});

speedSlider.addEventListener('input', (e) => {
    timeSpeed = parseFloat(e.target.value);
    speedDisplay.textContent = timeSpeed.toFixed(1) + 'x';
    if (isPlaying) {
        const currentTime = (performance.now() / 1000.0 - baseTime) * timeSpeed;
        baseTime = performance.now() / 1000.0 - currentTime / timeSpeed;
    }
});

// Screenshot functionality
screenshotBtn.addEventListener('click', () => {
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shader_${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        log('✓ Screenshot saved', 'success');
    });
});

// Code snippets
function buildSnippetsMenu() {
    snippetsMenu.innerHTML = '';
    
    for (const [key, snippet] of Object.entries(codeSnippets)) {
        const item = document.createElement('div');
        item.className = 'snippet-item';
        item.innerHTML = `
            <div class="snippet-title">${snippet.title}</div>
            <div class="snippet-preview">${snippet.code.split('\n')[0]}</div>
        `;
        
        item.addEventListener('click', () => {
            const activeEditor = document.activeElement;
            if (activeEditor === vertexEditor || activeEditor === fragmentEditor) {
                const start = activeEditor.selectionStart;
                const end = activeEditor.selectionEnd;
                const text = activeEditor.value;
                
                activeEditor.value = text.substring(0, start) + snippet.code + text.substring(end);
                activeEditor.setSelectionRange(start, start + snippet.code.length);
                activeEditor.focus();
                
                // Trigger input event for auto-save
                activeEditor.dispatchEvent(new Event('input'));
            }
            snippetsMenu.classList.remove('active');
            log('✓ Snippet inserted', 'success');
        });
        
        snippetsMenu.appendChild(item);
    }
}

snippetsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    snippetsMenu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!snippetsMenu.contains(e.target) && e.target !== snippetsBtn) {
        snippetsMenu.classList.remove('active');
    }
});

buildSnippetsMenu();

// Comparison mode
let isComparisonMode = false;

function toggleComparisonMode() {
    isComparisonMode = !isComparisonMode;
    
    if (isComparisonMode) {
        // Initialize comparison canvas
        comparisonGL = comparisonCanvas.getContext('webgl');
        if (!comparisonGL) {
            log('✗ Comparison mode requires WebGL', 'error');
            return;
        }
        
        comparisonCanvas.classList.add('active');
        comparisonMode.classList.add('active');
        
        // Store current shader as comparison
        comparisonShader = {
            vertex: vertexEditor.value,
            fragment: fragmentEditor.value,
            uniforms: { ...uniformValues }
        };
        
        // Initialize comparison shader
        try {
            const vsShader = loadShaderSource(comparisonGL, comparisonGL.VERTEX_SHADER, comparisonShader.vertex);
            const fsShader = loadShaderSource(comparisonGL, comparisonGL.FRAGMENT_SHADER, comparisonShader.fragment);
            comparisonProgram = initShaderProgram(comparisonGL, vsShader, fsShader);
            comparisonBuffers = initBuffers(comparisonGL);
            
            log('✓ Comparison mode enabled - edit shader to see differences', 'success');
        } catch (e) {
            log('✗ Failed to initialize comparison shader', 'error');
            toggleComparisonMode();
        }
    } else {
        comparisonCanvas.classList.remove('active');
        comparisonMode.classList.remove('active');
        comparisonShader = null;
        comparisonProgram = null;
    }
}

// Add comparison toggle with keyboard shortcut
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleComparisonMode();
    }
});