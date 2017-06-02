Ext.define('Shopware.apps.SwagThreeSixty.view.detail.Viewer', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.swag-three-sixty-detail-viewer',
    title: '3D View',
    layout: 'fit',
    initialized: false,
    debugLayer: false,
    sceneObjects: {},
    shadowGeneratorRenderList: [],
    autoRotateCamera: false,
    autoRotateCameraSpeed: 0,
    renderMode: 'solid',
    shadowGenerators: [],

    initComponent: function() {
        var me = this;

        me.emptyView = Ext.create('Ext.container.Container', {
            html: '<div class="viewer--empty-message">Please add a camera to render the scene</div>'
        });

        me.items = [ me.emptyView ];
        me.tbar = me.createTopToolbar();

        me.sceneObjects = {};
        me.shadowGeneratorRenderList = [];
        me.shadowGenerators = [];
        me.initialized = false;

        me.on('data-changed', function(data) {
            if (me.initialized) {
                me.assetsManager.reset();
                me.updateSceneComponents(data);
                return;
            }

            Ext.each(Object.keys(data), function(id) {
                var item = data[id];

                if (item.config.type === 'ArcRotateCamera') {
                    // We have a camera, therefor we have a scene too
                    me.viewer = me.createViewerView();
                    me.scene = me.createSceneRenderer(data);

                    me.removeAll();
                    me.add(me.viewer);
                    me.initialized = true;
                }
            });
        });

        me.on('window-resize', function() {
            // Resize the engine when it's initialized
            if (!me.engine) {
                return;
            }
            me.engine.resize();
        });

        me.on('highlight-mesh', function(id) {
            Ext.each(Object.keys(me.sceneObjects), function(objectId) {
                var object = me.sceneObjects[objectId];
                object.outlineWidth = 0.1;
                object.renderOutline = (id === objectId);
            });
        });

        me.callParent();
    },

    createTopToolbar: function() {
        var me = this;

        me.viewMode = Ext.create('Ext.button.Split', {
            text: 'Rendering mode',
            iconCls: 'sprite-ui-panel-resize',
            handler: function(btn) {
                btn.menu.showBy(btn);
            },
            menu: new Ext.menu.Menu({
                items: [
                    // these will render as dropdown menu items when the arrow is clicked:
                    { text: 'Point view', iconCls: 'sprite-layer-select-point', handler: function() {
                        me.renderMode = 'points';
                    } },
                    { text: 'Wireframe view', iconCls: 'sprite-layer-shade', handler: function() {
                        me.renderMode = 'wireframe';
                    } },
                    { text: 'Solid view', iconCls: 'sprite-layer-mask', handler: function() {
                        me.renderMode = 'solid';
                    } }
                ]
            })
        });

        me.debugButton = Ext.create('Ext.button.Button', {
            text: 'Debug Mode',
            enableToggle: true,
            iconCls: 'sprite-bug',
            toggleHandler: function(button, state) {
                me.debugLayer = state;
            }
        });

        return Ext.create('Ext.toolbar.Toolbar', {
            items: [
                me.debugButton,
                me.viewMode
            ]
        });
    },

    createViewerView: function() {
        return Ext.create('Ext.container.Container', {
            html: '<canvas class="babylon-renderer"></canvas>'
        });
    },

    createSceneRenderer: function(data) {
        var me = this,
            el = me.viewer.getEl();

        // When the element isn't ready, we call our self with a slight delay
        if (!el) {
            Ext.defer(me.createSceneRenderer, 100, me, [ data ]);
            return;
        }

        me.canvas = el.dom.querySelector('.babylon-renderer');
        me.engine = new BABYLON.Engine(me.canvas, true);

        me.createScene(me.engine);
        me.assetsManager = new BABYLON.AssetsManager(me.scene);

        me.iterateObjects(data, me.scene, me.canvas);

        me.engine.displayLoadingUI();
        me.assetsManager.onFinish = function () {
            me.engine.runRenderLoop(Ext.bind(me.renderLoop, me));
            me.engine.resize();

            me.engine.hideLoadingUI();
        };

        me.assetsManager.load();

        window.addEventListener("resize", function () {
            me.engine.resize();
        });
    },

    renderLoop: function() {
        var me = this;

        if (me.debugLayer) {
            if (!me.scene.debugLayer.isVisible()) {
                me.scene.debugLayer.show();
            }
        } else {
            if (me.scene.debugLayer.isVisible()) {
                me.scene.debugLayer.hide();
            }
        }

        if (me.autoRotateCamera) {
            me.scene.activeCamera.alpha += me.autoRotateCameraSpeed;
        }

        if (me.renderMode === 'wireframe') {
            me.scene.forceWireframe = true;
            me.scene.forcePointsCloud = false;
        } else if (me.renderMode === 'points') {
            me.scene.forceWireframe = false;
            me.scene.forcePointsCloud = true;
        } else {
            me.scene.forceWireframe = false;
            me.scene.forcePointsCloud = false;
        }

        me.scene.render();
    },

    createScene: function(engine) {
        var me = this;

        me.scene = new BABYLON.Scene(engine);

        return me.scene;
    },

    iterateObjects: function(data, scene, canvas) {
        var me = this;

        Ext.each(Object.keys(data), function (key) {
            var item = data[key],
                id = window.parseInt(item.id),
                config = item.config;

            if (config.type === 'Scene') {
                me.sceneObjects[id] = me.configureScene(scene, config, canvas);
                me.sceneObjects[id]['__type'] = 'scene';
            }

            if (config.type === 'ArcRotateCamera') {
                me.sceneObjects[id] = me.createCamera(scene, config, canvas);
                me.sceneObjects[id]['__type'] = 'camera';
            }

            if (config.type === 'DirectionalLight') {
                me.sceneObjects[id] = me.createDirectionalLight(id, scene, config, canvas);
                me.sceneObjects[id]['__type'] = 'light';
            }

            if (config.type === 'PointLight') {
                me.sceneObjects[id] = me.createPointLight(id, scene, config, canvas);
                me.sceneObjects[id]['__type'] = 'light';
            }

            if (config.type === 'SpotLight') {
                me.sceneObjects[id] = me.createSpotLight(id, scene, config, canvas);
                me.sceneObjects[id]['__type'] = 'light';
            }

            if (config.type === 'HemisphericLight') {
                me.sceneObjects[id] = me.createHemisphericLight(id, scene, config, canvas);
                me.sceneObjects[id]['__type'] = 'hemilight';
            }

            if (config.type === 'Box') {
                me.sceneObjects[id] = me.createBox(id, scene, config, canvas);
                me.sceneObjects[id]['__type'] = 'mesh';
            }

            if (config.type === 'Cylinder') {
                me.sceneObjects[id] = me.createCylinder(id, scene, config, canvas);
                me.sceneObjects[id]['__type'] = 'mesh';
            }

            if (config.type === 'Ground') {
                me.sceneObjects[id] = me.createGround(id, scene, config, canvas);
                me.sceneObjects[id]['__type'] = 'mesh';
            }

            if (config.type === 'Model') {
                me.sceneObjects[id] = me.createModel(id, scene, config, canvas);
                me.sceneObjects[id]['__type'] = 'model';
            }

            me.sceneObjects[id]['__config'] = config;
        });

        // Now loop over the scene objects again and generate the shadow generator
        Ext.each(Object.keys(me.sceneObjects), function(id) {
            var item = me.sceneObjects[id],
                config = item['__config'];

            if (item.__type === 'light') {
                if (config.shadowGenerator) {
                    var shadowGenerator = new BABYLON.ShadowGenerator(1024, item);
                    shadowGenerator.getShadowMap().renderList = me.shadowGeneratorRenderList;
                    shadowGenerator.usePoissonSampling = true;
                    shadowGenerator.bias = 0.01;
                    me.shadowGenerators.push(shadowGenerator);
                    item.__shadowGenerator = shadowGenerator;
                } else {
                    if (item.hasOwnProperty('__shadowGenerator')) {
                        var idx = me.shadowGenerators.indexOf(item.__shadowGenerator);
                        item.__shadowGenerator.dispose();

                        me.shadowGenerators.splice(idx, 1);
                    }
                }
            }
        });
    },

    configureScene: function(scene, config) {
        var me = this;

        if (config.label) {
            scene.name = config.label;
        }

        if (config.backdrop.length) {
            me.backdrop = new BABYLON.Layer(
                config.label + '_backdrop',
                config.backdrop,
                scene,
                true
            );
        }

        if (config.backgroundColor.length) {
            var backgroundColor = new Ext.draw.Color().fromString(config.backgroundColor);
            scene.clearColor = new BABYLON.Color3(backgroundColor.r / 255, backgroundColor.g / 255, backgroundColor.b / 255);
        }

        if (config.ambientColor) {
            var ambientColor = new Ext.draw.Color().fromString(config.ambientColor);
            scene.clearColor = new BABYLON.Color3(ambientColor.r / 255, ambientColor.g / 255, ambientColor.b / 255);
        }

        if (config.fogMode !== BABYLON.Scene.FOGMODE_NONE) {
            scene.fogMode = config.fogMode;

            if (config.fogColor.length) {
                var fogColor = new Ext.draw.Color().fromString(config.fogColor);
                scene.fogColor = new BABYLON.Color3(fogColor.r / 255, fogColor.g / 255, fogColor.b / 255);
            }
        } else {
            scene.fogMode = BABYLON.Scene.FOGMODE_NONE;
        }

        if (config.fogMode === BABYLON.Scene.FOGMODE_EXP || config.fogMode === BABYLON.Scene.FOGMODE_EXP2) {
            scene.fogDensity = config.fogDensity;
        } else if (config.fogMode === BABYLON.Scene.FOGMODE_LINEAR) {
            scene.fogStart = config.fogStart;
            scene.fogEnd = config.fogEnd;
        }

        return scene;
    },

    createCamera: function(scene, config, canvas) {
        var me = this;

        if (!me.camera) {
            me.camera = new BABYLON[config.type](
                config.label,
                0, 0, 0,
                new BABYLON.Vector3(0, 0, 0),
                scene
            );

            me.camera.attachControl(canvas, false);
        }

        me.camera.panningSensibility = config.panningSensibility;
        me.camera.lowerRadiusLimit = config.lowerRadiusLimit;
        me.camera.upperRadiusLimit = config.upperRadiusLimit;

        me.camera.lowerBetaLimit = config.lowerBetaLimit;
        me.camera.upperBetaLimit = config.upperBetaLimit;

        if (config.antiAliasing !== 'none') {
            if (config.antiAliasing === 'fsaa') {
                var fx = new BABYLON.PassPostProcess("fsaa", 2.0, me.camera);
                fx.renderTargetSamplingMode = BABYLON.Texture.BILINEAR_SAMPLINGMODE;
                me.camera.__fsaa_cookie = fx;
            } else if(config.antiAliasing === 'fxaa') {
                me.camera.__fxaa_cookie = new BABYLON.FxaaPostProcess("fxaa", 1.0, me.camera);
            }
        } else {
            if (me.camera.__fsaa_cookie) {
                me.camera.__fsaa_cookie.dispose();
                me.camera.__fsaa_cookie = null;
            }

            if(me.camera.__fxaa_cookie) {
                me.camera.__fxaa_cookie.dispose();
                me.camera.__fxaa_cookie = null;
            }
        }

        me.camera.setPosition(new BABYLON.Vector3(config.positionX, config.positionY, config.positionZ));

        me.autoRotateCamera = config.autoRotate;
        me.autoRotateCameraSpeed = config.rotateSpeed;

        return me.camera;
    },

    createDirectionalLight: function(id, scene, config) {
        var me = this,
            object;

        if (!me.sceneObjects.hasOwnProperty(id)) {
            object = new BABYLON[config.type](
                config.label + '_' + id,
                new BABYLON.Vector3(config.directionX, config.directionY, config.directionZ),
                scene
            );
        }  else {
            object = me.sceneObjects[id];
        }

        object.intensity = config.intensity / 100;

        object.direction.x = config.directionX;
        object.direction.y = config.directionY;
        object.direction.z = config.directionZ;

        object.position.x = config.positionX;
        object.position.y = config.positionY;
        object.position.z = config.positionZ;

        if (config.diffuseColor) {
            var diffuseColor = new Ext.draw.Color().fromString(config.diffuseColor);
            object.diffuse = new BABYLON.Color3(diffuseColor.r / 255, diffuseColor.g / 255, diffuseColor.b / 255);
        }

        if (config.specularColor) {
            var specularColor = new Ext.draw.Color().fromString(config.specularColor);
            object.specular = new BABYLON.Color3(specularColor.r / 255, specularColor.g / 255, specularColor.b / 255);
        }

        return object;
    },

    createPointLight: function(id, scene, config) {
        var me = this,
            object;

        if (!me.sceneObjects.hasOwnProperty(id)) {
            object = new BABYLON[config.type](
                config.label + '_' + id,
                new BABYLON.Vector3(0, 0, 0),
                scene
            );
        }  else {
            object = me.sceneObjects[id];
        }

        object.position.x = config.positionX;
        object.position.y = config.positionY;
        object.position.z = config.positionZ;

        if (config.diffuseColor) {
            var diffuseColor = new Ext.draw.Color().fromString(config.diffuseColor);
            object.diffuse = new BABYLON.Color3(diffuseColor.r / 255, diffuseColor.g / 255, diffuseColor.b / 255);
        }

        if (config.specularColor) {
            var specularColor = new Ext.draw.Color().fromString(config.specularColor);
            object.specular = new BABYLON.Color3(specularColor.r / 255, specularColor.g / 255, specularColor.b / 255);
        }

        return object;
    },

    createSpotLight: function(id, scene, config) {
        var me = this,
            object;

        if (!me.sceneObjects.hasOwnProperty(id)) {
            object = new BABYLON[config.type](
                config.label + '_' + id,
                new BABYLON.Vector3(0, 0, 0),
                new BABYLON.Vector3(0, 0, 0),
                config.angle,
                config.exponent,
                scene
            );
        }  else {
            object = me.sceneObjects[id];
        }

        object.angle = config.angle;
        object.exponent = config.exponent;

        object.position.x = config.positionX;
        object.position.y = config.positionY;
        object.position.z = config.positionZ;

        object.direction.x = config.directionX;
        object.direction.y = config.directionY;
        object.direction.z = config.directionZ;

        if (config.diffuseColor) {
            var diffuseColor = new Ext.draw.Color().fromString(config.diffuseColor);
            object.diffuse = new BABYLON.Color3(diffuseColor.r / 255, diffuseColor.g / 255, diffuseColor.b / 255);
        }

        if (config.specularColor) {
            var specularColor = new Ext.draw.Color().fromString(config.specularColor);
            object.specular = new BABYLON.Color3(specularColor.r / 255, specularColor.g / 255, specularColor.b / 255);
        }

        return object;
    },

    createHemisphericLight: function(id, scene, config) {
        var me = this,
            object;

        if (!me.sceneObjects.hasOwnProperty(id)) {
            object = new BABYLON.HemisphericLight(
                config.label + '_' + id,
                new BABYLON.Vector3(0, 1, 0),
                scene
            );
        } else {
            object = me.sceneObjects[id];
        }

        object.intensity = config.intensity / 100;

        if (config.diffuseColor) {
            var diffuseColor = new Ext.draw.Color().fromString(config.diffuseColor);
            object.diffuse = new BABYLON.Color3(diffuseColor.r / 255, diffuseColor.g / 255, diffuseColor.b / 255);
        }

        if (config.specularColor) {
            var specularColor = new Ext.draw.Color().fromString(config.specularColor);
            object.specular = new BABYLON.Color3(specularColor.r / 255, specularColor.g / 255, specularColor.b / 255);
        }

        if (config.groundColor) {
            var groundColor = new Ext.draw.Color().fromString(config.groundColor);
            object.groundColor = new BABYLON.Color3(groundColor.r / 255, groundColor.g / 255, groundColor.b / 255);
        }

        return object;
    },

    createBox: function(id, scene, config) {
        var me = this,
            object,
            material;

        if (!me.sceneObjects.hasOwnProperty(id)) {
            object = BABYLON.Mesh.CreateBox(
                config.label + '_' + id,
                config.size,
                scene,
                true,
                BABYLON.Mesh.DEFAULTSIDE
            );
            material = new BABYLON.StandardMaterial(config.label + '_texture', scene);
            me.shadowGeneratorRenderList.push(object);
        } else {
            object = me.sceneObjects[id];
            material = object.material;
        }

        material = me.setMaterialProperties(material, config, scene);
        object = me.setPosition(object, config);
        object = me.setRotation(object, config);

        material.wireframe = config.wireframe;

        object.scaling.x = object.scaling.y = object.scaling.z = config.size;

        object.material = material;
        object.receiveShadows = true;

        return object;
    },

    createGround: function(id, scene, config) {
        var me = this,
            object,
            material;

        if (!me.sceneObjects.hasOwnProperty(id)) {
            object = BABYLON.Mesh.CreateGround(
                config.label + '_' + id,
                config.width,
                config.height,
                config.subdivs,
                scene,
                true
            );
            material = new BABYLON.StandardMaterial(config.label + '_texture', scene);
        } else {
            object = me.sceneObjects[id];
            material = object.material;
        }

        material = me.setMaterialProperties(material, config, scene);
        object = me.setPosition(object, config);
        object = me.setRotation(object, config);

        object.visibility = config.visibility / 100;
        material.wireframe = config.wireframe;

        object.width = config.width;
        object.height = config.height;

        object.material = material;
        object.receiveShadows = true;

        return object;
    },

    createModel: function(id, scene, config) {
        var me = this,
            object;

        if (!config.model) {
            return {};
        }

        if (!me.sceneObjects.hasOwnProperty(id) || !me.sceneObjects[id].position) {
            var path = config.model.match(/^(http[s]?:\/?\/)?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)/i),
                fileName = path.pop();

            var meshTask = me.assetsManager.addMeshTask(config.label + '_' + id, '', config.model.replace(fileName, ''), fileName);

            meshTask.onSuccess = function(task) {
                var meshes = task.loadedMeshes,
                    mesh = meshes[0];

                Ext.each(task.loadedMeshes, function(item) {
                    me.shadowGeneratorRenderList.push(item);
                });

                mesh = me.setPosition(mesh, config);
                mesh = me.setRotation(mesh, config);
                mesh.scaling.x = config.scalingX;
                mesh.scaling.y = config.scalingY;
                mesh.scaling.z = config.scalingZ;

                me.sceneObjects[id] = mesh;
            }
        } else {
            object = me.sceneObjects[id];

            if (!object.position || !object.scaling) {
                return object || {};
            }
            object = me.setPosition(object, config);
            object = me.setRotation(object, config);

            object.scaling.x = config.scalingX;
            object.scaling.y = config.scalingY;
            object.scaling.z = config.scalingZ;
        }

        return object || {};
    },

    createCylinder: function(id, scene, config) {
        var me = this,
            object,
            material;

        if (!me.sceneObjects.hasOwnProperty(id)) {
            object = BABYLON.MeshBuilder.CreateCylinder(
                config.label + '_' + id,
                {
                    height: config.height,
                    diameterTop: config.diamTop,
                    diameterBottom: config.diamBottom,
                    tessellation: config.tessellation,
                    subdivisions: config.heightSubdivs,
                    updatable: true
                },
                scene
            );

            material = new BABYLON.StandardMaterial(config.label + '_texture', scene);
            me.shadowGeneratorRenderList.push(object);
        } else {
            object = me.sceneObjects[id];
            material = object.material;
        }

        material = me.setMaterialProperties(material, config, scene);
        object = me.setPosition(object, config);
        object = me.setRotation(object, config);

        material.wireframe = config.wireframe;

        /** Object isn't updating on data change */
        object.height = config.height;
        object.diameterTop = config.diamTop;
        object.diameterBottom = config.diamBottom;
        object.tessellation = config.tessellation;
        object.subdivisions = config.heightSubdivs;

        object.material = material;
        object.receiveShadows = true;

        return object;
    },

    updateSceneComponents: function(data) {
        var me = this,
            ids = [];

        me.iterateObjects(data, me.scene, me.canvas);

        ids = Ext.Array.map(Object.keys(data), function(key) {
            var item = data[key];
            return window.parseInt(item.id);
        });

        // Delete removed objects
        Ext.each(Object.keys(me.sceneObjects), function(id) {
            id = window.parseInt(id);
            if (ids.indexOf(id) === -1) {
                me.sceneObjects[id].dispose();
            }
        });
    },

    setPosition: function(object, config) {
        object.position.x = config.positionX;
        object.position.y = config.positionY;
        object.position.z = config.positionZ;

        return object;
    },

    setRotation: function(object, config) {
        if (config.rotationX > 0) {
            object.rotation.x = config.rotationX * Math.PI / 180;
        } else {
            object.rotation.x = 0;
        }

        if (config.rotationY > 0) {
            object.rotation.y = config.rotationY * Math.PI / 180;
        } else {
            object.rotation.y = 0;
        }

        if (config.rotationZ > 0) {
            object.rotation.z = config.rotationZ * Math.PI / 180;
        } else {
            object.rotation.z = 0;
        }

        return object;
    },

    setMaterialProperties: function(material, config, scene) {
        var me = this;

        if (config.diffuseColor) {
            var diffuseColor = new Ext.draw.Color().fromString(config.diffuseColor);
            material.diffuseColor = new BABYLON.Color3(diffuseColor.r / 255, diffuseColor.g / 255, diffuseColor.b / 255);
        } else {
            material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        }

        if (config.diffuseTexture) {
            var diffuseTextureTask = me.assetsManager.addTextureTask(config.id + '_diffuse_texture', config.diffuseTexture);
            diffuseTextureTask.onSuccess = function(task) {
                material.diffuseTexture = task.texture;
                material.diffuseTexture.uOffset = config.diffuseTextureUOffset;
                material.diffuseTexture.vOffset = config.diffuseTextureVOffset;

                material.diffuseTexture.uScale = config.diffuseTextureUScale;
                material.diffuseTexture.vScale = config.diffuseTextureVScale;
            };
        } else {
            material.diffuseTexture = null;
        }

        if (config.emissiveColor) {
            var emissiveColor = new Ext.draw.Color().fromString(config.emissiveColor);
            material.emissiveColor = new BABYLON.Color3(emissiveColor.r / 255, emissiveColor.g / 255, emissiveColor.b / 255);
        } else {
            material.emissiveColor = new BABYLON.Color3(0, 0, 0);
        }

        if (config.emissiveTexture) {
            var emissiveTextureTask = me.assetsManager.addTextureTask(config.id + '_emissive_texture', config.emissiveTexture);
            emissiveTextureTask.onSuccess = function(task) {
                material.emissiveTexture = task.texture;

                material.emissiveTexture.uOffset = config.emissiveTextureUOffset;
                material.emissiveTexture.vOffset = config.emissiveTextureVOffset;

                material.emissiveTexture.uScale = config.emissiveTextureUScale;
                material.emissiveTexture.vScale = config.emissiveTextureVScale;
            };

        } else {
            material.emissiveTexture = null;
        }

        if (config.ambientColor) {
            var ambientColor = new Ext.draw.Color().fromString(config.ambientColor);
            material.ambientColor = new BABYLON.Color3(ambientColor.r / 255, ambientColor.g / 255, ambientColor.b / 255);
        } else {
            material.ambientColor = new BABYLON.Color3(0, 0, 0);
        }

        if (config.ambientTexture) {
            var ambientTextureTask = me.assetsManager.addTextureTask(config.id + '_ambient_texture', config.ambientTexture);
            ambientTextureTask.onSuccess = function(task) {
                material.ambientTexture = task.texture;

                material.ambientTexture.uOffset = config.ambientTextureUOffset;
                material.ambientTexture.vOffset = config.ambientTextureVOffset;

                material.ambientTexture.uScale = config.ambientTextureUScale;
                material.ambientTexture.vScale = config.ambientTextureVScale;
            };
        } else {
            material.ambientTexture = null;
        }

        if (config.specularColor) {
            var specularColor = new Ext.draw.Color().fromString(config.specularColor);
            material.specularColor = new BABYLON.Color3(specularColor.r / 255, specularColor.g / 255, specularColor.b / 255);
        } else {
            material.specularColor = new BABYLON.Color3(1, 1, 1);
        }

        if (config.specularTexture) {
            var specularTextureTask = me.assetsManager.addTextureTask(config.id + '_specular_texture', config.specularTexture);
            specularTextureTask.onSuccess = function(task) {
                material.specularTexture = task.texture;

                material.specularTexture.uOffset = config.ambientTextureUOffset;
                material.specularTexture.vOffset = config.ambientTextureVOffset;

                material.specularTexture.uScale = config.ambientTextureUScale;
                material.specularTexture.vScale = config.ambientTextureVScale;
            };
        } else {
            material.specularTexture = null;
        }

        if (config.specularColor || config.specularTexture) {
            material.specularPower = config.specularPower;
        }

        if (config.bumpTexture) {
            var bumpTextureTask = me.assetsManager.addTextureTask(config.id + '_bump_texture', config.bumpTexture);
            bumpTextureTask.onSuccess = function(task) {
                material.bumpTexture = task.texture;

                material.bumpTexture.uOffset = config.bumpTextureUOffset;
                material.bumpTexture.vOffset = config.bumpTextureVOffset;

                material.bumpTexture.uScale = config.bumpTextureUScale;
                material.bumpTexture.vScale = config.bumpTextureVScale;
            };
        } else {
            material.bumpTexture = null;
        }

        return material;
    }
});