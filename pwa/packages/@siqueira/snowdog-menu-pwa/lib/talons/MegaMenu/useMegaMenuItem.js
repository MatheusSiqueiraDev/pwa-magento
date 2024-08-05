import { useCallback, useMemo, useState } from 'react';

/**
 * A custom hook that provides functionality for a mega menu item.
 *
 * @param {Object} props - The hook properties.
 * @param {Object} props.node - The node data for the menu item.
 * @param {number} props.activeNodeId - The ID of the currently active node.
 * @param {boolean} props.subMenuState - The state of the submenu.
 * @param {boolean} props.disableFocus - Whether to disable focus on the menu item.
 * @returns {Object} - The state and event handlers for the mega menu item.
 */
export const useMegaMenuItem = props => {
    const { node, activeNodeId, subMenuState, disableFocus } = props;
    const [isFocused, setIsFocused] = useState(false);
    const isActive = node.node_id === activeNodeId;

    /**
     * Handles the focus event for the menu item.
     */
    const handleMenuItemFocus = useCallback(() => {
        setIsFocused(true);
    }, [setIsFocused]);

    /**
     * Handles the event to close the submenu.
     */
    const handleCloseSubMenu = useCallback(() => {
        setIsFocused(false);
    }, [setIsFocused]);

    /**
     * Determines if the menu is active.
     */
    const isMenuActive = useMemo(() => {
        if (!isFocused) {
            return false;
        }
        if (subMenuState) {
            return true;
        } else if (disableFocus) {
            setIsFocused(false);
        }
        return false;
    }, [isFocused, subMenuState, disableFocus]);

    /**
     * Handles the key down events for the menu item.
     *
     * @param {KeyboardEvent} event - The keyboard event.
     */
    const handleKeyDown = useCallback(
        event => {
            const { key: pressedKey, shiftKey } = event;

            // Checking down arrow and spacebar
            if (pressedKey === 'ArrowDown' || pressedKey === ' ') {
                event.preventDefault();
                if (node.children.length) {
                    setIsFocused(true);
                } else {
                    setIsFocused(false);
                }
                return;
            }

            // Checking up arrow or escape
            if (pressedKey === 'ArrowUp' || pressedKey === 'Escape') {
                setIsFocused(false);
            }

            // Checking Tab with Shift
            if (shiftKey && pressedKey === 'Tab') {
                setIsFocused(false);
            }
        },
        [node.children.length]
    );

    return {
        isFocused,
        isActive,
        handleMenuItemFocus,
        handleCloseSubMenu,
        isMenuActive,
        handleKeyDown
    };
};
