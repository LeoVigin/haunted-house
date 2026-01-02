import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/addons/objects/Sky.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import { depth } from 'three/tsl'


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Texture
const textureLoader = new THREE.TextureLoader()
// REMINDER : USE 1K AND NOT 4K, ZIP, dont usually use bump, not exr (large file), use jpg but usually use pgn for the normal(since its data) but of texture have bumps etc can use smaller version, normal (GL) not DX  

// FloorTexture
const floorAlphaT = textureLoader.load('./floor/alpha.webp')
const floorColorT = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp')
const floorARMT = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp')
const floorNormalT = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp')
const floorDisplacementT = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp')

floorColorT.colorSpace = THREE.SRGBColorSpace

floorColorT.repeat.set(8, 8)
floorARMT.repeat.set(8, 8)
floorNormalT.repeat.set(8, 8)
floorDisplacementT.repeat.set(8, 8)

floorColorT.wrapS = THREE.RepeatWrapping
floorARMT.wrapS = THREE.RepeatWrapping
floorNormalT.wrapS = THREE.RepeatWrapping
floorDisplacementT.wrapS = THREE.RepeatWrapping

floorColorT.wrapT = THREE.RepeatWrapping
floorARMT.wrapT = THREE.RepeatWrapping
floorNormalT.wrapT = THREE.RepeatWrapping
floorDisplacementT.wrapT = THREE.RepeatWrapping


// WallTexture
const wallColorT = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp')
const wallARMT = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp')
const wallNormalT = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp')

wallColorT.colorSpace = THREE.SRGBColorSpace


// roof1Texture
const roof1ColorT = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp')
const roof1ARMT = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp')
const roof1NormalT = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp')

roof1ColorT.colorSpace = THREE.SRGBColorSpace

roof1ColorT.repeat.set(3, 1)
roof1ARMT.repeat.set(3, 1)
roof1NormalT.repeat.set(3, 1)

roof1ColorT.wrapS = THREE.RepeatWrapping
roof1ARMT.wrapS = THREE.RepeatWrapping
roof1NormalT.wrapS = THREE.RepeatWrapping


// BusheTexture
const bushColorT = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp')
const bushARMT = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp')
const bushNormalT = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp')

bushColorT.colorSpace = THREE.SRGBColorSpace

bushColorT.repeat.set(2, 1)
bushARMT.repeat.set(2, 1)
bushNormalT.repeat.set(2, 1)

bushColorT.wrapS = THREE.RepeatWrapping
bushARMT.wrapS = THREE.RepeatWrapping
bushNormalT.wrapS = THREE.RepeatWrapping


// Gravetexture
const graveColorT = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp')
const graveARMT = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp')
const graveNormalT = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp')

graveColorT.colorSpace = THREE.SRGBColorSpace

graveColorT.repeat.set(0.3, 0.4)
graveARMT.repeat.set(0.3, 0.4)
graveNormalT.repeat.set(0.3, 0.4)


// DoorTexture
const doorColorT = textureLoader.load('../door/color.webp')
const doorAlphaT = textureLoader.load('./door/alpha.webp')
const doorAmbientOcclusionT = textureLoader.load('./door/ambientOcclusion.webp')
const doorHeightT = textureLoader.load('./door/height.webp')
const doorNormalT = textureLoader.load('./door/normal.webp')
const doorMetalnessT = textureLoader.load('../door/metalness.webp')
const doorRoughnessT = textureLoader.load('../door/roughness.webp')

doorColorT.colorSpace = THREE.SRGBColorSpace


/**
 * House
 */


// FloorGeometry
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaT,
        transparent: true,
        map: floorColorT,
        aoMap: floorARMT,
        roughnessMap: floorARMT,
        metalnessMap: floorARMT,
        normalMap: floorNormalT,
        displacementMap: floorDisplacementT,
        displacementScale: 0.3,
        displacementBias: - 0.2
    })
)
floor.rotation.x = - Math.PI / 2
scene.add(floor)

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floorDisplacementScale')
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floorDisplacementBias')


// HouseGeometry
const house = new THREE.Group()
scene.add(house)


// wallGeometry
const wall1 = new THREE.Mesh(
    new THREE.BoxGeometry(4, 5, 5.25),
    new THREE.MeshStandardMaterial({
        map: wallColorT,
        aoMap: wallARMT,
        roughnessMap: wallARMT,
        metalnessMap: wallARMT,
        normalMap: wallNormalT
    })
)

const wall2 = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 6, 2.5),
    new THREE.MeshStandardMaterial({
        map: wallColorT,
        aoMap: wallARMT,
        roughnessMap: wallARMT,
        metalnessMap: wallARMT,
        normalMap: wallNormalT
    })
)

const wall3 = new THREE.Mesh(
    new THREE.BoxGeometry(2, 5, 2),
    new THREE.MeshStandardMaterial({
        map: wallColorT,
        aoMap: wallARMT,
        roughnessMap: wallARMT,
        metalnessMap: wallARMT,
        normalMap: wallNormalT
    })
)

const wall4 = new THREE.Mesh(
    new THREE.BoxGeometry(2, 8, 2),
    new THREE.MeshStandardMaterial({
        map: wallColorT,
        aoMap: wallARMT,
        roughnessMap: wallARMT,
        metalnessMap: wallARMT,
        normalMap: wallNormalT
    })
)

wall1.position.y = 5 / 2
// gui.add(wall1.width, 'width').min(0).max(10).step(1)

