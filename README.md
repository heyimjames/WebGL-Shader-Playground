# WebGL Shader Playground 🎨

A powerful, browser-based WebGL shader editor with real-time preview, built with vanilla JavaScript. Create, edit, and share stunning visual effects using GLSL shaders.

![WebGL Shader Playground](https://img.shields.io/badge/WebGL-Shader%20Editor-10a37f)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

### Core Features
- **Real-time Shader Compilation** - See your changes instantly as you type
- **Dual Editor Mode** - Separate vertex and fragment shader editors with syntax highlighting
- **25 Built-in Shader Presets** - From simple gradients to complex 3D fractals
- **Interactive Canvas** - Mouse interaction for dynamic effects
- **Performance Monitoring** - FPS counter with detailed GPU statistics

### Advanced Features
- **Texture Support** - Load up to 4 images as textures for image processing
- **Parameter Controls** - Real-time sliders for shader uniforms
- **Save System** - Save your shaders locally with custom names
- **Export Functionality** - Export shaders as standalone HTML files
- **Share via URL** - Generate shareable links with encoded shader data
- **Auto-save** - Automatic saving to prevent work loss
- **Category Filtering** - Filter shaders by type (2D, 3D, Generative, etc.)

### Developer Features
- **Line Numbers** - With error line highlighting
- **Keyboard Shortcuts** - Professional IDE-like shortcuts
- **Documentation Generator** - Auto-generate markdown docs for your shaders
- **Shader Minification** - Optimize shaders for smaller export sizes
- **GLSL Syntax Highlighting** - Powered by Prism.js

## 🚀 Getting Started

### Quick Start
1. Clone the repository:
```bash
git clone https://github.com/yourusername/webgl-shader-playground.git
cd webgl-shader-playground
```

2. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)

3. Start creating! The playground loads with a default kaleidoscope shader.

### System Requirements
- Modern web browser with WebGL support
- No build process or dependencies required
- Works on desktop and mobile devices

## 🎮 Usage Guide

### Basic Workflow
1. **Select a Preset** - Choose from the dropdown or start with "Custom Shader"
2. **Edit Shaders** - Modify vertex or fragment shaders in the editors
3. **Run** - Click "Run Shader" or press `Ctrl/Cmd + Enter`
4. **Adjust Parameters** - Use the sliders to tweak uniform values
5. **Save/Export** - Save locally or export as standalone HTML

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Run shader |
| `F` | Toggle FPS counter |
| `F11` | Toggle fullscreen |
| `Tab` | Switch between editors |
| `Ctrl/Cmd + S` | Save shader |
| `Ctrl/Cmd + E` | Export shader |
| `Ctrl/Cmd + /` | Toggle comment |
| `Esc` | Close dialogs |
| `?` | Show keyboard shortcuts |

### Working with Textures
1. Click "Add Texture" in the sidebar
2. Select an image file (JPG, PNG, GIF)
3. Use in your shader as `u_texture0`, `u_texture1`, etc.
4. Example:
```glsl
uniform sampler2D u_texture0;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec4 color = texture2D(u_texture0, uv);
    gl_FragColor = color;
}
```

## 🎨 Built-in Shaders

### 2D Shaders
- **Kaleidoscope** - Symmetrical patterns with mouse interaction
- **Glass Refraction** - Realistic glass distortion effects
- **Rainbow Gradient** - Animated color gradients
- **Plasma Effect** - Classic demo scene plasma
- **Voronoi Cells** - Organic cellular patterns
- **Wave Interference** - Mathematical wave patterns

### 3D Shaders
- **3D Spheres** - Ray-marched spheres with lighting
- **3D Fractal Explorer** - Navigate through Mandelbulb fractals

### Image Processing
- **Image Effects** - Blur, edge detection, pixelation, and more

