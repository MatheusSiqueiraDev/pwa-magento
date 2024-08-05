import React from 'react';
import { Link } from 'react-router-dom';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/MegaMenu/submenuColumn.module.css';
import PropTypes from 'prop-types';
import getUrlNode from '../../util/getUrlNode';

/**
 * The SubmenuColumn component displays a column in the submenu with a list of child items.
 *
 * @param {Object} props - The component properties.
 * @returns {JSX.Element} - The SubmenuColumn component.
 */
const SubmenuColumn = props => {
    const {
        node,
        categoryUrlSuffix,
        productUrlSuffix,
        onNavigate,
        handleCloseSubMenu
    } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const { nodeUrl } = getUrlNode({
        node,
        categoryUrlSuffix,
        productUrlSuffix
    });

    let children = null;

    if (node.children.length) {
        const childrenItems = node.children.map((subNode, index) => {
            const { isActive, title } = subNode;

            const { nodeUrl } = getUrlNode({
                node: subNode,
                categoryUrlSuffix,
                productUrlSuffix
            });

            const keyboardProps =
                index === node.children.length - 1
                    ? props.keyboardProps
                    : {};

            return (
                <li key={index} className={classes.submenuChildItem}>
                    <Link
                        {...keyboardProps}
                        className={isActive ? classes.linkActive : classes.link}
                        data-cy="MegaMenu-SubmenuColumn-link"
                        to={nodeUrl}
                        onClick={onNavigate}
                    >
                        {title}
                    </Link>
                </li>
            );
        });

        children = <ul className={classes.submenuChild}>{childrenItems}</ul>;
    }

    const keyboardProps = node.children.length ? {} : props.keyboardProps;

    return (
        <div className={classes.submenuColumn}>
            <Link
                {...keyboardProps}
                className={classes.link}
                data-cy="MegaMenu-SubmenuColumn-link"
                to={nodeUrl}
                onClick={() => {
                    handleCloseSubMenu();
                    onNavigate();
                }}
            >
                <span className={classes.heading}>{node.title}</span>
            </Link>
            {children}
        </div>
    );
};

export default SubmenuColumn;

SubmenuColumn.propTypes = {
    node: PropTypes.shape({
        children: PropTypes.array,
        node_id: PropTypes.number.isRequired,
        isActive: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        url_key: PropTypes.string.isRequired
    }).isRequired,
    categoryUrlSuffix: PropTypes.string,
    productUrlSuffix: PropTypes.string,
    onNavigate: PropTypes.func.isRequired,
    handleCloseSubMenu: PropTypes.func.isRequired,
    keyboardProps: PropTypes.object
};
