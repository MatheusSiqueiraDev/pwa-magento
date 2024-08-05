import React, { useMemo } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useMegaMenuItem } from '../../talons/MegaMenu/useMegaMenuItem';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/MegaMenu/megaMenuItem.module.css';
import Submenu from './submenu';
import Icon from '@magento/venia-ui/lib/components/Icon';
import getUrlNode from '../../util/getUrlNode';

/**
 * The MegaMenuItem component displays a single menu item in the mega menu.
 *
 * @param {Object} props - The component properties.
 * @returns {JSX.Element} - The MegaMenuItem component.
 */
const MegaMenuItem = props => {
    const {
        activeNodeId,
        node,
        mainNavWidth,
        categoryUrlSuffix,
        subMenuState,
        disableFocus,
        onNavigate,
        handleSubMenuFocus,
        handleClickOutside,
        productUrlSuffix
    } = props;

    const { nodeUrl } = getUrlNode({
        node,
        categoryUrlSuffix,
        productUrlSuffix
    });

    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useMegaMenuItem({
        node,
        activeNodeId,
        subMenuState,
        disableFocus
    });

    const {
        isFocused,
        isActive,
        handleMenuItemFocus,
        handleCloseSubMenu,
        isMenuActive,
        handleKeyDown
    } = talonProps;

    const megaMenuItemClassname = isMenuActive
        ? classes.megaMenuItem_active
        : classes.megaMenuItem;

    /**
     * Maps the node's children to Submenu components.
     *
     * @returns {JSX.Element|null} - The submenu items or null if there are no children.
     */
    const items = useMemo(() => {
        return node.children.length ? (
            <Submenu
                isFocused={isFocused}
                subMenuState={subMenuState}
                items={node.children}
                mainNavWidth={mainNavWidth}
                handleCloseSubMenu={handleCloseSubMenu}
                categoryUrlSuffix={categoryUrlSuffix}
                productUrlSuffix={productUrlSuffix}
                onNavigate={onNavigate}
            />
        ) : null;
    }, [
        node,
        isFocused,
        mainNavWidth,
        subMenuState,
        handleCloseSubMenu,
        categoryUrlSuffix,
        productUrlSuffix,
        onNavigate
    ]);

    const maybeDownArrowIcon = node.children.length ? (
        <Icon className={classes.arrowDown} src={ArrowDown} size={16} />
    ) : null;

    const linkAttributes = node.children.length
        ? {
              'aria-label': `Category: ${node.title}. ${
                  node.children.length
              } sub-categories`
          }
        : {};

    return (
        <div
            className={megaMenuItemClassname}
            data-cy="MegaMenu-MegaMenuItem-megaMenuItem"
            onMouseEnter={() => {
                handleSubMenuFocus();
                handleMenuItemFocus();
            }}
            onFocus={() => {
                handleSubMenuFocus();
                handleMenuItemFocus();
            }}
            onTouchStart={() => {
                handleSubMenuFocus();
                handleMenuItemFocus();
            }}
            onMouseLeave={e => {
                handleClickOutside(e);
                handleCloseSubMenu();
            }}
        >
            <Link
                {...linkAttributes}
                onKeyDown={handleKeyDown}
                className={
                    isActive ? classes.megaMenuLinkActive : classes.megaMenuLink
                }
                data-cy="MegaMenu-MegaMenuItem-link"
                to={nodeUrl}
                onClick={onNavigate}
            >
                {node.title}
                {maybeDownArrowIcon}
            </Link>
            {items}
        </div>
    );
};

export default MegaMenuItem;

MegaMenuItem.propTypes = {
    node: PropTypes.shape({
        items: PropTypes.array,
        node_id: PropTypes.number.isRequired,
        include_in_menu: PropTypes.number,
        isActive: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        path: PropTypes.array.isRequired,
        url_key: PropTypes.string.isRequired
    }).isRequired,
    activeNodeId: PropTypes.number,
    mainNavWidth: PropTypes.number.isRequired,
    categoryUrlSuffix: PropTypes.string,
    productUrlSuffix: PropTypes.string,
    onNavigate: PropTypes.func.isRequired,
    handleSubMenuFocus: PropTypes.func.isRequired,
    handleClickOutside: PropTypes.func.isRequired
};
