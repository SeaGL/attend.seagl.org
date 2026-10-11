class ConferenceModule {
    static moduleApiVersion = "^2.0.0";
    static #trustedOrigins = new Set(["https://seagl.org"]);

    constructor(api) {
        this.api = api;
    }

    async load() {
        this.api.customisations.registerShouldShowComponent(this.shouldShowComponent);
        this.api.widgetLifecycle.registerPreloadApprover(this.preapprovePreload);
    }

    preapprovePreload = ({ origin }) => {
        return ConferenceModule.#trustedOrigins.has(origin);
    }

    shouldShowComponent = (component) => {
        if (component === "UIComponent.spaceCreation") return false;

        return true;
    };
}

export default ConferenceModule;
