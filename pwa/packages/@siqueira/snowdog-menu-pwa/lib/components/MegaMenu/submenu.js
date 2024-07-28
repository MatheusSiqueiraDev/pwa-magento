import React from 'react';
import PropTypes from 'prop-types';

import { useSubMenu } from '@magento/peregrine/lib/talons/MegaMenu/useSubMenu';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/MegaMenu/submenu.module.css';
import SubmenuColumn from './submenuColumn';

/**
 * The Submenu component displays submenu in mega menu
 *
 * @param {array} props.items - categories to display
 * @param {int} props.mainNavWidth - width of the main nav. It's used for setting min-width of the submenu
 * @param {function} props.onNavigate - function called when clicking on Link
 */
const Submenu = props => {
    const {
        items,
        mainNavWidth,
        isFocused,
        subMenuState,
        handleCloseSubMenu,
        categoryUrlSuffix,
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

    const subMenus = items.map((category, index) => {
        const keyboardProps =
            index === items.length - 1 ? talonProps.keyboardProps : {};
        return (
            <SubmenuColumn
                index={index}
                keyboardProps={keyboardProps}
                key={category.node_id}
                category={category}
                categoryUrlSuffix={categoryUrlSuffix}
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
    onNavigate: PropTypes.func.isRequired,
    handleCloseSubMenu: PropTypes.func.isRequired
};
