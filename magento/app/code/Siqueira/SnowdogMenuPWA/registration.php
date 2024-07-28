<?php
/**
 * Copyright © Siqueira. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

use \Magento\Framework\Component\ComponentRegistrar;

ComponentRegistrar::register(
    ComponentRegistrar::MODULE,
    'Siqueira_SnowdogMenuPWA',
    isset($file) ? dirname($file) : __DIR__
);
