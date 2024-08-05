import { useMemo, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './snowdogMenu.gql';
import getUrlNode from '../../util/getUrlNode';
import { node } from 'prop-types';

/**
 * A custom hook that manages the state and logic for the Snowdog menu.
 *
 * @param {Object} props - The hook properties.
 * @param {Object} props.operations - Custom GraphQL operations to merge with default operations.
 * @returns {Object} - The state and functions for managing the Snowdog menu.
 */
export const useSnowdogMenu = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getSnowdogMenu, getStoreConfigQuery } = operations;
    const location = useLocation();
    const [activeNodeId, setActiveNodeId] = useState(null);

    const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'no-cache'
    });

    const { data } = useQuery(getSnowdogMenu, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    /**
     * Computes the category URL suffix from the store configuration data.
     *
     * @returns {string} - The category URL suffix.
     */
    const categoryUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.category_url_suffix;
        }
    }, [storeConfigData]);

    /**
     * Computes the product URL suffix from the store configuration data.
     *
     * @returns {string} - The category URL suffix.
     */
    const productUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.product_url_suffix;
        }
    }, [storeConfigData]);

    /**
     * Checks if a given node is active based on the current location pathname.
     *
     * @param {Object} node - The node to check.
     * @param {string} node.url_key - The URL key of the node.
     * @param {string} node.type - The type of the node (e.g., 'category').
     * @returns {boolean} - True if the node is active, false otherwise.
     */
    const isActive = useCallback(
        ({ full_url }) => {
            if (!full_url) return false;

            return location.pathname === full_url;
        },
        [location.pathname, categoryUrlSuffix]
    );

    /**
     * Processes the Snowdog menu data to add path and active state to each node.
     *
     * @param {Object} node - The node to process.
     * @param {Array} path - The path of node IDs leading to the current node.
     * @param {boolean} isRoot - Whether the current node is the root node.
     * @returns {Object} - The processed node with path and active state.
     */
    const processData = useCallback(
        (node, path = [], isRoot = true) => {
            if (!node) return;

            const snowdogMenuNode = { ...node };

            if (!isRoot) {
                snowdogMenuNode.path = [...path, node.node_id];

                const { nodeUrl } = getUrlNode({
                    node: snowdogMenuNode,
                    categoryUrlSuffix,
                    productUrlSuffix
                });

                snowdogMenuNode.full_url = nodeUrl;
            }
         
            snowdogMenuNode.isActive = isActive(snowdogMenuNode);

            if (snowdogMenuNode.children) {
                snowdogMenuNode.children = snowdogMenuNode.children.map(child =>
                    processData(child, snowdogMenuNode.path, false)
                );
            }

            return snowdogMenuNode;
        },
        [isActive]
    );

    /**
     * Computes the processed Snowdog menu data.
     *
     * @returns {Object} - The processed Snowdog menu data.
     */
    const snowdogMenuData = useMemo(() => {
        return data ? processData({ children: data.snowdogMenus.items[0].nodes.items }) : {};
    }, [data, processData]);

    /**
     * Finds the active node in the Snowdog menu based on the current location pathname.
     *
     * @param {string} pathname - The current location pathname.
     * @param {Object} node - The node to check.
     * @returns {Object|undefined} - The active node if found, undefined otherwise.
     */
    const findActiveNode = useCallback(
        (pathname, node) => {
            if (isActive(node)) {
                return node;
            }

            if (node.children) {
                return node.children.find(child => findActiveNode(pathname, child));
            }
        },
        [isActive]
    );

    useEffect(() => {
        const activeNode = findActiveNode(location.pathname, snowdogMenuData);
        if (activeNode) {
            setActiveNodeId(activeNode.path[0]);
        } else {
            setActiveNodeId(null);
        }
    }, [findActiveNode, location.pathname, snowdogMenuData]);

    return {
        snowdogMenuData,
        activeNodeId,
        categoryUrlSuffix,
        productUrlSuffix
    };
};
