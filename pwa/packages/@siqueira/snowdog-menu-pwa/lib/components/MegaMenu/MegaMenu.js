import React, { useEffect, useRef, useState } from 'react';

import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport';
import { useMegaMenu } from '@magento/peregrine/lib/talons/MegaMenu/useMegaMenu';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from '@magento/venia-ui/lib/components/MegaMenu/megaMenu.module.css';
import { useSnowdogMenu } from '../../talons/SnowdogMenu/useSnowdogMenu';
import operationSnowdogMenu from '../../talons/SnowdogMenu/snowdogMenu.gql';
import MegaMenuItem from './megaMenuItem';

/**
 * The MegaMenu component displays a menu with categories on desktop devices.
 *
 * @param {Object} props - The component properties.
 * @returns {JSX.Element} - The MegaMenu component.
 */
const MegaMenu = props => {
    const mainNavRef = useRef(null);

    const {
        subMenuState,
        disableFocus,
        handleSubMenuFocus,
        handleNavigate,
        handleClickOutside
    } = useMegaMenu({
        mainNavRef,
        operations: {
            getStoreConfigQuery: operationSnowdogMenu.getStoreConfigQuery
        }
    });

    const {
        snowdogMenuData,
        activeNodeId,
        categoryUrlSuffix,
        productUrlSuffix
    } = useSnowdogMenu();

    const classes = useStyle(defaultClasses, props.classes);

    const [mainNavWidth, setMainNavWidth] = useState(0);
    const shouldRenderItems = useIsInViewport({
        elementRef: mainNavRef
    });

    /**
     * Handles the resize event to set the navigation width.
     */
    useEffect(() => {
        const handleResize = () => {
            const navWidth = mainNavRef.current
                ? mainNavRef.current.offsetWidth
                : null;

            setMainNavWidth(navWidth);
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    /**
     * Maps the snowdog menu data to MegaMenuItems.
     *
     * @returns {JSX.Element[]|null} - The menu items or null if there are no children.
     */
    const items = snowdogMenuData.children
        ? snowdogMenuData.children.map(node => {
              return (
                  <MegaMenuItem
                      node={node}
                      activeNodeId={activeNodeId}
                      categoryUrlSuffix={categoryUrlSuffix}
                      productUrlSuffix={productUrlSuffix}
                      mainNavWidth={mainNavWidth}
                      onNavigate={handleNavigate}
                      key={node.node_id}
                      subMenuState={subMenuState}
                      disableFocus={disableFocus}
                      handleSubMenuFocus={handleSubMenuFocus}
                      handleClickOutside={handleClickOutside}
                  />
              );
          })
        : null;

    return (
        <nav
            ref={mainNavRef}
            className={classes.megaMenu}
            data-cy="MegaMenu-megaMenu"
            role="navigation"
            onFocus={handleSubMenuFocus}
        >
            {shouldRenderItems ? items : null}
        </nav>
    );
};

export default MegaMenu;