### Generative
- **Mandelbrot Fractal** - Explore infinite mathematical beauty
- **Fractal Noise** - Multi-octave Perlin noise
- **Psychedelic Tunnel** - Animated tunnel effect
- **Matrix Rain** - Digital rain effect inspired by The Matrix
- **Neon Grid** - Retro synthwave grid with perspective
- **Lava Lamp** - Mesmerizing fluid blob simulation
- **Starfield** - Infinite space with warp speed effect
- **Fluid Simulation** - Interactive fluid dynamics
- **Circuit Board** - Animated cyberpunk circuit patterns
- **Galaxy Spiral** - Rotating spiral galaxy with stars
- **DNA Helix** - Double helix structure animation
- **Aurora Borealis** - Northern lights in the sky
- **Mesh Gradient** - Smooth animated gradients with grain
- **Gradient Noise** - Flowing gradients with organic noise
- **Liquid Metal** - Interactive metallic surface
- **Holographic Gradient** - Iridescent holographic effects

## 📝 Shader Development

### Available Uniforms
All shaders have access to these built-in uniforms:

```glsl
uniform float u_time;        // Time in seconds
uniform vec2 u_resolution;   // Canvas size in pixels  
uniform vec2 u_mouse;        // Mouse position in pixels
```

### Custom Uniforms
Define custom parameters in your shader preset:

```javascript
uniforms: {
    u_scale: { 
        type: 'float', 
        value: 1.0, 
        min: 0.1, 
        max: 10.0, 
        step: 0.1, 
        name: 'Scale' 
    }
}
```

### Minimal Shader Template
```glsl
// Vertex Shader
attribute vec4 aVertexPosition;
void main() {
    gl_Position = aVertexPosition;
}

// Fragment Shader
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    gl_FragColor = vec4(st.x, st.y, sin(u_time), 1.0);
}
```

## 🛠️ Technical Details

### Architecture
- **Pure Vanilla JavaScript** - No frameworks or build tools
- **WebGL 1.0** - Maximum compatibility
- **Modular Design** - Clean separation of concerns
- **Event-Driven** - Reactive UI updates

### Performance Optimizations
- **Fullscreen Triangle** - Efficient screen coverage
- **Shader Caching** - Compiled shaders are reused
- **Texture Management** - Automatic cleanup and memory tracking
- **RAF Loop** - Smooth 60 FPS animation

### Browser Storage
- **LocalStorage** - For saved shaders and auto-save
- **URL Encoding** - For shader sharing via links
- **Base64** - For texture data in exports

## 🎯 Advanced Features

### Performance Monitoring
Press `F` to toggle detailed stats:
- FPS (Frames Per Second)
- Draw calls per frame
- Shader compilation time
- Texture memory usage
- Vertex count

### Export Options
- **Standalone HTML** - Self-contained file with all assets
- **Minified Output** - Optional shader compression
- **Embedded Textures** - Images included as data URLs
- **Documentation** - Auto-generated shader documentation

### Category System
Shaders are organized by categories:
- **2D** - Flat, screen-space effects
- **3D** - Ray marching and 3D techniques
- **Generative** - Procedural patterns
- **Interactive** - Mouse/time responsive
- **Image** - Texture processing

## 🤝 Contributing

Contributions are welcome! Here's how to add a new shader:

1. Add shader definition to `shaders` object in `main.js`
2. Add description to `shaderDescriptions` object
3. Include appropriate categories
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use ES6+ features
- Follow existing naming conventions
- Comment complex algorithms
- Test on multiple browsers

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built by [@jamesfrewin1](https://twitter.com/jamesfrewin1)
- Inspired by [Shadertoy](https://www.shadertoy.com) and [GLSL Editor](https://github.com/patriciogonzalezvivo/glslEditor)
- Uses [Prism.js](https://prismjs.com/) for syntax highlighting
- UI design inspired by OpenAI's clean aesthetic

## 🐛 Known Issues

- WebGL 2.0 features not supported (for compatibility)
- Maximum 4 textures due to WebGL limitations
- Some mobile devices may have performance limitations
- Export size limited by browser data URL restrictions

## 🚧 Roadmap

- [ ] WebGL 2.0 support with fallback
- [ ] More built-in shaders
- [ ] Shader graph/node editor
- [ ] Multi-pass rendering
- [ ] Audio input support
- [ ] Collaborative editing
- [ ] Shader marketplace

---

Made with ❤️ for the creative coding community 