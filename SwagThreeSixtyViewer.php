<?php

namespace SwagThreeSixtyViewer;

use Enlight_Controller_ActionEventArgs;
use Shopware\Bundle\AttributeBundle\Service\TypeMapping;
use Shopware\Components\Plugin;
use Doctrine\ORM\Tools\SchemaTool;
use Shopware\Components\Plugin\Context\InstallContext;
use Shopware\Components\Plugin\Context\UninstallContext;
use SwagThreeSixtyViewer\Models\ThreeSixtyModel;
use Doctrine\Common\Collections\ArrayCollection;
use Shopware\Components\Theme\LessDefinition;

class SwagThreeSixtyViewer extends Plugin
{
    public static function getSubscribedEvents()
    {
        return [
            'Enlight_Controller_Action_PostDispatch_Backend' => 'onBackendPostDispatch',
            'Enlight_Controller_Action_PostDispatchSecure_Frontend_Detail' => 'onDetailPostDispatch',
            'Theme_Compiler_Collect_Plugin_Javascript' => 'onAddJavascriptFiles',
            'Theme_Compiler_Collect_Plugin_Less' => 'onAddLessFiles',
        ];
    }

    /**
     * @param InstallContext $context
     */
    public function install(InstallContext $context)
    {
        $this->createSchema();
        $this->createEmotionElement();
        $service = $this->container->get('shopware_attribute.crud_service');
        $service->update('s_articles_attributes', 'swagThreeSixty', TypeMapping::TYPE_SINGLE_SELECTION, [
            'label' => '3D Scene',
            'custom' => false,
            'entity' => 'SwagThreeSixtyViewer\Models\ThreeSixtyModel',
            'displayInBackend' => true
        ]);

        parent::install($context);
    }

    public function uninstall(UninstallContext $context)
    {
        $this->removeSchema();

        $service = $this->container->get('shopware_attribute.crud_service');
        $service->delete('s_articles_attributes', 'swagThreeSixty');

        parent::uninstall($context);
    }

    private function createEmotionElement()
    {
        $installer = $this->container->get('shopware.emotion_component_installer');
        $threeSixtyElement = $installer->createOrUpdate(
            $this->getName(),
            '3D Viewer',
            [
                'name' => '3D Viewer',
                'xtype' => 'emotion-components-threesixy',
                'template' => 'emotion_threesixy',
                'cls' => 'emotion-threesixy',
                'description' => 'A simple 3d viewer element for the shopping worlds.'
            ]
        );

        $threeSixtyElement->createTextField(
            [
                'name' => 'threesixty_id',
                'fieldLabel' => '3D Scene ID',
                'supportText' => 'Enter the ID of the 3D scene you want to embed.',
                'allowBlank' => false
            ]
        );

        return $threeSixtyElement;
    }

    private function createSchema()
    {
        $tool = new SchemaTool($this->container->get('models'));

        $classes = [
            $this->container->get('models')->getClassMetadata(ThreeSixtyModel::class)
        ];

        $tool->createSchema($classes);
    }

    private function removeSchema()
    {
        $tool = new SchemaTool($this->container->get('models'));

        $classes = [
            $this->container->get('models')->getClassMetadata(ThreeSixtyModel::class)
        ];

        $tool->dropSchema($classes);
    }

    /**
     * @param Enlight_Controller_ActionEventArgs $args
     */
    public function onBackendPostDispatch(Enlight_Controller_ActionEventArgs $args)
    {
        $controller = $args->getSubject();
        $view = $controller->View();

        $view->addTemplateDir($this->getPath() . '/Resources/views');
        $view->extendsTemplate('backend/swag_three_sixty/base/header.tpl');
    }

    public function registerController(\Enlight_Event_EventArgs $args)
    {
        $this->container->get('template')->addTemplateDir(
            $this->getPath() . '/Resources/views/'
        );

        return $this->getPath() . '/Controllers/Backend/SwagThreeSixty.php';
    }

    public function onDetailPostDispatch(\Enlight_Event_EventArgs $args)
    {
        $modelService = $this->container->get('swag_three_sixty.model_service');
        $controller = $args->getSubject();
        $view = $controller->View();

        $product = $view->sArticle;
        if (!isset($product['swagthreesixty']) || empty($product['swagthreesixty'])) {
            return;
        }

        $this->container->get('template')->addTemplateDir(
            $this->getPath() . '/Resources/views/'
        );

        $model = $modelService->detail((int) $product['swagthreesixty']);

        $view->assign([
            'sThreeSixtyModel' => $model
        ]);
    }

    public function onAddJavascriptFiles()
    {
        $jsFiles = [
            $this->getPath() . '/Resources/views/backend/_public/js/babylon.custom.js',
            $this->getPath() . '/Resources/views/frontend/_public/src/js/jquery.swag-three-sixty-viewer.js'
        ];

        return new ArrayCollection($jsFiles);
    }

    public function onAddLessFiles()
    {
        $lessFiles = [
            $this->getPath() . '/Resources/views/frontend/_public/src/less/all.less'
        ];

        $less = new LessDefinition([], $lessFiles, $this->getPath());

        return new ArrayCollection([$less]);
    }

}
