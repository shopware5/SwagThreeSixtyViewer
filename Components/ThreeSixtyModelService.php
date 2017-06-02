<?php

namespace SwagThreeSixtyViewer\Components;

use Doctrine\DBAL\Connection;
use Shopware\Bundle\StoreFrontBundle\Service\MediaServiceInterface;
use Shopware\Components\Compatibility\LegacyStructConverter;
use WebDriver\Exception;

class ThreeSixtyModelService
{
    /**
     * @var MediaServiceInterface $mediaService
     */
    private $mediaService;

    /**
     * @var LegacyStructConverter $legacyStructConverter
     */
    private $legacyStructConverter;
    /**
     * @var Connection
     */
    private $connection;

    /**
     * ThreeDModelService constructor.
     * @param MediaServiceInterface $mediaService
     * @param LegacyStructConverter $legacyStructConverter
     * @param Connection $connection
     */
    public function __construct(
        MediaServiceInterface $mediaService,
        LegacyStructConverter $legacyStructConverter,
        Connection $connection
    ) {
        $this->mediaService = $mediaService;
        $this->legacyStructConverter = $legacyStructConverter;
        $this->connection = $connection;
    }

    public function detail($sceneId) {
        if (!$sceneId) {
            return false;
        }

        $query = $this->connection->createQueryBuilder();

        $query->select(['id', 'scene_id', 'label', 'config', 'created_at', 'updated_at'])
            ->from('swag_three_sixty')
            ->where('id', (int) $sceneId)
            ->orWhere('scene_id', (int) $sceneId);

        $scenes = $query->execute()->fetchAll(\PDO::FETCH_ASSOC);

        foreach($scenes as &$scene) {
            $scene['config'] = json_decode($scene['config'], true);
        }

        return $scenes;
    }

    public function getTree($sceneId, $root) {
        $query = $this->connection->createQueryBuilder();

        if ($root === true) {
            $query->select(['id', 'scene_id', 'label', 'config', 'created_at', 'updated_at'])
                ->from('swag_three_sixty')
                ->where('id', (int) $sceneId);

            $rootScene = $query->execute()->fetch(\PDO::FETCH_ASSOC);

            $tree = [
                'text' => $rootScene['label'],
                'config' => json_decode($rootScene['config'], true),
                'leaf' => false,
                'iconCls' => 'sprite-billboard-red',
                'expanded' => true,
                'rootNode' => true,
                'id' => $rootScene['id'],
                'scene_id' => null,
                'created_at' => $rootScene['created_at'],
                'updated_at' => $rootScene['updated_at'],
            ];
        } else {
            $query->select(['id', 'scene_id', 'label', 'config', 'created_at', 'updated_at'])
                ->from('swag_three_sixty')
                ->where('scene_id', (int) $sceneId);

            $scenes = $query->execute()->fetchAll(\PDO::FETCH_ASSOC);
            $tree = [];

            foreach($scenes as $child) {
                $config = json_decode($child['config'], true);
                array_push($tree, [
                    'text' => $child['label'],
                    'config' => json_decode($child['config'], true),
                    'leaf' => true,
                    'iconCls' => $config['iconCls'],
                    'id' => $child['id'],
                    'scene_id' => $child['scene_id'],
                    'created_at' => $child['created_at'],
                    'updated_at' => $child['updated_at'],
                ]);
            }
        }

        return $tree;
    }

    public function deleteScene($sceneId)
    {
        $query = $this->connection->createQueryBuilder();

        $query->delete('swag_three_sixty')
            ->where('id = :id')
            ->orWhere('scene_id = :id')
            ->setParameter('id', (int) $sceneId);

        $query->execute();

        return true;
    }

    public function save($sceneData)
    {
        $sceneData['config'] = json_encode($sceneData['config']);
        if ($sceneData['scene_id'] <= 0) {
            $sceneData['scene_id'] = null;
        }
        if ($sceneData['id'] <= 0) {
            return $this->insert($sceneData);
        } else {
            $this->update($sceneData);
            return $sceneData['id'];
        }
    }

    private function insert($sceneData)
    {
        $query = $this->connection->createQueryBuilder();
        $query->insert('swag_three_sixty');
        $query->setValue('label', ':label');
        $query->setValue('config', ':config');
        $query->setValue('scene_id', ':scene_id');
        $query->setValue('created_at', ':created_at');
        $query->setValue('updated_at', ':updated_at');
        $query->setParameter(':label', $sceneData['label']);
        $query->setParameter(':config', $sceneData['config']);
        $query->setParameter(':scene_id', $sceneData['scene_id']);
        $query->setParameter(':created_at', new \Datetime('now'), 'datetime');
        $query->setParameter(':updated_at', new \Datetime('now'), 'datetime');
        $query->execute();

        return $this->connection->lastInsertId('swag_three_sixty');
    }

    /**
     * @param $sceneData
     */
    private function update($sceneData)
    {
        $query = $this->connection->createQueryBuilder();
        $query->update('swag_three_sixty');
        $query->set('label', ':label');
        $query->set('config', ':config');
        $query->set('scene_id', ':scene_id');
        $query->set('updated_at', ':updated_at');
        $query->setParameter(':label', $sceneData['label']);
        $query->setParameter(':config', $sceneData['config']);
        $query->setParameter(':scene_id', $sceneData['scene_id']);
        $query->setParameter(':updated_at', new \Datetime('now'), 'datetime');
        $query->where('id = :id');
        $query->setParameter(':id', $sceneData['id']);

        $query->execute();
    }

}