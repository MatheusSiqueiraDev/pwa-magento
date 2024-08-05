/**
 * Custom hook to get the URL of a node in the Snowdog menu.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.node - The menu node containing type and URL key information.
 * @returns {Object} - Returns an object containing the node URL.
 */
export default (props = {}) => {
    const { node, categoryUrlSuffix, productUrlSuffix } = props;

    const { type, url_key } = node;

    /**
     * Generates the node URL based on the node's type and URL key.
     *
     * @returns {string|null} - The generated URL or null if there is no URL key or type.
     */
    const nodeUrl = () => {
        if (!url_key && !type) return null;

        if (type === 'category')
            return `/${url_key}${categoryUrlSuffix ? categoryUrlSuffix : ''}`;

        if (type === 'product')
            return `/${url_key}${productUrlSuffix ? productUrlSuffix : ''}`;

        return `/${url_key}`;
    };

    return {
        nodeUrl
    };
};