wall2.position.y = 5 / 2
wall2.position.x = 3.24
wall2.position.z = 0

wall3.position.y = 5 / 2
wall3.position.x = -3
wall3.position.z = -1.64

wall4.position.y = 5 / 2
wall4.position.x = -5
wall4.position.z = -1.64

// gui.add(wall2.position, 'x').min(0).max(10).step(0.01).name('wall2PositionX')
// gui.add(wall2.position, 'z').min(-1).max(5).step(0.01).name('wall2PositionZ')
// gui.add(wall3.position, 'x').min(-5).max(10).step(0.01).name('wall3PositionX')
// gui.add(wall3.position, 'z').min(-5).max(5).step(0.01).name('wall3PositionZ')

house.add(wall1, wall2, wall3, wall4)


// roof1Geometry
const roof1 = new THREE.Mesh(
    new THREE.ConeGeometry(4.3, 3, 4),
    new THREE.MeshStandardMaterial({
        map: roof1ColorT,
        aoMap: roof1ARMT,
        roughnessMap: roof1ARMT,
        metalnessMap: roof1ARMT,
        normalMap: roof1NormalT
    })
)

const roof2 = new THREE.Mesh(
    new THREE.ConeGeometry(2.50, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: roof1ColorT,
        aoMap: roof1ARMT,
        roughnessMap: roof1ARMT,
        metalnessMap: roof1ARMT,
        normalMap: roof1NormalT
    })
)

const roof3 = new THREE.Mesh(
    new THREE.ConeGeometry(2, 3, 4),
    new THREE.MeshStandardMaterial({
        map: roof1ColorT,
        aoMap: roof1ARMT,
        roughnessMap: roof1ARMT,
        metalnessMap: roof1ARMT,
        normalMap: roof1NormalT
    })
)

const roof4 = new THREE.Mesh(
    new THREE.ConeGeometry(2.5, 2, 4),
    new THREE.MeshStandardMaterial({
        map: roof1ColorT,
        aoMap: roof1ARMT,
        roughnessMap: roof1ARMT,
        metalnessMap: roof1ARMT,
        normalMap: roof1NormalT
    })
)

roof1.position.y = 5 + 1.18
roof1.rotation.y = Math.PI / 4
roof1.position.x = 0
roof1.position.z = 0

roof2.position.y = 6 + 0.75
roof2.rotation.y = Math.PI / 4
roof2.position.x = 3.24

roof3.position.y = 8
roof3.rotation.y = Math.PI / 4
roof3.position.x = -5
roof3.position.z = -1.65

roof4.position.y = 5.7
roof4.rotation.y = Math.PI / 4
roof4.position.x = -2.7
roof4.position.z = -1.3

house.add(roof1, roof2, roof3, roof4)


// DoorGeometry
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorT,
        transparent: true,
        alphaMap: doorAlphaT,
        aoMap: doorAmbientOcclusionT,
        displacementMap: doorHeightT,
        normalMap: doorNormalT,
        roughnessMap: doorRoughnessT,
        metalnessMap: doorMetalnessT,
        displacementBias: - 0.04,
        displacementScale: 0.15
    })
)
door.position.y = 1
door.position.z = 2.6 + 0.01
house.add(door)


// BushesGeometry
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    map: bushColorT,
    aoMap: bushARMT,
    roughnessMap: bushARMT,
    metalnessMap: bushARMT,
    normalMap: bushNormalT
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(-2.7, 0.2,0.11)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(2.95, 0.1, 2.5)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-3.69, 0.1, 0.84)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(4.23, 0.05, 2.87)

house.add(bush1, bush2, bush3, bush4)

// GravesGeometry
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorT,
    aoMap: graveARMT,
    roughnessMap: graveARMT,
    metalnessMap: graveARMT,
    normalMap: graveNormalT
})

const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 30; i++){

    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 4
    // house = 2.5 so minimun is 3 to not touch the house, and use 4 for the limit of where a grave can spawn
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x
    grave.position.z = z
    grave.position.y = Math.random() * 0.4

    grave.rotation.x = (Math.random() - 0.5 ) * 0.4
    grave.rotation.y = (Math.random() - 0.5 ) * 0.4
    grave.rotation.z = (Math.random() - 0.5 ) * 0.4

    graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// PointLight
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.2, 3)
house.add(doorLight)


// Ghosts
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Cast and receive
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

wall1.castShadow = true
wall1.receiveShadowShadow = true
roof1.castShadow = true
floor.receiveShadow = true

for(const grave of graves.children){
    grave.castShadow = true
}

// Mapping
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.near = 20
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.top = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.top = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.top = 10


// Sky
const sky = new Sky()
sky.scale.set(100, 100, 100)

sky.material.uniforms.turbidity.value = 10
sky.material.uniforms.rayleigh.value = 3
sky.material.uniforms.mieCoefficient.value = 0.1
sky.material.uniforms.mieDirectionalG.value = 0.95
sky.material.uniforms.sunPosition.value.set(0.3, -0.038, -0.95)

scene.add(sky)

// Fog
scene.fog = new THREE.FogExp2('#02343f', 0.1)

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // GhostAnimation
    const ghost1Angle =  elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)

    const ghost2Angle =  - elapsedTime * 0.38
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)

    const ghost3Angle =  elapsedTime * 0.23
    ghost3.position.x = Math.cos(ghost3Angle) * 6
    ghost3.position.z = Math.sin(ghost3Angle) * 6
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()