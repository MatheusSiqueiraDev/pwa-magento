import { useMemo, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useInternalLink } from '@magento/peregrine/lib/hooks/useInternalLink';

import { useQuery } from '@apollo/client';
import { useEventListener } from '@magento/peregrine/lib/hooks/useEventListener';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './snowdogMenu.gql';


export const useSnowdogMenu = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    
    const { getSnowdogMenu, getStoreConfigQuery } = operations;

    const location = useLocation();

    const [activeCategoryId, setActiveCategoryId] = useState(null);

    const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const { data } = useQuery(getSnowdogMenu, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });    

    const categoryUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.category_url_suffix;
        }
    }, [storeConfigData]);

    /**
     * Check if category is the active category based on the current location.
     *
     * @param {MegaMenuCategory} category
     * @returns {boolean}
     */

    const isActive = useCallback(
        ({ url_key, type }) => {
            if (!url_key) return false;
            let categoryUrlPath = url_key;
            if(type == 'category') 
                categoryUrlPath = `/${url_key}${categoryUrlSuffix}`;
    
            return location.pathname === categoryUrlPath;
        },
        [location.pathname, categoryUrlSuffix]
    );

    /**
     * Recursively map data returned by GraphQL query.
     *
     * @param {MegaMenuCategory} category
     * @param {array} - path from the given category to the first level category
     * @param {boolean} isRoot - describes is category a root category
     * @return {MegaMenuCategory}
     */
    const processData = useCallback(
        (category, path = [], isRoot = true) => {
            if (!category) {
                return;
            }

            const megaMenuCategory = Object.assign({}, category);

            if (!isRoot) {
                megaMenuCategory.path = [...path, category.node_id];
            }

            megaMenuCategory.isActive = isActive(megaMenuCategory);

            if (megaMenuCategory.children) {
                megaMenuCategory.children = [...megaMenuCategory.children]
                    .map(child =>
                        processData(child, megaMenuCategory.path, false)
                    );
            }

            return megaMenuCategory;
        },
        [isActive]
    );

    const snowdogMenuData = useMemo(() => {
        return data ? processData({children: data.snowdogMenus.items[0].nodes.items}) : {};
    }, [data, processData]);

    const findActiveCategory = useCallback(
        (pathname, category) => {
            if (isActive(category)) {
                return category;
            }

            if (category.children) {
                return category.children.find(category =>
                    findActiveCategory(pathname, category)
                );
            }
        },
        [isActive]
    );

    useEffect(() => {
        const activeCategory = findActiveCategory(
            location.pathname,
            snowdogMenuData
        );

        if (activeCategory) {
            setActiveCategoryId(activeCategory.path[0]);
        } else {
            setActiveCategoryId(null);
        }
    }, [findActiveCategory, location.pathname, snowdogMenuData]);

    return {
        snowdogMenuData,
        activeCategoryId
    };
};