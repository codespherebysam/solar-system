const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
function loadTexture(url) {
    return textureLoader.load(url);
}

// 🌟 Massive Star Field (Increased to 6999999 stars!)
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 6999999; i++) {  // Fully packed starry background
    starVertices.push((Math.random() - 0.5) * 40000);
    starVertices.push((Math.random() - 0.5) * 40000);
    starVertices.push((Math.random() - 0.5) * 40000);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1, transparent: true, opacity: 0.9 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// 🌞 Sun with glowing effect
const sunMaterial = new THREE.MeshStandardMaterial({ 
    map: loadTexture('https://upload.wikimedia.org/wikipedia/commons/3/3a/Solar-system-sun-texture.jpg'), 
    emissive: 0xffa500, 
    emissiveIntensity: 20
});
const sun = new THREE.Mesh(new THREE.SphereGeometry(15, 128, 128), sunMaterial);
scene.add(sun);

const sunLight = new THREE.PointLight(0xffa500, 40, 900);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// 🌍 Planets
function createPlanet(size, texture, distance, speed) {
    const planetMaterial = new THREE.MeshStandardMaterial({ map: loadTexture(texture) });
    const planet = new THREE.Mesh(new THREE.SphereGeometry(size, 128, 128), planetMaterial);
    const orbit = new THREE.Object3D();
    orbit.add(planet);
    planet.position.x = distance;
    scene.add(orbit);
    return { planet, orbit, speed };
}

const planets = [
    createPlanet(2, 'https://upload.wikimedia.org/wikipedia/commons/2/23/Mercury_map.jpg', 30, 0.02),
    createPlanet(3, 'https://upload.wikimedia.org/wikipedia/commons/8/85/Venus_texture_map.jpg', 50, 0.015),
    createPlanet(4, 'https://upload.wikimedia.org/wikipedia/commons/8/80/Earthmap4K.jpg', 70, 0.01),
    createPlanet(3.5, 'https://upload.wikimedia.org/wikipedia/commons/2/28/Mars_texture.jpg', 90, 0.007),
];

// 🌑 Asteroid Belt (Reduced Quantity)
const asteroidGroup = new THREE.Group();
for (let i = 0; i < 30; i++) { 
    const asteroidMaterial = new THREE.MeshStandardMaterial({ map: loadTexture('https://upload.wikimedia.org/wikipedia/commons/7/7d/Asteroid_texture.jpg') });
    const asteroid = new THREE.Mesh(new THREE.SphereGeometry(Math.random() * 1.5, 32, 32), asteroidMaterial);
    let angle = Math.random() * Math.PI * 2;
    let distance = 110 + Math.random() * 30;
    let height = Math.random() * 10 - 5;
    asteroid.position.set(Math.cos(angle) * distance, height, Math.sin(angle) * distance);
    asteroid.rotation.x = Math.random() * Math.PI;
    asteroid.rotation.y = Math.random() * Math.PI;
    asteroid.userData.velocity = (Math.random() + 0.5) * 0.02;
    asteroidGroup.add(asteroid);
}
scene.add(asteroidGroup);

// 💡 Ambient Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// 🎥 Adjust Camera (Zoomed In)
camera.position.set(0, 30, 130);
camera.lookAt(0, 0, 0);

// 🌠 Animation Loop
function animate() {
    requestAnimationFrame(animate);
    sun.rotation.y += 0.002;
    planets.forEach(({ planet, orbit, speed }) => {
        orbit.rotation.y += speed;
        planet.rotation.y += 0.005;
    });
    asteroidGroup.children.forEach(asteroid => {
        asteroid.rotation.x += 0.01;
        asteroid.rotation.y += 0.01;
        asteroid.position.x += Math.sin(Date.now() * 0.0005) * 0.1;
        asteroid.position.z -= asteroid.userData.velocity;
        if (asteroid.position.z < -200) {
            asteroid.position.z = 150;
        }
    });
    renderer.render(scene, camera);
}
animate();
