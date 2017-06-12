<?php
class Shopware_Controllers_Backend_SwagThreeSixty extends Shopware_Controllers_Backend_ExtJs
{
    private $model = '\SwagThreeSixtyViewer\Models\ThreeSixtyModel';

    /**
     * @var \SwagThreeSixtyViewer\Components\ThreeSixtyModelService
     */
    private $modelService;

    /**
     * Contains the global shopware entity manager.
     * The manager is used for each doctrine entity operation.
     *
     * @var \Shopware\Components\Model\ModelManager
     */
    protected $manager;

    protected $repository;

    public function preDispatch()
    {
        parent::preDispatch();
        $this->modelService = $this->get('swag_three_sixty.model_service');
    }

    public function getListAction() {
        $offset = $this->Request()->getParam('start', 0);
        $limit = $this->Request()->getParam('limit', 20);

        $builder = $this->getListQuery();

        $builder->setFirstResult($offset)
            ->setMaxResults($limit);

        $paginator = $this->getPaginator($builder);
        $data = $paginator->getIterator()->getArrayCopy();

        foreach($data as &$item) {
            $item['config'] = json_decode($item['config'], true);
        }

        $count = $paginator->count();

        $this->View()->assign(['success' => true, 'data' => $data, 'total' => $count]);
    }

    public function getTreeAction() {
        $id = $this->Request()->getParam('id');

        $root = false;
        if ($id === 'NaN') {
            $root = true;
            $id = $this->Request()->getParam('sceneId');
        }

        $models = $this->modelService->getTree($id, $root);

        $this->View()->assign([
            'success' => true,
            'data' =>  $models
        ]);
    }

    public function saveSceneAction() {
        $data = $this->Request()->getParams();
        $lastId = $this->modelService->save($data);

        $this->View()->assign([
            'success' => true,
            'data' => [
                'id' => $lastId
            ]
        ]);
    }

    public function destroyScenesAction() {
        if (!$this->Request()->has('ids')) {
            return;
        }

        $sceneIds = $this->Request()->get('ids');

        foreach($sceneIds as $sceneId) {
            $this->modelService->deleteScene($sceneId);
        }

        $this->View()->assign([
            'success' => true,
            'removedScenes' => $sceneIds
        ]);
    }

    public function destroySceneAction() {
        if (!$this->Request()->has('id')) {
            return;
        }

        $sceneId = $this->Request()->get('id');

        $this->modelService->deleteScene($sceneId);

        $this->View()->assign([
            'success' => true
        ]);
    }

    /**
     * Returns the instance of the global shopware entity manager.
     * Used for each data operation with doctrine models.
     *
     * @return \Shopware\Components\Model\ModelManager
     */
    public function getManager()
    {
        if ($this->manager === null) {
            $this->manager = Shopware()->Models();
        }

        return $this->manager;
    }

    protected function getRepository()
    {
        if ($this->repository === null) {
            $this->repository = $this->getManager()->getRepository($this->model);
        }

        return $this->repository;
    }

    /**
     * @param $builder
     *
     * @return \Doctrine\ORM\Tools\Pagination\Paginator
     */
    protected function getPaginator($builder)
    {
        $query = $builder->getQuery();
        $query->setHydrationMode(\Doctrine\ORM\AbstractQuery::HYDRATE_ARRAY);

        /** @var \Shopware\Components\Model\ModelManager $entityManager */
        $entityManager = $this->get('models');
        $pagination = $entityManager->createPaginator($query);

        return $pagination;
    }

    protected function getListQuery()
    {
        $builder = $this->getManager()->createQueryBuilder();
        $builder->select('swagThreeSixty')
            ->from($this->model, 'swagThreeSixty')
            ->where('swagThreeSixty.sceneId IS NULL');

        return $builder;
    }
}
