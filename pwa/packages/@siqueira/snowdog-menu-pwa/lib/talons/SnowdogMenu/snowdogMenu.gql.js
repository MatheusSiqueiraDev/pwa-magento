import { gql } from '@apollo/client';

export const GET_SNOWDOG_MENU = gql`
    query {
        snowdogMenus(identifiers: "siqueira-menu") {
            items {
                menu_id
                identifier
                nodes {
                    items {
                        url_key
                        node_id
                        title
                        type
                        children {
                            url_key
                            node_id
                            title
                            type
                            children {
                                url_key
                                node_id
                                title
                                type
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_STORE_CONFIG_DATA = gql`
    query GetStoreConfigForMegaMenu {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            category_url_suffix,
          	product_url_suffix
        }
    }
`;

export default {
    getSnowdogMenu: GET_SNOWDOG_MENU,
    getStoreConfigQuery: GET_STORE_CONFIG_DATA
};
