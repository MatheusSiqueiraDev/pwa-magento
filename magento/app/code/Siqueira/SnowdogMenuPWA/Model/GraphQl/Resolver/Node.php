<?php
/**
 * Copyright © Siqueira. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Siqueira\SnowdogMenuPWA\Model\GraphQl\Resolver;

use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Snowdog\Menu\Model\GraphQl\Resolver\DataProvider\Node as NodeDataProvider;
use Siqueira\SnowdogMenuPWA\Model\GraphQl\Resolver\DataProvider\ConstructCategory;

class Node implements ResolverInterface
{
    public function __construct(
        readonly private NodeDataProvider $dataProvider,
        readonly private ConstructCategory $constructCategory
    ) {}

    /**
     * {@inheritDoc}
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    ) {
        if (!isset($args['identifier'])) {
            throw new GraphQlInputException(__('Menu identifier must be specified.'));
        }

        try {
            $storeId = (int) $context->getExtensionAttributes()->getStore()->getId();
            $nodes = $this->dataProvider->getNodesByMenuIdentifier((string) $args['identifier'], $storeId);
            $nodes = $this->constructCategory->constructNodes($nodes);
        } catch (NoSuchEntityException $exception) {
            throw new GraphQlNoSuchEntityException(__($exception->getMessage()), $exception);
        }

        return ['items' => $nodes];
    }
}
