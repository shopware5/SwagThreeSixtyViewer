;(function($, BABYLON, document, window, undefined) {
    'use strict';

    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    $.plugin('swagThreeSixtyViewer', {
        defaults: {
            dataSelector: '.babylon-renderer--data',
            canvasSelector: '.babylon-renderer',
            fullscreenSelector: '.actions--item'
        },

        sceneObjects: {},
        shadowGenerators: [],
        shadowGeneratorRenderList: [],
        autoRotateCamera: false,
        autoRotateCameraSpeed: 0,
        renderMode: 'solid',
        isFullscreen: false,

        init: function() {
            var me = this;

            me.applyDataAttributes();
            me.$canvas = me.$el.find(me.opts.canvasSelector);
            me.$data = me.$el.find(me.opts.dataSelector);
            
            me.data = $.parseJSON(me.$data.html());
            me.canvasEl = me.$canvas.get(0);

            me._on(me.$el.find(me.opts.fullscreenSelector), 'click', $.proxy(me.switchFullscreen, me));

            me._on($(document), 'fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange', function() {
                me.switchFullscreen();
                me.isFullscreen = !me.isFullscreen;
            });
            
            me.createSceneRenderer(me.canvasEl, me.data);
        },

        switchFullscreen: function(event) {
            var me = this;

            if (event) {
                event.preventDefault();
            }

            if (!me.isFullscreen) {
                BABYLON.Tools.RequestFullscreen(me.$el.get(0));
                me.$el.addClass('js--is-fullscreen');
                me.engine.resize();
                return;
            }

            BABYLON.Tools.ExitFullscreen();
            me.$el.removeClass('js--is-fullscreen');
        },

        createSceneRenderer: function(el, data) {
            var me = this;

            me.canvas = el;
            me.engine = new BABYLON.Engine(me.canvas, true);

            me.createScene(me.engine);
            me.iterateObjects(data, me.scene, me.canvas);

            me.assetsManager.onFinish = function(tasks) {
                me.engine.runRenderLoop($.proxy(me.renderLoop, me));
            };
            me.assetsManager.load();

            me._on($(window), 'resize', function () {
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
            me.assetsManager = new BABYLON.AssetsManager(me.scene);

            return me.scene;
        },

        iterateObjects: function(data, scene, canvas) {
            var me = this;

            $.each(Object.keys(data), function (idx, key) {
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
            $.each(Object.keys(me.sceneObjects), function(idx, id) {
                var item = me.sceneObjects[id],
                    config = item['__config'];

                if (item.__type === 'light') {
                    if (config.shadowGenerator) {
                        var shadowGenerator = new BABYLON.ShadowGenerator(1024, item);

                        shadowGenerator.getShadowMap().renderList = me.shadowGeneratorRenderList;
                        shadowGenerator.usePoissonSampling = true;
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

            if (config.backgroundColor) {
                var backgroundColor = hexToRgb(config.backgroundColor);
                scene.clearColor = new BABYLON.Color3(backgroundColor.r / 255, backgroundColor.g / 255, backgroundColor.b / 255);
            }

            if (config.ambientColor) {
                var ambientColor = hexToRgb(config.ambientColor);
                scene.clearColor = new BABYLON.Color3(ambientColor.r / 255, ambientColor.g / 255, ambientColor.b / 255);
            }

            if (config.fogMode !== BABYLON.Scene.FOGMODE_NONE) {
                scene.fogMode = config.fogMode;

                if (config.fogColor.length) {
                    var fogColor = hexToRgb(config.fogColor);
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
                var diffuseColor = hexToRgb(config.diffuseColor);
                object.diffuse = new BABYLON.Color3(diffuseColor.r / 255, diffuseColor.g / 255, diffuseColor.b / 255);
            }

            if (config.specularColor) {
                var specularColor = hexToRgb(config.specularColor);
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
                var diffuseColor = hexToRgb(config.diffuseColor);
                object.diffuse = new BABYLON.Color3(diffuseColor.r / 255, diffuseColor.g / 255, diffuseColor.b / 255);
            }

            if (config.specularColor) {
                var specularColor = hexToRgb(config.specularColor);
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
                var diffuseColor = hexToRgb(config.diffuseColor);
                object.diffuse = new BABYLON.Color3(diffuseColor.r / 255, diffuseColor.g / 255, diffuseColor.b / 255);
            }

            if (config.specularColor) {
                var specularColor = hexToRgb(config.specularColor);
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
                var diffuseColor = hexToRgb(config.diffuseColor);
                object.diffuse = new BABYLON.Color3(diffuseColor.r / 255, diffuseColor.g / 255, diffuseColor.b / 255);
            }

            if (config.specularColor) {
                var specularColor = hexToRgb(config.specularColor);
                object.specular = new BABYLON.Color3(specularColor.r / 255, specularColor.g / 255, specularColor.b / 255);
            }

            if (config.groundColor) {
                var groundColor = hexToRgb(config.groundColor);
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

            if (!me.sceneObjects.hasOwnProperty(id)) {
                var path = config.model.match(/^(http[s]?:\/?\/)?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)/i),
                    fileName = path.pop();

                BABYLON.SceneLoader.ImportMesh('', config.model.replace(fileName, ''), fileName, scene, function(meshes) {
                    var mesh = meshes[0];

                    mesh = me.setPosition(mesh, config);
                    mesh = me.setRotation(mesh, config);
                    mesh.scaling.x = config.scalingX;
                    mesh.scaling.y = config.scalingY;
                    mesh.scaling.z = config.scalingZ;

                    $.each(meshes, function(idx, item) {
                        me.shadowGeneratorRenderList.push(item);
                    });
                    me.sceneObjects[id] = mesh;

                });
            } else {
                object = me.sceneObjects[id];
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

            ids = $.map(Object.keys(data), function(key) {
                var item = data[key];
                return window.parseInt(item.id);
            });

            // Delete removed objects
            $.each(Object.keys(me.sceneObjects), function(i, id) {
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
            if (config.diffuseColor) {
                var diffuseColor = hexToRgb(config.diffuseColor);
                material.diffuseColor = new BABYLON.Color3(diffuseColor.r / 255, diffuseColor.g / 255, diffuseColor.b / 255);
            } else {
                material.diffuseColor = new BABYLON.Color3(1, 1, 1);
            }

            if (config.diffuseTexture) {
                material.diffuseTexture = new BABYLON.Texture(config.diffuseTexture, scene);
                material.diffuseTexture.uOffset = config.diffuseTextureUOffset;
                material.diffuseTexture.vOffset = config.diffuseTextureVOffset;

                material.diffuseTexture.uScale = config.diffuseTextureUScale;
                material.diffuseTexture.vScale = config.diffuseTextureVScale;
            } else {
                material.diffuseTexture = null;
            }

            if (config.emissiveColor) {
                var emissiveColor = hexToRgb(config.emissiveColor);
                material.emissiveColor = new BABYLON.Color3(emissiveColor.r / 255, emissiveColor.g / 255, emissiveColor.b / 255);
            } else {
                material.emissiveColor = new BABYLON.Color3(0, 0, 0);
            }

            if (config.emissiveTexture) {
                material.emissiveTexture = new BABYLON.Texture(config.emissiveTexture, scene);

                material.emissiveTexture.uOffset = config.emissiveTextureUOffset;
                material.emissiveTexture.vOffset = config.emissiveTextureVOffset;

                material.emissiveTexture.uScale = config.emissiveTextureUScale;
                material.emissiveTexture.vScale = config.emissiveTextureVScale;
            } else {
                material.emissiveTexture = null;
            }

            if (config.ambientColor) {
                var ambientColor = hexToRgb(config.ambientColor);
                material.ambientColor = new BABYLON.Color3(ambientColor.r / 255, ambientColor.g / 255, ambientColor.b / 255);
            } else {
                material.ambientColor = new BABYLON.Color3(0, 0, 0);
            }

            if (config.ambientTexture) {
                material.ambientTexture = new BABYLON.Texture(config.ambientTexture, scene);

                material.ambientTexture.uOffset = config.ambientTextureUOffset;
                material.ambientTexture.vOffset = config.ambientTextureVOffset;

                material.ambientTexture.uScale = config.ambientTextureUScale;
                material.ambientTexture.vScale = config.ambientTextureVScale;
            } else {
                material.ambientTexture = null;
            }

            if (config.specularColor) {
                var specularColor = hexToRgb(config.specularColor);
                material.specularColor = new BABYLON.Color3(specularColor.r / 255, specularColor.g / 255, specularColor.b / 255);
            } else {
                material.specularColor = new BABYLON.Color3(1, 1, 1);
            }

            if (config.specularTexture) {
                material.specularTexture = new BABYLON.Texture(config.specularTexture, scene);

                material.specularTexture.uOffset = config.specularTextureUOffset;
                material.specularTexture.vOffset = config.specularTextureVOffset;

                material.specularTexture.uScale = config.specularTextureUScale;
                material.specularTexture.vScale = config.specularTextureVScale;
            } else {
                material.specularTexture = null;
            }

            if (config.specularColor || config.specularTexture) {
                material.specularPower = config.specularPower;
            }

            if (config.bumpTexture) {
                material.bumpTexture = new BABYLON.Texture(config.bumpTexture, scene);

                material.bumpTexture.uOffset = config.bumpTextureUOffset;
                material.bumpTexture.vOffset = config.bumpTextureVOffset;

                material.bumpTexture.uScale = config.bumpTextureUScale;
                material.bumpTexture.vScale = config.bumpTextureVScale;
            } else {
                material.bumpTexture = null;
            }

            return material;
        }
    });

    $(function() {
        StateManager.addPlugin('*[data-swag-three-sixty-viewer="true"]', 'swagThreeSixtyViewer');
    });
})(jQuery, BABYLON, document, window);