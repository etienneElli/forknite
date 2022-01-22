import * as THREE from "three";
import { ThreeDemoApp } from "../../three-core-modules/core/ThreeApp";
import * as CANNON from "cannon-es";
import { PointOctant, PointOctree } from "sparse-octree";
import { Box3, Mesh, Vector2, Vector3 } from "three";
import { VoxelFactory } from "../../three-core-modules/voxels/VoxelFactory";
import { VoxelRenderer } from "../../three-core-modules/voxels/VoxelRenderer";
import {
  ModelsFactory,
  RobotExpressiveModel,
} from "../../three-resources/catalogs/Models";
import { HighlightTriangle } from "../../three-core-modules/helpers/HighlightTriangle";
import { Player } from "../../three-core-modules/misc/Player";
import Mousetrap from "mousetrap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OrbitalCamera } from "../../three-core-modules/misc/Controls";
import { getLevelMeshes, proceduralCavernsSplitted } from "../../three-experiments/Voxels/VoxelsDemos";

const PLAYER_MAX_SPEED = 0.5; // m/s
const PLAYER_ROT_SPEED = 0.025;

export class ForkniteDemo extends ThreeDemoApp {
  static Name = "ForkniteDemo";
  orbital;
  player;
  mem = { rot: new Vector2(0, 0) };

  voxelsMeshes: any;
  highlightTriangle: HighlightTriangle;

  init(): void {
    super.init();
    console.log("[VoxelDemo] Init");

    // Init Camera
    this.camera.position.y = 10;
    this.camera.position.z = 100;
    this.orbital = new OrbitalCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera = this.orbital.camera;

    this.initDebugTools();
    this.populate();
    this.initControls();
    this.addGround();
    this.addLights();

    this.highlightTriangle = new HighlightTriangle();
    this.scene.add(this.highlightTriangle);
    // console.log(this.highlightTriangle)
  }

  initControls(customBindings = {}) {
    super.initControls();
    // const controls = new OrbitControls(this.camera, this.renderer.domElement);
    // controls.enableRotate = true;
    // controls.minDistance = 3;
    // controls.maxDistance = 500;
    // controls.maxPolarAngle = Math.PI * 0.55;
    // controls.enableDamping = true;
    // controls.screenSpacePanning = true;
    // controls.target.y = 1.5;
    // this.controls = controls;
    this.controls.joyLeft.autoReset = true;
    this.controls.joyRight.autoReset = false;

    // Mousetrap.bind("z", (e) => console.log(e), "keypress");
    Mousetrap.bind("z", (e) => (this.controls.joyLeft.y = -1), "keydown");
    Mousetrap.bind("z", (e) => (this.controls.joyLeft.y = 0), "keyup");
    Mousetrap.bind("s", (e) => (this.controls.joyLeft.y = 1), "keydown");
    Mousetrap.bind("s", (e) => (this.controls.joyLeft.y = 0), "keyup");
    Mousetrap.bind("q", (e) => (this.controls.joyLeft.x = -1), "keydown");
    Mousetrap.bind("q", (e) => (this.controls.joyLeft.x = 0), "keyup");
    Mousetrap.bind("d", (e) => (this.controls.joyLeft.x = 1), "keydown");
    Mousetrap.bind("d", (e) => (this.controls.joyLeft.x = 0), "keyup");

    Mousetrap.bind(
      "t",
      () =>
        (Player.current as Player).triggerDragging(
          this.highlightTriangle.center
        ),
      "keypress"
    );
    Mousetrap.bind(
      "t",
      () => (Player.current as Player).releaseDragging(),
      "keyup"
    );

    // merge with predefined base class controls
    // this.controls = { ...this.controls, ...demoControls };
  }

