Ext.define('Shopware.apps.SwagThreeSixty.controller.Detail', {
    extend: 'Enlight.app.Controller',

    refs: [
        { ref: 'detailWindow', selector: 'swag-three-sixty-detail-window' },
        { ref: 'hierarchy', selector: 'swag-three-sixty-detail-hierarchy' },
        { ref: 'inspector', selector: 'swag-three-sixty-detail-inspector' },
        { ref: 'viewer', selector: 'swag-three-sixty-detail-viewer' }
    ],

    init: function() {
        var me = this;

        me.control({
            'swag-three-sixty-detail-window': {
                'resize': me.onResizeWindow,
                'beforeclose': me.onBeforeClose
            },
            'swag-three-sixty-detail-hierarchy': {
                'add-item': me.onAddItem,
                'delete-item': me.onDeleteItem
            },
            'swag-three-sixty-detail-hierarchy treepanel': {
                'itemclick': me.onItemClick,
                'selectionchange': me.onSelectionChange
            },
            'swag-three-sixty-detail-inspector button[type=save]': {
                'click': me.onSaveItem
            }
        });

        me.callParent(arguments);
    },

    onBeforeClose: function() {
        var me = this,
            viewer = me.getViewer();

        if (!viewer.engine) {
            return;
        }

        viewer.initialized = false;
        viewer.engine.dispose();
    },

    onResizeWindow: function() {
        var me = this;

        me.getViewer().fireEvent('window-resize');
    },

    onSelectionChange: function(panel, selection) {
        var me = this,
            view = me.getHierarchy(),
            config;

        if (!selection) {
            return;
        }
        selection = selection[0];
        config = selection.get('config');

        if (config.type === 'Scene') {
            view.deleteBtn.setDisabled(true);
            return;
        }

        view.deleteBtn.setDisabled(false);
    },

    onAddItem: function(type) {
        var me = this,
            view = me.getHierarchy(),
            viewer = me.getViewer(),
            parentRecord = view.record,
            record;

        switch(type) {
            case 'directional-light': {
                record = me.getDirectionalLight();
                break;
            }
            case 'point-light': {
                record = me.getPointLight();
                break;
            }
            case 'spot-light': {
                record = me.getSpotLight();
                break;
            }
            case 'hemispheric-light': {
                record = me.getHemisphericLight();
                break;
            }
            case 'camera': {
                record = me.getArcRotateCamera();
                break;
            }
            case 'box': {
                record = me.getBox();
                break;
            }
            case 'cylinder': {
                record = me.getCylinder();
                break;
            }
            case 'ground': {
                record = me.getGround();
                break;
            }
            case 'model': {
                record = me.getModel();
                break;
            }
        }
        record.set('scene_id', parentRecord.get('id'));
        record.save({
            callback: function() {
                me.getHierarchy().tree.getStore().load();
            }
        });
    },

    onDeleteItem: function() {
        var me = this,
            view = me.getHierarchy(),
            inspector = me.getInspector(),
            layout = inspector.getLayout(),
            selection = view.tree.getSelectionModel().getSelection()[0];

        layout.setActiveItem(0);
        selection.destroy({
            callback: function() {
                view.tree.getStore().load();
            }
        });
    },

    getDirectionalLight: function() {
        var record = Ext.create('Shopware.apps.SwagThreeSixty.model.SceneObject', {
            label: 'Directional Light',
            config: {
                type: 'DirectionalLight',
                label: 'Directional Light',
                iconCls: 'sprite-light-bulb',
                intensity: 100,
                directionX: 0,
                directionY: 0,
                directionZ: 0,
                positionX: 0,
                positionY: 0,
                positionZ: 0,
                diffuseColor: '#ffffff',
                specularColor: '#ffffff',
                shadowGenerator: true
            }
        });

        return record;
    },

    getPointLight: function() {
        var record = Ext.create('Shopware.apps.SwagThreeSixty.model.SceneObject', {
            label: 'Point Light',
            config: {
                type: 'PointLight',
                label: 'Point Light',
                iconCls: 'sprite-light-bulb',
                intensity: 100,
                positionX: 0,
                positionY: 0,
                positionZ: 0,
                diffuseColor: '#ffffff',
                specularColor: '#ffffff',
                shadowGenerator: true,
                range: 10
            }
        });

        return record;
    },

    getSpotLight: function() {
        var record = Ext.create('Shopware.apps.SwagThreeSixty.model.SceneObject', {
            label: 'Spot Light',
            config: {
                type: 'SpotLight',
                label: 'Spot Light',
                iconCls: 'sprite-flashlight',
                intensity: 100,
                angle: 90,
                exponent: 1,
                positionX: 0,
                positionY: 0,
                positionZ: 0,
                directionX: 0,
                directionY: 0,
                directionZ: 0,
                diffuseColor: '#ffffff',
                specularColor: '#ffffff',
                shadowGenerator: true,
                range: 10
            }
        });

        return record;
    },

    getHemisphericLight: function() {
        var record = Ext.create('Shopware.apps.SwagThreeSixty.model.SceneObject', {
            label: 'Hemispheric Light',
            config: {
                type: 'HemisphericLight',
                label: 'Hemispheric Light',
                iconCls: 'sprite-flashlight',
                diffuseColor: '#ffffff',
                specularColor: '#ffffff',
                groundColor: '#000000',
                intensity: 100
            }
        });

        return record;
    },

    getArcRotateCamera: function() {
        var record = Ext.create('Shopware.apps.SwagThreeSixty.model.SceneObject');

        record.set('label', 'Arc Rotate Camera');
        record.set('config', {
            type: 'ArcRotateCamera',
            iconCls: 'sprite-camera-black',
            label: 'Arc Rotate Camera',
            antiAliasing: 'none',
            autoRotate: false,
            rotateSpeed: 0.005,
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            panningSensibility: 1,
            lowerRadiusLimit: 1,
            upperRadiusLimit: 20,
            lowerBetaLimit: 0,
            upperBetaLimit: 90
        });
        return record;
    },

    getBox: function() {
        var record = Ext.create('Shopware.apps.SwagThreeSixty.model.SceneObject', {
            label: 'Box',
            config: {
                type: 'Box',
                label: 'Box',
                iconCls: 'sprite-layer',
                size: 1,
                wireframe: false,
                diffuseColor: '',
                diffuseTexture: '',
                diffuseTextureUOffset: 0,
                diffuseTextureVOffset: 0,
                diffuseTextureUScale: 1,
                diffuseTextureVScale: 1,
                emissiveColor: '',
                emissiveTexture: '',
                emissiveTextureUOffset: 0,
                emissiveTextureVOffset: 0,
                emissiveTextureUScale: 1,
                emissiveTextureVScale: 1,
                ambientColor: '',
                ambientTexture: '',
                ambientTextureUOffset: 0,
                ambientTextureVOffset: 0,
                ambientTextureUScale: 1,
                ambientTextureVScale: 1,
                specularColor: '',
                specularTexture: '',
                specularTextureUOffset: 0,
                specularTextureVOffset: 0,
                specularTextureUScale: 1,
                specularTextureVScale: 1,
                bumpTexture: '',
                bumpTextureUOffset: 0,
                bumpTextureVOffset: 0,
                bumpTextureUScale: 1,
                bumpTextureVScale: 1,
                specularPower: 100,
                positionX: 0,
                positionY: 0,
                positionZ: 0,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                wireframe: false
            }
        });

        return record;
    },

    getCylinder: function() {
        var record = Ext.create('Shopware.apps.SwagThreeSixty.model.SceneObject', {
            label: 'Cylinder',
            config: {
                type: 'Cylinder',
                label: 'Cylinder',
                iconCls: 'sprite-layer',
                height: 2,
                diamTop: 2,
                diamBottom: 2,
                tessellation: 24,
                heightSubdivs: 1,
                wireframe: false,
                diffuseColor: '',
                diffuseTexture: '',
                diffuseTextureUOffset: 0,
                diffuseTextureVOffset: 0,
                diffuseTextureUScale: 1,
                diffuseTextureVScale: 1,
                emissiveColor: '',
                emissiveTexture: '',
                emissiveTextureUOffset: 0,
                emissiveTextureVOffset: 0,
                emissiveTextureUScale: 1,
                emissiveTextureVScale: 1,
                ambientColor: '',
                ambientTexture: '',
                ambientTextureUOffset: 0,
                ambientTextureVOffset: 0,
                ambientTextureUScale: 1,
                ambientTextureVScale: 1,
                specularColor: '',
                specularTexture: '',
                specularTextureUOffset: 0,
                specularTextureVOffset: 0,
                specularTextureUScale: 1,
                specularTextureVScale: 1,
                bumpTexture: '',
                bumpTextureUOffset: 0,
                bumpTextureVOffset: 0,
                bumpTextureUScale: 1,
                bumpTextureVScale: 1,
                specularPower: 100,
                positionX: 0,
                positionY: 0,
                positionZ: 0,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                wireframe: false
            }
        });

        return record;
    },

    getGround: function() {
        var record = Ext.create('Shopware.apps.SwagThreeSixty.model.SceneObject', {
            label: 'Ground',
            config: {
                type: 'Ground',
                label: 'Ground',
                iconCls: 'sprite-layer',
                width: 1,
                height: 1,
                subdivs: 2,
                wireframe: false,
                diffuseColor: '',
                diffuseTexture: '',
                diffuseTextureUOffset: 0,
                diffuseTextureVOffset: 0,
                diffuseTextureUScale: 1,
                diffuseTextureVScale: 1,
                emissiveColor: '',
                emissiveTexture: '',
                emissiveTextureUOffset: 0,
                emissiveTextureVOffset: 0,
                emissiveTextureUScale: 1,
                emissiveTextureVScale: 1,
                ambientColor: '',
                ambientTexture: '',
                ambientTextureUOffset: 0,
                ambientTextureVOffset: 0,
                ambientTextureUScale: 1,
                ambientTextureVScale: 1,
                specularColor: '',
                specularTexture: '',
                specularTextureUOffset: 0,
                specularTextureVOffset: 0,
                specularTextureUScale: 1,
                specularTextureVScale: 1,
                bumpTexture: '',
                bumpTextureUOffset: 0,
                bumpTextureVOffset: 0,
                bumpTextureUScale: 1,
                bumpTextureVScale: 1,
                specularPower: 100,
                positionX: 0,
                positionY: 0,
                positionZ: 0,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                wireframe: false,
                visibility: 100
            }
        });

        return record;
    },

    getModel: function() {
        var record = Ext.create('Shopware.apps.SwagThreeSixty.model.SceneObject', {
            label: 'Model',
            config: {
                type: 'Model',
                label: 'Model',
                model: '',
                iconCls: 'sprite-json',
                positionX: 0,
                positionY: 0,
                positionZ: 0,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                scalingX: 1,
                scalingY: 1,
                scalingZ: 1
            }
        });

        return record;
    },

    onItemClick: function(panel, record) {
        var me = this,
            inspector = me.getInspector(),
            viewer =  me.getViewer(),
            layout = inspector.getLayout(),
            dynamicStore,
            formRecord;

        dynamicStore = Ext.create('Ext.data.Store', {
            fields: Ext.Array.map(Object.keys(record.raw.config), function(key) {
                var val = record.raw.config[key],
                    type = typeof(val);

                return {
                    type: type,
                    name: key
                };
            }),
            data: [ record.raw.config ]
        });

        formRecord = dynamicStore.first();

        var newActiveItem = null;
        inspector.items.each(function(item) {
            if (item.type === formRecord.data.type) {
                newActiveItem = item;
                return false;
            }
        });
        layout.setActiveItem(newActiveItem);

        newActiveItem.loadRecord(formRecord);
        viewer.fireEvent('highlight-mesh', record.raw.id);
    },

    onSaveItem: function() {
        var me = this,
            inspector = me.getInspector(),
            layout = inspector.getLayout(),
            form = layout.getActiveItem();

        form.getForm().updateRecord();
        var record = form.getForm().getRecord();

        var selectedRecord = me.getHierarchy().tree.getSelectionModel().getSelection()[0];
        selectedRecord.set('config', record.data);
        selectedRecord.set('label', record.data.label);

        selectedRecord.save({
            callback: function() {
                me.getHierarchy().tree.getStore().load();
            }
        });
    }
});