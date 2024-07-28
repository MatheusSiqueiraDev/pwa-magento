<?php
/**
 * Copyright © Siqueira. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Siqueira\SnowdogMenuPWA\Model\GraphQl\Resolver\DataProvider;

class ConstructCategory {
    public function constructNodes($nodes)
    {
        // Cria um array para armazenar os nós de nível 0
        $level0 = array_filter($nodes, function($node) {
            return $node['level'] == 0;
        });

        // Usa um mapa para armazenar referências aos nós por ID
        $nodeMap = [];
        foreach ($nodes as &$node) {
            $node['children'] = []; // Inicializa o array de children
            $nodeMap[$node['node_id']] = &$node;
        }

        // Adiciona nós filhos aos seus respectivos pais
        foreach ($nodes as &$node) {
            if ($node['parent_id'] != null && isset($nodeMap[$node['parent_id']])) {
                $nodeMap[$node['parent_id']]['children'][] = &$node;
            }
        }

        // Filtra novamente os nós de nível 0 para manter as referências corretas
        $level0 = array_filter($nodes, function($node) {
            return $node['level'] == 0;
        });

        return $level0;
    }
}