  addGround() {
    // Ground body
    const planeShape = new CANNON.Plane();
    const planeBody = new CANNON.Body({ mass: 0 });
    planeBody.position.set(0, 0, 0);
    planeBody.addShape(planeShape);
    planeBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2
    );
    this.world.addBody(planeBody);
  }

  // Voxels population
  populate() {
    const modelClass = RobotExpressiveModel;
    ModelsFactory.create(modelClass).then((model) => {
      this.player = new Player(modelClass);
      this.player.initBody();
      this.player.initConstraints();
      this.scene.add(this.player);
      this.player.add(this.orbital);
      console.log("Player created");
    });

    const size = 128;
    const renderBox = new Box3(
      new Vector3(-size, -size, -size),
      new Vector3(size, size, size)
    );

    proceduralCavernsSplitted();

    // if (!VoxelRenderer.renderOctree.countPoints && !(root as PointOctant<any>).data) { // first rendering
    console.log("VoxelRenderer octree structure: first init");
    this.clock.getDelta();
    // initialize octree renderer
    VoxelRenderer.renderOctree = new PointOctree(renderBox.min, renderBox.max);
    // VoxelRenderer.renderOctree.root.data = {};
    // VoxelRenderer.render(VoxelRenderer.renderOctree.root);
    console.log(Object.values(VoxelFactory.entities));
    Object.values(VoxelFactory.entities).forEach((entity: any) => {
      var vxSpacing = 1 / entity.voxelDef.vxdensity;
      var range = renderBox.clone().intersect(entity.dimensions);
      // console.log("initial range");
      // console.log(range.clone());
      range.min
        .floor()
        .multiplyScalar(entity.voxelDef.vxdensity)
        .floor()
        .multiplyScalar(vxSpacing);
      range.max
        .ceil()
        .multiplyScalar(entity.voxelDef.vxdensity)
        .ceil()
        .multiplyScalar(vxSpacing);
      // console.log("rounded to");
      // console.log(range);
      VoxelRenderer.preProcess(entity, range);
    });
    console.log(
      "preprocessed %s entities (%s voxels) in %ss",
      VoxelFactory.entityCount,
      VoxelRenderer.renderOctree.countPoints(),
      Math.round(this.clock.getDelta() * 100) / 100
    );
    // octant = VoxelRenderer.renderOctree.leaves().next().value
    const octree = VoxelRenderer.renderOctree;
    const root = VoxelRenderer.renderOctree.findNodesByLevel(0)[0];
    VoxelRenderer.render(root as PointOctant<any>);
    // console.log(VoxelRenderer.renderOctree);
    console.log(
      "rendered %s voxels in %s",
      VoxelRenderer.renderOctree.countPoints(),
      Math.round(this.clock.getDelta() * 100) / 100
    );
    // }

    // meshesRef.current = getLevelMeshes(0);
    this.voxelsMeshes = getLevelMeshes(0);
    this.voxelsMeshes.forEach((mesh) => this.scene.add(mesh));
  }

  addLights() {
    const directional = new THREE.DirectionalLight(0xffffff, 2);
    directional.position.set(50, 50, 50);
    directional.target.position.set(0, 0, 0);
    directional.castShadow = true;
    directional.shadow.bias = -0.001;
    directional.shadow.mapSize.width = 4096;
    directional.shadow.mapSize.height = 4096;
    directional.shadow.camera.near = 0.1;
    directional.shadow.camera.far = 500.0;
    directional.shadow.camera.near = 0.5;
    directional.shadow.camera.far = 500.0;
    directional.shadow.camera.left = 50;
    directional.shadow.camera.right = -50;
    directional.shadow.camera.top = 50;
    directional.shadow.camera.bottom = -50;
    this.scene.add(directional);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    // call base super class
    super.update();

    let rot = this.controls.joyRight;
    let rotVect = new Vector2(rot.x, rot.y); // x horizontal rot, y: vertical rot

    rotVect.multiplyScalar(PLAYER_ROT_SPEED);
    rotVect.add(this.mem.rot);

    const camRot = new THREE.Euler(-rotVect.y, rotVect.x, 0);
    this.orbital.update(camRot);
    if (this.controls.joyRight.needReset) {
      // save previous value
      this.mem.rot.x = rotVect.x % (2 * Math.PI);
      this.mem.rot.y = rotVect.y % (2 * Math.PI);
      this.controls.joyRight.x = 0;
      this.controls.joyRight.y = 0;
      this.controls.joyRight.needReset = false;
      console.log("memorized rot:");
      console.log(this.mem.rot);
    }
    // this.controls.joyRight.x = 0

    // update all player instances
    Player.instances.forEach((player) => {
      const pos = this.controls.joyLeft;
      const playerMove = new THREE.Vector3(pos.x, 0, pos.y);
      playerMove.normalize().multiplyScalar(PLAYER_MAX_SPEED);
      // playerPosition.multiplyScalar(0.4);
      playerMove.applyEuler(this.orbital.rotation);
      player.update(this.delta, playerMove);
    });

    const mesh = this.voxelsMeshes[0];
    const intersects = this.raycaster.intersectObject(mesh);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const face = intersect.face;
      const attr = (intersect.object as Mesh).geometry.getAttribute("position");
      const [a, b, c] = [face.a, face.b, face.c].map(
        (v) => new Vector3(attr.getX(v), attr.getY(v), attr.getZ(v))
      );
      this.highlightTriangle.update(a, b, c);
    }
    this.scene.background = new THREE.Color(0xefd1b5);
    super.render();
  };
}
