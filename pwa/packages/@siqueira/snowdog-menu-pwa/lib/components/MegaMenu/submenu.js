import React from 'react';
import PropTypes from 'prop-types';

import { useSubMenu } from '@magento/peregrine/lib/talons/MegaMenu/useSubMenu';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/MegaMenu/submenu.module.css';
import SubmenuColumn from './submenuColumn';

/**
 * The Submenu component displays a submenu within the mega menu.
 *
 * @param {Object} props - The component properties.
 * @returns {JSX.Element} - The Submenu component.
 */
const Submenu = props => {
    const {
        items,
        mainNavWidth,
        isFocused,
        subMenuState,
        handleCloseSubMenu,
        categoryUrlSuffix,
        productUrlSuffix,
        onNavigate
    } = props;

    const PADDING_OFFSET = 20;
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useSubMenu({
        isFocused,
        subMenuState,
        handleCloseSubMenu
    });

    const { isSubMenuActive } = talonProps;

    const subMenuClassname = isSubMenuActive
        ? classes.submenu_active
        : classes.submenu_inactive;

    /**
     * Maps the items to SubmenuColumn components.
     *
     * @returns {JSX.Element[]} - The submenu columns.
     */
    const subMenus = items.map((node, index) => {
        const keyboardProps =
            index === items.length - 1 ? talonProps.keyboardProps : {};
        return (
            <SubmenuColumn
                index={index}
                keyboardProps={keyboardProps}
                key={node.node_id}
                node={node}
                categoryUrlSuffix={categoryUrlSuffix}
                productUrlSuffix={productUrlSuffix}
                onNavigate={onNavigate}
                handleCloseSubMenu={handleCloseSubMenu}
            />
        );
    });

    return (
        <div className={subMenuClassname}>
            <div
                className={classes.submenuItems}
                style={{ minWidth: mainNavWidth + PADDING_OFFSET }}
            >
                {subMenus}
            </div>
        </div>
    );
};

export default Submenu;

Submenu.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            children: PropTypes.array.isRequired,
            node_id: PropTypes.number.isRequired,
            isActive: PropTypes.bool.isRequired,
            title: PropTypes.string.isRequired,
            path: PropTypes.array.isRequired,
            url_key: PropTypes.string.isRequired
        })
    ).isRequired,
    mainNavWidth: PropTypes.number.isRequired,
    categoryUrlSuffix: PropTypes.string,
    productUrlSuffix: PropTypes.string,
    onNavigate: PropTypes.func.isRequired,
    handleCloseSubMenu: PropTypes.func.isRequired
};
