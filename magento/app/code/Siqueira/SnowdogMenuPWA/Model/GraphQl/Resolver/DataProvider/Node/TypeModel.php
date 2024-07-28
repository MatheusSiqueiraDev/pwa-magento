<?php
/**
 * Copyright © Siqueira. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Siqueira\SnowdogMenuPWA\Model\GraphQl\Resolver\DataProvider\Node;

use Magento\Catalog\Api\Data\CategoryInterface;
use Magento\Catalog\Api\Data\ProductInterface;
use Magento\Cms\Api\Data\PageInterface;
use Snowdog\Menu\Model\GraphQl\Resolver\DataProvider\Node\TypeModel as TypeModelSnow;

class TypeModel extends TypeModelSnow
{
    public function getModelUrlKey($type, $model): ?string
    {
        switch ($type) {
            case "product":
                /** @var ProductInterface $model */
                $urlKey = $model->getUrlKey();
                break;
            case "category":
                /** @var CategoryInterface $model */
                $urlKey = $model->getUrlPath();
                break;
            case "cms_page":
                /** @var PageInterface $model */
                $urlKey = $model->getIdentifier();
                break;
            default:
                $urlKey = "";
                break;
        }
        return $urlKey;
    }
}
