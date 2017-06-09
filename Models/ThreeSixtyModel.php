<?php

namespace SwagThreeSixtyViewer\Models;

use Doctrine\ORM\Mapping as ORM;
use Shopware\Components\Model\ModelEntity;

/**
 * @ORM\Table(name="swag_three_sixty")
 * @ORM\Entity()
 * @ORM\HasLifecycleCallbacks()
 */
class ThreeSixtyModel extends ModelEntity
{
    /**
     * @var integer $id
     *
     * @ORM\Id
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var integer $sceneId
     *
     * @ORM\Column(name="scene_id", type="integer", nullable=true)
     */
    private $sceneId;

    /**
     * @var string $label
     * @ORM\Column(name="label", type="string", nullable=false)
     */
    private $label;

    /**
     * @var string $config
     * @ORM\Column(name="config", type="text", nullable=true)
     */
    private $config;

    /**
     * @var string $createdAt
     * @ORM\Column(name="created_at", type="date", nullable=true)
     */
    private $createdAt;

    /**
     * @var string $updatedAt
     * @ORM\Column(name="updated_at", type="date", nullable=true)
     */
    private $updatedAt;

    /**
     * ThreeSixtyModel constructor.
     *
     */
    public function __construct()
    {
        $this->updatedAt = $this->createdAt = new \DateTime();
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return int
     */
    public function getSceneId()
    {
        return $this->sceneId;
    }

    /**
     * @param int $sceneId
     */
    public function setSceneId($sceneId)
    {
        $this->sceneId = $sceneId;
    }

    /**
     * @return string
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * @param string $label
     */
    public function setLabel($label)
    {
        $this->label = $label;
    }

    /**
     * @return string
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * @param string $config
     */
    public function setConfig($config)
    {
        $this->config = $config;
    }

    /**
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->updatedAt = new \DateTime();
    }
}
