import React from 'react';
import { Link } from 'react-router-dom';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/MegaMenu/submenuColumn.module.css';
import PropTypes from 'prop-types';

/**
 * The SubmenuColumn component displays columns with categories in submenu
 *
 * @param {MegaMenuCategory} props.category
 * @param {function} props.onNavigate - function called when clicking on Link
 */
const SubmenuColumn = props => {
    const {
        category,
        categoryUrlSuffix,
        onNavigate,
        handleCloseSubMenu
    } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const categoryUrl = category => category.type == 'category' 
        ? `/${category.url_key}${categoryUrlSuffix || ''}`
        : category.url_key
    

    let children = null;

    if (category.children.length) {
        const childrenItems = category.children.map((subCategory, index) => {
            const { isActive, title } = subCategory;

            // setting keyboardProps if it is last child of that category
            const keyboardProps =
                index === category.children.length - 1
                    ? props.keyboardProps
                    : {};

            return (
                <li key={index} className={classes.submenuChildItem}>
                    <Link
                        {...keyboardProps}
                        className={isActive ? classes.linkActive : classes.link}
                        data-cy="MegaMenu-SubmenuColumn-link"
                        to={categoryUrl(subCategory)}
                        onClick={onNavigate}
                    >
                        {title}
                    </Link>
                </li>
            );
        });

        children = <ul className={classes.submenuChild}>{childrenItems}</ul>;
    }

    // setting keyboardProps if category does not have any sub-category
    const keyboardProps = category.children.length ? {} : props.keyboardProps;

    return (
        <div className={classes.submenuColumn}>
            <Link
                {...keyboardProps}
                className={classes.link}
                data-cy="MegaMenu-SubmenuColumn-link"
                to={categoryUrl(category)}
                onClick={() => {
                    handleCloseSubMenu();
                    onNavigate();
                }}
            >
                <span className={classes.heading}>{category.title}</span>
            </Link>
            {children}
        </div>
    );
};

export default SubmenuColumn;

SubmenuColumn.propTypes = {
    category: PropTypes.shape({
        children: PropTypes.array,
        node_id: PropTypes.number.isRequired,
        isActive: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        url_key: PropTypes.string.isRequired
    }).isRequired,
    categoryUrlSuffix: PropTypes.string,
    onNavigate: PropTypes.func.isRequired,
    handleCloseSubMenu: PropTypes.func.isRequired
};
