/**
 *  Edit mode configuration options.
 *  This is an example, options may vary per implementation.
 */
var EasyEditConfig = {

    // Internal debugging flag. Setting this value to true will log debugging data
    // to the console in browsers that support console.log.
    // Quietly ignored in browsers that do not support console.log.
    debug:                      false,

    // The title bar that is displayed top of browser.
    // @asset_name@ is a dynamic replacement for the current assets name.
    titleBar:                   "@asset_name@ : CampTriangle : Editing Mode",

    // Lock refresh interval in seconds.
    // Automatically refresh all locks for an asset based on this value.
    lockRefreshInterval:        120,

    // Array of base site urls. (Replaces 'eesSiteURL' global variable from EES builds 832 and 833)
    // For the majority of systems, this can stay empty.
    // If required, the array of URLs should match up with urls applied in the Squiz Matrix system configuration.
    // If this is left empty or Edit+ is installed on a site url that doesn't match a base site url then
    // a domain relative url will be used.
    baseSiteUrls: [],

    // JS API configuration options.
    // Populate with the API key found on related JS API details screen.
    JSAPI: {
        key:                    "3634715823"
    },

    // Cascade status change threshold.
    // If a user selects 'Cascade Status Change' on the Details Screen and the
    // total number of child assets exceeds this value they will be
    // presented with a prompt to continue or to return to the screen.
    cascadeThreshold:           4,

    // Timeout to show a warning for overlays that are active for more than X number of
    // seconds. This is usually because of an ajax function that has for whatever
    // reason failed to return successfully and could indicate server error.
    overlayTimeout:             180,

    // PERFORMANCE FEATURE.
    // The default mode to use on initial load. Can be 'edit' or 'preview'.
    // Can be overridden in the url by using the hash #mode=mode_name e.g. #mode=preview.
    // If missing from config defaults to edit mode.
    defaultMode:                'edit',

    // Default screen to use on initial edit mode load.
    // Can be overridden in the url by using the hash #screen=screen_name e.g. #screen=content.
    // If missing from config defaults to details screen.
    defaultScreen:              'details',

    // Should the ?SQ_ACTION=diff flag be used in preview mode?
    // If missing from config or set to false preview mode will require
    // user interaction with the 'Compare to Live' button.
    showDifferencesInPreviewMode: false,

    // Array of additional asset finder locations.
    // This can be used to add asset id's of frequently used site parents e.g. News, Events, Images.
    assetFinderLocations:         [72,73],

    // PERFORMANCE FEATURE.
    // Maximum number of assets to show in an asset finder panel before
    // pagination occurs.
    // If missing from config pagination will default to 100.
    // 0 = no pagination.
    assetFinderMaxAssets:         100,

    // PERFORMANCE FEATURE.
    // Cache manager default expiry, minutes expressed as a whole number.
    cacheManagerDefaultExpiry:    2,

    // Show 'Set Thumbnail' section on details screen.
    // Adds the ability to add/remove/update a thumbnail to all assets.
    // If missing from config thumbnail will show by default, set to false to hide.
    useThumbnail:                true,

    // Display and allow editing of future statuses via the details screen.
    // If missing from config or false the details screen will not display 'Show Future Status'.
    allowFutureStatusChange:     true,

    // PERFORMANCE FEATURE.
    // Display a list of direct children on the link screen.
    // If missing from config or false the linking screen will not display 'Direct Children'.
    showChildrenOnLinkingScreen: true,

    // [OPTIONAL] Create wizard customisations
    // If this configuration is present it will determine the categories and asset types
    // and their order in the create wizard.
    // WARNING: specifying anything here will replace any defaults.
    // Populate as per "var AssetWizardCategoryData" at the top of /ees/Libs/Wizards/EasyEditAssetWizardManager.js
    //createWizardCategories: {}, // Specifying anything here will completely replace any defaults

    // [OPTIONAL] Create wizard asset type black lists
    // Remove individual asset types from the wizard
    //createWizardAssetBlackList: ['news_item'],

    // [OPTIONAL] Create wizard category black lists
    // Remove an entire category from the wizard
    //createWizardCategoryBlackList: ['Events','Other'],

    // [OPTIONAL] Enforce workflow approval/rejection log messaging
    // If this option is set to false users will not have to fill out the
    // mandatory workflow log message when approving or rejecting assets on
    // the Workflow screen. By default this option is set to true.
    // mandatoryWorkflowLog: false,

    // [OPTIONAL] - [PLUS only]
    // Array of classes to show as available selections in bodycopy containers
    // 'Text' is the presentation value users will see
    // 'Value' is the class to be applied
    /*
    classSelect: [
        {
            text: "Align Right",
            value: "alignRight"
        },
        {
            text: "Align left",
            value: "alignLeft"
        }
    ],
    */

    // [OPTIONAL] - [PLUS only]
    // Array of paint layouts with name to display and asset id of the layout. This
    // option is used to display a drop down list of layouts available in the nest
    // content division on the contents screen.
    /*
    paintLayouts: [
        {
            id: 123,
            name: "Paint layout number one"
        },
        {
            id: 124,
            name: "Paint layout number two"
        }
    ],
    */

    // [OPTIONAL] - [PLUS only]
    // Viper wysiwyg buttons. This should match the available plugins, the below is an example only.
    /*
    viperButtons: [
        // Speak to Squiz Support about available options.
    ],
    */

    // [OPTIONAL] - [PLUS only]
    // Enable the context switcher UI element (Please enable all JS API context functions and
    // have more than 1 context available)
    // contextsEnabled: true,

    // [OPTIONAL] - [PLUS only]
    // Default standards to use in the HTML Code Sniffer Auditor
    accessibilityStandard: 'WCAG2AA',

    // [OPTIONAL] - [PLUS only]
    // If markdown is enabled setting this value to true will allow the creation of
    // markdown divs in content pages. Requires Markdown to be installed and enabled
    // in the system configuration menu. Check with your system administrator before
    // enabling this.
    markdownEnabled: false,

    // [OPTIONAL]
    // Selects a Google Analytics View to view analytics data through. This enables
    // the "Analytics" screen. Note that URLs must match between Matrix and Google
    // Analytics for this to generate data.
    analyticsViewId: null

}; // End EasyEditConfig.